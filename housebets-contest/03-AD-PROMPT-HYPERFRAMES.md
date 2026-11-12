# 30-second Housebets ad: recut prompt (v2)

*Rewritten 12 Nov 2026 after the first cut was withdrawn. Supersedes v1.*

## What this is based on

The full Task and Rules file did not reach the build session, so this is written from the requirements relayed on 12 Nov. Anything marked **[check brief]** is a place where I'm working from a summary and the full text may add detail. Paste the full Task and Rules into `ad/BRIEF.md` before running the prompt; the prompt tells the agent to read it and to let it win over this document.

**Known requirements**

- 30 s, 16:9, 1080p is allowed. A vertical cut is optional.
- **Real housebets.com screens only**: from the starter pack or your own recording. No illustrative or rebuilt UI.
- **Music, voice, or both.** AI music tools are allowed if you hold the rights.
- "Looks like Housebets" is worth **35 points**. **[check brief]** for the rest of the scorecard.
- **Must show, in any order:**
  1. Wallet paste → scan → bonus
  2. House originals (Dice, Blackjack, Mines) with a big win
  3. Hubie as rewards host, a tip, then rewards / level-ups
  4. Crypto deposit and withdraw with a real balance update
- No made-up bonus amounts, payout times, unpublished odds or win promises.
- The X post must say **#ad**, **18+** and **"Gamble responsibly."**
- Rights confirmation: everything in it is yours or licensed. Copying another entry is not allowed.

**Changes from v1, and why**

| v1 | v2 |
|---|---|
| "Nobody wins anything on screen" | The brief asks for a big win in a House original. It is shown exactly as recorded. What stays banned is *promising* one. |
| Screens rebuilt in HTML with invented teams | Every product frame is a real recording. HTML is used only for type, framing and the end card. |
| Hubie image from a public repo | Official starter-pack art only. If the pack has none, Hubie appears only as he appears in the recordings. |
| Silent | Music, voice, or both, with a licence on file. |
| "Slow it down." / "haha, nice." | Removed. No Hubie line is used unless it is visible in a recording of the live site. |
| One gag carrying 30 s | Four product beats. The near-silent press at 17–21 s is kept, now on the real Withdraw button. |

---

## What you record first

Nothing can be built without these. Record on desktop Chrome at **1920×1080, 100% zoom, 60 fps**, bookmarks bar hidden, no other tabs, notifications off, cursor visible. Record each as one continuous take with two seconds of stillness at each end. Save into `ad/recordings/` with these names.

| File | What happens in it | Notes |
|---|---|---|
| `01-wallet-scan.mp4` | Paste a wallet address, start the scan, the scan runs, the bonus result appears. | Use a wallet you own. Record it once, for real. The number that appears is the number that goes in the ad. |
| `02-dice.mp4` | A few rounds of Dice ending on a win. | Demo or real play, whichever the brief allows **[check brief]**. Keep the take that ends on the largest win. |
| `03-blackjack.mp4` | A hand of Blackjack through to its result. | A natural blackjack is ideal. |
| `04-mines.mp4` | A Mines round: several safe reveals, then cash out. | The cash-out moment is the "big win" candidate. |
| `05-hubie-rewards.mp4` | Hubie in chat or the rewards surface: a tip arriving, then the rewards panel and a level-up. | Whatever Hubie says on screen here is the only Hubie copy the ad may use. |
| `06-deposit.mp4` | A crypto deposit arriving and the balance changing. | Small amount. The balance must visibly change in the take. |
| `07-withdraw.mp4` | Open withdraw, hover the confirm button for three seconds without moving, click, the balance changes. | The three-second hover is the near-silent beat. Don't rush it. |

Before recording, look at what will be visible: your username, wallet address, balance and transaction IDs will be in a public ad. Use an account and wallet you're comfortable showing, or tell me which regions to cover and I'll mask them with a plain blur block (masking is allowed; replacing content is not).

If any of these screens can't be captured, say which. The agent will then use the starter pack's own screens for that beat, or leave a labelled gap. It will not draw a substitute.

## Audio: what's possible

I don't have a licensed track to give you, and the music model HyperFrames can run locally is released under a non-commercial licence, so it isn't safe for an ad. Three clean routes:

1. **You generate a track** with an AI music tool on a plan that grants commercial use, on your own account, so the rights are yours to confirm. Ask for: *"120 BPM, tight minimal electronic pulse, confident and a little playful, no vocals, clean hard stop at 17 seconds, relaxed half-time feel from 21 seconds, 30 seconds long."* Put it in `ad/assets/audio/` with a screenshot of the plan's licence terms.
2. **Voice only.** The brief accepts voice without music. The agent can generate a voiceover locally with HyperFrames' built-in open-licence voice, plus a few sound effects from HyperFrames' catalog. No third-party music rights involved.
3. **Both.** Route 1 for the bed, route 2 on top.

Route 2 needs nothing from you and satisfies the rule. Route 3 will sound best.

---

## The prompt

Paste into a coding agent with the HyperFrames skills installed, from inside `housebets-contest/ad/`.

````text
Recut the 30-second Housebets ad in this HyperFrames project. Read the /hyperframes skill and follow its contract and work loop. Then read BRIEF.md in this folder: it is the contest's own Task and Rules, and wherever it disagrees with this prompt, BRIEF.md wins. Tell me each place it does.

The storyline below is chosen. Write SPEC.md from it, build, check, review, show me the preview, and render only when I approve.

====================================================================
HARD RULES
====================================================================
1. Every frame that shows the product is real footage from recordings/ or from the official starter pack in assets/brand/. Do not rebuild, redraw, retype or "clean up" product UI in HTML. Do not composite invented values into real screens. Allowed treatments: crop, scale, reframe, speed change, and a plain rectangular blur over private data I name.
2. Do not use any asset from another contest entry or from any source I haven't put in this project. If something is missing, stop and tell me.
3. No made-up bonus amounts, payout times, odds or return figures. Any number on screen is a number that appears in the footage. Overlay text never states a number.
4. No win promises and no urgency: no "win", "guaranteed", "easy", "risk-free", "bet now", "don't miss", no countdown aimed at the viewer. A win that happened in the footage is shown as it happened, at its real speed or slower, never sped up to look bigger.
5. No Hubie line unless it is visible in recordings/05-hubie-rewards.mp4. Do not write dialogue for him. Do not generate or redraw him.
6. Audio is required: music, voice, or both. Every audio file needs an entry in CREDITS.md with its source and the licence that allows commercial use. Do not use a locally generated music model whose weights are non-commercial. If there is no usable music file, build the voice-only version and say so.
7. End card carries "18+" and "Gamble responsibly." legible for at least 3 seconds, plus the licence line from the Housebets footer if BRIEF.md asks for it.
8. No real athletes, club marks or third-party logos anywhere, including inside the recordings. If a recording shows one, crop it out or tell me.

====================================================================
THE ONE THING
====================================================================
What it is: Housebets pays you for the history you already have, then gets out of your way: paste a wallet, play the House's own games, get rewarded, cash out.
What the viewer remembers: "I paste my wallet and something happens."
The spine: one balance. It appears after the scan, moves when the originals pay, moves when rewards land, and moves when the withdrawal leaves. Find the balance readout in each recording and keep it in frame whenever the footage allows. It is the thread between four otherwise separate beats.

====================================================================
OUTPUT
====================================================================
1920x1080, 30 fps, 30.000 s = 900 frames. Root data-duration="30".
Music clock, if there is a bed: 120 BPM, one beat = 15 frames. Cuts land on beats. Use `npx hyperframes beats` on the real file and re-time to it.
A 1080x1920 cut is optional. Do not start it until the 16:9 is approved.

====================================================================
LOOK
====================================================================
"Looks like Housebets" is 35 points, so the footage does the talking and the framing gets out of the way.
- The recording fills the frame, or sits on the Housebets ground colour sampled from the footage itself. No device mockups, no 3D tilt, no drop-shadowed floating windows.
- Punch-ins isolate one control at 1.6x to 2x its real size. UI text never under 26 px after scaling. A punch-in is a crop of the footage, not a rebuild.
- Overlay type: the brand faces from assets/brand/ if supplied; otherwise Red Hat Display 700 for lines and Figtree for small text (both in assets/fonts/, declared with @font-face). White on the sampled ground. One line at a time, bottom-left, inside title-safe. Never over a number in the footage.
- Colour: no grade on the footage. If a recording needs brightness or contrast help, use `npx hyperframes media-treatment`, never CSS filters.
- Logo: the supplied file only, end card only.
- Motion: cuts are hard cuts on the beat. Punch-ins are one move, 9 to 12 frames, expo.out. Type arrives as one move, 10 frames, power4.out, and leaves on the cut. No per-letter animation, no bounce, no glow, no particles, no confetti added on top of whatever the product itself shows.

====================================================================
SHOTS (frame ranges at 30 fps)
====================================================================
Trim each recording to its best moment. Speed changes are allowed on waiting (a scan progressing, a card being dealt) and never on a result.

S1  f0-59     (0-2 s)     01-wallet-scan. Open already inside the paste: the address lands in the field on frame 6. Frame 0 is the real page, not black. Overlay: "Paste a wallet."
S2  f60-179   (2-6 s)     01-wallet-scan. The scan runs (compress the wait to about 2 s), then the result appears at real speed and holds for at least 45 frames. Punch in on the result. Overlay arrives after the result is readable: "It already knows you."  [If BRIEF.md supplies approved copy for this feature, use that instead.]
S3  f180-239  (6-8 s)     02-dice. One roll, the result.
S4  f240-299  (8-10 s)    03-blackjack. The deal and the outcome.
S5  f300-389  (10-13 s)   04-mines. Two safe reveals as quick cuts, then the cash-out. This is the big win: real speed, full frame on the product's own win state, hold 40 frames. Overlay: "House originals." on S3 only; nothing over the win.
S6  f390-509  (13-17 s)   05-hubie-rewards. The tip arrives (punch in), then the rewards panel, then the level-up at real speed. Hubie's own on-screen words carry this beat. No overlay unless the footage has no readable line, in which case: "Hubie runs the rewards."
S7  f510-629  (17-21 s)   07-withdraw. THE PRESS. Hard cut to the withdraw confirm, cursor hovering, nothing moving. Music stops dead on f510. Room tone only. Slow push-in from 1.0x to 1.25x across the full 4 s, linear. The click lands on f615.
S8  f630-749  (21-25 s)   07-withdraw then 06-deposit. Music returns on f630 in half-time. The balance changes after the withdrawal, hold 30 frames. Cut to the deposit arriving and the balance changing the other way, hold 30 frames. Overlay: "In. Out. Yours."  [Replace with BRIEF.md copy if it supplies any. Do not state a time.]
S9  f750-899  (25-30 s)   End card. Sampled ground. Official logo centred. "housebets.com" beneath. "18+. Gamble responsibly." at the bottom, legible from f780 to f899. If official Hubie art exists in assets/brand/, he sits beside the logo, still. Music ends on a bar line by f870.

If a recording is missing, keep its slot at its length, fill it with a plain card reading "FOOTAGE NEEDED: <filename>", and list it in the delivery note. Do not redistribute the time to hide the gap.

====================================================================
SOUND
====================================================================
- Bed, if supplied in assets/audio/: start at its strongest bar on f0, hard stop at f510, back at f630, out by f870.
- Voice, if no bed or if I ask for both: generate with `npx hyperframes tts`. Calm, unhurried, mid-pitch. Script, with the frame each line starts on:
    f6    "Paste a wallet."
    f120  "Housebets already knows you."
    f195  "Play the House's own games."
    f405  "Hubie handles the rewards."
    f640  "Money in. Money out."
    f765  "Housebets."
  Nothing spoken between f510 and f629. Check every line against HARD RULES 3 to 5 before generating. Under a voice the bed sits near 0.14.
- Effects from the HyperFrames catalog only, each with a cause on screen: one soft click on the paste, one on the press at f615, one whoosh into the originals montage. Rotate takes. No chimes, no dings, no coin sounds.
- If the recordings carry the product's own game sounds, keep them under the bed on S3 to S5 with data-has-audio="true", and say so.
- Mix around -14 LUFS, true peak at or under -1 dBTP. Verify with `npx hyperframes audio <render> --json` and report the measured numbers.

====================================================================
BUILD RULES
====================================================================
- One scene per sub-composition in compositions/, mounted from index.html. Ids s1-paste, s2-scan, s3-dice, s4-blackjack, s5-mines, s6-hubie, s7-press, s8-balance, s9-end.
- Each recording is a <video class="clip" muted> (or data-has-audio="true") with data-start, data-duration and data-media-start for the trim. Time the <video>, never its wrapper. Never play(), pause() or seek media in script.
- Overlay lines, the URL and the legal line are variables (data-var-text) so I can change copy without touching code.
- Nothing visible depends on wall-clock time or unseeded randomness.
- Asset paths are relative with no leading slash.

====================================================================
REVIEW BEFORE YOU SHOW ME
====================================================================
`npx hyperframes check --json` with zero errors, then `npx hyperframes snapshot --review`, then REVIEW.md answering with frame numbers:
1. Is every product frame traceable to a file in recordings/ or assets/brand/? List shot -> file -> source timecode.
2. Are all four must-shows present? Give the frame range of each: wallet paste, scan, bonus; Dice, Blackjack, Mines, the big win; Hubie, the tip, rewards, level-up; deposit, withdraw, each balance change.
3. List every number visible in the film and the recording it comes from. Any number not from footage is a failure.
4. List every word of overlay and voice copy. Does any of it promise an outcome, state an amount or a time, or put words in Hubie's mouth?
5. Is there audio on every second except f510-f629? Measured loudness?
6. Is "18+. Gamble responsibly." on screen and legible for at least 90 frames?
7. Does the film read with the sound off?
8. Is anything private visible (address, username, transaction id) that I haven't approved?
Then `npx hyperframes preview --background`, give me the URL and wait.
On approval: `npx hyperframes render --quality delivery -o renders/housebets-30s-16x9.mp4`. Confirm with ffprobe: 30.000 s, 30 fps, 1920x1080, an audio stream present. Deliver the file, a poster frame from the win in S5, CREDITS.md, and the list of every tool, model, font and asset used.
````

---

## The X post

The post, not just the video, has to carry the three required marks. A draft that makes no claim the footage doesn't show:

> Paste a wallet. Play the House originals. Let Hubie handle the rewards. Cash out.
>
> housebets.com
>
> #ad · 18+ · Gamble responsibly.

**[check brief]** for a required hashtag, account tag or link format, and for whether the entry is the post URL or the file.

## Still needed from you

1. The full Task and Rules, saved as `ad/BRIEF.md` (it didn't attach last time).
2. The seven recordings, or word that the starter pack already contains equivalent screens.
3. Official Hubie art and logo from the starter pack, in `ad/assets/brand/`.
4. An audio decision: your own AI-generated track, voice only, or both.
5. Confirmation that the overlay lines are acceptable, or the brief's own copy to use in their place. "It already knows you", "House originals", "Hubie runs the rewards" and "In. Out. Yours." are mine and state no figures, but they are not verified Housebets copy.
