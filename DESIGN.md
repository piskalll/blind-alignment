# DESIGN.md: SalingPaham (VowSync)

## Design Read
Reading this as: pre-marital financial and domestic alignment web application for Indonesian couples (ages 23 to 32), in an editorial legal-charter and dual-column ledger visual language, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

## 1. Identity & Character
- **Product:** SalingPaham (VowSync), a dual-blind pre-marital alignment platform where two partners independently answer 40 household scenarios across 4 modules before revealing gaps and signing a Living Charter.
- **Visual Metaphor:** A confidential pre-marital workbook and formal covenant ledger. It combines the calm clarity of a financial worksheet with the solemn permanence of a printed legal agreement.
- **Identity Motif:**
  1. **Dual-Column Comparison Ledger:** Side-by-side partner columns (Partner A vs. Partner B) separated by hairlines, showing sealed vs. revealed states.
  2. **Editorial Serif Vows:** Formal commitments and reflective prompts set in italic `Newsreader`, contrasting with structured UI controls in `Plus Jakarta Sans` and nominal IDR amounts in `JetBrains Mono`.

## 2. Color System (2 Core + 1 Accent + Semantic States)
All pairings are verified via `contrast-check.py` to meet or exceed WCAG AA (4.5:1 normal text, 3.0:1 large text and non-text boundaries) in both Light and Dark themes.

### Light Theme (Default Editorial Paper)
- **Canvas Background (`--surface-subtle`):** `#F1F5F9` (Slate 100)
- **Sheet / Card Surface (`--surface-primary`):** `#FFFFFF` (Pure White)
- **Primary Ink (`--text-default`):** `#1E293B` (Slate 800, 14.63:1 on `#FFFFFF`, 13.35:1 on `#F1F5F9`)
- **Secondary Ink (`--text-muted`):** `#475569` (Slate 600, 7.58:1 on `#FFFFFF`, 6.92:1 on `#F1F5F9`)
- **Structural Borders (`--border-default` / `--border-strong`):** `#CBD5E1` / `#94A3B8`
- **Primary Accent (`--emerald`):** `#0F766E` (Teal 700, 5.47:1 with `#FFFFFF` text) and `#065F46` text on `#ECFDF5` tint (7.29:1)
- **Semantic Warning (`--amber-text`):** `#92400E` on `#FFFBEB` (6.84:1) or `#B45309` on `#FFFFFF` (5.02:1)
- **Semantic Conflict (`--crimson-text`):** `#991B1B` on `#FEF2F2` (7.60:1) or `#B91C1C` on `#FFFFFF` (6.47:1)

### Dark Theme (Night Reading Mode)
- **Canvas Background:** `#0F172A` (Slate 900)
- **Sheet / Card Surface:** `#1E293B` (Slate 800)
- **Primary Ink:** `#F8FAFC` (Slate 50, 13.92:1 on `#1E293B`)
- **Secondary Ink:** `#CBD5E1` (Slate 300, 9.85:1 on `#1E293B`)
- **Primary Accent:** `#0F766E` button surface with `#FFFFFF` text (5.47:1), `#5EEAD4` (Teal 300) for dark-surface accents

## 3. Typography & Hierarchy
- **Primary Sans (`--font-sans` — Plus Jakarta Sans):** Chosen for Indonesian legibility and warm geometric proportions across H1-H3 headings, scenario options, and form controls.
- **Editorial Serif (`--font-serif` — Newsreader Italic):** Chosen specifically to distinguish pre-marital vows, charter articles, and neutral mediation prompts from ordinary UI text.
- **Tabular Monospace (`--font-mono` — JetBrains Mono):** Used exclusively for IDR currency figures, 6-character room access codes (`VWS-XXX`), 4-digit PINs, scenario indices (`01` to `40`), and SHA-256 cryptographic seals.

## 4. Liveliness Dials & Purpose-Gate Decisions (R-31)
- **ENERGY 2 (Balanced):** Grounded, high-contrast editorial typography with structured ledger borders rather than floating shadows or neon glows.
- **RHYTHM 2 (Consistent with deliberate breaks):**
  - Landing page alternates between an asymmetric split workspace (Hero + Room Terminal), an interactive 3-state Dual-Blind Ledger simulator, a 4-pillar tabbed curriculum explorer, and a single-column accordion FAQ.
- **MOTION 1 (Calm):** Intentional state transitions on hover, focus-visible rings, and progress bar fills. Zero endless spinning, pulsing, or floating animations.
- **Radii (R-11):** `8px` (`rounded-lg`) for buttons and inputs, `12px` (`rounded-xl`) for scenario option rows, `16px` (`rounded-2xl`) for document sheets and modals.
- **Shadows (R-12):** Flat bordered surfaces by default; elevation shadow reserved strictly for the Compromise Modal overlay.
- **Icons (R-04):** Functional icons only (`Lock` for sealed blind state, `Check` for ratified state, `AlertTriangle` for <50% conflict, `Printer` for A4 charter export). No `Sparkles` or decorative emojis.
- **Button Arrows (R-08):** Used only on primary forward progression CTAs to signify advancing to the next stage of the protocol.
