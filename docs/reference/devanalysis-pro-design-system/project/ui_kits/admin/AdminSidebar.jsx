// AdminSidebar.jsx — 220/60 collapsible left rail for the admin console.

const ADMIN_NAV = [
    { id: "usage-overview",  label: "Usage Overview", icon: "bar-chart-3" },
    { id: "system-status",   label: "System Status",  icon: "activity" },
    { id: "user-management", label: "User Management", icon: "users" },
];

function AdminSidebar({ view, onViewChange, collapsed, onToggle }) {
    if (collapsed) {
        return (
            <aside style={{
                width: 60, flexShrink: 0,
                background: "var(--bg-secondary)",
                borderRight: "1px solid var(--border-subtle)",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 8, padding: "12px 0",
            }}>
                <span onClick={onToggle} style={{
                    width: 32, height: 32, borderRadius: 6,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: "var(--icon-default)", cursor: "pointer",
                }}><Icon name="panel-left-open" size={16}/></span>
                <span title="admin 나가기" style={{
                    width: 32, height: 32, borderRadius: 6,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: "var(--icon-default)", cursor: "pointer",
                }}><Icon name="chevron-left" size={16}/></span>
                <div style={{ width: 24, height: 1, background: "var(--border-subtle)", margin: "4px 0" }}/>
                {ADMIN_NAV.map((n) => (
                    <div key={n.id} title={n.label} onClick={() => onViewChange?.(n.id)} style={{
                        width: 36, height: 36,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 6,
                        background: view === n.id ? "var(--bg-surface-2)" : "transparent",
                        color: view === n.id ? "#5569FF" : "var(--icon-default)",
                        position: "relative", cursor: "pointer",
                    }}>
                        {view === n.id && <span style={{ position:"absolute", left:-4, top:6, bottom:6, width:3, background:"#5569FF", borderRadius:1 }}/>}
                        <Icon name={n.icon} size={16}/>
                    </div>
                ))}
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6, paddingBottom: 8 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--icon-default)", cursor: "pointer" }}><Icon name="settings" size={16}/></span>
                    <span style={{ width: 32, height: 32, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--icon-default)", cursor: "pointer" }}><Icon name="circle-help" size={16}/></span>
                </div>
            </aside>
        );
    }

    return (
        <aside style={{
            width: 220, flexShrink: 0,
            background: "var(--bg-secondary)",
            borderRight: "1px solid var(--border-subtle)",
            display: "flex", flexDirection: "column",
            transition: "width 0.25s cubic-bezier(0.34, 1.2, 0.64, 1)",
        }}>
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
                    <span>ADMIN</span>
                </span>
                <span onClick={onToggle} style={{
                    width: 28, height: 28, borderRadius: 6,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: "var(--icon-default)", cursor: "pointer",
                }}><Icon name="panel-left-close" size={16}/></span>
            </div>

            <div style={{
                margin: "6px 10px 10px",
                padding: "10px 12px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
                display: "flex", alignItems: "center", gap: 8,
            }}>
                <Icon name="shield" size={16} style={{ color: "var(--icon-default)" }}/>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Admin Console</span>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", flex: 1, gap: 1 }}>
                {ADMIN_NAV.map((n) => {
                    const active = view === n.id;
                    return (
                        <a
                            key={n.id}
                            onClick={() => onViewChange?.(n.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "9px 16px",
                                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                                background: active ? "var(--bg-surface-2)" : "transparent",
                                fontSize: 13,
                                fontWeight: active ? 500 : 400,
                                cursor: "pointer",
                                position: "relative",
                                transition: "background-color 0.15s, color 0.15s",
                            }}
                        >
                            {active && <span style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"#5569FF" }}/>}
                            <Icon name={n.icon} size={16} style={{ color: active ? "#5569FF" : "var(--icon-default)" }}/>
                            <span>{n.label}</span>
                        </a>
                    );
                })}
            </nav>

            <div style={{
                borderTop: "1px solid var(--border-subtle)",
                marginTop: "auto",
                padding: "10px 0",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
            }}>
                <span style={{ width: 30, height: 30, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--icon-default)", cursor: "pointer" }}><Icon name="settings" size={16}/></span>
                <span style={{ width: 30, height: 30, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--icon-default)", cursor: "pointer" }}><Icon name="circle-help" size={16}/></span>
            </div>
        </aside>
    );
}

window.AdminSidebar = AdminSidebar;
