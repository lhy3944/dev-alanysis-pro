// Logo.jsx — locked design: code-bracket mark + wordmark.
// Tracks design system option B.
//
// Inverse = use on dark / brand surfaces.
function Logo({ inverse = false, size = "md" }) {
    const sizes = {
        sm: { word: 13, mark: 22, gap: 6,  pad: 4,  radius: 5, stroke: 2.4, icon: 12 },
        md: { word: 16, mark: 26, gap: 7,  pad: 5,  radius: 6, stroke: 2.5, icon: 14 },
        lg: { word: 22, mark: 36, gap: 9,  pad: 7,  radius: 8, stroke: 2.6, icon: 20 },
    };
    const s = sizes[size];

    const fg       = inverse ? "#ffffff" : "var(--text-primary)";
    const proFg    = inverse ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
    const markBg   = inverse ? "rgba(255,255,255,0.18)" : "rgba(85,105,255,0.12)";
    const markFg   = inverse ? "#ffffff" : "#5569FF";

    return (
        <a href="#" style={{
            display: "inline-flex", alignItems: "center", gap: s.gap,
            textDecoration: "none", userSelect: "none",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: s.word,
            letterSpacing: "-0.02em",
            color: fg,
        }}>
            <span style={{
                width: s.mark, height: s.mark,
                borderRadius: s.radius,
                background: markBg,
                color: markFg,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
            }}>
                <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s.stroke} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="8 6 3 12 8 18"/>
                    <polyline points="16 6 21 12 16 18"/>
                </svg>
            </span>
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
                <span>DevAnalysis</span>
                <span style={{ fontWeight: 500, color: proFg }}>Pro</span>
            </span>
        </a>
    );
}

// Standalone mark — for favicons, sidebar collapsed state, splash etc.
function LogoMark({ size = 32, inverse = false }) {
    const bg = inverse ? "#ffffff" : "#5569FF";
    const fg = inverse ? "#5569FF" : "#ffffff";
    return (
        <span style={{
            width: size, height: size,
            borderRadius: Math.round(size * 0.22),
            background: bg, color: fg,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
        }}>
            <svg width={Math.round(size * 0.5)} height={Math.round(size * 0.5)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8 6 3 12 8 18"/>
                <polyline points="16 6 21 12 16 18"/>
            </svg>
        </span>
    );
}
