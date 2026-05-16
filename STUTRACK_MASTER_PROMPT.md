# StuTrack Master Specification & Vibe Coding Prompt

## Project Identity
**Name:** StuTrack
**Tagline:** Bridging the Gap Between Academia and Industry.
**Vibe:** Professional, Modern, Data-Driven, Academic-Tech (Clean layouts, subtle accents, technical typography).

---

## 1. User Types & Access Control

### 1.1 Student (Role: `STUDENT`)
*   **Purpose:** Find internships, build a professional profile, prepare for interviews, and track applications.
*   **Login/Register:** Sign up with university email, SSO integration (optional), profile completion (skills, education, interests).
*   **Features:**
    *   **Internship Explorer:** Smart search with filters (role, location, duration, pay).
    *   **Matching Score:** Real-time AI analysis of how well a student's profile fits a job description.
    *   **Standardized Test Reuse:** Integration of external test results (SAT, GRE, GMAT, or internal StuTrack assessments).
    *   **Application Tracking:** Kanban/List view of current applications (Applied -> Interview -> Offer -> Rejected).
    *   **Mentorship System:** Request mentorship from senior students or industry professionals.
    *   **Application Simulator:** AI-powered mock interviews and CV feedback.
    *   **Experience Database:** Browser reviews and feedback from previous interns at specific companies.

### 1.2 Company (Role: `COMPANY`)
*   **Purpose:** Post internship opportunities, manage applicants, and build industry-academic partnerships.
*   **Dashboard:** Applicant funnel, active listings, transparency metrics.
*   **Features:**
    *   **Job Posting Manager:** Detailed forms with skills tags and requirements.
    *   **Applicant CRM:** Filter, rate, and move applicants through stages.
    *   **Transparency Score:** Public metric based on response time and feedback quality.
    *   **Feedback System:** Automated and manual feedback loops to help students improve.
    *   **Partnership Hub:** Connect with universities for targeted talent pipelines.

### 1.3 University Admin (Role: `UNIVERSITY_ADMIN`)
*   **Purpose:** Monitor student progress, verify internships for credit, and manage corporate relations.
*   **Dashboard:** Macro-view of student placement rates, top hiring companies, and partnership health.
*   **Features:**
    *   **Student Monitoring:** Track which students are interning where and their performance.
    *   **Internship Verification:** Approve internships for academic credit.
    *   **Analytics:** Placement statistics, skill gap analysis for curriculum improvement.

### 1.4 Platform Admin (Role: `PLATFORM_ADMIN`)
*   **Purpose:** Maintain system integrity, moderate content, and oversee the ecosystem.
*   **Features:** Global analytics, user verification, job moderation, billing (if applicable).

---

## 2. Technical Architecture (Master Prompt for Developer)

### 2.1 Backend & Database (Supabase / Postgres)
**Tables Needed:**
1.  `profiles`: `id`, `email`, `role`, `full_name`, `avatar_url`, `created_at`.
2.  `students`: `id` (FK), `university_id` (FK), `gpa`, `skills` (JSONB), `resume_url`, `bio`.
3.  `companies`: `id` (FK), `website`, `location`, `transparency_score`, `verified`.
4.  `universities`: `id`, `name`, `domain`, `location`.
5.  `internships`: `id`, `company_id` (FK), `title`, `description`, `requirements` (JSONB), `status`, `expires_at`.
6.  `applications`: `id`, `student_id` (FK), `internship_id` (FK), `status` (Enum), `match_score`, `feedback_id` (FK).
7.  `mentorships`: `id`, `mentor_id` (FK), `mentee_id` (FK), `status`.
8.  `test_results`: `id`, `student_id` (FK), `test_name`, `score`, `verified`.
9.  `experiences`: `id`, `student_id` (FK), `company_id` (FK), `rating`, `review`, `is_public`.
10. `notifications`: `id`, `user_id` (FK), `message`, `type`, `read_status`.

### 2.2 Frontend Stack (React/Vite)
*   **UI Components:** shadcn/ui (if requested), Tailwind CSS.
*   **Interactions:** Framer Motion (page transitions, staggered list entrances).
*   **Icons:** Lucide-React.
*   **AI Integration:** Gemini API for "Matching Score" calculation and "Application Simulator" logic.

---

## 3. UI/UX Specifications

### 3.1 Design Language
*   **Primary Color:** `Slate-900` (Text/Elements), `Indigo-600` (Primary Action).
*   **Typography:** `Inter` for UI, `Space Grotesk` for Headings.
*   **Layout:** Sidebar-driven dashboards for all user types. Content-rich data tables and cards.

### 3.2 Core Dashboard Logic
*   **Student:** Large search bar top, "Recommended for You" section based on Match Score, Application funnel.
*   **Company:** "Action Required" list (new applicants), "Active Listings" stats.
*   **University:** Map of student placements, partnership request inbox.

---

## 4. Feature Workflows

### 4.1 The Application Flow
1.  **Selection:** Student clicks "Apply" on an Internship.
2.  **Match Calculation:** AI analyzes Student Profile vs Job Req -> Match Score %.
3.  **Submission:** Student confirms details + Custom Cover Letter.
4.  **Company Review:** Company sees applicant with Match Score badge. Moves to "Interview".
5.  **Interview/Feedback:** Company provides feedback after rounds.
6.  **Result:** Offer or Rejection. If Offer, Student accepts. If Reject, Company feedback is saved to Student's profile for growth.

### 4.2 Matching Score Algorithm (AI Prompt)
"Compare the student's skill array `[skills]` and bio `bio` with the internship requirements `requirements`. Return a score from 0-100 and a 1-sentence reasoning."

### 4.3 Transparency Score
Calculated as: `(Average Response Time Score + Feedback Rate + Verified Status) / 3`.

---

## 5. Development Milestones
1.  **Auth & Roles:** Setup Supabase Auth with custom claims for Roles.
2.  **Profile Orchestration:** Distinct onboarding for Students vs Companies.
3.  **Job Market:** Create and search internship listings.
4.  **Application Logic:** Connect Students to Jobs with status management.
5.  **AI Layer:** Implement Gemini for Match Scores and Simulated Interviews.
6.  **Feedback & Metrics:** Transparency scores and student experience reviews.

---

**Coding Instructions:**
*   Use `lucide-react` for all icons.
*   Use `motion/react` for all layout transitions.
*   Implement a dark/light mode toggle.
*   Ensure all forms use robust validation.
*   Maintain a strict type-safe environment.
