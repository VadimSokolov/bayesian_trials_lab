#!/usr/bin/env python3
"""One-off: turn the copied nytel.ai/testing pages into the book's companion lab on vsokolov.org."""
import glob, os, re, json
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')
BRAND = 'Bayesian Clinical Trials Lab'
FOOT = ('<div class="nyt">Companion lab to Sokolova, Sokolov and Polson (2026), '
        '<a href="https://vsokolov.org/bayesian_clinical_trials/">Bayesian Clinical Trials</a>. '
        '<a href="encyclopedia/">Encyclopedia</a> &middot; <a href="https://vsokolov.org/labs/">More labs</a> &middot; '
        '<a href="https://github.com/VadimSokolov/bayesian_trials_lab">Source</a></div>')
n = 0
for f in sorted(glob.glob(os.path.join(D, '*.html'))):
    t = open(f, encoding='utf-8').read(); o = t
    t = t.replace('href="../favicon.svg"', 'href="favicon.svg"')
    t = re.sub(r'\s*<link rel="icon" type="image/png" sizes="32x32" href="\.\./favicon-32\.png">', '', t)
    t = t.replace('href="../fonts.css"', 'href="fonts.css"').replace('href="../chrome.css"', 'href="base.css"')
    t = t.replace('<a href="/"><img src="../logo.svg" alt="Nytel"></a>', '<a class="brand" href="./">' + BRAND + '</a>')
    t = t.replace('<span class="crumb"><a href="./">Testing</a></span>', '<span class="crumb"><a href="encyclopedia/">Encyclopedia</a></span>')
    t = t.replace(' | Nytel Testing</title>', ' | ' + BRAND + '</title>').replace(' | Nytel</title>', ' | ' + BRAND + '</title>')
    t = re.sub(r'<div class="nyt">&copy; 2026 Nytel\..*?</div>', FOOT, t)
    t = t.replace("'nytel-testing-'", "'bct-lab-'")
    t = t.replace('10.5281/zenodo.24122876', '10.5281/zenodo.24122875')
    if t != o:
        open(f, 'w', encoding='utf-8').write(t); n += 1
for f, a, b in [('lab.js', "'nytel-testing-'", "'bct-lab-'"),
                ('lab.js', '/* Nytel testing tutorial kit.', '/* Bayesian Clinical Trials Lab kit.'),
                ('lab.css', '/* Nytel testing tutorial: shared page styles. Loads after ../chrome.css (tokens). */', '/* Bayesian Clinical Trials Lab: shared page styles. Loads after base.css (tokens). */'),
                ('sim14.js', '/* Nytel testing tutorial, module 14:', '/* Bayesian Clinical Trials Lab, module 14:'),
                ('base.css', '   Nytel — shared chrome (home page)', '   Shared chrome for the lab: tokens, header, footer, focus ring'),
                ('sim/studio.js', "format: 'nytel-studio'", "format: 'bct-studio'"),
                ('sim/report.js', "'Nytel trial simulator, engine NSim.core '", "'Bayesian Clinical Trials Lab simulator, engine NSim.core '")]:
    p = os.path.join(D, f); t = open(p, encoding='utf-8').read()
    assert a in t, (f, a)
    open(p, 'w', encoding='utf-8').write(t.replace(a, b))
open(os.path.join(D, 'favicon.svg'), 'w').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0A1628"/><text x="16" y="22" font-family="Georgia,serif" font-size="18" fill="#fff" text-anchor="middle">B</text></svg>\n')
print('pages changed', n)
