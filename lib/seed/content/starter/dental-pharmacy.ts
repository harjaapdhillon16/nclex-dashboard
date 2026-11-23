/**
 * Original starter practice content for the dental and pharmacy exams
 * (DAT, INBDE, NBDE, Dental Anatomy, Dental Sciences, NAPLEX, MPJE, CPJE).
 * All items are written from scratch; none are copied from commercial banks or official exams.
 * Pharmacy jurisprudence items stay at the federal / general-principle level and say when
 * requirements vary by state.
 */
import type { Difficulty, Exhibit, SeedQuestion } from "@/lib/questions/types";
import type { SeedMaterial, SeedFlashcard } from "../materials";

const IDS = ["a", "b", "c", "d", "e"];
type Opt = [string, string];

function maker(exam: string) {
  const common = (cat: string, topic: string, d: Difficulty, stem: string, rationale: string, kt: string, tags: string[], exhibit?: Exhibit) => ({
    exam,
    category: cat,
    topic,
    difficulty: d,
    stem,
    rationale,
    extras: { keyTakeaway: kt, relatedTopics: [topic] },
    tags: tags.length ? tags : [topic.toLowerCase()],
    ...(exhibit ? { exhibit } : {}),
  });
  const choice = (opts: Opt[]) => ({
    content: { options: opts.map(([text], i) => ({ id: IDS[i], text })) },
    optionExplanations: Object.fromEntries(opts.map(([, e], i) => [IDS[i], e])),
  });
  return {
    mc: (cat: string, topic: string, d: Difficulty, stem: string, opts: Opt[], correct: string, rationale: string, kt: string, tags: string[] = [], exhibit?: Exhibit): SeedQuestion => ({
      ...common(cat, topic, d, stem, rationale, kt, tags, exhibit),
      type: "mcq",
      ...choice(opts),
      answer: { correct },
    }),
    sata: (cat: string, topic: string, d: Difficulty, stem: string, opts: Opt[], correct: string[], rationale: string, kt: string, tags: string[] = []): SeedQuestion => ({
      ...common(cat, topic, d, stem, rationale, kt, tags),
      type: "sata",
      ...choice(opts),
      answer: { correct },
    }),
    num: (cat: string, topic: string, d: Difficulty, stem: string, unit: string, decimals: number, value: number, tolerance: number, rationale: string, kt: string, tags: string[] = [], exhibit?: Exhibit): SeedQuestion => ({
      ...common(cat, topic, d, stem, rationale, kt, tags, exhibit),
      type: "numeric",
      content: { unit, decimals },
      answer: { value, tolerance },
    }),
    /** items in displayed (scrambled) order; `order` lists item letters (a, b, c...) in the correct sequence */
    ord: (cat: string, topic: string, d: Difficulty, stem: string, items: string[], order: string, rationale: string, kt: string, tags: string[] = []): SeedQuestion => ({
      ...common(cat, topic, d, stem, rationale, kt, tags),
      type: "ordered",
      content: { items: items.map((text, i) => ({ id: IDS[i], text })) },
      answer: { order: order.split("") },
    }),
  };
}

const note = (exam: string, category: string, topic: string, title: string, summary: string, body: string, durationMinutes = 5, kind: "notes" | "guide" = "notes"): SeedMaterial => ({
  exam, category, topic, kind, title, summary, body, durationMinutes,
});
const fc = (exam: string, category: string) => (topic: string, front: string, back: string): SeedFlashcard => ({ exam, category, topic, front, back });

/* ================================================================== */
/* DAT                                                                 */
/* ================================================================== */
const DAT_SN = "Survey of Natural Sciences";
const DAT_PA = "Perceptual Ability";
const DAT_RC = "Reading Comprehension";
const DAT_QR = "Quantitative Reasoning";
const dat = maker("dat");

const DAT_PASSAGE_1 = {
  kind: "passage" as const,
  title: "Fluoride and the critical pH of enamel",
  text: "Dental enamel is made mostly of hydroxyapatite, a crystalline calcium phosphate mineral. Each time bacteria in dental plaque ferment dietary sugars, they release acids and the pH at the tooth surface falls. Hydroxyapatite begins to dissolve when the surrounding pH drops below a threshold known as the critical pH, which is roughly 5.5. Saliva gradually raises the pH again and supplies calcium and phosphate, allowing lost mineral to be redeposited. Fluoride changes this balance. When fluoride is present during remineralization, some hydroxyapatite is converted to fluorapatite, whose critical pH is lower, near 4.5. A tooth surface rich in fluorapatite therefore tolerates a larger acid challenge before it begins to dissolve. Caries is best understood not as a single event but as the net result of repeated cycles of mineral loss and gain.",
};
const DAT_PASSAGE_2 = {
  kind: "passage" as const,
  title: "Antibiotic stewardship",
  text: "Antibiotics have transformed medicine, yet their benefits are not unlimited. Whenever an antibiotic is used, susceptible bacteria are killed while any bacteria that happen to carry resistance genes survive and multiply. Over time, widespread use therefore selects for resistant populations. Stewardship programs attempt to slow this process by encouraging clinicians to prescribe an antibiotic only when a bacterial infection is likely, to choose the narrowest effective agent, and to use the shortest effective course. Critics sometimes argue that withholding antibiotics endangers patients, but proponents respond that unnecessary prescriptions expose patients to side effects without benefit, while contributing to a problem that harms everyone.",
};

export const DAT_QUESTIONS: SeedQuestion[] = [
  dat.mc(DAT_SN, "Biology", "easy", "Which structure is the primary site of ATP synthesis by oxidative phosphorylation in a human liver cell?", [
    ["Golgi apparatus", "The Golgi modifies, sorts and packages proteins; it is not the main ATP-producing organelle."],
    ["Inner mitochondrial membrane", "The electron transport chain and ATP synthase sit in the inner mitochondrial membrane, where the proton gradient drives ATP production."],
    ["Smooth endoplasmic reticulum", "Smooth ER is involved in lipid synthesis and detoxification, not oxidative phosphorylation."],
    ["Lysosomal membrane", "Lysosomes digest macromolecules with acid hydrolases; they do not make ATP by oxidative phosphorylation."],
    ["Nuclear envelope", "The nuclear envelope separates the nucleus from the cytoplasm and has no ATP-synthesizing role."],
  ], "b", "Oxidative phosphorylation couples the electron transport chain to ATP synthase in the inner mitochondrial membrane. The proton gradient across this membrane drives ATP formation. Other organelles listed have different roles.", "ATP synthase and the electron transport chain are in the inner mitochondrial membrane.", ["cell biology"]),
  dat.num(DAT_SN, "Biology", "moderate", "In a population at Hardy-Weinberg equilibrium for one gene with two alleles, the frequency of the recessive allele is 0.20. What percentage of the population is heterozygous?", "%", 0, 32, 0, "With q = 0.20, p = 0.80. Heterozygote frequency is 2pq = 2 x 0.80 x 0.20 = 0.32, or 32%. Homozygous recessive individuals would be q squared = 4%.", "Heterozygotes = 2pq; homozygous recessive = q squared.", ["genetics", "calculation"]),
  dat.mc(DAT_SN, "Biology", "easy", "During which phase of meiosis does crossing over between homologous chromosomes occur?", [
    ["Metaphase I", "Homologous pairs line up at the plate in metaphase I; crossing over has already happened."],
    ["Anaphase II", "Sister chromatids separate in anaphase II; no recombination occurs then."],
    ["Prophase I", "Homologous chromosomes synapse and exchange segments at chiasmata during prophase I, generating genetic recombination."],
    ["Telophase I", "Telophase I involves reformation of nuclear envelopes and cytokinesis, not crossing over."],
  ], "c", "Crossing over takes place during prophase I when homologous chromosomes pair as tetrads. It shuffles alleles between maternal and paternal chromatids. Later phases separate chromosomes or chromatids.", "Crossing over = prophase I; independent assortment = metaphase I orientation.", ["meiosis"]),
  dat.mc(DAT_SN, "Biology", "moderate", "A competitive inhibitor is added to an enzyme-catalyzed reaction that follows Michaelis-Menten kinetics. Which change is expected?", [
    ["Vmax decreases and Km is unchanged", "That pattern describes noncompetitive inhibition, in which active enzyme concentration effectively falls."],
    ["Both Vmax and Km decrease", "Both decrease in uncompetitive inhibition, not competitive inhibition."],
    ["Km decreases and Vmax is unchanged", "Competitive inhibitors lower apparent affinity, so Km does not decrease."],
    ["Apparent Km increases and Vmax is unchanged", "The inhibitor competes with substrate for the active site; a high substrate concentration can overcome it, so Vmax is preserved while apparent Km rises."],
  ], "d", "Competitive inhibitors bind the active site and reduce apparent substrate affinity, raising Km. Because excess substrate can outcompete the inhibitor, Vmax is unchanged.", "Competitive: Km up, Vmax same. Noncompetitive: Vmax down, Km same.", ["enzymes"]),
  dat.mc(DAT_SN, "General Chemistry", "easy", "What is the pH of a 1.0 x 10^-3 M NaOH solution at 25 degrees C?", [
    ["3", "A pH of 3 would reflect a 1.0 x 10^-3 M strong acid, not a strong base."],
    ["11", "NaOH is a strong base, so [OH-] = 10^-3 M, pOH = 3 and pH = 14 - 3 = 11."],
    ["10", "This would correspond to [OH-] = 10^-4 M."],
    ["7", "pH 7 is neutral; a strong base solution is clearly basic."],
  ], "b", "Strong bases dissociate completely, so [OH-] equals the NaOH concentration. pOH = 3 and pH + pOH = 14 at 25 degrees C, giving pH 11.", "Strong base: find pOH first, then pH = 14 - pOH.", ["acid-base"]),
  dat.mc(DAT_SN, "General Chemistry", "moderate", "For the exothermic reaction N2(g) + 3H2(g) <=> 2NH3(g), which change shifts the equilibrium toward reactants at constant pressure?", [
    ["Adding more H2", "Adding reactant shifts the equilibrium toward products."],
    ["Removing NH3 as it forms", "Removing product shifts the equilibrium toward products."],
    ["Raising the temperature", "For an exothermic forward reaction, heat acts like a product; adding heat favors the reverse reaction (toward reactants)."],
    ["Adding a catalyst", "A catalyst speeds both directions equally and does not shift the equilibrium position."],
  ], "c", "Le Chatelier's principle says the system opposes a disturbance. Raising temperature in an exothermic reaction favors the endothermic reverse direction, lowering the equilibrium yield of NH3. Catalysts change rate only.", "Exothermic reaction: heating shifts toward reactants.", ["equilibrium"]),
  dat.num(DAT_SN, "General Chemistry", "easy", "How many moles of an ideal gas occupy 11.2 L at STP (molar volume 22.4 L/mol)?", "mol", 2, 0.5, 0.01, "n = V / 22.4 L/mol = 11.2 / 22.4 = 0.50 mol.", "At STP, one mole of ideal gas occupies 22.4 L.", ["gas laws", "calculation"]),
  dat.mc(DAT_SN, "Organic Chemistry", "moderate", "Which set of conditions most favors an SN2 reaction?", [
    ["A primary alkyl halide, strong nucleophile, polar aprotic solvent", "Unhindered substrates allow backside attack, strong nucleophiles drive the concerted step, and polar aprotic solvents leave the nucleophile reactive."],
    ["A tertiary alkyl halide, weak nucleophile, polar protic solvent", "These conditions favor SN1 or E1 through a carbocation."],
    ["A secondary alkyl halide with a bulky strong base at high temperature", "A bulky strong base at high temperature favors E2 elimination."],
    ["A tertiary alkyl halide, strong nucleophile, polar aprotic solvent", "Steric hindrance blocks backside attack at a tertiary carbon."],
  ], "a", "SN2 is a one-step backside attack, so it is fastest at methyl and primary carbons with good nucleophiles. Polar aprotic solvents do not solvate anions strongly. Tertiary substrates cannot undergo SN2.", "SN2: methyl > primary > secondary; tertiary does not react.", ["substitution"]),
  dat.mc(DAT_SN, "Organic Chemistry", "moderate", "A compound shows a strong, sharp infrared absorption near 1715 cm^-1 and no O-H stretch. Which functional group is most consistent with these data?", [
    ["Alcohol", "Alcohols show a broad O-H stretch near 3300 cm^-1 and no strong C=O band."],
    ["Ketone", "A strong sharp band near 1715 cm^-1 is characteristic of a C=O stretch in a simple ketone, and the missing O-H rules out an acid."],
    ["Ether", "Ethers show C-O stretching around 1100 cm^-1 and no strong C=O band."],
    ["Primary amine", "Primary amines show two N-H stretches near 3300-3400 cm^-1."],
    ["Carboxylic acid", "Carboxylic acids have a very broad O-H stretch spanning roughly 2500-3300 cm^-1."],
  ], "b", "A carbonyl stretch near 1715 cm^-1 indicates a ketone-type C=O. The absence of any O-H band excludes carboxylic acids and alcohols. Amines and ethers lack this strong carbonyl peak.", "C=O near 1700-1750 cm^-1; broad O-H means alcohol or acid.", ["spectroscopy"]),
  dat.mc(DAT_SN, "Organic Chemistry", "easy", "Which of the following compounds is chiral?", [
    ["Ethanol", "Ethanol has no carbon with four different groups."],
    ["2-Propanol", "The carbinol carbon bears two identical methyl groups, so it is achiral."],
    ["2-Butanol", "C2 is bonded to H, OH, CH3 and CH2CH3, four different groups, making it a stereocenter."],
    ["3-Pentanol", "The carbinol carbon bears two identical ethyl groups, so the molecule is achiral."],
    ["Cyclohexane", "Cyclohexane is highly symmetric with no stereocenter."],
  ], "c", "A chiral center needs four different substituents. Only 2-butanol has such a carbon. The others have symmetric substitution at every candidate carbon.", "Look for a carbon with four different groups.", ["stereochemistry"]),

  dat.num(DAT_PA, "Cube counting", "moderate", "A 4 x 4 x 4 cube is painted on all six outside faces and then cut into 64 unit cubes. How many unit cubes have exactly one painted face?", "cubes", 0, 24, 0, "Each face has a 2 x 2 block of interior face-center cubes, which is 4 per face. With six faces, 6 x 4 = 24.", "Exactly one face painted = 6 x (n - 2)^2 for an n x n x n cube.", ["cube counting"]),
  dat.mc(DAT_PA, "Cube counting", "easy", "A 3 x 3 x 3 cube is painted on all outside faces and cut into 27 unit cubes. How many unit cubes have exactly three painted faces?", [
    ["4", "Four undercounts the corners; a cube has more than four."],
    ["8", "Only the eight corner cubes touch three outside faces."],
    ["12", "Twelve is the number of edges, not corners; edge cubes have two painted faces in a 3 x 3 x 3 cube."],
    ["6", "Six is the number of faces; face-center cubes have one painted face."],
  ], "b", "Three painted faces occur only at corners, and any cube has eight corners. In a 3 x 3 x 3 cube there are also 12 edge cubes (two painted faces), 6 face centers (one) and 1 hidden center (none).", "Corners = 3 faces, edges = 2, face centers = 1, inside = 0.", ["cube counting"]),
  dat.mc(DAT_PA, "Angle ranking", "easy", "On a standard clock face, angle A is formed by the hour and minute hands at 3:00, angle B at 4:00 and angle C at 2:00. Which ranking is from smallest to largest?", [
    ["A, B, C", "A is 90 degrees, but C (60 degrees) is smaller than A."],
    ["B, A, C", "B is 120 degrees, the largest, so it cannot be smallest."],
    ["C, B, A", "C is smallest, but A (90) is smaller than B (120)."],
    ["C, A, B", "At 2:00 the angle is 60 degrees, at 3:00 it is 90 degrees and at 4:00 it is 120 degrees, since each hour mark is 30 degrees."],
  ], "d", "Each hour on a clock spans 30 degrees. At the hour, the angle between the hands equals 30 times the hour number (for hours up to 6). So 2:00 = 60, 3:00 = 90, 4:00 = 120 degrees.", "Each clock hour = 30 degrees.", ["angle ranking"]),
  dat.mc(DAT_PA, "Hole punching", "moderate", "A square sheet of paper is folded in half left to right and then in half top to bottom, creating a smaller square of four layers. One hole is punched near the center of that small square, away from every folded edge. How many holes appear when the paper is fully unfolded?", [
    ["1", "The punch passes through all four layers, so there is more than one hole."],
    ["2", "Two holes would result after only one fold."],
    ["4", "Four layers are punched at once, and the holes are mirror images across both creases."],
    ["8", "Eight would need three folds."],
  ], "c", "A hole through a folded stack appears once per layer. Two perpendicular folds make four layers, so four holes appear, mirrored across both crease lines.", "Number of holes = number of layers punched when the hole is away from the folds.", ["hole punching"]),
  dat.mc(DAT_PA, "Pattern folding", "moderate", "A cube net has four squares in a horizontal row labeled 1, 2, 3, 4 from left to right. Square 5 is attached above square 2 and square 6 is attached below square 2. When folded into a cube, which face is opposite face 1?", [
    ["2", "Face 2 is adjacent to face 1 in the row."],
    ["4", "Face 4 is opposite face 2, not face 1."],
    ["5", "Faces 5 and 6 become top and bottom; face 1 is a side face."],
    ["3", "In a straight row of four squares, faces separated by one square end up opposite each other, so 1 and 3 are opposite."],
  ], "d", "In a row of four, folding wraps the row around the cube so squares two apart become opposite. Faces 1 and 3 face each other, 2 and 4 face each other, and 5 is opposite 6.", "In a row of four squares, squares separated by one square are opposite.", ["pattern folding"]),

  dat.mc(DAT_RC, "Scientific passages", "easy", "Which statement best expresses the main idea of the passage?", [
    ["Fluoride makes enamel completely immune to acid.", "The passage says fluorapatite tolerates more acid, not that it is immune."],
    ["Saliva has no role in tooth protection.", "The passage states saliva restores pH and supplies minerals."],
    ["Caries results from repeated cycles of mineral loss and gain, and fluoride shifts that balance in favor of the tooth.", "This captures the cycle concept and the role of fluoride described in the passage."],
    ["Hydroxyapatite dissolves at any pH below neutral.", "The passage gives a critical pH of about 5.5."],
  ], "c", "The passage describes caries as the net outcome of demineralization and remineralization and explains how fluoride alters the threshold. Other options overstate or contradict it.", "Main-idea answers cover the whole passage, not one detail or an extreme claim.", ["main idea"], DAT_PASSAGE_1),
  dat.mc(DAT_RC, "Scientific passages", "moderate", "Which behavior would the passage most strongly suggest increases caries risk?", [
    ["Eating sugary snacks repeatedly throughout the day", "Repeated sugar exposure causes many acid dips, giving saliva little time to restore pH and mineral."],
    ["Brushing with fluoride toothpaste", "Fluoride favors remineralization."],
    ["Allowing saliva to flow freely", "Saliva buffers acid and supplies minerals."],
    ["Eating one dessert with a meal and then rinsing with water", "A single exposure produces one acid challenge that saliva can recover from."],
  ], "a", "Each sugar exposure triggers a pH drop. Frequent exposures keep pH below the critical value for longer cumulative time. The passage links caries to repeated cycles of loss.", "Frequency of sugar exposure matters more than total amount alone.", ["inference"], DAT_PASSAGE_1),
  dat.mc(DAT_RC, "Scientific passages", "moderate", "The author mentions critics of stewardship programs primarily in order to:", [
    ["Prove that stewardship programs are ineffective", "The author reports the criticism, then answers it."],
    ["Present an objection and then show how proponents respond to it", "The passage states the criticism and then gives the proponents' reply."],
    ["Argue that antibiotics should never be prescribed", "The passage supports appropriate use, not abandoning antibiotics."],
    ["Explain how resistance genes are inherited", "Inheritance of resistance is not discussed."],
  ], "b", "The final sentence introduces an objection and immediately gives the rebuttal. This is a typical purpose-of-detail question: identify the rhetorical function of the sentence.", "For purpose questions, ask what job the detail does in the argument.", ["author purpose"], DAT_PASSAGE_2),
  dat.mc(DAT_RC, "Scientific passages", "easy", "As used in the passage, the phrase 'selects for' most nearly means:", [
    ["Deliberately chooses", "No conscious choice is implied; the process is natural selection."],
    ["Prefers to examine", "Selection here is not about examination."],
    ["Favors the survival and spread of", "Resistant bacteria survive treatment and multiply, so use of antibiotics favors them."],
    ["Eliminates entirely", "Selection favors resistant bacteria; it does not eliminate populations entirely."],
  ], "c", "Selective pressure from antibiotics kills susceptible bacteria and leaves resistant ones to multiply. 'Selects for' therefore means favors survival and spread.", "Use context and the biology described to decode vocabulary.", ["vocabulary"], DAT_PASSAGE_2),

  dat.num(DAT_QR, "Algebra", "moderate", "If x + y = 10 and 2x - y = 2, what is the value of xy?", "", 0, 24, 0, "Adding the equations gives 3x = 12, so x = 4 and y = 6. Then xy = 24.", "Use elimination when coefficients of one variable are opposites.", ["systems of equations", "calculation"]),
  dat.mc(DAT_QR, "Algebra", "moderate", "A price is increased by 20% and the new price is then decreased by 20%. Compared with the original price, the final price is:", [
    ["The same", "The decrease applies to a larger base, so the changes do not cancel."],
    ["4% lower", "1.20 x 0.80 = 0.96, which is 4% below the original."],
    ["4% higher", "The product is 0.96, below 1."],
    ["20% lower", "The 20% decrease is applied to the increased price, not the original."],
  ], "b", "Multiply the factors: 1.20 x 0.80 = 0.96. The final price is 96% of the original, a 4% decrease.", "Successive percent changes multiply; they do not add.", ["percent"]),
  dat.mc(DAT_QR, "Algebra", "easy", "What is the larger root of x^2 - 5x + 6 = 0?", [
    ["3", "The equation factors as (x - 2)(x - 3), so the roots are 2 and 3; the larger is 3."],
    ["2", "2 is the smaller root."],
    ["6", "6 is the constant term, not a root."],
    ["-3", "Negative roots would give a positive middle coefficient."],
  ], "a", "Factor into (x - 2)(x - 3) = 0. The roots are 2 and 3, and the larger root is 3. The sum of roots equals 5 and the product equals 6.", "Roots sum to -b/a and multiply to c/a.", ["quadratics"]),
  dat.num(DAT_QR, "Algebra", "easy", "A medication is supplied at 2.5 mg per mL. How many mL are needed to deliver a 40 mg dose?", "mL", 0, 16, 0, "Volume = dose / concentration = 40 mg / 2.5 mg per mL = 16 mL.", "Volume = amount divided by concentration.", ["unit conversion", "calculation"]),
  dat.num(DAT_QR, "Data analysis", "moderate", "The table shows the number of new cavities found at a recall visit for 50 patients. What is the mean number of cavities per patient?", "cavities", 1, 1.5, 0, "Total cavities = 0(10) + 1(15) + 2(15) + 3(10) = 75. Mean = 75 / 50 = 1.5.", "Weighted mean = sum of (value x frequency) divided by total count.", ["mean", "tables"],
    { kind: "table", title: "Cavities per patient", columns: ["Cavities", "Patients"], rows: [["0", "10"], ["1", "15"], ["2", "15"], ["3", "10"]] }),
  dat.mc(DAT_QR, "Data analysis", "easy", "A clinic's daily patient count rises from 80 to 100. What is the percent increase?", [
    ["20%", "20 is the change as a percent of the new value, not the original."],
    ["80%", "80 is the original value, not a percent change."],
    ["25%", "The increase is 20, and 20 / 80 = 0.25, or 25%."],
    ["125%", "125% is the new value as a percent of the original, not the increase."],
  ], "c", "Percent change = (new - old) / old x 100 = 20 / 80 x 100 = 25%. Always divide by the original value.", "Percent change uses the original value as the base.", ["percent change"]),
  dat.num(DAT_QR, "Data analysis", "easy", "A delivery van travels at a constant 60 miles per hour. How many hours does it take to travel 210 miles?", "hours", 1, 3.5, 0, "Time = distance / rate = 210 / 60 = 3.5 hours.", "Time = distance divided by rate.", ["rates", "calculation"]),
  dat.mc(DAT_QR, "Probability and statistics", "moderate", "Two fair six-sided dice are rolled. What is the probability that the sum is 7?", [
    ["1/12", "That would be only three favorable outcomes."],
    ["1/36", "That is the probability of one specific ordered pair."],
    ["7/36", "Seven is the sum, not the number of favorable outcomes."],
    ["1/6", "Six of the 36 equally likely outcomes sum to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)."],
  ], "d", "There are 36 equally likely ordered outcomes. Six of them give a sum of 7, so the probability is 6/36 = 1/6, the most common sum.", "Sum of 7 is the most likely two-dice total.", ["dice"]),
  dat.num(DAT_QR, "Probability and statistics", "easy", "How many different pairs of students can be chosen from a group of 5 students when order does not matter?", "pairs", 0, 10, 0, "C(5,2) = 5! / (2! x 3!) = (5 x 4) / 2 = 10.", "Combinations: nCr = n! / (r!(n-r)!).", ["combinations", "calculation"]),
  dat.mc(DAT_QR, "Probability and statistics", "moderate", "Five is added to every value in a data set. Which statement is true?", [
    ["The mean and standard deviation both increase by 5", "Standard deviation measures spread, which is unchanged by a constant shift."],
    ["The mean increases by 5 and the standard deviation is unchanged", "Shifting every value moves the center by 5 but leaves distances between values unchanged."],
    ["The mean is unchanged and the standard deviation increases by 5", "The mean moves with the data."],
    ["Both are unchanged", "The mean shifts by 5."],
  ], "b", "Adding a constant translates the whole distribution. The mean shifts by that constant, while the spread (standard deviation and range) stays the same. Multiplying would scale the spread.", "Adding a constant shifts the mean only; multiplying scales both mean and spread.", ["statistics"]),
  dat.mc(DAT_QR, "Probability and statistics", "moderate", "Events A and B are independent, with P(A) = 0.4 and P(B) = 0.5. What is the probability that at least one of them occurs?", [
    ["0.2", "0.2 is P(A and B), not P(A or B)."],
    ["0.9", "Adding probabilities double-counts the overlap."],
    ["0.7", "P(A or B) = 0.4 + 0.5 - 0.2 = 0.7."],
    ["0.1", "That is not tied to any correct calculation here."],
  ], "c", "For independent events P(A and B) = 0.4 x 0.5 = 0.2. Then P(A or B) = P(A) + P(B) - P(A and B) = 0.7. Alternatively, 1 - (0.6 x 0.5) = 0.7.", "At least one = 1 minus P(none).", ["probability"]),
];

export const DAT_MATERIALS: SeedMaterial[] = [
  note("dat", DAT_SN, "Biology", "Enzyme Kinetics and Inhibition Made Simple",
    "Read Michaelis-Menten curves and tell competitive from noncompetitive inhibition quickly.",
`# Enzyme Kinetics and Inhibition

## Core definitions
- **Vmax**: the maximum reaction rate when every enzyme active site is saturated with substrate.
- **Km**: the substrate concentration at which the rate is half of Vmax. A **low Km means high apparent affinity**.
- Rate rises hyperbolically with substrate on a Michaelis-Menten plot and flattens at Vmax.

## Lineweaver-Burk (double reciprocal) plot
- y-axis is 1/rate, x-axis is 1/[S].
- **y-intercept = 1/Vmax**, **x-intercept = -1/Km**, slope = Km/Vmax.

## Inhibitor patterns
| Type | Binds | Vmax | Apparent Km | Overcome by more substrate? |
|---|---|---|---|---|
| Competitive | Active site | Unchanged | Increases | Yes |
| Noncompetitive | Allosteric site, free enzyme or complex | Decreases | Unchanged | No |
| Uncompetitive | Enzyme-substrate complex only | Decreases | Decreases | No |

- On a Lineweaver-Burk plot, competitive lines **intersect on the y-axis**, noncompetitive lines **intersect on the x-axis**, and uncompetitive lines are **parallel**.

## Regulation
- **Allosteric enzymes** show sigmoidal curves because of cooperative binding.
- **Feedback inhibition**: an end product inhibits an early enzyme in its own pathway.
- **Covalent modification** (phosphorylation) and **zymogen activation** (for example trypsinogen to trypsin) control activity too.
- Temperature and pH have optimum values; extremes denature the enzyme.

## Quick worked idea
If doubling the substrate concentration restores most of the activity lost after adding an inhibitor, the inhibitor is competitive, because substrate outcompetes it.

**High-yield / exam traps:** Students often swap the Km and Vmax effects of competitive and noncompetitive inhibitors. Memorize "competitive: Vmax same, Km up." Also remember that Km is not a rate constant of binding strength alone and that an enzyme with a lower Km has higher affinity.`, 5),
  note("dat", DAT_PA, "Hole punching", "Hole Punching: Unfold Step by Step",
    "A systematic way to predict hole positions after multiple folds.",
`# Hole Punching Strategy

The Hole Punching test asks you to picture where holes appear after a folded sheet is punched and unfolded. The task is mechanical if you work **in reverse, one fold at a time**.

## Core principle
- A punch goes through **every layer** of the folded paper at that position.
- Each unfold creates a **mirror image** of the holes already present across the crease line you just opened.
- The final number of holes equals the number of layers punched.

## Method
1. Count the folds and note each crease direction (vertical, horizontal, diagonal).
2. Locate the hole relative to the folded edges (near a crease, near a free edge, near a corner).
3. Unfold the **last fold first**. Reflect every hole across that crease.
4. Repeat for each earlier fold.
5. Check the total: one hole punched through a stack of 2, 4 or 8 layers gives 2, 4 or 8 holes.

## Position rules
- A hole that sits **on a crease** is cut in half by the fold; when opened, the halves join into **one whole hole** on that crease.
- A hole near a free edge stays near the matching free edge after reflection.
- Diagonal folds reflect holes across the diagonal, swapping horizontal and vertical offsets.

## Example
Fold a square in half left to right, then in half top to bottom. Punch a hole in the upper-left region of the small folded square, away from the creases. Unfold the horizontal fold: two holes, one above and one below the crease. Unfold the vertical fold: four holes in a symmetric grid around the paper center.

## Speed tips
- Draw a quick sketch of each unfolded stage.
- Eliminate answer choices that have the wrong **number** of holes first, then check symmetry.
- Holes should always appear in mirror-symmetric pairs about every crease line (except holes that sit on the crease).

**High-yield / exam traps:** Reflect across the correct crease, not the paper edge; and unfold in the reverse order of folding. A common error is forgetting that diagonal folds swap x and y offsets.`, 5),
  note("dat", DAT_RC, "Scientific passages", "Reading Comprehension: Active Reading and Time Management",
    "A repeatable routine for long science passages under time pressure.",
`# Reading Comprehension Technique

The DAT reading section uses dense science passages with a fixed time limit. The goal is **accuracy first, then speed**, built on a consistent routine.

## Before reading
- Skim the question stems (not the answer choices) to know what to hunt for.
- Note question types: main idea, detail, inference, vocabulary in context, author's purpose or tone.

## While reading
- Read the **first and last sentence of each paragraph** carefully; they carry the structure.
- Mark transitions such as however, therefore, in contrast, for example. They signal reversals and evidence.
- Do not memorize numbers. Note where they are so you can return.
- Keep a one-line summary of each paragraph in the margin or in your head.

## Answering by question type
- **Main idea**: choose the answer that covers the whole passage. Avoid choices that are too narrow or too extreme.
- **Detail**: go back to the text and confirm; do not rely on memory.
- **Inference**: pick the choice that must be true given the text, not merely possible.
- **Vocabulary in context**: replace the word with each answer and test the sentence.
- **Purpose**: ask what job the sentence or paragraph does (illustrate, contrast, concede, rebut).

## Eliminating choices
Wrong answers often use:
- Extreme words (always, never, completely).
- Reversed relationships (cause and effect swapped).
- Real facts that are not in the passage.
- Partial truths that miss a qualifier in the text.

## Pacing
- Divide your time evenly across passages; do not exceed your budget on any single one.
- If you are stuck on a question, mark it, guess the best remaining option and move on.

**High-yield / exam traps:** Outside knowledge is a trap. Even if you know the biology, the correct answer must be supported by the passage. Also beware of choices that reuse exact passage wording but twist the meaning.`, 5),
  note("dat", DAT_QR, "Probability and statistics", "Probability and Counting Quick Rules",
    "Core formulas for independent events, combinations and expected values.",
`# Probability and Counting Quick Rules

## Basic probability
- P(event) = favorable outcomes / total equally likely outcomes, between 0 and 1.
- **Complement**: P(not A) = 1 - P(A). Use it for "at least one" problems.

## Combining events
- **Independent events**: P(A and B) = P(A) x P(B).
- **Mutually exclusive events**: P(A and B) = 0, so P(A or B) = P(A) + P(B).
- **General addition**: P(A or B) = P(A) + P(B) - P(A and B).
- **Conditional**: P(A given B) = P(A and B) / P(B).

## Counting
- **Multiplication principle**: if one task has m ways and another has n ways, together they have m x n ways.
- **Permutations** (order matters): nPr = n! / (n - r)!
- **Combinations** (order does not matter): nCr = n! / (r! (n - r)!)
- Arrangements of n items with repeats: n! divided by the factorial of each repeat count.

## Statistics basics
- **Mean** is the average; **median** is the middle value; **mode** is the most frequent.
- Adding a constant shifts the mean and median but not the spread.
- Multiplying every value by k multiplies the mean and the standard deviation by |k|.
- Outliers affect the mean more than the median.

## Expected value
E(X) = sum of each outcome x its probability. A game that pays 10 with probability 0.2 and 0 otherwise has E = 2.

## Worked example
Probability of at least one head in three fair flips: 1 - (1/2)^3 = 7/8.

**High-yield / exam traps:** Read whether order matters (permutation vs combination) and whether events are independent. For "at least one," almost always compute 1 minus the probability of none. Do not add probabilities of overlapping events without subtracting the overlap.`, 5),
  note("dat", DAT_SN, "Organic Chemistry", "Substitution and Elimination: Choosing the Mechanism",
    "A decision guide for SN1, SN2, E1 and E2 based on substrate, nucleophile and solvent.",
`# SN1, SN2, E1 and E2 Decision Guide

Choosing the mechanism is a matter of checking **four variables** in order: substrate, nucleophile or base, solvent, and temperature.

## Step 1: Substrate
- **Methyl and primary**: SN2 (E2 only with a bulky strong base).
- **Secondary**: all four are possible; the reagent decides.
- **Tertiary**: SN1, E1 or E2; **never SN2**.
- Allylic and benzylic substrates stabilize carbocations and also accelerate SN2.

## Step 2: Strong or weak nucleophile or base
- **Strong nucleophile, weak base** (I-, Br-, CN-, N3-, RS-): favors SN2 on primary and secondary substrates.
- **Strong, bulky base** (tert-butoxide): favors E2.
- **Strong small base** (hydroxide, ethoxide): E2 with tertiary and often secondary substrates, SN2 with primary.
- **Weak nucleophile or base** (water, alcohols): carbocation pathways SN1 and E1 with tertiary or secondary substrates.

## Step 3: Solvent
- **Polar aprotic** (DMSO, DMF, acetone): enhance nucleophiles, favor SN2.
- **Polar protic** (water, alcohols): stabilize ions and carbocations, favor SN1 and E1.

## Step 4: Heat
- Heat favors **elimination** over substitution because elimination gains entropy.

## Feature comparison
| Feature | SN2 | SN1 |
|---|---|---|
| Rate law | Rate = k[RX][Nu] | Rate = k[RX] |
| Steps | One concerted step | Two steps, carbocation intermediate |
| Stereochemistry | Inversion | Racemization (partial) |
| Rearrangements | No | Possible |

- E2 requires an **anti-periplanar** hydrogen and leaving group and follows Zaitsev unless the base is bulky (then Hofmann product).

**High-yield / exam traps:** Write the rate law and stereochemical outcome whenever the question asks. Tertiary plus strong base means E2, not SN2. Rearrangements point to a carbocation (SN1 or E1).`, 6, "guide"),
];

const fcDat = (cat: string) => fc("dat", cat);
export const DAT_FLASHCARDS: SeedFlashcard[] = [
  fcDat(DAT_SN)("Biology", "Which phase of meiosis includes crossing over?", "Prophase I, when homologous chromosomes synapse and exchange segments at chiasmata."),
  fcDat(DAT_SN)("Biology", "Hardy-Weinberg equations?", "p + q = 1 and p^2 + 2pq + q^2 = 1. Heterozygote frequency is 2pq."),
  fcDat(DAT_SN)("Biology", "Effect of a competitive inhibitor on Km and Vmax?", "Apparent Km increases; Vmax is unchanged. More substrate overcomes the inhibition."),
  fcDat(DAT_SN)("Biology", "Where does glycolysis occur and what is the net ATP per glucose?", "Cytoplasm; net 2 ATP (plus 2 NADH and 2 pyruvate)."),
  fcDat(DAT_SN)("Biology", "Which cell organelle contains hydrolytic enzymes for digestion?", "The lysosome, which uses acid hydrolases at low pH."),
  fcDat(DAT_SN)("Biology", "What distinguishes mitosis from meiosis in outcome?", "Mitosis yields two identical diploid cells; meiosis yields four genetically distinct haploid cells."),
  fcDat(DAT_SN)("General Chemistry", "Relationship between pH and pOH at 25 degrees C?", "pH + pOH = 14."),
  fcDat(DAT_SN)("General Chemistry", "State Le Chatelier's principle.", "A system at equilibrium shifts to oppose an applied change in concentration, pressure or temperature."),
  fcDat(DAT_SN)("General Chemistry", "Molar volume of an ideal gas at STP?", "22.4 L per mole (0 degrees C, 1 atm)."),
  fcDat(DAT_SN)("General Chemistry", "Henderson-Hasselbalch equation?", "pH = pKa + log([A-]/[HA]). A buffer works best within about 1 pH unit of pKa."),
  fcDat(DAT_SN)("General Chemistry", "What does a catalyst change in a reaction?", "It lowers activation energy and speeds both directions; it does not change the equilibrium position or deltaH."),
  fcDat(DAT_SN)("Organic Chemistry", "Which carbons undergo SN2 most readily?", "Methyl and primary carbons; tertiary carbons do not undergo SN2."),
  fcDat(DAT_SN)("Organic Chemistry", "SN1 versus SN2 stereochemistry?", "SN2 gives inversion of configuration; SN1 gives racemization through a planar carbocation."),
  fcDat(DAT_SN)("Organic Chemistry", "IR band for a carbonyl group?", "Strong sharp band near 1700-1750 cm^-1."),
  fcDat(DAT_SN)("Organic Chemistry", "What is required for a chiral center?", "A carbon bonded to four different substituents."),
  fcDat(DAT_PA)("Cube counting", "In an n x n x n painted cube, how many unit cubes have exactly one painted face?", "6 x (n - 2)^2."),
  fcDat(DAT_PA)("Hole punching", "How many holes result from one punch through a stack of folded layers?", "One hole per layer, arranged as mirror images across each crease."),
  fcDat(DAT_QR)("Algebra", "Quadratic formula?", "x = (-b +/- sqrt(b^2 - 4ac)) / (2a)."),
  fcDat(DAT_QR)("Probability and statistics", "P(A or B) for any two events?", "P(A) + P(B) - P(A and B)."),
  fcDat(DAT_QR)("Data analysis", "Formula for percent change?", "(new - old) / old x 100."),
];

/* ================================================================== */
/* INBDE                                                               */
/* ================================================================== */
const IN_FK = "Foundation Knowledge";
const IN_CC = "Clinical Content";
const IN_PM = "Patient Management";
const IN_OD = "Oral Diagnosis";
const inb = maker("inbde");

export const INBDE_QUESTIONS: SeedQuestion[] = [
  inb.mc(IN_FK, "Trigeminal nerve anatomy", "easy", "Through which skull foramen does the maxillary division (V2) of the trigeminal nerve exit the cranial cavity?", [
    ["Foramen ovale", "The mandibular division (V3) exits through the foramen ovale."],
    ["Foramen rotundum", "V2 leaves the middle cranial fossa through the foramen rotundum to enter the pterygopalatine fossa."],
    ["Superior orbital fissure", "The ophthalmic division (V1) passes through the superior orbital fissure."],
    ["Stylomastoid foramen", "The facial nerve exits the skull through the stylomastoid foramen."],
  ], "b", "Each trigeminal division uses a different opening: V1 through the superior orbital fissure, V2 through the foramen rotundum and V3 through the foramen ovale. V2 then enters the pterygopalatine fossa.", "V1 = SOF, V2 = rotundum, V3 = ovale.", ["anatomy", "cranial nerves"]),
  inb.mc(IN_FK, "Trigeminal nerve anatomy", "moderate", "Which nerve provides general sensation (touch and pain) to the anterior two-thirds of the tongue?", [
    ["Glossopharyngeal nerve", "The glossopharyngeal nerve serves the posterior third of the tongue."],
    ["Hypoglossal nerve", "The hypoglossal nerve is motor to tongue muscles and has no sensory role."],
    ["Chorda tympani", "The chorda tympani carries taste, not general sensation, from the anterior two-thirds."],
    ["Lingual nerve", "The lingual nerve, a branch of V3, carries general sensation from the anterior two-thirds of the tongue; chorda tympani fibers join it for taste."],
  ], "d", "General sensation from the anterior two-thirds is carried by the lingual nerve (V3). Taste from the same region travels in the chorda tympani, a branch of the facial nerve that hitchhikes with the lingual nerve.", "Lingual nerve = general sensation; chorda tympani = taste.", ["anatomy", "anesthesia"]),
  inb.mc(IN_FK, "Pharmacology", "easy", "What is the primary mechanism by which nonsteroidal anti-inflammatory drugs such as ibuprofen relieve dental pain?", [
    ["Inhibition of cyclooxygenase, decreasing prostaglandin synthesis", "NSAIDs block COX enzymes and therefore reduce the prostaglandins that sensitize nociceptors and drive inflammation."],
    ["Agonism of mu opioid receptors", "That is the mechanism of opioid analgesics."],
    ["Blockade of voltage-gated sodium channels", "That is the mechanism of local anesthetics."],
    ["Antagonism of histamine H1 receptors", "Antihistamines act this way and are not analgesics."],
  ], "a", "NSAIDs inhibit cyclooxygenase (COX-1 and COX-2), reducing prostaglandin production. Prostaglandins sensitize peripheral nerve endings and mediate inflammation, so fewer prostaglandins means less pain and swelling.", "NSAIDs block prostaglandin synthesis through COX inhibition.", ["pharmacology", "analgesics"]),
  inb.mc(IN_FK, "Oral microbiology", "moderate", "Which property of Streptococcus mutans contributes most directly to its role in smooth-surface caries?", [
    ["Production of sticky glucans from sucrose, aiding adherence and biofilm formation", "Glucosyltransferases convert sucrose into extracellular glucans that help the organism adhere and build thick plaque."],
    ["Production of collagenase that degrades dentin collagen", "Collagen degradation is more associated with host MMPs and periodontal pathogens."],
    ["Obligate anaerobic metabolism of amino acids", "S. mutans is a facultative anaerobe that ferments carbohydrates."],
    ["Secretion of exotoxins that destroy enamel", "Enamel loss results from organic acids, not exotoxins."],
  ], "a", "S. mutans is acidogenic and aciduric, and it synthesizes extracellular glucans from sucrose that promote adhesion and plaque biofilm. Acid fermentation of dietary sugars then demineralizes enamel.", "S. mutans: sucrose, glucans, acid production, acid tolerance.", ["microbiology", "caries"]),
  inb.mc(IN_FK, "Bone biology", "difficult", "Orthodontic tooth movement depends on bone remodeling. Which signaling molecule expressed by osteoblasts and periodontal ligament cells binds RANK on precursors to promote osteoclast formation?", [
    ["Osteoprotegerin (OPG)", "OPG is a decoy receptor that blocks RANKL, so it inhibits osteoclastogenesis."],
    ["RANKL", "RANKL binds RANK on osteoclast precursors and drives their differentiation and activation."],
    ["Calcitonin", "Calcitonin directly inhibits mature osteoclast activity and is not the RANK ligand."],
    ["Sclerostin", "Sclerostin inhibits bone formation by blocking Wnt signaling."],
  ], "b", "RANKL on osteoblast-lineage and PDL cells stimulates osteoclast differentiation, while OPG neutralizes RANKL. The RANKL/OPG ratio therefore controls how much bone is resorbed.", "More RANKL relative to OPG means more osteoclasts.", ["bone remodeling", "orthodontics"]),
  inb.mc(IN_FK, "Pharmacology", "easy", "Why is epinephrine commonly added to local anesthetic cartridges?", [
    ["To neutralize acidic solutions", "pH adjustment is not the purpose of the vasoconstrictor."],
    ["To produce bacteriostatic activity", "Antimicrobial activity is not its purpose."],
    ["To reduce the risk of allergy to the anesthetic", "Vasoconstrictors do not prevent allergy."],
    ["To constrict vessels, slowing systemic absorption and prolonging anesthesia", "Vasoconstriction keeps the anesthetic near the nerve longer, deepens anesthesia and lowers peak blood levels."],
  ], "d", "A vasoconstrictor decreases local blood flow, which prolongs duration, improves depth, reduces systemic uptake and toxicity risk and reduces bleeding at the site. It does not change the anesthetic's mechanism.", "Epinephrine in local anesthetic: longer duration, less systemic absorption.", ["pharmacology", "local anesthesia"]),
  inb.sata(IN_FK, "Trigeminal nerve anatomy", "moderate", "Which muscles receive motor innervation from the mandibular division of the trigeminal nerve? Select all that apply.", [
    ["Masseter", "The masseter is a muscle of mastication supplied by V3."],
    ["Mylohyoid", "The mylohyoid is supplied by V3 through the nerve to the mylohyoid."],
    ["Buccinator", "The buccinator is a muscle of facial expression supplied by the facial nerve."],
    ["Anterior belly of the digastric", "The anterior belly shares the V3 nerve to the mylohyoid."],
    ["Stylohyoid", "The stylohyoid is supplied by the facial nerve."],
  ], ["a", "b", "d"], "V3 supplies the muscles of mastication plus mylohyoid, anterior belly of digastric, tensor veli palatini and tensor tympani. Muscles derived from the second arch (buccinator, stylohyoid, posterior digastric) are supplied by the facial nerve.", "First arch muscles = V3; second arch muscles = facial nerve.", ["anatomy", "innervation"]),
  inb.mc(IN_FK, "Immunology", "moderate", "A patient develops delayed erythema and itching of the oral mucosa 48 hours after receiving a nickel-containing orthodontic appliance. Which hypersensitivity type best explains this reaction?", [
    ["Type I (immediate IgE-mediated)", "Type I reactions occur within minutes and involve mast cell degranulation."],
    ["Type II (antibody-mediated cytotoxic)", "Type II involves antibodies against cell-surface antigens."],
    ["Type III (immune complex)", "Type III reactions involve circulating immune complexes."],
    ["Type IV (delayed, T cell-mediated)", "Allergic contact reactions to metals such as nickel are delayed T-cell responses appearing 24 to 72 hours after exposure."],
  ], "d", "Nickel contact allergy is a classic type IV hypersensitivity driven by sensitized T cells and appearing 1 to 3 days after exposure. Immediate reactions suggest type I.", "Type IV = delayed, T cell-mediated, contact allergy.", ["immunology"]),

  inb.mc(IN_CC, "Antibiotic prophylaxis", "moderate", "Which patient most clearly meets criteria for antibiotic prophylaxis before an invasive dental procedure to prevent infective endocarditis?", [
    ["A patient with a mechanical prosthetic heart valve", "Prosthetic cardiac valves are among the highest-risk conditions for which prophylaxis is recommended before procedures that manipulate gingiva or periapical tissue."],
    ["A patient with an innocent heart murmur", "Innocent murmurs do not warrant prophylaxis."],
    ["A patient with mitral valve prolapse without regurgitation", "Isolated mitral valve prolapse does not meet the criteria."],
    ["A patient with a history of rheumatic fever and no valve damage", "Rheumatic fever without valve disease is not an indication."],
  ], "a", "Current guidance restricts prophylaxis to the highest-risk cardiac conditions, including prosthetic valves, a history of infective endocarditis, certain congenital heart disease and cardiac transplant with valvulopathy. Most other cardiac conditions do not qualify.", "Prosthetic valve and previous endocarditis are classic indications.", ["prophylaxis", "cardiology"]),
  inb.mc(IN_CC, "Antibiotic prophylaxis", "easy", "For an adult at high risk of infective endocarditis who has no drug allergies and can take oral medication, which agent is the standard first choice for single-dose prophylaxis?", [
    ["Metronidazole", "Metronidazole lacks reliable activity against the viridans streptococci of concern."],
    ["Ciprofloxacin", "Fluoroquinolones are not recommended for this purpose."],
    ["Amoxicillin", "Amoxicillin, given as a single oral dose before the procedure, covers oral streptococci and is the standard first-line option."],
    ["Vancomycin orally", "Oral vancomycin is not absorbed systemically and has no role here."],
  ], "c", "Amoxicillin (2 g in adults, taken about 30 to 60 minutes before the procedure) is the usual first-line oral option. Alternatives exist for penicillin-allergic patients and for those who cannot take oral medicine.", "First-line prophylaxis: amoxicillin single dose before the procedure.", ["prophylaxis", "antibiotics"]),
  inb.mc(IN_CC, "Caries management", "moderate", "A dentist applies silver diamine fluoride to an arrested caries lesion. Which side effect should the patient be told to expect?", [
    ["Permanent loosening of the tooth", "SDF does not loosen teeth."],
    ["Black staining of the carious lesion", "Silver oxidizes to produce dark staining of demineralized tooth structure, which is a key consent discussion point."],
    ["Bright blue discoloration of the gingiva", "Silver can stain soft tissue transiently, but it is not blue and not the expected hallmark."],
    ["Immediate pulpal necrosis", "SDF is not expected to cause pulpal necrosis when used correctly."],
  ], "b", "Silver diamine fluoride arrests caries by combining antibacterial silver with fluoride's remineralizing effect, but it stains active lesions dark. Informed consent should address staining, and soft tissue contact should be avoided.", "SDF arrests caries but stains lesions black.", ["caries", "fluoride"]),
  inb.mc(IN_CC, "Restorative dentistry", "moderate", "Why is incremental placement and curing of composite resin recommended for deep restorations?", [
    ["To reduce polymerization shrinkage stress and ensure adequate cure depth", "Thin increments limit shrinkage stress at the bonded interface and let the curing light reach each layer."],
    ["To increase the thickness of the smear layer", "Increments do not affect the smear layer."],
    ["To eliminate the need for bonding agent", "Bonding is still required."],
    ["To make the material radiolucent", "Radiopacity depends on filler content."],
  ], "a", "Composite shrinks as it polymerizes. Placing thin increments, typically a couple of millimeters, limits shrinkage stress and allows light to cure each layer fully. Thick single increments risk gaps, postoperative sensitivity and undercured material.", "Incremental layering reduces shrinkage stress and ensures full cure.", ["composites", "restorative"]),
  inb.mc(IN_CC, "Periodontal therapy", "easy", "Which treatment belongs in Phase I (nonsurgical or etiologic) periodontal therapy?", [
    ["Osseous resective surgery", "Surgery is a Phase II therapy considered after reevaluation."],
    ["Placement of dental implants", "Implants are part of definitive restorative care after disease control."],
    ["Mucogingival grafting", "Grafting is a Phase II surgical procedure."],
    ["Oral hygiene instruction with scaling and root planing", "Phase I focuses on removing the etiology: plaque control, calculus removal and risk-factor modification."],
  ], "d", "Phase I therapy establishes disease control with patient education, scaling and root planing and risk-factor management, followed by reevaluation. Surgical and restorative phases follow only when needed.", "Control infection first, reevaluate, then decide on surgery.", ["periodontics", "treatment planning"]),
  inb.sata(IN_CC, "Restorative dentistry", "moderate", "Which actions help reduce microleakage and failure of a bonded composite restoration? Select all that apply.", [
    ["Isolate the field to keep it free of saliva and blood", "Contamination weakens the adhesive interface, so isolation is essential."],
    ["Apply the adhesive system following the manufacturer's sequence", "Correct technique ensures an optimal hybrid layer."],
    ["Place a eugenol-containing temporary base beneath the composite", "Eugenol interferes with resin polymerization and should be avoided under resin."],
    ["Place and cure the composite in incremental layers", "Layering reduces shrinkage stress and helps the cure."],
    ["Overdry the dentin until it is chalky before bonding", "Overdrying collapses collagen fibrils and reduces bond strength for etch-and-rinse systems."],
  ], ["a", "b", "d"], "Reliable bonding requires isolation, correct adhesive protocol and controlled polymerization shrinkage. Eugenol inhibits resin cure and overdried dentin hinders resin infiltration.", "Avoid eugenol under resin and avoid desiccating dentin.", ["composites", "bonding"]),
  inb.mc(IN_CC, "Antibiotic prophylaxis", "difficult", "Which agent is no longer recommended by current American Heart Association guidance as an alternative for dental endocarditis prophylaxis in penicillin-allergic patients?", [
    ["Azithromycin", "Azithromycin remains an accepted alternative."],
    ["Cephalexin (if no history of anaphylaxis, angioedema or urticaria with penicillin)", "Cephalexin is still acceptable in patients without severe penicillin reactions."],
    ["Doxycycline", "Doxycycline remains an accepted alternative."],
    ["Clindamycin", "Clindamycin was removed from the recommended list because of its higher risk of serious C. difficile infection."],
  ], "d", "The 2021 AHA statement dropped clindamycin because of concerns about C. difficile infection and the lack of evidence for its added benefit. Other alternatives, such as azithromycin, doxycycline and cephalexin (with caveats), remain.", "Clindamycin is no longer recommended for endocarditis prophylaxis.", ["prophylaxis", "antibiotics"]),
  inb.mc(IN_CC, "Oral surgery", "moderate", "Three days after a mandibular third molar extraction, a patient returns with severe throbbing pain, a foul taste and an empty-appearing socket with exposed bone. What is the most appropriate management?", [
    ["Irrigate the socket and place a medicated obtundent dressing", "Dry socket (alveolar osteitis) is managed with gentle irrigation and a soothing medicated dressing, plus analgesics."],
    ["Start a long course of broad-spectrum antibiotics only", "Antibiotics alone do not treat a dry socket, which is not primarily an infection."],
    ["Curette the socket aggressively to induce fresh bleeding", "Aggressive curettage can damage tissue and spread contamination."],
    ["Perform immediate surgical flap closure", "Closure is not part of routine management."],
  ], "a", "Alveolar osteitis results from loss or breakdown of the blood clot and presents with severe pain days after extraction. Treatment is symptomatic: irrigation, a medicated dressing and analgesics. Routine antibiotics are not indicated.", "Dry socket: irrigate, dress, give analgesics.", ["oral surgery", "complications"]),

  inb.mc(IN_PM, "Local anesthesia", "moderate", "A healthy 70-kg adult needs multiple restorations. Using 2% lidocaine with epinephrine (36 mg per 1.8 mL cartridge) and a maximum dose of 7 mg/kg, approximately how many cartridges would reach that limit?", [
    ["About 4", "Four cartridges would give only about 144 mg."],
    ["About 9", "Nine cartridges would be roughly 324 mg, still below the limit."],
    ["About 13", "7 mg/kg x 70 kg = 490 mg; 490 / 36 is about 13.6 cartridges, so roughly 13 cartridges reach the limit."],
    ["About 20", "Twenty cartridges would exceed 700 mg, well above the maximum."],
  ], "c", "A 2% solution has 20 mg/mL, so a 1.8-mL cartridge holds 36 mg. The maximum is about 490 mg for 70 kg, which is roughly 13 cartridges. In practice, clinicians stay well below the maximum and also respect the absolute label limit.", "Maximum dose = mg/kg x weight; cartridge content = percent x 10 x volume.", ["local anesthesia", "calculation"]),
  inb.mc(IN_PM, "Medical emergencies", "easy", "A patient becomes pale, sweaty and lightheaded and then loses consciousness in the chair, with a palpable pulse and spontaneous breathing. What is the first action?", [
    ["Position the patient supine with the legs slightly elevated", "Syncope is caused by transient cerebral hypoperfusion; supine positioning with legs raised restores blood flow to the brain."],
    ["Administer epinephrine intramuscularly", "Epinephrine is indicated for anaphylaxis, not simple fainting."],
    ["Begin chest compressions", "A pulse is present, so compressions are not indicated."],
    ["Give oral glucose", "Oral glucose is not given to an unconscious patient."],
  ], "a", "Vasovagal syncope is the most common office emergency. Place the patient supine with legs slightly raised, ensure an open airway, loosen tight clothing and monitor vital signs. Further evaluation is needed if consciousness does not return promptly.", "Syncope: supine, legs elevated, check airway and pulse.", ["emergencies", "syncope"]),
  inb.mc(IN_PM, "Medical emergencies", "easy", "Which drug is the first-line treatment for anaphylaxis in the dental office?", [
    ["Diphenhydramine orally", "Antihistamines are adjunctive and do not reverse airway compromise or hypotension."],
    ["Intravenous hydrocortisone", "Corticosteroids are adjunctive and slow to act."],
    ["Intramuscular epinephrine", "Epinephrine given IM, typically in the anterolateral thigh, reverses bronchospasm, angioedema and hypotension and is first line."],
    ["Nitroglycerin sublingually", "Nitroglycerin is for angina and would worsen hypotension."],
  ], "c", "Epinephrine is the first-line drug for anaphylaxis. Call emergency services, position appropriately, give oxygen and then consider adjuncts such as antihistamines and corticosteroids.", "Anaphylaxis: epinephrine IM first.", ["emergencies", "anaphylaxis"]),
  inb.mc(IN_PM, "Medical emergencies", "easy", "A diabetic patient who took insulin but skipped breakfast becomes shaky, sweaty and confused, but can still swallow and follow commands. What is the best immediate treatment?", [
    ["Give oral fast-acting carbohydrate such as glucose tablets or juice", "A conscious, cooperative hypoglycemic patient should receive oral sugar, around 15 g, and be rechecked."],
    ["Give a subcutaneous insulin dose", "Insulin would worsen hypoglycemia."],
    ["Start CPR immediately", "The patient is responsive and breathing."],
    ["Wait to see if it resolves", "Delay risks progression to seizures or unconsciousness."],
  ], "a", "Symptoms of hypoglycemia include tremor, sweating, hunger and confusion. If the patient is awake and able to swallow, oral carbohydrate is appropriate. Unconscious patients need glucagon or intravenous dextrose and emergency services.", "Conscious hypoglycemia: oral glucose; unconscious: glucagon or IV dextrose.", ["emergencies", "diabetes"]),
  inb.sata(IN_PM, "Informed consent", "easy", "Which elements should be included when obtaining informed consent for a dental procedure? Select all that apply.", [
    ["The nature and purpose of the proposed treatment", "Patients must understand what is proposed and why."],
    ["Material risks and expected benefits", "Disclosure of risks and benefits is central to consent."],
    ["Reasonable alternatives, including no treatment", "Patients should know the available options."],
    ["A guarantee that no complications will occur", "No clinician can ethically guarantee outcomes."],
    ["An opportunity to ask questions", "Consent is an ongoing dialogue, not just a signature."],
  ], ["a", "b", "c", "e"], "Valid informed consent requires an explanation of the treatment, risks, benefits and alternatives, the patient's chance to ask questions, and the patient's voluntary agreement. Guaranteeing results is misleading and unethical.", "Consent = diagnosis, treatment, risks, benefits, alternatives, questions.", ["ethics", "consent"]),
  inb.mc(IN_PM, "Infection control", "moderate", "Which method provides the most reliable verification that a steam sterilizer is killing microorganisms?", [
    ["A chemical indicator strip placed outside the package", "External indicators only show the package was exposed to a process."],
    ["Visual inspection of the instruments after the cycle", "Visual inspection cannot confirm sterility."],
    ["The cycle timer display", "Timers do not verify lethality."],
    ["Weekly biological indicator testing with bacterial spores", "Spore tests directly confirm that the most resistant organisms were killed and are the standard for monitoring sterilizer function."],
  ], "d", "Biological indicators containing Geobacillus stearothermophilus spores are the gold standard for monitoring sterilization. Mechanical and chemical indicators are used with each load, but biological monitoring is done at least weekly.", "Biological (spore) indicators are the definitive sterilization check.", ["infection control", "sterilization"]),
  inb.mc(IN_PM, "Behavior guidance", "easy", "Which behavior guidance technique is most suitable for introducing a fearful 4-year-old to the dental handpiece?", [
    ["Tell-show-do", "Explaining in simple words, demonstrating on a finger or balloon and then performing the step builds trust and reduces fear."],
    ["Physical restraint without discussion", "Restraint without explanation increases fear and is not first line."],
    ["Ignoring the child's anxiety", "Ignoring anxiety increases the risk of noncooperation."],
    ["General anesthesia for routine care", "General anesthesia is not first-line behavior guidance."],
  ], "a", "Tell-show-do is a basic, nonpharmacologic technique that pairs explanation, demonstration and performance. It is usually combined with positive reinforcement and a calm environment.", "Tell-show-do is first-line behavior guidance for young children.", ["pediatrics", "behavior"]),

  inb.mc(IN_OD, "Pulpal diagnosis", "moderate", "A patient reports spontaneous, lingering pain after cold stimuli for more than 30 seconds, and the tooth is not tender to percussion. What is the most likely pulpal diagnosis?", [
    ["Normal pulp", "A normal pulp responds briefly to cold and the sensation fades quickly."],
    ["Reversible pulpitis", "In reversible pulpitis pain subsides within seconds after the stimulus is removed."],
    ["Symptomatic irreversible pulpitis", "Lingering pain, often spontaneous, signals irreversible inflammation; apical tissues are not yet involved, so percussion is normal."],
    ["Pulp necrosis", "A necrotic pulp does not respond to cold."],
  ], "c", "Lingering cold response and spontaneous pain indicate symptomatic irreversible pulpitis. Normal percussion suggests the inflammation has not extended beyond the pulp. Treatment is pulpectomy or extraction.", "Lingering pain to cold = irreversible pulpitis.", ["endodontics", "diagnosis"]),
  inb.mc(IN_OD, "Pulpal diagnosis", "moderate", "A tooth with a deep restoration is tender to percussion and biting, does not respond to cold or electric pulp testing, and shows a widened periodontal ligament space on the radiograph. What is the most likely diagnosis?", [
    ["Reversible pulpitis with normal apical tissues", "Reversible pulpitis responds to cold and has normal percussion."],
    ["Healthy pulp with asymptomatic apical periodontitis", "The tooth is symptomatic and unresponsive."],
    ["Previously initiated therapy with no symptoms", "No prior treatment is described."],
    ["Pulp necrosis with symptomatic apical periodontitis", "No pulp response with percussion tenderness and widened PDL points to necrosis with inflamed periapical tissues."],
  ], "d", "Nonresponse to sensibility tests indicates pulp necrosis, while percussion tenderness and a widened PDL indicate symptomatic apical periodontitis. Treatment is root canal therapy or extraction.", "Necrotic pulp plus tender to percussion = symptomatic apical periodontitis.", ["endodontics", "diagnosis"]),
  inb.mc(IN_OD, "Radiographic interpretation", "difficult", "A 45-year-old woman has asymptomatic, ill-defined radiolucencies at the apices of several vital mandibular incisors. What is the best management?", [
    ["Immediate root canal treatment of all involved teeth", "The teeth are vital, so endodontic treatment is not indicated."],
    ["Extraction of the involved teeth", "Extraction is not indicated for a likely benign condition."],
    ["Monitor with periodic clinical and radiographic follow-up", "Findings suggest periapical cemento-osseous dysplasia; vital teeth need no treatment, only monitoring."],
    ["Surgical curettage with biopsy of each lesion", "Surgery risks infection of sclerotic bone and is unnecessary in classic cases."],
  ], "c", "Multiple periapical radiolucencies at vital mandibular anterior teeth in a middle-aged woman are typical of periapical cemento-osseous dysplasia. Confirm vitality, avoid unnecessary endodontic treatment and follow up periodically.", "Vital teeth plus periapical radiolucency suggests dysplasia, not infection.", ["radiology", "pathology"]),
  inb.mc(IN_OD, "Oral lesions", "moderate", "Which clinical feature of an oral ulcer is most concerning for malignancy?", [
    ["Painful, round ulcer with a red halo that heals in 10 days", "These features suggest a recurrent aphthous ulcer."],
    ["Ulcer that resolves after removing a sharp tooth edge", "Resolution after removing trauma suggests a traumatic ulcer."],
    ["Multiple small vesicles that crust on the lip", "These features suggest herpes labialis."],
    ["Painless, indurated ulcer with rolled borders lasting more than 2 weeks", "Persistent induration and rolled borders are red flags requiring prompt biopsy."],
  ], "d", "Persistent, indurated, nonhealing ulcers, especially on the lateral tongue or floor of the mouth, require biopsy. Lesions that persist beyond two weeks without an identifiable cause should be investigated.", "Ulcer lasting more than 2 weeks with induration needs biopsy.", ["oral cancer", "diagnosis"]),
  inb.mc(IN_OD, "Oral lesions", "moderate", "A homogeneous white plaque on the buccal mucosa cannot be scraped off and has no obvious cause. What is the most appropriate next step?", [
    ["Reassure the patient and recall in 5 years", "A clinical diagnosis of leukoplakia needs more than reassurance."],
    ["Begin antifungal therapy for 6 months", "Candidiasis can be wiped off; this plaque cannot."],
    ["Biopsy to rule out dysplasia or carcinoma", "Leukoplakia is a clinical term for a white lesion not attributable to another disease and requires histologic assessment."],
    ["Apply topical fluoride", "Fluoride has no role."],
  ], "c", "A white plaque that cannot be rubbed off is clinically called leukoplakia once other causes are excluded. Because some lesions show dysplasia or carcinoma, biopsy is required.", "Nonscrapable white plaque: biopsy.", ["oral pathology", "diagnosis"]),
  inb.mc(IN_OD, "Radiographic interpretation", "easy", "Which radiograph is most useful for detecting interproximal caries on posterior teeth?", [
    ["Bitewing radiograph", "Bitewings show crowns and crestal bone with minimal overlap of contacts, which is ideal for interproximal caries."],
    ["Periapical radiograph", "Periapicals emphasize roots and apices."],
    ["Panoramic radiograph", "Panoramic images lack the detail for small interproximal lesions."],
    ["Occlusal radiograph", "Occlusal films show larger areas of arch or palate."],
  ], "a", "Bitewing radiographs are designed to detect interproximal caries and evaluate alveolar crest levels. Periapicals reveal periapical pathology and root form.", "Bitewing = interproximal caries.", ["radiology", "caries"]),
  inb.sata(IN_OD, "Periodontal diagnosis", "difficult", "Which findings favor a periodontal abscess rather than an acute periapical abscess? Select all that apply.", [
    ["The tooth responds normally to pulp vitality testing", "A vital pulp points to a periodontal source."],
    ["A deep periodontal pocket with suppuration on probing", "Pus draining from a pocket is typical of periodontal abscess."],
    ["Radiolucency along the lateral root surface", "Lateral radiolucency matches periodontal destruction."],
    ["No response to cold and electric pulp testing", "Nonresponse suggests pulp necrosis and a periapical source."],
    ["No periodontal pocketing and a large carious lesion", "This combination suggests an endodontic origin."],
  ], ["a", "b", "c"], "A periodontal abscess usually occurs in a tooth with an established pocket, a vital pulp and lateral bone loss. Periapical abscess arises from pulp necrosis with apical radiolucency and a nonvital pulp.", "Vital pulp plus deep pocket plus lateral radiolucency = periodontal origin.", ["differential diagnosis", "periodontics"]),
];

export const INBDE_MATERIALS: SeedMaterial[] = [
  note("inbde", IN_FK, "Trigeminal nerve anatomy", "Trigeminal Nerve Branches and Dental Anesthesia Map",
    "Link each division and branch of cranial nerve V to the dental structures it serves.",
`# Trigeminal Nerve and Dental Anesthesia

The trigeminal nerve (CN V) is the main sensory nerve of the face and teeth and the motor nerve of the muscles of mastication.

## Three divisions
| Division | Exit foramen | Function |
|---|---|---|
| V1 ophthalmic | Superior orbital fissure | Sensory |
| V2 maxillary | Foramen rotundum | Sensory |
| V3 mandibular | Foramen ovale | Sensory and motor |

## Maxillary division branches relevant to dentistry
- **Posterior superior alveolar (PSA)**: maxillary molars (except often the mesiobuccal root of the first molar).
- **Middle superior alveolar (MSA)**: premolars and sometimes the mesiobuccal root of the first molar; present in a variable proportion of patients.
- **Anterior superior alveolar (ASA)**: incisors and canines.
- **Greater palatine**: hard palate mucosa posterior to the canine.
- **Nasopalatine**: anterior palate through the incisive foramen.
- **Infraorbital nerve**: continues from V2 and supplies the lower eyelid, side of the nose and upper lip.

## Mandibular division branches
- **Inferior alveolar nerve**: mandibular teeth; enters the mandibular foramen.
- **Mental nerve**: terminal branch emerging from the mental foramen to supply the chin and lower lip.
- **Lingual nerve**: general sensation of the anterior two-thirds of the tongue and lingual gingiva; carries chorda tympani taste fibers.
- **Long buccal nerve**: buccal gingiva of molars and cheek mucosa.
- **Motor branches**: masseteric, deep temporal, medial and lateral pterygoid, and the nerve to the mylohyoid.

## Clinical correlations
- An **inferior alveolar nerve block** typically numbs the mandibular teeth, lower lip and chin on that side, and the lingual nerve is often anesthetized too.
- **Buccal infiltration** works well in the maxilla because of thin cortical bone, but is less reliable in the adult mandibular molar region.
- Paresthesia after injection is most often the result of trauma to the nerve and usually resolves, but should be documented and followed.

**High-yield / exam traps:** V2 = rotundum, V3 = ovale, V1 = superior orbital fissure. Do not confuse general sensation (lingual nerve) with taste (chorda tympani) for the anterior tongue. The buccinator is supplied motor by the facial nerve even though the long buccal nerve (V3) carries sensation.`, 6),
  note("inbde", IN_CC, "Antibiotic prophylaxis", "Antibiotic Use in Dentistry: Prophylaxis and Treatment Principles",
    "When prophylaxis is justified and how to choose antibiotics responsibly.",
`# Antibiotics in Dental Practice

## Principles of therapeutic use
- Most dental infections are **polymicrobial mixed aerobes and anaerobes**.
- **Source control comes first**: drainage, extraction or endodontic debridement matters more than the antibiotic.
- Antibiotics are **adjuncts** when there is spreading infection, systemic involvement (fever, malaise), immunocompromise or limited ability to drain.
- Choose the narrowest effective agent; first-line choices are commonly **penicillin V or amoxicillin**, with alternatives for allergy.
- Localized abscesses without systemic signs usually need drainage alone.

## Prophylaxis for infective endocarditis
Prophylaxis before procedures that manipulate gingival tissue, the periapical region of teeth or perforate oral mucosa is recommended only for patients with the **highest-risk conditions**:
- Prosthetic cardiac valve or valve repair material.
- Previous infective endocarditis.
- Certain congenital heart disease (unrepaired cyanotic disease and some repaired defects).
- Cardiac transplant with valvulopathy.

First-line adult regimen is a **single oral dose of amoxicillin** 30 to 60 minutes before the procedure. Alternatives exist for allergy or inability to take oral medication; clindamycin is no longer recommended in current AHA guidance.

## Prosthetic joints
- Routine prophylaxis for most patients with prosthetic joints is **not** recommended; consult the orthopedic surgeon in selected high-risk circumstances.

## Adverse effects to know
- **Penicillin allergy**: ask about the reaction; anaphylaxis, angioedema and urticaria matter most.
- **Clindamycin**: C. difficile infection.
- **Metronidazole**: disulfiram-like reaction with alcohol.
- **Tetracyclines**: avoid in pregnancy and young children because of tooth discoloration.
- **Antibiotic stewardship** prevents resistance and adverse events.

**High-yield / exam traps:** Prophylaxis is not indicated for routine anesthetic injections in non-infected tissue. Mitral valve prolapse alone, rheumatic fever without valve disease and prior coronary stents do not require prophylaxis. Always verify the current guidance.`, 6),
  note("inbde", IN_PM, "Medical emergencies", "Office Medical Emergencies: Recognition and First Response",
    "A practical framework and quick-response table for common dental office emergencies.",
`# Office Medical Emergencies

## Universal first steps
1. **Stop treatment** and call for help.
2. Position the patient appropriately.
3. Assess **airway, breathing, circulation** and level of consciousness.
4. Provide oxygen and monitor vital signs.
5. Activate emergency medical services when the patient is not recovering rapidly.

## Common emergencies
| Emergency | Key signs | First response |
|---|---|---|
| Syncope | Pallor, sweating, brief unconsciousness | Supine, legs elevated, airway check |
| Hypoglycemia | Shaky, sweaty, confused | Oral glucose if conscious |
| Anaphylaxis | Urticaria, stridor, wheeze, hypotension | **IM epinephrine**, call EMS, oxygen |
| Asthma attack | Wheeze, dyspnea | Upright, bronchodilator inhaler, oxygen |
| Angina | Chest pressure relieved by rest | Stop treatment, sublingual nitroglycerin if blood pressure is adequate, oxygen |
| Myocardial infarction | Prolonged pain, nausea, sweating | Call EMS, oxygen, aspirin if not contraindicated |
| Seizure | Tonic-clonic activity | Protect from injury, do not restrain, check airway after |
| Local anesthetic toxicity | Metallic taste, tremor, agitation | Stop injection, oxygen, supportive care |

## Preventive habits
- Take a thorough **medical history** and update it each visit.
- Record **baseline vital signs** for medically complex patients.
- Keep an emergency kit and train the staff in **basic life support** with scheduled drills.
- Avoid stress by scheduling short morning appointments for anxious or diabetic patients.

## Local anesthetic safety
- Aspirate before injecting and inject slowly.
- Calculate maximum dose from weight.
- Know the anesthetic and vasoconstrictor limits for patients with cardiovascular disease.

**High-yield / exam traps:** Anaphylaxis is treated with epinephrine first; antihistamines and steroids are adjuncts. Do not give oral items to unconscious patients. Syncope is managed supine, not seated upright.`, 6),
  note("inbde", IN_OD, "Pulpal diagnosis", "Pulpal and Apical Diagnosis Cheat Sheet",
    "Match symptoms and test results to the correct pulpal and periapical diagnosis.",
`# Pulpal and Apical Diagnosis

Diagnoses are made by combining **history, clinical exam, pulp sensibility testing, percussion/palpation and radiographs**.

## Pulpal diagnoses
- **Normal pulp**: asymptomatic; mild, brief response to cold that resolves quickly.
- **Reversible pulpitis**: pain provoked by cold or sweets that stops within seconds after the stimulus is removed.
- **Symptomatic irreversible pulpitis**: lingering pain after a stimulus (often 30 seconds or more), spontaneous or referred pain, possible night pain.
- **Asymptomatic irreversible pulpitis**: no symptoms, but deep caries or trauma with an inflamed pulp.
- **Pulp necrosis**: no response to cold or electric pulp test; may be asymptomatic until apical changes develop.
- **Previously treated** and **previously initiated therapy** are separate categories.

## Apical diagnoses
- **Normal apical tissues**: no tenderness, intact lamina dura.
- **Symptomatic apical periodontitis**: pain on biting or percussion, possible widened PDL space.
- **Asymptomatic apical periodontitis**: periapical radiolucency without symptoms.
- **Acute apical abscess**: rapid onset, swelling, severe pain, tenderness, may have fever.
- **Chronic apical abscess**: draining sinus tract with little or no pain.
- **Condensing osteitis**: localized increased radiopacity in response to low-grade inflammation.

## Testing tips
- **Cold test**: tests nerve fiber response, useful to compare with control teeth.
- **Electric pulp test**: confirms response; a response does not guarantee health.
- **Percussion and palpation**: reflect periapical inflammation, not pulp status.
- **Probing**: isolated deep narrow defects may indicate vertical root fracture or endodontic-periodontal communication.

## Treatment links
- Reversible pulpitis: remove the cause, restore.
- Irreversible pulpitis or necrosis: root canal therapy or extraction.
- Acute apical abscess: drainage plus debridement; antibiotics when systemic signs or spread.

**High-yield / exam traps:** Lingering response, not intensity, differentiates irreversible from reversible pulpitis. A tooth can be nonvital and asymptomatic. Percussion tenderness tells you about the periapical tissues, not the pulp.`, 5),
  note("inbde", IN_FK, "Pharmacology", "Dental Pharmacology Essentials: Analgesics and Local Anesthetics",
    "Mechanisms, dosing logic and safety considerations for the drugs dentists use daily.",
`# Dental Pharmacology Essentials

## Analgesics
- **NSAIDs** (ibuprofen, naproxen) block COX and reduce prostaglandins. They are effective for dental pain and inflammation.
- **Acetaminophen** is analgesic and antipyretic with minimal anti-inflammatory effect; hepatotoxicity occurs with overdose.
- **Combining ibuprofen with acetaminophen** gives excellent analgesia and is commonly preferred to opioids for most dental pain.
- **Opioids** act at mu receptors; adverse effects include sedation, respiratory depression, constipation, nausea, dependence. Prescribe the smallest effective quantity.
- **NSAID cautions**: peptic ulcer, kidney disease, heart failure, anticoagulant use, pregnancy in later stages, aspirin-sensitive asthma.

## Local anesthetics
- Block **voltage-gated sodium channels**, preventing nerve depolarization.
- **Amides** (lidocaine, mepivacaine, articaine, bupivacaine, prilocaine) are metabolized in the liver; **esters** (procaine, benzocaine) are hydrolyzed by plasma esterases and are more allergenic.
- **Vasoconstrictor** (epinephrine) extends duration and reduces systemic uptake; use caution in uncontrolled hypertension or severe cardiovascular disease.
- **Infected tissue** is acidic, which reduces the uncharged fraction and makes anesthesia less effective.
- **Maximum dose** is calculated by weight; children are at greater risk of overdose.
- **Methemoglobinemia** is a risk with prilocaine and benzocaine.

## Antimicrobials and others
- **Chlorhexidine** is a cationic antiseptic rinse with substantivity; adverse effects include staining and taste alteration.
- **Fluoride** acts topically by promoting remineralization.
- **Corticosteroids** may be used for inflammation but affect glucose and healing.

## Drug interactions to remember
- NSAIDs may blunt antihypertensive effects and increase bleeding with anticoagulants.
- Metronidazole with alcohol causes a disulfiram-like reaction.
- Macrolides inhibit CYP3A4 and can raise levels of other drugs.

**High-yield / exam traps:** Amides carry an "i" before "caine." Maximum dose depends on weight. Articaine is an amide with a thiophene ring and extra ester side chain metabolized partly in plasma. Antibiotics do not treat pain from pulpitis.`, 6),
];

const fcIn = (cat: string) => fc("inbde", cat);
export const INBDE_FLASHCARDS: SeedFlashcard[] = [
  fcIn(IN_FK)("Trigeminal nerve anatomy", "Foramina of the trigeminal divisions?", "V1: superior orbital fissure. V2: foramen rotundum. V3: foramen ovale."),
  fcIn(IN_FK)("Trigeminal nerve anatomy", "Which nerve carries taste from the anterior two-thirds of the tongue?", "The chorda tympani, a branch of the facial nerve that travels with the lingual nerve."),
  fcIn(IN_FK)("Trigeminal nerve anatomy", "Which branch supplies the mandibular teeth?", "The inferior alveolar nerve, a branch of V3."),
  fcIn(IN_FK)("Pharmacology", "Mechanism of NSAIDs?", "Inhibit cyclooxygenase, decreasing prostaglandin synthesis."),
  fcIn(IN_FK)("Pharmacology", "Mechanism of local anesthetics?", "Block voltage-gated sodium channels, preventing nerve conduction."),
  fcIn(IN_FK)("Oral microbiology", "Which bacteria are chiefly associated with caries initiation?", "Mutans streptococci (S. mutans and S. sobrinus); Lactobacilli add to progression."),
  fcIn(IN_CC)("Antibiotic prophylaxis", "First-line adult oral endocarditis prophylaxis agent?", "A single dose of amoxicillin before the procedure."),
  fcIn(IN_CC)("Antibiotic prophylaxis", "Which antibiotic was removed from AHA alternatives in 2021?", "Clindamycin, because of C. difficile risk and limited evidence of benefit."),
  fcIn(IN_CC)("Caries management", "Main drawback of silver diamine fluoride?", "It stains active carious lesions black."),
  fcIn(IN_CC)("Periodontal therapy", "What is Phase I periodontal therapy?", "Nonsurgical etiologic therapy: oral hygiene instruction, scaling and root planing and risk-factor control."),
  fcIn(IN_CC)("Restorative dentistry", "Why avoid eugenol under composite resin?", "Eugenol inhibits resin polymerization."),
  fcIn(IN_PM)("Medical emergencies", "First-line drug for anaphylaxis?", "Epinephrine intramuscularly (anterolateral thigh)."),
  fcIn(IN_PM)("Medical emergencies", "Position for a patient who faints?", "Supine with the legs slightly elevated."),
  fcIn(IN_PM)("Local anesthesia", "How do you compute milligrams in a 2% lidocaine cartridge?", "2% = 20 mg/mL, so a 1.8-mL cartridge contains 36 mg."),
  fcIn(IN_PM)("Informed consent", "Elements of informed consent?", "Nature of treatment, risks, benefits, alternatives (including none), opportunity for questions and voluntary agreement."),
  fcIn(IN_PM)("Infection control", "Gold standard monitoring of sterilization?", "Biological indicator testing with bacterial spores."),
  fcIn(IN_OD)("Pulpal diagnosis", "Which pulpal diagnosis features lingering pain after cold?", "Symptomatic irreversible pulpitis."),
  fcIn(IN_OD)("Oral lesions", "Clinical definition of leukoplakia?", "A white plaque that cannot be scraped off or ascribed to another disease; biopsy is needed."),
  fcIn(IN_OD)("Radiographic interpretation", "Best radiograph for interproximal caries?", "Bitewing radiograph."),
  fcIn(IN_OD)("Oral lesions", "Red-flag features of an oral ulcer?", "Persisting more than 2 weeks, painless, indurated, rolled borders; biopsy it."),
];

/* ================================================================== */
/* NBDE                                                                */
/* ================================================================== */
const NB_AN = "Anatomic Sciences";
const NB_BP = "Biochemistry and Physiology";
const NB_MP = "Microbiology and Pathology";
const NB_DA = "Dental Anatomy and Occlusion";
const nbd = maker("nbde");

export const NBDE_QUESTIONS: SeedQuestion[] = [
  nbd.mc(NB_AN, "Muscles of mastication", "moderate", "Which muscle's inferior head is primarily responsible for protruding the mandible and assisting in opening the mouth?", [
    ["Masseter", "The masseter elevates the mandible."],
    ["Medial pterygoid", "The medial pterygoid elevates the mandible and assists in side-to-side movement."],
    ["Lateral pterygoid", "The inferior head of the lateral pterygoid pulls the condyle forward, producing protrusion and contributing to mouth opening."],
    ["Temporalis", "The temporalis elevates and retracts the mandible."],
  ], "c", "The lateral pterygoid is the main muscle that protrudes the mandible and helps open the jaw by translating the condyle down the articular eminence. The other masticatory muscles chiefly elevate the mandible.", "Lateral pterygoid: protrusion and opening; others elevate.", ["muscles", "TMJ"]),
  nbd.mc(NB_AN, "Salivary glands", "easy", "The parotid duct (Stensen duct) opens into the oral cavity opposite which tooth?", [
    ["Maxillary second molar", "Stensen duct pierces the buccinator and opens on the buccal mucosa opposite the maxillary second molar."],
    ["Mandibular first premolar", "No major duct opens here."],
    ["Maxillary central incisor", "The incisive papilla is not related to a salivary duct."],
    ["Mandibular canine", "The sublingual caruncle is near the lingual frenum, not the canine."],
  ], "a", "The parotid papilla lies on the buccal mucosa near the maxillary second molar. The submandibular duct opens at the sublingual caruncle beside the lingual frenum.", "Parotid duct: opposite the maxillary second molar.", ["salivary glands", "anatomy"]),
  nbd.mc(NB_AN, "Vascular supply", "moderate", "Which artery supplies the maxillary molar teeth through its posterior superior alveolar branch?", [
    ["Facial artery", "The facial artery supplies the face and lips."],
    ["Maxillary artery", "The posterior superior alveolar artery branches from the maxillary artery in the infratemporal fossa and supplies the molars and sinus."],
    ["Lingual artery", "The lingual artery supplies the tongue and floor of the mouth."],
    ["Superficial temporal artery", "This is a terminal branch of the external carotid supplying the scalp."],
  ], "b", "The maxillary artery gives off the posterior superior alveolar artery, which supplies maxillary molars, premolars partly and the maxillary sinus. The inferior alveolar artery also branches from the maxillary artery.", "PSAA is a branch of the maxillary artery.", ["vascular", "anatomy"]),
  nbd.mc(NB_AN, "Embryology", "moderate", "Unilateral cleft lip is caused by failure of which embryologic structures to fuse?", [
    ["The two palatine shelves", "That failure causes cleft palate."],
    ["The maxillary prominence and the medial nasal prominence", "The upper lip forms by fusion of the maxillary prominences with the medial nasal prominences; failure produces cleft lip."],
    ["The two mandibular prominences", "Mandibular fusion defects are rare midline lower lip clefts."],
    ["The frontonasal prominence and the first pharyngeal arch", "This is not the typical site of cleft lip."],
  ], "b", "Cleft lip results from incomplete fusion of the maxillary prominence with the medial nasal prominence. Cleft palate arises from failure of the palatal shelves to fuse and may occur separately.", "Cleft lip: maxillary plus medial nasal prominence; cleft palate: palatal shelves.", ["embryology", "development"]),
  nbd.mc(NB_AN, "Histology", "easy", "Which cell is responsible for forming enamel?", [
    ["Odontoblast", "Odontoblasts form dentin."],
    ["Cementoblast", "Cementoblasts form cementum."],
    ["Fibroblast", "Fibroblasts form periodontal ligament collagen."],
    ["Ameloblast", "Ameloblasts secrete the enamel matrix and later mature it into the most mineralized tissue in the body."],
  ], "d", "Ameloblasts derive from the inner enamel epithelium and form enamel. They are lost at eruption, so enamel cannot regenerate biologically.", "Ameloblasts = enamel, odontoblasts = dentin, cementoblasts = cementum.", ["histology", "enamel"]),
  nbd.mc(NB_AN, "Temporomandibular joint", "difficult", "A patient has a clicking sound on opening that disappears on protrusive closure. Which TMJ condition is most consistent with this finding?", [
    ["Anterior disc displacement with reduction", "The disc is anterior to the condyle at rest and snaps back onto the condyle during opening, producing the click."],
    ["Bony ankylosis", "Ankylosis causes severely limited opening, not a click."],
    ["Acute condylar fracture", "Fracture causes pain, malocclusion and deviation after trauma."],
    ["Normal joint movement", "Reproducible clicking suggests internal derangement."],
  ], "a", "In anterior disc displacement with reduction, the condyle moves over the posterior band of the displaced disc, causing a click as the disc recaptures. Protrusive posturing can eliminate the click because the condyle stays on the disc.", "Reciprocal clicking suggests anterior disc displacement with reduction.", ["TMJ", "clinical anatomy"]),
  nbd.sata(NB_AN, "Muscles of mastication", "moderate", "Which muscles elevate the mandible? Select all that apply.", [
    ["Masseter", "The masseter is a powerful elevator."],
    ["Medial pterygoid", "The medial pterygoid elevates and works with the masseter in a sling."],
    ["Temporalis", "The temporalis elevates, and the posterior fibers retrude."],
    ["Inferior head of lateral pterygoid", "The inferior head assists in protrusion and opening, not elevation."],
    ["Anterior belly of digastric", "The digastric aids in depressing the mandible."],
  ], ["a", "b", "c"], "The masseter, temporalis and medial pterygoid are the mandibular elevators. The lateral pterygoid and suprahyoid muscles are mainly involved in opening and protrusion.", "Elevators: masseter, temporalis, medial pterygoid.", ["muscles", "anatomy"]),
  nbd.mc(NB_AN, "Cranial nerves", "easy", "Which cranial nerve carries taste sensation from the anterior two-thirds of the tongue?", [
    ["Glossopharyngeal nerve", "It serves taste from the posterior third."],
    ["Vagus nerve", "The vagus serves taste at the epiglottis region."],
    ["Chorda tympani branch of the facial nerve", "The chorda tympani carries special visceral afferent taste fibers from the anterior two-thirds."],
    ["Hypoglossal nerve", "It is motor to the tongue."],
  ], "c", "Taste from the anterior two-thirds of the tongue travels in the chorda tympani (CN VII), which joins the lingual nerve. The glossopharyngeal nerve supplies taste and general sensation to the posterior third.", "Anterior two-thirds taste = chorda tympani (VII).", ["cranial nerves", "tongue"]),

  nbd.mc(NB_BP, "Collagen synthesis", "moderate", "Which vitamin is required as a cofactor for the hydroxylation of proline and lysine during collagen synthesis?", [
    ["Vitamin A", "Vitamin A affects epithelial differentiation and vision."],
    ["Vitamin D", "Vitamin D regulates calcium and phosphate absorption."],
    ["Vitamin K", "Vitamin K is needed for carboxylation of clotting factors."],
    ["Vitamin C", "Ascorbic acid is a cofactor for prolyl and lysyl hydroxylases, stabilizing the collagen triple helix."],
  ], "d", "Without vitamin C, collagen cannot be properly cross-linked, leading to scurvy with gingival bleeding, loose teeth and poor wound healing.", "Vitamin C deficiency impairs collagen hydroxylation and causes scurvy.", ["collagen", "nutrition"]),
  nbd.mc(NB_BP, "Calcium metabolism", "moderate", "Which combination correctly describes the effect of parathyroid hormone on calcium homeostasis?", [
    ["Decreased bone resorption and decreased renal calcium reabsorption", "PTH does the opposite."],
    ["Increased bone resorption, increased renal calcium reabsorption and increased calcitriol production", "PTH raises serum calcium through bone, kidney and vitamin D activation."],
    ["Increased calcitonin secretion and decreased serum calcium", "Calcitonin is released in response to high calcium."],
    ["Increased renal phosphate reabsorption", "PTH increases renal phosphate excretion."],
  ], "b", "PTH raises serum calcium by stimulating osteoclast activity indirectly through RANKL, increasing distal tubule calcium reabsorption and activating vitamin D. It decreases phosphate reabsorption in the proximal tubule.", "PTH raises calcium, lowers phosphate.", ["endocrine", "calcium"]),
  nbd.mc(NB_BP, "Salivary physiology", "moderate", "Parasympathetic stimulation of the major salivary glands produces which type of saliva?", [
    ["Small volume of thick, mucous-rich saliva", "That more closely describes sympathetic stimulation."],
    ["No change in saliva flow", "Parasympathetic stimulation strongly increases salivation."],
    ["A large volume of watery, serous saliva", "Muscarinic activation drives high-volume watery secretion."],
    ["Completely inhibited secretion", "Parasympathetic activity does not inhibit secretion."],
  ], "c", "Parasympathetic input through muscarinic receptors causes abundant watery saliva. Sympathetic stimulation produces a smaller, more viscous secretion. Anticholinergic drugs therefore cause xerostomia.", "Parasympathetic: watery and abundant; sympathetic: scant and thick.", ["salivary physiology", "autonomic"]),
  nbd.mc(NB_BP, "Neurophysiology", "moderate", "Which ion's permeability primarily determines the resting membrane potential of a neuron?", [
    ["Potassium", "The membrane is most permeable to K+ at rest through leak channels, so the resting potential is near the K+ equilibrium potential."],
    ["Sodium", "Sodium permeability rises during depolarization."],
    ["Calcium", "Calcium triggers neurotransmitter release at terminals."],
    ["Chloride", "Chloride contributes modestly in some cells but is not the main determinant."],
  ], "a", "At rest the neuron is most permeable to potassium, so the membrane potential is close to the potassium equilibrium potential. The Na+/K+ ATPase maintains the gradients.", "Resting potential is near E(K).", ["neurophysiology"]),
  nbd.mc(NB_BP, "Metabolism", "easy", "What is the net ATP yield per glucose molecule from anaerobic glycolysis?", [
    ["2 ATP", "Glycolysis uses 2 ATP and produces 4, for a net of 2."],
    ["4 ATP", "Four is the gross production."],
    ["32 ATP", "That approximates aerobic respiration in total."],
    ["0 ATP", "Glycolysis yields a net gain."],
  ], "a", "Glycolysis yields two net ATP per glucose along with two NADH and two pyruvate. Under anaerobic conditions pyruvate is converted to lactate to regenerate NAD+.", "Anaerobic glycolysis nets 2 ATP.", ["metabolism"]),
  nbd.mc(NB_BP, "Pharmacology", "moderate", "Local anesthetics must cross the nerve membrane in which form to reach their site of action?", [
    ["As the protonated cation", "The cation binds the receptor but cannot cross the lipid membrane well."],
    ["As the uncharged base", "The uncharged lipophilic base diffuses into the axon, then reionizes and blocks the sodium channel from inside."],
    ["Only as a conjugated metabolite", "Metabolites are not the active species."],
    ["As an insoluble crystal", "Crystals cannot diffuse."],
  ], "b", "Local anesthetics are weak bases. The uncharged form penetrates the nerve membrane and the cationic form blocks the channel from the cytoplasmic side. Acidic infected tissue holds more drug in the charged form, reducing effectiveness.", "Base crosses; cation blocks.", ["pharmacology", "local anesthetics"]),
  nbd.sata(NB_BP, "Endocrine physiology", "moderate", "Which are physiologic effects of insulin? Select all that apply.", [
    ["Increased glucose uptake in muscle and adipose tissue", "Insulin increases GLUT4 translocation."],
    ["Increased glycogen synthesis in liver and muscle", "Insulin promotes storage of glucose as glycogen."],
    ["Increased gluconeogenesis", "Insulin suppresses hepatic glucose production."],
    ["Increased lipolysis", "Insulin inhibits lipolysis and promotes fat storage."],
    ["Increased amino acid uptake and protein synthesis", "Insulin is anabolic."],
  ], ["a", "b", "e"], "Insulin is the anabolic hormone of the fed state: it increases glucose uptake, glycogen and lipid synthesis, protein synthesis and decreases glycogenolysis, gluconeogenesis and lipolysis.", "Insulin lowers blood glucose and promotes storage.", ["endocrine", "metabolism"]),

  nbd.mc(NB_MP, "Periodontal microbiology", "moderate", "Which group of bacteria forms the 'red complex' strongly associated with severe periodontitis?", [
    ["Streptococcus mutans, S. sobrinus and Lactobacillus", "These are cariogenic organisms."],
    ["Porphyromonas gingivalis, Tannerella forsythia and Treponema denticola", "These three are late colonizers strongly linked to deep pockets and bleeding."],
    ["Actinomyces viscosus, S. sanguinis and S. oralis", "These are early colonizers of plaque."],
    ["Candida albicans, Aspergillus and Mucor", "These are fungi."],
  ], "b", "Socransky's red complex contains P. gingivalis, T. forsythia and T. denticola. They colonize late in the biofilm and correlate with advanced periodontal disease.", "Red complex: Pg, Tf, Td.", ["microbiology", "periodontitis"]),
  nbd.mc(NB_MP, "Dental caries", "moderate", "What is the earliest clinically visible sign of enamel caries on a smooth surface?", [
    ["A cavitated brown lesion", "Cavitation is a later stage."],
    ["A white spot lesion with an intact surface layer", "Subsurface demineralization appears chalky white while the surface layer remains relatively intact."],
    ["Radiolucency into dentin", "That is a more advanced lesion."],
    ["Exposure of the pulp", "That is an advanced stage."],
  ], "b", "The first visible change is a white spot lesion, which is reversible through remineralization if the surface layer is intact. Continued acid attack eventually leads to cavitation.", "White spot lesions can remineralize.", ["caries", "pathology"]),
  nbd.sata(NB_MP, "Oral squamous cell carcinoma", "easy", "Which are established risk factors for oral squamous cell carcinoma? Select all that apply.", [
    ["Tobacco use", "Smoked and smokeless tobacco are major risk factors."],
    ["Heavy alcohol consumption", "Alcohol acts synergistically with tobacco."],
    ["Betel quid chewing", "Betel quid is a major risk factor in some regions."],
    ["Fluoridated drinking water", "Fluoride is not a carcinogen for oral cancer."],
    ["Chronic sun exposure of the lip", "Ultraviolet exposure increases the risk of lower lip carcinoma."],
  ], ["a", "b", "c", "e"], "Tobacco, alcohol, betel quid and sun exposure (lip) are established risk factors, and HPV is linked to oropharyngeal carcinoma. Fluoride is protective against caries and is not linked to oral cancer.", "Tobacco plus alcohol act synergistically.", ["oral cancer", "risk factors"]),
  nbd.mc(NB_MP, "Oral infections", "easy", "A white oral plaque that wipes away to leave an erythematous base, with budding yeast and pseudohyphae on a potassium hydroxide preparation, is most consistent with:", [
    ["Leukoplakia", "Leukoplakia cannot be wiped off."],
    ["Lichen planus", "Reticular lichen planus has striae that do not rub off."],
    ["Pseudomembranous candidiasis", "Wipeable white plaques with yeast and pseudohyphae define pseudomembranous candidiasis (thrush)."],
    ["Linea alba", "Linea alba is a benign white line along the occlusal plane."],
  ], "c", "Thrush appears as removable white pseudomembranes over erythematous mucosa. Risk factors include inhaled corticosteroids, antibiotics, diabetes and immunosuppression.", "Wipeable white plaque with hyphae = candidiasis.", ["infection", "fungal"]),
  nbd.mc(NB_MP, "Oral infections", "easy", "Recurrent herpes labialis (cold sores) results from reactivation of latent virus residing in which structure?", [
    ["Trigeminal ganglion", "HSV-1 establishes latency in sensory ganglia, mainly the trigeminal ganglion."],
    ["Dorsal root ganglia at C2 only", "Varicella-zoster is more associated with dorsal root and cranial nerve ganglia."],
    ["Parotid gland", "The parotid is not the latent reservoir for HSV."],
    ["Bone marrow", "HSV does not reside in marrow."],
  ], "a", "HSV-1 travels along sensory axons and persists in the trigeminal ganglion. Stress, ultraviolet light, fever or immunosuppression can trigger reactivation and lesions on the lip.", "HSV-1 latency: trigeminal ganglion.", ["virology", "herpes"]),
  nbd.mc(NB_MP, "Odontogenic infections", "difficult", "Which infection involves bilateral submandibular, sublingual and submental spaces and is dangerous because of potential airway obstruction?", [
    ["Buccal space abscess", "A buccal space abscess is usually localized to the cheek."],
    ["Canine space abscess", "This causes swelling of the upper lip and face near the eye."],
    ["Ludwig angina", "Ludwig angina is a rapidly spreading cellulitis of the floor of the mouth that elevates the tongue and threatens the airway."],
    ["Parotitis", "Parotitis involves the parotid gland."],
  ], "c", "Ludwig angina typically arises from mandibular molar infections and spreads bilaterally. Management prioritizes airway protection, intravenous antibiotics and surgical drainage.", "Ludwig angina: bilateral floor-of-mouth spaces; airway first.", ["infection", "emergency"]),
  nbd.mc(NB_MP, "Salivary gland pathology", "moderate", "What is the most common benign salivary gland tumor?", [
    ["Warthin tumor", "Warthin tumor is second most common and arises in the parotid."],
    ["Pleomorphic adenoma", "It is the most common salivary neoplasm and usually presents in the parotid gland as a painless mobile mass."],
    ["Mucoepidermoid carcinoma", "This is a malignant tumor."],
    ["Basal cell adenoma", "This is a less common benign tumor."],
  ], "b", "Pleomorphic adenoma contains epithelial and myoepithelial elements with a myxochondroid stroma. It is typically in the parotid gland and has a risk of recurrence if enucleated.", "Pleomorphic adenoma = most common salivary tumor.", ["pathology", "salivary"]),
  nbd.mc(NB_MP, "Autoimmune disease", "moderate", "A middle-aged woman presents with xerostomia, dry eyes and bilateral parotid enlargement. Which diagnosis is most likely?", [
    ["Mumps", "Mumps is acute and viral."],
    ["Sialolithiasis", "Stones cause unilateral swelling with meals."],
    ["Sjogren syndrome", "The triad of dry mouth, dry eyes and salivary gland enlargement is characteristic of Sjogren syndrome, an autoimmune exocrinopathy."],
    ["Diabetes insipidus", "This causes polyuria, not dry eyes and gland enlargement."],
  ], "c", "Sjogren syndrome features lymphocytic infiltration of exocrine glands. It increases caries risk and can predispose patients to lymphoma. Diagnosis involves serology and minor salivary gland biopsy.", "Sjogren: dry mouth plus dry eyes plus autoimmunity.", ["autoimmune", "salivary"]),

  nbd.mc(NB_DA, "Tooth morphology", "moderate", "Which tooth has a prominent transverse ridge and a small, nonfunctional lingual cusp?", [
    ["Maxillary first premolar", "The maxillary first premolar has two well-developed cusps and a central groove."],
    ["Mandibular second premolar", "It usually has two or three lingual cusps."],
    ["Mandibular first premolar", "The mandibular first premolar has a large buccal cusp, a transverse ridge and a small lingual cusp."],
    ["Mandibular first molar", "It has five cusps."],
  ], "c", "The mandibular first premolar resembles a small canine from the buccal view, with a transverse ridge connecting the buccal and lingual cusps and a tiny lingual cusp.", "Mandibular first premolar: transverse ridge, small lingual cusp.", ["tooth morphology", "premolars"]),
  nbd.mc(NB_DA, "Primary dentition", "easy", "How many teeth are in the complete primary dentition?", [
    ["16", "Sixteen is the number of permanent teeth per arch for adults."],
    ["20", "There are 10 primary teeth per arch, totaling 20."],
    ["24", "Twenty-four is not a standard count."],
    ["32", "This is the permanent dentition."],
  ], "b", "The primary dentition consists of eight incisors, four canines and eight molars, totaling 20 teeth.", "Primary dentition has 20 teeth; permanent has 32.", ["primary teeth"]),
  nbd.mc(NB_DA, "Occlusion", "moderate", "Which term describes the anteroposterior curvature of the occlusal plane when viewed from the lateral aspect?", [
    ["Curve of Wilson", "The curve of Wilson is seen in the frontal plane."],
    ["Monson sphere", "The Monson sphere describes a three-dimensional theoretical sphere."],
    ["Frankfort horizontal plane", "This is a cephalometric reference plane."],
    ["Curve of Spee", "The curve of Spee follows the cusp tips from canine through molars in the sagittal plane."],
  ], "d", "The curve of Spee is the anteroposterior curve of the mandibular occlusal plane, concave upward. The curve of Wilson is mediolateral, as seen from the front.", "Spee is sagittal; Wilson is frontal.", ["occlusion", "curves"]),
  nbd.mc(NB_DA, "Occlusion", "moderate", "Which statement best defines centric relation?", [
    ["The position of maximum intercuspation", "That defines maximum intercuspal position."],
    ["The most retruded tooth contact", "This is a tooth-guided position, not centric relation."],
    ["The rest position of the mandible", "That is the physiologic rest position."],
    ["A maxillomandibular relationship independent of tooth contact, with condyles in their most superior position against the articular eminence", "This describes the musculoskeletally stable condyle-disc position, independent of tooth contact."],
  ], "d", "Centric relation is a condylar position and not a tooth-contact position. Maximum intercuspation is determined by teeth. In many people the two positions do not coincide.", "CR is joint-determined; MIP is tooth-determined.", ["occlusion", "TMJ"]),
  nbd.mc(NB_DA, "Occlusion", "moderate", "In canine-guided occlusion, what happens when the mandible moves into a lateral excursion?", [
    ["All posterior teeth contact on both sides", "That is balanced occlusion."],
    ["The canines contact and disclude the posterior teeth", "Canine guidance separates posterior teeth during lateral excursion, reducing damaging lateral forces."],
    ["The incisors guide the movement alone", "Incisors guide protrusion."],
    ["No teeth guide the mandible", "The canines provide the guidance."],
  ], "b", "Canine guidance is a form of mutually protected occlusion in which the canines disclude the posterior teeth in lateral excursions. The posterior teeth protect the anterior teeth in maximum intercuspation.", "Canine guidance disoccludes posterior teeth in lateral movement.", ["occlusion", "guidance"]),
  nbd.mc(NB_DA, "Occlusion", "easy", "Overjet is best defined as the:", [
    ["Vertical overlap of the maxillary incisors over the mandibular incisors", "That is overbite."],
    ["Horizontal distance between the labial surface of the mandibular incisors and the incisal edges of the maxillary incisors", "Overjet is the horizontal (anteroposterior) overlap of the incisors."],
    ["Mesiodistal width of the incisor", "This is crown width."],
    ["Distance from cusp tip to the central fossa", "This is a posterior cusp feature."],
  ], "b", "Overjet is horizontal; overbite is vertical. A normal overjet is a few millimeters. Large overjet is common with Class II division 1.", "Overjet = horizontal; overbite = vertical.", ["occlusion", "orthodontics"]),
  nbd.sata(NB_DA, "Tooth morphology", "moderate", "Which features are characteristic of a permanent maxillary central incisor? Select all that apply.", [
    ["The widest mesiodistal crown dimension among the maxillary incisors", "The central incisor is wider than the lateral incisor."],
    ["A prominent lingual cingulum with marginal ridges", "Marginal ridges bound the lingual fossa."],
    ["Three mamelons on the incisal edge of a newly erupted tooth", "Mamelons are developmental lobes that wear away."],
    ["Five cusps", "Anterior teeth have no cusps (except a canine's single cusp)."],
    ["A mesial incisal angle that is sharper than the distal incisal angle", "The mesioincisal angle is more acute and the distal is more rounded."],
  ], ["a", "b", "c", "e"], "The maxillary central incisor is the widest anterior crown, with marginal ridges, a cingulum and fossa on the lingual and three mamelons when it erupts. Cusps are a feature of posterior teeth.", "Mamelons wear down with age.", ["tooth morphology", "incisors"]),
];

export const NBDE_MATERIALS: SeedMaterial[] = [
  note("nbde", NB_AN, "Muscles of mastication", "Muscles of Mastication and Mandibular Movements",
    "Origin, insertion, innervation and actions of the four masticatory muscles plus supporting muscles.",
`# Muscles of Mastication

All four muscles of mastication develop from the first pharyngeal arch and are innervated by the **mandibular division of the trigeminal nerve (V3)**.

## The four muscles
| Muscle | Main action | Notes |
|---|---|---|
| Masseter | Elevates the mandible | Superficial and deep heads; arises from the zygomatic arch |
| Temporalis | Elevates; posterior fibers retrude | Fan-shaped; arises from the temporal fossa, inserts on the coronoid process |
| Medial pterygoid | Elevates; assists protrusion | Forms a sling with the masseter at the angle of the mandible |
| Lateral pterygoid | Protrusion, opening, contralateral movement | Inferior head moves the condyle; superior head stabilizes the disc |

## Jaw movements
- **Opening**: lateral pterygoid with suprahyoid muscles (digastric, mylohyoid, geniohyoid) acting with gravity.
- **Closing**: masseter, temporalis, medial pterygoid.
- **Protrusion**: both lateral pterygoids with the medial pterygoids.
- **Retrusion**: posterior fibers of temporalis, with the digastric and suprahyoids.
- **Lateral excursion**: contralateral lateral pterygoid (working-side condyle rotates, balancing-side condyle translates forward).

## Related nerves and vessels
- Motor branches of V3: masseteric, deep temporal, medial pterygoid and lateral pterygoid nerves.
- The **masseteric artery** and **deep temporal arteries** derive from the maxillary artery.
- Muscles of facial expression, including buccinator, are supplied by **CN VII**.

## Clinical points
- **Trismus** can follow infection, trauma or inferior alveolar nerve block injury to the medial pterygoid.
- Temporalis and masseter hypertrophy occurs with bruxism.
- **Myofascial pain** commonly involves the masseter and temporalis, and responds to conservative therapy.
- Mandibular deviation on opening toward a side indicates restricted translation on that side.

**High-yield / exam traps:** The buccinator is not a muscle of mastication; it is supplied by the facial nerve. The lateral pterygoid is the only major masticatory muscle that primarily opens the jaw. All masticatory muscles are V3, but the mylohyoid and anterior digastric also share V3 innervation.`, 6),
  note("nbde", NB_BP, "Calcium metabolism", "Calcium, Phosphate and Bone: Hormonal Control",
    "How PTH, vitamin D and calcitonin keep serum calcium stable and affect bone remodeling.",
`# Calcium and Bone Physiology

## Body distribution
- Roughly 99% of calcium is stored in bone and teeth as hydroxyapatite.
- Plasma calcium exists as **ionized (active), protein-bound and complexed** fractions. Only ionized calcium is physiologically active.

## Hormones
### Parathyroid hormone (PTH)
- Released from the parathyroid glands in response to **low serum calcium**.
- **Bone**: increases osteoclast activity (through RANKL expression by osteoblasts).
- **Kidney**: increases calcium reabsorption in the distal tubule, decreases phosphate reabsorption, activates 1-alpha-hydroxylase.
- **Net effect**: raises serum calcium, lowers serum phosphate.

### Vitamin D (calcitriol)
- Formed from skin precursor and dietary sources; hydroxylated in the liver and then kidney.
- Increases intestinal absorption of calcium and phosphate.
- Required for normal mineralization; deficiency causes rickets in children and osteomalacia in adults.

### Calcitonin
- Released by thyroid C cells in response to high calcium.
- Inhibits osteoclasts; minor physiologic role in humans.

## Bone remodeling
- **Osteoblasts** form bone and secrete RANKL and OPG.
- **Osteoclasts** resorb bone through acid and proteases such as cathepsin K.
- **Osteocytes** sense mechanical stress and regulate remodeling.
- Orthodontic force and periodontal inflammation both alter the RANKL/OPG balance.

## Disorders with dental relevance
- **Hyperparathyroidism**: "brown tumors" (central giant cell lesions), loss of lamina dura.
- **Rickets**: delayed eruption and enamel hypoplasia.
- **Paget disease of bone**: hypercementosis, tooth spacing and increased alkaline phosphatase.
- **Osteoporosis therapy** with bisphosphonates raises concern for osteonecrosis of the jaw.

**High-yield / exam traps:** PTH raises calcium and lowers phosphate; vitamin D raises both. Calcitonin lowers calcium. Alkaline phosphatase marks osteoblast activity (elevated in Paget disease), while calcium and phosphate are often normal in Paget disease.`, 6),
  note("nbde", NB_MP, "Periodontal microbiology", "Oral Microbiology: Biofilm, Caries and Periodontal Pathogens",
    "Plaque succession and the organisms linked to caries and periodontal disease.",
`# Oral Microbiology Essentials

## Dental plaque biofilm
- Starts with the **acquired pellicle**, a salivary glycoprotein film that coats enamel within minutes of cleaning.
- **Early colonizers** (Streptococcus sanguinis, S. oralis, Actinomyces) bind pellicle receptors.
- **Fusobacterium nucleatum** acts as a bridge organism.
- **Late colonizers** include anaerobes such as P. gingivalis.
- Mature biofilm provides protection from antimicrobials and host defenses.

## Caries
- Multifactorial: **host (tooth and saliva), diet (fermentable carbohydrates), microflora and time**.
- **Mutans streptococci** are acidogenic and aciduric and make glucans from sucrose.
- **Lactobacilli** are associated with progression of established lesions.
- Rampant caries is associated with frequent sugar intake, xerostomia and poor plaque control.
- **Prevention**: fluoride, sealants, diet counseling, plaque control and saliva stimulation.

## Periodontal disease
- Gingivitis: reversible inflammation without attachment loss, associated with gram-positive early plaque.
- Periodontitis: shift to **gram-negative anaerobes** (red complex: P. gingivalis, T. forsythia, T. denticola).
- **Aggregatibacter actinomycetemcomitans** is strongly associated with periodontitis in young patients and produces leukotoxin.
- Host response drives much of the tissue destruction through cytokines and matrix metalloproteinases.

## Other oral infections
- **Candida albicans**: oral thrush; wipeable plaques with hyphae.
- **HSV-1**: primary herpetic gingivostomatitis, recurrent herpes labialis.
- **Actinomyces israelii**: cervicofacial actinomycosis with sulfur granules.
- **Odontogenic infections** are usually mixed aerobes and anaerobes; spread depends on muscle attachments to the mandible and maxilla.

## Infection control basics
- Standard precautions apply to all patients.
- Sterilization is verified with biological indicators; disinfection uses surface-appropriate agents.

**High-yield / exam traps:** Plaque does not need sugar to cause periodontal disease, but caries does. Acidogenic and aciduric are separate properties. Red complex bacteria are late colonizers and are not primary causes of caries.`, 6),
  note("nbde", NB_DA, "Occlusion", "Occlusion Fundamentals: Definitions You Must Know",
    "Key occlusal terms, guidance schemes and contact relationships.",
`# Occlusion Fundamentals

## Static relationships
- **Maximum intercuspal position (MIP)**: the position of maximum tooth contact, also called centric occlusion in many texts.
- **Centric relation (CR)**: a joint-determined position independent of tooth contact; condyles are seated in the most superior position within the glenoid fossa against the articular eminence.
- **Overbite**: vertical overlap of upper incisors over lower incisors.
- **Overjet**: horizontal overlap.
- **Crossbite**: reversal of the normal buccolingual relationship.

## Cusp roles
- **Supporting (functional or stamp) cusps**: maxillary palatal cusps and mandibular buccal cusps; they contact opposing fossae and marginal ridges in MIP.
- **Guiding cusps** (nonsupporting): maxillary buccal and mandibular lingual cusps; they guide food and protect cheeks and tongue.

## Mandibular movements and guidance
- **Protrusion**: anterior teeth disclude posterior teeth in a mutually protected scheme.
- **Lateral excursion**: working side contacts guide movement; balancing side is the side opposite.
- **Canine guidance**: canine contact disoccludes posterior teeth.
- **Group function**: several working-side teeth share contact.
- **Balanced occlusion** (bilateral): contact on both sides in eccentric movement is used mainly in complete dentures.

## Compensating curves
- **Curve of Spee**: anteroposterior curve of the occlusal plane.
- **Curve of Wilson**: mediolateral curve.
- **Monson sphere**: theoretical sphere describing arch geometry.

## Dentures and occlusion
- Complete dentures are often set in balanced occlusion to maintain denture stability.
- Natural dentitions favor mutually protected occlusion.

## Clinical relevance
- **Occlusal interferences** can cause fremitus, wear or discomfort.
- **Bruxism** causes attrition and may lead to mobility, TMD or restoration failure.
- **Occlusal splints** protect teeth and may reduce muscle symptoms.

**High-yield / exam traps:** Centric relation and maximum intercuspation are different concepts. The working side is the side to which the mandible moves; the balancing (nonworking) side is the opposite side. Curve of Spee = sagittal; Wilson = frontal.`, 6),
  note("nbde", NB_MP, "Oral squamous cell carcinoma", "Oral Cancer and Premalignant Lesions: Recognition Guide",
    "Risk factors, high-risk sites and the workup of suspicious white and red lesions.",
`# Oral Cancer and Potentially Malignant Disorders

## Epidemiology and risk factors
- **Squamous cell carcinoma (SCC)** accounts for the vast majority of oral cancers.
- **Tobacco** (smoked and smokeless) and **alcohol** are the strongest risk factors, acting synergistically.
- **Betel quid and areca nut** are risk factors in parts of Asia.
- **HPV-16** is associated with oropharyngeal SCC rather than the classic oral cavity SCC.
- **Sun exposure** increases lower lip carcinoma risk.
- Chronic immunosuppression and genetic conditions such as Fanconi anemia increase risk.

## High-risk intraoral sites
- Lateral and ventral tongue.
- Floor of the mouth.
- Soft palate and tonsillar complex.
Lesions at these sites tend to present at later stages and metastasize to cervical lymph nodes.

## Clinical presentations
- **Leukoplakia**: white plaque that cannot be rubbed off or attributed to another disease. Some show dysplasia.
- **Erythroplakia**: red velvety patch with high rate of dysplasia or carcinoma.
- **Erythroleukoplakia**: mixed red and white.
- **Invasive SCC**: indurated nonhealing ulcer or mass with rolled borders; may be painless early.
- **Verrucous carcinoma**: slow-growing exophytic white lesion related to smokeless tobacco.

## Workup
1. Remove obvious irritants for 2 weeks if the cause is uncertain.
2. **Biopsy** persistent lesions; use the most suspicious area.
3. Stage using clinical exam and imaging, with attention to cervical nodes.
4. Refer to oncology/head and neck surgery.

## Prognosis and prevention
- Prognosis depends strongly on **stage at diagnosis**; early detection improves survival.
- Annual oral cancer screening, tobacco cessation counseling and alcohol reduction are the key preventive measures.
- After treatment, patients need lifelong surveillance for second primary tumors and complications such as osteoradionecrosis.

**High-yield / exam traps:** Erythroplakia carries a higher malignant potential than leukoplakia. Painless is not benign. The most common site for intraoral SCC is the lateral border of the tongue, followed by the floor of the mouth.`, 6),
];

const fcNb = (cat: string) => fc("nbde", cat);
export const NBDE_FLASHCARDS: SeedFlashcard[] = [
  fcNb(NB_AN)("Muscles of mastication", "Innervation of all four muscles of mastication?", "The mandibular division of the trigeminal nerve (V3)."),
  fcNb(NB_AN)("Muscles of mastication", "Which masticatory muscle opens the jaw?", "The lateral pterygoid (inferior head) with help from suprahyoid muscles."),
  fcNb(NB_AN)("Salivary glands", "Where does the parotid duct open?", "On the buccal mucosa opposite the maxillary second molar."),
  fcNb(NB_AN)("Embryology", "Embryologic cause of cleft lip?", "Failure of the maxillary prominence to fuse with the medial nasal prominence."),
  fcNb(NB_AN)("Histology", "Which cells form enamel, dentin and cementum?", "Ameloblasts, odontoblasts and cementoblasts, respectively."),
  fcNb(NB_AN)("Cranial nerves", "Taste from the anterior two-thirds of the tongue travels in which nerve?", "The chorda tympani (CN VII)."),
  fcNb(NB_BP)("Collagen synthesis", "Which vitamin hydroxylates proline and lysine in collagen?", "Vitamin C (ascorbic acid)."),
  fcNb(NB_BP)("Calcium metabolism", "Effect of PTH on calcium and phosphate?", "Raises serum calcium and lowers serum phosphate."),
  fcNb(NB_BP)("Salivary physiology", "Parasympathetic effect on saliva?", "Large volume of watery saliva (through muscarinic receptors)."),
  fcNb(NB_BP)("Neurophysiology", "Which ion determines resting membrane potential?", "Potassium, because resting permeability is highest for K+."),
  fcNb(NB_BP)("Metabolism", "Net ATP from anaerobic glycolysis per glucose?", "2 ATP."),
  fcNb(NB_MP)("Periodontal microbiology", "Members of the red complex?", "Porphyromonas gingivalis, Tannerella forsythia and Treponema denticola."),
  fcNb(NB_MP)("Dental caries", "Earliest clinical sign of enamel caries?", "White spot lesion from subsurface demineralization."),
  fcNb(NB_MP)("Oral infections", "KOH finding in oral candidiasis?", "Budding yeast and pseudohyphae."),
  fcNb(NB_MP)("Salivary gland pathology", "Most common benign salivary gland tumor?", "Pleomorphic adenoma, usually in the parotid."),
  fcNb(NB_MP)("Oral squamous cell carcinoma", "Highest-risk intraoral sites for SCC?", "Lateral and ventral tongue and floor of the mouth."),
  fcNb(NB_DA)("Tooth morphology", "Which premolar has a transverse ridge and tiny lingual cusp?", "Mandibular first premolar."),
  fcNb(NB_DA)("Occlusion", "Overjet versus overbite?", "Overjet is horizontal overlap; overbite is vertical overlap."),
  fcNb(NB_DA)("Occlusion", "Curve of Spee versus curve of Wilson?", "Spee is anteroposterior (sagittal); Wilson is mediolateral (frontal)."),
  fcNb(NB_DA)("Primary dentition", "How many teeth in the primary dentition?", "Twenty."),
];

/* ================================================================== */
/* Dental Anatomy                                                      */
/* ================================================================== */
const DA_TM = "Tooth Morphology";
const DA_OC = "Occlusion";
const DA_TD = "Tooth Development";
const DA_HN = "Head and Neck Anatomy";
const dan = maker("dental-anatomy");

export const DENTAL_ANATOMY_QUESTIONS: SeedQuestion[] = [
  dan.mc(DA_TM, "Tooth numbering", "easy", "In the Universal numbering system for permanent teeth, which number designates the mandibular left first molar?", [
    ["3", "Tooth 3 is the maxillary right first molar."],
    ["14", "Tooth 14 is the maxillary left second molar."],
    ["19", "Numbering continues from 17 (mandibular left third molar), so 19 is the mandibular left first molar."],
    ["30", "Tooth 30 is the mandibular right second molar."],
    ["32", "Tooth 32 is the mandibular right third molar."],
  ], "c", "The Universal system starts at the maxillary right third molar (1), runs to the maxillary left third molar (16), then drops to the mandibular left third molar (17) and ends at the mandibular right third molar (32). The mandibular left molars are 17, 18 and 19.", "Universal: 1-16 upper right to left, 17-32 lower left to right.", ["numbering"]),
  dan.mc(DA_TM, "Tooth numbering", "easy", "In the FDI two-digit system, which tooth is designated 26?", [
    ["Maxillary left first molar", "The first digit 2 indicates the maxillary left quadrant and the second digit 6 is the first molar."],
    ["Maxillary right first molar", "That is tooth 16."],
    ["Mandibular left first molar", "That is tooth 36."],
    ["Maxillary left second premolar", "That is tooth 25."],
  ], "a", "FDI numbers use quadrant (1 upper right, 2 upper left, 3 lower left, 4 lower right) followed by tooth position from the midline (1 central incisor through 8 third molar).", "FDI: quadrant digit then position digit.", ["numbering"]),
  dan.mc(DA_TM, "Maxillary molars", "moderate", "Which ridge on a maxillary first molar connects the distobuccal cusp to the mesiolingual cusp?", [
    ["Transverse ridge", "A transverse ridge crosses the occlusal table in premolars from buccal to lingual."],
    ["Marginal ridge", "Marginal ridges border the occlusal surface mesially and distally."],
    ["Oblique ridge", "The oblique ridge is the distinctive diagonal ridge of maxillary molars."],
    ["Triangular ridge", "A triangular ridge descends from a cusp tip toward the central fossa."],
  ], "c", "The oblique ridge crosses the maxillary molar occlusal surface from the mesiolingual cusp to the distobuccal cusp. It is a characteristic of maxillary molars.", "Oblique ridge = mesiolingual to distobuccal on maxillary molars.", ["molars", "ridges"]),
  dan.mc(DA_TM, "Mandibular molars", "easy", "How many cusps does a typical permanent mandibular first molar have?", [
    ["Three", "Three cusps would be too few."],
    ["Four", "Mandibular second molars commonly have four cusps."],
    ["Five", "The mandibular first molar typically has five: mesiobuccal, distobuccal, distal, mesiolingual and distolingual."],
    ["Six", "Six cusps is not typical."],
  ], "c", "The mandibular first molar usually has five cusps and two roots (mesial and distal). The mandibular second molar usually has four cusps.", "Mandibular first molar = 5 cusps, 2 roots.", ["molars", "cusps"]),
  dan.mc(DA_TM, "Canines", "easy", "Which permanent tooth usually has the longest root?", [
    ["Maxillary central incisor", "The central incisor root is shorter than the canine's."],
    ["Mandibular first molar", "Molar roots are shorter overall."],
    ["Maxillary canine", "The maxillary canine has the longest root and crown-root length of any tooth."],
    ["Mandibular canine", "The mandibular canine's root is long but shorter than the maxillary canine's."],
  ], "c", "The maxillary canine's long root forms the canine eminence and gives it strong support as a cornerstone of the arch.", "Maxillary canine: longest tooth.", ["canines"]),
  dan.mc(DA_TM, "Premolars", "moderate", "Which premolar most often has two roots (buccal and palatal)?", [
    ["Maxillary first premolar", "Most maxillary first premolars have two roots or a bifurcated root."],
    ["Maxillary second premolar", "It typically has one root."],
    ["Mandibular first premolar", "It usually has one root."],
    ["Mandibular second premolar", "It usually has one root."],
  ], "a", "The maxillary first premolar commonly has two roots and two canals, an important consideration in endodontics and extraction. Other premolars generally have a single root.", "Maxillary first premolar: often two roots.", ["premolars", "roots"]),
  dan.sata(DA_TM, "Mandibular incisors", "moderate", "Which statements describe permanent mandibular incisors? Select all that apply.", [
    ["The mandibular central incisor is the smallest tooth in the permanent dentition", "It has the narrowest mesiodistal width."],
    ["The crown is nearly symmetric with the incisal edge centered over the root", "The crown's symmetry is a feature of mandibular incisors."],
    ["The lingual fossa is deep with a prominent cingulum", "These features are more characteristic of maxillary incisors."],
    ["The root is flattened mesiodistally and often has developmental grooves", "Mandibular incisor roots are flattened mesiodistally with grooves."],
    ["A cusp of Carabelli is often present", "Cusp of Carabelli is on maxillary first molars."],
  ], ["a", "b", "d"], "Mandibular incisors are small, symmetric and have weakly developed lingual features. Roots are narrow mesiodistally and can have two canals.", "Mandibular incisors: smaller, symmetric, weak lingual detail.", ["incisors"]),
  dan.mc(DA_TM, "Developmental features", "moderate", "The small bumps along the incisal edge of a newly erupted incisor are called:", [
    ["Cingula", "The cingulum is a lingual convexity near the cervical third."],
    ["Mamelons", "Mamelons represent the three labial developmental lobes and wear off with function."],
    ["Perikymata", "Perikymata are surface ridges in enamel."],
    ["Tubercles", "Tubercles are small accessory elevations on a crown."],
  ], "b", "Mamelons are three rounded projections on the incisal edge that correspond to the three labial lobes. Attrition removes them in early adulthood, although persistence can occur with open bite.", "Mamelons = three labial lobes on new incisors.", ["incisors", "development"]),

  dan.mc(DA_OC, "Angle classification", "easy", "In an Angle Class I molar relationship, the mesiobuccal cusp of the maxillary first molar occludes with the:", [
    ["Mesiobuccal groove of the mandibular first molar", "That is the buccal groove, the normal Class I relationship."],
    ["Distal marginal ridge of the mandibular first molar", "That would suggest a Class II relationship."],
    ["Mesial marginal ridge of the mandibular first molar", "That would suggest a Class II relationship."],
    ["Lingual groove of the mandibular second premolar", "This is not the standard landmark."],
  ], "a", "Class I occlusion places the mesiobuccal cusp of the maxillary first molar in the buccal groove of the mandibular first molar. Malocclusion may still exist because of crowding, rotation or incisor problems.", "Class I molar: MB cusp in buccal groove.", ["Angle classification"]),
  dan.mc(DA_OC, "Angle classification", "moderate", "A patient has a Class II molar relationship with proclined maxillary central incisors and a large overjet. Which Angle subdivision is this?", [
    ["Class I", "Class I has a normal molar relationship."],
    ["Class II division 1", "Division 1 features a Class II molar relationship with proclined maxillary incisors and increased overjet."],
    ["Class II division 2", "Division 2 has retroclined maxillary central incisors."],
    ["Class III", "Class III has the mandibular molar mesial to the normal position."],
  ], "b", "In Class II division 1, the mandibular first molar sits distal relative to the maxillary first molar, and the maxillary incisors flare forward. In division 2 the central incisors are retroclined with a deep bite.", "Div 1 = proclined upper incisors; Div 2 = retroclined central incisors.", ["Angle classification"]),
  dan.mc(DA_OC, "Angle classification", "easy", "In Angle Class III malocclusion, the mandibular first molar is positioned:", [
    ["Distal to its normal position relative to the maxillary first molar", "That is Class II."],
    ["In the normal relationship", "That is Class I."],
    ["Mesial to its normal position relative to the maxillary first molar", "In Class III the buccal groove lies mesial to the maxillary mesiobuccal cusp."],
    ["Lingual to the maxillary first molar", "That describes a posterior crossbite."],
  ], "c", "Class III has the mandibular arch positioned forward relative to the maxillary arch. It can be skeletal, dental or both.", "Class III = mandibular molar mesial.", ["Angle classification"]),
  dan.mc(DA_OC, "Cusp function", "moderate", "Which cusps are the supporting (functional) cusps in a normal posterior occlusion?", [
    ["Maxillary buccal and mandibular lingual cusps", "These are guiding cusps."],
    ["Maxillary palatal and mandibular buccal cusps", "These contact opposing fossae and marginal ridges and support the vertical dimension."],
    ["Only the mesiobuccal cusps", "Not limited to the mesiobuccal cusp."],
    ["Only canines", "Canines are anterior teeth."],
  ], "b", "Supporting cusps, also called stamp or centric cusps, hold the vertical dimension and occlude in the central fossae and marginal ridges. They are broad and rounded.", "Supporting cusps: maxillary lingual and mandibular buccal.", ["cusps", "occlusion"]),
  dan.mc(DA_OC, "Compensating curves", "moderate", "The mediolateral curvature of the occlusal plane as seen from the front is the curve of:", [
    ["Spee", "The curve of Spee is anteroposterior."],
    ["Wilson", "The curve of Wilson is seen in the frontal plane."],
    ["Monson", "Monson describes a spherical arrangement."],
    ["Carabelli", "This refers to a cusp, not a curve."],
  ], "b", "Wilson's curve results from lingual inclination of mandibular posterior teeth, giving a concave curve of the cusp tips in the frontal view.", "Wilson = frontal plane, Spee = sagittal plane.", ["curves"]),
  dan.sata(DA_OC, "Mutually protected occlusion", "difficult", "Which statements describe mutually protected occlusion? Select all that apply.", [
    ["Posterior teeth bear the main occlusal load in maximum intercuspation", "Posterior teeth are well aligned to receive axial forces."],
    ["Anterior teeth contact lightly or not at all in maximum intercuspation", "Light anterior contact protects them from heavy forces."],
    ["Anterior teeth disclude posterior teeth in excursive movements", "Anterior guidance protects the posterior teeth from lateral stress."],
    ["Posterior teeth should guide protrusive movement", "Anterior teeth, not posterior teeth, guide protrusion."],
    ["Balanced contacts on the balancing side are required in all natural dentitions", "Balancing contacts are generally considered interferences in natural teeth."],
  ], ["a", "b", "c"], "In mutually protected occlusion, posterior teeth protect the anterior teeth at closure, and the anterior teeth protect the posterior teeth during eccentric movement. Balanced contacts are used in complete dentures, not for natural dentitions.", "Posterior teeth protect anterior at closure; anterior teeth protect posterior in excursions.", ["occlusion", "guidance"]),
  dan.mc(DA_OC, "Embrasures", "easy", "The V-shaped space between adjacent teeth that is gingival to the contact area is called the:", [
    ["Incisal embrasure", "The incisal embrasure lies incisal to the contact."],
    ["Buccal embrasure", "The buccal embrasure lies on the facial side of the contact."],
    ["Lingual embrasure", "The lingual embrasure lies on the lingual side."],
    ["Gingival (cervical) embrasure", "This space is normally filled by the interdental papilla."],
  ], "d", "Gingival embrasures are occupied by the interdental papilla. Loss of papilla creates black triangles. Other embrasures provide spillways for food.", "Gingival embrasure = papilla-filled space.", ["embrasures"]),

  dan.mc(DA_TD, "Odontogenesis", "moderate", "During which stage of tooth development is the crown pattern (morphodifferentiation) established?", [
    ["Bud stage", "The bud stage is the first, with simple epithelial proliferation."],
    ["Cap stage", "The enamel organ begins to take shape but the crown pattern is not yet set."],
    ["Bell stage", "In the bell stage, histodifferentiation and morphodifferentiation establish the crown shape."],
    ["Apposition stage", "Matrix deposition follows once the shape is defined."],
  ], "c", "The bell stage includes the formation of the dental papilla, enamel organ layers and the shape of the crown pattern. The apposition stage then secretes enamel and dentin matrix.", "Bell stage defines crown shape and cell differentiation.", ["odontogenesis"]),
  dan.mc(DA_TD, "Odontogenesis", "moderate", "From which embryologic tissue does the dental papilla (and later dentin and pulp) derive?", [
    ["Oral ectoderm", "Oral ectoderm forms the enamel organ."],
    ["Ectomesenchyme derived from neural crest", "Neural crest-derived ectomesenchyme forms the papilla and follicle."],
    ["Endoderm", "Endoderm forms the lining of the digestive tract."],
    ["Paraxial mesoderm exclusively", "Neural crest contribution is key."],
  ], "b", "Teeth form through interactions between oral epithelium (enamel organ) and neural crest ectomesenchyme (papilla and follicle). Enamel derives from ectoderm, and dentin, pulp, cementum and PDL from ectomesenchyme.", "Enamel: ectoderm; dentin/pulp/cementum/PDL: ectomesenchyme.", ["odontogenesis", "embryology"]),
  dan.mc(DA_TD, "Root development", "moderate", "Which structure initiates root formation and induces radicular dentin formation?", [
    ["Reduced enamel epithelium", "It protects enamel until eruption."],
    ["Hertwig epithelial root sheath", "The sheath of inner and outer enamel epithelium grows apically, determines root shape and induces odontoblast differentiation."],
    ["Dental lamina", "The lamina initiates tooth buds."],
    ["Enamel knot", "The enamel knot signals cusp formation."],
  ], "b", "Hertwig epithelial root sheath outlines the root and induces odontoblast differentiation. Fragments remaining in the PDL are the epithelial rests of Malassez.", "HERS shapes the root and induces radicular dentin.", ["root development"]),
  dan.mc(DA_TD, "Eruption", "easy", "At approximately what age do the permanent first molars erupt?", [
    ["3 years", "Primary teeth are erupting at this age."],
    ["6 years", "The permanent first molars erupt around age 6 and are called six-year molars."],
    ["10 years", "This is about when the premolars and canines erupt."],
    ["14 years", "Second molars erupt near 12 years."],
  ], "b", "Permanent first molars erupt distal to the primary second molars at about six years and do not replace any primary tooth. Mandibular central incisors erupt around the same time.", "First permanent molars erupt at ~6 years.", ["eruption"]),
  dan.mc(DA_TD, "Dental lamina", "difficult", "Permanent premolars develop from which structure?", [
    ["Direct budding from the primary tooth enamel organ", "Primary tooth enamel organs do not produce permanent teeth directly."],
    ["The successional lamina, an extension of the dental lamina lingual to the primary tooth germ", "Successional teeth (incisors, canines, premolars) develop from the successional lamina."],
    ["The distal extension of the dental lamina", "That gives rise to permanent molars."],
    ["The vestibular lamina", "This forms the oral vestibule."],
  ], "b", "Permanent incisors, canines and premolars (succedaneous teeth) develop from the successional lamina. Permanent molars arise from distal extension of the dental lamina and have no primary predecessors.", "Succedaneous teeth: successional lamina; molars: distal extension.", ["dental lamina"]),
  dan.mc(DA_TD, "Amelogenesis", "moderate", "Which statement about the order of hard-tissue formation is correct?", [
    ["Enamel matrix deposition begins before dentin", "Dentin forms first."],
    ["Dentin forms first, and its formation induces ameloblasts to secrete enamel matrix", "Odontoblasts deposit mantle dentin, which signals ameloblasts to differentiate and secrete enamel."],
    ["Cementum forms before dentin", "Cementum forms after root dentin starts."],
    ["Enamel and dentin form simultaneously and independently", "They depend on reciprocal induction."],
  ], "b", "Dentinogenesis starts first; mantle dentin then induces ameloblast differentiation. This reciprocal induction explains why genetic defects often involve both tissues.", "Dentin first, enamel second.", ["amelogenesis", "dentinogenesis"]),
  dan.sata(DA_TD, "Developmental anomalies", "moderate", "Which are disturbances in tooth number? Select all that apply.", [
    ["Hypodontia", "Hypodontia is the congenital absence of one or a few teeth."],
    ["Oligodontia", "Oligodontia means absence of six or more teeth."],
    ["Dens invaginatus", "This is a shape anomaly."],
    ["Supernumerary teeth (hyperdontia)", "Extra teeth increase the tooth count."],
    ["Taurodontism", "This is a root and pulp chamber shape anomaly."],
  ], ["a", "b", "d"], "Tooth number anomalies include anodontia, hypodontia, oligodontia and hyperdontia. Dens invaginatus and taurodontism are shape anomalies.", "Number: hypo-, oligo-, an-, hyperdontia.", ["anomalies"]),

  dan.mc(DA_HN, "Salivary glands", "moderate", "Which major salivary gland contributes the largest share of unstimulated saliva?", [
    ["Parotid", "The parotid contributes most of the stimulated saliva volume."],
    ["Submandibular", "The submandibular gland produces roughly two-thirds of resting saliva."],
    ["Sublingual", "The sublingual gland is a minor contributor."],
    ["Minor salivary glands", "Minor glands add mucous secretions in small volumes."],
  ], "b", "At rest the submandibular gland is dominant, while the parotid dominates when salivation is stimulated. This explains why chewing and gustatory stimulation increase serous saliva.", "Resting saliva: submandibular; stimulated: parotid.", ["salivary glands"]),
  dan.mc(DA_HN, "Salivary glands", "moderate", "Which nerve provides parasympathetic secretomotor fibers to the parotid gland?", [
    ["Facial nerve through the chorda tympani", "This serves the submandibular and sublingual glands."],
    ["Glossopharyngeal nerve via the lesser petrosal nerve and otic ganglion", "The glossopharyngeal nerve synapses in the otic ganglion before reaching the parotid via the auriculotemporal nerve."],
    ["Trigeminal nerve directly", "V3 carries fibers but does not provide the preganglionic parasympathetic."],
    ["Vagus nerve", "The vagus does not supply the parotid."],
  ], "b", "Parotid parasympathetic fibers originate in the inferior salivatory nucleus, travel in CN IX and its tympanic and lesser petrosal branches, synapse in the otic ganglion and travel with the auriculotemporal nerve.", "Parotid = CN IX; submandibular and sublingual = CN VII.", ["salivary glands", "autonomic"]),
  dan.mc(DA_HN, "Salivary glands", "moderate", "Parasympathetic innervation of the submandibular and sublingual glands reaches them through which route?", [
    ["Chorda tympani to the lingual nerve and submandibular ganglion", "Preganglionic fibers travel via chorda tympani, then synapse in the submandibular ganglion."],
    ["Lesser petrosal nerve and otic ganglion", "That route supplies the parotid."],
    ["Greater petrosal nerve and pterygopalatine ganglion", "That route supplies lacrimal and nasal glands."],
    ["Hypoglossal nerve", "The hypoglossal nerve is motor to the tongue."],
  ], "a", "Facial nerve fibers (chorda tympani) join the lingual nerve, synapse in the submandibular ganglion and supply both glands.", "VII supplies submandibular and sublingual; IX supplies parotid.", ["salivary glands", "autonomic"]),
  dan.mc(DA_HN, "Facial muscles", "moderate", "The buccinator muscle receives motor innervation from which nerve?", [
    ["Long buccal nerve of V3", "The long buccal nerve is sensory."],
    ["Buccal branch of the facial nerve", "The buccinator is a muscle of facial expression supplied by CN VII."],
    ["Masseteric nerve", "This supplies the masseter."],
    ["Mental nerve", "This is sensory."],
  ], "b", "The facial nerve supplies all muscles of facial expression, including the buccinator. The long buccal nerve provides sensation to the cheek mucosa, creating a classic point of confusion.", "Buccinator motor: VII; sensation: V3 long buccal.", ["muscles", "nerves"]),
  dan.mc(DA_HN, "Arterial supply", "moderate", "Which vessel is the largest terminal branch of the external carotid artery and supplies the deep face and teeth?", [
    ["Superficial temporal artery", "It supplies the scalp and temple."],
    ["Facial artery", "It supplies superficial face structures."],
    ["Maxillary artery", "The maxillary artery gives rise to the inferior alveolar, middle meningeal and superior alveolar arteries."],
    ["Lingual artery", "This is a separate branch supplying the tongue."],
  ], "c", "The external carotid terminates as the superficial temporal and maxillary arteries; the maxillary artery is larger and supplies the teeth, nasal cavity, palate and dura through the middle meningeal artery.", "Maxillary artery supplies teeth and deep face.", ["arteries"]),
  dan.mc(DA_HN, "Venous drainage", "difficult", "Why is infection of the upper lip and nose region (danger triangle) potentially dangerous?", [
    ["The area is drained by the lymphatics of the neck only", "The venous connection is the concern."],
    ["Venous connections can carry infection to the cavernous sinus", "The facial vein connects to the cavernous sinus through the angular, ophthalmic and pterygoid plexus pathways, which lack valves."],
    ["The area is supplied by the vagus nerve", "Nerve supply is not the concern."],
    ["Bone in this area is exposed", "Exposure of bone is not the mechanism."],
  ], "b", "The facial vein communicates with the cavernous sinus through the ophthalmic veins and the pterygoid plexus, so infection can lead to cavernous sinus thrombosis.", "Danger triangle: facial vein to cavernous sinus.", ["veins", "infection"]),
  dan.sata(DA_HN, "Pterygopalatine fossa", "difficult", "Which structures are contained in the pterygopalatine fossa? Select all that apply.", [
    ["Maxillary nerve (V2) as it enters the fossa", "V2 enters through the foramen rotundum."],
    ["Pterygopalatine ganglion", "The parasympathetic ganglion lies in the fossa."],
    ["Third part of the maxillary artery", "The artery gives its terminal branches in the fossa."],
    ["Otic ganglion", "The otic ganglion is in the infratemporal fossa."],
    ["Submandibular ganglion", "This ganglion hangs from the lingual nerve in the floor of mouth."],
  ], ["a", "b", "c"], "The fossa contains V2, the pterygopalatine ganglion and the terminal portion of the maxillary artery. It communicates with the orbit, nasal cavity, oral cavity and infratemporal fossa.", "PPF: V2, ganglion, maxillary artery third part.", ["fossa", "nerves"]),
  dan.mc(DA_HN, "Palatal innervation", "easy", "Which nerve block anesthetizes the palatal mucosa and gingiva from canine to canine?", [
    ["Greater palatine", "It anesthetizes the posterior palate."],
    ["Nasopalatine", "The nasopalatine nerve exits the incisive foramen and supplies the anterior palate."],
    ["Infraorbital", "This supplies the labial tissues and anterior teeth."],
    ["Inferior alveolar", "This is a mandibular nerve block."],
  ], "b", "The nasopalatine nerve block, given near the incisive papilla, anesthetizes the anterior hard palate from canine to canine. The greater palatine block covers the posterior hard palate up to the premolar region.", "Nasopalatine = anterior palate; greater palatine = posterior palate.", ["anesthesia", "nerves"]),
];

export const DENTAL_ANATOMY_MATERIALS: SeedMaterial[] = [
  note("dental-anatomy", DA_TM, "Tooth numbering", "Tooth Numbering Systems: Universal, FDI and Palmer",
    "Decode any tooth number quickly in the three major notation systems.",
`# Tooth Numbering Systems

Three systems appear on exams and in practice. Knowing the logic lets you decode any number in seconds.

## Universal (ADA) system
- Permanent teeth numbered **1 to 32**.
- Start at the **maxillary right third molar (1)**, move across the upper arch to the maxillary left third molar (**16**).
- Drop to the **mandibular left third molar (17)** and move across to the mandibular right third molar (**32**).
- Primary teeth use letters **A to T** in the same sequence: A is the maxillary right second molar, J is the maxillary left second molar, K is the mandibular left second molar, T is the mandibular right second molar.

## FDI (ISO) two-digit system
- First digit = **quadrant**: 1 maxillary right, 2 maxillary left, 3 mandibular left, 4 mandibular right.
- Second digit = **tooth from the midline**: 1 central incisor, 2 lateral, 3 canine, 4 first premolar, 5 second premolar, 6 first molar, 7 second molar, 8 third molar.
- Primary teeth use quadrants 5 to 8 and positions 1 to 5.
- Tooth 36 is the mandibular left first molar; tooth 26 is the maxillary left first molar.

## Palmer notation
- Uses a grid symbol with quadrant lines and numbers 1 to 8 (permanent) or letters A to E (primary).
- The position number is the tooth distance from the midline, as in FDI.

## Quick conversions
- Universal 3 = FDI 16 (maxillary right first molar).
- Universal 19 = FDI 36.
- Universal 30 = FDI 47.
- Universal 8 = FDI 11 (maxillary right central incisor) and Universal 9 = FDI 21 (maxillary left central incisor).

## Practice approach
1. Identify the quadrant first.
2. Count teeth from the midline.
3. Verify with the tooth type (for example molars have two or three roots).

**High-yield / exam traps:** In the Universal system the numbers jump from 16 to 17 under the left side of the mouth. Tooth 8 and 9 are the central incisors, and 24 and 25 are the mandibular central incisors. In FDI, the number 5 in the first digit means a primary maxillary right tooth.`, 5),
  note("dental-anatomy", DA_OC, "Angle classification", "Angle Classification and Occlusal Relationships",
    "Class I, II and III molar relationships and the incisor patterns that subdivide Class II.",
`# Angle Classification

Edward Angle classified malocclusion by the relationship of the **maxillary first molar** to the **mandibular first molar**, using the maxillary first molar as the fixed reference.

## Class I (neutroclusion)
- **Mesiobuccal cusp** of the maxillary first molar sits in the **buccal groove** of the mandibular first molar.
- Malocclusion can still occur due to crowding, spacing, rotation or crossbite.

## Class II (distoclusion)
- Mandibular first molar is **distal** to its normal position.
- The mesiobuccal cusp of the maxillary molar lies between the mandibular second premolar and first molar (cusp-to-cusp is called an end-on relationship).
- **Division 1**: proclined (flared) maxillary incisors, large overjet.
- **Division 2**: retroclined maxillary central incisors, lateral incisors may be proclined, deep overbite.
- **Subdivision**: Class II on one side only.

## Class III (mesioclusion)
- Mandibular first molar is **mesial** to normal.
- The mandible may be prognathic, the maxilla retrusive, or both; incisors are often edge-to-edge or in crossbite.

## Related terms
- **Overjet**: horizontal incisor overlap.
- **Overbite**: vertical incisor overlap.
- **Open bite**: lack of vertical overlap.
- **Crossbite**: a reversed buccolingual relationship, anterior or posterior.
- **Crowding and spacing**: result from arch length discrepancy.

## Skeletal versus dental
- Angle's system is **dental** only. Skeletal discrepancies are assessed on a cephalometric radiograph using measures like ANB.
- Class II skeletal pattern: ANB greater than normal; Class III: ANB smaller or negative.

## Clinical relevance
- Treatment planning depends on the underlying cause: growth modification, camouflage or surgery.
- Maxillary first molars normally erupt around age 6, and their position is key to later arch relationships.

**High-yield / exam traps:** Angle uses the maxillary first molar as the reference. Class II division 2 has retroclined central incisors; division 1 has proclined. The Class I molar relationship is not the same as normal occlusion, because incisor and arch problems can exist with a Class I molar.`, 5),
  note("dental-anatomy", DA_TD, "Odontogenesis", "Stages of Tooth Development and Hard-Tissue Formation",
    "Bud to maturation: what happens at each stage and which cells do the work.",
`# Odontogenesis

## Initiation
- Oral epithelium thickens into the **dental lamina** at about 6 weeks of embryonic life.
- Inductive signals pass between **oral ectoderm** and underlying **neural crest-derived ectomesenchyme**.

## Stages
1. **Bud stage**: epithelial buds grow into ectomesenchyme.
2. **Cap stage**: enamel organ forms with outer and inner enamel epithelium; dental papilla and dental follicle appear. The **enamel knot** acts as a signaling center for cusp patterning.
3. **Bell stage**: **histodifferentiation** and **morphodifferentiation**; four layers of the enamel organ (outer enamel epithelium, stellate reticulum, stratum intermedium, inner enamel epithelium).
4. **Apposition**: secretion of enamel and dentin matrix.
5. **Maturation**: mineralization and enamel maturation.

## Cells and tissues
- **Ameloblasts** (from inner enamel epithelium) form enamel; they are lost at eruption.
- **Odontoblasts** (from dental papilla) form dentin and persist for life with their processes in dentinal tubules.
- **Dental papilla** becomes pulp; **dental follicle** gives rise to cementum, PDL and alveolar bone lining.
- **Hertwig epithelial root sheath** shapes the root and induces radicular dentin. Remnants persist as rests of Malassez.

## Order of events
Dentin forms first, then enamel. Mantle dentin induces ameloblast secretion.

## Eruption
- Primary teeth begin to erupt at about 6 months; the primary dentition is complete near 2.5 to 3 years.
- Permanent first molars and incisors erupt at about 6 to 7 years.
- Succedaneous teeth derive from the **successional lamina**; permanent molars derive from distal extension of the dental lamina.

## Developmental anomalies
- **Number**: hypodontia, oligodontia, anodontia, supernumerary teeth.
- **Size**: microdontia, macrodontia.
- **Shape**: gemination, fusion, concrescence, dens invaginatus, taurodontism.
- **Structure**: amelogenesis imperfecta, dentinogenesis imperfecta, enamel hypoplasia.

**High-yield / exam traps:** Enamel arises from ectoderm; dentin, pulp and cementum from ectomesenchyme. Ameloblasts are lost at eruption, so enamel cannot regenerate. Crown shape is set during the bell stage, not the cap stage.`, 6),
  note("dental-anatomy", DA_HN, "Salivary glands", "Salivary Glands: Anatomy, Innervation and Clinical Correlations",
    "Location, ducts, secretory type and nerve supply of the major salivary glands.",
`# Salivary Glands

## Major glands
| Gland | Secretion | Duct opens | Parasympathetic |
|---|---|---|---|
| Parotid | Purely serous | Opposite maxillary second molar (Stensen duct) | CN IX via otic ganglion |
| Submandibular | Mixed, mostly serous | Sublingual caruncle (Wharton duct) | CN VII via chorda tympani and submandibular ganglion |
| Sublingual | Mixed, mostly mucous | Multiple ducts on the sublingual fold | CN VII via chorda tympani |

## Flow contribution
- Unstimulated saliva: about two-thirds from the submandibular gland.
- Stimulated saliva: the parotid contributes the largest share.

## Minor salivary glands
- Hundreds of glands in the lips, cheeks, palate and tongue (not in the anterior gingiva or the anterior hard palate midline).
- Mostly mucous; the **von Ebner glands** around circumvallate papillae are serous.

## Autonomic control
- **Parasympathetic**: copious watery saliva.
- **Sympathetic**: small volume of viscous saliva (superior cervical ganglion).
- Anticholinergic drugs cause **xerostomia**.

## Functions of saliva
- Lubrication, buffering (bicarbonate), remineralization (calcium, phosphate), antimicrobial action (lysozyme, lactoferrin, IgA) and digestion (amylase).

## Clinical correlations
- **Sialolithiasis**: stones, most often in the submandibular duct; swelling and pain at meals.
- **Mucocele**: mucous retention or extravasation phenomenon, commonly on the lower lip.
- **Ranula**: large mucocele of the floor of mouth.
- **Mumps**: viral parotitis.
- **Sjogren syndrome**: autoimmune xerostomia and dry eyes.
- **Pleomorphic adenoma**: most common tumor, usually parotid.

**High-yield / exam traps:** The facial nerve passes through the parotid gland but does not innervate it; parotid secretomotor fibers come from the glossopharyngeal nerve. The sublingual and submandibular glands receive CN VII fibers via the chorda tympani.`, 6),
  note("dental-anatomy", DA_TM, "Maxillary molars", "Permanent Molar Morphology: Maxillary vs Mandibular",
    "Cusps, ridges, grooves and roots of permanent molars side by side.",
`# Permanent Molar Morphology

## Maxillary first molar
- **Four major cusps**: mesiobuccal, distobuccal, mesiolingual (largest) and distolingual (smallest).
- **Cusp of Carabelli**: an accessory cusp on the mesiolingual cusp's lingual surface.
- **Oblique ridge**: connects the distobuccal and mesiolingual cusps.
- **Three roots**: mesiobuccal, distobuccal and palatal, with the palatal root the longest and most divergent.
- The mesiobuccal root often has a second canal (MB2).
- Tooth is rhomboidal in occlusal outline.

## Maxillary second molar
- Similar to the first but smaller, with roots closer together and a less prominent or absent distolingual cusp.

## Mandibular first molar
- **Five cusps**: mesiobuccal, distobuccal, distal, mesiolingual and distolingual.
- Buccal groove separates mesiobuccal and distobuccal cusps; lingual groove separates the lingual cusps.
- **Two roots**: mesial and distal; typically two canals in the mesial root.
- First permanent tooth to erupt in many children at about age 6.

## Mandibular second molar
- Usually **four cusps** with a cross-shaped groove pattern.
- Two roots, often closer together; sometimes fused.

## Third molars
- Highly variable in size, shape and root form; often impacted or absent.

## Supporting cusp review
- Maxillary: palatal cusps support. Mandibular: buccal cusps support.

## Comparison tips
| Feature | Maxillary 1st molar | Mandibular 1st molar |
|---|---|---|
| Cusps | 4 (plus Carabelli) | 5 |
| Roots | 3 | 2 |
| Occlusal outline | Rhomboid | Pentagonal |
| Characteristic feature | Oblique ridge | Y or cross groove pattern |

**High-yield / exam traps:** The largest cusp on the maxillary first molar is the mesiolingual cusp. The largest tooth by crown volume is the maxillary first molar. A fifth cusp on a mandibular molar is the distal cusp, and a fifth cusp on a maxillary molar is the cusp of Carabelli.`, 6, "guide"),
];

const fcDa = (cat: string) => fc("dental-anatomy", cat);
export const DENTAL_ANATOMY_FLASHCARDS: SeedFlashcard[] = [
  fcDa(DA_TM)("Tooth numbering", "Universal number for the mandibular left third molar?", "17."),
  fcDa(DA_TM)("Tooth numbering", "Which tooth is FDI 46?", "Mandibular right first molar."),
  fcDa(DA_TM)("Maxillary molars", "Which ridge is characteristic of maxillary molars?", "The oblique ridge, joining the mesiolingual and distobuccal cusps."),
  fcDa(DA_TM)("Maxillary molars", "How many roots does the maxillary first molar have?", "Three: mesiobuccal, distobuccal and palatal."),
  fcDa(DA_TM)("Mandibular molars", "Typical cusp count of mandibular first and second molars?", "Five on the first molar and four on the second molar."),
  fcDa(DA_TM)("Canines", "Which tooth has the longest root?", "The maxillary canine."),
  fcDa(DA_TM)("Developmental features", "What are mamelons?", "Three developmental lobe bumps on the incisal edge of newly erupted incisors."),
  fcDa(DA_OC)("Angle classification", "Class I Angle molar relationship?", "Maxillary first molar mesiobuccal cusp in the buccal groove of the mandibular first molar."),
  fcDa(DA_OC)("Angle classification", "Class II division 1 versus 2?", "Division 1: proclined maxillary incisors with large overjet. Division 2: retroclined central incisors."),
  fcDa(DA_OC)("Cusp function", "Supporting cusps of posterior teeth?", "Maxillary palatal and mandibular buccal cusps."),
  fcDa(DA_OC)("Compensating curves", "Curve of Wilson?", "Mediolateral curve of the occlusal plane seen in the frontal view."),
  fcDa(DA_OC)("Embrasures", "What fills the gingival embrasure?", "The interdental papilla."),
  fcDa(DA_TD)("Odontogenesis", "Which stage establishes crown shape?", "Bell stage (morphodifferentiation)."),
  fcDa(DA_TD)("Root development", "Role of Hertwig epithelial root sheath?", "Shapes the root and induces radicular dentin formation."),
  fcDa(DA_TD)("Eruption", "Approximate eruption age of permanent first molars?", "About 6 years."),
  fcDa(DA_TD)("Dental lamina", "Origin of permanent molars?", "Distal extension of the dental lamina; they have no primary predecessors."),
  fcDa(DA_HN)("Salivary glands", "Which gland contributes most unstimulated saliva?", "The submandibular gland."),
  fcDa(DA_HN)("Salivary glands", "Parasympathetic supply of the parotid gland?", "Glossopharyngeal nerve via the otic ganglion."),
  fcDa(DA_HN)("Palatal innervation", "Which nerve supplies the anterior palate from canine to canine?", "The nasopalatine nerve."),
  fcDa(DA_HN)("Venous drainage", "Why is the danger triangle of the face clinically important?", "Facial vein connections can carry infection to the cavernous sinus."),
];

/* ================================================================== */
/* Dental Sciences                                                     */
/* ================================================================== */
const DS_OP = "Oral Pathology";
const DS_PE = "Periodontics";
const DS_EN = "Endodontics";
const DS_PR = "Prosthodontics";
const DS_DM = "Dental Materials";
const dsc = maker("dental-sciences");

export const DENTAL_SCIENCES_QUESTIONS: SeedQuestion[] = [
  dsc.mc(DS_OP, "Odontogenic keratocyst", "moderate", "Which statement about the odontogenic keratocyst (keratocystic odontogenic tumor) is correct?", [
    ["It has a lower recurrence rate than most other odontogenic cysts", "OKCs have a notably higher recurrence rate."],
    ["It is lined by parakeratinized epithelium and tends to recur after simple enucleation", "The thin parakeratinized lining with a corrugated surface and satellite cysts contributes to recurrence."],
    ["It always contains an unerupted tooth crown", "That describes the dentigerous cyst."],
    ["It is exclusively found in the maxilla", "It most often occurs in the posterior mandible."],
  ], "b", "OKC has a characteristic parakeratinized lining and growth that tends to spread along marrow spaces. Multiple OKCs suggest basal cell nevus (Gorlin) syndrome, which involves PTCH1 mutation.", "OKC: parakeratin, high recurrence, Gorlin association.", ["cysts", "odontogenic"]),
  dsc.mc(DS_OP, "Ameloblastoma", "moderate", "A multilocular 'soap bubble' radiolucency in the posterior mandible of a young adult, causing slow painless expansion, is most consistent with:", [
    ["Ameloblastoma", "Ameloblastoma is a benign but locally aggressive odontogenic tumor with a multilocular appearance."],
    ["Periapical cyst", "A periapical cyst is a small, round radiolucency at the apex of a nonvital tooth."],
    ["Osteomyelitis", "Osteomyelitis presents with pain, sequestra and a moth-eaten pattern."],
    ["Torus mandibularis", "A torus is a bony exostosis, radiopaque."],
  ], "a", "Ameloblastoma commonly arises in the posterior mandible and causes painless expansion. Treatment is surgical with adequate margins because simple curettage has high recurrence.", "Soap-bubble multilocular radiolucency in the mandible suggests ameloblastoma.", ["tumors", "odontogenic"]),
  dsc.mc(DS_OP, "Dentigerous cyst", "moderate", "A unilocular radiolucency surrounds the crown of an unerupted mandibular third molar and attaches at the cementoenamel junction. What is the most likely diagnosis?", [
    ["Dentigerous cyst", "A dentigerous cyst develops from the reduced enamel epithelium around an unerupted crown."],
    ["Radicular cyst", "Radicular cysts are associated with a nonvital erupted tooth."],
    ["Lateral periodontal cyst", "This occurs along the lateral root surface of a vital tooth."],
    ["Nasopalatine duct cyst", "This is located in the anterior maxillary midline."],
  ], "a", "The dentigerous cyst is the most common developmental odontogenic cyst. It attaches at the CEJ and is most associated with mandibular third molars and maxillary canines.", "Dentigerous cyst: radiolucency around an unerupted crown.", ["cysts", "odontogenic"]),
  dsc.mc(DS_OP, "Inflammatory cysts", "easy", "The epithelial lining of a radicular (periapical) cyst is derived from:", [
    ["Rests of Malassez", "Proliferation of these epithelial remnants in the PDL, stimulated by inflammation, forms the lining."],
    ["Rests of Serres only in the gingiva", "Rests of Serres are dental lamina remnants and give rise to other lesions."],
    ["Reduced enamel epithelium", "This gives rise to dentigerous cysts."],
    ["Salivary gland acini", "Not a source of odontogenic cysts."],
  ], "a", "Radicular cysts follow pulp necrosis and periapical inflammation, which stimulate the rests of Malassez. They are the most common jaw cyst.", "Radicular cyst: inflammatory, from rests of Malassez.", ["cysts"]),
  dsc.mc(DS_OP, "Mucosal diseases", "moderate", "Bilateral white lacy striations on the buccal mucosa with an immune pathogenesis involving T lymphocytes are classic for:", [
    ["Lichen planus", "Reticular lichen planus shows Wickham striae and a band-like T-cell infiltrate."],
    ["Pemphigus vulgaris", "Pemphigus shows fragile blisters and erosions."],
    ["Candidiasis", "Candidiasis plaques wipe off."],
    ["Frictional keratosis", "This is associated with local trauma and is usually unilateral."],
  ], "a", "Oral lichen planus is a chronic T-cell-mediated disease with reticular, plaque, erosive and atrophic forms. Erosive forms cause pain and require monitoring because of slightly increased cancer risk.", "Lichen planus: Wickham striae, bilateral buccal mucosa, T cells.", ["mucosal disease"]),
  dsc.sata(DS_OP, "Vesiculobullous diseases", "difficult", "Which findings are characteristic of pemphigus vulgaris? Select all that apply.", [
    ["Intraepithelial split caused by acantholysis", "Loss of keratinocyte adhesion yields suprabasal clefts."],
    ["Autoantibodies against desmogleins", "Antibodies target desmoglein 3, and 1 in mucocutaneous disease."],
    ["Positive Nikolsky sign", "Lateral pressure causes epithelium to slough."],
    ["Subepithelial split with linear basement membrane IgG", "That describes mucous membrane pemphigoid."],
    ["Intercellular IgG deposition on direct immunofluorescence", "A fishnet pattern of intercellular IgG is characteristic."],
  ], ["a", "b", "c", "e"], "Pemphigus vulgaris is an autoimmune disease affecting desmosomes, with oral lesions often the first sign. Pemphigoid causes subepithelial clefting and linear basement membrane deposits.", "Pemphigus: intraepithelial; pemphigoid: subepithelial.", ["autoimmune", "vesiculobullous"]),

  dsc.mc(DS_PE, "Periodontitis classification", "moderate", "In the 2017 classification of periodontitis, what does 'grade' describe?", [
    ["The extent and severity of attachment loss", "That is the stage."],
    ["The biologic features of the disease, including rate of progression and risk", "Grade (A, B or C) reflects progression rate, risk factors such as smoking and diabetes, and the expected response to therapy."],
    ["The number of teeth with furcation involvement", "Furcation involvement contributes to the stage."],
    ["The type of surgical therapy needed", "Grade is not a treatment prescription."],
  ], "b", "Periodontitis is staged from I to IV according to severity, complexity and extent, and graded A to C according to progression risk. Staging describes the severity and grading describes the biology.", "Stage = how much; Grade = how fast and why.", ["classification"]),
  dsc.mc(DS_PE, "Gingival disease", "easy", "Which statement describes dental plaque-induced gingivitis?", [
    ["Bleeding on probing with no attachment loss, and it is reversible with plaque control", "Gingivitis is limited to the gingiva and resolves after effective biofilm removal."],
    ["Irreversible alveolar bone loss", "Bone loss indicates periodontitis."],
    ["Attachment loss with deep pockets", "That is periodontitis."],
    ["Painful necrosis of the papillae", "That describes necrotizing disease."],
  ], "a", "Gingivitis involves inflammation without loss of attachment. Hormonal changes, medications and systemic conditions can modify its severity, but it resolves when plaque is controlled.", "Gingivitis = reversible, no attachment loss.", ["gingivitis"]),
  dsc.mc(DS_PE, "Clinical measurements", "moderate", "Clinical attachment level is measured from the:", [
    ["Gingival margin to the base of the pocket", "That is the probing depth."],
    ["Cementoenamel junction to the base of the probeable pocket", "CAL is the distance from CEJ to pocket base and reflects true attachment loss."],
    ["Alveolar crest to the root apex", "This is radiographic bone support."],
    ["Mucogingival junction to the gingival margin", "This relates to keratinized tissue width."],
  ], "b", "Probing depth varies with gingival margin position, but CAL uses the CEJ as a fixed landmark. A patient with gingival recession can have shallow pockets but large attachment loss.", "CAL = CEJ to pocket base.", ["probing"]),
  dsc.mc(DS_PE, "Treatment planning", "moderate", "After completion of scaling and root planing, what is the appropriate next step before deciding on periodontal surgery?", [
    ["Immediate osseous surgery on all sites", "Surgery is considered only for sites that persist after reevaluation."],
    ["Reevaluation after tissue healing to reassess probing depths and bleeding", "Reevaluation guides whether further therapy is needed."],
    ["Extraction of all teeth with pockets", "Not indicated."],
    ["Discontinue maintenance", "Periodontal maintenance is lifelong."],
  ], "b", "Nonsurgical therapy is followed by reevaluation of inflammation, pocket depth and plaque control. Residual pockets of 5 mm or more with bleeding may need further treatment, and patients enter a supportive periodontal maintenance program.", "Reevaluate before escalating to surgery.", ["periodontal therapy"]),
  dsc.mc(DS_PE, "Furcation involvement", "moderate", "In the Glickman classification, a Class II furcation defect is best described as:", [
    ["Incipient involvement with a slight pocket and no bone change", "That is Class I."],
    ["Bone loss entering the furcation but not through-and-through", "Class II is a cul-de-sac with partial horizontal bone loss."],
    ["Through-and-through bone loss covered by gingiva", "That is Class III."],
    ["Through-and-through bone loss with visible furcation", "That is Class IV."],
  ], "b", "Glickman Class II has horizontal bone destruction into the furcation without communication to the opposite side. Class III is through-and-through but covered by gingiva, and Class IV is clinically visible.", "Glickman: I incipient, II cul-de-sac, III through-and-through, IV exposed.", ["furcation"]),
  dsc.sata(DS_PE, "Risk factors", "easy", "Which factors increase the risk of periodontitis progression? Select all that apply.", [
    ["Cigarette smoking", "Smoking is a major modifiable risk factor."],
    ["Poorly controlled diabetes mellitus", "Hyperglycemia worsens periodontal outcomes."],
    ["Persistent plaque and calculus accumulation", "Biofilm is the primary etiology."],
    ["Daily use of fluoride toothpaste", "Fluoride protects against caries and is not a risk factor."],
    ["Brushing twice daily with proper technique", "Good plaque control reduces risk."],
  ], ["a", "b", "c"], "Smoking, hyperglycemia and unremoved plaque all promote periodontal breakdown. Control of risk factors is part of therapy.", "Smoking and diabetes modify periodontitis grade.", ["risk factors"]),

  dsc.mc(DS_EN, "Irrigation", "easy", "Why is sodium hypochlorite the preferred primary root canal irrigant?", [
    ["It dissolves organic tissue and has strong antimicrobial activity", "NaOCl dissolves pulp tissue and disinfects the canal system."],
    ["It removes the inorganic portion of the smear layer", "EDTA removes the inorganic smear layer."],
    ["It is completely nontoxic if extruded", "Extrusion beyond the apex can cause severe injury."],
    ["It permanently seals dentinal tubules", "It does not seal tubules."],
  ], "a", "Sodium hypochlorite combines tissue dissolution and bactericidal action, so it is used throughout instrumentation. Care is needed to avoid apical extrusion, which can cause pain, swelling and bruising.", "NaOCl dissolves organics and kills bacteria.", ["irrigation"]),
  dsc.mc(DS_EN, "Irrigation", "moderate", "What is the main purpose of a final rinse with EDTA in endodontic therapy?", [
    ["To dissolve necrotic pulp tissue", "NaOCl handles the organic component."],
    ["To remove the inorganic smear layer by chelating calcium", "EDTA opens dentinal tubules so irrigants and sealers penetrate."],
    ["To neutralize hypochlorite toxicity", "Not its purpose."],
    ["To harden the dentin walls", "EDTA softens dentin."],
  ], "b", "The smear layer produced by instrumentation includes inorganic debris that NaOCl cannot dissolve. EDTA chelates calcium and removes it.", "NaOCl for organics, EDTA for inorganics.", ["irrigation"]),
  dsc.mc(DS_EN, "Irrigation", "moderate", "Mixing sodium hypochlorite with chlorhexidine in the root canal produces:", [
    ["A clear, stable solution with improved effect", "No, it does not."],
    ["An orange-brown precipitate that can stain dentin and interfere with sealing", "The precipitate contains products such as para-chloroaniline, so the canal should be flushed with saline or alcohol between them."],
    ["A harmless gas", "Not the expected result."],
    ["Nothing; they are chemically inert", "They react."],
  ], "b", "NaOCl and chlorhexidine react to form a precipitate. Intermediate flushing with saline or another neutral irrigant helps avoid this issue.", "Never mix NaOCl and chlorhexidine in the canal.", ["irrigation"]),
  dsc.mc(DS_EN, "Instrumentation", "moderate", "Where is the working length of a root canal traditionally set relative to the radiographic apex?", [
    ["About 0.5 to 1 mm short of the radiographic apex, at or near the apical constriction", "This keeps instrumentation and obturation within the canal and minimizes overextension."],
    ["2 to 3 mm beyond the apex", "Overinstrumentation damages periapical tissue."],
    ["At the cementoenamel junction", "This would be far too short."],
    ["At the apical foramen exactly", "The constriction is slightly coronal to the foramen."],
  ], "a", "The apical constriction is the narrowest part of the canal, generally 0.5 to 1 mm from the radiographic apex. Electronic apex locators and radiographs are used together.", "Working length ends near the apical constriction.", ["working length"]),
  dsc.mc(DS_EN, "Canal anatomy", "moderate", "Which canal is most frequently missed in maxillary first molars?", [
    ["Distobuccal canal", "Usually found easily."],
    ["Palatal canal", "The palatal canal is large and easy to locate."],
    ["Second mesiobuccal canal (MB2)", "MB2 lies palatal to the MB1 canal and is commonly missed, leading to persistent disease."],
    ["Distolingual canal", "This is not part of maxillary first molar anatomy."],
  ], "c", "A high percentage of maxillary first molars have an MB2 canal. Magnification and troughing of the dentin ridge help locate it.", "Always search for MB2 in maxillary first molars.", ["canal anatomy"]),
  dsc.mc(DS_EN, "Pediatric endodontics", "moderate", "Which situation best indicates a pulpotomy in a primary molar?", [
    ["A vital primary molar with carious exposure and no signs of irreversible pulpitis or necrosis", "Radicular pulp remains healthy and is preserved."],
    ["A molar with a draining sinus tract and furcation radiolucency", "These signs indicate necrosis; pulpectomy or extraction is needed."],
    ["A molar with spontaneous severe pain and swelling", "This suggests irreversible pulpitis or abscess."],
    ["A tooth with an internal resorption into the furcation", "This indicates pulpal degeneration and warrants extraction or pulpectomy."],
  ], "a", "Pulpotomy removes the coronal pulp and preserves the vital radicular pulp. Agents such as MTA or ferric sulfate are used, followed by a stainless steel crown.", "Pulpotomy requires vital radicular pulp.", ["pediatric", "pulp therapy"]),

  dsc.mc(DS_PR, "Removable partial dentures", "easy", "A Kennedy Class I partial denture describes:", [
    ["A unilateral edentulous area posterior to remaining teeth", "That is Class II."],
    ["A bilateral edentulous area posterior to the remaining natural teeth", "Class I has bilateral distal extension edentulous spaces."],
    ["A tooth-bounded edentulous space", "That is Class III."],
    ["An anterior edentulous area crossing the midline", "That is Class IV."],
  ], "b", "Kennedy classification organizes partial edentulism: Class I bilateral posterior, Class II unilateral posterior, Class III bounded saddle, Class IV anterior crossing midline.", "Kennedy I = bilateral free-end.", ["Kennedy"]),
  dsc.mc(DS_PR, "Removable partial dentures", "moderate", "What is the function of an indirect retainer in a distal extension removable partial denture?", [
    ["To resist rotation of the denture base away from the tissue when sticky food is pulled", "Indirect retainers resist rotation about the fulcrum line toward the lift of the distal base."],
    ["To replace missing teeth", "Not its function."],
    ["To connect right and left sides of the denture", "That is the major connector."],
    ["To provide primary retention against vertical displacement", "Direct retainers (clasps) do this."],
  ], "a", "In distal extension cases the base can lift when forces act away from the tissues. The indirect retainer, placed anteriorly from the fulcrum line, resists this rotational movement.", "Indirect retainer: resists rotation of the free-end base.", ["RPD design"]),
  dsc.mc(DS_PR, "Complete dentures", "moderate", "Where is the posterior palatal seal of a maxillary complete denture located?", [
    ["At the junction of the hard and soft palate on the soft palate side", "It aids in retention and compensates for acrylic polymerization shrinkage."],
    ["At the incisive papilla", "The papilla is relieved."],
    ["At the labial vestibule", "That is the border seal for the labial flange."],
    ["Over the midpalatine raphe", "The raphe is relieved because of thin mucosa."],
  ], "a", "The posterior palatal seal is a small area of compression in the soft tissues at the vibrating line region, improving retention. Overextension causes gagging.", "Post-dam sits at the posterior border near the vibrating line.", ["complete dentures"]),
  dsc.mc(DS_PR, "Fixed prosthodontics", "difficult", "What is the principal benefit of providing a ferrule when restoring an endodontically treated tooth with a post and crown?", [
    ["It increases the resistance to root fracture by encircling sound tooth structure", "A ferrule of sound dentin (about 1.5 to 2 mm) bands the tooth and distributes stress."],
    ["It increases the retention of the post by itself", "Retention depends on the post length and cement."],
    ["It makes the crown more esthetic", "Not its purpose."],
    ["It reduces the need for obturation", "Not related."],
  ], "a", "A ferrule is a collar of crown metal or ceramic that encircles at least 1.5 to 2 mm of sound tooth structure above the margin. It improves fracture resistance of endodontically treated teeth.", "Ferrule = circumferential sound tooth structure within the crown.", ["post and core"]),
  dsc.mc(DS_PR, "Implants", "moderate", "Which statement best describes osseointegration of a titanium implant?", [
    ["Direct structural and functional connection between living bone and the implant surface", "Osseointegration is direct bone-to-implant contact without intervening soft tissue."],
    ["Attachment of the implant by Sharpey fibers", "Implants do not have a PDL."],
    ["Formation of a fibrous capsule around the implant", "Fibrous encapsulation indicates failure."],
    ["Chemical bonding of the implant to enamel", "Not applicable."],
  ], "a", "Titanium forms an oxide layer that allows bone to grow directly onto the implant. Without a periodontal ligament, implants lack proprioception and cannot move orthodontically in the same way as teeth.", "Implants lack a PDL.", ["implants"]),
  dsc.sata(DS_PR, "Removable partial dentures", "moderate", "Which are components of a removable partial denture? Select all that apply.", [
    ["Occlusal rest", "A rest provides vertical support."],
    ["Major connector", "It unites the components."],
    ["Direct retainer", "Clasps provide retention."],
    ["Pontic", "Pontics are part of fixed partial dentures."],
    ["Maryland retainer wing", "This is a resin-bonded bridge component."],
  ], ["a", "b", "c"], "RPD components include the major connector, minor connectors, rests, direct and indirect retainers, and denture bases with teeth. Pontics and retainer wings belong to fixed prostheses.", "RPD parts: rest, connector, retainer, base.", ["RPD design"]),

  dsc.mc(DS_DM, "Glass ionomer cement", "easy", "Which property makes glass ionomer cement useful for cervical restorations in caries-prone patients?", [
    ["Chemical adhesion to tooth structure and fluoride release", "GIC bonds to enamel and dentin and releases and recharges fluoride."],
    ["Higher wear resistance than amalgam", "GIC has relatively poor wear resistance."],
    ["No sensitivity to moisture early in setting", "GIC is moisture sensitive early on."],
    ["Excellent translucency matching composite", "Esthetics are inferior to composite."],
  ], "a", "GIC bonds chemically to tooth structure and acts as a fluoride reservoir. Its limited strength and wear resistance restrict it to low-stress areas.", "GIC: chemical bond plus fluoride release.", ["restorative materials"]),
  dsc.mc(DS_DM, "Amalgam", "moderate", "Why are high-copper amalgams more corrosion resistant than conventional low-copper amalgams?", [
    ["They eliminate the tin-mercury gamma-2 phase", "Copper reacts with tin to form copper-tin phases instead of gamma-2, the most corrosion-prone phase."],
    ["They contain no mercury", "Amalgam always contains mercury."],
    ["They set without a reaction", "Setting still requires amalgamation."],
    ["They contain gold", "Not a defining feature."],
  ], "a", "Conventional amalgam forms the weak gamma-2 phase (Sn-Hg), which corrodes and reduces strength. High-copper alloys convert it to Cu6Sn5 and improve long-term performance.", "High-copper amalgam avoids the gamma-2 phase.", ["amalgam"]),
  dsc.mc(DS_DM, "Composite resin", "moderate", "Which compound is the most common photoinitiator in light-cured dental composites?", [
    ["Camphorquinone", "Camphorquinone is activated by blue light near 470 nm."],
    ["Benzoyl peroxide", "This is a chemical initiator."],
    ["Tertiary amine alone", "Amines act as co-initiators."],
    ["Hydroquinone", "This is an inhibitor to extend shelf life."],
  ], "a", "Camphorquinone absorbs blue light near 470 nm and, with an amine co-initiator, produces free radicals that start polymerization. Matching the curing light wavelength to the photoinitiator is essential.", "Camphorquinone plus blue light starts the cure.", ["composite"]),
  dsc.mc(DS_DM, "Impression materials", "moderate", "Why should alginate impressions be poured soon after removal from the mouth?", [
    ["Alginate loses dimensional accuracy through syneresis and imbibition", "Water loss or uptake distorts the impression."],
    ["Alginate hardens permanently in air", "It does not harden further."],
    ["The gypsum reacts chemically with alginate at once", "Pouring promptly is about dimensional stability."],
    ["Alginate becomes radioactive", "Nonsense."],
  ], "a", "Irreversible hydrocolloid is a water-rich gel. Syneresis (water loss) and imbibition (water uptake) alter its dimensions, so it should be disinfected, wrapped in a moist towel if needed and poured quickly.", "Alginate: pour promptly to limit syneresis and imbibition.", ["impressions"]),
  dsc.mc(DS_DM, "Gypsum products", "moderate", "Why does dental stone (alpha-hemihydrate) produce stronger casts than plaster (beta-hemihydrate)?", [
    ["Its denser, more regular particles need less water to make a workable mix", "Lower water-powder ratio leaves less porosity after setting."],
    ["It contains no calcium", "Both are calcium sulfate products."],
    ["It sets by polymerization", "Gypsum sets by crystallization."],
    ["It expands to a greater degree in all cases", "Expansion varies."],
  ], "a", "Alpha-hemihydrate crystals are denser and less porous, so the mix requires less water. Excess water not needed for the reaction leaves voids that reduce strength.", "Less water means stronger gypsum.", ["gypsum"]),
  dsc.mc(DS_DM, "Dental cements", "easy", "Why should eugenol-containing materials be avoided under resin composite restorations?", [
    ["Eugenol inhibits resin polymerization", "Eugenol is a free-radical scavenger."],
    ["Eugenol increases bond strength", "It does the opposite."],
    ["Eugenol is highly radiopaque", "Not the reason."],
    ["Eugenol is cariogenic", "It is not."],
  ], "a", "Zinc oxide-eugenol is soothing to the pulp but interferes with setting of resin. Calcium hydroxide or glass ionomer liners are better under composite.", "No eugenol under resin.", ["cements"]),
];

export const DENTAL_SCIENCES_MATERIALS: SeedMaterial[] = [
  note("dental-sciences", DS_OP, "Odontogenic keratocyst", "Odontogenic Cysts and Tumors: Pattern Recognition",
    "Radiographic and histologic clues that separate common jaw cysts and tumors.",
`# Odontogenic Cysts and Tumors

## Inflammatory cyst
- **Radicular (periapical) cyst**: from rests of Malassez after pulp necrosis; round radiolucency at the apex of a nonvital tooth; most common jaw cyst.

## Developmental cysts
- **Dentigerous cyst**: radiolucency around the crown of an unerupted tooth (mandibular third molars and maxillary canines); attaches at the CEJ.
- **Odontogenic keratocyst (OKC)**: parakeratinized lining, posterior mandible, tendency to recur; multiple OKCs suggest **Gorlin syndrome** (also basal cell carcinomas, bifid ribs, PTCH1 mutation).
- **Lateral periodontal cyst**: along the lateral root of a vital tooth, often mandibular premolar region.
- **Nasopalatine duct cyst**: heart-shaped radiolucency in the anterior maxillary midline.
- **Glandular odontogenic cyst**: rare, aggressive appearing.

## Benign tumors
- **Ameloblastoma**: multilocular "soap bubble" in the posterior mandible; locally aggressive; treated with surgical resection.
- **Adenomatoid odontogenic tumor**: anterior maxilla in young females, often around an unerupted canine.
- **Odontoma**: most common odontogenic tumor; compound (tooth-like structures) or complex (disorganized mass).
- **Odontogenic myxoma**: multilocular "tennis racket" pattern.
- **Calcifying epithelial odontogenic (Pindborg) tumor**: radiopaque flecks near the crown.

## Malignant counterparts
- Ameloblastic carcinoma and primary intraosseous carcinoma are rare.

## Workup logic
1. Identify radiographic features: unilocular versus multilocular, border, relationship to teeth.
2. Check tooth vitality and age.
3. Biopsy before definitive treatment.
4. Match treatment to behavior: enucleation for most cysts; resection or peripheral ostectomy for aggressive lesions.

**High-yield / exam traps:** Tooth vital with radiolucency suggests nonodontogenic or developmental lesions. Multiple OKCs equal Gorlin syndrome until proven otherwise. Odontoma is the most common odontogenic tumor, while ameloblastoma is the most common clinically significant one.`, 6),
  note("dental-sciences", DS_PE, "Periodontitis classification", "Periodontal Diagnosis: Staging, Grading and Clinical Measures",
    "How to apply the 2017 classification and read probing data correctly.",
`# Periodontal Diagnosis

## Health and gingival conditions
- **Periodontal health**: no bleeding on probing, no attachment loss.
- **Gingivitis**: inflammation limited to the gingiva with bleeding on probing; reversible.
- Gingivitis may be modified by hormones, medications and systemic conditions.

## Periodontitis
- Defined by **clinical attachment loss** at two or more nonadjacent teeth, or buccal/lingual CAL of 3 mm or more with pocketing.
- **Stage (I to IV)** reflects severity, complexity (furcation, tooth loss, defects) and extent.
- **Grade (A to C)** reflects the rate of progression, risk factors (smoking, diabetes) and expected treatment response.
- **Necrotizing periodontal diseases** and **periodontitis as a manifestation of systemic disease** are separate categories.

## Measurements
- **Probing depth (PD)**: gingival margin to pocket base.
- **Clinical attachment level (CAL)**: CEJ to pocket base.
- **Recession**: CEJ to gingival margin; CAL = PD + recession.
- **Bleeding on probing**: an indicator of inflammation.
- **Mobility** (Miller classification) and **furcation involvement** (Glickman) guide prognosis.

## Treatment sequence
1. **Phase I**: oral hygiene, scaling and root planing, risk-factor control.
2. **Reevaluation**.
3. **Phase II**: surgical therapy for persistent pockets.
4. **Phase III**: restorative or implant therapy.
5. **Maintenance**: regular supportive periodontal therapy.

## Systemic links
- Diabetes and periodontitis worsen each other.
- Smoking impairs healing and masks bleeding.
- Periodontal inflammation is associated with cardiovascular risk, though causation is not proven.

## Adjuncts
- Systemic antibiotics are not routine; they are considered for aggressive disease patterns or special conditions.
- Local delivery agents may be used at residual sites.

**High-yield / exam traps:** Grade A, B and C describe risk and progression, not severity. A smoker has masked bleeding, so lack of bleeding does not rule out disease. CAL uses the CEJ and is the true measure of attachment loss.`, 6),
  note("dental-sciences", DS_EN, "Irrigation", "Root Canal Irrigants: Roles, Combinations and Risks",
    "What each irrigant does and how to avoid harmful interactions or accidents.",
`# Endodontic Irrigation

Cleaning and disinfection depend heavily on chemistry, because instruments cannot reach every canal recess.

## Sodium hypochlorite (NaOCl)
- **Dissolves organic tissue** and has broad antimicrobial action.
- Typically used in concentrations from about 1% to 6%; higher concentration dissolves tissue faster but is more toxic.
- Warming and agitation increase effectiveness.
- **Hypochlorite accident**: extrusion beyond the apex causes sudden pain, swelling and ecchymosis; manage with reassurance, analgesics, possibly antibiotics, and close follow-up.
- Bleaches clothing and irritates tissue; use rubber dam isolation.

## EDTA
- **Chelates calcium** and removes the inorganic portion of the smear layer.
- Use 1 to 2 minutes at the end, not for prolonged contact, to avoid erosion of dentin.

## Chlorhexidine
- Cationic antimicrobial with substantivity.
- **Does not dissolve tissue**; not a replacement for NaOCl.
- **Do not mix with NaOCl**: an orange-brown precipitate forms.

## Other agents
- **Saline**: safe flush between irrigants.
- **Hydrogen peroxide**: little added value and risk of emphysema.
- **Calcium hydroxide**: intracanal medicament between visits, effective against many bacteria.
- **Ultrasonic activation** improves debris removal.

## Delivery safety
- Use a side-vented needle, keep it short of binding, avoid pressure.
- Maintain a patent apical foramen where possible, but do not force irrigant past the apex.

## Typical sequence
1. NaOCl throughout instrumentation.
2. Saline flush if chlorhexidine will be used.
3. EDTA rinse at the end.
4. Final NaOCl rinse and drying with paper points.

**High-yield / exam traps:** NaOCl handles organics, EDTA handles inorganics. Mixing NaOCl and chlorhexidine forms a precipitate. Irrigant extrusion causes immediate pain and swelling, which is not the same as flare-up from infection.`, 6),
  note("dental-sciences", DS_PR, "Removable partial dentures", "Removable Partial Denture Design Principles",
    "Kennedy classes, components and the logic of support, retention and stability.",
`# Removable Partial Denture (RPD) Design

## Kennedy classification
- **Class I**: bilateral edentulous areas posterior to remaining teeth.
- **Class II**: unilateral edentulous area posterior to remaining teeth.
- **Class III**: edentulous area bounded by teeth anteriorly and posteriorly.
- **Class IV**: single anterior edentulous area crossing the midline.
- **Modifications**: additional edentulous areas other than the main one (except Class IV).
- Applegate's rules govern classification when a third molar is not replaced or when teeth are missing.

## Components
- **Major connector**: maxillary palatal strap or plate; mandibular lingual bar or lingual plate.
- **Minor connectors** link components to the major connector.
- **Rests**: provide vertical support, placed in rest seats prepared on abutment teeth.
- **Direct retainers**: clasps (circumferential or bar type) resisting displacement.
- **Indirect retainers**: resist rotation of distal extension bases.
- **Denture base and artificial teeth** restore function and esthetics.

## Support, retention and stability
- **Support** from teeth and mucosa; tooth-supported RPDs rely on rests, while distal extensions rely on the residual ridge.
- **Retention** from clasp arms engaging undercuts.
- **Stability and bracing** from reciprocal arms and minor connectors.

## Design principles for distal extensions
- Distal extension bases move under load; use **stress-releasing** clasp designs (RPI or bar clasp).
- Maximize coverage of the supporting ridge.
- Use a functional impression to record supporting tissues in function when needed.

## Clinical considerations
- Plan abutment tooth modifications before the impression: rest seats, guide planes and contouring.
- Survey the cast to determine the path of insertion.
- Instruct patients about hygiene, nighttime removal and regular recall.

**High-yield / exam traps:** Kennedy Class I is bilateral distal extension. Tooth-borne rests are for vertical support, while clasps are for retention. A Class III RPD is entirely tooth-supported.`, 6),
  note("dental-sciences", DS_DM, "Glass ionomer cement", "Restorative Dental Materials: Properties and Selection",
    "Compare amalgam, composite and glass ionomer for common clinical situations.",
`# Restorative Dental Materials

## Amalgam
- Mixture of silver-tin-copper alloy powder with mercury.
- **High-copper** alloys avoid the corrosion-prone gamma-2 phase.
- Strengths: durable, forgiving of moisture, lower cost.
- Limitations: no adhesion to tooth, esthetics, concern about mercury handling; requires mechanical retention.

## Composite resin
- Components: **resin matrix** (Bis-GMA, UDMA), **filler particles** (silica, glass), **silane coupling agent**, **initiator system** (camphorquinone with amine).
- Properties: esthetic, bonded to enamel and dentin, but undergoes **polymerization shrinkage**.
- Technique: isolate, etch and bond, place in increments, cure with adequate light intensity and time.
- Fillers improve strength, reduce shrinkage and thermal expansion.

## Glass ionomer cement (GIC)
- Powder (fluoroaluminosilicate glass) plus polyalkenoic acid.
- **Chemical adhesion** to enamel and dentin; **fluoride release and recharge**.
- Low wear resistance and brittleness limit use to low-stress areas, root caries and temporary or atraumatic restorations.
- **Resin-modified GIC** has better strength and lighter setting with moisture tolerance.

## Impression materials and models
- **Alginate**: irreversible hydrocolloid; pour quickly because of syneresis and imbibition.
- **Polyvinyl siloxane**: elastomeric, excellent accuracy and dimensional stability.
- **Gypsum**: plaster, stone and improved stone differ in water-powder ratio and strength.

## Cements
- **Zinc phosphate**: classic luting cement, acidic during setting.
- **Zinc oxide-eugenol**: sedative, used for temporary restorations; interferes with resin.
- **Glass ionomer and resin cements**: modern luting options.

## Biocompatibility notes
- Etching and deep dentin require protection of the pulp.
- Matching material to stress, moisture control and esthetics guides choice.

**High-yield / exam traps:** Eugenol inhibits resin. GIC bonds chemically, composite bonds micromechanically. Polymerization shrinkage drives incremental technique. Alginate is pour-immediately; PVS is stable for days.`, 6),
];

const fcDs = (cat: string) => fc("dental-sciences", cat);
export const DENTAL_SCIENCES_FLASHCARDS: SeedFlashcard[] = [
  fcDs(DS_OP)("Odontogenic keratocyst", "Which syndrome is linked to multiple OKCs?", "Gorlin (basal cell nevus) syndrome, with PTCH1 mutation."),
  fcDs(DS_OP)("Ameloblastoma", "Classic radiograph of ameloblastoma?", "Multilocular 'soap bubble' radiolucency in the posterior mandible."),
  fcDs(DS_OP)("Dentigerous cyst", "Where does a dentigerous cyst attach?", "At the cementoenamel junction of an unerupted tooth."),
  fcDs(DS_OP)("Mucosal diseases", "Hallmark of oral lichen planus?", "Bilateral Wickham striae on the buccal mucosa with T-cell infiltrate."),
  fcDs(DS_OP)("Vesiculobullous diseases", "Level of split in pemphigus versus pemphigoid?", "Pemphigus: intraepithelial (suprabasal). Pemphigoid: subepithelial."),
  fcDs(DS_PE)("Periodontitis classification", "What do stage and grade mean in periodontitis?", "Stage is severity, complexity and extent; grade is rate of progression and risk."),
  fcDs(DS_PE)("Clinical measurements", "Clinical attachment level reference point?", "Cementoenamel junction to the base of the pocket."),
  fcDs(DS_PE)("Furcation involvement", "Glickman Class III furcation?", "Through-and-through bone loss covered by gingiva."),
  fcDs(DS_PE)("Gingival disease", "Is plaque-induced gingivitis reversible?", "Yes, with effective plaque control; there is no attachment loss."),
  fcDs(DS_EN)("Irrigation", "Role of sodium hypochlorite?", "Dissolves organic tissue and kills bacteria."),
  fcDs(DS_EN)("Irrigation", "Role of EDTA?", "Chelates calcium to remove the inorganic smear layer."),
  fcDs(DS_EN)("Irrigation", "What forms when NaOCl and chlorhexidine mix?", "An orange-brown precipitate."),
  fcDs(DS_EN)("Canal anatomy", "Most commonly missed canal in maxillary first molars?", "The second mesiobuccal canal (MB2)."),
  fcDs(DS_PR)("Removable partial dentures", "Kennedy Class I?", "Bilateral edentulous areas posterior to the remaining teeth."),
  fcDs(DS_PR)("Fixed prosthodontics", "Typical ferrule dimension?", "About 1.5 to 2 mm of sound tooth structure."),
  fcDs(DS_PR)("Complete dentures", "Where is the posterior palatal seal?", "At the junction of hard and soft palate on the soft palate side."),
  fcDs(DS_DM)("Glass ionomer cement", "Two key properties of GIC?", "Chemical adhesion to tooth and fluoride release and recharge."),
  fcDs(DS_DM)("Amalgam", "Why is high-copper amalgam better?", "It eliminates the corrosion-prone gamma-2 (Sn-Hg) phase."),
  fcDs(DS_DM)("Composite resin", "Common photoinitiator in composite?", "Camphorquinone, activated by blue light near 470 nm."),
  fcDs(DS_DM)("Dental cements", "Why avoid eugenol under composite?", "It inhibits resin polymerization."),
];

/* ================================================================== */
/* NAPLEX                                                              */
/* ================================================================== */
const NP_FK = "Foundational Knowledge";
const NP_MU = "Medication Use Process";
const NP_PC = "Person-Centered Assessment and Treatment Planning";
const nap = maker("naplex");

export const NAPLEX_QUESTIONS: SeedQuestion[] = [
  nap.mc(NP_FK, "Anticoagulant pharmacology", "moderate", "Warfarin produces its anticoagulant effect primarily by:", [
    ["Directly inhibiting factor Xa", "Direct factor Xa inhibitors such as apixaban and rivaroxaban do this."],
    ["Inhibiting vitamin K epoxide reductase, reducing synthesis of functional factors II, VII, IX and X", "Warfarin blocks recycling of vitamin K, so vitamin K-dependent clotting factors are produced in inactive form."],
    ["Binding antithrombin and accelerating its activity", "This is the mechanism of heparin and related agents."],
    ["Directly inhibiting thrombin", "Dabigatran and argatroban act this way."],
    ["Blocking the P2Y12 receptor on platelets", "Clopidogrel and ticagrelor act this way."],
  ], "b", "Warfarin inhibits VKORC1, depleting reduced vitamin K needed for gamma-carboxylation of factors II, VII, IX and X and proteins C and S. Its effect is delayed because existing factors must be cleared, and it is monitored with the INR.", "Warfarin: VKOR inhibition, delayed onset, INR monitoring.", ["anticoagulants"]),
  nap.mc(NP_FK, "Anticoagulant pharmacology", "difficult", "A patient on unfractionated heparin for 7 days has a platelet count that has fallen by more than 50% from baseline, and a new thrombosis. What is the most appropriate management?", [
    ["Continue heparin and add aspirin", "Continuing heparin worsens heparin-induced thrombocytopenia (HIT)."],
    ["Switch to enoxaparin", "Low molecular weight heparin cross-reacts and is also avoided in HIT."],
    ["Stop all heparin products and start a nonheparin anticoagulant such as argatroban", "HIT requires stopping every heparin exposure, including flushes, and anticoagulating with a direct thrombin inhibitor or other alternative."],
    ["Give platelet transfusions", "Platelet transfusion can fuel thrombosis in HIT."],
    ["Start warfarin immediately without a bridging agent", "Warfarin alone initially can cause skin necrosis and worsen thrombosis in acute HIT."],
  ], "c", "A platelet fall of more than 50% about 5 to 10 days after starting heparin, with thrombosis, suggests HIT. All heparins must stop and a nonheparin anticoagulant be started; warfarin is introduced later once platelets recover.", "HIT: stop all heparin, use a nonheparin anticoagulant.", ["anticoagulants", "adverse effects"]),
  nap.mc(NP_FK, "Anticoagulant pharmacology", "moderate", "Which agent is the specific reversal agent for dabigatran?", [
    ["Protamine sulfate", "Protamine reverses heparin."],
    ["Phytonadione", "Vitamin K reverses warfarin."],
    ["Idarucizumab", "Idarucizumab is a monoclonal antibody fragment that binds dabigatran."],
    ["Flumazenil", "This reverses benzodiazepines."],
    ["Naloxone", "This reverses opioids."],
  ], "c", "Dabigatran is a direct thrombin inhibitor reversed by idarucizumab. Andexanet alfa reverses factor Xa inhibitors such as apixaban and rivaroxaban, and prothrombin complex concentrate is sometimes used when specific agents are unavailable.", "Dabigatran: idarucizumab; Xa inhibitors: andexanet alfa.", ["anticoagulants", "reversal"]),
  nap.num(NP_FK, "Pharmacokinetics", "moderate", "A drug has a volume of distribution of 40 L and is given intravenously. What loading dose will achieve a target plasma concentration of 10 mg/L?", "mg", 0, 400, 0, "Loading dose = target concentration x Vd / F. For an IV dose F = 1, so 10 mg/L x 40 L = 400 mg.", "Loading dose = Css x Vd / F.", ["pharmacokinetics", "calculation"]),
  nap.num(NP_FK, "Pharmacokinetics", "easy", "A drug has an elimination half-life of 6 hours and is given at a constant maintenance regimen. Approximately how many hours until steady state is reached, using five half-lives?", "hours", 0, 30, 0, "Steady state is reached after roughly 4 to 5 half-lives. With 5 half-lives, 5 x 6 hours = 30 hours.", "Steady state takes about 5 half-lives, regardless of dose.", ["pharmacokinetics", "calculation"]),
  nap.num(NP_FK, "Biostatistics", "moderate", "In a trial, the event rate is 20% in the control group and 15% in the treatment group. What is the number needed to treat?", "patients", 0, 20, 0, "Absolute risk reduction = 20% - 15% = 5% = 0.05. NNT = 1 / ARR = 1 / 0.05 = 20.", "NNT = 1 / absolute risk reduction.", ["biostatistics", "calculation"]),
  nap.mc(NP_FK, "Biostatistics", "moderate", "Which test is most appropriate to compare mean systolic blood pressure between two independent groups when the data are approximately normally distributed?", [
    ["Chi-square test", "Chi-square compares categorical data."],
    ["Paired t-test", "Paired tests are for matched or before-and-after measurements."],
    ["Independent (unpaired) t-test", "It compares means of two independent groups of continuous data."],
    ["Log-rank test", "Log-rank compares survival curves."],
    ["Mann-Whitney U test", "This nonparametric test is used when normality is not met."],
  ], "c", "Two independent groups with continuous, normally distributed outcomes call for an unpaired t-test. Use the Mann-Whitney U test if normality fails and a paired t-test for matched data.", "Match the test to data type, number of groups and pairing.", ["biostatistics"]),
  nap.sata(NP_FK, "Drug metabolism", "moderate", "Which of the following are inhibitors of CYP3A4? Select all that apply.", [
    ["Ketoconazole", "Azole antifungals are strong CYP3A4 inhibitors."],
    ["Clarithromycin", "This macrolide is a strong CYP3A4 inhibitor."],
    ["Rifampin", "Rifampin is an inducer, lowering substrate levels."],
    ["Ritonavir", "Ritonavir is a potent CYP3A4 inhibitor used as a booster."],
    ["Carbamazepine", "This is an inducer."],
  ], ["a", "b", "d"], "Strong CYP3A4 inhibitors raise concentrations of substrates such as simvastatin, tacrolimus and certain benzodiazepines. Inducers such as rifampin, carbamazepine and St. John's wort lower them.", "Inhibitors raise substrate levels; inducers lower them.", ["drug metabolism"]),
  nap.mc(NP_FK, "Pharmacology", "easy", "Cough associated with ACE inhibitor therapy is thought to result from accumulation of:", [
    ["Angiotensin II", "ACE inhibitors reduce angiotensin II."],
    ["Bradykinin", "ACE normally degrades bradykinin; inhibition raises levels and can trigger cough and angioedema."],
    ["Renin", "Renin levels rise but do not cause cough."],
    ["Aldosterone", "Aldosterone falls with ACE inhibition."],
    ["Norepinephrine", "Not related."],
  ], "b", "ACE (kininase II) degrades bradykinin, so inhibitors increase bradykinin and substance P. This explains dry cough and angioedema. Angiotensin receptor blockers do not affect bradykinin degradation and are a common substitute.", "ACE inhibitor cough = bradykinin; switch to an ARB.", ["cardiovascular", "adverse effects"]),
  nap.mc(NP_FK, "Pharmacology", "moderate", "Why might a patient who received naloxone for an overdose of a long-acting opioid become sedated again after initial improvement?", [
    ["Naloxone is an opioid agonist that wears off", "Naloxone is an antagonist."],
    ["Naloxone has a shorter duration of action than many opioids", "The opioid may outlast the antagonist, so respiratory depression can return and monitoring is needed."],
    ["Naloxone is metabolized into an opioid", "It is not."],
    ["The patient developed naloxone allergy", "Allergy is rare."],
    ["Naloxone is only effective for one minute", "Not accurate."],
  ], "b", "Naloxone competitively blocks mu receptors for a limited time. Long-acting opioids, extended-release products and methadone can outlast it, so observation and repeat dosing may be needed and emergency care must be activated.", "Naloxone can wear off before the opioid does.", ["toxicology", "opioids"]),

  nap.num(NP_MU, "Renal dose adjustment", "moderate", "Calculate the creatinine clearance (Cockcroft-Gault) for a 70-year-old man who weighs 80 kg (actual weight is appropriate) and has a serum creatinine of 1.2 mg/dL.", "mL/min", 1, 64.8, 0.5, "CrCl = [(140 - age) x weight] / (72 x SCr) = (70 x 80) / (72 x 1.2) = 5600 / 86.4 = 64.8 mL/min. Multiply by 0.85 for women.", "Cockcroft-Gault: (140 - age) x weight / (72 x SCr), times 0.85 for females.", ["renal dosing", "calculation"]),
  nap.mc(NP_MU, "Medication safety", "easy", "Tall man lettering, such as hydrOXYzine and hydrALAZINE, is used to:", [
    ["Increase the contrast between look-alike drug names", "Capitalizing the differing letters helps distinguish similarly spelled drug names."],
    ["Indicate that a drug is a high-alert medication", "High-alert labeling is separate."],
    ["Show that a drug is a controlled substance", "Controlled substances use schedule symbols."],
    ["Mark drugs that need refrigeration", "Storage labels are separate."],
    ["Identify brand names", "Tall man lettering applies to generic names."],
  ], "a", "Tall man lettering emphasizes the dissimilar portion of look-alike names on labels, shelf tags and screens to reduce selection errors. It is one of several strategies, along with separate storage and barcode scanning.", "Tall man lettering reduces look-alike name errors.", ["safety", "LASA"]),
  nap.sata(NP_MU, "Medication safety", "moderate", "Which medications are classified as high-alert medications by the Institute for Safe Medication Practices? Select all that apply.", [
    ["Insulin", "Insulin errors can cause severe hypoglycemia."],
    ["Intravenous heparin", "Anticoagulants are high-alert drugs."],
    ["Concentrated potassium chloride injection", "Inadvertent administration can be fatal."],
    ["Acetaminophen 500 mg tablets", "Tablet acetaminophen is not on the high-alert list."],
    ["Famotidine tablets", "Not a high-alert drug."],
  ], ["a", "b", "c"], "High-alert medications carry a higher risk of significant harm when used in error. Safeguards include independent double checks, standardized concentrations and limited access to concentrated electrolytes.", "High-alert: insulin, anticoagulants, opioids, concentrated electrolytes.", ["safety"]),
  nap.mc(NP_MU, "Drug interactions", "moderate", "A patient stable on warfarin is started on trimethoprim-sulfamethoxazole. What is the expected effect and appropriate response?", [
    ["Decreased INR; increase the warfarin dose", "The interaction raises, not lowers, the INR."],
    ["Increased INR because of inhibited CYP2C9 metabolism; monitor the INR closely and consider a lower warfarin dose", "TMP-SMX inhibits warfarin metabolism and may displace it from protein binding, raising bleeding risk."],
    ["No interaction", "This is a well-documented interaction."],
    ["Decreased absorption of warfarin", "Absorption is not the mechanism."],
    ["Only a risk of rash", "Bleeding is the main concern."],
  ], "b", "TMP-SMX is a classic potentiator of warfarin through CYP2C9 inhibition. The INR should be checked within a few days, and alternatives considered when possible.", "TMP-SMX plus warfarin raises the INR.", ["interactions", "warfarin"]),
  nap.mc(NP_MU, "Drug interactions", "difficult", "Which combination carries the greatest risk of serotonin syndrome?", [
    ["Sertraline and linezolid", "Linezolid is a reversible nonselective MAO inhibitor; combining with an SSRI can precipitate serotonin syndrome."],
    ["Sertraline and acetaminophen", "No significant serotonergic interaction."],
    ["Amlodipine and lisinopril", "No serotonergic activity."],
    ["Metformin and glipizide", "This is a hypoglycemia concern, not serotonin syndrome."],
    ["Atorvastatin and ezetimibe", "Not a serotonergic combination."],
  ], "a", "Serotonin syndrome presents with agitation, hyperthermia, clonus and autonomic instability. Linezolid, MAO inhibitors, tramadol, triptans and other serotonergic agents add risk to SSRIs and SNRIs.", "Watch for linezolid with serotonergic drugs.", ["interactions", "psychiatry"]),
  nap.mc(NP_MU, "Renal dose adjustment", "moderate", "Metformin is contraindicated when the estimated glomerular filtration rate falls below which value?", [
    ["60 mL/min/1.73 m2", "Reassess benefit and dose, but it is not contraindicated at this level."],
    ["45 mL/min/1.73 m2", "Initiation is not recommended between 30 and 45."],
    ["30 mL/min/1.73 m2", "FDA labeling contraindicates metformin when eGFR is below 30 because of the lactic acidosis risk."],
    ["15 mL/min/1.73 m2", "Too low; the cutoff is 30."],
    ["90 mL/min/1.73 m2", "Normal renal function is not a limitation."],
  ], "c", "Metformin is renally cleared and accumulates in severe kidney disease, which increases the risk of lactic acidosis. It is contraindicated below an eGFR of 30, and starting therapy is not recommended at 30 to 45.", "Metformin: contraindicated at eGFR below 30.", ["renal dosing", "diabetes"]),
  nap.mc(NP_MU, "Drug interactions", "moderate", "A patient taking simvastatin is prescribed clarithromycin. Which action is most appropriate?", [
    ["Continue both at the same doses", "The combination increases the risk of rhabdomyolysis."],
    ["Recommend a nonCYP3A4-inhibiting macrolide such as azithromycin or temporarily hold simvastatin", "Clarithromycin strongly inhibits CYP3A4 and raises simvastatin exposure."],
    ["Double the simvastatin dose", "This would worsen the risk."],
    ["Take both at the same time to improve absorption", "Timing does not avoid the interaction."],
    ["Add a fibrate", "Fibrates add to myopathy risk."],
  ], "b", "Simvastatin is a CYP3A4 substrate, and clarithromycin is a strong inhibitor. Suggest azithromycin or briefly suspend the statin, and counsel the patient to report muscle pain, weakness or dark urine.", "Avoid strong CYP3A4 inhibitors with simvastatin.", ["interactions", "statins"]),
  nap.ord(NP_MU, "Medication Use Process", "easy", "Arrange the stages of the medication-use process in the usual order, from first to last.", [
    "Monitoring the patient for effectiveness and adverse effects",
    "Prescribing or ordering the medication",
    "Administration or patient use of the medication",
    "Dispensing the medication",
    "Reviewing and verifying the order",
  ], "bedca", "The process begins with the prescriber's order, followed by pharmacist review and verification, dispensing, administration or patient use, and monitoring. Monitoring results then feed back into prescribing decisions.", "Order, verify, dispense, administer, monitor.", ["medication use process"]),
  nap.num(NP_MU, "Pharmacy calculations", "moderate", "A heparin infusion is prepared as 25,000 units in 250 mL of D5W. At what rate in mL/hour should the pump be set to deliver 1,200 units/hour?", "mL/hour", 0, 12, 0, "Concentration = 25,000 units / 250 mL = 100 units/mL. Rate = 1,200 units/hour / 100 units/mL = 12 mL/hour.", "Rate = dose per hour divided by concentration.", ["calculation", "infusions"]),
  nap.mc(NP_MU, "Medication safety", "difficult", "According to the hierarchy of effectiveness for error-reduction strategies, which approach is generally the strongest?", [
    ["Educating staff about the error", "Education is a weaker strategy."],
    ["Writing a new policy reminder", "Policies and reminders are weaker."],
    ["Using forcing functions or automation, such as barcode scanning that blocks wrong-drug selection", "Architectural and automated controls reduce reliance on memory and vigilance."],
    ["Asking staff to be more careful", "Exhortation is the weakest approach."],
    ["Adding a warning sticker", "Warnings are weaker than hard stops."],
  ], "c", "Strong interventions change the system so that the error is difficult or impossible, such as forcing functions, standardization and automation. Education and policies are weaker because they depend on human performance.", "Forcing functions beat education and reminders.", ["safety", "quality improvement"]),

  nap.num(NP_PC, "Corticosteroid conversion", "moderate", "A patient taking prednisone 40 mg daily is switched to an equivalent dose of methylprednisolone. How many milligrams of methylprednisolone are equivalent? (Prednisone 5 mg = methylprednisolone 4 mg.)", "mg", 0, 32, 0, "Equivalent dose = 40 mg prednisone x (4 mg methylprednisolone / 5 mg prednisone) = 32 mg.", "Prednisone 5 mg = methylprednisolone 4 mg = hydrocortisone 20 mg = dexamethasone 0.75 mg.", ["steroids", "calculation"]),
  nap.mc(NP_PC, "Helicobacter pylori", "moderate", "Which regimen is a guideline-recommended first-line option for H. pylori infection when clarithromycin resistance is unknown or penicillin allergy is present?", [
    ["PPI, bismuth, tetracycline and metronidazole for 14 days", "Bismuth quadruple therapy is the recommended first-line option in many guidelines."],
    ["PPI alone for 14 days", "A PPI alone does not eradicate the organism."],
    ["Amoxicillin alone for 7 days", "Monotherapy is not effective."],
    ["Bismuth alone for 14 days", "Not sufficient."],
    ["Metronidazole and a PPI for 3 days", "This is too short and lacks a second agent."],
  ], "a", "Eradication requires combination therapy and a PPI to raise gastric pH. Bismuth quadruple therapy is often preferred, and treatment is followed by testing for eradication after stopping PPI and bismuth for the recommended period.", "H. pylori: combination therapy for about 14 days.", ["gastroenterology", "infection"]),
  nap.mc(NP_PC, "Anticoagulation management", "difficult", "A patient on warfarin with a goal INR of 2 to 3 has an INR of 5.5 and no bleeding. What is the most appropriate recommendation?", [
    ["Give high-dose intravenous vitamin K", "Routine vitamin K is not advised for this INR without bleeding."],
    ["Hold one or two doses, recheck the INR and look for contributing factors", "Guidelines recommend against routine vitamin K for an INR between 4.5 and 10 without bleeding."],
    ["Continue the same dose", "The INR is supratherapeutic."],
    ["Double the next dose", "This would raise the INR further."],
    ["Stop warfarin permanently", "Not warranted for a single elevated value."],
  ], "b", "Without bleeding, a moderately elevated INR is managed by holding doses, adjusting the maintenance dose and reviewing diet, illness and interacting drugs. Vitamin K is reserved for higher INR levels or bleeding scenarios per guideline thresholds.", "INR 4.5 to 10 without bleeding: hold doses; no routine vitamin K.", ["warfarin", "monitoring"]),
  nap.mc(NP_PC, "Patient counseling", "easy", "Which counseling point is most appropriate for a patient starting levothyroxine?", [
    ["Take it on an empty stomach 30 to 60 minutes before breakfast and separate it from calcium and iron by about 4 hours", "Food and minerals reduce absorption, so consistent empty-stomach dosing is essential."],
    ["Take it with a large breakfast to prevent nausea", "Food decreases absorption."],
    ["Take it with an antacid", "Antacids bind levothyroxine."],
    ["Stop it when you feel well", "Therapy is usually lifelong."],
    ["Take it only when symptoms recur", "It must be taken daily."],
  ], "a", "Levothyroxine is best absorbed on an empty stomach. Calcium, iron, aluminum antacids and bile acid sequestrants bind it, so separate by several hours, and recheck TSH after dose or product changes.", "Levothyroxine: empty stomach, consistent timing, separate from minerals.", ["counseling", "endocrine"]),
  nap.mc(NP_PC, "Asthma", "moderate", "A patient with persistent asthma uses albuterol rescue more than two days per week and wakes at night with symptoms. What is the most appropriate change?", [
    ["Add or optimize a controller containing an inhaled corticosteroid", "Frequent rescue use signals uncontrolled asthma and the need for anti-inflammatory controller therapy."],
    ["Increase albuterol use as needed only", "This does not address inflammation."],
    ["Start a long-acting beta agonist as monotherapy", "LABA monotherapy is not recommended."],
    ["Stop all inhalers", "This worsens control."],
    ["Add oral antihistamines only", "Not a controller for asthma."],
  ], "a", "Asthma is a chronic inflammatory disease. Needing a rescue inhaler more than two days per week suggests inadequate control, so inhaled corticosteroid-based therapy is added or stepped up after checking technique and adherence.", "Frequent SABA use means add or step up inhaled corticosteroid.", ["asthma", "respiratory"]),
  nap.mc(NP_PC, "Diabetes", "difficult", "A patient with type 2 diabetes and established atherosclerotic cardiovascular disease has an A1c at goal on metformin. According to current guidelines, what is the best consideration?", [
    ["Add a GLP-1 receptor agonist or SGLT2 inhibitor with proven cardiovascular benefit", "These agents reduce cardiovascular events regardless of A1c."],
    ["Add a sulfonylurea for cardiovascular protection", "Sulfonylureas lack cardiovascular benefit and carry hypoglycemia risk."],
    ["Add a thiazolidinedione to all patients", "Pioglitazone is avoided in heart failure."],
    ["Stop metformin immediately", "Metformin remains appropriate."],
    ["Add a first-generation sulfonylurea", "Not recommended for CV protection."],
  ], "a", "Guidelines recommend agents with proven cardiovascular or kidney benefit for patients with established ASCVD, heart failure or CKD, independent of baseline A1c or metformin use.", "ASCVD in T2DM: GLP-1 RA or SGLT2 inhibitor with proven benefit.", ["diabetes", "cardiovascular"]),
  nap.num(NP_PC, "Insulin supply", "moderate", "An insulin pen contains 3 mL of 100 units/mL insulin. The patient injects 18 units once daily and uses 2 units to prime each injection. How many days will one pen last? (Ignore in-use discard limits.)", "days", 0, 15, 0, "Total insulin = 3 mL x 100 units/mL = 300 units. Daily use = 18 + 2 priming = 20 units. 300 / 20 = 15 days.", "Include priming units when estimating pen supply.", ["calculation", "insulin"]),
  nap.sata(NP_PC, "Patient counseling", "moderate", "Which counseling points are appropriate for a patient starting lisinopril? Select all that apply.", [
    ["Report swelling of the lips, tongue or face immediately", "Angioedema is a serious adverse effect."],
    ["A dry cough may develop; tell your prescriber if it is bothersome", "Cough is a common adverse effect."],
    ["Avoid potassium-containing salt substitutes unless approved", "ACE inhibitors raise potassium."],
    ["Use is safe in pregnancy", "ACE inhibitors are contraindicated in pregnancy."],
    ["Stand up slowly because of possible dizziness", "First-dose hypotension can occur."],
  ], ["a", "b", "c", "e"], "ACE inhibitors cause cough, angioedema, hyperkalemia, hypotension and fetal toxicity. Counseling should cover when to seek urgent help, potassium and pregnancy avoidance.", "ACE inhibitors: cough, angioedema, hyperkalemia, avoid in pregnancy.", ["counseling", "cardiovascular"]),
  nap.ord(NP_PC, "Patient counseling", "moderate", "Arrange the steps for using a metered-dose inhaler with a spacer, in order.", [
    "Hold the breath for about 10 seconds",
    "Breathe out fully away from the spacer",
    "Shake the inhaler and attach it to the spacer",
    "Wait about one minute before a second puff, if prescribed",
    "Seal the lips around the mouthpiece, press the canister and inhale slowly",
  ], "cbead", "Shake and attach the spacer, exhale fully, then actuate while inhaling slowly, hold the breath for about 10 seconds and wait about a minute before another puff. Rinse the mouth after inhaled corticosteroids.", "Shake, exhale, actuate and inhale slowly, hold, wait.", ["counseling", "inhalers"]),
  nap.mc(NP_PC, "Hypertension", "moderate", "For a Black adult with hypertension and no heart failure or chronic kidney disease, which initial therapy is recommended by current US guidelines?", [
    ["A thiazide-type diuretic or a calcium channel blocker", "These classes are preferred for initial therapy in Black adults without HF or CKD."],
    ["A beta blocker alone", "Beta blockers are not first line without a compelling indication."],
    ["An ACE inhibitor alone with no other agents", "ACE inhibitors are less effective as monotherapy in this group, though they are used for compelling indications."],
    ["An alpha blocker alone", "Not first line."],
    ["No treatment until stage 3 hypertension", "Treatment thresholds are lower."],
  ], "a", "In Black adults without HF or CKD, thiazide-type diuretics or calcium channel blockers are recommended initially. Two-drug therapy is often needed when blood pressure is well above goal.", "Black adults: thiazide or CCB first.", ["hypertension", "guidelines"]),
];

export const NAPLEX_MATERIALS: SeedMaterial[] = [
  note("naplex", NP_FK, "Anticoagulant pharmacology", "Anticoagulants: Mechanisms, Monitoring and Reversal",
    "Compare warfarin, heparins and DOACs on mechanism, monitoring, adverse effects and antidotes.",
`# Anticoagulants at a Glance

## Warfarin
- Inhibits **vitamin K epoxide reductase**, reducing functional factors **II, VII, IX, X** and proteins C and S.
- Onset is delayed (days); monitor with **INR**. Typical INR goal 2 to 3 for most indications.
- Large number of interactions: CYP2C9 and CYP3A4 inhibitors raise INR; inducers (rifampin, carbamazepine) lower it. Diet and vitamin K intake matter.
- **Reversal**: vitamin K (phytonadione), prothrombin complex concentrate or fresh frozen plasma for serious bleeding.
- Teratogenic; contraindicated in pregnancy.
- Early use can cause skin necrosis in protein C deficiency; bridging is used for high thrombotic risk.

## Unfractionated heparin (UFH)
- Potentiates **antithrombin**, inactivating thrombin and factor Xa.
- IV or subcutaneous; short half-life; monitor with **aPTT** (or anti-Xa).
- **Protamine** reverses it.
- **HIT**: platelet fall of more than 50% or thrombosis 5 to 10 days after starting; stop all heparin and use a nonheparin agent (argatroban, bivalirudin, fondaparinux in some settings).

## Low molecular weight heparin (enoxaparin)
- Primarily anti-Xa effect; predictable dosing; renal clearance, so dose-adjust when CrCl is below 30 mL/min.
- Protamine partially reverses.

## Direct oral anticoagulants (DOACs)
- **Factor Xa inhibitors**: apixaban, rivaroxaban, edoxaban. Reversal: **andexanet alfa**.
- **Direct thrombin inhibitor**: dabigatran. Reversal: **idarucizumab**.
- No routine INR monitoring; renal function, age, weight and interacting drugs (strong CYP3A4/P-gp inhibitors and inducers) matter.
- Rivaroxaban 15 and 20 mg doses are taken with food.
- DOACs are not recommended in mechanical heart valves or in severe antiphospholipid syndrome.

## Counseling points
- Report bleeding, black stools, severe headache or falls.
- Avoid NSAIDs and aspirin unless advised.
- Do not stop therapy abruptly; missed doses should be handled as instructed.

**High-yield / exam traps:** Match the antidote: heparin-protamine, warfarin-vitamin K, dabigatran-idarucizumab, Xa inhibitors-andexanet. Warfarin needs INR; UFH uses aPTT; DOACs need no routine labs. LMWH accumulates in renal impairment.`, 6),
  note("naplex", NP_FK, "Pharmacokinetics", "Pharmacokinetic Formulas You Must Know",
    "A compact reference for clearance, volume of distribution, half-life and dosing calculations.",
`# Pharmacokinetics Toolkit

## Core parameters
- **Volume of distribution (Vd)** = amount of drug in the body / plasma concentration. Large Vd means extensive tissue distribution.
- **Clearance (CL)** = volume of plasma cleared of drug per unit time.
- **Elimination rate constant (k)** = CL / Vd = 0.693 / t1/2.
- **Half-life**: t1/2 = 0.693 x Vd / CL.
- **Bioavailability (F)**: fraction of the dose reaching systemic circulation (IV = 1).

## Dosing equations
- **Loading dose** = (Css x Vd) / F.
- **Maintenance dose rate** = (CL x Css) / F, with a dosing interval chosen for convenience.
- **Steady state** takes about **4 to 5 half-lives**, regardless of dose size; changing dose changes the level, not the time to steady state.
- **Average steady-state concentration** = (F x dose / tau) / CL.

## Kinetic orders
- **First-order**: constant fraction eliminated; most drugs.
- **Zero-order**: constant amount eliminated (ethanol, high-dose aspirin); phenytoin shows **saturable (Michaelis-Menten)** kinetics, so small dose changes can cause large level changes.

## Renal function
- **Cockcroft-Gault**: CrCl = (140 - age) x weight / (72 x SCr), multiply by 0.85 for females.
- Use ideal body weight in normal-weight patients, adjusted body weight in obesity per local policy.
- Renally cleared drugs requiring adjustment: aminoglycosides, vancomycin, enoxaparin, many antibiotics, metformin (by eGFR).

## Protein binding and interactions
- Only unbound drug is active.
- Hypoalbuminemia raises free phenytoin; use a corrected level.
- Inducers decrease levels of substrates; inhibitors increase them.

## Worked example
Target concentration 10 mg/L, Vd 40 L, IV: loading dose = 10 x 40 = 400 mg.

## Time-to-effect tips
- Drugs with long half-lives take longer to reach steady state; loading doses speed up initial levels.
- A drug stopped is essentially gone after about 5 half-lives.

**High-yield / exam traps:** Loading dose depends on Vd; maintenance dose depends on clearance. Steady-state time depends only on half-life. Do not confuse half-life with duration of effect for drugs with pharmacodynamic effects that outlast concentrations.`, 7, "guide"),
  note("naplex", NP_MU, "Renal dose adjustment", "Renal Dosing and Medication Safety Screening",
    "Practical approach to dose adjustment, interaction screening and error prevention during verification.",
`# Renal Dosing and Safety Screening

## Verification checklist
1. Confirm the right patient, drug, dose, route, frequency and indication.
2. Check allergies and prior reactions.
3. Review **renal and hepatic function**.
4. Screen for **interactions**, duplications and contraindications.
5. Confirm monitoring is in place.
6. Document interventions.

## Renal dose adjustment
- Estimate CrCl with **Cockcroft-Gault** for most drug labeling; eGFR is used for metformin and SGLT2 inhibitors.
- Serum creatinine overestimates function in older, low muscle mass patients.
- Common adjustments: reduce dose or extend interval for renally cleared drugs such as enoxaparin, vancomycin, gabapentin, famotidine, cefepime and many others.
- **Avoid nephrotoxic combinations**: NSAIDs with ACE inhibitor and diuretic ("triple whammy"), aminoglycosides with vancomycin.

## Interaction patterns
- **CYP3A4 inhibitors**: clarithromycin, azole antifungals, ritonavir; raise statin, calcium channel blocker and many other levels.
- **CYP inducers**: rifampin, carbamazepine, phenytoin; lower warfarin, oral contraceptives and DOAC levels.
- **QT prolongation**: macrolides, fluoroquinolones, ondansetron, antipsychotics.
- **Serotonin syndrome**: SSRIs with linezolid, MAO inhibitors, tramadol.
- **Bleeding**: warfarin with NSAIDs, SSRIs or TMP-SMX.

## Medication safety principles
- **High-alert medications**: insulin, anticoagulants, opioids, concentrated electrolytes, chemotherapy.
- Look-alike sound-alike names: use tall man lettering, separate storage and barcode scanning.
- Standardize concentrations and use smart pump libraries.
- Strong interventions (forcing functions, automation) outperform education and policy reminders.
- **Report errors and near misses** in a nonpunitive reporting system.

## Medication reconciliation
- Compare the best possible medication history to current orders at admission, transfer and discharge.
- Use at least two sources: patient interview and fill history.

**High-yield / exam traps:** Use CrCl for most antibiotics and anticoagulants, eGFR for metformin. A near miss is still a reportable event. Do not choose education as the main fix for a system problem.`, 6),
  note("naplex", NP_PC, "Patient counseling", "Counseling Pearls for Common Chronic Medications",
    "High-yield counseling points for inhalers, thyroid, ACE inhibitors, insulin and anticoagulants.",
`# Counseling Pearls

## Counseling framework
- Identify what the patient already knows with **open-ended questions**.
- Explain purpose, how and when to take it, important adverse effects and what to do if a dose is missed.
- Use **teach-back** to confirm understanding.
- Address cost, beliefs and barriers to adherence.

## Inhalers
- **Metered-dose inhalers** work best with a spacer: shake, exhale, actuate while inhaling slowly, hold the breath about 10 seconds, wait before a second puff.
- **Dry powder inhalers** require a fast, deep breath; do not use a spacer or exhale into the device.
- Rinse the mouth after **inhaled corticosteroids** to reduce thrush.
- Rescue inhaler use more than two days per week suggests poor control.

## Levothyroxine
- Take daily on an **empty stomach**, 30 to 60 minutes before breakfast.
- Separate from calcium, iron and antacids by about 4 hours.
- Recheck TSH after changes.

## ACE inhibitors and ARBs
- Report lip, tongue or face swelling (angioedema).
- ACE inhibitors may cause cough; ARBs rarely do.
- Avoid potassium supplements and salt substitutes unless advised.
- Avoid in pregnancy.

## Insulin
- Rotate injection sites; store unopened pens in the refrigerator and in-use pens at room temperature per product labeling.
- Do not share pens between patients.
- Know the signs and treatment of **hypoglycemia** (15 g fast-acting carbohydrate, recheck).
- Prime pens as directed.

## Anticoagulants and statins
- Warfarin: consistent vitamin K intake, regular INR checks, report bleeding.
- Statins: report unexplained muscle pain; limit interacting drugs.

## Special populations
- Older adults: reduce pill burden and use pill organizers.
- Pregnancy: review all medications.

**High-yield / exam traps:** Dry powder inhaler technique is different from MDI technique. Levothyroxine absorption is reduced by food and minerals. Always use teach-back and open-ended questions rather than yes-or-no questions.`, 6),
  note("naplex", NP_PC, "Helicobacter pylori", "Corticosteroid Equivalence and H. pylori Therapy Quick Reference",
    "Equivalent steroid doses, adverse effects and first-line H. pylori regimens in one page.",
`# Steroid Conversions and H. pylori Therapy

## Corticosteroid equivalents (approximate)
| Drug | Equivalent dose | Relative duration |
|---|---|---|
| Hydrocortisone | 20 mg | Short |
| Prednisone | 5 mg | Intermediate |
| Prednisolone | 5 mg | Intermediate |
| Methylprednisolone | 4 mg | Intermediate |
| Dexamethasone | 0.75 mg | Long |

- Hydrocortisone has the **greatest mineralocorticoid activity**; dexamethasone has virtually none.
- **Conversion**: dose x (target equivalent / source equivalent). Example: prednisone 40 mg to methylprednisolone = 40 x 4/5 = 32 mg.
- Taper after more than about 2 to 3 weeks of therapy because of **HPA axis suppression**.

## Corticosteroid adverse effects
- Hyperglycemia, hypertension, fluid retention, mood changes, insomnia, osteoporosis, cataracts, infection risk, peptic ulcer when combined with NSAIDs, adrenal suppression.
- Counsel to take oral doses in the morning with food.
- Consider calcium, vitamin D and bone protection for long-term use.

## H. pylori treatment
- Test and treat patients with active peptic ulcer disease or a history of ulcer.
- **Bismuth quadruple therapy** (PPI, bismuth, tetracycline, metronidazole) for 14 days is a preferred first-line choice in many guidelines.
- Clarithromycin triple therapy (PPI, clarithromycin, amoxicillin) is used only where clarithromycin resistance is known to be low and the patient has no prior macrolide exposure.
- Penicillin allergy favors bismuth quadruple therapy.
- Confirm **eradication** with a urea breath or stool antigen test, at least 4 weeks after antibiotics and after holding PPI for 1 to 2 weeks.

## Counseling
- Bismuth turns stools black and may darken the tongue.
- Avoid alcohol with metronidazole.
- Tetracycline should be separated from dairy and antacids.
- Complete the entire course even if symptoms improve.

**High-yield / exam traps:** Prednisone and prednisolone are 5 mg; methylprednisolone is 4 mg; dexamethasone is 0.75 mg; hydrocortisone is 20 mg. Test of cure must be done off PPIs and bismuth. Tetracycline is avoided in pregnancy.`, 6),
];

const fcNp = (cat: string) => fc("naplex", cat);
export const NAPLEX_FLASHCARDS: SeedFlashcard[] = [
  fcNp(NP_FK)("Anticoagulant pharmacology", "Mechanism of warfarin?", "Inhibits vitamin K epoxide reductase, reducing factors II, VII, IX and X."),
  fcNp(NP_FK)("Anticoagulant pharmacology", "Reversal agent for dabigatran?", "Idarucizumab."),
  fcNp(NP_FK)("Anticoagulant pharmacology", "Reversal agent for apixaban and rivaroxaban?", "Andexanet alfa."),
  fcNp(NP_FK)("Anticoagulant pharmacology", "Reversal agent for unfractionated heparin?", "Protamine sulfate."),
  fcNp(NP_FK)("Pharmacokinetics", "Loading dose formula?", "(Target concentration x Vd) / bioavailability."),
  fcNp(NP_FK)("Pharmacokinetics", "Half-life equation?", "t1/2 = 0.693 x Vd / CL."),
  fcNp(NP_FK)("Pharmacokinetics", "How long to steady state?", "About 4 to 5 half-lives."),
  fcNp(NP_FK)("Biostatistics", "Number needed to treat?", "1 divided by the absolute risk reduction."),
  fcNp(NP_FK)("Drug metabolism", "Name CYP3A4 inducers.", "Rifampin, carbamazepine, phenytoin and St. John's wort."),
  fcNp(NP_MU)("Renal dose adjustment", "Cockcroft-Gault equation?", "CrCl = (140 - age) x weight / (72 x SCr), times 0.85 for females."),
  fcNp(NP_MU)("Renal dose adjustment", "Metformin contraindicated below what eGFR?", "30 mL/min/1.73 m2."),
  fcNp(NP_MU)("Medication safety", "What is tall man lettering?", "Capitalizing differing letters of look-alike drug names, such as hydrOXYzine and hydrALAZINE."),
  fcNp(NP_MU)("Drug interactions", "Effect of TMP-SMX on warfarin?", "Raises the INR through CYP2C9 inhibition."),
  fcNp(NP_MU)("Drug interactions", "Which drug with an SSRI can cause serotonin syndrome and is an MAO inhibitor antibiotic?", "Linezolid."),
  fcNp(NP_PC)("Corticosteroid conversion", "Equivalent doses of prednisone, methylprednisolone, dexamethasone and hydrocortisone?", "Prednisone 5 mg = methylprednisolone 4 mg = dexamethasone 0.75 mg = hydrocortisone 20 mg."),
  fcNp(NP_PC)("Helicobacter pylori", "First-line H. pylori regimen in penicillin allergy?", "Bismuth quadruple therapy: PPI, bismuth, tetracycline and metronidazole for 14 days."),
  fcNp(NP_PC)("Patient counseling", "How should levothyroxine be taken?", "On an empty stomach 30 to 60 minutes before breakfast, separated from calcium and iron."),
  fcNp(NP_PC)("Patient counseling", "Key ACE inhibitor counseling points?", "Cough, angioedema, hyperkalemia risk and avoidance in pregnancy."),
  fcNp(NP_PC)("Anticoagulation management", "INR of 4.5 to 10 without bleeding on warfarin?", "Hold dose(s) and recheck; routine vitamin K is not recommended."),
  fcNp(NP_PC)("Hypertension", "Initial therapy for Black adults without HF or CKD?", "A thiazide-type diuretic or a calcium channel blocker."),
];
