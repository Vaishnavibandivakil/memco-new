"""Create the small downloadable Jutaku project overview used by /brochure."""

from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "brochure" / "jutaku-project-overview.pdf"
W, H = A4
GREEN = HexColor("#006e42")
INK = HexColor("#18231c")
MUTED = HexColor("#69746c")
RULE = HexColor("#dfe5df")


def photo(pdf, path, x, y, width, height, position=(0.5, 0.5)):
    with Image.open(ROOT / "public" / "images" / path) as source:
        image = ImageOps.fit(source.convert("RGB"), (round(width * 2), round(height * 2)), centering=position)
        data = BytesIO()
        image.save(data, format="JPEG", quality=84, optimize=True)
        data.seek(0)
        pdf.drawImage(ImageReader(data), x, y, width, height)


def label(pdf, value, x, y, color=GREEN, size=8):
    pdf.setFillColor(color)
    pdf.setFont("Helvetica-Bold", size)
    pdf.drawString(x, y, value.upper())


def text(pdf, value, x, y, size=11, color=INK, font="Helvetica"):
    pdf.setFillColor(color)
    pdf.setFont(font, size)
    pdf.drawString(x, y, value)


def page_footer(pdf, number):
    pdf.setStrokeColor(RULE)
    pdf.line(42, 43, W - 42, 43)
    label(pdf, "MEMCO Skyline / Jutaku", 42, 26, MUTED, 7)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 7)
    pdf.drawRightString(W - 42, 26, f"{number:02d} / 02")


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
pdf.setTitle("Jutaku | Project overview")
pdf.setAuthor("MEMCO Skyline")

# Page one: the building and the key facts.
photo(pdf, "tower-hero.webp", 0, H - 470, W, 470, (0.5, 0.45))
pdf.setFillColor(Color(0, 0, 0, alpha=0.35))
pdf.rect(0, H - 470, W, 470, fill=1, stroke=0)
label(pdf, "MEMCO Skyline", 42, H - 56, HexColor("#ffffff"), 12)
label(pdf, "Project overview / South Bengaluru", 42, H - 75, HexColor("#ffffff"), 7)
text(pdf, "JUTAKU", 42, H - 395, 55, HexColor("#ffffff"), "Helvetica-Bold")
text(pdf, "Own 500 sq ft. Experience 50,000 sq ft.", 44, H - 421, 14, HexColor("#ffffff"))

label(pdf, "At a glance", 42, 330)
facts = [
    ("646", "private spaces"),
    ("2.78 acres", "project site"),
    ("50,000 sq ft", "shared amenities"),
    ("Begur", "South Bengaluru"),
]
for index, (value, caption) in enumerate(facts):
    col, row = index % 2, index // 2
    x = 42 + col * 265
    y = 277 - row * 76
    text(pdf, value, x, y, 23, INK, "Helvetica-Bold")
    text(pdf, caption, x, y - 18, 10, MUTED)

pdf.setStrokeColor(RULE)
pdf.line(42, 125, W - 42, 125)
text(pdf, "Private homes with shared places to work, play and unwind.", 42, 103, 11, INK)
text(pdf, "Visit the Experience Centre in Singasandra to see the project in person.", 42, 84, 9, MUTED)
page_footer(pdf, 1)
pdf.showPage()

# Page two: everyday life, amenities and access.
label(pdf, "Inside Jutaku", 42, H - 52)
text(pdf, "Space for more of your day.", 42, H - 83, 26, INK, "Helvetica-Bold")
text(pdf, "A private home, with shared spaces a short walk away.", 42, H - 105, 11, MUTED)

photo(pdf, "design-living.webp", 42, H - 355, 316, 226)
photo(pdf, "amenity-pool.jpg", 370, H - 265, 183, 136)
photo(pdf, "amenity-culinary.jpg", 370, H - 355, 183, 78)
label(pdf, "The home", 42, H - 373, GREEN, 7)
text(pdf, "Rooms planned for everyday use.", 42, H - 390, 9)
label(pdf, "Shared spaces", 370, H - 373, GREEN, 7)
text(pdf, "Pool, sport, dining and more.", 370, H - 390, 9)

pdf.setStrokeColor(RULE)
pdf.line(42, 410, W - 42, 410)
label(pdf, "The neighbourhood", 42, 386)
text(pdf, "Singasandra Metro", 42, 357, 13, INK, "Helvetica-Bold")
text(pdf, "0.6 km", 232, 357, 13, GREEN, "Helvetica-Bold")
text(pdf, "Hosa Road Metro", 42, 332, 13, INK, "Helvetica-Bold")
text(pdf, "1.2 km", 232, 332, 13, GREEN, "Helvetica-Bold")
text(pdf, "Electronic City", 42, 307, 13, INK, "Helvetica-Bold")
text(pdf, "3 km", 232, 307, 13, GREEN, "Helvetica-Bold")

label(pdf, "Plan a visit", 42, 256)
text(pdf, "Jutaku Experience Centre", 42, 228, 17, INK, "Helvetica-Bold")
text(pdf, "Manipal County Road, Singasandra, Bengaluru", 42, 210, 10, MUTED)
text(pdf, "+91 91872 24980", 42, 189, 10, GREEN, "Helvetica-Bold")
text(pdf, "info@memcoskyline.com", 42, 174, 10, GREEN, "Helvetica-Bold")

pdf.setStrokeColor(RULE)
pdf.line(42, 142, W - 42, 142)
text(pdf, "RERA: PRM/KA/RERA/1251/310/PR/240426/008602", 42, 125, 8, MUTED)
text(pdf, "This overview is for general information. Images are artistic impressions.", 42, 111, 7, MUTED)
text(pdf, "Confirm current plans, prices and specifications with the MEMCO Skyline team.", 42, 100, 7, MUTED)
page_footer(pdf, 2)
pdf.save()
print(OUTPUT)
