import csv
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def format_ahrefs_file():
    csv_path = r"C:\Users\AMMAR\Downloads\google_pk_animal-doctor-animal_matching-terms_2026-09-16_15-43-13.csv"
    output_excel_downloads = r"C:\Users\AMMAR\Downloads\google_pk_animal-doctor-animal_matching-terms_formatted.xlsx"
    output_excel_workspace = r"d:\Rehman Vet Clinic\google_pk_animal-doctor-animal_matching-terms_formatted.xlsx"
    
    with open(csv_path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        raw_rows = list(reader)
        
    print(f"Read {len(raw_rows)} rows from CSV.")
    
    wb = openpyxl.Workbook()
    
    # Styles
    font_title = Font(name="Segoe UI", size=15, bold=True, color="FFFFFF")
    font_sub = Font(name="Segoe UI", size=9, italic=True, color="64748B")
    font_header = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
    font_bold = Font(name="Segoe UI", size=10, bold=True, color="0F172A")
    font_regular = Font(name="Segoe UI", size=9.5, color="0F172A")
    font_kpi_num = Font(name="Segoe UI", size=18, bold=True, color="1E3A8A")
    font_kpi_label = Font(name="Segoe UI", size=9, bold=True, color="64748B")
    
    fill_navy = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    fill_blue = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    fill_emerald = PatternFill(start_color="065F46", end_color="065F46", fill_type="solid")
    fill_purple = PatternFill(start_color="581C87", end_color="581C87", fill_type="solid")
    fill_slate = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
    fill_zebra = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    fill_kpi_bg = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    
    fill_easy = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")    # KD 0-5 Green
    fill_medium = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")  # KD 6-15 Yellow
    fill_hard = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")    # KD 16+ Red
    
    fill_p1 = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
    fill_p2 = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    fill_p3 = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
    
    border_thin = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0')
    )
    border_header = Border(
        left=Side(style='thin', color='0F172A'),
        right=Side(style='thin', color='0F172A'),
        top=Side(style='medium', color='0F172A'),
        bottom=Side(style='medium', color='0F172A')
    )

    # Process & Clean Rows
    cleaned_rows = []
    lahore_rows = []
    active_vol_rows = []
    long_tail_rows = []
    
    total_pk_volume = 0
    total_lahore_vol = 0
    
    for r in raw_rows:
        rank = int(r.get('#', 0)) if r.get('#') else 0
        kw = r.get('Keyword', '').strip()
        
        # Volume
        vol_str = r.get('Volume', '').strip()
        vol = int(vol_str) if vol_str.isdigit() else 0
        total_pk_volume += vol
        
        # KD
        kd_str = r.get('Difficulty', '').strip()
        try:
            kd = float(kd_str)
        except:
            kd = 0.0 # Ahrefs empty KD indicates virtually zero competition
            
        # CPC
        cpc_str = r.get('CPC', '').strip()
        try:
            cpc = float(cpc_str)
        except:
            cpc = 0.0
            
        # Global Vol
        gvol_str = r.get('Global volume', '').strip()
        gvol = int(gvol_str) if gvol_str.isdigit() else (vol if vol > 0 else 0)
        
        # Traffic Potential
        tp_str = r.get('Traffic potential', '').strip()
        tp = int(tp_str) if tp_str.isdigit() else 0
        
        parent = r.get('Parent Keyword', '').strip() or kw
        intents = r.get('Intents', '').replace('\n', ', ').strip() or 'Local / Informational'
        serp = r.get('SERP Features', '').strip() or 'Organic Search'
        cat = r.get('Category', '').strip() or 'Veterinarians'
        
        # Classify Opportunity & Funnel
        kw_lower = kw.lower()
        is_lahore = 'lahore' in kw_lower or 'jail road' in kw_lower
        if is_lahore:
            total_lahore_vol += vol
            
        if 'emergency' in kw_lower or '24 hour' in kw_lower or 'near me' in kw_lower or 'call' in kw_lower:
            funnel = "Bottom of Funnel (BoFu)"
            page_type = "Emergency / Direct Booking Page"
            priority = "P1 - Critical"
        elif 'vaccin' in kw_lower or 'neutering' in kw_lower or 'spay' in kw_lower or 'cost' in kw_lower or 'price' in kw_lower or 'hospital' in kw_lower:
            funnel = "Middle of Funnel (MoFu)"
            page_type = "Service Page with Pricing & FAQ"
            priority = "P1 - Critical" if is_lahore else "P2 - High"
        elif is_lahore:
            funnel = "Bottom of Funnel (BoFu)"
            page_type = "Lahore City Landing Hub"
            priority = "P1 - Critical"
        elif 'salary' in kw_lower or 'job' in kw_lower or 'crossword' in kw_lower or 'clue' in kw_lower:
            funnel = "Top of Funnel (ToFu)"
            page_type = "Blog / Career Insight"
            priority = "P3 - Low"
        else:
            funnel = "Top of Funnel (ToFu)"
            page_type = "Clinical Guide / Pet Health Blog"
            priority = "P2 - High" if vol >= 20 else "P3 - Low"
            
        # Opportunity Level
        if vol >= 50 and kd <= 10:
            opp_level = "🔥 Top Opportunity"
        elif vol >= 20 and kd <= 15:
            opp_level = "⭐ High Potential"
        elif vol > 0:
            opp_level = "✓ Steady Traffic"
        else:
            opp_level = "🌱 Long-Tail Semantic"
            
        row_tuple = (
            rank,
            kw,
            vol,
            kd,
            cpc,
            gvol,
            tp,
            parent,
            intents,
            serp[:45] if len(serp) > 45 else serp,
            cat,
            opp_level,
            funnel,
            page_type,
            priority
        )
        
        cleaned_rows.append(row_tuple)
        
        if is_lahore:
            lahore_rows.append(row_tuple)
        if vol >= 10:
            active_vol_rows.append(row_tuple)
        else:
            long_tail_rows.append(row_tuple)

    # Sort subsets
    lahore_rows.sort(key=lambda x: x[2], reverse=True)
    active_vol_rows.sort(key=lambda x: x[2], reverse=True)

    # -------------------------------------------------------------
    # SHEET 1: Executive KPI Dashboard & Summary
    # -------------------------------------------------------------
    ws0 = wb.active
    ws0.title = "Executive SEO Dashboard"
    ws0.views.sheetView[0].showGridLines = True
    
    ws0.merge_cells("A1:G1")
    t0 = ws0["A1"]
    t0.value = "AHREFS RESEARCH INTELLIGENCE DASHBOARD — REHMAN VET CLINIC"
    t0.font = font_title
    t0.fill = fill_navy
    t0.alignment = Alignment(horizontal="center", vertical="center")
    ws0.row_dimensions[1].height = 42
    
    ws0.merge_cells("A2:G2")
    s0 = ws0["A2"]
    s0.value = f"Source: google_pk_animal-doctor-animal_matching-terms_2026-09-16_15-43-13.csv | Processed on September 16, 2026"
    s0.font = font_sub
    s0.fill = fill_zebra
    s0.alignment = Alignment(horizontal="center", vertical="center")
    ws0.row_dimensions[2].height = 22
    
    # KPI Metric Cards
    kpi_cards = [
        ("TOTAL KEYWORDS ANALYZED", f"{len(cleaned_rows):,}", "1,000 queries from Ahrefs"),
        ("TOTAL MONTHLY PK SEARCHES", f"{total_pk_volume:,}", "Verified monthly demand"),
        ("LAHORE SPECIFIC QUERIES", f"{len(lahore_rows)}", f"{total_lahore_vol:,} monthly searches"),
        ("EASY WIN KEYWORDS (KD <= 10)", f"{sum(1 for r in cleaned_rows if r[3] <= 10):,}", "Instant ranking opportunity"),
        ("ACTIVE VOLUME TERMS (VOL >= 10)", f"{len(active_vol_rows)}", "Primary commercial targets")
    ]
    
    ws0.row_dimensions[4].height = 20
    ws0.row_dimensions[5].height = 35
    ws0.row_dimensions[6].height = 18
    
    for i, (label, val, note) in enumerate(kpi_cards, 1):
        col_letter = get_column_letter(i + 1)
        
        c_lbl = ws0.cell(row=4, column=i+1, value=label)
        c_lbl.font = font_kpi_label
        c_lbl.fill = fill_kpi_bg
        c_lbl.alignment = Alignment(horizontal="center", vertical="center")
        c_lbl.border = border_thin
        
        c_val = ws0.cell(row=5, column=i+1, value=val)
        c_val.font = font_kpi_num
        c_val.fill = fill_kpi_bg
        c_val.alignment = Alignment(horizontal="center", vertical="center")
        c_val.border = border_thin
        
        c_note = ws0.cell(row=6, column=i+1, value=note)
        c_note.font = font_sub
        c_note.fill = fill_kpi_bg
        c_note.alignment = Alignment(horizontal="center", vertical="center")
        c_note.border = border_thin

    # Quick Links & Overview Table
    ws0.cell(row=8, column=2, value="TOP 15 HIGHEST VOLUME SEARCH PHRASES IN PAKISTAN").font = font_bold
    
    dash_headers = ["Rank", "Keyword", "Monthly Vol (PK)", "KD (0-100)", "CPC ($)", "Parent Topic", "Opportunity"]
    ws0.row_dimensions[9].height = 26
    for col_i, dh in enumerate(dash_headers, 2):
        c = ws0.cell(row=9, column=col_i, value=dh)
        c.font = font_header
        c.fill = fill_blue
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = border_header
        
    for r_i, r_data in enumerate(cleaned_rows[:15], 10):
        ws0.row_dimensions[r_i].height = 22
        is_z = (r_i % 2 == 0)
        vals = [r_data[0], r_data[1], r_data[2], r_data[3], f"${r_data[4]:.2f}", r_data[7], r_data[11]]
        for col_i, v in enumerate(vals, 2):
            c = ws0.cell(row=r_i, column=col_i, value=v)
            c.font = font_regular
            c.border = border_thin
            if is_z:
                c.fill = fill_zebra
            if col_i in [2, 4, 5, 6]:
                c.alignment = Alignment(horizontal="center", vertical="center")
            elif col_i == 7:
                c.alignment = Alignment(horizontal="center", vertical="center")
                if "Top" in str(v):
                    c.fill = fill_p1
                    c.font = font_bold
                elif "High" in str(v):
                    c.fill = fill_p2
            else:
                c.alignment = Alignment(horizontal="left", vertical="center")

    # -------------------------------------------------------------
    # SHEET 2: All 1,000 Cleaned Keywords (Master List)
    # -------------------------------------------------------------
    ws1 = wb.create_sheet(title="All 1000 Keywords Cleaned")
    ws1.views.sheetView[0].showGridLines = True
    
    ws1.merge_cells("A1:O1")
    t1 = ws1["A1"]
    t1.value = "AHREFS LIVE MASTER KEYWORD DATABASE (1,000 QUERIES)"
    t1.font = font_title
    t1.fill = fill_navy
    t1.alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[1].height = 38
    
    headers_master = [
        "#", 
        "Keyword", 
        "Monthly Vol (PK)", 
        "Difficulty (KD)", 
        "CPC ($ USD)", 
        "Global Vol", 
        "Traffic Potential", 
        "Parent Keyword", 
        "Search Intent", 
        "SERP Features", 
        "Category", 
        "Opportunity Level", 
        "Funnel Stage", 
        "Recommended Content Page", 
        "Priority"
    ]
    
    ws1.row_dimensions[3].height = 28
    for col_idx, h in enumerate(headers_master, 1):
        c = ws1.cell(row=3, column=col_idx, value=h)
        c.font = font_header
        c.fill = fill_blue
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_header

    for r_idx, r_data in enumerate(cleaned_rows, 4):
        ws1.row_dimensions[r_idx].height = 21
        is_z = (r_idx % 2 == 0)
        for col_idx, val in enumerate(r_data, 1):
            cell = ws1.cell(row=r_idx, column=col_idx, value=val)
            cell.font = font_regular
            cell.border = border_thin
            if is_z:
                cell.fill = fill_zebra
                
            # Number formatting & Alignments
            if col_idx == 1:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx in [3, 6, 7]: # Volumes & TP
                cell.alignment = Alignment(horizontal="right", vertical="center")
                cell.number_format = "#,##0"
            elif col_idx == 4: # KD
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "0"
                if val <= 5:
                    cell.fill = fill_easy
                elif val <= 15:
                    cell.fill = fill_medium
                else:
                    cell.fill = fill_hard
            elif col_idx == 5: # CPC
                cell.alignment = Alignment(horizontal="right", vertical="center")
                cell.number_format = "$#,##0.00"
            elif col_idx in [12, 13, 15]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                if col_idx == 15:
                    if "P1" in str(val):
                        cell.fill = fill_p1
                        cell.font = font_bold
                    elif "P2" in str(val):
                        cell.fill = fill_p2
                    else:
                        cell.fill = fill_p3
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

    ws1.freeze_panes = "C4"
    ws1.auto_filter.ref = f"A3:O{len(cleaned_rows)+3}"

    # -------------------------------------------------------------
    # SHEET 3: Lahore Veterinary & Local Clinic Queries
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="Lahore Local Clinic Keywords")
    ws2.views.sheetView[0].showGridLines = True
    
    ws2.merge_cells("A1:O1")
    t2 = ws2["A1"]
    t2.value = "LAHORE SPECIFIC ANIMAL DOCTOR & VET CLINIC QUERIES"
    t2.font = font_title
    t2.fill = fill_emerald
    t2.alignment = Alignment(horizontal="center", vertical="center")
    ws2.row_dimensions[1].height = 38

    ws2.row_dimensions[3].height = 28
    for col_idx, h in enumerate(headers_master, 1):
        c = ws2.cell(row=3, column=col_idx, value=h)
        c.font = font_header
        c.fill = fill_emerald
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_header

    for r_idx, r_data in enumerate(lahore_rows, 4):
        ws2.row_dimensions[r_idx].height = 23
        is_z = (r_idx % 2 == 0)
        for col_idx, val in enumerate(r_data, 1):
            cell = ws2.cell(row=r_idx, column=col_idx, value=val)
            cell.font = font_regular
            cell.border = border_thin
            if is_z:
                cell.fill = fill_zebra
                
            if col_idx == 1:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx in [3, 6, 7]:
                cell.alignment = Alignment(horizontal="right", vertical="center")
                cell.number_format = "#,##0"
            elif col_idx == 4:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "0"
                if val <= 5:
                    cell.fill = fill_easy
                elif val <= 15:
                    cell.fill = fill_medium
                else:
                    cell.fill = fill_hard
            elif col_idx == 5:
                cell.alignment = Alignment(horizontal="right", vertical="center")
                cell.number_format = "$#,##0.00"
            elif col_idx in [12, 13, 15]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                if col_idx == 15:
                    if "P1" in str(val):
                        cell.fill = fill_p1
                        cell.font = font_bold
                    elif "P2" in str(val):
                        cell.fill = fill_p2
                    else:
                        cell.fill = fill_p3
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

    ws2.freeze_panes = "C4"
    ws2.auto_filter.ref = f"A3:O{len(lahore_rows)+3}"

    # -------------------------------------------------------------
    # SHEET 4: High-Opportunity Active Volume Keywords (Vol >= 10)
    # -------------------------------------------------------------
    ws3 = wb.create_sheet(title="Active Volume Targets (Vol>=10)")
    ws3.views.sheetView[0].showGridLines = True
    
    ws3.merge_cells("A1:O1")
    t3 = ws3["A1"]
    t3.value = "PRIMARY COMMERCIAL TARGETS (MONTHLY VOL >= 10 IN PAKISTAN)"
    t3.font = font_title
    t3.fill = fill_purple
    t3.alignment = Alignment(horizontal="center", vertical="center")
    ws3.row_dimensions[1].height = 38

    ws3.row_dimensions[3].height = 28
    for col_idx, h in enumerate(headers_master, 1):
        c = ws3.cell(row=3, column=col_idx, value=h)
        c.font = font_header
        c.fill = fill_purple
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = border_header

    for r_idx, r_data in enumerate(active_vol_rows, 4):
        ws3.row_dimensions[r_idx].height = 23
        is_z = (r_idx % 2 == 0)
        for col_idx, val in enumerate(r_data, 1):
            cell = ws3.cell(row=r_idx, column=col_idx, value=val)
            cell.font = font_regular
            cell.border = border_thin
            if is_z:
                cell.fill = fill_zebra
                
            if col_idx == 1:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx in [3, 6, 7]:
                cell.alignment = Alignment(horizontal="right", vertical="center")
                cell.number_format = "#,##0"
            elif col_idx == 4:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.number_format = "0"
                if val <= 5:
                    cell.fill = fill_easy
                elif val <= 15:
                    cell.fill = fill_medium
                else:
                    cell.fill = fill_hard
            elif col_idx == 5:
                cell.alignment = Alignment(horizontal="right", vertical="center")
                cell.number_format = "$#,##0.00"
            elif col_idx in [12, 13, 15]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                if col_idx == 15:
                    if "P1" in str(val):
                        cell.fill = fill_p1
                        cell.font = font_bold
                    elif "P2" in str(val):
                        cell.fill = fill_p2
                    else:
                        cell.fill = fill_p3
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

    ws3.freeze_panes = "C4"
    ws3.auto_filter.ref = f"A3:O{len(active_vol_rows)+3}"

    # -------------------------------------------------------------
    # Auto-adjust column widths across all sheets
    # -------------------------------------------------------------
    for ws in [ws0, ws1, ws2, ws3]:
        for col in ws.columns:
            col_letter = get_column_letter(col[0].column)
            max_len = 0
            for cell in list(col)[2:]:
                if cell.value is not None:
                    s = str(cell.value)
                    max_len = max(max_len, len(s))
            ws.column_dimensions[col_letter].width = min(max(max_len + 4, 12), 48)

    # Specific column adjustments for tables
    for ws in [ws1, ws2, ws3]:
        ws.column_dimensions['A'].width = 8   # Rank
        ws.column_dimensions['B'].width = 38  # Keyword
        ws.column_dimensions['C'].width = 16  # Vol
        ws.column_dimensions['D'].width = 15  # KD
        ws.column_dimensions['E'].width = 14  # CPC
        ws.column_dimensions['F'].width = 14  # Global Vol
        ws.column_dimensions['G'].width = 16  # TP
        ws.column_dimensions['H'].width = 28  # Parent
        ws.column_dimensions['I'].width = 26  # Intent
        ws.column_dimensions['J'].width = 32  # SERP
        ws.column_dimensions['K'].width = 16  # Cat
        ws.column_dimensions['L'].width = 20  # Opportunity
        ws.column_dimensions['M'].width = 24  # Funnel
        ws.column_dimensions['N'].width = 32  # Page type
        ws.column_dimensions['O'].width = 16  # Priority

    # Save to Downloads and Workspace
    wb.save(output_excel_downloads)
    wb.save(output_excel_workspace)
    print(f"Successfully formatted and saved to:")
    print(f" 1. {output_excel_downloads}")
    print(f" 2. {output_excel_workspace}")

if __name__ == "__main__":
    format_ahrefs_file()
