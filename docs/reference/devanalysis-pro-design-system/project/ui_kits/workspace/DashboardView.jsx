// DashboardView.jsx — workspace dashboard. Recreates the workspace_dashboard.png mockup
// using the codebase token/component vocabulary.

function ModuleNode({ x, y, label, sub, fill = "var(--bg-primary)", color = "var(--text-primary)", border = "var(--border-strong)", w = 130, h = 56 }) {
    return (
        <g transform={`translate(${x}, ${y})`}>
            <rect x={-w/2} y={-h/2} width={w} height={h} rx={6} fill={fill} stroke={border} strokeWidth={1.2}/>
            <text x={0} y={-3} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={13} fontWeight={600} fill={color}>{label}</text>
            {sub && <text x={0} y={14} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fontWeight={600} fill="var(--text-muted)" letterSpacing="0.06em">{sub}</text>}
        </g>
    );
}

function ModuleTopology() {
    return (
        <svg viewBox="0 0 480 280" width="100%" style={{ display: "block" }}>
            <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted)" />
                </marker>
            </defs>
            {/* edges */}
            <line x1="125" y1="80" x2="225" y2="130" stroke="var(--border-strong)" strokeDasharray="4 4" markerEnd="url(#arr)"/>
            <line x1="125" y1="210" x2="225" y2="155" stroke="var(--border-strong)" strokeDasharray="4 4" markerEnd="url(#arr)"/>
            <line x1="290" y1="140" x2="370" y2="140" stroke="var(--border-strong)" strokeDasharray="4 4" markerEnd="url(#arr)"/>
            <ModuleNode x={120} y={80}  label="API_Gateway"  sub=""/>
            <ModuleNode x={120} y={210} label="User_Profile" sub=""/>
            <ModuleNode x={258} y={140} label="Core_Auth"    sub="SOURCE" fill="#dbeafe" border="#3b82f6" color="#1d4ed8"/>
            <ModuleNode x={400} y={140} label="Audit_Log"    sub="AFFECTED" fill="#fee2e2" border="#dc2626" color="#b91c1c"/>
        </svg>
    );
}

function FindingItem({ icon, iconColor, title, body, tags }) {
    return (
        <div style={{ padding: "12px 0", borderBottom: "1px dashed var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Icon name={icon} size={16} style={{ color: iconColor, marginTop: 2 }}/>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45, marginBottom: 6 }}>{body}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {tags.map((t, i) => (
                            <span key={i} style={{
                                display: "inline-flex",
                                padding: "2px 8px",
                                borderRadius: 4,
                                fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                                background: t.bg, color: t.fg,
                            }}>{t.label}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBar({ label, percent, color, foot }) {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: color || "var(--text-primary)" }}>{percent}</span>
            </div>
            <div style={{ height: 4, background: "var(--bg-secondary)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: percent, height: "100%", background: color || "var(--text-primary)" }}/>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>{foot}</div>
        </div>
    );
}

function DashboardView() {
    return (
        <div style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto" }}>
            {/* Page header */}
            <div style={{
                paddingBottom: 22, marginBottom: 22,
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16,
            }}>
                <div>
                    <div style={{
                        fontSize: 12, fontWeight: 700, letterSpacing: "0.16em",
                        textTransform: "uppercase", color: "#5569FF",
                        display: "inline-flex", alignItems: "center", gap: 6,
                    }}>
                        <Icon name="check-circle-2" size={14}/>
                        Analysis Complete
                    </div>
                    <h1 style={{
                        margin: "6px 0 4px",
                        fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em",
                        color: "var(--text-primary)",
                    }}>변경 영향 분석 결과</h1>
                    <p style={{
                        margin: 0, fontSize: 13, color: "var(--text-muted)",
                    }}>최종 업데이트: 2023.11.24 14:30 (Branch: feature/auth-refactor)</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={{
                        height: 36, padding: "0 14px",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-primary)",
                        borderRadius: 6, fontSize: 13, fontWeight: 500,
                        display: "inline-flex", alignItems: "center", gap: 6,
                        cursor: "pointer", color: "var(--text-primary)",
                        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.04)",
                    }}><Icon name="download" size={14}/>Export Markdown</button>
                    <button style={{
                        height: 36, padding: "0 14px",
                        background: "#000", color: "#fff",
                        border: 0, borderRadius: 6, fontSize: 13, fontWeight: 500,
                        display: "inline-flex", alignItems: "center", gap: 6,
                        cursor: "pointer",
                    }}><Icon name="share-2" size={14}/>Share Report</button>
                </div>
            </div>

            {/* Revision selector + key cards */}
            <div style={{ marginBottom: 18 }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    height: 36, padding: "0 12px",
                    background: "var(--bg-primary)", border: "1px solid var(--border-primary)", borderRadius: 6,
                    fontSize: 13, color: "var(--text-primary)", minWidth: 340,
                    justifyContent: "space-between",
                }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "var(--font-mono)" }}>9f6ed7b</span>
                        <span style={{ color: "var(--text-muted)" }}>—</span>
                        <span>Merge branch 'filtering-vali...'</span>
                    </span>
                    <Icon name="chevron-down" size={14} style={{ color: "var(--icon-default)" }}/>
                </div>
            </div>

            {/* Two-col: Module Topology · Findings */}
            <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: 16, marginBottom: 18 }}>
                <SectionCard
                    title="영향받는 모듈 관계도 (Module Topology)"
                    icon="git-branch"
                    iconColor="#5569FF"
                    rightAction="Critical Path"
                    rightActionColor="#dc2626"
                    bodyPad={16}
                >
                    <ModuleTopology/>
                </SectionCard>

                <SectionCard
                    title="검증 필요 항목 (12건)"
                    icon="alert-circle"
                    iconColor="#dc2626"
                    rightAction="모두 보기"
                    bodyPad={4}
                >
                    <div style={{ padding: "0 12px" }}>
                        <FindingItem
                            icon="alert-circle" iconColor="#dc2626"
                            title="토큰 만료 로직 예외 처리"
                            body="JWT 리프레시 토큰 처리 과정에서 레이스 컨디션 발생 가능성 검증 필요"
                            tags={[
                                { label: "P1 HIGH", bg: "#fee2e2", fg: "#b91c1c" },
                                { label: "Auth Server", bg: "var(--bg-secondary)", fg: "var(--text-secondary)" },
                            ]}
                        />
                        <FindingItem
                            icon="alert-triangle" iconColor="#f59e0b"
                            title="DB 커넥션 풀 누수 검사"
                            body="사용자 프로필 업데이트 모듈의 비동기 호출 시 커넥션 릴리즈 확인"
                            tags={[
                                { label: "P2 MED", bg: "#fef3c7", fg: "#b45309" },
                                { label: "Database", bg: "var(--bg-secondary)", fg: "var(--text-secondary)" },
                            ]}
                        />
                        <FindingItem
                            icon="lightbulb" iconColor="#5569FF"
                            title="입력 데이터 밸리데이션"
                            body="특수문자 필터링 우회 가능성 검증 (Regex 패턴 점검)"
                            tags={[
                                { label: "P3 LOW", bg: "#dbeafe", fg: "#1d4ed8" },
                                { label: "Security", bg: "var(--bg-secondary)", fg: "var(--text-secondary)" },
                            ]}
                        />
                    </div>
                </SectionCard>
            </div>

            {/* Associated Requirements */}
            <SectionCard
                title="연관 요구사항 (Associated Requirements)"
                icon="file-text"
                iconColor="#5569FF"
                bodyPad={16}
                style={{ marginBottom: 18 }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                    {[
                        { label: "PRM", color: "#5569FF", items: [["PRM-101", "User Authentication Enhancements"], ["PRM-084", "Audit Logging Architecture"]] },
                        { label: "FEATURE", color: "#10b981", items: [["FEAT-202", "JWT Refresh Token Logic"], ["FEAT-115", "Distributed Session Store"]] },
                        { label: "SRS", color: "#9333ea", items: [["SRS-303", "Security Validation Rules"], ["SRS-102", "Error Handling Patterns"]] },
                    ].map((col, i) => (
                        <div key={i}>
                            <div style={{
                                fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
                                color: col.color, textTransform: "uppercase", marginBottom: 10,
                                borderLeft: `2px solid ${col.color}`, paddingLeft: 8,
                            }}>{col.label}</div>
                            {col.items.map(([id, title]) => (
                                <div key={id} style={{ marginBottom: 10 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: col.color, fontFamily: "var(--font-mono)" }}>{id}</div>
                                    <div style={{ fontSize: 13, color: "var(--text-primary)" }}>{title}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* AI Review Summary */}
            <SectionCard
                title="AI 코드 리뷰 결과 요약"
                icon="activity"
                iconColor="#5569FF"
                bodyPad={18}
                style={{ marginBottom: 18 }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 14 }}>
                    <StatBar label="성능 적합성" percent="85%" color="#3b82f6"  foot="응답 지연율 3건 개선됨"/>
                    <StatBar label="코드 가독성" percent="92%" color="#10b981"  foot="명명 규칙 우수"/>
                    <StatBar label="보안 취약점" percent="2 Issues" color="#dc2626"  foot="CSRF 방어 보강 권장"/>
                    <StatBar label="테스트 커버리지" percent="78%" color="#a855f7"  foot="의존성 주입 패턴 적용 필요"/>
                </div>
                <div style={{
                    padding: "12px 14px",
                    background: "#dbeafe33",
                    border: "1px dashed #5569FF66",
                    borderRadius: 6,
                    fontSize: 13, color: "var(--text-secondary)",
                    display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                    <Icon name="lightbulb" size={16} style={{ color: "#5569FF", marginTop: 2 }}/>
                    <span>"현재 변경사항은 인증 모듈의 결합도를 12% 증가시켰습니다. <code style={{ fontFamily: "var(--font-mono)", color: "#5569FF" }}>auth.service.ts</code> 의 인터페이스를 분리하여 의존성을 완화할 것을 권장합니다."</span>
                </div>
            </SectionCard>

            {/* Test results */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <SectionCard
                    title="관련 Unit Test 목록 (8건)"
                    icon="check-circle-2"
                    iconColor="#10b981"
                    rightAction="Coverage 88%"
                    rightActionColor="#10b981"
                    bodyPad={0}
                >
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead><tr style={{ background: "var(--bg-secondary)" }}>
                            {["TEST CASE NAME", "STATUS", "DURATION"].map(h => (
                                <th key={h} style={{ padding: "9px 14px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: 10, letterSpacing: "0.06em" }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {[
                                ["AuthService.validateToken()",  "PASSED",  "12ms", "#10b981"],
                                ["AuthService.generateKey()",    "PASSED",  "8ms",  "#10b981"],
                                ["AuthService.expiredToken()",   "FAILED",  "15ms", "#dc2626"],
                                ["SessionHandler.init()",        "SKIPPED", "—",    "#94a3b8"],
                            ].map(([n,s,d,c]) => (
                                <tr key={n} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                                    <td style={{ padding: "11px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: c === "#dc2626" ? "#dc2626" : "var(--text-primary)" }}>{n}</td>
                                    <td style={{ padding: "11px 14px" }}>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: c }}>
                                            <span style={{ width: 6, height: 6, borderRadius: 9999, background: c }}/>{s}
                                        </span>
                                    </td>
                                    <td style={{ padding: "11px 14px", color: "var(--text-muted)", fontSize: 11 }}>{d}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </SectionCard>

                <SectionCard
                    title="System Test Case 목록 (5건)"
                    icon="flask-conical"
                    iconColor="#9333ea"
                    rightAction="Success Rate 60%"
                    rightActionColor="#10b981"
                    bodyPad={12}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[
                            { id: "TC01", title: "End-to-End User Login Flow", note: "UI-to-Auth-to-DB integration check", ok: true },
                            { id: "TC02", title: "Multi-Factor Auth Bypass Attempt", note: "Security robustness system test", ok: true },
                            { id: "TC03", title: "Session Persistence on Network Loss", note: "Failed at reconnection hook", ok: false },
                        ].map((tc) => (
                            <div key={tc.id} style={{
                                padding: "11px 12px",
                                background: tc.ok ? "var(--bg-primary)" : "#fee2e2",
                                border: `1px solid ${tc.ok ? "var(--border-subtle)" : "#fca5a5"}`,
                                borderRadius: 6,
                                display: "flex", alignItems: "center", gap: 10,
                            }}>
                                <span style={{
                                    padding: "3px 6px", borderRadius: 4,
                                    background: tc.ok ? "#1e293b" : "#dc2626",
                                    color: "#fff", fontFamily: "var(--font-mono)",
                                    fontSize: 10, fontWeight: 700,
                                }}>{tc.id}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{tc.title}</div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{tc.note}</div>
                                </div>
                                <Icon
                                    name={tc.ok ? "check-circle-2" : "x-circle"}
                                    size={18}
                                    style={{ color: tc.ok ? "#10b981" : "#dc2626" }}
                                />
                            </div>
                        ))}
                        <div style={{ padding: "10px", textAlign: "center", fontSize: 12, color: "#5569FF", fontWeight: 500, cursor: "pointer" }}>
                            전체 테스트 리포트 보기 →
                        </div>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}

window.DashboardView = DashboardView;
