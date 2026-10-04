import os
import glob
import re

def main():
    pages_dir = r"D:\Rehman Vet Clinic\src\pages"
    components_dir = r"D:\Rehman Vet Clinic\src\components"
    
    # 1. Create SiteHeader.astro
    header_code = """---
---
<header class="fixed top-0 w-full z-50 py-3 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
  <div class="max-w-7xl mx-auto px-5 flex items-center justify-between">
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

    <nav class="hidden lg:flex items-center gap-1 bg-emerald-50/80 border border-emerald-100/60 rounded-full p-1 text-xs font-semibold text-slate-700">
      <a href="/" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Home</a>
      <a href="/shop" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Shop</a>
      <a href="/services/emergency-veterinary-care" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Emergency 24/7</a>
      <a href="/services/pet-vaccination-center" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Vaccinations</a>
      <a href="/services/home-visit-veterinary" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Home Visits</a>
      <a href="/locations/dha-lahore-veterinary-clinic" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">DHA Lahore</a>
      <a href="/blog/parvovirus-treatment-cost-survival-pakistan" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Blog</a>
      <a href="/#reviews" class="px-3.5 py-1.5 hover:text-emerald-800 hover:bg-white rounded-full transition">Reviews</a>
    </nav>

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
    with open(os.path.join(components_dir, "SiteHeader.astro"), "w", encoding="utf-8") as f:
        f.write(header_code)

    # 2. Create SiteFooter.astro
    footer_code = """---
const year = new Date().getFullYear();
---
<footer class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
  <div class="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
    <div>
      <div class="flex items-center gap-3 mb-4">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 grid place-items-center text-slate-950 font-black text-sm">RV</div>
        <span class="text-white font-black text-lg tracking-tight">Rehman Veterinary Clinic</span>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed mb-5">
        Lahore's premier 24/7 mobile veterinary practice and emergency trauma clinic. Dr. Saif Ur Rehman, DVM brings hospital-grade diagnostics, urgent treatments, and gentle doorstep pet care across all major sectors of Lahore.
      </p>
      <div class="text-xs font-semibold text-emerald-400 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>PVMC Certified & Licensed Veterinarian</span>
      </div>
    </div>
    <div>
      <h3 class="text-white font-bold text-sm tracking-wider uppercase mb-4">Clinical Services</h3>
      <ul class="space-y-2 text-xs">
        <li><a href="/services/emergency-veterinary-care" class="hover:text-amber-400 transition">24/7 Emergency Veterinary Care</a></li>
        <li><a href="/services/24-hour-vet-clinic-lahore" class="hover:text-amber-400 transition">24 Hour Animal Hospital Lahore</a></li>
        <li><a href="/services/pet-vaccination-center" class="hover:text-amber-400 transition">Dog & Cat Vaccinations (7-in-1 / Tricat)</a></li>
        <li><a href="/services/home-visit-veterinary" class="hover:text-amber-400 transition">Mobile Vet House Calls</a></li>
        <li><a href="/shop" class="hover:text-amber-400 transition">Veterinary Pharmacy & Shop</a></li>
      </ul>
    </div>
    <div>
      <h3 class="text-white font-bold text-sm tracking-wider uppercase mb-4">Locations & Policies</h3>
      <ul class="space-y-2 text-xs flex flex-col">
        <li><a href="/locations/dha-lahore-veterinary-clinic" class="hover:text-amber-400 transition">Vet in DHA Lahore (Phases 1–8)</a></li>
        <li><a href="/about-us" class="hover:text-amber-400 transition">About Us</a></li>
        <li><a href="/privacy-policy" class="hover:text-amber-400 transition">Privacy Policy</a></li>
        <li><a href="/terms-and-conditions" class="hover:text-amber-400 transition">Terms of Service</a></li>
        <li><a href="/refund-policy" class="hover:text-amber-400 transition">Refund & Cancellation Policy</a></li>
        <li><a href="/disclaimer" class="hover:text-amber-400 transition">Disclaimer</a></li>
        <li><a href="/cookie-policy" class="hover:text-amber-400 transition">Cookie Policy</a></li>
      </ul>
    </div>
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
        <div class="flex items-center gap-2 text-slate-400 pt-2">
          <span>📍 Coverage:</span>
          <span class="text-slate-300">All Sectors of Lahore, Punjab, PK</span>
        </div>
      </div>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-5 pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
    <p>© {year} Rehman Veterinary Clinic Lahore. All rights reserved. PVMC Registered.</p>
    <p>100% Dedicated White-Hat Animal Care</p>
  </div>
</footer>
<aside aria-label="WhatsApp quick contact" class="fixed bottom-6 right-6 z-50 flex items-center group">
  <div class="hidden sm:flex items-center gap-2 mr-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold shadow-2xl border border-emerald-100 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
    <span class="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
    <span>Chat with Dr. Saif (24/7)</span>
  </div>
  <a href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20need%20an%20urgent%20veterinary%20consultation%20for%20my%20pet%20in%20Lahore." target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" class="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white grid place-items-center shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/80">
    <span class="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-35 animate-ping -z-10"></span>
    <svg width="32" height="32" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
  </a>
</aside>
"""
    with open(os.path.join(components_dir, "SiteFooter.astro"), "w", encoding="utf-8") as f:
        f.write(footer_code)

    # 3. Create Breadcrumbs.astro
    breadcrumbs_code = """---
const { path } = Astro.props;
// path looks like "blog/parvovirus-treatment-cost-survival-pakistan"
let parts = path ? path.split('/').filter(Boolean) : [];
let currentPath = '';
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
---
<nav aria-label="Breadcrumb" class="max-w-7xl mx-auto px-5 pt-24 pb-4 text-xs text-slate-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
  <a href="/" class="hover:text-emerald-700 transition font-medium">Home</a>
  {parts.map((part, index) => {
    currentPath += '/' + part;
    const isLast = index === parts.length - 1;
    return (
      <>
        <span class="text-slate-300">/</span>
        {isLast ? (
          <span class="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-none">{capitalize(part)}</span>
        ) : (
          <a href={currentPath} class="hover:text-emerald-700 transition font-medium capitalize">{part.replace(/-/g, ' ')}</a>
        )}
      </>
    );
  })}
</nav>
"""
    with open(os.path.join(components_dir, "Breadcrumbs.astro"), "w", encoding="utf-8") as f:
        f.write(breadcrumbs_code)

    # 4. Process all .astro files
    all_astro_files = glob.glob(os.path.join(pages_dir, "**/*.astro"), recursive=True)
    for file in all_astro_files:
        if "index.astro" in file.replace("\\", "/"): 
            continue # Skip index and admin/index

        with open(file, "r", encoding="utf-8") as f:
            content = f.read()

        original = content

        # Check if already processed
        if "SiteHeader" in content and "SiteFooter" in content:
            continue

        # Add imports if not present
        if "---" in content:
            parts = content.split("---", 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
                if "SiteHeader" not in frontmatter:
                    new_frontmatter = frontmatter.rstrip() + "\nimport SiteHeader from '../../components/SiteHeader.astro';\nimport SiteFooter from '../../components/SiteFooter.astro';\nimport Breadcrumbs from '../../components/Breadcrumbs.astro';\n"
                    # Fix path depth
                    depth = file.replace(pages_dir, "").count("\\") + file.replace(pages_dir, "").count("/")
                    dots = "../" * depth
                    new_frontmatter = new_frontmatter.replace("../../", dots)
                    content = parts[0] + "---" + new_frontmatter + "---" + parts[2]
        else:
            depth = file.replace(pages_dir, "").count("\\") + file.replace(pages_dir, "").count("/")
            dots = "../" * depth
            content = f"---\nimport SiteHeader from '{dots}components/SiteHeader.astro';\nimport SiteFooter from '{dots}components/SiteFooter.astro';\nimport Breadcrumbs from '{dots}components/Breadcrumbs.astro';\n---\n" + content

        # Remove existing header
        content = re.sub(r'<header.*?</header>', '<SiteHeader />', content, flags=re.DOTALL)
        
        # Remove existing footer
        content = re.sub(r'<footer.*?</footer>', '<SiteFooter />', content, flags=re.DOTALL)
        
        # Remove existing floating whatsapp widget
        content = re.sub(r'<aside aria-label="WhatsApp quick contact".*?</aside>', '', content, flags=re.DOTALL)

        # Replace existing breadcrumbs or add one after SiteHeader
        # If there's an existing nav breadcrumb:
        relative_path = file.replace(pages_dir, "").replace("\\", "/").strip("/").replace(".astro", "")
        breadcrumb_tag = f'<Breadcrumbs path="{relative_path}" />'

        if '<nav aria-label="Breadcrumb"' in content:
            content = re.sub(r'<nav aria-label="Breadcrumb".*?</nav>', breadcrumb_tag, content, flags=re.DOTALL)
        elif '<SiteHeader />' in content:
            # If no breadcrumb existed, inject after SiteHeader
            content = content.replace('<SiteHeader />', '<SiteHeader />\n        ' + breadcrumb_tag)
        else:
            # If no SiteHeader, just put it at the top of body
            content = content.replace('<body', f'<body') # Fallback if no header

        if content != original:
            with open(file, "w", encoding="utf-8") as f:
                f.write(content)

if __name__ == "__main__":
    main()
