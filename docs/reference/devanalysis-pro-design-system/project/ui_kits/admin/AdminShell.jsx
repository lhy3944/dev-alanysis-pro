// AdminShell.jsx — composes Header + AdminSidebar + view. Sidebar attaches
// directly under the header; no intermediate tab/title strip.

function AdminShell() {
    const [view, setView]   = React.useState("system-status");
    const [tab, setTab]     = React.useState("Admin");
    const [collapsed, setC] = React.useState(false);
    const [isDark, setDark] = React.useState(false);

    React.useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    return (
        <div style={{
            display: "flex", flexDirection: "column",
            height: "100vh",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
        }}>
            <WorkspaceHeader
                tab={tab} onTabChange={setTab}
                isDark={isDark} onToggleTheme={() => setDark(!isDark)}
                section="admin"
            />
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <AdminSidebar
                    view={view}
                    onViewChange={setView}
                    collapsed={collapsed}
                    onToggle={() => setC(!collapsed)}
                />
                <main style={{ flex: 1, overflow: "auto", background: "var(--bg-secondary)" }}>
                    {view === "usage-overview"  && <UsageOverviewView/>}
                    {view === "system-status"   && <SystemStatusView/>}
                    {view === "user-management" && <UserManagementView/>}
                </main>
            </div>
        </div>
    );
}

window.AdminShell = AdminShell;
