import type { SeedQuestion } from "@/lib/questions/types";

export const ACADEMIC_EXAMS: SeedQuestion[] = [
  /* ================================================================== */
  /* 1. IELTS ACADEMIC ("ielts-academic")                               */
  /* ================================================================== */
  {
    exam: "ielts-academic",
    category: "Listening",
    topic: "Lectures",
    subtopic: "Urban Ecology and Infrastructure",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "Audio Extract (Section 4 University Lecture): 'When we examine the thermal profile of dense metropolitan centres, impervious asphalt and dark roofing materials absorb solar radiation throughout the day and re-emit it as long-wave infrared heat after sunset. Many municipal planners initially assumed that simply planting street trees along arterial roads would reverse this urban heat island effect. However, our three-year monitoring study in Manchester demonstrated that while mature canopy cover reduces daytime pedestrian-level radiant temperatures by up to 4.2°C, nighttime air temperatures remain stubbornly elevated unless impervious ground surfaces are simultaneously replaced with high-albedo permeable pavements that facilitate evaporative cooling.'",
    stem: "According to the lecturer, what did the three-year Manchester study reveal about mitigating the urban heat island effect?",
    content: {
      options: [
        { id: "a", text: "Planting street trees along arterial roads has no measurable impact on daytime pedestrian comfort." },
        { id: "b", text: "Reducing nighttime urban air temperatures requires combining canopy cover with permeable, reflective ground surfaces." },
        { id: "c", text: "High-albedo pavements absorb more short-wave radiation during the afternoon than traditional asphalt." },
        { id: "d", text: "Municipal planners have largely abandoned tree-planting initiatives in favour of roof-cooling regulations." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The lecturer explicitly notes that while street trees reduce daytime radiant temperatures by up to 4.2°C, nighttime air temperatures remain elevated unless impervious ground surfaces are also replaced with high-albedo permeable pavements.",
    optionExplanations: {
      a: "Incorrect. The lecture states that mature canopy cover lowers daytime pedestrian-level radiant temperatures by up to 4.2°C.",
      b: "Correct. The study showed that nighttime cooling requires pairing tree canopy with high-albedo permeable pavements that promote evaporative cooling.",
      c: "Incorrect. High-albedo implies high reflectivity (low absorption), contrasting with dark impervious asphalt.",
      d: "Incorrect. Planners initially assumed trees alone would suffice, not that tree planting was abandoned for roof regulations.",
    },
    extras: {
      whyCorrect:
        "The qualifying conjunction 'unless' in the final sentence identifies permeable high-albedo pavements as the necessary condition for lowering nighttime air temperatures alongside tree canopy.",
      strategy:
        "In IELTS Listening Section 4, pay close attention to contrast markers such as 'However' and conditional links like 'unless', which often signal the lecturer's main empirical conclusion.",
      keyTakeaway:
        "Academic listening questions frequently test whether you can distinguish between an initial assumption and the actual research finding.",
      relatedTopics: ["Signposting in Academic Lectures", "Paraphrasing Cause and Condition", "Environmental Studies Vocabulary"],
    },
    tags: ["listening", "academic-lecture", "paraphrase"],
  },
  {
    exam: "ielts-academic",
    category: "Reading",
    topic: "Academic passages",
    subtopic: "Forest Ecology and Mycorrhizal Networks",
    type: "mcq",
    difficulty: "difficult",
    exhibit: {
      kind: "passage",
      title: "The Role of Mycorrhizal Networks in Forest Ecosystems",
      text: "Beneath the litter layer of temperate and boreal forests lies a complex subterranean infrastructure composed of ectomycorrhizal and arbuscular mycorrhizal fungi. These fungal symbionts colonize the fine root tips of host trees, extending thread-like hyphae far beyond the rhizosphere depletion zone to scavenge inorganic phosphorus and nitrogen. In return, the host tree allocates between 10% and 30% of its photosynthetically fixed carbon to the fungus.\n\nOver the past two decades, isotope-tracing experiments using carbon-13 and carbon-14 have demonstrated that individual fungal genets can simultaneously link the root systems of multiple tree species, forming Common Mycorrhizal Networks (CMNs). Early popular accounts portrayed CMNs as purely altruistic 'wood-wide webs' in which mature 'hub' trees intentionally subsidize shaded seedlings. Contemporary mycologists, however, caution against anthropomorphic interpretations. From an evolutionary perspective, fungi are autonomous organisms optimizing their own resource retention and reproductive fitness. Carbon transfer through a CMN is frequently driven by source-sink gradients and fungal metabolic demand rather than maternal tree altruism; indeed, certain mycoheterotrophic orchids and allelopathic plants exploit these very networks to parasitize fixed carbon or distribute phytotoxins to competing vegetation.",
    },
    stem: "What is the writer's primary argument regarding contemporary scientific views of Common Mycorrhizal Networks (CMNs)?",
    content: {
      options: [
        { id: "a", text: "Isotope-tracing experiments have failed to confirm that carbon moves between different tree species." },
        { id: "b", text: "Nutrient exchange within CMNs is better explained by fungal self-interest and biophysical gradients than by tree altruism." },
        { id: "c", text: "Host trees generally lose more photosynthetic energy to fungal parasites than they gain in mineral uptake." },
        { id: "d", text: "Only mycoheterotrophic orchids derive a measurable evolutionary advantage from subterranean hyphal networks." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The second paragraph contrasts popular 'altruistic' narratives with contemporary mycological views, explaining that fungi optimize their own fitness and that carbon movement follows source-sink gradients and fungal metabolic demands.",
    optionExplanations: {
      a: "Incorrect. Paragraph 2 confirms that C-13 and C-14 experiments demonstrated inter-species linkage and carbon movement.",
      b: "Correct. The passage states that fungi optimize their own fitness and transfers are driven by source-sink gradients rather than maternal altruism.",
      c: "Incorrect. Paragraph 1 describes a mutualistic exchange (phosphorus/nitrogen for 10–30% fixed carbon), not a net loss across all host trees.",
      d: "Incorrect. Orchids are cited as an example of network exploitation, not the sole beneficiaries of CMNs.",
    },
    extras: {
      whyCorrect:
        "The author explicitly contrasts 'popular accounts' of altruistic hub trees with the view of 'contemporary mycologists' who emphasize fungal fitness and source-sink dynamics.",
      strategy:
        "Look for authorial stance shifts ('Early popular accounts portrayed... Contemporary mycologists, however, caution...') to locate the core claim tested in multiple-choice items.",
      keyTakeaway:
        "IELTS Academic Reading passages regularly contrast popular misconceptions with nuanced scientific consensus.",
      relatedTopics: ["Authorial Attitude and Stance", "Scientific Passage Synthesis", "Distractor Elimination"],
    },
    tags: ["reading", "inference", "passage-based"],
  },
  {
    exam: "ielts-academic",
    category: "Reading",
    topic: "Academic passages",
    subtopic: "Paleoclimatology Summary Completion",
    type: "cloze",
    difficulty: "moderate",
    exhibit: {
      kind: "passage",
      title: "Paleoclimatology and Polar Ice Core Chronologies",
      text: "Deep ice cores extracted from the East Antarctic Plateau and the Greenland Ice Sheet serve as high-resolution archives of Earth's quaternary climate. As snow accumulates and compacts into firn and eventually crystalline glacial ice at depths of 60 to 100 metres, microscopic pockets of ancient atmosphere become hermetically sealed. Because the gas occlusion process occurs only after the overlying firn consolidates, the trapped air bubbles are systematically younger than the surrounding ice matrix—a chronological offset known to glaciologists as delta-age.\n\nMeanwhile, the isotopic composition of the ice itself—specifically the ratio of heavy oxygen-18 to light oxygen-16—provides a direct proxy for local condensation temperature at the time of precipitation. During colder glacial stadials, water vapour depleted of heavy isotopes reaches the polar interior, resulting in more negative delta-O-18 values.",
    },
    stem: "Complete the summary of the passage using the drop-down menus.",
    content: {
      template:
        "Polar ice cores preserve direct samples of ancient air inside sealed bubbles, though these gases are always {{b1}} than the enclosing ice layer because pore closure only takes place after snow compacts into dense {{b2}}. To reconstruct past polar temperatures, researchers measure the {{b3}} of oxygen isotopes within the water molecules of the ice matrix.",
      blanks: {
        b1: [
          { id: "younger", text: "younger" },
          { id: "older", text: "older" },
          { id: "denser", text: "denser" },
        ],
        b2: [
          { id: "firn", text: "firn" },
          { id: "bedrock", text: "bedrock" },
          { id: "vapour", text: "vapour" },
        ],
        b3: [
          { id: "ratio", text: "ratio" },
          { id: "pressure", text: "pressure" },
          { id: "depth", text: "depth" },
        ],
      },
    },
    answer: {
      blanks: {
        b1: "younger",
        b2: "firn",
        b3: "ratio",
      },
    },
    rationale:
      "The passage states that trapped air bubbles are 'systematically younger than the surrounding ice matrix' because occlusion happens after snow compacts into 'firn', and temperature is reconstructed from the 'ratio of heavy oxygen-18 to light oxygen-16'.",
    extras: {
      whyCorrect:
        "Each blank maps directly to a specific noun or comparative adjective in the source text ('systematically younger', 'compacts into firn', 'ratio of heavy oxygen-18 to light oxygen-16').",
      strategy:
        "In IELTS summary completion tasks, check both grammatical fit (comparative adjective vs. noun) and exact semantic equivalence with the relevant paragraph.",
      keyTakeaway:
        "Summary completion follows the chronological order of details in the passage.",
      relatedTopics: ["Summary Completion", "Lexical Cohesion", "Scanning for Technical Terms"],
    },
    tags: ["reading", "cloze", "summary-completion"],
  },
  {
    exam: "ielts-academic",
    category: "Writing",
    topic: "Task 1 (data description)",
    subtopic: "Comparative Table Analysis",
    type: "writing",
    difficulty: "moderate",
    exhibit: {
      kind: "table",
      title: "Share of Electricity Generated from Renewable Sources (%) in Four Countries, 2010–2025",
      columns: ["Country", "2010", "2015", "2020", "2025"],
      rows: [
        ["Denmark", "32.1%", "56.0%", "65.3%", "81.4%"],
        ["Germany", "17.4%", "29.2%", "44.6%", "58.2%"],
        ["United Kingdom", "6.9%", "22.8%", "43.1%", "51.5%"],
        ["Australia", "8.6%", "13.5%", "24.4%", "39.8%"],
      ],
    },
    stem: "Summarise the information in the table by selecting and reporting the main features, and make comparisons where relevant.",
    content: {
      prompt:
        "The table illustrates the percentage of total electricity generation derived from renewable energy sources in Denmark, Germany, the United Kingdom, and Australia at five-year intervals between 2010 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      minWords: 150,
      taskLabel: "IELTS Academic Writing Task 1",
      rubric: [
        "Task Achievement: Includes a clear overview of main trends (universal upward trajectory, Denmark leading throughout, UK showing steepest relative surge).",
        "Coherence and Cohesion: Groups data logically (e.g., leaders vs. rapid climbers) with accurate linking expressions.",
        "Lexical Resource: Uses precise trend and comparison vocabulary (surged, outpaced, more than sevenfold increase, trajectory).",
        "Grammatical Range and Accuracy: Employs complex comparative structures, passive constructions, and accurate prepositions with numerical data.",
      ],
    },
    answer: {
      sample:
        "The table compares the proportion of electricity produced from renewable energy across four nations—Denmark, Germany, the United Kingdom, and Australia—at five-year intervals from 2010 to 2025.\n\nOverall, every country listed experienced a substantial expansion in renewable electricity generation over the fifteen-year period. Denmark consistently generated the highest share of green power, whereas the United Kingdom recorded the most dramatic proportional growth from the lowest initial baseline.\n\nIn 2010, Denmark already sourced nearly a third (32.1%) of its electricity from renewables, almost double Germany's figure of 17.4%. Over the subsequent fifteen years, Denmark's renewable share climbed steadily, reaching 56.0% in 2015 and culminating at 81.4% by 2025. Germany followed a similarly consistent upward trajectory, more than tripling its renewable proportion to 58.2% in 2025.\n\nBy contrast, the United Kingdom and Australia began the period with single-digit shares of 6.9% and 8.6%, respectively. However, the UK rapidly overtook Australia by 2015 (22.8% versus 13.5%) and nearly converged with Germany in 2020 at 43.1%, finishing at 51.5% in 2025. Although Australia expanded its renewable output more than fourfold to reach 39.8% in 2025, it remained the lowest among the four nations from 2015 onward.",
    },
    rationale:
      "A Band 8–9 Task 1 response requires a clear introductory paraphrase, an overview paragraph identifying macro trends without raw numbers, and well-grouped body paragraphs supported by selective numerical evidence.",
    extras: {
      whyCorrect:
        "The model response highlights the universal upward trend and Denmark's dominance in the overview, then contrasts the established leaders (Denmark, Germany) with the lower-baseline nations (UK, Australia) using exact data points.",
      strategy:
        "Never list every cell chronologically row-by-row; group countries by pattern (e.g., high baseline vs. rapid catch-up) and highlight crossover points such as the UK overtaking Australia by 2015.",
      keyTakeaway:
        "An explicit overview paragraph is essential to achieve Band 7 or higher in Task Achievement on IELTS Academic Task 1.",
      relatedTopics: ["Writing an Overview Paragraph", "Describing Proportions and Multipliers", "Data Grouping Strategies"],
    },
    tags: ["writing", "task-1", "data-description"],
  },
  {
    exam: "ielts-academic",
    category: "Writing",
    topic: "Task 2 (essay)",
    subtopic: "Higher Education Funding and Public Benefit",
    type: "writing",
    difficulty: "difficult",
    stem: "Write an academic essay responding to the prompt below. Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
    content: {
      prompt:
        "Some people argue that university education should be completely funded by the government for all qualified students, while others believe that graduates should bear the primary cost of their higher education because they reap the personal financial rewards. Discuss both these views and give your own opinion. Write at least 250 words.",
      minWords: 250,
      taskLabel: "IELTS Academic Writing Task 2",
      rubric: [
        "Task Response: Fully addresses both views and presents a nuanced, consistent personal position throughout the essay.",
        "Coherence and Cohesion: Uses clear topic sentences, logical paragraph progression, and seamless cohesive devices.",
        "Lexical Resource: Demonstrates sophisticated academic collocations (socioeconomic mobility, positive externalities, income-contingent, human capital).",
        "Grammatical Range and Accuracy: Uses varied complex sentences, conditionals, and concession clauses with high accuracy.",
      ],
    },
    answer: {
      sample:
        "How the financial burden of tertiary education should be distributed between taxpayers and individual students remains one of the most contentious debates in public policy. While proponents of tuition fees emphasize the substantial private earnings premium enjoyed by university graduates, advocates of state-funded higher education highlight its indispensable role in driving collective social and economic advancement. In my view, a hybrid model—combining substantial state subsidies with modest, income-contingent graduate contributions—strikes the fairest balance.\n\nThose who argue that students should finance their own degrees point primarily to equity and personal return on investment. Statistically, university degree holders command significantly higher lifetime salaries and lower unemployment rates than non-graduates. Requiring general taxpayers—many of whom never attended university—to subsidize the future high earners of society can therefore appear regressive. Furthermore, when students invest financially in their studies, they may select courses more deliberately and hold institutions accountable for teaching quality.\n\nConversely, proponents of tuition-free higher education contend that treating university merely as a private consumer good ignores its vast positive externalities. An educated populace supplies the physicians, engineers, teachers, and researchers upon whom national innovation and public health depend. Moreover, upfront tuition barriers deter academically gifted students from lower-income backgrounds, entrenching intergenerational inequality and depriving the economy of vital talent. In addition, graduates who earn higher salaries inevitably repay the state through progressive income taxation over their working lives.\n\nIn conclusion, because higher education generates both private affluence and indispensable public benefits, neither the taxpayer nor the student should shoulder the entire cost alone. Governments ought to guarantee free upfront access and heavily subsidize degrees in critical public-service fields, while asking high-earning graduates to contribute a reasonable share through progressive post-graduation repayment schemes.",
    },
    rationale:
      "A high-scoring Discussion + Opinion essay gives equal analytical depth to both sides before resolving the tension with a well-justified synthesis.",
    extras: {
      whyCorrect:
        "The model response explicitly examines the private return-on-investment argument in Body 1, the public-good and social-mobility argument in Body 2, and defends a clear hybrid policy stance in the introduction and conclusion.",
      strategy:
        "State your own opinion clearly in the introduction as well as the conclusion so the examiner sees a consistent position from the outset.",
      keyTakeaway:
        "Avoid straw-manning the opposing view; acknowledging the strongest economic rationale on both sides elevates Task Response to Band 8+.",
      relatedTopics: ["Discuss Both Views Essay Structure", "Concession Clauses", "Public Policy Lexicon"],
    },
    tags: ["writing", "task-2", "argumentative-essay"],
  },
  {
    exam: "ielts-academic",
    category: "Speaking",
    topic: "Part 2 cue card",
    subtopic: "Describing an Architectural or Scientific Innovation",
    type: "speaking",
    difficulty: "moderate",
    stem: "Prepare for 1 minute and speak for up to 2 minutes on the Part 2 cue card topic below.",
    content: {
      prompt:
        "Describe a scientific or technological innovation that has had a positive impact on your daily life or studies.",
      prepSeconds: 60,
      speakSeconds: 120,
      cueCard: [
        "What the innovation is and when you first started using it",
        "How it works or how you use it in your routine",
        "What challenges or limitations it solved for you",
        "And explain why you believe this innovation has had such a positive impact",
      ],
      rubric: [
        "Fluency and Coherence: Sustains speech for 2 minutes without unnatural hesitation; uses discourse markers naturally.",
        "Lexical Resource: Incorporates precise topic vocabulary, idiomatic expressions, and collocations.",
        "Grammatical Range and Accuracy: Balances past narrative tenses with present habitual and evaluative clauses.",
        "Pronunciation: Uses clear word stress, chunking, and contrastive intonation to emphasize key points.",
      ],
    },
    answer: {
      sample:
        "I'd like to talk about noise-cancelling audio technology, specifically active noise cancellation in wireless headphones, which I first started using about three years ago during my second year at university. At the time, I was living in a rather cramped student flat right next to a busy commuter railway line, and finding a quiet environment to read dense academic journal articles was a daily struggle.\n\nIn terms of how the technology actually works, it relies on miniature outward-facing microphones that continuously sample ambient low-frequency sounds—such as the rumble of trains or air-conditioning units—and then generates an inverted sound wave, essentially 180 degrees out of phase, to cancel out the noise before it reaches your eardrum. In my daily routine, I put them on whenever I'm reviewing research papers in a crowded library or commuting on the metro.\n\nBefore I adopted this technology, background chatter and traffic noise constantly fragmented my attention span, forcing me to re-read complex paragraphs three or four times. Having an instant acoustic sanctuary solved that problem overnight. Overall, I consider active noise cancellation a genuinely transformative innovation because it democratizes focus: it allows students and remote workers to carve out a calm, productive mental space regardless of how chaotic their physical surroundings might be.",
    },
    rationale:
      "A strong Part 2 long turn covers all four prompts smoothly through a personal narrative arc (context -> mechanism/usage -> problem solved -> broader evaluation).",
    extras: {
      whyCorrect:
        "The response weaves together past continuous background setting ('was living'), technical explanation ('inverted sound wave'), and high-level reflection ('democratizes focus').",
      strategy:
        "Use your 60-second preparation time to jot down 2–3 high-level collocations for each bullet point rather than writing out full sentences.",
      keyTakeaway:
        "Transitioning naturally from personal anecdote to broader societal value helps sustain a full two-minute turn effortlessly.",
      relatedTopics: ["IELTS Speaking Part 2 Narrative Arc", "Discourse Markers", "Technology Collocations"],
    },
    tags: ["speaking", "part-2", "cue-card"],
  },

  /* ================================================================== */
  /* 2. IELTS GENERAL TRAINING ("ielts-general")                        */
  /* ================================================================== */
  {
    exam: "ielts-general",
    category: "Listening",
    topic: "Social contexts",
    subtopic: "Community Sports Centre Enquiry",
    type: "mcq",
    difficulty: "easy",
    scenario:
      "Audio Extract (Section 1 Telephone Enquiry):Receptionist: 'Welcome to Riverside Leisure Centre. If you're looking at our off-peak annual membership, that gives you full access to the heated indoor pool and fitness suite between 9:00 a.m. and 4:30 p.m. on weekdays. We used to charge a separate £15 induction fee for the weights room, but that's now waived if you sign up for a 12-month direct debit. Keep in mind, though, that racquet court bookings—squash and badminton—still carry a £6 per hour supplement even for annual members.'",
    stem: "Which of the following is included at no extra cost when a customer chooses the 12-month direct-debit off-peak membership?",
    content: {
      options: [
        { id: "a", text: "Evening access to the indoor heated swimming pool on weekdays" },
        { id: "b", text: "The mandatory equipment induction session for the weights room" },
        { id: "c", text: "One hour per week of squash or badminton court hire" },
        { id: "d", text: "Weekend guest passes for family members using the fitness suite" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The receptionist states that the £15 induction fee for the weights room is 'now waived if you sign up for a 12-month direct debit.'",
    optionExplanations: {
      a: "Incorrect. Off-peak access is restricted to 9:00 a.m. to 4:30 p.m. on weekdays.",
      b: "Correct. 'Waived' means the £15 induction fee is removed (included at no extra charge) for 12-month direct-debit members.",
      c: "Incorrect. Squash and badminton courts still require a £6 per hour supplement.",
      d: "Incorrect. Weekend guest passes are not mentioned in the conversation.",
    },
    extras: {
      whyCorrect:
        "Recognizing that 'waived' is a synonym for 'included at no extra cost' directly identifies option B.",
      strategy:
        "In IELTS Listening Section 1, watch out for temporal distractors ('We used to charge... but that's now waived') that test current vs. former policies.",
      keyTakeaway:
        "Fee structures and membership conditions frequently test vocabulary such as 'waived', 'supplement', 'off-peak', and 'complimentary'.",
      relatedTopics: ["Section 1 Transactional Dialogues", "Fee and Policy Paraphrases", "Temporal Distractors"],
    },
    tags: ["listening", "social-context", "ielts-gt"],
  },
  {
    exam: "ielts-general",
    category: "Reading",
    topic: "Workplace texts",
    subtopic: "Employee Remote Work and Equipment Policy",
    type: "mcq",
    difficulty: "moderate",
    exhibit: {
      kind: "passage",
      title: "Apex Logistics Ltd — Hybrid Working & Home Office Equipment Policy (Section 4.2)",
      text: "Employees who have completed their six-month probationary period and hold roles designated as 'Location-Flexible' may apply to work remotely for up to two days per calendar week. Approval is contingent upon completion of an online Display Screen Equipment (DSE) self-assessment and written authorization from the employee's line manager.\n\nTo support ergonomic safety, the company provides a one-off reimbursement of up to £250 for approved home-office seating or adjustable monitor stands. IT hardware—including laptops, docking stations, and encrypted headsets—must be requisitioned directly through the Internal IT Service Desk rather than purchased privately; private claims for computer peripherals will not be reimbursed by Payroll. Should an employee resign within twelve months of receiving an ergonomic furniture reimbursement, 50% of the claimed sum will be deducted from their final salary settlement.",
    },
    stem: "According to the policy notice, what must a Location-Flexible employee do if they require a docking station for remote work?",
    content: {
      options: [
        { id: "a", text: "Purchase the device privately and submit the receipt to Payroll under the £250 ergonomic allowance." },
        { id: "b", text: "Order the item directly through the Internal IT Service Desk." },
        { id: "c", text: "Wait until they have completed twelve months of continuous service with the company." },
        { id: "d", text: "Pay a 50% refundable deposit authorized by their line manager." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The second paragraph explicitly states that 'IT hardware—including laptops, docking stations, and encrypted headsets—must be requisitioned directly through the Internal IT Service Desk rather than purchased privately.'",
    optionExplanations: {
      a: "Incorrect. The £250 reimbursement covers ergonomic seating or monitor stands; private claims for computer peripherals are explicitly rejected by Payroll.",
      b: "Correct. Docking stations are listed under IT hardware that must be requisitioned via the Internal IT Service Desk.",
      c: "Incorrect. Eligibility begins after the six-month probationary period; twelve months relates to clawback upon resignation.",
      d: "Incorrect. The 50% figure refers to salary deduction if an employee resigns within 12 months of claiming furniture reimbursement.",
    },
    extras: {
      whyCorrect:
        "The policy separates ergonomic furniture (reimbursed up to £250) from IT hardware/peripherals (ordered directly via the Internal IT Service Desk).",
      strategy:
        "In General Training Section 2 workplace texts, scan for the exact item category ('docking stations') and verify which procedural track applies to it.",
      keyTakeaway:
        "Workplace compliance passages frequently test distinctions between two adjacent administrative procedures (e.g., Payroll reimbursement vs. IT requisition).",
      relatedTopics: ["Workplace Policy Scanning", "Procedural Exceptions", "IELTS GT Section 2"],
    },
    tags: ["reading", "workplace-text", "ielts-gt"],
  },
  {
    exam: "ielts-general",
    category: "Writing",
    topic: "Task 1 (letter)",
    subtopic: "Formal Letter of Complaint and Resolution Request",
    type: "writing",
    difficulty: "moderate",
    stem: "Write a formal letter responding to all three bullet points in the task prompt below.",
    content: {
      prompt:
        "You recently hired a local catering company for a professional networking evening at your workplace, but several aspects of the service were unsatisfactory. Write a letter to the manager of the catering company. In your letter:\n• give details of the event and the catering package you ordered\n• explain the problems that occurred on the evening of the event\n• state what action you expect the manager to take to resolve the matter.\nWrite at least 150 words. You do not need to write any addresses. Begin your letter as follows: Dear Sir or Madam,",
      minWords: 150,
      taskLabel: "IELTS General Training Writing Task 1 (Formal Letter)",
      rubric: [
        "Task Achievement: Clearly states purpose, covers all three bullet points in detail, and maintains a consistent formal register.",
        "Coherence and Cohesion: Organizes each bullet point into a dedicated paragraph with clear transitions.",
        "Lexical Resource: Uses appropriate formal business correspondence collocations (contractual agreement, shortfall, partial refund, goodwill gesture).",
        "Grammatical Range and Accuracy: Uses accurate past tenses for recounting incidents and polite modal constructions for demands.",
      ],
    },
    answer: {
      sample:
        "Dear Sir or Madam,\n\nI am writing to express my dissatisfaction with the catering service provided by your company, Savour Events, for our annual client networking reception at Meridian Architecture on Thursday, 14 November. Under booking reference SE-4092, we ordered your Executive Canapé and Beverage Package for sixty guests, scheduled for delivery and setup at 5:30 p.m.\n\nRegrettably, the service fell far short of the standards promised in our contract. Firstly, your delivery van arrived forty-five minutes late, meaning that our staff and clients had to wait while chafing dishes were unpacked in the middle of the keynote welcome speech. Secondly, although we paid a supplement for fifteen vegetarian and gluten-free platters, only four were delivered, leaving several dietary-restricted guests without suitable food. Finally, only one serving attendant was dispatched instead of the three stipulated in our invoice.\n\nGiven these significant service failures, I request a 40% refund of our £1,200 invoice, along with a full reimbursement of the dietary supplement and the unprovided staffing charges. Please confirm receipt of this letter and process the adjustment within seven working days.\n\nYours faithfully,\nClaire Thornton",
    },
    rationale:
      "A Band 8+ formal letter in IELTS General Training uses an unmistakable formal salutation/sign-off ('Dear Sir or Madam,' / 'Yours faithfully,'), states the purpose in the opening sentence, and gives concrete, realistic details for every bullet point.",
    extras: {
      whyCorrect:
        "The model response maintains an objective, professional tone throughout, provides specific details (date, reference number, exact discrepancies), and makes a clear, proportionate demand for resolution.",
      strategy:
        "Match your sign-off to the salutation: 'Dear Sir or Madam,' always requires 'Yours faithfully,' whereas a named recipient ('Dear Mr. Patel,') requires 'Yours sincerely,'.",
      keyTakeaway:
        "Tone consistency (formal vs. semi-formal vs. informal) is a core criterion for Task Achievement in IELTS General Training Task 1.",
      relatedTopics: ["Formal vs. Informal Register", "Letter of Complaint Conventions", "Polite Modal Requests"],
    },
    tags: ["writing", "letter", "ielts-gt"],
  },
  {
    exam: "ielts-general",
    category: "Speaking",
    topic: "Part 2 cue card",
    subtopic: "Describing a Memorable Community Event",
    type: "speaking",
    difficulty: "easy",
    stem: "Prepare for 1 minute and speak for up to 2 minutes on the Part 2 cue card below.",
    content: {
      prompt: "Describe a local festival or community event that you attended and enjoyed.",
      prepSeconds: 60,
      speakSeconds: 120,
      cueCard: [
        "What the event was and where it took place",
        "Who you went with and what you saw or did there",
        "How the event brought people in the neighbourhood together",
        "And explain why you found this experience particularly memorable",
      ],
      rubric: [
        "Fluency and Coherence: Connects ideas smoothly using chronological and descriptive linking phrases.",
        "Lexical Resource: Uses vivid descriptive vocabulary related to community gatherings, culture, and atmosphere.",
        "Grammatical Range and Accuracy: Combines past simple, past continuous, and relative clauses accurately.",
        "Pronunciation: Demonstrates natural rhythm, sentence stress, and clear articulation.",
      ],
    },
    answer: {
      sample:
        "I'd love to tell you about our neighbourhood's annual Autumn Harvest Street Fair, which takes place every October along a pedestrianized stretch of Market Street right in the heart of my town. I went there last autumn with my younger sister and two of our next-door neighbours.\n\nThroughout the afternoon, the entire avenue was lined with wooden stalls run by local artisans, urban beekeepers, and family-owned bakeries. We sampled freshly pressed apple cider, watched a live folk band performing on a makeshift timber stage, and even participated in a community mural-painting workshop where residents of all ages could paint a tile for the local library courtyard.\n\nWhat really stood out was how the festival dissolved the usual barriers between generations and backgrounds. Normally, people in our commuter suburb rush past one another on their way to the train station, but during the fair, elderly retirees were chatting with university students and young families over shared picnic tables.\n\nThe experience was especially memorable for me because it reminded me how much warmth and creativity exist right on our doorstep when we create public spaces for face-to-face connection.",
    },
    rationale:
      "The response addresses all four prompts with concrete sensory details and a thoughtful reflection on community cohesion.",
    extras: {
      whyCorrect:
        "The speaker moves naturally from setting the scene to specific activities, social impact, and personal takeaway without repeating vocabulary.",
      strategy:
        "Anchor your Part 2 story in 2–3 vivid sensory details (e.g., 'freshly pressed apple cider', 'community mural-painting') to make your speech sound natural and engaging.",
      keyTakeaway:
        "Elaborating on the 'why' prompt at the end gives you a strong, conclusive finish right around the two-minute mark.",
      relatedTopics: ["Community and Culture Vocabulary", "Narrative Tenses", "Sensory Description in Speaking"],
    },
    tags: ["speaking", "part-2", "ielts-gt"],
  },

  /* ================================================================== */
  /* 3. OET NURSING ("oet-nursing")                                     */
  /* ================================================================== */
  {
    exam: "oet-nursing",
    category: "Listening",
    topic: "Consultation extracts",
    subtopic: "Heart Failure Self-Management and Fluid Restriction",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "Audio Extract (OET Listening Part B — Nurse-Patient Discharge Briefing):Nurse: 'Before you head home today, Mr. Davies, let's go over your daily weight diary. Because your heart failure medications have just been adjusted—specifically increasing your furosemide dose—we need you to weigh yourself every morning right after emptying your bladder, before you have breakfast or get dressed. A fluctuation of half a kilogram isn't unusual, but if your weight climbs by more than two kilograms over forty-eight hours, don't wait for next month's clinic review; ring the cardiac specialist nurse helpline straight away so we can titrate your diuretic before fluid builds up in your lungs.'",
    stem: "What is the nurse's primary reason for instructing the patient to keep a daily morning weight log?",
    content: {
      options: [
        { id: "a", text: "To determine whether his dietary caloric intake needs to be reduced before his next clinic visit" },
        { id: "b", text: "To detect early fluid retention so his diuretic dosage can be adjusted promptly" },
        { id: "c", text: "To verify that he is taking his morning furosemide tablet before eating breakfast" },
        { id: "d", text: "To monitor whether his weight fluctuates by half a kilogram over a one-month period" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The nurse explains that a weight gain of >2 kg over 48 hours requires calling the cardiac helpline immediately 'so we can titrate your diuretic before fluid builds up in your lungs.'",
    optionExplanations: {
      a: "Incorrect. Morning weighing is used to track fluid volume status, not caloric intake.",
      b: "Correct. Rapid weight gain signals acute fluid retention, allowing early diuretic titration to prevent pulmonary edema.",
      c: "Incorrect. Weighing occurs before breakfast to ensure consistent baseline measurement, not to verify tablet timing.",
      d: "Incorrect. A 0.5 kg fluctuation is described as normal; the actionable threshold is >2 kg over 48 hours.",
    },
    extras: {
      whyCorrect:
        "The clause 'so we can titrate your diuretic before fluid builds up in your lungs' directly states the clinical purpose of the daily weight log.",
      strategy:
        "In OET Listening Part B, focus on the clinical purpose behind a nursing instruction rather than isolated numbers mentioned as distractors.",
      keyTakeaway:
        "Patient education extracts in OET Listening frequently test red-flag thresholds and escalation pathways.",
      relatedTopics: ["Heart Failure Discharge Teaching", "OET Listening Part B Purpose Questions", "Clinical Escalation Cues"],
    },
    tags: ["oet-nursing", "listening", "patient-education"],
  },
  {
    exam: "oet-nursing",
    category: "Reading",
    topic: "Careful reading",
    subtopic: "Prevention of Catheter-Associated Urinary Tract Infections",
    type: "mcq",
    difficulty: "moderate",
    exhibit: {
      kind: "passage",
      title: "Clinical Protocol: Indwelling Urinary Catheter Maintenance and CAUTI Prevention",
      text: "Catheter-associated urinary tract infections (CAUTIs) account for over 30% of healthcare-associated infections reported in acute medical wards. The single most decisive predictor of bacteriuria is the duration of catheterization; consequently, nursing staff must evaluate catheter necessity during every shift handover using the nurse-driven HOUDINI protocol. Unless the patient exhibits acute urinary retention, bladder outlet obstruction, Stage III/IV sacral pressure injury with incontinence, or strict hourly urine-output monitoring in haemodynamically unstable states, the catheter should be removed under standing protocol without awaiting a separate medical round.\n\nWhen ongoing catheterization is clinically justified, maintaining a continuously closed drainage system is paramount. Breaking the junction between the catheter tubing and the collection bag to obtain urine specimens or perform routine bladder irrigation significantly elevates retrograde microbial colonization. Midstream catheter specimens must instead be aspirated aseptically through the needleless sampling port after disinfecting the diaphragm with 70% isopropyl alcohol and allowing it to air-dry for thirty seconds.",
    },
    stem: "According to the clinical protocol, what does the writer emphasize regarding the maintenance of an indwelling urinary catheter when continued use is required?",
    content: {
      options: [
        { id: "a", text: "Routine daily bladder irrigation should be performed to prevent microbial biofilm formation." },
        { id: "b", text: "Disconnecting the drainage bag junction compromises the closed system and increases infection risk." },
        { id: "c", text: "Urine samples for culture should be drawn directly from the collection bag spigot using sterile gloves." },
        { id: "d", text: "Medical officer sign-off is required at every shift handover to keep the closed drainage system in place." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Paragraph 2 states that 'maintaining a continuously closed drainage system is paramount' and that 'Breaking the junction between the catheter tubing and the collection bag... significantly elevates retrograde microbial colonization.'",
    optionExplanations: {
      a: "Incorrect. Routine bladder irrigation is explicitly cited as a practice that breaks the closed junction and elevates colonization risk.",
      b: "Correct. Separating the catheter-bag junction disrupts the closed system and promotes retrograde microbial entry.",
      c: "Incorrect. Specimens must be aspirated aseptically via the needleless sampling port, not from the drainage bag or by breaking the junction.",
      d: "Incorrect. Nursing staff evaluate necessity at handover using the nurse-driven HOUDINI protocol.",
    },
    extras: {
      whyCorrect:
        "The second paragraph highlights intact closed-system integrity as 'paramount' and warns against disconnecting the tubing junction.",
      strategy:
        "In OET Reading Part C, verify which paragraph matches the question stem's condition ('when continued use is required' -> paragraph 2).",
      keyTakeaway:
        "Careful reading questions often contrast recommended aseptic practices (needleless port aspiration) with contraindicated actions (breaking the tubing junction).",
      relatedTopics: ["OET Reading Part C", "Infection Control Protocols", "Clinical Paraphrasing"],
    },
    tags: ["oet-nursing", "reading", "infection-control"],
  },
  {
    exam: "oet-nursing",
    category: "Writing",
    topic: "Discharge letter",
    subtopic: "Community Nursing Referral for Post-Operative Wound and Diabetes Care",
    type: "writing",
    difficulty: "difficult",
    exhibit: {
      kind: "passage",
      title: "Case Notes: Mrs. Margaret Vance (DOB: 12/04/1952)",
      text: "Patient: Mrs. Margaret Vance, 74-year-old retired librarian, lives alone in two-storey cottage.\nAdmission Date: 14 Nov 2026 | Discharge Date: 21 Nov 2026\nDiagnosis: Right total knee arthroplasty (TKA) following severe osteoarthritis; background Type 2 Diabetes Mellitus (HbA1c 8.4%) and essential hypertension.\nInpatient Course:\n- Uncomplicated right TKA on 14 Nov.\n- Post-op Day 3: Developed superficial serous ooze at distal 2 cm of incision; wound swab negative for MRSA/pathogens. Dressed with Aquacel Ag and Mepilex Border; requires dressing review & change every 3 days.\n- Surgical clips (18 staples) due for removal on Post-op Day 14 (28 Nov 2026).\n- Blood glucose levels labile post-op (fasting 9.8–13.4 mmol/L); endocrinology team commenced evening insulin glargine 12 units SC in addition to metformin 1g BD. Patient anxious about self-injecting due to mild osteoarthritic dexterity loss in hands.\n- Physiotherapy: Mobilising independently with four-wheeled walker on flat surfaces; downstairs living arrangement organised temporarily.\nDischarge Plan: Write referral letter to Ms. Helen Carter, Community District Nursing Team Leader, requesting home visits for insulin supervision, wound care, and clip removal.",
    },
    stem: "Using the case notes provided, write a discharge referral letter to Ms. Helen Carter, Community District Nursing Team Leader.",
    content: {
      prompt:
        "Using the information in the case notes, write a letter of referral to Ms. Helen Carter, Team Leader, Community District Nursing Service, 44 Oakridge Road. Expand the relevant notes into complete sentences. Do not use note form. The body of the letter should be approximately 180–200 words.",
      minWords: 180,
      maxWords: 200,
      taskLabel: "OET Nursing Writing — Community Nursing Referral Letter",
      rubric: [
        "Purpose: Immediately states the reason for referral (ongoing wound care, staple removal, and insulin administration support).",
        "Content & Conciseness: Includes all critical nursing details (TKA date, dressing regimen, staple removal date, new insulin glargine dose) while omitting irrelevant details.",
        "Genre & Style: Maintains professional, empathetic clinical register appropriate for nurse-to-nurse handover.",
        "Organization & Layout: Groups surgical wound care separately from glycemic management and social/mobility context.",
      ],
    },
    answer: {
      sample:
        "Dear Ms. Carter,\n\nRe: Mrs. Margaret Vance, DOB: 12/04/1952\n\nI am writing to refer Mrs. Vance, a 74-year-old woman being discharged home today following an elective right total knee arthroplasty performed on 14 November 2026. She lives alone and requires community nursing visits for surgical wound management, staple removal, and supervision with newly initiated insulin therapy.\n\nOn post-operative day three, Mrs. Vance developed mild serous exudate at the distal 2 cm of her incision, although wound swabs were negative for infection. The site is currently dressed with Aquacel Ag and a Mepilex Border. Please review and renew this dressing every three days, and remove her eighteen surgical clips on 28 November 2026 (post-operative day fourteen).\n\nAdditionally, Mrs. Vance has a history of type 2 diabetes mellitus (HbA1c 8.4%) and experienced elevated fasting blood glucose levels (9.8–13.4 mmol/L) post-operatively. Consequently, she has been commenced on subcutaneous insulin glargine 12 units each evening alongside her regular metformin 1 g twice daily. Because she has reduced manual dexterity and remains anxious about self-injection, please supervise her evening insulin administration and monitor her capillary blood glucose trends.\n\nShe is mobilising safely with a four-wheeled walker. Thank you for your ongoing care.\n\nYours sincerely,\nCharge Nurse",
    },
    rationale:
      "An OET Grade B/A nursing referral letter foregrounds the purpose in the opening paragraph and groups active nursing interventions (wound care + clip removal date; insulin glargine education/supervision) clearly and concisely within the 180–200 word target.",
    extras: {
      whyCorrect:
        "The sample letter translates all abbreviated clinical notes into natural, grammatically accurate prose, highlights exact dates and dosages, and gives actionable requests to the district nurse.",
      strategy:
        "Always place the patient's full name and DOB in the Re: line and state both the procedure and the specific community nursing tasks required in paragraph 1.",
      keyTakeaway:
        "OET Writing evaluates clinical relevance: include exact dressing types, clip removal dates, and new medication barriers while keeping social history brief.",
      relatedTopics: ["OET Nursing Referral Structure", "Transforming Case Notes to Prose", "Post-Operative Handover Communication"],
    },
    tags: ["oet-nursing", "writing", "discharge-letter"],
  },
  {
    exam: "oet-nursing",
    category: "Speaking",
    topic: "Role-play",
    subtopic: "Reassuring a Patient Reluctant to Mobilize Early Post-Surgery",
    type: "speaking",
    difficulty: "moderate",
    stem: "Review the OET Nursing role-play card below (3 minutes preparation) and deliver your spoken nursing consultation (up to 5 minutes).",
    content: {
      prompt:
        "Setting: Surgical Ward\nNurse: You are caring for a 58-year-old patient who underwent an open laparoscopic-assisted hemicolectomy yesterday. The patient is refusing to sit out of bed with the physiotherapist due to fear of tearing the abdominal stitches and worsening incisional pain.",
      prepSeconds: 180,
      speakSeconds: 300,
      cueCard: [
        "Find out why the patient is reluctant to get out of bed today and validate their concerns empathetically.",
        "Reassure the patient about the strength of deep surgical sutures and explain the splint-coughing / pillow-support technique.",
        "Explain the clinical benefits of early mobilization (preventing deep vein thrombosis, chest infections, and postoperative ileus).",
        "Negotiate a gradual plan: administer breakthrough analgesia 30 minutes prior and start by sitting on the edge of the bed.",
      ],
      rubric: [
        "Relationship Building: Demonstrates empathy, validates fear of pain/dehiscence, and avoids a patronizing tone.",
        "Understanding & Incorporating the Patient's Perspective: Elicits specific fears before delivering clinical explanations.",
        "Providing Structure: Signposts explanations clearly (wound security -> benefits of movement -> pain relief plan).",
        "Information Gathering & Giving: Uses plain, lay-friendly language instead of unexplained medical jargon.",
      ],
    },
    answer: {
      sample:
        "Good morning, Jordan. I noticed you seemed quite hesitant when the physiotherapist stopped by earlier, so I wanted to sit down and check in with how you're feeling about getting out of bed today. ... I completely understand why you'd feel anxious about that—after major abdominal surgery yesterday, it's very natural to worry that moving might pull on your stitches or trigger a sharp spike in pain.\n\nIf it helps put your mind at ease, your surgeon closed the deeper muscle layers with very strong internal sutures that are specifically designed to withstand the pressure of sitting and standing. We can also fold a firm pillow for you to hug gently against your abdomen as a splint whenever you shift position, which takes the strain off the surface incision.\n\nThe main reason we encourage gentle movement on day one is to protect you from post-operative complications. Sitting upright helps your lungs expand fully so fluid doesn't settle and cause a chest infection, keeps the blood circulating in your calves to prevent clots, and gently wakes up your bowel.\n\nHere is what I suggest: let me give you a dose of your breakthrough pain relief right now. Once that takes full effect in about thirty minutes, we'll simply start by helping you sit on the edge of the bed for ten minutes. How does that sound as a first step?",
    },
    rationale:
      "The response models OET Clinical Communication criteria: empathetic validation first, jargon-free explanation of wound integrity and systemic benefits second, and shared decision-making with pre-emptive analgesia third.",
    extras: {
      whyCorrect:
        "Rather than lecturing the patient, the nurse validates the fear of suture tearing, offers a practical physical strategy (pillow splinting) and pharmacological timing (analgesia 30 minutes prior), and checks for agreement.",
      strategy:
        "In OET Speaking, always translate clinical terms like 'dehiscence', 'atelectasis', 'DVT', and 'ileus' into accessible patient language ('pulling on your stitches', 'chest infection', 'blood clots', 'waking up your bowel').",
      keyTakeaway:
        "Collaborative negotiation at the end of the role-play scores heavily on both Relationship Building and Information Giving.",
      relatedTopics: ["OET Clinical Communication Criteria", "Empathetic Validation", "Jargon-Free Patient Education"],
    },
    tags: ["oet-nursing", "speaking", "role-play"],
  },

  /* ================================================================== */
  /* 4. OET MEDICINE ("oet-medicine")                                   */
  /* ================================================================== */
  {
    exam: "oet-medicine",
    category: "Listening",
    topic: "Workplace extracts",
    subtopic: "Diagnostic Pitfalls in Atypical Acute Coronary Syndrome",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "Audio Extract (OET Listening Part B — Emergency Department Senior Registrar Handover):Registrar: 'Regarding the 66-year-old woman in Bed 4 who presented with epigastric burning and nausea: her initial twelve-lead ECG showed non-specific T-wave flattening, and she actually reported transient relief after a gastro-oesophageal antacid cocktail in triage. That symptomatic improvement is a classic cognitive trap—up to twenty percent of inferior myocardial ischaemia cases mimic reflux and respond briefly to antacids via placebo or oesophageal spasm relief. Thankfully, we repeated the high-sensitivity troponin I at two hours, which jumped from 14 to 198 nanograms per litre, confirming a non-ST-elevation myocardial infarction.'",
    stem: "What point is the senior registrar making to the incoming team about the patient in Bed 4?",
    content: {
      options: [
        { id: "a", text: "A normal initial twelve-lead ECG reliably rules out inferior myocardial ischaemia in older women." },
        { id: "b", text: "Symptomatic relief after antacid administration should not be used to exclude acute myocardial ischaemia." },
        { id: "c", text: "Gastro-oesophageal reflux frequently causes false-positive elevations in high-sensitivity troponin I." },
        { id: "d", text: "Serial troponin testing is unnecessary once T-wave flattening resolves following triage treatment." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The registrar warns that symptom improvement after an antacid cocktail is a 'classic cognitive trap' because up to 20% of inferior myocardial ischaemia presentations mimic reflux and briefly improve after antacids.",
    optionExplanations: {
      a: "Incorrect. The patient had non-specific T-wave flattening initially and was subsequently diagnosed with NSTEMI.",
      b: "Correct. The registrar highlights that transient symptom relief after antacids is a diagnostic pitfall that must not exclude ACS.",
      c: "Incorrect. The rising troponin (14 to 198 ng/L) confirmed true NSTEMI, not a false positive from reflux.",
      d: "Incorrect. Repeating the troponin at 2 hours was the decisive step that caught the NSTEMI.",
    },
    extras: {
      whyCorrect:
        "The phrase 'classic cognitive trap' highlights the core clinical lesson: response to GI antacids does not rule out inferior cardiac ischaemia.",
      strategy:
        "In OET Listening medical handovers, listen for evaluative language ('cognitive trap', 'crucial lesson', 'Thankfully, we...') to identify the speaker's main clinical message.",
      keyTakeaway:
        "Atypical ACS presentations and diagnostic anchoring bias are classic themes in OET Medicine workplace extracts.",
      relatedTopics: ["Medical Handover Communication", "Atypical ACS Presentations", "OET Listening Gist and Purpose"],
    },
    tags: ["oet-medicine", "listening", "handover"],
  },
  {
    exam: "oet-medicine",
    category: "Reading",
    topic: "Careful reading",
    subtopic: "Perioperative Anticoagulation Bridging in Atrial Fibrillation",
    type: "mcq",
    difficulty: "difficult",
    exhibit: {
      kind: "passage",
      title: "Clinical Review: Perioperative Management of Direct Oral Anticoagulants (DOACs) in Non-Valvular Atrial Fibrillation",
      text: "Historically, patients with non-valvular atrial fibrillation receiving chronic vitamin K antagonists (VKAs) such as warfarin were routinely transitioned to parenteral low-molecular-weight heparin (LMWH) during the five-day perioperative interruption window—a practice termed 'bridging anticoagulation'. The rationale was that bridging minimized the interval during which patients remained exposed to thromboembolic stroke risk. However, landmark randomized controlled trials, beginning with the BRIDGE study and corroborated by the PAUSE cohort for direct oral anticoagulants (DOACs), have fundamentally overturned this paradigm for the vast majority of patients.\n\nBecause DOACs—such as apixaban, rivaroxaban, and dabigatran—exert predictable pharmacokinetic profiles with rapid onset and short elimination half-lives (typically 9 to 14 hours in patients with preserved renal clearance), standardized pharmacokinetic interruption based on surgical bleeding risk and creatinine clearance leaves patients unanticoagulated for only a brief window. Crucially, clinical trial data revealed that administering parenteral heparin bridging alongside DOAC interruption did not yield a statistically significant reduction in arterial thromboembolism, whereas it nearly tripled the incidence of major postoperative haemorrhage. Consequently, contemporary consensus guidelines reserve perioperative heparin bridging exclusively for patients at the highest tier of thromboembolic risk, such as those with mechanical mitral valves or a recent ischaemic stroke within the preceding twelve weeks.",
    },
    stem: "Why have contemporary clinical guidelines largely moved away from routine heparin bridging for patients taking DOACs prior to elective surgery?",
    content: {
      options: [
        { id: "a", text: "DOACs have an elimination half-life of five days, making parenteral heparin pharmacologically redundant." },
        { id: "b", text: "Heparin bridging markedly increases major bleeding events without providing a meaningful reduction in thromboembolic risk." },
        { id: "c", text: "Patients with mechanical mitral valves experience higher stroke rates when switched from DOACs to LMWH." },
        { id: "d", text: "Creatinine clearance measurements cannot accurately predict the clearance rate of apixaban or dabigatran." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Paragraph 2 explicitly states that parenteral heparin bridging 'did not yield a statistically significant reduction in arterial thromboembolism, whereas it nearly tripled the incidence of major postoperative haemorrhage.'",
    optionExplanations: {
      a: "Incorrect. Five days was the interruption window for warfarin (VKAs); DOAC half-lives are 9 to 14 hours.",
      b: "Correct. Trial data showed bridging failed to reduce arterial thromboembolism while nearly tripling major postoperative haemorrhage.",
      c: "Incorrect. Mechanical mitral valves are cited as an exception where bridging is still reserved (and DOACs are not used for mechanical valves).",
      d: "Incorrect. The passage states that DOACs have predictable pharmacokinetics and interruption is reliably guided by surgical bleeding risk and creatinine clearance.",
    },
    extras: {
      whyCorrect:
        "The sentence beginning with 'Crucially, clinical trial data revealed...' directly explains the risk-benefit asymmetry (no stroke benefit vs. 3x major bleeding risk) that drove the guideline change.",
      strategy:
        "Look for adverbs of emphasis ('Crucially,', 'Consequently,') in OET Reading Part C passages, as they almost always anchor the rationale tested in comprehension items.",
      keyTakeaway:
        "Distinguish historical rationale (paragraph 1) from contemporary trial evidence (paragraph 2).",
      relatedTopics: ["Perioperative Anticoagulation", "OET Reading Part C Cause-Effect", "Evidence-Based Guideline Shifts"],
    },
    tags: ["oet-medicine", "reading", "clinical-guidelines"],
  },
  {
    exam: "oet-medicine",
    category: "Writing",
    topic: "Referral letter",
    subtopic: "Urgent Gastroenterology Referral for Suspected Iron-Deficiency Anaemia / Colorectal Malignancy",
    type: "writing",
    difficulty: "difficult",
    exhibit: {
      kind: "passage",
      title: "Case Notes: Mr. David Kowalski (Age: 58, Commercial Pilot)",
      text: "Patient: Mr. David Kowalski, 58yo male commercial airline pilot.\nFamily History: Father diagnosed with colorectal adenocarcinoma at age 62.\nMedical History: Hypertension (amlodipine 5 mg OD); no prior NSAID or anticoagulant use.\nConsultations:\n- 02 Nov 2026: Presented with 6-week history of progressive exertional fatigue and mild dyspnoea climbing stairs. Denied overt haematochezia, melaena, or abdominal pain. Weight: 81 kg (down from 86 kg 4 months ago — unintentional 5 kg loss). O/E: Conjunctival pallor, BP 128/78, HR 86, abdomen soft/non-tender, DRE unremarkable.\n- Investigations Ordered (02 Nov): FBC, ferritin, iron studies, coeliac serology (tTG-IgA), Quantitative Faecal Immunochemical Test (qFIT).\n- 21 Nov 2026 (Review Today): Lab results returned:\n  • Hb: 98 g/L (Ref: 130–170) | MCV: 71 fL (Ref: 80–100) — microcytic hypochromic anaemia\n  • Serum Ferritin: 8 µg/L (Ref: 30–300)\n  • Coeliac serology (tTG-IgA): Negative\n  • qFIT: 145 µg Hb/g faeces (Ref: <10 µg/g — strongly positive)\nManagement: Commenced oral ferrous fumarate 210 mg OD (warned to stop 7 days prior to colonoscopy). Referred urgently under 2-week-wait pathway to Dr. Priya Nair, Consultant Gastroenterologist, St. Jude's Hospital, for urgent bidirectional endoscopy (colonoscopy +/- OGD).",
    },
    stem: "Using the case notes provided, write an urgent referral letter to Dr. Priya Nair, Consultant Gastroenterologist.",
    content: {
      prompt:
        "Using the information in the case notes, write an urgent referral letter to Dr. Priya Nair, Consultant Gastroenterologist, Department of Gastroenterology, St. Jude's Hospital. Expand the relevant notes into complete sentences. Do not use note form. The body of the letter should be approximately 180–200 words.",
      minWords: 180,
      maxWords: 200,
      taskLabel: "OET Medicine Writing — Urgent Gastroenterology Referral",
      rubric: [
        "Purpose: Clearly flags an urgent two-week-wait referral for suspected lower gastrointestinal malignancy / unexplained iron-deficiency anaemia.",
        "Content: Accurately reports red-flag features (5 kg weight loss, Hb 98 g/L, MCV 71 fL, ferritin 8 µg/L, qFIT 145 µg/g, positive first-degree family history).",
        "Conciseness & Clarity: Organizes clinical presentation, laboratory findings, and interim primary care management logically.",
        "Genre & Style: Uses precise medical terminology appropriate for physician-to-specialist correspondence.",
      ],
    },
    answer: {
      sample:
        "Dear Dr. Nair,\n\nRe: Mr. David Kowalski, aged 58\n\nI am writing to urgently refer Mr. Kowalski, a 58-year-old commercial pilot, under the two-week-wait pathway for bidirectional endoscopy, particularly colonoscopy, to exclude an occult colorectal malignancy.\n\nMr. Kowalski initially presented on 2 November 2026 with a six-week history of progressive exertional fatigue, mild dyspnoea, and an unintentional 5 kg weight loss over four months (current weight 81 kg). Although he denies overt haematochezia, melaena, or abdominal pain, his family history is significant for paternal colorectal adenocarcinoma diagnosed at age 62. Physical examination revealed conjunctival pallor, a soft, non-tender abdomen, and an unremarkable digital rectal examination.\n\nInvestigations reviewed today demonstrated marked microcytic iron-deficiency anaemia, with a haemoglobin of 98 g/L, MCV of 71 fL, and serum ferritin of 8 µg/L. Coeliac serology (tTG-IgA) was negative; however, his quantitative faecal immunochemical test (qFIT) returned strongly positive at 145 µg Hb/g.\n\nI have commenced him on oral ferrous fumarate 210 mg daily and advised him to discontinue this seven days prior to colonoscopy. His only other regular medication is amlodipine 5 mg daily for hypertension. Thank you for prioritizing his assessment.\n\nYours sincerely,\nDoctor",
    },
    rationale:
      "A high-scoring OET Medicine referral immediately alerts the specialist to the urgency (two-week-wait pathway for suspected colorectal malignancy) and synthesizes the clinical red flags, decisive lab values (Hb, MCV, ferritin, qFIT), and interim iron supplementation instruction.",
    extras: {
      whyCorrect:
        "The letter integrates the key diagnostic cues seamlessly while explaining practical precautions (stopping oral iron 7 days prior to colonoscopy).",
      strategy:
        "For urgent suspected-cancer referrals in OET Medicine, state both the requested investigation ('bidirectional endoscopy, particularly colonoscopy') and the provisional suspicion ('to exclude an occult colorectal malignancy') in the opening sentence.",
      keyTakeaway:
        "Specialist-to-specialist correspondence requires concise clinical terminology ('conjunctival pallor', 'microcytic iron-deficiency anaemia', 'occult colorectal malignancy').",
      relatedTopics: ["OET Medicine Urgent Referral", "Two-Week-Wait Red Flags", "Synthesizing Laboratory Data"],
    },
    tags: ["oet-medicine", "writing", "referral-letter"],
  },
  {
    exam: "oet-medicine",
    category: "Speaking",
    topic: "Role-play",
    subtopic: "Explaining a New Diagnosis of Gout and Long-Term Urate-Lowering Therapy",
    type: "speaking",
    difficulty: "moderate",
    stem: "Review the OET Medicine role-play card below (3 minutes preparation) and conduct your consultation (up to 5 minutes).",
    content: {
      prompt:
        "Setting: General Practice Clinic\nDoctor: Your patient is a 49-year-old software engineer who experienced their third episode of acute podagra (first metatarsophalangeal joint gout) in the past year. Serum urate measured between flares is elevated at 0.54 mmol/L. You need to explain the rationale for starting prophylactic allopurinol once the acute flare settles.",
      prepSeconds: 180,
      speakSeconds: 300,
      cueCard: [
        "Explain the diagnosis of recurrent gout and why uric acid crystals deposit in the big toe joint.",
        "Address the patient's belief that gout is caused solely by excessive alcohol or rich food (explain renal urate clearance and genetic predisposition).",
        "Explain the difference between acute flare relief (colchicine/NSAIDs) and long-term preventive therapy (allopurinol).",
        "Warn the patient that starting allopurinol can initially trigger mild flares as crystals dissolve, and explain the plan for low-dose prophylaxis cover.",
      ],
      rubric: [
        "Relationship Building: De-stigmatizes the diagnosis of gout and validates the patient's frustration.",
        "Understanding the Patient's Perspective: Directly addresses myths around diet/alcohol versus genetics and renal urate handling.",
        "Providing Structure: Clearly differentiates short-term symptom control from long-term crystal dissolution.",
        "Information Giving: Checks understanding of why allopurinol must be taken daily and not stopped if a minor flare occurs.",
      ],
    },
    answer: {
      sample:
        "Thanks for coming back in to review your blood tests, Alex. Now that your third episode of acute toe pain is settling down, we have a clear picture from your serum urate level, which came back elevated at 0.54. This confirms recurrent gout.\n\nFirst, I want to address a very common misconception—many people still associate gout purely with overindulgence in alcohol or rich food, which can feel quite stigmatizing. In reality, while certain purine-rich foods can act as minor triggers, the primary driver in over ninety percent of cases is genetic: how efficiently your kidneys clear uric acid from the bloodstream. When levels stay elevated above the saturation point, microscopic needle-like crystals form in cooler peripheral joints like your big toe.\n\nBecause you've now had three flares within twelve months, painkillers or colchicine alone aren't enough—they only extinguish the immediate inflammation without clearing the underlying crystal build-up. Once this current flare has completely settled in about two weeks, I recommend starting a daily preventive tablet called allopurinol, which gradually lowers your uric acid so existing crystals dissolve over time.\n\nOne crucial point to know is that as those crystals start shrinking and shifting in the first few months, they can occasionally trigger a minor flare. We'll prescribe a low daily dose of colchicine alongside the allopurinol at first to prevent that, and it's vital not to stop the allopurinol if a flare does happen. How do you feel about starting that preventive plan?",
    },
    rationale:
      "The consultation effectively de-stigmatizes gout, distinguishes acute anti-inflammatory relief from chronic urate-lowering therapy, and gives clear anticipatory guidance regarding mobilization flares on allopurinol initiation.",
    extras: {
      whyCorrect:
        "Addressing the patient's shame around diet/lifestyle upfront establishes strong rapport before introducing the technical distinction between flare treatment and prophylaxis.",
      strategy:
        "When explaining long-term prophylaxis in OET Medicine, use a clear contrast framework ('Extinguishing the fire today vs. removing the fuel long-term') and confirm patient comprehension.",
      keyTakeaway:
        "Anticipatory guidance about paradox/mobilization flares prevents premature medication non-adherence.",
      relatedTopics: ["Gout Patient Education", "De-stigmatizing Chronic Conditions", "OET Medicine Role-Play Structure"],
    },
    tags: ["oet-medicine", "speaking", "role-play"],
  },

  /* ================================================================== */
  /* 5. PTE ACADEMIC ("pte-academic")                                   */
  /* ================================================================== */
  {
    exam: "pte-academic",
    category: "Speaking and Writing",
    topic: "Read aloud",
    subtopic: "Behavioral Economics and Decision Architecture",
    type: "speaking",
    difficulty: "easy",
    stem: "Look at the text below. In 35 seconds, you must read this text aloud as naturally and clearly as possible. You have 40 seconds to read aloud.",
    content: {
      prompt:
        "Read the following academic passage aloud clearly, maintaining natural phrasing, stress on content words, and appropriate pauses at punctuation boundaries:",
      prepSeconds: 35,
      speakSeconds: 40,
      cueCard: [
        "Passage: 'While neoclassical economic theory traditionally assumes that consumers process all available market information to maximize expected utility, empirical research in behavioral economics demonstrates that human judgment relies heavily on cognitive heuristics, making everyday financial choices systematically sensitive to how default options are framed.'",
      ],
      rubric: [
        "Content: Every word is read accurately without insertions, omissions, or replacements.",
        "Oral Fluency: Smooth, natural rhythm and phrasing without hesitations, repetitions, or false starts.",
        "Pronunciation: Clear articulation of polysyllabic academic vocabulary (neoclassical, empirical, heuristics, systematically) and native-like stress patterns.",
      ],
    },
    answer: {
      sample:
        "While neoclassical economic theory / traditionally assumes that consumers process all available market information / to maximize expected utility, // empirical research in behavioral economics demonstrates / that human judgment relies heavily on cognitive heuristics, // making everyday financial choices / systematically sensitive to how default options are framed.",
    },
    rationale:
      "In PTE Read Aloud, scoring depends on exact lexical accuracy, smooth respiratory chunking at syntactic boundaries (marked by / and //), and falling intonation at the final period.",
    extras: {
      whyCorrect:
        "Grouping words into meaningful syntactic sense groups prevents robotic word-by-word delivery and preserves breath control across a complex 42-word sentence.",
      strategy:
        "During the 35-second preparation window, silently rehearse the pronunciation of unfamiliar polysyllabic words ('heuristics', 'neoclassical') and mentally mark 4–5 pause points.",
      keyTakeaway:
        "Never backtrack to self-correct a mispronounced word in PTE Read Aloud; self-correction penalizes Oral Fluency more heavily than a single syllable error.",
      relatedTopics: ["PTE Read Aloud Chunking", "Sentence Intonation", "Oral Fluency Scoring"],
    },
    tags: ["pte-academic", "speaking", "read-aloud"],
  },
  {
    exam: "pte-academic",
    category: "Speaking and Writing",
    topic: "Describe image",
    subtopic: "Global Semiconductor Supply Chain Concentration",
    type: "speaking",
    difficulty: "moderate",
    exhibit: {
      kind: "table",
      title: "Global Semiconductor Manufacturing Capacity (%) by Node Category and Region (2025)",
      columns: ["Region", "Legacy Nodes (>28 nm)", "Mature Nodes (10–28 nm)", "Advanced Logic (<7 nm)"],
      rows: [
        ["Taiwan", "18%", "44%", "68%"],
        ["South Korea", "11%", "19%", "24%"],
        ["Mainland China", "39%", "21%", "1%"],
        ["United States & Europe", "20%", "12%", "7%"],
        ["Rest of World", "12%", "4%", "0%"],
      ],
    },
    stem: "Look at the data display. In 25 seconds, please speak into the microphone and describe in detail what the display is showing. You will have 40 seconds to give your response.",
    content: {
      prompt:
        "Describe the key trends, highest and lowest figures, and main implication shown in the Global Semiconductor Manufacturing Capacity table.",
      prepSeconds: 25,
      speakSeconds: 40,
      cueCard: [
        "Introduce the title and variables (semiconductor fabrication share across three node tiers and five geographic regions).",
        "Highlight the extreme concentration in Advanced Logic (<7 nm): Taiwan (68%) and South Korea (24%) account for 92% combined.",
        "Contrast with Legacy Nodes (>28 nm), where Mainland China holds the largest share at 39%.",
        "Conclude with a concise synthesis sentence on regional specialization across technology tiers.",
      ],
      rubric: [
        "Content: Accurately identifies title, extremes (Taiwan 68% in <7nm; China 39% in >28nm), and the overarching relationship.",
        "Oral Fluency: Continuous, unhesitating delivery over 30–38 seconds at a steady pace.",
        "Pronunciation: Clear articulation of percentages, technical categories, and comparative connectors.",
      ],
    },
    answer: {
      sample:
        "The table illustrates the regional distribution of global semiconductor manufacturing capacity across three technological tiers in 2025. The most striking feature is the heavy geographic concentration in advanced logic chips under seven nanometres, where Taiwan dominates with 68 percent of global capacity, followed by South Korea at 24 percent, leaving all other regions below 8 percent. Conversely, in legacy nodes above 28 nanometres, capacity is much more dispersed, with Mainland China leading at 39 percent and the United States and Europe accounting for 20 percent. Overall, the data indicates that as chip fabrication technology becomes more advanced, production becomes increasingly concentrated in East Asia.",
    },
    rationale:
      "A high-scoring PTE Describe Image response follows a 4-part template (Title/Introduction -> Maximum/Key Feature -> Contrast/Minimum -> Concluding Implication) spoken smoothly without fillers.",
    extras: {
      whyCorrect:
        "The response captures the macro contrast between advanced nodes (dominated by Taiwan at 68%) and legacy nodes (led by Mainland China at 39%) and finishes with an analytical conclusion.",
      strategy:
        "Do not attempt to read all 15 cells in 40 seconds; select the two most polarized columns (<7 nm vs. >28 nm) and finish with an 'Overall, the data indicates...' sentence by 35 seconds.",
      keyTakeaway:
        "Oral Fluency and Pronunciation carry substantial weight in PTE Describe Image—maintain steady momentum even if you simplify minor figures.",
      relatedTopics: ["PTE Describe Image Structure", "Summarizing Comparative Tables", "Eliminating Hesitation Fillers"],
    },
    tags: ["pte-academic", "speaking", "describe-image"],
  },
  {
    exam: "pte-academic",
    category: "Speaking and Writing",
    topic: "Essay",
    subtopic: "Algorithmic Decision-Making in Recruitment and Lending",
    type: "writing",
    difficulty: "difficult",
    stem: "You will have 20 minutes to plan, write and revise an essay about the topic below. Your response will be judged on how well you develop a position, organize your ideas, present supporting details, and control the elements of standard written English.",
    content: {
      prompt:
        "Increasingly, corporations and financial institutions rely on automated artificial intelligence algorithms rather than human managers to screen job applicants and approve bank loans. To what extent do the efficiency benefits of algorithmic decision-making outweigh the risks of bias and lack of transparency? Write 200–300 words.",
      minWords: 200,
      maxWords: 300,
      taskLabel: "PTE Academic Write Essay (200–300 words)",
      rubric: [
        "Content & Form: Fully addresses the prompt strictly within the 200–300 word range (ideal target: 230–270 words).",
        "Development, Structure and Coherence: Clear four-paragraph structure (Introduction, Benefits/Concession, Risks/Core Argument, Conclusion).",
        "Grammar & General Linguistic Range: Uses subordinate clauses, participle phrases, and nominalization accurately.",
        "Vocabulary & Spelling: Employs precise academic vocabulary with zero spelling mistakes.",
      ],
    },
    answer: {
      sample:
        "The rapid deployment of automated algorithms in corporate recruitment and retail banking has transformed how high-stakes economic opportunities are allocated. While algorithmic screening undeniably accelerates administrative processing, I contend that its efficiency gains do not outweigh the profound dangers of historical bias amplification and opaque decision-making unless strict human oversight is enforced.\n\nAdmittedly, automated evaluation systems offer compelling operational advantages. Large employers and commercial lenders routinely process tens of thousands of applications each week—a volume that easily overwhelms human reviewers. Machine-learning models can evaluate credit histories or resume keywords in milliseconds, reducing administrative costs and eliminating inconsistent human fatigue or mood fluctuations. When properly calibrated, standardized models can also apply uniform criteria across all applicants.\n\nNevertheless, the presumption that algorithms are inherently objective is deeply flawed. Because predictive models are trained on historical datasets, they frequently encode and perpetuate past socioeconomic disparities. For instance, a recruitment algorithm trained on a historically male-dominated engineering workforce may inadvertently penalize female candidates, while credit-scoring models may use postal codes as proxies for demographic background. Even more concerning is the 'black-box' nature of deep-learning architectures: rejected applicants rarely receive an intelligible explanation of why they were denied a livelihood or a mortgage, stripping citizens of meaningful recourse.\n\nIn conclusion, speed and cost reduction cannot justify unexamined algorithmic governance in life-altering domains. Organizations should utilize artificial intelligence only as a transparent preliminary decision-support tool, ensuring that final judgments remain subject to independent auditing and accountable human review.",
    },
    rationale:
      "The essay hits the optimal ~250-word sweet spot for PTE Academic, balances concession and rebuttal paragraphs, and showcases high-scoring academic collocations.",
    extras: {
      whyCorrect:
        "At 248 words, the response satisfies PTE's strict Form constraint (200–300 words) while demonstrating complex syntactic variety ('Admittedly,...', 'Even more concerning is...').",
      strategy:
        "Always leave 2 minutes at the end of the 20-minute timer to proofread for typographical errors, as PTE's automated scoring penalizes even a single misspelled word in the Spelling sub-score.",
      keyTakeaway:
        "Stay strictly between 200 and 300 words—responses under 200 or over 300 words lose Form marks automatically.",
      relatedTopics: ["PTE Essay Word-Count Form Rules", "Academic Collocations", "Concession-Rebuttal Paragraphing"],
    },
    tags: ["pte-academic", "writing", "essay"],
  },
  {
    exam: "pte-academic",
    category: "Reading",
    topic: "Reorder paragraphs",
    subtopic: "The Discovery of Deep-Sea Hydrothermal Vents",
    type: "ordered",
    difficulty: "moderate",
    stem: "The text boxes below have been placed in a random order. Restore the original order by arranging the sentences into a cohesive academic paragraph.",
    content: {
      items: [
        {
          id: "s1",
          text: "For most of the twentieth century, marine biologists assumed that all complex life on Earth ultimately depended on solar energy captured through surface photosynthesis.",
        },
        {
          id: "s2",
          text: "That paradigm was shattered in 1977 when oceanographers aboard the submersible Alvin explored the Galápagos Rift at a depth of 2,500 metres, far below the reach of sunlight.",
        },
        {
          id: "s3",
          text: "Clustered around superheated mineral chimneys there, researchers discovered thriving ecosystems of giant tube worms, blind shrimp, and bivalves.",
        },
        {
          id: "s4",
          text: "Subsequent biochemical analysis revealed that these communities were sustained not by marine snow from above, but by chemosynthetic bacteria oxidizing hydrogen sulfide emitted from the vents.",
        },
      ],
    },
    answer: {
      order: ["s1", "s2", "s3", "s4"],
    },
    rationale:
      "Sentence s1 introduces the broad historical assumption ('For most of the twentieth century...'). Sentence s2 refers back to s1 via 'That paradigm was shattered in 1977...'. Sentence s3 uses 'there' to refer to the Galápagos Rift vents introduced in s2. Sentence s4 uses 'these communities' to refer to the tube worms, shrimp, and bivalves introduced in s3.",
    extras: {
      whyCorrect:
        "Each adjacent pair is bound by an explicit referential anchor: 'solar energy assumption' -> 'That paradigm' (s1-s2); 'Galápagos Rift' -> 'there' (s2-s3); 'giant tube worms, blind shrimp, and bivalves' -> 'these communities' (s3-s4).",
      strategy:
        "In PTE Reorder Paragraphs, you earn 1 point for every correct adjacent pair. First find the standalone topic sentence (no backward pronouns), then chain demonstrative pronouns ('That paradigm', 'there', 'these communities').",
      keyTakeaway:
        "Cohesive reference links (demonstratives, adverbs of place, and chronological markers) dictate the unique logical sequence.",
      relatedTopics: ["Anaphoric Reference Chains", "Topic Sentence Identification", "PTE Adjacent-Pair Scoring"],
    },
    tags: ["pte-academic", "reading", "reorder-paragraphs"],
  },
  {
    exam: "pte-academic",
    category: "Reading",
    topic: "Fill in the blanks",
    subtopic: "Epigenetics and Environmental Plasticity",
    type: "cloze",
    difficulty: "moderate",
    stem: "In the text below, some words are missing. Select the most appropriate word from each drop-down box to complete the academic text.",
    content: {
      template:
        "While classical genetics focused almost exclusively on alterations to the underlying DNA nucleotide sequence, the rapidly expanding field of epigenetics examines how environmental exposures can {{b1}} gene expression without mutating the genetic code itself. Chemical tags such as methyl groups attach to cytosine bases or histone proteins, effectively acting as molecular dimmers that {{b2}} whether a specific gene is transcribed or silenced. Intriguingly, longitudinal cohort studies suggest that certain epigenetic modifications induced by severe nutritional {{b3}} may even persist across cell divisions.",
      blanks: {
        b1: [
          { id: "modulate", text: "modulate" },
          { id: "eradicate", text: "eradicate" },
          { id: "fabricate", text: "fabricate" },
          { id: "consolidate", text: "consolidate" },
        ],
        b2: [
          { id: "govern", text: "govern" },
          { id: "comply", text: "comply" },
          { id: "evade", text: "evade" },
          { id: "subside", text: "subside" },
        ],
        b3: [
          { id: "deprivation", text: "deprivation" },
          { id: "prosperity", text: "prosperity" },
          { id: "redundancy", text: "redundancy" },
          { id: "complacency", text: "complacency" },
        ],
      },
    },
    answer: {
      blanks: {
        b1: "modulate",
        b2: "govern",
        b3: "deprivation",
      },
    },
    rationale:
      "'Modulate gene expression' is the standard biological collocation for regulating transcriptional activity; 'govern whether a specific gene is transcribed' fits the transitive verb requirement for 'molecular dimmers'; and 'severe nutritional deprivation' is the established collocation in epigenetic famine/cohort studies.",
    extras: {
      whyCorrect:
        "All three answers reflect high-frequency academic collocations ('modulate gene expression', 'govern whether...', 'nutritional deprivation').",
      strategy:
        "Check both collocation pairing with the adjacent noun ('gene expression', 'nutritional ___') and verb transitivity ('govern whether...' vs. intransitive 'comply' or 'subside').",
      keyTakeaway:
        "Mastering academic collocation lists (ACL) is the highest-yield preparation for PTE Reading & Writing Fill in the Blanks.",
      relatedTopics: ["Academic Collocations", "Verb Transitivity", "Context Clues in Scientific Prose"],
    },
    tags: ["pte-academic", "reading", "cloze"],
  },
  {
    exam: "pte-academic",
    category: "Listening",
    topic: "Highlight incorrect words",
    subtopic: "Central Bank Monetary Policy Transmission",
    type: "highlight",
    difficulty: "moderate",
    exhibit: {
      kind: "passage",
      title: "Audio Recording Reference (What the Lecturer Actually Spoke)",
      text: "When a central bank raises its benchmark overnight interest rate to curb inflationary pressures, the policy does not cool consumer demand instantaneously. Instead, the adjustment ripples through commercial lending markets with a variable lag of twelve to eighteen months, gradually increasing mortgage servicing costs and discouraging speculative corporate borrowing.",
    },
    stem: "Read the written transcript below while comparing it to the spoken audio recording reference. Click on the words in the transcript that differ from what the speaker actually said.",
    content: {
      segments: [
        { id: "seg1", text: "When a central bank raises its benchmark overnight interest rate to " },
        { id: "seg2", text: "accelerate", selectable: true },
        { id: "seg3", text: " inflationary pressures, the policy does not cool " },
        { id: "seg4", text: "consumer", selectable: true },
        { id: "seg5", text: " demand instantaneously. Instead, the adjustment ripples through " },
        { id: "seg6", text: "agricultural", selectable: true },
        { id: "seg7", text: " lending markets with a variable lag of twelve to eighteen months, gradually increasing mortgage " },
        { id: "seg8", text: "servicing", selectable: true },
        { id: "seg9", text: " costs and discouraging " },
        { id: "seg10", text: "mandatory", selectable: true },
        { id: "seg11", text: " corporate borrowing." },
      ],
    },
    answer: {
      correct: ["seg2", "seg6", "seg10"],
    },
    rationale:
      "Comparing the transcript against the spoken audio reference reveals three discrepancies: 'accelerate' (spoken: 'curb'), 'agricultural' (spoken: 'commercial'), and 'mandatory' (spoken: 'speculative'). 'consumer' (seg4) and 'servicing' (seg8) match the audio exactly.",
    extras: {
      whyCorrect:
        "Segments seg2 ('accelerate' vs. 'curb'), seg6 ('agricultural' vs. 'commercial'), and seg10 ('mandatory' vs. 'speculative') are the three altered content words.",
      strategy:
        "In PTE Highlight Incorrect Words, negative scoring applies (-1 for each wrong click, down to 0 minimum). Track the text with your cursor at the speaker's exact pace and click only when you hear a definite phonological mismatch.",
      keyTakeaway:
        "Replacement words in PTE Highlight Incorrect Words always belong to the same grammatical part of speech (verb for verb, adjective for adjective).",
      relatedTopics: ["PTE Negative Scoring Strategy", "Phonological Tracking", "Listening-Reading Synchronization"],
    },
    tags: ["pte-academic", "listening", "highlight"],
  },

  /* ================================================================== */
  /* 6. TOEFL iBT ("toefl-ibt")                                         */
  /* ================================================================== */
  {
    exam: "toefl-ibt",
    category: "Reading",
    topic: "Academic passages",
    subtopic: "Systems Collapse in the Late Bronze Age Mediterranean",
    type: "mcq",
    difficulty: "difficult",
    exhibit: {
      kind: "passage",
      title: "The Late Bronze Age Collapse in the Eastern Mediterranean",
      text: "Between roughly 1200 and 1150 BCE, the tightly interconnected palatial civilizations of the Eastern Mediterranean—including the Mycenaean kingdoms of Greece, the Hittite Empire in Anatolia, and the levantine city-states such as Ugarit—experienced a catastrophic and nearly synchronous systemic collapse. For decades, twentieth-century historians attributed this upheaval almost exclusively to external military invasions by a coalition of seafaring raiders referred to in Egyptian inscriptions of Ramesses III as the 'Sea Peoples'.\n\nRecent archaeometric and paleoclimatic investigations, however, have replaced this single-cause invasion model with a 'systems-collapse' framework. High-resolution pollen cores from Cyprus and the Sea of Galilee, paired with oxygen-isotope records from speleothems, document a severe, multi-decade megadrought across the region beginning around 1200 BCE. At the same time, the Mycenaean and Hittite palatial economies were hyper-specialized, centrally administered redistributive networks that depended on uninterrupted long-distance maritime trade for tin and copper to alloy bronze. When prolonged agricultural failure triggered internal famines, peasant revolts, and refugee migrations, the disruption of even a few maritime trade nodes cascaded rapidly across the entire diplomatic and metallurgical network, rendering the top-heavy palace bureaucracies brittle and unable to recover.",
    },
    stem: "According to paragraph 2, why did localized disruptions in the Eastern Mediterranean around 1200 BCE lead to the downfall of entire civilizations rather than remaining isolated crises?",
    content: {
      options: [
        { id: "a", text: "The Mycenaean and Hittite rulers had already dismantled their centralized bureaucracies prior to the onset of the megadrought." },
        { id: "b", text: "The palatial economies were so rigidly specialized and mutually dependent on long-distance trade that failures in one area triggered a chain reaction." },
        { id: "c", text: "Egyptian Pharaoh Ramesses III imposed a naval blockade that prevented Cyprus and Ugarit from exporting agricultural surpluses." },
        { id: "d", text: "Natural tin and copper deposits in Anatolia were completely exhausted by 1200 BCE, halting all bronze weapon production." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Paragraph 2 explains that the palatial economies were 'hyper-specialized, centrally administered redistributive networks that depended on uninterrupted long-distance maritime trade,' so disruptions at a few nodes 'cascaded rapidly across the entire diplomatic and metallurgical network.'",
    optionExplanations: {
      a: "Incorrect. The passage describes the palace bureaucracies as 'top-heavy' and 'centrally administered', not dismantled prior to the drought.",
      b: "Correct. Their hyper-specialization and dependence on long-distance trade meant localized failures cascaded across the entire interconnected system.",
      c: "Incorrect. Ramesses III is mentioned in paragraph 1 only in reference to inscriptions naming the 'Sea Peoples'.",
      d: "Incorrect. It was the maritime trade network transporting tin and copper that was disrupted, not geological exhaustion of Anatolian mines.",
    },
    extras: {
      whyCorrect:
        "The phrase 'cascaded rapidly across the entire diplomatic and metallurgical network' directly paraphrases 'failures in one area triggered a chain reaction.'",
      strategy:
        "In TOEFL Reading factual-explanation items, trace the causal chain in the target paragraph and avoid options that import terms from another paragraph (like Ramesses III from paragraph 1).",
      keyTakeaway:
        "Systems-collapse passages frequently test the interaction between environmental stressors (megadrought) and structural vulnerability (hyper-specialization).",
      relatedTopics: ["TOEFL Factual Information Questions", "Causal Chain Analysis", "Eliminating Cross-Paragraph Distractors"],
    },
    tags: ["toefl-ibt", "reading", "academic-passage"],
  },
  {
    exam: "toefl-ibt",
    category: "Listening",
    topic: "Lectures",
    subtopic: "Exoplanet Detection: Radial Velocity vs. Transit Photometry",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "Audio Extract (Astronomy Lecture):Professor: 'Now, when astronomers use the radial velocity method—measuring the tiny Doppler shift in a star's spectral lines caused by an orbiting planet's gravitational tug—we obtain the planet's minimum mass, but we have no idea how wide the planet actually is. Conversely, the transit photometry method—watching a planet cross directly in front of its host star's disk and measuring the fractional dip in stellar brightness—gives us the planet's physical radius, yet tells us nothing about its mass. That is why finding an exoplanet that can be observed by both methods is the gold standard in planetary astrophysics: once you combine mass from radial velocity with volume derived from the transit radius, you can calculate the planet's bulk density and determine whether it's a rocky super-Earth or a gas-rich mini-Neptune.'",
    stem: "Why does the professor consider observing the same exoplanet with both the radial velocity method and the transit photometry method to be the 'gold standard'?",
    content: {
      options: [
        { id: "a", text: "Combining the measurements from both techniques allows astronomers to calculate the exoplanet's bulk density and infer its composition." },
        { id: "b", text: "The transit photometry method corrects for systematic Doppler errors in the host star's spectral lines." },
        { id: "c", text: "Using both methods enables telescopes to detect exoplanets whose orbits never cross the face of their host star." },
        { id: "d", text: "Radial velocity measurements can only detect gas giants, whereas transit photometry can only detect rocky planets." },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "The professor explains that radial velocity yields mass while transit photometry yields radius (volume); combining both enables astronomers to compute bulk density and distinguish rocky super-Earths from gaseous mini-Neptunes.",
    optionExplanations: {
      a: "Correct. Mass (radial velocity) + radius/volume (transit photometry) = bulk density, which reveals internal composition.",
      b: "Incorrect. Transit photometry measures brightness dips to find radius, not Doppler spectral corrections.",
      c: "Incorrect. Transit photometry requires the planet's orbit to cross directly in front of the star's disk.",
      d: "Incorrect. Both methods are applied to the same planet to determine whether it is rocky or gaseous.",
    },
    extras: {
      whyCorrect:
        "The professor explicitly defines the 'gold standard' after the colon: 'once you combine mass from radial velocity with volume derived from the transit radius, you can calculate the planet's bulk density...'.",
      strategy:
        "When a TOEFL lecturer compares two scientific methods (Method A vs. Method B), pay attention to what each measures individually and what emergent property is unlocked by combining them.",
      keyTakeaway:
        "Comparative lecture structures in TOEFL Listening almost always culminate in a synthesis question.",
      relatedTopics: ["TOEFL Lecture Organization", "Comparative Scientific Methods", "Note-Taking for Contrast"],
    },
    tags: ["toefl-ibt", "listening", "astronomy-lecture"],
  },
  {
    exam: "toefl-ibt",
    category: "Speaking",
    topic: "Independent",
    subtopic: "Interdisciplinary Broad Exploration vs. Early Specialization",
    type: "speaking",
    difficulty: "moderate",
    stem: "Prepare your response in 15 seconds and speak for 45 seconds on the TOEFL Independent Speaking question below.",
    content: {
      prompt:
        "Some universities require first-year undergraduate students to take a broad range of general education courses across the humanities, social sciences, and natural sciences before declaring a major. Other universities allow students to take courses exclusively within their chosen major from their very first semester. Which approach do you think is better for university students, and why?",
      prepSeconds: 15,
      speakSeconds: 45,
      cueCard: [
        "State a clear preference in the first sentence.",
        "Provide Reason 1 with a brief concrete example (e.g., discovering unexpected passions or preventing premature lock-in).",
        "Provide Reason 2 (e.g., cross-disciplinary problem-solving in modern careers).",
      ],
      rubric: [
        "Delivery: Fluid pacing, clear pronunciation, and natural intonation within the strict 45-second window.",
        "Language Use: Effective complex sentence structures and accurate academic vocabulary.",
        "Topic Development: Direct thesis supported by at least one well-developed concrete example or two tightly linked reasons.",
      ],
    },
    answer: {
      sample:
        "I strongly believe that requiring first-year students to complete a broad range of general education courses is far more beneficial than immediate specialization. First of all, most eighteen-year-olds enter university with very limited exposure to fields outside high school curricula. For instance, when I took a mandatory introductory linguistics seminar in my first semester, I discovered an analytical passion for computational language processing that completely reshaped my career path. Second, modern professional challenges rarely fit neatly inside a single academic silo. An engineering graduate who has also studied ethics and economics will design much more socially responsible technologies than someone trained exclusively in technical equations.",
    },
    rationale:
      "At ~105 words (roughly 43 seconds at natural speaking speed), this response immediately states a position and supports it with a specific personal illustration and a career-relevance argument.",
    extras: {
      whyCorrect:
        "The response wastes zero time restating the prompt word-for-word, jumping immediately into the claim ('I strongly believe that...') and backing it with two crisp, concrete arguments.",
      strategy:
        "In a 45-second TOEFL Independent Speaking turn, aim for ~100–115 words: 1 sentence for your thesis, 2–3 sentences for Reason 1 + Example, and 2 sentences for Reason 2.",
      keyTakeaway:
        "Concrete specificity ('introductory linguistics seminar') scores much higher on Topic Development than repetitive generalizations.",
      relatedTopics: ["TOEFL Speaking Task 1 Pacing", "15-Second Note-Taking Template", "Concrete Exemplification"],
    },
    tags: ["toefl-ibt", "speaking", "independent"],
  },
  {
    exam: "toefl-ibt",
    category: "Writing",
    topic: "Academic discussion",
    subtopic: "Congestion Pricing in Metropolitan Centres",
    type: "writing",
    difficulty: "moderate",
    exhibit: {
      kind: "passage",
      title: "Urban Policy Seminar — Online Discussion Board",
      text: "Professor Gupta: This week we are examining urban transportation externalities. Several major cities have implemented 'congestion pricing'—charging private motorists an electronic toll of $10 to $15 whenever they drive into the central business district during peak weekday hours. Do you think congestion pricing is an effective and fair policy for modern cities to adopt? Why or why not?\n\nLiam: I support congestion pricing because road space in downtown cores is a scarce public resource. In cities like London and Stockholm, charging a peak toll cut traffic delays by over 20%, lowered particulate air pollution, and generated hundreds of millions of dollars to upgrade public buses and subway lines.\n\nElena: While reducing traffic sounds appealing, congestion pricing is essentially a regressive tax on working-class commuters. Wealthy executives can easily afford a $15 daily toll without changing their habits, whereas shift workers—like nurses or restaurant staff who live in outer suburbs poorly served by transit—are forced to pay a huge share of their income just to get to work.",
    },
    stem: "Write a post responding to Professor Gupta's question. In your response, express and support your personal opinion and make a contribution to the discussion in your own words. An effective response will contain at least 100 words.",
    content: {
      prompt:
        "Write an academic discussion post (at least 100 words within a 10-minute target) that engages with the seminar debate on urban congestion pricing and advances a well-reasoned position.",
      minWords: 100,
      taskLabel: "TOEFL iBT Writing for an Academic Discussion",
      rubric: [
        "Relevant & Original Contribution: Goes beyond merely repeating Liam or Elena by introducing a distinct policy refinement or analytical angle.",
        "Elaboration & Support: Explains the mechanism behind the argument with concrete reasoning.",
        "Syntactic Variety & Lexical Precision: Uses academic register, varied clause structures, and accurate transitions.",
      ],
    },
    answer: {
      sample:
        "I believe congestion pricing is an indispensable tool for sustainable urban management, provided that cities pair the toll with targeted equity exemptions and upfront transit investment. While Elena raises a valid concern regarding the financial burden on outer-suburb shift workers, abandoning road pricing altogether actually harms lower-income residents even more, since the vast majority of working-class commuters rely on municipal buses that get trapped in private-car gridlock.\n\nRather than rejecting congestion pricing, municipalities can eliminate its regressive impact through smart policy design. First, tolls should apply strictly during standard daytime rush hours, exempting overnight hospital or hospitality workers traveling when transit frequency is low. Second, as Liam noted, hypothecating 100% of toll revenues into expanding express bus lanes and subsidizing low-income transit passes ensures that commuters have a fast, affordable alternative before the charges take effect.",
    },
    rationale:
      "A top-scoring TOEFL Academic Discussion post (5/5) engages directly with a classmate's point ('While Elena raises a valid concern...'), introduces a new counter-insight (working-class bus riders suffer most from car congestion), and proposes specific policy mechanisms.",
    extras: {
      whyCorrect:
        "At ~145 words, the response synthesizes the classmates' tension and advances the conversation with two concrete policy refinements (time-of-day exemptions and upfront bus-lane hypothecation).",
      strategy:
        "Aim for 130–160 words in the 10-minute TOEFL Academic Discussion task: acknowledge one student's point in 1–2 sentences, then dedicate 80% of your post to your own unique argument.",
      keyTakeaway:
        "Never spend half your post summarizing both students; the rubric rewards original contribution to the seminar.",
      relatedTopics: ["TOEFL Academic Discussion Rubric", "Synthesizing Peer Arguments", "Urban Economics Vocabulary"],
    },
    tags: ["toefl-ibt", "writing", "academic-discussion"],
  },

  /* ================================================================== */
  /* 7. MCAT ("mcat")                                                   */
  /* ================================================================== */
  {
    exam: "mcat",
    category: "Chemical and Physical Foundations",
    subject: "General Chemistry",
    topic: "Acid-Base Equilibria and Buffers",
    subtopic: "Henderson-Hasselbalch Equation and Physiological Buffering",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "A biochemist prepares an aqueous phosphate buffer at 25°C to assay a cytosolic kinase. The acid dissociation constants for phosphoric acid (H3PO4) at 25°C are pKa1 = 2.15, pKa2 = 7.20, and pKa3 = 12.35. The researcher mixes 0.040 mol of NaH2PO4 and 0.40 mol of Na2HPO4 in sufficient deionized water to yield a final solution volume of 1.00 L.",
    stem: "What is the approximate pH of the resulting buffer solution, and how will the buffer capacity change if the solution is diluted tenfold with pure water?",
    content: {
      options: [
        { id: "a", text: "pH = 6.20; buffer capacity decreases upon tenfold dilution" },
        { id: "b", text: "pH = 8.20; buffer capacity decreases upon tenfold dilution" },
        { id: "c", text: "pH = 8.20; buffer capacity remains unchanged upon tenfold dilution" },
        { id: "d", text: "pH = 7.20; buffer capacity increases upon tenfold dilution" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The conjugate acid/base pair is H2PO4- (0.040 M) and HPO4^2- (0.40 M), which corresponds to the second dissociation step (pKa2 = 7.20). By the Henderson-Hasselbalch equation: pH = pKa2 + log10([HPO4^2-]/[H2PO4-]) = 7.20 + log10(0.40 / 0.040) = 7.20 + log10(10) = 7.20 + 1.00 = 8.20. While moderate dilution leaves the [A-]/[HA] ratio (and thus pH) nearly constant, buffer capacity depends on the absolute molar concentrations of HA and A-, so tenfold dilution reduces buffer capacity.",
    optionExplanations: {
      a: "Incorrect. A pH of 6.20 results from inverting the conjugate base-to-acid ratio ([HA]/[A-] instead of [A-]/[HA]).",
      b: "Correct. [HPO4^2-]/[H2PO4-] = 10 gives pH = 7.20 + 1.00 = 8.20, and reducing total solute molarity tenfold lowers the moles available to neutralize added H+ or OH-.",
      c: "Incorrect. Although pH remains approximately constant upon moderate dilution, buffer capacity is directly proportional to total buffer concentration.",
      d: "Incorrect. Equal molar amounts of H2PO4- and HPO4^2- would yield pH 7.20, and dilution never increases buffer capacity.",
    },
    extras: {
      whyCorrect:
        "Because the conjugate base (Na2HPO4, 0.40 M) is present at 10 times the concentration of the weak acid (NaH2PO4, 0.040 M), the pH is exactly 1.00 unit above pKa2 (7.20 + 1.00 = 8.20), and lowering total concentration decreases buffering capacity.",
      strategy:
        "For polyprotic buffers on the MCAT, first match the two species in the mixture (H2PO4- and HPO4^2-) to the specific proton transfer step (pKa2 = 7.20), then check whether [base] > [acid] (pH > pKa).",
      keyTakeaway:
        "Buffer pH depends on the ratio [A-]/[HA], whereas buffer capacity depends on the absolute concentrations of [A-] and [HA].",
      relatedTopics: ["Henderson-Hasselbalch Equation", "Polyprotic Acid Titration", "Buffer Capacity vs. Buffer pH"],
    },
    tags: ["mcat", "chem-phys", "buffers"],
  },
  {
    exam: "mcat",
    category: "Chemical and Physical Foundations",
    subject: "Physics",
    topic: "Fluid Mechanics and Hemodynamics",
    subtopic: "Poiseuille's Law and Arteriolar Vasoconstriction",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "Assume laminar flow of an incompressible Newtonian fluid through a rigid cylindrical vessel of length L and internal radius r. According to Poiseuille's law, the volumetric flow rate Q across a pressure gradient ΔP is given by Q = (π · r^4 · ΔP) / (8 · η · L), where η is dynamic viscosity.",
    stem: "If sympathetic adrenergic stimulation causes a uniform 20% reduction in the internal radius of an arteriole (such that the new radius is 0.80r) while vessel length and blood viscosity remain constant, by what factor must the pressure drop ΔP across the arteriole increase to maintain the same volumetric flow rate Q?",
    content: {
      options: [
        { id: "a", text: "1.25" },
        { id: "b", text: "1.56" },
        { id: "c", text: "2.44" },
        { id: "d", text: "5.00" },
      ],
    },
    answer: { correct: "c" },
    rationale:
      "By Poiseuille's law, Q ∝ r^4 · ΔP. When radius decreases to r_new = 0.80r = (4/5)r, the fourth power of the radius changes by (0.80)^4 = 0.4096 (or 256/625). To keep Q constant, ΔP must increase by a factor of 1 / (0.80)^4 = 1 / 0.4096 ≈ 2.44 (or 625/256 ≈ 2.441).",
    optionExplanations: {
      a: "Incorrect. 1.25 is 1 / 0.80, which assumes a linear relationship between radius and flow rather than an r^4 dependence.",
      b: "Incorrect. 1.56 is 1 / (0.80)^2, which corresponds to cross-sectional area (continuity equation) rather than Poiseuille resistance.",
      c: "Correct. Because hydraulic resistance R ∝ 1/r^4, reducing r to 0.80r increases resistance by 1/(0.80)^4 = 1/0.4096 ≈ 2.44.",
      d: "Incorrect. A factor of 5.00 results from dividing 1 by the 0.20 fractional reduction.",
    },
    extras: {
      whyCorrect:
        "Converting 0.80 to the fraction 4/5 makes mental calculation fast: (4/5)^4 = 256/625, so the reciprocal factor is 625/256 ≈ 2.44.",
      strategy:
        "On calculator-free MCAT physics questions, express decimals as simple fractions (0.80 = 4/5) before raising them to powers: (5/4)^4 = 625/256 ≈ 2.44.",
      keyTakeaway:
        "Because flow resistance scales inversely with the fourth power of radius (R ∝ 1/r^4), even minor arteriolar constriction dramatically increases vascular resistance.",
      relatedTopics: ["Poiseuille's Law", "Vascular Resistance", "Continuity Equation vs. Laminar Flow"],
    },
    tags: ["mcat", "chem-phys", "fluids"],
  },
  {
    exam: "mcat",
    category: "Critical Analysis and Reasoning Skills",
    subject: "CARS",
    topic: "Humanities and Architectural Criticism",
    subtopic: "Preservation, Decay, and Historical Authenticity",
    type: "mcq",
    difficulty: "difficult",
    exhibit: {
      kind: "passage",
      title: "Architecture, Memory, and the Paradox of Preservation",
      text: "In nineteenth-century architectural theory, two irreconcilable philosophies collided over the fate of medieval monuments. Viollet-le-Duc championed 'stylistic restoration,' arguing that to restore an edifice is not merely to repair or maintain it, but to re-establish it in a finished state of ideal completeness that may never have actually existed at any single historical moment. Under this doctrine, restoration architects felt licensed to demolish later Renaissance additions from a Gothic cathedral and fabricate pristine neo-Gothic spires that harmonized with their theoretical reconstruction of twelfth-century intent.\n\nJohn Ruskin recoiled from such interventions, pronouncing restoration 'the most total destruction which a building can suffer.' For Ruskin, the moral and historical vitality of architecture resided not in geometric perfection, but in the physical patina of time—the weather-worn limestone, the smoke-darkened vaults, and the irregular tool marks of long-deceased masons. To scrape away weathered stone and substitute newly chiselled replicas was, in Ruskin's view, to replace an authentic historical witness with a nineteenth-century forgery. A building ought to be braced with timber or iron props to delay its collapse, Ruskin conceded, yet ultimately allowed to age and perish with dignity rather than be embalmed in counterfeit youth.",
    },
    stem: "Suppose a municipal heritage board discovers a Roman aqueduct whose central arches were patched with brick during the seventeenth century. Which course of action would be most consistent with Ruskin's philosophy as presented in the passage?",
    content: {
      options: [
        { id: "a", text: "Removing the seventeenth-century brickwork and reconstructing the arches using freshly quarried travertine cut to original Roman specifications" },
        { id: "b", text: "Installing unobtrusive structural supports to stabilize the existing masonry while leaving both the weathered Roman stone and seventeenth-century brick intact" },
        { id: "c", text: "Extending the aqueduct with newly designed arches that realize the mathematical symmetry envisioned by classical Roman engineers" },
        { id: "d", text: "Dismantling the weakened arches immediately so that the monument's collapse occurs under controlled municipal supervision" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Paragraph 2 explains that Ruskin valued the cumulative physical trace of time across history, opposed removing later features or substituting newly chiselled replicas, and endorsed bracing a structure 'with timber or iron props to delay its collapse' while preserving its authentic historical layers.",
    optionExplanations: {
      a: "Incorrect. Demolishing later additions and fabricating pristine period replicas reflects Viollet-le-Duc's 'stylistic restoration,' which Ruskin condemned as forgery.",
      b: "Correct. Ruskin explicitly conceded that a building should be braced structurally to delay collapse while retaining its authentic weathered surfaces and historical layers.",
      c: "Incorrect. Completing an edifice to an idealized state of completeness is Viollet-le-Duc's doctrine.",
      d: "Incorrect. Ruskin advocated delaying collapse via structural props, not actively dismantling monuments.",
    },
    extras: {
      whyCorrect:
        "Ruskin's position balances non-falsification of historical material (retaining the weathered stone and historical layers) with practical structural stabilization ('braced with timber or iron props to delay its collapse').",
      strategy:
        "In MCAT CARS 'Reasoning Beyond the Text' questions, map each answer choice against the specific philosopher requested (Ruskin vs. Viollet-le-Duc); the most common trap is an answer that perfectly reflects the rival thinker.",
      keyTakeaway:
        "Reasoning Beyond the Text requires applying the author's or cited thinker's explicit principles to a novel scenario without overextending them.",
      relatedTopics: ["MCAT CARS Reasoning Beyond the Text", "Comparative Philosophical Frameworks", "Authorial Attribution"],
    },
    tags: ["mcat", "cars", "passage-based"],
  },
  {
    exam: "mcat",
    category: "Biological and Biochemical Foundations",
    subject: "Biochemistry",
    topic: "Enzyme Kinetics and Inhibition",
    subtopic: "Uncompetitive vs. Mixed and Noncompetitive Inhibition",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "An enzymologist characterizes a novel small-molecule modulator, Compound X, against human dihydrofolate reductase. When steady-state initial velocities (v0) are plotted on a double-reciprocal (Lineweaver-Burk) graph of 1/v0 versus 1/[S] at increasing concentrations of Compound X, the researcher observes a series of parallel lines with identical slopes (Km/Vmax) but progressively larger y-intercepts (1/Vmax) and more negative x-intercepts (-1/Km).",
    stem: "Based on the Lineweaver-Burk kinetic profile, which mechanism best describes the interaction of Compound X with dihydrofolate reductase?",
    content: {
      options: [
        { id: "a", text: "Compound X binds exclusively to the free enzyme active site, competing directly with dihydrofolate." },
        { id: "b", text: "Compound X binds exclusively to an allosteric site on the enzyme-substrate (ES) complex, decreasing both apparent Km and apparent Vmax equally." },
        { id: "c", text: "Compound X binds with equal affinity to both the free enzyme (E) and the enzyme-substrate (ES) complex." },
        { id: "d", text: "Compound X covalently and irreversibly inactivates a catalytic histidine residue without altering apparent Km." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Parallel lines on a Lineweaver-Burk plot indicate that the slope (Km/Vmax) remains constant while both 1/Vmax (y-intercept) increases and -1/Km (x-intercept) becomes more negative. This occurs because apparent Vmax and apparent Km are both divided by the same factor (1 + [I]/αKi)—the hallmark of uncompetitive inhibition, in which the inhibitor binds exclusively to the ES complex.",
    optionExplanations: {
      a: "Incorrect. Competitive inhibitors bind free E, increasing apparent Km while leaving Vmax unchanged (lines intersect on the y-axis).",
      b: "Correct. Uncompetitive inhibitors bind only to the ES complex, lowering both apparent Vmax and apparent Km by the same factor (1 + [I]/αKi) and yielding parallel lines on a Lineweaver-Burk plot.",
      c: "Incorrect. Pure noncompetitive inhibitors bind E and ES with equal affinity, decreasing Vmax without changing Km (lines intersect on the negative x-axis).",
      d: "Incorrect. Irreversible inactivation behaves kinetically like pure noncompetitive reduction of active enzyme concentration (unchanged Km, increased slope).",
    },
    extras: {
      whyCorrect:
        "Because slope = Km_app / Vmax_app = (Km / α') / (Vmax / α') = Km / Vmax, proportional reductions in both Km and Vmax keep the Lineweaver-Burk slope constant (parallel lines).",
      strategy:
        "Memorize the three canonical Lineweaver-Burk intersection signatures: Competitive = intersect on y-axis; Pure Noncompetitive = intersect on x-axis; Uncompetitive = parallel lines.",
      keyTakeaway:
        "Uncompetitive inhibitors bind only after substrate binding induces the ES conformation, locking the substrate in the active site (lowering apparent Km) while preventing catalysis (lowering apparent Vmax).",
      relatedTopics: ["Michaelis-Menten Kinetics", "Lineweaver-Burk Double-Reciprocal Plots", "Enzyme Inhibition Mechanisms"],
    },
    tags: ["mcat", "bio-biochem", "enzyme-kinetics"],
  },
  {
    exam: "mcat",
    category: "Psychological, Social, and Biological Foundations",
    subject: "Psychology",
    topic: "Attitude Change and Social Cognition",
    subtopic: "Festinger's Cognitive Dissonance and Insufficient Justification",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "In a replication of Festinger and Carlsmith's classic paradigm, undergraduate participants spend an hour performing an extremely repetitive spool-turning task. Afterward, the experimenter asks each participant to tell the next waiting participant that the task was exciting and engaging. Half of the participants are paid $1 to tell this falsehood, while the other half are paid $25. When subsequently surveyed by an independent departmental interviewer about their true private attitude toward the spool-turning task, one group rates the task as significantly more enjoyable.",
    stem: "According to cognitive dissonance theory, which group will report greater private enjoyment of the task, and why?",
    content: {
      options: [
        { id: "a", text: "The $25 group, because operant positive reinforcement strengthens the associative link between the task and pleasure" },
        { id: "b", text: "The $1 group, because the small external reward provides insufficient external justification for lying, motivating internal attitude alignment" },
        { id: "c", text: "The $25 group, because higher financial compensation induces peripheral-route persuasion via the elaboration likelihood model" },
        { id: "d", text: "The $1 group, because participants exhibit the fundamental attribution error by blaming the experimenter for their behaviour" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Under Festinger's cognitive dissonance theory, telling a counter-attitudinal lie creates psychological discomfort. Participants paid $25 have an obvious external justification ('I lied because I was paid $25'), so they experience little dissonance. Participants paid $1 lack sufficient external justification for deceiving a peer and resolve their dissonance by shifting their internal attitude to believe the task was actually enjoyable.",
    optionExplanations: {
      a: "Incorrect. Classic behaviorist reinforcement predicted the $25 group would like the task more, which Festinger and Carlsmith's experiment famously refuted.",
      b: "Correct. The insufficient justification effect demonstrates that small external rewards produce greater cognitive dissonance—and therefore greater internal attitude change—than large external rewards.",
      c: "Incorrect. The elaboration likelihood model describes persuasive message processing, whereas this paradigm tests counter-attitudinal behavior and self-justification.",
      d: "Incorrect. The fundamental attribution error refers to over-attributing another person's behavior to dispositional traits rather than situational factors.",
    },
    extras: {
      whyCorrect:
        "When external justification is minimal ($1), the conflict between 'I am an honest person' and 'I told a peer the task was fun' can only be resolved by changing the private belief about the task.",
      strategy:
        "On MCAT Psych/Soc questions involving counter-attitudinal behavior, distinguish between behaviorist reinforcement (larger reward = more compliance) and cognitive dissonance (smaller reward for voluntary action = greater internal attitude shift).",
      keyTakeaway:
        "The insufficient justification effect occurs when people internalize a behavior because external incentives are too small to excuse the discrepancy.",
      relatedTopics: ["Cognitive Dissonance Theory", "Insufficient Justification Effect", "Elaboration Likelihood Model"],
    },
    tags: ["mcat", "psych-soc", "cognitive-dissonance"],
  },

  /* ================================================================== */
  /* 8. SAT ("sat")                                                     */
  /* ================================================================== */
  {
    exam: "sat",
    category: "Reading and Writing",
    topic: "Craft and Structure",
    subtopic: "Cross-Text Connections",
    type: "mcq",
    difficulty: "moderate",
    exhibit: {
      kind: "passage",
      title: "Text 1 & Text 2: Avian Magnetoreception Mechanisms",
      text: "Text 1\nFor decades, sensory biologists proposed that migratory songbirds navigate across continents primarily by relying on microscopic crystals of magnetite embedded within nerve endings in their upper beaks. According to this ferromagnetism model, mechanical torque exerted by Earth's magnetic field on these iron-oxide particles deforms adjacent cell membranes, opening ion channels that transmit compass bearings directly to the trigeminal nerve.\n\nText 2\nWorking with European robins (Erithacus rubecula), Henrik Mouritsen and colleagues demonstrated that migratory orientation depends on blue-light-activated cryptochrome-4 proteins concentrated in the birds' retinas. When exposed to oscillating radiofrequency fields that disrupt quantum radical-pair spin states in cryptochrome-4—or when deprived of short-wavelength blue light—the robins lost their directional compass entirely, even though surgical sectioning of the trigeminal beak nerve left their magnetic orientation completely intact.",
    },
    stem: "Based on the texts, how would Mouritsen and colleagues (Text 2) most likely respond to the ferromagnetism model described in Text 1?",
    content: {
      options: [
        { id: "a", text: "By arguing that European robins rely on trigeminal magnetite crystals only during daytime flights when blue light is abundant" },
        { id: "b", text: "By contending that magnetic compass orientation in migratory songbirds is mediated by light-dependent retinal proteins rather than beak-innervated magnetite receptors" },
        { id: "c", text: "By conceding that cryptochrome-4 proteins require mechanical torque from iron-oxide particles in order to form radical pairs" },
        { id: "d", text: "By suggesting that migratory songbirds do not possess a biological magnetic compass and instead navigate solely by starlight" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Text 1 attributes the avian magnetic compass to magnetite crystals signaling through the trigeminal beak nerve. Text 2 refutes this mechanism by showing that severing the trigeminal nerve leaves magnetic orientation intact, whereas disrupting retinal cryptochrome-4 or removing blue light abolishes the compass.",
    optionExplanations: {
      a: "Incorrect. Text 2 notes that severing the trigeminal nerve leaves orientation intact, showing the beak receptor is not the compass organ.",
      b: "Correct. Text 2's experimental evidence supports a light-dependent retinal cryptochrome-4 compass and directly rules out the trigeminal beak pathway.",
      c: "Incorrect. Text 2 attributes cryptochrome-4 signaling to quantum radical-pair spin states activated by blue light, not iron-oxide torque.",
      d: "Incorrect. Both texts agree that migratory songbirds possess a biological magnetic compass; they disagree on its physiological mechanism.",
    },
    extras: {
      whyCorrect:
        "Text 2 provides two converging lines of evidence: knocking out cryptochrome-4 function abolishes orientation, whereas knocking out the Text 1 pathway (trigeminal nerve sectioning) has no effect on compass orientation.",
      strategy:
        "On Digital SAT Cross-Text Connections questions, identify the exact point of intersection (the anatomical and biophysical basis of the avian compass) and determine whether Text 2 extends, qualifies, or refutes Text 1.",
      keyTakeaway:
        "Avoid extreme distractors that deny the shared premise of both texts (that songbirds sense Earth's magnetic field).",
      relatedTopics: ["Digital SAT Cross-Text Connections", "Experimental Refutation", "Precision in Claim Comparison"],
    },
    tags: ["sat", "reading-writing", "cross-text"],
  },
  {
    exam: "sat",
    category: "Reading and Writing",
    topic: "Standard English Conventions",
    subtopic: "Boundaries and Clause Punctuation",
    type: "mcq",
    difficulty: "moderate",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?\n\nIn 1925, British-born astronomer Cecilia Payne-Gaposchkin analyzed the thermal ionization spectra of stars in the Harvard College Observatory archive and reached a conclusion that initially stunned her contemporaries: stellar atmospheres are composed overwhelmingly of hydrogen and ______ heavy elements such as iron and silicon constitute less than two percent of solar mass.",
    content: {
      options: [
        { id: "a", text: "helium, whereas" },
        { id: "b", text: "helium, however," },
        { id: "c", text: "helium; while" },
        { id: "d", text: "helium" },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "The clause following the blank ('heavy elements such as iron and silicon constitute less than two percent of solar mass') has a finite subject and verb. Preceding it with ', whereas' creates a grammatically sound subordinate contrast clause attached to the main clause ('stellar atmospheres are composed overwhelmingly of hydrogen and helium').",
    optionExplanations: {
      a: "Correct. A comma followed by the subordinating conjunction 'whereas' properly joins the contrasting dependent clause to the preceding independent clause.",
      b: "Incorrect. 'However' is a conjunctive adverb, not a coordinating or subordinating conjunction; placing it between two independent clauses with only commas creates a comma splice.",
      c: "Incorrect. A semicolon must separate two independent clauses, but introducing 'while' turns the second part into a dependent fragment.",
      d: "Incorrect. Omitting all punctuation and conjunctions creates a fused (run-on) sentence between two independent clauses.",
    },
    extras: {
      whyCorrect:
        "Only option A turns the second clause into a subordinate clause properly linked by a comma, avoiding comma splices, fragments, and fused sentences.",
      strategy:
        "When SAT Boundaries options contrast ', however,' against ', whereas' or '; while', check whether both sides are independent clauses: 'however' requires a semicolon or period before it, whereas 'whereas'/ 'while' subordinates its clause and takes a comma.",
      keyTakeaway:
        "Never use ', however,' to join two complete clauses on the SAT; use ', whereas' or '; however,'.",
      relatedTopics: ["Comma Splices vs. Subordinating Conjunctions", "Semicolon Rules", "SAT Standard English Conventions"],
    },
    tags: ["sat", "reading-writing", "grammar"],
  },
  {
    exam: "sat",
    category: "Math",
    topic: "Algebra",
    subtopic: "Systems of Linear Equations with No Solution",
    type: "mcq",
    difficulty: "moderate",
    stem: "In the system of linear equations below, k is a constant.\n\n(3k - 2)x + 6y = 14\n4x + 3y = 9\n\nIf the system of equations has no solution, what is the value of k?",
    content: {
      options: [
        { id: "a", text: "2" },
        { id: "b", text: "10/3" },
        { id: "c", text: "14/9" },
        { id: "d", text: "3" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "A system of two linear equations in two variables has no solution when the lines are parallel and distinct—meaning the ratio of the x-coefficients equals the ratio of the y-coefficients, but does not equal the ratio of the constant terms. Here, the y-coefficient ratio is 6 / 3 = 2 (while the constant ratio is 14 / 9 ≠ 2). Therefore, (3k - 2) / 4 = 2 => 3k - 2 = 8 => 3k = 10 => k = 10/3.",
    optionExplanations: {
      a: "Incorrect. If k = 2, then 3k - 2 = 4, giving x-ratio 4/4 = 1 ≠ 6/3, so the lines intersect at a single point.",
      b: "Correct. Matching the x-coefficient ratio to the y-coefficient ratio (6/3 = 2) requires 3k - 2 = 2(4) = 8, so 3k = 10 and k = 10/3.",
      c: "Incorrect. 14/9 is the ratio of the constants on the right-hand side.",
      d: "Incorrect. Setting 3k - 2 = 7 gives k = 3, which results from an arithmetic error when doubling 4.",
    },
    extras: {
      whyCorrect:
        "Multiplying the second equation by 2 yields 8x + 6y = 18. For the left-hand side of the first equation to match 8x + 6y, we must have 3k - 2 = 8, which gives k = 10/3.",
      strategy:
        "For linear systems on the SAT, scale one equation so the known variable coefficients match (multiply 4x + 3y = 9 by 2 to get 8x + 6y = 18), then equate the remaining coefficients directly.",
      keyTakeaway:
        "No solution = identical slopes (a1/a2 = b1/b2) with different y-intercepts (≠ c1/c2).",
      relatedTopics: ["Linear Systems with No Solution", "Parallel Lines in the xy-Plane", "Coefficient Ratios"],
    },
    tags: ["sat", "math", "algebra"],
  },
  {
    exam: "sat",
    category: "Math",
    topic: "Advanced Math",
    subtopic: "Quadratic Functions and Vertex Optimization",
    type: "numeric",
    difficulty: "moderate",
    stem: "A robotics company models its monthly profit P(x), in thousands of dollars, as a function of the selling price x, in hundreds of dollars per unit, using the equation P(x) = -2x^2 + 28x - 54. What is the maximum monthly profit, in thousands of dollars, predicted by this model?",
    content: {
      unit: "thousand dollars",
      decimals: 0,
    },
    answer: {
      value: 44,
      tolerance: 0,
    },
    rationale:
      "For a downward-opening parabola P(x) = ax^2 + bx + c with a = -2 < 0, the maximum occurs at the vertex x-coordinate x_v = -b / (2a) = -28 / (2 · -2) = 7. Substituting x = 7 into P(x) gives P(7) = -2(7)^2 + 28(7) - 54 = -2(49) + 196 - 54 = -98 + 196 - 54 = 44 (thousand dollars).",
    extras: {
      whyCorrect:
        "Completing the square confirms P(x) = -2(x^2 - 14x + 49) + 98 - 54 = -2(x - 7)^2 + 44, showing a vertex at (7, 44) and a maximum value of 44.",
      strategy:
        "On SAT Student-Produced Response questions asking for the maximum or minimum of a quadratic, double-check whether the stem asks for the input x at the vertex (7) or the output value P(x) at the vertex (44).",
      keyTakeaway:
        "The vertex of f(x) = ax^2 + bx + c occurs at x = -b/(2a), and the maximum/minimum value is f(-b/(2a)).",
      relatedTopics: ["Vertex Form of a Parabola", "Completing the Square", "Quadratic Optimization"],
    },
    tags: ["sat", "math", "numeric", "quadratics"],
  },

  /* ================================================================== */
  /* 9. ACT ("act")                                                     */
  /* ================================================================== */
  {
    exam: "act",
    category: "English",
    topic: "Conventions of Standard English",
    subtopic: "Dangling and Misplaced Participial Modifiers",
    type: "mcq",
    difficulty: "moderate",
    stem: "Choose the alternative that best replaces the underlined portion of the sentence below.\n\nPeering through the high-powered electron microscope for nearly three hours, the crystalline lattice of the perovskite solar cell finally became visible to the materials scientist.",
    content: {
      options: [
        { id: "a", text: "NO CHANGE" },
        { id: "b", text: "the materials scientist finally observed the crystalline lattice of the perovskite solar cell." },
        { id: "c", text: "the perovskite solar cell's crystalline lattice was finally observed by the materials scientist." },
        { id: "d", text: "visibility of the perovskite solar cell's crystalline lattice was finally achieved by the materials scientist." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The introductory participial phrase 'Peering through the high-powered electron microscope for nearly three hours' must be immediately followed by the grammatical subject performing the action of peering—namely, 'the materials scientist.' Options A, C, and D create dangling modifiers by placing 'the crystalline lattice,' 'the perovskite solar cell's crystalline lattice,' or 'visibility' in the subject slot.",
    optionExplanations: {
      a: "Incorrect. 'The crystalline lattice' cannot peer through an electron microscope (dangling modifier).",
      b: "Correct. 'The materials scientist' is placed immediately after the comma as the subject performing the action 'Peering'.",
      c: "Incorrect. The passive subject 'the perovskite solar cell's crystalline lattice' still creates a dangling modifier.",
      d: "Incorrect. 'Visibility' is an abstract noun that cannot peer through a microscope, and the passive phrasing is wordy.",
    },
    extras: {
      whyCorrect:
        "An introductory '-ing' or '-ed' modifier attaches to the very first noun phrase that serves as the subject of the main clause after the comma.",
      strategy:
        "Whenever an ACT English sentence starts with an introductory participial phrase followed by a comma, ask 'Who is performing this action?' and choose the option that starts immediately with that doer.",
      keyTakeaway:
        "Active voice with the human agent as the subject resolves both dangling-modifier errors and ACT conciseness issues simultaneously.",
      relatedTopics: ["Introductory Participial Modifiers", "Active vs. Passive Voice", "ACT English Conciseness"],
    },
    tags: ["act", "english", "modifiers"],
  },
  {
    exam: "act",
    category: "Math",
    topic: "Geometry and Trigonometry",
    subtopic: "Law of Cosines and Triangle Geometry",
    type: "mcq",
    difficulty: "moderate",
    stem: "Two surveying drones depart simultaneously from the same ground beacon along straight horizontal flight paths that form an angle of 60° with each other. After 10 minutes, Drone A is 8 kilometers from the beacon and Drone B is 15 kilometers from the beacon. How many kilometers apart are the two drones at that moment?",
    content: {
      options: [
        { id: "a", text: "11" },
        { id: "b", text: "13" },
        { id: "c", text: "17" },
        { id: "d", text: "19" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "By the Law of Cosines, for a triangle with sides a = 8, b = 15, and included angle C = 60°: c^2 = a^2 + b^2 - 2ab·cos(60°). Since cos(60°) = 0.5, c^2 = 8^2 + 15^2 - 2(8)(15)(0.5) = 64 + 225 - 120 = 169. Taking the positive square root yields c = 13 kilometers.",
    optionExplanations: {
      a: "Incorrect. 11 is close to sqrt(15^2 - 8^2) ≈ 12.69, which misapplies the Pythagorean theorem.",
      b: "Correct. c^2 = 64 + 225 - 2(8)(15)(1/2) = 289 - 120 = 169, so c = 13.",
      c: "Incorrect. 17 results from using the Pythagorean theorem (sqrt(8^2 + 15^2) = sqrt(289) = 17), which only holds for a 90° angle.",
      d: "Incorrect. 19 results from adding 2ab·cos(60°) instead of subtracting (sqrt(289 + 120) = sqrt(409) ≈ 20.2).",
    },
    extras: {
      whyCorrect:
        "Because 2 · cos(60°) = 2 · (1/2) = 1, the Law of Cosines for a 60° angle simplifies neatly to c^2 = a^2 + b^2 - ab = 64 + 225 - 120 = 169 => c = 13.",
      strategy:
        "Notice how 17 (the 8-15-17 right triangle) is included as a trap! When the angle is acute (60° < 90°), the opposite side must be strictly shorter than the hypotenuse of a right triangle with legs 8 and 15 (c < 17).",
      keyTakeaway:
        "Use Side-Angle-Side (SAS) with the Law of Cosines: c^2 = a^2 + b^2 - 2ab·cos(C).",
      relatedTopics: ["Law of Cosines", "Non-Right Triangle Trigonometry", "Geometric Inequalities"],
    },
    tags: ["act", "math", "trigonometry"],
  },
  {
    exam: "act",
    category: "Math",
    topic: "Algebra and Functions",
    subtopic: "Logarithmic Equations and Domain Constraints",
    type: "numeric",
    difficulty: "moderate",
    stem: "What is the positive real value of x that satisfies the equation log_2(x + 3) + log_2(x - 3) = 4?",
    content: {
      decimals: 0,
    },
    answer: {
      value: 5,
      tolerance: 0,
    },
    rationale:
      "Using the product rule for logarithms, log_2((x + 3)(x - 3)) = 4 => log_2(x^2 - 9) = 4. Converting to exponential form gives x^2 - 9 = 2^4 = 16 => x^2 = 25 => x = ±5. Because the domain of log_2(x - 3) requires x > 3, x = -5 is extraneous and the unique valid solution is x = 5.",
    extras: {
      whyCorrect:
        "Substituting x = 5 back into the original equation gives log_2(8) + log_2(2) = 3 + 1 = 4.",
      strategy:
        "Always check logarithmic solutions against the domain requirement that every logarithm's argument must be strictly positive (x - 3 > 0).",
      keyTakeaway:
        "log_b(M) + log_b(N) = log_b(M · N) holds on the intersection of the domains M > 0 and N > 0.",
      relatedTopics: ["Logarithm Product Rule", "Extraneous Solutions", "Exponential-Logarithmic Conversion"],
    },
    tags: ["act", "math", "numeric", "logarithms"],
  },
  {
    exam: "act",
    category: "Reading",
    topic: "Natural Science Prose",
    subtopic: "Counterillumination Camouflage in Mesopelagic Cephalopods",
    type: "mcq",
    difficulty: "moderate",
    exhibit: {
      kind: "passage",
      title: "Bioluminescence and Counterillumination in the Mesopelagic Zone",
      text: "In the ocean's mesopelagic 'twilight' zone—spanning depths from 200 to 1,000 meters—residual downwelling sunlight is too faint to fuel photosynthesis, yet bright enough to cast a stark dark silhouette of any midwater animal viewed from below by an upward-looking predator. Without physical shelter in the open water column, the Hawaiian bobtail squid (Euprymna scolopes) solves this optical vulnerability through counterillumination: projecting downward-directed bioluminescence from its ventral mantle to match the exact intensity and wavelength of the ambient moonlight or starlight filtering down from the surface.\n\nRemarkably, the squid cannot synthesize the light-emitting luciferin enzyme complex on its own. Instead, within hours of hatching, the juvenile squid recruits a single species of marine bacterium, Vibrio fischeri, from the surrounding seawater into a specialized bilobed crypt inside its ventral light organ. Coated with reflective plates derived from structural proteins called reflectins and capped by a muscle-controlled lens analogous to an iris diaphragm, the light organ allows the squid to dim or brighten the bacterial glow instantaneously as clouds pass across the moon above.",
    },
    stem: "According to the passage, how does Euprymna scolopes regulate the brightness of its ventral bioluminescence when surface light conditions fluctuate?",
    content: {
      options: [
        { id: "a", text: "By rapidly expelling excess Vibrio fischeri bacteria into the surrounding seawater whenever clouds obscure the moon" },
        { id: "b", text: "By modulating the light emission using reflective protein plates and a muscle-controlled lens over its light organ" },
        { id: "c", text: "By migrating vertically between 200 and 1,000 meters to maintain a constant level of ambient downwelling light" },
        { id: "d", text: "By synthesizing variable quantities of its own endogenous luciferin enzyme complex inside its dorsal mantle" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The final sentence of paragraph 2 states that the light organ is 'Coated with reflective plates derived from structural proteins called reflectins and capped by a muscle-controlled lens analogous to an iris diaphragm,' enabling the squid to dim or brighten the glow instantaneously.",
    optionExplanations: {
      a: "Incorrect. The passage states that the squid recruits V. fischeri upon hatching and modulates the light optically via a muscle-controlled lens, not by expelling bacteria whenever clouds pass.",
      b: "Correct. Reflectin plates and a muscle-controlled lens act like an iris diaphragm to adjust brightness in real time.",
      c: "Incorrect. 200 to 1,000 meters defines the mesopelagic zone itself, not a real-time cloud-response migration.",
      d: "Incorrect. Paragraph 2 explicitly states that the squid cannot synthesize the luciferin enzyme complex on its own and illuminates its ventral (not dorsal) mantle.",
    },
    extras: {
      whyCorrect:
        "The passage directly connects the anatomical structures (reflectin plates + muscle-controlled lens) to the function of dimming or brightening the bacterial glow as clouds pass.",
      strategy:
        "On ACT Reading Natural Science passages, scan for the exact functional phrase in the question ('regulate the brightness... when surface light conditions fluctuate' -> 'dim or brighten... as clouds pass across the moon').",
      keyTakeaway:
        "ACT Reading detail questions reward precise text-matching over outside biological extrapolation.",
      relatedTopics: ["ACT Natural Science Detail Questions", "Cause-and-Mechanism Scanning", "Eliminating Half-True Distractors"],
    },
    tags: ["act", "reading", "natural-science"],
  },
  {
    exam: "act",
    category: "Science",
    topic: "Data Representation and Experimental Design",
    subtopic: "Catalytic Decomposition Kinetics of Hydrogen Peroxide",
    type: "mcq",
    difficulty: "moderate",
    exhibit: {
      kind: "table",
      title: "Experiment 1: Initial Rate of O2 Evolution From 50 mL of 0.20 M H2O2 Catalyzed by MnO2",
      columns: ["Trial", "Mass of MnO2 (g)", "Temperature (°C)", "Particle Size of MnO2", "Initial O2 Evolution Rate (mL/s)"],
      rows: [
        ["1", "0.50", "20", "Coarse granules (2.0 mm)", "1.4"],
        ["2", "0.50", "20", "Fine powder (0.05 mm)", "4.8"],
        ["3", "1.00", "20", "Fine powder (0.05 mm)", "9.6"],
        ["4", "1.00", "30", "Fine powder (0.05 mm)", "19.2"],
        ["5", "1.00", "40", "Fine powder (0.05 mm)", "38.4"],
      ],
    },
    stem: "Suppose a student wants to test the effect of temperature alone on the initial rate of O2 evolution using coarse MnO2 granules (2.0 mm) rather than fine powder. Which additional trial should the student perform and compare directly with Trial 1?",
    content: {
      options: [
        { id: "a", text: "0.50 g of coarse MnO2 granules (2.0 mm) at 30°C" },
        { id: "b", text: "1.00 g of coarse MnO2 granules (2.0 mm) at 30°C" },
        { id: "c", text: "0.50 g of fine MnO2 powder (0.05 mm) at 30°C" },
        { id: "d", text: "1.00 g of coarse MnO2 granules (2.0 mm) at 20°C" },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "To isolate the effect of temperature when comparing directly with Trial 1 (0.50 g, 20°C, coarse granules), all other independent variables—catalyst mass (0.50 g) and particle size (coarse granules, 2.0 mm)—must be held constant while temperature alone is varied (to 30°C).",
    optionExplanations: {
      a: "Correct. Holding mass at 0.50 g and particle size at coarse granules (2.0 mm) while changing temperature from 20°C to 30°C isolates temperature as the sole independent variable.",
      b: "Incorrect. Changing both mass (0.50 g to 1.00 g) and temperature (20°C to 30°C) confounds the two variables.",
      c: "Incorrect. Changing both particle size and temperature relative to Trial 1 introduces a confounding variable.",
      d: "Incorrect. Keeping temperature at 20°C while changing mass to 1.00 g tests the effect of catalyst mass, not temperature.",
    },
    extras: {
      whyCorrect:
        "Controlled experimental design requires varying only the target independent variable (temperature) while keeping every other parameter identical to the baseline trial (Trial 1).",
      strategy:
        "On ACT Science Research Summaries questions, write down the parameters of the reference trial (Trial 1: 0.50 g | 20°C | Coarse) and pick the choice that alters ONLY the variable named in the stem.",
      keyTakeaway:
        "Single-variable isolation is one of the most frequently tested experimental-design concepts on the ACT Science section.",
      relatedTopics: ["Controlled Variables in Experimental Design", "ACT Science Research Summaries", "Reaction Kinetics Tables"],
    },
    tags: ["act", "science", "table-exhibit"],
  },

  /* ================================================================== */
  /* 10. GRE GENERAL TEST ("gre")                                       */
  /* ================================================================== */
  {
    exam: "gre",
    category: "Verbal Reasoning",
    topic: "Reading comprehension",
    subtopic: "Historiography of Early Modern Artisanal Guilds",
    type: "mcq",
    difficulty: "difficult",
    exhibit: {
      kind: "passage",
      title: "Reassessing the Economic Role of Early Modern Craft Guilds",
      text: "Since Adam Smith's indictment of corporate privileges in 1776, economic historians have predominantly portrayed early modern European craft guilds as rent-seeking cartels that retarded technological innovation by restricting entry, fixing prices, and prohibiting labor-saving machinery. While this characterization captures the defensive posture of many declining textile guilds in the late eighteenth century, S. R. Epstein argued that projecting such sclerosis backward onto the fourteenth through seventeenth centuries obscures the vital institutional problem guilds actually solved: the transmission of tacit, high-skill human capital in an era without patent protection or technical schools.\n\nBecause pre-industrial manufacturing relied on uncodified manual dexterity that could only be acquired through years of supervised apprenticeship, masters faced an acute opportunism hazard—trainees might abscond before repaying their training costs through skilled labor—while apprentices feared masters might exploit them as cheap menial workers without imparting genuine craft secrets. By enforcing multi-year indenture contracts, certifying mastery through standardized masterpieces, and penalizing opportunistic defection by either party, guilds created a credible commitment mechanism that sustained long-term investment in technical skills and facilitated the geographic diffusion of journeymen across European urban centers.",
    },
    stem: "According to the passage, Epstein contends that the traditional Smithian critique of European craft guilds is flawed primarily because it:",
    content: {
      options: [
        { id: "a", text: "denied that late-eighteenth-century textile guilds ever attempted to restrict market entry or regulate prices" },
        { id: "b", text: "generalized the restrictive behavior of late-stage declining guilds across earlier centuries when guilds resolved crucial apprenticeship market failures" },
        { id: "c", text: "overestimated the availability of formal patent protections and state-sponsored technical schools in fourteenth-century Europe" },
        { id: "d", text: "ignored evidence showing that pre-industrial apprentices acquired most of their technical knowledge from printed manuals rather than hands-on supervision" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The first paragraph concedes that the Smithian view 'captures the defensive posture of many declining textile guilds in the late eighteenth century,' but explains that Epstein argued 'projecting such sclerosis backward onto the fourteenth through seventeenth centuries obscures the vital institutional problem guilds actually solved: the transmission of tacit, high-skill human capital.'",
    optionExplanations: {
      a: "Incorrect. The passage agrees that late-18th-century textile guilds exhibited defensive, cartel-like behavior.",
      b: "Correct. Epstein's critique is that historians anachronistically projected late-18th-century decline backward onto earlier centuries, overlooking how guilds solved bidirectional opportunism in apprenticeship training.",
      c: "Incorrect. The passage states that patent protections and technical schools did not exist in that era, not that Smithian historians thought they did.",
      d: "Incorrect. Paragraph 2 explicitly states that pre-industrial manufacturing relied on 'uncodified manual dexterity' acquired only through supervised apprenticeship.",
    },
    extras: {
      whyCorrect:
        "The metaphor 'projecting such sclerosis backward onto the fourteenth through seventeenth centuries obscures the vital institutional problem guilds actually solved' maps directly to option B.",
      strategy:
        "In GRE Reading Comprehension historiography passages, track the author's concession ('While this characterization captures...') followed by the revisionist thesis ('Epstein argued that...').",
      keyTakeaway:
        "GRE passages frequently test whether you can distinguish a qualified historical revision from a wholesale rejection of the old theory.",
      relatedTopics: ["GRE Reading Comprehension Revisionist Arguments", "Concession and Qualification", "Institutional Economics Passages"],
    },
    tags: ["gre", "verbal", "reading-comprehension"],
  },
  {
    exam: "gre",
    category: "Verbal Reasoning",
    topic: "Sentence equivalence",
    subtopic: "Academic Vocabulary and Contextual Contrast",
    type: "sata",
    difficulty: "difficult",
    stem: "Select the TWO answer choices that, when used to complete the sentence, fit the meaning of the sentence as a whole and produce completed sentences that are alike in meaning.\n\nFar from being the spontaneous, unscripted outburst of populist fervor that contemporary chroniclers portrayed, the 1647 municipal uprising was in fact meticulously ______ by a coalition of merchant creditors who had spent months coordinating grain shortages and printing anonymous broadsheets.",
    content: {
      options: [
        { id: "a", text: "repudiated" },
        { id: "b", text: "choreographed" },
        { id: "c", text: "forestalled" },
        { id: "d", text: "orchestrated" },
        { id: "e", text: "exacerbated" },
        { id: "f", text: "mitigated" },
      ],
    },
    answer: {
      correct: ["b", "d"],
    },
    rationale:
      "The structural pivot 'Far from being the spontaneous, unscripted outburst... was in fact meticulously ______' requires a verb meaning deliberately planned, staged, or directed behind the scenes. Both 'choreographed' (b) and 'orchestrated' (d) convey meticulous advance planning and yield synonymous sentences.",
    optionExplanations: {
      a: "Incorrect. 'Repudiated' means rejected or disowned, which contradicts the merchants' role in organizing the uprising.",
      b: "Correct. 'Choreographed' means carefully planned and directed every stage of an event.",
      c: "Incorrect. 'Forestalled' means prevented or delayed in advance.",
      d: "Correct. 'Orchestrated' means secretly or carefully arranged a complex action to achieve a desired outcome.",
      e: "Incorrect. 'Exacerbated' means made worse, which lacks a synonym pair here and does not directly oppose 'unscripted'.",
      f: "Incorrect. 'Mitigated' means lessened in severity.",
    },
    extras: {
      whyCorrect:
        "The antonym cues 'spontaneous, unscripted' followed by 'spent months coordinating' call for a synonym pair denoting deliberate staging ('choreographed' / 'orchestrated').",
      strategy:
        "In GRE Sentence Equivalence, first predict your own filler word from the structural pivot ('Far from being X... was in fact Y'), then verify that your two chosen words produce virtually identical sentence meanings.",
      keyTakeaway:
        "Both structural contrast ('Far from being...') and the explanatory relative clause ('who had spent months coordinating...') must align with the chosen pair.",
      relatedTopics: ["GRE Sentence Equivalence Synonym Pairs", "Contrast Pivot Markers", "Figurative Academic Verbs"],
    },
    tags: ["gre", "verbal", "sata", "sentence-equivalence"],
  },
  {
    exam: "gre",
    category: "Verbal Reasoning",
    topic: "Text completion",
    subtopic: "Two-Blank Logical Polarity",
    type: "cloze",
    difficulty: "difficult",
    stem: "Select one entry for each blank from the corresponding drop-down menu to complete the text logically.",
    content: {
      template:
        "Because the archive's surviving correspondence comes almost exclusively from royal tax collectors seeking to justify harsher levies, any historian who treats these dispatches as {{b1}} accounts of provincial peasant prosperity risks {{b2}} the very administrative bias that produced the documents.",
      blanks: {
        b1: [
          { id: "dispassionate", text: "dispassionate" },
          { id: "tendentious", text: "tendentious" },
          { id: "apocryphal", text: "apocryphal" },
        ],
        b2: [
          { id: "perpetuating", text: "perpetuating" },
          { id: "circumventing", text: "circumventing" },
          { id: "rectifying", text: "rectifying" },
        ],
      },
    },
    answer: {
      blanks: {
        b1: "dispassionate",
        b2: "perpetuating",
      },
    },
    rationale:
      "Tax collectors 'seeking to justify harsher levies' had an obvious self-interested agenda (to make peasants appear wealthier and able to pay more). Therefore, a historian who uncritically treats their dispatches as 'dispassionate' (objective, unbiased) accounts risks 'perpetuating' (continuing/reproducing) that administrative bias.",
    extras: {
      whyCorrect:
        "Blank 1 contrasts with the tax collectors' self-serving motive ('seeking to justify harsher levies'), requiring 'dispassionate' (unbiased), while Blank 2 describes the error that follows from trusting biased sources ('perpetuating' the bias).",
      strategy:
        "In multi-blank GRE Text Completion, evaluate how the two blanks interlock: trusting a biased source as objective (Blank 1) causes the historian to repeat/entrench (Blank 2) that bias.",
      keyTakeaway:
        "'Dispassionate' (impartial, uncolored by self-interest) vs. 'tendentious' (promoting a partisan agenda) is a classic GRE vocabulary distinction.",
      relatedTopics: ["GRE Two-Blank Text Completion", "High-Frequency GRE Adjectives", "Cause-and-Consequence Cloze Logic"],
    },
    tags: ["gre", "verbal", "cloze", "text-completion"],
  },
  {
    exam: "gre",
    category: "Quantitative Reasoning",
    topic: "Data analysis",
    subtopic: "Conditional Probability and Combinatorics",
    type: "mcq",
    difficulty: "difficult",
    stem: "A quality-control inspector randomly selects 3 microchips without replacement from a batch of 10 microchips, of which 4 are defective and 6 are non-defective. Given that at least 1 of the 3 selected microchips is defective, what is the probability that exactly 2 of the selected microchips are defective?",
    content: {
      options: [
        { id: "a", text: "3/10" },
        { id: "b", text: "3/8" },
        { id: "c", text: "9/25" },
        { id: "d", text: "1/2" },
      ],
    },
    answer: { correct: "c" },
    rationale:
      "Total ways to choose 3 microchips from 10 is C(10, 3) = 120. The number of selections with 0 defective chips (all 3 from the 6 non-defective chips) is C(6, 3) = 20. Thus, the number of selections with at least 1 defective chip is 120 - 20 = 100. The number of selections with exactly 2 defective chips and 1 non-defective chip is C(4, 2) · C(6, 1) = 6 · 6 = 36. Therefore, the conditional probability is 36 / 100 = 9 / 25.",
    optionExplanations: {
      a: "Incorrect. 3/10 = 36/120 is the unconditional probability of selecting exactly 2 defective chips out of all 120 possible triples.",
      b: "Incorrect. 3/8 results from dividing 36 by 96 (excluding the all-defective cases C(4,3) = 4 from the denominator).",
      c: "Correct. P(exactly 2 defective | at least 1 defective) = 36 / (120 - 20) = 36 / 100 = 9 / 25.",
      d: "Incorrect. 1/2 assumes equally likely outcomes among 1, 2, or 3 defectives.",
    },
    extras: {
      whyCorrect:
        "Because 'exactly 2 defective' is a subset of 'at least 1 defective', the conditional probability is simply Count(exactly 2 defective) / Count(at least 1 defective) = 36 / 100 = 9/25.",
      strategy:
        "For hypergeometric conditional probabilities on the GRE, work directly with combination counts rather than fractions: Denominator = C(10,3) - C(6,3) = 120 - 20 = 100; Numerator = C(4,2)·C(6,1) = 36.",
      keyTakeaway:
        "Don't forget to restrict the sample space when a GRE problem specifies 'Given that at least 1...'.",
      relatedTopics: ["Hypergeometric Probability", "Conditional Probability", "Complement Rule in Combinatorics"],
    },
    tags: ["gre", "quant", "probability"],
  },
  {
    exam: "gre",
    category: "Quantitative Reasoning",
    topic: "Algebra",
    subtopic: "Compound Growth and Weighted Mixtures",
    type: "numeric",
    difficulty: "moderate",
    stem: "Solution A is 18% hydrochloric acid by volume, and Solution B is 43% hydrochloric acid by volume. How many milliliters of Solution B must be mixed with 300 milliliters of Solution A to produce a mixture that is 28% hydrochloric acid by volume?",
    content: {
      unit: "mL",
      decimals: 0,
    },
    answer: {
      value: 200,
      tolerance: 0,
    },
    rationale:
      "Let x be the volume (in mL) of Solution B added. Setting up the pure acid balance equation: 0.18(300) + 0.43x = 0.28(300 + x) => 54 + 0.43x = 84 + 0.28x => 0.15x = 30 => x = 200 mL. Alternatively, by the alligation (weighted-average distance) method, the target 28% is 10 percentage points from 18% and 15 percentage points from 43%, so the volume ratio V_B : V_A = 10 : 15 = 2 : 3. Since V_A = 300 mL, V_B = (2/3)(300) = 200 mL.",
    extras: {
      whyCorrect:
        "200 mL of 43% acid (86 mL pure HCl) plus 300 mL of 18% acid (54 mL pure HCl) yields 140 mL pure HCl in 500 mL total solution (140 / 500 = 28%).",
      strategy:
        "Use the alligation lever rule on GRE mixture problems: the ratio of volumes is the inverse ratio of distances from the target concentration (|28 - 18| : |43 - 28| = 10 : 15 = 2 : 3).",
      keyTakeaway:
        "Weighted averages divide the interval between two concentrations in inverse proportion to their volumes.",
      relatedTopics: ["Mixture Problems", "Weighted Averages", "Linear Equations"],
    },
    tags: ["gre", "quant", "numeric"],
  },
  {
    exam: "gre",
    category: "Analytical Writing",
    topic: "Analyze an Issue",
    subtopic: "Technological Specialization vs. Critical Human Judgment",
    type: "writing",
    difficulty: "difficult",
    stem: "Write a well-reasoned analytical essay responding to the GRE Issue prompt and specific task instructions below.",
    content: {
      prompt:
        "Issue Prompt:\n'As fields of inquiry become increasingly specialized and dependent on complex data models, society's most pressing challenges can only be solved by technical experts working strictly within their own disciplines.'\n\nInstructions:\nWrite a response in which you discuss the extent to which you agree or disagree with the claim. In developing and supporting your position, be sure to address the most compelling reasons and/or examples that could be used to challenge your position.",
      minWords: 300,
      taskLabel: "GRE Analytical Writing — Analyze an Issue",
      rubric: [
        "Complexity of Analysis: Articulates a nuanced thesis recognizing where deep disciplinary expertise is essential while demonstrating why cross-disciplinary integration is indispensable.",
        "Cogent Support & Examples: Develops concrete historical, scientific, or policy examples rather than generic assertions.",
        "Counterargument Engagement: Explicitly addresses and rebuts the strongest argument for strict disciplinary specialization.",
        "Fluency & Syntactic Control: Demonstrates graduate-level vocabulary, varied sentence structures, and logical paragraph transitions.",
      ],
    },
    answer: {
      sample:
        "The assertion that humanity's most urgent challenges can be resolved solely by technical specialists operating within the boundaries of their own disciplines captures an important truth about modern knowledge production, yet ultimately fails to recognize the multidimensional nature of real-world crises. While rigorous disciplinary specialization is a necessary prerequisite for generating reliable technical breakthroughs, translating those breakthroughs into viable societal solutions inevitably requires cross-disciplinary synthesis across economics, ethics, behavioral psychology, and public policy.\n\nConcededly, proponents of strict specialization can point to formidable technical thresholds in contemporary science. Designing an mRNA vaccine lipid nanoparticle, modeling tokamak plasma confinement in nuclear fusion, or verifying cryptographic security protocols demands years of domain-specific training that generalists simply cannot replicate. Without deep vertical mastery and standardized methodological rigor within specialized guilds, interdisciplinary committees risk devolving into superficial amateurism.\n\nNevertheless, mistaking a technical tool for a complete societal solution is a recurring fallacy. Consider the global response to epidemic infectious diseases or anthropogenic climate change. Virologists and molecular biologists rapidly synthesized highly efficacious vaccines, yet controlling community transmission hinged on supply-chain logistics, sociological trust, public health communication, and international patent law—domains far outside molecular biology. Similarly, atmospheric physicists and chemical engineers have long understood the radiative forcing of greenhouse gases and the electrochemistry of grid-scale battery storage; however, decarbonizing an industrial economy requires economists to design carbon-pricing mechanisms, urban planners to restructure transit zoning, and political scientists to navigate distributional conflicts.\n\nFurthermore, history repeatedly demonstrates that the most transformative intellectual breakthroughs emerge precisely at the porous borders between disciplines. The birth of molecular biology itself arose when physicists such as Max Delbrück and Francis Crick brought crystallographic and informational frameworks to biological heredity, while contemporary artificial intelligence draws simultaneously on neuroscience, mathematical optimization, and linguistics.\n\nIn conclusion, deep specialization and interdisciplinary collaboration are not mutually exclusive rivals but sequential pillars of problem-solving. While society depends on specialized experts to forge the foundational instruments of science, our most complex challenges reside at the intersection of technology and human behavior—and can therefore only be solved when specialists step outside their disciplinary silos.",
    },
    rationale:
      "A Score 6.0 GRE Issue essay avoids simplistic binary agreement or disagreement, immediately establishes a qualified thesis, directly engages the prompt's strongest counterargument (why deep vertical mastery is indispensable), and proves its thesis with concrete multi-domain examples.",
    extras: {
      whyCorrect:
        "The essay satisfies the specific ETS instruction to 'address the most compelling reasons and/or examples that could be used to challenge your position' in paragraph 2 before dismantling the claim's exclusivity ('only be solved... strictly within their own disciplines') in paragraphs 3 and 4.",
      strategy:
        "Always dissect extreme qualifiers in GRE Issue prompts ('only', 'strictly', 'never'): conceding the necessity of expertise while refuting its sufficiency gives you an instant, sophisticated analytical framework.",
      keyTakeaway:
        "Distinguishing between 'necessary' and 'sufficient' conditions is one of the strongest analytical moves in GRE Analytical Writing.",
      relatedTopics: ["Necessary vs. Sufficient Conditions in Issue Essays", "Counterargument Integration", "Multi-Domain Exemplification"],
    },
    tags: ["gre", "analytical-writing", "issue-essay"],
  },

  /* ================================================================== */
  /* 11. GMAT FOCUS ("gmat")                                            */
  /* ================================================================== */
  {
    exam: "gmat",
    category: "Quantitative Reasoning",
    topic: "Rates, Work, and Mixtures",
    subtopic: "Combined Work Rates with Staggered Operation",
    type: "mcq",
    difficulty: "difficult",
    stem: "Pump A, working alone at its constant rate, can fill an empty industrial reservoir in 12 hours. Pump B, working alone at its constant rate, can fill the same reservoir in 15 hours, while Drain Valve C, when open alone, can empty a full reservoir in 20 hours. If all three are accidentally opened simultaneously when the reservoir is empty, and Drain Valve C is closed after 6 hours while Pumps A and B continue operating, how many additional hours after Valve C is closed will it take Pumps A and B to finish filling the reservoir?",
    content: {
      options: [
        { id: "a", text: "1 hour 40 minutes" },
        { id: "b", text: "2 hours 13 minutes" },
        { id: "c", text: "2 hours 40 minutes" },
        { id: "d", text: "3 hours 20 minutes" },
      ],
    },
    answer: { correct: "c" },
    rationale:
      "Let the reservoir capacity be the least common multiple of 12, 15, and 20, which is 60 units. Pump A's rate = +5 units/hr; Pump B's rate = +4 units/hr; Drain Valve C's rate = -3 units/hr. During the first 6 hours with all three open, the net filling rate is 5 + 4 - 3 = 6 units/hr, so 6 · 6 = 36 units are filled. The remaining capacity is 60 - 36 = 24 units. Once Valve C is closed, Pumps A and B fill together at 5 + 4 = 9 units/hr. The additional time required is 24 / 9 = 8 / 3 hours = 2 and 2/3 hours = 2 hours 40 minutes.",
    optionExplanations: {
      a: "Incorrect. 1 hour 40 minutes (5/3 hours) results from forgetting that Drain C subtracted 3 units/hr during the first 6 hours.",
      b: "Incorrect. 2 hours 13 minutes (20/9 hours) results from miscalculating the first 6 hours' progress as 40 units.",
      c: "Correct. Remaining 24/60 (or 2/5) of the reservoir divided by combined rate 9/60 per hour gives 24/9 = 8/3 hours = 2 hours 40 minutes.",
      d: "Incorrect. 3 hours 20 minutes (10/3 hours) results from dividing the remaining 24 units by the net rate 6 instead of the A+B rate 9.",
    },
    extras: {
      whyCorrect:
        "Assigning a smart LCM capacity of 60 units converts fractional rates (1/12, 1/15, -1/20) into integer rates (+5, +4, -3 units/hr), eliminating fraction arithmetic errors.",
      strategy:
        "On GMAT work/rate problems, immediately set total work equal to the LCM of all given times (LCM(12, 15, 20) = 60).",
      keyTakeaway:
        "Net rate with opposing pipes is the algebraic sum of inflow rates minus outflow rates.",
      relatedTopics: ["LCM Work-Rate Method", "Opposing Rates", "Staggered Work Problems"],
    },
    tags: ["gmat", "quant", "work-rates"],
  },
  {
    exam: "gmat",
    category: "Quantitative Reasoning",
    topic: "Number Properties and Combinatorics",
    subtopic: "Trailing Zeros and Prime Factorization",
    type: "numeric",
    difficulty: "difficult",
    stem: "If N = 125! (the factorial of 125), what is the greatest integer k such that 10^k is a divisor of N?",
    content: {
      decimals: 0,
    },
    answer: {
      value: 31,
      tolerance: 0,
    },
    rationale:
      "Since 10 = 2 · 5 and factors of 2 are far more abundant than factors of 5 in 125!, the highest power of 10 dividing 125! equals the highest power of 5 dividing 125! (Legendre's formula). Count the multiples of 5, 25, and 125 up to 125: floor(125/5) + floor(125/25) + floor(125/125) = 25 + 5 + 1 = 31. Thus, k = 31.",
    extras: {
      whyCorrect:
        "125 itself equals 5^3, contributing three factors of 5 (counted once in 125/5 = 25, once in 125/25 = 5, and once in 125/125 = 1, totaling 31).",
      strategy:
        "To find the number of trailing zeros of n!, successively divide n by powers of 5 (5, 25, 125, 625...) and sum the integer quotients.",
      keyTakeaway:
        "Don't stop at n/25 when n ≥ 125; every multiple of 125 contributes a third factor of 5.",
      relatedTopics: ["Legendre's Formula for Factorials", "Prime Factorization", "Trailing Zeros"],
    },
    tags: ["gmat", "quant", "numeric", "number-properties"],
  },
  {
    exam: "gmat",
    category: "Verbal Reasoning",
    topic: "Critical Reasoning",
    subtopic: "Causal Flaws and Survivorship / Selection Bias",
    type: "mcq",
    difficulty: "difficult",
    stem: "Corporate Strategist: A recent ten-year study of 150 publicly traded retail chains that currently operate in at least five countries found that 82% of those chains had invested more than 12% of their annual revenue into proprietary supply-chain automation during their first three years of operation. Therefore, any newly founded retail startup that invests over 12% of its annual revenue into proprietary supply-chain automation during its first three years has a high probability of successfully expanding into multiple countries.\n\nThe corporate strategist's argument is most vulnerable to criticism on the grounds that it:",
    content: {
      options: [
        { id: "a", text: "fails to consider how many newly founded retail startups invested over 12% of their revenue into proprietary supply-chain automation during their first three years but subsequently went bankrupt before expanding internationally" },
        { id: "b", text: "provides no evidence that retail chains operating in fewer than five countries are less profitable per store than multinational chains" },
        { id: "c", text: "overlooks the possibility that some of the 150 retail chains spent more than 15% of their annual revenue on marketing campaigns" },
        { id: "d", text: "treats a condition that is sufficient for international expansion as though it were a condition that is strictly necessary for international expansion" },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "The study sampled only surviving multinational successes ('150 publicly traded retail chains that currently operate in at least five countries') and observed that 82% had made heavy early automation investments—i.e., P(Automation | Success) = 0.82. The strategist then concludes that P(Success | Automation) is high. This is a classic survivorship bias / base-rate fallacy: if thousands of startups made the same heavy automation investment and went bankrupt from cash depletion, the actual probability of success given automation would be very low.",
    optionExplanations: {
      a: "Correct. Identifying the missing denominator of failed startups that also invested >12% in automation exposes the survivorship bias (confusing P(A|S) with P(S|A)).",
      b: "Incorrect. The conclusion is about the probability of expanding into multiple countries, not per-store profitability.",
      c: "Incorrect. Marketing expenditures do not address the logical gap between observing a trait among survivors and predicting survival from that trait.",
      d: "Incorrect. The strategist actually treats a common trait among successful firms (82%) as sufficient to produce a high probability of success, not as a strict necessary condition.",
    },
    extras: {
      whyCorrect:
        "Observing that most members of Group S have attribute A does not prove that most members with attribute A belong to Group S unless we know the total size of Group A (including non-survivors).",
      strategy:
        "Whenever a GMAT Critical Reasoning stimulus samples only successful outcomes and predicts success from a shared historical trait, look for the answer exposing survivorship bias / the omitted failure group.",
      keyTakeaway:
        "P(Trait | Success) ≠ P(Success | Trait).",
      relatedTopics: ["Survivorship Bias", "Base-Rate Fallacy", "GMAT Critical Reasoning Causal Flaws"],
    },
    tags: ["gmat", "verbal", "critical-reasoning"],
  },
  {
    exam: "gmat",
    category: "Data Insights",
    topic: "Data Sufficiency",
    subtopic: "Weighted Averages and Inequality Constraints",
    type: "mcq",
    difficulty: "difficult",
    stem: "A portfolio consists exclusively of Class X shares priced at $40 per share and Class Y shares priced at $65 per share. Is the total market value of the Class Y shares in the portfolio greater than the total market value of the Class X shares?\n\n(1) More than 40% of the total number of shares in the portfolio are Class Y shares.\n(2) The average (arithmetic mean) price per share of all shares in the portfolio is greater than $50.",
    content: {
      options: [
        { id: "a", text: "Statement (1) ALONE is sufficient, but statement (2) alone is not sufficient." },
        { id: "b", text: "Statement (2) ALONE is sufficient, but statement (1) alone is not sufficient." },
        { id: "c", text: "BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient." },
        { id: "d", text: "EACH statement ALONE is sufficient." },
        { id: "e", text: "Statements (1) and (2) TOGETHER are NOT sufficient." },
      ],
    },
    answer: { correct: "d" },
    rationale:
      "Let x and y be the number of Class X and Class Y shares. The question asks whether 65y > 40x, which simplifies to y / x > 40 / 65 = 8 / 13 (or equivalently, whether Class Y accounts for more than 8 / (8 + 13) = 8 / 21 ≈ 38.1% of the total shares).\nStatement (1): y / (x + y) > 0.40 = 2/5 ≈ 40%. Since 40% > 38.1% (2/5 = 10/25 > 8/21, as 42 > 40), Statement (1) guarantees 65y > 40x. Sufficient.\nStatement (2): (40x + 65y) / (x + y) > 50 => 40x + 65y > 50x + 50y => 15y > 10x => y / x > 10 / 15 = 2 / 3 (so y is more than 40% of total shares). Since 2/3 > 8/13 (26 > 24), Statement (2) also guarantees 65y > 40x. Sufficient.\nThus, EACH statement ALONE is sufficient.",
    optionExplanations: {
      a: "Incorrect. Statement (2) is actually identical to Statement (1) once simplified!",
      b: "Incorrect. Statement (1) is also sufficient on its own.",
      c: "Incorrect. Each statement alone suffices.",
      d: "Correct. Simplifying the target question first reveals that both Statement (1) and Statement (2) assert y/(x+y) > 0.40, which exceeds the 8/21 (≈38.1%) threshold required for 65y > 40x.",
      e: "Incorrect. Both statements are independently sufficient.",
    },
    extras: {
      whyCorrect:
        "Notice that Statement (2) [(40x + 65y)/(x + y) > 50] algebraically reduces to 15y > 10x => y/(x + y) > 2/5 = 40%, which is the exact same condition as Statement (1)! Both easily clear the 8/21 (38.1%) threshold.",
      strategy:
        "In GMAT Data Sufficiency, always algebraically rephrase the target question ('Is 65y > 40x?' -> 'Is y/(x+y) > 8/21?') before looking at the statements. Also remember the GMAT tip: when Statement (1) and Statement (2) are algebraically identical, the answer must be either D or E.",
      keyTakeaway:
        "Rephrasing the question stem into a single ratio threshold prevents unnecessary trial-and-error plugging.",
      relatedTopics: ["GMAT Data Sufficiency Rephrasing", "Weighted Average Inequalities", "Twin-Statement DS Property"],
    },
    tags: ["gmat", "data-insights", "data-sufficiency"],
  },
  {
    exam: "gmat",
    category: "Data Insights",
    topic: "Table Analysis",
    subtopic: "Multi-Metric Operations and Ratio Evaluation",
    type: "matrix",
    difficulty: "moderate",
    exhibit: {
      kind: "table",
      title: "Q3 Operating Metrics Across Five Automated Fulfillment Hubs",
      columns: ["Hub", "Packages Processed (thousands)", "Operating Cost ($ thousands)", "On-Time Delivery Rate (%)", "Floor Area (thousand sq ft)"],
      rows: [
        ["Apex (North)", "1,200", "$1,800", "96.4%", "150"],
        ["Beacon (East)", "950", "$1,520", "98.1%", "100"],
        ["Crest (South)", "1,600", "$2,080", "94.8%", "200"],
        ["Delta (West)", "800", "$1,360", "97.5%", "80"],
        ["Echo (Central)", "1,500", "$2,100", "95.2%", "125"],
      ],
    },
    stem: "For each of the statements below about the five fulfillment hubs in Q3, select 'True' if the statement is verified by the data in the table; otherwise select 'False'.",
    content: {
      rows: [
        { id: "r1", text: "Crest (South) had the lowest operating cost per package processed among the five hubs." },
        { id: "r2", text: "Echo (Central) processed more packages per square foot of floor area than any other hub." },
        { id: "r3", text: "The median on-time delivery rate across the five hubs was 94.8%." },
      ],
      columns: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
    },
    answer: {
      map: {
        r1: "true",
        r2: "true",
        r3: "false",
      },
    },
    rationale:
      "Row 1 (True): Cost per package = Operating Cost / Packages Processed: Crest = $2,080 / 1,600 = $1.30/pkg; Echo = $2,100 / 1,500 = $1.40/pkg; Apex = $1,800 / 1,200 = $1.50/pkg; Beacon = $1,520 / 950 = $1.60/pkg; Delta = $1,360 / 800 = $1.70/pkg. Crest is lowest at $1.30.\nRow 2 (True): Packages per sq ft = Packages / Floor Area: Echo = 1,500 / 125 = 12.0; Delta = 800 / 80 = 10.0; Beacon = 950 / 100 = 9.5; Apex = 1,200 / 150 = 8.0; Crest = 1,600 / 200 = 8.0. Echo is highest at 12.0.\nRow 3 (False): Ordering the five on-time delivery rates gives 94.8%, 95.2%, 96.4%, 97.5%, 98.1%. The median (3rd value) is 96.4%, whereas 94.8% is the minimum (and merely appears in the 3rd row of the unsorted table).",
    extras: {
      whyCorrect:
        "Row 1 ($1.30/pkg) and Row 2 (12.0 pkgs/sq ft) are verified by ratio comparison, whereas Row 3 tests the classic GMAT Table Analysis trap of taking the middle row of an unsorted column instead of sorting values first.",
      strategy:
        "In GMAT Table Analysis, never read the median from the middle row without sorting the column values in ascending order first.",
      keyTakeaway:
        "Use quick mental benchmarks (e.g., 1.5x for Apex, <1.4x for Crest) to compare ratios across rows before dividing to full precision.",
      relatedTopics: ["GMAT Table Analysis", "Ratio Benchmarking", "Median vs. Unsorted Middle Row"],
    },
    tags: ["gmat", "data-insights", "matrix", "table-analysis"],
  },

  /* ================================================================== */
  /* 12. AP EXAMINATIONS ("ap-exams")                                   */
  /* ================================================================== */
  {
    exam: "ap-exams",
    subject: "AP Biology",
    category: "AP Biology",
    topic: "Cellular Energetics",
    subtopic: "Chemiosmosis and Mitochondrial Uncoupling",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "Isolated, metabolically active mitochondria are suspended in an oxygenated buffer containing abundant pyruvate, ADP, and inorganic phosphate (Pi). A researcher adds 2,4-dinitrophenol (DNP), a lipophilic weak acid that diffuses freely across the inner mitochondrial membrane in both its protonated and deprotonated states, dissipating the proton-motive force across the inner membrane without inhibiting any electron transport chain (ETC) protein complexes or ATP synthase directly.",
    stem: "Which of the following changes will occur immediately after the addition of DNP to the mitochondrial suspension?",
    content: {
      options: [
        { id: "a", text: "Oxygen consumption rate will increase, while ATP synthesis via oxidative phosphorylation will decrease sharply." },
        { id: "b", text: "Both oxygen consumption rate and NADH oxidation rate will drop to zero." },
        { id: "c", text: "The pH of the intermembrane space will decrease sharply as protons accumulate outside the matrix." },
        { id: "d", text: "ATP synthase will accelerate oxidative phosphorylation, releasing less thermal energy." },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "Normally, the steep electrochemical proton gradient across the inner mitochondrial membrane exerts back-pressure that slows electron transport through Complexes I–IV. When DNP provides an alternative pathway for H+ to flow back into the matrix, it bypasses ATP synthase—halting chemiosmotic ATP synthesis and releasing the potential energy as heat—while removing thermodynamic back-pressure on the ETC, which causes NADH oxidation and O2 consumption to speed up.",
    optionExplanations: {
      a: "Correct. Uncoupling the proton gradient eliminates chemiosmotic driving force for ATP synthase (decreasing ATP output) while allowing the ETC to pump protons against minimal resistance (increasing O2 consumption and heat production).",
      b: "Incorrect. Dropping O2 consumption and NADH oxidation to zero describes an ETC complex blocker such as cyanide (Complex IV inhibitor) or rotenone (Complex I inhibitor), not an uncoupler.",
      c: "Incorrect. Because protons leak back into the matrix across the inner membrane, [H+] in the intermembrane space decreases, so intermembrane space pH increases toward matrix pH.",
      d: "Incorrect. Without the proton gradient driving rotation of the F0 rotor, ATP synthase cannot synthesize ATP, and energy is dissipated as heat.",
    },
    extras: {
      whyCorrect:
        "Distinguishing uncouplers (DNP, UCP1/thermogenin) from ETC inhibitors (cyanide) is a foundational AP Biology concept: uncouplers accelerate O2 consumption while collapsing ATP yield.",
      strategy:
        "On AP Biology cellular respiration questions, trace three variables separately: (1) H+ gradient, (2) ETC electron flow / O2 consumption, and (3) ATP synthase flux.",
      keyTakeaway:
        "Uncoupling collapses the H+ gradient, which drops ATP synthesis but speeds up ETC electron flow, O2 reduction, and heat dissipation.",
      relatedTopics: ["Oxidative Phosphorylation", "Proton-Motive Force", "Thermogenin (UCP1) vs. Cyanide Inhibition"],
    },
    tags: ["ap-exams", "ap-biology", "cellular-energetics"],
  },
  {
    exam: "ap-exams",
    subject: "AP Chemistry",
    category: "AP Chemistry",
    topic: "Chemical Equilibrium",
    subtopic: "Reaction Quotient (Q vs. K) and Le Châtelier's Principle",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "Consider the gas-phase endothermic synthesis reaction below, which has an equilibrium constant Kp = 4.0 at 700 K:\n\nCO2(g) + H2(g) ⇌ CO(g) + H2O(g)   (ΔH° = +41 kJ/mol)\n\nA rigid 2.0 L reaction vessel at 700 K is initially charged with partial pressures of P(CO2) = 0.50 atm, P(H2) = 0.50 atm, P(CO) = 1.50 atm, and P(H2O) = 1.50 atm.",
    stem: "Which statement correctly identifies the initial reaction quotient Qp and predicts the shift in partial pressures as the system reaches equilibrium at 700 K?",
    content: {
      options: [
        { id: "a", text: "Qp = 3.0; since Qp < Kp, the partial pressure of CO(g) will increase as the system approaches equilibrium." },
        { id: "b", text: "Qp = 9.0; since Qp > Kp, the partial pressure of CO2(g) will increase as the system shifts toward reactants." },
        { id: "c", text: "Qp = 9.0; since Qp > Kp, the partial pressure of H2O(g) will increase as the system shifts toward products." },
        { id: "d", text: "Qp = 4.0; the system is already at chemical equilibrium and no net change in partial pressures will occur." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The reaction quotient is Qp = (P_CO · P_H2O) / (P_CO2 · P_H2) = (1.50 · 1.50) / (0.50 · 0.50) = 2.25 / 0.25 = 9.0. Since Qp (9.0) > Kp (4.0), the ratio of products to reactants is too large, so the net reaction proceeds in the reverse direction (toward reactants), increasing P(CO2) and P(H2) while decreasing P(CO) and P(H2O).",
    optionExplanations: {
      a: "Incorrect. Qp = 3.0 forgets to multiply both species in the numerator and denominator [(1.50/0.50) · (1.50/0.50) = 3 · 3 = 9.0].",
      b: "Correct. Qp = (1.50)^2 / (0.50)^2 = 9.0 > 4.0, driving the net reverse reaction and increasing reactant partial pressures.",
      c: "Incorrect. When Qp > Kp, the system consumes products and forms reactants, so P(H2O) decreases.",
      d: "Incorrect. Qp = 9.0 ≠ 4.0, so the system is not at equilibrium.",
    },
    extras: {
      whyCorrect:
        "Factoring Qp as (1.50 / 0.50) · (1.50 / 0.50) = 3.0 · 3.0 = 9.0 immediately shows Qp > Kp (9.0 > 4.0), requiring a shift to the left (reactants).",
      strategy:
        "Simplify ratios term-by-term before multiplying: (1.50 / 0.50) = 3, so 3 · 3 = 9.0.",
      keyTakeaway:
        "When Q > K, the reverse reaction is favored to reduce the product-to-reactant ratio back down to K.",
      relatedTopics: ["Reaction Quotient Q vs. K", "Gas-Phase Partial Pressure Equilibrium", "ICE Table Shifts"],
    },
    tags: ["ap-exams", "ap-chemistry", "equilibrium"],
  },
  {
    exam: "ap-exams",
    subject: "AP Calculus AB",
    category: "AP Calculus AB",
    topic: "Integration and Accumulation of Change",
    subtopic: "Second Fundamental Theorem of Calculus and Chain Rule",
    type: "mcq",
    difficulty: "moderate",
    stem: "Let F(x) be the function defined by the definite integral F(x) = ∫[from 1 to x^2] sqrt(t^3 + 9) dt for all real numbers x. What is the value of F'(2)?",
    content: {
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "10" },
        { id: "c", text: "34" },
        { id: "d", text: "4 * sqrt(73)" },
      ],
    },
    answer: { correct: "d" },
    rationale:
      "By the Fundamental Theorem of Calculus combined with the Chain Rule, if F(x) = ∫[from a to g(x)] f(t) dt, then F'(x) = f(g(x)) · g'(x). Here, f(t) = sqrt(t^3 + 9) and g(x) = x^2 (so g'(x) = 2x). Therefore, F'(x) = sqrt((x^2)^3 + 9) · (2x) = 2x · sqrt(x^6 + 9). Evaluating at x = 2 gives F'(2) = 2(2) · sqrt(2^6 + 9) = 4 · sqrt(64 + 9) = 4 · sqrt(73).",
    optionExplanations: {
      a: "Incorrect. 5 = sqrt(2^3 + 9) = sqrt(17) mis-evaluated, or evaluating f(2) without substituting g(2) = 4 and multiplying by g'(2) = 4.",
      b: "Incorrect. 10 results from computing 2 · 5 by plugging t = 2 instead of t = x^2 = 4.",
      c: "Incorrect. 34 results from forgetting the square root radical.",
      d: "Correct. F'(2) = f(2^2) · (2 · 2) = sqrt(4^3 + 9) · 4 = 4 · sqrt(73).",
    },
    extras: {
      whyCorrect:
        "Two steps are essential in the FTC with a variable upper limit g(x) = x^2: first substitute t = x^2 = 4 into the integrand (sqrt(4^3 + 9) = sqrt(73)), and second multiply by the derivative of the upper limit g'(2) = 4.",
      strategy:
        "On AP Calculus AB FTC questions with a composite upper limit u = g(x), always write out both factors explicitly: f(g(x)) · g'(x) before plugging in x.",
      keyTakeaway:
        "d/dx [ ∫_{a}^{g(x)} f(t) dt ] = f(g(x)) · g'(x).",
      relatedTopics: ["Second Fundamental Theorem of Calculus", "Chain Rule with Accumulation Functions", "Leibniz Integral Rule"],
    },
    tags: ["ap-exams", "ap-calculus-ab", "ftc"],
  },
  {
    exam: "ap-exams",
    subject: "AP Psychology",
    category: "AP Psychology",
    topic: "Cognition and Memory",
    subtopic: "Proactive vs. Retroactive Interference",
    type: "mcq",
    difficulty: "easy",
    scenario:
      "After studying Spanish vocabulary for four years in high school, Maya enrolls in an introductory Italian course during her first semester of college. When she visits Rome over spring break and tries to recall the new Italian words she studied last month, she repeatedly blurts out the older Spanish equivalents instead.",
    stem: "Which memory phenomenon best explains Maya's difficulty retrieving the newer Italian vocabulary?",
    content: {
      options: [
        { id: "a", text: "Proactive interference" },
        { id: "b", text: "Retroactive interference" },
        { id: "c", text: "Anterograde amnesia" },
        { id: "d", text: "Source-monitoring misattribution" },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "Proactive interference occurs when prior learning (four years of older Spanish vocabulary) disrupts the recall of newly acquired information (the newer Italian vocabulary). Conversely, retroactive interference occurs when new learning disrupts the recall of older, previously encoded memories.",
    optionExplanations: {
      a: "Correct. Prior (old) Spanish memories act forward in time ('pro-active') to interfere with retrieving newer Italian words.",
      b: "Incorrect. Retroactive interference would occur if learning Italian caused Maya to forget the Spanish she had known in high school.",
      c: "Incorrect. Anterograde amnesia is a neurological inability to form new long-term declarative memories following hippocampal damage.",
      d: "Incorrect. Source amnesia involves remembering a fact while forgetting where or from whom it was learned.",
    },
    extras: {
      whyCorrect:
        "Because the older memory (Spanish) is blocking retrieval of the newer target memory (Italian), the interference moves forward in time (proactive).",
      strategy:
        "Use the PORN mnemonic for AP Psychology memory interference: Proactive = Old blocks New; Retroactive = New blocks Old.",
      keyTakeaway:
        "Ask yourself which memory is failing at retrieval: if the NEW memory fails because of the old, it is Proactive interference.",
      relatedTopics: ["Proactive vs. Retroactive Interference", "Retrieval Failure in Long-Term Memory", "Serial Position Effect"],
    },
    tags: ["ap-exams", "ap-psychology", "memory"],
  },
  {
    exam: "ap-exams",
    subject: "AP English Language",
    category: "AP English Language",
    topic: "Rhetorical Analysis",
    subtopic: "Analyzing Scientific Public Rhetoric and Civic Responsibility",
    type: "writing",
    difficulty: "difficult",
    exhibit: {
      kind: "passage",
      title: "Excerpt from Dr. Eleanor Vance's Address to the National Symposium on Civic Science (1964)",
      text: "We have grown accustomed, in this dazzled mid-century of split atoms and orbital telemetry, to speak of scientific progress as though it were a locomotive racing along iron rails laid down by destiny—an engine that ordinary citizens may admire from the station platform, or dread from the crossing gate, yet never steer. Such fatalism flatters the technocrat and absolves the voter, but it betrays the republic.\n\nA laboratory discovery is neither a moral imperative nor a self-executing statute. When we synthesize a persistent pesticide that silences the pest at the cost of the watershed, or unlock an industrial process that multiplies today's harvest while mortgaging tomorrow's soil, the equation does not balance itself inside a test tube. It balances—or fails to balance—in the town hall, the legislature, and the conscience of an informed public. If citizens surrender their duty to question the ends of technology simply because they cannot recite the calculus of its means, then democracy becomes a spectator sport in the very century when the stakes of the game have become planetary.",
    },
    stem: "Read the excerpt carefully. Write an essay that analyzes the rhetorical choices Dr. Eleanor Vance makes to convey her argument about the relationship between scientific innovation and democratic citizenship.",
    content: {
      prompt:
        "In a well-developed rhetorical analysis essay, examine how Dr. Eleanor Vance uses rhetorical strategies (such as extended metaphor, balanced antithesis, and conditional warning) to persuade her audience that ordinary citizens must actively govern technological application.",
      minWords: 250,
      taskLabel: "AP English Language Free-Response Question 2 — Rhetorical Analysis",
      rubric: [
        "Thesis (0–1 pt): Presents a defensible thesis that analyzes specific rhetorical choices Vance makes to advance her purpose.",
        "Evidence and Commentary (0–4 pts): Integrates specific textual evidence and explains HOW the rhetorical choices affect the audience and support the argument.",
        "Sophistication (0–1 pt): Situates the rhetorical situation within Cold War / mid-century anxieties over technocracy and analyzes the interplay of style and argument.",
      ],
    },
    answer: {
      sample:
        "Addressing the National Symposium on Civic Science in 1964—an era defined by both awe and anxiety over Cold War nuclear power, space exploration, and chemical industrialization—Dr. Eleanor Vance confronts a pervasive civic complacency toward technological authority. To dismantle the notion that non-scientists must defer passively to experts, Vance deploys an extended locomotive metaphor, sharp syntactic antithesis, and an urgent closing conditional warning, ultimately compelling her audience to reclaim democratic stewardship over scientific power.\n\nVance opens by unifying herself with her listeners through inclusive first-person plural pronouns ('We have grown accustomed'), disarming defensiveness before exposing the flaw in popular thinking. She characterizes technological determinism through the vivid extended metaphor of a 'locomotive racing along iron rails laid down by destiny,' casting everyday citizens as mere bystanders watching from a 'station platform' or trembling at a 'crossing gate.' By framing popular awe and fear as equally passive postures, Vance prepares her audience for the terse, epigrammatic pivot that closes the paragraph: 'Such fatalism flatters the technocrat and absolves the voter, but it betrays the republic.' The parallel triad of active verbs shifts responsibility directly onto the citizenry, showing that deference to technical elites is not humility, but civic abdication.\n\nIn the second paragraph, Vance demystifies scientific authority by contrasting the neutral mechanics of the laboratory with the value judgments of public life. Using balanced antithesis—juxtaposing a pesticide that 'silences the pest at the cost of the watershed' and an industrial method that 'multiplies today's harvest while mortgaging tomorrow's soil'—she illustrates that technological trade-offs are inherently moral and economic rather than purely empirical. Her financial metaphor of 'mortgaging tomorrow's soil' appeals to the audience's intergenerational conscience, making ecological degradation concrete. Finally, Vance seals her argument with a high-stakes conditional warning: if citizens refuse to evaluate the 'ends of technology' merely because they lack the 'calculus of its means,' democracy degenerates into a 'spectator sport' with 'planetary' consequences. By separating technical 'means' from ethical 'ends,' Vance empowers lay citizens, proving that democratic judgment remains the ultimate arbiter of scientific progress.",
    },
    rationale:
      "A 6/6 AP English Language Rhetorical Analysis essay connects specific rhetorical choices (the locomotive metaphor, parallel antithesis between 'means' and 'ends', Cold War/post-Silent Spring historical context) directly to their persuasive effect on the audience.",
    extras: {
      whyCorrect:
        "Rather than merely listing devices ('Vance uses a metaphor and parallelism'), the essay explains the rhetorical function of each choice in moving the audience from passive deference to active democratic responsibility.",
      strategy:
        "In AP Lang Q2, always pair WHAT the speaker does (e.g., contrasts technical 'means' with moral 'ends') with WHY it moves the specific audience (reassures lay citizens that they do not need advanced calculus to judge societal trade-offs).",
      keyTakeaway:
        "Commentary must link rhetorical form to argumentative function and audience effect.",
      relatedTopics: ["AP Lang Q2 Rubric (1-4-1)", "Extended Metaphor and Antithesis Analysis", "Rhetorical Situation and Exigence"],
    },
    tags: ["ap-exams", "ap-english-language", "writing", "rhetorical-analysis"],
  },

  /* ================================================================== */
  /* 13. CPA EXAM ("cpa")                                               */
  /* ================================================================== */
  {
    exam: "cpa",
    category: "Auditing and Attestation (AUD)",
    topic: "Audit Evidence and Substantive Procedures",
    subtopic: "Accounts Receivable Confirmations and Audit Risk (AU-C 505)",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "During the audit of Crestline Manufacturing Corp.'s Year 4 financial statements, the engagement team assesses the combined risk of material misstatement for trade accounts receivable existence as low and internal controls over revenue and cash receipts as operating effectively. Crestline's customer base consists of 4,200 small retail hardware accounts, each carrying a small homogeneous balance, with a historically documented confirmation response rate below 12%.",
    stem: "Under AICPA auditing standards (AU-C 505), in which circumstance is the auditor most justified in using negative confirmation requests as the sole substantive confirmation procedure, OR omitting external confirmations altogether in favor of alternative substantive analytical and subsequent cash-receipt testing?",
    content: {
      options: [
        { id: "a", text: "Negative confirmations may be used as the sole substantive confirmation procedure here because the low expected response rate of 12% guarantees that 88% of recipients agree with their stated balances." },
        { id: "b", text: "Negative confirmations are inappropriate when the auditor has reason to believe recipients will disregard the requests; the auditor should perform alternative substantive procedures such as examining subsequent cash collections and shipping documents." },
        { id: "c", text: "External confirmations of accounts receivable can never be omitted under AICPA standards unless total accounts receivable are less than 1% of total assets." },
        { id: "d", text: "Negative confirmations should be sent exclusively to the largest 5% of customer balances where control risk is assessed at maximum." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Under AU-C 505, negative confirmations provide less persuasive audit evidence than positive confirmations and may be used as the sole substantive procedure ONLY when ALL four conditions are met: (1) low assessed risk of material misstatement, (2) a large number of small, homogeneous account balances, (3) a very low exception rate is expected, AND (4) the auditor has no reason to believe that recipients will disregard the confirmation requests. Here, a historical response rate below 12% indicates recipients routinely disregard confirmation requests, making negative confirmations ineffective; moreover, under AU-C 330.20, the auditor may omit external confirmations of AR when they would be ineffective and perform alternative substantive procedures (such as testing subsequent cash receipts and shipping documents).",
    optionExplanations: {
      a: "Incorrect. An unreturned negative confirmation does not verify that the recipient checked and agreed with the balance, especially when historical response rates show recipients disregard requests.",
      b: "Correct. Because recipients are likely to disregard requests (violating the 4th requirement for negative confirmations) and confirmations would be ineffective, the auditor should rely on alternative substantive procedures such as vouching subsequent cash collections.",
      c: "Incorrect. AU-C 330 permits omitting AR confirmations when accounts receivable are immaterial, when confirmations would be ineffective, or when RMM is low and other substantive procedures overcome the risk.",
      d: "Incorrect. Large balances and high control risk require positive confirmations, never negative confirmations.",
    },
    extras: {
      whyCorrect:
        "AU-C 505 requires all four criteria to be met simultaneously for negative confirmations; knowing that customers historically ignore confirmation requests defeats criterion 4 and points to alternative procedures.",
      strategy:
        "On CPA AUD questions testing negative confirmations, check all 4 mandatory conditions: Low RMM + Large number of small homogeneous balances + Low expected exception rate + No reason to believe recipients will disregard requests.",
      keyTakeaway:
        "When external confirmations are historically ineffective, examining subsequent cash receipts (remittance advices and bank deposits) provides strong alternative evidence.",
      relatedTopics: ["AU-C 505 External Confirmations", "Positive vs. Negative Confirmations", "Subsequent Cash Receipts Testing"],
    },
    tags: ["cpa", "aud", "audit-evidence"],
  },
  {
    exam: "cpa",
    category: "Financial Accounting and Reporting (FAR)",
    topic: "Lease Accounting (ASC 842)",
    subtopic: "Initial Measurement of Finance Lease Liability and Right-of-Use Asset",
    type: "numeric",
    difficulty: "difficult",
    scenario:
      "On January 1, Year 1, Vanguard MedTech Corp. enters into a noncancelable 5-year finance lease for specialized CNC fabrication equipment. Annual lease payments of $100,000 are payable at the END of each year (December 31, Years 1 through 5). Vanguard knows the lessor's implicit interest rate is 6% per annum (present value of an ordinary annuity of $1 at 6% for 5 periods = 4.21236). Prior to lease commencement, Vanguard paid $18,000 in initial direct costs (legal commissions to execute the lease) and received a $10,000 cash lease incentive from the lessor at commencement.",
    stem: "Under U.S. GAAP (ASC 842), at what dollar amount should Vanguard recognize the initial Right-of-Use (ROU) asset on its balance sheet on January 1, Year 1? (Round your answer to the nearest whole dollar.)",
    content: {
      unit: "USD",
      decimals: 0,
    },
    answer: {
      value: 429236,
      tolerance: 1,
    },
    rationale:
      "Step 1: Compute the initial lease liability = Present value of unpaid lease payments discounted at the lessor's known implicit rate (6%) = $100,000 × 4.21236 = $421,236.\nStep 2: Compute the initial Right-of-Use (ROU) asset = Initial lease liability ($421,236) + Initial direct costs ($18,000) - Lease incentives received ($10,000) = $429,236.",
    extras: {
      whyCorrect:
        "Under ASC 842, initial direct costs increase the ROU asset while lease incentives received at or before commencement decrease the ROU asset ($421,236 + $18,000 - $10,000 = $429,236).",
      strategy:
        "Memorize the ASC 842 ROU Asset bridge formula: ROU Asset = Lease Liability + Prepaid Lease Payments + Initial Direct Costs - Lease Incentives Received.",
      keyTakeaway:
        "When the lessor's implicit rate is known to the lessee, the lessee MUST use the implicit rate rather than its incremental borrowing rate.",
      relatedTopics: ["ASC 842 Lease Accounting", "Right-of-Use Asset Measurement", "Implicit Rate vs. Incremental Borrowing Rate"],
    },
    tags: ["cpa", "far", "numeric", "leases"],
  },
  {
    exam: "cpa",
    category: "Financial Accounting and Reporting (FAR)",
    topic: "Subsequent Events (ASC 855)",
    subtopic: "Recognized (Type I) vs. Nonrecognized (Type II) Subsequent Events",
    type: "matrix",
    difficulty: "moderate",
    scenario:
      "Solstice Enterprises Inc., an SEC filer with a December 31, Year 1 fiscal year-end, issues its audited Year 1 financial statements on February 25, Year 2. Evaluate each material event occurring between January 1, Year 2 and February 25, Year 2.",
    stem: "For each event below, select the proper accounting treatment in Solstice's December 31, Year 1 financial statements under ASC 855.",
    content: {
      rows: [
        {
          id: "r1",
          text: "On January 18, Year 2, a customer whose account receivable carried a $450,000 balance at December 31, Year 1 after years of deteriorating liquidity filed for Chapter 7 bankruptcy liquidation.",
        },
        {
          id: "r2",
          text: "On February 4, Year 2, an electrical fire completely destroyed Solstice's uninsured regional distribution warehouse in Ohio.",
        },
        {
          id: "r3",
          text: "On February 12, Year 2, Solstice settled a patent infringement lawsuit that had been pending since Year 0 for $900,000; Solstice had previously accrued a $600,000 contingent liability at December 31, Year 1.",
        },
      ],
      columns: [
        { id: "recognize", text: "Recognize in Year 1 Financial Statements (Type I)" },
        { id: "disclose_only", text: "Footnote Disclosure Only — Do Not Adjust Year 1 Balances (Type II)" },
      ],
    },
    answer: {
      map: {
        r1: "recognize",
        r2: "disclose_only",
        r3: "recognize",
      },
    },
    rationale:
      "Under ASC 855:\n- Row 1 (Type I — Recognize): A customer bankruptcy after year-end caused by pre-existing financial deterioration provides additional evidence of credit impairment that existed at the December 31, Year 1 balance sheet date.\n- Row 2 (Type II — Disclose Only): A natural disaster or fire occurring in Year 2 is a condition that arose after the balance sheet date; it does not adjust Year 1 balances but requires footnote disclosure if material.\n- Row 3 (Type I — Recognize): Settlement of litigation before financial statements are issued for an underlying event that occurred prior to the balance sheet date requires adjusting the Year 1 accrued loss from $600,000 to the actual $900,000 settlement amount.",
    extras: {
      whyCorrect:
        "Type I events illuminate conditions existing ON or BEFORE December 31, Year 1 (long-standing customer insolvency; pre-existing lawsuit), whereas Type II events reflect casualties or transactions arising AFTER December 31, Year 1 (February fire).",
      strategy:
        "Ask one question for every CPA FAR subsequent event: 'Did the underlying casualty/condition already exist on December 31?' Warning: if a customer went bankrupt ONLY because a Year 2 tornado destroyed the customer's plant, that would be Type II!",
      keyTakeaway:
        "Pre-existing litigation settlements and progressive customer bankruptcies before the issuance date are Type I recognized subsequent events.",
      relatedTopics: ["ASC 855 Subsequent Events", "ASC 450 Loss Contingencies", "SEC Filer Issuance Date Cutoff"],
    },
    tags: ["cpa", "far", "matrix", "subsequent-events"],
  },
  {
    exam: "cpa",
    category: "Taxation and Regulation (REG)",
    topic: "S Corporations",
    subtopic: "Shareholder Stock Basis, Debt Basis, and Loss Limitations",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "On January 1, Year 1, Elena owns 100% of the stock of Horizon Solar Inc., a calendar-year S corporation. At the beginning of Year 1, Elena's adjusted basis in her Horizon stock is $45,000, and she holds a direct shareholder loan receivable from Horizon with a basis of $15,000. In addition, Horizon has a $30,000 bank line of credit that Elena has personally guaranteed (Elena has made no payments on the guarantee). During Year 1, Horizon distributes $20,000 cash to Elena and incurs an ordinary business loss of $52,000.",
    stem: "How much of Horizon's $52,000 ordinary business loss may Elena deduct on her Year 1 individual federal income tax return (assuming the at-risk and passive activity rules do not further limit the deduction), and what are her ending stock and debt bases at December 31, Year 1?",
    content: {
      options: [
        { id: "a", text: "Deductible loss: $40,000; Ending stock basis: $0; Ending debt basis: $0" },
        { id: "b", text: "Deductible loss: $52,000; Ending stock basis: $0; Ending debt basis: $18,000" },
        { id: "c", text: "Deductible loss: $45,000; Ending stock basis: $0; Ending debt basis: $15,000" },
        { id: "d", text: "Deductible loss: $52,000; Ending stock basis: $0; Ending debt basis: $0" },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "Under IRC §1366 and §1368, S corporation stock basis is adjusted in strict statutory order: (1) increased for income items, (2) decreased for non-dividend distributions, (3) decreased for non-deductible expenses, and (4) decreased for losses and deductions.\n- Beginning stock basis = $45,000.\n- Step 1 (Distributions BEFORE losses): The $20,000 cash distribution is tax-free and reduces stock basis from $45,000 to $25,000.\n- Step 2 (Losses against remaining stock basis): $25,000 of the $52,000 ordinary loss reduces stock basis to $0 (leaving $27,000 of loss remaining).\n- Step 3 (Losses against direct shareholder debt basis): Only bona fide direct indebtedness from the S corporation to the shareholder ($15,000) creates debt basis; a mere personal guarantee of a third-party bank loan ($30,000) creates ZERO debt basis until the shareholder actually makes a payment on the guarantee. Thus, $15,000 of the remaining loss reduces Elena's debt basis to $0.\n- Total deductible loss = $25,000 (stock basis) + $15,000 (debt basis) = $40,000. The remaining $12,000 loss is suspended and carried forward indefinitely.",
    optionExplanations: {
      a: "Correct. After reducing stock basis by the $20,000 distribution (to $25,000), Elena absorbs $25,000 of loss against stock basis and $15,000 against direct debt basis, for a $40,000 deduction and $0 ending bases.",
      b: "Incorrect. A shareholder's personal guarantee of an S corporation's bank loan does not create debt basis under IRC §1366(d).",
      c: "Incorrect. Distributions reduce stock basis before losses, and losses in excess of stock basis also reduce direct shareholder debt basis.",
      d: "Incorrect. Only $40,000 of basis ($25,000 post-distribution stock basis + $15,000 direct debt basis) is available to absorb the Year 1 loss.",
    },
    extras: {
      whyCorrect:
        "Two high-yield CPA REG rules combine here: (1) S-corp distributions reduce stock basis BEFORE losses are applied, and (2) personal guarantees of corporate bank debt do NOT give an S-corp shareholder debt basis.",
      strategy:
        "Apply the S-corp basis ordering rule strictly: Income (+) -> Distributions (-) -> Nondeductible expenses (-) -> Losses (-), and never include guaranteed bank loans in S-corp debt basis (unlike general partner recourse liabilities in a partnership).",
      keyTakeaway:
        "S corporation shareholders only acquire debt basis from direct bona fide loans to the corporation, whereas partners acquire basis from their share of partnership liabilities.",
      relatedTopics: ["IRC Section 1366 S Corp Basis Ordering", "Direct Shareholder Debt vs. Loan Guarantees", "Suspended S Corp Losses"],
    },
    tags: ["cpa", "reg", "s-corporations"],
  },
  {
    exam: "cpa",
    category: "Discipline",
    topic: "Business Analysis and Reporting (BAR) — Capital Structure and Variance Analysis",
    subtopic: "Weighted Average Cost of Capital (WACC) and Fixed Overhead Variances",
    type: "cloze",
    difficulty: "moderate",
    stem: "Complete the financial analysis memorandum below by selecting the correct entry for each blank from the drop-down menus.",
    content: {
      template:
        "Atlas Precision Corp. maintains a target capital structure of 40% long-term debt and 60% common equity. The company's pre-tax yield to maturity on newly issued bonds is 7.5%, its marginal corporate income tax rate is 20%, and its cost of common equity estimated via the Capital Asset Pricing Model (CAPM) is 11.0%. Consequently, Atlas's after-tax Weighted Average Cost of Capital (WACC) is {{b1}}. In addition, during Q4, Atlas's manufacturing division recorded actual fixed factory overhead incurred of $310,000, budgeted fixed factory overhead of $295,000, and applied fixed factory overhead (based on standard hours allowed for actual output) of $320,000. This resulted in a fixed overhead production-volume variance of {{b2}}.",
      blanks: {
        b1: [
          { id: "9.0%", text: "9.0%" },
          { id: "9.6%", text: "9.6%" },
          { id: "8.4%", text: "8.4%" },
        ],
        b2: [
          { id: "25000_fav", text: "$25,000 Favorable" },
          { id: "15000_unfav", text: "$15,000 Unfavorable" },
          { id: "10000_fav", text: "$10,000 Favorable" },
        ],
      },
    },
    answer: {
      blanks: {
        b1: "9.0%",
        b2: "25000_fav",
      },
    },
    rationale:
      "Blank 1: After-tax cost of debt = 7.5% × (1 - 0.20) = 6.0%. WACC = (0.40 × 6.0%) + (0.60 × 11.0%) = 2.4% + 6.6% = 9.0%.\nBlank 2: Fixed overhead production-volume variance = Applied Fixed Overhead - Budgeted Fixed Overhead = $320,000 - $295,000 = $25,000 Favorable (because actual production exceeded denominator volume, absorbing $25,000 more fixed overhead than budgeted). Note that $310,000 - $295,000 = $15,000 Unfavorable is the fixed overhead spending (budget) variance, and $320,000 - $310,000 = $10,000 overapplied is the total net fixed overhead variance.",
    extras: {
      whyCorrect:
        "WACC incorporates the tax shield on debt [0.40 × 7.5%(1 - 0.20) + 0.60 × 11.0% = 9.0%], and fixed overhead production-volume variance compares Budgeted ($295,000) against Applied ($320,000) to yield $25,000 Favorable.",
      strategy:
        "Keep the three fixed overhead benchmarks in order: Actual ($310k) vs. Budgeted ($295k) = Spending Variance ($15k U); Budgeted ($295k) vs. Applied ($320k) = Production-Volume Variance ($25k F).",
      keyTakeaway:
        "When Applied Fixed Overhead exceeds Budgeted Fixed Overhead, capacity utilization exceeded plan, resulting in a Favorable production-volume variance.",
      relatedTopics: ["After-Tax WACC Calculation", "Fixed Overhead Spending vs. Volume Variance", "CPA BAR Cost Accounting"],
    },
    tags: ["cpa", "discipline", "bar", "cloze"],
  },

  /* ================================================================== */
  /* 14. CFA PROGRAM ("cfa")                                            */
  /* ================================================================== */
  {
    exam: "cfa",
    category: "Ethical and Professional Standards",
    topic: "Standard II(A): Material Nonpublic Information",
    subtopic: "Mosaic Theory vs. Insider Tipping",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "Marcus Vance, CFA, is a semiconductor equity analyst covering NanoLith Corp. To assess demand for NanoLith's next-generation extreme ultraviolet (EUV) lithography systems, Vance reviews NanoLith's public SEC filings, interviews three independent specialty quartz-glass sub-suppliers about their factory shift utilization, and analyzes publicly available port customs manifests in Rotterdam. Combining these fragments, Vance concludes that NanoLith's quarterly unit shipments will beat consensus estimates by 22% and issues an immediate 'Strong Buy' report to his firm's clients.",
    stem: "Did Vance violate CFA Institute Standard II(A), Material Nonpublic Information?",
    content: {
      options: [
        { id: "a", text: "Yes, because his conclusion that shipments will beat consensus by 22% is material and not yet known to the investing public." },
        { id: "b", text: "Yes, because interviewing sub-suppliers about factory shift utilization constitutes misappropriation of confidential supply-chain data." },
        { id: "c", text: "No, because reaching an investment conclusion by combining public information with nonmaterial nonpublic observations is permitted under the Mosaic Theory." },
        { id: "d", text: "No, provided Vance waits 48 hours after publishing the report before allowing his firm's discretionary accounts to purchase NanoLith shares." },
      ],
    },
    answer: { correct: "c" },
    rationale:
      "Under CFA Institute Standard II(A) (Material Nonpublic Information), financial analysts are explicitly permitted to use the Mosaic Theory: combining material public information (SEC filings, public customs manifests) with nonmaterial nonpublic information (independent sub-supplier shift observations) to derive a material investment conclusion without violating insider-trading rules.",
    optionExplanations: {
      a: "Incorrect. An analyst's proprietary analytical conclusion does not constitute material nonpublic information under Standard II(A) when derived from public and nonmaterial nonpublic inputs.",
      b: "Incorrect. Independent channel checks with sub-suppliers regarding general shift utilization provide nonmaterial nonpublic data and do not breach a fiduciary duty of the issuer.",
      c: "Correct. The Mosaic Theory protects perceptive analysts who piece together public data and nonmaterial nonpublic channel observations into actionable research.",
      d: "Incorrect. Standard III(B) Fair Dealing requires simultaneous dissemination to all clients, not a 48-hour freeze on discretionary client accounts after publication.",
    },
    extras: {
      whyCorrect:
        "None of the individual nonpublic pieces (sub-supplier shift observations) would be material on a standalone basis, nor were they obtained via breach of an insider fiduciary duty.",
      strategy:
        "On CFA Ethics questions testing Standard II(A), check the source and materiality of the raw inputs: Public Info + Nonmaterial Nonpublic Info = Valid Mosaic Theory.",
      keyTakeaway:
        "Mosaic Theory encourages rigorous fundamental channel research while prohibiting trading on material nonpublic tips leaked by corporate insiders.",
      relatedTopics: ["CFA Standard II(A) Material Nonpublic Information", "Mosaic Theory", "Channel Checks and Expert Networks"],
    },
    tags: ["cfa", "ethics", "mosaic-theory"],
  },
  {
    exam: "cfa",
    category: "Quantitative Methods",
    topic: "Probability Concepts",
    subtopic: "Bayes' Formula and Conditional Credit Default Updating",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "A fixed-income quantitative strategist estimates that the unconditional prior probability that a high-yield bond issuer will experience a liquidity default over the next 12 months is P(Default) = 0.10 (and thus P(No Default) = 0.90). The strategist uses an early-warning cash-flow screen that triggers a 'Distress Alert' in 80% of issuers that subsequently default [P(Alert | Default) = 0.80], but also triggers a false-positive 'Distress Alert' in 15% of issuers that do NOT default [P(Alert | No Default) = 0.15].",
    stem: "If the early-warning screen triggers a 'Distress Alert' for a bond issuer today, what is the updated (posterior) probability that the issuer will actually default over the next 12 months?",
    content: {
      options: [
        { id: "a", text: "21.5%" },
        { id: "b", text: "37.2%" },
        { id: "c", text: "53.3%" },
        { id: "d", text: "72.0%" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Step 1 (Total Probability of an Alert): P(Alert) = P(Alert | Default)·P(Default) + P(Alert | No Default)·P(No Default) = (0.80 × 0.10) + (0.15 × 0.90) = 0.080 + 0.135 = 0.215 (21.5%).\nStep 2 (Bayes' Formula): P(Default | Alert) = [P(Alert | Default) · P(Default)] / P(Alert) = 0.080 / 0.215 = 80 / 215 = 16 / 43 ≈ 0.3721 (37.2%).",
    optionExplanations: {
      a: "Incorrect. 21.5% is the unconditional total probability P(Alert) that the screen triggers an alert across all issuers (the Bayes denominator).",
      b: "Correct. P(Default | Alert) = 0.080 / (0.080 + 0.135) = 0.080 / 0.215 ≈ 37.2%.",
      c: "Incorrect. 53.3% results from dividing 0.080 by 0.150 (ignoring the 0.90 prior weight on No Default).",
      d: "Incorrect. 72.0% is 0.80 × 0.90, which confuses the conditional probabilities.",
    },
    extras: {
      whyCorrect:
        "Out of 1,000 issuers, 100 default (and 80 trigger an alert) while 900 do not default (and 135 trigger a false alert). Given an alert (80 + 135 = 215 total alerts), the fraction that actually default is 80 / 215 ≈ 37.2%.",
      strategy:
        "Use a hypothetical cohort of 1,000 firms on CFA Bayes' Formula problems: 100 Default -> 80 True Alerts; 900 Non-Default -> 135 False Alerts; Posterior = 80 / (80 + 135) = 37.2%.",
      keyTakeaway:
        "Always check whether an answer choice is the total probability denominator P(Alert) = 21.5%—that is the #1 distractor on CFA Quantitative Methods exams.",
      relatedTopics: ["Bayes' Formula", "Total Probability Rule", "Credit Risk Early-Warning Models"],
    },
    tags: ["cfa", "quant-methods", "bayes-formula"],
  },
  {
    exam: "cfa",
    category: "Financial Statement Analysis",
    topic: "Cash Flow Statement Analysis",
    subtopic: "Free Cash Flow to the Firm (FCFF) from Net Income",
    type: "numeric",
    difficulty: "difficult",
    scenario:
      "For fiscal year 2026, Meridian Industrial PLC (reporting under U.S. GAAP) recorded the following figures (in $ millions):\n• Net Income: $240\n• Depreciation & Amortization (non-cash charges): $65\n• Interest Expense: $40\n• Effective & Marginal Income Tax Rate: 25%\n• Capital Expenditures (Fixed Capital Investment): $110\n• Increase in Working Capital (Excluding Cash and Short-Term Debt): $25",
    stem: "Calculate Meridian Industrial's Free Cash Flow to the Firm (FCFF) for fiscal year 2026, in $ millions.",
    content: {
      unit: "$ millions",
      decimals: 0,
    },
    answer: {
      value: 200,
      tolerance: 0,
    },
    rationale:
      "Starting from Net Income (NI), the CFA formula for Free Cash Flow to the Firm is:\nFCFF = NI + NCC + Int(1 - Tax Rate) - FCInv - WCInv\n- NI = $240\n- Non-cash charges (NCC) = $65\n- After-tax interest add-back = $40 × (1 - 0.25) = $30\n- Fixed capital investment (FCInv) = $110\n- Working capital investment (WCInv) = $25\nFCFF = 240 + 65 + 30 - 110 - 25 = $200 million.",
    extras: {
      whyCorrect:
        "Note that Cash Flow from Operations (CFO) = NI + NCC - WCInv = 240 + 65 - 25 = $280 million. Adding after-tax interest ($30 million) and subtracting CapEx ($110 million) gives FCFF = 280 + 30 - 110 = $200 million.",
      strategy:
        "Never add back gross interest expense ($40M) when computing FCFF; interest was tax-deductible on the income statement, so only the after-tax interest outflow Int(1 - t) = $30M belongs to bondholders.",
      keyTakeaway:
        "FCFF = NI + NCC + Int(1 - t) - FCInv - WCInv.",
      relatedTopics: ["Free Cash Flow to the Firm (FCFF)", "Free Cash Flow to Equity (FCFE)", "After-Tax Interest Adjustment"],
    },
    tags: ["cfa", "fsa", "numeric", "fcff"],
  },
  {
    exam: "cfa",
    category: "Fixed Income",
    topic: "Yield-Based Bond Duration and Convexity",
    subtopic: "Percentage Price Change Approximation with Duration and Convexity",
    type: "numeric",
    difficulty: "difficult",
    scenario:
      "An institutional portfolio holds an option-free corporate bond currently trading at par with an annual modified duration (ModDur) of 7.50 and an annual convexity (Conv) of 68.0.",
    stem: "If the bond's yield to maturity instantaneously increases by 100 basis points (+1.00%, or Δy = +0.01), what is the approximate percentage change in the bond's full price using the second-order duration-plus-convexity approximation? (Express your answer as a percentage to two decimal places, e.g., -7.16.)",
    content: {
      unit: "%",
      decimals: 2,
    },
    answer: {
      value: -7.16,
      tolerance: 0.01,
    },
    rationale:
      "The second-order Taylor series approximation for the fractional price change of an option-free bond is:\n%ΔPV_Full ≈ (-ModDur × Δy) + [0.5 × Conv × (Δy)^2]\nSubstituting ModDur = 7.50, Conv = 68.0, and Δy = +0.01:\n- Duration term: -7.50 × 0.01 = -0.0750 (-7.50%)\n- Convexity term: +0.5 × 68.0 × (0.01)^2 = +34.0 × 0.0001 = +0.0034 (+0.34%)\nTotal approximate price change = -7.50% + 0.34% = -7.16%.",
    extras: {
      whyCorrect:
        "Positive convexity (+68.0) always cushions the price decline when yields rise (and amplifies the price gain when yields fall), adding +0.34% to the first-order duration estimate of -7.50% to yield -7.16%.",
      strategy:
        "Remember the factor of 1/2 (0.5) in front of the convexity term: 0.5 × Conv × (Δy)^2. For a 100 bps (0.01) shift, (Δy)^2 = 0.0001, so the convexity contribution in percentage points is simply 0.5 × Conv × 0.01 = +0.34%.",
      keyTakeaway:
        "For an option-free bond with positive convexity, the convexity adjustment is ALWAYS positive regardless of whether Δy is positive or negative.",
      relatedTopics: ["Modified Duration", "Convexity Adjustment", "Bond Price-Yield Relationship"],
    },
    tags: ["cfa", "fixed-income", "numeric", "duration-convexity"],
  },
  {
    exam: "cfa",
    category: "Equity Investments",
    topic: "Equity Valuation: Concepts and Basic Tools",
    subtopic: "Gordon Growth Model and Sustainable Growth Rate",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "AeraGrid Utilities just paid an annual dividend of D0 = $2.50 per share. The company maintains a stable return on equity (ROE) of 15.0% and a constant dividend payout ratio of 60%. Equity analysts estimate AeraGrid's required rate of return on equity (ke) at 11.0%.",
    stem: "Assuming AeraGrid's dividend grows indefinitely at its sustainable growth rate, what is the intrinsic value per share of AeraGrid common stock according to the Gordon Growth Model?",
    content: {
      options: [
        { id: "a", text: "$50.00" },
        { id: "b", text: "$53.00" },
        { id: "c", text: "$125.00" },
        { id: "d", text: "$136.25" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Step 1 (Sustainable Growth Rate g): Retention ratio b = 1 - Payout Ratio = 1 - 0.60 = 0.40 (40%). Thus, g = b × ROE = 0.40 × 15.0% = 6.0% (0.06).\nStep 2 (Next Year's Expected Dividend D1): Since D0 = $2.50 was just paid, D1 = D0 × (1 + g) = $2.50 × 1.06 = $2.65.\nStep 3 (Gordon Growth Model V0): V0 = D1 / (ke - g) = $2.65 / (0.11 - 0.06) = $2.65 / 0.05 = $53.00.",
    optionExplanations: {
      a: "Incorrect. $50.00 = $2.50 / 0.05 uses D0 ($2.50) in the numerator instead of next year's dividend D1 ($2.65).",
      b: "Correct. g = (1 - 0.60) × 15% = 6%, D1 = $2.50 × 1.06 = $2.65, and V0 = $2.65 / (0.11 - 0.06) = $53.00.",
      c: "Incorrect. $125.00 results from using the 60% payout ratio instead of the 40% retention ratio to compute g = 0.60 × 15% = 9% (and using D0).",
      d: "Incorrect. $136.25 results from using g = 9% and D1 = $2.50 × 1.09 = $2.725 ($2.725 / 0.02 = $136.25).",
    },
    extras: {
      whyCorrect:
        "Two classic CFA Equity traps are avoided: (1) using retention ratio b = 1 - 0.60 = 0.40 (not the 0.60 payout ratio) in g = b × ROE, and (2) compounding D0 by (1 + g) to get D1 = $2.65.",
      strategy:
        "Underline 'just paid' (D0) versus 'expected to pay next year' (D1) in every CFA dividend discount question, and notice that $50.00 (D0 / 0.05) and $53.00 (D1 / 0.05) are always both present among the choices.",
      keyTakeaway:
        "V0 = [D0 × (1 + g)] / (ke - g), where g = (1 - Dividend Payout Ratio) × ROE.",
      relatedTopics: ["Gordon Growth Model (Constant Growth DDM)", "Sustainable Growth Rate (PRAT Model)", "Intrinsic Value vs. Market Price"],
    },
    tags: ["cfa", "equity", "gordon-growth-model"],
  },

  /* ================================================================== */
  /* 15. CMA ("cma")                                                    */
  /* ================================================================== */
  {
    exam: "cma",
    category: "Financial Planning, Performance, and Analytics",
    topic: "Cost and Variance Measures",
    subtopic: "Direct Labor Rate and Efficiency Variances",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "Kestrel Avionics manufactures carbon-fiber drone airframes using a standard cost system. The standard direct labor allowance for each airframe is 4.0 direct labor hours at a standard wage rate of $32.00 per hour. During November, Kestrel produced 1,500 airframes using 5,800 actual direct labor hours at a total actual direct labor payroll cost of $191,400.",
    stem: "What were Kestrel Avionics' direct labor rate variance and direct labor efficiency variance for November?",
    content: {
      options: [
        { id: "a", text: "Rate variance: $5,800 Unfavorable; Efficiency variance: $6,400 Favorable" },
        { id: "b", text: "Rate variance: $5,800 Favorable; Efficiency variance: $6,400 Unfavorable" },
        { id: "c", text: "Rate variance: $6,000 Unfavorable; Efficiency variance: $6,600 Favorable" },
        { id: "d", text: "Rate variance: $6,400 Favorable; Efficiency variance: $5,800 Unfavorable" },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "1. Actual hourly wage rate (AR) = $191,400 / 5,800 hours = $33.00/hr (vs. Standard Rate SR = $32.00/hr).\n   Direct Labor Rate Variance = AH × (AR - SR) = 5,800 × ($33.00 - $32.00) = $5,800 Unfavorable (since actual rate $33 > $32).\n2. Standard Hours Allowed for Actual Output (SH) = 1,500 airframes × 4.0 hrs/unit = 6,000 hours (vs. Actual Hours AH = 5,800 hours).\n   Direct Labor Efficiency Variance = SR × (AH - SH) = $32.00 × (5,800 - 6,000) = -$6,400 => $6,400 Favorable (since 200 fewer hours were used than the 6,000 standard allowance).",
    optionExplanations: {
      a: "Correct. Paying $1.00/hr above standard across 5,800 actual hours creates a $5,800 Unfavorable rate variance, while saving 200 hours against the 6,000-hour standard at $32/hr creates a $6,400 Favorable efficiency variance.",
      b: "Incorrect. Reverses the Favorable and Unfavorable labels.",
      c: "Incorrect. $6,000 U multiplies the $1.00 rate difference by 6,000 standard hours instead of 5,800 actual hours, and $6,600 F multiplies the 200-hour savings by the $33.00 actual rate instead of the $32.00 standard rate.",
      d: "Incorrect. Swaps the rate and efficiency variance figures.",
    },
    extras: {
      whyCorrect:
        "Notice how option C tests the classic CMA variance trap: rate variance MUST be weighted by Actual Hours (5,800), and efficiency variance MUST be valued at the Standard Rate ($32.00).",
      strategy:
        "Set up the 3-column variance prong: Column 1 (AH × AR = $191,400) | Column 2 (AH × SR = 5,800 × $32 = $185,600) | Column 3 (SH × SR = 6,000 × $32 = $192,000).",
      keyTakeaway:
        "Total Flexible Budget Direct Labor Variance = $5,800 U + $6,400 F = $600 Favorable ($191,400 actual vs. $192,000 applied).",
      relatedTopics: ["Direct Labor Rate and Efficiency Variances", "Flexible Budget Variance Decomposition", "Standard Costing"],
    },
    tags: ["cma", "part-1", "variance-analysis"],
  },
  {
    exam: "cma",
    category: "Financial Planning, Performance, and Analytics",
    topic: "Cost Management",
    subtopic: "Activity-Based Costing (ABC) vs. Plantwide Overhead Allocation",
    type: "numeric",
    difficulty: "moderate",
    scenario:
      "Precision Valve Co. allocates two manufacturing overhead activity cost pools using Activity-Based Costing (ABC):\n• Machine Setup Pool: Total budgeted cost = $240,000; Total budgeted activity = 600 setups ($400 per setup).\n• Automated Inspection Pool: Total budgeted cost = $180,000; Total budgeted activity = 9,000 inspection hours ($20 per inspection hour).\n\nDuring the year, Product Line Z (a specialized custom valve with a production volume of 500 units) required 45 machine setups and 350 inspection hours.",
    stem: "Under Activity-Based Costing, what is the allocated manufacturing overhead cost per unit for Product Line Z? (Round your answer to the nearest whole dollar.)",
    content: {
      unit: "USD per unit",
      decimals: 0,
    },
    answer: {
      value: 50,
      tolerance: 0,
    },
    rationale:
      "Step 1 (Activity Rates):\n- Setup rate = $240,000 / 600 setups = $400 per setup.\n- Inspection rate = $180,000 / 9,000 inspection hours = $20 per inspection hour.\nStep 2 (Total Overhead Assigned to Product Line Z):\n- Setup cost = 45 setups × $400/setup = $18,000.\n- Inspection cost = 350 inspection hours × $20/hr = $7,000.\n- Total ABC overhead for Product Line Z = $18,000 + $7,000 = $25,000.\nStep 3 (Overhead Cost per Unit of Product Line Z):\n- $25,000 / 500 units = $50 per unit.",
    extras: {
      whyCorrect:
        "Summing the batch-level setup costs ($18,000) and inspection costs ($7,000) gives $25,000 total pool overhead for the 500-unit run, or $50/unit.",
      strategy:
        "On CMA ABC questions, always check whether the final question asks for total overhead allocated to the product line ($25,000) or the overhead cost per unit ($25,000 / 500 = $50).",
      keyTakeaway:
        "ABC prevents high-volume products from cross-subsidizing low-volume, complex batch products that consume disproportionate setups.",
      relatedTopics: ["Activity-Based Costing (ABC)", "Batch-Level vs. Unit-Level Cost Drivers", "Product Cross-Subsidization"],
    },
    tags: ["cma", "part-1", "numeric", "abc-costing"],
  },
  {
    exam: "cma",
    category: "Strategic Financial Management",
    topic: "Decision Analysis",
    subtopic: "Degree of Operating Leverage (DOL) and Break-Even Volume",
    type: "numeric",
    difficulty: "moderate",
    scenario:
      "Zenith Medical Sensors sells a portable diagnostic unit for $500 per unit. Variable manufacturing and selling costs total $300 per unit, and annual fixed operating costs are $1,200,000. Current annual sales volume is 10,000 units.",
    stem: "What is Zenith's Degree of Operating Leverage (DOL) at its current sales level of 10,000 units? (Enter your answer to one decimal place.)",
    content: {
      decimals: 1,
    },
    answer: {
      value: 2.5,
      tolerance: 0.01,
    },
    rationale:
      "Unit contribution margin = $500 - $300 = $200 per unit.\nAt 10,000 units:\n- Total Contribution Margin (CM) = 10,000 × $200 = $2,000,000.\n- Operating Income (EBIT) = Total CM - Fixed Costs = $2,000,000 - $1,200,000 = $800,000.\nDegree of Operating Leverage (DOL) = Total Contribution Margin / Operating Income (EBIT) = $2,000,000 / $800,000 = 2.5.",
    extras: {
      whyCorrect:
        "A DOL of 2.5 means that from the 10,000-unit baseline, every 1% increase in sales volume produces a 2.5% increase in operating income (EBIT). Note also that break-even volume is $1,200,000 / $200 = 6,000 units, and DOL = Q / (Q - Q_BE) = 10,000 / (10,000 - 6,000) = 10,000 / 4,000 = 2.5.",
      strategy:
        "Use the shortcut DOL = Contribution Margin / EBIT (or Q / Margin of Safety in units) rather than computing percentage changes across two hypothetical income statements.",
      keyTakeaway:
        "DOL is always the reciprocal of the Margin of Safety Ratio: here, Margin of Safety Ratio = 4,000 / 10,000 = 40% (0.40), and 1 / 0.40 = 2.5.",
      relatedTopics: ["Degree of Operating Leverage (DOL)", "Cost-Volume-Profit (CVP) Analysis", "Margin of Safety Ratio"],
    },
    tags: ["cma", "part-2", "numeric", "operating-leverage"],
  },
  {
    exam: "cma",
    category: "Strategic Financial Management",
    topic: "Investment Decisions",
    subtopic: "Net Present Value vs. Internal Rate of Return and Reinvestment Rate Assumption",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "A corporate capital-budgeting committee is evaluating two mutually exclusive 5-year automation projects, Project Alpha and Project Beta, both requiring an initial outlay of $2,000,000. Project Alpha generates front-loaded cash inflows in Years 1 and 2, whereas Project Beta generates a large back-loaded cash inflow in Year 5. At the company's 10% hurdle rate (WACC), Project Beta has a higher Net Present Value (NPV = $480,000 vs. $410,000), whereas Project Alpha has a higher Internal Rate of Return (IRR = 18.5% vs. 16.2%).",
    stem: "Which project should the committee select to maximize shareholder wealth, and what accounts for the ranking conflict between NPV and IRR?",
    content: {
      options: [
        { id: "a", text: "Select Project Alpha, because its 18.5% IRR provides a wider safety margin above the 10% WACC hurdle rate." },
        { id: "b", text: "Select Project Beta, because NPV implicitly assumes intermediate cash inflows are reinvested at the firm's 10% cost of capital rather than at the project's internal rate of return." },
        { id: "c", text: "Select Project Alpha, because NPV fails to account for the time value of money on cash flows occurring after the crossover rate." },
        { id: "d", text: "Select Project Beta, because IRR assumes intermediate cash flows are reinvested at the risk-free Treasury rate." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "When evaluating mutually exclusive projects with different cash-flow timing profiles, NPV and IRR can conflict whenever the firm's cost of capital (10%) is below the Fisher crossover rate. Mathematically, NPV discounts cash flows at the opportunity cost of capital (WACC = 10%), which equates to assuming intermediate cash inflows can be reinvested at 10%. By contrast, IRR implicitly assumes intermediate cash inflows can be reinvested at the project's own high IRR (18.5% for Alpha). Because reinvesting at the firm's cost of capital is the economically realistic assumption and NPV directly measures the dollar addition to shareholder wealth ($480,000 > $410,000), Project Beta must be selected.",
    optionExplanations: {
      a: "Incorrect. Choosing the higher IRR on mutually exclusive projects sacrifices $70,000 of present-value shareholder wealth ($480,000 vs. $410,000).",
      b: "Correct. NPV directly measures value added to the firm and relies on the realistic assumption that intermediate cash inflows are reinvested at the 10% cost of capital (WACC).",
      c: "Incorrect. NPV rigorously discounts all cash flows across all years at the cost of capital.",
      d: "Incorrect. IRR implicitly assumes reinvestment at the IRR itself, not at the risk-free rate.",
    },
    extras: {
      whyCorrect:
        "Timing differences (front-loaded Alpha vs. back-loaded Beta) cause the NPV profiles to cross; below the crossover rate (at WACC = 10%), the back-loaded project (Beta) commands the higher NPV and adds more dollar value to the firm.",
      strategy:
        "Whenever NPV and IRR conflict on mutually exclusive projects on the CMA Part 2 exam, ALWAYS select the project with the higher positive NPV.",
      keyTakeaway:
        "NPV assumes reinvestment at the cost of capital (WACC); IRR assumes reinvestment at the IRR; Modified IRR (MIRR) resolves this by compounding inflows forward at WACC.",
      relatedTopics: ["NPV vs. IRR Ranking Conflicts", "Fisher Crossover Rate", "Reinvestment Rate Assumption and MIRR"],
    },
    tags: ["cma", "part-2", "capital-budgeting"],
  },

  /* ================================================================== */
  /* 16. LSAT ("lsat")                                                  */
  /* ================================================================== */
  {
    exam: "lsat",
    category: "Logical Reasoning",
    topic: "Necessary Assumption",
    subtopic: "Bridging Conceptual Shifts Between Premises and Conclusion",
    type: "mcq",
    difficulty: "difficult",
    stem: "Philosopher: An action cannot be morally praiseworthy unless the agent who performs it could have chosen to do otherwise. Yet if deterministic physical laws completely govern every neural event in the human brain, then at the exact moment prior to any decision, only one neural outcome is physically possible given the prior state of the universe. Therefore, if deterministic physical laws completely govern every neural event in the human brain, no human action is ever morally praiseworthy.\n\nThe philosopher's argument depends on assuming which one of the following?",
    content: {
      options: [
        { id: "a", text: "At least some human actions are morally praiseworthy because deterministic physical laws do not govern every neural event in the brain." },
        { id: "b", text: "If only one neural outcome is physically possible at the moment prior to a decision, the agent making that decision could not have chosen to do otherwise." },
        { id: "c", text: "Every action performed by an agent who could have chosen to do otherwise is morally praiseworthy." },
        { id: "d", text: "Moral blameworthiness is governed by the exact same metaphysical conditions as moral praiseworthiness." },
        { id: "e", text: "Quantum indeterminacy in neural synapses is sufficient to grant human agents the ability to choose otherwise." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Let's trace the conditional chain in the argument:\n- Premise 1: Morally Praiseworthy (MP) -> Could Have Chosen Otherwise (CHCO). Contrapositive: ~CHCO -> ~MP.\n- Premise 2: Neural Determinism (ND) -> Only One Neural Outcome Physically Possible (OONOPP).\n- Conclusion: Neural Determinism (ND) -> ~Morally Praiseworthy (~MP).\nNotice the logical gap between the sufficient/necessary terms in Premise 2 and Premise 1: to link OONOPP to ~MP via ~CHCO, the argument MUST assume that OONOPP -> ~CHCO ('If only one neural outcome is physically possible at the moment prior to a decision, the agent could not have chosen to do otherwise'). Negating option B (i.e., even if only one neural outcome is physically possible, an agent still could have chosen to do otherwise in the morally relevant sense—the compatibilist position) destroys the conclusion.",
    optionExplanations: {
      a: "Incorrect. The conclusion is strictly conditional ('if deterministic physical laws completely govern..., no human action is morally praiseworthy'); the philosopher never takes a stand on whether determinism is actually true.",
      b: "Correct. This bridges the gap between 'only one neural outcome is physically possible' (Premise 2) and 'could not have chosen to do otherwise' (contrapositive of Premise 1).",
      c: "Incorrect. This reverses Premise 1 ('unless' introduces a necessary condition: MP -> CHCO, not CHCO -> MP).",
      d: "Incorrect. Blameworthiness is outside the scope of the argument, which discusses only moral praiseworthiness.",
      e: "Incorrect. Quantum indeterminacy is irrelevant to the conditional link between determinism and praiseworthiness.",
    },
    extras: {
      whyCorrect:
        "Formalizing the argument exposes the missing link immediately: Premise 2 gives ND -> OONOPP, Premise 1 gives ~CHCO -> ~MP, so the required bridge is OONOPP -> ~CHCO.",
      strategy:
        "On LSAT Assumption questions with conditional logic ('unless', 'if', 'only if'), diagram the contrapositives and look for the unlinked term in the premises ('only one neural outcome is physically possible' vs. 'could have chosen to do otherwise').",
      keyTakeaway:
        "'A unless B' translates to '~A -> B' (or equivalently, 'A -> B' when stated as 'Cannot be A unless B': A -> B, contrapositive ~B -> ~A).",
      relatedTopics: ["LSAT Necessary Assumption", "Conditional Logic and Contrapositives", "Negation Test"],
    },
    tags: ["lsat", "logical-reasoning", "necessary-assumption"],
  },
  {
    exam: "lsat",
    category: "Logical Reasoning",
    topic: "Flaw in the Reasoning",
    subtopic: "Part-to-Whole (Composition) Fallacy vs. Percentage/Absolute Number Confusion",
    type: "mcq",
    difficulty: "difficult",
    stem: "Municipal Auditor: Ten years ago, commuting cyclists accounted for only 3% of daily rush-hour traffic crossing the Harbor Bridge, yet cyclists were involved in 9% of all traffic accidents on the bridge. Today, after the installation of a physically separated bike lane, commuting cyclists account for 12% of daily rush-hour traffic crossing the Harbor Bridge, while still accounting for 9% of all traffic accidents on the bridge. Clearly, installing the separated bike lane had no effect on the likelihood that an individual cyclist crossing the Harbor Bridge during rush hour would be involved in an accident.\n\nThe municipal auditor's reasoning is flawed because it:",
    content: {
      options: [
        { id: "a", text: "ignores the fact that a fourfold increase in the proportion of cyclists in bridge traffic coupled with an unchanged share of total accidents indicates a lower accident rate per cyclist trip, assuming total accidents did not increase fourfold" },
        { id: "b", text: "presumes without justification that motor vehicle drivers crossing the Harbor Bridge today are more attentive than motor vehicle drivers ten years ago" },
        { id: "c", text: "treats a correlation between separated bike lanes and increased cycling ridership as proof that bike lanes cause motorists to switch to cycling" },
        { id: "d", text: "fails to consider whether pedestrian accidents on the Harbor Bridge have increased over the same ten-year period" },
        { id: "e", text: "generalizes from data collected on a single rush-hour bridge to all cycling infrastructure across the entire metropolitan area" },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "Ten years ago, 3% of bridge traffic accounted for 9% of accidents (a 3:1 overrepresentation ratio relative to traffic share). Today, cyclists' share of traffic quadrupled to 12%, while their share of total accidents remained at 9% (now below their 12% traffic share, a 0.75:1 ratio). Assuming total bridge accidents did not surge fourfold relative to traffic volume, an unchanged 9% share of accidents divided among four times the proportion of cyclists reflects a substantial drop in the individual per-cyclist risk of an accident.",
    optionExplanations: {
      a: "Correct. The auditor confuses cyclists' constant share of total accidents (9%) with the per-cyclist probability of an accident, overlooking that the cycling population share quadrupled from 3% to 12%.",
      b: "Incorrect. Driver attentiveness is not presupposed by the auditor's numerical inference.",
      c: "Incorrect. The auditor makes no claim about what caused ridership to grow from 3% to 12%.",
      d: "Incorrect. Pedestrian accidents are irrelevant to the mathematical relationship between cyclist volume share and cyclist accident share.",
      e: "Incorrect. The auditor's conclusion is restricted strictly to 'an individual cyclist crossing the Harbor Bridge during rush hour.'",
    },
    extras: {
      whyCorrect:
        "If a group's share of total traffic quadruples (3% -> 12%) while its share of total accidents stays flat (9% -> 9%), its accident rate relative to other commuters fell by a factor of four.",
      strategy:
        "Whenever an LSAT stimulus cites percentages of two different totals ('% of daily traffic' vs. '% of all accidents'), check how the ratio between the two shares changed over time.",
      keyTakeaway:
        "Keeping a subgroup's share of accidents constant while quadrupling that subgroup's share of commuters implies a sharp drop in relative per-commuter accident risk.",
      relatedTopics: ["LSAT Numbers and Percentages Flaws", "Relative Risk vs. Share of Total", "Base-Rate Shifts"],
    },
    tags: ["lsat", "logical-reasoning", "flaw"],
  },
  {
    exam: "lsat",
    category: "Logical Reasoning",
    topic: "Principle — Justify / Parallel Reasoning",
    subtopic: "Applying Normative Principles to Fact Patterns",
    type: "mcq",
    difficulty: "moderate",
    stem: "Ethicist: A biomedical researcher who discovers an unexpected genetic marker of disease risk in an anonymized biobank sample is morally obligated to break anonymization and notify the donor if, but only if, there exists a clinically validated medical intervention that can prevent or mitigate the disease and the donor did not explicitly waive the right to receive incidental findings at the time of consent.\n\nSuppose the ethicist's principle is correct. Which one of the following judgements directly follows from applying the principle?",
    content: {
      options: [
        { id: "a", text: "Dr. Lin is morally obligated to break anonymization and notify Donor K after discovering a genetic marker for Huntington's disease, a condition for which no preventive or mitigating clinical intervention currently exists, because Donor K explicitly requested all incidental findings." },
        { id: "b", text: "Dr. Vance is not morally obligated to break anonymization and notify Donor M after discovering a BRCA1 mutation with clinically validated preventive interventions, because Donor M explicitly signed a waiver refusing all incidental findings at the time of consent." },
        { id: "c", text: "Dr. Sato is morally prohibited from notifying Donor P of an actionable cardiomyopathy marker unless the hospital ethics board also votes unanimously to approve disclosure." },
        { id: "d", text: "Dr. Gomez is morally obligated to break anonymization and notify Donor R of a genetic marker for early-onset glaucoma, for which validated preventive eye drops exist, even though the biobank consent form contained no record of whether Donor R waived incidental findings." },
        { id: "e", text: "Any researcher who breaks anonymization when no clinically validated intervention exists acts with malicious intent toward the donor." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "The ethicist's biconditional rule ('if, but only if') establishes that Moral Obligation to Notify (MON) <-> [Clinically Validated Intervention (CVI) AND Did Not Explicitly Waive (~Waived)].\nBy the 'only if' side: MON -> (CVI and ~Waived). Taking the contrapositive: (~CVI or Waived) -> ~MON.\nIn option B, Donor M explicitly signed a waiver refusing incidental findings (Waived is true, so ~Waived is false). Therefore, it follows deductively that Dr. Vance is NOT morally obligated to break anonymization and notify Donor M (~MON).",
    optionExplanations: {
      a: "Incorrect. Since no preventive or mitigating intervention exists (~CVI), the necessary condition fails, so Dr. Lin is NOT morally obligated to notify Donor K.",
      b: "Correct. Because 'did not explicitly waive' is a necessary condition for the moral obligation ('only if... the donor did not explicitly waive'), Donor M's explicit waiver guarantees there is no moral obligation to notify.",
      c: "Incorrect. The principle addresses when a researcher is 'morally obligated', not when a researcher is 'morally prohibited', nor does it mention ethics board unanimity.",
      d: "Incorrect. Having 'no record of whether Donor R waived' does not establish for certain whether Donor R explicitly waived at consent, so we cannot deduce MON with certainty.",
      e: "Incorrect. Absence of a moral obligation (~MON) does not imply malicious intent.",
    },
    extras: {
      whyCorrect:
        "In a biconditional 'P if, and only if, (Q and R)', the failure of either Q or R immediately guarantees ~P. Since Donor M waived the right (so R is false), Dr. Vance is not morally obligated (~P).",
      strategy:
        "Watch out for the distinction between 'not morally obligated' (~Obligated) and 'morally prohibited' (Obligated not to) on LSAT normative principle questions!",
      keyTakeaway:
        "In 'A if, but only if, B and C', failing either B or C proves ~A.",
      relatedTopics: ["Biconditional Logic (If and Only If)", "De Morgan's Laws in Contrapositives", "Obligated vs. Permitted vs. Prohibited"],
    },
    tags: ["lsat", "logical-reasoning", "principle"],
  },
  {
    exam: "lsat",
    category: "Reading Comprehension",
    topic: "Law and Jurisprudence",
    subtopic: "New Textualism vs. Purposivism in Statutory Interpretation",
    type: "mcq",
    difficulty: "difficult",
    exhibit: {
      kind: "passage",
      title: "Statutory Textualism, Legislative History, and the Public-Choice Critique",
      text: "For much of the mid-twentieth century, federal courts in the United States approached ambiguous regulatory statutes through the lens of 'purposivism.' Classic purposivists, influenced by Henry Hart and Albert Sacks's legal process school, presumed that legislators are reasonable persons pursuing coherent public policies cleanly discernible from committee reports, floor debates, and statutory preambles. When the literal wording of a statute produced an anomalous gap or clashed with the statute's overarching remedial spirit, purposivist judges treated legislative history as an authoritative guide to reconstruct what Congress would have intended had it foreseen the dispute.\n\nBeginning in the 1980s, 'new textualists' mounted a two-pronged assault on this methodology, drawing both on constitutional formalism and on public-choice economics. First, from a formalist standpoint, textualists emphasized that Article I, Section 7 of the Constitution requires bicameralism and presentment: only the statutory text voted on by both Houses and signed by the President is law, whereas committee reports are drafted by unelected staffers or partisan subsets of legislators and never survive a chamber-wide vote. Second, and more subtly, public-choice theory undermined the Hart-Sacks premise of a unitary, public-spirited legislative purpose. Because statutes emerge from chaotic logrolling, strategic compromises, and interest-group bargaining among hundreds of legislators with divergent motives, a statute's precise stopping point—how far it goes and where it stops short—is itself part of the legislative bargain. To invoke a broad 'remedial purpose' from a committee report to push a statute beyond its semantic limits is, textualists argue, to award one faction in court a victory it could not secure in the legislative chamber.",
    },
    stem: "Based on the passage, the 'new textualists' invoke public-choice economics primarily in order to:",
    content: {
      options: [
        { id: "a", text: "prove that unelected committee staffers frequently violate Article I, Section 7 of the Constitution by inserting unauthorized language into statutory text prior to presidential signature" },
        { id: "b", text: "demonstrate that because legislation reflects negotiated compromises among competing factions, overriding a statute's text in the name of an overarching remedial purpose distorts the actual legislative bargain" },
        { id: "c", text: "argue that federal judges should invalidate any regulatory statute that resulted from interest-group bargaining or legislative logrolling" },
        { id: "d", text: "establish that mid-twentieth-century purposivist judges intentionally favored executive agencies over private commercial litigants" },
        { id: "e", text: "show that statutory text is never genuinely ambiguous when analyzed using contemporary economic theory" },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "In the second half of paragraph 2, the passage explains that public-choice theory challenges the Hart-Sacks assumption of a single coherent legislative purpose: because statutes result from logrolling and compromise among competing interests, 'a statute's precise stopping point... is itself part of the legislative bargain,' so using a broad remedial purpose to extend a statute beyond its text hands one faction a court victory it could not win in Congress.",
    optionExplanations: {
      a: "Incorrect. The critique of committee reports under Article I, Section 7 is the first (constitutional formalist) prong, and committee staffers draft committee reports, not unauthorized insertions into the signed statute.",
      b: "Correct. This accurately captures the second (public-choice) prong: legislation is a compromise with negotiated boundaries, so stretching text via broad 'purpose' disrupts the legislative bargain.",
      c: "Incorrect. Textualists use public-choice theory to enforce the enacted text as written, not to invalidate statutes produced by logrolling.",
      d: "Incorrect. The passage does not claim purposivists intentionally favored executive agencies.",
      e: "Incorrect. The passage begins by noting the debate concerns how courts approach ambiguous regulatory statutes.",
    },
    extras: {
      whyCorrect:
        "The passage explicitly separates the 'two-pronged assault': Prong 1 = Article I, Section 7 formalism (bicameralism & presentment); Prong 2 = Public-choice economics (statutes are compromises where the stopping point is part of the bargain).",
      strategy:
        "On LSAT Reading Comprehension 'function/purpose' questions, check which prong of a multi-part argument the question asks about ('public-choice economics' = Prong 2) so you don't pick an answer summarizing Prong 1 ('Article I, Section 7').",
      keyTakeaway:
        "LSAT law passages frequently contrast two schools of jurisprudence by examining the underlying assumptions each school makes about institutional behavior.",
      relatedTopics: ["LSAT Law Passages", "Purposivism vs. New Textualism", "Rhetorical Function of Secondary Disciplines"],
    },
    tags: ["lsat", "reading-comprehension", "jurisprudence"],
  },

  /* ================================================================== */
  /* 17. MULTISTATE BAR EXAMINATION ("mbe")                             */
  /* ================================================================== */
  {
    exam: "mbe",
    category: "Constitutional Law",
    topic: "The Dormant Commerce Clause",
    subtopic: "Facial Discrimination vs. Market-Participant Exception",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "State A is a major producer of farmed freshwater trout. Following an economic downturn in its aquaculture sector, the State A legislature enacted the 'Freshwater Aquaculture Preservation Act.' Section 1 of the Act requires that all privately owned commercial trout-processing plants located in State A charge a $4.00 per pound inspection surcharge on any raw trout imported from hatcheries outside State A, while imposing a $0.50 per pound inspection fee on trout raised in State A hatcheries. State A's Department of Agriculture presented uncontradicted scientific evidence showing that out-of-state trout occasionally carry a gill parasite not currently endemic to State A waters, though inexpensive rapid point-of-entry quarantine testing ($0.40 per pound) can reliably detect the parasite before fish enter State A.\n\nAn out-of-state trout hatchery sues in federal court to enjoin enforcement of Section 1.",
    stem: "How should the federal court rule on the out-of-state hatchery's Dormant Commerce Clause challenge to Section 1?",
    content: {
      options: [
        { id: "a", text: "Upheld, because protecting native aquatic ecosystems from non-endemic parasites is a legitimate local police power interest under the Pike v. Bruce Church balancing test." },
        { id: "b", text: "Upheld, because State A is acting as a market participant in regulating its domestic trout-processing industry." },
        { id: "c", text: "Invalidated, because the statute facially discriminates against interstate commerce and State A has reasonable nondiscriminatory alternatives to protect against the parasite." },
        { id: "d", text: "Invalidated, because the Privileges and Immunities Clause of Article IV prohibits states from taxing out-of-state corporations at higher rates than domestic corporations." },
      ],
    },
    answer: { correct: "c" },
    rationale:
      "A state statute that facially discriminates against out-of-state goods or economic actors ($4.00/lb surcharge on out-of-state trout vs. $0.50/lb on in-state trout) is subject to strict scrutiny (a virtual per se rule of invalidity) under the Dormant Commerce Clause—NOT the deferential Pike v. Bruce Church balancing test (which applies only to nondiscriminatory laws with incidental burdens). Under Maine v. Taylor and Dean Milk Co. v. City of Madison, a facially discriminatory law is upheld ONLY if it advances a legitimate local non-economic purpose (such as preventing parasite introduction) AND there are no reasonable nondiscriminatory alternatives available. Because rapid point-of-entry quarantine testing at $0.40/lb reliably detects the parasite, a nondiscriminatory alternative exists, rendering the $4.00 surcharge unconstitutional.",
    optionExplanations: {
      a: "Incorrect. Pike v. Bruce Church balancing applies only to evenhanded, nondiscriminatory laws; facially discriminatory laws must satisfy strict scrutiny (no less discriminatory alternative).",
      b: "Incorrect. The market-participant exception applies only when the state itself is buying or selling goods/services in the market, not when it regulates or taxes private processing plants.",
      c: "Correct. Section 1 facially discriminates against interstate commerce, and the availability of an effective $0.40/lb rapid test defeats State A's claim that the discriminatory surcharge is necessary.",
      d: "Incorrect. Corporations and commercial entities are not 'citizens' protected by the Article IV Privileges and Immunities Clause.",
    },
    extras: {
      whyCorrect:
        "Even when a state proves a genuine environmental/quarantine concern (Maine v. Taylor), a facially discriminatory law fails under Dean Milk whenever a reasonable nondiscriminatory alternative (the $0.40 rapid test) can achieve that health objective.",
      strategy:
        "On MBE Constitutional Law questions, immediately eliminate Article IV Privileges and Immunities whenever the plaintiff is a corporation or the claim involves discriminatory taxation of goods rather than individual pursuit of a livelihood.",
      keyTakeaway:
        "Facial discrimination against interstate commerce triggers strict scrutiny: legitimate non-protectionist local purpose + NO reasonable nondiscriminatory alternative.",
      relatedTopics: ["Dormant Commerce Clause Strict Scrutiny", "Dean Milk vs. Maine v. Taylor", "Market-Participant Exception"],
    },
    tags: ["mbe", "con-law", "dormant-commerce-clause"],
  },
  {
    exam: "mbe",
    category: "Contracts",
    topic: "UCC Article 2 Formation and Modification",
    subtopic: "Merchant Firm Offers (UCC § 2-205) and Battle of the Forms (UCC § 2-207)",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "On May 1, a commercial steel fabricator (a merchant) sent a signed written quotation to a construction contractor (also a merchant) offering to sell 500 tons of structural I-beams at $1,100 per ton, stating: 'This offer is firm and irrevocable through June 15.' The contractor gave no consideration to keep the offer open. On May 20, after raw steel prices spiked, the fabricator emailed the contractor: 'Effective immediately, we revoke our May 1 quotation.' On May 25, ignoring the revocation, the contractor mailed a signed purchase order accepting the May 1 offer for 500 tons at $1,100 per ton, but added a printed clause at the bottom: 'All disputes arising under this contract shall be resolved exclusively by binding arbitration in Chicago.' The May 1 quotation was silent on dispute resolution. Under applicable state law, mandatory arbitration clauses are considered material alterations. The fabricator refused to deliver the steel.",
    stem: "Is there an enforceable contract between the fabricator and the contractor, and if so, does it include the mandatory arbitration clause?",
    content: {
      options: [
        { id: "a", text: "No enforceable contract exists, because the fabricator validly revoked the May 1 offer on May 20 prior to acceptance, as the contractor paid no consideration for an option." },
        { id: "b", text: "No enforceable contract exists, because the contractor's addition of a material arbitration clause converted the May 25 purchase order into a counteroffer under the mirror-image rule." },
        { id: "c", text: "An enforceable contract exists for 500 tons of steel at $1,100 per ton, but the mandatory arbitration clause is excluded because it materially alters the contract." },
        { id: "d", text: "An enforceable contract exists for 500 tons of steel at $1,100 per ton, and it includes the mandatory arbitration clause because both parties are merchants." },
      ],
    },
    answer: { correct: "c" },
    rationale:
      "Step 1 (UCC § 2-205 Merchant's Firm Offer): Under UCC Article 2 (sale of goods: steel I-beams), an offer by a merchant in a signed writing that by its terms gives assurance that it will be held open is irrevocable without consideration for the time stated (or up to 3 months maximum). Because May 1 to June 15 is 45 days (within the 3-month cap), the fabricator's May 20 attempted revocation was legally ineffective, and the offer remained open on May 25.\nStep 2 (UCC § 2-207 Battle of the Forms): Under § 2-207(1), a definite and seasonable expression of acceptance operates as a valid acceptance even though it states additional terms, unless acceptance is expressly made conditional on assent to the additional terms. Under § 2-207(2), between merchants, additional terms become part of the contract UNLESS: (a) the offer expressly limits acceptance to the terms of the offer, (b) they materially alter it, or (c) notification of objection is given within a reasonable time. Because the problem states that mandatory arbitration is a material alteration under applicable state law, the contract is formed without the arbitration clause.",
    optionExplanations: {
      a: "Incorrect. Under UCC § 2-205, a merchant's signed written firm offer is irrevocable without consideration for up to three months.",
      b: "Incorrect. UCC § 2-207 rejects the common-law mirror-image rule for sales of goods unless the acceptance is expressly made conditional on the offeror's assent to the additional terms.",
      c: "Correct. The firm offer remained irrevocable under § 2-205, the May 25 purchase order formed a binding contract under § 2-207(1), and the additional arbitration clause is excluded as a material alteration under § 2-207(2)(b).",
      d: "Incorrect. Even between merchants under § 2-207(2), an additional term that materially alters the contract does not become part of the agreement unless expressly agreed to by the other party.",
    },
    extras: {
      whyCorrect:
        "Combining UCC § 2-205 (45-day signed merchant firm offer cannot be revoked) with UCC § 2-207(2)(b) (additional material term drops out between merchants while contract formation stands) yields option C.",
      strategy:
        "On MBE Contracts questions involving goods, always test § 2-205 (Merchant Firm Offer max 3 months) and § 2-207 (definite acceptance forms a contract; between merchants, additional terms enter UNLESS material, objected to, or precluded by the offer).",
      keyTakeaway:
        "Under UCC § 2-207, an acceptance with an additional material term still forms a valid contract—the material term simply drops out.",
      relatedTopics: ["UCC Section 2-205 Merchant Firm Offer", "UCC Section 2-207 Battle of the Forms", "Common Law Mirror-Image Rule vs. Article 2"],
    },
    tags: ["mbe", "contracts", "ucc-article-2"],
  },
  {
    exam: "mbe",
    category: "Criminal Law and Procedure",
    topic: "Fourth Amendment Searches and Seizures",
    subtopic: "Search Incident to Arrest (Arizona v. Gant) vs. Automobile Exception",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "A uniformed patrol officer observed a driver run a red light and pulled the vehicle over. When the officer ran the driver's license, the dispatcher reported an outstanding bench warrant for the driver's arrest for failing to appear at a misdemeanor traffic hearing regarding driving with an expired registration. The officer arrested the driver, handcuffed him, and locked him securely in the back seat of the patrol car. Neither the driver nor any passenger had access to the vehicle, and the officer had no reason to believe the vehicle contained contraband or weapons. Nevertheless, before calling a tow truck, the officer searched the passenger compartment solely 'incident to the arrest' and opened a zipped leather pouch inside the glove box, discovering three packets of methamphetamine.",
    stem: "Prior to trial for possession of methamphetamine, the driver moves to suppress the drugs under the Fourth Amendment (assuming the state has no standardized inventory-search policy in evidence). How should the court rule on the motion to suppress?",
    content: {
      options: [
        { id: "a", text: "Deny the motion, because under New York v. Belton, a lawful custodial arrest of a vehicle occupant automatically authorizes a contemporaneous search of the passenger compartment and any containers therein." },
        { id: "b", text: "Grant the motion, because the arrestee was secured in the patrol car without access to the passenger compartment and it was not reasonable to believe the vehicle contained evidence of the offense of arrest." },
        { id: "c", text: "Deny the motion, because the automobile exception allows officers to search any container in a vehicle that has been lawfully stopped on a public highway." },
        { id: "d", text: "Grant the motion, because the Fourth Amendment prohibits custodial arrests for fine-only traffic and registration offenses." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Under Arizona v. Gant (which sharply limited the broad reading of New York v. Belton), police may search the passenger compartment of a vehicle incident to a recent occupant's arrest ONLY if: (1) the arrestee is unsecured and within reaching distance of the passenger compartment at the time of the search, OR (2) it is reasonable to believe the vehicle contains evidence of the offense of arrest. Here, (1) the driver was handcuffed and locked inside the patrol car, and (2) the offense of arrest was failure to appear on an expired registration charge—an offense for which no physical evidence could reasonably be expected inside a zipped pouch in the glove box. Moreover, the officer lacked probable cause to believe the car contained contraband (so the Carroll automobile exception does not apply), and no standardized inventory search was conducted.",
    optionExplanations: {
      a: "Incorrect. Arizona v. Gant rejected the automatic post-arrest vehicle search rule once the arrestee is handcuffed and locked in a squad car.",
      b: "Correct. Both prongs of Arizona v. Gant fail: the arrestee was secured away from the vehicle, and no evidence of the offense of arrest (failure to appear / expired registration) could reasonably be found in the pouch.",
      c: "Incorrect. The automobile exception requires probable cause to believe the vehicle contains contraband or fruits/instrumentalities of a crime, which the officer lacked.",
      d: "Incorrect. Under Atwater v. City of Lago Vista, the Fourth Amendment permits custodial arrest even for fine-only misdemeanor traffic offenses committed in an officer's presence (and here there was an active bench warrant).",
    },
    extras: {
      whyCorrect:
        "Arizona v. Gant's two-prong rule is one of the highest-yield Fourth Amendment doctrines on the MBE: once the driver is handcuffed in the back of the squad car after a traffic-type arrest, a warrantless passenger-compartment search 'incident to arrest' is unconstitutional.",
      strategy:
        "On MBE vehicle search questions, always check all three warrant exceptions in sequence: (1) Gant Search Incident to Arrest (unsecured OR evidence of offense of arrest), (2) Automobile Exception (probable cause of contraband), and (3) Inventory Search (standardized department policy).",
      keyTakeaway:
        "Traffic/failure-to-appear arrests never satisfy Gant Prong 2 because there is no physical evidence of the offense of arrest to discover inside the car.",
      relatedTopics: ["Arizona v. Gant Search Incident to Arrest", "Automobile Exception (Carroll Doctrine)", "Atwater Custodial Traffic Arrests"],
    },
    tags: ["mbe", "crim-pro", "fourth-amendment"],
  },
  {
    exam: "mbe",
    category: "Evidence",
    topic: "Hearsay and Exceptions",
    subtopic: "Present Sense Impression, Excited Utterance, and Dying Declaration (FRE 803 & 804)",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "In a federal civil wrongful-death action arising out of a multi-vehicle highway collision, the plaintiff seeks to prove that the defendant's tractor-trailer drifted across the center median before impact. A bystander who witnessed the collision suffered a massive heart attack two weeks later and died before his deposition could be taken. Five minutes after the collision, while still visibly shaking and gasping for breath amidst the burning wreckage, the bystander had telephoned his brother and exclaimed: 'A blue tractor-trailer just crossed the center median and slammed head-on into a silver sedan!' The plaintiff calls the bystander's brother to testify to what the bystander said during that phone call.",
    stem: "Upon the defendant's hearsay objection under the Federal Rules of Evidence, how should the trial judge rule on the admissibility of the brother's testimony?",
    content: {
      options: [
        { id: "a", text: "Inadmissible hearsay, because the bystander was not under a belief of his own impending death when he made the statement." },
        { id: "b", text: "Inadmissible under the Sixth Amendment Confrontation Clause, because the defendant had no prior opportunity to cross-examine the deceased bystander." },
        { id: "c", text: "Admissible under the excited utterance exception to the hearsay rule (FRE 803(2)), regardless of the bystander's subsequent death." },
        { id: "d", text: "Admissible under the residual exception (FRE 807) only, because FRE 803 exceptions do not apply when the declarant is unavailable." },
      ],
    },
    answer: { correct: "c" },
    rationale:
      "Under FRE 803(2), an excited utterance is a statement relating to a startling event or condition, made while the declarant was under the stress of excitement that it caused. Here, five minutes after witnessing a catastrophic collision, while still visibly shaking and gasping amidst burning wreckage, the bystander remained under the stress of excitement and described the collision. FRE 803 exceptions apply regardless of whether the declarant is available or unavailable as a witness, and the Sixth Amendment Confrontation Clause (Crawford v. Washington) applies ONLY to criminal prosecutions—never to civil actions (and a call to a private brother is nontestimonial anyway).",
    optionExplanations: {
      a: "Incorrect. A dying declaration (FRE 804(b)(2)) requires belief of impending death concerning the cause/circumstances of the declarant's own impending death, but the statement need not qualify as a dying declaration because it easily satisfies FRE 803(2) Excited Utterance.",
      b: "Incorrect. The Sixth Amendment Confrontation Clause applies exclusively to criminal prosecutions, and this is a federal civil wrongful-death action (moreover, an excited call to a family member is nontestimonial).",
      c: "Correct. The bystander made the statement relating to the startling crash while still under the acute stress of excitement ('visibly shaking and gasping for breath amidst the burning wreckage'), satisfying FRE 803(2).",
      d: "Incorrect. The title of FRE 803 explicitly provides that its exceptions apply 'Regardless of Whether the Declarant Is Available as a Witness.'",
    },
    extras: {
      whyCorrect:
        "Even though the declarant later died (making him unavailable under FRE 804), FRE 803(2) Excited Utterance does not care about availability and applies in all civil and criminal cases.",
      strategy:
        "On MBE Evidence questions where a declarant dies before trial, don't get baited into analyzing Dying Declarations (FRE 804(b)(2)) if the statement was made during or right after the event—check FRE 803(1) Present Sense Impression and FRE 803(2) Excited Utterance first!",
      keyTakeaway:
        "The Sixth Amendment Confrontation Clause never applies in civil cases, and FRE 803 exceptions apply whether the declarant is alive or deceased.",
      relatedTopics: ["FRE 803(2) Excited Utterance", "FRE 803(1) Present Sense Impression", "Confrontation Clause Scope (Criminal Only)"],
    },
    tags: ["mbe", "evidence", "hearsay"],
  },
  {
    exam: "mbe",
    category: "Real Property",
    topic: "Titles and Recording Acts",
    subtopic: "Race-Notice Statutes, Shelter Rule, and Bona Fide Purchaser Status",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "Blackacre is located in a jurisdiction with the following recording statute: 'No conveyance or mortgage of real property shall be valid against any subsequent purchaser for valuable consideration without notice thereof, whose conveyance is first duly recorded.'\n\nOn March 1, Owner conveyed Blackacre by general warranty deed to Ann for $300,000. Ann did not record her deed. On April 1, Owner conveyed Blackacre by quitclaim deed to Ben for $280,000; Ben had no actual or inquiry notice of Ann's prior deed. Before Ben recorded his deed, Ann recorded her March 1 deed on April 10. On April 15, Ben recorded his April 1 deed. On May 1, Ben conveyed Blackacre by warranty deed to Carla for $290,000; Carla had no actual awareness of Ann's claim, and Carla recorded her deed on May 2.",
    stem: "In a quiet-title action between Ann and Carla, who holds superior legal title to Blackacre?",
    content: {
      options: [
        { id: "a", text: "Ann, because in a race-notice jurisdiction, Ann recorded her deed on April 10 before Ben or Carla recorded, giving Carla constructive record notice of Ann's prior conveyance from Owner." },
        { id: "b", text: "Carla, because Ben was a bona fide purchaser for value without notice on April 1, and Carla takes shelter under Ben's protected status." },
        { id: "c", text: "Carla, because she paid valuable consideration on May 1 without actual knowledge of Ann's deed and promptly recorded on May 2." },
        { id: "d", text: "Ann, because a grantee who takes title by quitclaim deed (Ben) can never qualify as a bona fide purchaser without notice." },
      ],
    },
    answer: { correct: "a" },
    rationale:
      "Step 1 (Classify the Statute): The language 'without notice thereof, whose conveyance is first duly recorded' is a Race-Notice statute. To prevail over a prior unrecorded grantee (Ann), a subsequent purchaser must BOTH (1) take for value and without notice at the time of conveyance AND (2) record FIRST before the prior grantee records.\nStep 2 (Ann vs. Ben): Although Ben took for value without notice on April 1, Ann recorded her deed on April 10 BEFORE Ben recorded on April 15. Thus, Ben failed the 'record first' prong of the race-notice statute, and Ann prevailed over Ben.\nStep 3 (Ann vs. Carla): When Carla purchased from Ben on May 1, Ann's deed from Owner had already been properly recorded in the chain of title on April 10. Consequently, Carla was on constructive (record) notice of Ann's prior recorded deed AND Ann had also recorded first. Nor can Carla invoke the Shelter Rule through Ben, because Ben himself never achieved protected status under the race-notice act.",
    optionExplanations: {
      a: "Correct. Under a race-notice statute, Ann's April 10 recording defeated Ben (who hadn't recorded yet) and put subsequent purchaser Carla on constructive record notice.",
      b: "Incorrect. That would be the outcome in a pure Notice jurisdiction! In a Race-Notice jurisdiction, Ben lost because he failed to record before Ann recorded on April 10, so Ben had no shelter to pass to Carla.",
      c: "Incorrect. Lack of actual knowledge does not help Carla when Ann's April 10 recorded deed was properly in the direct chain of title from Owner, giving Carla constructive record notice (and Ann recorded first).",
      d: "Incorrect. In the majority of jurisdictions, taking by quitclaim deed does not disqualify a grantee from BFP status; Ben lost because he failed to record first under the race-notice statute.",
    },
    extras: {
      whyCorrect:
        "In a Race-Notice jurisdiction ('without notice... whose conveyance is first duly recorded'), Ann's recording on April 10 cut off Ben's ability to record first and simultaneously imparted constructive record notice to anyone buying from Ben after April 10.",
      strategy:
        "Always underline the exact recording-act trigger words first: 'without notice' alone = Notice statute; 'first recorded' alone = Race statute; 'without notice... first recorded' = Race-Notice statute.",
      keyTakeaway:
        "Under a Race-Notice statute, a subsequent BFP who delays recording until after the prior grantee records loses title and has no Shelter Rule protection to convey.",
      relatedTopics: ["Race-Notice vs. Notice Recording Statutes", "Constructive (Record) Notice", "The Shelter Rule"],
    },
    tags: ["mbe", "real-property", "recording-acts"],
  },
  {
    exam: "mbe",
    category: "Torts",
    topic: "Products Liability and Negligence",
    subtopic: "Strict Products Liability — Foreseeable Misuse and Design Defect",
    type: "mcq",
    difficulty: "moderate",
    scenario:
      "A power-tool manufacturer designs and sells a heavy-duty portable circular saw to retail hardware stores. Internal engineering studies prior to launch showed that 35% of carpenters routinely prop open the saw's lower spring-loaded blade guard with a small wooden wedge when making plunge cuts because the guard binds against angled plywood. An alternative two-stage pivot hinge costing $1.80 per saw would have eliminated the binding completely without reducing cutting efficiency, while an inexpensive $0.90 recessed guard housing would have prevented users from wedging the guard open. The manufacturer declined to adopt either feature and instead printed a notice in the owner's manual: 'WARNING: Never wedge or disable the lower blade guard.'\n\nA carpenter purchased the saw, wedged the lower guard open with a wood scrap after it bound during an angled cut, and suffered a severe laceration when the exposed spinning blade kicked back.",
    stem: "In a strict products liability action based on defective design against the manufacturer (in a pure comparative fault jurisdiction), what is the strongest argument supporting the carpenter's recovery?",
    content: {
      options: [
        { id: "a", text: "In a strict products liability action, a plaintiff's intentional alteration or misuse of a product is never relevant to liability or damages." },
        { id: "b", text: "The carpenter's wedging of the blade guard was a reasonably foreseeable misuse that the manufacturer could have prevented through a cost-effective reasonable alternative design." },
        { id: "c", text: "A printed warning in an owner's manual is inadmissible hearsay when offered by a manufacturer to prove product safety." },
        { id: "d", text: "Manufacturers of power tools are subject to absolute liability as insurers against all physical injuries caused by their blades." },
      ],
    },
    answer: { correct: "b" },
    rationale:
      "Under the Restatement (Third) of Torts: Products Liability (and majority strict products liability law), a manufacturer has a duty to design its product to be reasonably safe not only for its intended uses, but also for reasonably foreseeable misuses or alterations. When a manufacturer knows that 35% of users wedge the guard open because the guard binds, that misuse is reasonably foreseeable and does not act as a superseding cause barring liability. Because a cost-effective reasonable alternative design ($1.80 two-stage hinge / $0.90 recessed housing) would have prevented the foreseeable hazard, a jury can find the saw defectively designed (with the carpenter's comparative fault merely reducing damages proportionately). Furthermore, a warning cannot absolve a manufacturer from adopting a simple, low-cost design fix for a severe, foreseeable hazard.",
    optionExplanations: {
      a: "Incorrect. Unforeseeable misuse can negate defect/proximate cause, and even foreseeable misuse is weighed under comparative fault to reduce the plaintiff's damages.",
      b: "Correct. Foreseeable product misuse or alteration does not cut off strict products liability when the risk could have been eliminated by an economically feasible reasonable alternative design.",
      c: "Incorrect. A warning is a verbal act / non-hearsay offered to show notice and adequacy of instructions, not hearsay.",
      d: "Incorrect. Strict products liability is not absolute liability; the plaintiff must still prove a manufacturing, design, or warning defect that existed when the product left the defendant's control.",
    },
    extras: {
      whyCorrect:
        "Because the manufacturer's own pre-launch engineering study documented that 35% of carpenters wedged the binding guard open, the alteration was foreseeable and curable via a $1.80 reasonable alternative design.",
      strategy:
        "On MBE Torts products liability questions, remember that 'foreseeable misuse' is treated just like 'intended use' for design-defect analysis; a warning label does not cure an easily preventable design defect (Restatement Third § 2, cmt. l).",
      keyTakeaway:
        "A product is defective in design when the foreseeable risks of harm (including foreseeable user misuse) could have been reduced or avoided by the adoption of a reasonable alternative design.",
      relatedTopics: ["Strict Products Liability — Design Defect", "Foreseeable Misuse and Alteration", "Reasonable Alternative Design (Risk-Utility Test)"],
    },
    tags: ["mbe", "torts", "products-liability"],
  },
  {
    exam: "mbe",
    category: "Civil Procedure",
    topic: "Subject-Matter Jurisdiction",
    subtopic: "Diversity Jurisdiction and Supplemental Jurisdiction Limitations (28 U.S.C. § 1367(b))",
    type: "mcq",
    difficulty: "difficult",
    scenario:
      "A homeowner (a citizen of State A) hired a general contractor (incorporated in State B with its principal place of business in State B) to build a custom residence. Following a structural roof collapse, the homeowner sued the general contractor in federal district court, properly invoking diversity-of-citizenship jurisdiction under 28 U.S.C. § 1332 and seeking $250,000 in state-law breach-of-contract and negligence damages.\n\nPursuant to Federal Rule of Civil Procedure 14(a), the general contractor properly impleaded a roofing subcontractor (incorporated in State A with its principal place of business in State A) as a third-party defendant, asserting a $250,000 state-law contractual indemnity claim arising out of the same roof collapse. Thereafter, the homeowner amended her complaint under Rule 14(a)(3) to assert a direct $250,000 state-law negligence claim against the third-party defendant roofing subcontractor.",
    stem: "Does the federal district court have subject-matter jurisdiction over (1) the general contractor's third-party indemnity claim against the roofing subcontractor, and (2) the homeowner's direct negligence claim against the roofing subcontractor?",
    content: {
      options: [
        { id: "a", text: "The court has jurisdiction over both claims under 28 U.S.C. § 1367(a) because both claims share a common nucleus of operative fact with the original lawsuit." },
        { id: "b", text: "The court lacks jurisdiction over both claims because the entry of a State A third-party defendant destroys complete diversity." },
        { id: "c", text: "The court has jurisdiction over the general contractor's third-party indemnity claim against the subcontractor, but lacks subject-matter jurisdiction over the homeowner's direct claim against the subcontractor." },
        { id: "d", text: "The court lacks jurisdiction over the general contractor's third-party indemnity claim, but has supplemental jurisdiction over the homeowner's direct claim." },
      ],
    },
    answer: { correct: "c" },
    rationale:
      "1. General Contractor (State B) v. Subcontractor (State A) — Rule 14(a) Third-Party Impleader Claim: This claim satisfies independent diversity jurisdiction (State B vs. State A for $250,000 > $75,000) AND also falls within supplemental jurisdiction under § 1367(a) (same case or controversy / common nucleus of operative fact—the roof collapse). Note that § 1367(b)'s restriction in diversity cases applies ONLY to claims by PLAINTIFFS, never to claims by defending parties (such as a defendant/third-party plaintiff's impleader claim).\n2. Homeowner (State A) v. Subcontractor (State A) — Original Plaintiff's Rule 14(a)(3) Claim Against Third-Party Defendant: Both the homeowner and the subcontractor are citizens of State A (no diversity) and the claim is a state-law tort (no federal question). Although the claim arises out of the same common nucleus of operative fact under § 1367(a), 28 U.S.C. § 1367(b) (codifying Owen Equipment & Erection Co. v. Kroger) explicitly strips supplemental jurisdiction in cases founded solely on diversity (§ 1332) over claims by original PLAINTIFFS against persons made parties under Rule 14 (impleader), Rule 19, Rule 20, or Rule 24 when exercising supplemental jurisdiction would be inconsistent with § 1332's complete diversity requirement.",
    optionExplanations: {
      a: "Incorrect. While both claims satisfy § 1367(a)'s common nucleus test, § 1367(b) bars an original plaintiff in a diversity-only action from using supplemental jurisdiction to assert a direct claim against a non-diverse Rule 14 third-party defendant.",
      b: "Incorrect. Impleading a third-party defendant who shares citizenship with the original plaintiff does NOT destroy diversity over the original suit or the defendant's Rule 14 impleader claim.",
      c: "Correct. The defendant's Rule 14 impleader claim (State B vs. State A for $250,000) is within the court's jurisdiction, whereas the original plaintiff's direct Rule 14(a)(3) claim against the non-diverse third-party defendant (State A vs. State A) is barred by 28 U.S.C. § 1367(b) (Owen v. Kroger).",
      d: "Incorrect. Reverses the rule of § 1367(b) and Owen v. Kroger.",
    },
    extras: {
      whyCorrect:
        "This is the classic Owen Equipment v. Kroger / § 1367(b) scenario: a defending party can implead a third-party defendant who is non-diverse from the plaintiff, but the original plaintiff cannot turn around and assert a direct state-law claim against that non-diverse third-party defendant.",
      strategy:
        "On MBE Civil Procedure supplemental jurisdiction questions in diversity cases, ask: 'Who is asserting the claim?' If it is the DEFENDANT / Third-Party Plaintiff, § 1367(b) NEVER strips supplemental jurisdiction; if it is the original PLAINTIFF suing a Rule 14/19/20/24 party, § 1367(b) bars supplemental jurisdiction whenever the parties are non-diverse.",
      keyTakeaway:
        "28 U.S.C. § 1367(b) restricts only claims by plaintiffs in diversity-only suits—specifically banning an original plaintiff's direct claim against a non-diverse Rule 14 third-party defendant.",
      relatedTopics: ["28 U.S.C. Section 1367(b) Supplemental Jurisdiction", "Owen Equipment v. Kroger", "Rule 14 Third-Party Practice (Impleader)"],
    },
    tags: ["mbe", "civ-pro", "supplemental-jurisdiction"],
  },
];
