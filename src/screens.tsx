import { useEffect, useRef, useState } from "react"
import { JOHN_PHOTO, access, docs, interview, people, person, repo, repos, setupCommands } from "./data"
import type { Repo, Status, Tone, View } from "./data"
import { answer, AnswerBubble, Avatar, Icon, TeamsLogo, statusKey, useApp } from "./ui"
import type { Answer } from "./ui"

/* Design principles used on every screen
   1. One focal point per screen (hero video, architecture, office map, conversation).
   2. 8px spacing grid, 16px card radius, cards share top and bottom edges.
   3. Type scale: 34 / 20 / 15 / 13. Bold black headings, grey supporting text.
   4. Color is pastel and carries meaning: mint = stable, yellow = needs review, rose = risk.
   5. Show less. Every block answers one question; detail is one click away. */

const tone: Record<Status, Tone> = { Stable: "mint", "Needs review": "yellow", "High risk": "rose", Unknown: "violet" }
const mapRepos = repos.filter((r) => r.id !== "users")

function Photo({ className = "", alt }: { className?: string; alt: string }) {
  const [broken, setBroken] = useState(false)
  return broken ? <span className={`photo-fallback ${className}`}><b>JC</b></span> : <img className={className} src={JOHN_PHOTO} alt={alt} onError={() => setBroken(true)} />
}

// Plays through caption lines while a video is "playing"
function useCaptions(lines: string[], playing: boolean, reset: unknown) {
  const [i, setI] = useState(0)
  useEffect(() => { setI(0) }, [reset, playing])
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setI((n) => (n + 1) % lines.length), 3400)
    return () => window.clearInterval(id)
  }, [playing, lines.length])
  return i
}

const introLines = [
  "Hi, I’m John. I led payments backend here for three years.",
  "Start with the payments flow. It connects most of the decisions I made.",
  "Read past decisions before changing things.",
  "When you’re stuck, ask the agent. It also knows what I didn’t.",
]

function Dot({ s }: { s: Status }) {
  return <i className={`sdot sdot--${statusKey(s)}`} aria-label={s} />
}

// ─── Home ───────────────────────────────────────────────────────────────
export function HomeScreen() {
  const { go } = useApp()
  const [q, setQ] = useState("")
  const [playing, setPlaying] = useState(false)
  const line = useCaptions(introLines, playing, null)
  const counts = (["Stable", "Needs review", "High risk", "Unknown"] as Status[]).map((s) => ({ s, n: repos.filter((r) => r.status === s).length }))
  const chips = ["Show me his main project", "Where do I start?", "Key learnings"]
  return (
    <div className="screen home">
      <section className="home-main">
        <header className="hello">
          <h1>Hi! I’m the Last Commit agent</h1>
          <p>I can help you explore John’s work, answer questions, and point you to what matters.</p>
        </header>
        <button className={`hero ${playing ? "is-playing" : ""}`} onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause John's intro" : "Watch John's intro"}>
          <Photo className="hero-img" alt="John Carter at his desk" />
          {!playing && <span className="hero-note">Read past<br />decisions<br />before<br />changing<br />things.<br /><em>— John</em></span>}
          {playing && <span className="caption" aria-live="polite" key={line}>{introLines[line]}</span>}
          <span className="play"><b><Icon name={playing ? "pause" : "play"} size={14} /></b>{playing ? "Pause" : "Watch John’s 2-min intro"}</span>
          {playing && <span className="progress"><i style={{ width: `${((line + 1) / introLines.length) * 100}%` }} /></span>}
        </button>
        <div className="prompt">
          <div className="prompt-q"><span className="bot" aria-hidden="true"><i /><i /></span><p>What would you like to explore first?</p></div>
          <div className="chips">
            {chips.map((c) => <button key={c} onClick={() => go("ask", { q: c })}>{c}</button>)}
          </div>
          <form className="ask-bar" onSubmit={(e) => { e.preventDefault(); if (q.trim()) go("ask", { q: q.trim() }) }}>
            <label className="sr-only" htmlFor="home-ask">Ask anything about John’s work</label>
            <input id="home-ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything about John’s work…" />
            <button type="submit" aria-label="Ask"><Icon name="arrow" size={18} /></button>
          </form>
        </div>
      </section>

      <aside className="home-side">
        <section className="panel">
          <header className="panel-head"><h2>John’s Repositories</h2><button className="see" onClick={() => go("repo")}>See all <Icon name="arrow" size={14} /></button></header>
          <ul className="repo-list">
            {mapRepos.slice(0, 5).map((r) => (
              <li key={r.id}>
                <button onClick={() => go("repo", { repo: r.id })}>
                  <Icon name="github" size={22} />
                  <span><strong>{r.name}</strong><small>{layout[r.id]?.sub || "Core payments processing"}</small></span>
                  <Dot s={r.status} />
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <header className="panel-head"><h2><span className="bars" aria-hidden="true"><i /><i /><i /></span>Codebase Health</h2></header>
          <div className="health-bar">{counts.map((c) => <i key={c.s} className={`hb--${statusKey(c.s)}`} style={{ flex: c.n }} />)}</div>
          <ul className="health-list">
            {counts.map((c) => (
              <li key={c.s}><Dot s={c.s} /><span>{c.s}</span><small>{c.n} {c.n === 1 ? "repo" : "repos"}</small><small>{Math.round((c.n / repos.length) * 100)}%</small></li>
            ))}
          </ul>
        </section>
        <UpNext view="home" compact />
      </aside>
    </div>
  )
}

// ─── Architecture (isometric) ───────────────────────────────────────────
const layout: Record<string, { x: number; y: number; label: "right" | "below"; sub: string }> = {
  api: { x: 170, y: 150, label: "right", sub: "External requests" },
  fraud: { x: 470, y: 105, label: "right", sub: "Risk scoring" },
  ledger: { x: 720, y: 215, label: "right", sub: "Bank synchronization" },
  payments: { x: 440, y: 300, label: "right", sub: "" },
  notification: { x: 160, y: 390, label: "below", sub: "Email & SMS" },
  recon: { x: 640, y: 440, label: "right", sub: "Transaction matching" },
}
const flows: { from: string; to: string; kind: "request" | "data" | "async" }[] = [
  { from: "api", to: "payments", kind: "request" },
  { from: "payments", to: "api", kind: "data" },
  { from: "payments", to: "fraud", kind: "request" },
  { from: "payments", to: "ledger", kind: "async" },
  { from: "payments", to: "notification", kind: "async" },
  { from: "notification", to: "payments", kind: "data" },
  { from: "payments", to: "recon", kind: "async" },
  { from: "recon", to: "payments", kind: "request" },
]

function CubeShape({ t, y = 0 }: { t: Tone; y?: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <path className="cube-face" fill={`url(#${t}-l)`} stroke={`url(#${t}-l)`} d="M-44-18 0 7 0 46-44 21z" />
      <path className="cube-face" fill={`url(#${t}-r)`} stroke={`url(#${t}-r)`} d="M44-18 0 7 0 46 44 21z" />
      <path className="cube-face" fill={`url(#${t}-t)`} stroke={`url(#${t}-t)`} d="M-44-18 0-43 44-18 0 7z" />
    </g>
  )
}

type Lens = "health" | "knowledge" | "coverage"
const lensTone = (r: Repo, l: Lens): Tone =>
  l === "health" ? tone[r.status]
  : l === "knowledge" ? (r.johnPct >= 60 ? "rose" : r.johnPct >= 30 ? "yellow" : "mint")
  : (r.sonar.coverage >= 80 ? "mint" : r.sonar.coverage >= 60 ? "yellow" : "rose")
const lensKey: Record<Lens, string> = {
  health: "Green is stable, yellow needs review, red is risky.",
  knowledge: "Red means John wrote most of it. Only he really knew it.",
  coverage: "Green is well tested, red is under 60% coverage.",
}

function Architecture({ sel, onSelect, lens }: { sel: string; onSelect: (id: string) => void; lens: Lens }) {
  const gradients: [Tone, string, string, string][] = [
    ["mint", "#d9f8e8", "#9fe3c0", "#5fc796"],
    ["yellow", "#fff1c4", "#f8d77c", "#e8b744"],
    ["rose", "#ffdfe1", "#f8aab1", "#e47d88"],
  ]
  const at = (id: string) => layout[id]
  return (
    <svg className="arch" viewBox="100 40 860 500" role="img" aria-label="Service architecture">
      <defs>
        {gradients.map(([t, a, b, c]) => (
          <g key={t}>
            <linearGradient id={`${t}-t`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor={a} /></linearGradient>
            <linearGradient id={`${t}-l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={b} /><stop offset="1" stopColor={a} /></linearGradient>
            <linearGradient id={`${t}-r`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} /><stop offset="1" stopColor={b} /></linearGradient>
          </g>
        ))}
        <radialGradient id="glow"><stop offset="0" stopColor="#c9f3dd" stopOpacity=".8" /><stop offset="1" stopColor="#c9f3dd" stopOpacity="0" /></radialGradient>
        <radialGradient id="glow-y"><stop offset="0" stopColor="#ffeeb8" stopOpacity=".6" /><stop offset="1" stopColor="#ffeeb8" stopOpacity="0" /></radialGradient>
        {(["request", "data", "async"] as const).map((k) => (
          <marker key={k} id={`m-${k}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 8 5 1 9" className={`mk mk--${k}`} /></marker>
        ))}
      </defs>
      <ellipse cx="460" cy="300" rx="230" ry="150" fill="url(#glow)" />
      <ellipse cx="760" cy="200" rx="140" ry="90" fill="url(#glow-y)" />

      {flows.map((f, i) => {
        const a = at(f.from), b = at(f.to)
        const back = flows.some((g) => g.from === f.to && g.to === f.from) && f.from > f.to ? 14 : 0
        const ax = a.x + (b.x - a.x) * 0.16, ay = a.y + (b.y - a.y) * 0.16 + back
        const bx = b.x - (b.x - a.x) * 0.16, by = b.y - (b.y - a.y) * 0.16 + back
        const mx = (ax + bx) / 2, my = (ay + by) / 2 - 30 + back
        return <path key={i} className={`flow flow--${f.kind}`} d={`M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`} markerEnd={`url(#m-${f.kind})`} />
      })}

      {mapRepos.map((r) => {
        const p = at(r.id)
        const t = lensTone(r, lens)
        const active = sel === r.id
        return (
          <g key={r.id} className={`node ${active ? "is-active" : ""}`} transform={`translate(${p.x} ${p.y})`} role="button" tabIndex={0} aria-label={r.name} onClick={() => onSelect(r.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(r.id))}>
            <ellipse cx="0" cy="52" rx="54" ry="16" className="node-shadow" />
            {r.id === "payments" && <CubeShape t={t} y={26} />}
            <CubeShape t={t} />
            <path d="M-17-18 0-27.5 17-18 0-8.5z" className="glyph" />
            <path d="M-6-18 0-21.5 6-18 0-14.5z" className="glyph glyph--fill" />
            {lens === "health" && r.status !== "Stable" && (
              <g transform="translate(46 -42)"><circle r="10" className={`badge badge--${statusKey(r.status)}`} /><text y="4" textAnchor="middle" className="badge-t">!</text></g>
            )}
            {p.label === "right" ? (
              <g transform={r.id === "payments" ? "translate(58 40)" : "translate(62 -12)"}>
                {r.id === "payments" ? <><rect x="-6" y="-19" width="196" height="38" rx="19" className="pill-bg" /><text x="92" y="6" textAnchor="middle" className="n-name">{r.name}</text></> : <>
                  <text className="n-name">{r.name}</text>
                  <text y="18" className="n-sub">{p.sub}</text>
                </>}
              </g>
            ) : (
              <g transform="translate(-10 82)"><text className="n-name">{r.name}</text><text y="18" className="n-sub">{p.sub}</text></g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─── Repositories ───────────────────────────────────────────────────────
const tabs = [
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Key decisions" },
  { id: "incidents", label: "Recent incidents" },
]

function Walkthrough({ r }: { r: Repo }) {
  const [playing, setPlaying] = useState(false)
  useEffect(() => { setPlaying(false) }, [r.id])
  const lines = r.chapters.length ? r.chapters.map((c) => c.label) : r.whiteboard.remember
  const line = useCaptions(lines, playing, r.id)
  return (
    <section className="panel walk">
      <header className="panel-head"><h2><span className="cam" aria-hidden="true"><Icon name="video" size={16} /></span>John’s walkthrough</h2><span className="time"><Icon name="play" size={10} /> {Math.max(2, r.chapters.length)} min</span></header>
      <button className="walk-media" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play walkthrough"}>
        <span className="board">
          <b>{r.name.split("-")[0]} flow</b>
          <span className="board-flow">{r.whiteboard.flow.map((s, i) => <span key={s}>{i > 0 && "→"}<em>{s}</em></span>)}</span>
          <span>{r.whiteboard.remember.length} things to remember:</span>
          <ol>{r.whiteboard.remember.map((s) => <li key={s}>{s}</li>)}</ol>
        </span>
        <span className="walk-play"><Icon name={playing ? "pause" : "play"} size={16} /></span>
        {playing && <span className="caption caption--sm" aria-live="polite" key={line}>{lines[line]}</span>}
        {playing && <span className="progress"><i style={{ width: `${((line + 1) / lines.length) * 100}%` }} /></span>}
      </button>
    </section>
  )
}

// SonarQube — hardcoded scan results from data.ts (repo.sonar)
function SonarPanel({ r }: { r: Repo }) {
  const s = r.sonar
  const C = 2 * Math.PI * 34
  const ratingTone = (v: string) => (v === "A" ? "mint" : v === "B" ? "mint" : v === "C" ? "yellow" : v === "—" ? "plain" : "rose")
  return (
    <section className="panel sonar">
      <header className="panel-head">
        <h2>Code quality</h2>
        <span className="source"><i className="src-dot src-dot--sonar" />SonarQube · {s.scanned === "Never" ? "not scanned" : `scanned ${s.scanned}`}</span>
      </header>
      <div className="sonar-body">
        <div className="ring-wrap">
          <svg viewBox="0 0 84 84" className="cov-ring" role="img" aria-label={`${s.coverage}% test coverage`}>
            <circle cx="42" cy="42" r="34" className="cov-track" />
            <circle cx="42" cy="42" r="34" className={`cov-val cov-val--${s.coverage >= 80 ? "good" : s.coverage >= 60 ? "ok" : "low"}`} strokeDasharray={`${(s.coverage / 100) * C} ${C}`} transform="rotate(-90 42 42)" />
            <text x="42" y="44" textAnchor="middle" className="cov-num">{s.coverage ? `${Math.round(s.coverage)}%` : "—"}</text>
            <text x="42" y="57" textAnchor="middle" className="cov-lbl">coverage</text>
          </svg>
          <span className={`gate gate--${s.gate === "Passed" ? "pass" : "fail"}`}>{s.gate === "Passed" ? <Icon name="check" size={13} /> : "!"} Quality gate {s.gate.toLowerCase()}</span>
        </div>
        <div className="ratings">
          {([["Reliability", s.reliability], ["Security", s.security], ["Maintainability", s.maintainability]] as [string, string][]).map(([k, v]) => (
            <div key={k} className="rating"><b className={`grade grade--${ratingTone(v)}`}>{v}</b><span>{k}</span></div>
          ))}
        </div>
      </div>
      <dl className="sonar-stats">
        <div><dt>Bugs</dt><dd className={s.bugs ? "bad" : ""}>{s.bugs}</dd></div>
        <div><dt>Vulnerabilities</dt><dd className={s.vulns ? "bad" : ""}>{s.vulns}</dd></div>
        <div><dt>Code smells</dt><dd>{s.smells}</dd></div>
        <div><dt>Tech debt</dt><dd>{s.debt}</dd></div>
      </dl>
    </section>
  )
}

// Jira — latest tickets for this repo, newest first (hardcoded in data.ts)
function JiraPanel({ r }: { r: Repo }) {
  const { go } = useApp()
  const latest = [...r.jira].reverse().slice(0, 5)
  return (
    <section className="panel jira">
      <header className="panel-head">
        <h2>Latest changes</h2>
        <span className="source"><i className="src-dot src-dot--jira" />Jira</span>
      </header>
      <ul className="tickets">
        {latest.map((t) => {
          const owner = t.status === "Done" || t.status === "Won't do" ? "john" : r.interim
          return (
            <li key={t.key}>
              <span className={`ttype ttype--${t.type.replace(" ", "").toLowerCase()}`} title={t.type} />
              <span className="tkey">{t.key}</span>
              <span className="ttitle">{t.title}</span>
              <span className={`tstatus tstatus--${t.status.replace(/[^a-z]/gi, "").toLowerCase()}`}>{t.status}</span>
              <Avatar id={owner} size={26} />
            </li>
          )
        })}
      </ul>
      <button className="see see--blue" onClick={() => go("repo", { repo: r.id, tab: "incidents" })}>See incidents <Icon name="arrow" size={14} /></button>
    </section>
  )
}

function AskSnippet({ r }: { r: Repo }) {
  const { go } = useApp()
  const q = r.id === "payments" ? "Can I change the retry logic?" : `Who should I ask about ${r.name}?`
  const a: Answer = answer(q, r.id)
  const short = a.text.split(/(?<=\.)\s/).slice(0, 2).join(" ")
  return (
    <section className="panel snippet">
      <div className="me-q"><Avatar id="me" size={36} /><p>{q}</p></div>
      <div className="bot-a"><span className="bot" aria-hidden="true"><i /><i /></span><p>{short}</p></div>
      <div className="src">
        {a.sources.slice(0, 3).map((s) => <button key={s.label} onClick={() => go("ask", { repo: r.id, q })}><Icon name={s.kind === "interview" ? "play" : s.kind === "ticket" ? "ticket" : "file"} size={13} />{s.label}</button>)}
      </div>
    </section>
  )
}

export function RepoScreen() {
  const { repoId, tab, go } = useApp()
  const r = repo(repoId === "users" ? "payments" : repoId)
  const t = tabs.some((x) => x.id === tab) ? tab : tab === "jira" ? "incidents" : "architecture"
  const askPeople = r.contributors.filter((c) => c.id !== "john").map((c) => c.id)
  const incidents = r.jira.filter((j) => j.type === "Incident" || j.type === "Bug")
  const [lens, setLens] = useState<Lens>("health")
  const decisions = docs.filter((d) => d.repo === r.id && (d.kind === "Decision" || d.kind === "Postmortem"))
  return (
    <div className="screen repo">
      <header className="repo-head">
        <Icon name="github" size={44} className="gh" />
        <div className="repo-id">
          <div className="repo-name"><h1>{r.name}</h1><span className={`pill pill--${statusKey(r.status)}`}><i />{r.status}</span></div>
          <p>{r.description.split(":")[0].split(",")[0]}</p>
        </div>
        <div className="ask-people" aria-label="People to ask">
          <span>Ask</span>
          {askPeople.map((id) => <button key={id} onClick={() => go("team", { person: id })} title={person(id).name}><Avatar id={id} size={32} /></button>)}
        </div>
        <label className="branch"><span className="sr-only">Branch</span>
          <select id="branch" defaultValue="main">{r.branches.map((b) => <option key={b.name}>{b.name}</option>)}</select>
          <Icon name="chevron" size={16} />
        </label>
        <a className="gh-btn" href="https://github.com/" target="_blank" rel="noreferrer">Open in GitHub <Icon name="ext" size={16} /></a>
      </header>

      <nav className="tabs" role="tablist">
        {tabs.map((x) => <button key={x.id} role="tab" aria-selected={t === x.id} className={t === x.id ? "active" : ""} onClick={() => go("repo", { repo: r.id, tab: x.id })}>{x.label}</button>)}
      </nav>

      {t === "architecture" && (
        <>
          <div className="repo-top">
            <section className="panel arch-panel">
              <div className="legend">
                <span><i className="lg lg--request" />Request flow</span>
                <span><i className="lg lg--data" />Data flow</span>
                <span><i className="lg lg--async" />Async event</span>
              </div>
              <div className="lens" role="tablist" aria-label="Color the map by">
                {([["health", "Health"], ["knowledge", "John’s knowledge"], ["coverage", "Test coverage"]] as [Lens, string][]).map(([id, label]) => (
                  <button key={id} role="tab" aria-selected={lens === id} className={lens === id ? "active" : ""} onClick={() => setLens(id)}>{label}</button>
                ))}
              </div>
              <Architecture sel={r.id} lens={lens} onSelect={(id) => go("repo", { repo: id, tab: "architecture" })} />
              <p className="arch-hint">{lensKey[lens]} Click a service to explore it.</p>
            </section>
            <div className="repo-side">
              <Walkthrough r={r} />
              <section className="panel takeaways">
                <h2><span className="sun" aria-hidden="true" />John’s key takeaways</h2>
                <ul>{r.takeaways.slice(0, 4).map((x) => <li key={x}>{x}</li>)}</ul>
              </section>
            </div>
          </div>
          <div className="repo-bottom">
            <SonarPanel r={r} />
            <JiraPanel r={r} />
          </div>
        </>
      )}

      {t === "decisions" && (
        <div className="cards3">
          {(decisions.length ? decisions.map((d) => ({ title: d.title, body: d.summary, foot: d.updated })) : r.takeaways.map((x, i) => ({ title: `Decision ${i + 1}`, body: x, foot: "From John’s interview" }))).map((d) => (
            <article key={d.title} className="panel decision">
              <span className="decision-icon" aria-hidden="true"><Icon name="bulb" size={20} /></span>
              <h2>{d.title}</h2>
              <p>{d.body}</p>
              <small>{d.foot}</small>
            </article>
          ))}
        </div>
      )}

      {t === "incidents" && (
        incidents.length ? (
          <div className="incidents">
            {incidents.map((j) => (
              <article key={j.key} className="panel incident">
                <div className="inc-meta"><span className={`inc-tag ${j.type === "Incident" ? "is-inc" : ""}`}>{j.type}</span><small>{j.key} · {j.month}</small></div>
                <h2>{j.title}</h2>
                {j.johnNote && <blockquote><Avatar id="john" size={28} /><p>“{j.johnNote}”</p></blockquote>}
              </article>
            ))}
          </div>
        ) : <section className="panel empty"><span className="empty-icon"><Icon name="check" size={22} /></span><h2>No incidents</h2><p>{r.name} has been quiet. Nothing to worry about here.</p></section>
      )}
    </div>
  )
}

// ─── Notes ──────────────────────────────────────────────────────────────
const noteTone: Record<string, Tone> = { Decision: "blue", Runbook: "yellow", Postmortem: "rose", Guide: "mint", Interview: "violet" }
export function NotesScreen() {
  const { go } = useApp()
  const rest = docs.filter((d) => d.id !== "interview").slice(0, 6)
  return (
    <div className="screen narrow">
      <header className="title"><h1>John’s Notes</h1><p>Decisions, runbooks and the story behind the code.</p></header>
      <button className="feature" onClick={() => go("ask")}>
        <span className="feature-img"><Photo alt="John during his exit interview" /></span>
        <span className="feature-body">
          <span className="kicker">Exit interview</span>
          <strong>Everything John wanted you to know, in {interview.minutes} minutes</strong>
          <span className="feature-stats"><span><b>{interview.facts}</b> facts</span><span><b>{interview.questions}</b> open questions</span><span><b>7</b> chapters</span></span>
          <span className="feature-cta">Ask about it <Icon name="arrow" size={16} /></span>
        </span>
      </button>
      <div className="notes">
        {rest.map((d) => (
          <article key={d.id} className="panel note">
            <span className={`note-icon tint--${noteTone[d.kind]}`} aria-hidden="true"><Icon name={d.kind === "Runbook" ? "tool" : d.kind === "Postmortem" ? "alert" : d.kind === "Guide" ? "note" : "bulb"} size={20} /></span>
            <small className="kind">{d.kind}</small>
            <h2>{d.title.replace(/^ADR-\d+: /, "")}</h2>
            <p>{d.summary}</p>
            <small className="date">{d.updated}</small>
          </article>
        ))}
      </div>
    </div>
  )
}

// ─── Tools ──────────────────────────────────────────────────────────────
const tools: { name: string; kind: string; tip: string; tint: Tone; mono: string }[] = [
  { name: "GitHub", kind: "Code & reviews", tip: "Small PRs. Maya reviews payments.", tint: "violet", mono: "Gh" },
  { name: "Jira", kind: "Tickets", tip: "Every incident gets a ticket.", tint: "blue", mono: "Ji" },
  { name: "SonarQube", kind: "Code health", tip: "The gate blocks merges. Respect it.", tint: "mint", mono: "Sq" },
  { name: "Datadog", kind: "Monitoring", tip: "Watch “Payments golden signals”.", tint: "violet", mono: "Dd" },
  { name: "Docker", kind: "Local stack", tip: "Compose, not minikube.", tint: "blue", mono: "Dk" },
  { name: "Vault", kind: "Secrets", tip: "Request it on day one.", tint: "yellow", mono: "Va" },
  { name: "Kafka", kind: "Events", tip: "Ledger events lag a few minutes.", tint: "rose", mono: "Ka" },
  { name: "PostgreSQL", kind: "Database", tip: "Idempotency keys live here.", tint: "mint", mono: "Pg" },
]
const ship = ["Branch", "Pull request", "Quality gate", "Staging", "Production"]
export function ToolsScreen() {
  const { toast } = useApp()
  const downloadAll = () => {
    const lines = [
      "# John’s tools — setup kit",
      "",
      "Everything John used every day, with one tip for each.",
      "",
      "## Tools",
      "",
      ...tools.map((t) => `- **${t.name}** (${t.kind}): ${t.tip}`),
      "",
      "## Get access first",
      "",
      ...access.map((a) => `- [ ] ${a.name} — ${a.why} (approver: ${person(a.approver).name}, ${a.eta})`),
      "",
      "## Run payments-service locally",
      "",
      "```bash",
      ...setupCommands.flatMap((c) => [`# ${c.label}`, c.cmd]),
      "```",
      "",
      "## How code ships",
      "",
      ship.map((x, i) => `${i + 1}. ${x}`).join("\n"),
      "",
    ]
    try {
      const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/markdown" }))
      const a = document.createElement("a")
      a.href = url
      a.download = "johns-tools-setup.md"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      toast("Downloaded johns-tools-setup.md")
    } catch {
      toast("Download isn’t available here")
    }
  }
  return (
    <div className="screen narrow">
      <header className="title title--row">
        <div><h1>John’s Tools</h1><p>The eight tools he used every day, and one tip for each.</p></div>
        <button className="download" onClick={downloadAll}><Icon name="download" size={18} />Download all</button>
      </header>
      <div className="tools">
        {tools.map((t) => (
          <article key={t.name} className="panel tool">
            <span className={`tool-mark tint--${t.tint}`} aria-hidden="true">{t.mono}</span>
            <h2>{t.name}</h2>
            <small>{t.kind}</small>
            <p>{t.tip}</p>
          </article>
        ))}
      </div>
      <section className="panel ship">
        <h2>How code ships</h2>
        <ol>
          {ship.map((s, i) => <li key={s} className={i === 2 ? "is-gate" : ""}><span>{i + 1}</span>{s}</li>)}
        </ol>
      </section>
    </div>
  )
}

// ─── Team (floor plan) ──────────────────────────────────────────────────
const rooms: { id: string; label: string; x: number; y: number; w: number; h: number; tint: Tone | "plain" }[] = [
  { id: "infra", label: "Infrastructure", x: 20, y: 20, w: 300, h: 196, tint: "violet" },
  { id: "product", label: "Product", x: 20, y: 228, w: 300, h: 176, tint: "rose" },
  { id: "data", label: "Data & Risk", x: 20, y: 416, w: 300, h: 184, tint: "yellow" },
  { id: "payments", label: "Payments", x: 332, y: 20, w: 436, h: 384, tint: "mint" },
  { id: "meeting", label: "Meeting room", x: 780, y: 20, w: 200, h: 220, tint: "plain" },
  { id: "focus", label: "Focus room", x: 780, y: 252, w: 200, h: 152, tint: "plain" },
  { id: "lounge", label: "Lounge & kitchen", x: 332, y: 416, w: 648, h: 184, tint: "plain" },
]
const seats: { id: string; x: number; y: number }[] = [
  { id: "alex", x: 170, y: 140 },
  { id: "priya", x: 170, y: 335 },
  { id: "zhuoning", x: 105, y: 525 },
  { id: "ava", x: 235, y: 525 },
  { id: "maya", x: 440, y: 160 },
  { id: "john", x: 550, y: 160 },
  { id: "prateek", x: 660, y: 160 },
  { id: "me", x: 550, y: 320 },
]
const hueFill: Record<string, [string, string]> = {
  mint: ["#d3f2e2", "#17694a"], blue: ["#dae7ff", "#2453a3"], violet: ["#e4ddff", "#5640b8"], rose: ["#ffdfe2", "#b42335"], yellow: ["#ffefc2", "#8a6209"],
}

function Seat({ id, selected, onSelect }: { id: string; selected: boolean; onSelect: () => void }) {
  const s = seats.find((x) => x.id === id)!
  const p = person(id)
  const [bg, fg] = hueFill[p.hue]
  const left = p.presence === "left"
  const you = p.presence === "you"
  const [broken, setBroken] = useState(false)
  return (
    <g className={`seat ${selected ? "is-sel" : ""} ${left ? "is-left" : ""}`} transform={`translate(${s.x} ${s.y})`} role="button" tabIndex={0} aria-label={p.name} onClick={onSelect} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect())}>
      <rect x="-48" y="-66" width="96" height="36" rx="7" className="desk" />
      <rect x="-16" y="-60" width="32" height="5" rx="2.5" className="screen-bar" />
      {(left || you) && <rect x="-58" y="-74" width="116" height="148" rx="16" className={left ? "outline outline--left" : "outline outline--you"} />}
      <circle r="27" className="ring" />
      <circle r="23" fill={bg} />
      <text y="6" textAnchor="middle" className="ini" fill={fg}>{p.initials}</text>
      {p.photo && !broken && (
        <>
          <clipPath id={`clip-${id}`}><circle r="23" /></clipPath>
          <image href={p.photo} x="-23" y="-23" width="46" height="46" clipPath={`url(#clip-${id})`} preserveAspectRatio="xMidYMid slice" className={left ? "faded" : ""} onError={() => setBroken(true)} />
        </>
      )}
      {!you && !left && <circle cx="17" cy="17" r="6" className={`pres pres--${p.presence}`} />}
      <text y="44" textAnchor="middle" className="seat-name">{left ? "John’s desk" : you ? "Your desk" : p.name.split(" ")[0]}</text>
      <text y="60" textAnchor="middle" className="seat-role">{left ? "Empty since Oct 1" : you ? "Next to Maya" : p.role.split(" ")[0] === "Payments" ? p.role.replace("Payments ", "") : p.role.split(" &")[0]}</text>
    </g>
  )
}

function Plant({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return <g transform={`translate(${x} ${y})`}><circle r={r + 4} className="pot" /><circle r={r} className="leaf" /><circle cx={-r / 3} cy={-r / 3} r={r / 2.2} className="leaf-hi" /></g>
}

export function TeamScreen() {
  const { personId } = useApp()
  const [sel, setSel] = useState(personId || "maya")
  useEffect(() => { if (personId) setSel(personId) }, [personId])
  const p = person(sel)
  const knows = repos.filter((r) => r.contributors.some((c) => c.id === p.id)).map((r) => r.name)
  return (
    <div className="screen team">
      <header className="title"><h1>Team</h1><p>Who worked with John, where they sit, and who to reach out to.</p></header>
      <div className="team-grid">
        <section className="plan-wrap" aria-label="Office floor plan">
          <svg className="plan" viewBox="0 0 1000 620">
            <rect x="6" y="6" width="988" height="608" rx="22" className="floor" />
            {rooms.map((r) => (
              <g key={r.id}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="14" className={`room room--${r.tint}`} />
                <text x={r.x + 20} y={r.y + 32} className={`room-label room-label--${r.tint}`}>{r.label}</text>
              </g>
            ))}
            {/* meeting room */}
            <ellipse cx="880" cy="140" rx="56" ry="34" className="table" />
            {[[-52, -46], [0, -52], [52, -46], [-52, 46], [0, 52], [52, 46]].map(([dx, dy], i) => <circle key={i} cx={880 + dx} cy={140 + dy} r="10" className="chair" />)}
            {/* focus room */}
            <circle cx="880" cy="340" r="26" className="table" />
            <circle cx="842" cy="340" r="10" className="chair" /><circle cx="918" cy="340" r="10" className="chair" />
            {/* lounge */}
            <rect x="372" y="478" width="200" height="56" rx="20" className="sofa" />
            <rect x="388" y="540" width="168" height="34" rx="12" className="table" />
            <rect x="620" y="470" width="150" height="100" rx="50" className="rug" />
            <circle cx="695" cy="520" r="22" className="table" />
            <rect x="820" y="456" width="140" height="40" rx="10" className="counter" />
            <rect x="820" y="504" width="40" height="76" rx="10" className="counter" />
            <text x="890" y="481" textAnchor="middle" className="room-note">Coffee</text>
            <g className="wb" transform="translate(22 0)">
              <rect x="600" y="262" width="128" height="92" rx="8" />
              <text x="614" y="286">payments flow</text>
              <path d="M614 304h22v14h-22zM646 304h26v14h-26zM682 304h22v14h-22zM636 311h10M672 311h10M620 334h88M620 344h70" />
            </g>
            <Plant x={300} y={196} /><Plant x={748} y={44} r={14} /><Plant x={352} y={384} r={10} /><Plant x={958} y={580} r={14} /><Plant x={300} y={580} r={10} /><Plant x={42} y={384} r={10} />
            {seats.map((s) => <Seat key={s.id} id={s.id} selected={sel === s.id} onSelect={() => s.id !== "me" && setSel(s.id)} />)}
          </svg>
        </section>
        <aside className="panel profile">
          <Avatar p={p} size={88} />
          <h2>{p.name}</h2>
          <small>{p.role}</small>
          {p.presence !== "left" && <span className={`online online--${p.presence}`}><i />{p.presence === "online" ? "Online" : "Away"} · {p.tz}</span>}
          <blockquote>“{p.fromJohn}”<cite>John</cite></blockquote>
          {knows.length > 0 && <div className="tags">{knows.map((k) => <span key={k}>{k}</span>)}</div>}
          {p.presence !== "left" && <a className="teams" href="https://teams.microsoft.com/l/chat/0/0" target="_blank" rel="noreferrer"><TeamsLogo /> Chat on Teams</a>}
        </aside>
      </div>
    </div>
  )
}

// ─── Advice (Ask John) ──────────────────────────────────────────────────
type Turn = { q: string; a?: Answer }
export function AdviceScreen() {
  const { pendingQ, clearQ, repoId } = useApp()
  const [turns, setTurns] = useState<Turn[]>([])
  const [q, setQ] = useState("")
  const thread = useRef<HTMLDivElement>(null)
  const busy = turns.some((t) => !t.a)
  const ask = (v: string) => {
    if (!v.trim() || busy) return
    setTurns((t) => [...t, { q: v }])
    setQ("")
    window.setTimeout(() => setTurns((t) => t.map((x) => (x.a ? x : { ...x, a: answer(v, repoId) }))), 650)
  }
  useEffect(() => { if (pendingQ) { ask(pendingQ); clearQ() } }, [pendingQ])
  useEffect(() => { const el = thread.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }) }, [turns])
  const starters = [
    { q: "Can I change the retry logic?", d: "The rule John cared about most" },
    { q: "What should my first commit be?", d: "A safe place to start" },
    { q: "Which repo is riskiest?", d: "Where only John knew the code" },
    { q: "Why does the geo rule exclude Canada?", d: "Something John didn’t know" },
  ]
  return (
    <div className="screen advice">
      <section className="convo">
        {turns.length === 0 ? (
          <div className="intro">
            <span className="intro-photo"><Photo alt="John Carter" /></span>
            <h1>Ask John anything</h1>
            <p>I sat down with John for {interview.minutes} minutes before he left. I’ll tell you what he said, and I’ll tell you when he didn’t know.</p>
            <div className="starters">
              {starters.map((s) => <button key={s.q} onClick={() => ask(s.q)}><strong>{s.q}</strong><small>{s.d}</small></button>)}
            </div>
          </div>
        ) : (
          <div className="thread" ref={thread} aria-live="polite">
            {turns.map((t, i) => (
              <div key={i} className="turn">
                <div className="bubble bubble--me"><p>{t.q}</p></div>
                {t.a ? <AnswerBubble a={t.a} /> : <div className="typing"><i /><i /><i /></div>}
                {t.a && i === turns.length - 1 && t.a.follow.length > 0 && (
                  <div className="follow">
                    {t.a.follow.slice(0, 2).map((f) => <button key={f} onClick={() => ask(f)}>{f}</button>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <form className="ask-bar ask-bar--lg" onSubmit={(e) => { e.preventDefault(); ask(q) }}>
          <label className="sr-only" htmlFor="advice-ask">Ask John</label>
          <input id="advice-ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything about John’s work…" />
          <button type="submit" aria-label="Ask" disabled={!q.trim() || busy}><Icon name="arrow" size={18} /></button>
        </form>
      </section>
    </div>
  )
}

export const _people = people

// ─── Up next: a gentle linear path through John's world ────────────────
const path: { v: View; title: string; line: string }[] = [
  { v: "home", title: "", line: "" },
  { v: "repo", title: "John’s architecture", line: "See how the services connect and what he’d tell you about each." },
  { v: "docs", title: "John’s notes", line: "The decisions behind the code, and his exit interview." },
  { v: "tools", title: "John’s tools", line: "What he used every day, with one tip for each." },
  { v: "team", title: "The team", line: "Who to ask now that John is gone." },
  { v: "first", title: "Your first commit", line: "Pick a ticket and ship it with the agent’s help." },
]
export function UpNext({ view, compact = false }: { view: View; compact?: boolean }) {
  const { go } = useApp()
  const i = path.findIndex((p) => p.v === view)
  const next = path[i + 1]
  if (i < 0 || !next) return null
  if (compact)
    return (
      <button className="upnext upnext--compact" onClick={() => go(next.v)}>
        <span className="upnext-text"><small>Up next</small><strong>{next.title}</strong></span>
        <span className="upnext-go"><Icon name="arrow" size={18} /></span>
      </button>
    )
  return (
    <div className="upnext-wrap">
      <button className="upnext" onClick={() => go(next.v)}>
        <span className="upnext-steps" aria-hidden="true">{path.slice(1).map((p, k) => <i key={p.v} className={k + 1 <= i ? "done" : k + 1 === i + 1 ? "here" : ""} />)}</span>
        <span className="upnext-text"><small>Up next</small><strong>{next.title}</strong><span>{next.line}</span></span>
        <span className="upnext-go"><Icon name="arrow" size={20} /></span>
      </button>
    </div>
  )
}
