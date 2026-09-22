import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  INITIAL_CATEGORIES,
  INITIAL_COOKIES,
  INITIAL_HERO_BANNERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  SERVICEABLE_PINCODES
} from '../data/mockData';

/**
 * Helper to map DB snake_case columns to JS camelCase properties if needed
 */
const mapCookieFromDB = (dbRow) => {
  if (!dbRow) return null;
  return {
    id: dbRow.id,
    categoryId: dbRow.category_id,
    name: dbRow.name,
    slug: dbRow.slug,
    price: Number(dbRow.price),
    stockPieces: Number(dbRow.stock_pieces),
    isOnline: Boolean(dbRow.is_online),
    photoUrls: Array.isArray(dbRow.photo_urls) ? dbRow.photo_urls : JSON.parse(dbRow.photo_urls || '[]'),
    kahaniText: dbRow.kahani_text,
    tasteNotes: Array.isArray(dbRow.taste_notes) ? dbRow.taste_notes : JSON.parse(dbRow.taste_notes || '[]'),
    provenance: dbRow.provenance,
    piecesPerBox: dbRow.pieces_per_box || 4,
    nutrition: typeof dbRow.nutrition === 'object' ? dbRow.nutrition : JSON.parse(dbRow.nutrition || '{}')
  };
};

const mapCookieToDB = (cookie) => {
  return {
    id: cookie.id,
    category_id: cookie.categoryId,
    name: cookie.name,
    slug: cookie.slug,
    price: cookie.price,
    stock_pieces: cookie.stockPieces,
    is_online: cookie.isOnline,
    photo_urls: cookie.photoUrls,
    kahani_text: cookie.kahaniText,
    taste_notes: cookie.tasteNotes,
    provenance: cookie.provenance,
    pieces_per_box: cookie.piecesPerBox,
    nutrition: cookie.nutrition
  };
};

const mapOrderFromDB = (row) => ({
  id: row.id,
  date: row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 16) : row.date,
  customerName: row.customer_name,
  phone: row.phone,
  address: row.address,
  orderType: row.order_type,
  status: row.status,
  items: Array.isArray(row.items) ? row.items : JSON.parse(row.items || '[]'),
  subtotal: Number(row.subtotal),
  discount: Number(row.discount || 0),
  totalAmount: Number(row.total_amount),
  paymentMode: row.payment_mode,
  paymentStatus: row.payment_status,
  isPaid: Boolean(row.is_paid)
});

/* ====================================================================
   READ OPERATIONS
   ==================================================================== */

export const fetchCategoriesFromSupabase = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) return null;
    return data.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      isOnline: Boolean(c.is_online)
    }));
  } catch (e) {
    console.error('Error fetching categories from Supabase:', e);
    return null;
  }
};

export const fetchCookiesFromSupabase = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('cookies')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) return null;
    return data.map(mapCookieFromDB);
  } catch (e) {
    console.error('Error fetching cookies from Supabase:', e);
    return null;
  }
};

export const fetchHeroBannersFromSupabase = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('priority');

    if (error || !data || data.length === 0) return null;
    return data.map(b => ({
      id: b.id,
      headline: b.headline,
      subtitle: b.subtitle,
      imageDesktop: b.image_desktop,
      ctaLink: b.cta_link,
      priority: b.priority,
      isActive: Boolean(b.is_active)
    }));
  } catch (e) {
    console.error('Error fetching hero banners from Supabase:', e);
    return null;
  }
};

export const fetchCouponsFromSupabase = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*');

    if (error || !data || data.length === 0) return null;
    return data.map(c => ({
      id: c.id,
      code: c.code,
      type: c.type,
      value: Number(c.value),
      minOrder: Number(c.min_order),
      isActive: Boolean(c.is_active),
      description: c.description
    }));
  } catch (e) {
    console.error('Error fetching coupons from Supabase:', e);
    return null;
  }
};

export const fetchReviewsFromSupabase = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;
    return data.map(r => ({
      id: r.id,
      customerName: r.customer_name,
      location: r.location,
      purchasedItem: r.purchased_item,
      ratingCookies: Number(r.rating_cookies),
      reviewText: r.review_text,
      isFeatured: Boolean(r.is_featured)
    }));
  } catch (e) {
    console.error('Error fetching reviews from Supabase:', e);
    return null;
  }
};

export const fetchOrdersFromSupabase = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data.map(mapOrderFromDB);
  } catch (e) {
    console.error('Error fetching orders from Supabase:', e);
    return null;
  }
};

/* ====================================================================
   WRITE / MUTATION OPERATIONS
   ==================================================================== */

export const placeOrderInSupabase = async (order) => {
  if (!isSupabaseConfigured()) return null;
  try {
    const payload = {
      id: order.id,
      customer_name: order.customerName,
      phone: order.phone,
      address: order.address,
      order_type: order.orderType,
      status: order.status || 'PLACED',
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount || 0,
      total_amount: order.totalAmount,
      payment_mode: order.paymentMode || 'UPI',
      payment_status: order.paymentStatus || 'SUCCESS',
      is_paid: order.isPaid ?? true
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error inserting order into Supabase:', error);
      return null;
    }
    return mapOrderFromDB(data);
  } catch (e) {
    console.error('Error placing order in Supabase:', e);
    return null;
  }
};

export const updateCookieStockInSupabase = async (cookieId, newStock) => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('cookies')
      .update({ stock_pieces: Math.max(0, newStock) })
      .eq('id', cookieId);

    if (error) {
      console.error('Error updating stock in Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error updating stock in Supabase:', e);
    return false;
  }
};

export const updateOrderStatusInSupabase = async (orderId, newStatus) => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    return !error;
  } catch (e) {
    console.error('Error updating order status in Supabase:', e);
    return false;
  }
};

export const upsertCookieInSupabase = async (cookie) => {
  if (!isSupabaseConfigured()) return null;
  try {
    const payload = mapCookieToDB(cookie);
    const { data, error } = await supabase
      .from('cookies')
      .upsert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error upserting cookie in Supabase:', error);
      return null;
    }
    return mapCookieFromDB(data);
  } catch (e) {
    console.error('Error upserting cookie in Supabase:', e);
    return null;
  }
};

export const deleteCookieFromSupabase = async (cookieId) => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('cookies')
      .delete()
      .eq('id', cookieId);

    return !error;
  } catch (e) {
    console.error('Error deleting cookie from Supabase:', e);
    return false;
  }
};

export const upsertReviewInSupabase = async (review) => {
  if (!isSupabaseConfigured()) return null;
  try {
    const payload = {
      id: review.id,
      customer_name: review.customerName,
      location: review.location || 'Mumbai',
      purchased_item: review.purchasedItem || 'Artisanal Cookie',
      rating_cookies: review.ratingCookies || 5,
      review_text: review.reviewText,
      is_featured: review.isFeatured ?? true
    };
    const { data, error } = await supabase
      .from('reviews')
      .upsert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error upserting review in Supabase:', error);
      return null;
    }
    return {
      id: data.id,
      customerName: data.customer_name,
      location: data.location,
      purchasedItem: data.purchased_item,
      ratingCookies: Number(data.rating_cookies),
      reviewText: data.review_text,
      isFeatured: Boolean(data.is_featured)
    };
  } catch (e) {
    console.error('Error upserting review in Supabase:', e);
    return null;
  }
};

export const deleteReviewFromSupabase = async (reviewId) => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    return !error;
  } catch (e) {
    console.error('Error deleting review from Supabase:', e);
    return false;
  }
};

/* ====================================================================
   AUTOMATED 1-CLICK SEEDING FUNCTION
   Populates empty Supabase tables directly from local mock data
   ==================================================================== */

export const seedDatabaseToSupabase = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured yet. Please enter valid URL & Anon Key first.');
  }

  const results = {
    categories: 0,
    cookies: 0,
    heroBanners: 0,
    coupons: 0,
    reviews: 0,
    pincodes: 0
  };

  // 1. Seed Categories
  const dbCategories = INITIAL_CATEGORIES.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    is_online: c.isOnline
  }));
  const { data: catData } = await supabase.from('categories').upsert(dbCategories).select();
  results.categories = catData ? catData.length : INITIAL_CATEGORIES.length;

  // 2. Seed Cookies
  const dbCookies = INITIAL_COOKIES.map(mapCookieToDB);
  const { data: cookData } = await supabase.from('cookies').upsert(dbCookies).select();
  results.cookies = cookData ? cookData.length : INITIAL_COOKIES.length;

  // 3. Seed Hero Banners
  const dbBanners = INITIAL_HERO_BANNERS.map(b => ({
    id: b.id,
    headline: b.headline,
    subtitle: b.subtitle,
    image_desktop: b.imageDesktop,
    cta_link: b.ctaLink,
    priority: b.priority,
    is_active: b.isActive
  }));
  const { data: banData } = await supabase.from('hero_banners').upsert(dbBanners).select();
  results.heroBanners = banData ? banData.length : INITIAL_HERO_BANNERS.length;

  // 4. Seed Coupons
  const dbCoupons = INITIAL_COUPONS.map(c => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    min_order: c.minOrder,
    is_active: c.isActive,
    description: c.description
  }));
  const { data: cpnData } = await supabase.from('coupons').upsert(dbCoupons).select();
  results.coupons = cpnData ? cpnData.length : INITIAL_COUPONS.length;

  // 5. Seed Reviews
  const dbReviews = INITIAL_REVIEWS.map(r => ({
    id: r.id,
    customer_name: r.customerName,
    location: r.location,
    purchased_item: r.purchasedItem,
    rating_cookies: r.ratingCookies,
    review_text: r.reviewText,
    is_featured: r.isFeatured
  }));
  const { data: revData } = await supabase.from('reviews').upsert(dbReviews).select();
  results.reviews = revData ? revData.length : INITIAL_REVIEWS.length;

  // 6. Seed Pincodes
  const dbPincodes = SERVICEABLE_PINCODES.map(p => ({
    pincode: p,
    city_name: 'Mumbai',
    delivery_tier: '1-Day Express',
    is_active: true
  }));
  const { data: pinData } = await supabase.from('serviceable_pincodes').upsert(dbPincodes).select();
  results.pincodes = pinData ? pinData.length : SERVICEABLE_PINCODES.length;

  return results;
};
