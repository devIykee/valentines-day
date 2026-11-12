# Opus / Cursor prompt — Housebets Sportsbook prototype (beat the wireframes + beat world-class refs)

Paste this into Claude Opus (Cursor Agent / Claude.ai). Attach or `@` the local wireframe WEBPs (`packs/desk-*.webp`, `packs/phone-*.webp`) and `SPORTSBOOK-WORLD-CLASS-REFS.md`.

```text
You are a principal product designer + front-end engineer. Build a clickable Housebets sportsbook prototype that we would ship tomorrow — better interaction design than bet365 / FanDuel / DraftKings / Stake in the areas that matter for THIS contest, while looking unmistakably like Housebets.

## Contest hard requirements (do not violate)
- 5 pages, linked, public URL (Vercel/Netlify/GitHub Pages), no login wall.
- Phone 390px + desktop 1440px.
- Pages: (1) Sports home (2) Live (3) Football (4) Match — Arsenal v Brighton LIVE (5) Bet slip + My bets as ONE page with tabs.
- Singles only. Decimal odds. Stakes in USDT. Sample data only — no real money, no real player PII.
- Shell: Housebets top bar + left nav + side panel. Brand: bg #041015, panels #0d2531/#0e202a, cyan #02f8f8, gold #daa520, LIVE #fb2c36, text #f9f9fb/#8f96a8. Logo: "House" #02f8f8 + "bets" white.
- Scorecard states REQUIRED: market suspended; odds changed (user must Accept); bet placed; bet failed; My bets open/settled/cash out.
- Out of scope: multis, accumulators, bet builder, boosts, free bets, outrights, stats widgets, match trackers, AI search.
- Match Housebets official wireframes first (attached desk-*.webp / phone-*.webp), then beat them on every gap below.

## World-class references (study patterns, do NOT clone brand skins)
Read SPORTSBOOK-WORLD-CLASS-REFS.md in full. Reference hierarchy:
(1) bet365 for live match page behaviour: sticky score, delta-only green/red odds flash, instant greyed suspension with a reason, explicit accept-new-odds;
(2) FanDuel for the slip and My Bets: Fast Bet, no surprises on Place, My Bets mirrors slip cards, cash-out with the amount in the button and full state coverage (×6);
(3) Stake for crypto shell density: dark terminal, docked slip, wallet in the top bar — and fix its regressions (add "accept higher odds only", clear the slip after placing).
Secondary: DraftKings event-page carousel + in-match search; Pinnacle for honest odds density; Sky Bet Quick Bet research for singles slip.

## Beat the official wireframes (these gaps score the most points)
Wireframes already get right: shell, breadcrumb, Following chips, in-match search, market tabs, accordion groups, selected-cell tick, Bet slip / My bets / Chat tabs, Singles · 1 selection, Open/Settled filters.
YOU MUST ADD (missing from wireframes today):
1. USDT quick stakes + live return; Place button shows stake ("Place 10 USDT · returns 13.00") — not "$ 0.00" and a dash.
2. Odds-movement: delta flash on cells + slip card old→new with Accept.
3. Suspended market: lock + reason overlay; paused slip card.
4. Placed receipt (bet ID) + failed matrix with next actions.
5. My bets: mirror slip card; live score/minute; Cash out button WITH amount; six cash-out states.
6. Sticky mini scoreboard on Match (doesn't scroll away).
7. Phone: collapsed bottom slip BAR by default (brief requirement); opens on tap — do NOT cover the match with a full sheet by default.
8. Live empty state: "Nothing live" → Starting soon.
9. Slip gear: Accept any / Accept higher only / Reject on change.
10. Phone: 3-letter team codes + crests; desktop: full names.

## Design thesis (your "big idea" for the form, 80–800 chars)
Housebets sportsbook is the same night-house as the casino: cyan live prices, Hubie-calm confidence, singles-honest slip. Live match page and slip states are first-class — odds never silently rewrite, suspended markets die cleanly, USDT return calc is always visible — so it feels sharper than Stake and clearer than DraftKings while staying on-brand.

## Brand rules (Feels like Housebets — 15 pts)
- Cyan #02f8f8 is the ONLY "live and selectable" colour (odds, selected cell, Place).
- Red #fb2c36 only for LIVE and odds drifting longer; green for shortening; gold #daa520 only for win / cash-out success.
- Logo wave motif: suspension "tide" washes over market, recedes on reopen; short wave on cash-out success.
- Hubie ONLY on empty / receipt / failure — never over odds, never tips or win promises.
- USDT ₮ chip everywhere; balance in top bar; "Deposit and return to slip" on low balance.
- Keep Chat as third slip-panel tab; add no social betting.

## Build order
1. Shell + tokens + responsive breakpoints.
2. Sports home with Live now / Starting soon / Featured / Favourites / Search.
3. Live list + Football league rows (+ empty Live state).
4. Match page ARS–BHA 52' 1-0 odds 1.30 / 4.60 / 11.00 + market tabs; sticky score; wire suspended + odds-change demo toggles.
5. Slip + My bets: USDT quick stakes, Accept changed odds, failed bet, cash out ×6; phone collapsed bottom bar.
6. Polish motion: 150ms snappy presses, odds flash 200ms delta-only, no bounce on numbers, no excitement pulsing.
7. Deploy public link + README of states demo how-to (<30s walkthrough).

## Acceptance checklist
- [ ] All 5 pages linked both viewports
- [ ] Singles only (no combo UI)
- [ ] Suspended / changed / failed / placed / cash-out ×6 demonstrable in <30s
- [ ] Phone slip is a collapsed bar first, not a covering sheet
- [ ] Sticky match scoreboard
- [ ] Place button shows stake + return in USDT
- [ ] Feels like Housebets (cyan night shell, not bet365 green or DK green)
- [ ] No illegible dense text on mobile
- [ ] Potential return updates as stake changes
- [ ] No out-of-scope features (multis, boosts, trackers, AI)
```
