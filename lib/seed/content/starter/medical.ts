/**
 * Original starter practice content for the medical licensing / certification exams:
 * USMLE Step 1/2 CK/3, COMLEX Level 1/2, UKMLA, PLAB, ABIM and ABFM.
 * All items are written from scratch for this app; none are copied from commercial
 * question banks, official sample items or copyrighted prep material.
 */
import type { SeedQuestion } from "@/lib/questions/types";
import type { SeedMaterial, SeedFlashcard } from "../materials";

type Diff = "easy" | "moderate" | "difficult" | "advanced" | "challenge";
type O = [string, string]; // [option text, explanation]
const IDS = ["a", "b", "c", "d", "e"];

/** Builds a single-best-answer question. `correct` is the zero-based index of the right option. */
function mk(exam: string) {
  return (
    subject: string,
    topic: string,
    difficulty: Diff,
    stem: string,
    options: O[],
    correct: number,
    rationale: string,
    tags: string[],
    keyTakeaway: string,
  ): SeedQuestion => ({
    exam,
    subject,
    topic,
    type: "mcq",
    difficulty,
    stem,
    content: { options: options.map(([text], i) => ({ id: IDS[i], text })) },
    answer: { correct: IDS[correct] },
    rationale,
    optionExplanations: Object.fromEntries(options.map(([, e], i) => [IDS[i], e])),
    extras: { whyCorrect: options[correct][1], keyTakeaway },
    tags,
  });
}

const note =
  (exam: string) =>
  (category: string, topic: string, title: string, summary: string, durationMinutes: number, body: string, kind: "notes" | "guide" = "notes"): SeedMaterial => ({
    exam,
    category,
    topic,
    kind,
    title,
    summary,
    body: body.trim() + "\n",
    durationMinutes,
  });

const fc =
  (exam: string) =>
  (category: string, topic: string, front: string, back: string): SeedFlashcard => ({ exam, category, topic, front, back });

/* ================================================================== */
/* USMLE STEP 1                                                        */
/* ================================================================== */
const s1 = mk("usmle-step-1");
const S1_Q: SeedQuestion[] = [
  s1("Anatomy", "Lower limb nerve injury", "easy",
    "A 28-year-old woman has a fracture of the proximal fibula after a skiing accident. Two days later she trips on her toes while walking. Examination shows weak dorsiflexion and eversion of the right foot and numbness over the dorsum of the foot. Which nerve is most likely injured?",
    [
      ["Common fibular (peroneal) nerve", "It winds around the fibular neck, supplies the anterior and lateral compartments (dorsiflexion, eversion) and gives sensation to the dorsum of the foot."],
      ["Tibial nerve", "Tibial injury impairs plantar flexion and inversion and causes plantar sensory loss."],
      ["Superior gluteal nerve", "Injury causes a Trendelenburg gait from weak hip abduction, not foot drop."],
      ["Femoral nerve", "Femoral injury weakens knee extension and hip flexion."],
      ["Sural nerve", "A purely sensory nerve of the lateral foot; it does not cause motor weakness."],
    ], 0,
    "The common fibular nerve is superficial as it wraps the neck of the fibula and is vulnerable to fracture or compression. Its deep branch dorsiflexes the foot and its superficial branch everts it, so injury produces foot drop with a steppage gait and dorsal foot sensory loss.",
    ["anatomy", "nerve injury"], "Fibular neck injury causes foot drop with loss of dorsiflexion and eversion."),
  s1("Anatomy", "Inguinal canal", "moderate",
    "A 3-year-old boy has an intermittent bulge in the right groin that enlarges with crying and reduces when he lies down. At surgery the hernia sac enters the deep inguinal ring lateral to the inferior epigastric vessels and extends into the scrotum. Which embryologic structure failed to obliterate?",
    [
      ["Processus vaginalis", "A patent processus vaginalis allows abdominal contents into the inguinal canal, producing an indirect inguinal hernia."],
      ["Urachus", "A persistent urachus causes umbilical drainage, not a groin hernia."],
      ["Vitelline duct", "Persistence causes a Meckel diverticulum."],
      ["Gubernaculum", "The gubernaculum guides testicular descent but does not form the hernia sac."],
      ["Mesonephric duct", "This duct forms male genital ducts, not the hernia sac."],
    ], 0,
    "Indirect inguinal hernias pass through the deep ring, lateral to the inferior epigastric vessels, and follow the spermatic cord. In children they result from a patent processus vaginalis. Direct hernias instead protrude medial to the inferior epigastric vessels through the Hesselbach triangle and are acquired.",
    ["anatomy", "embryology"], "Indirect hernia = lateral to inferior epigastric vessels = patent processus vaginalis."),
  s1("Anatomy", "Coronary circulation", "moderate",
    "A 62-year-old man has crushing chest pain. ECG shows ST elevation in leads II, III and aVF with a heart rate of 44/min and a prolonged PR interval. Occlusion of which vessel is most likely?",
    [
      ["Right coronary artery", "In most people it supplies the inferior wall and the AV node, explaining bradycardia and conduction delay."],
      ["Left anterior descending artery", "Occlusion causes anterior and septal infarction with ST elevation in V1-V4."],
      ["Left circumflex artery only, in a right-dominant system", "It mainly supplies the lateral wall, causing changes in I, aVL, V5-V6."],
      ["Left main coronary artery", "Occlusion would produce extensive anterior and lateral ischemia and shock."],
      ["Acute marginal branch of the left circumflex", "This branch does not supply the AV node."],
    ], 0,
    "Inferior ST elevation in II, III and aVF reflects the territory of the posterior descending artery, which arises from the right coronary artery in right-dominant circulation. The right coronary artery also supplies the AV node in most patients, so inferior infarcts commonly produce bradycardia, first-degree or higher AV block.",
    ["anatomy", "cardiology"], "Inferior MI plus AV block points to the right coronary artery."),
  s1("Biochemistry", "Urea cycle disorders", "moderate",
    "A 2-day-old boy who fed normally initially becomes lethargic and vomits. Ammonia is markedly elevated, BUN is low, and urinary orotic acid is elevated. The family history shows that a maternal uncle died in infancy. Which enzyme is most likely deficient?",
    [
      ["Ornithine transcarbamylase", "X-linked deficiency causes hyperammonemia with excess carbamoyl phosphate shunted to orotic acid."],
      ["Carbamoyl phosphate synthetase I", "It also causes hyperammonemia but orotic acid is low because carbamoyl phosphate is not made."],
      ["Arginase", "Causes milder, later-onset disease with spastic paraparesis."],
      ["Phenylalanine hydroxylase", "Deficiency causes phenylketonuria without hyperammonemia."],
      ["Glutamate dehydrogenase", "Not a urea cycle defect; hyperinsulinism/hyperammonemia is a different syndrome."],
    ], 0,
    "Ornithine transcarbamylase deficiency is the most common urea cycle disorder and is X-linked recessive. Accumulated mitochondrial carbamoyl phosphate spills into the pyrimidine pathway, raising orotic acid. Treatment includes protein restriction, nitrogen scavengers and dialysis in crisis.",
    ["biochemistry", "metabolism"], "High ammonia + high orotic acid + low BUN = OTC deficiency."),
  s1("Biochemistry", "Glycogen storage diseases", "moderate",
    "A 9-month-old girl has a protuberant abdomen and hepatomegaly. She has fasting hypoglycemia that does not respond to glucagon, with lactic acidosis, hyperuricemia and hypertriglyceridemia. Which enzyme is deficient?",
    [
      ["Glucose-6-phosphatase", "Prevents release of free glucose from the liver by both glycogenolysis and gluconeogenesis."],
      ["Muscle glycogen phosphorylase", "McArdle disease causes exercise intolerance and myoglobinuria, not fasting hypoglycemia."],
      ["Lysosomal alpha-1,4-glucosidase", "Pompe disease causes cardiomegaly and hypotonia."],
      ["Debranching enzyme", "Cori disease causes hepatomegaly and hypoglycemia but with normal lactate and uric acid."],
      ["Branching enzyme", "Andersen disease causes cirrhosis and failure to thrive."],
    ], 0,
    "In von Gierke disease the final step of both glycogenolysis and gluconeogenesis is blocked, so glucose cannot be released and glucagon does not correct hypoglycemia. Accumulated glucose-6-phosphate is shunted to glycolysis (lactate), the pentose pathway (uric acid) and lipid synthesis.",
    ["biochemistry", "metabolism"], "Von Gierke: hypoglycemia, lactic acidosis, gout and hyperlipidemia from G6Pase deficiency."),
  s1("Biochemistry", "Vitamin deficiencies", "easy",
    "A 54-year-old man with chronic alcohol use is brought in with confusion, nystagmus and a wide-based gait. After intravenous thiamine is started, which erythrocyte enzyme activity would most reliably be reduced at baseline?",
    [
      ["Transketolase", "Requires thiamine pyrophosphate as a cofactor; its activity is used to assess thiamine status."],
      ["Glucose-6-phosphate dehydrogenase", "This enzyme does not require thiamine."],
      ["Glutathione reductase", "Depends on riboflavin (FAD)."],
      ["Pyruvate kinase", "Does not require thiamine."],
      ["Methionine synthase", "Depends on vitamin B12."],
    ], 0,
    "Thiamine pyrophosphate is a cofactor for pyruvate dehydrogenase, alpha-ketoglutarate dehydrogenase, branched-chain ketoacid dehydrogenase and transketolase. This patient has Wernicke encephalopathy, and thiamine should be given before glucose to avoid precipitating or worsening it.",
    ["biochemistry", "nutrition"], "Thiamine is the cofactor for PDH, alpha-KG dehydrogenase, BCKDH and transketolase."),
  s1("Biochemistry", "Lysosomal storage disorders", "moderate",
    "A 7-month-old boy of Ashkenazi Jewish descent has lost the ability to roll over and has an exaggerated startle response. Fundoscopy shows a cherry-red macula, and there is no hepatosplenomegaly. Which substance accumulates in neurons?",
    [
      ["GM2 ganglioside", "Hexosaminidase A deficiency (Tay-Sachs) causes GM2 accumulation."],
      ["Sphingomyelin", "Accumulates in Niemann-Pick disease, which also has hepatosplenomegaly."],
      ["Glucocerebroside", "Accumulates in Gaucher disease, with hepatosplenomegaly and bone crises."],
      ["Galactocerebroside", "Accumulates in Krabbe disease, with globoid cells and peripheral neuropathy."],
      ["Heparan sulfate", "Accumulates in Hurler/Hunter syndromes with coarse facies."],
    ], 0,
    "Tay-Sachs disease is an autosomal recessive deficiency of hexosaminidase A, causing GM2 ganglioside accumulation, neurodegeneration, a cherry-red spot and hypotonia without organomegaly. The absence of hepatosplenomegaly distinguishes it from Niemann-Pick disease, which also shows a cherry-red spot.",
    ["biochemistry", "genetics"], "Cherry-red spot without hepatosplenomegaly: Tay-Sachs."),
  s1("Microbiology", "Staphylococcus aureus toxins", "moderate",
    "A 22-year-old woman develops fever of 39.8 C, hypotension, diffuse macular erythema and vomiting on day 4 of her menses. She has been using a super-absorbent tampon. A week later her palms and soles desquamate. The responsible toxin acts primarily by which mechanism?",
    [
      ["Cross-linking MHC class II with T-cell receptor Vbeta regions, causing massive cytokine release", "TSST-1 is a superantigen that activates a large fraction of T cells nonspecifically."],
      ["ADP-ribosylation of elongation factor 2", "This is the mechanism of diphtheria toxin and Pseudomonas exotoxin A."],
      ["Cleavage of SNARE proteins at the neuromuscular junction", "This is the mechanism of botulinum and tetanus toxins."],
      ["Inactivation of the 60S ribosomal subunit", "This is Shiga toxin's mechanism."],
      ["Increased cAMP by activating adenylate cyclase", "This is the mechanism of cholera toxin and heat-labile E. coli toxin."],
    ], 0,
    "Toxic shock syndrome toxin-1 is a superantigen that bridges MHC II on antigen-presenting cells and the Vbeta region of T-cell receptors, activating up to a large proportion of T cells without antigen processing. The resulting cytokine surge (IL-1, IL-2, TNF-alpha) causes fever, shock and a desquamating rash.",
    ["microbiology", "toxins"], "Superantigen = MHC II to TCR Vbeta cross-link = cytokine storm."),
  s1("Microbiology", "Streptococcus pneumoniae", "easy",
    "A 67-year-old man with a 2-day history of fever, productive cough with rust-colored sputum and right lower lobe consolidation has a sputum Gram stain showing gram-positive diplococci. Which laboratory feature best identifies the organism?",
    [
      ["Alpha-hemolysis, optochin sensitivity and bile solubility", "These are characteristic of S. pneumoniae, which is also encapsulated."],
      ["Beta-hemolysis and bacitracin sensitivity", "These identify Streptococcus pyogenes."],
      ["Catalase-positive and coagulase-positive clusters", "These identify Staphylococcus aureus."],
      ["Optochin resistance and growth in 6.5% NaCl", "These suggest Enterococcus."],
      ["Gram-negative bacilli that ferment lactose", "This would describe an enteric organism such as E. coli or Klebsiella."],
    ], 0,
    "Streptococcus pneumoniae is a catalase-negative, alpha-hemolytic, lancet-shaped diplococcus with a polysaccharide capsule, the major virulence factor. It is optochin-sensitive and bile-soluble, which distinguishes it from viridans streptococci. Asplenic patients are at risk of overwhelming sepsis.",
    ["microbiology", "bacteria"], "Alpha-hemolytic, optochin-sensitive, bile-soluble diplococci = S. pneumoniae."),
  s1("Microbiology", "Malaria", "moderate",
    "A 31-year-old man returns from a trip to the Indian subcontinent. Parasitemia with Plasmodium vivax is treated with chloroquine and he recovers. Which additional drug is needed to prevent later relapses, and what should be checked first?",
    [
      ["Primaquine, after testing for G6PD deficiency", "Primaquine kills dormant liver hypnozoites but can cause hemolysis in G6PD deficiency."],
      ["Atovaquone-proguanil, after testing for thyroid function", "It is used for prophylaxis and treatment of the blood stage and does not target hypnozoites."],
      ["Mefloquine, after an ECG", "It acts on blood stages and has neuropsychiatric effects."],
      ["Doxycycline, after pregnancy testing", "Not used to prevent relapse of vivax malaria."],
      ["Artesunate, after renal function testing", "It treats severe blood-stage malaria but not hypnozoites."],
    ], 0,
    "P. vivax and P. ovale form hypnozoites in hepatocytes that cause relapses weeks to months after the blood stage is cleared. Primaquine (or tafenoquine) is needed for radical cure, and G6PD status must be checked because oxidant drugs cause hemolysis in deficient patients.",
    ["microbiology", "parasitology"], "Vivax/ovale relapse from hypnozoites; primaquine after G6PD testing."),
  s1("Microbiology", "Corynebacterium diphtheriae", "moderate",
    "An unvaccinated 6-year-old child has a sore throat, low-grade fever and a gray, adherent pseudomembrane over the tonsils that bleeds when scraped. There is marked cervical lymphadenopathy. The most important virulence factor of the causative organism acts by which mechanism?",
    [
      ["ADP-ribosylation of elongation factor 2, halting protein synthesis", "Diphtheria toxin, encoded by a lysogenic phage, inactivates EF-2 in host cells."],
      ["Blocking acetylcholine release", "This describes botulinum toxin."],
      ["Activating adenylate cyclase through Gs", "This describes cholera toxin."],
      ["Cleaving 28S rRNA in the 60S ribosomal subunit", "This describes Shiga and Shiga-like toxins."],
      ["Forming pores in the cell membrane", "This describes toxins such as streptolysin O or alpha toxin."],
    ], 0,
    "Corynebacterium diphtheriae carries a beta-prophage encoding diphtheria toxin, which ADP-ribosylates elongation factor 2 and causes cell death, leading to the pseudomembrane, myocarditis and neuropathy. Culture on tellurite agar or Loeffler medium aids diagnosis, and treatment combines antitoxin and antibiotics.",
    ["microbiology", "toxins"], "Diphtheria toxin and Pseudomonas exotoxin A both inactivate EF-2."),
  s1("Pathology", "Neoplasia genetics", "easy",
    "A 19-year-old man has several hundred adenomatous polyps throughout the colon on colonoscopy, and his father had a colectomy at age 35. A germline mutation in which gene is most likely?",
    [
      ["APC on chromosome 5q", "Familial adenomatous polyposis results from inherited APC mutations, causing Wnt/beta-catenin activation."],
      ["MLH1", "Mismatch repair gene mutations cause Lynch syndrome with few polyps."],
      ["SMAD4", "Mutations cause juvenile polyposis."],
      ["STK11", "Mutations cause Peutz-Jeghers syndrome with hamartomatous polyps and mucocutaneous pigmentation."],
      ["RB1", "A tumor suppressor associated with retinoblastoma and osteosarcoma."],
    ], 0,
    "Familial adenomatous polyposis is autosomal dominant, caused by germline APC mutations, and leads to hundreds to thousands of colonic adenomas with near-certain cancer if untreated. Prophylactic colectomy is standard. Lynch syndrome by contrast involves few polyps and mismatch repair defects with microsatellite instability.",
    ["pathology", "genetics", "oncology"], "FAP: APC, chromosome 5q, hundreds of polyps."),
  s1("Pathology", "Myocardial infarction", "moderate",
    "A 58-year-old man dies 2 days after an anterior myocardial infarction from ventricular fibrillation. Microscopic examination of the infarct is most likely to show which finding?",
    [
      ["Coagulative necrosis with an early neutrophilic infiltrate", "Neutrophils infiltrate during roughly the first one to three days."],
      ["Granulation tissue with new capillaries and fibroblasts", "This appears after about one to two weeks."],
      ["Dense collagenous scar", "A mature scar takes weeks to months."],
      ["Normal myocardium with waviness of fibers only", "Wavy fibers appear in the first hours; by 2 days necrosis is established."],
      ["Macrophage-rich infiltrate with removal of necrotic cells and no neutrophils", "Macrophages predominate later, from several days onward."],
    ], 0,
    "Irreversible injury evolves over time: within hours, wavy fibers; at 1-3 days, coagulative necrosis with neutrophils; at several days, macrophage clearance (a period of maximal softening); at 1-2 weeks, granulation tissue; at weeks to months, scar. Early arrhythmia is the commonest cause of death.",
    ["pathology", "cardiology"], "Neutrophils dominate the first few days of an MI; macrophages follow."),
  s1("Pathology", "Wilson disease", "moderate",
    "A 17-year-old boy has new-onset hand tremor, slurred speech and personality change. Examination shows hepatomegaly and a golden-brown ring at the periphery of both corneas. Which laboratory pattern is expected?",
    [
      ["Low serum ceruloplasmin with elevated 24-hour urinary copper", "Defective ATP7B impairs biliary copper excretion and incorporation into ceruloplasmin."],
      ["High serum ceruloplasmin with low urinary copper", "The opposite of the expected pattern."],
      ["Elevated ferritin with high transferrin saturation", "This suggests hereditary hemochromatosis."],
      ["Low alpha-1 antitrypsin level", "This causes emphysema and liver disease but not corneal rings."],
      ["Positive antimitochondrial antibodies", "Characteristic of primary biliary cholangitis."],
    ], 0,
    "Wilson disease is an autosomal recessive ATP7B defect causing copper accumulation in liver, basal ganglia, cornea (Kayser-Fleischer rings) and kidneys. Typical findings are low ceruloplasmin and high urinary copper. Treatment is chelation with penicillamine or trientine, or zinc.",
    ["pathology", "hepatology"], "Wilson: ATP7B, low ceruloplasmin, Kayser-Fleischer rings, tremor and psychiatric signs."),
  s1("Pathology", "Glomerulonephritis", "moderate",
    "A 7-year-old boy develops cola-colored urine, periorbital edema and a blood pressure of 140/92 mm Hg two weeks after an episode of impetigo. Serum C3 is low. Which finding is expected on electron microscopy of a kidney biopsy?",
    [
      ["Subepithelial immune complex humps", "These are characteristic of post-streptococcal glomerulonephritis."],
      ["Diffuse effacement of podocyte foot processes without deposits", "This is minimal change disease."],
      ["Splitting of the glomerular basement membrane (basket-weave)", "This is Alport syndrome."],
      ["Spike-and-dome appearance with subepithelial deposits", "This suggests membranous nephropathy."],
      ["Mesangial IgA deposits", "This characterizes IgA nephropathy, which does not lower C3."],
    ], 0,
    "Post-streptococcal glomerulonephritis is an immune-complex nephritis with lumpy-bumpy immunofluorescence, subepithelial humps on electron microscopy, neutrophil-rich glomeruli and low C3. It follows pharyngitis or skin infection by 1-3 weeks and is usually self-limited in children.",
    ["pathology", "nephrology"], "Nephritic syndrome with low C3 after strep infection: subepithelial humps."),
  s1("Pathology", "Lung cancer", "moderate",
    "A 64-year-old man with a 50-pack-year smoking history has hyponatremia (Na 123 mEq/L), low serum osmolality and inappropriately concentrated urine. Chest CT shows a central hilar mass. Biopsy is most likely to show which finding?",
    [
      ["Small round blue cells with scant cytoplasm and neuroendocrine markers", "Small cell carcinoma often causes SIADH and is centrally located."],
      ["Keratin pearls and intercellular bridges", "These are features of squamous cell carcinoma, which is more associated with hypercalcemia from PTHrP."],
      ["Glandular formation with mucin production in a peripheral lesion", "Adenocarcinoma is typically peripheral."],
      ["Large pleomorphic cells without differentiation", "These describe large cell carcinoma."],
      ["Spindle cells with a cystic cavity and no atypia", "Not a typical lung malignancy pattern."],
    ], 0,
    "Small cell lung carcinoma is strongly linked to smoking, arises centrally, and produces ectopic hormones including ADH (SIADH) and ACTH. Histologically it consists of sheets of small cells with nuclear molding, scant cytoplasm and positive chromogranin and synaptophysin. It is typically treated with chemotherapy rather than surgery.",
    ["pathology", "oncology", "paraneoplastic"], "Central mass + SIADH in a smoker = small cell carcinoma."),
  s1("Pharmacology", "Pharmacokinetics", "easy",
    "A pharmacist calculates the loading dose of a drug needed to rapidly achieve a target plasma concentration. Which pharmacokinetic parameter primarily determines this dose?",
    [
      ["Volume of distribution", "Loading dose = target concentration x volume of distribution (adjusted for bioavailability)."],
      ["Clearance", "Clearance determines the maintenance dose rate."],
      ["Half-life alone", "Half-life affects time to steady state but not the loading dose directly."],
      ["Protein binding of metabolites", "Not a primary determinant."],
      ["First-pass hepatic metabolism only", "Affects bioavailability, not the principle of the loading dose."],
    ], 0,
    "A loading dose fills the volume of distribution to the desired concentration, whereas the maintenance dose rate replaces drug eliminated, which depends on clearance. In renal or hepatic failure the loading dose usually stays the same while the maintenance dose is reduced.",
    ["pharmacology", "pharmacokinetics"], "Loading dose depends on Vd; maintenance dose depends on clearance."),
  s1("Pharmacology", "Drug metabolism and interactions", "moderate",
    "A 70-year-old man with a stable INR on warfarin starts rifampin for latent tuberculosis. Two weeks later his INR has fallen from 2.5 to 1.2. Which mechanism best explains this change?",
    [
      ["Induction of cytochrome P450 enzymes, increasing warfarin clearance", "Rifampin is a potent inducer of CYP enzymes, including those metabolizing warfarin."],
      ["Competitive inhibition of vitamin K epoxide reductase by rifampin", "Warfarin, not rifampin, inhibits this enzyme."],
      ["Displacement of warfarin from albumin", "This would transiently raise free warfarin and increase the INR."],
      ["Increased intestinal absorption of vitamin K", "No such effect from rifampin."],
      ["Decreased renal excretion of warfarin", "Warfarin is metabolized, not renally cleared."],
    ], 0,
    "Rifampin induces hepatic CYP enzymes, accelerating metabolism of warfarin and many other drugs (oral contraceptives, protease inhibitors, tacrolimus). Warfarin dose often needs to be increased. Inhibitors such as macrolides, azoles and cimetidine do the opposite. Remember that rifampin also colors body fluids orange.",
    ["pharmacology", "interactions"], "Rifampin induces CYP450 and lowers levels of warfarin and other drugs."),
  s1("Pharmacology", "Antimicrobial adverse effects", "easy",
    "A patient receiving a rapid intravenous infusion of vancomycin develops flushing and pruritus over the face, neck and upper torso with mild hypotension. Airway and lungs are clear. What is the best explanation and management?",
    [
      ["Direct mast-cell histamine release; slow the infusion and give an antihistamine", "Vancomycin infusion reaction is not IgE-mediated and is rate-related."],
      ["IgE-mediated anaphylaxis; permanently avoid vancomycin", "There is no airway or multisystem involvement and the reaction is rate-dependent."],
      ["Nephrotoxicity; stop the drug", "Does not cause flushing during infusion."],
      ["Ototoxicity; check an audiogram", "A different adverse effect."],
      ["Type IV hypersensitivity; start corticosteroids", "Delayed, T-cell mediated and not minutes after infusion."],
    ], 0,
    "Vancomycin infusion reaction (formerly red man syndrome) results from direct, non-immune histamine release from mast cells with fast infusion. Slowing the infusion rate and giving antihistamines usually allows therapy to continue. True anaphylaxis involves bronchospasm, angioedema or severe hypotension.",
    ["pharmacology", "antibiotics"], "Flushing during rapid vancomycin infusion: slow the rate and give antihistamine."),
  s1("Pharmacology", "Antiarrhythmic drugs", "moderate",
    "A 66-year-old woman who has taken amiodarone for atrial fibrillation for 3 years reports progressive exertional dyspnea and a dry cough. Spirometry shows a restrictive pattern with reduced diffusing capacity, and chest CT reveals bibasilar reticular opacities. What is the most likely explanation?",
    [
      ["Amiodarone-induced pulmonary fibrosis", "A recognized dose- and duration-related toxicity of amiodarone."],
      ["Digoxin toxicity", "Causes nausea, visual changes and arrhythmias, not lung fibrosis."],
      ["Beta-1 blocker-induced bronchospasm", "Would show an obstructive pattern."],
      ["Lisinopril cough", "Causes a dry cough but normal imaging and spirometry."],
      ["Verapamil-induced pulmonary edema", "Not a typical effect of verapamil."],
    ], 0,
    "Amiodarone is highly lipophilic with a very long half-life and toxicities in the lung, thyroid (hypo- or hyperthyroidism), liver, eyes (corneal deposits) and skin (blue-gray discoloration). Baseline and periodic pulmonary function tests, thyroid tests and liver tests are recommended; the drug is stopped if fibrosis develops.",
    ["pharmacology", "cardiology"], "Amiodarone: pulmonary fibrosis, thyroid dysfunction, hepatotoxicity, corneal deposits."),
  s1("Physiology", "Renal physiology", "moderate",
    "A patient with heart failure and pulmonary edema receives an intravenous diuretic and quickly passes a large volume of dilute urine. She later complains of tinnitus. The drug most likely inhibits which transporter?",
    [
      ["Na-K-2Cl cotransporter in the thick ascending limb", "Loop diuretics block NKCC2, abolishing the medullary gradient and causing hypokalemia and ototoxicity."],
      ["Na-Cl cotransporter in the distal convoluted tubule", "Thiazides act here and decrease urinary calcium excretion."],
      ["Epithelial sodium channel in the collecting duct", "Amiloride and triamterene act here and are potassium sparing."],
      ["Carbonic anhydrase in the proximal tubule", "Acetazolamide causes bicarbonate diuresis."],
      ["Aquaporin-2 water channels", "Targeted by ADH antagonists such as tolvaptan."],
    ], 0,
    "Loop diuretics inhibit NKCC2 in the thick ascending limb, reducing reabsorption of sodium, potassium, calcium and magnesium and impairing urinary concentration. Adverse effects include hypokalemia, metabolic alkalosis, hypocalcemia, ototoxicity and hyperuricemia.",
    ["physiology", "renal"], "Loop diuretics block NKCC2 and cause ototoxicity and hypokalemia."),
  s1("Physiology", "Cardiac physiology", "difficult",
    "In an experimental model, a vasopressor is infused to acutely raise systemic vascular resistance while preload and contractility are unchanged. Which changes in the left ventricular pressure-volume loop are expected?",
    [
      ["Increased end-systolic volume and decreased stroke volume", "Higher afterload reduces ejection, leaving more blood in the ventricle."],
      ["Decreased end-systolic volume and increased stroke volume", "This pattern occurs with increased contractility."],
      ["Increased end-diastolic volume with a leftward shift of the loop", "Not a feature of pure afterload elevation."],
      ["Unchanged end-systolic volume with a narrower loop", "A narrower loop reflects reduced stroke volume, which is accompanied by increased end-systolic volume."],
      ["Decreased end-diastolic pressure with a wider loop", "Occurs with reduced preload or venodilation, not afterload."],
    ], 0,
    "With higher afterload the ventricle must generate more pressure to open the aortic valve, ejecting less volume. The loop becomes taller and narrower: end-systolic volume rises and stroke volume falls, and end-diastolic volume may rise secondarily. Increased contractility instead lowers end-systolic volume.",
    ["physiology", "cardiology"], "Afterload up: ESV up, SV down; contractility up: ESV down, SV up."),
  s1("Physiology", "Respiratory physiology", "moderate",
    "A 45-year-old woman 10 days after hip surgery develops sudden pleuritic chest pain and dyspnea. A CT angiogram shows a large embolus in the right lower lobe pulmonary artery. In the affected lung region, which ventilation-perfusion pattern is expected?",
    [
      ["Ventilation-perfusion ratio increased, approaching dead space", "Ventilation continues but blood flow is blocked."],
      ["Ventilation-perfusion ratio decreased, approaching shunt", "This occurs when airways are blocked, as in lobar pneumonia or mucus plugging."],
      ["Normal ventilation-perfusion ratio", "Embolic obstruction alters the ratio."],
      ["Ventilation-perfusion ratio of zero", "Corresponds to a complete shunt."],
      ["Perfusion-limited gas exchange with increased diffusion capacity", "This is unrelated to embolism."],
    ], 0,
    "Occlusion of a pulmonary artery removes perfusion from ventilated alveoli, raising the V/Q ratio toward infinity and increasing physiologic dead space. Hypoxemia results from redistribution of flow to other regions and mismatching, and an increased alveolar-arterial gradient is common.",
    ["physiology", "respiratory"], "Pulmonary embolism: high V/Q, dead space; airway obstruction: low V/Q, shunt."),
  s1("Physiology", "Gastrointestinal physiology", "difficult",
    "A 41-year-old man has refractory duodenal and jejunal ulcers and chronic diarrhea. Fasting serum gastrin is markedly elevated, and gastric pH is very low. Excess gastrin most directly increases acid output by which mechanism?",
    [
      ["Stimulating enterochromaffin-like cells to release histamine that acts on parietal cell H2 receptors", "This is the dominant pathway of gastrin-stimulated acid secretion."],
      ["Inhibiting somatostatin release from D cells to lower bicarbonate secretion", "Not the major mechanism."],
      ["Increasing secretin release from duodenal S cells", "Secretin reduces acid secretion."],
      ["Blocking prostaglandin synthesis in surface mucous cells", "This describes NSAID effect."],
      ["Directly stimulating chief cells to release intrinsic factor", "Chief cells make pepsinogen; parietal cells make intrinsic factor."],
    ], 0,
    "In Zollinger-Ellison syndrome, a gastrin-secreting tumor drives parietal cells to secrete acid, mainly through histamine from ECL cells and also through direct CCK-B receptor action. The acid load causes ulcers in atypical sites and diarrhea or steatorrhea from inactivated pancreatic enzymes. High-dose proton pump inhibitors are the mainstay of therapy.",
    ["physiology", "gastroenterology"], "Gastrin -> ECL histamine -> parietal cell H2 -> acid; PPIs control Zollinger-Ellison."),
  s1("Behavioral Science", "Biostatistics", "moderate",
    "A new screening test is evaluated in 300 people. Of 100 people with the disease, 90 test positive. Of 200 people without the disease, 30 test positive. What is the positive predictive value of the test?",
    [
      ["75%", "PPV = true positives / all positives = 90 / (90 + 30)."],
      ["90%", "This is the sensitivity."],
      ["85%", "This is the specificity (170/200)."],
      ["94%", "This is the negative predictive value (170/180)."],
      ["30%", "This is the number of false positives, not a predictive value."],
    ], 0,
    "True positives are 90 and false positives are 30, so the positive predictive value is 90/120 = 75%. Sensitivity is 90/100, specificity is 170/200 and negative predictive value is 170/180. Predictive values depend on disease prevalence, while sensitivity and specificity do not.",
    ["biostatistics", "screening"], "PPV = TP / (TP + FP) and varies with prevalence."),
  s1("Behavioral Science", "Medical ethics", "moderate",
    "A 72-year-old woman with diabetic foot gangrene and sepsis refuses a recommended below-knee amputation, saying she wants to go home. She is alert, repeats the surgeon's explanation accurately, and says, 'I know I may die, but I would rather die at home than live without my leg.' What is the most appropriate next step?",
    [
      ["Confirm that she has decision-making capacity and respect her informed refusal", "She understands, appreciates consequences, reasons with consistent values and expresses a choice."],
      ["Obtain a court order to proceed with amputation", "Not appropriate for a capacitated adult."],
      ["Ask her adult children to consent on her behalf", "Surrogates decide only when the patient lacks capacity."],
      ["Proceed with amputation under the emergency exception", "Emergency exception applies when the patient cannot decide and there is no known refusal."],
      ["Defer to psychiatry to declare her incompetent", "Capacity is task-specific and can be assessed by any physician; there is no evidence of impairment."],
    ], 0,
    "Capacity requires the ability to understand relevant information, appreciate its consequences for oneself, reason about options and communicate a consistent choice. A capacitated adult may refuse even life-saving treatment. Clinicians should explore her concerns, offer alternatives such as palliative care or home support, and document the discussion.",
    ["ethics", "capacity"], "A capacitated adult may refuse treatment, even when the refusal may be fatal."),
  s1("Behavioral Science", "Defense mechanisms", "easy",
    "A man is reprimanded by his supervisor and says nothing. When he arrives home, he shouts at his dog for knocking over a water bowl. Which defense mechanism is he using?",
    [
      ["Displacement", "Redirecting emotion from the original source to a safer, less threatening target."],
      ["Projection", "Attributing one's own unacceptable feelings to others."],
      ["Reaction formation", "Behaving in a manner opposite to an unacceptable impulse."],
      ["Sublimation", "Channelling impulses into socially acceptable activities."],
      ["Rationalization", "Justifying behavior with logical but false explanations."],
    ], 0,
    "Displacement transfers an emotion such as anger from a threatening person to a safer target. It is classified among immature or neurotic defenses. Sublimation by contrast is a mature defense, such as channelling aggressive urges into competitive sport.",
    ["behavioral science", "psychiatry"], "Displacement: same emotion, different (safer) target."),
  s1("Immunology", "Transplant immunology", "moderate",
    "Within minutes of vascular anastomosis during kidney transplantation, the graft becomes cyanotic and mottled, and no urine is produced. Which mechanism is responsible?",
    [
      ["Preformed recipient antibodies against donor antigens", "Hyperacute rejection is a type II hypersensitivity reaction with complement activation and thrombosis."],
      ["Donor T cells attacking recipient tissues", "This describes graft-versus-host disease."],
      ["Recipient T-cell-mediated infiltration of the graft over weeks", "This describes acute cellular rejection."],
      ["Chronic vascular intimal thickening", "Typical of chronic rejection months to years later."],
      ["Calcineurin inhibitor nephrotoxicity", "This occurs days to weeks later and is not related to vascular anastomosis."],
    ], 0,
    "Hyperacute rejection occurs within minutes to hours when the recipient has preformed antibodies, for example against ABO or HLA antigens after prior transfusion, pregnancy or transplant. Antibody binding activates complement and causes endothelial injury, thrombosis and graft infarction. It is prevented by ABO matching and crossmatching.",
    ["immunology", "transplant"], "Hyperacute rejection = preformed antibodies, minutes, no treatment other than graft removal."),
  s1("Immunology", "Complement disorders", "moderate",
    "A 26-year-old woman has recurrent episodes of non-pitting swelling of the lips, face and bowel wall, causing abdominal pain, without urticaria. Episodes are not relieved by antihistamines, and her mother has similar episodes. Which laboratory finding is most likely?",
    [
      ["Low C4 and low C1 esterase inhibitor activity", "Hereditary angioedema from C1 inhibitor deficiency leads to unregulated bradykinin production and classical complement consumption."],
      ["Elevated serum tryptase", "Seen in mast-cell activation or anaphylaxis, which would cause urticaria."],
      ["Low C3 and normal C4", "More typical of post-infectious glomerulonephritis."],
      ["Elevated IgE and eosinophilia", "Seen in allergic disease, not C1 inhibitor deficiency."],
      ["Decreased CD18 expression", "Seen in leukocyte adhesion deficiency."],
    ], 0,
    "C1 esterase inhibitor regulates the complement and kallikrein-kinin pathways. Its deficiency (autosomal dominant) causes bradykinin-mediated angioedema, with low C4 even between attacks. Antihistamines, steroids and epinephrine are ineffective; treatment includes C1 inhibitor concentrate or bradykinin pathway inhibitors, and ACE inhibitors must be avoided.",
    ["immunology", "complement"], "Angioedema without urticaria and with low C4: C1 inhibitor deficiency."),
  s1("Pathology", "Hemostasis", "moderate",
    "A 25-year-old woman has bruising, fever, confusion and hematuria. Platelets are 18,000/uL, hemoglobin is 8.2 g/dL with schistocytes on the smear, and creatinine is mildly elevated. PT and aPTT are normal. Which mechanism underlies her disorder?",
    [
      ["Deficiency of ADAMTS13 with accumulation of ultra-large von Willebrand multimers", "TTP results from impaired cleavage of vWF, causing platelet-rich microthrombi."],
      ["Consumption of clotting factors by widespread fibrin deposition", "That is DIC, which prolongs PT and aPTT."],
      ["Autoantibodies against glycoprotein IIb/IIIa only", "ITP does not cause hemolysis or organ dysfunction."],
      ["Deficiency of factor VIII", "Hemophilia A prolongs the aPTT and does not cause thrombocytopenia."],
      ["Antibodies against platelet factor 4-heparin complexes", "HIT requires heparin exposure."],
    ], 0,
    "The pentad of thrombotic thrombocytopenic purpura is microangiopathic hemolytic anemia, thrombocytopenia, neurologic signs, renal dysfunction and fever; coagulation tests are normal. It results from ADAMTS13 deficiency, often autoimmune, and is treated urgently with plasma exchange. Platelet transfusion is generally avoided.",
    ["pathology", "hematology"], "Schistocytes, low platelets, normal PT/aPTT: TTP, ADAMTS13 deficiency, plasma exchange."),
  s1("Anatomy", "Brachial plexus", "moderate",
    "A newborn delivered after a difficult shoulder dystocia holds his right arm adducted, internally rotated and extended at the elbow with the forearm pronated. The grasp reflex is preserved. Which nerve roots are most likely injured?",
    [
      ["C5-C6", "Upper trunk injury (Erb palsy) affects shoulder abduction, external rotation and elbow flexion."],
      ["C8-T1", "Lower trunk injury (Klumpke palsy) causes claw hand and impaired grasp."],
      ["C3-C4", "These roots form the phrenic nerve and cervical plexus."],
      ["C7 only", "An isolated C7 injury is uncommon and would not produce this pattern."],
      ["T2-T3", "Not part of the brachial plexus."],
    ], 0,
    "Erb palsy follows excessive lateral traction of the neck, injuring the upper trunk (C5-C6). The affected muscles include deltoid, supraspinatus, infraspinatus, biceps and brachialis, producing the 'waiter's tip' position. Hand function is preserved, and most infants recover spontaneously.",
    ["anatomy", "neurology"], "Erb palsy: C5-C6, waiter's tip posture, preserved grasp."),
  s1("Biochemistry", "Lipid metabolism", "moderate",
    "A 12-year-old boy has tendon xanthomas at the Achilles tendons and an LDL cholesterol of 480 mg/dL. His father had a myocardial infarction at age 38. Which defect is the most likely cause?",
    [
      ["Absent or defective LDL receptors", "Familial hypercholesterolemia reduces hepatic LDL uptake, markedly elevating plasma LDL."],
      ["Deficiency of lipoprotein lipase", "Causes marked chylomicronemia and hypertriglyceridemia."],
      ["Deficiency of apolipoprotein B-48", "Leads to fat malabsorption (abetalipoproteinemia), with very low LDL."],
      ["Defective apo E leading to remnant accumulation", "Familial dysbetalipoproteinemia has elevated cholesterol and triglycerides and palmar xanthomas."],
      ["Overproduction of VLDL only", "Causes hypertriglyceridemia, not isolated LDL elevation."],
    ], 0,
    "Familial hypercholesterolemia is autosomal dominant, due to LDL receptor mutations (or less often apoB-100 or PCSK9 gain-of-function). Heterozygotes have LDL of roughly two- to threefold normal and premature coronary disease; homozygotes have extreme levels with childhood cardiac events. Statins, ezetimibe and PCSK9 inhibitors are used.",
    ["biochemistry", "lipids"], "Tendon xanthomas + very high LDL + premature CAD: LDL receptor defect."),
];

const s1n = note("usmle-step-1");
const S1_M: SeedMaterial[] = [
  s1n("Anatomy", "Brachial plexus", "Brachial Plexus and Peripheral Nerve Injuries", "Roots, trunks, cords and the classic nerve injury patterns tested on Step 1.", 6, `
# Brachial Plexus and Peripheral Nerve Injuries

The plexus is built from roots C5-T1 and is remembered as **Randy Travis Drinks Cold Beer**: Roots, Trunks, Divisions, Cords, Branches.

## Structure
- **Upper trunk (C5-C6):** suprascapular nerve, nerve to subclavius.
- **Lateral cord:** musculocutaneous nerve and the lateral head of the median nerve.
- **Posterior cord:** axillary and radial nerves (also upper and lower subscapular, thoracodorsal).
- **Medial cord:** ulnar nerve, medial head of the median nerve, medial cutaneous nerves.

## Classic injury patterns
| Injury | Deficit |
|---|---|
| **Upper trunk (Erb palsy)** | Arm adducted, internally rotated, elbow extended ("waiter's tip") |
| **Lower trunk (Klumpke palsy)** | Claw hand, intrinsic hand weakness, possible Horner syndrome |
| **Axillary nerve** (surgical neck fracture, anterior dislocation) | Weak abduction beyond 15 degrees, loss of sensation over lateral shoulder |
| **Radial nerve** (midshaft humerus) | Wrist drop, weak finger extension |
| **Median nerve** (supracondylar fracture, carpal tunnel) | Ape hand, weak thumb opposition, loss of lateral palm sensation |
| **Ulnar nerve** (medial epicondyle, hook of hamate) | Claw hand worse on attempted extension, loss of sensation over medial hand |
| **Long thoracic nerve** (mastectomy, axillary dissection) | Winged scapula from serratus anterior paralysis |

## Reasoning approach
1. Identify the **site of injury** (fracture, dislocation, compression).
2. Link that site to the nerve closest to it.
3. Predict motor loss from the muscles supplied, then sensory loss from the dermatome map.

## Thoracic outlet and other pearls
- **Thoracic outlet syndrome** compresses the lower trunk and subclavian vessels (cervical rib, scalene hypertrophy), producing ulnar-distribution symptoms and vascular signs.
- **Pancoast tumor** invades the lower trunk and sympathetic chain, producing hand weakness, Horner syndrome and shoulder pain.
- **Lesions of the ulnar nerve** are described as "ulnar claw"; lesions of the median nerve at the hand are called "hand of benediction" on attempted fist formation.

> **High-yield / exam traps:** In a distal ulnar nerve lesion the claw is more obvious than in a proximal lesion (the paradox arises because flexor digitorum profundus to digits 4-5 is spared in a proximal lesion). A scapular winging question is the long thoracic nerve, not the accessory nerve (trapezius).
`),
  s1n("Biochemistry", "Inborn errors of metabolism", "Inborn Errors of Metabolism: A Pattern-Recognition Guide", "Link the clinical clue to the enzyme: amino acid, urea cycle, glycogen and lysosomal disorders.", 7, `
# Inborn Errors of Metabolism

Step 1 rewards pattern recognition: identify the **clue**, name the **pathway**, then name the **enzyme and the accumulating substrate**.

## Amino acid disorders
- **Phenylketonuria:** phenylalanine hydroxylase (or BH4) deficiency. Musty odor, fair skin, intellectual disability. Tyrosine becomes essential; avoid aspartame.
- **Maple syrup urine disease:** branched-chain alpha-ketoacid dehydrogenase deficiency; sweet-smelling urine; thiamine is a cofactor.
- **Homocystinuria:** cystathionine synthase deficiency; marfanoid habitus, downward lens dislocation, thrombosis.
- **Alkaptonuria:** homogentisate oxidase deficiency; dark urine on standing, ochronosis, arthritis.

## Urea cycle
- Hyperammonemia with lethargy and vomiting in the newborn.
- **OTC deficiency** (X-linked) shows **high orotic acid**; CPS I deficiency does not.

## Glycogen storage
- **Von Gierke (G6Pase):** severe fasting hypoglycemia, lactic acidosis, gout.
- **Pompe (acid alpha-glucosidase):** cardiomegaly and hypotonia.
- **McArdle (muscle phosphorylase):** exercise cramps, myoglobinuria, no lactate rise.

## Lysosomal storage
| Disease | Enzyme | Distinguishing clue |
|---|---|---|
| Tay-Sachs | Hexosaminidase A | Cherry-red spot, no organomegaly |
| Gaucher | Glucocerebrosidase | Hepatosplenomegaly, bone crises, crumpled-tissue macrophages |
| Fabry (X-linked) | Alpha-galactosidase A | Neuropathic pain, angiokeratomas, renal failure |
| Niemann-Pick | Sphingomyelinase | Cherry-red spot with hepatosplenomegaly |
| Hurler | Alpha-L-iduronidase | Coarse facies, corneal clouding |

## Fatty acid oxidation
- **Medium-chain acyl-CoA dehydrogenase deficiency:** fasting hypoketotic hypoglycemia; avoid prolonged fasting.
- **Carnitine deficiency:** muscle weakness, hypoketotic hypoglycemia.

## Management themes
Dietary restriction of the offending substrate, cofactor supplementation (BH4, thiamine, B6), enzyme replacement for some lysosomal diseases, and avoidance of fasting for fatty acid oxidation defects.

> **High-yield / exam traps:** Hunter syndrome is X-linked and lacks corneal clouding; Hurler has corneal clouding. Fabry and Hunter are the X-linked lysosomal storage diseases; the rest are autosomal recessive.
`),
  s1n("Pathology", "Glomerular disease", "Nephritic versus Nephrotic Syndromes", "Distinguish glomerular syndromes using clinical picture, serology and electron microscopy.", 6, `
# Nephritic versus Nephrotic Syndromes

## The two syndromes
- **Nephritic:** hematuria with red-cell casts, hypertension, oliguria, mild-to-moderate proteinuria, azotemia.
- **Nephrotic:** proteinuria above 3.5 g/day, hypoalbuminemia, edema, hyperlipidemia, lipiduria, thromboembolism risk, infection risk (loss of immunoglobulins).

## Nephritic diseases
| Disease | Key features |
|---|---|
| **Post-streptococcal GN** | Child, 1-3 weeks after strep infection, low C3, subepithelial humps |
| **IgA nephropathy** | Hematuria 1-2 days after a respiratory infection, normal complement, mesangial IgA |
| **Alport syndrome** | X-linked collagen IV defect, hearing loss, ocular lesions, basket-weave GBM |
| **Rapidly progressive GN** | Crescents on biopsy; subtypes by immunofluorescence |

### RPGN subtypes
- **Anti-GBM (Goodpasture):** linear IgG along GBM; lung hemorrhage and nephritis; anti-type IV collagen alpha-3 chain.
- **Immune complex:** granular deposits (lupus, post-infectious).
- **Pauci-immune:** ANCA-positive (granulomatosis with polyangiitis, microscopic polyangiitis).

## Nephrotic diseases
- **Minimal change disease:** children; foot-process effacement only; steroid responsive; may follow infection or Hodgkin lymphoma.
- **Focal segmental glomerulosclerosis:** HIV, heroin, obesity; poor steroid response.
- **Membranous nephropathy:** adults; spike-and-dome, subepithelial deposits; PLA2R antibodies; associated with hepatitis B, malignancy, lupus.
- **Diabetic nephropathy:** Kimmelstiel-Wilson nodules, hyaline arteriolosclerosis; treat with ACE inhibitor or ARB.
- **Amyloidosis:** apple-green birefringence with Congo red.

## Approach to a vignette
1. Is blood or protein dominant?
2. What is the age and the preceding event?
3. What do complement levels show? Low C3 suggests post-infectious GN, lupus, or membranoproliferative disease.
4. Select the electron microscopy or immunofluorescence description that matches.

> **High-yield / exam traps:** Lupus nephritis can present as either syndrome, and the classic "wire-loop" lesion is diffuse proliferative (class IV). Never confuse linear (anti-GBM) with granular (immune complex) immunofluorescence.
`),
  s1n("Physiology", "Acid-base physiology", "Renal Handling of Sodium, Water and Potassium", "Where each nephron segment acts and how diuretics and hormones change urine composition.", 6, `
# Renal Handling of Sodium, Water and Potassium

## Segment-by-segment
- **Proximal tubule:** reabsorbs about two-thirds of filtered sodium and water, nearly all glucose and amino acids, and most bicarbonate (via carbonic anhydrase). Reabsorption is isosmotic.
- **Thin descending limb:** permeable to water, not solute; urine becomes concentrated.
- **Thick ascending limb:** Na-K-2Cl cotransporter; impermeable to water; generates the medullary gradient; reabsorbs calcium and magnesium by paracellular transport driven by lumen-positive voltage.
- **Distal convoluted tubule:** Na-Cl cotransporter; calcium reabsorption under PTH control.
- **Collecting duct:** principal cells (sodium via ENaC, potassium secretion, water via ADH-regulated aquaporin-2); intercalated cells (acid or bicarbonate secretion).

## Hormonal control
- **Aldosterone:** increases ENaC and Na-K-ATPase activity; promotes potassium and hydrogen ion secretion; causes volume expansion with hypokalemic alkalosis when in excess.
- **ADH:** inserts aquaporin-2; urine becomes concentrated. Absent or ineffective in central or nephrogenic diabetes insipidus.
- **Atrial natriuretic peptide:** dilates the afferent arteriole, inhibits sodium reabsorption.
- **Angiotensin II:** constricts the efferent arteriole, preserving GFR when renal perfusion is low; stimulates proximal sodium reabsorption.

## Diuretics at a glance
| Class | Site | Notable effects |
|---|---|---|
| Acetazolamide | Proximal tubule | Bicarbonate loss, metabolic acidosis |
| Loop diuretics | Thick ascending limb | Hypokalemia, hypocalcemia, ototoxicity |
| Thiazides | Distal tubule | Hypercalcemia, hyponatremia, hyperglycemia |
| Spironolactone | Collecting duct | Hyperkalemia, gynecomastia |
| Amiloride | Collecting duct (ENaC) | Hyperkalemia |

## Potassium
Potassium is secreted in the collecting duct, so more sodium delivery (loop or thiazide) and high aldosterone increase potassium loss. Acidosis shifts potassium out of cells; insulin and beta-2 agonists shift it into cells.

> **High-yield / exam traps:** Thiazides **lower** urinary calcium and loops **raise** it. Hyponatremia with euvolemia and concentrated urine suggests SIADH; always check volume status before choosing treatment.
`),
  s1n("Microbiology", "Bacterial toxins", "Bacterial Toxins and Their Mechanisms", "Match exotoxins to their molecular targets and clinical syndromes.", 6, `
# Bacterial Toxins and Their Mechanisms

Toxins are a favorite test topic because the **mechanism** often identifies the organism.

## Inhibit protein synthesis
- **Diphtheria toxin** (Corynebacterium diphtheriae) and **Pseudomonas exotoxin A:** ADP-ribosylate elongation factor 2.
- **Shiga toxin** (Shigella) and **Shiga-like toxin** (EHEC): cleave 28S rRNA of the 60S subunit; hemolytic uremic syndrome.

## Increase cyclic nucleotides
- **Cholera toxin:** permanently activates Gs, raising cAMP; rice-water diarrhea.
- **Heat-labile toxin of ETEC:** similar to cholera; heat-stable toxin raises cGMP.
- **Pertussis toxin:** inhibits Gi, raising cAMP; lymphocytosis.
- **Anthrax edema factor:** a calmodulin-dependent adenylate cyclase.

## Disrupt neurotransmitter release
- **Tetanus toxin:** blocks release of inhibitory glycine and GABA in the spinal cord (spastic paralysis, lockjaw).
- **Botulinum toxin:** blocks acetylcholine release at the neuromuscular junction (flaccid paralysis). Infant botulism follows honey ingestion.

## Superantigens
- **Staphylococcal TSST-1, enterotoxins and streptococcal pyrogenic exotoxins** cross-link MHC II and T-cell receptors, causing a cytokine storm.

## Membrane damaging
- **Clostridium perfringens alpha toxin** is a lecithinase (phospholipase C) causing gas gangrene and double-zone hemolysis.
- **Streptolysin O** is oxygen-labile and elicits the ASO titer.
- **Listeriolysin O** allows escape from the phagosome.

## Endotoxin (lipid A)
Gram-negative lipopolysaccharide acts via TLR4 and CD14, producing fever, hypotension and DIC. Meningococcal sepsis and Waterhouse-Friderichsen syndrome illustrate extreme release.

## Preformed toxins and food poisoning
- Staphylococcus aureus and Bacillus cereus (emetic form) cause **short-incubation vomiting** from preformed toxin.
- Clostridium perfringens produces toxin in the gut after ingestion of reheated meat.

> **High-yield / exam traps:** Tetanus and botulism are both clostridial SNARE-cleaving toxins, yet tetanus causes spasm and botulism causes flaccid paralysis because they act at different neurons. Diphtheria toxin is encoded by a lysogenic bacteriophage, as are cholera, botulinum (some types), Shiga toxin and erythrogenic toxins.
`),
];

const s1f = fc("usmle-step-1");
const S1_F: SeedFlashcard[] = [
  s1f("Anatomy", "Brachial plexus", "Which nerve is injured in a winged scapula after axillary lymph node dissection?", "The long thoracic nerve (C5-C7), causing serratus anterior paralysis."),
  s1f("Anatomy", "Upper limb nerve injury", "Which nerve is injured by a surgical neck humerus fracture?", "The axillary nerve, with deltoid weakness and lateral shoulder numbness."),
  s1f("Anatomy", "Lower limb nerve injury", "Which nerve injury causes Trendelenburg gait?", "Superior gluteal nerve (weak gluteus medius and minimus); the pelvis drops on the contralateral side."),
  s1f("Biochemistry", "Inborn errors of metabolism", "Enzyme deficient in phenylketonuria?", "Phenylalanine hydroxylase (or its cofactor BH4); tyrosine becomes essential."),
  s1f("Biochemistry", "Inborn errors of metabolism", "Which amino acid disorder produces urine that darkens on standing?", "Alkaptonuria (homogentisate oxidase deficiency) with ochronosis and arthritis."),
  s1f("Biochemistry", "Vitamin deficiencies", "Which vitamin deficiency causes pellagra and what are the 3 Ds?", "Niacin (B3): dermatitis, diarrhea, dementia (and death in severe cases)."),
  s1f("Biochemistry", "Lipid metabolism", "Which lipoprotein particle carries dietary triglycerides from the gut?", "Chylomicrons (apoB-48), cleared by lipoprotein lipase."),
  s1f("Microbiology", "Bacterial toxins", "Mechanism of cholera toxin?", "Permanent activation of Gs (ADP-ribosylation), increasing cAMP and chloride secretion."),
  s1f("Microbiology", "Bacterial toxins", "How does botulinum toxin differ from tetanus toxin clinically?", "Botulinum blocks acetylcholine release (flaccid paralysis); tetanus blocks inhibitory glycine/GABA release (spastic paralysis)."),
  s1f("Microbiology", "Fungal infections", "Which encapsulated yeast is highlighted by India ink in CSF and causes meningitis in advanced HIV?", "Cryptococcus neoformans (budding yeast with a polysaccharide capsule); also detected by cryptococcal antigen."),
  s1f("Pathology", "Glomerular disease", "Immunofluorescence pattern of anti-GBM disease?", "Linear IgG deposition along the glomerular basement membrane."),
  s1f("Pathology", "Neoplasia genetics", "Which gene is mutated in neurofibromatosis type 1?", "NF1 on chromosome 17 (neurofibromin, a negative regulator of RAS)."),
  s1f("Pathology", "Myocardial infarction", "Which coronary artery is most often occluded in an anterior MI?", "The left anterior descending artery."),
  s1f("Pharmacology", "Drug metabolism and interactions", "Name 4 cytochrome P450 inducers.", "Rifampin, phenytoin, carbamazepine, phenobarbital (also St John's wort, chronic alcohol)."),
  s1f("Pharmacology", "Antimicrobial adverse effects", "Which antibiotic class is associated with tendon rupture and QT prolongation?", "Fluoroquinolones (also avoid in children for cartilage toxicity)."),
  s1f("Pharmacology", "Pharmacokinetics", "What determines the time to reach steady state?", "The elimination half-life; roughly 4-5 half-lives regardless of dose."),
  s1f("Physiology", "Cardiac physiology", "Effect of increased contractility on the pressure-volume loop?", "Lower end-systolic volume and higher stroke volume."),
  s1f("Physiology", "Renal physiology", "Which diuretic raises serum calcium?", "Thiazides (they increase distal calcium reabsorption); loop diuretics lower serum calcium."),
  s1f("Behavioral Science", "Biostatistics", "What does a 95% confidence interval that includes 1.0 for a relative risk mean?", "The result is not statistically significant at the 0.05 level."),
  s1f("Immunology", "Hypersensitivity", "Type of hypersensitivity in Goodpasture syndrome?", "Type II (antibody-mediated against the basement membrane collagen)."),
];

/* ================================================================== */
/* USMLE STEP 2 CK                                                     */
/* ================================================================== */
const s2 = mk("usmle-step-2-ck");
const S2_Q: SeedQuestion[] = [
  s2("Internal Medicine", "Variceal hemorrhage", "moderate",
    "A 58-year-old man with alcohol-related cirrhosis presents with hematemesis. His blood pressure is 88/54 mm Hg, pulse 124/min, and hemoglobin 7.4 g/dL. Two large-bore intravenous lines are placed and blood products are started. Which additional therapy should be given before endoscopy?",
    [
      ["Intravenous octreotide with antibiotic prophylaxis", "Splanchnic vasoconstriction lowers portal pressure, and prophylactic antibiotics improve survival in cirrhotic bleeds."],
      ["Oral propranolol", "Used for secondary prophylaxis, not acute bleeding, and could worsen hypotension."],
      ["Intravenous vitamin K alone", "Does not address variceal bleeding."],
      ["Emergent transjugular intrahepatic portosystemic shunt", "Reserved for refractory bleeding after endoscopic therapy fails."],
      ["Intravenous furosemide", "Would worsen hypovolemia."],
    ], 0,
    "Suspected variceal hemorrhage requires resuscitation (restrictive transfusion strategy), a vasoactive agent such as octreotide, antibiotic prophylaxis (typically ceftriaxone) and early endoscopy with band ligation. Balloon tamponade or TIPS is used for refractory bleeding, and nonselective beta-blockers are used for prophylaxis later.",
    ["gastroenterology", "hepatology", "emergency"], "Variceal bleed: octreotide, antibiotics, early banding."),
  s2("Internal Medicine", "Acute pancreatitis", "easy",
    "A 44-year-old woman has severe epigastric pain radiating to the back with vomiting after a large meal. Lipase is five times the upper limit of normal, and ultrasonography shows gallstones. She is hemodynamically stable. Which is the most important initial intervention?",
    [
      ["Aggressive intravenous crystalloid hydration", "Early fluid resuscitation reduces pancreatic necrosis and organ failure."],
      ["Prophylactic broad-spectrum antibiotics", "Not recommended in uncomplicated acute pancreatitis."],
      ["Strict nil by mouth for 2 weeks", "Early oral feeding as tolerated is preferred."],
      ["Urgent surgical debridement", "Reserved for infected necrosis later in the course."],
      ["Intravenous octreotide", "Has no proven benefit."],
    ], 0,
    "Acute pancreatitis is managed supportively with early goal-directed fluid resuscitation (lactated Ringer solution is often preferred), analgesia, and early enteral feeding. Gallstone pancreatitis calls for cholecystectomy during the same admission for mild disease, and ERCP if cholangitis or persistent obstruction is present.",
    ["gastroenterology", "management"], "Acute pancreatitis: fluids, analgesia, early feeding; no routine antibiotics."),
  s2("Internal Medicine", "Acute kidney injury", "moderate",
    "A 63-year-old man in the ICU has a creatinine rise from 1.0 to 3.2 mg/dL after 3 days of hypotension from septic shock. Urinalysis shows muddy brown granular casts, and the fractional excretion of sodium is 3%. What is the most likely diagnosis?",
    [
      ["Acute tubular necrosis", "Ischemic injury to tubular cells yields granular casts and a high FENa."],
      ["Prerenal azotemia", "Would show a bland sediment and FENa below 1%."],
      ["Acute interstitial nephritis", "Typically shows white cell casts and eosinophiluria after drug exposure."],
      ["Postrenal obstruction", "Would show hydronephrosis on ultrasonography."],
      ["Rapidly progressive glomerulonephritis", "Would show red cell casts and dysmorphic red cells."],
    ], 0,
    "Prolonged hypoperfusion causes ischemic acute tubular necrosis, characterized by muddy brown casts, FENa above 2% and failure to improve after fluid repletion. Management is supportive: treat the cause, avoid nephrotoxins, and adjust drug doses, with dialysis for refractory complications.",
    ["nephrology", "critical care"], "Muddy brown casts and high FENa after hypotension: ATN."),
  s2("Internal Medicine", "COPD exacerbation", "difficult",
    "A 71-year-old man with severe COPD presents with 2 days of worsening dyspnea and purulent sputum. He is tired and using accessory muscles. Arterial blood gas on 2 L/min oxygen shows pH 7.27, PaCO2 68 mm Hg and PaO2 58 mm Hg. After nebulized bronchodilators, systemic corticosteroids and antibiotics, which next step is most appropriate?",
    [
      ["Noninvasive positive pressure ventilation", "Reduces intubation and mortality in COPD exacerbation with acute hypercapnic acidosis."],
      ["Increase oxygen to 100% by non-rebreather mask", "High-flow oxygen can worsen hypercapnia."],
      ["Intravenous theophylline", "Has a narrow therapeutic index and little added benefit."],
      ["Immediate endotracheal intubation", "Reserved for failure of NIV, altered consciousness or inability to protect the airway."],
      ["Intravenous furosemide", "No evidence of fluid overload is described."],
    ], 0,
    "Acute exacerbations with respiratory acidosis (pH below 7.35 and elevated PaCO2) should be treated with noninvasive ventilation, which has the strongest evidence of reducing intubation and mortality. Oxygen should be titrated to a saturation of about 88-92%. Intubation is used if NIV fails or contraindications exist.",
    ["pulmonology", "critical care"], "COPD with hypercapnic acidosis: BiPAP, titrated oxygen, steroids, antibiotics."),
  s2("Internal Medicine", "Acute monoarthritis", "moderate",
    "A 49-year-old man has a hot, swollen, painful right knee and fever of 38.6 C that began yesterday. He cannot bear weight. There is no recent trauma. What is the most appropriate next step in management?",
    [
      ["Arthrocentesis with synovial fluid Gram stain, culture, cell count and crystal analysis", "Distinguishes septic from crystal arthritis and should precede antibiotics when feasible."],
      ["Begin colchicine and discharge", "Cannot treat as gout until infection is excluded."],
      ["Plain radiograph of the knee and follow-up in 1 week", "Delays diagnosis of a possible septic joint."],
      ["Start oral prednisone", "Steroids could worsen infection."],
      ["Intra-articular corticosteroid injection", "Contraindicated when septic arthritis is possible."],
    ], 0,
    "An acutely inflamed single joint with fever is septic arthritis until proven otherwise because untreated infection destroys cartilage within days. Joint aspiration provides the diagnosis; synovial white cell counts above about 50,000/uL, a positive Gram stain or culture, and absence of crystals favor infection. Empiric antibiotics and drainage follow.",
    ["rheumatology", "infectious disease"], "Hot swollen joint: aspirate first, treat septic arthritis empirically."),
  s2("Internal Medicine", "Spontaneous bacterial peritonitis", "moderate",
    "A 60-year-old woman with cirrhosis and ascites presents with fever, diffuse abdominal tenderness and confusion. Paracentesis reveals an ascitic fluid neutrophil count of 620 cells/uL. Culture is pending. Which management is most appropriate?",
    [
      ["Intravenous ceftriaxone or cefotaxime with albumin", "Treats the usual gram-negative organisms and reduces the risk of hepatorenal syndrome."],
      ["Large-volume paracentesis alone", "Does not treat infection."],
      ["Oral lactulose only", "Treats hepatic encephalopathy but not the infection."],
      ["Urgent laparotomy", "SBP is a medical, not surgical, condition unless secondary peritonitis is suspected."],
      ["Observation until culture results", "A neutrophil count of 250 cells/uL or more mandates empiric therapy."],
    ], 0,
    "An ascitic fluid polymorphonuclear count of at least 250 cells/uL diagnoses spontaneous bacterial peritonitis, even before the culture result. Empiric third-generation cephalosporin therapy and intravenous albumin on days 1 and 3 reduce renal failure and mortality. Survivors need secondary prophylaxis, typically with a quinolone.",
    ["hepatology", "infectious disease"], "Ascitic neutrophils of 250 or more per uL: treat SBP with cephalosporin plus albumin."),
  s2("Surgery", "Trauma resuscitation", "moderate",
    "A 30-year-old man is brought in after a motor vehicle collision. He is dyspneic with absent breath sounds on the left, distended neck veins, tracheal deviation to the right and a blood pressure of 76/40 mm Hg. What is the next step?",
    [
      ["Immediate needle decompression of the left chest", "Tension pneumothorax is a clinical diagnosis that requires immediate decompression, followed by chest tube."],
      ["Obtain a portable chest radiograph", "Delays lifesaving treatment."],
      ["Perform a pericardiocentesis", "Tamponade would not produce unilateral absent breath sounds with tracheal deviation."],
      ["Intubate and begin positive-pressure ventilation first", "Positive pressure may worsen a tension pneumothorax."],
      ["Order a CT scan of the chest", "The patient is unstable."],
    ], 0,
    "Hypotension, distended neck veins, unilateral absent breath sounds and tracheal deviation indicate tension pneumothorax. Treat immediately with needle (or finger) decompression, then place a chest tube. Imaging should not delay treatment in an unstable patient.",
    ["trauma", "emergency"], "Tension pneumothorax: decompress first, image later."),
  s2("Surgery", "Biliary tract disease", "moderate",
    "A 68-year-old woman has fever, jaundice and right upper quadrant pain. She is confused, with blood pressure 84/50 mm Hg and heart rate 118/min. Ultrasonography shows a dilated common bile duct with stones. After fluids and intravenous antibiotics, what is the next best step?",
    [
      ["Urgent biliary decompression by ERCP", "Severe ascending cholangitis requires prompt drainage."],
      ["Elective cholecystectomy in 6 weeks", "Does not relieve the obstruction."],
      ["Oral ursodeoxycholic acid", "Not an emergency therapy."],
      ["HIDA scan", "Evaluates cystic duct obstruction and is not appropriate in unstable cholangitis."],
      ["Observation for 48 hours", "Dangerous in septic cholangitis."],
    ], 0,
    "Charcot triad (fever, jaundice, right upper quadrant pain) with hypotension and confusion (Reynolds pentad) indicates severe suppurative cholangitis. Management consists of resuscitation, antibiotics covering enteric gram-negative organisms and anaerobes, and urgent biliary drainage, usually by ERCP with sphincterotomy and stone extraction.",
    ["surgery", "biliary"], "Reynolds pentad: antibiotics plus urgent ERCP drainage."),
  s2("Surgery", "Burns", "moderate",
    "A 70-kg man sustains partial- and full-thickness burns over 40% of his total body surface area from a house fire. Using the Parkland formula, how much lactated Ringer solution should he receive in the first 8 hours after the burn?",
    [
      ["5,600 mL", "Total 24-hour volume is 4 mL x 70 kg x 40 = 11,200 mL; half is given in the first 8 hours."],
      ["2,800 mL", "This is one quarter of the total."],
      ["11,200 mL", "This is the total 24-hour volume."],
      ["8,400 mL", "Incorrect fraction of the calculated total."],
      ["1,400 mL", "Far below the required volume."],
    ], 0,
    "The Parkland formula estimates 4 mL of crystalloid per kg per percent of body surface area burned over 24 hours, with half given in the first 8 hours from the time of injury and the remainder over the next 16 hours. Infusion rates are then titrated to urine output of about 0.5 mL/kg/h in adults.",
    ["surgery", "burns", "calculation"], "Parkland: 4 x kg x %TBSA, half in the first 8 hours."),
  s2("Surgery", "Abdominal aortic aneurysm", "moderate",
    "A 72-year-old man with hypertension and a 40-pack-year smoking history develops sudden severe abdominal and back pain and syncope. His blood pressure is 70/40 mm Hg, and there is a pulsatile abdominal mass. What is the most appropriate management?",
    [
      ["Immediate transfer to the operating room for repair", "A ruptured aneurysm with hemodynamic instability needs emergent surgical or endovascular repair."],
      ["CT angiography before any intervention", "Appropriate only in stable patients."],
      ["Observation with serial ultrasonography", "Not appropriate for rupture."],
      ["Intravenous antihypertensives to lower the blood pressure to normal", "Aggressive treatment worsens hypoperfusion; permissive hypotension is used."],
      ["Colonoscopy to exclude ischemic colitis", "Unrelated to this emergency."],
    ], 0,
    "Hypotension, abdominal or back pain and a pulsatile mass indicate ruptured abdominal aortic aneurysm. Unstable patients go straight to the operating room, with permissive hypotension and blood product resuscitation, since delays for imaging increase mortality.",
    ["surgery", "vascular", "emergency"], "Unstable suspected AAA rupture: straight to the OR."),
  s2("Pediatrics", "Kawasaki disease", "moderate",
    "A 3-year-old boy has had fever for 6 days with bilateral nonexudative conjunctivitis, cracked red lips, a polymorphous rash, swollen hands and a 2-cm cervical lymph node. Which treatment is most appropriate?",
    [
      ["Intravenous immunoglobulin and aspirin", "Reduces the incidence of coronary artery aneurysms."],
      ["Oral amoxicillin", "Not useful for Kawasaki disease."],
      ["Intravenous penicillin G for presumed scarlet fever", "The picture is not consistent with streptococcal disease."],
      ["Oral prednisone alone", "Steroids are not first-line, used adjunctively in high-risk cases."],
      ["Supportive care and discharge", "Untreated disease carries a high risk of coronary aneurysm."],
    ], 0,
    "Kawasaki disease is a medium-vessel vasculitis diagnosed by fever lasting at least 5 days plus four of five features: conjunctival injection, oral changes, rash, extremity changes and cervical lymphadenopathy. IVIG within 10 days and aspirin lower the risk of coronary aneurysm. Echocardiography is required at diagnosis.",
    ["pediatrics", "vasculitis"], "Fever 5+ days with CRASH features: IVIG and aspirin, echo."),
  s2("Pediatrics", "Neonatal jaundice", "easy",
    "A term newborn is noted to be jaundiced at 16 hours of age. The mother is blood group O Rh-positive. Total bilirubin is 9 mg/dL with a normal direct fraction. Which test is most useful next?",
    [
      ["Infant blood type and direct Coombs test", "Jaundice in the first 24 hours is pathologic until proven otherwise, and ABO incompatibility is a common cause."],
      ["Observation without testing", "Early jaundice is not physiologic."],
      ["Hepatobiliary scintigraphy", "Used for suspected biliary atresia with direct hyperbilirubinemia."],
      ["TORCH serology only", "Is considered when hepatosplenomegaly or other signs are present."],
      ["Liver biopsy", "Not indicated."],
    ], 0,
    "Hyperbilirubinemia in the first 24 hours indicates hemolysis until proven otherwise; the mother's type O blood makes ABO incompatibility likely. Evaluate with blood types, direct Coombs test, hemoglobin and reticulocyte count, and start phototherapy according to age-specific nomograms.",
    ["pediatrics", "neonatology"], "Jaundice in first 24 hours: look for hemolysis."),
  s2("Pediatrics", "Febrile neonate", "difficult",
    "A 21-day-old boy born at term has a rectal temperature of 38.4 C. He is feeding well and appears active. Which is the most appropriate management?",
    [
      ["Hospital admission, blood, urine and CSF cultures and empiric intravenous antibiotics", "Febrile neonates are at high risk of invasive bacterial infection and need a full evaluation."],
      ["Reassurance and outpatient follow-up in 48 hours", "Unsafe at this age."],
      ["Oral amoxicillin and home observation", "Inadequate coverage and inadequate evaluation."],
      ["Chest radiograph only", "Does not exclude sepsis or meningitis."],
      ["Acetaminophen and recheck temperature", "Treating the fever without evaluation can miss serious infection."],
    ], 0,
    "In infants under about 28 days, fever is considered serious infection until proven otherwise because they may look well while having bacteremia or meningitis. The standard approach includes blood, urine and cerebrospinal fluid studies and empiric antibiotics (with acyclovir when herpes simplex is suspected) in the hospital.",
    ["pediatrics", "infectious disease"], "Fever of 38.0 C or higher in a young neonate means full sepsis workup and admission."),
  s2("Pediatrics", "Cystic fibrosis", "moderate",
    "A newborn has failure to pass meconium in the first 48 hours with abdominal distension and bilious vomiting. A contrast enema shows microcolon with inspissated meconium. Which test is the most appropriate for the likely underlying diagnosis?",
    [
      ["Sweat chloride test", "Meconium ileus is strongly associated with cystic fibrosis."],
      ["Rectal suction biopsy", "Used to diagnose Hirschsprung disease."],
      ["Karyotype", "Not indicated."],
      ["Serum TSH", "Congenital hypothyroidism causes prolonged jaundice and constipation, not meconium ileus."],
      ["Upper GI series", "Used to diagnose malrotation."],
    ], 0,
    "Meconium ileus occurs in a minority of newborns with cystic fibrosis. Diagnosis is confirmed by elevated sweat chloride (or genetic testing for CFTR). Other manifestations include recurrent pulmonary infections, pancreatic insufficiency, rectal prolapse and infertility in males due to absent vas deferens.",
    ["pediatrics", "genetics"], "Meconium ileus: think cystic fibrosis; sweat chloride confirms."),
  s2("Obstetrics and Gynecology", "Postpartum hemorrhage", "moderate",
    "A 30-year-old woman had a vaginal delivery of a 4.3-kg infant after an oxytocin-augmented labor. The placenta delivered intact. Thirty minutes later she has brisk vaginal bleeding, a boggy uterus and a pulse of 118/min. What is the best initial management?",
    [
      ["Bimanual uterine massage and intravenous oxytocin", "Uterine atony is the most common cause and is treated first with massage and uterotonics."],
      ["Immediate hysterectomy", "Reserved for refractory bleeding."],
      ["Methylergonovine in this patient if she has hypertension", "Contraindicated in hypertension, and not the first step."],
      ["Observation and repeat examination in 1 hour", "Delay risks massive hemorrhage."],
      ["Intravenous antibiotics only", "Does not address the bleeding."],
    ], 0,
    "A boggy uterus after delivery of a large infant with prolonged oxytocin exposure is typical of atony. Begin uterine massage, oxytocin, and volume resuscitation; escalate to methylergonovine (avoid in hypertension), carboprost (avoid in asthma), misoprostol, tranexamic acid, balloon tamponade and surgery as needed. Check for retained tissue and lacerations.",
    ["obstetrics", "emergency"], "Postpartum hemorrhage: think four Ts, start with massage and oxytocin for atony."),
  s2("Obstetrics and Gynecology", "Gestational diabetes", "easy",
    "A 29-year-old woman at 26 weeks' gestation has had an uncomplicated pregnancy. She has no personal history of diabetes. Which test is the most appropriate screening for gestational diabetes?",
    [
      ["Glucose challenge test with a 50-g oral glucose load", "Standard universal screening at 24 to 28 weeks."],
      ["Hemoglobin A1c at each prenatal visit", "Not recommended for routine screening in pregnancy."],
      ["Urine dipstick for glucose", "Poorly sensitive."],
      ["Random glucose at 36 weeks", "Too late."],
      ["No screening is needed without risk factors", "Universal screening is recommended."],
    ], 0,
    "Universal screening for gestational diabetes occurs at 24 to 28 weeks. A one-step 75-g fasting test or a two-step approach (50-g challenge followed by a 100-g test if positive) is used. Women with risk factors may be screened earlier. Treatment is diet, glucose monitoring and insulin if needed.",
    ["obstetrics", "endocrine", "screening"], "Screen all pregnant women for gestational diabetes at 24-28 weeks."),
  s2("Obstetrics and Gynecology", "Abnormal uterine bleeding", "easy",
    "A 56-year-old woman who underwent menopause 5 years ago reports spotting for 3 weeks. She has obesity and hypertension and takes no hormones. What is the most appropriate next step?",
    [
      ["Endometrial biopsy or transvaginal ultrasonography to assess endometrial thickness", "Postmenopausal bleeding requires evaluation for endometrial cancer."],
      ["Reassurance because bleeding after menopause is common", "Always requires evaluation."],
      ["Start oral contraceptive pills", "Treating bleeding without evaluation could delay the diagnosis of cancer."],
      ["Repeat Pap smear only", "A Pap test does not evaluate the endometrium."],
      ["Pelvic MRI as the first test", "Not first-line."],
    ], 0,
    "Any postmenopausal bleeding should prompt evaluation for endometrial carcinoma, particularly with risk factors such as obesity (peripheral estrogen), diabetes and unopposed estrogen. Endometrial sampling is the diagnostic test; a thin endometrium on transvaginal ultrasonography may allow initial observation.",
    ["gynecology", "oncology"], "Postmenopausal bleeding is endometrial cancer until proven otherwise."),
  s2("Obstetrics and Gynecology", "Preterm labor", "moderate",
    "A 24-year-old woman at 30 weeks' gestation has regular contractions every 5 minutes. Cervical examination shows 3 cm dilation and 80% effacement. Membranes are intact. Fetal heart rate tracing is reassuring. Which intervention most improves neonatal outcomes?",
    [
      ["Antenatal corticosteroids", "Accelerate fetal lung maturation and reduce respiratory distress, intraventricular hemorrhage and death."],
      ["Strict bed rest at home", "Not effective in preventing preterm birth."],
      ["Oral antibiotics to prolong pregnancy", "Not indicated with intact membranes."],
      ["Immediate cesarean delivery", "Not required for preterm labor with reassuring status."],
      ["Intravenous fluids alone", "Hydration does not stop preterm labor."],
    ], 0,
    "For women in preterm labor between about 24 and 34 weeks, give antenatal corticosteroids (betamethasone) to enhance fetal lung maturity. Magnesium sulfate before 32 weeks provides neuroprotection, tocolysis is only used short-term to allow steroids to act, and group B streptococcus prophylaxis is given if delivery is imminent.",
    ["obstetrics", "neonatal outcomes"], "Preterm labor: steroids, magnesium for neuroprotection, GBS prophylaxis."),
  s2("Psychiatry", "Serotonin syndrome", "moderate",
    "A 42-year-old woman taking sertraline is started on linezolid for a skin infection. Two days later she is agitated, diaphoretic and has diarrhea. Temperature is 38.9 C, pupils are dilated, and examination reveals hyperreflexia and inducible ankle clonus. What is the best management?",
    [
      ["Discontinue the serotonergic agents, give benzodiazepines and consider cyproheptadine", "Removes the precipitant and treats agitation and neuromuscular excitation."],
      ["Give dantrolene and bromocriptine", "Treats neuroleptic malignant syndrome, which has bradyreflexia and rigidity."],
      ["Increase the sertraline dose", "Would worsen toxicity."],
      ["Start haloperidol", "Dopamine antagonists can worsen autonomic instability and are not first-line."],
      ["Administer physostigmine", "Used for anticholinergic toxicity."],
    ], 0,
    "Serotonin syndrome features autonomic instability, neuromuscular hyperactivity (clonus, hyperreflexia) and mental status changes, usually within hours of starting or combining serotonergic agents such as SSRIs and linezolid. Treat by stopping the agents, supportive care, benzodiazepines, and cyproheptadine (5-HT2A antagonist) if moderate or severe.",
    ["psychiatry", "toxicology"], "Clonus and hyperreflexia with serotonergic drugs: serotonin syndrome, treat with cyproheptadine."),
  s2("Psychiatry", "Alcohol withdrawal", "moderate",
    "A 52-year-old man with alcohol use disorder is hospitalized for pneumonia. On hospital day 3 he is disoriented, seeing insects on the wall and has a temperature of 38.2 C, pulse 124/min and coarse tremor. What is the most appropriate treatment?",
    [
      ["Intravenous benzodiazepines titrated to symptoms", "First-line therapy for alcohol withdrawal and delirium tremens, reducing seizures and mortality."],
      ["Haloperidol monotherapy", "Lowers the seizure threshold and does not prevent complications."],
      ["Phenytoin", "Not effective for withdrawal seizures."],
      ["Intravenous ethanol infusion", "Not recommended."],
      ["Clonidine alone", "May mask autonomic signs but does not prevent seizures or delirium."],
    ], 0,
    "Delirium tremens occurs 48 to 96 hours after the last drink and combines agitation, hallucinations, autonomic instability and fever. Treatment is aggressive benzodiazepine dosing (lorazepam in liver disease), thiamine before glucose, fluids, and electrolyte repletion. Antipsychotics may be added only as adjuncts.",
    ["psychiatry", "substance use"], "Delirium tremens: benzodiazepines plus thiamine."),
  s2("Psychiatry", "Anorexia nervosa", "difficult",
    "A 17-year-old girl with anorexia nervosa (BMI 14.5 kg/m2) is admitted and nutritional rehabilitation is started. On day 3 she becomes weak and develops edema and palpitations. Which laboratory abnormality is most likely?",
    [
      ["Hypophosphatemia", "Refeeding promotes insulin-driven cellular uptake of phosphate, potassium and magnesium."],
      ["Hyperphosphatemia", "Opposite of the expected finding."],
      ["Hypernatremia", "Not typical."],
      ["Hypercalcemia", "Not typical."],
      ["Hyperglycemia with ketosis", "Not characteristic."],
    ], 0,
    "Refeeding syndrome follows reintroduction of nutrition in a starved patient: insulin surges drive phosphate, potassium and magnesium into cells, producing hypophosphatemia and potentially cardiac failure, arrhythmias and respiratory failure. Prevent with slow calorie advancement, thiamine and frequent electrolyte monitoring.",
    ["psychiatry", "nutrition"], "Refeeding syndrome: low phosphate, potassium and magnesium after starting feeds."),
  s2("Neurology", "Status epilepticus", "easy",
    "A 25-year-old woman is brought in by ambulance after a generalized tonic-clonic seizure lasting 12 minutes that is still ongoing. Her airway is protected and IV access is obtained. Which medication is the most appropriate first-line treatment?",
    [
      ["Intravenous lorazepam", "Benzodiazepines are first-line for status epilepticus."],
      ["Intravenous phenytoin as the first agent", "Second-line, after a benzodiazepine."],
      ["Oral carbamazepine", "Not appropriate during active seizure."],
      ["Intravenous haloperidol", "Not an anticonvulsant."],
      ["Intravenous acetazolamide", "Not used."],
    ], 0,
    "Status epilepticus (a seizure over about 5 minutes) is a medical emergency. Give a benzodiazepine first (IV lorazepam, or IM midazolam if no IV access), then a second-line agent such as levetiracetam, fosphenytoin or valproate if seizures continue. Check glucose and electrolytes and treat the cause.",
    ["neurology", "emergency"], "Status epilepticus: benzodiazepine first, then levetiracetam, fosphenytoin or valproate."),
  s2("Neurology", "Subarachnoid hemorrhage", "moderate",
    "A 45-year-old woman develops a sudden, severe headache described as the worst of her life while lifting weights. She has neck stiffness but no focal deficits. What is the most appropriate next step?",
    [
      ["Noncontrast CT of the head", "Highly sensitive in the first hours after subarachnoid hemorrhage."],
      ["Lumbar puncture before any imaging", "Imaging first to exclude mass effect; LP is used if CT is negative and suspicion remains."],
      ["MRI of the cervical spine", "Not indicated."],
      ["Oral sumatriptan", "Triptans are contraindicated if hemorrhage is suspected."],
      ["Discharge on analgesics", "Dangerous."],
    ], 0,
    "Thunderclap headache requires emergency evaluation for subarachnoid hemorrhage, most often from a ruptured saccular aneurysm. Noncontrast head CT is the first test; if negative and suspicion persists, lumbar puncture looks for xanthochromia. Confirmed bleeding is followed by vascular imaging, blood pressure control, nimodipine and aneurysm securing.",
    ["neurology", "emergency"], "Thunderclap headache: noncontrast CT first, LP if CT negative."),
  s2("Neurology", "Guillain-Barre syndrome", "moderate",
    "A 34-year-old man has ascending symmetric leg weakness and areflexia that has progressed over 4 days, starting 2 weeks after a diarrheal illness. Cerebrospinal fluid shows protein of 120 mg/dL and 2 cells/uL. What is the most important aspect of monitoring?",
    [
      ["Serial forced vital capacity and negative inspiratory force", "Respiratory muscle failure is the major cause of death."],
      ["Daily serum creatine kinase", "Not useful."],
      ["Repeated lumbar punctures", "Not needed."],
      ["Weekly brain MRI", "Not indicated."],
      ["Serum acetylcholine receptor antibodies", "Used in myasthenia gravis."],
    ], 0,
    "Guillain-Barre syndrome is an acute inflammatory demyelinating polyneuropathy often following Campylobacter jejuni or viral infection, with albuminocytologic dissociation in the CSF. Monitor forced vital capacity and autonomic function in a unit able to intubate, and treat with IVIG or plasma exchange; steroids are not helpful.",
    ["neurology", "neuromuscular"], "GBS: monitor FVC, treat with IVIG or plasma exchange."),
  s2("Emergency Medicine", "Acetaminophen overdose", "moderate",
    "A 19-year-old woman is brought in 6 hours after ingesting a large quantity of acetaminophen tablets in a suicide attempt. She is asymptomatic. Serum acetaminophen concentration plotted on the Rumack-Matthew nomogram is above the treatment line. What is the next best step?",
    [
      ["Intravenous N-acetylcysteine", "Replenishes glutathione and prevents hepatotoxicity, ideally started within 8 hours."],
      ["Observation and repeat labs in 24 hours", "Delay risks liver failure."],
      ["Flumazenil", "Reverses benzodiazepines."],
      ["Fomepizole", "Antidote for toxic alcohols."],
      ["Hemodialysis immediately", "Reserved for massive overdose with acidosis and severe toxicity."],
    ], 0,
    "Acetaminophen is metabolized to the toxic metabolite NAPQI, which is detoxified by glutathione; overdose depletes glutathione. N-acetylcysteine replenishes it and is most effective within 8 hours. The nomogram interprets a 4-hour or later level from a single acute ingestion. Patients are asymptomatic initially, with liver injury peaking at 72 to 96 hours.",
    ["toxicology", "emergency"], "Acetaminophen above the treatment line: N-acetylcysteine."),
  s2("Emergency Medicine", "Carbon monoxide poisoning", "moderate",
    "A family of four presents in winter with headache, nausea and dizziness. They had been using a gas space heater in a poorly ventilated room. The 45-year-old father is confused. Pulse oximetry reads 99% on room air. What is the most appropriate immediate treatment?",
    [
      ["100% oxygen by non-rebreather mask", "Reduces carboxyhemoglobin half-life from hours to about an hour or less."],
      ["Oxygen by nasal cannula at 2 L/min", "Inadequate."],
      ["Intravenous methylene blue", "Treats methemoglobinemia."],
      ["Sodium nitrite", "Used for cyanide poisoning and would worsen oxygen carrying capacity."],
      ["Observation without treatment, since oxygen saturation is normal", "Standard oximetry cannot distinguish carboxyhemoglobin from oxyhemoglobin."],
    ], 0,
    "Carbon monoxide binds hemoglobin with high affinity and shifts the oxyhemoglobin curve left, impairing oxygen delivery while standard pulse oximetry reads falsely normal. Diagnose with co-oximetry, treat with 100% oxygen, and consider hyperbaric oxygen for neurologic deficits, syncope, cardiac ischemia or pregnancy.",
    ["toxicology", "environmental"], "Normal SpO2 does not exclude carbon monoxide poisoning; give 100% oxygen."),
  s2("Emergency Medicine", "Heat stroke", "moderate",
    "A 22-year-old marathon runner collapses at mile 20. Rectal temperature is 41.2 C, and he is confused and combative with hot, flushed skin. Which is the most appropriate immediate intervention?",
    [
      ["Rapid whole-body cooling, such as cold-water immersion", "Reducing the core temperature quickly is the key determinant of outcome."],
      ["Oral acetaminophen", "Antipyretics are ineffective because the set point is not changed."],
      ["Intravenous dantrolene", "Not proven for heat stroke."],
      ["Observation in the shade with oral fluids", "Inadequate."],
      ["Cooling only after laboratory results return", "Delay worsens organ damage."],
    ], 0,
    "Exertional heat stroke is hyperthermia with central nervous system dysfunction. Begin aggressive cooling immediately (ice-water immersion is most effective), then manage complications such as rhabdomyolysis, acute kidney injury, hepatic injury and coagulopathy. Antipyretics are not effective.",
    ["emergency", "environmental"], "Heat stroke: cool first and cool fast."),
  s2("Preventive Medicine", "Colorectal cancer screening", "easy",
    "A 52-year-old man with no symptoms or family history of colorectal cancer asks about screening. Which of the following is an appropriate strategy?",
    [
      ["Colonoscopy every 10 years", "Accepted screening option for average-risk adults."],
      ["Annual digital rectal examination", "Not an adequate screening test."],
      ["Serum CEA every year", "Not recommended for screening."],
      ["Colonoscopy every 3 years", "Excessive for average risk without polyps."],
      ["No screening until age 65", "Screening is recommended earlier."],
    ], 0,
    "Average-risk adults should begin colorectal cancer screening at 45 years of age. Options include colonoscopy every 10 years, annual fecal immunochemical testing, stool DNA testing every 1 to 3 years, CT colonography every 5 years or flexible sigmoidoscopy every 5 years. Positive stool tests need colonoscopy.",
    ["preventive", "screening", "oncology"], "Average-risk colorectal screening starts at 45; colonoscopy every 10 years is one option."),
  s2("Preventive Medicine", "Immunization in pregnancy", "easy",
    "A 28-year-old woman at 30 weeks' gestation asks which vaccines she should receive. She has never had a pertussis booster as an adult. Which is the most appropriate recommendation?",
    [
      ["Tdap vaccine now, with each pregnancy", "Recommended at 27 to 36 weeks of every pregnancy to protect the newborn."],
      ["Measles, mumps and rubella vaccine", "Live vaccine, contraindicated in pregnancy."],
      ["Varicella vaccine", "Live vaccine, contraindicated in pregnancy."],
      ["Defer all vaccines until after delivery", "Tdap and influenza are recommended during pregnancy."],
      ["Live attenuated intranasal influenza vaccine", "Contraindicated in pregnancy; inactivated vaccine is used."],
    ], 0,
    "Tdap is given between 27 and 36 weeks (ideally early in that window) in every pregnancy so that maternal antibodies cross the placenta and protect the infant until it can be vaccinated. Inactivated influenza vaccine is also recommended; live vaccines (MMR, varicella, intranasal influenza) are avoided.",
    ["preventive", "immunization", "obstetrics"], "Tdap each pregnancy at 27-36 weeks; no live vaccines."),
  s2("Preventive Medicine", "Smoking cessation", "moderate",
    "A 45-year-old man who smokes one pack of cigarettes daily says he is ready to quit. He has no psychiatric history or seizure disorder. Which approach has the best evidence for achieving abstinence?",
    [
      ["Pharmacotherapy such as varenicline or combination nicotine replacement plus behavioral counseling", "The combination of medication and counseling is more effective than either alone."],
      ["Counseling alone, without medication", "Less effective than the combination."],
      ["Gradually switching to e-cigarettes as first-line therapy", "Not a first-line treatment recommended by guidelines."],
      ["Advising him to wait until stressors resolve", "Delays an opportunity."],
      ["Prescribing a benzodiazepine for cravings", "Not indicated."],
    ], 0,
    "Brief advice at every visit plus pharmacotherapy and counseling is the evidence-based approach. First-line agents are varenicline, bupropion and nicotine replacement (combination patch plus short-acting form is superior to a single product). Offer follow-up and relapse-prevention support.",
    ["preventive", "behavioral"], "Smoking cessation: medication plus counseling beats either alone."),
];

const s2n = note("usmle-step-2-ck");
const S2_M: SeedMaterial[] = [
  s2n("Internal Medicine", "Cirrhosis complications", "Cirrhosis: Complications and Their Management", "Portal hypertension, ascites, SBP, encephalopathy, varices and hepatorenal syndrome in a single framework.", 7, `
# Cirrhosis: Complications and Management

Cirrhosis converts a patient into a chronic problem list. Recognizing each complication and its first-line therapy is a core Step 2 CK skill.

## Portal hypertension
- **Ascites:** a serum-ascites albumin gradient (SAAG) of 1.1 g/dL or more indicates portal hypertension. Treat with sodium restriction and spironolactone plus furosemide. Large-volume paracentesis needs albumin.
- **Varices:** screen with endoscopy; prevent first bleeding with a nonselective beta-blocker (propranolol, nadolol, carvedilol) or band ligation.
- **Acute variceal bleed:** resuscitate, octreotide, antibiotics, urgent endoscopy with banding. TIPS for refractory bleeding.

## Spontaneous bacterial peritonitis (SBP)
- Suspect in any cirrhotic with ascites and fever, abdominal pain, encephalopathy or kidney injury.
- Diagnose by ascitic **neutrophils of 250/uL or more**; treat with a third-generation cephalosporin plus albumin.
- Give secondary prophylaxis to survivors.

## Hepatic encephalopathy
- Precipitants: infection, GI bleeding, constipation, sedatives, hypokalemia, dehydration, noncompliance.
- Treatment: correct precipitant, **lactulose**, add **rifaximin** to prevent recurrence.
- Asterixis is a classic sign, and ammonia level is rarely needed.

## Hepatorenal syndrome
- Functional kidney injury due to splanchnic vasodilation and renal vasoconstriction in advanced cirrhosis.
- Diagnosis of exclusion: no response to volume expansion with albumin, no shock, no nephrotoxins, no structural kidney disease.
- Treat with albumin plus vasoconstrictors (terlipressin, or norepinephrine); transplant is definitive.

## Other points
- **Hepatocellular carcinoma:** surveillance with ultrasonography with or without AFP every 6 months.
- **Coagulopathy:** INR reflects reduced synthesis; vitamin K does not correct it if the liver is the cause.
- **Avoid:** NSAIDs, benzodiazepines, and aminoglycosides.

## Prognosis
Child-Pugh class and MELD score estimate prognosis and guide transplant evaluation.

> **High-yield / exam traps:** Ascitic neutrophils of 250 or more means treat immediately, before the culture result. Propranolol is for prevention; octreotide is for acute bleeding. Hepatorenal syndrome does not respond to simple fluid challenge.
`),
  s2n("Surgery", "Trauma resuscitation", "Trauma: Primary Survey and Shock Recognition", "The ABCDE approach with the life-threatening injuries to find and treat in the primary survey.", 6, `
# Trauma: Primary Survey and Shock

Trauma is managed by **treating the greatest threat to life first** using ABCDE, performing assessment and treatment simultaneously.

## ABCDE
- **A (airway with cervical spine protection):** give oxygen; secure the airway if the patient cannot protect it or has expanding neck hematoma, burns of the face or airway edema.
- **B (breathing):** look for tension pneumothorax, open pneumothorax, massive hemothorax and flail chest.
- **C (circulation with hemorrhage control):** two large-bore IVs, direct pressure, early blood products, pelvic binder for unstable pelvis.
- **D (disability):** Glasgow Coma Scale, pupils, glucose.
- **E (exposure and environmental control):** undress and prevent hypothermia.

## Immediately life-threatening injuries
| Injury | Key signs | Treatment |
|---|---|---|
| Tension pneumothorax | Hypotension, distended neck veins, absent unilateral breath sounds, tracheal deviation | Needle decompression then chest tube |
| Massive hemothorax | Shock, dullness, absent breath sounds, flat neck veins | Large-bore chest tube, blood, surgery if large initial output |
| Cardiac tamponade | Beck triad (hypotension, distended neck veins, muffled heart sounds), pulsus paradoxus | Pericardiocentesis or thoracotomy |
| Open pneumothorax | Sucking chest wound | Three-sided occlusive dressing, chest tube |
| Flail chest | Paradoxical movement | Analgesia, oxygen, ventilation if needed |

## Hemorrhagic shock classes
- Class I: under 15% blood loss, vital signs normal.
- Class II: 15-30%, tachycardia, narrowed pulse pressure.
- Class III: 30-40%, hypotension, tachypnea, confusion.
- Class IV: over 40%, life-threatening, minimal urine output.

## Adjuncts
- **FAST** examination detects intraperitoneal fluid or pericardial effusion; unstable blunt trauma patients with positive FAST need laparotomy.
- Stable patients proceed to CT.
- **Massive transfusion** with balanced ratios of red cells, plasma and platelets; consider tranexamic acid early.

## Special situations
- Penetrating abdominal trauma with peritonitis or hemodynamic instability goes to the operating room.
- Foley catheters are contraindicated with blood at the meatus or high-riding prostate until urethral injury is excluded.

> **High-yield / exam traps:** Tension pneumothorax and cardiac tamponade both cause shock with distended neck veins; breath sounds and trachea differentiate them. Do not delay decompression for imaging. In pregnancy, place a patient in left lateral tilt after 20 weeks.
`),
  s2n("Pediatrics", "Neonatal jaundice", "Neonatal Jaundice: Physiologic or Pathologic?", "Timing, causes and treatment of unconjugated and conjugated hyperbilirubinemia in newborns.", 6, `
# Neonatal Jaundice

Most newborns develop some jaundice, but **timing** separates the benign from the dangerous.

## By timing of onset
- **First 24 hours:** always pathologic. Think hemolysis: ABO or Rh incompatibility, G6PD deficiency, spherocytosis, sepsis, congenital infection.
- **Days 2 to 5:** physiologic jaundice of term infants peaks around day 3 to 5 because of high red cell turnover, immature conjugation and enterohepatic circulation.
- **After the first week:** breast milk jaundice (benign, can last several weeks), but also consider infection, hypothyroidism, galactosemia and biliary atresia.
- **Breastfeeding jaundice:** early, due to inadequate intake; encourage frequent feeding.

## Unconjugated versus conjugated
- **Unconjugated:** can cross the blood-brain barrier and cause kernicterus (bilirubin-induced neurologic dysfunction): lethargy, hypotonia, high-pitched cry, opisthotonos, later athetoid cerebral palsy, hearing loss and gaze palsy.
- **Conjugated (direct) hyperbilirubinemia** is never physiologic. Think biliary atresia, neonatal hepatitis, choledochal cyst, TPN cholestasis and metabolic disease. Pale stools and dark urine are clues.

## Work-up
- Total and direct bilirubin, blood types, direct Coombs test, complete blood count with smear, reticulocyte count.
- Risk-based nomograms plot bilirubin against hours of life to decide whether to start phototherapy.
- For direct hyperbilirubinemia: ultrasonography, hepatobiliary scintigraphy, early referral. **Biliary atresia** is time-sensitive; the Kasai portoenterostomy is best performed before about 2 months of age.

## Treatment
- **Phototherapy** converts bilirubin to water-soluble isomers excreted without conjugation.
- **Exchange transfusion** for severe hyperbilirubinemia or signs of acute bilirubin encephalopathy.
- Treat the cause: IVIG may be used in isoimmune hemolysis.
- Phototherapy complications: loose stools, skin rash, dehydration, bronze baby syndrome (in cholestasis).

> **High-yield / exam traps:** Direct hyperbilirubinemia is always pathologic and mandates an urgent biliary evaluation. Rh disease requires a mother who is Rh-negative and a previous sensitization; ABO incompatibility occurs in first pregnancies with a type O mother.
`),
  s2n("Obstetrics and Gynecology", "Third trimester bleeding", "Third-Trimester Bleeding: Previa, Abruption and Beyond", "Differentiate painless from painful bleeding and know the first steps and pitfalls.", 6, `
# Third-Trimester Bleeding

## Placenta previa
- **Painless, bright red** vaginal bleeding after 20 weeks, often first noted at rest.
- Risk factors: previous cesarean delivery, previous previa, multiparity, multiple gestation, smoking, advanced maternal age.
- **Do not perform a digital cervical examination** until ultrasonography has excluded previa.
- Management: transabdominal then transvaginal ultrasonography, pelvic rest, steroids if preterm, planned **cesarean delivery** at 36 to 37 weeks if previa persists; urgent delivery for heavy bleeding.
- Associated with placenta accreta spectrum, especially after prior cesareans.

## Placental abruption
- **Painful** vaginal bleeding with a tender, firm uterus, contractions, and fetal distress. The bleeding may be concealed.
- Risk factors: hypertension and preeclampsia, trauma, cocaine, smoking, prior abruption.
- Complications: hemorrhagic shock, disseminated intravascular coagulation, fetal death, Couvelaire uterus.
- Management: resuscitation, two large-bore IVs, type and crossmatch, coagulation studies (fibrinogen), continuous fetal monitoring; expedite delivery (vaginal if stable and fetus alive, cesarean if fetal or maternal compromise).

## Vasa previa
- Painless bleeding at rupture of membranes with **fetal bradycardia** or a sinusoidal pattern; fetal blood vessels cross the cervix.
- Fetal blood loss is rapid; emergent cesarean delivery.

## Uterine rupture
- Previous uterine surgery, labor, oxytocin or trauma. Sudden pain, loss of fetal station, fetal heart abnormalities, and maternal shock.

## Differentiating features
| Feature | Previa | Abruption |
|---|---|---|
| Pain | Painless | Painful |
| Uterine tone | Soft | Firm, tender |
| Fetal heart | Usually normal | Often abnormal |
| DIC | Rare | Common |

## Rh and trauma
Administer Rh immune globulin to Rh-negative women with bleeding, and use the Kleihauer-Betke test to determine the dose needed after fetomaternal hemorrhage.

> **High-yield / exam traps:** The bimanual or speculum digital examination in an undiagnosed bleeder can cause catastrophic hemorrhage; ultrasonography comes first. Abruption is a clinical diagnosis; a normal ultrasonogram does not exclude it.
`),
  s2n("Emergency Medicine", "Toxicology", "Toxicology: Antidotes and Key Syndromes", "A quick-reference guide to the common poisonings and the antidote or specific therapy for each.", 7, `
# Toxicology Quick Reference

Begin every overdose with **airway, breathing, circulation, glucose and an ECG**, then ask whether a specific antidote exists.

## Antidote table
| Toxin | Antidote or specific therapy |
|---|---|
| Acetaminophen | N-acetylcysteine |
| Opioids | Naloxone |
| Benzodiazepines | Flumazenil (rarely used; risk of seizures) |
| Organophosphates | Atropine plus pralidoxime |
| Digoxin | Digoxin-specific Fab fragments |
| Methanol, ethylene glycol | Fomepizole, with dialysis for severe cases |
| Iron | Deferoxamine |
| Lead | Succimer, EDTA, dimercaprol (for encephalopathy) |
| Carbon monoxide | 100% oxygen, hyperbaric oxygen in severe cases |
| Cyanide | Hydroxocobalamin |
| Beta-blocker | Glucagon |
| Calcium channel blocker | Calcium, high-dose insulin and glucose |
| Tricyclic antidepressants | Sodium bicarbonate for QRS widening |
| Heparin | Protamine |
| Warfarin | Vitamin K, prothrombin complex concentrate |
| Salicylates | Bicarbonate alkalinization; hemodialysis for severe toxicity |
| Anticholinergics | Physostigmine in selected cases |
| Methemoglobinemia | Methylene blue |

## Toxidromes
- **Anticholinergic:** hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter.
- **Cholinergic:** diarrhea, urination, miosis, bronchorrhea, bradycardia, emesis, lacrimation, salivation.
- **Sympathomimetic:** agitation, tachycardia, hypertension, diaphoresis, mydriasis.
- **Opioid:** miosis, respiratory depression, decreased consciousness.
- **Sedative-hypnotic:** sedation with normal pupils.
- **Serotonin syndrome:** clonus, hyperreflexia, hyperthermia.

## Decontamination
Activated charcoal is considered within about an hour of ingestion for many substances, but does not bind metals such as lithium and iron, or alcohols. Do not induce vomiting.

## Special points
- Salicylate toxicity: tinnitus, tachypnea, mixed respiratory alkalosis and anion-gap metabolic acidosis.
- Toxic alcohols: anion-gap acidosis with an osmolar gap.

> **High-yield / exam traps:** Pulse oximetry is falsely normal in carbon monoxide poisoning and falsely reads about 85% in methemoglobinemia. Do not give flumazenil to a chronic benzodiazepine user or a patient with a mixed overdose of proconvulsant drugs.
`, "guide"),
];

const s2f = fc("usmle-step-2-ck");
const S2_F: SeedFlashcard[] = [
  s2f("Internal Medicine", "Cirrhosis complications", "Initial antibiotic and adjunct for spontaneous bacterial peritonitis?", "A third-generation cephalosporin (e.g., ceftriaxone, cefotaxime) plus IV albumin."),
  s2f("Internal Medicine", "Cirrhosis complications", "First-line therapy for hepatic encephalopathy?", "Lactulose; add rifaximin to prevent recurrence; treat the precipitant."),
  s2f("Internal Medicine", "Acute kidney injury", "FENa in prerenal azotemia versus ATN?", "Below 1% in prerenal azotemia; above 2% in ATN (unless on diuretics, then use FEurea)."),
  s2f("Internal Medicine", "Acute pancreatitis", "Two of three criteria for diagnosing acute pancreatitis?", "Characteristic epigastric pain, lipase or amylase at least 3 times normal, and imaging findings."),
  s2f("Internal Medicine", "COPD exacerbation", "Target oxygen saturation in COPD exacerbation?", "About 88-92% to avoid worsening hypercapnia."),
  s2f("Surgery", "Trauma resuscitation", "Beck triad of cardiac tamponade?", "Hypotension, distended neck veins and muffled heart sounds."),
  s2f("Surgery", "Burns", "State the Parkland formula.", "4 mL x kg x %TBSA of lactated Ringer over 24 h; half in the first 8 h, half in the next 16 h."),
  s2f("Surgery", "Biliary tract disease", "Reynolds pentad adds what to Charcot triad?", "Hypotension and altered mental status, indicating severe cholangitis."),
  s2f("Surgery", "Acute abdomen", "Name the sign in which palpation of the left lower quadrant causes pain in the right lower quadrant in appendicitis.", "Rovsing sign (other signs: psoas, obturator)."),
  s2f("Pediatrics", "Kawasaki disease", "What is the most feared complication of Kawasaki disease?", "Coronary artery aneurysm; treat with IVIG and aspirin and obtain an echocardiogram."),
  s2f("Pediatrics", "Neonatal jaundice", "Which kind of neonatal jaundice is never physiologic?", "Jaundice in the first 24 hours of life and conjugated (direct) hyperbilirubinemia."),
  s2f("Pediatrics", "Febrile neonate", "Management of fever in an infant under about 28 days old?", "Full sepsis workup (blood, urine, CSF), hospital admission and empiric IV antibiotics."),
  s2f("Obstetrics and Gynecology", "Third trimester bleeding", "Painless bright red bleeding in late pregnancy: diagnosis and key precaution?", "Placenta previa; avoid digital cervical examination until ultrasonography excludes it."),
  s2f("Obstetrics and Gynecology", "Preeclampsia", "Drug used to prevent eclamptic seizures?", "Magnesium sulfate (monitor reflexes, respiratory rate and urine output)."),
  s2f("Psychiatry", "Alcohol withdrawal", "Treatment of alcohol withdrawal?", "Benzodiazepines (lorazepam if liver disease) plus thiamine; delirium tremens occurs 48-96 hours after the last drink."),
  s2f("Psychiatry", "Serotonin syndrome", "How do you distinguish serotonin syndrome from neuroleptic malignant syndrome?", "Serotonin syndrome: clonus, hyperreflexia, rapid onset; NMS: lead-pipe rigidity, bradyreflexia, slower onset."),
  s2f("Neurology", "Acute ischemic stroke", "Which imaging should be done first in suspected stroke?", "Noncontrast head CT to exclude hemorrhage before thrombolysis."),
  s2f("Neurology", "Guillain-Barre syndrome", "CSF finding in Guillain-Barre syndrome?", "Albuminocytologic dissociation: high protein with a normal cell count."),
  s2f("Emergency Medicine", "Acetaminophen overdose", "Antidote for acetaminophen overdose and the key window?", "N-acetylcysteine, ideally within 8 hours of ingestion."),
  s2f("Preventive Medicine", "Abdominal aortic aneurysm screening", "Who should be screened for AAA?", "Men aged 65 to 75 who have ever smoked: one-time abdominal ultrasonography."),
];

/* ================================================================== */
/* USMLE STEP 3                                                        */
/* ================================================================== */
const s3 = mk("usmle-step-3");
const FIP = "Foundations of Independent Practice";
const ACM = "Advanced Clinical Medicine";
const BAE = "Biostatistics and Epidemiology";
const PSF = "Patient Safety";
const S3_Q: SeedQuestion[] = [
  s3(FIP, "Community-acquired pneumonia", "easy",
    "A 35-year-old otherwise healthy man has 4 days of fever, productive cough and right basilar crackles. Temperature is 38.4 C, respiratory rate 18/min and oxygen saturation 97% on room air. Chest radiograph shows a right lower lobe infiltrate. He has no recent antibiotic exposure. Which outpatient therapy is most appropriate?",
    [
      ["Amoxicillin or doxycycline", "Recommended monotherapy for healthy adults without comorbidities or risk factors."],
      ["Intravenous vancomycin and piperacillin-tazobactam", "Reserved for severe pneumonia with risk factors for MRSA or Pseudomonas."],
      ["Azithromycin plus ceftriaxone in hospital", "Appropriate for inpatients, not this stable outpatient."],
      ["Oral oseltamivir only", "Not appropriate without influenza and does not treat bacterial pneumonia."],
      ["No antibiotics; supportive care", "Bacterial pneumonia is suggested by the lobar infiltrate and productive cough."],
    ], 0,
    "For healthy outpatients with community-acquired pneumonia, guidelines recommend amoxicillin (or doxycycline, or a macrolide where local resistance is low). Patients with comorbidities receive a beta-lactam plus a macrolide or doxycycline, or a respiratory fluoroquinolone. Severity scores (CURB-65, PSI) guide the site of care.",
    ["pulmonology", "outpatient"], "Healthy outpatient with CAP: amoxicillin or doxycycline."),
  s3(FIP, "Hypertension management", "moderate",
    "A 55-year-old Black man has a repeated clinic blood pressure of 152/96 mm Hg. He has no diabetes, kidney disease or heart failure, and his basic metabolic panel is normal. Lifestyle changes are discussed. Which initial drug therapy is most appropriate?",
    [
      ["A thiazide-type diuretic or a calcium channel blocker", "Guideline first-line options for Black adults without comorbid indications."],
      ["A beta-blocker alone", "Not first-line for uncomplicated hypertension."],
      ["An ACE inhibitor alone", "Less effective as monotherapy in Black patients without compelling indications."],
      ["An alpha-1 blocker", "Not first-line; higher risk of heart failure in trials."],
      ["Clonidine", "Reserved for resistant hypertension."],
    ], 0,
    "Initial therapy for hypertension in most adults is a thiazide-type diuretic, calcium channel blocker, ACE inhibitor or ARB. In Black patients without heart failure or kidney disease, a thiazide or calcium channel blocker is preferred. Stage 2 hypertension often requires two agents from the outset.",
    ["cardiology", "primary care"], "Black adults with hypertension: thiazide or calcium channel blocker first."),
  s3(FIP, "Preoperative evaluation", "moderate",
    "A 68-year-old man who has taken metoprolol for coronary artery disease for 6 years is scheduled for elective inguinal hernia repair next week. He has stable exercise tolerance without angina. What should be done with his beta-blocker?",
    [
      ["Continue metoprolol through the perioperative period", "Abrupt withdrawal increases cardiac events."],
      ["Stop metoprolol 1 week before surgery", "Withdrawal can cause rebound tachycardia and ischemia."],
      ["Stop metoprolol on the morning of surgery only", "Not recommended."],
      ["Replace metoprolol with high-dose clonidine", "No supportive evidence."],
      ["Double the metoprolol dose the night before", "Risks hypotension, bradycardia and stroke."],
    ], 0,
    "Patients on chronic beta-blockers should continue them perioperatively to avoid withdrawal. Initiating high-dose beta-blockers on the day of surgery in patients not already taking them increases stroke and mortality. Cardiac testing is reserved for patients with active conditions or poor functional capacity undergoing elevated-risk procedures when it will change management.",
    ["perioperative", "cardiology"], "Continue chronic beta-blockers perioperatively; do not start high doses on the day of surgery."),
  s3(FIP, "Opioid use disorder", "moderate",
    "A 29-year-old man with opioid use disorder has had two overdoses in the past year and wants treatment. He asks about long-term options. Which approach is the most effective for reducing mortality?",
    [
      ["Maintenance treatment with buprenorphine or methadone", "Medications for opioid use disorder reduce overdose death and relapse."],
      ["Detoxification followed by abstinence-only counseling", "Higher relapse and overdose risk."],
      ["Naltrexone started during active use", "Can precipitate withdrawal and requires prior opioid-free period."],
      ["Benzodiazepine taper", "Not a treatment for opioid use disorder."],
      ["Clonidine alone indefinitely", "Treats withdrawal symptoms only."],
    ], 0,
    "Maintenance agonist therapy with buprenorphine (partial agonist) or methadone (full agonist) lowers overdose mortality and improves retention. Extended-release naltrexone is an option after full detoxification. All patients should receive naloxone and counseling on safer use and linkage to services.",
    ["addiction", "primary care"], "Opioid use disorder: buprenorphine or methadone maintenance, plus naloxone."),
  s3(FIP, "Palliative care", "moderate",
    "A 74-year-old woman with end-stage COPD on home oxygen is admitted with severe dyspnea despite optimized bronchodilators and steroids. Her goals are comfort and avoiding intubation. Which medication is most appropriate to relieve her dyspnea?",
    [
      ["Low-dose oral or parenteral opioid", "Reduces the perception of breathlessness in advanced disease."],
      ["Scheduled benzodiazepine as the sole agent", "Is a second-line adjunct when anxiety is dominant."],
      ["Higher-flow oxygen to saturation 100%", "Not beneficial and may worsen hypercapnia."],
      ["Intravenous methylprednisolone indefinitely", "Long-term steroid exposure has harms."],
      ["Intravenous aminophylline", "Narrow therapeutic index and marginal benefit."],
    ], 0,
    "Opioids are the first-line pharmacologic treatment for refractory dyspnea in advanced lung disease and in dying patients, in low doses titrated to effect. Non-drug measures such as a fan and positioning help. Opioids used for dyspnea do not hasten death when properly dosed.",
    ["palliative", "pulmonology"], "Refractory dyspnea at the end of life: low-dose opioids."),
  s3(FIP, "Transitions of care", "moderate",
    "A 72-year-old man is being discharged after a 5-day admission for decompensated heart failure. His discharge medications include three new drugs. Which intervention is most likely to reduce his 30-day readmission?",
    [
      ["Medication reconciliation, patient education and a follow-up visit within 7 days", "Early follow-up and structured discharge planning reduce readmission."],
      ["Follow-up with the primary physician in 8 weeks", "Too late to detect early decompensation."],
      ["Giving only written instructions without teach-back", "Less effective for comprehension."],
      ["Extending hospitalization for 5 more days", "No evidence of benefit."],
      ["Discharging with no changes to previous home medications", "Risks omitted therapy."],
    ], 0,
    "Readmission after heart failure is reduced by multidisciplinary discharge planning: reconciling medications, teaching about weight monitoring, diet and symptom action plans using teach-back, arranging follow-up within 7 days and home or telephone follow-up, and addressing barriers such as cost and transportation.",
    ["transitions of care", "heart failure"], "Reduce readmission: reconcile medications, teach back, and early follow-up."),
  s3(FIP, "Osteoporosis", "moderate",
    "A 66-year-old woman has a DXA T-score of -2.8 at the femoral neck. She has no history of fracture, normal renal function and adequate vitamin D and calcium intake. Which therapy is the most appropriate initial pharmacologic treatment?",
    [
      ["An oral bisphosphonate such as alendronate", "First-line therapy that reduces vertebral and hip fractures."],
      ["Estrogen replacement therapy", "Not first-line for osteoporosis alone in this age group."],
      ["Calcitonin nasal spray", "Modest efficacy; not first-line."],
      ["Calcium supplementation alone", "Insufficient for treatment of established osteoporosis."],
      ["Observation and repeat DXA in 10 years", "Treatment is indicated at a T-score of -2.5 or lower."],
    ], 0,
    "Treatment is indicated for a T-score at or below -2.5, a fragility fracture, or high fracture risk by FRAX. Oral bisphosphonates are first-line; counsel on taking them fasting with water and remaining upright. Alternatives include denosumab, zoledronic acid and anabolic agents for very high risk.",
    ["endocrine", "geriatrics"], "Osteoporosis (T-score at or below -2.5): bisphosphonate first-line."),
  s3(ACM, "Atrial fibrillation", "moderate",
    "A 74-year-old woman with hypertension and type 2 diabetes is found to have new, asymptomatic nonvalvular atrial fibrillation with a controlled ventricular rate. Her CHA2DS2-VASc score is 4. Which is the most appropriate long-term therapy?",
    [
      ["A direct oral anticoagulant such as apixaban", "Reduces stroke risk and is preferred over warfarin in nonvalvular AF."],
      ["Aspirin alone", "Inadequate stroke prevention."],
      ["No therapy since she is asymptomatic", "Stroke risk is independent of symptoms."],
      ["Amiodarone for rhythm control only", "Does not remove the need for anticoagulation."],
      ["Clopidogrel alone", "Less effective than anticoagulation."],
    ], 0,
    "Anticoagulation is recommended for men with CHA2DS2-VASc of 2 or more and women with 3 or more. DOACs (apixaban, rivaroxaban, dabigatran, edoxaban) are preferred in nonvalvular AF; warfarin is used for mechanical valves and moderate-to-severe mitral stenosis. Rate or rhythm control is chosen based on symptoms.",
    ["cardiology", "stroke prevention"], "AF with high CHA2DS2-VASc: anticoagulate, DOAC preferred over warfarin."),
  s3(ACM, "Hyperkalemia", "moderate",
    "A 60-year-old man with end-stage kidney disease who missed dialysis has weakness. Potassium is 7.2 mEq/L. ECG shows peaked T waves and a widened QRS. What is the most appropriate first intervention?",
    [
      ["Intravenous calcium gluconate", "Stabilizes the cardiac membrane within minutes."],
      ["Oral sodium polystyrene sulfonate", "Slow and not an emergency measure."],
      ["Intravenous furosemide only", "Ineffective in anuric patients and not first step."],
      ["Intravenous regular insulin alone with no glucose", "Risks hypoglycemia and does not protect the heart."],
      ["Immediate dialysis before any medication", "Dialysis is definitive but takes time; membrane stabilization comes first."],
    ], 0,
    "Hyperkalemia with ECG changes requires immediate cardiac membrane stabilization with IV calcium, followed by shifting potassium into cells (insulin with glucose, nebulized albuterol, bicarbonate if acidotic) and removal (loop diuretics, binders, dialysis). Calcium does not lower potassium, so repeated monitoring is needed.",
    ["nephrology", "emergency"], "Hyperkalemia with ECG changes: calcium first, then shift, then remove."),
  s3(ACM, "Heart failure", "difficult",
    "A 62-year-old man with ischemic cardiomyopathy (ejection fraction 28%) remains NYHA class III on lisinopril and metoprolol succinate. Potassium is 4.2 mEq/L and eGFR is 70 mL/min/1.73 m2. Which addition is most likely to reduce mortality?",
    [
      ["Spironolactone", "Mineralocorticoid antagonists improve survival in HFrEF."],
      ["Digoxin", "Reduces hospitalization but not mortality."],
      ["Amlodipine", "No mortality benefit in HFrEF."],
      ["Diltiazem", "Non-dihydropyridine calcium channel blockers are harmful in HFrEF."],
      ["Scheduled furosemide alone", "Controls congestion without improving survival."],
    ], 0,
    "Guideline-directed therapy for HFrEF includes an ACE inhibitor, ARB or ARNI; an evidence-based beta-blocker; a mineralocorticoid receptor antagonist; and an SGLT2 inhibitor. Loop diuretics relieve symptoms only. Monitor potassium and creatinine after starting an MRA, and use device therapy when criteria are met.",
    ["cardiology", "heart failure"], "HFrEF mortality benefit: ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2 inhibitor."),
  s3(ACM, "Pulmonary embolism", "difficult",
    "A 50-year-old woman 2 weeks after knee replacement collapses with sudden dyspnea. Blood pressure is 76/44 mm Hg, heart rate is 130/min and oxygen saturation is 84% on room air. Bedside echocardiography shows a dilated right ventricle. She has no bleeding risk factors. Which is the most appropriate treatment?",
    [
      ["Systemic thrombolysis with alteplase", "Recommended for high-risk (massive) PE with hypotension."],
      ["Oral warfarin alone", "Too slow in unstable patients."],
      ["Prophylactic enoxaparin dose only", "Insufficient."],
      ["Aspirin and observation", "Inadequate."],
      ["Inferior vena cava filter as the sole therapy", "Reserved for patients who cannot receive anticoagulation."],
    ], 0,
    "High-risk pulmonary embolism presents with sustained hypotension or shock and RV strain; immediate reperfusion with systemic thrombolysis (or catheter/surgical embolectomy where contraindicated or available) is life-saving, together with anticoagulation. Intermediate-risk patients are anticoagulated and monitored for deterioration.",
    ["pulmonology", "critical care"], "Hypotension with PE: systemic thrombolysis."),
  s3(ACM, "Chronic obstructive pulmonary disease", "moderate",
    "A 67-year-old man with severe COPD has stable symptoms on maximal inhaled therapy. At rest on room air his PaO2 is 52 mm Hg and oxygen saturation is 86%. He has peripheral edema from cor pulmonale. Which intervention prolongs survival?",
    [
      ["Long-term continuous home oxygen therapy", "Improves survival in COPD with severe resting hypoxemia."],
      ["Daily oral theophylline", "No survival benefit."],
      ["Long-term oral prednisone", "Harms outweigh benefit."],
      ["Routine prophylactic antibiotics only", "Not recommended for all patients."],
      ["Codeine for dyspnea", "May be considered for symptoms but does not improve survival."],
    ], 0,
    "Long-term oxygen therapy for at least 15 hours daily improves survival in COPD with resting PaO2 at or below 55 mm Hg (or 59 mm Hg with cor pulmonale or erythrocytosis). Smoking cessation also modifies survival, and non-pharmacologic therapies such as pulmonary rehabilitation improve quality of life.",
    ["pulmonology", "chronic disease"], "Resting PaO2 at or below 55 mm Hg in COPD: home oxygen prolongs survival."),
  s3(ACM, "Syncope", "moderate",
    "A 68-year-old man collapses while climbing stairs. He has had exertional chest tightness and dyspnea for 3 months. Examination shows a slow-rising carotid pulse and a harsh crescendo-decrescendo systolic murmur at the right upper sternal border radiating to the carotids. Which is the best next test?",
    [
      ["Transthoracic echocardiography", "Confirms and grades aortic stenosis, the likely cause of exertional syncope."],
      ["Tilt-table testing", "Used for suspected vasovagal syncope."],
      ["EEG", "No seizure features."],
      ["Carotid duplex alone", "Does not explain the murmur."],
      ["Treadmill stress test", "Contraindicated in symptomatic severe aortic stenosis."],
    ], 0,
    "Exertional syncope with angina and dyspnea in an older man with a murmur characteristic of aortic stenosis is a high-risk presentation. Echocardiography confirms the valve area and gradients; symptomatic severe aortic stenosis is treated with aortic valve replacement (surgical or transcatheter), and exercise stress testing is avoided.",
    ["cardiology", "valvular disease"], "Exertional syncope plus ejection murmur: echocardiography for aortic stenosis."),
  s3(ACM, "Chronic kidney disease in diabetes", "difficult",
    "A 60-year-old man with type 2 diabetes has an eGFR of 45 mL/min/1.73 m2 and a urine albumin-to-creatinine ratio of 400 mg/g. He takes metformin and lisinopril at maximum tolerated doses. HbA1c is 7.4% and blood pressure is 128/76 mm Hg. Which additional agent is most likely to slow progression of kidney disease?",
    [
      ["An SGLT2 inhibitor", "Reduces progression of CKD and cardiovascular events in diabetic kidney disease."],
      ["A sulfonylurea", "Raises hypoglycemia risk without renal protection."],
      ["A thiazolidinedione", "Causes fluid retention and has no renal protection."],
      ["An NSAID for joint pain", "Nephrotoxic."],
      ["A second ACE inhibitor", "Dual RAAS blockade increases hyperkalemia and AKI without benefit."],
    ], 0,
    "In type 2 diabetes with CKD, an ACE inhibitor or ARB is standard for albuminuria; SGLT2 inhibitors reduce kidney disease progression and cardiovascular events at eGFR down to low levels, and a nonsteroidal mineralocorticoid antagonist (finerenone) can also be added. Dual ACE inhibitor and ARB therapy is avoided.",
    ["nephrology", "endocrine"], "Diabetic CKD with albuminuria: ACEi or ARB plus an SGLT2 inhibitor."),
  s3(ACM, "Iron deficiency anemia", "moderate",
    "A 62-year-old man has fatigue and a hemoglobin of 9.8 g/dL. Mean corpuscular volume is 71 fL and ferritin is 9 ng/mL. He has no overt bleeding and takes no NSAIDs. Which is the most appropriate next step?",
    [
      ["Upper endoscopy and colonoscopy", "Iron deficiency in an older man indicates gastrointestinal blood loss until proven otherwise."],
      ["Oral iron and recheck in 1 year", "Misses a possible malignancy."],
      ["Bone marrow biopsy", "Not indicated."],
      ["Hemoglobin electrophoresis", "Used in suspected thalassemia where ferritin is normal."],
      ["Vitamin B12 injections", "Macrocytic anemia, not microcytic."],
    ], 0,
    "In men and postmenopausal women, iron deficiency anemia should prompt bidirectional endoscopy to identify gastrointestinal blood loss such as colorectal cancer, peptic ulcer or angiodysplasia. Iron replacement is given concurrently, and celiac serology is also considered.",
    ["hematology", "gastroenterology"], "Iron deficiency in an older man: look for a GI source."),
  s3(ACM, "Sepsis", "moderate",
    "A 70-year-old woman with fever, confusion, a blood pressure of 82/46 mm Hg and a lactate of 4.6 mmol/L is brought from a nursing home with suspected urosepsis. Which is the most appropriate immediate management?",
    [
      ["Draw blood cultures, start broad-spectrum antibiotics within 1 hour and give an initial crystalloid bolus", "Early antibiotics and fluid resuscitation reduce mortality in septic shock."],
      ["Await culture results before antibiotics", "Delays lifesaving therapy."],
      ["Begin a norepinephrine infusion without any fluids", "Fluids are given first unless volume overloaded; vasopressors if hypotension persists."],
      ["Give oral antibiotics and discharge", "Inappropriate for septic shock."],
      ["Administer hydrocortisone as the first measure", "Reserved for refractory shock."],
    ], 0,
    "Sepsis with hypotension or lactate above 4 mmol/L is a medical emergency. The initial bundle includes lactate measurement, blood cultures before antibiotics (without delaying them), broad-spectrum antibiotics within 1 hour, a balanced crystalloid bolus of about 30 mL/kg for hypotension or hyperlactatemia, vasopressors (norepinephrine) if hypotension persists, and source control.",
    ["critical care", "infectious disease"], "Septic shock: cultures, antibiotics within 1 hour, fluids, then vasopressors."),
  s3(ACM, "Hypercalcemia of malignancy", "moderate",
    "A 63-year-old man with squamous cell lung cancer is brought in lethargic and dehydrated. Serum calcium is 14.4 mg/dL with low PTH. What is the most appropriate initial treatment?",
    [
      ["Aggressive intravenous isotonic saline", "Restores volume and increases urinary calcium excretion."],
      ["Oral calcium restriction only", "Insufficient in severe hypercalcemia."],
      ["Hydrochlorothiazide", "Raises serum calcium."],
      ["Parathyroidectomy", "Parathyroid hormone is suppressed, not elevated."],
      ["Intravenous phosphate", "Dangerous and no longer used."],
    ], 0,
    "Severe hypercalcemia causes volume depletion from nephrogenic diabetes insipidus. Start with isotonic saline, add an IV bisphosphonate (zoledronic acid) for hypercalcemia of malignancy, and consider calcitonin for rapid short-term effect. PTHrP secretion by squamous tumors is the usual mechanism, and loop diuretics are used only after volume repletion if overloaded.",
    ["oncology", "electrolytes"], "Hypercalcemia of malignancy: saline first, then a bisphosphonate."),
  s3(BAE, "Number needed to treat", "moderate",
    "In a randomized trial, 20% of patients receiving placebo had a stroke over 3 years compared with 15% of patients receiving a new drug. How many patients must be treated for 3 years to prevent one stroke?",
    [
      ["20", "Absolute risk reduction is 5%; NNT = 1 / 0.05."],
      ["5", "This is the absolute risk reduction in percent."],
      ["25", "This is the relative risk reduction in percent."],
      ["4", "Miscalculation."],
      ["75", "Miscalculation."],
    ], 0,
    "Absolute risk reduction is 20% - 15% = 5% (0.05). The number needed to treat is the reciprocal: 1 / 0.05 = 20. The relative risk reduction is 25% (5/20), which tends to overstate benefit compared with the absolute risk reduction.",
    ["biostatistics", "calculation"], "NNT = 1 / absolute risk reduction."),
  s3(BAE, "Study design", "moderate",
    "Investigators want to study whether prior exposure to a solvent is associated with a very rare liver tumor. They identify 80 patients with the tumor and 160 matched patients without it, and review occupational histories. Which study design and measure of association are most appropriate?",
    [
      ["Case-control study with an odds ratio", "Efficient for rare diseases; compares exposure between cases and controls."],
      ["Prospective cohort study with relative risk", "Inefficient for a rare outcome."],
      ["Randomized controlled trial with number needed to treat", "Unethical to assign a harmful exposure."],
      ["Cross-sectional study with incidence rate", "Cannot measure incidence."],
      ["Ecologic study with correlation coefficient", "Uses group-level data."],
    ], 0,
    "A case-control study starts with outcome status and compares past exposure, making it ideal for rare diseases and for studying multiple exposures. It yields an odds ratio and is vulnerable to recall and selection bias. Cohort studies yield relative risk and incidence but are costly for rare outcomes.",
    ["epidemiology", "study design"], "Rare disease: case-control study and odds ratio."),
  s3(BAE, "Bias in screening", "difficult",
    "A new blood test detects a cancer 2 years earlier than clinical diagnosis. Patients diagnosed through screening have a 5-year survival of 60% versus 35% for patients diagnosed by symptoms, but the age at death is unchanged in both groups. Which bias best explains the apparent benefit?",
    [
      ["Lead-time bias", "Earlier diagnosis lengthens the time from diagnosis to death without changing the time of death."],
      ["Length-time bias", "Screening preferentially detects slow-growing tumors; the mortality data here show unchanged age at death."],
      ["Recall bias", "Concerns exposure reporting."],
      ["Berkson bias", "Hospital-based selection."],
      ["Observer bias", "Concerns subjective measurement."],
    ], 0,
    "Lead-time bias inflates survival when screening advances the time of diagnosis but does not delay death. The right measure of screening benefit is disease-specific mortality in a randomized trial. Length-time bias occurs because screening detects indolent disease preferentially.",
    ["epidemiology", "screening"], "Longer survival with the same age at death: lead-time bias."),
  s3(BAE, "Hypothesis testing", "moderate",
    "A randomized trial reports that a drug lowers systolic blood pressure by 4 mm Hg more than placebo with p = 0.03. Which statement is the most accurate interpretation?",
    [
      ["If there were truly no difference, a result this extreme would occur about 3% of the time by chance", "This is the definition of the p value."],
      ["There is a 97% probability that the drug works", "A p value is not the probability that the hypothesis is true."],
      ["The effect is clinically important", "Statistical significance does not establish clinical importance."],
      ["The probability of a type II error is 3%", "Type II error is related to power (beta)."],
      ["The result will replicate 97% of the time", "Not what a p value means."],
    ], 0,
    "A p value is the probability of observing data at least as extreme as those observed if the null hypothesis were true. Compare with the prespecified alpha (type I error rate, commonly 0.05). Clinical significance requires judging effect size, confidence intervals and patient outcomes.",
    ["biostatistics"], "The p value is not the probability that the null hypothesis is true."),
  s3(BAE, "Diagnostic test characteristics", "moderate",
    "A diagnostic test has a sensitivity of 80% and a specificity of 90%. What is the positive likelihood ratio?",
    [
      ["8", "LR+ = sensitivity / (1 - specificity) = 0.80 / 0.10."],
      ["0.22", "This is the negative likelihood ratio: (1 - sensitivity) / specificity = 0.2 / 0.9."],
      ["0.89", "Miscalculation."],
      ["1.8", "Sum of sensitivity and specificity."],
      ["72", "Product of the two values."],
    ], 0,
    "The positive likelihood ratio is sensitivity divided by the false-positive rate (1 - specificity). Likelihood ratios allow conversion of pretest to post-test odds, independent of prevalence. An LR+ above 10 strongly raises the probability of disease; an LR- below 0.1 strongly lowers it.",
    ["biostatistics", "diagnostics"], "LR+ = sens / (1 - spec); LR- = (1 - sens) / spec."),
  s3(BAE, "Confounding", "moderate",
    "An observational study finds that people who drink more coffee have a higher rate of lung cancer. Cigarette smoking is more common among heavy coffee drinkers. Which approach best addresses this problem during data analysis?",
    [
      ["Stratified analysis or multivariable regression adjusting for smoking", "Controls for the confounder at the analysis stage."],
      ["Increasing the sample size", "Does not remove confounding."],
      ["Using a placebo", "Not applicable in an observational study."],
      ["Blinding the investigators", "Reduces observer bias but not confounding."],
      ["Using a one-tailed test", "Unrelated."],
    ], 0,
    "Smoking is associated with both exposure (coffee) and outcome (lung cancer), making it a confounder. Confounding is controlled during design by randomization, restriction or matching, and during analysis by stratification or multivariable regression. Larger samples increase precision but not validity.",
    ["epidemiology", "confounding"], "Confounder: linked to both exposure and outcome; adjust via stratification or regression."),
  s3(BAE, "Incidence and prevalence", "moderate",
    "A new therapy for a chronic disease prolongs survival without curing it. Compared with before its introduction, which changes in disease frequency are expected?",
    [
      ["Increased prevalence with unchanged incidence", "Prevalence is approximately incidence multiplied by average duration."],
      ["Decreased prevalence with decreased incidence", "Duration is longer, so prevalence rises."],
      ["Unchanged prevalence with increased incidence", "New case rate does not change."],
      ["Decreased prevalence with unchanged incidence", "Opposite of expected."],
      ["Increased incidence with decreased prevalence", "Inconsistent."],
    ], 0,
    "Prevalence reflects incidence and disease duration (P approximates I x D). A therapy that prolongs life without curing, or without preventing new cases, increases the number of existing cases while the rate of new cases is unchanged. A preventive measure like a vaccine lowers incidence and eventually prevalence.",
    ["epidemiology"], "Longer survival without cure: prevalence rises, incidence unchanged."),
  s3(PSF, "Medical error disclosure", "easy",
    "A nurse administers an incorrect dose of a medication to a hospitalized patient. The dose is twice that ordered, and the patient has no adverse effects after monitoring. The attending physician is deciding whether to tell the patient. What is the most appropriate course of action?",
    [
      ["Disclose the error to the patient promptly, explain what happened and report the event", "Ethical standards require honest disclosure of errors that reach the patient, even without harm."],
      ["Do not mention it because no harm occurred", "Violates the duty of transparency."],
      ["Wait until the patient asks", "Disclosure should be proactive."],
      ["Disclose only to the patient's family", "The patient is entitled to the information."],
      ["Ask the nurse to inform the patient without the attending physician", "The responsible physician should lead the disclosure."],
    ], 0,
    "Errors that reach the patient should be disclosed promptly and honestly with an explanation of what happened, what is being done to monitor or correct it, an apology, and information on how recurrence will be prevented. The event should also be entered in the institution's safety reporting system.",
    ["ethics", "patient safety"], "Disclose errors that reach the patient, even when no harm resulted."),
  s3(PSF, "Handoff communication", "easy",
    "A resident is signing out a patient with sepsis to the night float physician. Which practice most reduces the risk of information loss during handoff?",
    [
      ["Use a structured tool such as I-PASS with an opportunity for questions and read-back", "Standardized handoffs reduce preventable adverse events."],
      ["Provide a brief verbal summary in the hallway", "Prone to omissions."],
      ["Leave a text message only", "No opportunity for interactive clarification."],
      ["Assume the electronic record contains all necessary information", "Misses contingency plans."],
      ["Hand off only when the patient is unstable", "All patients need handoffs."],
    ], 0,
    "Structured handoffs (I-PASS: illness severity, patient summary, action list, situation awareness and contingency planning, synthesis by receiver) with face-to-face interactive communication, a quiet environment and read-back reduce medical errors and preventable adverse events. SBAR is used for urgent communication.",
    ["patient safety", "communication"], "Use a structured handoff with read-back (I-PASS)."),
  s3(PSF, "Root cause analysis", "moderate",
    "A hospital identifies that a surgeon operated on the wrong knee. The patient was informed and no permanent harm resulted. What is the most appropriate institutional response?",
    [
      ["Conduct a root cause analysis focused on system failures and implement corrective actions", "Sentinel events should prompt systems analysis, not just individual blame."],
      ["Terminate the surgeon without further review", "Does not address system causes."],
      ["Keep the event confidential", "Violates transparency and reporting requirements."],
      ["Wait for a malpractice claim before any review", "Delays learning."],
      ["Conclude that the event was unavoidable", "Wrong-site surgery is preventable."],
    ], 0,
    "Wrong-site surgery is a sentinel (never) event. Institutions should investigate with root cause analysis, examining communication, site marking, time-out compliance, culture and workflow, then implement and monitor corrective actions. A just culture distinguishes human error, at-risk behavior and reckless behavior.",
    ["patient safety", "quality improvement"], "Sentinel event: perform root cause analysis and fix the system."),
  s3(PSF, "Surgical safety", "easy",
    "Which measure is most effective at preventing wrong-site surgery?",
    [
      ["Marking the site while the patient is awake and conducting a team time-out before incision", "The Universal Protocol combines preoperative verification, site marking and a time-out."],
      ["Relying on the surgeon's memory", "Prone to error."],
      ["Marking the site after anesthesia induction", "Patient participation is lost."],
      ["Skipping the time-out for brief procedures", "Applies to all procedures."],
      ["Using only the operating room schedule", "Schedules contain errors."],
    ], 0,
    "The Universal Protocol includes preprocedure verification, marking the site with the patient involved when possible, and a final time-out where the entire team confirms patient, procedure, site and necessary equipment. Checklists also address antibiotics, imaging and allergies.",
    ["patient safety", "surgery"], "Universal Protocol: verify, mark the site, time-out."),
  s3(PSF, "Healthcare-associated infection", "moderate",
    "A hospital's ICU has an elevated rate of central line-associated bloodstream infections. Which intervention is most likely to reduce the rate?",
    [
      ["Implementing a bundle: hand hygiene, chlorhexidine skin preparation, maximal sterile barriers, optimal site selection and daily review of line necessity", "Bundles have reduced CLABSI rates substantially."],
      ["Changing central lines routinely every 3 days", "Routine replacement does not reduce infection."],
      ["Prophylactic systemic antibiotics for all lines", "Promotes resistance without benefit."],
      ["Using only femoral sites", "Higher infection risk than subclavian."],
      ["Only educating nurses with no process changes", "Less reliable than a bundle."],
    ], 0,
    "Evidence-based central line insertion and maintenance bundles with checklists and empowering staff to stop non-compliant insertions reduce CLABSI. Remove lines as soon as they are not needed. The subclavian site generally has a lower infection risk than femoral or internal jugular, balanced against mechanical risk.",
    ["patient safety", "infection control"], "CLABSI prevention: bundle plus daily review of line necessity."),
  s3(PSF, "Impaired colleague", "moderate",
    "A surgical resident notices that a senior colleague smells of alcohol before a morning clinic and has shaky hands. The colleague has an operating list scheduled for the same day. What is the most appropriate first action?",
    [
      ["Immediately notify the department chief or designated impaired-physician program so patients are protected", "Patient safety takes priority over collegiality."],
      ["Say nothing because it is not the resident's concern", "Fails the professional obligation to protect patients."],
      ["Wait a week to see whether it happens again", "Delays protection for patients."],
      ["Confront the colleague in front of staff", "Public confrontation is unprofessional."],
      ["Post concerns on social media", "Violates confidentiality and professionalism."],
    ], 0,
    "Physicians have an ethical and often legal duty to report an impaired colleague who may endanger patients, usually to a supervisor or designated program, so the person can be evaluated and removed from patient care until safe. Confidentiality and support, including referral for treatment, are part of the response.",
    ["ethics", "professionalism"], "Suspected impairment: protect patients first and report through proper channels."),
];

const s3n = note("usmle-step-3");
const S3_M: SeedMaterial[] = [
  s3n(FIP, "Perioperative medicine", "Preoperative Risk Assessment and Medication Management", "A stepwise approach to cardiac risk, medication continuation and postoperative complications.", 6, `
# Preoperative Risk Assessment

The aim of a preoperative visit is to **identify modifiable risk** and plan perioperative management, not to "clear" the patient.

## Stepwise cardiac evaluation
1. **Emergency surgery?** Proceed with surgery, with perioperative surveillance.
2. **Active cardiac condition?** Unstable angina, decompensated heart failure, significant arrhythmia, severe valve disease: evaluate and treat first.
3. **Estimate risk** of the procedure and patient (Revised Cardiac Risk Index: high-risk surgery, ischemic heart disease, heart failure, cerebrovascular disease, insulin-treated diabetes, creatinine above 2 mg/dL).
4. **Functional capacity:** the ability to climb two flights of stairs (about 4 metabolic equivalents) predicts good outcomes. Testing is considered only when poor capacity and elevated risk make results likely to change management.

## Medications
- **Continue:** beta-blockers, statins, most antihypertensives, inhaled medications.
- **Hold on the morning of surgery:** ACE inhibitors and ARBs are often held to reduce intraoperative hypotension; diuretics may be held; SGLT2 inhibitors are stopped several days before surgery (risk of euglycemic ketoacidosis).
- **Anticoagulants:** stop warfarin about 5 days before; bridging is reserved for highest-risk patients such as mechanical mitral valves. DOACs are held for 1 to 3 days depending on renal function and bleeding risk.
- **Antiplatelets:** do not stop dual antiplatelet therapy early after a recent drug-eluting stent without consulting cardiology.
- **Insulin:** give a reduced basal dose; stop oral hypoglycemics as appropriate.
- **Steroids:** patients on chronic steroids may need stress-dose coverage.

## Pulmonary risk
- Risks include smoking, COPD, obstructive sleep apnea, upper abdominal or thoracic surgery.
- Reduce complications with lung expansion maneuvers, early mobilization and optimized COPD therapy.
- Smoking cessation helps even shortly before surgery.

## Postoperative complications by day
- **Day 1-2:** atelectasis, myocardial infarction, malignant hyperthermia (during anesthesia).
- **Day 3-5:** urinary tract infection, pneumonia.
- **Day 5-7:** wound infection, anastomotic leak, deep venous thrombosis.

## VTE prophylaxis
Based on risk using mechanical measures, low-molecular-weight heparin or unfractionated heparin.

> **High-yield / exam traps:** Do not stop beta-blockers abruptly; do not start high-dose beta-blockers the morning of surgery. Testing should not be ordered if it will not change management. Patients with severe, symptomatic aortic stenosis need valve evaluation before elective non-cardiac surgery.
`),
  s3n(ACM, "Atrial fibrillation", "Atrial Fibrillation: Stroke Prevention, Rate and Rhythm", "Risk stratification, anticoagulant selection and the rate versus rhythm control decision.", 6, `
# Atrial Fibrillation

## Recognition and acute care
- Irregularly irregular rhythm with no discernible P waves.
- **Unstable** (hypotension, ischemia, pulmonary edema): synchronized cardioversion.
- **Stable:** control the ventricular rate and decide on anticoagulation.

## Stroke prevention
- **CHA2DS2-VASc:** congestive heart failure, hypertension, age 75 or above (2 points), diabetes, stroke or TIA (2 points), vascular disease, age 65 to 74, sex category (female).
- Anticoagulate men with a score of 2 or more and women with 3 or more; consider at lower scores.
- **DOACs** (apixaban, rivaroxaban, edoxaban, dabigatran) are preferred to warfarin in nonvalvular AF.
- **Warfarin** is indicated with mechanical valves or moderate-to-severe mitral stenosis.
- **HAS-BLED** identifies modifiable bleeding risk factors (uncontrolled hypertension, alcohol, NSAIDs); it should not be used to withhold anticoagulation alone.

## Rate control
- Beta-blockers or non-dihydropyridine calcium channel blockers (diltiazem, verapamil) are first-line when ejection fraction is preserved.
- Avoid diltiazem and verapamil in reduced ejection fraction; use beta-blockers or digoxin.
- Lenient control (resting rate below 110/min) is acceptable in asymptomatic patients.

## Rhythm control
- Favored for symptomatic patients, young patients, or tachycardia-mediated cardiomyopathy.
- **Cardioversion:** if AF has been present for more than 48 hours (or unknown duration), anticoagulate for at least 3 weeks beforehand or perform transesophageal echocardiography to exclude atrial thrombus; continue anticoagulation for at least 4 weeks afterward.
- Antiarrhythmics: flecainide or propafenone for patients without structural heart disease; amiodarone, sotalol or dofetilide for others.
- **Catheter ablation** is an option for symptomatic patients.

## Special cases
- **Wolff-Parkinson-White with AF:** avoid AV nodal blockers; use procainamide or cardioversion.
- **Hyperthyroidism:** treat the cause and use beta-blockers.
- **Post-operative AF:** usually transient; manage rate and consider anticoagulation if persistent.

## Workup
ECG, echocardiography, thyroid function, electrolytes, and assessment for sleep apnea, alcohol use and hypertension.

> **High-yield / exam traps:** Aspirin is not adequate stroke prevention in AF. Do not cardiovert a patient with AF of unknown duration without 3 weeks of anticoagulation or a transesophageal echocardiogram. Avoid AV nodal blockers in pre-excited AF.
`),
  s3n(BAE, "Study design", "Study Design, Bias and Confounding", "Choosing the right design and recognizing the usual biases in a vignette.", 7, `
# Study Design, Bias and Confounding

## Observational designs
| Design | Direction | Measure | Best for |
|---|---|---|---|
| **Cohort** | Exposure to outcome (forward or retrospective) | Relative risk, incidence | Rare exposures, multiple outcomes |
| **Case-control** | Outcome to exposure (backward) | Odds ratio | Rare diseases, multiple exposures |
| **Cross-sectional** | One time point | Prevalence | Surveys, disease burden |
| **Ecologic** | Population-level data | Correlation | Hypothesis generation |
| **Case series/report** | Descriptive | None | New or rare conditions |

## Experimental designs
- **Randomized controlled trial:** randomization balances known and unknown confounders; the gold standard for treatment efficacy.
- **Intention-to-treat** analysis preserves randomization; **per-protocol** analysis can bias results.
- **Crossover trials** let each patient be their own control.
- **Blinding** reduces observer and performance bias.

## Common biases
- **Selection bias:** how participants were chosen or lost (Berkson bias, loss to follow-up, healthy-worker effect).
- **Recall bias:** cases remember exposure differently from controls (case-control studies).
- **Lead-time bias:** screening advances diagnosis without changing the time of death.
- **Length-time bias:** screening favors slow-growing disease.
- **Measurement and observer bias:** corrected by standardization and blinding.
- **Confounding:** a third variable linked to both exposure and outcome; handled by randomization, restriction, matching, stratification and regression.

## Measures of effect
- **Relative risk** = risk in exposed / risk in unexposed.
- **Absolute risk reduction** = control event rate - treatment event rate; **NNT** = 1 / ARR.
- **Odds ratio** approximates relative risk when disease is rare.

## Hypothesis testing
- **Type I error (alpha):** false positive.
- **Type II error (beta):** false negative; power = 1 - beta.
- A 95% confidence interval for a ratio that includes 1 (or for a difference that includes 0) indicates no statistically significant effect at alpha 0.05.

## Choosing statistical tests
- Compare two means: t test; more than two: ANOVA.
- Compare proportions: chi-square or Fisher exact test.
- Correlation: Pearson (continuous), Spearman (ranked).
- Time to event: Kaplan-Meier and log-rank test.

> **High-yield / exam traps:** A cohort study cannot estimate prevalence from incidence alone, and a case-control study cannot give incidence. Larger samples narrow confidence intervals but do not fix bias.
`),
  s3n(PSF, "Medical error disclosure", "Patient Safety: Errors, Disclosure and Systems Thinking", "A practical guide to disclosing errors, analyzing events and preventing recurrence.", 6, `
# Patient Safety

## Core vocabulary
- **Adverse event:** harm caused by medical care, not by the underlying disease.
- **Medical error:** failure of a planned action or use of a wrong plan.
- **Near miss:** an error caught before reaching the patient.
- **Sentinel event:** unexpected event causing death or serious harm (wrong-site surgery, retained foreign object, infant abduction).
- **Never event:** a preventable error that should not occur at all.

## Swiss cheese model
Errors reach patients when holes in several layers of defense align. Fix the **system**, not only the person: staffing, fatigue, ambiguous labels, look-alike drugs, interruptions and poor handoffs.

## Disclosure of errors
1. Tell the patient (or surrogate) promptly, in person, in plain language.
2. State what happened, what the effects are, and what is being done.
3. Apologize and express concern; avoid blaming colleagues.
4. Explain steps to prevent recurrence.
5. Document facts objectively and report through the safety system.
- Disclose even if no harm resulted if the error reached the patient.

## Analysis tools
- **Root cause analysis:** retrospective review of a serious event to find system causes.
- **Failure mode and effects analysis:** proactive identification of potential failure points.
- **Plan-do-study-act cycles:** iterative quality improvement.

## High-yield prevention strategies
- **Checklists and time-outs** for surgery and line placement.
- **Structured handoffs** (I-PASS) and **SBAR** for urgent calls.
- **Medication safety:** computerized order entry, barcode administration, tall-man lettering, avoiding dangerous abbreviations, independent double checks for high-alert drugs (insulin, heparin, opioids).
- **Fall and pressure injury prevention** bundles.
- **Infection prevention:** hand hygiene, line and catheter bundles.
- **Just culture:** distinguishes human error (console), at-risk behavior (coach) and reckless behavior (discipline).

## Professional duties
- Report impaired colleagues and unsafe conditions.
- Use interpreters for patients with limited English proficiency; do not rely on family members.
- Obtain informed consent through teach-back.

## Quick scenarios
- A nurse gives the wrong drug and the patient is unharmed: disclose and file a report.
- An unsafe staffing situation: escalate through the chain of command and document.

> **High-yield / exam traps:** Disclosure is not optional because "no harm was done". Discipline is not the first response; analyze the system first unless reckless behavior is evident. Do not alter or add to the medical record to hide an error.
`),
  s3n(ACM, "Sepsis", "Sepsis and Septic Shock: First-Hour Management", "Recognition, bundle elements and the vasopressor and source-control steps that follow.", 6, `
# Sepsis and Septic Shock

## Definitions
- **Sepsis:** life-threatening organ dysfunction due to a dysregulated response to infection (SOFA score increase of 2 or more).
- **Septic shock:** sepsis with persistent hypotension needing vasopressors to maintain mean arterial pressure at or above 65 mm Hg and a lactate above 2 mmol/L despite adequate fluids.
- **qSOFA** (respiratory rate 22 or more, altered mentation, systolic pressure 100 or less) is a bedside prompt, not a diagnostic criterion.

## First-hour actions
1. **Measure lactate** and repeat if elevated.
2. **Obtain blood cultures** (and other cultures from suspected sources) before antibiotics if this causes no substantial delay.
3. **Start broad-spectrum antibiotics** as soon as possible, ideally within 1 hour in shock.
4. **Give about 30 mL/kg of crystalloid** for hypotension or lactate of 4 mmol/L or more; balanced solutions are favored.
5. **Start vasopressors** (norepinephrine first line) if hypotension persists during or after fluids.

## Source control
Drain abscesses, relieve obstruction (for example an obstructed infected kidney), remove infected devices or debride necrotic tissue as soon as feasible.

## Antibiotic selection
- Base on likely source, local resistance and risk factors (recent hospitalization, MRSA colonization, immunosuppression).
- Add vancomycin when MRSA is likely; broaden gram-negative coverage when Pseudomonas is likely.
- De-escalate once cultures return.

## Ongoing care
- Add **vasopressin** as a second agent if norepinephrine requirements rise; **hydrocortisone** for ongoing vasopressor requirement.
- Lung-protective ventilation (tidal volume about 6 mL/kg predicted body weight) for ARDS.
- Glucose control, stress ulcer and venous thromboembolism prophylaxis.
- Reassess volume status dynamically (passive leg raise, ultrasonography) and avoid overload.

## Special populations
- Neutropenic fever: prompt anti-pseudomonal beta-lactam.
- Intra-abdominal sepsis: anaerobic coverage and source control.
- Toxic shock: clindamycin to reduce toxin production.

> **High-yield / exam traps:** Antibiotic delay increases mortality; do not wait for imaging or cultures. Vasopressors are not a substitute for initial fluids, but start them early if the patient remains hypotensive. Remember source control as a separate required step.
`),
];

const s3f = fc("usmle-step-3");
const S3_F: SeedFlashcard[] = [
  s3f(BAE, "Number needed to treat", "How do you calculate the number needed to harm?", "1 / absolute risk increase (the difference in adverse event rates between treated and control groups)."),
  s3f(BAE, "Study design", "Which study design is best for a rare disease?", "Case-control study; it gives an odds ratio."),
  s3f(BAE, "Hypothesis testing", "Define type II error.", "Failing to reject a false null hypothesis (false negative); probability beta, with power = 1 - beta."),
  s3f(BAE, "Diagnostic test characteristics", "How do positive predictive value and prevalence relate?", "PPV increases as disease prevalence increases; NPV decreases."),
  s3f(BAE, "Bias in screening", "What is length-time bias?", "Screening preferentially detects slowly progressing disease with better prognosis, overstating screening benefit."),
  s3f(BAE, "Confounding", "Name three design-stage methods to control confounding.", "Randomization, restriction and matching."),
  s3f(PSF, "Medical error disclosure", "Elements of a good error disclosure?", "Prompt, honest explanation, apology, plan to correct and prevent recurrence, and documentation and reporting."),
  s3f(PSF, "Handoff communication", "What does I-PASS stand for?", "Illness severity, Patient summary, Action list, Situation awareness and contingency, Synthesis by receiver."),
  s3f(PSF, "Root cause analysis", "What is a sentinel event?", "An unexpected event involving death or serious physical or psychological injury, such as wrong-site surgery."),
  s3f(PSF, "Surgical safety", "Components of the Universal Protocol?", "Preprocedure verification, site marking and a final time-out."),
  s3f(ACM, "Atrial fibrillation", "When is warfarin preferred over a DOAC in AF?", "Mechanical heart valve or moderate-to-severe mitral stenosis."),
  s3f(ACM, "Atrial fibrillation", "Pre-cardioversion anticoagulation rule for AF of 48 hours or more?", "At least 3 weeks of therapeutic anticoagulation or TEE to exclude thrombus; at least 4 weeks after."),
  s3f(ACM, "Hyperkalemia", "Treatment sequence for severe hyperkalemia with ECG changes?", "Calcium to stabilize the membrane; insulin with glucose and albuterol to shift; loop diuretic, binders or dialysis to remove."),
  s3f(ACM, "Sepsis", "Vasopressor of choice in septic shock?", "Norepinephrine; add vasopressin if requirements rise."),
  s3f(ACM, "Heart failure", "Which four drug classes reduce mortality in HFrEF?", "ACEi/ARB/ARNI, evidence-based beta-blockers, mineralocorticoid antagonists and SGLT2 inhibitors."),
  s3f(FIP, "Hypertension management", "Initial treatment for hypertension in a diabetic with albuminuria?", "An ACE inhibitor or ARB."),
  s3f(FIP, "Opioid use disorder", "Which opioid use disorder medication can precipitate withdrawal if started too early?", "Buprenorphine (partial agonist) and naltrexone (antagonist); buprenorphine should be started in mild-to-moderate withdrawal."),
  s3f(FIP, "Osteoporosis", "Who should be treated for osteoporosis?", "T-score at or below -2.5, fragility hip or vertebral fracture, or osteopenia with high FRAX risk."),
  s3f(FIP, "Perioperative medicine", "Which diabetes drug class should be stopped several days before surgery?", "SGLT2 inhibitors, because of the risk of euglycemic diabetic ketoacidosis."),
  s3f(FIP, "Community-acquired pneumonia", "Which scores guide the site of care for pneumonia?", "CURB-65 and the Pneumonia Severity Index."),
];

/* ================================================================== */
/* COMLEX LEVEL 1                                                      */
/* ================================================================== */
const c1 = mk("comlex-level-1");
const OPP = "Osteopathic Principles and Practice";
const FBS = "Foundational Biomedical Sciences";
const HPR = "Health Promotion";
const PPR = "Patient Presentations";
const C1_Q: SeedQuestion[] = [
  c1(OPP, "Fryette principles", "easy",
    "A physician evaluating the thoracic spine finds a group of vertebrae from T4 to T8 with a restriction pattern that does not change when the patient moves into flexion or extension. When the group is sidebent to the left, it rotates to the right. Which principle of spinal motion does this describe?",
    [
      ["Fryette first principle: type I (neutral) mechanics, with sidebending and rotation to opposite sides", "Group curves in the neutral position sidebend and rotate in opposite directions."],
      ["Fryette second principle: type II (non-neutral) mechanics, with sidebending and rotation to the same side", "Applies to a single segment in flexion or extension."],
      ["Fryette third principle: introducing motion in one plane alters the others", "Describes how motion in one plane affects motion in other planes."],
      ["Hilton law", "Concerns the innervation of joints and the muscles that move them."],
      ["Wolff law", "Describes bone remodeling in response to load."],
    ], 0,
    "Fryette's first principle states that when the spine is in a neutral position, sidebending and rotation of a group of vertebrae occur in opposite directions (type I). The second principle states that when a segment is flexed or extended (non-neutral), sidebending and rotation occur to the same side (type II), and the third principle states that adding motion in one plane reduces motion in the others.",
    ["osteopathic", "spinal mechanics"], "Type I: neutral, group, opposite sides. Type II: non-neutral, single segment, same side."),
  c1(OPP, "Thoracic somatic dysfunction", "moderate",
    "A physician diagnoses a single-segment somatic dysfunction at T6 that is extended, rotated left and sidebent left (ERS left). Which motions are restricted?",
    [
      ["Flexion, rotation right and sidebending right", "A dysfunction is named for the direction of freedom, so the opposite motions are restricted."],
      ["Extension, rotation left and sidebending left", "These are the directions of free motion."],
      ["Flexion, rotation left and sidebending right", "Type II mechanics couple rotation and sidebending to the same side."],
      ["Extension, rotation right and sidebending left", "Inconsistent with type II coupling."],
      ["Only sidebending right", "All three planes are affected in a type II dysfunction."],
    ], 0,
    "Somatic dysfunctions are named by the position of ease (the direction in which the segment moves most freely). ERS left therefore moves freely into extension, left rotation and left sidebending, and is restricted in flexion, right rotation and right sidebending. Because the segment is non-neutral, rotation and sidebending occur to the same side.",
    ["osteopathic", "diagnosis"], "Name dysfunctions by freedom of motion; the restricted motions are the opposite."),
  c1(OPP, "Muscle energy technique", "easy",
    "A physician engages the restrictive barrier of a patient's cervical segment, then asks the patient to gently turn the head against the physician's resistance for several seconds, followed by relaxation and a new barrier. Which technique is being performed?",
    [
      ["Muscle energy", "Uses the patient's voluntary isometric contraction against a distinct physician counterforce."],
      ["Counterstrain", "Uses passive positioning of the patient away from the barrier into a position of ease."],
      ["High-velocity, low-amplitude thrust", "Uses a quick short thrust through the barrier."],
      ["Chapman reflex", "A diagnostic and treatment system based on reflexive tender points."],
      ["Craniosacral technique", "Uses gentle contact to influence the primary respiratory mechanism."],
    ], 0,
    "Muscle energy is a direct, active technique: the physician positions the dysfunctional segment at the restrictive barrier, the patient contracts against a precisely controlled counterforce, and after relaxation the barrier is taken up. It relies on postisometric relaxation and reciprocal inhibition.",
    ["osteopathic", "techniques"], "Muscle energy = patient-activated isometric contraction against counterforce."),
  c1(OPP, "Rib mechanics", "moderate",
    "A student is reviewing rib motion. Which motion best describes the primary movement of the middle ribs (approximately ribs 6 through 10) during respiration?",
    [
      ["Bucket handle motion, increasing the transverse diameter of the thorax", "Typical of the lower-middle ribs."],
      ["Pump handle motion, increasing the anteroposterior diameter", "Characteristic of the upper ribs (about ribs 1 to 5)."],
      ["Caliper motion, with lateral excursion of the floating ribs", "Characteristic of ribs 11 and 12."],
      ["Rotation about the long axis of the sternum", "Not a normal rib motion."],
      ["No movement; they are fixed to the vertebral column", "They move with respiration."],
    ], 0,
    "Upper ribs (1-5) move mainly in a pump handle fashion, increasing the anteroposterior dimension; ribs 6-10 move with bucket handle motion, increasing the transverse dimension; and ribs 11-12 (floating ribs) move in a caliper fashion. Knowledge of these axes helps diagnose rib somatic dysfunction.",
    ["osteopathic", "ribs"], "Pump handle: ribs 1-5; bucket handle: ribs 6-10; caliper: ribs 11-12."),
  c1(OPP, "Cervical spine mechanics", "moderate",
    "A physician is describing typical cervical motion in the C2 through C7 region. Which statement is correct?",
    [
      ["Sidebending and rotation occur to the same side", "The facet orientation in the typical cervical spine couples these motions to the same side."],
      ["Sidebending and rotation occur to opposite sides", "This describes neutral thoracic and lumbar mechanics."],
      ["Rotation occurs without any sidebending", "Motion is coupled."],
      ["Only flexion and extension occur", "Rotation and sidebending also occur."],
      ["Rotation is primarily at the atlanto-occipital joint", "The atlanto-axial joint accounts for about half of cervical rotation."],
    ], 0,
    "In the typical cervical spine (C2-C7), facet orientation produces coupled sidebending and rotation to the same side, regardless of flexion or extension. The atlanto-occipital joint primarily allows flexion and extension (nodding) with sidebending and rotation to opposite sides, while the atlanto-axial joint provides roughly half of the rotation of the neck.",
    ["osteopathic", "cervical spine"], "C2-C7: sidebending and rotation to the same side; OA: nodding; AA: rotation."),
  c1(OPP, "Pelvic and sacral diagnosis", "moderate",
    "A 36-year-old woman has low back pain. The standing flexion test is positive on the left, and the seated flexion test is negative. Which region is most likely to have the somatic dysfunction?",
    [
      ["The left ilium (innominate)", "A standing flexion test positive on one side localizes dysfunction to the iliosacral joint on that side."],
      ["The sacrum", "Would produce a positive seated flexion test."],
      ["The lumbar spine, which would be assessed separately", "Not localized by the standing flexion test."],
      ["The right ilium", "The positive side corresponds to the side of the dysfunction."],
      ["The pubic symphysis only", "Not tested by these maneuvers."],
    ], 0,
    "The standing flexion test assesses iliosacral motion: the PSIS that travels farther superiorly during forward bending is the side of the dysfunction. The seated flexion test, which fixes the ilia by sitting on the ischial tuberosities, assesses sacroiliac or sacral motion. A positive standing and negative seated test indicates an innominate dysfunction.",
    ["osteopathic", "pelvis"], "Standing flexion positive and seated negative: ilium. Seated positive: sacrum."),
  c1(OPP, "Osteopathic tenets", "easy",
    "A physician treats a patient with a severe thoracic kyphosis who has dyspnea and reduced chest excursion, recognizing that the altered posture limits respiratory function. This reasoning is best described by which osteopathic principle?",
    [
      ["Structure and function are reciprocally interrelated", "Postural structure affects respiratory function and vice versa."],
      ["The body is capable of self-regulation, self-healing and health maintenance", "Concerns the intrinsic healing capacity of the body."],
      ["The person is a unit of body, mind and spirit", "Concerns the patient as a whole."],
      ["Rational treatment is based on an understanding of the other principles", "Concerns treatment planning from principles."],
      ["The rule of the artery is supreme", "A saying attributed to A.T. Still about circulation."],
    ], 0,
    "The tenets are that the person is a dynamic unit of body, mind and spirit; the body is capable of self-regulation, self-healing and health maintenance; structure and function are reciprocally interrelated; and rational treatment is based on these principles. A structural change such as kyphosis impairing breathing illustrates the reciprocal relation of structure and function.",
    ["osteopathic", "philosophy"], "Structure and function are reciprocally interrelated."),
  c1(OPP, "Viscerosomatic reflexes", "moderate",
    "A patient with chronic gastritis and epigastric pain undergoes osteopathic structural examination. Paraspinal tissue texture changes consistent with a viscerosomatic reflex from the stomach would most likely be found at which spinal levels?",
    [
      ["T5 through T9", "Sympathetic innervation of the stomach arises from approximately these levels."],
      ["T1 through T4", "Sympathetic levels for the head, neck and heart."],
      ["T10 through L2", "Lower levels supply the kidney, ureters and lower gut."],
      ["L3 through L5", "Lower lumbar levels are associated with the pelvis and legs."],
      ["C1 through C3", "Cervical levels relate to the head and neck."],
    ], 0,
    "Visceral afferent and sympathetic efferent fibers connect organs to specific spinal segments. The stomach corresponds roughly to T5-T9, the heart to the upper thoracic segments, the small intestine to the lower-middle thoracic region and the kidney to the T10-L1 region. Acute reflex changes feature boggy, edematous tissue; chronic changes feel ropy and fibrotic.",
    ["osteopathic", "viscerosomatic"], "Stomach: T5-T9; heart: upper thoracic; kidney: lower thoracic and upper lumbar."),
  c1(OPP, "OMT selection", "moderate",
    "A 79-year-old woman with osteoporosis and chronic mid-back pain asks about osteopathic manipulation. Which approach is most appropriate?",
    [
      ["A gentle technique such as muscle energy, myofascial release or counterstrain", "Lower force techniques minimize fracture risk."],
      ["High-velocity, low-amplitude thrust to the thoracic spine", "Thrust techniques carry a relatively higher fracture risk in osteoporosis."],
      ["Forceful rib springing in the thoracic region", "May fracture fragile ribs."],
      ["No treatment of any kind because osteoporosis is an absolute contraindication", "Gentle techniques may be used; osteoporosis is a relative contraindication to forceful techniques."],
      ["Cervical high-velocity thrust in rotation and extension", "Carries added risks and is unnecessary."],
    ], 0,
    "Technique selection depends on the patient's tissue condition. In osteoporosis, indirect and gentle techniques (counterstrain, muscle energy at low force, myofascial release, osteopathy in the cranial field, lymphatic techniques) are preferred, whereas thrust techniques and forceful springing are avoided or used with great caution.",
    ["osteopathic", "safety"], "Osteoporosis: use gentle techniques, avoid thrust and forceful springing."),
  c1(FBS, "Warfarin pharmacology", "moderate",
    "A 68-year-old man with a mechanical aortic valve takes warfarin. By which mechanism does warfarin reduce clot formation?",
    [
      ["Inhibition of vitamin K epoxide reductase, reducing synthesis of factors II, VII, IX and X", "Prevents regeneration of reduced vitamin K needed for gamma-carboxylation."],
      ["Direct inhibition of thrombin", "Mechanism of dabigatran and argatroban."],
      ["Activation of antithrombin III", "Mechanism of heparin."],
      ["Irreversible inhibition of platelet cyclooxygenase", "Mechanism of aspirin."],
      ["Inhibition of the ADP receptor P2Y12", "Mechanism of clopidogrel."],
    ], 0,
    "Warfarin blocks vitamin K epoxide reductase, so factors II, VII, IX and X and proteins C and S cannot be carboxylated. The INR (extrinsic pathway) is monitored, and the short half-life of protein C explains transient hypercoagulability and warfarin skin necrosis early in therapy. Reversal uses vitamin K and prothrombin complex concentrate.",
    ["pharmacology", "hematology"], "Warfarin inhibits vitamin K epoxide reductase and is monitored with the INR."),
  c1(FBS, "Carpal tunnel syndrome", "easy",
    "A 45-year-old typist has nocturnal numbness and tingling in the thumb, index and middle fingers, with weakness of thumb abduction. Tinel and Phalen signs are positive. Which nerve is compressed, and where?",
    [
      ["Median nerve beneath the flexor retinaculum", "Compression in the carpal tunnel produces these symptoms."],
      ["Ulnar nerve in Guyon canal", "Causes numbness in the little finger and medial ring finger."],
      ["Radial nerve in the spiral groove", "Causes wrist drop."],
      ["Anterior interosseous nerve", "A motor branch without sensory loss."],
      ["Musculocutaneous nerve at the coracobrachialis", "Affects elbow flexion and lateral forearm sensation."],
    ], 0,
    "Carpal tunnel syndrome is entrapment of the median nerve under the transverse carpal ligament (flexor retinaculum). The palmar cutaneous branch arises proximal to the tunnel, so thenar sensation is spared. Risk factors include repetitive wrist use, pregnancy, hypothyroidism, diabetes and rheumatoid arthritis; treatment starts with night splinting.",
    ["anatomy", "nerve entrapment"], "Carpal tunnel: median nerve, sparing of the thenar eminence sensation."),
  c1(FBS, "Phenylketonuria", "moderate",
    "A 3-month-old infant has a musty body odor, light skin and hair, eczema and developmental delay. Newborn screening was not performed. Which dietary intervention is most appropriate once the diagnosis is made?",
    [
      ["Restrict phenylalanine and supplement tyrosine", "Phenylalanine cannot be converted to tyrosine, which becomes essential."],
      ["Restrict leucine, isoleucine and valine", "Treatment for maple syrup urine disease."],
      ["Remove galactose from the diet", "Treatment for galactosemia."],
      ["High-protein diet", "Would worsen phenylalanine accumulation."],
      ["Restrict fructose", "Treatment for hereditary fructose intolerance."],
    ], 0,
    "Phenylketonuria is caused by phenylalanine hydroxylase deficiency (or BH4 deficiency), leading to phenylalanine accumulation, decreased melanin and neurotransmitter synthesis, and intellectual disability if untreated. Dietary phenylalanine restriction with tyrosine supplementation prevents damage, and maternal PKU requires strict control during pregnancy to prevent fetal teratogenicity.",
    ["biochemistry", "genetics"], "PKU: low phenylalanine diet and tyrosine becomes essential."),
  c1(FBS, "Hemochromatosis", "moderate",
    "A 48-year-old man has fatigue, arthralgias of the second and third metacarpophalangeal joints, new diabetes and bronze skin pigmentation. Serum ferritin and transferrin saturation are markedly elevated. Which treatment is first-line?",
    [
      ["Therapeutic phlebotomy", "Removes iron stored in tissues."],
      ["Deferoxamine alone in all patients", "Reserved for patients who cannot undergo phlebotomy."],
      ["Penicillamine", "Chelator used for Wilson disease."],
      ["High-dose vitamin C", "Increases iron absorption and is avoided."],
      ["Liver transplantation immediately", "Reserved for decompensated cirrhosis."],
    ], 0,
    "Hereditary hemochromatosis is an autosomal recessive disorder, usually HFE C282Y homozygosity, with increased intestinal iron absorption. Iron deposits cause cirrhosis, diabetes, cardiomyopathy, hypogonadism and arthropathy, and increase hepatocellular carcinoma risk. Phlebotomy is the mainstay, with screening of first-degree relatives.",
    ["pathology", "genetics"], "Hemochromatosis: HFE mutation, high ferritin and transferrin saturation, phlebotomy."),
  c1(FBS, "Urinary tract infection", "moderate",
    "A 30-year-old woman has recurrent urinary tract infections and a staghorn calculus. Urinalysis shows an alkaline pH of 8.0. Which organism is most likely responsible?",
    [
      ["Proteus mirabilis", "A urease-producing organism that alkalinizes urine and forms struvite stones."],
      ["Escherichia coli", "The most common cause of UTI but not typically urease-positive."],
      ["Enterococcus faecalis", "Not associated with struvite stones."],
      ["Staphylococcus saprophyticus", "Causes UTI in young sexually active women but not staghorn calculi."],
      ["Candida albicans", "Does not make urease in this way."],
    ], 0,
    "Urease-producing bacteria such as Proteus, Klebsiella and Ureaplasma split urea to ammonia, raising urine pH and promoting precipitation of magnesium ammonium phosphate (struvite) stones. These stones can grow into staghorn calculi and require urologic removal in addition to antibiotics.",
    ["microbiology", "urology"], "Alkaline urine, struvite or staghorn stones: Proteus."),
  c1(FBS, "Hypersensitivity", "moderate",
    "A 28-year-old man receives equine antivenom for a snakebite. Ten days later he develops fever, urticarial rash, arthralgias and proteinuria. Serum C3 and C4 are low. Which type of hypersensitivity is responsible?",
    [
      ["Type III, immune complex deposition", "Serum sickness occurs 1-2 weeks after exposure to foreign protein."],
      ["Type I, IgE-mediated", "Occurs within minutes."],
      ["Type II, antibody-mediated cytotoxic", "Antibodies target cell surface antigens."],
      ["Type IV, delayed T-cell mediated", "Does not cause low complement."],
      ["Non-immune mast-cell activation", "Does not explain delayed onset and low complement."],
    ], 0,
    "Serum sickness is a type III hypersensitivity: antibodies form against foreign proteins, immune complexes deposit in vessels, joints and kidney, activate complement and cause fever, rash, arthralgias and glomerulonephritis 7 to 14 days later. Treatment is stopping the offending agent, NSAIDs and sometimes steroids.",
    ["immunology"], "Serum sickness: type III, 1-2 weeks after exposure, low complement."),
  c1(FBS, "Oxygen-hemoglobin dissociation", "moderate",
    "A cyclist's exercising skeletal muscle has increased temperature, increased CO2 and lower pH. How does this affect hemoglobin's oxygen binding, and why is it advantageous?",
    [
      ["Shifts the curve to the right, decreasing affinity and promoting oxygen unloading", "The Bohr effect enhances oxygen release to metabolically active tissue."],
      ["Shifts the curve to the left, increasing affinity", "Occurs with alkalosis, hypothermia and decreased 2,3-BPG."],
      ["Does not alter the curve", "These factors alter affinity."],
      ["Increases oxygen binding in the tissues", "Would impair delivery."],
      ["Shifts the curve to the left and raises P50", "Left shifts lower P50."],
    ], 0,
    "Increased temperature, CO2, H+ and 2,3-bisphosphoglycerate shift the oxyhemoglobin dissociation curve to the right (higher P50), reducing hemoglobin affinity so that more oxygen is released to tissues. Fetal hemoglobin, carbon monoxide and alkalosis shift the curve to the left.",
    ["physiology", "respiratory"], "Right shift: CADET face right (CO2, Acid, 2,3-DPG, Exercise, Temperature)."),
  c1(FBS, "Neural tube defects", "easy",
    "A 26-year-old woman at 16 weeks' gestation has an elevated maternal serum alpha-fetoprotein level. Ultrasonography shows a lumbosacral spinal defect. Supplementation with which vitamin before conception would have reduced the risk of this condition?",
    [
      ["Folic acid", "Periconceptional folate lowers the risk of neural tube defects."],
      ["Vitamin B12", "Not the preventive vitamin for neural tube defects."],
      ["Vitamin A", "Excess is teratogenic."],
      ["Vitamin D", "Not associated with neural tube closure."],
      ["Vitamin K", "Unrelated."],
    ], 0,
    "Neural tube defects such as spina bifida result from failed closure of the neural tube in the first month of gestation. Maternal serum and amniotic fluid alpha-fetoprotein are elevated. Folic acid 0.4 mg daily is recommended for all women who could become pregnant, and a higher dose is used for those with a previous affected pregnancy or on antiepileptic drugs such as valproate.",
    ["embryology", "prevention"], "Folic acid prevents neural tube defects; AFP is elevated."),
  c1(HPR, "Cervical cancer screening", "easy",
    "A healthy 25-year-old woman with no history of abnormal Pap tests asks about cervical cancer screening. What is the most appropriate recommendation?",
    [
      ["Cervical cytology every 3 years", "Recommended for ages 21 to 29."],
      ["Annual Pap smear and HPV test", "More frequent testing is not recommended."],
      ["No screening until age 30", "Screening starts at 21."],
      ["HPV testing alone every 5 years", "HPV-based testing is recommended from age 30; cytology is preferred for ages 21 to 29."],
      ["Colposcopy now", "Not indicated without abnormal results."],
    ], 0,
    "Screening for cervical cancer starts at age 21 with cytology every 3 years until age 29. From 30 to 65, options include cytology every 3 years, high-risk HPV testing every 5 years, or co-testing every 5 years. Screening ends after 65 with adequate prior negative results and no history of high-grade lesions.",
    ["health promotion", "screening"], "Cervical screening starts at 21; cytology every 3 years until 29."),
  c1(HPR, "Behavior change", "moderate",
    "A 50-year-old man who smokes says, 'I've been thinking about quitting sometime in the next few months, but I'm not ready to set a date.' According to the transtheoretical model, which stage of change is he in?",
    [
      ["Contemplation", "Aware of the problem and considering change within about 6 months."],
      ["Precontemplation", "Not considering change in the near future."],
      ["Preparation", "Intends to act within about 30 days and has taken steps."],
      ["Action", "Has recently changed behavior."],
      ["Maintenance", "Sustained change for 6 months or more."],
    ], 0,
    "In contemplation, patients acknowledge a problem and are weighing pros and cons of change, usually within the next 6 months, but are ambivalent. Motivational interviewing (open questions, affirmation, reflective listening, summarizing) helps resolve ambivalence. Interventions should match the stage.",
    ["health promotion", "behavior"], "Contemplation: thinking about change in the next 6 months but ambivalent."),
  c1(HPR, "Levels of prevention", "easy",
    "A physician organizes a program in which patients with established coronary artery disease attend cardiac rehabilitation to prevent recurrent events and disability. Which level of prevention is this?",
    [
      ["Tertiary prevention", "Reduces complications and disability from established disease."],
      ["Primary prevention", "Prevents disease onset in healthy individuals (e.g., vaccination)."],
      ["Secondary prevention", "Early detection in asymptomatic disease (screening)."],
      ["Primordial prevention", "Prevents risk factors from developing."],
      ["Quaternary prevention", "Avoids overmedicalization."],
    ], 0,
    "Primary prevention prevents disease before it occurs (immunization, healthy lifestyle). Secondary prevention detects disease early to halt progression (screening). Tertiary prevention reduces the impact of established disease (rehabilitation, preventing recurrence). Aspirin after an MI is often classified as secondary or tertiary prevention depending on the framework.",
    ["health promotion", "prevention"], "Primary: prevent disease; secondary: screen; tertiary: reduce disability."),
  c1(HPR, "Adult immunization", "easy",
    "A healthy 55-year-old woman asks about shingles prevention. She is not immunocompromised and has never received a zoster vaccine. Which recommendation is most appropriate?",
    [
      ["Two doses of recombinant zoster vaccine", "Recommended for adults aged 50 and older."],
      ["One dose of live zoster vaccine", "No longer used in the United States."],
      ["Wait until age 70", "Recommended from 50."],
      ["Varicella immune globulin", "Used for post-exposure prophylaxis in certain patients."],
      ["No vaccine since she likely had chickenpox", "Prior varicella does not preclude vaccination."],
    ], 0,
    "The recombinant (non-live) zoster vaccine is given in two doses to immunocompetent adults aged 50 and older, and to adults 19 and older who are or will be immunodeficient. It reduces the incidence of herpes zoster and postherpetic neuralgia, and is recommended regardless of prior zoster history.",
    ["health promotion", "immunization"], "Recombinant zoster vaccine: 2 doses from age 50."),
  c1(HPR, "Health literacy", "moderate",
    "A physician has explained a new insulin regimen to a 68-year-old patient who nods but seems uncertain. Which technique best confirms understanding?",
    [
      ["Ask the patient to explain the plan in his own words (teach-back)", "Confirms understanding and identifies gaps."],
      ["Ask 'Do you understand?'", "Patients often say yes even when confused."],
      ["Hand out a detailed pamphlet written at a college reading level", "May not be comprehensible."],
      ["Talk faster to cover all points", "Reduces retention."],
      ["Have a relative decide on his behalf", "Not appropriate for a patient with capacity."],
    ], 0,
    "Teach-back (or show-me) asks the patient to restate the instructions, placing the responsibility for clear communication on the clinician. Use plain language, limit the amount of information, use pictures or demonstrations, and write materials at about a sixth-grade reading level.",
    ["communication", "health literacy"], "Use teach-back to confirm understanding."),
  c1(HPR, "Alcohol use screening", "moderate",
    "A 40-year-old man answers 'yes' to feeling annoyed when people criticize his drinking and to having an occasional morning drink to steady his nerves. Using the CAGE questionnaire, which interpretation is correct?",
    [
      ["Two positive responses suggest a clinically significant alcohol use problem and warrant further assessment", "A score of 2 or more is considered positive."],
      ["The screen is negative because he did not answer all four questions affirmatively", "A positive screen requires two or more."],
      ["He should be diagnosed with alcohol dependence on this result alone", "CAGE is a screening, not a diagnostic, tool."],
      ["He should be started immediately on naltrexone", "A full assessment precedes treatment."],
      ["No intervention is needed because he is employed", "Employment does not rule out alcohol use disorder."],
    ], 0,
    "CAGE asks about Cutting down, Annoyance at criticism, Guilt about drinking and Eye-opener drinks. Two or more positive answers indicate a possible alcohol use disorder, which should be followed by a structured assessment (e.g., AUDIT) and brief intervention or referral for treatment.",
    ["health promotion", "substance use"], "CAGE of 2 or more is a positive screen."),
  c1(PPR, "Chest pain", "moderate",
    "A 24-year-old man has sharp substernal chest pain that worsens with inspiration and lying flat and improves when he leans forward, after a recent viral illness. ECG shows diffuse ST elevations with PR depressions. Which treatment is most appropriate?",
    [
      ["An NSAID such as ibuprofen plus colchicine", "First-line therapy for acute pericarditis."],
      ["Emergent cardiac catheterization", "Diffuse changes without regional pattern argue against coronary occlusion."],
      ["Intravenous alteplase", "Contraindicated in pericarditis."],
      ["Anticoagulation with heparin", "Increases the risk of hemopericardium."],
      ["Beta-blocker only", "Does not treat inflammation."],
    ], 0,
    "Acute pericarditis causes pleuritic, positional chest pain relieved by leaning forward, a friction rub, and diffuse ST elevation with PR depression. Treat with an NSAID and colchicine (which reduces recurrence), restrict strenuous activity, and look for tamponade by echocardiography if there is hypotension or a large effusion.",
    ["cardiology", "chest pain"], "Pericarditis: pleuritic, positional pain, diffuse ST elevation, NSAID plus colchicine."),
  c1(PPR, "Dyspnea", "easy",
    "A 70-year-old man has progressive exertional dyspnea, orthopnea and leg swelling. Examination shows elevated jugular venous pressure, an S3 gallop, bibasilar crackles and pitting edema. Which test is best for initial confirmation of the likely diagnosis?",
    [
      ["B-type natriuretic peptide level with echocardiography", "Supports heart failure and defines ejection fraction."],
      ["Spirometry", "Used for obstructive lung disease."],
      ["D-dimer", "Useful for low-probability pulmonary embolism."],
      ["Ventilation-perfusion scan", "Used for pulmonary embolism."],
      ["Exercise tolerance test", "Not first-line for diagnosing heart failure."],
    ], 0,
    "Orthopnea, an S3, elevated JVP and edema are characteristic of heart failure. BNP or NT-proBNP is elevated, and echocardiography provides the ejection fraction and structural cause. Initial therapy includes loop diuretics for congestion and guideline-directed therapy depending on ejection fraction.",
    ["cardiology", "dyspnea"], "Heart failure: confirm with BNP and echocardiography."),
  c1(PPR, "Abdominal pain", "easy",
    "A 40-year-old woman with obesity has 6 hours of severe right upper quadrant pain after a fatty meal, with fever, nausea and a positive Murphy sign. Which test should be obtained first?",
    [
      ["Right upper quadrant ultrasonography", "First-line imaging for suspected cholecystitis."],
      ["Colonoscopy", "Not indicated."],
      ["Upper endoscopy", "Not first for biliary disease."],
      ["Barium swallow", "Not indicated."],
      ["CT of the head", "Unrelated."],
    ], 0,
    "Fever, right upper quadrant pain and a positive Murphy sign suggest acute cholecystitis, usually from a gallstone impacted in the cystic duct. Ultrasonography shows stones, wall thickening, pericholecystic fluid and a sonographic Murphy sign. Treatment includes fluids, antibiotics and cholecystectomy.",
    ["gastroenterology", "abdominal pain"], "RUQ pain with Murphy sign: ultrasonography."),
  c1(PPR, "Headache", "easy",
    "A 27-year-old woman has recurrent episodes of unilateral throbbing headache lasting 6 hours, preceded by flickering visual lights, with nausea and photophobia. Neurologic examination is normal. Which is the most appropriate acute treatment?",
    [
      ["A triptan such as sumatriptan", "Abortive therapy for moderate to severe migraine."],
      ["Opioid analgesics", "Not first-line due to risk of dependence and medication-overuse headache."],
      ["Daily propranolol as an acute remedy", "Used for prevention, not acute treatment."],
      ["High-flow oxygen", "Used for cluster headache."],
      ["Lumbar puncture", "Not indicated without red flags."],
    ], 0,
    "Migraine with aura features unilateral throbbing pain, nausea, photophobia and a visual aura preceding the headache. Acute therapy is an NSAID or triptan (contraindicated in coronary disease or hemiplegic migraine), with antiemetics. Prophylaxis includes propranolol, topiramate, amitriptyline or CGRP-targeted therapies.",
    ["neurology", "headache"], "Migraine: triptan or NSAID acutely, beta-blocker or topiramate for prevention."),
  c1(PPR, "Fatigue and weight gain", "moderate",
    "A 45-year-old woman has 6 months of fatigue, constipation, cold intolerance, dry skin and a 4-kg weight gain. Examination shows delayed relaxation of the ankle reflexes. Which laboratory pattern is expected?",
    [
      ["Elevated TSH with low free T4", "Primary hypothyroidism."],
      ["Low TSH with high free T4", "Hyperthyroidism."],
      ["Low TSH with low free T4", "Central hypothyroidism."],
      ["Elevated TSH with high free T4", "Suggests a TSH-secreting adenoma or thyroid hormone resistance."],
      ["Normal TSH and normal free T4", "Would not explain the features of hypothyroidism."],
    ], 0,
    "Primary hypothyroidism, most often Hashimoto thyroiditis in iodine-sufficient regions, produces fatigue, cold intolerance, constipation, weight gain and delayed relaxation of deep tendon reflexes. TSH is high and free T4 is low. Treatment is levothyroxine titrated to TSH.",
    ["endocrine", "presentation"], "High TSH and low free T4 = primary hypothyroidism."),
  c1(PPR, "Back pain", "difficult",
    "A 52-year-old man with lung cancer reports severe low back pain with new bilateral leg weakness, saddle numbness and urinary retention for 12 hours. Rectal tone is decreased. What is the most appropriate next step?",
    [
      ["Emergent MRI of the spine", "Suspected cauda equina or cord compression requires immediate imaging."],
      ["Outpatient physical therapy referral", "Dangerous delay."],
      ["Oral NSAIDs and reassessment in 2 weeks", "Delays diagnosis of a surgical emergency."],
      ["Lumbar spine radiograph only", "Insufficient for assessing neural compression."],
      ["Spinal manipulation", "Contraindicated in suspected cauda equina syndrome."],
    ], 0,
    "Back pain with saddle anesthesia, bladder or bowel dysfunction, bilateral leg weakness or reduced rectal tone suggests cauda equina syndrome or spinal cord compression (particularly with known malignancy). Emergent MRI, neurosurgical or oncologic consultation, and high-dose dexamethasone for malignant cord compression are required. Manipulation is contraindicated.",
    ["neurology", "emergency", "osteopathic"], "Saddle anesthesia and retention: emergent MRI; no spinal manipulation."),
];

const c1n = note("comlex-level-1");
const C1_M: SeedMaterial[] = [
  c1n(OPP, "Fryette principles", "Vertebral Motion: Fryette Principles and Naming Dysfunction", "Neutral versus non-neutral mechanics and how to name and treat somatic dysfunction.", 6, `
# Vertebral Motion and Somatic Dysfunction

## Fryette principles
1. **Type I (neutral):** In a neutral spine, sidebending and rotation of a **group** of vertebrae occur to **opposite** sides. Typical of thoracic and lumbar group curves.
2. **Type II (non-neutral):** When a vertebra is flexed or extended, sidebending and rotation occur to the **same** side. Involves a **single segment**.
3. **Third principle:** When motion is introduced in one plane, it modifies (reduces) motion in the other planes.

The **cervical spine (C2-C7)** has its own rule: sidebending and rotation occur to the **same** side. At the atlanto-occipital joint, sidebending and rotation go to opposite sides, and the atlanto-axial joint is mostly rotation.

## Naming a somatic dysfunction
- Named by the **position of ease**, that is, the direction in which motion is most **free**.
- Example: **T6 ERS left** is extended, rotated and sidebent left; flexion, right rotation and right sidebending are restricted.
- Group (neutral) dysfunctions: **NSLRR** means neutral, sidebent left, rotated right.

## TART diagnosis
- **T**enderness
- **A**symmetry
- **R**estricted range of motion
- **T**issue texture change (acute: boggy, warm, edematous; chronic: ropy, cool, fibrotic)

## Landmarks
- Spinous process of T7 at the inferior angle of the scapula; T3 at the spine of the scapula; L4 at the iliac crest.
- Rule of threes (thoracic): in T1-T3 the transverse process is at the same level as the spinous process; T4-T6 half a segment below; T7-T9 a full segment below.

## Direct versus indirect treatment
- **Direct:** moves the segment toward the restrictive barrier (muscle energy, HVLA, articulatory).
- **Indirect:** moves away from the barrier toward the position of ease (counterstrain, facilitated positional release).

## Pelvic checks
- **Standing flexion test** positive: iliosacral (innominate) dysfunction on the side with the higher PSIS excursion.
- **Seated flexion test** positive: sacral dysfunction.

## Treatment choice
Match technique to the patient's age, acuity and tissue condition. Use gentler indirect techniques for the acutely painful, elderly or osteoporotic patient.

> **High-yield / exam traps:** Freedom of motion names the dysfunction, but the exam may ask for the restricted motion, which is the opposite. Cervical coupling (same side) differs from thoracic neutral coupling (opposite sides). Do not confuse type I (group) and type II (single segment).
`),
  c1n(OPP, "OMT techniques", "Osteopathic Manipulative Techniques at a Glance", "A compact comparison of the major OMT techniques, their mechanics and key cautions.", 7, `
# Osteopathic Manipulative Techniques

## Active versus passive
- **Active:** the patient helps (muscle energy, respiratory assistance).
- **Passive:** the physician acts alone (HVLA, counterstrain, myofascial release, articulation).

## Major techniques
| Technique | Direct or indirect | Mechanism |
|---|---|---|
| **Muscle energy** | Direct | Patient isometric contraction against counterforce at the barrier |
| **HVLA (thrust)** | Direct | Short, quick force through the restrictive barrier |
| **Counterstrain** | Indirect | Tender point is held in a position of comfort for about 90 seconds |
| **Facilitated positional release** | Indirect | Compression plus positional ease to reduce hypertonicity |
| **Myofascial release** | Direct or indirect | Sustained load on fascia until release is felt |
| **Articulatory** | Direct | Low-velocity, moderate-amplitude repetitive motion of a joint |
| **Soft tissue** | Direct | Stretching, kneading, and traction of muscle |
| **Lymphatic pumps** | - | Enhance lymph flow (thoracic pump, pedal pump, thoracic inlet release) |
| **Craniosacral/cranial** | - | Subtle motion of the primary respiratory mechanism |
| **Chapman points** | - | Reflexive, neurolymphatic points used for diagnosis and treatment |

## Counterstrain (Jones)
- Locate the **tender point**, shorten the muscle by positioning toward ease, hold until the tenderness drops by about 70% or more, then return slowly to neutral.

## Cautions and contraindications
- **Cervical HVLA:** caution with vertebrobasilar insufficiency, particularly rotation with extension.
- **Osteoporosis, anticoagulation, bone metastasis, acute fracture:** avoid thrust and forceful techniques.
- **Atlantoaxial instability** (rheumatoid arthritis, Down syndrome): avoid cervical HVLA.
- **Lymphatic techniques:** use caution with local infection, abscess or uncontrolled congestive heart failure.
- **Spinal cord compression or cauda equina:** do not manipulate; arrange emergent imaging.
- Patient refusal and lack of consent are absolute contraindications to any technique.

## Documentation
Record the diagnosis (region, segment, motion restrictions), the technique used, the patient response and any adverse effects.

## Osteopathic tenets (reminder)
The person is a unit of body, mind and spirit; the body can self-regulate and self-heal; structure and function are reciprocally related; and rational treatment is based on these ideas.

> **High-yield / exam traps:** Know which techniques are direct versus indirect. Counterstrain and facilitated positional release are indirect. HVLA is not appropriate for an elderly osteoporotic patient with acute thoracic back pain; gentler techniques are.
`),
  c1n(FBS, "Hypersensitivity", "Hypersensitivity Reactions: Types I to IV", "Mechanisms, timing and typical clinical examples for the four classic hypersensitivity types.", 6, `
# Hypersensitivity Reactions

## Overview
| Type | Mechanism | Timing | Examples |
|---|---|---|---|
| **I** | IgE on mast cells and basophils; cross-linking releases histamine | Minutes | Anaphylaxis, allergic rhinitis, urticaria, asthma |
| **II** | IgG or IgM against cell surface or matrix antigens; complement and cytotoxic cells | Minutes to hours | Autoimmune hemolytic anemia, Goodpasture syndrome, hyperacute rejection, Graves disease |
| **III** | Antigen-antibody immune complex deposition | 1-3 weeks (serum sickness), hours (Arthus) | Serum sickness, lupus nephritis, post-streptococcal glomerulonephritis |
| **IV** | T-cell mediated | 48-72 hours | Contact dermatitis, tuberculin test, graft rejection |

## Type I details
- **Sensitization** requires prior exposure and IgE production.
- **Early phase:** histamine, tryptase; **late phase:** leukotrienes and eosinophils.
- **Treatment of anaphylaxis:** intramuscular **epinephrine** first, then airway support, fluids, antihistamines and steroids as adjuncts.

## Type II subtypes
- **Cytotoxic or complement-mediated:** transfusion reactions, hemolytic disease of the newborn.
- **Stimulating antibodies:** Graves disease (TSH receptor).
- **Blocking antibodies:** myasthenia gravis (acetylcholine receptor).

## Type III details
- Serum complement is **low** during active disease.
- Immune complexes lodge in kidney, joints and vessels.
- **Arthus reaction:** local reaction after repeat antigen injection.

## Type IV details
- **Delayed-type:** sensitized T cells and macrophages (TB skin test, contact dermatitis from nickel or poison ivy).
- **Cytotoxic T cell:** graft-versus-host and acute cellular rejection.
- Patch tests diagnose contact allergy.

## Transplant rejection
- **Hyperacute:** minutes, preformed antibody (type II).
- **Acute:** weeks to months, T cells.
- **Chronic:** months to years, vascular fibrosis.

## Diagnostic tips
- Skin prick testing and serum specific IgE support Type I.
- Direct Coombs test detects antibody on red cells in type II hemolysis.
- Biopsy with immunofluorescence identifies immune-complex disease.

> **High-yield / exam traps:** Serum sickness and post-streptococcal glomerulonephritis are both type III. Contact dermatitis is type IV despite the dramatic skin findings. Graves disease and myasthenia gravis are type II (antibodies against receptors), not type III.
`),
  c1n(HPR, "Prevention and screening", "Levels of Prevention and Core Screening Recommendations", "Classify preventive interventions and recall common adult screening starting points.", 6, `
# Prevention and Screening

## Levels of prevention
- **Primary:** prevent disease (immunization, seat belts, smoking prevention).
- **Secondary:** detect early disease (mammography, colonoscopy, Pap smear).
- **Tertiary:** limit complications of established disease (rehabilitation, insulin and foot care for diabetes).
- **Quaternary:** protect patients from unnecessary or excessive medical intervention.

## Core screening starting points (average risk, U.S. task force-style recommendations)
- **Cervical cancer:** begin at 21; cytology every 3 years for ages 21-29; 30-65 cytology every 3 years, HPV testing every 5 years, or co-testing every 5 years.
- **Colorectal cancer:** begin at 45; options include colonoscopy every 10 years and annual fecal immunochemical testing.
- **Lung cancer:** annual low-dose CT for ages 50-80 with at least a 20 pack-year history who currently smoke or quit within the past 15 years.
- **Abdominal aortic aneurysm:** one-time ultrasonography for men aged 65-75 who have ever smoked.
- **Hypertension, lipids, diabetes:** screen adults at regular intervals, with diabetes screening for those with overweight or obesity.
- **Hepatitis C:** screen all adults at least once.

## Adult immunizations (selected)
- Influenza vaccine yearly.
- Tdap once, then Td or Tdap every 10 years; Tdap in every pregnancy.
- Recombinant zoster vaccine for age 50 and older (two doses).
- HPV vaccine routinely at age 11-12, catch-up through age 26.
- Pneumococcal vaccine according to age and risk factors.

## Behavior change
- **Stages of change:** precontemplation, contemplation, preparation, action, maintenance (and relapse).
- **Motivational interviewing:** open-ended questions, affirmation, reflective listening, summary; avoid confrontation.
- **5 A's for tobacco:** Ask, Advise, Assess, Assist, Arrange.

## Communication
Use **teach-back**, plain language and trained interpreters. Avoid using family members to interpret.

## Screening principles
A good screening test is for a common, serious, detectable disease with an accepted treatment, using an acceptable and accurate test. Beware of lead-time and length-time bias.

> **High-yield / exam traps:** Know which stage a patient is in before choosing the intervention. Cervical screening does not begin at 30. Lung cancer screening requires both age and pack-year criteria.
`),
  c1n(PPR, "Chest pain", "Chest Pain: A Differential Diagnosis Framework", "A systematic approach to chest pain based on life-threatening causes, history and first tests.", 7, `
# Chest Pain Differential

Start by excluding the **"deadly six"**: acute coronary syndrome, pulmonary embolism, aortic dissection, tension pneumothorax, esophageal rupture and cardiac tamponade.

## First steps
- ABCs, vital signs in both arms if dissection is possible, oxygen if hypoxic.
- **12-lead ECG within 10 minutes**, cardiac troponin, chest radiograph.

## Key conditions
| Condition | Clues | First test or treatment |
|---|---|---|
| **Acute coronary syndrome** | Pressure, exertional, radiation to arm or jaw, diaphoresis | ECG, troponin, aspirin |
| **Aortic dissection** | Sudden tearing pain to the back, pulse or blood pressure differential, widened mediastinum | CT angiography, impulse control with beta-blocker |
| **Pulmonary embolism** | Pleuritic pain, dyspnea, risk factors | CT pulmonary angiography or D-dimer by probability |
| **Pericarditis** | Pleuritic, positional pain, friction rub, diffuse ST elevation | NSAID plus colchicine |
| **Pneumothorax** | Sudden pleuritic pain and dyspnea, tall thin young man | Chest radiograph |
| **GERD or esophageal spasm** | Burning, postprandial, relieved by antacid | Trial of PPI |
| **Costochondritis** | Reproducible chest wall tenderness | Reassurance, NSAIDs |
| **Herpes zoster** | Dermatomal pain preceding vesicles | Antiviral therapy |
| **Panic attack** | Paresthesias, palpitations, fear | Exclude organic causes |

## Risk stratification for ACS
- **HEART score** components: History, ECG, Age, Risk factors, Troponin.
- Serial troponins at 0 and 1-3 hours (or per assay protocol).
- ST elevation: immediate reperfusion with PCI, ideally within 90 minutes of first medical contact.

## Osteopathic considerations
Somatic dysfunction of the thoracic spine and ribs can cause or accompany chest pain, but musculoskeletal pain is a diagnosis of exclusion after life-threatening causes are excluded. Viscerosomatic changes at T1-T5 may accompany cardiac disease.

## Pearls
- Women, older adults and diabetics may present atypically (dyspnea, nausea, fatigue).
- Cocaine-associated chest pain: benzodiazepines, aspirin; avoid beta-blockers initially.
- Do not attribute chest pain to anxiety or musculoskeletal causes before risk is assessed.

> **High-yield / exam traps:** Anticoagulants and thrombolytics must not be given before excluding aortic dissection when the presentation fits. Nitroglycerin is avoided with right ventricular infarction and recent phosphodiesterase-5 inhibitor use.
`, "guide"),
];

const c1f = fc("comlex-level-1");
const C1_F: SeedFlashcard[] = [
  c1f(OPP, "Fryette principles", "Fryette principle 1?", "Neutral (type I) mechanics: sidebending and rotation occur to opposite sides in a group of vertebrae."),
  c1f(OPP, "Fryette principles", "Fryette principle 2?", "Non-neutral (type II) mechanics: sidebending and rotation to the same side in a single segment."),
  c1f(OPP, "Thoracic somatic dysfunction", "What does TART stand for in structural diagnosis?", "Tissue texture change, Asymmetry, Restricted range of motion, Tenderness."),
  c1f(OPP, "Counterstrain", "In counterstrain, which direction is the patient positioned?", "Toward the position of ease (away from the restrictive barrier); an indirect technique."),
  c1f(OPP, "Muscle energy technique", "Which OMT technique uses patient isometric contraction against a counterforce?", "Muscle energy."),
  c1f(OPP, "Rib mechanics", "Which motion do ribs 1-5 primarily use?", "Pump handle motion (anteroposterior diameter)."),
  c1f(OPP, "Cervical spine mechanics", "Coupled motion in C2-C7?", "Sidebending and rotation to the same side."),
  c1f(OPP, "Osteopathic tenets", "State the four osteopathic tenets.", "Person is a unit of body, mind and spirit; self-regulating and self-healing; structure and function reciprocally interrelated; rational treatment based on these."),
  c1f(OPP, "Viscerosomatic reflexes", "Describe acute versus chronic tissue texture changes.", "Acute: boggy, warm, edematous, tender; chronic: ropy, cool, fibrotic, less tender."),
  c1f(OPP, "OMT selection", "Which OMT techniques are indirect?", "Counterstrain and facilitated positional release (also some myofascial release)."),
  c1f(FBS, "Hypersensitivity", "Which hypersensitivity type causes serum sickness?", "Type III (immune complex), typically 1-2 weeks after exposure."),
  c1f(FBS, "Warfarin pharmacology", "Which clotting factors does warfarin reduce?", "II, VII, IX and X (and proteins C and S)."),
  c1f(FBS, "Hemochromatosis", "Gene and common mutation in hereditary hemochromatosis?", "HFE gene, C282Y mutation (autosomal recessive)."),
  c1f(FBS, "Oxygen-hemoglobin dissociation", "List factors that shift the oxyhemoglobin curve to the right.", "Increased CO2, H+ (lower pH), 2,3-BPG, exercise and temperature."),
  c1f(FBS, "Neural tube defects", "Which prenatal screening marker rises with open neural tube defects?", "Maternal serum alpha-fetoprotein."),
  c1f(HPR, "Behavior change", "Name the stages of change.", "Precontemplation, contemplation, preparation, action, maintenance (and relapse)."),
  c1f(HPR, "Levels of prevention", "What is secondary prevention?", "Early detection and treatment of disease before symptoms, such as screening."),
  c1f(HPR, "Health literacy", "What is teach-back?", "Asking the patient to restate instructions in their own words to confirm understanding."),
  c1f(PPR, "Chest pain", "Name the life-threatening causes of chest pain to exclude first.", "Acute coronary syndrome, pulmonary embolism, aortic dissection, tension pneumothorax, esophageal rupture and tamponade."),
  c1f(PPR, "Back pain", "Red flags for cauda equina syndrome?", "Saddle anesthesia, urinary retention or incontinence, bilateral leg weakness and decreased rectal tone."),
];

/* @@APPEND@@ */
