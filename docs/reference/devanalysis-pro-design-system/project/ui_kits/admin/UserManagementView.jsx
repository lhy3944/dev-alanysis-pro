// UserManagementView.jsx — per admin_user_management.png

function UserRow({ initials, name, email, role, joinedDate }) {
    return (
        <tr style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <td style={{ padding: "14px 16px", width: 200 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={initials} size={28}/>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{name}</span>
                </span>
            </td>
            <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{email}</td>
            <td style={{ padding: "14px 16px" }}>
                <RolePill role={role}/>
            </td>
            <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)" }}>{joinedDate}</td>
            <td style={{ padding: "14px 16px", textAlign: "right" }}>
                <span style={{
                    width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: "var(--icon-default)", borderRadius: 6, cursor: "pointer",
                }}><Icon name="more-horizontal" size={14}/></span>
            </td>
        </tr>
    );
}

function UserManagementView() {
    return (
        <div style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>User Management</h1>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>Manage administrator access levels and system permissions.</p>
                </div>
                <button style={{
                    height: 36, padding: "0 14px",
                    background: "#5569FF", color: "#fff",
                    border: 0, borderRadius: 6, fontSize: 13, fontWeight: 500,
                    display: "inline-flex", alignItems: "center", gap: 6,
                    cursor: "pointer",
                }}><Icon name="plus" size={14}/>Add Admin</button>
            </div>

            <Card style={{ padding: 0 }}>
                <div style={{
                    padding: 14,
                    borderBottom: "1px solid var(--border-subtle)",
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <Icon name="search" size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }}/>
                        <input
                            placeholder="Search by name or email..."
                            style={{
                                width: "100%", height: 38, padding: "0 12px 0 34px", fontSize: 13,
                                background: "var(--bg-primary)",
                                border: "1px solid var(--border-primary)", borderRadius: 6,
                                outline: "none", fontFamily: "inherit",
                                boxSizing: "border-box",
                                color: "var(--text-primary)",
                            }}
                        />
                    </div>
                    <button style={{
                        width: 38, height: 38,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--icon-default)",
                        borderRadius: 6, cursor: "pointer",
                    }}><Icon name="layout-dashboard" size={16}/></button>
                    <button style={{
                        width: 38, height: 38,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--icon-default)",
                        borderRadius: 6, cursor: "pointer",
                    }}><Icon name="download" size={16}/></button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ background: "var(--bg-secondary)" }}>
                        {["NAME","EMAIL","ROLE","JOINED DATE","ACTIONS"].map(h => (
                            <th key={h} style={{ padding: "10px 16px", textAlign: h === "ACTIONS" ? "right" : "left", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        <UserRow initials="JD" name="Jane Doe"       email="jane.doe@analysisplatform.com"    role="Super Admin"      joinedDate="Oct 12, 2023"/>
                        <UserRow initials="MK" name="Marcus Knight"  email="m.knight@analysisplatform.com"     role="Data Analyst"     joinedDate="Nov 05, 2023"/>
                        <UserRow initials="SL" name="Sarah Lin"      email="sarah.l@analysisplatform.com"      role="Security Officer" joinedDate="Jan 18, 2024"/>
                        <UserRow initials="RT" name="Robert Taggart" email="rtaggart@analysisplatform.com"     role="Auditor"          joinedDate="Feb 22, 2024"/>
                    </tbody>
                </table>

                <div style={{
                    padding: "12px 16px",
                    borderTop: "1px solid var(--border-subtle)",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontSize: 12, color: "var(--text-muted)",
                }}>
                    <span>Showing 1 to 4 of 124 admins</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-subtle)", borderRadius: 4, cursor: "pointer" }}><Icon name="chevron-left" size={12}/></span>
                        {[1,2,3].map(n => (
                            <span key={n} style={{
                                width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                border: "1px solid var(--border-subtle)", borderRadius: 4,
                                background: n === 1 ? "#5569FF" : "var(--bg-primary)",
                                color: n === 1 ? "#fff" : "var(--text-primary)",
                                fontWeight: n === 1 ? 600 : 400,
                                fontSize: 12, cursor: "pointer",
                            }}>{n}</span>
                        ))}
                        <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-subtle)", borderRadius: 4, cursor: "pointer" }}><Icon name="chevron-right" size={12}/></span>
                    </span>
                </div>
            </Card>
        </div>
    );
}

window.UserManagementView = UserManagementView;
