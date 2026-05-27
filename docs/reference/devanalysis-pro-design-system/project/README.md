# DevAnalysis Pro — Design System

A design system for **DevAnalysis Pro** (DEV Analysis+), an AI‑agent‑powered code analysis SaaS for engineering teams. The platform automates the document‑heavy parts of the SDLC — requirements analysis, architecture/code‑impact mapping, automatic test generation, commit‑level impact review and admin telemetry — and surfaces them as per‑project workspaces.

Two operator surfaces live inside the product:

1. **Project Workspace** — per‑project dashboard with Code Impact Analysis, Requirements, Unit Test, System Test, Commit History, and Settings sub‑views. Driven from a collapsible left sidebar.
2. **Admin Console** — Usage Overview, System Status, User Management. System‑admin only; shares the global header but swaps in its own left panel.

A third *(Project Groups / My Projects / Help)* surface lives in the marketing‑adjacent header tabs.

---

## Sources used to build this system

| Source                                                           | Type             | How it was used                                                                                                                                  |
| ---------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **[lhy3944/dev-alanysis-pro](https://github.com/lhy3944/dev-alanysis-pro)** | Next.js codebase | **Source of truth.** All tokens (`globals.css`), component patterns (shadcn/ui new‑york), layout primitives, icon set (lucide), font stack and copy. |
| `uploads/*.png` (PM mockups)                                     | Screenshots      | High‑level guidance only — verified layout, status‑badge usage, admin nav structure. The PM explicitly said these are rough mockups.                |
| `savecolor` file in repo                                         | Token            | PM‑specified header brand color `#5569FFF2` (used for the global header chrome).                                                                  |

> Reader hint: if you have access, browse the GitHub project directly — `src/app/globals.css` is the canonical token list and `src/components/ui/` contains the shadcn/ui component primitives this system tracks.

---

## Index — what's in this folder

```
README.md                ← you are here
SKILL.md                 ← Agent SKill entrypoint (cross‑compatible)
colors_and_type.css      ← all CSS variables (light + dark) + semantic styles
fonts/                   ← Pretendard woff2 files (Korean‑friendly sans)
assets/                  ← logos, icon set notes
preview/                 ← design‑system cards (rendered in the DS tab)
ui_kits/
    workspace/           ← Project Workspace — sidebar layout, dashboard, commit history, settings
    admin/               ← Admin Console — usage overview, system status, user management
```

---

## CONTENT FUNDAMENTALS

**Languages.** The product ships in **Korean as the primary UI language**, with English mixed in for technical labels, system names, and code‑adjacent nouns (e.g. *“Commit History”*, *“Module Topology”*, *“Code Impact Analysis”*). Korean is used for body copy, helper text, and CTAs that describe what the user is doing right now. Never localize technical jargon (commit hash, PR, JWT, regex, etc.).

**Tone.** Concise, professional, slightly formal — addressing engineers as colleagues, not consumers. Avoid marketing fluff inside the product. Avoid exclamation points.

- 한국어 본문은 **‑한다 / ‑한다 체** 또는 **‑할 수 있다** 같은 평서 종결 (descriptive declarative). 예: *"각 프로젝트 카드의 View 버튼을 클릭하면 아래 선택된 프로젝트의 'Dashboard' 화면으로 이동한다."*
- Buttons + actions: imperative — **`Get Started`**, **`Export Logs`**, **`Force Refresh`**, **`+ Add Admin`**, **`변경점 분석`** (Analyze Changes), **`전체 테스트 리포트 보기 →`** (View full test report →).
- Section headers in dashboards: noun phrase, often bilingual — **`영향받는 모듈 관계도 (Module Topology)`**, **`검증 필요 항목 (12건)`**, **`AI 코드 리뷰 결과 요약`**.

**Pronouns.** Avoid first‑person plural marketing voice ("we", "our team"). Use **you / your** sparingly; prefer object‑first phrasing — *"프로젝트 품질 분석 상태와 핵심 모듈 현황을 한눈에 모니터링합니다."*

**Casing.**

- **Page/section titles**: Title Case for English (`User Management`, `System Status`), full sentence for Korean (`변경 영향 분석 결과`).
- **Eyebrow labels**: `UPPERCASE` with wide letter‑spacing — `ANALYSIS COMPLETE`, `PROJECT WORKSPACE DASHBOARD`.
- **Status badges**: short Title Case, sometimes UPPER (`PASSED`, `FAILED`, `Pending`, `Merged`, `Critical`, `Warning`).
- **Tags / chips**: short, capitalized — `Published`, `Draft`, `Super Admin`, `Auditor`, `JavaScript/TypeScript`, `C/C++`.

**Numbers + counts.** Always pair with units — `42개` (42 items), `124ms`, `1.2 GB/s`, `42,891`, `18m 42s`, `+12.4%`. Korean count suffix (`개`, `건`, `명`) when the noun is Korean — `프로젝트 멤버 12명`, `Found 128 commits`.

**Emoji.** **No.** The product does not use emoji anywhere — even in success / empty states. Use lucide icons in colored tinted squares instead.

**Vibe.** Engineering ops console, not a SaaS landing page. Dense but breathable; data‑first; status‑colored badges over decorative imagery; no illustration, no stock photos. *"Looks like a tool a senior engineer would keep open all day."*

---

## VISUAL FOUNDATIONS

**Anatomy.** Every screen sits inside a 60px‑tall **brand‑purple header** (`#5569FFF2` in light, deep navy in dark) → optional **220px / 60px collapsible left sidebar** (panels animate between widths with a 400/30 spring) → **content canvas** that capped at `max-w-screen-xl` (1280px) or `full‑width` toggle. Sidebar / canvas are neutral; the header is the only chrome that carries brand color.

**Colors.**

- **Brand**: `#5569FF` purple‑blue (PM‑specified). Used on the global header, on primary CTAs in the hero/landing flow, on active sidebar accents in dark mode. **Never** as the body background. **Never** as a gradient — flat fills only.
- **In‑canvas accent**: `#000000` (light) / `#FFFFFF` (dark). The codebase reserves the brand purple for chrome — inside the canvas, primary buttons and the focus ring use plain black/white. This is on purpose: it stops the screen from looking like a marketing site.
- **Surface hierarchy** (light): `#FFFFFF` (bg) → `#F5F5F7` (sidebar/card) → `#E8E9ED` (active row) → `#DCDEE2` (pressed). Borders are `#E0E1E5` (subtle), `#D4D5D9` (default), `#B0B2B8` (strong).
- **Semantic** uses Tailwind‑family hues at `bg-{color}-500/10 text-{color}-600` for badges (e.g. `bg-emerald-500/10 text-emerald-600` for Published). Solid `success/warning/destructive` for buttons + dots.

**Type.**

- **Body / UI**: `Pretendard` (open‑source Korean‑friendly sans) → fallback `Inter` → system. Weights 400 / 500 / 600 / 700 in regular use; 800 for hero only.
- **Mono**: `Geist Mono` for commit hashes, file paths, code snippets, timestamps in log tables.
- **Scale** is *compact density* — 11 / 13 / 15 / 17 / 19 / 22 / 28 px. **15px is body, 13px is the most common UI size, 11px is reserved for metadata + micro‑badges.** Never go smaller.
- Hero gets a 56px display via `AuroraText` (animated gradient text component) — only on `/chat` landing.

**Spacing.** 4 px base scale (`4 / 8 / 12 / 16 / 20 / 24 / 32 / 48`). Cards use 20–24 px internal padding; lists use 12 px row spacing; sidebar nav rows are 10 px vertical.

**Backgrounds.** Solid fills only. **No full‑bleed photography, no hand‑drawn illustration, no repeating patterns, no gradients.** The single exception is the `AuroraText` hero component which animates a gradient *inside* a clipped word — not a background. Dashboards layer cards on a flat secondary surface; that's all the visual texture you get.

**Animation.** `framer-motion` (motion v12) — sidebar width transitions are `spring(stiffness: 400, damping: 30)`; entry/exit fades are `duration 0.2 easeOut`. `tw-animate-css` shimmer (1s ease‑in‑out infinite) on loading skeletons. Page transitions: `nextjs-toploader` 2px bar at the top in the accent color. **No bouncing, no scale‑on‑idle, no parallax.** Hover is a color change, not motion.

**Hover states.**

- **Nav rows**: background flips from transparent → `--bg-surface-2`, color from `--text-secondary` → `--text-primary`. No transform.
- **Cards**: border shifts from `--border-primary` → `--accent-primary/40` (i.e. neutral → slightly darker) AND a soft `shadow-md` appears. No translate.
- **Buttons**: bg darkens to 90% of base (`bg-primary/90`).
- **Header nav tabs**: `translateY(-2px)` on the inner content (`group-hover:-translate-y-0.5`) — the *only* place a transform is used.

**Press states.** Buttons darken further (no scale). The `ThemeToggle` thumb uses `active:scale-95`. Nothing else shrinks.

**Borders.** `1px solid` everywhere. Cards are bordered, not shadowed, by default. Most surfaces stack borders rather than shadows (a tell that this is a tool, not a marketing site). Dotted dividers (`border-dotted`) appear inside cards to separate meta strips from primary content.

**Shadows.**

- `shadow-xs`: form inputs.
- `shadow-sm`: rare — outline buttons in dark mode.
- `shadow-md`: card hover.
- `shadow-lg`: modals, popovers (paired with backdrop blur).
- **No inner shadows.** No long colored shadows. Shadows are short, dark, and used as elevation cues only.

**Radii.** `4px` (chips) / `6px` (buttons, small) / `8px` (cards, inputs — the default) / `12px` (modals) / `9999px` (pills + avatars + status badges). Status badges are *always* full‑pill.

**Layout rules.**

- Header is `sticky top-0 z-50`, `backdrop-blur-xl`, 60 px tall.
- Sidebar is `shrink-0`, width 220 / 60, scrolls inside its own container; never the page.
- Content canvas: `max-w-screen-xl` by default; **`fullWidthMode`** toggle in the header expands to ~1080 px half‑width (~2160 visible).
- Mobile (<768 px): sidebar becomes a `Drawer`; header tabs hide behind a `MobileMenu`.

**Transparency / blur.** Used **only** on the sticky header (`backdrop-blur-xl`) so content scrolls under the brand chrome legibly. Modals and popovers get a `bg-black/40` backdrop, no blur. Skeletons use solid `--bg-surface-2`, not transparency.

**Imagery vibe.** None. There is no product photography. Avatar placeholders are 2‑letter monogram chips with `bg-{color}-500/10 text-{color}-600` (matched by user's role).

**Cards.**

- Default: `border-line-primary bg-canvas-surface rounded-lg border p-5` (8 px radius, neutral 1‑px border, 20 px padding, surface fill).
- On hover: border → `accent-primary/40`, shadow‑md appears.
- Headed section cards (e.g. *Module Topology*, *AI 코드 리뷰 결과 요약*): the header is a 12 px strip with a `text-sm font-semibold` title on the left and an inline action chip on the right (`Critical Path`, `8 Active`, `모두 보기`).

**Forms.** Inputs are `h-9 rounded-md border border-input bg-background px-3 text-sm`. Focus uses the `ring-focus` pattern — `box-shadow: 0 0 0 3px var(--brand-primary-soft)` plus a brand‑colored border. **Required asterisks are red and follow the label, not precede it.**

**Status badges.** Always pill (`rounded-full`), always *tinted soft‑bg + 600‑weight foreground*: `bg-{color}-500/10 text-{color}-600 dark:text-{color}-400 px-2 py-0.5 text-xs font-medium`. Status colors are mapped explicitly in `constants/project.ts` — see `colors_and_type.css` `--status-*` tokens for the static palette equivalents.

---

## ICONOGRAPHY

- **System**: [`lucide-react`](https://lucide.dev/) at version `^0.577.0`. Stroke style only — 1.5 px stroke at 16 / 20 / 24 px sizes. **No filled variants** outside two specific cases (notification‑dot, layout‑toggle when active uses `fill="currentColor"`).
- **Default sizes**: `h-4 w-4` (16 px) inline next to text, `h-5 w-5` (20 px) for header / sidebar / button‑only icons, `size-4` (16 px) inside chips and badge prefixes.
- **Default color**: `var(--icon-default)` — same `#60646c` muted gray as `--text-muted`. Active rows / hovered cells use `var(--icon-active)` → `#171717`.
- **Tinted icon squares** (the only branded icon treatment): used to label module cards on the workspace dashboard — a 32 px `rounded-md` square with `bg-{color}-500/10 text-{color}-500`, e.g. blue for Requirement, purple for Architecture, amber for TestCase. See `preview/components-icon-squares.html`.
- **Logo mark**: not a graphic in this codebase — the wordmark is rendered as text: `<DevAnalysis>` in `text-fg-primary font-bold` followed by `<pro>` in a black/white pill, `9px`, `font-black`, `tracking-widest`. See `assets/Logo.tsx` for the exact recreation. *(If a graphical logo file becomes available, drop it in `assets/` and update the `Logo` component.)*
- **SVGs vs PNGs**: the codebase ships only the favicon as `.ico` and depends entirely on the lucide *npm package* for SVGs at runtime. There are no per‑icon SVG files committed. For static HTML mocks **load lucide from CDN**: `https://unpkg.com/lucide-static@latest/font/lucide.css` *or* drop in the `lucide` web build and use `<i data-lucide="name">` + `lucide.createIcons()`.
- **Emoji / unicode glyphs**: never used. Bullets in markdown body copy are fine; UI bullets are SVG dots (`<span class="size-1.5 rounded-full bg-current">`).

---

## CAVEATS & SUBSTITUTIONS

- **Pretendard** is the actual product font (open‑source from Naver). It's loaded locally and shipped from the codebase. ✅ No substitution needed.
- **Geist Mono** and **Inter** are both Google Fonts and used in mocks from CDN. ✅ No substitution.
- **No real graphical logo** exists in the codebase — the wordmark is text. If you have a logo asset, drop it into `assets/` and edit `Logo.tsx` / `Logo.jsx`.
- **Mockup screenshots are rough** — per the PM, they are layout sketches, not pixel‑perfect. The UI kit follows the codebase, not the screenshots, when they conflict.

---

## How to use

- **Designing new screens**: start from `colors_and_type.css`. Build with `--text-*`, `--bg-*`, `--border-*` tokens — never raw hex.
- **Mockups & demo HTML**: import the CSS, pull `Pretendard` from `/fonts/`, pull `Inter` + `Geist Mono` from Google Fonts CDN, lucide icons from CDN. See `ui_kits/workspace/index.html` for a working setup.
- **Production code**: this design system mirrors `lhy3944/dev-alanysis-pro` `globals.css`. Edit there for the source of truth, and re‑sync the tokens here.

Browse the [GitHub repository](https://github.com/lhy3944/dev-alanysis-pro) for the live React components, including `Header.tsx`, `AdminLeftPanel.tsx`, `ProjectCard.tsx`, and the full `components/ui/` shadcn primitives.
