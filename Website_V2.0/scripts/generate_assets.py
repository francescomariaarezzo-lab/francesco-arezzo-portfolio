"""Optional asset regeneration: python -m pip install reportlab pillow.

The PDF is a newly compiled profile from content.json, not a copy of an
original CV. No external data, font service or network access is required.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import json
import os

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "public" / "assets"
DATA = json.loads((ROOT / "src" / "content.json").read_text())
SITE = DATA["site"]
PAPER = "#fdfdfb"
INK = "#21332e"
MUTED = "#5d6d65"
ACCENT = "#326a59"
LINE = "#dce7df"


def clean(value):
    for char, replacement in {"—": "-", "–": "-", "’": "'", "‘": "'", "“": '"', "”": '"', "→": "to"}.items():
        value = value.replace(char, replacement)
    return value


def text(value):
    return escape(clean(value))


def make_profile():
    body = ParagraphStyle("Body", fontName="Helvetica", fontSize=9, leading=12.5, textColor=colors.HexColor(MUTED), spaceAfter=4)
    title = ParagraphStyle("Name", fontName="Times-Roman", fontSize=28, leading=33, textColor=colors.HexColor(INK), spaceAfter=3)
    subtitle = ParagraphStyle("Subtitle", parent=body, textColor=colors.HexColor(ACCENT), fontSize=10, leading=14, spaceAfter=6)
    heading = ParagraphStyle("Heading", fontName="Helvetica-Bold", fontSize=8.5, leading=12, textColor=colors.HexColor(ACCENT), spaceBefore=12, spaceAfter=7)
    record = ParagraphStyle("Record", parent=body, fontName="Helvetica-Bold", textColor=colors.HexColor(INK), spaceAfter=3)
    small = ParagraphStyle("Small", parent=body, fontSize=8, leading=11, spaceAfter=4)
    doc = SimpleDocTemplate(str(ASSETS / "Francesco_Arezzo_Profile.pdf"), pagesize=A4, rightMargin=43, leftMargin=43, topMargin=35, bottomMargin=35,
                            title="Francesco Arezzo - Academic and Professional Profile", author=SITE["fullName"], subject="Mathematics and Artificial Intelligence")
    story = [Paragraph(text(SITE["fullName"]), title), Paragraph("Mathematics &amp; Artificial Intelligence | Bocconi University", subtitle)]
    contact = f'<link href="mailto:{SITE["email"]}">{SITE["email"]}</link> | Milan, Italy'
    story += [Paragraph(contact, small), Paragraph(f'<link href="{SITE["github"]}">GitHub: francescomariaarezzo-lab</link> &nbsp; | &nbsp; <link href="{SITE["linkedin"]}">LinkedIn: francesco-maria-arezzo</link>', small)]
    story += [Paragraph("EDUCATION", heading)]
    for item in DATA["education"]:
        block = [Paragraph(f'{text(item["institution"])} | {text(item["date"])}', record),
                 Paragraph(" | ".join(text(value) for value in [item["qualification"], item.get("location"), item["status"]] if value), body),
                 Paragraph(text(item["note"]), small)]
        if item["subjects"]:
            block.append(Paragraph("Academic focus: " + text("; ".join(item["subjects"])), small))
        story.append(KeepTogether(block))
        story.append(Spacer(1, 3))
    story.append(Paragraph("EXPERIENCE", heading))
    exp = DATA["experience"]
    story.append(Paragraph(f'{text(exp["organization"])} | {text(exp["role"])} | {text(exp["location"])} | {text(exp["date"])}', record))
    for item in exp["contributions"]:
        story.append(Paragraph(f'<b>{text(item["title"])}.</b> {text(item["description"])}', body))
    story.append(Paragraph("SELECTED ACADEMIC PROJECTS", heading))
    for project in DATA["projects"]:
        block = [Paragraph(text(project["name"]) + " | " + text(project["status"]), record), Paragraph(text(project["description"]), body),
                 Paragraph(text("Methods: " + "; ".join(project["methods"])), small)]
        story.append(KeepTogether(block))
        story.append(Spacer(1, 3))
    story.append(Paragraph("SELECTED RECOGNITION", heading))
    for item in DATA["awards"]:
        story.append(Paragraph(f'<b>{text(item["year"])} | {text(item["title"])}</b>. {text(item["detail"])}', small))
    story.append(Paragraph("TECHNICAL TOOLKIT & LANGUAGES", heading))
    for group in DATA["toolkit"]:
        story.append(Paragraph(f'<b>{text(group["label"])}:</b> {text("; ".join(group["items"]))}', small))
    story.append(Paragraph("Certification: " + text(DATA["education"][0]["certificate"]), small))

    def footer(canvas, document):
        width, height = A4
        canvas.setStrokeColor(colors.HexColor(LINE))
        canvas.line(43, 28, width - 43, 28)
        canvas.setFillColor(colors.HexColor(MUTED))
        canvas.setFont("Helvetica", 7)
        canvas.drawString(43, 16, "Academic and professional profile | " + SITE["edition"])
        canvas.drawRightString(width - 43, 16, str(document.page))

    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def font_file(serif=True):
    family = "LiberationSerif-Regular.ttf" if serif else "LiberationSans-Regular.ttf"
    runtime = os.environ.get("CODEX_PRIMARY_RUNTIME_ROOT", "")
    choices = [
        Path(runtime) / "dependencies/native/libreoffice-headless/libreoffice/share/fonts/truetype" / family,
        Path("/usr/share/fonts/truetype/liberation2") / family,
        Path("/usr/share/fonts/truetype/liberation") / family,
        Path("/Library/Fonts/Georgia.ttf" if serif else "/Library/Fonts/Arial.ttf"),
        Path("C:/Windows/Fonts/georgia.ttf" if serif else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in choices:
        if candidate.is_file():
            return str(candidate)
    return None


def font(size, serif=True):
    file = font_file(serif)
    return ImageFont.truetype(file, size) if file else ImageFont.load_default(size=size)


def make_images():
    scale = 2
    image = Image.new("RGB", (1200 * scale, 630 * scale), PAPER)
    draw = ImageDraw.Draw(image)
    def at(x, y, value, size, color=INK, serif=True):
        draw.text((x * scale, y * scale), value, font=font(size * scale, serif), fill=color)
    draw.line((70 * scale, 70 * scale, 1130 * scale, 70 * scale), fill=LINE, width=scale)
    at(70, 105, "MATHEMATICS  /  COMPUTATION  /  LEARNING", 14, ACCENT, False)
    at(65, 175, "Francesco Arezzo", 100)
    at(72, 323, "Mathematics & artificial intelligence at Bocconi.", 26, ACCENT, False)
    at(72, 382, "AI. Reinforcement learning. Data science.", 19, MUTED, False)
    draw.line((70 * scale, 506 * scale, 1130 * scale, 506 * scale), fill=LINE, width=scale)
    at(72, 541, "francescoarezzo.com", 17, MUTED, False)
    at(865, 541, "SELECTED WORK / 2026", 13, MUTED, False)
    image.resize((1200, 630), Image.Resampling.LANCZOS).save(ASSETS / "social-card.png", optimize=True)
    for size, name in [(32, "favicon-32.png"), (180, "apple-touch-icon.png")]:
        im = Image.new("RGB", (size * 4, size * 4), PAPER)
        pen = ImageDraw.Draw(im)
        pen.text((int(size * .11 * 4), int(size * .07 * 4)), "fa.", font=font(int(size * .84 * 4)), fill=INK)
        im.resize((size, size), Image.Resampling.LANCZOS).save(ASSETS / name, optimize=True)


if __name__ == "__main__":
    ASSETS.mkdir(parents=True, exist_ok=True)
    make_profile()
    make_images()
    print("Created profile PDF, social preview and PNG icons.")
