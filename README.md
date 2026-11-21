# QREXq — Multi-Exam International Preparation Platform & AUSTY Health Care Analytics

Comprehensive multi-exam preparation platform (with **NCLEX-RN** as the flagship course across 45+ international examinations in 9 divisions) plus the integrated **AUSTY Health Care Private Limited — Employee Performance, Business Development & Revenue Analytics Module**, built on **Next.js 16.4**, **React 19**, **Tailwind CSS v4**, **uiarc.dev**, and **PostgreSQL (Neon + Drizzle ORM)**.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Push database schema to Neon PostgreSQL
npm run db:push

# 3. Seed examination catalogue, question banks, NGN case studies, flashcards, and AUSTY records
npm run db:seed

# 4. Run development server
npm run dev
```

Open `http://localhost:3000`.

### Demo Accounts

On `/login`, use **One-Click Demo Role Access** (or sign in with `SEED_PASSWORD` from `.env.local`):
- **Student:** `student@qrexq.test`
- **Clinical Reviewer:** `reviewer@qrexq.test`
- **Super Admin:** `admin@qrexq.test`

---

## Core Modules

1. **Multi-Exam International Preparation (`/dashboard`, `/catalog/[category]`, `/exam/[slug]`)**
   - **9 Exam Divisions & 45+ Courses:** Nursing (`NCLEX-RN`, `NCLEX-PN`, `FNP`, `Clinical Medical Mathematics`), Medical (`USMLE Step 1/2 CK/3`, `COMLEX 1/2`, `UKMLA`, `PLAB`, `ABIM`, `ABFM`), Dental (`DAT`, `INBDE`, `NBDE`, `Dental Anatomy`, `Dental Sciences`), Pharmacy (`NAPLEX`, `MPJE`, `CPJE`), Physician Assistant (`PANCE`, `PANRE`), English Language (`IELTS Academic`, `IELTS General`, `OET Nursing`, `OET Medicine`, `PTE Academic`, `TOEFL iBT`), College Entrance (`SAT`, `ACT`, `AP`), Graduate Admission (`MCAT`, `GRE`, `GMAT`), and Professional Certification (`CPA`, `CFA`, `CMA`, `LSAT`, `MBE`).
   - **12 Question Formats:** Single Best Answer (`mcq`), Select All That Apply (`sata`), NGN Extended Multiple Response (`multiple_response`), Ordered Response (`ordered`), Matrix/Grid (`matrix`), NGN Bow-Tie (`bowtie`), Highlight Text (`highlight`), Drop-Down Cloze (`cloze`), Trend (`trend`), Dosage/Numeric Calculation (`numeric`), Writing (`writing`), and Speaking (`speaking`).
   - **NGN Clinical Judgment Case Studies (`/exam/[slug]/cases`):** 8 unfolding 6-step case studies with progressive EHR tab disclosure across the 6 NCSBN Clinical Judgment Measurement Model (NCJMM) steps.
   - **Test Modes (`/exam/[slug]/create`, `/test/[id]`, `/test/[id]/results`):** Tutor Mode, Timed Mode, Exam Mode, 100-Question Balanced Practice Assessment, Full-Length Mock Exam, Rasch Computerized Adaptive Testing (CAT) Simulation, Diagnostic & Readiness Assessments, Weak-Area Tests, and 18-section clinical rationale breakdowns.

2. **Admin, Reviewer & AI Content Governance (`/admin`, `/admin/questions`, `/admin/ai`, `/admin/courses`, `/admin/import-export`)**
   - **8-Stage Review Pipeline:** `Draft` → `Initial Review` → `Clinical Review` → `Editorial Review` → `Approved` → `Published` → `Archived` (plus `Revision Requested` / `Rejected`) with separation of duties and audit history.
   - **Smart AI Question Generator:** Generates original draft items with SHA-256 duplicate protection and job logging.
   - **Bulk Import & Export:** Excel (`.xlsx`), CSV, and JSON import with automated validation reports and one-click exports.

3. **AUSTY Health Care — Employee Performance, Business Development & Revenue Analytics (`/austy`)**
   - **Employee Management:** Unique Employee ID (`AUSTY-EMP-*`), Unique Employee Reference ID (`AREF-IN-*`), 5 hierarchy roles (`State Business Manager`, `District Business Manager`, `Team Leader`, `Business Development Executive`, `Field Executive`), territory assignment, and targets.
   - **Pan-India State, District & City Tracking:** Doctors, pharmacies, diagnostic labs, hospitals, ambulances, and rental equipment vendors with duplicate registration & attribution lock.
   - **100-Point Employee Performance Score (EPS) & Monthly Incentive Slabs:** Configurable weights (30/30/20/10/10) and incentive slabs (`Below 50%` → ₹0 up to `100%+` → ₹6,000) with 6-stage payment approval workflow (`Calculated` → `Pending Verification` → `Approved` / `Rejected` → `Payment Processing` → `Paid`).
   - **7-Category Revenue Ledger & 8 Downloadable Enterprise Reports:** Excel (`.xlsx`), CSV, and print/PDF exports.
