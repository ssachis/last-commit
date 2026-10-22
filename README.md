# Last Commit

**They leave. Their world of work stays.**

Last Commit is a design prototype for onboarding a new developer into a codebase whose owner has left. The new joiner explores "John's World" — his architecture, notes, tools and team — and gets guided to a first commit by an agent that interviewed John before he left.

**Live site:** https://ssachis.github.io/last-commit/

Built for the MS-CEI Fall 2026 course.

## Screens

| Screen | What it does |
| --- | --- |
| Welcome | One-screen entry into John's World |
| Home | John's intro video, a question prompt, his repositories and codebase health |
| Repositories | Isometric architecture map (color by health, John's knowledge or test coverage), John's walkthrough and takeaways, SonarQube code quality and Jira latest changes |
| Notes | John's exit interview and decision records |
| Tools | The tools John used, with one tip each, and how code ships |
| Team | Office floor plan; click anyone to see what John said about them |
| First commit | Pick a repo → pick a Jira ticket → follow the agent's step-by-step plan |
| Advice | Ask John's agent; it says when John didn't know |

## Design principles

1. One focal point per screen.
2. 8px spacing grid, 18px card radius, aligned card edges.
3. Four type sizes: 34 / 20 / 15 / 13.
4. Pastel color carries meaning: mint = stable, yellow = needs review, rose = risk.
5. Show less; detail is one click away.

## Run locally

```bash
npx pnpm install
npx pnpm dev
```

All data (repos, SonarQube metrics, Jira tickets, people) is hardcoded in `src/data.ts` and `src/firstcommit.tsx`.

## Project layout

- `src/App.tsx` — welcome screen, sidebar, top bar
- `src/screens.tsx` — Home, Repositories, Notes, Tools, Team, Advice
- `src/firstcommit.tsx` — First commit flow
- `src/data.ts` — all prototype data
- `src/ui.tsx` — icons, avatars, the agent's scripted answers
- `src/index.css` — design system and styles
- `docs/index.html` — the built site served by GitHub Pages
