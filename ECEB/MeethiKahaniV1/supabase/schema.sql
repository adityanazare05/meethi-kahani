-- ====================================================================
-- MEETHI KAHANI - COMPLETE SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
-- Run this script inside the Supabase SQL Editor (https://app.supabase.com)
-- ====================================================================

-- Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_online BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. COOKIES (PRODUCTS) TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cookies (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC NOT NULL,
  stock_pieces INTEGER NOT NULL DEFAULT 0,
  is_online BOOLEAN DEFAULT true,
  photo_urls JSONB DEFAULT '[]'::jsonb,
  kahani_text TEXT,
  taste_notes JSONB DEFAULT '[]'::jsonb,
  provenance TEXT,
  pieces_per_box INTEGER DEFAULT 4,
  nutrition JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. HERO BANNERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id TEXT PRIMARY KEY,
  headline TEXT NOT NULL,
  subtitle TEXT,
  image_desktop TEXT NOT NULL,
  cta_link TEXT DEFAULT '#catalog',
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. COUPONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('PERCENT', 'FLAT')),
  value NUMERIC NOT NULL,
  min_order NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. REVIEWS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  location TEXT,
  purchased_item TEXT,
  rating_cookies INTEGER DEFAULT 5,
  review_text TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. SERVICEABLE PINCODES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.serviceable_pincodes (
  pincode TEXT PRIMARY KEY,
  city_name TEXT DEFAULT 'Mumbai',
  delivery_tier TEXT DEFAULT '1-Day Express',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. ORDERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  order_type TEXT DEFAULT 'PERSONAL',
  status TEXT DEFAULT 'PLACED',
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_mode TEXT DEFAULT 'UPI',
  payment_status TEXT DEFAULT 'SUCCESS',
  is_paid BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. CUSTOMER PROFILES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  kisse_coins INTEGER DEFAULT 100,
  default_address TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enabling public read & write access for ecommerce storefront demo
-- ====================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serviceable_pincodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create public access policies
CREATE POLICY "Allow public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public write access for categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Allow public read access for cookies" ON public.cookies FOR SELECT USING (true);
CREATE POLICY "Allow public write access for cookies" ON public.cookies FOR ALL USING (true);

CREATE POLICY "Allow public read access for hero_banners" ON public.hero_banners FOR SELECT USING (true);
CREATE POLICY "Allow public write access for hero_banners" ON public.hero_banners FOR ALL USING (true);

CREATE POLICY "Allow public read access for coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Allow public write access for coupons" ON public.coupons FOR ALL USING (true);

CREATE POLICY "Allow public read access for reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public write access for reviews" ON public.reviews FOR ALL USING (true);

CREATE POLICY "Allow public read access for pincodes" ON public.serviceable_pincodes FOR SELECT USING (true);
CREATE POLICY "Allow public write access for pincodes" ON public.serviceable_pincodes FOR ALL USING (true);

CREATE POLICY "Allow public read access for orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access for orders" ON public.orders FOR ALL USING (true);

CREATE POLICY "Allow public read access for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public write access for profiles" ON public.profiles FOR ALL USING (true);

-- ====================================================================
-- INITIAL SEED DATA
-- Populate default tables with Meethi Kahani artisanal bakery dataset
-- ====================================================================

-- Categories Seed Data
INSERT INTO public.categories (id, name, slug, is_online) VALUES
  ('cat-regular', 'Regular Luxury', 'regular-luxury', true),
  ('cat-protein', 'High-Protein Oats', 'protein-oats', true),
  ('cat-sugarfree', 'Sugar-Free Series', 'sugar-free', true)
ON CONFLICT (id) DO NOTHING;

-- Cookies Seed Data
INSERT INTO public.cookies (id, category_id, name, slug, price, stock_pieces, is_online, photo_urls, kahani_text, taste_notes, provenance, pieces_per_box, nutrition) VALUES
  ('cookie-1', 'cat-regular', 'Royal Saffron Pistachio Molten Melt Cookie', 'saffron-pistachio-molten-cookie', 349, 45, true, '["/images/saffron-pistachio.png"]'::jsonb, 'Handcrafted with Kashmiri saffron strands and roasted Iranian pistachios, featuring a warm, oozy saffron-white chocolate molten core inside.', '["🔥 Molten Saffron Core", "Roasted Pistachio Crunch", "Pure Butter Base"]'::jsonb, 'Pampore, Kashmir & Kerman, Iran', 4, '{"servingWeight": "35 g", "energy": "168.4 Kcal", "protein": "4.5 g", "fat": "11.2 g", "sugar": "4.8 g"}'::jsonb),
  ('cookie-2', 'cat-regular', 'Belgian Dark Chocolate Lava Melt Cookie', 'dark-cocoa-lava-cookie', 299, 60, true, '["/images/dark-cocoa.png"]'::jsonb, '70% single-origin dark Belgian chocolate dough with a rich, warm molten chocolate lava center that oozes on the very first bite.', '["🔥 70% Dark Molten Lava", "Rich Cocoa Dough", "Salted Butter Hint"]'::jsonb, 'Flanders, Belgium', 4, '{"servingWeight": "35 g", "energy": "175.0 Kcal", "protein": "3.8 g", "fat": "12.6 g", "sugar": "5.2 g"}'::jsonb),
  ('cookie-3', 'cat-regular', 'Kannauj Rose Almond Mawa Molten Cookie', 'rose-almond-molten-cookie', 329, 30, true, '["/images/rose-almond.png"]'::jsonb, 'Infused with edible Kannauj damask rose petals and slivered California almonds, featuring a warm, luscious mawa cream molten center.', '["🔥 Molten Mawa Core", "Damask Rose Aroma", "Crunchy Almond Bits"]'::jsonb, 'Kannauj, Uttar Pradesh', 4, '{"servingWeight": "35 g", "energy": "162.5 Kcal", "protein": "4.1 g", "fat": "10.8 g", "sugar": "4.5 g"}'::jsonb),
  ('cookie-4', 'cat-protein', 'High-Protein Oats & Dark Molten Lava Cookie', 'protein-oats-dark-lava-cookie', 379, 40, true, '["/images/dark-cocoa.png"]'::jsonb, 'Hearty rolled oats dough packed with 15g premium whey protein, baked to crisp perfection with a warm dark chocolate molten lava core inside.', '["💪 15g Whey Protein", "🔥 Molten Dark Lava", "Rolled Oats Crunch"]'::jsonb, 'Flanders, Belgium', 4, '{"servingWeight": "35 g", "energy": "158.0 Kcal", "protein": "15.0 g", "fat": "5.4 g", "sugar": "1.8 g"}'::jsonb),
  ('cookie-5', 'cat-protein', 'High-Protein Oats & Almond Butter Melt Cookie', 'protein-oats-almond-melt-cookie', 389, 35, true, '["/images/saffron-pistachio.png"]'::jsonb, 'Protein-packed oats dough stuffed with a creamy, warm roasted almond butter molten center for the ultimate fitness indulgence.', '["💪 14g Whey Protein", "🔥 Molten Almond Core", "Nutty Oats Crunch"]'::jsonb, 'California, USA', 4, '{"servingWeight": "35 g", "energy": "161.2 Kcal", "protein": "14.0 g", "fat": "6.2 g", "sugar": "1.5 g"}'::jsonb),
  ('cookie-6', 'cat-protein', 'High-Protein Oats & Peanut Butter Fudge Molten Cookie', 'protein-oats-pb-fudge-cookie', 369, 50, true, '["/images/rose-almond.png"]'::jsonb, 'Wholesome rolled oats dough infused with 16g protein and an oozy, warm peanut butter fudge molten core inside.', '["💪 16g Whey Protein", "🔥 Molten PB Fudge", "Slow-Roasted Oats"]'::jsonb, 'Organic Oats Estate', 4, '{"servingWeight": "35 g", "energy": "165.8 Kcal", "protein": "16.0 g", "fat": "6.8 g", "sugar": "1.6 g"}'::jsonb),
  ('cookie-7', 'cat-sugarfree', 'Sugar-Free Belgian Dark Chocolate Lava Cookie', 'sugar-free-dark-lava-cookie', 359, 45, true, '["/images/dark-cocoa.png"]'::jsonb, 'Naturally sweetened with stevia and date syrup, featuring an intense 0% refined sugar dark Belgian chocolate molten lava core inside.', '["🌱 0% Refined Sugar", "🔥 Molten Stevia Lava", "100% Guilt-Free"]'::jsonb, 'Flanders, Belgium', 4, '{"servingWeight": "35 g", "energy": "142.0 Kcal", "protein": "4.0 g", "fat": "10.5 g", "sugar": "0.0 g"}'::jsonb),
  ('cookie-8', 'cat-sugarfree', 'Sugar-Free Roasted Pistachio Mawa Molten Cookie', 'sugar-free-pistachio-molten-cookie', 379, 25, true, '["/images/saffron-pistachio.png"]'::jsonb, 'Zero added refined sugar! Roasted Iranian pistachios dough stuffed with a warm, melt-in-mouth sugar-free pistachio cream molten center.', '["🌱 0% Refined Sugar", "🔥 Molten Pistachio Core", "Stevia Sweetened"]'::jsonb, 'Kerman, Iran', 4, '{"servingWeight": "35 g", "energy": "148.5 Kcal", "protein": "4.8 g", "fat": "11.0 g", "sugar": "0.0 g"}'::jsonb),
  ('cookie-9', 'cat-sugarfree', 'Sugar-Free Hazelnut Cocoa Crunch Molten Cookie', 'sugar-free-hazelnut-molten-cookie', 369, 30, true, '["/images/rose-almond.png"]'::jsonb, 'Crisp sugar-free cocoa dough stuffed with a rich, warm sugar-free hazelnut gianduja molten core that flows smoothly.', '["🌱 0% Refined Sugar", "🔥 Molten Hazelnut Lava", "Crunchy Cocoa"]'::jsonb, 'Piedmont, Italy', 4, '{"servingWeight": "35 g", "energy": "145.2 Kcal", "protein": "4.2 g", "fat": "10.8 g", "sugar": "0.0 g"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Hero Banners Seed Data
INSERT INTO public.hero_banners (id, headline, subtitle, image_desktop, cta_link, priority, is_active) VALUES
  ('banner-1', '100% Pure Eggless Artisanal Cookies', 'Slow-baked in Mumbai. Delivered within 24 hours of oven release.', '/images/saffron-pistachio.png', '#catalog', 1, true),
  ('banner-2', 'Royal Festive Gifting Collection', 'Build your own custom gift tin with personalized wax-sealed cards.', '/images/gift-box.png', '/gifting', 2, true)
ON CONFLICT (id) DO NOTHING;

-- Coupons Seed Data
INSERT INTO public.coupons (id, code, type, value, min_order, is_active, description) VALUES
  ('c-1', 'MEETHI20', 'PERCENT', 20, 499, true, 'Get 20% OFF on min. order ₹499'),
  ('c-2', 'KAHANI100', 'FLAT', 100, 799, true, 'Flat ₹100 OFF on min. order ₹799'),
  ('c-3', 'WELCOME15', 'PERCENT', 15, 399, true, 'Extra 15% OFF on First Bakery Order'),
  ('c-4', 'FESTIVE250', 'FLAT', 250, 1299, true, 'Flat ₹250 OFF on Gifting & Luxury Tins')
ON CONFLICT (id) DO NOTHING;

-- Reviews Seed Data
INSERT INTO public.reviews (id, customer_name, location, purchased_item, rating_cookies, review_text, is_featured) VALUES
  ('rev-1', 'Aarav Sharma', 'Bandra West', 'Royal Saffron Pistachio Molten Cookie', 5, 'The saffron white chocolate molten core literally exploded in my mouth! You cannot tell it is 100% eggless. Absolute royal perfection.', true),
  ('rev-2', 'Priya Mehta', 'Powai', 'Sugar-Free Belgian Dark Chocolate Lava Cookie', 5, 'Zero sugar but 100% guilt-free indulgence! The dark chocolate lava center is so rich and warm. Ordered 3 packs already.', true),
  ('rev-3', 'Kabir Kapoor', 'Juhu', 'High-Protein Oats & Peanut Butter Fudge Cookie', 5, '16g protein with an oozy peanut butter fudge core after gym is a game changer! Beats every protein bar I have ever had.', true),
  ('rev-4', 'Ananya Roy', 'Worli', 'Kannauj Rose Almond Mawa Molten Cookie', 5, 'The rose aroma and mawa molten center took me straight to royal Rajasthan. The vintage tin box packaging is gorgeous!', true)
ON CONFLICT (id) DO NOTHING;

-- Serviceable Pincodes Seed Data
INSERT INTO public.serviceable_pincodes (pincode, city_name, delivery_tier, is_active) VALUES
  ('400050', 'Mumbai', '1-Day Express', true),
  ('400051', 'Mumbai', '1-Day Express', true),
  ('400076', 'Mumbai', '1-Day Express', true),
  ('400001', 'Mumbai', '1-Day Express', true),
  ('400002', 'Mumbai', '1-Day Express', true),
  ('400053', 'Mumbai', '1-Day Express', true),
  ('400601', 'Thane', '1-Day Express', true)
ON CONFLICT (pincode) DO NOTHING;
