# "Thirty seconds": 30-second Housebets ad

Built with [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML rendered to video).

**Output:** `renders/housebets-30s-16x9.mp4`. 1920×1080, 30 fps, exactly 30.000 s, H.264.

The whole ad is the time it takes Hubie to press one button. Everything else speeds up around him.

## Before you submit this

1. **It is silent.** No licensed music source was available in the build environment, and HyperFrames' own guidance is not to synthesise music in code. Add a track you have rights to: put it in `assets/`, add `<audio id="bed" class="clip" data-start="4" data-duration="26" src="assets/your-track.mp3">` inside `#root` in `build.py`, and re-render. The cut points sit on a 120 BPM grid from 4.0 s. The 17.0 to 21.0 s stretch is meant to be near-silent.
2. **The Hubie image** (`assets/hubie.webp`) was taken from a public entry to Housebets' own Hubie streamer contest, which describes it as Housebets' art. Swap in the file from your official brand pack to be sure of its provenance.
3. **The product screens are illustrative**, drawn in the Housebets palette. They are not captures of the live site, which blocks automated access. Team names and chat names are invented. If the ad brief wants real product footage, replace shots S3, S5 and S7.
4. **I could not read the ad contest's brief.** Length, aspect ratio and submission format are assumed (30 s, 16:9). Check them.
5. Confirm the two Hubie lines used ("Slow it down." and "haha, nice.") against the official source.

No one wins, no money amount appears, and the end card carries "18+. Play responsibly."

## Rebuild

```
python3 build.py                    # regenerates index.html from the shot list
npx hyperframes check               # lint, layout, contrast
npx hyperframes snapshot --at 1,10,21,28
npx hyperframes render --quality delivery -o renders/housebets-30s-16x9.mp4
```

Card text, Hubie's line, the URL and the legal line are HyperFrames variables. Shot timings are at the top of `build.py`.

## Credits

HyperFrames (Apache-2.0) · GSAP · Figtree, Oxanium, Red Hat Display (SIL OFL) · Housebets wordmark (Housebets) · built with Claude Code.
