import type { ReactNode } from "react";
import { FIGURE_BY_KEY } from "@/lib/medical-figures/registry";
import { EEG_CHANNELS, beatPath, ecgPath, ecgSpec, eegSignals, fhrSignals } from "@/lib/medical-figures/signals";

/**
 * Original vector medical figures, generated in code (no third-party images, no licensing issues).
 * Pure SVG with no hooks, so it renders on the server and in client components alike.
 * Rendered on light "paper" so tracings keep their familiar look in dark mode too.
 */
export function MedicalFigure({ figureKey, compact = false, className = "" }: { figureKey: string; compact?: boolean; className?: string }) {
  const def = FIGURE_BY_KEY[figureKey];
  if (!def) return null;
  const common = { alt: def.alt, className };
  switch (def.kind) {
    case "ecg": return <EcgStrip k={figureKey} compact={compact} {...common} />;
    case "eeg": return <EegTrace k={figureKey} compact={compact} {...common} />;
    case "fhr": return <FhrTrace k={figureKey} compact={compact} {...common} />;
    default: return <Diagram k={figureKey} {...common} />;
  }
}

type P = { k: string; alt: string; className?: string; compact?: boolean };

/* ---------------------------------------------------------------- */
function Frame({ vb, alt, className, children }: { vb: string; alt: string; className?: string; children: ReactNode }) {
  return (
    <svg viewBox={vb} role="img" aria-label={alt} className={`block h-auto w-full ${className ?? ""}`} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* ECG                                                               */
/* ---------------------------------------------------------------- */
function EcgStrip({ k, alt, className, compact }: P) {
  const d = ecgPath(ecgSpec(k), { fs: compact ? 150 : 300 });
  const id = `ecg-${k}`;
  return (
    <Frame vb="0 0 150 44" alt={alt} className={className}>
      <defs>
        <pattern id={`${id}-s`} width="1" height="1" patternUnits="userSpaceOnUse">
          <path d="M1 0H0V1" fill="none" stroke="#f3c6c1" strokeWidth="0.09" />
        </pattern>
        <pattern id={`${id}-b`} width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill={`url(#${id}-s)`} />
          <path d="M5 0H0V5" fill="none" stroke="#e58f88" strokeWidth="0.22" />
        </pattern>
      </defs>
      <rect width="150" height="44" fill="#fff8f6" />
      <rect width="150" height="44" fill={`url(#${id}-b)`} />
      <path d={d} fill="none" stroke="#161616" strokeWidth="0.42" strokeLinejoin="round" strokeLinecap="round" />
      {!compact && (
        <g fontSize="2.6" fill="#8a4b46" fontFamily="inherit">
          <text x="1.5" y="4">Lead II</text>
          <text x="148.5" y="42" textAnchor="end">25 mm/s · 10 mm/mV</text>
        </g>
      )}
    </Frame>
  );
}

/* ---------------------------------------------------------------- */
/* EEG                                                               */
/* ---------------------------------------------------------------- */
function EegTrace({ k, alt, className, compact }: P) {
  const fs = compact ? 60 : 100;
  const sig = eegSignals(k, fs, 10);
  const x0 = 24;
  const perSec = 11.4;
  const rowY = [14, 31, 48, 65];
  const scale = 0.085; // units per µV
  const paths = sig.map((ch, c) =>
    ch.map((v, i) => `${i === 0 ? "M" : "L"}${(x0 + (i / fs) * perSec).toFixed(1)} ${(rowY[c] - Math.max(-8.4, Math.min(8.4, v * scale))).toFixed(1)}`).join(""),
  );
  return (
    <Frame vb="0 0 150 80" alt={alt} className={className}>
      <rect width="150" height="80" fill="#fbfcff" />
      {Array.from({ length: 11 }, (_, s) => (
        <line key={s} x1={x0 + s * perSec} x2={x0 + s * perSec} y1="4" y2="72" stroke="#d6def0" strokeWidth="0.2" />
      ))}
      {paths.map((d, c) => (
        <g key={c}>
          <path d={d} fill="none" stroke="#1b1f2a" strokeWidth="0.3" strokeLinejoin="round" />
          {!compact && (
            <text x="2" y={rowY[c] + 1} fontSize="3" fill="#44506b" fontFamily="inherit">
              {EEG_CHANNELS[c]}
            </text>
          )}
        </g>
      ))}
      {!compact && (
        <g fontSize="2.6" fill="#44506b" fontFamily="inherit">
          {Array.from({ length: 11 }, (_, s) => (
            <text key={s} x={x0 + s * perSec} y="77" textAnchor="middle">{s}</text>
          ))}
          <text x="148" y="72.5" textAnchor="end">seconds</text>
          <line x1="146.5" x2="146.5" y1="5" y2={5 + 50 * scale} stroke="#44506b" strokeWidth="0.5" />
          <text x="149" y={11 + 50 * scale} textAnchor="end">50 µV</text>
        </g>
      )}
    </Frame>
  );
}

/* ---------------------------------------------------------------- */
/* Fetal heart rate + contractions                                   */
/* ---------------------------------------------------------------- */
function FhrTrace({ k, alt, className, compact }: P) {
  const pts = fhrSignals(k);
  const x = (t: number) => 14 + (t / 600) * 132;
  const yF = (b: number) => 58 - ((b - 80) / 120) * 52;
  const yU = (m: number) => 90 - (m / 100) * 24;
  const fhr = pts.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)} ${yF(p.fhr).toFixed(1)}`).join("");
  const uc = pts.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)} ${yU(p.uc).toFixed(1)}`).join("");
  return (
    <Frame vb="0 0 150 100" alt={alt} className={className}>
      <rect width="150" height="100" fill="#fbfdfb" />
      <rect x="14" y={yF(160)} width="132" height={yF(110) - yF(160)} fill="#dff3e3" opacity="0.8" />
      {[100, 120, 140, 160, 180].map((b) => (
        <g key={b}>
          <line x1="14" x2="146" y1={yF(b)} y2={yF(b)} stroke="#cfd8d1" strokeWidth="0.2" />
          {!compact && <text x="12.5" y={yF(b) + 1} fontSize="2.8" textAnchor="end" fill="#4a5b4f" fontFamily="inherit">{b}</text>}
        </g>
      ))}
      {Array.from({ length: 11 }, (_, m) => (
        <line key={m} x1={x(m * 60)} x2={x(m * 60)} y1="6" y2="90" stroke="#dfe6e0" strokeWidth="0.2" />
      ))}
      <line x1="14" x2="146" y1="62" y2="62" stroke="#9aa89d" strokeWidth="0.3" />
      <path d={fhr} fill="none" stroke="#c0261f" strokeWidth="0.55" strokeLinejoin="round" />
      <path d={uc} fill="none" stroke="#1b4f9c" strokeWidth="0.55" strokeLinejoin="round" />
      {!compact && (
        <g fontSize="2.8" fill="#4a5b4f" fontFamily="inherit">
          <text x="15" y="9.5" fill="#c0261f">FHR (bpm) · shaded band = 110–160</text>
          <text x="15" y="70" fill="#1b4f9c">Uterine contractions (mmHg)</text>
          {Array.from({ length: 6 }, (_, m) => (
            <text key={m} x={x(m * 120)} y="97" textAnchor={m === 5 ? "end" : "middle"}>{m * 2} min</text>
          ))}
        </g>
      )}
    </Frame>
  );
}

/* ---------------------------------------------------------------- */
/* Diagrams                                                          */
/* ---------------------------------------------------------------- */
function Diagram({ k, alt, className }: P) {
  switch (k) {
    case "ecg-waveform-labelled": return <WaveformDiagram alt={alt} className={className} />;
    case "diagram-conduction-system": return <ConductionDiagram alt={alt} className={className} />;
    case "diagram-pressure-injury-stages": return <PressureDiagram alt={alt} className={className} />;
    case "diagram-burn-depth": return <BurnDiagram alt={alt} className={className} />;
    case "diagram-chest-drainage": return <ChestDrainDiagram alt={alt} className={className} />;
    default: return null;
  }
}
type D = { alt: string; className?: string };

function WaveformDiagram({ alt, className }: D) {
  const X = (t: number) => 14 + t * 150;
  const base = 78;
  const Y = (v: number) => base - v * 46;
  const d = beatPath(0.32, X, Y, 0.95);
  const lbl = { fontSize: 5.2, fill: "currentColor", fontFamily: "inherit" } as const;
  const bracket = (t1: number, t2: number, y: number, text: string, color: string) => (
    <g>
      <line x1={X(t1)} x2={X(t2)} y1={y} y2={y} stroke={color} strokeWidth="1" />
      <line x1={X(t1)} x2={X(t1)} y1={y - 2} y2={y + 2} stroke={color} strokeWidth="1" />
      <line x1={X(t2)} x2={X(t2)} y1={y - 2} y2={y + 2} stroke={color} strokeWidth="1" />
      <text x={(X(t1) + X(t2)) / 2} y={y + 7} textAnchor="middle" fontSize="4.6" fill={color} fontFamily="inherit" fontWeight="600">{text}</text>
    </g>
  );
  return (
    <Frame vb="0 0 170 132" alt={alt} className={className}>
      <rect width="170" height="132" fill="#fff8f6" rx="3" />
      {Array.from({ length: 34 }, (_, i) => <line key={`v${i}`} x1={i * 5} x2={i * 5} y1="0" y2="120" stroke="#f0c4bf" strokeWidth={i % 5 === 0 ? 0.35 : 0.15} />)}
      {Array.from({ length: 27 }, (_, i) => <line key={`h${i}`} y1={i * 5} y2={i * 5} x1="0" x2="170" stroke="#f0c4bf" strokeWidth={i % 5 === 0 ? 0.35 : 0.15} />)}
      <path d={d} fill="none" stroke="#161616" strokeWidth="0.9" strokeLinejoin="round" />
      <g {...lbl} fill="#161616" fontWeight="700">
        <text x={X(0.15)} y={Y(0.18) - 3} textAnchor="middle">P</text>
        <text x={X(0.296)} y={Y(-0.16) + 6} textAnchor="middle">Q</text>
        <text x={X(0.32)} y={Y(1.1) - 3} textAnchor="middle">R</text>
        <text x={X(0.355) + 1} y={Y(-0.22) + 6} textAnchor="middle">S</text>
        <text x={X(0.56)} y={Y(0.34) - 3} textAnchor="middle">T</text>
      </g>
      {bracket(0.1, 0.285, 106, "PR interval", "#1d4ed8")}
      {bracket(0.285, 0.375, 96, "QRS", "#b91c1c")}
      {bracket(0.375, 0.45, 106, "ST segment", "#047857")}
      {bracket(0.285, 0.67, 120, "QT interval", "#7c3aed")}
      <g fontSize="4.2" fill="#6b3b36" fontFamily="inherit">
        <text x="166" y="9" textAnchor="end">PR 0.12–0.20 s · QRS &lt; 0.12 s</text>
        <text x="166" y="15" textAnchor="end">1 small box = 0.04 s</text>
      </g>
    </Frame>
  );
}

function ConductionDiagram({ alt, className }: D) {
  const stroke = "currentColor";
  const marker = (n: number, x: number, y: number) => (
    <g>
      <circle cx={x} cy={y} r="5.2" fill="#fff" stroke="#92400e" strokeWidth="1" />
      <text x={x} y={y + 2} textAnchor="middle" fontSize="6" fontWeight="700" fill="#92400e" fontFamily="inherit">{n}</text>
    </g>
  );
  const legend: [number, string, string][] = [
    [1, "SA node", "Natural pacemaker, 60–100/min"],
    [2, "Atrial pathways", "Impulse spreads; atria contract"],
    [3, "AV node", "Delays impulse ~0.1 s; 40–60/min"],
    [4, "Bundle of His", "Carries impulse into the septum"],
    [5, "Bundle branches", "Right and left, down the septum"],
    [6, "Purkinje fibers", "Ventricles contract; 20–40/min"],
  ];
  return (
    <Frame vb="0 0 310 150" alt={alt} className={className}>
      <rect x="38" y="20" width="56" height="46" rx="16" fill="#bcd5fb" stroke={stroke} strokeOpacity=".5" />
      <rect x="106" y="20" width="56" height="46" rx="16" fill="#f7bcbc" stroke={stroke} strokeOpacity=".5" />
      <rect x="34" y="70" width="64" height="64" rx="22" fill="#9cc0f7" stroke={stroke} strokeOpacity=".5" />
      <rect x="102" y="70" width="72" height="68" rx="24" fill="#f1a0a0" stroke={stroke} strokeOpacity=".5" />
      <g fontSize="7" fill={stroke} opacity=".55" fontFamily="inherit" fontWeight="600">
        <text x="66" y="62" textAnchor="middle">RA</text>
        <text x="134" y="62" textAnchor="middle">LA</text>
        <text x="66" y="130" textAnchor="middle">RV</text>
        <text x="138" y="132" textAnchor="middle">LV</text>
      </g>
      {/* conduction pathway */}
      <g fill="none" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round">
        <path d="M54 30 C 70 34 86 48 98 64" strokeDasharray="3 2" />
        <path d="M100 70 L100 90" strokeWidth="2.6" />
        <path d="M100 90 L70 116 M100 90 L132 116" />
        <path d="M70 116 L50 124 M70 116 L62 130 M70 116 L80 130 M132 116 L152 126 M132 116 L140 134 M132 116 L120 132 M132 116 L162 108" strokeWidth="1.2" />
        <path d="M58 30 C 80 22 108 22 126 28" strokeDasharray="3 2" strokeWidth="1.2" />
      </g>
      <circle cx="54" cy="30" r="4.2" fill="#facc15" stroke="#92400e" strokeWidth="1" />
      <circle cx="100" cy="66" r="4.2" fill="#fb923c" stroke="#92400e" strokeWidth="1" />
      {marker(1, 44, 22)}
      {marker(2, 82, 44)}
      {marker(3, 112, 60)}
      {marker(4, 114, 82)}
      {marker(5, 82, 108)}
      {marker(6, 160, 122)}
      <g fontFamily="inherit">
        {legend.map(([n, h, t], i) => (
          <g key={n} transform={`translate(190 ${22 + i * 21})`}>
            <circle cx="5" cy="3" r="5.2" fill="#fff" stroke="#92400e" strokeWidth="1" />
            <text x="5" y="5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#92400e">{n}</text>
            <text x="15" y="2" fontSize="6" fontWeight="700" fill={stroke}>{h}</text>
            <text x="15" y="10" fontSize="5" fill={stroke} opacity=".75">{t}</text>
          </g>
        ))}
      </g>
    </Frame>
  );
}

/** Shared skin cross-section: epidermis / dermis / fat / muscle / bone, with an optional crater. */
function SkinPanel({ x, w, crater, tint, blister, children }: { x: number; w: number; crater?: { depth: number; wide: number; bed: string }; tint?: string; blister?: boolean; children?: ReactNode }) {
  const cx = x + w / 2;
  const layers: [number, number, string][] = [[0, 4, "#f0a98f"], [4, 16, "#f5c3ae"], [16, 38, "#fde68a"], [38, 58, "#e07a7a"], [58, 68, "#f1ebe0"]];
  return (
    <g>
      {layers.map(([a, b, f], i) => <rect key={i} x={x} y={18 + a} width={w} height={b - a} fill={f} />)}
      <rect x={x} y="18" width={w} height="50" fill="none" stroke="currentColor" strokeOpacity=".35" />
      {tint && <rect x={cx - w * 0.28} y="18" width={w * 0.56} height="4" fill={tint} />}
      {blister && <path d={`M${cx - 9} 18 Q ${cx} 5 ${cx + 9} 18 Z`} fill="#fde8e0" stroke="#c58a7a" strokeWidth=".8" />}
      {crater && (
        <path
          d={`M${cx - crater.wide} 18 Q ${cx - crater.wide + 2} ${18 + crater.depth} ${cx} ${18 + crater.depth} Q ${cx + crater.wide - 2} ${18 + crater.depth} ${cx + crater.wide} 18 Z`}
          fill={crater.bed}
          stroke="#7f1d1d"
          strokeWidth=".8"
        />
      )}
      {children}
    </g>
  );
}

function SkinLegend() {
  const items: [string, number][] = [["Epidermis", 20], ["Dermis", 29], ["Fat", 45], ["Muscle", 59], ["Bone", 66]];
  return (
    <g fontSize="4.6" fill="currentColor" fontFamily="inherit" opacity=".85">
      {items.map(([t, y]) => <text key={t} x="2" y={y + 1.5}>{t}</text>)}
    </g>
  );
}

function PanelCaption({ x, w, title, lines }: { x: number; w: number; title: string; lines: string[] }) {
  return (
    <g fontFamily="inherit" textAnchor="middle" fill="currentColor">
      <text x={x + w / 2} y="81" fontSize="6" fontWeight="700">{title}</text>
      {lines.map((l, i) => <text key={i} x={x + w / 2} y={88 + i * 5.6} fontSize="4.6" opacity=".8">{l}</text>)}
    </g>
  );
}

function PressureDiagram({ alt, className }: D) {
  const xs = [34, 86, 138, 190];
  const w = 46;
  return (
    <Frame vb="0 0 240 112" alt={alt} className={className}>
      <SkinLegend />
      <SkinPanel x={xs[0]} w={w} tint="#dc2626" />
      <SkinPanel x={xs[1]} w={w} crater={{ depth: 8, wide: 9, bed: "#f7b3b3" }} blister />
      <SkinPanel x={xs[2]} w={w} crater={{ depth: 24, wide: 13, bed: "#f4a3a3" }} />
      <SkinPanel x={xs[3]} w={w} crater={{ depth: 46, wide: 15, bed: "#e58a8a" }}>
        <rect x={xs[3] + w / 2 - 9} y="58" width="18" height="6" rx="2" fill="#fffaf0" stroke="#8a7f6a" strokeWidth=".7" />
      </SkinPanel>
      <PanelCaption x={xs[0]} w={w} title="Stage 1" lines={["Intact skin, red", "Does not blanch"]} />
      <PanelCaption x={xs[1]} w={w} title="Stage 2" lines={["Partial thickness", "Blister / shallow open"]} />
      <PanelCaption x={xs[2]} w={w} title="Stage 3" lines={["Full thickness", "Fat visible"]} />
      <PanelCaption x={xs[3]} w={w} title="Stage 4" lines={["Muscle, tendon", "or bone exposed"]} />
    </Frame>
  );
}

function BurnDiagram({ alt, className }: D) {
  const xs = [34, 106, 178];
  const w = 60;
  return (
    <Frame vb="0 0 250 112" alt={alt} className={className}>
      <SkinLegend />
      <SkinPanel x={xs[0]} w={w} tint="#ef4444" />
      <SkinPanel x={xs[1]} w={w} blister tint="#ef4444">
        <rect x={xs[1] + 6} y="22" width={w - 12} height="12" fill="#f28b82" opacity=".55" />
      </SkinPanel>
      <SkinPanel x={xs[2]} w={w}>
        <rect x={xs[2]} y="18" width={w} height="20" fill="#cbc5bd" />
        <path d={`M${xs[2]} 18 L${xs[2] + w} 18`} stroke="#4b4540" strokeWidth="2" />
        <path d={`M${xs[2] + 10} 22 l6 8 M${xs[2] + 30} 20 l-4 10 M${xs[2] + 46} 22 l5 9`} stroke="#6b6259" strokeWidth=".9" />
      </SkinPanel>
      <PanelCaption x={xs[0]} w={w} title="Superficial (1st)" lines={["Epidermis only", "Red, dry, painful"]} />
      <PanelCaption x={xs[1]} w={w} title="Partial (2nd)" lines={["Into the dermis", "Blisters, very painful"]} />
      <PanelCaption x={xs[2]} w={w} title="Full (3rd)" lines={["Through the dermis", "Leathery, little pain"]} />
    </Frame>
  );
}

function ChestDrainDiagram({ alt, className }: D) {
  const c = "currentColor";
  const ch = (x: number) => ({ x, y: 40, width: 40, height: 84 });
  const items: [string, string, string][] = [
    ["1", "Collection chamber", "Drainage collects here. Mark level, time and colour each shift."],
    ["2", "Water-seal chamber", "One-way seal; water rises and falls with breathing (tidaling). Constant bubbling = air leak."],
    ["3", "Suction-control chamber", "Suction set by water level, usually –20 cm H₂O. Gentle bubbling is expected."],
  ];
  const wrap = (s: string, n: number) => {
    const words = s.split(" ");
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > n) { lines.push(cur.trim()); cur = w; } else cur += " " + w;
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  };
  return (
    <Frame vb="0 0 320 150" alt={alt} className={className}>
      {/* tubing */}
      <g fill="none" stroke={c} strokeOpacity=".8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22 H26 V40" />
        <path d="M46 40 V30 H74 V40" strokeWidth="1.6" />
        <path d="M90 40 V30 H122 V40" strokeWidth="1.6" />
        <path d="M142 40 V24 H174" strokeWidth="1.6" />
      </g>
      <text x="4" y="16" fontSize="5.4" fill={c} fontFamily="inherit">From patient&apos;s chest</text>
      <text x="178" y="24" fontSize="5.4" fill={c} fontFamily="inherit">To suction source</text>
      {/* collection */}
      <g>
        <rect {...ch(14)} rx="5" fill="#eef2f7" stroke={c} strokeOpacity=".6" />
        <rect x="15" y="86" width="38" height="37" rx="4" fill="#e8908a" opacity=".85" />
        {[50, 62, 74, 86, 98, 110].map((y) => <line key={y} x1="14" x2="22" y1={y} y2={y} stroke={c} strokeOpacity=".5" strokeWidth=".7" />)}
      </g>
      {/* water seal */}
      <g>
        <rect {...ch(62)} rx="5" fill="#eef2f7" stroke={c} strokeOpacity=".6" />
        <rect x="63" y="104" width="38" height="19" rx="4" fill="#8cc4f0" opacity=".9" />
        <line x1="62" x2="102" y1="104" y2="104" stroke="#1d4ed8" strokeWidth=".9" strokeDasharray="2 1.5" />
        <text x="82" y="100" textAnchor="middle" fontSize="4.6" fill="#1d4ed8" fontFamily="inherit">2 cm</text>
        {[[76, 96], [84, 90], [80, 82], [88, 76]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="none" stroke="#1d4ed8" strokeWidth=".8" />)}
        <path d="M94 108 v8 M92 111 l2 -3 l2 3 M92 113 l2 3 l2 -3" stroke="#1d4ed8" strokeWidth=".8" fill="none" />
      </g>
      {/* suction control */}
      <g>
        <rect {...ch(110)} rx="5" fill="#eef2f7" stroke={c} strokeOpacity=".6" />
        <rect x="111" y="70" width="38" height="53" rx="4" fill="#8cc4f0" opacity=".9" />
        <line x1="110" x2="150" y1="70" y2="70" stroke="#1d4ed8" strokeWidth=".9" strokeDasharray="2 1.5" />
        <text x="130" y="66" textAnchor="middle" fontSize="4.6" fill="#1d4ed8" fontFamily="inherit">–20 cm</text>
        {[[122, 78], [130, 72], [138, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill="none" stroke="#1d4ed8" strokeWidth=".8" />)}
      </g>
      {[38, 86, 134].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="132" r="5" fill="#fff" stroke="#92400e" strokeWidth="1" />
          <text x={x} y="134" textAnchor="middle" fontSize="6" fontWeight="700" fill="#92400e" fontFamily="inherit">{i + 1}</text>
        </g>
      ))}
      {items.map(([n, h, t], i) => (
        <g key={n} transform={`translate(176 ${44 + i * 33})`} fontFamily="inherit" fill={c}>
          <text x="0" y="0" fontSize="6" fontWeight="700">{n}. {h}</text>
          {wrap(t, 40).map((l, j) => <text key={j} x="0" y={7 + j * 5.6} fontSize="4.8" opacity=".8">{l}</text>)}
        </g>
      ))}
    </Frame>
  );
}
