import {
  pgTable, serial, text, integer, boolean, timestamp, jsonb, real, uuid, uniqueIndex, index, primaryKey, date,
} from "drizzle-orm/pg-core";

export const ROLES = ["student", "admin", "reviewer", "instructor"] as const;
export type Role = (typeof ROLES)[number];

/* ---------------- users & auth ---------------- */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<Role>().notNull().default("student"),
  photoUrl: text("photo_url"),
  targetExamDate: date("target_exam_date"),
  studyLevel: text("study_level"),
  dailyGoal: integer("daily_goal").notNull().default(50),
  preferredSubjects: text("preferred_subjects").array(),
  emailVerifiedAt: timestamp("email_verified_at"),
  status: text("status").notNull().default("active"), // active | suspended
  subscriptionStatus: text("subscription_status").notNull().default("free"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
}, (t) => [uniqueIndex("users_email_idx").on(t.email)]);

export const authTokens = pgTable("auth_tokens", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  kind: text("kind").notNull(), // verify_email | reset_password
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [index("auth_tokens_hash_idx").on(t.tokenHash)]);

/* ---------------- exam catalogue ---------------- */
export const examCategories = pgTable("exam_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  displayOrder: integer("display_order").notNull().default(0),
  status: text("status").notNull().default("active"),
});

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => examCategories.id),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // draft | published | disabled
  questionTypes: text("question_types").array().notNull(),
  scoring: jsonb("scoring").notNull(),
  features: jsonb("features").$type<Record<string, boolean>>().notNull(),
  axes: text("axes").array().notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(180),
  mockQuestionCount: integer("mock_question_count").notNull().default(100),
  blueprint: jsonb("blueprint").$type<{ note?: string; version?: string; validatedAt?: string; syllabusUrl?: string }>(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Generic taxonomy: categories, subjects, sections, systems, topics, subtopics — per exam. */
export const taxonomy = pgTable("taxonomy", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  parentId: integer("parent_id"),
  kind: text("kind").notNull(), // category | subject | section | system | topic | subtopic
  name: text("name").notNull(),
  description: text("description"),
  weight: real("weight"),
  displayOrder: integer("display_order").notNull().default(0),
  status: text("status").notNull().default("active"),
}, (t) => [index("taxonomy_exam_idx").on(t.examId, t.kind), index("taxonomy_parent_idx").on(t.parentId)]);

/* ---------------- content ---------------- */
export const QUESTION_STATUSES = ["draft", "initial_review", "clinical_review", "editorial_review", "approved", "published", "archived", "revision_requested", "rejected"] as const;
export type QuestionStatus = (typeof QUESTION_STATUSES)[number];

export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  categoryId: integer("category_id"),
  subjectId: integer("subject_id"),
  systemId: integer("system_id"),
  topicId: integer("topic_id"),
  difficulty: text("difficulty").notNull().default("moderate"),
  patient: jsonb("patient").notNull(),
  sections: jsonb("sections").notNull(),
  status: text("status").$type<QuestionStatus>().notNull().default("draft"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  categoryId: integer("category_id"),
  subjectId: integer("subject_id"),
  systemId: integer("system_id"),
  topicId: integer("topic_id"),
  subtopicId: integer("subtopic_id"),
  caseStudyId: integer("case_study_id").references(() => caseStudies.id, { onDelete: "cascade" }),
  caseStep: integer("case_step"),
  ncjmmStep: text("ncjmm_step"),
  type: text("type").notNull(),
  difficulty: text("difficulty").notNull().default("moderate"),
  stem: text("stem").notNull(),
  scenario: text("scenario"),
  patient: jsonb("patient"),
  exhibit: jsonb("exhibit"),
  content: jsonb("content").notNull(),
  answer: jsonb("answer").notNull(),
  rationale: text("rationale").notNull().default(""),
  optionExplanations: jsonb("option_explanations"),
  extras: jsonb("extras"),
  clinicalConcept: text("clinical_concept"),
  clinicalSetting: text("clinical_setting"),
  tags: text("tags").array().notNull().default([]),
  references: text("references"),
  imageUrl: text("image_url"),
  status: text("status").$type<QuestionStatus>().notNull().default("draft"),
  source: text("source").notNull().default("manual"), // manual | ai | import | seed
  contentHash: text("content_hash"),
  version: integer("version").notNull().default(1),
  createdBy: uuid("created_by"),
  reviewedBy: uuid("reviewed_by"),
  approvedAt: timestamp("approved_at"),
  publishAt: timestamp("publish_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("questions_exam_status_idx").on(t.examId, t.status),
  index("questions_topic_idx").on(t.topicId),
  index("questions_case_idx").on(t.caseStudyId),
  index("questions_hash_idx").on(t.contentHash),
]);

export const questionVersions = pgTable("question_versions", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  snapshot: jsonb("snapshot").notNull(),
  editedBy: uuid("edited_by"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const questionReviews = pgTable("question_reviews", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  reviewerId: uuid("reviewer_id").references(() => users.id),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  decision: text("decision").notNull(), // advance | approve | publish | reject | request_revision | unpublish | archive | restore
  comments: text("comments"),
  clinicalValidation: boolean("clinical_validation"),
  editorialValidation: boolean("editorial_validation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studyMaterials = pgTable("study_materials", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  topicId: integer("topic_id"),
  kind: text("kind").notNull(), // notes | guide | video | syllabus
  title: text("title").notNull(),
  summary: text("summary"),
  body: text("body"),
  url: text("url"),
  durationMinutes: integer("duration_minutes"),
  status: text("status").notNull().default("published"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  topicId: integer("topic_id"),
  front: text("front").notNull(),
  back: text("back").notNull(),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const flashcardProgress = pgTable("flashcard_progress", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  flashcardId: integer("flashcard_id").notNull().references(() => flashcards.id, { onDelete: "cascade" }),
  box: integer("box").notNull().default(0), // Leitner box 0-4
  dueAt: timestamp("due_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.flashcardId] })]);

export const labValues = pgTable("lab_values", {
  id: serial("id").primaryKey(),
  grp: text("grp").notNull(),
  name: text("name").notNull(),
  range: text("range").notNull(),
  unit: text("unit").notNull(),
  note: text("note"),
});

/* ---------------- enrollment & subscriptions ---------------- */
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("active"),
  targetDate: date("target_date"),
  dailyGoal: integer("daily_goal").notNull().default(40),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
}, (t) => [uniqueIndex("enroll_user_exam_idx").on(t.userId, t.examId)]);

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  kind: text("kind").notNull(), // free | single | bundle | all_access | institution
  description: text("description"),
  priceCents: integer("price_cents").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  interval: text("interval").notNull().default("month"),
  examIds: integer("exam_ids").array(),
  limits: jsonb("limits").$type<{ questionsPerDay?: number; mockExams?: boolean; caseStudies?: boolean; analytics?: boolean; ai?: boolean; downloads?: boolean; seats?: number }>(),
  active: boolean("active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: integer("plan_id").notNull().references(() => plans.id),
  status: text("status").notNull().default("active"),
  source: text("source").notNull().default("manual"), // manual | payment | institution
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endsAt: timestamp("ends_at"),
});

/* ---------------- testing ---------------- */
export const TEST_KINDS = ["custom", "tutorial", "topic", "system", "incorrect", "marked", "unanswered", "weak", "assessment", "mock", "adaptive", "diagnostic", "readiness", "case_study"] as const;
export type TestKind = (typeof TEST_KINDS)[number];

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  kind: text("kind").$type<TestKind>().notNull(),
  mode: text("mode").notNull(), // tutor | timed | exam
  config: jsonb("config").notNull(),
  questionIds: integer("question_ids").array().notNull(),
  timeLimitSec: integer("time_limit_sec"),
  elapsedSec: integer("elapsed_sec").notNull().default(0),
  currentIndex: integer("current_index").notNull().default(0),
  adaptive: jsonb("adaptive"), // CAT state
  status: text("status").notNull().default("in_progress"), // in_progress | completed | abandoned
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
}, (t) => [index("tests_user_exam_idx").on(t.userId, t.examId)]);

export const testAnswers = pgTable("test_answers", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull().references(() => tests.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  response: jsonb("response"),
  submitted: boolean("submitted").notNull().default(false),
  isCorrect: boolean("is_correct"),
  score: real("score"),
  maxScore: real("max_score"),
  timeSpentSec: integer("time_spent_sec").notNull().default(0),
  marked: boolean("marked").notNull().default(false),
  feedback: jsonb("feedback"),
  answeredAt: timestamp("answered_at"),
}, (t) => [uniqueIndex("answers_test_q_idx").on(t.testId, t.questionId), index("answers_user_q_idx").on(t.userId, t.questionId)]);

export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull().unique().references(() => tests.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  total: integer("total").notNull(),
  correct: integer("correct").notNull(),
  incorrect: integer("incorrect").notNull(),
  unanswered: integer("unanswered").notNull(),
  percent: real("percent").notNull(),
  pointsEarned: real("points_earned").notNull().default(0),
  pointsPossible: real("points_possible").notNull().default(0),
  totalTimeSec: integer("total_time_sec").notNull(),
  avgTimeSec: real("avg_time_sec").notNull(),
  breakdown: jsonb("breakdown").notNull(),
  estimate: jsonb("estimate"),
  recommendations: jsonb("recommendations"),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
}, (t) => [index("results_user_exam_idx").on(t.userId, t.examId)]);

/* ---------------- student tools ---------------- */
export const bookmarks = pgTable("bookmarks", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.questionId] })]);

export const notes = pgTable("notes", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.questionId] })]);

export const questionReports = pgTable("question_reports", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  body: text("body"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- AI ---------------- */
export const aiJobs = pgTable("ai_jobs", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  params: jsonb("params").notNull(),
  status: text("status").notNull().default("pending"),
  engine: text("engine"),
  createdCount: integer("created_count").notNull().default(0),
  duplicateCount: integer("duplicate_count").notNull().default(0),
  error: text("error"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- platform ---------------- */
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  href: text("href"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [index("notif_user_idx").on(t.userId)]);

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id"),
  action: text("action").notNull(),
  entity: text("entity"),
  entityId: text("entity_id"),
  meta: jsonb("meta"),
  ip: text("ip"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ---------------- AUSTY Health Care Module ---------------- */
export const AUSTY_ROLES = [
  "state_manager",
  "district_manager",
  "team_leader",
  "bde",
  "field_executive",
] as const;
export type AustyRole = (typeof AUSTY_ROLES)[number];

export const AUSTY_PROVIDER_CATEGORIES = [
  "doctor",
  "pharmacy",
  "lab",
  "hospital",
  "ambulance",
  "rental_equipment",
] as const;
export type AustyProviderCategory = (typeof AUSTY_PROVIDER_CATEGORIES)[number];

export const AUSTY_REVENUE_CATEGORIES = [
  "doctor_consultation",
  "pharmacy_orders",
  "diagnostic_lab_tests",
  "ct_mri_bookings",
  "ambulance_bookings",
  "hospital_surgery",
  "rental_medical_equipment",
] as const;
export type AustyRevenueCategory = (typeof AUSTY_REVENUE_CATEGORIES)[number];

export const AUSTY_INCENTIVE_STATUSES = [
  "calculated",
  "pending_verification",
  "approved",
  "rejected",
  "payment_processing",
  "paid",
] as const;
export type AustyIncentiveStatus = (typeof AUSTY_INCENTIVE_STATUSES)[number];

export const austyEmployees = pgTable("austy_employees", {
  id: serial("id").primaryKey(),
  employeeCode: text("employee_code").notNull().unique(),
  referenceId: text("reference_id").notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email").notNull().unique(),
  designation: text("designation").notNull(),
  role: text("role").$type<AustyRole>().notNull(),
  assignedState: text("assigned_state").notNull(),
  assignedDistrict: text("assigned_district").notNull(),
  assignedCity: text("assigned_city").notNull(),
  joiningDate: date("joining_date").notNull(),
  managerId: integer("manager_id"),
  status: text("status").notNull().default("active"), // active | inactive | suspended
  monthlyTargetRevenue: real("monthly_target_revenue").notNull().default(150000),
  monthlyTargetProviders: integer("monthly_target_providers").notNull().default(20),
  qualityScore: real("quality_score").notNull().default(9.0), // 0..10
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("austy_emp_state_idx").on(t.assignedState, t.assignedDistrict),
  index("austy_emp_mgr_idx").on(t.managerId),
]);

export const austyProviders = pgTable("austy_providers", {
  id: serial("id").primaryKey(),
  providerCode: text("provider_code").notNull().unique(),
  registrationNumber: text("registration_number").notNull().unique(), // Prevents duplicate onboarding & attribution
  name: text("name").notNull(),
  category: text("category").$type<AustyProviderCategory>().notNull(),
  mobile: text("mobile").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  city: text("city").notNull(),
  onboardedByEmployeeId: integer("onboarded_by_employee_id").notNull().references(() => austyEmployees.id),
  employeeReferenceId: text("employee_reference_id").notNull(),
  verified: boolean("verified").notNull().default(true),
  active: boolean("active").notNull().default(true),
  satisfactionRating: real("satisfaction_rating").notNull().default(4.7),
  onboardedAt: timestamp("onboarded_at").notNull().defaultNow(),
}, (t) => [
  index("austy_prov_state_idx").on(t.state, t.district, t.city),
  index("austy_prov_emp_idx").on(t.onboardedByEmployeeId),
]);

export const austyTransactions = pgTable("austy_transactions", {
  id: serial("id").primaryKey(),
  transactionCode: text("transaction_code").notNull().unique(),
  providerId: integer("provider_id").notNull().references(() => austyProviders.id),
  employeeId: integer("employee_id").notNull().references(() => austyEmployees.id),
  employeeReferenceId: text("employee_reference_id").notNull(),
  category: text("category").$type<AustyRevenueCategory>().notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  city: text("city").notNull(),
  transactionValue: real("transaction_value").notNull(),
  grossPlatformRevenue: real("gross_platform_revenue").notNull(),
  platformServiceFee: real("platform_service_fee").notNull(),
  discountAmount: real("discount_amount").notNull().default(0),
  refundAmount: real("refund_amount").notNull().default(0),
  netPlatformRevenue: real("net_platform_revenue").notNull(),
  eligibleRevenue: real("eligible_revenue").notNull(),
  status: text("status").notNull().default("completed"), // completed | cancelled | refunded
  transactedAt: timestamp("transacted_at").notNull().defaultNow(),
}, (t) => [
  index("austy_tx_emp_idx").on(t.employeeId),
  index("austy_tx_state_idx").on(t.state, t.district),
  index("austy_tx_cat_idx").on(t.category),
]);

export const austyIncentives = pgTable("austy_incentives", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => austyEmployees.id, { onDelete: "cascade" }),
  periodMonth: text("period_month").notNull(), // YYYY-MM
  targetRevenue: real("target_revenue").notNull(),
  achievedEligibleRevenue: real("achieved_eligible_revenue").notNull(),
  targetProviders: integer("target_providers").notNull(),
  achievedProviders: integer("achieved_providers").notNull(),
  achievementPercent: real("achievement_percent").notNull(),
  epsScore: real("eps_score").notNull(),
  epsBreakdown: jsonb("eps_breakdown").$type<{
    onboarding: number;
    revenue: number;
    transactions: number;
    retention: number;
    quality: number;
  }>().notNull(),
  incentiveAmount: real("incentive_amount").notNull().default(0),
  teamManagementBonus: real("team_management_bonus").notNull().default(0),
  status: text("status").$type<AustyIncentiveStatus>().notNull().default("calculated"),
  paymentDate: timestamp("payment_date"),
  transactionReference: text("transaction_reference"),
  approvedBy: text("approved_by"),
  notes: text("notes"),
  history: jsonb("history").$type<{ status: string; by: string; at: string; note?: string }[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("austy_inc_emp_month_idx").on(t.employeeId, t.periodMonth),
]);

export const austyActivityLogs = pgTable("austy_activity_logs", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => austyEmployees.id, { onDelete: "cascade" }),
  employeeReferenceId: text("employee_reference_id").notNull(),
  action: text("action").notNull(),
  transactionCode: text("transaction_code"),
  providerCode: text("provider_code"),
  description: text("description").notNull(),
  amount: real("amount"),
  state: text("state").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("austy_act_emp_idx").on(t.employeeId),
]);
