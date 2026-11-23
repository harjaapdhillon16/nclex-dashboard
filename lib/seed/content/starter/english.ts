/**
 * Original starter content for the English-language proficiency exams
 * (IELTS Academic/General, OET Nursing/Medicine, PTE Academic, TOEFL iBT).
 * All passages, transcripts, items and lessons are original practice writing.
 * Listening items are presented as short transcript extracts (no audio).
 */
import type { SeedQuestion, Difficulty } from "@/lib/questions/types";
import type { SeedMaterial, SeedFlashcard } from "../materials";

type D = Difficulty;
const E: D = "easy";
const M: D = "moderate";
const H: D = "difficult";
const A: D = "advanced";

const LET = "abcdefgh";
const optsOf = (t: string[]) => t.map((text, i) => ({ id: LET[i], text }));
const explain = (n: number, correct: number[], ex: string[]) =>
  Object.fromEntries(Array.from({ length: n }, (_, i) => [LET[i], `${correct.includes(i) ? "Correct" : "Incorrect"}. ${ex[i]}`]));
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Ctx = {
  scenario?: string;
  passage?: string;
  title?: string;
  table?: { columns: string[]; rows: string[][] };
  sub?: string;
  tags?: string[];
  tip?: string;
};

function sec(exam: string, category: string) {
  const mk = (
    topic: string,
    type: SeedQuestion["type"],
    difficulty: D,
    stem: string,
    content: SeedQuestion["content"],
    answer: SeedQuestion["answer"],
    rationale: string,
    ctx: Ctx,
    optionExplanations?: Record<string, string>,
  ): SeedQuestion => {
    const q: SeedQuestion = {
      exam,
      category,
      topic,
      subtopic: ctx.sub,
      type,
      difficulty,
      stem,
      content,
      answer,
      rationale,
      tags: [exam, slug(category), slug(topic), ...(ctx.tags ?? [])],
    };
    if (ctx.scenario) q.scenario = ctx.scenario;
    if (ctx.passage) q.exhibit = { kind: "passage", title: ctx.title, text: ctx.passage };
    if (ctx.table) q.exhibit = { kind: "table", title: ctx.title, columns: ctx.table.columns, rows: ctx.table.rows };
    if (optionExplanations) q.optionExplanations = optionExplanations;
    if (ctx.tip) q.extras = { strategy: ctx.tip };
    return q;
  };
  return {
    mcq: (topic: string, d: D, stem: string, options: string[], ans: number, why: string, ex: string[], ctx: Ctx = {}) =>
      mk(topic, "mcq", d, stem, { options: optsOf(options) }, { correct: LET[ans] }, why, ctx, explain(options.length, [ans], ex)),
    sata: (topic: string, d: D, stem: string, options: string[], ans: number[], why: string, ex: string[], ctx: Ctx = {}) =>
      mk(topic, "sata", d, stem, { options: optsOf(options) }, { correct: ans.map((i) => LET[i]) }, why, ctx, explain(options.length, ans, ex)),
    cloze: (topic: string, d: D, stem: string, template: string, blanks: string[][], ans: number[], why: string, ctx: Ctx = {}) =>
      mk(
        topic,
        "cloze",
        d,
        stem,
        { template, blanks: Object.fromEntries(blanks.map((b, i) => [`b${i + 1}`, optsOf(b)])) },
        { blanks: Object.fromEntries(ans.map((a, i) => [`b${i + 1}`, LET[a]])) },
        why,
        ctx,
      ),
    ordered: (topic: string, d: D, stem: string, inOrder: string[], why: string, ctx: Ctx = {}) => {
      const items = inOrder.map((text, i) => ({ id: `s${i + 1}`, text }));
      const perm = [2, 0, 3, 1, 4, 5, 6, 7].filter((i) => i < items.length);
      const shown = perm.map((i) => items[i]);
      return mk(topic, "ordered", d, stem, { items: shown }, { order: items.map((i) => i.id) }, why, ctx);
    },
    /** marked text: *word* = altered word (correct highlight); ~word~ = selectable but accurate. */
    highlight: (topic: string, d: D, stem: string, marked: string, why: string, ctx: Ctx = {}) => {
      const parts = marked.split(/(\*[^*]+\*|~[^~]+~)/).filter((p) => p !== "");
      const segments = parts.map((p, i) => {
        const sel = p.startsWith("*") || p.startsWith("~");
        return { id: `seg${i + 1}`, text: sel ? p.slice(1, -1) : p, ...(sel ? { selectable: true } : {}) };
      });
      const correct = parts.map((p, i) => (p.startsWith("*") ? `seg${i + 1}` : "")).filter(Boolean);
      return mk(topic, "highlight", d, stem, { segments }, { correct }, why, ctx);
    },
    writing: (
      topic: string,
      d: D,
      stem: string,
      prompt: string,
      minWords: number,
      label: string,
      rubric: string[],
      sample: string,
      why: string,
      ctx: Ctx = {},
      maxWords?: number,
    ) => mk(topic, "writing", d, stem, { prompt, minWords, ...(maxWords ? { maxWords } : {}), taskLabel: label, rubric }, { sample }, why, ctx),
    speaking: (
      topic: string,
      d: D,
      stem: string,
      prompt: string,
      prepSeconds: number,
      speakSeconds: number,
      cueCard: string[] | undefined,
      rubric: string[],
      sample: string,
      why: string,
      ctx: Ctx = {},
    ) => mk(topic, "speaking", d, stem, { prompt, prepSeconds, speakSeconds, ...(cueCard ? { cueCard } : {}), rubric }, { sample }, why, ctx),
  };
}

const mat = (
  exam: string,
  category: string,
  topic: string,
  kind: "notes" | "guide",
  title: string,
  summary: string,
  durationMinutes: number,
  body: string,
): SeedMaterial => ({ exam, category, topic, kind, title, summary, body, durationMinutes });

const fcs = (exam: string, category: string, topic: string, rows: [string, string][]): SeedFlashcard[] =>
  rows.map(([front, back]) => ({ exam, category, topic, front, back }));

const IELTS_WRITING_RUBRIC = [
  "Task Achievement/Response: Answers every part of the task with a clear position or overview.",
  "Coherence and Cohesion: Logical paragraphing with accurate, varied linking.",
  "Lexical Resource: Precise, natural vocabulary with few errors.",
  "Grammatical Range and Accuracy: A mix of simple and complex structures, mostly error-free.",
];
const IELTS_SPEAKING_RUBRIC = [
  "Fluency and Coherence: Speaks at length without long pauses; ideas are linked logically.",
  "Lexical Resource: Uses a range of topic vocabulary and paraphrases when needed.",
  "Grammatical Range and Accuracy: Controls a range of tenses and complex sentences.",
  "Pronunciation: Clear sounds, natural stress and intonation.",
];
const OET_WRITING_RUBRIC = [
  "Purpose: The reason for writing is stated clearly in the opening paragraph.",
  "Content: Includes relevant case-note information and omits irrelevant detail.",
  "Conciseness and Clarity: Complete sentences, no note form, no repetition.",
  "Genre and Style: Professional tone, correct salutation, tenses and layout.",
  "Organisation and Layout: Logical paragraphs grouped by theme.",
];
const OET_SPEAKING_RUBRIC = [
  "Relationship Building: Empathic, respectful and non-judgemental tone.",
  "Understanding and Incorporating the Patient's Perspective: Elicits and responds to concerns and expectations.",
  "Providing Structure: Opens, signposts and closes the consultation clearly.",
  "Information Gathering and Giving: Plain language, checks understanding, avoids jargon.",
];

/* ================================================================== */
/* IELTS ACADEMIC                                                     */
/* ================================================================== */
const IA_L = sec("ielts-academic", "Listening");
const IA_R = sec("ielts-academic", "Reading");
const IA_W = sec("ielts-academic", "Writing");
const IA_S = sec("ielts-academic", "Speaking");

const IA_QUESTIONS: SeedQuestion[] = [
  /* ---------- Listening ---------- */
  IA_L.mcq("Conversations", E, "On what day and at what time will the accommodation inspection take place?",
    ["Tuesday 14th, in the morning", "Wednesday 14th, in the afternoon", "Thursday 15th, in the morning", "Thursday 15th, in the afternoon"], 2,
    "The agent corrects the first date: the 14th is a Wednesday in the office diary, and the actual slot is Thursday 15th between ten and noon.",
    ["The tenant suggests Tuesday, but the agent corrects it.", "The agent mentions the 14th only to explain the diary error.", "Thursday 15th between ten and twelve is the final, corrected arrangement.", "The afternoon is mentioned only as the time the agent is unavailable."],
    { scenario: "Transcript extract (Section 1, tenant and letting agent): Tenant: 'So the inspection is on Tuesday the fourteenth, is that right?' Agent: 'Sorry, no, I was reading the office diary and the fourteenth is actually a Wednesday. Let me look again. We've booked you for Thursday the fifteenth, between ten and twelve. I had an afternoon slot as well, but the electrician needs that one.'", sub: "Self-correction and distractor dates", tip: "In Section 1, speakers often correct themselves. The final version is the answer." }),
  IA_L.mcq("Conversations", M, "What do the two students finally decide to do at the start of their presentation?",
    ["Explain the history of the housing project", "Show the graph of the survey results", "Introduce the case study of the local library", "Ask the audience to complete a short questionnaire"], 1,
    "Leo's first idea is rejected because it is too long; they agree that opening with the survey graph is the most striking start and leave the case study for later.",
    ["The tutor suggested cutting the history section, and neither student argues for it.", "Maya says the graph is the 'hook' and Leo agrees to open with it.", "The case study is moved to the middle of the talk, not the start.", "The questionnaire is dismissed because there will not be time."],
    { scenario: "Transcript extract (Section 3, two students): Maya: 'The tutor thinks we should drop the history of the housing project altogether.' Leo: 'Fine by me. I was going to begin with the library case study, but it takes five minutes to set up.' Maya: 'What about the survey graph? Nobody expects such a steep drop in the first minute. It's our hook.' Leo: 'True. Graph first, then the case study. We could hand out a questionnaire, but we'd run out of time.'", sub: "Group decision", tags: ["agreement"] }),
  IA_L.mcq("Conversations", H, "What is the tutor's main concern about the student's research plan?",
    ["The ethical approval process will take too long", "The sample may be too small to support firm conclusions", "The questionnaire wording is likely to confuse participants", "The deadline for the final report is unrealistic"], 1,
    "The tutor hedges politely ('I'm not entirely convinced') and then names the problem: forty participants may not be enough to generalise.",
    ["Ethics approval is mentioned as already submitted.", "The tutor says forty participants may not be enough to draw wider conclusions.", "The tutor praises the questionnaire as clear.", "The timetable is described as tight but workable."],
    { scenario: "Transcript extract (Section 3, tutor and postgraduate student): Tutor: 'Your questionnaire is clear, and I see you've already sent the ethics form. What I'm not entirely convinced about is the sample. Forty participants is a modest number if you want to say anything about all first-year students. The timetable is tight, but it's workable.'", sub: "Hedged criticism", tip: "Polite hedging ('not entirely convinced') still signals the speaker's real worry." }),
  IA_L.sata("Conversations", M, "Which TWO of the following are included in the membership price, according to the receptionist?",
    ["Use of the gym", "Access to the swimming pool", "A free breakfast", "Parking on site", "Towel hire"], [0, 2],
    "The receptionist says the gym and breakfast are included; the pool costs extra, there is no parking, and towels are charged.",
    ["Included: 'the gym is part of the package'.", "The pool is an extra charge of five pounds a visit.", "Included: breakfast is covered in the price.", "The receptionist says the car park is for staff only.", "Towels are charged separately at the desk."],
    { scenario: "Transcript extract (Section 1, enquiry at a sports club): Receptionist: 'The monthly price covers the gym and a continental breakfast in the café. The swimming pool is extra, five pounds a visit, I'm afraid. We don't have parking for members, the car park is for staff only, but there's a bike rack. Towels you can hire at the desk for one pound.'", sub: "Selecting two details" }),
  IA_L.mcq("Lectures", M, "According to the lecturer, what does the angle of a honeybee's waggle run communicate?",
    ["The distance to the food source", "The quality of the nectar", "The direction of the food relative to the sun", "The number of bees needed to collect it"], 2,
    "The lecturer states that the angle from vertical corresponds to the angle between the sun and the food source; distance is signalled by the duration of the run.",
    ["Distance is linked to how long the run lasts, not its angle.", "Nectar quality affects how vigorously the dance is repeated.", "The angle against the vertical encodes direction relative to the sun.", "Recruitment numbers are not encoded in the angle."],
    { scenario: "Transcript extract (Section 4, biology lecture): 'When a forager returns, she dances on the vertical comb in a figure of eight. The straight middle part is the waggle run. Two things matter. First, how long the run lasts, because that tells her sisters roughly how far to fly. Second, the angle of the run from the vertical: that matches the angle between the sun and the food, so the dancer is effectively saying, fly this far to the left of the sun. How enthusiastic she is, how many times she repeats it, depends on how rich the nectar is.'", sub: "Animal communication" }),
  IA_L.mcq("Lectures", H, "What is the lecturer's attitude towards the claim that the printing press alone caused the spread of literacy in Europe?",
    ["She accepts it without reservation", "She regards it as an oversimplification", "She considers it completely false", "She thinks it needs no further research"], 1,
    "'Contrary to what is often claimed' and 'only part of the story' signal that she sees the claim as too simple, not wholly wrong.",
    ["She does not endorse the claim; she qualifies it.", "She says the press mattered but was only part of the story.", "She does not reject it entirely; she says the press played a role.", "She ends by calling for more work on schools and trade."],
    { scenario: "Transcript extract (Section 4, history lecture): 'It is often claimed that the printing press, on its own, brought literacy to ordinary Europeans. Well, contrary to what is often claimed, that is only part of the story. Cheaper books certainly mattered. But so did parish schools, the growth of trade, which created a need for record-keeping, and religious reform. We need far more research into how those factors interacted.'", sub: "Attitude and stance", tags: ["stance"] }),
  IA_L.cloze("Lectures", M, "Complete the lecture notes using the drop-down menus.",
    "Glaciers form where snowfall exceeds {{b1}} over many years. The snow is compressed into ice, which begins to flow under its own {{b2}}. Where a glacier reaches the sea, pieces break off in a process called {{b3}}.",
    [["melting", "evaporation", "erosion"], ["weight", "colour", "temperature"], ["calving", "freezing", "thawing"]], [0, 0, 0],
    "The lecturer says glaciers form where snowfall exceeds melting, flow because of their own weight, and lose ice at the sea edge by calving.",
    { scenario: "Transcript extract (Section 4, geography lecture): 'A glacier begins life in places where, year after year, more snow falls than melts. Over time the snow compacts into ice. Once the ice is thick enough, it starts to move, deforming and sliding under its own weight. When the glacier reaches the ocean, chunks break off and float away; we call that calving.'", sub: "Note completion", tip: "Notes follow the order of the lecture; check grammar before choosing." }),
  IA_L.mcq("Lectures", E, "What will the lecturer talk about after the short break?",
    ["The causes of coastal erosion", "Methods of protecting the coastline", "The results of the field trip", "The history of the harbour"], 1,
    "The lecturer says causes have been covered and the second half will turn to defence methods such as sea walls.",
    ["Causes were covered before the break.", "After the break she will look at sea walls and other defences.", "The field trip is only mentioned as next week's activity.", "History is mentioned only as background she skipped."],
    { scenario: "Transcript extract (Section 4, geography lecture): 'So that completes the causes of coastal erosion; I've skipped the history of the harbour, which you'll find in your reading. Let's take a ten-minute break. After that, we'll look at ways of protecting the coastline, including sea walls and beach replenishment. The field trip results are for next week.'", sub: "Signposting", tags: ["signposting"] }),

  /* ---------- Reading ---------- */
  IA_R.mcq("Academic passages", M, "What is the main idea of the passage?",
    ["Sleep is mainly a period of physical repair", "Sleep helps the brain stabilise newly learned information", "Short naps are more useful than a full night's sleep", "Memory loss is caused by dreaming"], 1,
    "The passage argues that sleep, especially deep sleep, helps the brain consolidate recent learning.",
    ["Physical repair is not the passage's focus.", "Consolidation of new information during sleep is the central claim.", "The passage does not rank naps above night sleep.", "Dreaming is not blamed for memory loss."],
    { title: "Sleep and Memory", passage: "For much of the twentieth century, sleep was treated as a passive state in which the brain simply rested. Research over the past few decades has overturned that view. When volunteers learn a list of word pairs and are then allowed to sleep, they recall significantly more the next morning than those who stay awake for the same period. Brain recordings suggest why: during deep sleep, patterns of neural activity that occurred during learning are replayed, and the connections involved appear to be strengthened. Sleep, in other words, helps to stabilise fresh memories so that they are less likely to fade.", sub: "Main idea" }),
  IA_R.mcq("Academic passages", M, "In the passage, the word 'robust' is closest in meaning to",
    ["flexible", "strong and resilient", "inexpensive", "quickly produced"], 1,
    "Corals that 'survive heatwaves' that kill weaker colonies are being described as hardy; 'strong and resilient' fits the context.",
    ["Flexibility is not the quality that helps survival here.", "Colonies that survive heat that kills others are strong and resilient.", "Cost is never mentioned in relation to the colonies.", "Speed of production is irrelevant to the sentence."],
    { title: "Restoring Reefs", passage: "Reef restoration projects increasingly grow coral fragments in nurseries before attaching them to damaged reefs. Rather than choosing fragments at random, some teams now select robust colonies, those that have survived heatwaves which bleached and killed their neighbours. The hope is that such colonies carry genetic traits that will help future generations cope with warmer seas. Critics note, however, that selecting for heat tolerance may reduce other useful traits, such as resistance to disease.", sub: "Vocabulary in context", tags: ["vocabulary"] }),
  IA_R.cloze("Academic passages", M, "Complete the summary using the drop-down menus. Choose the word that fits the passage and the grammar.",
    "Tidal turbines generate power from the {{b1}} of water caused by tides. Unlike wind, tides are {{b2}}, so output can be forecast years ahead. However, installation is {{b3}} because equipment must withstand salt water and strong currents.",
    [["movement", "temperature", "weight"], ["predictable", "random", "seasonal"], ["costly", "simple", "illegal"]], [0, 0, 0],
    "The passage says turbines use the movement of tidal water, tides can be predicted accurately, and marine conditions make installation expensive.",
    { title: "Harnessing the Tides", passage: "Tidal turbines resemble underwater wind turbines, but they are driven by the movement of tidal water rather than air. A major advantage is predictability: because tides follow the Moon's cycle, engineers can forecast the output of a tidal array years in advance, something no wind farm can claim. The principal drawback is cost. Equipment has to withstand corrosive salt water and powerful currents, and maintenance often requires specialised vessels, all of which push up the price of each unit of electricity.", sub: "Summary completion" }),
  IA_R.sata("Academic passages", H, "Which TWO statements are supported by the passage?",
    ["Urban green roofs can lower the temperature inside buildings.", "Green roofs are cheaper to install than conventional roofs.", "Plants on a roof absorb some rainwater that would otherwise run into drains.", "Most cities now require green roofs on new buildings.", "Green roofs have been shown to increase building height limits."], [0, 2],
    "The passage links green roofs to cooler interiors and reduced storm-water runoff; cost and legal requirements are not claimed.",
    ["Supported: the soil layer insulates the building below.", "The passage says installation costs are higher, not lower.", "Supported: plants and soil retain part of the rainfall.", "The passage says only a few cities have such rules.", "Height limits are never discussed."],
    { title: "Green Roofs", passage: "A green roof is a roof partly or fully covered with vegetation planted over a waterproof layer. The soil and plants insulate the building, so interiors stay cooler in summer and need less air-conditioning. Green roofs also soak up a proportion of rainfall, reducing the volume of storm water that flows into city drains during heavy storms. Installation is more expensive than for a conventional roof, and the structure must be strong enough to carry the extra weight. A small number of cities have introduced rules encouraging, or in a few cases requiring, green roofs on new developments.", sub: "Select two statements", tip: "Check each option against the exact words of the passage; 'most' and 'a small number' are opposites." }),
  IA_R.mcq("True/False/Not Given", E, "Statement: The Lindgren Observatory is the oldest working telescope site in the country.",
    ["True", "False", "Not Given"], 2,
    "The passage gives the founding date but says nothing about whether it is the oldest working site, so the answer is Not Given.",
    ["The passage does not make this claim.", "The passage does not contradict the statement either.", "The passage gives the founding date but never compares it with other sites."],
    { title: "Lindgren Observatory", passage: "The Lindgren Observatory was founded in 1893 on a hill outside the city, chosen for its dark skies. Its main instrument is a refracting telescope with a 30-centimetre lens. In recent years the observatory has opened to the public on Friday evenings, and volunteers lead groups of up to twenty visitors.", sub: "Not Given", tags: ["tfng"] }),
  IA_R.mcq("True/False/Not Given", M, "Statement: The study found that participants who walked daily felt less stressed than those who did not.",
    ["True", "False", "Not Given"], 1,
    "The passage says there was 'no significant difference' in stress levels, which contradicts the statement.",
    ["The statement claims a difference that was not found.", "The passage reports no significant difference in reported stress, so the statement is contradicted.", "The result is stated directly, so it is not Not Given."],
    { title: "Walking and Wellbeing", passage: "In a six-month study, 200 office workers were asked to walk for thirty minutes every day, while a control group of 200 kept their usual routines. At the end of the period the walkers had slightly lower blood pressure. However, there was no significant difference in reported stress levels between the two groups, which surprised the researchers.", sub: "False: contradiction", tags: ["tfng"] }),
  IA_R.mcq("True/False/Not Given", M, "Statement: All of the museum's collections can now be viewed online.",
    ["True", "False", "Not Given"], 1,
    "'Roughly half' of the collections are online, which contradicts 'all'.",
    ["Only about half is online, so the statement is wrong.", "'Roughly half' contradicts 'all'.", "The passage does give the proportion."],
    { title: "The Digital Museum", passage: "The city museum has spent three years photographing and cataloguing its collections. Roughly half of the objects can now be browsed on its website, and the curators hope to complete the project by the end of next year. Visitors can search by date, material or place of origin.", sub: "Quantifiers", tags: ["tfng"], tip: "Watch for absolute words such as 'all', 'never' and 'only'." }),
  IA_R.mcq("True/False/Not Given", H, "Statement: Several of the researchers disagreed about the cause of the decline in bird numbers.",
    ["True", "False", "Not Given"], 0,
    "The passage states that 'opinion was divided', with some blaming habitat loss and others blaming pesticides, which paraphrases the statement.",
    ["'Opinion was divided' paraphrases 'several disagreed'.", "The passage does not say they agreed.", "The disagreement is explicit, so it is not Not Given."],
    { title: "Disappearing Birds", passage: "Between 1990 and 2015, the number of farmland birds in the region fell by almost a third. Opinion among the researchers who studied the decline was divided: one group blamed the loss of hedgerows and other habitat, while another pointed to the increased use of pesticides that reduce insect food. The report concluded that both factors probably contributed.", sub: "Paraphrase", tags: ["tfng"] }),

  /* ---------- Writing ---------- */
  IA_W.mcq("Task 1 (data description)", M, "Which sentence is the best OVERVIEW for the table below?",
    ["In 2000, 12% of people in Country A used the bus, and in 2020 the figure was 9%.", "Overall, car use rose in all three countries, while bus use declined, with Country C showing the largest changes.", "The table shows the percentage of people who used cars and buses in three countries.", "Country B had the highest car use because it has the most roads."], 1,
    "An overview summarises the main trends and key comparisons without detailed figures.",
    ["This gives specific figures, which belong in the body paragraphs.", "It identifies the main trends and the most notable comparison.", "This paraphrases the task title; it is the introduction, not the overview.", "It gives a reason that is not in the data."],
    { title: "Commuters using each mode of transport (%)", table: { columns: ["Country", "Car 2000", "Car 2020", "Bus 2000", "Bus 2020"], rows: [["A", "48", "55", "12", "9"], ["B", "60", "66", "8", "5"], ["C", "35", "52", "25", "14"]] }, sub: "Writing an overview", tags: ["overview"] }),
  IA_W.cloze("Task 1 (data description)", M, "Choose the best word for each gap in this description of a line graph.",
    "Sales of electric bicycles {{b1}} sharply from 2015 to 2018, before {{b2}} at around 40,000 units for the next two years. Sales of conventional bicycles, by contrast, {{b3}} steadily over the period.",
    [["rose", "raised", "arose"], ["levelling off", "levelled out", "levelling"], ["declined", "declines", "declining"]], [0, 0, 0],
    "'Rose' is the intransitive past tense of rise; 'levelling off' follows 'before' as a gerund; 'declined' is the past simple that matches the time frame.",
    { sub: "Trend language", tags: ["trend-language", "grammar"], tip: "'Rise' does not take an object; 'raise' does." }),
  IA_W.writing("Task 1 (data description)", M, "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    "The table below shows the average number of hours per week that students at three universities spent on different activities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    150, "IELTS Academic Writing Task 1", IELTS_WRITING_RUBRIC,
    "The table compares how many hours per week students at three universities devote to study, paid work and leisure.\n\nOverall, students at University A spend the most time studying, whereas those at University C work the longest hours in paid jobs. Leisure time is highest at University B.\n\nStudents at University A study for 24 hours a week, which is four hours more than their counterparts at University B (20 hours) and nine more than those at University C (15 hours). Paid work shows the opposite pattern: University C students work 14 hours, compared with 8 at University B and only 5 at University A.\n\nAs regards leisure, University B students enjoy 21 hours, slightly more than University A (18 hours) and considerably more than University C (13 hours). Notably, University C is the only institution where work and leisure hours are almost identical.",
    "A strong Task 1 report paraphrases the task, gives a clear overview of the highest and lowest values, and groups comparisons logically.",
    { title: "Weekly hours by activity", table: { columns: ["University", "Study", "Paid work", "Leisure"], rows: [["A", "24", "5", "18"], ["B", "20", "8", "21"], ["C", "15", "14", "13"]] }, sub: "Comparing three categories", tags: ["task-1"] }),
  IA_W.mcq("Task 2 (essay)", M, "Which is the strongest thesis statement for an essay on whether children should learn a foreign language at primary school?",
    ["Language learning is a topic that many people talk about nowadays.", "I will discuss the advantages and disadvantages of this idea.", "Although timetable pressure is a genuine concern, I believe children should start a foreign language at primary school because young learners acquire pronunciation more naturally and gain confidence early.", "Children should learn many things at school, including languages and sport."], 2,
    "A good thesis states a clear position, acknowledges the other side, and previews the main reasons.",
    ["This is a vague generalisation that takes no position.", "It announces the task without giving an opinion.", "It states a position, concedes a counterpoint and previews two reasons.", "It is too general and does not address the question directly."],
    { sub: "Thesis statements", tags: ["thesis"] }),
  IA_W.sata("Task 2 (essay)", M, "Which TWO features are typical of an effective body paragraph in an IELTS essay?",
    ["A clear topic sentence stating one main idea", "A list of several unrelated points", "Explanation and an example that support the main idea", "A new argument introduced in the conclusion", "Informal expressions such as 'a lot of stuff'"], [0, 2],
    "Effective body paragraphs are built around one main idea that is explained and supported with an example.",
    ["A topic sentence gives the paragraph direction.", "Unrelated points weaken coherence.", "Explanation and examples develop the idea.", "A conclusion should not contain new arguments.", "Informal language lowers the lexical resource score."],
    { sub: "Paragraph structure", tags: ["paragraphing"] }),
  IA_W.mcq("Task 2 (essay)", M, "Which linking word best completes the sentence? 'Many people believe that remote work improves productivity; ______, others argue that it weakens team spirit.'",
    ["therefore", "however", "for instance", "similarly"], 1,
    "The second clause contrasts with the first, so 'however' (after a semicolon, with a comma) is correct.",
    ["'Therefore' shows result, not contrast.", "'However' signals the contrasting viewpoint.", "'For instance' introduces an example.", "'Similarly' signals likeness, not contrast."],
    { sub: "Cohesive devices", tags: ["linking"] }),
  IA_W.writing("Task 2 (essay)", H, "Write an essay responding to the prompt below. Give reasons for your answer and include relevant examples.",
    "In many countries, an increasing number of people work from home rather than in an office. Do the advantages of this development outweigh the disadvantages? Write at least 250 words.",
    250, "IELTS Academic Writing Task 2", IELTS_WRITING_RUBRIC,
    "Remote working has expanded rapidly in recent years, and opinions differ about its value. In my view, the advantages outweigh the drawbacks, provided employers take steps to maintain social contact.\n\nThe main benefit is flexibility. Employees who no longer commute save hours each week, which they can spend on family, exercise or study, and this often leads to higher job satisfaction. Employers also gain: they can recruit from a wider geographical area and reduce spending on office space. For example, a software company can hire a skilled engineer who lives in another region without relocating her.\n\nNevertheless, there are real disadvantages. Working alone can be isolating, and younger staff in particular may miss the informal guidance that colleagues give in an office. In addition, the boundary between work and home can blur, leading some people to work longer hours.\n\nThese problems are, however, manageable. Regular video meetings, occasional team days in person and clear expectations about working hours can address most of them, whereas the savings in time and money are permanent.\n\nIn conclusion, although remote work has drawbacks, its benefits are greater, and organisations should adopt it while investing in communication.",
    "A Band 7+ response takes a clear position, develops each side with explanation and examples, and keeps the position consistent in the introduction and conclusion.",
    { sub: "Advantages/disadvantages essay", tags: ["task-2", "essay"] }),

  /* ---------- Speaking ---------- */
  IA_S.mcq("Part 1 interview", E, "The examiner asks: 'Do you enjoy cooking?' Which answer is best for Part 1?",
    ["Yes.", "Yes, I do. I find it relaxing after a long day, and I usually try a new recipe at the weekend.", "Cooking is a basic human activity that has existed for thousands of years.", "I don't know. Next question, please."], 1,
    "Part 1 rewards a direct answer followed by a reason and a short example, in natural language.",
    ["Too short to show fluency or range.", "It answers directly, then adds a reason and a detail.", "This is an off-topic, over-formal lecture.", "Refusing to answer is unhelpful."],
    { sub: "Extending Part 1 answers", tags: ["fluency"] }),
  IA_S.cloze("Part 1 interview", M, "Choose the best option for each gap in this Part 1 answer about hometown.",
    "I {{b1}} in a small coastal town for most of my life, so I'm {{b2}} to the sea. I {{b3}} there since I was born.",
    [["have lived", "am living", "live since"], ["used", "use", "using"], ["have been", "was", "am"]], [0, 0, 0],
    "'Have lived' (present perfect) fits 'most of my life'; 'used to' expresses long familiarity; 'have been' plus 'since' is the correct present perfect pairing.",
    { sub: "Present perfect with since/for", tags: ["grammar"], tip: "Use the present perfect for situations that started in the past and continue now." }),
  IA_S.speaking("Part 2 cue card", M, "Prepare for 1 minute and speak for up to 2 minutes on the cue card.",
    "Describe a teacher who helped you to learn something important.",
    60, 120, ["Who the teacher was", "What subject or skill the teacher taught you", "How the teacher helped you", "And explain why this help was important to you"], IELTS_SPEAKING_RUBRIC,
    "I'd like to talk about my secondary school chemistry teacher, Mr Okafor. He taught me for two years, and what I learned from him was not only chemistry but also how to ask good questions. At first I found the subject difficult and was afraid of making mistakes, but he used to say that a wrong answer was just a step towards the right one. He stayed after class to explain experiments, and he encouraged me to design my own. Because of him, I gained the confidence to study science at university. Looking back, I think his patience taught me to value persistence, which has helped me far beyond the classroom.",
    "A strong Part 2 answer covers each cue point in order, uses past tenses accurately, and ends with a reflection.",
    { sub: "Describing a person", tags: ["part-2"] }),
  IA_S.mcq("Part 2 cue card", M, "You run out of ideas after one minute of your Part 2 talk. What is the best strategy?",
    ["Stop speaking and wait for the examiner", "Repeat your first sentence several times", "Return to the cue-card prompts and add detail, feelings or an example", "Switch to a completely different topic"], 2,
    "The prompts on the card are a ready-made source of extra detail; examples and feelings extend a talk naturally.",
    ["Stopping early limits fluency evidence.", "Repetition lowers coherence and range.", "Using the prompts to add details and feelings fills the time naturally.", "Changing topic harms task relevance."],
    { sub: "Filling two minutes", tags: ["strategy"] }),
  IA_S.mcq("Part 3 discussion", H, "The examiner asks: 'Will online learning replace classrooms in the future?' Which response shows the best development?",
    ["No, I don't think so.", "It's possible. Online courses are cheaper and more flexible, so they'll probably grow. On the other hand, younger children need social contact, so I suspect classrooms will remain, but in a more blended form.", "Online learning is on the internet and classrooms are in buildings.", "I have never studied online, so I cannot say."], 1,
    "A Part 3 answer weighs two sides, uses speculative language, and reaches a balanced conclusion.",
    ["A short answer with no reasons.", "It gives reasons on both sides and speculates with 'probably' and 'I suspect'.", "It states obvious facts without addressing the question.", "Declining to speculate avoids the task."],
    { sub: "Speculating about the future", tags: ["speculation"] }),
  IA_S.sata("Part 3 discussion", M, "Which TWO techniques help you develop an answer to an abstract Part 3 question?",
    ["Comparing past and present", "Giving a one-word answer and waiting", "Offering a reason and a short example", "Memorising a long answer in advance", "Refusing to give an opinion"], [0, 2],
    "Comparison and reason-plus-example are reliable ways to expand abstract answers naturally.",
    ["Comparing then and now gives easy material.", "Short answers give little language for assessment.", "Reasons and examples make ideas concrete.", "Memorised answers sound unnatural and examiners may penalise them.", "An opinion is usually expected in discussion."],
    { sub: "Developing answers", tags: ["strategy"] }),
  IA_S.mcq("Part 3 discussion", M, "Which expression is most suitable for speculating about the future?",
    ["It will definitely be so.", "It might well become more common.", "It was more common.", "It is the common one."], 1,
    "Modal verbs with adverbs such as 'might well' show tentative prediction, a feature of higher-band speaking.",
    ["Too absolute for an uncertain prediction.", "It expresses tentative future possibility.", "This refers to the past.", "This is not a meaningful prediction."],
    { sub: "Hedging language", tags: ["language"] }),
];

/* ================================================================== */
/* IELTS GENERAL TRAINING                                             */
/* ================================================================== */
const IG_L = sec("ielts-general", "Listening");
const IG_R = sec("ielts-general", "Reading");
const IG_W = sec("ielts-general", "Writing");
const IG_S = sec("ielts-general", "Speaking");

const IG_QUESTIONS: SeedQuestion[] = [
  /* ---------- Listening ---------- */
  IG_L.mcq("Social contexts", E, "What time will the table be booked for?",
    ["6.30 pm", "7.00 pm", "7.30 pm", "8.00 pm"], 2,
    "The caller first asks for seven, but the restaurant has no space and offers seven-thirty, which she accepts.",
    ["Six-thirty is not mentioned in the conversation.", "Seven is requested but unavailable.", "Seven-thirty is offered and accepted.", "Eight is mentioned as the latest possible time, which she declines."],
    { scenario: "Transcript extract (Section 1, restaurant booking): Caller: 'I'd like a table for six on Friday, please, at seven.' Staff: 'I'm sorry, we're fully booked at seven. I could offer you seven-thirty or eight.' Caller: 'Eight is a bit late for the children. Seven-thirty will be fine.' Staff: 'Lovely, a table for six at seven-thirty, in the name of?'", sub: "Booking details", tags: ["distractors"] }),
  IG_L.sata("Social contexts", M, "Which TWO activities are offered on Saturday mornings at the community centre?",
    ["Yoga for beginners", "Painting for children", "Chess club", "Cooking for adults", "Computer skills"], [0, 3],
    "The receptionist places yoga and cooking on Saturday mornings; painting and chess are on weekdays, and computer skills is currently full.",
    ["Yoga is on Saturday at nine.", "Painting runs on Wednesday afternoons.", "Chess is on Tuesday evenings.", "Cooking for adults runs on Saturdays at ten.", "Computer skills classes are not running at present."],
    { scenario: "Transcript extract (Section 1, community centre enquiry): 'On Saturday mornings we have yoga for beginners at nine, and then an adult cooking class at ten. Painting for children is on Wednesday afternoons, and chess club meets on Tuesday evenings. We did run computer skills classes, but they're on hold until the new term.'", sub: "Selecting two options" }),
  IG_L.mcq("Social contexts", M, "Where exactly is the pharmacy?",
    ["Next to the bank", "Opposite the post office", "Behind the bus station", "On the corner of the roundabout"], 1,
    "After turning left at the roundabout, the pharmacy is opposite the post office; the bank is only a landmark.",
    ["The bank is a landmark passed on the way.", "The speaker says it is directly opposite the post office.", "The bus station is the starting point.", "The roundabout is where you turn left, not where the pharmacy stands."],
    { scenario: "Transcript extract (Section 1, directions): 'From the bus station, walk straight ahead, past the bank, until you reach the roundabout. Turn left there, and the pharmacy is a little way along on your right, opposite the post office. You can't miss it, it has a green sign.'", sub: "Following directions", tags: ["directions"] }),
  IG_L.cloze("Social contexts", M, "Complete the booking form using the drop-down menus.",
    "Film: {{b1}}. Number of tickets: {{b2}}. Pay by: {{b3}}.",
    [["The Last Harbour", "The Lost Harbour", "The Late Harbour"], ["four", "five", "fourteen"], ["credit card", "cash at the door", "bank transfer"]], [0, 0, 0],
    "The caller spells out the title, corrects 'fourteen' to 'four', and says she will pay by card over the phone.",
    { scenario: "Transcript extract (Section 1, cinema booking): Caller: 'Tickets for The Last Harbour, please. L-A-S-T.' Staff: 'Four tickets? Or fourteen?' Caller: 'Just four, thank you.' Staff: 'Would you like to pay at the door?' Caller: 'No, I'll give you my credit card details now, if that's all right.'", sub: "Form completion", tip: "Listen for spelling and numbers that sound alike, such as 'four' and 'fourteen'." }),
  IG_L.mcq("Training contexts", E, "What should trainees do first if the fire alarm sounds?",
    ["Collect their belongings", "Use the lifts", "Leave by the nearest exit and go to the assembly point", "Call their line manager"], 2,
    "The trainer instructs trainees to leave immediately by the nearest exit without stopping for belongings or using lifts.",
    ["Belongings must be left behind.", "Lifts must not be used in a fire.", "Leaving at once and going to the assembly point is the instruction.", "Managers will be accounted for at the assembly point."],
    { scenario: "Transcript extract (Section 2, health and safety induction): 'If you hear the alarm, don't stop to collect your things and don't use the lifts. Leave immediately by the nearest exit and make your way to the assembly point in the car park. Your supervisor will take a register there.'", sub: "Safety instructions" }),
  IG_L.mcq("Training contexts", M, "By when must trainees hand in the first written assignment?",
    ["The end of week two", "The end of week three", "The end of week four", "The end of the course"], 1,
    "The trainer says the original deadline was week four but it has been brought forward to week three.",
    ["Week two is when the practice task is set.", "The deadline was moved from week four to week three.", "Week four was the original date.", "The final project is due at the end of the course, not this assignment."],
    { scenario: "Transcript extract (Section 2, course induction): 'In week two you'll complete a practice task, which isn't marked. The first written assignment was due at the end of week four, but we've brought it forward, so you'll need to submit it by the end of week three. The final project is due on the last day of the course.'", sub: "Changed deadlines", tags: ["distractors"] }),
  IG_L.sata("Training contexts", M, "Which TWO items must trainees bring on the first day?",
    ["Photo identification", "A laptop", "Proof of address", "Safety boots", "A packed lunch"], [0, 3],
    "Photo ID and safety boots are essential; a laptop is provided, proof of address is only needed later, and lunch is available on site.",
    ["Photo ID is required for security passes.", "Laptops are supplied by the company.", "Proof of address is requested in week two.", "Safety boots are compulsory on the workshop floor.", "A canteen serves lunch."],
    { scenario: "Transcript extract (Section 2, trainee welcome): 'On Monday, please bring photo identification, as we need it to issue your security pass. Laptops will be provided, so you needn't bring your own. We'll ask for proof of address in the second week. Because you'll visit the workshop floor, safety boots are compulsory. Lunch is available in the canteen.'", sub: "Selecting required items" }),
  IG_L.mcq("Training contexts", H, "What is the main purpose of the second module, according to the coordinator?",
    ["To introduce the basic safety rules", "To help trainees apply theory to real customer situations", "To prepare trainees for the final written exam", "To assess trainees' computer skills"], 1,
    "The coordinator contrasts the first module (theory and rules) with the second, which uses role-play to practise real customer scenarios.",
    ["Safety rules are covered in module one.", "Module two uses role-play of real customer situations.", "The written exam is covered by revision sessions.", "Computer skills are assessed in a separate test."],
    { scenario: "Transcript extract (Section 2, course coordinator): 'Module one gives you the rules and the theory, including safety. Module two is quite different: you'll work in pairs on role-plays based on real customer situations, so that you can practise what you've learned. Revision for the final exam comes at the end, and your computer skills are tested separately in week six.'", sub: "Purpose of a course component" }),

  /* ---------- Reading ---------- */
  IG_R.mcq("Everyday texts", E, "According to the notice, who may renew library books by telephone?",
    ["All members", "Members aged over 65 only", "Members who have no overdue items", "Children's members"], 2,
    "The notice states that renewal by telephone is available to members without overdue items.",
    ["Telephone renewal is restricted.", "Age is not mentioned as a criterion.", "Only members without overdue items may renew by phone.", "Children's accounts are not discussed."],
    { title: "Library Notice", passage: "Books may be renewed online at any time. Members who have no overdue items may also renew by telephone between 9 am and 5 pm. Items that have been reserved by another member cannot be renewed. A fine of 20 pence per day applies to adult books returned late.", sub: "Reading for detail" }),
  IG_R.mcq("Everyday texts", M, "Which flat best matches the advertisement for a tenant who wants a pet-friendly flat close to the station?",
    ["Flat 1: ground floor, garden, 15 minutes from the station, pets allowed", "Flat 2: second floor, 3 minutes from the station, pets allowed with a deposit", "Flat 3: first floor, 2 minutes from the station, no pets", "Flat 4: top floor, 20 minutes from the station, pets allowed"], 1,
    "Flat 2 is close to the station and allows pets, albeit with a deposit; the others fail on distance or pets.",
    ["Fifteen minutes is not close.", "It meets both conditions.", "No pets are allowed.", "Twenty minutes is too far."],
    { title: "Flats to Let", passage: "Four flats are available this month. Flat 1: ground floor with garden, fifteen minutes' walk from the station, pets welcome. Flat 2: second floor, three minutes from the station, pets allowed with an extra deposit of £150. Flat 3: first floor, two minutes from the station, no pets. Flat 4: top-floor flat with a balcony, twenty minutes from the station, pets allowed.", sub: "Matching requirements", tags: ["scanning"] }),
  IG_R.mcq("Everyday texts", M, "Statement: Visitors may use the swimming pool without paying on the first Sunday of every month.",
    ["True", "False", "Not Given"], 0,
    "The leaflet says that admission to the pool is free on the first Sunday of each month, which matches the statement.",
    ["'Free admission' means no payment.", "The leaflet states the opposite of False.", "The information is given directly."],
    { title: "Riverside Leisure Centre", passage: "The leisure centre offers a 25-metre pool, a gym and a sauna. Admission to the pool is free on the first Sunday of each month. Swimming lessons for children aged five to ten run on Saturday mornings. A locker costs one pound, which is returned when the key is handed back.", sub: "True/False/Not Given", tags: ["tfng"] }),
  IG_R.cloze("Everyday texts", M, "Complete the summary of the recycling guide.",
    "Residents should rinse containers before placing them in the {{b1}} bin. Glass is collected at {{b2}} points rather than from the kerbside. Large items such as furniture must be {{b3}} in advance.",
    [["blue", "green", "black"], ["bottle bank", "kerbside", "doorstep"], ["booked", "ignored", "washed"]], [0, 0, 0],
    "The guide says rinsed containers go in the blue bin, glass goes to bottle banks, and bulky waste must be booked.",
    { title: "Recycling Guide", passage: "Please rinse all plastic and metal containers and place them in the blue bin, which is emptied every second Tuesday. Garden waste goes in the green bin. Glass is not collected from the kerbside; please take it to a bottle bank. Bulky items such as sofas and mattresses must be booked in advance by calling the council.", sub: "Summary completion" }),
  IG_R.mcq("Workplace texts", E, "Which qualification is ESSENTIAL for the post of receptionist?",
    ["A degree in business", "Experience of using a computer", "A foreign language", "A driving licence"], 1,
    "The advert says computer experience is essential; the other items are described as desirable.",
    ["No degree is required.", "Computer experience is listed as essential.", "A second language is only an advantage.", "A driving licence is desirable but not required."],
    { title: "Vacancy: Receptionist", passage: "We are looking for a friendly receptionist to join our busy dental practice. Essential: good communication skills and experience of using a computer. Desirable: knowledge of a second language and a full driving licence. Hours are 8.30 am to 5.30 pm, Monday to Friday.", sub: "Essential vs desirable", tags: ["scanning"] }),
  IG_R.mcq("Workplace texts", M, "What must an employee do if they are too ill to attend work?",
    ["Send an email before 9 am", "Phone their line manager before 9 am", "Ask a colleague to inform HR", "Provide a doctor's note on the first day"], 1,
    "The handbook requires a phone call to the line manager before 9 am; email alone is not acceptable and a doctor's note is needed only after seven days.",
    ["Email is not accepted as notification.", "The handbook specifies a call to the line manager before nine.", "Colleagues may not report absence on behalf of staff.", "A medical note is required only after a week."],
    { title: "Staff Handbook: Sickness", passage: "If you are unable to attend work because of illness, you must telephone your line manager before 9 am on the first day of absence. Email is not an acceptable method of notification. A medical certificate is required if your absence lasts longer than seven calendar days.", sub: "Procedures", tags: ["procedure"] }),
  IG_R.sata("Workplace texts", H, "Which TWO statements about the training policy are correct?",
    ["Employees may attend paid training during working hours.", "All training must be completed outside working hours.", "Managers must approve a course before booking.", "Employees must pay for courses and claim the cost back later.", "Training is available only to full-time staff."], [0, 2],
    "The policy allows paid study time during work hours and requires manager approval; fees are paid by the company and part-time staff are eligible.",
    ["Time is allowed in working hours.", "The policy says the opposite.", "Manager approval is mandatory.", "The company pays fees directly.", "Part-time staff are covered on a pro rata basis."],
    { title: "Training Policy", passage: "The company supports staff development. Employees may attend approved training during working hours without loss of pay. Before booking any course, an employee must obtain written approval from their manager. Course fees are paid directly by the company. Part-time staff are eligible, with study time calculated pro rata.", sub: "Select two statements", tip: "Match each option to a sentence; reject any that reverse a detail." }),
  IG_R.mcq("Workplace texts", H, "Statement: Staff must stop using the shared printer after 6 pm for security reasons.",
    ["True", "False", "Not Given"], 2,
    "The memo says the printer is unavailable after 6 pm but gives no reason, so the reason in the statement is Not Given.",
    ["The memo states the restriction but not the reason.", "The restriction itself is stated.", "The reason is absent, so the statement cannot be confirmed."],
    { title: "Office Memo", passage: "From next Monday, the shared printer on the second floor will be unavailable after 6 pm. Staff who need to print documents later in the day should use the printers on the ground floor. Please remember to collect your printing promptly, as unclaimed documents will be recycled each Friday.", sub: "Causes not stated", tags: ["tfng"] }),

  /* ---------- Writing ---------- */
  IG_W.mcq("Task 1 (letter)", E, "You are writing to Mr Hughes, whom you do not know, to complain about a faulty product. Which opening and closing are correct?",
    ["Hi Mr Hughes / Best wishes", "Dear Mr Hughes / Yours sincerely", "Dear Sir / Yours sincerely", "Dear Mr Hughes / Yours faithfully"], 1,
    "When you use the person's name, the standard closing is 'Yours sincerely'; 'Yours faithfully' goes with 'Dear Sir or Madam'.",
    ["Too informal for a formal complaint.", "Named recipient with 'Yours sincerely' is correct.", "'Dear Sir' with a named recipient is inconsistent and 'Sir' is not correct for a named person.", "'Yours faithfully' does not match a named recipient."],
    { sub: "Letter conventions", tags: ["formal-letter"] }),
  IG_W.mcq("Task 1 (letter)", M, "Which sentence has the most appropriate tone for a letter to your landlord requesting a repair?",
    ["Fix the heating right now or I'll move out!", "I would be grateful if you could arrange for the heating to be repaired as soon as possible.", "Hey, the heating's bust again, can you sort it?", "The heating is not working and it is your fault."], 1,
    "Formal requests use polite, indirect forms such as 'I would be grateful if you could'.",
    ["Aggressive and inappropriate.", "Polite, formal and clear.", "Too casual for a formal letter.", "Blaming is unhelpful and impolite."],
    { sub: "Register and tone", tags: ["register"] }),
  IG_W.cloze("Task 1 (letter)", M, "Choose the best phrase for each gap in this letter to a hotel manager.",
    "I am writing {{b1}} the poor service I received during my stay from 3 to 6 May. {{b2}}, the room was not cleaned for two days. I would therefore {{b3}} a partial refund.",
    [["to complain about", "for complain about", "complaining"], ["For example", "Because of", "Although"], ["appreciate", "like to request", "be requesting for"]], [0, 0, 1],
    "'To complain about' states purpose; 'For example' introduces a detail; 'would like to request' is a formal request structure.",
    { sub: "Complaint language", tags: ["formal-letter", "functional-language"] }),
  IG_W.writing("Task 1 (letter)", M, "Write a letter. You should write at least 150 words. You do NOT need to write any addresses.",
    "You recently bought a laptop online, but it stopped working after a week. Write a letter to the customer service manager. In your letter: describe the problem; explain what you have already done about it; say what you would like the company to do. Begin your letter 'Dear Sir or Madam,'.",
    150, "IELTS General Training Writing Task 1", IELTS_WRITING_RUBRIC,
    "Dear Sir or Madam,\n\nI am writing to complain about a laptop I bought from your website on 2 March, order number 48213.\n\nThe laptop worked normally for six days. After that, the screen began to flicker and then went completely black, and it no longer turns on, even when connected to the charger. Since I use the computer for my university work, this has caused me considerable inconvenience.\n\nI have already tried the troubleshooting steps on your website, including resetting the battery, and I contacted your helpline on 10 March. The adviser promised that someone would call me back within two days, but I have heard nothing since.\n\nI would therefore be grateful if you could either replace the laptop or give me a full refund. I would also appreciate a reply within seven days.\n\nI look forward to hearing from you.\n\nYours faithfully,\nA. Rahman",
    "A high-scoring letter covers all three bullet points, uses a formal tone, and closes with 'Yours faithfully' to match 'Dear Sir or Madam'.",
    { sub: "Formal complaint letter", tags: ["task-1", "letter"] }),
  IG_W.mcq("Task 2 (essay)", M, "Which is the best paraphrase of the prompt 'Some people think that children should do household chores. Others disagree'?",
    ["Some people believe children should help at home, while others do not.", "Children and chores are a topic.", "Some people think that children should do household chores, others disagree.", "Chores are done by children in some homes, not in others."], 0,
    "A good paraphrase keeps the meaning but changes the vocabulary and structure rather than copying.",
    ["It restates the idea using different words and structure.", "Too vague; it loses the contrast.", "It copies the prompt almost exactly.", "It changes the meaning to who does chores, not opinions."],
    { sub: "Paraphrasing the prompt", tags: ["introduction"] }),
  IG_W.writing("Task 2 (essay)", H, "Write about the following topic. Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
    "Some people think that students should study subjects that will help them find a job. Others believe that students should be free to study any subject they enjoy. Discuss both views and give your own opinion. Write at least 250 words.",
    250, "IELTS General Training Writing Task 2", IELTS_WRITING_RUBRIC,
    "Choosing what to study is one of the most important decisions in a young person's life. While some argue that employment prospects should come first, others insist on freedom of choice. In my opinion, a balance between the two is the wisest approach.\n\nThose who favour job-oriented subjects point out that education is expensive and unemployment is a real risk. A graduate in engineering or nursing is often more likely to find stable work than one in a field with fewer vacancies. Families who make sacrifices to fund study naturally expect a return.\n\nOn the other hand, students who choose subjects they enjoy are usually more motivated and tend to achieve higher grades. A person who loves history, for example, may become a skilled researcher or teacher and may contribute to society in ways that are hard to measure. Moreover, the job market changes quickly, so skills such as critical thinking, which many general subjects develop, remain valuable.\n\nI believe that students should consider both factors. They can choose a subject they care about while adding practical skills, such as data analysis or a second language, that employers value.\n\nIn conclusion, neither view is entirely right. The best choice combines genuine interest with an awareness of the working world.",
    "A strong discussion essay presents both views fairly, develops each with reasons, and gives a clear, consistent opinion.",
    { sub: "Discuss both views", tags: ["task-2", "essay"] }),
  IG_W.mcq("Task 2 (essay)", M, "Which sentence is the best conclusion to an essay arguing that cities should build more cycle lanes?",
    ["In conclusion, cities should invest in cycle lanes because they reduce traffic and pollution while improving public health.", "To sum up, I have another point: cyclists wear helmets.", "Cycle lanes are painted green in many cities.", "That is all I want to say, thank you."], 0,
    "A conclusion restates the position and main reasons without adding new arguments.",
    ["Restates the position and summarises main reasons.", "Introduces a new point.", "Gives an irrelevant fact.", "Is informal and does not summarise."],
    { sub: "Conclusions", tags: ["conclusion"] }),

  /* ---------- Speaking ---------- */
  IG_S.mcq("Part 1 interview", E, "The examiner asks: 'What kind of weather do you like?' Which answer is best?",
    ["Good.", "I prefer mild, sunny weather because I enjoy walking outdoors, but I don't mind rain if I have a good coat.", "Weather is caused by the atmosphere.", "I never think about weather."], 1,
    "A natural answer gives a preference, a reason and a small extension.",
    ["Too short.", "A preference with a reason and extension.", "Off topic and too technical.", "Dismissive and unhelpful."],
    { sub: "Part 1 answers", tags: ["fluency"] }),
  IG_S.mcq("Part 1 interview", M, "Which sentence correctly describes a past habit?",
    ["When I was a child, I was playing football every day.", "When I was a child, I used to play football every day.", "When I was a child, I use to play football every day.", "When I was a child, I am playing football every day."], 1,
    "'Used to' + base verb describes past habits that no longer happen.",
    ["The past continuous is not used for repeated habits here.", "'Used to play' is the correct form.", "The form is 'used to', not 'use to', in the affirmative.", "A present tense does not match a past time."],
    { sub: "Talking about habits", tags: ["grammar"] }),
  IG_S.speaking("Part 2 cue card", M, "Prepare for 1 minute and speak for up to 2 minutes on the cue card.",
    "Describe a useful skill that you learned outside school or work.",
    60, 120, ["What the skill is", "When and how you learned it", "Who helped you", "And explain why the skill is useful"], IELTS_SPEAKING_RUBRIC,
    "I'd like to talk about learning to cook. I started when I was fifteen, mainly because my parents were working late and I got tired of eating snacks. My grandmother taught me. She showed me how to make simple dishes like rice and lentils, and she was very patient when I burned the first batch. Over time I learned how to plan a meal and shop sensibly. The skill is useful because it saves money, it is healthier than takeaway food, and it lets me cook for friends. It has also made me more independent since I moved to another city.",
    "A strong response follows the cue points in order, uses past tenses and ends with the personal value of the skill.",
    { sub: "Describing a skill", tags: ["part-2"] }),
  IG_S.mcq("Part 2 cue card", E, "During the one minute of preparation for Part 2, what is the most useful thing to do?",
    ["Write the full speech word for word", "Note key words for each prompt and one example", "Close your eyes and relax", "Ask the examiner to repeat the topic repeatedly"], 1,
    "Short notes for each prompt provide a structure without causing you to read a script.",
    ["One minute is too short for a script.", "Key words and an example give structure.", "Doing nothing wastes preparation time.", "Repeated requests waste time."],
    { sub: "Using preparation time", tags: ["strategy"] }),
  IG_S.mcq("Part 3 discussion", M, "The examiner asks: 'Do people learn more from experience or from books?' Which response is most developed?",
    ["Experience.", "I think experience teaches practical skills, such as driving, whereas books give background knowledge. So, in my view, the two complement each other.", "Books are made of paper.", "I don't read."], 1,
    "Comparing two sources and reaching a balanced conclusion shows range and coherence.",
    ["Too brief.", "Compares both and gives an example and a conclusion.", "Irrelevant.", "Offers no answer."],
    { sub: "Comparing", tags: ["part-3"] }),
  IG_S.sata("Part 3 discussion", M, "Which TWO phrases are useful for giving opinions in Part 3?",
    ["In my opinion", "As far as I'm concerned", "Yes, no", "I don't know anything", "Maybe not"], [0, 1],
    "'In my opinion' and 'As far as I'm concerned' introduce a view naturally.",
    ["A standard opinion marker.", "A natural, slightly more advanced opinion marker.", "Too short and not a phrase for opinions.", "It avoids answering.", "Too vague to introduce an opinion."],
    { sub: "Opinion phrases", tags: ["language"] }),
  IG_S.mcq("Part 3 discussion", H, "Which answer best shows the use of a conditional to speculate?",
    ["If more people worked from home, traffic would probably decrease.", "More people worked from home so traffic was less.", "Traffic decrease when working from home.", "People work from home."], 0,
    "The second conditional ('if ... would') is useful for hypothetical situations.",
    ["Second conditional used accurately.", "Past simple describes a fact, not speculation.", "Ungrammatical.", "Simple statement without speculation."],
    { sub: "Conditionals", tags: ["grammar"] }),
];

/* ================================================================== */
/* OET NURSING                                                        */
/* ================================================================== */
const ON_L = sec("oet-nursing", "Listening");
const ON_R = sec("oet-nursing", "Reading");
const ON_W = sec("oet-nursing", "Writing");
const ON_S = sec("oet-nursing", "Speaking");

const ON_QUESTIONS: SeedQuestion[] = [
  /* ---------- Listening ---------- */
  ON_L.mcq("Consultation extracts", M, "Why does the nurse recommend that Mr Owusu use a spacer with his inhaler?",
    ["It makes the inhaler cheaper to use", "It helps more of the medicine reach his lungs", "It removes the need to shake the inhaler", "It lets him take fewer doses each day"], 1,
    "The nurse explains that a spacer holds the medicine so that more reaches the lungs and less stays in the mouth and throat.",
    ["Cost is not mentioned.", "The spacer delivers more medicine to the lungs and reduces deposit in the mouth.", "He must still shake the inhaler before use.", "The dose schedule does not change."],
    { scenario: "Transcript extract (Consultation, practice nurse and patient): Nurse: 'Mr Owusu, I'd like you to try a spacer. It's this plastic tube that fits between your inhaler and your mouth. When you press the inhaler, the medicine is held inside the tube, so you can breathe it in slowly. That way more of it gets down into your lungs and less is left at the back of your throat, which also lowers the chance of a sore mouth. You still shake the inhaler first, and the doses stay the same.'", sub: "Purpose of an instruction", tags: ["asthma", "patient-education"] }),
  ON_L.mcq("Consultation extracts", M, "What is Mrs Kaur most worried about?",
    ["The pain in her knee", "Being unable to lift her grandchild", "The cost of physiotherapy", "Taking tablets with food"], 1,
    "She says the pain is bearable but what troubles her is not being able to pick up her grandchild.",
    ["She describes the pain as manageable.", "She states that this is what troubles her most.", "Cost is not mentioned by her.", "Food and tablets are not her concern."],
    { scenario: "Transcript extract (Consultation, nurse and patient): Nurse: 'How is the knee pain?' Mrs Kaur: 'Well, it's a dull ache, and I can put up with that. The tablets are fine, I take them with breakfast. What really bothers me is that I can't pick up my little granddaughter any more. She's just turned one, and I don't want her to think I've stopped caring.'", sub: "Patient concern", tags: ["patient-perspective"] }),
  ON_L.cloze("Consultation extracts", M, "Complete the nurse's notes using the drop-down menus.",
    "Antibiotic tablets to be taken {{b1}} a day for {{b2}} days, {{b3}} food.",
    [["three times", "once", "every hour"], ["seven", "seventeen", "seventy"], ["with", "without", "instead of"]], [0, 0, 0],
    "The nurse says three times daily for seven days, with food to reduce stomach upset.",
    { scenario: "Transcript extract (Consultation, nurse and patient): Nurse: 'These are your antibiotics. Take one tablet three times a day, so morning, afternoon and bedtime, for seven days. Please take them with food, as they can upset your stomach. Even if you feel better after three days, finish the course.'", sub: "Dosage details", tags: ["medication"] }),
  ON_L.mcq("Workplace extracts", M, "What does the night nurse ask her colleague to do for Mr Lim in Bed 6?",
    ["Give him pain relief at midnight", "Check on him every hour because he is a falls risk", "Move him to a single room", "Remove his bedside rails"], 1,
    "She says he gets up without calling and asks for hourly checks.",
    ["Pain relief has been given already.", "Hourly checks are requested because he is a falls risk.", "A move is not requested.", "Rails are not discussed."],
    { scenario: "Transcript extract (Workplace, handover): 'Mr Lim in Bed 6 has been quite restless. He's had his pain relief already, so that's not the issue. He keeps getting up to use the toilet without ringing, and he's unsteady on his feet, so he's a falls risk. Could you pop in every hour tonight and make sure his call bell is within reach?'", sub: "Handover request", tags: ["falls", "handover"] }),
  ON_L.mcq("Workplace extracts", H, "What is the purpose of the new hand hygiene audit, according to the ward manager?",
    ["To identify staff who should be disciplined", "To find where practice can be improved", "To reduce the number of visitors", "To test the quality of the soap"], 1,
    "She says the audit is not about blame; its aim is to find where practice can improve.",
    ["She explicitly says it is not about blame.", "The audit aims to identify areas for improvement.", "Visitors are not mentioned as the aim.", "Soap quality is mentioned only in passing."],
    { scenario: "Transcript extract (Workplace, ward meeting): Manager: 'I know some of you are nervous about the audit. Let me be clear: it isn't about blaming anyone or taking action against individuals. Observers will simply note when hand hygiene happens, and we'll use the results to see where we can improve. We'll also check that dispensers are full, but the brand of soap isn't being assessed.'", sub: "Speaker's purpose", tags: ["infection-control"] }),
  ON_L.mcq("Workplace extracts", E, "What do the two nurses agree about the weekend shift?",
    ["Anna will work Saturday and Dev will work Sunday", "Anna will work Sunday and Dev will work Saturday", "They will both work Saturday", "Neither will work the weekend"], 0,
    "After a first suggestion is rejected, they agree that Anna covers Saturday and Dev covers Sunday.",
    ["This is the final arrangement.", "This was Dev's first suggestion, which Anna declined.", "They agree to divide the days.", "They both work."],
    { scenario: "Transcript extract (Workplace, two nurses): Dev: 'Could you take Sunday, and I'll do Saturday?' Anna: 'I can't do Sunday, I'm visiting my parents. But I can cover Saturday if you take Sunday.' Dev: 'That works for me. Saturday for you, Sunday for me.'", sub: "Final decision", tags: ["shift"] }),
  ON_L.mcq("Presentations", M, "What is the speaker's main recommendation for preventing pressure injuries?",
    ["Using more expensive mattresses for all patients", "Regular repositioning of patients at risk", "Reducing the number of dressings", "Avoiding all contact with the skin"], 1,
    "She stresses that regular repositioning is the most important measure, with equipment as a support.",
    ["Equipment is described as supportive, not the main measure.", "Repositioning at regular intervals is the key recommendation.", "Dressings are not the focus.", "Skin contact is necessary for care."],
    { scenario: "Transcript extract (Presentation, nurse educator): 'Specialist mattresses are helpful, but they are not a substitute for care. The single most effective measure is to reposition patients at risk at regular intervals, according to their care plan, and to document it every time. Equipment supports this; it never replaces it.'", sub: "Main recommendation", tags: ["pressure-injury"] }),
  ON_L.mcq("Presentations", H, "How does the speaker feel about the results of the ward's falls reduction programme?",
    ["Disappointed that the number of falls stayed the same", "Encouraged but aware that the programme needs continuing effort", "Surprised that so few staff took part", "Certain that no further action is needed"], 1,
    "She reports a fall in incidents but warns that improvement will not last without continued effort.",
    ["Falls decreased.", "She welcomes the fall but says the work must continue.", "Participation was described as high.", "She explicitly says the effort must continue."],
    { scenario: "Transcript extract (Presentation, clinical nurse manager): 'Over the past year, falls on our ward dropped by about a third, which is pleasing, and I want to thank everyone who joined the training. Having said that, we've seen programmes like this fade when attention moves elsewhere. So I'd ask that we keep the hourly rounds going and continue to review the risk assessments.'", sub: "Speaker's attitude", tags: ["attitude", "falls"] }),
  ON_L.cloze("Presentations", M, "Complete the presenter's notes using the drop-down menus.",
    "Early recognition of a deteriorating patient depends on regular {{b1}} and prompt {{b2}} to the senior nurse. The patient's own family can also {{b3}} subtle changes.",
    [["observations", "meals", "visits"], ["escalation", "discharge", "billing"], ["notice", "prescribe", "ignore"]], [0, 0, 0],
    "The presenter links early recognition to regular observations, prompt escalation and families who notice subtle changes.",
    { scenario: "Transcript extract (Presentation, ward educator): 'Spotting a patient who is getting worse comes down to two habits: carrying out regular observations and escalating promptly to the senior nurse when something changes. Don't forget family members, who know the patient best and are often the first to notice subtle changes, such as unusual drowsiness.'", sub: "Note completion", tags: ["deterioration"] }),

  /* ---------- Reading ---------- */
  ON_R.mcq("Expeditious reading", E, "Within how many minutes must a blood specimen reach the laboratory, according to the ward policy?",
    ["10 minutes", "30 minutes", "60 minutes", "2 hours"], 1,
    "The policy states specimens must reach the laboratory within thirty minutes.",
    ["Ten minutes is the time to complete labelling.", "Thirty minutes is stated.", "Sixty minutes applies to urine samples.", "Two hours is the storage limit for non-urgent samples elsewhere."],
    { title: "Ward 6 Specimen Policy (extract)", passage: "All specimens must be labelled at the bedside with the patient's full name, date of birth and hospital number. Labelling should take place immediately after collection. Blood specimens must reach the laboratory within thirty minutes. Urine specimens should be delivered within sixty minutes. Urgent specimens are to be hand-delivered, not sent through the pneumatic tube.", sub: "Scanning for a number", tags: ["scanning"] }),
  ON_R.mcq("Expeditious reading", M, "Which staff must attend the manual handling update?",
    ["All staff on the ward", "Only new staff", "Staff who have not attended in the last year", "Only staff who work nights"], 2,
    "The notice requires staff whose last session was more than twelve months ago to attend.",
    ["Not every staff member is required.", "New staff have a separate induction.", "Only staff overdue for training must attend.", "Night staff are not singled out."],
    { title: "Staff Notice", passage: "A manual handling update will be held on Thursday at 2 pm in the training room. Staff whose last session was more than twelve months ago must attend. New staff complete this training during induction, and are exempt. Night staff may attend the repeat session at 8 pm on Friday.", sub: "Locating specific information", tags: ["skimming"] }),
  ON_R.mcq("Expeditious reading", M, "What should be done if the dressing becomes wet?",
    ["Leave it in place for 24 hours", "Change it as soon as possible", "Cover it with another dressing", "Remove it and leave the wound open"], 1,
    "The leaflet says that a wet or soiled dressing should be changed promptly.",
    ["Leaving it in place risks infection.", "The instruction is to replace it promptly.", "Layering is not advised.", "Wounds should not be left uncovered."],
    { title: "Wound Dressing Information", passage: "The dressing is designed to remain in place for up to seven days. Keep it dry when showering by covering it with a waterproof protector. If the dressing becomes wet, soiled or loose, it should be changed promptly using aseptic technique. Signs of infection, including increasing redness, heat, swelling or discharge, should be reported to the nurse.", sub: "Specific detail", tags: ["wound-care"] }),
  ON_R.mcq("Expeditious reading", E, "What is the main topic of the memo?",
    ["Changes to visiting hours", "A new system for ordering supplies", "The retirement of a colleague", "Annual leave requests"], 1,
    "The memo introduces an electronic supply ordering process that replaces paper forms.",
    ["Visiting hours are not mentioned.", "The whole memo explains the new ordering system.", "No retirement is mentioned.", "Leave is not discussed."],
    { title: "Memo to Ward Staff", passage: "From 1 March, all requests for ward supplies must be made through the new electronic ordering system. Paper forms will no longer be accepted. Each team leader will receive a login and brief training. Deliveries will be made twice daily, at 8 am and 2 pm.", sub: "Skimming for gist", tags: ["skimming"] }),
  ON_R.mcq("Careful reading", H, "What can be inferred from the passage about pain assessment in people with dementia?",
    ["Patients with dementia do not feel pain", "Behaviour can signal pain when patients cannot describe it", "Self-report scales are always the most reliable tool", "Family members should not be consulted"], 1,
    "The passage says that agitation or withdrawal can indicate unrelieved pain when speech is limited.",
    ["The passage implies the opposite.", "Changes in behaviour are described as potential pain signals.", "Self-report is described as unreliable in advanced dementia.", "Carers' observations are valued."],
    { title: "Assessing Pain in Dementia", passage: "People with advanced dementia may be unable to say that they are in pain, and so their discomfort is often under-recognised. Self-report scales, widely used in other patients, become unreliable as language deteriorates. Nurses are therefore encouraged to watch for changes in behaviour, such as agitation, calling out, grimacing or withdrawal, and to ask family carers whether the person is behaving differently from usual. Where such changes appear, a trial of simple analgesia is often reasonable.", sub: "Inference" }),
  ON_R.mcq("Careful reading", M, "In the passage, the word 'ambulate' most closely means",
    ["to rest in bed", "to walk", "to transport by ambulance", "to examine"], 1,
    "In context, patients are encouraged to ambulate to prevent complications of immobility, meaning walk.",
    ["The context argues against bed rest.", "Ambulate means to walk or move about.", "Ambulance is a related word but not the sense here.", "Examination is not described."],
    { title: "Early Mobility After Surgery", passage: "Prolonged bed rest after surgery is linked with chest infections, blood clots and muscle weakness. For this reason, patients are encouraged to ambulate as soon as it is safe to do so, usually on the first day. Short, frequent walks with support are preferred to a single long one, and pain should be controlled beforehand.", sub: "Vocabulary in context", tags: ["vocabulary"] }),
  ON_R.mcq("Careful reading", H, "What is the writer's attitude towards routine use of urinary catheters?",
    ["Strongly in favour", "Cautious, recommending them only when clearly needed", "Indifferent", "Unaware of the risks"], 1,
    "The writer notes the infection risk and recommends limiting catheters to clear indications.",
    ["The writer lists risks, not benefits alone.", "The advice is to avoid catheters unless there is a clear indication.", "The writer gives specific recommendations, so is not indifferent.", "Risks are described."],
    { title: "Catheter Use", passage: "Urinary catheters are among the most common causes of hospital-acquired infection. Each additional day with a catheter in place increases the risk. While they are indispensable in some situations, such as urinary retention or accurate fluid measurement in critical illness, they are too often inserted for convenience. Clear indications should be documented, and the need for the catheter reviewed daily.", sub: "Writer's attitude", tags: ["attitude"] }),
  ON_R.cloze("Careful reading", M, "Complete the summary of the passage.",
    "Falls are more likely when patients are {{b1}} or taking sedating medication. A nurse should {{b2}} each patient's risk on admission and {{b3}} the plan if their condition changes.",
    [["confused", "alert", "asleep"], ["assess", "ignore", "delay"], ["review", "cancel", "hide"]], [0, 0, 0],
    "The passage lists confusion and sedation as risks, recommends assessment on admission and review when the patient's condition changes.",
    { title: "Falls Risk", passage: "Patients who are confused, unsteady or taking sedating medication are at higher risk of falling in hospital. A falls risk assessment should be completed on admission for every patient. If the patient's condition changes, for example after surgery or a new medication, the plan must be reviewed so that interventions remain appropriate.", sub: "Summary completion", tags: ["falls"] }),

  /* ---------- Writing ---------- */
  ON_W.mcq("Referral letter", M, "Which sentence is the best opening for a referral letter to a community physiotherapist?",
    ["I am writing to refer Mr Hall, a 68-year-old retired teacher, for physiotherapy following a left hip replacement on 3 June.", "Mr Hall is a nice man who had a hip operation.", "As you know, patients often need physiotherapy.", "Please see below for the patient's history, which is long."], 0,
    "A referral letter states who the patient is and why the referral is made in the first sentence.",
    ["It states the patient, the procedure and the purpose.", "It is vague and subjective.", "It is generic and does not state the purpose.", "It does not identify the patient or purpose."],
    { sub: "Purpose statement", tags: ["referral"] }),
  ON_W.mcq("Referral letter", M, "Which case note is LEAST relevant to include in a referral letter about wound care?",
    ["Superficial wound ooze for 3 days, swab negative", "Dressing changed every 3 days", "Patient's favourite television programme", "Allergic to adhesive tape"], 2,
    "Irrelevant personal details should be omitted; clinical information about the wound and allergies matters.",
    ["Relevant wound information.", "Relevant dressing regimen.", "Not relevant to wound care.", "Relevant allergy affecting dressings."],
    { sub: "Selecting relevant content", tags: ["relevance"] }),
  ON_W.cloze("Referral letter", M, "Choose the best language for each gap in the referral letter.",
    "I would be grateful if you {{b1}} assess Mrs Ito's mobility. She {{b2}} a fall on 9 May, {{b3}} she now fears walking alone.",
    [["could", "can to", "will to"], ["suffered", "was suffer", "has suffering"], ["and as a result", "despite of", "because that"]], [0, 0, 0],
    "'Could' fits the polite request, 'suffered' is the past simple, and 'and as a result' links cause and effect correctly.",
    { sub: "Polite requests and linking", tags: ["grammar", "referral"] }),
  ON_W.writing("Referral letter", H, "Using the information in the case notes, write a referral letter to the recipient. Expand the notes into complete sentences. The body should be about 180-200 words.",
    "Using the information in the case notes, write a letter of referral to Ms Rosa Mendes, Diabetes Nurse Educator, Eastside Community Health Centre. Do not use note form. The body of the letter should be approximately 180-200 words.",
    180, "OET Nursing Writing: Referral Letter", OET_WRITING_RUBRIC,
    "Dear Ms Mendes,\n\nRe: Mr Daniel Ruiz, DOB 02/09/1961\n\nI am writing to refer Mr Ruiz, a 62-year-old bus driver, who was admitted on 4 October with a foot ulcer and newly diagnosed type 2 diabetes. I would be grateful if you could provide education to support his self-management at home.\n\nHis HbA1c on admission was 9.6%, and he has been commenced on metformin 500 mg twice daily. He has not previously monitored his blood glucose, and he was unable to demonstrate correct finger-prick technique before discharge. He also reported eating irregular meals because of his shift work.\n\nThe ulcer on his right heel measures 2 cm and is being treated with a daily dressing, which his wife has been taught to change. Mr Ruiz understands that he should inspect his feet daily, but he requires reinforcement.\n\nCould you please review his glucose monitoring technique, discuss meal planning around his shifts and provide foot care advice? He is motivated and keen to return to work.\n\nThank you for your assistance.\n\nYours sincerely,\nRegistered Nurse",
    "A high-scoring referral letter states the reason for referral early, selects only relevant information, and ends with clear requests.",
    { sub: "Diabetes education referral", tags: ["referral", "task"], passage: "Patient: Mr Daniel Ruiz, 62, bus driver (DOB 02/09/1961)\nAdmitted: 4 Oct with infected right heel ulcer (2 cm)\nNew diagnosis type 2 diabetes; HbA1c 9.6%\nStarted metformin 500 mg BD\nNever monitored blood glucose; poor finger-prick technique on teaching\nEats irregular meals due to shift work\nWife taught daily dressing change\nUnderstands daily foot checks, needs reinforcement\nMotivated to return to work\nWriter: Registered Nurse, Ward 4\nPlan: Refer to Ms Rosa Mendes, Diabetes Nurse Educator, Eastside Community Health Centre", title: "Case notes" }, 200),
  ON_W.mcq("Discharge letter", M, "Which paragraph order is most appropriate for a discharge letter?",
    ["Hospital course, reason for letter, follow-up requests, patient details", "Reason for letter and diagnosis, hospital course, ongoing needs and requests, closing", "Closing, requests, hospital course, diagnosis", "Social history, hobbies, diagnosis, hospital course"], 1,
    "The standard flow is purpose and diagnosis, course in hospital, then ongoing care and requests, followed by a courteous close.",
    ["The purpose should come first.", "It follows a logical sequence.", "Closing belongs at the end.", "Personal interests are not a priority."],
    { sub: "Letter organisation", tags: ["structure"] }),
  ON_W.mcq("Discharge letter", M, "Which sentence best expands the note: 'Pt c/o SOB on exertion; O2 sats 93% RA'?",
    ["Patient SOB.", "The patient reported shortness of breath on exertion, and her oxygen saturation on room air was 93%.", "She has SOB, sats low.", "Short of breath, oxygen 93."], 1,
    "Note form must be expanded into full sentences with standard abbreviations written out.",
    ["Still note form.", "Full sentence with abbreviations spelled out.", "Informal and incomplete.", "Fragmentary note form."],
    { sub: "Expanding notes", tags: ["style"] }),
  ON_W.writing("Discharge letter", H, "Using the information in the case notes, write a discharge letter to the recipient. Expand the notes into complete sentences. The body should be about 180-200 words.",
    "Using the information in the case notes, write a discharge letter to Dr Helen Brooks, General Practitioner, Parkview Medical Centre. Do not use note form. The body of the letter should be approximately 180-200 words.",
    180, "OET Nursing Writing: Discharge Letter", OET_WRITING_RUBRIC,
    "Dear Dr Brooks,\n\nRe: Mrs Joan Pritchard, DOB 14/03/1948\n\nI am writing to inform you that Mrs Pritchard, a 76-year-old widow, was discharged home today after a five-day admission for community-acquired pneumonia.\n\nShe presented with a productive cough, fever and shortness of breath. Chest X-ray confirmed right lower lobe consolidation. She received intravenous antibiotics for three days, followed by oral amoxicillin, which she will continue for a further four days. Her temperature has settled and her oxygen saturation is now 96% on room air.\n\nMrs Pritchard lives alone and became tired quickly when walking in hospital. Her daughter will stay with her for the first week. She has been advised to rest, drink plenty of fluids and complete her antibiotics. She is a lifelong non-smoker.\n\nCould you please review her at the surgery in two weeks and arrange a follow-up chest X-ray in six weeks? I would also appreciate an assessment of her need for a pneumococcal vaccination.\n\nThank you for your ongoing care.\n\nYours sincerely,\nRegistered Nurse",
    "A strong discharge letter summarises diagnosis, treatment and current status, and then states exactly what the recipient is asked to do.",
    { sub: "Pneumonia discharge", tags: ["discharge", "task"], passage: "Patient: Mrs Joan Pritchard, 76, widow (DOB 14/03/1948)\nAdmitted 16 Nov, discharged 21 Nov: community-acquired pneumonia\nPresented: productive cough, fever, SOB\nCXR: right lower lobe consolidation\nIV antibiotics x 3 days then oral amoxicillin, 4 more days to go\nTemp normal; SpO2 96% RA\nLives alone; tires quickly on walking; daughter staying 1 week\nAdvised rest, fluids, finish antibiotics\nNon-smoker\nRequest GP: review in 2 weeks; repeat CXR at 6 weeks; consider pneumococcal vaccine\nRecipient: Dr Helen Brooks, GP, Parkview Medical Centre", title: "Case notes" }, 200),

  /* ---------- Speaking ---------- */
  ON_S.speaking("Role-play", M, "Review the role-play card (3 minutes' preparation) and conduct the consultation (up to 5 minutes).",
    "Setting: Orthopaedic ward\nNurse: You are caring for Mrs Anderson, a 72-year-old woman who had a hip replacement 4 days ago and is due to be discharged tomorrow. She is anxious because she lives alone.",
    180, 300,
    ["Find out what worries her most about going home.", "Reassure her and explain the support available (community nurse, physiotherapy, equipment).", "Explain safe movement, including avoiding bending the hip past 90 degrees.", "Agree on a plan and check that she understands."],
    OET_SPEAKING_RUBRIC,
    "Good morning, Mrs Anderson. How are you feeling today? ... I understand that you're going home tomorrow. How do you feel about that? ... I can hear that being alone worries you, and that's completely understandable. Let me tell you what help is arranged. A community nurse will visit to check your wound, and a physiotherapist will see you at home. We've also organised a raised toilet seat and a walking frame. For the next few weeks, try not to bend your hip more than a right angle, so avoid low chairs. Would you like me to go through that again? ... Shall we write the plan down so you have it on the fridge?",
    "The best responses elicit the patient's concern first, respond with empathy, use plain language, and finish by checking understanding.",
    { sub: "Discharge anxiety", tags: ["role-play"] }),
  ON_S.mcq("Role-play", M, "A patient says, 'I'm terrified about the operation.' Which is the most empathic response?",
    ["There's nothing to be afraid of.", "It's quite common to feel nervous before an operation. Can you tell me what worries you most?", "Everyone feels like that. Please try not to worry.", "The surgeon is very good, so you'll be fine."], 1,
    "Empathy means acknowledging the feeling and inviting the patient to say more, rather than dismissing it.",
    ["Dismisses the feeling.", "Acknowledges the feeling and invites the patient to share.", "Generalises and tells the patient what to do.", "Offers premature reassurance."],
    { sub: "Empathy", tags: ["relationship-building"] }),
  ON_S.mcq("Role-play", M, "Which phrase best replaces the term 'hypertension' when speaking to a patient?",
    ["High blood pressure", "Elevated systolic parameters", "Raised BP values", "Cardiovascular stress"], 0,
    "Plain language reduces confusion; 'high blood pressure' is the lay term.",
    ["Clear lay term.", "Technical jargon.", "Abbreviation and jargon.", "Vague and not the same meaning."],
    { sub: "Plain language", tags: ["information-giving"] }),
  ON_S.mcq("Role-play", M, "Which sentence is a good example of signposting during a consultation?",
    ["Okay.", "First I'd like to ask about your pain, then I'll explain the plan for your medication.", "You must do as I say.", "I'm very busy today."], 1,
    "Signposting tells the patient what is coming next, which provides structure.",
    ["Does not provide structure.", "It tells the patient the sequence of the consultation.", "Directive and not structured.", "Not helpful and may upset the patient."],
    { sub: "Signposting", tags: ["structure"] }),
  ON_S.mcq("Role-play", M, "Which question best checks a patient's understanding of the discharge instructions?",
    ["Do you understand everything?", "Just to make sure I've explained clearly, could you tell me how you'll take your tablets at home?", "You understand, don't you?", "Any questions? No? Good."], 1,
    "Asking patients to explain in their own words (teach-back) is more reliable than yes/no questions.",
    ["Patients often say yes even if unsure.", "It asks the patient to demonstrate understanding.", "A leading question that discourages honesty.", "Closed and dismissive."],
    { sub: "Checking understanding", tags: ["teach-back"] }),
  ON_S.mcq("Role-play", H, "A patient refuses to take a prescribed medicine because 'tablets make me feel worse'. What should the nurse do FIRST?",
    ["Tell the patient the doctor knows best", "Explore which tablets and what symptoms the patient has noticed", "Document the refusal and leave", "Insist that the patient take it"], 1,
    "Understanding the patient's perspective comes first; it helps identify a side effect or misunderstanding that may be addressed.",
    ["Dismisses the concern.", "Explores the specific concern before offering information.", "Abandons the patient's concerns.", "Coercion is inappropriate."],
    { sub: "Patient's perspective", tags: ["communication"] }),
];

/* ================================================================== */
/* OET MEDICINE                                                       */
/* ================================================================== */
const OM_L = sec("oet-medicine", "Listening");
const OM_R = sec("oet-medicine", "Reading");
const OM_W = sec("oet-medicine", "Writing");
const OM_S = sec("oet-medicine", "Speaking");

const OM_QUESTIONS: SeedQuestion[] = [
  /* ---------- Listening ---------- */
  OM_L.mcq("Consultation extracts", M, "Why does the doctor decide not to prescribe antibiotics for Ms Chen's sore throat?",
    ["She is allergic to penicillin", "The illness is most likely caused by a virus", "The infection has already cleared", "Antibiotics are unavailable at the practice"], 1,
    "The doctor explains that most sore throats are viral and antibiotics do not work against viruses.",
    ["No allergy is mentioned.", "The doctor says a virus is the most likely cause.", "The infection is still present.", "Availability is not an issue."],
    { scenario: "Transcript extract (Consultation, GP and patient): Doctor: 'Your throat looks red but there's no pus, and your glands aren't badly swollen. That all points to a virus, which is by far the commonest cause of a sore throat. Antibiotics only work against bacteria, so they wouldn't help, and they can cause side effects. What I'd suggest instead is plenty of fluids, paracetamol for the discomfort, and come back if it's not improving in a week.'", sub: "Doctor's reasoning", tags: ["antibiotics"] }),
  OM_L.mcq("Consultation extracts", M, "What does the doctor ask Mr Santos to do while waiting for his test results?",
    ["Avoid all physical activity", "Report any chest pain straight away", "Stop taking his usual tablets", "Return to work as normal"], 1,
    "He is told to seek help immediately if the chest discomfort returns; he may continue usual medication and light activity.",
    ["He is told to avoid strenuous exertion, not all activity.", "Prompt reporting of any new chest pain is the instruction.", "He must continue his usual tablets.", "He is advised to take time off until results are known."],
    { scenario: "Transcript extract (Consultation, GP and patient): Doctor: 'The blood tests will be back on Thursday. Until then, carry on with your usual tablets and keep to light activity, nothing too strenuous. If the chest discomfort comes back, especially at rest, or you feel breathless or sweaty, call an ambulance straight away. Don't wait for the results. I'd also suggest that you stay off work until we've spoken.'", sub: "Safety-netting advice", tags: ["safety-netting"] }),
  OM_L.cloze("Consultation extracts", M, "Complete the doctor's plan using the drop-down menus.",
    "Reduce {{b1}} in your diet, walk for {{b2}} most days, and return in {{b3}} for a blood pressure review.",
    [["salt", "water", "fruit"], ["thirty minutes", "three hours", "ten seconds"], ["four weeks", "four years", "four days"]], [0, 0, 0],
    "The doctor advises less salt, thirty minutes of walking most days, and a review in four weeks.",
    { scenario: "Transcript extract (Consultation, GP and patient): Doctor: 'Your blood pressure is mildly raised, so let's try some lifestyle changes first. Cut down on salt, which is hidden in lots of processed food. Try to walk for about thirty minutes on most days. Then come back in four weeks and we'll recheck it. If it's still high, we'll talk about tablets.'", sub: "Plan details", tags: ["hypertension"] }),
  OM_L.mcq("Workplace extracts", H, "What does the registrar advise the junior doctor to do first for a patient whose observations have worsened?",
    ["Wait for the next set of observations", "Repeat the observations and escalate to a senior", "Discharge the patient", "Order a CT scan immediately"], 1,
    "She advises rechecking the observations to confirm the trend and calling a senior without delay.",
    ["Waiting risks delay.", "Repeat obs and escalate is the advice.", "Discharge is inappropriate.", "Imaging may follow after assessment."],
    { scenario: "Transcript extract (Workplace, registrar teaching a junior doctor): 'When you see the early warning score rising, don't wait for the next round. Repeat the observations yourself to confirm the trend, then call me or the on-call senior. You can do the scan request afterwards; the priority is that a senior knows.'", sub: "Escalation", tags: ["escalation"] }),
  OM_L.mcq("Workplace extracts", M, "What point is the consultant making about obtaining consent?",
    ["The form is the only thing that matters", "The patient's understanding matters more than the signature", "Consent is unnecessary for minor procedures", "Relatives can always consent on the patient's behalf"], 1,
    "He stresses that a signed form is meaningless unless the patient understood the risks and alternatives.",
    ["He explicitly rejects this.", "He emphasises understanding over paperwork.", "He does not say this.", "He does not make this claim."],
    { scenario: "Transcript extract (Workplace, consultant teaching a trainee): 'I've seen forms signed with beautiful handwriting, and the patient couldn't tell me what the procedure was for. A signature isn't consent. What counts is whether the patient understood the benefits, the risks and the alternatives, and chose freely. Document that conversation.'", sub: "Speaker's point", tags: ["consent"] }),
  OM_L.mcq("Workplace extracts", E, "Which night will Dr Patel cover on the rota?",
    ["Monday", "Tuesday", "Wednesday", "Thursday"], 2,
    "After swapping, Dr Patel takes Wednesday.",
    ["Monday was the original date for Dr Patel.", "Tuesday is Dr Lee's night.", "The swap moves Dr Patel to Wednesday.", "Thursday remains Dr Lee's."],
    { scenario: "Transcript extract (Workplace, two doctors): Dr Lee: 'I'm down for Tuesday, but I've got an exam on Wednesday. Could we swap? I'll take your Monday.' Dr Patel: 'Monday is fine, but I'd rather take Wednesday than Tuesday because of my train.' Dr Lee: 'Then you do Wednesday and I'll do Monday and Tuesday.' Dr Patel: 'Agreed.'", sub: "Final arrangement", tags: ["rota"] }),
  OM_L.mcq("Presentations", M, "What is the main message of the presentation on antibiotic use?",
    ["Antibiotics should never be used", "Antibiotic prescriptions should be reviewed after two to three days", "Newer antibiotics are always better", "Patients should choose their own antibiotics"], 1,
    "The speaker argues that every course should be reviewed at 48 to 72 hours to stop, narrow or change it.",
    ["Not what she says.", "The review at about 48-72 hours is her key point.", "Newer is not necessarily better.", "Patient choice is not mentioned."],
    { scenario: "Transcript extract (Presentation, hospital pharmacist): 'My message today is simple. When you start antibiotics, schedule a review at around forty-eight to seventy-two hours. By then you'll often have culture results. Ask yourself whether the drug is still needed, whether it can be narrowed, or whether it can be stopped. That one habit is the foundation of good stewardship.'", sub: "Main message", tags: ["stewardship"] }),
  OM_L.mcq("Presentations", H, "How does the speaker regard clinical guidelines?",
    ["As rules that must never be questioned", "As useful guides that do not replace clinical judgement", "As unnecessary", "As only relevant to students"], 1,
    "He says guidelines inform but cannot replace judgement about the individual patient.",
    ["He says the opposite.", "He regards them as guides to be applied thoughtfully.", "He values them.", "He does not limit them to students."],
    { scenario: "Transcript extract (Presentation, senior physician): 'Guidelines are the distilled evidence of many thousands of patients. I value them. But none of them describes the 85-year-old with kidney disease and three other conditions who is sitting in front of you. They inform your decision; they do not make it for you. That part remains your clinical judgement.'", sub: "Speaker's attitude", tags: ["guidelines"] }),
  OM_L.cloze("Presentations", M, "Complete the presenter's notes using the drop-down menus.",
    "Screening for type 2 diabetes should consider {{b1}} such as family history and weight. Positive results should prompt {{b2}} testing, together with advice on {{b3}}.",
    [["risk factors", "holidays", "hobbies"], ["confirmatory", "unnecessary", "random"], ["lifestyle", "fashion", "travel"]], [0, 0, 0],
    "The speaker links screening to risk factors, confirmatory testing and lifestyle advice.",
    { scenario: "Transcript extract (Presentation, endocrinologist): 'Think about who to screen: risk factors such as family history and weight guide us. If the first result is raised, we don't diagnose on that alone; we confirm with a further test. And at every stage, offer practical advice on lifestyle: diet and activity make a real difference.'", sub: "Note completion", tags: ["diabetes"] }),

  /* ---------- Reading ---------- */
  OM_R.mcq("Expeditious reading", E, "How soon will urgent outpatient referrals be seen, according to the protocol?",
    ["Within 48 hours", "Within two weeks", "Within six weeks", "Within three months"], 1,
    "The protocol states that urgent referrals are seen within two weeks.",
    ["Forty-eight hours applies to emergency admissions.", "Two weeks is stated for urgent referrals.", "Six weeks applies to routine referrals.", "Three months is the maximum for non-urgent follow-up."],
    { title: "Outpatient Referral Protocol (extract)", passage: "Emergency cases should be sent to the Emergency Department and admitted within forty-eight hours. Urgent referrals are seen within two weeks of receipt. Routine referrals are seen within six weeks. Non-urgent follow-up appointments are scheduled within three months. All referrals should include the patient's current medication list.", sub: "Scanning for a time frame", tags: ["scanning"] }),
  OM_R.mcq("Expeditious reading", M, "What change is being made to the radiology booking process?",
    ["Appointments can only be made by phone", "Requests must now be made electronically", "Scans will no longer be available at weekends", "A new scanner will replace the old one"], 1,
    "The notice states that, from next month, all radiology requests must be made through the online system.",
    ["Phone bookings are being discontinued.", "The online system becomes mandatory.", "Weekend availability is not discussed.", "No new scanner is announced."],
    { title: "Notice to Medical Staff", passage: "From the first of next month, all radiology requests must be submitted through the online ordering system. Paper and telephone requests will no longer be accepted, except in emergencies. A short training session will be offered on Tuesday. Weekend scanning availability remains unchanged.", sub: "Gist", tags: ["skimming"] }),
  OM_R.mcq("Expeditious reading", M, "What was the main finding of the study?",
    ["Exercise had no effect on mood", "Regular exercise reduced symptoms of depression more than usual care alone", "Medication was more effective than exercise", "The study was stopped early"], 1,
    "The abstract reports that the exercise group had lower symptom scores than the group receiving usual care.",
    ["The study found an effect.", "Lower symptom scores in the exercise group are reported.", "Medication was not compared.", "It was completed."],
    { title: "Abstract", passage: "Background: Exercise is often recommended for low mood, but evidence is mixed. Methods: 150 adults with mild to moderate depression were randomly assigned to a supervised exercise programme plus usual care, or usual care alone, for 12 weeks. Results: Participants in the exercise group had significantly lower symptom scores at 12 weeks than those receiving usual care alone. Conclusion: Supervised exercise may be a useful addition to usual care for mild to moderate depression.", sub: "Reading an abstract", tags: ["abstract"] }),
  OM_R.mcq("Expeditious reading", M, "Which patients are NOT eligible for the home monitoring scheme?",
    ["Patients who live within 20 km of the hospital", "Patients without a telephone line or mobile signal", "Patients over 70 years old", "Patients who have had a recent admission"], 1,
    "The scheme requires reliable phone contact, so those without a line or signal are excluded.",
    ["Distance within 20 km is acceptable.", "Reliable phone contact is required.", "Age over 70 is not an exclusion.", "Recent admission is an inclusion criterion."],
    { title: "Home Monitoring Scheme: Eligibility", passage: "The scheme is open to patients who live within 20 km of the hospital and who have been admitted in the last six months with heart failure. Participants need a working telephone line or mobile signal so that nurses can contact them daily. There is no upper age limit. Patients unable to use the equipment, even with help from a carer, will be considered for other services.", sub: "Eligibility", tags: ["scanning"] }),
  OM_R.mcq("Careful reading", H, "What is the writer's main point about communication and statin use?",
    ["Statins are ineffective", "Patients are more likely to continue statins when benefits and side effects are discussed openly", "Doctors should avoid discussing side effects", "Statins should be given to all adults"], 1,
    "The passage links open discussion of benefits and side effects with better continuation of treatment.",
    ["The passage does not say this.", "Open discussion is associated with better adherence.", "The passage says the opposite.", "No such recommendation is made."],
    { title: "Statins and Adherence", passage: "A substantial proportion of patients stop taking statins within a year, often because of muscle aches or concern about long-term effects. Studies suggest that patients who have had an unhurried discussion of both benefits and possible side effects are more likely to continue treatment, and more likely to report problems early, so that alternatives can be tried. The authors therefore suggest that time spent on the consultation is likely to be repaid in better adherence.", sub: "Main point", tags: ["adherence"] }),
  OM_R.mcq("Careful reading", H, "In the passage, the word 'attenuate' most closely means",
    ["to increase", "to reduce the force or effect of", "to delay", "to measure"], 1,
    "Treatment is described as reducing the severity of inflammation, so 'attenuate' means to reduce its force.",
    ["The context describes lessening.", "To reduce force or effect.", "Delay is not the sense.", "Measurement is not described."],
    { title: "Inflammation", passage: "Corticosteroids may attenuate the inflammatory response in the airways, reducing swelling and mucus production. Regular inhaled treatment is therefore recommended for patients whose symptoms are frequent, as it lessens the severity of attacks and the need for rescue medication.", sub: "Vocabulary in context", tags: ["vocabulary"] }),
  OM_R.mcq("Careful reading", H, "What does the passage imply about population screening tests?",
    ["Positive results always mean disease", "Some positive results are false and may cause unnecessary anxiety", "Screening has no costs", "Negative results guarantee health"], 1,
    "The passage mentions false positives leading to further tests and anxiety.",
    ["False positives exist.", "False positives can cause anxiety and further tests.", "The passage lists harms.", "A negative result does not guarantee health."],
    { title: "Screening", passage: "Screening can detect disease before symptoms appear, but no test is perfect. Some people with a positive result will turn out not to have the condition and will have undergone further tests, and often considerable anxiety, for no benefit. Others with a negative result may in fact have the disease. Programmes must therefore weigh the benefits of early detection against these harms.", sub: "Inference", tags: ["screening"] }),
  OM_R.cloze("Careful reading", M, "Complete the summary of the passage.",
    "Antibiotic {{b1}} occurs when bacteria {{b2}} to survive drugs that once killed them. Using antibiotics only when {{b3}} helps to slow this process.",
    [["resistance", "allergy", "supply"], ["adapt", "disappear", "sleep"], ["necessary", "requested", "available"]], [0, 0, 0],
    "The passage defines resistance as bacteria adapting to survive antibiotics and recommends restricting use to necessary cases.",
    { title: "Resistance", passage: "Antibiotic resistance occurs when bacteria adapt so that they can survive drugs that once killed them. Every use of antibiotics gives bacteria an opportunity to adapt, which is why prescribing only when necessary, at the correct dose and for the correct duration, is essential to slow the process.", sub: "Summary completion", tags: ["resistance"] }),

  /* ---------- Writing ---------- */
  OM_W.mcq("Referral letter", M, "Which is the most effective opening for a referral to a cardiologist?",
    ["Thank you for seeing Mr Evans, a 58-year-old accountant with exertional chest pain, for further assessment.", "I hope this finds you well and that you are having a lovely week.", "Mr Evans is a patient of mine.", "Please read the attached notes."], 0,
    "A referral names the patient, the problem and the purpose in the first sentence.",
    ["States the patient, problem and purpose.", "Pleasantries waste words.", "Does not state purpose.", "Delegates the reader's work."],
    { sub: "Opening sentence", tags: ["referral"] }),
  OM_W.mcq("Referral letter", M, "Which sentence uses tenses correctly?",
    ["He was diagnosed with asthma in 2015 and has been using a preventer inhaler since then.", "He has been diagnosed with asthma in 2015 and uses a preventer inhaler since then.", "He diagnosed with asthma in 2015 and is using preventer since then.", "He is diagnosed in 2015 and was using an inhaler since."], 0,
    "A completed event with a time marker takes the past simple; a continuing situation takes the present perfect with 'since'.",
    ["Past simple for the diagnosis, present perfect continuous for ongoing treatment.", "'Has been diagnosed in 2015' conflicts with a past time marker.", "Missing auxiliaries and articles.", "Tenses do not match the time markers."],
    { sub: "Tenses in letters", tags: ["grammar"] }),
  OM_W.cloze("Referral letter", M, "Choose the best language for each gap in the referral letter.",
    "I would appreciate {{b1}} opinion on Mrs Osei's persistent cough. She has been coughing {{b2}} three months, {{b3}} treatment with two courses of antibiotics.",
    [["your", "you", "yours"], ["for", "since", "during"], ["despite", "although", "unless"]], [0, 0, 0],
    "'Your opinion' is correct; 'for' with a period of time; 'despite' + noun phrase.",
    { sub: "Grammar and linking", tags: ["grammar"] }),
  OM_W.writing("Referral letter", H, "Using the information in the case notes, write a referral letter to the recipient. Expand the notes into complete sentences. The body should be about 180-200 words.",
    "Using the information in the case notes, write a letter of referral to Dr Amir Haddad, Consultant Cardiologist, City Heart Clinic. Do not use note form. The body of the letter should be approximately 180-200 words.",
    180, "OET Medicine Writing: Referral Letter", OET_WRITING_RUBRIC,
    "Dear Dr Haddad,\n\nRe: Mr Peter Walsh, DOB 22/07/1963\n\nThank you for seeing Mr Walsh, a 61-year-old builder, who has had episodes of exertional chest tightness over the past two months. I would be grateful for your assessment and advice on further investigation.\n\nThe episodes occur when he climbs stairs or carries heavy loads and settle within five minutes of rest. He has had no episodes at rest. He is an ex-smoker, having stopped five years ago after twenty years of smoking, and he has hypertension, which is controlled on amlodipine 5 mg daily. His father had a myocardial infarction at 55.\n\nOn examination, his blood pressure was 138/84 mmHg, and his heart sounds were normal. A resting ECG showed no abnormality, and his cholesterol was raised at 6.2 mmol/L. I have started him on aspirin and a statin and have prescribed a glyceryl trinitrate spray for symptoms.\n\nGiven his symptoms and risk factors, I would be grateful if you could consider an exercise stress test. Mr Walsh is anxious about his work, so I have advised him to avoid heavy lifting until he has been reviewed.\n\nYours sincerely,\nDr A. Brown",
    "A strong referral letter states purpose first, groups symptoms, risk factors and examination findings, and ends with a specific request.",
    { sub: "Chest pain referral", tags: ["referral", "task"], passage: "Patient: Mr Peter Walsh, 61, builder (DOB 22/07/1963)\n2 months of exertional chest tightness on stairs/heavy loads; settles in 5 min rest; none at rest\nEx-smoker (stopped 5 years ago; smoked 20 years)\nHypertension controlled: amlodipine 5 mg daily\nFather MI at 55\nBP 138/84; heart sounds normal; resting ECG normal; cholesterol 6.2 mmol/L\nStarted aspirin + statin; GTN spray prescribed\nAdvised no heavy lifting until reviewed; anxious about work\nRequest: assessment; consider exercise stress test\nRecipient: Dr Amir Haddad, Consultant Cardiologist, City Heart Clinic\nWriter: Dr A. Brown, GP", title: "Case notes" }, 200),
  OM_W.mcq("Discharge letter", M, "Which information should be highlighted most clearly for the GP in a discharge letter?",
    ["The ward's catering arrangements", "Changes made to the patient's medication and why", "The names of all nurses involved", "The patient's favourite hobbies"], 1,
    "The GP needs to know which medicines were started, stopped or changed so that care can continue safely.",
    ["Not relevant.", "Medication changes affect ongoing care.", "Not relevant to continuing care.", "Not relevant unless tied to care needs."],
    { sub: "Key content", tags: ["discharge"] }),
  OM_W.mcq("Discharge letter", H, "Which version is the most concise and clear?",
    ["The patient was admitted to the hospital and he was in the hospital for three days, and in the hospital he received antibiotics.", "He was admitted for three days and treated with intravenous antibiotics.", "In the hospital where he stayed for three days he got antibiotics for the infection that he had.", "He stayed three days, antibiotics given."], 1,
    "Concise writing avoids repetition while still using complete sentences.",
    ["Repeats 'hospital' and 'patient' unnecessarily.", "Complete, concise and clear.", "Wordy with redundant clauses.", "Note form, not a full sentence."],
    { sub: "Conciseness", tags: ["style"] }),
  OM_W.writing("Discharge letter", H, "Using the information in the case notes, write a discharge letter to the recipient. Expand the notes into complete sentences. The body should be about 180-200 words.",
    "Using the information in the case notes, write a discharge letter to Dr Susan Ward, General Practitioner, Lakeside Surgery. Do not use note form. The body of the letter should be approximately 180-200 words.",
    180, "OET Medicine Writing: Discharge Letter", OET_WRITING_RUBRIC,
    "Dear Dr Ward,\n\nRe: Mr Samuel Green, DOB 05/11/1955\n\nI am writing to inform you that Mr Green, a 70-year-old retired farmer, was discharged today after a four-day admission with an exacerbation of chronic obstructive pulmonary disease.\n\nHe presented with increased breathlessness and purulent sputum. He was treated with nebulised bronchodilators, oral prednisolone and antibiotics, and his oxygen saturation improved from 88% to 93% on room air. A chest X-ray showed no pneumonia.\n\nHe was discharged on a five-day course of prednisolone, which finishes on 25 November, and on his usual inhalers. Inhaler technique was reviewed, and he was advised to stop smoking, which he is willing to consider. He lives with his wife, who is supportive.\n\nI would be grateful if you could review him within one week and repeat his spirometry once he has recovered. Please also consider referring him to pulmonary rehabilitation and offering smoking cessation support.\n\nThank you for your continuing care.\n\nYours sincerely,\nDr R. Kaplan",
    "A strong discharge letter summarises the diagnosis, treatment and current condition, flags medication changes, and makes clear requests.",
    { sub: "COPD discharge", tags: ["discharge", "task"], passage: "Patient: Mr Samuel Green, 70, retired farmer (DOB 05/11/1955)\nAdmitted 17 Nov; discharged 21 Nov: COPD exacerbation\nPresented: increased SOB, purulent sputum\nTreated: nebulised bronchodilators, oral prednisolone, antibiotics\nSpO2 88% to 93% on room air; CXR no pneumonia\nDischarge meds: usual inhalers; prednisolone 5 days (ends 25 Nov)\nInhaler technique reviewed; smoker, willing to consider quitting\nLives with supportive wife\nRequests GP: review in 1 week; repeat spirometry after recovery; consider pulmonary rehab; smoking cessation support\nRecipient: Dr Susan Ward, GP, Lakeside Surgery\nWriter: Dr R. Kaplan", title: "Case notes" }, 200),

  /* ---------- Speaking ---------- */
  OM_S.speaking("Role-play", M, "Review the role-play card (3 minutes' preparation) and conduct the consultation (up to 5 minutes).",
    "Setting: General practice\nDoctor: Your patient, Mr Bell, 52, has had a high blood pressure reading on three visits. He is reluctant to start medication because he believes tablets are 'for old people' and he feels perfectly well.",
    180, 300,
    ["Explore his reasons for not wanting medication.", "Explain, in simple terms, why high blood pressure matters even without symptoms.", "Discuss lifestyle changes and medication as options.", "Agree on a plan and arrange follow-up."],
    OET_SPEAKING_RUBRIC,
    "Good morning, Mr Bell. Thanks for coming back. I know we've talked about your blood pressure, so I'd like to hear how you feel about it. ... I understand. Many people feel that way when they feel well. The difficulty is that high blood pressure usually causes no symptoms, but over the years it can strain the heart and increase the risk of a stroke. There are two things we can do: changes to what you eat and how active you are, and tablets if that isn't enough. Which would you like to try first? ... Let's recheck your pressure in a month. Does that sound reasonable?",
    "The best responses explore concerns first, explain in lay terms, offer choices and finish with a shared plan.",
    { sub: "Reluctance to start treatment", tags: ["role-play"] }),
  OM_S.mcq("Role-play", H, "A patient asks, 'Is it cancer, doctor?' before test results are back. Which reply is most appropriate?",
    ["Don't be silly, of course not.", "I understand why you're worried. We don't know yet, which is why we're doing these tests. I'll go through the results with you as soon as they're ready.", "Yes, it could be, but let's not think about it.", "I can't discuss that."], 1,
    "A good answer acknowledges fear, is honest about uncertainty and states the next step.",
    ["False reassurance.", "Empathic, honest and clear about next steps.", "Frightening and unhelpful.", "Dismissive and closes the conversation."],
    { sub: "Handling uncertainty", tags: ["empathy"] }),
  OM_S.mcq("Role-play", M, "Which phrase best replaces 'myocardial infarction' when speaking to a patient?",
    ["Heart attack", "Cardiac ischaemic event", "MI", "Coronary occlusion episode"], 0,
    "Lay terms such as 'heart attack' are best understood by patients.",
    ["Everyday term.", "Technical jargon.", "Abbreviation.", "Technical jargon."],
    { sub: "Plain language", tags: ["jargon"] }),
  OM_S.mcq("Role-play", M, "Before giving difficult news, which opening is best?",
    ["I'm afraid it's bad.", "Is it all right if I go through your results now? I'm afraid they are not what we hoped for.", "The results are here.", "You'd better sit down."], 1,
    "A warning shot prepares the patient, and checking readiness shows respect.",
    ["Blunt and without preparation.", "Asks permission and gently prepares the patient.", "Gives no preparation.", "Alarming and abrupt."],
    { sub: "Breaking news", tags: ["structure"] }),
  OM_S.mcq("Role-play", M, "Which closing statement best ends a consultation?",
    ["That's all.", "To summarise, we'll start the tablet tonight and I'll see you in two weeks. If you notice dizziness, call the surgery. Is there anything else you'd like to ask?", "Please leave.", "See you."], 1,
    "A summary, safety-netting and an invitation for questions create a good close.",
    ["Abrupt.", "Summarises, gives safety advice and invites questions.", "Rude.", "Too brief and offers no plan."],
    { sub: "Closing", tags: ["structure"] }),
  OM_S.mcq("Role-play", M, "Which question is the best open question to explore a patient's concerns?",
    ["Are you worried?", "What's been on your mind about this?", "You're not worried, are you?", "Do you smoke?"], 1,
    "Open questions invite the patient to describe concerns in their own words.",
    ["Closed yes/no question.", "Open and non-leading.", "Leading question.", "Closed and off topic."],
    { sub: "Open questions", tags: ["information-gathering"] }),
];

/* ================================================================== */
/* PTE ACADEMIC                                                       */
/* ================================================================== */
const PTE_SW = sec("pte-academic", "Speaking and Writing");
const PTE_R = sec("pte-academic", "Reading");
const PTE_L = sec("pte-academic", "Listening");

const PTE_SPEAKING_RUBRIC = [
  "Content: Covers the main elements accurately.",
  "Oral Fluency: Smooth rhythm without long hesitations or repetitions.",
  "Pronunciation: Clear vowels, consonants and word stress.",
];
const PTE_WRITING_RUBRIC = [
  "Content: Covers the main point of the source accurately.",
  "Form: Meets the required format and length.",
  "Grammar: Correct sentence structure.",
  "Vocabulary: Appropriate, precise word choice.",
];

const PTE_QUESTIONS: SeedQuestion[] = [
  /* ---------- Speaking and Writing ---------- */
  PTE_SW.speaking("Read aloud", M, "Look at the text below. In the time provided, read the text aloud as naturally and clearly as you can.",
    "Urban gardens are becoming a familiar sight in many cities. Residents transform empty lots and rooftops into small farms, producing fresh vegetables for their neighbours. These projects reduce food costs, provide green space, and bring communities together.",
    35, 40, undefined, PTE_SPEAKING_RUBRIC,
    "Urban gardens are becoming a familiar sight in many cities (pause). Residents transform empty lots and rooftops into small farms (pause), producing fresh vegetables for their neighbours. These projects reduce food costs (pause), provide green space (pause), and bring communities together.",
    "Reading aloud is scored on content, fluency and pronunciation, so steady pace and accurate word stress matter more than speed.",
    { sub: "Pausing and stress", tags: ["read-aloud"] }),
  PTE_SW.mcq("Read aloud", M, "Which word has its main stress on the second syllable?",
    ["Photograph", "Photographer", "Photographic", "Photocopy"], 1,
    "Photographer is stressed on the second syllable (pho-TOG-ra-pher), unlike photograph and photocopy.",
    ["Stress is on the first syllable: PHO-to-graph.", "The main stress falls on the second syllable, -TOG-.", "The stress shifts to the third syllable: pho-to-GRAPH-ic.", "Stress is on the first syllable: PHO-to-cop-y."],
    { sub: "Word stress", tags: ["pronunciation"] }),
  PTE_SW.mcq("Read aloud", E, "What should you do when you see a comma in a Read Aloud text?",
    ["Stop for several seconds", "Make a very short pause and keep your voice steady", "Ignore all punctuation", "Read faster to save time"], 1,
    "Short pauses at commas mark phrases and keep the rhythm natural.",
    ["A long stop damages fluency.", "A brief pause at a comma supports natural phrasing.", "Punctuation guides phrasing.", "Rushing causes errors."],
    { sub: "Phrasing", tags: ["fluency"] }),
  PTE_SW.speaking("Describe image", M, "Look at the data display. In the time provided, describe in detail what the display is showing.",
    "Describe the table: the percentage of households with internet access in four regions.",
    25, 40, undefined, PTE_SPEAKING_RUBRIC,
    "This table shows the percentage of households with internet access in four regions in 2010 and 2020. Overall, access increased in every region. Region A had the highest figure in both years, rising from 72 to 95 percent. Region D started lowest, at 25 percent, but showed the largest increase, reaching 70 percent by 2020. In conclusion, although all regions improved, a gap between the highest and lowest remained.",
    "A good description gives an introduction, two or three key points with figures, and a brief conclusion.",
    { title: "Households with internet access (%)", table: { columns: ["Region", "2010", "2020"], rows: [["A", "72", "95"], ["B", "55", "85"], ["C", "40", "78"], ["D", "25", "70"]] }, sub: "Describing a table", tags: ["describe-image"] }),
  PTE_SW.mcq("Describe image", M, "Which is the best way to begin a Describe Image response for a bar chart?",
    ["Um, I don't know.", "This bar chart shows the number of visitors to five museums in 2022.", "The picture is blue and red.", "Visitors are interesting."], 1,
    "Start by stating what the chart shows, including topic, items and time frame.",
    ["Hesitation reduces fluency.", "A clear introduction states what the graph shows.", "Describing colours is not content.", "Vague opinion is not description."],
    { sub: "Introductions", tags: ["describe-image"] }),
  PTE_SW.writing("Summarize written text", M, "Read the passage below and summarize it using one sentence. Type your response in the box. Your answer should be 5 to 75 words.",
    "Summarize the passage in one complete sentence of no more than 75 words.",
    5, "PTE Academic: Summarize Written Text", PTE_WRITING_RUBRIC,
    "Although cities have long relied on cars, many planners now prioritise cycling and public transport, because doing so reduces congestion and pollution while supporting local business.",
    "A good one-sentence summary keeps the main idea and key supports, uses linking words and ends with a single full stop.",
    { title: "Passage", passage: "For much of the twentieth century, cities were designed around the car. The consequence was congestion, noise and air pollution. In recent years, planners in a growing number of cities have changed course, building cycle lanes, pedestrian zones and improved public transport. Studies from several cities suggest that these measures reduce traffic and emissions without harming local shops, which often see more customers on foot than by car.", sub: "One-sentence summary", tags: ["summarize-written-text"] }, 75),
  PTE_SW.mcq("Summarize written text", M, "Which is an acceptable one-sentence summary of the passage on urban planning?",
    ["Cities, once built for cars, now favour cycling and public transport because these cut traffic and pollution without hurting shops.", "Cities have cars. They have lanes. There is pollution. Shops sell goods.", "The passage is about city shops and the author thinks they are interesting.", "In the twentieth century many things happened, and planners had opinions."], 0,
    "A summary must be one sentence that covers the main idea and the supporting reason.",
    ["One grammatical sentence with main idea and reasons.", "Several fragments, not one sentence.", "Reflects the author's feelings and not the passage.", "Too vague and omits the main idea."],
    { sub: "Selecting a summary", tags: ["summarize-written-text"] }),
  PTE_SW.sata("Summarize written text", M, "Which TWO features are essential in a Summarize Written Text response?",
    ["A single sentence", "The main idea of the passage", "A personal opinion", "Direct quotations of the whole first paragraph", "A list of bullet points"], [0, 1],
    "The task requires one sentence that captures the main idea; opinion and copied text are unnecessary or harmful.",
    ["One sentence is required.", "The main idea is the core of the summary.", "Opinions are not requested.", "Copying large parts does not show understanding.", "Bullet points break the one-sentence format."],
    { sub: "Requirements", tags: ["summarize-written-text"] }),
  PTE_SW.mcq("Essay", M, "Which sentence is the best thesis for an essay on whether public transport should be free?",
    ["Public transport is a thing that exists in cities.", "Although funding is a legitimate concern, free public transport would benefit society by reducing traffic and widening access.", "I do not know whether it should be free.", "Transport can be public or private."], 1,
    "A clear thesis states a position and previews reasons.",
    ["Vague and gives no position.", "Takes a position with a concession and reasons.", "Takes no position.", "States an obvious definition."],
    { sub: "Thesis", tags: ["essay"] }),
  PTE_SW.mcq("Essay", H, "Which sentence best joins these ideas? 'Remote work saves commuting time. It can reduce team cohesion.'",
    ["Remote work saves commuting time, whereas it can reduce team cohesion.", "Remote work saves commuting time but because it can reduce team cohesion.", "Remote work saves commuting time, so that it can reduce team cohesion.", "Remote work saves commuting time unless it can reduce team cohesion."], 0,
    "'Whereas' correctly links contrasting ideas; the others create illogical or ungrammatical relations.",
    ["Contrast expressed accurately.", "'But because' is ungrammatical.", "'So that' suggests purpose, not contrast.", "'Unless' creates a condition that does not exist."],
    { sub: "Complex sentences", tags: ["grammar", "essay"] }),

  /* ---------- Reading ---------- */
  PTE_R.ordered("Reorder paragraphs", M, "The text boxes below have been placed in a random order. Restore the original order.",
    ["Many cities built their transport networks around the private car during the twentieth century.", "As a result, congestion and air pollution became chronic problems in urban centres.", "In response, planners in several countries have begun to prioritise cycle lanes and public transport.", "Early evidence suggests that such measures can reduce traffic without harming local businesses."],
    "s1 gives the general background; s2 'As a result' follows the cause; s3 'In response' introduces the reaction; s4 'such measures' refers back to s3.",
    { sub: "Cause and response", tags: ["reorder", "cohesion"] }),
  PTE_R.ordered("Reorder paragraphs", H, "The text boxes below have been placed in a random order. Restore the original order.",
    ["Before 1840, the cost of posting a letter in Britain depended on distance and was usually paid by the recipient.", "This system was expensive and often led to letters being refused.", "Rowland Hill therefore proposed a uniform low rate, paid in advance by the sender.", "The adhesive postage stamp, introduced in 1840, made this scheme practical.", "Within a few years, the number of letters sent had risen sharply."],
    "s1 describes the old system; s2 'This system' evaluates it; s3 'therefore' offers the solution; s4 'this scheme' refers to s3; s5 reports the outcome.",
    { sub: "Chronology and reference", tags: ["reorder", "cohesion"] }),
  PTE_R.ordered("Reorder paragraphs", M, "The text boxes below have been placed in a random order. Restore the original order.",
    ["Researchers have long debated why some languages are harder for adults to learn than others.", "One influential explanation points to the distance between a learner's first language and the target language.", "For instance, Spanish speakers typically find Italian easier to master than Japanese.", "However, motivation and the amount of daily practice can outweigh this linguistic distance."],
    "s1 introduces the debate; s2 gives an explanation; s3 'For instance' exemplifies it; s4 'However' qualifies it.",
    { sub: "Signal words", tags: ["reorder", "cohesion"] }),
  PTE_R.cloze("Fill in the blanks", M, "In the text below, some words are missing. Select the best word for each blank.",
    "The government's decision to {{b1}} the tax was widely {{b2}} by economists, who argued that it would {{b3}} investment in the long term.",
    [["abolish", "elaborate", "inhabit"], ["criticised", "lengthened", "pronounced"], ["undermine", "undertake", "underline"]], [0, 0, 0],
    "'Abolish a tax' is a standard collocation; 'criticised by economists' fits the clause 'argued that'; 'undermine investment' is the logical negative outcome.",
    { sub: "Collocations", tags: ["fill-in-the-blanks", "collocation"] }),
  PTE_R.cloze("Fill in the blanks", M, "In the text below, some words are missing. Select the best word for each blank.",
    "Rising sea levels pose a {{b1}} threat to low-lying islands, many of which lack the resources to {{b2}} their coastlines or {{b3}} residents.",
    [["serious", "seriously", "seriousness"], ["protect", "protection", "protective"], ["relocate", "relocation", "relocating"]], [0, 0, 0],
    "An adjective (serious) modifies 'threat'; 'to' requires a base verb (protect); 'or' links parallel base verbs (relocate).",
    { sub: "Word forms", tags: ["fill-in-the-blanks", "grammar"] }),
  PTE_R.cloze("Fill in the blanks", H, "In the text below, some words are missing. Select the best word for each blank.",
    "Although inflation has {{b1}} in recent months, analysts caution that the recovery is {{b2}}. Consumers remain {{b3}} about spending.",
    [["eased", "eaten", "easing"], ["fragile", "fragrant", "fragment"], ["cautious", "cautiously", "caution"]], [0, 0, 0],
    "'Has eased' is present perfect; 'fragile' means easily broken; 'cautious' is the adjective after 'remain'.",
    { sub: "Grammar and meaning", tags: ["fill-in-the-blanks"] }),
  PTE_R.cloze("Fill in the blanks", M, "In the text below, some words are missing. Select the best word for each blank.",
    "During photosynthesis, plants {{b1}} light energy into chemical energy, which is stored in {{b2}}. Oxygen is released as a {{b3}}.",
    [["convert", "contain", "construct"], ["glucose", "gravity", "glass"], ["by-product", "by-law", "by-pass"]], [0, 0, 0],
    "Plants convert light energy, store it in glucose and release oxygen as a by-product.",
    { sub: "Academic vocabulary", tags: ["fill-in-the-blanks", "science"] }),
  PTE_R.mcq("Multiple choice", M, "What is the main idea of the passage?",
    ["Coffee should be avoided by all adults", "Moderate coffee consumption appears safe for most adults", "Coffee improves memory in children", "Tea is healthier than coffee"], 1,
    "The passage says that for most adults, moderate intake is not linked to harm.",
    ["The passage does not advise avoidance.", "Moderate intake is described as generally safe.", "Children are not discussed.", "No comparison with tea is made."],
    { title: "Coffee and Health", passage: "Coffee has long been blamed for a range of health problems. Large studies of adults, however, have found no clear link between moderate consumption, roughly three to four cups a day, and serious illness. Some research even suggests modest benefits. Researchers note that pregnant women and people with certain heart conditions may need to limit their intake, and that added sugar and cream can change the picture considerably.", sub: "Main idea", tags: ["reading-mcq"] }),
  PTE_R.sata("Multiple choice", H, "Read the passage and select all the correct statements.",
    ["The study followed participants over several years.", "All participants were retired.", "Participants who cycled to work had lower rates of stress.", "The study proves that cycling cures anxiety.", "Participants were asked about their commuting habits."], [0, 2, 4],
    "The passage states the study lasted five years, that cyclists reported less stress, and that commuting was reported by participants; it does not say all were retired or that cycling cures anxiety.",
    ["Supported: it ran for five years.", "Not supported: participants were of working age.", "Supported: cyclists reported less stress.", "Overstated: the study found an association, not a cure.", "Supported: participants described how they commuted."],
    { title: "Cycling and Stress", passage: "In a five-year study, 3,000 working adults described how they travelled to work each day and completed regular questionnaires about stress. Participants who cycled reported lower stress than those who drove, even after the researchers accounted for age and income. The authors caution that the study shows an association, and that people who are less stressed may simply be more likely to choose to cycle.", sub: "Multiple answers", tags: ["reading-mcq"], tip: "In multiple-answer items, a wrong selection is penalised, so choose only those you can support." }),
  PTE_R.mcq("Multiple choice", H, "What can be inferred about the authors' view of the cycling study?",
    ["They believe cycling is the sole cause of lower stress", "They are cautious about concluding that cycling causes lower stress", "They think the study was too short", "They plan to ban driving"], 1,
    "By stating that the study shows only an association, the authors signal caution about causation.",
    ["They explicitly reject this.", "They caution that the result may reflect other factors.", "They do not criticise the length.", "No such plan is mentioned."],
    { title: "Cycling and Stress", passage: "In a five-year study, 3,000 working adults described how they travelled to work each day and completed regular questionnaires about stress. Participants who cycled reported lower stress than those who drove, even after the researchers accounted for age and income. The authors caution that the study shows an association, and that people who are less stressed may simply be more likely to choose to cycle.", sub: "Inference", tags: ["reading-mcq", "inference"] }),

  /* ---------- Listening ---------- */
  PTE_L.mcq("Summarize spoken text", M, "Which is the best summary of the lecture extract?",
    ["Honeybees communicate the location of food through a dance that signals both distance and direction relative to the sun.", "Honeybees make honey in the summer and rest in the winter.", "Dancing is a popular activity among insects of many kinds.", "The lecturer enjoys studying bees because they are fascinating."], 0,
    "The best summary captures the main point and the two key details.",
    ["Main idea and key details are included.", "Irrelevant to the lecture.", "Overgeneralised and inaccurate.", "Reflects feeling, not content."],
    { scenario: "Transcript extract (lecture): 'When a honeybee finds a good source of nectar, she returns to the hive and performs a waggle dance. The length of the straight part of the dance tells other bees how far to fly, and its angle relative to vertical shows the direction of the food relative to the sun. This remarkable system lets a colony direct many foragers to the same flower patch within minutes.'", sub: "Choosing a summary", tags: ["summarize-spoken-text"] }),
  PTE_L.sata("Summarize spoken text", M, "Which TWO points should be included in a summary of the lecture extract?",
    ["Fertile soil is created when rivers flood and deposit silt.", "The lecturer drives to work each day.", "Dams reduce flooding but also reduce the supply of silt downstream.", "Rivers are always straight.", "The lecturer dislikes dams."], [0, 2],
    "The main points are how floods create fertile soil and how dams change that supply.",
    ["A key point.", "Irrelevant personal detail.", "A key point and consequence.", "A false generalisation.", "Not stated."],
    { scenario: "Transcript extract (lecture): 'Historically, regular river floods spread silt across the plains, creating some of the most fertile soil in the world. Modern dams reduce flood damage, which is a clear benefit, but they also trap silt behind the wall, so farmers downstream often need more fertiliser. The lecturer concluded that engineers must weigh these effects.'", sub: "Selecting key points", tags: ["summarize-spoken-text"] }),
  PTE_L.mcq("Summarize spoken text", E, "In PTE Academic, how long is a typical Summarize Spoken Text response?",
    ["About 5 words", "About 50 to 70 words", "About 500 words", "One word"], 1,
    "The task usually asks for a summary of roughly 50 to 70 words.",
    ["Too short.", "The usual range is 50-70 words.", "Far too long.", "Too short."],
    { sub: "Word limit", tags: ["summarize-spoken-text", "strategy"] }),
  PTE_L.highlight("Highlight incorrect words", M, "Read the transcript while listening. Click on the words in the transcript that differ from what the speaker said.",
    "Global shipping has *contracted* rapidly since the ~introduction~ of standardised containers, which *increased* loading times and lowered ~costs~ dramatically.",
    "The altered words are 'contracted' (spoken: expanded) and 'increased' (spoken: reduced). 'introduction' and 'costs' match.",
    { title: "What the speaker said", passage: "Global shipping has expanded rapidly since the introduction of standardised containers, which reduced loading times and lowered costs dramatically.", sub: "Meaning contradictions", tags: ["highlight-incorrect-words"] }),
  PTE_L.highlight("Highlight incorrect words", M, "Read the transcript while listening. Click on the words in the transcript that differ from what the speaker said.",
    "Volunteers are *optional* to many ~charities~, because they provide *expensive* skills and ~spare~ time that organisations could not otherwise ~afford~.",
    "The speaker said 'essential' and 'valuable'; 'optional' and 'expensive' are the altered words. 'charities', 'spare' and 'afford' match the recording.",
    { title: "What the speaker said", passage: "Volunteers are essential to many charities, because they provide valuable skills and spare time that organisations could not otherwise afford.", sub: "Similar-sounding words", tags: ["highlight-incorrect-words"] }),
  PTE_L.highlight("Highlight incorrect words", H, "Read the transcript while listening. Click on the words in the transcript that differ from what the speaker said.",
    "Researchers *discovered* that students who ~sleep~ longer tend to achieve higher ~grades~, although the *relationship* may not be causal ~and~ other factors may play a role.",
    "The spoken text had 'found' for 'discovered' and 'link' for 'relationship'. Both are altered; 'sleep', 'grades' and 'and' are unchanged.",
    { title: "What the speaker said", passage: "Researchers found that students who sleep longer tend to achieve higher grades, although the link may not be causal and other factors may play a role.", sub: "Synonym substitutions", tags: ["highlight-incorrect-words"] }),
  PTE_L.highlight("Highlight incorrect words", M, "Read the transcript while listening. Click on the words in the transcript that differ from what the speaker said.",
    "The museum will ~close~ early on *Fridays* during the ~summer~ because of *construction* work on the main ~entrance~.",
    "The speaker said 'Mondays' and 'repair'. 'Fridays' and 'construction' are the two altered words.",
    { title: "What the speaker said", passage: "The museum will close early on Mondays during the summer because of repair work on the main entrance.", sub: "Announcement", tags: ["highlight-incorrect-words"] }),
  PTE_L.cloze("Write from dictation", M, "Listen to the sentence, then complete the transcription. Choose the correct word for each blank.",
    "The library will remain {{b1}} until the end of the {{b2}} term, but students may {{b3}} books online.",
    [["open", "opened", "opening"], ["autumn", "automn", "autum"], ["reserve", "reservation", "reserving"]], [0, 0, 0],
    "'Remain open' (adjective), 'autumn' (correct spelling) and 'may reserve' (base verb after modal).",
    { scenario: "Dictated sentence (read aloud once): 'The library will remain open until the end of the autumn term, but students may reserve books online.'", sub: "Spelling and grammar", tags: ["write-from-dictation"] }),
  PTE_L.mcq("Write from dictation", M, "Which transcription is correct for the dictated sentence 'Environmental policy requires cooperation between governments'?",
    ["Enviromental policy requires cooperation between governments", "Environmental policy requires co-operation between government", "Environmental policy requires cooperation between governments", "Environmental policy require cooperation between governments"], 2,
    "Correct spelling of 'environmental', the verb 's' agreement, and the plural 'governments' are all required.",
    ["Misspells 'environmental'.", "Misses the plural 'governments'.", "Spelled and inflected correctly.", "Misses the third-person -s on 'requires'."],
    { sub: "Accuracy checks", tags: ["write-from-dictation", "spelling"], tip: "Each missing or misspelled word costs points, so proofread plurals and verb endings." }),
  PTE_L.mcq("Write from dictation", E, "While listening to a dictated sentence, what is the best note-taking strategy?",
    ["Write each word as you hear it, and use the pause to check spelling and endings", "Wait until the end and then write from memory", "Write only the nouns", "Write nothing"], 0,
    "Typing as you hear and then proofreading preserves the most words.",
    ["Writing as you hear and then checking keeps the most words.", "Memory fails quickly with long sentences.", "Verbs and function words also earn points.", "Notes are necessary."],
    { sub: "Strategy", tags: ["write-from-dictation", "strategy"] }),
];

/* ================================================================== */
/* TOEFL iBT                                                          */
/* ================================================================== */
const TF_R = sec("toefl-ibt", "Reading");
const TF_L = sec("toefl-ibt", "Listening");
const TF_S = sec("toefl-ibt", "Speaking");
const TF_W = sec("toefl-ibt", "Writing");

const TF_PEAT = {
  title: "Peat Bogs and Stored Carbon",
  passage:
    "Peat bogs cover only about three percent of the world's land surface, yet they hold a large share of the carbon stored in soils. This storage capacity is a consequence of the waterlogged conditions in which bogs form. When bog plants such as sphagnum moss die, the surrounding water contains so little oxygen that decomposers cannot break the dead material down completely. Instead, it accumulates layer upon layer, at a rate of perhaps a millimetre a year, and the carbon it contains remains locked away. Drainage reverses the process. Once the water table drops, oxygen penetrates the peat, decomposition accelerates, and stored carbon is released as carbon dioxide. For this reason, conservationists regard the restoration of drained peatlands, which involves blocking drainage ditches so that water returns, as one of the most cost-effective ways of reducing emissions.",
};
const TF_CROW = {
  title: "Tool Use in Crows",
  passage:
    "Researchers studying New Caledonian crows have observed that young birds raised in captivity, with no opportunity to watch other birds, still fashion simple tools from twigs. This suggests that the tendency to make tools is at least partly inherited. However, the shapes of tools differ from one region to another in ways that cannot be explained by differences in the available materials, which implies that crows also learn techniques from older birds. Most biologists now accept that tool use in these birds results from an interaction of both influences: an inherited predisposition provides the starting point, while social learning refines and diversifies it.",
};
const TF_VF_READING = {
  title: "Vertical Farming (Reading)",
  passage:
    "Vertical farming, the practice of growing crops in stacked indoor layers, is often presented as the future of food. Supporters make three main claims. First, vertical farms use far less water than field agriculture because the water is recirculated. Second, they can be built inside cities, which shortens the distance that food must travel. Third, because the crops are grown indoors, they need no pesticides.",
};
const TF_VF_LECTURE =
  "Transcript extract (lecture): 'These claims sound compelling, but each has limits. Yes, the water is recirculated, but the artificial lighting needs enormous amounts of electricity, and generating that electricity often uses water too. Second, a city location helps with transport, but city land is expensive, so only high-value crops such as herbs and salad leaves make economic sense; staples like wheat cannot be grown that way at a profit. And third, it is true that there are no field pesticides, but growers still battle mould and insects in a closed environment, and some of them resort to other chemical treatments.'";

const TOEFL_QUESTIONS: SeedQuestion[] = [
  /* ---------- Reading ---------- */
  TF_R.mcq("Academic passages", E, "According to the passage, why does dead bog vegetation fail to decompose completely?",
    ["Peat bogs are too cold for decomposers", "The waterlogged conditions leave too little oxygen for decomposers", "Sphagnum moss is toxic to decomposers", "The layers accumulate too slowly to be reached"], 1,
    "The passage states that the surrounding water contains so little oxygen that decomposers cannot break the material down completely.",
    ["Temperature is never mentioned.", "Low oxygen in waterlogged conditions is the stated cause.", "Toxicity is not mentioned.", "The slow accumulation is a result, not a cause."],
    { ...TF_PEAT, sub: "Factual information", tags: ["factual"] }),
  TF_R.mcq("Academic passages", M, "The word 'penetrates' in the passage is closest in meaning to",
    ["escapes from", "enters and spreads through", "floats above", "is trapped within"], 1,
    "Once the water table drops, oxygen enters and spreads through the peat, enabling decomposition.",
    ["The oxygen goes into the peat, not out of it.", "'Enters and spreads through' matches the context.", "Oxygen is described as reaching the peat, not floating over it.", "Oxygen is not trapped; it causes decomposition."],
    { ...TF_PEAT, sub: "Vocabulary in context", tags: ["vocabulary"] }),
  TF_R.mcq("Academic passages", M, "Why does the author mention the blocking of drainage ditches?",
    ["To explain how peat bogs originally formed", "To give an example of how drained peatlands can be restored", "To criticise conservationists", "To show that peat grows quickly"], 1,
    "The ditches are mentioned as the method for restoring drained peatlands by allowing water to return.",
    ["Bog formation is explained earlier through plant death and low oxygen.", "It illustrates restoration, which the preceding clause introduces.", "Conservationists are presented positively.", "Peat is said to grow slowly."],
    { ...TF_PEAT, sub: "Rhetorical purpose", tags: ["rhetorical-purpose"] }),
  TF_R.ordered("Academic passages", M, "Arrange the steps in the order in which the passage describes carbon being stored in a peat bog.",
    ["Bog plants such as sphagnum moss die.", "The waterlogged surroundings contain very little oxygen.", "Decomposers are unable to break the dead material down completely.", "Dead material builds up in layers, keeping its carbon locked away."],
    "The passage moves from plant death, to the lack of oxygen, to incomplete decomposition, to accumulation and carbon storage.",
    { ...TF_PEAT, sub: "Process sequence", tags: ["sequence"] }),
  TF_R.mcq("Academic passages", M, "What does the passage suggest about regional differences in crow tools?",
    ["They are caused only by differences in available twigs", "They indicate that some tool techniques are learned socially", "They prove that tool use is not inherited", "They appear only in captive birds"], 1,
    "Because materials do not explain the differences, the author concludes that crows learn techniques from older birds.",
    ["The author explicitly rules this out.", "Social learning is the implied explanation.", "The passage states that tool use is partly inherited.", "The differences are observed between regions, not in captivity."],
    { ...TF_CROW, sub: "Inference", tags: ["inference"] }),
  TF_R.mcq("Academic passages", M, "Why does the author mention crows raised in captivity?",
    ["To show that crows prefer captivity", "To support the idea that tool making is partly inherited", "To prove that social learning is unnecessary", "To compare crows with other birds"], 1,
    "These birds had no models to copy, yet they made tools, which suggests an inherited tendency.",
    ["Preference is not discussed.", "Captive birds making tools without models supports inheritance.", "The author goes on to affirm social learning.", "No other birds are compared."],
    { ...TF_CROW, sub: "Rhetorical purpose", tags: ["rhetorical-purpose"] }),
  TF_R.sata("Academic passages", H, "Select TWO statements that the passage supports.",
    ["Tool making in these crows may have an inherited component.", "Captive crows learn tool techniques only by watching humans.", "Most biologists now see tool use in these crows as the product of inheritance and learning together.", "The tools made in different regions are identical.", "Captive crows were taught to make tools by the researchers."], [0, 2],
    "The passage supports an inherited component and the combined view held by most biologists.",
    ["Supported by the captive-raised crows.", "The passage says there was no opportunity to watch other birds.", "Supported by the final sentence.", "Shapes differ by region.", "The captive crows had no opportunity to watch other birds, so no teaching is described."],
    { ...TF_CROW, sub: "Select two", tags: ["factual"] }),
  TF_R.mcq("Academic passages", H, "Which sentence best expresses the essential information in the final sentence of the passage?",
    ["Biologists agree that inheritance alone explains tool use.", "Both an inherited tendency and learning from others shape tool use in the crows.", "Social learning has replaced inherited behaviour in these birds.", "Biologists are unable to agree on the causes of tool use."], 1,
    "The sentence says inheritance provides the starting point and social learning refines it, so both contribute.",
    ["It omits learning.", "It preserves both influences.", "It says learning replaced inheritance, which is not stated.", "It says most biologists accept a combined view."],
    { ...TF_CROW, sub: "Sentence simplification", tags: ["simplification"] }),

  /* ---------- Listening ---------- */
  TF_L.mcq("Lectures", M, "What is the main purpose of the lecture?",
    ["To explain how a chain of volcanic islands can form", "To compare two different types of volcano", "To describe how islands are named", "To argue that volcanoes are becoming more dangerous"], 0,
    "The professor describes how a plate moving over a fixed hotspot produces a line of islands of increasing age.",
    ["The lecture explains island chain formation.", "No comparison of volcano types is made.", "Naming is not discussed.", "No claim about danger is made."],
    { scenario: "Transcript extract (geology lecture): 'Imagine a conveyor belt moving slowly past a stationary heat lamp. The belt is the oceanic plate, and the lamp is a hotspot, a plume of hot rock rising from deep in the mantle. As the plate drifts over the hotspot, magma breaks through and builds a volcano. Millions of years later the plate has carried that volcano away, and a new one starts to form over the hotspot. Over time, you get a chain of islands, with the oldest furthest from the hotspot and the youngest right above it.'", sub: "Main purpose", tags: ["main-idea"] }),
  TF_L.mcq("Lectures", M, "Why does the professor mention a conveyor belt and a heat lamp?",
    ["To describe the equipment used in the experiment", "To help students picture how plates move over a hotspot", "To explain why the island is warm", "To show that hotspots move quickly"], 1,
    "The professor uses an analogy to illustrate the movement of the plate over a stationary hotspot.",
    ["There was no experiment.", "It is an analogy for the plate and hotspot.", "Warmth of the island is not discussed.", "The plate moves slowly and the hotspot is stationary."],
    { scenario: "Transcript extract (geology lecture): 'Imagine a conveyor belt moving slowly past a stationary heat lamp. The belt is the oceanic plate, and the lamp is a hotspot, a plume of hot rock rising from deep in the mantle. As the plate drifts over the hotspot, magma breaks through and builds a volcano. Millions of years later the plate has carried that volcano away, and a new one starts to form over the hotspot.'", sub: "Function of an analogy", tags: ["function"] }),
  TF_L.sata("Lectures", M, "Which TWO examples does the professor give of the anchoring effect?",
    ["A shop displays an expensive jacket next to an average-priced one", "A student takes longer to answer a question in a quiet room", "A negotiator opens with a very high price", "A customer reads a review before purchasing", "A driver ignores a speed limit"], [0, 2],
    "The professor gives the jacket display and the high opening price as examples of anchoring.",
    ["Given as the first example.", "Not mentioned.", "Given as the second example.", "Not mentioned.", "Not mentioned."],
    { scenario: "Transcript extract (psychology lecture): 'The anchoring effect means that the first number we encounter strongly influences our later judgements. Think about a boutique that puts a very expensive jacket next to an average-priced one: the average one suddenly looks like a bargain. Or consider a negotiator who opens with a very high price. Even if the final deal is lower, it often ends up higher than if she had started with a modest figure.'", sub: "Selecting examples", tags: ["detail"] }),
  TF_L.ordered("Lectures", M, "Put the stages of the experiment in the order in which the professor describes them.",
    ["Participants were shown a random number.", "They were asked whether the number was higher or lower than a given quantity.", "They were asked to estimate the actual quantity.", "Estimates were compared across the groups."],
    "The professor describes showing a number, asking a comparison, requesting an estimate, and finally comparing results.",
    { scenario: "Transcript extract (psychology lecture): 'In the classic experiment, participants first watched a wheel produce a random number. Next, they were asked whether the quantity in question, say, the number of countries in a continent, was higher or lower than that number. Only then did they give their own estimate. Finally, the researchers compared the estimates between those who had seen high numbers and those who had seen low ones.'", sub: "Organisation", tags: ["sequence"] }),
  TF_L.mcq("Conversations", E, "Why does the student visit the professor's office?",
    ["To ask for an extension on a paper", "To drop the course", "To borrow a book", "To complain about a grade"], 0,
    "The student says she is behind because of illness and asks whether she can hand in the paper later.",
    ["She asks to submit later.", "She does not mention dropping the course.", "No book is requested.", "She does not dispute a grade."],
    { scenario: "Transcript extract (office hours): Student: 'Professor Moore, I've been ill for the past week, and I'm behind on the paper. Would it be possible to hand it in on Monday instead of Friday?' Professor: 'Let me think about that.'", sub: "Purpose of conversation", tags: ["purpose"] }),
  TF_L.mcq("Conversations", M, "What does the professor suggest the student do?",
    ["Submit an outline now and the paper on Monday", "Rewrite the topic entirely", "Ask the department for a different advisor", "Skip the paper"], 0,
    "The professor agrees to an extension if the student sends an outline that day.",
    ["This is the stated condition.", "A new topic is not suggested.", "No advisor change is raised.", "Skipping is not offered."],
    { scenario: "Transcript extract (office hours): Professor: 'Monday is fine, provided I see something by the end of today. If you can email me an outline this afternoon, I'll know you're on track, and then the full paper can come on Monday. Does that work?' Student: 'Yes, definitely. Thank you.'", sub: "Detail", tags: ["detail"] }),
  TF_L.mcq("Conversations", M, "Listen again to part of the conversation. Why does the student say, 'I suppose that could work'?",
    ["She is enthusiastic about the plan", "She is not fully convinced the plan is ideal", "She does not understand the plan", "She wants the librarian to repeat it"], 1,
    "The hedging phrase 'I suppose' and the pause signal reluctant acceptance.",
    ["An enthusiastic speaker would use stronger words.", "'I suppose' signals mild reluctance.", "She repeats the plan accurately, so she understands.", "She does not ask for repetition."],
    { scenario: "Transcript extract (library help desk): Librarian: 'The only way is to use the reading room, since the book can't leave the building.' Student: 'Hmm. I suppose that could work... I just have a part-time job, so I'll have to go on Saturdays.' Librarian: 'The reading room is open until four on Saturdays.'", sub: "Speaker attitude", tags: ["attitude"] }),
  TF_L.mcq("Conversations", H, "What will the student probably do next?",
    ["Visit the reading room on Saturday", "Cancel her job", "Buy the book online", "Ask another librarian for a loan"], 0,
    "She accepts the reading room option and says she will go on Saturday, within the hours the librarian gives.",
    ["She plans to go on Saturday.", "She says she has a job she must keep.", "Purchasing is not mentioned.", "The librarian says the book cannot leave the building."],
    { scenario: "Transcript extract (library help desk): Librarian: 'The only way is to use the reading room, since the book can't leave the building.' Student: 'Hmm. I suppose that could work... I just have a part-time job, so I'll have to go on Saturdays.' Librarian: 'The reading room is open until four on Saturdays.' Student: 'Then I'll go this weekend.'", sub: "Prediction", tags: ["inference"] }),

  /* ---------- Speaking ---------- */
  TF_S.mcq("Independent", M, "Which response to 'Do you prefer studying alone or in a group?' is best organised?",
    ["I like alone. It is good. Alone is good for me. I like it.", "I prefer studying alone, for two reasons. First, I concentrate better without distractions. Second, I can set my own pace. For example, last semester I finished a long reading list in a week by working alone.", "Groups are used in many countries and many ways.", "Both are fine and it does not matter."], 1,
    "A strong independent response states a clear opinion, gives two reasons and includes a specific example.",
    ["Repetitive and undeveloped.", "Clear opinion, two reasons and a supporting example.", "Does not answer the question.", "Avoids taking a position."],
    { sub: "Organisation", tags: ["independent"] }),
  TF_S.mcq("Independent", M, "Which sentence is the best transition between two reasons?",
    ["Also.", "Another reason I prefer this is that it saves me money.", "Next thing I say.", "And the thing is."], 1,
    "A full transition clearly signals a new reason.",
    ["A single word is weak.", "Clearly signals the second reason.", "Unnatural phrasing.", "Informal and unclear."],
    { sub: "Transitions", tags: ["independent", "cohesion"] }),
  TF_S.sata("Independent", M, "Which TWO habits improve a 45-second spoken response?",
    ["Stating your opinion in the first sentence", "Speaking quickly to include more ideas", "Using a specific example", "Memorising a complete answer in advance", "Leaving long silences to think"], [0, 2],
    "A clear opening and a concrete example make a short response focused and convincing.",
    ["A clear opinion helps the listener.", "Rushing reduces clarity.", "Examples add detail.", "Memorised answers often miss the question.", "Long silences reduce delivery."],
    { sub: "Delivery habits", tags: ["independent"] }),
  TF_S.speaking("Integrated", M, "Read the announcement, listen to the conversation, and then respond. Prepare for 30 seconds and speak for 60 seconds.",
    "The woman expresses her opinion about the university's plan. State her opinion and explain the reasons she gives for holding it.",
    30, 60, undefined,
    ["Delivery: Clear, steady speech with natural pacing.", "Language Use: Accurate grammar and a range of vocabulary.", "Topic Development: Accurately reports the opinion and the reasons from the listening, linked to the reading."],
    "The woman disagrees with the plan to close the print lab. She gives two reasons. First, she says that many students cannot afford their own printers, so they depend on the lab for course materials. Second, she points out that the campus network is often slow before deadlines, which would make printing from home unreliable.",
    "A strong integrated response states the speaker's opinion, reports each reason accurately and uses paraphrase rather than copying.",
    { title: "Campus Announcement", passage: "The university will close the Central Print Lab at the end of the semester. Most coursework is now delivered online, and the lab's equipment is costly to maintain. Students who still need printed materials may use the printing service in the library, which will be extended with additional machines.", scenario: "Transcript extract (conversation): Woman: 'I can't believe they're closing the print lab. Not everyone has a printer; mine broke in September and I can't afford a new one. And anyway, the library only has a few machines, and the queue before deadlines is endless.' Man: 'I guess that makes sense, but they're saying it's mostly online now.' Woman: 'Maybe, but the Wi-Fi crashes whenever everyone logs in at once. I'd rather print early than risk it.'", sub: "Opinion and reasons", tags: ["integrated"] }),
  TF_S.mcq("Integrated", M, "Which sentence accurately reports the man's attitude in the conversation?",
    ["He strongly opposes the plan", "He partly understands the university's reasoning", "He has no opinion", "He plans to protest"], 1,
    "The man says 'I guess that makes sense', acknowledging the university's reasoning without full agreement.",
    ["He does not strongly oppose it.", "He concedes part of the university's argument.", "He expresses a mild view.", "No protest is mentioned."],
    { scenario: "Transcript extract (conversation): Woman: 'They're closing the print lab, and the library machines are always busy.' Man: 'I guess that makes sense, since most of the coursework is online now, but I see your point about the queue.'", sub: "Reporting attitude", tags: ["integrated"] }),
  TF_S.mcq("Integrated", H, "Which note-taking approach is most useful for an integrated speaking task?",
    ["Writing every word", "Noting the main point and two or three key reasons or examples, with short keywords", "Writing only dates", "Not taking notes"], 1,
    "Key points in short form let you paraphrase accurately within the time limit.",
    ["Verbatim notes are impossible to produce quickly.", "Keywords for the main point and reasons support a clear response.", "Dates alone are insufficient.", "Notes help recall."],
    { sub: "Note-taking", tags: ["integrated", "strategy"] }),
  TF_S.mcq("Integrated", M, "Which phrase best introduces a paraphrased reason from a lecture?",
    ["The professor mentions that", "The professor says: copy", "My opinion is that", "Everybody thinks that"], 0,
    "Attributing a point to the speaker with a reporting phrase signals accurate reporting.",
    ["Reporting verbs attribute the point.", "Not natural or accurate.", "The task asks for the speaker's view, not yours.", "A generalisation not in the source."],
    { sub: "Reporting language", tags: ["integrated", "language"] }),

  /* ---------- Writing ---------- */
  TF_W.writing("Integrated", H, "Summarize the points made in the lecture, being sure to explain how they challenge the specific claims made in the reading passage. Typically 150-225 words.",
    "Summarize the points made in the lecture, being sure to explain how they challenge the specific claims made in the reading passage.",
    150, "TOEFL iBT Integrated Writing",
    ["Content: Accurately presents the lecture's main points and their relation to the reading.", "Organisation: Clear structure with an introduction and paragraphs for each point.", "Language: Accurate grammar, paraphrased vocabulary and appropriate linking."],
    "The lecturer challenges each of the three claims made in the reading about vertical farming.\n\nFirst, the reading says that vertical farms save water because it is recirculated. The lecturer replies that the lights require huge amounts of electricity, and producing that electricity often consumes water as well, so the saving may be smaller than claimed.\n\nSecond, the passage argues that building farms inside cities shortens transport distances. However, the professor points out that urban land is expensive, so only high-value crops such as herbs and salad leaves are profitable, and staples such as wheat cannot be grown this way.\n\nFinally, the reading states that indoor crops need no pesticides. The lecturer contradicts this by explaining that growers must still deal with mould and insects in a closed space, and some use other chemical treatments.",
    "A strong integrated response matches each lecture point to the reading claim it challenges, in paraphrased language and without personal opinion.",
    { ...TF_VF_READING, scenario: TF_VF_LECTURE, sub: "Reading-lecture contrast", tags: ["integrated"] }, 225),
  TF_W.mcq("Integrated", M, "Which is the best opening sentence for the integrated response?",
    ["I think vertical farming is a good idea, and I will explain why.", "The lecturer casts doubt on each of the three claims made in the reading about vertical farming.", "Vertical farming is the practice of growing crops in stacked layers.", "The reading and the lecture are both about farming."], 1,
    "The opening should state that the lecture challenges the reading's claims, with no personal opinion.",
    ["The task does not ask for your opinion.", "States the relationship between the sources.", "Repeats the reading's definition without addressing the task.", "Too general and does not state the relationship."],
    { ...TF_VF_READING, sub: "Opening", tags: ["integrated"] }),
  TF_W.mcq("Integrated", H, "Which sentence paraphrases the lecturer's point about pesticides most accurately?",
    ["Growers do not use any chemicals in indoor farms.", "Indoor growers still have to manage mould and insects, and some use chemical treatments.", "Pesticides are harmful to plants indoors.", "Indoor crops grow faster because of pesticides."], 1,
    "The lecturer says mould and insects remain problems and some growers use other chemicals.",
    ["This repeats the reading's claim, not the lecturer's.", "Accurate paraphrase.", "Not said.", "Not said."],
    { scenario: TF_VF_LECTURE, sub: "Paraphrase", tags: ["integrated", "paraphrase"] }),
  TF_W.ordered("Integrated", M, "Arrange the sentences to form a logical paragraph in an integrated response.",
    ["The reading claims that vertical farms need far less water than field agriculture.", "The lecturer disputes this by noting that artificial lighting requires large amounts of electricity.", "She adds that producing that electricity often uses water as well.", "Therefore, the lecturer suggests that the overall saving may be much smaller than the reading implies."],
    "The paragraph moves from the reading's claim, to the lecturer's challenge, to extra support, and ends with the conclusion marked by 'Therefore'.",
    { sub: "Paragraph coherence", tags: ["integrated", "cohesion"] }),
  TF_W.writing("Academic discussion", M, "Write a post responding to the professor's question. Express and support your opinion and contribute to the discussion. An effective response is typically at least 100 words.",
    "Write a post for the online class discussion. In your response, state your opinion, support it with reasons or examples, and add something new to what the other students have said.",
    100, "TOEFL iBT Academic Discussion",
    ["Relevance: Responds to the professor's question and engages with the other posts.", "Development: Gives clear reasons and specific examples.", "Language: Accurate grammar and varied vocabulary, with a natural academic tone."],
    "I agree with Maria that universities should require all students to take a course in basic statistics, but I would add a further reason. As Maria says, data appear in every profession. However, statistics also teaches students to question claims they read in the news. For example, when a headline says that a food 'doubles' the risk of illness, someone with statistical training will ask what the original risk was. Because misleading numbers are everywhere, this habit protects people in their personal as well as professional lives. Ken worries about the workload, which is a fair point, but a single introductory course would be manageable.",
    "An effective discussion post takes a position, responds to at least one classmate by name, and adds a new reason with an example.",
    { passage: "Professor Alvarez: This week we are discussing curriculum. Should universities require all students, regardless of major, to take a basic course in statistics? Why or why not?\n\nMaria: I think yes. Data appears in every profession, from nursing to marketing, so everyone benefits from understanding it.\n\nKen: I'm not sure. Students already have heavy workloads, and a mandatory course could take time away from subjects that matter more for their careers.", title: "Online Class Discussion", sub: "Responding to peers", tags: ["academic-discussion"] }),
  TF_W.mcq("Academic discussion", M, "Which contribution is strongest in an academic discussion post?",
    ["I agree with Ken.", "Ken raises a fair point about workload; however, a single introductory course would not add much pressure, and the skills it teaches would save students time in later courses.", "Statistics is a subject.", "I do not care about this question."], 1,
    "A strong post names a classmate, engages with the point and adds new support.",
    ["Too brief and adds nothing new.", "Engages with a peer and adds reasoning.", "Does not take a position.", "Dismissive."],
    { sub: "Engaging with peers", tags: ["academic-discussion"] }),
  TF_W.sata("Academic discussion", M, "Which TWO features strengthen a response in the academic discussion task?",
    ["A clear opinion stated early", "Copying a classmate's reasons", "A specific example", "Informal text-message abbreviations", "A very long quotation from a textbook"], [0, 2],
    "A clear stance and a specific example make the post focused and persuasive.",
    ["Helps the reader follow your position.", "Does not add anything new.", "Examples make reasons concrete.", "Inappropriate for academic writing.", "Does not show your own reasoning."],
    { sub: "Features of strong posts", tags: ["academic-discussion"] }),
];

/* ================================================================== */
/* MATERIALS                                                          */
/* ================================================================== */
const MATERIALS_PART_1: SeedMaterial[] = [
  /* ---------- IELTS Academic ---------- */
  mat("ielts-academic", "Listening", "Lectures", "notes", "Signposting and Distractors in IELTS Listening",
    "How speakers signal changes, corrections and key points, and how to avoid the most common distractors.", 6,
    `# Signposting and Distractors in IELTS Listening

Speakers rarely say the answer in the same words as the question. Instead they use **signposts**, short phrases that tell you what is coming next or that a previous idea is being replaced.

## Signposts that introduce a new point
- "There are three main factors. First... Second... Finally..."
- "Let's turn to..." / "Moving on to..."
- "What I want to focus on is..."

## Signposts that warn of a change
- **Contrast:** however, but, although, on the other hand, in contrast
- **Correction:** actually, sorry, I mean, no, wait
- **Conclusion:** so, in short, to sum up, the upshot is

## How distractors work
Examiners place two or three plausible details near the answer. A typical sequence is:

1. A speaker states a first value (a date, price or place).
2. The other speaker corrects it or offers an alternative.
3. The final version is the answer.

Example: "Shall we meet on Tuesday? Actually, I have a class then, so how about Thursday at ten?" The answer is Thursday, ten o'clock.

## Practical routine
1. **Read the questions first** during preparation time and underline the key word in each one.
2. **Predict the type of answer** (a number, a name, a reason, a place) so that you listen for it.
3. **Write as you listen**, then check spelling and grammar in the transfer time.
4. **Move on** if you miss an answer; the recording does not wait, and the next question may already be playing.
5. **Check word limits**: "no more than two words" means that three words are wrong, even if correct in meaning.

## Paraphrase awareness
The recording will say "cheap" where the question says "inexpensive", or "after lunch" where the question says "in the afternoon". Practise noting synonym pairs so that you recognise them in real time.

**Common traps:** writing the first number you hear instead of the corrected one; ignoring the word limit; losing your place after a missed answer; and spelling errors in names, which are marked wrong.`),
  mat("ielts-academic", "Reading", "Academic passages", "notes", "Spotting Paraphrase in Academic Reading",
    "Locate answers by matching meaning rather than exact words, with paraphrase patterns to look for.", 6,
    `# Spotting Paraphrase in Academic Reading

IELTS Academic Reading questions are almost never worded like the passage. To find an answer quickly, you must recognise **paraphrase**: the same meaning in different words.

## Four common paraphrase patterns
1. **Synonyms:** rapid growth / swift expansion; harmful / damaging.
2. **Word-form changes:** "The city expanded" becomes "the expansion of the city"; "to decide" becomes "the decision".
3. **Structural change:** active to passive, or one long sentence turned into two short ones.
4. **Generalisation:** "oak, beech and ash" becomes "different types of tree".

## A reliable method
1. **Skim the passage** for a few seconds to see the structure: topic of each paragraph.
2. **Underline keywords in the question** that cannot easily be paraphrased: names, numbers, dates and technical terms.
3. **Scan** for those keywords or their synonyms and find the paragraph.
4. **Read closely** around that sentence and compare meaning, not wording.
5. **Eliminate** options that are too extreme, partly true or about a different paragraph.

## Matching headings
Each paragraph usually has one main idea. Read the first and last sentences, and decide what the paragraph is *about* before looking at the list of headings. A heading that matches only one detail inside the paragraph is a distractor.

## Summary completion
- Check the grammar: does the gap need a noun, a verb or an adjective?
- Stay within the word limit.
- Answers usually appear in the same order as in the passage.

## Time management
Spend about twenty minutes on each passage. If a question takes more than a minute and a half, mark it and move on; you can return at the end.

**Common traps:** choosing an answer because the same word appears in the passage (the meaning may be different); missing negatives such as "not" or "rarely"; and spending too long on one question.`),
  mat("ielts-academic", "Writing", "Task 2 (essay)", "notes", "Building a Band 7 Task 2 Essay",
    "A paragraph-by-paragraph plan for a clear, well-developed Task 2 response in forty minutes.", 7,
    `# Building a Band 7 Task 2 Essay

A strong Task 2 essay answers **every part of the question**, develops a clear position, and uses a range of accurate language. A flexible plan helps you stay organised.

## Step 1: Analyse the question (2 minutes)
Identify the essay type:
- **Opinion:** "To what extent do you agree or disagree?"
- **Discussion:** "Discuss both views and give your opinion."
- **Problem and solution:** "What are the causes and what can be done?"
- **Two-part question:** answer both questions directly.

## Step 2: Plan (3 minutes)
Write your position and two main ideas, each with a reason or example. Decide the order before you start.

## Step 3: Write (30 minutes)
**Introduction (2 sentences):** paraphrase the topic, then state your position or outline.

**Body paragraph 1:** topic sentence, explanation, example.

**Body paragraph 2:** topic sentence, explanation, example (or the opposing view, if required).

**Conclusion (1-2 sentences):** restate your position. Do not add new ideas.

## Step 4: Check (5 minutes)
Look for missing articles, subject-verb agreement, punctuation, and sentences that are too long to follow.

## Language that raises the score
- **Concession:** "Although some argue that..., I believe..."
- **Cause and effect:** "This leads to...", "As a result..."
- **Hedging:** "tends to", "is likely to", "in many cases"
- **Examples:** "For instance...", "A case in point is..."

## Cohesion
Use a variety of linking devices but avoid overusing "Firstly, secondly". Central ideas in each paragraph should connect to the next with a reference such as "This trend" or "Such measures".

**Common traps:** memorised paragraphs that do not fit the question; an unclear position; writing fewer than 250 words; and using complex vocabulary inaccurately instead of simple words correctly.`),
  mat("ielts-academic", "Speaking", "Part 3 discussion", "notes", "Extending Part 3 Answers",
    "Frameworks for turning abstract questions into developed, natural answers.", 5,
    `# Extending Part 3 Answers

Part 3 is a discussion about abstract ideas related to the Part 2 topic. Examiners listen for **extended answers** with reasons, comparisons and speculation.

## The A-R-E framework
- **A**nswer: give a direct response.
- **R**eason: explain why.
- **E**xample: give a short example or comparison.

Question: "Why do people enjoy travelling?"
"Mainly because it takes them out of their routine (A). Seeing different cultures can be inspiring, and it often changes the way people think (R). For example, many of my friends came back from trips abroad with new ideas about their careers (E)."

## Useful discussion language
- **Giving opinions:** "I'd say that...", "As far as I'm concerned..."
- **Comparing past and present:** "In the past, people used to..., whereas nowadays..."
- **Speculating:** "It might well be that...", "I suppose it could lead to..."
- **Balancing:** "On the one hand..., but on the other hand..."
- **Buying time:** "That's an interesting question. Let me think..."

## Handling difficult questions
If you do not know much about the topic, talk about it in general terms or from another angle: "I haven't really thought about that, but I imagine that..." Staying fluent matters more than being an expert.

## Pronunciation and stress
Emphasise key words in each phrase, and use rising and falling intonation instead of a flat tone.

## Practice
Record yourself answering one Part 3 question per day for two minutes. Listen for repeated words and long pauses, then improve your next answer.

**Common traps:** answering with one sentence; repeating the examiner's question word for word; memorised speeches; and giving only personal anecdotes when the question asks about society.`),
  mat("ielts-academic", "Listening", "Conversations", "guide", "IELTS Listening: Section-by-Section Guide",
    "What each of the four listening sections tests and the habits that earn marks in each.", 8,
    `# IELTS Listening: Section-by-Section Guide

The Listening test has four sections of ten questions each, played once. The recordings become progressively harder.

## Section 1: Everyday conversation
A transaction or enquiry between two people (booking, registration, enquiry).
- Expect names, numbers, dates and addresses.
- Letters may be spelled out; write them as you hear them.
- Corrections are common.

## Section 2: Monologue in a social setting
A talk, tour or announcement.
- Questions often include **map or plan labelling** and multiple choice.
- Follow directional language: "opposite", "next to", "behind", "on your left".

## Section 3: Academic discussion
Two to four speakers, such as students and a tutor.
- Opinions and agreement/disagreement are tested.
- Listen for attitude: "I'm not convinced", "That's a fair point".
- Notes on feelings and decisions matter more than facts.

## Section 4: Academic lecture
A single speaker on an academic subject with no break.
- Questions frequently ask you to complete notes or a summary.
- Signposts such as "The second factor is..." guide you.
- Vocabulary can be technical, but the words are usually spelled in the question paper.

## Habits that earn marks
1. Use the preparation time to read ahead.
2. Underline key words and predict answer types.
3. Keep your eyes on the questions, not the transcript of your thoughts.
4. Write answers directly on the paper; use the ten minutes at the end to transfer carefully.
5. Check spelling, plurals and word limits.

## Study plan
Listen to a variety of accents for 20 minutes a day. Pause after each sentence and repeat it. Dictate short passages to improve spelling and accuracy.

**Common traps:** giving up after a missed answer; not reading ahead; ignoring plural -s; and writing numbers incorrectly, such as 15 and 50, because of stress differences.`),

  /* ---------- IELTS General Training ---------- */
  mat("ielts-general", "Listening", "Social contexts", "notes", "Form, Table and Map Completion in Sections 1 and 2",
    "Strategies for the everyday listening tasks: forms, tables, directions and plans.", 6,
    `# Form, Table and Map Completion in Sections 1 and 2

The first two sections of IELTS General Training Listening deal with everyday life. The most common tasks are **form completion**, **table completion** and **map or plan labelling**.

## Form and table completion
1. Read the headings and decide what kind of detail is missing (a name, a time, a price).
2. Check the **word limit** (for example, "NO MORE THAN TWO WORDS AND/OR A NUMBER").
3. Listen for the answers in order; they follow the conversation.
4. Write numbers as digits and check the spelling of names.

### Typical details
- **Phone numbers and dates:** speakers say "double seven" or "the twenty-first of March".
- **Spelling:** letters are spelled out slowly; be ready to write "W-I-L-L-I-A-M-S".
- **Prices:** note both pounds and pence, such as £4.50.

## Map and plan labelling
1. Find the starting point on the map.
2. Study the layout: roads, buildings, entrances.
3. Listen for **direction words**: turn left, go straight on, past, opposite, next to, at the end of.
4. Follow the speaker's route with your pencil.
5. Label each location as you hear it, not at the end.

## Useful vocabulary
- Locations: *opposite, adjacent to, behind, between, on the corner of*
- Directions: *roundabout, junction, crossing, bridge, pedestrian zone*
- Time: *fortnight, weekday, evening class*

## Dealing with distractors
Everyday conversations often include changes: "No, wait, we're closed on Mondays." Always listen to the end of a speaker's sentence before writing.

## Practice
Listen to voicemail messages, shop announcements or radio travel news and write the key details. Compare them with a transcript if available.

**Common traps:** writing more words than the limit allows; confusing similar-sounding numbers (13 and 30); misspelling names after hearing them spelled; and losing your place on a map.`),
  mat("ielts-general", "Reading", "Everyday texts", "notes", "Scanning Everyday Texts Quickly",
    "How to locate details in adverts, notices, timetables and leaflets in Section 1.", 5,
    `# Scanning Everyday Texts Quickly

Section 1 of General Training Reading uses short, practical texts: advertisements, timetables, notices and leaflets. These reward **speed and accuracy** rather than deep reading.

## What is scanning?
Scanning means moving your eyes quickly over a text to find a specific piece of information, such as a name, number or date, without reading every word.

## Step-by-step method
1. **Read the question** and underline the key word.
2. **Predict the form**: a time, a price, a place, a name (capital letters), or a number.
3. **Move your eyes** down the text looking for that form.
4. **Stop and read** the sentence around it.
5. **Check** the question for qualifiers such as "only", "except" and "at least".

## Reading layouts
- **Timetables:** read the column and row headings first.
- **Adverts:** look at the bold text, prices, conditions and small print.
- **Notices:** look for dates, rules and who the notice applies to.

## Matching questions
When you have to match statements to texts, first read the headings of each text. Then find the details in the text that carry the same meaning as the statement.

## True/False/Not Given
- **True:** the text says the same thing.
- **False:** the text says the opposite.
- **Not Given:** the text does not mention the idea.
Compare meaning rather than words.

## Paraphrase examples
- "No charge for children under five" is the same as "children under five go free".
- "Open all year except Christmas Day" means "closed on 25 December".

## Time management
Aim for about 15 minutes on Section 1, so that you leave more time for the longer texts in Sections 2 and 3.

**Common traps:** choosing an answer because a word from the question appears in the text, ignoring the small print; confusing "least" with "most"; and reading every word, which wastes time.`),
  mat("ielts-general", "Writing", "Task 1 (letter)", "notes", "Formal, Semi-formal and Informal Letters",
    "Choosing the right register, opening and closing for each type of Task 1 letter.", 7,
    `# Formal, Semi-formal and Informal Letters

Task 1 in General Training asks for a letter of about 150 words. Success depends on three things: covering **all bullet points**, using the **right tone**, and organising ideas clearly.

## Identify the recipient
| Recipient | Register | Opening | Closing |
|---|---|---|---|
| Unknown person (company) | Formal | Dear Sir or Madam, | Yours faithfully, |
| Named person you do not know well | Semi-formal | Dear Mr Hughes, | Yours sincerely, |
| Friend or relative | Informal | Dear Anna, | Best wishes / Love, |

## Formal language
- "I am writing to enquire about..."
- "I would be grateful if you could..."
- "I look forward to hearing from you."
- No contractions (do not, I would).

## Informal language
- "Thanks so much for your letter!"
- "I'm writing to ask if you could..."
- Contractions and friendly phrases are acceptable.

## Structure
1. **Opening sentence:** state the purpose ("I am writing to complain about...").
2. **Paragraph 1:** the first bullet point with details.
3. **Paragraph 2:** the second bullet point.
4. **Paragraph 3:** the third bullet point, often a request or suggestion.
5. **Closing line:** polite ending and sign-off.

## Functional language
- **Complaining:** "I was disappointed to find that..."
- **Requesting:** "Could you possibly...?"
- **Explaining:** "The reason I am writing is..."
- **Apologising:** "I am sorry for any inconvenience."

## Planning
Spend two minutes noting two or three details for each bullet point. Count your words roughly: 150 words is about 10 to 12 lines of normal handwriting.

**Common traps:** mixing registers, for example using "Hi" and then "I would be most obliged"; omitting a bullet point; writing a very long letter and running out of time; and forgetting to match the sign-off to the opening.`),
  mat("ielts-general", "Writing", "Task 2 (essay)", "notes", "Planning a Task 2 Essay in Five Minutes",
    "A quick planning routine that keeps your argument focused and your paragraphs balanced.", 5,
    `# Planning a Task 2 Essay in Five Minutes

Task 2 carries more marks than Task 1 and should take about 40 minutes. A short plan prevents rambling and repeated ideas.

## Minute 1: Understand the question
Underline the **topic** and the **task words**:
- *Discuss both views and give your opinion* means two views plus your view.
- *To what extent do you agree?* means give a clear position.
- *What are the causes and solutions?* means both parts.

## Minutes 2-3: Generate ideas
Make a quick table:

| Idea | Reason | Example |
|---|---|---|
| Main idea 1 | Why it matters | Real-life case |
| Main idea 2 | Why it matters | Real-life case |

Aim for two strong ideas, not four weak ones.

## Minutes 4-5: Order and decide
Number your ideas. Decide the position for your introduction and conclusion so that they match.

## Writing from the plan
- **Introduction:** paraphrase the topic and say what you will argue.
- **Body paragraphs:** topic sentence, explanation, example.
- **Conclusion:** restate your opinion in different words.

## General Training topics
Questions are often about everyday social issues: education, health, family, technology, work and the environment. Draw on your own experience for examples.

## Improving accuracy
- Keep sentences simple when you are unsure.
- Use a range of linking words, but check punctuation.
- Leave two minutes at the end to check articles (a/the), plurals and verb endings.

**Common traps:** writing about the topic in general instead of answering the question; giving examples that are too vague ("many people"); changing your opinion in the conclusion; and writing under 250 words.`),
  mat("ielts-general", "Speaking", "Part 1 interview", "guide", "IELTS Speaking Parts 1-3: Complete Guide",
    "What the examiner expects in each part of the Speaking test and how to practise.", 8,
    `# IELTS Speaking Parts 1-3: Complete Guide

The Speaking test lasts 11 to 14 minutes and is a conversation with an examiner. It is recorded and scored on four criteria: fluency and coherence, lexical resource, grammatical range and accuracy, and pronunciation.

## Part 1: Interview (4-5 minutes)
Familiar topics such as home, work, hobbies and food.
- Answer directly, then add a reason or example.
- Aim for two or three sentences per answer.
- Use present and past tenses accurately.

## Part 2: Individual long turn (3-4 minutes)
You receive a cue card and have one minute to prepare notes.
- Speak for up to two minutes without interruption.
- Follow the prompts in order, adding details.
- Use past tenses for stories and present tenses for descriptions.
- If you finish early, add feelings, reasons or a conclusion.

## Part 3: Discussion (4-5 minutes)
Abstract questions connected to the Part 2 topic.
- Express opinions, compare, speculate.
- Use phrases like "It depends on..." and "In my view...".

## Using your preparation minute
Write keywords, not sentences:
- **Who/what:** one keyword
- **When/where:** one keyword
- **Why important:** one reason

## Improving each criterion
- **Fluency:** speak in phrases and avoid long pauses; fillers like "well" are fine in moderation.
- **Vocabulary:** learn topic words and collocations, such as "heavy traffic" and "tight deadline".
- **Grammar:** mix simple and complex sentences.
- **Pronunciation:** practise word stress and linking.

## Practice routine
1. Record answers on your phone.
2. Listen and identify errors or pauses.
3. Re-record the answer improving two things.

**Common traps:** memorised answers that do not match the question; one-word replies in Part 1; speaking too fast; and saying "I don't know" without attempting an answer.`),

  /* ---------- OET Nursing ---------- */
  mat("oet-nursing", "Listening", "Consultation extracts", "notes", "Note-taking for Consultation Extracts",
    "Fast, structured note-taking for Part A of OET Listening, where you complete clinical notes.", 6,
    `# Note-taking for Consultation Extracts

In OET Listening Part A you hear two consultations and complete notes under headings. The answers are short words or phrases and appear in the order of the recording.

## Before the recording
- Read the headings (such as symptoms, medication, past history, advice).
- Predict the **type** of answer: a drug, a duration, a symptom, a frequency.
- Notice the word limit and the grammar of each gap (noun, adjective, number).

## While listening
1. Listen for the **content word**, not the whole sentence.
2. Write what you hear immediately; fix the spelling afterwards.
3. Keep your pencil on the page. If you miss one answer, move on.

## Clinical language that often appears
- **Pain description:** sharp, dull, throbbing, radiating, intermittent
- **Frequency:** twice daily, as needed, every four hours
- **Duration:** for about a week, since last Tuesday
- **Medication:** over-the-counter, side effects, dose

## Paraphrase in consultations
The patient says "it comes and goes", and the notes say "intermittent". The nurse says "avoid anything strenuous", and the notes say "no heavy lifting". Practise linking everyday speech to clinical vocabulary.

## Spelling
Medical words are marked for spelling. Learn common terms such as *diarrhoea, paracetamol, dizziness, constipation, ibuprofen*. Accept either British or American spelling consistently.

## After the recording
Check that:
- Your answer fits the heading.
- Plurals and verb endings are correct.
- You have not copied extra words beyond the limit.

## Practice
Use short patient interviews and write notes under headings. Compare with the transcript for missed details.

**Common traps:** writing the first symptom mentioned when the patient later corrects it; spelling errors in drug names; confusing frequency with duration; and writing a full sentence in a gap that needs only a noun.`),
  mat("oet-nursing", "Reading", "Expeditious reading", "notes", "Part A: Scanning Four Short Texts in 15 Minutes",
    "How to locate details across four related texts quickly in OET Reading Part A.", 6,
    `# Part A: Scanning Four Short Texts in 15 Minutes

OET Reading Part A gives you four short texts on one healthcare topic and about 15 minutes to answer questions. Speed matters, so use **expeditious reading**: skimming and scanning.

## Know the text types
- Policy or protocol extracts
- Clinical guideline summaries
- Patient information leaflets
- Case notes or charts

Spend one minute getting a map of the texts: what is each one about?

## Question types
1. **Matching:** which text contains this information?
2. **Sentence completion:** a short phrase from a text.
3. **Short answer:** a number, name or short phrase.

## Method
1. Read the question and underline the key term.
2. Think of **synonyms**: "dose" may appear as "amount" or "quantity".
3. Scan the likely text, using headings and bold terms as clues.
4. Copy the exact words if the question requires an answer from the text.

## Check meaning
The key word may appear in several texts, but only one contains the *specific detail*. For example, two texts may mention "wound dressing", but only one says how often it should be changed.

## Grammar of sentence completion
The completed sentence must be grammatically correct, so check whether you need a plural, a gerund or a noun phrase.

## Staying in time
- Do not read every word.
- Skip and return if a question takes more than a minute.
- Leave two minutes at the end to check spelling.

**Common traps:** answering from your clinical knowledge instead of the text; selecting a text because the topic matches, not the detail; spelling mistakes in copied terms; and exceeding the word limit.`),
  mat("oet-nursing", "Writing", "Discharge letter", "notes", "Discharge Letters: Selecting and Ordering Case Notes",
    "How to decide what to include in a nursing discharge letter and how to organise it.", 7,
    `# Discharge Letters: Selecting and Ordering Case Notes

The OET Writing task gives you case notes and asks for a letter to another health professional. The notes contain **more information than you need**. Your job is to select what the reader needs in order to continue care.

## Step 1: Read the task
Identify the **writer**, the **recipient**, and the **purpose**. A discharge letter to a GP or community nurse should explain the patient's condition and what the reader should do next.

## Step 2: Highlight relevant information
Include:
- Diagnosis and relevant history
- Key treatment and response
- Current status and ongoing needs
- Medication changes
- Specific requests for the reader

Leave out routine details that do not affect continuing care (for example, normal results or unrelated social information).

## Step 3: Plan paragraphs
1. **Opening:** who the patient is and why you are writing.
2. **Hospital course:** diagnosis, treatment, response.
3. **Current needs:** medication, wound care, mobility, education.
4. **Requests:** what you want the recipient to do.
5. **Closing:** a courteous line.

## Step 4: Write in full sentences
Convert note form into sentences:
- *Note:* "Pt c/o SOB, 3 days" becomes *Sentence:* "She presented with a three-day history of shortness of breath."

## Language tips
- Use **past simple** for completed events and **present perfect** for ongoing situations.
- Use **linkers**: "However", "As a result", "In addition".
- Use polite requests: "I would be grateful if you could...".

## Layout
Include the recipient's name and address, a date, "Dear...", a Re: line with the patient's name and date of birth, and an appropriate closing such as "Yours sincerely".

**Common traps:** copying notes word for word; including irrelevant details; exceeding the word limit; and writing paragraphs in time order when they should be organised by theme.`),
  mat("oet-nursing", "Speaking", "Role-play", "notes", "Empathy and Plain Language for Role-plays",
    "Phrases and habits that show empathy and make clinical information easy to understand.", 5,
    `# Empathy and Plain Language for Role-plays

In the OET Speaking role-play you play yourself as a nurse and the interlocutor plays the patient or carer. Assessors listen for **clinical communication skills** as well as language.

## Open with rapport
- "Good morning, Mr Park. I'm Sara, one of the nurses. How are you feeling today?"
- Confirm the purpose: "I'd like to talk about your recovery at home."

## Explore the patient's perspective
Ask open questions before giving information:
- "What worries you most about going home?"
- "Can you tell me more about that?"
- "What have you been told so far?"

## Show empathy
- "I can see that this is worrying for you."
- "That sounds really uncomfortable."
- "It's understandable to feel that way."

Avoid dismissing phrases such as "Don't worry" or "It's nothing".

## Use plain language
| Clinical term | Plain alternative |
|---|---|
| hypertension | high blood pressure |
| analgesia | pain relief |
| ambulate | walk around |
| incision | cut / wound |
| oedema | swelling |

## Give information in chunks
1. Give one or two points.
2. Check understanding: "Does that make sense?"
3. Invite questions.

## Signpost
- "First, I'd like to ask about..."
- "Now, let me explain what will happen next."
- "To summarise..."

## Close effectively
Summarise the plan, check the patient's understanding, and offer further support: "If anything changes, please ring the bell or call the ward."

**Common traps:** using jargon without explanation; interrupting; giving too much information at once; and ending the conversation without checking that the patient has understood.`),
  mat("oet-nursing", "Writing", "Referral letter", "guide", "Nursing Letter Revision Checklist",
    "A systematic checklist for revising any OET nursing letter before time is up.", 6,
    `# Nursing Letter Revision Checklist

You have 45 minutes for the OET Writing task: 5 minutes to read, 35 to write and 5 to check. Use this checklist in the final five minutes.

## 1. Purpose and recipient
- Does the first paragraph say why you are writing?
- Does the tone suit the reader (nurse, GP, physiotherapist)?
- Is the salutation correct ("Dear Ms Carter") and the closing matched ("Yours sincerely")?

## 2. Content
- Are all key details present: diagnosis, treatment, dates, current needs?
- Have you omitted irrelevant information?
- Are numbers, dates and doses accurate and copied correctly?

## 3. Organisation
- Is the information grouped into logical paragraphs?
- Does each paragraph have a clear focus?
- Is the request or action clear?

## 4. Language
- **Full sentences** only; no note form or abbreviations such as "pt" or "c/o".
- **Tenses:** past simple for completed events, present perfect for ongoing situations, present or future for current plans.
- **Articles and plurals:** the most common slips are missing "the" and "-s".
- **Connectors:** variety such as "although", "therefore", "in addition".

## 5. Style
- Professional and concise: avoid emotional language.
- No repetition of the same fact.
- Avoid contractions.

## 6. Word count
The body should be about 180-200 words. Do not count the address, date, greeting or sign-off. Cut details that do not help the reader.

## Practice routine
Write one letter every few days under timed conditions. After each letter, tick each checklist item and note the two most frequent errors. Focus on those errors in your next attempt.

**Common traps:** spending too long on the first paragraph; adding extra information to reach the word count; forgetting the Re: line; and leaving no time to read your letter through.`),
];

const MATERIALS_PART_2: SeedMaterial[] = [
  /* ---------- OET Medicine ---------- */
  mat("oet-medicine", "Listening", "Presentations", "notes", "Part C Presentations: Following the Argument",
    "How to track the speaker's main points, examples and attitude in longer OET Listening extracts.", 6,
    `# Part C Presentations: Following the Argument

OET Listening Part C contains longer extracts, such as a presentation, a discussion between colleagues or an interview. The multiple-choice questions test **gist, detail, speaker opinion and purpose**.

## Reading the question
Questions usually have a stem and three options. Before the extract starts:
- Underline the **focus**: Is it asking about a reason, an attitude, a purpose or a detail?
- Notice words such as *main*, *mainly*, *why*, *implies*.

## Typical question focuses
1. **Gist:** what is the overall message?
2. **Detail:** what did the speaker say about a specific point?
3. **Attitude/opinion:** how does the speaker feel about it?
4. **Purpose:** why did the speaker mention something?
5. **Implication:** what does the speaker suggest?

## Listening for structure
Presenters organise their talk with signposts:
- "I'd like to make three points..."
- "Having said that..." (a contrast is coming)
- "What this means in practice is..." (the key point)
- "To sum up..." (the conclusion)

## Recognising attitude
Look for evaluative words and hedging:
- Positive: *encouraging, valuable, welcome*
- Negative: *concerning, disappointing, unhelpful*
- Hedging: *to some extent, arguably, I'm not entirely convinced*

## Distractors
Wrong options often use words that you hear but in a different meaning, or describe a detail that was mentioned by the speaker but not as the main point. Choose the option that reflects the **speaker's actual message**.

## Practice routine
1. Listen to short clinical talks or podcasts.
2. After each segment, pause and summarise the main point in one sentence.
3. Note the signposts and attitude words used.

**Common traps:** choosing an option because it contains words from the recording; ignoring a later correction; confusing the speaker's description with their opinion; and over-thinking a question and losing the next one.`),
  mat("oet-medicine", "Reading", "Careful reading", "notes", "Careful Reading: Attitude and Inference in Clinical Texts",
    "Strategies for Part C questions that test opinion, implication and vocabulary in context.", 7,
    `# Careful Reading: Attitude and Inference in Clinical Texts

Part C of OET Reading consists of two long texts, each with eight multiple-choice questions. They require **close reading** and understanding of the writer's opinion, not just facts.

## Question types
- **Detail:** what does the text say about X?
- **Main idea/purpose:** why does the writer mention Y?
- **Attitude:** what is the writer's view of Z?
- **Reference:** what does 'this' or 'it' refer to?
- **Vocabulary:** what does the word 'robust' mean here?
- **Inference:** what does the writer imply about...?

## Reading strategy
1. Skim the text for the overall argument (two minutes).
2. Read each question and locate the relevant paragraph.
3. Read that paragraph carefully and predict the answer before looking at the options.
4. Eliminate options that are too strong, partially true or unsupported.

## Spotting attitude
Writers signal opinion through:
- **Adjectives and adverbs:** *worryingly, remarkable, modest*
- **Hedging:** *may, might, appears to, suggests*
- **Concession:** *Although it is widely believed..., the evidence indicates...*
- **Contrast:** *however, nevertheless*

## Reference words
Find the noun phrase that 'this' replaces by looking at the sentence before. The answer is usually the main idea of that sentence, not just the last noun.

## Vocabulary in context
Replace the word with each option and check whether the sentence still makes sense. Use the surrounding sentences for clues. For example, "attenuate" in a sentence about reducing inflammation means "lessen".

## Eliminating wrong options
- **Too extreme:** words such as *always, never, completely*
- **Out of scope:** true in general but not in the text
- **Reversal:** opposite to what the text says

## Practice
Work on one text daily for 20 minutes. After answering, underline the words in the text that prove each answer.

**Common traps:** picking an option that matches your clinical knowledge but not the text; confusing facts with the writer's opinion; and spending too long on a single question.`),
  mat("oet-medicine", "Writing", "Referral letter", "notes", "Referral Letters for Doctors: Selecting Content",
    "What a specialist needs to read in a referral, and how to build the letter efficiently.", 7,
    `# Referral Letters for Doctors: Selecting Content

In OET Medicine Writing you usually write a letter such as a referral to a specialist or a letter to a GP. The aim is **clear communication** between professionals.

## What does the reader need?
A consultant who receives the letter needs to know:
1. **Who** the patient is (age, gender, relevant background).
2. **Why** you are referring (the problem and your question).
3. **What** you have found and done (history, examination, investigations, treatment).
4. **What** you would like the specialist to do.

## Structure
- **Paragraph 1:** the patient and purpose.
- **Paragraph 2:** presenting problem and history.
- **Paragraph 3:** examination, results and management so far.
- **Paragraph 4:** specific request and relevant social context.
- **Closing:** thanks and sign-off.

## Selecting information
Include information that **affects the specialist's decision**:
- Symptom timeline and severity
- Relevant risk factors (family history, smoking, medication)
- Results of tests already done
- Treatment tried and response

Omit information that does not help, such as unrelated past illnesses or details of routine normal findings.

## Language
- **Opening:** "Thank you for seeing...", "I would be grateful for your assessment of..."
- **History:** "He has experienced...", "She was diagnosed with... in 2018."
- **Management:** "I commenced her on...", "He has been taking... since March."
- **Request:** "I would appreciate your advice on...", "Could you please consider...?"

## Register
Professional, concise and objective. Avoid emotional comments and abbreviations, and write medical terms in full on first mention.

## Checking
Compare your letter with the notes. Do the dates match? Is each drug dose correct? Have you included a clear request?

**Common traps:** a list of facts with no purpose; including every test result; vague requests such as "please see"; and confusing tenses when describing the history.`),
  mat("oet-medicine", "Speaking", "Role-play", "notes", "Explaining Diagnoses and Breaking Difficult News",
    "A step-by-step approach for sensitive consultations in the OET Speaking role-play.", 6,
    `# Explaining Diagnoses and Breaking Difficult News

Many OET Medicine role-plays involve explaining a diagnosis, discussing a test, or giving unwelcome news. Assessors judge how well you build **relationship** and **structure** as well as how accurately you inform.

## A simple structure
1. **Prepare the ground:** greet, set the purpose, check privacy.
2. **Find out what the patient knows:** "What have you been told so far?"
3. **Ask permission:** "Would it be all right if I explained the results?"
4. **Give a warning shot:** "I'm afraid the results are not what we had hoped."
5. **Explain in small pieces:** use plain language and pause.
6. **Respond to emotion:** acknowledge feelings before giving more information.
7. **Make a plan:** explain next steps and options.
8. **Summarise and close:** check understanding and give contact details.

## Language for empathy
- "I can see that this is a shock."
- "Take your time."
- "Many people feel the same way."

## Replacing jargon
| Medical term | Patient-friendly |
|---|---|
| benign | not cancerous |
| metastasis | spread to other parts of the body |
| remission | the illness is under control |
| biopsy | taking a small sample for testing |

## Handling difficult questions
If a patient asks "How long have I got?" you can say: "That's a very important question, and it's hard to be exact. Many things influence it. Can I tell you what we know so far?"

## Avoiding common errors
- Do not rush.
- Do not give false reassurance.
- Do not overwhelm the patient with detail.
- Do not forget to explore their concerns.

## Closing
Summarise the plan, ask whether they have any questions, and offer a follow-up appointment or contact number.

**Common traps:** starting with technical terms; reassuring too soon; talking without checking understanding; and finishing abruptly after delivering the news.`),
  mat("oet-medicine", "Listening", "Consultation extracts", "guide", "OET Listening Parts A, B and C: Strategy Overview",
    "What each part of OET Listening tests and how to prepare for all three efficiently.", 8,
    `# OET Listening Parts A, B and C: Strategy Overview

The OET Listening sub-test lasts about 40 minutes and has three parts. Each part tests a different listening skill.

## Part A: Consultation extracts
You hear two doctor-patient consultations and complete notes under headings.
- **Skill:** listening for specific information.
- **Tips:** read the headings first, predict answer types, write key words quickly.
- **Spelling:** medical terms are checked, so practise them.

## Part B: Short workplace extracts
Six short recordings, such as handovers or discussions between colleagues. You answer one multiple-choice question for each.
- **Skill:** understanding the gist, purpose or speaker's opinion.
- **Tips:** read the question and options in advance, and listen for the main point rather than isolated words.

## Part C: Presentations or interviews
Two longer recordings, each followed by six multiple-choice questions.
- **Skill:** following an argument, attitude and detail.
- **Tips:** use signposts, listen for the speaker's evaluation, and avoid options that merely repeat words.

## Study plan (four weeks)
**Week 1:** Part A. Practise short consultations and note-taking.
**Week 2:** Part B. Listen to workplace dialogues, summarising the purpose.
**Week 3:** Part C. Listen to clinical talks and identify attitude.
**Week 4:** Full practice tests under timed conditions.

## Useful habits
1. Listen to a range of English accents each day.
2. Keep a vocabulary notebook for medical terms and phrases.
3. After each test, review mistakes and note why the wrong answer was tempting.
4. Practise writing numbers, dates and drug names accurately.

## Exam-day tips
- Use the pause to read ahead.
- Do not leave blanks; make an informed guess.
- Keep calm if you miss an answer.

**Common traps:** reading too slowly during preparation time; choosing an answer because you heard the word; and ignoring the grammar of gaps in Part A.`),

  /* ---------- PTE Academic ---------- */
  mat("pte-academic", "Speaking and Writing", "Summarize written text", "notes", "Summarize Written Text: One Perfect Sentence",
    "How to condense a passage into a single, grammatical sentence that captures the main idea.", 6,
    `# Summarize Written Text: One Perfect Sentence

In this task you read a passage of up to about 300 words and write **one sentence** of 5 to 75 words in about ten minutes. It is scored on content, form, grammar and vocabulary.

## Understand the scoring
- **Content:** do you capture the main idea and key supports?
- **Form:** one sentence only, within the word limit.
- **Grammar:** correct structures.
- **Vocabulary:** accurate and varied.

A response that is not one sentence, or is outside the word range, may lose form points.

## Step-by-step method
1. **Read once** and find the topic sentence (usually first or last).
2. **Underline** the main idea and two key supports.
3. **Choose a main verb** for the central clause.
4. **Join ideas** with linkers: because, although, while, which, so that.
5. **Check** the sentence for grammar and a final full stop.

## Templates
- "Although [concession], [main idea] because [reason], and [second reason]."
- "[Subject] [main verb] [object], which [result], while [contrast]."

## Example
Passage idea: cities designed around cars suffer congestion, so many now promote cycling and transport, which cut traffic without harming shops.
Summary: *Although cities were once designed for cars, many now favour cycling and public transport because these measures reduce congestion and pollution without harming local shops.*

## Using punctuation
Use commas and semicolons, not full stops, to separate ideas. A semicolon can link two closely related clauses within one sentence.

## Paraphrase
Change key words where possible (for example, *reduce* becomes *cut*) but keep technical terms.

## Time plan
- 2 minutes: read
- 1 minute: plan
- 5 minutes: write
- 2 minutes: check

**Common traps:** writing two sentences; copying large chunks of the passage; adding your opinion; and forgetting the verb in a very long sentence.`),
  mat("pte-academic", "Speaking and Writing", "Essay", "notes", "Essay: A Four-Paragraph Template for 20 Minutes",
    "A clear structure and timing plan for the 200-300 word PTE essay.", 7,
    `# Essay: A Four-Paragraph Template for 20 Minutes

The PTE essay asks for 200 to 300 words in 20 minutes. It is scored on content, form, development and structure, grammar, vocabulary and spelling. A fixed structure saves time and avoids mistakes.

## The structure
**Paragraph 1: Introduction (about 40 words)**
- Paraphrase the topic.
- State your position.

**Paragraph 2: First main idea (about 80 words)**
- Topic sentence, explanation, example.

**Paragraph 3: Second main idea or opposing view (about 80 words)**
- Topic sentence, explanation, example.

**Paragraph 4: Conclusion (about 30 words)**
- Restate your position in new words.

## Timing
- 3 minutes: plan (position and two ideas)
- 14 minutes: write
- 3 minutes: check spelling and grammar

## Useful language
- **Introducing:** "It is often argued that...", "There is a growing debate about..."
- **Adding:** "Moreover", "In addition"
- **Contrasting:** "However", "On the other hand"
- **Giving examples:** "For instance", "A case in point is..."
- **Concluding:** "In conclusion", "Taking everything into account"

## Raising grammar and vocabulary scores
- Use a mix of simple, compound and complex sentences.
- Use passive voice where appropriate ("It is widely believed that...").
- Use relative clauses ("technology, which has transformed work, ...").
- Choose precise words: *significant* instead of *very big*.

## Word count
Aim for 230 to 270 words. Fewer than 200 or more than 300 words can reduce the score.

## Spelling
Choose one spelling system (British or American) and use it throughout. Check common words: *environment, government, necessary, separate*.

## Practice
Write two essays a week on different topics. After each, check the structure and count the words. Keep a list of the errors you repeat.

**Common traps:** writing without a plan; irrelevant examples; an unclear position; and a conclusion that introduces a new idea.`),
  mat("pte-academic", "Reading", "Reorder paragraphs", "notes", "Reorder Paragraphs: Finding the Linking Clues",
    "The reference, time and logic clues that reveal the order of four or five text boxes.", 6,
    `# Reorder Paragraphs: Finding the Linking Clues

In Reorder Paragraphs you arrange several text boxes into a coherent passage. Points are generally awarded for each **correct adjacent pair**, so understanding links matters more than finding a perfect sequence immediately.

## Step 1: Find the opening sentence
The first box usually:
- Introduces a topic in general terms.
- Does not contain a pronoun that refers back (*it, they, this, these*).
- Does not start with a linker such as *However* or *Therefore*.

## Step 2: Look for linking clues
**Reference words**
- *This policy*, *these findings*, *such measures* refer to something mentioned earlier.

**Time order**
- *Before 1840*, *In the 1990s*, *Within a decade*.

**Logical connectors**
- Contrast: *however, although, whereas*
- Cause/effect: *therefore, as a result, consequently*
- Addition: *moreover, in addition, similarly*
- Example: *for instance, for example*

**Definite and indefinite articles**
- "A study" introduces something new; "The study" refers back.

## Step 3: Build pairs
Match each box with the box that explains its pronoun, continues its time sequence or answers its question. Write the pairs, then join them into a chain.

## Step 4: Check the flow
Read the final order quickly. Each sentence should lead naturally to the next, and the last sentence should conclude or give a result.

## Example logic
1. A general statement about a problem.
2. A consequence ("As a result...").
3. A response ("In response...").
4. An evaluation ("Such measures...").

## Time management
Spend about two minutes per question. If you are unsure, build the strongest pairs first.

**Common traps:** choosing the box with the most interesting content as the opening; ignoring pronouns; assuming chronological order when the text is logical; and overlooking *however* at the start of a box.`),
  mat("pte-academic", "Listening", "Highlight incorrect words", "notes", "Highlight Incorrect Words: Tracking the Audio",
    "How to follow the transcript while listening and decide which words to click.", 5,
    `# Highlight Incorrect Words: Tracking the Audio

In this task you listen to a recording and read a transcript that contains deliberate differences. You click the words that differ from what you hear. Incorrect clicks can reduce your score, so **accuracy matters**.

## What changes?
The altered words are usually:
- **Content words**: nouns, verbs and adjectives.
- Sometimes a **synonym** or a **similar-sounding** word.
- Rarely small function words such as *the* or *of*.

## Technique
1. **Read ahead.** Before the recording starts, read the whole transcript and predict where words may be changed.
2. **Follow with the cursor.** Move the cursor along the text at the speed of the speaker.
3. **Listen for each word.** If you hear a different word from the text, click as soon as you notice it.
4. **Do not click if you are unsure.** A wrong click may cost marks.
5. **Keep up.** If you fall behind, jump to the current word.

## Common differences
| Spoken | Written |
|---|---|
| expand | contract |
| reduce | increase |
| essential | optional |
| valuable | expensive |
| found | discovered |

## Predicting from meaning
Because the passage should make sense, a word that contradicts the context may be altered. For example, "Prices rose, so demand increased" may have been "Prices rose, so demand fell". Use logic as a back-up to listening.

## Improving your skill
- Practise with news and lecture recordings with transcripts.
- Read the transcript while listening and mark differences.
- Practise shadowing: repeat the speaker's words a fraction behind them.

## Accent and speed
Listen to different accents and speeds to avoid surprises. If a word is unclear, rely on context and wait for the next word.

**Common traps:** clicking too early before you have heard the word; clicking correct words because of a similar sound; losing your place in long sentences; and neglecting to read the text beforehand.`),
  mat("pte-academic", "Reading", "Fill in the blanks", "guide", "Fill in the Blanks: Collocations and Word Forms",
    "A method for choosing the right word in reading drop-down tasks, using grammar and collocation.", 8,
    `# Fill in the Blanks: Collocations and Word Forms

In Reading: Fill in the Blanks (drop-down) you choose the correct word for each gap in a short academic text. Each gap is marked independently, so every correct answer counts.

## Four checks for every gap
1. **Part of speech:** Does the gap need a noun, verb, adjective or adverb?
2. **Grammar:** Does the word fit the tense, number and structure (for example, *to* + base verb)?
3. **Collocation:** Does it combine naturally with neighbouring words?
4. **Meaning:** Does it make sense in the context of the whole paragraph?

## Part of speech examples
- "a ___ threat" needs an adjective: *serious*.
- "to ___ the coastline" needs a base verb: *protect*.
- "The recovery is ___" after *is* might need an adjective: *fragile*.

## Common academic collocations
| Verb + noun | Adjective + noun |
|---|---|
| abolish a tax | significant increase |
| address an issue | growing concern |
| conduct research | widespread belief |
| raise awareness | limited resources |
| impose a ban | serious threat |

## Word families
Learn related forms, such as *decide, decision, decisive*; *economy, economic, economical, economist*; *reduce, reduction*.

## Using the whole text
Read the sentence before and after each gap. Context often shows whether the word should be positive or negative or whether the sentence contrasts with the previous one.

## Strategy
1. Read the whole text quickly.
2. Fill in the gaps you are sure about.
3. Return to difficult ones and eliminate impossible options.
4. Re-read the finished text for sense.

## Vocabulary building
Keep a notebook of collocations, not single words. Write the whole phrase and an example sentence. Review it regularly, and test yourself by covering one word.

**Common traps:** choosing a word that matches the meaning but not the grammar; ignoring collocation; selecting an answer that fits a gap in isolation but not in the paragraph; and neglecting word forms.`),

  /* ---------- TOEFL iBT ---------- */
  mat("toefl-ibt", "Reading", "Academic passages", "notes", "Reading Question Types and Paraphrase Matching",
    "Recognising the main TOEFL reading question types and how to use paraphrase to find answers.", 7,
    `# Reading Question Types and Paraphrase Matching

TOEFL Reading uses academic passages of the kind you would meet in a first-year university course. Questions test **vocabulary, detail, inference and organisation**.

## Common question types
1. **Factual information:** what does the passage say about X?
2. **Negative factual information:** which of the following is NOT stated?
3. **Inference:** what can be concluded?
4. **Rhetorical purpose:** why does the author mention Y?
5. **Vocabulary:** what does the word mean in context?
6. **Reference:** what does 'it' or 'this' refer to?
7. **Sentence simplification:** which sentence best expresses the essential information?
8. **Insert text:** where would the sentence best fit?
9. **Prose summary and tables:** select the main ideas or categorise information.

## Using paraphrase
Answer choices rarely copy the passage. They restate it with synonyms or different structure.
- Passage: "Drainage reverses the process."
- Correct option: "Draining peat has the opposite effect."

Wrong options may copy exact words but change the meaning.

## Method
1. **Preview** the passage: read the first sentence of each paragraph.
2. **Read the question** and find the relevant paragraph (most questions follow passage order).
3. **Predict** the answer in your own words.
4. **Eliminate** options that are not stated, are too extreme or contradict the text.

## Vocabulary in context
Read the sentence and the one around it. Substitute each option. Choose the one that fits the **context**, not the most common meaning.

## Rhetorical purpose
Ask: what is the author doing here? Giving an example, contrasting, defining, or explaining a cause? The correct option describes the **function**, not just the content.

## Inference
The answer is **strongly implied**, not directly stated. Avoid options that require outside knowledge.

## Timing
Spend about one minute per question and avoid re-reading the passage fully each time.

**Common traps:** choosing an option because it repeats words from the passage; using outside knowledge; misreading NOT questions; and ignoring the paragraph referred to in the question.`),
  mat("toefl-ibt", "Listening", "Lectures", "notes", "Lecture Note-taking: Structure and Function Questions",
    "How to take useful notes in lectures and answer questions about purpose and organisation.", 6,
    `# Lecture Note-taking: Structure and Function Questions

TOEFL Listening lectures last three to five minutes and are about academic topics. You can take notes during the recording. The questions go beyond facts and ask **why** the speaker said something.

## What to note
- **Topic and main idea** in the first 30 seconds.
- **Key terms** and definitions.
- **Examples and numbers** that support points.
- **Contrasts and changes** signalled by *however, but, on the other hand*.
- **Sequence** of steps or events.

## How to organise notes
Use a simple outline:
- Main idea
  - Point 1 (example)
  - Point 2 (example)
  - Contrast or problem
  - Conclusion

Use abbreviations and symbols: *=, >, <, w/, ->*, but keep them consistent.

## Question types
1. **Gist-content/purpose:** what is the main topic?
2. **Detail:** what did the speaker say about...?
3. **Function:** why does the professor say this?
4. **Attitude:** how does the professor feel?
5. **Organisation:** how does the professor organise the information?
6. **Connecting content:** classify or sequence items.

## Function questions
You may hear a short replayed portion. Decide what the speaker is doing: giving an example, making an analogy, correcting an idea, introducing a new topic, or checking understanding. The wording of the answer describes the function (for example, "To illustrate a concept with an analogy").

## Recognising attitude
Listen to **tone** and words: "Surprisingly...", "Of course, this isn't perfect...", "I'm not convinced".

## Signposts
- "There are two main reasons..." tells you to expect two points.
- "Now, here's the interesting part..." signals an important idea.
- "So, to recap..." signals the conclusion.

## Practice
Listen to short university lectures, take notes, and summarise the lecture in three sentences. Check the main idea and examples against a transcript.

**Common traps:** trying to write everything; ignoring tone; missing a contrast; and choosing a detail from the lecture that does not answer the function question.`),
  mat("toefl-ibt", "Speaking", "Integrated", "notes", "Integrated Speaking: Reporting Reading and Lecture",
    "A reporting template and note-taking approach for integrated speaking responses.", 6,
    `# Integrated Speaking: Reporting Reading and Lecture

Integrated speaking tasks combine **reading, listening and speaking**. You are asked to report information accurately and relate sources, not to give your own opinion.

## Task types
- **Opinion report:** a short announcement and a conversation. State the speaker's opinion and reasons.
- **Reading-lecture:** an academic concept and a lecture with examples. Explain the concept using the examples.
- **Lecture summary:** summarise a lecture's main points.

## Note-taking
- For the reading: write the **topic** and two or three key points in a few words.
- For the listening: note the speaker's **opinion** and **reasons**, or the **examples** given.

## Response template (about 60 seconds)
1. **Introduction (5-10 seconds):** "The reading describes... and the lecturer explains how..."
2. **Point 1 (20 seconds):** "First, the professor mentions... For example..."
3. **Point 2 (20 seconds):** "Second, ..."
4. **Short conclusion (5 seconds, if time allows).**

## Reporting language
- "The woman disagrees with the plan because..."
- "According to the professor,..."
- "The lecturer gives the example of..."
- "This illustrates the idea that..."

## Paraphrasing
Do not read the passage aloud. Change the vocabulary and structure:
- Reading: "The university will close the print lab."
- Response: "The campus plans to shut down its printing facility."

## Delivery
- Speak at a steady pace.
- Pause between ideas.
- Stress key words.
- Aim for natural intonation rather than reading from notes.

## Timing practice
Practise with a timer. If you finish early, add detail from your notes. If you are running out of time, finish your sentence gracefully.

**Common traps:** giving your own opinion; copying phrases from the reading; skipping the second reason; and speaking too quickly because of the time limit.`),
  mat("toefl-ibt", "Writing", "Academic discussion", "notes", "Academic Discussion: Structure and Language",
    "How to write a short, focused online discussion post that contributes something new.", 6,
    `# Academic Discussion: Structure and Language

In the Academic Discussion task you read a professor's question and two student posts, and then write your own contribution. A strong post is **clear, relevant and adds something new**. It is typically around 100 words or more, written in about ten minutes.

## Structure
1. **Opinion (1-2 sentences):** state your position clearly.
2. **Reason 1 with example (2-3 sentences).**
3. **Link to a classmate:** agree, disagree or extend a point.
4. **Optional second reason or concluding sentence.**

## Responding to classmates
- Agree and extend: "I agree with Maria that..., but I would add that..."
- Partially disagree: "Ken raises a fair concern; however,..."
- Contrast: "Unlike Ken, I believe..."

Name at least one classmate and engage with their idea.

## Useful phrases
- **Opinion:** "In my view,..." / "I strongly believe that..."
- **Reason:** "The main reason is that..."
- **Example:** "For instance, when I...", "Consider the case of..."
- **Consequence:** "As a result,..."

## Developing ideas
Instead of listing several short reasons, develop one or two with specific examples. A real or realistic example makes your point convincing.

## Language quality
- Use a range of sentence structures.
- Choose precise vocabulary.
- Avoid text-message abbreviations and overly casual expressions.
- Check subject-verb agreement and tense.

## Time plan
- 1 minute: read and decide your opinion
- 7 minutes: write
- 2 minutes: proofread

## Example opening
"I agree with Maria that every student should study basic statistics, but I would like to add a further reason."

**Common traps:** repeating a classmate's idea; writing a position without an example; ignoring the professor's question; and leaving no time to proofread.`),
  mat("toefl-ibt", "Writing", "Integrated", "guide", "Integrated Writing Guide: Matching Lecture to Reading",
    "A complete method for planning and writing the integrated essay with no personal opinion.", 8,
    `# Integrated Writing Guide: Matching Lecture to Reading

In Integrated Writing you read a short passage, listen to a lecture, and write a summary of the lecture's points, explaining how they relate to the reading. You must **not** include your own opinion.

## The typical relationship
The reading presents an idea with three supporting points. The lecture challenges each point. Your task is to match each lecture point with the reading point it responds to.

## Step 1: Take notes on the reading
Write the main claim and three supports in short phrases.

| Reading point | Notes |
|---|---|
| 1 | water saved by recycling |
| 2 | city location shortens transport |
| 3 | no pesticides |

## Step 2: Take notes on the lecture
Write the response to each point, listening for signposts such as "However" and "That sounds convincing, but...".

| Lecture response | Notes |
|---|---|
| 1 | lights use electricity, electricity uses water |
| 2 | city land costly; only herbs profitable |
| 3 | mould and insects still treated |

## Step 3: Plan the essay
- **Introduction:** state that the lecturer challenges the reading's claims.
- **Body 1-3:** one paragraph per point: reading claim, lecture response.
- **No conclusion needed.** A brief one is optional.

## Step 4: Write
Use paraphrase and linking language:
- "The reading claims that..., but the lecturer argues that..."
- "In contrast to the passage, the professor explains..."
- "Whereas the author states..., the speaker points out..."

## Step 5: Check
Make sure that:
- Every lecture point is included.
- Each is linked to a reading claim.
- There is no personal opinion.
- Language is paraphrased, not copied.

## Length and timing
A good response is typically 150 to 225 words, written in about 20 minutes. The passage remains on screen, so use it for accurate details, but do not copy its sentences.

## Language practice
Practise reporting verbs: *state, argue, claim, explain, point out, suggest, contend*.

**Common traps:** presenting the reading only; including your opinion; mixing up which source said what; and copying sentences from the passage.`),
];

/* ================================================================== */
/* FLASHCARDS                                                         */
/* ================================================================== */
const FLASHCARDS_PART_1: SeedFlashcard[] = [
  /* ---------- IELTS Academic ---------- */
  ...fcs("ielts-academic", "Listening", "Conversations", [
    ["Which words often signal a speaker is correcting an earlier detail?", "Actually, sorry, I mean, no wait, let me check. The corrected detail is usually the answer."],
    ["What does 'NO MORE THAN TWO WORDS' mean in a Listening task?", "One or two words only (plus a number if allowed). Three words is marked wrong even if the meaning is right."],
    ["Why should you read the questions before the recording starts?", "To underline key words and predict the answer type, so you recognise answers as they are spoken."],
  ]),
  ...fcs("ielts-academic", "Listening", "Lectures", [
    ["What does 'in a nutshell' signal in a lecture?", "A brief summary of the main point is coming."],
    ["What does 'turning now to...' signal?", "The lecturer is moving to the next topic."],
    ["Which connectors warn of a contrast in a lecture?", "However, on the other hand, whereas, in contrast, nevertheless."],
  ]),
  ...fcs("ielts-academic", "Reading", "Academic passages", [
    ["Skimming vs scanning?", "Skimming: reading quickly for the general idea. Scanning: searching for a specific word, number or name."],
    ["What is a topic sentence?", "The sentence, usually first in a paragraph, that states the paragraph's main idea."],
    ["Meaning of 'ubiquitous'?", "Found everywhere; very common. Example: Smartphones are ubiquitous in modern cities."],
    ["Common paraphrase of 'a significant increase'?", "A marked rise, a substantial growth, a considerable upturn."],
  ]),
  ...fcs("ielts-academic", "Reading", "True/False/Not Given", [
    ["Which absolute words often make a statement False?", "All, always, never, only, none, completely. Check whether the passage allows exceptions."],
    ["Yes/No/Not Given vs True/False/Not Given?", "Yes/No/Not Given tests the writer's opinions or claims. True/False/Not Given tests facts."],
  ]),
  ...fcs("ielts-academic", "Writing", "Task 1 (data description)", [
    ["Three verbs for a sharp rise?", "Soared, surged, shot up, climbed dramatically."],
    ["Which preposition: 'rose ___ 20% to 35%'?", "From. 'Rose from 20% to 35%' gives the start and end; 'rose by 15%' gives the amount of change."],
    ["Ways to say a trend stayed the same?", "Remained stable, levelled off, stayed constant, plateaued."],
  ]),
  ...fcs("ielts-academic", "Writing", "Task 2 (essay)", [
    ["Structure of a 'discuss both views' essay?", "Introduction with your opinion, one paragraph per view, then a conclusion restating your opinion."],
    ["A phrase that introduces a concession?", "Although some argue that..., I believe...; Admittedly,...; While it is true that..."],
  ]),
  ...fcs("ielts-academic", "Speaking", "Part 1 interview", [
    ["How do you extend a Part 1 answer?", "Answer directly, then add a reason and a short example: 'Yes, because..., for instance...'."],
  ]),
  ...fcs("ielts-academic", "Speaking", "Part 2 cue card", [
    ["What if you finish the cue card topic early?", "Return to the prompts and add feelings, a comparison, a further detail or a conclusion."],
  ]),
  ...fcs("ielts-academic", "Speaking", "Part 3 discussion", [
    ["A phrase for speculating about the future?", "It might well be that...; I suppose it could lead to...; It is likely that..."],
    ["A phrase to buy thinking time naturally?", "That's an interesting question. Let me think about that for a moment."],
  ]),

  /* ---------- IELTS General Training ---------- */
  ...fcs("ielts-general", "Listening", "Social contexts", [
    ["How are phone numbers like 'double five' written?", "55. 'Double' means the digit repeats."],
    ["How can you avoid confusing 'fifteen' and 'fifty'?", "Listen for stress: fifTEEN (stress on the end) vs FIFty (stress on the start)."],
    ["Useful map words for directions?", "Opposite, next to, behind, between, on the corner, at the end of, past, roundabout."],
  ]),
  ...fcs("ielts-general", "Listening", "Training contexts", [
    ["What is an 'induction' at a workplace?", "An introduction for new staff covering rules, safety and procedures."],
    ["What does 'mandatory' mean?", "Required by rules; compulsory."],
  ]),
  ...fcs("ielts-general", "Reading", "Everyday texts", [
    ["What is the 'small print' in an advert?", "Conditions and exceptions printed in small type; questions often hinge on them."],
    ["What does 'complimentary' mean on a notice?", "Free of charge."],
    ["What does 'valid until 30 June' mean?", "It can be used up to and including 30 June but not after."],
  ]),
  ...fcs("ielts-general", "Reading", "Workplace texts", [
    ["Essential vs desirable in a job advert?", "Essential: you must have it. Desirable: an advantage but not required."],
    ["What does 'probationary period' mean?", "An initial trial period of employment before the job becomes permanent."],
  ]),
  ...fcs("ielts-general", "Writing", "Task 1 (letter)", [
    ["Which closing goes with 'Dear Sir or Madam'?", "Yours faithfully."],
    ["Which closing goes with 'Dear Mr Hughes'?", "Yours sincerely."],
    ["Polite formal request pattern?", "I would be grateful if you could...; Would you mind...?"],
    ["Opening line for a complaint letter?", "I am writing to complain about..."],
  ]),
  ...fcs("ielts-general", "Writing", "Task 2 (essay)", [
    ["Minimum words for General Training Task 2?", "250 words."],
    ["How many main ideas per body paragraph?", "One, supported by an explanation and an example."],
  ]),
  ...fcs("ielts-general", "Speaking", "Part 1 interview", [
    ["Correct form for a past habit?", "Used to + base verb: 'I used to play football every day.'"],
  ]),
  ...fcs("ielts-general", "Speaking", "Part 2 cue card", [
    ["How long is the preparation time in Part 2?", "One minute. Note keywords, not full sentences."],
  ]),
  ...fcs("ielts-general", "Speaking", "Part 3 discussion", [
    ["Two phrases to introduce an opinion?", "In my opinion...; As far as I'm concerned..."],
  ]),

  /* ---------- OET Nursing ---------- */
  ...fcs("oet-nursing", "Listening", "Consultation extracts", [
    ["Meaning of 'intermittent' pain?", "Pain that comes and goes rather than being constant."],
    ["Meaning of 'radiating' pain?", "Pain that spreads from its origin to another area of the body."],
    ["What does 'PRN' mean on a medication chart?", "As needed (pro re nata)."],
    ["Frequency: 'b.d.' vs 't.d.s.'?", "b.d. means twice daily. t.d.s. means three times daily."],
  ]),
  ...fcs("oet-nursing", "Listening", "Workplace extracts", [
    ["What is a handover?", "The transfer of patient information and responsibility from one nurse or shift to another."],
    ["What does 'escalate' mean in clinical practice?", "To report a concern to a more senior person so action can be taken."],
  ]),
  ...fcs("oet-nursing", "Listening", "Presentations", [
    ["Meaning of 'deteriorating patient'?", "A patient whose condition is getting worse."],
    ["What does 'repositioning' mean?", "Changing a patient's body position to relieve pressure."],
  ]),
  ...fcs("oet-nursing", "Reading", "Expeditious reading", [
    ["Skimming vs scanning in OET Part A?", "Skim for the topic of each text; scan for the specific detail asked in the question."],
    ["How long is OET Reading Part A?", "15 minutes, with four short texts."],
  ]),
  ...fcs("oet-nursing", "Reading", "Careful reading", [
    ["Meaning of 'ambulate'?", "To walk or move about."],
    ["Meaning of 'adherence'?", "How well a patient follows the prescribed treatment."],
  ]),
  ...fcs("oet-nursing", "Writing", "Referral letter", [
    ["Where does the reason for referral go?", "In the first paragraph, ideally the first sentence."],
    ["What goes in the 'Re:' line?", "The patient's full name and date of birth."],
    ["A polite way to make a request in a letter?", "I would be grateful if you could...; Could you please...?"],
  ]),
  ...fcs("oet-nursing", "Writing", "Discharge letter", [
    ["Tense for completed events in a discharge letter?", "Past simple: 'She was admitted on 4 May.'"],
    ["Tense for ongoing situations?", "Present perfect: 'She has been taking metformin since March.'"],
    ["How should 'SOB' be written in a letter?", "In full: shortness of breath. Do not use note form."],
  ]),
  ...fcs("oet-nursing", "Speaking", "Role-play", [
    ["Plain alternative to 'hypertension'?", "High blood pressure."],
    ["Plain alternative to 'analgesia'?", "Pain relief."],
    ["What is teach-back?", "Asking the patient to explain the instructions in their own words to check understanding."],
    ["An empathic phrase for a worried patient?", "I can see that this is worrying for you."],
  ]),

  /* ---------- OET Medicine ---------- */
  ...fcs("oet-medicine", "Listening", "Consultation extracts", [
    ["What does 'safety-netting' mean?", "Telling a patient which symptoms mean they should seek help and how."],
    ["Meaning of 'exacerbation'?", "A worsening of symptoms of a chronic illness."],
    ["What does 'over-the-counter' mean?", "Medicine available without a prescription."],
  ]),
  ...fcs("oet-medicine", "Listening", "Workplace extracts", [
    ["Meaning of 'on call'?", "Available to work or respond outside normal hours."],
    ["What is informed consent?", "Agreement given after the patient understands the benefits, risks and alternatives."],
    ["Meaning of 'registrar'?", "A doctor in specialist training, senior to a junior doctor."],
  ]),
  ...fcs("oet-medicine", "Listening", "Presentations", [
    ["What is antimicrobial stewardship?", "Coordinated efforts to use antimicrobials appropriately to limit resistance."],
    ["What does 'to titrate' mean?", "To adjust a dose gradually according to response."],
  ]),
  ...fcs("oet-medicine", "Reading", "Expeditious reading", [
    ["What is an abstract?", "A short summary of a research paper's background, methods, results and conclusion."],
    ["What does 'eligibility criteria' mean?", "The conditions a person must meet to take part in or receive something."],
  ]),
  ...fcs("oet-medicine", "Reading", "Careful reading", [
    ["Meaning of 'attenuate'?", "To reduce the force, effect or severity of something."],
    ["Meaning of 'false positive'?", "A test result showing disease when the person does not have it."],
    ["How can you spot a writer's attitude?", "Look for evaluative adjectives, hedging words (may, appears to) and concession phrases."],
  ]),
  ...fcs("oet-medicine", "Writing", "Referral letter", [
    ["Formal opening for a referral?", "Thank you for seeing...; I would be grateful for your assessment of..."],
    ["Tense pair: diagnosed in 2015, still taking medication?", "Past simple for diagnosis; present perfect for ongoing: 'diagnosed in 2015 and has been taking...'."],
    ["What should a specialist letter exclude?", "Details that do not affect the specialist's decision, such as irrelevant history."],
  ]),
  ...fcs("oet-medicine", "Writing", "Discharge letter", [
    ["What must a discharge letter highlight?", "Diagnosis, treatment, current status, medication changes and what the GP should do."],
    ["How long should the letter body be?", "About 180-200 words."],
  ]),
  ...fcs("oet-medicine", "Speaking", "Role-play", [
    ["What is a 'warning shot'?", "A gentle sentence preparing the patient before bad news: 'I'm afraid the results are not what we hoped.'"],
    ["Plain alternative to 'benign'?", "Not cancerous."],
    ["Open vs closed questions?", "Open invites a full answer ('How have you been feeling?'); closed gets yes or no ('Are you in pain?')."],
    ["Why avoid immediate reassurance?", "It can sound dismissive; first acknowledge feelings and explore concerns."],
  ]),
];

const FLASHCARDS_PART_2: SeedFlashcard[] = [
  /* ---------- PTE Academic ---------- */
  ...fcs("pte-academic", "Speaking and Writing", "Read aloud", [
    ["How should you treat commas in Read Aloud?", "A very short pause; keep a steady rhythm."],
    ["What is word stress?", "The syllable pronounced more strongly in a word, such as pho-TOG-ra-pher."],
  ]),
  ...fcs("pte-academic", "Speaking and Writing", "Describe image", [
    ["Three parts of a Describe Image response?", "Introduction (what it shows), key features with figures, brief conclusion."],
    ["Phrase to start describing a graph?", "This graph illustrates / shows the..."],
  ]),
  ...fcs("pte-academic", "Speaking and Writing", "Summarize written text", [
    ["Length of a Summarize Written Text response?", "One sentence of 5 to 75 words."],
    ["How can you join ideas within one sentence?", "Use linkers and punctuation: because, although, which, while, or a semicolon."],
    ["Should a summary include your opinion?", "No. Only the main idea and key supports from the passage."],
  ]),
  ...fcs("pte-academic", "Speaking and Writing", "Essay", [
    ["Word range for the PTE essay?", "200-300 words; aim for about 230-270."],
    ["Four-paragraph essay structure?", "Introduction, main idea 1, main idea 2 or opposing view, conclusion."],
  ]),
  ...fcs("pte-academic", "Reading", "Reorder paragraphs", [
    ["What clue shows a sentence is NOT the opener?", "It starts with a pronoun (it, they, this) or a linker such as However."],
    ["How does 'The study' differ from 'A study'?", "'A study' introduces something new; 'The study' refers back to it."],
    ["What does 'In response' signal?", "A reaction to a problem or event already mentioned."],
  ]),
  ...fcs("pte-academic", "Reading", "Fill in the blanks", [
    ["Meaning of 'abolish'?", "To officially end or get rid of something, such as a law or tax."],
    ["Collocation: 'conduct ___'?", "Research, a survey, an experiment, an interview."],
    ["Four checks for a blank?", "Part of speech, grammar, collocation, meaning."],
  ]),
  ...fcs("pte-academic", "Reading", "Multiple choice", [
    ["Why avoid extreme words in options?", "Words like always, never and only are rarely supported by a passage."],
    ["Association vs causation?", "Association means two things occur together; causation means one produces the other."],
  ]),
  ...fcs("pte-academic", "Listening", "Summarize spoken text", [
    ["Typical length of Summarize Spoken Text?", "About 50-70 words."],
    ["What should a spoken summary include?", "The main idea and two or three key supporting points."],
  ]),
  ...fcs("pte-academic", "Listening", "Highlight incorrect words", [
    ["Which words are usually changed?", "Content words: nouns, verbs and adjectives, often synonyms or opposites."],
    ["Why avoid clicking when unsure?", "Wrong clicks can reduce the score."],
  ]),
  ...fcs("pte-academic", "Listening", "Write from dictation", [
    ["Common dictation errors?", "Missing plural -s, missing verb endings and misspellings."],
    ["Best approach to dictation?", "Type as you hear, then use the remaining time to proofread."],
  ]),

  /* ---------- TOEFL iBT ---------- */
  ...fcs("toefl-ibt", "Reading", "Academic passages", [
    ["What is a rhetorical purpose question?", "It asks why the author mentions something (example, contrast, definition)."],
    ["What is an inference question?", "It asks what is strongly implied but not directly stated."],
    ["How do you answer a NOT question?", "Find the three options the passage supports; the remaining one is the answer."],
    ["What is a pronoun reference question?", "It asks which noun or idea a word like 'it' or 'this' refers to."],
    ["Why are copied words in an option a warning sign?", "Wrong options often repeat wording but change the meaning."],
  ]),
  ...fcs("toefl-ibt", "Listening", "Lectures", [
    ["What does a function question ask?", "Why the speaker said something, such as to give an example or make an analogy."],
    ["Phrase that signals a contrast in a lecture?", "However, but, on the other hand, yet."],
    ["Useful note-taking symbols?", "= (equals), > (greater), -> (leads to), w/ (with)."],
  ]),
  ...fcs("toefl-ibt", "Listening", "Conversations", [
    ["What does 'I suppose that could work' suggest?", "Reluctant acceptance; the speaker is not fully convinced."],
    ["Two main purposes of a campus conversation?", "A student asking for help or information, or a service-related request such as a policy or schedule."],
  ]),
  ...fcs("toefl-ibt", "Speaking", "Independent", [
    ["Ideal structure for an independent response?", "Opinion, two reasons, one specific example each."],
    ["Phrase to introduce a second reason?", "Another reason I prefer this is that..."],
    ["Is memorising a response a good idea?", "No. It sounds unnatural and may not answer the question."],
  ]),
  ...fcs("toefl-ibt", "Speaking", "Integrated", [
    ["Should integrated responses include your opinion?", "No. Report the information from the sources accurately."],
    ["Reporting verbs for speakers?", "States, argues, explains, points out, suggests, claims."],
    ["How do you paraphrase a reading sentence?", "Change words and structure while keeping the meaning."],
  ]),
  ...fcs("toefl-ibt", "Writing", "Integrated", [
    ["What is the usual relationship between reading and lecture?", "The lecture challenges or casts doubt on the reading's points."],
    ["Language that links lecture to reading?", "Whereas the reading states..., the lecturer argues..."],
    ["Does an integrated essay need a long conclusion?", "No. Focus on matching each lecture point to the reading."],
  ]),
  ...fcs("toefl-ibt", "Writing", "Academic discussion", [
    ["Two ways to engage with a classmate's post?", "Agree and extend, or politely disagree and explain why."],
    ["What makes a discussion post stronger?", "A clear opinion, a specific example and a new contribution."],
    ["Should you copy a classmate's reason?", "No. Add something new."],
  ]),
];

export const STARTER_QUESTIONS_ENGLISH: SeedQuestion[] = [
  ...IA_QUESTIONS,
  ...IG_QUESTIONS,
  ...ON_QUESTIONS,
  ...OM_QUESTIONS,
  ...PTE_QUESTIONS,
  ...TOEFL_QUESTIONS,
];
export const STARTER_MATERIALS_ENGLISH: SeedMaterial[] = [...MATERIALS_PART_1, ...MATERIALS_PART_2];
export const STARTER_FLASHCARDS_ENGLISH: SeedFlashcard[] = [...FLASHCARDS_PART_1, ...FLASHCARDS_PART_2];
