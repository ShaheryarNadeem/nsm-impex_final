-- ==============================================================================
-- NSM IMPEX - SECURE PRODUCTION SUPABASE SCHEMA & RLS MIGRATION
-- ==============================================================================
-- Run this script in the Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create CATEGORIES Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    subcategories JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create PRODUCTS Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    product_code TEXT,
    description TEXT,
    short_description TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    fabric TEXT,
    composition TEXT,
    gsm TEXT,
    fit TEXT,
    sizes TEXT,
    colors TEXT,
    size_options JSONB DEFAULT '[]'::jsonb,
    color_options JSONB DEFAULT '[]'::jsonb,
    season TEXT,
    customization TEXT,
    packaging TEXT,
    moq TEXT,
    lead_time TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products (published);

-- 4. Create Non-User-Editable ADMIN_USERS Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Protect the admin_users table itself with RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admin_users table" ON public.admin_users;
CREATE POLICY "Admins can view admin_users table"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 5. Create Secure Admin Check Function (SECURITY DEFINER)
-- Bypasses user-editable metadata and securely checks the admin_users table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 6. Helper Function to easily authorize an Admin by Email
CREATE OR REPLACE FUNCTION public.add_admin_by_email(admin_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = LOWER(TRIM(admin_email));
  IF target_user_id IS NULL THEN
    RETURN 'Error: User with email ' || admin_email || ' does not exist in Supabase Auth. Create the user in Authentication first.';
  END IF;

  INSERT INTO public.admin_users (user_id, email, role)
  VALUES (target_user_id, LOWER(TRIM(admin_email)), 'admin')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN 'Success: ' || admin_email || ' is now an authorized administrator.';
END;
$$;

-- 7. Secure public.products with Strict Least-Privilege RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Admin Full Access Products" ON public.products;
DROP POLICY IF EXISTS "Public read published products" ON public.products;
DROP POLICY IF EXISTS "Admins read all products" ON public.products;
DROP POLICY IF EXISTS "Admins insert products" ON public.products;
DROP POLICY IF EXISTS "Admins update products" ON public.products;
DROP POLICY IF EXISTS "Admins delete products" ON public.products;

-- SELECT: Public can ONLY read published products
CREATE POLICY "Public read published products"
    ON public.products
    FOR SELECT
    USING (published = true);

-- SELECT: Authorized admins can read all products (including drafts)
CREATE POLICY "Admins read all products"
    ON public.products
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- INSERT: Only verified administrators
CREATE POLICY "Admins insert products"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE: Only verified administrators
CREATE POLICY "Admins update products"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- DELETE: Only verified administrators
CREATE POLICY "Admins delete products"
    ON public.products
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 8. Secure public.categories with RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Full Access Categories" ON public.categories;
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;

-- Public can read all categories
CREATE POLICY "Public read categories"
    ON public.categories
    FOR SELECT
    USING (true);

-- Admins can insert, update, or delete categories
CREATE POLICY "Admins manage categories"
    ON public.categories
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 9. Storage Bucket Security (product-images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Upload Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete product images" ON storage.objects;

-- Public can view photos
CREATE POLICY "Public read product images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-images');

-- Only verified admins can upload photos
CREATE POLICY "Admins upload product images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- Only verified admins can delete photos
CREATE POLICY "Admins delete product images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

-- 10. Seed Default Categories (Non-destructive: ON CONFLICT DO NOTHING)
INSERT INTO public.categories (id, slug, name, description, image, subcategories)
VALUES 
(
  'cat-tops',
  'tops',
  'Tops',
  'Explore our collection of contemporary tops designed for comfort, quality and modern global apparel markets.',
  '/products/pullover-hoodie-custom-1.png',
  '["Hoodies", "Sweatshirts", "T-Shirts", "Shirts", "Other Tops"]'::jsonb
),
(
  'cat-bottoms',
  'bottoms',
  'Bottoms',
  'Wholesale bottoms built for comfort, utility and consistent bulk production.',
  '/products/cargo-joggers-custom-1.png',
  '["Cargo Joggers", "Basketball shorts", "Cargo Pants", "cargo shorts", "denim shorts", "Jogger Pants", "Lounge Pants", "Parachute Pants", "shorts", "straight leg pants", "Sweat pants", "sweat shorts", "wide legs pants"]'::jsonb
),
(
  'cat-jackets-outerwear',
  'jackets-outerwear',
  'Jackets & Outerwear',
  'Wholesale jackets and outerwear for brands and exporters — from bombers to seasonal layers.',
  '/products/bomber-jackets-custom-1.png',
  '["Bomber jackets", "Coach jacket", "denim jacket", "Fleece jacket", "Lightweight jacket", "Sherpa jacket"]'::jsonb
),
(
  'cat-sets',
  'sets',
  'Sets',
  'Matched co-ords and utility sets designed for cohesive wholesale apparel collections.',
  '/products/cargo-set-custom-1.png',
  '["Cargo Sets", "Casual Sets", "Lounge Sets", "Tracksuits", "Co-ord Sets"]'::jsonb
),
(
  'cat-accessories',
  'accessories',
  'Accessories',
  'Caps, beanies, socks, gloves, and knitted winter accessories for global wholesale programs.',
  '/products/accessories-custom-1.jpg',
  '["Cap/Hat", "Socks", "Mufflers", "Gloves", "Neck Warmer & Caps"]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 11. Create INQUIRIES Table & Strict Least-Privilege RLS
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    product TEXT,
    product_code TEXT,
    quantity TEXT,
    size TEXT,
    color TEXT,
    message TEXT,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Only admins can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Only admins can delete inquiries" ON public.inquiries;

-- INSERT: Prospective buyers / public can submit inquiries
CREATE POLICY "Public can submit inquiries"
    ON public.inquiries
    FOR INSERT
    WITH CHECK (true);

-- SELECT: Only verified admins can read customer inquiries (prevents data leaks)
CREATE POLICY "Only admins can view inquiries"
    ON public.inquiries
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- DELETE: Only verified admins can delete inquiries
CREATE POLICY "Only admins can delete inquiries"
    ON public.inquiries
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

