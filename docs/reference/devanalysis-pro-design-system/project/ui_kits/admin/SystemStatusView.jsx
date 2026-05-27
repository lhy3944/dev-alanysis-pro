// SystemStatusView.jsx — per admin_system_status.png

function StatusStat({ icon, title, value, foot, footColor = "var(--text-muted)" }) {
    return (
        <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            padding: "14px 16px",
            display: "flex", flexDirection: "column", gap: 8,
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                    textTransform: "uppercase", color: "var(--text-muted)",
                }}>{title}</span>
                <Icon name={icon} size={14} style={{ color: "var(--icon-default)" }}/>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>{value}</div>
            <div style={{ fontSize: 11, color: footColor }}>{foot}</div>
        </div>
    );
}

function AnalyzingProjectRow({ name, start, progress, status }) {
    const statusMap = {
        RUNNING:   { c: "#10b981", label: "RUNNING" },
        FINISHING: { c: "#0e7490", label: "FINISHING" },
        QUEUED:    { c: "#64748b", label: "QUEUED" },
    };
    const s = statusMap[status] || statusMap.RUNNING;
    return (
        <tr style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <td style={{ padding: "11px 12px", fontSize: 13, color: "#5569FF", fontWeight: 500 }}>{name}</td>
            <td style={{ padding: "11px 12px", fontSize: 12, color: "var(--text-muted)" }}>{start}</td>
            <td style={{ padding: "11px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: "var(--bg-secondary)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: progress + "%", height: "100%", background: "#5569FF" }}/>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-secondary)", width: 36, textAlign: "right" }}>{progress}%</span>
                </div>
            </td>
            <td style={{ padding: "11px 12px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: s.c }}>
                    <span style={{ width: 6, height: 6, borderRadius: 9999, background: s.c }}/>{s.label}
                </span>
            </td>
        </tr>
    );
}

function LogRow({ ts, level, module, message }) {
    return (
        <tr style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <td style={{ padding: "11px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{ts}</td>
            <td style={{ padding: "11px 12px" }}><LogPill level={level}/></td>
            <td style={{ padding: "11px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-primary)", fontWeight: 600, whiteSpace: "nowrap" }}>{module}</td>
            <td style={{ padding: "11px 12px", fontSize: 12, color: "var(--text-secondary)" }}>{message}</td>
        </tr>
    );
}

function SystemStatusView() {
    return (
        <div style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>System Monitoring</h1>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>Real-time status of analysis clusters and system logs.</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={{
                        height: 34, padding: "0 14px",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-primary)",
                        borderRadius: 6, fontSize: 13, fontWeight: 500,
                        display: "inline-flex", alignItems: "center", gap: 6,
                        cursor: "pointer", color: "var(--text-primary)",
                    }}><Icon name="download" size={14}/>Export Logs</button>
                    <button style={{
                        height: 34, padding: "0 14px",
                        background: "#5569FF", color: "#fff",
                        border: 0, borderRadius: 6, fontSize: 13, fontWeight: 500,
                        display: "inline-flex", alignItems: "center", gap: 6,
                        cursor: "pointer",
                    }}><Icon name="refresh-cw" size={14}/>Force Refresh</button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
                <StatusStat icon="bar-chart-3" title="CPU Usage"       value="42.8%"   foot="↓ 2.4% vs last hour"/>
                <StatusStat icon="users"       title="Active Workers"  value="18 / 24" foot="75% capacity utilized"/>
                <StatusStat icon="clock"       title="Avg Latency"     value="124ms"   foot="↑ 12ms vs normal" footColor="#dc2626"/>
                <StatusStat icon="activity"    title="Data Throughput" value="1.2 GB/s" foot="Stable flow detected" footColor="#10b981"/>
            </div>

            <SectionCard
                title="Currently Analyzing Projects" icon="package" iconColor="#5569FF"
                rightAction="8 Active" rightActionColor="#a855f7"
                bodyPad={0}
                style={{ marginBottom: 18 }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ background: "var(--bg-secondary)" }}>
                        {["PROJECT NAME","START TIME","PROGRESS","STATUS"].map(h => (
                            <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        <AnalyzingProjectRow name="Quantum-Flux Dynamics"  start="2023-10-24 09:12:05" progress={78} status="RUNNING"/>
                        <AnalyzingProjectRow name="Deep Learning Set B"    start="2023-10-24 10:45:30" progress={34} status="RUNNING"/>
                        <AnalyzingProjectRow name="Neural Mesh Alpha"      start="2023-10-24 11:20:12" progress={92} status="FINISHING"/>
                        <AnalyzingProjectRow name="Bio-Signal Correlation" start="2023-10-24 11:55:00" progress={5}  status="QUEUED"/>
                    </tbody>
                </table>
            </SectionCard>

            <div style={{
                background: "var(--bg-primary)",
                border: "1px solid #fecaca",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 18,
            }}>
                <div style={{
                    padding: "12px 16px",
                    background: "#fee2e2",
                    borderBottom: "1px solid #fecaca",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b91c1c", fontSize: 13, fontWeight: 600 }}>
                        <Icon name="alert-triangle" size={16}/>System Error Log
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--text-muted)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                            All Levels <Icon name="chevron-down" size={12}/>
                        </span>
                        <span style={{ color: "#dc2626", cursor: "pointer", fontWeight: 500 }}>Clear Logs</span>
                    </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ background: "var(--bg-secondary)" }}>
                        {["TIMESTAMP","LEVEL","MODULE","MESSAGE"].map(h => (
                            <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        <LogRow ts="2023-10-24 12:01:44.201" level="CRITICAL" module="Cluster-Core-3" message="Unexpected segmentation fault in memory block 0x4F2A. Automatic restart initiated."/>
                        <LogRow ts="2023-10-24 11:58:12.055" level="WARNING"  module="API-Gateway"    message="High latency detected for endpoint /analyze/v2. Throttling active users."/>
                        <LogRow ts="2023-10-24 11:55:01.890" level="ERROR"    module="Auth-Service"   message="Database connection timeout. Retrying in 500ms... Attempt 3/5."/>
                        <LogRow ts="2023-10-24 11:42:33.112" level="WARNING"  module="Worker-Pool"    message="Resource allocation threshold exceeded. Scaled to secondary node Group-B."/>
                    </tbody>
                </table>
                <div style={{
                    padding: "10px",
                    borderTop: "1px solid var(--border-subtle)",
                    textAlign: "center", fontSize: 12, color: "#5569FF",
                    fontWeight: 500, cursor: "pointer",
                }}>View Full History →</div>
            </div>

            <div style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--text-muted)",
            }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>System Health</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#10b981", fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 9999, background: "#10b981" }}/>99.9% Uptime
                </span>
                <div style={{ flex: 1, height: 4, background: "var(--bg-secondary)", borderRadius: 2, marginLeft: 8, overflow: "hidden" }}>
                    <div style={{ width: "99.9%", height: "100%", background: "#10b981" }}/>
                </div>
            </div>
        </div>
    );
}

window.SystemStatusView = SystemStatusView;
