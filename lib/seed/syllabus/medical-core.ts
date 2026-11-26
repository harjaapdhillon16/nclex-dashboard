// Exam-blueprint-style syllabus (topic names only) for the core medical licensing and QBank exams.
// Based on publicly described content outlines (USMLE Content Description, NBME subject exam
// outlines, NBOME COMLEX-USA blueprint). Contains no question text or proprietary material.
import type { SeedTaxonomy } from "../catalog";

const uniq = (a: string[]) => [...new Set(a)];
const subj = (name: string, children: string[], weight?: number): SeedTaxonomy => ({ kind: "subject", name, children: uniq(children), ...(weight ? { weight } : {}) });
const sys = (name: string, children: string[], weight?: number): SeedTaxonomy => ({ kind: "system", name, children: uniq(children), ...(weight ? { weight } : {}) });

/** Return a copy of a node list with extra topics appended to named nodes and optional extra nodes added. */
const extend = (base: SeedTaxonomy[], extra: Record<string, string[]> = {}, add: SeedTaxonomy[] = [], weights: Record<string, number> = {}): SeedTaxonomy[] =>
  [
    ...base.map((n) => ({
      ...n,
      children: uniq([...(n.children ?? []), ...(extra[n.name] ?? [])]),
      ...(weights[n.name] ? { weight: weights[n.name] } : {}),
    })),
    ...add,
  ];

/**
 * Remove cross-node duplicates within one exam: system nodes keep their topic names (first system wins),
 * and a subject topic that collides with a system topic is renamed with a clarifying suffix.
 */
const dedupe = (nodes: SeedTaxonomy[]): SeedTaxonomy[] => {
  const seen = new Set<string>();
  const out = nodes.map((n) => ({ ...n }));
  for (const n of out.filter((x) => x.kind === "system")) n.children = (n.children ?? []).filter((c) => (seen.has(c) ? false : (seen.add(c), true)));
  for (const n of out.filter((x) => x.kind === "subject")) {
    n.children = (n.children ?? []).flatMap((c) => {
      if (!seen.has(c)) { seen.add(c); return [c]; }
      const r = `${c}: diagnosis and management`;
      if (seen.has(r)) return [];
      seen.add(r);
      return [r];
    });
  }
  return out;
};

/* ------------------------------------------------------------------ */
/* USMLE STEP 1                                                        */
/* ------------------------------------------------------------------ */

const STEP1_SUBJECTS: SeedTaxonomy[] = [
  subj("Pathology", [
    "Cell injury and cell death", "Reversible and irreversible cell injury", "Necrosis patterns", "Apoptosis pathways", "Cellular adaptations (hypertrophy, hyperplasia, atrophy, metaplasia, dysplasia)",
    "Acute inflammation", "Chronic and granulomatous inflammation", "Chemical mediators of inflammation", "Wound healing and repair", "Amyloidosis",
    "Hemodynamic disorders: edema, hyperemia, congestion", "Thrombosis, embolism and infarction", "Shock pathophysiology", "Neoplasia: oncogenes and tumor suppressors", "Tumor staging, grading and spread",
    "Paraneoplastic syndromes", "Tumor markers", "Carcinogenesis: chemical, viral and radiation", "Environmental and nutritional pathology", "Pediatric pathology",
    "Hypersensitivity and transplant pathology", "Pathology of aging",
  ], 48),
  subj("Physiology", [
    "Cell membrane transport and resting membrane potential", "Action potential generation and conduction", "Synaptic and neuromuscular transmission", "Skeletal, cardiac and smooth muscle contraction", "Body fluid compartments and osmolarity",
    "Cardiac electrophysiology", "Cardiac mechanics and hemodynamics", "Microcirculation and Starling forces", "Lung mechanics and compliance", "Ventilation-perfusion relationships",
    "Oxygen and carbon dioxide transport", "Control of breathing", "Renal clearance and glomerular filtration", "Tubular transport and diuretic sites", "Acid-base physiology",
    "Gastrointestinal motility and secretion", "Digestion and absorption", "Hormone signaling and feedback loops", "Reproductive and pregnancy physiology", "Thermoregulation and exercise physiology",
    "Sleep physiology", "Special senses physiology",
  ], 35),
  subj("Pharmacology", [
    "Pharmacokinetics: absorption, distribution, metabolism, elimination", "Zero-order and first-order kinetics", "Pharmacodynamics: receptors, potency and efficacy", "Cytochrome P450 inducers and inhibitors", "Drug-drug interactions",
    "Adverse drug reactions and toxicity", "Autonomic drugs: cholinergic agonists and antagonists", "Autonomic drugs: adrenergic agonists and antagonists", "Antihypertensive and antianginal drugs", "Antiarrhythmic drugs",
    "Diuretics", "Lipid-lowering drugs", "Anticoagulants, antiplatelets and thrombolytics", "Antidiabetic drugs and insulin", "Corticosteroids and endocrine drugs",
    "Antibacterial drugs: mechanisms and resistance", "Antiviral, antifungal and antiparasitic drugs", "Antineoplastic drugs", "Immunosuppressants and biologics", "Antipsychotics and mood stabilizers",
    "Antidepressants and anxiolytics", "Anticonvulsants, anesthetics and opioids", "Toxicology and antidotes", "Drugs of abuse",
  ], 18),
  subj("Biochemistry and Molecular Biology", [
    "Enzyme kinetics and inhibition", "Glycolysis and gluconeogenesis", "TCA cycle and oxidative phosphorylation", "Glycogen metabolism", "Pentose phosphate pathway and fructose/galactose metabolism",
    "Fatty acid synthesis and oxidation", "Ketone body metabolism", "Cholesterol and lipoprotein metabolism", "Amino acid metabolism and urea cycle", "Purine and pyrimidine metabolism",
    "Vitamins and cofactors", "Fed, fasting and starvation states", "DNA replication and repair", "Transcription and RNA processing", "Translation and protein synthesis",
    "Regulation of gene expression", "Molecular biology laboratory techniques", "Protein structure and folding", "Collagen and extracellular matrix synthesis", "Lysosomal storage diseases",
    "Glycogen storage diseases", "Mitochondrial biochemistry",
  ], 18),
  subj("Microbiology: Bacteriology", [
    "Bacterial structure and virulence factors", "Gram-positive cocci", "Gram-positive rods", "Gram-negative cocci", "Gram-negative rods: enteric",
    "Gram-negative rods: respiratory and zoonotic", "Spirochetes", "Mycobacteria", "Anaerobes", "Obligate intracellular bacteria: Rickettsia, Chlamydia",
    "Bacterial genetics and transfer", "Bacterial toxins", "Antibiotic resistance mechanisms", "Sterilization and disinfection", "Normal flora and opportunistic infections",
    "Vaccines and bacterial immunization", "Nosocomial infections", "Culture media and diagnostic techniques",
  ], 12),
  subj("Microbiology: Virology", [
    "Viral structure and replication", "DNA viruses: herpesviruses", "DNA viruses: adenovirus, parvovirus, papillomavirus, poxvirus", "Hepatitis viruses", "Retroviruses and HIV",
    "RNA viruses: picornaviruses", "Orthomyxoviruses and paramyxoviruses", "Coronaviruses", "Arboviruses and hemorrhagic fever viruses", "Rabies, rhabdoviruses and filoviruses",
    "Rotavirus and caliciviruses", "Prion diseases", "Viral genetics: reassortment and recombination", "Antiviral targets and resistance", "Oncogenic viruses",
  ]),
  subj("Microbiology: Mycology and Parasitology", [
    "Superficial and cutaneous mycoses", "Systemic dimorphic fungi", "Opportunistic fungi: Candida, Aspergillus, Cryptococcus", "Pneumocystis and Mucor", "Protozoa: intestinal",
    "Protozoa: blood and tissue", "Malaria and Babesia", "Nematodes", "Cestodes", "Trematodes",
    "Ectoparasites", "Vectors and zoonotic reservoirs", "Antifungal and antiparasitic drug mechanisms",
  ]),
  subj("Immunology", [
    "Innate immunity and pattern recognition", "Complement system", "Cytokines and chemokines", "Lymphoid organs and lymphocyte development", "Antigen presentation and MHC",
    "T-cell activation and differentiation", "B-cell activation and class switching", "Immunoglobulin structure and function", "Immune tolerance", "Hypersensitivity types I-IV",
    "Primary immunodeficiencies", "Acquired immunodeficiency", "Autoimmune disease mechanisms", "Transplant rejection", "Immunosuppressive therapy",
    "Vaccination and passive immunity", "Immunodiagnostic tests", "Tumor immunity and immunotherapy",
  ], 9),
  subj("Gross Anatomy", [
    "Upper limb and brachial plexus", "Lower limb and lumbosacral plexus", "Thorax and mediastinum", "Heart and great vessels anatomy", "Lung and pleura anatomy",
    "Abdominal wall and inguinal canal", "Peritoneum and mesenteries", "Foregut, midgut and hindgut anatomy", "Retroperitoneum and kidney anatomy", "Pelvis and perineum",
    "Head and neck triangles", "Cranial foramina and nerves", "Oral cavity, pharynx and larynx", "Back and spinal cord anatomy", "Vascular and lymphatic anatomy",
    "Peripheral nerve injuries", "Surface anatomy and clinical landmarks", "Diagnostic imaging anatomy", "Dermatomes and myotomes",
  ], 13),
  subj("Embryology", [
    "Gametogenesis and fertilization", "Implantation and week 1-3 development", "Gastrulation and germ layer derivatives", "Neural tube and neural crest development", "Pharyngeal arches, pouches and clefts",
    "Cardiac embryology and fetal circulation", "Foregut, midgut and hindgut development", "Urogenital and genital development", "Limb and skeletal development", "Placenta and fetal membranes",
    "Congenital malformations and teratogens", "Twinning and multiple gestation", "Respiratory tract development", "Craniofacial development",
  ]),
  subj("Histology and Cell Biology", [
    "Cell cycle and its regulation", "Cytoskeleton and motor proteins", "Cell junctions and adhesion molecules", "Organelle structure and function", "Protein trafficking and sorting",
    "Extracellular matrix", "Epithelial tissue types", "Connective tissue and cartilage", "Bone and bone remodeling", "Muscle histology",
    "Blood cells and hematopoiesis", "Lymphoid tissue histology", "Histology of the GI tract", "Histology of respiratory and renal tissue", "Endocrine gland histology",
    "Skin histology", "Reproductive tract histology", "Nervous tissue histology", "Signal transduction pathways", "Cell death and aging",
  ], 10),
  subj("Neuroscience", [
    "Neuroanatomy of the brainstem", "Cerebral cortex and functional areas", "Basal ganglia and movement circuitry", "Thalamus and hypothalamus", "Limbic system",
    "Cerebellum", "Spinal cord tracts and lesions", "Cranial nerve nuclei and lesions", "Cerebral blood supply and stroke syndromes", "Ventricular system and CSF",
    "Visual pathways and field defects", "Auditory and vestibular pathways", "Somatosensory systems and pain pathways", "Neurotransmitters and receptors", "Autonomic nervous system",
    "Neuropharmacology", "Neuroimaging", "Blood-brain barrier and glia", "Neurodevelopment and plasticity",
  ]),
  subj("Behavioral Science", [
    "Learning theory and conditioning", "Defense mechanisms", "Developmental milestones and stages", "Sleep stages and sleep disorders", "Human sexuality",
    "Psychological testing and intelligence measurement", "Doctor-patient relationship", "Informed consent and capacity", "Confidentiality and its exceptions", "Medical ethics principles",
    "End-of-life care and advance directives", "Communication skills and difficult conversations", "Stress, coping and grief", "Abuse and violence", "Cultural competence",
    "Health care systems and delivery", "Patient safety and error disclosure",
  ], 11),
  subj("Genetics and Molecular Medicine", [
    "Mendelian inheritance patterns", "Pedigree analysis", "Hardy-Weinberg equilibrium", "Population genetics", "Chromosomal abnormalities",
    "Trinucleotide repeat disorders", "Genomic imprinting and uniparental disomy", "Mitochondrial inheritance", "Mutations and DNA repair defects", "Genetic testing techniques",
    "Cancer genetics", "Gene therapy and genetic engineering", "Inborn errors of metabolism", "Pharmacogenomics",
  ], 7),
];

const STEP1_SYSTEMS: SeedTaxonomy[] = [
  sys("Cardiovascular", [
    "Congenital heart disease", "Cardiac action potentials and pacemakers", "Cardiac cycle and pressure-volume loops", "Preload, afterload and contractility", "Blood pressure regulation",
    "Coronary artery disease and atherosclerosis", "Myocardial infarction and its complications", "Heart failure", "Cardiomyopathies", "Valvular heart disease and murmurs",
    "Infective endocarditis", "Rheumatic heart disease", "Pericardial disease", "Arrhythmias and ECG interpretation", "Hypertension",
    "Aortic aneurysm and dissection", "Vasculitis", "Peripheral vascular disease", "Cardiac tumors", "Antihypertensive drugs",
    "Antianginal and heart failure drugs", "Antiarrhythmic drug use in rhythm disorders", "Lipid-lowering drug adverse effects",
  ], 7),
  sys("Respiratory", [
    "Respiratory embryology and development", "Lung volumes and mechanics", "Pulmonary circulation and hypoxic vasoconstriction", "Gas exchange and diffusion limitation", "Hypoxemia and hypoxia",
    "Oxygen-hemoglobin dissociation curve", "Obstructive lung disease: COPD", "Asthma", "Restrictive lung disease and pneumoconioses", "Interstitial lung diseases",
    "Pulmonary hypertension", "Pulmonary embolism", "Pneumonia", "Tuberculosis", "Lung cancer",
    "Pleural disease", "Acute respiratory distress syndrome", "Neonatal respiratory distress syndrome", "Sleep apnea", "Respiratory drugs: bronchodilators and antitussives",
  ], 9),
  sys("Renal and Urinary", [
    "Renal embryology and anomalies", "Glomerular filtration and renal blood flow", "Clearance and GFR calculations", "Renal tubular function", "Renin-angiotensin-aldosterone system",
    "Acid-base disorders", "Sodium, potassium and water disorders", "Calcium, phosphate and magnesium disorders", "Nephritic syndromes", "Nephrotic syndromes",
    "Acute kidney injury", "Chronic kidney disease", "Renal tubular acidoses", "Kidney stones", "Urinary tract infections and pyelonephritis",
    "Cystic kidney disease", "Renal and bladder tumors", "Diuretic sites of action and electrolyte effects", "Urinary incontinence and bladder physiology", "Renal osteodystrophy",
  ], 7),
  sys("Gastrointestinal", [
    "GI embryology and congenital anomalies", "GI hormones and regulation", "Esophageal disorders", "Peptic ulcer disease and gastritis", "Gastric cancer",
    "Malabsorption and celiac disease", "Inflammatory bowel disease", "Colorectal polyps and cancer", "Diarrheal illness", "Intestinal obstruction and ischemia",
    "Hepatitis and cirrhosis", "Portal hypertension", "Hyperbilirubinemia and jaundice", "Cholestatic and biliary disease", "Gallbladder disease",
    "Pancreatitis and pancreatic cancer", "Hereditary and metabolic liver disease", "Liver tumors", "GI drugs: acid suppressants, antiemetics, laxatives", "Salivary gland disorders",
  ], 7),
  sys("Endocrine", [
    "Hypothalamic-pituitary axis", "Pituitary hormone excess and deficiency", "Posterior pituitary: diabetes insipidus and SIADH", "Thyroid physiology and function tests", "Hyperthyroidism",
    "Hypothyroidism and thyroiditis", "Thyroid neoplasms", "Calcium and parathyroid disorders", "Adrenal cortex disorders", "Adrenal medulla tumors",
    "Multiple endocrine neoplasia", "Diabetes mellitus type 1 and 2", "Diabetic complications", "Insulin and glucagon physiology", "Hypoglycemia",
    "Metabolic syndrome and obesity", "Growth and puberty disorders", "Antidiabetic drugs", "Thyroid and adrenal drugs", "Neuroendocrine tumors",
  ], 7),
  sys("Reproductive", [
    "Sexual differentiation and disorders of sex development", "Menstrual cycle physiology", "Ovarian disorders and PCOS", "Uterine and cervical pathology", "Endometriosis and adenomyosis",
    "Breast pathology and breast cancer", "Gynecologic neoplasms", "Female infertility and contraception", "Pregnancy physiology and placental disorders", "Teratogenic drugs and infections",
    "Pregnancy complications: preeclampsia and gestational diabetes", "Lactation and postpartum physiology", "Menopause", "Male reproductive physiology", "Testicular disorders and tumors",
    "Prostate disease", "Erectile dysfunction and male infertility", "Genital ulcer and discharge syndromes", "Hormonal drugs and contraceptives", "Gestational trophoblastic disease",
  ], 8),
  sys("Musculoskeletal and Connective Tissue", [
    "Bone physiology and remodeling", "Osteoporosis and metabolic bone disease", "Fractures and bone healing", "Bone tumors", "Osteomyelitis and septic arthritis",
    "Osteoarthritis", "Rheumatoid arthritis", "Crystal arthropathies: gout and pseudogout", "Seronegative spondyloarthropathies", "Systemic lupus erythematosus",
    "Systemic sclerosis and Sjogren syndrome", "Inflammatory myopathies", "Muscular dystrophies", "Neuromuscular junction diseases", "Connective tissue disorders: Marfan, Ehlers-Danlos",
    "Pediatric orthopedic conditions", "Soft tissue sarcomas", "Muscle physiology", "NSAIDs, DMARDs and gout drugs", "Vasculitis and polymyalgia rheumatica",
  ]),
  sys("Nervous System", [
    "Stroke: ischemic and hemorrhagic", "Intracranial hemorrhage", "Seizure disorders", "Headache disorders", "Dementia and neurodegenerative disease",
    "Movement disorders", "Demyelinating diseases", "Central nervous system infections", "Brain and spinal tumors", "Hydrocephalus and increased intracranial pressure",
    "Spinal cord lesions", "Peripheral neuropathies", "Neurocutaneous syndromes", "Congenital CNS malformations", "Cranial nerve disorders",
    "Coma and brain death", "Traumatic brain injury", "Motor neuron disease", "Anesthetics and neuromuscular blockers", "Antiepileptic and antiparkinsonian drugs",
  ], 12),
  sys("Hematology and Oncology", [
    "Hematopoiesis", "Anemias: microcytic", "Anemias: macrocytic", "Hemolytic anemias", "Hemoglobinopathies",
    "Bone marrow failure", "Platelet disorders", "Coagulation cascade and clotting disorders", "Hypercoagulable states", "Transfusion medicine",
    "Acute leukemias", "Chronic leukemias", "Myeloproliferative neoplasms", "Hodgkin and non-Hodgkin lymphoma", "Plasma cell disorders",
    "Tumor biology and oncogenes", "Oncologic emergencies", "Chemotherapy agents and toxicities", "Hematologic drugs", "Splenic and lymph node disorders",
  ], 9),
  sys("Immune System", [
    "Primary immunodeficiency syndromes", "HIV and AIDS", "Hypersensitivity reactions", "Anaphylactic shock", "Transplant immunology",
    "Autoimmune syndromes", "Immunoglobulin disorders", "Complement deficiencies", "Cytokine-related disease", "Immunosuppressive drugs",
    "Biologic therapies", "Allergic rhinitis and atopy", "Graft-versus-host disease", "Immune thrombocytopenia",
  ], 4),
  sys("Dermatology", [
    "Skin layers and histology", "Inflammatory dermatoses", "Eczema and atopic dermatitis", "Psoriasis", "Acne and rosacea",
    "Blistering diseases", "Skin infections: bacterial, viral and fungal", "Pigmentary disorders", "Benign skin lesions", "Premalignant skin lesions",
    "Basal cell carcinoma", "Squamous cell carcinoma", "Melanoma", "Cutaneous manifestations of systemic disease", "Drug eruptions and Stevens-Johnson syndrome",
    "Hair and nail disorders", "Burns and wound healing", "Topical dermatologic agents",
  ], 3),
  sys("Ear, Nose and Throat", [
    "Hearing loss: conductive and sensorineural", "Otitis media and externa", "Vestibular disorders", "Ear anatomy and physiology", "Sinusitis",
    "Epistaxis", "Pharyngitis and tonsillitis", "Laryngeal disease and airway", "Head and neck cancer", "Salivary gland disease",
    "Pharyngeal arch anomalies", "Cholesteatoma", "Deep neck infections", "Allergic rhinitis",
  ]),
  sys("Ophthalmology", [
    "Eye anatomy and embryology", "Visual field defect localization", "Glaucoma", "Cataract", "Retinal disorders",
    "Diabetic and hypertensive retinopathy", "Macular degeneration", "Conjunctivitis", "Uveitis", "Optic neuritis and papilledema",
    "Ocular motility and strabismus", "Refractive errors", "Pupillary reflexes and abnormalities", "Ocular drugs",
  ]),
  sys("Behavioral Health", [
    "Psychotic disorders", "Mood disorders", "Anxiety disorders", "Obsessive-compulsive and related disorders", "Trauma and stressor-related disorders",
    "Somatic symptom disorders", "Personality disorders", "Eating disorders", "Neurodevelopmental disorders", "Substance use disorders",
    "Intoxication and withdrawal syndromes", "Sleep-wake disorders", "Delirium and neurocognitive disorders", "Dissociative disorders", "Suicide and violence risk",
    "Psychopharmacology adverse effects", "Child and adolescent psychiatry", "Psychotherapy modalities",
  ], 6),
  sys("Biochemistry and Nutrition", [
    "Fat-soluble vitamins", "Water-soluble vitamins", "Vitamin deficiency syndromes", "Trace minerals", "Protein-energy malnutrition",
    "Obesity and energy balance", "Dietary fiber and macronutrient metabolism", "Ethanol metabolism", "Metabolic diseases of carbohydrate metabolism", "Fatty acid oxidation disorders",
    "Amino acid disorders", "Urea cycle disorders", "Lysosomal enzyme deficiencies", "Peroxisomal disorders", "Hyperlipidemias",
    "Gluconeogenesis disorders", "Nutrition in pregnancy and infancy", "Enzyme deficiencies in purine metabolism",
  ]),
  sys("Genetics", [
    "Autosomal dominant disorders", "Autosomal recessive disorders", "X-linked disorders", "Trisomies and sex chromosome aneuploidy", "Microdeletion syndromes",
    "Trinucleotide repeat expansion diseases", "Imprinting disorders", "Mitochondrial diseases", "Familial cancer syndromes", "Connective tissue genetic syndromes",
    "Lysosomal storage genetics", "Cystic fibrosis genetics", "Hemoglobinopathy genetics", "Prenatal screening and diagnosis", "Newborn screening",
    "Polygenic and multifactorial inheritance", "Genetic counseling",
  ], 4),
  sys("Biostatistics and Epidemiology", [
    "Study designs: cohort, case-control, cross-sectional, trials", "Bias and confounding", "Sensitivity and specificity", "Positive and negative predictive value", "Likelihood ratios",
    "ROC curves and test cutoffs", "Incidence, prevalence and mortality rates", "Relative risk and odds ratio", "Attributable risk and number needed to treat", "Hypothesis testing and p-values",
    "Confidence intervals", "Type I and type II errors and power", "Statistical tests: t-test, ANOVA, chi-square", "Correlation and regression", "Normal distribution and measures of central tendency",
    "Screening and lead-time bias", "Randomization, blinding and intention-to-treat", "Clinical trial phases", "Vaccine efficacy and herd immunity", "Interpretation of medical literature",
  ], 5),
  sys("Ethics, Safety and Communication", [
    "Informed consent", "Decision-making capacity", "Surrogate decision-making", "Advance directives and DNR orders", "Confidentiality and HIPAA",
    "Medical errors and disclosure", "Patient safety and quality improvement", "Professionalism and impaired colleagues", "Minors and consent", "Abuse reporting",
    "Breaking bad news", "Interpreter use and cultural humility", "Conflict of interest and gifts", "Research ethics and IRB", "Organ donation and brain death",
    "Physician-assisted death and palliative care", "Health care disparities", "Medical malpractice",
  ], 8),
  sys("Multisystem Processes", [
    "Sepsis and systemic inflammatory response", "Shock states", "Disseminated intravascular coagulation", "Fluid and electrolyte disorders", "Acid-base disturbances",
    "Hypothermia and hyperthermia", "Poisoning and overdose", "Trauma and burns", "Anaphylactic shock", "Aging and geriatric physiology",
    "Pain physiology", "Healing and fibrosis", "Environmental exposures", "Smoking and alcohol-related disease", "Obesity-related disease",
    "Multiple organ dysfunction syndrome", "Fever and inflammatory markers", "Normal growth and development",
  ], 6),
  sys("Infectious Diseases", [
    "Sepsis", "Meningitis and encephalitis", "Osteomyelitis", "Congenital TORCH infections", "Opportunistic infections in HIV",
    "Zoonoses and vector-borne illness", "Hospital-acquired infections", "Fungal infections", "Parasitic infections", "Genital ulcer and discharge syndromes",
    "Travel-related infections", "Antimicrobial prophylaxis", "Vaccine-preventable diseases", "Bioterrorism agents",
  ]),
  sys("Pregnancy, Childbirth and the Puerperium", [
    "Normal pregnancy and prenatal care", "Physiologic changes of pregnancy", "Embryology and placental development", "Teratogens in pregnancy", "Hypertensive disorders of pregnancy",
    "Gestational diabetes", "Ectopic pregnancy", "Spontaneous abortion", "Antepartum hemorrhage", "Preterm labor and PPROM",
    "Postpartum hemorrhage", "Postpartum infections and depression", "Rh alloimmunization", "Congenital infections", "Lactation",
  ], 5),
];

/* ------------------------------------------------------------------ */
/* USMLE STEP 2 CK                                                     */
/* ------------------------------------------------------------------ */

const CK_SUBJECTS: SeedTaxonomy[] = [
  subj("Internal Medicine: Cardiology", [
    "Chest pain evaluation", "Stable ischemic heart disease and stress testing", "Unstable angina and NSTEMI management", "STEMI reperfusion and post-MI care", "Acute decompensated heart failure management",
    "Chronic HFrEF guideline-directed therapy", "HFpEF management", "Atrial fibrillation rate/rhythm control and anticoagulation", "Supraventricular tachycardia management", "Ventricular arrhythmias and sudden cardiac death",
    "Bradyarrhythmias and heart block", "Syncope workup", "Hypertension treatment algorithms", "Resistant and secondary hypertension", "Valvular disease timing of intervention",
    "Infective endocarditis diagnosis and prophylaxis", "Pericarditis and tamponade", "Cardiomyopathy evaluation", "Aortic dissection and aneurysm management", "Cardiac risk assessment before noncardiac surgery",
    "Dyslipidemia and statin therapy", "Peripheral arterial disease and claudication",
  ]),
  subj("Internal Medicine: Pulmonology and Critical Care", [
    "Dyspnea evaluation", "Chronic cough workup", "COPD exacerbation management", "Asthma stepwise therapy", "Community-acquired pneumonia treatment",
    "Hospital-acquired and ventilator-associated pneumonia", "Pulmonary embolism diagnosis and treatment", "Solitary pulmonary nodule", "Lung cancer screening and staging", "Pleural effusion analysis",
    "Pneumothorax management", "Interstitial lung disease evaluation", "Sarcoidosis", "Occupational lung disease", "Obstructive sleep apnea",
    "ARDS and ventilator management", "Acute respiratory failure", "Shock resuscitation in the ICU", "Sepsis bundles and vasopressors", "Pulmonary function test interpretation",
    "Oxygen therapy and noninvasive ventilation", "Hemoptysis",
  ]),
  subj("Internal Medicine: Gastroenterology and Hepatology", [
    "Dysphagia evaluation", "GERD and Barrett esophagus", "Upper GI bleeding management", "Lower GI bleeding", "Peptic ulcer and H. pylori therapy",
    "Acute abdominal pain evaluation", "Acute pancreatitis management", "Chronic pancreatitis", "Biliary colic, cholecystitis and cholangitis", "Viral hepatitis serology interpretation",
    "Cirrhosis complications", "Hepatic encephalopathy and SBP", "Variceal bleeding", "Alcoholic liver disease", "NAFLD and MASH",
    "Autoimmune and cholestatic liver disease", "Inflammatory bowel disease management", "Celiac disease and malabsorption", "Colon cancer screening", "Diarrhea evaluation and C. difficile",
    "Irritable bowel syndrome", "Hepatocellular carcinoma surveillance",
  ]),
  subj("Internal Medicine: Nephrology and Electrolytes", [
    "Acute kidney injury workup", "Hyponatremia", "Hypernatremia", "Hypokalemia", "Hyperkalemia and ECG changes",
    "Hypercalcemia and hypocalcemia", "Metabolic acidosis anion gap", "Metabolic alkalosis", "Respiratory acid-base disorders", "Glomerulonephritis workup",
    "Nephrotic syndrome management", "Chronic kidney disease complications", "Dialysis indications and complications", "Hematuria evaluation", "Proteinuria evaluation",
    "Nephrolithiasis management", "Renal artery stenosis", "Contrast nephropathy prevention", "Polycystic kidney disease", "Kidney transplant medical management",
  ]),
  subj("Internal Medicine: Endocrinology", [
    "Type 2 diabetes pharmacotherapy", "Type 1 diabetes and insulin regimens", "DKA and HHS management", "Hypoglycemia evaluation", "Diabetes screening and complications prevention",
    "Hypothyroidism management", "Hyperthyroidism and thyroid storm", "Thyroid nodule evaluation", "Primary hyperparathyroidism", "Osteoporosis screening and treatment",
    "Cushing syndrome diagnosis", "Adrenal insufficiency and adrenal crisis", "Primary aldosteronism", "Pheochromocytoma", "Adrenal incidentaloma",
    "Pituitary adenomas and prolactinoma", "Acromegaly", "Hypopituitarism", "Hypogonadism", "Obesity management and bariatric surgery",
    "Multiple endocrine neoplasia evaluation", "Hyperlipidemia and metabolic syndrome",
  ]),
  subj("Internal Medicine: Hematology and Oncology", [
    "Anemia evaluation by MCV", "Iron deficiency anemia", "Vitamin B12 and folate deficiency", "Hemolytic anemia workup", "Sickle cell disease complications",
    "Thrombocytopenia: ITP, TTP and HIT", "DIC", "Hemophilia and von Willebrand disease", "Venous thromboembolism prophylaxis and treatment", "Thrombophilia testing",
    "Anticoagulant reversal and management", "Transfusion indications and reactions", "Leukemia diagnosis and presentations", "Lymphoma staging and treatment", "Multiple myeloma",
    "Myeloproliferative neoplasms", "Cancer screening guidelines", "Oncologic emergencies", "Breast cancer management", "Lung cancer management",
    "Colorectal cancer management", "Prostate cancer screening and management", "Cancer of unknown primary", "Paraneoplastic syndromes", "Chemotherapy and immunotherapy toxicities",
  ]),
  subj("Internal Medicine: Infectious Diseases", [
    "Fever of unknown origin", "Sepsis recognition and empiric therapy", "Bacterial meningitis management", "Encephalitis", "HIV testing and antiretroviral therapy",
    "Opportunistic infection prophylaxis", "Tuberculosis diagnosis and treatment", "Urinary tract infection management", "Skin and soft tissue infections", "Osteomyelitis and diabetic foot infection",
    "Septic arthritis", "Sexually transmitted infection treatment", "Infectious diarrhea", "Fungal infections in immunocompromised hosts", "Malaria and travel medicine",
    "Tick-borne disease", "Healthcare-associated infections", "Antibiotic selection and stewardship", "Vaccination schedules in adults", "Infectious mononucleosis and viral syndromes",
  ]),
  subj("Internal Medicine: Rheumatology and Allergy", [
    "Monoarticular arthritis evaluation", "Rheumatoid arthritis management", "Gout treatment", "Systemic lupus erythematosus management", "Antiphospholipid syndrome",
    "Scleroderma and Raynaud", "Sjogren syndrome", "Giant cell arteritis and polymyalgia rheumatica", "ANCA-associated vasculitis", "Spondyloarthritis",
    "Inflammatory myopathy", "Fibromyalgia", "Autoantibody interpretation", "Anaphylaxis management", "Drug allergy",
    "Urticaria and angioedema", "Allergic rhinitis", "Immunodeficiency workup",
  ]),
  subj("Geriatrics and Palliative Care", [
    "Falls in older adults", "Delirium prevention and treatment", "Dementia diagnosis and care", "Polypharmacy and Beers criteria", "Urinary incontinence in older adults",
    "Pressure ulcers", "Frailty and functional assessment", "Elder abuse", "Hospice eligibility", "Symptom management in palliative care",
    "Pain management and opioid conversion", "Goals-of-care conversations", "Nutrition and weight loss in the elderly", "Driving safety and capacity",
  ]),
  subj("Surgery", [
    "Preoperative evaluation and risk stratification", "Postoperative fever", "Postoperative complications", "Surgical site infection", "Acute abdomen evaluation",
    "Appendicitis", "Small bowel obstruction", "Large bowel obstruction and volvulus", "Diverticulitis", "Hernias",
    "Mesenteric ischemia", "Gallbladder and biliary surgery", "Pancreatic surgery", "Bariatric surgery", "Breast mass evaluation and surgery",
    "Thyroid and parathyroid surgery", "Colorectal surgery and anorectal disease", "Surgical oncology principles", "Fluid and electrolyte management in surgical patients", "Surgical nutrition",
    "Wound healing and closure", "Perioperative anticoagulation management", "Anesthesia and malignant hyperthermia", "Transplant surgery", "Vascular surgery: carotid, aortic and limb ischemia",
  ]),
  subj("Trauma and Surgical Emergencies", [
    "ATLS primary survey", "Airway management and cricothyroidotomy", "Tension pneumothorax and hemothorax", "Cardiac tamponade in trauma", "Hemorrhagic shock classification",
    "Blunt abdominal trauma and FAST", "Penetrating trauma", "Splenic and liver injury", "Pelvic fracture", "Head trauma and herniation",
    "Spinal cord injury", "Burn resuscitation", "Compartment syndrome", "Rhabdomyolysis", "Necrotizing soft tissue infection",
    "Ruptured abdominal aortic aneurysm", "Epidural and subdural hematoma", "Pediatric trauma", "Pregnancy trauma",
  ]),
  subj("Pediatrics", [
    "Well-child visits and developmental milestones", "Immunization schedule", "Newborn evaluation and screening", "Neonatal jaundice", "Neonatal sepsis and fever",
    "Respiratory distress in the newborn", "Prematurity and complications", "Failure to thrive", "Congenital heart disease presentations", "Bronchiolitis and croup",
    "Pediatric asthma", "Pediatric pneumonia", "Otitis media", "Pharyngitis", "Pediatric gastroenteritis and dehydration",
    "Pyloric stenosis and intussusception", "Malrotation and Hirschsprung disease", "Congenital anomalies of the GI tract", "Kawasaki disease", "Henoch-Schonlein purpura",
    "Pediatric UTI and vesicoureteral reflux", "Childhood cancers", "Child abuse", "Adolescent health and confidentiality", "Genetic syndromes in children",
    "Pediatric endocrine disorders", "Pediatric orthopedics: SCFE, Legg-Calve-Perthes", "Febrile seizures", "Poisoning and ingestion in children", "Congenital metabolic disease",
  ]),
  subj("Obstetrics", [
    "Prenatal care and screening", "Prenatal genetic testing", "First-trimester bleeding", "Ectopic pregnancy", "Hyperemesis gravidarum",
    "Gestational diabetes", "Gestational hypertension and preeclampsia", "Eclampsia and HELLP syndrome", "Third-trimester bleeding: previa and abruption", "Preterm labor and PPROM",
    "Normal labor stages and mechanism", "Abnormal labor and dystocia", "Fetal heart rate monitoring", "Cesarean delivery indications", "Operative vaginal delivery",
    "Postpartum hemorrhage", "Postpartum infection and mastitis", "Postpartum depression", "Rh isoimmunization", "Multiple gestation",
    "Intrauterine growth restriction", "Medications in pregnancy and lactation", "Medical conditions complicating pregnancy", "Intrapartum fever and chorioamnionitis",
  ]),
  subj("Gynecology", [
    "Abnormal uterine bleeding", "Amenorrhea", "Polycystic ovary syndrome", "Contraception", "Infertility evaluation",
    "Pelvic pain and endometriosis", "Fibroids", "Ovarian masses and torsion", "Pelvic inflammatory disease", "Vaginitis",
    "Cervical cancer screening", "Endometrial cancer", "Ovarian cancer", "Menopause and hormone therapy", "Pelvic organ prolapse",
    "Urinary incontinence in women", "Breast disorders in women", "Sexual dysfunction", "Premenstrual dysphoric disorder", "Abortion and pregnancy termination counseling",
  ]),
  subj("Psychiatry", [
    "Major depressive disorder treatment", "Bipolar disorder treatment", "Schizophrenia and antipsychotic therapy", "Generalized anxiety disorder", "Panic disorder",
    "OCD and related disorders", "PTSD and acute stress disorder", "ADHD", "Autism spectrum disorder", "Conduct and oppositional defiant disorders",
    "Personality disorders", "Eating disorder management", "Alcohol use disorder and withdrawal", "Opioid use disorder and treatment", "Stimulant, cannabis and sedative use disorders",
    "Delirium vs dementia vs depression", "Suicide risk assessment", "Involuntary hospitalization", "Neuroleptic malignant syndrome and serotonin syndrome", "Lithium toxicity and monitoring",
    "Somatic symptom disorders and factitious disorder", "Grief and adjustment disorders", "Psychiatric emergencies", "Child and adolescent psychopharmacology",
  ]),
  subj("Neurology", [
    "Acute ischemic stroke management", "TIA and stroke prevention", "Intracerebral and subarachnoid hemorrhage", "Seizure and status epilepticus management", "Headache: migraine, cluster and tension",
    "Altered mental status workup", "Dementia subtypes", "Parkinson disease and parkinsonism", "Multiple sclerosis", "Myasthenia gravis and Lambert-Eaton",
    "Guillain-Barre syndrome", "ALS and motor neuron disease", "Peripheral neuropathy evaluation", "Back pain and cauda equina syndrome", "Brain tumors",
    "Meningitis and encephalitis in neurology", "Normal pressure hydrocephalus", "Idiopathic intracranial hypertension", "Dizziness and vertigo", "Coma and brain death",
    "Neuro-ophthalmology", "Tremor and movement disorders", "Neurocutaneous syndromes",
  ]),
  subj("Emergency Medicine", [
    "Triage and ABCs", "Cardiac arrest and ACLS", "Anaphylaxis", "Acute coronary syndromes in the ED", "Altered mental status in the ED",
    "Acute abdomen in the ED", "Toxicology: acetaminophen, salicylate and TCA overdose", "Toxic alcohols and carbon monoxide", "Environmental emergencies: heat and cold", "Drowning and electrical injury",
    "Envenomation and bites", "Ophthalmic emergencies", "ENT emergencies", "Gynecologic emergencies", "Testicular torsion and urologic emergencies",
    "Procedural sedation", "Disaster medicine and mass casualty", "Pediatric emergencies", "Sepsis in the ED", "Hypertensive emergencies",
  ]),
  subj("Family Medicine and Preventive Medicine", [
    "Adult health maintenance and screening", "USPSTF screening recommendations", "Immunizations in adults", "Smoking cessation", "Alcohol screening and brief intervention",
    "Obesity counseling", "Contraceptive counseling", "Common outpatient complaints", "Chronic disease management", "Low back pain",
    "Sports physicals and preparticipation evaluation", "Travel medicine", "Occupational and environmental health", "Primary, secondary and tertiary prevention", "Chronic pain and opioid prescribing",
    "Care coordination and transitions", "Counseling and motivational interviewing", "Common dermatologic complaints in primary care",
  ]),
  subj("Orthopedics and Sports Medicine", [
    "Fracture types and management", "Pediatric fractures", "Knee injuries: ACL, MCL, meniscus", "Shoulder injuries and rotator cuff", "Hip fractures and dislocations",
    "Ankle sprains and Ottawa rules", "Hand and wrist injuries", "Osteomyelitis and septic joint", "Low back pain red flags", "Carpal tunnel and entrapment neuropathies",
    "Bone tumors", "Overuse injuries and stress fractures", "Concussion management", "Osteoporosis and fragility fractures", "Developmental dysplasia of the hip",
  ]),
  subj("Biostatistics, Epidemiology and Evidence-Based Medicine", [
    "Study design selection", "Bias types", "Confounding and effect modification", "Test characteristics", "Number needed to treat and harm",
    "Relative and absolute risk reduction", "Hypothesis testing", "Confidence intervals and p-values", "Clinical trial analysis: intention-to-treat", "Screening test evaluation",
    "Survival analysis and Kaplan-Meier", "Meta-analysis interpretation", "Clinical decision rules", "Outbreak investigation", "Disease surveillance and reporting",
    "Vaccine effectiveness", "Interpretation of medical literature",
  ]),
  subj("Medical Ethics, Professionalism and Patient Safety", [
    "Informed consent exceptions", "Capacity assessment", "Surrogate decision-making hierarchy", "Advance directives and POLST", "Futility and withdrawal of care",
    "Confidentiality and duty to warn", "Minor consent and emancipated minors", "Adverse event disclosure", "Root cause analysis and patient safety", "Medication error prevention",
    "Handoffs and communication tools", "Impaired physician and colleague conduct", "Sexual boundaries and professionalism", "Conflicts of interest", "Reporting communicable disease",
    "Interpreter use and cultural competence", "Research ethics", "Resource allocation and triage ethics", "End-of-life and palliative sedation", "Health care disparities and social determinants",
    "Quality improvement and checklists",
  ]),
];

const CK_SYSTEMS: SeedTaxonomy[] = [
  sys("Cardiovascular", [
    "Acute coronary syndrome", "Stable angina", "Heart failure with reduced ejection fraction", "Heart failure with preserved ejection fraction", "Atrial fibrillation and flutter",
    "Supraventricular tachycardias", "Ventricular tachycardia and fibrillation", "Heart blocks", "Long QT and Brugada syndromes", "Hypertension",
    "Hypertensive urgency and emergency", "Aortic stenosis", "Aortic regurgitation", "Mitral stenosis and regurgitation", "Mitral valve prolapse",
    "Infective endocarditis", "Acute pericarditis", "Cardiac tamponade", "Hypertrophic cardiomyopathy", "Dilated and restrictive cardiomyopathy",
    "Myocarditis", "Aortic dissection", "Abdominal aortic aneurysm", "Peripheral arterial disease", "Deep vein thrombosis", "Venous insufficiency", "Congenital heart disease in adults",
  ], 7),
  sys("Respiratory", [
    "Asthma", "COPD", "Bronchiectasis", "Cystic fibrosis in adults", "Community-acquired pneumonia",
    "Aspiration pneumonia and lung abscess", "Tuberculosis", "Pulmonary embolism", "Pulmonary hypertension", "Idiopathic pulmonary fibrosis",
    "Sarcoidosis", "Hypersensitivity pneumonitis", "Pneumoconioses", "Lung cancer", "Mesothelioma",
    "Pleural effusion and empyema", "Pneumothorax", "Obstructive sleep apnea", "Acute respiratory distress syndrome", "Respiratory failure",
    "Foreign body aspiration", "Pulmonary nodules", "Smoking-related lung disease",
  ], 7),
  sys("Renal and Urinary", [
    "Acute kidney injury: prerenal, intrinsic and postrenal", "Acute tubular necrosis", "Acute interstitial nephritis", "Chronic kidney disease and complications", "End-stage renal disease and dialysis",
    "Nephrotic syndrome", "Nephritic syndrome", "IgA nephropathy", "Diabetic nephropathy", "Renal tubular acidosis",
    "Nephrolithiasis", "Urinary tract infection", "Pyelonephritis", "Benign prostatic hyperplasia", "Urinary retention",
    "Bladder cancer", "Renal cell carcinoma", "Prostate cancer", "Testicular cancer", "Urinary incontinence",
    "Vesicoureteral reflux", "Renal artery stenosis", "Hyponatremia", "Hyperkalemia",
  ], 5),
  sys("Gastrointestinal", [
    "GERD", "Esophageal motility disorders", "Esophageal cancer", "Peptic ulcer disease", "Gastric cancer",
    "Upper GI bleeding", "Lower GI bleeding", "Crohn disease", "Ulcerative colitis", "Celiac disease",
    "Colorectal cancer", "Diverticular disease", "Appendicitis", "Intestinal obstruction", "Ischemic bowel",
    "Acute pancreatitis", "Pancreatic cancer", "Cholelithiasis and cholecystitis", "Cholangitis and primary sclerosing cholangitis", "Primary biliary cholangitis",
    "Viral hepatitis", "Alcoholic hepatitis and cirrhosis", "Hepatocellular carcinoma", "Hemochromatosis and Wilson disease", "Acute liver failure",
    "Infectious diarrhea", "Irritable bowel syndrome", "Hernias", "Anal fissure, hemorrhoids and fistula",
  ], 7),
  sys("Endocrine", [
    "Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "Diabetic ketoacidosis", "Hyperosmolar hyperglycemic state", "Diabetic neuropathy, retinopathy and nephropathy",
    "Hypoglycemia and insulinoma", "Graves disease", "Toxic nodular goiter", "Hashimoto thyroiditis", "Subacute thyroiditis",
    "Thyroid cancer", "Primary hyperparathyroidism", "Hypoparathyroidism", "Cushing syndrome", "Adrenal insufficiency",
    "Congenital adrenal hyperplasia", "Hyperaldosteronism", "Pheochromocytoma", "Prolactinoma", "Acromegaly",
    "Diabetes insipidus", "SIADH", "Multiple endocrine neoplasia", "Metabolic syndrome", "Osteoporosis", "Carcinoid syndrome",
  ], 6),
  sys("Reproductive", [
    "Normal pregnancy", "Ectopic pregnancy", "Spontaneous abortion", "Preeclampsia and eclampsia", "Gestational diabetes",
    "Placenta previa and abruption", "Preterm labor", "Postpartum hemorrhage", "Abnormal uterine bleeding", "Amenorrhea",
    "Polycystic ovary syndrome", "Endometriosis", "Uterine fibroids", "Ovarian cysts and tumors", "Pelvic inflammatory disease",
    "Vaginitis and cervicitis", "Cervical dysplasia and cancer", "Endometrial cancer", "Breast cancer", "Benign breast disease",
    "Menopause", "Contraception", "Infertility", "Erectile dysfunction", "Epididymitis and orchitis",
    "Testicular torsion", "Cryptorchidism and varicocele", "Benign prostatic hyperplasia", "Sexually transmitted infections", "Disorders of puberty",
  ], 8),
  sys("Musculoskeletal and Connective Tissue", [
    "Osteoarthritis", "Rheumatoid arthritis", "Gout and pseudogout", "Septic arthritis", "Osteomyelitis",
    "Systemic lupus erythematosus", "Systemic sclerosis", "Polymyositis and dermatomyositis", "Polymyalgia rheumatica", "Giant cell arteritis",
    "Ankylosing spondylitis", "Psoriatic arthritis", "Reactive arthritis", "Fibromyalgia", "Osteoporosis",
    "Paget disease of bone", "Osteosarcoma and Ewing sarcoma", "Low back pain and radiculopathy", "Carpal tunnel syndrome", "Rotator cuff and shoulder disorders",
    "Knee ligament and meniscal injuries", "Fractures and dislocations", "Bursitis and tendinopathy", "Scoliosis", "Developmental dysplasia of the hip",
  ], 7),
  sys("Nervous System", [
    "Ischemic stroke", "Transient ischemic attack", "Intracerebral hemorrhage", "Subarachnoid hemorrhage", "Subdural and epidural hematoma",
    "Epilepsy and seizure syndromes", "Status epilepticus", "Migraine", "Cluster and tension headache", "Alzheimer disease",
    "Vascular and Lewy body dementia", "Parkinson disease", "Huntington disease", "Essential tremor", "Multiple sclerosis",
    "Myasthenia gravis", "Guillain-Barre syndrome", "Amyotrophic lateral sclerosis", "Brain tumors", "Bacterial and viral meningitis",
    "Brain abscess and encephalitis", "Spinal cord compression", "Peripheral neuropathy", "Bell palsy and trigeminal neuralgia", "Normal pressure hydrocephalus",
    "Idiopathic intracranial hypertension", "Syncope and vertigo", "Delirium", "Concussion",
  ], 7),
  sys("Hematology and Oncology", [
    "Iron deficiency anemia", "Anemia of chronic disease", "Megaloblastic anemia", "Aplastic anemia", "Sickle cell disease",
    "Thalassemia", "Autoimmune hemolytic anemia", "G6PD deficiency", "Immune thrombocytopenic purpura", "Thrombotic thrombocytopenic purpura and HUS",
    "Heparin-induced thrombocytopenia", "Hemophilia", "Von Willebrand disease", "Disseminated intravascular coagulation", "Venous thromboembolism",
    "Polycythemia vera", "Acute myeloid leukemia", "Acute lymphoblastic leukemia", "Chronic myeloid leukemia", "Chronic lymphocytic leukemia",
    "Hodgkin lymphoma", "Non-Hodgkin lymphoma", "Multiple myeloma", "Tumor lysis syndrome", "Superior vena cava syndrome",
    "Spinal cord compression in cancer", "Neutropenic fever", "Transfusion reactions", "Cancer screening and prevention",
  ], 5),
  sys("Immune System", [
    "Anaphylaxis", "Food allergy", "Allergic rhinitis", "Urticaria and angioedema", "Hereditary angioedema",
    "Common variable immunodeficiency", "Severe combined immunodeficiency", "HIV infection", "Transplant rejection", "Graft-versus-host disease",
    "Serum sickness", "Drug hypersensitivity", "Sarcoidosis", "Amyloidosis", "Autoimmune overlap syndromes",
  ], 4),
  sys("Dermatology", [
    "Atopic dermatitis", "Contact dermatitis", "Seborrheic dermatitis", "Psoriasis", "Acne vulgaris",
    "Rosacea", "Cellulitis and erysipelas", "Impetigo", "Abscess and furuncle", "Tinea infections",
    "Herpes zoster", "Herpes simplex", "Warts and molluscum", "Scabies and lice", "Pemphigus vulgaris",
    "Bullous pemphigoid", "Erythema multiforme and Stevens-Johnson syndrome", "Actinic keratosis", "Basal cell carcinoma", "Squamous cell carcinoma",
    "Melanoma", "Urticaria", "Vitiligo", "Pressure ulcers", "Cutaneous manifestations of systemic disease",
  ], 4),
  sys("Ear, Nose and Throat", [
    "Acute otitis media", "Otitis externa", "Chronic otitis media and cholesteatoma", "Hearing loss evaluation", "Meniere disease",
    "Benign paroxysmal positional vertigo", "Vestibular neuritis", "Acute and chronic sinusitis", "Epistaxis", "Allergic rhinitis",
    "Pharyngitis", "Peritonsillar abscess", "Epiglottitis", "Laryngeal cancer", "Head and neck cancer",
    "Salivary gland disorders", "Nasal polyps", "Foreign body in ear and nose", "Otosclerosis",
  ]),
  sys("Ophthalmology", [
    "Acute angle-closure glaucoma", "Open-angle glaucoma", "Cataracts", "Age-related macular degeneration", "Diabetic retinopathy",
    "Retinal detachment", "Central retinal artery occlusion", "Central retinal vein occlusion", "Conjunctivitis", "Keratitis and corneal ulcer",
    "Uveitis", "Optic neuritis", "Papilledema", "Orbital and periorbital cellulitis", "Strabismus and amblyopia",
    "Ocular trauma", "Retinoblastoma", "Blepharitis and chalazion",
  ]),
  sys("Behavioral Health", [
    "Major depressive disorder", "Persistent depressive disorder", "Bipolar I and II disorder", "Schizophrenia", "Schizoaffective and brief psychotic disorder",
    "Generalized anxiety disorder", "Panic disorder", "Social anxiety and specific phobia", "Obsessive-compulsive disorder", "Post-traumatic stress disorder",
    "Anorexia nervosa", "Bulimia nervosa and binge eating", "Attention-deficit/hyperactivity disorder", "Autism spectrum disorder", "Tourette disorder",
    "Borderline personality disorder", "Cluster A, B and C personality disorders", "Conversion and somatic symptom disorders", "Alcohol use disorder", "Opioid use disorder",
    "Cocaine and amphetamine use", "Delirium", "Neurocognitive disorders", "Insomnia and sleep disorders", "Suicidal ideation",
    "Postpartum psychiatric disorders", "Adjustment and bereavement", "Malingering and factitious disorder",
  ], 7),
  sys("Biochemistry and Nutrition", [
    "Vitamin A, D, E, K deficiency and toxicity", "Thiamine deficiency and Wernicke encephalopathy", "Niacin deficiency and pellagra", "Vitamin B12 and folate deficiency", "Vitamin C deficiency and scurvy",
    "Zinc and iron disorders", "Kwashiorkor and marasmus", "Refeeding syndrome", "Enteral and parenteral nutrition", "Obesity and weight management",
    "Inborn errors of metabolism presentations", "Lysosomal storage diseases", "Hyperlipidemia", "Nutrition in pregnancy and lactation", "Eating disorder nutritional complications",
  ]),
  sys("Genetics", [
    "Down syndrome", "Edwards and Patau syndromes", "Turner syndrome", "Klinefelter syndrome", "Fragile X syndrome",
    "Marfan syndrome", "Neurofibromatosis", "Tuberous sclerosis", "Cystic fibrosis", "Phenylketonuria",
    "Duchenne muscular dystrophy", "Hereditary cancer syndromes", "Prader-Willi and Angelman syndromes", "DiGeorge syndrome", "Prenatal genetic screening",
    "Newborn screening", "Genetic counseling principles", "Lysosomal storage disorders", "Hemochromatosis", "Familial hypercholesterolemia",
  ], 3),
  sys("Biostatistics and Epidemiology", [
    "Sensitivity, specificity and predictive values", "Study design and bias", "Relative risk, odds ratio and NNT", "Incidence and prevalence", "Screening principles and lead-time bias",
    "Statistical tests and significance", "Confidence intervals", "Clinical trial design", "Measures of association", "Standardization of rates",
    "Epidemic curves and outbreak investigation", "Public health surveillance", "Levels of prevention", "Vaccines and herd immunity", "Interpretation of medical studies",
  ], 5),
  sys("Ethics, Safety and Communication", [
    "Informed consent", "Capacity", "Advance directives", "Surrogate decision-making", "Confidentiality",
    "Disclosure of errors", "Patient safety systems", "Breaking bad news", "Professionalism", "Elder, child and intimate partner abuse",
    "End-of-life care", "Minors and confidentiality", "Cultural competence", "Medical interpreters", "Impaired physicians",
    "Transitions of care and handoffs", "Shared decision-making", "Organ donation",
  ], 8),
  sys("Multisystem Processes", [
    "Sepsis and septic shock", "Shock types", "Cardiac arrest", "Poisoning and overdose", "Anaphylaxis",
    "Hypothermia and heat illness", "Burns", "Trauma resuscitation", "Fluid and electrolyte disorders", "Acid-base disorders",
    "Drowning and inhalational injury", "Bites and stings", "Drug adverse effects", "Geriatric syndromes", "Pain management",
    "Palliative care", "Perioperative care", "Health maintenance",
  ], 6),
  sys("Infectious Diseases", [
    "HIV and AIDS", "Opportunistic infections", "Sepsis", "Meningitis", "Encephalitis",
    "Infective endocarditis", "Osteomyelitis", "Cellulitis and necrotizing fasciitis", "Tuberculosis", "Syphilis",
    "Gonorrhea and chlamydia", "Lyme disease", "Rocky Mountain spotted fever", "Malaria", "Infectious mononucleosis",
    "Influenza and COVID-19", "Candidiasis and aspergillosis", "Histoplasmosis, blastomycosis and coccidioidomycosis", "Parasitic worm infections", "Clostridioides difficile infection",
    "Toxoplasmosis and TORCH infections", "Hepatitis A, B and C", "Zoonotic infections", "Healthcare-associated infections",
  ]),
  sys("Pregnancy, Childbirth and the Puerperium", [
    "Prenatal screening", "Normal labor and delivery", "Abnormal labor", "Fetal monitoring", "Preeclampsia and eclampsia",
    "Gestational diabetes", "Ectopic pregnancy", "Miscarriage", "Placental abruption", "Placenta previa",
    "Preterm birth", "Postpartum hemorrhage", "Postpartum endometritis", "Postpartum depression and psychosis", "Rh disease",
    "Teratogens", "Hyperemesis", "Multiple gestation", "Lactation problems", "Cesarean delivery",
  ], 7),
  sys("Rheumatology", [
    "Rheumatoid arthritis", "Systemic lupus erythematosus", "Sjogren syndrome", "Scleroderma", "Dermatomyositis",
    "Vasculitides: Takayasu, giant cell, polyarteritis nodosa", "Granulomatosis with polyangiitis", "Behcet disease", "Spondyloarthropathies", "Crystal arthropathies",
    "Antiphospholipid syndrome", "Juvenile idiopathic arthritis", "Mixed connective tissue disease", "Fibromyalgia",
  ]),
];

/* ------------------------------------------------------------------ */
/* USMLE STEP 3                                                        */
/* ------------------------------------------------------------------ */

const STEP3_SUBJECTS: SeedTaxonomy[] = [
  subj("Foundations of Independent Practice", [
    "Biostatistics: study design and interpretation", "Applying screening test characteristics to patients", "Interpreting clinical trial results", "Number needed to treat in practice", "Absolute vs relative risk communication",
    "Epidemiology and outbreak response", "Preventive services and USPSTF screening", "Immunization recommendations across the lifespan", "Evidence-based medicine and critical appraisal", "Clinical decision analysis",
    "Informed consent and decision-making capacity", "Surrogate decision-makers and advance care planning", "Confidentiality, HIPAA and mandatory reporting", "Minors, consent and emancipation", "End-of-life care and withdrawal of treatment",
    "Medical errors, disclosure and apology", "Quality improvement methods (PDSA, root cause analysis)", "Patient safety culture and checklists", "Handoffs and care transitions", "Medical-legal issues and malpractice",
    "Professionalism, conflict of interest and impaired colleagues", "Health care delivery systems and payment models", "Medicare, Medicaid and insurance concepts", "Social determinants of health", "Health disparities and cultural competence",
    "Patient-centered communication and shared decision-making", "Delivering serious news to patients and families", "Interpreter use and health literacy", "Ethics of resource allocation", "Public health emergencies and reportable diseases",
  ]),
  subj("Advanced Clinical Medicine: Ambulatory Care", [
    "Annual wellness visit and health maintenance", "Hypertension long-term management", "Diabetes mellitus outpatient care", "Dyslipidemia and cardiovascular risk reduction", "Obesity and lifestyle counseling",
    "Smoking, alcohol and substance use counseling", "Chronic obstructive pulmonary disease follow-up", "Asthma control and action plans", "Heart failure outpatient optimization", "Chronic kidney disease monitoring",
    "Anemia outpatient evaluation", "Thyroid disease follow-up", "Osteoporosis prevention", "Chronic pain and opioid stewardship", "Back pain and musculoskeletal complaints",
    "Headache outpatient evaluation", "Fatigue and unexplained weight loss", "Preoperative clearance in the clinic", "Depression and anxiety in primary care", "Contraception and preconception counseling",
    "Well-child care and developmental surveillance", "Adolescent health and risk behaviors", "Medication reconciliation and polypharmacy", "Pharmacotherapy adjustments in renal and hepatic impairment", "Travel and occupational health",
  ]),
  subj("Advanced Clinical Medicine: Inpatient and Emergency Care", [
    "Chest pain in the emergency department", "Shortness of breath evaluation", "Acute abdominal pain management", "Syncope risk stratification", "Sepsis and septic shock",
    "Acute respiratory failure", "Acute coronary syndrome inpatient management", "Venous thromboembolism treatment", "Gastrointestinal bleeding stabilization", "Acute stroke triage",
    "Delirium in hospitalized patients", "Postoperative complications", "Fluid, electrolyte and acid-base emergencies", "Diabetic ketoacidosis", "Overdose and poisoning management",
    "Trauma initial management", "Cardiac arrest and post-resuscitation care", "Hospital-acquired infections", "Anticoagulation management and reversal", "Transfusion management",
    "Discharge planning and transitions of care", "Pain control in the hospital", "Code status discussions", "Pressure injury prevention", "Antibiotic selection and de-escalation",
  ]),
  subj("Advanced Clinical Medicine: Obstetrics and Gynecology", [
    "Preconception and prenatal care", "Prenatal screening and diagnostic testing", "Medical complications in pregnancy", "Hypertensive disorders of pregnancy", "Gestational diabetes management",
    "Labor management and fetal monitoring", "Postpartum care and complications", "Contraception selection", "Infertility evaluation", "Abnormal uterine bleeding",
    "Pelvic pain evaluation", "Cervical cancer screening and management", "Breast cancer screening", "Menopause management", "Sexually transmitted infection screening",
    "Intimate partner violence screening", "Pregnancy loss counseling", "Medication safety in pregnancy and lactation",
  ]),
  subj("Advanced Clinical Medicine: Pediatrics", [
    "Newborn care and screening", "Developmental milestones and delay", "Childhood immunizations and catch-up", "Fever in infants and children", "Respiratory illness in children",
    "Gastrointestinal illness in children", "Failure to thrive and growth disorders", "Congenital anomalies", "Childhood infections and exanthems", "Pediatric emergencies and poisoning",
    "Child abuse and neglect", "Adolescent medicine", "Attention and learning disorders", "Pediatric chronic disease management", "Anticipatory guidance",
  ]),
  subj("Advanced Clinical Medicine: Surgery and Perioperative Care", [
    "Preoperative risk assessment", "Perioperative medication management", "Postoperative ileus and obstruction", "Surgical infections", "Acute abdomen decision-making",
    "Trauma and burn management", "Hernia and appendiceal disease", "Surgical oncology follow-up", "Vascular surgical emergencies", "Wound care and closure",
    "Anesthesia complications", "Nutrition support in surgical patients",
  ]),
  subj("Advanced Clinical Medicine: Psychiatry and Neurology", [
    "Depression and suicide risk assessment", "Bipolar disorder management", "Psychosis management", "Anxiety disorders", "Substance use disorder treatment",
    "Delirium and dementia", "ADHD and neurodevelopmental disorders", "Personality disorders in clinical practice", "Stroke secondary prevention", "Seizure management",
    "Headache management", "Neurodegenerative disease follow-up", "Neuromuscular emergencies", "Capacity and involuntary treatment",
  ]),
  subj("Advanced Clinical Medicine: Geriatrics and Palliative Care", [
    "Comprehensive geriatric assessment", "Falls and mobility", "Dementia and caregiver support", "Polypharmacy and deprescribing", "Advance care planning",
    "Hospice and palliative care referral", "Elder abuse", "Nursing home and long-term care", "Pain and symptom control at end of life", "Functional decline and frailty",
  ]),
  subj("Computer-based Case Simulation: Initial Evaluation", [
    "Establishing the history and physical examination order", "Ordering initial diagnostic tests", "Triage and setting of care decisions", "Initial stabilization and monitoring orders", "Interpreting the first set of results",
    "Choosing appropriate imaging", "Ordering consults", "Time-sensitive vs routine ordering", "Initial treatment before diagnosis", "Vital sign interpretation and trends",
  ]),
  subj("Computer-based Case Simulation: Management and Follow-up", [
    "Ordering medications, doses and routes", "Fluids, oxygen and monitoring orders", "Advancing the clock and reassessment", "Responding to clinical changes and complications", "Ordering counseling and patient education",
    "Discharge and follow-up planning", "Transfer to ICU or ward decisions", "Avoiding harmful or contraindicated orders", "Cost-conscious test ordering", "Case ending and disposition",
    "Management of unstable patients", "Chronic disease follow-up cases", "Pediatric and neonatal cases", "Obstetric cases", "Ambulatory office cases",
    "Emergency department cases", "Inpatient ward cases", "Critical care cases",
  ]),
  subj("Patient Safety, Ethics and Professionalism", [
    "Disclosure of medical errors", "Informed refusal", "Capacity evaluation", "Advance directive validity and conflicts", "Confidentiality exceptions",
    "Reporting impaired physicians", "Conflicts of interest", "Sexual harassment and boundaries", "Research ethics", "Surrogate decision-making disputes",
    "Reporting requirements: abuse and infectious disease", "Cultural and religious conflicts in care", "Physician-patient relationship boundaries", "Telemedicine and privacy", "Duty to warn",
  ]),
  subj("Biostatistics, Epidemiology and Population Health", [
    "Interpreting studies and statistics", "Sensitivity and specificity in decision-making", "Likelihood ratios and pretest probability", "Study design appraisal", "Bias and confounding",
    "Randomized trial interpretation", "Meta-analysis and systematic review", "Incidence and prevalence calculations", "Screening principles", "Outbreak investigation",
    "Vaccination program evaluation", "Population-level prevention strategies", "Decision thresholds and cost-effectiveness", "Quality measures and risk adjustment",
  ]),
  subj("Preventive Medicine and Screening", [
    "Cancer screening: breast, cervical, colorectal, lung, prostate", "Cardiovascular risk reduction", "Vaccination across the lifespan", "Fall prevention", "Abdominal aortic aneurysm screening",
    "Osteoporosis screening", "Depression and substance use screening", "STI and HIV screening", "Prenatal and neonatal screening", "Lifestyle counseling",
    "Injury and violence prevention", "Occupational health surveillance",
  ]),
];

const STEP3_SYSTEMS: SeedTaxonomy[] = extend(
  CK_SYSTEMS,
  {
    Cardiovascular: ["Long-term anticoagulation decision-making", "Cardiac rehabilitation", "Secondary prevention after myocardial infarction", "Device therapy: ICD and cardiac resynchronization", "Perioperative cardiac risk"],
    Respiratory: ["COPD long-term management and oxygen therapy", "Pulmonary rehabilitation", "Vaccination in chronic lung disease", "Lung cancer screening eligibility"],
    "Renal and Urinary": ["Contrast-associated AKI prevention", "Medication dosing in chronic kidney disease", "Outpatient hematuria evaluation"],
    Gastrointestinal: ["Colonoscopy surveillance intervals", "Hepatitis B and C screening and treatment", "Chronic liver disease outpatient management", "Barrett esophagus surveillance"],
    Endocrine: ["Outpatient glycemic targets and A1c monitoring", "Diabetes inpatient management", "Thyroid nodule follow-up", "Bone density monitoring"],
    Reproductive: ["Preconception counseling", "Long-acting reversible contraception", "Postmenopausal bleeding evaluation", "Pregnancy-related medication safety"],
    "Nervous System": ["Secondary stroke prevention", "Antiepileptic drug management", "Driving restrictions after seizure or stroke"],
    "Behavioral Health": ["Collaborative care model", "Medication-assisted treatment in primary care", "Antipsychotic metabolic monitoring"],
    "Ethics, Safety and Communication": ["Medication reconciliation", "Health literacy", "Telehealth encounters", "Team-based care"],
    "Multisystem Processes": ["Chronic pain management", "Opioid risk mitigation", "Care of the medically complex patient"],
  },
  [],
  {},
);

/* ------------------------------------------------------------------ */
/* OSTEOPATHIC PRINCIPLES, PRACTICE AND MANIPULATION (COMLEX)         */
/* ------------------------------------------------------------------ */

const OPP_BASE: SeedTaxonomy[] = [
  subj("Osteopathic Principles, Practice and Manipulation", [
    "Four tenets of osteopathic medicine", "Osteopathic philosophy and history", "Somatic dysfunction (TART criteria)", "Somatic dysfunction documentation (ICD coding)", "Barrier concepts: restrictive and anatomic",
    "Fryette's principles of spinal motion", "Type I and Type II spinal mechanics", "Neutral, flexed and extended dysfunction nomenclature", "Positional diagnosis and naming rules", "Tissue texture changes: acute vs chronic",
    "Contraindications to OMT", "Indications for OMT", "Primary respiratory mechanism concepts", "Allostasis and homeostasis", "Body unity and self-regulation",
    "Osteopathic evidence base and research", "Patient positioning for OMT", "Physician ergonomics in OMT",
  ]),
  subj("OMM: Diagnosis and Regional Examination", [
    "Static and dynamic structural examination", "Postural examination and gait analysis", "Leg length inequality assessment", "Standing and seated flexion tests", "Sacral landmarks and ASIS/PSIS asymmetry",
    "Pelvic and innominate screening", "Lumbar region examination", "Thoracic region examination", "Rib cage examination", "Cervical region examination",
    "Upper extremity examination", "Lower extremity examination", "Sacral axis and sacral torsion diagnosis", "Spring test and sacral rock", "Occipitoatlantal and atlantoaxial motion testing",
    "Cranial palpation landmarks", "Region-specific motion testing", "Screening vs scanning examinations", "Segmental palpation of the spine", "Diagnosis of pubic symphysis dysfunction",
  ]),
  subj("OMM: Direct Techniques", [
    "High-velocity low-amplitude (HVLA) technique", "Muscle energy technique", "Post-isometric relaxation", "Reciprocal inhibition", "Respiratory assistance in muscle energy",
    "Articulatory technique", "Soft tissue technique", "Myofascial release (direct)", "Thrust technique principles and safety", "Mitchell's muscle energy for the pelvis",
    "Muscle energy for the sacrum", "Muscle energy for the cervical spine", "Muscle energy for the thoracic and lumbar spine", "Muscle energy for ribs: inhalation and exhalation dysfunctions", "Direct vs indirect method selection",
  ]),
  subj("OMM: Indirect Techniques", [
    "Counterstrain technique", "Tender points: anterior and posterior", "Facilitated positional release", "Balanced ligamentous tension", "Ligamentous articular strain",
    "Functional technique", "Indirect myofascial release", "Still technique", "Strain-counterstrain for the lumbar spine", "Strain-counterstrain for the cervical spine",
    "Strain-counterstrain for the ribs", "Jones points", "Position of ease concept", "Fascial unwinding",
  ]),
  subj("OMM: Cranial and Fascial Concepts", [
    "Cranial osteopathy: primary respiratory mechanism", "Cranial rhythmic impulse", "Cranial bone motion: flexion and extension", "Sphenobasilar synchondrosis strains", "Sphenobasilar torsion, sidebending-rotation, lateral and vertical strain",
    "Cranial compression techniques", "Venous sinus drainage", "Temporal bone dysfunction", "Occipitomastoid suture", "Dural tension and reciprocal tension membrane",
    "Cranial nerve involvement in cranial dysfunction", "Fascial planes of the body", "Cervical fascial layers", "Thoracic inlet and diaphragm fascia", "Myofascial trigger points",
  ]),
  subj("OMM: Autonomic, Lymphatic and Visceral Concepts", [
    "Viscerosomatic reflexes", "Somatovisceral reflexes", "Sympathetic chain ganglia and segmental innervation", "Sympathetic levels: head and neck, heart, lungs, GI, GU", "Parasympathetic innervation and vagal/sacral outflow",
    "Chapman's reflex points: anterior and posterior", "Chapman's points for common viscera", "Facilitated segment concept", "Autonomic effects of OMT", "Rib raising",
    "Lymphatic pump techniques", "Thoracic pump and pedal pump", "Splenic pump", "Liver pump", "Effleurage and lymphatic drainage",
    "Diaphragms of the body", "Thoracic inlet release", "Celiac and mesenteric ganglion technique", "Sacral and lumbar sympathetic effects", "Pelvic diaphragm",
  ]),
  subj("OMM: Clinical Application by Condition", [
    "OMT for low back pain", "OMT for neck pain and headache", "OMT for asthma and COPD", "OMT for pneumonia", "OMT for otitis media and sinusitis",
    "OMT for constipation and ileus", "OMT for dysmenorrhea", "OMT in pregnancy and postpartum", "OMT for pediatric patients", "OMT in the geriatric patient",
    "OMT for hospitalized patients", "OMT for sciatica and piriformis syndrome", "OMT for shoulder dysfunction", "OMT for carpal tunnel syndrome", "OMT for temporomandibular dysfunction",
    "OMT for scoliosis", "OMT for fibromyalgia", "OMT for plantar fasciitis", "OMT for rib dysfunction and costochondritis", "OMT for postoperative ileus",
  ]),
];

const OMM_SYSTEMS: SeedTaxonomy[] = [
  sys("Osteopathic Regional Anatomy and Biomechanics", [
    "Occipitoatlantal joint mechanics", "Atlantoaxial joint mechanics", "Typical cervical vertebrae motion", "Thoracic spine and rib cage biomechanics", "Lumbar spine mechanics",
    "Sacroiliac joint mechanics", "Innominate dysfunctions: anterior, posterior, upslip, downslip, inflare, outflare", "Sacral base and sacral axes", "Pubic symphysis", "Pelvic girdle and sacral torsions",
    "Shoulder girdle mechanics", "Elbow, wrist and hand mechanics", "Hip mechanics", "Knee mechanics", "Ankle and foot mechanics",
    "Thoracic outlet", "Rib mechanics: pump-handle and bucket-handle", "Ribs 1-2, 3-10 and 11-12 dysfunction groups", "Spinal curvatures and compensation patterns", "Cervical and lumbar facet orientation",
  ]),
  sys("Osteopathic Viscerosomatic Correlations", [
    "Heart sympathetic innervation (T1-T6)", "Lung and bronchi sympathetic innervation (T2-T7)", "Stomach (T5-T9) viscerosomatic reflex", "Liver and gallbladder (T6-T10) viscerosomatic reflex", "Small intestine (T8-T10)",
    "Large intestine (T10-L2)", "Kidney and ureter (T10-L1)", "Bladder (T11-L2)", "Uterus, ovaries and prostate (T10-L2)", "Adrenal glands (T10-T11)",
    "Head and neck sympathetics (T1-T4)", "Parasympathetic vagal reflexes", "Pelvic splanchnic nerves (S2-S4)", "Chapman's points for the heart and lungs", "Chapman's points for the GI tract and kidney",
    "Chapman's points for the appendix and reproductive organs", "Thoracic cage and visceral relationships", "Segmental facilitation", "Reflex patterns after myocardial infarction", "Reflex patterns after appendicitis and renal colic",
  ]),
];

/* ------------------------------------------------------------------ */
/* COMLEX-USA LEVEL 1                                                  */
/* ------------------------------------------------------------------ */

const COMLEX1_BASIC_SUBJECTS: SeedTaxonomy[] = extend(
  STEP1_SUBJECTS,
  {
    "Gross Anatomy": ["Osteopathic structural anatomy: spinal segments and landmarks", "Fascia and its clinical significance", "Lymphatic drainage pathways", "Sympathetic and parasympathetic outflow levels"],
    Physiology: ["Neuroendocrine-immune interactions", "Autonomic reflexes and somatic afferents", "Nociception and pain modulation", "Proprioception and muscle spindle function"],
    "Neuroscience": ["Somatic and visceral afferent convergence", "Facilitated segment neurophysiology", "Gate control theory of pain"],
    "Behavioral Science": ["Osteopathic approach to patient-centered care", "Health promotion and disease prevention", "Medical humanism and compassion", "Substance abuse screening and brief intervention"],
    Pathology: ["Pathology of somatic dysfunction and chronic pain"],
  },
  [],
  {},
);

const COMLEX1_SUBJECTS: SeedTaxonomy[] = [...OPP_BASE, ...COMLEX1_BASIC_SUBJECTS];

const COMLEX1_SYSTEMS: SeedTaxonomy[] = extend(
  STEP1_SYSTEMS,
  {
    Cardiovascular: ["Osteopathic considerations in cardiovascular disease", "Cardiac sympathetic innervation T1-T6", "Rib raising and lymphatic pumps in heart failure"],
    Respiratory: ["Osteopathic considerations in respiratory disease", "Respiratory mechanics and rib motion", "Diaphragm function and OMT"],
    "Renal and Urinary": ["Osteopathic considerations in renal and urinary disease", "Renal sympathetic innervation T10-L1"],
    Gastrointestinal: ["Osteopathic considerations in GI disease", "Vagal and sympathetic regulation of gut motility", "Postoperative ileus and OMT"],
    Endocrine: ["Osteopathic considerations in endocrine disease", "Neuroendocrine regulation and stress response"],
    Reproductive: ["Osteopathic considerations in reproductive disease", "Pregnancy-related musculoskeletal changes", "Dysmenorrhea and pelvic pain"],
    "Musculoskeletal and Connective Tissue": ["Somatic dysfunction in musculoskeletal disorders", "Pelvic and sacral mechanics in low back pain", "Myofascial pain and trigger points", "Joint hypermobility and hypomobility"],
    "Nervous System": ["Osteopathic considerations in neurologic disease", "Headache and cervical dysfunction", "Autonomic dysfunction", "Radiculopathy and nerve root compression"],
    "Behavioral Health": ["Osteopathic considerations in psychiatric disease", "Mind-body medicine and stress physiology"],
    "Ethics, Safety and Communication": ["Osteopathic oath and professional values", "Patient-physician touch and boundaries during OMT", "Informed consent for manipulative treatment"],
    "Biostatistics and Epidemiology": ["Public health and community health principles", "Preventive medicine levels"],
    "Hematology and Oncology": ["Lymphatic flow and immune function"],
    "Immune System": ["Lymphatic techniques and immune response"],
  },
  OMM_SYSTEMS,
  {},
);

/* ------------------------------------------------------------------ */
/* COMLEX-USA LEVEL 2                                                  */
/* ------------------------------------------------------------------ */

const COMLEX2_SUBJECTS: SeedTaxonomy[] = [
  ...OPP_BASE,
  ...extend(
    CK_SUBJECTS,
    {
      "Internal Medicine: Pulmonology and Critical Care": ["OMT in pneumonia and hospitalized respiratory patients", "Osteopathic management of asthma"],
      "Internal Medicine: Gastroenterology and Hepatology": ["OMT for postoperative ileus and constipation"],
      Pediatrics: ["OMT in infants and children", "Cranial strain patterns in newborns", "Osteopathic approach to otitis media"],
      Obstetrics: ["OMT in pregnancy: low back pain and pelvic changes", "Postpartum osteopathic care"],
      "Family Medicine and Preventive Medicine": ["Osteopathic approach to primary care", "Osteopathic structural examination in the office visit", "Health promotion within osteopathic philosophy", "Community and rural health considerations"],
      "Orthopedics and Sports Medicine": ["OMT for acute and chronic musculoskeletal injury", "Somatic dysfunction in athletes"],
      "Medical Ethics, Professionalism and Patient Safety": ["Osteopathic professionalism and cultural humility", "Interprofessional collaboration", "Telehealth ethics"],
    },
    [],
    {},
  ),
  subj("Clinical Presentations and Physician Tasks", [
    "Taking a focused history", "Performing a focused physical examination", "Formulating a differential diagnosis", "Selecting laboratory studies", "Selecting imaging studies",
    "Interpreting diagnostic results", "Choosing treatment and medication", "Managing adverse medication effects", "Counseling and health promotion", "Care coordination and referrals",
    "Pain management and palliative approaches", "Prevention and health maintenance", "Documentation and patient education",
  ]),
];

const COMLEX2_SYSTEMS: SeedTaxonomy[] = extend(
  CK_SYSTEMS,
  {
    Cardiovascular: ["OMT considerations in cardiac patients", "Lymphatic pump techniques in heart failure and edema"],
    Respiratory: ["OMT considerations in respiratory conditions", "Rib and diaphragm dysfunction in COPD"],
    "Renal and Urinary": ["OMT considerations in renal colic and urinary retention"],
    Gastrointestinal: ["OMT considerations in GI conditions", "Viscerosomatic reflexes in GI disease"],
    Reproductive: ["OMT for pregnancy-related back and pelvic pain", "OMT for dysmenorrhea and pelvic congestion"],
    "Musculoskeletal and Connective Tissue": ["Somatic dysfunction and low back pain management", "Sacroiliac joint dysfunction", "Piriformis syndrome", "Cervicogenic headache", "Thoracic outlet syndrome", "Plantar fasciitis", "Sciatica"],
    "Nervous System": ["OMT in tension-type and cervicogenic headache", "OMT for radiculopathy"],
    "Ear, Nose and Throat": ["OMT for otitis media and sinus drainage", "Temporomandibular joint dysfunction"],
    "Ethics, Safety and Communication": ["Osteopathic communication and rapport", "Informed consent for OMT", "Medical interpreters in osteopathic practice"],
    "Multisystem Processes": ["OMT for the hospitalized patient", "Integrating OMT with conventional treatment", "Contraindications to OMT in acute conditions"],
  },
  OMM_SYSTEMS,
  {},
);

/* ------------------------------------------------------------------ */
/* PRECLINICAL QBANK (first two years: basic-science course disciplines) */
/* ------------------------------------------------------------------ */

const PRECLINICAL_SUBJECTS: SeedTaxonomy[] = extend(
  STEP1_SUBJECTS,
  {
    "Gross Anatomy": ["Cadaver dissection regional approach", "Anatomical terminology and planes", "Osteology and joint classification", "Muscle compartments and actions"],
    Embryology: ["Embryonic folding", "Development of the diaphragm", "Development of the pituitary and thyroid"],
    "Histology and Cell Biology": ["Light and electron microscopy basics", "Special stains in histology", "Tissue preparation and fixation"],
    Physiology: ["Homeostasis and negative feedback", "Exercise and high-altitude physiology", "Integrated organ-system physiology", "Physiology lab data interpretation"],
    "Biochemistry and Molecular Biology": ["Buffers and the Henderson-Hasselbalch equation", "Amino acid structure and properties", "Carbohydrate and lipid structure", "Hemoglobin structure and function", "Biochemical lab techniques"],
    Pharmacology: ["Drug nomenclature and regulation", "Drug development and clinical trials", "Prescription writing basics", "Pharmacogenetics"],
    Pathology: ["Principles of cytopathology", "Autopsy and gross specimen interpretation", "Genetic and environmental causes of disease"],
    "Behavioral Science": ["Biopsychosocial model", "Health behavior change models", "Social and cultural determinants of health"],
  },
  [
    subj("Introduction to Clinical Medicine", [
      "Medical interviewing and history taking", "Physical examination: general survey and vital signs", "Cardiac and pulmonary examination", "Abdominal examination", "Neurologic examination",
      "Musculoskeletal examination", "HEENT examination", "Clinical reasoning and differential diagnosis", "Oral case presentations", "SOAP note documentation",
      "Interpreting basic laboratory tests", "Basic ECG and chest X-ray interpretation", "Sterile technique and basic procedures", "Informed consent communication",
    ]),
    subj("Medical Ethics, Professionalism and Public Health", [
      "Principlism: autonomy, beneficence, nonmaleficence, justice", "Professional identity and duties", "Patient rights and confidentiality", "HIPAA basics", "Health care systems in the United States",
      "Global health", "Epidemiologic measures", "Population health and health policy", "Environmental and occupational health", "Quality improvement and patient safety",
    ]),
    subj("Nutrition and Metabolism", [
      "Macronutrient requirements", "Micronutrient deficiencies and toxicities", "Energy balance and BMI", "Nutrition across the life span", "Dietary guidelines and food labeling",
      "Malnutrition assessment", "Obesity and weight management", "Therapeutic diets", "Enteral and parenteral nutrition basics", "Nutrition in chronic disease",
    ]),
    subj("Medical Genetics", [
      "Pedigree construction and risk calculation", "Bayesian risk analysis", "Cytogenetics: karyotype and FISH", "Single gene disorders", "Chromosomal syndromes",
      "Genomic medicine and sequencing", "Epigenetics", "Genetic testing ethics", "Newborn screening programs", "Multifactorial disease genetics",
    ]),
    subj("Pathophysiology Integration", [
      "Pathophysiology of heart failure", "Pathophysiology of respiratory failure", "Pathophysiology of renal failure", "Pathophysiology of liver failure", "Pathophysiology of diabetes",
      "Pathophysiology of shock", "Pathophysiology of anemia", "Pathophysiology of inflammation and fever", "Pathophysiology of pain", "Pathophysiology of edema and ascites",
    ]),
  ],
  {},
);

const PRECLINICAL_SYSTEMS: SeedTaxonomy[] = extend(
  STEP1_SYSTEMS,
  {
    Cardiovascular: ["Cardiac anatomy and surface landmarks", "Heart sounds and auscultation", "Cardiac histology", "Cardiovascular block integration"],
    Respiratory: ["Respiratory anatomy and bronchopulmonary segments", "Lung histology", "Respiratory block integration", "Pulmonary function tests"],
    "Renal and Urinary": ["Renal anatomy and histology", "Renal block integration", "Urinalysis interpretation"],
    Gastrointestinal: ["GI anatomy and histology", "GI block integration", "Liver histology and zonation"],
    Endocrine: ["Endocrine histology", "Endocrine block integration", "Endocrine testing: stimulation and suppression"],
    Reproductive: ["Reproductive anatomy and histology", "Gametogenesis and meiosis", "Reproductive block integration"],
    "Musculoskeletal and Connective Tissue": ["Joint anatomy and biomechanics", "Muscle and bone histology", "Musculoskeletal block integration"],
    "Nervous System": ["Neuroanatomy block integration", "Neurologic localization", "Cranial nerve examination"],
    "Hematology and Oncology": ["Blood smear morphology", "Hematology block integration"],
    "Immune System": ["Immunology block integration", "Immunologic lab tests: ELISA and flow cytometry"],
    Dermatology: ["Dermatology block integration"],
    "Behavioral Health": ["Behavioral science block integration"],
  },
  [],
  {},
);

/* ------------------------------------------------------------------ */
/* CLINICAL QBANK (clerkship rotations, ambulatory and shelf-style)    */
/* ------------------------------------------------------------------ */

const CLINICAL_SUBJECTS: SeedTaxonomy[] = extend(
  CK_SUBJECTS,
  {
    Surgery: ["Surgical clerkship shelf: common operations", "Operating room etiquette and sterile technique", "Suturing and knot tying", "Drain, tube and line management"],
    Pediatrics: ["Pediatric clerkship shelf: normal growth curves", "Pediatric dosing and weight-based calculations"],
    Obstetrics: ["OB/GYN shelf: labor and delivery rotation topics"],
    "Family Medicine and Preventive Medicine": ["Ambulatory clerkship shelf: undifferentiated complaints", "Chronic disease visits and care plans"],
    Psychiatry: ["Psychiatry shelf: mental status examination", "Psychiatric history and risk assessment"],
    Neurology: ["Neurology shelf: localization and neurologic examination"],
  },
  [
    subj("Ambulatory Medicine", [
      "Hypertension visit management", "Diabetes visit management", "Upper respiratory infection in the clinic", "Acute low back pain visit", "Dizziness in the clinic",
      "Fatigue evaluation", "Headache evaluation", "Chest pain in the outpatient setting", "Abdominal pain in the clinic", "Knee and shoulder pain",
      "Rash and skin complaints", "Urinary symptoms", "Women's health visit", "Well-child and adolescent visit", "Preventive care and counseling",
      "Medication refills and monitoring labs", "Referral and follow-up timing", "Telehealth visits",
    ]),
    subj("Physician Tasks: Diagnosis and Management", [
      "Most likely diagnosis", "Next best step in management", "Most appropriate initial diagnostic test", "Most appropriate pharmacotherapy", "Most likely cause or pathophysiology",
      "Most likely complication", "Risk factors and prognosis", "Mechanism of action of the treatment", "Most appropriate long-term management", "Preventive and screening measures",
      "Interpreting laboratory and imaging results", "Recognizing adverse effects", "Counseling and communication", "Ethical and professional response",
    ]),
    subj("Critical Care and Hospital Medicine", [
      "Admission orders and problem lists", "Inpatient glycemic control", "VTE prophylaxis in hospitalized patients", "Delirium prevention", "Foley and central line management",
      "Rapid response triggers", "Code status and goals of care", "Discharge summaries and transitions", "Hospital-acquired complications", "Antibiotic stewardship",
    ]),
  ],
  {},
);

const CLINICAL_SYSTEMS: SeedTaxonomy[] = extend(
  CK_SYSTEMS,
  {
    Cardiovascular: ["Chest pain differential in clinic and ED", "Syncope", "Lower extremity edema", "Murmur evaluation"],
    Respiratory: ["Chronic cough", "Hemoptysis", "Dyspnea differential"],
    Gastrointestinal: ["Abdominal pain by quadrant", "Jaundice evaluation", "Dysphagia", "Constipation"],
    Endocrine: ["Hirsutism", "Hypercalcemia evaluation", "Weight gain and weight loss evaluation"],
    "Musculoskeletal and Connective Tissue": ["Joint pain evaluation", "Pediatric limp"],
    "Nervous System": ["Dizziness and vertigo evaluation", "Weakness and numbness evaluation", "Tremor"],
    Dermatology: ["Pruritus", "Pediatric exanthems"],
  },
  [],
  {},
);

/* ------------------------------------------------------------------ */

export const SYLLABUS: Record<string, SeedTaxonomy[]> = {
  "usmle-step-1": dedupe([...STEP1_SUBJECTS, ...STEP1_SYSTEMS]),
  "usmle-step-2-ck": dedupe([
    ...CK_SUBJECTS,
    subj("Physician Tasks and Competencies", [
      "Medical knowledge: applying foundational science", "Diagnosis: history, physical and differential", "Diagnosis: laboratory and diagnostic studies", "Diagnosis: diagnostic reasoning", "Management: health maintenance and screening",
      "Management: pharmacotherapy", "Management: clinical interventions and procedures", "Management: mixed management", "Patient-centered communication", "Professionalism and ethics",
      "Systems-based practice and patient safety", "Practice-based learning and improvement",
    ]),
    ...CK_SYSTEMS,
  ]),
  "usmle-step-3": dedupe([...STEP3_SUBJECTS, ...STEP3_SYSTEMS]),
  "comlex-level-1": dedupe([...COMLEX1_SUBJECTS, ...COMLEX1_SYSTEMS]),
  "comlex-level-2": dedupe([...COMLEX2_SUBJECTS, ...COMLEX2_SYSTEMS]),
  "preclinical-qbank": dedupe([...PRECLINICAL_SUBJECTS, ...PRECLINICAL_SYSTEMS]),
  "clinical-qbank": dedupe([...CLINICAL_SUBJECTS, ...CLINICAL_SYSTEMS]),
};
