---
name: devanalysis-pro-design
description: Use this skill to generate well-branded interfaces and assets for DevAnalysis Pro (DEV Analysis+), an AI-agent-powered code analysis platform — for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components (workspace + admin console) for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- **`colors_and_type.css`** — All CSS variables (light + dark) + semantic styles. The single source of truth for tokens.
- **`fonts/`** — Pretendard `.woff2` (9 weights). Wire from `colors_and_type.css`.
- **`assets/`** — Logo recreation + icon notes. Iconography is `lucide` (load from CDN for mocks).
- **`preview/`** — Per-token cards used by the Design System tab.
- **`ui_kits/workspace/`** — Project workspace (sidebar layout). Read `index.html` for a working setup.
- **`ui_kits/admin/`** — Admin console.

## Core rules

- **Brand purple `#5569FF` is for HEADER CHROME and PRIMARY CTAs only.** Body is neutral white / `#0a0a0a`. Inside the canvas, the accent is black/white — not purple. Don't sprinkle purple everywhere.
- **No gradients, no full-bleed photography, no illustration, no emoji.** Borders > shadows. Pill badges > rounded rectangles. Lucide stroke icons.
- **Compact density:** 11 / 13 / 15 / 17 / 19 / 22 / 28 px scale. 13 is the most common UI size.
- **Korean is primary, English is the technical layer.** Body copy in 평서체 Korean (`-한다 / -할 수 있다`); buttons + nouns often English (`Export Logs`, `+ Add Admin`); section headers often bilingual.
- **Status badges** are pills with `bg-{color}-500/10 text-{color}-600`. Lifecycle/Analysis-type palettes live in the CSS as `--status-*`.

## Sources

This skill mirrors **[lhy3944/dev-alanysis-pro](https://github.com/lhy3944/dev-alanysis-pro)**. `src/app/globals.css` is the canonical token set; this CSS replicates it and adds the PM-specified `#5569FFF2` header chrome.
