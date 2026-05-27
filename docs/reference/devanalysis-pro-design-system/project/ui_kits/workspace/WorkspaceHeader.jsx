// WorkspaceHeader.jsx — global brand-purple header.
//
// Lockup: code-bracket mark (white-tinted square + < /> icon) + wordmark.
// Tracks the brand spec; mirrors assets/Logo.jsx.

function Logo({ inverse = true }) {
    const fg     = inverse ? "#fff" : "var(--text-primary)";
    const proFg  = inverse ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
    const markBg = inverse ? "rgba(255,255,255,0.18)" : "rgba(85,105,255,0.12)";
    const markFg = inverse ? "#fff" : "#5569FF";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            userSelect: "none", cursor: "pointer",
            fontFamily: "var(--font-sans)",
            fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em",
            color: fg,
        }}>
            <span style={{
                width: 30, height: 30, borderRadius: 7,
                background: markBg, color: markFg,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
            }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="8 6 3 12 8 18"/>
                    <polyline points="16 6 21 12 16 18"/>
                </svg>
            </span>
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
                <span>DevAnalysis</span>
                <span style={{ fontWeight: 500, color: proFg }}>Pro</span>
            </span>
        </span>
    );
}

function HeaderTab({ active, onClick, children }) {
    return (
        <span
            onClick={onClick}
            style={{
                padding: "8px 14px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                color: active ? "#fff" : "rgba(255,255,255,0.72)",
                background: active ? "rgba(255,255,255,0.16)" : "transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
        >{children}</span>
    );
}

function HeaderIconBtn({ children, onClick, hasDot, active }) {
    return (
        <span
            onClick={onClick}
            style={{
                width: 32, height: 32,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                borderRadius: 6,
                color: active ? "#fff" : "rgba(255,255,255,0.85)",
                background: active ? "rgba(255,255,255,0.16)" : "transparent",
                cursor: "pointer",
                position: "relative",
                transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
        >
            {children}
            {hasDot && (
                <span style={{
                    position: "absolute", top: 6, right: 7,
                    width: 7, height: 7, borderRadius: 9999, background: "#ff5252",
                }}/>
            )}
        </span>
    );
}

function WorkspaceHeader({
    tab, onTabChange,
    isDark, onToggleTheme,
    section = "workspace", // "workspace" | "admin"
}) {
    const workspaceTabs = ["My Projects", "Project Groups", "Admin", "Help"];
    const [narrow, setNarrow] = React.useState(typeof window !== "undefined" && window.innerWidth < 768);
    React.useEffect(() => {
        const onResize = () => setNarrow(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <header style={{
            position: "sticky", top: 0, zIndex: 50,
            height: 60,
            background: "#5569FFF2",
            backdropFilter: "blur(20px)",
            color: "#fff",
            display: "flex", alignItems: "center",
            paddingLeft: narrow ? 12 : 24, paddingRight: narrow ? 12 : 24,
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {narrow && (
                    <HeaderIconBtn>
                        <Icon name="menu" size={18}/>
                    </HeaderIconBtn>
                )}
                <Logo />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {!narrow && workspaceTabs.map((t) => (
                    <HeaderTab
                        key={t}
                        active={tab === t}
                        onClick={() => onTabChange?.(t)}
                    >{t}</HeaderTab>
                ))}
                {!narrow && <span style={{ width: 1, height: 22, background: "rgba(255,255,255,0.18)", margin: "0 6px" }}/>}
                {!narrow && <HeaderIconBtn><Icon name="search" size={18}/></HeaderIconBtn>}
                <HeaderIconBtn hasDot><Icon name="bell" size={18}/></HeaderIconBtn>
                {!narrow && <HeaderIconBtn><Icon name="fullscreen" size={18}/></HeaderIconBtn>}
                {!narrow && (
                    <span
                        onClick={onToggleTheme}
                        style={{
                            position: "relative",
                            width: 44, height: 22, borderRadius: 9999,
                            background: isDark ? "#fff" : "rgba(255,255,255,0.22)",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                            margin: "0 4px",
                        }}
                    >
                        <span style={{
                            position: "absolute", top: 2,
                            left: isDark ? 24 : 2,
                            width: 18, height: 18,
                            borderRadius: 9999,
                            background: isDark ? "#5569FF" : "#fff",
                            transition: "left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Icon name={isDark ? "moon" : "sun"} size={11} style={{ color: isDark ? "#fff" : "#5569FF" }}/>
                        </span>
                    </span>
                )}
                <span style={{
                    width: 30, height: 30, borderRadius: 9999,
                    background: "linear-gradient(135deg, #cbd5e1, #475569)",
                    border: "2px solid rgba(255,255,255,0.4)",
                    marginLeft: 4,
                    cursor: "pointer",
                }}/>
            </div>
        </header>
    );
}

window.WorkspaceHeader = WorkspaceHeader;
window.Logo = Logo;
