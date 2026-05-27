# Workspace UI Kit

A high-fidelity recreation of the **per-project workspace** in DevAnalysis Pro.

A user picks a project from `/my-projects` or `/project-groups`, lands in this workspace, and uses the left sidebar to switch between sub‑views:

- **Dashboard** — analysis result summary, module topology, validation findings, AI review summary, unit/system test status.
- **Code Impact Analysis** — module topology + impact graph.
- **Requirement / Unit Test / System Test** — analysis-agent result panes.
- **Commit History** — table + 변경점 분석 entry point.
- **Settings** — documentation path config.

## Components

```
WorkspaceShell.jsx    — full app shell (Header + LeftSidebar + content)
WorkspaceHeader.jsx   — global brand-purple header
WorkspaceSidebar.jsx  — 220/60 collapsible left rail
DashboardView.jsx     — landing/dashboard view (analysis summary, topology stub, validations, AI review)
CommitHistoryView.jsx — commits table + analyze-button + side KPIs
SettingsView.jsx      — documentation-paths config form
Badges.jsx            — Pill / StatusPill / AnalysisTypePill
Card.jsx              — common card chrome + SectionCard
```

## Running

`index.html` boots the kit. It uses inline JSX via Babel with pinned React 18.3 + Babel 7.29 runtimes. Pulls Pretendard from `../../fonts/`, Inter & Geist Mono from Google Fonts, lucide icons from CDN.

## Interactivity

- Sidebar toggle (220 ↔ 60) animates with CSS transitions.
- Top nav tabs switch which workspace sub-view shows.
- Theme toggle in the header switches `.dark` on `<html>`.

## What it does **not** do

This is a **visual** recreation. The data is mocked, the chart in Dashboard is an SVG placeholder, the docs‑path form doesn't validate, the table is static. Use the JSX components as building blocks for real designs.
