import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Output PDF File paths
output_pdf_path = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\Meethi_Kahani_Team_Module_Assignments.pdf"
brainstorm_pdf_path = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\brainstorming\Meethi_Kahani_Team_Module_Assignments.pdf"

# Brand Colors
CRIMSON_RED = colors.HexColor("#9A2222")
LINEN_CREAM = colors.HexColor("#FAF5EE")
DARK_COCOA = colors.HexColor("#3D2314")
WARM_GOLD = colors.HexColor("#D4A359")
CHARCOAL = colors.HexColor("#222222")
MUTED_GREY = colors.HexColor("#666666")
LIGHT_BG = colors.HexColor("#F9F7F5")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(CRIMSON_RED)
        
        # Header text & line
        self.drawString(40, 755, "MEETHI KAHANI — TEAM MODULE ASSIGNMENTS & WORKFLOW SPECIFICATION")
        self.setStrokeColor(WARM_GOLD)
        self.setLineWidth(0.75)
        self.line(40, 747, 572, 747)

        # Footer line & text
        self.line(40, 45, 572, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED_GREY)
        self.drawString(40, 32, "Confidential — Meethi Kahani Foods Pvt Ltd — Team Work Breakdown Structure")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 32, page_str)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=55, bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=CRIMSON_RED,
        alignment=1,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=13,
        leading=17,
        textColor=WARM_GOLD,
        alignment=1,
        spaceAfter=20
    )

    doc_type_style = ParagraphStyle(
        'CoverDocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=DARK_COCOA,
        alignment=1,
        spaceAfter=6
    )

    doc_sub_style = ParagraphStyle(
        'CoverDocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=CHARCOAL,
        alignment=1,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=CRIMSON_RED,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=DARK_COCOA,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=CHARCOAL,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=CHARCOAL
    )

    cmd_style = ParagraphStyle(
        'CommandBlock',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8.5,
        leading=11,
        textColor=CRIMSON_RED,
        backColor=LIGHT_BG,
        borderColor=WARM_GOLD,
        borderWidth=0.5,
        borderPadding=5,
        spaceBefore=4,
        spaceAfter=6
    )

    story = []

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 30))
    story.append(Paragraph("MEETHI KAHANI", title_style))
    story.append(Paragraph('"Every Cookie Tells A Sweet Story"', subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=CRIMSON_RED, spaceAfter=20))

    story.append(Paragraph("TEAM MODULE ASSIGNMENTS & WORKFLOW SPECIFICATION", doc_type_style))
    story.append(Paragraph("Official Plain-English Work Breakdown for 4-Developer Parallel Vibe Coding", doc_sub_style))
    story.append(Spacer(1, 20))

    cover_meta = [
        [Paragraph("<b>Target Team:</b>", table_cell_style), Paragraph("Meethi Kahani 4-Developer Engineering Team", table_cell_style)],
        [Paragraph("<b>Lead Tech Architect:</b>", table_cell_style), Paragraph("AG (AI Engineering Partner)", table_cell_style)],
        [Paragraph("<b>Architecture Goal:</b>", table_cell_style), Paragraph("Zero-Conflict Parallel Vibe Coding via Modular Directory Isolation", table_cell_style)],
        [Paragraph("<b>Primary Tech Stack:</b>", table_cell_style), Paragraph("React 18 + JavaScript + Vite + Pure Vanilla CSS3", table_cell_style)],
        [Paragraph("<b>Document Version:</b>", table_cell_style), Paragraph("Version 1.1 Updated Assignment (Seller Portal -> Dev 2)", table_cell_style)],
        [Paragraph("<b>Date of Issuance:</b>", table_cell_style), Paragraph("August 2026", table_cell_style)]
    ]

    meta_table = Table(cover_meta, colWidths=[160, 350])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LINEN_CREAM),
        ('GRID', (0,0), (-1,-1), 0.5, WARM_GOLD),
        ('PADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 25))
    
    welcome_box = [
        [Paragraph("<b>EXECUTIVE TEAM DIRECTIVE:</b><br/>This specification establishes the official work breakdown structure for the 4-member development team. <b>Seller Portal (`/seller`) has been assigned to Developer 2</b> alongside Product Catalog. To guarantee that all 4 developers can write code simultaneously without overwriting each other's work, each team member is assigned an isolated workspace inside `src/modules/`.", ParagraphStyle('WelcomeTxt', parent=body_style, fontSize=8.5, leading=12))]
    ]
    welcome_table = Table(welcome_box, colWidths=[510])
    welcome_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, CRIMSON_RED),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(welcome_table)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 1: MASTER DIRECTORY MAP & TEAM ASSIGNMENTS
    # =========================================================================
    story.append(Paragraph("1. Master Workspace & Directory Isolation Map", h1_style))
    story.append(Paragraph("All application features are divided into 7 modular subdirectories inside `src/modules/`. Each developer is given exclusive ownership of specific module directories.", body_style))

    modules_assign = [
        [Paragraph("Developer", table_header_style), Paragraph("Assigned Module Directory", table_header_style), Paragraph("Key Features & Component Scope", table_header_style)],
        [Paragraph("<b>Developer 1</b>", table_cell_style), Paragraph("`src/modules/HeaderNav/`<br/>`src/modules/HeroBanner/`", table_cell_style), Paragraph("Centered Logo Header, Hamburger Drawer, Cart/Account triggers, Hero Banner Carousel, Freshness Ticker Badge.", table_cell_style)],
        [Paragraph("<b>Developer 2</b>", table_cell_style), Paragraph("`src/modules/ProductCatalog/`<br/>`src/modules/SellerPortal/` <b>(NEW)</b>", table_cell_style), Paragraph("Category Filter Tabs, Cookie Cards, Out-of-Stock Badges, Dedicated PDP (`/product/:slug`), Multi-photo gallery, 'The Kahani' story section, PLUS Secret Bakery Kitchen Portal (`/seller`), Live Order Queue, Stock Restock (`+50 Baked`), & Packaging Stock Manager.", table_cell_style)],
        [Paragraph("<b>Developer 3</b>", table_cell_style), Paragraph("`src/modules/CartPayment/`<br/>`src/modules/CustomerPortal/`", table_cell_style), Paragraph("Slide-Over Cart Drawer, Cookie Crumb Progress Bar, Serviceable Pincode Checker, Dummy Razorpay Modal, Reviews Carousel, Customer Account Modal & Live Cookie Order Tracker.", table_cell_style)],
        [Paragraph("<b>Developer 4</b>", table_cell_style), Paragraph("`src/modules/AdminPortal/`", table_cell_style), Paragraph("Secret Super Admin Dashboard (`/admin`), Hero Banner Manager, Coupons Manager, 2-Level Nested Catalog Manager, Style B GST Invoice Generator, & Dedicated 12-Module Analytics Dashboard (`/admin/analysis`).", table_cell_style)]
    ]

    assign_table = Table(modules_assign, colWidths=[85, 165, 260])
    assign_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CRIMSON_RED),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(assign_table)

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: DETAILED MODULE SPECIFICATIONS PER DEVELOPER
    # =========================================================================
    story.append(Paragraph("2. Detailed Module Specifications per Developer", h1_style))

    story.append(Paragraph("<b>DEVELOPER 1: Header Navigation & Hero Showcase</b>", h2_style))
    story.append(Paragraph("• <b>HeaderNav (`src/modules/HeaderNav/`):</b> Implement ultra-luxury centered logo layout. Left: Hamburger menu (`🍔`); Center: Meethi Kahani brand logo; Right: Account button (`👤`) and Cart button (`🛒`) with dynamic item counter badge.", bullet_style))
    story.append(Paragraph("• <b>Hamburger Drawer:</b> Slide-out drawer from left featuring navigation links (`Home`, `Gifting`, `Our Story`) and dynamic category tabs.", bullet_style))
    story.append(Paragraph("• <b>HeroBanner (`src/modules/HeroBanner/`):</b> Dynamic carousel slider rendering live admin banners. Includes persistent urgency badge: <i>'🔥 [X] Boxes left — Freshly baked in last 3 hours'</i>.", bullet_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>DEVELOPER 2: Product Catalog & Bakery Kitchen Seller Portal</b>", h2_style))
    story.append(Paragraph("• <b>ProductCatalog (`src/modules/ProductCatalog/`):</b> Dynamic category filter tabs (`Cookies`, `Gift Sets`, `Festive Combos`). Render product cards with price (₹), pieces count, native image, and out-of-stock badges.", bullet_style))
    story.append(Paragraph("• <b>Dedicated PDP (`/product/:slug`):</b> Navigates to dedicated URL. Left side: 3-4 thumbnail multi-angle photo gallery; Right side: Title, Price, Quantity Selector, Add to Cart, Pincode Delivery Checker, and <i>'The Kahani Behind This Cookie'</i> narrative.", bullet_style))
    story.append(Paragraph("• <b>SellerPortal (`src/modules/SellerPortal/`):</b> Secret URL `/seller`. Features Live Kitchen Order Fulfillment Queue (`Received` -> `Baking` -> `Shipped` -> `Delivered`), Stock Restock (`+50 Baked`), and Packaging Inventory Tracker (auto-decrements Box Tins, Wax Seals, Satin Ribbons).", bullet_style))

    story.append(PageBreak())

    story.append(Paragraph("<b>DEVELOPER 3: Cart, Checkout, & Customer Account Portal</b>", h2_style))
    story.append(Paragraph("• <b>CartPayment (`src/modules/CartPayment/`):</b> Slide-Over Cart Drawer sliding in from right. Features animated Cookie Crumb Progress Bar for free shipping, item subtotal, item removal, and Serviceable Pincode Checker.", bullet_style))
    story.append(Paragraph("• <b>Dummy Razorpay Payment Modal:</b> Simulated payment gateway modal (UPI QR scan simulation, Card inputs, instant order confirmation trigger).", bullet_style))
    story.append(Paragraph("• <b>CustomerPortal (`src/modules/CustomerPortal/`):</b> Sliding Customer Review Carousel above footer (1-5 🍪 rating). User Account Modal (`👤`) with Live Animated Cookie Crumb Order Status Tracker (`Placed` -> `Baking 👩‍🍳` -> `Out for Delivery 🚚` -> `Delivered ✅`). Includes PDF GST Invoice download button.", bullet_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>DEVELOPER 4: Secret Super Admin Dashboard & Analytics</b>", h2_style))
    story.append(Paragraph("• <b>AdminPortal (`src/modules/AdminPortal/`):</b> Secret URL `/admin`. Features Hero Carousel Manager (re-order, drag-and-drop, toggle active status), Offers/Coupons Manager, 2-Level Nested Category & Catalog Manager, Style B Clean Modern GST Tax Invoice Generator, and link to `/admin/analysis`.", bullet_style))
    story.append(Paragraph("• <b>Dedicated Analytics Suite (`/admin/analysis`):</b> Heavy 12-Module Analytics dashboard covering Stock Depletion Velocity, Traffic Channel Attribution (Google Organic, WhatsApp, Social), Ecosystem Plugins Performance, Demographics, Revenue, AOV, Flavor Velocity, Promo ROI, Customer Retention, and Delivery Logistics.", bullet_style))

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 3: GOLDEN COLLABORATION RULES & GIT WORKFLOW
    # =========================================================================
    story.append(Paragraph("3. Golden Rules for Parallel Development & Git Workflow", h1_style))

    rules_data = [
        [Paragraph("Rule #", table_header_style), Paragraph("Collaboration Protocol", table_header_style), Paragraph("Technical Enforcement", table_header_style)],
        [Paragraph("<b>Rule 1</b>", table_cell_style), Paragraph("Strict Directory Isolation", table_cell_style), Paragraph("Developers edit ONLY inside their assigned folder under `src/modules/`. Never touch another module folder.", table_cell_style)],
        [Paragraph("<b>Rule 2</b>", table_cell_style), Paragraph("Shared Context Contract", table_cell_style), Paragraph("All modules import state from `src/context/StoreContext.jsx`. Never create duplicate local states.", table_cell_style)],
        [Paragraph("<b>Rule 3</b>", table_cell_style), Paragraph("Git Branching Strategy", table_cell_style), Paragraph("Create personal branches (`dev1-header`, `dev2-catalog-seller`, `dev3-cart`, `dev4-admin`). Push branch and submit Pull Request.", table_cell_style)],
        [Paragraph("<b>Rule 4</b>", table_cell_style), Paragraph("Daily Sync Protocol", table_cell_style), Paragraph("Run `git pull origin main` every morning before starting new code to ensure up-to-date baseline.", table_cell_style)]
    ]

    rules_table = Table(rules_data, colWidths=[55, 145, 310])
    rules_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CRIMSON_RED),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(rules_table)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=15))

    signoff_data = [
        [Paragraph("<b>Lead Tech Architect Approval:</b>", table_cell_style), Paragraph("AG AI Engineering Partner", table_cell_style)],
        [Paragraph("<b>Document Hash:</b>", table_cell_style), Paragraph("MK-AG-TEAM-ASSIGNMENTS-V1.1-UPDATED", table_cell_style)]
    ]
    signoff_table = Table(signoff_data, colWidths=[160, 350])
    signoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(signoff_table)

    # Build PDF with Numbered Canvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated updated Team Assignments PDF at: {filename}")

if __name__ == "__main__":
    build_pdf(output_pdf_path)
    build_pdf(brainstorm_pdf_path)
