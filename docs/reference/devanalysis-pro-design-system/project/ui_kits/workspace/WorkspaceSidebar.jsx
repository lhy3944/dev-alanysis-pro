// WorkspaceSidebar.jsx — 220 / 60 collapsible left rail with workspace nav.

const WORKSPACE_NAV = [
    { id: "dashboard",     label: "Dashboard",            icon: "layout-dashboard" },
    { id: "code-impact",   label: "Code Impact Analysis", icon: "git-pull-request" },
    { id: "requirement",   label: "Requirement",          icon: "file-text" },
    { id: "unit-test",     label: "Unit Test",            icon: "check-circle-2" },
    { id: "system-test",   label: "System Test",          icon: "flask-conical" },
    { id: "commit-history",label: "Commit History",       icon: "git-commit" },
];

function ProjectBadge({ name, branch }) {
    return (
        <div style={{
            margin: "6px 10px 10px",
            padding: "10px 12px",
            background: "var(--bg-surface-2)",
            borderRadius: 6,
            display: "flex", flexDirection: "column", gap: 2,
        }}>
            <span style={{
                fontSize: 10, fontWeight: 600, color: "var(--text-muted)",
                letterSpacing: "0.06em", textTransform: "uppercase",
            }}>{branch}</span>
            <span style={{
                fontSize: 13, fontWeight: 600, color: "var(--text-primary)",
                lineHeight: 1.3,
            }}>{name}</span>
        </div>
    );
}

function NavRow({ active, icon, label, onClick }) {
    return (
        <a
            onClick={onClick}
            style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 16px",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-surface-2)" : "transparent",
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                textDecoration: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--bg-surface-2)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
            onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
        >
            {active && <span style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"#5569FF" }}/>}
            <Icon name={icon} size={16} style={{ color: active ? "#5569FF" : "var(--icon-default)" }}/>
            <span>{label}</span>
        </a>
    );
}

function CollapsedIconRow({ active, icon, label, onClick }) {
    return (
        <div title={label} onClick={onClick} style={{
            width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6,
            background: active ? "var(--bg-surface-2)" : "transparent",
            color: active ? "var(--text-primary)" : "var(--icon-default)",
            position: "relative",
            cursor: "pointer",
        }}>
            {active && <span style={{ position: "absolute", left: -4, top: 6, bottom: 6, width: 3, background: "#5569FF", borderRadius: 1 }}/>}
            <Icon name={icon} size={16} style={{ color: active ? "#5569FF" : undefined }}/>
        </div>
    );
}

function WorkspaceSidebar({ view, onViewChange, project, collapsed, onToggle }) {
    const width = collapsed ? 60 : 220;

    return (
        <aside style={{
            width, flexShrink: 0,
            background: "var(--bg-secondary)",
            borderRight: "1px solid var(--border-subtle)",
            display: "flex", flexDirection: "column",
            transition: "width 0.25s cubic-bezier(0.34, 1.2, 0.64, 1)",
            overflow: "hidden",
        }}>
            {!collapsed && (
                <>
                    <div style={{
                        padding: "10px 10px 4px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: 13, fontWeight: 600, color: "var(--text-primary)",
                            cursor: "pointer",
                        }}>
                            <Icon name="chevron-left" size={16} style={{ color: "var(--icon-default)" }}/>
                            <span>{project?.name || "Project"}</span>
                        </span>
                        <span onClick={onToggle} style={{
                            width: 28, height: 28, borderRadius: 6,
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            color: "var(--icon-default)", cursor: "pointer",
                        }}><Icon name="panel-left-close" size={16}/></span>
                    </div>
                    <ProjectBadge name={project?.name || "Chiller-Turbo-Gen2-Main"} branch={project?.branch || "MAIN BRANCH"}/>
                    <nav style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                        {WORKSPACE_NAV.map((n) => (
                            <NavRow
                                key={n.id}
                                active={view === n.id}
                                icon={n.icon}
                                label={n.label}
                                onClick={() => onViewChange?.(n.id)}
                            />
                        ))}
                        <div style={{ marginTop: "auto", padding: "12px 10px", borderTop: "1px solid var(--border-subtle)" }}>
                            <a
                                onClick={() => onViewChange?.("settings")}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "8px 10px",
                                    color: view === "settings" ? "var(--text-primary)" : "var(--text-secondary)",
                                    background: view === "settings" ? "var(--bg-surface-2)" : "transparent",
                                    fontSize: 13, borderRadius: 6, cursor: "pointer",
                                }}
                            >
                                <Icon name="settings" size={16} style={{ color: view === "settings" ? "#5569FF" : "var(--icon-default)" }}/>
                                <span>Settings</span>
                            </a>
                        </div>
                    </nav>
                </>
            )}
            {collapsed && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 0" }}>
                    <span onClick={onToggle} style={{
                        width: 32, height: 32, borderRadius: 6,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        color: "var(--icon-default)", cursor: "pointer",
                    }}><Icon name="panel-left-open" size={16}/></span>
                    <div style={{ width: 24, height: 1, background: "var(--border-subtle)", margin: "4px 0" }}/>
                    {WORKSPACE_NAV.map((n) => (
                        <CollapsedIconRow
                            key={n.id}
                            active={view === n.id}
                            icon={n.icon}
                            label={n.label}
                            onClick={() => onViewChange?.(n.id)}
                        />
                    ))}
                    <div style={{ marginTop: "auto", paddingBottom: 8 }}>
                        <CollapsedIconRow
                            active={view === "settings"}
                            icon="settings"
                            label="Settings"
                            onClick={() => onViewChange?.("settings")}
                        />
                    </div>
                </div>
            )}
        </aside>
    );
}

window.WorkspaceSidebar = WorkspaceSidebar;
