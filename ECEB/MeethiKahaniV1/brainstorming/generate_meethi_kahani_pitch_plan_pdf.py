import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# PDF Output Paths
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
pdf_output_path = os.path.join(script_dir, "Meethi_Kahani_Pitch_and_Strategy_Plan.pdf")
pdf_public_path = os.path.join(project_dir, "PDFs", "Meethi_Kahani_Pitch_and_Strategy_Plan.pdf")

# Brand Colors (Extracted from Meethi Kahani Logo)
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
            return  # Cover page without header/footer

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(CRIMSON_RED)
        
        # Header text & rule
        self.drawString(40, 755, "MEETHI KAHANI — BUSINESS, PRODUCT & STRATEGY MASTER PLAN")
        self.setStrokeColor(WARM_GOLD)
        self.setLineWidth(0.75)
        self.line(40, 747, 572, 747)

        # Footer rule & text
        self.line(40, 45, 572, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED_GREY)
        self.drawString(40, 32, "Confidential — Meethi Kahani Foods Pvt Ltd — Pure Eggless Artisanal Cookies")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 32, page_str)
        self.restoreState()

def generate_pdf():
    doc = SimpleDocTemplate(
        pdf_output_path,
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
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=13,
        leading=17,
        textColor=WARM_GOLD,
        alignment=1,
        spaceAfter=18
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=CRIMSON_RED,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=DARK_COCOA,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=CHARCOAL,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white,
        alignment=0
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=CHARCOAL
    )

    story = []

    # ==========================================
    # COVER PAGE
    # ==========================================
    story.append(Spacer(1, 30))
    story.append(Paragraph("MEETHI KAHANI", title_style))
    story.append(Paragraph('"Every Cookie Tells A Sweet Story"', subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=CRIMSON_RED, spaceAfter=20))

    story.append(Paragraph("<b>COMPREHENSIVE BUSINESS, PRODUCT & STRATEGY DECK</b>", ParagraphStyle('CoverDocTitle', parent=h1_style, alignment=1, fontSize=18, leading=22)))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Master Specification & Execution Roadmap Across 9 Strategic Pillars", ParagraphStyle('CoverDocSub', parent=body_style, alignment=1, fontSize=10.5, leading=14)))

    story.append(Spacer(1, 30))

    cover_meta = [
        [Paragraph("<b>Brand Identity:</b>", table_cell_style), Paragraph("Meethi Kahani (100% Pure Eggless Artisanal Bakery)", table_cell_style)],
        [Paragraph("<b>Target Region:</b>", table_cell_style), Paragraph("Mumbai Metropolitan Region (MMR) ➔ Tier-1 Metro Express", table_cell_style)],
        [Paragraph("<b>Core Business Focus:</b>", table_cell_style), Paragraph("Direct-To-Consumer (B2C) Gourmet Cookies & Bespoke Gifting", table_cell_style)],
        [Paragraph("<b>Unique Positioning:</b>", table_cell_style), Paragraph("100% Vegetarian Guarantee | Bake-to-Order | Wax-Sealed Gifting", table_cell_style)],
        [Paragraph("<b>Tech Stack:</b>", table_cell_style), Paragraph("React 18 + Single Master Stock Engine + Supabase Realtime", table_cell_style)],
        [Paragraph("<b>Document Version:</b>", table_cell_style), Paragraph("Version 1.0 Final Pitch & Strategy Specification", table_cell_style)],
        [Paragraph("<b>Date:</b>", table_cell_style), Paragraph("September 2026", table_cell_style)]
    ]

    meta_table = Table(cover_meta, colWidths=[160, 350])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LINEN_CREAM),
        ('GRID', (0,0), (-1,-1), 0.5, WARM_GOLD),
        ('PADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)

    story.append(PageBreak())

    # ==========================================
    # 1. PROBLEM & SOLUTION
    # ==========================================
    story.append(Paragraph("1. Problem & Solution", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=8))
    
    story.append(Paragraph("<b>The Problem in Current Market:</b>", h2_style))
    story.append(Paragraph("• <b>Void in 100% Pure Eggless Gourmet Bakery:</b> Over 40–60% of consumers in India adhere to strict vegetarian or eggless dietary rules. Premium international and artisanal cookie brands rely heavily on egg-based binders, leaving vegetarian buyers with dry, preservative-heavy FMCG options.", bullet_style))
    story.append(Paragraph("• <b>Loss of Freshness & Chemical Preservatives:</b> Mass-market packaged cookies sit in warehouses for 3–6 months, reliant on palm oil, artificial flavorings, and chemical stabilizers.", bullet_style))
    story.append(Paragraph("• <b>Impersonal & Transactional Gifting:</b> E-commerce gifting lacks emotional warmth, narrative depth, and high-touch personalization (wax seals, customized cards, sensory aroma).", bullet_style))
    story.append(Paragraph("• <b>Inventory Mismatch & Waste:</b> Multi-channel bakeries suffer from disconnected stock tables across gift sets and single items, causing overselling or inventory spoilage.", bullet_style))

    story.append(Paragraph("<b>The Meethi Kahani Solution:</b>", h2_style))
    story.append(Paragraph("• <b>100% Pure Eggless Gourmet Craftsmanship:</b> Handcrafted cookies baked fresh using 100% pure butter, desi ghee, single-origin dark cocoa, Kashmiri saffron, and premium nuts.", bullet_style))
    story.append(Paragraph("• <b>Bake-to-Order & 1-Day Metro Express:</b> Freshly baked in dark micro-kitchen hubs and delivered within 24 hours in metro zones, eliminating synthetic preservatives.", bullet_style))
    story.append(Paragraph("• <b>'The Kahani' Personalization:</b> Interactive gifting hub featuring custom wax-sealed cards, premium reusable metal tins, and personalized recipient QR video notes.", bullet_style))
    story.append(Paragraph("• <b>Single Master Stock Engine:</b> Unified inventory architecture where all personal, gifting, and corporate orders pull real-time counts from a single stock table.", bullet_style))

    story.append(Spacer(1, 10))

    # ==========================================
    # 2. THE KAHANI AS SPECIALIZATION
    # ==========================================
    story.append(Paragraph("2. The Kahani as Specialization", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=8))
    
    story.append(Paragraph("<b>'The Kahani' (The Story)</b> is the foundational specialization defining the brand identity:", body_style))
    story.append(Paragraph("• <b>Heritage Recipe Narrative:</b> Every cookie SKU carries an authentic story ('The Kahani behind the Cookie') highlighting origin, artisan ingredients, and baker's secret.", bullet_style))
    story.append(Paragraph("• <b>Interactive Catalog Flip Cards:</b> Product cards on the storefront allow buyers to click or hover to flip the card, revealing the heritage narrative and ingredient source.", bullet_style))
    story.append(Paragraph("• <b>Story Scrolls in Every Box:</b> Each delivered tin includes a printed parchment 'Kahani Scroll' connecting the customer to the artisan bakers.", bullet_style))
    story.append(Paragraph("• <b>Customer Community Stories:</b> Customers share their sweet moments online to earn <b>Kisse Coins (🪙)</b> redeemable for future orders.", bullet_style))

    story.append(Spacer(1, 10))

    # ==========================================
    # 3. HOW WE ARE IMPROVING CUSTOMER EXPERIENCE
    # ==========================================
    story.append(Paragraph("3. How We Are Improving Customer Experience", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=8))
    
    story.append(Paragraph("• <b>Strict No-Popups Policy:</b> Zero intrusive promo popups, live social proof notifications, or newsletter overlays. Browsing is serene, clean, and ultra-luxurious.", bullet_style))
    story.append(Paragraph("• <b>Live Freshness Ticker:</b> Real-time hero banner badge — <i>'🔥 18 Boxes left — Freshly baked in the last 3 hours'</i> creating authentic freshness transparency.", bullet_style))
    story.append(Paragraph("• <b>Animated Cookie Crumb Progress Bar:</b> Slide-over cart drawer features a visual crumb trail tracking progress toward free shipping and bonus gifts.", bullet_style))
    story.append(Paragraph("• <b>Real-Time Order Progress Tracker:</b> Account portal displays live animated stages: <code>Placed</code> ➔ <code>👩‍🍳 Baking</code> ➔ <code>🚚 Out for 1-Day Delivery</code> ➔ <code>✅ Delivered</code> using a pulsing 🍪 emoji auto-synced with kitchen staff.", bullet_style))
    story.append(Paragraph("• <b>Instant Pincode Delivery Checker:</b> Real-time 6-digit pincode validator across product pages and cart drawer.", bullet_style))
    story.append(Paragraph("• <b>Warm Out-of-Stock Messaging:</b> Creative out-of-stock badges (<i>'👩‍🍳 Oven Empty! Fresh batch baking...'</i>, <i>'📖 This Kahani is Paused for today'</i>).", bullet_style))

    story.append(PageBreak())

    # ==========================================
    # 4. SMART ORDER & BUSINESS IDEA
    # ==========================================
    story.append(Paragraph("4. Smart Order & Business Idea", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=8))
    
    story.append(Paragraph("<b>Smart Order Architecture:</b>", h2_style))
    story.append(Paragraph("• <b>Single Stock Deduction:</b> Personal purchases (<code>/</code>), custom gifting boxes (<code>/gifting</code>), and corporate bulk orders deduct from the exact same master cookie database table (<code>Cookie_Stock</code>).", body_style))
    story.append(Paragraph("• <b>Build-Your-Own Box Engine:</b> 3D-like box grid allowing customers to drag/select cookie flavors into 4, 8, or 12-slot boxes with real-time stock validation.", body_style))
    story.append(Paragraph("• <b>Automated Packaging Inventory Sync:</b> Backend monitors physical packaging materials (Tin Boxes, Ribbon Rolls, Wax Seals, Mailers). Order assembly auto-decrements packaging stock and triggers supplier alerts.", body_style))

    story.append(Paragraph("<b>Business Idea & Operational Strategy:</b>", h2_style))
    story.append(Paragraph("• <b>Micro-Bakery Cloud Model:</b> Hub-and-spoke dark kitchens in metro cities to minimize delivery transit time and maximize freshness.", body_style))
    story.append(Paragraph("• <b>High Margin, 14-Day Ambient Shelf-Life:</b> High gross margin (70-75%) artisanal cookie focus with 14-day room temperature shelf life.", body_style))

    story.append(Spacer(1, 10))

    # ==========================================
    # 5. TECHNOLOGY & INNOVATION
    # ==========================================
    story.append(Paragraph("5. Technology & Innovation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=8))
    
    story.append(Paragraph("• <b>Core Tech Stack:</b> React 18, Vite, Pure Vanilla CSS3 (Tokenized brand design system: Crimson Red <code>#9A2222</code> & Linen Cream <code>#FAF5EE</code>), React Router DOM.", bullet_style))
    story.append(Paragraph("• <b>Dynamic CMS Portals:</b>", bullet_style))
    story.append(Paragraph("  - <b>Secret Admin Portal (/admin):</b> UserID/Password protected. Hero Banner editor, Coupons manager, 2-Level Product Catalog, GST Style B Invoice generator, COD limit toggles.", bullet_style))
    story.append(Paragraph("  - <b>Bakery Kitchen Portal (/seller):</b> Real-time kitchen dispatch queue and raw material/packaging replenishment tracker.", bullet_style))
    story.append(Paragraph("  - <b>Isolated Heavy Analytics (/admin/analysis):</b> 9 specialized modules (Stock velocity forecasting, Mumbai sub-zone sales heatmap, flavor velocity, campaign ROI, loyalty redemptions, delivery speed, cart abandonment, review sentiment).", bullet_style))
    story.append(Paragraph("• <b>Interactive Wax-Seal Canvas Engine:</b> Real-time preview generator for customized wax seals and handwritten notes.", bullet_style))
    story.append(Paragraph("• <b>Pluggable Payment Gateway Engine:</b> Simulated Razorpay/PhonePe UPI QR and Card checkout service easily toggled to live APIs.", bullet_style))

    story.append(Spacer(1, 10))

    # ==========================================
    # 6. BUSINESS MODEL
    # ==========================================
    story.append(Paragraph("6. Business Model", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=8))
    
    story.append(Paragraph("• <b>Primary Framework:</b> 100% Direct-To-Consumer (B2C) E-Commerce.", body_style))
    story.append(Paragraph("• <b>Launch Region:</b> Mumbai Metropolitan Region (South Mumbai, Western Suburbs, Eastern Suburbs, Navi Mumbai, Thane, Kalyan-Dombivli).", body_style))
    story.append(Paragraph("• <b>3 Core Revenue Channels:</b>", body_style))
    story.append(Paragraph("  1. <b>Personal Track (<code>/</code>):</b> Daily indulgence, impulse craving, personal gift boxes.", bullet_style))
    story.append(Paragraph("  2. <b>Gifting Track (<code>/gifting</code>):</b> Festive occasions (Diwali, Rakhi, Christmas), birthdays, custom wax-sealed gift tins.", bullet_style))
    story.append(Paragraph("  3. <b>Corporate Track (<code>/corporate</code>):</b> B2B bulk client hampers, corporate celebrations, employee onboarding packages.", bullet_style))

    story.append(Spacer(1, 10))

    # ==========================================
    # 7. REVENUE MODEL
    # ==========================================
    story.append(Paragraph("7. Revenue Model", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=8))
    
    story.append(Paragraph("• <b>Direct SKU Sales:</b> Individual cookie box sales (Target AOV: ₹650 – ₹1,200).", bullet_style))
    story.append(Paragraph("• <b>Gifting Tins & Premium Packaging Upgrades:</b> Reusable metal gift tins, custom wax seals, and luxury ribbons (+₹150 – ₹300 per order).", bullet_style))
    story.append(Paragraph("• <b>B2B & Corporate Bulk Contracts:</b> High-volume festive orders with custom logo ribbons (MOQ: 25 boxes).", bullet_style))
    story.append(Paragraph("• <b>Subscription Club (Phase 2):</b> 'Cookie of the Month' recurring delivery subscriptions.", bullet_style))

    story.append(PageBreak())

    # ==========================================
    # 8. SKU & PLUGINS PROPER DESCRIPTION
    # ==========================================
    story.append(Paragraph("8. SKU & Plugins Proper Description", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=8))
    
    story.append(Paragraph("<b>Core Product SKUs (100% Pure Eggless Artisanal Cookies):</b>", h2_style))

    sku_data = [
        [Paragraph("SKU Name", table_header_style), Paragraph("Flavor Profile & Narrative", table_header_style), Paragraph("Key Ingredients", table_header_style), Paragraph("Price (Box 4/8)", table_header_style)],
        [Paragraph("<b>Royal Saffron Pistachio</b>", table_cell_style), Paragraph("Mughlai dessert fusion with rich aromatic saffron infusion.", table_cell_style), Paragraph("Kashmiri Saffron, Green Pistachios, Pure Cow Ghee", table_cell_style), Paragraph("₹349 / ₹649", table_cell_style)],
        [Paragraph("<b>Dark Cocoa Espresso</b>", table_cell_style), Paragraph("Deep 70% dark cocoa paired with South Indian filter coffee.", table_cell_style), Paragraph("70% Dark Cocoa, Filter Coffee Beans, Pure Butter", table_cell_style), Paragraph("₹329 / ₹599", table_cell_style)],
        [Paragraph("<b>Classic Choco-Chip Chunk</b>", table_cell_style), Paragraph("Melt-in-mouth classic filled with heavy Belgian dark chunks.", table_cell_style), Paragraph("Belgian Dark Chocolate Chunks, Vanilla Bean, Butter", table_cell_style), Paragraph("₹299 / ₹549", table_cell_style)],
        [Paragraph("<b>Cardamom Rose Petal</b>", table_cell_style), Paragraph("Fragrant royal confection infused with rose water & spice.", table_cell_style), Paragraph("Green Cardamom, Organic Dried Rose Petals, Almonds", table_cell_style), Paragraph("₹329 / ₹599", table_cell_style)],
        [Paragraph("<b>Nutella Sea Salt Fudge</b>", table_cell_style), Paragraph("Ooey-gooey Nutella core topped with flaky Maldon sea salt.", table_cell_style), Paragraph("Nutella Core, Maldon Sea Salt, Cocoa Crust", table_cell_style), Paragraph("₹369 / ₹699", table_cell_style)]
    ]

    sku_table = Table(sku_data, colWidths=[110, 160, 150, 90])
    sku_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CRIMSON_RED),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(sku_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Ecosystem Plugins Description:</b>", h2_style))
    story.append(Paragraph("1. <b>WhatsApp Business API Plugin (Wati/Interakt):</b> Automated WhatsApp receipts, delivery tracking alerts, and CRM broadcasts.", bullet_style))
    story.append(Paragraph("2. <b>WhatsApp Cart Abandonment Plugin:</b> Auto-triggers friendly reminder 30 mins after cart drop-off (recovers 15–25% lost sales).", bullet_style))
    story.append(Paragraph("3. <b>Digital E-Gift Card Plugin:</b> Instant digital gift voucher purchases delivered via WhatsApp/Email.", bullet_style))
    story.append(Paragraph("4. <b>Hyper-Local Courier Plugin (Porter/Dunzo API):</b> Auto-assigns 2-hour express riders upon kitchen dispatch.", bullet_style))
    story.append(Paragraph("5. <b>Google Rich Snippets SEO Plugin:</b> Embeds Schema.org JSON-LD for star ratings (🍪 rating) & photos in Google search.", bullet_style))
    story.append(Paragraph("6. <b>Kahani Coins ('Kisse') Loyalty Plugin:</b> Customers earn 1 Kissa coin per ₹10 spent, redeemable for discounts & free boxes.", bullet_style))
    story.append(Paragraph("7. <b>Meta Pixel & CAPI Analytics Plugin:</b> Measures server-side conversion attribution and ad ROI.", bullet_style))

    story.append(Spacer(1, 10))

    # ==========================================
    # 9. USP, FUTURE PLAN & META AD STRATEGY
    # ==========================================
    story.append(Paragraph("9. USP, Future Plan & Meta Ad Strategy", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=8))
    
    story.append(Paragraph("<b>Core USPs:</b>", h2_style))
    story.append(Paragraph("1. <b>100% Pure Eggless Guarantee:</b> Tailored for India's vegetarian market without sacrificing gourmet texture.", bullet_style))
    story.append(Paragraph("2. <b>Story-Driven Artisan Branding:</b> Heritage narratives, flip cards, and parchment scrolls in every box.", bullet_style))
    story.append(Paragraph("3. <b>Bake-to-Order 24H Delivery:</b> Freshness guaranteed, zero preservatives or palm oil.", bullet_style))
    story.append(Paragraph("4. <b>Bespoke Wax-Sealed Gifting:</b> Interactive gift card engine and luxury metal tins.", bullet_style))

    story.append(Paragraph("<b>Future Growth Plan:</b>", h2_style))
    story.append(Paragraph("• <b>Year 1:</b> Master Cookie SKUs in Mumbai MMR, reach ₹1.5 Cr ARR.", bullet_style))
    story.append(Paragraph("• <b>Year 1.5:</b> Expand cloud kitchens to Bengaluru, Delhi NCR, and Pune. Launch Kisse Subscription Club.", bullet_style))
    story.append(Paragraph("• <b>Year 2:</b> Category expansion into <b>Handcrafted Fudges</b> and <b>Artisanal Cupcakes</b>.", bullet_style))

    story.append(Paragraph("<b>Meta Ad Strategy (Facebook & Instagram):</b>", h2_style))
    story.append(Paragraph("• <b>Ad Creative Hook:</b> Macro video of breaking open a warm Nutella Sea Salt cookie showing gooey center with text: <i>'100% Pure Eggless. Baked Today. Delivered to your door in Mumbai today. 🍪'</i>", bullet_style))
    story.append(Paragraph("• <b>Target Audiences:</b>", bullet_style))
    story.append(Paragraph("  - <i>Audience A:</i> Foodies & Dessert Cravers (Ages 21–45, Mumbai MMR, Gourmet Baking).", bullet_style))
    story.append(Paragraph("  - <i>Audience B:</i> Pure Vegetarian & Jain Families (Ages 25–55, Festive Gifting).", bullet_style))
    story.append(Paragraph("  - <i>Audience C:</i> Gifting & Occasions (Ages 22–40, Anniversaries, Corporate Gifting).", bullet_style))

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=15))
    story.append(Paragraph("<b>CONFIDENTIAL DOCUMENT -- MEETHI KAHANI FOODS PVT LTD</b>", ParagraphStyle('FooterNotice', parent=body_style, alignment=1, fontSize=8, textColor=colors.gray)))

    doc.build(story, canvasmaker=NumberedCanvas)
    
    # Ensure public PDFs directory exists and copy file
    os.makedirs(os.path.dirname(pdf_public_path), exist_ok=True)
    import shutil
    shutil.copyfile(pdf_output_path, pdf_public_path)

    print(f"PDF successfully generated at:\n1. {pdf_output_path}\n2. {pdf_public_path}")

if __name__ == "__main__":
    generate_pdf()
