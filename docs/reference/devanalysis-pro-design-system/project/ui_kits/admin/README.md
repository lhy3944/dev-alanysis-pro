# Admin UI Kit

Recreation of the **Admin Console** in DevAnalysis Pro.

System‑admin‑only surface that lives behind `/admin` and exposes three sub‑views:

- **Usage Overview** — KPI tiles + monthly/daily login bars + analysis‑by‑business‑unit donut.
- **System Status** — CPU/worker/latency tiles + currently‑analyzing project list + system‑error log.
- **User Management** — admin list with role pills, search, pagination.

## Components

```
AdminShell.jsx       — composes header + admin sidebar + view
AdminSidebar.jsx     — collapsible left rail, scoped to admin
UsageOverviewView.jsx
SystemStatusView.jsx
UserManagementView.jsx
```

The kit **reuses** the workspace kit's `Icons.jsx`, `Badges.jsx`, `Card.jsx`, and `WorkspaceHeader.jsx` via relative `<script>` tags — see `index.html`.

## Running

Open `index.html`. Same React 18.3 + Babel 7.29 stack as the workspace kit.

## What it does not do

The bar charts and donut are static SVG. The user table is static. Forces‑refresh / export‑logs / add‑admin buttons don't fire requests.
