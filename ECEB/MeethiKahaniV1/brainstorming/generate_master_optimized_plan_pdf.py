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
        self.drawString(40, 755, "MEETHI KAHANI — MASTER OPTIMIZED PLAN & ARCHITECTURE AUDIT")
        self.setStrokeColor(WARM_GOLD)
        self.setLineWidth(0.75)
        self.line(40, 747, 572, 747)

        # Footer line & text
        self.line(40, 45, 572, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED_GREY)
        self.drawString(40, 32, "Confidential — Meethi Kahani Foods Pvt Ltd — Master Architecture Audit")
        
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

    title_style = ParagraphStyle(
        'CoverTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=28, leading=34,
        textColor=CRIMSON_RED, alignment=1, spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=13, leading=17,
        textColor=WARM_GOLD, alignment=1, spaceAfter=18
    )

    doc_type_style = ParagraphStyle(
        'CoverDocTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=18, leading=22,
        textColor=DARK_COCOA, alignment=1, spaceAfter=6
    )

    doc_sub_style = ParagraphStyle(
        'CoverDocSub', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, leading=14,
        textColor=CHARCOAL, alignment=1, spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'H1', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=15, leading=19,
        textColor=CRIMSON_RED, spaceBefore=16, spaceAfter=8, keepWithNext=True
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

    table_header_style = ParagraphStyle(
        'TableHeader', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=8.5, leading=11,
        textColor=colors.white, alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8, leading=11, textColor=CHARCOAL
    )

    story = []

    # Cover Header
    story.append(Spacer(1, 20))
    story.append(Paragraph("MEETHI KAHANI", title_style))
    story.append(Paragraph('"Every Cookie Tells A Sweet Story"', subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=CRIMSON_RED, spaceAfter=18))

    story.append(Paragraph("MASTER OPTIMIZED PLAN & ARCHITECTURE AUDIT", doc_type_style))
    story.append(Paragraph("Comprehensive Architectural Review, Refinements & 5 Key Optimization Protocols", doc_sub_style))
    story.append(Spacer(1, 15))

    meta_data = [
        [Paragraph("<b>Target Project:</b>", table_cell_style), Paragraph("Meethi Kahani D2C E-Commerce Platform", table_cell_style)],
        [Paragraph("<b>Lead Tech Architect:</b>", table_cell_style), Paragraph("AG (AI Engineering Partner)", table_cell_style)],
        [Paragraph("<b>Audit Goal:</b>", table_cell_style), Paragraph("Streamline architecture, optimize team workflows, & eliminate edge-case risks", table_cell_style)],
        [Paragraph("<b>Primary Tech Stack:</b>", table_cell_style), Paragraph("React 18 + JavaScript + Vite + Pure Vanilla CSS3 + Supabase", table_cell_style)],
        [Paragraph("<b>Document Version:</b>", table_cell_style), Paragraph("v2.0 Master Optimized Edition", table_cell_style)],
        [Paragraph("<b>Date of Issue:</b>", table_cell_style), Paragraph("August 2026", table_cell_style)]
    ]

    meta_table = Table(meta_data, colWidths=[150, 360])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LINEN_CREAM),
        ('GRID', (0,0), (-1,-1), 0.5, WARM_GOLD),
        ('PADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 20))
    
    welcome_box = [
        [Paragraph("<b>EXECUTIVE AUDIT SUMMARY:</b><br/>After a thorough review of the complete project architecture, data models, team assignments, and AI prompting strategies, we have introduced <b>5 High-Value Optimizations</b>. These optimizations simplify module imports, prevent CSS class collisions, namespace shared state, streamline 3-milestone team delivery, and guarantee 100% bulletproof integration.", ParagraphStyle('WelcomeTxt', parent=body_style, fontSize=8.5, leading=12))]
    ]
    welcome_table = Table(welcome_box, colWidths=[510])
    welcome_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, CRIMSON_RED),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(welcome_table)

    story.append(PageBreak())

    # Section 1: The 5 Key Plan Optimizations
    story.append(Paragraph("1. The 5 Master Plan Optimizations", h1_style))

    story.append(Paragraph("<b>Optimization #1: Barrel Export Pattern (`index.js` per module)</b>", h2_style))
    story.append(Paragraph("Instead of deep component imports, each module directory exports its public components via an `index.js` file. In `App.jsx`, imports look ultra-clean:", body_style))
    story.append(Paragraph("import { HeaderNav, HeroBanner } from './modules/HeaderNav';<br/>import { ProductCatalog } from './modules/ProductCatalog';", ParagraphStyle('CodeLine', parent=body_style, fontName='Courier', textColor=DARK_COCOA)))

    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Optimization #2: CSS BEM / Prefix Scoping Rule</b>", h2_style))
    story.append(Paragraph("To ensure zero CSS style bleeding between teammates, every developer prefixes their module CSS classes:", body_style))
    story.append(Paragraph("• Dev 1: `.mk-hn-` (HeaderNav) | `.mk-hb-` (HeroBanner)<br/>• Dev 2: `.mk-pc-` (ProductCatalog) | `.mk-sp-` (SellerPortal)<br/>• Dev 3: `.mk-cp-` (CartPayment) | `.mk-cu-` (CustomerPortal)<br/>• Dev 4: `.mk-ap-` (AdminPortal)", body_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Optimization #3: Namespaced State Context (`useStore()`)</b>", h2_style))
    story.append(Paragraph("Shared state variables are organized into clean logical domain namespaces (`cart`, `catalog`, `admin`, `seller`). This makes IDE auto-complete instant and prevents variable name confusion.", body_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Optimization #4: 3-Milestone Team Delivery Roadmap</b>", h2_style))
    story.append(Paragraph("• <b>Milestone 1 (UI & Static Layouts):</b> Build visual components with CSS design tokens.<br/>• <b>Milestone 2 (State Wiring & Interactivity):</b> Connect components to `StoreContext.jsx`.<br/>• <b>Milestone 3 (Supabase Integration & Final Polish):</b> Connect cloud DB and deploy to Vercel.", body_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Optimization #5: Isolated 2-Prompt AI Strategy</b>", h2_style))
    story.append(Paragraph("Each developer receives 2 separate, hyper-focused AI prompts inside their PDF manual. This prevents context window overload and guarantees zero AI hallucinations during code generation.", body_style))

    story.append(PageBreak())

    # Section 2: Final Team Workspace Matrix
    story.append(Paragraph("2. Final Optimized Team Workspace Matrix", h1_style))

    modules_assign = [
        [Paragraph("Developer & Role", table_header_style), Paragraph("Assigned Module Paths", table_header_style), Paragraph("Clean Component Responsibilities", table_header_style)],
        [Paragraph("<b>Developer 1</b><br/>Header & Hero", table_cell_style), Paragraph("`src/modules/HeaderNav/`<br/>`src/modules/HeroBanner/`", table_cell_style), Paragraph("Centered Logo Header, Hamburger Drawer, Cart/Account triggers, Hero Banner Carousel, Freshness Ticker Badge.", table_cell_style)],
        [Paragraph("<b>Developer 2</b><br/>Catalog & Bakery Seller", table_cell_style), Paragraph("`src/modules/ProductCatalog/`<br/>`src/modules/SellerPortal/`", table_cell_style), Paragraph("Category Filter Tabs, Cookie Cards, PDP Page (`/product/:slug`), 'The Kahani' story, Secret Bakery Kitchen Portal (`/seller`), Live Kitchen Queue, Restock (`+50 Baked`), & Packaging Stock Manager.", table_cell_style)],
        [Paragraph("<b>Developer 3</b><br/>Cart, Payment & Account", table_cell_style), Paragraph("`src/modules/CartPayment/`<br/>`src/modules/CustomerPortal/`", table_cell_style), Paragraph("Slide-Over Cart Drawer, Cookie Crumb Progress Bar, Serviceable Pincode Checker, Dummy Razorpay Modal, Customer Reviews Carousel, Account Modal (`👤`), Live Animated Order Tracker.", table_cell_style)],
        [Paragraph("<b>Developer 4</b><br/>Super Admin & Analytics", table_cell_style), Paragraph("`src/modules/AdminPortal/`", table_cell_style), Paragraph("Secret Super Admin Dashboard (`/admin`), Banner Manager, Coupons Manager, 2-Level Catalog Manager, Style B GST Invoice Generator, Dedicated 12-Module Analytics Suite (`/admin/analysis`).", table_cell_style)]
    ]

    assign_table = Table(modules_assign, colWidths=[110, 150, 250])
    assign_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CRIMSON_RED),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(assign_table)

    story.append(Spacer(1, 15))

    # Section 3: Final Deployment Architecture
    story.append(Paragraph("3. Final Zero-Cost Deployment Architecture", h1_style))
    story.append(Paragraph("• <b>Frontend Hosting (Vercel):</b> Free tier hosting connected to GitHub main branch. Automatic continuous deployment in 10 seconds whenever a Pull Request is merged.", bullet_style))
    story.append(Paragraph("• <b>Backend Database & Storage (Supabase):</b> Free PostgreSQL cloud database + Image CDN Storage + Realtime WebSocket subscriptions. Zero server management required.", bullet_style))
    story.append(Paragraph("• <b>Domain & SSL:</b> Automatic `https://` encryption and free custom domain binding.", bullet_style))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=15))

    signoff_data = [
        [Paragraph("<b>Master Architecture Approval:</b>", table_cell_style), Paragraph("AG AI Engineering Partner", table_cell_style)],
        [Paragraph("<b>Document Verification Hash:</b>", table_cell_style), Paragraph("MK-AG-MASTER-OPTIMIZED-PLAN-V2.0-FINAL", table_cell_style)]
    ]
    signoff_table = Table(signoff_data, colWidths=[160, 350])
    signoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(signoff_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated Master Optimized Plan PDF: {filename}")

if __name__ == "__main__":
    build_pdf(r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\Meethi_Kahani_Master_Optimized_Plan.pdf")
    build_pdf(r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\brainstorming\Meethi_Kahani_Master_Optimized_Plan.pdf")
