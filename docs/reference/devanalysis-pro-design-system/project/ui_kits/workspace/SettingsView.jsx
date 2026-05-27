// SettingsView.jsx — Documentation Paths config form. Per workspace_settings.png

const DOC_FIELDS = [
    { id: "prd", label: "Product Requirements Document (PRD)", icon: "file-text", iconColor: "#5569FF", path: "/docs/prd/v2.1_main.pdf" },
    { id: "srs", label: "Software Requirements Specification (SRS)", icon: "file-text", iconColor: "#5569FF", path: "/engineering/specs/chiller_v10.md" },
    { id: "fbs", label: "Feature Breakdown Structure (FBS)", icon: "git-branch", iconColor: "#d97706", path: "/arch/fbs/logic_blocks.xml" },
    { id: "ui",  label: "UI Scenario", icon: "package", iconColor: "#5569FF", path: "/design/scenarios/user_flows.fig" },
    { id: "tc",  label: "Test Case (TC)", icon: "check-circle-2", iconColor: "#5569FF", path: "/tests/cases/unit_test_v2.xlsx" },
];

function PathField({ field }) {
    return (
        <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            padding: 14,
            marginBottom: 12,
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: `${field.iconColor}1a`, color: field.iconColor,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <Icon name={field.icon} size={14}/>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{field.label}</span>
                </div>
                <span style={{
                    fontSize: 11, color: "#5569FF",
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 600,
                }}>
                    <Icon name="plus" size={11}/>Add Path
                </span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                    defaultValue={field.path}
                    style={{
                        flex: 1, height: 34, padding: "0 12px", fontSize: 12,
                        fontFamily: "var(--font-mono)",
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-primary)", borderRadius: 6,
                        outline: "none", color: "var(--text-primary)",
                    }}
                />
                <button style={{
                    width: 34, height: 34,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--icon-default)",
                    borderRadius: 6, cursor: "pointer",
                }}>
                    <Icon name="trash-2" size={14}/>
                </button>
            </div>
        </div>
    );
}

function SettingsView() {
    return (
        <div style={{ padding: "24px 28px", maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Documentation Paths</h1>
            <p style={{ margin: "4px 0 24px", fontSize: 13, color: "var(--text-muted)" }}>Configure absolute or relative system paths for project documentation modules.</p>
            {DOC_FIELDS.map((f) => <PathField key={f.id} field={f}/>)}
        </div>
    );
}

window.SettingsView = SettingsView;
