import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Brand Colors
CRIMSON_RED = colors.HexColor("#9A2222")
LINEN_CREAM = colors.HexColor("#FAF5EE")
DARK_COCOA = colors.HexColor("#3D2314")
WARM_GOLD = colors.HexColor("#D4A359")
CHARCOAL = colors.HexColor("#222222")
MUTED_GREY = colors.HexColor("#666666")
LIGHT_BG = colors.HexColor("#F9F7F5")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, dev_title, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dev_title = dev_title
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
        self.drawString(40, 755, f"MEETHI KAHANI — {self.dev_title.upper()}")
        self.setStrokeColor(WARM_GOLD)
        self.setLineWidth(0.75)
        self.line(40, 747, 572, 747)

        # Footer line & text
        self.line(40, 45, 572, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED_GREY)
        self.drawString(40, 32, "Confidential — Meethi Kahani Foods Pvt Ltd — Focused AI Prompts Manual")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 32, page_str)
        self.restoreState()

def create_dev_pdf(filename, dev_title, dev_role, workspace_paths, features_list, context_vars, prompt1_title, prompt1_text, prompt2_title, prompt2_text):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=55, bottomMargin=55
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CoverTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=26, leading=32,
        textColor=CRIMSON_RED, alignment=1, spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=13, leading=17,
        textColor=WARM_GOLD, alignment=1, spaceAfter=18
    )

    doc_type_style = ParagraphStyle(
        'CoverDocTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=16, leading=20,
        textColor=DARK_COCOA, alignment=1, spaceAfter=6
    )

    h1_style = ParagraphStyle(
        'H1', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=14, leading=18,
        textColor=CRIMSON_RED, spaceBefore=14, spaceAfter=8, keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=11, leading=15,
        textColor=DARK_COCOA, spaceBefore=10, spaceAfter=5, keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9, leading=13,
        textColor=CHARCOAL, spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletCustom', parent=body_style,
        leftIndent=12, firstLineIndent=-8, spaceAfter=3
    )

    cmd_style = ParagraphStyle(
        'CommandBlock', parent=styles['Normal'],
        fontName='Courier', fontSize=7.5, leading=10,
        textColor=DARK_COCOA, backColor=LIGHT_BG,
        borderColor=WARM_GOLD, borderWidth=0.75, borderPadding=7,
        spaceBefore=4, spaceAfter=6
    )

    table_cell_style = ParagraphStyle(
        'TableCell', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8.5, leading=11, textColor=CHARCOAL
    )

    story = []

    # Cover Header
    story.append(Spacer(1, 15))
    story.append(Paragraph("MEETHI KAHANI", title_style))
    story.append(Paragraph('"Every Cookie Tells A Sweet Story"', subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=CRIMSON_RED, spaceAfter=15))

    story.append(Paragraph(f"INDIVIDUAL DEVELOPER SPECIFICATION: {dev_title.upper()}", doc_type_style))
    story.append(Spacer(1, 10))

    meta_data = [
        [Paragraph("<b>Assigned Developer:</b>", table_cell_style), Paragraph(dev_title, table_cell_style)],
        [Paragraph("<b>Assigned Role:</b>", table_cell_style), Paragraph(dev_role, table_cell_style)],
        [Paragraph("<b>Assigned Workspaces:</b>", table_cell_style), Paragraph(workspace_paths, table_cell_style)],
        [Paragraph("<b>Primary Tech Stack:</b>", table_cell_style), Paragraph("React 18 + JavaScript + Vite + Pure Vanilla CSS3", table_cell_style)],
        [Paragraph("<b>AI Prompting Strategy:</b>", table_cell_style), Paragraph("2 Focused Component Prompts (Zero Hallucination Guarantee)", table_cell_style)]
    ]

    meta_table = Table(meta_data, colWidths=[150, 360])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LINEN_CREAM),
        ('GRID', (0,0), (-1,-1), 0.5, WARM_GOLD),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 12))

    # Section 1: Scope & Responsibilities
    story.append(Paragraph("1. Workspace Scope & Assigned Modules", h1_style))
    story.append(Paragraph(f"You are strictly assigned to <b>{workspace_paths}</b>. Do NOT edit files outside your assigned folders.", body_style))
    story.append(Spacer(1, 4))

    for feat in features_list:
        story.append(Paragraph(f"• {feat}", bullet_style))

    story.append(Spacer(1, 8))

    # Section 2: Shared State & Contract Rules
    story.append(Paragraph("2. Shared Data Contract (`StoreContext.jsx`)", h1_style))
    story.append(Paragraph("All modules consume state from `StoreContext.jsx`. Import the hook in your components:", body_style))
    story.append(Paragraph("import { useStore } from '../../context/StoreContext';", ParagraphStyle('ImportCode', parent=cmd_style, fontSize=8.5)))
    story.append(Paragraph(f"<b>Variables available to your module:</b> {context_vars}", body_style))

    story.append(PageBreak())

    # Section 3: Focused AI Prompt #1
    story.append(Paragraph(f"3. Focused AI Prompt #1 — {prompt1_title}", h1_style))
    story.append(Paragraph(f"Copy and paste this prompt when building <b>{prompt1_title}</b> to prevent AI confusion:", body_style))
    story.append(Paragraph(prompt1_text.replace('\n', '<br/>'), cmd_style))

    story.append(Spacer(1, 10))

    # Section 4: Focused AI Prompt #2
    story.append(Paragraph(f"4. Focused AI Prompt #2 — {prompt2_title}", h1_style))
    story.append(Paragraph(f"Copy and paste this prompt when building <b>{prompt2_title}</b>:", body_style))
    story.append(Paragraph(prompt2_text.replace('\n', '<br/>'), cmd_style))

    story.append(Spacer(1, 10))

    story.append(Paragraph("5. Golden Rules for Zero-Error Integration", h1_style))
    story.append(Paragraph("• <b>Rule 1:</b> Execute Prompt #1 first, test locally, then execute Prompt #2.", bullet_style))
    story.append(Paragraph("• <b>Rule 2:</b> Never edit code in another teammate's module directory.", bullet_style))
    story.append(Paragraph("• <b>Rule 3:</b> Keep CSS classes scoped inside your module's CSS file.", bullet_style))

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=10))
    story.append(Paragraph("<b>MEETHI KAHANI FOODS PVT LTD — TEAM MASTER BLUEPRINT</b>", ParagraphStyle('FooterNotice', parent=body_style, alignment=1, fontSize=8, textColor=colors.gray)))

    make_canvas = lambda *args, **kwargs: NumberedCanvas(dev_title, *args, **kwargs)
    doc.build(story, canvasmaker=make_canvas)
    print(f"Successfully generated 2-Prompt PDF: {filename}")

# =========================================================================
# GENERATE 4 DEVELOPER PDFS WITH 2 SEPARATE PROMPTS EACH
# =========================================================================

# DEV 1 PROMPTS
d1_p1_title = "HeaderNav Module (src/modules/HeaderNav/)"
d1_p1_text = """You are an expert React 18 & Vanilla CSS frontend engineer building the HeaderNav Module for Meethi Kahani.

STRICT CONSTRAINTS:
1. ONLY write code inside 'src/modules/HeaderNav/HeaderNav.jsx' and 'HeaderNav.css'.
2. Consume shared state: import { useStore } from '../../context/StoreContext';
3. Access context: cartItemsCount, openCartDrawer, openAccountModal, activeTrack, setActiveTrack.

DESIGN TOKENS (Vanilla CSS):
- Crimson Maroon: #9A2222 | Vanilla Linen: #FAF5EE | Dark Cocoa: #3D2314 | Warm Gold: #D4A359

KEY FEATURES TO BUILD:
- Centered Logo Header layout (Left: Hamburger Icon 🍔; Center: Meethi Kahani Logo; Right: Account 👤 & Cart 🛒 buttons with live counter badge).
- Slide-Out Hamburger Drawer from left (Navigation links for Home, Gifting, Our Story + Category list).

Generate clean, production-ready React code with CSS scoped inside HeaderNav.css."""

d1_p2_title = "HeroBanner Module (src/modules/HeroBanner/)"
d1_p2_text = """You are an expert React 18 & Vanilla CSS frontend engineer building the HeroBanner Module for Meethi Kahani.

STRICT CONSTRAINTS:
1. ONLY write code inside 'src/modules/HeroBanner/HeroBanner.jsx' and 'HeroBanner.css'.
2. Consume shared state: import { useStore } from '../../context/StoreContext';
3. Access context: heroBanners, activeStockCount.

DESIGN TOKENS (Vanilla CSS):
- Crimson Maroon: #9A2222 | Vanilla Linen: #FAF5EE | Dark Cocoa: #3D2314 | Warm Gold: #D4A359

KEY FEATURES TO BUILD:
- Dynamic Hero Carousel Slider rendering active admin banners with smooth transitions.
- Urgency Freshness Ticker Badge ("🔥 [X] Boxes left -- Freshly baked in last 3 hours").

Generate clean, production-ready React code with CSS scoped inside HeroBanner.css."""


# DEV 2 PROMPTS
d2_p1_title = "ProductCatalog & PDP Module (src/modules/ProductCatalog/)"
d2_p1_text = """You are an expert React 18 & Vanilla CSS frontend engineer building ProductCatalog for Meethi Kahani.

STRICT CONSTRAINTS:
1. ONLY write code inside 'src/modules/ProductCatalog/ProductCatalog.jsx', 'ProductCard.jsx', 'ProductDetailsPage.jsx', and 'ProductCatalog.css'.
2. Consume shared state: import { useStore } from '../../context/StoreContext';
3. Access context: cookies, categories, activeCategory, setActiveCategory, addToCart.

DESIGN TOKENS (Vanilla CSS):
- Crimson Maroon: #9A2222 | Vanilla Linen: #FAF5EE | Dark Cocoa: #3D2314 | Warm Gold: #D4A359

KEY FEATURES TO BUILD:
- Category Filter Tabs (Cookies, Gift Sets, Festive Combos).
- Cookie Product Cards displaying price (₹), pieces count, native images, out-of-stock badges, and Quick Add button.
- Dedicated Product Details Page (/product/:slug): Left side 3-4 thumbnail multi-angle photo gallery; Right side Title, Price, Quantity Selector, Add to Cart, Pincode Checker, and "The Kahani Behind This Cookie" story card at the end.

Generate clean, production-ready React code with CSS scoped inside ProductCatalog.css."""

d2_p2_title = "SellerPortal Kitchen Module (src/modules/SellerPortal/)"
d2_p2_text = """You are an expert React 18 & Vanilla CSS frontend engineer building the Bakery Kitchen Seller Portal for Meethi Kahani.

STRICT CONSTRAINTS:
1. ONLY write code inside 'src/modules/SellerPortal/SellerDashboard.jsx', 'KitchenQueue.jsx', 'PackagingManager.jsx', and 'SellerPortal.css'.
2. Consume shared state: import { useStore } from '../../context/StoreContext';
3. Access context: orders, updateOrderStatus, cookies, restockCookie, packagingStock, updatePackagingStock.

DESIGN TOKENS (Vanilla CSS):
- Crimson Maroon: #9A2222 | Vanilla Linen: #FAF5EE | Dark Cocoa: #3D2314 | Warm Gold: #D4A359

KEY FEATURES TO BUILD:
- Secret Bakery Kitchen Portal (/seller) with login credentials protection.
- Live Kitchen Order Fulfillment Queue (Received -> Baking -> Shipped -> Delivered).
- Stock Restock Manager ("+50 Baked" quick increment button).
- Packaging Material Inventory Manager (tracks Box Tins, Wax Seals, Satin Ribbons; auto-decrements stock when orders are marked packed).

Generate clean, production-ready React code with CSS scoped inside SellerPortal.css."""


# DEV 3 PROMPTS
d3_p1_title = "CartPayment & Gateway Module (src/modules/CartPayment/)"
d3_p1_text = """You are an expert React 18 & Vanilla CSS frontend engineer building CartPayment for Meethi Kahani.

STRICT CONSTRAINTS:
1. ONLY write code inside 'src/modules/CartPayment/CartDrawer.jsx', 'PincodeChecker.jsx', 'DummyRazorpayModal.jsx', and 'CartPayment.css'.
2. Consume shared state: import { useStore } from '../../context/StoreContext';
3. Access context: cart, isCartOpen, closeCart, updateCartQty, removeFromCart, placeOrder, serviceablePincodes.

DESIGN TOKENS (Vanilla CSS):
- Crimson Maroon: #9A2222 | Vanilla Linen: #FAF5EE | Dark Cocoa: #3D2314 | Warm Gold: #D4A359

KEY FEATURES TO BUILD:
- Slide-Over Cart Drawer sliding in smoothly from right side.
- Animated Cookie Crumb Progress Bar for free shipping qualification.
- Serviceable Pincode Delivery Checker.
- Pixel-Perfect Dummy Razorpay Gateway Modal (simulated UPI QR scan & Card payment inputs with instant success trigger).

Generate clean, production-ready React code with CSS scoped inside CartPayment.css."""

d3_p2_title = "CustomerPortal & Reviews Module (src/modules/CustomerPortal/)"
d3_p2_text = """You are an expert React 18 & Vanilla CSS frontend engineer building CustomerPortal for Meethi Kahani.

STRICT CONSTRAINTS:
1. ONLY write code inside 'src/modules/CustomerPortal/CustomerAccountModal.jsx', 'ReviewsCarousel.jsx', and 'CustomerPortal.css'.
2. Consume shared state: import { useStore } from '../../context/StoreContext';
3. Access context: customerAccount, activeOrderTracker, reviews, openAccountModal, closeAccountModal.

DESIGN TOKENS (Vanilla CSS):
- Crimson Maroon: #9A2222 | Vanilla Linen: #FAF5EE | Dark Cocoa: #3D2314 | Warm Gold: #D4A359

KEY FEATURES TO BUILD:
- Customer Reviews Sliding Carousel positioned right above footer (displaying 1-5 🍪 Cookie ratings).
- Customer Account Modal (👤) with Live Animated Cookie Crumb Order Status Tracker (Order Placed -> Baking 👩‍🍳 -> Out for Delivery 🚚 -> Delivered ✅).
- Download PDF GST Invoice button & Kahani Coins ("Kisse") balance display.

Generate clean, production-ready React code with CSS scoped inside CustomerPortal.css."""


# DEV 4 PROMPTS
d4_p1_title = "AdminPortal CMS Module (src/modules/AdminPortal/)"
d4_p1_text = """You are an expert React 18 & Vanilla CSS frontend engineer building AdminPortal CMS for Meethi Kahani.

STRICT CONSTRAINTS:
1. ONLY write code inside 'src/modules/AdminPortal/AdminDashboard.jsx', 'BannerManager.jsx', 'CouponsManager.jsx', 'CatalogManager.jsx', 'InvoiceCustomizer.jsx', and 'AdminPortal.css'.
2. Consume shared state: import { useStore } from '../../context/StoreContext';
3. Access context: adminState, heroBanners, updateBanners, coupons, addCoupon, categories, cookies, orders.

DESIGN TOKENS (Vanilla CSS):
- Crimson Maroon: #9A2222 | Vanilla Linen: #FAF5EE | Dark Cocoa: #3D2314 | Warm Gold: #D4A359

KEY FEATURES TO BUILD:
- Secret Super Admin Dashboard (/admin) protected by credentials.
- Hero Banner Carousel Manager (re-order sequence, drag-and-drop, toggle active status).
- Offers & Coupons Manager (add/edit promo codes & BOGO deals).
- 2-Level Nested Category & Product Manager.
- Style B Clean Modern GST Tax Invoice Customizer.

Generate clean, production-ready React code with CSS scoped inside AdminPortal.css."""

d4_p2_title = "Dedicated Analytics Suite Module (src/modules/AdminPortal/)"
d4_p2_text = """You are an expert React 18 & Vanilla CSS frontend engineer building the Analytics Suite for Meethi Kahani.

STRICT CONSTRAINTS:
1. ONLY write code inside 'src/modules/AdminPortal/AnalyticsSuite.jsx' and 'AdminPortal.css'.
2. Consume shared state: import { useStore } from '../../context/StoreContext';
3. Access context: analyticsData, orders, cookies.

DESIGN TOKENS (Vanilla CSS):
- Crimson Maroon: #9A2222 | Vanilla Linen: #FAF5EE | Dark Cocoa: #3D2314 | Warm Gold: #D4A359

KEY FEATURES TO BUILD:
- Secret Route /admin/analysis (Isolated 12-Module Analytics Dashboard).
- Modules: #1 Stock Depletion Velocity, #2 Traffic Channel Attribution (Google Organic Search & JSON-LD Rich Snippets, Google Ads, WhatsApp Campaigns, Instagram Social), #3 Ecosystem Plugins ROI (WhatsApp Cart Recovery, Payment Gateway Success %, Logistics), #4 Demographics (Mumbai MMR sub-zones), #5 Revenue & AOV, #6 Flavor Velocity, #7 Promo ROI, #8 Customer Retention, #9 Delivery Logistics, #10 Cart Funnel, #11 Sentiment Ratings, #12 Seller Productivity.

Generate clean, production-ready React code with CSS scoped inside AdminPortal.css."""

if __name__ == "__main__":
    base_dir = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1"
    
    # Dev 1
    create_dev_pdf(
        os.path.join(base_dir, "Dev1_Header_Hero_Guide.pdf"),
        "Developer 1", "Header Navigation & Hero Showcase Specialist",
        "src/modules/HeaderNav/ & src/modules/HeroBanner/",
        [
            "HeaderNav Module: Centered Logo Header, Hamburger Drawer, Cart/Account triggers.",
            "HeroBanner Module: Dynamic Carousel Slider, Freshness Ticker Badge ('🔥 [X] Boxes left')."
        ],
        "cartItemsCount, openCartDrawer, openAccountModal, heroBanners, activeStockCount, activeTrack, setActiveTrack",
        d1_p1_title, d1_p1_text,
        d1_p2_title, d1_p2_text
    )

    # Dev 2
    create_dev_pdf(
        os.path.join(base_dir, "Dev2_Catalog_Seller_Guide.pdf"),
        "Developer 2", "Product Catalog & Bakery Kitchen Operations Specialist",
        "src/modules/ProductCatalog/ & src/modules/SellerPortal/",
        [
            "ProductCatalog Module: Category Filter Tabs, Cookie Cards, Dedicated PDP (/product/:slug).",
            "SellerPortal Module: Secret Bakery Kitchen (/seller), Live Kitchen Queue, Stock Restock (+50 Baked), Packaging Inventory Tracker."
        ],
        "cookies, categories, activeCategory, setActiveCategory, addToCart, orders, updateOrderStatus, restockCookie, packagingStock, updatePackagingStock",
        d2_p1_title, d2_p1_text,
        d2_p2_title, d2_p2_text
    )

    # Dev 3
    create_dev_pdf(
        os.path.join(base_dir, "Dev3_Cart_Payment_Customer_Guide.pdf"),
        "Developer 3", "Cart, Payments & Customer Portal Specialist",
        "src/modules/CartPayment/ & src/modules/CustomerPortal/",
        [
            "CartPayment Module: Slide-Over Cart Drawer, Cookie Crumb Progress Bar, Pincode Checker, Dummy Razorpay Gateway Modal.",
            "CustomerPortal Module: Reviews Carousel (1-5 🍪), Customer Account Modal (👤), Live Animated Order Tracker, PDF Invoice Download."
        ],
        "cart, isCartOpen, closeCart, updateCartQty, removeFromCart, placeOrder, customerAccount, activeOrderTracker, reviews, serviceablePincodes",
        d3_p1_title, d3_p1_text,
        d3_p2_title, d3_p2_text
    )

    # Dev 4
    create_dev_pdf(
        os.path.join(base_dir, "Dev4_Admin_Analytics_Guide.pdf"),
        "Developer 4", "Secret Super Admin & Analytics Suite Specialist",
        "src/modules/AdminPortal/",
        [
            "AdminPortal CMS Module: Secret Super Admin Dashboard (/admin), Banner Editor, Coupons Manager, Catalog Manager, Style B GST Invoice Customizer.",
            "Dedicated Analytics Suite Module: Secret Route /admin/analysis (12-Module Analytics: Stock Depletion, Traffic Attribution, Plugins ROI, Revenue, Demographics)."
        ],
        "adminState, heroBanners, updateBanners, coupons, addCoupon, categories, cookies, orders, analyticsData",
        d4_p1_title, d4_p1_text,
        d4_p2_title, d4_p2_text
    )
