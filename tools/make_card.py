#!/usr/bin/env python3
"""Draw the 1200x630 link-preview card (docs/card.png): title, subtitle and a small layered graph motif."""
import os, random
from PIL import Image, ImageDraw, ImageFont
W, H = 1200, 630
BG, INK, MUTED, ACCENT = (250, 250, 247), (26, 32, 44), (95, 104, 117), (37, 99, 160)
NODE = [(37, 99, 160), (46, 125, 90), (125, 82, 170), (192, 108, 40), (178, 54, 68)]
img = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(img)
serif = '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'
sans = '/System/Library/Fonts/Helvetica.ttc'
# motif on the right: layered nodes with edges (a learning map)
random.seed(7)
layers = [3, 5, 6, 5, 3]
x0, x1, y0, y1 = 760, 1130, 110, 520
pts = []
for i, n in enumerate(layers):
    y = y0 + i * (y1 - y0) / (len(layers) - 1)
    row = [(x0 + (j + 0.5) * (x1 - x0) / n + random.uniform(-12, 12), y) for j in range(n)]
    pts.append(row)
for i in range(len(pts) - 1):
    for a in pts[i]:
        for b in random.sample(pts[i + 1], 2):
            d.line([a, b], fill=(205, 210, 218), width=2)
for i, row in enumerate(pts):
    for j, (x, y) in enumerate(row):
        r = 11 if (i + j) % 3 else 15
        d.ellipse([x - r, y - r, x + r, y + r], fill=NODE[(i + 2 * j) % len(NODE)])
# text on the left
d.text((80, 170), 'Bayesian', font=ImageFont.truetype(serif, 76), fill=INK)
d.text((80, 255), 'Clinical Trials', font=ImageFont.truetype(serif, 76), fill=INK)
d.rectangle([80, 365, 160, 371], fill=ACCENT)
f2 = ImageFont.truetype(sans, 34)
d.text((80, 400), 'Encyclopedia, labs and the book', font=f2, fill=MUTED)
d.text((80, 448), 'Search, learn step by step, ask the book', font=ImageFont.truetype(sans, 28), fill=MUTED)
d.text((80, 545), 'vsokolov.org/bayesian_trials_lab', font=ImageFont.truetype(sans, 24), fill=ACCENT)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', 'card.png')
img.save(out, optimize=True)
print(out, os.path.getsize(out))
