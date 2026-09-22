# AGENTS.md — Persistent Session Memory & Project Blueprint
**Project:** Rehman Veterinary Clinic & Pet Pharmacy  
**Location:** Lahore, Pakistan  
**Lead Veterinarian:** Dr. Saif Ur Rehman, DVM (PVMC Certified)  
**Primary WhatsApp / Hotline:** `+92 311 4899904`  
**GitHub Repository:** `https://github.com/ammarkhan4724/Rehman-Vet-Clinic.git` (Branch: `main`)  
**Active Local Server:** `http://localhost:4321/` (`node start_dev.mjs`)

---

## 1. Core Architecture & Stack
- **Framework:** Astro v7 (SSG static build, 15 compiled HTML routes)
- **Interactive Islands:** React 19 (`@astrojs/react`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Database Engine:** Supabase (PostgreSQL) via `@supabase/supabase-js` (`^2.117.0`)
- **Runtime / Language:** Node.js v24+, TypeScript (`moduleResolution: bundler`, `type: module`)

---

## 2. Inviolable Project Rules & Constraints
1. **STRICT ZERO CANONICAL TAGS:**
   - Never add `<link rel="canonical">` to any page or component in this repository. All page templates must remain 100% free of canonical links.
2. **STRICT NOINDEX ON `/admin`:**
   - `/admin` must remain completely invisible to search engine crawlers:
     - Header meta: `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />`
     - `public/robots.txt`: Contains `Disallow: /admin` and `Disallow: /admin/`
     - Never add `/admin` to `sitemap.xml`.
3. **CURRENCY & LOCAL FOCUS:**
   - All store prices must be displayed in **PKR (Rs.)**.
   - Lahore is the primary delivery hub with 16 dedicated neighborhood delivery sectors.

---

## 3. E-Commerce & Step-by-Step Checkout Suite
- **Public Store Catalog (`/shop`):**
  - Displays 22 veterinarian-approved brand packshots in `public/images/products/` (Fluffy, Nourvet, Royal Canin, KMR, Klumpy, Frontline, Feli-Worm, Woof, etc.).
  - 3-button product cards: `Add to Cart`, `⚡ Buy Now`, and `Order via WhatsApp`.
- **Slide-Over Cart Drawer (`src/components/CartDrawer.tsx`):**
  - Animated free delivery progress bar tracking toward the **Rs. 3,500 threshold**.
  - Increment/decrement item quantity and line-item removals.
- **5-Step Checkout Wizard (`src/components/CheckoutModal.tsx`):**
  - **Step 1 (Address & Contact):** Full name, WhatsApp/phone, 16 Lahore areas selector dropdown, street address, landmark, bot honeypot, and SQLi sanitizer.
  - **Step 2 (Delivery Speed):** Standard Same-Day (Rs. 200 / Free over Rs. 3,500; 3–5 hrs), Urgent Express Courier (Rs. 450; 60–90 mins), or Clinic Pickup (Free; 30 mins).
  - **Step 3 (Payment Method):** Cash on Delivery (COD), EasyPaisa / JazzCash (`Dr. Saif Ur Rehman` — `0311 4899904`), or Meezan Bank IBAN transfer.
  - **Step 4 (Order Review):** Itemized breakdown, delivery fee, grand total, and rate-limited submission.
  - **Step 5 (Receipt & Tracking):** Official Order ID (e.g., `RVC-202609-7993`) and 1-click WhatsApp live tracking button pre-addressed to Dr. Saif.

---

## 4. Built-in Admin CMS & Order Tracker (`/admin`)
- **Master Security PIN:** `2026`
- **Brute-Force Lockout:** After 5 consecutive failed PIN attempts, access is locked for 15 minutes with a live countdown timer.
- **Orders & Inquiries Tab:**
  - Displays all orders captured via Website Checkout and WhatsApp Inquiries.
  - Columns: Order ID, Purchased Items (multi-unit count and item previews), Amount & Payment Method, Customer & Lahore Location, Delivery Speed badge, Order Status workflow, and Actions.
  - **Export CSV Button:** Generates formatted order log CSV (`rvc_clinic_orders_YYYY-MM-DD.csv`).
- **Product Inventory Tab:**
  - Direct computer file upload with automatic client-side canvas WebP compression (max 800px).
  - Live price editing and in-stock toggle.
  - Packshot asset library picker and image URL preview.
- **Storage Keys:**
  - Active Cart: `rvc_cart`
  - Order Log: `rvc_orders_log`
  - Products Catalog: `rvc_products_catalog`

---

## 5. Database & Supabase Integration
- **Hostinger Entrypoint:** `db.js` in the project root with dual ESM/CommonJS compatibility.
- **Client Helper:** `src/utils/supabase.ts` exports `supabase` client and `isSupabaseConfigured()`.
- **Environment Template:** `.env.example`
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`
- **PostgreSQL Tables:**
  - `products`: ID, name, category, price, weight/size, in_stock, image, description, clinical_note.
  - `orders`: ID, created_at, items (JSONB), subtotal, delivery_fee, total_price, customer details, delivery_method, payment_method, status.

---

## 6. Enterprise Security Architecture
- **`src/utils/security.ts`:**
  - Anti-SQL injection scanner regex (`detectSqlInjection`) covering `SELECT`, `UNION`, `DROP`, `--`, etc.
  - Input sanitizer (`sanitizeInput`) stripping dangerous HTML and SQL characters.
  - Sliding-window rate limiter (`isRateLimited`) mitigating DoS and automated bulk traffic.
  - Invisible bot honeypot validator (`validateHoneypot`).
- **Security Headers (`public/_headers` & `public/.htaccess`):**
  - `X-Frame-Options: SAMEORIGIN` (Clickjacking defense)
  - `X-Content-Type-Options: nosniff` (MIME sniffing defense)
  - `Strict-Transport-Security` (Enforced HTTPS)
  - Query string filtering blocking `SELECT`, `UNION`, and `DROP` injection payloads.

---

## 7. Informational SEO Silos & Top Competitor Content
- **Keyword Clusters (359 terms across 154,840 monthly volume):**
  - Detailed in `Rehman_Vet_Clinic_Competitor_Keyword_Clusters_2026.md`.
- **Published Medical & Care Guides:**
  - `src/pages/blog/canine-distemper-symptoms-treatment-pakistan.astro`
  - `src/pages/blog/kmr-kitten-milk-replacer-feeding-guide-pakistan.astro`
  - `src/pages/blog/cat-deworming-tablet-schedule-dosage-pakistan.astro`
  - `src/pages/blog/best-cat-food-brands-prices-pakistan.astro`
  - `src/pages/blog/parvovirus-treatment-cost-survival-pakistan.astro`

---

## 8. Verification & Build Commands
- **Build Static Site:** `npm run build` (Must produce 15 pages in `< 1.2s`)
- **Zero Canonical Check:** `python C:\Users\AMMAR\.gemini\antigravity-ide\brain\536f8e06-6a40-4dd7-ac41-34becf0c78f8\scratch\verify_dist.py`
- **Dev Server:** `npm run dev` (`http://localhost:4321/`)
