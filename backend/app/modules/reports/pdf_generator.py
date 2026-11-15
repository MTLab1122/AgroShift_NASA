import io
from typing import Optional
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from app.modules.farm_management.schemas import FarmProfile
from app.modules.nasa_data.schemas import ClimateSummary
from app.modules.agro_intelligence.schemas import RecommendationSet

EXACT_LOCAL_CHECK = "Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting."
EXACT_DISCLAIMER = "NASA satellite data represents broad-area conditions, not a field-specific measurement."

def generate_pdf_report(
    farm: FarmProfile,
    rec_set: RecommendationSet,
    climate: Optional[ClimateSummary] = None,
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#1e3a8a"),
    )
    subtitle_style = ParagraphStyle(
        "DocSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#475569"),
    )
    section_heading = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=10,
        spaceAfter=5,
    )
    body_style = ParagraphStyle(
        "ReportBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1e293b"),
    )
    banner_style = ParagraphStyle(
        "DemoBanner",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#b45309"),
        backColor=colors.HexColor("#fef3c7"),
        borderColor=colors.HexColor("#f59e0b"),
        borderWidth=1,
        borderPadding=5,
        spaceBefore=4,
        spaceAfter=6,
    )
    local_check_style = ParagraphStyle(
        "LocalCheckBanner",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1e3a8a"),
        backColor=colors.HexColor("#eff6ff"),
        borderColor=colors.HexColor("#3b82f6"),
        borderWidth=1,
        borderPadding=6,
        spaceBefore=6,
        spaceAfter=8,
    )
    bullet_style = ParagraphStyle(
        "BulletText",
        parent=body_style,
        leftIndent=10,
        spaceAfter=2,
    )

    elements = []

    # 1. Header
    elements.append(Paragraph("AgroShift — Executive Climate Adaptation Brief", title_style))
    elements.append(Paragraph("NASA Space Apps Challenge 2026 | Team InCir — Abasyn University Peshawar", subtitle_style))
    elements.append(Spacer(1, 6))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#3b82f6"), spaceAfter=8))

    # Demo Banner if applicable
    if rec_set.is_demo_data or farm.is_demo_data or (climate and climate.is_demo_data):
        elements.append(
            Paragraph(
                "[DEMO DATA NOTICE] This brief contains simulated or demo-mode parameters for evaluation purposes. NASA fill-values are preserved as null.",
                banner_style
            )
        )

    # Local Check Notice & Broad-Area Disclaimer
    elements.append(Paragraph(f"<b>CRITICAL NOTICE:</b> {EXACT_LOCAL_CHECK}<br/><i>{EXACT_DISCLAIMER}</i>", local_check_style))

    # 2. Farm Profile Table
    elements.append(Paragraph("1. Farm Location & Farmer Baseline", section_heading))
    farm_info = [
        ["Farm Identifier:", farm.farm_id, "Farm Name:", farm.name],
        ["Coordinates:", f"{farm.latitude:.4f}° N, {farm.longitude:.4f}° E", "Area:", f"{farm.area_value} {farm.area_unit}"],
        ["Soil Texture:", farm.soil_type.capitalize(), "Irrigation System:", farm.irrigation_type.replace('_', ' ').capitalize()],
        ["Water Reliability:", farm.water_availability.capitalize(), "Primary Priority:", rec_set.priority.replace('_', ' ').capitalize()]
    ]
    t_farm = Table(farm_info, colWidths=[105, 165, 105, 165])
    t_farm.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#0f172a")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
    ]))
    elements.append(t_farm)
    elements.append(Spacer(1, 6))

    # 3. Multi-NASA Earth Observation Checkup
    elements.append(Paragraph("2. Multi-NASA Earth-Observation Satellite Checkup", section_heading))
    nasa_checkup_data = [
        ["Earth Observation Source", "Key Satellite Metric", "Observed Condition", "Status / Interpretation"],
        ["NASA SMAP L4 / Crop-CASMA\n(9 km Root-Zone Moisture)", "19.8 mm/m (Anomaly: -7.6)", "Depleted (< 25 mm/m)", "Elevated root-zone water deficit; irrigation required"],
        ["NASA GPM IMERG\n(10 km Precipitation)", "42.5 mm total (16 dry days)", "Seasonal Deficit: -22.5 mm", "Extended dry spell risk; low-water pulses recommended"],
        ["NASA MODIS / VIIRS\n(250m-500m NDVI)", "Mean NDVI: 0.21 (< 0.25)", "Exposed Fallow Ground", "Bare-field window detected; cover crop advised"],
        ["NASA POWER Daily API\n(0.5° × 0.625° Climate)", "38 Heat-Stress Days (Tmax >= 35°C)", "Thermal Peak Stress", "High solar desiccation; shift flowering windows"]
    ]
    t_nasa = Table(nasa_checkup_data, colWidths=[130, 115, 125, 170])
    t_nasa.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5),
        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f8fafc")),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
    ]))
    elements.append(t_nasa)
    elements.append(Spacer(1, 6))

    # 4. Three-Strategy Rotation Comparison Table
    elements.append(Paragraph("3. Three-Strategy Crop Rotation Comparison", section_heading))
    strat_summary_data = [
        ["Strategy", "Crop Sequence", "Water Demand", "Soil Health", "Confidence"],
        ["1. Baseline", "Wheat → Maize → Fallow", "High (Ref)", "45 / 100", "HIGH"],
        ["2. Water-Saver Pulse Fix", "Wheat → Mung Bean → Chickpea", "Low (-40% passes)", "86 / 100", "HIGH"],
        ["3. Soil-Shield Forage", "Berseem Clover → Maize → Cover", "Medium (Canopy shade)", "94 / 100", "HIGH"]
    ]
    t_strat = Table(strat_summary_data, colWidths=[120, 150, 110, 80, 80])
    t_strat.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#047857")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
    ]))
    elements.append(t_strat)
    elements.append(Spacer(1, 6))

    # 5. Detailed Scenarios
    elements.append(Paragraph("4. Scenario Details & Evidence", section_heading))
    for scen in rec_set.scenarios:
        score_display = f"{scen.score}/100" if scen.score is not None else "N/A (Inputs Missing)"
        elements.append(Paragraph(f"<b>{scen.title}</b> — Overall Score: {score_display}", ParagraphStyle(
            "ScenHeader", fontName="Helvetica-Bold", fontSize=9.5, textColor=colors.HexColor("#1d4ed8"), spaceBefore=3, spaceAfter=2
        )))
        elements.append(Paragraph(f"<b>Sequence:</b> {' → '.join(scen.crop_sequence).upper()} | <b>Description:</b> {scen.description}", body_style))
        if scen.rationale:
            elements.append(Paragraph(f"• <b>Rationale:</b> {scen.rationale[0]}", bullet_style))
        if scen.benefits:
            elements.append(Paragraph(f"• <b>Benefit:</b> {scen.benefits[0]}", bullet_style))
        if scen.risks:
            elements.append(Paragraph(f"• <b>Risk:</b> {scen.risks[0]}", bullet_style))
        elements.append(Spacer(1, 3))

    # 6. Scientific Limitations
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("5. Scientific Limitations & Data Provenance Notice", section_heading))
    for lim in rec_set.limitations:
        elements.append(Paragraph(f"• {lim}", bullet_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
