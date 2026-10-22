import { useEffect, useState } from "react"
import { person, repo } from "./data"
import type { Status } from "./data"
import { answer, AnswerBubble, Avatar, CopyLine, Icon, statusKey } from "./ui"
import type { Answer } from "./ui"

/* First commit — pick a repo → pick a Jira ticket → build it with John's agent.
   One screen, three steps. Tickets are hardcoded "ready to pick up" Jira issues. */

type Pickup = {
  key: string
  title: string
  size: string
  risk: "Low" | "Medium"
  mentor: string
  files: string[]
  why: string
  tip: string
  start?: boolean
}

const pickups: Record<string, Pickup[]> = {
  notification: [
    { key: "NTF-219", title: "Add structured log fields to the webhook handler", size: "½ day", risk: "Low", mentor: "prateek", start: true, files: ["src/webhooks/handler.ts", "src/webhooks/handler.test.ts"], why: "Well tested, green quality gate, and you’ll learn the payment.status event everyone uses.", tip: "Log the idempotency key and event id. Those are the two fields everyone searches for in an incident." },
    { key: "NTF-224", title: "SMS receipt copy for refunds", size: "½ day", risk: "Low", mentor: "prateek", files: ["src/templates/receipt.ts"], why: "Pure template change with snapshot tests.", tip: "Run the snapshot update, then read the diff by eye. Twice." },
  ],
  payments: [
    { key: "PAY-331", title: "Finish the Python 3.12 upgrade", size: "1–2 days", risk: "Medium", mentor: "maya", files: ["pyproject.toml", "Dockerfile", ".github/workflows/ci.yml"], why: "John’s branch is 90% done. Only the asyncpg pin blocked it.", tip: "Rebase onto main first. It’s 22 commits behind." },
    { key: "PAY-335", title: "Add a test for the duplicate-webhook guard", size: "1 day", risk: "Low", mentor: "maya", start: true, files: ["payments/webhooks/consumer.py", "tests/test_consumer.py"], why: "SonarQube flags this guard as untested. A test makes the riskiest path safer.", tip: "Send the same event id twice and assert one capture. That’s the whole bug from March." },
  ],
  fraud: [
    { key: "FRD-174", title: "Write tests for the rule eval sandbox", size: "1 day", risk: "Medium", mentor: "ava", files: ["rules/engine.py", "tests/test_engine_sandbox.py"], why: "Closes two security findings. The fix exists, it only needs tests.", tip: "The YAML fixtures in tests/fixtures cover every rule type." },
  ],
  ledger: [
    { key: "LDG-90", title: "Document the event replay script", size: "½ day", risk: "Low", mentor: "zhuoning", start: true, files: ["scripts/replay.kt", "docs/runbook.md"], why: "Nobody wrote this down. You’ll learn the ledger flow by explaining it.", tip: "Ask Zhuoning to run it once with you. Write while she talks." },
  ],
  api: [
    { key: "PLAT-104", title: "Add the refunds route to the header allowlist", size: "2 hours", risk: "Low", mentor: "alex", start: true, files: ["routes/payments.go", "routes/allowlist.yaml"], why: "A one-line fix with a big effect: idempotency keys stop getting dropped.", tip: "If you add a payments route, add it to the allowlist. I forgot once." },
  ],
  recon: [
    { key: "REC-47", title: "Handle KRW in the amount rounding", size: "1 day", risk: "Medium", mentor: "zhuoning", files: ["matching/fuzzy_match.py", "tests/test_currency.py"], why: "Same trap as the JPY incident, for another zero-decimal currency.", tip: "Zero-decimal currencies. Always test JPY and KRW together." },
  ],
}
const order = ["notification", "api", "payments", "ledger", "fraud", "recon"]

function guide(t: Pickup, repoId: string, q: string): Answer {
  const m = person(t.mentor)
  const lower = q.toLowerCase()
  if (lower.includes("start"))
    return { basis: "code", text: `Open ${t.files[0]} first and read it top to bottom before changing anything. Then make a branch called feat/${t.key.toLowerCase()} and change one thing at a time.`, sources: [], follow: ["What could break?", "Who reviews this?"] }
  if (lower.includes("break") || lower.includes("risk"))
    return { basis: "john", text: `${t.tip} ${r.sonar.gate === "Passed" ? `${r.name} has a passing quality gate, so the tests will catch most mistakes.` : `${r.name} has a failing quality gate, so add a test with your change or it won’t merge.`}`, sources: [], follow: ["Who reviews this?", "Where do I start?"] }
  if (lower.includes("review") || lower.includes("who"))
    return { basis: "code", text: `${m.name} will review it. ${m.fromJohn}`, sources: [], route: t.mentor, follow: ["Where do I start?"] }
  if (lower.includes("why"))
    return { basis: "code", text: t.why, sources: [], follow: ["Where do I start?", "What could break?"] }
  return answer(q, repoId)
}

export function FirstCommitScreen() {
  const [repoId, setRepoId] = useState("notification")
  const [pick, setPick] = useState<Pickup | null>(null)
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [chat, setChat] = useState<{ q: string; a: Answer } | null>(null)
  const [q, setQ] = useState("")
  const list = pickups[repoId] ?? []
  useEffect(() => { setPick(null); setChat(null) }, [repoId])
  useEffect(() => { setDone({}); setChat(null) }, [pick?.key])

  const steps: { id: string; label: string; help: string; cmd?: string }[] = pick ? [
    { id: "read", label: `Read ${pick.files[0].split("/").pop()}`, help: `Open ${pick.files[0]} and read it top to bottom before you change anything.` },
    { id: "branch", label: "Create your branch", help: "Run this in the repo:", cmd: `git switch -c feat/${pick.key.toLowerCase()}` },
    { id: "change", label: "Make the change", help: `Keep it small. You should only need to touch ${pick.files.map((f) => f.split("/").pop()).join(" and ")}.` },
    { id: "test", label: "Add or update a test", help: pick.tip },
    { id: "pr", label: `Open a PR for ${person(pick.mentor).name.split(" ")[0]}`, help: `${person(pick.mentor).name} will review it. Link ${pick.key} in the description.` },
  ] : []
  const current = steps.find((st) => !done[st.id])?.id
  const count = steps.filter((s) => done[s.id]).length
  const jira = done.pr ? "In review" : count > 0 ? "In progress" : "To do"
  const ask = (text: string) => { if (pick && text.trim()) { setChat({ q: text, a: guide(pick, repoId, text) }); setQ("") } }

  return (
    <div className="screen first">
      <header className="title">
        <h1>Your first commit</h1>
        <p>{pick ? "Follow the plan. Ask the agent anything along the way." : "Pick a repo, then a ticket. John’s agent will guide you from there."}</p>
      </header>

      <div className="chips-row" role="tablist" aria-label="Repositories">
        {order.map((id) => (
          <button key={id} role="tab" aria-selected={id === repoId} className={id === repoId ? "active" : ""} onClick={() => setRepoId(id)}>
            <i className={`sdot sdot--${statusKey(repo(id).status as Status)}`} />{repo(id).name.replace(/-(service|engine)$/, "")}
          </button>
        ))}
      </div>

      <div className={`first-grid ${pick ? "has-pick" : ""}`}>
        <div className="list-col">
        <div className="list-head"><span>Ready to pick up</span><span className="source"><i className="src-dot src-dot--jira" />Jira · {list[0]?.key.split("-")[0] ?? "PAY"} board · synced just now</span></div>
        <ul className="pick-list">
          {list.map((t) => (
            <li key={t.key}>
              <button className={`pick ${pick?.key === t.key ? "is-picked" : ""}`} onClick={() => setPick(pick?.key === t.key ? null : t)}>
                <span className="pick-main">
                  <strong>{t.title}</strong>
                  <span className="pick-meta">
                    <span className="tkey">{t.key}</span>·<span className={`risk risk--${t.risk.toLowerCase()}`}>{t.risk} risk</span>·<span>{t.size}</span>
                    {t.start && <span className="good">Good first ticket</span>}
                  </span>
                </span>
                <Avatar id={t.mentor} size={32} />
                <span className="pick-go">{pick?.key === t.key ? <Icon name="check" size={16} /> : <Icon name="arrow" size={16} />}</span>
              </button>
            </li>
          ))}
        </ul>
        </div>

        {pick && (
          <aside className="panel guide" aria-live="polite">
            <header className="guide-head">
              <span className="agent-mark" aria-hidden="true"><i /><i /><i /></span>
              <div><strong>{pick.title}</strong><small>{pick.why}</small></div>
            </header>
            <div className="jira-line">
              <span className="tkey">{pick.key}</span>
              <span className={`jstatus jstatus--${jira.replace(" ", "").toLowerCase()}`}>{jira}</span>
              <span className="assignee"><Avatar id="me" size={22} />You</span>
              <a className="jira-open" href="https://www.atlassian.com/software/jira" target="_blank" rel="noreferrer">Jira <Icon name="ext" size={13} /></a>
            </div>
            <div className="gprogress" aria-label={`${count} of ${steps.length} steps done`}><i style={{ width: `${(count / steps.length) * 100}%` }} /></div>
            <ol className="guide-steps">
              {steps.map((st, i) => (
                <li key={st.id} className={`${done[st.id] ? "done" : ""} ${st.id === current ? "now" : ""}`}>
                  <label>
                    <input type="checkbox" id={`gs-${st.id}`} checked={!!done[st.id]} onChange={() => setDone({ ...done, [st.id]: !done[st.id] })} />
                    <span className="gbox">{done[st.id] ? <Icon name="check" size={12} /> : i + 1}</span>
                    <span>{st.label}</span>
                  </label>
                  {st.id === current && (
                    <div className="step-help">
                      <p>{st.help}</p>
                      {st.cmd && <CopyLine cmd={st.cmd} />}
                      <button className="step-done" onClick={() => setDone({ ...done, [st.id]: true })}>Done <Icon name="check" size={14} /></button>
                    </div>
                  )}
                </li>
              ))}
            </ol>
            {count === steps.length ? (
              <div className="stamp"><span>First commit</span><small>Signed, John</small></div>
            ) : chat ? (
              <div className="guide-chat"><div className="bubble bubble--me"><p>{chat.q}</p></div><AnswerBubble a={chat.a} /></div>
            ) : null}
            <div className="guide-qs">
              {(chat?.a.follow.length ? chat.a.follow : ["Where do I start?", "What could break?", "Who reviews this?"]).slice(0, 3).map((x) => <button key={x} onClick={() => ask(x)}>{x}</button>)}
            </div>
            <form className="ask-bar" onSubmit={(e) => { e.preventDefault(); ask(q) }}>
              <label className="sr-only" htmlFor="guide-ask">Ask about this ticket</label>
              <input id="guide-ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about this ticket…" />
              <button type="submit" aria-label="Ask" disabled={!q.trim()}><Icon name="arrow" size={18} /></button>
            </form>
          </aside>
        )}
      </div>
    </div>
  )
}
