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
base_dir = r"d:\Pillai-Notes\SEM5\ECEB\MeethiKahaniV1"
output_pdf_path = os.path.join(base_dir, "Plugins_Comprehensive_Guide.pdf")
pdf_folder_path = os.path.join(base_dir, "PDFs", "Plugins_Comprehensive_Guide.pdf")
brainstorm_pdf_path = os.path.join(base_dir, "brainstorming", "Plugins_Comprehensive_Guide.pdf")

# Ensure output directories exist
os.makedirs(os.path.join(base_dir, "PDFs"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "brainstorming"), exist_ok=True)

# Color Palette (Professional Executive & Tech Palette)
PRIMARY_DARK = colors.HexColor("#1E293B")   # Deep Slate/Navy
ACCENT_BLUE = colors.HexColor("#2563EB")    # Royal Blue
ACCENT_TEAL = colors.HexColor("#0D9488")    # Deep Teal
WARM_GOLD = colors.HexColor("#D97706")      # Warm Amber/Gold
DARK_TEXT = colors.HexColor("#0F172A")      # Dark Slate Body
MUTED_GREY = colors.HexColor("#64748B")     # Cool Slate Grey
LIGHT_BG = colors.HexColor("#F8FAFC")       # Soft Light Grey
BOX_BG = colors.HexColor("#EFF6FF")         # Very Soft Blue Tint
BORDER_COLOR = colors.HexColor("#CBD5E1")   # Subtle Border Line

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
        self.saveState()
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(PRIMARY_DARK)
            self.drawString(40, 755, "SOFTWARE ARCHITECTURE GUIDE — UNDERSTANDING PLUGINS & EXTENSIBILITY")
            self.setFont("Helvetica", 8)
            self.setFillColor(MUTED_GREY)
            self.drawRightString(572, 755, "Team Discussion Reference")
            self.setStrokeColor(ACCENT_BLUE)
            self.setLineWidth(0.75)
            self.line(40, 747, 572, 747)

        # Footer (All pages)
        self.setStrokeColor(BORDER_COLOR)
        self.setLineWidth(0.75)
        self.line(40, 45, 572, 45)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED_GREY)
        self.drawString(40, 32, "Meethi Kahani Tech Series — Modular Systems, Plugins & Ecosystem Architecture")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 32, page_str)
        self.restoreState()

def create_plugins_guide_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=55, bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Custom Paragraph Styles
    doc_title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY_DARK,
        alignment=0,
        spaceAfter=4
    )

    doc_subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=ACCENT_BLUE,
        alignment=0,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=PRIMARY_DARK,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=ACCENT_TEAL,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=DARK_TEXT,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=DARK_TEXT,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12.5,
        textColor=PRIMARY_DARK
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=0
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=DARK_TEXT
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=PRIMARY_DARK
    )

    story = []

    # --- DOCUMENT HEADER BANNER ---
    story.append(Paragraph("WHAT ARE PLUGINS? COMPREHENSIVE GUIDE", doc_title_style))
    story.append(Paragraph("Understanding Plugin Architecture, Benefits, Types, Mechanics & Real-World Use Cases", doc_subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_BLUE, spaceBefore=0, spaceAfter=10))

    # --- SECTION 1: WHAT IS A PLUGIN? ---
    story.append(Paragraph("1. What is a Plugin? (Core Concept & Definition)", h1_style))
    story.append(Paragraph(
        "A <b>Plugin</b> (also referred to as an <i>extension</i>, <i>add-on</i>, or <i>module</i>) is a self-contained piece of software that integrates into an existing core application to add specific features, functionality, or capabilities <b>without modifying the core application's source code</b>.",
        body_style
    ))
    
    # Callout Box: Analogy
    analogy_content = [
        Paragraph("<b>Real-World Analogy: The Smartphone & App Store</b>", ParagraphStyle('BTitle', parent=h2_style, textColor=ACCENT_BLUE, spaceBefore=0, spaceAfter=2)),
        Paragraph("Think of an operating system (like iOS or Android) as the <b>Core System</b>. When you install WhatsApp, Google Maps, or Spotify from the App Store, you are adding <b>Plugins</b>. The phone's core OS provides the screen, battery, cellular radio, and security hooks, while each app plugs in to extend what the phone can actually do. If you remove an app, your phone continues working perfectly.", callout_style)
    ]
    analogy_table = Table([[analogy_content]], colWidths=[532])
    analogy_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BOX_BG),
        ('BOX', (0,0), (-1,-1), 1, ACCENT_BLUE),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(analogy_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>Key Characteristics of Plugin Architectures:</b>", h2_style))
    story.append(Paragraph("• <b>Loose Coupling:</b> The core application and plugins are decoupled. The core doesn't know details about the plugin's internal logic.", bullet_style))
    story.append(Paragraph("• <b>Plug-and-Play (Hot Swappable):</b> Plugins can be enabled, disabled, installed, or updated independently without breaking the primary system.", bullet_style))
    story.append(Paragraph("• <b>Standardized Contract / API:</b> Plugins interact with the host system exclusively through a pre-defined set of rules called an Application Programming Interface (API) or Extension Point.", bullet_style))

    story.append(Spacer(1, 6))

    # --- SECTION 2: WHY ARE PLUGINS USED? ---
    story.append(Paragraph("2. Why Are Plugins Used? (Core Benefits for Teams & Platforms)", h1_style))
    story.append(Paragraph(
        "Modern software development heavily favors plugin architectures over monolithic designs. Below are the primary reasons why companies and development teams rely on plugins:",
        body_style
    ))

    benefits_data = [
        [
            Paragraph("Benefit", table_header_style),
            Paragraph("Why It Matters to Developers & Businesses", table_header_style)
        ],
        [
            Paragraph("1. Core Codebase Protection", table_cell_bold),
            Paragraph("Keeps the main codebase small, clean, and stable. Developers can add experimental features without risking main system crashes or regressions.", table_cell_style)
        ],
        [
            Paragraph("2. Infinite Extensibility", table_cell_bold),
            Paragraph("Allows software to adapt to unexpected user needs without triggering massive core refactoring cycles or breaking legacy features.", table_cell_style)
        ],
        [
            Paragraph("3. Performance & Lazy Loading", table_cell_bold),
            Paragraph("Unused plugins don't load into memory. Users only run and load the code they actually need, reducing startup times and resource overhead.", table_cell_style)
        ],
        [
            Paragraph("4. Ecosystem & 3rd-Party Devs", table_cell_bold),
            Paragraph("Empowers open-source contributors and third-party vendors to create extensions (e.g., VS Code Extensions, WordPress Plugins, Chrome Add-ons).", table_cell_style)
        ],
        [
            Paragraph("5. Parallel Team Workflow", table_cell_bold),
            Paragraph("Different engineering teams can develop separate plugins simultaneously without merge conflicts or overlapping codebase ownership.", table_cell_style)
        ]
    ]
    b_table = Table(benefits_data, colWidths=[150, 382])
    b_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(b_table)
    story.append(Spacer(1, 10))

    # Page Break for Page 2
    story.append(PageBreak())

    # --- SECTION 3: HOW PLUGINS WORK UNDER THE HOOD ---
    story.append(Paragraph("3. How Plugins Work Under the Hood (Technical Architecture)", h1_style))
    story.append(Paragraph(
        "To understand plugins, you need to understand how the <b>Host Application</b> communicates with the <b>Plugin Module</b>. This is governed by three fundamental building blocks:",
        body_style
    ))

    # Graphic/Box representation of Mechanics
    mechanics_data = [
        [
            Paragraph("Component", table_header_style),
            Paragraph("Technical Role & Execution Mechanism", table_header_style)
        ],
        [
            Paragraph("<b>A. Host Engine</b><br/>(Core Application)", table_cell_style),
            Paragraph("Manages overall lifecycle (booting, routing, security, storage). It exposes a <i>Plugin Manager / Registry</i> that discovers available plugins upon startup.", table_cell_style)
        ],
        [
            Paragraph("<b>B. Hooks & Events</b><br/>(Lifecycle Callbacks)", table_cell_style),
            Paragraph("The core system fires lifecycle events (e.g. <code>onInit</code>, <code>beforeSave</code>, <code>renderHeader</code>). Plugins register callbacks to execute custom code at these specific triggers.", table_cell_style)
        ],
        [
            Paragraph("<b>C. Extension Points</b><br/>(Target UI/Data Slots)", table_cell_style),
            Paragraph("Designated positions in the user interface or data pipeline where plugins can inject UI elements, transform input data, or modify network responses.", table_cell_style)
        ],
        [
            Paragraph("<b>D. Shared Context / API</b><br/>(Plugin Contract)", table_cell_style),
            Paragraph("The host passes a controlled <code>context</code> object or SDK into the plugin, allowing it to safely access state, database, or notifications without raw host access.", table_cell_style)
        ]
    ]
    m_table = Table(mechanics_data, colWidths=[140, 392])
    m_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT_TEAL),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(m_table)
    story.append(Spacer(1, 10))

    # --- SECTION 4: TYPES OF PLUGINS ACROSS SOFTWARE ECOSYSTEMS ---
    story.append(Paragraph("4. Major Types of Plugins across Software Ecosystems", h1_style))
    story.append(Paragraph(
        "Plugins exist everywhere in software engineering. Here is a breakdown of the main categories you will encounter across web, desktop, and backend development:",
        body_style
    ))

    types_data = [
        [
            Paragraph("Plugin Category", table_header_style),
            Paragraph("Popular Examples", table_header_style),
            Paragraph("What The Plugin Does", table_header_style)
        ],
        [
            Paragraph("<b>Web Build & Bundler Plugins</b>", table_cell_style),
            Paragraph("Vite Plugins, Webpack Plugins, Babel Plugins", table_cell_style),
            Paragraph("Transforms JSX into JS, optimizes images, compiles Tailwind CSS, enables hot module reloading (HMR).", table_cell_style)
        ],
        [
            Paragraph("<b>IDE & Code Editor Plugins</b>", table_cell_style),
            Paragraph("VS Code Extensions, IntelliJ Plugins", table_cell_style),
            Paragraph("Adds syntax highlighting, code auto-formatting (Prettier), Git integrations, and AI coding assistants.", table_cell_style)
        ],
        [
            Paragraph("<b>CMS & E-Commerce Plugins</b>", table_cell_style),
            Paragraph("WordPress Plugins, Shopify Apps", table_cell_style),
            Paragraph("Adds checkout gateways (Razorpay/Stripe), SEO tools (Yoast), custom forms, and inventory tracking.", table_cell_style)
        ],
        [
            Paragraph("<b>Browser Extensions</b>", table_cell_style),
            Paragraph("Chrome Extensions, Firefox Add-ons", table_cell_style),
            Paragraph("Modifies webpage DOM, blocks ads (uBlock), manages passwords (1Password), or debugs React apps.", table_cell_style)
        ],
        [
            Paragraph("<b>Backend & API Middleware</b>", table_cell_style),
            Paragraph("Fastify Plugins, Express Middleware, Spring Starters", table_cell_style),
            Paragraph("Adds authentication, rate limiting, logging, database connection pooling, and CORS security headers.", table_cell_style)
        ],
        [
            Paragraph("<b>Creative & Audio Plugins</b>", table_cell_style),
            Paragraph("VST Audio Plugins, Photoshop Filters", table_cell_style),
            Paragraph("Synthesizes audio instruments, applies digital reverb/effects, and provides automated photo filters.", table_cell_style)
        ],
        [
            Paragraph("<b>AI Agent Plugins</b>", table_cell_style),
            Paragraph("Antigravity Plugins, ChatGPT Plugins", table_cell_style),
            Paragraph("Extends AI capabilities with domain skills, specialized subagents, tool registries, and custom workflows.", table_cell_style)
        ]
    ]
    t_table = Table(types_data, colWidths=[125, 145, 262])
    t_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_table)
    story.append(Spacer(1, 10))

    # Page Break for Page 3
    story.append(PageBreak())

    # --- SECTION 5: REAL-WORLD CODE EXAMPLE (VITE & BACKEND) ---
    story.append(Paragraph("5. Practical Web Development Examples (Vite, React & AI Plugins)", h1_style))
    story.append(Paragraph(
        "To see how plugins look in practice, consider how modern web projects (like Vite/React) configure plugins in code:",
        body_style
    ))

    # Code Box Example
    code_text = [
        Paragraph("<b>Example: Vite Configuration File (<code>vite.config.js</code>)</b>", ParagraphStyle('CodeHeader', parent=h2_style, textColor=ACCENT_BLUE, spaceBefore=0, spaceAfter=2)),
        Paragraph(
            "<font name='Courier' size=7.5 color='#1E293B'>"
            "import { defineConfig } from 'vite';<br/>"
            "import react from '@vitejs/plugin-react'; // &lt;-- PLUGIN IMPORT<br/>"
            "import visualizer from 'rollup-plugin-visualizer'; // &lt;-- PLUGIN IMPORT<br/><br/>"
            "export default defineConfig({<br/>"
            "&nbsp;&nbsp;plugins: [<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;react(), // Plugin 1: Enables Fast Refresh & JSX support<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;visualizer({ open: true }) // Plugin 2: Generates bundle size analysis report<br/>"
            "&nbsp;&nbsp;]<br/>"
            "});"
            "</font>",
            body_style
        )
    ]
    code_table = Table([[code_text]], colWidths=[532])
    code_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(code_table)
    story.append(Spacer(1, 10))

    # --- SECTION 6: COMPARISON MATRIX ---
    story.append(Paragraph("6. Comparison: Plugin vs Library vs Middleware vs Framework", h1_style))
    story.append(Paragraph(
        "Team members often confuse terms like <i>Plugin</i>, <i>Library</i>, and <i>Middleware</i>. This cheat sheet clarifies the differences:",
        body_style
    ))

    comp_data = [
        [
            Paragraph("Concept", table_header_style),
            Paragraph("Who Controls Execution?", table_header_style),
            Paragraph("Coupling Level", table_header_style),
            Paragraph("Primary Purpose", table_header_style)
        ],
        [
            Paragraph("<b>Plugin</b>", table_cell_bold),
            Paragraph("Host System calls Plugin via hooks", table_cell_style),
            Paragraph("Very Loose", table_cell_style),
            Paragraph("Extends host features dynamically without touching host code.", table_cell_style)
        ],
        [
            Paragraph("<b>Library</b>", table_cell_bold),
            Paragraph("Your Code calls Library directly", table_cell_style),
            Paragraph("Moderate", table_cell_style),
            Paragraph("Provides helper utilities (e.g. Axios, Lodash, Moment.js).", table_cell_style)
        ],
        [
            Paragraph("<b>Middleware</b>", table_cell_bold),
            Paragraph("Request pipeline calls Middleware sequentially", table_cell_style),
            Paragraph("Tight to pipeline", table_cell_style),
            Paragraph("Processes HTTP requests/responses (e.g. Auth checks, CORS).", table_cell_style)
        ],
        [
            Paragraph("<b>Framework</b>", table_cell_bold),
            Paragraph("Framework calls your entire app code", table_cell_style),
            Paragraph("High (Inversion)", table_cell_style),
            Paragraph("Provides complete structural blueprint (React, Spring Boot).", table_cell_style)
        ]
    ]
    c_table = Table(comp_data, colWidths=[90, 140, 95, 207])
    c_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT_BLUE),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(c_table)
    story.append(Spacer(1, 10))

    # --- SECTION 7: TEAM TAKEAWAYS & DECISION CHECKLIST ---
    story.append(Paragraph("7. Summary & Team Decision Guide", h1_style))
    
    summary_box_content = [
        Paragraph("<b>Key Takeaways for Your Team Meeting:</b>", ParagraphStyle('SumTitle', parent=h2_style, textColor=PRIMARY_DARK, spaceBefore=0, spaceAfter=4)),
        Paragraph("1. <b>Plugins are about modularity:</b> They let you add features as separate blocks rather than cramming everything into one huge file.", bullet_style),
        Paragraph("2. <b>When to use a plugin approach:</b> Choose plugins when building features that might change often, need to be optional, or could be turned off per client/environment.", bullet_style),
        Paragraph("3. <b>Future proofing:</b> Using established plugin ecosystems (like Vite plugins for frontend, Spring starters for backend) saves hundreds of hours of reinventing the wheel.", bullet_style)
    ]
    sum_table = Table([[summary_box_content]], colWidths=[532])
    sum_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BOX_BG),
        ('BOX', (0,0), (-1,-1), 1, ACCENT_TEAL),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(sum_table)

    # Build document using NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated PDF successfully at: {filename}")

if __name__ == "__main__":
    create_plugins_guide_pdf(output_pdf_path)
    create_plugins_guide_pdf(pdf_folder_path)
    create_plugins_guide_pdf(brainstorm_pdf_path)
