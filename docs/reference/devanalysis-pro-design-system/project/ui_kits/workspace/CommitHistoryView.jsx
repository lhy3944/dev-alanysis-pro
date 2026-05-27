// CommitHistoryView.jsx — table of commits + side KPIs. Per workspace_commithistory.png

function CommitRow({ checked, hash, author, date, message, status, statusColor, action }) {
    return (
        <tr style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <td style={{ padding: "12px 12px", width: 32 }}>
                <input type="checkbox" defaultChecked={checked} style={{ accentColor: "#5569FF" }}/>
            </td>
            <td style={{ padding: "12px 12px" }}>
                <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    background: "var(--bg-secondary)", padding: "2px 7px",
                    borderRadius: 4, color: "var(--text-primary)",
                }}>{hash}</span>
            </td>
            <td style={{ padding: "12px 12px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <Avatar initials={author.slice(0,1)} size={22}/>
                    <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{author}</span>
                </span>
            </td>
            <td style={{ padding: "12px 12px", fontSize: 12, color: "var(--text-muted)" }}>{date}</td>
            <td style={{ padding: "12px 12px", fontSize: 13, color: "var(--text-secondary)", maxWidth: 320 }}>{message}</td>
            <td style={{ padding: "12px 12px" }}>
                <StatusPill status={statusColor} label={status}/>
            </td>
            <td style={{ padding: "12px 12px" }}>
                <button style={{
                    height: 28, padding: "0 10px",
                    background: action === "View Result" ? "#5569FF" : "var(--bg-secondary)",
                    color: action === "View Result" ? "#fff" : "var(--text-secondary)",
                    border: action === "View Result" ? 0 : "1px solid var(--border-subtle)",
                    borderRadius: 4, fontSize: 11, fontWeight: 500,
                    display: "inline-flex", alignItems: "center", gap: 4,
                    cursor: "pointer",
                    fontStyle: action === "Analyzing" ? "italic" : "normal",
                }}>
                    {action === "Analyzing" && <Icon name="refresh-cw" size={11}/>}
                    {action}
                </button>
            </td>
        </tr>
    );
}

function CommitHistoryView() {
    return (
        <div style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Commit History</h1>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>변경점을 확인하고 분석할 커밋을 선택하십시오.</p>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                        <Icon name="search" size={14} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-muted)" }}/>
                        <input
                            placeholder="커밋 검색..."
                            style={{
                                height: 34, padding: "0 12px 0 32px",
                                width: 220, fontSize: 13,
                                background: "var(--bg-primary)",
                                border: "1px solid var(--border-primary)", borderRadius: 6,
                                outline: "none", fontFamily: "inherit",
                                color: "var(--text-primary)",
                            }}
                        />
                    </div>
                    <button style={{
                        height: 34, padding: "0 14px",
                        background: "#5569FF", color: "#fff",
                        border: 0, borderRadius: 6, fontSize: 13, fontWeight: 500,
                        display: "inline-flex", alignItems: "center", gap: 6,
                        cursor: "pointer",
                    }}>
                        <Icon name="activity" size={14}/>변경점 분석
                    </button>
                </div>
            </div>

            <Card style={{ padding: 0 }}>
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)",
                    background: "var(--bg-primary)",
                }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "var(--text-muted)" }}>
                        <span>Filter by:</span>
                        <select style={{
                            height: 28, padding: "0 8px", fontSize: 12,
                            border: "1px solid var(--border-primary)", borderRadius: 4,
                            background: "var(--bg-primary)", color: "var(--text-primary)",
                            fontFamily: "inherit",
                        }}>
                            <option>All Authors</option><option>Kim Dev</option><option>Lee Engineer</option>
                        </select>
                        <select style={{
                            height: 28, padding: "0 8px", fontSize: 12,
                            border: "1px solid var(--border-primary)", borderRadius: 4,
                            background: "var(--bg-primary)", color: "var(--text-primary)",
                            fontFamily: "inherit",
                        }}>
                            <option>All Dates</option><option>This week</option><option>Last 30 days</option>
                        </select>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Found 128 commits</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "var(--bg-secondary)" }}>
                            {["", "COMMIT HASH", "AUTHOR", "DATE", "MESSAGE", "STATUS", "ANALYSIS STATUS"].map(h => (
                                <th key={h} style={{
                                    padding: "10px 12px", textAlign: "left",
                                    fontSize: 10, fontWeight: 600, color: "var(--text-muted)",
                                    letterSpacing: "0.06em",
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <CommitRow checked={false} hash="a1b2c3d" author="Kim Dev"      date="2023-11-20 14:30" message="feat: 유저 인증 로직 고도화 및 JWT 만료 처리 추가" status="Merged" statusColor="merged" action="View Result"/>
                        <CommitRow checked={false} hash="f5e4d3c" author="Lee Engineer" date="2023-11-20 11:15" message="fix: 대시보드 그래프 렌더링 최적화 (Canvas 기반)" status="Failed Build" statusColor="failed" action="Analyzing"/>
                        <CommitRow checked={true}  hash="9a8b7c6" author="Kim Dev"      date="2023-11-19 17:45" message="docs: README API 엔드포인트 설명 업데이트" status="Pending" statusColor="pending" action="View Result"/>
                    </tbody>
                </table>
                <div style={{
                    padding: "10px 14px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontSize: 12, color: "var(--text-muted)",
                    borderTop: "1px solid var(--border-subtle)",
                }}>
                    <span>Showing 1 to 3 of 128 results</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-subtle)", borderRadius: 4, cursor: "pointer" }}><Icon name="chevron-left" size={12}/></span>
                        {[1,2,3].map(n => (
                            <span key={n} style={{
                                width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                border: "1px solid var(--border-subtle)", borderRadius: 4,
                                background: n === 1 ? "#5569FF" : "var(--bg-primary)",
                                color: n === 1 ? "#fff" : "var(--text-primary)",
                                fontWeight: n === 1 ? 600 : 400,
                                fontSize: 12,
                                cursor: "pointer",
                            }}>{n}</span>
                        ))}
                        <span style={{ padding: "0 4px" }}>…</span>
                        <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-subtle)", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>32</span>
                        <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-subtle)", borderRadius: 4, cursor: "pointer" }}><Icon name="chevron-right" size={12}/></span>
                    </span>
                </div>
            </Card>

            {/* KPI tiles */}
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 14 }}>
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>주간 커밋 빈도</span>
                        <Icon name="trending-up" size={14} style={{ color: "#10b981" }}/>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>42</div>
                    <div style={{ marginTop: 6 }}>
                        <span style={{
                            display: "inline-block", padding: "3px 8px", borderRadius: 4,
                            background: "rgba(85,105,255,0.1)", color: "#5569FF",
                            fontSize: 10, fontWeight: 600,
                        }}>+12% vs last week</span>
                    </div>
                </Card>
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>분석 완료 리포트</span>
                        <Icon name="file-text" size={14} style={{ color: "var(--text-muted)" }}/>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>18</div>
                    <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>Last analyzed 2h ago</div>
                </Card>
                <div/>
            </div>
        </div>
    );
}

window.CommitHistoryView = CommitHistoryView;
