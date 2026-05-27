// UsageOverviewView.jsx — per admin_usage_overview.png

function StatTile({ icon, title, value, unit, delta, deltaKind = "pos", foot }) {
    const deltaPalette = {
        pos:  { bg: "rgba(16,185,129,0.12)", fg: "#047857" },
        neg:  { bg: "rgba(220,38,38,0.10)",  fg: "#b91c1c" },
        flat: { bg: "var(--bg-surface-2)",   fg: "var(--text-muted)" },
    };
    const d = deltaPalette[deltaKind] || deltaPalette.flat;
    return (
        <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            padding: "16px 18px",
            display: "flex", flexDirection: "column", gap: 10,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: "rgba(85,105,255,0.1)", color: "#5569FF",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}><Icon name={icon} size={14}/></span>
                <span style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                    textTransform: "uppercase", color: "var(--text-muted)",
                }}>{title}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                {value}{unit && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)", marginLeft: 4 }}>{unit}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
                {delta && (
                    <span style={{
                        display: "inline-flex", alignItems: "center", gap: 3,
                        padding: "2px 7px", borderRadius: 9999,
                        background: d.bg, color: d.fg,
                        fontSize: 10, fontWeight: 700,
                    }}>{delta}</span>
                )}
                <span>{foot}</span>
            </div>
        </div>
    );
}

function MonthBars({ heights, highlightCount = 5 }) {
    // SVG bar chart for monthly logins.
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const max = Math.max(...heights);
    const padL = 32, padR = 12, padT = 12, padB = 26;
    const width = 620, height = 200;
    const innerW = width - padL - padR;
    const innerH = height - padT - padB;
    const bw = innerW / months.length * 0.6;
    const step = innerW / months.length;
    return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="none" style={{ display: "block", height: 200 }}>
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <line key={i} x1={padL} y1={padT + innerH * p} x2={width - padR} y2={padT + innerH * p} stroke="var(--border-subtle)" strokeDasharray="2 4"/>
            ))}
            {heights.map((h, i) => {
                const hpx = (h / max) * innerH;
                const x = padL + step * i + (step - bw) / 2;
                const y = padT + innerH - hpx;
                const isFull = i < highlightCount;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={bw} height={hpx} fill={isFull ? "#3b82f6" : "rgba(59,130,246,0.25)"} rx="2"/>
                        <text x={x + bw / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--text-muted)">{months[i]}</text>
                    </g>
                );
            })}
        </svg>
    );
}

function DayBars({ heights }) {
    const max = Math.max(...heights);
    const padL = 24, padR = 12, padT = 12, padB = 22;
    const width = 620, height = 180;
    const innerW = width - padL - padR;
    const innerH = height - padT - padB;
    const step = innerW / heights.length;
    const bw = step * 0.6;
    return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="none" style={{ display: "block", height: 180 }}>
            {[0, 0.5, 1].map((p, i) => (
                <line key={i} x1={padL} y1={padT + innerH * p} x2={width - padR} y2={padT + innerH * p} stroke="var(--border-subtle)" strokeDasharray="2 4"/>
            ))}
            {heights.map((h, i) => {
                const hpx = (h / max) * innerH;
                const x = padL + step * i + (step - bw) / 2;
                const y = padT + innerH - hpx;
                const isFull = i < 18;
                return <rect key={i} x={x} y={y} width={bw} height={hpx} fill={isFull ? "#3b82f6" : "rgba(59,130,246,0.25)"} rx="1"/>;
            })}
            {[1, 5, 10, 15, 20, 25, 31].map((d) => {
                const i = d - 1;
                return <text key={d} x={padL + step * i + step / 2} y={height - 6} textAnchor="middle" fontSize="9" fill="var(--text-muted)">{d}</text>;
            })}
        </svg>
    );
}

// Donut chart — analysis by business unit.
function Donut({ data }) {
    const r = 64, R = 84, cx = 100, cy = 100;
    const total = data.reduce((s, d) => s + d.v, 0);
    let cum = 0;
    return (
        <svg viewBox="0 0 200 200" width="200" height="200">
            {data.map((d, i) => {
                const a0 = (cum / total) * Math.PI * 2 - Math.PI / 2;
                cum += d.v;
                const a1 = (cum / total) * Math.PI * 2 - Math.PI / 2;
                const large = a1 - a0 > Math.PI ? 1 : 0;
                const x0 = cx + Math.cos(a0) * R, y0 = cy + Math.sin(a0) * R;
                const x1 = cx + Math.cos(a1) * R, y1 = cy + Math.sin(a1) * R;
                const xi1 = cx + Math.cos(a1) * r, yi1 = cy + Math.sin(a1) * r;
                const xi0 = cx + Math.cos(a0) * r, yi0 = cy + Math.sin(a0) * r;
                return (
                    <path
                        key={i}
                        d={`M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${r} ${r} 0 ${large} 0 ${xi0} ${yi0} Z`}
                        fill={d.c}
                    />
                );
            })}
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text-primary)">2.4k</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="var(--text-muted)">Units</text>
        </svg>
    );
}

function UsageOverviewView() {
    const monthlyHeights = [185, 145, 175, 215, 145, 32, 32, 32, 32, 32, 32, 32];
    const dailyHeights = [
        25, 35, 50, 70, 95, 65, 55, 80, 100, 110, 75, 60, 90, 70, 55, 130, 60, 50,
        25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
    ];
    const buData = [
        { label: "HS사업본부", v: 17.4, c: "#10b981" },
        { label: "MS사업본부", v: 12.2, c: "#f59e0b" },
        { label: "VS사업본부", v: 40.0, c: "#3b82f6" },
        { label: "ES사업본부", v: 7.3,  c: "#f43f5e" },
        { label: "CTO부문",   v: 20.5, c: "#a855f7" },
    ];

    return (
        <div style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto" }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Usage Overview</h1>
            <p style={{ margin: "4px 0 22px", fontSize: 13, color: "var(--text-muted)" }}>Real-time engagement and operational metrics across the platform.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
                <StatTile icon="users"           title="Total Sessions"  value="42,891" delta="↑ 12.4%" deltaKind="pos" foot="vs last week"/>
                <StatTile icon="clock"           title="Avg Duration"    value="18m 42s" delta="↓ 2.1%" deltaKind="neg" foot="vs last week"/>
                <StatTile icon="trending-up"     title="Peak Concurrency" value="1,204" delta="↑ 4.8%" deltaKind="pos" foot="vs last week"/>
                <StatTile icon="check-circle-2"  title="Error Rate"      value="0.04" unit="%" delta="—" deltaKind="flat" foot="stable"/>
            </div>

            <SectionCard
                title="Monthly User Logins" icon="bar-chart-3" iconColor="#5569FF"
                rightAction="2026 ▾"
                bodyPad={8}
                style={{ marginBottom: 14 }}
            >
                <MonthBars heights={monthlyHeights}/>
            </SectionCard>

            <SectionCard
                title="Daily User Logins" icon="activity" iconColor="#5569FF"
                rightAction="2026-05 ▾"
                bodyPad={8}
                style={{ marginBottom: 14 }}
            >
                <DayBars heights={dailyHeights}/>
            </SectionCard>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <SectionCard
                    title="Monthly Total Analysis Count" icon="bar-chart-3" iconColor="#5569FF"
                    rightAction="2026 ▾"
                    bodyPad={8}
                >
                    <MonthBars heights={[150, 105, 95, 175, 130, 18, 18, 18, 18, 18, 18, 18]} highlightCount={5}/>
                </SectionCard>

                <SectionCard
                    title="Analysis by Business Unit" icon="package" iconColor="#5569FF"
                    bodyPad={16}
                >
                    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, alignItems: "center" }}>
                        <Donut data={buData}/>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12 }}>
                            {buData.map((d, i) => (
                                <li key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: 9999, background: d.c }}/>
                                        <span style={{ color: "var(--text-secondary)" }}>{d.label}</span>
                                    </span>
                                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{d.v.toFixed(1)}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}

window.UsageOverviewView = UsageOverviewView;
