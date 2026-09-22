import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_pdf():
    pdf_dir = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\PDFs"
    os.makedirs(pdf_dir, exist_ok=True)
    pdf_path = os.path.join(pdf_dir, "Hero_Banner_Image_Dimensions_Guide.pdf")

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    CRIMSON = colors.HexColor("#9A2222")
    DARK_COCOA = colors.HexColor("#111111")
    CREAM_BG = colors.HexColor("#F9EFE5")
    TEXT_MUTED = colors.HexColor("#555555")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=CRIMSON,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=TEXT_MUTED,
        spaceAfter=15
    )

    h2_style = ParagraphStyle(
        'H2Heading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=DARK_COCOA,
        spaceBefore=14,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=DARK_COCOA,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=12,
        spaceAfter=4
    )

    story = []

    # Title & Header
    story.append(Paragraph("MEETHI KAHANI", ParagraphStyle('Brand', fontName='Helvetica-Bold', fontSize=10, textColor=CRIMSON, spaceAfter=2)))
    story.append(Paragraph("Single Master Hero Banner Specification Guide", title_style))
    story.append(Paragraph("Design specification for the 1 single master banner image uploaded by Admin to serve Desktop, Tablet & Mobile.", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=CRIMSON, spaceAfter=15))

    # Section 1: Single Master Pixel Dimensions Table
    story.append(Paragraph("1. Single Master Image Specification (Universal 1-Pic Setup)", h2_style))
    story.append(Paragraph("The Admin uploads <b>1 single image file</b> per banner. Designers should create the artwork using these exact universal master dimensions:", body_style))
    story.append(Spacer(1, 6))

    table_data = [
        [
            Paragraph("<b>Parameter</b>", body_style),
            Paragraph("<b>Master Value Specification</b>", body_style),
            Paragraph("<b>Designer Guidance</b>", body_style)
        ],
        [
            Paragraph("<b>Master Resolution</b>", body_style),
            Paragraph("<b>1920 px × 600 px</b>", body_style),
            Paragraph("Creates 4K crispness on Desktop & Retina screens", body_style)
        ],
        [
            Paragraph("<b>Aspect Ratio</b>", body_style),
            Paragraph("<b>16 : 5</b> <i>(3.2 : 1 Ratio)</i>", body_style),
            Paragraph("Ultrawide landscape aspect ratio", body_style)
        ],
        [
            Paragraph("<b>Safe Central Content Zone</b>", body_style),
            Paragraph("<b>1200 px × 450 px</b><br/><i>(Centered Region)</i>", body_style),
            Paragraph("Place all critical text & key cookie graphics within this inner box so nothing gets cropped on smaller screens", body_style)
        ],
        [
            Paragraph("<b>Minimum Acceptable Resolution</b>", body_style),
            Paragraph("<b>1600 px × 500 px</b>", body_style),
            Paragraph("Lowest recommended resolution to avoid pixelation", body_style)
        ]
    ]

    summary_table = Table(table_data, colWidths=[150, 160, 230])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), CREAM_BG),
        ('TEXTCOLOR', (0, 0), (-1, 0), DARK_COCOA),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#D8C3B0")),
    ]))

    story.append(summary_table)
    story.append(Spacer(1, 14))

    # Section 2: How 1 Image Scales Across Devices
    story.append(Paragraph("2. How the 1 Single Master Image Renders Across Viewports", h2_style))
    story.append(Paragraph("When the 1 master image (`1920 × 600 px`) is uploaded, the storefront automatically scales it seamlessly:", body_style))
    
    story.append(Paragraph("• <b>Desktop Viewport (Large Screens)</b>: Displays full width at up to `420 px` height. All 1920 px width is visible.", bullet_style))
    story.append(Paragraph("• <b>Tablet Viewport (Medium Screens)</b>: Scales down proportionally to `360 px` height.", bullet_style))
    story.append(Paragraph("• <b>Mobile Viewport (Smartphones)</b>: Scales responsively to `260 px` height. Because text/graphics are inside the <b>Safe Central Zone</b>, the artwork remains 100% visible and sharp.", bullet_style))

    story.append(Spacer(1, 10))

    # Section 3: File Format & Export Standards
    story.append(Paragraph("3. Export Settings & Compression Standards", h2_style))
    
    export_table_data = [
        [Paragraph("<b>Export Option</b>", body_style), Paragraph("<b>Setting Requirement</b>", body_style)],
        [Paragraph("<b>File Format</b>", body_style), Paragraph("<b>.WebP</b> (Recommended) or <b>.PNG</b> / <b>.JPG</b>", body_style)],
        [Paragraph("<b>Max File Size</b>", body_style), Paragraph("<b>< 250 KB</b> for ultra-fast instant web load", body_style)],
        [Paragraph("<b>Color Space</b>", body_style), Paragraph("<b>sRGB</b> (Prevents crimson color distortion)", body_style)],
        [Paragraph("<b>DPI / PPI</b>", body_style), Paragraph("<b>72 DPI</b> (Web standard)", body_style)]
    ]

    export_table = Table(export_table_data, colWidths=[160, 380])
    export_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F2E4D6")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#D8C3B0")),
    ]))

    story.append(export_table)
    story.append(Spacer(1, 16))

    # Footer Notice
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#D8C3B0"), spaceAfter=10))
    story.append(Paragraph("© 2026 Meethi Kahani Foods Pvt Ltd — Single Master Hero Banner Image Specification Guide", ParagraphStyle('Footer', fontName='Helvetica', fontSize=8, textColor=TEXT_MUTED, alignment=1)))

    doc.build(story)
    print(f"SUCCESS: Single Master Hero Banner Dimensions Guide PDF generated at: {pdf_path}")

if __name__ == '__main__':
    generate_pdf()
