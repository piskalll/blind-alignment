# Product Requirement Document (PRD)

**Product Name:** SalingPaham (VowSync)

**Document Version:** 1.0.0

**Author / PM Role:** Technical Lead PM

**Target Persona:** Pre-Marital Young Adults & Sandwich Generation Couples

**Core Value Proposition:** Indonesia’s first pre-marital web platform that breaks financial and principle taboos through a dual-blind reveal mechanism, transforming uncomfortable conversations into transparent, documented agreements without fear of partner judgment.

---

## 1. Executive Summary & Problem Framing

### 1.1 Context & Problem Statement

Young pre-marital couples (aged 23–32), particularly white-collar and sandwich-generation workers, struggle to align on financial liabilities, debt transparency, and domestic life principles due to cultural taboos and face-to-face pleasing bias. Left unresolved during the 6–18 month pre-wedding window, this leads to post-marital cashflow shock, protracted conflicts, and early divorce risks within the first 1–3 years of marriage.

### 1.2 Pain Points (Synthesized from Research & Customer Voice)

* **Pleasing Bias Trap:** Couples habitually yield and default to superficial agreement during face-to-face discussions to evade immediate tension, creating future friction.
* **Fear of Being Judged:** Apprehension around being labeled materialistic, untrustworthy, or unsupportive when asking about active paylater debt, credit lines, or bank balances.
* **Sandwich Generation Liability Asymmetry:** Discomfort and hesitation when establishing firm monthly allowances for parents and extended family versus primary household needs.
* **In-Law Boundary Ambiguity:** Unaddressed friction regarding living arrangements (cohabiting with in-laws vs. independent renting) and extended family involvement.
* **Market Void:** Existing channels (KUA lectures, casual mobile trivia like Paired, expensive counseling, physical question cards) lack micro-financial simulations, isolated answer seals, and verifiable post-session documentation.

---

## 2. Target Persona & User Archetype

| Attribute | Details |
| --- | --- |
| **Primary Persona** | Pre-marital young adults (ages 23–32) in serious relationships for >1 year, planning marriage within 6–18 months. |
| **Sub-Segment** | Sandwich-generation workers with recurring obligations to parents/siblings, and couples with income disparities. |
| **User Archetype** | **Bima (26)**: Engaged private-sector professional supporting his mother, stressed about wedding debt and setting living boundaries without personal confrontation. |
| **User Gains & Expectations** | Isolated submission without peeking, objective neutral system prompts, visual friction mapping, and an actionable, signed Living Charter. |

---

## 3. Scope & Technical Architecture Decisions

* **Client Delivery:** Mobile-first responsive web application accessible via mobile browsers without mandatory app-store downloads (zero-install onboarding).
* **Session & Persistence Model:**
  * *Zero-Barrier Entry:* Instant room generation without mandatory pre-registration; users pair using an auto-generated 6-character room access code (e.g., `VWS-418`, `SRH-207`) or WhatsApp link.
  * *Account & Storage Flexibility:* Resolves wireframe ambiguity by supporting guest session storage via client storage and encrypted session tokens, while offering optional email registration for account dashboard history and recurring access.
* **Security & Cryptographic Seal:**
  * End-to-End Encryption (E2EE) for confidential drafts.
  * *Blind-Lock Mechanism:* Responses remain sealed on the server; neither client receives the partner's payload until both have set their status to locked.

---

## 4. Design System & UI Specifications (Aligned with Module 5 Tokens)

The user interface implements the design specifications and design tokens defined in Module 5:

* **Two-Tier Semantic Color Tokens:**
  * `Navy` (`#1E293B`): Foundations, typography, headings, surface trust layers.
  * `Emerald` (`#0F766E`): Primary CTAs, aligned status indicators ($\ge 70\%$ match).
  * `Amber` (`#D97706`): In-progress badges, system warnings, moderate friction.
  * `Crimson` (`#DC2626` / `#B91C1C`): Critical conflicts ($< 50\%$ match), error states.
  * Backgrounds & Borders: App canvas `#F1F5F9`, card surface `#FFFFFF`, border `#E2E8F0`.

* **Typography:**
  * **Plus Jakarta Sans:** Primary interface typography across all headings (H1–H3), body copy, and UI controls.
  * **Newsreader (Italic 400):** Reflective prompts and charter commitments.
  * **JetBrains Mono (400):** IDR amounts, room access codes, and cryptographic session hashes.

* **Layout, Grids & Radii:** Strict 8pt grid (`space-2` to `space-16`). Border radii set to 8px (buttons/inputs), 12px (dilemma choice cards), and 16px (containers/modals).

---

## 5. End-to-End User Flow & Page Requirements

```
[Phase 1: Setup & Room Creation] ──> [Phase 2: Lobby & WhatsApp Pairing]
                                                │
[Phase 4: Waiting & Sealed State] <── [Phase 3: Isolated Dilemma Answering]
                │
                └──> [Phase 5: The Dual Reveal & Friction Heatmap]
                                └──> [Phase 6: Neutral Compromise Engine]
                                                └──> [Phase 7: Living Agreement (PDF Sign)]
```

### Phase 1: Setup & Topic Configuration

* **Objective:** Allow the host to initialize an alignment session without onboarding friction.
* **Configuration Controls:**
  * Select target module (Default: *Module 1 - Financial Transparency & Debt Liabilities*).
  * Advanced options: *Lock to exactly 2 participants (Couple Mode)* and *Allow changes before final global lock*.
  * Input custom context/prompt or use standard pre-marital scenarios.
* **System Action:** Generates a 6-character room access code and WhatsApp invitation deep link.

### Phase 2: Pairing Lobby & Psychological Readiness

* **Host UI:** Displays real-time couple roster status (`1/2 Joined`), copyable room link, and dev preview simulators.
* **Partner UI:** Guest joins via code or link and provides their display name.
* **Readiness Check:** When both users join via WebSocket, the *Lock Roster & Begin* button activates. Both partners accept the mindset prompt: *"I agree to answer for us, not to please my partner"*.

### Phase 3: Isolated Dilemma Answering (The Dual-Blind Phase)

* **Mechanics:** 10 realistic household scenarios per module answered independently on private mobile screens.
* **Input Components:**
  * *Choice Cards:* Multiple-choice options (Options A, B, C) framed neutrally without moral bias.
  * *Confidential Range Inputs:* Numeric slider / JetBrains Mono input for specific thresholds (e.g., parental support from IDR 500,000 to IDR 5,000,000).
  * *Reasoning Area:* Optional private commentary field explaining personal considerations.
* **Core Scenarios (Module 1 Scope):**
  1. Existing paylater balances prior to marriage.
  2. Combined debt-to-income ceiling.
  3. Monthly allowances/transfers to parents.
  4. Urgent parental medical requests (e.g., IDR 15,000,000 emergency loan).
  5. Emergency fund runway target (months of expenses).
  6. Joint account administrative ownership and PIN access.
  7. Repayment strategies for partner debt / student loans.
  8. Wedding expenditure limits vs. housing down-payment.
  9. Siblings' tuition contributions.
  10. Spending notification threshold for personal purchases (> IDR 2,000,000).
* **Submission:** Autosaves selections continuously. Users submit their choices via the *Lock In Answer* CTA.

### Phase 4: Encrypted Waiting & Sealed State

* **UI Behavior:** Triggers when one partner finishes ahead of the other, displaying: *"Encrypted & Locked. Waiting for partner to finish"*.
* **Privacy Guardrail:** Prevents data exposure before mutual completion.
* **Engagement Content:** Displays conversation framework guides (*"The Yours, Mine, Ours budget talk"*, *"Saying no to family requests, kindly"*) alongside an optional WhatsApp notification ping.

### Phase 5: The Dual Reveal & Friction Heatmap

* **Trigger:** WebSocket synchronization detects both partners have locked their answers.
* **Analytics Engine:**
  * Displays overall alignment score (e.g., `68% Aligned`).
  * Renders radar chart / pillar match bars: Joint Budgeting (90%), Investment Horizon (85%), Extended Family Support (30% - Critical Conflict Detected), Debt Disclosure (67%).
  * Side-by-side comparison cards illustrating Partner 1 vs. Partner 2 preferences without pejorative labeling.

### Phase 6: Neutral Compromise Engine

* **Objective:** Mediate identified gaps on critical conflict scenarios ($< 50\%$ match).
* **System Suggestions:**
  * Empathetic framing: *"Both answers come from care for family. The gap is about how much and who decides"*.
  * Pre-structured compromise options: Tiered safety net caps (e.g., IDR 2,000,000 monthly limit), 24-hour joint discussion rules for requests > IDR 5,000,000, or a dedicated 7.5% extended family fund.
  * Custom compromise text box (280-character maximum).
  * *Agree & Add to Living Charter* CTA.

### Phase 7: Mutual Signing & Living Agreement Generation

* **Summary Documentation:** Consolidates all ratified clauses into *Article I: Financial Principles*.
* **Cryptographic Signing Block:** Records participant display names, exact timestamps (WIB), and SHA-256 session hash seals.
* **Output:**
  * Instant download of the official *Signed Living Agreement (PDF)*.
  * Progression route unlocking *Module 2: Sandwich Generation & In-Law Boundaries*.

---

## 6. Functional & Non-Functional Requirements

### 6.1 Functional Requirements

* **FR-01 (Session Orchestration):** System must generate 6-character room codes and manage two-party state handshakes across hosts and guests.
* **FR-02 (Dual-Blind Protocol):** System shall prevent client-side retrieval or rendering of partner answers while user submission state remains incomplete.
* **FR-03 (Dynamic Alignment Scoring):** System shall calculate category and overall match percentages using defined distance matrices:
  * Identical categorical selections = 100% match.
  * Adjacent compromise alternatives = 60%–80% match.
  * Polar opposite selections = $\le 30\%$ match (triggers Critical Conflict tag).
* **FR-04 (Compromise Resolution Commit):** System shall enable mutual ratifications to be written into the active charter payload.
* **FR-05 (PDF Export Engine):** System must compile finalized consensus points, session hashes, timestamps, and identity stamps into a downloadable, print-ready PDF document matching typography guidelines.

### 6.2 Non-Functional Requirements

* **NFR-01 (Zero-Leakage Security):** Strict transport security (TLS 1.3), end-to-end data encryption, and zero transmission of plaintext sensitive answers prior to mutual release.
* **NFR-02 (Mobile Performance):** Target viewports of 360px–428px with sub-100ms UI interaction latency.
* **NFR-03 (Real-Time Resilience):** Real-time WebSocket connection state with automated HTTP long-polling fallback within 2 seconds of connection drops.

---

## 7. Metrics & Validation Criteria

| Metric | Target | Verification Method |
| --- | --- | --- |
| **Task Completion Rate** | $\ge 85\%$ | Percentage of test pairs completing room initiation through PDF download. |
| **Perceived Psychological Safety** | $\ge 80\%$ | Post-session survey confirming reduced discomfort compared to direct face-to-face confrontation. |
| **Cognitive Ease (SEQ)** | $\ge 5.5$ / 7.0 | Single Ease Question rating for answering scenarios, reading the heatmap, and resolving compromises. |
