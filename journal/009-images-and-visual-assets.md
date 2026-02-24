# 009 — Images and Visual Assets

**Date:** 2026-02-24
**Intent:** Add real product screenshots and images to the Frame.io clone, which previously had zero visual assets beyond SVG icons.

## What happened

### Prompt
User provided a full plan: scrape frame.io for image URLs (Sanity CDN), add them to draft HTML, fix columns CSS, upload to DA.

### What Claude Code did

1. **Scraped frame.io** using Playwright — extracted 30+ image URLs from Sanity CDN (`cdn.sanity.io`), mapping each to its section: hero backgrounds, feature screenshots, carousel images, mobile screenshots.

2. **Downloaded 10 images** to `/images/` directory (all under 600KB):
   - `hero-bg.jpg` (148K) — homepage hero background
   - `hero-screenshot.png` (568K) — product interface screenshot
   - `hero-enterprise-bg.jpg` (140K) — enterprise hero
   - `hero-workflow-bg.jpg` (60K) — workflow page hero
   - `feature-workflow.png` (152K) — workflow feature screenshot
   - `feature-file-mgmt.png` (136K) — file management screenshot
   - `feature-review.png` (380K) — review & approval screenshot
   - `feature-share.png` (192K) — sharing screenshot
   - `enterprise-security.png` (376K) — enterprise security screenshot
   - `enterprise-scale.png` (360K) — enterprise scale screenshot

3. **Hit a wall with AEM image pipeline** — the AEM dev server processes `<picture>` elements through its optimization pipeline. External CDN URLs and local file paths both get converted to `about:error`. The remote DA content also had `about:error` because the original SVG icon paths couldn't be resolved by DA.

4. **Pivoted to JS-based image loading** — modified block JavaScript to load images from the git repo:
   - `blocks/hero/hero.js` — page-specific hero backgrounds and screenshots via a config map
   - `blocks/columns/columns.js` — detects `about:error` images and replaces them using an alt-text-to-path mapping, using `createOptimizedPicture` for proper responsive images

5. **Fixed columns CSS** — removed `max-width: 160px/200px/80%` constraints that were sized for SVG icons. Now `max-width: 100%` at all breakpoints.

6. **Verified** at 600px, 900px (implicit), and 1200px breakpoints. All pages render with images. Lint clean.

### Friction log
- AEM's `<picture>` optimization pipeline rejects anything that isn't a DA-uploaded media asset. This wasn't obvious — took several rounds of debugging (external URLs, local paths, `media_` prefixes) before understanding the constraint.
- DA service token was expired (6+ months old), blocking direct DA API uploads.
- Dev server prefers remote DA content over local drafts when both exist — `--html-folder` is fallback only, not override.
- Solution: commit images to git repo and load them in block JS. Works on both localhost and AEM preview since code sync deploys all static files.

### What it means for the thesis
The AEM image pipeline is a concrete example of where the CMS *adds* friction rather than removing it. A simple task (put an image on a page) requires understanding DA media assets, the optimization pipeline, and the content-vs-code separation. An LLM agent can work around it by shifting image responsibility from content to code — but that subverts the CMS's content model. The question becomes: is that content model worth the friction?
