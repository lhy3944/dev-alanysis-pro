# Assets

Logos, icon notes and any image assets the brand owns.

## What's here

| File                | What it is                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| `Logo.jsx`          | JSX recreation of the wordmark — `<DevAnalysis>` + `<pro>` pill.            |
| _no logo files_     | The codebase ships **no graphical logo file** — the wordmark is rendered as text. If a real logo asset arrives, drop it here and update `Logo.jsx`. |

## Iconography

The product uses **[lucide-react](https://lucide.dev/)** at runtime — there are no committed SVG / PNG icon files.

For static HTML mocks, the simplest path is:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="layout-dashboard"></i>
<i data-lucide="git-branch"></i>
<script>lucide.createIcons();</script>
```

For React mocks, use:

```jsx
import { LayoutDashboard, GitBranch, BarChart3 } from "lucide-react";
```

## Icon set vocabulary

The icons commonly used in‑product, gathered from the codebase:

| Surface          | Icons                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| Header           | `Search`, `Bell`, `Fullscreen`, `Sun`/`Moon` (theme toggle)                                                       |
| Workspace sidebar | `LayoutDashboard`, `FileText`, `Activity`, `FlaskConical`, `GitPullRequest`, `Clock`, `Settings`                  |
| Admin sidebar    | `BarChart3`, `Activity`, `Users`, `Shield`, `Settings`, `CircleHelp`, `PanelLeftClose`, `PanelLeftOpen`            |
| Project cards    | `Box`, `Users`, `Clock`, `CheckCircle2`                                                                           |
| Logs / status    | `CheckCircle2` (passed), `XCircle` (failed), `AlertCircle` (warning), `Info`                                       |
| Empty / error    | `Box` (border-dashed), `LayoutDashboard` (animated bounce)                                                         |

Stroke weight is the lucide default (1.5px). **No filled variants** except notification dots and the layout‑toggle active state.

## Colors as small icon-tile backgrounds

Module cards on the workspace dashboard use a tinted 32px `rounded-md` square with a lucide icon centered:

```jsx
<div style={{
    background: 'rgb(59 130 246 / 0.1)',  // bg-blue-500/10
    color: 'rgb(37 99 235)',              // text-blue-600
    width: 32, height: 32,
    borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
}}>
    <FileText size={16} />
</div>
```

Tints mapped by module type:

- **Requirement** → blue (`bg-blue-500/10 text-blue-500`)
- **Architecture / Design** → purple (`bg-purple-500/10 text-purple-500`)
- **TestCase** → amber (`bg-amber-500/10 text-amber-500`)
- **Project** → brand accent (`bg-accent-primary/10 text-accent-primary`)
