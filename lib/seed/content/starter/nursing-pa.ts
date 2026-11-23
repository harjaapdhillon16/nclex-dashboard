/**
 * Original starter practice content for NCLEX-PN, FNP, Clinical Medical Mathematics, PANCE and PANRE.
 * Everything here is written from scratch for this app; none of it is copied from commercial
 * question banks, official sample items or copyrighted prep material.
 */
import type { Difficulty, SeedQuestion } from "@/lib/questions/types";
import type { SeedMaterial, SeedFlashcard } from "../materials";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const IDS = ["a", "b", "c", "d", "e", "f", "g"];
/** [option text, explanation] */
type Opt = [string, string];

let seedCounter = 7;
function rng() {
  // mulberry32, deterministic so the seed data is stable between runs
  seedCounter = (seedCounter + 0x6d2b79f5) | 0;
  let t = seedCounter;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeBuilders(exam: string) {
  return {
    mcq(
      category: string, topic: string, difficulty: Difficulty, stem: string,
      right: Opt, wrong: Opt[], rationale: string, takeaway: string, tags: string[] = [],
    ): SeedQuestion {
      const all = shuffle([{ o: right, ok: true }, ...wrong.map((o) => ({ o, ok: false }))]);
      const options = all.map((x, i) => ({ id: IDS[i], text: x.o[0] }));
      const optionExplanations = Object.fromEntries(all.map((x, i) => [IDS[i], x.o[1]]));
      const correct = IDS[all.findIndex((x) => x.ok)];
      return {
        exam, category, topic, type: "mcq", difficulty, stem,
        content: { options }, answer: { correct }, rationale, optionExplanations,
        extras: { whyCorrect: right[1], keyTakeaway: takeaway }, tags,
      };
    },
    sata(
      category: string, topic: string, difficulty: Difficulty, stem: string,
      right: Opt[], wrong: Opt[], rationale: string, takeaway: string, tags: string[] = [],
    ): SeedQuestion {
      const all = shuffle([...right.map((o) => ({ o, ok: true })), ...wrong.map((o) => ({ o, ok: false }))]);
      const options = all.map((x, i) => ({ id: IDS[i], text: x.o[0] }));
      const optionExplanations = Object.fromEntries(all.map((x, i) => [IDS[i], x.o[1]]));
      const correct = all.flatMap((x, i) => (x.ok ? [IDS[i]] : []));
      return {
        exam, category, topic, type: "sata", difficulty, stem,
        content: { options }, answer: { correct }, rationale, optionExplanations,
        extras: { keyTakeaway: takeaway }, tags,
      };
    },
    num(
      category: string, topic: string, difficulty: Difficulty, stem: string,
      value: number, tolerance: number, unit: string, decimals: number,
      rationale: string, takeaway: string, tags: string[] = [],
    ): SeedQuestion {
      return {
        exam, category, topic, type: "numeric", difficulty, stem,
        content: { unit, decimals }, answer: { value, tolerance }, rationale,
        extras: { keyTakeaway: takeaway }, tags: ["calculation", ...tags],
      };
    },
    ord(
      category: string, topic: string, difficulty: Difficulty, stem: string,
      steps: Opt[], rationale: string, takeaway: string, tags: string[] = [],
    ): SeedQuestion {
      let shuffled = shuffle(steps.map((s, i) => ({ s, i })));
      if (shuffled.every((x, i) => x.i === i)) shuffled = [...shuffled.slice(1), shuffled[0]];
      const items = shuffled.map((x, i) => ({ id: IDS[i], text: x.s[0] }));
      const optionExplanations = Object.fromEntries(shuffled.map((x, i) => [IDS[i], x.s[1]]));
      const order = steps.map((_, i) => IDS[shuffled.findIndex((x) => x.i === i)]);
      return {
        exam, category, topic, type: "ordered", difficulty, stem,
        content: { items }, answer: { order }, rationale, optionExplanations,
        extras: { keyTakeaway: takeaway }, tags,
      };
    },
  };
}

function lesson(
  exam: string, category: string, topic: string, kind: "notes" | "guide",
  title: string, summary: string, durationMinutes: number, body: string,
): SeedMaterial {
  return { exam, category, topic, kind, title, summary, body: body.trim(), durationMinutes };
}

function cardsFor(exam: string, category: string, topic: string, pairs: [string, string][]): SeedFlashcard[] {
  return pairs.map(([front, back]) => ({ exam, category, topic, front, back }));
}

/* ------------------------------------------------------------------ */
/* NCLEX-PN questions                                                  */
/* ------------------------------------------------------------------ */
const CC = "Coordinated Care";
const SAF = "Safety and Infection Prevention and Control";
const HPM = "Health Promotion and Maintenance";
const PSY = "Psychosocial Integrity";
const BCC = "Basic Care and Comfort";
const PHA = "Pharmacological Therapies";
const RRP = "Reduction of Risk Potential";
const PHY = "Physiological Adaptation";

const pn = makeBuilders("nclex-pn");

const PN_QUESTIONS: SeedQuestion[] = [
  // ---- Coordinated Care (4)
  pn.mcq(CC, "Delegation", "moderate",
    "The charge nurse is making assignments on a medical unit. Which client is most appropriate to assign to the practical nurse (PN)?",
    ["A client with stable chronic obstructive pulmonary disease who needs scheduled oral medications and vital signs", "A stable client with a long-standing diagnosis and a predictable plan of care falls within the PN's scope of practice."],
    [
      ["A client newly admitted with chest pain who needs a comprehensive initial assessment", "Initial comprehensive assessment and care-plan development are responsibilities of the registered nurse."],
      ["A client with new confusion, falling blood pressure and a rising heart rate", "An unstable client with changing status needs frequent assessment and judgment by the RN."],
      ["A client who needs an individualized discharge-teaching plan developed for a new colostomy", "Developing a teaching plan requires RN-level assessment and planning, although the PN can reinforce teaching."],
    ],
    "PNs care for clients who are stable with predictable outcomes under the direction of an RN or provider. Initial assessments, care planning and care of unstable or rapidly changing clients stay with the RN. Match the complexity of the client to the licensed nurse's scope.",
    "Stable and predictable goes to the PN; unstable, new and planning-heavy goes to the RN.", ["delegation", "scope of practice"]),
  pn.mcq(CC, "Informed consent", "easy",
    "A client scheduled for surgery tells the PN, \"I am not sure what the risks are, but I guess I should sign the form.\" What is the PN's best action?",
    ["Notify the provider that the client needs further explanation before signing", "The provider who performs the procedure is responsible for explaining risks, benefits and alternatives, so the client's uncertainty must be reported before consent is obtained."],
    [
      ["Explain the major surgical risks to the client in simple terms", "Providing the content of informed consent is the provider's duty; the nurse should not substitute their own explanation."],
      ["Witness the signature and reassure the client that the surgeon is skilled", "A signature does not equal informed consent if the client does not understand; reassurance does not fix this."],
      ["Tell the client that signing is required and can be reversed after surgery", "Consent must be voluntary and informed; telling the client it is required is coercive and inaccurate."],
    ],
    "Valid informed consent requires that the client is competent, voluntarily agrees, and understands the procedure, its risks, benefits and alternatives. The provider obtains consent; the nurse may witness the signature and acts as an advocate by reporting any sign that the client does not understand. Advocacy means stopping to get the client the information they need.",
    "The provider informs; the nurse witnesses and advocates when the client is unsure.", ["informed consent", "advocacy"]),
  pn.mcq(CC, "Prioritization", "moderate",
    "Four clients need attention at the start of the shift. Which client should the PN see first?",
    ["A client who suddenly has a drooping face and slurred speech", "New facial droop and speech change suggest an acute stroke, which is time-critical and carries the highest risk if care is delayed."],
    [
      ["A client with surgical pain rated 6 out of 10 who is due for scheduled analgesia", "Pain needs attention, but it is expected and not immediately life-threatening."],
      ["A client who asks for a laxative for mild constipation", "A non-urgent comfort request can wait."],
      ["A client with stable vital signs who is waiting to be discharged", "A stable client waiting for discharge can safely be seen later."],
    ],
    "Prioritize by risk of harm: acute, unexpected changes involving airway, breathing, circulation or neurologic function come before expected, stable or comfort-related needs. Sudden neurologic deficits are time-sensitive because treatment options depend on how quickly the problem is recognized.",
    "Sudden neurologic change outranks expected pain, comfort requests and stable clients.", ["priority"]),
  pn.sata(CC, "Confidentiality", "moderate",
    "Which actions by the PN protect client confidentiality? Select all that apply.",
    [
      ["Lower the voice and close the door when discussing a client's plan of care", "Limiting who can overhear a conversation protects private information."],
      ["Log out of the electronic record before leaving the computer", "An open record can be viewed by unauthorized people."],
      ["Access the records only of clients assigned to your care", "Access should be limited to what is needed to provide care."],
    ],
    [
      ["Discuss a client's diagnosis in the cafeteria with a coworker from another unit", "Public places allow others to overhear and the coworker has no need to know."],
      ["Give lab results to a telephone caller who says he is the client's cousin", "Information must not be released without verifying that the client authorized it."],
    ],
    "Confidentiality means sharing client information only with those who need it for care or who are authorized by the client. Physical and electronic safeguards, along with need-to-know access, are expected of every nurse.",
    "Need-to-know only: secure screens, private conversations and verified authorization.", ["confidentiality", "privacy"]),

  // ---- Safety and Infection Prevention and Control (4)
  pn.mcq(SAF, "Standard precautions", "easy",
    "Which action by the PN is consistent with standard precautions?",
    ["Perform hand hygiene immediately after removing gloves", "Gloves do not replace hand hygiene; hands can become contaminated during glove removal."],
    [
      ["Recap used needles with both hands to prevent sticks", "Needles should not be recapped; they go directly into a sharps container."],
      ["Wear gloves only for clients with a known infection", "Standard precautions apply to all clients, whether or not an infection is known."],
      ["Reserve hand hygiene for times when hands look visibly soiled", "Hand hygiene is required at defined moments of care even when hands look clean."],
    ],
    "Standard precautions treat blood, body fluids, nonintact skin and mucous membranes as potentially infectious for every client. Hand hygiene before and after client contact and after glove removal is the single most effective measure. Sharps are never recapped by hand.",
    "Standard precautions apply to every client; hand hygiene follows glove removal.", ["infection control"]),
  pn.mcq(SAF, "Transmission-based precautions", "moderate",
    "A client is admitted with suspected measles (rubeola). Which room and equipment should the PN ensure?",
    ["A private negative-pressure room and an N95 respirator for staff", "Measles is spread by the airborne route, requiring an airborne infection isolation room and respiratory protection."],
    [
      ["A private room with a surgical mask for staff", "A surgical mask is used for droplet precautions and does not protect against airborne particles."],
      ["A semiprivate room with a gown and gloves for staff", "Gown and gloves reflect contact precautions, which do not address airborne spread."],
      ["Any available room, because standard precautions are enough", "Measles is highly contagious and requires transmission-based precautions in addition to standard precautions."],
    ],
    "Airborne diseases such as measles, tuberculosis and varicella remain suspended in air over long distances and require a negative-pressure room with the door closed. Staff wear a fitted N95 or higher respirator. Match the organism's route of spread to the precaution category.",
    "Measles, TB and varicella: airborne, negative-pressure room, N95.", ["infection control", "isolation"]),
  pn.sata(SAF, "Fall prevention", "moderate",
    "A PN is planning fall precautions for an older adult who is confused and unsteady. Which interventions are appropriate? Select all that apply.",
    [
      ["Keep the bed in the lowest position with wheels locked", "A low, stable bed reduces injury if the client attempts to get out."],
      ["Place the call light within reach and review its use often", "Easy access to help reduces unassisted attempts to stand."],
      ["Provide nonskid footwear when the client is out of bed", "Proper footwear improves traction and stability."],
      ["Offer toileting on a regular schedule", "Many falls occur on the way to the bathroom, and scheduled toileting reduces urgency."],
    ],
    [
      ["Raise all four side rails whenever the client is in bed", "Full side rails can act as a restraint and increase the severity of falls when a client climbs over them."],
      ["Keep the room dark at all times so the client will sleep", "A dark room increases the risk of falling; adequate night lighting is advised."],
    ],
    "Fall prevention focuses on environment, assistance and addressing causes such as toileting needs, footwear and orientation. Full side rails and darkness can raise risk rather than lower it.",
    "Low bed, call light, nonskid footwear, toileting schedule; avoid full rails and darkness.", ["safety", "fall prevention"]),
  pn.mcq(SAF, "Restraints", "difficult",
    "A confused client keeps pulling at an IV catheter. Before requesting a restraint order, what should the PN do first?",
    ["Try less restrictive measures such as covering the IV site, reorienting the client and increasing observation", "Restraints are a last resort; alternatives must be tried and documented first."],
    [
      ["Apply a wrist restraint and obtain the order afterward", "Restraints need a provider order and justification, and alternatives come first except in an emergency."],
      ["Tell the client that restraints will be used if the behavior continues", "Threatening the client is not therapeutic and could be considered coercion."],
      ["Ask the family to hold the client's hands while visiting", "This does not provide safe, ongoing management and places responsibility on the family."],
    ],
    "The least restrictive intervention that keeps the client safe must be used. Examples include camouflaging lines, using mitts per policy, frequent reorientation, a sitter and addressing unmet needs such as pain or toileting. Restraints require an order, close monitoring and regular reassessment of the need.",
    "Least restrictive first; restraints are a documented last resort.", ["restraints", "safety"]),

  // ---- Health Promotion and Maintenance (3)
  pn.mcq(HPM, "Growth and development", "easy",
    "A 2-year-old repeatedly says \"no\" and insists on doing tasks alone. How should the PN interpret this behavior?",
    ["It is typical toddler autonomy; offering limited choices supports development", "Toddlers are working on autonomy versus shame and doubt, and limited choices let them feel in control safely."],
    [
      ["It is a sign of a developmental delay requiring referral", "Negativism and independence-seeking are expected at this age."],
      ["It shows the parents are not setting limits", "The behavior is normal and not necessarily a parenting problem."],
      ["It should be firmly discouraged to avoid habits of defiance", "Suppressing autonomy can lead to shame and doubt rather than skill building."],
    ],
    "Toddlers (1 to 3 years) develop autonomy through exploration and saying no. Parents can promote healthy development by giving two acceptable choices, using consistent routines and keeping the environment safe.",
    "Toddler = autonomy: offer limited choices, keep routines.", ["development", "pediatrics"]),
  pn.mcq(HPM, "Immunizations", "moderate",
    "A woman who is 10 weeks pregnant asks whether she can receive the measles, mumps and rubella (MMR) vaccine today. What is the PN's best response?",
    ["Explain that MMR is a live vaccine and is not given during pregnancy", "Live attenuated vaccines are avoided in pregnancy because of a theoretical risk to the fetus."],
    [
      ["Give the vaccine because it protects both mother and baby", "Live vaccines are generally deferred until after delivery."],
      ["Give half of the usual dose to lower the risk", "Dose splitting is not a recognized practice."],
      ["Administer it only in the second trimester", "Trimester does not make a live vaccine acceptable."],
    ],
    "Live vaccines (MMR, varicella) are contraindicated in pregnancy and in severely immunocompromised clients. The client should be advised to avoid becoming pregnant for a period after receipt and to receive immunity-building vaccines after delivery if needed.",
    "Live vaccines (MMR, varicella) are deferred in pregnancy.", ["immunization", "pregnancy"]),
  pn.mcq(HPM, "Prenatal care", "difficult",
    "A client at 32 weeks of gestation reports a severe headache, blurred vision and sudden swelling of her face and hands. What should the PN do first?",
    ["Notify the provider immediately because these may be signs of preeclampsia", "Headache, visual disturbance and swelling in late pregnancy may indicate preeclampsia, which is dangerous to mother and fetus."],
    [
      ["Teach her to rest with her feet elevated and call if symptoms persist", "Delaying evaluation can allow progression to eclampsia or other complications."],
      ["Reassure her that these symptoms are common in late pregnancy", "Severe headache with visual change is not a normal pregnancy finding."],
      ["Advise her to take acetaminophen and drink more water", "This treats the symptom without evaluating a potentially life-threatening condition."],
    ],
    "Preeclampsia typically presents after 20 weeks with elevated blood pressure and may include severe headache, visual changes, epigastric pain, rapid weight gain and edema of the face and hands. These warning signs need prompt evaluation of blood pressure and urine protein by the provider.",
    "Late-pregnancy headache plus visual change plus edema: report immediately.", ["prenatal", "priority"]),

  // ---- Psychosocial Integrity (4)
  pn.mcq(PSY, "Therapeutic communication", "easy",
    "A client scheduled for surgery says, \"I am really worried about tomorrow.\" Which response by the PN is most therapeutic?",
    ["\"What about the surgery is worrying you most?\"", "An open-ended, focused question encourages the client to explore the specific concern."],
    [
      ["\"Don't worry, everything will be fine.\"", "False reassurance dismisses the client's feelings."],
      ["\"Why are you worried? The surgeon is excellent.\"", "A 'why' question can feel judgmental, and the comment redirects away from the client's feelings."],
      ["\"Many people are nervous. Try to think about something else.\"", "Telling the client to avoid the topic shuts down communication."],
    ],
    "Therapeutic communication uses open-ended questions, reflection and active listening to help clients express feelings. Reassurances, advice and 'why' questions are common nontherapeutic responses that block exploration.",
    "Open-ended and focused on the client's feelings beats reassurance.", ["communication"]),
  pn.mcq(PSY, "Coping mechanisms", "moderate",
    "After learning that his biopsy is positive for cancer, a client shouts at the PN about the late lunch tray. Which defense mechanism is this?",
    ["Displacement", "Displacement redirects feelings from the real source of distress onto a safer or less threatening target."],
    [
      ["Denial", "Denial would involve refusing to acknowledge the diagnosis."],
      ["Regression", "Regression is a return to behavior typical of an earlier developmental stage."],
      ["Sublimation", "Sublimation channels unacceptable impulses into socially acceptable activities."],
    ],
    "Displacement transfers emotion, such as anger or fear, from the real source to an unrelated person or object. The nurse should respond calmly, recognize that the anger is not personal and help the client explore the underlying feelings.",
    "Displacement = misdirected emotion onto a safer target.", ["coping", "defense mechanisms"]),
  pn.mcq(PSY, "Grief and loss", "moderate",
    "A client recently told he has a terminal illness says, \"If I can just live until my daughter's wedding, I'll never miss another doctor's visit.\" Which stage of grief is this?",
    ["Bargaining", "Bargaining involves attempts to negotiate a delay or change in exchange for good behavior."],
    [
      ["Denial", "Denial would involve refusing to accept the diagnosis."],
      ["Anger", "Anger is typically directed at others or at the situation."],
      ["Acceptance", "Acceptance involves coming to terms with the reality rather than negotiating."],
    ],
    "Kubler-Ross described denial, anger, bargaining, depression and acceptance. People do not always move through them in order. The nurse should listen without judgment and support each response as a normal part of coping.",
    "Bargaining: 'If I do X, then I can have Y.'", ["grief"]),
  pn.mcq(PSY, "Substance-use disorders", "difficult",
    "A client with a history of heavy daily alcohol use was admitted 2 days ago and now has tremors, sweating, a heart rate of 112 and agitation. What is the PN's priority action?",
    ["Report the findings and monitor vital signs and withdrawal symptoms closely with seizure precautions", "These signs indicate alcohol withdrawal, which can progress to seizures and delirium tremens; close monitoring and prompt treatment are essential."],
    [
      ["Encourage the client to attend a support group meeting", "Long-term support is valuable but does not address the immediate risk."],
      ["Offer strong coffee to calm the client", "Caffeine can worsen tremors, tachycardia and agitation."],
      ["Apply restraints so the client cannot hurt himself", "Restraints can increase agitation and injury; less restrictive safety measures should be used."],
    ],
    "Alcohol withdrawal typically begins within hours to a few days after the last drink and ranges from tremor and anxiety to seizures and delirium tremens. Assess with a validated withdrawal scale per facility policy, monitor vital signs, maintain a safe low-stimulation environment and give medications as ordered.",
    "Withdrawal can be life-threatening: monitor, report, seizure precautions.", ["safety", "priority"]),

  // ---- Basic Care and Comfort (3)
  pn.mcq(BCC, "Mobility", "moderate",
    "The PN is teaching a client with weakness of the left leg how to use a cane. In which hand should the client hold the cane?",
    ["The right hand, which is opposite the weak leg", "The cane on the stronger side moves with the weak leg and provides a wider base of support."],
    [
      ["The left hand, on the same side as the weak leg", "A cane on the weak side shifts weight in the wrong direction and reduces stability."],
      ["Either hand, whichever feels more comfortable", "Position matters for safe gait."],
      ["Both hands, using the cane as a walker", "A single cane is not designed for two-handed use."],
    ],
    "A cane is held on the stronger side. The cane and the weaker leg advance together, then the stronger leg follows. This pattern lets the stronger leg and cane share weight when the weak leg is bearing load.",
    "Cane goes on the strong side; cane and weak leg move together.", ["mobility", "teaching"]),
  pn.mcq(BCC, "Nutrition", "moderate",
    "A client newly diagnosed with celiac disease asks which foods to avoid. Which food should the PN include on the list of foods to avoid?",
    ["Whole-wheat bread", "Wheat, barley and rye contain gluten, which triggers intestinal damage in celiac disease."],
    [
      ["Plain grilled chicken", "Plain meats are naturally gluten-free."],
      ["Steamed rice", "Rice is naturally gluten-free."],
      ["Fresh apples", "Fresh fruits and vegetables are naturally gluten-free."],
    ],
    "Celiac disease requires lifelong avoidance of gluten found in wheat, barley and rye. Clients should also read labels because gluten can be hidden in sauces, processed foods and some medications.",
    "No wheat, barley or rye; read labels for hidden gluten.", ["nutrition", "teaching"]),
  pn.sata(BCC, "Elimination", "moderate",
    "The PN is caring for a client with an indwelling urinary catheter. Which actions help prevent catheter-associated urinary tract infection? Select all that apply.",
    [
      ["Keep the drainage bag below the level of the bladder", "This prevents backflow of urine into the bladder."],
      ["Keep the drainage tubing free of kinks and dependent loops", "Unobstructed flow prevents urine stasis."],
      ["Provide routine hygiene of the perineal area with soap and water", "Good hygiene lowers the number of organisms at the meatus."],
      ["Ensure the drainage bag does not touch the floor", "Contact with the floor contaminates the system."],
    ],
    [
      ["Disconnect the catheter from the tubing daily to irrigate it", "Breaking the closed system increases infection risk."],
      ["Raise the bag above the bladder when ambulating", "Raising the bag allows contaminated urine to flow back toward the bladder."],
    ],
    "Catheter-associated infections are reduced by maintaining a closed, gravity-dependent drainage system, regular hygiene and prompt removal of the catheter when no longer needed.",
    "Closed system, bag below bladder, off the floor, daily hygiene.", ["infection control", "elimination"]),

  // ---- Pharmacological Therapies (4)
  pn.mcq(PHA, "Medication administration", "moderate",
    "Before giving a scheduled dose of digoxin to an adult, the PN counts an apical pulse of 54 beats per minute. What should the PN do?",
    ["Hold the dose and notify the provider or RN", "Digoxin slows the heart rate; an adult apical rate below 60 may indicate toxicity or excessive effect, so the dose is held and reported."],
    [
      ["Give the dose and recheck the pulse in an hour", "Giving a dose before clarification could worsen bradycardia."],
      ["Give half of the dose", "Nurses do not alter doses without an order."],
      ["Give the dose with a potassium-rich food", "Food does not correct the problem and digoxin toxicity risk increases with low potassium."],
    ],
    "Digoxin has a narrow therapeutic range. Before administration, count the apical pulse for a full minute. A rate below the parameter (commonly 60 in adults), new dysrhythmia or symptoms such as nausea and visual changes require holding the drug and reporting.",
    "Apical pulse below 60 in adults: hold digoxin and report.", ["medication safety", "cardiac"]),
  pn.num(PHA, "Dosage calculations", "moderate",
    "The provider orders amoxicillin 750 mg by mouth. The pharmacy supplies a suspension labeled 250 mg per 5 mL. How many mL should the PN administer?",
    15, 0.1, "mL", 0,
    "Use dose desired over dose on hand times volume: (750 mg / 250 mg) x 5 mL = 3 x 5 mL = 15 mL.",
    "Desired over have, times the volume: 750/250 x 5 = 15 mL.", ["dosage"]),
  pn.sata(PHA, "Adverse effects", "difficult",
    "A client is taking warfarin. Which findings should the PN report as possible signs of bleeding? Select all that apply.",
    [
      ["Black, tarry stools", "Melena suggests bleeding in the upper gastrointestinal tract."],
      ["Nosebleeds that are hard to stop", "Persistent epistaxis can reflect over-anticoagulation."],
      ["Pink or red urine", "Hematuria is a sign of bleeding."],
      ["Large bruises with no known injury", "Unexplained bruising suggests impaired clotting."],
    ],
    [
      ["Mild constipation for two days", "This is not associated with warfarin bleeding."],
      ["Increased appetite", "This is not a sign of bleeding."],
    ],
    "Warfarin lowers clotting factors, and the main adverse effect is bleeding. Clients should report black or bloody stools, blood in urine, prolonged nosebleeds, gum bleeding, unusual bruising and any head injury. The INR is monitored regularly.",
    "Warfarin: watch for bleeding anywhere, monitor INR.", ["anticoagulant", "adverse effects"]),
  pn.mcq(PHA, "Expected actions", "easy",
    "The PN is giving furosemide to a client with heart failure. Which finding best indicates the drug is having its expected effect?",
    ["Increased urine output and a decrease in weight and edema", "Furosemide is a loop diuretic that removes sodium and water, so greater urine output with less fluid overload shows effectiveness."],
    [
      ["Increased heart rate and blood pressure", "These are not intended effects of a diuretic."],
      ["Decreased serum potassium", "This is a known adverse effect, not the therapeutic goal."],
      ["Increased thirst", "This is a possible side effect rather than a sign of benefit."],
    ],
    "Loop diuretics reduce fluid overload. Evaluate effectiveness by intake and output, daily weights, edema, lung sounds and blood pressure. Monitor potassium because loop diuretics can cause hypokalemia.",
    "Diuretic success: more urine, less weight, less edema.", ["pharmacology", "evaluation"]),

  // ---- Reduction of Risk Potential (4)
  pn.mcq(RRP, "Laboratory values", "moderate",
    "A client with atrial fibrillation takes warfarin and has an INR of 2.5. How should the PN interpret this result?",
    ["The INR is within the typical therapeutic range of 2.0 to 3.0", "For most indications such as atrial fibrillation, the target INR is 2.0 to 3.0."],
    [
      ["The INR is too high and the dose must be held", "An INR of 2.5 is not supratherapeutic for this indication."],
      ["The INR is too low and the dose must be increased", "An INR of 2.5 is within the usual target range."],
      ["The INR measures liver function and is unrelated to warfarin", "INR is the standard monitor for warfarin therapy."],
    ],
    "Warfarin is monitored using the INR. For most conditions, including atrial fibrillation and venous thromboembolism, the target range is 2.0 to 3.0; some mechanical valves require higher targets. The provider sets the individual goal.",
    "Warfarin goal INR is usually 2.0 to 3.0.", ["laboratory", "anticoagulant"]),
  pn.mcq(RRP, "Diagnostic tests", "moderate",
    "A client has returned from cardiac catheterization through the femoral artery. Which nursing action is most important?",
    ["Keep the affected leg straight and monitor the groin site and distal pulses", "Keeping the leg straight protects the puncture site, and frequent checks detect bleeding or vascular compromise."],
    [
      ["Encourage the client to sit up and walk to the bathroom immediately", "Early ambulation can disrupt clot formation and cause bleeding."],
      ["Remove the pressure dressing after 15 minutes", "Dressings are removed per provider or facility protocol, not on a short timer."],
      ["Restrict oral fluids for 24 hours", "Fluids are usually encouraged to help clear contrast."],
    ],
    "After arterial catheterization, bleeding or hematoma at the site and decreased perfusion of the leg are the main risks. Assess vital signs, the site and distal pulses, color, temperature and sensation. Maintain bed rest and a straight leg for the ordered time.",
    "After femoral access: straight leg, check site and pulses.", ["diagnostic test", "post-procedure"]),
  pn.mcq(RRP, "Vital signs", "difficult",
    "A client receiving a morphine patient-controlled analgesia (PCA) pump is difficult to arouse and has a respiratory rate of 8 breaths per minute. What should the PN do first?",
    ["Stimulate the client to breathe, stop the pump and notify the RN or provider", "Opioid-induced respiratory depression is an emergency; stimulating the client and stopping further doses protects the airway while help is called."],
    [
      ["Document the finding and recheck in 30 minutes", "Delay allows hypoxia to progress."],
      ["Give a bolus of the PCA to relieve discomfort", "Giving more opioid would worsen respiratory depression."],
      ["Place the client flat to improve blood flow to the brain", "Positioning flat can worsen airway obstruction in a sedated client."],
    ],
    "Respiratory depression is the most serious adverse effect of opioids. Assess sedation and respirations, stimulate the client, stop the infusion and call for help. An opioid antagonist such as naloxone is given by order. Continue to monitor until respirations recover.",
    "Sedated with slow respirations on opioids: stimulate, stop the drug, call.", ["priority", "opioid"]),
  pn.mcq(RRP, "Potential complications", "moderate",
    "On the second day after hip surgery, a client reports calf pain, and the PN notes the left calf is warm, swollen and red. What should the PN do?",
    ["Keep the client on bed rest and notify the provider because of a possible deep vein thrombosis", "These findings suggest a deep vein thrombosis; activity could dislodge a clot, so rest and prompt reporting are needed."],
    [
      ["Massage the calf to improve circulation", "Massage can dislodge a clot and cause pulmonary embolism."],
      ["Encourage ambulation in the hall to prevent clots", "Walking is avoided until a DVT is excluded or treated."],
      ["Apply a heating pad and reassess in 4 hours", "Heat does not solve the problem and delays evaluation."],
    ],
    "Surgery, immobility and certain orthopedic procedures raise the risk of deep vein thrombosis. Warmth, swelling, redness and calf pain are classic findings. Never massage the leg. Prompt reporting allows imaging and anticoagulation to prevent pulmonary embolism.",
    "Suspected DVT: no massage, rest, report.", ["postoperative", "complication"]),

  // ---- Physiological Adaptation (4)
  pn.mcq(PHY, "Fluid and electrolyte imbalance", "moderate",
    "A client with kidney failure has a serum potassium of 6.4 mEq/L. Which finding should the PN expect on the electrocardiogram?",
    ["Tall, peaked T waves", "Hyperkalemia causes peaked T waves and can progress to widened QRS and life-threatening dysrhythmias."],
    [
      ["Flattened T waves with U waves", "These are characteristic of hypokalemia."],
      ["A shortened PR interval with delta waves", "This is typical of Wolff-Parkinson-White syndrome, not electrolyte disturbance."],
      ["Normal sinus rhythm with no changes", "A potassium this high usually produces ECG changes and demands urgent attention."],
    ],
    "Hyperkalemia is dangerous because it impairs cardiac conduction. ECG changes include peaked T waves, flattened P waves, prolonged PR and widened QRS. Treatment is ordered by the provider and may include calcium, insulin with glucose and potassium-removing measures.",
    "Hyperkalemia: peaked T waves; hypokalemia: flat T and U waves.", ["electrolytes", "ECG"]),
  pn.ord(PHY, "Medical emergencies", "difficult",
    "A PN finds an adult client unresponsive in bed in a hospital room. Place the following actions in the correct order.",
    [
      ["Check for responsiveness and check for breathing", "Quickly confirm that the client is unresponsive and not breathing normally."],
      ["Call for help and activate the emergency response team", "Early activation brings the team and defibrillator."],
      ["Check for a carotid pulse for no more than 10 seconds", "A brief pulse check confirms cardiac arrest without delaying compressions."],
      ["Begin chest compressions", "High-quality compressions should start immediately if no pulse is felt."],
      ["Use the AED as soon as it arrives", "Early defibrillation improves survival from shockable rhythms."],
    ],
    "In a witnessed or discovered arrest, the sequence is to confirm the emergency, call for help, check the pulse briefly, start compressions and attach a defibrillator promptly. Delays in compressions or defibrillation reduce survival.",
    "Recognize, call, check pulse (10 s max), compress, defibrillate.", ["emergency", "cardiac arrest"]),
  pn.mcq(PHY, "Alterations in body systems", "moderate",
    "A client with chronic obstructive pulmonary disease is receiving oxygen. Which flow rate should the PN expect to be prescribed?",
    ["Low flow, typically 1 to 3 L/min by nasal cannula", "Clients with chronic CO2 retention may lose respiratory drive with high oxygen; low flow targets modest saturation."],
    [
      ["High flow, 10 to 15 L/min by nonrebreather mask", "High oxygen concentrations can suppress respiratory drive in retainers."],
      ["No oxygen, because it is harmful in COPD", "Oxygen is given to treat hypoxemia, carefully titrated."],
      ["A flow rate set by the client as needed", "Oxygen is a medication and flow is prescribed and titrated by provider order."],
    ],
    "Oxygen therapy in COPD aims for saturations around 88 to 92 percent unless the provider specifies otherwise. Monitor for increasing drowsiness and headache as signs of CO2 retention. Never withhold oxygen from a client in distress; notify the provider if the target cannot be reached.",
    "COPD: titrate low-flow oxygen to the ordered target.", ["respiratory", "oxygen"]),
  pn.mcq(PHY, "Alterations in body systems", "easy",
    "A client with type 1 diabetes is sweaty, shaky and confused. A fingerstick glucose is 52 mg/dL and the client can swallow. What should the PN do first?",
    ["Give 15 grams of a fast-acting carbohydrate such as 4 ounces of juice", "Treating hypoglycemia promptly with fast-acting oral carbohydrate raises glucose quickly and safely in an alert client who can swallow."],
    [
      ["Give the next scheduled dose of insulin", "More insulin would worsen hypoglycemia."],
      ["Offer a high-protein snack", "Protein raises glucose slowly and is not first-line treatment."],
      ["Recheck the glucose in 1 hour before intervening", "Delaying treatment risks seizure and unconsciousness."],
    ],
    "For mild to moderate hypoglycemia in a client who can swallow, give 15 g of fast-acting carbohydrate and recheck in 15 minutes, repeating if below target. Follow with a snack or meal when glucose normalizes. Unresponsive clients need glucagon or intravenous dextrose per protocol.",
    "Rule of 15: 15 g fast carbohydrate, recheck in 15 minutes.", ["diabetes", "priority"]),
];

/* ------------------------------------------------------------------ */
/* FNP questions                                                       */
/* ------------------------------------------------------------------ */
const ASM = "Assessment";
const DX = "Diagnosis";
const PLAN = "Plan and Management";
const EVAL = "Evaluation";
const ROLE = "Professional Role";

const fnp = makeBuilders("fnp");

const FNP_QUESTIONS: SeedQuestion[] = [
  // ---- Assessment (6)
  fnp.mcq(ASM, "History taking", "easy",
    "An FNP is interviewing a 15-year-old for a sports physical. Which approach to the psychosocial history is most appropriate?",
    ["Explain confidentiality and its limits, then interview the adolescent alone for part of the visit", "Time alone with a clear explanation of confidentiality encourages honest disclosure about sensitive topics such as substance use, sexual health and mood."],
    [
      ["Have the parent answer all questions to save time", "Adolescents may not disclose risk behaviors in front of a parent."],
      ["Defer the psychosocial history until the patient turns 18", "Adolescence is a key time for screening and anticipatory guidance."],
      ["Promise that nothing will ever be shared with anyone", "Confidentiality has limits, such as risk of harm to self or others or abuse, and the patient must be told."],
    ],
    "Adolescents should receive part of each visit alone. Begin by explaining that information is private except when safety is at risk. A structured approach such as HEADSS (home, education, activities, drugs, sexuality, suicide/depression) helps cover key domains.",
    "Alone time plus clear limits of confidentiality.", ["history", "adolescent"]),
  fnp.mcq(ASM, "Physical examination", "easy",
    "When examining the abdomen of a patient with abdominal pain, which sequence is recommended?",
    ["Inspection, auscultation, percussion, then palpation", "Palpation and percussion can alter bowel sounds, so auscultation precedes them."],
    [
      ["Inspection, palpation, percussion, then auscultation", "Palpating first may change bowel sounds and give misleading findings."],
      ["Palpation of the painful area first, then inspection", "Starting at the painful area causes guarding and limits the remainder of the exam."],
      ["Percussion, auscultation, inspection, then palpation", "Inspection should come first so that visible findings are noted before touching."],
    ],
    "The abdomen is the exception to the standard order of inspection, palpation, percussion and auscultation. Perform auscultation after inspection and before percussion and palpation. Palpate the most tender area last and watch the face for signs of pain.",
    "Abdomen: look, listen, percuss, palpate; tender area last.", ["physical exam"]),
  fnp.mcq(ASM, "Physical examination", "difficult",
    "A patient has hearing loss in the right ear. The tuning fork is heard louder in the right ear (Weber), and bone conduction is heard longer than air conduction in the right ear (Rinne negative). What do these findings indicate?",
    ["Right conductive hearing loss", "Weber lateralizes to the ear with conductive loss, and a negative Rinne confirms that bone conduction exceeds air conduction in that ear."],
    [
      ["Right sensorineural hearing loss", "In sensorineural loss, Weber lateralizes to the better ear and Rinne remains positive."],
      ["Left conductive hearing loss", "Weber would lateralize to the left in that case."],
      ["Normal hearing in both ears", "Normal Weber is midline and Rinne is positive bilaterally."],
    ],
    "In conductive loss (for example cerumen impaction, effusion or otosclerosis), sound travels better through bone than through air in the affected ear: Weber lateralizes to that ear and Rinne is negative. In sensorineural loss, Weber lateralizes away from the affected ear and air conduction remains better than bone.",
    "Conductive loss: Weber toward the bad ear, Rinne negative.", ["ear", "physical exam"]),
  fnp.mcq(ASM, "Diagnostic testing", "difficult",
    "A patient with pleuritic chest pain has a low pretest probability for pulmonary embolism. Why is a D-dimer test useful in this patient?",
    ["A negative result can effectively rule out pulmonary embolism because the test is highly sensitive", "D-dimer has high sensitivity but low specificity, so it is most useful to exclude disease when pretest probability is low."],
    [
      ["A positive result confirms the diagnosis", "D-dimer rises in many conditions, so a positive result is not specific."],
      ["It replaces imaging in every patient", "Patients with a positive result or higher pretest probability still need imaging."],
      ["It measures how large the embolus is", "D-dimer reflects fibrin degradation and does not quantify clot size."],
    ],
    "Use a validated pretest probability tool such as the Wells score. In low-risk patients, a negative D-dimer rules out PE. In higher-risk patients, go straight to imaging such as CT pulmonary angiography. D-dimer may be elevated in pregnancy, cancer, infection, surgery and older age.",
    "Negative D-dimer rules out only when pretest probability is low.", ["test selection", "pretest probability"]),
  fnp.mcq(ASM, "Diagnostic testing", "easy",
    "A 45-year-old woman reports fatigue, weight gain, constipation and cold intolerance. Which test is the best initial laboratory study?",
    ["Thyroid-stimulating hormone (TSH)", "TSH is the most sensitive first-line test for primary thyroid dysfunction."],
    [
      ["Serum cortisol", "This is used to evaluate adrenal disorders and is not the first test for these symptoms."],
      ["Fasting lipid panel", "Lipids may be abnormal in hypothyroidism but do not diagnose it."],
      ["Hepatic function panel", "Liver tests do not explain this symptom cluster."],
    ],
    "The symptom pattern suggests hypothyroidism. In primary hypothyroidism the TSH is elevated with a low free T4. Check free T4 if TSH is abnormal or if central hypothyroidism is suspected.",
    "Suspect thyroid disease: start with TSH.", ["endocrine", "laboratory"]),
  fnp.sata(ASM, "Diagnostic testing", "moderate",
    "Which laboratory findings support a diagnosis of iron deficiency anemia? Select all that apply.",
    [
      ["Low serum ferritin", "Ferritin reflects iron stores and is low in iron deficiency."],
      ["Low mean corpuscular volume (microcytosis)", "Iron-deficient erythropoiesis produces small red cells."],
      ["Elevated total iron-binding capacity", "The body increases transferrin when iron is scarce."],
    ],
    [
      ["Elevated serum ferritin", "A high ferritin argues against iron deficiency, although it can rise with inflammation."],
      ["Elevated serum iron", "Serum iron is low in iron deficiency."],
    ],
    "Iron deficiency anemia is microcytic with low ferritin, low serum iron, and high TIBC. Identify the cause, which in adults is often blood loss, and treat with iron replacement while confirming the source.",
    "Low ferritin, low MCV, high TIBC.", ["hematology", "laboratory"]),

  // ---- Diagnosis (5)
  fnp.mcq(DX, "Differential diagnosis", "moderate",
    "A tall, thin 22-year-old man has sudden right-sided pleuritic chest pain and dyspnea. Breath sounds are decreased on the right with hyperresonance to percussion. What is the most likely diagnosis?",
    ["Primary spontaneous pneumothorax", "This body habitus and unilateral findings with hyperresonance are classic."],
    [
      ["Lobar pneumonia", "Pneumonia causes dullness to percussion and bronchial breath sounds."],
      ["Pleural effusion", "Effusions cause dullness to percussion, not hyperresonance."],
      ["Acute myocardial infarction", "This is unlikely given the age and unilateral respiratory findings."],
    ],
    "Hyperresonance with absent or diminished breath sounds points to air in the pleural space. A chest radiograph confirms the diagnosis, and management depends on the size and the patient's stability.",
    "Hyperresonant and quiet: think pneumothorax.", ["differential", "respiratory"]),
  fnp.mcq(DX, "Clinical reasoning", "moderate",
    "An FNP continues to treat a patient for heartburn despite new exertional symptoms and a changed pattern of pain. Which cognitive error is most likely occurring?",
    ["Anchoring bias", "Anchoring is the tendency to lock onto the first impression and not adjust when new information appears."],
    [
      ["Availability bias", "This involves overestimating the likelihood of diagnoses that come easily to mind."],
      ["Base-rate neglect", "This involves ignoring how common a condition is in the population, not failing to update after a first impression."],
      ["Framing effect", "The framing effect is when presentation of information influences judgment, which is not the primary problem here."],
    ],
    "Anchoring and premature closure are common sources of diagnostic error. Strategies to reduce them include reconsidering the differential when new data appear, asking 'what else could this be?' and reassessing when a patient does not follow the expected course.",
    "New data that do not fit: re-open the differential.", ["clinical reasoning", "bias"]),
  fnp.mcq(DX, "Differential diagnosis", "difficult",
    "A 58-year-old man with chronic low back pain now reports new urinary retention and numbness over his perineum. Which diagnosis must be excluded urgently?",
    ["Cauda equina syndrome", "Saddle anesthesia and bladder dysfunction are hallmark red flags for compression of the cauda equina."],
    [
      ["Lumbar muscle strain", "A strain does not cause neurologic loss or bladder dysfunction."],
      ["Osteoarthritis of the hip", "This does not explain perineal numbness or urinary retention."],
      ["Mechanical sacroiliitis", "This would not cause sphincter dysfunction."],
    ],
    "Cauda equina syndrome is a surgical emergency. Red flags include saddle anesthesia, bladder or bowel dysfunction, bilateral leg weakness and decreased anal tone. Obtain urgent MRI and neurosurgical evaluation.",
    "Back pain plus saddle anesthesia or retention: emergency MRI.", ["red flags", "neurology"]),
  fnp.mcq(DX, "Differential diagnosis", "easy",
    "A 6-year-old has ear pain, and the pain increases when the examiner pulls on the pinna and presses on the tragus. The canal is swollen and erythematous. What is the most likely diagnosis?",
    ["Acute otitis externa", "Pain with movement of the pinna or pressure on the tragus is characteristic of external canal inflammation."],
    [
      ["Acute otitis media", "Otitis media typically causes a bulging, erythematous tympanic membrane and pain that does not worsen with pinna traction."],
      ["Otitis media with effusion", "Effusion is generally painless with decreased tympanic membrane mobility."],
      ["Mastoiditis", "This usually presents with postauricular swelling and a displaced ear."],
    ],
    "Otitis externa involves the external ear canal, often after water exposure. Treatment includes topical antimicrobial drops, keeping the canal dry and pain control.",
    "Painful pinna traction or tragal pressure = otitis externa.", ["ENT", "pediatrics"]),
  fnp.sata(DX, "Clinical reasoning", "difficult",
    "An FNP is using the Wells criteria to estimate the pretest probability of deep vein thrombosis. Which findings add points toward a higher probability? Select all that apply.",
    [
      ["Active cancer", "Active malignancy raises thrombotic risk."],
      ["Recent major surgery or immobilization", "These are classic venous stasis risk factors."],
      ["Calf swelling more than 3 cm larger than the other leg", "Asymmetric swelling is a key sign of DVT."],
      ["Previously documented DVT", "A prior DVT increases the chance of recurrence."],
    ],
    [
      ["An alternative diagnosis is at least as likely as DVT", "This lowers the score by 2 points instead of adding points."],
      ["Patient is under 30 years old", "Age under 30 is not a scored item."],
    ],
    "The Wells score combines risk factors and findings to categorize probability of DVT. A low score allows D-dimer testing to rule out DVT, while a high score leads directly to ultrasound. A plausible alternative diagnosis subtracts points.",
    "Wells: cancer, immobility or surgery, asymmetric swelling, prior DVT add points.", ["decision rule", "vascular"]),

  // ---- Plan and Management (10)
  fnp.mcq(PLAN, "Pharmacotherapeutics", "easy",
    "A patient taking lisinopril develops a persistent dry cough, and there are no signs of angioedema. What is the most appropriate change?",
    ["Switch to an angiotensin receptor blocker such as losartan", "ARBs have a similar benefit without the bradykinin-mediated cough."],
    [
      ["Increase the lisinopril dose", "A higher dose can worsen the cough."],
      ["Add a second ACE inhibitor", "This duplicates therapy and increases adverse effects."],
      ["Stop all antihypertensive therapy", "Blood pressure control still matters and should be maintained."],
    ],
    "ACE inhibitors increase bradykinin, which can cause a dry cough in a notable portion of patients. Substitute an ARB. If angioedema occurs, stop the ACE inhibitor permanently and use caution with ARBs.",
    "ACE inhibitor cough: switch to ARB.", ["hypertension", "adverse effects"]),
  fnp.mcq(PLAN, "Pharmacotherapeutics", "moderate",
    "A patient with type 2 diabetes has an estimated glomerular filtration rate (eGFR) of 25 mL/min/1.73 m2. Which statement about metformin is correct?",
    ["Metformin is contraindicated when eGFR is below 30", "Reduced clearance raises the risk of lactic acidosis, so metformin should not be used at this level."],
    [
      ["Metformin is preferred because it is renally protective", "Metformin is not renally protective and is cleared by the kidney."],
      ["Metformin can be used at double the usual dose to compensate", "Higher dosing increases risk of accumulation."],
      ["Metformin should be started only if eGFR is above 90", "Metformin can be used at lower eGFR values with dose adjustment down to a lower limit."],
    ],
    "Metformin is contraindicated at an eGFR below 30 and is generally not initiated between 30 and 45. If the eGFR falls while on therapy, reassess the risks and reduce the dose as appropriate. Consider other classes, including agents with kidney benefits when appropriate.",
    "Metformin: stop below eGFR 30.", ["diabetes", "renal dosing"]),
  fnp.mcq(PLAN, "Chronic disease management", "moderate",
    "A 52-year-old Black man has stage 1 hypertension without diabetes, kidney disease or heart failure. Which initial pharmacotherapy is most consistent with current guidelines?",
    ["A thiazide-type diuretic or a calcium channel blocker", "These classes are recommended as initial therapy in Black adults without comorbid conditions that compel another class."],
    [
      ["An ACE inhibitor alone", "ACE inhibitor monotherapy is less effective in this group unless there is a compelling indication such as CKD or heart failure."],
      ["A beta-blocker alone", "Beta-blockers are not first-line unless there is a compelling indication."],
      ["An alpha-1 blocker alone", "Alpha-blockers are not first-line for blood pressure control."],
    ],
    "Initial drug choice in hypertension depends on race and comorbidities. In Black adults without compelling indications, thiazide-type diuretics or calcium channel blockers are recommended. Compelling indications such as diabetic kidney disease or heart failure change this approach.",
    "Black adult, no comorbid disease: thiazide or CCB first.", ["hypertension", "guidelines"]),
  fnp.mcq(PLAN, "Chronic disease management", "difficult",
    "A patient with type 2 diabetes and a prior myocardial infarction has an A1c of 7.2 percent on metformin. What is the best next step?",
    ["Add a GLP-1 receptor agonist or SGLT2 inhibitor with proven cardiovascular benefit", "In patients with established atherosclerotic disease, agents with proven cardiovascular benefit are recommended independent of A1c."],
    [
      ["Add a sulfonylurea because it is inexpensive", "Sulfonylureas lower glucose but do not offer cardiovascular benefit and carry hypoglycemia risk."],
      ["Stop metformin and start NPH insulin", "There is no indication to replace metformin or start insulin at this A1c."],
      ["Make no changes because the A1c is close to goal", "Cardiovascular risk reduction is a separate treatment goal."],
    ],
    "Current diabetes guidance emphasizes risk reduction for cardiovascular and kidney disease, not just glycemic control. For patients with established ASCVD, heart failure or chronic kidney disease, choose an SGLT2 inhibitor or GLP-1 receptor agonist with demonstrated benefit while continuing lifestyle measures.",
    "T2DM with ASCVD: add proven CV-benefit agent regardless of A1c.", ["diabetes", "cardiovascular risk"]),
  fnp.mcq(PLAN, "Chronic disease management", "moderate",
    "Which medication class has been shown to reduce mortality in patients with heart failure with reduced ejection fraction?",
    ["An evidence-based beta-blocker such as carvedilol, metoprolol succinate or bisoprolol", "These agents reduce death and hospitalization when added to background therapy."],
    [
      ["A nondihydropyridine calcium channel blocker such as diltiazem", "These agents can worsen outcomes in reduced ejection fraction."],
      ["A nonsteroidal anti-inflammatory drug", "NSAIDs cause fluid retention and worsen heart failure."],
      ["A thiazolidinedione such as pioglitazone", "These cause fluid retention and are avoided in heart failure."],
    ],
    "Foundational therapy for HFrEF includes an ACE inhibitor, ARB or ARNI, an evidence-based beta-blocker, a mineralocorticoid receptor antagonist and an SGLT2 inhibitor. Loop diuretics relieve congestion but do not improve survival. Avoid NSAIDs, nondihydropyridine CCBs and thiazolidinediones.",
    "HFrEF mortality drugs: ACEi/ARB/ARNI, evidence-based beta-blocker, MRA, SGLT2i.", ["heart failure"]),
  fnp.mcq(PLAN, "Acute care", "easy",
    "A healthy nonpregnant 28-year-old woman has dysuria and urinary frequency for 2 days with no fever or flank pain. Which treatment is appropriate for uncomplicated cystitis?",
    ["Nitrofurantoin for 5 days", "Nitrofurantoin is a first-line option for uncomplicated cystitis when local resistance and kidney function allow."],
    [
      ["Ciprofloxacin for 7 days as first-line therapy", "Fluoroquinolones carry significant risks and are reserved for situations when other agents cannot be used."],
      ["Amoxicillin for 3 days", "Resistance among common uropathogens makes amoxicillin a poor empiric choice."],
      ["Observation without treatment", "Symptomatic cystitis generally warrants treatment because of discomfort and risk of progression."],
    ],
    "First-line empiric therapy for uncomplicated cystitis includes nitrofurantoin (5 days), trimethoprim-sulfamethoxazole (3 days, if local resistance is low) and fosfomycin as a single dose. Avoid nitrofurantoin if suspicion of pyelonephritis or significantly reduced kidney function.",
    "Uncomplicated cystitis: nitrofurantoin, TMP-SMX or fosfomycin.", ["infectious disease", "urinary"]),
  fnp.mcq(PLAN, "Pediatrics", "moderate",
    "At which well-child visits does the American Academy of Pediatrics recommend standardized autism-specific screening?",
    ["At 18 and 24 months", "Universal autism-specific screening is recommended at the 18- and 24-month visits, in addition to ongoing developmental surveillance."],
    [
      ["Only at school entry", "Early identification allows early intervention, so screening is done much earlier."],
      ["Only when parents express concern", "Screening is universal, regardless of parent concern."],
      ["At 6 and 9 months", "General developmental screening occurs at those ages, but autism-specific screening is at 18 and 24 months."],
    ],
    "Early identification of autism spectrum disorder supports earlier intervention. Tools include the Modified Checklist for Autism in Toddlers (M-CHAT-R/F). Positive screens lead to referral for diagnostic evaluation and early intervention services rather than watchful waiting.",
    "Autism screen at 18 and 24 months.", ["screening", "development"]),
  fnp.mcq(PLAN, "Pediatrics", "moderate",
    "A 2-year-old is diagnosed with uncomplicated acute otitis media. Which first-line antibiotic is generally preferred if antibiotics are chosen?",
    ["High-dose amoxicillin", "Amoxicillin remains first-line for most children when there has been no recent amoxicillin use or concurrent conjunctivitis and no penicillin allergy."],
    [
      ["Azithromycin", "Macrolides are alternatives for penicillin-allergic children, not first-line."],
      ["Ciprofloxacin", "Fluoroquinolones are not recommended for routine pediatric ear infections."],
      ["Topical ciprofloxacin drops", "Topical drops treat otitis externa or tympanostomy tube otorrhea, not intact-tympanic-membrane otitis media."],
    ],
    "Acute otitis media is managed with analgesia and either watchful waiting in selected children or antibiotics. When treated, high-dose amoxicillin is first-line. Choose amoxicillin-clavulanate if recent amoxicillin use or concurrent purulent conjunctivitis is present.",
    "AOM first line: high-dose amoxicillin.", ["pediatrics", "antibiotics"]),
  fnp.mcq(PLAN, "Women's health", "difficult",
    "A 30-year-old woman who has migraine with aura requests a contraceptive method. Which option should the FNP avoid?",
    ["A combined estrogen-containing oral contraceptive", "Migraine with aura increases ischemic stroke risk, and estrogen adds to that risk, so combined hormonal contraception is contraindicated."],
    [
      ["A copper intrauterine device", "The copper IUD is hormone-free and safe in migraine with aura."],
      ["A levonorgestrel intrauterine device", "Progestin-only methods are acceptable in migraine with aura."],
      ["A progestin-only pill", "Progestin-only methods do not carry the same stroke concern."],
    ],
    "Use contraceptive eligibility criteria to match method to risk. Migraine with aura is a contraindication to estrogen-containing methods. Offer progestin-only or non-hormonal methods, including long-acting reversible contraception.",
    "Migraine with aura: no estrogen.", ["contraception", "safety"]),
  fnp.mcq(PLAN, "Geriatrics", "moderate",
    "A 78-year-old woman with insomnia asks to take over-the-counter diphenhydramine nightly. What is the FNP's best response?",
    ["Advise against it because of anticholinergic effects and recommend sleep hygiene and cognitive behavioral therapy for insomnia", "First-generation antihistamines are potentially inappropriate in older adults because they increase confusion, falls and urinary retention."],
    [
      ["Recommend a higher nightly dose to improve sleep quality", "Higher doses increase anticholinergic burden."],
      ["Approve it because over-the-counter medicines are safe for older adults", "Over-the-counter does not mean safe; the Beers criteria advise avoiding it."],
      ["Combine it with a benzodiazepine for stronger effect", "Combining sedatives increases fall and delirium risk."],
    ],
    "The American Geriatrics Society Beers Criteria list first-generation antihistamines among medications to avoid in older adults. Nonpharmacologic treatment for insomnia is first-line, including consistent sleep times, limiting caffeine and CBT-I. Evaluate for contributing conditions such as pain, depression or sleep apnea.",
    "Older adult insomnia: avoid diphenhydramine; use CBT-I and sleep hygiene.", ["geriatrics", "Beers criteria"]),

  // ---- Evaluation (4)
  fnp.mcq(EVAL, "Outcome evaluation", "moderate",
    "A patient started on an antihypertensive medication 4 weeks ago still has clinic blood pressures above goal. What should the FNP do first?",
    ["Confirm adherence and measurement accuracy, including home blood pressure readings", "Poor adherence and measurement error are common reasons for apparent treatment failure."],
    [
      ["Immediately triple the dose", "Escalating therapy without addressing adherence can cause adverse effects."],
      ["Discontinue all medications", "This leaves the patient untreated."],
      ["Order a renal artery angiogram", "Secondary hypertension work-up is considered after basic evaluation of adherence and technique."],
    ],
    "Before intensifying therapy, evaluate adherence, medication side effects, white-coat effect, interfering drugs such as NSAIDs and decongestants, and technique. Home or ambulatory monitoring helps confirm control.",
    "Uncontrolled BP: check adherence and measurement before escalating.", ["hypertension", "evaluation"]),
  fnp.mcq(EVAL, "Outcome evaluation", "easy",
    "A patient with type 2 diabetes has had a medication change today. When is the most useful time to repeat the hemoglobin A1c to evaluate its effect?",
    ["About 3 months later", "A1c reflects average glucose over roughly the preceding 2 to 3 months, so about 3 months is needed to assess a change."],
    [
      ["In 1 week", "A1c cannot reflect such a short period."],
      ["Tomorrow", "A1c does not respond within a day."],
      ["Only after 2 years", "Treatment adjustments would be delayed unnecessarily."],
    ],
    "A1c measures glycated hemoglobin, which reflects average glucose over the red blood cell lifespan, weighted toward recent weeks. Use self-monitoring or continuous glucose monitoring to evaluate short-term changes.",
    "A1c reflects about 3 months; recheck at about 3 months.", ["diabetes", "monitoring"]),
  fnp.mcq(EVAL, "Follow-up", "moderate",
    "An FNP starts an ACE inhibitor for a patient with diabetic kidney disease. Which follow-up is most appropriate?",
    ["Check serum potassium and creatinine within about 1 to 2 weeks", "ACE inhibitors can raise potassium and creatinine, so early labs confirm safety."],
    [
      ["Check a lipid panel in 1 week", "Lipids are not the main safety concern with ACE inhibitors."],
      ["Check liver enzymes only", "This is not the main monitoring for ACE inhibitors."],
      ["No follow-up labs are needed", "Monitoring is recommended after starting or titrating."],
    ],
    "After starting or increasing an ACE inhibitor or ARB, check potassium and creatinine within 1 to 2 weeks. A modest creatinine rise is expected, but a rise of more than about 30 percent warrants evaluation for volume depletion or renal artery stenosis.",
    "ACEi/ARB start: potassium and creatinine in 1 to 2 weeks.", ["monitoring", "renal"]),
  fnp.mcq(EVAL, "Follow-up", "easy",
    "A healthy adult is treated as an outpatient for community-acquired pneumonia. Which follow-up instruction is most appropriate?",
    ["Return or call if there is no improvement in 48 to 72 hours or if symptoms worsen", "Clinical improvement is expected within a few days, and lack of response requires reassessment."],
    [
      ["Return in 1 year for a routine visit", "This does not address early deterioration."],
      ["Stop the antibiotic once the fever resolves on day 1", "Early discontinuation risks relapse."],
      ["No instructions are needed because pneumonia always resolves", "Patients should know the warning signs of treatment failure."],
    ],
    "Provide return precautions, including worsening dyspnea, persistent fever, confusion, chest pain or inability to take fluids and medication. Counsel on completing the course of therapy and smoking cessation, and arrange vaccine review.",
    "Pneumonia follow-up: no better in 48 to 72 hours means reassess.", ["pneumonia", "follow-up"]),

  // ---- Professional Role (5)
  fnp.mcq(ROLE, "Scope of practice", "easy",
    "Which authority primarily determines an FNP's prescriptive authority and level of practice autonomy?",
    ["State law and the state board of nursing regulations", "Nurse practice acts and board rules vary by state and define scope and prescribing."],
    [
      ["The employer's preferences alone", "Employers may set policies but cannot exceed state law."],
      ["The patient's request", "Patient preference cannot expand legal scope."],
      ["Federal law uniformly for all states", "Federal law sets some rules but state law controls scope of practice."],
    ],
    "Nurse practitioners practice under state licensure, with differences in whether physician collaboration or supervision is required. Federal rules, such as DEA registration for controlled substances, also apply, but the practice act is the foundation.",
    "Scope of practice is defined by state law.", ["scope", "regulation"]),
  fnp.mcq(ROLE, "Scope of practice", "moderate",
    "A longtime friend who is not a patient asks the FNP to call in an antibiotic prescription for a sore throat. What is the best response?",
    ["Decline and offer an appointment so a proper evaluation can be performed", "Prescribing without establishing a clinician-patient relationship and an appropriate evaluation is unsafe and may violate regulations."],
    [
      ["Prescribe a narrow-spectrum antibiotic as a courtesy", "This bypasses assessment and may be unnecessary."],
      ["Prescribe it only if the friend promises to take it as directed", "Promises do not replace assessment."],
      ["Ask a colleague to sign the prescription", "This avoids accountability and is improper."],
    ],
    "A professional relationship with documented history, exam and a plan is the foundation for ethical prescribing. Informal treatment of friends or family raises concerns about objectivity, documentation and appropriateness.",
    "No evaluation, no prescription.", ["prescribing", "professionalism"]),
  fnp.mcq(ROLE, "Ethics", "moderate",
    "A 16-year-old asks the FNP for confidential contraceptive counseling. What is the best first step?",
    ["Review state minor-consent laws and clinic policy, then offer confidential counseling within those limits", "Minors' rights to consent to reproductive care vary by state, so the clinician must know and follow the applicable law."],
    [
      ["Refuse to provide any counseling without a parent present", "This can block access to care and is not required in many states."],
      ["Immediately call the parents to disclose the request", "Disclosure without legal obligation breaches confidentiality."],
      ["Provide care and promise absolute secrecy in all circumstances", "Confidentiality has legal limits, such as abuse reporting."],
    ],
    "Balance autonomy, beneficence and legal obligations. Explain what will be kept private and the limits, such as suspected abuse or risk of harm. Encourage, but do not require, parental involvement when it is safe.",
    "Know state minor-consent law; explain limits of confidentiality.", ["minors", "confidentiality"]),
  fnp.mcq(ROLE, "Ethics", "easy",
    "A patient with decision-making capacity declines a recommended colonoscopy after the FNP has explained the benefits and risks. What is the most appropriate action?",
    ["Respect the decision, document the informed refusal and revisit the topic at later visits", "Competent patients have the right to refuse care; the clinician's role is to inform and document."],
    [
      ["Proceed with scheduling the test without telling the patient", "This violates autonomy and consent."],
      ["Discharge the patient from the practice", "Refusing one recommendation is not grounds for abandonment."],
      ["Tell the patient the decision is irrational and must be changed", "Coercion undermines respect for autonomy."],
    ],
    "Respect for autonomy means the patient decides after receiving adequate information. Verify understanding, offer alternatives such as stool-based screening tests, and document the discussion.",
    "Capacity plus information plus refusal equals documented informed refusal.", ["autonomy", "ethics"]),
  fnp.sata(ROLE, "Health policy", "moderate",
    "Under HIPAA, which disclosures of protected health information are permitted without the patient's written authorization? Select all that apply.",
    [
      ["Sending records to a specialist who is also treating the patient", "Disclosure for treatment is permitted."],
      ["Submitting necessary information to the insurer to obtain payment", "Disclosure for payment is permitted."],
      ["Reporting a notifiable communicable disease to the public health department as required by law", "Public health reporting required by law is allowed."],
    ],
    [
      ["Giving a patient's chart to the patient's employer on request", "Employers are not entitled to records without authorization."],
      ["Selling a patient's contact list to a marketing company", "Marketing use generally requires authorization."],
    ],
    "HIPAA permits uses and disclosures for treatment, payment and health care operations without authorization, along with specified public health and legal purposes. Disclosures beyond these generally require the patient's written authorization, and the minimum necessary standard applies to most uses.",
    "Treatment, payment, operations and required public health reports need no authorization.", ["HIPAA", "policy"]),
];

/* ------------------------------------------------------------------ */
/* Clinical Medical Mathematics questions                              */
/* ------------------------------------------------------------------ */
const UC = "Unit Conversions";
const OD = "Oral Dosage";
const PD = "Parenteral Dosage";
const IVC = "IV Calculations";
const WB = "Weight-Based and Pediatric Dosing";

const cm = makeBuilders("clinical-math");

const CM_QUESTIONS: SeedQuestion[] = [
  // ---- Unit Conversions (5)
  cm.num(UC, "Metric conversions", "easy",
    "A provider orders 2.5 liters of oral rehydration solution to be taken over the day. How many milliliters is this?",
    2500, 0, "mL", 0,
    "1 L = 1,000 mL, so 2.5 L x 1,000 mL/L = 2,500 mL.",
    "Liters to milliliters: multiply by 1,000."),
  cm.num(UC, "Metric conversions", "easy",
    "A drug label lists a dose of 150 mcg. Express this dose in milligrams.",
    0.15, 0.001, "mg", 2,
    "1 mg = 1,000 mcg, so 150 mcg / 1,000 = 0.15 mg.",
    "Micrograms to milligrams: divide by 1,000."),
  cm.num(UC, "Metric conversions", "moderate",
    "A client weighs 154 pounds. Using 1 kg = 2.2 lb, what is the client's weight in kilograms?",
    70, 0.1, "kg", 1,
    "Divide pounds by 2.2: 154 / 2.2 = 70 kg.",
    "Pounds to kilograms: divide by 2.2."),
  cm.mcq(UC, "Household to metric", "easy",
    "Which household-to-metric equivalence is correct?",
    ["1 tablespoon = 15 mL", "A tablespoon holds approximately 15 mL, equal to 3 teaspoons."],
    [
      ["1 teaspoon = 15 mL", "A teaspoon is approximately 5 mL."],
      ["1 fluid ounce = 15 mL", "A fluid ounce is approximately 30 mL."],
      ["1 tablespoon = 5 mL", "5 mL is one teaspoon, not a tablespoon."],
    ],
    "Common approximations are 1 teaspoon = 5 mL, 1 tablespoon = 15 mL and 1 fluid ounce = 30 mL. Memorize these and use calibrated devices for actual dosing.",
    "tsp 5 mL, Tbsp 15 mL, oz 30 mL.", ["conversion"]),
  cm.num(UC, "Household to metric", "moderate",
    "A client drinks 6 fluid ounces of juice. Using 1 fluid ounce = 30 mL, how many milliliters should be recorded as intake?",
    180, 0, "mL", 0,
    "6 oz x 30 mL/oz = 180 mL.",
    "Fluid ounces to mL: multiply by 30."),

  // ---- Oral Dosage (5)
  cm.num(OD, "Tablets", "easy",
    "The order reads digoxin 0.25 mg by mouth daily. The pharmacy supplies 0.125 mg tablets. How many tablets should be given?",
    2, 0, "tablets", 0,
    "Desired / have = 0.25 mg / 0.125 mg = 2 tablets.",
    "Desired over have: 0.25/0.125 = 2 tablets."),
  cm.num(OD, "Tablets", "moderate",
    "A client is prescribed levothyroxine 0.15 mg by mouth daily. Tablets are available in 75 mcg strength. How many tablets are needed per dose?",
    2, 0, "tablets", 0,
    "Convert first: 0.15 mg = 150 mcg. Then 150 mcg / 75 mcg = 2 tablets.",
    "Convert to the same unit before dividing."),
  cm.num(OD, "Tablets", "moderate",
    "Prednisone 30 mg is ordered. The only available tablets are scored 20 mg tablets. How many tablets should the nurse give (a scored tablet may be split in half)?",
    1.5, 0.01, "tablets", 1,
    "30 mg / 20 mg = 1.5 tablets. Only a scored tablet may be split, which is the case here.",
    "1.5 scored 20 mg tablets provide 30 mg."),
  cm.num(OD, "Liquids", "moderate",
    "The order is for amoxicillin 400 mg by mouth. The suspension available is 200 mg per 5 mL. How many mL should be given?",
    10, 0.1, "mL", 0,
    "(400 mg / 200 mg) x 5 mL = 2 x 5 mL = 10 mL.",
    "Dose desired / dose on hand x volume."),
  cm.num(OD, "Liquids", "moderate",
    "A child is ordered 125 mg of an antibiotic by mouth. The suspension is labeled 250 mg per 5 mL. How many mL will the nurse draw up?",
    2.5, 0.05, "mL", 1,
    "(125 mg / 250 mg) x 5 mL = 0.5 x 5 mL = 2.5 mL.",
    "Half the concentration's dose equals half the volume."),

  // ---- Parenteral Dosage (5)
  cm.num(PD, "Injections", "easy",
    "The provider orders furosemide 40 mg IM. The vial contains 10 mg per mL. How many mL should be administered?",
    4, 0.05, "mL", 1,
    "40 mg / 10 mg per mL = 4 mL. (Check the facility limit for the volume per IM site.)",
    "Dose divided by concentration gives volume."),
  cm.num(PD, "Injections", "moderate",
    "Enoxaparin 30 mg subcutaneously is ordered. The prefilled syringe contains 40 mg in 0.4 mL. How many mL will deliver the ordered dose?",
    0.3, 0.01, "mL", 2,
    "Concentration is 40 mg / 0.4 mL = 100 mg/mL. 30 mg / 100 mg per mL = 0.3 mL.",
    "Find mg per mL first, then divide the dose by it."),
  cm.mcq(PD, "Injections", "easy",
    "Which way of writing a dose is safest to prevent a tenfold error?",
    ["0.5 mg", "A leading zero before the decimal point prevents the decimal from being missed."],
    [
      [".5 mg", "A decimal point without a leading zero can be overlooked and read as 5 mg."],
      ["5.0 mg", "A trailing zero can be misread as 50 mg."],
      ["0.50 mg", "The trailing zero adds unnecessary risk of misreading."],
    ],
    "Safe-practice conventions: always use a leading zero (0.5 mg) and never use a trailing zero (5 mg, not 5.0 mg). These rules help avoid misreading the decimal point.",
    "Use a leading zero; never use a trailing zero.", ["medication safety"]),
  cm.num(PD, "Reconstitution", "moderate",
    "A 1 g powdered antibiotic vial is reconstituted with 9.6 mL of diluent to a final volume of 10 mL. The order is for 750 mg. How many mL contain the dose?",
    7.5, 0.05, "mL", 1,
    "1 g = 1,000 mg in 10 mL gives 100 mg/mL. 750 mg / 100 mg per mL = 7.5 mL.",
    "Final volume (not just diluent volume) determines concentration."),
  cm.num(PD, "Reconstitution", "difficult",
    "After reconstitution, the vial label states the concentration is 250 mg per mL. The order is for 600 mg. How many mL should the nurse draw up?",
    2.4, 0.05, "mL", 1,
    "600 mg / 250 mg per mL = 2.4 mL.",
    "Read the post-reconstitution concentration on the label."),

  // ---- IV Calculations (8)
  cm.num(IVC, "Flow rates (mL/hr)", "easy",
    "A provider orders 1,000 mL of normal saline over 8 hours by infusion pump. At what rate in mL/hr should the pump be set?",
    125, 1, "mL/hr", 0,
    "Rate = volume / time = 1,000 mL / 8 hr = 125 mL/hr.",
    "mL/hr = total volume / hours."),
  cm.num(IVC, "Flow rates (mL/hr)", "moderate",
    "An antibiotic in 250 mL is to infuse over 45 minutes by pump. What rate in mL/hr should be programmed? Round to the nearest whole number.",
    333, 1, "mL/hr", 0,
    "Convert minutes to hours: 45 min = 0.75 hr. 250 mL / 0.75 hr = 333.3, rounded to 333 mL/hr.",
    "Pumps run in mL per hour, so convert minutes to hours first."),
  cm.num(IVC, "Heparin infusions", "difficult",
    "A heparin infusion is prepared as 25,000 units in 500 mL. The order is 1,200 units per hour. At what rate in mL/hr should the pump run?",
    24, 0.1, "mL/hr", 0,
    "Concentration = 25,000 / 500 = 50 units/mL. 1,200 units/hr / 50 units/mL = 24 mL/hr.",
    "Concentration first, then dose per hour divided by concentration."),
  cm.num(IVC, "Heparin infusions", "moderate",
    "A premixed heparin bag contains 25,000 units in 250 mL and is infusing at 18 mL/hr. How many units per hour is the client receiving?",
    1800, 5, "units/hr", 0,
    "Concentration = 25,000 / 250 = 100 units/mL. 18 mL/hr x 100 units/mL = 1,800 units/hr.",
    "Units/hr = mL/hr x units/mL."),
  cm.num(IVC, "Drip rates (gtt/min)", "moderate",
    "A gravity infusion of 1,000 mL is ordered over 8 hours. The tubing drop factor is 15 gtt/mL. How many drops per minute should the nurse set? Round to the nearest whole number.",
    31, 1, "gtt/min", 0,
    "(1,000 mL x 15 gtt/mL) / 480 min = 15,000 / 480 = 31.25, rounded to 31 gtt/min.",
    "gtt/min = (volume x drop factor) / minutes."),
  cm.num(IVC, "Drip rates (gtt/min)", "moderate",
    "A 100 mL piggyback is ordered to run in over 30 minutes with tubing that delivers 10 gtt/mL. What is the drip rate in gtt/min? Round to the nearest whole number.",
    33, 1, "gtt/min", 0,
    "(100 mL x 10 gtt/mL) / 30 min = 1,000 / 30 = 33.3, rounded to 33 gtt/min.",
    "Use minutes, not hours, when the infusion time is given in minutes."),
  cm.num(IVC, "Infusion time", "easy",
    "A 500 mL bag is infusing at 125 mL/hr. How many hours will the infusion take?",
    4, 0.05, "hours", 1,
    "Time = volume / rate = 500 mL / 125 mL/hr = 4 hours.",
    "Hours = volume / rate."),
  cm.mcq(IVC, "Infusion time", "difficult",
    "A 1,000 mL infusion is started at 0800 and runs at 150 mL/hr by pump. At what time will the bag be empty?",
    ["1440", "1,000 / 150 = 6.67 hours, or 6 hours 40 minutes, so 0800 + 6:40 = 1440."],
    [
      ["1400", "This would be exactly 6 hours, which delivers only 900 mL."],
      ["1500", "This would be 7 hours, which exceeds the volume at this rate."],
      ["1340", "This results from starting the clock at 0700 or rounding incorrectly."],
    ],
    "Divide the volume by the rate: 1,000 / 150 = 6.67 hours. Convert 0.67 hours to minutes (0.67 x 60 = 40 minutes). Add 6 hours 40 minutes to the start time.",
    "Convert decimal hours to minutes before adding to the clock time.", ["calculation"]),

  // ---- Weight-Based and Pediatric Dosing (7)
  cm.num(WB, "mg/kg dosing", "easy",
    "A child weighing 18 kg is ordered a medication at 10 mg/kg per dose. How many milligrams should be given per dose?",
    180, 1, "mg", 0,
    "18 kg x 10 mg/kg = 180 mg.",
    "Dose = weight in kg x mg/kg."),
  cm.num(WB, "mg/kg dosing", "easy",
    "A client weighing 80 kg is ordered enoxaparin at 1 mg/kg subcutaneously every 12 hours. How many mg are given per dose?",
    80, 0.5, "mg", 0,
    "80 kg x 1 mg/kg = 80 mg per dose.",
    "Multiply weight in kg by the per-kg dose."),
  cm.num(WB, "mg/kg dosing", "moderate",
    "A child weighs 66 pounds. The order is 0.5 mg/kg. Using 1 kg = 2.2 lb, how many mg should the child receive per dose?",
    15, 0.1, "mg", 1,
    "66 lb / 2.2 = 30 kg. 30 kg x 0.5 mg/kg = 15 mg.",
    "Convert pounds to kilograms before multiplying."),
  cm.mcq(WB, "Safe dose range", "moderate",
    "For this exercise, a drug's safe range is 10 to 15 mg/kg/day in divided doses. A child weighing 20 kg is ordered 100 mg every 8 hours. Is the order within the safe range?",
    ["Yes; the daily dose is 300 mg (15 mg/kg/day), the upper limit of the range", "The safe range for 20 kg is 200 to 300 mg/day, and 100 mg x 3 doses = 300 mg/day is at the upper limit."],
    [
      ["No; it is below the minimum range of 200 mg/day", "300 mg/day is above the minimum of 200 mg."],
      ["No; it exceeds the maximum of 300 mg/day", "300 mg/day equals, but does not exceed, the maximum."],
      ["It cannot be determined without the child's height", "Weight-based doses depend on weight, not height."],
    ],
    "First calculate the daily range using the weight: 20 kg x 10 = 200 mg and 20 kg x 15 = 300 mg. Then calculate the ordered daily total: 100 mg every 8 hours is 3 doses per day = 300 mg. Compare the total with the range.",
    "Compare the total daily dose with the weight-based range.", ["safe dose"]),
  cm.mcq(WB, "Safe dose range", "difficult",
    "For this exercise, a drug's safe range is 20 to 40 mg/kg/day divided every 6 hours. A child weighing 12 kg is ordered 250 mg every 6 hours. What should the nurse do?",
    ["Hold the dose and clarify with the prescriber because the daily dose is about 83 mg/kg/day", "250 mg x 4 = 1,000 mg/day, which divided by 12 kg is about 83 mg/kg/day, well above the 40 mg/kg/day limit (480 mg/day)."],
    [
      ["Give the dose because it falls within the range", "The daily total exceeds the maximum safe dose."],
      ["Give half the dose and document it", "Nurses should not change orders on their own."],
      ["Give the dose, but monitor the child closely for toxicity", "Giving a known excessive dose is unsafe, regardless of monitoring."],
    ],
    "The maximum daily dose is 12 kg x 40 mg/kg = 480 mg. The order totals 1,000 mg/day, more than double. Never give a dose outside the safe range without clarification, and verify that the weight and units were entered correctly.",
    "Total daily dose over the maximum: hold and clarify.", ["safe dose", "safety"]),
  cm.num(WB, "Titrations", "difficult",
    "Dopamine is ordered at 5 mcg/kg/min for a client weighing 70 kg. The premixed bag contains 400 mg in 250 mL. What pump rate in mL/hr is needed? Round to one decimal place.",
    13.1, 0.2, "mL/hr", 1,
    "Dose = 70 kg x 5 mcg/kg/min = 350 mcg/min = 21,000 mcg/hr. Concentration = 400,000 mcg / 250 mL = 1,600 mcg/mL. Rate = 21,000 / 1,600 = 13.1 mL/hr.",
    "Dose per hour divided by concentration in mcg/mL."),
  cm.num(WB, "Titrations", "difficult",
    "The same dopamine infusion (400 mg in 250 mL, client 70 kg) is increased to 8 mcg/kg/min. What pump rate in mL/hr is now needed?",
    21, 0.2, "mL/hr", 0,
    "Dose = 70 kg x 8 mcg/kg/min = 560 mcg/min = 33,600 mcg/hr. Divide by 1,600 mcg/mL to get 21 mL/hr.",
    "Recalculate from the new mcg/kg/min each time the ordered dose changes."),
];

/* ------------------------------------------------------------------ */
/* PANCE questions                                                     */
/* ------------------------------------------------------------------ */
const withSystem = (system: string, q: SeedQuestion): SeedQuestion => ({ ...q, system });

const PA_HX = "History Taking and Physical Examination";
const PA_DS = "Diagnostic Studies";
const PA_DX = "Diagnosis";
const PA_HM = "Health Maintenance";
const PA_CI = "Clinical Intervention";
const PA_RX = "Pharmaceutical Therapeutics";
const PA_BS = "Applying Basic Science Concepts";

const pance = makeBuilders("pance");

const PANCE_QUESTIONS: SeedQuestion[] = [
  // ---- History Taking and Physical Examination (4)
  withSystem("Cardiovascular", pance.mcq(PA_HX, "Cardiac auscultation", "moderate",
    "A 68-year-old man reports progressive exertional dyspnea and needing three pillows to sleep. A low-pitched extra heart sound is heard early in diastole at the apex. What does this finding most likely represent?",
    ["An S3 gallop reflecting ventricular volume overload", "An S3 occurs during rapid ventricular filling and, in an older adult with these symptoms, suggests heart failure."],
    [
      ["An S4 from a stiff, hypertrophied ventricle", "An S4 occurs late in diastole, just before S1."],
      ["An opening snap from mitral stenosis", "An opening snap is a high-pitched sound shortly after S2."],
      ["A midsystolic click from mitral valve prolapse", "A click occurs in systole, not early diastole."],
    ],
    "An S3 is a low-pitched sound early in diastole best heard with the bell at the apex with the patient in the left lateral position. It is normal in children and young adults but in older patients it suggests systolic heart failure or volume overload. Orthopnea supports this interpretation.",
    "Late-life S3 plus orthopnea: think heart failure.", ["cardiac exam"])),
  withSystem("Pulmonary", pance.mcq(PA_HX, "Chest examination", "moderate",
    "A patient with cough and dyspnea has dullness to percussion at the right lung base, decreased tactile fremitus and absent breath sounds in the same area. Which condition best explains these findings?",
    ["Pleural effusion", "Fluid between the lung and chest wall dampens vibration, producing dullness, reduced fremitus and diminished breath sounds."],
    [
      ["Lobar pneumonia", "Consolidation typically increases tactile fremitus and produces bronchial breath sounds."],
      ["Pneumothorax", "Air in the pleural space produces hyperresonance, not dullness."],
      ["Asthma exacerbation", "Asthma causes diffuse wheezing and generally preserved percussion."],
    ],
    "Compare the exam findings across common pleural and parenchymal conditions. Effusion: dull, decreased fremitus, decreased breath sounds. Consolidation: dull, increased fremitus, bronchial breath sounds. Pneumothorax: hyperresonant, decreased fremitus and breath sounds.",
    "Dull plus decreased fremitus: effusion; dull plus increased fremitus: consolidation.", ["chest exam"])),
  withSystem("Neurologic", pance.mcq(PA_HX, "Cranial nerve examination", "moderate",
    "A 45-year-old woman wakes with right-sided facial droop. She cannot wrinkle the right forehead or close the right eye tightly. Sensation and limb strength are normal. What is the most likely lesion?",
    ["A peripheral lesion of the right facial nerve (CN VII)", "Involvement of the forehead indicates a lower motor neuron lesion, as seen in Bell palsy."],
    [
      ["A lesion of the left motor cortex", "A central lesion spares the forehead because of bilateral cortical input."],
      ["A lesion of the right trigeminal nerve", "CN V governs facial sensation and mastication, not facial expression."],
      ["A right cerebellar lesion", "Cerebellar lesions cause ataxia and incoordination, not facial paralysis."],
    ],
    "The upper face receives bilateral cortical input, so central lesions such as stroke spare the forehead. A peripheral CN VII lesion paralyzes the entire half of the face. Bell palsy is the most common cause and is often treated with early corticosteroids.",
    "Forehead involved: peripheral; forehead spared: central.", ["neuro exam"])),
  withSystem("Musculoskeletal", pance.mcq(PA_HX, "Musculoskeletal examination", "easy",
    "A soccer player pivoted, heard a pop and developed knee swelling within hours. Which physical examination maneuver is most sensitive for the suspected injury?",
    ["Lachman test", "Anterior translation of the tibia with a soft end point on Lachman indicates an anterior cruciate ligament tear."],
    [
      ["Thessaly test for the lateral collateral ligament", "The Thessaly test is used for meniscal injury."],
      ["Apley grind with valgus stress for the patellar tendon", "These are not used to evaluate the patellar tendon."],
      ["Straight leg raise", "This tests for lumbar radiculopathy."],
    ],
    "A pop with rapid hemarthrosis after a pivoting injury is classic for an ACL tear. The Lachman test is more sensitive than the anterior drawer. Valgus and varus stress assess the collateral ligaments and McMurray or Thessaly tests assess the menisci.",
    "Pop plus quick swelling: ACL; confirm with Lachman.", ["knee exam"])),

  // ---- Diagnostic Studies (5)
  withSystem("Gastrointestinal", pance.mcq(PA_DS, "Acute cholecystitis", "easy",
    "A patient has right upper quadrant pain, fever and a positive Murphy sign. Which initial imaging study is most appropriate?",
    ["Right upper quadrant ultrasonography", "Ultrasound is the first-line imaging test for suspected gallbladder disease because it detects stones and signs of inflammation."],
    [
      ["Noncontrast CT of the abdomen", "CT is less sensitive for gallstones and is not first line."],
      ["Plain abdominal radiography", "Most gallstones are not radiopaque."],
      ["Upper gastrointestinal series with barium", "This evaluates the upper tract mucosa and not the gallbladder."],
    ],
    "Ultrasound findings of cholecystitis include gallstones, gallbladder wall thickening, pericholecystic fluid and a sonographic Murphy sign. HIDA scanning is a second-line test when ultrasound is equivocal.",
    "RUQ pain: ultrasound first.", ["imaging"])),
  withSystem("Cardiovascular", pance.mcq(PA_DS, "Aortic dissection", "difficult",
    "A hemodynamically stable patient with sudden tearing chest pain radiating to the back is suspected of having an acute aortic dissection. Which test is the best next step?",
    ["CT angiography of the chest, abdomen and pelvis", "CT angiography is fast, widely available and accurate for confirming dissection in stable patients."],
    [
      ["D-dimer alone to exclude dissection", "D-dimer may help in low-risk patients, but a high-suspicion patient needs definitive imaging."],
      ["Treadmill stress test", "This is dangerous when dissection is suspected."],
      ["Resting ECG alone", "ECG may be normal, and it cannot confirm or exclude dissection."],
    ],
    "Aortic dissection is a time-sensitive emergency. Stable patients undergo CT angiography, while unstable patients may be taken for transesophageal echocardiography. Do not give anticoagulation or thrombolytics. Begin anti-impulse therapy with a beta-blocker, then add a vasodilator if needed.",
    "Suspected dissection and stable: CT angiography.", ["aorta", "imaging"])),
  withSystem("Cardiovascular", pance.mcq(PA_DS, "Electrocardiography", "moderate",
    "An ECG shows ST-segment elevation in leads II, III and aVF. Which coronary artery is most commonly responsible?",
    ["Right coronary artery", "Leads II, III and aVF reflect the inferior wall, which is usually supplied by the right coronary artery."],
    [
      ["Left anterior descending artery", "LAD occlusion causes anterior changes in V1 to V4."],
      ["Left circumflex artery supplying only the anterior wall", "The circumflex mainly supplies the lateral wall (I, aVL, V5, V6)."],
      ["Left main coronary artery with posterior wall involvement only", "Left main disease causes extensive ischemia, often with ST depression and aVR elevation."],
    ],
    "Inferior STEMI usually results from right coronary artery occlusion. Obtain a right-sided ECG to look for right ventricular involvement, and use caution with nitrates and preload-reducing agents if present.",
    "II, III, aVF: inferior wall, usually RCA.", ["ECG", "STEMI"])),
  withSystem("Gastrointestinal", pance.mcq(PA_DS, "Acute pancreatitis", "moderate",
    "A patient with severe epigastric pain radiating to the back and repeated vomiting presents to the emergency department. Which laboratory result most supports acute pancreatitis?",
    ["Serum lipase greater than three times the upper limit of normal", "A lipase of more than three times the upper limit, with typical pain, supports the diagnosis."],
    [
      ["Elevated TSH", "Thyroid function does not diagnose pancreatitis."],
      ["Low serum ferritin", "Ferritin is not related to pancreatic inflammation."],
      ["Elevated hemoglobin A1c", "A1c reflects chronic glycemia and does not diagnose pancreatitis."],
    ],
    "Acute pancreatitis is diagnosed when at least two of three criteria are present: characteristic abdominal pain, serum lipase or amylase more than three times the upper limit of normal, and imaging evidence. Lipase is more specific than amylase. Common causes are gallstones and alcohol.",
    "Two of three: pain, lipase over 3x normal, imaging.", ["laboratory"])),
  withSystem("Endocrine", pance.mcq(PA_DS, "Hyperthyroidism", "difficult",
    "A patient with weight loss, palpitations and heat intolerance has a suppressed TSH and elevated free T4. Which study best distinguishes Graves disease from thyroiditis?",
    ["Radioactive iodine uptake scan", "Graves disease shows diffusely increased uptake, whereas thyroiditis shows low uptake."],
    [
      ["Fine-needle aspiration of the thyroid", "This evaluates nodules for malignancy, not the cause of hyperthyroidism."],
      ["Serum calcium level", "This does not differentiate the causes."],
      ["Plain chest radiography", "This is not helpful for the cause."],
    ],
    "After biochemical confirmation of hyperthyroidism, a radioactive iodine uptake and scan separates increased production (Graves disease, toxic nodule) from release of stored hormone (thyroiditis). TSH receptor antibodies also support Graves disease. The scan is contraindicated in pregnancy.",
    "High uptake: Graves; low uptake: thyroiditis or exogenous hormone.", ["thyroid"])),

  // ---- Diagnosis (5)
  withSystem("Cardiovascular", pance.mcq(PA_DX, "Acute coronary syndrome", "moderate",
    "A 60-year-old woman has 25 minutes of chest pressure at rest. ECG shows ST-segment depression in the lateral leads and the troponin is elevated. What is the most likely diagnosis?",
    ["Non-ST-elevation myocardial infarction", "Elevated troponin with ischemic ECG changes but no ST elevation defines NSTEMI."],
    [
      ["Stable angina", "Stable angina is exertional, brief and does not raise troponin."],
      ["Unstable angina", "Unstable angina has similar symptoms but troponin is not elevated."],
      ["Pericarditis", "Pericarditis shows diffuse ST elevation with PR depression and pleuritic pain."],
    ],
    "Acute coronary syndromes include unstable angina, NSTEMI and STEMI. Troponin separates NSTEMI (elevated) from unstable angina (normal). ST elevation defines STEMI and calls for emergent reperfusion.",
    "Rest pain plus ST depression plus positive troponin: NSTEMI.", ["ACS"])),
  withSystem("Gastrointestinal", pance.mcq(PA_DX, "Appendicitis", "easy",
    "A 19-year-old has 12 hours of periumbilical pain that has migrated to the right lower quadrant, with anorexia and low-grade fever. What is the most likely diagnosis?",
    ["Acute appendicitis", "Migration of pain from the periumbilical area to the right lower quadrant is the classic sequence of appendicitis."],
    [
      ["Acute cholecystitis", "Cholecystitis causes right upper quadrant pain."],
      ["Acute pancreatitis", "Pancreatitis causes epigastric pain radiating to the back."],
      ["Diverticulitis of the sigmoid colon", "This usually causes left lower quadrant pain in older adults."],
    ],
    "Initial visceral pain from midgut distension localizes to the periumbilical region, then irritation of the parietal peritoneum localizes pain to the right lower quadrant. Anorexia and fever are common. Diagnosis is clinical with supportive imaging, and treatment is appendectomy.",
    "Periumbilical pain migrating to RLQ: appendicitis.", ["abdominal pain"])),
  withSystem("Pulmonary", pance.mcq(PA_DX, "Croup", "easy",
    "A 2-year-old has a barking cough, inspiratory stridor and hoarseness after two days of low-grade fever and rhinorrhea. A neck radiograph shows subglottic narrowing. What is the diagnosis?",
    ["Croup (laryngotracheobronchitis)", "A barking cough, stridor and steeple sign on radiograph are characteristic, usually from parainfluenza virus."],
    [
      ["Epiglottitis", "Epiglottitis causes toxic appearance, drooling and a thumb sign, and is now rare with Hib vaccination."],
      ["Foreign body aspiration", "This presents with sudden choking and unilateral findings, not a viral prodrome."],
      ["Bacterial tracheitis", "This causes a toxic child with a high fever and purulent secretions."],
    ],
    "Croup is a viral infection of the larynx and trachea mostly affecting children aged 6 months to 3 years. Treatment is a single dose of dexamethasone, with nebulized epinephrine for significant stridor at rest.",
    "Barking cough plus steeple sign: croup.", ["pediatrics", "airway"])),
  withSystem("Neurologic", pance.mcq(PA_DX, "Meningitis", "moderate",
    "A college freshman living in a dormitory has fever, severe headache, neck stiffness and a spreading petechial rash. Which organism is the most likely cause?",
    ["Neisseria meningitidis", "Meningococcal disease affects young adults in close living quarters and can cause petechial or purpuric rash."],
    [
      ["Listeria monocytogenes", "This is more common in neonates, older adults and immunocompromised people."],
      ["Haemophilus influenzae type b", "Hib is now rare because of vaccination."],
      ["Herpes simplex virus", "HSV is a cause of encephalitis, which often presents with altered mentation and temporal lobe findings."],
    ],
    "Suspected bacterial meningitis is an emergency: obtain blood cultures, give empiric antibiotics and dexamethasone promptly, and do not delay treatment for imaging or lumbar puncture. Close contacts of meningococcal cases receive chemoprophylaxis.",
    "Dorm plus petechial rash plus meningitis signs: meningococcus.", ["infection", "emergency"])),
  withSystem("Endocrine", pance.mcq(PA_DX, "Diabetic ketoacidosis", "moderate",
    "A 17-year-old with polyuria, abdominal pain and deep rapid breathing has glucose 450 mg/dL, bicarbonate 10 mEq/L, an elevated anion gap and positive serum ketones. What is the diagnosis?",
    ["Diabetic ketoacidosis", "Hyperglycemia, ketonemia and anion-gap metabolic acidosis define DKA."],
    [
      ["Hyperosmolar hyperglycemic state", "HHS has extreme hyperglycemia and hyperosmolality without significant ketoacidosis."],
      ["Alcoholic ketoacidosis", "This occurs with heavy alcohol use and usually with normal or low glucose."],
      ["Lactic acidosis from metformin", "Ketones would be absent and the patient would not typically be a new diabetic adolescent."],
    ],
    "DKA is typical in type 1 diabetes and is often precipitated by infection, missed insulin or new-onset disease. Kussmaul respirations compensate for metabolic acidosis. Management includes fluids, potassium replacement and insulin infusion.",
    "Glucose high plus ketones plus anion gap: DKA.", ["emergency", "endocrine"])),

  // ---- Health Maintenance (4)
  withSystem("Gastrointestinal", pance.mcq(PA_HM, "Colorectal cancer screening", "easy",
    "A 47-year-old average-risk man has never been screened for colorectal cancer. What is the best recommendation?",
    ["Begin screening now with a stool-based test or colonoscopy", "Current guidelines recommend screening average-risk adults from age 45."],
    [
      ["Wait until age 60 to begin screening", "Screening should begin at 45."],
      ["Begin screening only if symptoms develop", "Screening is for asymptomatic people; symptoms warrant diagnostic evaluation."],
      ["Order a carcinoembryonic antigen level annually", "CEA is not a screening test."],
    ],
    "For average-risk adults, colorectal cancer screening is recommended from age 45 through 75. Options include annual fecal immunochemical test, stool DNA testing every 1 to 3 years depending on the test, and colonoscopy every 10 years. Individualize after 75.",
    "Average-risk screening starts at 45.", ["screening", "cancer"])),
  withSystem("Reproductive", pance.mcq(PA_HM, "Immunizations in pregnancy", "moderate",
    "A pregnant patient at 30 weeks of gestation has not received Tdap during this pregnancy. What should the PA recommend?",
    ["Administer Tdap now, preferably between 27 and 36 weeks, with every pregnancy", "Maternal vaccination provides antibodies that protect newborns from pertussis."],
    [
      ["Delay Tdap until the postpartum visit", "Delaying forgoes protection for the newborn in the first months."],
      ["Avoid all vaccines during pregnancy", "Inactivated vaccines such as Tdap are recommended, only live vaccines are avoided."],
      ["Give MMR instead", "MMR is a live vaccine and is contraindicated in pregnancy."],
    ],
    "Tdap is recommended during every pregnancy, ideally from 27 to 36 weeks, regardless of previous Tdap history. Inactivated influenza vaccine is also recommended. Live vaccines such as MMR and varicella are deferred until after delivery.",
    "Tdap every pregnancy at 27 to 36 weeks.", ["vaccines", "pregnancy"])),
  withSystem("Reproductive", pance.mcq(PA_HM, "Cervical cancer screening", "moderate",
    "A 35-year-old woman with a normal screening history asks about cervical cancer screening. Which is an appropriate recommendation?",
    ["Primary HPV testing every 5 years, or cytology every 3 years", "In average-risk women aged 30 to 65, these are recommended screening options."],
    [
      ["Annual Pap testing", "Annual screening is not needed in average-risk women and increases false positives."],
      ["Screening every 10 years with cytology", "This interval is too long for cytology."],
      ["No screening is needed after age 30", "Screening continues through age 65 if adequately screened and normal."],
    ],
    "Women 21 to 29 receive cytology every 3 years. Women 30 to 65 can choose cytology every 3 years, high-risk HPV testing every 5 years, or cotesting every 5 years. Screening stops after 65 if adequate prior negative screening, and after hysterectomy with cervix removal for benign disease.",
    "21-29: cytology q3y; 30-65: add HPV options q5y.", ["screening", "women's health"])),
  withSystem("Pulmonary", pance.mcq(PA_HM, "Lung cancer screening", "difficult",
    "Which patient meets criteria for annual low-dose CT screening for lung cancer?",
    ["A 62-year-old with a 30 pack-year smoking history who quit 5 years ago", "Screening is for ages 50 to 80 with at least a 20 pack-year history who currently smoke or quit within the past 15 years."],
    [
      ["A 45-year-old current smoker with a 40 pack-year history", "The patient is below the age threshold of 50."],
      ["A 66-year-old with a 10 pack-year history who quit 3 years ago", "The pack-year history is below 20."],
      ["A 60-year-old with a 30 pack-year history who quit 25 years ago", "More than 15 years have passed since quitting."],
    ],
    "The USPSTF recommends annual low-dose CT in adults aged 50 to 80 years with at least a 20 pack-year smoking history who currently smoke or quit within the past 15 years. Screening stops once the patient has not smoked for 15 years or develops a health problem that limits life expectancy.",
    "50-80 years, 20 pack-years, quit under 15 years ago.", ["screening", "cancer"])),

  // ---- Clinical Intervention (5)
  withSystem("Pulmonary", pance.mcq(PA_CI, "Community-acquired pneumonia", "moderate",
    "A previously healthy 35-year-old nonsmoker has community-acquired pneumonia and is well enough for outpatient care. Which initial antibiotic regimen is appropriate?",
    ["Amoxicillin or doxycycline", "For healthy adults without comorbidities, amoxicillin or doxycycline is recommended, and a macrolide is used only where pneumococcal macrolide resistance is low."],
    [
      ["Intravenous vancomycin and piperacillin-tazobactam", "Broad-spectrum IV therapy is reserved for severe disease with risk factors for resistant organisms."],
      ["Oral nitrofurantoin", "This urinary antibiotic does not reach therapeutic levels in lung tissue."],
      ["No antibiotics, because most pneumonias are viral", "Clinically and radiographically confirmed CAP warrants antibiotics."],
    ],
    "Outpatient CAP in a healthy adult is commonly treated with amoxicillin or doxycycline. Patients with comorbidities receive a combination such as a beta-lactam plus a macrolide, or a respiratory fluoroquinolone. Use severity tools such as CURB-65 to guide site of care.",
    "Healthy outpatient CAP: amoxicillin or doxycycline.", ["pneumonia", "antibiotics"])),
  withSystem("Cardiovascular", pance.mcq(PA_CI, "ST-elevation myocardial infarction", "moderate",
    "A patient arrives with chest pain and ST elevation in V1 to V4. A catheterization laboratory is available within minutes. What is the preferred reperfusion strategy?",
    ["Primary percutaneous coronary intervention", "When it is available in a timely manner, primary PCI is preferred over fibrinolysis."],
    [
      ["Fibrinolysis only, even if PCI is available", "Fibrinolysis is used when PCI cannot be performed within the recommended window."],
      ["Observation with serial troponins", "STEMI is a clinical and ECG diagnosis; waiting delays reperfusion."],
      ["Outpatient stress testing", "Stress testing is contraindicated in an acute infarction."],
    ],
    "Time is myocardium. Give aspirin, anticoagulation and a P2Y12 inhibitor per protocol, and proceed to primary PCI with a goal of rapid first medical contact to device time. Use fibrinolysis if PCI is not available within the guideline timeframe and no contraindications exist.",
    "STEMI with PCI access: go to the cath lab.", ["emergency", "reperfusion"])),
  withSystem("Allergy and Immunology", pance.mcq(PA_CI, "Anaphylaxis", "easy",
    "A patient develops urticaria, wheezing and hypotension minutes after a bee sting. What is the first-line medication?",
    ["Intramuscular epinephrine in the anterolateral thigh", "Epinephrine is the first-line treatment and delays are associated with worse outcomes."],
    [
      ["Intravenous diphenhydramine alone", "Antihistamines relieve itching but do not treat airway edema or hypotension."],
      ["Oral prednisone alone", "Steroids take hours to act and do not reverse acute anaphylaxis."],
      ["Inhaled albuterol alone", "Albuterol may help wheezing but does not address the systemic reaction."],
    ],
    "Anaphylaxis is treated immediately with IM epinephrine, repeating in 5 to 15 minutes if needed. Place the patient supine, give oxygen and fluids and monitor. Antihistamines and corticosteroids are adjuncts only.",
    "Anaphylaxis: epinephrine IM first.", ["emergency"])),
  withSystem("Pulmonary", pance.mcq(PA_CI, "Asthma exacerbation", "moderate",
    "A 25-year-old with an acute asthma exacerbation is wheezing and speaks in short phrases. What combination is most appropriate for initial therapy?",
    ["Repeated inhaled short-acting beta agonist and a systemic corticosteroid", "Rapid bronchodilation plus early steroids reduce airway inflammation and need for admission."],
    [
      ["A long-acting beta agonist alone as rescue", "LABAs act too slowly to be rescue therapy when used alone."],
      ["Oral antibiotics and an antitussive", "Antibiotics are not routinely indicated and cough suppression is not helpful."],
      ["Beta-blocker therapy", "Beta-blockers can precipitate bronchospasm."],
    ],
    "Treat acute asthma with oxygen as needed, frequent albuterol (often with ipratropium in severe cases), and systemic steroids. Reassess response. Poor response, silent chest, or fatigue indicates impending respiratory failure.",
    "Acute asthma: SABA plus steroid, add ipratropium if severe.", ["asthma", "emergency"])),
  withSystem("Pulmonary", pance.mcq(PA_CI, "Tension pneumothorax", "difficult",
    "A trauma patient has hypotension, jugular venous distension, tracheal deviation and absent breath sounds on the right. What is the most appropriate next step?",
    ["Immediate needle decompression of the right chest", "A tension pneumothorax is a clinical diagnosis requiring immediate decompression without waiting for imaging."],
    [
      ["Obtain a chest radiograph before intervening", "Delay can result in cardiac arrest."],
      ["Intubate and begin positive-pressure ventilation first", "Positive pressure can worsen a tension pneumothorax."],
      ["Give a fluid bolus and observe", "Fluids will not correct obstructive shock."],
    ],
    "Tension physiology occurs when air trapped in the pleural space compresses the mediastinum and impairs venous return. After needle or finger decompression, place a chest tube. Tracheal deviation is a late finding.",
    "Tension pneumothorax: decompress now, image later.", ["trauma", "emergency"])),

  // ---- Pharmaceutical Therapeutics (4)
  withSystem("Endocrine", pance.mcq(PA_RX, "Type 2 diabetes mellitus", "moderate",
    "A patient with type 2 diabetes is started on an SGLT2 inhibitor. Which adverse effect should the PA counsel the patient about?",
    ["Genital mycotic infections", "Glucosuria increases the risk of genital yeast infections, and rarely euglycemic ketoacidosis or Fournier gangrene."],
    [
      ["Severe hypoglycemia as monotherapy", "SGLT2 inhibitors rarely cause hypoglycemia alone."],
      ["Pancreatitis as the hallmark adverse effect", "Pancreatitis is more associated with GLP-1 agonists and DPP-4 inhibitors."],
      ["Fluid retention and edema", "This is typical of thiazolidinediones rather than SGLT2 inhibitors."],
    ],
    "SGLT2 inhibitors lower glucose by increasing urinary glucose excretion. They provide cardiovascular and renal benefit but can cause volume depletion, genital mycotic infection and euglycemic DKA. Hold them during acute illness or before surgery.",
    "SGLT2 inhibitors: genital yeast infections and euglycemic DKA.", ["diabetes", "adverse effects"])),
  withSystem("Cardiovascular", pance.mcq(PA_RX, "Statin therapy", "difficult",
    "A patient taking simvastatin is prescribed clarithromycin for pneumonia. What is the main concern?",
    ["Increased risk of myopathy and rhabdomyolysis from CYP3A4 inhibition", "Clarithromycin inhibits CYP3A4, raising simvastatin levels."],
    [
      ["Decreased statin effectiveness from enzyme induction", "Clarithromycin inhibits, not induces, metabolism."],
      ["Liver failure from the antibiotic alone", "The concern is the interaction, not isolated hepatotoxicity."],
      ["No interaction, so no change is needed", "This interaction is clinically important."],
    ],
    "Simvastatin, lovastatin and atorvastatin are metabolized by CYP3A4. Strong inhibitors such as clarithromycin, itraconazole and ritonavir raise levels. Hold the statin temporarily or choose an antibiotic that does not interact, such as azithromycin or doxycycline.",
    "CYP3A4 inhibitors plus simvastatin: rhabdomyolysis risk.", ["interaction", "statin"])),
  withSystem("Hematology", pance.mcq(PA_RX, "Warfarin therapy", "moderate",
    "A patient with a stable INR on warfarin starts rifampin for tuberculosis. What effect is expected?",
    ["A decreased INR because rifampin induces warfarin metabolism", "Rifampin is a potent CYP inducer and lowers warfarin levels, often requiring a much higher dose."],
    [
      ["An increased INR from CYP inhibition", "Rifampin induces rather than inhibits CYP enzymes."],
      ["No change, because rifampin does not affect hepatic enzymes", "Rifampin affects many hepatic enzymes."],
      ["A reduced bleeding risk without a change in INR", "INR reflects the effect and would change."],
    ],
    "Enzyme inducers (rifampin, carbamazepine, phenytoin, St John wort) lower warfarin effect. Inhibitors (amiodarone, fluconazole, metronidazole, trimethoprim-sulfamethoxazole) raise it. Monitor INR closely after starting or stopping interacting drugs.",
    "Inducers lower INR; inhibitors raise it.", ["anticoagulation", "interaction"])),
  withSystem("Musculoskeletal", pance.mcq(PA_RX, "Fluoroquinolones", "easy",
    "A 60-year-old patient taking prednisone is prescribed levofloxacin. What boxed warning is most relevant?",
    ["Tendinitis and tendon rupture", "Risk is higher in older adults and those taking corticosteroids."],
    [
      ["Gray baby syndrome", "This is associated with chloramphenicol in neonates."],
      ["Red man syndrome", "This is an infusion reaction to rapid vancomycin administration."],
      ["Ototoxicity at therapeutic doses in all patients", "Ototoxicity is associated more with aminoglycosides."],
    ],
    "Fluoroquinolones carry boxed warnings for tendinopathy and tendon rupture, peripheral neuropathy, central nervous system effects and myasthenia gravis exacerbation. They can also prolong the QT interval and cause aortic aneurysm or dissection in susceptible patients. Reserve them for infections without safer options.",
    "Fluoroquinolone plus steroid plus older age: tendon rupture.", ["adverse effects", "antibiotics"])),

  // ---- Applying Basic Science Concepts (3)
  withSystem("Cardiovascular", pance.mcq(PA_BS, "Pharmacokinetics", "moderate",
    "Why is nitroglycerin given sublingually for acute angina rather than swallowed?",
    ["Sublingual absorption avoids extensive first-pass hepatic metabolism", "Oral nitroglycerin is largely inactivated by the liver before reaching the circulation."],
    [
      ["The drug is destroyed completely by stomach acid", "Gastric acid is not the main barrier."],
      ["Sublingual dosing slows absorption to prolong the effect", "Sublingual dosing speeds the onset."],
      ["It is inactive until it contacts saliva", "The drug does not require saliva for activation."],
    ],
    "Drugs absorbed through the oral mucosa drain into the systemic circulation, bypassing the portal vein and the first-pass effect. This yields rapid onset and higher bioavailability for drugs such as nitroglycerin.",
    "Sublingual route bypasses first-pass metabolism.", ["pharmacology"])),
  withSystem("Renal", pance.mcq(PA_BS, "Acid-base balance", "difficult",
    "A patient has an arterial pH of 7.30, serum bicarbonate of 14 mEq/L and a PaCO2 of 30 mmHg. How should this be interpreted?",
    ["Metabolic acidosis with respiratory compensation", "Low pH and low bicarbonate indicate metabolic acidosis, and the lowered PaCO2 is the lungs compensating."],
    [
      ["Respiratory acidosis with metabolic compensation", "Respiratory acidosis would have a high PaCO2."],
      ["Metabolic alkalosis with respiratory compensation", "Alkalosis would show a high pH."],
      ["A normal acid-base status", "The pH and bicarbonate are abnormal."],
    ],
    "Begin with pH to define acidemia or alkalemia, then identify the primary process by comparing bicarbonate and PaCO2. A low pH with low bicarbonate is metabolic acidosis. Check the anion gap to narrow the cause.",
    "Low pH with low HCO3: metabolic acidosis; low CO2 is compensation.", ["ABG"])),
  withSystem("Infectious Disease", pance.mcq(PA_BS, "Microbiology", "easy",
    "A wound culture grows gram-positive cocci in clusters that are catalase-positive and coagulase-positive. What is the organism?",
    ["Staphylococcus aureus", "Coagulase positivity distinguishes S. aureus from other staphylococci."],
    [
      ["Staphylococcus epidermidis", "S. epidermidis is coagulase-negative."],
      ["Streptococcus pyogenes", "Streptococci grow in chains and are catalase-negative."],
      ["Enterococcus faecalis", "Enterococci are catalase-negative cocci in pairs or short chains."],
    ],
    "Gram-positive cocci in clusters are staphylococci. Catalase differentiates staphylococci (positive) from streptococci (negative). Coagulase separates Staphylococcus aureus (positive) from coagulase-negative staphylococci.",
    "Clusters plus catalase positive plus coagulase positive: S. aureus.", ["microbiology"])),
];

/* ------------------------------------------------------------------ */
/* PANRE questions                                                     */
/* ------------------------------------------------------------------ */
const panre = makeBuilders("panre");

const PANRE_QUESTIONS: SeedQuestion[] = [
  // ---- History Taking and Physical Examination (4)
  withSystem("Neurologic", panre.mcq(PA_HX, "Cauda equina syndrome", "difficult",
    "A 50-year-old man with low back pain has new bilateral leg weakness and urinary retention. Which examination finding most strongly supports cauda equina syndrome?",
    ["Decreased rectal sphincter tone with saddle-region sensory loss", "These findings reflect compression of the sacral nerve roots and require emergent imaging."],
    [
      ["A positive unilateral straight leg raise", "This suggests a single-root radiculopathy and is common with disc herniation."],
      ["Local paraspinal muscle tenderness", "This is nonspecific and typical of mechanical back pain."],
      ["Pain that improves with lumbar flexion", "This pattern is typical of spinal stenosis and does not indicate an emergency."],
    ],
    "Cauda equina syndrome presents with low back pain, bilateral or progressive leg weakness, saddle anesthesia and bladder or bowel dysfunction. Urgent MRI and surgical decompression prevent permanent deficits. Retention with overflow incontinence is a late and ominous sign.",
    "Saddle anesthesia plus retention plus low tone: emergent MRI.", ["red flags"])),
  withSystem("Gastrointestinal", panre.mcq(PA_HX, "Abdominal examination", "moderate",
    "Palpation of the left lower quadrant causes pain in the right lower quadrant. What is this sign called and what condition does it suggest?",
    ["Rovsing sign, suggesting appendicitis", "Referred pain to the right lower quadrant on left-sided palpation suggests peritoneal irritation from appendicitis."],
    [
      ["Murphy sign, suggesting cholecystitis", "Murphy sign is inspiratory arrest on palpation of the right upper quadrant."],
      ["Cullen sign, suggesting retroperitoneal hemorrhage", "Cullen sign is periumbilical ecchymosis."],
      ["Courvoisier sign, suggesting pancreatic head cancer", "This is a palpable nontender gallbladder with jaundice."],
    ],
    "Appendicitis signs include Rovsing (referred pain), psoas (pain with hip extension) and obturator (pain with internal rotation of the flexed hip). A negative sign does not exclude appendicitis, so imaging often guides management.",
    "Rovsing: left-sided pressure, right-sided pain: appendicitis.", ["physical exam"])),
  withSystem("Neurologic", panre.mcq(PA_HX, "Neurologic examination", "moderate",
    "A 70-year-old man has a resting hand tremor, slowness of movement and ratchet-like resistance to passive movement of the arm. Which diagnosis is most likely?",
    ["Parkinson disease", "Resting tremor, bradykinesia and cogwheel rigidity are the cardinal features."],
    [
      ["Essential tremor", "This tremor occurs with posture or action and usually improves with rest."],
      ["Cerebellar ataxia", "Cerebellar disease causes intention tremor and incoordination."],
      ["Huntington disease", "This causes chorea and cognitive decline, not rigidity and bradykinesia."],
    ],
    "Parkinson disease is diagnosed clinically by bradykinesia plus resting tremor or rigidity, with postural instability developing later. Treatment is guided by symptom severity, with levodopa as the most effective therapy.",
    "Resting tremor plus bradykinesia plus cogwheel rigidity: Parkinson.", ["neuro exam"])),
  withSystem("Behavioral Science", panre.mcq(PA_HX, "Geriatric history", "moderate",
    "An older woman has unexplained bruises in different stages of healing. Her caregiver answers every question for her. What is the best next step?",
    ["Interview the patient privately and screen for abuse", "Private interviews allow patients to disclose mistreatment safely."],
    [
      ["Accept the caregiver's explanation and document it", "Accepting the caregiver's story without independent assessment risks missing abuse."],
      ["Confront the caregiver in front of the patient", "This can escalate risk to the patient."],
      ["Defer the evaluation until the next annual visit", "Delay can lead to harm."],
    ],
    "Suspected elder abuse requires a private interview, a careful exam with documentation of injuries and notification of the appropriate authorities according to state law. Many states mandate clinician reporting. Ensure the patient's immediate safety.",
    "See the patient alone; report suspected abuse as required.", ["abuse", "geriatrics"])),

  // ---- Diagnostic Studies (4)
  withSystem("Pulmonary", panre.mcq(PA_DS, "Pulmonary function testing", "moderate",
    "A 64-year-old smoker has chronic cough and dyspnea. Spirometry after bronchodilator shows an FEV1/FVC ratio of 0.62. What does this indicate?",
    ["Persistent airflow obstruction consistent with COPD", "A post-bronchodilator ratio below 0.70 confirms persistent airflow limitation."],
    [
      ["A restrictive pattern", "Restriction shows a normal or high ratio with reduced FVC."],
      ["Normal lung function", "A ratio of 0.62 is abnormal."],
      ["Reversible airflow obstruction diagnostic of asthma", "Persistent obstruction after a bronchodilator points toward COPD."],
    ],
    "Obstructive disease reduces FEV1 more than FVC, lowering the ratio. COPD is confirmed by a post-bronchodilator FEV1/FVC below 0.70 in the right clinical setting. Restrictive disease reduces both volumes proportionally, keeping the ratio normal.",
    "Post-bronchodilator FEV1/FVC under 0.70: COPD.", ["spirometry"])),
  withSystem("Neurologic", panre.mcq(PA_DS, "Stroke imaging", "moderate",
    "A patient presents 1 hour after sudden right-sided weakness and aphasia. Which imaging study should be obtained first?",
    ["Noncontrast head CT", "It rapidly excludes intracranial hemorrhage before any thrombolytic decision."],
    [
      ["MRI of the lumbar spine", "This does not evaluate the brain."],
      ["Carotid ultrasonography only", "It does not rule out hemorrhage and delays treatment."],
      ["Electroencephalography", "EEG is not used to diagnose acute stroke."],
    ],
    "In suspected acute stroke, check glucose and obtain emergent noncontrast CT. Hemorrhage excludes thrombolysis and anticoagulation. CT angiography can then identify large vessel occlusion for thrombectomy candidates.",
    "Acute stroke: glucose and noncontrast CT first.", ["emergency", "imaging"])),
  withSystem("Infectious Disease", panre.mcq(PA_DS, "Hepatitis serology", "difficult",
    "A patient's results are HBsAg negative, anti-HBs positive and anti-HBc total negative. What is the most likely explanation?",
    ["Immunity from hepatitis B vaccination", "Isolated anti-HBs indicates vaccine-induced immunity."],
    [
      ["Acute hepatitis B infection", "Acute infection shows positive HBsAg and IgM anti-HBc."],
      ["Chronic hepatitis B infection", "Chronic infection has persistent HBsAg."],
      ["Resolved natural infection", "Natural infection produces anti-HBc in addition to anti-HBs."],
    ],
    "Vaccination produces only anti-HBs. Natural recovery produces anti-HBs and anti-HBc. Acute infection shows HBsAg and IgM anti-HBc. Chronic infection shows HBsAg for more than 6 months with IgG anti-HBc.",
    "Anti-HBs alone: vaccinated.", ["serology"])),
  withSystem("Renal", panre.mcq(PA_DS, "Urinalysis", "moderate",
    "A urinalysis shows hematuria and red blood cell casts. Which condition is most strongly suggested?",
    ["Glomerulonephritis", "Red cell casts form in the nephron and indicate glomerular bleeding."],
    [
      ["Acute cystitis", "Cystitis produces pyuria and bacteria but not casts."],
      ["Nephrolithiasis", "Stones cause hematuria without casts."],
      ["Benign prostatic hyperplasia", "BPH does not cause red cell casts."],
    ],
    "Red blood cell casts and dysmorphic red cells localize bleeding to the glomerulus. White cell casts suggest pyelonephritis or interstitial nephritis. Granular casts suggest tubular injury.",
    "RBC casts mean glomerular disease.", ["urinalysis", "nephrology"])),

  // ---- Diagnosis (5)
  withSystem("Neurologic", panre.mcq(PA_DX, "Giant cell arteritis", "difficult",
    "A 72-year-old woman has new temporal headache, jaw pain when chewing, scalp tenderness and an ESR of 95 mm/hr. What is the most likely diagnosis?",
    ["Giant cell arteritis", "New headache after age 50, jaw claudication, scalp tenderness and a high ESR point to giant cell arteritis."],
    [
      ["Migraine without aura", "Migraine does not cause jaw claudication or a markedly elevated ESR."],
      ["Trigeminal neuralgia", "This causes brief electric shock pains, not jaw claudication."],
      ["Tension-type headache", "This is a bilateral pressure headache without systemic features."],
    ],
    "Giant cell arteritis can cause irreversible vision loss, so high-dose glucocorticoids are started immediately when it is suspected, without waiting for temporal artery biopsy. It is frequently associated with polymyalgia rheumatica.",
    "Over 50 with new headache and jaw claudication: GCA; start steroids at once.", ["vasculitis"])),
  withSystem("Endocrine", panre.mcq(PA_DX, "Adrenal insufficiency", "difficult",
    "A patient has fatigue, weight loss, orthostatic hypotension, hyperpigmentation of the skin folds, hyponatremia and hyperkalemia. What is the most likely diagnosis?",
    ["Primary adrenal insufficiency", "Skin hyperpigmentation with hyperkalemia suggests loss of both cortisol and aldosterone from adrenal failure."],
    [
      ["Cushing syndrome", "Cushing syndrome causes weight gain, hypertension and hyperglycemia."],
      ["Primary hyperaldosteronism", "This produces hypertension with hypokalemia."],
      ["Pheochromocytoma", "This causes episodic hypertension, palpitations and sweating."],
    ],
    "In primary adrenal insufficiency (Addison disease), high ACTH stimulates melanocytes, causing hyperpigmentation. Mineralocorticoid deficiency causes hyperkalemia and volume depletion. Adrenal crisis requires immediate IV hydrocortisone and fluids.",
    "Hyperpigmentation plus hyperkalemia: primary adrenal insufficiency.", ["adrenal"])),
  withSystem("Pediatrics", panre.mcq(PA_DX, "Kawasaki disease", "difficult",
    "A 3-year-old has had fever for 6 days with bilateral nonexudative conjunctivitis, a strawberry tongue, cervical lymphadenopathy, a polymorphous rash and swollen hands. What is the most important complication to prevent?",
    ["Coronary artery aneurysm", "Kawasaki disease is a vasculitis that can damage coronary arteries if untreated."],
    [
      ["Glomerulonephritis", "This is associated with poststreptococcal infection."],
      ["Rheumatic mitral stenosis", "This is a late complication of rheumatic fever."],
      ["Bacterial endocarditis", "This is not a typical complication."],
    ],
    "Treat Kawasaki disease with intravenous immune globulin and aspirin, ideally within 10 days of fever onset. Obtain echocardiography at diagnosis and follow-up. Affected children need follow-up for coronary artery changes.",
    "Fever 5 days or more plus mucocutaneous signs: IVIG, aspirin, echocardiogram.", ["vasculitis", "pediatrics"])),
  withSystem("Reproductive", panre.mcq(PA_DX, "Ectopic pregnancy", "moderate",
    "A 27-year-old woman with 7 weeks of amenorrhea has unilateral pelvic pain and light vaginal bleeding. Her urine hCG is positive and transvaginal ultrasound shows an empty uterus with a quantitative hCG above the discriminatory level. What is the most likely diagnosis?",
    ["Ectopic pregnancy", "A positive hCG with no intrauterine pregnancy at an adequate hCG level suggests an extrauterine pregnancy."],
    [
      ["Normal early intrauterine pregnancy", "A normal pregnancy would be visible in the uterus above the discriminatory level."],
      ["Ovarian torsion", "Torsion causes acute pain but wouldn't explain an empty uterus with positive hCG."],
      ["Pelvic inflammatory disease", "PID causes fever and cervical motion tenderness without a pregnancy-related empty uterus finding."],
    ],
    "Ectopic pregnancy is a leading cause of first-trimester maternal death. Rupture causes hemoperitoneum and shock. Management ranges from methotrexate in stable, selected patients to surgery for unstable patients.",
    "Positive hCG, empty uterus, pain: ectopic until proven otherwise.", ["obstetrics", "emergency"])),
  withSystem("Musculoskeletal", panre.mcq(PA_DX, "Polymyalgia rheumatica", "moderate",
    "A 68-year-old woman has 3 weeks of morning stiffness and aching in both shoulders and hips, an elevated ESR and a normal creatine kinase. What is the most likely diagnosis?",
    ["Polymyalgia rheumatica", "Proximal girdle stiffness in older adults with elevated inflammatory markers and normal CK is characteristic."],
    [
      ["Polymyositis", "Polymyositis causes true proximal weakness and elevated CK."],
      ["Fibromyalgia", "Fibromyalgia has normal inflammatory markers and tender points."],
      ["Osteoarthritis of the shoulders", "This is typically asymmetric, with brief morning stiffness and normal ESR."],
    ],
    "Polymyalgia rheumatica responds dramatically to low-dose prednisone. Screen for giant cell arteritis because the two conditions overlap.",
    "Girdle stiffness, high ESR, normal CK, age over 50: PMR.", ["rheumatology"])),

  // ---- Health Maintenance (4)
  withSystem("Gastrointestinal", panre.mcq(PA_HM, "Colorectal cancer screening", "difficult",
    "A 41-year-old man has a father who was diagnosed with colorectal cancer at age 52. He has never been screened. What is the best recommendation?",
    ["Colonoscopy now, because screening should begin at age 40 or 10 years before the relative's diagnosis, whichever is earlier", "A first-degree relative diagnosed before age 60 moves screening earlier and favors colonoscopy at shorter intervals."],
    [
      ["Wait until age 45 and begin a stool test", "Family history lowers the starting age."],
      ["Repeat screening only after age 50", "This delays screening beyond the recommended start."],
      ["No screening is needed because the father was over 50", "Diagnosis before age 60 raises risk."],
    ],
    "For a first-degree relative diagnosed before age 60, recommended practice is to start screening at age 40, or 10 years before the youngest diagnosis, whichever is earlier, with colonoscopy about every 5 years. Relatives diagnosed at 60 or older have a more modest risk increase.",
    "First-degree relative under 60: start at 40 or 10 years earlier; colonoscopy every 5 years.", ["screening", "family history"])),
  withSystem("Cardiovascular", panre.mcq(PA_HM, "Abdominal aortic aneurysm screening", "moderate",
    "Which patient should be offered one-time ultrasound screening for abdominal aortic aneurysm?",
    ["A 68-year-old man who smoked in the past", "Men aged 65 to 75 who have ever smoked are recommended for one-time screening."],
    [
      ["A 40-year-old woman who has never smoked", "Screening is not recommended for low-risk women."],
      ["A 55-year-old man who has never smoked", "He is below the age range and a never-smoker."],
      ["A 70-year-old woman who has never smoked", "Evidence is insufficient to recommend screening for never-smoking women."],
    ],
    "The USPSTF recommends one-time ultrasonography for men aged 65 to 75 who have ever smoked. Selective screening is considered for men in that age group who never smoked. Evidence is insufficient for women who have ever smoked.",
    "Men 65-75 who ever smoked: one-time ultrasound.", ["screening"])),
  withSystem("Infectious Disease", panre.mcq(PA_HM, "Adult immunizations", "moderate",
    "A healthy 55-year-old patient asks about herpes zoster prevention. What is the recommended vaccination strategy?",
    ["A two-dose series of recombinant zoster vaccine", "Recombinant zoster vaccine is recommended for adults aged 50 and older, regardless of prior shingles."],
    [
      ["A single dose of live zoster vaccine", "The live vaccine is no longer used in the United States."],
      ["Vaccination only after age 80", "Vaccination is recommended from age 50."],
      ["No vaccine is available", "An effective recombinant vaccine is available."],
    ],
    "Recombinant zoster vaccine is given as 2 doses, 2 to 6 months apart, in adults 50 and older. It is also recommended for certain immunocompromised adults aged 19 and older. It is not live, so it can be used in many immunosuppressed patients.",
    "RZV two doses at age 50 and older.", ["vaccines"])),
  withSystem("Musculoskeletal", panre.mcq(PA_HM, "Osteoporosis screening", "easy",
    "At what age should bone density screening with DXA be recommended for a postmenopausal woman without additional risk factors?",
    ["At age 65", "Routine DXA is recommended for women aged 65 and older."],
    [
      ["At age 40", "This is too early for average-risk women."],
      ["At age 80 only", "Screening is recommended well before age 80."],
      ["Never, unless she has a fracture", "Screening aims to find osteoporosis before fracture."],
    ],
    "Screen all women 65 and older with DXA, and consider earlier screening in postmenopausal women with risk factors such as low body weight, prior fracture, glucocorticoid use, smoking or family history. Treat based on T-score and fracture risk.",
    "DXA for all women at 65; earlier if risk factors.", ["screening"])),

  // ---- Clinical Intervention (5)
  withSystem("Cardiovascular", panre.mcq(PA_CI, "Atrial fibrillation", "difficult",
    "A 72-year-old man with hypertension has nonvalvular atrial fibrillation. His CHA2DS2-VASc score is 2. What is the most appropriate stroke-prevention strategy?",
    ["Long-term oral anticoagulation, preferably with a direct oral anticoagulant", "Men with a score of 2 or more benefit from anticoagulation, and DOACs are generally preferred over warfarin in nonvalvular AF."],
    [
      ["Aspirin alone", "Aspirin is not an effective stroke-prevention strategy for AF."],
      ["No therapy because the heart rate is controlled", "Rate control does not remove stroke risk."],
      ["Clopidogrel alone", "This is inferior to anticoagulation for stroke prevention."],
    ],
    "CHA2DS2-VASc assigns points for heart failure, hypertension, age 75 or older (2), diabetes, stroke (2), vascular disease, age 65 to 74 and female sex. The decision to anticoagulate is independent of whether the rhythm is controlled. Use warfarin for AF with moderate to severe mitral stenosis or a mechanical valve.",
    "Anticoagulate for CHA2DS2-VASc 2 or more in men (3 or more in women).", ["AF", "anticoagulation"])),
  withSystem("Cardiovascular", panre.mcq(PA_CI, "Atrial fibrillation", "moderate",
    "A patient with atrial fibrillation and a rapid ventricular rate has hypotension, chest pain and altered mental status. What is the best management?",
    ["Synchronized electrical cardioversion", "Hemodynamic instability due to a tachyarrhythmia calls for immediate synchronized cardioversion."],
    [
      ["Oral beta-blocker and outpatient follow-up", "This is too slow for an unstable patient."],
      ["Start warfarin and observe", "Anticoagulation does not treat the immediate instability."],
      ["Unsynchronized defibrillation", "Unsynchronized shocks are for pulseless ventricular arrhythmias."],
    ],
    "Unstable patients (hypotension, ischemia, heart failure, altered mental status) with a tachyarrhythmia need synchronized cardioversion. Stable patients are managed with rate or rhythm control and anticoagulation decisions.",
    "Unstable tachyarrhythmia: synchronized cardioversion.", ["emergency"])),
  withSystem("Endocrine", panre.mcq(PA_CI, "Diabetic ketoacidosis management", "difficult",
    "A patient with diabetic ketoacidosis has a serum potassium of 2.8 mEq/L. What is the appropriate sequence?",
    ["Replace potassium and delay insulin until the level is above 3.3 mEq/L", "Insulin shifts potassium into cells and could cause dangerous hypokalemia and arrhythmia."],
    [
      ["Start insulin infusion immediately", "This can worsen hypokalemia."],
      ["Give sodium bicarbonate first", "Bicarbonate is not routinely used and can lower potassium."],
      ["Withhold fluids to avoid dilution", "IV fluids are the first step of DKA treatment."],
    ],
    "Treat DKA with IV fluids, then insulin infusion once potassium is at least 3.3 mEq/L. Add potassium to fluids when levels fall below about 5.3 mEq/L. Monitor glucose, electrolytes and anion gap, and add dextrose when glucose approaches 200 mg/dL.",
    "Potassium under 3.3 in DKA: replace first, then insulin.", ["emergency", "electrolytes"])),
  withSystem("Pulmonary", panre.mcq(PA_CI, "Chronic obstructive pulmonary disease", "moderate",
    "A patient with severe COPD has a resting oxygen saturation of 86 percent on room air, confirmed on repeat testing while clinically stable. What intervention improves survival?",
    ["Long-term supplemental oxygen", "Long-term oxygen improves survival in COPD with severe resting hypoxemia."],
    [
      ["Long-term oral corticosteroids", "These increase adverse effects without a clear survival benefit."],
      ["Routine prophylactic antibiotics for all patients", "This is not recommended for all patients."],
      ["Daily antitussive therapy", "Cough suppression does not alter survival."],
    ],
    "Long-term oxygen therapy is indicated for resting hypoxemia, commonly PaO2 of 55 mmHg or less or saturation of 88 percent or less. Smoking cessation also reduces disease progression and mortality.",
    "COPD with resting saturation 88 percent or less: long-term oxygen.", ["COPD", "oxygen"])),
  withSystem("Cardiovascular", panre.mcq(PA_CI, "Hypertensive urgency", "moderate",
    "An asymptomatic patient has a blood pressure of 195/115 mmHg without evidence of end-organ damage. What is the most appropriate management?",
    ["Restart or adjust oral antihypertensive therapy and arrange prompt follow-up", "Without acute end-organ injury, blood pressure is reduced gradually with oral agents over days."],
    [
      ["Rapid reduction with intravenous nitroprusside", "Aggressive reduction can cause ischemia and is reserved for hypertensive emergencies."],
      ["Reduce blood pressure to normal within the hour", "Rapid normalization can cause hypoperfusion."],
      ["Immediately admit to the intensive care unit", "ICU care is for hypertensive emergencies."],
    ],
    "Hypertensive emergency means severely elevated blood pressure with acute end-organ injury such as encephalopathy, stroke, myocardial ischemia, pulmonary edema or aortic dissection. Treat emergencies with controlled IV reduction, and urgency with oral therapy and close follow-up.",
    "No end-organ damage: gradual oral control, not IV agents.", ["hypertension"])),

  // ---- Pharmaceutical Therapeutics (4)
  withSystem("Behavioral Science", panre.mcq(PA_RX, "Lithium", "difficult",
    "A patient with bipolar disorder is stable on lithium and is newly started on hydrochlorothiazide. What is the main concern?",
    ["Increased lithium levels and risk of toxicity", "Thiazides reduce renal lithium clearance."],
    [
      ["Decreased lithium levels and relapse", "Thiazides raise rather than lower lithium."],
      ["No effect on lithium", "Thiazides, NSAIDs and ACE inhibitors all raise lithium levels."],
      ["Diuretic-induced hypokalemia that reverses lithium effect", "The key interaction is reduced lithium excretion."],
    ],
    "Lithium has a narrow therapeutic index and is eliminated by the kidneys. Thiazide diuretics, NSAIDs and ACE inhibitors or ARBs increase levels. Dehydration also raises lithium. Monitor lithium, renal and thyroid function.",
    "Thiazides, NSAIDs and ACEi raise lithium.", ["interaction"])),
  withSystem("Behavioral Science", panre.mcq(PA_RX, "Serotonin syndrome", "difficult",
    "A patient taking sertraline is given tramadol for pain and develops agitation, tremor, clonus, diaphoresis and hyperthermia. What is the best management?",
    ["Discontinue the serotonergic drugs and give supportive care, with benzodiazepines for agitation", "Serotonin syndrome is a drug-induced excess of serotonergic activity that requires stopping offending agents."],
    [
      ["Increase the sertraline dose", "This would worsen toxicity."],
      ["Give dantrolene as first-line therapy", "Dantrolene is not recommended for serotonin syndrome."],
      ["Add a second serotonergic agent to balance the effect", "This increases the risk."],
    ],
    "Serotonin syndrome features neuromuscular hyperactivity (clonus, hyperreflexia), autonomic instability and altered mental status. It is distinct from neuroleptic malignant syndrome, which develops slowly and has bradyreflexia and lead-pipe rigidity. Severe cases may require cyproheptadine and cooling.",
    "Clonus plus hyperthermia plus serotonergic drugs: stop them, support.", ["interaction", "emergency"])),
  withSystem("Musculoskeletal", panre.mcq(PA_RX, "Methotrexate", "moderate",
    "A patient with rheumatoid arthritis begins weekly methotrexate. Which supplement helps reduce toxicity?",
    ["Folic acid", "Folic acid reduces mucosal, hematologic and hepatic toxicity."],
    [
      ["Vitamin K", "This reverses warfarin and does not protect against methotrexate toxicity."],
      ["Iron", "Iron does not reduce methotrexate toxicity."],
      ["Calcium carbonate", "This is unrelated."],
    ],
    "Methotrexate is dosed once weekly for rheumatoid arthritis, since daily dosing errors can be fatal. Monitor the complete blood count, liver tests and renal function, and avoid in pregnancy. Avoid trimethoprim-sulfamethoxazole because of the risk of marrow suppression.",
    "Weekly methotrexate plus daily folic acid.", ["rheumatology", "monitoring"])),
  withSystem("Hematology", panre.mcq(PA_RX, "Anticoagulant reversal", "difficult",
    "A patient taking dabigatran has life-threatening gastrointestinal bleeding. Which agent is the specific reversal agent?",
    ["Idarucizumab", "It is a monoclonal antibody fragment that binds dabigatran directly."],
    [
      ["Protamine sulfate", "It reverses heparin."],
      ["Phytonadione alone", "Vitamin K is for warfarin and works slowly."],
      ["Naloxone", "It reverses opioids."],
    ],
    "Know the antidotes. Warfarin: vitamin K and prothrombin complex concentrate. Unfractionated heparin: protamine. Dabigatran: idarucizumab. Factor Xa inhibitors such as apixaban and rivaroxaban: andexanet alfa or prothrombin complex concentrate.",
    "Dabigatran: idarucizumab. Xa inhibitors: andexanet or PCC.", ["reversal", "emergency"])),

  // ---- Applying Basic Science Concepts (4)
  withSystem("Genetics", panre.mcq(PA_BS, "Inheritance patterns", "moderate",
    "Two unaffected carriers of an autosomal recessive condition such as cystic fibrosis plan to have a child. What is the probability that a given child will be affected?",
    ["25 percent", "Each carrier parent passes the mutated allele with probability one half, so both is one quarter."],
    [
      ["50 percent", "This is the probability of being a carrier."],
      ["75 percent", "This is the probability of being unaffected, either carrier or noncarrier."],
      ["100 percent", "This would require both parents to be affected."],
    ],
    "For autosomal recessive conditions with two carrier parents, each child has a 25 percent chance of being affected, 50 percent of being a carrier and 25 percent of being unaffected and not a carrier.",
    "Carrier by carrier: 25 percent affected.", ["genetics"])),
  withSystem("Renal", panre.mcq(PA_BS, "Anion gap", "difficult",
    "A patient has Na 140, Cl 104 and HCO3 12 mEq/L. What is the anion gap, and what does it indicate?",
    ["24; a high anion gap metabolic acidosis such as lactic acidosis", "Anion gap = Na minus (Cl plus HCO3) = 140 - 116 = 24, which is elevated."],
    [
      ["8; a normal anion gap acidosis from diarrhea", "The calculation does not give 8."],
      ["24; a normal anion gap acidosis from renal tubular acidosis", "A gap of 24 is high, not normal."],
      ["12; a normal gap and a metabolic alkalosis", "The gap is not 12, and the bicarbonate is low, not high."],
    ],
    "A normal anion gap is about 8 to 12 mEq/L. A high gap with acidosis suggests unmeasured anions, as in lactic acidosis, ketoacidosis, uremia, toxic alcohols and salicylates. Diarrhea and renal tubular acidosis cause a normal gap with hyperchloremia.",
    "AG = Na minus (Cl + HCO3); above about 12 means unmeasured anions.", ["acid-base"])),
  withSystem("Hematology", panre.mcq(PA_BS, "Pathology", "easy",
    "A lymph node biopsy shows large binucleate cells with owl-eye nuclei. What is the diagnosis?",
    ["Hodgkin lymphoma", "Reed-Sternberg cells are the hallmark of Hodgkin lymphoma."],
    [
      ["Burkitt lymphoma", "This shows a starry-sky pattern."],
      ["Chronic lymphocytic leukemia", "This shows smudge cells and small mature lymphocytes."],
      ["Reactive lymphadenitis", "Reactive nodes have a polymorphous population without Reed-Sternberg cells."],
    ],
    "Hodgkin lymphoma often presents with painless cervical or supraclavicular lymphadenopathy, sometimes with B symptoms of fever, night sweats and weight loss. It has a bimodal age distribution and a high cure rate.",
    "Reed-Sternberg cells mean Hodgkin lymphoma.", ["pathology"])),
  withSystem("Biostatistics", panre.mcq(PA_BS, "Biostatistics", "difficult",
    "In a trial, the event rate is 10 percent in the control group and 6 percent in the treatment group. What is the number needed to treat to prevent one event?",
    ["25", "Absolute risk reduction is 4 percent (0.04), and the number needed to treat is 1 divided by 0.04."],
    [
      ["4", "This is the absolute risk reduction in percentage points, not the number needed to treat."],
      ["40", "This would require an absolute risk reduction of 2.5 percent."],
      ["60", "This confuses the treatment event rate with the NNT."],
    ],
    "Number needed to treat equals 1 divided by absolute risk reduction. Relative risk reduction (40 percent here) can appear impressive, whereas absolute risk reduction and NNT more accurately convey the clinical benefit.",
    "NNT = 1 / ARR.", ["statistics"])),
];

/* ------------------------------------------------------------------ */
/* Lessons                                                             */
/* ------------------------------------------------------------------ */
const PN_MATERIALS: SeedMaterial[] = [
  lesson("nclex-pn", SAF, "Transmission-based precautions", "notes",
    "Standard and Transmission-Based Precautions for the PN",
    "Match the organism's route of spread to the right room, PPE and hand hygiene.", 6, `
# Standard and Transmission-Based Precautions

Infection prevention is built in layers. **Standard precautions** are used with every client. **Transmission-based precautions** are added when a known or suspected organism spreads in a particular way.

## Standard precautions (all clients, all the time)
- Hand hygiene before and after client contact, after contact with body fluids and after removing gloves
- Gloves, gown, mask or eye protection when contact with blood, body fluids, nonintact skin or mucous membranes is expected
- Safe handling of sharps: never recap by hand, discard immediately in a puncture-resistant container
- Cough etiquette and clean, disinfected equipment

## Transmission-based categories
| Category | Spread by | Examples | Key requirements |
|---|---|---|---|
| Contact | Touch of client or environment | MRSA, C. difficile, scabies | Gown and gloves on entry; dedicated equipment |
| Droplet | Large particles within about 3 feet | Influenza, pertussis, meningococcal meningitis | Private room; surgical mask on entry |
| Airborne | Small particles that stay suspended | Tuberculosis, measles, varicella | Negative-pressure room; fitted N95 or higher |

## Practical points
- Put on PPE **before** entering the room. Remove gown and gloves **before** leaving, then perform hand hygiene.
- For *C. difficile*, alcohol-based hand rub does not kill spores, so wash with soap and water.
- Clients on precautions may leave the room only when necessary and should wear a mask if droplet or airborne precautions apply.
- Some infections need more than one category (for example, varicella requires airborne plus contact precautions).

## Client and family teaching
- Explain why the precautions are used so the client does not feel isolated or stigmatized.
- Provide diversion and communication options because isolation can increase loneliness and anxiety.

> **High-yield / exam traps:** Surgical mask means droplet; N95 and negative pressure mean airborne. Gloves never replace hand hygiene. When two organisms are listed, choose the more restrictive precaution. Meningitis from *Neisseria meningitidis* is droplet, not airborne.
`),
  lesson("nclex-pn", PSY, "Therapeutic communication", "notes",
    "Therapeutic Communication: Techniques and Blocks",
    "Recognize helpful responses and the blocks that shut a conversation down.", 5, `
# Therapeutic Communication

Therapeutic communication is a purposeful, client-centered exchange that helps the client express feelings, solve problems and feel understood. The nurse's role is to **listen and facilitate**, not to fix or judge.

## Therapeutic techniques
- **Open-ended questions:** "What has been the hardest part of this week?"
- **Reflection:** repeat the feeling or content in your own words. "You sound frustrated about the delay."
- **Clarification:** "Can you tell me more about what you mean by *tired all the time*?"
- **Silence:** allows the client time to think and feel
- **Active listening:** eye contact when culturally appropriate, open posture, minimal interruptions
- **Offering self:** "I'll stay with you for a few minutes."
- **Focusing:** helps the client concentrate on a specific concern
- **Summarizing:** checks that you understood

## Common blocks to communication
| Block | Why it fails | Example |
|---|---|---|
| False reassurance | Dismisses feelings | "Don't worry, you'll be fine." |
| Giving advice | Takes decisions from the client | "You should just talk to your boss." |
| "Why" questions | Sound accusatory | "Why did you stop your medication?" |
| Changing the subject | Signals discomfort | "Let's talk about something happier." |
| Judgmental statements | Causes defensiveness | "That was a poor choice." |
| Clichés | Minimize experience | "Everything happens for a reason." |

## Special situations
- **Angry client:** stay calm, acknowledge the feeling, set limits on behavior, not on the person.
- **Anxious client:** use short, clear sentences and a calm tone.
- **Client with hallucinations:** acknowledge the experience without agreeing it is real: "I do not hear the voices, but I can see they frighten you."
- **Cultural needs:** use a qualified interpreter, not family members, when language differs.

## Applying it on the exam
The best answer is usually the response that **keeps the client talking about feelings**. Check safety first: if a client expresses suicidal thoughts, ask directly and stay with them.

> **High-yield / exam traps:** Avoid answers that start with "Why," give advice or reassure. A response that is a closed question is rarely best unless assessing safety. If one option addresses feelings and another gives information, choose feelings first unless there is an immediate safety issue.
`),
  lesson("nclex-pn", PHY, "Fluid and electrolyte imbalance", "notes",
    "Fluid and Electrolyte Imbalances at a Glance",
    "Key signs and nursing priorities for the major potassium, sodium and calcium disorders.", 7, `
# Fluid and Electrolyte Imbalances

Electrolyte questions reward pattern recognition. Remember that high levels generally **speed up or excite**, whereas low levels often **slow down or weaken**, except for calcium, which has a distinctive opposite relationship to neuromuscular excitability.

## Potassium (normal about 3.5 to 5.0 mEq/L)
- **Hypokalemia:** muscle weakness, leg cramps, constipation, flattened T waves, U waves, dysrhythmias. Common causes: loop diuretics, vomiting, diarrhea.
- **Hyperkalemia:** peaked T waves, widened QRS, weakness, diarrhea, bradycardia, potentially cardiac arrest. Common causes: kidney failure, potassium-sparing diuretics, ACE inhibitors, tissue injury.
- Never give IV potassium by push; it must be diluted and infused slowly on a pump.

## Sodium (normal about 135 to 145 mEq/L)
- **Hyponatremia:** headache, confusion, nausea, seizures in severe cases; cerebral edema is the danger
- **Hypernatremia:** thirst, dry mucous membranes, restlessness, lethargy, seizures; often from dehydration
- Correct sodium disorders gradually, since rapid shifts can harm the brain.

## Calcium (normal about 8.5 to 10.5 mg/dL)
- **Hypocalcemia:** tingling around the mouth, muscle spasms, positive Chvostek and Trousseau signs, laryngospasm, prolonged QT
- **Hypercalcemia:** weakness, constipation, kidney stones, polyuria, bone pain, shortened QT

## Magnesium (normal about 1.5 to 2.5 mg/dL)
- Low magnesium often accompanies low potassium and may cause tremor and dysrhythmias.
- High magnesium reduces deep tendon reflexes and respirations. Check reflexes and respirations in any client receiving IV magnesium.

## Nursing priorities
1. Assess airway, breathing and cardiac rhythm first.
2. Monitor intake and output, daily weights and laboratory values.
3. Report critical values promptly and anticipate orders.
4. Teach diet and medication adjustments.

## Fluid volume
- **Deficit:** thirst, weight loss, tachycardia, low blood pressure, concentrated urine
- **Excess:** weight gain, edema, crackles, bounding pulses, jugular vein distention

> **High-yield / exam traps:** Peaked T = high potassium; flat T and U waves = low potassium. A client on a loop diuretic needs potassium monitoring. Never push IV potassium. Positive Chvostek and Trousseau signs point to low calcium.
`),
  lesson("nclex-pn", PHA, "Medication administration", "notes",
    "Safe Medication Administration: Rights, Checks and Calculations",
    "Apply the rights of medication administration and a simple dose-calculation method.", 6, `
# Safe Medication Administration

Medication errors usually come from missed checks, not missing knowledge. A reliable routine prevents most of them.

## The rights of medication administration
1. Right **client** (two identifiers, such as name and date of birth)
2. Right **medication**
3. Right **dose**
4. Right **route**
5. Right **time**
6. Right **documentation**
Many facilities add right **reason** and right **response**, and the client's **right to refuse**.

## Three checks
- When removing the medication from storage
- When preparing the dose
- At the bedside before administration

## Before giving a medication
- Check allergies and the order for completeness
- Know the drug's purpose, usual dose, major adverse effects and nursing implications
- Assess **parameters**: hold and report for situations such as an apical pulse below 60 for digoxin or a systolic blood pressure below the ordered threshold for antihypertensives
- Verify laboratory values that guide dosing, for example INR for warfarin or potassium for diuretics

## Simple dose calculation
Use **desired over have, times quantity**:

*(Dose ordered / dose on hand) x quantity on hand = amount to give*

Example: ordered 250 mg, available 125 mg per tablet: 250 / 125 = 2 tablets.

Always:
- Convert to the same unit before calculating (1 g = 1,000 mg; 1 mg = 1,000 mcg)
- Use a leading zero (0.5 mg) and never a trailing zero (5 mg, not 5.0 mg)
- Double-check high-alert medications such as insulin, heparin and opioids with a second nurse per policy

## Documentation and follow-up
- Document right after giving, never in advance
- Reassess for therapeutic response and adverse effects
- Report errors immediately, assess the client and complete an incident report according to policy

> **High-yield / exam traps:** If a dose looks unusual, stop and verify before giving. Do not crush extended-release products. A client's refusal is documented and reported, not forced. Reconcile the order with the medication administration record, not with memory.
`),
  lesson("nclex-pn", CC, "Prioritization", "guide",
    "Guide: Prioritization and Delegation for the PN",
    "A short decision guide for who to see first and what can be delegated.", 8, `
# Guide: Prioritization and Delegation for the PN

Coordinated care questions test whether you can decide **what matters first** and **who should do it**.

## Step 1: Is anyone unstable?
Use these frameworks together:
- **ABCs:** airway, breathing, circulation
- **Maslow:** physiological needs before safety, then psychosocial, unless a safety threat is immediate
- **Acute over chronic; new over expected; unstable over stable**
- **Nursing process:** assess before you intervene, except when a life threat is obvious

### Examples
- New stridor beats a client waiting for a laxative.
- A client with chest pain and sweating beats a client reporting expected incision pain.
- An unexpected finding (new confusion, sudden dyspnea) beats an expected finding for the client's diagnosis.

## Step 2: Who is the right person?
The RN assigns and delegates within scope. The PN works under the direction of an RN or provider and can delegate routine tasks to unlicensed assistive personnel (UAP) according to state rules.

| Role | Typical responsibilities |
|---|---|
| RN | Initial assessment, care planning, evaluating care, IV push in many settings, care of unstable clients |
| PN | Focused data collection, medication administration, reinforcing teaching, care of stable clients with predictable outcomes |
| UAP | Hygiene, vital signs on stable clients, feeding, ambulation, intake and output |

## Step 3: Five rights of delegation
Right **task**, right **circumstance**, right **person**, right **direction and communication**, right **supervision and evaluation**.

## Advocacy and rights
- Act as the client's advocate when concerns arise, for example by reporting a client who does not understand a procedure before consent
- Protect confidentiality and respect advance directives
- Report unsafe practice through the chain of command

## Quick check before you answer
1. Is this client stable and predictable?
2. Does the task require assessment, teaching or judgment?
3. What could go wrong if this is delayed?

> **High-yield / exam traps:** Assessment, teaching, evaluation and interpretation stay with licensed nurses. Delegate the task, not the responsibility. If two clients are equally unstable, choose the one with the airway or breathing problem. Do not choose an answer that sounds caring but ignores a physiological threat.
`),
];

const FNP_MATERIALS: SeedMaterial[] = [
  lesson("fnp", ASM, "History taking", "notes",
    "Building a Focused History: HPI, Review of Systems and Red Flags",
    "Structure the history of present illness and recognize symptoms that change the urgency.", 6, `
# Building a Focused History

A good history often yields the diagnosis before any test. For primary care, combine a focused history of the presenting problem with targeted screening.

## History of present illness (OLDCARTS)
- **O**nset: sudden or gradual, when it began
- **L**ocation: where, and does it radiate
- **D**uration: constant or intermittent
- **C**haracter: sharp, dull, burning, pressure
- **A**ggravating and alleviating factors
- **R**adiation
- **T**iming: patterns over the day
- **S**everity: for example 0 to 10, and impact on function

## Other components
- Past medical and surgical history, hospitalizations
- Medications, including over-the-counter drugs, supplements and adherence
- Allergies and reaction types (true allergy versus intolerance)
- Family history of conditions that affect risk, such as early heart disease or cancer
- Social history: tobacco, alcohol, drugs, occupation, home safety, support
- **Review of systems** to uncover symptoms that the patient did not mention

## Special populations
- **Adolescents:** interview alone, explain confidentiality limits, and use HEADSS
- **Older adults:** screen for falls, cognition, polypharmacy and function; involve caregivers with permission
- **Children:** gather developmental, feeding and immunization history, and observe interaction
- **Interpreters:** use trained interpreters rather than family members

## Communication tips
- Start with open-ended questions, then close down with specific ones
- Use teach-back to check understanding
- Ask about pregnancy possibility when relevant

## Red flags that change the plan
- Chest pain with exertion, syncope or dyspnea
- Fever with neck stiffness or immunosuppression
- Back pain with saddle anesthesia, bladder or bowel dysfunction, or a history of cancer
- Unintentional weight loss, night sweats or persistent fever
- Sudden, severe headache described as the worst of life

> **High-yield / exam traps:** Medication and supplement history explains many new symptoms. Never rely on a family member's translation when an interpreter is required. Red flags move you from watchful waiting to urgent evaluation.
`),
  lesson("fnp", DX, "Clinical reasoning", "notes",
    "Differential Diagnosis and Avoiding Diagnostic Errors",
    "Generate, rank and test a differential, and recognize common reasoning traps.", 6, `
# Differential Diagnosis and Clinical Reasoning

Diagnosis is a cycle of hypothesis generation, testing and revision.

## Steps
1. **Summarize** the case in one line using key features (age, sex, tempo, main symptom, risk factors).
2. **Generate** a differential, starting with **must-not-miss** (dangerous) diagnoses, then most likely, then less common ones.
3. **Prioritize** by probability and by the cost of missing each diagnosis.
4. **Test** efficiently, choosing tests whose results will change management.
5. **Revise** as new data arrive.

## Using probabilities
- **Pretest probability** is your estimate before testing, based on prevalence and clinical features.
- **Sensitivity** helps rule **out** when negative (SnNout); **specificity** helps rule **in** when positive (SpPin).
- Decision rules such as the Wells score for DVT and PE structure pretest probability and guide next steps.
- A test result rarely helps if the pretest probability is extreme in either direction.

## Common cognitive traps
| Trap | Description |
|---|---|
| Anchoring | Fixing on the first impression |
| Premature closure | Stopping the search too early |
| Availability bias | Favoring diagnoses recalled easily |
| Confirmation bias | Seeking only data that supports the favorite diagnosis |
| Diagnostic momentum | Accepting a label from a prior clinician without questioning |

## Strategies to reduce errors
- Pause and ask, "What else could this be?"
- Reconsider the diagnosis if the patient does not follow the expected course
- Use checklists and decision support
- Discuss uncertain cases and arrange safety-netting follow-up

## Examples of must-not-miss diagnoses
- Chest pain: acute coronary syndrome, pulmonary embolism, aortic dissection, tension pneumothorax
- Headache: subarachnoid hemorrhage, meningitis, giant cell arteritis
- Abdominal pain: appendicitis, ectopic pregnancy, mesenteric ischemia
- Back pain: cauda equina syndrome, spinal infection, malignancy

> **High-yield / exam traps:** When a question describes a patient who is not improving, the answer is often to reconsider the diagnosis, not to double the treatment. A negative screening test with high sensitivity is most meaningful in low-risk patients. Always think about the dangerous diagnosis first.
`),
  lesson("fnp", PLAN, "Chronic disease management", "notes",
    "Hypertension and Type 2 Diabetes: Management Essentials",
    "Core treatment principles and drug-selection logic for two common chronic conditions.", 7, `
# Hypertension and Type 2 Diabetes: Management Essentials

Both conditions are managed by combining lifestyle changes, medication selection based on comorbid conditions and regular monitoring.

## Hypertension
- Confirm the diagnosis with repeated, properly measured readings, ideally supported by home or ambulatory monitoring.
- Lifestyle: weight reduction, DASH-style diet, sodium restriction, potassium-rich foods when kidney function allows, regular exercise, limiting alcohol, tobacco cessation.
- First-line drug classes for most adults: **thiazide-type diuretics, ACE inhibitors or ARBs, and calcium channel blockers**.
- **Black adults** without CKD or heart failure: thiazide or calcium channel blocker is preferred initially.
- **Compelling indications:** CKD with albuminuria (ACE inhibitor or ARB), heart failure with reduced ejection fraction (ACE inhibitor/ARB/ARNI, beta-blocker, MRA), post-myocardial infarction (beta-blocker plus ACE inhibitor).
- Do not combine an ACE inhibitor with an ARB.
- ACE inhibitors and ARBs are avoided in pregnancy.

## Type 2 diabetes
- Individualize A1c goals. A common target for many adults is below 7 percent, with less strict goals for older adults with multiple comorbidities.
- **Metformin** remains a common first-line agent unless contraindicated (eGFR below 30). Monitor B12 with long-term use.
- Choose additional agents by comorbidity:
  - Established ASCVD or high cardiovascular risk: GLP-1 receptor agonist or SGLT2 inhibitor with proven benefit
  - Heart failure or CKD: SGLT2 inhibitor
  - Need for weight loss: GLP-1 receptor agonist
- Sulfonylureas and insulin carry a hypoglycemia risk and need education.
- Annual screening: urine albumin-to-creatinine ratio and eGFR, dilated eye exam, foot exam; lipid management and blood pressure control.

## Shared principles
- Review adherence, cost and side effects at every visit
- Address social determinants that limit access to care
- Treat the whole risk profile, including lipids and tobacco

> **High-yield / exam traps:** Match the drug to the comorbidity; guideline questions rarely reward a single best drug for everyone. Never combine ACE inhibitors with ARBs. Check potassium and creatinine after starting an ACE inhibitor or ARB. For A1c-based decisions, remember that A1c reflects roughly three months of glycemia.
`),
  lesson("fnp", ROLE, "Scope of practice", "notes",
    "Scope of Practice, Ethics and Confidentiality for the FNP",
    "The legal and ethical frameworks that shape everyday decisions in advanced practice.", 6, `
# Scope of Practice, Ethics and Confidentiality

## Scope of practice
- NP scope is defined by **state law**: the nurse practice act and board of nursing rules. States differ in whether NPs have full practice authority, reduced practice (collaboration required) or restricted practice (supervision required).
- Certification and licensure define the population focus. A family NP cares for patients across the lifespan; acute care or specialty populations need different preparation.
- Prescribing controlled substances requires a DEA registration and compliance with state rules, including prescription monitoring program checks where required.
- Practicing only within your competence and referring when a problem exceeds your training is part of professional accountability.

## Ethical principles
- **Autonomy:** respect for the informed decisions of competent patients
- **Beneficence:** acting in the patient's best interest
- **Nonmaleficence:** avoiding harm
- **Justice:** fair distribution of resources and care
- **Veracity** and **fidelity:** honesty and keeping commitments

## Applying the principles
- **Informed consent** requires capacity, voluntariness and adequate disclosure of risks, benefits and alternatives. Document it.
- **Informed refusal:** a capable patient may decline. Explain consequences, offer alternatives and document.
- **Minors:** laws on consent to contraception, STI care and mental health care vary by state. Know them and explain the limits of confidentiality.
- **Boundaries:** avoid treating family members or friends outside an established clinician-patient relationship.

## Confidentiality and privacy
- HIPAA permits disclosures for treatment, payment and health care operations without written authorization, and for certain public health and legal purposes.
- Use the **minimum necessary** information for most disclosures.
- Mandatory reporting generally includes suspected child abuse, elder or dependent abuse and certain communicable diseases, depending on the state.

## Quality and policy
- Evidence-based practice, quality improvement and patient safety reporting are professional obligations.
- Understand billing and coding fundamentals, including documentation that supports the level of service.

> **High-yield / exam traps:** The state practice act, not the employer or the patient, sets scope. Informed consent is a process, not just a signature. When ethical principles conflict, start by clarifying facts and patient values. Documentation is part of the standard of care.
`),
  lesson("fnp", EVAL, "Outcome evaluation", "guide",
    "Guide: Evaluating Outcomes and Planning Follow-up",
    "How to decide whether a plan is working and when to see the patient again.", 7, `
# Guide: Evaluating Outcomes and Planning Follow-up

Evaluation closes the loop of the clinical process. Ask: **Did the patient improve? Is the treatment safe? What happens next?**

## Define success first
- Choose measurable goals when starting treatment: blood pressure target, A1c, symptom resolution, functional improvement.
- Share the goals with the patient so that follow-up has a shared purpose.

## When the plan is not working
1. **Confirm adherence** and ability to afford and obtain medications.
2. **Check technique and measurement:** inhaler technique, blood pressure cuff size, home log accuracy.
3. **Review interfering factors:** other medications (NSAIDs, decongestants), diet, alcohol, sleep apnea.
4. **Reconsider the diagnosis** if the course is atypical.
5. Only then escalate therapy or refer.

## Typical monitoring examples
| Intervention | Evaluate |
|---|---|
| Antihypertensive started | Blood pressure in about 2 to 4 weeks; electrolytes and creatinine if ACE inhibitor, ARB or diuretic |
| Metformin or other diabetes drug change | A1c about 3 months later; self-monitoring data sooner |
| Statin started | Lipid panel about 4 to 12 weeks after starting to assess response and adherence |
| Levothyroxine dose change | TSH about 6 to 8 weeks later |
| Antibiotic for pneumonia | Symptom improvement in 48 to 72 hours; return if worse or no better |

## Safety-netting
Give patients clear return instructions: what symptoms signal worsening, who to call and when to go to the emergency department.

## Transitions and continuity
- Reconcile medications after hospitalization or specialist visits
- Confirm that referral results are received and acted on
- Schedule the next visit before the patient leaves when possible

## Documentation
- Record the goal, the result, the interpretation and the plan
- Document shared decisions and patient education

> **High-yield / exam traps:** Before intensifying therapy, check adherence and measurement. Laboratory timing follows biology: A1c about 3 months, TSH 6 to 8 weeks after a dose change. A good answer includes both the next test and the next visit.
`),
];

const CM_MATERIALS: SeedMaterial[] = [
  lesson("clinical-math", UC, "Metric conversions", "notes",
    "Dimensional Analysis and Unit Conversions",
    "A single method for converting between metric, household and weight units without mistakes.", 6, `
# Dimensional Analysis and Unit Conversions

Most dosage errors begin with a unit that was never converted. **Dimensional analysis** keeps the units honest: write what you have, multiply by conversion fractions, and cancel units until only the one you want remains.

## Metric equivalents to know cold
- 1 kg = 1,000 g
- 1 g = 1,000 mg
- 1 mg = 1,000 mcg
- 1 L = 1,000 mL
- 1 mL = 1 cc

Moving **down** the scale (g to mg to mcg) multiplies by 1,000, while moving **up** divides by 1,000.

## Household and weight equivalents
- 1 teaspoon = 5 mL
- 1 tablespoon = 15 mL (3 teaspoons)
- 1 fluid ounce = 30 mL
- 1 cup = 8 oz = about 240 mL
- 1 kg = 2.2 lb

## Method
1. Write the starting quantity with its unit.
2. Multiply by a fraction that has the **unit you want on top** and the unit you are leaving on the bottom.
3. Cancel units.
4. Check that the answer is reasonable.

**Example:** Convert 154 lb to kg.
154 lb x (1 kg / 2.2 lb) = 70 kg

**Example:** Convert 0.15 mg to mcg.
0.15 mg x (1,000 mcg / 1 mg) = 150 mcg

## Temperature (when asked)
- Fahrenheit to Celsius: (F - 32) x 5/9
- Celsius to Fahrenheit: (C x 9/5) + 32

## Decimal safety
- Always use a **leading zero** (0.5 mg).
- Never use a **trailing zero** (write 5 mg, not 5.0 mg).
- Count decimal places when converting by 1,000: three places to the left or right.

## Reasonableness check
A conversion that changes the number the wrong way is a red flag. When converting to a smaller unit, the number must get bigger (2.5 L becomes 2,500 mL). When converting to a larger unit, the number must get smaller (150 mcg becomes 0.15 mg).

> **High-yield / exam traps:** Convert before you calculate, not after. Do not round pounds to kilograms until the final step. A tenfold or thousandfold error is almost always a misplaced decimal, so estimate the size of the answer first.
`),
  lesson("clinical-math", OD, "Tablets", "notes",
    "Oral Dosage Calculations: Tablets and Liquids",
    "Use desired over have, times quantity, for any oral order.", 5, `
# Oral Dosage Calculations

The same formula handles tablets, capsules and liquids.

## The formula
**(Desired dose / dose on hand) x quantity on hand = amount to give**

- *Desired dose:* what the prescriber ordered
- *Dose on hand:* the strength on the label
- *Quantity on hand:* the tablet (1) or the liquid volume that holds that strength (for example 5 mL)

## Tablets
Ordered 0.25 mg; available 0.125 mg tablets.
0.25 / 0.125 = 2 tablets.

Ordered 0.15 mg; available 75 mcg tablets.
Convert: 0.15 mg = 150 mcg. 150 / 75 = 2 tablets.

## Liquids
Ordered 400 mg; supply 200 mg per 5 mL.
(400 / 200) x 5 mL = 10 mL.

Ordered 125 mg; supply 250 mg per 5 mL.
(125 / 250) x 5 mL = 2.5 mL.

## Practical rules
- Check the **label strength** every time; manufacturers supply multiple strengths of the same drug.
- Only split **scored** tablets. Never crush or split extended-release or enteric-coated products.
- Use an oral syringe or calibrated cup, not a kitchen spoon.
- If the answer is more than a few tablets or an unusual volume, recheck the setup.
- Use rounding rules from your facility. For tablets, round only when splitting is permitted. For liquids, round to a measurable volume.

## Reasonableness
- A single oral dose of more than 3 tablets is unusual.
- A liquid dose larger than 10 to 15 mL for a child is unusual.
- If the dose desired is smaller than the dose on hand, the amount to give is less than the stated quantity.

## Practice setup
1. Write down the order with its unit.
2. Write down the label.
3. Convert so both use the same unit.
4. Substitute into the formula and cancel units.
5. Ask: does this answer make sense?

> **High-yield / exam traps:** The most common error is mismatched units (mg versus mcg). Another is using the total bottle volume as the quantity on hand instead of the volume per concentration. Never split a tablet that is not scored.
`),
  lesson("clinical-math", IVC, "Drip rates (gtt/min)", "notes",
    "IV Flow Rates, Drip Rates and Infusion Time",
    "Calculate pump rates, gravity drip rates and infusion completion times.", 7, `
# IV Flow Rates, Drip Rates and Infusion Time

## Pump rate (mL/hr)
**Rate (mL/hr) = total volume (mL) / time (hr)**

- 1,000 mL over 8 hr = 125 mL/hr
- 250 mL over 45 min: convert 45 min to 0.75 hr; 250 / 0.75 = 333 mL/hr

## Gravity drip rate (gtt/min)
**gtt/min = (volume in mL x drop factor in gtt/mL) / time in minutes**

- 1,000 mL over 8 hr at 15 gtt/mL: (1,000 x 15) / 480 = 31 gtt/min
- 100 mL over 30 min at 10 gtt/mL: (100 x 10) / 30 = 33 gtt/min

Common drop factors: macrodrip tubing is 10, 15 or 20 gtt/mL, microdrip tubing is 60 gtt/mL. For microdrip tubing, gtt/min equals mL/hr.

## Infusion time
**Time (hr) = volume (mL) / rate (mL/hr)**

- 500 mL at 125 mL/hr = 4 hr
- 1,000 mL at 150 mL/hr = 6.67 hr = 6 hr 40 min (since 0.67 hr x 60 = 40 min)

Add the time to the start time to find the completion time.

## Heparin and other concentrations
When a drug is mixed in a bag, find the **concentration** first.

- 25,000 units in 500 mL = 50 units/mL
- Ordered 1,200 units/hr: 1,200 / 50 = 24 mL/hr
- Reverse check: 24 mL/hr x 50 units/mL = 1,200 units/hr

## Safety with infusions
- Use an infusion pump for high-alert drugs such as heparin, insulin and vasopressors.
- Have another nurse independently verify the calculation and pump settings.
- Reassess the site, the rate and the client at regular intervals.
- Many solutions need labels showing drug, concentration, date and time.

## Strategy
1. Write the units next to every number.
2. Decide whether the answer should be per minute or per hour.
3. Convert time to the required unit first.
4. Sanity check: an infusion over a shorter time must run faster.

> **High-yield / exam traps:** Pumps use mL/hr, gravity uses gtt/min. Watch for time expressed in minutes when the formula requires hours, or the reverse. Round gtt/min to a whole drop and pump rates as the pump allows. Decimal hours are not minutes; convert before adding to a clock time.
`),
  lesson("clinical-math", WB, "mg/kg dosing", "notes",
    "Weight-Based Dosing, Safe Dose Ranges and Titrations",
    "Convert weights, calculate mg/kg and mcg/kg/min doses, and verify safe ranges.", 7, `
# Weight-Based Dosing, Safe Dose Ranges and Titrations

Pediatric and critical care dosing is based on body weight, so an accurate weight in **kilograms** is the first step.

## Step 1: Weight in kg
- Pounds to kg: divide by 2.2 (66 lb = 30 kg)
- For infants, convert grams to kg by dividing by 1,000

## Step 2: Dose per administration
**Dose = weight (kg) x ordered dose per kg**

- 18 kg at 10 mg/kg = 180 mg
- 80 kg at 1 mg/kg = 80 mg

## Step 3: Check the safe range
Safe ranges are usually given **per day** divided into doses, or **per dose**. Calculate both ends of the range using the child's weight, then compare with the ordered amount.

**Example (hypothetical numbers):**
- Range 10 to 15 mg/kg/day, child weighs 20 kg: 200 to 300 mg/day
- Ordered 100 mg every 8 hours = 3 x 100 = 300 mg/day, at the upper limit and acceptable

If the ordered amount falls outside the range, **hold and clarify** with the prescriber. Never change the dose yourself.

## Step 4: Titrations (mcg/kg/min)
1. Dose per minute = weight x mcg/kg/min
2. Convert to per hour (multiply by 60)
3. Convert to mL/hr using the concentration (mcg/mL)

**Example:** dopamine 5 mcg/kg/min for 70 kg, bag 400 mg in 250 mL
- 70 x 5 = 350 mcg/min = 21,000 mcg/hr
- Concentration: 400,000 mcg / 250 mL = 1,600 mcg/mL
- Rate: 21,000 / 1,600 = 13.1 mL/hr

When the ordered dose changes, redo the calculation from the new mcg/kg/min.

## Safety habits
- Verify the weight is current and in the correct units
- Use the actual dosing weight specified by the order or protocol
- Double-check high-alert drugs with a second nurse
- Confirm the drug concentration on the bag before programming the pump

> **High-yield / exam traps:** Mixing pounds and kilograms is the classic error. Compare the **total daily** dose to the daily range, not a single dose. Convert mg to mcg before using a mcg/kg/min order. If the dose is outside the safe range, the right action is to clarify with the prescriber.
`),
  lesson("clinical-math", PD, "Injections", "guide",
    "Guide: Parenteral Dosing and Error-Proofing Your Calculations",
    "Injection volumes, reconstituted powders and a checklist that catches most calculation mistakes.", 8, `
# Guide: Parenteral Dosing and Error-Proofing Your Calculations

## Injection volumes
Use the same formula as oral dosing: **(desired / have) x quantity = amount**.

- Furosemide 40 mg ordered; vial 10 mg/mL: 40 / 10 = **4 mL**
- Enoxaparin 30 mg ordered; syringe 40 mg per 0.4 mL (100 mg/mL): 30 / 100 = **0.3 mL**

### Volume limits (check your facility's policy)
Smaller muscles and subcutaneous sites tolerate less volume. A large volume may require splitting between sites or choosing another route.

## Reconstitution of powdered drugs
1. Read the vial label for **diluent type and volume** and the **final concentration**.
2. Use the concentration after reconstitution, not the amount of diluent alone.
3. Label the vial with the date, time, concentration and your initials; note the expiry period.

**Example:** 1 g powder, add 9.6 mL diluent to give a total of 10 mL
- Concentration: 1,000 mg / 10 mL = 100 mg/mL
- Ordered 750 mg: 750 / 100 = **7.5 mL**

**Example:** label states 250 mg/mL; order 600 mg
- 600 / 250 = **2.4 mL**

## The error-proofing checklist
1. **Units match** (mg to mg, mcg to mcg)
2. **Leading zero** present, no trailing zero
3. **Estimate** the answer before using the calculator
4. **Label** concentration read twice
5. **Reasonableness:** is the volume practical for the route?
6. **Independent double-check** for high-alert drugs
7. **Right patient, drug, dose, route, time** at the bedside

## Common error patterns
| Error | Result | Prevention |
|---|---|---|
| Mcg versus mg | 1,000-fold dose error | Convert first |
| Decimal misplacement | 10-fold error | Leading zero, estimate |
| Using diluent volume instead of final volume | Wrong concentration | Read the label |
| Wrong weight units | Dose off by 2.2 times | Always convert pounds to kg |

## When to stop and ask
- The calculated volume is surprisingly large or tiny
- The order lacks a unit, route or frequency
- The dose exceeds the safe range
- The drug name looks or sounds like another drug

> **High-yield / exam traps:** Use the final concentration after reconstitution. Do not round until the last step. A sanity check is not optional: if the answer looks odd, recalculate from the start with units written out.
`),
];

const PANCE_MATERIALS: SeedMaterial[] = [
  lesson("pance", PA_DX, "Acute coronary syndrome", "notes",
    "Chest Pain and Acute Coronary Syndrome",
    "Classify ACS, read the ECG territories and know the immediate treatment pathway.", 7, `
# Chest Pain and Acute Coronary Syndrome

## Spectrum of ACS
| Diagnosis | ECG | Troponin |
|---|---|---|
| Unstable angina | May show ST depression or T-wave changes | Normal |
| NSTEMI | ST depression or T-wave inversion | Elevated |
| STEMI | ST elevation in contiguous leads | Elevated |

Chest pressure at rest, lasting longer than about 20 minutes, with radiation, diaphoresis, dyspnea or nausea, increases suspicion. Women, older adults and patients with diabetes may present atypically.

## ECG territories
- **Anterior:** V1 to V4, left anterior descending
- **Lateral:** I, aVL, V5, V6, circumflex
- **Inferior:** II, III, aVF, usually right coronary artery
- Obtain right-sided leads if inferior STEMI to look for right ventricular infarct.

## Immediate management
1. Get an ECG within 10 minutes of arrival.
2. Aspirin (chewed) unless contraindicated.
3. Oxygen only if saturation is low.
4. **STEMI:** emergent reperfusion with primary PCI when available within the recommended time; fibrinolysis when PCI is delayed and there is no contraindication.
5. **NSTE-ACS:** anticoagulation, antiplatelet therapy, risk stratification (for example, TIMI or GRACE) and an invasive strategy timed by risk.
6. Beta-blocker, high-intensity statin and, when appropriate, ACE inhibitor.

## Caution
- Nitrates can cause severe hypotension in right ventricular infarction, recent phosphodiesterase-5 inhibitor use or severe hypotension.
- Avoid NSAIDs.

## Differential diagnosis of chest pain
- **Pulmonary embolism:** pleuritic pain, tachycardia, risk factors
- **Aortic dissection:** abrupt tearing pain radiating to the back, blood pressure differences between arms
- **Pericarditis:** pleuritic pain better sitting forward, diffuse ST elevation with PR depression
- **Pneumothorax:** sudden pleuritic pain and dyspnea
- **GERD or musculoskeletal pain:** diagnoses of exclusion in higher-risk patients

## After the event
Cardiac rehabilitation, dual antiplatelet therapy for the recommended duration, risk-factor control and smoking cessation.

> **High-yield / exam traps:** Troponin separates NSTEMI from unstable angina. Do not delay reperfusion to wait for troponin in STEMI. Inferior MI plus hypotension: think right ventricular involvement and avoid nitrates. Aortic dissection must be excluded before anticoagulation in the right setting.
`),
  lesson("pance", PA_DS, "Imaging selection", "notes",
    "Choosing the Right Diagnostic Test",
    "Match common presentations to the best first imaging or laboratory study.", 6, `
# Choosing the Right Diagnostic Test

The best test is the one that answers the clinical question with acceptable risk. Match the test to the **pretest probability** and the **stability** of the patient.

## First-line studies by presentation
| Presentation | Best initial test |
|---|---|
| Right upper quadrant pain, suspected cholecystitis | Ultrasound |
| Suspected appendicitis (adult) | CT abdomen and pelvis; ultrasound first in children and pregnancy |
| Suspected bowel obstruction | Plain films or CT |
| Acute pancreatitis | Lipase; imaging for etiology and complications |
| Suspected kidney stone | Noncontrast CT (ultrasound in pregnancy) |
| Suspected stroke | Noncontrast head CT |
| Suspected pulmonary embolism, low probability | D-dimer |
| Suspected pulmonary embolism, higher probability | CT pulmonary angiography |
| Stable aortic dissection suspicion | CT angiography |
| Suspected DVT | Compression ultrasonography |
| Thyroid symptoms | TSH |
| Anemia | CBC, then iron studies, B12 and folate by MCV |

## Laboratory essentials
- **Troponin:** the preferred marker of myocardial injury
- **BNP:** helpful to separate heart failure from lung disease causes of dyspnea
- **Lipase:** more specific than amylase for pancreatitis
- **Urinalysis:** nitrites and leukocyte esterase for UTI; red cell casts for glomerular disease
- **HbA1c:** reflects about 3 months of glycemia

## Test performance
- **Sensitivity:** proportion of diseased patients with a positive test
- **Specificity:** proportion of healthy patients with a negative test
- **Positive predictive value** rises with disease prevalence.
- A highly sensitive test is useful to rule out disease when negative; a highly specific test helps rule in when positive.

## Radiation and safety
- Avoid unnecessary CT in children and pregnancy; consider ultrasound or MRI
- Check renal function and allergy history before iodinated contrast
- MRI requires screening for implanted devices and certain metal

## Stepwise thinking
1. What diagnosis am I testing for?
2. How will the result change management?
3. Is the patient stable enough for this test?
4. What is the safest, quickest test that answers the question?

> **High-yield / exam traps:** In unstable patients, treat first and image when safe, for example tension pneumothorax. A negative D-dimer matters only when pretest probability is low. Use ultrasound for pregnancy and pediatrics whenever it can answer the question.
`),
  lesson("pance", PA_HM, "Cancer screening", "notes",
    "Screening and Prevention at a Glance",
    "Core screening intervals and vaccine recommendations commonly tested in primary care.", 7, `
# Screening and Prevention at a Glance

Guidelines are updated periodically. Know the concepts and the commonly tested ages.

## Cancer screening (average-risk adults)
- **Colorectal:** ages 45 to 75. Options include annual FIT, stool DNA-FIT every 1 to 3 years, and colonoscopy every 10 years. Earlier and more frequent screening applies with a family history or inflammatory bowel disease.
- **Breast:** biennial mammography for women ages 40 to 74 (USPSTF); individualize with family history and risk
- **Cervical:** ages 21 to 29, cytology every 3 years; ages 30 to 65, cytology every 3 years, HPV testing every 5 years, or cotesting every 5 years
- **Lung:** annual low-dose CT for ages 50 to 80 with at least a 20 pack-year history who currently smoke or quit within 15 years
- **Prostate:** shared decision-making for men ages 55 to 69 about PSA

## Other screening
- **Abdominal aortic aneurysm:** one-time ultrasonography for men aged 65 to 75 who have ever smoked
- **Osteoporosis:** DXA at age 65 for women, earlier with risk factors
- **Hypertension:** blood pressure screening for all adults
- **Diabetes:** screening for adults with overweight or obesity beginning at age 35
- **Hepatitis C:** one-time screening for adults 18 to 79
- **HIV:** at least once for people ages 15 to 65
- **Depression:** screening in adults with systems in place for follow-up

## Adult vaccines
- **Influenza:** annually
- **Tdap** once, then Td or Tdap every 10 years; Tdap during every pregnancy at 27 to 36 weeks
- **Recombinant zoster:** two doses for adults 50 and older
- **Pneumococcal:** recommended for older adults and younger adults with certain conditions (check the current schedule)
- **Hepatitis B:** recommended for adults who are unvaccinated
- **MMR and varicella:** live vaccines; avoid in pregnancy and severe immunosuppression

## Counseling
- Tobacco cessation at every visit
- Physical activity, diet, alcohol screening, sunscreen
- Contraception and preconception care when relevant

## Levels of prevention
- **Primary:** prevents disease (vaccines)
- **Secondary:** detects early disease (screening)
- **Tertiary:** reduces complications of established disease

> **High-yield / exam traps:** Screening is for asymptomatic people; symptoms call for a diagnostic workup. Live vaccines are contraindicated in pregnancy. Average-risk colorectal screening begins at 45. Do not screen older adults routinely once they are beyond the recommended age or have limited life expectancy.
`),
  lesson("pance", PA_RX, "Drug interactions", "notes",
    "Drug Interactions and the Cytochrome P450 System",
    "Predict the most commonly tested pharmacokinetic interactions.", 7, `
# Drug Interactions and the Cytochrome P450 System

Many interactions occur because a drug alters the **metabolism** of another through the cytochrome P450 (CYP) enzymes in the liver.

## Inducers and inhibitors
- **Inducers** speed up metabolism, lowering levels of the affected drug. Examples: rifampin, carbamazepine, phenytoin, phenobarbital, St John wort, chronic alcohol use.
- **Inhibitors** slow metabolism, raising levels. Examples: macrolides (clarithromycin, erythromycin), azole antifungals, protease inhibitors, amiodarone, grapefruit juice, cimetidine.
- Inducers take days to weeks to reach full effect. Inhibitors act quickly.

## Frequently tested interactions
| Combination | Effect | Management |
|---|---|---|
| Warfarin plus TMP-SMX, metronidazole, fluconazole, amiodarone | Increased INR and bleeding | Monitor INR or choose an alternative |
| Warfarin plus rifampin | Decreased INR | Increase dose with monitoring |
| Simvastatin or lovastatin plus clarithromycin or azoles | Myopathy, rhabdomyolysis | Avoid or hold statin |
| SSRI plus tramadol, linezolid or triptans | Serotonin syndrome | Avoid or monitor |
| Lithium plus thiazides, NSAIDs, ACE inhibitors | Lithium toxicity | Monitor levels |
| ACE inhibitor plus potassium-sparing diuretic or potassium | Hyperkalemia | Monitor potassium |
| Nitrates plus phosphodiesterase-5 inhibitors | Severe hypotension | Contraindicated |
| Fluoroquinolones plus corticosteroids | Tendon rupture | Avoid when possible |
| Oral contraceptives plus enzyme inducers | Reduced contraceptive effectiveness | Alternative method |

## Non-CYP mechanisms
- **Absorption:** calcium, iron and antacids bind tetracyclines, fluoroquinolones and levothyroxine, so separate doses
- **Renal clearance:** NSAIDs reduce clearance of methotrexate and lithium
- **Pharmacodynamic:** additive sedation with opioids and benzodiazepines; additive QT prolongation

## Narrow therapeutic index drugs
Warfarin, digoxin, lithium, phenytoin, theophylline and some immunosuppressants require levels or INR monitoring when interacting drugs are started or stopped.

## Practical approach
1. Reconcile every medication, including supplements.
2. Check an interaction resource when adding a drug.
3. Monitor the relevant test after changes.
4. Counsel patients to report new symptoms.

> **High-yield / exam traps:** Inducers lower levels and inhibitors raise them. Remember that stopping an inducer can lead to toxicity of the previously induced drug. Grapefruit juice is a CYP3A4 inhibitor. Never combine nitrates with PDE-5 inhibitors.
`),
  lesson("pance", PA_HX, "Physical examination", "guide",
    "Guide: A Systematic Approach to the History and Physical",
    "A repeatable structure for gathering data and tying findings to diagnoses.", 8, `
# Guide: A Systematic Approach to the History and Physical

## Structure of the encounter
1. **Chief complaint** in the patient's words
2. **History of present illness** (onset, location, duration, character, aggravating and relieving factors, radiation, timing, severity)
3. **Past medical and surgical history**, medications, allergies
4. **Family and social history**
5. **Review of systems**
6. **Focused physical examination**
7. **Assessment and plan**

## Examination order
- Standard order: **inspect, palpate, percuss, auscultate**
- Exception: the **abdomen** is inspected, auscultated, percussed, then palpated

## High-yield findings by system
### Cardiac
- **S3:** early diastolic; volume overload in adults
- **S4:** late diastolic; stiff ventricle
- **Aortic stenosis:** crescendo-decrescendo systolic murmur at the right upper sternal border radiating to the carotids
- **Mitral regurgitation:** holosystolic murmur radiating to the axilla

### Pulmonary
- Consolidation: dull to percussion, increased fremitus, bronchial breath sounds
- Effusion: dull, decreased fremitus and breath sounds
- Pneumothorax: hyperresonant, decreased breath sounds

### Neurologic
- Facial weakness with forehead involvement: peripheral (Bell palsy)
- Facial weakness with forehead sparing: central (stroke)
- Upper motor neuron signs: spasticity, hyperreflexia, extensor plantar response

### Musculoskeletal
- Lachman: ACL
- McMurray: meniscus
- Straight leg raise: lumbar radiculopathy

## Special situations
- **Pediatrics:** observe before examining, age-appropriate development
- **Geriatrics:** function, falls, cognition and polypharmacy
- **Pregnancy:** adjust positioning and avoid unnecessary radiation

## Documenting
Write findings objectively. Note pertinent negatives that help exclude dangerous diagnoses.

## Exam technique
Read the last sentence of the stem first to identify what is asked, then reread the stem for key clues such as age, tempo and risk factors. Eliminate options that are unsafe or do not fit.

> **High-yield / exam traps:** Auscultate the abdomen before palpating. Forehead sparing means central lesion. A new finding that does not fit the diagnosis should prompt reevaluation rather than explaining it away.
`),
];

const PANRE_MATERIALS: SeedMaterial[] = [
  lesson("panre", PA_CI, "Atrial fibrillation", "notes",
    "Atrial Fibrillation: Rate, Rhythm and Stroke Prevention",
    "Decide between rate control, rhythm control and anticoagulation using risk scores.", 7, `
# Atrial Fibrillation: Rate, Rhythm and Stroke Prevention

Atrial fibrillation (AF) is the most common sustained arrhythmia. Management rests on three pillars: **stroke prevention, symptom control and risk factor management**.

## Recognition
- Irregularly irregular rhythm, no discernible P waves on ECG
- Symptoms: palpitations, dyspnea, fatigue, dizziness; many patients are asymptomatic
- Evaluate for causes: hypertension, valvular disease, thyroid disease, alcohol, sleep apnea, heart failure, pulmonary disease

## Stroke prevention
- Use **CHA2DS2-VASc**: Congestive heart failure, Hypertension, Age 75 or older (2), Diabetes, prior Stroke or TIA (2), Vascular disease, Age 65 to 74, female Sex
- Anticoagulation is recommended for scores of 2 or more in men and 3 or more in women. It is reasonable at 1 in men and 2 in women.
- **Direct oral anticoagulants** (apixaban, rivaroxaban, edoxaban, dabigatran) are preferred over warfarin in nonvalvular AF.
- **Warfarin** is used with a mechanical heart valve or moderate-to-severe mitral stenosis.
- Anticoagulation decisions do not depend on whether the rhythm is controlled.
- Assess bleeding risk and correct modifiable factors such as uncontrolled hypertension, alcohol and NSAID use.

## Rate control
- First-line: **beta-blocker** or **nondihydropyridine calcium channel blocker** (diltiazem, verapamil)
- Avoid nondihydropyridine calcium channel blockers in reduced ejection fraction heart failure
- Digoxin may be added, especially in heart failure or sedentary patients
- Lenient targets (resting heart rate below 110) are often acceptable if the patient is asymptomatic

## Rhythm control
- Consider for symptomatic patients, younger patients, new-onset AF or heart failure related to AF
- Options: cardioversion, antiarrhythmic drugs, catheter ablation
- Anticoagulate for at least 3 weeks before elective cardioversion or perform imaging to exclude left atrial thrombus, and continue for at least 4 weeks afterward

## Unstable patients
Hypotension, ischemia, pulmonary edema or altered mental status requires **synchronized cardioversion**.

## Pre-excitation caution
In AF with Wolff-Parkinson-White syndrome, avoid AV nodal blocking agents.

> **High-yield / exam traps:** Anticoagulation depends on stroke risk, not on rate or rhythm status. Warfarin is for mechanical valves or significant mitral stenosis. Diltiazem and verapamil are avoided in HFrEF. Cardioversion needs anticoagulation planning before and after.
`),
  lesson("panre", PA_HX, "Cauda equina syndrome", "notes",
    "Spinal Red Flags and Cauda Equina Syndrome",
    "Recognize back-pain presentations that require emergent evaluation.", 6, `
# Spinal Red Flags and Cauda Equina Syndrome

Most low back pain is mechanical and improves within weeks. The job of the clinician is to identify the small group of patients with a serious cause.

## Red flags in low back pain
- **Cauda equina syndrome:** saddle anesthesia, urinary retention or incontinence, bowel dysfunction, bilateral or progressive leg weakness, decreased rectal tone
- **Malignancy:** history of cancer, unexplained weight loss, pain unrelieved by rest or at night, age over 50
- **Infection:** fever, intravenous drug use, recent bacteremia or spinal procedure, immunosuppression
- **Fracture:** significant trauma, osteoporosis, chronic corticosteroid use, older age
- **Progressive neurologic deficit**

## Cauda equina syndrome
- Compression of the lumbosacral nerve roots below the conus medullaris
- Common causes: massive central disc herniation, tumor, epidural abscess or hematoma
- Typical findings: low back pain, sciatica that may be bilateral, saddle sensory loss, reduced anal tone, urinary retention with overflow incontinence
- Retention and incontinence indicate advanced compression and a poorer prognosis
- **Emergent MRI** and **surgical decompression** to preserve function

## Examination points
1. Test strength and sensation by dermatome and myotome
2. Perform a rectal exam and assess perianal sensation when suspicion exists
3. Check bladder function with a post-void residual (bladder scan)
4. Assess reflexes and gait

## Radiculopathy versus cauda equina
| Feature | Radiculopathy | Cauda equina |
|---|---|---|
| Distribution | Single root, usually unilateral | Multiple roots, often bilateral |
| Bladder and bowel | Normal | Retention or incontinence |
| Saddle sensation | Normal | Reduced |
| Urgency | Routine unless severe | Emergency |

## Uncomplicated low back pain
- Reassurance, activity as tolerated, NSAIDs, heat and physical therapy
- Imaging is not needed in the first 6 weeks without red flags

> **High-yield / exam traps:** Urinary retention and saddle anesthesia are cauda equina until proven otherwise; do not wait for a trial of conservative therapy. Straight leg raise suggests radiculopathy, not cauda equina. Perform a bladder scan when suspicion exists.
`),
  lesson("panre", PA_HM, "Colorectal cancer screening", "notes",
    "Preventive Services Refresher for Practicing PAs",
    "Updated screening, family-history adjustments and vaccine highlights for busy clinicians.", 6, `
# Preventive Services Refresher

## Colorectal cancer screening
- **Average risk:** begin at 45, continue through 75; individualize from 76 to 85
- **Tests:** annual FIT, stool DNA-FIT every 1 to 3 years, colonoscopy every 10 years, CT colonography every 5 years, flexible sigmoidoscopy every 5 years
- **Positive stool-based test:** follow up with colonoscopy
- **First-degree relative with colorectal cancer or advanced adenoma before age 60:** start screening at age 40 or 10 years before the relative's diagnosis, whichever is earlier, with colonoscopy every 5 years
- **Relative diagnosed at 60 or older:** begin at 40 with average-risk intervals
- Inflammatory bowel disease and hereditary syndromes (Lynch syndrome, familial adenomatous polyposis) require specialized surveillance

## Other preventive services
- **Abdominal aortic aneurysm:** one-time ultrasound in men 65 to 75 who have ever smoked
- **Osteoporosis:** DXA in women at 65, sooner if risk factors
- **Lung cancer:** annual low-dose CT at ages 50 to 80 with at least a 20 pack-year history, current smokers or quit within 15 years
- **Hepatitis C:** one-time screening for adults
- **HIV:** at least once; more often with risk
- **Statin use:** consider for adults 40 to 75 with cardiovascular risk factors and an elevated estimated 10-year risk

## Adult immunization highlights
- **Recombinant zoster:** two doses at age 50 and older
- **Pneumococcal conjugate vaccine:** older adults and younger adults with certain conditions (check the current age threshold)
- **Tdap:** once, then Td or Tdap every 10 years; with each pregnancy
- **Influenza:** annually; **COVID-19** per current schedule
- **Hepatitis B:** for unvaccinated adults

## Counseling
- Tobacco cessation, alcohol screening, physical activity
- Intimate partner violence screening for women of reproductive age
- Falls prevention in older adults

## Shared decision-making
For tests with balanced benefits and harms (such as PSA screening), present benefits, harms and the patient's preferences.

> **High-yield / exam traps:** Family history changes both the start age and the interval. Positive FIT leads to colonoscopy, not repeating the stool test. Screening applies to asymptomatic patients; rectal bleeding warrants diagnostic evaluation at any age.
`),
  lesson("panre", PA_BS, "Anion gap", "notes",
    "Acid-Base Interpretation and the Anion Gap",
    "A stepwise approach to blood gases and the causes of metabolic acidosis.", 7, `
# Acid-Base Interpretation and the Anion Gap

## Step-by-step approach
1. **pH:** acidemia (below 7.35) or alkalemia (above 7.45)
2. **Primary process:** compare PaCO2 and bicarbonate
   - Low pH with high PaCO2: respiratory acidosis
   - Low pH with low bicarbonate: metabolic acidosis
   - High pH with low PaCO2: respiratory alkalosis
   - High pH with high bicarbonate: metabolic alkalosis
3. **Compensation:** the opposite system moves the same direction to normalize pH
4. **Anion gap** if metabolic acidosis is present
5. **Clinical correlation**

## Anion gap
**Anion gap = Na - (Cl + HCO3)**

A normal value is approximately 8 to 12 mEq/L (laboratory-dependent). Adjust for low albumin, which lowers the expected gap.

### High anion gap metabolic acidosis (MUDPILES)
- **M**ethanol
- **U**remia
- **D**KA and other ketoacidosis
- **P**ropylene glycol, paraldehyde
- **I**soniazid, iron
- **L**actic acidosis
- **E**thylene glycol
- **S**alicylates

### Normal anion gap (hyperchloremic) acidosis
- Diarrhea, renal tubular acidosis, saline infusion, acetazolamide

## Respiratory disorders
- **Acidosis:** hypoventilation from COPD, opioid overdose, neuromuscular disease
- **Alkalosis:** hyperventilation from anxiety, pain, pulmonary embolism, early salicylate toxicity, pregnancy

## Metabolic alkalosis
- Vomiting, nasogastric suction, diuretics, hyperaldosteronism
- Saline-responsive (volume depleted, low urine chloride) versus saline-resistant (high urine chloride)

## Worked example
Na 140, Cl 104, HCO3 12: anion gap = 140 - 116 = 24, which is elevated. With a low pH, this is a high anion gap metabolic acidosis. Look for lactate, ketones, renal function and toxic ingestions.

## Mixed disorders
Salicylate toxicity often causes a high anion gap metabolic acidosis with a concurrent respiratory alkalosis.

> **High-yield / exam traps:** Determine the primary process first; compensation never overshoots normal pH. Always calculate the anion gap in metabolic acidosis. Diarrhea gives normal gap acidosis; DKA, lactic acidosis, uremia and toxic alcohols give high gap acidosis.
`),
  lesson("panre", PA_RX, "Anticoagulant therapy", "guide",
    "Guide: Anticoagulants, Monitoring and Reversal",
    "Which agent for which patient, how to monitor it and how to reverse it.", 8, `
# Guide: Anticoagulants, Monitoring and Reversal

## Agents and key features
| Drug | Mechanism | Monitoring | Reversal |
|---|---|---|---|
| Warfarin | Inhibits vitamin K-dependent factors (II, VII, IX, X) | INR | Vitamin K; prothrombin complex concentrate for severe bleeding |
| Unfractionated heparin | Potentiates antithrombin | aPTT or anti-Xa | Protamine |
| Low-molecular-weight heparin | Anti-Xa predominantly | Usually none; anti-Xa in renal failure or pregnancy | Protamine (partial) |
| Dabigatran | Direct thrombin inhibitor | Not routine | Idarucizumab |
| Apixaban, rivaroxaban, edoxaban | Factor Xa inhibitors | Not routine | Andexanet alfa or prothrombin complex concentrate |

## Choosing therapy
- **Nonvalvular AF and venous thromboembolism:** direct oral anticoagulants are generally preferred over warfarin
- **Mechanical valves:** warfarin
- **Moderate-to-severe mitral stenosis with AF:** warfarin
- **Antiphospholipid syndrome:** warfarin is often preferred over DOACs, especially in triple-positive disease
- **Pregnancy:** low-molecular-weight heparin; avoid warfarin and DOACs
- **Severe renal impairment:** dose adjustment or avoidance depending on the agent

## Warfarin essentials
- Target INR is usually 2.0 to 3.0 (higher for some mechanical valves)
- Many interactions: inhibitors (TMP-SMX, metronidazole, amiodarone, fluconazole) raise INR; rifampin lowers it
- Consistent dietary vitamin K intake is preferred over avoidance
- Bridging with heparin is needed only in selected high-risk situations

## Heparin-induced thrombocytopenia
- Platelet count drops by more than 50 percent, usually 5 to 10 days after heparin exposure, with paradoxical thrombosis
- Stop all heparin and start a non-heparin anticoagulant such as argatroban

## Peri-procedural management
- Hold DOACs for an interval based on the drug, renal function and bleeding risk of the procedure
- Check interacting medications before procedures

## Bleeding management
1. Stop the anticoagulant
2. Apply local measures and supportive care
3. Give the specific reversal agent for life-threatening bleeding
4. Reassess the indication before restarting

> **High-yield / exam traps:** Match the antidote: protamine for heparin, idarucizumab for dabigatran, andexanet or PCC for Xa inhibitors, vitamin K and PCC for warfarin. HIT requires stopping all heparin and using a direct thrombin inhibitor. Warfarin interactions are the most frequently tested.
`),
];

/* ------------------------------------------------------------------ */
/* Flashcards                                                          */
/* ------------------------------------------------------------------ */
const PN_CARDS: SeedFlashcard[] = [
  ...cardsFor("nclex-pn", CC, "Delegation", [
    ["Which tasks may a PN delegate to unlicensed assistive personnel?", "Routine, standardized tasks for stable clients with predictable outcomes, such as hygiene, feeding, ambulation, vital signs and intake and output."],
    ["Which nursing activities cannot be delegated to unlicensed personnel?", "Assessment, teaching, evaluation, care planning and any task that requires nursing judgment."],
    ["What are the five rights of delegation?", "Right task, circumstance, person, direction and communication, and supervision and evaluation."],
  ]),
  ...cardsFor("nclex-pn", CC, "Informed consent", [
    ["Who is responsible for obtaining informed consent for a procedure?", "The provider performing the procedure; the nurse may witness the signature and advocates if the client has questions."],
    ["What three elements make consent valid?", "The client has capacity, agrees voluntarily and has been given adequate information about risks, benefits and alternatives."],
  ]),
  ...cardsFor("nclex-pn", SAF, "Standard precautions", [
    ["What is the single most effective way to prevent infection transmission?", "Hand hygiene."],
    ["Why must C. difficile be handled with soap and water rather than alcohol rub?", "Alcohol does not kill C. difficile spores; washing physically removes them."],
  ]),
  ...cardsFor("nclex-pn", SAF, "Transmission-based precautions", [
    ["Which diseases require airborne precautions?", "Tuberculosis, measles (rubeola) and varicella (also disseminated herpes zoster)."],
    ["What PPE is required for droplet precautions?", "A surgical mask on entering the room within about 3 feet of the client, plus a private room."],
  ]),
  ...cardsFor("nclex-pn", HPM, "Growth and development", [
    ["Erikson's task for toddlers?", "Autonomy versus shame and doubt."],
  ]),
  ...cardsFor("nclex-pn", PSY, "Therapeutic communication", [
    ["Name three nontherapeutic communication blocks.", "False reassurance, giving advice and asking 'why' questions (also clichés and changing the subject)."],
    ["Best way to respond to a client who expresses a feeling?", "Reflect the feeling and invite the client to say more with an open-ended question."],
  ]),
  ...cardsFor("nclex-pn", PHA, "Medication administration", [
    ["What are the six basic rights of medication administration?", "Right client, medication, dose, route, time and documentation."],
    ["When should digoxin be held and reported in an adult?", "When the apical pulse is below 60 per minute (or the ordered parameter), or with signs of toxicity."],
  ]),
  ...cardsFor("nclex-pn", PHA, "Dosage calculations", [
    ["Formula for oral dose calculation?", "Desired dose / dose on hand x quantity on hand."],
  ]),
  ...cardsFor("nclex-pn", RRP, "Laboratory values", [
    ["Therapeutic INR range for most clients on warfarin?", "2.0 to 3.0."],
  ]),
  ...cardsFor("nclex-pn", RRP, "Potential complications", [
    ["Signs of deep vein thrombosis?", "Unilateral calf pain, warmth, swelling and redness; do not massage the leg."],
  ]),
  ...cardsFor("nclex-pn", PHY, "Fluid and electrolyte imbalance", [
    ["ECG finding in hyperkalemia?", "Tall, peaked T waves, widened QRS and potentially life-threatening dysrhythmias."],
    ["ECG findings in hypokalemia?", "Flattened T waves and U waves."],
  ]),
  ...cardsFor("nclex-pn", PHY, "Alterations in body systems", [
    ["Treatment of hypoglycemia in an alert client who can swallow?", "15 g of fast-acting carbohydrate, recheck in 15 minutes and repeat if needed."],
  ]),
];

const FNP_CARDS: SeedFlashcard[] = [
  ...cardsFor("fnp", ASM, "History taking", [
    ["What does OLDCARTS stand for?", "Onset, Location, Duration, Character, Aggravating/alleviating factors, Radiation, Timing, Severity."],
    ["What is HEADSS used for?", "A psychosocial interview framework for adolescents: Home, Education, Activities, Drugs, Sexuality, Suicide/depression."],
  ]),
  ...cardsFor("fnp", ASM, "Physical examination", [
    ["Order of the abdominal examination?", "Inspect, auscultate, percuss, then palpate."],
    ["Weber and Rinne findings in conductive hearing loss?", "Weber lateralizes to the affected ear; Rinne is negative (bone conduction louder than air) in that ear."],
  ]),
  ...cardsFor("fnp", ASM, "Diagnostic testing", [
    ["Best initial test for suspected primary hypothyroidism?", "TSH (elevated in primary hypothyroidism, with a low free T4)."],
    ["When is a D-dimer most useful?", "To rule out venous thromboembolism when the pretest probability is low."],
  ]),
  ...cardsFor("fnp", DX, "Differential diagnosis", [
    ["Red flags for cauda equina syndrome?", "Saddle anesthesia, urinary retention or incontinence, bowel dysfunction and bilateral leg weakness."],
    ["Pain with pinna traction or tragal pressure suggests?", "Acute otitis externa."],
  ]),
  ...cardsFor("fnp", DX, "Clinical reasoning", [
    ["What is anchoring bias?", "Fixing on an early impression and failing to adjust when new data contradict it."],
  ]),
  ...cardsFor("fnp", PLAN, "Pharmacotherapeutics", [
    ["Management of ACE inhibitor cough?", "Switch to an ARB (stop the ACE inhibitor permanently if angioedema occurs)."],
    ["Metformin renal cutoff?", "Contraindicated at eGFR below 30."],
  ]),
  ...cardsFor("fnp", PLAN, "Chronic disease management", [
    ["Initial antihypertensive classes for Black adults without compelling indications?", "Thiazide-type diuretic or calcium channel blocker."],
    ["Type 2 diabetes with established ASCVD: preferred add-on agents?", "A GLP-1 receptor agonist or SGLT2 inhibitor with proven cardiovascular benefit."],
  ]),
  ...cardsFor("fnp", PLAN, "Pediatrics", [
    ["When is autism-specific screening recommended?", "At the 18- and 24-month well visits."],
  ]),
  ...cardsFor("fnp", PLAN, "Women's health", [
    ["Which contraceptives should be avoided in migraine with aura?", "Estrogen-containing methods (combined pills, patch, ring)."],
  ]),
  ...cardsFor("fnp", EVAL, "Outcome evaluation", [
    ["How often does hemoglobin A1c reflect glycemia?", "It reflects average glucose over roughly the last 2 to 3 months, so reassess about every 3 months after a change."],
  ]),
  ...cardsFor("fnp", EVAL, "Follow-up", [
    ["Labs after starting an ACE inhibitor?", "Serum potassium and creatinine within about 1 to 2 weeks."],
  ]),
  ...cardsFor("fnp", ROLE, "Scope of practice", [
    ["Who defines an NP's scope of practice?", "State law: the nurse practice act and board of nursing regulations."],
  ]),
  ...cardsFor("fnp", ROLE, "Ethics", [
    ["Informed refusal: what must the clinician do?", "Confirm capacity, explain consequences and alternatives, respect the decision and document."],
  ]),
  ...cardsFor("fnp", ROLE, "Health policy", [
    ["Under HIPAA, disclosures without authorization are allowed for what purposes?", "Treatment, payment and health care operations, plus certain public health and legal requirements."],
  ]),
];

const CM_CARDS: SeedFlashcard[] = [
  ...cardsFor("clinical-math", UC, "Metric conversions", [
    ["1 gram equals how many milligrams?", "1,000 mg."],
    ["1 milligram equals how many micrograms?", "1,000 mcg."],
    ["Convert pounds to kilograms.", "Divide by 2.2."],
    ["Convert 0.15 mg to mcg.", "150 mcg (multiply by 1,000)."],
    ["1 liter equals how many milliliters?", "1,000 mL."],
  ]),
  ...cardsFor("clinical-math", UC, "Household to metric", [
    ["1 teaspoon equals how many mL?", "About 5 mL."],
    ["1 tablespoon equals how many mL?", "About 15 mL."],
    ["1 fluid ounce equals how many mL?", "About 30 mL."],
  ]),
  ...cardsFor("clinical-math", OD, "Tablets", [
    ["Basic formula for an oral dose?", "(Desired dose / dose on hand) x quantity on hand."],
    ["Which tablets may be split?", "Only scored tablets; never crush or split extended-release or enteric-coated products."],
  ]),
  ...cardsFor("clinical-math", OD, "Liquids", [
    ["Which device should measure oral liquids?", "An oral syringe or calibrated cup, never a household spoon."],
  ]),
  ...cardsFor("clinical-math", PD, "Injections", [
    ["Which decimal-writing habits prevent dosing errors?", "Use a leading zero (0.5 mg) and never a trailing zero (5 mg, not 5.0 mg)."],
  ]),
  ...cardsFor("clinical-math", PD, "Reconstitution", [
    ["What determines concentration after reconstitution?", "The final volume of the solution as stated on the label, not just the volume of diluent added."],
  ]),
  ...cardsFor("clinical-math", IVC, "Flow rates (mL/hr)", [
    ["Formula for pump rate?", "Rate (mL/hr) = total volume (mL) / time (hr)."],
  ]),
  ...cardsFor("clinical-math", IVC, "Drip rates (gtt/min)", [
    ["Formula for gravity drip rate?", "gtt/min = (volume in mL x drop factor in gtt/mL) / time in minutes."],
    ["For microdrip tubing, how do gtt/min and mL/hr compare?", "They are equal because microdrip tubing delivers 60 gtt/mL."],
  ]),
  ...cardsFor("clinical-math", IVC, "Infusion time", [
    ["Formula for infusion time?", "Time (hr) = volume (mL) / rate (mL/hr)."],
  ]),
  ...cardsFor("clinical-math", WB, "mg/kg dosing", [
    ["Formula for a weight-based dose?", "Dose = weight in kg x ordered dose per kg."],
  ]),
  ...cardsFor("clinical-math", WB, "Safe dose range", [
    ["What should you do if an ordered dose is outside the safe range?", "Hold it and clarify with the prescriber; never change the dose yourself."],
  ]),
  ...cardsFor("clinical-math", WB, "Titrations", [
    ["Steps to convert mcg/kg/min to mL/hr?", "Multiply weight by mcg/kg/min, multiply by 60 for mcg/hr, then divide by the concentration in mcg/mL."],
  ]),
];

const PANCE_CARDS: SeedFlashcard[] = [
  ...cardsFor("pance", PA_HX, "Cardiac auscultation", [
    ["S3 gallop in an older adult suggests?", "Ventricular volume overload, typically heart failure."],
    ["Murmur of aortic stenosis?", "Crescendo-decrescendo systolic murmur at the right upper sternal border radiating to the carotids."],
  ]),
  ...cardsFor("pance", PA_HX, "Cranial nerve examination", [
    ["Facial droop with forehead involvement indicates?", "A peripheral (lower motor neuron) CN VII lesion such as Bell palsy; forehead sparing indicates a central lesion."],
  ]),
  ...cardsFor("pance", PA_HX, "Musculoskeletal examination", [
    ["Most sensitive exam for ACL tear?", "Lachman test."],
  ]),
  ...cardsFor("pance", PA_DS, "Acute cholecystitis", [
    ["Initial imaging for suspected cholecystitis?", "Right upper quadrant ultrasound."],
  ]),
  ...cardsFor("pance", PA_DS, "Electrocardiography", [
    ["ST elevation in II, III and aVF suggests occlusion of which artery?", "Usually the right coronary artery (inferior STEMI)."],
  ]),
  ...cardsFor("pance", PA_DS, "Acute pancreatitis", [
    ["Diagnostic criteria for acute pancreatitis?", "Two of three: characteristic abdominal pain, lipase or amylase over 3 times normal, imaging findings."],
  ]),
  ...cardsFor("pance", PA_DX, "Acute coronary syndrome", [
    ["How do NSTEMI and unstable angina differ?", "Troponin is elevated in NSTEMI and normal in unstable angina."],
  ]),
  ...cardsFor("pance", PA_DX, "Croup", [
    ["Radiographic sign of croup?", "Steeple sign (subglottic narrowing)."],
  ]),
  ...cardsFor("pance", PA_DX, "Meningitis", [
    ["Most likely pathogen for meningitis in a college dormitory?", "Neisseria meningitidis."],
  ]),
  ...cardsFor("pance", PA_HM, "Colorectal cancer screening", [
    ["Age range for average-risk colorectal cancer screening?", "45 to 75 years."],
  ]),
  ...cardsFor("pance", PA_HM, "Immunizations in pregnancy", [
    ["When should Tdap be given in pregnancy?", "Every pregnancy, ideally at 27 to 36 weeks."],
  ]),
  ...cardsFor("pance", PA_HM, "Lung cancer screening", [
    ["Eligibility for annual low-dose CT lung cancer screening?", "Age 50 to 80, at least 20 pack-years, currently smoking or quit within 15 years."],
  ]),
  ...cardsFor("pance", PA_CI, "Anaphylaxis", [
    ["First-line treatment for anaphylaxis?", "Intramuscular epinephrine into the anterolateral thigh."],
  ]),
  ...cardsFor("pance", PA_CI, "Tension pneumothorax", [
    ["Treatment for tension pneumothorax?", "Immediate needle decompression, then chest tube placement."],
  ]),
  ...cardsFor("pance", PA_CI, "Community-acquired pneumonia", [
    ["Outpatient antibiotics for healthy adult CAP?", "Amoxicillin or doxycycline."],
  ]),
  ...cardsFor("pance", PA_RX, "Warfarin therapy", [
    ["Effect of rifampin on warfarin?", "Induces metabolism, lowering INR."],
  ]),
  ...cardsFor("pance", PA_RX, "Type 2 diabetes mellitus", [
    ["Common adverse effect of SGLT2 inhibitors?", "Genital mycotic infection (also volume depletion and euglycemic DKA)."],
  ]),
  ...cardsFor("pance", PA_RX, "Fluoroquinolones", [
    ["Boxed warning of fluoroquinolones?", "Tendinitis and tendon rupture, neuropathy, CNS effects and myasthenia gravis exacerbation."],
  ]),
  ...cardsFor("pance", PA_BS, "Microbiology", [
    ["Gram-positive cocci in clusters that are coagulase-positive?", "Staphylococcus aureus."],
  ]),
  ...cardsFor("pance", PA_BS, "Pharmacokinetics", [
  ]),
];

const PANRE_CARDS: SeedFlashcard[] = [
  ...cardsFor("panre", PA_HX, "Cauda equina syndrome", [
    ["Cardinal findings of cauda equina syndrome?", "Saddle anesthesia, urinary retention or incontinence, decreased rectal tone and bilateral leg weakness."],
  ]),
  ...cardsFor("panre", PA_HX, "Abdominal examination", [
    ["Rovsing sign?", "Pain in the right lower quadrant on palpation of the left lower quadrant; suggests appendicitis."],
  ]),
  ...cardsFor("panre", PA_HX, "Neurologic examination", [
    ["Cardinal features of Parkinson disease?", "Resting tremor, bradykinesia, cogwheel rigidity and later postural instability."],
  ]),
  ...cardsFor("panre", PA_DS, "Pulmonary function testing", [
    ["Spirometry criterion for COPD?", "Post-bronchodilator FEV1/FVC below 0.70."],
  ]),
  ...cardsFor("panre", PA_DS, "Stroke imaging", [
    ["First imaging in suspected acute stroke?", "Noncontrast head CT to exclude hemorrhage."],
  ]),
  ...cardsFor("panre", PA_DS, "Hepatitis serology", [
    ["Hepatitis B serology after vaccination only?", "Anti-HBs positive; HBsAg and anti-HBc negative."],
  ]),
  ...cardsFor("panre", PA_DS, "Urinalysis", [
    ["Red blood cell casts indicate?", "Glomerular disease such as glomerulonephritis."],
  ]),
  ...cardsFor("panre", PA_DX, "Giant cell arteritis", [
    ["Treatment of suspected giant cell arteritis?", "Start high-dose glucocorticoids immediately, before temporal artery biopsy."],
  ]),
  ...cardsFor("panre", PA_DX, "Adrenal insufficiency", [
    ["Lab pattern in primary adrenal insufficiency?", "Hyponatremia and hyperkalemia with skin hyperpigmentation from high ACTH."],
  ]),
  ...cardsFor("panre", PA_DX, "Kawasaki disease", [
    ["Treatment of Kawasaki disease?", "IV immune globulin plus aspirin, with echocardiography to look for coronary aneurysms."],
  ]),
  ...cardsFor("panre", PA_HM, "Colorectal cancer screening", [
    ["Screening start age with a first-degree relative diagnosed before age 60?", "Age 40 or 10 years before the relative's diagnosis, whichever is earlier."],
  ]),
  ...cardsFor("panre", PA_HM, "Abdominal aortic aneurysm screening", [
    ["Who gets one-time AAA ultrasound screening?", "Men aged 65 to 75 who have ever smoked."],
  ]),
  ...cardsFor("panre", PA_CI, "Atrial fibrillation", [
    ["When is anticoagulation recommended in nonvalvular AF?", "CHA2DS2-VASc of 2 or more in men and 3 or more in women."],
    ["Treatment of hemodynamically unstable AF?", "Synchronized electrical cardioversion."],
  ]),
  ...cardsFor("panre", PA_CI, "Diabetic ketoacidosis management", [
    ["Potassium threshold before starting insulin in DKA?", "Potassium must be at least 3.3 mEq/L; replace first if lower."],
  ]),
  ...cardsFor("panre", PA_RX, "Lithium", [
    ["Which drugs raise lithium levels?", "Thiazide diuretics, NSAIDs, ACE inhibitors and ARBs."],
  ]),
  ...cardsFor("panre", PA_RX, "Anticoagulant reversal", [
    ["Reversal agent for dabigatran?", "Idarucizumab."],
    ["Reversal agent for unfractionated heparin?", "Protamine sulfate."],
  ]),
  ...cardsFor("panre", PA_BS, "Anion gap", [
    ["Anion gap formula?", "Na minus (Cl plus HCO3); normal about 8 to 12 mEq/L."],
  ]),
  ...cardsFor("panre", PA_BS, "Biostatistics", [
    ["Number needed to treat formula?", "NNT = 1 / absolute risk reduction."],
  ]),
];

/* ------------------------------------------------------------------ */
/* Exports                                                             */
/* ------------------------------------------------------------------ */
export const STARTER_QUESTIONS_NURSING_PA: SeedQuestion[] = [
  ...PN_QUESTIONS,
  ...FNP_QUESTIONS,
  ...CM_QUESTIONS,
  ...PANCE_QUESTIONS,
  ...PANRE_QUESTIONS,
];

export const STARTER_MATERIALS_NURSING_PA: SeedMaterial[] = [
  ...PN_MATERIALS,
  ...FNP_MATERIALS,
  ...CM_MATERIALS,
  ...PANCE_MATERIALS,
  ...PANRE_MATERIALS,
];

export const STARTER_FLASHCARDS_NURSING_PA: SeedFlashcard[] = [
  ...PN_CARDS,
  ...FNP_CARDS,
  ...CM_CARDS,
  ...PANCE_CARDS,
  ...PANRE_CARDS,
];
