import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_COOKIES,
  INITIAL_HERO_BANNERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  SERVICEABLE_PINCODES
} from '../data/mockData';
import { isSupabaseConfigured, onAuthStateChange, signOutUser, supabase } from '../lib/supabaseClient';
import {
  fetchCategoriesFromSupabase,
  fetchCookiesFromSupabase,
  fetchHeroBannersFromSupabase,
  fetchCouponsFromSupabase,
  fetchReviewsFromSupabase,
  fetchOrdersFromSupabase,
  placeOrderInSupabase,
  updateCookieStockInSupabase,
  upsertCookieInSupabase,
  deleteCookieFromSupabase,
  upsertReviewInSupabase,
  deleteReviewFromSupabase
} from '../services/supabaseService';
import {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendWelcomeEmail,
  sendKisseCoinsEmail
} from '../services/emailService';

const StoreContext = createContext(undefined);

const STORAGE_KEYS = {
  COOKIES: 'mk_v6_cookies',
  ORDERS: 'mk_v6_orders',
  CART: 'mk_v6_cart',
  USER_INFO: 'mk_v6_user_info',
  USER_PROFILES: 'mk_v6_user_profiles',
  PACKAGING: 'mk_v6_packaging',
  BANNERS: 'mk_v6_banners',
  COUPONS: 'mk_v6_coupons',
  CATEGORIES: 'mk_v6_categories',
  REVIEWS: 'mk_v6_reviews',
  USERS: 'mk_v6_all_users',
  PINCODES: 'mk_v6_pincodes'
};

const getStoredData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    const parsed = JSON.parse(saved);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
};

/* ====================================================================
   INITIAL REGISTERED USERS FOR ADMIN & SYSTEM MANAGEMENT
   ==================================================================== */
const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 98200 98200',
    role: 'customer',
    kisseCoins: 250,
    defaultAddress: 'Flat 402, Sea Crest Apartments, Bandra West, Mumbai - 400050',
    joinDate: '2026-08-01',
    totalSpend: 2450,
    ordersCount: 4
  },
  {
    id: 'usr-2',
    name: 'Priya Mehta',
    email: 'priya.mehta@outlook.com',
    phone: '+91 98111 22334',
    role: 'customer',
    kisseCoins: 420,
    defaultAddress: 'Unit 1204, Supreme Business Park, Hiranandani, Powai, Mumbai - 400076',
    joinDate: '2026-08-03',
    totalSpend: 4180,
    ordersCount: 7
  },
  {
    id: 'usr-3',
    name: 'Kabir Kapoor',
    email: 'kabir.k@gmail.com',
    phone: '+91 99200 11223',
    role: 'customer',
    kisseCoins: 180,
    defaultAddress: 'Bungalow 7, Juhu Tara Road, Juhu, Mumbai - 400049',
    joinDate: '2026-08-05',
    totalSpend: 1890,
    ordersCount: 3
  },
  {
    id: 'usr-4',
    name: 'Aditya Nazare',
    email: 'adityanazare05@gmail.com',
    phone: '+91 98200 98200',
    role: 'customer',
    kisseCoins: 350,
    defaultAddress: 'Flat 801, Ocean View, Worli Sea Face, Mumbai - 400018',
    joinDate: '2026-08-08',
    totalSpend: 3150,
    ordersCount: 5
  },
  {
    id: 'usr-admin',
    name: 'Master Executive Admin',
    email: 'admin@meethikahani.com',
    phone: '+91 98200 98200',
    role: 'admin',
    kisseCoins: 1000,
    defaultAddress: 'Executive Headquarters, Bandra West, Mumbai - 400050',
    joinDate: '2026-07-15',
    totalSpend: 0,
    ordersCount: 0
  }
];

// Initial user profile dictionary for quick lookup and persistence
const INITIAL_USER_PROFILES = {
  'adityanazare05@gmail.com': {
    name: 'Aditya Nazare',
    phone: '+91 98200 98200',
    email: 'adityanazare05@gmail.com',
    role: 'customer',
    kisseCoins: 350,
    defaultAddress: 'Flat 801, Ocean View, Worli Sea Face, Mumbai - 400018',
    addresses: [
      {
        id: 'addr-aditya-1',
        tag: 'HOME',
        isDefault: true,
        flat: 'Flat 801, Ocean View',
        area: 'Worli Sea Face',
        town: 'Worli',
        city: 'Mumbai',
        pincode: '400018'
      },
      {
        id: 'addr-aditya-2',
        tag: 'OFFICE',
        isDefault: false,
        flat: 'Level 14, Maker Chambers IV',
        area: 'Nariman Point',
        town: 'Fort',
        city: 'Mumbai',
        pincode: '400021'
      }
    ]
  }
};

/* ====================================================================
   SELLER CREDENTIALS (Kitchen Portal)
   ==================================================================== */
const SELLER_CREDENTIALS = {
  email: 'kitchen@meethikahani.com',
  password: 'kitchen2026',
  name: 'Master Kitchen Ops',
  role: 'seller'
};

/* ====================================================================
   INITIAL PACKAGING STOCK DATA
   ==================================================================== */
const INITIAL_PACKAGING_STOCK = [
  { id: 'pkg-tin-4', name: 'Box of 4 Tin Caddy', unit: 'pcs', stock: 120, lowThreshold: 20 },
  { id: 'pkg-tin-8', name: 'Box of 8 Tin Caddy', unit: 'pcs', stock: 80, lowThreshold: 15 },
  { id: 'pkg-tin-12', name: 'Box of 12 Tin Caddy', unit: 'pcs', stock: 50, lowThreshold: 10 },
  { id: 'pkg-wax', name: 'Wax Seal Stamps', unit: 'pcs', stock: 200, lowThreshold: 30 },
  { id: 'pkg-ribbon', name: 'Branded Satin Ribbon', unit: 'meters', stock: 150, lowThreshold: 25 },
  { id: 'pkg-mailer', name: 'Thermal Insulated Mailers', unit: 'pcs', stock: 90, lowThreshold: 15 }
];

const getStoredCookies = () => {
  const stored = getStoredData(STORAGE_KEYS.COOKIES, INITIAL_COOKIES);
  if (!Array.isArray(stored) || stored.length === 0) return INITIAL_COOKIES;
  return stored.map(c => {
    let item = { ...c };
    if (item.name && item.name.toLowerCase().includes('chcoalate')) {
      item.name = item.name.replace(/chcoalate/gi, 'Chocolate');
    }
    if (item.slug && item.slug.toLowerCase().includes('chcoalate')) {
      item.slug = item.slug.replace(/chcoalate/gi, 'chocolate');
    }
    const init = INITIAL_COOKIES.find(ic => ic.id === item.id);
    if (init) {
      const isCustomDataUrl = item.photoUrls && item.photoUrls[0] && item.photoUrls[0].startsWith('data:');
      if (!isCustomDataUrl) {
        item.photoUrls = init.photoUrls;
      }
    }
    return item;
  });
};

export const StoreProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => getStoredData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES));
  const [cookies, setCookies] = useState(() => getStoredCookies());
  const [heroBanners, setHeroBanners] = useState(() => getStoredData(STORAGE_KEYS.BANNERS, INITIAL_HERO_BANNERS));
  const [coupons, setCoupons] = useState(() => getStoredData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS));
  const [reviews, setReviews] = useState(() => getStoredData(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS));
  const [allUsers, setAllUsers] = useState(() => getStoredData(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [userProfiles, setUserProfiles] = useState(() => getStoredData(STORAGE_KEYS.USER_PROFILES, INITIAL_USER_PROFILES));
  const [orders, setOrders] = useState(() => getStoredData(STORAGE_KEYS.ORDERS, []));
  const [serviceablePincodes, setServiceablePincodes] = useState(() => getStoredData(STORAGE_KEYS.PINCODES, SERVICEABLE_PINCODES));

  // Packaging stock state for Kitchen Portal
  const [packagingStock, setPackagingStock] = useState(() => getStoredData(STORAGE_KEYS.PACKAGING, INITIAL_PACKAGING_STOCK));

  // Seller authentication state with persistent storage
  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('mk_v6_seller_session') === 'true';
    } catch {
      return false;
    }
  });
  const [sellerInfo, setSellerInfo] = useState(() => getStoredData('mk_v6_seller_info', { name: 'Master Kitchen Ops', role: 'seller', email: 'kitchen@meethikahani.com' }));

  useEffect(() => {
    try {
      localStorage.setItem('mk_v6_seller_session', isSellerLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isSellerLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem('mk_v6_seller_info', JSON.stringify(sellerInfo));
    } catch (e) {
      console.error(e);
    }
  }, [sellerInfo]);

  // Admin authentication state with persistent storage
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('mk_v6_admin_session') === 'true';
    } catch {
      return false;
    }
  });
  const [adminInfo, setAdminInfo] = useState(() => getStoredData('mk_v6_admin_info', { name: 'Master Executive Admin', role: 'admin', email: 'admin@meethikahani.com' }));

  useEffect(() => {
    try {
      localStorage.setItem('mk_v6_admin_session', isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem('mk_v6_admin_info', JSON.stringify(adminInfo));
    } catch (e) {
      console.error(e);
    }
  }, [adminInfo]);

  const [supabaseStatus, setSupabaseStatus] = useState(() => isSupabaseConfigured() ? 'connected' : 'demo');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Auth state — driven by Supabase Auth when configured, or local mock
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState(null); // Supabase auth.user object
  const [isAuthLoading, setIsAuthLoading] = useState(true); // true while checking session on mount

  const [userInfo, setUserInfo] = useState(() => getStoredData(STORAGE_KEYS.USER_INFO, {
    name: '',
    phone: '',
    email: '',
    role: 'customer',
    kisseCoins: 0,
    defaultAddress: ''
  }));

  /* ================================================================
     Supabase Auth — Listen to session changes on mount
     ================================================================ */
  useEffect(() => {
    const initAuth = async () => {
      if (!isSupabaseConfigured()) {
        // Demo mode: use stored user info if available
        const stored = getStoredData(STORAGE_KEYS.USER_INFO, null);
        if (stored && stored.email) {
          setIsLoggedIn(true);
        }
        setIsAuthLoading(false);
        return;
      }

      // Check for existing session on page load
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      setIsAuthLoading(false);
    };

    initAuth();

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setAuthUser(null);
        setUserInfo({ name: '', phone: '', email: '', kisseCoins: 0, defaultAddress: '' });
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  /**
   * Helper to check if an email or user has admin privileges
   */
  const checkIsAdmin = (email) => {
    if (!email) return false;
    const lower = email.toLowerCase().trim();
    return lower.includes('admin') || lower === 'owner@meethikahani.com' || lower === 'admin@meethikahani.com';
  };

  /**
   * Load or create user profile from Supabase profiles table or local userProfiles map
   */
  const loadUserProfile = async (supabaseUser) => {
    setAuthUser(supabaseUser);
    const userEmail = (supabaseUser.email || '').toLowerCase().trim();
    const metaName = supabaseUser.user_metadata?.name || '';
    const isAdmin = checkIsAdmin(userEmail);

    // Check if we have cached or registered user profile
    const existingProfile = userProfiles[userEmail] || allUsers.find(u => u.email?.toLowerCase() === userEmail);

    if (!isSupabaseConfigured() || !supabase) {
      if (existingProfile) {
        setUserInfo({
          name: existingProfile.name || metaName || (isAdmin ? 'Admin User' : 'Valued Customer'),
          phone: existingProfile.phone || '',
          email: userEmail,
          role: isAdmin ? 'admin' : (existingProfile.role || 'customer'),
          kisseCoins: existingProfile.kisseCoins ?? 0,
          defaultAddress: existingProfile.defaultAddress || ''
        });
      } else {
        const initial = {
          name: metaName || (isAdmin ? 'Admin User' : 'Valued Customer'),
          phone: '',
          email: userEmail,
          role: isAdmin ? 'admin' : 'customer',
          kisseCoins: 0,
          defaultAddress: ''
        };
        setUserInfo(initial);
        setUserProfiles(prev => ({ ...prev, [userEmail]: { ...initial, addresses: [] } }));
      }
      setIsLoggedIn(true);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profile) {
        const loadedCoins = profile.kisse_coins ?? (existingProfile?.kisseCoins ?? 0);
        const loadedAddress = profile.default_address || existingProfile?.defaultAddress || '';
        const loadedInfo = {
          name: profile.name || metaName || (isAdmin ? 'Admin User' : existingProfile?.name || ''),
          phone: profile.phone || existingProfile?.phone || '',
          email: userEmail,
          role: isAdmin ? 'admin' : (profile.role || 'customer'),
          kisseCoins: loadedCoins,
          defaultAddress: loadedAddress
        };
        setUserInfo(loadedInfo);
        setUserProfiles(prev => ({
          ...prev,
          [userEmail]: {
            ...loadedInfo,
            addresses: prev[userEmail]?.addresses || existingProfile?.addresses || (loadedAddress ? [{ id: `addr-${Date.now()}`, tag: 'HOME', isDefault: true, flat: loadedAddress, area: '', town: 'Mumbai', city: 'Mumbai', pincode: '400050' }] : [])
          }
        }));
        setIsLoggedIn(true);
      } else {
        const initialName = metaName || (isAdmin ? 'Admin User' : existingProfile?.name || '');
        const initialCoins = existingProfile?.kisseCoins ?? 0;
        const initialAddress = existingProfile?.defaultAddress || '';
        const initialInfo = {
          name: initialName,
          phone: existingProfile?.phone || '',
          email: userEmail,
          role: isAdmin ? 'admin' : 'customer',
          kisseCoins: initialCoins,
          defaultAddress: initialAddress
        };
        setUserInfo(initialInfo);
        setUserProfiles(prev => ({
          ...prev,
          [userEmail]: {
            ...initialInfo,
            addresses: prev[userEmail]?.addresses || existingProfile?.addresses || []
          }
        }));
        setIsLoggedIn(true);

        // Auto create profile row in Supabase
        supabase.from('profiles').upsert({
          id: supabaseUser.id,
          name: initialName,
          email: userEmail,
          role: isAdmin ? 'admin' : 'customer',
          kisse_coins: initialCoins,
          default_address: initialAddress,
          updated_at: new Date().toISOString()
        }).then(() => {}).catch(err => console.warn('Could not auto-create profile:', err));
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setIsLoggedIn(true);
    }
  };

  /**
   * Called after email OTP verification when user completes their profile for first time
   */
  const completeUserProfile = async ({ name, phone, defaultAddress }) => {
    const userEmail = (userInfo.email || '').toLowerCase().trim();
    const updatedInfo = {
      ...userInfo,
      name: name || userInfo.name,
      phone: phone || userInfo.phone,
      defaultAddress: defaultAddress || userInfo.defaultAddress
    };
    setUserInfo(updatedInfo);

    if (userEmail) {
      setUserProfiles(prev => {
        const cur = prev[userEmail] || {};
        let updatedAddresses = cur.addresses || [];
        if (updatedInfo.defaultAddress && !updatedAddresses.some(a => a.flat === updatedInfo.defaultAddress)) {
          updatedAddresses = [{
            id: `addr-${Date.now()}`,
            tag: 'HOME',
            isDefault: true,
            flat: updatedInfo.defaultAddress,
            area: '',
            town: 'Mumbai',
            city: 'Mumbai',
            pincode: '400050'
          }, ...updatedAddresses.map(a => ({ ...a, isDefault: false }))];
        }
        return {
          ...prev,
          [userEmail]: {
            ...cur,
            ...updatedInfo,
            addresses: updatedAddresses
          }
        };
      });
    }

    // Save profile to Supabase
    if (isSupabaseConfigured() && authUser) {
      const { error } = await supabase.from('profiles').upsert({
        id: authUser.id,
        name: updatedInfo.name,
        phone: updatedInfo.phone,
        email: updatedInfo.email,
        kisse_coins: updatedInfo.kisseCoins,
        default_address: updatedInfo.defaultAddress,
        updated_at: new Date().toISOString()
      });
      if (error) console.error('Error saving profile:', error);
    }

    // Send welcome email for brand new users
    if (!userInfo.phone && updatedInfo.email) {
      sendWelcomeEmail({ name: updatedInfo.name, email: updatedInfo.email });
    }
  };

  /**
   * Universal customer authentication (Sign In vs Sign Up)
   */
  const loginUser = ({ name, phone, email, role = 'customer', isSignUp = false }) => {
    const userEmail = (email || '').toLowerCase().trim();

    if (isSignUp) {
      // Brand new customer signup: start with strictly 0 coins, 0 addresses, 0 orders
      const cleanName = name || 'Valued Customer';
      const newCustomerInfo = {
        name: cleanName,
        phone: phone || '',
        email: userEmail,
        role: 'customer',
        kisseCoins: 0,
        defaultAddress: ''
      };

      setUserInfo(newCustomerInfo);
      setIsLoggedIn(true);

      setUserProfiles(prev => ({
        ...prev,
        [userEmail]: {
          ...newCustomerInfo,
          addresses: []
        }
      }));

      // Clear any prior mock orders for this email so they start with 0 orders
      setOrders(prev => prev.filter(o => {
        const oEmail = (o.email || o.customerEmail || '').toLowerCase().trim();
        return oEmail !== userEmail;
      }));

      return newCustomerInfo;
    }

    // Sign In: look up existing profile or initial seed
    const existing = userProfiles[userEmail] || allUsers.find(u => u.email?.toLowerCase() === userEmail);
    let resolvedCoins = 0;
    let resolvedAddress = '';
    let resolvedName = name || 'Valued Customer';
    let resolvedPhone = phone || '';
    let resolvedAddresses = [];

    if (userEmail === 'adityanazare05@gmail.com') {
      // Seed/preserved profile for Aditya's sign-in
      resolvedCoins = existing?.kisseCoins ?? 350;
      resolvedAddress = existing?.defaultAddress || 'Flat 801, Ocean View, Worli Sea Face, Mumbai - 400018';
      resolvedName = existing?.name || name || 'Aditya Nazare';
      resolvedPhone = existing?.phone || phone || '+91 98200 98200';
      resolvedAddresses = existing?.addresses || [
        {
          id: 'addr-aditya-1',
          tag: 'HOME',
          isDefault: true,
          flat: 'Flat 801, Ocean View',
          area: 'Worli Sea Face',
          town: 'Worli',
          city: 'Mumbai',
          pincode: '400018'
        }
      ];
    } else if (existing) {
      // Returning customer: retrieve their previously stored data
      resolvedCoins = existing.kisseCoins ?? 0;
      resolvedAddress = existing.defaultAddress || '';
      resolvedName = existing.name || name || 'Valued Customer';
      resolvedPhone = existing.phone || phone || '';
      resolvedAddresses = existing.addresses || [];
    } else {
      // Any other customer signing in: start completely blank
      resolvedCoins = 0;
      resolvedAddress = '';
      resolvedName = name || 'Valued Customer';
      resolvedPhone = phone || '';
      resolvedAddresses = [];
    }

    const info = {
      name: resolvedName,
      phone: resolvedPhone,
      email: userEmail,
      role: 'customer',
      kisseCoins: resolvedCoins,
      defaultAddress: resolvedAddress
    };

    setUserInfo(info);
    setIsLoggedIn(true);

    setUserProfiles(prev => ({
      ...prev,
      [userEmail]: {
        ...info,
        addresses: resolvedAddresses
      }
    }));

    return info;
  };

  /**
   * Sign out — uses Supabase Auth when configured, else local clear
   */
  const logoutUser = async () => {
    if (isSupabaseConfigured()) {
      await signOutUser();
    }
    setIsLoggedIn(false);
    setAuthUser(null);
    setUserInfo({ name: '', phone: '', email: '', role: 'customer', kisseCoins: 0, defaultAddress: '' });
  };

  /* ================================================================
     SELLER / KITCHEN AUTHENTICATION
     ================================================================ */
  const loginSeller = ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    if (
      (cleanEmail === SELLER_CREDENTIALS.email || cleanEmail === 'kitchen' || cleanEmail.includes('kitchen') || cleanEmail.includes('seller') || cleanEmail.includes('admin')) &&
      (!cleanPass || cleanPass === SELLER_CREDENTIALS.password || cleanPass.length >= 4)
    ) {
      const info = { name: SELLER_CREDENTIALS.name, role: 'seller', email: cleanEmail || SELLER_CREDENTIALS.email };
      setIsSellerLoggedIn(true);
      setSellerInfo(info);
      return { success: true };
    }
    return { success: false, error: 'Invalid kitchen credentials. Default: kitchen@meethikahani.com / kitchen2026' };
  };

  const logoutSeller = () => {
    setIsSellerLoggedIn(false);
    setSellerInfo({ name: '', role: '' });
    try {
      localStorage.removeItem('mk_v6_seller_session');
      localStorage.removeItem('mk_v6_seller_info');
    } catch (e) {
      console.error(e);
    }
  };

  /* ================================================================
     ADMIN AUTHENTICATION (Dedicated Admin HQ session)
     ================================================================ */
  const loginAdmin = ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    if (
      (cleanEmail === 'admin@meethikahani.com' || cleanEmail.includes('admin') || cleanEmail === 'owner@meethikahani.com') &&
      (!cleanPass || cleanPass === 'admin2026' || cleanPass.length >= 4)
    ) {
      const info = { name: 'Master Executive Admin', role: 'admin', email: cleanEmail || 'admin@meethikahani.com' };
      setIsAdminLoggedIn(true);
      setAdminInfo(info);
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials. Default: admin@meethikahani.com / admin2026' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminInfo({ name: '', role: '' });
    try {
      localStorage.removeItem('mk_v6_admin_session');
      localStorage.removeItem('mk_v6_admin_info');
    } catch (e) {
      console.error(e);
    }
  };

  /* ================================================================
     USER ADDRESS MANAGEMENT (Per-user persistent addresses)
     ================================================================ */
  const userEmailKey = (userInfo.email || '').toLowerCase().trim();
  const savedAddresses = (userProfiles[userEmailKey]?.addresses) || (userInfo.defaultAddress ? [
    {
      id: 'addr-default',
      tag: 'HOME',
      isDefault: true,
      flat: userInfo.defaultAddress,
      area: '',
      town: 'Mumbai',
      city: 'Mumbai',
      pincode: '400050'
    }
  ] : []);

  const addSavedAddress = (addressObj) => {
    if (!userEmailKey) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      tag: addressObj.tag || 'HOME',
      isDefault: addressObj.isDefault ?? (savedAddresses.length === 0),
      flat: addressObj.flat || '',
      area: addressObj.area || '',
      town: addressObj.town || 'Mumbai',
      city: addressObj.city || 'Mumbai',
      pincode: addressObj.pincode || '400050'
    };

    setUserProfiles(prev => {
      const cur = prev[userEmailKey] || { ...userInfo, addresses: [] };
      let list = cur.addresses || [];
      if (newAddr.isDefault) {
        list = list.map(a => ({ ...a, isDefault: false }));
      }
      const updatedList = [newAddr, ...list];
      return {
        ...prev,
        [userEmailKey]: {
          ...cur,
          defaultAddress: newAddr.isDefault ? `${newAddr.flat}, ${newAddr.area}, ${newAddr.town}, ${newAddr.city} - ${newAddr.pincode}` : cur.defaultAddress,
          addresses: updatedList
        }
      };
    });

    if (newAddr.isDefault) {
      const fullAddr = `${newAddr.flat}, ${newAddr.area}, ${newAddr.town}, ${newAddr.city} - ${newAddr.pincode}`;
      setUserInfo(prev => ({ ...prev, defaultAddress: fullAddr }));
    }
  };

  const deleteSavedAddress = (addressId) => {
    if (!userEmailKey) return;
    setUserProfiles(prev => {
      const cur = prev[userEmailKey] || { ...userInfo, addresses: [] };
      const updatedList = (cur.addresses || []).filter(a => a.id !== addressId);
      return {
        ...prev,
        [userEmailKey]: {
          ...cur,
          addresses: updatedList
        }
      };
    });
  };

  const setDefaultSavedAddress = (addressId) => {
    if (!userEmailKey) return;
    let newDefaultStr = '';
    setUserProfiles(prev => {
      const cur = prev[userEmailKey] || { ...userInfo, addresses: [] };
      const updatedList = (cur.addresses || []).map(a => {
        if (a.id === addressId) {
          newDefaultStr = `${a.flat}, ${a.area}, ${a.town}, ${a.city} - ${a.pincode}`.replace(/,\s*,/g, ',');
          return { ...a, isDefault: true };
        }
        return { ...a, isDefault: false };
      });
      return {
        ...prev,
        [userEmailKey]: {
          ...cur,
          defaultAddress: newDefaultStr || cur.defaultAddress,
          addresses: updatedList
        }
      };
    });

    if (newDefaultStr) {
      setUserInfo(prev => ({ ...prev, defaultAddress: newDefaultStr }));
    }
  };

  /* ================================================================
     SELLER — ORDER MANAGEMENT (Accept / Reject / Status Update)
     ================================================================ */
  const acceptOrder = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && (o.status === 'PLACED' || !o.status)) {
        const updatedOrder = { ...o, status: 'BAKING' };
        // Send status email
        const customerEmail = o.customerEmail || o.email;
        if (customerEmail) {
          sendOrderStatusEmail({ order: updatedOrder, newStatus: 'BAKING', customerEmail }).catch(console.error);
        }
        return updatedOrder;
      }
      return o;
    }));
  };

  const rejectOrder = (orderId) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'REJECTED' } : o
    ));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedOrder = { ...o, status: newStatus };
        // Send status email notification
        const customerEmail = o.customerEmail || o.email;
        if (customerEmail) {
          sendOrderStatusEmail({ order: updatedOrder, newStatus, customerEmail }).catch(console.error);
        }
        return updatedOrder;
      }
      return o;
    }));
  };

  /* ================================================================
     SELLER — COOKIE RESTOCK
     ================================================================ */
  const restockCookie = (cookieId, qty = 50) => {
    setCookies(prev => prev.map(cookie => {
      if (cookie.id === cookieId) {
        const newStock = cookie.stockPieces + qty;
        updateCookieStockInSupabase(cookieId, newStock);
        return { ...cookie, stockPieces: newStock };
      }
      return cookie;
    }));
  };

  /* ================================================================
     SELLER — PACKAGING STOCK MANAGEMENT
     ================================================================ */
  const updatePackagingStock = (pkgId, delta) => {
    setPackagingStock(prev => prev.map(pkg =>
      pkg.id === pkgId ? { ...pkg, stock: Math.max(0, pkg.stock + delta) } : pkg
    ));
  };

  /* ================================================================
     ADMIN — BANNER CRUD
     ================================================================ */
  const addBanner = (banner) => {
    const newBanner = {
      ...banner,
      id: `banner-${Date.now()}`,
      priority: heroBanners.length + 1,
      isActive: true
    };
    setHeroBanners(prev => [...prev, newBanner]);
  };

  const updateBanner = (bannerId, updates) => {
    setHeroBanners(prev => prev.map(b => b.id === bannerId ? { ...b, ...updates } : b));
  };

  const deleteBanner = (bannerId) => {
    setHeroBanners(prev => prev.filter(b => b.id !== bannerId));
  };

  const toggleBannerActive = (bannerId) => {
    setHeroBanners(prev => prev.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive } : b));
  };

  const reorderBanners = (reorderedBanners) => {
    setHeroBanners(reorderedBanners.map((b, idx) => ({ ...b, priority: idx + 1 })));
  };

  /* ================================================================
     ADMIN — COUPON CRUD
     ================================================================ */
  const addCoupon = (coupon) => {
    const newCoupon = {
      ...coupon,
      id: `coupon-${Date.now()}`,
      usageCount: 0,
      isActive: true
    };
    setCoupons(prev => [...prev, newCoupon]);
  };

  const updateCoupon = (couponId, updates) => {
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, ...updates } : c));
  };

  const deleteCoupon = (couponId) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
  };

  const toggleCouponActive = (couponId) => {
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, isActive: !c.isActive } : c));
  };

  /* ================================================================
     ADMIN — CATEGORY CRUD
     ================================================================ */
  const addCategory = (category) => {
    const newCategory = { ...category, id: `cat-${Date.now()}`, isOnline: true };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (categoryId, updates) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...updates } : c));
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const toggleCategoryOnline = (categoryId) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, isOnline: !c.isOnline } : c));
  };

  /* ================================================================
     ADMIN — COOKIE / SKU CRUD (With Local + Supabase Persistence)
     ================================================================ */
  const addCookie = (cookie) => {
    const generatedSlug = cookie.slug || (cookie.name || 'artisan-cookie').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCookie = {
      ...cookie,
      id: cookie.id || `cookie-${Date.now()}`,
      slug: generatedSlug,
      categoryId: cookie.categoryId || (categories[0]?.id || 'cat-regular'),
      price: Number(cookie.price) || 299,
      stockPieces: Number(cookie.stockPieces) || 50,
      isOnline: cookie.isOnline ?? true,
      badge: cookie.badge || 'Chef Special',
      photoUrls: (cookie.photoUrls && cookie.photoUrls.length > 0) ? cookie.photoUrls : ['/images/saffron-pistachio.png'],
      kahaniText: cookie.kahaniText || 'Handcrafted artisan cookie slow-baked with pure desi ghee.',
      tasteNotes: cookie.tasteNotes || ['🔥 Molten Center', 'Pure Butter Dough'],
      piecesPerBox: cookie.piecesPerBox || 4
    };

    setCookies(prev => {
      const updated = [newCookie, ...prev];
      localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(updated));
      return updated;
    });

    // Sync to Supabase
    upsertCookieInSupabase(newCookie).catch(err => console.warn('Supabase cookie insert note:', err));
    return newCookie;
  };

  const updateCookie = (cookieId, updates) => {
    setCookies(prev => {
      const updated = prev.map(c => {
        if (c.id === cookieId) {
          const merged = { ...c, ...updates };
          upsertCookieInSupabase(merged).catch(console.warn);
          return merged;
        }
        return c;
      });
      localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCookie = (cookieId) => {
    setCookies(prev => {
      const updated = prev.filter(c => c.id !== cookieId);
      localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(updated));
      return updated;
    });
    deleteCookieFromSupabase(cookieId).catch(console.warn);
  };

  const toggleCookieOnline = (cookieId) => {
    setCookies(prev => {
      const updated = prev.map(c => {
        if (c.id === cookieId) {
          const toggled = { ...c, isOnline: c.isOnline === false ? true : false };
          upsertCookieInSupabase(toggled).catch(console.warn);
          return toggled;
        }
        return c;
      });
      localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(updated));
      return updated;
    });
  };

  /* ================================================================
     REVIEWS & CUSTOMER FEEDBACK CRUD
     ================================================================ */
  const addReview = (review) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      customerName: review.customerName || userInfo.name || 'Valued Customer',
      location: review.location || 'Mumbai',
      purchasedItem: review.purchasedItem || 'Artisanal Molten Cookie',
      ratingCookies: Number(review.ratingCookies) || 5,
      reviewText: review.reviewText || 'Absolutely delicious! 100% pure eggless delight.',
      isFeatured: review.isFeatured ?? true,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => {
      const updated = [newRev, ...prev];
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
      return updated;
    });

    upsertReviewInSupabase(newRev).catch(console.warn);
    return newRev;
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => {
      const updated = prev.filter(r => r.id !== reviewId);
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
      return updated;
    });
    deleteReviewFromSupabase(reviewId).catch(console.warn);
  };

  const toggleReviewFeatured = (reviewId) => {
    setReviews(prev => {
      const updated = prev.map(r => {
        if (r.id === reviewId) {
          const toggled = { ...r, isFeatured: !r.isFeatured };
          upsertReviewInSupabase(toggled).catch(console.warn);
          return toggled;
        }
        return r;
      });
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
      return updated;
    });
  };

  /* ================================================================
     USERS & CUSTOMER REGISTRY ACTIONS (Admin & Platform)
     ================================================================ */
  const updateUserCoins = (userId, coinDelta) => {
    setAllUsers(prev => {
      const updated = prev.map(u => {
        if (u.id === userId || u.email === userId) {
          const newCoins = Math.max(0, (u.kisseCoins || 0) + coinDelta);
          return { ...u, kisseCoins: newCoins };
        }
        return u;
      });
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
      return updated;
    });

    // Also update current userInfo if matching
    if (authUser && (authUser.id === userId || userInfo.email === userId)) {
      setUserInfo(prev => ({ ...prev, kisseCoins: Math.max(0, (prev.kisseCoins || 0) + coinDelta) }));
    }
  };

  const addCustomerUser = (user) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: user.name || 'New Customer',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'customer',
      kisseCoins: Number(user.kisseCoins) || 100,
      defaultAddress: user.defaultAddress || '',
      joinDate: new Date().toISOString().substring(0, 10),
      totalSpend: 0,
      ordersCount: 0
    };
    setAllUsers(prev => {
      const updated = [newUser, ...prev];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
      return updated;
    });
    return newUser;
  };

  const deleteCustomerUser = (userId) => {
    setAllUsers(prev => {
      const updated = prev.filter(u => u.id !== userId && u.email !== userId);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
      return updated;
    });
  };

  /* ================================================================
     Supabase Data Sync on Startup (Smart Merge preserves local additions)
     ================================================================ */
  useEffect(() => {
    let isMounted = true;
    const syncSupabaseData = async () => {
      if (!isSupabaseConfigured()) {
        setSupabaseStatus('demo');
        return;
      }
      try {
        const [dbCat, dbCook, dbBan, dbCpn, dbRev, dbOrd] = await Promise.all([
          fetchCategoriesFromSupabase(),
          fetchCookiesFromSupabase(),
          fetchHeroBannersFromSupabase(),
          fetchCouponsFromSupabase(),
          fetchReviewsFromSupabase(),
          fetchOrdersFromSupabase()
        ]);

        if (!isMounted) return;

        if (dbCat && dbCat.length > 0) setCategories(dbCat);

        // Smart merge cookies: keep db cookies and preserve locally added custom cookies
        if (dbCook && dbCook.length > 0) {
          setCookies(prev => {
            const dbIds = new Set(dbCook.map(c => c.id));
            const localCustom = prev.filter(c => !dbIds.has(c.id));
            const upgradedDb = dbCook.map(c => {
              const init = INITIAL_COOKIES.find(ic => ic.id === c.id);
              if (init && c.photoUrls && c.photoUrls[0] && (c.photoUrls[0] === '/images/saffron-pistachio.png' || c.photoUrls[0] === '/images/dark-cocoa.png' || c.photoUrls[0] === '/images/rose-almond.png') && init.photoUrls[0] !== c.photoUrls[0]) {
                return { ...c, photoUrls: init.photoUrls };
              }
              return c;
            });
            const merged = [...upgradedDb, ...localCustom];
            localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(merged));
            return merged;
          });
        }

        if (dbBan && dbBan.length > 0) setHeroBanners(dbBan);
        if (dbCpn && dbCpn.length > 0) setCoupons(dbCpn);

        // Smart merge reviews
        if (dbRev && dbRev.length > 0) {
          setReviews(prev => {
            const dbIds = new Set(dbRev.map(r => r.id));
            const localCustom = prev.filter(r => !dbIds.has(r.id));
            const merged = [...dbRev, ...localCustom];
            localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(merged));
            return merged;
          });
        }

        if (dbOrd && dbOrd.length > 0) setOrders(dbOrd);

        setSupabaseStatus('connected');
      } catch (err) {
        console.warn('Supabase sync error, operating in local mode:', err);
        if (isMounted) setSupabaseStatus('demo');
      }
    };

    syncSupabaseData();
    return () => { isMounted = false; };
  }, []);

  const [cart, setCart] = useState(() => getStoredData(STORAGE_KEYS.CART, []));

  const getInitialRouteState = () => {
    if (typeof window === 'undefined') return { route: '/', slug: null };
    const path = window.location.pathname;
    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '');
      return { route: '/product/:slug', slug };
    }
    const knownRoutes = ['/', '/gifting', '/story', '/admin', '/seller'];
    return { route: knownRoutes.includes(path) ? path : '/', slug: null };
  };

  const initialState = getInitialRouteState();
  const [activeRoute, setActiveRoute] = useState(initialState.route);
  const [selectedProductSlug, setSelectedProductSlug] = useState(initialState.slug);
  const [activeFilterCategory, setActiveFilterCategory] = useState('all');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeKahaniModalCookie, setActiveKahaniModalCookie] = useState(null);

  const resetSiteData = async () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error(e);
    }

    setCookies(INITIAL_COOKIES);
    setCategories(INITIAL_CATEGORIES);
    setHeroBanners(INITIAL_HERO_BANNERS);
    setCoupons(INITIAL_COUPONS);
    setPackagingStock(INITIAL_PACKAGING_STOCK);
    setReviews(INITIAL_REVIEWS);
    setAllUsers(INITIAL_USERS);
    setServiceablePincodes(SERVICEABLE_PINCODES);
    setOrders([]);
    setCart([]);
    await logoutUser();
    setIsCartOpen(false);
    setIsAccountOpen(false);
    navigateTo('/');
  };

  // Persist state to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(cookies)); }, [cookies]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo)); }, [userInfo]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(userProfiles)); }, [userProfiles]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PACKAGING, JSON.stringify(packagingStock)); }, [packagingStock]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(heroBanners)); }, [heroBanners]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PINCODES, JSON.stringify(serviceablePincodes)); }, [serviceablePincodes]);

  const navigateTo = (route, slug = null) => {
    let targetPath = route;
    if (route === '/product/:slug' && slug) {
      targetPath = `/product/${slug}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({ route, slug }, '', targetPath);
    }

    setActiveRoute(route);
    if (slug !== undefined) setSelectedProductSlug(slug);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const parsed = getInitialRouteState();
      setActiveRoute(parsed.route);
      setSelectedProductSlug(parsed.slug);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const addToCart = (cookieItem, qty = 1, openCartDrawer = false, selectedPack = null) => {
    if (!isLoggedIn) {
      setIsAccountOpen(true);
      return false;
    }
    setCart(prevCart => {
      const itemKey = selectedPack ? `${cookieItem.id}-${selectedPack.size}` : cookieItem.id;
      const existingIndex = prevCart.findIndex(item => (item.cartKey ? item.cartKey === itemKey : item.id === cookieItem.id));
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].qty += qty;
        return updated;
      }
      const itemPrice = selectedPack ? selectedPack.price : cookieItem.price;
      const itemName = selectedPack ? `${cookieItem.name} (${selectedPack.label})` : cookieItem.name;
      return [...prevCart, { ...cookieItem, cartKey: itemKey, name: itemName, price: itemPrice, packSize: selectedPack?.size || cookieItem.piecesPerBox, qty }];
    });
    if (openCartDrawer) setIsCartOpen(true);
    return true;
  };

  const updateCartQty = (targetKey, delta) => {
    if (!isLoggedIn) {
      setIsAccountOpen(true);
      return false;
    }
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if ((item.cartKey && item.cartKey === targetKey) || item.id === targetKey) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(item => item !== null);
    });
    return true;
  };

  const removeFromCart = (targetKey) => {
    setCart(prevCart => prevCart.filter(item => (item.cartKey ? item.cartKey !== targetKey : item.id !== targetKey)));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (orderDetails) => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const seq = String(orders.length + 1).padStart(4, '0');
    const newOrderId = `${month}${year}-${seq}`;
    
    // Explicitly prioritize the email typed during checkout as destination
    const custEmail = (orderDetails.email || orderDetails.customerEmail || userInfo.email || '').toLowerCase().trim();
    const custPhone = (orderDetails.phone || userInfo.phone || '').trim();
    const custName = (orderDetails.customerName || userInfo.name || 'Valued Customer').trim();
    const deliveryAddress = (orderDetails.address || userInfo.defaultAddress || 'Mumbai, Maharashtra').trim();

    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName: custName,
      customerEmail: custEmail,
      email: custEmail,
      phone: custPhone,
      address: deliveryAddress,
      orderType: orderDetails.orderType || 'PERSONAL',
      status: 'PLACED',
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty })),
      subtotal: orderDetails.subtotal,
      discount: orderDetails.discount || 0,
      totalAmount: orderDetails.totalAmount,
      paymentMode: orderDetails.paymentMode || 'UPI',
      paymentStatus: 'SUCCESS',
      isPaid: true
    };

    // Decrement stock locally & sync with Supabase
    setCookies(prev => prev.map(cookie => {
      const cartItem = cart.find(ci => ci.id === cookie.id);
      if (cartItem) {
        const updatedStock = Math.max(0, cookie.stockPieces - cartItem.qty);
        updateCookieStockInSupabase(cookie.id, updatedStock);
        return { ...cookie, stockPieces: updatedStock };
      }
      return cookie;
    }));

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);

    // Calculate Kisse coins earned (10% of total order amount)
    const earnedKisse = Math.floor(orderDetails.totalAmount * 0.1);

    // Determine current coins balance for this destination email
    const prevCoinsForEmail = userProfiles[custEmail]?.kisseCoins ?? (allUsers.find(u => u.email?.toLowerCase() === custEmail)?.kisseCoins ?? ((userInfo.email && userInfo.email.toLowerCase() === custEmail) ? (userInfo.kisseCoins || 0) : 0));
    const newKisseTotal = prevCoinsForEmail + earnedKisse;

    // Update active userInfo if current active user matches the checkout email or was a guest session
    setUserInfo(prev => {
      const isCurrentOrGuest = !prev.email || prev.email.toLowerCase() === custEmail;
      if (isCurrentOrGuest) {
        return {
          ...prev,
          name: custName || prev.name,
          email: custEmail,
          phone: custPhone || prev.phone,
          kisseCoins: newKisseTotal,
          defaultAddress: deliveryAddress || prev.defaultAddress
        };
      }
      return prev;
    });

    // Update user profile dictionary for destination email
    if (custEmail) {
      setUserProfiles(prev => {
        const cur = prev[custEmail] || {
          name: custName,
          phone: custPhone,
          email: custEmail,
          role: 'customer',
          kisseCoins: 0,
          defaultAddress: deliveryAddress,
          addresses: []
        };
        let addrs = cur.addresses || [];
        if (deliveryAddress && !addrs.some(a => a.flat === deliveryAddress)) {
          addrs = [
            {
              id: `addr-${Date.now()}`,
              tag: 'HOME',
              isDefault: true,
              flat: deliveryAddress,
              area: '',
              town: 'Mumbai',
              city: 'Mumbai',
              pincode: '400050'
            },
            ...addrs.map(a => ({ ...a, isDefault: false }))
          ];
        }
        return {
          ...prev,
          [custEmail]: {
            ...cur,
            name: custName || cur.name,
            phone: custPhone || cur.phone,
            email: custEmail,
            kisseCoins: newKisseTotal,
            defaultAddress: deliveryAddress,
            addresses: addrs
          }
        };
      });

      // Sync Customer in allUsers for Admin & lookup
      setAllUsers(prev => {
        const exists = prev.find(u => u.email?.toLowerCase() === custEmail);
        if (exists) {
          return prev.map(u => u.email?.toLowerCase() === custEmail
            ? {
                ...u,
                name: custName || u.name,
                phone: custPhone || u.phone,
                kisseCoins: newKisseTotal,
                defaultAddress: deliveryAddress || u.defaultAddress,
                totalSpend: (u.totalSpend || 0) + orderDetails.totalAmount,
                ordersCount: (u.ordersCount || 0) + 1
              }
            : u
          );
        } else {
          return [{
            id: `usr-${Date.now()}`,
            name: custName,
            email: custEmail,
            phone: custPhone,
            role: 'customer',
            kisseCoins: newKisseTotal,
            defaultAddress: deliveryAddress,
            joinDate: new Date().toISOString().substring(0, 10),
            totalSpend: orderDetails.totalAmount,
            ordersCount: 1
          }, ...prev];
        }
      });

      // Update Supabase profile coins if available
      if (supabase && isSupabaseConfigured()) {
        supabase.from('profiles')
          .update({ kisse_coins: newKisseTotal, default_address: deliveryAddress })
          .eq('email', custEmail)
          .then(() => {})
          .catch(err => console.warn('[StoreContext] Could not update profile coins in Supabase:', err));
      }
    }

    // Persist to Supabase
    placeOrderInSupabase(newOrder);

    // Transactional emails - Dispatched immediately to destination email typed during checkout
    if (custEmail) {
      console.log(`[StoreContext] 🚀 Dispatching Order Confirmation Email to destination email: ${custEmail}`);
      sendOrderConfirmationEmail({ order: newOrder, customerEmail: custEmail })
        .then(res => console.log('[StoreContext] ✅ Order Confirmation email sent to:', custEmail, res))
        .catch(err => console.error('[StoreContext] ❌ Order Confirmation email error:', err));

      if (earnedKisse > 0) {
        console.log(`[StoreContext] 🚀 Dispatching Kisse Coins (${earnedKisse} Coins, Total: ${newKisseTotal}) to destination email: ${custEmail}`);
        sendKisseCoinsEmail({
          customerEmail: custEmail,
          name: custName,
          coinsEarned: earnedKisse,
          totalCoins: newKisseTotal,
          orderId: newOrderId
        })
        .then(res => console.log('[StoreContext] ✅ Kisse Coins email sent to:', custEmail, res))
        .catch(err => console.error('[StoreContext] ❌ Kisse Coins email error:', err));
      }
    }

    return newOrder;
  };

  const removeLatestOrder = () => {
    setOrders(prev => {
      if (prev.length === 0) return prev;
      return prev.slice(1);
    });
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  /* ================================================================
     SERVICEABLE PINCODES MANAGEMENT (Add & Delete Deliverable Zones)
     ================================================================ */
  const addPincode = (pincodeInput) => {
    const cleanPin = String(pincodeInput || '').trim();
    if (!cleanPin) {
      return { success: false, error: 'Please enter a 6-digit pincode.' };
    }
    if (!/^\d{6}$/.test(cleanPin)) {
      return { success: false, error: 'Pincode must be exactly 6 digits (e.g. 400050).' };
    }
    if (serviceablePincodes.includes(cleanPin)) {
      return { success: false, error: `Pincode ${cleanPin} is already in the deliverable list.` };
    }
    setServiceablePincodes(prev => [cleanPin, ...prev]);
    return { success: true, message: `Pincode ${cleanPin} added to serviceable zones.` };
  };

  const deletePincode = (pinToDelete) => {
    const cleanPin = String(pinToDelete || '').trim();
    setServiceablePincodes(prev => prev.filter(p => p !== cleanPin));
    return { success: true, message: `Pincode ${cleanPin} removed.` };
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <StoreContext.Provider value={{
      // Data
      categories,
      cookies,
      heroBanners,
      coupons,
      reviews,
      allUsers,
      userProfiles,
      orders,
      cart,
      serviceablePincodes,
      setServiceablePincodes,
      addPincode,
      deletePincode,
      userInfo,
      packagingStock,

      // User Address Management
      savedAddresses,
      addSavedAddress,
      deleteSavedAddress,
      setDefaultSavedAddress,

      // Auth
      isLoggedIn,
      isAuthLoading,
      authUser,
      loginUser,
      logoutUser,
      completeUserProfile,

      // Seller Auth
      isSellerLoggedIn,
      sellerInfo,
      loginSeller,
      logoutSeller,

      // Admin Auth
      isAdminLoggedIn,
      adminInfo,
      loginAdmin,
      logoutAdmin,

      // Navigation & UI
      activeRoute,
      selectedProductSlug,
      activeFilterCategory,
      setActiveFilterCategory,
      navigateTo,
      isCartOpen,
      setIsCartOpen,
      isAccountOpen,
      setIsAccountOpen,
      isDrawerOpen,
      setIsDrawerOpen,
      activeKahaniModalCookie,
      setActiveKahaniModalCookie,

      // Cart
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      cartSubtotal,
      cartCount,

      // Orders
      placeOrder,
      removeLatestOrder,
      cancelOrder,
      setOrders,
      acceptOrder,
      rejectOrder,
      updateOrderStatus,

      // Seller — Restock & Packaging
      restockCookie,
      updatePackagingStock,

      // Admin — Banner CRUD
      addBanner,
      updateBanner,
      deleteBanner,
      toggleBannerActive,
      reorderBanners,
      setHeroBanners,

      // Admin — Coupon CRUD
      addCoupon,
      updateCoupon,
      deleteCoupon,
      toggleCouponActive,
      setCoupons,

      // Admin — Category CRUD
      addCategory,
      updateCategory,
      deleteCategory,
      toggleCategoryOnline,
      setCategories,

      // Admin — Cookie / SKU CRUD
      addCookie,
      updateCookie,
      deleteCookie,
      toggleCookieOnline,
      setCookies,

      // Reviews & Feedback
      addReview,
      deleteReview,
      toggleReviewFeatured,
      setReviews,

      // Users Management
      setAllUsers,
      updateUserCoins,
      addCustomerUser,
      deleteCustomerUser,

      // Misc
      setUserInfo,
      resetSiteData,
      supabaseStatus,
      isSupabaseModalOpen,
      setIsSupabaseModalOpen
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};

