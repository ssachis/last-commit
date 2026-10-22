import { useState } from "react"
import { JOHN_PHOTO } from "./data"
import type { View } from "./data"
import { AppCtx, Avatar, Icon, Logo } from "./ui"
import type { GoOpts } from "./ui"
import { FirstCommitScreen } from "./firstcommit"
import { AdviceScreen, HomeScreen, NotesScreen, RepoScreen, TeamScreen, ToolsScreen, UpNext } from "./screens"

const nav: { id: View; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "repo", label: "Repositories", icon: "code" },
  { id: "docs", label: "Notes", icon: "note" },
  { id: "tools", label: "Tools", icon: "tool" },
  { id: "team", label: "Team", icon: "team" },
  { id: "first", label: "First commit", icon: "flag" },
  { id: "ask", label: "Advice", icon: "bulb" },
]

function Welcome({ enter }: { enter: (v: View) => void }) {
  const [broken, setBroken] = useState(false)
  const shortcuts: { label: string; v: View; icon: string; tint: string }[] = [
    { label: "His work", v: "repo", icon: "code", tint: "mint" },
    { label: "His notes", v: "docs", icon: "note", tint: "blue" },
    { label: "His tools", v: "tools", icon: "tool", tint: "violet" },
    { label: "His team", v: "team", icon: "team", tint: "rose" },
    { label: "His advice", v: "ask", icon: "bulb", tint: "yellow" },
  ]
  return (
    <main className="welcome">
      <div className="welcome-photo" aria-hidden="true">
        {!broken ? <img src={JOHN_PHOTO} alt="" onError={() => setBroken(true)} /> : <span className="photo-fallback" />}
        <span className="wall-note">Build<br />Solve<br />Iterate<br /><em>– John</em></span>
      </div>
      <header className="welcome-top">
        <div className="brand">
          <span className="logo-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <div>
            <span className="brand-word">Last<br />Commit</span>
            <p>They leave. Their world of work stays.</p>
          </div>
        </div>
      </header>
      <section className="welcome-card">
        <h1>Welcome to<br /><span className="nowrap"><em>John’s World</em> <span className="wave" aria-hidden="true">👋</span></span></h1>
        <p>Explore John’s work, notes, tools and advice to get up to speed.</p>
        <div className="shortcuts">
          {shortcuts.map((s) => (
            <button key={s.label} onClick={() => enter(s.v)}>
              <span className={`sc-icon tint--${s.tint}`}><Icon name={s.icon} size={26} /></span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
        <button className="enter" onClick={() => enter("home")}>Enter John’s World <Icon name="arrow" size={22} /></button>
      </section>
    </main>
  )
}

function Shell({ start }: { start: View }) {
  const [view, setView] = useState<View>(start)
  const [repoId, setRepoId] = useState("payments")
  const [tab, setTab] = useState("architecture")
  const [docId, setDocId] = useState("")
  const [personId, setPersonId] = useState("")
  const [pendingQ, setPendingQ] = useState("")
  const [toastMsg, setToastMsg] = useState("")
  const [search, setSearch] = useState("")
  const go = (v0: View, o: GoOpts = {}) => {
    const v: View = v0 === "codebase" ? "repo" : v0
    setView(v)
    if (o.repo) setRepoId(o.repo)
    if (v === "repo") setTab(o.tab ?? "architecture")
    setDocId(o.doc ?? "")
    setPersonId(o.person ?? "")
    if (o.q) setPendingQ(o.q)
    window.scrollTo({ top: 0 })
  }
  const toast = (m: string) => { setToastMsg(m); window.setTimeout(() => setToastMsg(""), 2400) }
  const ctx = { view, go, repoId, tab, docId, personId, pendingQ, clearQ: () => setPendingQ(""), visited: new Set<View>(), toast }
  return (
    <AppCtx.Provider value={ctx}>
      <div className="shell">
        <aside className="side">
          <Logo compact />
          <nav aria-label="Primary">
            {nav.map((n) => (
              <button key={n.id} className={view === n.id ? "active" : ""} aria-current={view === n.id ? "page" : undefined} onClick={() => go(n.id)}>
                <Icon name={n.icon} size={22} /><span>{n.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <div className="main">
          <header className="top">
            <form className="search" onSubmit={(e) => { e.preventDefault(); if (search.trim()) { go("ask", { q: search.trim() }); setSearch("") } }}>
              <Icon name="search" size={18} />
              <label className="sr-only" htmlFor="search">Search</label>
              <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search John’s work, notes, tools, team…" />
            </form>
            <button className="me" aria-label="Your profile"><Avatar id="me" size={40} /><span>New Joiner</span><Icon name="chevron" size={18} /></button>
          </header>
          {view === "home" && <HomeScreen />}
          {view === "repo" && <RepoScreen />}
          {view === "docs" && <NotesScreen />}
          {view === "tools" && <ToolsScreen />}
          {view === "team" && <TeamScreen />}
          {view === "first" && <FirstCommitScreen />}
          {view === "ask" && <AdviceScreen />}
          {view !== "home" && <UpNext view={view} />}
        </div>
        {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
      </div>
    </AppCtx.Provider>
  )
}

export default function App() {
  const [start, setStart] = useState<View | null>(null)
  return start ? <Shell start={start} /> : <Welcome enter={setStart} />
}
