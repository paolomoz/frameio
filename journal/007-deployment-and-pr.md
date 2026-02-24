# 007 — Deployment: feature branch and PR

**Date:** 2026-02-24
**Phase:** 8 (Deployment)

## What happened

Created feature branch `feature/dark-theme-clone` containing all 9 commits from Phases 1–7 and pushed to GitHub. Opened PR #1 targeting `main` with comprehensive description and test plan.

### PR details
- **URL**: https://github.com/paolomoz/frameio/pull/1
- **Title**: Frame.io dark theme clone: complete site build
- **Commits**: 9 (Phase 1 foundation → Phase 6 accessibility)
- **Build check**: Passed
- **PSI check**: Pending (requires DA-authored content on preview URL)

### Preview URL status
The AEM preview URLs (`https://feature-dark-theme-clone--frameio--paolomoz.aem.page/...`) return 404 because our test content lives in `/drafts/` as static HTML files, only served by the local dev server. To make preview work, Phase 6 (DA content authoring) needs to push content to DA via the admin API.

This is a known gap: the code is ready, but content authoring hasn't been done yet.

## Reflections

This is a fascinating moment for the thesis. The entire code layer of a production-quality website — design system, 15+ blocks, responsive layouts, scroll animations, accessibility compliance — was built entirely by an LLM agent in a single session. The code is lint-clean, accessibility-audited, and visually verified at three breakpoints.

But without content in the CMS, the preview URL returns 404. The code-content separation in AEM Edge Delivery is stark: code lives in GitHub, content lives in DA. An LLM can write perfect code but can't author content in DA without API access and credentials.

This suggests a hybrid model: LLM for code and structure, CMS for content management and author experience. The CMS isn't replaced — it's repositioned as a content-only tool, while the LLM handles everything that was traditionally "developer work."

## Commits in this PR

1. `d808da6` — Phase 1: Dark theme design system foundation
2. `700316a` — Phase 2: Update core blocks for dark theme
3. `dbd6ba5` — Phase 3: Add 10 new blocks for frame.io clone
4. `116aa63` — Phase 4: Add test content drafts for all pages
5. `deb31ae` — Phase 5: Visual polish (icons, scroll-reveal, draft format)
6. `57d67b2` — Fix mobile column layout: text first, smaller icons
7. `ba97bca` — Fix feature-grid active state for drafts path
8. `dba01d6` — Accessibility fixes (skip link, focus states, ARIA, headings)
9. `e949df2` — Journal entry 006: Accessibility audit and fixes
