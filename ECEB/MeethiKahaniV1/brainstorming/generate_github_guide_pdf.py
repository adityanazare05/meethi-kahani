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
output_pdf_path = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\Meethi_Kahani_GitHub_Team_Guide.pdf"
brainstorm_pdf_path = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\brainstorming\Meethi_Kahani_GitHub_Team_Guide.pdf"
testing_pdf_path = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1\testing\Meethi_Kahani_GitHub_Team_Guide.pdf"

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
        self.drawString(40, 755, "MEETHI KAHANI — GITHUB & TEAM COLLABORATION BEGINNER GUIDE")
        self.setStrokeColor(WARM_GOLD)
        self.setLineWidth(0.75)
        self.line(40, 747, 572, 747)

        # Footer line & text
        self.line(40, 45, 572, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED_GREY)
        self.drawString(40, 32, "Team Guide — Meethi Kahani Foods Pvt Ltd — Developer Collaboration Handbook")
        
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
        fontSize=26,
        leading=32,
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
    story.append(Spacer(1, 25))
    story.append(Paragraph("MEETHI KAHANI", title_style))
    story.append(Paragraph('"Every Cookie Tells A Sweet Story"', subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=CRIMSON_RED, spaceAfter=20))

    story.append(Paragraph("GITHUB & VS CODE TEAM COLLABORATION GUIDE", doc_type_style))
    story.append(Paragraph("Step-by-Step Beginner Manual for 4-Developer Parallel Vibe Coding", doc_sub_style))
    story.append(Spacer(1, 20))

    cover_meta = [
        [Paragraph("<b>Target Audience:</b>", table_cell_style), Paragraph("Meethi Kahani Frontend & Backend Development Team (4 Members)", table_cell_style)],
        [Paragraph("<b>Prerequisite Level:</b>", table_cell_style), Paragraph("Absolute Beginners (Zero prior Git / GitHub experience required)", table_cell_style)],
        [Paragraph("<b>Primary Tooling:</b>", table_cell_style), Paragraph("GitHub.com + GitHub Desktop App / VS Code Git Extension + Terminal", table_cell_style)],
        [Paragraph("<b>Core Goal:</b>", table_cell_style), Paragraph("Parallel Vibe Coding without code overwrites or merge conflicts", table_cell_style)],
        [Paragraph("<b>Document Version:</b>", table_cell_style), Paragraph("Version 1.0 Team Master Guide", table_cell_style)],
        [Paragraph("<b>Date of Issue:</b>", table_cell_style), Paragraph("August 2026", table_cell_style)]
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
        [Paragraph("<b>WELCOME TEAM!</b><br/>If you have never used GitHub before, do not worry! This guide breaks down GitHub collaboration into simple, non-technical steps. By following our <b>Modular Folder System</b> and <b>5 Daily Git Steps</b>, all 4 of us can write code simultaneously without breaking anyone else's work.", ParagraphStyle('WelcomeTxt', parent=body_style, fontSize=8.5, leading=12))]
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
    # SECTION 1: UNDERSTANDING GITHUB & THE GOLDEN RULE
    # =========================================================================
    story.append(Paragraph("1. What is GitHub & The 4-Developer Golden Rule", h1_style))
    story.append(Paragraph("Think of <b>GitHub</b> as Google Drive for code. Instead of emailing zip files back and forth, GitHub maintains a central copy of the project in the cloud (`main` branch) and allows each developer to work on their own copy (`feature branch`).", body_style))
    
    story.append(Paragraph("<b>The Golden Rule of Modular Work:</b>", h2_style))
    story.append(Paragraph("To guarantee zero code conflicts, every developer works strictly inside their assigned folder under `src/modules/`. <b>Never edit files in another teammate's folder!</b>", body_style))

    modules_assign = [
        [Paragraph("Developer", table_header_style), Paragraph("Assigned Module & Path", table_header_style), Paragraph("Responsibilities & Scope", table_header_style)],
        [Paragraph("<b>Developer 1</b>", table_cell_style), Paragraph("`src/modules/HeaderNav/`<br/>`src/modules/HeroBanner/`", table_cell_style), Paragraph("Header Logo, Hamburger Drawer, Cart & Account triggers, Hero Carousel, Freshness Ticker.", table_cell_style)],
        [Paragraph("<b>Developer 2</b>", table_cell_style), Paragraph("`src/modules/ProductCatalog/`", table_cell_style), Paragraph("Category Filter Tabs, Cookie Cards, PDP Page (`/product/:slug`), 'The Kahani' story modal.", table_cell_style)],
        [Paragraph("<b>Developer 3</b>", table_cell_style), Paragraph("`src/modules/CartPayment/`<br/>`src/modules/CustomerPortal/`", table_cell_style), Paragraph("Slide-Over Cart Drawer, Cookie Crumb Bar, Pincode Checker, Dummy Razorpay Modal, Customer Account & Reviews.", table_cell_style)],
        [Paragraph("<b>Developer 4</b>", table_cell_style), Paragraph("`src/modules/AdminPortal/`<br/>`src/modules/SellerPortal/`", table_cell_style), Paragraph("Super Admin Dashboard (`/admin`), Banner Editor, Coupons, Invoice Generator, Seller Kitchen Queue (`/seller`).", table_cell_style)]
    ]

    assign_table = Table(modules_assign, colWidths=[90, 160, 260])
    assign_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CRIMSON_RED),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(assign_table)

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: INITIAL 1-TIME SETUP FOR TEAM MEMBERS
    # =========================================================================
    story.append(Paragraph("2. Initial 1-Time Setup (First Time Only)", h1_style))
    
    story.append(Paragraph("<b>Step 2.1: Create a Free GitHub Account</b>", h2_style))
    story.append(Paragraph("Go to <b>https://github.com</b> and sign up for a free account. Send your GitHub username to the Team Lead.", body_style))

    story.append(Paragraph("<b>Step 2.2: Install Git & GitHub Desktop (Easiest GUI)</b>", h2_style))
    story.append(Paragraph("• Download Git: <b>https://git-scm.com/downloads</b>", bullet_style))
    story.append(Paragraph("• Download GitHub Desktop App (Recommended for Beginners): <b>https://desktop.github.com</b>", bullet_style))

    story.append(Paragraph("<b>Step 2.3: Clone the Repository to Your Computer</b>", h2_style))
    story.append(Paragraph("Open <b>GitHub Desktop</b> -> Click <i>File -> Clone Repository</i> -> Select <b>MeethiKahaniV1</b> -> Click <b>Clone</b>.", body_style))
    story.append(Paragraph("<i>Or using Terminal:</i>", body_style))
    story.append(Paragraph("git clone https://github.com/YourUsername/MeethiKahaniV1.git", cmd_style))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: THE 5 DAILY MAGIC STEPS FOR CODING
    # =========================================================================
    story.append(Paragraph("3. The 5 Daily Magic Steps for Every Developer", h1_style))
    story.append(Paragraph("Follow these 5 steps every time you sit down to code:", body_style))

    story.append(Paragraph("<b>STEP 1: Start of Day — Pull Latest Code from Main</b>", h2_style))
    story.append(Paragraph("Before writing any code, fetch the latest code updated by your teammates:", body_style))
    story.append(Paragraph("git checkout main\ngit pull origin main", cmd_style))

    story.append(Paragraph("<b>STEP 2: Create Your Own Work Branch</b>", h2_style))
    story.append(Paragraph("Never code on `main`. Create your personal feature branch (e.g. `dev1-header`):", body_style))
    story.append(Paragraph("git checkout -b dev1-header", cmd_style))

    story.append(Paragraph("<b>STEP 3: Write Your Code Inside Your Assigned Folder</b>", h2_style))
    story.append(Paragraph("Open VS Code and write your React components inside your assigned module folder (e.g. `src/modules/HeaderNav/`). Save your files (`Ctrl + S`).", body_style))

    story.append(Paragraph("<b>STEP 4: Save & Commit Your Work Locally</b>", h2_style))
    story.append(Paragraph("Bundle your changes into a commit with a clear message:", body_style))
    story.append(Paragraph("git add .\ngit commit -m \"Added header centered logo and cart icon\"", cmd_style))

    story.append(Paragraph("<b>STEP 5: Push Your Branch to GitHub</b>", h2_style))
    story.append(Paragraph("Upload your branch to GitHub in the cloud:", body_style))
    story.append(Paragraph("git push origin dev1-header", cmd_style))

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 4: HOW TO MERGE CODE ON GITHUB (PULL REQUESTS)
    # =========================================================================
    story.append(Paragraph("4. How to Merge Code (Pull Requests / PR)", h1_style))
    story.append(Paragraph("After you push your branch to GitHub, your code needs to be merged into the main project.", body_style))
    
    pr_steps = [
        [Paragraph("Step #", table_header_style), Paragraph("Action on GitHub.com", table_header_style), Paragraph("What Happens", table_header_style)],
        [Paragraph("<b>Step 1</b>", table_cell_style), Paragraph("Go to GitHub Repository in Web Browser", table_cell_style), Paragraph("You will see a green banner: <i>'dev1-header had recent pushes 1 minute ago'</i>.", table_cell_style)],
        [Paragraph("<b>Step 2</b>", table_cell_style), Paragraph("Click <b>'Compare & Pull Request'</b>", table_cell_style), Paragraph("Opens the Pull Request submission form.", table_cell_style)],
        [Paragraph("<b>Step 3</b>", table_cell_style), Paragraph("Add Title & Click <b>'Create Pull Request'</b>", table_cell_style), Paragraph("Notifies Team Lead that your module is ready for review.", table_cell_style)],
        [Paragraph("<b>Step 4</b>", table_cell_style), Paragraph("Team Lead Clicks <b>'Merge Pull Request'</b>", table_cell_style), Paragraph("Your code is instantly combined into the main project!", table_cell_style)]
    ]

    pr_table = Table(pr_steps, colWidths=[55, 185, 270])
    pr_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK_COCOA),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LINEN_CREAM])
    ]))
    story.append(pr_table)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 5: ZERO-COMMAND GUI METHOD (GITHUB DESKTOP APP)
    # =========================================================================
    story.append(Paragraph("5. Zero-Command GUI Method (GitHub Desktop App)", h1_style))
    story.append(Paragraph("If typing terminal commands feels scary, you can do EVERYTHING using 3 buttons in the <b>GitHub Desktop App</b>:", body_style))

    story.append(Paragraph("• <b>Button 1: 'Current Branch' (Top Left)</b> -> Click to create or switch to your branch (`dev1-header`).", bullet_style))
    story.append(Paragraph("• <b>Button 2: 'Commit to dev1-header' (Bottom Left)</b> -> Type a short summary of changes and click Commit.", bullet_style))
    story.append(Paragraph("• <b>Button 3: 'Push Origin' (Top Right)</b> -> Click to send code to GitHub in 1 click!", bullet_style))

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 6: FREQUENTLY ASKED QUESTIONS & EMERGENCY ADVICE
    # =========================================================================
    story.append(Paragraph("6. Troubleshooting & Emergency Rules", h1_style))

    story.append(Paragraph("<b>Q1: What if Git shows a 'Merge Conflict'?</b>", h2_style))
    story.append(Paragraph("Do not panic! Merge conflicts only happen if 2 people edit the exact same line of code in the exact same file. Because everyone works inside their own `src/modules/DevFolder`, conflicts will almost never happen.", body_style))

    story.append(Paragraph("<b>Q2: What if I break my local code?</b>", h2_style))
    story.append(Paragraph("You can discard your unsaved changes and restore clean code anytime:", body_style))
    story.append(Paragraph("git checkout -- .", cmd_style))

    story.append(Paragraph("<b>Q3: How do I get my teammates' newly merged code?</b>", h2_style))
    story.append(Paragraph("Switch to main, pull updates, and merge main into your branch:", body_style))
    story.append(Paragraph("git checkout main\ngit pull origin main\ngit checkout dev1-header\ngit merge main", cmd_style))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=15))

    signoff_data = [
        [Paragraph("<b>Team Lead Approval:</b>", table_cell_style), Paragraph("Meethi Kahani Technical Architecture Team", table_cell_style)],
        [Paragraph("<b>Support Contact:</b>", table_cell_style), Paragraph("Ask AG (AI Partner) anytime for 1-click git commands!", table_cell_style)]
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
    print(f"Successfully generated GitHub Guide PDF at: {filename}")

if __name__ == "__main__":
    build_pdf(output_pdf_path)
    build_pdf(brainstorm_pdf_path)
    build_pdf(testing_pdf_path)
