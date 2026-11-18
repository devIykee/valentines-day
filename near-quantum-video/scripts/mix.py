#!/usr/bin/env python3
"""Sound design + mix: VO bus, ducked score bus, SFX placed by peak, mastered to -14 LUFS."""
import subprocess, os, sys, json
import numpy as np
RAW = sys.argv[1]; OUT = sys.argv[2]; END = 83.0; SR = 48000

def load(name):
    p = os.path.join(RAW, name)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

def norm_peak(x, db):  # peak-normalise to role target
    pk = np.max(np.abs(x)) + 1e-9; return x * (10 ** (db / 20) / pk)

def peak_time(x):  # first transient: where the envelope reaches 70% of max
    env = np.abs(x).max(axis=1); thr = env.max() * .7; return int(np.argmax(env >= thr))

N = int(END * SR)
score = np.zeros((N, 2), np.float32); sfx = np.zeros((N, 2), np.float32)

def place(buf, x, t, gain_db=0.0, align_peak=False, fade_in=0.0, fade_out=0.0, dur=None):
    x = x.copy()
    if dur is not None: x = x[: int(dur * SR)]
    n = len(x)
    if fade_in > 0: k = min(n, int(fade_in * SR)); x[:k] *= np.linspace(0, 1, k)[:, None]
    if fade_out > 0: k = min(n, int(fade_out * SR)); x[n - k:] *= np.linspace(1, 0, k)[:, None]
    off = int(t * SR) - (peak_time(x) if align_peak else 0) + (int(SR / 30) if align_peak else 0)
    a, b = max(0, off), min(N, off + n)
    if b > a: buf[a:b] += x[a - off:b - off] * (10 ** (gain_db / 20))

def loop(x, length, xf=1.0):  # crossfaded loop to length seconds
    L = int(length * SR); k = int(xf * SR); out = x.copy()
    while len(out) < L:
        fade = np.linspace(0, 1, k)[:, None]
        out = np.concatenate([out[:-k], out[-k:] * (1 - fade) + x[:k] * fade, x[k:]])
    return out[:L]

# ---- score bus ----
drone = norm_peak(load("drone_dark.mp3"), -10); pad = norm_peak(load("pad_hope.mp3"), -9)
pulse = norm_peak(load("pulse.mp3"), -9); tick = norm_peak(load("tick.mp3"), -14); qhum = norm_peak(load("qhum.mp3"), -12)
place(score, loop(drone, 29.4), 0.0, -2, fade_in=1.5, fade_out=0.35)               # dread under the threat act
place(score, loop(qhum, 3.8), 14.6, -3, fade_in=.4, fade_out=.6)                    # the machine room
place(score, loop(pulse, 11.0), 18.3, -1, fade_in=.8, fade_out=.3)                  # heartbeat: "nobody knows when"
place(score, loop(tick, 4.9), 18.3, 0, fade_in=.2, fade_out=.4)                     # clock
# 29.25–29.58: near-silence beat, then NEAR arrives
place(score, loop(pad, 53.5), 29.55, -1, fade_in=1.2, fade_out=2.5)                  # hope for the NEAR act

# ---- sfx bus ----
S = {n: load(n + ".mp3") for n in ["boom", "braam", "riser", "glitch", "glitch2", "whoosh", "whoosh_a", "whoosh_b", "keys", "keyturn", "shimmer", "typing", "pop", "unlock", "keydrop", "lock"]}
P = {"boom": -3, "braam": -4, "riser": -6, "glitch": -9, "glitch2": -10, "whoosh": -11, "whoosh_a": -10, "whoosh_b": -9, "keys": -12, "keyturn": -10,
     "shimmer": -11, "typing": -15, "pop": -14, "unlock": -6, "keydrop": -11, "lock": -9}
S = {k: norm_peak(v, P[k]) for k, v in S.items()}
def riser_into(t_hit, gain=0):  # riser whose END lands on the hit
    x = S["riser"]; place(sfx, x, t_hit - len(x) / SR, gain, fade_in=.3)
ev = [
    # hook: the wave of unlocking
    ("glitch", 2.54, -2, True), ("whoosh_b", 0.2, -6, False),
    # Q-DAY impact
    ("boom", 6.96, 0, True), ("glitch2", 6.96, -3, True),
    # cuts (rotate whoosh takes; transient one frame after the cut)
    ("whoosh_a", 8.8, -2, True), ("whoosh_b", 14.75, 0, True), ("whoosh", 18.3, -4, True), ("whoosh_a", 23.25, -2, True),
    ("whoosh_b", 41.0, 0, True), ("whoosh_a", 53.0, -2, True), ("whoosh", 60.2, -5, True), ("whoosh_b", 66.0, -1, True), ("whoosh_a", 74.45, -2, True),
    # lock = math / quantum shortcut
    ("glitch", 16.4, -4, True), ("unlock", 17.31, 0, True), ("braam", 17.31, 0, True), ("glitch2", 17.33, -4, True),
    # address
    ("lock", 24.72, -3, True), ("whoosh_a", 25.4, -6, True), ("glitch", 26.17, -6, True), ("whoosh_b", 27.97, 0, True), ("whoosh", 28.3, -6, True),
    # NEAR
    ("boom", 29.58, -1, True), ("shimmer", 29.62, -4, False),
    ("pop", 32.2, 0, True), ("keys", 34.94, 2, False), ("pop", 35.06, -2, True), ("keyturn", 39.75, 2, True),
    # ML-DSA / lattice
    ("pop", 41.25, 0, True), ("braam", 44.88, -2, True), ("shimmer", 44.95, -2, False), ("pop", 48.32, 0, True), ("pop", 50.17, -2, True),
    ("glitch2", 51.62, -6, True),
    # two moves
    ("pop", 53.6, -2, True), ("shimmer", 54.74, 0, False), ("keys", 54.8, 2, False), ("keydrop", 56.4, 0, False),
    ("pop", 57.68, 0, True), ("pop", 58.52, 0, True), ("lock", 59.61, -4, True),
    # today
    ("typing", 60.6, 0, False), ("pop", 62.15, -1, True), ("pop", 63.58, -1, True),
    # roadmap gates light
    ("pop", 66.92, -1, True), ("shimmer", 67.84, -6, False), ("pop", 71.07, -2, True), ("pop", 72.1, -2, True),
    # finale
    ("braam", 74.49, -3, True), ("shimmer", 75.9, -6, False), ("boom", 80.36, 0, True), ("keyturn", 79.35, 0, True),
]
for name, t, g, al in ev: place(sfx, S[name], t, g, align_peak=al)
riser_into(29.58, 0); riser_into(44.88, -3); riser_into(80.36, -2)

# ---- write stems, then duck + master in ffmpeg ----
def wav(path, x):
    x = np.clip(x, -1, 1); subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", path], input=x.astype(np.float32).tobytes(), check=True)
tmp = os.path.dirname(OUT)
wav(os.path.join(tmp, "_score.wav"), score); wav(os.path.join(tmp, "_sfx.wav"), sfx)
vo = os.path.join(tmp, "vo.wav")
fc = ("[0:a]aformat=channel_layouts=stereo,asplit=2[vo][key];"
      "[1:a][key]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350:makeup=1[duck];"
      "[duck]volume=-5dB,lowshelf=f=90:g=2[sc];"
      "[2:a]volume=-4dB[fx];"
      "[vo]volume=0dB[v];"
      "[v][sc][fx]amix=inputs=3:normalize=0:duration=longest,"
      "acompressor=threshold=-14dB:ratio=2:attack=20:release=200,"
      "alimiter=limit=0.5:attack=3:release=60:level=false,apad=whole_dur=83[m]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vo, "-i", os.path.join(tmp, "_score.wav"), "-i", os.path.join(tmp, "_sfx.wav"),
                "-filter_complex", fc, "-map", "[m]", "-ar", str(SR), "-t", str(END), OUT], check=True)
pre = OUT + ".pre.wav"; os.replace(OUT, pre)
import re
m = subprocess.run(["ffmpeg","-i",pre,"-af","ebur128=peak=true","-f","null","-"],capture_output=True,text=True).stderr
I = float(re.findall(r"I:\s+(-?[0-9.]+) LUFS", m)[-1]); g = -14.0 - I
subprocess.run(["ffmpeg","-v","error","-y","-i",pre,"-af",f"volume={g:.2f}dB,alimiter=limit=0.84:attack=2:release=50:level=false","-ar",str(SR),OUT],check=True)
os.remove(pre); print("mixed", OUT, "pre-I", I, "gain", round(g,2))
