/**
 * Catalogue of original, code-generated medical figures (ECG, EEG, fetal monitoring, diagrams).
 * Each `key` is rendered by <MedicalFigure figureKey=... /> and has a matching row of teaching text
 * in lib/seed/content/medical-images.ts. `alt` is both the accessible description and the ground
 * truth of what the drawing shows.
 */
export type FigureKind = "ecg" | "eeg" | "fhr" | "diagram";

export type FigureDef = { key: string; kind: FigureKind; title: string; alt: string };

export const FIGURE_CATEGORIES = [
  "ECG & cardiac rhythms",
  "EEG & neurological testing",
  "Fetal monitoring",
  "Skin, wounds & burns",
  "Procedures & equipment",
] as const;

export const FIGURES: FigureDef[] = [
  // ---------- ECG ----------
  { key: "ecg-waveform-labelled", kind: "diagram", title: "Normal ECG waveform and intervals", alt: "A single normal ECG beat on grid paper with the P wave, PR interval, QRS complex, ST segment, T wave and QT interval labelled." },
  { key: "ecg-normal-sinus", kind: "ecg", title: "Normal sinus rhythm", alt: "Six-second strip: regular rhythm at about 72 beats per minute, one upright P wave before every narrow QRS, PR interval constant." },
  { key: "ecg-sinus-bradycardia", kind: "ecg", title: "Sinus bradycardia", alt: "Six-second strip: regular rhythm at about 48 beats per minute with normal P waves and narrow QRS complexes; beats are widely spaced." },
  { key: "ecg-sinus-tachycardia", kind: "ecg", title: "Sinus tachycardia", alt: "Six-second strip: regular rhythm at about 125 beats per minute with a P wave before each narrow QRS; beats are closely spaced." },
  { key: "ecg-atrial-fibrillation", kind: "ecg", title: "Atrial fibrillation", alt: "Six-second strip: irregularly irregular R-R intervals, no distinct P waves, a quivering fibrillatory baseline, narrow QRS complexes." },
  { key: "ecg-atrial-flutter", kind: "ecg", title: "Atrial flutter", alt: "Six-second strip: regular sawtooth flutter waves at about 300 per minute with a QRS after every fourth flutter wave (4:1 block), ventricular rate about 75." },
  { key: "ecg-svt", kind: "ecg", title: "Supraventricular tachycardia (SVT)", alt: "Six-second strip: very fast, perfectly regular narrow-complex rhythm at about 170 beats per minute with no visible P waves." },
  { key: "ecg-ventricular-tachycardia", kind: "ecg", title: "Ventricular tachycardia", alt: "Six-second strip: fast regular rhythm at about 180 per minute made of wide, bizarre QRS complexes with no visible P waves." },
  { key: "ecg-ventricular-fibrillation", kind: "ecg", title: "Ventricular fibrillation", alt: "Six-second strip: chaotic, irregular, coarse wavy baseline with no identifiable P waves, QRS complexes or T waves." },
  { key: "ecg-torsades", kind: "ecg", title: "Torsades de pointes", alt: "Six-second strip: wide ventricular complexes whose amplitude gradually grows and shrinks in a spindle (twisting-around-the-baseline) pattern." },
  { key: "ecg-asystole", kind: "ecg", title: "Asystole", alt: "Six-second strip: an almost flat line with only slight baseline drift and no electrical activity." },
  { key: "ecg-first-degree-block", kind: "ecg", title: "First-degree AV block", alt: "Six-second strip: regular rhythm at about 70 per minute; every P wave is followed by a QRS but the PR interval is long (about 0.32 s) and constant." },
  { key: "ecg-mobitz-1", kind: "ecg", title: "Second-degree AV block, Mobitz I (Wenckebach)", alt: "Six-second strip: the PR interval lengthens with each beat until a P wave is not followed by a QRS (dropped beat), then the cycle repeats; R-R intervals are grouped." },
  { key: "ecg-mobitz-2", kind: "ecg", title: "Second-degree AV block, Mobitz II", alt: "Six-second strip: constant PR interval on conducted beats with sudden unpredictable dropped QRS complexes (P waves without a QRS)." },
  { key: "ecg-third-degree-block", kind: "ecg", title: "Third-degree (complete) AV block", alt: "Six-second strip: regular P waves at about 80 per minute and a slower regular wide-QRS escape rhythm at about 36 per minute with no relationship between them." },
  { key: "ecg-pvc", kind: "ecg", title: "Premature ventricular contractions (PVCs)", alt: "Six-second strip: underlying sinus rhythm interrupted by early, wide, bizarre QRS complexes with a discordant T wave and no P wave, followed by a pause." },
  { key: "ecg-stemi", kind: "ecg", title: "ST-segment elevation (STEMI pattern)", alt: "Six-second strip: sinus rhythm with marked dome-shaped (tombstone) ST-segment elevation after each QRS." },
  { key: "ecg-st-depression", kind: "ecg", title: "ST-segment depression (ischemia pattern)", alt: "Six-second strip: sinus rhythm with horizontal or downsloping ST-segment depression below the baseline after each QRS." },
  { key: "ecg-hyperkalemia", kind: "ecg", title: "Hyperkalemia ECG changes", alt: "Six-second strip: tall, narrow, peaked T waves, flattened P waves and a widened QRS complex." },
  { key: "ecg-hypokalemia", kind: "ecg", title: "Hypokalemia ECG changes", alt: "Six-second strip: ST-segment depression, flattened T waves and a prominent U wave following the T wave." },
  { key: "ecg-paced", kind: "ecg", title: "Ventricular paced rhythm", alt: "Six-second strip: regular sharp vertical pacemaker spikes, each immediately followed by a wide QRS complex." },

  // ---------- EEG ----------
  { key: "eeg-alpha", kind: "eeg", title: "Normal awake EEG (alpha rhythm)", alt: "Ten-second four-channel EEG: regular rhythmic activity at about 10 cycles per second of moderate amplitude, strongest over the back channels." },
  { key: "eeg-beta", kind: "eeg", title: "Beta activity", alt: "Ten-second four-channel EEG: low-amplitude, fast activity at about 20 cycles per second." },
  { key: "eeg-theta", kind: "eeg", title: "Theta activity", alt: "Ten-second four-channel EEG: slower rhythmic activity at about 6 cycles per second of moderate amplitude." },
  { key: "eeg-delta", kind: "eeg", title: "Delta activity", alt: "Ten-second four-channel EEG: slow, high-amplitude waves at about 2 cycles per second." },
  { key: "eeg-absence-seizure", kind: "eeg", title: "Absence seizure (3-Hz spike-and-wave)", alt: "Ten-second four-channel EEG: normal background, then a sudden generalized burst of 3-per-second spike-and-wave complexes on all channels, then abrupt return to normal." },
  { key: "eeg-tonic-clonic", kind: "eeg", title: "Generalized tonic-clonic seizure", alt: "Ten-second four-channel EEG: normal background, then high-amplitude rapid polyspike activity on all channels that evolves into slower rhythmic bursts." },
  { key: "eeg-burst-suppression", kind: "eeg", title: "Burst-suppression pattern", alt: "Ten-second four-channel EEG: alternating high-amplitude bursts and nearly flat (suppressed) periods on all channels." },
  { key: "eeg-focal-spike", kind: "eeg", title: "Focal epileptiform spikes", alt: "Ten-second four-channel EEG: normal background with repeated sharp spikes confined to one side-channel (focal) and not seen on the other channels." },

  // ---------- Fetal monitoring ----------
  { key: "fhr-reassuring", kind: "fhr", title: "Reassuring fetal heart rate (Category I)", alt: "Ten-minute fetal heart rate tracing above a uterine contraction tracing: baseline about 140 bpm with moderate variability and two accelerations, no decelerations." },
  { key: "fhr-early-decel", kind: "fhr", title: "Early decelerations", alt: "Fetal heart rate drops gradually and returns gradually, mirroring each contraction; the lowest point lines up with the contraction peak." },
  { key: "fhr-late-decel", kind: "fhr", title: "Late decelerations", alt: "Fetal heart rate drops gradually after each contraction begins; the lowest point comes after the contraction peak and recovery is delayed." },
  { key: "fhr-variable-decel", kind: "fhr", title: "Variable decelerations", alt: "Abrupt V- or U-shaped drops in fetal heart rate whose timing, depth and shape vary from one contraction to the next, often with small shoulders." },
  { key: "fhr-prolonged-decel", kind: "fhr", title: "Prolonged deceleration", alt: "A single deep drop of the fetal heart rate lasting several minutes before slowly returning to baseline." },
  { key: "fhr-minimal-variability", kind: "fhr", title: "Absent / minimal variability", alt: "A flat fetal heart rate baseline near 150 bpm with almost no beat-to-beat variability and no accelerations." },

  // ---------- Skin, wounds & burns / procedures (diagrams) ----------
  { key: "diagram-conduction-system", kind: "diagram", title: "Cardiac conduction system", alt: "Schematic of the heart with the SA node, AV node, bundle of His, left and right bundle branches and Purkinje fibers labelled." },
  { key: "diagram-pressure-injury-stages", kind: "diagram", title: "Pressure injury stages 1–4", alt: "Four side-by-side skin cross-sections showing stage 1 non-blanchable redness, stage 2 partial-thickness blister, stage 3 full-thickness loss into fat, stage 4 loss exposing muscle and bone." },
  { key: "diagram-burn-depth", kind: "diagram", title: "Burn depth classification", alt: "Three skin cross-sections showing superficial (epidermis only), partial-thickness (into the dermis) and full-thickness (through the dermis into subcutaneous tissue) burns." },
  { key: "diagram-chest-drainage", kind: "diagram", title: "Three-chamber chest drainage system", alt: "Schematic of a chest drainage unit from the patient to a collection chamber, a water-seal chamber and a suction-control chamber, with the air-leak bubbling and tidaling points marked." },
];

export const FIGURE_BY_KEY = Object.fromEntries(FIGURES.map((f) => [f.key, f])) as Record<string, FigureDef>;
