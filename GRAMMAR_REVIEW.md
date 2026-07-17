# Grammar & Technical Writing Review — joeburns.ai

Reviewed all user-facing copy: `src/pages/Home.tsx`, `src/pages/About.tsx`, `src/pages/CaseStudy.tsx`,
`src/lib/studies.ts`, `src/lib/socialLinks.tsx`, `src/components/StudyFigure/StudyFigure.tsx`,
`index.html` (meta/JSON-LD), `public/llms.txt`, `public/sitemap.xml`, `README.md`.

## 1. "Detection time fell/reduced from none" — logically inconsistent, repeated 3×

**Where:**
- `src/pages/Home.tsx:34` (Experience bullet): *"Reduced average detection time for coordinated abuse networks from none, to roughly 30 days of manual work, to under 2 hours..."*
- `src/lib/studies.ts:58` (Reseller Ecosystem Disruption → Outcome): *"Average detection time for coordinated abuse fell from none, to roughly 30 days of manual work, to under two hours..."*
- `public/llms.txt:8-10`: *"Average detection time for coordinated abuse networks fell from none, to roughly 30 days of manual work, to under 2 hours..."*

**Problem:** "Reduced/fell **from none**" doesn't parse. "None" is the absence of a detection capability — you can't reduce or have something *fall* from zero **up** to 30 days; that's the opposite of falling. The intended meaning (no capability → manual 30-day process → automated 2-hour process) is a capability build-out, not a monotonic reduction. The site gets this right elsewhere:
- `src/lib/studies.ts:97` (Abuse Investigation Platform → Outcome) correctly avoids the trap: *"coordinated-network detection cut from roughly 30 days of manual correlation to under two hours"* — no "none" as a starting point for "cut."
- The Home.tsx stat display (`Home.tsx:157-169`) sidesteps the issue by using neutral labels (NOTHING → 30 DAYS → UNDER 2 HOURS) with no verb.

**Suggested fix (apply consistently in all three spots):** replace the "reduced/fell from none" framing with something like *"Average detection time for coordinated abuse networks went from no detection capability, to roughly 30 days of manual work, to under 2 hours..."* — or split into two claims: "Built detection capability from nothing... then cut detection time from roughly 30 days to under 2 hours."

## 2. Subject–verb agreement — "clustering that turn"

**Where:** `src/lib/studies.ts:71` (Abuse Investigation Platform → abstract):
> "...a rule engine, behavioral time-series scoring, and graph-based clustering **that turn** scattered signals into ranked, human-reviewed leads."

**Problem:** As written, "that turn" most naturally attaches to the nearest antecedent, "graph-based clustering" (singular), which needs "turns." If the relative clause is meant to describe all three items collectively, the sentence should make that explicit rather than rely on a strained plural agreement.

**Suggested fix:** *"...a rule engine, behavioral time-series scoring, and graph-based clustering — together turning scattered signals into ranked, human-reviewed leads."*

## 3. Non-idiomatic verb use — "narrowed to this candidate shortlist by match against"

**Where:** `src/lib/studies.ts:128` (Graph-Based Detection Research → Method):
> "A research base of 200+ papers... was narrowed to this candidate shortlist **by match against** real abuse graph shapes."

**Problem:** "By match against" is not standard English phrasing; "match" isn't idiomatic as a bare noun here.

**Suggested fix:** *"...was narrowed to this candidate shortlist by matching against real abuse graph shapes."* or *"...based on their fit to real abuse graph shapes."*

## 4. Intransitive misuse of "ingest"

**Where:** `src/lib/studies.ts:167` (Enforcement Workflow Application → Architecture):
> "**Moderation signals ingest** from platform APIs into a local datastore."

**Problem:** "Ingest" is a transitive verb (a system ingests signals); signals don't "ingest" themselves. Every other verb in this figure/section is used correctly in the active voice with a clear agent (pattern engine "surfaces," verdicts "route" — arguably "route" has the same issue, see below, but "ingest" reads most awkwardly).

**Suggested fix:** *"The system ingests moderation signals from platform APIs into a local datastore."* (Matches the diagram's own labels: "SIGNAL INGEST" as a stage name, in `StudyFigure.tsx:110`.)

## 5. `llms.txt` is missing a real page — inconsistent with sitemap.xml

**Where:** `public/llms.txt:20-24` lists four pages under "## Pages": home, `reseller-disruption`, `enforcement-app`, `gnn-detection`. It omits `/work/abuse-investigation-platform` — Plate 02, the one case study marked **"SHIPPED · IN PRODUCTION USE"** and the subject of the site's headline detection-time stat.

`public/sitemap.xml` correctly lists all five URLs including `abuse-investigation-platform`.

**Fix:** add the missing line to `llms.txt`, e.g.:
```
- https://joeburns.ai/work/abuse-investigation-platform : case study, abuse investigation platform (shipped, in production)
```

## 6. Minor / stylistic (lower priority)

- **`Home.tsx:33` (Experience bullet 1):** *"Co-built safeguards and enforcement capability from nothing with a partner analyst: no formal mandate, data-constrained environment, function now embedded across product, policy, and legal."* The list after the colon mixes two noun-phrase fragments ("no formal mandate," "data-constrained environment") with a full clause ("function now embedded..."). Consider making all three parallel fragments, e.g. "no formal mandate, a data-constrained environment, now embedded across product, policy, and legal."
- **`Home.tsx:262-272` ("Now" section):** The three ongoing projects are introduced as Plate 02, then Plate 04, then Plate 03 — out of numeric order. Not a grammar error, but reordering to 02 → 03 → 04 (or explicitly grouping "two projects extend it" before naming plates) would read more clearly.
- **`src/lib/studies.ts:153` (Enforcement Workflow Application metrics):** "HITL" is used as a metric value with no expansion anywhere on the page (unlike "E2E" and "LOCAL," which are explained by their labels). Consider spelling out "human-in-the-loop" once, or adding a label that decodes it, since first-time readers won't know the acronym.
- **`public/llms.txt:3-4`:** *"He builds detection capability, not just runs it: behavioral detection systems, graph-based network attribution, and enforcement strategy..."* — the colon-introduced list reads as elaborating "detection capability," but grammatically it's appended after "runs it," which is one step removed from what it's meant to describe. Consider: *"He builds detection capability rather than just running it — behavioral detection systems, graph-based network attribution, and enforcement strategy that turns findings into action..."*

## Not flagged (intentional style, left as-is)

Many section abstracts and card copy use verb-less noun-phrase fragments (e.g., "Disruption of third-party automation and reseller ecosystems behind hundreds of thousands of abusive accounts: behavioral fingerprinting, payment-signal analysis..."). This is a consistent, deliberate editorial style across every case-study abstract and is not treated as an error.
