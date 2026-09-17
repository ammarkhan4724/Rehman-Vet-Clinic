import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_master_seo_workbook():
    wb = openpyxl.Workbook()
    
    # Fonts & Colors (Modern Executive Palette: Slate Navy & Forest Emerald)
    font_title = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
    font_section = Font(name="Calibri", size=12, bold=True, color="1E293B")
    font_header = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    font_data = Font(name="Calibri", size=10, color="0F172A")
    font_bold = Font(name="Calibri", size=10, bold=True, color="0F172A")
    font_small = Font(name="Calibri", size=9, italic=True, color="64748B")
    
    fill_navy = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    fill_header = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid") # Deep Blue
    fill_header_emerald = PatternFill(start_color="065F46", end_color="065F46", fill_type="solid") # Emerald
    fill_header_slate = PatternFill(start_color="334155", end_color="334155", fill_type="solid") # Slate
    fill_zebra = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    
    # Priority fills
    fill_p1 = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid") # Red soft
    fill_p2 = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid") # Amber soft
    fill_p3 = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid") # Green soft
    
    border_thin = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )
    border_header = Border(
        left=Side(style='thin', color='0F172A'),
        right=Side(style='thin', color='0F172A'),
        top=Side(style='medium', color='0F172A'),
        bottom=Side(style='medium', color='0F172A')
    )

    # -------------------------------------------------------------
    # SHEET 1: Master Keyword Research (Low KD 0-12)
    # -------------------------------------------------------------
    ws1 = wb.active
    ws1.title = "Low-KD Keyword Master List"
    ws1.views.sheetView[0].showGridLines = True
    
    headers1 = [
        "Keyword", 
        "Topic Cluster",
        "Target Location", 
        "Monthly Volume (PK/Reg)", 
        "Ahrefs KD (0-100)", 
        "Search Intent", 
        "Funnel Stage", 
        "Target Page URL / Slug", 
        "Target Word Count", 
        "Competitor Weakness / Low DR Ranking", 
        "Priority"
    ]
    
    keywords_data = [
        # Emergency & Urgent BoFu
        ("24 hour vet clinic in lahore", "Emergency Care", "Lahore", "350 - 500", 7, "Transactional", "BoFu", "/services/emergency-vet-lahore", "1,500+ words", "Only UVAS & general directories; thin clinic landing pages", "P1 - Critical"),
        ("emergency vet clinic islamabad", "Emergency Care", "Islamabad", "250 - 450", 6, "Transactional", "BoFu", "/services/emergency-vet-islamabad", "1,500+ words", "No dedicated emergency landing page ranking; mostly FB pages", "P1 - Critical"),
        ("emergency pet hospital rawalpindi", "Emergency Care", "Rawalpindi", "200 - 350", 5, "Transactional", "BoFu", "/services/emergency-vet-rawalpindi", "1,500+ words", "Local Google map listings lack dedicated high-authority web pages", "P1 - Critical"),
        ("sunday open vet clinic lahore", "Emergency Care", "Lahore", "200 - 300", 3, "Transactional", "BoFu", "/services/sunday-open-vet-lahore", "1,200+ words", "Low competition; pet owners desperate on weekends", "P1 - Critical"),
        ("home visit vet in lahore", "Home Veterinary", "Lahore", "200 - 350", 4, "Commercial", "BoFu", "/services/home-visit-vet-lahore", "1,500+ words", "Matchvet (DR 14) ranking with thin 400-word page", "P1 - Critical"),
        ("home visit vet in islamabad", "Home Veterinary", "Islamabad", "150 - 250", 3, "Commercial", "BoFu", "/services/home-visit-vet-islamabad", "1,500+ words", "Low DR clinics and Instagram pages dominate search", "P1 - Critical"),
        ("veterinary doctor at home rawalpindi", "Home Veterinary", "Rawalpindi", "100 - 200", 2, "Commercial", "BoFu", "/services/home-visit-vet-rawalpindi", "1,200+ words", "Practically zero dedicated optimized service pages", "P1 - Critical"),
        ("emergency dog surgery lahore", "Surgical Services", "Lahore", "80 - 150", 5, "Transactional", "BoFu", "/services/pet-surgery/emergency-surgery", "1,500+ words", "AVH (DR 18) ranks with basic text, no structured schema", "P1 - Critical"),
        ("pet ambulance service lahore", "Emergency Care", "Lahore", "100 - 180", 2, "Transactional", "BoFu", "/services/pet-ambulance-lahore", "1,000+ words", "Untapped search query in Lahore; high emergency intent", "P2 - High"),

        # Clinical Core Services & Surgeries
        ("dog vaccination cost in pakistan", "Preventive Care", "Pakistan", "600 - 1,000", 8, "Commercial / Pricing", "MoFu", "/blog/dog-vaccination-cost-pakistan", "2,000+ words", "Kamil Vet (DR 11) & Petshub (DR 16) rank with outdated prices", "P1 - Critical"),
        ("cat vaccination price in lahore", "Preventive Care", "Lahore", "400 - 700", 6, "Commercial / Pricing", "MoFu", "/services/cat-vaccination-lahore", "1,500+ words", "General blog posts with zero online appointment booking", "P1 - Critical"),
        ("cat neutering price in lahore", "Surgical Services", "Lahore", "350 - 600", 7, "Commercial / Pricing", "MoFu", "/services/cat-spay-neuter-lahore", "1,500+ words", "Forum discussions & Quora ranking on page 1", "P1 - Critical"),
        ("dog neutering cost in pakistan", "Surgical Services", "Pakistan", "250 - 450", 6, "Commercial / Pricing", "MoFu", "/blog/dog-neutering-cost-pakistan", "1,500+ words", "Outdated 2021 blogs ranking with thin pricing tables", "P1 - Critical"),
        ("cat spaying cost in islamabad", "Surgical Services", "Islamabad", "150 - 300", 4, "Commercial / Pricing", "MoFu", "/services/cat-spaying-islamabad", "1,500+ words", "No dedicated clinic page; dominated by social media posts", "P1 - Critical"),
        ("pet cesarean surgery cost lahore", "Surgical Services", "Lahore", "70 - 150", 3, "Transactional", "BoFu", "/services/pet-surgery/cesarean", "1,200+ words", "Zero specialized clinic pages with transparent surgical info", "P2 - High"),
        ("dog fracture surgery cost pakistan", "Surgical Services", "Pakistan", "100 - 200", 5, "Commercial", "MoFu", "/services/pet-surgery/orthopedic-surgery", "1,500+ words", "AVH Hospital ranks with unoptimized PDF/snippets", "P2 - High"),
        ("pet ultrasound price in lahore", "Diagnostics", "Lahore", "120 - 220", 4, "Commercial", "MoFu", "/services/diagnostics/pet-ultrasound", "1,200+ words", "UVAS center ranks by default; no private clinic ranking", "P1 - Critical"),
        ("dog blood test cost in pakistan", "Diagnostics", "Pakistan", "150 - 250", 5, "Commercial", "MoFu", "/services/diagnostics/pet-blood-test", "1,200+ words", "General lab sites ranking with irrelevant human CBC info", "P2 - High"),
        ("cat teeth cleaning cost pakistan", "Dental Care", "Pakistan", "180 - 300", 4, "Commercial", "MoFu", "/services/pet-dental-care", "1,500+ words", "Untapped niche; pet dental awareness is surging", "P2 - High"),
        ("pet microchipping in lahore", "ID & Travel", "Lahore", "90 - 180", 2, "Commercial", "MoFu", "/services/pet-microchipping-pakistan", "1,200+ words", "Govt UVAS page outdated; zero private clinics ranking", "P1 - Critical"),
        ("pet travel certificate pakistan", "ID & Travel", "Pakistan", "250 - 450", 6, "Commercial / High Ticket", "MoFu", "/services/pet-relocation-certificate", "2,000+ words", "High conversion; pet owners relocating abroad need PVMC certified vets", "P1 - Critical"),
        ("pet export certificate cost in pakistan", "ID & Travel", "Pakistan", "200 - 350", 5, "Commercial / High Ticket", "MoFu", "/blog/pet-export-certificate-pakistan-guide", "1,800+ words", "Outdated Facebook group advice dominates SERP", "P1 - Critical"),
        ("cat boarding lahore dhas", "Boarding & Care", "Lahore", "150 - 300", 4, "Commercial", "BoFu", "/services/pet-boarding-lahore", "1,500+ words", "Petlife (DR 12) & OLX listings rank; easy to outrank with video tour", "P2 - High"),
        ("dog hostel in islamabad", "Boarding & Care", "Islamabad", "120 - 220", 3, "Commercial", "BoFu", "/services/dog-boarding-islamabad", "1,200+ words", "FB pages and classifieds ranking on top 5", "P2 - High"),

        # High-Volume Symptoms, Conditions & Diseases (Low KD Goldmine)
        ("parvovirus symptoms in dogs in urdu", "Canine Health", "Pakistan", "800 - 1,500", 4, "Informational", "ToFu", "/blog/parvovirus-symptoms-treatment-urdu", "2,000+ words", "YouTube videos and thin forum posts rank; high video/FAQ opportunity", "P1 - Critical"),
        ("parvovirus treatment for dogs in pakistan", "Canine Health", "Pakistan", "600 - 1,200", 7, "Informational / Urgent", "ToFu", "/blog/parvo-treatment-cost-survival-pakistan", "2,200+ words", "PVJ academic study and Roundlake (DR 9) ranking with basic text", "P1 - Critical"),
        ("dog ticks treatment at home pakistan", "Parasite Control", "Pakistan", "1,200 - 2,200", 8, "Informational", "ToFu", "/blog/dog-ticks-treatment-home-pakistan", "2,500+ words", "Petshub (DR 16) & generic e-commerce products rank on page 1", "P1 - Critical"),
        ("best tick spray for dogs in pakistan", "Parasite Control", "Pakistan", "500 - 900", 5, "Commercial / Product", "MoFu", "/blog/best-tick-spray-dogs-pakistan", "1,800+ words", "Daraz product pages; zero veterinary comparison reviews", "P2 - High"),
        ("cat vomiting yellow liquid pakistan", "Feline Health", "General / PK", "500 - 850", 3, "Informational", "ToFu", "/blog/cat-vomiting-yellow-liquid-treatment", "1,800+ words", "Generic US blogs (PetMD); local Pakistan results are empty", "P1 - Critical"),
        ("cat not eating food reasons", "Feline Health", "General / PK", "700 - 1,200", 6, "Informational", "ToFu", "/blog/cat-not-eating-home-remedies-treatment", "2,000+ words", "Generic non-localized content; easy to win with local vet advice", "P2 - High"),
        ("persian cat eye infection treatment", "Feline Health", "Pakistan", "450 - 800", 4, "Informational", "ToFu", "/blog/persian-cat-eye-infection-drops-pakistan", "1,800+ words", "High Persian cat ownership in Pakistan; low competition", "P1 - Critical"),
        ("cat fungal infection treatment in urdu", "Feline Health", "Pakistan", "400 - 750", 3, "Informational", "ToFu", "/blog/cat-fungal-infection-treatment-urdu", "1,800+ words", "Huge demand in Pakistan due to humidity; Quora & FB posts rank", "P1 - Critical"),
        ("dog loose motion medicine in pakistan", "Canine Health", "Pakistan", "350 - 650", 5, "Commercial / Medical", "MoFu", "/blog/dog-diarrhea-medicine-pakistan", "1,500+ words", "Local forums giving unsafe human meds; huge clinical need", "P1 - Critical"),
        ("puppy deworming schedule pakistan", "Preventive Care", "Pakistan", "300 - 550", 3, "Informational", "ToFu", "/blog/puppy-deworming-schedule-pakistan", "1,600+ words", "AllAboutPets (DR 14) ranking with basic table; easy to beat", "P2 - High"),
        ("kitten vaccination schedule pakistan", "Preventive Care", "Pakistan", "350 - 600", 4, "Informational", "ToFu", "/blog/kitten-vaccination-schedule-chart-pakistan", "1,800+ words", "Outdated tables; create downloadable PDF schedule", "P1 - Critical"),
        ("dog itching and hair loss treatment", "Dermatology", "Pakistan", "300 - 550", 6, "Informational", "ToFu", "/blog/dog-hair-loss-skin-allergy-treatment", "1,800+ words", "Generic advice; no localized medication names mentioned", "P2 - High"),
        ("rabies injection price in pakistan", "Preventive Care", "Pakistan", "400 - 700", 6, "Commercial / Pricing", "MoFu", "/blog/rabies-vaccine-price-dogs-cats-pakistan", "1,500+ words", "Human rabies hospital blogs dominate; pet vaccine data missing", "P1 - Critical"),
        ("cat ear mites drops in pakistan", "Parasite Control", "Pakistan", "250 - 450", 3, "Commercial / Informational", "MoFu", "/blog/cat-ear-mites-treatment-drops", "1,500+ words", "Only Daraz and Petshub store links; zero medical guide", "P2 - High"),
        ("heat stroke in dogs symptoms treatment", "Emergency Care", "Pakistan", "200 - 400", 5, "Informational / Urgent", "ToFu", "/blog/dog-heat-stroke-symptoms-first-aid", "1,600+ words", "Very high summer volume in Punjab; local vet authority wins", "P2 - High"),

        # Breed-Specific & Diet Queries
        ("what to feed a persian cat in pakistan", "Nutrition & Diet", "Pakistan", "500 - 900", 5, "Informational", "ToFu", "/blog/what-to-feed-persian-cat-pakistan", "2,000+ words", "Thin affiliate blogs ranking with 500 words", "P2 - High"),
        ("best cat food brands in pakistan price list", "Nutrition & Diet", "Pakistan", "800 - 1,500", 9, "Commercial", "MoFu", "/blog/best-cat-food-brands-pakistan-price-list", "2,500+ words", "E-commerce stores with no veterinary nutritional analysis", "P2 - High"),
        ("homemade food for cats in pakistan", "Nutrition & Diet", "Pakistan", "400 - 750", 3, "Informational", "ToFu", "/blog/healthy-homemade-cat-food-recipes-pakistan", "1,800+ words", "High search intent due to expensive imported pet food", "P2 - High"),
        ("german shepherd food chart in urdu", "Nutrition & Diet", "Pakistan", "350 - 650", 2, "Informational", "ToFu", "/blog/german-shepherd-diet-chart-pakistan", "1,800+ words", "YouTube videos ranking; zero comprehensive written guides", "P3 - Medium"),
        ("best dog food in pakistan with price", "Nutrition & Diet", "Pakistan", "600 - 1,100", 8, "Commercial", "MoFu", "/blog/best-dog-food-pakistan-review", "2,200+ words", "Price comparison tables convert very well for clinic shop", "P2 - High"),

        # Local Hyper-Targeted Terms (Zero Competition - Pure Wins)
        ("best vet in dha lahore", "Local SEO", "Lahore (DHA)", "150 - 300", 4, "Commercial", "BoFu", "/lahore/dha-veterinary-clinic", "1,500+ words", "Pets n Vets (DR 21) ranks purely on local proximity; beatable on-page", "P1 - Critical"),
        ("vet clinic bahria town lahore", "Local SEO", "Lahore (Bahria)", "120 - 250", 3, "Commercial", "BoFu", "/lahore/bahria-town-vet-clinic", "1,500+ words", "AVH Bahria clinic ranks with basic map; no deep content", "P1 - Critical"),
        ("vet clinic gulberg lahore", "Local SEO", "Lahore (Gulberg)", "100 - 200", 2, "Commercial", "BoFu", "/lahore/gulberg-vet-clinic", "1,200+ words", "Abid Pets Hospital ranks with outdated site; easy #1 spot", "P1 - Critical"),
        ("veterinary clinic f10 f11 islamabad", "Local SEO", "Islamabad", "80 - 160", 2, "Commercial", "BoFu", "/islamabad/f10-f11-vet-clinic", "1,200+ words", "Zero competitors targeting specific F-sectors with content", "P1 - Critical"),
        ("vet clinic saddar rawalpindi", "Local SEO", "Rawalpindi", "100 - 180", 2, "Commercial", "BoFu", "/rawalpindi/saddar-vet-clinic", "1,200+ words", "Old veterinary dispensaries dominate maps; private clinic can rank instantly", "P1 - Critical"),
        ("pet grooming home service lahore", "Grooming", "Lahore", "150 - 280", 3, "Commercial", "BoFu", "/services/pet-grooming-home-service-lahore", "1,500+ words", "Instagram profiles ranking; rank #1 on Google web search easily", "P2 - High"),
        ("cat haircut price in lahore", "Grooming", "Lahore", "120 - 220", 2, "Commercial / Pricing", "MoFu", "/services/cat-grooming-price-lahore", "1,200+ words", "Extremely high commercial intent during summer shedding season", "P2 - High"),
    ]
    
    # Title Row
    ws1.merge_cells("A1:K1")
    title_cell = ws1["A1"]
    title_cell.value = "REHMAN VET CLINIC — MASTER LOW-COMPETITION KEYWORD INTELLIGENCE (KD <= 10)"
    title_cell.font = font_title
    title_cell.fill = fill_navy
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[1].height = 40

    # Subtitle / Notes
    ws1.merge_cells("A2:K2")
    sub_cell = ws1["A2"]
    sub_cell.value = "Target: High-Intent, Low-Difficulty (KD 0-10) Keywords to Outrank Low-DR Competitors within 30-60 Days"
    sub_cell.font = font_small
    sub_cell.fill = fill_zebra
    sub_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[2].height = 22

    # Headers
    ws1.row_dimensions[3].height = 28
    for col_idx, header in enumerate(headers1, 1):
        cell = ws1.cell(row=3, column=col_idx, value=header)
        cell.font = font_header
        cell.fill = fill_header
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = border_header

    # Populate Data
    for row_idx, row_data in enumerate(keywords_data, 4):
        ws1.row_dimensions[row_idx].height = 22
        is_zebra = (row_idx % 2 == 0)
        for col_idx, val in enumerate(row_data, 1):
            cell = ws1.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_data
            cell.border = border_thin
            if is_zebra:
                cell.fill = fill_zebra
            
            # Formatting specifics
            if col_idx in [4, 5, 7, 9]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx == 11:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                if "P1" in str(val):
                    cell.fill = fill_p1
                    cell.font = font_bold
                elif "P2" in str(val):
                    cell.fill = fill_p2
                elif "P3" in str(val):
                    cell.fill = fill_p3
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

    # -------------------------------------------------------------
    # SHEET 2: Reverse-Engineered Low DR Competitors
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="Low-DR Competitor Teardown")
    ws2.views.sheetView[0].showGridLines = True
    
    ws2.merge_cells("A1:I1")
    t2 = ws2["A1"]
    t2.value = "REVERSE-ENGINEERED COMPETITORS (WEAK DOMAIN RATINGS: DR 5 - 24)"
    t2.font = font_title
    t2.fill = fill_header_emerald
    t2.alignment = Alignment(horizontal="center", vertical="center")
    ws2.row_dimensions[1].height = 40

    ws2.merge_cells("A2:I2")
    s2 = ws2["A2"]
    s2.value = "Analysis of how low-authority websites in Pakistan are currently capturing thousands of monthly pet visits"
    s2.font = font_small
    s2.fill = fill_zebra
    s2.alignment = Alignment(horizontal="center", vertical="center")
    ws2.row_dimensions[2].height = 22

    headers2 = [
        "Competitor Domain", 
        "Est. Ahrefs DR", 
        "Primary Geo / City", 
        "Est. Monthly Organic Traffic", 
        "Top Ranking Keyword Theme", 
        "Content Strengths", 
        "Content & Technical Vulnerabilities", 
        "Backlink Profile Nature", 
        "Rehman Vet Clinic 'Kill' Strategy"
    ]
    
    competitors_data = [
        (
            "matchvet.com", 
            "14", 
            "Lahore / Islamabad", 
            "2,500 - 5,000", 
            "Home visit vet, vaccine cost at home", 
            "Clear booking form, focused purely on convenience and at-home pet care.", 
            "Thin pages (<400 words), zero medical schema, no detailed price comparisons, slow mobile speed (3.4s).", 
            "Mostly directory links and local PR mentions (<15 referring domains).", 
            "Publish 1,500-word authoritative home-visit service page with vet credentials, transparent rates, and instant WhatsApp booking."
        ),
        (
            "kamilveterinaryclinic.com", 
            "11", 
            "Pakistan (Multi-city search)", 
            "1,800 - 3,500", 
            "Dog vaccination cost, puppy shots", 
            "Simple blog posts directly answering user pricing questions with bullet points.", 
            "Outdated prices (last updated 2022/23), zero internal links, no SSL on some assets, poor UI.", 
            "Barely 8 referring domains; ranks purely because large pet authority sites don't localize for PKR pricing.", 
            "Create comprehensive '2026 Pet Vaccination Cost & Schedule Guide' with downloadable PDF chart and FAQ schema."
        ),
        (
            "roundlakeanimalhospital.com.pk", 
            "9", 
            "Lahore / Rawalpindi", 
            "1,200 - 2,800", 
            "Parvovirus treatment, puppy illnesses", 
            "Targets urgent pet symptoms that pet owners search in panic.", 
            "Single wall of unformatted text without headings; no doctor bio; zero call-to-action for emergency clinic visits.", 
            "Under 10 referring domains, mostly generic Pakistani web directories.", 
            "Publish rich symptom checker with emergency red alert banner ('Need Immediate Vet Care in Lahore/Rawalpindi? Call 24/7')."
        ),
        (
            "allaboutpets.pk", 
            "13", 
            "Pakistan (General)", 
            "4,000 - 8,000", 
            "Kitten deworming, cat diet, breed guides", 
            "Covers diverse popular pet questions in plain English with engaging pet photos.", 
            "Ad-heavy layout, no verified veterinary doctor author credentials (fails Google E-E-A-T), generic advice.", 
            "Web 2.0 links, low-tier Pakistani blogs, forum signatures.", 
            "Publish Dr. Rehman verified clinical guides citing medical standards (PVMC registered), establishing true E-E-A-T."
        ),
        (
            "abidpetshospital.pk", 
            "10", 
            "Lahore (Gulberg / Model Town)", 
            "800 - 1,800", 
            "Gulberg vet, pet surgery lahore", 
            "Long-standing clinical presence in central Lahore with established name recognition.", 
            "Static non-responsive website built on outdated PHP, zero blog articles, lacks mobile tap-to-call.", 
            "Natural local citations (Yellowpages, PakBiz).", 
            "Build hyper-local page for Central Lahore & Gulberg with schema, interactive Google Map embed, and client video testimonials."
        ),
        (
            "petsone.pk", 
            "22", 
            "Lahore (DHA / Valencia)", 
            "12,000 - 20,000", 
            "Pet shop + clinic, cat food price, tick shampoo", 
            "Hybrid e-commerce store with high keyword footprint across thousands of pet products.", 
            "Clinic services are buried in navigation; service descriptions are 1-2 paragraphs; zero in-depth medical guides.", 
            "E-commerce supplier links and brand distribution backlinks.", 
            "Outrank them on all high-ticket medical/surgical keywords where product stores cannot compete with medical expertise."
        ),
        (
            "vetcarepets.pk", 
            "12", 
            "Islamabad / Rawalpindi", 
            "1,500 - 3,200", 
            "Vet in Islamabad, grooming Islamabad", 
            "Clean clinic images, lists services clearly on homepage.", 
            "Single-page architecture; all services crammed into one page; zero individual URLs for surgery, dental, or emergency.", 
            "Local social media shares and small directory submissions.", 
            "Create dedicated silo URLs (/islamabad/emergency-vet, /islamabad/cat-surgery) to dominate specific search intents."
        ),
        (
            "bacc.pk", 
            "8", 
            "Rawalpindi / Islamabad", 
            "600 - 1,400", 
            "Animal care Rawalpindi, vet near me", 
            "Targets local Rawalpindi searchers looking for immediate veterinary contact numbers.", 
            "Zero blog content, last blog post in 2021, broken image tags, no mobile viewport optimization.", 
            "Under 5 referring domains.", 
            "Rank on top with modern fast Next/Vite architecture (sub-1s load time) and complete Rawalpindi veterinary hub."
        )
    ]

    ws2.row_dimensions[3].height = 28
    for col_idx, header in enumerate(headers2, 1):
        cell = ws2.cell(row=3, column=col_idx, value=header)
        cell.font = font_header
        cell.fill = fill_header_emerald
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = border_header

    for row_idx, row_data in enumerate(competitors_data, 4):
        ws2.row_dimensions[row_idx].height = 55
        is_zebra = (row_idx % 2 == 0)
        for col_idx, val in enumerate(row_data, 1):
            cell = ws2.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_data
            cell.border = border_thin
            if is_zebra:
                cell.fill = fill_zebra
            if col_idx in [2, 3, 4]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

    # -------------------------------------------------------------
    # SHEET 3: Topical Clusters & Content Silos
    # -------------------------------------------------------------
    ws3 = wb.create_sheet(title="Topical Clusters & Architecture")
    ws3.views.sheetView[0].showGridLines = True
    
    ws3.merge_cells("A1:G1")
    t3 = ws3["A1"]
    t3.value = "TOPICAL MAP & CONTENT SILO ARCHITECTURE (E-E-A-T AUTHORITATIVE ENGINE)"
    t3.font = font_title
    t3.fill = fill_header_slate
    t3.alignment = Alignment(horizontal="center", vertical="center")
    ws3.row_dimensions[1].height = 40

    headers3 = [
        "Silo / Pillar", 
        "Pillar Page (Hub URL)", 
        "Supporting Cluster Articles (Spokes)", 
        "Internal Linking Strategy", 
        "Target Search Intent", 
        "Total Cluster Search Volume", 
        "Expected Ranking Timeframe"
    ]
    
    silo_data = [
        (
            "Pillar 1: Emergency & 24/7 Vet Care", 
            "/services/emergency-veterinary-care", 
            "1. 24 Hour Vet Clinic in Lahore (/lahore/emergency)\n2. Emergency Vet Islamabad & Rawalpindi\n3. Sunday Open Vet Clinic Guide\n4. Pet Ambulance & First Aid at Home\n5. Heatstroke in Dogs First Aid Protocol", 
            "Spokes link up to Pillar page. Sticky WhatsApp emergency call button on every spoke.", 
            "High-Urgency Transactional", 
            "2,500 - 4,000 / mo", 
            "14 - 25 Days"
        ),
        (
            "Pillar 2: Preventive Medicine & Vaccines", 
            "/services/pet-vaccination-center", 
            "1. Dog Vaccination Cost in Pakistan (2026 Price Chart)\n2. Cat Vaccination Price in Lahore & Islamabad\n3. Puppy Vaccination Schedule Downloadable PDF\n4. Kitten FVRCP & Rabies Injection Cost\n5. Puppy Deworming Schedule & Medicine", 
            "All price guide spokes contain instant appointment booking form linking to Vaccine Hub.", 
            "Commercial Investigation & BoFu", 
            "3,500 - 6,000 / mo", 
            "20 - 35 Days"
        ),
        (
            "Pillar 3: Pet Surgeries & Spay/Neuter", 
            "/services/pet-surgery-hospital", 
            "1. Cat Neutering Cost in Lahore & Recovery Time\n2. Cat Spaying Guide (Post-op Care)\n3. Dog Neutering Cost Pakistan\n4. Pet Cesarean Section Emergency Procedure\n5. Orthopedic Bone Fracture Surgery in Pets", 
            "Pre-op and post-op guide links pointing directly to surgery consultation booking.", 
            "High-Ticket Commercial", 
            "1,800 - 3,200 / mo", 
            "30 - 45 Days"
        ),
        (
            "Pillar 4: Pet Relocation & Export Documentation", 
            "/services/pet-relocation-pakistan", 
            "1. Pet Travel Certificate Pakistan (Requirements)\n2. Pet Export Certificate Cost & Processing Time\n3. Microchipping for Dogs & Cats in Lahore\n4. Rabies Titer Test (RNATT) for UK/EU Pet Travel", 
            "High-value corporate & expat cluster. Links to Dr. Rehman PVMC verification credentials.", 
            "Commercial (High Ticket: Rs 25,000 - 75,000+)", 
            "1,200 - 2,500 / mo", 
            "20 - 30 Days"
        ),
        (
            "Pillar 5: Urgent Canine & Feline Symptoms", 
            "/pet-health-symptom-checker", 
            "1. Parvovirus Treatment Cost & Survival Guide Pakistan\n2. Parvovirus Symptoms in Dogs in Urdu\n3. Cat Vomiting Yellow Liquid Home Remedies\n4. Cat Not Eating Food: When to See a Vet\n5. Dog Ticks Treatment at Home in Pakistan", 
            "Every symptom page has an urgent triage box: 'Visit Rehman Vet Clinic in Lahore/Isb immediately if these 3 red flags appear.'", 
            "High-Volume Informational (ToFu)", 
            "8,000 - 15,000 / mo", 
            "30 - 60 Days"
        ),
        (
            "Pillar 6: Local City Hubs (Geo Silo)", 
            "/locations", 
            "1. /lahore (Sub-branches: DHA, Gulberg, Bahria Town)\n2. /islamabad (Sub-branches: F-10/F-11, Blue Area, Bahria Isb)\n3. /rawalpindi (Sub-branches: Saddar, Bahria Phase 1-8)", 
            "Geographical schema markup (LocalBusiness + VeterinaryCare) on each branch page.", 
            "Hyper-Local Transactional", 
            "4,000 - 7,000 / mo", 
            "15 - 30 Days"
        )
    ]

    ws3.row_dimensions[2].height = 28
    for col_idx, header in enumerate(headers3, 1):
        cell = ws3.cell(row=2, column=col_idx, value=header)
        cell.font = font_header
        cell.fill = fill_header_slate
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = border_header

    for row_idx, row_data in enumerate(silo_data, 3):
        ws3.row_dimensions[row_idx].height = 65
        is_zebra = (row_idx % 2 == 0)
        for col_idx, val in enumerate(row_data, 1):
            cell = ws3.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_data
            cell.border = border_thin
            if is_zebra:
                cell.fill = fill_zebra
            if col_idx in [5, 6, 7]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

    # -------------------------------------------------------------
    # SHEET 4: 30-Day Ranking Blueprint & Implementation Roadmap
    # -------------------------------------------------------------
    ws4 = wb.create_sheet(title="30-Day Execution Roadmap")
    ws4.views.sheetView[0].showGridLines = True
    
    ws4.merge_cells("A1:H1")
    t4 = ws4["A1"]
    t4.value = "30-DAY RANKING BLUEPRINT FOR REHMAN VET CLINIC (GHULAM ALI SEO FRAMEWORK)"
    t4.font = font_title
    t4.fill = fill_navy
    t4.alignment = Alignment(horizontal="center", vertical="center")
    ws4.row_dimensions[1].height = 40

    headers4 = [
        "Day / Phase", 
        "Workflow Domain", 
        "Actionable Step-by-Step Tasks", 
        "Target Keywords Targeted", 
        "Content Specs & Word Count", 
        "Technical / Schema Requirement", 
        "Verification Metric", 
        "Status"
    ]
    
    roadmap_data = [
        (
            "Days 1 - 3", 
            "Technical Foundation & Tracking", 
            "1. Ensure site load speed is under 1.8 seconds on mobile.\n2. Submit XML sitemap to Google Search Console & Bing Webmaster.\n3. Implement schema: VeterinaryCare, MedicalBusiness, GeoCoordinates for clinic locations.\n4. Set up Google Business Profile (GBP) optimization with NAP consistency.", 
            "Brand terms, 'vet near me', 'veterinary clinic in lahore'", 
            "Site Architecture & Meta Tags", 
            "Sub-2s LCP, 0 404 errors, valid JSON-LD schema", 
            "100% GSC validation pass", 
            "Ready to Execute"
        ),
        (
            "Days 4 - 7", 
            "Bottom-of-Funnel City Hubs", 
            "1. Deploy dedicated geo-landing pages: /lahore, /islamabad, /rawalpindi.\n2. Embed Google Maps, verified phone numbers, branch photos, doctor credentials.\n3. Add prominent 'Book Home Visit Vet' & 'Call 24/7 Emergency' CTA buttons.", 
            "24 hour vet clinic lahore, emergency vet islamabad, sunday open vet lahore", 
            "1,500+ words per city hub page", 
            "LocalBusiness schema with aggregateRating and openingHoursSpecification", 
            "Indexed in GSC within 48 hours", 
            "Ready to Execute"
        ),
        (
            "Days 8 - 14", 
            "Core Services & Price Transparency", 
            "1. Publish 'Dog Vaccination Cost in Pakistan (2026 Updated)' with table comparison.\n2. Publish 'Cat Vaccination Price Lahore' & 'Cat Neutering Price Lahore'.\n3. Publish 'Pet Travel Certificate & Microchipping Pakistan' high-ticket service page.\n4. Embed downloadable PDF vaccination schedules for instant lead capture.", 
            "dog vaccination cost in pakistan, cat neutering price lahore, pet export certificate pakistan", 
            "1,500 - 2,000 words per page (semantic headings H2/H3)", 
            "FAQ Schema markup on every pricing table (triggers Google SERP accordions)", 
            "Top 20 ranking on KD < 8 keywords", 
            "Ready to Execute"
        ),
        (
            "Days 15 - 21", 
            "High-Volume Symptom & Emergency Silo", 
            "1. Publish 'Canine Parvovirus Symptoms & Treatment Guide (Urdu & English)'.\n2. Publish 'Dog Ticks Treatment at Home in Pakistan' (recommend vetted sprays).\n3. Publish 'Cat Vomiting Yellow Liquid - Causes & First Aid'.\n4. Add internal linking from all symptom articles to Emergency Clinic Booking.", 
            "parvovirus treatment for dogs pakistan, dog ticks treatment at home, cat vomiting yellow liquid", 
            "2,000 - 2,500 words per symptom guide (comprehensive E-E-A-T)", 
            "MedicalWebPage schema + author bio (licensed PVMC doctor)", 
            "Organic impressions spike in GSC", 
            "Ready to Execute"
        ),
        (
            "Days 22 - 27", 
            "Competitor Gap 'Kill' Content", 
            "1. Outrank Matchvet on 'Home Visit Vet in Lahore' & 'Home Visit Vet Islamabad'.\n2. Outrank Kamil Vet on 'Puppy Shot Schedule Pakistan'.\n3. Publish Persian Cat specific care guide ('What to Feed a Persian Cat in Pakistan').", 
            "home visit vet in lahore, home visit vet islamabad, what to feed a persian cat pakistan", 
            "1,800+ words with rich tables and doctor Q&A", 
            "Optimized OpenGraph tags for viral WhatsApp & Facebook pet group sharing", 
            "Overtake competitors' ranking positions", 
            "Ready to Execute"
        ),
        (
            "Days 28 - 30", 
            "High-Impact Niche Backlinks & Citations", 
            "1. Build 20+ top-tier Pakistani business citations (InstaCare, Marham, PakBiz, BusinessList.pk).\n2. Guest outreach to local pet adoption NGOs and rescue communities (e.g. Todd's Welfare Society, ACF Animal Rescue).\n3. Keep anchor text natural (<10% exact match; 90% branded 'Rehman Vet Clinic' / naked URL).\n4. Request 5-star Google Map reviews from 50 existing clinic clients.", 
            "Overall domain authority boost for all target keywords", 
            "Guest post & citation editorial copies (500-800 words)", 
            "DoFollow backlinks from active, indexed pages with organic traffic", 
            "First page Google rankings locked in", 
            "Ready to Execute"
        )
    ]

    ws4.row_dimensions[2].height = 28
    for col_idx, header in enumerate(headers4, 1):
        cell = ws4.cell(row=2, column=col_idx, value=header)
        cell.font = font_header
        cell.fill = fill_navy
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = border_header

    for row_idx, row_data in enumerate(roadmap_data, 3):
        ws4.row_dimensions[row_idx].height = 60
        is_zebra = (row_idx % 2 == 0)
        for col_idx, val in enumerate(row_data, 1):
            cell = ws4.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_data
            cell.border = border_thin
            if is_zebra:
                cell.fill = fill_zebra
            if col_idx in [1, 2, 7, 8]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

    # -------------------------------------------------------------
    # Auto-Fit Column Widths Across All Sheets
    # -------------------------------------------------------------
    for ws in [ws1, ws2, ws3, ws4]:
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            # Skip title row (row 1 & 2) for length calculation
            for cell in list(col)[2:]:
                if cell.value:
                    val_str = str(cell.value)
                    # For multi-line cells, get max line length
                    lines = val_str.split("\n")
                    line_lens = [len(l) for l in lines]
                    max_len = max(max_len, max(line_lens))
            
            # Constrain width
            col_width = min(max(max_len + 4, 14), 50)
            ws.column_dimensions[col_letter].width = col_width

    # Custom column adjustments
    ws1.column_dimensions['A'].width = 38 # Keyword
    ws1.column_dimensions['B'].width = 20 # Topic Cluster
    ws1.column_dimensions['C'].width = 16 # Target Location
    ws1.column_dimensions['D'].width = 20 # Volume
    ws1.column_dimensions['E'].width = 16 # KD
    ws1.column_dimensions['F'].width = 22 # Search Intent
    ws1.column_dimensions['G'].width = 14 # Funnel Stage
    ws1.column_dimensions['H'].width = 38 # URL Slug
    ws1.column_dimensions['I'].width = 16 # Word Count
    ws1.column_dimensions['J'].width = 45 # Competitor Weakness
    ws1.column_dimensions['K'].width = 18 # Priority

    output_path = "Rehman_Vet_Clinic_Low_Competition_Master_SEO.xlsx"
    wb.save(output_path)
    print(f"Successfully generated master workbook: {output_path}")

if __name__ == "__main__":
    build_master_seo_workbook()
