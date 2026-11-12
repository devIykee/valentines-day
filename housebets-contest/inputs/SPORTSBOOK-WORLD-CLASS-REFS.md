# World-Class Sportsbook References: Housebets Sportsbook Design Contest

*Researched 12 Nov 2026 (WAT). For: Housebets Contest Labs, "Housebets Sportsbook is coming", $15k, ends 14 Nov 2026 18:00 UTC.*
*Scorecard: Sports home 15 · Live 10 · Football 10 · **Match page 20** · **Bet slip + My bets 20** · Feels like Housebets 15 · **Every state (suspended / changed / failed) 10**. Ties go to Match page, then Feels like Housebets.*

> Note on sources: the review sites cited here are affiliate or agency sites, so read them as industry consensus, not lab data. The strongest independent signal is Eilers & Krejcik Gaming (EKG) app testing. I didn't use logins. The screenshot links point to public App Store pages and official sites.

---

## 0. TL;DR: the real best, not a brand dump

| Rank for this brief | Reference | Lane | Why it's on the list |
|---|---|---|---|
| 1 | **bet365** | Regulated, global | The benchmark for live/in-play. It topped EKG UK ("gold standard") and Degree 53's in-play UX review. Its mobile build is decoupled from desktop (key info first, layers underneath). It asks you to accept or reject a changed price. Markets update without visible flicker. [S1][S2][S3][S4] |
| 2 | **FanDuel** | Regulated, US | The most polished slip and cash-out. Fast Bet lets you place a bet from anywhere. My Bets mirrors the slip. Its design system draws "live, losing, loading, empty" states first. Motion, sound and haptics scale with what's at stake. [S5][S6][S7][S8] |
| 3 | **DraftKings** | Regulated, US | Rated #1 US app by EKG in 2H25 and 1H26. Its event page has a swipeable carousel to related matches, a scores/tracker segment, market-category tabs, and search inside the match. [S9][S10][S11] |
| 4 | **Stake** | Crypto | The closest shell analogue to Housebets: dark, trading-terminal look, collapsible left rail, wallet in the top bar, slip docked on the right (desktop) or bottom (mobile), crypto stakes. Users complained about its 2025 slip regression (lost "accept only higher odds"), which is a free lesson. [S12][S13][S14] |
| 5 | **Pinnacle** | Sharp / low-margin | The reference for odds truth and density. A sparse layout lets you place a bet in very few clicks. It also has an odds tracker. Use it to calibrate an honest, data-first market grid, not for visuals. [S15][S16][S17] |
| 6 *(supporting)* | **Polymarket / Kalshi (sports)** | Prediction markets | Only relevant for live-card patterns: score plus outcomes on the card, a moneyline ratio bar in place of charts, websocket-live cards. Kalshi has 685k App Store ratings at 4.8, so this is mainstream now. [S18][S19][S20] |

Honourable mentions: **Fanatics** is EKG #3 for four straight reports, praised for speed and personalised shortcuts [S9][S21]. **Sky Bet** published its Quick Bet slip research, including a singles-only experiment and price-change settings [S22]. **Sporttrade** was EKG's top betting exchange for load times and transitions [S23].

**Left off on purpose:** SoftSwiss, BetConstruct and Betradar widget skins. They are white-label platforms, not best-in-class UX, and the brief also bans stats widgets and match trackers. Use them only as an anti-reference for "generic B2B sportsbook look". Kalshi-style order books are also out, because they're wrong for a singles sportsbook.

---

## 1. Why each one is elite

### bet365: the live-betting benchmark
- EKG UK report: #1 overall, top in UX, betting interface and features, called the "gold standard". Weaknesses: "functional rather than fun", and 4th on aesthetics. [S3]
- Its US look and feel slipped to 6th in EKG 1H26 ("concerns around the product's overall look and feel") [S11]. **This is the opening for Housebets: bet365's interaction model with a premium brand skin.**
- In-play is the default landing. The stream or match simulator stays docked while you browse. A bet takes two taps from the market list. A moved price gives an explicit accept or reject choice. Suspension is fast and correct. [S2][S4]
- Mobile is uncoupled from desktop. Mobile shows key information first with layers of detail below. Desktop shows as much relevant information as fits. [S1]
- Reviewers rank it #1 for live: steadier live odds than DK/FD, a "Live In Game" toggle, and Favourites. [S24][S25][S26]

### FanDuel: the slip, cash-out and states system
- NxtGen rebuild: React Native, in-house, the Formation design system. It went from 4 to 20+ states and holds about 41–43% US share. App Store rating rose from 4.6 to 4.9. [S6]
- Fast Bet appears on your first selection, so you can place a bet without leaving the page. The Place Bet button must never hold "surprises". My Bets reuses the slip's presentation. [S5]
- Humbleteam's UI direction: "a sportsbook's depth carried with a consumer app's calm". State, feedback and reversibility come before decoration. Live, losing, loading and empty states are drawn into the language. Motion, sound and haptics are scaled to stakes. [S7]
- Live game page: scoreboard, then Track Live and Stats toggles, then market tabs, with a persistent slip. A "My Action" rail lists live games where you already have money. [S8]
- Reviews say it's the most intuitive for quick in-play placement and has reliable cash-out. [S24][S25]

### DraftKings: navigation and the event page
- EKG #1 in 2H25 and 1H26. [S9][S11]
- Event page redesign: a swipeable carousel of related events at the top showing other games' live progress, a Scores/Tracker segmented control, category tabs (Game Lines, Props…), in-event search, highlighted featured bets, and a drawer that opens and closes the event. [S10]
- A scrolling sport bar plus a live-markets tab. Reviewers call it the most intuitive overall [S25]. Its weakness is that markets lock too often [S26], so lock states have to be designed, not ignored.

### Stake: the crypto reference (same shell DNA as Housebets)
- Minimal, dark, trading-screen feel. Top bar: wallet, search, profile, notifications. Left: sports categories and live. Right: slip that can hide. Centre: markets plus tracker. [S12][S13]
- Mobile: slip docked at the bottom, so an in-play bet is a tap on the price and a tap to confirm. Sports, live, open bets and cashier are within two taps. [S13]
- The 2025 slip redesign drew forum complaints: slower to place, no "accept only higher odds" option, slip not clearing after a placed bet. [S14] **Housebets should ship every one of those fixes.**

### Pinnacle: odds truth and density
- About 2% margin on majors, a "winners welcome" reputation, and fast in-play acceptance. The UI puts function over decoration, and you "can find every bet type and match… in a moment". [S15][S16][S17]
- Lessons: show the number big and clean, have no promo clutter, and keep in-play acceptance fast and visible. What not to copy: the visuals, which reviews call "dated" or "basic".

### Polymarket / Kalshi: live-card language (supporting only)
- Polymarket Sports Live has dark, dense match cards with live score, league icon and outcomes on the card. The shipped integration used a moneyline odds ratio bar instead of charts. [S18][S19]
- Kalshi is brokerage-like (order books, depth). That's useful only as an anti-pattern for a singles sportsbook. [S19]

---

## 2. Page by page: what the best do better than average

### Sports Home
| Ref | Better than average |
|---|---|
| bet365 | The live count and in-play entry are always visible. Favourites keep your teams one tap away [S24][S26]. Every row carries the main odds, so the first pick doesn't need the match page. |
| DraftKings | A horizontal sport bar plus search at the top. A Live tab sorts in-play [S25]. |
| Fanatics | Personalised shortcuts based on habits [S21]. |
| Stake | No hero banners. The centre column is markets [S12]. |
| **Do:** search with typed results grouped by Teams / Players / Competitions / Markets. A "Live now" rail with score, clock and 1X2. "Starting soon" with a countdown. Top competitions as tiles. Favourite chips (the Housebets wireframe already has these, so keep them). |

### Live
| Ref | Better than average |
|---|---|
| bet365 | In-play is the default. Each live row repeats score and minute. The suspension is visible on the row itself [S2][S4]. |
| FanDuel | "My Action": live games you have bets on, with markets right under the score for re-betting or hedging [S8]. |
| DraftKings | Related-game progress is visible from inside the event [S10]. |
| **Do:** sport filter chips with live counts, then competition grouping (collapsible), then rows with score, minute and a pulsing LIVE pill, plus 1X2 that flashes on change. **Empty state:** "Nothing live right now", then the Starting soon list (the brief requires this) [S27]. |

### Football / league list
| Ref | Better than average |
|---|---|
| bet365 / Pinnacle | Dense league tables, one row per match, 1X2 columns aligned in a fixed grid so your eye scans one column [S15][S16]. |
| Vertbet-style (agency) | Leagues fold. Each match row carries main odds, so a pick is one tap from the list [S27]. |
| **Do:** sticky column headers (1 / X / 2). A follow star on both competition and team. League order: PL, UCL, LaLiga, Serie A, Bundesliga. A "+N markets" chevron on each row (already in the wireframe). |

### Match page (20 pts, the tie-breaker)
| Ref | Better than average |
|---|---|
| bet365 | Score, clock and match state sit first and pin as you scroll. A changed price flashes without page flicker. Suspension is instant and greyed [S2][S4][S28]. |
| DraftKings | A swipe carousel to other live matches at the top. Category tabs plus **search inside the match**. Featured bets are highlighted [S10]. |
| FanDuel | One game page, overlays that don't leave the markets, and a persistent slip [S8]. |
| Agency best practice | Score, period and time stay visible while scrolling. Most-used group open by default. Groups fold. Locked markets show a reason and an expected resume time [S27][S29]. |
| **Do:** the scoreboard collapses into a slim sticky bar (ARS 1–0 BHA · 52' · LIVE) on scroll. Market tabs Popular / Goals / Halves / Handicaps / Goalscorers / Corners & cards with counts. Accordion groups. A per-cell flash (green ▲ shortening / red ▼ drifting, about 600 ms, then rest). Market-level suspended overlay: lock icon plus reason ("Goal check", "VAR", "Penalty"). Selected-state tick on the cell (already in the wireframe). |

### Bet slip + My bets (20 pts)
| Ref | Better than average |
|---|---|
| FanDuel | Fast Bet from anywhere, no surprises on Place, and My Bets mirrors the slip [S5]. |
| bet365 | Odds change shows old to new with explicit Accept. Two taps to place. Cash out on more bet types than rivals [S4]. |
| Sky Bet | Quick Bet slip, price-change settings, Place Bet always in view, simpler errors [S22]. |
| Agency playbooks | Quick stakes plus a custom keypad. Return shown before the button. A dedicated message and next step for each rejection reason. Slip kept through login and deposit. A short receipt, then "Keep selections" or "View my bets". In-play acceptance delay shown as visible progress, not a frozen button [S27][S30]. |
| Cash out | Six states: available (amount on the ticket), partial, value changed (old amount struck through, re-confirm), suspended (greyed plus reason), not available, done. The button repeats the amount: "Cash out 18.40 USDT" [S29]. |

---

## 3. Pattern library: 20 patterns to steal

| # | Pattern | Source | Why |
|---|---|---|---|
| 1 | **Collapsed slip bar at the bottom on phones** (picks count, stake, return), which expands to one sheet | Stake, Spinlab, iDesy [S13][S27][S30] | The brief requires it, and it never covers the markets you're comparing. |
| 2 | **Fixed right column slip on desktop** (Bet slip / My bets tabs) | Stake, wireframe [S12] | Never covers markets. It's already in the Housebets shell. |
| 3 | **Instant add feedback**: cell tick, counter bump, micro-toast | Spinlab [S30] | Stops double taps and accidental removals. |
| 4 | **Delta-only odds flash**: green ▲ shortening, red ▼ drifting, about 600 ms, then rest | bet365, VP0 [S28] | Honest motion. It never fires on re-renders. |
| 5 | **Odds changed on the slip card**: old price struck through, then new price with an arrow, plus an "Accept new odds" CTA that replaces Place bet | bet365, iDesy [S4][S27] | The brief says the player must accept. Never update silently. |
| 6 | **Price-change preference**: Always ask / Accept higher only / Accept any | Sky Bet, Stake forum [S14][S22][S30] | Stake lost this and users revolted. It's a cheap win. |
| 7 | **Suspended market overlay**: cells greyed, lock icon, reason chip ("Goal check"), not tappable in the same frame | bet365, VP0, tilldawn [S4][S28][S29] | The integrity moment, and part of the 10-point "every state" score. |
| 8 | **Suspended selection in the slip**: card dimmed with "Paused, waiting for market", Place disabled, auto-recovers | iDesy, Spinlab [S27][S30] | Keeps the slip intact instead of failing it. |
| 9 | **Rejection matrix**: one message and next step per reason (changed, suspended, over max with "Set max", low balance with "Deposit", then back to the same slip) | Spinlab [S30] | Covers "bet failed" with specifics, not "Error". |
| 10 | **In-play acceptance progress**: a 2–3 s ring on the Place button with "Confirming…" | Spinlab [S30] | Prevents double taps and duplicate bets. |
| 11 | **Quick stakes in USDT** (5 / 10 / 25 / 50 / Max) plus a custom numeric keypad | iDesy, Sky Bet [S22][S27] | The keyboard is the slowest part of the slip. |
| 12 | **Return shown before the button**, updated live as you type (stake × odds) | iDesy, Spinlab [S27][S30] | The brief needs stake, odds and potential return visible together. |
| 13 | **Receipt then two actions**: "Keep selection" or "View in My bets", plus a bet ID | Spinlab, FanDuel [S5][S30] | Quick re-bet without a full-screen dismiss. |
| 14 | **My bets mirrors the slip card** (same layout, now with live score and cash out) | FanDuel [S5] | You recognise your bet instantly. |
| 15 | **Cash out amount on the ticket** plus all six states; the button carries the number | iDesy [S29] | The brief requires cash out, and states earn points. |
| 16 | **Sticky mini scoreboard** that collapses on scroll | bet365, iDesy [S2][S29] | Match state stays first while you browse 85 markets. |
| 17 | **Market tabs with counts plus accordions**, Popular open by default | tilldawn, DraftKings [S10][S31] | 85% of bets fall in fewer than 10 markets, so design for those. |
| 18 | **Search inside the match** ("Saka", "corners") | DraftKings [S10] | Already in the wireframe. Make results jump to the market and highlight it. |
| 19 | **Swipe or chips to other live matches** from the match page | DraftKings [S10] | No back-and-forth to the lobby. |
| 20 | **"My action" filter on Live**: games you have open bets on | FanDuel [S8] | Natural link between Live and My bets with cash out. |

---

## 4. Anti-patterns to avoid
1. **Dark-on-dark odds.** Odds below 4.5:1 contrast on the `#041015` / `#0d2531` panels. Keep `#02f8f8` odds on `#0e202a` cells and check contrast.
2. **Tiny text.** Odds under 14 px on mobile, or team names truncated without a tooltip (the wireframe shows "Brighton & Hove…", so use short codes like BHA on phones).
3. **Silent odds acceptance** or auto-accept by default [S27][S28].
4. **One generic "Error"** for every failure [S30].
5. **Clearing the slip** on login or deposit, or not clearing after a placed bet (Stake's complaint) [S14][S30].
6. **Flashing for excitement** (pulsing every odds cell, countdown pressure on cash out) [S28][S29].
7. **Stale prices that stay tappable** during suspension [S28].
8. **Suspension with no reason or resume hint** [S31].
9. **Market overload**: 85 markets open at once with no hierarchy [S31].
10. **Responsive, not native**: a hamburger instead of a bottom nav, CTAs out of thumb reach [S31].
11. **Fake or real-player data**: the brief demands sample data only. Use real club names as in the wireframes (Arsenal, Brighton) but invented stakes, no real users, no "Sevilp FC" nonsense teams.
12. **Out-of-scope creep**: multis, bet builder, boosts, stats widgets, trackers, AI search. They score zero and signal that you didn't read the brief.
13. **Bland utility** ("functional rather than fun", bet365's own weakness [S3][S11]). Housebets has to feel like Housebets (15 pts).
14. **Modal walls** that cover the markets or the Place button [S27][S30].

---

## 5. Gap vs the Housebets official wireframes
*Wireframes reviewed: desk/phone home, live, football, match (ARS–BHA 1–0, 52'), slip, slip-open, my-bets (`/workspace/housebets-contest/packs/`).*

**What the wireframe already gets right (keep it):** the site shell, breadcrumb (Soccer › England › Premier League › ARS-BHA), Following/Follow chips, in-match search, market tabs with counts, accordion groups, a selected-cell tick, a slip with Bet slip / My bets / Chat tabs, "Singles · 1 selection", USDT totals, Open/Settled with date filters, and a bottom sheet slip on phone.

| Gap in the wireframe | World-class fix | Brief item it scores |
|---|---|---|
| Slip stake field shows "$ 0.00" and Returns shows a dash | USDT quick stakes, keypad, live return, Place bet showing the stake ("Place 10 USDT · returns 13.00") | Bet slip 20 |
| No odds-movement state drawn | Delta flash on cells, plus slip card old→new with Accept | Match 20, States 10 |
| No suspended state | Market overlay (lock + reason) and a paused slip card | States 10 |
| No placed or failed states | Receipt sheet with bet ID; failure matrix with next actions | States 10 |
| My bets row: no cash out, no live progress | Mirror the slip card; live score/minute; cash out button with the amount; six cash out states | My bets 20 |
| Scoreboard scrolls away | Sticky mini scoreboard | Match 20 |
| Phone slip: the full sheet covers the match | A collapsed bar by default (brief requirement); opens on tap | Bet slip 20 |
| Live: no empty state shown | "Nothing live" then Starting soon | Live 10 |
| No "Accept higher odds" preference | Gear icon in slip with 3 options | States / Slip |
| Long team names truncate on phone | 3-letter codes plus crests on phone, full names on desktop | Polish |

### Where Housebets wins on brand (15 pts) without breaking world-class interaction
- **Cyan `#02f8f8` as the single "live and selectable" signal.** Odds, the selected cell and the Place button are cyan. Everything else is quiet navy (`#041015` / `#0d2531` / `#0e202a`). Keep red `#fb2c36` for LIVE and drifting odds only, green for shortening, and gold `#daa520` only for a win or cash-out success. That's bet365 clarity with a premium skin, which is exactly the gap EKG flagged [S11].
- **The night-house wave.** Use the logo's wave as the motion motif: the suspension overlay "tide" washes over the market group, then recedes when it reopens. The cash out success shows a short wave sweep across the ticket.
- **Hubie, used with restraint.** Put Hubie only in empty states ("Nothing live. Hubie's napping. Here's what kicks off soon"), the receipt ("Bet placed. Slow moves, smart plays."), and the failure states with a calm tone. Never on top of odds, and never giving tips or guarantees.
- **Crypto-native trust.** USDT everywhere with the ₮ chip, balance in the top bar, and a "Deposit and return to slip" flow on low balance. That's Stake's speed without Stake's slip regressions [S14].
- **Chat tab in the slip panel** is already unique to the Housebets shell. Keep it as the third tab and don't add social betting features (out of scope).

---

## 6. Opus reference pack

### Ranked: study these 3 first
1. **bet365**, for live and match-page behaviour (flash, suspend, accept-change, sticky score, two-tap placement). It decides Match page (20) and States (10).
   - App Store screenshots: https://apps.apple.com/us/app/bet365-sportsbook-casino/id1465717844
   - Behaviour writeups: https://bet.report/en/betting-apps/bet365-app/ · https://next.io/news/betting/bet365-best-uk-sports-betting-app/ · https://vp0.com/blogs/bet365-odds-display-ui-react-native
2. **FanDuel**, for the slip, My Bets mirroring, cash-out energy and the states-first design system. It decides Bet slip + My bets (20).
   - App Store: https://apps.apple.com/us/app/fanduel-sportsbook-casino/id1413721906
   - Design writeups (real product): https://humbleteam.com/work/fanduel · https://stewartbradford.com/fanduel-sportsbook-version-2 · https://loveland.design/case-study/fanduel · https://alextle.com/work/fanduel
3. **Stake**, for the crypto shell analogue: dark trading-screen density, docked slip, wallet in the top bar. It decides "Feels like a crypto house" while you beat its slip regressions.
   - Live site: https://stake.com/sports/home (blocks bots with a 403 from the box and is geo-restricted in some regions; open it in a real browser)
   - Reviews: https://deadspin.com/stake/sports-betting/ · https://betzoid.com/nz/stake/ · forum regressions: https://stakecommunity.com/topic/150061-sportsbook-ui-new-updated/

### Secondary
- **DraftKings** event page and navigation: https://apps.apple.com/us/app/draftkings-sports-casino/id1375031369 · https://ethancohen.me/event-page
- **Pinnacle** density and odds grid: https://www.pinnacle.com (the soccer matchups page returned a 500 to curl; browse it manually) · review: https://betmetricslab.com/betting-sites/pinnacle-sports/
- **Sky Bet** Quick Bet slip research: https://www.thomastordoff.com/work/skybet-betslip · https://apps.apple.com/gb/app/sky-bet-sports-betting/id428237841
- **Fanatics**: https://apps.apple.com/us/app/fanatics-sports-casino/id1616738407
- **Polymarket Sports Live** (live-card language only): https://polymarket.com/sports/live · https://apps.apple.com/us/app/polymarket-trade-live-sports/id6648798962
- **Kalshi** (anti-reference for singles): https://apps.apple.com/us/app/kalshi-trade-sports-events/id1632713844

### Pattern playbooks (states, slip, cash out)
- https://idesy.agency/blog/sportsbook-bet-slip-ux/
- https://idesy.agency/blog/live-betting-cash-out-ux/
- https://spinlab.studio/bet-slip-ux/
- https://tilldawn.co/insights/sportsbook-ux-what-operators-get-wrong

### Paste-in line for Opus
```text
Reference hierarchy: (1) bet365 for live match page behaviour: sticky score, delta-only green/red odds flash, instant greyed suspension with a reason, explicit accept-new-odds; (2) FanDuel for the slip and My Bets: Fast Bet, no surprises on Place, My Bets mirrors slip cards, cash-out with the amount in the button and full state coverage; (3) Stake for crypto shell density: dark terminal, docked slip, wallet in the top bar, and fix its regressions (add "accept higher odds only", clear the slip after placing). Then skin it all in Housebets: #041015/#0d2531 panels, #02f8f8 as the only "selectable" colour, red only for LIVE and drift, gold only for win and cash-out, wave motif for suspend and reopen, Hubie only in empty, receipt and failure states. Singles only, decimal odds, USDT stakes, 390 px and 1440 px, bottom slip bar on phone. Draw every state: selected, odds up, odds down, suspended (market + slip), changed (accept), placing (progress), placed (receipt), failed (per reason), cash out ×6, nothing live.
```

---

## Sources
- [S1] SBC News, bet365 interview: https://sbcnews.co.uk/events/sbcevents/2018/08/01/sbc-awards-the-secret-of-success-stoke-style/
- [S2] UX Connections, mobile betting: https://www.uxconnections.com/ahead-mobile-betting-market/
- [S3] NEXT.io, EKG UK: bet365 best app: https://next.io/news/betting/bet365-best-uk-sports-betting-app/
- [S4] Bet Report, bet365 app review: https://bet.report/en/betting-apps/bet365-app/
- [S5] Stewart Bradford, FanDuel v2: https://stewartbradford.com/fanduel-sportsbook-version-2
- [S6] Will Loveland, FanDuel NxtGen: https://loveland.design/case-study/fanduel
- [S7] Humbleteam, FanDuel UI direction: https://humbleteam.com/work/fanduel
- [S8] Alex Le, FanDuel live game page: https://alextle.com/work/fanduel
- [S9] EKG reports and 2H25 rankings: https://ekgamingllc.com/downloads/u-s-sports-betting-apps-tested-scored-and-ranked-2h25
- [S10] Ethan Cohen, DraftKings event page: https://ethancohen.me/event-page
- [S11] Legal Sports Report, EKG 1H26 (4 Jun 2026): https://www.legalsportsreport.com/265470/report-draftkings-fanduel-remain-top-us-sports-betting-products/
- [S12] Deadspin, Stake review: https://deadspin.com/stake/sports-betting/
- [S13] Betzoid, Stake review 2026: https://betzoid.com/nz/stake/
- [S14] Stake Community forum, new sportsbook UI: https://stakecommunity.com/topic/150061-sportsbook-ui-new-updated/
- [S15] Bet Metrics Lab, Pinnacle: https://betmetricslab.com/betting-sites/pinnacle-sports/
- [S16] The Betting Judge, Pinnacle: https://www.thebettingjudge.com/pinnacle-review
- [S17] SportsWagerBlog, Pinnacle 2026: https://www.sportswagerblog.com/reviews/pinnacle/
- [S18] Polymarket Sports Live: https://polymarket.com/sports/live
- [S19] Rainbow PR (Polymarket integration) and Avark guide: https://github.com/rainbow-me/rainbow/pull/6969 · https://avark.agency/learn/prediction-market-design-patterns
- [S20] Kalshi App Store (4.8★, ~686k ratings as of 12 Nov 2026): https://apps.apple.com/us/app/kalshi-trade-sports-events/id1632713844
- [S21] Goal.com, best betting apps Nov 2026: https://www.goal.com/en-us/betting/sports-betting-apps/blt3635ce8f27e17d2d
- [S22] Thomas Tordoff, Sky Bet slip: https://www.thomastordoff.com/work/skybet-betslip
- [S23] NEXT.io, EKG / Sporttrade mention: https://next.io/news/premium/fanduel-best-sports-betting-app/
- [S24] SportsLine, best apps: https://www.sportsline.com/sportsbooks/
- [S25] CBS Sports, best betting apps: https://www.cbssports.com/betting/news/best-betting-apps/
- [S26] BettingApps.com, live comparison: https://bettingapps.com/articles/live-betting-app-comparison
- [S27] iDesy, bet slip UX: https://idesy.agency/blog/sportsbook-bet-slip-ux/
- [S28] VP0, bet365-style odds display: https://vp0.com/blogs/bet365-odds-display-ui-react-native
- [S29] iDesy, live and cash-out UX: https://idesy.agency/blog/live-betting-cash-out-ux/
- [S30] Spinlab, bet slip UX patterns: https://spinlab.studio/bet-slip-ux/
- [S31] tilldawn, sportsbook UX mistakes: https://tilldawn.co/insights/sportsbook-ux-what-operators-get-wrong
