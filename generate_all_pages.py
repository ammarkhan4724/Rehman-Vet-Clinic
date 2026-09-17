import os
import json
import shutil
from build_seo_pages import render_page
from build_full_pages import render_author_box, render_emergency_cta, render_faq_accordion, render_related_links

ROOT_DIR = "d:/Rehman Vet Clinic"
DIST_DIR = os.path.join(ROOT_DIR, "dist")
BASE_URL = "https://rehmanvetclinic.com"

# -------------------------------------------------------------
# PAGE 1: /services/emergency-veterinary-care.html
# -------------------------------------------------------------
def build_page_1():
    title = "24/7 Emergency Veterinary Care in Lahore — Trauma, Surgery & Critical Pet Care"
    description = "24/7 emergency veterinary hospital & mobile emergency care in Lahore. Fast triage for trauma, heatstroke, poisoning, bloat, and acute pet distress. Call +92 311 4899904."
    keywords = "emergency veterinary care lahore, 24 hour animal hospital lahore, urgent pet clinic lahore, night vet lahore, dog emergency lahore, cat emergency doctor"
    breadcrumbs = [("Home", "/"), ("Services", "/services/emergency-veterinary-care.html"), ("Emergency Care", None)]

    schema = {
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": "Rehman Veterinary Clinic — 24/7 Emergency Trauma Unit",
        "url": f"{BASE_URL}/services/emergency-veterinary-care.html",
        "telephone": "+923114899904",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lahore",
            "addressRegion": "Punjab",
            "addressCountry": "PK"
        },
        "medicalSpecialty": "VeterinaryMedicine",
        "availableService": [
            {
                "@type": "MedicalProcedure",
                "name": "24/7 Emergency Triage and Stabilization",
                "description": "Immediate stabilization for canine and feline trauma, acute toxicity, gastric dilation volvulus, and heatstroke."
            },
            {
                "@type": "MedicalProcedure",
                "name": "Emergency Pet Surgery and Cesarean Delivery",
                "description": "Urgent soft-tissue repair, emergency foreign body retrieval, and dystocia C-sections under gas anesthesia."
            }
        ]
    }

    faqs = [
        ("What symptoms indicate an immediate pet veterinary emergency in Lahore?", "Immediate red-flag emergencies include: non-stop vomiting or dry-heaving with an enlarged hard abdomen (suspected bloat/GDV), difficulty breathing or blue-tinted gums, sudden collapse, seizures lasting more than 2 minutes, blunt trauma from a road accident, ingestion of rat poison or human paracetamol, and inability of a male cat to urinate (urinary blockage). Call Dr. Rehman immediately at +92 311 4899904."),
        ("Can Dr. Rehman visit my home for an emergency in Lahore?", "Yes. We operate a dedicated mobile veterinary unit equipped with emergency stabilization drugs, injectable fluids, oxygen concentrator, and wound trauma supplies. Depending on your location in Lahore (DHA, Gulberg, Model Town, Bahria), average mobile dispatch response time is 30 to 50 minutes. For critical surgical stabilization, clinic transport is coordinated."),
        ("What should I do if my pet ingests rat poison or human medication?", "Never induce vomiting with salt water as this can cause fatal hypernatremia (salt toxicity). Immediately keep the packaging of the toxin, prevent the pet from eating or drinking further, and call Dr. Rehman. Specific antidotes (such as Vitamin K1 for anticoagulant rodenticides) must be administered under veterinary supervision within the golden hour."),
        ("What are the costs associated with after-hours emergency veterinary care?", "Emergency triage and physical clinical exam ranges between Rs. 2,500 to Rs. 4,500 depending on the hour (daytime vs late night). Emergency IV fluids and medication administration typically range from Rs. 2,000 to Rs. 4,500. We provide 100% transparent cost estimates upfront before commencing specialized procedures.")
    ]

    related = [
        ("24 Hour Vet Clinic in Lahore", "/services/24-hour-vet-clinic-lahore.html", "Round-the-clock urgent pet care, night doctor visits, and telehealth triage across Lahore."),
        ("Home Visit Veterinary Services", "/services/home-visit-veterinary.html", "Doorstep clinical checkups, mobile vaccinations, and stress-free care at your residence."),
        ("Canine Parvovirus Protocol", "/blog/parvovirus-treatment-cost-survival-pakistan.html", "Emergency fluid therapy, antiemetic protocols, and survival rates for sick puppies in Pakistan.")
    ]

    body = f"""
    <!-- Hero Section -->
    <div class="rounded-3xl bg-gradient-to-b from-white to-emerald-50/40 border border-slate-100 p-8 md:p-12 mb-10 shadow-sm">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-4">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          24/7 Rapid Response Emergency Trauma Center
        </div>
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          24/7 Emergency Veterinary Care in Lahore
        </h1>
        <p class="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
          When life-threatening veterinary emergencies happen at 2:00 AM, waiting until morning is not an option. Led by Dr. Rehman Ahmed, DVM, our trauma unit provides round-the-clock emergency care, rapid stabilization, mobile emergency dispatch, and life-saving pet surgery across all areas of Lahore.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="tel:+923114899904" class="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-lg shadow-rose-600/25 flex items-center gap-2">
            <span>🚨 Immediate Call: +92 311 4899904</span>
          </a>
          <a href="https://wa.me/923114899904?text=EMERGENCY:%20Urgent%20pet%20care%20needed%20in%20Lahore." target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-lg shadow-[#25D366]/25 flex items-center gap-2">
            <span>💬 WhatsApp Emergency Triage</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Triage Matrix Cards -->
    <section class="my-12">
      <h2 class="text-2xl font-black text-slate-900 mb-6">Urgent Pet Triage: What Requires Immediate Action?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card 1 -->
        <div class="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm">
          <div class="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 grid place-items-center font-black text-sm mb-4">1</div>
          <h3 class="font-bold text-slate-900 text-base mb-2">Trauma & Road Accidents</h3>
          <p class="text-xs text-slate-600 leading-relaxed mb-3">
            Motor vehicle impacts, high-rise balcony falls, or deep bite lacerations from dog fights. Immediate internal bleeding stabilization, shock management, and bone splinting.
          </p>
          <span class="text-[11px] font-bold text-rose-600 uppercase tracking-wide">Target Action: 0–30 Minutes</span>
        </div>

        <!-- Card 2 -->
        <div class="p-6 rounded-3xl bg-white border border-amber-100 shadow-sm">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 grid place-items-center font-black text-sm mb-4">2</div>
          <h3 class="font-bold text-slate-900 text-base mb-2">Toxicity & Poisoning</h3>
          <p class="text-xs text-slate-600 leading-relaxed mb-3">
            Ingestion of bromadiolone rat poison, human pain killers (Panadol/Brufen), chocolate, lilies (cats), or organophosphate pest control sprays. Antidotes available.
          </p>
          <span class="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Target Action: Golden Hour</span>
        </div>

        <!-- Card 3 -->
        <div class="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm">
          <div class="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 grid place-items-center font-black text-sm mb-4">3</div>
          <h3 class="font-bold text-slate-900 text-base mb-2">Acute Medical Crises</h3>
          <p class="text-xs text-slate-600 leading-relaxed mb-3">
            Bloat (GDV) in large dogs, feline urethral obstruction (straining in litter box), heatstroke with rectal temperature over 104°F, or sudden violent seizures.
          </p>
          <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wide">Target Action: Immediate IV Care</span>
        </div>
      </div>
    </section>

    <!-- Deep Medical Content Section -->
    <article class="prose max-w-none my-12 text-slate-700 text-sm leading-relaxed space-y-6">
      <h2 class="text-2xl font-black text-slate-900">Clinical Emergency Protocols at Rehman Veterinary Clinic</h2>
      <p>
        Veterinary emergency medicine requires rapid diagnostic precision, sterile equipment readiness, and a calm, compassionate bedside manner. Under the clinical supervision of Dr. Rehman Ahmed, DVM, our emergency protocol adheres to international small animal critical care guidelines adapted for the climate and prevalent disease vectors of Lahore.
      </p>

      <h3 class="text-xl font-bold text-slate-900">1. The 15-Minute Emergency Triage Protocol</h3>
      <p>
        When an urgent case arrives or a mobile house-call dispatch is requested, our team performs immediate ABC evaluation (Airway, Breathing, Circulation):
      </p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Airway & Respiratory Assessment:</strong> Evaluation of gum color (cyanotic blue indicates severe hypoxia; brick-red indicates septic shock; porcelain white indicates catastrophic blood loss). High-flow oxygen supplementation is initiated within 60 seconds.</li>
        <li><strong>Cardiovascular Shock Index:</strong> Femoral pulse evaluation, capillary refill time (CRT), and placement of an emergency intravenous catheter (18G–22G) for rapid isotonic fluid resuscitation (Normal Saline or Ringer's Lactate).</li>
        <li><strong>Neurological Screening (Glasgow Coma Scale):</strong> Pupil symmetry, responsiveness, and spinal reflex testing following head trauma or prolonged seizures.</li>
      </ul>

      <h3 class="text-xl font-bold text-slate-900">2. Emergency Diagnostic & Surgical Readiness in Lahore</h3>
      <p>
        Unlike daytime-only clinics that close their doors at 9:00 PM, Rehman Veterinary Clinic maintains emergency diagnostic capabilities throughout the night:
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <h4 class="font-bold text-slate-900 mb-1">Point-of-Care Ultrasound (POCUS)</h4>
          <p class="text-xs text-slate-600">Rapid abdominal (A-FAST) and thoracic (T-FAST) sonography to detect internal hemorrhage, hemoperitoneum, and pleural effusion without moving an unstable patient.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <h4 class="font-bold text-slate-900 mb-1">Stat Blood Hematology Analyzer</h4>
          <p class="text-xs text-slate-600">Complete blood count (CBC) and blood glucose/electrolytes within 12 minutes to diagnose acute anemia, septicemia, and ketoacidosis.</p>
        </div>
      </div>

      <h3 class="text-xl font-bold text-slate-900">3. Emergency Pricing Transparency (PKR 2026 Standards)</h3>
      <p>
        We believe that veterinary medicine must be transparent and ethical. You will never face hidden after-hours fees without prior consultation.
      </p>

      <!-- Pricing Table -->
      <div class="overflow-x-auto my-6 rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-900 text-white font-bold">
              <th class="p-3.5">Emergency Procedure / Service</th>
              <th class="p-3.5">Clinical Scope & What is Included</th>
              <th class="p-3.5">Estimated Cost Range (PKR)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr>
              <td class="p-3.5 font-semibold text-slate-900">Emergency Out-of-Hours Triage</td>
              <td class="p-3.5 text-slate-600">Complete physical exam, vital stabilization, temperature & oxygen saturation</td>
              <td class="p-3.5 font-bold text-emerald-700">Rs. 2,500 – Rs. 4,500</td>
            </tr>
            <tr class="bg-slate-50/50">
              <td class="p-3.5 font-semibold text-slate-900">Oxygen Therapy (Per Hour)</td>
              <td class="p-3.5 text-slate-600">Pure medical oxygen cage support, respiratory monitoring</td>
              <td class="p-3.5 font-bold text-emerald-700">Rs. 1,500 – Rs. 2,500</td>
            </tr>
            <tr>
              <td class="p-3.5 font-semibold text-slate-900">Emergency IV Catheter & Saline Resuscitation</td>
              <td class="p-3.5 text-slate-600">IV cannula placement, infusion set, 1000ml Ringer Lactate/Dextrose</td>
              <td class="p-3.5 font-bold text-emerald-700">Rs. 2,000 – Rs. 3,500</td>
            </tr>
            <tr class="bg-slate-50/50">
              <td class="p-3.5 font-semibold text-slate-900">Emergency Antidote Therapy</td>
              <td class="p-3.5 text-slate-600">Injectable Vitamin K1 (rat poison) or Atropine sulfate (organophosphate)</td>
              <td class="p-3.5 font-bold text-emerald-700">Rs. 2,500 – Rs. 6,000</td>
            </tr>
            <tr>
              <td class="p-3.5 font-semibold text-slate-900">Emergency Soft-Tissue Trauma Surgery</td>
              <td class="p-3.5 text-slate-600">Surgical wound debridement, multi-layer suture under local/gas anesthesia</td>
              <td class="p-3.5 font-bold text-emerald-700">Rs. 8,000 – Rs. 25,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    {render_author_box()}
    {render_emergency_cta()}
    {render_faq_accordion(faqs)}
    {render_related_links(related)}
    """

    out_file = os.path.join(ROOT_DIR, "services", "emergency-veterinary-care.html")
    html = render_page(title, description, keywords, body, json.dumps(schema), breadcrumbs)
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html)
    
    # Copy to dist
    dist_file = os.path.join(DIST_DIR, "services", "emergency-veterinary-care.html")
    os.makedirs(os.path.dirname(dist_file), exist_ok=True)
    shutil.copyfile(out_file, dist_file)
    print(f"Built Page 1: {out_file}")

# -------------------------------------------------------------
# PAGE 2: /services/24-hour-vet-clinic-lahore.html
# -------------------------------------------------------------
def build_page_2():
    title = "24 Hour Vet Clinic in Lahore — Round-the-Clock Urgent Animal Care & Night Doctor"
    description = "Looking for a 24 hour vet clinic in Lahore? Dr. Rehman provides 24/7 emergency veterinary checkups, late night visits, and urgent video triage across Lahore. Call +92 311 4899904."
    keywords = "24 hour vet clinic in lahore, late night vet lahore, 24 7 dog doctor lahore, round the clock pet hospital lahore, animal doctor open now lahore"
    breadcrumbs = [("Home", "/"), ("Services", "/services/emergency-veterinary-care.html"), ("24 Hour Vet Clinic", None)]

    schema = {
        "@context": "https://schema.org",
        "@type": "VeterinaryCare",
        "name": "Rehman Veterinary Clinic — 24 Hour Animal Clinic Lahore",
        "url": f"{BASE_URL}/services/24-hour-vet-clinic-lahore.html",
        "telephone": "+923114899904",
        "openingHours": "Mo-Su 00:00-23:59",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lahore",
            "addressRegion": "Punjab",
            "addressCountry": "PK"
        }
    }

    faqs = [
        ("Are you really open 24 hours including 3:00 AM in Lahore?", "Yes. Veterinary emergencies do not observe office hours. Our emergency hotline (+92 311 4899904) is answered 24 hours a day, 7 days a week, 365 days a year—including Sundays, public holidays, and Eid days."),
        ("What areas does the 24-hour mobile vet service cover in Lahore?", "Our mobile emergency van covers all phases of DHA Lahore (Phase 1 to Phase 8 and Raya), Gulberg, Model Town, Lahore Cantt, Johar Town, Bahria Town, Wapda Town, and surrounding residential societies."),
        ("Can I do a 24-hour video consult before deciding to rush my pet to the clinic?", "Yes. We offer round-the-clock live video triage over WhatsApp. Dr. Rehman examines your pet's breathing, gum color, and behavior via video to advise whether immediate emergency transport is needed or if safe home stabilization can be performed until morning.")
    ]

    related = [
        ("24/7 Emergency Trauma Care", "/services/emergency-veterinary-care.html", "In-depth trauma protocols, poison antidotes, and hospital care in Lahore."),
        ("Pet Vaccination Center Lahore", "/services/pet-vaccination-center.html", "2026 dog and cat vaccine prices, 7-in-1 schedules, and rabies shots."),
        ("Mobile Vet in DHA Lahore", "/locations/dha-lahore-veterinary-clinic.html", "Doorstep animal doctor service across all phases of DHA Lahore.")
    ]

    body = f"""
    <!-- Hero Section -->
    <div class="rounded-3xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 p-8 md:p-12 mb-10 shadow-sm">
      <div class="max-w-3xl">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
          <span class="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          Open 24 Hours · Day & Night Care
        </span>
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          24 Hour Vet Clinic in Lahore
        </h1>
        <p class="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
          Whether it is midnight bloating, sudden puppy seizures, or late-night accident trauma, Rehman Veterinary Clinic provides non-stop veterinary medical services across Lahore. In-person emergency visits, doorstep mobile vet dispatch, and 24/7 live video consultations.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="tel:+923114899904" class="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>📞 Call Doctor Now: +92 311 4899904</span>
          </a>
          <a href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20need%20a%20night%20veterinary%20checkup%20in%20Lahore." target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>💬 WhatsApp Night Triage</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <section class="my-12">
      <h2 class="text-2xl font-black text-slate-900 mb-6">Why Pet Parents Rely On Our 24/7 Practice</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="text-amber-500 font-black text-xl mb-2">⚡ 01</div>
          <h3 class="font-bold text-slate-900 text-sm mb-1">Zero Waiting Line</h3>
          <p class="text-xs text-slate-600">Urgent cases are received immediately by Dr. Rehman without bureaucratic delays.</p>
        </div>
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="text-emerald-600 font-black text-xl mb-2">🚐 02</div>
          <h3 class="font-bold text-slate-900 text-sm mb-1">Mobile Night House Calls</h3>
          <p class="text-xs text-slate-600">Can't transport your large dog or anxious cat? Our mobile van comes directly to your home.</p>
        </div>
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="text-indigo-600 font-black text-xl mb-2">📹 03</div>
          <h3 class="font-bold text-slate-900 text-sm mb-1">24/7 Telehealth Video</h3>
          <p class="text-xs text-slate-600">Instant WhatsApp video call for rapid visual assessment of wounds, breathing, or vomiting.</p>
        </div>
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="text-rose-600 font-black text-xl mb-2">💊 04</div>
          <h3 class="font-bold text-slate-900 text-sm mb-1">All-Night Pharmacy</h3>
          <p class="text-xs text-slate-600">Emergency saline drips, antibiotics, and antidotes stocked around the clock.</p>
        </div>
      </div>
    </section>

    <!-- Detailed Editorial -->
    <article class="prose max-w-none my-12 text-slate-700 text-sm leading-relaxed space-y-6">
      <h2 class="text-2xl font-black text-slate-900">How Our 24-Hour Veterinary Dispatch Works</h2>
      <p>
        Finding an open, qualified veterinarian in Lahore past 10:00 PM is one of the most stressful experiences a pet owner can endure. Most high-street pet shops and commercial clinics shut down early, leaving pet parents searching panicked social media groups for emergency phone numbers.
      </p>
      <p>
        Rehman Veterinary Clinic was designed specifically to eliminate this gap. As a licensed DVM with extensive trauma experience, Dr. Rehman Ahmed provides a single, dependable point of clinical contact across Lahore 24 hours a day.
      </p>
      
      <h3 class="text-xl font-bold text-slate-900">Our 3-Step Night Care Process:</h3>
      <ol class="list-decimal pl-5 space-y-2">
        <li><strong>Step 1 (Instant Phone / WhatsApp Triage):</strong> You call or message +92 311 4899904. You speak directly to the veterinary clinician—not an answering machine. We quickly ascertain vital indicators (gum color, heart rate, body posture).</li>
        <li><strong>Step 2 (Immediate Route Selection):</strong> Depending on patient mobility, we dispatch the mobile emergency unit to your home or prepare the surgical suite for your immediate arrival.</li>
        <li><strong>Step 3 (Continuous Overnight Stabilization):</strong> The patient receives continuous fluid hydration, thermal warming pads, oxygen support, and post-procedure monitoring.</li>
      </ol>
    </article>

    {render_author_box()}
    {render_emergency_cta()}
    {render_faq_accordion(faqs)}
    {render_related_links(related)}
    """

    out_file = os.path.join(ROOT_DIR, "services", "24-hour-vet-clinic-lahore.html")
    html = render_page(title, description, keywords, body, json.dumps(schema), breadcrumbs)
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html)
    
    dist_file = os.path.join(DIST_DIR, "services", "24-hour-vet-clinic-lahore.html")
    os.makedirs(os.path.dirname(dist_file), exist_ok=True)
    shutil.copyfile(out_file, dist_file)
    print(f"Built Page 2: {out_file}")

# -------------------------------------------------------------
# PAGE 3: /services/pet-vaccination-center.html
# -------------------------------------------------------------
def build_page_3():
    title = "Pet Vaccination Price in Pakistan (2026) — Dogs & Cats Vaccination Lahore"
    description = "Complete 2026 dog and cat vaccination price guide in Lahore, Pakistan. Canine 7-in-1, 9-in-1, Rabies, and feline Tricat immunizations at clinic or at home. Call +92 311 4899904."
    keywords = "pet vaccination center lahore, dog vaccination cost in pakistan, cat vaccination price in lahore, puppy vaccination schedule pakistan, rabies vaccine price dogs pakistan, tricat vaccine cat lahore"
    breadcrumbs = [("Home", "/"), ("Services", "/services/emergency-veterinary-care.html"), ("Pet Vaccinations", None)]

    schema = {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        "name": "Canine & Feline Vaccination Protocol",
        "description": "Comprehensive core and non-core immunization protocol for puppies, dogs, kittens, and cats in Pakistan.",
        "procedureType": "NoninvasiveProcedure",
        "bodyLocation": "Subcutaneous injection"
    }

    faqs = [
        ("What is the cost of dog vaccination in Pakistan in 2026?", "A standard 7-in-1 or 9-in-1 canine core vaccine (protecting against Parvovirus, Distemper, Hepatitis, Parainfluenza, and Leptospirosis) costs between Rs. 2,800 to Rs. 4,200 per shot depending on the imported brand (Biocan, Vanguard, or Nobivac). Anti-rabies vaccine costs Rs. 1,200 to Rs. 1,800. Complete puppy courses require 3 booster doses."),
        ("What is the cost of cat vaccination in Lahore?", "A feline core Tricat / FVRCP vaccine (protecting against Feline Panleukopenia, Viral Rhinotracheitis, and Calicivirus) costs between Rs. 2,500 to Rs. 3,800 in Lahore. Annual rabies booster costs Rs. 1,200 to Rs. 1,800."),
        ("Can my puppy or kitten be vaccinated at home in Lahore?", "Yes! In fact, we strongly recommend vaccinating young puppies at home before their 3-shot series is finished. Unvaccinated puppies risk deadly exposure to Parvovirus in clinic waiting rooms. Dr. Rehman brings temperature-controlled cold-chain vaccines directly to your doorstep."),
        ("At what age should puppy vaccination start?", "Puppy vaccination should begin at exactly 6 to 8 weeks of age with the first core 7-in-1 shot, followed by boosters at 9–10 weeks and 12–14 weeks, culminating in the Rabies shot at 16 weeks.")
    ]

    related = [
        ("Home Visit Veterinary Service", "/services/home-visit-veterinary.html", "Doorstep vaccinations and wellness exams across Lahore."),
        ("Parvovirus Treatment Guide", "/blog/parvovirus-treatment-cost-survival-pakistan.html", "Symptoms, treatment costs, and medical recovery protocols for unvaccinated puppies."),
        ("24/7 Emergency Care", "/services/emergency-veterinary-care.html", "Urgent care for adverse vaccine reactions, fever, or trauma.")
    ]

    body = f"""
    <!-- Hero Section -->
    <div class="rounded-3xl bg-gradient-to-b from-white to-emerald-50/50 border border-emerald-100 p-8 md:p-12 mb-10 shadow-sm">
      <div class="max-w-3xl">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
          💉 Official PVMC Immunization Protocols · 2026 Price Transparency
        </span>
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Pet Vaccination Center Lahore & 2026 Price Guide
        </h1>
        <p class="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
          Vaccinating your pet is the single most effective barrier against fatal viral infections including Parvovirus, Canine Distemper, and Feline Panleukopenia. Dr. Rehman Ahmed, DVM provides 100% cold-chain verified vaccines administered at our clinic or directly in the comfort of your home.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20want%20to%20book%20a%20pet%20vaccination%20in%20Lahore." target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>📅 Book Vaccination Appointment</span>
          </a>
          <a href="tel:+923114899904" class="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>📞 Call Dr. Rehman: +92 311 4899904</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Official 2026 Pricing Matrix -->
    <section class="my-12">
      <div class="text-center max-w-2xl mx-auto mb-8">
        <h2 class="text-2xl md:text-3xl font-black text-slate-900">Official 2026 Pet Vaccination Price List (Pakistan)</h2>
        <p class="text-xs md:text-sm text-slate-600 mt-2">All vaccines are imported European/American brands stored strictly at 2°C – 8°C in medical refrigeration units.</p>
      </div>

      <div class="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-emerald-900 text-white font-bold text-[13px]">
              <th class="p-4">Vaccine Type</th>
              <th class="p-4">Target Pathogens Covered</th>
              <th class="p-4">Recommended Age</th>
              <th class="p-4">Price Range (PKR)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr class="hover:bg-emerald-50/30 transition">
              <td class="p-4 font-bold text-slate-900">Canine 7-in-1 Core Vaccine</td>
              <td class="p-4 text-slate-600">Parvovirus, Distemper, Hepatitis, Parainfluenza, Leptospirosis (2 strains)</td>
              <td class="p-4 text-slate-700 font-semibold">6–8 Weeks (Shot 1)</td>
              <td class="p-4 font-black text-emerald-700 text-sm">Rs. 2,800 – Rs. 3,800</td>
            </tr>
            <tr class="bg-slate-50/60 hover:bg-emerald-50/30 transition">
              <td class="p-4 font-bold text-slate-900">Canine 9-in-1 Premium Vaccine</td>
              <td class="p-4 text-slate-600">7-in-1 coverage + Coronavirus & Leptospira canicola/grippotyphosa</td>
              <td class="p-4 text-slate-700 font-semibold">10–12 Weeks (Shot 2 & 3)</td>
              <td class="p-4 font-black text-emerald-700 text-sm">Rs. 3,400 – Rs. 4,500</td>
            </tr>
            <tr class="hover:bg-emerald-50/30 transition">
              <td class="p-4 font-bold text-slate-900">Feline Tricat / FVRCP Core</td>
              <td class="p-4 text-slate-600">Feline Panleukopenia, Calicivirus, Viral Rhinotracheitis (Cat Flu)</td>
              <td class="p-4 text-slate-700 font-semibold">8–9 Weeks (Kittens)</td>
              <td class="p-4 font-black text-emerald-700 text-sm">Rs. 2,500 – Rs. 3,800</td>
            </tr>
            <tr class="bg-slate-50/60 hover:bg-emerald-50/30 transition">
              <td class="p-4 font-bold text-slate-900">Anti-Rabies Vaccine (Dogs & Cats)</td>
              <td class="p-4 text-slate-600">100% Protection against fatal Rabies virus (Rabisin / Defensor)</td>
              <td class="p-4 text-slate-700 font-semibold">14–16 Weeks & Annual</td>
              <td class="p-4 font-black text-emerald-700 text-sm">Rs. 1,200 – Rs. 1,800</td>
            </tr>
            <tr class="hover:bg-emerald-50/30 transition">
              <td class="p-4 font-bold text-slate-900">Broad-Spectrum Deworming</td>
              <td class="p-4 text-slate-600">Roundworms, Hookworms, Tapeworms, Whipworms (Tablet / Oral syrup)</td>
              <td class="p-4 text-slate-700 font-semibold">Every 3 Months</td>
              <td class="p-4 font-black text-emerald-700 text-sm">Rs. 500 – Rs. 1,200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Detailed Schedules -->
    <article class="prose max-w-none my-12 text-slate-700 text-sm leading-relaxed space-y-6">
      <h2 class="text-2xl font-black text-slate-900">Standard Puppy & Kitten Immunization Schedules (Pakistan)</h2>
      
      <h3 class="text-xl font-bold text-slate-900">🐶 Complete Puppy Immunization Schedule:</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Week 6–8 (First Shot):</strong> 7-in-1 Core Vaccine + Complete Oral Deworming. Crucial for establishing immunity as maternal antibodies begin to wane.</li>
        <li><strong>Week 10–12 (Second Shot):</strong> 9-in-1 Booster Vaccine. Solidifies antibody titers against highly contagious Parvo and Distemper strains.</li>
        <li><strong>Week 14–16 (Third Shot + Rabies):</strong> Final Puppy Core Booster + Anti-Rabies Vaccine + Official PVMC Immunization Passport stamping.</li>
        <li><strong>Annual Booster:</strong> Single 9-in-1 and Anti-Rabies injection given once every 12 months for lifelong protection.</li>
      </ul>

      <h3 class="text-xl font-bold text-slate-900">🐱 Complete Kitten Immunization Schedule:</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Week 8–9 (First Shot):</strong> Feline Tricat (FVRCP) Core Vaccine. Essential for Persian, Siamese, and domestic shorthairs to prevent deadly feline enteritis.</li>
        <li><strong>Week 12 (Second Shot):</strong> Tricat Booster + Oral Dewormer.</li>
        <li><strong>Week 16:</strong> Feline Anti-Rabies Vaccine.</li>
        <li><strong>Annual Booster:</strong> Single Tricat + Rabies booster once per year.</li>
      </ul>

      <div class="my-6 p-6 rounded-2xl bg-amber-50 border border-amber-200">
        <h4 class="font-bold text-amber-900 mb-1">⚠️ Clinical Cold-Chain Warning:</h4>
        <p class="text-xs text-amber-800 leading-relaxed">
          Veterinary vaccines lose 100% of their protective potency if exposed to ambient Pakistani summer temperatures for more than 40 minutes. At Rehman Veterinary Clinic, all vaccines are transported in specialized active digital ice-pack coolers with real-time temperature tracking. Never accept a warm vaccine vial!
        </p>
      </div>
    </article>

    {render_author_box()}
    {render_emergency_cta()}
    {render_faq_accordion(faqs)}
    {render_related_links(related)}
    """

    out_file = os.path.join(ROOT_DIR, "services", "pet-vaccination-center.html")
    html = render_page(title, description, keywords, body, json.dumps(schema), breadcrumbs)
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html)
    
    dist_file = os.path.join(DIST_DIR, "services", "pet-vaccination-center.html")
    os.makedirs(os.path.dirname(dist_file), exist_ok=True)
    shutil.copyfile(out_file, dist_file)
    print(f"Built Page 3: {out_file}")

# -------------------------------------------------------------
# PAGE 4: /services/home-visit-veterinary.html
# -------------------------------------------------------------
def build_page_4():
    title = "Home Visit Vet in Lahore — Doorstep Mobile Veterinary Care & In-Home Checkups"
    description = "Professional veterinary doctor at home in Lahore. Complete doorstep examinations, mobile vaccinations, blood tests, and stress-free care across DHA, Gulberg & Bahria Town. Call +92 311 4899904."
    keywords = "home visit vet in lahore, veterinary doctor at home lahore, mobile pet doctor lahore, doorstep animal clinic lahore, cat home visit vet lahore"
    breadcrumbs = [("Home", "/"), ("Services", "/services/emergency-veterinary-care.html"), ("Home Visit Vet", None)]

    schema = {
        "@context": "https://schema.org",
        "@type": "VeterinaryCare",
        "name": "Rehman Veterinary Clinic — Mobile House Call Vet Lahore",
        "url": f"{BASE_URL}/services/home-visit-veterinary.html",
        "telephone": "+923114899904",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lahore",
            "addressRegion": "Punjab",
            "addressCountry": "PK"
        }
    }

    faqs = [
        ("How does a mobile veterinary house call work in Lahore?", "Dr. Rehman arrives directly at your home with a fully equipped medical mobile unit containing clinical diagnostics, medications, vaccines, and sterile surgical supplies. Your pet is examined in their calm, familiar living room environment without cage anxiety, car motion sickness, or waiting room pathogens."),
        ("What procedures can be performed at home?", "We perform comprehensive physical examinations, puppy and kitten vaccinations, blood collection for CBC and biochemical analysis, ear cleaning, skin allergy scrapings, wound dressing, subcutaneous fluid hydration, and peaceful at-home euthanasia."),
        ("What are the charges for a home visit in Lahore?", "A standard mobile home visit examination fee typically ranges from Rs. 2,000 to Rs. 3,500 depending on distance and locality within Lahore (DHA, Gulberg, Model Town, Johar Town, Bahria Town). Any medications, diagnostic tests, or vaccines administered are billed transparently at standard clinical rates."),
        ("How far in advance should I book a home visit?", "Routine wellness visits can be booked same-day or 24 hours in advance via WhatsApp. For urgent medical emergencies, priority mobile dispatch is available around the clock.")
    ]

    related = [
        ("Pet Vaccination Center Lahore", "/services/pet-vaccination-center.html", "Core 7-in-1 and Tricat vaccines administered stress-free at home."),
        ("Best Vet in DHA Lahore", "/locations/dha-lahore-veterinary-clinic.html", "Mobile house calls across all phases of DHA Lahore and Raya."),
        ("24/7 Emergency Care", "/services/emergency-veterinary-care.html", "Urgent trauma and critical care facilities in Lahore.")
    ]

    body = f"""
    <!-- Hero Section -->
    <div class="rounded-3xl bg-gradient-to-b from-white to-amber-50/40 border border-amber-100 p-8 md:p-12 mb-10 shadow-sm">
      <div class="max-w-3xl">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-4">
          🚐 Hospital-Grade Care Directly at Your Doorstep
        </span>
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Professional Home Visit Vet in Lahore
        </h1>
        <p class="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
          No stressful car rides. No barking waiting rooms. No risk of your unvaccinated kitten catching infectious viruses. Dr. Rehman Ahmed, DVM brings 9+ years of clinical excellence directly to your home across Lahore.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20would%20like%20to%20schedule%20a%20home%20visit%20vet%20in%20Lahore." target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>📅 Schedule Doorstep Visit</span>
          </a>
          <a href="tel:+923114899904" class="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>📞 Call: +92 311 4899904</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Benefits Grid -->
    <section class="my-12">
      <h2 class="text-2xl font-black text-slate-900 mb-6">The Doorstep Veterinary Advantage</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 grid place-items-center font-black text-base mb-4">🐱</div>
          <h3 class="font-bold text-slate-900 text-base mb-2">Zero Carrier Stress</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Cats and anxious dogs experience extreme cortisol spikes during car travel and clinic visits. At home, heart rate and vitals remain natural and stress-free.
          </p>
        </div>
        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 grid place-items-center font-black text-base mb-4">🛡️</div>
          <h3 class="font-bold text-slate-900 text-base mb-2">Zero Waiting Room Disease</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Unvaccinated puppies are highly vulnerable to airborne parvovirus and kennel cough present in crowded animal clinics. In-home visits protect their immune system.
          </p>
        </div>
        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div class="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 grid place-items-center font-black text-base mb-4">⏰</div>
          <h3 class="font-bold text-slate-900 text-base mb-2">Convenient Multi-Pet Care</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Have multiple cats or dogs? Dr. Rehman can examine, vaccinate, and deworm all your pets in a single visit without you wrestling multiple carriers.
          </p>
        </div>
      </div>
    </section>

    <!-- Mobile Van Specs -->
    <article class="prose max-w-none my-12 text-slate-700 text-sm leading-relaxed space-y-6">
      <h2 class="text-2xl font-black text-slate-900">Equipped Mobile Veterinary Medical Unit</h2>
      <p>
        A professional house call is not just a stethoscope in a briefcase. Dr. Rehman travels with a dedicated mobile unit configured with clinical-grade equipment:
      </p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Digital Diagnostic Kit:</strong> Otoscope for deep ear canal inspection, ophthalmoscope for corneal and retinal exam, Woods lamp for feline ringworm detection.</li>
        <li><strong>Active Cold-Chain Vaccine Transport:</strong> Medical coolers maintaining 4°C for high-titer imported vaccines.</li>
        <li><strong>On-Site Phlebotomy & Centrifuge:</strong> Blood samples are drawn safely, spun immediately to prevent hemolysis, and delivered to our diagnostic laboratory.</li>
        <li><strong>Pharmacy Stock:</strong> Injectable antiemetics, broad-spectrum antibiotics, pain relief, eye/ear drops, and prescription medicated shampoos.</li>
      </ul>
    </article>

    {render_author_box()}
    {render_emergency_cta()}
    {render_faq_accordion(faqs)}
    {render_related_links(related)}
    """

    out_file = os.path.join(ROOT_DIR, "services", "home-visit-veterinary.html")
    html = render_page(title, description, keywords, body, json.dumps(schema), breadcrumbs)
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html)
    
    dist_file = os.path.join(DIST_DIR, "services", "home-visit-veterinary.html")
    os.makedirs(os.path.dirname(dist_file), exist_ok=True)
    shutil.copyfile(out_file, dist_file)
    print(f"Built Page 4: {out_file}")

# -------------------------------------------------------------
# PAGE 5: /locations/dha-lahore-veterinary-clinic.html
# -------------------------------------------------------------
def build_page_5():
    title = "Best Vet in DHA Lahore — Mobile Vet & Emergency Pet Hospital (Phases 1 to 8 & Raya)"
    description = "Expert veterinary care in DHA Lahore. Fast mobile house calls, routine vaccinations, diagnostics, and 24/7 emergency pet care across DHA Phase 1 through 8, Phase 9 Prism, and DHA Raya. Call +92 311 4899904."
    keywords = "best vet in dha lahore, pet clinic dha lahore, emergency vet dha phase 5, animal doctor raya dha lahore, mobile vet dha lahore phases 1 to 8"
    breadcrumbs = [("Home", "/"), ("Locations", None), ("DHA Lahore", None)]

    schema = {
        "@context": "https://schema.org",
        "@type": "VeterinaryCare",
        "name": "Rehman Veterinary Clinic — DHA Lahore Mobile & Emergency Care",
        "url": f"{BASE_URL}/locations/dha-lahore-veterinary-clinic.html",
        "telephone": "+923114899904",
        "areaServed": "Defence Housing Authority (DHA) Lahore",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "DHA Lahore",
            "addressRegion": "Punjab",
            "addressCountry": "PK"
        }
    }

    faqs = [
        ("How fast can Dr. Rehman arrive at my house in DHA Lahore for an emergency?", "For priority emergencies across DHA Lahore (Phases 1, 2, 3, 4, 5, 6, 7, 8 and Raya), average response time is 25 to 40 minutes. We advise immediate telephone triage while the mobile unit is on route."),
        ("Do you provide home vaccinations for puppies in DHA Phase 5 and 6?", "Yes, we regularly conduct doorstep puppy immunization and kitten checkups across Phase 5, Phase 6, Phase 7, and Phase 8. Full PVMC official vaccination cards are issued on the spot."),
        ("Is there an extra travel fee for DHA Raya or Phase 9 Prism?", "Our standard mobile visit fee covers all DHA phases equally. Transparent flat-rate travel fees apply without unexpected surcharges.")
    ]

    related = [
        ("Home Visit Veterinary Services", "/services/home-visit-veterinary.html", "Comprehensive mobile veterinary care across Lahore."),
        ("24/7 Emergency Care", "/services/emergency-veterinary-care.html", "Immediate trauma, bloat, and poisoning emergency triage."),
        ("Pet Vaccination Center", "/services/pet-vaccination-center.html", "Official 2026 dog and cat immunization price list.")
    ]

    body = f"""
    <!-- Hero Section -->
    <div class="rounded-3xl bg-gradient-to-b from-white to-emerald-50/40 border border-slate-100 p-8 md:p-12 mb-10 shadow-sm">
      <div class="max-w-3xl">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
          📍 Dedicated DHA Lahore Veterinary Coverage
        </span>
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Best Vet in DHA Lahore (Phases 1 to 8 & Raya)
        </h1>
        <p class="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
          Providing high-touch mobile veterinary care, urgent emergency trauma response, and routine doorstep wellness exams across all sectors of Defence Housing Authority, Lahore. Trusted by over 1,200 pet parents in DHA.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="tel:+923114899904" class="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>📞 Call DHA Vet: +92 311 4899904</span>
          </a>
          <a href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20live%20in%20DHA%20Lahore%20and%20need%20a%20vet%20visit." target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>💬 WhatsApp DHA Booking</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Sector Coverage -->
    <section class="my-12">
      <h2 class="text-2xl font-black text-slate-900 mb-6">Full Coverage Across DHA Lahore Sectors</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
        <div class="p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 shadow-sm">Phase 1 & 2</div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 shadow-sm">Phase 3 & 4</div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 shadow-sm">Phase 5 (CCA)</div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 shadow-sm">Phase 6 (Main)</div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 shadow-sm">Phase 7 & 8</div>
        <div class="p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 shadow-sm">DHA Raya & Prism</div>
      </div>
    </section>

    <!-- Narrative -->
    <article class="prose max-w-none my-12 text-slate-700 text-sm leading-relaxed space-y-6">
      <h2 class="text-2xl font-black text-slate-900">Why DHA Pet Parents Choose Dr. Rehman</h2>
      <p>
        DHA Lahore is home to the highest concentration of pedigree dogs and cats in Pakistan—including high-maintenance Persian cats, Golden Retrievers, German Shepherds, and French Bulldogs. These breeds require specialized veterinary care, precise parasite prevention, and rapid medical attention when symptoms arise.
      </p>
      <p>
        Rather than loading a 40kg stressed dog into your car or risking carrier trauma with a Persian cat along crowded ring-road traffic, Dr. Rehman Ahmed arrives directly at your residence with full clinical equipment.
      </p>
    </article>

    {render_author_box()}
    {render_emergency_cta()}
    {render_faq_accordion(faqs)}
    {render_related_links(related)}
    """

    out_file = os.path.join(ROOT_DIR, "locations", "dha-lahore-veterinary-clinic.html")
    html = render_page(title, description, keywords, body, json.dumps(schema), breadcrumbs)
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html)
    
    dist_file = os.path.join(DIST_DIR, "locations", "dha-lahore-veterinary-clinic.html")
    os.makedirs(os.path.dirname(dist_file), exist_ok=True)
    shutil.copyfile(out_file, dist_file)
    print(f"Built Page 5: {out_file}")

# -------------------------------------------------------------
# PAGE 6: /blog/parvovirus-treatment-cost-survival-pakistan.html
# -------------------------------------------------------------
def build_page_6():
    title = "Canine Parvovirus Treatment in Pakistan (2026) — Costs, Saline Drips & Survival"
    description = "Comprehensive medical guide by Dr. Rehman on canine parvovirus in Pakistan. Symptoms, IV fluid therapy, antiemetics, home vs clinic protocol, treatment costs, and survival rates."
    keywords = "parvovirus treatment for dogs in pakistan, parvo drip cost lahore, puppy parvo survival rate, parvo symptoms in dogs in urdu, puppy loose motion blood treatment lahore"
    breadcrumbs = [("Home", "/"), ("Blog", None), ("Parvovirus Treatment Guide", None)]

    schema = {
        "@context": "https://schema.org",
        "@type": "MedicalScholarlyArticle",
        "headline": "Canine Parvovirus Clinical Treatment Protocol and Survival Rates in Pakistan",
        "author": {
            "@type": "Person",
            "name": "Dr. Rehman Ahmed, DVM"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Rehman Veterinary Clinic"
        },
        "datePublished": "2026-09-17"
    }

    faqs = [
        ("What are the early symptoms of Parvovirus in a puppy?", "The earliest signs are sudden lethargy, refusal to eat or drink, and persistent vomiting of frothy yellow or white foam. Within 24 hours, this progresses to severe, foul-smelling diarrhea with dark red blood, severe dehydration, and subnormal body temperature. Every hour of delay drastically lowers survival."),
        ("What is the cost of Parvovirus treatment in Pakistan?", "Comprehensive Parvovirus treatment over 4 to 6 days typically costs between Rs. 18,000 to Rs. 45,000 in Pakistan. This covers twice-daily intravenous saline fluid therapy (Ringer Lactate with Dextrose and Potassium), injectable antiemetics (Maropitant / Ondansetron), broad-spectrum antibiotics to prevent sepsis, gastroprotectants, and nursing care."),
        ("Can a puppy survive Parvovirus if treated at home?", "Yes. If hospitalization is financially prohibitive or clinic beds are full, Dr. Rehman coordinates an intensive at-home IV fluid and injectable medication protocol. With early diagnosis and rigorous fluid hydration, survival rates exceed 80% to 85%."),
        ("How do I disinfect my house in Lahore after Parvovirus?", "Standard household floor cleaners and Dettol do NOT kill Parvovirus virions. You must use diluted household bleach (1 part bleach to 30 parts water) on all washable tile surfaces and let it sit for at least 10–15 minutes before wiping. Unvaccinated puppies must not enter the premises for at least 6 to 12 months.")
    ]

    related = [
        ("24/7 Emergency Care", "/services/emergency-veterinary-care.html", "Emergency fluid resuscitation and shock therapy for sick puppies."),
        ("Pet Vaccination Center", "/services/pet-vaccination-center.html", "How to prevent Parvovirus through core 7-in-1 puppy vaccinations."),
        ("Home Visit Veterinary Services", "/services/home-visit-veterinary.html", "At-home IV drip administration and puppy nursing care in Lahore.")
    ]

    body = f"""
    <!-- Hero Section -->
    <div class="rounded-3xl bg-gradient-to-b from-white to-rose-50/50 border border-rose-100 p-8 md:p-12 mb-10 shadow-sm">
      <div class="max-w-3xl">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-4">
          🔬 Clinical Medical Guide · Dr. Rehman Ahmed, DVM
        </span>
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Canine Parvovirus in Pakistan: Treatment, Drip Costs & Survival Guide (2026)
        </h1>
        <p class="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
          Canine Parvovirus (CPV-2) is the number-one killer of puppies under 6 months of age in Pakistan. However, Parvo is NOT an automatic death sentence. With immediate aggressive IV fluid resuscitation and supportive medical care, survival rates can exceed 85%.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="tel:+923114899904" class="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>🚨 Urgent Parvo Helpline: +92 311 4899904</span>
          </a>
          <a href="https://wa.me/923114899904?text=PARVO%20EMERGENCY:%20My%20puppy%20has%20vomiting%20and%20bloody%20diarrhea." target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-md flex items-center gap-2">
            <span>💬 WhatsApp Triage</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <article class="prose max-w-none my-12 text-slate-700 text-sm leading-relaxed space-y-6">
      <h2 class="text-2xl font-black text-slate-900">Understanding Pathophysiology: What Happens to the Puppy?</h2>
      <p>
        Canine Parvovirus is an extremely hardy, non-enveloped DNA virus. Upon ingestion, it attacks rapidly dividing cells—specifically the crypt cells of the intestinal lining (villi) and the bone marrow.
      </p>
      <p>
        As the intestinal villi slough off, the puppy loses the ability to absorb water and nutrients. Bacteria from the gut leak into the bloodstream, causing rapid systemic sepsis, hypovolemic shock, and severe electrolyte depletion (hypokalemia and hypoglycemia).
      </p>

      <div class="my-6 p-6 rounded-2xl bg-rose-50 border border-rose-200">
        <h3 class="font-bold text-rose-900 text-base mb-2">⚠️ Never Force Oral Liquids During Active Vomiting</h3>
        <p class="text-xs text-rose-800 leading-relaxed">
          A common mistake made by pet owners in Pakistan is syringing ORS, milk, or chicken broth into a vomiting puppy. When the stomach is inflamed (acute gastroenteritis), anything introduced orally triggers violent vomiting, accelerating fatal dehydration. <strong>Hydration MUST be administered intravenously (IV).</strong>
        </p>
      </div>

      <h2 class="text-2xl font-black text-slate-900">The Gold-Standard Medical Protocol for Parvovirus</h2>
      <ol class="list-decimal pl-5 space-y-3">
        <li><strong>Aggressive Intravenous (IV) Fluid Therapy:</strong> Ringer's Lactate solution supplemented with 5% Dextrose and Potassium Chloride (KCl) to compensate for massive ongoing losses from vomiting and diarrhea.</li>
        <li><strong>Potent Antiemetics (Vomiting Control):</strong> Maropitant (Cerenia) or Ondansetron administered intravenously every 12 to 24 hours to calm gastric spasms.</li>
        <li><strong>Broad-Spectrum Antimicrobial Coverage:</strong> Injectable Amoxicillin-Clavulanate and Metronidazole to prevent secondary bacterial sepsis across the damaged intestinal barrier.</li>
        <li><strong>Gastrointestinal Mucosal Protectants:</strong> Sucralfate suspension and Pantoprazole / Famotidine to coat ulcerated gut lining.</li>
        <li><strong>Early Enteral Micro-Nutrition:</strong> Once vomiting is controlled for 12 hours, micro-nutritional feeding (liquid recovery diet) is introduced to stimulate intestinal cell regeneration.</li>
      </ol>

      <h2 class="text-2xl font-black text-slate-900">Cost Breakdown of Parvovirus Care in Lahore (PKR)</h2>
      <div class="overflow-x-auto my-6 rounded-2xl border border-slate-200 shadow-sm bg-white">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-900 text-white font-bold">
              <th class="p-3.5">Component of Care</th>
              <th class="p-3.5">Medical Specifics</th>
              <th class="p-3.5">Cost in Pakistan (PKR)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr>
              <td class="p-3.5 font-bold text-slate-900">Rapid Parvo Antigen Test</td>
              <td class="p-3.5 text-slate-600">Fecal CPV Ag rapid cassette test (results in 10 minutes)</td>
              <td class="p-3.5 font-bold text-emerald-700">Rs. 2,000 – Rs. 3,500</td>
            </tr>
            <tr class="bg-slate-50/50">
              <td class="p-3.5 font-bold text-slate-900">Daily IV Fluid Therapy & Infusion</td>
              <td class="p-3.5 text-slate-600">IV cannula, infusion sets, Ringer Lactate/Dextrose bags (2x daily)</td>
              <td class="p-3.5 font-bold text-emerald-700">Rs. 2,500 – Rs. 4,500 / day</td>
            </tr>
            <tr>
              <td class="p-3.5 font-bold text-slate-900">Daily Injectable Medication Regimen</td>
              <td class="p-3.5 text-slate-600">Cerenia/Ondansetron, IV antibiotics, multivitamins, pain relief</td>
              <td class="p-3.5 font-bold text-emerald-700">Rs. 2,000 – Rs. 4,000 / day</td>
            </tr>
            <tr class="bg-slate-50/50">
              <td class="p-3.5 font-bold text-slate-900">Complete 4–6 Day Treatment Course</td>
              <td class="p-3.5 text-slate-600">Full recovery cycle including nursing, fluids, and discharge meds</td>
              <td class="p-3.5 font-bold text-emerald-700">Rs. 18,000 – Rs. 45,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    {render_author_box()}
    {render_emergency_cta()}
    {render_faq_accordion(faqs)}
    {render_related_links(related)}
    """

    out_file = os.path.join(ROOT_DIR, "blog", "parvovirus-treatment-cost-survival-pakistan.html")
    html = render_page(title, description, keywords, body, json.dumps(schema), breadcrumbs)
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html)
    
    dist_file = os.path.join(DIST_DIR, "blog", "parvovirus-treatment-cost-survival-pakistan.html")
    os.makedirs(os.path.dirname(dist_file), exist_ok=True)
    shutil.copyfile(out_file, dist_file)
    print(f"Built Page 6: {out_file}")

# -------------------------------------------------------------
# GENERATE SITEMAP & SYNC
# -------------------------------------------------------------
def build_sitemap():
    urls = [
        (f"{BASE_URL}/", "2026-09-17", "daily", "1.0"),
        (f"{BASE_URL}/services/emergency-veterinary-care.html", "2026-09-17", "weekly", "0.9"),
        (f"{BASE_URL}/services/24-hour-vet-clinic-lahore.html", "2026-09-17", "weekly", "0.8"),
        (f"{BASE_URL}/services/pet-vaccination-center.html", "2026-09-17", "weekly", "0.9"),
        (f"{BASE_URL}/services/home-visit-veterinary.html", "2026-09-17", "weekly", "0.9"),
        (f"{BASE_URL}/locations/dha-lahore-veterinary-clinic.html", "2026-09-17", "weekly", "0.8"),
        (f"{BASE_URL}/blog/parvovirus-treatment-cost-survival-pakistan.html", "2026-09-17", "weekly", "0.8"),
    ]

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for loc, lastmod, freq, prio in urls:
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{loc}</loc>")
        xml_lines.append(f"    <lastmod>{lastmod}</lastmod>")
        xml_lines.append(f"    <changefreq>{freq}</changefreq>")
        xml_lines.append(f"    <priority>{prio}</priority>")
        xml_lines.append("  </url>")
    xml_lines.append("</urlset>")

    sitemap_content = "\n".join(xml_lines)
    
    root_sitemap = os.path.join(ROOT_DIR, "sitemap.xml")
    with open(root_sitemap, "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    
    dist_sitemap = os.path.join(DIST_DIR, "sitemap.xml")
    with open(dist_sitemap, "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    print("Updated root and dist sitemap.xml")

if __name__ == "__main__":
    print("Starting Rehman Vet Clinic Page Generation...")
    build_page_1()
    build_page_2()
    build_page_3()
    build_page_4()
    build_page_5()
    build_page_6()
    build_sitemap()
    print("All 6 SEO pages generated and synced to dist successfully!")
