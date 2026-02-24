# 008 — DA content authoring and nav structure fix

**Date:** 2026-02-24
**Phase:** 6 (Content Authoring) + Debugging

## What happened

Pushed all 6 pages to DA (Document Authoring) via the admin API and got them rendering on AEM preview. Then spent significant time debugging a structural mismatch between the nav content format and what `header.js` expected.

### DA content push

Using IMS credentials from `.env` (client_id, client_secret, service_token), exchanged for an access token via `ims-na1.adobelogin.com/ims/token/v3`. Uploaded pages via multipart form PUT to `admin.da.live/source/paolomoz/frameio/{path}.html`.

Key discovery: DA needs content in **authoring format** — full `<html><body><main>` document with blocks as `<table>` elements — not the `.plain.html` rendered format. Created `tools/plain-to-da.py` to automate the conversion.

Pages uploaded: nav, footer, index, pricing, enterprise, features/workflow-management.

### The nav structure bug

After uploading, the header rendered as an unstyled bullet list on AEM preview. Root cause:

- `header.js` assigns classes by child index: `nav.children[0]` = brand, `[1]` = sections, `[2]` = tools
- The fragment loader creates one section per top-level `<div>` in the `.plain.html`
- The local draft `nav.plain.html` had **3 `<div>`s** (3 sections) — correct
- The DA-converted nav had **1 `<div>`** (everything in one section) — broken

The `plain-to-da.py` converter splits by `<hr>` tags to identify sections, but the nav draft uses 3 sibling `<div>`s without `<hr>` separators. The converter wrapped everything in a single section.

**Fix:** Manually created the DA nav HTML with 3 `<div>`s inside `<main>` and re-uploaded. The AEM content pipeline then produced 3 top-level `<div>`s in `.plain.html`, matching what `header.js` expects.

### Other fixes along the way

- **`columns-reverse` 404**: "Columns Reverse" in table header made AEM look for a separate block. Fixed converter to use parentheses: "Columns (reverse)"
- **Header null reference** at `header.js:137`: `brandLink.closest('.button-container')` returned null from DA content. Fixed with optional chaining and fallback selector
- **`fstab.yaml` missing**: AEM didn't know where to source content. Created mountpoint config pointing to `content.da.live/paolomoz/frameio/`

## Verification

All 4 pages verified on AEM preview at desktop (1200px) and mobile (375px):
- Homepage: header, hero, logo wall, features, stats, CTA, footer all rendering
- Pricing: 4-tier pricing table with toggle, header/footer
- Enterprise: hero, logo wall, 3 feature sections, header/footer
- Workflow Management: hero, 3 feature sections, stats, feature grid, CTA, header/footer

Only console error: `net::ERR_UNKNOWN_URL_SCHEME` on `about:error:0` — benign browser internal.

## Reflections

The content format discovery was the hardest part of this entire project. The DA authoring format vs the `.plain.html` rendered format is a non-obvious distinction that requires understanding the full AEM content pipeline:

1. Author writes in DA (table-based HTML)
2. AEM converts tables → semantic divs for the `.plain.html` output
3. Block JS decorates those divs on the client

When pushing content via API, you must provide format (1), not format (3). And for fragments like nav/footer that use multiple sections, the section boundaries in the authoring format directly control the DOM structure that block JS receives.

For the thesis: this is exactly where CMS knowledge matters. An LLM can write perfect block JS/CSS, but understanding content pipeline transformations requires domain expertise that's hard to discover from first principles. The `plain-to-da.py` converter bridges this gap programmatically, but building it required trial-and-error debugging against the live pipeline.
