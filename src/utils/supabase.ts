import { createClient } from "@supabase/supabase-js";

// Read environment variables (Astro uses import.meta.env for client/server Vite builds)
const supabaseUrl = (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_SUPABASE_URL) || "";
const supabaseAnonKey = (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_SUPABASE_ANON_KEY) || "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("your-project"));
};

// Create Supabase client singleton (or dummy client if keys are not yet provided)
export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

/**
 * SQL Table Schema Reference for Supabase:
 * 
 * CREATE TABLE products (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   category_label TEXT,
 *   price NUMERIC NOT NULL,
 *   original_price NUMERIC,
 *   weight_or_size TEXT,
 *   badge TEXT,
 *   rating NUMERIC DEFAULT 5.0,
 *   review_count INTEGER DEFAULT 0,
 *   in_stock BOOLEAN DEFAULT true,
 *   image TEXT,
 *   description TEXT,
 *   clinical_note TEXT,
 *   keywords TEXT[],
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE TABLE orders (
 *   id TEXT PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   formatted_date TEXT,
 *   items JSONB NOT NULL,
 *   subtotal NUMERIC NOT NULL,
 *   delivery_fee NUMERIC DEFAULT 0,
 *   total_price NUMERIC NOT NULL,
 *   customer_name TEXT NOT NULL,
 *   customer_phone TEXT NOT NULL,
 *   customer_email TEXT,
 *   customer_city TEXT DEFAULT 'Lahore',
 *   customer_area TEXT NOT NULL,
 *   customer_address TEXT NOT NULL,
 *   nearby_landmark TEXT,
 *   delivery_method TEXT NOT NULL,
 *   payment_method TEXT NOT NULL,
 *   channel TEXT DEFAULT 'Direct Website Checkout',
 *   status TEXT DEFAULT 'New Inquiry',
 *   notes TEXT
 * );
 */
