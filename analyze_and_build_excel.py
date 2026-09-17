import csv
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_master_workbook():
    # 1. Load raw Ahrefs CSV
    csv_path = "Ahrefs_Raw_Export_Veterinary_Pakistan.csv"
    with open(csv_path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        all_ahrefs = list(reader)
    
    print(f"Loaded {len(all_ahrefs)} rows from {csv_path}")
    
    wb = openpyxl.Workbook()
    
    # Styles
    font_main_title = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
    font_sheet_title = Font(name="Calibri", size=13, bold=True, color="FFFFFF")
    font_header = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    font_sub = Font(name="Calibri", size=9, italic=True, color="64748B")
    font_bold = Font(name="Calibri", size=10, bold=True, color="0F172A")
    font_regular = Font(name="Calibri", size=10, color="0F172A")
    
    fill_navy = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    fill_blue = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    fill_emerald = PatternFill(start_color="065F46", end_color="065F46", fill_type="solid")
    fill_purple = PatternFill(start_color="581C87", end_color="581C87", fill_type="solid")
    fill_slate = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
    fill_zebra = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    
    fill_p1 = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid") # Red soft
    fill_p2 = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid") # Yellow soft
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
    # TAB 1: Lahore Local & High-Intent Keywords (Ahrefs Live Data)
    # -------------------------------------------------------------
    ws1 = wb.active
    ws1.title = "Lahore Veterinary Keywords"
    ws1.views.sheetView[0].showGridLines = True
    
    ws1.merge_cells("A1:K1")
    t1 = ws1["A1"]
    t1.value = "REHMAN VET CLINIC — LAHORE LIVE AHREFS KEYWORDS & LOCAL TARGETING"
    t1.font = font_main_title
    t1.fill = fill_navy
    t1.alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[1].height = 40
    
    ws1.merge_cells("A2:K2")
    s1 = ws1["A2"]
    s1.value = "Real-time keywords for Animal Doctor / Veterinary Clinic in Lahore, Pakistan extracted from active Ahrefs session"
    s1.font = font_sub
    s1.fill = fill_zebra
    s1.alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[2].height = 22

    headers1 = [
        "Keyword", 
        "Monthly Volume (PK)", 
        "Ahrefs KD (0-100)", 
        "CPC ($ USD)", 
        "Global Volume", 
        "Traffic Potential", 
        "SERP Features (Local Pack/PAA)", 
        "Search Intent", 
        "Recommended Page / URL Slug", 
        "Target Word Count", 
        "Priority"
    ]
    
    ws1.row_dimensions[3].height = 28
    for col_idx, h in enumerate(headers1, 1):
        c = ws1.cell(row=3, column=col_idx, value=h)
        c.font = font_header
        c.fill = fill_blue
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_header

    # Filter Lahore keywords and high local intent keywords
    lahore_rows = []
    for r in all_ahrefs:
        kw = r['Keyword'].lower()
        if 'lahore' in kw or 'near me' in kw or 'jail road' in kw:
            vol = int(r['Volume']) if r['Volume'] else 0
            kd_val = r['Difficulty'] if r['Difficulty'] else '0'
            try:
                kd_num = float(kd_val)
            except:
                kd_num = 0.0
            cpc_val = f"${r['CPC']}" if r['CPC'] else "$0.00"
            gvol = r['Global volume'] if r['Global volume'] else r['Volume']
            tp = r['Traffic potential'] if r['Traffic potential'] else '0'
            serp = r['SERP Features'] if r['SERP Features'] else 'Organic'
            intent = r['Intents'] if r['Intents'] else 'Local'
            
            # Smart URL and Priority mapping
            if 'emergency' in kw or '24 hour' in kw:
                url = "/services/emergency-vet-lahore"
                prio = "P1 - Critical"
            elif 'vaccin' in kw:
                url = "/services/pet-vaccination-lahore"
                prio = "P1 - Critical"
            elif 'hospital' in kw:
                url = "/locations/lahore/animal-hospital"
                prio = "P1 - Critical"
            elif 'best' in kw or 'doctor' in kw:
                url = "/lahore/veterinary-doctor"
                prio = "P1 - Critical"
            elif 'home' in kw:
                url = "/services/home-visit-vet-lahore"
                prio = "P1 - Critical"
            else:
                url = f"/lahore/{kw.replace(' ', '-')[:30]}"
                prio = "P2 - High"
            
            lahore_rows.append((
                r['Keyword'],
                vol,
                kd_num,
                cpc_val,
                gvol,
                tp,
                serp[:40] if len(serp) > 40 else serp,
                intent.replace('\n', ', '),
                url,
                "1,500+ words",
                prio
            ))
            
    # Sort by Volume descending
    lahore_rows.sort(key=lambda x: x[1], reverse=True)

    # Populate Tab 1
    for row_idx, r_data in enumerate(lahore_rows, 4):
        ws1.row_dimensions[row_idx].height = 24
        is_zebra = (row_idx % 2 == 0)
        for col_idx, val in enumerate(r_data, 1):
            cell = ws1.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_regular
            cell.border = border_thin
            if is_zebra:
                cell.fill = fill_zebra
            if col_idx in [2, 3, 4, 5, 6, 10]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx == 11:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                if "P1" in str(val):
                    cell.fill = fill_p1
                    cell.font = font_bold
                elif "P2" in str(val):
                    cell.fill = fill_p2
                else:
                    cell.fill = fill_p3
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

    # -------------------------------------------------------------
    # TAB 2: All Low-KD Keywords (KD <= 10) Across Pakistan
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="Low KD Master List (KD<=10)")
    ws2.views.sheetView[0].showGridLines = True
    
    ws2.merge_cells("A1:K1")
    t2 = ws2["A1"]
    t2.value = "LOW DIFFICULTY KEYWORDS (AHREFS KD 0 - 10) — EASY WIN GOLDMINE"
    t2.font = font_main_title
    t2.fill = fill_emerald
    t2.alignment = Alignment(horizontal="center", vertical="center")
    ws2.row_dimensions[1].height = 40
    
    ws2.merge_cells("A2:K2")
    s2 = ws2["A2"]
    s2.value = "Keywords where DR < 20 websites can rank on Google Page 1 within 30-45 days"
    s2.font = font_sub
    s2.fill = fill_zebra
    s2.alignment = Alignment(horizontal="center", vertical="center")
    ws2.row_dimensions[2].height = 22

    headers2 = [
        "Keyword", 
        "Monthly Volume (PK)", 
        "Ahrefs KD (0-100)", 
        "CPC ($ USD)", 
        "Global Volume", 
        "Traffic Potential", 
        "SERP Features", 
        "Parent Keyword", 
        "Recommended Page / URL", 
        "Target Word Count", 
        "Priority"
    ]
    
    ws2.row_dimensions[3].height = 28
    for col_idx, h in enumerate(headers2, 1):
        c = ws2.cell(row=3, column=col_idx, value=h)
        c.font = font_header
        c.fill = fill_emerald
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_header

    low_kd_rows = []
    for r in all_ahrefs:
        kd_val = r['Difficulty'] if r['Difficulty'] else '0'
        try:
            kd_num = float(kd_val)
        except:
            kd_num = 0.0
            
        vol = int(r['Volume']) if r['Volume'] else 0
        
        # Filter for KD <= 10 and Volume >= 20
        if kd_num <= 10 and vol >= 20:
            cpc_val = f"${r['CPC']}" if r['CPC'] else "$0.00"
            gvol = r['Global volume'] if r['Global volume'] else r['Volume']
            tp = r['Traffic potential'] if r['Traffic potential'] else '0'
            serp = r['SERP Features'] if r['SERP Features'] else 'Organic'
            parent = r['Parent Keyword'] if r['Parent Keyword'] else r['Keyword']
            kw = r['Keyword'].lower()
            
            if 'vaccin' in kw:
                url = "/services/pet-vaccination"
                prio = "P1 - Critical"
            elif 'lahore' in kw:
                url = "/lahore/veterinary-clinic"
                prio = "P1 - Critical"
            elif 'doctor' in kw and ('near me' in kw or 'call' in kw):
                url = "/services/veterinary-consultation"
                prio = "P1 - Critical"
            elif 'hospital' in kw:
                url = "/services/animal-hospital-care"
                prio = "P1 - Critical"
            elif 'salary' in kw or 'job' in kw or 'crossword' in kw or 'clue' in kw:
                url = "/blog/veterinary-career-insights"
                prio = "P3 - Low"
            else:
                url = f"/blog/{kw.replace(' ', '-')[:30]}"
                prio = "P2 - High"
                
            low_kd_rows.append((
                r['Keyword'],
                vol,
                kd_num,
                cpc_val,
                gvol,
                tp,
                serp[:35] if len(serp) > 35 else serp,
                parent,
                url,
                "1,500+ words",
                prio
            ))
            
    low_kd_rows.sort(key=lambda x: x[1], reverse=True)
    
    for row_idx, r_data in enumerate(low_kd_rows, 4):
        ws2.row_dimensions[row_idx].height = 24
        is_zebra = (row_idx % 2 == 0)
        for col_idx, val in enumerate(r_data, 1):
            cell = ws2.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_regular
            cell.border = border_thin
            if is_zebra:
                cell.fill = fill_zebra
            if col_idx in [2, 3, 4, 5, 6, 10]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx == 11:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                if "P1" in str(val):
                    cell.fill = fill_p1
                    cell.font = font_bold
                elif "P2" in str(val):
                    cell.fill = fill_p2
                else:
                    cell.fill = fill_p3
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

    # -------------------------------------------------------------
    # TAB 3: Reverse-Engineered Competitors (Low DR 5-22)
    # -------------------------------------------------------------
    ws3 = wb.create_sheet(title="Low-DR Competitor Teardown")
    ws3.views.sheetView[0].showGridLines = True
    
    ws3.merge_cells("A1:I1")
    t3 = ws3["A1"]
    t3.value = "REVERSE-ENGINEERED WEAK COMPETITORS (DR 5 - 22) IN LAHORE & PAKISTAN"
    t3.font = font_main_title
    t3.fill = fill_purple
    t3.alignment = Alignment(horizontal="center", vertical="center")
    ws3.row_dimensions[1].height = 40
    
    ws3.merge_cells("A2:I2")
    s3 = ws3["A2"]
    s3.value = "How low-authority websites are currently ranking on Page 1 and how Rehman Vet Clinic can outrank them"
    s3.font = font_sub
    s3.fill = fill_zebra
    s3.alignment = Alignment(horizontal="center", vertical="center")
    ws3.row_dimensions[2].height = 22

    headers3 = [
        "Competitor Domain / Name", 
        "Est. Ahrefs DR", 
        "Target Location / Coverage", 
        "Est. Monthly Organic Traffic", 
        "Top Ranking Keywords Found in Ahrefs", 
        "Content Strengths", 
        "Vulnerabilities & Content Flaws", 
        "Backlink Profile Nature", 
        "Rehman Vet Clinic 'Kill' Strategy"
    ]
    
    ws3.row_dimensions[3].height = 28
    for col_idx, h in enumerate(headers3, 1):
        c = ws3.cell(row=3, column=col_idx, value=h)
        c.font = font_header
        c.fill = fill_purple
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_header

    competitors_data = [
        (
            "Round Lake Animal Hospital (Lahore)\nroundlakeanimalhospital.com.pk",
            "9",
            "Lahore (Local)",
            "1,200 - 2,800",
            "'round lake animal hospital lahore' (150/mo, TP 900), 'animal hospital lahore' (150/mo), 'parvovirus treatment'",
            "Ranks on its branded clinic name and basic emergency terms.",
            "Single unformatted text block, zero schema markup, no appointment booking form, outdated mobile UI.",
            "Under 10 referring domains, generic Pakistani web directory profiles.",
            "Create dedicated '/lahore/round-lake-alternative' and dominate 'animal hospital lahore' with superior modern UX, Doctor bio, and 24/7 WhatsApp emergency CTA."
        ),
        (
            "MatchVet Pakistan\nmatchvet.com",
            "14",
            "Lahore & Islamabad",
            "2,500 - 5,000",
            "'home visit vet lahore', 'dog vaccination at home', 'pet injection price'",
            "Focuses purely on convenience and at-home pet care with simple booking form.",
            "Thin service pages (<400 words), zero in-depth surgical guides, slow mobile load time (3.5s).",
            "Local PR citations, Facebook group shares, under 15 referring domains.",
            "Publish authoritative 1,500-word Home Visit page with PVMC doctor credentials, transparent pricing tables, and instant WhatsApp booking."
        ),
        (
            "Kamil Veterinary Clinic\nkamilveterinaryclinic.com",
            "11",
            "Pakistan (Search wide)",
            "1,800 - 3,500",
            "'dog vaccination cost in pakistan', 'puppy shots price', 'rabies vaccine price'",
            "Directly answers user pricing questions in plain bullet points.",
            "Outdated 2022 pricing data, zero internal links, no SSL certificate on some image assets.",
            "Barely 8 referring domains; ranks purely because large pet authority sites don't quote Pakistani Rupee (PKR) prices.",
            "Create comprehensive '2026 Pet Vaccination Cost & Schedule Guide' with downloadable PDF chart and FAQ schema markup."
        ),
        (
            "Ali Veterinary Hospital (AVH)\navh.com.pk",
            "18",
            "Lahore (Bahria & Valencia)",
            "3,000 - 6,000",
            "'veterinary clinic lahore', 'pet surgery lahore', 'orthopedic dog surgery'",
            "Strong local reputation in Bahria Town and South Lahore with verified clinic photos.",
            "Thin textual descriptions, no localized blog cluster, lacks schema markup, zero multi-language targeting (English/Urdu).",
            "Local vendor links, pharmaceutical mentions, under 25 referring domains.",
            "Outrank in surrounding areas (DHA, Gulberg, Model Town) and capture surgical queries with 1,500+ word procedure guides."
        ),
        (
            "PetsOne Pakistan\npetsone.pk",
            "22",
            "Lahore (DHA focus)",
            "12,000 - 20,000",
            "'pet clinic near me', 'pet clinic rawalpindi', 'tick shampoo dog'",
            "High keyword footprint from e-commerce pet store inventory.",
            "Clinic services are buried; clinical descriptions are 1-2 paragraphs; zero in-depth veterinary medical guides.",
            "Product supplier backlinks and pet food distributor directories.",
            "Win on high-ticket medical/surgical keywords where e-commerce stores cannot compete with medical expertise."
        ),
        (
            "Abid Pets Hospital\nabidpetshospital.pk",
            "10",
            "Lahore (Gulberg)",
            "800 - 1,800",
            "'best vet in lahore', 'animal hospital in lahore', 'gulberg pet clinic'",
            "Established physical clinic in central Lahore with decades of word-of-mouth.",
            "Legacy non-responsive website built on outdated PHP, zero blog articles, lacks mobile tap-to-call.",
            "Old business citations on PakBiz and Yellowpages.",
            "Build hyper-local page for Central Lahore & Gulberg with LocalBusiness schema, Google Map embed, and video testimonials."
        ),
        (
            "All About Pets Pakistan\nallaboutpets.pk",
            "13",
            "National (PK)",
            "4,000 - 8,000",
            "'kitten deworming schedule', 'persian cat food pakistan', 'puppy fever'",
            "Broad coverage of popular pet questions in plain English with high visual appeal.",
            "Ad-heavy layout, no verified veterinary doctor author credentials (fails Google E-E-A-T), generic advice.",
            "Web 2.0 links, low-tier Pakistani blogs, forum signatures.",
            "Publish Dr. Rehman verified clinical guides citing medical standards (PVMC registered), establishing true E-E-A-T."
        )
    ]

    for row_idx, r_data in enumerate(competitors_data, 4):
        ws3.row_dimensions[row_idx].height = 65
        is_zebra = (row_idx % 2 == 0)
        for col_idx, val in enumerate(r_data, 1):
            cell = ws3.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_regular
            cell.border = border_thin
            if is_zebra:
                cell.fill = fill_zebra
            if col_idx in [2, 3, 4]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

    # -------------------------------------------------------------
    # TAB 4: Topical Clusters & Content Silo Map
    # -------------------------------------------------------------
    ws4 = wb.create_sheet(title="Topical Map & Content Silos")
    ws4.views.sheetView[0].showGridLines = True
    
    ws4.merge_cells("A1:G1")
    t4 = ws4["A1"]
    t4.value = "TOPICAL CLUSTERS & CONTENT SILO MAP (E-E-A-T ENGINE)"
    t4.font = font_main_title
    t4.fill = fill_slate
    t4.alignment = Alignment(horizontal="center", vertical="center")
    ws4.row_dimensions[1].height = 40

    headers4 = [
        "Pillar / Silo", 
        "Pillar Page (Hub URL)", 
        "Supporting Cluster Articles (Spokes)", 
        "Internal Linking Blueprint", 
        "Search Intent Target", 
        "Total Cluster Search Volume", 
        "Target Ranking Time"
    ]
    
    ws4.row_dimensions[2].height = 28
    for col_idx, h in enumerate(headers4, 1):
        c = ws4.cell(row=2, column=col_idx, value=h)
        c.font = font_header
        c.fill = fill_slate
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_header

    silos = [
        (
            "Silo 1: Lahore Local Clinic Dominance",
            "/lahore",
            "1. Animal Hospital Lahore & Contact Number\n2. Free Animal Hospital in Lahore Guide (Govt vs Private)\n3. Round Lake Animal Hospital Alternative Lahore\n4. Dog Bite Vaccination Center Jail Road Lahore\n5. Best Vet in Lahore (DHA, Gulberg, Bahria Town)",
            "All sub-location articles link directly to /lahore main booking page with WhatsApp button.",
            "Local Transactional (Bottom of Funnel)",
            "3,500 - 5,500 / mo",
            "15 - 25 Days"
        ),
        (
            "Silo 2: Emergency & 24/7 Animal Care",
            "/services/emergency-veterinary-care",
            "1. 24 Hour Vet Clinic in Lahore\n2. Emergency Pet Hospital Rawalpindi & Islamabad\n3. Sunday Open Vet Clinic Guide\n4. Pet Ambulance & First Aid at Home Lahore\n5. Dog Heatstroke Symptoms & Emergency Protocol",
            "Every spoke has sticky red emergency phone banner with tap-to-call.",
            "Urgent Transactional",
            "2,000 - 4,000 / mo",
            "14 - 20 Days"
        ),
        (
            "Silo 3: Preventive Medicine & Vaccines",
            "/services/pet-vaccination",
            "1. Dog Vaccination Cost in Pakistan (2026 Updated Table)\n2. Cat Vaccination Price in Lahore\n3. Puppy Vaccination Schedule PDF Download\n4. Rabies Injection Price for Dogs & Cats\n5. Puppy Deworming Schedule & Medicine",
            "All pricing articles link up to the Vaccination Appointment booking page.",
            "Commercial & Pricing (MoFu)",
            "3,000 - 5,000 / mo",
            "20 - 30 Days"
        ),
        (
            "Silo 4: Surgical Services & Spay/Neuter",
            "/services/pet-surgery",
            "1. Cat Neutering Cost in Lahore & Recovery\n2. Cat Spaying Guide (Pre & Post Op)\n3. Dog Neutering Cost Pakistan\n4. Pet Cesarean Section Surgery Procedure\n5. Orthopedic Fracture Repair for Pets in Lahore",
            "Clinical procedure pages link to surgeon credentials and consultation booking.",
            "High-Ticket Commercial",
            "1,500 - 3,000 / mo",
            "30 - 45 Days"
        ),
        (
            "Silo 5: Urgent Canine & Feline Symptoms",
            "/pet-health-symptom-checker",
            "1. Parvovirus Treatment Cost & Survival Guide Pakistan\n2. Parvovirus Symptoms in Dogs in Urdu\n3. Cat Vomiting Yellow Liquid Causes & Home Care\n4. Dog Ticks Treatment at Home in Pakistan\n5. Persian Cat Eye Infection Drops & Treatment",
            "Symptom guides contain warning boxes linking directly to Emergency Vet Clinic.",
            "High-Volume Informational (ToFu)",
            "6,000 - 12,000 / mo",
            "30 - 60 Days"
        ),
        (
            "Silo 6: Pet Travel & Relocation High-Ticket",
            "/services/pet-relocation-certificate",
            "1. Pet Travel Certificate Pakistan (Requirements)\n2. Pet Export Certificate Cost & Processing Time\n3. Microchipping for Dogs & Cats Lahore\n4. Rabies Titer Test (RNATT) for UK/EU Relocation",
            "High-ticket relocation leads linking directly to PVMC verified doctor consultation.",
            "High-Ticket Commercial (Rs 30k - 80k)",
            "1,200 - 2,200 / mo",
            "20 - 30 Days"
        )
    ]

    for row_idx, r_data in enumerate(silos, 3):
        ws4.row_dimensions[row_idx].height = 65
        is_zebra = (row_idx % 2 == 0)
        for col_idx, val in enumerate(r_data, 1):
            cell = ws4.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_regular
            cell.border = border_thin
            if is_zebra:
                cell.fill = fill_zebra
            if col_idx in [5, 6, 7]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

    # -------------------------------------------------------------
    # TAB 5: 30-Day Ranking Roadmap (Ghulam Ali SEO Blueprint)
    # -------------------------------------------------------------
    ws5 = wb.create_sheet(title="30-Day Ranking Roadmap")
    ws5.views.sheetView[0].showGridLines = True
    
    ws5.merge_cells("A1:H1")
    t5 = ws5["A1"]
    t5.value = "30-DAY RANKING BLUEPRINT FOR REHMAN VET CLINIC (GHULAM ALI METHODOLOGY)"
    t5.font = font_main_title
    t5.fill = fill_navy
    t5.alignment = Alignment(horizontal="center", vertical="center")
    ws5.row_dimensions[1].height = 40

    headers5 = [
        "Day / Phase", 
        "Workflow Focus Area", 
        "Actionable Step-by-Step Tasks", 
        "Target Keywords Targeted", 
        "Content Specs & Word Count", 
        "Technical / Schema Requirement", 
        "Verification Metric", 
        "Status"
    ]
    
    ws5.row_dimensions[2].height = 28
    for col_idx, h in enumerate(headers5, 1):
        c = ws5.cell(row=2, column=col_idx, value=h)
        c.font = font_header
        c.fill = fill_navy
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_header

    roadmap = [
        (
            "Days 1 - 3",
            "Technical Foundation & Tracking",
            "1. Optimize page load speed under 1.8 seconds on mobile.\n2. Verify site on Google Search Console & submit XML sitemap.\n3. Implement VeterinaryCare & LocalBusiness JSON-LD schema.\n4. Optimize Google Business Profile (GBP) with exact NAP (Name, Address, Phone).",
            "Brand terms, 'veterinary clinic in lahore', 'vet near me'",
            "Meta tags, Canonical tags, robots.txt",
            "Zero 404 errors, valid schema in Google Rich Results test",
            "100% GSC coverage pass",
            "Ready to Execute"
        ),
        (
            "Days 4 - 7",
            "Lahore Local Landing Hub",
            "1. Launch dedicated /lahore main landing page.\n2. Publish sub-pages for DHA, Gulberg, Bahria Town.\n3. Embed interactive Google Map, clinic photos, doctor PVMC registration number.\n4. Add sticky WhatsApp & phone click-to-call buttons.",
            "animal hospital lahore, veterinary doctor lahore, best vet in lahore",
            "1,500+ words per city page",
            "LocalBusiness schema with aggregateRating and openingHours",
            "Indexed in Google Search Console within 48 hours",
            "Ready to Execute"
        ),
        (
            "Days 8 - 14",
            "High-Ticket Services & Price Transparency",
            "1. Publish 'Dog Vaccination Cost in Pakistan (2026 Price Table)'.\n2. Publish 'Cat Vaccination Price Lahore' & 'Cat Neutering Price Lahore'.\n3. Publish 'Pet Travel Certificate & Microchipping Pakistan'.\n4. Embed downloadable PDF vaccination schedule chart.",
            "dog vaccination cost in pakistan, cat neutering price lahore, pet travel certificate pakistan",
            "1,500 - 2,000 words per guide with comparison tables",
            "FAQ Schema markup on every pricing table (triggers Google SERP accordions)",
            "Top 20 ranking on KD < 8 keywords",
            "Ready to Execute"
        ),
        (
            "Days 15 - 21",
            "High-Volume Symptom & Emergency Silo",
            "1. Publish 'Canine Parvovirus Symptoms & Treatment Guide (Urdu & English)'.\n2. Publish 'Dog Ticks Treatment at Home in Pakistan'.\n3. Publish 'Cat Vomiting Yellow Liquid - Causes & First Aid'.\n4. Add internal linking from all symptom articles to Emergency Clinic Booking.",
            "parvovirus treatment for dogs pakistan, dog ticks treatment at home, cat vomiting yellow liquid",
            "2,000 - 2,500 words per symptom guide (comprehensive E-E-A-T)",
            "MedicalWebPage schema + author bio (licensed PVMC doctor)",
            "Spike in impressions in Google Search Console",
            "Ready to Execute"
        ),
        (
            "Days 22 - 27",
            "Competitor Gap 'Kill' Content",
            "1. Outrank Matchvet on 'Home Visit Vet in Lahore'.\n2. Outrank Round Lake on 'Animal Hospital Lahore'.\n3. Outrank Kamil Vet on 'Puppy Shot Schedule Pakistan'.\n4. Publish Persian Cat specific care guide ('What to Feed a Persian Cat in Pakistan').",
            "home visit vet in lahore, animal hospital in lahore, puppy vaccination schedule pakistan",
            "1,800+ words with rich tables and doctor Q&A",
            "Optimized OpenGraph tags for viral WhatsApp & Facebook pet group sharing",
            "Overtake competitors' ranking positions",
            "Ready to Execute"
        ),
        (
            "Days 28 - 30",
            "High-Impact Niche Backlinks & Citations",
            "1. Submit clinic to 20+ top Pakistani directories (InstaCare, Marham, PakBiz, BusinessList.pk).\n2. Outreach to local pet rescue NGOs (Todd's Welfare Society, ACF Animal Rescue) for contextual backlinks.\n3. Maintain natural anchor text (<10% exact match; 90% branded 'Rehman Vet Clinic' / naked URL).\n4. Request 50 Google Map reviews from satisfied clinic clients.",
            "Overall domain authority boost for all target keywords",
            "Editorial guest posts (600-900 words)",
            "DoFollow backlinks from indexed pages with existing traffic",
            "First page Google rankings locked in",
            "Ready to Execute"
        )
    ]

    for row_idx, r_data in enumerate(roadmap, 3):
        ws5.row_dimensions[row_idx].height = 60
        is_zebra = (row_idx % 2 == 0)
        for col_idx, val in enumerate(r_data, 1):
            cell = ws5.cell(row=row_idx, column=col_idx, value=val)
            cell.font = font_regular
            cell.border = border_thin
            if is_zebra:
                cell.fill = fill_zebra
            if col_idx in [1, 2, 7, 8]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

    # -------------------------------------------------------------
    # Format Column Widths Across All Sheets
    # -------------------------------------------------------------
    for ws in [ws1, ws2, ws3, ws4, ws5]:
        for col in ws.columns:
            col_letter = get_column_letter(col[0].column)
            max_len = 0
            for cell in list(col)[2:]:
                if cell.value:
                    val_str = str(cell.value)
                    lines = val_str.split("\n")
                    max_len = max(max_len, max(len(l) for l in lines))
            col_width = min(max(max_len + 4, 14), 50)
            ws.column_dimensions[col_letter].width = col_width

    # Specific tweaks for Tab 1 & 2
    ws1.column_dimensions['A'].width = 38
    ws1.column_dimensions['G'].width = 35
    ws1.column_dimensions['H'].width = 25
    ws1.column_dimensions['I'].width = 35
    
    ws2.column_dimensions['A'].width = 38
    ws2.column_dimensions['G'].width = 35
    ws2.column_dimensions['H'].width = 28
    ws2.column_dimensions['I'].width = 35

    output_filename = "Rehman_Vet_Clinic_Ahrefs_Live_SEO_Master.xlsx"
    wb.save(output_filename)
    print(f"Master workbook successfully built: {output_filename}")

if __name__ == "__main__":
    build_master_workbook()
