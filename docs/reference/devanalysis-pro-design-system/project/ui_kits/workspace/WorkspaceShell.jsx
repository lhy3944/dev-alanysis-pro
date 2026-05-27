// WorkspaceShell.jsx — composes Header + Sidebar + view.

function WorkspaceShell() {
    const [view, setView]               = React.useState("dashboard");
    const [tab, setTab]                 = React.useState("Project Groups");
    const [sidebarCollapsed, setSC]     = React.useState(false);
    const [isDark, setIsDark]           = React.useState(false);

    React.useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    const project = { name: "Chiller-Turbo-Gen2-Main", branch: "MAIN BRANCH" };

    // Tab → which workspace surface to render
    const showWorkspaceShell = ["Project Groups", "My Projects", "Help"].indexOf(tab) === -1 || tab === "My Projects";

    let body;
    if (tab === "Project Groups") {
        body = <ProjectGroupsView/>;
    } else if (tab === "Admin") {
        body = (
            <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
                <Icon name="shield" size={48} style={{ color: "var(--icon-default)", marginBottom: 14 }}/>
                <p>Admin console lives in <code>ui_kits/admin/index.html</code>.</p>
            </div>
        );
    } else if (tab === "Help") {
        body = (
            <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
                <Icon name="circle-help" size={48} style={{ color: "var(--icon-default)", marginBottom: 14 }}/>
                <p>Help center — not part of this kit.</p>
            </div>
        );
    } else {
        // My Projects / default → workspace
        body = (
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <WorkspaceSidebar
                    view={view}
                    onViewChange={setView}
                    project={project}
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSC(!sidebarCollapsed)}
                />
                <main style={{ flex: 1, overflow: "auto", background: "var(--bg-primary)" }}>
                    {view === "dashboard"      && <DashboardView/>}
                    {view === "commit-history" && <CommitHistoryView/>}
                    {view === "settings"       && <SettingsView/>}
                    {(view === "code-impact" || view === "requirement" || view === "unit-test" || view === "system-test") && (
                        <PlaceholderView title={
                            view === "code-impact" ? "Code Impact Analysis" :
                            view === "requirement" ? "Requirement" :
                            view === "unit-test" ? "Unit Test" : "System Test"
                        }/>
                    )}
                </main>
            </div>
        );
    }

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
                isDark={isDark} onToggleTheme={() => setIsDark(!isDark)}
            />
            {body}
        </div>
    );
}

function PlaceholderView({ title }) {
    return (
        <div style={{ padding: "60px 28px", maxWidth: 800, margin: "0 auto" }}>
            <div style={{
                fontSize: 12, fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "#5569FF", marginBottom: 4,
            }}>Agent View</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{title}</h1>
            <p style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
                commit id 나 revision id 단위로 {title} Agent에서 분석한 전체 결과를 확인할 수 있다.
            </p>
            <div style={{
                marginTop: 24,
                padding: 28,
                border: "1px dashed var(--border-primary)",
                borderRadius: 8,
                background: "var(--bg-secondary)",
                color: "var(--text-muted)",
                fontSize: 13, textAlign: "center",
            }}>
                Agent result pane — implemented in production code under <code>(main)/(project)/projects/[id]/{title.toLowerCase().replace(/ /g, "-")}/page.tsx</code>.
            </div>
        </div>
    );
}

window.WorkspaceShell = WorkspaceShell;
