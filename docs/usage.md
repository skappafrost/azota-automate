# Usage Guide

This guide covers every feature of Azota God Mode in detail.

## Table of Contents

- [The Floating Menu](#the-floating-menu)
- [Autopilot Section](#autopilot-section)
- [Memory Section](#memory-section)
- [Quick Fill Section](#quick-fill-section)
- [Đúng/Sai Section](#đúngsai-section)
- [Pattern Section](#pattern-section)
- [Working with Result Pages](#working-with-result-pages)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Data Management](#data-management)
- [Example Workflows](#example-workflows)

---

## The Floating Menu

Press the **backtick** key (`` ` ``) to toggle the menu visibility.

### Dragging the Menu
Click and hold the title bar (`⚡SKAPPA v15.3`) to drag the menu to any position. The position is saved in localStorage and restored on reload.

### Status Bar
The bottom of the menu shows real-time status messages:
- `■ Hidden · show` — Menu is hidden, press backtick to show
- `■ Result page · show` — You're on a result page
- `Learned 15 answers!` — Operation feedback
- `Pilot finished. Submitting...` — Pilot status

---

## Autopilot Section

The pilot input field accepts a **comma-separated string** with up to 4 fields:

```
<time>,<percent>,<submit>,<formula>
```

> Click the **(i)** icon next to the input for a quick reference tooltip.

### How Pilot Works

The Pilot operates in two phases:

**Phase 1 — Fill All Correct**
The script iterates through every question and selects the saved correct answer from memory. If you just want everything answered correctly, use `0` (no time limit, no target %).

**Phase 2 — Optimal Flipping (only if target % is set)**
If a target percentage is provided, the script calculates the optimal set of answers to flip to wrong answers to reach exactly the target score. It respects the T/F scoring formula.

### Pause and Resume
- Click **■ PILOT** again to **pause** — the script saves its state
- Click **▶ PILOT** again to **resume** from where it left off
- Only works if a target percentage was configured

---

## Memory Section

### 🧠 LEARN (skLearn)

**On Exam Pages:** Captures all currently selected answers and saves them to localStorage.

**On Result Pages:** Extracts all correct answers from the answer key and saves them. Supports:
- Multiple choice answers (letter-based)
- True/False answers (Đúng/Sai with letter labels)
- Essay answers (bracketed text or text-danger spans)

### 🎯 REVIEW (skReview)

**On Exam Pages:** Matches each question against the saved database and auto-selects matching answers. Green highlight indicates filled answers.

**On Result Pages:** Highlights correct answers that match your saved database. Bold + underline styling for matched Đúng/Sai sub-items.

### ⬇ EXPORT / ⬆ IMPORT

Export saves the entire memory database as a `.json` file.  
Import merges a previously exported file into the current database (no data loss).

### 📋 LOG

Dumps the entire memory database to the browser console. Press F12 to view it.

### 🗑 CLEAR

Deletes all saved memory data. Asks for confirmation first.

---

## Quick Fill Section

| Button | Action |
|--------|--------|
| **A** | Select answer A (index 0) for all multiple-choice questions |
| **B** | Select answer B (index 1) |
| **C** | Select answer C (index 2) |
| **D** | Select answer D (index 3) |
| **🎲 RANDOM** | Select a random answer (A/B/C/D) for each question |
| **🚀 SUBMIT** | Automatically click the "Nộp bài" (Submit) button |

### Submit Safety Check

Before submitting, the script checks if at least 50% of questions have been answered. If less than 50%, it shows a confirmation dialog to prevent accidental submission.

---

## Đúng/Sai Section

| Button | Action |
|--------|--------|
| **✓ DUNG** | Fill "Đúng" on all True/False questions |
| **✗ SAI** | Fill "Sai" on all True/False questions |
| **TF PTN** | Fill True/False using the pattern from the Pattern input field |
| **ESSAY** | Fill random numeric drafts into all essay textareas |

### True/False Pattern Logic

When using TF PTN, each character in the pattern determines the fill:
- **A** or **C** → Fill Đúng
- **B** or **D** → Fill Sai

---

## Pattern Section

The pattern field controls how answers are distributed. Used by:
- **Pattern Run** button (▶ next to field)
- **TF PTN** button

**Format:** A string of uppercase letters (A, B, C, D)

**Examples:**
| Pattern | Effect |
|---------|--------|
| `ABCD` | Cycle through A, B, C, D repeatedly |
| `AABB` | Two A's, two B's, repeat |
| `DCBA` | Reverse order cycle |
| `AAAA` | All A's |

---

## Working with Result Pages

When the script detects a result page (URL contains `/answer-test/` or specific DOM elements), it automatically adapts:

1. Menu title changes to `⚡SKAPPA RESULT`
2. Review button changes to `🎯 HIGHLIGHT`
3. Pilot is disabled (not available on result pages)
4. Learn extracts answer key, not selected answers

### Result Page Learn Strategy

For **multiple choice**: Extracts the correct letter from "Đáp án đúng: X" and maps it to the corresponding answer text.

For **True/False**: Extracts Đúng/Sai for each sub-item (a, b, c, d) from `.lalala` elements under "Đáp án đúng".

For **Essay**: Uses a 3-tier extraction strategy:
1. Look for "Đáp án được chấp nhận" text with bracketed content `[answer text]`
2. Scan all `.keyText` nodes for bracketed content
3. Fallback to `.text-danger` spans

---

## Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `` ` `` (Backtick) | Toggle menu | Always active |
| **Alt + L** | Learn | Any page |
| **Alt + R** | Review / Highlight | Any page |
| **Alt + P** | Toggle Pilot | Exam pages only |
| **Alt + S** | Submit exam | Exam pages only |

---

## Data Management

### Storage Format

Data is stored in localStorage under the key `skappa_study_memory` as a JSON object:

```json
{
  "question_id_1": "normalized answer text",
  "question_id_2_a": "Đúng",
  "question_id_2_b": "Sai",
  ...
}
```

### Transfer Between Devices

1. Click **⬇ EXPORT** on the source device
2. Transfer the downloaded `.json` file (email, cloud storage, USB)
3. Click **⬆ IMPORT** on the target device
4. Select the file → answers are merged into local memory

---

## Example Workflows

### Workflow 1: Study Session

```
1. Take a practice exam on azota.vn
2. Submit it → you see the result page
3. Press ` (backtick) → Click 🧠 LEARN
4. Close the result page
5. Open a new practice version of the same exam
6. Press ` → Click 🎯 REVIEW
7. All known answers are auto-filled
8. Focus only on unfamiliar questions
```

### Workflow 2: Timed Practice with Target Score

```
1. Open an exam
2. Press ` → Click 🧠 LEARN (if you already filled some answers)
3. In the pilot input, enter: 30,80,1,equal
   (30min time, 80% score target, auto-submit, equal T/F scoring)
4. Click ▶ PILOT
5. The script fills everything correctly, then flips some to wrong
6. At exactly 80% score, it submits automatically
```

### Workflow 3: Quick Random Fill

```
1. Open an exam you want to practice quickly
2. Press ` → Enter "ABCD" in the pattern field
3. Click ▶ (Pattern Run) → fills A, B, C, D cyclically
4. Review and adjust answers manually
5. Click 🚀 SUBMIT to finish
```
