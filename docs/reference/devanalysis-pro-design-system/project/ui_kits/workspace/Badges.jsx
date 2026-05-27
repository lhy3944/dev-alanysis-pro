// Badges.jsx — status pills used across the workspace.

const STATUS_PALETTE = {
    draft:     { bg: "#fef3c7", fg: "#b45309" },
    published: { bg: "#d1fae5", fg: "#047857" },
    deleted:   { bg: "#fee2e2", fg: "#b91c1c" },
    pending:   { bg: "#fef3c7", fg: "#b45309" },
    merged:    { bg: "#d1fae5", fg: "#047857" },
    failed:    { bg: "#fee2e2", fg: "#b91c1c" },
    passed:    { bg: "#d1fae5", fg: "#047857" },
    skipped:   { bg: "#e2e8f0", fg: "#475569" },
    running:   { bg: "#dbeafe", fg: "#1d4ed8" },
    finishing: { bg: "#cffafe", fg: "#0e7490" },
    queued:    { bg: "#f1f5f9", fg: "#475569" },
    info:      { bg: "#dbeafe", fg: "#1d4ed8" },
    active:    { bg: "#ede9fe", fg: "#6d28d9" },
    warning:   { bg: "#fff4e6", fg: "#b45309" },
    critical:  { bg: "#b91c1c", fg: "#ffffff" },
    error:     { bg: "#dc2626", fg: "#ffffff" },
    warning_solid: { bg: "#f59e0b", fg: "#ffffff" },
};

const TYPE_PALETTE = {
    "Java":                  { bg: "#dbeafe", fg: "#1d4ed8" },
    "C/C++":                 { bg: "#cffafe", fg: "#0e7490" },
    "Objective-C/C++":       { bg: "#e0e7ff", fg: "#4338ca" },
    "Swift":                 { bg: "#ffedd5", fg: "#c2410c" },
    "webOS":                 { bg: "#ede9fe", fg: "#6d28d9" },
    "Python":                { bg: "#fef9c3", fg: "#a16207" },
    "JavaScript/TypeScript": { bg: "#fef3c7", fg: "#b45309" },
    "Dart":                  { bg: "#ccfbf1", fg: "#0f766e" },
};

const ROLE_PALETTE = {
    "Super Admin":     { bg: "#ede9fe", fg: "#6d28d9" },
    "Data Analyst":    { bg: "#dbeafe", fg: "#1d4ed8" },
    "Security Officer":{ bg: "#d1fae5", fg: "#047857" },
    "Auditor":         { bg: "#fee2e2", fg: "#b91c1c" },
};

function StatusPill({ status, label, dot = false, style }) {
    const p = STATUS_PALETTE[status] || STATUS_PALETTE.info;
    return (
        <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 10px",
            borderRadius: 9999,
            background: p.bg,
            color: p.fg,
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1,
            whiteSpace: "nowrap",
            ...style,
        }}>
            {dot && <span style={{ width: 6, height: 6, borderRadius: 9999, background: p.fg }}/>}
            {label || status}
        </span>
    );
}

function TypePill({ type, style }) {
    const p = TYPE_PALETTE[type] || { bg: "var(--bg-surface-2)", fg: "var(--text-secondary)" };
    return (
        <span style={{
            display: "inline-flex",
            padding: "3px 10px",
            borderRadius: 9999,
            background: p.bg, color: p.fg,
            fontSize: 11, fontWeight: 600, lineHeight: 1,
            whiteSpace: "nowrap",
            ...style,
        }}>{type}</span>
    );
}

function RolePill({ role, style }) {
    const p = ROLE_PALETTE[role] || { bg: "var(--bg-surface-2)", fg: "var(--text-secondary)" };
    return (
        <span style={{
            display: "inline-flex",
            padding: "3px 10px",
            borderRadius: 9999,
            background: p.bg, color: p.fg,
            fontSize: 11, fontWeight: 600, lineHeight: 1,
            whiteSpace: "nowrap",
            ...style,
        }}>{role}</span>
    );
}

// Hard-edge log-level chip (rectangular, uppercase).
function LogPill({ level }) {
    const map = {
        CRITICAL: { bg: "#b91c1c", fg: "#fff" },
        WARNING:  { bg: "#f59e0b", fg: "#fff" },
        ERROR:    { bg: "#dc2626", fg: "#fff" },
        INFO:     { bg: "#3b82f6", fg: "#fff" },
    };
    const p = map[level] || map.INFO;
    return (
        <span style={{
            display: "inline-flex",
            padding: "3px 8px",
            borderRadius: 4,
            background: p.bg, color: p.fg,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
            lineHeight: 1,
        }}>{level}</span>
    );
}

// Avatar — 2-letter initial monogram, color cycles by letter.
function Avatar({ initials, size = 24, style }) {
    const colors = [
        { bg: "rgba(59,130,246,0.12)",  fg: "#2563eb" },
        { bg: "rgba(16,185,129,0.12)",  fg: "#059669" },
        { bg: "rgba(245,158,11,0.12)",  fg: "#d97706" },
        { bg: "rgba(168,85,247,0.12)",  fg: "#9333ea" },
        { bg: "rgba(239,68,68,0.12)",   fg: "#dc2626" },
        { bg: "rgba(20,184,166,0.12)",  fg: "#0d9488" },
    ];
    const idx = (initials || "??").charCodeAt(0) % colors.length;
    const c = colors[idx];
    return (
        <span style={{
            width: size, height: size,
            borderRadius: 9999,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: c.bg, color: c.fg,
            fontSize: Math.round(size * 0.45),
            fontWeight: 700,
            flexShrink: 0,
            ...style,
        }}>{(initials || "??").slice(0,2).toUpperCase()}</span>
    );
}

Object.assign(window, { StatusPill, TypePill, RolePill, LogPill, Avatar });
