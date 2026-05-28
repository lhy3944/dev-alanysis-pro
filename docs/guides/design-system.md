# Design System

> DevAnalysis Pro의 디자인 시스템 단일 출처(SoT)와 컴포넌트 작업 규칙.
> 새 화면/컴포넌트를 만들기 전에 **반드시** 이 문서를 먼저 본다.

## 단일 출처 (Source of Truth)

| 자료 | 위치 | 용도 |
|---|---|---|
| **디자인 시스템 번들** | [docs/reference/devanalysis-pro-design-system/](../reference/devanalysis-pro-design-system/) | 토큰·컴포넌트·HTML 프리뷰의 마스터 |
| └ `project/README.md` | 같음 | **CONTENT FUNDAMENTALS / VISUAL FOUNDATIONS** 등 디자인 원칙 전문 |
| └ `project/SKILL.md` | 같음 | 빠른 룰 요약 (3분) |
| └ `project/colors_and_type.css` | 같음 | 토큰 마스터 정의 |
| └ `project/preview/*.html` | 같음 | 색·타이포·컴포넌트별 렌더 미리보기 |
| └ `project/ui_kits/workspace/*.jsx` | 같음 | 워크스페이스 화면 레퍼런스 |
| └ `project/ui_kits/admin/*.jsx` | 같음 | 어드민 화면 레퍼런스 |
| **프로덕션 토큰** | [src/app/globals.css](../../src/app/globals.css) | 위 CSS를 Tailwind v4 + shadcn에 맞게 옮긴 것. 코드는 여기만 본다. |

번들은 PM 모킹과 [globals.css](../../src/app/globals.css) 를 기반으로 만들어졌으며 **번들 ↔ globals.css 는 1:1 미러**다. 한쪽을 바꾸면 다른 쪽도 동기화.

## 핵심 룰 (불변)

1. **브랜드 퍼플 `#5569FF` 는 헤더 chrome 과 랜딩 hero CTA 에만 쓴다.** 캔버스 안에서는 절대 안 쓴다.
2. **캔버스 안의 accent 는 검정(라이트) / 흰색(다크).** `--accent-primary` 가 이 역할.
3. **No gradients · No 풀블리드 사진 · No 일러스트 · No emoji.** 텍스처는 보더로 표현하고, 그림자는 elevation 단서로만.
4. **Compact density 스케일:** 11 / 13 / 15 / 17 / 19 / 22 / 28 px. **13px = 가장 많이 쓰는 UI 크기**, **15px = 본문**, **11px = 메타/마이크로 뱃지**.
5. **상태 뱃지는 항상 pill (`rounded-full`)** + 색조 soft bg + 600-weight fg. → [StatusBadge](../../src/components/ui/status-badge.tsx) 사용.
6. **한국어 우선, 영문은 기술 레이어.** 본문은 `-한다 / -할 수 있다` 평서체, 버튼/명사는 영문 그대로 (`Export Logs`, `+ Add Admin`), 섹션 헤더는 종종 양국어 병기 (`영향받는 모듈 관계도 (Module Topology)`).
7. **아이콘은 lucide 스트로크.** 채움 변형(`fill="currentColor"`)은 알림 닷·layout-toggle active 두 군데만.
8. **색은 강조 채널이지 라벨 채널이 아니다.** (정체성 (역할, 언어, 카테고리) → 색 (palette: amber/emerald/red/blue/cyan/indigo/orange/purple/teal) 상태 (완료, 진행, 실패) → 최대 2색 + neutral (emerald = 완료, red = 실패, 나머지는 무채색) 액션 강조 (선택됨, 호버) → black/white (canvas accent — 룰 #2)) 
카드 한 개당 색 신호 ≤ 2개. 같은 정보를 두 채널(bar + badge)로 색 코딩하지 않는다.


## 토큰 사용

코드에선 **항상 토큰 클래스를 쓴다.** 원시 hex 금지.

```tsx
// GOOD
<div className="bg-canvas-surface border-line-primary text-fg-primary">...
<Button className="bg-brand-primary text-header-fg">Get Started</Button> {/* hero CTA만 */}
<span className="bg-status-emerald-bg text-status-emerald-fg">Published</span>

// BAD
<div className="bg-[#f5f5f7] border-[#d4d5d9] text-[#171717]">...
<div style={{ background: "#5569ff" }}>...
```

### 토큰 카테고리

| 카테고리 | 클래스 prefix | 비고 |
|---|---|---|
| Brand (chrome 전용) | `bg-brand-primary`, `text-brand-primary`, `bg-brand-primary-soft` | 캔버스 안에선 X |
| Header chrome | `bg-header-bg`, `text-header-fg`, `text-header-fg-muted`, `bg-header-divider` | Header.tsx 안에서만 |
| Canvas | `bg-canvas-primary` (body) / `bg-canvas-surface` (card) / `bg-canvas-surface-2` (hover row) / `bg-canvas-surface-3` (pressed) | |
| Borders | `border-line-subtle` / `border-line-primary` / `border-line-strong` | 카드 기본 = primary |
| Text | `text-fg-primary` (heading) / `text-fg-secondary` (body) / `text-fg-muted` (meta) / `text-fg-tertiary` (placeholder) | |
| In-canvas accent | `bg-accent-primary` / `text-accent-primary` | 검정(라이트)/흰색(다크) |
| Icon | `text-icon-default` / `text-icon-active` | |
| Semantic | `text-success` / `bg-success-soft text-success-fg` 등 (success / warning / destructive / info) | 뱃지엔 status-* 권장 |
| Status (뱃지·아바타 칩) | `bg-status-{tone}-bg text-status-{tone}-fg` (amber/emerald/red/blue/cyan/indigo/orange/purple/teal) | [StatusBadge](../../src/components/ui/status-badge.tsx) 가 매핑 |

### Radii

`rounded-sm` 4px (chip) · `rounded-md` 6px (button) · `rounded-lg` 8px (card·input, **기본**) · `rounded-xl` 12px (modal) · `rounded-full` (pill, avatar, badge).

### Shadow

`shadow-xs` (input) · `shadow-sm` (드물게, 다크모드 outline button) · `shadow-md` (카드 hover) · `shadow-lg` (모달·팝오버, backdrop blur 동반).
**컬러 그림자·이너 그림자·롱 그림자 금지.**

## 타이포그래피

`.h1` (28/700/tight) · `.h2` (22/700/tight) · `.h3` (19/600) · `.h4` (15/600) · `.eyebrow` (13/700 uppercase tracking-widest brand) · `.meta` (11/muted) 클래스가 globals.css 에 있다. 페이지 헤더는 이걸 그대로 쓰면 된다.

```tsx
<header>
  <p className="eyebrow">Project Workspace Dashboard</p>
  <h1 className="h1">변경 영향 분석 결과</h1>
  <p className="meta">2025-11-24 · Branch: feature/auth-rework</p>
</header>
```

본문 폰트는 Pretendard → Inter → 시스템 폴백. mono 는 Geist Mono (커밋 해시, 파일 경로, 타임스탬프).

## 인터랙션 / 모션

- **Nav row hover:** bg `transparent → bg-canvas-surface-2`, color `fg-secondary → fg-primary`. Transform 없음.
- **Card hover:** border `line-primary → accent-primary/40` + `shadow-md`. Translate 없음.
- **Header tab hover:** 안쪽 콘텐츠에 `group-hover:-translate-y-0.5`. **여기만 transform 허용.**
- **Sidebar width 전환:** motion v12 `spring(stiffness: 400, damping: 30)`.
- **등장/퇴장:** `duration 0.2 easeOut`.
- **Skeleton:** `tw-animate-css` shimmer 1s infinite.

## 컴포넌트 매핑

| 디자인 시스템 자료 | 코드 위치 |
|---|---|
| `project/colors_and_type.css` | [src/app/globals.css](../../src/app/globals.css) |
| `project/assets/Logo.jsx` | [src/components/shared/Logo.tsx](../../src/components/shared/Logo.tsx) — `variant="inverse"` 지원 |
| `project/ui_kits/workspace/Badges.jsx` (STATUS_PALETTE / TYPE_PALETTE / ROLE_PALETTE) | [src/components/ui/status-badge.tsx](../../src/components/ui/status-badge.tsx) — `StatusBadge` / `LifecycleBadge` / `AnalysisTypeBadge` / `RoleBadge` |
| `project/ui_kits/workspace/WorkspaceHeader.jsx` | [src/components/layout/Header.tsx](../../src/components/layout/Header.tsx) — `bg-header-bg` chrome |

신규 도메인 컴포넌트를 만들 때엔 번들의 `ui_kits/` 안에 해당 화면이 있는지 먼저 보고, 있으면 그것을 React 로 옮긴다 (markup 구조는 따라가지 않아도 되지만 시각 출력은 픽셀 단위로 맞춘다).

## 새 컴포넌트/페이지 워크플로우

1. **번들의 `ui_kits/{영역}` 안에 해당 화면이 있는지** 확인. (workspace = 프로젝트 워크스페이스, admin = 어드민 콘솔)
2. 있으면 해당 jsx 와 그 `index.html` 을 읽어서 레이아웃·간격·뱃지 사용을 그대로 옮긴다.
3. 없으면 **번들의 가장 비슷한 화면** 을 골라 같은 시각 언어로 작성한다 — 그 사이에 새 시각 패턴을 발명하지 않는다.
4. 토큰은 `globals.css` 만 쓴다. 새 토큰이 필요하면 **먼저 번들 CSS 에 추가하고** globals.css 에 미러링한다.
5. 상태 뱃지는 `LifecycleBadge` / `AnalysisTypeBadge` / `RoleBadge` 부터 시도. 새 도메인이면 `StatusBadge` 의 tone 으로 직접 쓴다.
