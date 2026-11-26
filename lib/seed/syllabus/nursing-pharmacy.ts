/**
 * Blueprint-style syllabus data for nursing and pharmacy exams.
 * Topic names only, organised after publicly described test plans and
 * competency statements (NCSBN, AANP/ANCC, NABP). No questions or
 * proprietary material.
 */
import type { SeedTaxonomy } from "../catalog";

type Kind = SeedTaxonomy["kind"];

const node = (kind: Kind, name: string, children: string[], weight?: number): SeedTaxonomy =>
  weight === undefined ? { kind, name, children } : { kind, name, weight, children };
const subject = (name: string, children: string[]) => node("subject", name, children);
const system = (name: string, children: string[]) => node("system", name, children);
const section = (name: string, weight: number | undefined, children: string[]) => node("section", name, children, weight);
const category = (name: string, weight: number, children: string[]) => node("category", name, children, weight);
/** Prefix every topic with a sub-area label, e.g. "Cardiovascular – Heart failure care". */
const sub = (area: string, items: string[]) => items.map((i) => `${area} – ${i}`);

/* ================================================================== */
/* NCLEX-RN (subjects and body systems only)                           */
/* ================================================================== */
const RN_ADULT_HEALTH = [
  ...sub("Cardiovascular", [
    "Hypertension and hypertensive crisis care", "Coronary artery disease and angina care", "Acute coronary syndrome and MI care",
    "Heart failure care", "Dysrhythmia recognition and management", "Valvular heart disease care", "Peripheral arterial and venous disease care", "Cardiac surgery, pacemaker and ICD care",
  ]),
  ...sub("Endocrine", [
    "Type 1 and type 2 diabetes mellitus care", "DKA and hyperosmolar hyperglycemic state", "Hypoglycemia management", "Hypothyroidism and myxedema coma",
    "Hyperthyroidism and thyroid storm", "Adrenal insufficiency and Cushing syndrome", "Pituitary disorders: SIADH and diabetes insipidus",
  ]),
  ...sub("Gastrointestinal", [
    "Peptic ulcer disease and GI bleeding", "Inflammatory bowel disease care", "Bowel obstruction and perforation", "Cirrhosis, portal hypertension and hepatic encephalopathy",
    "Hepatitis A, B and C care", "Pancreatitis care", "Cholecystitis and cholelithiasis",
  ]),
  ...sub("Hematologic", [
    "Anemias: iron-deficiency, pernicious and aplastic", "Sickle cell crisis care", "Leukemias and lymphomas", "Bleeding and clotting disorders (DIC, ITP, hemophilia)",
    "Blood transfusion administration and reactions", "Venous thromboembolism and anticoagulation care",
  ]),
  ...sub("Immune and Infectious Disease", [
    "HIV and AIDS care", "Tuberculosis care", "Sepsis and septic shock recognition", "Autoimmune disorders: SLE and rheumatoid arthritis",
    "Hypersensitivity and anaphylaxis", "Organ transplant and immunosuppression care",
  ]),
  ...sub("Integumentary", [
    "Burn injury phases and fluid resuscitation", "Pressure injury staging and prevention", "Wound healing and dressing selection", "Skin cancer and lesion recognition",
    "Cellulitis, herpes zoster and skin infections",
  ]),
  ...sub("Multisystem", [
    "Shock states: hypovolemic, cardiogenic, distributive and obstructive", "Multiple organ dysfunction syndrome", "Trauma and mass-casualty triage", "Cancer care: chemotherapy and radiation",
    "Oncologic emergencies", "Palliative and end-of-life care", "Poisoning and overdose management",
  ]),
  ...sub("Musculoskeletal", [
    "Fracture care, casts and traction", "Osteoporosis and osteomyelitis", "Total joint replacement care", "Osteoarthritis and gout", "Amputation and prosthesis care",
    "Compartment syndrome and fat embolism",
  ]),
  ...sub("Neurologic", [
    "Ischemic and hemorrhagic stroke care", "Increased intracranial pressure and head injury", "Spinal cord injury and autonomic dysreflexia", "Seizure disorders and status epilepticus",
    "Multiple sclerosis, Parkinson disease and myasthenia gravis", "Meningitis and encephalitis", "Glasgow Coma Scale and neuro checks",
  ]),
  ...sub("Reproductive", [
    "Benign prostatic hyperplasia and prostate cancer", "Breast cancer and mastectomy care", "Sexually transmitted infections", "Menopause and hormone therapy", "Testicular and cervical cancer screening",
  ]),
  ...sub("Respiratory", [
    "Asthma and COPD care", "Pneumonia and aspiration", "Pulmonary embolism care", "Acute respiratory failure and ARDS", "Chest tubes and pneumothorax care",
    "Mechanical ventilation and tracheostomy care",
  ]),
  ...sub("Urinary and Renal", [
    "Acute kidney injury phases", "Chronic kidney disease and dialysis care", "Urinary tract infection and pyelonephritis", "Renal calculi and urinary obstruction",
    "Kidney transplant care", "Urinary catheter and bladder irrigation care",
  ]),
  ...sub("Visual and Auditory", [
    "Glaucoma and cataract care", "Retinal detachment and macular degeneration", "Hearing loss, otitis and Meniere disease", "Eye and ear surgery postoperative care",
  ]),
];

const RN_CHILD_HEALTH = [
  ...sub("Growth and Development", [
    "Infant milestones and feeding", "Toddler development and toilet training", "Preschool development and play", "School-age development and industry vs inferiority",
    "Adolescent development and identity", "Erikson, Piaget and Freud applied to children", "Childhood immunization schedule", "Anticipatory guidance and injury prevention by age",
    "Pediatric vital signs and assessment norms", "Child abuse and neglect recognition",
  ]),
  ...sub("Pediatric Cardiovascular", ["Congenital heart defects: acyanotic and cyanotic", "Kawasaki disease", "Rheumatic fever", "Heart failure in infants and children"]),
  ...sub("Pediatric Respiratory", ["Croup, epiglottitis and bronchiolitis", "Asthma in children", "Cystic fibrosis care", "Foreign body aspiration and RSV"]),
  ...sub("Pediatric Neurologic", ["Febrile and afebrile seizures", "Bacterial meningitis in children", "Cerebral palsy and hydrocephalus", "Neural tube defects"]),
  ...sub("Pediatric Gastrointestinal", ["Pyloric stenosis and intussusception", "Gastroenteritis and dehydration in children", "Hirschsprung disease and celiac disease", "Cleft lip and palate care"]),
  ...sub("Pediatric Endocrine and Metabolic", ["Type 1 diabetes in children", "Congenital hypothyroidism and PKU"]),
  ...sub("Pediatric Hematologic and Oncologic", ["Sickle cell disease in children", "Hemophilia and ITP", "Childhood leukemia, Wilms tumor and neuroblastoma"]),
  ...sub("Pediatric Musculoskeletal", ["Developmental dysplasia of the hip", "Scoliosis and clubfoot", "Legg-Calve-Perthes disease and osteogenesis imperfecta"]),
  ...sub("Pediatric Genitourinary and Infectious", ["Nephrotic syndrome and glomerulonephritis", "Vesicoureteral reflux and UTI in children", "Communicable childhood diseases", "Fluid balance and pediatric dehydration"]),
  ...sub("Pediatric Safety and Poisoning", ["Lead poisoning", "Burns and drowning prevention", "Pediatric medication dosing safety"]),
];

const RN_FUNDAMENTALS = [
  ...sub("Fluid, Electrolytes and Acid-Base", [
    "Hyponatremia and hypernatremia", "Hypokalemia and hyperkalemia", "Calcium and magnesium imbalances", "Phosphate imbalances", "Fluid volume deficit and excess",
    "Isotonic, hypotonic and hypertonic solutions", "Respiratory and metabolic acidosis", "Respiratory and metabolic alkalosis", "ABG interpretation with compensation",
  ]),
  ...sub("Safety and Infection Control", [
    "Standard and transmission-based precautions", "Sterile technique and PPE sequence", "Fall prevention and restraint use", "Fire, radiation and electrical safety",
    "Medication and patient identification safety", "Aseptic technique and surgical asepsis", "Reporting sentinel events and incident reports",
  ]),
  ...sub("Basic Care and Comfort", [
    "Hygiene and skin integrity", "Mobility, positioning and transfers", "Sleep and rest promotion", "Pain assessment and nonpharmacologic comfort measures",
    "Assistive devices and gait training", "Complementary and alternative therapies",
  ]),
  ...sub("Nutrition and Elimination", [
    "Therapeutic and special diets", "Enteral feeding and tube care", "Total parenteral nutrition care", "Dysphagia and aspiration precautions", "Bowel elimination and constipation management",
    "Urinary elimination and catheterization", "Ostomy appliance care", "Intake and output measurement",
  ]),
  ...sub("Nursing Process", [
    "Assessment and data collection", "Nursing diagnosis and prioritization", "Planning and outcomes", "Implementation and delegation of tasks", "Evaluation and revision of the plan of care",
    "Documentation and SBAR handoff",
  ]),
  ...sub("Assessment", [
    "Head-to-toe physical assessment", "Vital sign interpretation", "Heart and lung sound assessment", "Abdominal assessment sequence", "Neurologic and mental status assessment",
    "Laboratory value interpretation", "Pain and skin assessment tools",
  ]),
  ...sub("Skills", [
    "Peripheral IV insertion and maintenance", "Central line and PICC care", "Wound and dressing care", "Specimen collection", "Oxygen therapy and suctioning",
    "Preoperative and postoperative care", "Blood glucose monitoring", "Enema and bowel training", "Nasogastric tube insertion and verification", "Cast and traction care basics",
  ]),
];

const RN_MATERNAL = [
  ...sub("Antepartum", [
    "Conception, fetal development and placenta function", "Signs of pregnancy and prenatal visits", "Nägele rule and gravida/para notation", "Prenatal screening and diagnostic tests",
    "Nutrition and weight gain in pregnancy", "Hyperemesis gravidarum", "Gestational diabetes", "Preeclampsia, eclampsia and HELLP", "Placenta previa and abruptio placentae",
    "Ectopic pregnancy and spontaneous abortion", "Rh incompatibility and RhoGAM", "Preterm labor and tocolytics", "Substance use and infections in pregnancy",
  ]),
  ...sub("Labor and Delivery", [
    "Signs of true vs false labor", "Stages and phases of labor", "Fetal heart rate patterns and interventions", "Leopold maneuvers and fetal position",
    "Pain management in labor and epidural care", "Induction and augmentation of labor", "Cesarean birth care", "Dystocia, cord prolapse and uterine rupture",
    "Amniotic fluid embolism and shoulder dystocia", "Magnesium sulfate safety", "Postpartum hemorrhage prevention",
  ]),
  ...sub("Newborn", [
    "Immediate newborn assessment and Apgar scoring", "Newborn reflexes and gestational age assessment", "Thermoregulation and cold stress", "Newborn feeding: breast and formula",
    "Newborn screening and vitamin K", "Hyperbilirubinemia and phototherapy", "Neonatal hypoglycemia", "Respiratory distress and prematurity", "Neonatal abstinence syndrome",
    "Congenital anomalies and birth injuries", "Circumcision and cord care",
  ]),
  ...sub("Postpartum", [
    "Fundal assessment and lochia", "BUBBLE-EHE postpartum assessment", "Postpartum hemorrhage and uterine atony", "Breastfeeding support and engorgement", "Postpartum depression and psychosis",
    "Perineal care and episiotomy", "Postpartum infection and thromboembolism", "Contraception methods and teaching", "Family planning and infertility",
  ]),
];

const RN_MENTAL = [
  ...sub("Foundations and Therapeutic Communication", [
    "Therapeutic communication techniques", "Nontherapeutic communication blocks", "Nurse-client relationship phases", "Mental status examination", "Defense mechanisms",
    "Milieu therapy and group therapy", "Psychiatric legal issues: voluntary and involuntary admission", "Restraint and seclusion standards", "Client rights in psychiatric care",
  ]),
  ...sub("Mood and Personality", [
    "Major depressive disorder", "Bipolar disorder and mania", "Suicide assessment and precautions", "Borderline personality disorder", "Antisocial and narcissistic personality disorders",
    "Electroconvulsive therapy care", "Schizophrenia and psychotic disorders", "Antipsychotic safety: EPS and NMS",
  ]),
  ...sub("Anxiety, Trauma and Addiction", [
    "Generalized anxiety and panic disorder", "Obsessive-compulsive disorder", "Phobias and exposure therapy", "PTSD and acute stress disorder", "Alcohol withdrawal and delirium tremens",
    "Opioid, stimulant and sedative withdrawal", "Substance use disorder treatment models", "Eating disorders: anorexia, bulimia and binge eating", "Somatic symptom and dissociative disorders",
    "Crisis intervention and disaster response", "Grief, loss and the stages of dying", "Abuse, violence and victim care",
  ]),
  ...sub("Cognitive and Developmental", [
    "Delirium vs dementia vs depression", "Alzheimer disease care", "Autism spectrum disorder", "ADHD and conduct disorders", "Intellectual disability", "Tourette and tic disorders",
    "Psychopharmacology teaching: lithium, SSRIs and MAOIs",
  ]),
];

const RN_PHARM = [
  ...sub("Cardiovascular Drugs", [
    "ACE inhibitors and ARBs", "Beta blockers and calcium channel blockers", "Diuretics: loop, thiazide and potassium-sparing", "Digoxin toxicity", "Antiarrhythmics",
    "Nitrates and antianginals", "Statins and lipid-lowering agents", "Vasopressors and inotropes",
  ]),
  ...sub("Blood and Anticoagulant Drugs", [
    "Warfarin and INR monitoring", "Heparin, LMWH and aPTT/anti-Xa", "DOACs and reversal agents", "Antiplatelets and thrombolytics", "Iron, B12 and erythropoietin",
  ]),
  ...sub("Respiratory Drugs", ["Bronchodilators and inhaled corticosteroids", "Leukotriene inhibitors and mucolytics", "Antitussives and decongestants"]),
  ...sub("Endocrine Drugs", ["Insulin types, onset and peak", "Oral antidiabetic agents", "Thyroid and antithyroid drugs", "Corticosteroids and adrenal suppression", "Hormone and contraceptive therapies"]),
  ...sub("Gastrointestinal Drugs", ["Proton pump inhibitors and H2 blockers", "Antiemetics", "Laxatives and antidiarrheals", "Antacids and sucralfate"]),
  ...sub("Neurologic and Psychiatric Drugs", [
    "Antiepileptics", "Antiparkinson agents", "Opioid analgesics and antagonists", "NSAIDs and acetaminophen", "Benzodiazepines and sedative-hypnotics",
    "Antidepressants", "Antipsychotics", "Mood stabilizers", "Cholinesterase inhibitors", "Muscle relaxants",
  ]),
  ...sub("Anti-infective Drugs", [
    "Penicillins and cephalosporins", "Aminoglycosides and vancomycin levels", "Macrolides, fluoroquinolones and tetracyclines", "Antituberculars", "Antivirals and antiretrovirals", "Antifungals",
  ]),
  ...sub("Immune, Oncology and Other Drugs", ["Immunosuppressants", "Antineoplastics and chemotherapy safety", "Antidotes and reversal agents", "Herbal supplements and interactions", "Drugs for gout and osteoporosis"]),
  ...sub("Medication Administration", [
    "Rights of medication administration", "Oral, topical and transdermal administration", "Injection techniques: IM, SC, intradermal", "IV push, piggyback and infusion pumps", "Medication errors and reconciliation",
    "Controlled substance handling and wasting", "High-alert medication safeguards", "Dosage calculation and weight-based dosing", "Geriatric and pediatric medication considerations", "Adverse drug reactions and reporting",
  ]),
];

const RN_MANAGEMENT = [
  ...sub("Assignment and Delegation", [
    "Five rights of delegation", "Tasks for RN, LPN/LVN and UAP", "Assignment of stable vs unstable clients", "Supervision and accountability", "Scope of practice limits", "Delegating in home and long-term care",
  ]),
  ...sub("Prioritization", [
    "ABC and Maslow prioritization", "Acute vs chronic and stable vs unstable", "Triage in the emergency department", "Disaster and mass-casualty triage", "Prioritizing multiple client assignments",
    "Safety and the nursing process in prioritization",
  ]),
  ...sub("Management Concepts", [
    "Leadership styles", "Conflict resolution and negotiation", "Change management", "Quality improvement and PDSA", "Staffing, scheduling and resource use", "Case management and discharge planning",
    "Interprofessional collaboration and referrals", "Performance appraisal and staff development", "Evidence-based practice in management",
  ]),
  ...sub("Ethics and Legal", [
    "Informed consent", "Advance directives and DNR orders", "Confidentiality and HIPAA", "Client rights and advocacy", "Negligence, malpractice and torts", "Mandatory reporting",
    "Ethical principles and dilemmas", "Incident reporting and risk management", "Nurse practice acts and licensure",
  ]),
  ...sub("Clinical Judgment: Recognize Cues", ["Identify relevant assessment findings", "Distinguish normal from abnormal data", "Recognize cues in client history and trends"]),
  ...sub("Clinical Judgment: Analyze Cues", ["Link findings to client conditions", "Cluster cues into patterns", "Identify missing or conflicting information"]),
  ...sub("Clinical Judgment: Prioritize Hypotheses", ["Rank client problems by urgency", "Differentiate likely causes of deterioration", "Choose the most important problem to address"]),
  ...sub("Clinical Judgment: Generate Solutions", ["Select expected outcomes", "Identify appropriate interventions", "Determine contraindicated actions"]),
  ...sub("Clinical Judgment: Take Actions", ["Choose the first and best nursing action", "Prioritize orders and implement the plan", "Communicate and escalate with SBAR"]),
  ...sub("Clinical Judgment: Evaluate Outcomes", ["Compare observed with expected outcomes", "Decide whether the plan is effective", "Revise the plan of care"]),
];

const RN_SYSTEMS: SeedTaxonomy[] = [
  system("Cardiovascular", [
    "Heart failure: left vs right findings", "Myocardial infarction and troponin trends", "Stable and unstable angina", "Atrial fibrillation and anticoagulation", "Ventricular tachycardia and fibrillation",
    "Heart blocks and pacing", "Essential hypertension and target pressures", "Hypertensive emergency", "Deep vein thrombosis and Virchow triad", "Peripheral artery disease claudication",
    "Abdominal aortic aneurysm monitoring", "Cardiomyopathies", "Endocarditis, pericarditis and myocarditis", "Cardiac cath and angioplasty aftercare", "CABG postoperative monitoring",
    "12-lead ECG and rhythm strip basics", "Cardiac output, preload and afterload", "Cardiogenic shock", "Lipid disorders and risk reduction", "Digoxin, amiodarone and nitroglycerin nursing priorities",
  ]),
  system("Endocrine", [
    "Diabetes mellitus classification and diagnostic criteria", "Diabetic ketoacidosis management", "Hyperosmolar hyperglycemic state", "Hypoglycemia treatment (rule of 15)", "Sick-day management for diabetes",
    "Diabetic foot and chronic complications", "Insulin pump and sliding-scale use", "Graves disease and thyroidectomy care", "Hashimoto thyroiditis", "Addison disease and adrenal crisis", "Cushing syndrome",
    "Pheochromocytoma", "Hyperparathyroidism and hypocalcemic tetany", "SIADH vs diabetes insipidus", "Acromegaly and growth hormone disorders", "Metabolic syndrome", "Hemoglobin A1c and glucose targets",
  ]),
  system("Gastrointestinal", [
    "GERD and hiatal hernia", "Peptic ulcer and H. pylori therapy", "Upper and lower GI bleeding", "Crohn disease vs ulcerative colitis", "Diverticulitis", "Small and large bowel obstruction",
    "Appendicitis and rebound tenderness", "Cirrhosis complications: ascites and varices", "Hepatic encephalopathy and ammonia", "Viral hepatitis transmission and precautions", "Acute and chronic pancreatitis",
    "Cholecystectomy care", "Colorectal cancer screening and surgery", "Bariatric surgery and dumping syndrome", "NG tube decompression", "Colostomy and ileostomy teaching",
    "Total parenteral nutrition complications", "Nausea, vomiting and diarrhea management", "Clostridioides difficile infection",
  ]),
  system("Hematologic", [
    "Iron-deficiency anemia", "Pernicious anemia and B12", "Aplastic anemia", "Sickle cell vaso-occlusive crisis", "Polycythemia vera", "Thrombocytopenia and HIT", "Hemophilia and von Willebrand disease",
    "Disseminated intravascular coagulation", "Neutropenia and protective precautions", "Acute and chronic leukemia", "Hodgkin and non-Hodgkin lymphoma", "Multiple myeloma", "Transfusion reactions",
    "Blood component therapy", "Bone marrow transplant care", "CBC and coagulation lab interpretation", "Anticoagulant monitoring: INR, PTT, anti-Xa",
  ]),
  system("Immune and Infectious Disease", [
    "HIV staging, CD4 and viral load", "Opportunistic infections in AIDS", "Tuberculosis screening and airborne precautions", "Sepsis bundles and qSOFA", "Systemic lupus erythematosus", "Rheumatoid arthritis",
    "Scleroderma and Sjogren syndrome", "Type I to IV hypersensitivity reactions", "Anaphylaxis management", "Latex allergy", "Immunodeficiency and neutropenic care", "MRSA, VRE and C. diff precautions",
    "Meningococcal disease and droplet precautions", "Measles, varicella and airborne isolation", "Influenza, COVID-19 and respiratory viruses", "Hepatitis B, C and bloodborne exposure", "Vaccines in adults",
    "Lyme disease and vector-borne illness", "Graft-versus-host disease", "Transplant rejection signs",
  ]),
  system("Integumentary", [
    "Burn depth and rule of nines", "Parkland formula and fluid resuscitation", "Emergent, acute and rehabilitative burn phases", "Pressure injury stages", "Braden scale and prevention", "Venous vs arterial vs diabetic ulcers",
    "Wound healing phases and complications", "Dehiscence and evisceration", "Cellulitis and abscess care", "Herpes zoster and pain management", "Psoriasis and eczema", "Melanoma and ABCDE assessment",
    "Basal and squamous cell carcinoma", "Scabies, pediculosis and ringworm", "Skin grafts and donor-site care",
  ]),
  system("Multisystem", [
    "Hypovolemic shock", "Septic shock", "Anaphylactic shock", "Neurogenic shock", "SIRS and MODS", "ARDS and refractory hypoxemia", "Disseminated intravascular coagulation in critical illness",
    "Trauma primary survey (ABCDE)", "Major trauma: chest, abdomen and head", "Chemical, biological and radiological emergencies", "Triage categories in disasters", "Hospice and palliative care principles",
    "Pain pathways and multimodal analgesia", "Opioid overdose and naloxone", "Acetaminophen and salicylate toxicity", "Carbon monoxide and cyanide poisoning", "Heat stroke and hypothermia", "Fluid resuscitation and vasopressor titration",
  ]),
  system("Musculoskeletal", [
    "Open vs closed fractures", "Cast, splint and traction checks", "Hip fracture and ORIF care", "Total knee and hip replacement precautions", "Osteoporosis prevention and bisphosphonates", "Osteoarthritis management",
    "Gout and uric acid", "Osteomyelitis", "Carpal tunnel and repetitive strain", "Muscular dystrophy", "Low back pain and herniated disc", "Amputation stump care", "Fat embolism and compartment syndrome",
    "Crutch, cane and walker use", "Rhabdomyolysis", "Paget disease and bone tumors",
  ]),
  system("Neurologic", [
    "Ischemic stroke and tPA criteria", "Hemorrhagic stroke and aneurysm precautions", "Transient ischemic attack", "Cushing triad and ICP monitoring", "Traumatic brain injury", "Spinal shock and autonomic dysreflexia",
    "Seizure precautions and first aid", "Parkinson disease care", "Multiple sclerosis exacerbations", "Myasthenia gravis crisis", "Guillain-Barre ascending paralysis", "Amyotrophic lateral sclerosis",
    "Bacterial meningitis and lumbar puncture care", "Brain tumor and craniotomy care", "Glasgow Coma Scale", "Cranial nerve assessment", "Headache and migraine", "Huntington disease", "Neurogenic bladder and bowel",
  ]),
  system("Reproductive", [
    "Benign prostatic hyperplasia and TURP care", "Prostate cancer and PSA screening", "Testicular torsion and self-exam", "Erectile dysfunction", "Endometriosis and fibroids", "Pelvic inflammatory disease",
    "Chlamydia, gonorrhea and syphilis", "Herpes and HPV", "Cervical cancer screening", "Breast self-exam and mammography", "Ovarian and endometrial cancer", "Menopause symptoms and therapy",
    "Infertility evaluation", "Contraception counseling", "Hysterectomy postoperative care",
  ]),
  system("Respiratory", [
    "Asthma attack management", "COPD: chronic bronchitis and emphysema", "Oxygen titration in COPD", "Pneumonia types and positioning", "Pulmonary embolism recognition", "ARDS and ventilator settings",
    "Pneumothorax and tension pneumothorax", "Chest tube drainage system", "Pleural effusion and thoracentesis", "Tracheostomy suctioning and care", "Pulmonary tuberculosis therapy", "Lung cancer and lobectomy care",
    "Cystic fibrosis in adults", "Sleep apnea and CPAP", "Pulse oximetry and capnography", "Arterial blood gas analysis", "Incentive spirometry and airway clearance", "Acute respiratory failure",
  ]),
  system("Urinary and Renal", [
    "Prerenal, intrarenal and postrenal AKI", "Oliguric and diuretic phases of AKI", "CKD stages and GFR", "Hemodialysis access care", "Peritoneal dialysis and peritonitis", "Renal diet: potassium, phosphorus and protein",
    "Glomerulonephritis and nephrotic syndrome", "Urinary tract infection and cystitis", "Pyelonephritis", "Kidney stones and lithotripsy", "Urinary incontinence types", "Bladder cancer and urostomy",
    "Kidney transplant rejection", "BUN, creatinine and urinalysis interpretation", "Contrast nephropathy prevention", "Indwelling catheter and CAUTI prevention",
  ]),
  system("Visual and Auditory", [
    "Open-angle vs angle-closure glaucoma", "Cataract surgery aftercare", "Retinal detachment emergency", "Macular degeneration", "Diabetic retinopathy", "Conjunctivitis and eye infection",
    "Eye injury and chemical splash irrigation", "Visual acuity and Snellen testing", "Otitis media and tympanostomy tubes", "Meniere disease", "Conductive vs sensorineural hearing loss", "Hearing aid and cochlear implant care",
    "Tinnitus and ototoxic drugs", "Cerumen impaction and ear irrigation", "Vertigo and fall precautions",
  ]),
];

const NCLEX_RN: SeedTaxonomy[] = [
  subject("Adult Health", RN_ADULT_HEALTH),
  subject("Child Health", RN_CHILD_HEALTH),
  subject("Fundamentals", RN_FUNDAMENTALS),
  subject("Maternal and Newborn Health", RN_MATERNAL),
  subject("Mental Health", RN_MENTAL),
  subject("Pharmacology", RN_PHARM),
  subject("Management of Care", RN_MANAGEMENT),
  ...RN_SYSTEMS,
];

/* ================================================================== */
/* NCLEX-PN                                                            */
/* ================================================================== */
const NCLEX_PN: SeedTaxonomy[] = [
  category("Coordinated Care", 21, [
    "Advance directives and DNR documentation", "Advocacy for client rights", "Client rights and dignity", "Collaboration with the interdisciplinary team", "Concepts of management and supervision",
    "Confidentiality and HIPAA", "Continuity of care and handoff report", "Delegation to unlicensed assistive personnel", "Ethical practice and dilemmas", "Informed consent and the LPN role",
    "Information technology and the electronic health record", "Legal responsibilities: negligence and malpractice", "Establishing priorities of care", "Quality improvement and performance improvement",
    "Referrals and community resources", "Resource management and cost-effective care", "Staff assignment and acuity", "Case management and care coordination", "Client rights in restraint use",
    "Chain of command and conflict resolution", "Incident and occurrence reporting", "Reporting client changes to the RN or provider", "Scope of practice for the practical nurse", "Verifying and clarifying provider orders",
  ]),
  category("Safety and Infection Prevention and Control", 13, [
    "Accident and error prevention", "Emergency response plans and disaster preparedness", "Ergonomic principles and body mechanics", "Handling hazardous and infectious materials", "Home safety and fall prevention",
    "Reporting incidents, errors and irregularities", "Safe use of equipment", "Security plans and abduction prevention", "Use of restraints and safety devices", "Standard precautions and hand hygiene",
    "Transmission-based precautions", "Surgical asepsis and sterile field", "Medical asepsis", "Protective environment for immunosuppressed clients", "Outbreaks and surveillance of healthcare-associated infection",
    "Fire safety (RACE and PASS)", "Radiation safety", "Oxygen safety", "Pediatric and infant safety", "Latex allergy precautions", "Poison prevention", "Bioterrorism preparedness",
  ]),
  category("Health Promotion and Maintenance", 9, [
    "Aging process and age-related changes", "Ante-, intra- and postpartum care", "Developmental stages and transitions", "Health promotion programs", "Health screening and early detection",
    "High-risk behaviors and lifestyle choices", "Immunizations and vaccine schedules", "Principles of teaching and learning", "Self-care and wellness counseling", "Newborn and infant care",
    "Family planning and contraception", "Growth and development milestones", "Disease prevention and risk reduction", "Prenatal care and patient teaching", "Genetic counseling referrals",
    "Techniques of physical assessment", "Preventive care across the lifespan", "Sexuality and reproductive health", "Cultural and community influences on health",
  ]),
  category("Psychosocial Integrity", 10, [
    "Abuse and neglect: child, elder and domestic violence", "Behavioral interventions and de-escalation", "Chemical dependency and withdrawal", "Coping mechanisms and defense mechanisms", "Crisis intervention",
    "Cultural awareness and spiritual care", "End-of-life care and grief", "Family dynamics and support systems", "Grief and loss stages", "Mental health concepts and disorders", "Religious and spiritual influences on health",
    "Sensory and perceptual alterations", "Stress management", "Support systems and community resources", "Therapeutic communication techniques", "Therapeutic environment", "Suicide risk and precautions",
    "Unexpected body image changes", "Violence prevention and workplace safety", "Delirium, dementia and confusion care", "Anxiety and panic care", "Psychotropic drug monitoring",
  ]),
  category("Basic Care and Comfort", 9, [
    "Assistive devices and mobility aids", "Elimination: bowel and bladder care", "Mobility and immobility complications", "Nonpharmacological comfort interventions", "Nutrition and oral hydration",
    "Personal hygiene and grooming", "Rest and sleep promotion", "Feeding and swallowing precautions", "Skin integrity and pressure injury prevention", "Pain assessment and relief", "Palliative comfort measures",
    "Positioning and turning schedules", "Range of motion and exercise", "Ostomy and catheter care", "Enteral feeding tube care", "Diet modification: therapeutic diets", "Complementary and alternative therapies",
    "Bed making and environment comfort", "Oral care of the unconscious client", "Intake and output monitoring",
  ]),
  category("Pharmacological Therapies", 15, [
    "Adverse effects, contraindications and interactions", "Dosage calculations", "Expected actions and outcomes of medications", "Medication administration: rights and routes", "Parenteral therapies and IV fluids",
    "Pharmacological pain management", "Blood and blood product administration", "Central venous access care", "Controlled substance administration", "Medication errors and safety", "Documentation of medication administration",
    "Intravenous therapy: infiltration and phlebitis", "Medication teaching for clients and families", "Pediatric and geriatric medication safety", "Antibiotic therapy and culture timing", "Anticoagulation therapy",
    "Cardiovascular medications", "Respiratory medications", "Diabetic medications and insulin administration", "Psychotropic medications", "Herbal and dietary supplement interactions", "Antidotes and toxicity",
    "Gastrointestinal medications", "Topical, ophthalmic and otic administration", "Injection technique and site selection",
  ]),
  category("Reduction of Risk Potential", 12, [
    "Changes and abnormalities in vital signs", "Diagnostic tests and preparation", "Laboratory values and critical results", "Potential for complications of diagnostic tests", "Potential for complications from surgical procedures",
    "Potential for complications of health alterations", "System-specific assessments", "Therapeutic procedures", "Specimen collection and handling", "Preoperative teaching and consent verification",
    "Postoperative monitoring and recovery", "Pulse oximetry and capillary blood glucose", "Neurovascular checks", "Respiratory risk: aspiration and atelectasis", "Cardiovascular risk: DVT and bleeding prevention",
    "Wound infection and dehiscence prevention", "Urinary retention and catheter-associated risk", "Dysrhythmia and ECG monitoring", "Intake and output as risk indicators", "Radiologic and contrast procedures",
    "Gastrointestinal endoscopy preparation", "Conscious sedation monitoring", "Pressure injury risk assessment",
  ]),
  category("Physiological Adaptation", 11, [
    "Alterations in body systems", "Fluid and electrolyte imbalances", "Hemodynamics and perfusion", "Illness management of chronic conditions", "Medical emergencies and first aid",
    "Pathophysiology of common disorders", "Unexpected response to therapies", "Acid-base imbalance recognition", "Shock recognition and response", "Respiratory distress and oxygenation",
    "Cardiac arrest and basic life support", "Stroke recognition and first response", "Diabetic emergencies: hypo- and hyperglycemia", "Seizure management", "Burn injury care", "Pain from chronic illness",
    "Renal failure and dialysis", "Infection and sepsis", "Cancer care and symptom management", "Musculoskeletal injury and immobilization", "Neurologic deficits and rehabilitation",
  ]),
  subject("Fundamentals", [
    "Nursing process for the LPN/LVN", "Vital signs and measurement technique", "Head-to-toe assessment", "Documentation and charting", "Infection control practices", "Body mechanics and safe patient handling",
    "Hygiene and bathing", "Wound care and dressing changes", "Specimen collection and testing", "Oxygen administration and suctioning", "Urinary catheter insertion and care", "Enteral nutrition and tube feeding",
    "Pre- and postoperative nursing care", "Therapeutic communication in practice", "Client education techniques", "Cultural competence in care", "Death and dying care", "Fluid and electrolyte basics",
    "Pain management basics", "Mobility and ambulation skills",
  ]),
  subject("Medical-Surgical", [
    "Med-Surg – Cardiovascular: heart failure, MI and hypertension", "Med-Surg – Respiratory: COPD, asthma and pneumonia", "Med-Surg – Neurologic: stroke, seizures and spinal cord injury", "Med-Surg – Gastrointestinal: GERD, ulcers and bowel disorders",
    "Med-Surg – Hepatic and pancreatic disorders", "Med-Surg – Renal and urinary: UTI, calculi and kidney failure", "Med-Surg – Endocrine: diabetes, thyroid and adrenal disorders", "Med-Surg – Musculoskeletal: fractures, arthritis and osteoporosis",
    "Med-Surg – Integumentary: burns, wounds and pressure injuries", "Med-Surg – Hematologic: anemia and bleeding disorders", "Med-Surg – Immune and infectious: HIV, TB and sepsis", "Med-Surg – Oncology: cancer treatments and complications",
    "Med-Surg – Sensory: eye and ear disorders", "Med-Surg – Male and female reproductive disorders", "Med-Surg – Perioperative and surgical care", "Med-Surg – Emergency and trauma care", "Med-Surg – Geriatric considerations",
    "Med-Surg – Intravenous therapy and blood administration", "Med-Surg – Pain and palliative care", "Med-Surg – Rehabilitation and chronic illness",
  ]),
  subject("Pharmacology", [
    "Pharm – Pharmacokinetics and pharmacodynamics basics", "Pharm – Cardiac glycosides and antiarrhythmics", "Pharm – Antihypertensives and diuretics", "Pharm – Anticoagulants and antiplatelets", "Pharm – Antilipemics",
    "Pharm – Bronchodilators and respiratory agents", "Pharm – Antibiotics by class", "Pharm – Antivirals, antifungals and antiparasitics", "Pharm – Insulins and oral hypoglycemics", "Pharm – Corticosteroids and thyroid agents",
    "Pharm – Analgesics: opioids, NSAIDs and adjuvants", "Pharm – Anticonvulsants and antiparkinsonian drugs", "Pharm – Antidepressants, anxiolytics and antipsychotics", "Pharm – Gastrointestinal agents",
    "Pharm – Oxytocics, tocolytics and contraceptives", "Pharm – Vitamins, minerals and electrolyte replacements", "Pharm – Chemotherapy and immunosuppressants", "Pharm – Eye, ear and topical agents", "Pharm – Dosage calculation methods",
    "Pharm – Drug toxicity and antidotes",
  ]),
  subject("Maternal/Newborn", [
    "OB – Antepartum assessment and prenatal teaching", "OB – Normal pregnancy changes by trimester", "OB – High-risk pregnancy: preeclampsia and gestational diabetes", "OB – Bleeding disorders in pregnancy", "OB – Labor and delivery stages",
    "OB – Fetal monitoring basics", "OB – Pain management in labor", "OB – Cesarean birth and VBAC", "OB – Postpartum assessment and complications", "OB – Breastfeeding support", "OB – Newborn assessment and Apgar",
    "OB – Newborn reflexes and normal variations", "OB – Newborn complications: jaundice and hypoglycemia", "OB – Contraception and family planning", "OB – Postpartum mood disorders", "OB – Infertility and pregnancy loss",
    "OB – Medications in obstetrics",
  ]),
  subject("Pediatrics", [
    "Peds – Growth and development by age", "Peds – Immunization schedule and teaching", "Peds – Pediatric assessment and vital signs", "Peds – Respiratory illnesses: croup, asthma, RSV", "Peds – Congenital heart disease",
    "Peds – Gastrointestinal: pyloric stenosis, dehydration", "Peds – Neurologic: seizures, meningitis, hydrocephalus", "Peds – Musculoskeletal: scoliosis and DDH", "Peds – Hematologic: sickle cell and leukemia",
    "Peds – Childhood infections and communicable diseases", "Peds – Genetic and chromosomal disorders", "Peds – Child safety and poisoning", "Peds – Child abuse recognition", "Peds – Pediatric medication safety",
    "Peds – Hospitalized child and play therapy", "Peds – Pain assessment tools for children", "Peds – Chronic illness: diabetes and cystic fibrosis",
  ]),
  subject("Mental Health", [
    "Psych – Therapeutic communication", "Psych – Anxiety disorders", "Psych – Depressive and bipolar disorders", "Psych – Schizophrenia and psychosis", "Psych – Personality disorders",
    "Psych – Substance use and withdrawal", "Psych – Eating disorders", "Psych – Dementia and delirium", "Psych – Suicide and crisis care", "Psych – Child and adolescent disorders", "Psych – Psychotropic medication safety",
    "Psych – Electroconvulsive therapy", "Psych – Milieu and group therapy", "Psych – Legal and ethical issues in psychiatry", "Psych – Trauma and stress disorders", "Psych – Grief and coping",
  ]),
  subject("Leadership for PN scope", [
    "Leadership – Delegation and the five rights", "Leadership – Supervising unlicensed assistive personnel", "Leadership – LPN/LVN versus RN scope of practice", "Leadership – Prioritizing care for a group of clients",
    "Leadership – Time management and organization", "Leadership – Team communication and SBAR", "Leadership – Conflict resolution", "Leadership – Legal responsibilities and documentation", "Leadership – Ethical decision making",
    "Leadership – Quality and safety initiatives", "Leadership – Long-term care and home health leadership", "Leadership – Client advocacy and rights", "Leadership – Change and teamwork", "Leadership – Orientation and mentoring",
    "Leadership – Reporting and chain of command", "Leadership – Infection control leadership role",
  ]),
];

/* ================================================================== */
/* Nursing School (pre-licensure coursework)                           */
/* ================================================================== */
const NURSING_SCHOOL: SeedTaxonomy[] = [
  subject("Fundamentals of Nursing", [
    "History and theories of nursing", "Nursing process and care plans", "Critical thinking and clinical reasoning", "Vital signs technique and interpretation", "Hygiene and skin care", "Safe patient handling and mobility",
    "Infection prevention: asepsis and PPE", "Medication administration basics", "Wound care and dressings", "Urinary and bowel elimination", "Oxygenation and airway care", "Nutrition and feeding assistance",
    "Documentation and informatics", "Patient teaching principles", "Pain and comfort", "Sleep and rest", "Fluid, electrolyte and acid-base basics", "Perioperative nursing", "Cultural humility and spirituality",
    "Death, dying and grief care", "Safety and fall prevention",
  ]),
  subject("Health Assessment", [
    "Health history interview", "General survey and vital signs", "Skin, hair and nails assessment", "Head, eyes, ears, nose and throat", "Neck and thyroid", "Thorax and lung assessment", "Heart and peripheral vascular assessment",
    "Breast and axillary assessment", "Abdominal assessment", "Musculoskeletal assessment", "Neurologic and cranial nerve exam", "Genitourinary assessment", "Pediatric assessment adaptations", "Older adult assessment adaptations",
    "Pain assessment", "Nutritional assessment", "Mental status and psychosocial assessment", "Documentation of assessment findings", "Abnormal findings and red flags",
  ]),
  subject("Pathophysiology", [
    "Cellular injury, adaptation and death", "Inflammation and tissue repair", "Immune response and hypersensitivity", "Genetics and inheritance patterns", "Neoplasia and cancer biology", "Fluid, electrolyte and acid-base disorders",
    "Pathophysiology of hypertension and atherosclerosis", "Pathophysiology of heart failure", "Pathophysiology of asthma and COPD", "Pathophysiology of diabetes mellitus", "Pathophysiology of renal failure", "Pathophysiology of stroke",
    "Pathophysiology of liver disease", "Pathophysiology of shock", "Stress and the general adaptation syndrome", "Pain pathways", "Alterations in hemostasis", "Infection and host defenses", "Thyroid and adrenal pathophysiology", "Musculoskeletal pathophysiology",
  ]),
  subject("Pharmacology", [
    "Pharmacokinetics: absorption, distribution, metabolism, excretion", "Pharmacodynamics and receptor theory", "Drug names, classifications and schedules", "Adverse drug reactions and interactions", "Autonomic nervous system drugs",
    "Cardiovascular drugs", "Antihypertensives and diuretics", "Anticoagulants and thrombolytics", "Respiratory drugs", "Gastrointestinal drugs", "Antibiotics and resistance", "Antivirals and antifungals", "Endocrine and diabetes drugs",
    "Analgesics and anesthetics", "CNS drugs: anticonvulsants and sedatives", "Psychotropic drugs", "Hormonal and reproductive drugs", "Immunosuppressants and biologics", "Oncology drugs", "Pediatric and geriatric pharmacology",
    "Herbal and complementary products", "Medication safety and error prevention",
  ]),
  subject("Medical-Surgical Nursing I", [
    "Perioperative care and anesthesia", "Pain management and palliative care", "Cardiovascular disorders", "Hypertension and peripheral vascular disease", "Respiratory disorders", "Oxygen therapy and chest drainage",
    "Gastrointestinal disorders", "Hepatobiliary and pancreatic disorders", "Renal and urinary disorders", "Fluid and electrolyte imbalances", "Diabetes and endocrine disorders", "Wound and pressure injury management",
    "Anemia and hematologic disorders", "Infection control in acute care", "Sensory disorders: eye and ear", "Care of the client with a tracheostomy", "Intravenous therapy management", "Nutrition support: enteral and parenteral",
  ]),
  subject("Medical-Surgical Nursing II", [
    "Neurologic disorders", "Stroke and spinal cord injury", "Musculoskeletal trauma and orthopedic care", "Burns and complex wounds", "Oncology and chemotherapy care", "Immune and autoimmune disorders", "HIV and AIDS",
    "Acute kidney injury and dialysis", "Complex cardiac conditions and dysrhythmias", "Complex respiratory failure", "Liver failure and transplant", "Shock and sepsis", "Emergency and trauma nursing", "Disaster nursing",
    "Care of the surgical oncology client", "Rehabilitation nursing", "Integumentary disorders", "End-of-life and hospice care",
  ]),
  subject("Maternal-Newborn Nursing", [
    "Reproductive anatomy and physiology", "Prenatal care and fetal development", "Physiologic changes of pregnancy", "High-risk pregnancy conditions", "Labor stages and nursing management", "Fetal monitoring interpretation",
    "Cesarean and operative birth", "Postpartum physiology and care", "Postpartum complications", "Newborn adaptation and assessment", "Newborn nutrition and breastfeeding", "High-risk newborn conditions", "Contraception and family planning",
    "Infertility and women's health", "Obstetric emergencies", "Pregnancy loss and perinatal grief", "Cultural influences on childbearing",
  ]),
  subject("Pediatric Nursing", [
    "Growth and development theories", "Family-centered pediatric care", "Pediatric assessment and vital signs", "Pediatric pain assessment", "Immunizations and well-child visits", "Hospitalization and play therapy", "Pediatric respiratory conditions",
    "Congenital and acquired heart disease", "Pediatric gastrointestinal and nutritional disorders", "Pediatric neurologic conditions", "Pediatric endocrine disorders", "Pediatric oncology and hematology", "Genetic disorders in children",
    "Pediatric infections and communicable diseases", "Child maltreatment and safety", "Medication administration in children", "Chronic illness and children with special needs", "Adolescent health issues",
  ]),
  subject("Mental Health Nursing", [
    "Therapeutic communication", "Mental health assessment and mental status exam", "Anxiety and trauma-related disorders", "Mood disorders and suicide", "Schizophrenia spectrum disorders", "Personality disorders", "Substance use and addictive disorders",
    "Eating disorders", "Neurocognitive disorders", "Child and adolescent psychiatric disorders", "Psychopharmacology principles", "Somatic therapies and ECT", "Crisis, violence and de-escalation", "Legal and ethical issues in psychiatric care",
    "Grief, loss and coping", "Group and family therapy", "Recovery model and community mental health",
  ]),
  subject("Community and Public Health Nursing", [
    "Public health principles and the core functions", "Epidemiology and disease surveillance", "Levels of prevention", "Health promotion and health education", "Community assessment", "Environmental health", "Communicable disease control",
    "Immunization programs", "Vulnerable and underserved populations", "Home health and hospice", "Occupational and school health", "Global health and migration", "Disaster and bioterrorism preparedness", "Health policy and access to care",
    "Social determinants of health", "Family and cultural assessment", "Screening programs and reporting requirements", "Violence and abuse prevention in communities",
  ]),
  subject("Gerontological Nursing", [
    "Theories of aging", "Normal age-related physiologic changes", "Geriatric assessment tools", "Polypharmacy and Beers criteria", "Falls and mobility", "Delirium, dementia and depression", "Elder abuse and neglect", "Urinary incontinence in older adults",
    "Nutrition and hydration in aging", "Sensory changes in older adults", "Skin integrity and pressure injuries in older adults", "Pain in older adults", "Chronic disease management", "Long-term care and assisted living", "Advance care planning",
    "Sleep in older adults", "Sexuality and aging", "Rehabilitation and functional status",
  ]),
  subject("Leadership and Management in Nursing", [
    "Leadership theories and styles", "Management functions", "Delegation and supervision", "Prioritization and time management", "Communication and conflict resolution", "Teamwork and interprofessional collaboration",
    "Quality improvement and patient safety", "Staffing and scheduling", "Health care economics and finance", "Healthcare delivery models", "Change theory", "Professional development and mentoring", "Nursing informatics",
    "Risk management and incident reporting", "Case management", "Magnet and accreditation concepts", "Professional ethics and advocacy", "Workplace violence and bullying",
  ]),
  subject("Nutrition", [
    "Macronutrients and energy balance", "Vitamins and minerals", "Water and electrolyte balance", "Dietary Reference Intakes and MyPlate", "Nutritional screening and assessment", "Therapeutic diets", "Nutrition in diabetes",
    "Nutrition in cardiovascular and renal disease", "Enteral and parenteral nutrition", "Nutrition in pregnancy and lactation", "Infant and child nutrition", "Nutrition for older adults", "Eating disorders and obesity", "Food allergies and intolerances",
    "Food safety and foodborne illness", "Cultural and religious dietary practices", "Drug-nutrient interactions", "Malnutrition and refeeding syndrome",
  ]),
  subject("Nursing Research and Evidence-Based Practice", [
    "The research process", "Qualitative vs quantitative designs", "Research ethics and IRB", "Searching and appraising literature", "Levels of evidence", "Sampling and bias", "Reliability and validity", "Descriptive and inferential statistics",
    "Interpreting p-values and confidence intervals", "Clinical practice guidelines", "PICOT questions", "Implementing evidence-based change", "Systematic reviews and meta-analyses", "Quality improvement vs research", "Dissemination and translation",
  ]),
  subject("Critical Care Nursing", [
    "Hemodynamic monitoring", "Mechanical ventilation and weaning", "Arterial lines and central venous pressure", "Shock management", "Acute respiratory distress syndrome", "Cardiac arrest and ACLS principles", "Vasoactive drips and titration",
    "Acute kidney injury and CRRT", "Neurocritical care and ICP", "Sepsis bundles", "Sedation, analgesia and delirium prevention", "Continuous ECG and dysrhythmia interpretation", "Acid-base and ABG interpretation", "Burn and trauma critical care",
    "Family-centered ICU care", "Ethical issues in critical care",
  ]),
  subject("Ethics, Law and Professional Issues", [
    "ANA Code of Ethics", "Ethical principles: autonomy, beneficence, nonmaleficence, justice", "Informed consent and capacity", "Confidentiality and HIPAA", "Nurse practice acts and licensure", "Negligence, malpractice and liability", "Patient rights and advocacy",
    "Advance directives and end-of-life decisions", "Mandatory reporting", "Documentation as legal record", "Professional boundaries and social media", "Impaired nurse and peer reporting", "Scope of practice and delegation law", "Whistleblowing and moral distress",
    "Cultural competence and diversity", "Healthcare disparities",
  ]),
  subject("Dosage Calculations", [
    "Systems of measurement and conversions", "Interpreting medication labels and orders", "Oral dosage by formula", "Dimensional analysis", "Liquid and tablet dosing", "Parenteral injection dosing", "Reconstitution of powdered drugs",
    "IV flow rate by gravity (gtt/min)", "IV pump rates (mL/hr)", "Weight-based dosing (mg/kg)", "Pediatric dose safety checks", "Heparin and insulin dosing", "Critical-care infusion rates", "Intake and output totals", "BSA-based dosing", "Rounding rules and safe dose ranges",
  ]),
  system("Cardiovascular", ["Cardiac anatomy and conduction", "Cardiac cycle and output", "Heart sounds and murmurs", "Hypertension", "Coronary artery disease", "Heart failure", "Dysrhythmias", "Vascular disorders", "Cardiac medications", "Congenital heart disease in children"]),
  system("Respiratory", ["Respiratory anatomy and gas exchange", "Lung sounds", "Oxygen therapy devices", "Asthma", "COPD", "Pneumonia and tuberculosis", "Pulmonary embolism", "Respiratory failure", "Chest drainage systems", "Respiratory medications"]),
  system("Neurologic", ["Neuroanatomy and cranial nerves", "Level of consciousness", "Stroke", "Seizures", "Head and spinal cord injury", "Neurodegenerative disease", "CNS infections", "Increased intracranial pressure", "Neurologic medications"]),
  system("Gastrointestinal", ["GI anatomy and digestion", "GERD and ulcer disease", "Inflammatory bowel disease", "Bowel obstruction", "Liver and gallbladder disorders", "Pancreatic disorders", "GI bleeding", "Ostomy care", "GI medications"]),
  system("Renal and Urinary", ["Nephron function and urine formation", "Acute kidney injury", "Chronic kidney disease", "Dialysis", "Urinary tract infection", "Urinary incontinence and retention", "Renal calculi", "Fluid and electrolyte regulation"]),
  system("Endocrine", ["Endocrine glands and hormone feedback", "Diabetes mellitus", "Thyroid disorders", "Adrenal disorders", "Pituitary disorders", "Parathyroid and calcium disorders", "Endocrine emergencies", "Endocrine medications"]),
  system("Hematologic", ["Blood components and hematopoiesis", "Anemias", "Coagulation disorders", "Leukemia and lymphoma", "Transfusion therapy", "Anticoagulant therapy", "Sickle cell disease", "Laboratory tests of blood"]),
  system("Musculoskeletal", ["Bone, joint and muscle anatomy", "Fractures and immobilization", "Osteoporosis", "Arthritis", "Joint replacement", "Back pain and spinal disorders", "Amputation", "Muscle disorders"]),
  system("Integumentary", ["Skin structure and function", "Pressure injuries", "Burns", "Skin infections", "Skin cancer", "Wound healing", "Dermatitis and psoriasis", "Topical therapy"]),
  system("Immune and Infectious Disease", ["Innate and adaptive immunity", "Hypersensitivity", "Autoimmune disease", "Immunodeficiency and HIV", "Healthcare-associated infection", "Bacterial and viral infections", "Fungal and parasitic infections", "Immunizations"]),
  system("Reproductive", ["Male reproductive disorders", "Female reproductive disorders", "Sexually transmitted infections", "Pregnancy and childbirth", "Menopause and hormone therapy", "Contraception", "Reproductive cancers", "Infertility"]),
  system("Sensory", ["Eye anatomy and vision disorders", "Glaucoma and cataracts", "Retinal disorders", "Ear anatomy and hearing", "Otitis and Meniere disease", "Hearing loss and communication", "Taste, smell and touch", "Eye and ear medication administration"]),
  system("Psychiatric and Mental Health", ["Brain chemistry and neurotransmitters", "Anxiety disorders", "Mood disorders", "Psychotic disorders", "Substance use disorders", "Personality disorder care", "Crisis states", "Psychotropic medication management"]),
];

/* ================================================================== */
/* Family Nurse Practitioner (AANP / ANCC style domains)               */
/* ================================================================== */
const FNP: SeedTaxonomy[] = [
  section("Assessment", 20, [
    "Comprehensive health history and review of systems", "Focused and problem-oriented history", "Family, social and sexual history", "Functional and developmental assessment", "Head-to-toe physical examination technique",
    "Pediatric growth chart and developmental screening", "Geriatric functional assessment tools", "Mental health screening instruments (PHQ-9, GAD-7)", "Substance use screening (CAGE, AUDIT, CRAFFT)", "Intimate partner violence and abuse screening",
    "Fall risk and cognitive screening (MMSE, MoCA)", "Nutritional and obesity assessment (BMI, waist circumference)", "Cultural and health literacy assessment", "Social determinants of health screening", "Pain assessment across populations",
    "Interpretation of CBC, CMP and lipid panels", "Thyroid, A1c and urinalysis interpretation", "Selection of imaging studies and ECG interpretation", "Pulmonary function test interpretation", "Genetic and family risk assessment",
    "Review of medication and supplement use", "Vision, hearing and dental screening", "Occupational and environmental exposure history", "Advance care planning discussion",
  ]),
  section("Diagnosis", 20, [
    "Developing a differential diagnosis", "Hypothesis generation from history and exam", "Diagnostic test sensitivity, specificity and predictive value", "Pretest probability and clinical decision rules", "Recognizing red flag symptoms",
    "Distinguishing acute from chronic presentations", "Evaluating abnormal laboratory findings", "Interpreting radiographic findings", "Common pediatric diagnoses by age", "Common geriatric syndromes", "Distinguishing viral from bacterial illness",
    "Diagnosing mental health conditions using DSM-5 criteria", "Recognizing emergent conditions requiring transfer", "Diagnosing multisystem and autoimmune disease", "Diagnosing skin lesions", "Diagnostic reasoning in chest pain and dyspnea",
    "Diagnostic reasoning in abdominal pain", "Diagnostic reasoning in headache and dizziness", "Diagnostic reasoning in fatigue and weight change", "Diagnosing sexually transmitted infections", "Differentiating pediatric rashes and fever syndromes", "ICD-10 coding and documentation of diagnoses",
  ]),
  section("Plan and Management", 40, [
    "Evidence-based treatment guidelines (JNC, ADA, GOLD, GINA)", "Pharmacokinetics and pharmacodynamics in primary care", "Drug interactions and adverse effects", "Prescribing for pregnant and lactating patients", "Prescribing for pediatric patients and weight-based dosing",
    "Prescribing for older adults and Beers criteria", "Renal and hepatic dose adjustment", "Controlled substance prescribing and PDMP use", "Antihypertensive and antihyperlipidemic therapy", "Antidiabetic therapy and insulin regimens",
    "Antibiotic selection and stewardship", "Asthma and COPD pharmacotherapy", "Antidepressant and anxiolytic pharmacotherapy", "Analgesic and opioid-sparing pain management", "Anticoagulation management",
    "Hormonal contraception and menopausal therapy", "Thyroid hormone therapy", "Topical dermatologic therapy", "Referral and co-management with specialists", "Chronic care management and care coordination",
    "Patient education and shared decision making", "Motivational interviewing and behavior change", "Nonpharmacologic and lifestyle interventions", "Management of acute minor injuries and laceration repair", "Office procedures: joint injection, biopsy, cryotherapy",
    "Follow-up and monitoring of therapy", "Palliative and end-of-life care in primary care", "Management of polypharmacy", "Transitions of care and discharge follow-up",
  ]),
  section("Professional Role and Health Policy", 10, [
    "APRN scope of practice and state practice authority", "Prescriptive authority and DEA registration", "Credentialing, privileging and certification", "Billing, coding and E/M documentation", "Medicare, Medicaid and insurance structures",
    "HIPAA and confidentiality", "Informed consent and capacity in APRN practice", "Ethical dilemmas in primary care", "Malpractice and risk management", "Quality improvement and patient safety", "Evidence-based practice and research appraisal",
    "Interprofessional collaboration", "Health care reform and the Affordable Care Act", "Telehealth practice and regulations", "Health informatics and electronic records", "Cultural competence and health equity", "Advocacy and legislative process",
    "Mandatory reporting duties", "Population health management", "Leadership and professional development",
  ]),
  section("Health Promotion", 10, [
    "USPSTF screening recommendations", "Adult and childhood immunization schedules", "Well-child and adolescent preventive visits", "Cancer screening: breast, cervical, colorectal, lung, prostate", "Cardiovascular risk reduction",
    "Smoking cessation counseling", "Weight management and nutrition counseling", "Physical activity prescription", "Sexual health and contraception counseling", "Injury and violence prevention", "Prenatal and preconception counseling",
    "Healthy aging and fall prevention", "Osteoporosis prevention and screening", "Substance use prevention and brief intervention", "Occupational health and travel health", "Oral health promotion", "Sleep hygiene education",
    "Stress management and mental wellness", "Health literacy-focused teaching", "Community resources and public health referrals",
  ]),
  subject("Pediatrics", [
    "Newborn and infant well-child care", "Developmental milestones and delay screening", "Childhood immunization catch-up", "Otitis media and pharyngitis in children", "Pediatric asthma", "Bronchiolitis and croup", "Febrile infant and febrile seizures",
    "Pediatric UTI and enuresis", "Childhood rashes and exanthems", "Pediatric gastroenteritis and dehydration", "Failure to thrive and obesity", "Autism and ADHD evaluation", "Child abuse recognition", "Atopic dermatitis in children",
    "Pediatric anemia and lead screening", "Congenital hip and foot disorders", "Pediatric vision and hearing screening", "Nutrition and breastfeeding support", "Sports physicals in children", "Common pediatric musculoskeletal injuries",
  ]),
  subject("Adolescent Health", [
    "Pubertal development and Tanner staging", "HEADSS psychosocial assessment", "Adolescent contraception and confidentiality", "Sexually transmitted infection screening in teens", "Acne vulgaris treatment", "Adolescent depression and suicide risk",
    "Eating disorders in adolescents", "Substance use and vaping in adolescents", "Scoliosis screening", "Menstrual disorders in adolescents", "HPV vaccination", "Concussion and sports injuries", "Adolescent obesity and metabolic risk", "Gender identity and affirming care",
    "School performance and bullying", "Adolescent immunization schedule",
  ]),
  subject("Adult Primary Care", [
    "Adult preventive care and annual wellness visit", "Hypertension management", "Hyperlipidemia management", "Obesity and weight management", "Chronic fatigue and sleep disorders", "Chronic pain management in primary care", "Tobacco and alcohol use disorders",
    "Insomnia and sleep apnea", "Preoperative risk assessment", "Anemia evaluation in adults", "Chronic kidney disease in primary care", "Acute low back pain", "Headache and migraine", "Men's health: BPH and erectile dysfunction", "Travel medicine counseling",
    "Allergic rhinitis and sinusitis", "Common viral syndromes in adults", "Opioid use disorder and medication-assisted treatment",
  ]),
  subject("Geriatrics", [
    "Comprehensive geriatric assessment", "Polypharmacy and deprescribing", "Dementia diagnosis and management", "Delirium recognition", "Falls and gait disorders", "Urinary incontinence in older adults", "Osteoporosis and fracture prevention", "Pressure injuries and skin aging",
    "Depression in older adults", "Elder abuse and neglect", "Vision and hearing loss in aging", "Frailty and sarcopenia", "Advance directives and goals of care", "Caregiver strain and community supports", "Medicare wellness visit",
    "Immunizations in older adults", "Hospice eligibility and palliative care", "Driving safety and functional decline",
  ]),
  subject("Women's Health", [
    "Contraceptive methods and selection", "Abnormal uterine bleeding", "Amenorrhea and PCOS", "Dysmenorrhea and endometriosis", "Vaginitis and vulvovaginal disorders", "Cervical cancer screening and colposcopy referral", "Breast mass and mammography follow-up",
    "Menopause and hormone therapy", "Pelvic pain and pelvic inflammatory disease", "Infertility evaluation", "Pelvic organ prolapse and urinary incontinence", "Sexual dysfunction", "Intimate partner violence", "Ovarian cysts and fibroids",
    "Osteoporosis in postmenopausal women", "Sexually transmitted infections in women",
  ]),
  subject("Prenatal and Postpartum Care", [
    "Preconception counseling and folic acid", "Confirming pregnancy and dating", "Routine prenatal visit schedule", "Prenatal laboratory and genetic screening", "Nausea and vomiting of pregnancy", "Gestational diabetes screening and management",
    "Hypertensive disorders of pregnancy", "Medications in pregnancy and lactation", "Vaccines in pregnancy", "Second- and third-trimester complications", "Preterm labor warning signs", "Postpartum visit and contraception", "Postpartum depression screening",
    "Breastfeeding problems and mastitis", "Exercise and nutrition in pregnancy", "Rh isoimmunization", "Bleeding in pregnancy", "Common musculoskeletal complaints in pregnancy",
  ]),
  subject("Mental Health", [
    "Major depressive disorder treatment", "Generalized anxiety and panic disorder", "Bipolar disorder in primary care", "ADHD in adults", "PTSD and trauma-informed care", "Obsessive-compulsive disorder", "Alcohol use disorder",
    "Opioid and stimulant use disorders", "Suicide risk assessment and safety planning", "Insomnia pharmacotherapy", "Schizophrenia follow-up and metabolic monitoring", "Eating disorders", "Grief and adjustment disorders", "SSRI/SNRI adverse effects and discontinuation",
    "Lithium and mood stabilizer monitoring", "Behavioral health referral and collaborative care",
  ]),
  subject("Dermatology", [
    "Acne vulgaris and rosacea", "Eczema and contact dermatitis", "Psoriasis", "Seborrheic dermatitis", "Impetigo, cellulitis and abscess", "Tinea infections", "Scabies and lice", "Herpes simplex and zoster", "Warts and molluscum", "Actinic keratosis",
    "Basal cell, squamous cell carcinoma and melanoma", "Urticaria and angioedema", "Drug eruptions and Stevens-Johnson syndrome", "Alopecia and nail disorders", "Pressure and venous stasis ulcers", "Skin biopsy techniques",
  ]),
  subject("Eyes, Ears, Nose and Throat", [
    "Allergic and bacterial conjunctivitis", "Red eye differential and corneal abrasion", "Glaucoma and cataract screening", "Acute otitis media and otitis externa", "Cerumen impaction", "Hearing loss evaluation", "Tinnitus and vertigo", "Acute rhinosinusitis",
    "Allergic rhinitis", "Epistaxis", "Streptococcal pharyngitis", "Peritonsillar abscess and epiglottitis", "Mononucleosis", "Oral lesions and candidiasis", "Dental infection and temporomandibular disorder", "Foreign body in ear and nose", "Hordeolum and chalazion",
  ]),
  subject("Cardiovascular", [
    "Hypertension staging and therapy", "Hyperlipidemia and statin therapy", "Chest pain evaluation", "Stable ischemic heart disease", "Heart failure outpatient management", "Atrial fibrillation and anticoagulation", "Valvular disease and murmurs", "Peripheral arterial disease",
    "Deep vein thrombosis and venous insufficiency", "Syncope evaluation", "Aortic aneurysm screening", "Cardiac rehabilitation", "Pericarditis and endocarditis prophylaxis", "Cardiovascular risk calculators", "Palpitations and supraventricular tachycardia",
    "Orthostatic hypotension",
  ]),
  subject("Respiratory", [
    "Asthma stepwise management", "COPD diagnosis and management", "Community-acquired pneumonia", "Acute bronchitis and cough evaluation", "Pulmonary embolism evaluation", "Tuberculosis screening and latent infection", "Lung nodule evaluation", "Chronic cough differential",
    "Sleep apnea", "Influenza and COVID-19 outpatient care", "Interstitial lung disease", "Sarcoidosis", "Smoking cessation pharmacotherapy", "Spirometry and peak flow", "Pertussis and RSV in adults", "Oxygen therapy at home",
  ]),
  subject("Gastrointestinal", [
    "GERD and Barrett esophagus", "Peptic ulcer disease and H. pylori", "Dyspepsia and gastritis", "Irritable bowel syndrome", "Inflammatory bowel disease", "Celiac disease", "Constipation and diarrhea evaluation", "Diverticular disease", "Colorectal cancer screening",
    "Viral hepatitis A, B and C", "Nonalcoholic fatty liver disease", "Cholelithiasis and cholecystitis", "Pancreatitis", "Hemorrhoids and anal fissure", "Dysphagia evaluation", "Abnormal liver function tests", "Appendicitis and acute abdomen",
  ]),
  subject("Genitourinary and Renal", [
    "Uncomplicated and complicated UTI", "Pyelonephritis", "Nephrolithiasis", "Hematuria evaluation", "Chronic kidney disease staging", "Benign prostatic hyperplasia", "Prostatitis and epididymitis", "Prostate cancer screening discussion", "Erectile dysfunction",
    "Urinary incontinence evaluation", "Testicular torsion", "Scrotal masses", "Sexually transmitted urethritis", "Proteinuria and nephrotic syndrome", "Acute kidney injury in primary care", "Hypogonadism",
  ]),
  subject("Musculoskeletal", [
    "Osteoarthritis", "Rheumatoid arthritis", "Gout and pseudogout", "Low back pain and radiculopathy", "Shoulder pain and rotator cuff", "Knee injuries and meniscal tears", "Ankle sprain and Ottawa rules", "Carpal tunnel syndrome", "Plantar fasciitis",
    "Tendinopathy and bursitis", "Osteoporosis treatment", "Fibromyalgia", "Fractures and splinting", "Polymyalgia rheumatica and giant cell arteritis", "Systemic lupus erythematosus", "Joint aspiration and injection",
  ]),
  subject("Neurologic", [
    "Migraine and tension headache", "Cluster headache", "Seizure disorders in primary care", "Stroke and TIA secondary prevention", "Parkinson disease", "Dementia evaluation", "Peripheral neuropathy", "Bell palsy", "Multiple sclerosis follow-up", "Restless legs syndrome",
    "Concussion management", "Vertigo and dizziness", "Essential tremor", "Trigeminal neuralgia", "Neurologic exam abnormalities", "Meningitis recognition",
  ]),
  subject("Endocrine", [
    "Type 2 diabetes pharmacotherapy", "Type 1 diabetes in primary care", "Diabetic complications screening", "Prediabetes and metabolic syndrome", "Hypothyroidism", "Hyperthyroidism and thyroid nodules", "Obesity pharmacotherapy", "Adrenal insufficiency and Cushing syndrome",
    "Osteoporosis and vitamin D", "Hyperparathyroidism", "Polycystic ovary syndrome", "Hypogonadism and testosterone therapy", "Hyperprolactinemia", "Hyponatremia evaluation", "Diabetic ketoacidosis recognition", "Hypoglycemia management",
  ]),
  subject("Hematology", [
    "Iron-deficiency anemia", "Vitamin B12 and folate deficiency", "Anemia of chronic disease", "Sickle cell disease and trait", "Thalassemia", "Thrombocytopenia evaluation", "Venous thromboembolism treatment", "Hypercoagulable states", "Warfarin and DOAC monitoring",
    "Leukocytosis and leukopenia evaluation", "Lymphadenopathy evaluation", "Polycythemia", "Bleeding disorders", "Hemochromatosis", "Monoclonal gammopathy",
  ]),
  subject("Infectious Disease", [
    "HIV screening, PrEP and primary care", "Sexually transmitted infections and partner treatment", "Tuberculosis", "Lyme disease and tick-borne illness", "Influenza and antiviral therapy", "COVID-19 outpatient management", "Cellulitis and MRSA",
    "Urinary tract infection antibiotic selection", "Pneumonia antibiotic selection", "Infectious mononucleosis", "Travel-related infections", "Fever of unknown origin", "Hepatitis B and C", "Herpes zoster and vaccination", "Parasitic infections", "Foodborne illness",
    "Antimicrobial resistance and stewardship", "Immunization schedules for adults",
  ]),
];

/* ================================================================== */
/* Clinical Math                                                       */
/* ================================================================== */
const CLINICAL_MATH: SeedTaxonomy[] = [
  section("Unit Conversions", undefined, [
    "Metric prefixes and equivalents (kg, g, mg, mcg)", "Volume conversions (L, mL, cc)", "Household measures (tsp, tbsp, oz, cup)", "Apothecary equivalents (grains, minims, drams)",
    "Pounds to kilograms and kilograms to pounds", "Inches to centimeters and height conversion", "Fahrenheit to Celsius and Celsius to Fahrenheit", "Standard time to military time",
    "Dimensional analysis setup", "Ratio and proportion method", "Percent concentration to mg/mL", "Rounding rules and significant digits", "Converting mEq, mmol and mg",
  ]),
  section("Oral Dosage", undefined, [
    "Tablet and capsule dose from the order", "Liquid medication volume to administer", "Desired over have formula (D/H x Q)", "Multiple-tablet dose with split tablets", "Dose per day divided by frequency", "Maximum daily dose check",
    "Oral dose with mg to mcg conversion", "Suspension and elixir dosing", "Number of tablets per day for a supply", "Days-supply calculations", "Crushing and scored tablet rules",
  ]),
  section("Parenteral Dosage", undefined, [
    "Subcutaneous injection volume", "Intramuscular injection volume and site limits", "Dose from vial concentration (mg/mL)", "Units-per-mL medications", "IV push volume and rate", "Ratio-strength solutions (1:1000)",
    "Percent-strength solutions", "Combined dose from multiple vials", "Syringe selection and rounding", "Mcg to mg injectable conversion", "Pre-filled syringe waste calculations",
  ]),
  section("IV Calculations", undefined, [
    "mL per hour from total volume and time", "Gravity drip rate in gtt/min", "Drop factors: 10, 15, 20 and 60 gtt/mL", "Infusion time from volume and rate", "Volume infused over elapsed time", "Piggyback (IVPB) rate and time",
    "Correcting a behind-schedule infusion", "Total fluid intake in 24 hours", "Maintenance fluid rate (4-2-1 rule)", "Electrolyte additive concentration in IV fluid", "Dextrose and saline percent solutions", "Flow rate on an infusion pump",
    "TPN and lipid infusion rates",
  ]),
  section("Pediatric and Weight-based Dosing", undefined, [
    "Dose by mg/kg/day divided into doses", "Dose by mg/kg/dose", "Safe dose range check", "Converting pounds to kilograms before dosing", "Body surface area calculation (BSA)", "BSA-based chemotherapy dosing",
    "Pediatric maintenance fluids", "Pediatric IV rate and volume limits", "Pediatric liquid volume per dose", "Neonatal dosing by gestational age and weight", "Dose per square meter", "Concentration check for infants",
    "Pediatric acetaminophen and ibuprofen dosing", "Antibiotic suspension calculations",
  ]),
  section("Titration and Critical-care Infusions", undefined, [
    "mcg/kg/min to mL/hr", "mcg/min to mL/hr", "mg/hr to mL/hr", "Concentration of a premixed drip (mg/250 mL)", "Dopamine and dobutamine drips", "Norepinephrine and vasopressin titration",
    "Nitroglycerin and nitroprusside drip", "Amiodarone loading and maintenance infusion", "Sedation drips: propofol and midazolam", "Titrating up and down by protocol steps", "Mean arterial pressure goal-based titration",
    "Weaning infusion rates", "Drug amount remaining in a bag", "Time until infusion bag runs out",
  ]),
  section("Insulin and Heparin", undefined, [
    "Sliding scale insulin dose", "Insulin units per mL (U-100)", "Carbohydrate coverage insulin ratio", "Correction factor calculation", "Total daily insulin dose", "Insulin drip rate in units/hr", "Mixing NPH and regular insulin volumes",
    "Heparin units/hr to mL/hr", "Heparin bolus dose by weight", "Heparin protocol adjustment from aPTT", "Heparin concentration of premix bags", "Low-molecular-weight heparin weight-based dose", "Warfarin INR dose adjustment",
  ]),
  section("Dilutions and Reconstitution", undefined, [
    "Reconstituting powdered medications", "Final concentration after reconstitution", "Dose from a reconstituted vial", "Stock solution and desired strength", "Dilution ratio problems", "Percent solution dilution",
    "Diluting concentrated electrolytes", "Preparing enteral formula strengths", "Alligation method", "Dose in a diluted syringe", "Powder volume displacement", "Solute and solvent amounts",
  ]),
  section("Intake/Output and Nutrition Calculations", undefined, [
    "Total intake from oral and IV sources", "Urine output from catheter and voids", "Hourly urine output and mL/kg/hr", "Net fluid balance", "Insensible loss estimates", "Daily weight change to fluid gain",
    "Calories from carbohydrate, protein and fat", "Enteral feeding rate and daily calories", "TPN dextrose and amino acid calories", "Body mass index", "Ideal and adjusted body weight", "Daily fluid requirement",
    "Free water deficit and sodium correction", "Anion gap and corrected calcium", "Creatinine clearance (Cockcroft-Gault)",
  ]),
];

/* ================================================================== */
/* NAPLEX                                                              */
/* ================================================================== */
const NAPLEX: SeedTaxonomy[] = [
  section("Foundational Knowledge", 14, [
    "Pharmacokinetic parameters: clearance, volume of distribution, half-life", "Compartment models and AUC", "Steady state and loading dose concepts", "Michaelis-Menten (nonlinear) kinetics", "Bioavailability and bioequivalence",
    "Drug absorption and first-pass metabolism", "Cytochrome P450 enzymes: inducers and inhibitors", "Phase I and phase II metabolism", "Renal elimination and dose adjustment", "Pharmacodynamics and dose-response curves",
    "Receptor theory: agonists, antagonists and partial agonists", "Pharmacogenomics and genetic polymorphisms", "Dosage forms and routes of administration", "Solubility, pH and pKa", "Excipients and drug stability",
    "Sterile versus nonsterile preparations", "Biopharmaceutics and drug delivery systems", "Biologics, biosimilars and monoclonal antibodies", "Immunology basics and vaccines", "Microbiology and antimicrobial mechanisms",
    "Medicinal chemistry and structure-activity relationships", "Biostatistics: t-test, chi-square and ANOVA", "Study designs: RCT, cohort, case-control", "Sensitivity, specificity and predictive values", "Number needed to treat and risk measures",
    "Confidence intervals and p-values", "Evidence-based medicine and literature evaluation", "Pharmacoeconomics: cost-effectiveness and QALYs", "Pharmacoepidemiology and drug utilization review", "Physiology of major organ systems",
    "Biochemistry and nutrition essentials", "Toxicology and antidotes",
  ]),
  section("Pharmacotherapy and Outcomes", 34, [
    "Guideline-directed treatment selection", "Drug therapy individualization for comorbidities", "Therapeutic alternatives and formulary substitution", "Dose optimization in renal impairment", "Dose optimization in hepatic impairment", "Pharmacokinetic monitoring and therapeutic drug monitoring",
    "Vancomycin AUC-guided dosing", "Aminoglycoside dosing and monitoring", "Digoxin, phenytoin and lithium monitoring", "Warfarin dosing and INR management", "Anticoagulant selection and reversal", "Drug-drug interaction management",
    "Drug-disease interaction identification", "Adverse drug reaction recognition and management", "Drug allergy and cross-reactivity", "Therapy in pregnancy and lactation", "Therapy in pediatric and neonatal patients", "Therapy in older adults and Beers criteria",
    "Polypharmacy and deprescribing", "Pharmacogenomic-guided therapy", "Antimicrobial stewardship and empiric therapy", "De-escalation and IV-to-oral conversion", "Transitions of care and medication reconciliation", "Patient-specific outcome monitoring",
    "Nonpharmacologic therapy and lifestyle recommendations", "Medication adherence strategies", "Parenteral nutrition and fluid therapy", "Immunization therapy decisions", "Emergency and critical care pharmacotherapy", "Palliative and end-of-life pharmacotherapy",
    "Substance use disorder pharmacotherapy", "Pain management and opioid conversion", "Hormonal therapy and contraception selection", "Oncology supportive care",
  ]),
  section("Pharmaceutical Calculations", 10, [
    "Dosage calculations by weight and body surface area", "Creatinine clearance and eGFR", "Ideal, adjusted and actual body weight", "Infusion rate and drip rate calculations", "Dilutions and concentrations", "Alligation (medial and alternate)",
    "Percent strength, ratio strength and PPM", "Isotonicity and tonicity adjustments", "Milliequivalents and milliosmoles", "Reconstitution of powders", "Compounding batch scaling and Rx quantities", "Days supply and quantity dispensed",
    "Pharmacokinetic equations: loading and maintenance doses", "Half-life and elimination rate constant", "Anion gap and corrected sodium", "Corrected calcium and phenytoin adjustments", "Insulin and heparin dosing calculations", "Parenteral nutrition calories and osmolarity",
    "Conversion between units and measurement systems", "Pharmacoeconomic and inventory calculations (turnover, markup, GPM)", "Statistical calculations (NNT, relative risk, odds ratio)", "Temperature and specific gravity calculations",
  ]),
  section("Medication Safety and Quality", 10, [
    "Medication error types and root causes", "Look-alike sound-alike drugs and Tall Man lettering", "ISMP high-alert medications", "Error reporting systems and MedWatch", "Failure mode and effects analysis", "Barcode scanning and CPOE safety",
    "Verification of prescriptions and orders", "Drug utilization review", "REMS and risk mitigation", "Medication reconciliation", "Health literacy and labeling", "Pharmacovigilance and adverse event reporting", "Contraindicated and duplicate therapy detection",
    "Quality metrics: star ratings and HEDIS", "Continuous quality improvement methods (PDSA)", "Antimicrobial stewardship programs", "Infection prevention in pharmacy practice", "Special populations and safe dosing", "Disaster and emergency preparedness",
    "Handling hazardous drugs safely", "Safe disposal and take-back programs",
  ]),
  section("Person-Centered Assessment", 12, [
    "Patient interview and medication history", "Identifying drug-related problems", "Communication with diverse patients", "Interpreting vital signs and physical findings", "Interpreting laboratory values", "Point-of-care testing: glucose, A1c, cholesterol, INR",
    "Triage of minor ailments versus referral", "Health literacy and numeracy assessment", "Adherence and barrier assessment", "Cultural competence and social determinants", "Motivational interviewing", "Cognitive and functional status screening",
    "Depression and suicide screening", "Substance use screening", "Blood pressure measurement and interpretation", "Pain assessment", "Pregnancy and lactation screening before therapy", "Allergy and intolerance history",
    "Collaboration with prescribers and care teams", "Documentation of assessments and care plans",
  ]),
  section("Health and Wellness", 12, [
    "Immunization schedules and contraindications", "Adult vaccine recommendations", "Pediatric vaccine recommendations", "Travel health and vaccines", "Screening: cancer, diabetes, hypertension, lipids", "Smoking cessation therapies",
    "Weight management and obesity therapy", "Nutrition, vitamins and mineral supplements", "Herbal and dietary supplement safety", "Contraception counseling and emergency contraception", "Prenatal vitamins and preconception counseling", "Self-care for common minor ailments",
    "Nonprescription analgesics and antipyretics", "Cough, cold and allergy products", "Gastrointestinal OTC products", "Topical dermatologic OTC products", "Ophthalmic and otic OTC products", "Sleep aids and OTC drug misuse",
    "Home medical devices and glucose meters", "Public health roles of pharmacists", "Infection control and hand hygiene", "Health disparities and access to care", "Medication therapy management services", "Disease state management programs",
  ]),
  section("Law and Ethics", 8, [
    "Federal Food, Drug and Cosmetic Act", "Controlled Substances Act schedules and prescription requirements", "DEA registration and recordkeeping", "HIPAA privacy and security", "OBRA-90 and patient counseling", "Poison Prevention Packaging Act",
    "Dietary supplement regulation (DSHEA)", "Drug recalls and classes", "REMS programs", "Ethical principles in pharmacy practice", "Professional codes of ethics", "Conflicts of interest", "Informed consent and patient autonomy",
    "Drug supply chain security", "Medicare Part D and medication coverage", "Prescription monitoring programs", "Compounding law: 503A and 503B",
  ]),
  subject("Cardiovascular", [
    "Hypertension guidelines and first-line agents", "ACE inhibitors, ARBs and ARNI", "Beta blockers and calcium channel blockers", "Diuretics", "Heart failure with reduced ejection fraction therapy", "Heart failure with preserved ejection fraction",
    "Acute coronary syndrome therapy", "Chronic stable angina", "Dyslipidemia: statins, ezetimibe and PCSK9 inhibitors", "Atrial fibrillation: rate, rhythm and stroke prevention", "Antiarrhythmic drugs", "Anticoagulants: warfarin, DOACs and heparins",
    "Antiplatelets and dual antiplatelet therapy", "Venous thromboembolism treatment and prophylaxis", "Hypertensive emergencies", "Peripheral artery disease", "Shock and vasopressors", "Cardiac arrest and ACLS drugs",
  ]),
  subject("Endocrine and Metabolic", [
    "Type 2 diabetes drug classes and cardiorenal benefit", "Metformin, sulfonylureas and DPP-4 inhibitors", "SGLT2 inhibitors and GLP-1 receptor agonists", "Insulin products and regimens", "Hypoglycemia and DKA management", "Diabetes standards of care and goals",
    "Hypothyroidism and levothyroxine", "Hyperthyroidism and antithyroid drugs", "Adrenal and pituitary disorders", "Corticosteroid equivalence and tapering", "Osteoporosis therapy", "Testosterone and hormone replacement", "Obesity pharmacotherapy",
    "Gout and hyperuricemia", "Calcium, vitamin D and parathyroid disorders",
  ]),
  subject("Infectious Disease", [
    "Penicillins and cephalosporins", "Carbapenems and monobactams", "Macrolides, tetracyclines and fluoroquinolones", "Aminoglycosides and vancomycin", "Sulfonamides, nitrofurantoin and metronidazole", "Antitubercular therapy",
    "Antifungal agents", "Antiviral therapy for herpes and influenza", "HIV antiretroviral regimens and PrEP", "Hepatitis B and C treatment", "Community-acquired and hospital-acquired pneumonia", "Urinary tract infection therapy",
    "Skin and soft tissue infection therapy", "Intra-abdominal and CNS infections", "Sepsis and bacteremia", "Endocarditis and bone infections", "Sexually transmitted infection treatment", "Antimicrobial resistance mechanisms", "Surgical prophylaxis", "Clostridioides difficile infection",
  ]),
  subject("Neurology and Psychiatry", [
    "Epilepsy and antiepileptic drugs", "Status epilepticus", "Parkinson disease drugs", "Migraine acute and preventive therapy", "Alzheimer disease agents", "Multiple sclerosis therapies", "Major depression and antidepressants",
    "Bipolar disorder and mood stabilizers", "Schizophrenia and antipsychotics", "Anxiety and sedative-hypnotics", "ADHD stimulants and nonstimulants", "Insomnia agents", "Opioid and alcohol use disorder therapy", "Serotonin syndrome and NMS",
    "Neuropathic pain agents", "Muscle relaxants and spasticity", "Stroke acute therapy and prevention",
  ]),
  subject("Oncology", [
    "Cytotoxic chemotherapy classes and toxicities", "Targeted therapies and kinase inhibitors", "Immunotherapy and checkpoint inhibitors", "Breast cancer therapy", "Lung and colorectal cancer therapy", "Hematologic malignancies",
    "Chemotherapy-induced nausea and vomiting", "Febrile neutropenia and growth factors", "Tumor lysis syndrome and extravasation", "Hormonal therapy for prostate and breast cancer", "Cancer pain and supportive care", "Oral chemotherapy safety",
  ]),
  subject("Gastroenterology and Hepatology", [
    "GERD and acid suppression", "Peptic ulcer disease and H. pylori regimens", "Ulcerative colitis and Crohn disease therapy", "Irritable bowel syndrome", "Constipation and laxatives", "Diarrhea and antidiarrheals", "Nausea and vomiting agents",
    "Cirrhosis complications", "Hepatic encephalopathy", "Pancreatitis and pancreatic enzymes", "Stress ulcer prophylaxis", "Parenteral and enteral nutrition", "Drug-induced liver injury",
  ]),
  subject("Renal and Genitourinary", [
    "Acute kidney injury and nephrotoxins", "Chronic kidney disease complications", "Anemia and mineral bone disorder in CKD", "Dialysis dosing considerations", "Fluid and electrolyte disorders", "Hyperkalemia and hyponatremia treatment",
    "Acid-base disorders", "Urinary incontinence and overactive bladder", "Benign prostatic hyperplasia", "Erectile dysfunction", "Kidney transplant immunosuppression", "Nephrolithiasis",
  ]),
  subject("Respiratory and Allergy", [
    "Asthma stepwise therapy", "COPD maintenance and exacerbation therapy", "Inhaler devices and technique", "Allergic rhinitis", "Cough and cold remedies", "Cystic fibrosis therapy", "Pulmonary hypertension agents", "Smoking cessation", "Anaphylaxis treatment", "Idiopathic pulmonary fibrosis",
  ]),
  subject("Women's Health and Reproductive Care", [
    "Hormonal contraceptives and drug interactions", "Emergency contraception", "Menopause and hormone therapy", "Infertility agents", "Pregnancy drug safety categories and lactation", "Preeclampsia and magnesium sulfate", "Preterm labor and antenatal steroids",
    "Endometriosis and fibroid therapy", "Vaginal infections", "Osteoporosis in women", "Breast cancer risk reduction",
  ]),
  subject("Pediatrics and Geriatrics", [
    "Pediatric dosing principles", "Neonatal pharmacokinetics", "Pediatric antimicrobial therapy", "Pediatric asthma and ADHD therapy", "Pediatric vaccine schedules", "Pediatric toxicology and poisoning", "Age-related pharmacokinetic changes in older adults",
    "Beers criteria and anticholinergic burden", "Falls and drug-induced geriatric syndromes", "Dementia and delirium drug issues", "Pressure injury and wound care agents", "Geriatric pain management",
  ]),
  subject("Pharmacology", [
    "Autonomic nervous system drugs", "Cholinergic and anticholinergic agents", "Adrenergic agonists and antagonists", "Drug toxicities and antidotes", "Opioid pharmacology", "Local and general anesthetics", "NSAIDs and acetaminophen",
    "Autacoids and antihistamines", "Immunosuppressants and biologic agents", "Vitamin and mineral pharmacology", "Teratogens and pregnancy toxicity", "Drug-induced QT prolongation", "Herbal product pharmacology", "Ocular and otic drugs",
  ]),
  subject("Pharmaceutics", [
    "Solid oral dosage forms and disintegration", "Liquid dosage forms: solutions, suspensions and emulsions", "Semisolids: ointments, creams and gels", "Parenteral products and sterility", "Transdermal and modified-release systems", "Aerosols and inhalation delivery",
    "Compounding USP 795, 797 and 800 standards", "Beyond-use dating and stability", "Packaging and storage conditions", "Dissolution and quality control", "Pharmaceutical incompatibilities", "Radiopharmaceuticals", "Ophthalmic and otic preparations",
  ]),
  subject("Biostatistics and Literature Evaluation", [
    "Descriptive statistics: mean, median, standard deviation", "Hypothesis testing and type I and II errors", "Parametric versus nonparametric tests", "Interpreting relative risk and hazard ratio", "Absolute risk reduction and NNT/NNH", "Confidence interval interpretation",
    "Noninferiority and superiority trials", "Intention-to-treat analysis", "Bias, confounding and validity", "Meta-analysis and systematic review", "Pharmacoeconomic analysis types", "Diagnostic test evaluation",
  ]),
  subject("Pharmacy Law", [
    "Federal controlled substance schedules and refills", "Prescription requirements for Schedule II through V", "Emergency and electronic prescribing rules", "Drug approval, labeling and misbranding", "Pedigree and DSCSA requirements",
    "HIPAA disclosure rules", "Patient counseling requirements", "Medicaid and Medicare rules", "Pharmacy technician regulation", "Compounding oversight", "Biologic and biosimilar substitution", "Orange Book and generic substitution",
  ]),
  subject("Self-care and OTC", [
    "Pain and fever products", "Cough and cold self-care", "Allergy self-care", "Heartburn and GI self-care", "Constipation and diarrhea self-care", "Dermatologic self-care: acne, dermatitis and fungal infections", "Ophthalmic self-care",
    "Contraception and women's health OTC", "Smoking cessation OTC products", "Vitamins, minerals and herbal supplements", "Sleep aids and stimulants", "Diabetes testing supplies", "Wound care and first aid", "Pediatric OTC safety",
  ]),
];

/* ================================================================== */
/* Pharmacy jurisprudence: MPJE, UMPJE, CPJE                           */
/* ================================================================== */
const MPJE: SeedTaxonomy[] = [
  section("Federal Law: Food, Drug and Cosmetic Act", 10, [
    "Drug definitions and new drug approval", "Misbranding and adulteration", "Prescription versus OTC drug classification", "Required prescription label content", "Package inserts and labeling requirements",
    "Generic drugs, Orange Book and therapeutic equivalence", "Biologics, biosimilars and interchangeability", "Dietary supplement labeling (DSHEA)", "Unit-dose and repackaging requirements", "Medication Guides and patient package inserts",
    "Drug sample distribution rules", "Investigational drugs and expanded access", "Adverse event reporting and MedWatch", "Pharmacy compounding provisions of the FDCA",
  ]),
  section("Federal Law: Controlled Substances Act", 14, [
    "Schedules I through V criteria", "DEA registration and renewal", "DEA Form 222 and electronic CSOS ordering", "Required controlled substance prescription elements", "Schedule II prescription, emergency and partial-fill rules",
    "Schedule III-V refill and transfer limits", "Controlled substance inventories and biennial counts", "Theft, loss and DEA Form 106", "Disposal, DEA Form 41 and take-back programs", "Corresponding responsibility of the pharmacist",
    "Red flags for diversion and forged prescriptions", "Electronic prescribing for controlled substances (EPCS)", "Methadone and buprenorphine treatment rules", "Combat Methamphetamine Epidemic Act and pseudoephedrine limits", "Controlled substance prescription monitoring programs",
    "Practitioner exemptions and mid-level practitioners", "Record retention and readily retrievable records", "Opioid prescribing and dispensing guidelines",
  ]),
  section("Federal Law: HIPAA and Privacy", 7, [
    "Protected health information definition", "Treatment, payment and operations disclosures", "Minimum necessary standard", "Notice of privacy practices", "Patient authorization requirements", "Business associate agreements",
    "Patient right of access and amendment", "Breach notification rule", "Security safeguards for electronic PHI", "Disposal of PHI and prescription labels", "Marketing and fundraising communications", "Disclosures to family and caregivers",
  ]),
  section("Federal Law: OBRA-90 and Patient Counseling", 6, [
    "Prospective drug use review", "Offer-to-counsel requirement", "Patient profile and record maintenance", "Counseling content elements", "Counseling for Medicaid patients", "Counseling exceptions and refusal", "Mail-order and delivered prescription counseling", "Documentation of counseling",
  ]),
  section("Federal Law: PPPA, Recalls and REMS", 8, [
    "Child-resistant packaging requirements", "Exemptions to child-resistant closures", "Patient and prescriber requests for non-child-resistant packaging", "Poison Prevention Packaging Act enforcement", "FDA recall classes I, II and III",
    "Recall levels: consumer, retail and wholesale", "Withdrawals versus recalls and drug shortages", "REMS elements to assure safe use", "iPLEDGE, TIRF and clozapine REMS", "Medication Guide distribution", "Counterfeit drug and DSCSA tracing requirements", "Drug quality and security act",
  ]),
  section("Pharmacy Practice and Dispensing", 14, [
    "Valid prescription and prescriber requirements", "Prescription label requirements", "Refill, partial fill and transfer rules", "Generic substitution and brand medically necessary", "Prescription transfer between pharmacies",
    "Oral, faxed and electronic prescriptions", "Emergency refills and dispensing without a prescription", "Dispensing for patients without insurance and discount cards", "Medication therapy management", "Pharmacist-in-charge duties", "Recordkeeping and retention periods",
    "Quality assurance and error reporting", "Waiver of child-resistant caps", "Dispensing naloxone and emergency contraceptive", "Long-term care pharmacy rules", "Institutional pharmacy rules",
  ]),
  section("Compounding (USP 795, 797, 800)", 8, [
    "503A versus 503B compounding", "Compounding from bulk and approved components", "USP <795> nonsterile compounding", "USP <797> sterile compounding", "USP <800> hazardous drug handling", "Beyond-use dating",
    "Cleanroom and ISO classifications", "Personnel training and competency", "Environmental monitoring", "Master formulation and compounding records", "Anticipatory compounding limits", "Prohibited and essentially copy compounding",
  ]),
  section("Licensure and Operations", 10, [
    "Pharmacist licensure and reciprocity", "License renewal and continuing education", "Pharmacy permits and change of ownership", "Pharmacist-in-charge responsibilities", "Pharmacy intern requirements", "Wholesaler and manufacturer licensing",
    "Pharmacy physical requirements, security and sanitation", "Reference materials required in the pharmacy", "Pharmacy closure and records transfer", "Out-of-state and mail-order pharmacy licensing", "Disciplinary actions and grounds for discipline", "Impaired pharmacist programs",
    "Board of pharmacy powers and inspections", "Absence of pharmacist and unattended pharmacy", "Advertising and sale of pharmacy services", "Prohibited kickbacks and anti-trust practices",
  ]),
  section("Controlled Substance Rules by Schedule", 7, [
    "Schedule II dispensing: written, electronic and emergency", "Schedule II refills and prescription expiration", "Schedule III and IV prescription limits", "Schedule V dispensing without a prescription", "Exempt narcotics and OTC codeine rules",
    "Controlled substance labeling requirements", "Hospital and institutional controlled substance orders", "Controlled substance storage and security", "Dispensing to long-term care and hospice", "State schedule differences and more stringent rules", "Quantity and days supply limits for opioids", "Prescription monitoring program reporting",
  ]),
  section("Pharmacy Technicians", 5, [
    "Technician registration and certification", "Technician tasks and prohibited duties", "Technician-to-pharmacist ratio", "Tech-check-tech programs", "Supervision and delegation", "Technician training requirements", "Remote entry and verification roles", "Responsibility of the pharmacist for technician actions",
  ]),
  section("Immunization and Prescriptive Authority", 5, [
    "Pharmacist immunization authority and age limits", "Standing orders and protocols", "Collaborative practice agreements", "Pharmacist-prescribed contraception", "Testing and treatment authority", "Naloxone and opioid antagonist dispensing",
    "Vaccine storage, handling and VIS", "Immunization reporting to registries", "Emergency use authorization and PREP Act", "Documentation of immunization administration",
  ]),
  section("Telepharmacy and Remote Practice", 3, [
    "Telepharmacy dispensing sites", "Remote verification of prescriptions", "Automated dispensing and kiosk rules", "Remote supervision and video requirements", "Telehealth prescribing and valid patient relationship", "Internet pharmacy and online sales", "Prescription delivery and shipping requirements", "Data security and privacy in remote practice",
  ]),
  section("Ethics and Professional Conduct", 3, [
    "Conscience clauses and refusal to fill", "Duty to warn and patient confidentiality limits", "Conflicts of interest", "Mandatory reporting obligations", "Professional boundaries", "Duty to report errors", "Sale of OTC, tobacco and nonprescription products", "Handling of recalls and returns",
  ]),
];

const UMPJE: SeedTaxonomy[] = [
  section("Uniform Federal Foundations", 25, [
    "FDCA approval, labeling and misbranding provisions", "Controlled Substances Act registration and scheduling", "CSA prescription and refill requirements", "Controlled substance inventory and records", "HIPAA privacy and security basics",
    "OBRA-90 drug use review and counseling", "Poison Prevention Packaging Act", "FDA recall classification", "Risk evaluation and mitigation strategies", "Drug Supply Chain Security Act", "Combat Methamphetamine Epidemic Act",
    "Federal compounding statutes: 503A and 503B", "Medication Guides and patient labeling", "Dietary supplement regulation",
  ]),
  section("Model State Pharmacy Act Framework", 15, [
    "Purpose and scope of a pharmacy practice act", "Definition of the practice of pharmacy", "Board of pharmacy structure and rulemaking", "Licensure by examination and by endorsement", "Pharmacy permit categories",
    "Pharmacist-in-charge and ownership rules", "Disciplinary process and due process", "Unprofessional conduct standards", "Interstate practice and licensure compacts", "Out-of-state pharmacy registration", "Inspection authority and penalties", "Continuing education and renewal",
  ]),
  section("Dispensing and Prescription Processing", 20, [
    "Elements of a valid prescription", "Prescription labeling and auxiliary requirements", "Substitution laws for generics and biosimilars", "Refill authorization and transfer", "Controlled substance prescription handling",
    "Emergency dispensing provisions", "Electronic prescribing and e-signatures", "Prescription records and retention", "Medication error prevention and reporting", "Patient counseling and consultation", "Prescription drug monitoring program use",
    "Patient confidentiality exceptions", "Returned and expired drug handling", "Repackaging, unit-dose and blister packaging", "Medication synchronization and refills too soon",
  ]),
  section("Practice Settings and Operations", 15, [
    "Community pharmacy operations", "Hospital and institutional pharmacy", "Long-term care and consultant pharmacist rules", "Nuclear pharmacy", "Sterile compounding pharmacies", "Mail-order and specialty pharmacy",
    "Telepharmacy and remote dispensing", "Automated dispensing systems", "Wholesale distribution and third-party logistics", "Pharmacy security and sanitation", "Emergency kits and drug storage in facilities", "Closure and change of ownership procedures",
  ]),
  section("Compounding Standards", 10, [
    "USP <795> nonsterile preparation rules", "USP <797> sterile preparation categories", "USP <800> hazardous drug requirements", "Beyond-use dating principles", "Compounding records and master formulas", "Facility design and environmental controls",
    "Compounding personnel qualifications", "Office-use compounding and distribution limits", "Anticipatory versus patient-specific compounding", "Quality assurance and testing",
  ]),
  section("Personnel and Scope of Practice", 10, [
    "Pharmacy technician registration and duties", "Technician ratios and supervision", "Pharmacy intern training and permissions", "Pharmacist prescriptive authority and protocols", "Collaborative practice agreements", "Immunization authority and vaccine administration",
    "Point-of-care testing and CLIA waivers", "Medication therapy management", "Delegation of nonjudgmental tasks", "Pharmacist impairment and reporting",
  ]),
  section("Controlled Substance Compliance", 5, [
    "Schedule comparisons between federal and state law", "Prescription quantity and day-supply limits", "Records, thefts and losses", "Disposal and reverse distribution", "Opioid stewardship and naloxone co-prescribing", "Pseudoephedrine sales logs", "Medication-assisted treatment dispensing", "Diversion and fraud prevention",
  ]),
];

const CPJE: SeedTaxonomy[] = [
  section("Patient Profile and Medication Safety", 20, [
    "Obtaining and maintaining the patient profile", "Prospective drug use review", "Identifying drug interactions and contraindications", "Allergy and adverse reaction documentation", "Dosing appropriateness checks",
    "Therapeutic duplication detection", "Medication error prevention and reporting", "Patient consultation requirements", "Language access and translated labels", "Medication reconciliation at transitions of care", "Prescription verification and clarification",
    "Drug utilization review in special populations", "High-alert medication safeguards", "Adverse drug reaction reporting", "Pharmacovigilance and MedWatch",
  ]),
  section("Community Pharmacy Practice", 15, [
    "California prescription requirements", "Prescription label content under California law", "Refill, transfer and early refill rules", "Controlled substance prescription forms and security", "CURES database consultation",
    "Dispensing to patients without a prescriber's order", "Hormonal contraception furnishing protocol", "Nicotine replacement and travel medication furnishing", "Naloxone and PrEP/PEP furnishing", "Generic substitution and biosimilar interchange", "Pharmacist-in-charge responsibilities",
    "Prescription delivery and mail-order requirements", "Automated drug delivery systems", "Pharmacy hours, sanitation and security", "Reference materials and notices required in pharmacies",
  ]),
  section("Hospital and Institutional Practice", 15, [
    "Hospital pharmacy licensure and policies", "Medication orders and inpatient prescription requirements", "Pharmacy and therapeutics committee", "Drug storage, floor stock and emergency kits", "Unit-dose and automated dispensing cabinets", "Investigational drug handling",
    "Pharmacist roles in inpatient care and protocols", "Discharge medication consultation", "Intravenous admixture and parenteral nutrition", "Long-term care and skilled nursing pharmacy rules", "Hospice and home health pharmacy services", "Drug recalls and returns in institutions",
    "Radiopharmaceutical and nuclear pharmacy rules", "Disaster and emergency drug supply",
  ]),
  section("Clinic and Specialty Practice", 8, [
    "Community and free clinic licensure", "Pharmacist services in clinics and outpatient settings", "Outpatient dispensing by clinics", "Dialysis and specialty drug distribution", "Pharmacist-provided clinical services and credentials", "Advanced practice pharmacist authority",
    "Collaborative care and protocols", "340B and safety-net pharmacy considerations", "Telehealth and remote care by pharmacists", "Correctional and institutional settings",
  ]),
  section("Compounding and Sterile Preparations", 10, [
    "California compounding regulations (CCR 1735 and 1751)", "Nonsterile compounding quality standards", "Sterile compounding license and inspection", "Master formula and compounding log", "Beyond-use dating",
    "Hazardous drug handling", "Training and competency of compounding personnel", "Quarantine and recall of compounded drugs", "Compounding for office use and veterinary patients", "Cleanroom, hood and environmental testing",
  ]),
  section("Licensure, Personnel and Operations", 12, [
    "Board of Pharmacy structure and authority", "Pharmacist licensure and renewal", "Intern pharmacist requirements", "Pharmacy technician licensure and duties", "Pharmacist-to-technician ratios", "Designated representatives and wholesalers",
    "Pharmacy permits and ownership changes", "Disciplinary grounds and citations", "Continuing education and impairment programs", "Records retention", "Security, theft and loss reporting", "Pharmacy closure and records transfer", "Exemptions and out-of-state pharmacies",
  ]),
  section("Federal and California Controlled Substances", 10, [
    "Federal and California schedule differences", "California security prescription forms", "Schedule II prescription requirements", "Triplicate-to-security-form requirements", "Controlled substance record keeping and inventory",
    "Reporting theft, loss and diversion", "CURES reporting timelines", "Opioid dispensing and naloxone offering", "Exempt narcotics and OTC controlled substance sales", "Emergency dispensing of controlled substances",
  ]),
  section("Ethics, Professional Conduct and Quality Assurance", 10, [
    "Pharmacist professional duties and responsibilities", "Conflict of interest and kickbacks", "Duty to consult and patient confidentiality", "Conscience and refusal to dispense", "Mandatory reporting duties", "Quality assurance programs for medication errors",
    "Root cause analysis and continuous improvement", "Patient rights and informed consent", "Health information privacy (CMIA and HIPAA)", "Substance abuse and pharmacist impairment", "Anti-fraud and false claims issues", "Consumer protection and advertising",
  ]),
];

export const SYLLABUS: Record<string, SeedTaxonomy[]> = {
  "nclex-rn": NCLEX_RN,
  "nclex-pn": NCLEX_PN,
  "nursing-school": NURSING_SCHOOL,
  fnp: FNP,
  "clinical-math": CLINICAL_MATH,
  naplex: NAPLEX,
  mpje: MPJE,
  umpje: UMPJE,
  cpje: CPJE,
};
