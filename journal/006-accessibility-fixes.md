# 006 — Accessibility audit and fixes

**Date:** 2026-02-24
**Phase:** 5–7 (Polish, Performance & Validation)

## What happened

Ran a comprehensive WCAG 2.1 AA accessibility audit on the homepage using Playwright's accessibility snapshot and DOM inspection. The audit checked heading hierarchy, image alt text, link accessible text, color contrast, ARIA labels, focus states, and keyboard navigation.

### Issues found and fixed

**HIGH severity (fixed):**

1. **No skip-to-main-content link** — Added a visually hidden skip link as the first focusable element in `scripts.js`. It appears on focus with electric-blue styling.

2. **All `.button` elements lacked visible focus indicators** — Every primary, secondary, and accent button had `outline: 0px` on focus. Added `:focus-visible` style with `2px solid var(--color-electric)` outline to all button variants in `styles.css`.

3. **Social media icon links had no accessible name** — 4 footer links (Instagram, YouTube, Facebook, X/Twitter) contained only an icon `<img>` with empty `alt` and no `aria-label`. Fixed in `footer.js` by deriving the label from the icon class name (e.g., `icon-instagram` → `aria-label="Instagram"`).

**MEDIUM severity (fixed):**

4. **Heading hierarchy skip: H2 → H4 in footer** — Footer column headings were `<h4>` but followed `<h2>` in the main content. Fixed in `footer.js` by converting all `<h4>` to `<h3>` during decoration.

5. **4 ambiguous "Learn more" links** — All had identical text with no way to distinguish them via screen reader. Enhanced `decorateButtons()` in `scripts.js` to automatically add `aria-label="Learn more about [section heading]"` for generic link text.

6. **Pricing CTA buttons lacked plan context** — "Start Free Trial" appeared 5 times linking to 3 different URLs. Fixed in `pricing-table.js` to include plan name: `aria-label="Start Free Trial — Pro plan"`.

7. **Nav dropdown items missing role and haspopup** — Interactive `<li>` elements had `tabindex="0"` but no semantic role. Added `role="button"` and `aria-haspopup="true"` in `header.js`.

**Also fixed:**

8. **Hero min-height conditional** — Removed fixed `min-height: 60vh/70vh` from hero, applied it only when `.hero-background` is present via `:has()` selector.

### What passed

- Single H1 on page
- Color contrast (dark theme has excellent light-on-dark ratios)
- Pricing toggle switch (proper `role="switch"`, `aria-label`, `aria-checked`)
- Landmark structure (`<main>`, `<nav>`, `<header>`, `<footer>`)
- `lang` attribute, no duplicate IDs, no positive tabindex

## Reflections

This was the most interesting phase for the thesis question. A full WCAG accessibility audit — typically requiring specialized tooling (axe-core, Lighthouse, manual screen reader testing) and expert knowledge — was performed entirely by an LLM agent using browser automation.

The agent:
1. Navigated to the page
2. Inspected every heading, link, image, button, and interactive element
3. Checked computed styles for focus indicators and contrast
4. Identified 8 distinct issues with correct severity ratings
5. Proposed and implemented fixes across 6 files
6. Verified all fixes via re-inspection

A CMS accessibility checker would flag issues but couldn't fix them. The LLM both diagnosed and remediated in one pass. The fixes were structural (DOM changes in JS decorators) not content changes — they required understanding the block decoration architecture.

The one limitation: the audit was self-graded. Per our execution rules, external validation should follow.

## Files changed

- `scripts/scripts.js` — Skip-to-main link, contextual aria-labels for generic buttons
- `styles/styles.css` — Skip link styles, button `:focus-visible` outline
- `blocks/footer/footer.js` — Social link aria-labels, H4→H3 heading fix
- `blocks/header/header.js` — Nav dropdown `role="button"` and `aria-haspopup`
- `blocks/pricing-table/pricing-table.js` — Plan-specific CTA aria-labels
- `blocks/hero/hero.css` — Conditional min-height on background presence
