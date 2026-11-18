# NEAR: Q-Day / Change the Locks

An 83-second vertical explainer (1080×1920, 30 fps) about upgrading to quantum-safe signing on NEAR and its post-quantum roadmap, made for the NEAR video content campaign.

- **Video:** `NEAR-QDay-Change-The-Locks.mp4` (H.264 + AAC, -14 LUFS)
- **Built with:** HyperFrames (HTML → video), Three.js for the 3D world, GSAP for type and captions
- **Voice and sound:** ElevenLabs (voice "Declan Sage" on eleven_v4; 18 sound-effect layers on sound effects v3)

## Layout

| Path | What it is |
| --- | --- |
| `project/` | The HyperFrames project. `index.html` holds the overlay, captions and timeline; `assets/world.js` is the 3D world (globe of locks, padlock, quantum computer, keyring, lattice, roadmap gates, colour-grade pass) |
| `project/assets/mix.wav` | Final mastered soundtrack (voice + ducked score + effects) |
| `project/assets/vo.wav` | Processed voiceover (pauses tightened, 1.07× speed with pitch kept, EQ, de-essed, compressed) |
| `project/assets/lib/` | Three.js 0.170.0 and the add-ons it uses, vendored so renders never hit the network |
| `scripts/build2.py` | Generates `project/index.html` (titles, karaoke captions from `transcript.json`) and copies `world.js` into the project |
| `scripts/mix.py` | Builds `mix.wav` from `audio-src/`: gain staging per role, effects aligned to cuts, score ducked under the voice, mastered to -14 LUFS / -1.5 dBTP |
| `audio-src/` | Raw ElevenLabs voice (`vo2.mp3`) and sound layers |

## Rebuild

```bash
cd near-quantum-video
python3 scripts/build2.py project            # regenerate index.html + copy world.js
python3 scripts/mix.py audio-src project/assets/mix.wav   # needs numpy + ffmpeg; reads project/assets/vo.wav
cd project && npx hyperframes@0.9.65 render -q delivery -o ../out.mp4
```

## Sources

- [NEAR Protocol brings quantum-safe signing to mainnet (PR Newswire)](https://www.prnewswire.com/news-releases/near-protocol-brings-quantum-safe-signing-to-mainnet-302829646.html)
- [NEAR docs: access keys (ML-DSA-65, FIPS 204)](https://docs.near.org/protocol/accounts-contracts/access-keys)
