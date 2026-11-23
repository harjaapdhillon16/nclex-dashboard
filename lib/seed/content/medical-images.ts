export type SeedMedicalImage = { key: string; exam: string; category: string; title: string; summary: string; body: string; tags: string[] };

const ECG = "ECG & cardiac rhythms";
const EEG = "EEG & neurological testing";
const FHR = "Fetal monitoring";

export const MEDICAL_IMAGES: SeedMedicalImage[] = [
  {
    key: "ecg-waveform-labelled",
    exam: "nclex-rn",
    category: ECG,
    title: "Normal ECG waveform and intervals",
    summary: "One normal beat with each wave and interval labelled; the baseline for reading every rhythm strip.",
    tags: ["ecg basics", "waveform", "intervals"],
    body: `## What you are seeing
A single normal heartbeat drawn on ECG grid paper. Each part of the tracing matches an electrical event: atrial depolarization, the pause at the AV node, ventricular depolarization and ventricular recovery.

## Key parts
- **P wave:** atrial depolarization (the atria contract). Small, rounded and upright.
- **PR interval:** start of the P wave to start of the QRS; time for the impulse to cross the atria and AV node. Normal 0.12 to 0.20 seconds (3 to 5 small squares).
- **QRS complex:** ventricular depolarization (the ventricles contract). Normal width is under 0.12 seconds (less than 3 small squares).
- **ST segment:** the flat stretch between the QRS and the T wave, early ventricular recovery. It should sit at the baseline; elevation or depression suggests injury or ischemia.
- **T wave:** ventricular repolarization (resetting). Normally upright and rounded.
- **QT interval:** start of the QRS to the end of the T wave; total ventricular depolarization plus repolarization. A prolonged QT raises the risk of torsades de pointes.
- **Grid:** one small square is 0.04 seconds; one large square is 0.20 seconds.

## Common causes
Abnormal waves usually come from electrolyte shifts (potassium, calcium, magnesium), ischemia, conduction disease, drug effects (antiarrhythmics, some antipsychotics and antibiotics) or lead and electrode problems.

## Nursing priorities
1. Always assess the patient (level of consciousness, pulse, blood pressure, symptoms) before reacting to the tracing.
2. Check that electrodes are placed correctly and skin is prepared, so artifact is not mistaken for a rhythm.
3. Use a systematic approach: rate, regularity, P waves, PR interval, QRS width, then ST and T changes.
4. Measure intervals on a clear strip and compare with the baseline.
5. Report new changes to the provider and document with the strip.

## Exam tip
> Remember the order **P-QRS-T**: P = atria fire, QRS = ventricles fire, T = ventricles reset. Normal PR 0.12 to 0.20 s, QRS under 0.12 s.`,
  },
  {
    key: "ecg-normal-sinus",
    exam: "nclex-rn",
    category: ECG,
    title: "Normal sinus rhythm",
    summary: "A regular rhythm of about 72 bpm with a P wave before every narrow QRS; the reference pattern for comparison.",
    tags: ["ecg", "normal", "sinus rhythm"],
    body: `## What you are seeing
A six-second strip with evenly spaced beats at about 72 per minute. Each beat has an upright P wave, then a narrow QRS, then a T wave. The impulse starts in the SA node and travels the normal pathway.

## How to recognise it
- **Rate:** 60 to 100 beats per minute (about 72 here).
- **Regularity:** R-R intervals are regular.
- **P waves:** one upright P wave before every QRS, all with the same shape.
- **PR interval:** constant, 0.12 to 0.20 seconds.
- **QRS:** narrow, under 0.12 seconds.

## Common causes
This is the normal rhythm of a healthy heart. A patient can still be unwell with a normal-looking rhythm, for example in early shock or with a pulseless electrical activity pattern that looks organized, so the pulse matters.

## Nursing priorities
1. Confirm the monitor reading by checking the patient's apical or radial pulse and blood pressure.
2. Treat the patient, not the monitor: assess for symptoms such as chest pain, dyspnea or dizziness even when the rhythm is normal.
3. Keep electrodes secure and replace them on schedule to prevent artifact.
4. Document rate, rhythm and intervals per unit routine and with any change in condition.
5. Compare future strips against this baseline.

## Exam tip
> Use the "five checks" for every strip: **rate, regular, P before each QRS, PR constant, QRS narrow**. If all five are normal, it is normal sinus rhythm.`,
  },
  {
    key: "ecg-sinus-bradycardia",
    exam: "nclex-rn",
    category: ECG,
    title: "Sinus bradycardia",
    summary: "A regular, slow rhythm near 48 bpm with normal P waves; matters when it reduces cardiac output.",
    tags: ["ecg", "bradycardia", "arrhythmia"],
    body: `## What you are seeing
A regular rhythm with widely spaced beats at about 48 per minute. Every beat still has a normal P wave and a narrow QRS, so the impulse comes from the SA node but fires slowly.

## How to recognise it
- **Rate:** under 60 beats per minute (about 48 here).
- **Regularity:** regular.
- **P waves:** present, upright, one per QRS.
- **PR interval:** normal and constant.
- **QRS:** narrow.

## Common causes
- Physical fitness and sleep (often normal and harmless)
- Beta blockers, calcium channel blockers, digoxin and other drugs
- Increased vagal tone: vomiting, straining, suctioning
- Hypothermia, hypothyroidism and increased intracranial pressure
- Inferior myocardial infarction

## Nursing priorities
1. Assess the patient: blood pressure, level of consciousness, chest pain, dyspnea, perfusion. Slow rates are only a problem if the patient is symptomatic.
2. If unstable (hypotension, confusion, chest pain, shock), call for help and prepare for treatment per ACLS: atropine, then pacing or an infusion such as dopamine or epinephrine.
3. Place the patient on oxygen if hypoxemic and keep IV access.
4. Review and hold medications that slow the heart, and notify the provider.
5. Stable patients: monitor, treat the cause and avoid vagal triggers.

## Exam tip
> **Slow does not always mean treat.** Look at the patient first. First-line drug for symptomatic bradycardia is atropine.`,
  },
  {
    key: "ecg-sinus-tachycardia",
    exam: "nclex-rn",
    category: ECG,
    title: "Sinus tachycardia",
    summary: "A regular, fast rhythm near 125 bpm with a P wave before each QRS; usually a response to another problem.",
    tags: ["ecg", "tachycardia", "arrhythmia"],
    body: `## What you are seeing
A regular rhythm with closely spaced beats at about 125 per minute. Each beat has a P wave and a narrow QRS. The SA node is firing faster than normal, usually in response to a demand.

## How to recognise it
- **Rate:** over 100 beats per minute, typically 100 to 150 (about 125 here).
- **Regularity:** regular.
- **P waves:** present, upright, before every QRS; may merge into the preceding T wave at faster rates.
- **PR interval:** normal and constant.
- **QRS:** narrow.

## Common causes
- Pain, anxiety, fever and exercise
- Hypovolemia, hemorrhage and shock
- Hypoxia, heart failure, pulmonary embolism
- Stimulants such as caffeine, nicotine, albuterol and decongestants
- Hyperthyroidism, anemia and withdrawal states

## Nursing priorities
1. Assess the patient: blood pressure, oxygen saturation, temperature, pain, mental status and bleeding.
2. Look for and treat the underlying cause (give fluids for hypovolemia, oxygen for hypoxia, analgesia for pain, antipyretics for fever).
3. Do not try to slow the heart directly; this is a compensatory rhythm.
4. Report unexplained or persistent tachycardia, especially with chest pain or hypotension.
5. Document the rate, associated symptoms and response to interventions.

## Exam tip
> **Sinus tach is a sign, not a diagnosis.** Always hunt for the cause: think pain, fever, fluids low, oxygen low (the "4 Fs" of causes).`,
  },
  {
    key: "ecg-atrial-fibrillation",
    exam: "nclex-rn",
    category: ECG,
    title: "Atrial fibrillation",
    summary: "An irregularly irregular rhythm with no P waves and a quivering baseline; raises stroke risk.",
    tags: ["ecg", "atrial fibrillation", "stroke risk", "arrhythmia"],
    body: `## What you are seeing
A strip with R-R intervals that vary from beat to beat with no pattern. There are no distinct P waves, only a quivering (fibrillatory) baseline. The QRS complexes are narrow because ventricular conduction is normal. Chaotic atrial activity means the atria do not contract effectively.

## How to recognise it
- **Rate:** atrial rate 350 to 600; ventricular rate variable (controlled below 100, uncontrolled above 100).
- **Regularity:** irregularly irregular.
- **P waves:** absent, replaced by fibrillatory waves.
- **PR interval:** not measurable.
- **QRS:** narrow (under 0.12 seconds).

## Common causes
- Hypertension, heart failure, coronary artery disease and valve disease
- Hyperthyroidism, alcohol use and sleep apnea
- Older age, post-cardiac surgery, pulmonary disease and electrolyte problems

## Nursing priorities
1. Assess the patient: blood pressure, symptoms, apical pulse for a full minute; check for pulse deficit (apical greater than radial).
2. If unstable (hypotension, chest pain, shock, acute heart failure), call for help and prepare for synchronized cardioversion.
3. If stable, anticipate rate control (beta blockers, diltiazem, digoxin) and rhythm control, and monitor the response.
4. Anticipate anticoagulation to reduce the risk of stroke; assess for stroke signs, and teach bleeding precautions.
5. Teach the patient to report palpitations, dizziness and neurological symptoms.

## Exam tip
> **Irregularly irregular + no P waves = A-fib.** The big complication to remember is **stroke** from atrial clots, so anticoagulation matters.`,
  },
  {
    key: "ecg-atrial-flutter",
    exam: "nclex-rn",
    category: ECG,
    title: "Atrial flutter",
    summary: "Regular sawtooth flutter waves at about 300/min with a 4:1 block, giving a ventricular rate near 75.",
    tags: ["ecg", "atrial flutter", "arrhythmia"],
    body: `## What you are seeing
A strip with regular sawtooth flutter waves at about 300 per minute. Only every fourth flutter wave is followed by a QRS (4:1 conduction), so the ventricular rate is about 75 and regular. The AV node acts as a gate that blocks most of the atrial impulses.

## How to recognise it
- **Atrial rate:** about 250 to 350 per minute (about 300 here).
- **Ventricular rate:** depends on the block ratio (about 75 for 4:1).
- **Regularity:** usually regular when the block ratio is constant; can be irregular if it varies.
- **P waves:** replaced by sawtooth flutter (F) waves.
- **QRS:** narrow.

## Common causes
- Heart failure, coronary artery disease and valve disease
- Cardiac surgery and pericarditis
- Pulmonary embolism and chronic lung disease
- Hyperthyroidism and alcohol use

## Nursing priorities
1. Assess the patient: blood pressure, symptoms and perfusion.
2. If unstable, call for help and prepare for synchronized cardioversion (flutter often responds to low energy).
3. If stable, anticipate rate control with beta blockers or calcium channel blockers and possible rhythm control (ablation, cardioversion).
4. Anticipate anticoagulation because stroke risk is similar to atrial fibrillation.
5. Monitor for fast ventricular response and teach about medication adherence.

## Exam tip
> **Sawtooth waves = flutter.** Count the flutter waves per QRS to name the block (4:1 here); the regularity of the ventricular rate separates it from atrial fibrillation.`,
  },
  {
    key: "ecg-svt",
    exam: "nclex-rn",
    category: ECG,
    title: "Supraventricular tachycardia (SVT)",
    summary: "A very fast, perfectly regular narrow-complex rhythm near 170 bpm with no visible P waves.",
    tags: ["ecg", "svt", "tachycardia", "arrhythmia"],
    body: `## What you are seeing
A fast rhythm at about 170 per minute so regular that the R-R intervals look identical. The QRS complexes are narrow and P waves cannot be seen because they are buried in the fast rate. The rhythm usually arises from a re-entry circuit above the ventricles and may start and stop suddenly.

## How to recognise it
- **Rate:** usually 150 to 250 per minute (about 170 here).
- **Regularity:** very regular.
- **P waves:** absent or hidden in the QRS or T wave.
- **QRS:** narrow (under 0.12 seconds).
- **Onset:** often abrupt ("paroxysmal").

## Common causes
- Re-entry circuits through the AV node or an accessory pathway
- Caffeine, nicotine, alcohol and stimulant drugs
- Stress, anxiety and exercise
- Hyperthyroidism and underlying heart disease

## Nursing priorities
1. Assess the patient: blood pressure, mental status, chest pain and perfusion.
2. If unstable (hypotension, chest pain, shock, altered mentation), call for help and prepare for immediate synchronized cardioversion.
3. If stable, teach or perform vagal maneuvers (for example, the modified Valsalva) per policy.
4. Next, anticipate adenosine by rapid IV push followed by a saline flush through a proximal line, warning the patient of a brief sense of chest pressure or flushing.
5. Monitor the rhythm continuously and have emergency equipment at hand.

## Exam tip
> **Fast, regular, narrow, no P waves = SVT.** Stable: vagal maneuvers, then adenosine. Unstable: synchronized cardioversion.`,
  },
  {
    key: "ecg-ventricular-tachycardia",
    exam: "nclex-rn",
    category: ECG,
    title: "Ventricular tachycardia",
    summary: "A fast regular rhythm near 180/min of wide, bizarre QRS complexes; can quickly become pulseless.",
    tags: ["ecg", "ventricular tachycardia", "emergency", "arrhythmia"],
    body: `## What you are seeing
A fast rhythm at about 180 per minute composed of wide, bizarre QRS complexes with no visible P waves. It starts in the ventricles. The patient may have a pulse or may be pulseless, which changes everything about the response.

## How to recognise it
- **Rate:** 100 to 250 per minute (about 180 here).
- **Regularity:** regular or nearly regular.
- **P waves:** none visible.
- **QRS:** wide (0.12 seconds or more) and bizarre.
- **Duration:** sustained if it lasts more than 30 seconds or causes instability.

## Common causes
- Myocardial infarction and ischemia
- Cardiomyopathy and heart failure
- Electrolyte disturbances (low potassium or magnesium)
- Drug toxicity and prolonged QT
- Structural heart disease and prior scarring

## Nursing priorities
1. Check the patient immediately: responsiveness, breathing and pulse.
2. **Pulseless:** call for help, start CPR, attach the defibrillator and defibrillate (treat as ventricular fibrillation), then follow ACLS.
3. **Pulse but unstable** (hypotension, chest pain, altered mentation, shock): prepare for synchronized cardioversion.
4. **Stable with a pulse:** give oxygen, obtain a 12-lead ECG, and anticipate an antiarrhythmic such as amiodarone.
5. Correct electrolytes and document the event with strips.

## Exam tip
> **Wide and fast = V-tach until proven otherwise. No pulse: defibrillate. Pulse and unstable: synchronized cardioversion.**`,
  },
  {
    key: "ecg-ventricular-fibrillation",
    exam: "nclex-rn",
    category: ECG,
    title: "Ventricular fibrillation",
    summary: "A chaotic, coarse wavy baseline with no QRS complexes; a lethal rhythm that needs immediate defibrillation.",
    tags: ["ecg", "ventricular fibrillation", "emergency", "lethal rhythm"],
    body: `## What you are seeing
A chaotic, irregular, coarse wavy baseline with no identifiable P waves, QRS complexes or T waves. The ventricles are quivering instead of pumping, so there is no cardiac output and the patient is pulseless and unresponsive within seconds.

## How to recognise it
- **Rate:** cannot be determined.
- **Regularity:** completely chaotic.
- **P waves, PR, QRS, T waves:** none identifiable.
- **Patient:** unresponsive, not breathing normally, no pulse.
- **Look-alike:** loose or disconnected electrodes and patient movement can mimic it, so always check the patient.

## Common causes
- Acute myocardial infarction and ischemia
- Untreated ventricular tachycardia
- Electrolyte imbalance and drug toxicity
- Cardiomyopathy, electrocution and severe hypoxia

## Nursing priorities
1. Confirm unresponsiveness and no pulse, and **call for help**: activate the emergency response and get the defibrillator.
2. **Start high-quality CPR** immediately (compressions of 100 to 120 per minute, at least 2 inches deep, allowing full recoil).
3. **Defibrillate** as soon as the device is ready, then resume CPR at once for 2 minutes before the next rhythm check.
4. Establish IV or IO access and give epinephrine and amiodarone as directed by ACLS.
5. Treat reversible causes, then document the code and provide post-arrest care.

## Exam tip
> **No pulse + chaotic baseline = CPR and shock.** Defibrillation (unsynchronized) is the definitive treatment; delays cost lives.`,
  },
  {
    key: "ecg-torsades",
    exam: "nclex-rn",
    category: ECG,
    title: "Torsades de pointes",
    summary: "Wide complexes that wax and wane in a twisting spindle pattern; linked to a long QT and low magnesium.",
    tags: ["ecg", "torsades", "emergency", "long qt"],
    body: `## What you are seeing
A form of polymorphic ventricular tachycardia in which wide complexes gradually grow and shrink in amplitude, as if twisting around the baseline. It often appears in runs that may stop on their own, or degenerate into ventricular fibrillation.

## How to recognise it
- **Rate:** usually 150 to 250 per minute.
- **Regularity:** irregular.
- **QRS:** wide, with amplitude that rises and falls in a spindle pattern.
- **P waves:** not visible.
- **Background:** a prolonged QT interval on earlier strips is common.

## Common causes
- Low magnesium, potassium or calcium
- QT-prolonging drugs (some antiarrhythmics, antipsychotics, macrolide and fluoroquinolone antibiotics, ondansetron)
- Congenital long QT syndrome
- Bradycardia and structural heart disease

## Nursing priorities
1. Check the patient immediately for responsiveness and a pulse.
2. **Pulseless:** call for help, start CPR and defibrillate.
3. **Pulse present:** call the provider urgently and anticipate **IV magnesium sulfate**, the drug of choice.
4. Correct potassium and calcium, and stop or hold the QT-prolonging drug as directed.
5. Monitor the QT on telemetry, keep defibrillation equipment close, and educate about drug interactions.

## Exam tip
> **Twisting spindle + long QT = torsades.** Think **magnesium**, and review the medication list for QT-prolonging drugs.`,
  },
  {
    key: "ecg-asystole",
    exam: "nclex-rn",
    category: ECG,
    title: "Asystole",
    summary: "An almost flat line with no electrical activity; a non-shockable arrest rhythm that needs CPR, not defibrillation.",
    tags: ["ecg", "asystole", "emergency", "lethal rhythm"],
    body: `## What you are seeing
A nearly flat line with only slight baseline drift. There is no electrical activity in the heart, so there is no pumping and no pulse. This is a cardiac arrest rhythm.

## How to recognise it
- **Rate:** none.
- **P waves, QRS and T waves:** absent.
- **Baseline:** flat or slightly wandering.
- **Before acting:** confirm that it is real. Check that leads are attached, gain is turned up and the lead selection is correct, and check the patient.

## Common causes
- Prolonged hypoxia or respiratory arrest
- Severe acidosis, hyperkalemia and hypothermia
- Massive myocardial damage
- Hypovolemia, tension pneumothorax, tamponade, toxins and thrombosis (the "H's and T's")
- Progression from other arrest rhythms

## Nursing priorities
1. Check the patient: responsiveness, breathing and pulse, and verify leads and monitor settings.
2. **Call for help** and start high-quality CPR immediately.
3. Do **not** defibrillate; asystole is a non-shockable rhythm.
4. Establish IV or IO access and give epinephrine as soon as possible, repeating every 3 to 5 minutes per ACLS.
5. Search for and treat reversible causes, and follow code leader direction; document times, drugs and rhythm checks.

## Exam tip
> **Flat line? Check the patient and the leads first.** Asystole is treated with CPR and epinephrine, never with a shock.`,
  },
  {
    key: "ecg-first-degree-block",
    exam: "nclex-rn",
    category: ECG,
    title: "First-degree AV block",
    summary: "A regular rhythm where every P wave conducts but the PR interval is long (0.32 s) and constant.",
    tags: ["ecg", "av block", "conduction"],
    body: `## What you are seeing
A regular rhythm at about 70 per minute where every P wave is followed by a QRS. The delay lies in a long, constant PR interval of about 0.32 seconds. The impulse is slowed at the AV node but never blocked.

## How to recognise it
- **Rate:** usually normal (about 70 here).
- **Regularity:** regular.
- **P waves:** present, one per QRS.
- **PR interval:** greater than 0.20 seconds and the same on every beat.
- **QRS:** usually narrow.

## Common causes
- Increased vagal tone and well-conditioned athletes
- Medications: digoxin, beta blockers, calcium channel blockers
- Inferior myocardial infarction and ischemia
- Electrolyte problems, myocarditis and degenerative conduction disease

## Nursing priorities
1. Assess the patient; first-degree block rarely causes symptoms.
2. Review the medication list and check digoxin levels and electrolytes; notify the provider before giving the next dose of a suspect drug.
3. Monitor the rhythm for progression to higher-degree block, especially after an MI.
4. Report a lengthening PR interval, new dropped beats or a slow rate.
5. Teach the patient to report fainting, dizziness or fatigue.

## Exam tip
> **Long but constant PR (over 0.20 s), nothing dropped = first degree.** It is usually benign, but watch for progression.`,
  },
  {
    key: "ecg-mobitz-1",
    exam: "nclex-rn",
    category: ECG,
    title: "Second-degree AV block, Mobitz I (Wenckebach)",
    summary: "PR intervals lengthen until a beat is dropped, then the cycle repeats; grouped beating is the clue.",
    tags: ["ecg", "av block", "wenckebach", "conduction"],
    body: `## What you are seeing
The PR interval gets longer with each beat until one P wave is not followed by a QRS (a dropped beat). After the pause the cycle begins again, producing grouped beating. The block lies within the AV node itself.

## How to recognise it
- **Rate:** atrial rate normal; ventricular rate slightly slower.
- **Regularity:** irregular with a repeating pattern; R-R intervals shorten before the pause.
- **P waves:** present; one is not followed by a QRS.
- **PR interval:** progressively longer until the drop.
- **QRS:** usually narrow.

## Common causes
- Inferior myocardial infarction
- Digoxin, beta blockers and calcium channel blockers
- Increased vagal tone
- Myocarditis and cardiac surgery

## Nursing priorities
1. Assess the patient for symptoms: dizziness, hypotension, syncope or chest pain.
2. Review medications and hold or report those that slow AV conduction, per provider direction.
3. Most patients are asymptomatic and need monitoring only; keep the patient on telemetry.
4. If symptomatic and bradycardic, call for help and follow the bradycardia pathway (atropine, then pacing).
5. Document the pattern and report progression to higher-degree block.

## Exam tip
> **"Longer, longer, longer, drop – then Wenckebach!"** Mobitz I is usually benign; Mobitz II is the dangerous one.`,
  },
  {
    key: "ecg-mobitz-2",
    exam: "nclex-rn",
    category: ECG,
    title: "Second-degree AV block, Mobitz II",
    summary: "A constant PR interval with sudden, unpredictable dropped QRS complexes; can progress to complete block.",
    tags: ["ecg", "av block", "conduction", "pacemaker"],
    body: `## What you are seeing
The conducted beats have a constant PR interval, but now and then a P wave appears with no QRS after it. The drops come without warning. The block lies below the AV node, in the His-Purkinje system, which makes it unstable.

## How to recognise it
- **Rate:** atrial rate normal; ventricular rate slower depending on the number of drops.
- **Regularity:** irregular when beats drop.
- **P waves:** present; some are not followed by a QRS.
- **PR interval:** constant on conducted beats.
- **QRS:** often wide.

## Common causes
- Anterior myocardial infarction
- Degenerative disease of the conduction system
- Cardiac surgery, cardiomyopathy and myocarditis
- Drug toxicity and electrolyte disturbances

## Nursing priorities
1. Assess the patient immediately: blood pressure, level of consciousness, perfusion and symptoms.
2. Call the provider urgently; this rhythm can progress suddenly to complete heart block or asystole.
3. Keep the patient on continuous monitoring with transcutaneous pacing pads and emergency equipment ready.
4. If symptomatic, follow the bradycardia pathway; atropine may be ineffective, so be ready for pacing.
5. Prepare the patient for a permanent pacemaker and explain the procedure.

## Exam tip
> **Constant PR + sudden dropped beat = Mobitz II.** Unlike Mobitz I, it is dangerous and usually needs a pacemaker.`,
  },
  {
    key: "ecg-third-degree-block",
    exam: "nclex-rn",
    category: ECG,
    title: "Third-degree (complete) AV block",
    summary: "P waves at ~80 and a slower wide-QRS escape rhythm at ~36 with no relationship; needs urgent pacing.",
    tags: ["ecg", "av block", "emergency", "pacemaker"],
    body: `## What you are seeing
The atria and ventricles beat independently. Regular P waves march along at about 80 per minute while a slower, regular wide-QRS escape rhythm runs at about 36. No P wave is consistently related to a QRS (AV dissociation). The ventricles are being driven by a backup pacemaker.

## How to recognise it
- **Atrial rate:** normal (about 80 here); regular.
- **Ventricular rate:** slow, 20 to 40 for a ventricular escape (about 36 here); regular.
- **P waves:** present but unrelated to the QRS; PR interval varies.
- **QRS:** wide when the escape is ventricular, narrower when it is junctional.

## Common causes
- Acute inferior or anterior myocardial infarction
- Degenerative conduction disease
- Digoxin or other drug toxicity
- Cardiac surgery, Lyme disease and myocarditis

## Nursing priorities
1. Assess the patient: syncope, hypotension, chest pain, confusion, heart failure and perfusion.
2. **Call for help**; this is an emergency with a high risk of cardiac arrest.
3. Apply transcutaneous pacing pads and prepare for pacing; give oxygen and establish IV access.
4. Atropine may be tried per ACLS but often fails; dopamine or epinephrine infusions may bridge to pacing.
5. Prepare for a transvenous or permanent pacemaker, and treat the cause (hold digoxin, treat the MI).

## Exam tip
> **P waves and QRS "don't talk to each other" and the ventricular rate is very slow = complete heart block.** Think pacemaker.`,
  },
  {
    key: "ecg-pvc",
    exam: "nclex-rn",
    category: ECG,
    title: "Premature ventricular contractions (PVCs)",
    summary: "Early, wide, bizarre QRS complexes without P waves, followed by a pause; watch for frequency and runs.",
    tags: ["ecg", "pvc", "ectopy", "arrhythmia"],
    body: `## What you are seeing
An underlying sinus rhythm is interrupted by occasional early beats. Each PVC has a wide, bizarre QRS, no P wave, and a T wave pointing in the opposite direction. A pause follows it before the next normal beat.

## How to recognise it
- **Rate and regularity:** the underlying rhythm is regular; the PVC makes it irregular.
- **P wave:** none before the PVC.
- **QRS:** wide (0.12 seconds or more), bizarre, premature.
- **T wave:** discordant (opposite direction to the QRS).
- **Patterns:** bigeminy (every other beat), trigeminy (every third), couplets (two in a row) and multifocal (different shapes).

## Common causes
- Hypokalemia, hypomagnesemia and hypoxia
- Myocardial ischemia and infarction
- Caffeine, nicotine, alcohol and stimulants
- Stress, heart failure and digoxin toxicity

## Nursing priorities
1. Assess the patient: pulse, blood pressure, symptoms such as palpitations or dizziness.
2. Check oxygen saturation and give oxygen if hypoxemic.
3. Check potassium and magnesium and anticipate replacement.
4. Report frequent PVCs (more than 6 per minute), couplets, multifocal PVCs, runs of three or more, or R-on-T PVCs; these can lead to ventricular tachycardia.
5. Reduce triggers such as caffeine and review medications; keep emergency equipment ready.

## Exam tip
> **Early, wide, no P wave.** The warning signs are **multifocal, couplets, runs and R-on-T**; think electrolytes and oxygen first.`,
  },
  {
    key: "ecg-stemi",
    exam: "nclex-rn",
    category: ECG,
    title: "ST-segment elevation (STEMI pattern)",
    summary: "Dome-shaped tombstone ST elevation after each QRS signals acute myocardial injury; time is muscle.",
    tags: ["ecg", "stemi", "emergency", "myocardial infarction"],
    body: `## What you are seeing
A sinus rhythm in which the ST segment rises markedly above the baseline after each QRS, forming a dome or "tombstone" shape. This suggests a coronary artery that is completely blocked, causing transmural injury.

## How to recognise it
- **Rhythm:** usually sinus; rate and regularity depend on the patient.
- **ST segment:** elevated, convex (dome-shaped), in leads facing the injured area.
- **Reciprocal changes:** ST depression in opposite leads.
- **Evolution:** later T-wave inversion and Q waves.
- **Patient:** chest pain or pressure, diaphoresis, dyspnea, nausea; some patients (women, older adults, diabetics) have atypical symptoms.

## Common causes
- Rupture of an atherosclerotic plaque with clot in a coronary artery
- Coronary spasm
- Embolism and coronary dissection
- Cocaine use

## Nursing priorities
1. Assess the patient and call for help; obtain a 12-lead ECG within 10 minutes of arrival.
2. Alert the provider and the cath lab or the reperfusion team immediately.
3. Give oxygen only if saturation is below 90 percent, and give aspirin (chewed) unless contraindicated.
4. Establish IV access and anticipate nitroglycerin, analgesia and anticoagulant as ordered; avoid nitrates with right ventricular infarction or recent phosphodiesterase inhibitors.
5. Prepare for primary PCI (goal door-to-balloon within 90 minutes) or fibrinolytics; monitor for arrhythmias.

## Exam tip
> **"Time is muscle."** ST elevation means open the artery fast: 12-lead in 10 minutes, PCI in 90.`,
  },
  {
    key: "ecg-st-depression",
    exam: "nclex-rn",
    category: ECG,
    title: "ST-segment depression (ischemia pattern)",
    summary: "Horizontal or downsloping ST depression suggests ischemia, as in angina or NSTEMI.",
    tags: ["ecg", "ischemia", "angina", "nstemi"],
    body: `## What you are seeing
A sinus rhythm where the ST segment sits below the baseline after each QRS, either flat (horizontal) or sloping downward. This suggests that the heart muscle is not getting enough oxygen, often subendocardial ischemia.

## How to recognise it
- **Rhythm:** usually sinus.
- **ST segment:** depressed by 1 mm or more below the baseline, horizontal or downsloping.
- **T waves:** may be inverted.
- **Context:** changes may appear only during chest pain or exertion (stable or unstable angina) or persist (NSTEMI).
- **Patient:** chest discomfort, dyspnea, nausea; troponin helps separate angina from NSTEMI.

## Common causes
- Coronary artery disease with fixed narrowing
- Increased demand: tachycardia, anemia, hypertension, exertion
- Digoxin effect and hypokalemia
- Left ventricular hypertrophy

## Nursing priorities
1. Assess the patient and stop activity; check vital signs and pain.
2. Notify the provider and obtain a 12-lead ECG, comparing with previous tracings.
3. Give oxygen if hypoxemic, and anticipate aspirin, nitroglycerin, beta blockers and anticoagulation as ordered.
4. Draw serial troponins and report results promptly.
5. Keep the patient on bed rest with continuous monitoring; teach to report pain right away.

## Exam tip
> **Elevation = injury (STEMI); depression = ischemia (angina or NSTEMI).** Troponin separates unstable angina from NSTEMI.`,
  },
  {
    key: "ecg-hyperkalemia",
    exam: "nclex-rn",
    category: ECG,
    title: "Hyperkalemia ECG changes",
    summary: "Tall peaked T waves, flat P waves and a widening QRS signal dangerous potassium excess.",
    tags: ["ecg", "hyperkalemia", "electrolytes", "emergency"],
    body: `## What you are seeing
A strip showing the classic progression of high potassium: tall, narrow, peaked T waves, flattened P waves and a widened QRS complex. As the level climbs, the QRS can merge with the T wave in a sine-wave pattern and then progress to ventricular fibrillation or asystole.

## How to recognise it
- **T waves:** tall, narrow and peaked ("tented").
- **P waves:** flattened, then lost.
- **PR interval:** lengthened.
- **QRS:** widened.
- **Serum potassium:** above 5.0 mEq/L (about 5.5 and higher shows ECG changes).

## Common causes
- Kidney failure and missed dialysis
- Potassium-sparing diuretics, ACE inhibitors, ARBs and potassium supplements
- Tissue injury: burns, crush injury, tumor lysis
- Acidosis, adrenal insufficiency and rapid blood transfusion

## Nursing priorities
1. Assess the patient and place on continuous cardiac monitoring; call the provider urgently.
2. Stop all potassium intake (IV and oral) and hold potassium-raising drugs.
3. Anticipate **IV calcium gluconate or chloride** to protect the heart.
4. Anticipate insulin with dextrose, nebulized albuterol and sodium bicarbonate to shift potassium into cells.
5. Anticipate removal with a potassium binder, loop diuretics or dialysis; recheck levels and monitor for rhythm changes.

## Exam tip
> **Peaked T = potassium high.** Calcium protects the heart; insulin and glucose, albuterol shift it; binders, diuretics and dialysis remove it.`,
  },
  {
    key: "ecg-hypokalemia",
    exam: "nclex-rn",
    category: ECG,
    title: "Hypokalemia ECG changes",
    summary: "ST depression, flattened T waves and a prominent U wave point to low potassium and arrhythmia risk.",
    tags: ["ecg", "hypokalemia", "electrolytes"],
    body: `## What you are seeing
A strip with ST-segment depression, flattened T waves and a prominent U wave after the T wave. As potassium falls further, the patient is at higher risk of ventricular ectopy, torsades de pointes and cardiac arrest.

## How to recognise it
- **ST segment:** depressed.
- **T waves:** flat or inverted.
- **U wave:** prominent, following the T wave.
- **Rhythm:** PVCs and other arrhythmias may appear.
- **Serum potassium:** below 3.5 mEq/L.
- **Patient:** muscle weakness, cramps, constipation, fatigue, and digoxin toxicity risk.

## Common causes
- Loop and thiazide diuretics
- Vomiting, diarrhea and nasogastric suction
- Inadequate intake and alcohol use
- Insulin therapy, alkalosis and hypomagnesemia

## Nursing priorities
1. Assess the patient and apply cardiac monitoring; notify the provider of the level.
2. Anticipate potassium replacement, oral if tolerated; IV only when ordered.
3. IV potassium must **never be given by IV push**; dilute it, use an infusion pump and follow concentration and rate limits, usually no more than 10 mEq per hour on a general unit.
4. Check urine output first, since potassium cannot be given safely with poor kidney function; watch the IV site for irritation.
5. Check magnesium and replace if low, review diuretics and digoxin, and teach potassium-rich foods.

## Exam tip
> **Never push potassium.** Low K shows as flat T, ST depression and a U wave; confirm urine output before replacing.`,
  },
  {
    key: "ecg-paced",
    exam: "nclex-rn",
    category: ECG,
    title: "Ventricular paced rhythm",
    summary: "Sharp pacemaker spikes each followed by a wide QRS show a pacemaker capturing the ventricle.",
    tags: ["ecg", "pacemaker", "paced rhythm"],
    body: `## What you are seeing
Regular, sharp vertical lines (pacing spikes) each followed immediately by a wide QRS complex. The spike is the pacemaker's electrical output; the wide QRS shows the ventricle responding to it. This is called capture.

## How to recognise it
- **Spike:** a narrow vertical line before the QRS.
- **Capture:** a wide QRS follows each spike, and a pulse follows each QRS.
- **Rate:** regular, at the set pacing rate (the rate is programmed).
- **Failure to capture:** spikes with no QRS afterward.
- **Failure to sense:** spikes that fire when the patient's own beat is present.
- **Failure to pace:** no spikes when expected.

## Common causes
Problems come from a lead that has moved, battery depletion, a low output setting, poor contact, fibrosis at the lead tip, or electrolyte or drug changes that raise the capture threshold.

## Nursing priorities
1. Assess the patient: pulse, blood pressure, dizziness and syncope. Check that every spike produces a pulse.
2. If the patient is unstable with pacing failure, call for help, begin emergency treatment and prepare for transcutaneous pacing.
3. For temporary wires, keep them secured, covered and the generator protected; check connections and settings.
4. Keep the patient away from strong magnetic fields and avoid MRI unless the device is cleared.
5. Teach the patient to check the pulse, carry a device card and report dizziness, hiccups or a slow pulse.

## Exam tip
> **Spike then wide QRS = capture.** Always confirm a pulse for every paced beat.`,
  },

  // ---------- EEG ----------
  {
    key: "eeg-alpha",
    exam: "nclex-rn",
    category: EEG,
    title: "Normal awake EEG (alpha rhythm)",
    summary: "Regular 10 Hz activity strongest over the back of the head is the normal awake, relaxed pattern.",
    tags: ["eeg", "normal", "alpha"],
    body: `## What you are seeing
A ten-second, four-channel electroencephalogram (EEG) with regular, rhythmic activity at about 10 cycles per second (10 Hz) of moderate amplitude. It is strongest over the back channels. This alpha rhythm is typical of a relaxed adult with the eyes closed.

## How to recognise it
- **Frequency:** alpha waves are 8 to 13 Hz (about 10 Hz here).
- **Amplitude:** moderate.
- **Location:** strongest at the back of the head (occipital).
- **Reactivity:** fades when the eyes open or the patient concentrates.
- **No spikes or sharp waves** and no sudden bursts.
- **Note:** a neurologist interprets the EEG; the nurse supports the test.

## Common causes
This is a normal finding in a relaxed, awake person. Medications, drowsiness, anxiety and artifact (muscle, eye movement, sweat) can alter the tracing without any disease.

## Nursing priorities
1. Explain the painless test and that the patient must stay still; electrodes are attached to the scalp with paste.
2. Ask the patient to wash and dry the hair, avoid oils or sprays, and check with the provider about holding caffeine or sedatives or anticonvulsants only if instructed.
3. Provide a calm, quiet room and help the patient relax with eyes closed as directed.
4. Maintain seizure precautions during activation procedures such as hyperventilation or flashing lights.
5. Afterward, help remove the paste from the hair, assess for fatigue or drowsiness, and communicate that results come from the neurologist.

## Exam tip
> **Alpha = awake, relaxed, eyes closed, back of the head, 8 to 13 Hz.** The nurse prepares and protects the patient; the neurologist reads the tracing.`,
  },
  {
    key: "eeg-beta",
    exam: "nclex-rn",
    category: EEG,
    title: "Beta activity",
    summary: "Low-amplitude fast activity near 20 Hz seen with alertness, concentration or sedative drugs.",
    tags: ["eeg", "beta", "brain waves"],
    body: `## What you are seeing
A ten-second, four-channel EEG with low-amplitude, fast activity at about 20 cycles per second (20 Hz). Beta waves are the fastest of the usual EEG rhythms and are linked to an alert, active brain.

## How to recognise it
- **Frequency:** above 13 Hz (about 20 Hz here).
- **Amplitude:** low.
- **Location:** often more evident at the front of the head.
- **Meaning:** normal during alertness, thinking and anxiety.
- **Drug effect:** increased beta is common with benzodiazepines and barbiturates.
- **Note:** a neurologist interprets the EEG.

## Common causes
- Normal alert, attentive state
- Anxiety and concentration
- Sedative medications (benzodiazepines, barbiturates)
- Muscle tension and artifact, which can look similar

## Nursing priorities
1. Prepare the patient: explain the test, remove hair products and ensure the scalp is clean.
2. Document current medications, especially sedatives and anticonvulsants, so that the neurologist can interpret fast activity correctly.
3. Reduce artifact by asking the patient to relax the jaw, forehead and neck and to keep still.
4. Provide seizure precautions: padded rails, suction and oxygen available, bed low.
5. After the test, assist with hair cleaning and check that the patient is comfortable; report any unusual behavior seen during the test.

## Exam tip
> **Beta = Busy and Brisk.** Fast, low-amplitude waves are normal when alert and are increased by sedatives.`,
  },
  {
    key: "eeg-theta",
    exam: "nclex-rn",
    category: EEG,
    title: "Theta activity",
    summary: "Slower rhythmic 4 to 7 Hz activity is normal in drowsiness and sleep but can be abnormal in an awake adult.",
    tags: ["eeg", "theta", "brain waves"],
    body: `## What you are seeing
A ten-second, four-channel EEG with slower, rhythmic activity at about 6 cycles per second (6 Hz) of moderate amplitude. Theta waves are normal in light sleep, drowsiness and children, but when they dominate an awake adult they can point to a problem.

## How to recognise it
- **Frequency:** 4 to 7 Hz (about 6 Hz here).
- **Amplitude:** moderate.
- **Normal:** drowsiness, light sleep, young children.
- **Possibly abnormal:** persistent theta in an alert adult.
- **Note:** a neurologist interprets the EEG; clinical context decides the meaning.

## Common causes
- Drowsiness and normal stage 1 and 2 sleep
- Metabolic encephalopathy, hepatic or renal failure
- Medications and toxins
- Head injury, brain lesions or diffuse brain dysfunction

## Nursing priorities
1. Note and document the patient's level of consciousness and behavior before and during the test.
2. Tell the technologist if the patient dozed during the recording, because sleep changes the pattern.
3. Follow instructions about sleep deprivation or medication holds only when the provider orders them.
4. Maintain seizure precautions and keep the environment safe and quiet.
5. Provide post-test care (clean hair, rest), and report any change in neurological status such as confusion or reduced alertness.

## Exam tip
> **Theta = "the sleepy waves".** Normal when drowsy; in an awake adult, think about metabolic or structural causes.`,
  },
  {
    key: "eeg-delta",
    exam: "nclex-rn",
    category: EEG,
    title: "Delta activity",
    summary: "Slow, high-amplitude 1 to 4 Hz waves are normal in deep sleep but abnormal in an awake adult.",
    tags: ["eeg", "delta", "brain waves"],
    body: `## What you are seeing
A ten-second, four-channel EEG with slow, high-amplitude waves at about 2 cycles per second (2 Hz). Delta waves are the slowest brain rhythm. They are normal in deep sleep, but in an awake adult they suggest significant brain dysfunction.

## How to recognise it
- **Frequency:** under 4 Hz (about 2 Hz here).
- **Amplitude:** high.
- **Normal:** deep (slow-wave) sleep and infants.
- **Abnormal:** in an awake adult, especially if widespread or focal.
- **Note:** a neurologist interprets the EEG.

## Common causes
- Deep sleep (normal)
- Brain tumor, stroke or abscess (focal slowing)
- Encephalopathy, hepatic or uremic coma
- Severe head injury, sedatives and anesthesia

## Nursing priorities
1. Assess and document level of consciousness, orientation, pupils and responsiveness; a patient with delta slowing may be drowsy or confused.
2. Note any seizure activity, and keep seizure precautions in place.
3. Protect the airway and prevent falls and injury in patients with reduced consciousness.
4. Inform the provider of new neurological changes, such as worsening confusion or headache.
5. Provide post-test hair care and comfort, and explain that the neurologist will report the findings.

## Exam tip
> **Delta = Deep and Dangerous when awake.** Slow, tall waves are normal only in deep sleep.`,
  },
  {
    key: "eeg-absence-seizure",
    exam: "nclex-rn",
    category: EEG,
    title: "Absence seizure (3-Hz spike-and-wave)",
    summary: "A sudden generalized 3-per-second spike-and-wave burst marks a brief staring seizure, common in children.",
    tags: ["eeg", "seizure", "absence", "epilepsy"],
    body: `## What you are seeing
An EEG with a normal background that suddenly shows a generalized burst of 3-per-second spike-and-wave complexes on every channel, then abruptly returns to normal. This pattern accompanies an absence seizure, a brief lapse in awareness. A neurologist interprets the EEG; the nurse observes and documents the behavior.

## How to recognise it
- **EEG:** sudden, generalized, symmetrical 3 Hz spike-and-wave bursts.
- **Onset and end:** abrupt, with a normal background before and after.
- **Behavior:** blank stare, brief stop of activity, possible eyelid fluttering or lip smacking.
- **Duration:** usually under 10 to 30 seconds.
- **Recovery:** immediate, with no post-ictal confusion.
- **Frequency:** can occur many times a day.

## Common causes
- Childhood absence epilepsy, usually ages 4 to 12
- Genetic predisposition
- Hyperventilation and flashing lights as triggers during testing
- Missed anticonvulsant doses

## Nursing priorities
1. Ensure safety: guide the patient to a safe position and clear nearby hazards.
2. Observe and time the episode; document onset, duration, behaviors and recovery, and whether the patient responded.
3. Do not restrain or put anything in the mouth.
4. Notify the provider of new or increasing episodes, and give anticonvulsants as prescribed (for example, ethosuximide).
5. Teach caregivers and teachers about the signs, and counsel about safety with water and bicycles.

## Exam tip
> **Staring spell, 3 Hz spike-and-wave, no post-ictal state.** Absence seizures can be mistaken for daydreaming or inattention.`,
  },
  {
    key: "eeg-tonic-clonic",
    exam: "nclex-rn",
    category: EEG,
    title: "Generalized tonic-clonic seizure",
    summary: "High-amplitude polyspike activity on all channels evolving into slower bursts marks a generalized convulsion.",
    tags: ["eeg", "seizure", "tonic-clonic", "emergency"],
    body: `## What you are seeing
An EEG that begins with a normal background, then shows high-amplitude, rapid polyspike activity on all channels that evolves into slower rhythmic bursts. This corresponds to the tonic phase (stiffening) followed by the clonic phase (rhythmic jerking). A neurologist interprets the EEG; the nurse manages the patient.

## How to recognise it
- **EEG:** generalized fast polyspikes, then slower rhythmic bursts, often followed by flattening.
- **Tonic phase:** stiffening, loss of consciousness, possible cry, apnea and cyanosis.
- **Clonic phase:** rhythmic jerking of limbs.
- **Duration:** most last 1 to 3 minutes.
- **Post-ictal:** drowsiness, confusion and headache.

## Common causes
- Epilepsy and missed anticonvulsant doses
- Alcohol or drug withdrawal and sleep deprivation
- Head injury, stroke, tumor, infection
- Hypoglycemia, electrolyte problems and fever in children

## Nursing priorities
1. Note the time, protect the patient from injury (lower to the floor or bed, pad the head, clear the area) and call for help.
2. Do not restrain, and never put anything in the mouth.
3. Loosen tight clothing, turn the patient onto the side as soon as possible to protect the airway, and suction if needed; give oxygen.
4. Call for emergency help if the seizure lasts more than 5 minutes or repeats without recovery (status epilepticus); anticipate IV lorazepam.
5. Afterward, maintain a side-lying position, monitor airway, vital signs and neurological status, check glucose, orient the patient and document the entire event.

## Exam tip
> **Time it, turn the patient to the side, protect the head, never restrain or put anything in the mouth.** Over 5 minutes is an emergency.`,
  },
  {
    key: "eeg-burst-suppression",
    exam: "nclex-rn",
    category: EEG,
    title: "Burst-suppression pattern",
    summary: "Alternating high-amplitude bursts and near-flat periods signal profound brain suppression.",
    tags: ["eeg", "burst suppression", "critical care", "coma"],
    body: `## What you are seeing
An EEG with alternating high-amplitude bursts of activity and nearly flat (suppressed) periods on all channels. This pattern shows severe, widespread brain suppression. A neurologist interprets the EEG; the nurse cares for a critically ill patient.

## How to recognise it
- **EEG:** bursts of activity separated by flat periods, on all channels.
- **Patient:** deeply unresponsive, often on a ventilator.
- **Setting:** intensive care unit.
- **Intent:** it may be the **planned goal** when high-dose anesthetic or barbiturate medication is used to reduce brain metabolism.

## Common causes
- Deliberate medical coma with barbiturates or anesthetic drugs for refractory seizures or raised intracranial pressure
- Severe hypoxic brain injury after cardiac arrest
- Severe encephalopathy and extreme hypothermia
- Drug overdose or toxic states

## Nursing priorities
1. Assess airway, breathing and circulation; these patients depend on mechanical ventilation and hemodynamic support.
2. Perform and document neurological checks, pupils and responsiveness per policy, knowing that sedation affects the exam.
3. Monitor for hypotension, a common effect of barbiturates and anesthetics, and manage as ordered.
4. Protect the patient with turning, skin and eye care, oral hygiene and infection prevention.
5. Maintain a calm environment, support the family, and report changes in the tracing or neurological status to the provider.

## Exam tip
> **Burst-suppression = brain "on pause".** It may be a planned therapy for refractory seizures or raised pressure, or a sign of severe injury; context decides.`,
  },
  {
    key: "eeg-focal-spike",
    exam: "nclex-rn",
    category: EEG,
    title: "Focal epileptiform spikes",
    summary: "Repeated sharp spikes confined to one channel suggest a focal seizure source in one brain area.",
    tags: ["eeg", "focal seizure", "epilepsy", "spikes"],
    body: `## What you are seeing
An EEG with a normal background and repeated sharp spikes seen on one side-channel but not on the others. This suggests a focal (localized) irritable area of the brain. A neurologist interprets the EEG; the nurse supports testing and observes the patient.

## How to recognise it
- **EEG:** repeated sharp spikes confined to one channel or region.
- **Background:** otherwise normal.
- **Focal aware seizure:** awareness is kept; may have twitching, odd sensations or smells.
- **Focal impaired awareness seizure:** altered awareness with lip smacking or automatisms.
- **Spread:** a focal seizure may become a generalized convulsion.

## Common causes
- Scar, stroke or tumor in the brain
- Previous head injury or infection
- Developmental brain differences
- Unknown cause in many patients

## Nursing priorities
1. During a seizure, protect the patient from injury, and keep calm; do not restrain.
2. Time the seizure and document where it began, the behavior, awareness and recovery; this helps locate the focus.
3. Maintain airway; place on the side if consciousness is impaired, and give oxygen if needed.
4. Give anticonvulsants on time as prescribed, and report breakthrough seizures.
5. Teach seizure triggers (missed doses, sleep loss, alcohol), safety with driving and bathing, and when to call for emergency help.

## Exam tip
> **Focal means one area; document the aura and where the seizure starts.** A good description helps the neurologist.`,
  },

  // ---------- Fetal monitoring ----------
  {
    key: "fhr-reassuring",
    exam: "nclex-rn",
    category: FHR,
    title: "Reassuring fetal heart rate (Category I)",
    summary: "A 140 bpm baseline with moderate variability, accelerations and no decelerations is Category I.",
    tags: ["labor", "fetal monitoring", "category i"],
    body: `## What you are seeing
A ten-minute fetal heart rate tracing above a uterine contraction tracing. The baseline is about 140 beats per minute with moderate variability and two accelerations, and no decelerations. This is a Category I tracing, strongly predictive of normal fetal acid-base status.

## How to recognise it
- **Baseline:** 110 to 160 bpm (about 140 here).
- **Variability:** moderate, 6 to 25 bpm of fluctuation.
- **Accelerations:** present (15 bpm above baseline lasting 15 seconds, at 32 weeks or more).
- **Decelerations:** none (early decelerations may be present in Category I).
- **Contractions:** documented frequency, duration and resting tone.

## Common causes
This pattern reflects a well-oxygenated fetus with an intact nervous system and adequate placental blood flow. It can be altered by gestational age, fetal sleep, maternal medication or fever, so interpret in context.

## Nursing priorities
1. Confirm that you are tracing the fetal heart rate rather than the maternal pulse; assess the mother's vital signs.
2. Continue routine monitoring and documentation per policy (for example every 30 minutes in the first stage and every 15 minutes in the second stage).
3. Support comfort and positioning, preferably side-lying, to avoid compression of the vena cava.
4. Document baseline, variability, accelerations, decelerations, contraction pattern and the category.
5. Report any change in the pattern to the provider.

## Exam tip
> **Category I = normal; routine care.** Think "**BAV**": baseline 110 to 160, accelerations, variability moderate.`,
  },
  {
    key: "fhr-early-decel",
    exam: "nclex-rn",
    category: FHR,
    title: "Early decelerations",
    summary: "Gradual drops that mirror contractions are caused by head compression and are generally benign.",
    tags: ["labor", "fetal monitoring", "decelerations"],
    body: `## What you are seeing
The fetal heart rate falls gradually and returns gradually in a mirror image of each contraction. The lowest point (nadir) coincides with the peak of the contraction. This pattern is a normal response to fetal head compression, which stimulates the vagus nerve.

## How to recognise it
- **Onset:** gradual, taking 30 seconds or more from onset to nadir.
- **Timing:** nadir lines up with the contraction peak.
- **Shape:** smooth and symmetrical, a mirror image of the contraction.
- **Depth:** usually modest, rarely below 100 bpm.
- **Variability:** baseline variability remains normal.
- **Repeats** with every contraction.

## Common causes
- Fetal head compression during contractions
- Typically seen during active labor and descent, often at 4 to 7 cm
- Occurs with cephalic presentation

## Nursing priorities
1. Confirm the pattern is truly early, with a normal baseline and variability, and exclude late or variable decelerations.
2. Assess the mother and labor progress; no intervention is typically needed.
3. Continue monitoring and documenting the tracing and contractions.
4. Report a change in the pattern, such as decelerations beginning later or becoming deeper, to the provider.
5. Support the laboring patient with positioning, comfort and information; reassure her that this is expected.

## Exam tip
> **Early = Head compression = Harmless.** The nadir matches the contraction peak ("E" for early and equal timing); no intervention is needed.`,
  },
  {
    key: "fhr-late-decel",
    exam: "nclex-rn",
    category: FHR,
    title: "Late decelerations",
    summary: "Gradual drops after the contraction peak signal uteroplacental insufficiency and need prompt action.",
    tags: ["labor", "fetal monitoring", "decelerations", "emergency"],
    body: `## What you are seeing
The fetal heart rate drops gradually after each contraction begins; the lowest point comes after the contraction peak and recovery is delayed. Late decelerations indicate uteroplacental insufficiency: the fetus is not getting enough oxygen during contractions. Recurrent lates (with more than half of contractions) make the tracing Category II or III.

## How to recognise it
- **Onset:** gradual, 30 seconds or more from onset to nadir.
- **Timing:** nadir and recovery occur **after** the contraction peak and end.
- **Shape:** smooth and symmetrical, usually shallow.
- **Variability:** minimal or absent variability is more worrisome.
- **Repeats** with contractions.

## Common causes
- Uterine tachysystole or excessive oxytocin
- Maternal hypotension, often from supine position or epidural
- Placental abruption or insufficiency
- Maternal hypoxia, anemia, diabetes and hypertensive disorders

## Nursing priorities
1. Turn the patient to a lateral position (left or right) to relieve compression of the vena cava, and **stop oxytocin** if infusing.
2. Give an IV fluid bolus and administer oxygen per policy; assess maternal blood pressure.
3. Evaluate for tachysystole or hypotension and treat the cause.
4. Notify the provider immediately and continue to assess the pattern.
5. If it persists or variability is lost, prepare for expedited delivery (cesarean or operative vaginal), and document.

## Exam tip
> **Late = placenta (uteroplacental insufficiency).** "Turn, fluids, oxygen, stop oxytocin, call the provider."`,
  },
  {
    key: "fhr-variable-decel",
    exam: "nclex-rn",
    category: FHR,
    title: "Variable decelerations",
    summary: "Abrupt, V- or U-shaped drops that vary in timing and depth point to umbilical cord compression.",
    tags: ["labor", "fetal monitoring", "decelerations", "cord compression"],
    body: `## What you are seeing
Abrupt, V- or U-shaped drops in the fetal heart rate whose timing, depth and shape vary from one contraction to the next, often with small "shoulders" before and after. They are caused by compression of the umbilical cord.

## How to recognise it
- **Onset:** abrupt, less than 30 seconds from onset to nadir.
- **Depth:** at least 15 bpm below baseline, lasting 15 seconds to under 2 minutes.
- **Shape and timing:** vary from contraction to contraction; may occur without contractions.
- **Shoulders:** short accelerations before and after (a sign that the fetus is compensating).
- **Worrisome features:** slow return to baseline, deep drops, loss of variability, "overshoot."

## Common causes
- Cord around the neck or body, or a short or prolapsed cord
- Low amniotic fluid (oligohydramnios), including after membrane rupture
- Fetal movement and maternal position

## Nursing priorities
1. Change the maternal position (side-lying or hands-and-knees) to relieve cord pressure.
2. Stop oxytocin if infusing; give an IV fluid bolus and oxygen per policy.
3. Perform a vaginal exam to check for **cord prolapse** after rupture of membranes; if prolapse is present, call for help, keep the examiner's hand lifting the presenting part off the cord, and prepare for emergency cesarean birth.
4. Notify the provider, and anticipate amnioinfusion for low fluid.
5. Prepare for expedited delivery if the pattern persists or worsens; document.

## Exam tip
> **Variable = Cord.** Abrupt V-shaped drops that "vary": change position first, and rule out prolapse.`,
  },
  {
    key: "fhr-prolonged-decel",
    exam: "nclex-rn",
    category: FHR,
    title: "Prolonged deceleration",
    summary: "A single deep drop in fetal heart rate lasting 2 to 10 minutes needs immediate evaluation and intervention.",
    tags: ["labor", "fetal monitoring", "decelerations", "emergency"],
    body: `## What you are seeing
A single deep drop of the fetal heart rate that lasts several minutes before slowly returning to baseline. By NICHD definition, a prolonged deceleration lasts 2 minutes or more but under 10 minutes; at 10 minutes or longer it is considered a change in baseline. This is an emergency until a cause is found.

## How to recognise it
- **Depth:** at least 15 bpm below baseline.
- **Duration:** 2 minutes or more, less than 10 minutes.
- **Shape:** slow, sustained fall and recovery.
- **Classification:** a Category II tracing, or Category III if it is recurrent with absent variability.

## Common causes
- Umbilical cord prolapse or compression
- Uterine rupture or placental abruption
- Maternal hypotension (for example after epidural), supine position
- Uterine tachysystole, rapid descent, a vaginal examination or maternal seizure

## Nursing priorities
1. **Stay with the patient, call for help** and notify the provider immediately.
2. Reposition the mother to a lateral position and stop oxytocin if infusing.
3. Give an IV fluid bolus and oxygen per policy; check maternal vital signs, blood pressure and contraction pattern.
4. Perform a vaginal exam for cord prolapse or rapid cervical change; if a cord is felt, lift the presenting part off the cord and prepare for emergency cesarean.
5. If it does not resolve, prepare for expedited delivery; document the time, interventions and response.

## Exam tip
> **Long drop = act fast.** Position, stop oxytocin, fluids, oxygen, check for cord prolapse, and call the provider.`,
  },
  {
    key: "fhr-minimal-variability",
    exam: "nclex-rn",
    category: FHR,
    title: "Absent / minimal variability",
    summary: "A flat baseline near 150 bpm with no variability or accelerations suggests fetal compromise or sleep or drugs.",
    tags: ["labor", "fetal monitoring", "variability"],
    body: `## What you are seeing
A flat fetal heart rate baseline near 150 bpm with almost no beat-to-beat variability and no accelerations. Variability is the best sign of fetal brain and heart oxygenation, so loss of it is concerning, particularly if combined with recurrent decelerations.

## How to recognise it
- **Absent variability:** amplitude undetectable.
- **Minimal variability:** amplitude 5 bpm or less.
- **Moderate variability:** 6 to 25 bpm (normal).
- **Accelerations:** none.
- **Significance:** absent variability with recurrent late or variable decelerations, or bradycardia, is a Category III tracing.

## Common causes
- Fetal sleep cycle (usually 20 to 40 minutes)
- Maternal medications such as opioids, magnesium sulfate and sedatives
- Prematurity
- Fetal hypoxia and acidemia, infection or anomalies

## Nursing priorities
1. Assess the patient and check maternal vital signs; review recent medications.
2. Reposition to the side, give an IV fluid bolus and oxygen per policy, and stop oxytocin if infusing.
3. Try gentle stimulation (for example, fetal scalp or vibroacoustic stimulation) as per policy and provider order to check for accelerations.
4. Notify the provider, and discuss ancillary tests.
5. If variability remains absent with decelerations, prepare for expedited delivery; document accurately.

## Exam tip
> **Variability is the key sign of fetal wellbeing.** Absent variability with recurrent decelerations is Category III and needs urgent action.`,
  },

  // ---------- Diagrams ----------
  {
    key: "diagram-conduction-system",
    exam: "nclex-rn",
    category: ECG,
    title: "Cardiac conduction system",
    summary: "The pathway from the SA node through the AV node, His bundle, bundle branches and Purkinje fibers.",
    tags: ["conduction system", "anatomy", "ecg basics"],
    body: `## What you are seeing
A schematic of the heart showing the electrical pathway that coordinates each heartbeat. The impulse begins at the SA node, travels across the atria, pauses at the AV node, then races down the ventricles through specialized fibers so that the ventricles contract from the bottom upward.

## Key parts
- **SA node (sinoatrial):** the natural pacemaker in the right atrium; fires 60 to 100 times per minute.
- **Atrial pathways:** spread the impulse across the atria (the P wave).
- **AV node:** slows the impulse briefly, letting the ventricles fill; intrinsic rate 40 to 60 per minute (the junction).
- **Bundle of His:** carries the impulse from the AV node into the ventricles.
- **Right and left bundle branches:** run down each side of the septum.
- **Purkinje fibers:** spread the impulse through the ventricular muscle; intrinsic rate 20 to 40 per minute.

## Common causes
Conduction problems arise when the SA node fails (bradycardia, sinus arrest), when the AV node or His-Purkinje system is blocked (heart blocks), or when ischemia, scarring, electrolyte imbalance or drugs interfere with the pathway.

## Nursing priorities
1. Understand the normal sequence so you can recognise which part is failing on an ECG.
2. Assess the patient first for pulse, blood pressure and symptoms before interpreting a rhythm.
3. Know that when the SA node fails, lower sites take over as backup pacemakers at slower rates.
4. Monitor drugs that affect conduction (digoxin, beta blockers, calcium channel blockers).
5. Report new heart block or bradycardia and prepare for pacing if symptomatic.

## Exam tip
> **SA, AV, His, Bundle branches, Purkinje.** Intrinsic rates fall as you go down: SA 60-100, AV 40-60, ventricles 20-40.`,
  },
  {
    key: "diagram-pressure-injury-stages",
    exam: "nclex-rn",
    category: "Skin, wounds & burns",
    title: "Pressure injury stages 1–4",
    summary: "Four skin cross-sections showing how pressure injuries deepen from redness to exposed muscle and bone.",
    tags: ["pressure injury", "wound care", "skin"],
    body: `## What you are seeing
Four side-by-side skin cross-sections showing how a pressure injury deepens. Stages are named by the deepest tissue visible; a wound is never "reverse staged" as it heals, but described by its current appearance.

## Key parts
- **Stage 1:** intact skin with non-blanchable redness. Skin may feel warm, firm or painful. On darker skin tones, look for color change or temperature difference.
- **Stage 2:** partial-thickness skin loss with exposed dermis, a shallow open ulcer or an intact or ruptured blister. No slough or eschar.
- **Stage 3:** full-thickness skin loss into subcutaneous fat. Slough may be present; no exposed muscle, tendon or bone.
- **Stage 4:** full-thickness loss with exposed or palpable muscle, tendon, ligament, cartilage or bone; often with slough, eschar, undermining and tunneling.
- **Unstageable and deep tissue injury:** the base is covered by slough or eschar, or there is persistent deep red or purple discoloration.

## Common causes
Prolonged pressure over bony prominences (sacrum, heels, hips), shear and friction, moisture, poor nutrition, immobility, reduced sensation and poor perfusion.

## Nursing priorities
1. Relieve pressure immediately: reposition at least every 2 hours (more often for high-risk patients) and use pressure-redistributing surfaces.
2. Assess the skin daily and use a risk tool such as the Braden Scale.
3. Keep skin clean and dry, manage incontinence and avoid massaging reddened areas.
4. Optimize nutrition and hydration (protein, calories, vitamin C and zinc as indicated).
5. Dress wounds per stage and order, document size, depth, drainage and appearance, and report worsening or infection.

## Exam tip
> **Stage 1 = red and intact; 2 = blister or shallow; 3 = fat; 4 = muscle or bone.** Do not massage red areas; offload pressure.`,
  },
  {
    key: "diagram-burn-depth",
    exam: "nclex-rn",
    category: "Skin, wounds & burns",
    title: "Burn depth classification",
    summary: "Superficial, partial-thickness and full-thickness burns, defined by how deeply the skin layers are injured.",
    tags: ["burns", "wound care", "skin"],
    body: `## What you are seeing
Three skin cross-sections showing burns of increasing depth: superficial (epidermis only), partial thickness (into the dermis) and full thickness (through the dermis into subcutaneous tissue). Depth determines pain, healing and need for grafting.

## Key parts
- **Superficial (first degree):** epidermis only. Red, dry, painful and no blisters, like sunburn. Heals in about 3 to 7 days without scarring.
- **Partial thickness (second degree):** into the dermis. Red or mottled, moist, blistered and very painful. Superficial partial thickness heals in 2 to 3 weeks; deep partial thickness heals more slowly and may scar or need grafting.
- **Full thickness (third degree):** through the dermis into fat. White, brown, leathery or charred, dry and **painless** because nerve endings are destroyed; needs grafting.
- **Deeper (fourth degree):** extends to muscle or bone.

## Common causes
Thermal injury (flame, scald, contact), chemical, electrical and radiation burns. Scalds are common in children; flame and inhalation injury in house fires.

## Nursing priorities
1. Stop the burning process and ensure safety; assess airway, breathing and circulation first, watching for inhalation injury (singed hair, soot, hoarseness).
2. Give high-flow oxygen as indicated and establish IV access.
3. Cool minor burns with cool running water and cover with a clean dry dressing; remove jewelry and clothing; do not apply ice or butter.
4. Estimate burn size (rule of nines or Lund-Browder) and anticipate fluid resuscitation with careful monitoring of urine output.
5. Provide pain control, prevent infection, maintain warmth, give tetanus prophylaxis and document.

## Exam tip
> **Painless, leathery burn = full thickness.** Painful and blistered = partial thickness; airway comes first.`,
  },
  {
    key: "diagram-chest-drainage",
    exam: "nclex-rn",
    category: "Procedures & equipment",
    title: "Three-chamber chest drainage system",
    summary: "Collection, water-seal and suction-control chambers, and how to read bubbling and tidaling.",
    tags: ["chest tube", "equipment", "respiratory"],
    body: `## What you are seeing
A schematic of a chest drainage unit connected to the patient. It lets air and fluid leave the pleural space while preventing air from returning, so the lung can re-expand.

## Key parts
- **Collection chamber:** receives drainage from the chest. Mark the level, time and date on each assessment; note color and amount.
- **Water-seal chamber:** a one-way valve filled with water (usually to the 2 cm line). It lets air out but not back in.
- **Tidaling:** the water level rises with inspiration and falls with expiration in a spontaneously breathing patient; it confirms a patent system. Tidaling may be absent when the lung re-expands.
- **Air-leak bubbling:** bubbles in the water-seal chamber show air leaving the pleural space. Intermittent bubbling is expected with a pneumothorax; continuous bubbling suggests a leak.
- **Suction-control chamber:** water level sets the suction level (commonly minus 20 cm H2O); gentle, steady bubbling is expected when suction is on.

## Common causes
Chest tubes are placed for pneumothorax, hemothorax, pleural effusion, empyema and after chest surgery.

## Nursing priorities
1. Assess the patient: respiratory rate, oxygen saturation, breath sounds, chest pain and subcutaneous emphysema.
2. Keep the unit **upright and below the level of the chest**, and keep tubing free of kinks and dependent loops.
3. **Never clamp** the tube unless ordered; if a tube disconnects, place the end in sterile water or saline, and if it is dislodged, cover the site with a sterile dressing taped on three sides.
4. Document drainage, bubbling and tidaling each shift; report a sudden large bloody output or continuous bubbling.
5. Encourage deep breathing and coughing, mobilize safely, and keep spare supplies at the bedside.

## Exam tip
> **Tidaling = patent system; continuous bubbling in the water seal = air leak.** Keep the unit below the chest and never clamp without an order.`,
  },
];
