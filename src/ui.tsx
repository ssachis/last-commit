import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import { people, person, repo, repos, starters, docs } from "./data"
import type { Person, Repo, Status, View } from "./data"

// ─── App context ────────────────────────────────────────────────────────
export type GoOpts = { repo?: string; tab?: string; doc?: string; q?: string; person?: string }
export type Ctx = {
  view: View
  go: (v: View, o?: GoOpts) => void
  repoId: string
  tab: string
  docId: string
  personId: string
  pendingQ: string
  clearQ: () => void
  visited: Set<View>
  toast: (msg: string) => void
}
export const AppCtx = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(AppCtx)

// ─── Icons ──────────────────────────────────────────────────────────────
const P: Record<string, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
  map: <><path d="M12 3 3 8l9 5 9-5z" /><path d="m3 13 9 5 9-5M3 17.5l9 5 9-5" /></>,
  code: <path d="m8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18" />,
  note: <><path d="M6 3h10l3 3v15H6z" /><path d="M9 10h7M9 14h7M9 18h4" /></>,
  tool: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /></>,
  team: <><circle cx="9" cy="8" r="4" /><path d="M2 21v-2a6 6 0 0 1 12 0v2M16 4a4 4 0 0 1 0 8M18 15a5 5 0 0 1 4 5v1" /></>,
  chat: <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></>,
  flag: <><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
  ext: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v6H4V6h6" /></>,
  github: <path d="M9 19c-4 1.2-4-2-5-2.5M14 22v-3.5a3 3 0 0 0-.8-2.4c2.7-.3 5.5-1.3 5.5-6A4.6 4.6 0 0 0 17.5 7 4.3 4.3 0 0 0 17.4 4S16.5 3.7 14 5a10.4 10.4 0 0 0-5 0C6.5 3.7 5.6 4 5.6 4A4.3 4.3 0 0 0 5.5 7a4.6 4.6 0 0 0-1.2 3.1c0 4.7 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.4V22" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  expand: <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />,
  send: <path d="m22 2-9 20-2-9-9-2zM22 2 11 13" />,
  play: <path d="M7 4v16l13-8z" fill="currentColor" />,
  pause: <path d="M7 4h3v16H7zM14 4h3v16h-3z" fill="currentColor" />,
  check: <path d="m4 12 5 5L20 6" />,
  branch: <><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="8" r="2" /><path d="M6 7v10M18 10c0 4-6 3-12 7" /></>,
  ticket: <><path d="M3 8a2 2 0 0 0 0 4v5h18v-5a2 2 0 0 1 0-4V4H3z" /><path d="M14 4v13" strokeDasharray="2 2" /></>,
  shield: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></>,
  file: <><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5" /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z" /></>,
  alert: <><path d="M12 3 2 20h20z" /><path d="M12 10v4M12 17h.01" /></>,
  question: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01" /></>,
  plug: <><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5" /></>,
  sonar: <><path d="M3 12a9 9 0 0 1 9-9M6.5 12A5.5 5.5 0 0 1 12 6.5" /><circle cx="12" cy="12" r="2" /><path d="M14 14l6 6" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  download: <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></>,
  sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
}

export function Icon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {P[name] ?? P.sparkle}
    </svg>
  )
}

export function TeamsLogo({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24">
      <circle cx="17.5" cy="5" r="2.2" fill="#7b83eb" />
      <circle cx="12.4" cy="4.2" r="2.8" fill="#5059c9" />
      <path d="M14.5 8h5.8c.9 0 1.7.8 1.7 1.7v6.7c0 2.3-1.8 4.1-4.1 4.1s-4.1-1.8-4.1-4.1V8.7c0-.4.3-.7.7-.7Z" fill="#7b83eb" />
      <path d="M9.4 7h7c.9 0 1.6.7 1.6 1.6v7.8a5.6 5.6 0 0 1-11.2 0V9.6A2.6 2.6 0 0 1 9.4 7Z" fill="#5059c9" />
      <rect x="2" y="6" width="10" height="10" rx="1.8" fill="#6264a7" />
      <path d="M4.5 8.5h5v1.4H7.7v4.2H6.2V9.9H4.5Z" fill="#fff" />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? "logo--compact" : ""}`}>
      <span className="logo-mark" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="logo-word">Last<br />Commit</span>
    </div>
  )
}

// ─── Avatars ────────────────────────────────────────────────────────────
export function Avatar({ id, p, size = 40, presence = false }: { id?: string; p?: Person; size?: number; presence?: boolean }) {
  const who = p ?? person(id!)
  const [broken, setBroken] = useState(false)
  return (
    <span className={`avatar hue-${who.hue} ${who.presence === "left" ? "is-left" : ""}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }} title={who.name}>
      {who.photo && !broken ? <img src={who.photo} alt="" onError={() => setBroken(true)} /> : <b>{who.initials}</b>}
      {presence && <i className={`presence presence--${who.presence}`} />}
    </span>
  )
}

export function AvatarStack({ ids, size = 28 }: { ids: string[]; size?: number }) {
  return (
    <span className="avatar-stack">
      {ids.map((id) => <Avatar key={id} id={id} size={size} />)}
    </span>
  )
}

export function TeamsButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const who = person(id)
  if (who.presence === "left" || who.presence === "you") return null
  return (
    <a className={`teams-link ${compact ? "teams-link--compact" : ""}`} href="https://teams.microsoft.com/l/chat/0/0" target="_blank" rel="noreferrer" aria-label={`Message ${who.name} on Teams`}>
      <TeamsLogo size={compact ? 16 : 18} />
      {compact ? "Message" : "Message on Teams"}
    </a>
  )
}

// ─── Small atoms ────────────────────────────────────────────────────────
export const statusKey = (s: Status) => s.toLowerCase().replace(" ", "-")
export function StatusPill({ value }: { value: Status }) {
  return <span className={`status status--${statusKey(value)}`}><i />{value}</span>
}

export function Rating({ v }: { v: string }) {
  return <b className={`rating rating--${v === "—" ? "na" : v}`}>{v}</b>
}

export function Sparkline({ data, w = 160, h = 40 }: { data: number[]; w?: number; h?: number }) {
  if (!data.length) return <span className="muted small">No scans yet</span>
  const min = Math.min(...data) - 2
  const max = Math.max(...data) + 2
  const x = (i: number) => (i / (data.length - 1)) * (w - 8) + 4
  const y = (v: number) => h - 4 - ((v - min) / (max - min)) * (h - 8)
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={`${line} L${x(data.length - 1)} ${h} L${x(0)} ${h} Z`} className="spark-fill" />
      <path d={line} className="spark-line" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="3.2" className="spark-dot" />
    </svg>
  )
}

export function CopyLine({ cmd }: { cmd: string }) {
  const { toast } = useApp()
  const [done, setDone] = useState(false)
  const copy = () => {
    const ok = () => { setDone(true); toast("Copied to clipboard"); window.setTimeout(() => setDone(false), 1400) }
    try {
      navigator.clipboard.writeText(cmd).then(ok, () => toast("Select the text to copy it"))
    } catch {
      toast("Select the text to copy it")
    }
  }
  return (
    <div className="copy-line">
      <code>{cmd}</code>
      <button onClick={copy} aria-label="Copy command">{done ? <Icon name="check" size={16} /> : <Icon name="copy" size={16} />}</button>
    </div>
  )
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const { toast } = useApp()
  const copy = () => {
    try {
      navigator.clipboard.writeText(text).then(() => toast("Copied. Paste it into Teams."), () => toast("Select the text above to copy it"))
    } catch {
      toast("Select the text above to copy it")
    }
  }
  return <button className="btn" onClick={copy}><Icon name="copy" size={16} />{label}</button>
}

// ─── John's walkthrough card (video + whiteboard) ──────────────────────
export function Walkthrough({ r, tall = false }: { r: Repo; tall?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const [chapter, setChapter] = useState(0)
  const john = person("john")
  const [broken, setBroken] = useState(false)
  const chapters = r.chapters.length ? r.chapters : [{ t: "—", label: "No walkthrough recorded" }]
  const total = r.chapters.length ? `${Math.max(1, r.chapters.length)} min` : "None"
  return (
    <section className="walk card">
      <header className="card-head">
        <span className="card-title"><Icon name="video" /> John’s walkthrough of {r.name}</span>
        <span className="chip">{total}</span>
      </header>
      <div className={`walk-stage ${tall ? "walk-stage--tall" : ""}`}>
        <button className="walk-face" onClick={() => r.chapters.length && setPlaying(!playing)} aria-label={playing ? "Pause walkthrough" : "Play walkthrough"} disabled={!r.chapters.length}>
          {john.photo && !broken ? <img src={john.photo} alt="John Carter" onError={() => setBroken(true)} /> : <span className="walk-initials">JC</span>}
          <span className="walk-play"><Icon name={playing ? "pause" : "play"} size={18} /></span>
          {playing && <span className="walk-progress"><i style={{ width: `${((chapter + 1) / chapters.length) * 100}%` }} /></span>}
        </button>
        <div className="whiteboard" aria-label="Whiteboard sketch">
          <span className="wb-title">{r.name.split("-")[0]} flow</span>
          <div className="wb-flow">
            {r.whiteboard.flow.map((s, i) => (
              <span key={s} className="wb-step">{i > 0 && <i>→</i>}<b>{s}</b></span>
            ))}
          </div>
          <span className="wb-sub">{r.whiteboard.remember.length} things to remember:</span>
          <ol>{r.whiteboard.remember.map((s) => <li key={s}>{s}</li>)}</ol>
        </div>
      </div>
      {playing && <p className="walk-caption" aria-live="polite">“{chapters[chapter].label}.” <span className="muted">— John, {chapters[chapter].t}</span></p>}
      <ol className="chapters">
        {chapters.map((c, i) => (
          <li key={c.t + c.label}>
            <button className={i === chapter ? "active" : ""} onClick={() => { setChapter(i); if (r.chapters.length) setPlaying(true) }}>
              <span className="mono">{c.t}</span>{c.label}
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}

// ─── The "Ask John" agent (scripted for the prototype) ─────────────────
export type Source = { label: string; kind: "interview" | "ticket" | "doc" | "file" | "branch" | "sonar"; to?: { v: View; o?: GoOpts } }
export type Answer = { text: string; basis: "john" | "code" | "gap"; sources: Source[]; route?: string; follow: string[] }

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w))

export function answer(raw: string, ctxRepo?: string): Answer {
  const q = raw.toLowerCase()
  const r = repo(ctxRepo && has(q, "this", "here") ? ctxRepo : ctxRepo ?? "payments")
  const iv = (t: string): Source => ({ label: `Interview ${t}`, kind: "interview", to: { v: "docs", o: { doc: "interview" } } })
  const tk = (key: string, rid: string): Source => ({ label: key, kind: "ticket", to: { v: "repo", o: { repo: rid, tab: "jira" } } })
  const dc = (id: string): Source => ({ label: docs.find((d) => d.id === id)!.title.split(":")[0], kind: "doc", to: { v: "docs", o: { doc: id } } })
  const fl = (f: string, rid: string): Source => ({ label: f.split("/").pop()!, kind: "file", to: { v: "repo", o: { repo: rid, tab: "health" } } })

  if (has(q, "ttl", "24h", "72h"))
    return { basis: "gap", text: "John didn't know. He said he inherited the 24h idempotency TTL and never confirmed it with the provider. The provider can resend webhooks for up to 72h, so there may be a window for duplicates. Maya is the right person to decide.", sources: [iv("09:40"), dc("adr-idem"), tk("PAY-322", "payments")], route: "maya", follow: ["What happens with duplicate webhooks?", "Who approves payments changes?"] }
  if (has(q, "canada", "geo"))
    return { basis: "gap", text: "Nobody knows yet. The geo-mismatch rule excludes Canada, but there is no ticket, comment or doc explaining why, and John couldn't remember. Priya owns fraud rule intent, so ask her before touching it.", sources: [iv("18:55"), fl("rules/config/velocity.yaml", "fraud")], route: "priya", follow: ["Can I change a fraud threshold?"] }
  if (has(q, "retry", "retries"))
    return { basis: "john", text: "Carefully. John capped retries at 3 after incident #4821, when 5 retries without idempotency keys double-charged 312 customers. His rule: only raise the cap once every payment call carries an idempotency key. His unfinished branch feat/retry-backoff-v2 has wrong jitter math, so don't build on it. Get a design review with Maya first (PAY-308).", sources: [tk("INC-4821", "payments"), { label: "John’s walkthrough 1:12", kind: "interview", to: { v: "repo", o: { repo: "payments" } } }, fl("payments/retry/RetryHandler.py", "payments"), dc("adr-retry")], route: "maya", follow: ["What's wrong with feat/retry-backoff-v2?", "Why is the idempotency TTL 24h?"] }
  if (has(q, "idempot"))
    return { basis: "john", text: "Every capture and refund sends an Idempotency-Key (merchant + order + attempt). The store keeps keys for 24h. The gateway must forward the header, so if you add a payments route, add it to the gateway allowlist too, or keys get dropped silently.", sources: [dc("adr-idem"), fl("payments/idempotency/store.py", "payments"), tk("PLAT-88", "api")], follow: ["Why is the idempotency TTL 24h?", "Can I change the retry logic?"] }
  if (has(q, "webhook", "duplicate"))
    return { basis: "john", text: "The provider resends events on 5xx and occasionally on 200. The consumer dedupes on event id, but only for 24h. PAY-322 is still open. SonarQube flags that the duplicate-event guard in consumer.py has no tests, so that's a good, safe place to add value.", sources: [tk("PAY-322", "payments"), fl("payments/webhooks/consumer.py", "payments"), iv("08:15")], follow: ["Why is the idempotency TTL 24h?"] }
  if (has(q, "branch", "unfinished", "merge", "backoff"))
    return { basis: "john", text: "John left 5 branches open. Don't merge feat/retry-backoff-v2 (jitter math is wrong). Finish chore/py312-upgrade (only the asyncpg pin blocked it). fix/rule-eval-sandbox in fraud-detection needs tests, then it closes two security findings. feat/fx-tolerance in reconciliation needs Zhuoning's review. Delete spike/ledger-events.", sources: [{ label: "Branches · payments-service", kind: "branch", to: { v: "repo", o: { repo: "payments", tab: "branches" } } }, iv("22:05")], follow: ["What should my first commit be?"] }
  if (has(q, "recon", "fuzzy", "jpy", "currenc", "match"))
    return { basis: "john", text: "reconciliation-engine is the highest knowledge risk: John wrote 76% of it. The trap is zero-decimal currencies (JPY, KRW). Naive rounding broke the nightly run three nights in a row (REC-40). When the DAG fails, read the DAG log before the code. The 72h matching window has no data behind it, which is an open question for Zhuoning.", sources: [tk("REC-40", "recon"), dc("rb-recon"), fl("matching/fuzzy_match.py", "recon"), iv("11:35")], route: "zhuoning", follow: ["Why is the fuzzy match window 72 hours?"] }
  if (has(q, "72 hour", "window"))
    return { basis: "gap", text: "Not answerable from John's knowledge. He said the 72h window “felt right at the time”. There's no data or ticket behind it. Zhuoning can pull settlement timing data to check.", sources: [iv("14:02")], route: "zhuoning", follow: [] }
  if (has(q, "fraud", "threshold", "rule"))
    return { basis: "john", text: "Fraud rules are YAML config, and every change is a production change. John's rule: never change a threshold without Ava, because model scores are not linear. Two rules have no recorded reason (including the Canada exclusion). SonarQube shows two vulnerabilities from eval() on config, and fix/rule-eval-sandbox fixes them once it has tests.", sources: [dc("guide-fraud"), tk("FRD-162", "fraud"), { label: "fix/rule-eval-sandbox", kind: "branch", to: { v: "repo", o: { repo: "fraud", tab: "branches" } } }], route: "ava", follow: ["Why does the geo rule exclude Canada?"] }
  if (has(q, "ledger", "async", "lag", "delay", "kafka"))
    return { basis: "john", text: "ledger-sync is asynchronous by design. Expect a few minutes of lag, and month-end batches are about 20× normal size. PAY-294 looked like a payments bug but the real cause was the batch timeout in ledger-sync (LDG-77).", sources: [tk("LDG-77", "ledger"), tk("PAY-294", "payments"), iv("06:30")], route: "zhuoning", follow: ["How do we replay events after a Kafka outage?"] }
  if (has(q, "replay", "outage"))
    return { basis: "gap", text: "John only remembered that “there's a script somewhere”. No doc or runbook covers replaying ledger events. This is a real gap. Ask Zhuoning, then write it down.", sources: [iv("16:10")], route: "zhuoning", follow: [] }
  if (has(q, "first", "start", "begin", "commit", "work on"))
    return { basis: "code", text: `Start with ${starters[0].key} in notification-service: “${starters[0].title}”. It's low risk (green quality gate, 88% coverage) and Prateek reviews within a day. After that, finishing John's Python 3.12 branch in payments-service is a meaningful second PR.`, sources: [tk(starters[0].key, "notification"), { label: "Quality gate · passed", kind: "sonar", to: { v: "repo", o: { repo: "notification", tab: "health" } } }], route: "prateek", follow: ["Can I change the retry logic?", "Which repo is riskiest?"] }
  if (has(q, "risk", "danger", "fragile", "worried"))
    return { basis: "code", text: "By knowledge risk: reconciliation-engine (76% John's code, failing quality gate), payments-service (64%, 3 open bugs in RetryHandler.py) and fraud-detection (41%, 2 vulnerabilities). user-service is a blind spot: never scanned and no owner.", sources: [{ label: "SonarQube · 6 repos", kind: "sonar", to: { v: "codebase" } }, iv("00:00")], follow: ["What do I need to know about reconciliation?", "Who owns user-service?"] }
  if (has(q, "who", "owner", "ask", "contact"))
    return { basis: "code", text: `For ${r.name}, ${person(r.interim).name} is the interim owner. ${r.contributors.filter((c) => c.id !== "john" && c.id !== r.interim).map((c) => person(c.id).name).join(" and ") || "Nobody else"} also commit${r.contributors.length > 2 ? "" : "s"} there. ${person(r.interim).fromJohn}`, sources: [{ label: "CODEOWNERS", kind: "file", to: { v: "repo", o: { repo: r.id } } }, iv("26:40")], route: r.interim, follow: ["What should my first commit be?"] }
  if (has(q, "sonar", "coverage", "quality", "health", "bug"))
    return { basis: "code", text: `${r.name}: quality gate ${r.sonar.gate.toLowerCase()}, ${r.sonar.coverage}% coverage, ${r.sonar.bugs} bugs, ${r.sonar.vulns} vulnerabilities, ${r.sonar.debt} of tech debt. The hottest file is ${r.sonar.files[0]?.file ?? "n/a"}.`, sources: [{ label: `SonarQube · ${r.name}`, kind: "sonar", to: { v: "repo", o: { repo: r.id, tab: "health" } } }], follow: ["Which repo is riskiest?"] }
  if (has(q, "summar", "what did john", "changes", "recent"))
    return { basis: "code", text: r.summary, sources: [{ label: `Jira trail · ${r.name}`, kind: "ticket", to: { v: "repo", o: { repo: r.id, tab: "jira" } } }], follow: ["What branches did John leave open?"] }
  return { basis: "gap", text: `John didn't cover that in the interview, and I couldn't find it in the code, tickets or docs. I've logged it as an open question. ${person(r.interim).name} is the best person to ask for ${r.name}.`, sources: [], route: r.interim, follow: ["Can I change the retry logic?", "What should my first commit be?"] }
}

export function BasisTag({ b }: { b: Answer["basis"] }) {
  const label = { john: "From John", code: "From code & tickets", gap: "Gap: John didn't know" }[b]
  return <span className={`basis basis--${b}`}>{label}</span>
}

export function SourceChips({ sources }: { sources: Source[] }) {
  const { go } = useApp()
  const icon = { interview: "video", ticket: "ticket", doc: "note", file: "file", branch: "branch", sonar: "sonar" }
  return (
    <div className="source-chips">
      {sources.map((s) => (
        <button key={s.label} onClick={() => s.to && go(s.to.v, s.to.o)}>
          <Icon name={icon[s.kind]} size={15} />{s.label}
        </button>
      ))}
    </div>
  )
}

export function AnswerBubble({ a }: { a: Answer }) {
  return (
    <div className="bubble bubble--agent">
      <span className="agent-mark" aria-hidden="true"><i /><i /><i /></span>
      <div className="bubble-body">
        <BasisTag b={a.basis} />
        <p>{a.text}</p>
        {a.sources.length > 0 && <SourceChips sources={a.sources} />}
        {a.route && (
          <div className="route">
            <Avatar id={a.route} size={26} />
            <span>{a.basis === "gap" ? "Best person to ask" : "Confirm with"} <b>{person(a.route).name}</b></span>
            <TeamsButton id={a.route} compact />
          </div>
        )}
      </div>
    </div>
  )
}

// Compact ask box used on repo pages: answers inline, scoped to a repo.
export function MiniAsk({ repoId, prompts }: { repoId: string; prompts: string[] }) {
  const [q, setQ] = useState("")
  const [asked, setAsked] = useState<{ q: string; a: Answer } | null>(null)
  const { go } = useApp()
  const submit = (value: string) => {
    if (!value.trim()) return
    setAsked({ q: value, a: answer(value, repoId) })
    setQ("")
  }
  return (
    <section className="mini-ask card">
      <header className="card-head">
        <span className="card-title"><span className="agent-mark agent-mark--sm" aria-hidden="true"><i /><i /><i /></span> Ask John’s agent</span>
        <button className="link-btn" onClick={() => go("ask", { repo: repoId })}>Open full chat <Icon name="arrow" size={15} /></button>
      </header>
      {asked ? (
        <div className="mini-thread">
          <div className="bubble bubble--me"><Avatar id="me" size={28} /><p>{asked.q}</p></div>
          <AnswerBubble a={asked.a} />
        </div>
      ) : (
        <p className="muted small">Trained on John’s 32-min exit interview, his commits, tickets and docs. It tells you when it doesn’t know.</p>
      )}
      <div className="suggestions">
        {(asked ? asked.a.follow : prompts).slice(0, 3).map((s) => <button key={s} onClick={() => submit(s)}>{s}</button>)}
      </div>
      <form className="ask-form" onSubmit={(e) => { e.preventDefault(); submit(q) }}>
        <label className="sr-only" htmlFor={`mini-${repoId}`}>Ask about {repo(repoId).name}</label>
        <input id={`mini-${repoId}`} value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Ask about ${repo(repoId).name}…`} />
        <button type="submit" disabled={!q.trim()} aria-label="Send"><Icon name="send" size={17} /></button>
      </form>
    </section>
  )
}

export const allRepoIds = repos.map((r) => r.id)
export const everyone = people
