# Field report: what the brief really says and what the field has shipped

*Researched 12 Nov 2026. Sportsbook contest closes 14 Nov 2026, 18:00 UTC (19:00 WAT).*

## How this was gathered, and what it can't tell you

- `housebets.com/contests` sits behind a Cloudflare challenge and returned 403 to me. I did not try to get around it.
- The official brief below comes from a **competitor's public repo** (`mohanganesh3/housebets-sportsbook`), which committed a full-page screenshot and a text capture of the contest page dated 9 Nov 2026. I read the screenshot myself and it matches their text. It is still a secondhand copy that is three days old. **Re-read the live page before you submit**, especially the News section.
- The field analysis covers **37 public GitHub repos** found by searching for "housebets", of which I opened 10 live demos at 1440 px and 390 px. The contest page said **131 entered** on 9 Nov, so I've seen roughly a quarter of the field at best. Entries hosted without a public repo are invisible to me.
- I found **nothing public about the 30-second ad contest** beyond one line in a Housebets X post ("$3K: make a 30-second Housebets ad"). No brief, no scorecard, no entries. Section 5 lists what you need to copy off the page for me.

---

## 1. The official sportsbook brief (as captured 9 Nov)

**"Housebets Sportsbook is coming." Design it. A clickable prototype: 5 pages, singles only.**
How to win: **"The sportsbook we'd ship tomorrow wins."**

| Scorecard | Pts |
|---|---|
| Sports home | 15 |
| Live | 10 |
| Football | 10 |
| **Match page** | **20** |
| **Bet slip + My bets** | **20** |
| Feels like Housebets | 15 |
| Every state: suspended, changed, failed | 10 |

Ties: higher Match page score wins, then Feels like Housebets.

**Minimum bar:** "Our wireframes. Match them, then beat them. Pages 5 and 6 here are one page in your entry."

**Page spec (verbatim bullets)**

1. **Sports home**: Live now · Starting soon · Top competitions · Sports nav · Search: teams, players, competitions, markets
2. **Live**: Every match in play · Filter by sport and competition · Live score and clock · Nothing live: show Starting soon
3. **Football**: Premier League, Champions League, LaLiga, Serie A, Bundesliga · Match result odds on each row · Follow a team or competition
4. **Match page**: Example: Arsenal v Brighton, live · Scoreboard: score, clock · Market groups: Popular, Goals, Halves, Handicaps, Goalscorers, Corners & cards · Odds moving, markets suspended
5. **Bet slip + My bets**: Tap odds, add to slip · Singles only · Decimal odds, stakes in USDT · Stake, odds, potential return · Odds changed: player must accept · Selection suspended · Bet placed, bet failed · My bets: open, settled, cash out · Bet slip and My bets share one page

**Out of scope:** multis, accumulators, bet builder · boosts, free bets, promos · outrights, specials · stats widgets, match trackers · AI search.

**Deliver:** all 5 pages linked · works at 390 px and 1440 px · bet slip on phones is a bar at the bottom · front end only · public link with no login · sample data only, no real players, no real money.

**Submission form:** (1) prototype link, (2) tick all five pages, (3) "Your big idea. What makes it Housebets? 80 to 800 characters", (4) tools and templates used. You confirm: singles only; no real player data or money; own work with tools named; Housebets can share it; if you win, Housebets owns the code, designs and rights.

**Rules that matter**

- 3 submissions per 24 hours. "We judge every submission, and your best one counts. A new submission never replaces an earlier one."
- "Sample fixtures and odds only. **Don't copy another sportsbook.**" Copying another entry is also banned.
- Prizes $9,000 / $4,000 / $2,000, paid in USDT to your Housebets wallet. Results 7 days after close.
- One Housebets account per person.
- **Not open to players in US, FR, NL.**

### Three things in the brief that your v1 prompt misses

1. **The wireframe has tabs the brief bans.** The match wireframe shows `Popular 10 · Goalscorers 9 · Goals 11 · Players 11 · Halves 8 · Handicaps 5 · Corners & cards 14 · Minutes 10 · Specials 7 · All markets 85`. The brief names six groups and puts **specials out of scope**. Build the six plus "All". Don't ship a Specials tab.
2. **The primary button is pale cyan, not `#02f8f8`.** In the wireframes, Register, the selected state and the phone slip bar are a pale cyan fill with dark text. A competitor's token capture puts it at `#c4f4f1` (hover `#82e0e0`). Odds text is the saturated cyan. Your v1 prompt makes Place bet `#02f8f8`, which will read as off-brand next to the real shell. Check the starter pack tokens and use theirs.
3. **The wireframe shell is signed out** (Log In / Register) with a `$ 0.00` stake field and a Tether chip on totals. Your default should be a signed-in demo wallet so stake, low-balance and cash-out work, with signed-out as a reachable state that keeps the slip.

### What the wireframes actually show (I viewed all 12)

- **Shell:** 80 px top bar with sidebar toggle, "Housebets" wordmark with a wave graphic, centred "Weekly Prize $50,000.00" trophy widget plus a crown button, then search, side-panel toggle, Log In, Register. A 72 px icon rail on the left. A floating round avatar bottom-right.
- **Home:** search, sport tabs (Home · Live 13 · Soccer · Tennis · Basketball · Baseball · American Football · Esports), Favourites chips, "Your matches" table, "Featured matches" card carousel, "Upcoming events".
- **Live:** "Live now" header, sport filter chips with counts, competition groups with a follow star, rows with LIVE pill, minute or HT, score, 1X2 cells, `+115 ›`. Suspended rows show one wide amber-outlined "Suspended" cell with a lock.
- **Football:** "Soccer" dropdown, "5 competitions · 6 live", a market dropdown (Match result), "Live & Upcoming / All Soccer" toggle, competition dropdown, grouped rows.
- **Match:** breadcrumb dropdowns (Soccer › England › Premier League › ARS - BHA), scoreboard card with crests, Following / Follow chips, boxed 1 – 0, LIVE 52', in-match search, tabs with counts, accordion groups. Selected cell is filled with a corner tick.
- **Slip (desktop):** right panel with Bet slip (1) · My bets (1) · Chat tabs, "Singles · 1 selection · Clear all", one card, totals, Place bet. The card sits at the bottom of a mostly empty panel.
- **My bets (desktop):** Open (1) / Settled (7) segmented control, date chips (All time, Today, Last 7 days, Last 30 days, Custom), sports dropdown, table: Placed · Bet · Odds · Stake · Returns · Result, with an expand chevron.
- **Phone:** bottom nav Menu · Sports · Casino · Chat · Support. The slip is a pale-cyan bar above the nav reading `1 | Arsenal @ 1.30 ⌃`, which opens a bottom sheet with the same three tabs.

---

## 2. The field

### Who is actually dangerous

| Entry | What it does well | Where it's exposed |
|---|---|---|
| **mohanganesh3** (React, built with Devin) | Closest shell match to the wireframes of anything I saw: prize widget, icon rail, pale-cyan CTA, real fonts. 96 markets from a Poisson pricing model. Suspension reasons. Cash out that can fall. A flask button that triggers every state. Lighthouse numbers published. | Desktop match page stacks 1X2 as three full-width rows, which wastes the fold and breaks from the wireframe's three-across grid. Percentages beside every price add clutter. A "session 47 min · net −12.00" strip and a pinned "your bet" bar push markets down. Type is small at 1440. |
| **zeroknowledge0x** (3 variants) | Clean and brief-faithful. A "Demo states" menu with a scripted Brighton goal that suspends, changes the score and reprices. Uses all three daily slots with three different ideas. | v1 type is tiny at 1440 and the empty slip offers "Add 2 sample picks", which reads as a demo crutch. v2 "Floodlit board" drops the Housebets shell feel. v3 "Calls" is social betting with a simulated "Housebets AI", which is close to two out-of-scope lines. No real Housebets fonts or CTA colour ("brand pack was not available"). |
| **biawaklangit** | Dense trading-desk rows, 161 selections, slip docks as a column that reflows the grid, a states switcher. | Ships possession bars, momentum charts and a match stats block. That's the banned "stats widgets". Also a promo hero banner. |
| **IamYerhyer** | Hubie art, good-looking home, favourites. | Home leads with "Your wallet's history is worth money here", an on-chain bonus and a Rewards rail. Promos are out of scope and they take the top of the highest-value page after Match. |
| **bayuewalker** | 164 automated browser checks, tidy. | Rebrands the product "HOUSE//LIVE", uses initials-in-a-disc crests and Manrope. Low on "Feels like Housebets". |
| **nothing010101** | Distinct editorial look, sticky scoreboard. | Serif headlines and a green accent. It doesn't look like Housebets. |
| **rajdeblol** | Polished hero art. | A marketing landing page before any odds, plus KPI tiles ("+70.7% demo ROI"). |

### What almost everyone has (so it no longer differentiates)

Rough keyword counts across the 37 repos. Treat them as signals, since a keyword can match a comment.

| Feature | Repos |
|---|---|
| Respects reduced motion | 19 |
| Insufficient-balance failure | 18 |
| A demo / states control panel | 10 (all of the strong ones) |
| Hubie or a sloth somewhere | 8 |
| Odds flash, suspended lock, accept-change, receipt | effectively all serious entries |

### What almost nobody has

| Gap | Repos |
|---|---|
| **Every state reachable by URL** (a judge can open "odds changed" directly) | **0** |
| **Sticky mini scoreboard on the match page** | 1 |
| The real pale-cyan CTA | 2 |
| Oxanium numerals | 2 |
| "Accept higher odds only" preference | 3 |
| Partial cash out | 3 |
| Figtree | 5 |

### Scope violations are common, and they're the cheapest points you can win

Keyword signals for banned features: stats/possession/momentum in 9 repos, boosts/bonuses/rewards in 10, multi/accumulator/bet-builder language in 11. Some of those are disclaimers, but at least three of the strongest-looking entries visibly ship banned features on their first screen. The form makes entrants tick "singles only, no multis, boosts or free bets", so judges are primed to check.

### The pattern that will make a judge's eyes glaze

After a hundred entries: dark navy, cyan accent, Lucide icons, initials-in-a-circle crests, a hero banner, a chip wall, and a "Demo states" button in the top bar. An entry that opens looking exactly like the Housebets wireframe, then turns out to be alive, stands out more than one that opens with a new idea.

---

## 3. Where you can win

1. **Shell fidelity from the real starter pack.** Your refs doc cites `/workspace/housebets-contest/packs/`, so you appear to have the official files. Two top rivals say in writing that they couldn't get them. Pixel-level parity with the wireframe at first paint is something most of the field cannot do.
2. **The match is the demo.** Instead of making the judge find a states menu, run Arsenal v Brighton on a scripted timeline from 52:00 so that within about 45 seconds of opening the match page a price shortens, a price drifts, a VAR check suspends the market, and it reopens repriced. Keep a control panel as well, but nobody should need it.
3. **State deep links.** `…/match/ars-bha?state=suspended`. Put the list in the README and in your big-idea text. Zero of 37 repos do this, and it turns the 10-point states line into a 60-second checklist for the judge.
4. **Sticky scoreboard and the three-across 1X2 grid** on the 20-point page that also breaks ties.
5. **Zero banned features, said out loud.** No stats, no promos, no hero banner, no AI, no social.
6. **Legibility.** Odds at 15 to 16 px minimum. Several strong rivals are hard to read at 1440.
7. **Submit early, three times.** Your best one counts and later ones don't replace earlier ones. Get a safe wireframe-faithful build in today, then iterate.

A note on the judge: one competitor's research names a specific former Housebets head of design as the judge and builds a taste profile from his portfolio. The contest page only says "Judged by the Housebets product and design team", and that research itself says he left the company in October. I have not verified any of it and haven't built on the identity claim. The taste points it draws (consistency across pages, designed failure paths, small earned motion, mobile first) are sound on their own.

---

## 4. Brand facts collected

Marked by how sure I am.

**Seen directly in the wireframes**

- Wordmark "Housebets" with a cyan "H" and white remaining letters, plus a wave graphic to its right.
- Pale-cyan primary button with dark text. Saturated cyan odds. Gold star and "Following" chip. Red-pink LIVE pill with a dot. Amber-outlined "Suspended" cell with a lock. Tether-green ₮ chip beside totals.
- Gold is used for the prize amount and for follows.

**From a competitor's capture of the live site's CSS (verify against your starter pack)**

- Fonts: **Figtree** (UI), **Red Hat Display 700** (headings), **Oxanium 600/700** (numerals).
- `--bg-primary #041015` · surfaces `#0b1920 / #0e202a / #0d2a38` · borders `#0d2531 → #113a4c` · text `#f9f9fb / #8f96a8` · disabled `#464b59` · accent `#02f8f8`
- Primary button `#c4f4f1`, hover `#82e0e0`, text `#041015`. Secondary `#113a4c`.
- Success `#47d496` · error `#f41f50` / `#fa2e5d` · warning `#e17823` · gold `#daa520` · USDT `#26a17b`
- Header 60 to 80 px, left rail 72 px, phone bottom bar 67 px. Radius mostly 8, cards about 12, pills full.
- Voice on the contest page: sentence case, short declaratives, numerals, no exclamation marks, no emoji. "Your prototype should be at least this good."

**Hubie (from public entries to the Hubie streamer contest, which cite Housebets' own on-site chat)**

- A sloth in a navy top hat with an orange/gold "H" badge, tuxedo, bow tie, gold cufflinks. Calm, warm, dry.
- Catchphrases: "slow it down!", "not today man", "i see everything", "haha, nice."
- Never promises wins, never tells anyone to deposit, never gives tips.

---

## 5. What I need from you

1. **The ad contest brief.** Open `housebets.com/contests`, go to the ad contest, and paste me the Task and Rules tabs: length rule (exactly 30 s, or up to?), aspect ratio, how you submit (file, link, post on X?), scorecard, deadline, music and AI rules. The ad prompt is written to survive any of those answers, but I had to guess.
2. **Confirm you have the starter pack** (shell, brand pack, logo SVG, fonts, Hubie art). Both prompts lean on it.
3. **Confirm you're eligible** (not in US, FR or NL, one account).
