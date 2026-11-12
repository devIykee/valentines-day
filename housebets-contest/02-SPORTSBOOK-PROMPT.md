# Sportsbook prompt v2

Paste everything inside the fence into your coding agent. Attach or `@` these with it:

- the official starter files (shell, brand pack, logo, fonts) and the 12 wireframe WEBPs from `packs/`
- `inputs/SPORTSBOOK-WORLD-CLASS-REFS.md`
- `01-FIELD-REPORT.md`

What changed from your v1 prompt, and why, is listed under the fence.

````text
You are the principal product designer and front-end engineer for the Housebets sportsbook. Build a clickable prototype for the Housebets Contest Labs "Sportsbook is coming" contest. Judges are the Housebets product and design team. Their one-line test is: "The sportsbook we'd ship tomorrow wins."

About 130 people have entered. Most entries are a dark navy sportsbook with a cyan accent, initials-in-a-circle crests, a hero banner and a "Demo states" button. Ours wins by doing three things the field mostly doesn't:
1. It opens looking exactly like the official Housebets wireframes, built from the official starter shell.
2. It is alive without being asked: the Arsenal v Brighton match plays a scripted timeline that walks through every scored state on its own.
3. It contains nothing the brief put out of scope, and every state has its own URL.

Read the attached wireframes, starter files, SPORTSBOOK-WORLD-CLASS-REFS.md and 01-FIELD-REPORT.md before writing code. Where this prompt and the starter files disagree on a token, a font, a size or a label, the starter files win. Tell me each time that happens.

====================================================================
0. HARD RULES (a breach of any of these loses the contest)
====================================================================
- Exactly 5 pages, all linked: Sports home, Live, Football, Match (Arsenal v Brighton, live), Bet slip + My bets as ONE page.
- Works at 390 px and 1440 px wide. Design 390 first.
- Inside the Housebets site shell: top bar, left nav, side panel.
- On phones the bet slip is a bar at the bottom.
- Singles only. Decimal odds. Stakes in USDT.
- Front end only. Static build. No backend, no network calls at runtime, no login wall.
- Sample data only. No real players, no real money. Club and competition names appear as in the wireframes. Every player name is invented.
- Do not copy another sportsbook's layout or skin, and do not copy any other contest entry. Take patterns, not pixels.
- OUT OF SCOPE, do not build, do not hint at, do not leave a stub for:
  multis, accumulators, bet builder, boosts, free bets, promos, bonuses, rewards, outrights, specials, stats widgets (possession, shots, momentum, form, head-to-head), match trackers or pitch graphics, AI search, AI tips, AI anything, tipster or social betting, leaderboards, hero or marketing banners, price-history charts.
  The wireframe's match tabs include "Specials", "Players" and "Minutes". The written brief names six groups and bans specials. Build the six named groups plus "All". No Specials tab.
- The wireframe shows the existing "Weekly Prize $50,000.00" widget in the top bar. It is part of the supplied shell, so keep it as supplied and inert. Add no other promotional surface.

====================================================================
1. WIREFRAME PARITY COMES FIRST
====================================================================
The brief says "Our wireframes. Match them, then beat them." Before adding anything, make each page match its wireframe at first paint at 1440x900 and 390x844: same shell, same regions in the same order, same labels, same sample values.

Build an overlay check: a script that screenshots each route at both sizes and saves it beside the matching wireframe for side-by-side review. I will look at those pairs before anything else.

Parity details that most entries get wrong:
- Top bar: sidebar toggle, "Housebets" wordmark (cyan H, white "ousebets") with the wave graphic, centred Weekly Prize widget plus crown button, then search, side-panel toggle, and the account area. Use the logo file from the brand pack. Never redraw it.
- Left rail: 72 px icon rail with the starter pack's icons, sportsbook item active.
- Primary buttons are PALE cyan with dark text (starter token; expected near #c4f4f1, hover #82e0e0, text #041015). Saturated cyan #02f8f8 is for odds prices, links and focus. Do not make Place bet saturated cyan.
- Selected odds cell: filled, white text, small tick in the top-right corner, exactly as the wireframe.
- LIVE: red-pink pill with a dot, minute beside it in the same colour.
- Suspended row on lists: one wide amber-outlined cell with a lock and "Suspended", replacing the three price cells.
- Follow: outline star and "Follow"; gold star and gold-outlined "Following" chip.
- Totals carry the Tether ₮ chip.
- Phone bottom nav: Menu, Sports, Casino, Chat, Support. The slip bar sits directly above it.
- Fonts from the brand pack. Expected: Figtree for UI, Red Hat Display 700 for headings, Oxanium 600/700 for odds, scores and clocks. Self-host them. Tabular numerals everywhere a number can change.
- Tokens (verify against the pack): bg #041015; surfaces #0b1920, #0e202a, #0d2a38; borders #0d2531 to #113a4c; text #f9f9fb and #8f96a8; disabled text no darker than #7d919c so it passes 4.5:1; success #47d496; error #f41f50; warning #e17823; gold #daa520; USDT #26a17b.

Default session: signed in with a demo wallet (balance 250.00 USDT in the top bar where Log In / Register sit in the wireframe), because stakes, low balance and cash out need a wallet. A signed-out state must exist and must look exactly like the wireframe's top bar.

====================================================================
2. THE MATCH IS THE DEMO: ONE SCRIPTED TIMELINE
====================================================================
A single deterministic engine drives every page. No Math.random without a fixed seed. Same inputs, same screen, every load.

Arsenal v Brighton & Hove Albion starts at 52:00, Arsenal 1 - 0, Match result 1.30 / 4.60 / 11.00 (wireframe values). The clock runs in real time as mm:ss. The timeline starts when the session first loads, is stored in sessionStorage so it continues across pages, and restarts on "Restart match" or a hard reload of the match page with ?t=0.

T+0s    52:00  1.30 / 4.60 / 11.00. Everything open.
T+8s    Arsenal 1.30 -> 1.28. Cell flashes once. Direction arrow stays for 6 s.
T+14s   Draw 4.60 -> 4.75. Brighton 11.00 -> 11.50.
T+22s   Event chip on the scoreboard: "VAR check: possible penalty". Every goal-dependent market suspends in the same frame (Match result, Double chance, Draw no bet, Total goals, Both teams to score, Next goal, all Handicaps, all Goalscorers, all second-half goal markets). Corners & cards markets STAY OPEN. This selectivity is what a real book does and almost no entry shows it.
T+30s   "No penalty". Markets reopen repriced: 1.33 / 4.40 / 10.50. Changed cells flash once.
T+45s   Small drift on Total goals and one corner market.
T+75s   "Goal check" suspends goal markets. At T+79s the score becomes 1 - 1 (invented scorer for Brighton). At T+84s markets reopen: 2.10 / 3.10 / 4.20. Next goal becomes "goal 3". Goalscorer market drops the scorer's "first goalscorer" line.
T+84s+  Gentle drift every 10 to 15 s, at most two cells at a time. Nothing else dramatic until 60:00.

Other live matches (Aston Villa v Fulham at HT, Newcastle v Everton 2-1 at 58' starting suspended, Atletico v Sevilla suspended, Juventus v Roma 1-1 at 49', and the rest from the wireframes) run lighter loops from the same engine so Home and Live are never frozen.

Pricing must be coherent. Derive every market from one model per match (team goal rates plus current score and time remaining). Overround between 104% and 108% on every market. 1X2, Double chance, Draw no bet and the handicaps must agree with each other. A judge who bets will notice if Double chance contradicts Match result.

Engine discipline:
- Updates pause when the tab is hidden and resume without a burst.
- A market that is suspended cannot be tapped, in the same frame it suspends. No stale price is ever tappable.
- One odds component, one slip-card component, one status-pill component, used on every page. If a pattern appears twice it is the same code.

====================================================================
3. PAGES
====================================================================
Common to all: 44 px minimum touch target. Odds text at least 15 px on phone and 16 px on desktop. Secondary text at least 12 px. No horizontal scroll at 390 except deliberate carousels and tab strips. Phone uses three-letter codes with crests (ARS, BHA); desktop uses full names. Never truncate a team name with an ellipsis on a row where a price could be confused.

--- 3.1 Sports home (15 pts) ---
Order, top to bottom, as in the wireframe: search; sport tabs (Home, Live with count, Soccer, Tennis, Basketball, Baseball, American Football, Esports); Favourites chips (removable); Your matches (from follows, live first); Live now; Starting soon (with a countdown under 60 min, clock time otherwise); Top competitions; Featured matches carousel; Upcoming events.
The brief's five required items are Live now, Starting soon, Top competitions, Sports nav, Search. All five must be visible without hunting. On phone, Live now must begin inside the first screen.
Search: typed results grouped under Teams, Players, Competitions, Markets, each with a count. Keyboard: "/" focuses, arrows move, Enter opens, Esc closes. A market result ("Over 2.5", "corners") deep-links to that market on the match page and highlights it for 1.5 s. Empty query shows recent searches and follows. No results: "No matches for 'xyz'" plus the three nearest live matches. This is ordinary search. Do not label it AI.
Every row carries Match result prices, so a first pick never needs the match page. Each row shows "+N" markets.

--- 3.2 Live (10 pts) ---
"Live now" with total. Sport chips with live counts. A competition filter. Filters live in the URL. Groups by competition, collapsible, each with a follow star. Rows: LIVE pill, minute or HT, score, 1X2, +N. Score changes animate once (the changed digit only).
A "My bets" filter chip shows only matches where the player has an open bet, with the bet summarised under the row.
Nothing live: heading "Nothing live right now", one calm line, then the Starting soon list directly beneath, already populated. A sport filter with no live matches gets the same treatment scoped to that sport.

--- 3.3 Football (10 pts) ---
As the wireframe: sport dropdown, "5 competitions · N live", market dropdown (Match result only is fine, but the control must work if there is a second option such as Total goals 2.5), "Live & Upcoming / All Soccer", competition dropdown.
Competitions in this order: Premier League, Champions League, LaLiga, Serie A, Bundesliga. Sticky competition header with 1 / X / 2 column labels on desktop. Follow on the competition header and on each team (star beside the team name, or long-press on phone with a visible alternative). Following updates Favourites on Home immediately and persists in localStorage.

--- 3.4 Match page (20 pts, and the tie-breaker) ---
Breadcrumb dropdowns: Soccer > England > Premier League > ARS - BHA. The last dropdown lists other live matches so the player can switch without going back.
Scoreboard card as the wireframe: competition label, crests, names, Following / Follow chips, boxed score, LIVE pill and clock, a star to follow the match.
Under the clock, a single-line event chip appears only when something is happening ("VAR check: possible penalty", "Goal check", "No penalty"). It is text. No pitch graphic, no timeline of events, no stats.
STICKY: when the scoreboard scrolls out, a 48 px bar pins under the top bar: "ARS 1 - 0 BHA · 52:14 · LIVE", plus the event chip when present, plus the Match result prices on desktop. On phone the market tabs pin directly beneath it.
In-match search ("Search markets or players"): filters across all groups as you type, shows match count, highlights the matched text, and Esc restores the previous tab.
Tabs with honest counts: Popular, Goals, Halves, Handicaps, Goalscorers, Corners & cards, All. Counts are computed from data, never typed.
Accordion groups. Popular open by default. Each group header shows its name, a collapse chevron, and, when suspended, a lock and the reason.
Minimum markets (around 50 to 60 selections is enough; depth past that scores nothing if states are thin):
- Popular: Match result, Double chance, Total goals 2.5, Both teams to score, Next goal, Draw no bet
- Goals: Total goals 1.5 / 2.5 / 3.5 / 4.5, Arsenal total goals, Brighton total goals, Exact total goals, Odd/even
- Halves: 2nd half result, 2nd half total goals, 2nd half both teams to score, Half with most goals
- Handicaps: Asian handicap (three lines), 3-way handicap (two lines)
- Goalscorers: Next goalscorer, Anytime goalscorer. Six invented players a side plus "No goalscorer".
- Corners & cards: Total corners (two lines), Corner handicap, Next corner, Total cards, Next card
Layout: Match result is three cells across at every width, as the wireframe. Two-outcome markets are two across. Line markets are a compact table with the line in the left column.
Odds cell behaviour:
- Tap adds to the slip; tap again removes. Selected state as the wireframe.
- Price change: the cell background flashes for 200 ms and a small arrow sits beside the price for 6 s, then clears. Green up-arrow when the number rose, red down-arrow when it fell. The arrow always points the way the number moved. Never flash on re-render, only on a real change.
- Suspended: the group's cells grey out, prices are replaced by a lock, the header shows the reason. The Housebets wave is the motif: a single low-contrast wave sweeps left to right across the group in 400 ms as it locks, and sweeps back as it reopens. With reduced motion, it is an instant state change.
- A suspended cell that is in the slip keeps its selected outline so the player can still see what they picked.
Loading: skeleton rows shaped like the real rows for the first 300 ms. Never a white flash or a spinner page.

--- 3.5 Bet slip + My bets (20 pts) ---
One page at /slip with tabs: Bet slip (count), My bets (count), Chat. The same component is the desktop side panel and the phone bottom sheet. Chat is a static placeholder tab that says chat lives in the main product. Build nothing social.

PHONE BAR (required by the brief): a pale-cyan bar directly above the bottom nav, as the wireframe ("1 | Arsenal @ 1.30" and a chevron). Improve it: when a stake is set, show "10.00 -> 13.00 USDT" on the right. When the selection is suspended or changed, the bar changes colour and label ("Paused", "Price changed") so the player knows before opening. With an empty slip the bar is hidden. Tap opens a bottom sheet that never exceeds 85% of the viewport height, leaves the scoreboard bar visible, can be dragged down to close, traps focus, and closes on Esc and on back.

DESKTOP PANEL: the wireframe leaves the selection at the bottom of an empty panel. Anchor the selection at the top and pin totals and Place bet to the panel's foot.

SLIP CARD (one component, used in slip, receipt and My bets):
selection name and price on line one; market, match, live score and minute on line two; stake input with ₮ and a "Returns" value on line three; remove (x) top right.
Stake: quick chips 5, 10, 25, 50, Max. On phone a custom numeric keypad inside the sheet (no OS keyboard, so the sheet doesn't jump). Two decimals. Returns = stake x odds, updating on every keystroke. Empty stake shows Returns as a dash, not 0.00.
Footer: Total stake, Potential return, both with ₮. The button is disabled with a reason until valid ("Enter a stake"), then reads "Place 10.00 USDT · returns 13.00".
With two or more selections each card has its own stake and the header reads "Singles · 2 selections". The button reads "Place 2 singles · 25.00 USDT". There is no combined-odds line anywhere.
Settings (gear icon in the slip header): "If the price changes" with three options: Always ask (default), Accept higher prices automatically, Accept any price. Persisted. When a rule auto-accepts, the receipt says so ("Placed at 1.33. You chose to accept higher prices.").

SLIP STATES (each must be reachable by timeline, by control panel and by URL):
1. Empty. Hubie may appear here, small. One line and a link to Live.
2. Selection added. Cell tick, bar count bump, no toast spam.
3. Price changed. Card shows old price struck through, new price, direction arrow. The button is replaced by "Accept 1.33 and place" plus a secondary "Remove". Nothing can be placed until accepted. Never update a slip price silently.
4. Selection suspended. Card dims, shows "Paused: VAR check". Place is disabled with the reason. The stake is kept. On reopen it either returns to normal or becomes state 3.
5. Selection closed (market settled while in slip). Card shows "No longer available", only Remove is offered.
6. Placing. The button shows a 2 s progress ring and "Confirming". The slip is locked. Leaving the page, hiding the tab or closing the sheet during placing must resolve cleanly to placed or not placed, never a stuck state and never a double bet.
7. Placed. Receipt in place of the card: tick, "Bet placed", bet ID (HB-XXXXXX), selection, price, stake, potential return, time. Two actions: "View in My bets" and "Keep selection". The slip clears by default. Hubie may appear, small, with one calm line that makes no promise.
8. Failed. One message and one next step per cause, and always the line "Your stake was not taken":
   - price changed while confirming -> state 3
   - market suspended while confirming -> state 4
   - not enough balance -> "You have 4.20 USDT. Deposit and return to this slip" (slip is preserved; Deposit opens a demo sheet that adds balance and returns)
   - stake above the limit -> "Maximum for this market is 500.00 USDT" with "Set to max"
   - stake below the minimum -> "Minimum stake is 0.10 USDT"
   - connection lost -> "Not placed. Check your connection." with "Try again"
   - signed out -> "Log in to place this bet." The slip survives log in.

MY BETS:
Header "My bets · 1 open · 7 settled". Open / Settled segmented control with counts. Date chips: All time, Today, Last 7 days, Last 30 days, Custom. Sport dropdown.
Desktop: the wireframe's table (Placed, Bet, Odds, Stake, Returns, Result) with a chevron that expands the row into the slip card layout. Phone: slip cards.
Seed data matches the wireframe: one open bet, Arsenal, Match result, Arsenal v Brighton, 1.80, 20.00, returns 36.00, placed 14:58. Seven settled: a mix of Won, Lost, Void and Cashed out. Lost bets show "Returned 0.00". No disguising a loss.
Open live bets show score and minute, updating from the engine.
Any bet placed during the session appears at the top of Open immediately.

CASH OUT (six states, one component):
1. Available: button reads "Cash out 22.40 USDT". The value moves with the engine and can fall as well as rise.
2. Confirm: first tap turns the button into "Confirm 22.40 USDT" for 5 s with a quiet countdown line, then reverts. No pressure styling.
3. Value changed during confirm: old value struck through, new value shown, confirm again.
4. Suspended: greyed, "Cash out paused: VAR check". It suspends in the same frame as the market.
5. Not available: plain text "Cash out isn't offered on this market" (use it on one settled-soon or goalscorer bet).
6. Done: "Cashed out 22.40 USDT", gold tick, a single wave sweep across the ticket under 600 ms, bet moves to Settled with result "Cashed out". Balance in the top bar updates.
When Brighton equalise at T+79s the open Arsenal bet's cash out value must drop visibly. That one moment shows the judge that slip, market and My bets share one truth.

====================================================================
4. STATES ARE ADDRESSABLE (nobody else does this)
====================================================================
Every state opens from a URL, on the right page, with the right data, with no clicking:
  /match/ars-bha?state=odds-up | odds-down | suspended | reopened | goal
  /slip?state=empty | changed | suspended | closed | placing | placed
  /slip?state=failed-balance | failed-limit | failed-min | failed-connection | failed-changed | failed-suspended | signed-out
  /slip?tab=mybets&state=open | settled | cashout-available | cashout-confirm | cashout-changed | cashout-suspended | cashout-unavailable | cashout-done
  /live?state=nothing-live
  /?state=signed-out
Use whichever routing makes these work on a static host on hard refresh (hash routes, or prerendered folders).

Also build:
- /states : a plain index page listing every state above as a link, grouped by scorecard line, opening at the current viewport. It is not one of the five pages and is linked only from the control panel and the README.
- A control panel, opened from a small flask icon at the foot of the left rail (phone: last item in Menu). It lists the same states, plus Restart match, Pause updates, Speed x1 / x4, Reset demo. It must not sit in the top bar and must not be the first thing a judge sees.
- "Tour" in the control panel: plays the whole story in about 40 s with a one-line caption per step, pausable.

====================================================================
5. FEELS LIKE HOUSEBETS (15 pts)
====================================================================
- The shell, logo, fonts and tokens are the real ones. That is most of this score.
- Colour has jobs. Pale cyan fill: the one primary action on screen, and selected. Saturated cyan: prices and links. Red-pink: LIVE and a falling price. Green: a rising price and success. Amber: suspended and warnings. Gold: follows, prizes, and cash-out or win confirmation. No colour is decoration.
- The wave is the only motif: suspension tide, cash-out sweep, the skeleton shimmer shape. Nowhere else.
- Hubie is the Housebets sloth: navy top hat with a gold H badge, tuxedo, bow tie. Use the official art from the brand pack. If the pack has no Hubie art, leave him out entirely. Do not draw or generate one. He appears in at most three places: empty slip, bet placed receipt, nothing live. Never beside a price. He never gives tips and never promises anything.
- Voice: sentence case, short, dry, numerals, no exclamation marks, no emoji. Model lines on the contest page ("Your prototype should be at least this good."). Hubie's known lines: "slow it down", "haha, nice." Use at most one of them.
- Crests: use what the starter pack supplies. If it supplies none, draw original shield crests per club (shape, two club colours, one simple charge). Never initials in a circle. Never official club or league logos unless they are in the pack.
- Motion: presses 120 to 150 ms. Odds flash 200 ms. Sheet open 240 ms with a decelerating ease. Nothing on a money path longer than 400 ms. No bounce on numbers, no confetti, no pulsing except the LIVE dot. Every animation has a reduced-motion version.

====================================================================
6. QUALITY GATE (run it and show me the output)
====================================================================
Automated, with Playwright, at 390x844 and 1440x900, on the production build:
- every route and every ?state= URL loads on hard refresh with zero console errors
- no horizontal overflow
- no text under 12 px; no odds under 15 px
- every interactive element at 390 is at least 44 px in its smaller dimension
- contrast: body text 4.5:1, odds 4.5:1, disabled text 4.5:1
- keyboard: tab order follows the page, focus is always visible, sheet traps focus, Esc closes
- screen reader: an odds cell's name is "Arsenal, Match result, 1.30" and announces selected and suspended; price changes in the slip are announced politely
- the timeline test: load the match page, wait 35 s, assert one flash up, one flash down, a suspension with reason, a reopen with new prices
- the money test: add, stake 10, place, find it in My bets, cash out, see the balance change
- the singles test: grep the build for multi, parlay, accumulator, builder, boost, free bet, bonus, possession, momentum, tracker. Zero hits in shipped UI text.
- placing teardown: start placing, then hide the tab; start placing, then close the sheet; start placing, then navigate. No stuck state, no duplicate bet.
- Lighthouse on all five routes: performance 90+, accessibility 95+
- side-by-side wireframe pairs saved for all 12 frames
Fix everything it finds before telling me you're done. Report failures honestly. Do not weaken a check to make it pass.

====================================================================
7. BUILD ORDER AND SHIPPING
====================================================================
The deadline is 14 Nov 2026, 18:00 UTC. Three submissions are allowed per 24 hours, the best one counts, and a later one never replaces an earlier one. So ship in stages, each to its own public URL that stays up:
Stage 1 (ship first): shell from the starter pack, five pages at wireframe parity, engine with the timeline, slip with stake, return, changed, suspended, placed, one failure, My bets open and settled, basic cash out. Deploy.
Stage 2: all failures, all six cash-out states, state URLs, /states, control panel, tour, sticky scoreboard, search, follows, phone sheet polish, quality gate green. Deploy.
Stage 3: craft pass only. Spacing rhythm, type scale, crest quality, motion timing, copy. No new features. Deploy.
After each stage give me: the URL, the 12 side-by-side pairs, the gate output, and a list of anything that differs from this prompt and why.

README: the five page links, the state links, a 30-second walkthrough, tools used (every library, font, model and tool, by name), and a line that all data is sample data.

Draft "big idea" text for the form (80 to 800 characters, mine to edit):
"It's your wireframes, alive. Same shell, same tokens, same layout, then one match that plays itself: open Arsenal v Brighton and within 40 seconds a price rises, another falls, VAR suspends the goal markets while corners stay open, and it reopens repriced. Your slip pauses with it and never rewrites a price without asking. Cash out falls when Brighton score, because slip, market and My bets share one truth. Every state has its own link (see /states), so you can check suspended, changed and failed in a minute. Singles only, and nothing from the out-of-scope list."

Ask me before you: add any feature not in this prompt, change a brand token, or drop anything in section 0.
````

---

## What changed from v1, and why

| v1 | v2 | Reason |
|---|---|---|
| Place button is `#02f8f8` | Pale cyan fill with dark text; saturated cyan for prices | That's what the wireframes show, and it's the token a competitor captured from the live site. Saturated cyan buttons will look wrong next to the real Register button. |
| Tabs follow the wireframe | Six brief groups plus All; no Specials | The brief bans specials. The wireframe and the written brief disagree, and the written brief is what's scored. |
| "Wire suspended + odds-change demo toggles" | A scripted match timeline that shows every state unprompted, plus toggles | Ten of the strongest entries already have a toggle panel. A judge skimming 130 entries may never open it. |
| States shown via demo toggles | Every state has a URL, plus a `/states` index | Zero of the 37 repos I checked do this. It makes the 10-point line trivially checkable. |
| Green ▲ shortening, red ▼ drifting | Arrow points the way the number moved; green up, red down | "Green up-arrow" on a number that went down reads as a bug. This is the one place I'd overrule the refs doc. |
| Six cash-out states including partial | Six states without partial | The brief says "cash out". Partial is real work and three rivals already have it, so it isn't a differentiator. Add it in stage 3 only if everything else is green. |
| Hubie in empty, receipt, failure | Hubie in empty, receipt, nothing-live; official art only, or not at all | A sloth next to "your bet failed" risks reading as flippant. Eight rivals already use a sloth, several with AI-generated art that doesn't match the real one. |
| Cyan is the only selectable colour | Each colour has one job, including amber for suspended | The wireframe's suspended cell is amber. |
| No pricing rules | One model per match, 104 to 108% overround, markets agree | The best rival ships a Poisson model and says so. Incoherent prices are an easy tell. |
| No scope list beyond the brief | Explicit ban list including hero banners, AI labels, stats, price charts | At least three strong rivals ship banned features on their first screen. |
| Single deploy | Three staged deploys | The rules let your best of many count. A safe build in today removes the deadline risk. |
| No QA | An automated gate with a banned-word grep and teardown tests | "We'd ship tomorrow" is a robustness claim. |

## Things only you can do

- Confirm the starter pack's tokens, fonts and whether it includes crests and Hubie art. The prompt tells the agent to defer to the pack.
- Fill the "tools and templates" field honestly, naming every model and tool. The rules require it.
- Rewrite the big-idea text in your own voice. It should be true of what actually shipped.
- Re-read the live contest page for any News item after 9 Nov.
