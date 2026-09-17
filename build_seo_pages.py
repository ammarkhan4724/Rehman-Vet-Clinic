import os
import shutil
from datetime import datetime

ROOT_DIR = "d:/Rehman Vet Clinic"
DIST_DIR = os.path.join(ROOT_DIR, "dist")
BASE_URL = "https://rehmanvetclinic.com"

# Shared HTML Header Component
def render_header(current_path=""):
    return """
    <!-- Header -->
    <header class="fixed top-0 w-full z-50 py-3 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-5 flex items-center justify-between">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 group">
          <div class="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/40 grid place-items-center shadow-md">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4V28M4 16H28" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" opacity="0.3"/>
              <path d="M6 16.5H10L12.5 10.5L15.5 21.5L18 12.5L19.5 16.5H26" stroke="#F59E0B" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="16" cy="7.5" r="1.8" fill="#F59E0B" />
              <circle cx="12.5" cy="8.5" r="1.3" fill="#10B981" />
              <circle cx="19.5" cy="8.5" r="1.3" fill="#10B981" />
            </svg>
          </div>
          <div>
            <div class="font-black text-lg leading-none tracking-tight text-slate-900 group-hover:text-emerald-800 transition">Rehman</div>
            <div class="text-[9px] font-extrabold text-emerald-600 tracking-[0.2em] uppercase mt-0.5">VETERINARY</div>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1 bg-emerald-50/80 border border-emerald-100/60 rounded-full p-1 text-xs font-semibold text-slate-700">
          <a href="/" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Home</a>
          <a href="/services/emergency-veterinary-care.html" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Emergency 24/7</a>
          <a href="/services/pet-vaccination-center.html" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Vaccinations</a>
          <a href="/services/home-visit-veterinary.html" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Home Visits</a>
          <a href="/locations/dha-lahore-veterinary-clinic.html" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">DHA Lahore</a>
          <a href="/blog/parvovirus-treatment-cost-survival-pakistan.html" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Parvovirus Guide</a>
          <a href="/#reviews" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Reviews</a>
        </nav>

        <!-- Right Action Buttons -->
        <div class="flex items-center gap-2">
          <a href="tel:+923114899904" class="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm">
            <svg class="w-3.5 h-3.5 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z" />
            </svg>
            <span>+92 311 4899904</span>
          </a>
          <a href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20need%20a%20veterinary%20consultation%20for%20my%20pet." target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-sm">
            <span>WhatsApp (24/7)</span>
          </a>
        </div>
      </div>
    </header>
    """

# Shared HTML Footer Component
def render_footer():
    return """
    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div class="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Col 1 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 grid place-items-center text-slate-950 font-black text-sm">
              RV
            </div>
            <span class="text-white font-black text-lg tracking-tight">Rehman Veterinary Clinic</span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed mb-5">
            Lahore's premier 24/7 mobile veterinary practice and emergency trauma clinic. Dr. Rehman Ahmed, DVM brings hospital-grade diagnostics, urgent treatments, and gentle doorstep pet care across all major sectors of Lahore.
          </p>
          <div class="text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PVMC Certified & Licensed Veterinarian</span>
          </div>
        </div>

        <!-- Col 2: Services Silo -->
        <div>
          <h3 class="text-white font-bold text-sm tracking-wider uppercase mb-4">Clinical Services</h3>
          <ul class="space-y-2 text-xs">
            <li><a href="/services/emergency-veterinary-care.html" class="hover:text-amber-400 transition">24/7 Emergency Veterinary Care</a></li>
            <li><a href="/services/24-hour-vet-clinic-lahore.html" class="hover:text-amber-400 transition">24 Hour Animal Hospital Lahore</a></li>
            <li><a href="/services/pet-vaccination-center.html" class="hover:text-amber-400 transition">Dog & Cat Vaccinations (7-in-1 / Tricat)</a></li>
            <li><a href="/services/home-visit-veterinary.html" class="hover:text-amber-400 transition">Mobile Vet House Calls</a></li>
            <li><a href="/services/emergency-veterinary-care.html#surgery" class="hover:text-amber-400 transition">Pet Surgery & Cesarean Care</a></li>
            <li><a href="/services/emergency-veterinary-care.html#diagnostics" class="hover:text-amber-400 transition">Mobile Ultrasound & CBC Blood Work</a></li>
          </ul>
        </div>

        <!-- Col 3: Areas & Guides -->
        <div>
          <h3 class="text-white font-bold text-sm tracking-wider uppercase mb-4">Locations & Guides</h3>
          <ul class="space-y-2 text-xs">
            <li><a href="/locations/dha-lahore-veterinary-clinic.html" class="hover:text-amber-400 transition">Vet in DHA Lahore (Phases 1–8 & Raya)</a></li>
            <li><a href="/locations/dha-lahore-veterinary-clinic.html#gulberg" class="hover:text-amber-400 transition">Pet Care Gulberg & Cantt Lahore</a></li>
            <li><a href="/locations/dha-lahore-veterinary-clinic.html#bahria" class="hover:text-amber-400 transition">Bahria Town Lahore Home Visits</a></li>
            <li><a href="/blog/parvovirus-treatment-cost-survival-pakistan.html" class="hover:text-amber-400 transition">Canine Parvovirus Protocol & Cost</a></li>
            <li><a href="/services/pet-vaccination-center.html#schedule" class="hover:text-amber-400 transition">Puppy & Kitten Vaccine Chart</a></li>
          </ul>
        </div>

        <!-- Col 4: Contact & Hours -->
        <div>
          <h3 class="text-white font-bold text-sm tracking-wider uppercase mb-4">Emergency Dispatch</h3>
          <p class="text-xs text-slate-400 mb-3">Available 24 hours a day, 7 days a week for in-home emergency visits, hospital triage, and video consults.</p>
          <div class="space-y-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-amber-400">📞 Phone:</span>
              <a href="tel:+923114899904" class="text-white font-bold hover:underline">+92 311 4899904</a>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[#25D366]">💬 WhatsApp:</span>
              <a href="https://wa.me/923114899904" class="text-white hover:underline">+92 311 4899904</a>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-slate-400">✉️ Email:</span>
              <a href="mailto:info@rehmanvetclinic.com" class="text-slate-300 hover:underline">info@rehmanvetclinic.com</a>
            </div>
            <div class="flex items-center gap-2 text-slate-400 pt-2">
              <span>📍 Coverage:</span>
              <span class="text-slate-300">All Sectors of Lahore, Punjab, PK</span>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-5 pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Rehman Veterinary Clinic Lahore. All rights reserved. PVMC Registered.</p>
        <p>100% Dedicated White-Hat Animal Care · Zero Artificial Markup</p>
      </div>
    </footer>

    <!-- Floating WhatsApp Widget -->
    <aside aria-label="WhatsApp quick contact" class="fixed bottom-6 right-6 z-50 flex items-center group">
      <div class="hidden sm:flex items-center gap-2 mr-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold shadow-2xl border border-emerald-100 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
        <span class="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
        <span>Chat with Dr. Rehman (24/7)</span>
      </div>
      <a href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20need%20an%20urgent%20veterinary%20consultation%20for%20my%20pet%20in%20Lahore." target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" class="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white grid place-items-center shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/80">
        <span class="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-35 animate-ping -z-10"></span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.771.821 2.796.821 3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.767-5.768-5.767zm7.554 5.765c-.002 4.167-3.39 7.555-7.554 7.555-.989 0-1.951-.194-2.84-.567l-3.953 1.037 1.055-3.856c-.443-.95-.678-1.996-.678-3.069.002-4.167 3.39-7.555 7.555-7.555 4.165 0 7.553 3.388 7.555 7.555zm-10.155 3.125c.193.539.957 1.042 1.348 1.096.391.054.764.088 1.157-.037.394-.125 1.571-.645 1.794-.963.223-.318.223-.59.155-.715-.068-.125-.251-.2-.533-.341-.282-.141-1.666-.822-1.924-.916-.258-.094-.446-.141-.634.141-.188.282-.727.916-.891 1.104-.164.188-.328.211-.61.07-.282-.141-1.19-.439-2.267-1.4-.838-.748-1.403-1.672-1.568-1.954-.165-.282-.018-.435.123-.575.127-.126.282-.328.423-.492.141-.164.188-.282.282-.47.094-.188.047-.352-.023-.492-.07-.141-.634-1.527-.869-2.091-.228-.549-.461-.475-.634-.484-.164-.009-.352-.011-.54-.011s-.493.07-.751.352c-.258.282-.986.963-.986 2.348s1.009 2.723 1.15 2.911c.141.188 1.986 3.033 4.811 4.254z"/>
        </svg>
      </a>
    </aside>
    """

# Base HTML Wrapper (NO CANONICAL TAGS INCLUDED)
def render_page(title, description, keywords, body_content, schema_json, breadcrumbs=None):
    breadcrumb_html = ""
    if breadcrumbs:
        bc_items = []
        for i, (label, url) in enumerate(breadcrumbs):
            if url:
                bc_items.append(f'<a href="{url}" class="hover:text-emerald-700 transition">{label}</a>')
            else:
                bc_items.append(f'<span class="text-slate-800 font-semibold">{label}</span>')
        breadcrumb_html = f"""
        <nav aria-label="Breadcrumb" class="max-w-7xl mx-auto px-5 pt-24 pb-4 text-xs text-slate-500 flex items-center gap-2">
            {' <span class="text-slate-300">/</span> '.join(bc_items)}
        </nav>
        """

    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    
    <!-- Core SEO Meta Tags -->
    <meta name="description" content="{description}" />
    <meta name="keywords" content="{keywords}" />
    <meta name="author" content="Dr. Rehman Ahmed, DVM" />
    <meta name="geo.region" content="PK-PB" />
    <meta name="geo.placename" content="Lahore" />

    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:site_name" content="Rehman Veterinary Clinic" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{description}" />

    <!-- Google Fonts & Tailwind CDN -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {{
        theme: {{
          extend: {{
            colors: {{
              canvas: '#faf9f7',
              brandEmerald: '#065f46',
              brandAmber: '#f59e0b'
            }},
            fontFamily: {{
              sans: ['Outfit', 'system-ui', 'sans-serif']
            }}
          }}
        }}
      }}
    </script>
    <style>
      body {{ font-family: 'Outfit', system-ui, sans-serif; background-color: #faf9f7; }}
    </style>

    <!-- Schema.org JSON-LD Structured Data -->
    <script type="application/ld+json">
    {schema_json}
    </script>
  </head>
  <body class="text-slate-800 antialiased min-h-screen flex flex-col justify-between">
    <div>
      {render_header()}
      {breadcrumb_html}
      <main class="max-w-7xl mx-auto px-5 py-6">
        {body_content}
      </main>
    </div>
    {render_footer()}
  </body>
</html>
"""

print("Generator functions defined successfully.")
