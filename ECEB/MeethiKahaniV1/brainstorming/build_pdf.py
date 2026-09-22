import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

pdf_filename = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\brainstorming\Meethi_Kahani_Business_Plan.pdf"

# Page template background and headers
CRIMSON_RED = colors.HexColor("#9A2222")
LINEN_CREAM = colors.HexColor("#FAF5EE")
DARK_COCOA = colors.HexColor("#3D2314")
WARM_GOLD = colors.HexColor("#D4A359")
CHARCOAL = colors.HexColor("#222222")

doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    rightMargin=40, leftMargin=40, topMargin=50, bottomMargin=50
)

styles = getSampleStyleSheet()

# Custom Typography Styles
title_style = ParagraphStyle(
    'CoverTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=28,
    leading=34,
    textColor=CRIMSON_RED,
    alignment=1, # Centered
    spaceAfter=10
)

subtitle_style = ParagraphStyle(
    'CoverSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=14,
    leading=18,
    textColor=WARM_GOLD,
    alignment=1,
    spaceAfter=25
)

h1_style = ParagraphStyle(
    'H1',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=CRIMSON_RED,
    spaceBefore=18,
    spaceAfter=8,
    keepWithNext=True
)

h2_style = ParagraphStyle(
    'H2',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=16,
    textColor=DARK_COCOA,
    spaceBefore=12,
    spaceAfter=6,
    keepWithNext=True
)

body_style = ParagraphStyle(
    'BodyTextCustom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=CHARCOAL,
    spaceAfter=6
)

bullet_style = ParagraphStyle(
    'BulletCustom',
    parent=body_style,
    leftIndent=15,
    firstLineIndent=-10,
    spaceAfter=4
)

table_header_style = ParagraphStyle(
    'TableHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=12,
    textColor=colors.white,
    alignment=1
)

table_cell_style = ParagraphStyle(
    'TableCell',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=12,
    textColor=CHARCOAL
)

story = []

# ==========================================
# COVER PAGE
# ==========================================
story.append(Spacer(1, 40))
story.append(Paragraph("MEETHI KAHANI", title_style))
story.append(Paragraph('"Every Cookie Tells A Sweet Story"', subtitle_style))
story.append(HRFlowable(width="100%", thickness=2, color=CRIMSON_RED, spaceAfter=20))

story.append(Paragraph("<b>FULL-FLEDGED BUSINESS PLAN & MASTER SPECIFICATION</b>", ParagraphStyle('CoverDocTitle', parent=h1_style, alignment=1, fontSize=20, leading=24)))
story.append(Spacer(1, 15))
story.append(Paragraph("Comprehensive Technical, Operational, Financial, & Architectural Strategy", ParagraphStyle('CoverDocSub', parent=body_style, alignment=1, fontSize=11, leading=15)))

story.append(Spacer(1, 40))

cover_meta = [
    [Paragraph("<b>Target Market Launch:</b>", table_cell_style), Paragraph("Mumbai Metropolitan Region (MMR) -- 1-Day Metro Express", table_cell_style)],
    [Paragraph("<b>Brand Promise:</b>", table_cell_style), Paragraph("100% Pure Eggless Artisanal Cookies", table_cell_style)],
    [Paragraph("<b>Primary Business Model:</b>", table_cell_style), Paragraph("Direct-To-Consumer (D2C) E-Commerce", table_cell_style)],
    [Paragraph("<b>Lead Tech Architect:</b>", table_cell_style), Paragraph("AG (AI Engineering Partner)", table_cell_style)],
    [Paragraph("<b>Document Version:</b>", table_cell_style), Paragraph("Version 1.0 Final Master Specification", table_cell_style)],
    [Paragraph("<b>Date of Issue:</b>", table_cell_style), Paragraph("August 2026", table_cell_style)]
]

meta_table = Table(cover_meta, colWidths=[180, 330])
meta_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), LINEN_CREAM),
    ('GRID', (0,0), (-1,-1), 0.5, WARM_GOLD),
    ('PADDING', (0,0), (-1,-1), 8),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(meta_table)

story.append(PageBreak())

# ==========================================
# EXECUTIVE SUMMARY
# ==========================================
story.append(Paragraph("1. Executive Summary & Brand Vision", h1_style))
story.append(Paragraph("<b>Meethi Kahani</b> (Mithi Kahani) is a high-end Direct-To-Consumer (D2C) artisanal cookie bakery brand operating in the Mumbai Metropolitan Region (MMR). The brand combines authentic traditional heritage recipes with modern luxury packaging, offering 100% Pure Eggless freshly baked cookies delivered directly to consumers' doorsteps.", body_style))

story.append(Paragraph("<b>Core Strategic Pillars:</b>", h2_style))
story.append(Paragraph("• <b>100% Pure Eggless Guarantee:</b> Essential brand USP catering to India's massive vegetarian market.", bullet_style))
story.append(Paragraph("• <b>2-Year Single Product Focus:</b> 100% focused on Cookies for Years 1-2 (Fudges and Cupcakes deferred to Year 2+ expansion).", bullet_style))
story.append(Paragraph("• <b>Exact Brand Palette:</b> Deep Crimson Red (#9A2222), Soft Vanilla Linen (#FAF5EE), Dark Cocoa (#3D2314).", bullet_style))
story.append(Paragraph("• <b>Strict No-Popups Policy:</b> Zero intrusive popups, ensuring a serene, ultra-luxurious customer experience.", bullet_style))
story.append(Paragraph("• <b>Single Master Stock Architecture:</b> All D2C orders (Personal, Gifting) draw inventory from a single cookie stock pool in the DB.", bullet_style))

story.append(Spacer(1, 10))

# ==========================================
# CUSTOMER TRACKS & PRICING
# ==========================================
story.append(Paragraph("2. Customer Purchasing Tracks & Pricing Strategy", h1_style))

track_data = [
    [Paragraph("Track Name", table_header_style), Paragraph("Target Audience", table_header_style), Paragraph("Core Features & Mechanics", table_header_style)],
    [Paragraph("<b>Personal Track (/)</b>", table_cell_style), Paragraph("Single Buyers & Daily Cravings", table_cell_style), Paragraph("Standard single cookie purchases & box orders from single stock pool.", table_cell_style)],
    [Paragraph("<b>Gifting Track (/gifting)</b>", table_cell_style), Paragraph("Festive, Birthday, & Gift Buyers", table_cell_style), Paragraph("Build-Your-Own Gift Box, custom wax-sealed gift cards, recipient video/voice QR code.", table_cell_style)]
]

track_table = Table(track_data, colWidths=[120, 140, 250])
track_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), CRIMSON_RED),
    ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
    ('PADDING', (0,0), (-1,-1), 6),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
]))
story.append(track_table)

story.append(Spacer(1, 10))
story.append(Paragraph("<b>Pricing & Discount Rule:</b> Personal and Gifting are strictly Order Types (categories of purchase), NOT discount tags. Discounts are exclusively promo codes created by Admin in the Offers Manager.", body_style))

# ==========================================
# TECHNICAL ARCHITECTURE
# ==========================================
story.append(Paragraph("3. Technical Stack & Component Blueprint", h1_style))
story.append(Paragraph("• <b>Frontend Engine:</b> React 18 + JavaScript (ES6+) + Vite + Pure Vanilla CSS3.", bullet_style))
story.append(Paragraph("• <b>Header Design:</b> Ultra-Luxury Centered Logo layout -- Left: Hamburger Icon (🍔); Center: Meethi Kahani Logo; Right: Account Icon (👤) & Cart Icon (🛒).", bullet_style))
story.append(Paragraph("• <b>Cart Architecture:</b> Slide-Over Cart Drawer featuring a live Cookie Crumb Progress Bar for free shipping.", bullet_style))
story.append(Paragraph("• <b>Freshness Ticker:</b> Hero badge displaying <i>'🔥 [X] Boxes left -- Freshly baked in the last 3 hours'</i>.", bullet_style))
story.append(Paragraph("• <b>Dedicated Product Details Page (/product/:slug):</b> Left 3-4 thumbnail photo gallery; Right side: Title, Price, Add to Cart, Pincode Checker, and <i>'The Kahani Behind This Cookie'</i> placed at the very end.", bullet_style))
story.append(Paragraph("• <b>Sliding Review Carousel:</b> Positioned right above the Footer displaying 1-5 🍪 Cookie Icon ratings.", bullet_style))
story.append(Paragraph("• <b>Payment Gateway:</b> Pixel-Perfect Dummy Razorpay Gateway Modal for Phase 1 (Simulated UPI QR scan & Card payments).", bullet_style))

story.append(Spacer(1, 10))

# ==========================================
# SECRET ADMIN & SELLER PORTALS
# ==========================================
story.append(Paragraph("4. Secret Admin & Seller Operational Portals", h1_style))
story.append(Paragraph("<b>1. Super Admin Portal (/admin):</b> Protected by UserID & Password. Features Hero Banner Carousel & Gallery Manager (visual gallery, re-order sequence, native photo uploads), Offers/Coupons Manager, 2-Level Category & Product Catalog Manager, Store Open/Pause Master Switch, Low Stock Threshold Alerts, Staff Roles, Seller Account Creator, Campaign Manager with {Customer_Name} parsing, & Style B Clean Modern GST Tax Invoice Generator.", body_style))

story.append(Paragraph("<b>2. Seller / Bakery Kitchen Portal (/seller):</b> Protected by UserID & Password. Features Live Kitchen Order Queue (Received -> Baking -> Shipped -> Delivered), Stock Replenishment ('+50 Baked'), & Packaging Material Inventory Manager (auto-decrements box tins and wax seals).", body_style))

story.append(Spacer(1, 10))

# ==========================================
# DEDICATED ANALYTICS SUITE
# ==========================================
story.append(Paragraph("5. Dedicated 9-Module Analytics Suite (/admin/analysis)", h1_style))
story.append(Paragraph("To keep the main website ultra-fast, all heavy analytics charts and metrics are isolated on <b>/admin/analysis</b>:", body_style))

analytics_data = [
    [Paragraph("Module #", table_header_style), Paragraph("Module Name", table_header_style), Paragraph("Core Analytics Functionality", table_header_style)],
    [Paragraph("<b>#1</b>", table_cell_style), Paragraph("Stock Behavior Analytics", table_cell_style), Paragraph("Top Priority: Single stock depletion velocity Week-to-Week & Month-to-Month baking forecast.", table_cell_style)],
    [Paragraph("<b>#2</b>", table_cell_style), Paragraph("Customer Demographics", table_cell_style), Paragraph("Mumbai MMR Sub-Zones (South Mumbai, Western Suburbs, Navi Mumbai, Thane, etc.) + Age & Gender breakdown.", table_cell_style)],
    [Paragraph("<b>#3</b>", table_cell_style), Paragraph("Financial & Revenue", table_cell_style), Paragraph("Total revenue (₹), AOV (₹), Personal vs Gifting revenue split, Peak Hours heatmap.", table_cell_style)],
    [Paragraph("<b>#4</b>", table_cell_style), Paragraph("Product Flavor Velocity", table_cell_style), Paragraph("Top 5 Best-Selling Cookie SKUs, slow-moving item alerts, & popular Gifting combos.", table_cell_style)],
    [Paragraph("<b>#5</b>", table_cell_style), Paragraph("Promo & Campaign ROI", table_cell_style), Paragraph("Promo code redemption performance & WhatsApp campaign ROI tracking.", table_cell_style)],
    [Paragraph("<b>#6</b>", table_cell_style), Paragraph("Customer Retention", table_cell_style), Paragraph("Repeat purchase rate % and Kahani Coins ('Kisse') redemption activity.", table_cell_style)],
    [Paragraph("<b>#7</b>", table_cell_style), Paragraph("Delivery & Logistics", table_cell_style), Paragraph("Average delivery speed (hours), on-time delivery rate %, & top delivery pincodes.", table_cell_style)],
    [Paragraph("<b>#8</b>", table_cell_style), Paragraph("Cart & Funnel Analytics", table_cell_style), Paragraph("Cart abandonment rate % and most abandoned cookie SKUs.", table_cell_style)],
    [Paragraph("<b>#9</b>", table_cell_style), Paragraph("Customer Satisfaction", table_cell_style), Paragraph("Average store rating (4.9 🍪 out of 5) & sentiment keyword trends.", table_cell_style)],
    [Paragraph("<b>--</b>", table_cell_style), Paragraph("Seller Performance", table_cell_style), Paragraph("Cookies baked & restocked per Seller ID + Order packing speed per baker.", table_cell_style)]
]

analytics_table = Table(analytics_data, colWidths=[50, 160, 300])
analytics_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_COCOA),
    ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
    ('PADDING', (0,0), (-1,-1), 5),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
]))
story.append(analytics_table)

story.append(Spacer(1, 10))

# ==========================================
# DATABASE SCHEMA & SUMMARY
# ==========================================
story.append(Paragraph("6. Database Architecture & Final Readiness", h1_style))
story.append(Paragraph("The database utilizes 11 core relational tables: <i>Customers, Admin_Sellers, Categories, Cookie_Stock, Packaging_Stock, Hero_Banners, Coupons, Orders, Order_Items, Serviceable_Pincodes, and Customer_Reviews</i>.", body_style))
story.append(Paragraph("Addresses are structured across 6 standardized fields (<i>address_line_1, address_line_2, town, city, pincode, state</i>) for fast SQL regional analytics.", body_style))

story.append(Spacer(1, 15))
story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=15))
story.append(Paragraph("<b>CONFIDENTIAL DOCUMENT -- MEETHI KAHANI FOODS PVT LTD</b>", ParagraphStyle('FooterNotice', parent=body_style, alignment=1, fontSize=8, textColor=colors.gray)))

doc.build(story)

print("PDF Successfully Generated!")
