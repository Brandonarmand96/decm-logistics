from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

OUT = r"C:\Users\USER\Documents\GitHub\decm\DECM Nexus Service and Digital Platform Strategy.docx"

NAVY = "0B3D91"
DEEP = "082E6B"
GOLD = "D4A017"
PALE = "F4F1E9"
LINE = "D9D9D9"
MUTED = RGBColor(90, 99, 116)

def set_cell_fill(cell, color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = tcPr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tcPr.append(shd)
    shd.set(qn("w:fill"), color)

def set_cell_border(cell, color=LINE):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = tcPr.first_child_found_in("w:tcBorders")
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tcPr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = borders.find(qn(f"w:{edge}"))
        if el is None:
            el = OxmlElement(f"w:{edge}")
            borders.append(el)
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), "4")
        el.set(qn("w:color"), color)

def shade_table(table):
    for i, row in enumerate(table.rows):
        for cell in row.cells:
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            set_cell_border(cell)
            if i == 0:
                set_cell_fill(cell, DEEP)
                for p in cell.paragraphs:
                    for r in p.runs:
                        r.font.color.rgb = RGBColor(255,255,255)
                        r.font.bold = True
            elif i % 2 == 0:
                set_cell_fill(cell, "F2F5F8")
            for p in cell.paragraphs:
                p.paragraph_format.space_after = Pt(3)
                p.paragraph_format.space_before = Pt(3)
                for r in p.runs:
                    r.font.size = Pt(9)

def add_bullets(doc, items):
    for item in items:
        p = doc.add_paragraph(style="List Bullet")
        p.add_run(item)

doc = Document()
sec = doc.sections[0]
sec.top_margin = Inches(.72)
sec.bottom_margin = Inches(.72)
sec.left_margin = Inches(.78)
sec.right_margin = Inches(.78)

styles = doc.styles
styles["Normal"].font.name = "Aptos"
styles["Normal"].font.size = Pt(10.5)
styles["Normal"].paragraph_format.space_after = Pt(7)
styles["Normal"].paragraph_format.line_spacing = 1.12
for name, size in (("Title", 28), ("Heading 1", 18), ("Heading 2", 13)):
    style = styles[name]
    style.font.name = "Aptos Display"
    style.font.size = Pt(size)
    style.font.bold = True
    style.font.color.rgb = RGBColor(0,0,0)
    style.paragraph_format.space_before = Pt(14 if name != "Title" else 0)
    style.paragraph_format.space_after = Pt(7)

title = doc.add_paragraph(style="Title")
title.add_run("DECM Nexus Service and Digital Platform Strategy")
sub = doc.add_paragraph()
sub.add_run("A practical service model and implementation roadmap for an integrated logistics and procurement control tower").italic = True
sub.runs[0].font.color.rgb = MUTED

p = doc.add_paragraph()
r = p.add_run("Executive recommendation  ")
r.bold = True
p.add_run("DECM Nexus should position itself as a managed logistics and procurement partner that gives customers one accountable operational record from sourcing and quotation through transportation, delivery evidence, and reporting. The first digital product should be an installable progressive web application for internal operations staff and business customers, with native mobile development deferred.")

doc.add_heading("Business opportunity", level=1)
doc.add_paragraph("The current brand describes a broad company offering transportation, freight forwarding, customs clearance, warehousing, procurement, supply chain management, consulting, import and export support, fleet management, distribution, and humanitarian logistics. That breadth creates opportunity, but it also risks making the company appear interchangeable with ordinary transport operators. DECM Nexus can differentiate itself through coordination, visibility, documentation, and decision support.")

doc.add_heading("Recommended market position", level=2)
doc.add_paragraph("DECM Nexus should be presented as a logistics control and procurement partner that manages a customer's job from request to verified completion. The strongest early customer groups are SMEs importing goods or equipment, construction and engineering firms, NGOs, retailers and distributors, hospitals, schools, hotels, and manufacturers.")

doc.add_heading("Differentiated service portfolio", level=1)
services = [
    ("Managed logistics desk", "A monthly service that coordinates transporters, quotations, documentation, delivery monitoring, incidents, and reporting for the client."),
    ("Procurement plus delivery", "Supplier search, quotation comparison, negotiation, inspection, purchase coordination, transport, and a complete procurement report."),
    ("Landed cost planning", "A pre-import estimate covering purchase, freight, insurance, customs-related charges, local transport, and expected delivery time. Regulated clearance work should use properly licensed personnel or partners."),
    ("Shipment rescue", "A premium intervention service for delayed, undocumented, misrouted, or urgently required shipments."),
    ("Humanitarian logistics", "Emergency procurement, supplier verification, warehousing, controlled distribution, delivery evidence, and donor-ready reporting."),
    ("Verified partner network", "Screened transporters and suppliers with documented capability, compliance records, and performance history."),
    ("Delivery accountability", "Timestamped checkpoints, photographs, recipient confirmation, digital signatures or delivery PINs, and downloadable completion reports."),
    ("Reverse logistics", "Returns, damaged goods, reusable packaging, repairs, rejected deliveries, and controlled product recalls."),
    ("Supply chain health checks", "A paid review of procurement, inventory, transport spending, supplier risk, and delivery performance."),
]
table = doc.add_table(rows=1, cols=2)
table.autofit = False
table.columns[0].width = Inches(1.75)
table.columns[1].width = Inches(5.1)
table.rows[0].cells[0].text = "Service"
table.rows[0].cells[1].text = "Customer value"
for name, value in services:
    row = table.add_row().cells
    row[0].text = name
    row[1].text = value
shade_table(table)

doc.add_heading("Digital product concept", level=1)
doc.add_paragraph("The proposed product is the DECM Nexus Logistics and Procurement Control Tower. It should be a responsive PWA that can be installed from a browser, works across desktop and mobile browsers, and retains essential application assets for unreliable connectivity. The first release is not a native mobile application.")

doc.add_heading("Phase one operational foundation", level=2)
add_bullets(doc, [
    "Customer service-request intake for transport, procurement, warehousing, freight, and consulting work.",
    "Quotation preparation, review, approval status, and conversion into an operational job.",
    "Job ownership, routes, promised dates, milestones, exceptions, and next actions.",
    "Document records for invoices, packing lists, delivery notes, and shipment evidence.",
    "Proof of delivery through photographs, recipient details, signature or one-time PIN, and completion reports.",
    "Invoice status, customer notifications, and daily operational summaries.",
])

doc.add_heading("Phase two control and profitability", level=2)
add_bullets(doc, [
    "Transporter and supplier onboarding, verification, standing, and performance scores.",
    "Purchase requests, requests for quotation, bid comparisons, approval decisions, purchase orders, and goods-received records.",
    "Direct expenses and expected versus actual profit for each job.",
    "Customer, supplier, service-line, and management reports.",
    "Structured incident handling and an action queue that shows decisions blocking delivery.",
])

doc.add_heading("Application roles", level=1)
roles = [
    ("Operations staff", "Qualify requests, create quotations, assign owners and partners, manage milestones, incidents, documents, expenses, and delivery evidence."),
    ("Business customer", "Submit requests, approve quotations, monitor progress, communicate, and download invoices and completion reports."),
    ("Procurement officer", "Create purchase requests, invite bids, compare suppliers, record approvals, issue orders, and confirm receipt."),
    ("Transport or supplier partner", "Receive assignments, provide status and documents, and maintain verification details. A dedicated portal can follow after the core workflow stabilises."),
    ("Management", "Monitor service performance, exceptions, revenue, cost, margin, supplier performance, and customer outcomes."),
]
table = doc.add_table(rows=1, cols=2)
table.rows[0].cells[0].text = "Role"
table.rows[0].cells[1].text = "Primary responsibility"
for role, responsibility in roles:
    cells = table.add_row().cells
    cells[0].text = role
    cells[1].text = responsibility
shade_table(table)

doc.add_heading("Implementation priorities", level=1)
priorities = [
    ("1", "Workflow prototype", "Validate request, job, procurement, partner, finance, and reporting screens with realistic sample data."),
    ("2", "Production foundation", "Select backend, database, authentication, role permissions, audit logging, file storage, backup, and deployment environment."),
    ("3", "Core transactions", "Implement persisted requests, quotations, jobs, milestones, documents, expenses, invoices, suppliers, and procurement approvals."),
    ("4", "Customer access", "Introduce a separated customer portal, notification preferences, document download, and secure communication."),
    ("5", "Integrations", "Add email or WhatsApp notifications, mapping, accounting exports, GPS feeds, and APIs only after the core records are reliable."),
]
table = doc.add_table(rows=1, cols=3)
for i, text in enumerate(("Order", "Workstream", "Outcome")):
    table.rows[0].cells[i].text = text
for order, workstream, outcome in priorities:
    cells = table.add_row().cells
    cells[0].text, cells[1].text, cells[2].text = order, workstream, outcome
shade_table(table)

doc.add_heading("Important controls before production", level=1)
add_bullets(doc, [
    "Confirm which services require licences, regulated agents, insurance, or formal partner agreements in each operating country.",
    "Define role permissions and approval limits before storing real customer or financial information.",
    "Choose secure document storage, data-retention rules, backups, and an incident-response process.",
    "Separate demonstrative values from real commercial claims, pricing, performance results, and customer references.",
    "Pilot with a small number of staff and customers before opening a public partner marketplace.",
])

doc.add_heading("Immediate next decision", level=1)
doc.add_paragraph("The current prototype should be treated as a workflow demonstrator. Before the next engineering stage, DECM Nexus should confirm the operating country or countries, initial customer segment, staff roles, quotation and approval rules, preferred hosting environment, and the accounting and communication tools that must integrate with the platform.")

footer = sec.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = footer.add_run("DECM Nexus Integrated Logistics and Consulting Ltd  |  Service and Digital Platform Strategy")
run.font.size = Pt(8)
run.font.color.rgb = MUTED

doc.save(OUT)
print(OUT)
