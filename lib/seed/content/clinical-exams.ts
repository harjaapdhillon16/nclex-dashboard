/**
 * Original practice items for nursing, medical, dental, pharmacy and PA exams.
 * All items are written from scratch for this app; none are copied from
 * commercial question banks or official sample items.
 */
import type { Difficulty, Exhibit, PatientInfo, QuestionExtras, SeedQuestion } from "@/lib/questions/types";

const IDS = ["a", "b", "c", "d", "e", "f", "g", "h"];

type Base = {
  exam: string;
  subject?: string;
  category?: string;
  system?: string;
  topic: string;
  subtopic?: string;
  difficulty: Difficulty;
  stem: string;
  scenario?: string;
  patient?: PatientInfo;
  exhibit?: Exhibit;
  rationale: string;
  extras: QuestionExtras;
  tags?: string[];
  clinicalSetting?: string;
};

type ChoiceInput = Base & {
  /** [option text, explanation] in order a, b, c, ... */
  options: [string, string][];
  /** a single id for mcq, an array of ids for sata */
  correct: string | string[];
};

type NumericInput = Base & { unit?: string; decimals?: number; value: number; tolerance: number };

function choice(q: ChoiceInput): SeedQuestion {
  const { options, correct, ...rest } = q;
  const opts = options.map(([text], i) => ({ id: IDS[i], text }));
  const optionExplanations = Object.fromEntries(options.map(([, e], i) => [IDS[i], e]));
  if (Array.isArray(correct)) {
    return { ...rest, type: "sata", content: { options: opts }, answer: { correct }, optionExplanations };
  }
  return { ...rest, type: "mcq", content: { options: opts }, answer: { correct }, optionExplanations };
}

function numeric(q: NumericInput): SeedQuestion {
  const { unit, decimals, value, tolerance, ...rest } = q;
  return { ...rest, type: "numeric", content: { unit, decimals }, answer: { value, tolerance } };
}

/* ------------------------------------------------------------------ */
/* NCLEX-PN                                                            */
/* ------------------------------------------------------------------ */
const NCLEX_PN: SeedQuestion[] = [
  choice({
    exam: "nclex-pn", category: "Coordinated Care", topic: "Delegation", difficulty: "moderate",
    stem: "A practical nurse (PN) is working with an unlicensed assistive personnel (UAP) on a medical unit. Which task is most appropriate for the PN to assign to the UAP?",
    options: [
      ["Measure and record oral intake and urine output for a client with stable heart failure", "Measuring and recording intake and output is a routine, standardized task with a predictable outcome for a stable client, so it is within UAP scope."],
      ["Reinforce discharge teaching about a new inhaler for a client with asthma", "Reinforcing teaching requires nursing knowledge and judgment and cannot be assigned to a UAP."],
      ["Check the blood glucose trend and decide whether a snack is needed for a client with diabetes", "Interpreting data and deciding on an intervention requires nursing judgment, even though a UAP may obtain the reading itself."],
      ["Assess the surgical dressing of a client who returned from surgery 1 hour ago", "Assessment of a fresh postoperative client is a nursing responsibility; the client's condition is not yet stable or predictable."],
    ],
    correct: "a",
    rationale: "UAP may be assigned routine tasks that follow a standard procedure, have a predictable outcome and involve stable clients. Measuring intake and output fits these criteria. Assessment, teaching, evaluation and decisions that require clinical judgment remain with licensed nurses. Recently postoperative clients are considered potentially unstable.",
    extras: {
      whyCorrect: "I&O measurement is a data-collection task with a standard procedure, and the client is stable.",
      strategy: "Eliminate any option containing assess, teach, evaluate or decide; those verbs stay with the nurse.",
      keyTakeaway: "Assign UAP stable, routine, unchanging tasks; keep judgment-based work with licensed staff.",
      relatedTopics: ["Five rights of delegation", "Scope of practice", "Assignment of care"],
    },
    tags: ["delegation"],
  }),
  choice({
    exam: "nclex-pn", category: "Safety and Infection Prevention and Control", topic: "Transmission-based precautions", difficulty: "moderate",
    stem: "A client is admitted with diarrhea caused by Clostridioides difficile. Which actions by the PN are appropriate? Select all that apply.",
    options: [
      ["Put on a gown and gloves before entering the room", "Contact precautions require a gown and gloves on entry because the environment is likely contaminated with spores."],
      ["Wash hands with soap and water after removing gloves", "C. difficile spores are not reliably killed by alcohol; mechanical removal with soap and water is required."],
      ["Use a dedicated stethoscope and blood pressure cuff for the client", "Dedicated equipment prevents spores from being carried to other clients on shared devices."],
      ["Wear a fitted N95 respirator for all care", "C. difficile is not spread by the airborne route, so an N95 is unnecessary for routine care."],
      ["Rely on alcohol-based hand rub between client contacts", "Alcohol-based rub does not inactivate spores and is insufficient after caring for this client."],
      ["Clean surfaces with a sporicidal agent such as a bleach-based disinfectant", "Sporicidal disinfectants (e.g., diluted hypochlorite) are recommended for environmental cleaning in C. difficile rooms."],
    ],
    correct: ["a", "b", "c", "f"],
    rationale: "C. difficile is spread by the fecal-oral route through spores that persist on surfaces and hands. Contact precautions with gown and gloves, dedicated equipment and sporicidal cleaning reduce transmission. Hand hygiene must be performed with soap and water because alcohol does not kill spores. Airborne precautions are not indicated.",
    extras: {
      whyCorrect: "Each selected action interrupts contact transmission of spores.",
      strategy: "Match the organism to its route of transmission before choosing PPE.",
      keyTakeaway: "C. difficile: contact precautions, soap and water, and bleach-based cleaning.",
      relatedTopics: ["Contact precautions", "Hand hygiene", "Healthcare-associated infections"],
    },
    tags: ["infection control", "safety"],
  }),
  choice({
    exam: "nclex-pn", category: "Health Promotion and Maintenance", topic: "Growth and development", difficulty: "easy",
    stem: "A parent brings a healthy 4-month-old infant to a well-child visit. Which developmental finding should the PN expect?",
    options: [
      ["Rolls from abdomen to back", "Rolling from prone to supine typically appears around 4 to 5 months and is expected at this visit."],
      ["Sits alone without support", "Independent sitting usually develops between 6 and 8 months."],
      ["Uses a pincer grasp to pick up small objects", "A neat pincer grasp develops around 9 to 11 months."],
      ["Pulls to stand and cruises along furniture", "Pulling to stand and cruising appear around 9 to 10 months."],
    ],
    correct: "a",
    rationale: "Gross motor development proceeds in a cephalocaudal direction. By 4 months most infants have good head control and begin rolling from abdomen to back. Sitting without support, pincer grasp and cruising are milestones of later infancy. Recognizing age-appropriate milestones helps the nurse identify possible developmental delays.",
    extras: {
      whyCorrect: "Rolling prone to supine is the expected gross motor skill near 4 months.",
      strategy: "Place each option on a timeline; pick the one that matches the stated age.",
      keyTakeaway: "Roll front to back ~4-5 months, sit ~6-8 months, pincer ~9-11 months.",
      relatedTopics: ["Infant milestones", "Well-child visits", "Developmental screening"],
    },
  }),
  choice({
    exam: "nclex-pn", category: "Psychosocial Integrity", topic: "Grief and loss", difficulty: "moderate",
    stem: "A client whose spouse died 2 weeks ago says, \"I keep thinking I should have noticed he was sick sooner.\" Which response by the PN is most therapeutic?",
    options: [
      ["\"It sounds like you are feeling responsible. Tell me more about what you are thinking.\"", "Reflecting the feeling and inviting the client to continue is an open, nonjudgmental technique that encourages expression of grief."],
      ["\"You shouldn't blame yourself; there was nothing you could have done.\"", "This offers false reassurance and dismisses the client's feelings, closing off further discussion."],
      ["\"Why do you think you missed the signs?\"", "'Why' questions can sound accusatory and may increase guilt and defensiveness."],
      ["\"Everyone feels that way. It will get easier with time.\"", "This uses a cliché and generalization that minimizes the client's individual experience."],
    ],
    correct: "a",
    rationale: "Guilt is a common feature of normal grief. The most therapeutic response acknowledges the client's feeling and encourages further expression. False reassurance, clichés and 'why' questions are nontherapeutic because they block communication or imply judgment. The nurse's goal is to help the client explore and verbalize feelings.",
    extras: {
      whyCorrect: "It reflects the feeling and uses an open-ended prompt.",
      strategy: "Choose the option that keeps the focus on the client's feelings and keeps the conversation open.",
      keyTakeaway: "Reflect feelings; avoid reassurance, clichés and 'why' questions.",
      relatedTopics: ["Therapeutic communication", "Stages of grief", "Coping mechanisms"],
    },
    tags: ["communication"],
  }),
  choice({
    exam: "nclex-pn", category: "Basic Care and Comfort", topic: "Nutrition", difficulty: "moderate",
    stem: "A client with dysphagia following a stroke is cleared for a mechanical soft diet. Which action should the PN take when assisting with the meal?",
    options: [
      ["Position the client upright at 90 degrees and encourage a chin-tuck when swallowing", "Upright positioning and a chin-down posture help protect the airway and reduce aspiration risk."],
      ["Offer thin liquids through a straw between bites", "Straws and thin liquids increase the speed of fluid delivery and the risk of aspiration unless specifically approved."],
      ["Place food on the affected side of the mouth", "Food should be placed on the unaffected side, where sensation and muscle control are intact."],
      ["Lower the head of the bed to 30 degrees immediately after the meal", "The client should remain upright for about 30 minutes after eating to reduce aspiration risk."],
    ],
    correct: "a",
    rationale: "Clients with post-stroke dysphagia are at high risk for aspiration. Sitting fully upright and tucking the chin during swallowing narrow the airway entrance and help direct food into the esophagus. Food is placed on the unaffected side, and straws and thin liquids are avoided unless the speech-language pathologist has approved them. The client should remain upright after meals.",
    extras: {
      whyCorrect: "Upright position plus chin-tuck is a standard aspiration-prevention strategy.",
      strategy: "In dysphagia questions, choose the option that protects the airway.",
      keyTakeaway: "Upright, chin-tuck, unaffected side, no straws, stay upright after eating.",
      relatedTopics: ["Aspiration precautions", "Stroke care", "Feeding assistance"],
    },
    tags: ["safety"],
  }),
  choice({
    exam: "nclex-pn", category: "Pharmacological Therapies", topic: "Medication administration", difficulty: "easy",
    stem: "An adult client is prescribed oral digoxin 0.125 mg daily. Which action should the PN take immediately before administering the dose?",
    options: [
      ["Count the apical pulse for 1 full minute", "Digoxin slows AV conduction; an apical rate counted for a full minute identifies bradycardia or irregularity before the dose is given."],
      ["Check the client's blood pressure in both arms", "Blood pressure is not the key parameter for digoxin administration."],
      ["Ask the client to drink a full glass of milk", "Digoxin does not need to be given with milk, and dairy is not a safety requirement."],
      ["Obtain a radial pulse for 15 seconds and multiply by 4", "A short radial count may miss irregular rhythms and pulse deficits; the apical pulse for 1 minute is required."],
    ],
    correct: "a",
    rationale: "Digoxin increases myocardial contractility and slows conduction through the AV node. Before each dose the nurse counts the apical pulse for 1 full minute and typically withholds the dose and notifies the prescriber if the adult rate is below 60/min or if a new irregularity is present. Hypokalemia increases the risk of toxicity, so potassium levels are also monitored. Early signs of toxicity include nausea, anorexia and visual changes.",
    extras: {
      whyCorrect: "A 1-minute apical pulse is the standard pre-administration check for digoxin.",
      strategy: "For cardiac glycosides, think apical pulse and potassium.",
      keyTakeaway: "Hold digoxin for an adult apical pulse below 60/min and report it.",
      relatedTopics: ["Digoxin toxicity", "Hypokalemia", "Cardiac medications"],
    },
    tags: ["pharmacology", "safety"],
  }),
  choice({
    exam: "nclex-pn", category: "Pharmacological Therapies", topic: "Adverse effects", difficulty: "moderate",
    stem: "A PN is reinforcing teaching for a client newly prescribed warfarin. Which statements indicate understanding? Select all that apply.",
    options: [
      ["\"I will keep the amount of leafy green vegetables I eat about the same each week.\"", "Consistent vitamin K intake keeps the INR stable; elimination is not required."],
      ["\"I will use a soft-bristled toothbrush and an electric razor.\"", "These measures reduce the risk of minor bleeding injuries."],
      ["\"If I miss a dose, I will take two tablets the next day.\"", "Doubling doses can cause excessive anticoagulation; the client should follow the prescriber's missed-dose instructions."],
      ["\"I will check with my provider before taking ibuprofen or aspirin.\"", "NSAIDs and aspirin increase bleeding risk when combined with warfarin."],
      ["\"I will report black, tarry stools or bleeding gums.\"", "These can indicate bleeding and should be reported promptly."],
    ],
    correct: ["a", "b", "d", "e"],
    rationale: "Warfarin is a vitamin K antagonist monitored with the INR. Clients should keep vitamin K intake consistent rather than eliminate it, take bleeding precautions and avoid NSAIDs and aspirin unless prescribed. Signs of bleeding, such as melena or gum bleeding, should be reported. Missed doses should never be doubled.",
    extras: {
      whyCorrect: "Each selected statement reflects safe warfarin self-management.",
      strategy: "Look for 'consistency' with vitamin K and 'report bleeding'; reject dose-doubling.",
      keyTakeaway: "Warfarin: consistent vitamin K, bleeding precautions, avoid NSAIDs, regular INR checks.",
      relatedTopics: ["Anticoagulants", "INR monitoring", "Drug interactions"],
    },
    tags: ["pharmacology", "education"],
  }),
  choice({
    exam: "nclex-pn", category: "Reduction of Risk Potential", topic: "Laboratory values", difficulty: "moderate",
    stem: "A client with heart failure takes lisinopril and spironolactone. Which laboratory result should the PN report to the registered nurse immediately?",
    patient: {
      age: "68", gender: "Female", history: "Heart failure, hypertension",
      meds: ["Lisinopril 20 mg daily", "Spironolactone 25 mg daily"],
      labs: [
        { name: "Sodium", value: "136", unit: "mEq/L", range: "135-145" },
        { name: "Potassium", value: "6.1", unit: "mEq/L", range: "3.5-5.0", flag: "H" },
        { name: "BUN", value: "22", unit: "mg/dL", range: "7-20", flag: "H" },
        { name: "Glucose (fasting)", value: "108", unit: "mg/dL", range: "70-99", flag: "H" },
      ],
    },
    options: [
      ["Potassium 6.1 mEq/L", "Hyperkalemia at this level can cause life-threatening dysrhythmias, and both medications raise potassium."],
      ["Sodium 136 mEq/L", "This sodium value is within normal limits."],
      ["BUN 22 mg/dL", "A mildly elevated BUN should be noted but is not an immediate threat."],
      ["Fasting glucose 108 mg/dL", "Mild fasting hyperglycemia warrants follow-up but is not urgent."],
    ],
    correct: "a",
    rationale: "ACE inhibitors reduce aldosterone and spironolactone blocks aldosterone receptors, so the combination can cause hyperkalemia. A potassium of 6.1 mEq/L may produce peaked T waves and dangerous dysrhythmias. This result poses the most immediate risk and must be reported right away. The other values are normal or only mildly abnormal.",
    extras: {
      whyCorrect: "The potassium value is the only result with an immediate life-threatening risk.",
      strategy: "Link each lab to the client's medications; potassium-sparing drugs plus ACE inhibitors means watch potassium.",
      keyTakeaway: "Report potassium above 5.0 mEq/L promptly in clients on ACE inhibitors and spironolactone.",
      relatedTopics: ["Hyperkalemia", "Potassium-sparing diuretics", "ECG changes"],
    },
    tags: ["labs", "priority"],
  }),
  choice({
    exam: "nclex-pn", category: "Physiological Adaptation", topic: "Medical emergencies", difficulty: "easy",
    stem: "A client with type 1 diabetes is shaky, diaphoretic and alert. The fingerstick glucose is 58 mg/dL. Which action should the PN take first?",
    options: [
      ["Give 15 g of a fast-acting carbohydrate, such as 4 oz of fruit juice", "The client is alert and able to swallow, so 15 g of rapid carbohydrate is the first-line treatment."],
      ["Administer glucagon intramuscularly", "Glucagon is reserved for clients who cannot safely take oral carbohydrate."],
      ["Give a peanut butter sandwich", "Fat and protein slow absorption; a snack follows once glucose has risen."],
      ["Recheck the blood glucose in 1 hour", "Recheck occurs 15 minutes after treatment; waiting 1 hour without treating is unsafe."],
    ],
    correct: "a",
    rationale: "For conscious clients with hypoglycemia, the '15-15 rule' applies: give 15 g of fast-acting carbohydrate and recheck glucose in 15 minutes. Treatment is repeated if glucose remains below 70 mg/dL. Once glucose normalizes, a snack containing protein and complex carbohydrate helps prevent recurrence. Glucagon or IV dextrose is used if the client cannot swallow safely.",
    extras: {
      whyCorrect: "Rapid oral carbohydrate corrects hypoglycemia fastest in an alert client.",
      strategy: "If the client can swallow, treat orally first; parenteral options are for those who cannot.",
      keyTakeaway: "15 g fast carbohydrate, recheck in 15 minutes, repeat if still below 70 mg/dL.",
      relatedTopics: ["Hypoglycemia", "Insulin therapy", "Diabetes teaching"],
    },
    tags: ["priority"],
  }),
  choice({
    exam: "nclex-pn", category: "Safety and Infection Prevention and Control", topic: "Restraints", difficulty: "moderate",
    stem: "A client has prescribed soft wrist restraints. Which action by the UAP requires the PN to intervene?",
    options: [
      ["Securing the restraint straps to the bed's side rail", "Restraints tied to side rails can cause injury when the rail is lowered; they should be attached to the bed frame with a quick-release knot."],
      ["Checking that two fingers fit between the restraint and the wrist", "This confirms the restraint is not too tight."],
      ["Offering fluids and toileting during scheduled checks", "Meeting basic needs during restraint checks is required."],
      ["Using a quick-release knot to tie the restraint", "Quick-release knots allow rapid removal in an emergency."],
    ],
    correct: "a",
    rationale: "Restraints must be secured to a part of the bed frame that moves with the client, never to the side rails. Fastening them to a rail can cause injury when the rail is moved. Proper fit allows two fingers under the device, and quick-release knots permit rapid removal. Circulation, skin integrity, nutrition, hydration and elimination are checked at intervals defined by facility policy.",
    extras: {
      whyCorrect: "Tying to a side rail is unsafe and must be corrected.",
      strategy: "'Requires intervention' questions ask for the incorrect action.",
      keyTakeaway: "Tie restraints to the bed frame with a quick-release knot, never to side rails.",
      relatedTopics: ["Restraint alternatives", "Client rights", "Fall prevention"],
    },
    tags: ["safety", "delegation"],
  }),
];

/* ------------------------------------------------------------------ */
/* FNP                                                                 */
/* ------------------------------------------------------------------ */
const FNP: SeedQuestion[] = [
  choice({
    exam: "fnp", category: "Assessment", topic: "Physical examination", difficulty: "moderate",
    stem: "A 28-year-old twisted her right ankle playing basketball 2 hours ago. She walked four steps unaided in the clinic. Which finding indicates the need for an ankle radiograph under the Ottawa ankle rules?",
    options: [
      ["Bone tenderness at the posterior edge of the lateral malleolus", "Tenderness along the posterior edge or tip of either malleolus within the distal 6 cm meets Ottawa criteria for imaging."],
      ["Swelling and ecchymosis over the anterior talofibular ligament", "Soft-tissue swelling and bruising are not Ottawa criteria."],
      ["Pain with passive inversion of the ankle", "Pain with inversion suggests ligament sprain and is not an imaging criterion."],
      ["Ability to bear weight with a limp", "Inability to bear weight for four steps is a criterion; walking with a limp does not meet it."],
    ],
    correct: "a",
    rationale: "The Ottawa ankle rules recommend radiographs when there is malleolar-zone pain plus bone tenderness at the posterior edge or tip of either malleolus, or inability to bear weight for four steps both immediately and in the clinic. The rules are highly sensitive for clinically significant fractures. Swelling, bruising and pain with stress maneuvers do not by themselves indicate imaging. Applying the rules reduces unnecessary radiographs.",
    extras: {
      whyCorrect: "Posterior malleolar bone tenderness is a defined Ottawa criterion.",
      strategy: "Ottawa rules focus on bony tenderness at specific sites and weight bearing, not soft-tissue findings.",
      keyTakeaway: "Image if malleolar bone tenderness (posterior edge/tip) or inability to take four steps.",
      relatedTopics: ["Ottawa foot rules", "Ankle sprain", "Clinical decision rules"],
    },
  }),
  choice({
    exam: "fnp", category: "Plan and Management", topic: "Women's health", difficulty: "moderate",
    stem: "A 24-year-old nonpregnant woman has 2 days of dysuria and urinary frequency. She is afebrile, has no flank pain and no vaginal discharge, and urinalysis is positive for leukocyte esterase and nitrites. Local E. coli resistance to trimethoprim-sulfamethoxazole is 25%. Which treatment is most appropriate?",
    options: [
      ["Nitrofurantoin monohydrate/macrocrystals 100 mg twice daily for 5 days", "Nitrofurantoin is first-line for uncomplicated cystitis and resistance remains low."],
      ["Trimethoprim-sulfamethoxazole twice daily for 3 days", "TMP-SMX is avoided empirically when local resistance exceeds 20%."],
      ["Ciprofloxacin 500 mg twice daily for 7 days", "Fluoroquinolones are reserved for complicated infections because of adverse-effect risk and resistance concerns."],
      ["Ceftriaxone 1 g intramuscularly once", "Parenteral therapy is unnecessary for uncomplicated cystitis."],
    ],
    correct: "a",
    rationale: "This patient has acute uncomplicated cystitis. First-line options include nitrofurantoin for 5 days, fosfomycin as a single dose, or TMP-SMX for 3 days when local resistance is below 20%. Fluoroquinolones are not recommended as first-line agents because of serious adverse effects and stewardship concerns. Nitrofurantoin achieves high urinary concentrations with low resistance rates.",
    extras: {
      whyCorrect: "Nitrofurantoin is first-line and unaffected by the high local TMP-SMX resistance.",
      strategy: "Check stated resistance rates; they are included to eliminate an option.",
      keyTakeaway: "Uncomplicated cystitis: nitrofurantoin 5 days, fosfomycin once, or TMP-SMX 3 days if resistance is under 20%.",
      relatedTopics: ["Pyelonephritis", "Antibiotic stewardship", "Urinalysis interpretation"],
    },
    tags: ["pharmacology"],
  }),
  choice({
    exam: "fnp", category: "Plan and Management", topic: "Chronic disease management", difficulty: "moderate",
    stem: "A 52-year-old Black man without diabetes or chronic kidney disease has an average office blood pressure of 152/96 mm Hg confirmed by home readings. Lifestyle changes have not reached goal. Which medication is the most appropriate initial choice?",
    options: [
      ["Amlodipine", "Calcium channel blockers and thiazide diuretics are preferred initial agents for Black adults without CKD or heart failure."],
      ["Lisinopril", "ACE inhibitor monotherapy is less effective at lowering blood pressure and stroke risk in Black adults without CKD."],
      ["Metoprolol succinate", "Beta-blockers are not first-line for hypertension without a compelling indication."],
      ["Clonidine", "Clonidine is not a first-line agent and carries rebound hypertension risk."],
      ["Hydralazine", "Hydralazine is a later-line agent that causes reflex tachycardia when used alone."],
    ],
    correct: "a",
    rationale: "Current US hypertension guidelines recommend a thiazide-type diuretic or calcium channel blocker as initial therapy for Black adults without heart failure or CKD. These agents produce greater blood pressure and stroke reduction than ACE inhibitors in this population. Beta-blockers, clonidine and hydralazine are reserved for specific indications or add-on therapy. Two-drug therapy may be considered when blood pressure is well above target.",
    extras: {
      whyCorrect: "Amlodipine is a guideline-preferred first agent for this patient.",
      strategy: "Identify compelling indications first; when none exist, apply population-based first-line choices.",
      keyTakeaway: "Black adults without CKD/HF: start a thiazide or CCB.",
      relatedTopics: ["Hypertension staging", "Thiazide diuretics", "Compelling indications"],
    },
    tags: ["pharmacology"],
  }),
  choice({
    exam: "fnp", category: "Diagnosis", topic: "Differential diagnosis", difficulty: "easy",
    stem: "A 16-year-old competitive swimmer has right ear pain and itching for 3 days. Pulling on the auricle and pressing on the tragus worsen the pain. The canal is edematous with debris; the visible portion of the tympanic membrane is normal. What is the most likely diagnosis?",
    options: [
      ["Acute otitis externa", "Tragal tenderness, canal edema and debris with a normal tympanic membrane in a swimmer is classic otitis externa."],
      ["Acute otitis media", "AOM causes a bulging, erythematous tympanic membrane; pinna manipulation is usually painless."],
      ["Otitis media with effusion", "OME shows fluid behind an intact membrane without canal inflammation."],
      ["Mastoiditis", "Mastoiditis causes postauricular swelling and tenderness with anterior displacement of the auricle."],
    ],
    correct: "a",
    rationale: "Otitis externa is inflammation of the external auditory canal, often after water exposure that disrupts the protective cerumen layer. Pain with traction on the pinna or pressure on the tragus is characteristic. The canal is swollen and may contain debris while the tympanic membrane is normal. Treatment usually consists of topical antibiotic drops with or without a corticosteroid.",
    extras: {
      whyCorrect: "Tragal tenderness with canal inflammation localizes the problem to the external canal.",
      strategy: "Tragal or pinna pain points to the canal; a bulging tympanic membrane points to the middle ear.",
      keyTakeaway: "Swimmer's ear: tragal tenderness, edematous canal, normal TM; treat with topical drops.",
      relatedTopics: ["Otitis media", "Topical otic antibiotics", "Malignant otitis externa"],
    },
  }),
  choice({
    exam: "fnp", category: "Plan and Management", topic: "Pediatrics", difficulty: "moderate",
    stem: "A 2-year-old has a temperature of 39.2°C (102.6°F), ear pulling and a bulging, erythematous right tympanic membrane. The child has no drug allergies and has not received antibiotics in the past 30 days. Which treatment is most appropriate?",
    options: [
      ["High-dose amoxicillin, 80-90 mg/kg/day divided twice daily", "High-dose amoxicillin is first-line for AOM when no recent beta-lactam exposure or allergy exists."],
      ["Azithromycin for 5 days", "Macrolides have high pneumococcal resistance and are not first-line."],
      ["Topical ciprofloxacin-dexamethasone ear drops", "Topical drops treat otitis externa or AOM with tympanostomy tubes, not AOM with an intact membrane."],
      ["Cefdinir as first-line therapy", "Cefdinir is an alternative for penicillin allergy without severe reaction, not the first choice."],
    ],
    correct: "a",
    rationale: "AOM with a bulging tympanic membrane and fever of 39°C or higher in a child warrants antibiotic therapy. High-dose amoxicillin overcomes intermediate pneumococcal resistance and is the first-line agent. Amoxicillin-clavulanate is chosen if the child received amoxicillin in the past 30 days or has concurrent purulent conjunctivitis. Children younger than 2 years, or those with severe symptoms, receive a 10-day course.",
    extras: {
      whyCorrect: "High-dose amoxicillin is the guideline-recommended first-line agent.",
      strategy: "Check for recent antibiotics or allergy; if neither, choose amoxicillin.",
      keyTakeaway: "AOM: amoxicillin 80-90 mg/kg/day; switch to amoxicillin-clavulanate if recent amoxicillin use.",
      relatedTopics: ["Watchful waiting in AOM", "Penicillin allergy", "Tympanostomy tubes"],
    },
    tags: ["pharmacology", "pediatrics"],
  }),
  choice({
    exam: "fnp", category: "Assessment", topic: "History taking", difficulty: "moderate",
    stem: "An FNP evaluates adults with acute low back pain. Which findings are red flags that warrant urgent further evaluation? Select all that apply.",
    options: [
      ["New urinary retention with saddle anesthesia", "These suggest cauda equina syndrome, a surgical emergency."],
      ["Fever in a patient who injects drugs", "Fever with injection drug use raises concern for spinal epidural abscess or vertebral osteomyelitis."],
      ["Unexplained weight loss with a history of breast cancer", "Prior malignancy and weight loss raise concern for spinal metastasis."],
      ["Paraspinal muscle tenderness after lifting furniture", "Localized muscle tenderness after strain is typical of mechanical back pain."],
      ["Pain that improves with walking and position changes", "Positional, mechanical pain without systemic features is not a red flag."],
    ],
    correct: ["a", "b", "c"],
    rationale: "Most acute low back pain is mechanical and resolves without imaging. Red flags include cauda equina features, signs of infection such as fever with injection drug use, history of cancer with weight loss, progressive neurologic deficit and significant trauma. These findings warrant urgent imaging, typically MRI, and laboratory evaluation. Mechanical features without red flags are managed conservatively.",
    extras: {
      whyCorrect: "Each selected finding suggests infection, malignancy or cord/cauda compression.",
      strategy: "Sort options into systemic/neurologic warning signs versus routine mechanical features.",
      keyTakeaway: "Back pain red flags: cauda equina signs, fever/IVDU, cancer history, progressive deficit.",
      relatedTopics: ["Cauda equina syndrome", "Spinal epidural abscess", "Imaging for back pain"],
    },
  }),
  choice({
    exam: "fnp", category: "Evaluation", topic: "Follow-up", difficulty: "easy",
    stem: "A 58-year-old with type 2 diabetes has an HbA1c of 8.4% on metformin, and the FNP adds a second agent. When is the most appropriate time to recheck the HbA1c to evaluate the change?",
    options: [
      ["In about 3 months", "HbA1c reflects average glucose over roughly 2-3 months, so 3 months is the earliest meaningful reassessment."],
      ["In 2 weeks", "Two weeks is too short for HbA1c to reflect the full effect of the change."],
      ["In 12 months", "Waiting a year delays needed therapeutic adjustments."],
      ["Only if symptoms of hyperglycemia develop", "HbA1c monitoring is scheduled, not symptom-driven."],
    ],
    correct: "a",
    rationale: "Glycated hemoglobin reflects average glycemia over the lifespan of red blood cells, about 2-3 months. After a therapy change or when glycemic targets are not met, HbA1c is checked about every 3 months. Once stable at goal, testing at least twice yearly is reasonable. Home glucose monitoring can guide interim adjustments.",
    extras: {
      whyCorrect: "Three months matches the time frame HbA1c reflects.",
      strategy: "Link the monitoring interval to the physiology of the test.",
      keyTakeaway: "Recheck HbA1c about every 3 months after changes; twice yearly when stable at goal.",
      relatedTopics: ["Glycemic targets", "Metformin", "Diabetes follow-up"],
    },
  }),
  choice({
    exam: "fnp", category: "Professional Role", topic: "Ethics", difficulty: "easy",
    stem: "A competent 66-year-old declines a recommended screening colonoscopy after the FNP explains the benefits, risks and alternatives. The FNP documents the discussion and offers stool-based testing. Which ethical principle is the FNP primarily upholding?",
    options: [
      ["Autonomy", "Respecting an informed, competent patient's right to decline care honors autonomy."],
      ["Beneficence", "Beneficence is acting for the patient's good, which might argue for the colonoscopy."],
      ["Justice", "Justice concerns fair distribution of resources and care."],
      ["Veracity", "Veracity is truthfulness; it supports informed consent but is not the main principle here."],
    ],
    correct: "a",
    rationale: "Autonomy is the right of a competent person to make informed decisions about their own care, including refusing recommended interventions. The FNP provided full information, respected the decision and offered alternatives. Documenting informed refusal is part of professional practice. Beneficence, justice and veracity are related but not the central principle in this scenario.",
    extras: {
      whyCorrect: "The FNP accepted an informed refusal, the defining act of respecting autonomy.",
      strategy: "Match the action (respecting a choice) to the principle (autonomy).",
      keyTakeaway: "Informed refusal by a competent patient must be respected and documented.",
      relatedTopics: ["Informed consent", "Shared decision-making", "Colorectal cancer screening"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* Clinical Medical Mathematics                                        */
/* ------------------------------------------------------------------ */
const CLINICAL_MATH: SeedQuestion[] = [
  numeric({
    exam: "clinical-math", category: "Oral Dosage", topic: "Tablets", difficulty: "easy",
    stem: "The prescriber orders digoxin 0.25 mg orally once daily. Digoxin 0.125 mg tablets are available. How many tablets should the nurse give?",
    unit: "tablets", decimals: 0, value: 2, tolerance: 0,
    rationale: "Use desired over have: 0.25 mg ÷ 0.125 mg per tablet = 2 tablets. Both quantities are already in milligrams, so no conversion is needed. A result of a whole number of tablets is expected for a scored or unscored tablet. Always confirm that a calculated tablet count is reasonable; more than 3 tablets per dose should prompt a recheck.",
    extras: {
      whyCorrect: "0.25 ÷ 0.125 = 2.",
      strategy: "Write D/H × Q and confirm units match before dividing.",
      keyTakeaway: "Desired ÷ have × quantity gives the amount to administer.",
      relatedTopics: ["Desired-over-have formula", "Digoxin", "Tablet splitting"],
    },
    tags: ["calculation"],
  }),
  numeric({
    exam: "clinical-math", category: "Oral Dosage", topic: "Liquids", difficulty: "easy",
    stem: "Amoxicillin oral suspension 375 mg is ordered. The bottle is labeled 250 mg/5 mL. How many mL should the nurse administer?",
    unit: "mL", decimals: 1, value: 7.5, tolerance: 0.05,
    rationale: "Desired ÷ have × quantity = 375 mg ÷ 250 mg × 5 mL = 7.5 mL. The concentration of the suspension provides the 'quantity' term. An oral syringe should be used to measure the dose accurately. The suspension should be shaken well before measuring.",
    extras: {
      whyCorrect: "375/250 = 1.5; 1.5 × 5 mL = 7.5 mL.",
      strategy: "Check reasonableness: the order is 1.5 times the labeled strength, so the volume is 1.5 times 5 mL.",
      keyTakeaway: "For liquids, multiply the dose ratio by the labeled volume.",
      relatedTopics: ["Oral syringes", "Suspensions", "Pediatric liquid dosing"],
    },
    tags: ["calculation"],
  }),
  numeric({
    exam: "clinical-math", category: "Unit Conversions", topic: "Household to metric", difficulty: "easy",
    stem: "A client weighs 165 lb. What is the client's weight in kilograms?",
    unit: "kg", decimals: 0, value: 75, tolerance: 0.5,
    rationale: "One kilogram equals 2.2 pounds, so divide pounds by 2.2. 165 ÷ 2.2 = 75 kg. Weight in kilograms is required for most weight-based dosing. Converting accurately before dosing prevents large errors, since confusing pounds with kilograms more than doubles a dose.",
    extras: {
      whyCorrect: "165 ÷ 2.2 = 75.",
      strategy: "Kilograms are always the smaller number; divide pounds by 2.2.",
      keyTakeaway: "kg = lb ÷ 2.2.",
      relatedTopics: ["Weight-based dosing", "Metric conversions"],
    },
    tags: ["calculation"],
  }),
  numeric({
    exam: "clinical-math", category: "IV Calculations", topic: "Flow rates (mL/hr)", difficulty: "easy",
    stem: "Infuse 1,000 mL of 0.9% sodium chloride over 8 hours using an infusion pump. At what rate should the nurse set the pump?",
    unit: "mL/hr", decimals: 0, value: 125, tolerance: 0,
    rationale: "Pump rate equals total volume divided by time in hours. 1,000 mL ÷ 8 hr = 125 mL/hr. Infusion pumps are programmed in mL/hr. The nurse verifies the rate against the order and monitors the site and fluid balance.",
    extras: {
      whyCorrect: "1000 ÷ 8 = 125.",
      strategy: "mL/hr = volume ÷ hours.",
      keyTakeaway: "Pumps run in mL/hr: divide volume by hours.",
      relatedTopics: ["Infusion pumps", "Isotonic fluids", "Fluid balance"],
    },
    tags: ["calculation"],
  }),
  numeric({
    exam: "clinical-math", category: "IV Calculations", topic: "Drip rates (gtt/min)", difficulty: "moderate",
    stem: "Infuse 500 mL of lactated Ringer's over 4 hours by gravity. The tubing drop factor is 15 gtt/mL. What is the drip rate? Round to the nearest whole drop.",
    unit: "gtt/min", decimals: 0, value: 31, tolerance: 0.5,
    rationale: "Drip rate = volume (mL) × drop factor ÷ time (min). Four hours is 240 minutes. 500 × 15 ÷ 240 = 31.25, which rounds to 31 gtt/min. Drops cannot be divided, so gravity drip rates are rounded to the nearest whole number.",
    extras: {
      whyCorrect: "7,500 ÷ 240 = 31.25 → 31 gtt/min.",
      strategy: "Convert hours to minutes first, then apply the formula.",
      keyTakeaway: "gtt/min = mL × drop factor ÷ minutes.",
      relatedTopics: ["Macrodrip tubing", "Gravity infusion", "Drop factors"],
    },
    tags: ["calculation"],
  }),
  numeric({
    exam: "clinical-math", category: "IV Calculations", topic: "Drip rates (gtt/min)", difficulty: "moderate",
    stem: "An IV piggyback of 100 mL is to infuse over 30 minutes with tubing that delivers 10 gtt/mL. What drip rate should the nurse regulate? Round to the nearest whole drop.",
    unit: "gtt/min", decimals: 0, value: 33, tolerance: 0.5,
    rationale: "Drip rate = volume × drop factor ÷ time in minutes. 100 mL × 10 gtt/mL ÷ 30 min = 33.3 gtt/min. Rounding to the nearest whole drop gives 33 gtt/min. Short infusions should be counted carefully for a full minute to ensure accuracy.",
    extras: {
      whyCorrect: "1,000 ÷ 30 = 33.3 → 33 gtt/min.",
      strategy: "When time is already in minutes, no conversion is needed.",
      keyTakeaway: "Always round gravity drip rates to whole drops.",
      relatedTopics: ["IV piggyback", "Secondary infusions", "Drop factors"],
    },
    tags: ["calculation"],
  }),
  numeric({
    exam: "clinical-math", category: "Weight-Based and Pediatric Dosing", topic: "mg/kg dosing", difficulty: "moderate",
    stem: "Acetaminophen 15 mg/kg per dose is ordered for a child who weighs 22 lb. How many milligrams should the child receive per dose?",
    unit: "mg", decimals: 0, value: 150, tolerance: 0,
    rationale: "First convert pounds to kilograms: 22 lb ÷ 2.2 = 10 kg. Then multiply by the ordered dose: 10 kg × 15 mg/kg = 150 mg. Weight-based pediatric doses must always be calculated from kilograms. The nurse should also confirm the total daily dose stays within the maximum recommended amount.",
    extras: {
      whyCorrect: "10 kg × 15 mg/kg = 150 mg.",
      strategy: "Convert to kg before multiplying by mg/kg.",
      keyTakeaway: "Pediatric dose = weight (kg) × mg/kg.",
      relatedTopics: ["Pediatric dosing", "Acetaminophen safety", "Unit conversion"],
    },
    tags: ["calculation", "pediatrics"],
  }),
  numeric({
    exam: "clinical-math", category: "Weight-Based and Pediatric Dosing", topic: "Safe dose range", difficulty: "difficult",
    stem: "A reference lists the safe dose of cefazolin for children as 25-50 mg/kg/day divided every 8 hours. A child weighs 18 kg. What is the maximum safe single dose in mg?",
    unit: "mg", decimals: 0, value: 300, tolerance: 0,
    rationale: "Calculate the maximum daily dose: 18 kg × 50 mg/kg/day = 900 mg/day. Every 8 hours means 3 doses per day. 900 mg ÷ 3 = 300 mg per dose. Any single ordered dose above 300 mg would exceed the safe range and should be clarified with the prescriber.",
    extras: {
      whyCorrect: "900 mg/day ÷ 3 doses = 300 mg.",
      strategy: "Find the daily maximum first, then divide by the number of doses per day.",
      keyTakeaway: "Per-dose limit = (kg × mg/kg/day) ÷ doses per day.",
      relatedTopics: ["Safe dose range", "Cephalosporins", "Pediatric safety"],
    },
    tags: ["calculation", "safety"],
  }),
  numeric({
    exam: "clinical-math", category: "Parenteral Dosage", topic: "Reconstitution", difficulty: "moderate",
    stem: "A 1-g vial of ceftriaxone is reconstituted for IM use with 3.6 mL of 1% lidocaine, yielding a concentration of 250 mg/mL. The order is ceftriaxone 500 mg IM. How many mL should the nurse draw up?",
    unit: "mL", decimals: 1, value: 2, tolerance: 0.05,
    rationale: "After reconstitution the concentration is 250 mg/mL, so use desired over have. 500 mg ÷ 250 mg/mL = 2 mL. The diluent volume (3.6 mL) is not used directly in the calculation; the resulting concentration is. Label the vial with the date, time, concentration and initials after reconstituting.",
    extras: {
      whyCorrect: "500 ÷ 250 = 2 mL.",
      strategy: "Use the final concentration stated on the label, not the diluent volume.",
      keyTakeaway: "Reconstituted dose volume = ordered dose ÷ final concentration.",
      relatedTopics: ["Reconstitution labeling", "IM injection volumes", "Cephalosporins"],
    },
    tags: ["calculation"],
  }),
  numeric({
    exam: "clinical-math", category: "IV Calculations", topic: "Heparin infusions", difficulty: "moderate",
    stem: "A heparin infusion of 25,000 units in 500 mL D5W is running at 18 mL/hr. How many units of heparin per hour is the client receiving?",
    unit: "units/hr", decimals: 0, value: 900, tolerance: 0,
    rationale: "First find the concentration: 25,000 units ÷ 500 mL = 50 units/mL. Then multiply by the rate: 50 units/mL × 18 mL/hr = 900 units/hr. Heparin is a high-alert medication, so infusion settings should be independently double-checked. The rate is adjusted based on aPTT or anti-Xa results per protocol.",
    extras: {
      whyCorrect: "50 units/mL × 18 mL/hr = 900 units/hr.",
      strategy: "Concentration first, then multiply by the hourly volume.",
      keyTakeaway: "units/hr = (units ÷ mL) × mL/hr.",
      relatedTopics: ["High-alert medications", "aPTT monitoring", "Anticoagulation protocols"],
    },
    tags: ["calculation", "safety"],
  }),
  numeric({
    exam: "clinical-math", category: "IV Calculations", topic: "Heparin infusions", difficulty: "difficult",
    stem: "A heparin protocol orders an infusion of 18 units/kg/hr for a client who weighs 80 kg. The bag contains 25,000 units in 250 mL. At what rate in mL/hr should the pump be set? Round to the nearest tenth.",
    unit: "mL/hr", decimals: 1, value: 14.4, tolerance: 0.05,
    rationale: "Dose per hour = 18 units/kg/hr × 80 kg = 1,440 units/hr. The concentration is 25,000 units ÷ 250 mL = 100 units/mL. Rate = 1,440 units/hr ÷ 100 units/mL = 14.4 mL/hr. Smart pumps with a drug library and an independent double-check reduce heparin errors.",
    extras: {
      whyCorrect: "1,440 ÷ 100 = 14.4 mL/hr.",
      strategy: "Weight-based infusions: dose/hr first, then divide by concentration.",
      keyTakeaway: "mL/hr = (dose per kg per hr × kg) ÷ concentration.",
      relatedTopics: ["Weight-based heparin", "Smart pumps", "Independent double-checks"],
    },
    tags: ["calculation", "safety"],
  }),
  numeric({
    exam: "clinical-math", category: "Weight-Based and Pediatric Dosing", topic: "Titrations", difficulty: "advanced",
    stem: "Dopamine is ordered at 5 mcg/kg/min for a client who weighs 70 kg. The premixed bag contains 400 mg dopamine in 250 mL. What pump rate in mL/hr delivers this dose? Round to the nearest tenth.",
    unit: "mL/hr", decimals: 1, value: 13.1, tolerance: 0.05,
    rationale: "Dose per minute = 5 mcg/kg/min × 70 kg = 350 mcg/min, or 21,000 mcg/hr. Concentration = 400 mg ÷ 250 mL = 1.6 mg/mL = 1,600 mcg/mL. Rate = 21,000 ÷ 1,600 = 13.125, which rounds to 13.1 mL/hr. Unit consistency (mcg with mcg, minutes converted to hours) is the key step.",
    extras: {
      whyCorrect: "21,000 mcg/hr ÷ 1,600 mcg/mL = 13.1 mL/hr.",
      strategy: "Convert mg to mcg and minutes to hours before dividing.",
      keyTakeaway: "mL/hr = mcg/kg/min × kg × 60 ÷ mcg/mL.",
      relatedTopics: ["Vasoactive drips", "Titration protocols", "Unit conversion"],
    },
    tags: ["calculation", "critical care"],
  }),
  choice({
    exam: "clinical-math", category: "Parenteral Dosage", topic: "Injections", difficulty: "easy",
    stem: "Morphine 4 mg IV is ordered. The vial contains morphine 10 mg/mL. How much should the nurse draw up?",
    options: [
      ["0.4 mL", "4 mg ÷ 10 mg/mL = 0.4 mL."],
      ["0.25 mL", "This inverts part of the ratio; 0.25 mL would contain only 2.5 mg."],
      ["2.5 mL", "This divides 10 by 4, inverting the formula and giving 25 mg."],
      ["4 mL", "This confuses mg with mL and would deliver 40 mg, a tenfold overdose."],
    ],
    correct: "a",
    rationale: "Desired over have: 4 mg ÷ 10 mg/mL = 0.4 mL. The ordered dose is less than the vial concentration, so the volume must be less than 1 mL. Opioids are high-alert medications, and small volumes should be measured with a 1-mL syringe. Waste of the remaining drug must be witnessed per policy.",
    extras: {
      whyCorrect: "0.4 mL contains exactly 4 mg at 10 mg/mL.",
      strategy: "Estimate first: a dose smaller than the concentration means less than 1 mL.",
      keyTakeaway: "Use a 1-mL syringe for sub-1-mL high-alert doses.",
      relatedTopics: ["Opioid safety", "Controlled substance waste", "Syringe selection"],
    },
    tags: ["calculation", "safety"],
  }),
  choice({
    exam: "clinical-math", category: "Unit Conversions", topic: "Household to metric", difficulty: "easy",
    stem: "A client is instructed to take 15 mL of an oral antacid. The client has only household teaspoons at home. How many teaspoons equal the dose?",
    options: [
      ["3 teaspoons", "1 teaspoon = 5 mL, so 15 mL = 3 teaspoons (which is also 1 tablespoon)."],
      ["1 teaspoon", "One teaspoon is only 5 mL."],
      ["2 teaspoons", "Two teaspoons equal 10 mL."],
      ["5 teaspoons", "Five teaspoons equal 25 mL."],
    ],
    correct: "a",
    rationale: "The standard conversion is 1 teaspoon = 5 mL and 1 tablespoon = 15 mL. Therefore 15 mL equals 3 teaspoons. Household spoons vary in size, so clients should be encouraged to use a calibrated dosing cup or oral syringe. Metric-only dosing instructions are preferred to reduce errors.",
    extras: {
      whyCorrect: "15 ÷ 5 = 3 teaspoons.",
      strategy: "Memorize 5 mL per teaspoon and 15 mL per tablespoon.",
      keyTakeaway: "Recommend calibrated measuring devices instead of kitchen spoons.",
      relatedTopics: ["Patient medication teaching", "Metric conversions"],
    },
    tags: ["calculation", "education"],
  }),
  choice({
    exam: "clinical-math", category: "Weight-Based and Pediatric Dosing", topic: "Safe dose range", difficulty: "difficult",
    stem: "A 15-kg child has an order for an antibiotic 250 mg orally every 8 hours. The drug reference lists a safe range of 20-40 mg/kg/day divided every 8 hours. What should the nurse do?",
    options: [
      ["Hold the dose and clarify the order, because 750 mg/day exceeds the 600 mg/day maximum", "Safe range is 300-600 mg/day; the order totals 750 mg/day, which is above the maximum."],
      ["Give the dose, because 250 mg falls within the 300-600 mg range", "This compares a single dose with a daily range, which is an invalid comparison."],
      ["Give the dose, because it is below the 40 mg/kg/day limit", "250 mg × 3 = 750 mg/day = 50 mg/kg/day, which is above 40 mg/kg/day."],
      ["Reduce the dose to 200 mg without contacting the prescriber", "The nurse cannot independently change a prescribed dose."],
    ],
    correct: "a",
    rationale: "The safe daily range is 15 kg × 20 = 300 mg to 15 kg × 40 = 600 mg per day. The ordered total is 250 mg × 3 doses = 750 mg per day, which exceeds the maximum. The nurse must withhold the dose and contact the prescriber for clarification. Nurses may not alter a dose without a new order.",
    extras: {
      whyCorrect: "750 mg/day is above the 600 mg/day maximum safe dose.",
      strategy: "Compare daily totals with daily ranges, or per-dose amounts with per-dose ranges, never a mix.",
      keyTakeaway: "Unsafe dose → hold and clarify with the prescriber.",
      relatedTopics: ["Safe dose range", "Pediatric dosing", "Order clarification"],
    },
    tags: ["calculation", "safety"],
  }),
];

/* ------------------------------------------------------------------ */
/* USMLE Step 1                                                        */
/* ------------------------------------------------------------------ */
const STEP1: SeedQuestion[] = [
  choice({
    exam: "usmle-step-1", subject: "Pharmacology", system: "Cardiovascular", topic: "ACE inhibitors", difficulty: "easy",
    stem: "A 56-year-old woman began lisinopril for hypertension 6 weeks ago. She now reports a persistent, nonproductive cough that keeps her awake at night. Lung examination and chest radiograph are normal. Which mechanism best explains her symptom?",
    options: [
      ["Accumulation of bradykinin", "ACE (kininase II) degrades bradykinin; inhibition raises bradykinin and substance P in the airway, causing cough."],
      ["Excess angiotensin II acting on bronchial smooth muscle", "ACE inhibitors reduce, not increase, angiotensin II."],
      ["Beta-2 receptor blockade in the airways", "This is the mechanism of bronchospasm from nonselective beta-blockers."],
      ["Increased aldosterone-mediated fluid retention", "ACE inhibitors decrease aldosterone secretion."],
      ["Histamine release from mast cells", "Mast-cell histamine release is not the mechanism of ACE inhibitor cough."],
    ],
    correct: "a",
    rationale: "Angiotensin-converting enzyme also inactivates bradykinin. ACE inhibitors therefore increase bradykinin and related mediators, which sensitize airway cough receptors and cause a dry cough in a meaningful minority of patients. Bradykinin accumulation also underlies ACE inhibitor-associated angioedema. Switching to an angiotensin II receptor blocker, which does not affect bradykinin breakdown, usually resolves the cough.",
    extras: {
      whyCorrect: "ACE inhibition prevents bradykinin degradation.",
      strategy: "Recall that ACE has two substrates: angiotensin I and bradykinin.",
      keyTakeaway: "ACE inhibitor cough and angioedema are bradykinin-mediated; ARBs avoid them.",
      relatedTopics: ["Renin-angiotensin-aldosterone system", "Angioedema", "ARBs"],
    },
  }),
  choice({
    exam: "usmle-step-1", subject: "Biochemistry", system: "Hematological", topic: "Hemolytic anemia", difficulty: "moderate",
    stem: "A 24-year-old man of Mediterranean descent develops fatigue and dark urine 3 days after starting trimethoprim-sulfamethoxazole. A peripheral smear shows bite cells, and supravital staining reveals Heinz bodies. A deficiency of which enzyme is most likely?",
    patient: {
      age: "24", gender: "Male",
      labs: [
        { name: "Hemoglobin", value: "8.9", unit: "g/dL", range: "13.5-17.5", flag: "L" },
        { name: "Reticulocytes", value: "6.2", unit: "%", range: "0.5-2.5", flag: "H" },
        { name: "Indirect bilirubin", value: "3.4", unit: "mg/dL", range: "0.2-0.8", flag: "H" },
        { name: "LDH", value: "620", unit: "U/L", range: "140-280", flag: "H" },
        { name: "Haptoglobin", value: "<10", unit: "mg/dL", range: "30-200", flag: "L" },
      ],
    },
    options: [
      ["Glucose-6-phosphate dehydrogenase", "G6PD generates NADPH to regenerate reduced glutathione; deficiency causes oxidant-induced hemolysis with Heinz bodies and bite cells."],
      ["Pyruvate kinase", "PK deficiency causes chronic hemolysis from ATP depletion, without Heinz bodies or drug triggers."],
      ["Hexokinase", "Hexokinase deficiency is a rare cause of chronic nonspherocytic hemolysis unrelated to oxidant drugs."],
      ["Aminolevulinic acid dehydratase", "This heme-synthesis enzyme is inhibited by lead and does not cause oxidant hemolysis."],
      ["Transketolase", "Transketolase is in the nonoxidative pentose phosphate pathway and is not the cause of this syndrome."],
    ],
    correct: "a",
    rationale: "G6PD catalyzes the rate-limiting step of the oxidative pentose phosphate pathway, producing NADPH that keeps glutathione reduced. Without it, oxidant stress from drugs such as sulfonamides, primaquine or dapsone, infections, or fava beans denatures hemoglobin into Heinz bodies. Splenic macrophages remove these inclusions, producing bite cells. Laboratory findings show intravascular and extravascular hemolysis with high LDH and indirect bilirubin and low haptoglobin.",
    extras: {
      whyCorrect: "Oxidant trigger + Heinz bodies + bite cells is classic G6PD deficiency.",
      strategy: "Episodic hemolysis after an oxidant stress points to the pentose phosphate pathway.",
      keyTakeaway: "G6PD deficiency: X-linked, NADPH deficit, Heinz bodies and bite cells after oxidant exposure.",
      relatedTopics: ["Pentose phosphate pathway", "Glutathione", "Hemolysis labs"],
    },
    tags: ["lab-based"],
  }),
  choice({
    exam: "usmle-step-1", subject: "Microbiology", system: "Neurological", topic: "Listeria monocytogenes", difficulty: "moderate",
    stem: "A 31-year-old woman at 29 weeks' gestation has fever, headache and neck stiffness. She recently ate unpasteurized soft cheese. CSF Gram stain shows short gram-positive rods, and the organism shows tumbling motility at room temperature. Which property allows this organism to spread directly from cell to cell?",
    options: [
      ["Polymerization of host actin into 'rocket tails'", "Listeria uses ActA to polymerize host actin, propelling itself into neighboring cells while avoiding antibodies."],
      ["A polysaccharide capsule that inhibits phagocytosis", "Listeria is not known for an antiphagocytic capsule; capsules are typical of pneumococcus and others."],
      ["Production of an IgA protease", "IgA protease aids mucosal colonization by organisms such as Neisseria and Haemophilus."],
      ["An exotoxin that ADP-ribosylates elongation factor 2", "This is the mechanism of diphtheria and Pseudomonas exotoxin A."],
      ["Spore formation that resists host defenses", "Listeria does not form spores."],
    ],
    correct: "a",
    rationale: "Listeria monocytogenes is a facultative intracellular gram-positive rod transmitted through unpasteurized dairy, deli meats and other refrigerated foods. It escapes the phagosome using listeriolysin O and then uses the ActA protein to polymerize host actin into comet-like tails. These propel the bacterium into adjacent cells, shielding it from humoral immunity. Pregnant patients, neonates, older adults and immunocompromised hosts are at risk, and ampicillin is the treatment of choice.",
    extras: {
      whyCorrect: "Actin rocket tails mediate direct cell-to-cell spread.",
      strategy: "Gram-positive rod + tumbling motility + pregnancy = Listeria.",
      keyTakeaway: "Listeria: listeriolysin O to escape phagosomes, ActA actin tails to spread; treat with ampicillin.",
      relatedTopics: ["Neonatal meningitis", "Cell-mediated immunity", "Foodborne pathogens"],
    },
  }),
  choice({
    exam: "usmle-step-1", subject: "Pathology", system: "Renal and Urinary", topic: "Nephrotic syndrome", difficulty: "moderate",
    stem: "A 4-year-old boy has 1 week of periorbital and lower-extremity swelling that began after an upper respiratory infection. Blood pressure is normal. Which finding would most likely be seen on electron microscopy of a renal biopsy?",
    patient: {
      age: "4", gender: "Male",
      vitals: { "Blood pressure": "98/60 mm Hg" },
      labs: [
        { name: "Serum albumin", value: "1.9", unit: "g/dL", range: "3.5-5.5", flag: "L" },
        { name: "Total cholesterol", value: "320", unit: "mg/dL", range: "<170", flag: "H" },
        { name: "Urine protein", value: "4+", flag: "H" },
        { name: "Urine RBCs", value: "0-1", unit: "/hpf", range: "0-2" },
        { name: "C3", value: "112", unit: "mg/dL", range: "80-160" },
      ],
    },
    options: [
      ["Diffuse effacement of podocyte foot processes", "Minimal change disease shows normal light microscopy and foot-process effacement on EM."],
      ["Subepithelial 'humps'", "Subepithelial humps are seen in poststreptococcal glomerulonephritis, a nephritic disorder with low C3."],
      ["Subepithelial 'spike and dome' deposits", "Spike-and-dome deposits indicate membranous nephropathy, typical of adults."],
      ["Splitting of the glomerular basement membrane with 'basket-weave' appearance", "This is the finding in Alport syndrome."],
      ["Mesangial IgA deposits", "IgA nephropathy presents with hematuria, often after a mucosal infection."],
    ],
    correct: "a",
    rationale: "Minimal change disease is the most common cause of nephrotic syndrome in young children. It presents with heavy proteinuria, hypoalbuminemia, edema and hyperlipidemia, without hematuria or hypertension, and complement levels are normal. Light microscopy appears normal, while electron microscopy shows diffuse effacement of podocyte foot processes. Most children respond to glucocorticoids.",
    extras: {
      whyCorrect: "Pediatric nephrotic syndrome with bland sediment and normal C3 suggests minimal change disease.",
      strategy: "First classify nephrotic versus nephritic, then use age and complement to narrow.",
      keyTakeaway: "Minimal change disease: normal LM, effaced foot processes on EM, steroid responsive.",
      relatedTopics: ["Focal segmental glomerulosclerosis", "Nephritic syndrome", "Hypoalbuminemia"],
    },
    tags: ["lab-based"],
  }),
  choice({
    exam: "usmle-step-1", subject: "Physiology", system: "Respiratory", topic: "Acid-base physiology", difficulty: "difficult",
    stem: "A 22-year-old man is brought to the emergency department after being found unresponsive. His respiratory rate is 6/min and his pupils are pinpoint. Arterial blood gas results are shown. Which acid-base disturbance is present?",
    exhibit: {
      kind: "table", title: "Arterial blood gas (room air)",
      columns: ["Parameter", "Result", "Reference range"],
      rows: [
        ["pH", "7.24", "7.35-7.45"],
        ["PaCO2", "60 mm Hg", "35-45 mm Hg"],
        ["HCO3-", "26 mEq/L", "22-26 mEq/L"],
        ["PaO2", "62 mm Hg", "75-100 mm Hg"],
      ],
    },
    options: [
      ["Acute respiratory acidosis", "PaCO2 is elevated, pH is low, and bicarbonate has risen only about 1 mEq/L per 10 mm Hg, matching acute compensation."],
      ["Chronic respiratory acidosis", "Chronic compensation would raise bicarbonate about 3-4 mEq/L per 10 mm Hg rise in PaCO2 (to ~31-32 mEq/L)."],
      ["Metabolic acidosis with respiratory compensation", "Respiratory compensation for metabolic acidosis lowers PaCO2; here PaCO2 is high."],
      ["Metabolic alkalosis with respiratory compensation", "The pH is acidemic, excluding a primary alkalosis."],
      ["Mixed respiratory and metabolic acidosis", "A concurrent metabolic acidosis would produce a bicarbonate below the expected value; 26 mEq/L is appropriate."],
    ],
    correct: "a",
    rationale: "Opioid toxicity suppresses the medullary respiratory center, causing hypoventilation and CO2 retention. In acute respiratory acidosis, bicarbonate rises about 1 mEq/L for every 10 mm Hg increase in PaCO2 through intracellular buffering, and pH falls about 0.08 per 10 mm Hg. A PaCO2 of 60 predicts an HCO3 near 26 and a pH near 7.24, exactly as observed. Renal compensation that produces larger bicarbonate increases takes several days.",
    extras: {
      whyCorrect: "Measured values match the predicted acute compensation.",
      strategy: "Identify the primary disorder from pH and PaCO2, then compare HCO3 with expected acute vs chronic compensation.",
      keyTakeaway: "Acute respiratory acidosis: +1 HCO3 per 10 mm Hg PaCO2; chronic: +3.5 per 10.",
      relatedTopics: ["Opioid overdose", "Henderson-Hasselbalch", "Renal compensation"],
    },
  }),
  choice({
    exam: "usmle-step-1", subject: "Immunology", system: "Immune", topic: "Primary immunodeficiency", difficulty: "moderate",
    stem: "A 10-month-old boy has had three episodes of pneumonia and two of otitis media caused by encapsulated bacteria since age 6 months. Tonsils are barely visible and no lymph nodes are palpable. Serum IgG, IgA and IgM are markedly decreased, and flow cytometry shows absent CD19+ cells with normal T-cell counts. A mutation in which gene is most likely?",
    options: [
      ["BTK (Bruton tyrosine kinase)", "BTK is required for pre-B cell maturation; X-linked mutation causes absent B cells and panhypogammaglobulinemia."],
      ["CD40 ligand", "CD40L defects cause hyper-IgM syndrome with normal or high IgM and normal B-cell numbers."],
      ["Adenosine deaminase", "ADA deficiency causes severe combined immunodeficiency with absent T cells."],
      ["WAS", "Wiskott-Aldrich syndrome presents with eczema, thrombocytopenia and infections."],
      ["TBX1 region (22q11.2 deletion)", "DiGeorge syndrome primarily affects T cells due to thymic hypoplasia."],
    ],
    correct: "a",
    rationale: "X-linked (Bruton) agammaglobulinemia results from mutations in BTK, which blocks B-cell maturation beyond the pre-B stage. Boys present after about 6 months, when maternal IgG wanes, with recurrent sinopulmonary infections by encapsulated organisms. Lymphoid tissue such as tonsils is hypoplastic, all immunoglobulin classes are low and peripheral B cells are absent. Treatment is lifelong immunoglobulin replacement, and live vaccines are avoided.",
    extras: {
      whyCorrect: "Absent B cells in a boy with low all-class immunoglobulins indicates BTK deficiency.",
      strategy: "Use cell counts: no B cells with normal T cells narrows to Bruton agammaglobulinemia.",
      keyTakeaway: "XLA: BTK mutation, no B cells, tiny tonsils, infections after 6 months.",
      relatedTopics: ["Hyper-IgM syndrome", "SCID", "Common variable immunodeficiency"],
    },
  }),
  choice({
    exam: "usmle-step-1", subject: "Anatomy", system: "Musculoskeletal", topic: "Upper limb nerve injury", difficulty: "easy",
    stem: "A 35-year-old man falls from a ladder and sustains a midshaft fracture of the humerus. On examination he cannot extend his wrist or fingers at the metacarpophalangeal joints, and he has decreased sensation over the dorsum of the hand near the first web space. Which nerve is most likely injured?",
    options: [
      ["Radial nerve", "The radial nerve runs in the spiral groove of the midshaft humerus; injury causes wrist drop and dorsal first web space numbness."],
      ["Axillary nerve", "Axillary nerve injury follows surgical neck fracture or shoulder dislocation and weakens deltoid abduction."],
      ["Median nerve", "Median nerve injury impairs thumb opposition and lateral palmar sensation."],
      ["Ulnar nerve", "Ulnar injury (medial epicondyle) causes claw hand and medial hand sensory loss."],
      ["Musculocutaneous nerve", "Musculocutaneous injury weakens elbow flexion and causes lateral forearm numbness."],
    ],
    correct: "a",
    rationale: "The radial nerve travels with the deep brachial artery in the radial (spiral) groove of the humerus, so midshaft fractures can injure it. It innervates the wrist and finger extensors, producing wrist drop when damaged. Sensory loss affects the dorsal hand over the first web space. Triceps function is often spared because its branches arise proximal to the groove.",
    extras: {
      whyCorrect: "Midshaft fracture + wrist drop = radial nerve.",
      strategy: "Map fracture sites to nerves: surgical neck–axillary, midshaft–radial, supracondylar–median, medial epicondyle–ulnar.",
      keyTakeaway: "Spiral groove injury → wrist drop with preserved triceps.",
      relatedTopics: ["Brachial plexus", "Humeral fractures", "Peripheral nerve injury"],
    },
  }),
  choice({
    exam: "usmle-step-1", subject: "Behavioral Science", system: "Multisystem", topic: "Biostatistics", difficulty: "moderate",
    stem: "A new screening test is evaluated in 1,000 people. Of 100 people with the disease, 90 test positive. Of 900 people without the disease, 90 test positive. What is the positive predictive value of the test in this population?",
    options: [
      ["50%", "PPV = true positives ÷ all positives = 90 ÷ (90 + 90) = 50%."],
      ["10%", "10% is the prevalence of disease in the sample (100/1,000)."],
      ["90%", "90% is the sensitivity (90/100) and also the specificity (810/900)."],
      ["99%", "This approximates the negative predictive value: 810 ÷ (810 + 10) ≈ 98.8%."],
      ["81%", "81% has no meaning for this 2 × 2 table."],
    ],
    correct: "a",
    rationale: "Positive predictive value is the probability that a person with a positive result truly has the disease: TP ÷ (TP + FP). There are 90 true positives and 90 false positives, giving 90/180 = 50%. Sensitivity (90%) and specificity (90%) are properties of the test, whereas PPV depends on prevalence. With a low prevalence of 10%, many positives are false even with a good test.",
    extras: {
      whyCorrect: "90 ÷ 180 = 0.50.",
      strategy: "Draw the 2 × 2 table and read PPV across the 'test positive' row.",
      keyTakeaway: "PPV rises with prevalence; sensitivity and specificity do not change with prevalence.",
      relatedTopics: ["Sensitivity and specificity", "Negative predictive value", "Prevalence"],
    },
  }),
  choice({
    exam: "usmle-step-1", subject: "Pharmacology", system: "Endocrine", topic: "Antidiabetic agents", difficulty: "easy",
    stem: "A 49-year-old woman with newly diagnosed type 2 diabetes is started on the first-line oral agent that does not typically cause hypoglycemia or weight gain. It should be held before iodinated contrast studies in patients with reduced kidney function. What is the primary mechanism of this drug?",
    options: [
      ["Decreases hepatic gluconeogenesis", "Metformin acts mainly in the liver, partly through AMP-activated protein kinase, to suppress glucose production."],
      ["Closes ATP-sensitive potassium channels on beta cells", "This is the mechanism of sulfonylureas, which can cause hypoglycemia and weight gain."],
      ["Inhibits sodium-glucose cotransporter 2", "SGLT2 inhibitors cause glucosuria; they are not the first-line agent described."],
      ["Activates PPAR-gamma", "Thiazolidinediones increase insulin sensitivity but cause weight gain and fluid retention."],
      ["Inhibits dipeptidyl peptidase-4", "DPP-4 inhibitors prolong endogenous incretin activity."],
    ],
    correct: "a",
    rationale: "Metformin is a biguanide that decreases hepatic glucose output, largely by inhibiting gluconeogenesis, and modestly increases peripheral insulin sensitivity. It rarely causes hypoglycemia when used alone and is weight neutral or causes modest weight loss. The most serious, though rare, adverse effect is lactic acidosis, which is more likely with reduced renal function. Metformin is temporarily held around iodinated contrast in patients with impaired kidney function.",
    extras: {
      whyCorrect: "Metformin's main action is suppression of hepatic gluconeogenesis.",
      strategy: "First-line + no hypoglycemia + contrast precaution = metformin.",
      keyTakeaway: "Metformin: ↓ hepatic gluconeogenesis; GI upset, B12 deficiency, rare lactic acidosis.",
      relatedTopics: ["Lactic acidosis", "Sulfonylureas", "SGLT2 inhibitors"],
    },
  }),
  choice({
    exam: "usmle-step-1", subject: "Pathology", system: "Gastrointestinal", topic: "Celiac disease", difficulty: "moderate",
    stem: "A 27-year-old woman has chronic bloating, loose stools and iron deficiency anemia that does not respond to oral iron. She also has an itchy, vesicular rash on her extensor forearms. Serum anti-tissue transglutaminase IgA is markedly elevated. Which finding is most likely on duodenal biopsy?",
    options: [
      ["Villous atrophy, crypt hyperplasia and increased intraepithelial lymphocytes", "These are the characteristic histologic features of celiac disease."],
      ["PAS-positive foamy macrophages in the lamina propria", "This describes Whipple disease (Tropheryma whipplei)."],
      ["Noncaseating granulomas with transmural inflammation", "This is typical of Crohn disease."],
      ["Absence of plasma cells in the lamina propria", "Lack of plasma cells suggests common variable immunodeficiency."],
      ["Lipid-laden enterocytes with normal villi", "This occurs in abetalipoproteinemia."],
    ],
    correct: "a",
    rationale: "Celiac disease is an immune reaction to gliadin in genetically susceptible people, mainly those with HLA-DQ2 or DQ8. Tissue transglutaminase deamidates gliadin, increasing its presentation to T cells and causing mucosal damage that is most prominent in the duodenum. Biopsy shows villous atrophy, crypt hyperplasia and intraepithelial lymphocytosis. Dermatitis herpetiformis and iron deficiency from proximal malabsorption are common associations.",
    extras: {
      whyCorrect: "Anti-tTG plus dermatitis herpetiformis indicates celiac disease and its classic histology.",
      strategy: "Link the rash (dermatitis herpetiformis) to celiac disease.",
      keyTakeaway: "Celiac: villous atrophy, crypt hyperplasia, IELs; treat with a strict gluten-free diet.",
      relatedTopics: ["Malabsorption", "HLA-DQ2/DQ8", "Enteropathy-associated T-cell lymphoma"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* USMLE Step 2 CK                                                     */
/* ------------------------------------------------------------------ */
const STEP2: SeedQuestion[] = [
  choice({
    exam: "usmle-step-2-ck", subject: "Internal Medicine", system: "Cardiovascular", topic: "Right ventricular infarction", difficulty: "difficult",
    stem: "A 64-year-old man has 1 hour of crushing chest pain. ECG shows ST elevation in leads II, III and aVF, and right-sided leads show ST elevation in V4R. He received aspirin. Blood pressure is 84/56 mm Hg, jugular veins are distended and lungs are clear. Which intervention is most appropriate while arranging emergency reperfusion?",
    patient: { age: "64", gender: "Male", vitals: { "Blood pressure": "84/56 mm Hg", "Heart rate": "58/min", "SpO2": "96% on room air" } },
    options: [
      ["Intravenous normal saline bolus", "RV infarction is preload dependent; cautious volume loading supports cardiac output."],
      ["Sublingual nitroglycerin", "Nitrates reduce preload and can cause profound hypotension in RV infarction."],
      ["Intravenous furosemide", "Diuresis decreases preload and worsens hypotension; the lungs are clear."],
      ["Intravenous metoprolol", "Beta-blockers are avoided in hypotension, bradycardia and possible cardiogenic shock."],
      ["Morphine for pain control", "Morphine causes venodilation and can worsen hypotension in a preload-dependent ventricle."],
    ],
    correct: "a",
    rationale: "Inferior STEMI with hypotension, elevated jugular venous pressure and clear lungs suggests right ventricular infarction, confirmed by ST elevation in V4R. The right ventricle depends on adequate preload to maintain left ventricular filling. Initial management includes IV fluids while arranging primary PCI. Preload-reducing agents such as nitrates, diuretics and morphine should be avoided, and inotropes are added if hypotension persists.",
    extras: {
      whyCorrect: "Volume loading supports the preload-dependent right ventricle.",
      strategy: "Inferior MI + hypotension + JVD + clear lungs = RV infarct; avoid anything that lowers preload.",
      keyTakeaway: "RV infarction: fluids, avoid nitrates, urgent reperfusion.",
      relatedTopics: ["Inferior MI", "Cardiogenic shock", "Primary PCI"],
    },
  }),
  choice({
    exam: "usmle-step-2-ck", subject: "Surgery", system: "Gastrointestinal", topic: "Acute abdomen", difficulty: "easy",
    stem: "A 23-year-old woman has 14 hours of periumbilical pain that has migrated to the right lower quadrant, with nausea and anorexia. Temperature is 38.0°C (100.4°F) and she has RLQ tenderness with guarding. Her last menstrual period was 6 weeks ago. What is the most appropriate next step?",
    options: [
      ["Serum or urine beta-hCG", "Pregnancy, including ectopic pregnancy, must be excluded in any reproductive-age woman with abdominal pain before imaging or surgery."],
      ["CT of the abdomen and pelvis with contrast", "Imaging choice depends on pregnancy status; CT is avoided if she is pregnant."],
      ["Immediate laparoscopic appendectomy", "Surgery should not proceed before pregnancy is excluded and the diagnosis is supported."],
      ["Discharge with oral antibiotics", "Suspected appendicitis with peritoneal signs requires evaluation, not discharge."],
      ["Colonoscopy", "Colonoscopy has no role in evaluating acute RLQ pain."],
    ],
    correct: "a",
    rationale: "The clinical picture suggests appendicitis, but ectopic pregnancy must be excluded in any woman of reproductive age with abdominal pain, especially with a delayed menstrual period. A beta-hCG result determines whether ultrasound or CT is appropriate and influences surgical and anesthetic decisions. If hCG is positive, transvaginal ultrasound evaluates for ectopic pregnancy. If negative, CT or ultrasound can confirm appendicitis.",
    extras: {
      whyCorrect: "Pregnancy testing is mandatory before imaging or surgery in reproductive-age women.",
      strategy: "'Next step' questions often test a mandatory safety check before definitive care.",
      keyTakeaway: "Reproductive-age woman with abdominal pain: check hCG first.",
      relatedTopics: ["Ectopic pregnancy", "Appendicitis imaging", "Alvarado score"],
    },
  }),
  choice({
    exam: "usmle-step-2-ck", subject: "Pediatrics", system: "Respiratory", topic: "Croup", difficulty: "moderate",
    stem: "A 2-year-old has a 2-day history of rhinorrhea followed by a barking cough. Tonight he has inspiratory stridor at rest, suprasternal retractions and a temperature of 38.1°C. He is alert and drinking. Oxygen saturation is 95% on room air. What is the most appropriate management?",
    options: [
      ["Dexamethasone and nebulized racemic epinephrine", "Moderate to severe croup with stridor at rest requires both a corticosteroid and nebulized epinephrine."],
      ["Oral amoxicillin", "Croup is viral; antibiotics are not indicated."],
      ["Immediate endotracheal intubation", "Intubation is reserved for impending respiratory failure unresponsive to medical therapy."],
      ["Nebulized albuterol", "Croup is an upper-airway problem; albuterol does not relieve subglottic edema."],
      ["Lateral neck radiograph before any treatment", "Croup is a clinical diagnosis; imaging should not delay treatment."],
    ],
    correct: "a",
    rationale: "Croup (laryngotracheobronchitis), usually caused by parainfluenza virus, produces subglottic edema with a barking cough and stridor. Stridor at rest with retractions indicates at least moderate severity. A single dose of dexamethasone reduces airway inflammation over hours, and nebulized racemic epinephrine provides rapid but temporary relief through vasoconstriction. Children should be observed for several hours after epinephrine because of possible symptom rebound.",
    extras: {
      whyCorrect: "Stridor at rest calls for steroids plus nebulized epinephrine.",
      strategy: "Grade croup severity by stridor at rest; mild croup gets dexamethasone alone.",
      keyTakeaway: "Croup: dexamethasone for all; add nebulized epinephrine for stridor at rest.",
      relatedTopics: ["Epiglottitis", "Bacterial tracheitis", "Steeple sign"],
    },
    tags: ["pediatrics"],
  }),
  choice({
    exam: "usmle-step-2-ck", subject: "Obstetrics and Gynecology", system: "Reproductive", topic: "Preeclampsia", difficulty: "moderate",
    stem: "A 29-year-old G1P0 at 35 weeks' gestation has a severe headache and blood pressure of 168/112 mm Hg on repeat measurement. Urine protein-to-creatinine ratio is 0.6, and platelets are 140,000/mm3. Fetal heart tracing is reassuring. In addition to antihypertensive therapy, what is the most appropriate management?",
    options: [
      ["Intravenous magnesium sulfate and delivery", "Preeclampsia with severe features at ≥34 weeks is managed with seizure prophylaxis and delivery."],
      ["Expectant management until 37 weeks", "Expectant management is not appropriate for severe features at or after 34 weeks."],
      ["Betamethasone and delivery in 48 hours", "Delaying delivery for steroids is not indicated at 35 weeks with severe features."],
      ["Bed rest and outpatient follow-up in 1 week", "Severe features require hospitalization and delivery."],
      ["Low-dose aspirin", "Aspirin is used to prevent preeclampsia in high-risk patients, not to treat it."],
    ],
    correct: "a",
    rationale: "Severe-range blood pressure (≥160/110 mm Hg) and new headache define preeclampsia with severe features. At 34 weeks or later, delivery is recommended after maternal stabilization. Magnesium sulfate prevents eclamptic seizures, and labetalol, hydralazine or immediate-release nifedipine treats severe hypertension. Vaginal delivery is preferred unless there are standard indications for cesarean birth.",
    extras: {
      whyCorrect: "Severe features at ≥34 weeks → magnesium plus delivery.",
      strategy: "Gestational age and severity together determine expectant management vs delivery.",
      keyTakeaway: "Preeclampsia with severe features: magnesium sulfate, BP control, deliver at ≥34 weeks.",
      relatedTopics: ["Eclampsia", "HELLP syndrome", "Magnesium toxicity"],
    },
  }),
  choice({
    exam: "usmle-step-2-ck", subject: "Psychiatry", system: "Psychiatric", topic: "Neuroleptic malignant syndrome", difficulty: "moderate",
    stem: "A 34-year-old man with schizophrenia received several doses of intramuscular haloperidol over 48 hours for agitation. He is now confused with a temperature of 40.1°C, diffuse 'lead-pipe' rigidity and labile blood pressure. Creatine kinase is 18,500 U/L. What is the most appropriate initial step?",
    options: [
      ["Discontinue haloperidol and begin supportive care with cooling and IV fluids", "Stopping the causative agent and aggressive supportive care is the cornerstone of NMS management."],
      ["Administer cyproheptadine", "Cyproheptadine is a serotonin antagonist used for serotonin syndrome."],
      ["Switch to intramuscular olanzapine", "Any dopamine antagonist can worsen NMS and must be withheld."],
      ["Give benztropine for dystonia", "Anticholinergics treat acute dystonia and do not address NMS."],
      ["Restart haloperidol at a lower dose", "Re-exposure to the antipsychotic is contraindicated during NMS."],
    ],
    correct: "a",
    rationale: "Neuroleptic malignant syndrome is a reaction to dopamine antagonism characterized by hyperthermia, lead-pipe rigidity, altered mental status, autonomic instability and markedly elevated CK. The first step is to stop the offending drug and provide supportive care, including cooling, IV fluids to prevent rhabdomyolysis-induced kidney injury and ICU monitoring. Dantrolene or bromocriptine may be added in severe cases. Antipsychotics should not be reintroduced for at least 2 weeks after resolution.",
    extras: {
      whyCorrect: "Removing the trigger and supporting the patient is the first priority.",
      strategy: "Distinguish NMS (rigidity, slow onset, dopamine blocker) from serotonin syndrome (clonus, rapid onset, serotonergic drugs).",
      keyTakeaway: "NMS: stop antipsychotic, cool, hydrate; consider dantrolene or bromocriptine.",
      relatedTopics: ["Serotonin syndrome", "Malignant hyperthermia", "Rhabdomyolysis"],
    },
  }),
  choice({
    exam: "usmle-step-2-ck", subject: "Neurology", system: "Neurological", topic: "Acute ischemic stroke", difficulty: "difficult",
    stem: "A 70-year-old woman has sudden right-sided weakness and aphasia that began 90 minutes ago. Noncontrast CT of the head shows no hemorrhage. Glucose is 132 mg/dL. Blood pressure is 198/112 mm Hg on two readings. She has no contraindications to thrombolysis. What is the most appropriate next step?",
    options: [
      ["Intravenous labetalol to lower blood pressure below 185/110 mm Hg, then thrombolytic therapy", "BP must be below 185/110 mm Hg before IV thrombolysis and maintained below 180/105 mm Hg afterward."],
      ["Administer IV alteplase immediately without treating blood pressure", "Thrombolysis with BP above 185/110 mm Hg increases the risk of hemorrhage."],
      ["Withhold thrombolysis because her blood pressure is elevated", "Elevated BP that can be lowered is not a reason to forgo thrombolysis."],
      ["Start aspirin 325 mg and admit for observation", "Aspirin is held for 24 hours after thrombolysis and is not a substitute for reperfusion within the window."],
      ["Lower blood pressure to below 120/80 mm Hg with nicardipine", "Aggressive lowering can reduce perfusion to the ischemic penumbra."],
    ],
    correct: "a",
    rationale: "This patient is within the 4.5-hour window for IV thrombolysis. Blood pressure must be reduced to less than 185/110 mm Hg before treatment, using agents such as IV labetalol or nicardipine, and kept below 180/105 mm Hg for 24 hours afterward. Overly aggressive reduction should be avoided to preserve penumbral perfusion. CT angiography should also be performed to identify large-vessel occlusion amenable to thrombectomy.",
    extras: {
      whyCorrect: "Controlling BP to <185/110 enables safe thrombolysis.",
      strategy: "Recall the BP thresholds: <185/110 before lysis, <180/105 after.",
      keyTakeaway: "Stroke thrombolysis requires BP <185/110 mm Hg; treat it, then lyse.",
      relatedTopics: ["Tenecteplase", "Mechanical thrombectomy", "Stroke BP management"],
    },
  }),
  choice({
    exam: "usmle-step-2-ck", subject: "Emergency Medicine", system: "Immune", topic: "Anaphylaxis", difficulty: "easy",
    stem: "A 26-year-old man develops diffuse hives, lip swelling, wheezing and lightheadedness minutes after eating a cashew. Blood pressure is 82/50 mm Hg. What is the most appropriate initial treatment?",
    options: [
      ["Intramuscular epinephrine 0.5 mg (1 mg/mL) into the anterolateral thigh", "IM epinephrine is first-line for anaphylaxis and should be given without delay."],
      ["Intravenous diphenhydramine", "Antihistamines relieve cutaneous symptoms but do not reverse airway obstruction or shock."],
      ["Intravenous methylprednisolone", "Corticosteroids have a delayed onset and are adjuncts only."],
      ["Nebulized albuterol alone", "Albuterol treats bronchospasm but not hypotension or airway edema."],
      ["Subcutaneous epinephrine 1 mg (1 mg/mL)", "Subcutaneous absorption is slower, and 1 mg exceeds the recommended adult IM dose."],
    ],
    correct: "a",
    rationale: "Anaphylaxis is a rapidly progressive systemic allergic reaction, here involving skin, respiratory and cardiovascular systems. Intramuscular epinephrine (0.01 mg/kg up to 0.5 mg in adults) in the anterolateral thigh is the first and most important treatment. It can be repeated every 5-15 minutes, along with IV fluids for hypotension. Antihistamines and corticosteroids are adjuncts that should never delay epinephrine.",
    extras: {
      whyCorrect: "IM epinephrine treats all components of anaphylaxis.",
      strategy: "Any option delaying epinephrine in anaphylaxis is wrong.",
      keyTakeaway: "Anaphylaxis: IM epinephrine to the thigh first, repeat as needed.",
      relatedTopics: ["Biphasic reactions", "Food allergy", "Distributive shock"],
    },
    tags: ["priority"],
  }),
  choice({
    exam: "usmle-step-2-ck", subject: "Preventive Medicine", system: "Cardiovascular", topic: "Abdominal aortic aneurysm screening", difficulty: "easy",
    stem: "A 67-year-old man comes for a routine visit. He smoked one pack per day from age 20 to 50. He has no symptoms, and blood pressure is controlled. Which screening test is recommended for him?",
    options: [
      ["One-time abdominal ultrasonography", "USPSTF recommends one-time AAA screening by ultrasound in men aged 65-75 who have ever smoked."],
      ["Annual low-dose CT of the chest", "He quit more than 15 years ago, so he no longer meets lung cancer screening criteria."],
      ["Resting electrocardiogram", "Routine ECG screening is not recommended in asymptomatic low-risk adults."],
      ["Carotid duplex ultrasonography", "Screening for asymptomatic carotid stenosis is not recommended."],
      ["Ankle-brachial index", "Evidence is insufficient to recommend routine ABI screening."],
    ],
    correct: "a",
    rationale: "The USPSTF recommends a one-time ultrasound screen for abdominal aortic aneurysm in men aged 65 to 75 who have ever smoked, defined as at least 100 cigarettes in a lifetime. Screening and elective repair of large aneurysms reduce AAA-related mortality. This patient quit 17 years ago, so he no longer meets lung cancer screening criteria, which require quitting within the past 15 years. Routine ECG, carotid and ABI screening are not recommended for asymptomatic adults.",
    extras: {
      whyCorrect: "He is a 65-75-year-old man who has ever smoked.",
      strategy: "Check each screening test's criteria against age, sex and smoking timeline.",
      keyTakeaway: "AAA: one-time ultrasound for men 65-75 who ever smoked.",
      relatedTopics: ["USPSTF recommendations", "Lung cancer screening", "AAA repair thresholds"],
    },
  }),
  choice({
    exam: "usmle-step-2-ck", subject: "Internal Medicine", system: "Endocrine", topic: "Diabetic ketoacidosis", difficulty: "difficult",
    stem: "A 19-year-old woman with type 1 diabetes has vomiting, abdominal pain and rapid deep breathing. She has received 1 L of 0.9% saline. Laboratory results are shown. What is the most appropriate next step?",
    patient: {
      age: "19", gender: "Female", history: "Type 1 diabetes",
      vitals: { "Heart rate": "118/min", "Respiratory rate": "30/min", "Blood pressure": "102/64 mm Hg" },
      labs: [
        { name: "Glucose", value: "540", unit: "mg/dL", range: "70-99", flag: "H" },
        { name: "Sodium", value: "131", unit: "mEq/L", range: "135-145", flag: "L" },
        { name: "Potassium", value: "3.0", unit: "mEq/L", range: "3.5-5.0", flag: "L" },
        { name: "Chloride", value: "96", unit: "mEq/L", range: "98-106", flag: "L" },
        { name: "Bicarbonate", value: "9", unit: "mEq/L", range: "22-28", flag: "L" },
        { name: "Beta-hydroxybutyrate", value: "6.8", unit: "mmol/L", range: "<0.6", flag: "H" },
      ],
    },
    options: [
      ["Begin IV potassium replacement and delay insulin until potassium is at least 3.3 mEq/L", "Insulin shifts potassium into cells; starting it with K <3.3 can precipitate fatal hypokalemia."],
      ["Start an IV regular insulin infusion immediately", "Insulin must be delayed when potassium is below 3.3 mEq/L."],
      ["Administer IV sodium bicarbonate", "Bicarbonate is generally reserved for pH below 6.9 and would also drive potassium into cells."],
      ["Switch fluids to 5% dextrose in water", "Dextrose is added when glucose falls to about 200-250 mg/dL, not at 540 mg/dL."],
      ["Give subcutaneous insulin glargine", "Basal insulin does not replace an IV insulin infusion for DKA and does not address the hypokalemia."],
    ],
    correct: "a",
    rationale: "This patient has DKA with an anion gap of 26 and severe metabolic acidosis. Total body potassium is depleted despite acidosis, and insulin will drive potassium into cells. Current guidelines recommend withholding insulin and replacing potassium when the serum level is below 3.3 mEq/L. Once potassium is at least 3.3, an insulin infusion is started, while potassium is added to IV fluids to keep levels between 4 and 5 mEq/L.",
    extras: {
      whyCorrect: "Potassium 3.0 must be corrected before insulin.",
      strategy: "In DKA always check potassium before insulin: <3.3 replete first.",
      keyTakeaway: "DKA order: fluids → check K → insulin (if K ≥3.3) → add dextrose when glucose ~250.",
      relatedTopics: ["Anion gap", "Hyperosmolar hyperglycemic state", "Hypokalemia"],
    },
    tags: ["lab-based"],
  }),
  choice({
    exam: "usmle-step-2-ck", subject: "Internal Medicine", system: "Hematological", topic: "Heparin-induced thrombocytopenia", difficulty: "difficult",
    stem: "A 66-year-old man is on day 7 of subcutaneous unfractionated heparin after knee replacement. His platelet count has fallen from 260,000/mm3 to 105,000/mm3, and he has new left calf swelling. Duplex ultrasound shows a femoral vein thrombosis. Which is the most appropriate management?",
    options: [
      ["Stop heparin and start argatroban", "Suspected HIT with thrombosis requires stopping all heparin and starting a non-heparin anticoagulant."],
      ["Switch to enoxaparin", "LMWH cross-reacts with HIT antibodies and is contraindicated."],
      ["Continue heparin and transfuse platelets", "Platelet transfusion may worsen thrombosis in HIT and heparin must be stopped."],
      ["Start warfarin alone", "Warfarin alone in acute HIT can cause venous limb gangrene due to protein C depletion."],
      ["Place an inferior vena cava filter and stop anticoagulation", "Anticoagulation is needed; HIT is highly prothrombotic."],
    ],
    correct: "a",
    rationale: "A platelet fall of more than 50% 5-10 days after heparin exposure with new thrombosis gives a high pretest probability of heparin-induced thrombocytopenia. HIT is caused by IgG antibodies against platelet factor 4-heparin complexes that activate platelets and create a prothrombotic state. All heparin, including flushes and LMWH, must be stopped and a non-heparin anticoagulant such as argatroban, bivalirudin, fondaparinux or a DOAC started. Warfarin is started only after platelet recovery and with overlap.",
    extras: {
      whyCorrect: "Argatroban is a direct thrombin inhibitor suitable for HIT.",
      strategy: "Use the 4Ts: timing, thrombocytopenia, thrombosis, other causes.",
      keyTakeaway: "HIT: stop all heparin, start a non-heparin anticoagulant, no platelets, delay warfarin.",
      relatedTopics: ["4Ts score", "PF4 antibodies", "Direct thrombin inhibitors"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* USMLE Step 3                                                        */
/* ------------------------------------------------------------------ */
const STEP3: SeedQuestion[] = [
  choice({
    exam: "usmle-step-3", subject: "Biostatistics and Epidemiology", system: "Cardiovascular", topic: "Number needed to treat", difficulty: "moderate",
    stem: "In a randomized trial, major cardiovascular events occurred in 10% of patients receiving placebo and 6% of patients receiving a new lipid-lowering drug over 5 years. How many patients must be treated for 5 years to prevent one event?",
    options: [
      ["25", "ARR = 10% − 6% = 4%; NNT = 1 ÷ 0.04 = 25."],
      ["4", "4 is the absolute risk reduction expressed as a percentage, not the NNT."],
      ["40", "40% is the relative risk reduction (4/10), not the NNT."],
      ["17", "This would correspond to an ARR of about 6%."],
      ["10", "This would correspond to an ARR of 10%."],
    ],
    correct: "a",
    rationale: "Absolute risk reduction is the event rate in the control group minus that in the treatment group: 10% − 6% = 4%. The number needed to treat is the reciprocal of the ARR: 1 ÷ 0.04 = 25. The relative risk reduction (40%) sounds more impressive but does not convey absolute benefit. NNT must always be interpreted with its time frame.",
    extras: {
      whyCorrect: "1 ÷ 0.04 = 25.",
      strategy: "Convert percentages to decimals before taking the reciprocal.",
      keyTakeaway: "NNT = 1/ARR; always quote the time horizon.",
      relatedTopics: ["Relative risk reduction", "Number needed to harm", "Clinical trial interpretation"],
    },
  }),
  choice({
    exam: "usmle-step-3", subject: "Patient Safety", system: "Multisystem", topic: "Medical error disclosure", difficulty: "moderate",
    stem: "A hospitalized 72-year-old woman received a single dose of enoxaparin intended for another patient. She has no bleeding, and her laboratory values are unchanged after 6 hours. What is the most appropriate action by the attending physician?",
    options: [
      ["Disclose the error to the patient, apologize, and report it through the institution's safety reporting system", "Transparent disclosure and reporting are expected for all errors that reach the patient, regardless of harm."],
      ["Avoid telling the patient because no harm occurred", "Errors that reach the patient should be disclosed even if no harm results."],
      ["Ask the nurse involved to inform the patient", "The attending physician leads disclosure, often with team members present."],
      ["Document the error only in the progress notes", "Error reporting systems support system-level analysis and prevention."],
      ["Wait until discharge to discuss the event", "Disclosure should occur promptly once the patient is stable."],
    ],
    correct: "a",
    rationale: "Ethical and professional standards call for prompt, honest disclosure of errors that reach the patient, including an explanation, an apology and a description of the steps being taken. Reporting through the institutional safety system allows root-cause analysis to prevent recurrence. Withholding disclosure because no harm occurred undermines trust. Monitoring for delayed bleeding should continue.",
    extras: {
      whyCorrect: "Disclose, apologize and report is the standard response to an error reaching a patient.",
      strategy: "Choose options that are transparent and system-focused.",
      keyTakeaway: "Errors that reach the patient are disclosed and reported, harm or not.",
      relatedTopics: ["Root cause analysis", "Just culture", "Near misses"],
    },
  }),
  choice({
    exam: "usmle-step-3", subject: "Advanced Clinical Medicine", system: "Cardiovascular", topic: "Atrial fibrillation", difficulty: "moderate",
    stem: "A 71-year-old woman with hypertension has newly diagnosed nonvalvular atrial fibrillation, now rate-controlled on metoprolol. She has no history of stroke, diabetes, heart failure or vascular disease. Creatinine clearance is 68 mL/min and she has no bleeding history. What is the most appropriate long-term stroke prevention?",
    options: [
      ["Apixaban", "Her CHA2DS2-VASc score is 3 (age 65-74, female, hypertension), so oral anticoagulation is indicated and a DOAC is preferred."],
      ["Aspirin alone", "Aspirin is not recommended as stroke prevention in atrial fibrillation."],
      ["Aspirin plus clopidogrel", "Dual antiplatelet therapy is less effective than anticoagulation and still causes bleeding."],
      ["No antithrombotic therapy", "A score of 3 confers substantial stroke risk that warrants anticoagulation."],
      ["Enoxaparin indefinitely", "Long-term LMWH is not standard for nonvalvular AF."],
    ],
    correct: "a",
    rationale: "CHA2DS2-VASc estimates stroke risk in nonvalvular atrial fibrillation. This patient scores 3 points: age 65-74 (1), female sex (1) and hypertension (1). Oral anticoagulation is recommended for scores of 2 or more in men and 3 or more in women. Direct oral anticoagulants such as apixaban are preferred over warfarin because of lower intracranial hemorrhage risk, and antiplatelet therapy is not an adequate alternative.",
    extras: {
      whyCorrect: "CHA2DS2-VASc of 3 in a woman warrants a DOAC.",
      strategy: "Calculate the score explicitly, adding the sex point last.",
      keyTakeaway: "AF with CHA2DS2-VASc ≥2 (men) or ≥3 (women): DOAC preferred.",
      relatedTopics: ["HAS-BLED", "Rate vs rhythm control", "Left atrial appendage occlusion"],
    },
  }),
  choice({
    exam: "usmle-step-3", subject: "Foundations of Independent Practice", system: "Respiratory", topic: "Community-acquired pneumonia", difficulty: "moderate",
    stem: "A previously healthy 38-year-old man has 3 days of fever, productive cough and right basilar crackles. Chest radiograph shows a right lower lobe infiltrate. He has no comorbidities, no recent antibiotics and normal vital signs except a temperature of 38.4°C. Which outpatient regimen is most appropriate?",
    options: [
      ["Amoxicillin 1 g three times daily", "For healthy outpatients without risk factors, high-dose amoxicillin is a recommended first-line regimen."],
      ["Levofloxacin 750 mg daily", "Respiratory fluoroquinolones are reserved for patients with comorbidities or specific indications."],
      ["Ceftriaxone plus azithromycin intravenously", "This is an inpatient regimen."],
      ["Vancomycin plus piperacillin-tazobactam", "Broad MRSA and Pseudomonas coverage is not needed for low-risk outpatients."],
      ["No antibiotics; supportive care only", "Radiographically confirmed bacterial pneumonia requires antibiotic therapy."],
    ],
    correct: "a",
    rationale: "Current ATS/IDSA guidance recommends amoxicillin 1 g three times daily, doxycycline, or (where pneumococcal macrolide resistance is low) a macrolide for healthy outpatients with community-acquired pneumonia. Patients with comorbidities receive combination therapy or a respiratory fluoroquinolone. This patient is low risk and appropriate for outpatient care. Broad-spectrum and IV regimens are reserved for hospitalized or high-risk patients.",
    extras: {
      whyCorrect: "Healthy outpatient CAP → high-dose amoxicillin.",
      strategy: "Stratify by setting (outpatient vs inpatient) and comorbidities before choosing antibiotics.",
      keyTakeaway: "Outpatient CAP without comorbidities: amoxicillin, doxycycline or (if low resistance) a macrolide.",
      relatedTopics: ["CURB-65", "Pneumonia severity index", "Antibiotic stewardship"],
    },
  }),
  choice({
    exam: "usmle-step-3", subject: "Advanced Clinical Medicine", system: "Renal and Urinary", topic: "Hyperkalemia", difficulty: "difficult",
    stem: "A 63-year-old man with end-stage kidney disease missed two dialysis sessions. He feels weak. Serum potassium is 7.4 mEq/L, and the ECG shows peaked T waves and a widened QRS complex. What is the most appropriate first treatment?",
    options: [
      ["Intravenous calcium gluconate", "Calcium stabilizes the cardiac membrane within minutes and is the first step when ECG changes are present."],
      ["Intravenous regular insulin with dextrose", "Insulin shifts potassium into cells but takes longer and does not protect the myocardium immediately."],
      ["Oral sodium zirconium cyclosilicate", "Potassium binders act over hours and are not first-line for an emergency."],
      ["Intravenous furosemide", "A patient with end-stage kidney disease is unlikely to respond to loop diuretics."],
      ["Nebulized albuterol alone", "Albuterol shifts potassium but does not stabilize the membrane and is an adjunct."],
    ],
    correct: "a",
    rationale: "Hyperkalemia with ECG changes is a medical emergency because of the risk of ventricular arrhythmia and asystole. Intravenous calcium antagonizes the effect of potassium on the cardiac membrane within minutes but does not lower serum potassium. It is followed by measures that shift potassium into cells (insulin with dextrose, beta-agonists) and remove it from the body. In this patient, urgent hemodialysis is the definitive therapy.",
    extras: {
      whyCorrect: "Membrane stabilization is the immediate life-saving step.",
      strategy: "Order: stabilize (calcium) → shift (insulin, albuterol) → remove (dialysis, binders).",
      keyTakeaway: "Hyperkalemia with ECG changes: calcium first, then shift and remove potassium.",
      relatedTopics: ["ECG in hyperkalemia", "Hemodialysis", "Potassium binders"],
    },
    tags: ["priority"],
  }),
];

/* ------------------------------------------------------------------ */
/* COMLEX Level 1                                                      */
/* ------------------------------------------------------------------ */
const COMLEX1: SeedQuestion[] = [
  choice({
    exam: "comlex-level-1", subject: "Osteopathic Principles and Practice", system: "Musculoskeletal", topic: "Thoracic somatic dysfunction", difficulty: "difficult",
    stem: "A 30-year-old woman has mid-back pain. On structural examination the right transverse process of T6 is posterior. The asymmetry becomes more prominent when she extends the spine and resolves when she flexes. What is the correct diagnosis?",
    options: [
      ["T6 flexed, rotated right, sidebent right (T6 FRSR)", "Asymmetry that resolves in flexion and worsens in extension indicates a flexed segment; Type II mechanics couple rotation and sidebending to the same side."],
      ["T6 extended, rotated right, sidebent right (T6 ERSR)", "An extended segment would become symmetric in extension and worsen in flexion."],
      ["T6 neutral, sidebent left, rotated right", "Type I group curves involve multiple segments and do not change with flexion or extension in this way."],
      ["T6 flexed, rotated right, sidebent left", "Type II mechanics couple rotation and sidebending to the same side."],
      ["T6 extended, rotated left, sidebent left", "The posterior transverse process is on the right, indicating right rotation."],
    ],
    correct: "a",
    rationale: "In segmental (Type II) dysfunction, rotation and sidebending occur to the same side, and the segment is either flexed or extended. A posterior right transverse process indicates right rotation. If the asymmetry resolves in flexion, the segment is already 'stuck' in flexion and restricted in extension. The diagnosis is therefore T6 FRSR.",
    extras: {
      whyCorrect: "Symmetry in flexion means the segment is flexed; right posterior TP means right rotation.",
      strategy: "The position in which the asymmetry disappears names the dysfunction.",
      keyTakeaway: "Type II: single segment, same-side rotation and sidebending, flexed or extended.",
      relatedTopics: ["Fryette's principles", "Muscle energy", "Type I group curves"],
    },
  }),
  choice({
    exam: "comlex-level-1", subject: "Osteopathic Principles and Practice", system: "Musculoskeletal", topic: "Counterstrain", difficulty: "easy",
    stem: "A physician treats a tender point with counterstrain. After placing the patient in the position that reduces tenderness by at least 70%, how long should the position be held before slowly returning the patient to neutral?",
    options: [
      ["90 seconds", "Counterstrain positions are held for 90 seconds (longer for some rib tender points) to reset aberrant proprioceptive activity."],
      ["3-5 seconds", "This duration is used for each isometric contraction in muscle energy technique."],
      ["15 seconds", "This is too brief for the neuromuscular reset counterstrain requires."],
      ["5 minutes", "Counterstrain does not require prolonged holds of this length."],
      ["Until a 'pop' is felt", "A cavitation is associated with HVLA, not counterstrain."],
    ],
    correct: "a",
    rationale: "Counterstrain is an indirect, passive technique that places the body in a position of ease to relieve a tender point. The position should reduce tenderness by at least 70% and is held for 90 seconds. The patient is then returned slowly and passively to neutral, because rapid movement can re-trigger the dysfunction. The tender point is rechecked afterward.",
    extras: {
      whyCorrect: "The standard counterstrain hold is 90 seconds.",
      strategy: "Associate each OMT technique with its signature parameter: counterstrain = 90 seconds, muscle energy = 3-5 second contractions.",
      keyTakeaway: "Counterstrain: position of ease, ≥70% reduction, hold 90 seconds, return slowly.",
      relatedTopics: ["Jones tender points", "Indirect techniques", "Facilitated positional release"],
    },
  }),
  choice({
    exam: "comlex-level-1", subject: "Foundational Biomedical Sciences", system: "Hematological", topic: "Megaloblastic anemia", difficulty: "moderate",
    stem: "A 62-year-old woman with long-standing autoimmune thyroid disease has fatigue and numbness in both feet with decreased vibration sense. Laboratory results are shown. Which diagnosis best explains her findings?",
    patient: {
      age: "62", gender: "Female", history: "Hashimoto thyroiditis",
      labs: [
        { name: "Hemoglobin", value: "9.6", unit: "g/dL", range: "12.0-16.0", flag: "L" },
        { name: "MCV", value: "114", unit: "fL", range: "80-100", flag: "H" },
        { name: "Methylmalonic acid", value: "1.2", unit: "µmol/L", range: "<0.4", flag: "H" },
        { name: "Homocysteine", value: "28", unit: "µmol/L", range: "<15", flag: "H" },
        { name: "Serum folate", value: "12", unit: "ng/mL", range: ">4" },
      ],
    },
    options: [
      ["Vitamin B12 deficiency due to pernicious anemia", "Elevated MMA and homocysteine with neuropathy in a patient with autoimmune disease indicate B12 deficiency, classically from pernicious anemia."],
      ["Folate deficiency", "Folate deficiency raises homocysteine but not methylmalonic acid, and it does not cause neuropathy; folate is normal."],
      ["Iron deficiency anemia", "Iron deficiency produces microcytosis."],
      ["Anemia of chronic disease", "This is usually normocytic and does not raise MMA."],
      ["Hypothyroidism-related macrocytosis", "Hypothyroidism can cause mild macrocytosis but not raised MMA or posterior column signs."],
    ],
    correct: "a",
    rationale: "Vitamin B12 is a cofactor for methylmalonyl-CoA mutase and methionine synthase, so deficiency raises both methylmalonic acid and homocysteine. Folate deficiency raises only homocysteine. B12 deficiency also causes subacute combined degeneration of the dorsal columns and corticospinal tracts, producing loss of vibration and position sense. Pernicious anemia, an autoimmune loss of intrinsic factor, often coexists with other autoimmune conditions such as Hashimoto thyroiditis.",
    extras: {
      whyCorrect: "Raised MMA distinguishes B12 from folate deficiency.",
      strategy: "MMA up = B12; homocysteine alone up = folate.",
      keyTakeaway: "B12 deficiency: macrocytosis, high MMA and homocysteine, dorsal column signs.",
      relatedTopics: ["Subacute combined degeneration", "Intrinsic factor antibodies", "Megaloblastic anemia"],
    },
    tags: ["lab-based"],
  }),
  choice({
    exam: "comlex-level-1", subject: "Health Promotion", system: "Immune", topic: "HPV vaccination", difficulty: "easy",
    stem: "A 20-year-old college student has never received any HPV vaccine doses. She asks whether she is still eligible. Which statement is most accurate?",
    options: [
      ["Routine catch-up HPV vaccination is recommended for everyone through age 26 who was not adequately vaccinated", "Catch-up vaccination is recommended through age 26; she should start the series now."],
      ["HPV vaccine is only recommended for ages 11-12", "Routine vaccination is at 11-12 years, but catch-up continues through age 26."],
      ["She should be vaccinated only if her HPV test is negative", "Testing is not required before vaccination."],
      ["Vaccination is not recommended once a person is sexually active", "Sexually active people can still benefit from protection against types not yet acquired."],
      ["A single dose is sufficient because she is over 15", "Under current US guidance, people starting at age 15 or older receive a 3-dose series."],
    ],
    correct: "a",
    rationale: "HPV vaccination is routinely recommended at age 11 or 12 and may begin as early as age 9. Catch-up vaccination is recommended for all people through age 26 who were not adequately vaccinated. Under current US guidance, those starting at age 15 or later receive three doses. Prior sexual activity or a lack of HPV testing is not a reason to defer vaccination.",
    extras: {
      whyCorrect: "Catch-up vaccination extends through age 26.",
      strategy: "Know the routine age, earliest age and catch-up ceiling for each adolescent vaccine.",
      keyTakeaway: "HPV: routine 11-12, catch-up through 26; shared decision-making 27-45.",
      relatedTopics: ["Cervical cancer prevention", "Adolescent immunizations", "HPV types 16 and 18"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* COMLEX Level 2-CE                                                   */
/* ------------------------------------------------------------------ */
const COMLEX2: SeedQuestion[] = [
  choice({
    exam: "comlex-level-2", subject: "Osteopathic Principles and Practice", system: "Musculoskeletal", topic: "OMT contraindications", difficulty: "moderate",
    stem: "Which patient has an absolute contraindication to high-velocity, low-amplitude (HVLA) treatment of the cervical spine?",
    options: [
      ["A 58-year-old with long-standing rheumatoid arthritis and atlantoaxial instability on flexion-extension films", "Atlantoaxial instability in RA risks cord injury; cervical HVLA is absolutely contraindicated."],
      ["A 25-year-old with acute neck strain and a C3 somatic dysfunction", "Uncomplicated somatic dysfunction may be treated with HVLA when appropriate."],
      ["A 40-year-old with tension-type headaches", "Tension headaches are not a contraindication to cervical HVLA."],
      ["A 33-year-old with chronic neck pain from desk work", "Chronic mechanical neck pain is not a contraindication."],
      ["A 47-year-old with mild cervical paraspinal hypertonicity", "Hypertonicity alone is not a contraindication."],
    ],
    correct: "a",
    rationale: "HVLA applies a quick thrust through a restrictive barrier and is contraindicated when the integrity of the spine or vertebral arteries is compromised. Rheumatoid arthritis can erode the transverse ligament and dens, causing atlantoaxial instability that a thrust could convert into cord compression. Down syndrome, fractures, metastatic disease and severe osteoporosis are similar concerns. Indirect or soft-tissue techniques may be used instead.",
    extras: {
      whyCorrect: "Ligamentous instability at C1-C2 makes a cervical thrust dangerous.",
      strategy: "Look for conditions that weaken bone, ligament or vessel integrity.",
      keyTakeaway: "No cervical HVLA with RA, Down syndrome, fracture, malignancy or severe osteoporosis.",
      relatedTopics: ["Rheumatoid arthritis", "Vertebral artery dissection", "Indirect OMT"],
    },
  }),
  choice({
    exam: "comlex-level-2", subject: "Women's Health", system: "Endocrine", topic: "Hyperthyroidism in pregnancy", difficulty: "moderate",
    stem: "A 27-year-old woman at 9 weeks' gestation has palpitations, heat intolerance and weight loss. TSH is suppressed, free T4 is markedly elevated and TSH receptor antibodies are positive. Which treatment is most appropriate now?",
    options: [
      ["Propylthiouracil", "PTU is preferred in the first trimester because methimazole is associated with embryopathy."],
      ["Methimazole", "Methimazole is avoided in the first trimester and is preferred from the second trimester onward."],
      ["Radioactive iodine ablation", "Radioactive iodine is contraindicated in pregnancy because it destroys the fetal thyroid."],
      ["Total thyroidectomy immediately", "Surgery, if needed, is preferred in the second trimester and is not first-line."],
      ["Levothyroxine", "Levothyroxine would worsen hyperthyroidism."],
    ],
    correct: "a",
    rationale: "Graves disease in pregnancy is treated with antithyroid drugs at the lowest effective dose. Propylthiouracil is preferred during the first trimester because methimazole exposure during organogenesis is associated with aplasia cutis and other anomalies. After the first trimester, many clinicians switch to methimazole because PTU carries a risk of severe hepatotoxicity. Radioactive iodine is contraindicated in pregnancy.",
    extras: {
      whyCorrect: "First trimester → PTU to avoid methimazole embryopathy.",
      strategy: "Use trimester to choose between PTU and methimazole.",
      keyTakeaway: "Graves in pregnancy: PTU in the first trimester, methimazole afterward.",
      relatedTopics: ["Gestational transient thyrotoxicosis", "Neonatal Graves disease", "PTU hepatotoxicity"],
    },
  }),
  choice({
    exam: "comlex-level-2", subject: "Surgery", system: "Gastrointestinal", topic: "Small bowel obstruction", difficulty: "moderate",
    stem: "A 55-year-old man with a prior open appendectomy has 18 hours of crampy abdominal pain, vomiting and no flatus. He is afebrile with a heart rate of 92/min. The abdomen is distended with high-pitched bowel sounds and mild diffuse tenderness without guarding. CT shows dilated small bowel loops with a transition point and no signs of ischemia. Lactate is normal. What is the most appropriate initial management?",
    options: [
      ["Nothing by mouth, nasogastric decompression and IV fluids", "Partial or uncomplicated adhesive SBO without ischemia is initially managed nonoperatively."],
      ["Immediate exploratory laparotomy", "Surgery is indicated for peritonitis, ischemia, strangulation or failure of conservative management."],
      ["High-dose oral laxatives", "Laxatives are contraindicated in mechanical obstruction."],
      ["Colonoscopic decompression", "Colonoscopic decompression is used for colonic pseudo-obstruction or volvulus, not small bowel obstruction."],
      ["Discharge with oral analgesics", "SBO requires inpatient management."],
    ],
    correct: "a",
    rationale: "Adhesions from prior surgery are the most common cause of small bowel obstruction in adults. Without signs of strangulation such as fever, peritonitis, rising lactate or CT evidence of ischemia, initial management is bowel rest, nasogastric decompression, IV fluids and electrolyte correction. Water-soluble contrast studies can help predict resolution. Surgery is required if the patient deteriorates or the obstruction fails to resolve.",
    extras: {
      whyCorrect: "Uncomplicated adhesive SBO is managed conservatively at first.",
      strategy: "Look for signs of ischemia; their absence favors nonoperative care.",
      keyTakeaway: "Adhesive SBO: NPO, NG tube, IV fluids; operate for ischemia or failure to resolve.",
      relatedTopics: ["Closed-loop obstruction", "Water-soluble contrast challenge", "Hernias"],
    },
  }),
  choice({
    exam: "comlex-level-2", subject: "Pediatrics", system: "Gastrointestinal", topic: "Pyloric stenosis", difficulty: "moderate",
    stem: "A 5-week-old firstborn boy has had progressively forceful nonbilious vomiting after every feed for 1 week and remains hungry afterward. He has dry mucous membranes. Ultrasound shows a thickened, elongated pylorus. Electrolytes show sodium 133 mEq/L, potassium 3.0 mEq/L, chloride 88 mEq/L and bicarbonate 34 mEq/L. What is the most appropriate next step?",
    options: [
      ["IV fluid resuscitation with correction of electrolytes before surgery", "The hypochloremic, hypokalemic metabolic alkalosis must be corrected before anesthesia and pyloromyotomy."],
      ["Immediate pyloromyotomy", "Operating before correcting alkalosis increases the risk of postoperative apnea."],
      ["Upper GI contrast study", "The ultrasound has already confirmed the diagnosis."],
      ["Thicken feeds and continue observation", "Pyloric stenosis requires surgical correction."],
      ["Start a proton pump inhibitor", "Acid suppression does not relieve gastric outlet obstruction."],
    ],
    correct: "a",
    rationale: "Hypertrophic pyloric stenosis causes repeated loss of gastric acid, producing hypochloremic, hypokalemic metabolic alkalosis and dehydration. Metabolic alkalosis increases the risk of postoperative apnea, so fluid and electrolyte deficits are corrected first. Pyloromyotomy is performed once electrolytes normalize. Ultrasound is the diagnostic test of choice.",
    extras: {
      whyCorrect: "Electrolyte correction is the necessary first step before surgery.",
      strategy: "'Next step' in pyloric stenosis is resuscitation, not surgery.",
      keyTakeaway: "Pyloric stenosis: hypochloremic hypokalemic alkalosis; correct, then pyloromyotomy.",
      relatedTopics: ["Olive-shaped mass", "Metabolic alkalosis", "Malrotation with volvulus"],
    },
    tags: ["lab-based"],
  }),
];

/* ------------------------------------------------------------------ */
/* UKMLA                                                               */
/* ------------------------------------------------------------------ */
const UKMLA: SeedQuestion[] = [
  choice({
    exam: "ukmla", subject: "Acute and Emergency", system: "Respiratory", topic: "Acute severe asthma", difficulty: "moderate",
    stem: "A 24-year-old woman with asthma presents to the emergency department unable to complete sentences. Respiratory rate is 28/min, heart rate 118/min, SpO2 92% on air, and peak flow is 45% of her best. Oxygen has been started. Which medication should be given next?",
    options: [
      ["Nebulised salbutamol 5 mg (oxygen-driven)", "High-dose inhaled short-acting beta-2 agonist is first-line for acute severe asthma."],
      ["Intravenous aminophylline", "Aminophylline is considered only after senior review when initial therapy fails."],
      ["Oral montelukast", "Leukotriene antagonists have no role in acute severe asthma."],
      ["Inhaled salmeterol", "Long-acting beta-agonists are not used for acute relief."],
      ["Intravenous magnesium sulfate as the first drug", "IV magnesium is an add-on for acute severe or life-threatening asthma not responding to initial bronchodilators."],
    ],
    correct: "a",
    rationale: "Inability to complete sentences, heart rate ≥110/min, respiratory rate ≥25/min and peak flow 33-50% of best indicate acute severe asthma. Initial treatment is controlled oxygen to a target of 94-98%, high-dose nebulised salbutamol, and oral prednisolone or IV hydrocortisone. Nebulised ipratropium is added for severe or poorly responsive attacks. IV magnesium and aminophylline are reserved for those not responding to initial therapy.",
    extras: {
      whyCorrect: "Inhaled salbutamol is the immediate bronchodilator of choice.",
      strategy: "Grade severity using the stated features, then apply the stepwise algorithm.",
      keyTakeaway: "Acute severe asthma: O2, nebulised salbutamol, steroids; add ipratropium, then magnesium.",
      relatedTopics: ["Life-threatening asthma", "Peak flow", "Asthma discharge criteria"],
    },
  }),
  choice({
    exam: "ukmla", subject: "Cardiovascular", system: "Cardiovascular", topic: "Hypertension", difficulty: "moderate",
    stem: "A 61-year-old man of white British background has stage 2 hypertension confirmed by ambulatory monitoring. He does not have diabetes or chronic kidney disease. According to NICE guidance, which antihypertensive should be offered first?",
    options: [
      ["Amlodipine", "NICE recommends a calcium channel blocker as step 1 for adults aged 55 or over without type 2 diabetes."],
      ["Ramipril", "An ACE inhibitor is step 1 for adults under 55 or those with type 2 diabetes."],
      ["Bendroflumethiazide", "NICE prefers thiazide-like diuretics (indapamide) when a diuretic is used, and not as the routine first step here."],
      ["Bisoprolol", "Beta-blockers are not first-line for uncomplicated hypertension."],
      ["Spironolactone", "Spironolactone is considered at step 4 for resistant hypertension."],
    ],
    correct: "a",
    rationale: "NICE NG136 recommends a calcium channel blocker as first-line therapy for adults aged 55 or over and for people of Black African or African-Caribbean family origin, provided they do not have type 2 diabetes. ACE inhibitors or ARBs are first-line for those under 55 or with type 2 diabetes. If a CCB is unsuitable, a thiazide-like diuretic can be offered. Beta-blockers are not routine first-line therapy.",
    extras: {
      whyCorrect: "Age ≥55 without diabetes → CCB first.",
      strategy: "Apply NICE's age/diabetes/ethnicity split before choosing a drug.",
      keyTakeaway: "NICE step 1: ACEi/ARB if <55 or T2DM; CCB if ≥55 or Black African/Caribbean without T2DM.",
      relatedTopics: ["ABPM", "Resistant hypertension", "Thiazide-like diuretics"],
    },
  }),
  choice({
    exam: "ukmla", subject: "Medicine of Older Adults", system: "Neurological", topic: "Delirium", difficulty: "easy",
    stem: "An 84-year-old woman admitted with a urinary tract infection is newly confused and drowsy, according to her daughter. Which tool is most appropriate for rapid assessment of possible delirium on the ward?",
    options: [
      ["4AT", "The 4AT is a brief, validated delirium screening tool designed for routine clinical use."],
      ["Mini-Mental State Examination", "The MMSE assesses cognitive impairment but does not distinguish delirium from dementia."],
      ["Montreal Cognitive Assessment", "MoCA screens for mild cognitive impairment, not delirium."],
      ["Glasgow Coma Scale", "GCS assesses consciousness level but not inattention or acute change."],
      ["PHQ-9", "PHQ-9 screens for depression."],
    ],
    correct: "a",
    rationale: "Delirium is an acute, fluctuating disturbance of attention and awareness, often triggered by infection, medications or metabolic disturbance. The 4AT assesses alertness, orientation (AMT4), attention (months backward) and acute change or fluctuating course, and takes about 2 minutes. It can be used in drowsy or agitated patients. A positive screen should prompt a search for and treatment of underlying causes.",
    extras: {
      whyCorrect: "The 4AT is purpose-built for rapid delirium detection.",
      strategy: "Match the tool to the condition: delirium tools test attention and acute change.",
      keyTakeaway: "Screen for delirium with the 4AT; treat the cause and use non-drug measures first.",
      relatedTopics: ["Hypoactive delirium", "Dementia", "Confusion screening"],
    },
  }),
  choice({
    exam: "ukmla", subject: "Clinical Pharmacology", system: "Psychiatric", topic: "Lithium toxicity", difficulty: "moderate",
    stem: "A 52-year-old man with bipolar disorder stable on lithium started regular ibuprofen for knee pain 10 days ago. He now has vomiting, diarrhoea, a coarse tremor and ataxia. What is the most appropriate immediate action?",
    options: [
      ["Withhold lithium and check serum lithium level, renal function and electrolytes urgently", "Suspected toxicity requires stopping lithium and urgent measurement of the level and renal function."],
      ["Increase the lithium dose to control mood", "Increasing the dose would worsen toxicity."],
      ["Add propranolol for the tremor and continue lithium", "A coarse tremor with GI and cerebellar signs indicates toxicity, not a benign fine tremor."],
      ["Switch ibuprofen to naproxen", "All NSAIDs can reduce lithium clearance."],
      ["Give activated charcoal", "Lithium is not adsorbed by activated charcoal."],
    ],
    correct: "a",
    rationale: "NSAIDs reduce renal lithium clearance and can precipitate toxicity, as can ACE inhibitors, diuretics and dehydration. Coarse tremor, vomiting, diarrhoea and ataxia are signs of lithium toxicity, which can progress to confusion, seizures and arrhythmias. Lithium should be withheld and serum level, U&Es and an ECG obtained urgently, with IV fluids and haemodialysis for severe toxicity. Levels are normally checked 12 hours after the last dose.",
    extras: {
      whyCorrect: "Stopping lithium and measuring levels addresses suspected toxicity safely.",
      strategy: "Fine tremor = therapeutic side effect; coarse tremor with GI/neuro signs = toxicity.",
      keyTakeaway: "NSAIDs, ACE inhibitors, diuretics and dehydration raise lithium levels.",
      relatedTopics: ["Therapeutic drug monitoring", "Nephrogenic diabetes insipidus", "Haemodialysis"],
    },
  }),
  choice({
    exam: "ukmla", subject: "Child Health", system: "Neurological", topic: "Meningococcal disease", difficulty: "moderate",
    stem: "A GP sees a 3-year-old with a 6-hour history of fever, lethargy and cold hands. There is a purpuric, non-blanching rash on the legs. The nearest hospital is 25 minutes away and an ambulance has been called. What should the GP do while awaiting transfer?",
    options: [
      ["Give intramuscular or intravenous benzylpenicillin without delaying transfer", "Suspected meningococcal disease in primary care warrants parenteral benzylpenicillin as long as it does not delay transfer."],
      ["Perform a lumbar puncture in the surgery", "Lumbar puncture is not done in primary care and is often deferred in septic, unstable children."],
      ["Prescribe oral amoxicillin and review in 24 hours", "This is dangerously inadequate for suspected meningococcal sepsis."],
      ["Arrange an urgent outpatient blood test", "The child needs emergency hospital care, not outpatient testing."],
      ["Withhold antibiotics until blood cultures are taken", "Antibiotics should not be delayed in primary care to obtain cultures."],
    ],
    correct: "a",
    rationale: "A non-blanching rash in a febrile, unwell child suggests meningococcal septicaemia, which can deteriorate rapidly. NICE advises that in primary care, parenteral benzylpenicillin be given to suspected cases as soon as possible, provided it does not delay urgent transfer to hospital. In hospital, IV ceftriaxone is typically used. Cold extremities and lethargy are early signs of shock.",
    extras: {
      whyCorrect: "Early parenteral antibiotics reduce mortality in meningococcal disease.",
      strategy: "Non-blanching rash + fever = treat as meningococcal disease immediately.",
      keyTakeaway: "Suspected meningococcal disease in primary care: give benzylpenicillin and transfer urgently.",
      relatedTopics: ["Sepsis in children", "Bacterial meningitis", "Public health notification"],
    },
    tags: ["priority"],
  }),
];

/* ------------------------------------------------------------------ */
/* PLAB 1                                                              */
/* ------------------------------------------------------------------ */
const PLAB: SeedQuestion[] = [
  choice({
    exam: "plab", subject: "Ethics and Law", system: "Reproductive", topic: "Consent in young people", difficulty: "moderate",
    stem: "A 15-year-old girl attends her GP requesting the combined oral contraceptive pill. She is in a relationship with a 16-year-old and does not want her parents told. She understands the advice and risks, and the GP has tried to persuade her to involve her parents. There are no safeguarding concerns. What is the most appropriate action?",
    options: [
      ["Prescribe contraception if the Fraser criteria are met, maintaining confidentiality", "Under Fraser guidance, contraception can be provided to under-16s who meet the criteria, with confidentiality respected."],
      ["Refuse to prescribe until she turns 16", "Age alone does not prevent prescribing if she is competent and the criteria are met."],
      ["Inform her parents before prescribing", "Breaching confidentiality without safeguarding concerns is not justified."],
      ["Report the relationship to the police", "There are no safeguarding concerns requiring police involvement."],
      ["Refer her to a gynaecologist for a decision", "The GP can make this decision."],
    ],
    correct: "a",
    rationale: "Young people under 16 can consent to treatment if they are Gillick competent. For contraception, the Fraser criteria apply: she understands the advice, cannot be persuaded to involve her parents, is likely to continue sexual activity, her health may suffer without contraception and it is in her best interests. Confidentiality should be maintained unless there is a risk of serious harm. Safeguarding should always be considered, especially with significant age gaps or signs of exploitation.",
    extras: {
      whyCorrect: "She meets Fraser criteria and there are no safeguarding concerns.",
      strategy: "In UK ethics questions, check competence, then confidentiality, then safeguarding.",
      keyTakeaway: "Fraser criteria permit confidential contraception for competent under-16s.",
      relatedTopics: ["Gillick competence", "Confidentiality", "Safeguarding"],
    },
  }),
  choice({
    exam: "plab", subject: "Acute Medicine", system: "Respiratory", topic: "Pulmonary embolism", difficulty: "moderate",
    stem: "A 45-year-old woman develops pleuritic chest pain and breathlessness 10 days after a long-haul flight. Heart rate is 112/min and SpO2 93% on air. Her two-level Wells score for PE is 6. She is haemodynamically stable with normal renal function. What is the most appropriate next step?",
    options: [
      ["Arrange a CT pulmonary angiogram, giving interim anticoagulation if there will be a delay", "With a 'PE likely' Wells score (>4), NICE recommends immediate CTPA with interim anticoagulation if delayed."],
      ["Measure D-dimer and discharge if negative", "D-dimer is used when the Wells score is 4 or less."],
      ["Give thrombolysis immediately", "Thrombolysis is reserved for PE with haemodynamic instability."],
      ["Request a chest X-ray and discharge if normal", "A normal chest X-ray does not exclude PE."],
      ["Start aspirin and review in clinic", "Aspirin is not treatment for suspected PE."],
    ],
    correct: "a",
    rationale: "A two-level Wells score above 4 means PE is likely. NICE recommends an immediate CT pulmonary angiogram, with interim therapeutic anticoagulation if imaging is delayed. D-dimer testing is appropriate only when PE is unlikely (score 4 or less). Thrombolysis is reserved for massive PE with haemodynamic instability.",
    extras: {
      whyCorrect: "Wells >4 → CTPA ± interim anticoagulation.",
      strategy: "Wells score determines D-dimer versus direct imaging.",
      keyTakeaway: "PE likely: CTPA; PE unlikely: D-dimer first.",
      relatedTopics: ["Wells score", "DOACs", "Massive PE"],
    },
  }),
  choice({
    exam: "plab", subject: "General Practice", system: "Cardiovascular", topic: "Hypertension diagnosis", difficulty: "easy",
    stem: "A 50-year-old man has a clinic blood pressure of 152/94 mm Hg, confirmed on a second reading. He is asymptomatic with no signs of target organ damage. What is the most appropriate next step to confirm the diagnosis?",
    options: [
      ["Offer ambulatory blood pressure monitoring", "NICE recommends ABPM to confirm hypertension when clinic BP is 140/90 to 180/120 mm Hg."],
      ["Start amlodipine immediately", "Treatment should follow confirmation unless BP is very high or there is target organ damage."],
      ["Repeat the clinic reading in 1 year", "This delays diagnosis of probable hypertension."],
      ["Refer urgently to a cardiologist", "Urgent referral is for suspected accelerated hypertension or emergencies."],
      ["Arrange an echocardiogram", "Echocardiography is not used to diagnose hypertension."],
    ],
    correct: "a",
    rationale: "NICE guidance recommends confirming a clinic reading between 140/90 and 180/120 mm Hg with ambulatory blood pressure monitoring, or home monitoring if ABPM is unsuitable. This identifies white-coat hypertension and avoids unnecessary treatment. Baseline investigations for target organ damage and cardiovascular risk assessment should be performed at the same time. Immediate treatment is considered only for very high readings or evidence of target organ damage.",
    extras: {
      whyCorrect: "ABPM is the recommended confirmatory test.",
      strategy: "Diagnosis before treatment unless the scenario signals an emergency.",
      keyTakeaway: "Clinic BP 140/90-180/120: confirm with ABPM (or HBPM).",
      relatedTopics: ["White-coat hypertension", "QRISK3", "Target organ damage"],
    },
  }),
  choice({
    exam: "plab", subject: "Obstetrics and Gynaecology", system: "Reproductive", topic: "Ectopic pregnancy", difficulty: "moderate",
    stem: "A 28-year-old woman with 7 weeks of amenorrhoea collapses at home with severe lower abdominal pain and shoulder-tip pain. In A&E, her heart rate is 128/min and blood pressure 78/45 mm Hg. Urine pregnancy test is positive, and bedside ultrasound shows free fluid in the pelvis. IV access and resuscitation have begun. What is the definitive management?",
    options: [
      ["Urgent surgical management, typically laparoscopic salpingectomy", "Haemodynamic instability from a suspected ruptured ectopic pregnancy requires emergency surgery."],
      ["Intramuscular methotrexate", "Methotrexate is only for stable patients meeting strict criteria."],
      ["Expectant management with repeat hCG in 48 hours", "Expectant management is unsafe in a shocked patient."],
      ["Transvaginal ultrasound in the next routine clinic", "Delay is dangerous; she needs immediate surgery."],
      ["Uterine evacuation", "The pregnancy is not intrauterine."],
    ],
    correct: "a",
    rationale: "A positive pregnancy test, abdominal pain, shoulder-tip pain from diaphragmatic irritation and shock with pelvic free fluid indicate a ruptured ectopic pregnancy. Resuscitation and urgent surgical management are required. Laparoscopy is preferred where feasible, with salpingectomy usually performed when the contralateral tube is healthy. Methotrexate and expectant management are options only for stable patients.",
    extras: {
      whyCorrect: "Shock from rupture demands surgery.",
      strategy: "Unstable = surgery; stable = consider medical or expectant management by criteria.",
      keyTakeaway: "Ruptured ectopic with shock: resuscitate and operate.",
      relatedTopics: ["Methotrexate criteria", "Anti-D prophylaxis", "Pregnancy of unknown location"],
    },
    tags: ["priority"],
  }),
  choice({
    exam: "plab", subject: "Paediatrics", system: "Gastrointestinal", topic: "Intussusception", difficulty: "easy",
    stem: "A 9-month-old boy has episodes of inconsolable crying during which he draws his legs up, with pallor between episodes. He has vomited twice and passed a stool mixed with blood and mucus. A sausage-shaped mass is palpable in the right upper abdomen. What is the investigation of choice?",
    options: [
      ["Abdominal ultrasound", "Ultrasound showing a 'target' or 'doughnut' sign is the investigation of choice for intussusception."],
      ["Abdominal CT", "CT involves radiation and is not first-line in children."],
      ["Barium swallow", "A barium swallow images the upper GI tract and is not used here."],
      ["Stool culture", "Stool culture does not diagnose intussusception."],
      ["Colonoscopy", "Colonoscopy is not used to diagnose intussusception in infants."],
    ],
    correct: "a",
    rationale: "Intussusception is the telescoping of one bowel segment into another, most commonly ileocolic, and peaks between 6 and 18 months. It causes colicky pain with drawing up of the legs, vomiting, 'redcurrant jelly' stool and a sausage-shaped mass. Ultrasound is highly sensitive and specific and shows a target sign. Stable children are treated with pneumatic (air) enema reduction, and surgery is required for perforation or failed reduction.",
    extras: {
      whyCorrect: "Ultrasound is accurate, quick and radiation-free.",
      strategy: "In children, prefer imaging without radiation when accurate.",
      keyTakeaway: "Intussusception: ultrasound to diagnose, air enema to reduce.",
      relatedTopics: ["Meckel diverticulum", "Pneumatic reduction", "Volvulus"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* ABIM Internal Medicine                                              */
/* ------------------------------------------------------------------ */
const ABIM: SeedQuestion[] = [
  choice({
    exam: "abim", subject: "Cardiovascular Disease", system: "Cardiovascular", topic: "Heart failure with reduced ejection fraction", difficulty: "moderate",
    stem: "A 63-year-old man with ischemic cardiomyopathy (LVEF 30%) has NYHA class II symptoms. He takes sacubitril-valsartan, carvedilol and spironolactone at target doses. Blood pressure is 112/70 mm Hg, potassium 4.6 mEq/L and eGFR 58 mL/min/1.73 m2. Which addition is most likely to reduce his risk of cardiovascular death or heart failure hospitalization?",
    options: [
      ["Dapagliflozin", "SGLT2 inhibitors reduce cardiovascular death and HF hospitalization in HFrEF regardless of diabetes status."],
      ["Diltiazem", "Non-dihydropyridine calcium channel blockers are harmful in HFrEF."],
      ["Cilostazol", "Cilostazol is contraindicated in heart failure."],
      ["Dronedarone", "Dronedarone increases mortality in patients with recent decompensated or advanced HF."],
      ["Nifedipine", "Dihydropyridines other than amlodipine/felodipine have no benefit and may worsen HF."],
    ],
    correct: "a",
    rationale: "Guideline-directed medical therapy for HFrEF rests on four drug classes: an ARNI (or ACE inhibitor/ARB), an evidence-based beta-blocker, a mineralocorticoid receptor antagonist and an SGLT2 inhibitor. This patient is missing only the SGLT2 inhibitor. Dapagliflozin and empagliflozin reduce cardiovascular death and HF hospitalization in patients with and without diabetes. Non-dihydropyridine calcium channel blockers, cilostazol and dronedarone should be avoided in HFrEF.",
    extras: {
      whyCorrect: "SGLT2 inhibitors are the fourth pillar of HFrEF therapy.",
      strategy: "Check which of the four pillars is missing.",
      keyTakeaway: "HFrEF: ARNI, beta-blocker, MRA and SGLT2 inhibitor.",
      relatedTopics: ["ICD/CRT indications", "Drugs to avoid in HF", "Sacubitril-valsartan"],
    },
  }),
  choice({
    exam: "abim", subject: "Endocrinology", system: "Endocrine", topic: "Adrenal incidentaloma", difficulty: "moderate",
    stem: "A 54-year-old woman has a 2.4-cm left adrenal mass found on CT for abdominal pain. It is homogeneous with an attenuation of 6 Hounsfield units. She is normotensive with normal potassium and has no cushingoid features. Which evaluation is most appropriate?",
    options: [
      ["1-mg overnight dexamethasone suppression test and plasma free metanephrines", "All incidentalomas need screening for autonomous cortisol secretion; metanephrine testing is advised when imaging is not clearly benign or when clinically indicated."],
      ["Immediate adrenalectomy", "Surgery is not indicated for a small, benign-appearing, nonfunctional adenoma."],
      ["CT-guided adrenal biopsy", "Biopsy is rarely indicated and is unsafe before excluding pheochromocytoma."],
      ["No further evaluation", "Functional testing is recommended even for benign-appearing lesions."],
      ["Serum ACTH stimulation test", "Cosyntropin stimulation evaluates adrenal insufficiency, not hormone excess."],
    ],
    correct: "a",
    rationale: "Adrenal incidentalomas are assessed for malignant potential and hormone secretion. A homogeneous lesion under 4 cm with attenuation of 10 HU or less is consistent with a benign lipid-rich adenoma. Every patient should have a 1-mg overnight dexamethasone suppression test to detect autonomous cortisol secretion, and aldosterone-renin testing is added when hypertension or hypokalemia is present. Pheochromocytoma screening with metanephrines is recommended when imaging is not clearly benign, and many clinicians still test routinely.",
    extras: {
      whyCorrect: "Functional evaluation for cortisol excess (and catecholamines) is the appropriate next step.",
      strategy: "Answer two questions for every adrenal mass: is it malignant, and is it functional?",
      keyTakeaway: "Incidentaloma: 1-mg DST for all; aldosterone/renin if hypertensive or hypokalemic; metanephrines as indicated.",
      relatedTopics: ["Mild autonomous cortisol secretion", "Pheochromocytoma", "Primary aldosteronism"],
    },
  }),
  choice({
    exam: "abim", subject: "Nephrology", system: "Renal and Urinary", topic: "Hyponatremia", difficulty: "difficult",
    stem: "A 70-year-old man with a 50-pack-year smoking history has mild fatigue. He appears euvolemic and takes no medications. Thyroid function and morning cortisol are normal. Laboratory results are shown. What is the most appropriate initial treatment?",
    patient: {
      age: "70", gender: "Male", history: "50-pack-year smoking history; recent chest CT shows a central lung mass",
      labs: [
        { name: "Serum sodium", value: "126", unit: "mEq/L", range: "135-145", flag: "L" },
        { name: "Serum osmolality", value: "262", unit: "mOsm/kg", range: "275-295", flag: "L" },
        { name: "Urine osmolality", value: "520", unit: "mOsm/kg" },
        { name: "Urine sodium", value: "58", unit: "mEq/L" },
        { name: "Serum potassium", value: "4.1", unit: "mEq/L", range: "3.5-5.0" },
      ],
    },
    options: [
      ["Fluid restriction", "Fluid restriction is first-line for mildly symptomatic chronic hyponatremia due to SIADH."],
      ["Intravenous 0.9% saline", "In SIADH, isotonic saline may worsen hyponatremia because the sodium is excreted while water is retained."],
      ["Bolus of 3% hypertonic saline", "Hypertonic saline is reserved for severe symptoms such as seizures or obtundation."],
      ["Hydrochlorothiazide", "Thiazides impair urinary dilution and can worsen hyponatremia."],
      ["Demeclocycline as first-line therapy", "Demeclocycline is a second-line option with nephrotoxicity risk."],
    ],
    correct: "a",
    rationale: "Hypotonic hyponatremia with inappropriately concentrated urine (urine osmolality above 100 mOsm/kg), urine sodium above 30 mEq/L and euvolemia, with normal thyroid and adrenal function, indicates SIADH. Small cell lung cancer is a classic cause. Fluid restriction is first-line for chronic, mildly symptomatic cases. Correction should not exceed about 8 mEq/L in 24 hours in high-risk patients to avoid osmotic demyelination.",
    extras: {
      whyCorrect: "Euvolemic SIADH with mild symptoms is treated with fluid restriction.",
      strategy: "Use volume status, urine osmolality and urine sodium to classify hyponatremia.",
      keyTakeaway: "SIADH: restrict fluids; hypertonic saline only for severe symptoms; correct slowly.",
      relatedTopics: ["Osmotic demyelination", "Small cell lung cancer", "Vaptans"],
    },
    tags: ["lab-based"],
  }),
  choice({
    exam: "abim", subject: "Infectious Disease", system: "Cardiovascular", topic: "Staphylococcus aureus bacteremia", difficulty: "moderate",
    stem: "A 58-year-old woman with a tunneled hemodialysis catheter has fever and rigors. Two sets of blood cultures grow methicillin-susceptible Staphylococcus aureus. She has no drug allergies. Empiric vancomycin was started. Which antibiotic is the best definitive therapy?",
    options: [
      ["Cefazolin", "Anti-staphylococcal beta-lactams such as cefazolin are superior to vancomycin for MSSA bacteremia and are easily dosed after dialysis."],
      ["Continue vancomycin", "Vancomycin is associated with worse outcomes than beta-lactams for MSSA."],
      ["Oral linezolid alone from day 1", "Initial oral monotherapy is not standard for complicated S. aureus bacteremia."],
      ["Ceftriaxone", "Ceftriaxone is less reliable than cefazolin or anti-staphylococcal penicillins for MSSA bacteremia."],
      ["Doxycycline", "Doxycycline is not appropriate for S. aureus bacteremia."],
    ],
    correct: "a",
    rationale: "For MSSA bacteremia, anti-staphylococcal beta-lactams (cefazolin, nafcillin or oxacillin) are associated with lower mortality than vancomycin. Cefazolin is well tolerated and can be dosed after hemodialysis. Management also includes source control (removing or exchanging the catheter), repeat blood cultures to document clearance and echocardiography to evaluate for endocarditis. Treatment duration depends on whether the infection is uncomplicated or complicated.",
    extras: {
      whyCorrect: "Cefazolin is a preferred beta-lactam for MSSA.",
      strategy: "Once susceptibilities return, de-escalate from vancomycin to a beta-lactam for MSSA.",
      keyTakeaway: "MSSA bacteremia: cefazolin or nafcillin/oxacillin, source control, repeat cultures, echocardiography.",
      relatedTopics: ["Infective endocarditis", "Catheter-related infections", "MRSA bacteremia"],
    },
  }),
  choice({
    exam: "abim", subject: "Rheumatology", system: "Musculoskeletal", topic: "Giant cell arteritis", difficulty: "moderate",
    stem: "A 74-year-old woman has 3 weeks of new temporal headache, jaw pain when chewing and an episode of transient blurred vision in the right eye this morning. ESR is 88 mm/hr. The right temporal artery is tender and nodular. What is the most appropriate next step?",
    options: [
      ["Begin high-dose glucocorticoids immediately and arrange temporal artery biopsy or ultrasound", "Visual symptoms demand immediate steroids; biopsy remains diagnostic for 1-2 weeks after starting treatment."],
      ["Obtain temporal artery biopsy before starting any treatment", "Delaying treatment risks permanent vision loss."],
      ["Start NSAIDs and reassess in 1 week", "NSAIDs do not prevent ischemic complications of GCA."],
      ["Order brain MRI before treatment", "Imaging should not delay steroids in suspected GCA with visual symptoms."],
      ["Start low-dose prednisone 10 mg daily", "Low doses are used for polymyalgia rheumatica, not GCA."],
    ],
    correct: "a",
    rationale: "Giant cell arteritis is a large-vessel vasculitis of adults over 50 that can cause irreversible blindness through ischemic optic neuropathy. Transient visual loss is a warning sign. High-dose glucocorticoids should begin immediately, often with IV methylprednisolone when vision is threatened, without waiting for biopsy. Biopsy or vascular ultrasound remains diagnostic for some time after treatment begins, and tocilizumab may be added as a steroid-sparing agent.",
    extras: {
      whyCorrect: "Treating immediately prevents vision loss without compromising diagnosis.",
      strategy: "If waiting risks irreversible harm, treat first and confirm later.",
      keyTakeaway: "Suspected GCA, especially with visual symptoms: steroids now, biopsy soon.",
      relatedTopics: ["Polymyalgia rheumatica", "Tocilizumab", "Large-vessel vasculitis"],
    },
    tags: ["priority"],
  }),
];

/* ------------------------------------------------------------------ */
/* ABFM Family Medicine                                                */
/* ------------------------------------------------------------------ */
const ABFM: SeedQuestion[] = [
  choice({
    exam: "abfm", subject: "Preventive Care", system: "Respiratory", topic: "Lung cancer screening", difficulty: "easy",
    stem: "A 58-year-old woman smoked one and a half packs per day from age 18 to 35, then quit. She has no symptoms. Which screening recommendation applies to her?",
    options: [
      ["Lung cancer screening is not indicated because she quit more than 15 years ago", "USPSTF criteria require current smoking or quitting within the past 15 years; she quit 23 years ago."],
      ["Annual low-dose CT of the chest", "She has about 25.5 pack-years but quit more than 15 years ago."],
      ["Annual chest radiograph", "Chest radiographs are not recommended for lung cancer screening."],
      ["Sputum cytology every 2 years", "Sputum cytology is not an effective screening test."],
      ["One-time low-dose CT", "Screening, when indicated, is annual, not one-time."],
    ],
    correct: "a",
    rationale: "The USPSTF (2021) recommends annual low-dose CT for adults aged 50 to 80 with at least a 20 pack-year history who currently smoke or quit within the past 15 years. This patient has 1.5 packs × 17 years = 25.5 pack-years but quit 23 years ago. She therefore does not meet the time-since-quitting criterion. Chest radiography and sputum cytology are not recommended screening tools.",
    extras: {
      whyCorrect: "Time since quitting exceeds 15 years.",
      strategy: "Check all three criteria: age, pack-years and years since quitting.",
      keyTakeaway: "LDCT: age 50-80, ≥20 pack-years, current smoker or quit within 15 years.",
      relatedTopics: ["Pack-year calculation", "Shared decision-making", "Smoking cessation"],
    },
  }),
  choice({
    exam: "abfm", subject: "Chronic Care", system: "Endocrine", topic: "Type 2 diabetes", difficulty: "moderate",
    stem: "A 61-year-old man with type 2 diabetes had a myocardial infarction 1 year ago. HbA1c is 8.2% on metformin 1,000 mg twice daily. BMI is 34 kg/m2 and eGFR is 72 mL/min/1.73 m2. Which addition is most appropriate?",
    options: [
      ["Liraglutide", "A GLP-1 receptor agonist with proven cardiovascular benefit is recommended for patients with established ASCVD and also promotes weight loss."],
      ["Glipizide", "Sulfonylureas lack cardiovascular benefit and cause hypoglycemia and weight gain."],
      ["Sitagliptin", "DPP-4 inhibitors are cardiovascular-neutral and less potent."],
      ["NPH insulin", "Insulin is not the preferred next step and causes weight gain."],
      ["Acarbose", "Acarbose has modest efficacy and no proven cardiovascular benefit."],
    ],
    correct: "a",
    rationale: "In patients with type 2 diabetes and established atherosclerotic cardiovascular disease, the ADA recommends a GLP-1 receptor agonist or SGLT2 inhibitor with proven cardiovascular benefit, independent of HbA1c. Liraglutide reduced major adverse cardiovascular events in a large outcomes trial. GLP-1 receptor agonists also support weight loss, relevant for this patient's obesity. Sulfonylureas, DPP-4 inhibitors and insulin do not provide comparable cardiovascular protection.",
    extras: {
      whyCorrect: "ASCVD plus obesity favors a GLP-1 RA with proven CV benefit.",
      strategy: "Identify comorbidities (ASCVD, HF, CKD) before choosing a second diabetes agent.",
      keyTakeaway: "T2DM with ASCVD: add a GLP-1 RA or SGLT2i with proven benefit.",
      relatedTopics: ["SGLT2 inhibitors", "Cardiovascular outcome trials", "Obesity management"],
    },
  }),
  choice({
    exam: "abfm", subject: "Acute Care", system: "Respiratory", topic: "Pharyngitis", difficulty: "easy",
    stem: "A 22-year-old has had a sore throat for 2 days. Temperature is 38.6°C, tonsils are swollen with exudate, and anterior cervical nodes are tender. She has no cough. What is the most appropriate next step?",
    options: [
      ["Perform a rapid antigen detection test for group A streptococcus", "With a high Centor score, testing confirms GAS before antibiotics are prescribed."],
      ["Prescribe amoxicillin without testing", "Empiric antibiotics without testing lead to overtreatment."],
      ["Order a monospot test only", "Mononucleosis testing is not the first step without suggestive features."],
      ["Reassure; no testing or treatment needed", "With four Centor criteria, GAS probability is high enough to test."],
      ["Order throat culture and start antibiotics while awaiting results", "In adults, a negative rapid test does not usually require culture."],
    ],
    correct: "a",
    rationale: "The Centor criteria include fever, tonsillar exudate, tender anterior cervical lymphadenopathy and absence of cough. With three or more criteria, a rapid antigen detection test is recommended, and antibiotics are prescribed only if positive. Adults with a negative rapid test generally do not need confirmatory culture, unlike children. Penicillin or amoxicillin is the treatment of choice for confirmed GAS pharyngitis.",
    extras: {
      whyCorrect: "Four Centor criteria warrant testing before treatment.",
      strategy: "Test, then treat streptococcal pharyngitis; avoid empiric antibiotics.",
      keyTakeaway: "Centor ≥3: rapid strep test; treat positives with penicillin or amoxicillin.",
      relatedTopics: ["Peritonsillar abscess", "Rheumatic fever", "Antibiotic stewardship"],
    },
  }),
  choice({
    exam: "abfm", subject: "Emergent and Urgent Care", system: "Cardiovascular", topic: "Acute coronary syndrome", difficulty: "moderate",
    stem: "A 59-year-old man develops crushing substernal chest pain while in the waiting room of a family medicine office. An ECG shows ST elevation in leads V1-V4. He has no allergies or bleeding history. EMS has been called. Which medication should be given immediately?",
    options: [
      ["Chewable aspirin 162-325 mg", "Aspirin reduces mortality in acute MI and should be given as soon as possible."],
      ["Oral metoprolol 100 mg", "Early oral beta-blockade is not the immediate priority and may be harmful if heart failure or shock develops."],
      ["Ibuprofen 600 mg", "NSAIDs increase cardiovascular risk and are avoided in acute MI."],
      ["Atorvastatin 80 mg as the only medication", "High-intensity statin is started in hospital but is not the immediate life-saving priority."],
      ["Warfarin 5 mg", "Warfarin has no role in the immediate management of STEMI."],
    ],
    correct: "a",
    rationale: "Aspirin irreversibly inhibits platelet cyclooxygenase and reduces mortality in acute myocardial infarction. A non-enteric-coated dose of 162-325 mg should be chewed as soon as STEMI is suspected unless contraindicated. Rapid transfer for primary PCI is the definitive treatment. Nitroglycerin may relieve pain if blood pressure allows and there is no right ventricular involvement or recent phosphodiesterase-5 inhibitor use.",
    extras: {
      whyCorrect: "Chewed aspirin is the immediate evidence-based therapy.",
      strategy: "In office emergencies, give simple high-yield therapy and activate EMS.",
      keyTakeaway: "Suspected STEMI: chew aspirin, call EMS, reperfuse quickly.",
      relatedTopics: ["Primary PCI", "Nitroglycerin contraindications", "P2Y12 inhibitors"],
    },
    tags: ["priority"],
  }),
  choice({
    exam: "abfm", subject: "Foundations of Care", system: "Psychiatric", topic: "Depression screening", difficulty: "easy",
    stem: "During an annual visit, a 42-year-old woman answers 'more than half the days' to both PHQ-2 questions about depressed mood and anhedonia. What is the most appropriate next step?",
    options: [
      ["Administer the PHQ-9 and perform a clinical assessment", "A positive PHQ-2 should be followed by the PHQ-9 and a diagnostic interview, including suicide risk assessment."],
      ["Start sertraline immediately", "Diagnosis and severity should be established before starting treatment."],
      ["Refer to psychiatry for inpatient admission", "No information suggests a need for hospitalization."],
      ["Rescreen with PHQ-2 in 1 year", "A positive screen requires follow-up now."],
      ["Order a TSH and defer further assessment until it returns", "Laboratory testing can be considered, but it should not delay the depression assessment."],
    ],
    correct: "a",
    rationale: "The PHQ-2 is a brief screening tool; a score of 3 or more is considered positive. A positive screen should be followed by the PHQ-9 and a clinical interview to confirm the diagnosis, assess severity and evaluate suicide risk. Treatment decisions, including psychotherapy and medication, depend on that assessment. The USPSTF recommends depression screening for all adults with systems in place for follow-up.",
    extras: {
      whyCorrect: "PHQ-9 and clinical assessment confirm the diagnosis and severity.",
      strategy: "A positive screen leads to diagnostic evaluation, not straight to treatment.",
      keyTakeaway: "Positive PHQ-2 → PHQ-9, diagnostic interview and suicide risk assessment.",
      relatedTopics: ["Major depressive disorder", "Suicide risk screening", "Collaborative care"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* DAT                                                                 */
/* ------------------------------------------------------------------ */
const DAT_PASSAGE = `Tooth enamel is the hardest tissue in the human body, yet it begins as a soft, protein-rich matrix. During the secretory stage of amelogenesis, cells called ameloblasts move away from the developing dentin while releasing proteins such as amelogenin. These proteins self-assemble into nanoscale spheres that guide the growth of long, thin crystals of hydroxyapatite, organizing them into the rod-like prisms that give enamel its strength.

At this stage the tissue is only about one-third mineral. The decisive change happens during the maturation stage, when ameloblasts reverse their role. Instead of building matrix, they remove it: enzymes such as kallikrein-4 break down the protein scaffold, and the ameloblasts reabsorb the fragments. As protein leaves, the existing crystals widen and thicken until mature enamel is roughly 96 percent mineral by weight.

This sequence has an important consequence. Once a tooth erupts, the ameloblasts are lost, and enamel cannot regenerate the way bone can. Researchers who hope to repair enamel in the laboratory have therefore focused less on mimicking the final mineral and more on reproducing the protein-guided process that organizes it. Synthetic peptides that imitate amelogenin, for example, have produced thin layers of oriented crystals on etched enamel surfaces, although none yet match the thickness or architecture of natural tissue.`;

const DAT: SeedQuestion[] = [
  choice({
    exam: "dat", category: "Survey of Natural Sciences", topic: "Biology", subtopic: "Cellular respiration", difficulty: "easy",
    stem: "In eukaryotic cells, where do the reactions of the citric acid (Krebs) cycle take place?",
    options: [
      ["Mitochondrial matrix", "Citric acid cycle enzymes (except succinate dehydrogenase, which is bound to the inner membrane) are located in the matrix."],
      ["Cytosol", "Glycolysis, not the citric acid cycle, occurs in the cytosol."],
      ["Intermembrane space", "The intermembrane space accumulates protons pumped by the electron transport chain."],
      ["Outer mitochondrial membrane", "The outer membrane is permeable to small molecules but does not host the cycle."],
      ["Rough endoplasmic reticulum", "The rough ER synthesizes secreted and membrane proteins."],
    ],
    correct: "a",
    rationale: "Pyruvate produced by glycolysis in the cytosol is transported into the mitochondrion and converted to acetyl-CoA in the matrix. The citric acid cycle then oxidizes acetyl-CoA in the matrix, generating NADH, FADH2 and GTP/ATP. Succinate dehydrogenase is the exception, being embedded in the inner membrane as Complex II. The electron transport chain itself is located in the inner membrane.",
    extras: {
      whyCorrect: "The cycle's soluble enzymes reside in the matrix.",
      strategy: "Map each stage of respiration to its location.",
      keyTakeaway: "Glycolysis: cytosol; Krebs: matrix; ETC: inner membrane.",
      relatedTopics: ["Oxidative phosphorylation", "Glycolysis", "Pyruvate dehydrogenase"],
    },
  }),
  choice({
    exam: "dat", category: "Survey of Natural Sciences", topic: "Biology", subtopic: "Population genetics", difficulty: "moderate",
    stem: "In a population in Hardy-Weinberg equilibrium, 16% of individuals show a recessive phenotype. What fraction of the population is heterozygous?",
    options: [
      ["0.48", "q² = 0.16, so q = 0.4 and p = 0.6; 2pq = 2 × 0.6 × 0.4 = 0.48."],
      ["0.16", "0.16 is q², the frequency of homozygous recessive individuals."],
      ["0.24", "0.24 is pq, missing the factor of 2."],
      ["0.36", "0.36 is p², the frequency of homozygous dominant individuals."],
      ["0.40", "0.40 is q, the recessive allele frequency."],
    ],
    correct: "a",
    rationale: "Under Hardy-Weinberg equilibrium, genotype frequencies are p² + 2pq + q² = 1. The recessive phenotype frequency equals q², so q = √0.16 = 0.4. Then p = 1 − 0.4 = 0.6, and the heterozygote frequency is 2pq = 0.48. The model assumes no selection, mutation, migration or drift, and random mating.",
    extras: {
      whyCorrect: "2 × 0.6 × 0.4 = 0.48.",
      strategy: "Always start from q² (the recessive phenotype) and take the square root.",
      keyTakeaway: "Heterozygotes = 2pq; start from q² = recessive phenotype frequency.",
      relatedTopics: ["Allele frequency", "Genetic drift", "Natural selection"],
    },
  }),
  choice({
    exam: "dat", category: "Survey of Natural Sciences", topic: "General Chemistry", subtopic: "Acids and bases", difficulty: "easy",
    stem: "What is the pH of a 0.001 M solution of hydrochloric acid at 25°C?",
    options: [
      ["3", "HCl dissociates completely, so [H+] = 1 × 10⁻³ M and pH = −log(10⁻³) = 3."],
      ["1", "pH 1 corresponds to 0.1 M H+."],
      ["0.001", "This is the concentration, not the pH."],
      ["11", "pH 11 would correspond to a basic solution of 0.001 M OH-."],
      ["7", "pH 7 is neutral water."],
    ],
    correct: "a",
    rationale: "Hydrochloric acid is a strong acid that dissociates completely in water. Therefore [H+] equals the acid concentration, 1 × 10⁻³ M. pH is the negative base-10 logarithm of [H+], giving a pH of 3. At very low concentrations (near 10⁻⁷ M), water's autoionization would need to be considered, but not here.",
    extras: {
      whyCorrect: "−log(10⁻³) = 3.",
      strategy: "For strong acids, pH = −log of the molar concentration.",
      keyTakeaway: "Each tenfold dilution of a strong acid raises pH by 1.",
      relatedTopics: ["Strong vs weak acids", "pOH", "Logarithms"],
    },
  }),
  choice({
    exam: "dat", category: "Survey of Natural Sciences", topic: "General Chemistry", subtopic: "Gas laws", difficulty: "easy",
    stem: "A sample of gas occupies 4.0 L at 2.0 atm. At constant temperature and amount of gas, what will its pressure be if it is compressed to 1.0 L?",
    options: [
      ["8.0 atm", "Boyle's law: P1V1 = P2V2, so P2 = (2.0 × 4.0) ÷ 1.0 = 8.0 atm."],
      ["0.5 atm", "Pressure increases when volume decreases at constant temperature."],
      ["2.0 atm", "Pressure does not remain constant when volume changes."],
      ["4.0 atm", "This would be the result if volume were halved, not quartered."],
      ["16 atm", "This overestimates the change by a factor of 2."],
    ],
    correct: "a",
    rationale: "Boyle's law states that at constant temperature and moles, pressure is inversely proportional to volume (P1V1 = P2V2). The volume decreases by a factor of 4, so pressure increases by a factor of 4. 2.0 atm × 4 = 8.0 atm. Real gases deviate from this ideal behavior at high pressures and low temperatures.",
    extras: {
      whyCorrect: "(2.0)(4.0) = (P2)(1.0) → P2 = 8.0 atm.",
      strategy: "Identify which variables are held constant to pick the correct gas law.",
      keyTakeaway: "Boyle: P and V inversely proportional at constant T and n.",
      relatedTopics: ["Charles's law", "Ideal gas law", "Kinetic molecular theory"],
    },
  }),
  choice({
    exam: "dat", category: "Survey of Natural Sciences", topic: "Organic Chemistry", subtopic: "Substitution reactions", difficulty: "moderate",
    stem: "Under identical conditions with sodium iodide in acetone, which alkyl bromide undergoes SN2 substitution fastest?",
    options: [
      ["Bromomethane (CH3Br)", "Methyl substrates have the least steric hindrance to backside attack and react fastest by SN2."],
      ["2-Bromopropane", "Secondary substrates are more hindered and react more slowly."],
      ["2-Bromo-2-methylpropane", "Tertiary substrates essentially do not undergo SN2 because backside attack is blocked."],
      ["1-Bromo-2,2-dimethylpropane (neopentyl bromide)", "Although primary, the adjacent quaternary carbon makes it extremely hindered."],
      ["Bromobenzene", "Aryl halides do not undergo SN2 reactions."],
    ],
    correct: "a",
    rationale: "SN2 reactions proceed by a concerted backside attack of the nucleophile on the carbon bearing the leaving group. Steric hindrance raises the energy of the pentacoordinate transition state, so the rate order is methyl > primary > secondary, with tertiary substrates unreactive. Neopentyl halides are primary but react very slowly because of branching at the adjacent carbon. Polar aprotic solvents such as acetone favor SN2 by leaving the nucleophile unsolvated.",
    extras: {
      whyCorrect: "Methyl bromide is the least hindered substrate.",
      strategy: "For SN2, pick the least sterically hindered carbon bearing the leaving group.",
      keyTakeaway: "SN2 rate: methyl > 1° > 2° >> 3° (no reaction).",
      relatedTopics: ["SN1 vs SN2", "Polar aprotic solvents", "Walden inversion"],
    },
  }),
  choice({
    exam: "dat", category: "Survey of Natural Sciences", topic: "Organic Chemistry", subtopic: "Hybridization", difficulty: "easy",
    stem: "What is the hybridization of each carbon atom in ethyne (acetylene, HC≡CH)?",
    options: [
      ["sp", "Each carbon forms two sigma bonds and two pi bonds, requiring two sp hybrid orbitals and a linear 180° geometry."],
      ["sp2", "sp2 carbons form three sigma bonds, as in ethene."],
      ["sp3", "sp3 carbons form four sigma bonds, as in ethane."],
      ["sp3d", "Carbon does not use d orbitals in hybridization."],
      ["Unhybridized p orbitals only", "Sigma bonds in ethyne involve hybridized orbitals."],
    ],
    correct: "a",
    rationale: "Hybridization can be predicted by counting sigma bonds and lone pairs around an atom. Each carbon in ethyne has two sigma bonds (one to hydrogen, one to carbon) and no lone pairs, giving sp hybridization. The two remaining unhybridized p orbitals on each carbon form two pi bonds, creating the triple bond. The molecule is linear with 180° bond angles.",
    extras: {
      whyCorrect: "Two electron domains → sp.",
      strategy: "Count sigma bonds plus lone pairs: 2 = sp, 3 = sp2, 4 = sp3.",
      keyTakeaway: "Triple-bonded carbons are sp and linear.",
      relatedTopics: ["VSEPR", "Sigma and pi bonds", "Bond lengths"],
    },
  }),
  numeric({
    exam: "dat", category: "Quantitative Reasoning", topic: "Algebra", difficulty: "easy",
    stem: "Solve for x: 3x − 7 = 2x + 5.",
    decimals: 0, value: 12, tolerance: 0,
    rationale: "Subtract 2x from both sides to get x − 7 = 5. Add 7 to both sides to get x = 12. Check by substitution: 3(12) − 7 = 29 and 2(12) + 5 = 29. Verifying the solution in the original equation catches arithmetic slips.",
    extras: {
      whyCorrect: "x = 12 satisfies both sides (29 = 29).",
      strategy: "Collect variable terms on one side and constants on the other.",
      keyTakeaway: "Always substitute back to check linear equation solutions.",
      relatedTopics: ["Linear equations", "Inequalities"],
    },
  }),
  numeric({
    exam: "dat", category: "Quantitative Reasoning", topic: "Probability and statistics", difficulty: "moderate",
    stem: "A bag contains 5 red and 3 blue marbles. Two marbles are drawn at random without replacement. What is the probability that both are red? Give your answer as a decimal rounded to two places.",
    decimals: 2, value: 0.36, tolerance: 0.005,
    rationale: "The probability that the first marble is red is 5/8. Given that, 4 red marbles remain among 7, so the second draw is red with probability 4/7. Multiply: (5/8)(4/7) = 20/56 = 5/14 ≈ 0.357. Rounded to two places, the answer is 0.36.",
    extras: {
      whyCorrect: "5/8 × 4/7 = 5/14 ≈ 0.36.",
      strategy: "Without replacement, reduce both numerator and denominator for the second draw.",
      keyTakeaway: "Dependent events: multiply conditional probabilities.",
      relatedTopics: ["Combinations", "Conditional probability", "Independent events"],
    },
  }),
  choice({
    exam: "dat", category: "Quantitative Reasoning", topic: "Data analysis", difficulty: "easy",
    stem: "What is the median of the data set {12, 3, 20, 9, 15, 7}?",
    options: [
      ["10.5", "Ordered: 3, 7, 9, 12, 15, 20; the median is the mean of the middle two values, (9 + 12) ÷ 2 = 10.5."],
      ["11", "11 is the mean (66 ÷ 6), not the median."],
      ["9", "9 is only one of the two middle values."],
      ["12", "12 is only one of the two middle values."],
      ["17", "17 is the range (20 − 3)."],
    ],
    correct: "a",
    rationale: "To find the median, first order the data: 3, 7, 9, 12, 15, 20. With an even number of values, the median is the average of the two middle values, 9 and 12. (9 + 12) ÷ 2 = 10.5. The mean of this data set is 11, which differs from the median.",
    extras: {
      whyCorrect: "Average of 9 and 12 = 10.5.",
      strategy: "Always sort the data before finding the median.",
      keyTakeaway: "Even-count data sets: median = mean of the two middle values.",
      relatedTopics: ["Mean", "Mode", "Range"],
    },
  }),
  choice({
    exam: "dat", category: "Reading Comprehension", topic: "Scientific passages", difficulty: "moderate",
    stem: "Based on the passage, why have researchers focused on reproducing the protein-guided process of enamel formation rather than simply depositing hydroxyapatite?",
    exhibit: { kind: "passage", title: "How enamel hardens", text: DAT_PASSAGE },
    options: [
      ["The organized prism structure that gives enamel its strength depends on protein-guided crystal growth", "The passage states that amelogenin assemblies organize crystals into rod-like prisms that give enamel its strength."],
      ["Hydroxyapatite cannot be produced in a laboratory", "The passage does not claim this; it notes synthetic peptides have produced oriented crystals."],
      ["Mature enamel contains more protein than mineral", "Mature enamel is about 96 percent mineral by weight."],
      ["Ameloblasts can be regenerated after tooth eruption", "The passage states ameloblasts are lost after eruption."],
      ["Kallikrein-4 directly deposits mineral crystals", "Kallikrein-4 breaks down the protein matrix; it does not deposit mineral."],
    ],
    correct: "a",
    rationale: "The passage explains that amelogenin assemblies guide hydroxyapatite crystals into organized prisms, which give enamel its strength. Because enamel cannot regenerate after eruption, researchers try to reproduce this organizing process. The other options contradict specific statements in the passage. This question tests the ability to connect a cause (protein guidance) with a stated research strategy.",
    extras: {
      whyCorrect: "It restates the passage's link between protein guidance and structural strength.",
      strategy: "Locate the sentence describing researchers' focus and the earlier sentence explaining why structure matters.",
      keyTakeaway: "Answer reading questions from the text, eliminating choices that contradict explicit details.",
      relatedTopics: ["Amelogenesis", "Biomineralization", "Inference questions"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* INBDE                                                               */
/* ------------------------------------------------------------------ */
const INBDE: SeedQuestion[] = [
  choice({
    exam: "inbde", category: "Patient Management", topic: "Local anesthesia", difficulty: "easy",
    stem: "How many milligrams of lidocaine are contained in one standard 1.8-mL dental cartridge of 2% lidocaine with 1:100,000 epinephrine?",
    options: [
      ["36 mg", "2% = 20 mg/mL; 20 mg/mL × 1.8 mL = 36 mg."],
      ["18 mg", "This uses 10 mg/mL, which corresponds to a 1% solution."],
      ["20 mg", "20 mg is the amount in 1 mL, not in a full cartridge."],
      ["72 mg", "This is the amount in two cartridges."],
      ["3.6 mg", "This misplaces the decimal by a factor of 10."],
    ],
    correct: "a",
    rationale: "A percentage concentration expresses grams per 100 mL, so 2% equals 2 g/100 mL, or 20 mg/mL. Multiplying by the 1.8-mL cartridge volume gives 36 mg per cartridge. This value is used to keep the cumulative dose below the maximum recommended dose for the patient's weight. Calculating per-cartridge content is especially important for children and medically compromised patients.",
    extras: {
      whyCorrect: "20 mg/mL × 1.8 mL = 36 mg.",
      strategy: "Convert percent to mg/mL by multiplying by 10.",
      keyTakeaway: "X% solution = 10X mg/mL; multiply by cartridge volume.",
      relatedTopics: ["Maximum recommended dose", "Vasoconstrictors", "Local anesthetic toxicity"],
    },
  }),
  choice({
    exam: "inbde", category: "Clinical Content", topic: "Antibiotic prophylaxis", difficulty: "moderate",
    stem: "For which patients is antibiotic prophylaxis before dental procedures that manipulate gingival tissue recommended to prevent infective endocarditis? Select all that apply.",
    options: [
      ["A patient with a prosthetic aortic valve", "Prosthetic cardiac valves are a high-risk condition for which prophylaxis is recommended."],
      ["A patient with a previous episode of infective endocarditis", "Prior infective endocarditis is a high-risk condition."],
      ["A patient with unrepaired cyanotic congenital heart disease", "Unrepaired cyanotic CHD is among the high-risk conditions."],
      ["A patient with a coronary artery stent placed 2 years ago", "Coronary stents are not an indication for endocarditis prophylaxis."],
      ["A patient with a total knee replacement placed 3 years ago and no complications", "Prophylaxis to prevent prosthetic joint infection is generally not recommended for routine dental care."],
    ],
    correct: ["a", "b", "c"],
    rationale: "AHA guidance limits endocarditis prophylaxis to patients at the highest risk of adverse outcomes: prosthetic valves or prosthetic valve repair material, prior infective endocarditis, certain congenital heart disease (including unrepaired cyanotic CHD) and cardiac transplant recipients with valvulopathy. It applies to procedures involving manipulation of gingival tissue, the periapical region or perforation of the oral mucosa. A typical regimen is amoxicillin 2 g orally 30-60 minutes before the procedure. Coronary stents and most prosthetic joints do not require prophylaxis.",
    extras: {
      whyCorrect: "The selected patients fall into AHA high-risk categories.",
      strategy: "Memorize the short list of high-risk cardiac conditions; everything else is usually excluded.",
      keyTakeaway: "Prophylaxis: prosthetic valve, prior IE, specific CHD, transplant with valvulopathy.",
      relatedTopics: ["Amoxicillin prophylaxis", "Prosthetic joint guidance", "Medical history review"],
    },
  }),
  choice({
    exam: "inbde", category: "Oral Diagnosis", topic: "Pulpal diagnosis", difficulty: "moderate",
    stem: "A patient reports spontaneous throbbing pain in a mandibular molar. A cold test causes intense pain that lingers for about 45 seconds after the stimulus is removed. Percussion is normal and radiographs show deep caries without periapical changes. What is the most likely pulpal diagnosis?",
    options: [
      ["Symptomatic irreversible pulpitis", "Spontaneous pain and lingering response to cold indicate irreversible pulpal inflammation."],
      ["Reversible pulpitis", "Reversible pulpitis causes sharp pain that subsides within seconds after the stimulus is removed."],
      ["Pulp necrosis", "A necrotic pulp does not respond to cold testing."],
      ["Normal pulp", "Normal pulps give a mild response that resolves quickly."],
      ["Previously treated tooth", "This category applies to teeth with prior endodontic treatment."],
    ],
    correct: "a",
    rationale: "Symptomatic irreversible pulpitis is diagnosed when a vital pulp is inflamed beyond the capacity to heal. Hallmarks include spontaneous pain and a heightened response to thermal stimuli that lingers well after the stimulus is removed. Reversible pulpitis produces short, sharp pain that resolves quickly. Treatment options include pulpotomy, root canal therapy or extraction.",
    extras: {
      whyCorrect: "Lingering cold pain with spontaneous pain = symptomatic irreversible pulpitis.",
      strategy: "Duration of the response after stimulus removal separates reversible from irreversible pulpitis.",
      keyTakeaway: "Lingering pain (>several seconds) and spontaneous pain point to irreversible pulpitis.",
      relatedTopics: ["Pulp testing", "Apical periodontitis", "Pulpotomy"],
    },
  }),
  choice({
    exam: "inbde", category: "Foundation Knowledge", topic: "Trigeminal nerve anatomy", difficulty: "moderate",
    stem: "After a successful inferior alveolar nerve block, a patient still feels pain when the buccal gingiva of the mandibular first molar is probed. Which nerve most likely requires a separate injection?",
    options: [
      ["Long buccal nerve", "The long buccal nerve supplies the buccal gingiva of mandibular molars and is not reliably anesthetized by an IANB."],
      ["Lingual nerve", "The lingual nerve supplies lingual gingiva and the anterior two-thirds of the tongue and is usually anesthetized during an IANB."],
      ["Mental nerve", "The mental nerve supplies the lip and buccal gingiva anterior to the mental foramen."],
      ["Nerve to the mylohyoid", "This nerve may provide accessory pulpal innervation but does not supply buccal gingiva."],
      ["Posterior superior alveolar nerve", "This nerve supplies maxillary molars."],
    ],
    correct: "a",
    rationale: "The inferior alveolar nerve block anesthetizes the mandibular teeth, the lower lip and chin via the mental nerve, and often the lingual nerve. The buccal soft tissue of the mandibular molars is supplied by the long buccal nerve, a branch of the anterior division of V3. A separate buccal nerve block is needed for procedures involving that tissue. Accessory innervation from the mylohyoid nerve can explain incomplete pulpal anesthesia.",
    extras: {
      whyCorrect: "Buccal gingiva of mandibular molars is innervated by the long buccal nerve.",
      strategy: "Separate pulpal, lingual and buccal soft tissue innervation for each region.",
      keyTakeaway: "IANB misses buccal molar gingiva; add a long buccal block.",
      relatedTopics: ["Gow-Gates block", "Mandibular division of trigeminal nerve", "Accessory innervation"],
    },
  }),
  choice({
    exam: "inbde", category: "Patient Management", topic: "Medical emergencies", difficulty: "easy",
    stem: "A healthy 22-year-old becomes pale, diaphoretic and briefly loses consciousness while seated upright during an injection. Pulse is slow and weak. What is the most appropriate immediate management?",
    options: [
      ["Place the patient supine with legs slightly elevated and ensure an open airway", "Supine positioning with legs elevated restores cerebral perfusion in vasovagal syncope."],
      ["Administer IM epinephrine", "Epinephrine is for anaphylaxis, which is not suggested here."],
      ["Give sublingual nitroglycerin", "Nitroglycerin would worsen hypotension."],
      ["Keep the patient upright and give sugar", "Remaining upright prolongs cerebral hypoperfusion."],
      ["Begin chest compressions immediately", "The patient has a pulse; CPR is not indicated."],
    ],
    correct: "a",
    rationale: "Vasovagal syncope is the most common medical emergency in the dental office, often triggered by anxiety or pain. Increased vagal tone causes bradycardia and vasodilation, reducing cerebral perfusion. Placing the patient supine with the legs slightly elevated, maintaining the airway and giving oxygen usually leads to rapid recovery. Vital signs should be monitored, and EMS called if recovery is delayed.",
    extras: {
      whyCorrect: "Repositioning corrects the hypoperfusion causing syncope.",
      strategy: "In emergencies, positioning and airway (P-A-B-C) come first.",
      keyTakeaway: "Syncope: supine, legs up, airway, oxygen, monitor.",
      relatedTopics: ["Basic life support", "Dental anxiety", "Orthostatic hypotension"],
    },
    tags: ["emergency"],
  }),
];

/* ------------------------------------------------------------------ */
/* NBDE                                                                */
/* ------------------------------------------------------------------ */
const NBDE: SeedQuestion[] = [
  choice({
    exam: "nbde", category: "Anatomic Sciences", topic: "Muscles of mastication", difficulty: "easy",
    stem: "Which muscle is primarily responsible for protrusion of the mandible?",
    options: [
      ["Lateral pterygoid", "Bilateral contraction of the lateral pterygoids pulls the condyles and discs forward, protruding the mandible."],
      ["Temporalis (posterior fibers)", "Posterior temporalis fibers retrude the mandible."],
      ["Masseter", "The masseter mainly elevates the mandible."],
      ["Medial pterygoid", "The medial pterygoid primarily elevates the mandible and assists in protrusion only secondarily."],
      ["Digastric (posterior belly)", "The digastric assists in depression and retrusion."],
    ],
    correct: "a",
    rationale: "The lateral pterygoid arises from the greater wing of the sphenoid and the lateral pterygoid plate and inserts on the condylar neck, articular disc and capsule. Bilateral contraction protrudes the mandible and assists opening, while unilateral contraction produces lateral movement to the opposite side. The masseter, temporalis and medial pterygoid primarily elevate the mandible. All muscles of mastication are innervated by V3.",
    extras: {
      whyCorrect: "Lateral pterygoids pull the condyles forward.",
      strategy: "Remember: lateral pterygoid = 'lowers and protrudes'; others close.",
      keyTakeaway: "Protrusion is driven by bilateral lateral pterygoid contraction.",
      relatedTopics: ["TMJ anatomy", "Mandibular movements", "Trigeminal nerve"],
    },
  }),
  choice({
    exam: "nbde", category: "Biochemistry and Physiology", topic: "Collagen synthesis", difficulty: "moderate",
    stem: "A patient with a severely restricted diet has bleeding, swollen gingiva, poor wound healing and perifollicular hemorrhages. Impairment of which step in collagen synthesis explains these findings?",
    options: [
      ["Hydroxylation of proline and lysine residues", "Prolyl and lysyl hydroxylases require ascorbic acid; deficiency (scurvy) produces unstable collagen."],
      ["Glycine incorporation every third residue", "This is a structural feature of the collagen sequence, not a vitamin-dependent step."],
      ["Cleavage of procollagen peptides", "Defective cleavage is seen in some Ehlers-Danlos types, not dietary deficiency."],
      ["Cross-linking by lysyl oxidase", "Lysyl oxidase requires copper, not vitamin C."],
      ["Transcription of collagen genes", "Gene transcription is not impaired by this deficiency."],
    ],
    correct: "a",
    rationale: "Vitamin C is a cofactor for prolyl and lysyl hydroxylases in the rough endoplasmic reticulum. Without hydroxylation, collagen triple helices are unstable, resulting in fragile vessels and poor connective tissue. Clinical scurvy includes gingival swelling and bleeding, perifollicular hemorrhages, corkscrew hairs and impaired wound healing. Cross-linking by lysyl oxidase is a later, copper-dependent step.",
    extras: {
      whyCorrect: "Vitamin C deficiency impairs proline and lysine hydroxylation.",
      strategy: "Match each collagen synthesis step with its cofactor or associated disease.",
      keyTakeaway: "Scurvy: ↓ hydroxylation → weak collagen → bleeding gums and poor healing.",
      relatedTopics: ["Ehlers-Danlos syndrome", "Osteogenesis imperfecta", "Menkes disease"],
    },
  }),
  choice({
    exam: "nbde", category: "Microbiology and Pathology", topic: "Dental caries", difficulty: "easy",
    stem: "Which organism is most strongly associated with the initiation of dental caries on smooth enamel surfaces?",
    options: [
      ["Streptococcus mutans", "S. mutans produces glucans from sucrose that promote adherence and is highly acidogenic and aciduric."],
      ["Lactobacillus casei", "Lactobacilli are associated with progression of established lesions rather than initiation."],
      ["Porphyromonas gingivalis", "P. gingivalis is a key periodontal pathogen."],
      ["Actinomyces israelii", "Actinomyces israelii causes actinomycosis; other Actinomyces species are linked to root caries."],
      ["Candida albicans", "Candida causes oral candidiasis, not smooth-surface caries initiation."],
    ],
    correct: "a",
    rationale: "Streptococcus mutans uses glucosyltransferases to convert sucrose into sticky extracellular glucans, allowing it to adhere to the tooth and form biofilm. It ferments carbohydrates to lactic acid and tolerates the resulting low pH. These properties make it central to the initiation of enamel caries. Lactobacilli contribute mainly to progression into dentin.",
    extras: {
      whyCorrect: "S. mutans is acidogenic, aciduric and glucan-producing.",
      strategy: "Initiation = S. mutans; progression = lactobacilli; root caries = Actinomyces.",
      keyTakeaway: "S. mutans initiates smooth-surface caries using sucrose-derived glucans.",
      relatedTopics: ["Stephan curve", "Fluoride", "Dental plaque biofilm"],
    },
  }),
  choice({
    exam: "nbde", category: "Dental Anatomy and Occlusion", topic: "Tooth morphology", difficulty: "moderate",
    stem: "Which permanent tooth most commonly has two roots, one buccal and one lingual?",
    options: [
      ["Maxillary first premolar", "The maxillary first premolar typically has bifurcated buccal and lingual roots."],
      ["Maxillary second premolar", "The maxillary second premolar usually has a single root."],
      ["Mandibular first premolar", "The mandibular first premolar usually has one root."],
      ["Maxillary canine", "The maxillary canine has a single, very long root."],
      ["Mandibular first molar", "The mandibular first molar has mesial and distal roots, not buccal and lingual."],
    ],
    correct: "a",
    rationale: "The maxillary first premolar is the only premolar that usually has two roots, positioned buccally and lingually. This anatomy affects endodontic access and extraction technique. The maxillary second premolar is usually single-rooted, although it may have two canals. Mandibular molars have mesial and distal roots.",
    extras: {
      whyCorrect: "Two-rooted (buccal and lingual) is characteristic of the maxillary first premolar.",
      strategy: "Memorize root number and orientation for each tooth type.",
      keyTakeaway: "Maxillary first premolar: two roots, buccal and lingual, with a mesial concavity.",
      relatedTopics: ["Root morphology", "Canal configurations", "Extraction technique"],
    },
  }),
  choice({
    exam: "nbde", category: "Microbiology and Pathology", topic: "Oral squamous cell carcinoma", difficulty: "moderate",
    stem: "Which statements about squamous cell carcinoma of the oral cavity and oropharynx are correct? Select all that apply.",
    options: [
      ["Tobacco and alcohol use act synergistically to increase risk", "Combined use multiplies the risk of oral SCC."],
      ["High-risk HPV, especially HPV-16, is strongly associated with oropharyngeal carcinoma", "HPV-positive tumors typically arise in the tonsils and base of tongue."],
      ["The lateral and ventral tongue are common intraoral sites", "These are among the most frequent sites for intraoral SCC."],
      ["The dorsum of the tongue is the most common intraoral site", "SCC on the dorsum of the tongue is uncommon."],
      ["Topical fluoride exposure is an established risk factor", "Fluoride is not a risk factor for oral cancer."],
    ],
    correct: ["a", "b", "c"],
    rationale: "Tobacco and alcohol are the major risk factors for oral SCC and act synergistically. HPV-16 is the main cause of a growing number of oropharyngeal cancers, which arise in the tonsils and base of the tongue and carry a better prognosis. Within the oral cavity, the lateral and ventral tongue and floor of the mouth are the most common sites. Leukoplakia and erythroplakia are potentially malignant lesions, with erythroplakia carrying a higher risk.",
    extras: {
      whyCorrect: "The selected statements reflect established risk factors and sites.",
      strategy: "Evaluate each statement independently in SATA items.",
      keyTakeaway: "Oral SCC: tobacco + alcohol, lateral/ventral tongue; oropharyngeal SCC: HPV-16.",
      relatedTopics: ["Leukoplakia", "Erythroplakia", "Head and neck cancer screening"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* Dental Anatomy                                                      */
/* ------------------------------------------------------------------ */
const DENTAL_ANATOMY: SeedQuestion[] = [
  choice({
    exam: "dental-anatomy", category: "Tooth Morphology", topic: "Tooth numbering", difficulty: "easy",
    stem: "In the Universal Numbering System, which tooth is designated #3?",
    options: [
      ["Maxillary right first molar", "Numbering starts at the maxillary right third molar (#1); #3 is the maxillary right first molar."],
      ["Maxillary right third molar", "This is tooth #1."],
      ["Maxillary right second premolar", "This is tooth #4."],
      ["Mandibular left first molar", "This is tooth #19."],
      ["Maxillary left first molar", "This is tooth #14."],
    ],
    correct: "a",
    rationale: "The Universal Numbering System numbers permanent teeth from 1 to 32, starting at the maxillary right third molar and continuing across to the maxillary left third molar (#16). Numbering then drops to the mandibular left third molar (#17) and continues to the mandibular right third molar (#32). Thus #2 is the maxillary right second molar and #3 the maxillary right first molar. Primary teeth use letters A through T.",
    extras: {
      whyCorrect: "Counting from #1 (right third molar), #3 is the right first molar.",
      strategy: "Anchor on #1, #16, #17 and #32, then count.",
      keyTakeaway: "Universal: maxillary right third molar = #1; first molars = #3, #14, #19, #30.",
      relatedTopics: ["FDI notation", "Palmer notation", "Primary dentition"],
    },
  }),
  choice({
    exam: "dental-anatomy", category: "Tooth Morphology", topic: "Maxillary molars", difficulty: "easy",
    stem: "On which cusp of the maxillary first molar is the cusp of Carabelli usually found?",
    options: [
      ["Mesiolingual cusp", "The cusp of Carabelli is a fifth cusp or tubercle on the lingual surface of the mesiolingual cusp."],
      ["Distolingual cusp", "The distolingual cusp is the smallest major cusp and does not carry this tubercle."],
      ["Mesiobuccal cusp", "The Carabelli trait is found lingually, not buccally."],
      ["Distobuccal cusp", "The distobuccal cusp does not carry the Carabelli trait."],
      ["Lingual cusp of the maxillary second premolar", "The trait is a molar feature."],
    ],
    correct: "a",
    rationale: "The cusp of Carabelli is a variable accessory cusp found on the lingual surface of the mesiolingual cusp of maxillary first molars. Its expression ranges from a pit or groove to a well-formed cusp. The mesiolingual cusp is the largest cusp of the maxillary first molar. The feature has no occlusal function but is useful in tooth identification.",
    extras: {
      whyCorrect: "Carabelli is located on the mesiolingual cusp.",
      strategy: "Associate Carabelli with the largest cusp of the maxillary first molar.",
      keyTakeaway: "Cusp of Carabelli: lingual surface of the mesiolingual cusp, maxillary first molar.",
      relatedTopics: ["Oblique ridge", "Molar cusp patterns", "Anatomic variations"],
    },
  }),
  choice({
    exam: "dental-anatomy", category: "Occlusion", topic: "Angle classification", difficulty: "moderate",
    stem: "In centric occlusion, the mesiobuccal cusp of the maxillary first molar occludes mesial to the buccal groove of the mandibular first molar. Which Angle classification is this?",
    options: [
      ["Class II", "The mandibular molar is distal relative to the maxillary molar, so the maxillary MB cusp sits mesial to the buccal groove."],
      ["Class I", "In Class I, the maxillary MB cusp occludes in the buccal groove of the mandibular first molar."],
      ["Class III", "In Class III, the maxillary MB cusp occludes distal to the mandibular buccal groove."],
      ["End-on Class I", "This describes a cusp-to-cusp relationship, not the one described."],
      ["Cannot be classified without canine relationships", "Angle's classification is based on the first molar relationship."],
    ],
    correct: "a",
    rationale: "Angle's classification uses the relationship of the maxillary first molar's mesiobuccal cusp to the mandibular first molar's buccal groove. In Class I it occludes in the groove. In Class II the mandibular arch is distal, so the cusp sits mesial to the groove, often with a convex profile. In Class III the mandibular arch is mesial and the cusp sits distal to the groove.",
    extras: {
      whyCorrect: "Mesial to the groove indicates a distal mandible: Class II.",
      strategy: "Think about where the mandible is: back = Class II, forward = Class III.",
      keyTakeaway: "Class I: MB cusp in buccal groove; II: mesial to groove; III: distal to groove.",
      relatedTopics: ["Overjet", "Division 1 vs 2", "Canine relationships"],
    },
  }),
  choice({
    exam: "dental-anatomy", category: "Tooth Development", topic: "Odontogenesis", difficulty: "moderate",
    stem: "Which tissues are derived from the dental papilla? Select all that apply.",
    options: [
      ["Dentin", "Odontoblasts differentiate from the peripheral cells of the dental papilla and form dentin."],
      ["Pulp", "The central dental papilla becomes the pulp."],
      ["Enamel", "Enamel is formed by ameloblasts derived from the enamel organ (ectoderm)."],
      ["Cementum", "Cementum derives from the dental follicle."],
      ["Periodontal ligament", "The PDL derives from the dental follicle."],
    ],
    correct: ["a", "b"],
    rationale: "The tooth germ has three components: the enamel organ, the dental papilla and the dental follicle (sac). The ectoderm-derived enamel organ gives rise to ameloblasts and enamel. The dental papilla, of neural crest-derived ectomesenchyme, forms the dentin and pulp. The dental follicle gives rise to cementum, the periodontal ligament and alveolar bone proper.",
    extras: {
      whyCorrect: "Dentin and pulp are the dental papilla's products.",
      strategy: "Remember the three germ components and their two or three products each.",
      keyTakeaway: "Enamel organ → enamel; papilla → dentin and pulp; follicle → cementum, PDL, alveolar bone.",
      relatedTopics: ["Bell stage", "Hertwig epithelial root sheath", "Neural crest"],
    },
  }),
  choice({
    exam: "dental-anatomy", category: "Head and Neck Anatomy", topic: "Salivary glands", difficulty: "easy",
    stem: "The parotid (Stensen) duct opens into the oral cavity opposite which tooth?",
    options: [
      ["Maxillary second molar", "The parotid papilla lies on the buccal mucosa opposite the maxillary second molar."],
      ["Mandibular first premolar", "No major salivary duct opens here."],
      ["Maxillary central incisor", "The incisive papilla is located behind the central incisors; it is not a duct opening."],
      ["Mandibular central incisor (lingual)", "The submandibular (Wharton) duct opens at the sublingual caruncle near this area."],
      ["Maxillary canine", "The parotid duct does not open opposite the canine."],
    ],
    correct: "a",
    rationale: "The parotid duct runs across the masseter, pierces the buccinator and opens at the parotid papilla on the buccal mucosa opposite the maxillary second molar. The submandibular duct opens at the sublingual caruncle beside the lingual frenum. Knowing these landmarks helps in isolation, radiographic sialography and identifying normal anatomy. The parotid gland's secretion is predominantly serous.",
    extras: {
      whyCorrect: "The parotid papilla sits opposite the maxillary second molar.",
      strategy: "Visualize the duct crossing the masseter to the buccal mucosa near the upper molars.",
      keyTakeaway: "Stensen duct → opposite maxillary second molar; Wharton duct → sublingual caruncle.",
      relatedTopics: ["Facial nerve", "Sialolithiasis", "Minor salivary glands"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* Dental Sciences                                                     */
/* ------------------------------------------------------------------ */
const DENTAL_SCIENCES: SeedQuestion[] = [
  choice({
    exam: "dental-sciences", category: "Periodontics", topic: "Periodontitis classification", difficulty: "moderate",
    stem: "In the 2017 AAP/EFP classification of periodontitis, which component reflects the rate of disease progression and risk factors such as smoking and diabetes?",
    options: [
      ["Grade", "Grade (A, B, C) reflects the rate of progression and is modified by smoking and glycemic control."],
      ["Stage", "Stage (I-IV) reflects severity and complexity, based on attachment loss, bone loss and tooth loss."],
      ["Extent", "Extent describes distribution: localized, generalized or molar-incisor pattern."],
      ["Probing depth alone", "Probing depth contributes to staging complexity but is not the progression descriptor."],
      ["Gingival index", "The gingival index measures inflammation, not progression."],
    ],
    correct: "a",
    rationale: "The 2017 classification describes periodontitis with a stage, a grade and extent. Stage reflects severity (interdental clinical attachment loss, radiographic bone loss, tooth loss) and complexity of management. Grade estimates the rate of progression using direct or indirect evidence such as the percentage of bone loss divided by age. Smoking and diabetes are grade modifiers that can raise the grade.",
    extras: {
      whyCorrect: "Grade captures progression rate and risk modifiers.",
      strategy: "Stage = severity; Grade = speed.",
      keyTakeaway: "Stage I-IV for severity; Grade A-C for progression, modified by smoking and diabetes.",
      relatedTopics: ["Clinical attachment loss", "Bone loss/age ratio", "Periodontal risk assessment"],
    },
  }),
  choice({
    exam: "dental-sciences", category: "Endodontics", topic: "Irrigation", difficulty: "moderate",
    stem: "During root canal instrumentation, which irrigant is used primarily to chelate calcium and remove the inorganic component of the smear layer?",
    options: [
      ["17% EDTA", "EDTA is a chelating agent that removes the inorganic portion of the smear layer."],
      ["Sodium hypochlorite", "NaOCl dissolves organic tissue and is antimicrobial but does not remove inorganic smear layer."],
      ["Chlorhexidine 2%", "Chlorhexidine is antimicrobial with substantivity but does not chelate."],
      ["Sterile saline", "Saline flushes debris but has no chelating or tissue-dissolving action."],
      ["Calcium hydroxide", "Calcium hydroxide is an intracanal medicament, not a chelating irrigant."],
    ],
    correct: "a",
    rationale: "Instrumentation creates a smear layer of organic and inorganic debris on canal walls. Sodium hypochlorite dissolves organic material and kills microorganisms, while EDTA chelates calcium to remove the inorganic portion. They are commonly used in sequence to clean the canal and open dentinal tubules. Chlorhexidine should not be mixed with hypochlorite because they form a precipitate.",
    extras: {
      whyCorrect: "EDTA chelates calcium in the inorganic smear layer.",
      strategy: "Organic → NaOCl; inorganic → EDTA.",
      keyTakeaway: "NaOCl dissolves tissue; EDTA removes the inorganic smear layer.",
      relatedTopics: ["Smear layer", "Hypochlorite accidents", "Intracanal medicaments"],
    },
  }),
  choice({
    exam: "dental-sciences", category: "Dental Materials", topic: "Glass ionomer cement", difficulty: "moderate",
    stem: "Which properties are characteristic of conventional glass ionomer cements? Select all that apply.",
    options: [
      ["Release of fluoride over time", "GICs release fluoride and can take it up again from topical sources."],
      ["Chemical adhesion to enamel and dentin through ionic bonding with calcium", "Polyacrylic acid carboxyl groups chelate calcium in tooth structure."],
      ["Coefficient of thermal expansion close to that of tooth structure", "This helps maintain marginal integrity."],
      ["Higher flexural strength than composite resin", "Conventional GICs are weaker and more brittle than composites."],
      ["Mandatory phosphoric acid etching and bonding agent for adhesion", "GICs adhere without a bonding agent; a polyacrylic acid conditioner may be used."],
    ],
    correct: ["a", "b", "c"],
    rationale: "Glass ionomer cements form through an acid-base reaction between fluoroaluminosilicate glass and polyacrylic acid. They bond chemically to tooth structure via ionic interaction with calcium and release fluoride, making them useful in high-caries-risk patients and for cervical lesions. Their thermal expansion is similar to that of tooth structure. Their main limitations are low strength, low wear resistance and moisture sensitivity during setting.",
    extras: {
      whyCorrect: "The selected properties define conventional GIC behavior.",
      strategy: "Contrast GIC with composite: GIC wins on adhesion and fluoride, composite on strength and esthetics.",
      keyTakeaway: "GIC: chemical adhesion, fluoride release, tooth-like thermal expansion, low strength.",
      relatedTopics: ["Resin-modified glass ionomer", "Atraumatic restorative treatment", "Luting cements"],
    },
  }),
  choice({
    exam: "dental-sciences", category: "Oral Pathology", topic: "Odontogenic keratocyst", difficulty: "difficult",
    stem: "A 17-year-old has multiple radiolucent jaw lesions that are odontogenic keratocysts on biopsy. He also has several basal cell carcinomas, bifid ribs and calcification of the falx cerebri. Mutation in which gene is most likely?",
    options: [
      ["PTCH1", "Nevoid basal cell carcinoma (Gorlin) syndrome results from PTCH1 mutations in the hedgehog pathway."],
      ["APC", "APC mutations cause familial adenomatous polyposis and Gardner syndrome with osteomas."],
      ["GNAS", "Activating GNAS mutations cause fibrous dysplasia and McCune-Albright syndrome."],
      ["RUNX2", "RUNX2 mutations cause cleidocranial dysplasia with supernumerary teeth."],
      ["STK11", "STK11 mutations cause Peutz-Jeghers syndrome with mucocutaneous pigmentation."],
    ],
    correct: "a",
    rationale: "Multiple odontogenic keratocysts in a young patient should prompt evaluation for nevoid basal cell carcinoma syndrome (Gorlin syndrome). The syndrome is autosomal dominant and caused by mutations in PTCH1, a tumor suppressor in the sonic hedgehog pathway. Features include multiple basal cell carcinomas, palmar and plantar pits, bifid ribs and falx calcification. Odontogenic keratocysts have high recurrence rates and require careful surgical management and follow-up.",
    extras: {
      whyCorrect: "Multiple OKCs plus BCCs indicate Gorlin syndrome (PTCH1).",
      strategy: "Link each syndrome with its oral manifestation and gene.",
      keyTakeaway: "Multiple OKCs → think Gorlin syndrome, PTCH1.",
      relatedTopics: ["Gardner syndrome", "Cleidocranial dysplasia", "Hedgehog signaling"],
    },
  }),
  choice({
    exam: "dental-sciences", category: "Prosthodontics", topic: "Removable partial dentures", difficulty: "easy",
    stem: "A mandibular arch is missing both first and second molars on each side, with all anterior teeth and premolars present. What is the Kennedy classification?",
    options: [
      ["Class I", "Class I describes bilateral edentulous areas located posterior to the remaining natural teeth."],
      ["Class II", "Class II is a unilateral distal-extension edentulous area."],
      ["Class III", "Class III is a unilateral tooth-bounded edentulous area."],
      ["Class IV", "Class IV is a single bilateral edentulous area anterior to the remaining teeth, crossing the midline."],
      ["Class I modification 1", "There are no additional edentulous spaces to create a modification."],
    ],
    correct: "a",
    rationale: "The Kennedy classification groups partially edentulous arches by the location of edentulous spaces. Class I has bilateral distal-extension spaces, Class II a unilateral distal extension, Class III a tooth-bounded space, and Class IV a single anterior space crossing the midline. Additional edentulous spaces are recorded as modifications, except in Class IV. A bilateral distal-extension RPD must manage tissue-supported bases with appropriate clasp design.",
    extras: {
      whyCorrect: "Both sides lack teeth posterior to the premolars: bilateral distal extension.",
      strategy: "Determine the most posterior edentulous area first, then check for modifications.",
      keyTakeaway: "Kennedy I = bilateral distal extension; II = unilateral; III = bounded; IV = anterior across midline.",
      relatedTopics: ["Applegate's rules", "RPI clasp", "Distal-extension bases"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* NAPLEX                                                              */
/* ------------------------------------------------------------------ */
const NAPLEX: SeedQuestion[] = [
  numeric({
    exam: "naplex", category: "Medication Use Process", topic: "Renal dose adjustment", subtopic: "Cockcroft-Gault", difficulty: "moderate",
    stem: "Estimate the creatinine clearance using the Cockcroft-Gault equation for a 70-year-old man who weighs 80 kg (at his ideal body weight) with a stable serum creatinine of 1.6 mg/dL. Round to the nearest tenth.",
    patient: { age: "70", gender: "Male", vitals: { Weight: "80 kg" }, labs: [{ name: "Serum creatinine", value: "1.6", unit: "mg/dL", range: "0.7-1.3", flag: "H" }] },
    unit: "mL/min", decimals: 1, value: 48.6, tolerance: 0.5,
    rationale: "Cockcroft-Gault: CrCl = [(140 − age) × weight (kg)] ÷ (72 × SCr), multiplied by 0.85 for females. (140 − 70) × 80 = 5,600, and 72 × 1.6 = 115.2. 5,600 ÷ 115.2 = 48.6 mL/min. Many drug labels use this estimate for renal dose adjustments, so the result places him in the 30-50 mL/min band for many dosing tables.",
    extras: {
      whyCorrect: "5,600 ÷ 115.2 = 48.6 mL/min.",
      strategy: "Write the formula, check sex, check which weight to use, then compute numerator and denominator separately.",
      keyTakeaway: "CrCl = (140 − age) × kg ÷ (72 × SCr) × 0.85 if female.",
      relatedTopics: ["Ideal body weight", "Renal dosing", "eGFR vs CrCl"],
    },
    tags: ["calculation"],
  }),
  numeric({
    exam: "naplex", category: "Person-Centered Assessment and Treatment Planning", topic: "Corticosteroid conversion", difficulty: "moderate",
    stem: "A hospitalized patient taking prednisone 40 mg orally daily is NPO and must be switched to IV methylprednisolone. What is the equivalent daily dose of methylprednisolone in mg?",
    unit: "mg", decimals: 0, value: 32, tolerance: 0,
    rationale: "Equivalent anti-inflammatory doses are about prednisone 5 mg = methylprednisolone 4 mg = hydrocortisone 20 mg = dexamethasone 0.75 mg. The ratio of methylprednisolone to prednisone is 4:5, or 0.8. 40 mg × 0.8 = 32 mg of methylprednisolone. Oral and IV methylprednisolone are considered roughly equivalent for this purpose.",
    extras: {
      whyCorrect: "40 × 4/5 = 32 mg.",
      strategy: "Memorize the equivalence table using prednisone 5 mg as the anchor.",
      keyTakeaway: "Prednisone 5 = methylprednisolone 4 = hydrocortisone 20 = dexamethasone 0.75 mg.",
      relatedTopics: ["Glucocorticoid potency", "Stress-dose steroids", "Mineralocorticoid activity"],
    },
    tags: ["calculation"],
  }),
  choice({
    exam: "naplex", category: "Medication Use Process", topic: "Drug interactions", difficulty: "moderate",
    stem: "A 64-year-old man taking simvastatin 40 mg daily is prescribed clarithromycin 500 mg twice daily for 7 days. What is the most appropriate pharmacist recommendation?",
    options: [
      ["Temporarily withhold simvastatin during the clarithromycin course", "Clarithromycin strongly inhibits CYP3A4, and coadministration with simvastatin is contraindicated because of myopathy and rhabdomyolysis risk."],
      ["Continue both drugs and monitor for muscle pain", "Monitoring alone is insufficient for a contraindicated combination."],
      ["Reduce simvastatin to 20 mg and continue", "Labeling contraindicates simvastatin with strong CYP3A4 inhibitors regardless of dose."],
      ["Double the simvastatin dose to offset the interaction", "Increasing the dose would greatly increase toxicity."],
      ["Separate administration times by 12 hours", "Spacing doses does not prevent enzyme inhibition."],
    ],
    correct: "a",
    rationale: "Simvastatin is extensively metabolized by CYP3A4. Strong inhibitors such as clarithromycin, itraconazole and HIV protease inhibitors markedly increase simvastatin exposure and the risk of myopathy and rhabdomyolysis. Coadministration is contraindicated, so simvastatin should be held during the short antibiotic course. An alternative antibiotic without CYP3A4 inhibition could also be considered with the prescriber.",
    extras: {
      whyCorrect: "Holding simvastatin avoids a contraindicated interaction during a short course.",
      strategy: "Identify the enzyme, the inhibitor strength and whether labeling calls the combination contraindicated.",
      keyTakeaway: "Simvastatin and lovastatin are contraindicated with strong CYP3A4 inhibitors.",
      relatedTopics: ["CYP3A4", "Statin myopathy", "Macrolide interactions"],
    },
  }),
  choice({
    exam: "naplex", category: "Person-Centered Assessment and Treatment Planning", topic: "Anticoagulation management", difficulty: "difficult",
    stem: "A 76-year-old woman taking warfarin for atrial fibrillation has an INR of 11.2 at a routine check. She has no bleeding or recent falls. What is the most appropriate management?",
    options: [
      ["Hold warfarin and give oral vitamin K (phytonadione) 2.5-5 mg", "For INR >10 without bleeding, guidelines recommend holding warfarin and giving oral vitamin K."],
      ["Hold one dose of warfarin only, without vitamin K", "This is appropriate for INR 4.5-10 without bleeding, not INR above 10."],
      ["Give IV vitamin K 10 mg and four-factor prothrombin complex concentrate", "IV vitamin K and PCC are reserved for major bleeding."],
      ["Continue warfarin at the same dose and recheck in 1 week", "This exposes the patient to a high bleeding risk."],
      ["Give protamine sulfate", "Protamine reverses heparin, not warfarin."],
    ],
    correct: "a",
    rationale: "For supratherapeutic INR without bleeding, management depends on the degree of elevation. With an INR above 10, warfarin should be held and oral vitamin K given, typically 2.5-5 mg, with INR rechecked within 24-48 hours. For INR between 4.5 and 10 without bleeding, holding doses without routine vitamin K is generally recommended. Major bleeding requires IV vitamin K plus four-factor PCC.",
    extras: {
      whyCorrect: "INR >10 without bleeding → hold and oral vitamin K.",
      strategy: "Sort warfarin reversal by INR range and bleeding status.",
      keyTakeaway: "INR >10 no bleeding: hold + oral vitamin K; major bleeding: IV vitamin K + 4F-PCC.",
      relatedTopics: ["Vitamin K", "4F-PCC", "Warfarin interactions"],
    },
  }),
  choice({
    exam: "naplex", category: "Foundational Knowledge", topic: "Anticoagulant pharmacology", difficulty: "easy",
    stem: "What is the mechanism of action of apixaban?",
    options: [
      ["Direct, reversible inhibition of factor Xa", "Apixaban binds factor Xa directly, without needing antithrombin."],
      ["Direct inhibition of thrombin (factor IIa)", "This describes dabigatran, argatroban and bivalirudin."],
      ["Potentiation of antithrombin III", "This is the mechanism of heparin and LMWH; fondaparinux acts indirectly through antithrombin on Xa."],
      ["Inhibition of vitamin K epoxide reductase", "This is the mechanism of warfarin."],
      ["Irreversible P2Y12 receptor blockade", "This describes clopidogrel and prasugrel."],
    ],
    correct: "a",
    rationale: "Apixaban is an oral direct factor Xa inhibitor that binds both free and clot-bound factor Xa, reducing thrombin generation. Unlike heparins and fondaparinux, it does not require antithrombin. It is used for stroke prevention in atrial fibrillation and treatment and prevention of venous thromboembolism. Andexanet alfa can reverse its effect in life-threatening bleeding.",
    extras: {
      whyCorrect: "Apixaban is a direct factor Xa inhibitor.",
      strategy: "'-xaban' = Xa inhibitor; '-gatran' = thrombin inhibitor.",
      keyTakeaway: "Apixaban, rivaroxaban, edoxaban: direct Xa inhibitors; reversal with andexanet alfa.",
      relatedTopics: ["Dabigatran", "Andexanet alfa", "DOAC dosing"],
    },
  }),
  choice({
    exam: "naplex", category: "Person-Centered Assessment and Treatment Planning", topic: "Patient counseling", subtopic: "Bisphosphonates", difficulty: "moderate",
    stem: "A patient is starting alendronate 70 mg once weekly. Which counseling points are appropriate? Select all that apply.",
    options: [
      ["Take it first thing in the morning on an empty stomach with a full glass of plain water", "Food, beverages and other drugs markedly reduce absorption, and water helps transit to the stomach."],
      ["Remain upright for at least 30 minutes after taking it", "Remaining upright reduces the risk of esophageal irritation and ulceration."],
      ["Wait at least 30 minutes before eating, drinking anything else or taking other medications", "This maximizes absorption."],
      ["Take it with your calcium supplement to improve bone benefit", "Calcium binds alendronate and blocks absorption; separate them."],
      ["Take it at bedtime so it works overnight", "Lying down after the dose increases esophageal injury risk."],
    ],
    correct: ["a", "b", "c"],
    rationale: "Oral bisphosphonates have very low bioavailability that is further reduced by food, coffee, juice, calcium and other polyvalent cations. Alendronate should be taken in the morning with 6-8 oz of plain water on an empty stomach, waiting at least 30 minutes before food or other medications. Patients must stay upright for at least 30 minutes to prevent esophagitis. Calcium and vitamin D supplements are important but must be taken at a different time.",
    extras: {
      whyCorrect: "These steps maximize absorption and prevent esophageal injury.",
      strategy: "Bisphosphonate counseling: empty stomach, plain water, upright, wait 30 minutes.",
      keyTakeaway: "Separate alendronate from calcium and food; stay upright 30 minutes.",
      relatedTopics: ["Osteoporosis", "Osteonecrosis of the jaw", "Atypical femur fractures"],
    },
    tags: ["counseling"],
  }),
  choice({
    exam: "naplex", category: "Person-Centered Assessment and Treatment Planning", topic: "Helicobacter pylori", difficulty: "moderate",
    stem: "A 45-year-old with no penicillin allergy and no prior H. pylori treatment has a positive stool antigen test for H. pylori. Antibiotic susceptibility is unknown. Which regimen is most appropriate?",
    options: [
      ["Bismuth quadruple therapy (PPI, bismuth, tetracycline, metronidazole) for 14 days", "Bismuth quadruple therapy for 14 days is a preferred first-line regimen when susceptibility is unknown."],
      ["Clarithromycin triple therapy for 7 days", "Empiric clarithromycin triple therapy is no longer preferred because of high resistance, and 7 days is too short."],
      ["Levofloxacin triple therapy as first-line", "Levofloxacin regimens are reserved for specific situations because of resistance and adverse effects."],
      ["Metronidazole monotherapy for 10 days", "Monotherapy has unacceptably low eradication rates."],
      ["PPI alone for 8 weeks", "Acid suppression alone does not eradicate H. pylori."],
    ],
    correct: "a",
    rationale: "Rising clarithromycin resistance has reduced the effectiveness of standard triple therapy. Current US guidance favors 14-day bismuth quadruple therapy for treatment-naive patients when susceptibility is unknown; vonoprazan-based regimens are alternatives. Test of cure, with urea breath test or stool antigen at least 4 weeks after therapy and off PPI for 2 weeks, is recommended. Adherence counseling is critical because the regimen is complex.",
    extras: {
      whyCorrect: "Bismuth quadruple therapy for 14 days is preferred empirically.",
      strategy: "Avoid clarithromycin-based regimens unless susceptibility is confirmed.",
      keyTakeaway: "H. pylori: 14-day bismuth quadruple first-line; always confirm eradication.",
      relatedTopics: ["Peptic ulcer disease", "Vonoprazan", "Test of cure"],
    },
  }),
  choice({
    exam: "naplex", category: "Medication Use Process", topic: "Medication safety", difficulty: "easy",
    stem: "A pharmacy displays drug names such as hydrALAZINE and hydrOXYzine on shelf labels and in its dispensing software. What is the primary purpose of this practice?",
    options: [
      ["To reduce selection errors between look-alike drug names", "Tall man lettering highlights the dissimilar portions of similar names to reduce mix-ups."],
      ["To identify high-alert medications", "High-alert status is flagged by other methods, not tall man lettering."],
      ["To indicate controlled substances", "Controlled substance schedules are indicated by other labeling."],
      ["To show that a drug is available as a generic", "Capitalization does not convey generic availability."],
      ["To meet a federal requirement that all generic names be capitalized", "No such federal requirement exists."],
    ],
    correct: "a",
    rationale: "Tall man lettering uses selective capitalization to emphasize the differing parts of look-alike drug names. It is recommended by safety organizations for selected name pairs in labels, shelf tags and electronic systems. The practice is one strategy among others, including separating storage locations and requiring indications on prescriptions. Look-alike, sound-alike errors remain a common source of dispensing mistakes.",
    extras: {
      whyCorrect: "Tall man lettering targets look-alike name confusion.",
      strategy: "Link each safety strategy to the error type it prevents.",
      keyTakeaway: "Tall man lettering reduces look-alike, sound-alike selection errors.",
      relatedTopics: ["ISMP lists", "Barcode scanning", "Error-prone abbreviations"],
    },
    tags: ["safety"],
  }),
];

/* ------------------------------------------------------------------ */
/* MPJE (federal law only)                                             */
/* ------------------------------------------------------------------ */
const MPJE: SeedQuestion[] = [
  choice({
    exam: "mpje", category: "Licensure and Operations", topic: "Controlled substance ordering", difficulty: "easy",
    stem: "Under federal law, which document or system must a pharmacy use to order Schedule II controlled substances from a distributor?",
    options: [
      ["DEA Form 222 or its electronic equivalent through CSOS", "Schedule I and II substances must be ordered on a DEA Form 222 or electronically through the Controlled Substance Ordering System."],
      ["DEA Form 106", "Form 106 reports theft or significant loss of controlled substances."],
      ["DEA Form 41", "Form 41 documents the destruction of controlled substances."],
      ["A standard invoice signed by the pharmacist", "Invoices are used for Schedule III-V transfers, not Schedule II orders."],
      ["DEA Form 224", "Form 224 is the application for pharmacy DEA registration."],
    ],
    correct: "a",
    rationale: "Federal regulations require Schedule I and II controlled substances to be ordered using DEA Form 222 or the electronic Controlled Substance Ordering System (CSOS). The current single-sheet Form 222 is retained by the purchaser, which records the quantity and date received. Schedule III-V substances may be ordered with standard invoices, which must be retained. Records must be kept for at least 2 years under federal law.",
    extras: {
      whyCorrect: "DEA 222/CSOS is required for C-II ordering.",
      strategy: "Memorize the DEA form numbers by function: 222 order, 106 loss, 41 destruction, 224 registration.",
      keyTakeaway: "C-II ordering: DEA Form 222 or CSOS.",
      relatedTopics: ["DEA forms", "Recordkeeping", "Power of attorney for 222 forms"],
    },
  }),
  choice({
    exam: "mpje", category: "General Regulatory Processes", topic: "Controlled substance schedules", difficulty: "easy",
    stem: "Under the federal Controlled Substances Act, in which schedule are hydrocodone combination products (e.g., hydrocodone with acetaminophen) currently placed?",
    options: [
      ["Schedule II", "Hydrocodone combination products were rescheduled from C-III to C-II effective October 2014."],
      ["Schedule III", "This was their placement before the 2014 rescheduling."],
      ["Schedule IV", "Schedule IV includes drugs such as benzodiazepines and tramadol."],
      ["Schedule V", "Schedule V includes low-dose codeine cough preparations and pregabalin."],
      ["Schedule I", "Schedule I substances have no currently accepted medical use in the US."],
    ],
    correct: "a",
    rationale: "In 2014 the DEA moved hydrocodone combination products from Schedule III to Schedule II because of high abuse potential. As Schedule II drugs, they require a valid prescription meeting C-II requirements and cannot be refilled. Ordering requires DEA Form 222 or CSOS. Single-entity hydrocodone products were already Schedule II.",
    extras: {
      whyCorrect: "Hydrocodone combinations have been C-II since October 2014.",
      strategy: "Remember notable scheduling changes, such as hydrocodone (to C-II) and tramadol (to C-IV).",
      keyTakeaway: "All hydrocodone products are Schedule II federally.",
      relatedTopics: ["Schedule II prescription requirements", "Refill rules", "Tramadol scheduling"],
    },
  }),
  choice({
    exam: "mpje", category: "Pharmacy Practice", topic: "Theft and loss reporting", difficulty: "moderate",
    stem: "A pharmacy discovers a significant loss of oxycodone tablets that appears to be due to employee theft. Under federal regulations, which form must be filed with the DEA to report the loss?",
    options: [
      ["DEA Form 106", "Form 106 reports theft or significant loss; the DEA field office must also be notified in writing within one business day of discovery."],
      ["DEA Form 41", "Form 41 records destruction of controlled substances."],
      ["DEA Form 222", "Form 222 is used for ordering Schedule I-II substances."],
      ["DEA Form 363", "Form 363 is the narcotic treatment program registration application."],
      ["FDA MedWatch Form 3500", "MedWatch reports adverse events and product problems to the FDA, not theft."],
    ],
    correct: "a",
    rationale: "Federal regulations require registrants to notify the DEA field office in writing within one business day of discovering a theft or significant loss of controlled substances. The registrant then completes DEA Form 106, which documents the circumstances and quantities and must be submitted within 45 days. Factors such as quantity, pattern and the specific drug determine whether a loss is significant. Local law enforcement may also need to be notified.",
    extras: {
      whyCorrect: "Form 106 is the theft/loss report.",
      strategy: "Associate '106' with 'lost'.",
      keyTakeaway: "Theft/significant loss: notify DEA within 1 business day, then file Form 106.",
      relatedTopics: ["Controlled substance inventory", "Diversion prevention", "DEA Form 41"],
    },
  }),
  choice({
    exam: "mpje", category: "Pharmacy Practice", topic: "Prescription refills", difficulty: "easy",
    stem: "Under federal law, what is the refill limit for a prescription for a Schedule IV controlled substance such as alprazolam?",
    options: [
      ["Up to 5 refills within 6 months of the date of issue", "Schedule III and IV prescriptions may be refilled up to 5 times within 6 months of issue."],
      ["No refills allowed", "This applies to Schedule II prescriptions."],
      ["Up to 11 refills within 1 year", "This is not the federal rule for controlled substances."],
      ["Unlimited refills within 1 year", "Controlled substances have specific refill limits."],
      ["Up to 3 refills within 90 days", "This is not the federal rule."],
    ],
    correct: "a",
    rationale: "Federal regulations allow prescriptions for Schedule III and IV controlled substances to be refilled up to five times within six months after the date of issue, whichever occurs first. After that, a new prescription is required. Schedule II prescriptions cannot be refilled. Schedule V refills are governed by the prescriber's authorization, and stricter state laws take precedence.",
    extras: {
      whyCorrect: "C-III/IV: 5 refills or 6 months, whichever comes first.",
      strategy: "When state and federal rules differ, the stricter law applies.",
      keyTakeaway: "C-II: no refills; C-III/IV: 5 refills within 6 months.",
      relatedTopics: ["Partial fills", "Transfers of C-III-V prescriptions", "Schedule V rules"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* CPJE                                                                */
/* ------------------------------------------------------------------ */
const CPJE: SeedQuestion[] = [
  choice({
    exam: "cpje", category: "Patient Medication Profiles", topic: "Drug interactions", difficulty: "moderate",
    stem: "A 74-year-old patient's profile lists lisinopril 40 mg daily and spironolactone 25 mg daily for heart failure. Her eGFR is 42 mL/min/1.73 m2. A new prescription arrives for potassium chloride ER 20 mEq daily. What is the most appropriate action?",
    options: [
      ["Contact the prescriber about the risk of hyperkalemia before dispensing", "An ACE inhibitor, an MRA, reduced kidney function and a potassium supplement together create a high risk of hyperkalemia."],
      ["Dispense with counseling to take with food", "Counseling about GI tolerance does not address the dangerous interaction."],
      ["Dispense and recommend a salt substitute", "Salt substitutes contain potassium chloride and would further increase risk."],
      ["Substitute potassium citrate without contacting the prescriber", "Any potassium supplement carries the same risk, and substitution requires authorization."],
      ["Dispense because potassium supplements prevent diuretic-induced hypokalemia", "Spironolactone is potassium-sparing; hypokalemia is unlikely."],
    ],
    correct: "a",
    rationale: "Both ACE inhibitors and spironolactone raise serum potassium, and reduced kidney function further impairs potassium excretion. Adding a potassium supplement substantially increases the risk of life-threatening hyperkalemia. The pharmacist should contact the prescriber to clarify the indication and recent potassium level before dispensing. Patients on this regimen should also avoid potassium-containing salt substitutes.",
    extras: {
      whyCorrect: "The combination poses a serious, preventable risk requiring prescriber clarification.",
      strategy: "Scan the whole profile for drugs that push the same lab value in the same direction.",
      keyTakeaway: "ACEi/ARB + MRA + CKD + potassium supplement = high hyperkalemia risk.",
      relatedTopics: ["Hyperkalemia", "Heart failure therapy", "Prospective drug review"],
    },
  }),
  choice({
    exam: "cpje", category: "Prescriptions and Dispensing", topic: "Patient consultation", difficulty: "easy",
    stem: "Under California pharmacy regulations, in which situation must a pharmacist provide oral consultation to the patient or the patient's agent?",
    options: [
      ["When a prescription drug is dispensed to the patient for the first time", "California requires oral consultation whenever a drug has not previously been dispensed to the patient."],
      ["Only when the patient requests it", "Consultation is also required for new prescriptions and certain changes, not only on request."],
      ["Only for controlled substances", "The requirement is not limited to controlled substances."],
      ["Only for patients older than 65 years", "The requirement applies regardless of age."],
      ["Only when the prescription is paid for in cash", "Payment method does not affect the consultation requirement."],
    ],
    correct: "a",
    rationale: "California regulations require pharmacists to provide oral consultation whenever a prescription drug has not been previously dispensed to the patient. Consultation is also required when a refill is dispensed in a different dosage form or strength or with new directions, upon request, and whenever the pharmacist deems it warranted. Consultation must occur in a setting that protects patient privacy. Written information is provided when a patient receives medications by delivery or mail.",
    extras: {
      whyCorrect: "New prescriptions trigger mandatory oral consultation.",
      strategy: "Know the triggers: new drug, changed strength/form/directions, request, professional judgment.",
      keyTakeaway: "California: consult on every new prescription and on changes.",
      relatedTopics: ["Patient privacy", "Counseling documentation", "Medication guides"],
    },
  }),
  choice({
    exam: "cpje", category: "Patient Medication Profiles", topic: "Geriatric pharmacotherapy", difficulty: "moderate",
    stem: "An 81-year-old with Alzheimer disease takes donepezil 10 mg daily. A new prescription arrives for oxybutynin IR 5 mg three times daily for urge incontinence. What is the most significant concern?",
    options: [
      ["Oxybutynin's anticholinergic effects can worsen cognition and oppose donepezil", "Strongly anticholinergic drugs counteract cholinesterase inhibitors and increase confusion risk in older adults."],
      ["Oxybutynin increases donepezil metabolism through CYP induction", "This is not a recognized mechanism of interaction."],
      ["Donepezil causes urinary retention requiring a higher oxybutynin dose", "Donepezil, a cholinergic agent, may contribute to incontinence rather than retention."],
      ["Both drugs commonly cause hyperkalemia", "Neither drug is a typical cause of hyperkalemia."],
      ["There is no meaningful interaction", "This is a clinically significant drug-disease and drug-drug interaction."],
    ],
    correct: "a",
    rationale: "Donepezil increases acetylcholine availability, while oxybutynin is a strongly anticholinergic antimuscarinic. Combining them reduces the benefit of donepezil and can worsen cognition, cause delirium and increase fall risk. The Beers Criteria advise avoiding strongly anticholinergic drugs in patients with dementia and avoiding concurrent use with cholinesterase inhibitors. Alternatives include behavioral therapy or mirabegron, discussed with the prescriber.",
    extras: {
      whyCorrect: "The two drugs have opposing effects, and anticholinergics harm cognition.",
      strategy: "Look for prescribing cascades and opposing mechanisms in geriatric profiles.",
      keyTakeaway: "Avoid strong anticholinergics in dementia, especially with cholinesterase inhibitors.",
      relatedTopics: ["Beers Criteria", "Prescribing cascades", "Beta-3 agonists"],
    },
  }),
  choice({
    exam: "cpje", category: "Pharmacy Operations", topic: "Naloxone counseling", difficulty: "easy",
    stem: "A pharmacist furnishes naloxone 4-mg nasal spray to a family member of a patient taking high-dose opioids. Which counseling point is most accurate?",
    options: [
      ["Call 911, give one spray in one nostril, and repeat with a new device in the other nostril every 2-3 minutes if there is no response", "This reflects standard instructions: activate EMS, administer, and repeat with a new device if needed."],
      ["Wait 15 minutes after the first spray before calling for help", "Emergency services should be called immediately."],
      ["Each device can be used for multiple doses", "Each nasal device contains a single dose."],
      ["Naloxone will reverse overdoses from any sedative, including alcohol", "Naloxone reverses opioids only."],
      ["Once the person wakes up, they can be left alone because naloxone lasts longer than all opioids", "Naloxone's duration may be shorter than many opioids, so overdose can recur; stay with the person."],
    ],
    correct: "a",
    rationale: "Naloxone is an opioid antagonist that rapidly reverses respiratory depression. Responders should call emergency services, administer one spray into a nostril and repeat with a new device every 2-3 minutes, alternating nostrils, if the person does not respond. Because naloxone may wear off before long-acting opioids, the person should be monitored and not left alone. California law permits pharmacists to furnish naloxone without a prescription under a statewide protocol.",
    extras: {
      whyCorrect: "It includes EMS activation, correct use and the repeat-dose instruction.",
      strategy: "Naloxone counseling: recognize, call, give, repeat, stay.",
      keyTakeaway: "Each nasal device is single-use; repeat every 2-3 minutes and stay with the person.",
      relatedTopics: ["Opioid overdose recognition", "Rescue breathing", "Pharmacist furnishing protocols"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/* PANCE                                                               */
/* ------------------------------------------------------------------ */
const PANCE: SeedQuestion[] = [
  choice({
    exam: "pance", category: "Diagnosis", system: "Cardiovascular", topic: "Acute coronary syndrome", difficulty: "moderate",
    stem: "A 62-year-old man presents with 45 minutes of crushing substernal chest pain radiating to the left jaw and diaphoresis. ECG shows 3-mm ST-segment elevation in leads II, III, and aVF with reciprocal ST depression in I and aVL. Blood pressure is 94/60 mmHg, heart rate is 54/min, and lungs are clear to auscultation. Which coronary artery is most likely occluded, and which medication should be used with extreme caution or avoided?",
    options: [
      ["Right coronary artery; nitroglycerin should be avoided before assessing for right ventricular infarction", "ST elevation in II, III, aVF indicates inferior STEMI (usually RCA); hypotension with clear lungs suggests RV involvement, where nitrates cause severe preload drop."],
      ["Left anterior descending artery; aspirin should be withheld", "LAD occlusion causes anterior ST elevation (V1-V4), and aspirin is indicated immediately."],
      ["Left circumflex artery; unfractionated heparin is contraindicated", "LCx typically causes lateral ST elevation (I, aVL, V5-V6), and anticoagulation is indicated."],
      ["Right coronary artery; dual antiplatelet therapy is contraindicated", "DAPT is standard therapy in STEMI undergoing PCI."],
      ["Left main coronary artery; isotonic IV fluids are contraindicated", "RV infarction requires preload support with isotonic saline boluses."],
    ],
    correct: "a",
    rationale: "Inferior wall STEMI presents with ST-segment elevation in the inferior leads (II, III, aVF) and is supplied by the right coronary artery (RCA) in approximately 80% of individuals. When inferior STEMI is accompanied by hypotension, bradycardia, jugular venous distention, and clear lung fields, right ventricular (RV) infarction must be suspected and confirmed with right-sided ECG leads (especially V4R). Because the ischemic right ventricle is preload-dependent, vasodilators such as nitroglycerin and opioids can precipitate profound hypotension.",
    extras: {
      whyCorrect: "II, III, aVF = inferior/RCA; preload-dependent RV infarction contraindicates nitrates.",
      strategy: "Pair inferior STEMI + clear lungs + hypotension with V4R and preload preservation.",
      keyTakeaway: "Avoid nitrates in inferior STEMI with suspected RV involvement; obtain right-sided ECG leads and support preload with IV normal saline.",
      relatedTopics: ["STEMI localization", "Right-sided ECG leads", "Primary PCI"],
    },
    tags: ["priority", "pharmacology"],
  }),
  choice({
    exam: "pance", category: "Clinical Intervention", system: "Respiratory", topic: "Community-acquired pneumonia", difficulty: "easy",
    stem: "A previously healthy 29-year-old woman with no comorbidities and no recent antibiotic use presents to an outpatient clinic with 3 days of fever, productive cough, and right lower lobe crackles. Chest radiograph confirms lobar consolidation. Vital signs are stable (CURB-65 score 0). According to current ATS/IDSA guidelines, which outpatient empiric regimen is appropriate?",
    options: [
      ["Amoxicillin 1 g orally three times daily", "High-dose amoxicillin (or doxycycline, or a macrolide only if local pneumococcal resistance is <25%) is first-line for healthy outpatients without comorbidities."],
      ["Levofloxacin 750 mg orally daily", "Respiratory fluoroquinolones are reserved for outpatients with significant comorbidities or recent antibiotic exposure."],
      ["Intravenous vancomycin plus piperacillin-tazobactam", "Broad-spectrum IV therapy is for hospitalized patients with severe CAP and MRSA/Pseudomonas risk factors."],
      ["Trimethoprim-sulfamethoxazole orally twice daily", "TMP-SMX does not provide reliable coverage for Streptococcus pneumoniae in CAP."],
      ["Oseltamivir monotherapy", "Lobar consolidation indicates bacterial CAP requiring antibacterial coverage."],
    ],
    correct: "a",
    rationale: "For healthy outpatients with community-acquired pneumonia (CAP) and no comorbidities or risk factors for drug-resistant pathogens, ATS/IDSA guidelines recommend high-dose amoxicillin (1 g three times daily), doxycycline (100 mg twice daily), or a macrolide only in areas where pneumococcal macrolide resistance is below 25%. Outpatients with chronic heart, lung, liver, or renal disease, diabetes, alcoholism, malignancy, or asplenia should receive combination therapy (beta-lactam plus macrolide/doxycycline) or a respiratory fluoroquinolone.",
    extras: {
      whyCorrect: "High-dose amoxicillin targets Streptococcus pneumoniae in healthy outpatients.",
      strategy: "Stratify CAP treatment by setting (outpatient vs inpatient) and presence of comorbidities.",
      keyTakeaway: "Healthy outpatient CAP: high-dose amoxicillin or doxycycline.",
      relatedTopics: ["CURB-65", "Streptococcus pneumoniae", "Atypical pathogens"],
    },
    tags: ["pharmacology"],
  }),
  choice({
    exam: "pance", category: "Diagnostic Studies", system: "Gastrointestinal", topic: "Acute cholecystitis", difficulty: "easy",
    stem: "A 44-year-old woman presents with persistent right upper quadrant pain, fever, and leukocytosis following a fatty meal, with inspiratory arrest during deep palpation of the right subcostal area. If right upper quadrant ultrasound is equivocal, which test has the highest sensitivity and specificity for confirming acute calculous cholecystitis?",
    options: [
      ["Hepatobiliary iminodiacetic acid (HIDA) scan (cholescintigraphy)", "Nonvisualization of the gallbladder on HIDA scan due to cystic duct obstruction is the gold-standard confirmatory imaging study."],
      ["Supine abdominal radiograph (KUB)", "Most gallstones are radiolucent and not visible on plain radiographs."],
      ["Esophagogastroduodenoscopy (EGD)", "EGD evaluates mucosal disease of the upper GI tract, not cystic duct patency."],
      ["Barium swallow", "Barium studies evaluate esophageal motility and mucosal anatomy."],
      ["Serum CEA level", "CEA is a tumor marker and has no role in acute cholecystitis."],
    ],
    correct: "a",
    rationale: "Right upper quadrant ultrasonography is the initial imaging modality of choice for suspected acute cholecystitis, looking for gallstones, gallbladder wall thickening (>4 mm), pericholecystic fluid, and a sonographic Murphy sign. When ultrasound is nondiagnostic or equivocal, cholescintigraphy (HIDA scan) is the most accurate confirmatory test. Intravenously injected radiotracer is excreted into the bile ducts; failure of the gallbladder to visualize within 60 minutes indicates cystic duct obstruction.",
    extras: {
      whyCorrect: "HIDA scan directly demonstrates cystic duct obstruction.",
      strategy: "Initial test = RUQ ultrasound; most accurate confirmatory test = HIDA scan.",
      keyTakeaway: "Ultrasound first for acute cholecystitis; HIDA scan when ultrasound is equivocal.",
      relatedTopics: ["Murphy sign", "Choledocholithiasis", "MRCP vs ERCP"],
    },
  }),
  choice({
    exam: "pance", category: "Pharmaceutical Therapeutics", system: "Endocrine", topic: "Type 2 diabetes mellitus", difficulty: "moderate",
    stem: "A 58-year-old man with type 2 diabetes mellitus, hypertension, and stage G3a chronic kidney disease (eGFR 52 mL/min/1.73 m², urine albumin-to-creatinine ratio 420 mg/g) has an HbA1c of 7.8% on metformin and lisinopril. Adding which medication class is most strongly recommended to slow CKD progression and reduce heart failure hospitalization?",
    options: [
      ["Sodium-glucose cotransporter-2 (SGLT2) inhibitor (e.g., empagliflozin or dapagliflozin)", "SGLT2 inhibitors reduce intraglomerular pressure, slow CKD progression, and reduce heart failure hospitalization in diabetic kidney disease."],
      ["Sulfonylurea (e.g., glibenclamide)", "Sulfonylureas carry hypoglycemia and weight-gain risk without renoprotective benefit."],
      ["Thiazolidinedione (e.g., pioglitazone)", "TZDs cause fluid retention and can precipitate heart failure."],
      ["Meglitinide (e.g., repaglinide)", "Meglitinides lower postprandial glucose but lack cardiorenal outcome benefits."],
      ["Alpha-glucosidase inhibitor (e.g., acarbose)", "Acarbose has modest glycemic efficacy and no proven renoprotection."],
    ],
    correct: "a",
    rationale: "ADA and KDIGO guidelines recommend an SGLT2 inhibitor with proven kidney and cardiovascular benefit for patients with type 2 diabetes and chronic kidney disease (particularly with albuminuria) when eGFR is ≥20 mL/min/1.73 m². SGLT2 inhibitors restore tubuloglomerular feedback by increasing sodium delivery to the macula densa, causing afferent arteriolar vasoconstriction and reducing intraglomerular hypertension.",
    extras: {
      whyCorrect: "SGLT2 inhibitors provide established cardiorenal protection in albuminuric CKD.",
      strategy: "Match T2DM comorbidities (HF/CKD → SGLT2i; ASCVD/weight loss → GLP-1 RA or SGLT2i).",
      keyTakeaway: "Add an SGLT2 inhibitor for T2DM with albuminuric CKD or heart failure.",
      relatedTopics: ["Tubuloglomerular feedback", "GLP-1 receptor agonists", "Diabetic nephropathy"],
    },
    tags: ["pharmacology"],
  }),
];

/* ------------------------------------------------------------------ */
/* PANRE                                                               */
/* ------------------------------------------------------------------ */
const PANRE: SeedQuestion[] = [
  choice({
    exam: "panre", category: "History Taking and Physical Examination", system: "Neurological", topic: "Cauda equina syndrome", difficulty: "moderate",
    stem: "A 49-year-old man with chronic low back pain presents to the emergency department with 18 hours of bilateral sciatica, numbness over the perineum and inner thighs, and new difficulty initiating urination. Post-void residual bladder volume is 650 mL. Which action is the highest priority?",
    options: [
      ["Obtain emergent lumbar spine MRI and urgent neurosurgical/orthopedic spine consultation", "Saddle anesthesia, bilateral radiculopathy, and urinary retention (overflow incontinence) indicate cauda equina syndrome requiring urgent MRI and surgical decompression."],
      ["Prescribe oral cyclobenzaprine and physical therapy for 4 weeks", "Conservative therapy delays surgical decompression and risks permanent paralysis and incontinence."],
      ["Order outpatient electromyography (EMG) in 2 weeks", "EMG is non-urgent and does not visualize compressive lumbar pathology."],
      ["Perform lumbar puncture at L4-L5 before imaging", "Compressive disc herniation or mass is suspected; MRI is the diagnostic study of choice."],
      ["Administer epidural analgesia and discharge home", "Masking pain without relieving cauda equina compression is unsafe."],
    ],
    correct: "a",
    rationale: "Cauda equina syndrome is a surgical emergency caused by compression of the lumbosacral nerve roots below the conus medullaris, most commonly from a large central intervertebral disc herniation, tumor, or epidural abscess/hematoma. Red-flag features include saddle anesthesia (S2-S5 dermatome numbness), urinary retention with overflow incontinence (the most sensitive clinical finding), decreased rectal tone or fecal incontinence, and bilateral lower-extremity motor weakness or hyporeflexia. Emergent MRI followed by prompt surgical decompression prevents permanent neurologic disability.",
    extras: {
      whyCorrect: "Red-flag triad (urinary retention, saddle anesthesia, bilateral radiculopathy) mandates emergent MRI and decompression.",
      strategy: "Urinary retention + saddle anesthesia in low back pain = emergent MRI.",
      keyTakeaway: "Cauda equina syndrome requires emergent MRI and surgical decompression within 24-48 hours.",
      relatedTopics: ["Conus medullaris syndrome", "Low back pain red flags", "Post-void residual"],
    },
    tags: ["priority", "emergency"],
  }),
  choice({
    exam: "panre", category: "Health Maintenance", system: "Gastrointestinal", topic: "Colorectal cancer screening", difficulty: "easy",
    stem: "An asymptomatic 46-year-old man with no personal history of adenomas or inflammatory bowel disease and no family history of colorectal cancer asks when he should begin average-risk colorectal cancer screening. According to current USPSTF recommendations, at what age should screening start?",
    options: [
      ["Age 45", "USPSTF recommends starting average-risk colorectal cancer screening at age 45."],
      ["Age 50", "The starting age for average-risk adults was lowered from 50 to 45."],
      ["Age 40", "Age 40 applies to individuals with a first-degree relative diagnosed with CRC (or 10 years before the relative's diagnosis)."],
      ["Age 55", "Waiting until 55 misses early-onset colorectal neoplasia."],
      ["Age 60", "Average-risk screening begins at 45 and continues through 75."],
    ],
    correct: "a",
    rationale: "The US Preventive Services Task Force (USPSTF) recommends screening for colorectal cancer in all average-risk adults aged 45 to 75 years, with individualized decision-making for ages 76 to 85. Acceptable screening intervals include colonoscopy every 10 years, annual high-sensitivity fecal immunochemical test (FIT), stool DNA-FIT every 1-3 years, or CT colonography every 5 years. If a first-degree relative had colorectal cancer, screening begins at age 40 or 10 years earlier than the youngest affected relative's diagnosis, whichever comes first.",
    extras: {
      whyCorrect: "Average-risk CRC screening starts at age 45.",
      strategy: "Distinguish average-risk (45) from family-history high-risk (40 or 10 years prior).",
      keyTakeaway: "Average-risk colorectal cancer screening: ages 45-75.",
      relatedTopics: ["USPSTF screening guidelines", "Colonoscopy intervals", "Lynch syndrome"],
    },
  }),
  choice({
    exam: "panre", category: "Clinical Intervention", system: "Cardiovascular", topic: "Atrial fibrillation", difficulty: "moderate",
    stem: "A 71-year-old woman with hypertension and diabetes mellitus presents with palpitations and is found to have new-onset nonvalvular atrial fibrillation with a ventricular rate of 108/min and blood pressure of 136/82 mmHg. Beyond rate control, which long-term therapy is indicated to reduce stroke risk?",
    options: [
      ["Direct oral anticoagulant (DOAC) such as apixaban or rivaroxaban", "Her CHA2DS2-VASc score is 4 (age 65-74 = 1, female = 1, HTN = 1, DM = 1), indicating oral anticoagulation, with DOACs preferred over warfarin in nonvalvular AF."],
      ["Low-dose aspirin monotherapy", "Aspirin monotherapy is not recommended for stroke prevention in atrial fibrillation."],
      ["Immediate unsynchronized defibrillation", "She is hemodynamically stable, and defibrillation is never unsynchronized in AF."],
      ["No antithrombotic therapy because her heart rate is under 110/min", "Stroke risk depends on CHA2DS2-VASc risk factors, not ventricular rate."],
      ["Subcutaneous unfractionated heparin for life", "DOACs are the standard outpatient oral anticoagulants."],
    ],
    correct: "a",
    rationale: "Thromboembolic stroke prevention in nonvalvular atrial fibrillation is guided by the CHA2DS2-VASc score. Oral anticoagulation is recommended for scores ≥2 in men and ≥3 in women. This patient has hypertension (+1), diabetes (+1), age 65-74 (+1), and female sex (+1) for a score of 4. Direct oral anticoagulants (apixaban, rivaroxaban, dabigatran, edoxaban) are preferred over warfarin except in patients with mechanical heart valves or moderate-to-severe mitral stenosis.",
    extras: {
      whyCorrect: "CHA2DS2-VASc = 4 mandates oral anticoagulation; DOACs are first-line in nonvalvular AF.",
      strategy: "Calculate CHA2DS2-VASc and verify there is no mechanical valve or moderate-to-severe mitral stenosis.",
      keyTakeaway: "Nonvalvular AF with elevated CHA2DS2-VASc: DOAC first-line over warfarin or aspirin.",
      relatedTopics: ["CHA2DS2-VASc score", "Valvular atrial fibrillation", "Rate vs rhythm control"],
    },
    tags: ["pharmacology"],
  }),
];

export const CLINICAL_EXAMS: SeedQuestion[] = [
  ...NCLEX_PN,
  ...FNP,
  ...CLINICAL_MATH,
  ...STEP1,
  ...STEP2,
  ...STEP3,
  ...COMLEX1,
  ...COMLEX2,
  ...UKMLA,
  ...PLAB,
  ...ABIM,
  ...ABFM,
  ...DAT,
  ...INBDE,
  ...NBDE,
  ...DENTAL_ANATOMY,
  ...DENTAL_SCIENCES,
  ...NAPLEX,
  ...MPJE,
  ...CPJE,
  ...PANCE,
  ...PANRE,
];

