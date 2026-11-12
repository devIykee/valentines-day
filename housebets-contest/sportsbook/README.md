# Housebets Sportsbook: clickable prototype

Entry for the Housebets Contest Labs "Sportsbook is coming" design contest. Five pages, phone (390 px) and desktop (1440 px), singles only, inside the Housebets shell.

Front end only. No build step, no backend, no network calls at runtime, no login. **Sample fixtures, sample prices and demo USDT. No real players and no real money.**

## The five pages

| Page | Route |
|---|---|
| 1. Sports home | `#/` |
| 2. Live | `#/live` |
| 3. Football | `#/football` |
| 4. Match page: Arsenal v Brighton, live | `#/match/ars-bha` |
| 5. Bet slip + My bets (one page) | `#/slip` |

## 30-second walkthrough

1. Open `#/match/ars-bha?t=0`. It starts at 52:00, 1–0, 1.30 / 4.60 / 11.00, as in the wireframe.
2. Tap **Arsenal 1.30**. Set a stake. The button reads "Place 10.00 USDT · Returns 13.00 USDT".
3. Wait. At 8 s the price falls, at 14 s two prices rise. At 22 s a VAR check suspends every goal market while Corners & cards stay open, and the slip pauses. At 30 s the markets reopen repriced and the slip asks you to accept the new price.
4. Accept, place, get a receipt with a bet ID. The bet is already in My bets with a cash-out amount on the button.
5. At 75 s Brighton equalise. Cash out on the open Arsenal bet falls.

The flask icon at the foot of the left rail (phone: Menu, then Demo controls) restarts the match, plays this as a captioned tour, or forces the next bet to fail.

## Every state has its own link

`#/states` lists them all. Each opens the real page in that state.

| Scorecard item | Links |
|---|---|
| Odds moving | `#/match/ars-bha?state=odds-up` · `odds-down` |
| Market suspended | `#/match/ars-bha?state=suspended` · `reopened` · `goal` |
| Slip | `#/slip?state=empty` · `ready` · `changed` · `suspended` · `closed` · `placing` · `placed` |
| Bet failed | `#/slip?state=failed-balance` · `failed-limit` · `failed-min` · `failed-connection` · `failed-changed` · `failed-suspended` · `signed-out` |
| My bets | `#/slip?tab=mybets&state=open` · `settled` |
| Cash out | `…&state=cashout-available` · `cashout-confirm` · `cashout-changed` · `cashout-suspended` · `cashout-unavailable` · `cashout-done` |
| Nothing live | `#/live?state=nothing-live` |
| Signed out | `#/?state=signed-out` |

## How it works

- **One engine.** Every score, clock, price and suspension is a function of one match clock (`js/model.js`). Prices come from a Poisson goal model fitted to each fixture's opening price, so Match result, Double chance, Draw no bet, totals and handicaps agree with each other. Margins on the main markets sit between 104% and 108%.
- **Prices never change behind your back.** A slip price that moves must be accepted before anything is placed. The gear icon in the slip offers "Always ask", "Accept higher prices" and "Accept any price".
- **Suspension is selective.** A goal check locks goal-dependent markets only. A suspended price cannot be tapped.
- **Placing resolves once.** Leaving the page, hiding the tab or closing the sheet mid-confirmation cannot produce a stuck slip or a duplicate bet.

## Out of scope, and not built

Multis, accumulators, bet builder, boosts, free bets, promos, outrights, specials, stats widgets, match trackers and AI search.

## Run it

```
npx serve .        # or: python3 -m http.server
```

Any static host works (Vercel, Netlify, GitHub Pages). Routes are hash-based, so deep links survive a hard refresh.

## Tools and credits

- Built with Claude Code (Anthropic). Vanilla JavaScript, HTML and CSS. No framework, UI kit or template.
- Fonts: Figtree, Oxanium and Red Hat Display (SIL Open Font License), self-hosted from Fontsource.
- Checked with Playwright (headless Chromium) at 390×844 and 1440×900.
- The "Housebets" wordmark is Housebets' own logo file. The layout follows the contest wireframes. The wave mark, icons and club shields are original SVG drawn for this prototype. No club or league logos are used. Player names are invented.
