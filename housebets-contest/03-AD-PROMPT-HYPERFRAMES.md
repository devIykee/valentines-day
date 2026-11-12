# 30-second Housebets ad: HyperFrames prompt

## Read this first

**I could not read the ad contest's brief.** The contest page is behind a Cloudflare challenge, and unlike the sportsbook contest nobody has published a copy. All I could confirm is one line from a Housebets X post: "$3K: make a 30-second Housebets ad." I also found no public ad entries, so there is no field to compare against here.

So this prompt is built to survive the likely answers, and has a block at the top for you to fill in from the live page. Fill it before you run it. If the brief says something that contradicts the idea (for example "must show the casino games" or "must be vertical"), tell me and I'll rework it.

**What I took from the video you attached.** It's a repost of a well-known marketing-analytics commercial. The structure is what makes it work, and it's what this ad borrows:

1. One tiny cause, shown plainly.
2. Institutions overreact to it, and each cut is a bigger scale than the last (an office, a factory, trucks, a container ship, a trading floor). Cuts get shorter as it climbs.
3. A smash cut to a quiet, small, domestic reveal of what the cause really was.
4. A dry one-line question on a plain card, then the brand, held for a long time. About a fifth of the runtime is the quiet ending.

It borrows the structure only. No shot, line or character from that film is reused.

**Why this idea.** Every betting ad sells speed and noise. Housebets' mascot is a sloth whose own catchphrase is "slow it down". That's a position no competitor can copy, and it's also the responsible one, which keeps the ad clear of gambling-ad trouble: nobody wins, no money is shown, nothing is urgent.

**What HyperFrames can and can't do.** It renders HTML to video frame by frame. It is very good at type, real product UI, and a simple character rig. It does not make live-action footage. The reference film is live action; this ad gets the same comic shape with a sloth's claw, real Housebets screens and a world that speeds up around him. If you want filmed or generated footage in some shots, there are marked slots for it, and the ad still works without them.

---

## The idea in one paragraph

**"Thirty seconds."** The whole ad is the time it takes Hubie to press one button. We open on his claw, already in frame, creeping toward a real Housebets button. We keep cutting away to everything else going faster and faster: a match clock racing, prices ticking, chat yelling at him to hurry, then the window behind him running from day to night, then seasons, then a cobweb forming on his top hat. Every time we cut back, the claw has moved a few millimetres. Smash cut to silence. He looks at the camera. He presses it. "haha, nice." Card: **Everything else is in a hurry.** Then: **Slow it down.** Housebets.

The one thing a viewer remembers: *the sloth took the entire ad to press a button and didn't care.*

---

## The prompt

Paste everything in the fence into a coding agent that has the HyperFrames skills installed (`npx hyperframes skills update`; needs Node 22+ and FFmpeg). Attach the brand pack: logo SVG, fonts, official Hubie art, and screen recordings or screenshots of the real Housebets product.

````text
Make a 30-second ad for Housebets with HyperFrames. Read the /hyperframes skill first and follow its contract and work loop. The storyline below is already chosen: do not propose alternatives. Write SPEC.md from it, build, check, review, show me the preview, and render only when I approve.

====================================================================
CONTEST CONSTRAINTS (I filled these in from the contest page)
====================================================================
Length rule:            [exactly 30 s | up to 30 s]            default: exactly 30.000 s
Aspect ratio:           [16:9 | 9:16 | 1:1 | any]              default: 16:9 master plus a 9:16 recomposition
How it is submitted:    [file upload | public link | social post]
Must include:           [ ... ]
Must not include:       [ ... ]
Music and AI rules:     [ ... ]
Product focus:          [Housebets overall | casino | sportsbook]   default: Housebets overall
Deadline:               [ ... ]
If a line is still in brackets, use the default and say so in your delivery note.

====================================================================
HARD RULES
====================================================================
This advertises a gambling product. These are not style preferences.
- Nobody wins anything on screen. No win amount, no balance, no payout, no "win", "profit", "jackpot", "easy money", "guaranteed", "risk-free".
- No money amounts at all, in any currency.
- No urgency directed at the viewer: no countdown to act, no "bet now", no "don't miss".
- No promo, bonus, boost or free-bet claim. No claim about the product that I have not given you in writing. If a line would need a source and you don't have one, cut the line.
- No real athletes, no real club or league logos, no real people. Team names, if any appear in captured UI, are blurred or replaced with invented ones.
- End card carries "18+. Play responsibly." legible for at least 3 s. Add the licence line from the Housebets footer if I supply it.
- Hubie never gives a tip, never predicts, never tells anyone to deposit.
- Music and sound must be licensed for commercial use. Record the source and licence of every audio file in CREDITS.md. No track I can't trace.
- The Housebets logo, fonts and Hubie are used from the supplied files. Never redraw the logo. Never generate a new Hubie.
- Nothing copied from any existing commercial: no shot, line, character or music.

====================================================================
THE ONE THING
====================================================================
What it is: Housebets is the calm one. Its mascot is a sloth, and his catchphrase is "slow it down".
What the viewer remembers: the sloth took the entire ad to press one button, and it was fine.
The spine: one claw, one button, one continuous movement from frame 0 to the press.

====================================================================
OUTPUT
====================================================================
Master: 1920x1080, 30 fps, 30.000 s = 900 frames. Root data-duration="30".
Also: 1080x1920 at 30 fps, recomposed (not cropped), same timing, as a second root or a variables batch.
Music clock: 120 BPM, so one beat = 15 frames and one bar = 60 frames. Every cut lands on a beat. The press lands on a downbeat.

====================================================================
LOOK (numbers, not adjectives)
====================================================================
Two worlds that never share a frame until the end.

SLOTH WORLD (slow)
- Ground #041015. A single warm key light from upper left: a radial highlight at 12% opacity. Vignette 18%. Grain 2%. No glow, no particles.
- Hubie: the official art. Sloth, navy top hat with a gold H badge, tuxedo, bow tie, gold cufflinks. Calm half-smile.
- The claw: three pale claws, brown fur, white shirt cuff, gold cufflink, navy sleeve. If the brand pack has no arm art, draw this one piece to match the official art's outline weight and palette, and tell me you did.
- The phone: a plain dark slab, no brand, 8 px radius, lying at a slight angle only in the wide shot. In close-ups the screen is square to camera. Never tilt product UI in 3D.
- The button: a real Housebets primary button, captured from the product or the brand pack. Pale cyan fill, dark text. Its label is whatever the real button says. Show it at 2x real size in close-up; text never under 26 px.
- Depth: contact shadow under the claw, offset 0/14 px, blur 22 px, 45% opacity, tightening as the claw nears the glass.

FAST WORLD
- Real Housebets screens only (my recordings or screenshots, or `npx hyperframes capture https://www.housebets.com` if it gets through). Rebuild only the piece each beat uses, at 1.6x to 2x, keeping real labels. If you don't have a real screen for a beat, use a labelled placeholder ("Screenshot needed: live match row") and list it in the delivery note. Never invent a dashboard.
- Numbers in Oxanium 700. Headlines in Red Hat Display 700. UI text in Figtree. All three need @font-face from assets/fonts/. They are not in the HyperFrames bundle.
- Accent: saturated cyan #02f8f8 for prices and the wordmark H only. Red-pink #f41f50 for the LIVE dot only. Gold #daa520 for Hubie's badge and cufflinks only.
- Motion blur on (data-motion-blur="on") for the fast world only. Off for the sloth world.

TYPE CARDS
- Ground #041015, flat. Text #f9f9fb. One line per card, left-aligned on a 160 px margin, baseline at 56% of frame height.
- Red Hat Display 700, 132 px, tracking -1.5%. Inside title-safe (80%).

====================================================================
MOTION
====================================================================
- The claw: ONE linear tween of x from frame 0 to frame 630. Constant speed is the joke. It travels 520 px of screen distance in close-up over those 21 s. It must be at the same computed position whenever we cut back, so drive every claw shot from the same progress value. Add a seeded 0.6 px tremor at 8 Hz so it looks alive.
- Hubie: a blink takes 36 frames (lids down 14, hold 6, up 16). His head moves 6 px at most. Offset parts: head leads, hat follows by 3 frames. An idle breath of 1.5% scale over 90 frames.
- Fast world arrivals: expo.out, 9 to 12 frames. Exits: power3.in, 6 frames. Cuts are hard cuts on the beat. No crossfades inside the escalation.
- Type cards: each line arrives as one move, 10 frames, power4.out, 24 px rise. No per-letter animation, no bounce.
- Nothing fades in from a void. Nothing floats.

====================================================================
SHOTS (frame ranges at 30 fps; W = wide, CU = close-up)
====================================================================
The fast shots get shorter as it climbs. The sloth shots stay the same calm length until the montage, where they become single-beat inserts.

S1  f0-74    (0.0-2.5 s)  CU claw and button. Frame 0 is NOT black: the button is at right, the claw tip is already in frame at left, moving. Sound: quiet room, a soft clock tick each second. No music.
S2  f75-119  (2.5-4.0 s)  W Hubie, head and shoulders, looking down at the phone. A blink begins. A window behind his left shoulder shows a calm afternoon. Hold.
S3  f120-179 (4.0-6.0 s)  FAST. Music enters on f120 at full level. A real live match row: the clock runs visibly, two prices tick. Read: "things are moving."
S4  f180-224 (6.0-7.5 s)  CU claw. It has moved about 150 px of its 520. Music drops to a muffled thump as if heard through a wall. This muffling is the audio signature of sloth time and is used on every sloth shot until S12.
S5  f225-284 (7.5-9.5 s)  FAST. A real market or game element changes state (whatever the captured product genuinely does: a round ends, a price updates, a market pauses and returns). Two state changes in 2 s.
S6  f285-314 (9.5-10.5 s) W Hubie. The blink from S2 is only now finishing. Window: late afternoon.
S7  f315-359 (10.5-12.0 s) FAST. The real Housebets chat panel. Invented usernames. Three messages land on the beat: "hubie u there??" / "bro HURRY" / "it's been 12 seconds". The third is the only readable one; give it 20 frames.
S8  f360-374 (12.0-12.5 s) CU claw. One beat.
S9  f375-479 (12.5-16.0 s) ESCALATION MONTAGE. Shots of 30, 30, 15, 15, 8, 7 frames, alternating fast world and Hubie's window, each bigger in scale than the last:
      match clock digits spinning (30)
      window: sun drops, sky goes orange (30)
      a wall of 12 live rows all ticking (15)
      window: night, moon crosses (15)
      window: snow (8)
      window: spring leaves, a bird lands and leaves (7)
    Hubie does not move in any window shot except that his blink state follows its own slow clock.
S10 f480-509 (16.0-17.0 s) FAST. Riser. A 4x3 grid of every fast shot playing at once, pushing in to the centre cell. A cobweb has formed between Hubie's hat and the window frame in the one cell that shows him.
S11 f510-629 (17.0-21.0 s) SMASH CUT TO SILENCE on f510. CU claw, 2 mm from the button. Room tone only. Hold 45 frames. Cut W Hubie on f555: his eyes move to the lens (a take: anticipation 4 frames, move 8, settle 10). Half-smile grows 2 px. Hold. Cut CU claw on f600.
S12 f630-689 (21.0-23.0 s) THE PRESS on f630, a downbeat. The button shows its real pressed state for 6 frames. One soft click, placed so its peak is 1 frame after the picture. Cut W Hubie on f645. Caption in his voice, lower third, Figtree 600, 44 px: "haha, nice." If I supplied or approved a voice, the line is spoken, slow and warm, and the caption stays. The screen behind the press shows only what the real product shows after that button. It must not show a win.
S13 f690-749 (23.0-25.0 s) TYPE CARD. Music returns, no longer muffled, half-time feel. "Everything else is in a hurry."
S14 f750-794 (25.0-26.5 s) TYPE CARD. Same position. "Slow it down." The first line leaves as one move, the second arrives as one move.
S15 f795-899 (26.5-30.0 s) END CARD. Official Housebets logo, centred, 420 px wide. Under it "housebets.com" in Figtree 500, 40 px. Bottom, title-safe: "18+. Play responsibly." in Figtree 500, 28 px, #8f96a8. From f810 Hubie's claw enters bottom right, heading for the brim of a top hat sitting at the frame edge, at the same speed as before. At f899 it still hasn't reached it. Music ends on the bar line at f870 with a 20-frame tail.

OPTIONAL FOOTAGE SLOTS: S3, S5 and the window plates in S9 may be replaced by filmed or generated clips if I supply them. They go in as <video class="clip" muted>, graded with `npx hyperframes media-treatment`, never CSS filters. The ad must be complete without them.

====================================================================
SOUND
====================================================================
- Bed: 120 BPM, a tight minimal pulse that feels busy and slightly anxious, with a clean hard stop available at 17.0 s and a relaxed half-time section for the last 7 s. Search the catalog by feel, not by subject. Start at the track's strongest bar on f120. If I gave you a track, use mine as given and re-time cuts to its beats with `npx hyperframes beats`.
- Sloth time: the same bed, low-passed, at about 30% level. Prepare the muffled version as a separate file; do not filter in the browser.
- Effects, each with a cause on screen: clock tick (S1 only), two different whooshes rotated across the montage cuts, one riser into the smash cut, one soft click on the press. Nothing else. No chimes, no dings, no synthesised tones.
- The 4 s of near-silence in S11 is the loudest moment in the ad. Protect it: no tail from the riser past f512.
- Mix around -14 LUFS, true peak at or under -1 dBTP. Check the render with `npx hyperframes audio out.mp4 --json` and report the numbers as measured.
- Every <audio> has an id. If there is no music source available, deliver silent, say so in one line, and tell me how to add a track. Do not write music in code.

====================================================================
VERTICAL RECOMPOSITION (1080x1920)
====================================================================
- Nothing in the top 168 px. All words and the product between 168 and 1330 px. Below 1330 px only ground.
- Claw shots: the claw travels bottom to top toward a button in the upper third of the safe band. Same progress value, same joke.
- Wide Hubie shots: Hubie centred, window above his shoulder.
- Type cards: 148 px, two lines maximum, five words a line maximum. "Everything else / is in a hurry."
- Frame 0 shows Hubie's face and the claw. It is the thumbnail.

====================================================================
BUILD RULES (HyperFrames contract, restated where this film is at risk)
====================================================================
- `npx hyperframes init housebets-ad --skip-skills --skill=hyperframes`. One scene per sub-composition in compositions/, mounted from index.html. Short ids: s01-claw, s02-hubie, ... s15-end.
- Every timed element: class="clip", data-start, data-duration, a stable id, written in the HTML.
- Each composition builds one paused GSAP timeline and registers it on window.__timelines.
- The claw's progress, Hubie's blink and the window's time of day are pure functions of timeline time, shared from one helper so every scene agrees. No Date.now, no unseeded random, no timers, no repeat: -1.
- Never tween display, visibility or autoAlpha on a .clip. Animate a child. Animate transforms, not left/top/width/height.
- Copy and colours are variables (data-var-text, CSS custom properties) so I can change a line in the desktop app without touching code: both card lines, the caption, the URL, the legal line.
- Before hand-writing any transition or effect, search the registry.
- Asset paths are assets/... with no leading slash.

====================================================================
BANNED (the defaults this film must not fall into)
====================================================================
Dark void with a glowing orb. Gradient mesh backgrounds. Text fading in letter by letter. Everything easing with the same power2.out. Floating UI cards tilted in 3D. Particle confetti. Coins, chips, dice or money rain. A countdown timer. Lens flares. A logo sting with a whoosh. Stock "crowd goes wild" footage. Any shot where both of Hubie's eyes or both arms move in unison. A caption that repeats what the picture already shows.

====================================================================
REVIEW (do this before you show me anything)
====================================================================
`npx hyperframes check --json`: zero errors.
`npx hyperframes snapshot --review`, then write REVIEW.md answering, with frame numbers:
1. f0: is it a readable picture with the claw and button, not black?
2. Pull the claw's x at f0, f180, f360, f510, f629. Is it one straight line?
3. Does every cut from f120 to f509 land on a multiple of 15 frames? (The one exception is the 8/7 split inside the last beat of S9.)
4. Is S11 actually quiet? Give the measured level.
5. Is every product screen real? List any placeholder.
6. Search every frame's text for: win, won, bonus, free, now, hurry (outside the chat joke), any currency symbol, any number that reads as money. Zero allowed.
7. Is the legal line on screen and legible for at least 90 frames?
8. With the sound off, does a stranger still get the joke by f360?
9. Does the vertical cut keep every word inside 168-1330 px?
Then `npx hyperframes preview --background`, give me the URL, and wait.
On approval: `npx hyperframes render --quality delivery -o housebets-30s-16x9.mp4`, and the same for 9x16. Confirm with ffprobe that each is 30.000 s, 30 fps, and has an audio stream. Give me both files, a poster frame from f570 (Hubie looking at the lens), CREDITS.md, and a list of every tool, model, font and asset used, because the contest form will ask.
````

---

## Two alternates, if the brief rules this one out

Don't build these unless you need them.

- **"Not today, man."** Hubie scrolls past a parade of loud fake betting-ad clichés (flashing banners, a shouting presenter silhouette, a ticking clock), each one bouncing off him. He says "not today, man" to each, more slowly every time. Ends on quiet Housebets UI. Sharper, but it mocks the category, which a gambling brand's legal team may not enjoy.
- **"I see everything."** A straight product film: the real Housebets interface, with Hubie's eyes tracking each state change before the viewer notices it. Lowest risk, least funny. Use it if the brief asks for a product demo.

## What I need from you to make this real

1. **The ad brief** from the contest page, pasted into the constraints block.
2. **Official Hubie art.** A layered file is ideal. A single flat image works for head-and-shoulders shots; the arm would then be drawn to match.
3. **Screen recordings of the real Housebets product**, logged in: a live match row, the chat panel, and one primary button being pressed and what follows it. The whole ad hangs on that button being real.
4. **Check the catchphrases.** "slow it down" and "haha, nice." come from other entrants' notes citing Hubie's on-site chat. Ask Hubie on housebets.com and confirm the wording before it goes on a title card.
5. **A music decision.** HyperFrames' catalog needs a free sign-in (`npx hyperframes auth login`). Otherwise bring a track you have a licence for.
