export type SeedCheatSheet = { exam: string; category: string; topic: string; title: string; summary: string; body: string; readMinutes: number };

const PA = "Physiological Adaptation";
const PH = "Pharmacological and Parenteral Therapies";
const RR = "Reduction of Risk Potential";
const MC = "Management of Care";
const SI = "Safety and Infection Control";
const HP = "Health Promotion and Maintenance";
const PS = "Psychosocial Integrity";
const BC = "Basic Care and Comfort";

export const CHEATSHEETS: SeedCheatSheet[] = [
  {
    exam: "nclex-rn", category: PA, topic: "Fluid and electrolyte imbalance",
    title: "Potassium: Hypokalemia vs Hyperkalemia",
    summary: "Normal K+ is typically 3.5-5.0 mEq/L; both extremes threaten the heart.",
    readMinutes: 2,
    body: `> **Remember:** Low K+ = everything slows and sags (weak, flat T, ileus). High K+ = peaked T and arrhythmias.

| | Hypokalemia (<3.5) | Hyperkalemia (>5.0) |
|---|---|---|
| Causes | Loop/thiazide diuretics, vomiting, diarrhea, NG suction, insulin | Kidney failure, K-sparing diuretics, ACE inhibitors, burns, crush injury |
| Signs | Weakness, leg cramps, constipation, ileus, shallow breathing | Muscle weakness, diarrhea, paresthesias, bradycardia |
| ECG | Flattened T, U wave, ST depression | Tall peaked T, wide QRS, loss of P wave |
| Treatment | Replace K+ (oral preferred), treat cause | Stop K+ sources, insulin + dextrose, calcium gluconate, sodium polystyrene or patiromer, dialysis |

### Nursing priorities
- Never give IV potassium as a bolus or push; dilute and use a pump.
- Confirm urine output is adequate (at least 30 mL/hr) before giving K+.
- Typical IV rate ceiling is 10 mEq/hr on a general unit; use a central line and monitor for stronger concentrations.
- Place on cardiac monitor with a K+ below about 3.0 or above 6.0.
- Teach potassium-rich foods (banana, potato, oranges) for low K+; avoid them for high K+.

### Red flags — act now
- Peaked T waves, widening QRS or new arrhythmia: call the provider, give calcium as ordered to protect the myocardium.
- Burning or pain at an IV site receiving potassium: stop the infusion.`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Fluid and electrolyte imbalance",
    title: "Sodium: Hyponatremia vs Hypernatremia",
    summary: "Sodium (typically 135-145 mEq/L) problems are water-balance problems that show up as brain changes.",
    readMinutes: 2,
    body: `> **Remember:** Sodium problems are brain problems. Low Na+ = cells swell (confusion, seizures). High Na+ = cells shrink (thirst, agitation).

| | Hyponatremia (<135) | Hypernatremia (>145) |
|---|---|---|
| Causes | SIADH, excess water or D5W, diuretics, vomiting, heart failure | Dehydration, diabetes insipidus, high salt intake, poor access to water |
| Early signs | Headache, nausea, muscle cramps | Thirst, dry sticky mucosa, flushed skin |
| Late signs | Confusion, seizures, coma | Restlessness, agitation, seizures, coma |
| Treatment | Fluid restriction if SIADH or overloaded; hypertonic saline only for severe symptoms | Hypotonic fluid (0.45% saline or D5W) given slowly |

### Nursing priorities
- Correct sodium slowly. Typically no more than 8-10 mEq/L in 24 hours; fast shifts cause cerebral edema or osmotic demyelination.
- Daily weights, strict intake and output, neuro checks.
- SIADH: concentrated urine, weight gain without edema; restrict fluids.
- Diabetes insipidus: huge dilute urine output; give desmopressin as ordered.
- Seizure precautions with severe imbalance.

### Red flags — act now
- New confusion, seizure or decreasing level of consciousness.
- Sodium below about 120 or above 160 mEq/L.
- Urine output over 200 mL/hr in a client with head injury (think diabetes insipidus).`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Fluid and electrolyte imbalance",
    title: "Calcium: Hypocalcemia vs Hypercalcemia",
    summary: "Calcium (typically 8.5-10.5 mg/dL) controls nerve and muscle excitability.",
    readMinutes: 2,
    body: `> **Remember:** Low calcium = *tetany* (twitchy, Chvostek and Trousseau). High calcium = *stones, bones, groans, moans* (slow and sleepy).

| | Hypocalcemia (<8.5) | Hypercalcemia (>10.5) |
|---|---|---|
| Causes | Hypoparathyroidism, thyroid or neck surgery, pancreatitis, low vitamin D, massive transfusion | Hyperparathyroidism, malignancy, immobility, thiazides, excess vitamin D |
| Signs | Tingling around mouth, muscle spasm, hyperactive reflexes, laryngospasm, seizures | Weakness, lethargy, constipation, kidney stones, bone pain, hyporeflexia |
| ECG | Prolonged QT | Shortened QT, AV block |
| Treatment | IV calcium gluconate, oral calcium + vitamin D | IV saline hydration, loop diuretics, calcitonin, bisphosphonates |

### Nursing priorities
- Chvostek sign: tapping the facial nerve causes facial twitch. Trousseau sign: inflating a BP cuff causes carpopedal spasm. Both indicate low calcium.
- After thyroidectomy, watch for tingling and spasm for 24-72 hours.
- Give IV calcium slowly on a monitor; it can cause bradycardia and tissue necrosis if it infiltrates.
- Hypercalcemia: push fluids, encourage mobility, strain urine for stones.
- Calcium and phosphate move in opposite directions.

### Red flags — act now
- Stridor, laryngospasm or seizure with low calcium: call for help, airway first.
- Digoxin plus high calcium raises toxicity risk.`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Fluid and electrolyte imbalance",
    title: "Magnesium: Hypomagnesemia vs Hypermagnesemia",
    summary: "Magnesium (typically 1.5-2.5 mg/dL) imbalances mirror calcium and potassium problems.",
    readMinutes: 2,
    body: `> **Remember:** Magnesium is the calming mineral. High Mg = *everything slows* (reflexes, breathing, heart). Low Mg = *everything is twitchy*.

| | Hypomagnesemia (<1.5) | Hypermagnesemia (>2.5) |
|---|---|---|
| Causes | Alcohol use disorder, malnutrition, diarrhea, loop diuretics, PPIs | Kidney failure, magnesium antacids and laxatives, IV magnesium sulfate |
| Signs | Tremor, hyperreflexia, tetany, seizures, torsades | Hypotension, flushing, lethargy, absent reflexes, slow respirations |
| ECG | Prolonged QT, torsades de pointes | Prolonged PR, wide QRS, bradycardia |
| Treatment | Oral or IV magnesium, fix low K+ and Ca2+ too | Stop magnesium, IV calcium gluconate, fluids and diuretics, dialysis |

### Nursing priorities
- Low Mg often coexists with low K+ and low Ca2+; replacing only one may fail.
- During IV magnesium sulfate, check deep tendon reflexes, respiratory rate (at least 12/min) and urine output (at least 30 mL/hr) before each dose or hourly.
- Keep calcium gluconate at the bedside as the antidote.
- Avoid magnesium-containing antacids and laxatives in kidney disease.
- Seizure precautions and cardiac monitoring for low Mg.

### Red flags — act now
- Loss of patellar reflex, respiratory rate under 12, oliguria: stop the infusion and notify the provider.
- Polymorphic ventricular tachycardia (torsades): IV magnesium is the treatment.`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Acid-base balance",
    title: "ABG Interpretation and ROME",
    summary: "Read pH first, then CO2 and HCO3, and decide which one explains the change.",
    readMinutes: 3,
    body: `> **Remember:** **ROME** — **R**espiratory **O**pposite, **M**etabolic **E**qual. In respiratory problems pH and CO2 move in opposite directions; in metabolic problems pH and HCO3 move the same direction.

Typical normals: pH 7.35-7.45, PaCO2 35-45 mmHg, HCO3 22-26 mEq/L, PaO2 80-100 mmHg.

### Three-step method
1. pH: below 7.35 acidosis, above 7.45 alkalosis.
2. Which value matches the pH? Low pH with high CO2 = respiratory; low pH with low HCO3 = metabolic.
3. Compensation: the other system moves to push pH back. Partly compensated = pH still abnormal; fully compensated = pH back in normal range (usually near the edge).

| Disorder | pH | CO2 | HCO3 |
|---|---|---|---|
| Respiratory acidosis | Low | High | Normal (or high if compensating) |
| Respiratory alkalosis | High | Low | Normal (or low if compensating) |
| Metabolic acidosis | Low | Normal (or low if compensating) | Low |
| Metabolic alkalosis | High | Normal (or high if compensating) | High |

### Common causes
- Resp. acidosis: hypoventilation, COPD, opioid overdose, sedation.
- Resp. alkalosis: anxiety, pain, hyperventilation, early sepsis, fever.
- Metabolic acidosis: DKA, renal failure, diarrhea, shock (lactic).
- Metabolic alkalosis: vomiting, NG suction, antacid overuse, diuretics.

### Nursing priorities
- Treat the cause, support airway and breathing first.
- Acidosis raises K+; alkalosis lowers K+ and ionized calcium.
- Hypoxemia is a low PaO2, judged separately from acid-base status.`
  },
  {
    exam: "nclex-rn", category: RR, topic: "Laboratory values",
    title: "Normal Lab Values: Must-Knows",
    summary: "Typical adult reference ranges worth memorizing; always check the lab's own range.",
    readMinutes: 2,
    body: `> **Remember:** Know the numbers that drive action: K+, Na+, glucose, creatinine, Hgb, platelets, WBC, INR, aPTT.

| Test | Typical adult range | Test | Typical adult range |
|---|---|---|---|
| Sodium | 135-145 mEq/L | Potassium | 3.5-5.0 mEq/L |
| Calcium | 8.5-10.5 mg/dL | Magnesium | 1.5-2.5 mg/dL |
| Chloride | 98-106 mEq/L | Phosphate | 2.5-4.5 mg/dL |
| Glucose (fasting) | 70-100 mg/dL | BUN | 10-20 mg/dL |
| Creatinine | 0.6-1.2 mg/dL | WBC | 4,500-11,000/mm3 |
| Hemoglobin | F 12-16, M 14-18 g/dL | Hematocrit | F 36-48%, M 42-52% |
| Platelets | 150,000-400,000/mm3 | INR (no anticoagulant) | 0.8-1.2 |
| aPTT | 30-40 sec | Troponin | Typically below the lab's cutoff |
| HbA1c | Below 5.7% | Albumin | 3.5-5.0 g/dL |

### Nursing priorities
- Compare new results with the baseline trend, not just the range.
- Therapeutic targets: INR 2-3 (most warfarin indications), aPTT 1.5-2.5 times control on heparin.
- Creatinine and BUN rise with dehydration and kidney injury; BUN alone rises with GI bleeding or high protein.
- A high WBC suggests infection; a low neutrophil count (ANC under 500) means severe neutropenia.

### Red flags — act now
- Critical values: K+ under 3.0 or over 6.0, glucose under 50 or over 400, platelets under 20,000, INR above 4-5.
- Report critical results to the provider promptly and document read-back.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "IV fluids",
    title: "IV Fluid Types: Isotonic, Hypotonic, Hypertonic",
    summary: "Match the fluid tonicity to where the water needs to go: vascular space, cells, or out of cells.",
    readMinutes: 2,
    body: `> **Remember:** Isotonic stays in the vessels (expands volume). Hypotonic pushes water into cells. Hypertonic pulls water out of cells.

| Type | Examples | Main uses | Watch for |
|---|---|---|---|
| Isotonic | 0.9% NaCl, Lactated Ringer's, D5W (initially) | Hypovolemia, hemorrhage (with blood), dehydration, DKA start | Fluid overload, edema, heart failure |
| Hypotonic | 0.45% NaCl, 0.33% NaCl | Hypernatremia, cellular dehydration (e.g. DKA after initial resuscitation) | Cerebral edema, hypotension, low BP |
| Hypertonic | 3% NaCl, D5 0.9% NaCl, D10W | Severe symptomatic hyponatremia, specific nutrition needs | Overload, high sodium, vein irritation |

### Key points
- D5W is isotonic in the bag but acts as free water once the dextrose is metabolized, so treat it as hypotonic.
- Lactated Ringer's contains potassium and calcium; avoid in severe liver disease and be cautious in kidney failure.
- Do not give hypotonic fluids to clients with increased ICP or third-spacing.
- Colloids (albumin) pull fluid into the vascular space and help in low albumin states.

### Nursing priorities
- Check the order, fluid type, rate and compatibility; verify the bag with a second nurse for high-risk fluids.
- Monitor lung sounds, edema, weight, I and O, and serum sodium.
- Assess the IV site for infiltration and phlebitis every shift or per policy.

### Red flags — act now
- Crackles, dyspnea, JVD with infusion: slow or stop and call the provider (fluid overload).
- 3% saline requires a pump, close monitoring and often an ICU or step-down setting.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "Insulin",
    title: "Insulin Types: Onset, Peak, Duration",
    summary: "Know which insulins are rapid, short, intermediate and long acting and when hypoglycemia is most likely.",
    readMinutes: 2,
    body: `> **Remember:** Hypoglycemia risk is highest at the **peak**. Clear (regular) insulin is the only one given IV; cloudy (NPH) is the one that gets mixed.

| Type | Examples | Onset | Peak | Duration |
|---|---|---|---|---|
| Rapid-acting | Lispro, aspart, glulisine | 10-30 min | 30 min-3 hr | 3-5 hr |
| Short-acting | Regular | 30-60 min | 2-5 hr | 5-8 hr |
| Intermediate | NPH | 1-2 hr | 4-12 hr | 14-24 hr |
| Long-acting | Glargine, detemir, degludec | 1-2 hr | Little or no peak | 20-42+ hr |

Values are approximate and vary by product; check the label.

### Key points
- Rapid-acting: give within 15 minutes of a meal (or right at the meal).
- Never mix long-acting glargine with other insulins in one syringe.
- When mixing: draw up clear (regular) before cloudy (NPH). Mnemonic: **clear to cloudy** (or "regular before NPH").
- Rotate injection sites; avoid lipohypertrophy. Abdomen absorbs fastest.
- Do not shake NPH vials; roll gently to resuspend.
- Verify high-alert insulin doses with a second nurse per policy.

### Nursing priorities
- Check blood glucose before each dose and before meals.
- Teach hypoglycemia treatment (15 g fast carb, recheck in 15 min) and sick-day rules: do not stop basal insulin.
- Hold and call if the client is NPO unless the order says otherwise.

### Red flags — act now
- Sweating, shakiness, confusion, glucose under 70: treat immediately.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "Anticoagulants",
    title: "Anticoagulants and Monitoring",
    summary: "Heparin, warfarin, enoxaparin and DOACs: what lab to follow and which antidote to know.",
    readMinutes: 3,
    body: `> **Remember:** **H**eparin = **a**PTT, **W**arfarin = **I**NR (**H**ep-**a**, **W**ar-**I**). Know the antidote for each.

| Drug | Monitor | Target (typical) | Antidote |
|---|---|---|---|
| Unfractionated heparin | aPTT (or anti-Xa) | 1.5-2.5 times control | Protamine sulfate |
| Warfarin | INR | 2.0-3.0 (2.5-3.5 for mechanical valves) | Vitamin K, prothrombin complex concentrate, fresh frozen plasma |
| Enoxaparin (LMWH) | Usually none; check platelets and renal function | n/a | Protamine (partial reversal) |
| Apixaban, rivaroxaban (Xa inhibitors) | Renal function, CBC | n/a | Andexanet alfa or PCC |
| Dabigatran | Renal function, CBC | n/a | Idarucizumab |

### Key points
- Warfarin takes 3-5 days to work; bridge with heparin or LMWH if needed.
- Consistent vitamin K intake, not avoidance, for warfarin clients.
- Heparin-induced thrombocytopenia: platelets fall by over 50% or below 100,000; stop heparin and call provider.
- Enoxaparin: do not expel the air bubble from a prefilled syringe; inject into abdomen, do not rub.
- Hold NSAIDs, aspirin and herbal supplements such as ginkgo and garlic unless ordered.

### Nursing priorities
- Use a soft toothbrush, electric razor; teach bleeding precautions.
- Check labs before each heparin rate change; follow protocol.
- Observe for hematuria, black stools, bruising, headache (possible intracranial bleed).

### Red flags — act now
- Sudden severe headache, confusion, or neuro change on anticoagulants: emergency, stop the drug and call.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "Antidotes",
    title: "Antidote Quick List",
    summary: "Fast pairing of common toxic drugs with their reversal agents.",
    readMinutes: 2,
    body: `> **Remember:** Match the poison to the antidote in one second. Then think airway, breathing, circulation.

| Toxin or drug | Antidote | Key note |
|---|---|---|
| Acetaminophen | Acetylcysteine | Best within 8 hr of ingestion |
| Opioids | Naloxone | Short half-life; may need repeat doses |
| Benzodiazepines | Flumazenil | Can trigger seizures; avoid in chronic use |
| Heparin | Protamine sulfate | Give slowly; watch for hypotension |
| Warfarin | Vitamin K | Onset takes hours; PCC for urgent reversal |
| Digoxin | Digoxin immune fab | Treat for K+ over 5 with toxicity |
| Beta-blocker, calcium channel blocker | Glucagon, calcium | Calcium for CCB overdose |
| Magnesium sulfate | Calcium gluconate | Keep at bedside during infusion |
| Iron | Deferoxamine | Urine may turn reddish-orange |
| Methotrexate | Leucovorin | Rescue therapy |
| Organophosphates | Atropine and pralidoxime | Treat SLUDGE signs |
| Cyanide | Hydroxocobalamin | Also sodium thiosulfate |
| Ethylene glycol, methanol | Fomepizole | Dialysis if severe |
| Tricyclic antidepressants | Sodium bicarbonate | For wide QRS |

### Nursing priorities
- Support ABCs first, then give the antidote; do not delay for lab confirmation in a clear overdose.
- Know the half-life of the toxin versus the antidote; the toxin may outlast the reversal agent, so keep monitoring.
- Contact Poison Control and document time of ingestion, amount and substance.

### Red flags — act now
- Re-sedation after naloxone wears off; observe at least 2 hours and until stable.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "Cardiac medications",
    title: "Cardiac Drugs at a Glance",
    summary: "Digoxin, beta-blockers, ACE inhibitors/ARBs, CCBs, nitrates and amiodarone: key effects and checks.",
    readMinutes: 3,
    body: `> **Remember:** Check pulse and BP before every cardiac drug. Hold and call if the pulse is under 60 (digoxin, beta-blockers, many CCBs) or systolic BP is below the ordered parameter.

| Drug class | Examples | Key effect or use | Watch for |
|---|---|---|---|
| Digoxin | Digoxin | Slows rate, stronger contraction | Level 0.5-2.0 ng/mL; nausea, vision changes (yellow halos), low K+ raises toxicity |
| Beta-blockers | Metoprolol, carvedilol | Lower HR and BP | Bradycardia, bronchospasm, masks hypoglycemia; do not stop abruptly |
| ACE inhibitors | Lisinopril, enalapril | Lower BP, protect kidneys and heart | Dry cough, hyperkalemia, angioedema, avoid in pregnancy |
| ARBs | Losartan, valsartan | Like ACE inhibitors without cough | Hyperkalemia, angioedema (rare) |
| CCBs | Amlodipine, diltiazem, verapamil | Vasodilation, slow AV conduction | Edema, constipation (verapamil), bradycardia |
| Nitrates | Nitroglycerin | Dilate veins, relieve angina | Headache, hypotension; no PDE-5 inhibitors (sildenafil) |
| Amiodarone | Amiodarone | Antiarrhythmic | Pulmonary toxicity, thyroid and liver problems, photosensitivity |

### Nursing priorities
- Sublingual nitroglycerin: 1 tablet every 5 min up to 3 doses; call 911 if pain is not relieved 5 minutes after the first dose.
- Store nitroglycerin tablets in the original dark glass bottle.
- Teach to rise slowly; monitor weight and K+ with heart failure drugs.
- Amiodarone: baseline chest X-ray, TSH, liver tests.

### Red flags — act now
- Digoxin toxicity: bradycardia, new arrhythmias, visual changes; check level and K+.
- Lip or tongue swelling on an ACE inhibitor: airway emergency.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "Diuretics",
    title: "Diuretics: Loop, Thiazide, Potassium-Sparing",
    summary: "How each class affects potassium, and what to monitor.",
    readMinutes: 2,
    body: `> **Remember:** Loop and thiazide **waste** potassium; spironolactone **spares** it. "Spiro" = **s**pares **p**otassium.

| Class | Examples | Potassium | Other effects |
|---|---|---|---|
| Loop | Furosemide, bumetanide, torsemide | Lowers K+, Mg2+, Ca2+ | Powerful; ototoxicity with rapid IV push; hypovolemia |
| Thiazide | Hydrochlorothiazide, chlorthalidone | Lowers K+ and Na+ | Raises Ca2+, glucose, uric acid; first-line for hypertension |
| Potassium-sparing | Spironolactone, eplerenone, triamterene | Raises K+ | Gynecomastia with spironolactone; hyperkalemia risk |
| Osmotic | Mannitol | Variable | Used for increased ICP; watch for heart failure |

### Key points
- Furosemide IV push: give slowly (typically 20 mg/min or less) to reduce ototoxicity.
- Give in the morning to avoid nocturia.
- Spironolactone plus ACE inhibitor or potassium supplement is a hyperkalemia risk.
- Thiazides are weak in kidney failure; loops still work.

### Nursing priorities
- Daily weight (same scale, morning, after voiding); 1 kg loss is about 1 L of fluid.
- Monitor I and O, BP, orthostatic changes, K+, Na+, creatinine.
- Teach potassium-rich foods with loop and thiazide drugs unless a K+ supplement is ordered.
- Watch for digoxin toxicity if K+ is low.

### Red flags — act now
- Signs of hypovolemia: dizziness, hypotension, tachycardia, low urine output.
- Muscle weakness, cramps or arrhythmia from electrolyte loss.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "Antibiotics",
    title: "Antibiotic Toxicities to Know",
    summary: "The key adverse effect and monitoring for each major antibiotic class.",
    readMinutes: 2,
    body: `> **Remember:** Match the class to the organ that gets hurt: aminoglycosides hit ears and kidneys; vancomycin hits kidneys and gives red man syndrome; fluoroquinolones hit tendons.

| Class | Examples | Key toxicity | Monitoring or teaching |
|---|---|---|---|
| Aminoglycosides | Gentamicin, tobramycin | Nephrotoxicity, ototoxicity | Peak and trough levels, creatinine, hearing, hydrate |
| Vancomycin | Vancomycin | Red man syndrome, nephrotoxicity | Infuse over 60 min or longer; trough or AUC monitoring |
| Fluoroquinolones | Ciprofloxacin, levofloxacin | Tendon rupture, QT prolongation, C. difficile | Stop and rest if tendon pain; separate from antacids and dairy |
| Tetracyclines | Doxycycline | Photosensitivity, tooth staining | Avoid in pregnancy and children under 8; separate from calcium |
| Macrolides | Azithromycin | QT prolongation, GI upset | Report palpitations |
| Penicillins and cephalosporins | Amoxicillin, ceftriaxone | Allergy, anaphylaxis, C. difficile | Ask about allergy first; up to 10% cross-reactivity with penicillin |
| Sulfonamides | Trimethoprim-sulfamethoxazole | Rash, Stevens-Johnson, hyperkalemia | Increase fluids; report rash |
| Metronidazole | Metronidazole | Metallic taste, disulfiram-like reaction | No alcohol during and for 48 hr after |
| Clindamycin | Clindamycin | C. difficile colitis | Report severe diarrhea |

### Nursing priorities
- Obtain cultures before the first dose; do not delay antibiotics in sepsis.
- Complete the full prescription; watch for superinfection (thrush, yeast).

### Red flags — act now
- Anaphylaxis, stridor, hypotension: stop drug, give epinephrine as ordered.
- Flushing and rash during vancomycin: slow the infusion.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "Psychotropic medications",
    title: "Psychotropics: Lithium, MAOIs, SSRIs",
    summary: "Therapeutic ranges, toxicity signs and key dietary or drug interactions for psychiatric medications.",
    readMinutes: 3,
    body: `> **Remember:** Lithium needs **salt and water** (steady sodium, drink fluids). MAOIs need **no tyramine**. SSRIs + other serotonergic drugs = **serotonin syndrome**.

| Drug | Key points | Danger |
|---|---|---|
| Lithium | Therapeutic level typically 0.6-1.2 mEq/L; draw 12 hr after dose | Toxicity above 1.5: coarse tremor, vomiting, diarrhea, confusion, ataxia, seizures |
| MAOIs | Phenelzine, tranylcypromine | Hypertensive crisis with tyramine (aged cheese, cured meats, tap beer, soy sauce) |
| SSRIs | Sertraline, fluoxetine | Serotonin syndrome, hyponatremia, sexual dysfunction, bleeding; effect takes 4-6 weeks |
| TCAs | Amitriptyline | Anticholinergic effects, arrhythmias, overdose lethal |
| Antipsychotics (atypical) | Olanzapine, risperidone | Weight gain, metabolic syndrome |
| Antipsychotics (typical) | Haloperidol | EPS, tardive dyskinesia, NMS |
| Benzodiazepines | Lorazepam | Sedation, dependence; avoid with alcohol |

### Key points
- Serotonin syndrome: agitation, tremor, clonus, fever, diarrhea, tachycardia; stop the drugs and give supportive care.
- NMS: fever, severe muscle rigidity, altered mental status; stop antipsychotic, cool the client.
- Low sodium or dehydration raises lithium levels; avoid NSAIDs and thiazides.
- Warn about suicidality early in antidepressant treatment, especially in young adults.
- Never stop an antidepressant or lithium abruptly.

### Nursing priorities
- Check levels and renal and thyroid function with lithium.
- Teach 2-3 L of fluid daily and consistent salt intake.

### Red flags — act now
- Severe headache or elevated BP with an MAOI: hypertensive crisis.
- Fever with rigidity or clonus: call the provider immediately.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "Opioids",
    title: "Opioids and Naloxone",
    summary: "Opioid effects, safe monitoring, and reversal with naloxone.",
    readMinutes: 2,
    body: `> **Remember:** Respiratory rate is the vital sign that kills. Hold opioids and reassess if RR is under 12 (or per policy), sedation is deep or the client is hard to wake.

| Item | Key points |
|---|---|
| Examples | Morphine, hydromorphone, fentanyl, oxycodone, hydrocodone |
| Expected effects | Analgesia, sedation, constipation, nausea, miosis, urinary retention |
| Dangerous effects | Respiratory depression, hypotension, delirium, serotonin syndrome with some opioids |
| Reversal | Naloxone 0.4 mg IV (titrate to breathing, not full wakefulness) |
| Avoid | Meperidine in older adults and kidney disease (seizure-causing metabolite) |

### Sedation scale reminder
- Use a validated tool (e.g. POSS or RASS) before each dose; stop for deep sedation.

### Key points
- Start a bowel regimen with first dose; tolerance does not develop to constipation.
- Do not crush extended-release tablets; long-acting opioids need extra monitoring.
- PCA: only the client presses the button; no family or staff proxy dosing.
- Monitor continuous pulse oximetry and capnography for high-risk clients.
- Tolerance and dependence are expected; addiction is compulsive use despite harm.

### Nursing priorities
- Assess pain before and 30-60 minutes after the dose (IV sooner).
- Teach not to combine with alcohol, benzodiazepines or sedatives.

### Red flags — act now
- Pinpoint pupils, RR under 8, cyanosis: call for help, support ventilation, give naloxone.
- Observe after naloxone because it wears off sooner than many opioids.`
  },
  {
    exam: "nclex-rn", category: PH, topic: "High-alert medications",
    title: "High-Alert Meds, Rights and Calculations",
    summary: "Medication rights, high-alert drug classes and the formulas you must know cold.",
    readMinutes: 3,
    body: `> **Remember:** Check the **rights** every time, three times: when pulling, when preparing, and at the bedside.

### Core rights
- Right client, drug, dose, route, time, documentation.
- Also right reason, response, education and the client's right to refuse.
- Use two identifiers (name + date of birth); never the room number.

### High-alert drug classes
| Group | Examples |
|---|---|
| Anticoagulants | Heparin, warfarin, enoxaparin |
| Insulin | All types and concentrations |
| Opioids | Morphine, hydromorphone, fentanyl |
| Concentrated electrolytes | Potassium chloride, 23.4% sodium chloride |
| Chemotherapy | Cytotoxic agents |
| Neuromuscular blockers, sedatives | Rocuronium, midazolam |

### Formulas
| Calculation | Formula |
|---|---|
| Oral dose | Desired / Have x quantity |
| IV flow rate (mL/hr) | Total volume (mL) / hours |
| Drip rate (gtt/min) | Volume (mL) x drop factor (gtt/mL) / minutes |
| Weight-based dose | Dose per kg x weight in kg |
| Conversions | 1 kg = 2.2 lb; 1 g = 1,000 mg; 1 mg = 1,000 mcg; 1 tsp = 5 mL |

### Nursing priorities
- Independent double-check for high-alert drugs; use a smart pump with drug library.
- Never use abbreviations such as U, IU, QD, trailing zero (5.0 mg) or missing leading zero (.5 mg).
- Questioning an order is your duty; do not give a dose you believe is unsafe.
- If you give a wrong dose: assess client, notify provider, document facts and file an incident report (not in the chart).`
  },
  {
    exam: "nclex-rn", category: SI, topic: "Transmission-based precautions",
    title: "Transmission-Based Precautions",
    summary: "Airborne, droplet and contact precautions: examples, room and PPE.",
    readMinutes: 2,
    body: `> **Remember:** Standard precautions for everyone. Add airborne (MTV: **M**easles, **T**B, **V**aricella), droplet (the big-droplet illnesses), or contact (gastro and skin).

| Type | Examples | Room | PPE |
|---|---|---|---|
| Airborne | Tuberculosis, measles, varicella (chickenpox), disseminated zoster | Negative-pressure room, door closed, 6-12 air changes/hr | N95 or PAPR respirator; client wears surgical mask in transport |
| Droplet | Influenza, pertussis, meningococcal meningitis, mumps, rubella, COVID-19 (often with airborne-style measures) | Private room (or cohort); door may stay open | Surgical mask within 3 ft (about 1 m) |
| Contact | MRSA, VRE, C. difficile, norovirus, scabies, RSV, wound infections | Private room, dedicated equipment | Gown and gloves |

### Key points
- C. difficile and norovirus: wash hands with **soap and water**; alcohol rubs do not kill spores.
- Order of donning: gown, mask or respirator, goggles, gloves. Doffing: gloves, goggles, gown, mask.
- Disseminated shingles needs airborne plus contact; localized zoster needs contact (covered lesions).
- Protective (reverse) isolation is for neutropenia and bone marrow transplant, not for infection spread.

### Nursing priorities
- Fit-tested N95 required for airborne precautions; staff without immunity should not care for measles or varicella clients.
- Limit transport; mask the client when leaving the room.
- Use dedicated stethoscope, BP cuff and thermometer in contact isolation.

### Red flags — act now
- Unrecognized cough with fever and night sweats: place on airborne precautions until TB is ruled out.`
  },
  {
    exam: "nclex-rn", category: MC, topic: "Delegation",
    title: "Delegation: RN, LPN/LVN and UAP",
    summary: "What the RN must keep and what can be delegated, plus the five rights of delegation.",
    readMinutes: 2,
    body: `> **Remember:** The RN keeps what needs **assessment, teaching, evaluation, or nursing judgment**. Stable, routine, predictable tasks can be delegated.

| Role | Can do | Cannot do |
|---|---|---|
| RN | Initial assessment, care planning, teaching, evaluation, IV pushes in unstable clients, triage | Delegate nursing judgment |
| LPN/LVN | Stable clients, reinforce teaching, medications (by most states), dressing changes, tube feedings, reassess stable clients | Initial assessment, care plan, initial teaching, unstable clients |
| UAP/CNA | Vital signs (stable), hygiene, feeding without dysphagia, ambulation, I and O, positioning, glucose checks | Assessment, teaching, medications (varies), sterile procedures |

### Five rights of delegation
1. Right task
2. Right circumstance
3. Right person
4. Right direction and communication
5. Right supervision and evaluation

### Key points
- The RN remains accountable for the delegated task and its outcome.
- Do not delegate an unstable client, a new admission, or a new post-op client to an LPN or UAP.
- Check state scope of practice and facility policy; they vary.
- Never delegate to someone who is not competent for the task.

### Nursing priorities
- Give clear instructions: what to do, how, when to report, and what to report.
- Follow up and evaluate; document the delegation.

### Red flags — act now
- Newly abnormal vital signs or condition change in a stable client: RN reassesses now.`
  },
  {
    exam: "nclex-rn", category: MC, topic: "Prioritization",
    title: "Prioritization Frameworks",
    summary: "ABCs, Maslow, acute vs chronic, unstable vs stable and urgent vs non-urgent.",
    readMinutes: 2,
    body: `> **Remember:** Airway first, then Breathing, then Circulation. Unstable beats stable. Acute beats chronic. Actual beats potential.

| Framework | Rule | Example |
|---|---|---|
| ABC | Airway, breathing, circulation (and disability) | Stridor before chest pain |
| Maslow | Physiological needs, then safety, love, esteem, self-actualization | Pain or hypoxia before education |
| Acute vs chronic | New or sudden change before long-standing | New confusion before chronic COPD cough |
| Unstable vs stable | Abnormal vitals or rapidly changing before steady | Post-op with falling BP before routine dressing |
| Urgent vs non-urgent | Time-critical interventions first | Insulin before a meal vs a routine bath |
| Actual vs potential | Existing problem before a risk | Infection signs before risk for falls |

### Key points
- Apply nursing process: assess before you intervene, unless the client is in immediate danger.
- When two options look equal, the first step is usually assessment.
- Look for the client at risk of dying soonest: airway compromise, severe bleeding, shock, new neuro changes, chest pain with instability.
- Triage colors (typical): red = immediate, yellow = delayed, green = minor, black = expectant.
- Safety before comfort; physiological before psychosocial.

### Nursing priorities
- Ask: which problem threatens life, limb or function most?
- Use time and consider what can be safely delegated.

### Red flags — act now
- Airway obstruction, apnea, hemorrhage, anaphylaxis, ST elevation with instability, sudden neuro deficit.`
  },
  {
    exam: "nclex-rn", category: HP, topic: "Developmental milestones",
    title: "Developmental Milestones: Infant to School Age",
    summary: "Key motor, social and cognitive milestones by age.",
    readMinutes: 3,
    body: `> **Remember:** Head to toe, center to out. Control the head first, then the trunk, then the legs.

| Age | Motor | Social and cognitive |
|---|---|---|
| 2 months | Lifts head when prone | Social smile, follows objects |
| 4 months | Rolls front to back, holds head steady | Laughs, coos, brings hands to midline |
| 6 months | Sits with support, rolls both ways | Stranger awareness begins, babbles |
| 9 months | Sits alone, crawls, pincer grasp starts | Object permanence, separation anxiety peaks |
| 12 months | Walks with support, triples birth weight | First words, waves bye-bye |
| 18 months | Walks well, scribbles, uses spoon | 10+ words, tantrums |
| 2-3 years | Runs, jumps, tricycle at 3 | Two-word then three-word sentences, "no" and toilet training |
| 4-5 years | Hops, buttons, draws person | Imaginative play, magical thinking, wants to please |
| 6-12 years | Skills and sports | Industry vs inferiority, concrete thinking, peer approval |

### Erikson stages (childhood)
- Infant: trust vs mistrust. Toddler: autonomy vs shame. Preschool: initiative vs guilt. School age: industry vs inferiority. Adolescent: identity vs role confusion.

### Nursing priorities
- Birth weight doubles about 5-6 months, triples by 12 months.
- Safety by age: infants (choking, falls, suffocation), toddlers (poisoning, drowning), school age (bicycles, sports).
- Honey is avoided under 12 months (botulism risk).

### Red flags — act now
- Loss of previously acquired skills, no smile by 3 months, no babbling by 9-12 months, no words by 16 months.`
  },
  {
    exam: "nclex-rn", category: RR, topic: "Vital signs",
    title: "Pediatric Vital Signs by Age",
    summary: "Typical heart rate, respiratory rate and blood pressure ranges from newborn to adolescent.",
    readMinutes: 2,
    body: `> **Remember:** Smaller child = faster heart rate and breathing, lower blood pressure. Count for a full minute.

| Age | Heart rate (bpm) | Resp rate (breaths/min) | Systolic BP (typical) |
|---|---|---|---|
| Newborn (0-28 days) | 100-160 | 30-60 | 60-90 |
| Infant (1-12 months) | 100-150 | 30-53 | 70-100 |
| Toddler (1-3 years) | 90-140 | 22-37 | 80-110 |
| Preschool (3-5 years) | 80-120 | 20-28 | 80-110 |
| School age (6-12 years) | 70-110 | 18-25 | 90-120 |
| Adolescent (13-18 years) | 60-100 | 12-20 | 100-130 |

Values vary by source; use the facility's reference.

### Key points
- Apical pulse for a full minute in infants and young children.
- Infants are belly breathers and obligate nose breathers.
- Fever in an infant under 3 months is an emergency; do not give antipyretics before evaluation.
- Hypotension is a late sign of shock in children; tachycardia and poor perfusion come first.
- Use correct cuff size (cuff width about 40% of arm circumference).

### Nursing priorities
- Calm the child first; crying raises HR, RR and BP.
- Assess skin color, capillary refill (under 2-3 seconds), mental status and urine output.
- Normal urine output in infants and children is about 1-2 mL/kg/hr.

### Red flags — act now
- Retractions, grunting, nasal flaring, head bobbing, apnea or HR under 60 with poor perfusion.`
  },
  {
    exam: "nclex-rn", category: HP, topic: "Newborn care",
    title: "Newborn Assessment and APGAR",
    summary: "APGAR scoring, normal newborn findings and first-hours care priorities.",
    readMinutes: 2,
    body: `> **Remember:** **APGAR** = **A**ppearance (color), **P**ulse, **G**rimace (reflex), **A**ctivity (tone), **R**espiration. Each scores 0-2; done at 1 and 5 minutes.

| Sign | 0 | 1 | 2 |
|---|---|---|---|
| Heart rate | Absent | Below 100 | 100 or higher |
| Respiratory effort | Absent | Slow, weak | Good cry |
| Muscle tone | Limp | Some flexion | Active motion |
| Reflex irritability | None | Grimace | Cry or cough |
| Color | Blue or pale | Body pink, hands and feet blue | Completely pink |

Score 7-10 is reassuring, 4-6 is moderate depression, 0-3 needs resuscitation.

### Normal newborn findings
- HR 110-160 (typical), RR 30-60, temp 36.5-37.5 C (97.7-99.5 F), weight loss up to about 7-10% in the first week.
- Acrocyanosis (blue hands and feet), milia, Mongolian spots, lanugo, vernix, physiologic jaundice after 24 hours.
- Pathologic jaundice within the first 24 hours needs evaluation.

### Nursing priorities
- Warmth: dry, skin-to-skin, hat, prevent cold stress.
- Early breastfeeding; vitamin K IM, erythromycin eye ointment, hepatitis B vaccine.
- Check glucose in at-risk infants (LGA, SGA, mother with diabetes).
- Cord care: keep clean and dry; watch for bleeding or redness.
- Safe sleep: back, firm flat surface, nothing in crib.

### Red flags — act now
- Grunting, flaring, retractions, central cyanosis, temperature instability, poor feeding or lethargy.`
  },
  {
    exam: "nclex-rn", category: HP, topic: "Prenatal care",
    title: "Preeclampsia and Magnesium Sulfate: Quick Reference",
    summary: "Recognize severe features, prevent seizures with magnesium and catch toxicity early.",
    readMinutes: 3,
    body: `> **Remember:** Preeclampsia = new hypertension (140/90 or higher) after 20 weeks with proteinuria or organ involvement. Magnesium sulfate prevents seizures; its toxicity is lost reflexes first.

### Severe features
- BP 160/110 or higher, headache, visual changes, right upper quadrant or epigastric pain.
- Platelets under 100,000, elevated liver enzymes, creatinine rise, pulmonary edema.
- HELLP: **H**emolysis, **E**levated **L**iver enzymes, **L**ow **P**latelets.

### Magnesium sulfate
| Item | Value |
|---|---|
| Therapeutic level | Typically 4.8-8.4 mg/dL |
| Antidote | Calcium gluconate |
| Hold or reduce if | Absent reflexes, RR below 12, urine output below 30 mL/hr |

| Level or sign | Finding |
|---|---|
| Early toxicity | Loss of patellar reflexes, flushing, warmth |
| Worsening | Slow respirations, drowsiness, hypotension |
| Severe | Respiratory arrest, cardiac arrest |

### Nursing priorities
- Quiet, dim room; seizure precautions (padded rails, suction, oxygen).
- Monitor BP, reflexes, RR, I and O, and fetal status; foley with hourly output.
- Antihypertensives per order (labetalol, hydralazine, nifedipine); avoid ACE inhibitors.
- Delivery is the cure; postpartum risk continues up to 6 weeks.

### Red flags — act now
- Seizure (eclampsia): left side, airway, oxygen, call for help, magnesium bolus per order.
- Sudden severe abdominal pain or bleeding: think abruptio placentae.`
  },
  {
    exam: "nclex-rn", category: HP, topic: "Postpartum care",
    title: "Postpartum Hemorrhage and Fundal Checks",
    summary: "Fundal assessment, the 4 Ts of bleeding and first responses to uterine atony.",
    readMinutes: 2,
    body: `> **Remember:** **Boggy fundus = massage first.** A firm midline fundus is the goal. Postpartum hemorrhage: blood loss over 1,000 mL (or 500 mL vaginal birth by older definitions) with signs of hypovolemia.

### Normal fundal findings
| Time | Position |
|---|---|
| Immediately after birth | Firm, midline, about halfway to the umbilicus |
| First hours | At or just below the umbilicus |
| Afterward | Descends about 1 cm (one fingerbreadth) per day |
| About 10-14 days | No longer palpable |

### The four Ts
1. Tone (uterine atony: most common)
2. Trauma (lacerations, hematoma)
3. Tissue (retained placenta)
4. Thrombin (coagulopathy)

### Nursing priorities
- Check fundus, lochia and vitals per schedule; empty the bladder (a full bladder displaces the uterus and makes it boggy).
- Massage a boggy fundus, then call the provider.
- Uterotonics: oxytocin, methylergonovine (avoid in hypertension), carboprost (avoid in asthma), misoprostol.
- Weigh pads (1 g = 1 mL); IV access, fluids, type and cross.
- Lochia: rubra (days 1-3), serosa (4-10), alba (10 days to weeks). Foul smell suggests infection.

### Red flags — act now
- Saturated pad in 15 minutes, tachycardia, falling BP, pallor, anxiety: massage, call, oxygen, IV fluids.
- A firm fundus with continuous bright red bleeding suggests laceration.`
  },
  {
    exam: "nclex-rn", category: RR, topic: "Cardiac monitoring",
    title: "Fetal Heart Rate Patterns: VEAL CHOP",
    summary: "Match each pattern to its cause and the right nursing response.",
    readMinutes: 2,
    body: `> **Remember:** **VEAL CHOP** — **V**ariable = **C**ord compression, **E**arly = **H**ead compression, **A**cceleration = **O**K, **L**ate = **P**lacental insufficiency.

| Pattern | Looks like | Cause | Action |
|---|---|---|---|
| Variable decels | Abrupt drop, variable shape | Cord compression | Change position, amnioinfusion if ordered |
| Early decels | Mirror contractions, gradual | Head compression | Usually benign; observe |
| Accelerations | Temporary rise of 15 bpm for 15 s | Fetal movement | Reassuring |
| Late decels | Begin after peak of contraction | Uteroplacental insufficiency | Treat now: reposition, fluids, O2, stop oxytocin |

Normal baseline FHR typically 110-160 bpm with moderate variability (6-25 bpm).

### Late decel interventions
1. Turn to the left side (or right).
2. Stop oxytocin.
3. Give IV fluid bolus.
4. Oxygen by mask as ordered.
5. Notify provider; prepare for urgent delivery if unresolved.

### Key points
- Minimal or absent variability with recurrent decelerations is concerning.
- Tachysystole (over 5 contractions in 10 minutes): stop oxytocin; terbutaline may be ordered.
- Prolonged deceleration (over 2 minutes): treat as an emergency.
- Check maternal pulse to avoid mistaking maternal and fetal heart rates.

### Red flags — act now
- Recurrent late decelerations, prolonged bradycardia, absent variability or umbilical cord prolapse (visible cord: relieve pressure with a gloved hand, knee-chest position, call for help).`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Heart failure",
    title: "Heart Failure: Left vs Right",
    summary: "Left-sided failure fills the lungs; right-sided failure backs up into the body.",
    readMinutes: 2,
    body: `> **Remember:** **L**eft = **L**ungs (crackles, dyspnea). **R**ight = **R**est of the body (edema, JVD, weight gain).

| | Left-sided | Right-sided |
|---|---|---|
| Problem | Poor forward flow into body; blood backs up into lungs | Blood backs up into the systemic veins |
| Signs | Dyspnea, orthopnea, crackles, cough (pink frothy sputum), S3, fatigue | Peripheral edema, JVD, hepatomegaly, ascites, weight gain |
| Common cause | MI, hypertension | Left failure, COPD, cor pulmonale |

### First-line medications
- Diuretics (reduce fluid), ACE inhibitor/ARB/ARNI, beta-blocker (carvedilol, metoprolol succinate, bisoprolol), spironolactone, SGLT2 inhibitor.
- Digoxin for symptoms in selected clients.
- Hold beta-blockers in acute decompensated failure with hypotension or shock.

### Nursing priorities
- High Fowler position with legs dependent; oxygen if SpO2 low.
- Daily weight (report gain of 2-3 lb in a day or 5 lb in a week).
- Sodium restriction (often under 2 g/day); fluid restriction if ordered.
- Strict I and O, monitor K+, creatinine, BNP.
- Teach symptom diary, low-sodium diet, and when to call.

### Red flags — act now
- Acute pulmonary edema: severe dyspnea, pink frothy sputum, anxiety. Sit up, oxygen, IV furosemide, call provider.
- Worsening hypotension or arrhythmia.`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Myocardial infarction",
    title: "MI and Chest Pain Priorities",
    summary: "Recognize ACS fast, get an ECG within 10 minutes and know the cautions around MONA.",
    readMinutes: 3,
    body: `> **Remember:** **Time is muscle.** ECG within 10 minutes, then treat. **MONA** is a memory aid, not a fixed order: **M**orphine, **O**xygen, **N**itroglycerin, **A**spirin.

### MONA caveats
| Drug | Caution |
|---|---|
| Oxygen | Only if SpO2 below about 90-94%; routine oxygen is not helpful |
| Nitroglycerin | Avoid with hypotension, right ventricle infarct, PDE-5 inhibitors in last 24-48 hr |
| Aspirin | Chew 160-325 mg non-enteric coated unless allergic or active bleeding |
| Morphine | Use cautiously; may worsen outcomes in NSTEMI; watch hypotension and respiratory depression |

### Classic presentation
- Crushing chest pressure radiating to jaw or arm, diaphoresis, nausea, dyspnea.
- Women, older adults and clients with diabetes may present with fatigue, indigestion or shortness of breath alone.
- ST elevation = STEMI (emergent PCI within 90 min door-to-balloon; fibrinolytic if PCI delayed).
- Troponin rises within 3-6 hours; repeat serial troponins.

### Nursing priorities
- Rest, monitor, IV access, 12-lead ECG, continuous cardiac monitoring.
- Treat arrhythmias; ventricular fibrillation needs defibrillation.
- Avoid NSAIDs; ask about last dose of anticoagulant.
- After PCI via the femoral artery: keep leg straight, check pulses and groin for bleeding or hematoma.

### Red flags — act now
- Ongoing pain, new arrhythmia, hypotension, new murmur, signs of heart failure or cardiogenic shock.`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Stroke",
    title: "Stroke Assessment, Alteplase and Increased ICP",
    summary: "BE-FAST screening, time windows for thrombolytics and the Cushing triad.",
    readMinutes: 3,
    body: `> **Remember:** **BE-FAST** — **B**alance, **E**yes, **F**ace droop, **A**rm weakness, **S**peech, **T**ime to call. Note the **last known well** time.

### Stroke types
| Type | Cause | Key point |
|---|---|---|
| Ischemic | Clot or embolus | Alteplase typically within 3-4.5 hr; thrombectomy up to about 24 hr in selected cases |
| Hemorrhagic | Ruptured vessel | No anticoagulants or thrombolytics; control BP |

### Before alteplase
- Non-contrast CT head first to rule out bleeding.
- Contraindications: recent intracranial bleed, surgery, active bleeding, or severely high BP (typically over 185/110 before giving).
- Monitor neuro status and BP closely for 24 hours; no anticoagulants or antiplatelets for 24 hr.

### Increased ICP
- Early: headache, restlessness, drowsiness, vomiting, pupil changes.
- Late: **Cushing triad** = hypertension with widened pulse pressure, bradycardia, irregular respirations.
- Position head of bed 30 degrees, head midline, avoid neck flexion and Valsalva.
- Treat: mannitol, hypertonic saline, hyperventilation briefly, ventilate, treat seizures.

### Nursing priorities
- NPO until swallow screen is passed; aspiration precautions.
- Keep SpO2 above 94%, treat hypoglycemia, avoid hyperthermia.
- Position affected limbs; start early rehab.

### Red flags — act now
- New worsening neuro signs, dilated pupil, or Cushing triad: call rapid response.`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Diabetic ketoacidosis",
    title: "DKA vs HHS and Glucose Emergencies",
    summary: "Compare DKA, HHS, hypoglycemia and hyperglycemia, with first-line actions.",
    readMinutes: 3,
    body: `> **Remember:** DKA = **K**etones and acidosis (type 1, sick). HHS = **H**yperosmolar, very high glucose, extreme dehydration (type 2, older). Hypoglycemia is **cold and clammy**; hyperglycemia is **hot and dry**.

| | DKA | HHS |
|---|---|---|
| Glucose | Typically over 250 mg/dL | Typically over 600 mg/dL |
| Ketones, pH | Positive, pH under 7.3 | Little or none, pH normal |
| Signs | Kussmaul breathing, fruity breath, abdominal pain | Profound dehydration, confusion, seizure |
| Onset | Hours to a day | Days to weeks |

### Treatment order
1. IV isotonic saline first, then insulin infusion.
2. Check potassium before insulin; hold insulin if K+ below 3.3 mEq/L and replace first.
3. Add dextrose when glucose falls to about 200-250 mg/dL.
4. Monitor glucose hourly, electrolytes, ABG, mental status.

### Hypoglycemia vs hyperglycemia
| | Hypoglycemia (under 70) | Hyperglycemia |
|---|---|---|
| Signs | Sweating, shaking, hunger, confusion, tachycardia | Thirst, polyuria, fatigue, blurred vision |
| Action | Rule of 15: 15 g fast carbohydrate, recheck in 15 min; if unconscious, glucagon or IV dextrose | Fluids, insulin per order, look for the cause |

### Nursing priorities
- Beta-blockers can mask hypoglycemia signs.
- Teach sick-day rules: check glucose and ketones, continue insulin, drink fluids.

### Red flags — act now
- Altered level of consciousness, vomiting, Kussmaul breathing, K+ shift; call the provider.`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Burns",
    title: "Burns and the Parkland Formula",
    summary: "Burn depth, rule of nines, fluid resuscitation and phase priorities.",
    readMinutes: 2,
    body: `> **Remember:** **Parkland** = 4 mL x kg x %TBSA burned in the first 24 hours. Give half in the first 8 hours (from the time of burn), the other half over the next 16.

### Rule of nines (adult)
| Region | % |
|---|---|
| Head and neck | 9 |
| Each arm | 9 |
| Anterior trunk / posterior trunk | 18 / 18 |
| Each leg | 18 |
| Perineum | 1 |

### Depth
- Superficial: red, painful, dry (sunburn).
- Partial-thickness: blisters, moist, very painful.
- Full-thickness: leathery, white or charred, painless (nerves destroyed).

### Example
- 70 kg, 40% TBSA: 4 x 70 x 40 = 11,200 mL in 24 hr. 5,600 mL over the first 8 hr, about 700 mL/hr.

### Nursing priorities
- Airway first: suspect inhalation injury with facial burns, singed nasal hair, soot, hoarseness. Intubate early.
- 100% oxygen for suspected carbon monoxide poisoning.
- Remove clothing and jewelry; cool minor burns with running water, then cover with clean dry sheet; prevent hypothermia.
- Use lactated Ringer's; titrate to urine output about 0.5 mL/kg/hr (30-50 mL/hr).
- Pain control IV opioids; tetanus; high-protein diet; wound care.

### Red flags — act now
- Stridor, hoarseness, carbonaceous sputum: airway emergency.
- Circumferential burn with loss of pulses: escharotomy.
- Early hyperkalemia and low sodium in the emergent phase.`
  },
  {
    exam: "nclex-rn", category: PA, topic: "Shock",
    title: "Types of Shock",
    summary: "Compare hypovolemic, cardiogenic, distributive (septic, anaphylactic, neurogenic) and obstructive shock.",
    readMinutes: 2,
    body: `> **Remember:** Shock = inadequate tissue perfusion. Early signs: anxiety, restlessness, tachycardia, cool skin. Hypotension is a late sign.

| Type | Cause | Distinguishing signs | Key treatment |
|---|---|---|---|
| Hypovolemic | Bleeding, dehydration, burns | Cold, clammy, low CVP, tachycardia | Stop loss, IV fluids, blood |
| Cardiogenic | MI, failure, arrhythmia | Cold, clammy, JVD, crackles, high CVP | Inotropes, treat the heart, diuretics |
| Septic | Infection | Warm and flushed early, fever, high lactate | Cultures, antibiotics within 1 hr, fluids, vasopressors |
| Anaphylactic | Allergic reaction | Hives, wheeze, stridor, swelling | IM epinephrine 0.3-0.5 mg, airway, fluids |
| Neurogenic | Spinal cord injury above T6 | Warm dry skin, bradycardia, hypotension | Fluids, vasopressors, atropine |
| Obstructive | Tamponade, tension pneumothorax, PE | JVD, muffled heart sounds, absent breath sounds | Relieve the obstruction |

### Nursing priorities
- Airway, oxygen, IV access, monitor, position flat with legs elevated unless there is respiratory distress or head injury.
- Monitor urine output (goal 0.5 mL/kg/hr or at least 30 mL/hr), MAP over 65, lactate, mentation.
- Sepsis bundle: lactate, blood cultures, broad-spectrum antibiotics, 30 mL/kg fluid for hypotension or high lactate.

### Red flags — act now
- New confusion, falling MAP, oliguria, mottled skin: call rapid response.
- Anaphylaxis: epinephrine first; antihistamines and steroids are second-line.`
  },
  {
    exam: "nclex-rn", category: RR, topic: "Chest tube monitoring",
    title: "Chest Tubes and Oxygen Delivery Devices",
    summary: "Drainage system checks, what to do if the system fails, and devices by oxygen concentration.",
    readMinutes: 3,
    body: `> **Remember:** Tidaling in the water-seal chamber is normal. Continuous bubbling there is an air leak. Never clamp unless ordered. Keep the drainage system **below the chest**.

### Chest tube checks
| Finding | Meaning | Action |
|---|---|---|
| Tidaling with breathing | Normal | Document |
| Continuous bubbling in water seal | Air leak | Check connections; notify provider if persists |
| Bubbling in suction chamber | Normal with suction | Keep at ordered level |
| No tidaling | Lung re-expanded or tube blocked | Assess; do not strip tubing |
| Drainage over 100 mL/hr | Bleeding | Notify provider |

- If the tube disconnects: place the end in sterile water, or cover with sterile gauze taped on three sides.
- If the tube is pulled out: cover with sterile petrolatum gauze taped on three sides and call provider.
- If the drainage unit breaks: submerge end in sterile water.

### Oxygen delivery
| Device | Flow | Approx FiO2 |
|---|---|---|
| Nasal cannula | 1-6 L/min | 24-44% |
| Simple mask | 6-10 L/min | 40-60% |
| Venturi mask | Set by color valve | 24-60%, precise |
| Non-rebreather | 10-15 L/min | 60-90% |
| High-flow nasal cannula | Up to 60 L/min | Titratable |

### Nursing priorities
- Keep non-rebreather bag inflated.
- Humidify oxygen over 4 L/min.
- Venturi masks are best for COPD clients needing precise low oxygen.
- Assess lung sounds, SpO2 and work of breathing.

### Red flags — act now
- Subcutaneous emphysema, sudden dyspnea or tracheal deviation: tension pneumothorax, call for help.`
  },
  {
    exam: "nclex-rn", category: PS, topic: "Therapeutic communication",
    title: "Therapeutic Communication: Use vs Avoid",
    summary: "Techniques that open the conversation and responses that shut it down.",
    readMinutes: 2,
    body: `> **Remember:** Focus on the **client's feelings**. Use open-ended questions and reflection; avoid advice, false reassurance, "why" questions and defensive replies.

### Therapeutic techniques
| Technique | Example |
|---|---|
| Open-ended question | "Tell me what has been on your mind." |
| Reflecting | Client: "I'm scared." Nurse: "You're feeling scared." |
| Restating | "You said you haven't slept for three days." |
| Clarifying | "Help me understand what you mean by 'tired'." |
| Silence | Allows time to think |
| Focusing | "Let's talk more about your relationship with your mother." |
| Offering self | "I'll sit with you for a while." |
| Summarizing | Ties together main points |
| Acknowledging feelings | "This sounds very hard." |

### Nontherapeutic (avoid)
| Block | Example |
|---|---|
| False reassurance | "Don't worry, everything will be fine." |
| Giving advice | "You should leave him." |
| Asking "why" | "Why did you do that?" |
| Changing the subject | Moves away from the topic |
| Defending | "The staff here are very good." |
| Judging or approving | "That was wrong," "Good job" |
| Closed questions | Limits the answer to yes or no |

### Nursing priorities
- Assess safety and risk (suicide, violence) directly; asking does not cause it.
- Face the client, keep eye contact appropriately for culture, use calm tone.
- For hallucinations: acknowledge the experience without agreeing ("I don't hear the voices, but I can see they are frightening").

### Red flags — act now
- Statements of intent to self-harm or harm others: stay with the client, notify the team, follow safety protocol.`
  },
  {
    exam: "nclex-rn", category: PS, topic: "Coping mechanisms",
    title: "Defense Mechanisms",
    summary: "Common ego defenses with a quick example of each.",
    readMinutes: 2,
    body: `> **Remember:** Defense mechanisms are **unconscious** ways to reduce anxiety. Support them short-term; do not confront them harshly.

| Mechanism | Meaning | Example |
|---|---|---|
| Denial | Refuses to accept reality | Client with a new cancer diagnosis says "the tests are wrong" |
| Repression | Pushes painful memory out of awareness | Cannot recall abuse |
| Suppression | Conscious pushing aside | "I'll think about that after surgery" |
| Projection | Attributes own feelings to others | "The nurses hate me" (client who feels anger) |
| Displacement | Redirects feelings to a safer target | Angry with boss, yells at spouse |
| Reaction formation | Acts opposite to true feelings | Excessively nice to a person he dislikes |
| Regression | Returns to earlier behavior | Child wets bed after sibling is born |
| Rationalization | Logical excuse for behavior | "I failed because the test was unfair" |
| Intellectualization | Uses facts to avoid emotion | Discusses disease details without feeling |
| Undoing | Tries to cancel an act | Gives gifts after an outburst |
| Sublimation | Channels urges into acceptable activity | Aggression into sports |
| Compensation | Overachieves to cover weakness | Short person excels at athletics |
| Identification | Models another person | Child imitates parent |

### Nursing priorities
- Healthy mature mechanisms: sublimation, suppression, compensation, humor.
- Use empathy and gentle reality orientation; avoid arguing with denial.
- Assess whether the mechanism is helping or harming functioning.

### Red flags — act now
- Dissociation, severe regression or self-harm accompanying coping breakdown: ensure safety and seek mental health support.`
  },
  {
    exam: "nclex-rn", category: SI, topic: "Seizure precautions",
    title: "Safety Precautions: Seizure, Aspiration, Suicide, Falls",
    summary: "Key interventions for the five high-yield safety precautions.",
    readMinutes: 3,
    body: `> **Remember:** Match the precaution to the threat: seizure = injury, aspiration = airway, suicide = self-harm, fall = trauma, neutropenic = infection.

| Precaution | Key interventions |
|---|---|
| Seizure | Padded rails, bed low, suction and oxygen at bedside, IV access; during seizure protect head, turn to side, loosen clothing, time it, never put anything in the mouth |
| Aspiration | Head of bed 30-45 degrees (upright for meals), swallow screen first, thickened fluids if ordered, small bites, suction ready, oral care |
| Suicide | Private room near the nurses' station, 1:1 observation, remove sharps, belts, cords; check meds swallowed; ask directly and often |
| Fall | Call light in reach, bed low, non-skid socks, toileting schedule, bed or chair alarm, assist with mobility |
| Neutropenic | Private room, strict hand hygiene, no fresh flowers or raw foods, no rectal temperatures or enemas, monitor temperature, mask when out of room |

### Key points
- After a seizure: monitor airway, note duration, type, postictal state; suction as needed.
- Status epilepticus (over 5 minutes or recurring without recovery): IV lorazepam first-line.
- Neutropenia is typically ANC below 1,500; severe below 500. Fever of 38.3 C (101 F) or above in neutropenia is an emergency.
- Restraints are a last resort: need an order, least restrictive method, frequent checks.

### Nursing priorities
- Individualize risk: use a fall-risk tool and suicide screen.
- Reassess regularly; document and communicate in handoff.

### Red flags — act now
- Seizure over 5 minutes, repeated seizures, cyanosis or choking.
- Fever, chills or tachycardia in a neutropenic client: urgent cultures and antibiotics.`
  },
  {
    exam: "nclex-rn", category: MC, topic: "Legal responsibilities",
    title: "Legal and Ethical Terms",
    summary: "Negligence, malpractice, informed consent, HIPAA, advance directives and key ethical principles.",
    readMinutes: 3,
    body: `> **Remember:** If it is about the client's choice it is **autonomy**; about doing good **beneficence**; about not harming **nonmaleficence**; about fairness **justice**.

| Term | Meaning |
|---|---|
| Negligence | Failure to act as a reasonably prudent nurse would |
| Malpractice | Negligence by a professional causing harm (duty, breach, causation, damages) |
| Assault | Threat of unwanted touching |
| Battery | Actual unwanted touching or treatment without consent |
| False imprisonment | Unjust restraint or confinement |
| Defamation | Libel (written) and slander (spoken) |
| Tort | A civil wrong |
| Good Samaritan law | Protects those who give emergency care in good faith |

### Informed consent
- Provider explains the procedure, risks, benefits and alternatives; the nurse witnesses the signature and checks that the client understands, is competent and signs voluntarily.
- Legally the provider obtains consent; the nurse does not.
- Minors generally need a parent or guardian, except emancipated minors or certain services.

### Advance directives
- Living will (treatment wishes), durable power of attorney for health care (surrogate), DNR/DNAR orders.
- PSDA requires facilities to ask on admission about advance directives.

### HIPAA
- Protects individually identifiable health information. Share only the minimum necessary for care. No discussion in public areas; no social media posts about clients.

### Nursing priorities
- Document facts objectively; never alter the record; late entries are labeled.
- Incident reports are factual and not mentioned in the chart.
- Refuse or question unsafe orders; use chain of command.

### Red flags — act now
- Any breach of confidentiality, unsafe staffing or inappropriate order: report through proper channels.`
  },
  {
    exam: "nclex-rn", category: BC, topic: "Pressure injury prevention",
    title: "Pressure Injury Stages and Prevention",
    summary: "Stages 1-4 with descriptions, plus prevention strategies and risk tools.",
    readMinutes: 2,
    body: `> **Remember:** Stage by the **deepest tissue seen**, never reverse-stage. A healing stage 4 stays a healed stage 4.

| Stage | Description |
|---|---|
| Stage 1 | Intact skin with non-blanchable redness |
| Stage 2 | Partial-thickness loss; shallow open ulcer or blister, no slough |
| Stage 3 | Full-thickness skin loss; fat visible, no muscle or bone |
| Stage 4 | Full-thickness loss; exposed muscle, tendon or bone, often with slough or eschar |
| Unstageable | Base covered by slough or eschar so depth cannot be seen |
| Deep tissue injury | Persistent deep red, maroon or purple discoloration |

### Risk factors
- Immobility, moisture, shear and friction, poor nutrition, poor sensation, advanced age, low albumin.
- Use the Braden Scale: 18 or less = at risk; lower scores mean higher risk.

### Prevention
- Turn and reposition at least every 2 hours (every hour in a chair, shift weight every 15 minutes).
- Use pressure-redistributing mattress; heel offloading.
- Keep head of bed at or below 30 degrees unless contraindicated, to reduce shear.
- Keep skin clean and dry; use moisture barrier.
- Do not massage bony prominences or use donut cushions.
- Adequate protein, calories, fluids; consider dietitian input.

### Nursing priorities
- Inspect skin head to toe on admission and every shift; check under devices.
- Keep wounds moist, not wet; debride necrotic tissue as ordered; do not debride stable dry heel eschar.

### Red flags — act now
- Foul odor, purulent drainage, spreading redness, fever: infection, call the provider.`
  },
];
