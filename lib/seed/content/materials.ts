/**
 * Original study materials seed data: topic notes, high-yield guides, video lecture outlines,
 * flashcards and the in-exam lab reference sheet. All content is original writing for practice
 * purposes; reference ranges vary by laboratory and should be validated before release.
 */

export type SeedMaterial = {
  exam: string;
  topic: string;
  category?: string;
  kind: "notes" | "guide" | "video";
  title: string;
  summary: string;
  body: string /* markdown */;
  durationMinutes?: number;
  videoUrl?: string;
};
export type SeedFlashcard = { exam: string; topic: string; category?: string; front: string; back: string };
export type SeedLabValue = { group: string; name: string; range: string; unit: string; note?: string };

const MOC = "Management of Care";
const SIC = "Safety and Infection Control";
const HPM = "Health Promotion and Maintenance";
const PSY = "Psychosocial Integrity";
const BCC = "Basic Care and Comfort";
const PPT = "Pharmacological and Parenteral Therapies";
const RRP = "Reduction of Risk Potential";
const PA = "Physiological Adaptation";

/* ------------------------------------------------------------------ */
/* NCLEX-RN topic notes                                                */
/* ------------------------------------------------------------------ */
const NCLEX_NOTES: SeedMaterial[] = [
  {
    exam: "nclex-rn",
    category: MOC,
    topic: "Prioritization",
    kind: "notes",
    title: "Prioritization Frameworks: ABCs, Maslow, and Acute vs Chronic",
    summary: "How to decide which client, finding or action comes first using layered decision frameworks.",
    body: `# Prioritization Frameworks

Prioritization questions ask you to identify the client, problem or action that carries the **greatest risk of harm if delayed**. No single framework answers every item; use them in layers.

## 1. Airway, Breathing, Circulation (ABCs)
- **Airway** threats come first: stridor, angioedema, inability to clear secretions, decreased level of consciousness with snoring respirations.
- **Breathing**: respiratory rate extremes, accessory muscle use, falling SpO2, absent breath sounds.
- **Circulation**: hemorrhage, hypotension with tachycardia, new dysrhythmia, absent distal pulses.
- Many educators extend this to **ABCDE** (Disability = neuro status, Exposure = temperature and full assessment).

> Exception: in cardiac arrest, current resuscitation guidance prioritizes **compressions first (C-A-B)**.

## 2. Maslow's Hierarchy
1. Physiological needs (oxygen, fluids, nutrition, elimination)
2. Safety and security (fall risk, suicide risk, violence)
3. Love and belonging
4. Esteem
5. Self-actualization

Physiological needs generally outrank psychosocial needs **unless** the psychosocial issue is an immediate safety threat (for example, a client who states a plan to self-harm).

## 3. Acute vs Chronic, Unstable vs Stable
- A **new or sudden change** outranks a long-standing, expected finding. Crackles in a client with known chronic heart failure who is at baseline is less urgent than new crackles after a blood transfusion.
- **Unexpected** findings outrank **expected** findings for the condition. Pain after surgery is expected; a rigid, board-like abdomen is not.
- **Actual** problems outrank **potential** (risk for) problems.

## 4. Nursing Process
When no client is in immediate danger, **assess before you act** — unless the stem already gives enough data to act, or the situation is an emergency where delay causes harm (for example, anaphylaxis: stop the infusion first).

## 5. Safety and Least Restrictive
Choose the action that protects the client with the least restriction and the least invasive intervention first.

## Applying It: Who Do You See First?
| Client | Priority reasoning |
|---|---|
| Post-thyroidectomy, new hoarseness and stridor | Airway: see first |
| COPD, SpO2 89% on 2 L, at baseline | Expected for condition |
| Type 1 diabetes, glucose 62 mg/dL, diaphoretic | Unstable, treat quickly |
| Hip replacement, requests pain medication, pain 6/10 | Important but stable |

## Nursing Priorities
- Look for words that signal instability: *sudden, new, restless, confused, decreasing*.
- Restlessness and confusion can be **early signs of hypoxia** — do not dismiss them.
- Do not choose an option that delegates the assessment of an unstable client.

> **High-yield:** Ask "Which client could die or be permanently harmed first if I do nothing?" Then confirm with ABCs, Maslow and acute-over-chronic. Expected findings for a diagnosis are rarely the priority.
`,
  },
  {
    exam: "nclex-rn",
    category: MOC,
    topic: "Delegation",
    kind: "notes",
    title: "Delegation to UAP and LPN/LVN",
    summary: "The five rights of delegation and what can and cannot be delegated to assistive personnel and practical nurses.",
    body: `# Delegation to UAP and LPN/LVN

The registered nurse remains **accountable** for the outcome of any delegated task. Delegation transfers the task, not the responsibility for the client.

## Five Rights of Delegation
1. **Right task** — routine, predictable, standardized
2. **Right circumstance** — the client is stable and the outcome predictable
3. **Right person** — competent, within scope and facility policy
4. **Right direction and communication** — clear, specific instructions including what to report
5. **Right supervision and evaluation** — follow up, give feedback, evaluate outcome

## The RN Keeps
- Initial **assessment** and any assessment of an unstable client
- Nursing **diagnosis**, care **planning** and **evaluation**
- **Teaching** (initial and discharge) — others may reinforce
- Clients who are **unstable**, new admissions, fresh post-op, or with unpredictable outcomes
- Administering **blood products** and IV push medications (per most policies)

## What UAP (Assistive Personnel) Can Do
- Vital signs on **stable** clients
- Hygiene, bathing, oral care, linen changes
- Ambulation, positioning, range of motion for stable clients
- Feeding clients **without** swallowing risk
- Measuring intake and output, weights
- Specimen collection (routine), point-of-care glucose if trained per policy

UAP **cannot** assess, teach, evaluate, or make judgments ("check if the client looks okay" is an assessment).

## What the LPN/LVN Can Do
- Care for **stable** clients with predictable outcomes
- Administer oral, subcutaneous, IM and topical medications
- Reinforce teaching started by the RN
- Data collection and focused reassessment of stable clients
- Sterile procedures such as urinary catheter insertion, trach suctioning, wound care on stable clients
- IV therapy tasks vary by state; many states restrict IV push medications and initiating blood

## Assignment vs Delegation
- **Assignment** transfers responsibility for care within a person's scope (for example, assigning a stable client to an LPN).
- **Delegation** transfers authority to perform a specific task the delegatee is not otherwise authorized to do.
- Float nurses should receive clients who are stable and similar to their home unit population.

## Nursing Priorities
- Match the **most stable, predictable** client to the least licensed caregiver.
- Give explicit parameters: "Report a systolic BP under 100 or heart rate over 110."
- If a delegated task is done incorrectly, address it **promptly and privately**, then evaluate the client.

> **High-yield:** "EAT" stays with the RN — **E**valuate, **A**ssess, **T**each — plus anything involving an **unstable** client. When an option says the UAP will "monitor for" or "assess," eliminate it.
`,
  },
  {
    exam: "nclex-rn",
    category: SIC,
    topic: "Transmission-based precautions",
    kind: "notes",
    title: "Transmission-Based Precautions: Contact, Droplet, Airborne",
    summary: "Isolation categories, PPE, room requirements and the organisms that go with each.",
    body: `# Transmission-Based Precautions

**Standard precautions** apply to every client. Transmission-based precautions are **added** when a client is known or suspected to have a specific infection.

## Contact Precautions
**Organisms:** MRSA, VRE, *Clostridioides difficile*, scabies, lice, RSV (often contact plus droplet in pediatrics), draining wounds, many multidrug-resistant gram-negative organisms.
- Gown and gloves on room entry
- Private room or cohort with the same organism
- Dedicated equipment (stethoscope, BP cuff, thermometer)
- *C. difficile*: **soap and water** hand hygiene (alcohol does not kill spores) and a sporicidal (bleach-based) cleaner

## Droplet Precautions
**Organisms:** influenza, pertussis, *Neisseria meningitidis*, mumps, rubella, diphtheria (pharyngeal), adenovirus, group A strep (first 24 h of therapy).
- **Surgical mask** within close range (commonly cited as 3 to 6 feet)
- Private room preferred; door may remain open
- Client wears a surgical mask during transport

## Airborne Precautions
**Organisms:** tuberculosis, measles (rubeola), varicella (chickenpox), disseminated herpes zoster.
- **Airborne infection isolation room (AIIR)** with negative pressure and door kept closed
- **Fit-tested N95** respirator (or PAPR) for staff
- Client wears a surgical mask during transport
- Varicella and disseminated zoster also require contact precautions until lesions are crusted

## Protective Environment
For profoundly immunocompromised clients (for example, allogeneic stem cell transplant): **positive pressure**, HEPA filtration, no fresh flowers or plants.

## PPE Sequence
| Donning | Doffing |
|---|---|
| Gown | Gloves |
| Mask or respirator | Goggles or face shield |
| Goggles or face shield | Gown |
| Gloves | Mask or respirator (outside the room) |

Perform hand hygiene after removing all PPE and any time hands become contaminated.

## Nursing Priorities
- Initiate precautions on **suspicion**; do not wait for culture confirmation.
- Room assignment: never place an airborne-precautions client in a room without negative pressure.
- Pregnant staff should not care for clients with rubella or CMV-associated conditions where avoidable.

> **High-yield:** Airborne = "My Chicken Hez TB" (Measles, Chickenpox, Herpes zoster disseminated, TB). N95 + negative pressure. C. diff = soap and water plus bleach.
`,
  },
  {
    exam: "nclex-rn",
    category: PA,
    topic: "Fluid and electrolyte imbalance",
    kind: "notes",
    title: "Fluid and Electrolyte Imbalances",
    summary: "Volume deficit and excess plus sodium, potassium, calcium and magnesium disorders with priority actions.",
    body: `# Fluid and Electrolyte Imbalances

## Fluid Volume Deficit (Hypovolemia)
- **Causes:** vomiting, diarrhea, hemorrhage, burns, diuretics, inadequate intake
- **Findings:** tachycardia, weak thready pulse, orthostatic hypotension, decreased urine output, increased urine specific gravity, elevated BUN and hematocrit (hemoconcentration), poor skin turgor
- **Care:** isotonic fluids (0.9% saline, lactated Ringer's), daily weights, strict I&O, fall precautions

## Fluid Volume Excess (Hypervolemia)
- **Causes:** heart failure, kidney failure, excess IV fluid, SIADH
- **Findings:** bounding pulse, hypertension, crackles, JVD, edema, weight gain, low hematocrit (hemodilution)
- **Care:** high Fowler's, diuretics, fluid and sodium restriction, monitor lungs and weights

> A weight change of **1 kg is roughly 1 L** of fluid.

## Sodium (135–145 mEq/L)
- **Hyponatremia:** confusion, headache, nausea, seizures. Treat cause; fluid restriction for dilutional causes; hypertonic saline only for severe symptoms. Correct **slowly** to avoid osmotic demyelination.
- **Hypernatremia:** thirst, dry mucosa, restlessness, agitation, seizures. Replace water gradually to avoid cerebral edema.

## Potassium (3.5–5.0 mEq/L)
- **Hypokalemia:** muscle weakness, leg cramps, decreased bowel sounds, **flat T waves, U waves**. Increases digoxin toxicity risk.
- **Hyperkalemia:** muscle weakness progressing to paralysis, **peaked T waves**, widened QRS, dysrhythmias. Emergency care includes IV calcium gluconate (protects myocardium), regular insulin with dextrose, and potassium binders or dialysis.
- **Never give potassium IV push.** Dilute, use a pump, and confirm adequate urine output first.

## Calcium (8.6–10.2 mg/dL)
- **Hypocalcemia:** tingling, muscle cramps, **Chvostek** and **Trousseau** signs, laryngospasm, prolonged QT. Risk after thyroidectomy or parathyroidectomy. Seizure precautions.
- **Hypercalcemia:** fatigue, weakness, constipation, kidney stones, shortened QT. Encourage fluids and mobility.

## Magnesium (1.3–2.1 mEq/L)
- **Hypomagnesemia:** hyperreflexia, tremors, dysrhythmias (torsades de pointes); common in alcohol use disorder. Often coexists with hypokalemia that will not correct until magnesium is replaced.
- **Hypermagnesemia:** hyporeflexia, hypotension, respiratory depression. Antidote: calcium gluconate.

## Nursing Priorities
1. Cardiac rhythm in potassium, calcium and magnesium disorders
2. Neuro status and seizure precautions for sodium and calcium disorders
3. Daily weights and I&O for volume disorders

> **High-yield:** Calcium and magnesium move reflexes in the **opposite** direction of the lab value (low = hyperreflexia, high = hyporeflexia). Potassium extremes both cause weakness; ECG tells you which.
`,
  },
  {
    exam: "nclex-rn",
    category: PA,
    topic: "Acid-base balance",
    kind: "notes",
    title: "Acid-Base Balance and ABG Interpretation",
    summary: "A step-by-step method for reading arterial blood gases and recognizing compensation.",
    body: `# Acid-Base Balance and ABG Interpretation

## Normal Values
| Parameter | Normal |
|---|---|
| pH | 7.35–7.45 |
| PaCO2 | 35–45 mm Hg (acid, controlled by lungs) |
| HCO3- | 22–26 mEq/L (base, controlled by kidneys) |
| PaO2 | 80–100 mm Hg |

## Step-by-Step Method
1. **pH:** below 7.35 = acidosis; above 7.45 = alkalosis.
2. **PaCO2:** does it explain the pH? If PaCO2 moves opposite to pH (high CO2 with low pH), the problem is **respiratory**.
3. **HCO3-:** if bicarbonate moves in the same direction as pH (low HCO3- with low pH), the problem is **metabolic**.
4. **Compensation:** if the other system is abnormal in the opposite direction:
   - pH still abnormal = **partially compensated**
   - pH normal = **fully compensated** (look at which side of 7.40 the pH sits to name the primary disorder)
   - other system normal = **uncompensated**

The ROME memory aid: **R**espiratory **O**pposite, **M**etabolic **E**qual.

## Common Causes
- **Respiratory acidosis:** hypoventilation — COPD exacerbation, opioid overdose, sedation, neuromuscular weakness, atelectasis
- **Respiratory alkalosis:** hyperventilation — anxiety, pain, early pulmonary embolism, high altitude, excessive mechanical ventilation
- **Metabolic acidosis:** DKA, lactic acidosis (sepsis, shock), kidney failure, severe diarrhea, salicylate toxicity (mixed)
- **Metabolic alkalosis:** vomiting, NG suction, loop or thiazide diuretics, excess antacid or bicarbonate

## Clinical Links
- Metabolic acidosis often produces **Kussmaul respirations** (deep, rapid) as the lungs blow off CO2.
- Acidosis tends to shift potassium **out** of cells (hyperkalemia); alkalosis shifts it **in** (hypokalemia).
- Respiratory alkalosis can produce tingling and lightheadedness from decreased ionized calcium.

## Worked Example
pH 7.31, PaCO2 50, HCO3- 29
- pH low → acidosis
- PaCO2 high (opposite) → respiratory
- HCO3- high → kidneys compensating, pH still abnormal → **partially compensated respiratory acidosis**

## Nursing Priorities
- Treat the **cause**: improve ventilation for respiratory acidosis (position, coughing, reversal agents, ventilatory support).
- For hyperventilation from anxiety, coach slow breathing; treat pain.
- Monitor potassium and cardiac rhythm with any significant acid-base disturbance.

> **High-yield:** Vomiting and NG suction = metabolic **alkalosis**; diarrhea = metabolic **acidosis**. An anxious, hyperventilating client = respiratory **alkalosis**.
`,
  },
  {
    exam: "nclex-rn",
    category: PPT,
    topic: "Insulin",
    kind: "notes",
    title: "Insulin Types and Hypoglycemia Management",
    summary: "Onset, peak and duration of insulin categories, mixing rules, and the rule of 15 for low blood glucose.",
    body: `# Insulin Types and Hypoglycemia

## Insulin Action Profiles (subcutaneous, approximate)
| Category | Examples | Onset | Peak | Duration |
|---|---|---|---|---|
| Rapid-acting | lispro, aspart, glulisine | ~15 min | 1–2 h | 3–5 h |
| Short-acting | regular | 30–60 min | 2–4 h | 5–8 h |
| Intermediate | NPH | 1–2 h | 4–12 h | 12–18 h |
| Long-acting | glargine, detemir | 1–2 h | minimal/no peak | up to 24 h |
| Ultra-long | degludec | 1 h | no peak | 36–42 h |

Product labels vary; always check the specific formulation.

## Key Rules
- **Rapid-acting:** give with or immediately before meals (within about 15 minutes). The client must have food available.
- **Regular insulin** is the insulin used for **IV** infusion (for example, in DKA).
- **Do not mix** glargine, detemir or degludec with other insulins.
- **Mixing NPH and regular:** inject air into NPH (cloudy), then air into regular (clear), withdraw **regular first**, then NPH — "clear before cloudy."
- Roll, do not shake, cloudy suspensions.
- Rotate sites within one anatomic region; the abdomen has the most consistent absorption.
- Unopened vials are refrigerated; an in-use vial or pen may be kept at room temperature for the labeled period (often 28 days).

## Hypoglycemia (glucose under 70 mg/dL)
**Findings:** shakiness, diaphoresis, tachycardia, anxiety, hunger (adrenergic), progressing to confusion, slurred speech, seizures and loss of consciousness (neuroglycopenic). Beta blockers can **mask** the adrenergic signs.

### Rule of 15 (conscious client who can swallow)
1. Give **15 g of fast-acting carbohydrate** (4 oz juice or regular soda, glucose tablets per label).
2. Recheck glucose in **15 minutes**.
3. Repeat if still under 70 mg/dL.
4. Once normal, give a snack with protein and complex carbohydrate if the next meal is more than about an hour away.

### Unconscious or unable to swallow
- **Glucagon** IM, SC or intranasal, or **IV dextrose** (D50 or D10 per protocol).
- Position on side; glucagon can cause vomiting.
- Do not give anything by mouth.

## Nursing Priorities
- Know when each insulin **peaks** — that is when hypoglycemia is most likely (NPH given in the morning commonly peaks mid-afternoon).
- Sick-day rules: continue basal insulin, check glucose more often, check ketones, stay hydrated.
- Verify high-alert insulin doses with a second nurse per policy.

> **High-yield:** Rapid-acting = eat now. Regular = only one IV. Clear before cloudy. Glargine never mixed. Hypoglycemia unsure? Treat it — giving sugar to a hyperglycemic client is far less dangerous than missing a low.
`,
  },
  {
    exam: "nclex-rn",
    category: PPT,
    topic: "Anticoagulants",
    kind: "notes",
    title: "Anticoagulants: Heparin, Warfarin, LMWH and DOACs",
    summary: "Mechanisms, monitoring labs, reversal agents and bleeding precautions for anticoagulant therapy.",
    body: `# Anticoagulants

## Unfractionated Heparin
- **Route:** IV continuous infusion or subcutaneous
- **Monitoring:** aPTT, commonly targeted at **1.5–2.5 times control**, or anti-Xa level per protocol; platelet count
- **Reversal:** **protamine sulfate**
- **Risk:** heparin-induced thrombocytopenia (HIT) — suspect when platelets fall by about 50% or new thrombosis occurs, typically 5–10 days after starting. Stop all heparin, including flushes.

## Low-Molecular-Weight Heparin (enoxaparin)
- Subcutaneous, in the abdomen at least 2 inches from the umbilicus; do **not** expel the air bubble from prefilled syringes; do not rub the site
- Routine coagulation labs generally not required; monitor platelets, renal function and signs of bleeding
- Protamine provides **partial** reversal
- Caution with epidural or spinal anesthesia (spinal hematoma risk)

## Warfarin
- Vitamin K antagonist; **oral**; takes several days to reach full effect, so it is often **overlapped** with heparin or LMWH
- **Monitoring:** PT/**INR**; usual target **2.0–3.0** (higher for some mechanical valves)
- **Reversal:** **vitamin K** (phytonadione); for serious bleeding, prothrombin complex concentrate or plasma per protocol
- Teaching: keep vitamin K intake **consistent** (do not avoid leafy greens entirely); avoid NSAIDs and aspirin unless prescribed; many drug and herbal interactions (for example, some antibiotics, amiodarone, ginkgo, garlic supplements)
- Contraindicated in pregnancy (teratogenic)

## Direct Oral Anticoagulants (DOACs)
| Drug | Target | Reversal |
|---|---|---|
| Dabigatran | Direct thrombin inhibitor | **Idarucizumab** |
| Apixaban, rivaroxaban | Factor Xa inhibitors | **Andexanet alfa** (or PCC per protocol) |

- Fewer food interactions and no routine INR monitoring
- Missing doses quickly removes protection because of short half-lives

## Bleeding Precautions (all anticoagulants)
- Soft toothbrush, electric razor
- Avoid IM injections where possible; hold pressure longer on puncture sites
- Monitor for melena, hematuria, bleeding gums, petechiae, unusual bruising, sudden headache or change in neuro status (intracranial bleed)
- Fall prevention

## Nursing Priorities
- Check the relevant lab **before** each dose or rate change.
- A sudden severe headache in an anticoagulated client is an emergency — assess neuro status and notify the provider.
- Carry identification stating anticoagulant use.

> **High-yield:** Heparin → aPTT → protamine. Warfarin → INR → vitamin K. Dabigatran → idarucizumab. Xa inhibitors → andexanet alfa. HIT means stop **all** heparin.
`,
  },
  {
    exam: "nclex-rn",
    category: PA,
    topic: "Heart failure",
    kind: "notes",
    title: "Heart Failure: Left vs Right, Medications and Teaching",
    summary: "Distinguishing left- and right-sided failure, guideline-directed therapy and daily self-management.",
    body: `# Heart Failure

Heart failure is a clinical syndrome in which the heart cannot pump enough blood to meet the body's needs or does so only at elevated filling pressures.

## Classification
- **HFrEF:** ejection fraction 40% or less (reduced)
- **HFmrEF:** EF 41–49% (mildly reduced)
- **HFpEF:** EF 50% or greater (preserved; stiff ventricle)

## Left- vs Right-Sided Findings
| Left-sided (Lungs) | Right-sided (Systemic) |
|---|---|
| Dyspnea, orthopnea, paroxysmal nocturnal dyspnea | Dependent edema |
| Crackles, cough with frothy or pink-tinged sputum | Jugular venous distention |
| S3 gallop, fatigue | Hepatomegaly, ascites |
| Confusion, decreased urine output | Weight gain, anorexia, nausea |

Left-sided failure is the most common cause of right-sided failure.

## Diagnostics
- **BNP/NT-proBNP** elevated (BNP under 100 pg/mL makes HF less likely)
- Echocardiogram for EF
- Chest X-ray (cardiomegaly, pulmonary congestion)

## Guideline-Directed Medical Therapy (HFrEF)
- **ACE inhibitor, ARB, or ARNI** (sacubitril/valsartan): watch potassium, creatinine, hypotension; ACE inhibitor cough; angioedema
- **Evidence-based beta blocker** (carvedilol, metoprolol succinate, bisoprolol): start low, may feel more fatigued initially; hold for bradycardia or hypotension per parameters
- **Mineralocorticoid receptor antagonist** (spironolactone, eplerenone): hyperkalemia risk
- **SGLT2 inhibitor** (dapagliflozin, empagliflozin): genital infections, volume depletion
- **Loop diuretics** (furosemide) for congestion: monitor potassium, weight, orthostatic BP
- **Digoxin** for symptom control in selected clients: check apical pulse for a full minute; watch for nausea, vision changes and dysrhythmias, especially with hypokalemia

## Acute Decompensation (Pulmonary Edema)
1. High Fowler's with legs dependent
2. Oxygen; prepare for noninvasive ventilation if needed
3. IV loop diuretic, vasodilators as prescribed
4. Monitor urine output, potassium, breath sounds and SpO2

## Client Teaching
- **Daily weight** at the same time, same scale, after voiding, before breakfast
- Report a gain of about **2–3 lb (1 kg) in a day or 5 lb (2 kg) in a week**, or per provider parameters
- Sodium restriction as prescribed; fluid restriction if ordered
- Recognize worsening: increased shortness of breath, needing more pillows, swelling
- Activity pacing, vaccinations, medication adherence, avoid NSAIDs

## Nursing Priorities
- Breathing first: crackles with worsening SpO2 outrank edema.
- Weight is the most sensitive daily indicator of fluid status.

> **High-yield:** **L**eft = **L**ungs; **R**ight = **R**est of the body. Daily weight is the key self-monitoring skill. Hypokalemia + digoxin = toxicity risk.
`,
  },
];

const NCLEX_NOTES_2: SeedMaterial[] = [
  {
    exam: "nclex-rn",
    category: PA,
    topic: "Diabetic ketoacidosis",
    kind: "notes",
    title: "DKA vs HHS: Hyperglycemic Emergencies",
    summary: "Side-by-side comparison of diabetic ketoacidosis and hyperosmolar hyperglycemic state with treatment priorities.",
    body: `# DKA vs HHS

Both are life-threatening hyperglycemic crises driven by insulin deficiency and counter-regulatory hormones. The key difference is **ketosis and acidosis** (DKA) versus **extreme hyperglycemia and hyperosmolality** (HHS).

## Comparison
| Feature | DKA | HHS |
|---|---|---|
| Typical client | Type 1 (can occur in type 2, and with SGLT2 inhibitors) | Older adult with type 2 |
| Onset | Hours to a day or two | Days to weeks |
| Glucose | Usually above 250 mg/dL (can be lower, "euglycemic DKA") | Often above 600 mg/dL |
| pH | Below 7.30 | Above 7.30 |
| Bicarbonate | Below 18 mEq/L | Above 18 mEq/L |
| Ketones | Present (significant) | Absent or minimal |
| Serum osmolality | Variable | Above 320 mOsm/kg |
| Hallmark signs | Kussmaul respirations, fruity breath, abdominal pain, vomiting | Profound dehydration, altered mental status, seizures |
| Mortality | Lower | Higher (older, comorbid clients) |

## Common Triggers
Infection (most common), missed insulin, new-onset diabetes, myocardial infarction, stroke, pancreatitis, certain medications (corticosteroids, thiazides, some antipsychotics).

## Treatment Priorities (both)
1. **Fluids first:** isotonic 0.9% saline to restore circulating volume; switch to dextrose-containing fluids (for example, D5 0.45% saline) when glucose falls to about 200–250 mg/dL (DKA) or about 300 mg/dL (HHS) to prevent hypoglycemia and cerebral edema while insulin continues.
2. **Check potassium before insulin.** If potassium is below about 3.3 mEq/L, replace potassium **before** starting insulin. Insulin drives potassium into cells and can cause life-threatening hypokalemia.
3. **IV regular insulin** infusion per protocol; continue until the **anion gap closes** in DKA, then overlap with subcutaneous basal insulin before stopping the drip (commonly 1–2 hours).
4. **Bicarbonate** only in severe acidosis per protocol.
5. Treat the trigger (cultures, antibiotics, cardiac workup).

## Monitoring
- Glucose hourly while on the infusion
- Electrolytes (especially potassium) every 2–4 hours
- Neuro checks — headache or declining consciousness during treatment may indicate **cerebral edema** (more common in children)
- Strict I&O, cardiac monitoring for potassium-related dysrhythmias

## Nursing Priorities
- An initially **normal or high** potassium does not mean total-body potassium is normal; levels drop with treatment.
- Avoid rapid drops in glucose and osmolality.

> **High-yield:** DKA = **K**etones + **K**ussmaul + acidosis. HHS = higher glucose, higher osmolality, no significant ketones, more neuro changes. In both: fluids first, check K+ before insulin, add dextrose as glucose falls.
`,
  },
  {
    exam: "nclex-rn",
    category: PA,
    topic: "Increased intracranial pressure",
    kind: "notes",
    title: "Increased Intracranial Pressure",
    summary: "Early and late signs of rising ICP, Cushing's triad, and nursing measures to protect cerebral perfusion.",
    body: `# Increased Intracranial Pressure (ICP)

The skull is a fixed space containing brain tissue, blood and cerebrospinal fluid (Monro-Kellie doctrine). An increase in one component must be offset by the others, or pressure rises.

## Key Numbers
- **Normal ICP:** about 5–15 mm Hg
- **Cerebral perfusion pressure (CPP)** = MAP − ICP; a commonly cited target is **60–70 mm Hg** or as ordered
- Sustained ICP above about 20–22 mm Hg generally requires intervention

## Causes
Traumatic brain injury, hemorrhage, tumors, cerebral edema after stroke, hydrocephalus, meningitis or encephalitis, hypoxia or hypercapnia.

## Early Signs
- **Change in level of consciousness** — restlessness, irritability, confusion, lethargy (the earliest and most sensitive sign)
- Headache, nausea, vomiting
- Subtle pupil changes, visual disturbances
- Decline in Glasgow Coma Scale score

## Late Signs
- **Cushing's triad:** widening pulse pressure (rising systolic BP), **bradycardia**, irregular respirations
- Fixed, dilated pupil(s)
- Decorticate or decerebrate posturing
- Seizures, coma
- In infants: bulging fontanel, high-pitched cry, increased head circumference

## Nursing Interventions
- **Head of bed 30 degrees**, head midline, avoid hip and neck flexion to promote venous drainage
- Maintain normal oxygenation and **avoid hypercapnia** (CO2 is a potent cerebral vasodilator); routine hyperventilation is not recommended
- Avoid activities that raise intrathoracic or intra-abdominal pressure: straining, coughing, suctioning longer than 10 seconds, clustering care
- Stool softeners; avoid isometric exercises
- Quiet, low-stimulation environment
- Maintain normothermia; treat fever promptly
- Seizure precautions
- **Osmotic therapy** as prescribed: mannitol (monitor serum osmolality and urine output) or hypertonic saline (monitor sodium)
- Monitor for diabetes insipidus or SIADH after head injury

## ICP Monitoring
- External ventricular drain or intraparenchymal monitor; level the transducer per protocol (commonly at the tragus of the ear)
- Strict sterile technique; clear CSF drainage should be monitored for volume and color

## Nursing Priorities
1. Airway and oxygenation
2. Neuro checks with GCS and pupils at prescribed intervals
3. Report any **decline in LOC** immediately

> **High-yield:** The **earliest** sign is a change in LOC; Cushing's triad (hypertension with widening pulse pressure, bradycardia, irregular breathing) is a **late** sign. HOB 30°, head midline, avoid straining and hypercapnia.
`,
  },
  {
    exam: "nclex-rn",
    category: "Maternal and Newborn",
    topic: "Preeclampsia",
    kind: "notes",
    title: "Preeclampsia and Magnesium Sulfate",
    summary: "Diagnostic criteria, severe features, HELLP, and safe magnesium sulfate administration and monitoring.",
    body: `# Preeclampsia and Magnesium Sulfate

## Definitions
- **Gestational hypertension:** BP 140/90 mm Hg or higher on two occasions after 20 weeks without proteinuria or severe features
- **Preeclampsia:** new hypertension after 20 weeks **plus** proteinuria **or** signs of end-organ involvement
- **Severe features:** BP **160/110** or higher, platelets below 100,000/mm3, elevated liver enzymes (twice normal), severe persistent right upper quadrant or epigastric pain, serum creatinine above 1.1 mg/dL or doubling, pulmonary edema, new headache unresponsive to treatment, visual disturbances
- **Eclampsia:** new-onset seizures in a client with preeclampsia
- **HELLP syndrome:** **H**emolysis, **E**levated **L**iver enzymes, **L**ow **P**latelets

Preeclampsia can occur or worsen **postpartum**, commonly within the first week.

## Risk Factors
First pregnancy, history of preeclampsia, chronic hypertension, diabetes, kidney disease, multifetal gestation, obesity, autoimmune disease, age over 35. Low-dose aspirin is recommended for many high-risk clients starting in the late first trimester per provider.

## Management
- **Delivery** is the definitive treatment
- **Antihypertensives** for severe-range BP: IV labetalol, IV hydralazine, or immediate-release oral nifedipine
- **Magnesium sulfate** for seizure prophylaxis (it is not an antihypertensive)

## Magnesium Sulfate
- Given IV via an infusion **pump** as a loading dose followed by a maintenance infusion; high-alert medication
- **Therapeutic serum level:** about **4–7 mEq/L** (about 4.8–8.4 mg/dL)

### Signs of Toxicity
| Approximate level | Finding |
|---|---|
| Above therapeutic | **Loss of deep tendon reflexes** (first sign) |
| Higher | **Respiratory depression** (RR under 12) |
| Highest | Cardiac arrest |

Also watch for urine output below **30 mL/hr** (magnesium is cleared by the kidneys), decreasing LOC, and hypotension.

### Nursing Actions
- Assess DTRs, respiratory rate, LOC, SpO2, BP and urine output at the frequency in protocol
- Strict I&O with an indwelling catheter
- Keep **calcium gluconate** at the bedside (antidote)
- If toxicity is suspected: **stop the infusion**, call for help, assess airway, prepare calcium gluconate
- Continuous fetal monitoring; magnesium can decrease fetal heart rate variability
- Seizure precautions: padded rails, suction and oxygen ready, low-stimulation room

## Nursing Priorities
- Headache, visual changes or epigastric pain in a pregnant or recently postpartum client must be reported promptly.
- During an eclamptic seizure: protect the client, turn to side, maintain airway after the seizure, note time and duration.

> **High-yield:** Mag toxicity sequence: **reflexes → respirations → heart**. Hold for absent DTRs, RR under 12, or urine output under 30 mL/hr. Antidote: calcium gluconate.
`,
  },
  {
    exam: "nclex-rn",
    category: "Maternal and Newborn",
    topic: "Newborn assessment",
    kind: "notes",
    title: "Newborn Assessment and APGAR Scoring",
    summary: "APGAR components and interpretation, normal newborn vital signs, and expected versus abnormal findings.",
    body: `# Newborn Assessment and APGAR

## APGAR Score
Scored at **1 and 5 minutes** after birth (and every 5 minutes up to 20 minutes if the 5-minute score is below 7). Each item scores 0, 1 or 2.

| Sign | 0 | 1 | 2 |
|---|---|---|---|
| **Heart rate** | Absent | Below 100 | 100 or above |
| **Respiratory effort** | Absent | Slow, irregular, weak cry | Good, strong cry |
| **Muscle tone** | Limp | Some flexion | Active motion |
| **Reflex irritability** | No response | Grimace | Cry, cough or sneeze |
| **Color** | Blue or pale all over | Body pink, extremities blue (acrocyanosis) | Completely pink |

### Interpretation
- **7–10:** reassuring
- **4–6:** moderately abnormal
- **0–3:** low; needs immediate intervention

Resuscitation decisions are based on heart rate, breathing and tone — **do not wait for the 1-minute APGAR** to begin resuscitation.

## Normal Newborn Vital Signs
- Heart rate: about **110–160** bpm (can dip lower in deep sleep, higher when crying)
- Respiratory rate: about **30–60** breaths/min; brief periods of apnea under 15–20 seconds can be normal
- Axillary temperature: about **36.5–37.5 °C** (97.7–99.5 °F)
- Weight: typically 2,500–4,000 g; loss of up to about 7–10% in the first days is expected

## Expected Findings
- Acrocyanosis in the first 24–48 hours
- Molding, caput succedaneum (crosses suture lines, resolves in days)
- Milia, Mongolian spots (document location), erythema toxicum
- Anterior fontanel diamond shaped, open; posterior triangle shaped
- Positive Moro, rooting, sucking, palmar and plantar grasp, Babinski reflexes
- Meconium within 24–48 hours

## Findings to Report
- **Jaundice within the first 24 hours** (pathologic)
- Central cyanosis, grunting, nasal flaring, retractions, RR persistently above 60
- Cephalohematoma with significant enlargement (risk of hyperbilirubinemia)
- Asymmetric Moro (possible clavicle fracture or brachial plexus injury)
- Bulging or depressed fontanel
- Single umbilical artery (associated anomalies)
- Glucose below the unit's threshold, jitteriness (hypoglycemia, hypocalcemia)

## Routine Care
- Vitamin K IM (prevents vitamin K deficiency bleeding)
- Erythromycin eye ointment
- Hepatitis B vaccine within 24 hours of birth for medically stable infants
- Newborn metabolic screen after 24 hours of feeding, hearing screen, critical congenital heart disease pulse oximetry screen

## Nursing Priorities
1. Airway and breathing, then **thermoregulation** (dry, skin-to-skin, hat)
2. Glucose monitoring for at-risk newborns
3. Safety: identification bands, security system

> **High-yield:** APGAR = **A**ppearance, **P**ulse, **G**rimace, **A**ctivity, **R**espirations. Heart rate is the most important indicator of effective resuscitation.
`,
  },
  {
    exam: "nclex-rn",
    category: HPM,
    topic: "Developmental milestones",
    kind: "notes",
    title: "Pediatric Developmental Milestones",
    summary: "Key motor, language and social milestones from infancy through adolescence with Erikson stages and safe toys.",
    body: `# Pediatric Developmental Milestones

Milestones are ranges, not deadlines. Exam questions usually test the **typical** age and red flags. Adjust for prematurity until about age 2.

## Infancy (Birth to 12 months) — Trust vs Mistrust
| Age | Milestones |
|---|---|
| 2 months | Social smile, lifts head when prone, coos |
| 4 months | Rolls front to back, laughs, holds head steady, reaches for objects |
| 6 months | Rolls both ways, sits with support (tripod), babbles, begins solids; stranger awareness emerging |
| 9 months | Sits without support, crawls, pulls to stand, pincer grasp developing, object permanence |
| 12 months | Cruises or first steps, 1–3 words, waves bye-bye, **birth weight triples** |

- Birth weight **doubles by about 5–6 months**
- Posterior fontanel closes by about 2 months; anterior by about 12–18 months
- Safe toys: mobiles, rattles, soft blocks, mirrors; avoid small parts

## Toddler (1–3 years) — Autonomy vs Shame and Doubt
- Walks well by about 15 months; runs and climbs stairs by 2 years
- Two-word phrases by about 2 years; 50+ words
- Parallel play, negativism, temper tantrums, ritualism
- Toilet training readiness often 18–24 months or later
- Safe toys: push-pull toys, large blocks, simple puzzles
- Safety: poisoning, drowning, burns, rear-facing car seat as long as the seat allows

## Preschool (3–6 years) — Initiative vs Guilt
- Rides tricycle at 3; hops and skips by 5
- Draws a circle (3), cross (4), triangle (5)
- Associative and cooperative play, magical thinking, imaginary friends
- Fears of the dark, mutilation and separation
- Use therapeutic play and simple explanations for procedures

## School Age (6–12 years) — Industry vs Inferiority
- Concrete operational thinking, rules and collections
- Peer group importance grows; competitive and cooperative play
- Explain procedures using diagrams; allow choices; protect modesty

## Adolescence (12–18 years) — Identity vs Role Confusion
- Abstract thinking, body image concerns, peer influence
- Provide privacy and confidentiality; interview without parents when appropriate
- Screen for depression, substance use, sexual health concerns

## Red Flags to Report
- No social smile by about 3 months
- Not sitting by about 9 months or not walking by about 18 months
- No words by about 16 months, no two-word phrases by 24 months
- **Any loss of previously acquired skills** at any age

## Nursing Priorities
- Approach the child according to developmental stage, not chronologic age alone.
- Hospitalized toddlers experience separation anxiety (protest, despair, detachment); encourage rooming-in.

> **High-yield:** Weight doubles at 5–6 months and triples at 1 year. Toddlers: parallel play and autonomy. Preschoolers: magical thinking. Loss of skills is always a red flag.
`,
  },
  {
    exam: "nclex-rn",
    category: PSY,
    topic: "Therapeutic communication",
    kind: "notes",
    title: "Therapeutic Communication Techniques",
    summary: "Techniques that promote expression and the nontherapeutic responses to eliminate on exam items.",
    body: `# Therapeutic Communication

Therapeutic communication is **client-centered** and goal-directed. The best answer usually focuses on the client's **feelings**, encourages expression, and keeps the nurse honest and present.

## Therapeutic Techniques
| Technique | Example |
|---|---|
| **Open-ended questions** | "What has this week been like for you?" |
| **Reflecting** | "You feel your family isn't listening to you." |
| **Restating / paraphrasing** | "You're saying you haven't slept since the diagnosis." |
| **Clarifying** | "I'm not sure I understand. Can you tell me more about that?" |
| **Offering self** | "I'll sit with you for a while." |
| **Active listening and silence** | Attentive posture, eye contact as culturally appropriate, allowing pauses |
| **Focusing** | "Let's talk more about the pain you mentioned." |
| **Acknowledging feelings** | "This must be frightening." |
| **Presenting reality** | "I don't hear any voices, but I understand they seem real to you." |
| **Summarizing** | "Today we discussed your concerns about going home and two ways to cope." |
| **Giving information** | "Visiting hours begin at 9 a.m." |

## Nontherapeutic Responses (Eliminate These)
- **False reassurance:** "Everything will be fine."
- **Asking "why":** puts clients on the defensive
- **Giving advice / personal opinion:** "If I were you, I would…"
- **Changing the subject** or avoiding painful topics
- **Belittling or minimizing:** "Lots of people have this surgery."
- **Approving or disapproving:** "That's good," "You shouldn't feel that way."
- **Defending staff or the institution:** "Your doctor is very experienced."
- **Closed-ended questions** when exploration is needed
- **Stereotyped, clichéd** responses: "Keep your chin up."

## Situations
- **Hallucinations:** do not argue or agree; present reality and focus on feelings or safety.
- **Delusions:** do not challenge the content; redirect to reality-based topics.
- **Anger:** stay calm, acknowledge feelings, set limits on behavior, maintain a safe distance.
- **Grief:** offer presence; it is acceptable to be silent.
- **Client asks a question you cannot answer:** be honest and seek the information or refer appropriately.
- **Interpreters:** use a qualified medical interpreter, never family members or children; speak directly to the client.

## Nursing Priorities
- Safety statements override exploration: if a client hints at self-harm, ask directly about suicidal thoughts.
- Respect cultural norms around eye contact, touch and personal space.

> **High-yield:** Pick the response that **reflects feelings** or **invites more information**. Eliminate "why" questions, advice, false reassurance and anything defending the staff.
`,
  },
  {
    exam: "nclex-rn",
    category: PSY,
    topic: "Suicide risk",
    kind: "notes",
    title: "Suicide Risk Assessment and Precautions",
    summary: "Risk and warning signs, direct assessment, environmental safety and observation levels.",
    body: `# Suicide Risk and Precautions

## Risk Factors
- Previous suicide attempt (strongest predictor)
- Depression, bipolar disorder, schizophrenia, substance use disorders
- Recent loss, isolation, chronic pain or serious illness
- Access to lethal means (especially firearms)
- Family history of suicide; history of trauma or abuse
- Groups with elevated risk include older men, adolescents and young adults, veterans, and LGBTQ+ youth facing rejection

## Warning Signs
- Talking about wanting to die, being a burden, or having no reason to live
- Giving away possessions, saying goodbye, writing a will suddenly
- Withdrawal, increased substance use, reckless behavior
- **Sudden calm or improved mood after severe depression** — may signal a decision has been made
- **Early antidepressant therapy:** energy can return before mood improves; increased risk in children, adolescents and young adults (boxed warning)

## Assessment
- Ask **directly**: "Are you thinking about killing yourself?" Asking does **not** plant the idea.
- Assess **plan, intent, means, lethality and timeline**. A specific plan with available, lethal means indicates high risk.
- Use validated screening tools per facility policy (for example, the Columbia Suicide Severity Rating Scale or ASQ for youth).

## Safety Precautions
- **Environmental check:** remove belts, shoelaces, cords, plastic bags, sharps, glass; ligature-resistant fixtures
- Search belongings per policy
- **Observation level** as ordered: frequent checks (for example, every 15 minutes at irregular times) or **continuous 1:1 observation** within arm's length for high risk
- Ensure medications are swallowed (mouth checks); watch for hoarding
- Room close to the nurses' station
- Never leave a high-risk client alone, including in the bathroom

## Therapeutic Approach
- **No-suicide contracts are not a substitute** for assessment and precautions.
- Collaborate on a **safety plan:** warning signs, coping strategies, people to contact, crisis lines (in the US, the 988 Suicide & Crisis Lifeline), and restricting access to lethal means.
- Convey hope; involve family and support systems with the client's consent.

## Nursing Priorities
1. Client safety (immediate environment and observation)
2. Direct assessment and communication with the treatment team
3. Document statements verbatim and observations

> **High-yield:** Ask directly, assess the plan and means, and initiate precautions. Watch closely when energy returns or mood suddenly lifts — risk may be **increasing**, not decreasing.
`,
  },
  {
    exam: "nclex-rn",
    category: PSY,
    topic: "Alcohol withdrawal",
    kind: "notes",
    title: "Alcohol Withdrawal and Delirium Tremens",
    summary: "Timeline of withdrawal, CIWA-Ar guided treatment, thiamine, and safety priorities.",
    body: `# Alcohol Withdrawal

Chronic alcohol use enhances inhibitory (GABA) signaling and suppresses excitatory signaling. When alcohol stops, the nervous system becomes **hyperexcitable**.

## Timeline (from last drink, approximate)
| Time | Findings |
|---|---|
| 6–24 h | Tremors, anxiety, insomnia, nausea, diaphoresis, tachycardia, hypertension |
| 12–48 h | Alcohol-related hallucinations (often visual or tactile) with a clear sensorium |
| 6–48 h | **Withdrawal seizures** (generalized tonic-clonic) |
| 48–96 h | **Delirium tremens (DTs):** disorientation, agitation, severe autonomic instability, fever, hallucinations — a medical emergency |

## Assessment
- Time and amount of last drink; history of prior withdrawal seizures or DTs (strong predictors of severe withdrawal)
- **CIWA-Ar** scale guides symptom-triggered dosing: nausea/vomiting, tremor, sweating, anxiety, agitation, tactile/auditory/visual disturbances, headache, orientation
- Screen for co-ingestions, head injury, infection, hypoglycemia

## Treatment
- **Benzodiazepines** are first line (for example, lorazepam, chlordiazepoxide, diazepam). Lorazepam or oxazepam are often preferred with liver impairment or in older adults.
- **Thiamine before glucose** to prevent or treat Wernicke encephalopathy (confusion, ataxia, ophthalmoplegia)
- Folic acid, multivitamin, magnesium and potassium replacement as needed
- IV fluids for dehydration; monitor glucose
- Phenobarbital or other agents per protocol for benzodiazepine-resistant withdrawal

## Nursing Care
- **Seizure precautions:** padded rails, suction and oxygen at bedside
- Quiet, well-lit room to reduce misperceptions; frequent reorientation
- Vital signs and CIWA-Ar at prescribed intervals
- Monitor for oversedation and respiratory depression with benzodiazepines
- Fall precautions; avoid restraints when possible (they increase agitation)
- Aspiration precautions if vomiting or sedated

## Long-Term Recovery Medications
- **Naltrexone:** reduces cravings; contraindicated with opioid use or acute hepatitis
- **Acamprosate:** reduces cravings; adjust for kidney function
- **Disulfiram:** produces a severe reaction with alcohol, including alcohol in mouthwash, cough syrups and some sauces or lotions

## Nursing Priorities
1. Airway and seizure safety
2. Vital sign trends (rising HR, BP and temperature signal worsening)
3. Orientation and safety

> **High-yield:** Benzodiazepines for withdrawal, **thiamine before glucose**, seizure precautions, and watch for DTs at 48–96 hours. A prior history of DTs predicts severe withdrawal.
`,
  },
];

/* ------------------------------------------------------------------ */
/* NCLEX-RN high-yield guides                                          */
/* ------------------------------------------------------------------ */
const NCLEX_GUIDES: SeedMaterial[] = [
  {
    exam: "nclex-rn",
    category: MOC,
    topic: "Patient safety",
    kind: "guide",
    title: "Next Generation NCLEX: The Clinical Judgment Model",
    summary: "How the six cognitive steps of clinical judgment map to NGN item types and how to work a case study.",
    body: `# The Clinical Judgment Model for NGN

The Next Generation NCLEX measures **clinical judgment** using the NCSBN Clinical Judgment Measurement Model. Case studies walk through six cognitive steps, usually one item per step.

## The Six Steps
| Step | Question to ask yourself | Common item types |
|---|---|---|
| **1. Recognize cues** | Which data are relevant and abnormal? | Highlight, matrix, drop-down |
| **2. Analyze cues** | What conditions are consistent with these cues? | Drop-down cloze, matrix |
| **3. Prioritize hypotheses** | Which problem is most urgent or most likely? | Bow-tie, drop-down |
| **4. Generate solutions** | What outcomes do I want, and what actions get there? | Matrix multiple response, SATA |
| **5. Take action** | Which interventions do I implement now? | Bow-tie, SATA, drag and drop |
| **6. Evaluate outcomes** | Did the client improve? | Matrix, highlight, trend |

## Working a Case Study
1. **Read the whole scenario first** — nurses' notes, vital signs, labs, orders, history tabs.
2. **Mark what changed.** Trends matter more than single values. A temperature rising across three readings tells a different story than one value.
3. **Name the problem in your head** before reading options ("This looks like early sepsis").
4. **Re-read each item's question.** Each step asks something different even when the exhibit is the same.
5. For evaluation items, compare new data to the client's **baseline** and to expected outcomes of the actions taken.

## Item-Type Tips
- **Highlight:** select only findings that require follow-up or support the condition named; normal findings are distractors.
- **Matrix:** evaluate each row independently; a column may have zero or several correct answers.
- **Bow-tie:** center = condition; left = actions to take; right = parameters to monitor. Make the center decision first, then align both sides with it.
- **Drop-down cloze:** read the full sentence with your choice inserted to check it makes clinical sense.
- **Trend:** look across time points for direction and rate of change.

## Scoring Notes
- Many NGN items use **partial credit** (for example, +/- scoring for SATA-type items, where incorrect selections subtract points). Guessing every option is penalized.
- Standalone items and case studies are both included.

## Common Pitfalls
- Choosing actions for a condition that is plausible but **not the most urgent**
- Ignoring medication history (for example, a beta blocker masking tachycardia)
- Treating a single abnormal value without the clinical picture

> **High-yield:** Cues → hypotheses → actions → evaluation. Anchor every answer to **this client's data**, and always compare against baseline and trend.
`,
  },
  {
    exam: "nclex-rn",
    category: MOC,
    topic: "Prioritization",
    kind: "guide",
    title: "Select-All-That-Apply (SATA) Strategy",
    summary: "A disciplined approach for multiple-response items that reduces guessing and over-selection.",
    body: `# SATA Strategy

Select-all-that-apply items can have **one or all** options correct. Treat each option as a separate true/false question.

## The Method
1. **Read the stem twice.** Identify the client, condition and what is being asked (teaching? findings to report? actions to take?).
2. **Rephrase the stem as a statement.** For example, "Expected findings of hypokalemia include ___."
3. **Cover the other options.** Judge each option independently: "Is this true for this client in this situation?"
4. **Avoid pattern thinking.** There is no rule about a minimum number of answers.
5. **Look for the negative.** Stems like "requires further teaching" or "the nurse should avoid" flip the logic. Write a note to yourself.

## Filters for Each Option
- Is it **accurate** (factually correct)?
- Is it **relevant** to this condition and stem?
- Is it **safe** and **within nursing scope**?
- Is it the **right time** — for example, a long-term teaching point when the stem asks for immediate actions?

## Partial-Credit Reality
NGN multiple-response items commonly use **+/- scoring** or 0/1 scoring by option groups. Selecting an option you are unsure about can cost a point. Choose options you can justify.

## Common Traps
- **Absolute words** ("always," "never," "all") are often, but not always, wrong in clinical practice.
- **Partially correct options:** if any part of the option is incorrect, the whole option is incorrect.
- **Unrelated true statements:** a fact can be true but not answer the question asked.
- **Over-reading:** do not add information that the stem does not give.

## Practice Routine
- After each SATA set, review **every option**, not just the overall item result.
- Track which content areas produce most errors, and convert them to flashcards.
- Explain aloud why each wrong option is wrong.

> **High-yield:** True/false each option against the stem. Do not count answers, do not hedge with extras, and watch for negatively worded stems.
`,
  },
  {
    exam: "nclex-rn",
    category: RRP,
    topic: "Laboratory values",
    kind: "guide",
    title: "Lab Values You Must Know",
    summary: "The core laboratory values, what their abnormalities mean, and the nursing action each one triggers.",
    body: `# Lab Values You Must Know

Reference ranges vary by laboratory; the values here are commonly used teaching ranges. On the exam, focus on **what the abnormal value means** and **what you do next**.

## Electrolytes
| Lab | Range | If abnormal |
|---|---|---|
| Sodium | 135–145 mEq/L | Neuro changes; seizure precautions; correct slowly |
| Potassium | 3.5–5.0 mEq/L | Cardiac monitor; never IV push K+ |
| Calcium | 8.6–10.2 mg/dL | Low: tetany, Chvostek/Trousseau; high: weakness, stones |
| Magnesium | 1.3–2.1 mEq/L | Low: hyperreflexia, torsades; high: hyporeflexia |

## Hematology and Coagulation
| Lab | Range | Notes |
|---|---|---|
| Hemoglobin | M 13.5–17.5 g/dL; F 12–15.5 g/dL | Low → assess for bleeding, fatigue |
| WBC | 4,500–11,000/mm3 | Neutropenia → protective measures |
| Platelets | 150,000–400,000/mm3 | Under 50,000 → bleeding precautions; under 20,000 → spontaneous bleeding risk |
| INR | 0.8–1.1 (therapeutic on warfarin often 2–3) | Antidote: vitamin K |
| aPTT | about 25–35 s (heparin target 1.5–2.5x control) | Antidote: protamine |

## Renal
- **BUN** 7–20 mg/dL — rises with dehydration, GI bleeding, kidney injury
- **Creatinine** about 0.6–1.2 mg/dL — the better kidney function marker; check before contrast, metformin, aminoglycosides, vancomycin

## Glucose and Endocrine
- Fasting glucose 70–99 mg/dL; hypoglycemia under 70 mg/dL
- HbA1c under 5.7% normal; 5.7–6.4% prediabetes; 6.5% or higher diabetes; many adults with diabetes target under 7%

## ABGs
- pH 7.35–7.45; PaCO2 35–45 mm Hg; HCO3- 22–26 mEq/L; PaO2 80–100 mm Hg

## Therapeutic Drug Levels
| Drug | Typical range | Toxicity clues |
|---|---|---|
| Digoxin | 0.5–2.0 ng/mL (HF often 0.5–0.9) | Nausea, vision changes (yellow-green halos), dysrhythmias |
| Lithium | 0.6–1.2 mEq/L | Coarse tremor, vomiting, diarrhea, confusion above about 1.5 |
| Phenytoin | 10–20 mcg/mL | Nystagmus, ataxia, gingival hyperplasia (long term) |
| Magnesium sulfate | 4–7 mEq/L | Loss of DTRs, RR under 12 |

## Must-Know Action Pairs
- Potassium high + peaked T waves → cardiac monitor, notify provider, prepare calcium gluconate and insulin with glucose
- Platelets low → no IM injections, soft toothbrush, avoid rectal temperatures
- ANC under 500 → neutropenic precautions
- Creatinine rising → review nephrotoxic drugs, monitor urine output

> **High-yield:** Memorize the core eight — Na, K, Ca, Mg, glucose, Hgb, platelets, INR — and the action each abnormality triggers.
`,
  },
  {
    exam: "nclex-rn",
    category: MOC,
    topic: "Patient safety",
    kind: "guide",
    title: "8-Week NCLEX-RN Study Plan",
    summary: "A week-by-week schedule that pairs content review with daily question practice and readiness checks.",
    body: `# 8-Week NCLEX-RN Study Plan

This plan assumes about **3–4 hours per day, 5–6 days per week**. Adjust the pace to your diagnostic results.

## Daily Structure
- **75–100 practice questions** with full rationale review (including correct answers)
- **1–2 hours of content review** targeted at the week's focus
- **15–20 minutes of flashcards** (labs, antidotes, precautions, milestones)
- Log every missed question by topic and reason: knowledge gap, misread stem, or second-guessing

## Week 1 — Baseline and Foundations
- Take a **diagnostic assessment**
- Review: prioritization frameworks, delegation, therapeutic communication
- Learn the clinical judgment model steps

## Week 2 — Safety and Infection Control, Fundamentals
- Precautions, PPE sequence, fall and restraint safety, medication safety
- Fluid and electrolytes, acid-base

## Week 3 — Pharmacology
- High-alert drugs: insulin, anticoagulants, opioids, potassium, magnesium
- Antidotes, therapeutic levels, common side effects by drug class
- Dosage and IV calculations practice

## Week 4 — Adult Health I
- Cardiovascular (heart failure, MI, dysrhythmias), respiratory (COPD, asthma, PE, pneumothorax)
- **Midpoint mock exam** at the end of the week

## Week 5 — Adult Health II
- Neuro (stroke, ICP, seizures), endocrine (DKA/HHS, thyroid, adrenal), renal, GI, hematology, oncology

## Week 6 — Maternal-Newborn and Pediatrics
- Pregnancy complications, labor, postpartum, newborn assessment
- Growth and development, pediatric emergencies, immunizations

## Week 7 — Mental Health and NGN Case Studies
- Mood, psychotic, anxiety and substance disorders, suicide precautions, psych meds
- Daily NGN case studies: bow-tie, matrix, cloze, trend items

## Week 8 — Integration and Readiness
- Two full-length timed mock exams (early and mid-week)
- Remediate weakest three categories only
- Light review in the final 48 hours; rest, sleep, logistics, confirm testing appointment and ID

## Readiness Signals
- Consistent performance at or above the readiness target in your analytics across several mixed sets
- Improving scores on unseen mixed-topic questions, not repeated items
- Being able to explain rationales for both right and wrong options

> **High-yield:** Questions every day, rationales every time. Use your weak-area analytics to decide what to study tomorrow, not what you studied yesterday.
`,
  },
];

/* ------------------------------------------------------------------ */
/* NCLEX-RN video lecture outlines (videoUrl uploaded later by admins) */
/* ------------------------------------------------------------------ */
const NCLEX_VIDEOS: SeedMaterial[] = [
  {
    exam: "nclex-rn",
    category: PPT,
    topic: "Cardiac medications",
    kind: "video",
    title: "Cardiac Medications Made Clear",
    summary: "A lecture on beta blockers, ACE inhibitors, ARBs, calcium channel blockers, nitrates, digoxin and antidysrhythmics.",
    durationMinutes: 42,
    body: `# Lecture Outline: Cardiac Medications

1. **Introduction (0:00)** — how to learn drugs by class using suffixes and mechanism
2. **Beta blockers (-olol)** — decrease HR and BP; hold for bradycardia or hypotension; caution in asthma; can mask hypoglycemia
3. **ACE inhibitors (-pril) and ARBs (-sartan)** — cough and angioedema with ACE inhibitors; hyperkalemia; avoid in pregnancy
4. **Calcium channel blockers** — dihydropyridines (amlodipine) vs non-dihydropyridines (diltiazem, verapamil); grapefruit interactions; constipation
5. **Nitrates** — headache, hypotension; sublingual dosing for angina; no phosphodiesterase-5 inhibitors
6. **Digoxin** — apical pulse for a full minute; toxicity signs; potassium link
7. **Antidysrhythmics** — amiodarone (pulmonary, thyroid, liver monitoring), adenosine (rapid IV push with flush, brief asystole expected)
8. **Case review and practice questions (35:00)**
`,
  },
  {
    exam: "nclex-rn",
    category: PA,
    topic: "Sepsis",
    kind: "video",
    title: "Shock and Sepsis: Recognize and Respond",
    summary: "A lecture on shock types, early sepsis recognition, fluid resuscitation and vasopressor monitoring.",
    durationMinutes: 38,
    body: `# Lecture Outline: Shock and Sepsis

1. **Shock physiology (0:00)** — inadequate tissue perfusion, MAP and lactate
2. **Types of shock** — hypovolemic, cardiogenic, distributive (septic, anaphylactic, neurogenic), obstructive
3. **Early recognition** — tachycardia, tachypnea, altered mentation, falling urine output, rising lactate
4. **Sepsis bundle concepts** — lactate, blood cultures before antibiotics, broad-spectrum antibiotics promptly, 30 mL/kg crystalloid for hypotension or lactate 4 mmol/L or higher, vasopressors to keep MAP 65 mm Hg or higher
5. **Vasopressor nursing care** — central line preferred, extravasation management, titration
6. **Anaphylaxis** — IM epinephrine first; airway; fluids
7. **Neurogenic shock** — bradycardia with hypotension after spinal cord injury
8. **NGN case study walkthrough (30:00)**
`,
  },
  {
    exam: "nclex-rn",
    category: "Maternal and Newborn",
    topic: "Fetal monitoring",
    kind: "video",
    title: "Fetal Heart Rate Monitoring Basics",
    summary: "A lecture on baseline, variability, accelerations and decelerations with nursing interventions.",
    durationMinutes: 35,
    body: `# Lecture Outline: Fetal Heart Rate Monitoring

1. **Baseline (0:00)** — normal 110–160 bpm; causes of fetal tachycardia and bradycardia
2. **Variability** — absent, minimal, moderate (reassuring), marked
3. **Accelerations** — signs of fetal well-being
4. **Early decelerations** — head compression; mirror contractions; no intervention needed
5. **Variable decelerations** — cord compression; reposition, assess for prolapsed cord
6. **Late decelerations** — uteroplacental insufficiency; stop oxytocin, reposition to side, IV fluid bolus, oxygen per protocol, notify provider
7. **Three-tier categories** — Category I, II, III interpretation
8. **Practice strips (28:00)**
`,
  },
  {
    exam: "nclex-rn",
    category: RRP,
    topic: "ECG interpretation",
    kind: "video",
    title: "ECG Rhythms for the NCLEX",
    summary: "A lecture on reading rhythm strips and the priority nursing action for each high-yield dysrhythmia.",
    durationMinutes: 45,
    body: `# Lecture Outline: ECG Rhythms

1. **The ECG strip (0:00)** — waves, intervals, the 6-second method for rate
2. **Sinus rhythms** — sinus bradycardia and tachycardia; treat the cause
3. **Atrial fibrillation** — irregularly irregular; anticoagulation and rate control; stroke risk
4. **Atrial flutter** — sawtooth waves
5. **Heart blocks** — first, second (type I and II) and third degree; atropine and pacing concepts
6. **Ventricular tachycardia** — with pulse vs pulseless; synchronized cardioversion vs defibrillation
7. **Ventricular fibrillation and asystole** — CPR and defibrillation for VF; asystole is not shockable
8. **Electrolyte clues** — peaked T waves, U waves, prolonged QT
9. **Rapid-fire rhythm practice (38:00)**
`,
  },
];

/* ------------------------------------------------------------------ */
/* Other exams: two topic notes each                                    */
/* ------------------------------------------------------------------ */
const OTHER_NOTES: SeedMaterial[] = [
  // USMLE Step 1 (subject axis, no sections)
  {
    exam: "usmle-step-1",
    topic: "Pharmacology",
    kind: "notes",
    title: "Autonomic Receptors and Their Drugs",
    summary: "Adrenergic and cholinergic receptor subtypes, second messengers, effects and prototype agents.",
    body: `# Autonomic Receptors

## Second Messenger Summary
| Receptor | G protein | Main effects |
|---|---|---|
| α1 | Gq (↑ IP3/DAG, ↑ Ca2+) | Vasoconstriction, mydriasis (radial muscle), bladder sphincter contraction |
| α2 | Gi (↓ cAMP) | ↓ Sympathetic outflow, ↓ insulin release, ↓ aqueous humor |
| β1 | Gs (↑ cAMP) | ↑ HR, ↑ contractility, ↑ renin |
| β2 | Gs | Bronchodilation, vasodilation (skeletal muscle), uterine relaxation, glycogenolysis |
| M1, M3 | Gq | M3: bronchoconstriction, ↑ secretions, detrusor contraction, miosis |
| M2 | Gi | ↓ HR and AV conduction |
| Nicotinic | Ligand-gated ion channel | Autonomic ganglia (NN), neuromuscular junction (NM) |

## Prototype Agents
- **α1 agonist:** phenylephrine (reflex bradycardia)
- **α2 agonist:** clonidine (rebound hypertension when stopped abruptly)
- **β1 > β2 agonist:** dobutamine (inotrope)
- **β2 agonist:** albuterol (tremor, tachycardia, hypokalemia)
- **Nonselective β blocker:** propranolol; **β1-selective:** metoprolol, atenolol
- **Muscarinic antagonist:** atropine — dry, hot, flushed, dilated pupils, delirium, urinary retention
- **Cholinesterase inhibitors:** neostigmine (no CNS penetration), physostigmine (CNS; reverses anticholinergic toxicity)

## Classic Patterns
- **Epinephrine** at low doses favors β (↓ diastolic pressure); high doses favor α1.
- **Norepinephrine** raises BP with reflex bradycardia (α1 plus β1).
- **Organophosphate poisoning:** muscarinic excess (diarrhea, urination, miosis, bronchorrhea, bradycardia, emesis, lacrimation, salivation) plus nicotinic weakness — treat with atropine and pralidoxime (early).

> **High-yield:** Learn the G protein for each receptor (Gq: α1, M1, M3; Gi: α2, M2; Gs: β1, β2). Knowing the second messenger lets you predict any agonist or antagonist effect.
`,
  },
  {
    exam: "usmle-step-1",
    topic: "Biochemistry",
    kind: "notes",
    title: "Fed vs Fasting Metabolism and Rate-Limiting Enzymes",
    summary: "Hormonal regulation of fuel metabolism and the rate-limiting enzyme of each major pathway.",
    body: `# Fed vs Fasting Metabolism

## Hormonal Control
- **Insulin (fed):** stimulates glycogen synthesis, glycolysis, fatty acid and protein synthesis; inhibits gluconeogenesis and lipolysis. Dephosphorylation of key enzymes predominates.
- **Glucagon and epinephrine (fasting):** stimulate glycogenolysis, gluconeogenesis, lipolysis and ketogenesis via cAMP and protein kinase A (phosphorylation).

## Rate-Limiting Enzymes
| Pathway | Enzyme | Key regulators |
|---|---|---|
| Glycolysis | Phosphofructokinase-1 | + AMP, fructose-2,6-bisphosphate; − ATP, citrate |
| Gluconeogenesis | Fructose-1,6-bisphosphatase | − fructose-2,6-bisphosphate, AMP |
| TCA cycle | Isocitrate dehydrogenase | + ADP; − ATP, NADH |
| Glycogenesis | Glycogen synthase | + insulin, glucose-6-phosphate |
| Glycogenolysis | Glycogen phosphorylase | + glucagon, epinephrine, AMP (muscle) |
| HMP shunt | Glucose-6-phosphate dehydrogenase | + NADP+; − NADPH |
| Fatty acid synthesis | Acetyl-CoA carboxylase | + insulin, citrate; − glucagon, palmitoyl-CoA |
| Fatty acid oxidation | Carnitine acyltransferase I | − malonyl-CoA |
| Ketogenesis | HMG-CoA synthase | — |
| Cholesterol synthesis | HMG-CoA reductase | + insulin; − glucagon, cholesterol, statins |
| Urea cycle | Carbamoyl phosphate synthetase I | + N-acetylglutamate |

## Timeline of Fasting
1. **0–24 h:** hepatic glycogenolysis is the main glucose source; gluconeogenesis rises
2. **1–3 days:** gluconeogenesis from amino acids, glycerol and lactate dominates
3. **Prolonged starvation:** ketone bodies become the brain's major fuel; protein is spared
- Red blood cells rely on glycolysis only (no mitochondria); the liver makes ketones but cannot use them (lacks succinyl-CoA:acetoacetate CoA transferase / thiophorase).

> **High-yield:** Malonyl-CoA blocks fatty acid entry into mitochondria, so synthesis and oxidation do not run simultaneously. G6PD deficiency → ↓ NADPH → oxidative hemolysis (Heinz bodies, bite cells).
`,
  },
  // MCAT
  {
    exam: "mcat",
    category: "Biological and Biochemical Foundations",
    topic: "Biochemistry",
    kind: "notes",
    title: "Enzyme Kinetics and Inhibition",
    summary: "Michaelis-Menten kinetics, Lineweaver-Burk plots and how each inhibitor type changes Km and Vmax.",
    body: `# Enzyme Kinetics and Inhibition

## Michaelis-Menten
v = Vmax[S] / (Km + [S])
- **Km:** substrate concentration at half Vmax; a **lower Km means higher apparent affinity**
- **Vmax:** maximum rate when enzyme is saturated; proportional to enzyme concentration
- **kcat (turnover number)** = Vmax / [E]total; catalytic efficiency = kcat / Km

## Lineweaver-Burk (Double Reciprocal)
1/v = (Km / Vmax)(1/[S]) + 1/Vmax
- y-intercept = 1/Vmax; x-intercept = −1/Km; slope = Km/Vmax

## Inhibitor Types
| Inhibitor | Binds | Km | Vmax | Overcome by more substrate? |
|---|---|---|---|---|
| Competitive | Active site (free E) | ↑ | No change | Yes |
| Noncompetitive (pure) | E and ES equally, allosteric | No change | ↓ | No |
| Uncompetitive | ES complex only | ↓ | ↓ | No |
| Mixed | E and ES unequally | ↑ or ↓ | ↓ | No |

On a Lineweaver-Burk plot, competitive lines intersect on the y-axis; noncompetitive lines intersect on the x-axis; uncompetitive lines are parallel.

## Regulation Beyond Inhibition
- **Allosteric enzymes** show sigmoidal kinetics (cooperativity) rather than hyperbolic
- **Covalent modification** (phosphorylation), **zymogen** activation (proteolytic cleavage), and **feedback inhibition** by pathway end-products
- Temperature and pH optima: most human enzymes near 37 °C and pH 7.4, with exceptions (pepsin near pH 2)

## Test-Day Tips
- If a graph shows the same Vmax at high substrate, think **competitive**
- Irreversible inhibitors behave like reduced enzyme concentration (↓ Vmax)

> **High-yield:** Competitive = ↑ Km, same Vmax. Uncompetitive = both ↓ (parallel lines). Noncompetitive = ↓ Vmax, same Km.
`,
  },
  {
    exam: "mcat",
    category: "Critical Analysis and Reasoning Skills",
    topic: "CARS",
    kind: "notes",
    title: "CARS Passage Strategy",
    summary: "An approach to reading humanities and social science passages and dissecting CARS question types.",
    body: `# CARS Passage Strategy

CARS rewards understanding **the author's argument**, not outside knowledge. Every answer must be supported by the passage.

## Reading the Passage
- **Read for structure:** what is the main claim, what supports it, and where does the author push back on other views?
- **Track tone:** look for evaluative words (unfortunately, compelling, naive) that reveal the author's attitude.
- **Brief paragraph labels:** a few words per paragraph ("P3: critic's objection") are faster than highlighting everything.
- Aim for about **10 minutes per passage** including questions.

## Question Types
| Type | What it asks | How to approach |
|---|---|---|
| **Foundations of comprehension** | Main idea, meaning of a term in context | Predict before reading options; avoid answers too broad or too narrow |
| **Reasoning within the text** | How claims support each other; strength of evidence | Identify the claim and the support the passage actually gives |
| **Reasoning beyond the text** | Apply ideas to a new situation or assess new information | Ask what the author's logic would predict; check direction (strengthen or weaken) |

## Eliminating Wrong Answers
- **Extreme language** the author never uses (always, completely, proves)
- **Out of scope:** true in the real world but not addressed
- **Distortion:** uses passage words but changes the relationship
- **Opposite:** reverses the author's position

## Practice Plan
- Do 2–3 passages daily; review **why** each wrong option is wrong
- Keep an error log by question type
- Read dense long-form essays (philosophy, art criticism, economics) to build stamina

> **High-yield:** The correct answer is the one you can point to in the passage. If you need outside knowledge to justify it, it is probably wrong.
`,
  },
  // IELTS Academic
  {
    exam: "ielts-academic",
    category: "Writing",
    topic: "Task 1 (data description)",
    kind: "notes",
    title: "Writing Task 1: Describing Data",
    summary: "How to structure a Task 1 report with an overview, grouped comparisons and accurate data language.",
    body: `# Writing Task 1: Describing Data

Write **at least 150 words** in about **20 minutes**. You describe a chart, table, diagram, process or map — you do **not** give opinions or reasons.

## Four-Paragraph Structure
1. **Introduction:** paraphrase the prompt in one sentence ("The bar chart compares…").
2. **Overview:** two or three main trends or the most striking features. This is essential for Task Achievement above Band 6.
3. **Body 1:** detailed comparisons for one group of data.
4. **Body 2:** detailed comparisons for another group.

## Useful Language
- **Increase:** rose, climbed, grew steadily, surged
- **Decrease:** fell, declined, dropped sharply, dipped
- **Stability:** remained stable, levelled off, plateaued
- **Approximation:** approximately, just under, roughly a third
- **Comparison:** whereas, in contrast, twice as many as, the highest proportion

## Process Diagrams
- Use the **passive voice** ("The beans are roasted…") and sequencers (first, subsequently, finally).
- Mention the number of stages in your overview.

## Maps
- Use location language (to the north of, adjacent to) and change verbs (was demolished, was replaced by, was extended).

## Common Errors
- Listing every number without grouping
- Missing the overview, or putting conclusions/opinions at the end
- Mixing tenses: follow the time frame shown in the visual

> **High-yield:** No overview = capped score. Group data logically, select key figures, and compare rather than list.
`,
  },
  {
    exam: "ielts-academic",
    category: "Reading",
    topic: "True/False/Not Given",
    kind: "notes",
    title: "True / False / Not Given Questions",
    summary: "How to tell contradiction from missing information and avoid assumption traps.",
    body: `# True / False / Not Given

## Definitions
- **True:** the statement agrees with information in the passage.
- **False:** the passage **contradicts** the statement.
- **Not Given:** the passage provides **no information** to confirm or contradict it.

(Yes / No / Not Given questions work the same way but test the **writer's views** rather than facts.)

## Method
1. **Underline keywords** in the statement, especially names, dates and qualifiers (all, some, only, never, more than).
2. **Scan** for the matching section; questions follow passage order.
3. **Read the sentence before and after** the matching text carefully.
4. Ask: does the passage say the same thing, the opposite thing, or nothing at all?

## Classic Traps
- **Qualifiers:** "Most scientists agree" vs "All scientists agree" — the change makes the statement False.
- **Partial matches:** the topic appears but the specific claim does not → Not Given.
- **Background knowledge:** something that is true in real life but absent from the passage → Not Given.
- **Synonyms:** passage writers paraphrase; "decline" may appear as "fell" or "a reduction."

## Time Management
- Do not spend more than about 1–1.5 minutes per question.
- If you cannot find the information after a careful scan, Not Given is often the answer — but confirm you checked the right section.

> **High-yield:** False needs a contradiction; Not Given means the information simply isn't there. Never use outside knowledge.
`,
  },
  // OET Nursing
  {
    exam: "oet-nursing",
    category: "Writing",
    topic: "Referral letter",
    kind: "notes",
    title: "OET Writing: The Nursing Referral Letter",
    summary: "Selecting relevant case notes, organizing paragraphs by purpose and keeping a professional tone.",
    body: `# OET Writing: Referral Letter

You have **5 minutes of reading time** and **40 minutes to write** a letter of about **180–200 words** in the body, based on case notes.

## Assessment Criteria (overview)
Purpose, content, conciseness and clarity, genre and style, organization and layout, and language.

## Planning in Reading Time
1. Identify the **reader** (for example, community nurse, aged-care facility) and **what they need to do**.
2. Mark each case note as **relevant**, **background**, or **omit**.
3. Decide paragraph order by **importance to the reader**, not by the order of the notes.

## Structure
- **Opening paragraph:** state who the patient is and the **purpose** immediately ("I am writing to refer Mrs Lee, an 82-year-old woman discharged today following a fractured neck of femur, for ongoing wound care and mobility support.")
- **Body:** current condition and treatment, then relevant history, then social situation
- **Closing:** clear **requests** for the reader (dressing changes every 2 days, monitor for signs of infection), contact details offer

## Language Tips
- Formal but clear; avoid note-form ("Pt c/o pain")
- Expand abbreviations unless universally recognized
- Use cohesive devices: furthermore, however, as a result
- Convert notes into full sentences with accurate tenses (past for history, present for current status)

## Common Errors
- Copying every case note (loses conciseness marks)
- Burying the purpose in paragraph two
- Missing specific requests for the reader

> **High-yield:** Purpose in the first two sentences, only what the reader needs, and finish with clear actions.
`,
  },
  {
    exam: "oet-nursing",
    category: "Speaking",
    topic: "Role-play",
    kind: "notes",
    title: "OET Speaking: Nursing Role-Plays",
    summary: "Clinical communication skills assessed in OET role-plays and a structure for each conversation.",
    body: `# OET Speaking: Role-Plays

Each role-play lasts about **5 minutes** after **3 minutes of preparation**. The interlocutor plays a patient or relative; you play the nurse.

## Clinical Communication Criteria
1. **Relationship building:** respectful introduction, empathy, non-judgmental attitude
2. **Understanding and incorporating the patient's perspective:** ask about ideas, concerns and expectations
3. **Providing structure:** signposting ("First I'd like to ask about…, then we'll discuss…")
4. **Information gathering:** open questions, then focused questions; active listening
5. **Information giving:** chunk information, check understanding, avoid jargon

Linguistic criteria include intelligibility, fluency, appropriateness of language, and resources of grammar and expression.

## A Reliable Structure
1. Greet, introduce yourself, confirm the patient's name, state the purpose.
2. Ask an open question to explore the concern.
3. Acknowledge emotions ("I can see this is worrying you").
4. Cover each task on the card in a logical order.
5. Check understanding using teach-back ("Could you tell me how you'll use the inhaler?").
6. Summarize and close with a plan and an invitation for questions.

## Handling Difficult Moments
- **Reluctant or angry patient:** acknowledge, explain the reason, offer choices.
- **Misconceptions:** correct gently with clear reasons.
- **Interruptions:** pause, respond to the concern, then return to the task.

> **High-yield:** Empathy, signposting and checking understanding score points even when your clinical content is simple.
`,
  },
  // SAT
  {
    exam: "sat",
    category: "Math",
    topic: "Advanced Math",
    kind: "notes",
    title: "Quadratics and Nonlinear Functions",
    summary: "Factored, vertex and standard forms, the discriminant, and fast strategies for nonlinear questions.",
    body: `# Quadratics and Nonlinear Functions

## Three Forms of a Quadratic
| Form | Equation | Reveals |
|---|---|---|
| Standard | y = ax² + bx + c | y-intercept (c), direction (sign of a) |
| Factored | y = a(x − r)(x − s) | x-intercepts (r and s) |
| Vertex | y = a(x − h)² + k | Vertex (h, k), min or max value |

- **Axis of symmetry:** x = −b / (2a); the vertex lies on it and sits halfway between the roots.
- **Sum of roots** = −b/a; **product** = c/a.

## The Discriminant (b² − 4ac)
- Positive: two real solutions (graph crosses the x-axis twice)
- Zero: one real solution (vertex touches the x-axis)
- Negative: no real solutions

## Exponential Functions
- y = a(1 + r)^t for growth, y = a(1 − r)^t for decay
- Identify the initial value (a) and the rate (r) from context

## Systems with a Parabola and a Line
Set the expressions equal, rearrange to zero, and use the discriminant to count intersections.

## Strategy Tips
- Use the built-in graphing calculator in the digital test to find intercepts and vertices quickly.
- Plug in answer choices or simple numbers when algebra gets messy.
- Watch for questions asking for an **expression** (for example, the value of 2x + 3) rather than x itself.

> **High-yield:** Choose the form that reveals what the question asks for: roots → factored, maximum/minimum → vertex form.
`,
  },
  {
    exam: "sat",
    category: "Reading and Writing",
    topic: "Standard English Conventions",
    kind: "notes",
    title: "Punctuation and Sentence Boundaries",
    summary: "Rules for commas, semicolons, colons and dashes, and how to fix run-ons and fragments.",
    body: `# Punctuation and Sentence Boundaries

## Independent Clauses
An independent clause has a subject and verb and can stand alone. Two independent clauses can be joined by:
- a **period**
- a **semicolon**
- a **comma + FANBOYS** conjunction (for, and, nor, but, or, yet, so)
- a **colon** if the second clause explains or elaborates the first

Joining two independent clauses with only a comma is a **comma splice**.

## Colons and Dashes
- A colon must follow a **complete** independent clause: "She needed one thing: time."
- A pair of dashes or commas sets off nonessential information; be consistent (do not open with a dash and close with a comma).

## Commas
- After introductory phrases or clauses
- Around nonessential (nonrestrictive) elements: "My brother, who lives in Ohio, is visiting."
- **No comma** between a subject and its verb, or between a verb and its object
- No comma before an essential "that" clause

## Transitions with Semicolons
"The data were incomplete; however, the trend was clear." Words like however and therefore cannot join clauses with only a comma.

## Other Conventions
- **Subject–verb agreement:** ignore prepositional phrases between subject and verb
- **Pronoun–antecedent agreement and clarity**
- **Possessives:** its (possessive) vs it's (it is); plural possessive students'
- **Verb tense consistency** with the surrounding text

> **High-yield:** Identify the clauses first. If both sides could stand alone, you need a period, semicolon, colon, or comma + FANBOYS.
`,
  },
  // GRE
  {
    exam: "gre",
    category: "Quantitative Reasoning",
    topic: "Data analysis",
    kind: "notes",
    title: "Statistics and Data Interpretation",
    summary: "Mean, median, standard deviation, percentiles and strategies for reading GRE data sets.",
    body: `# Statistics and Data Interpretation

## Measures of Center
- **Mean** = sum / count; sensitive to outliers
- **Median** = middle value of ordered data (average of the two middle values for an even count)
- **Mode** = most frequent value

## Measures of Spread
- **Range** = max − min
- **Interquartile range** = Q3 − Q1
- **Standard deviation** measures typical distance from the mean; you rarely calculate it — compare it conceptually
  - Adding a constant to every value: SD unchanged
  - Multiplying every value by k: SD multiplied by |k|
  - Values clustered near the mean → smaller SD

## Normal Distribution
About **68%** of data within 1 SD of the mean, **95%** within 2 SD, **99.7%** within 3 SD.

## Data Interpretation Sets
- Read titles, units, scales and footnotes before the questions
- **Estimate** whenever answer choices are spread out
- Percent change = (new − old) / old × 100
- Distinguish **percent** from **percentage points**

## Quantitative Comparison Tips
- Test special cases: zero, negatives, fractions, equal values
- If different cases give different relationships, the answer is "cannot be determined"

> **High-yield:** Know how transformations affect mean and SD, and estimate aggressively on data interpretation.
`,
  },
  {
    exam: "gre",
    category: "Verbal Reasoning",
    topic: "Text completion",
    kind: "notes",
    title: "Text Completion Strategy",
    summary: "Using signal words and your own predicted word to solve one-, two- and three-blank items.",
    body: `# Text Completion Strategy

## The Approach
1. **Ignore the answer choices** at first.
2. Find the **clue** (a description that defines the blank) and the **signal words** (direction of meaning).
3. **Predict** your own word or phrase for the blank.
4. Match your prediction to the choices.
5. **Reread the full sentence** with your answers inserted.

## Signal Words
| Same direction | Opposite direction | Cause/effect |
|---|---|---|
| and, moreover, indeed, in fact | but, although, despite, yet, however | because, therefore, thus, consequently |

## Multi-Blank Items
- Start with the blank that has the **strongest clue**, not necessarily the first.
- There is **no partial credit**; every blank must be correct.
- The blanks often constrain each other — check the logic between them.

## Vocabulary Building
- Learn words in **groups by meaning** (for example, praise: laud, extol, acclaim; criticize: disparage, castigate, censure)
- Note secondary meanings tested on the GRE: *qualify* (to limit), *temper* (to moderate), *check* (to restrain)

> **High-yield:** Predict before you peek. The correct answer is supported by a clue within the passage, not by what sounds sophisticated.
`,
  },
  // DAT
  {
    exam: "dat",
    category: "Survey of Natural Sciences",
    topic: "General Chemistry",
    kind: "notes",
    title: "Gas Laws and Stoichiometry Essentials",
    summary: "Ideal gas relationships, partial pressures and a reliable stoichiometry workflow for DAT general chemistry.",
    body: `# Gas Laws and Stoichiometry

## Ideal Gas Law
**PV = nRT**, with R = 0.0821 L·atm/(mol·K) or 8.314 J/(mol·K). Temperature must be in **kelvin** (K = °C + 273).

## Combined Relationships
- Boyle: P1V1 = P2V2 (constant T, n)
- Charles: V1/T1 = V2/T2 (constant P, n)
- Gay-Lussac: P1/T1 = P2/T2 (constant V, n)
- Avogadro: V1/n1 = V2/n2
- At **STP** (0 °C, 1 atm), 1 mol of ideal gas occupies about **22.4 L**.

## Dalton's Law
Total pressure = sum of partial pressures; partial pressure = mole fraction × total pressure.

## Graham's Law
Rate1 / Rate2 = √(M2 / M1) — lighter gases effuse faster.

## Real Gases
Deviate most at **high pressure** and **low temperature** (molecular volume and attractions matter).

## Stoichiometry Workflow
1. Balance the equation.
2. Convert given quantities to **moles**.
3. Use the mole ratio to find moles of the desired substance.
4. Identify the **limiting reagent** (the one that produces less product).
5. Convert to the requested units; percent yield = actual / theoretical × 100.

> **High-yield:** Always convert to kelvin and moles first. Limiting reagent determines theoretical yield.
`,
  },
  {
    exam: "dat",
    category: "Perceptual Ability",
    topic: "Cube counting",
    kind: "notes",
    title: "Cube Counting Method",
    summary: "A tally-table method for counting painted faces on stacked cube figures quickly and accurately.",
    body: `# Cube Counting

A figure built from identical cubes is painted on all exposed surfaces **except the bottom**. Questions ask how many cubes have a given number of painted sides.

## Tally-Table Method
1. Draw a table with columns for **0, 1, 2, 3, 4, 5** painted sides.
2. Work **column by column** (or row by row) through the figure in a fixed order, top layer to bottom.
3. For each cube, count exposed faces: top, front, back, left, right (bottom does not count).
4. Add a tally to the matching column.
5. Check: the total tallies should equal the total number of cubes.

## Rules to Remember
- Hidden cubes that support visible ones **must exist** (the figure is assumed physically stable and built only of cubes you can infer).
- A cube touching the floor never has its bottom painted.
- Top-corner cubes in an isolated column can reach 5 painted faces.
- Interior cubes completely surrounded can have 0 painted faces.

## Speed Tips
- Answer all questions about one figure from the same table.
- Mark cubes on scratch paper with a dot once counted to avoid duplicates.
- Practice regularly; accuracy improves sharply with routine.

> **High-yield:** Build one complete tally table per figure and verify that the total equals the number of cubes before answering.
`,
  },
  // NAPLEX (sections without sub-topics)
  {
    exam: "naplex",
    category: "Medication Use Process",
    topic: "Medication Use Process",
    kind: "notes",
    title: "Pharmacy Calculations Essentials",
    summary: "Dosing by weight and BSA, renal function estimation, IV rates, concentrations and alligation.",
    body: `# Pharmacy Calculations Essentials

## Weight-Based Dosing
- Convert pounds to kilograms (1 kg = 2.2 lb)
- Use **ideal body weight** for some drugs (for example, aminoglycosides) and **adjusted body weight** in obesity per protocol
- IBW (male) = 50 kg + 2.3 kg per inch over 5 ft; IBW (female) = 45.5 kg + 2.3 kg per inch over 5 ft

## Body Surface Area (Mosteller)
BSA (m²) = √[(height cm × weight kg) / 3600]

## Renal Function: Cockcroft-Gault
CrCl (mL/min) = [(140 − age) × weight (kg)] / (72 × SCr), × 0.85 for females. Know which weight your reference uses.

## Concentration Expressions
- % w/v = g per 100 mL
- Ratio strength 1:1,000 = 1 g in 1,000 mL = 0.1%
- ppm = mg per liter (for dilute aqueous solutions)

## IV Rates
- mL/hr = total volume / time in hours
- Drops/min = (volume × drop factor) / minutes
- Dose-based infusions: (dose × weight) / concentration, keeping track of units (mcg/kg/min ↔ mL/hr)

## Alligation
Mixing a higher and lower strength to make an intermediate: parts of each = difference between the other strength and the desired strength.

## Milliequivalents
mEq = (mg × valence) / molecular weight

> **High-yield:** Write units at every step; most calculation errors are unit errors, not arithmetic errors.
`,
  },
  {
    exam: "naplex",
    category: "Person-Centered Assessment and Treatment Planning",
    topic: "Person-Centered Assessment and Treatment Planning",
    kind: "notes",
    title: "Hypertension Pharmacotherapy",
    summary: "Blood pressure categories, first-line agent selection, compelling indications and monitoring.",
    body: `# Hypertension Pharmacotherapy

## Categories (US adult guideline categories)
| Category | Systolic | Diastolic |
|---|---|---|
| Normal | under 120 | and under 80 |
| Elevated | 120–129 | and under 80 |
| Stage 1 | 130–139 | or 80–89 |
| Stage 2 | 140 or higher | or 90 or higher |

Most adults with hypertension are treated to a goal **under 130/80 mm Hg** per current guidance; individualize for older or frail patients.

## First-Line Classes
- **Thiazide or thiazide-like diuretics** (chlorthalidone, hydrochlorothiazide): hypokalemia, hyponatremia, hyperuricemia, hyperglycemia
- **ACE inhibitors** (lisinopril) or **ARBs** (losartan): hyperkalemia, increased SCr, angioedema (ACEi), cough (ACEi); contraindicated in pregnancy; do not combine ACEi + ARB
- **Dihydropyridine CCBs** (amlodipine): peripheral edema, headache, flushing

## Compelling Indications
- **Diabetes with albuminuria or CKD:** ACEi or ARB
- **HFrEF:** ACEi/ARB/ARNI, evidence-based beta blocker, MRA, SGLT2 inhibitor
- **Post-MI/angina:** beta blocker
- **Black patients without CKD or HF:** thiazide or CCB generally more effective as initial monotherapy
- **Pregnancy:** labetalol, nifedipine, methyldopa

## Monitoring
- BP, basic metabolic panel (K+, SCr) within a few weeks of starting or titrating ACEi/ARB/diuretic
- Adherence and home BP monitoring technique

> **High-yield:** Start two first-line agents from different classes when BP is more than 20/10 above goal. Avoid ACEi + ARB together and ACEi/ARB in pregnancy.
`,
  },
  // CPA
  {
    exam: "cpa",
    category: "Financial Accounting and Reporting (FAR)",
    topic: "Financial Accounting and Reporting (FAR)",
    kind: "notes",
    title: "Revenue Recognition: The Five-Step Model",
    summary: "Applying ASC 606 from contract identification through recognition, with common exam traps.",
    body: `# Revenue Recognition (ASC 606)

## The Five Steps
1. **Identify the contract** with a customer — approved, rights and payment terms identifiable, commercial substance, collection probable.
2. **Identify performance obligations** — promises to transfer goods or services that are **distinct** (capable of being distinct and distinct in context).
3. **Determine the transaction price** — include variable consideration (expected value or most likely amount, subject to the constraint), significant financing components, noncash consideration, consideration payable to the customer.
4. **Allocate the transaction price** to performance obligations based on **relative standalone selling prices** (observable, or estimated via adjusted market, expected cost plus margin, or residual approach in limited cases).
5. **Recognize revenue** when (or as) each obligation is satisfied — **over time** if one of the criteria is met, otherwise at a **point in time** when control transfers.

## Over-Time Criteria (any one)
- Customer simultaneously receives and consumes the benefits
- Performance creates or enhances an asset the customer controls
- No alternative use to the entity and an enforceable right to payment for work to date

## Common Exam Topics
- **Principal vs agent:** principal reports gross revenue; agent reports net (commission)
- **Bill-and-hold, consignment** arrangements: control has not transferred in consignment
- **Contract costs:** incremental costs of obtaining a contract are capitalized if expected to be recovered (practical expedient for amortization period of one year or less)
- **Warranties:** assurance-type (cost accrual) vs service-type (separate performance obligation)

> **High-yield:** Revenue follows **control**, not risk and rewards. Allocate on relative standalone selling prices, and constrain variable consideration to avoid significant reversal.
`,
  },
  {
    exam: "cpa",
    category: "Auditing and Attestation (AUD)",
    topic: "Auditing and Attestation (AUD)",
    kind: "notes",
    title: "The Audit Risk Model",
    summary: "Inherent, control and detection risk, how they interact, and how they drive substantive procedures.",
    body: `# The Audit Risk Model

**Audit risk (AR) = Risk of material misstatement (RMM) × Detection risk (DR)**, where RMM combines **inherent risk (IR)** and **control risk (CR)**.

## Components
- **Inherent risk:** susceptibility of an assertion to misstatement before considering controls (complex estimates, cash, related parties)
- **Control risk:** risk that internal control will not prevent or detect and correct a misstatement on a timely basis
- **Detection risk:** risk that the auditor's procedures will not detect a misstatement — the **only** component the auditor directly controls

## The Inverse Relationship
When assessed RMM is **high**, the auditor must accept **lower** detection risk by changing the:
- **Nature** of procedures (more persuasive evidence, such as external confirmations over inquiry)
- **Timing** (perform procedures at or near year-end rather than interim)
- **Extent** (larger sample sizes)

## Assertions to Know
Occurrence, completeness, accuracy, cutoff, classification, existence, rights and obligations, valuation and allocation, presentation.

## Linking Evidence to Assertions
- **Existence** of receivables: confirmations
- **Completeness** of liabilities: search for unrecorded liabilities (subsequent disbursements)
- **Cutoff:** examine transactions just before and after period end
- **Valuation** of inventory: lower of cost and net realizable value testing

## Materiality
Set for the financial statements as a whole; performance materiality is set lower to reduce aggregation risk.

> **High-yield:** Auditors assess IR and CR but **set** detection risk. Higher RMM → lower acceptable DR → more, better-timed, more persuasive substantive procedures.
`,
  },
  // PTE Academic
  {
    exam: "pte-academic",
    category: "Listening",
    topic: "Write from dictation",
    kind: "notes",
    title: "Write From Dictation",
    summary: "A note-taking and checking routine for one of the highest-impact PTE listening tasks.",
    body: `# Write From Dictation

You hear a short sentence **once** and type it exactly. Each correct word scores; the task contributes to both listening and writing.

## Method
1. **Focus completely** when the audio begins; do not type during the first word or two if it distracts you.
2. Note the **first letters** of each word or type quickly as you listen, then expand immediately after.
3. **Rebuild the sentence** using grammar: subject–verb agreement, articles, plural endings, past tense markers.
4. **Proofread** spelling and word endings before moving on.

## Common Losses
- Missing small words: articles (a, the), prepositions (of, to, in)
- Missing **-s** and **-ed** endings
- Misspelling academic vocabulary (environment, government, necessary)
- Spending too long and losing time for later items

## Practice Routine
- Daily dictation from academic lecture clips; check against transcripts
- Build a list of frequently misspelled academic words
- Practise typing speed and accuracy

> **High-yield:** Grammar is your safety net — if you missed a word, choose the one that makes the sentence grammatically correct and meaningful.
`,
  },
  {
    exam: "pte-academic",
    category: "Speaking and Writing",
    topic: "Describe image",
    kind: "notes",
    title: "Describe Image Template and Fluency",
    summary: "A flexible structure for describing graphs, maps and pictures within the time limit.",
    body: `# Describe Image

You have **25 seconds** to study the image and **40 seconds** to speak. Scoring considers content, oral fluency and pronunciation.

## Flexible Structure
1. **Introduce:** "This image shows/compares…" plus the topic and time frame.
2. **Key features:** highest and lowest values, the main trend or most noticeable element.
3. **Supporting detail:** one or two specific figures or comparisons.
4. **Conclude:** "Overall, the image indicates that…"

## Preparation in 25 Seconds
- Read the title, axes, units and legend
- Pick the **two or three** most important points
- Plan your concluding sentence

## Fluency Tips
- Speak at a steady, natural pace; **avoid long pauses** (silence can end the recording)
- Self-correcting repeatedly hurts fluency more than a small error
- Use simple, accurate language rather than complex phrases you are unsure of

## Image Types
- **Line/bar graphs:** trends and comparisons
- **Pie charts:** largest and smallest shares
- **Maps and diagrams:** locations, stages and relationships
- **Photographs:** setting, people, activity, possible purpose

> **High-yield:** Smooth, continuous speech with a clear structure usually scores better than detailed but hesitant description.
`,
  },
];

export const MATERIALS: SeedMaterial[] = [...NCLEX_NOTES, ...NCLEX_NOTES_2, ...NCLEX_GUIDES, ...NCLEX_VIDEOS, ...OTHER_NOTES];

/* ------------------------------------------------------------------ */
/* Flashcards                                                          */
/* ------------------------------------------------------------------ */
const nc = (category: string, topic: string, front: string, back: string): SeedFlashcard => ({ exam: "nclex-rn", category, topic, front, back });
const card = (exam: string, topic: string, front: string, back: string, category?: string): SeedFlashcard => ({ exam, topic, category, front, back });

const NCLEX_FLASHCARDS: SeedFlashcard[] = [
  // Management of Care
  nc(MOC, "Prioritization", "First priority framework for an unstable client?", "Airway, Breathing, Circulation. In cardiac arrest, start compressions first (C-A-B)."),
  nc(MOC, "Prioritization", "Acute vs chronic: which finding is usually the priority?", "The new, sudden or unexpected change over a stable, chronic or expected finding."),
  nc(MOC, "Delegation", "Five rights of delegation?", "Right task, right circumstance, right person, right direction/communication, right supervision/evaluation."),
  nc(MOC, "Delegation", "Which tasks can never be delegated to UAP?", "Assessment, teaching, evaluation, care planning, and care of unstable clients."),
  nc(MOC, "Delegation", "Can an LPN/LVN reinforce discharge teaching?", "Yes, reinforce teaching the RN has initiated. Initial teaching remains with the RN."),
  nc(MOC, "Informed consent", "Nurse's role in informed consent?", "Witness the signature and verify understanding and voluntariness. The provider explains the procedure, risks and alternatives."),
  nc(MOC, "Advance directives", "What does a durable power of attorney for health care do?", "Names a person to make health care decisions when the client cannot make them."),
  nc(MOC, "Confidentiality", "May you discuss a client's condition with a family member who calls?", "Only with the client's permission and per policy (for example, a verified privacy code)."),
  nc(MOC, "Incident reports", "Should an incident report be mentioned in the client's chart?", "No. Document the facts of the event and care given in the chart; file the incident report separately."),
  nc(MOC, "Triage", "Mass-casualty triage color for a client who is expected to die or is deceased?", "Black (expectant). Red = immediate, yellow = delayed, green = minor."),
  // Safety and Infection Control
  nc(SIC, "Airborne precautions", "Which infections require airborne precautions?", "Tuberculosis, measles, varicella, disseminated herpes zoster. Negative-pressure room and fit-tested N95."),
  nc(SIC, "Droplet precautions", "PPE for droplet precautions?", "Surgical mask when within close range of the client; client wears a mask during transport."),
  nc(SIC, "Contact precautions", "Hand hygiene for C. difficile?", "Soap and water (alcohol does not kill spores); clean with a sporicidal, bleach-based product."),
  nc(SIC, "Personal protective equipment", "Order for removing PPE?", "Gloves, goggles/face shield, gown, mask or respirator; then hand hygiene."),
  nc(SIC, "Protective environment", "Room requirements for a protective environment?", "Positive pressure, HEPA filtration, no fresh flowers or plants."),
  nc(SIC, "Restraints", "How often should a client in restraints be checked?", "Per policy, commonly at least every 15 minutes for safety, with circulation checks and release for ROM and toileting about every 2 hours."),
  nc(SIC, "Fire safety", "RACE and PASS?", "RACE: Rescue, Alarm, Contain, Extinguish. PASS: Pull pin, Aim at base, Squeeze, Sweep."),
  nc(SIC, "Transfusion reactions", "First action for a suspected transfusion reaction?", "Stop the transfusion; keep the IV line open with normal saline using new tubing; notify provider and blood bank."),
  nc(SIC, "Seizure precautions", "Actions during a tonic-clonic seizure?", "Protect the head, turn to the side, loosen clothing, time it; never restrain or put anything in the mouth."),
  nc(SIC, "Needlestick injuries", "First action after a needlestick?", "Wash the site with soap and water, report immediately, and follow post-exposure protocol."),
  // Health Promotion and Maintenance
  nc(HPM, "Developmental milestones", "When does birth weight double and triple?", "Doubles by about 5 to 6 months; triples by about 12 months."),
  nc(HPM, "Developmental milestones", "Typical age to sit without support?", "About 6 to 9 months (often tripod sitting around 6 months, steady by 9)."),
  nc(HPM, "Developmental milestones", "Erikson stage of a toddler?", "Autonomy vs shame and doubt."),
  nc(HPM, "Developmental milestones", "Universal red flag in development at any age?", "Loss of previously acquired skills."),
  nc(HPM, "Newborn care", "Why give vitamin K to newborns?", "Newborns have low vitamin K; IM vitamin K prevents vitamin K deficiency bleeding."),
  nc(HPM, "Newborn care", "Normal newborn heart rate and respiratory rate?", "Heart rate about 110 to 160 bpm; respirations about 30 to 60 per minute."),
  nc(HPM, "Immunizations", "When is the first hepatitis B vaccine given?", "Within 24 hours of birth for medically stable newborns."),
  nc(HPM, "Immunizations", "Are MMR and varicella live vaccines?", "Yes; avoid in pregnancy and in severely immunocompromised clients."),
  nc(HPM, "Prenatal care", "Nägele's rule?", "First day of last menstrual period minus 3 months plus 7 days (plus 1 year)."),
  nc(HPM, "Postpartum care", "First action for a boggy uterus after birth?", "Massage the fundus while supporting the lower uterine segment; then assess bladder and bleeding."),
  // Psychosocial Integrity
  nc(PSY, "Therapeutic communication", "Why avoid asking a client \"why\"?", "It sounds judgmental and makes clients defensive; use open-ended questions instead."),
  nc(PSY, "Therapeutic communication", "Best response to a client hearing voices?", "Acknowledge the experience, present reality (\"I don't hear them\"), and focus on feelings and safety."),
  nc(PSY, "Suicide risk", "Strongest predictor of suicide?", "A previous suicide attempt."),
  nc(PSY, "Suicide risk", "Sudden calm after severe depression may mean?", "The client may have made a decision to act. Reassess suicide risk."),
  nc(PSY, "Alcohol withdrawal", "When do delirium tremens typically appear?", "About 48 to 96 hours after the last drink."),
  nc(PSY, "Alcohol withdrawal", "Vitamin given before glucose in alcohol use disorder?", "Thiamine, to prevent Wernicke encephalopathy."),
  nc(PSY, "Psychiatric medications", "Therapeutic lithium range?", "About 0.6 to 1.2 mEq/L. Keep sodium and fluid intake consistent."),
  nc(PSY, "Psychiatric medications", "Foods to avoid with MAOIs?", "Tyramine-rich foods: aged cheese, cured meats, tap beer, soy sauce, fermented foods (risk of hypertensive crisis)."),
  nc(PSY, "Psychiatric medications", "Signs of serotonin syndrome?", "Agitation, hyperthermia, tachycardia, diaphoresis, tremor, hyperreflexia, clonus."),
  nc(PSY, "Grief and loss", "Kübler-Ross stages?", "Denial, anger, bargaining, depression, acceptance; not always in order."),
  // Basic Care and Comfort
  nc(BCC, "Pressure injury prevention", "Repositioning interval for bedbound clients?", "At least every 2 hours, individualized to risk; use pressure-redistribution surfaces."),
  nc(BCC, "Positioning", "Position after a liver biopsy?", "Right side-lying with a pillow under the site to apply pressure and reduce bleeding."),
  nc(BCC, "Assistive devices", "Which hand holds a cane?", "The hand opposite the weaker leg; move the cane with the weaker leg."),
  nc(BCC, "Assistive devices", "Crutch stair rule?", "Up with the good, down with the bad (affected leg and crutches go down first)."),
  nc(BCC, "Enteral feeding", "Most reliable bedside check of feeding tube placement?", "X-ray confirms initial placement; at the bedside check pH of aspirate and tube marking."),
  nc(BCC, "Enteral feeding", "Head-of-bed position during tube feedings?", "At least 30 degrees during and for about 30 to 60 minutes after intermittent feedings."),
  nc(BCC, "Ostomy care", "Normal stoma appearance?", "Pink to beefy red and moist. Pale, dusky or black indicates poor perfusion."),
  nc(BCC, "Urinary catheterization", "Where should the drainage bag be kept?", "Below bladder level, off the floor, with tubing free of kinks."),
  nc(BCC, "Pain management", "Nonpharmacologic pain relief examples?", "Repositioning, heat or cold, distraction, guided imagery, relaxation breathing, massage."),
  nc(BCC, "Intake and output", "1 kg of weight gain equals approximately?", "1 liter of retained fluid."),
  // Pharmacological and Parenteral Therapies
  nc(PPT, "Antidotes", "Antidote for heparin?", "Protamine sulfate."),
  nc(PPT, "Antidotes", "Antidote for warfarin?", "Vitamin K (phytonadione); PCC for serious bleeding."),
  nc(PPT, "Antidotes", "Antidote for opioid overdose?", "Naloxone. Monitor for recurrent sedation because naloxone may wear off first."),
  nc(PPT, "Antidotes", "Antidote for benzodiazepine overdose?", "Flumazenil (seizure risk in chronic benzodiazepine users)."),
  nc(PPT, "Antidotes", "Antidote for acetaminophen toxicity?", "Acetylcysteine."),
  nc(PPT, "Antidotes", "Antidote for magnesium sulfate toxicity?", "Calcium gluconate."),
  nc(PPT, "Insulin", "Which insulin can be given IV?", "Regular insulin."),
  nc(PPT, "Insulin", "Mixing regular and NPH: which is drawn up first?", "Regular (clear) before NPH (cloudy)."),
  nc(PPT, "Cardiac medications", "Before giving digoxin, check?", "Apical pulse for 1 full minute (hold per parameters, often under 60 in adults) and potassium level."),
  nc(PPT, "Electrolyte replacement", "Can potassium chloride be given IV push?", "Never. Dilute and infuse with a pump at a controlled rate."),
  // Reduction of Risk Potential
  nc(RRP, "Laboratory values", "Normal serum potassium?", "3.5 to 5.0 mEq/L."),
  nc(RRP, "Laboratory values", "Normal serum sodium?", "135 to 145 mEq/L."),
  nc(RRP, "Laboratory values", "Platelet count requiring bleeding precautions?", "Under about 50,000/mm3; spontaneous bleeding risk under about 20,000/mm3."),
  nc(RRP, "Laboratory values", "Usual INR goal on warfarin for atrial fibrillation or VTE?", "2.0 to 3.0."),
  nc(RRP, "ECG interpretation", "ECG sign of hyperkalemia?", "Tall, peaked T waves; widened QRS as it worsens."),
  nc(RRP, "Cardiac catheterization", "Priority after femoral cardiac catheterization?", "Check the site for bleeding/hematoma and distal pulses; keep the leg straight per protocol."),
  nc(RRP, "Chest tube monitoring", "Continuous bubbling in the water-seal chamber means?", "An air leak in the system. Intermittent bubbling with exhalation or cough can be expected with a pneumothorax."),
  nc(RRP, "Compartment syndrome", "Earliest sign of compartment syndrome?", "Pain out of proportion to the injury, especially with passive stretch."),
  nc(RRP, "Sepsis screening", "Lactate level that signals tissue hypoperfusion in sepsis?", "2 mmol/L or higher is concerning; 4 mmol/L or higher indicates high risk and triggers aggressive resuscitation."),
  nc(RRP, "Postoperative monitoring", "Minimum hourly urine output for adults?", "About 0.5 mL/kg/hr (commonly cited as 30 mL/hr)."),
  // Physiological Adaptation
  nc(PA, "Increased intracranial pressure", "Earliest sign of increased ICP?", "Change in level of consciousness."),
  nc(PA, "Increased intracranial pressure", "Cushing's triad?", "Widening pulse pressure (rising systolic BP), bradycardia, irregular respirations. A late sign."),
  nc(PA, "Diabetic ketoacidosis", "Why check potassium before starting insulin in DKA?", "Insulin moves potassium into cells; if K+ is low (under about 3.3), replace it first."),
  nc(PA, "Hyperosmolar hyperglycemic state", "How does HHS differ from DKA?", "Higher glucose (often over 600), higher osmolality, no significant ketosis or acidosis, more neuro changes."),
  nc(PA, "Hypoglycemia", "Rule of 15?", "Give 15 g fast-acting carbohydrate, recheck glucose in 15 minutes, repeat if under 70 mg/dL."),
  nc(PA, "Heart failure", "Left-sided vs right-sided heart failure?", "Left: lung findings (crackles, dyspnea, orthopnea). Right: systemic (JVD, edema, hepatomegaly)."),
  nc(PA, "Anaphylaxis", "First-line drug for anaphylaxis?", "IM epinephrine, typically in the anterolateral thigh."),
  nc(PA, "Pulmonary embolism", "Classic presentation of PE?", "Sudden dyspnea, pleuritic chest pain, tachycardia, tachypnea, anxiety, possibly hypoxemia."),
  nc(PA, "Acid-base balance", "Vomiting causes which acid-base imbalance?", "Metabolic alkalosis."),
  nc(PA, "Burns", "Rule of nines: one entire arm in an adult?", "9% total body surface area."),
];

const OTHER_FLASHCARDS: SeedFlashcard[] = [
  // USMLE Step 1
  card("usmle-step-1", "Pharmacology", "Mechanism of aminoglycosides?", "Bind the 30S ribosomal subunit, causing mRNA misreading; bactericidal. Toxicities: nephrotoxicity, ototoxicity."),
  card("usmle-step-1", "Pharmacology", "Antidote for organophosphate poisoning?", "Atropine (muscarinic) plus pralidoxime (regenerates acetylcholinesterase if given early)."),
  card("usmle-step-1", "Biochemistry", "Rate-limiting enzyme of glycolysis?", "Phosphofructokinase-1."),
  card("usmle-step-1", "Biochemistry", "Deficiency in classic galactosemia?", "Galactose-1-phosphate uridyltransferase."),
  card("usmle-step-1", "Microbiology", "Gram stain and shape of Neisseria meningitidis?", "Gram-negative diplococcus; maltose and glucose fermenter."),
  card("usmle-step-1", "Physiology", "What does the Frank-Starling mechanism describe?", "Increased preload (end-diastolic volume) increases stroke volume up to a limit."),
  card("usmle-step-1", "Pathology", "Hallmark cell of Hodgkin lymphoma?", "Reed-Sternberg cell (CD15+, CD30+)."),
  card("usmle-step-1", "Immunology", "Type of hypersensitivity in contact dermatitis?", "Type IV (delayed, T cell-mediated)."),
  // MCAT
  card("mcat", "Biochemistry", "Effect of a competitive inhibitor on Km and Vmax?", "Km increases; Vmax unchanged.", "Biological and Biochemical Foundations"),
  card("mcat", "Biochemistry", "Net ATP from one glucose through glycolysis?", "2 ATP (plus 2 NADH and 2 pyruvate).", "Biological and Biochemical Foundations"),
  card("mcat", "Physics", "Equation for work?", "W = F·d·cos θ; units of joules.", "Chemical and Physical Foundations"),
  card("mcat", "General Chemistry", "Henderson-Hasselbalch equation?", "pH = pKa + log([A-]/[HA]).", "Chemical and Physical Foundations"),
  card("mcat", "Organic Chemistry", "SN2 reaction stereochemistry?", "Inversion of configuration; one concerted step; favored by primary substrates and polar aprotic solvents.", "Chemical and Physical Foundations"),
  card("mcat", "Psychology", "Fundamental attribution error?", "Overemphasizing personality and underestimating situational factors when explaining others' behavior.", "Psychological, Social, and Biological Foundations"),
  card("mcat", "Sociology", "Social reproduction?", "The transmission of social inequality from one generation to the next.", "Psychological, Social, and Biological Foundations"),
  card("mcat", "CARS", "A CARS answer choice uses extreme language like \"always\" or \"proves.\" What should you check?", "Whether the author is equally absolute; if not, the choice is usually too strong.", "Critical Analysis and Reasoning Skills"),
  // IELTS Academic
  card("ielts-academic", "Task 2 (essay)", "Meaning of \"mitigate\"?", "To make something less severe. Example: Policies to mitigate traffic congestion.", "Writing"),
  card("ielts-academic", "Task 2 (essay)", "Formal alternative to \"a lot of\"?", "A significant number of (countable) or a considerable amount of (uncountable).", "Writing"),
  card("ielts-academic", "Task 1 (data description)", "What must every Task 1 response include to reach Band 7 Task Achievement?", "A clear overview of the main trends or features.", "Writing"),
  card("ielts-academic", "Task 2 (essay)", "Band tip: how many main ideas per body paragraph?", "One clear central idea, developed with explanation and an example.", "Writing"),
  card("ielts-academic", "True/False/Not Given", "False vs Not Given?", "False: the passage contradicts the statement. Not Given: the passage does not say.", "Reading"),
  card("ielts-academic", "Part 2 cue card", "How long should you speak in Part 2?", "Up to 2 minutes after 1 minute of preparation; keep talking until the examiner stops you.", "Speaking"),
  card("ielts-academic", "Part 3 discussion", "Band tip for Part 3 answers?", "Extend answers with reasons, examples and comparisons; speculate using \"It might be that…\".", "Speaking"),
  card("ielts-academic", "Lectures", "Signposting words that warn a key point is coming in a lecture?", "\"The main point is…\", \"However…\", \"In contrast…\", \"To sum up…\".", "Listening"),
  // GRE vocabulary
  card("gre", "Text completion", "Laconic", "Using very few words; terse.", "Verbal Reasoning"),
  card("gre", "Text completion", "Obdurate", "Stubbornly refusing to change one's opinion.", "Verbal Reasoning"),
  card("gre", "Text completion", "Prodigal", "Wastefully extravagant.", "Verbal Reasoning"),
  card("gre", "Sentence equivalence", "Equivocate", "To use ambiguous language to avoid committing.", "Verbal Reasoning"),
  card("gre", "Sentence equivalence", "Ebullient", "Cheerful and full of energy.", "Verbal Reasoning"),
  card("gre", "Text completion", "Vacillate", "To waver between opinions or actions.", "Verbal Reasoning"),
  card("gre", "Sentence equivalence", "Lionize", "To treat someone as a celebrity; to praise highly.", "Verbal Reasoning"),
  card("gre", "Text completion", "Quotidian", "Ordinary; occurring every day.", "Verbal Reasoning"),
  // NAPLEX
  card("naplex", "Medication Use Process", "Cockcroft-Gault equation?", "CrCl = [(140 − age) × weight kg] / (72 × SCr); multiply by 0.85 for females.", "Medication Use Process"),
  card("naplex", "Medication Use Process", "Convert 1:1,000 to percent strength.", "0.1% (1 g per 1,000 mL).", "Medication Use Process"),
  card("naplex", "Foundational Knowledge", "Major interaction: warfarin plus fluconazole?", "CYP2C9 inhibition raises warfarin exposure and INR; monitor closely and consider dose reduction.", "Foundational Knowledge"),
  card("naplex", "Foundational Knowledge", "Reversal agent for dabigatran?", "Idarucizumab.", "Foundational Knowledge"),
  card("naplex", "Person-Centered Assessment and Treatment Planning", "First-line antihypertensive class in diabetes with albuminuria?", "ACE inhibitor or ARB.", "Person-Centered Assessment and Treatment Planning"),
  card("naplex", "Person-Centered Assessment and Treatment Planning", "Boxed warning for fluoroquinolones?", "Tendinitis and tendon rupture, peripheral neuropathy, CNS effects, myasthenia gravis exacerbation.", "Person-Centered Assessment and Treatment Planning"),
  card("naplex", "Foundational Knowledge", "Statin with the fewest CYP3A4 interactions among common options?", "Rosuvastatin or pravastatin (not primarily CYP3A4 metabolized).", "Foundational Knowledge"),
  card("naplex", "Medication Use Process", "Drops per minute formula?", "(Volume in mL × drop factor gtt/mL) / time in minutes.", "Medication Use Process"),
];

export const FLASHCARDS: SeedFlashcard[] = [...NCLEX_FLASHCARDS, ...OTHER_FLASHCARDS];

/* ------------------------------------------------------------------ */
/* Lab reference sheet (standard adult ranges, US conventional units)  */
/* ------------------------------------------------------------------ */
export const LAB_VALUES: SeedLabValue[] = [
  // Electrolytes
  { group: "Electrolytes", name: "Sodium (Na+)", range: "135–145", unit: "mEq/L" },
  { group: "Electrolytes", name: "Potassium (K+)", range: "3.5–5.0", unit: "mEq/L" },
  { group: "Electrolytes", name: "Chloride (Cl-)", range: "98–106", unit: "mEq/L" },
  { group: "Electrolytes", name: "Bicarbonate (serum CO2)", range: "22–29", unit: "mEq/L" },
  { group: "Electrolytes", name: "Calcium, total", range: "8.6–10.2", unit: "mg/dL", note: "Interpret with albumin; ionized calcium 4.6–5.3 mg/dL" },
  { group: "Electrolytes", name: "Magnesium", range: "1.3–2.1", unit: "mEq/L", note: "About 1.6–2.6 mg/dL" },
  { group: "Electrolytes", name: "Phosphorus", range: "2.5–4.5", unit: "mg/dL" },
  { group: "Electrolytes", name: "Serum osmolality", range: "275–295", unit: "mOsm/kg" },
  // Hematology
  { group: "Hematology", name: "Hemoglobin (male)", range: "13.5–17.5", unit: "g/dL" },
  { group: "Hematology", name: "Hemoglobin (female)", range: "12.0–15.5", unit: "g/dL" },
  { group: "Hematology", name: "Hematocrit (male)", range: "41–50", unit: "%" },
  { group: "Hematology", name: "Hematocrit (female)", range: "36–44", unit: "%" },
  { group: "Hematology", name: "White blood cells (WBC)", range: "4,500–11,000", unit: "/mm³" },
  { group: "Hematology", name: "Absolute neutrophil count (ANC)", range: "1,500–8,000", unit: "/mm³", note: "Under 500 = severe neutropenia" },
  { group: "Hematology", name: "Platelets", range: "150,000–400,000", unit: "/mm³" },
  { group: "Hematology", name: "Red blood cells (RBC)", range: "M 4.5–5.9; F 4.1–5.1", unit: "million/mm³" },
  // Coagulation
  { group: "Coagulation", name: "Prothrombin time (PT)", range: "11–13.5", unit: "seconds" },
  { group: "Coagulation", name: "INR", range: "0.8–1.1", unit: "ratio", note: "Usual warfarin goal 2.0–3.0" },
  { group: "Coagulation", name: "aPTT", range: "25–35", unit: "seconds", note: "Heparin goal often 1.5–2.5 × control" },
  { group: "Coagulation", name: "Fibrinogen", range: "200–400", unit: "mg/dL" },
  { group: "Coagulation", name: "D-dimer", range: "Under 0.5", unit: "mcg/mL FEU", note: "Assay dependent" },
  // Renal
  { group: "Renal", name: "Blood urea nitrogen (BUN)", range: "7–20", unit: "mg/dL" },
  { group: "Renal", name: "Creatinine", range: "0.6–1.2", unit: "mg/dL" },
  { group: "Renal", name: "Estimated GFR", range: "90 or higher", unit: "mL/min/1.73 m²" },
  { group: "Renal", name: "Urine specific gravity", range: "1.005–1.030", unit: "" },
  { group: "Renal", name: "Uric acid", range: "M 3.4–7.0; F 2.4–6.0", unit: "mg/dL" },
  // Liver
  { group: "Liver", name: "ALT", range: "7–56", unit: "U/L" },
  { group: "Liver", name: "AST", range: "10–40", unit: "U/L" },
  { group: "Liver", name: "Alkaline phosphatase", range: "44–147", unit: "U/L" },
  { group: "Liver", name: "Total bilirubin", range: "0.3–1.2", unit: "mg/dL" },
  { group: "Liver", name: "Albumin", range: "3.5–5.0", unit: "g/dL" },
  { group: "Liver", name: "Ammonia", range: "15–45", unit: "mcg/dL" },
  { group: "Liver", name: "Lipase", range: "0–160", unit: "U/L", note: "Assay dependent" },
  // Glucose & Endocrine
  { group: "Glucose & Endocrine", name: "Fasting blood glucose", range: "70–99", unit: "mg/dL" },
  { group: "Glucose & Endocrine", name: "Hemoglobin A1c", range: "Under 5.7", unit: "%", note: "5.7–6.4 prediabetes; 6.5 or higher diabetes" },
  { group: "Glucose & Endocrine", name: "TSH", range: "0.4–4.0", unit: "mIU/L" },
  { group: "Glucose & Endocrine", name: "Free T4", range: "0.8–1.8", unit: "ng/dL" },
  // Arterial Blood Gases
  { group: "Arterial Blood Gases", name: "pH", range: "7.35–7.45", unit: "" },
  { group: "Arterial Blood Gases", name: "PaCO2", range: "35–45", unit: "mm Hg" },
  { group: "Arterial Blood Gases", name: "PaO2", range: "80–100", unit: "mm Hg" },
  { group: "Arterial Blood Gases", name: "HCO3-", range: "22–26", unit: "mEq/L" },
  { group: "Arterial Blood Gases", name: "SaO2", range: "95–100", unit: "%" },
  { group: "Arterial Blood Gases", name: "Base excess", range: "-2 to +2", unit: "mEq/L" },
  // Cardiac
  { group: "Cardiac", name: "Troponin I", range: "Below the assay's 99th percentile (often under 0.04)", unit: "ng/mL", note: "High-sensitivity assays report in ng/L with sex-specific cutoffs" },
  { group: "Cardiac", name: "BNP", range: "Under 100", unit: "pg/mL" },
  { group: "Cardiac", name: "Total cholesterol", range: "Under 200", unit: "mg/dL" },
  { group: "Cardiac", name: "LDL cholesterol", range: "Under 100", unit: "mg/dL" },
  { group: "Cardiac", name: "HDL cholesterol", range: "M 40 or higher; F 50 or higher", unit: "mg/dL" },
  { group: "Cardiac", name: "Triglycerides", range: "Under 150", unit: "mg/dL" },
  // Therapeutic Drug Levels
  { group: "Therapeutic Drug Levels", name: "Digoxin", range: "0.5–2.0", unit: "ng/mL", note: "Heart failure target often 0.5–0.9; toxicity more likely with hypokalemia" },
  { group: "Therapeutic Drug Levels", name: "Lithium", range: "0.6–1.2", unit: "mEq/L", note: "Toxicity risk rises above 1.5" },
  { group: "Therapeutic Drug Levels", name: "Vancomycin trough", range: "10–20", unit: "mcg/mL", note: "Many institutions now use AUC-guided dosing (AUC 400–600)" },
  { group: "Therapeutic Drug Levels", name: "Theophylline", range: "5–15", unit: "mcg/mL" },
  { group: "Therapeutic Drug Levels", name: "Phenytoin (total)", range: "10–20", unit: "mcg/mL", note: "Correct for low albumin" },
  { group: "Therapeutic Drug Levels", name: "Magnesium sulfate (therapeutic, preeclampsia)", range: "4–7", unit: "mEq/L", note: "Loss of DTRs signals toxicity" },
  // Vital Signs
  { group: "Vital Signs", name: "Heart rate (adult)", range: "60–100", unit: "beats/min" },
  { group: "Vital Signs", name: "Respiratory rate (adult)", range: "12–20", unit: "breaths/min" },
  { group: "Vital Signs", name: "Blood pressure (normal)", range: "Under 120/80", unit: "mm Hg" },
  { group: "Vital Signs", name: "Temperature (oral)", range: "36.5–37.5 (97.7–99.5 °F)", unit: "°C" },
  { group: "Vital Signs", name: "Oxygen saturation (SpO2)", range: "95–100", unit: "%" },
  { group: "Vital Signs", name: "Mean arterial pressure", range: "70–100", unit: "mm Hg", note: "At least 65 needed for organ perfusion" },
];
