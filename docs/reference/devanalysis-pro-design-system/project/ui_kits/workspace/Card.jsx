// Card.jsx — bordered card chrome + headed Section Card

function Card({ children, hover = false, style, className, ...rest }) {
    return (
        <div
            className={className}
            style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
                padding: 20,
                boxShadow: hover ? "0 4px 12px -2px rgba(0,0,0,0.08)" : "none",
                ...style,
            }}
            {...rest}
        >
            {children}
        </div>
    );
}

// Section card — title bar on top, optional right-side action chip, content body.
function SectionCard({
    title, icon, iconColor = "var(--text-primary)",
    rightAction, rightActionColor, children, bodyPad = 16, style,
}) {
    return (
        <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            overflow: "hidden",
            ...style,
        }}>
            <div style={{
                padding: "12px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-primary)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    {icon && <Icon name={icon} size={16} style={{ color: iconColor }} />}
                    <span>{title}</span>
                </div>
                {rightAction && (
                    <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: rightActionColor || "var(--text-muted)",
                        background: rightActionColor ? rightActionColor + "1a" : "var(--bg-secondary)",
                        padding: "3px 10px",
                        borderRadius: 9999,
                        cursor: "pointer",
                    }}>{rightAction}</span>
                )}
            </div>
            <div style={{ padding: bodyPad }}>
                {children}
            </div>
        </div>
    );
}

window.Card = Card;
window.SectionCard = SectionCard;
