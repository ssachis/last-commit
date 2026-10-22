// Last Commit — prototype data.
// Everything the UI shows is derived from this file, so counts (repos, risks,
// tickets) always agree across pages. In production each block maps to a
// connector: GitHub (repos, branches, commits, CODEOWNERS), Jira (tickets),
// SonarQube (quality gate + metrics), Confluence/Drive (docs), and the
// recorded exit interview (transcript + gaps).

export type Status = "Stable" | "Needs review" | "High risk" | "Unknown"
export type Tone = "mint" | "yellow" | "rose" | "violet" | "blue"
export type View =
  | "home"
  | "codebase"
  | "repo"
  | "docs"
  | "tools"
  | "team"
  | "ask"
  | "first"

export const JOHN_PHOTO =
  "https://images.unsplash.com/photo-1758876204244-930299843f07?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=86&w=1200"

// ─── People ──────────────────────────────────────────────────────────────
export type Person = {
  id: string
  name: string
  role: string
  team: string
  handle: string
  initials: string
  hue: Tone
  photo?: string
  presence: "online" | "away" | "left" | "you"
  tz: string
  room: "payments" | "infra" | "product" | "data" | "none"
  fromJohn: string
  askAbout: string[]
}

export const people: Person[] = [
  {
    id: "john",
    name: "John Carter",
    role: "Backend Lead (former)",
    team: "Payments",
    handle: "@john-dev",
    initials: "JC",
    hue: "mint",
    photo: JOHN_PHOTO,
    presence: "left",
    tz: "Left Sep 30, 2026",
    room: "payments",
    fromJohn:
      "I'm reachable on LinkedIn for a month or two, but the agent has everything I could remember. Ask it first.",
    askAbout: ["Anything in the interview"],
  },
  {
    id: "maya",
    name: "Maya Chen",
    role: "Payments Tech Lead",
    team: "Payments",
    handle: "@mayachen",
    initials: "MC",
    hue: "blue",
    presence: "online",
    tz: "New York · 9–6",
    room: "payments",
    fromJohn:
      "Maya reviewed most of my payments PRs. She knows why the retry cap is 3 and will tell you straight if an idea is risky.",
    askAbout: ["Retry & idempotency", "Release approvals", "Architecture calls"],
  },
  {
    id: "alex",
    name: "Alex Rivera",
    role: "Infra & DevOps",
    team: "Platform",
    handle: "@arivera",
    initials: "AR",
    hue: "violet",
    presence: "online",
    tz: "Austin · 10–7",
    room: "infra",
    fromJohn:
      "Alex owns the gateway, CI and every secret you will need. Ask for Vault access on day one, it takes 48h.",
    askAbout: ["CI/CD & deploys", "Vault & AWS access", "api-gateway config"],
  },
  {
    id: "priya",
    name: "Priya Shah",
    role: "Payments PM",
    team: "Product",
    handle: "@priya-s",
    initials: "PS",
    hue: "rose",
    presence: "away",
    tz: "London · 9–5",
    room: "product",
    fromJohn:
      "Priya knows the why behind every fraud rule and every merchant escalation. Bring her the business question, not the code.",
    askAbout: ["Fraud rule intent", "Merchant escalations", "Roadmap"],
  },
  {
    id: "zhuoning",
    name: "Zhuoning Xu",
    role: "Data Engineer",
    team: "Data",
    handle: "@zxu",
    initials: "ZX",
    hue: "yellow",
    presence: "online",
    tz: "New York · 8–4",
    room: "data",
    fromJohn:
      "Zhuoning wrote the ledger matching jobs with me. If numbers don't reconcile, she'll spot it in five minutes.",
    askAbout: ["Ledger matching", "Bank file formats", "Reconciliation jobs"],
  },
  {
    id: "prateek",
    name: "Prateek Mukherjee",
    role: "Frontend & Notifications",
    team: "Payments",
    handle: "@prateekm",
    initials: "PM",
    hue: "blue",
    presence: "online",
    tz: "Toronto · 9–6",
    room: "payments",
    fromJohn:
      "Prateek owns notifications now. Good first reviewer, fast and kind on PRs.",
    askAbout: ["Email & SMS templates", "Webhook consumers", "Good first tickets"],
  },
  {
    id: "ava",
    name: "Ava Okafor",
    role: "ML Engineer",
    team: "Risk",
    handle: "@ava-ml",
    initials: "AO",
    hue: "violet",
    presence: "away",
    tz: "Lagos · 9–5",
    room: "data",
    fromJohn:
      "Ava retrains the fraud model. Never change a threshold without her. The scores are not linear.",
    askAbout: ["Fraud model & thresholds", "Feature store", "Shadow scoring"],
  },
  {
    id: "me",
    name: "New Joiner",
    role: "Backend Engineer",
    team: "Payments",
    handle: "@you",
    initials: "NJ",
    hue: "violet",
    presence: "you",
    tz: "Day 3 of onboarding",
    room: "payments",
    fromJohn: "Welcome. Start with payments-service, it touches everything else.",
    askAbout: [],
  },
]

export const person = (id: string) => people.find((p) => p.id === id)!

// ─── Repositories ────────────────────────────────────────────────────────
export type Branch = {
  name: string
  author: string
  updated: string
  ahead: number
  behind: number
  state: "default" | "active" | "stale" | "abandoned"
  pr?: string
  note?: string
}
export type Change = {
  title: string
  author: string
  date: string
  level: "risk" | "review" | "ok" | "minor"
  ref: string
}
export type Ticket = {
  key: string
  title: string
  type: "Incident" | "Story" | "Bug" | "Spike" | "Tech debt"
  status: "Done" | "In progress" | "Won't do" | "Open"
  month: string
  johnNote?: string
}
export type Gap = { q: string; why: string; ask: string }
export type Hotspot = {
  file: string
  complexity: number
  churn: number
  johnPct: number
  smell: string
}
export type Sonar = {
  gate: "Passed" | "Failed"
  bugs: number
  vulns: number
  hotspots: number
  smells: number
  coverage: number
  duplication: number
  debt: string
  reliability: string
  security: string
  maintainability: string
  trend: number[]
  scanned: string
  files: Hotspot[]
}
export type Repo = {
  id: string
  name: string
  short: string
  status: Status
  lang: string
  description: string
  x: number
  y: number
  owner: string
  interim: string
  contributors: { id: string; pct: number }[]
  johnPct: number
  lastCommit: number // days ago
  commits90: number
  sonar: Sonar
  branches: Branch[]
  changes: Change[]
  jira: Ticket[]
  takeaways: string[]
  gaps: Gap[]
  chapters: { t: string; label: string }[]
  whiteboard: { flow: string[]; remember: string[] }
  summary: string
}

const trend = (end: number, wobble: number[]) =>
  wobble.map((w) => Math.max(0, Math.min(100, Math.round(end + w))))

export const repos: Repo[] = [
  {
    id: "payments",
    name: "payments-service",
    short: "PS",
    status: "Needs review",
    lang: "Python · FastAPI",
    description: "Core payments processing: validate, authorize, capture, refund.",
    x: 400,
    y: 285,
    owner: "john",
    interim: "maya",
    contributors: [
      { id: "john", pct: 64 },
      { id: "maya", pct: 18 },
      { id: "prateek", pct: 9 },
      { id: "alex", pct: 9 },
    ],
    johnPct: 64,
    lastCommit: 2,
    commits90: 87,
    summary:
      "John built the retry and idempotency layer after incident #4821 (duplicate charges in March) and spent his last quarter hardening webhook handling. Two branches he started are still open and one should not be merged.",
    sonar: {
      gate: "Failed",
      bugs: 3,
      vulns: 0,
      hotspots: 4,
      smells: 61,
      coverage: 71.4,
      duplication: 3.8,
      debt: "4d 2h",
      reliability: "C",
      security: "A",
      maintainability: "B",
      trend: trend(71, [-6, -5, -5, -3, -4, -2, -1, -2, 0, 1, 0, 0]),
      scanned: "2h ago",
      files: [
        { file: "payments/retry/RetryHandler.py", complexity: 48, churn: 31, johnPct: 92, smell: "Nested retry branches, 1 bug" },
        { file: "payments/webhooks/consumer.py", complexity: 37, churn: 26, johnPct: 81, smell: "Duplicate-event guard untested" },
        { file: "payments/capture/flow.py", complexity: 29, churn: 12, johnPct: 70, smell: "Long method (142 lines)" },
        { file: "payments/idempotency/store.py", complexity: 18, churn: 9, johnPct: 95, smell: "Clean, well tested" },
      ],
    },
    branches: [
      { name: "main", author: "maya", updated: "2d ago", ahead: 0, behind: 0, state: "default" },
      { name: "fix/webhook-timeout", author: "maya", updated: "2d ago", ahead: 3, behind: 0, state: "active", pr: "#1182" },
      { name: "feat/retry-backoff-v2", author: "john", updated: "41d ago", ahead: 14, behind: 37, state: "abandoned", pr: "#1121 (draft)", note: "Half done. The jitter math is wrong. Do not merge. Read incident #4821 first." },
      { name: "chore/py312-upgrade", author: "john", updated: "29d ago", ahead: 6, behind: 22, state: "stale", note: "Safe to finish. Only the asyncpg pin blocked it." },
      { name: "spike/ledger-events", author: "john", updated: "63d ago", ahead: 2, behind: 51, state: "abandoned", note: "Throwaway spike. Delete it." },
    ],
    changes: [
      { title: "Add retry metrics for payments", author: "john", date: "Sep 24", level: "risk", ref: "PR #1170" },
      { title: "Fix timeout handling in webhook", author: "maya", date: "Oct 20", level: "review", ref: "PR #1182" },
      { title: "Update fraud rules client config", author: "prateek", date: "Sep 18", level: "ok", ref: "PR #1164" },
      { title: "Refactor ledger sync client", author: "john", date: "Sep 12", level: "ok", ref: "PR #1158" },
      { title: "Bump dependencies (minor)", author: "alex", date: "Aug 28", level: "minor", ref: "PR #1149" },
    ],
    jira: [
      { key: "INC-4821", title: "Duplicate charges during retry spike", type: "Incident", status: "Done", month: "Mar 2026", johnNote: "Retries were 5 with no idempotency key. We capped at 3 and added keys. Never raise the cap without keys on every call." },
      { key: "PAY-251", title: "Idempotency keys for capture & refund", type: "Story", status: "Done", month: "Apr 2026" },
      { key: "PAY-268", title: "Idempotency store TTL tuning", type: "Tech debt", status: "Done", month: "May 2026" },
      { key: "PAY-294", title: "Reconciliation timeout on large batches", type: "Bug", status: "Done", month: "Jun 2026", johnNote: "The timeout was in ledger-sync, not here. Took me two days to see that." },
      { key: "PAY-301", title: "Spike: event-sourced ledger writes", type: "Spike", status: "Won't do", month: "Jul 2026" },
      { key: "PAY-308", title: "Review gateway retry policy", type: "Story", status: "In progress", month: "Aug 2026", johnNote: "This is what feat/retry-backoff-v2 was for. Needs a design review with Maya before more code." },
      { key: "PAY-319", title: "Retry metrics & dashboards", type: "Story", status: "Done", month: "Sep 2026" },
      { key: "PAY-322", title: "Duplicate webhook events from provider", type: "Bug", status: "Open", month: "Sep 2026", johnNote: "Provider resends on 5xx and sometimes on 200. The consumer dedupes on event id, but only for 24h." },
    ],
    takeaways: [
      "Keep retries capped at 3 (see incident #4821).",
      "Use idempotency keys for every payment call.",
      "Ledger sync is async. Expect delays of a few minutes.",
      "Watch out for duplicate webhook events.",
    ],
    gaps: [
      { q: "Why is the idempotency TTL 24h and not 72h?", why: "John said he “inherited it” and never checked with the provider.", ask: "maya" },
      { q: "What happens to a refund if ledger-sync is down for over an hour?", why: "Not covered in the interview or any doc. No test covers it.", ask: "zhuoning" },
      { q: "Who approves changes to capture amounts over $10k?", why: "John mentioned “a compliance thing” but couldn't recall the owner.", ask: "priya" },
    ],
    chapters: [
      { t: "0:00", label: "The payments flow end to end" },
      { t: "1:12", label: "Why retries are capped at 3" },
      { t: "2:30", label: "Idempotency keys and the store" },
      { t: "3:41", label: "Webhooks and duplicates" },
      { t: "4:30", label: "What I'd fix next" },
    ],
    whiteboard: {
      flow: ["API", "Validate", "Process", "Ledger"],
      remember: ["Idempotency", "Retry logic (max 3)", "Watch for duplicate webhooks"],
    },
  },
  {
    id: "api",
    name: "api-gateway",
    short: "AG",
    status: "Stable",
    lang: "Go · Envoy",
    description: "Routes, authenticates and rate-limits external requests.",
    x: 150,
    y: 140,
    owner: "alex",
    interim: "alex",
    contributors: [
      { id: "alex", pct: 58 },
      { id: "john", pct: 22 },
      { id: "maya", pct: 20 },
    ],
    johnPct: 22,
    lastCommit: 5,
    commits90: 34,
    summary:
      "John's work here was limited to the payments routes and the retry headers forwarded to payments-service. Alex owns the rest and it is well documented.",
    sonar: {
      gate: "Passed",
      bugs: 0,
      vulns: 0,
      hotspots: 1,
      smells: 12,
      coverage: 86.2,
      duplication: 1.1,
      debt: "6h",
      reliability: "A",
      security: "A",
      maintainability: "A",
      trend: trend(86, [-2, -2, -1, -1, 0, 0, -1, 0, 1, 0, 0, 0]),
      scanned: "5h ago",
      files: [
        { file: "routes/payments.go", complexity: 14, churn: 8, johnPct: 61, smell: "Retry header passthrough" },
        { file: "auth/jwt.go", complexity: 11, churn: 4, johnPct: 0, smell: "Clean" },
      ],
    },
    branches: [
      { name: "main", author: "alex", updated: "5d ago", ahead: 0, behind: 0, state: "default" },
      { name: "feat/rate-limit-tiers", author: "alex", updated: "5d ago", ahead: 4, behind: 1, state: "active", pr: "#412" },
    ],
    changes: [
      { title: "Rate-limit tiers per merchant", author: "alex", date: "Oct 17", level: "review", ref: "PR #412" },
      { title: "Forward Idempotency-Key header", author: "john", date: "Apr 09", level: "ok", ref: "PR #377" },
      { title: "Rotate JWT signing keys", author: "alex", date: "Sep 02", level: "ok", ref: "PR #401" },
    ],
    jira: [
      { key: "PLAT-88", title: "Forward idempotency headers to payments", type: "Story", status: "Done", month: "Apr 2026", johnNote: "If you add a new payments route, add it to the header allowlist too or keys get dropped silently." },
      { key: "PLAT-97", title: "Gateway timeout to 10s for capture", type: "Story", status: "Done", month: "Jun 2026" },
    ],
    takeaways: [
      "New payments routes must be added to the header allowlist.",
      "Capture has a longer timeout (10s) than every other route.",
      "Alex approves every gateway change.",
    ],
    gaps: [
      { q: "Is the 10s capture timeout still needed after PAY-319?", why: "John wasn't sure. Metrics now exist to check.", ask: "alex" },
    ],
    chapters: [
      { t: "0:00", label: "Payments routes" },
      { t: "0:50", label: "The header allowlist" },
      { t: "1:40", label: "Timeouts" },
    ],
    whiteboard: { flow: ["Client", "Auth", "Rate limit", "Route"], remember: ["Header allowlist", "Capture = 10s timeout", "Alex approves"] },
  },
  {
    id: "fraud",
    name: "fraud-detection",
    short: "FD",
    status: "High risk",
    lang: "Python · scikit-learn",
    description: "Risk scoring and rule engine called before every capture.",
    x: 560,
    y: 95,
    owner: "john",
    interim: "ava",
    contributors: [
      { id: "john", pct: 41 },
      { id: "ava", pct: 39 },
      { id: "priya", pct: 20 },
    ],
    johnPct: 41,
    lastCommit: 34,
    commits90: 11,
    summary:
      "John wrote the rule engine and the client that payments-service calls. Ava owns the model. Rules are config-driven, and two of them have no recorded reason.",
    sonar: {
      gate: "Failed",
      bugs: 5,
      vulns: 2,
      hotspots: 6,
      smells: 88,
      coverage: 48.9,
      duplication: 7.2,
      debt: "9d 5h",
      reliability: "D",
      security: "C",
      maintainability: "C",
      trend: trend(49, [4, 3, 3, 2, 2, 1, 1, 0, 0, -1, 0, 0]),
      scanned: "1d ago",
      files: [
        { file: "rules/engine.py", complexity: 52, churn: 14, johnPct: 88, smell: "2 vulnerabilities (eval on config)" },
        { file: "rules/config/velocity.yaml", complexity: 0, churn: 21, johnPct: 70, smell: "Thresholds without comments" },
        { file: "model/score.py", complexity: 22, churn: 6, johnPct: 5, smell: "Owned by Ava" },
      ],
    },
    branches: [
      { name: "main", author: "ava", updated: "34d ago", ahead: 0, behind: 0, state: "default" },
      { name: "fix/rule-eval-sandbox", author: "john", updated: "40d ago", ahead: 5, behind: 3, state: "stale", pr: "#233", note: "Fixes the two Sonar vulnerabilities. Needs tests, then it's ready." },
    ],
    changes: [
      { title: "Velocity rule threshold 12 → 9", author: "priya", date: "Sep 18", level: "risk", ref: "PR #229" },
      { title: "Shadow-score new model v7", author: "ava", date: "Sep 10", level: "review", ref: "PR #226" },
    ],
    jira: [
      { key: "FRD-140", title: "Rule engine v2 (config-driven)", type: "Story", status: "Done", month: "Feb 2026" },
      { key: "FRD-162", title: "Card-testing attack on merchant 8812", type: "Incident", status: "Done", month: "May 2026", johnNote: "We added the velocity rule that night. The threshold was a guess, Priya tuned it later." },
      { key: "FRD-171", title: "Sandbox rule evaluation", type: "Tech debt", status: "In progress", month: "Aug 2026" },
    ],
    takeaways: [
      "Never change a threshold without Ava. Scores are not linear.",
      "Rules live in YAML. Every rule change is a production change.",
      "fix/rule-eval-sandbox closes the two security findings.",
    ],
    gaps: [
      { q: "Why does the geo-mismatch rule exclude Canada?", why: "No ticket, no comment, John didn't remember.", ask: "priya" },
      { q: "What is the fallback if the scoring service times out?", why: "Code fails open. John wasn't sure that was intentional.", ask: "ava" },
    ],
    chapters: [
      { t: "0:00", label: "Rules vs model" },
      { t: "1:05", label: "The velocity rule story" },
      { t: "2:20", label: "The eval() problem" },
    ],
    whiteboard: { flow: ["Capture", "Rules", "Model", "Decision"], remember: ["Ask Ava before thresholds", "Rules are prod config", "Fails open (?)"] },
  },
  {
    id: "ledger",
    name: "ledger-sync",
    short: "LS",
    status: "Needs review",
    lang: "Kotlin · Kafka",
    description: "Pushes settled payments to the bank ledger, asynchronously.",
    x: 710,
    y: 225,
    owner: "zhuoning",
    interim: "zhuoning",
    contributors: [
      { id: "zhuoning", pct: 52 },
      { id: "john", pct: 33 },
      { id: "alex", pct: 15 },
    ],
    johnPct: 33,
    lastCommit: 9,
    commits90: 26,
    summary:
      "John refactored the client that payments-service uses to publish ledger events. Zhuoning owns the consumer and the bank file formats.",
    sonar: {
      gate: "Passed",
      bugs: 1,
      vulns: 0,
      hotspots: 2,
      smells: 30,
      coverage: 74.0,
      duplication: 2.9,
      debt: "1d 4h",
      reliability: "B",
      security: "A",
      maintainability: "B",
      trend: trend(74, [-3, -3, -2, -2, -1, -1, 0, 0, 0, 1, 0, 0]),
      scanned: "3h ago",
      files: [
        { file: "consumer/BatchWriter.kt", complexity: 26, churn: 15, johnPct: 12, smell: "Long batch timeout" },
        { file: "client/LedgerPublisher.kt", complexity: 15, churn: 11, johnPct: 80, smell: "Clean after refactor" },
      ],
    },
    branches: [
      { name: "main", author: "zhuoning", updated: "9d ago", ahead: 0, behind: 0, state: "default" },
      { name: "feat/bank-file-v3", author: "zhuoning", updated: "9d ago", ahead: 7, behind: 0, state: "active", pr: "#318" },
    ],
    changes: [
      { title: "Bank file format v3", author: "zhuoning", date: "Oct 13", level: "review", ref: "PR #318" },
      { title: "Refactor ledger publisher client", author: "john", date: "Sep 12", level: "ok", ref: "PR #305" },
    ],
    jira: [
      { key: "LDG-77", title: "Batch timeout on month-end", type: "Bug", status: "Done", month: "Jun 2026", johnNote: "This was the real cause of PAY-294." },
      { key: "LDG-81", title: "Publisher client refactor", type: "Tech debt", status: "Done", month: "Sep 2026" },
    ],
    takeaways: [
      "Expect a few minutes of lag. Don't build features that assume it's instant.",
      "Month-end batches are 20× normal size.",
    ],
    gaps: [
      { q: "How do we replay events after a Kafka outage?", why: "John described it as “there's a script somewhere”.", ask: "zhuoning" },
    ],
    chapters: [
      { t: "0:00", label: "Why it's async" },
      { t: "1:15", label: "Month-end batches" },
    ],
    whiteboard: { flow: ["Payment", "Kafka", "Batch", "Bank"], remember: ["Lag is normal", "Month-end = 20×", "Ask Zhuoning"] },
  },
  {
    id: "notification",
    name: "notification-service",
    short: "NS",
    status: "Stable",
    lang: "TypeScript · Node",
    description: "Email and SMS payment receipts, alerts and webhooks to merchants.",
    x: 165,
    y: 360,
    owner: "prateek",
    interim: "prateek",
    contributors: [
      { id: "prateek", pct: 71 },
      { id: "john", pct: 14 },
      { id: "maya", pct: 15 },
    ],
    johnPct: 14,
    lastCommit: 1,
    commits90: 52,
    summary:
      "Low risk and well tested. The best place for a first commit. John only touched the payment-status consumer.",
    sonar: {
      gate: "Passed",
      bugs: 0,
      vulns: 0,
      hotspots: 0,
      smells: 9,
      coverage: 88.5,
      duplication: 1.4,
      debt: "3h",
      reliability: "A",
      security: "A",
      maintainability: "A",
      trend: trend(88, [-1, -1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]),
      scanned: "40m ago",
      files: [
        { file: "src/webhooks/handler.ts", complexity: 12, churn: 18, johnPct: 30, smell: "Missing structured log fields" },
        { file: "src/templates/receipt.ts", complexity: 6, churn: 9, johnPct: 0, smell: "Clean" },
      ],
    },
    branches: [
      { name: "main", author: "prateek", updated: "1d ago", ahead: 0, behind: 0, state: "default" },
      { name: "feat/sms-locale", author: "prateek", updated: "1d ago", ahead: 2, behind: 0, state: "active", pr: "#541" },
    ],
    changes: [
      { title: "SMS receipts in merchant locale", author: "prateek", date: "Oct 21", level: "ok", ref: "PR #541" },
      { title: "Payment-status consumer retries", author: "john", date: "Jul 30", level: "ok", ref: "PR #509" },
    ],
    jira: [
      { key: "NTF-203", title: "Consume payment.status events", type: "Story", status: "Done", month: "Jul 2026" },
    ],
    takeaways: ["Great first-commit repo. Prateek reviews within a day."],
    gaps: [],
    chapters: [{ t: "0:00", label: "How receipts are sent" }],
    whiteboard: { flow: ["Event", "Template", "Provider", "Merchant"], remember: ["Well tested", "Prateek reviews fast"] },
  },
  {
    id: "users",
    name: "user-service",
    short: "US",
    status: "Unknown",
    lang: "Java · Spring",
    description: "Customer identity, profiles and payment preferences.",
    x: 325,
    y: 470,
    owner: "alex",
    interim: "alex",
    contributors: [
      { id: "alex", pct: 45 },
      { id: "maya", pct: 35 },
      { id: "john", pct: 20 },
    ],
    johnPct: 20,
    lastCommit: 120,
    commits90: 0,
    summary:
      "Not scanned by SonarQube yet and untouched for four months. John called it “legacy but stable”. Nobody on the team claims it.",
    sonar: {
      gate: "Failed",
      bugs: 0,
      vulns: 0,
      hotspots: 0,
      smells: 0,
      coverage: 0,
      duplication: 0,
      debt: "—",
      reliability: "—",
      security: "—",
      maintainability: "—",
      trend: [],
      scanned: "Never",
      files: [],
    },
    branches: [{ name: "main", author: "alex", updated: "120d ago", ahead: 0, behind: 0, state: "default" }],
    changes: [{ title: "Java 17 upgrade", author: "alex", date: "Jun 24", level: "minor", ref: "PR #88" }],
    jira: [],
    takeaways: ["Legacy but stable. Connect it to SonarQube before changing anything."],
    gaps: [{ q: "Who owns user-service?", why: "CODEOWNERS points to a team that no longer exists.", ask: "alex" }],
    chapters: [],
    whiteboard: { flow: ["Login", "Profile", "Prefs"], remember: ["Not scanned", "No owner"] },
  },
  {
    id: "recon",
    name: "reconciliation-engine",
    short: "RE",
    status: "High risk",
    lang: "Python · Airflow",
    description: "Matches provider settlements against the internal ledger nightly.",
    x: 655,
    y: 440,
    owner: "john",
    interim: "zhuoning",
    contributors: [
      { id: "john", pct: 76 },
      { id: "zhuoning", pct: 24 },
    ],
    johnPct: 76,
    lastCommit: 22,
    commits90: 19,
    summary:
      "Highest knowledge risk in the codebase: John wrote 76% of it. Matching rules are clever and under-documented. Nightly failures page whoever is on call.",
    sonar: {
      gate: "Failed",
      bugs: 4,
      vulns: 0,
      hotspots: 1,
      smells: 72,
      coverage: 52.3,
      duplication: 5.6,
      debt: "6d 1h",
      reliability: "C",
      security: "A",
      maintainability: "C",
      trend: trend(52, [3, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0]),
      scanned: "6h ago",
      files: [
        { file: "matching/fuzzy_match.py", complexity: 61, churn: 19, johnPct: 97, smell: "Cognitive complexity 61" },
        { file: "dags/nightly_recon.py", complexity: 19, churn: 14, johnPct: 85, smell: "Hard-coded retry counts" },
      ],
    },
    branches: [
      { name: "main", author: "zhuoning", updated: "22d ago", ahead: 0, behind: 0, state: "default" },
      { name: "feat/fx-tolerance", author: "john", updated: "35d ago", ahead: 9, behind: 4, state: "stale", pr: "#97", note: "Good idea, tests are real. Needs Zhuoning's review of the 0.5% tolerance." },
    ],
    changes: [
      { title: "FX tolerance for cross-currency", author: "john", date: "Sep 17", level: "review", ref: "PR #97" },
      { title: "Fuzzy matcher: amount rounding", author: "john", date: "Aug 30", level: "risk", ref: "PR #94" },
    ],
    jira: [
      { key: "REC-31", title: "Fuzzy matching for partial captures", type: "Story", status: "Done", month: "Apr 2026" },
      { key: "REC-40", title: "Nightly recon failed 3 nights in a row", type: "Incident", status: "Done", month: "Aug 2026", johnNote: "Rounding on JPY amounts. Zero-decimal currencies are the trap here." },
      { key: "REC-44", title: "FX tolerance", type: "Story", status: "In progress", month: "Sep 2026" },
    ],
    takeaways: [
      "Zero-decimal currencies (JPY, KRW) break naive rounding.",
      "Nightly failures page on-call. Check the DAG log before the code.",
      "fuzzy_match.py is the riskiest file in the codebase.",
    ],
    gaps: [
      { q: "Why is the fuzzy match window 72 hours?", why: "John: “felt right at the time”. No data behind it.", ask: "zhuoning" },
      { q: "Which merchants are excluded from auto-matching?", why: "There is a list in code, nobody knows who maintains it.", ask: "priya" },
    ],
    chapters: [
      { t: "0:00", label: "What reconciliation means here" },
      { t: "1:30", label: "The fuzzy matcher" },
      { t: "3:10", label: "The JPY incident" },
    ],
    whiteboard: { flow: ["Provider file", "Match", "Diff", "Alert"], remember: ["Zero-decimal currencies", "DAG log first", "72h window (?)"] },
  },
]

export const repo = (id: string) => repos.find((r) => r.id === id)!

export const edges: { from: string; to: string; kind: "request" | "data" | "async" }[] = [
  { from: "api", to: "payments", kind: "request" },
  { from: "payments", to: "fraud", kind: "request" },
  { from: "users", to: "payments", kind: "data" },
  { from: "payments", to: "ledger", kind: "async" },
  { from: "payments", to: "notification", kind: "async" },
  { from: "ledger", to: "recon", kind: "data" },
  { from: "payments", to: "recon", kind: "async" },
]

// ─── Docs ───────────────────────────────────────────────────────────────
export type Doc = {
  id: string
  title: string
  kind: "Decision" | "Runbook" | "Interview" | "Guide" | "Postmortem"
  repo?: string
  updated: string
  drift: number // commits to related code since doc was last edited
  minutes: number
  summary: string
  points: string[]
}

export const docs: Doc[] = [
  { id: "interview", title: "Exit interview with John (transcript)", kind: "Interview", updated: "Sep 26, 2026", drift: 0, minutes: 32, summary: "A 32-minute structured interview run by the Last Commit agent on John's second-to-last day.", points: ["41 facts extracted and linked to code", "9 open questions he couldn't answer", "Ranked his own repos by risk"] },
  { id: "adr-retry", title: "ADR-012: Cap payment retries at 3", kind: "Decision", repo: "payments", updated: "Mar 28, 2026", drift: 4, minutes: 4, summary: "Why retries were reduced from 5 to 3 after INC-4821, and the condition for ever raising them.", points: ["Retries > 3 caused duplicate captures", "Raise only with idempotency keys on every call", "Owner: Maya Chen"] },
  { id: "adr-idem", title: "ADR-013: Idempotency keys for money movement", kind: "Decision", repo: "payments", updated: "Apr 15, 2026", drift: 9, minutes: 5, summary: "Every capture and refund carries a client-generated key stored for 24h.", points: ["Key format: merchant + order + attempt", "24h TTL (see open question)", "Gateway must forward the header"] },
  { id: "pm-4821", title: "Postmortem: INC-4821 duplicate charges", kind: "Postmortem", repo: "payments", updated: "Mar 22, 2026", drift: 31, minutes: 7, summary: "312 customers double-charged over 40 minutes during a provider slowdown.", points: ["Root cause: retries without idempotency", "Detected by support, not alerts", "Led to ADR-012 and ADR-013"] },
  { id: "rb-payments", title: "Payments on-call runbook", kind: "Runbook", repo: "payments", updated: "Jan 10, 2026", drift: 58, minutes: 9, summary: "Alerts, dashboards and first steps for payments incidents.", points: ["Written before the retry changes", "Dashboard links point to old Grafana", "Needs an update before you go on call"] },
  { id: "rb-recon", title: "Nightly reconciliation runbook", kind: "Runbook", repo: "recon", updated: "Aug 21, 2026", drift: 6, minutes: 6, summary: "What to do when the nightly DAG fails.", points: ["Check the DAG log before the code", "Zero-decimal currency checklist", "Escalate to Zhuoning"] },
  { id: "guide-fraud", title: "How fraud rules are configured", kind: "Guide", repo: "fraud", updated: "Feb 20, 2026", drift: 21, minutes: 5, summary: "YAML rule format, deploy path and the eval sandbox plan.", points: ["Rules ship like code", "Two rules have no recorded reason", "Ava signs off on thresholds"] },
  { id: "guide-local", title: "John's local setup notes", kind: "Guide", updated: "Sep 25, 2026", drift: 2, minutes: 3, summary: "Everything John had to do to get a working laptop, in order.", points: ["Request Vault first (48h)", "Use the docker compose stack, not minikube", "Seed data script lives in tools/"] },
]

// ─── Exit interview ─────────────────────────────────────────────────────
export const interview = {
  minutes: 32,
  facts: 41,
  questions: 10,
  date: "Sep 26, 2026",
  chapters: [
    { t: "00:00", label: "What John owned and why", repo: "payments" },
    { t: "04:10", label: "Retries, idempotency and INC-4821", repo: "payments" },
    { t: "11:35", label: "The reconciliation engine, honestly", repo: "recon" },
    { t: "17:20", label: "Fraud rules nobody can explain", repo: "fraud" },
    { t: "22:05", label: "Unfinished branches", repo: "payments" },
    { t: "26:40", label: "Who to ask for what", repo: undefined },
    { t: "29:50", label: "Advice for whoever comes next", repo: undefined },
  ] as { t: string; label: string; repo?: string }[],
}

// ─── Tools & stack ──────────────────────────────────────────────────────
export type Access = {
  id: string
  name: string
  why: string
  approver: string
  eta: string
  state: "granted" | "pending" | "todo"
}
export const access: Access[] = [
  { id: "gh", name: "GitHub · acme-payments org", why: "Clone repos, open PRs", approver: "alex", eta: "Instant", state: "granted" },
  { id: "jira", name: "Jira · PAY, FRD, REC projects", why: "Pick up tickets", approver: "maya", eta: "Instant", state: "granted" },
  { id: "sonar", name: "SonarQube", why: "See quality gates on your PRs", approver: "alex", eta: "Same day", state: "pending" },
  { id: "vault", name: "Vault · payments/dev", why: "Local secrets. Nothing runs without it", approver: "alex", eta: "~48h", state: "todo" },
  { id: "aws", name: "AWS · payments-staging (read)", why: "Read logs in staging", approver: "alex", eta: "1 day", state: "todo" },
  { id: "dd", name: "Datadog", why: "Dashboards and alerts", approver: "maya", eta: "Same day", state: "todo" },
]

export const stack: { group: string; items: { name: string; use: string; tip?: string }[] }[] = [
  {
    group: "Languages & services",
    items: [
      { name: "Python 3.11 · FastAPI", use: "payments-service, fraud-detection, reconciliation-engine", tip: "John pinned 3.11 because of asyncpg. The py312 branch is nearly done." },
      { name: "Kotlin · Kafka Streams", use: "ledger-sync" },
      { name: "Go · Envoy", use: "api-gateway" },
      { name: "TypeScript · Node 20", use: "notification-service" },
    ],
  },
  {
    group: "Data",
    items: [
      { name: "PostgreSQL 15", use: "Payments and idempotency store", tip: "Idempotency rows expire after 24h via a cron, not a TTL index." },
      { name: "Kafka", use: "payment.status and ledger events" },
      { name: "Airflow", use: "Nightly reconciliation DAG" },
    ],
  },
  {
    group: "Ship & observe",
    items: [
      { name: "GitHub Actions", use: "CI on every PR" },
      { name: "SonarQube", use: "Quality gate blocks merge" },
      { name: "Argo CD", use: "Deploys to staging, then canary" },
      { name: "Datadog", use: "Dashboards, alerts, traces", tip: "The ‘Payments golden signals’ dashboard is the one John watched." },
    ],
  },
]

export const pipeline = [
  { name: "Branch", detail: "feat/PAY-123-short-name" },
  { name: "PR", detail: "CODEOWNERS auto-assigned" },
  { name: "CI", detail: "Tests + lint · ~6 min" },
  { name: "Quality gate", detail: "SonarQube: no new bugs, ≥80% new-code coverage" },
  { name: "Staging", detail: "Argo CD on merge" },
  { name: "Canary", detail: "5% for 30 min" },
  { name: "Production", detail: "Maya approves payments" },
]

export const integrations = [
  { name: "GitHub", what: "7 repos · branches · PRs · CODEOWNERS", state: "Connected", synced: "5 min ago" },
  { name: "Jira", what: "PAY, FRD, REC, LDG, PLAT · 212 tickets by John", state: "Connected", synced: "12 min ago" },
  { name: "SonarQube", what: "6 of 7 repos scanned", state: "Partial", synced: "40 min ago" },
  { name: "Confluence", what: "8 docs linked to code", state: "Connected", synced: "1h ago" },
  { name: "Microsoft Teams", what: "Message people from any page", state: "Connected", synced: "Live" },
  { name: "Datadog", what: "Live service health on the map", state: "Not connected", synced: "" },
]

export const setupCommands = [
  { label: "Clone the main repo", cmd: "gh repo clone acme-payments/payments-service" },
  { label: "Pull local secrets (needs Vault)", cmd: "make secrets ENV=dev" },
  { label: "Start the stack", cmd: "docker compose up -d postgres kafka" },
  { label: "Seed test data", cmd: "python tools/seed.py --merchants 20" },
  { label: "Run the tests", cmd: "make test" },
]

// ─── First commit ───────────────────────────────────────────────────────
export type Starter = {
  key: string
  title: string
  repo: string
  risk: "Low" | "Medium"
  estimate: string
  mentor: string
  why: string
  files: string[]
  johnTip: string
}
export const starters: Starter[] = [
  {
    key: "NTF-219",
    title: "Add structured log fields to the webhook handler",
    repo: "notification",
    risk: "Low",
    estimate: "½ day",
    mentor: "prateek",
    why: "Green quality gate, 88% coverage, fast reviewer. You'll learn the payment.status event shape you'll see everywhere.",
    files: ["src/webhooks/handler.ts", "src/webhooks/handler.test.ts"],
    johnTip: "Log the idempotency key and event id. Those are the two fields everyone searches for in an incident.",
  },
  {
    key: "PAY-331",
    title: "Finish the Python 3.12 upgrade",
    repo: "payments",
    risk: "Medium",
    estimate: "1–2 days",
    mentor: "maya",
    why: "John's branch chore/py312-upgrade is 90% done. Only the asyncpg pin blocked it.",
    files: ["pyproject.toml", "Dockerfile", ".github/workflows/ci.yml"],
    johnTip: "Rebase onto main first. It's 22 commits behind.",
  },
  {
    key: "FRD-174",
    title: "Write tests for the rule eval sandbox",
    repo: "fraud",
    risk: "Medium",
    estimate: "1 day",
    mentor: "ava",
    why: "Closes two SonarQube vulnerabilities. The fix exists, it only needs tests.",
    files: ["rules/engine.py", "tests/test_engine_sandbox.py"],
    johnTip: "The YAML fixtures in tests/fixtures cover every rule type.",
  },
]

export const journey: { id: View; label: string; hint: string }[] = [
  { id: "home", label: "Meet John", hint: "Watch the intro" },
  { id: "codebase", label: "Map", hint: "See the system" },
  { id: "repo", label: "Deep dive", hint: "One repo in depth" },
  { id: "ask", label: "Ask John", hint: "Fill your gaps" },
  { id: "team", label: "Team", hint: "Who to ask" },
  { id: "first", label: "First commit", hint: "Ship something" },
]
