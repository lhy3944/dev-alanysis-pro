// ProjectGroupsView.jsx — recreation of /project-groups page from the codebase.
//
// Tracks src/components/projects/ProjectGroupCard.tsx + ProjectCard.tsx +
// ProjectListItem.tsx + ProjectGroupFilterToolbar.tsx from
// lhy3944/dev-alanysis-pro.
//
// Notes on color usage:
// - The codebase's --accent-primary is BLACK (light) / WHITE (dark) — NOT the
//   brand purple. The Package tile and "N개 프로젝트" badge are accent-tinted,
//   so they read as soft-gray-on-light, not purple-on-light. Brand purple
//   stays at the header chrome only.

const MOCK_PROJECTS = {
    backend: [
        { id: "p1", name: "SAVE-Web",        lifecycle: "published", type: "javascript_typescript", desc: "Main web application for SAVE platform — onboarding, reporting and admin surfaces.", members: 12, updated: "3일 전" },
        { id: "p2", name: "SAVE-Mobile",     lifecycle: "draft",     type: "objective_c_cpp",        desc: "iOS mobile client for SAVE. Currently scoped to read-only dashboards.",          members: 5,  updated: "1주 전" },
        { id: "p3", name: "SAVE-Sync",       lifecycle: "published", type: "java",                   desc: "Background sync worker that reconciles SAVE-Web and the analyzer cluster every 30s.", members: 4,  updated: "2주 전" },
    ],
    platform: [
        { id: "q1", name: "Telemetry Core",  lifecycle: "published", type: "python", desc: "Metrics + log ingestion service for the platform.",  members: 8, updated: "어제" },
        { id: "q2", name: "Edge Gateway",    lifecycle: "published", type: "swift",  desc: "Routing layer with per-tenant rate limiting.",         members: 6, updated: "4일 전" },
    ],
    security: [
        { id: "s1", name: "Audit Stream",    lifecycle: "draft",     type: "java",   desc: "Append-only audit-event stream backing the Security Officer console.", members: 3, updated: "오늘" },
    ],
};

const LIFECYCLE = {
    draft:     { label: "Draft",     bg: "#fef3c7", fg: "#b45309" },
    published: { label: "Published", bg: "#d1fae5", fg: "#047857" },
    deleted:   { label: "Deleted",   bg: "#fee2e2", fg: "#b91c1c" },
};
const TYPES = {
    java:                  { label: "Java",                  bg: "#dbeafe", fg: "#1d4ed8" },
    c_cpp:                 { label: "C/C++",                 bg: "#cffafe", fg: "#0e7490" },
    objective_c_cpp:       { label: "Objective-C/C++",       bg: "#e0e7ff", fg: "#4338ca" },
    swift:                 { label: "Swift",                 bg: "#ffedd5", fg: "#c2410c" },
    python:                { label: "Python",                bg: "#fef9c3", fg: "#a16207" },
    javascript_typescript: { label: "JavaScript/TypeScript", bg: "#fef3c7", fg: "#b45309" },
};

function Pill({ palette, children }) {
    return <span style={{
        display: "inline-flex", alignItems: "center",
        padding: "1px 8px", height: 18, borderRadius: 9999,
        background: palette.bg, color: palette.fg,
        fontSize: 10, fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap",
    }}>{children}</span>;
}

// ProjectCard — bordered tile w/ icon + name + status pills + desc + dotted foot
function ProjectCard({ project }) {
    return (
        <a href="#" style={{
            display: "block",
            background: "var(--bg-primary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            padding: 18,
            textDecoration: "none",
            color: "inherit",
            transition: "border-color 0.15s, box-shadow 0.15s, transform 0.2s",
        }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.35)"; e.currentTarget.style.boxShadow = "0 4px 12px -2px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{
                    width: 36, height: 36, borderRadius: 6,
                    background: "rgba(0,0,0,0.08)",
                    color: "var(--text-primary)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                }}><Icon name="box" size={16}/></span>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.name}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                        <Pill palette={LIFECYCLE[project.lifecycle]}>{LIFECYCLE[project.lifecycle].label}</Pill>
                        <Pill palette={TYPES[project.type]}>{TYPES[project.type].label}</Pill>
                    </div>
                </div>
            </div>
            <p style={{
                margin: "0 0 14px",
                fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "calc(2 * 1.5em)",
            }}>{project.desc}</p>
            <div style={{
                borderTop: "1px dotted var(--border-subtle)",
                paddingTop: 12,
                display: "flex", justifyContent: "flex-end", gap: 14,
                fontSize: 12, color: "var(--text-muted)",
            }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }} title={`멤버 ${project.members}명`}>
                    <Icon name="users" size={14}/>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{project.members}</span>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, paddingLeft: 14, borderLeft: "1px solid var(--border-subtle)" }}>
                    <Icon name="clock" size={14}/>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{project.updated}</span>
                </span>
            </div>
        </a>
    );
}

// ProjectListItem — single-row variant
function ProjectListItem({ project }) {
    return (
        <a href="#" style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 18px",
            background: "var(--bg-primary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            textDecoration: "none",
            color: "inherit",
            transition: "border-color 0.15s, box-shadow 0.15s",
        }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.35)"; e.currentTarget.style.boxShadow = "0 4px 12px -2px rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.boxShadow = "none"; }}
        >
            <span style={{
                width: 34, height: 34, borderRadius: 6,
                background: "rgba(0,0,0,0.08)",
                color: "var(--text-primary)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
            }}><Icon name="box" size={16}/></span>
            <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{project.name}</span>
                    <Pill palette={LIFECYCLE[project.lifecycle]}>{LIFECYCLE[project.lifecycle].label}</Pill>
                    <Pill palette={TYPES[project.type]}>{TYPES[project.type].label}</Pill>
                </div>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.desc}</p>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)", flexShrink: 0 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={14}/>{project.updated}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="users" size={14}/>{project.members}</span>
            </div>
        </a>
    );
}

// Filter toolbar (search + lifecycle + analysis-type + view-mode)
function ProjectGroupFilterToolbar({ search, setSearch, lifecycle, setLifecycle, type, setType, view, setView }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBottom: 16 }}>
            <div style={{
                display: "flex", width: 260,
                border: "1px solid var(--border-primary)",
                borderRadius: 4,
                overflow: "hidden",
                background: "var(--bg-primary)",
            }}>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="그룹 내 프로젝트 검색"
                    style={{
                        flex: 1, height: 32, padding: "0 10px", fontSize: 12,
                        background: "transparent", border: 0, outline: "none",
                        color: "var(--text-primary)", fontFamily: "inherit",
                    }}
                />
                <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "0 10px", borderLeft: "1px solid var(--border-primary)",
                    color: "var(--text-muted)",
                }}><Icon name="search" size={13}/></span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, whiteSpace: "nowrap" }}>상태</span>
                    <select value={lifecycle} onChange={(e) => setLifecycle(e.target.value)} style={{
                        height: 32, padding: "0 8px", fontSize: 12, width: 120,
                        background: "var(--bg-primary)", border: "1px solid var(--border-primary)",
                        borderRadius: 4, color: "var(--text-primary)", fontFamily: "inherit",
                    }}>
                        <option value="all">전체</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="deleted">Deleted</option>
                    </select>
                </label>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, whiteSpace: "nowrap" }}>분석 타입</span>
                    <select value={type} onChange={(e) => setType(e.target.value)} style={{
                        height: 32, padding: "0 8px", fontSize: 12, width: 150,
                        background: "var(--bg-primary)", border: "1px solid var(--border-primary)",
                        borderRadius: 4, color: "var(--text-primary)", fontFamily: "inherit",
                    }}>
                        <option value="all">전체</option>
                        {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                </label>
                <div style={{ display: "flex", height: 32, border: "1px solid var(--border-primary)", borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setView("card")} style={{
                        width: 32, height: 30, border: 0,
                        background: view === "card" ? "var(--bg-secondary)" : "transparent",
                        color: view === "card" ? "var(--text-primary)" : "var(--icon-default)",
                        cursor: "pointer",
                    }}><Icon name="grid-2x2" size={14}/></button>
                    <button onClick={() => setView("list")} style={{
                        width: 32, height: 30, border: 0,
                        background: view === "list" ? "var(--bg-secondary)" : "transparent",
                        color: view === "list" ? "var(--text-primary)" : "var(--icon-default)",
                        cursor: "pointer",
                        borderLeft: "1px solid var(--border-primary)",
                    }}><Icon name="list" size={14}/></button>
                </div>
            </div>
        </div>
    );
}

// ProjectGroupCard — collapsible
function ProjectGroupCard({ name, description, projects, managerCount, memberCount, updated, defaultExpanded = false }) {
    const [expanded, setExpanded] = React.useState(defaultExpanded);
    const [search, setSearch]     = React.useState("");
    const [lifecycle, setLifecycle] = React.useState("all");
    const [type, setType]         = React.useState("all");
    const [view, setView]         = React.useState("card");

    const filtered = projects.filter((p) => {
        if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.desc.toLowerCase().includes(search.toLowerCase())) return false;
        if (lifecycle !== "all" && p.lifecycle !== lifecycle) return false;
        if (type !== "all" && p.type !== type) return false;
        return true;
    });

    return (
        <div style={{
            background: "var(--bg-primary)",
            border: `1px solid ${expanded ? "rgba(0,0,0,0.30)" : "var(--border-subtle)"}`,
            borderRadius: 8,
            transition: "border-color 0.25s, box-shadow 0.25s",
            boxShadow: expanded ? "0 4px 12px -2px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)" : "none",
        }}>
            <button
                onClick={() => setExpanded(!expanded)}
                style={{
                    display: "flex", flexDirection: "column",
                    width: "100%", textAlign: "left",
                    padding: 22,
                    background: "transparent", border: 0,
                    cursor: "pointer", color: "inherit",
                    fontFamily: "inherit",
                }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <span style={{
                            width: 40, height: 40, borderRadius: 8,
                            background: expanded ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.08)",
                            color: "var(--text-primary)",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                            transform: expanded ? "scale(1.05)" : "scale(1)",
                            boxShadow: expanded ? "0 0 0 1px rgba(0,0,0,0.10)" : "none",
                            transition: "all 0.25s",
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(0,0,0,0.20)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
                            </svg>
                        </span>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{name}</h3>
                                <span style={{
                                    background: "rgba(0,0,0,0.08)",
                                    color: "var(--text-primary)",
                                    padding: "3px 10px",
                                    borderRadius: 9999,
                                    fontSize: 11, fontWeight: 600,
                                }}>{projects.length}개 프로젝트</span>
                            </div>
                        </div>
                    </div>
                    <span style={{
                        width: 32, height: 32, borderRadius: 9999,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        color: "var(--icon-default)",
                        transform: expanded ? "rotate(180deg)" : "none",
                        transition: "transform 0.25s",
                        flexShrink: 0,
                    }}><Icon name="chevron-down" size={18}/></span>
                </div>

                {description && (
                    <p style={{
                        margin: "0 0 16px",
                        fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55,
                        ...(expanded ? {} : {
                            display: "-webkit-box",
                            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }),
                    }}>{description}</p>
                )}

                <div style={{
                    width: "100%",
                    paddingTop: 14,
                    borderTop: "1px dotted var(--border-subtle)",
                    display: "flex", justifyContent: "flex-end", gap: 14,
                    fontSize: 12, color: "var(--text-muted)",
                }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }} title={`관리자 ${managerCount}명`}>
                        <Icon name="user-cog" size={14}/>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{managerCount}</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, paddingLeft: 14, borderLeft: "1px solid var(--border-subtle)" }}>
                        <Icon name="users" size={14}/>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{memberCount}</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, paddingLeft: 14, borderLeft: "1px solid var(--border-subtle)" }}>
                        <Icon name="clock" size={14}/>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{updated}</span>
                    </span>
                </div>
            </button>

            {expanded && (
                <div style={{
                    borderTop: "1px dotted var(--border-subtle)",
                    padding: "20px 24px 24px",
                    background: "var(--bg-secondary)",
                    borderRadius: "0 0 8px 8px",
                }}>
                    <ProjectGroupFilterToolbar
                        search={search} setSearch={setSearch}
                        lifecycle={lifecycle} setLifecycle={setLifecycle}
                        type={type} setType={setType}
                        view={view} setView={setView}
                    />
                    {filtered.length === 0 ? (
                        <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                            조건에 맞는 프로젝트가 없습니다.
                        </div>
                    ) : view === "card" ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
                            {filtered.map((p) => <ProjectCard key={p.id} project={p}/>)}
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {filtered.map((p) => <ProjectListItem key={p.id} project={p}/>)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ProjectGroupsView() {
    const [search, setSearch] = React.useState("");
    return (
        <div style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{
                    flex: 1, display: "flex",
                    border: "1px solid var(--border-primary)", borderRadius: 4,
                    background: "var(--bg-primary)", overflow: "hidden",
                }}>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="그룹명, 프로젝트명 또는 설명으로 검색"
                        style={{
                            flex: 1, height: 36, padding: "0 12px", fontSize: 13,
                            background: "transparent", border: 0, outline: "none",
                            color: "var(--text-primary)", fontFamily: "inherit",
                        }}
                    />
                    <button style={{
                        height: 34, padding: "0 14px",
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        border: 0, fontSize: 12, fontWeight: 500,
                        cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: 6,
                    }}>
                        <Icon name="search" size={14}/>검색
                    </button>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <ProjectGroupCard
                    name="Platform Division"
                    description="플랫폼 인프라와 게이트웨이를 담당하는 본부. 텔레메트리 코어와 엣지 게이트웨이 등의 공용 서비스를 운영합니다."
                    projects={MOCK_PROJECTS.platform}
                    managerCount={2} memberCount={7} updated="2일 전"
                    defaultExpanded={false}
                />
                <ProjectGroupCard
                    name="Backend Team"
                    description="SAVE 플랫폼의 백엔드와 모바일 클라이언트를 담당하는 팀. 분석기 클러스터와의 동기화 워커를 함께 관리합니다."
                    projects={MOCK_PROJECTS.backend}
                    managerCount={1} memberCount={3} updated="오늘"
                    defaultExpanded={true}
                />
                <ProjectGroupCard
                    name="Security Audit"
                    description="감사 로그와 보안 컴플라이언스 도구를 담당. Security Officer 콘솔에 데이터를 공급합니다."
                    projects={MOCK_PROJECTS.security}
                    managerCount={1} memberCount={2} updated="4일 전"
                    defaultExpanded={false}
                />
            </div>
        </div>
    );
}

window.ProjectGroupsView = ProjectGroupsView;
