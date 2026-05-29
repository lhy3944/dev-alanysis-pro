# 프로젝트 가이드

## 디자인 시스템 (필수 — UI 작업 전 반드시 확인)

새 페이지/컴포넌트를 만들기 전에 **반드시** 다음 순서를 따른다.

1. **규칙 요약** — [docs/guides/design-system.md](docs/guides/design-system.md) 를 본다.
2. **레퍼런스 화면** — [docs/reference/devanalysis-pro-design-system/project/ui_kits/](docs/reference/devanalysis-pro-design-system/project/ui_kits/) 에서 비슷한 화면(workspace = 프로젝트, admin = 어드민)을 먼저 찾는다. 있으면 시각 출력을 그대로 맞춘다.
3. **토큰만 사용** — [src/app/globals.css](src/app/globals.css) 에 정의된 토큰 클래스만 사용. 원시 hex(`#5569ff`, `bg-[#…]`)·인라인 스타일 금지.
4. **상태 뱃지** — [src/components/ui/status-badge.tsx](src/components/ui/status-badge.tsx) (`LifecycleBadge` / `AnalysisTypeBadge` / `RoleBadge` / `StatusBadge`) 를 쓴다.
5. **브랜드 퍼플 `#5569FF`** — 헤더 chrome 과 랜딩 hero CTA 에만. 캔버스 안에선 금지.
6. **번들 ↔ globals.css 는 1:1 미러.** 새 토큰이 필요하면 디자인 시스템 번들 CSS 에 먼저 추가하고 globals.css 에 미러링한다.

번들에 없는 시각 패턴을 **발명하지 않는다** — 가장 비슷한 화면을 골라 같은 시각 언어로 작성한다.

## 기술 스택

- **Framework:** Next.js 16 / React 19
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State:** Zustand 5
- **Animation:** motion (Framer Motion v12)
- **Icons:** lucide-react
- **Overlay:** 자체 overlay-store + OverlayProvider 패턴

---

## 디렉토리 구조 & 배치 규칙

```
src/
├── app/                    # Next.js 라우팅 (route groups 사용)
│   ├── (auth)/             # 인증 화면
│   └── (main)/             # 서비스 화면
├── components/             # UI 컴포넌트
│   ├── ui/                   # shadcn/ui 기반 원자 컴포넌트 (Button, Badge, Input 등)
│   ├── shared/               # 여러 도메인에서 공유하는 컴포넌트 (Logo, ThemeToggle)
│   ├── layout/               # 레이아웃 컴포넌트 (Header, Sidebar, Footer)
│   ├── overlay/              # 다이얼로그, 드롭다운 등 오버레이
│   ├── {{도메인명}}/        # 해당 도메인 전용 컴포넌트
├── constants/                # 도메인별 상수 (project.ts, requirement.ts 등)
├── hooks/                    # 커스텀 훅 (useResize, useMediaQuery 등)
│   ├── utils.ts              # cn() 등 범용 유틸
│   ├── format.ts             # 포맷팅 유틸 (formatDate 등)
│   ├── api.ts                # API 클라이언트
│   └── fonts.ts              # 폰트 설정
├── stores/                 # Zustand 스토어
├── lib/                    # 유틸리티 (utils.ts, fonts.ts)
└── types/                  # 전역 타입 정의
```

**배치 원칙:**

- 오버레이(모달/다이얼로그/드롭다운)는 `components/overlay/`
- Provider 컴포넌트는 `components/providers/`
- 특정 도메인에서만 쓰이면 해당 도메인 폴더, 여러 곳에서 쓰이면 `shared/`

### 도메인 파일 규칙 (필수)

> **하나의 도메인 = 하나의 타입 파일.**
> 같은 도메인의 모든 인터페이스는 한 파일에 `// --- Section ---` 구분선으로 모은다.

- **타입**: `src/types/{domain}.ts` 하나. 신규 타입이 필요해도 새 파일을 만들지 말고 같은 파일에 새 섹션을 추가한다. 예: `src/types/project.ts`, `src/types/unit-test.ts`.
- **서비스**: 도메인당 `src/services/{domain}-service.ts` 하나.
- **대용량 mock 데이터**: 같은 폴더에 `{domain}-service.mock.ts` 로 co-locate. 소스코드 dump, 로그, markdown 같은 raw 문자열만 분리하고 구조 데이터는 service inline 유지.

목적: 도메인의 전체 인터페이스를 한 파일에서 일별 가능. 파일 양산 방지.

## 페이지 컴포넌트 패턴

`page.tsx`는 **자식 컴포넌트를 조립하는 레이어**로만 사용한다. 디테일한 UI 구현(검색창, 필터, 툴바 등)은 도메인 컴포넌트로 분리하고, 페이지는 상태 관리와 컴포넌트 배치만 담당한다.

```tsx
// GOOD: 페이지는 조립만, 디테일은 컴포넌트에 위임
export default function MyProjectsPage() {
  const { projects, isLoading } = useProjectStore();
  // 상태 + 데이터 페칭만 페이지에 위치

  return (
    <div>
      <ProjectToolbar {...toolbarProps} />        {/* 검색/필터/뷰 */}
      <ProjectList {...listProps} />               {/* 카드/리스트 렌더링 */}
    </div>
  );
}

// BAD: 페이지에 모든 UI 구현이 들어가 있음
export default function MyProjectsPage() {
  return (
    <div>
      <div className="...">
        <Input ... />
        <Button ... />
        {/* 50줄 이상의 인라인 UI */}
      </div>
    </div>
  );
}
```

---

## 네이밍 컨벤션

| 대상              | 규칙                                        | 예시                                |
| ----------------- | ------------------------------------------- | ----------------------------------- |
| 컴포넌트 파일     | PascalCase                                  | `LeftSidebar.tsx`, `ChatArea.tsx`   |
| 스토어 파일       | kebab-case + `-store` 접미사                | `chat-store.ts`, `overlay-store.ts` |
| 훅 파일           | camelCase + `use` 접두사                    | `useOverlay.ts`, `useResize.ts`     |
| Props 인터페이스  | `{ComponentName}Props`                      | `ConfirmDialogProps`                |
| 이벤트 핸들러     | `handle{Event}` (내부), `on{Event}` (props) | `handleConfirm`, `onOpenChange`     |
| 상수 배열/객체    | UPPER_SNAKE_CASE (모듈 스코프)              | `BOTTOM_ICONS`, `PROMPT_CARDS`      |
| Zustand 스토어 훅 | `use{Domain}Store`                          | `usePanelStore`, `useChatStore`     |

---

## 컴포넌트 작성 패턴

### 기본 구조

```tsx
"use client"; // 클라이언트 컴포넌트는 반드시 최상단에

import { ... } from "외부라이브러리";
import { ... } from "@/components/...";
import { ... } from "@/stores/...";
import { cn } from "@/lib/utils";

interface ComponentNameProps {
  // props 명시적 정의
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // ...
}
```

- `"use client"` 는 인터랙션이 있는 컴포넌트에만 붙임
- **named export** 사용 (default export 사용하지 않음)
- Props 인터페이스는 컴포넌트 바로 위에 선언

### Import 순서

```tsx
// 1. 외부 라이브러리
import { useState } from "react";
import { motion } from "motion/react";

// 2. 내부 컴포넌트 (@/ 절대경로)
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat-store";

// 3. 유틸리티 / 타입
import { cn } from "@/lib/utils";
import type { AlertOptions } from "@/stores/overlay-store";
```

- **항상 `@/` 절대경로** 사용 (같은 폴더 내 relative import 금지)
- TypeScript 전용 import는 `import type` 사용

---

## 스타일링 패턴

### 클래스 병합은 반드시 `cn()` 사용

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />;
```

### 조건부 스타일

```tsx
// 상태에 따라 클래스 분기
<div
  className={cn(
    "flex h-full flex-col",
    isOpen ? "w-[220px] gap-2 pl-3" : "w-[60px] items-center",
  )}
/>
```

### 크기는 Tailwind 단위 사용

- 고정 크기: `size-4`, `h-9 w-9`, `w-[220px]`
- 아이콘: `className="h-5 w-5"` 또는 `className="size-4"`

---

## Zustand 스토어 패턴

```typescript
// stores/example-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExampleState {
  // 상태 먼저 정의
  value: string;
  // 액션은 상태 뒤에
  setValue: (v: string) => void;
}

export const useExampleStore = create<ExampleState>()(
  persist(
    (set) => ({
      value: "",
      setValue: (v) => set({ value: v }),
    }),
    {
      name: "aise-example", // localStorage key
      partialize: (s) => ({ value: s.value }), // 영속화할 필드만
    },
  ),
);
```

**컴포넌트에서 셀렉터 패턴으로 구독:**

```tsx
// 필요한 것만 구독 (전체 스토어 구독 금지)
const value = useExampleStore((s) => s.value);
const setValue = useExampleStore((s) => s.setValue);
```

---

## 오버레이 시스템

모달/다이얼로그/알림은 **직접 컴포넌트 마운트 대신 `useOverlay` hook** 사용:

```tsx
const overlay = useOverlay();

// Alert (단순 알림)
overlay.alert({
  type: "success" | "warning" | "info" | "error",
  title: "제목",
  description: "내용",
});

// Confirm (확인/취소)
overlay.confirm({
  title: "삭제하시겠습니까?",
  variant: "destructive",
  onConfirm: () => handleDelete(),
});

// Modal (커스텀 컨텐츠)
overlay.modal({
  title: "편집",
  size: "sm" | "md" | "lg" | "xl", // 기본값: "md"
  content: <MyForm />,
  footer: <Button onClick={() => overlay.closeModal()}>저장</Button>,
});
```

**새 오버레이 컴포넌트 추가 시:**

1. `components/overlay/` 에 컴포넌트 작성
2. `stores/overlay-store.ts` 에 options 인터페이스 + 상태 추가
3. `components/providers/OverlayProvider.tsx` 에 렌더링 추가
4. `hooks/useOverlay.ts` 에 호출 메서드 노출

---

## 애니메이션 패턴

```tsx
import { motion, AnimatePresence } from "motion/react";

// 두 상태 전환 (레이아웃 전환 등) - AnimatePresence + key 사용
<AnimatePresence mode="popLayout">
  {isOpen ? (
    <motion.div
      key="expanded"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 220, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 30 } }}
      exit={{ width: 0, opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }}
    />
  ) : (
    <motion.div key="collapsed" /* ... */ />
  )}
</AnimatePresence>

// 단순 등장/퇴장
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
/>
```

**주의:** width/height 애니메이션 시 단일 `motion.div`에서 width만 바꾸면 내부 콘텐츠가 즉시 교체되어 부자연스러움 → `AnimatePresence`로 두 레이아웃을 전환하는 방식 사용

---

## shadcn 컴포넌트 사용 규칙

### 사용 가능한 컴포넌트 (`components/ui/`)

`button`, `dialog`, `alert-dialog`, `drawer`, `sheet`, `dropdown-menu`, `tabs`, `tooltip`, `badge`, `label`, `input`, `textarea`, `select`, `input-group`, `skeleton`, `scroll-area`, `separator`, `switch`, `avatar`, `hover-card`, `command`, `spinner`, `text-animate`, `aurora-text`

### 커스터마이징 원칙

- `components/ui/` 파일은 **직접 수정 최소화** (shadcn CLI로 관리됨)
- 커스텀이 필요하면 `components/overlay/` 또는 도메인 폴더에서 래핑
- className prop으로 스타일 오버라이드 (cn() 활용)

### Tooltip은 반드시 TooltipProvider 안에서 사용

`TooltipProvider`가 root layout에 이미 있으므로 별도 추가 불필요.

### ScrollArea에 flex-1 사용 시

부모에 반드시 `flex` 클래스 필요 (height 계산 이슈).

---

## 반응형 처리

- **Mobile:** `< 768px` → 드로어(Drawer) 방식
- **Tablet:** `768px ~ 1023px`
- **Desktop:** `>= 1024px` → 멀티패널 레이아웃

```tsx
// Tailwind 반응형 유틸리티
className = "max-md:hidden"; // 모바일에서 숨김
className = "lg:block"; // 데스크탑에서만 표시
className = "hidden lg:flex"; // 데스크탑에서만 flex
```

`useMediaQuery` 훅으로 JS 레벨 분기도 가능.

---

## 금지 사항

- `default export` 사용 금지 → named export 사용
- 상대경로 cross-folder import 금지 → `@/` 절대경로
- `className` 문자열 직접 연결 금지 → `cn()` 사용
- 인라인 스타일(`style={{}}`) 사용 금지 → Tailwind/CSS 변수
- 스토어 전체 구독 금지 → 셀렉터 패턴 사용
- `console.log` 코드 잔류 금지
