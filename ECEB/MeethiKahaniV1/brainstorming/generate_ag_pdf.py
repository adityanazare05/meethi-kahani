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
output_pdf_path = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\Meethi_Kahani_Architecture_Guide.pdf"
brainstorm_pdf_path = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\brainstorming\Meethi_Kahani_Architecture_Guide.pdf"

# Color Palette (Brand Identity)
CRIMSON_RED = colors.HexColor("#9A2222")
LINEN_CREAM = colors.HexColor("#FAF5EE")
DARK_COCOA = colors.HexColor("#3D2314")
WARM_GOLD = colors.HexColor("#D4A359")
CHARCOAL = colors.HexColor("#222222")
MUTED_GREY = colors.HexColor("#666666")
LIGHT_BG = colors.HexColor("#F9F7F5")

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and display total page count in footers.
    """
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
            # Suppress headers/footers on cover page
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(CRIMSON_RED)
        
        # Header text & line
        self.drawString(40, 755, "MEETHI KAHANI — SYSTEM ARCHITECTURE GUIDE (AG MASTER SPECIFICATION)")
        self.setStrokeColor(WARM_GOLD)
        self.setLineWidth(0.75)
        self.line(40, 747, 572, 747)

        # Footer line & text
        self.line(40, 45, 572, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED_GREY)
        self.drawString(40, 32, "Confidential — Meethi Kahani Foods Pvt Ltd — Frontend & Backend Architecture")
        
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

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=DARK_COCOA,
        backColor=LIGHT_BG,
        borderColor=WARM_GOLD,
        borderWidth=0.5,
        borderPadding=4,
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

    story.append(Paragraph("SYSTEM ARCHITECTURE GUIDE (AG SPECIFICATION)", doc_type_style))
    story.append(Paragraph("Comprehensive Technical Architecture Blueprint: Frontend Modular Engine & Backend Data Systems", doc_sub_style))
    story.append(Spacer(1, 25))

    cover_meta = [
        [Paragraph("<b>Project Name:</b>", table_cell_style), Paragraph("Meethi Kahani (D2C Artisanal Cookie E-Commerce)", table_cell_style)],
        [Paragraph("<b>Lead Tech Architect:</b>", table_cell_style), Paragraph("AG (AI Engineering Partner)", table_cell_style)],
        [Paragraph("<b>Architecture Scope:</b>", table_cell_style), Paragraph("Full Stack (React 18 Frontend + Relational Backend DB + Modular CMS + Plugin & Channel Analytics)", table_cell_style)],
        [Paragraph("<b>Dietary USP & Market:</b>", table_cell_style), Paragraph("100% Pure Eggless Artisanal Bakery | Mumbai Metropolitan Region (MMR)", table_cell_style)],
        [Paragraph("<b>Document Status:</b>", table_cell_style), Paragraph("Approved AG Architectural Specification v1.1 (Updated)", table_cell_style)],
        [Paragraph("<b>Primary Color Palette:</b>", table_cell_style), Paragraph("Crimson Red (#9A2222), Vanilla Linen (#FAF5EE), Dark Cocoa (#3D2314)", table_cell_style)],
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

    story.append(Spacer(1, 30))
    
    exec_summary_box = [
        [Paragraph("<b>ARCHITECTURE PRINCIPLE:</b><br/>This document provides the definitive architectural masterplan for <b>Meethi Kahani</b>. It covers the complete end-to-end blueprint comprising the modular React frontend hierarchy, single master stock database schema, dynamic secret admin/seller portals, comprehensive 12-module analytical suite (including Traffic Acquisition & Plugin Analytics), 1-Day Metro Express logistics model, and security protocols.", ParagraphStyle('ExecSummary', parent=body_style, fontSize=8.5, leading=12))]
    ]
    exec_table = Table(exec_summary_box, colWidths=[510])
    exec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, CRIMSON_RED),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(exec_table)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY & SYSTEM OVERVIEW
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & System Overview", h1_style))
    story.append(Paragraph("<b>Meethi Kahani</b> is an ultra-luxury Direct-To-Consumer (D2C) artisanal cookie brand based in Mumbai. The digital platform is engineered to combine authentic heritage recipes with modern digital luxury. It operates on a single-product focus (100% Cookies for Years 1-2) with a strict 100% Pure Eggless guarantee targeting India's massive vegetarian market.", body_style))
    
    story.append(Paragraph("<b>Core System Principles:</b>", h2_style))
    story.append(Paragraph("• <b>Strict No-Popups Policy:</b> Zero intrusive overlays or social proof popups to preserve a serene, high-end luxury shopping experience.", bullet_style))
    story.append(Paragraph("• <b>Single Master Stock Pool:</b> All D2C order tracks (Personal, Gifting) draw inventory from a unified central cookie stock table.", bullet_style))
    story.append(Paragraph("• <b>Secret Portal Architecture:</b> Admin (`/admin`) and Kitchen Seller (`/seller`) portals are strictly hidden from public navigation and protected by authenticated credentials.", bullet_style))
    story.append(Paragraph("• <b>Decoupled Analytics Engine:</b> High-volume sales, traffic channel attribution, and plugin performance analytics are isolated on `/admin/analysis` to maintain sub-second frontend rendering speed.", bullet_style))

    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 2: FRONTEND ARCHITECTURE & COMPONENT BLUEPRINT
    # =========================================================================
    story.append(Paragraph("2. Frontend Architecture & Modular Component Blueprint", h1_style))
    story.append(Paragraph("The frontend is built using <b>React 18 + Vite + JavaScript (ES6+)</b> and styled with <b>Pure Vanilla CSS3</b> (utilizing CSS custom properties for brand design tokens).", body_style))
    
    story.append(Paragraph("<b>7-Module Team Collaboration Map:</b>", h2_style))
    story.append(Paragraph("To ensure seamless parallel development across a multi-developer team, the application is divided into 7 independent modules inside `src/modules/`. All modules consume shared contracts from `StoreContext.jsx` and `dataContracts.js`.", body_style))

    modules_data = [
        [Paragraph("Module & Path", table_header_style), Paragraph("Responsible Scope", table_header_style), Paragraph("Key Features & Interfacing", table_header_style)],
        [Paragraph("<b>Module 1: HeaderNav</b><br/>`src/modules/HeaderNav/`", table_cell_style), Paragraph("Navigation & Global Bar", table_cell_style), Paragraph("Centered Logo Header layout (Left: `🍔` Drawer, Center: Logo, Right: `👤` Account & `🛒` Cart). Slide-out navigation drawer.", table_cell_style)],
        [Paragraph("<b>Module 2: HeroBanner</b><br/>`src/modules/HeroBanner/`", table_cell_style), Paragraph("Hero Showcase & Urgency", table_cell_style), Paragraph("Dynamic Banner Carousel Slider (Admin-managed) + Freshness Ticker Badge (<i>'🔥 [X] Boxes left -- Freshly baked in last 3 hours'</i>).", table_cell_style)],
        [Paragraph("<b>Module 3: ProductCatalog</b><br/>`src/modules/ProductCatalog/`", table_cell_style), Paragraph("Catalog & PDP Details", table_cell_style), Paragraph("Category Filter Tabs, Cookie Cards with out-of-stock badges, Dedicated PDP (`/product/:slug`), multi-thumbnail gallery, & 'The Kahani' story modal.", table_cell_style)],
        [Paragraph("<b>Module 4: CartPayment</b><br/>`src/modules/CartPayment/`", table_cell_style), Paragraph("Cart Drawer & Checkout", table_cell_style), Paragraph("Slide-Over Cart Drawer, live Cookie Crumb Progress Bar for free delivery, Serviceable Pincode Checker, & Pixel-Perfect Dummy Razorpay Modal.", table_cell_style)],
        [Paragraph("<b>Module 5: CustomerPortal</b><br/>`src/modules/CustomerPortal/`", table_cell_style), Paragraph("Account & Reviews", table_cell_style), Paragraph("Sliding Review Carousel (above footer, 1-5 🍪 rating), Customer Account Modal (`👤`), Live Animated Cookie Crumb Order Tracker, & Invoice PDF Download.", table_cell_style)],
        [Paragraph("<b>Module 6: AdminPortal</b><br/>`src/modules/AdminPortal/`", table_cell_style), Paragraph("Super Admin CMS", table_cell_style), Paragraph("Secret URL `/admin`, Banner Carousel Manager, Coupons Manager, 2-Level Nested Category & Catalog Manager, Style B GST Invoice Customizer, & Analytics Tab.", table_cell_style)],
        [Paragraph("<b>Module 7: SellerPortal</b><br/>`src/modules/SellerPortal/`", table_cell_style), Paragraph("Bakery Kitchen Operations", table_cell_style), Paragraph("Secret URL `/seller`, Live Order Fulfillment Queue (Received -> Baking -> Shipped -> Delivered), Restock ('+50 Baked'), & Packaging Stock Tracker.", table_cell_style)]
    ]

    modules_table = Table(modules_data, colWidths=[120, 120, 270])
    modules_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CRIMSON_RED),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(modules_table)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>Multi-Page Routing Hierarchy (SPA):</b>", h2_style))
    story.append(Paragraph("• `/` — Main Storefront (Hero, Offers, Products, Cart Drawer, Footer)", bullet_style))
    story.append(Paragraph("• `/gifting` — Gifting Hub (Build-Your-Own Box, 25% MRP discount, custom wax-sealed card & video QR code)", bullet_style))
    story.append(Paragraph("• `/product/:slug` — Dedicated PDP (Left multi-photo thumbnail gallery, right-side details & Kahani story)", bullet_style))
    story.append(Paragraph("• `/story` — Brand Heritage Narrative Page", bullet_style))
    story.append(Paragraph("• `/admin` — Secret Super Admin Control Center", bullet_style))
    story.append(Paragraph("• `/admin/analysis` — Dedicated Comprehensive Analytics Dashboard (12 Modules)", bullet_style))
    story.append(Paragraph("• `/seller` — Secret Bakery Kitchen Order & Inventory Portal", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: BACKEND ARCHITECTURE & DATABASE SCHEMA
    # =========================================================================
    story.append(Paragraph("3. Backend Architecture & Data Models", h1_style))
    story.append(Paragraph("The backend infrastructure utilizes a highly normalized relational database structure designed for high concurrency, real-time inventory updates, traffic attribution logging, and analytical query execution.", body_style))

    story.append(Paragraph("<b>Database Schema Overview (12 Core Relational Tables):</b>", h2_style))

    tables_data = [
        [Paragraph("Table Name", table_header_style), Paragraph("Primary / Foreign Keys", table_header_style), Paragraph("Core Purpose & Column Highlights", table_header_style)],
        [Paragraph("`Customers`", table_cell_style), Paragraph("`id` (PK)", table_cell_style), Paragraph("Stores customer profiles, phone, email, saved address JSON, Kahani Coins ('Kisse') balance, and total order count.", table_cell_style)],
        [Paragraph("`Admin_Sellers`", table_cell_style), Paragraph("`id` (PK)", table_cell_style), Paragraph("Stores admin & bakery seller login credentials, role (`SUPER_ADMIN`, `SELLER_KITCHEN`), kitchen location, and status.", table_cell_style)],
        [Paragraph("`Categories`", table_cell_style), Paragraph("`id` (PK)", table_cell_style), Paragraph("Product categories (`Cookies`, `Fudges`, `Gift Sets`), display order, and active flag.", table_cell_style)],
        [Paragraph("`Cookie_Stock`", table_cell_style), Paragraph("`id` (PK), `category_id` (FK)", table_cell_style), Paragraph("Single Master Inventory pool for cookie SKUs. Contains name, slug, price (₹), stock_pieces, photo_urls, and Kahani story text.", table_cell_style)],
        [Paragraph("`Packaging_Stock`", table_cell_style), Paragraph("`id` (PK)", table_cell_style), Paragraph("Tracks physical packaging inventory: Box Tins (4, 8, 12 count), Wax Seals, Ribbons, and Thermal Mailers with low-stock alerts.", table_cell_style)],
        [Paragraph("`Hero_Banners`", table_cell_style), Paragraph("`id` (PK)", table_cell_style), Paragraph("Stores live homepage carousel banners, headline, subtitle, desktop/mobile image URLs, CTA link, priority sequence, and status.", table_cell_style)],
        [Paragraph("`Coupons`", table_cell_style), Paragraph("`id` (PK)", table_cell_style), Paragraph("Admin promo codes, discount_type (`PERCENT`, `FLAT`), discount_val, min_order_val, expiry, and total_usage_count.", table_cell_style)],
        [Paragraph("`Orders`", table_cell_style), Paragraph("`id` (PK), `customer_id` (FK)", table_cell_style), Paragraph("Master order ledger. Order type (`PERSONAL`, `GIFTING`), subtotal, discount, final_amount, status, payment_mode, payment_status, shipping address fields, and acquisition traffic source.", table_cell_style)],
        [Paragraph("`Order_Items`", table_cell_style), Paragraph("`id` (PK), `order_id` (FK), `cookie_id` (FK)", table_cell_style), Paragraph("Line items per order. Quantity, unit_price, total_price. Auto-decrements `Cookie_Stock` during creation.", table_cell_style)],
        [Paragraph("`Serviceable_Pincodes`", table_cell_style), Paragraph("`id` (PK)", table_cell_style), Paragraph("Mumbai MMR 6-digit delivery pincodes, city_name, delivery_tier (`1-Day Express`), and active boolean status.", table_cell_style)],
        [Paragraph("`Customer_Reviews`", table_cell_style), Paragraph("`id` (PK), `customer_id` (FK)", table_cell_style), Paragraph("Customer feedback ratings (1-5 🍪), review text, admin approval status (`is_approved`), and homepage carousel flag.", table_cell_style)],
        [Paragraph("`Traffic_Analytics`", table_cell_style), Paragraph("`id` (PK), `session_id`", table_cell_style), Paragraph("Logs visitor traffic sessions: source (`GOOGLE_ORGANIC`, `GOOGLE_ADS`, `WHATSAPP_CAMPAIGN`, `INSTAGRAM_BIO`, `DIRECT`), UTM params, device, landing_page, and conversion status.", table_cell_style)]
    ]

    schema_table = Table(tables_data, colWidths=[110, 120, 280])
    schema_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK_COCOA),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(schema_table)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>Standardized 6-Field Address Architecture (For Fast SQL Regional Analytics):</b>", h2_style))
    story.append(Paragraph("To enable 1-click regional grouping and automated shipping courier API payloads, addresses in `Customers` and `Orders` tables are explicitly partitioned into 6 standard fields:", body_style))
    story.append(Paragraph("`address_line_1` | `address_line_2` | `town` (e.g. Bandra, Vashi, Thane) | `city` (Mumbai) | `pincode` (6-digit) | `state` (Maharashtra)", code_style))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: DEDICATED ANALYTICS SUITE ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("4. Dedicated Comprehensive Analytics Suite (`/admin/analysis`)", h1_style))
    story.append(Paragraph("To maintain lightning-fast page loads for customers, all heavy data aggregations, SQL window functions, traffic channel attribution, and plugin performance tracking are isolated inside `/admin/analysis`.", body_style))

    analytics_data = [
        [Paragraph("Module #", table_header_style), Paragraph("Analytics Module Name", table_header_style), Paragraph("Core Technical & Metrics Functionality", table_header_style)],
        [Paragraph("<b>Module #1</b>", table_cell_style), Paragraph("Stock Behavior Analytics<br/>(TOP PRIORITY)", table_cell_style), Paragraph("Single stock depletion velocity Week-to-Week & Month-to-Month baking forecast. Prevents inventory stockouts.", table_cell_style)],
        [Paragraph("<b>Module #2</b>", table_cell_style), Paragraph("Traffic Source & Visitor Attribution<br/>(NEW)", table_cell_style), Paragraph("Detailed breakdown of unique visitors & sessions by acquisition channel: <b>Google Organic</b> (SEO & JSON-LD recipe rich snippets CTR), <b>Google Ads</b>, <b>WhatsApp Campaigns & Direct Links</b>, <b>Instagram/Meta Bio Links & Ads</b>, & Direct URL traffic. Measures bounce rate & channel conversion rates.", table_cell_style)],
        [Paragraph("<b>Module #3</b>", table_cell_style), Paragraph("Ecosystem Plugins Performance<br/>(NEW)", table_cell_style), Paragraph("Performance, conversion ROI, & operational health across all installed plugins: <b>WhatsApp Cart Abandonment</b> (carts recovered, revenue saved ₹), <b>WhatsApp Business API</b> (delivery rate %, msg open rate), <b>Digital Gift Cards</b>, <b>Kisse Loyalty Coins</b>, <b>Hyper-Local Logistics APIs</b> (dispatch speed, transit mins), & <b>Razorpay/PhonePe Payment Gateway</b> (success rate % per payment mode).", table_cell_style)],
        [Paragraph("<b>Module #4</b>", table_cell_style), Paragraph("Customer Demographics", table_cell_style), Paragraph("Mumbai MMR sub-zone sales breakdown (South Mumbai, Western Suburbs, Navi Mumbai, Thane) + Age/Gender demographics.", table_cell_style)],
        [Paragraph("<b>Module #5</b>", table_cell_style), Paragraph("Financial & Revenue", table_cell_style), Paragraph("Gross revenue (₹), AOV (₹), Personal vs Gifting revenue split, and Peak Ordering Hours/Days heatmap.", table_cell_style)],
        [Paragraph("<b>Module #6</b>", table_cell_style), Paragraph("Product Flavor Velocity", table_cell_style), Paragraph("Top 5 Best-Selling Cookie SKUs, slow-moving item alerts, and popular Gifting combo selections.", table_cell_style)],
        [Paragraph("<b>Module #7</b>", table_cell_style), Paragraph("Promo & Campaign ROI", table_cell_style), Paragraph("Promo code redemption counts & WhatsApp marketing campaign ROI conversion tracking.", table_cell_style)],
        [Paragraph("<b>Module #8</b>", table_cell_style), Paragraph("Customer Retention", table_cell_style), Paragraph("Repeat customer rate % and Kahani Coins ('Kisse') balance accumulation vs redemption velocity.", table_cell_style)],
        [Paragraph("<b>Module #9</b>", table_cell_style), Paragraph("Delivery & Logistics", table_cell_style), Paragraph("Average delivery duration (hours), on-time delivery rate %, and top order volume pincodes.", table_cell_style)],
        [Paragraph("<b>Module #10</b>", table_cell_style), Paragraph("Cart & Funnel Analytics", table_cell_style), Paragraph("Cart abandonment rate % and identification of most abandoned cookie SKUs.", table_cell_style)],
        [Paragraph("<b>Module #11</b>", table_cell_style), Paragraph("Customer Satisfaction", table_cell_style), Paragraph("Average store rating (4.9 🍪 out of 5) and customer sentiment text keyword analysis.", table_cell_style)],
        [Paragraph("<b>Module #12</b>", table_cell_style), Paragraph("Seller & Kitchen Ops", table_cell_style), Paragraph("Cookies baked & restocked per Seller ID, order packing velocity, and batch scrap/waste logs.", table_cell_style)]
    ]

    analytics_table = Table(analytics_data, colWidths=[55, 145, 310])
    analytics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CRIMSON_RED),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(analytics_table)

    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Detailed Visitor Channel Attribution Breakdown (Module #2):</b>", h2_style))
    story.append(Paragraph("• <b>Google Organic & Rich Snippets:</b> Tracks sessions originating from Google Search queries. Monitors impression volume and CTR of JSON-LD Schema Recipe cards displaying 🍪 ratings & pricing directly in Google Search results.", bullet_style))
    story.append(Paragraph("• <b>WhatsApp Channel Traffic:</b> Separates visitors arriving from automated WhatsApp order updates, direct customer support links, and broadcast promotional campaigns.", bullet_style))
    story.append(Paragraph("• <b>Social Media Referrals (Instagram / Meta):</b> Tracks visitor volume from Instagram bio links, influencer unboxing links, and paid Meta ad campaigns.", bullet_style))
    story.append(Paragraph("• <b>Direct & Referral Visitors:</b> Tracks loyal returning customers typing the URL directly (`meethikahani.com`) versus external media coverage.", bullet_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Plugin Ecosystem Performance Metrics Breakdown (Module #3):</b>", h2_style))
    story.append(Paragraph("• <b>WhatsApp Cart Abandonment Plugin:</b> Abandoned carts detected, 30-min recovery messages dispatched, link click-through %, orders completed, and total recovered revenue (₹).", bullet_style))
    story.append(Paragraph("• <b>Payment Gateway Plugin (Razorpay / PhonePe):</b> Payment authorization success rate %, failure reasons, UPI QR vs Credit Card vs COD breakdown, modal drop-off rate.", bullet_style))
    story.append(Paragraph("• <b>Hyper-Local Courier Plugin (Porter / Dunzo):</b> Rider assignment speed (mins), average delivery duration, delivery failure rate, courier cost per order.", bullet_style))
    story.append(Paragraph("• <b>Loyalty Program Plugin ('Kisse' Coins):</b> Active coin balances, redemption frequency, average order value increase for coin redeemers.", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 5: OPERATIONAL, LOGISTICS, & SECURITY ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("5. Operations, Logistics, & Security Architecture", h1_style))
    
    story.append(Paragraph("<b>1-Day Metro Express Delivery Logistics Architecture:</b>", h2_style))
    story.append(Paragraph("• Direct delivery model restricted to Mumbai Metropolitan Region (MMR) to guarantee fresh oven-baked quality.", bullet_style))
    story.append(Paragraph("• Instant pincode validation against `Serviceable_Pincodes` DB table during cart item addition and checkout.", bullet_style))
    story.append(Paragraph("• Auto-assignment rider integration via hyper-local courier APIs (Porter / Dunzo / Shiprocket).", bullet_style))

    story.append(Paragraph("<b>Packaging Material Inventory Tracking Logic:</b>", h2_style))
    story.append(Paragraph("The Seller Portal (`/seller`) manages physical packaging assets alongside cookie stock. When a kitchen staff marks an order as <i>'Packed'</i>, the system auto-decrements packaging inventory based on box size:", body_style))
    story.append(Paragraph("`Box of 4 Tin` (-1) | `Wax Seal Stamp` (-1) | `Branded Satin Ribbon` (-1m) | `Thermal Mailer` (-1)", code_style))

    story.append(Paragraph("<b>Authentication & Role-Based Access Control (RBAC):</b>", h2_style))
    story.append(Paragraph("• `SUPER_ADMIN`: Full access to `/admin` (CMS, Banner Editor, Coupons, Invoice Customizer, & `/admin/analysis`).", bullet_style))
    story.append(Paragraph("• `SELLER_KITCHEN`: Access restricted to `/seller` (Order fulfillment queue & packaging stock replenishment).", bullet_style))
    story.append(Paragraph("• Secret URLs (`/admin` and `/seller`) are omitted from sitemaps, robots.txt, and public header navigation.", bullet_style))

    story.append(Paragraph("<b>GST Tax Invoice Customizer (Style B Modern Clean Template):</b>", h2_style))
    story.append(Paragraph("PDF GST Tax Invoices are generated on-the-fly using Style B specification. Downloadable by customers on Checkout Success, Customer Account Order History, and via automated WhatsApp confirmation links.", body_style))

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 6: SERVICE ECOSYSTEM & INTEGRATIONS
    # =========================================================================
    story.append(Paragraph("6. External Integrations & Plugin Ecosystem Architecture", h1_style))

    eco_data = [
        [Paragraph("Integration Category", table_header_style), Paragraph("Target Provider / API", table_header_style), Paragraph("Architectural Workflow & Benefit", table_header_style)],
        [Paragraph("<b>WhatsApp CRM & Alerts</b>", table_cell_style), Paragraph("Interakt / Wati API", table_cell_style), Paragraph("Automated WhatsApp order receipts, live delivery tracking links, and targeted CRM blasts.", table_cell_style)],
        [Paragraph("<b>Cart Drop Recovery</b>", table_cell_style), Paragraph("WhatsApp Abandonment Plugin", table_cell_style), Paragraph("Triggers automated WhatsApp reminder 30 mins after cart drop-off (recovers 15-25% lost sales).", table_cell_style)],
        [Paragraph("<b>Payment Gateway</b>", table_cell_style), Paragraph("Razorpay / PhonePe SDK", table_cell_style), Paragraph("Handles UPI QR code scanning & Card payments with instant webhook status updates to DB.", table_cell_style)],
        [Paragraph("<b>Hyper-Local Logistics</b>", table_cell_style), Paragraph("Porter / Dunzo / Shiprocket", table_cell_style), Paragraph("Dispatches riders for 1-Day Metro Express delivery and returns real-time GPS tracking.", table_cell_style)],
        [Paragraph("<b>Loyalty Program</b>", table_cell_style), Paragraph("Kahani Coins ('Kisse') Module", table_cell_style), Paragraph("Accrues 1 'Kissa' coin per ₹10 spent. Auto-applies discount redemptions in Cart Drawer.", table_cell_style)],
        [Paragraph("<b>SEO & Rich Snippets</b>", table_cell_style), Paragraph("Google Recipe & Product Schema", table_cell_style), Paragraph("Injects JSON-LD rich snippets to display cookie photos, prices, and 🍪 ratings in Google Search.", table_cell_style)]
    ]

    eco_table = Table(eco_data, colWidths=[120, 130, 260])
    eco_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK_COCOA),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(eco_table)

    story.append(Spacer(1, 15))

    # =========================================================================
    # SECTION 7: RISK MITIGATION & SYSTEM CONSTRAINTS
    # =========================================================================
    story.append(Paragraph("7. Risk Mitigation & System Architectural Constraints", h1_style))
    story.append(Paragraph("The architecture incorporates explicit mitigation protocols for operational and technical edge cases:", body_style))

    risk_data = [
        [Paragraph("Identified Risk Area", table_header_style), Paragraph("Potential Impact", table_header_style), Paragraph("Architectural Mitigation Strategy", table_header_style)],
        [Paragraph("<b>Gifting Volume Stock Depletion</b>", table_cell_style), Paragraph("Surges in B2C Gifting Box purchases draining single cookie stock pool.", table_cell_style), Paragraph("System enforces real-time stock availability check in cart drawer and triggers low-stock alerts in Kitchen Seller Portal.", table_cell_style)],
        [Paragraph("<b>Food Safety & Transit Damage</b>", table_cell_style), Paragraph("Strict no-refund food safety policy vs transit damage claims.", table_cell_style), Paragraph("Automated 24-hour Damage Replacement Workflow (fresh replacement dispatched upon photo upload, zero cash refunds).", table_cell_style)],
        [Paragraph("<b>Corporate B2B Complexity Elimination</b>", table_cell_style), Paragraph("Multi-address shipping, 30-day PO cycles, and B2B GST tax overhead.", table_cell_style), Paragraph("Corporate track removed from Phase 1 scope, simplifying platform strictly to D2C Personal & Gifting purchase flows.", table_cell_style)]
    ]

    risk_table = Table(risk_data, colWidths=[120, 130, 260])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CRIMSON_RED),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(risk_table)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=15))

    signoff_data = [
        [Paragraph("<b>Architectural Approval & Sign-Off:</b>", table_cell_style), Paragraph("AG AI Engineering Partner", table_cell_style)],
        [Paragraph("<b>Document Hash & Verification:</b>", table_cell_style), Paragraph("MK-AG-ARCH-V1.1-2026-UPDATED", table_cell_style)],
        [Paragraph("<b>Confidentiality Notice:</b>", table_cell_style), Paragraph("Proprietary System Specification — Meethi Kahani Foods Pvt Ltd", table_cell_style)]
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
    print(f"Successfully generated updated PDF at: {filename}")

if __name__ == "__main__":
    build_pdf(output_pdf_path)
    build_pdf(brainstorm_pdf_path)
