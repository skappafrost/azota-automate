# Technical Architecture

This document describes the internal architecture of Azota God Mode in detail.

## Module Overview

```
┌────────────────────────────────────────────────────────┐
│                    azota-god-mode.user.js              │
├────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │   CSS/UI    │  │   Answer    │  │  Auto Pilot    │  │
│  │   Module    │  │   Engine    │  │  Subsystem     │  │
│  ├─────────────┤  ├─────────────┤  ├────────────────┤  │
│  │ • Cyberpunk │  │ • Normalize │  │ • Timer-based  │  │
│  │   theme     │  │ • Fuzzy     │  │ • Score calc   │  │
│  │ • Floating  │  │   matching  │  │ • Optimal flip │  │
│  │   menu      │  │ • Question  │  │ • Pause/resume │  │
│  │ • Drag      │  │   detection │  │ • Auto-submit  │  │
│  └─────────────┘  └─────────────┘  └────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │  Memory DB  │  │  Quick Fill │  │  Result Page   │  │
│  │  Module     │  │  Module     │  │  Module        │  │
│  ├─────────────┤  ├─────────────┤  ├────────────────┤  │
│  │ • Local-    │  │ • ABCD      │  │ • skLearnFrom  │  │
│  │   Storage   │  │ • Random    │  │   Result       │  │
│  │ • Export    │  │ • Pattern   │  │ • skReviewOn   │  │
│  │ • Import    │  │ • TF Fill   │  │   Result       │  │
│  │ • Clear     │  │ • Essay     │  │ • Answer key   │  │
│  └─────────────┘  └─────────────┘  │   extraction   │  │
│                                    └────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Data Flow

### Question Detection Pipeline

```
DOM Load/Change
     │
     ▼
getQuestions()
  ├── Try .azt-question selector
  ├── Try .question-standalone-box selector
  ├── Try .question-standalone-content-box selector
  ├── Try .question-item selector
  ├── Try .quiz-answer-item selector
  └── Try div[data-order] selector
     │
     ▼ (deduplicated results)
  resolveQid() — walks up DOM to find numeric question ID
     │
     ▼
detectQuestionType()
  ├── Check for Đúng/Sai buttons → 'truefalse'
  ├── Check for <textarea> → 'essay'
  └── Default → 'multiple'
```

### Answer Normalization

```
rawText
  → replace multiple spaces with single space
  → strip non-alphanumeric characters (keeps Vietnamese, digits, basic punctuation)
  → lowercase
  → trim
  → normalizedText
```

### Fuzzy Matching Algorithm

```
match(a, b)
  1. normalize(a) === normalize(b)  → exact match → true
  2. a.includes(b) || b.includes(a) → substring  → true
  3. character overlap > 60%         → fuzzy      → true
  Otherwise → false
```

## Page Type Detection

```javascript
isResultPage()
  // Returns true if ANY of:
  //   - <app-answer-test> element exists
  //   - .question-standalone-answer-box-for-student element exists
  //   - URL includes '/answer-test/'
```

When on a result page:
- LEARN extracts correct answers from the answer key (not student selections)
- REVIEW highlights matched answers instead of filling
- PILOT is disabled

## Auto Pilot Scoring

### T/F Question Scoring

Each True/False question has 4 sub-items (a, b, c, d). The scoring formula defines how many points you get for getting N sub-items correct:

| Formula | 1 correct | 2 correct | 3 correct | 4 correct |
|---------|-----------|-----------|-----------|-----------|
| `equal` | 0.25 | 0.50 | 0.75 | 1.00 |
| `tapered` | 0.10 | 0.25 | 0.50 | 1.00 |
| Custom | Custom[0] | Custom[1] | Custom[2] | Custom[3] |

### Optimal Flip Algorithm

When a target percentage is specified, the script:

1. Fills all answers correctly
2. Calculates current score
3. If current score > target score:
   - Enumerates all T/F flip combinations (using recursion)
   - For each combination, calculates remaining MC flips needed
   - Picks combination with minimal score overshoot and maximum flip count (better looking randomness)
4. Executes flips in shuffled order

## CSS Animation System

The UI uses CSS `@keyframes` animations for visual feedback:

- **`skGlowPulse`**: Pulsing text-shadow on the title (emerald glow)
- **`skPilotPulse`**: Pulsing box-shadow on the active pilot button (red glow)

Color system:
- Primary: `#00ff88` (emerald green) — standard elements
- Warning: `#ffaa00` (amber) — memory operation buttons
- Danger: `#ff5555` (red) — destructive actions
- Info: `#44bbff` (blue) — data operations
- Accent: `#44ddff` (cyan) — fill tools
- Pilot active: `#ff5577` (pink-red) — active auto pilot

## LocalStorage Schema

```
Key: "skappa_study_memory"
Value: JSON string of object

Schema:
{
  "<question_key>": "<normalized_answer>",         // MC or Essay
  "<question_key>_a": "Đúng",                      // T/F sub-item A
  "<question_key>_b": "Sai",                       // T/F sub-item B
  ...
}

Question Key: Either numeric ID from DOM or
              normalized text content (first 120 chars)

Key: "skappa_pos"
Value: JSON string of {top, left}
  (persistent menu position)
```

## Browser API Dependencies

| API | Usage |
|-----|-------|
| `localStorage` | Persistent memory storage |
| `MutationObserver` (implicit) | Handled via setInterval polling |
| `Element.querySelector/All` | DOM traversal and question detection |
| `Blob + URL.createObjectURL` | Export file generation |
| `FileReader` | Import file parsing |
| `MouseEvent` | Synthetic click dispatching |
| `Event('input')` / `Event('change')` | React framework state updates |
| `Object.getOwnPropertyDescriptor` | Native textarea setter bypass |
| `CSSStyleSheet` (via style tag) | Dynamic UI theming |
