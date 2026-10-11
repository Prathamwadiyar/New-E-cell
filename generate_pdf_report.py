import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

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
        self.saveState()
        # Top header accent bar (pages 2+)
        if self._pageNumber > 1:
            self.setStrokeColor(colors.HexColor("#082D6B"))
            self.setLineWidth(1)
            self.line(36, 755, 576, 755)
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#082D6B"))
            self.drawString(36, 760, "JCER E-CELL  |  PLATFORM READINESS & PRODUCTION AUDIT REPORT")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(576, 760, "CONFIDENTIAL & PROPRIETARY")

        # Bottom footer
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.8)
        self.line(36, 40, 576, 40)

        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 28, "Jain College of Engineering & Research (JCER) - Entrepreneurship Cell")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 28, page_text)
        self.restoreState()

def create_report(output_filename="JCER_ECell_Platform_Readiness_Report.pdf"):
    # Target exact 2-page compact layout with 36pt margins
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=44,
        bottomMargin=48
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=23,
        textColor=colors.HexColor("#082D6B"),
        spaceAfter=3
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#3086F8"),
        spaceAfter=8
    )

    h1_style = ParagraphStyle(
        'SectionHeading1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=15,
        textColor=colors.HexColor("#082D6B"),
        spaceBefore=8,
        spaceAfter=5
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#334155")
    )

    bullet_style = ParagraphStyle(
        'BulletDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E293B"),
        leftIndent=10,
        firstLineIndent=-8,
        spaceAfter=2
    )

    badge_done = ParagraphStyle(
        'BadgeDone',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor("#047857")
    )

    table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=10.5,
        textColor=colors.white
    )

    story = []

    # ==================== PAGE 1 ====================
    story.append(Paragraph("JCER E-CELL PLATFORM REPORT", title_style))
    story.append(Paragraph("System Architecture, Implemented Features & Production Readiness Audit", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#3086F8"), spaceAfter=8))

    meta_data = [
        [
            Paragraph("<b>Target Entity:</b> JCER Entrepreneurship Cell (Belagavi)", body_style),
            Paragraph("<b>Date:</b> October 2026", body_style),
        ],
        [
            Paragraph("<b>Repository:</b> github.com/Prathamwadiyar/JCER-Ecell-", body_style),
            Paragraph("<b>Audit Status:</b> Frontend Complete | Backend Pending", body_style),
        ]
    ]
    meta_table = Table(meta_data, colWidths=[290, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Executive Summary", h1_style))
    story.append(Paragraph(
        "This audit details the complete architectural status of the <b>Jain College of Engineering & Research (JCER) Entrepreneurship Cell platform</b>. "
        "The application has achieved <b>100% completion in UI/UX engineering, user flows, component libraries, and frontend interactivity</b>. "
        "All four core institutional pillars are active and operational using clean client-side services. "
        "To deploy this as an enterprise multi-user campus network, backend services (central database, cloud authentication, storage, and automated email dispatch) are required.",
        body_style
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Section 1: Fully Implemented & Verified Components", h1_style))
    story.append(Paragraph(
        "The following modules are completely built, styled in the custom dark navy/electric blue design system, tested, and pushed to the repository:",
        body_style
    ))
    story.append(Spacer(1, 5))

    impl_table_data = [
        [
            Paragraph("Module / Feature", table_header),
            Paragraph("Status", table_header),
            Paragraph("Functional Capabilities Implemented & Verified", table_header)
        ],
        [
            Paragraph("<b>Student Achievers Directory</b><br/><code>/directory</code>", body_style),
            Paragraph("COMPLETED", badge_done),
            Paragraph("Complete student registry, department/year filtering, skill chips, SIH/competition verified achievement badges, social profiles, and instant search.", body_style)
        ],
        [
            Paragraph("<b>Student Auth & Profile Editor</b><br/><code>/dashboard/login</code><br/><code>/directory/profile-editor</code>", body_style),
            Paragraph("COMPLETED", badge_done),
            Paragraph("Student registration and login, password hashing, session tokens, full profile editing (skills, bio, achievements timeline, project links).", body_style)
        ],
        [
            Paragraph("<b>Directory Admin Review Portal</b><br/><code>/admin/directory</code>", body_style),
            Paragraph("COMPLETED", badge_done),
            Paragraph("Administrative panel for E-Cell leads to review pending student registrations, approve verified achievement badges, or remove entries.", body_style)
        ],
        [
            Paragraph("<b>Orientation Portal</b><br/><code>/directory/orientation</code>", body_style),
            Paragraph("COMPLETED", badge_done),
            Paragraph("First-year student onboarding launchpad with interactive orientation QR badge modal and quick profile initialization.", body_style)
        ],
        [
            Paragraph("<b>Opportunities Hub</b><br/><code>/opportunities</code>", body_style),
            Paragraph("COMPLETED", badge_done),
            Paragraph("Innovation discovery engine for Hackathons, Internships, Grants, and Ideathons. Category filtering, deadline sorting, and user opportunity submission modal.", body_style)
        ],
        [
            Paragraph("<b>Project Showcase & Collab</b><br/><code>/projects</code>", body_style),
            Paragraph("COMPLETED", badge_done),
            Paragraph("Student innovation portfolio with live demo/GitHub links, tech stack chips, progress tracker (Ideation to Shipped), and collaboration request modal.", body_style)
        ],
        [
            Paragraph("<b>Campus Resource Exchange</b><br/><code>/resources</code>", body_style),
            Paragraph("COMPLETED", badge_done),
            Paragraph("Hardware inventory (IoT kits, Arduinos, ESP32s, sensors). Real-time availability chips, structured borrowing request modal, return tracking, and listing modal.", body_style)
        ],
        [
            Paragraph("<b>Home Page Experience</b><br/><code>/</code>", body_style),
            Paragraph("COMPLETED", badge_done),
            Paragraph("Hero section with 3D orbital animation, interactive fanout diagram connecting students to E-Cell, 'Why Join Us' cursor-proximity cards, and zero layout shift.", body_style)
        ],
        [
            Paragraph("<b>Animated Wave Footer</b>", body_style),
            Paragraph("COMPLETED", badge_done),
            Paragraph("Multi-layered parallax SVG waves in deep navy/midnight blues, full navigation links, verified E-Cell socials, and smooth Back-to-Top trigger.", body_style)
        ]
    ]

    impl_table = Table(impl_table_data, colWidths=[130, 68, 342])
    impl_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#082D6B")),
        ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(impl_table)

    # ==================== PAGE 2 ====================
    story.append(PageBreak())

    story.append(Paragraph("Section 2: Production Readiness Roadmap (What Remains)", h1_style))
    story.append(Paragraph(
        "Currently, all data persistence operations are handled through modular local storage wrappers (<code>src/services/*</code>). "
        "To deploy this as an institutional production web service accessible to hundreds of campus students across devices, the following backend components must be implemented:",
        body_style
    ))
    story.append(Spacer(1, 6))

    crit_badge = ParagraphStyle('Crit', fontName='Helvetica-Bold', fontSize=7.5, textColor=colors.HexColor("#DC2626"))
    high_badge = ParagraphStyle('High', fontName='Helvetica-Bold', fontSize=7.5, textColor=colors.HexColor("#EA580C"))
    med_badge = ParagraphStyle('Med', fontName='Helvetica-Bold', fontSize=7.5, textColor=colors.HexColor("#0284C7"))

    gap_table_data = [
        [
            Paragraph("Domain / Architecture", table_header),
            Paragraph("Current State", table_header),
            Paragraph("Required Production Implementation", table_header),
            Paragraph("Priority", table_header)
        ],
        [
            Paragraph("<b>Central Database</b><br/>(Supabase / PostgreSQL / Firebase)", body_style),
            Paragraph("Browser LocalStorage (Isolated per user device)", body_style),
            Paragraph("Central relational database tables: <code>profiles</code>, <code>opportunities</code>, <code>projects</code>, <code>collaborations</code>, <code>resources</code>, and <code>borrow_requests</code>.", body_style),
            Paragraph("CRITICAL", crit_badge)
        ],
        [
            Paragraph("<b>Central Authentication</b><br/>(Supabase Auth / JWT / OAuth)", body_style),
            Paragraph("Client-side SHA-256 hash in LocalStorage", body_style),
            Paragraph("Server-side token-based auth with college email domain validation (e.g., <code>@jcer.ac.in</code>), password reset emails, and cross-device session persistence.", body_style),
            Paragraph("CRITICAL", crit_badge)
        ],
        [
            Paragraph("<b>Role-Based Access & Security</b><br/>(RLS / Admin Guard)", body_style),
            Paragraph("Client-side flag check in Context API", body_style),
            Paragraph("Database Row-Level Security (RLS) ensuring students can only modify their own submissions, and only verified Admin keys can approve badges or loans.", body_style),
            Paragraph("HIGH", high_badge)
        ],
        [
            Paragraph("<b>Cloud File & Asset Storage</b><br/>(S3 / Supabase Storage / Cloudinary)", body_style),
            Paragraph("Base64 data strings & static image URLs", body_style),
            Paragraph("Cloud bucket storage for profile photos, project screenshots, hardware documentation, and event certificates with automated image compression.", body_style),
            Paragraph("HIGH", high_badge)
        ],
        [
            Paragraph("<b>Email & Notification Dispatch</b><br/>(Resend / Nodemailer / EmailJS)", body_style),
            Paragraph("Stored in LocalStorage without real email trigger", body_style),
            Paragraph("Automated dispatch sending Contact inquiries to <code>ecell.jcer@gmail.com</code>, and notifying project creators when collaboration requests arrive.", body_style),
            Paragraph("HIGH", high_badge)
        ],
        [
            Paragraph("<b>Production Hosting & CI/CD</b><br/>(Vercel / Netlify / Cloudflare)", body_style),
            Paragraph("Local Vite development server", body_style),
            Paragraph("Automated deployment pipeline linked to GitHub repository, custom campus domain (e.g., <code>ecell.jcer.ac.in</code>), and SSL certification.", body_style),
            Paragraph("MEDIUM", med_badge)
        ]
    ]

    gap_table = Table(gap_table_data, colWidths=[108, 108, 260, 64])
    gap_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#082D6B")),
        ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(gap_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Section 3: Recommended Step-by-Step Transition Plan", h1_style))
    story.append(Paragraph("Because the application was engineered with a strict <b>Clean Service Layer pattern</b>, switching to a full backend does not require rewriting any UI components:", body_style))
    story.append(Spacer(1, 5))

    story.append(Paragraph("• <b>Step 1 — Connect Backend SDK:</b> Initialize a free Supabase or Firebase project. Add credentials to <code>.env</code>.", bullet_style))
    story.append(Paragraph("• <b>Step 2 — Swap Service Methods:</b> Replace localStorage functions in <code>src/services/directoryStorage.js</code>, <code>projectsStorage.js</code>, and <code>resourceExchangeStorage.js</code> with simple async SDK queries.", bullet_style))
    story.append(Paragraph("• <b>Step 3 — Activate EmailJS / Resend:</b> Add an API key in <code>ContactForm.jsx</code> so student messages immediately route to <code>ecell.jcer@gmail.com</code>.", bullet_style))
    story.append(Paragraph("• <b>Step 4 — Connect Cloudflare / Vercel:</b> Link the GitHub repo for automated zero-downtime deployments.", bullet_style))
    story.append(Spacer(1, 10))

    signoff_data = [
        [
            Paragraph("<b>Report Prepared By:</b> Antigravity Engineering & Design Team<br/><b>Target System:</b> JCER E-Cell (Jain College of Engineering & Research, Belagavi)", body_style),
            Paragraph("<b>Next Recommended Action:</b> Set up Supabase / Firebase backend schema to unlock multi-user campus access.", body_style)
        ]
    ]
    signoff_table = Table(signoff_data, colWidths=[270, 270])
    signoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#3B82F6")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(signoff_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {output_filename}")

if __name__ == '__main__':
    create_report("d:/E-cell/Jcer-E-cell/JCER_ECell_Platform_Readiness_Report.pdf")
