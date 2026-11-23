/**
 * Deterministic signal generators for the medical figure library.
 * Everything here is pure maths (seeded PRNG) so server and browser render identical tracings.
 */

export function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const g = (t: number, mu: number, s: number) => Math.exp(-0.5 * ((t - mu) / s) ** 2);
const sig = (x: number) => 1 / (1 + Math.exp(-x));
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);

/** Sum of random sinusoids — cheap smooth noise. */
function noiseFn(seed: number, n: number, fLo: number, fHi: number) {
  const r = rng(seed);
  const comps = Array.from({ length: n }, () => ({ f: fLo + r() * (fHi - fLo), p: r() * 6.283, a: 0.5 + r() * 0.5 }));
  const norm = comps.reduce((s, c) => s + c.a, 0);
  return (t: number) => comps.reduce((s, c) => s + c.a * Math.sin(6.283 * c.f * t + c.p), 0) / norm;
}

/* ================================================================== */
/* ECG                                                                 */
/* ================================================================== */
type Morph = {
  rAmp: number; rSig: number; qAmp: number; sAmp: number; sSig: number; sDelay: number;
  tAmp: number; tCenter: number; tSig: number; st: number; stEnd: number; u?: number; uCenter?: number; spike?: boolean;
};
const NORMAL: Morph = { rAmp: 1.1, rSig: 0.011, qAmp: -0.1, sAmp: -0.22, sSig: 0.011, sDelay: 0.028, tAmp: 0.32, tCenter: 0.25, tSig: 0.055, st: 0, stEnd: 0.28 };
const WIDE: Morph = { rAmp: 1.25, rSig: 0.042, qAmp: 0, sAmp: -0.55, sSig: 0.05, sDelay: 0.13, tAmp: -0.5, tCenter: 0.32, tSig: 0.075, st: 0, stEnd: 0.3 };

const complex = (t: number, m: Morph) =>
  m.qAmp * g(t, -0.024, 0.008) + m.rAmp * g(t, 0, m.rSig) + m.sAmp * g(t, m.sDelay, m.sSig) + m.tAmp * g(t, m.tCenter, m.tSig) +
  (m.st ? m.st * (sig((t - 0.05) / 0.012) - sig((t - m.stEnd) / 0.02)) : 0) +
  (m.u ? m.u * g(t, m.uCenter ?? 0.5, 0.05) : 0) +
  (m.spike ? 1.9 * g(t, -0.05, 0.0035) : 0);

type Ev = { t: number; m: Morph };
type EcgSpec = { qrs: Ev[]; p: { t: number; amp: number }[]; extra?: (t: number) => number };

const beats = (start: number, rr: number, end = 6.3) => {
  const out: number[] = [];
  for (let t = start; t < end; t += rr) out.push(t);
  return out;
};
const PR = 0.15; // P-centre to R-peak for a normal PR interval (~0.16–0.18 s)

function sinus(rr: number, o: Partial<Morph> = {}, pAmp = 0.15, pr = PR, start = 0.45): EcgSpec {
  const ts = beats(start, rr);
  return { qrs: ts.map((t) => ({ t, m: { ...NORMAL, ...o } })), p: ts.map((t) => ({ t: t - pr, amp: pAmp })) };
}

export function ecgSpec(key: string): EcgSpec {
  const seed = hash(key);
  switch (key) {
    case "ecg-normal-sinus": return sinus(0.83);
    case "ecg-sinus-bradycardia": return sinus(1.25, { tCenter: 0.3 }, 0.15, 0.16, 0.55);
    case "ecg-sinus-tachycardia": return sinus(0.48, { tCenter: 0.2, tAmp: 0.25, tSig: 0.045 }, 0.14, 0.12, 0.3);
    case "ecg-atrial-fibrillation": {
      const r = rng(seed);
      const ts: number[] = [];
      for (let t = 0.35; t < 6.3; t += 0.38 + r() * 0.62) ts.push(t);
      const n1 = noiseFn(seed, 7, 5, 9);
      return { qrs: ts.map((t) => ({ t, m: { ...NORMAL, tAmp: 0.22 } })), p: [], extra: (t) => 0.055 * n1(t) };
    }
    case "ecg-atrial-flutter": {
      const ts = beats(0.5, 0.8);
      const period = 0.2;
      return {
        qrs: ts.map((t) => ({ t, m: { ...NORMAL, tAmp: 0.05, tSig: 0.04, rAmp: 1.0 } })),
        p: [],
        extra: (t) => {
          const f = (((t - 0.5 + 0.8) % period) + period) % period / period; // flutter waves lock to the QRS cadence (4:1)
          return 0.17 * (f < 0.8 ? 0.5 - f / 0.8 : -0.5 + (f - 0.8) / 0.2);
        },
      };
    }
    case "ecg-svt": return { qrs: beats(0.3, 0.355).map((t) => ({ t, m: { ...NORMAL, tAmp: 0.08, rAmp: 1.0, tCenter: 0.17, tSig: 0.04 } })), p: [] };
    case "ecg-ventricular-tachycardia": return { qrs: beats(0.2, 0.34).map((t) => ({ t, m: { ...WIDE, rAmp: 1.4, tAmp: -0.6, tCenter: 0.17, tSig: 0.07, sDelay: 0.09 } })), p: [] };
    case "ecg-ventricular-fibrillation": {
      const r = rng(seed);
      const comps = Array.from({ length: 6 }, () => ({ f: 3 + r() * 4, p: r() * 6.283, a: 0.4 + r() * 0.6 }));
      const env = noiseFn(seed + 3, 3, 0.15, 0.5);
      return { qrs: [], p: [], extra: (t) => (0.55 + 0.35 * env(t)) * comps.reduce((s, c) => s + c.a * Math.sin(6.283 * c.f * t + c.p + 1.2 * Math.sin(1.3 * t)), 0) / 2.6 };
    }
    case "ecg-torsades":
      return { qrs: [], p: [], extra: (t) => (0.18 + 1.05 * Math.abs(Math.sin((Math.PI * (t + 0.2)) / 2.1))) * Math.sin(6.283 * (t / 0.27 + 0.04 * t * t)) };
    case "ecg-asystole": {
      const n = noiseFn(seed, 3, 0.15, 0.6);
      return { qrs: [], p: [], extra: (t) => 0.025 * n(t) };
    }
    case "ecg-first-degree-block": return sinus(0.86, {}, 0.15, 0.3, 0.7);
    case "ecg-mobitz-1": {
      const pp = 0.75;
      const prs = [0.15, 0.25, 0.34]; // lengthening, then a dropped beat
      const qrs: Ev[] = [];
      const p: { t: number; amp: number }[] = [];
      for (let k = 0; ; k++) {
        const tp = 0.45 + k * pp;
        if (tp > 6.2) break;
        p.push({ t: tp, amp: 0.15 });
        const i = k % 4;
        if (i < 3) qrs.push({ t: tp + prs[i], m: NORMAL });
      }
      return { qrs, p };
    }
    case "ecg-mobitz-2": {
      const pp = 0.8;
      const drop = new Set([2, 5]);
      const qrs: Ev[] = [];
      const p: { t: number; amp: number }[] = [];
      for (let k = 0; ; k++) {
        const tp = 0.45 + k * pp;
        if (tp > 6.2) break;
        p.push({ t: tp, amp: 0.15 });
        if (!drop.has(k)) qrs.push({ t: tp + 0.17, m: { ...NORMAL, rSig: 0.014, sAmp: -0.3 } });
      }
      return { qrs, p };
    }
    case "ecg-third-degree-block": {
      const p = beats(0.25, 0.75).map((t) => ({ t, amp: 0.16 }));
      const qrs = beats(0.95, 1.65).map((t) => ({ t, m: { ...WIDE, rAmp: 1.15, tAmp: -0.35, tCenter: 0.34 } }));
      return { qrs, p };
    }
    case "ecg-pvc": {
      const normal = [0.5, 1.3, 2.1, 3.7, 4.5];
      const pvc = [2.75, 5.15];
      return {
        qrs: [...normal.map((t) => ({ t, m: NORMAL })), ...pvc.map((t) => ({ t, m: { ...WIDE, rAmp: 1.5, sAmp: -0.7, tAmp: -0.6 } }))],
        p: normal.map((t) => ({ t: t - PR, amp: 0.15 })),
      };
    }
    case "ecg-stemi": return sinus(0.85, { st: 0.42, stEnd: 0.31, tAmp: 0.32, qAmp: -0.18, rAmp: 0.95 });
    case "ecg-st-depression": return sinus(0.85, { st: -0.22, stEnd: 0.27, tAmp: 0.05 });
    case "ecg-hyperkalemia": return sinus(0.85, { tAmp: 0.95, tSig: 0.035, tCenter: 0.22, rSig: 0.02, sAmp: -0.4, sSig: 0.02 }, 0.04);
    case "ecg-hypokalemia": return sinus(0.95, { st: -0.13, stEnd: 0.24, tAmp: 0.05, u: 0.2, uCenter: 0.46 }, 0.15, 0.15, 0.5);
    case "ecg-paced": {
      const ts = beats(0.5, 0.85);
      return { qrs: ts.map((t) => ({ t, m: { ...WIDE, rAmp: 1.0, tAmp: -0.4, tCenter: 0.3, spike: true } })), p: [] };
    }
    default: return sinus(0.83);
  }
}

export function ecgPath(spec: EcgSpec, opts: { duration?: number; mmPerSec?: number; baseline?: number; mmPerMv?: number; fs?: number } = {}) {
  const { duration = 6, mmPerSec = 25, baseline = 29, mmPerMv = 10, fs = 300 } = opts;
  const n = Math.round(duration * fs);
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / fs;
    let v = spec.extra ? spec.extra(t) : 0;
    for (const e of spec.qrs) if (Math.abs(t - e.t) < 0.7) v += complex(t - e.t, e.m);
    for (const p of spec.p) if (Math.abs(t - p.t) < 0.15) v += p.amp * g(t, p.t, 0.026);
    const y = Math.max(1, Math.min(43, baseline - v * mmPerMv));
    d += `${i === 0 ? "M" : "L"}${(t * mmPerSec).toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

/** Single normal beat for the labelled-waveform diagram. R peak sits at `rAt` seconds. */
export function beatPath(rAt: number, toX: (t: number) => number, toY: (v: number) => number, dur: number) {
  const fs = 400;
  let d = "";
  for (let i = 0; i <= dur * fs; i++) {
    const t = i / fs;
    const v = complex(t - rAt, { ...NORMAL, tCenter: 0.24 }) + 0.15 * g(t, rAt - 0.17, 0.026);
    d += `${i === 0 ? "M" : "L"}${toX(t).toFixed(2)} ${toY(v).toFixed(2)}`;
  }
  return d;
}

/* ================================================================== */
/* EEG                                                                 */
/* ================================================================== */
export const EEG_CHANNELS = ["Fp1–F3", "F3–C3", "C3–P3", "P3–O1"] as const;

export function eegSignals(key: string, fs = 100, dur = 10): number[][] {
  const seed = hash(key);
  const n = Math.round(dur * fs);
  const noises = EEG_CHANNELS.map((_, c) => noiseFn(seed + c * 17, 9, 1, 25));
  const alphaPhase = EEG_CHANNELS.map((_, c) => c * 0.7);
  const alphaAmp = [14, 20, 32, 38];
  const burstEnv = (t: number, spans: [number, number][]) => {
    for (const [a, b] of spans) if (t >= a && t <= b) return Math.min(1, Math.min(t - a, b - t) / 0.12 + 0.05);
    return 0;
  };
  const spikeWave = (t: number, f: number) => {
    const ph = (t * f) % 1;
    const tt = ph / f;
    return 110 * g(tt, 0.03, 0.012) - 70 * g(tt, 0.14, 0.07);
  };
  const out: number[][] = [];
  for (let c = 0; c < 4; c++) {
    const r = rng(seed + 101 * c);
    const arr: number[] = [];
    for (let i = 0; i < n; i++) {
      const t = i / fs;
      const nz = 9 * noises[c](t) + (r() - 0.5) * 3;
      const alpha = alphaAmp[c] * (0.75 + 0.25 * Math.sin(6.283 * 0.5 * t + c)) * Math.sin(6.283 * 10 * t + alphaPhase[c]);
      let v = 0;
      switch (key) {
        case "eeg-alpha": v = alpha + 6 * Math.sin(6.283 * 21 * t + c) + nz; break;
        case "eeg-beta": v = 7 * Math.sin(6.283 * 20 * t + c) + 5 * Math.sin(6.283 * 26 * t + 2 * c) + 4 * Math.sin(6.283 * 15 * t) + nz * 0.55; break;
        case "eeg-theta": v = 32 * Math.sin(6.283 * 6 * t + 0.6 * c) * (0.8 + 0.2 * Math.sin(6.283 * 0.4 * t)) + 7 * Math.sin(6.283 * 11 * t) + nz * 0.7; break;
        case "eeg-delta": v = 70 * Math.sin(6.283 * 2 * t + 0.4 * c) + 25 * Math.sin(6.283 * 1.1 * t + c) + nz * 0.7; break;
        case "eeg-absence-seizure": {
          const inSz = t >= 3.2 && t <= 7.4;
          v = inSz ? spikeWave(t - 3.2, 3) * (0.85 + 0.15 * Math.sin(c + 1)) + nz * 0.25 : alpha * 0.8 + nz * 0.8;
          break;
        }
        case "eeg-tonic-clonic": {
          if (t < 3) v = alpha * 0.8 + nz * 0.8;
          else if (t < 4.6) v = (22 + 55 * Math.min(1, (t - 3) / 0.8)) * Math.sin(6.283 * 17 * t + c) + 14 * Math.sin(6.283 * 31 * t) + nz * 0.4;
          else {
            const cyc = 0.45 + 0.07 * (t - 4.6); // bursts slow down
            const ph = ((t - 4.6) % cyc) / cyc;
            const on = ph < 0.4;
            v = on ? 80 * Math.sin(6.283 * 14 * t + c) * Math.sin((Math.PI * ph) / 0.4) + nz * 0.4 : 12 * Math.sin(6.283 * 2 * t) + nz * 0.3;
          }
          break;
        }
        case "eeg-burst-suppression": {
          const e = burstEnv(t, [[0.6, 1.7], [3.5, 4.5], [6.4, 7.4], [9.0, 10]]);
          v = e * (60 * Math.sin(6.283 * 3 * t + c) + 32 * Math.sin(6.283 * 7 * t) + 24 * Math.sin(6.283 * 17 * t + c)) + (1 - e) * 2.5 * noises[c](t * 3) + (r() - 0.5) * 2;
          break;
        }
        case "eeg-focal-spike": {
          v = alpha * 0.8 + nz * 0.8;
          for (const ts of [1.6, 3.9, 5.2, 7.7, 9.0]) {
            const dt = t - ts;
            const amp = c === 1 ? 1 : c === 0 ? 0.28 : 0;
            if (amp) v += amp * (-150 * g(dt, 0, 0.011) + 55 * g(dt, 0.1, 0.06));
          }
          break;
        }
        default: v = alpha + nz;
      }
      arr.push(v);
    }
    out.push(arr);
  }
  return out;
}

/* ================================================================== */
/* Fetal heart rate                                                    */
/* ================================================================== */
export function fhrSignals(key: string, dur = 600, dt = 2) {
  const seed = hash(key);
  const nv = noiseFn(seed, 6, 0.04, 0.2);
  const nv2 = noiseFn(seed + 5, 5, 0.01, 0.06);
  const peaks = [90, 270, 450];
  const uc = (t: number) => 8 + peaks.reduce((s, p) => s + 62 * g(t, p, 22), 0);
  // contraction "shape" 0..1 for decel timing
  const u = (t: number) => peaks.reduce((s, p) => s + g(t, p, 22), 0);
  const trap = (t: number, start: number, fall: number, hold: number, rise: number, depth: number) => {
    const t1 = start + fall;
    const t2 = t1 + hold;
    const t3 = t2 + rise;
    if (t < start || t > t3) return 0;
    if (t < t1) return -depth * ((t - start) / fall);
    if (t <= t2) return -depth;
    return -depth * (1 - (t - t2) / rise);
  };
  const smooth = (x: number) => x * x * (3 - 2 * x);
  const out: { t: number; fhr: number; uc: number }[] = [];
  for (let t = 0; t <= dur; t += dt) {
    let f = 140;
    switch (key) {
      case "fhr-reassuring": f = 140 + 7 * nv(t) + 4 * nv2(t) + 22 * (g(t, 140, 14) + g(t, 395, 15)); break;
      case "fhr-early-decel": f = 148 + 5 * nv(t) + 3 * nv2(t) - 24 * u(t); break;
      case "fhr-late-decel": f = 150 + 2.5 * nv(t) + 1.5 * nv2(t) - 22 * peaks.reduce((s, p) => s + g(t, p + 38, 26), 0); break;
      case "fhr-variable-decel": {
        f = 146 + 4 * nv(t) + 2 * nv2(t);
        const spec = [{ s: 62, depth: 62, hold: 14 }, { s: 262, depth: 48, hold: 10 }, { s: 436, depth: 70, hold: 18 }];
        for (const d of spec) {
          f += trap(t, d.s, 9, d.hold, 11, d.depth);
          f += 9 * g(t, d.s - 8, 4) + 9 * g(t, d.s + 9 + d.hold + 11 + 8, 4); // shoulders
        }
        break;
      }
      case "fhr-prolonged-decel": {
        f = 142 + 5 * nv(t) + 3 * nv2(t);
        if (t > 190 && t < 470) {
          const x = t < 215 ? (t - 190) / 25 : t > 300 ? 1 - smooth((t - 300) / 170) : 1;
          f -= 62 * (t < 215 ? smooth(x) : x) - 2 * nv2(t);
        }
        break;
      }
      case "fhr-minimal-variability": f = 150 + 1.1 * nv(t); break;
      default: f = 140;
    }
    out.push({ t, fhr: Math.max(60, Math.min(220, f)), uc: uc(t) });
  }
  return out;
}
