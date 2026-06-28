# Troubleshooting Guide

## Common Issues

### Menu not showing after installation

**Symptoms:**
- Installed the script but can't see the floating menu
- Pressing backtick (`) does nothing

**Solutions:**

1. **Check the URL**: Make sure you're on `*.azota.vn` (the script only runs on this domain)
2. **Refresh the page**: After installing, refresh the azota.vn tab
3. **Press the backtick key**: The menu starts hidden — press `` ` `` (the key above Tab)
4. **Check Tampermonkey**: Click the Tampermonkey icon → verify the script is enabled
5. **Check console for errors**: Press F12 → Console tab → look for red error messages

### "No answerable questions found" in Pilot

**Symptoms:**
- Pilot starts but immediately says "No answerable questions found"
- Nothing gets filled

**Solutions:**
1. **Learn answers first**: Pilot fills answers from memory — you need to have learned answers first
2. **Check question detection**: If azota.vn changed their layout, the selectors may not match
3. **Manual review**: Try clicking "🎯 REVIEW" first to see if any answers are detected

### Answers not being saved

**Symptoms:**
- Clicked LEARN but status says "Learned 0 answers"

**Solutions:**
1. **Select answers first**: You need to have answers selected on the page before clicking LEARN
2. **On result pages**: LEARN extracts from the answer key — make sure you're on a completed test result page
3. **Check localStorage**: Press F12 → Application → Local Storage → look for `skappa_study_memory`

### Submit button not found

**Symptoms:**
- Clicked 🚀 SUBMIT but status says "Submit button not found"

**Solutions:**
1. **Check button text**: Azota may have changed "Nộp bài" to something else
2. **Manual submission**: Click the submit button manually this time
3. **Report**: [Open an issue](https://github.com/skappafrost/azota-god-mode/issues) with a screenshot

### Export file won't import

**Symptoms:**
- Selected a `.json` file but nothing happens

**Solutions:**
1. **File integrity**: Make sure the file wasn't edited or corrupted after download
2. **JSON format**: The file should contain a valid JSON object `{...}`
3. **Try re-exporting**: Export a fresh backup and try importing it immediately

### Pilot stops unexpectedly

**Symptoms:**
- Pilot was running but stopped before completing
- Status shows "Time limit reached"

**Solutions:**
1. **Adjust time**: Increase the time parameter in the pilot input
2. **Remove time limit**: Leave the time field empty for unlimited time
3. **Check target**: If target % is too close to 100%, there may be nothing to flip

### Script not loading on certain pages

**Symptoms:**
- Script works on some azota.vn pages but not others

**Solutions:**
1. **Check subdomain**: The @match covers `*.azota.vn/*` — some subdomains may have different structures
2. **Network delay**: On slow connections, `DOMContentLoaded` may fire before the exam content loads
3. **Angular/Dynamic content**: The script uses `setInterval` for DOM polling — give it a moment

---

## Debugging Techniques

### 1. Check the Console

Press **F12** → **Console tab** and look for:
- `Azota Memory Database:` — shows current saved data
- `applySavedToQuestion error` — DOM-related warnings
- `robustClick error` — click simulation failures

### 2. Inspect localStorage

Press **F12** → **Application tab** → **Local Storage** → `https://azota.vn`

Look for key `skappa_study_memory` and `skappa_pos`.

### 3. Manual Data Inspection

Click **📋 LOG** in the menu → switch to Console → you'll see the full database printed.

### 4. Test with Different Browsers

If the script fails in one browser, try:
- Chrome (most compatible)
- Edge (Chromium-based)
- Firefox (Greasemonkey alternative)

---

## Reporting Issues

When [reporting a bug](https://github.com/skappafrost/azota-god-mode/issues/new?labels=bug&template=bug_report.md), please include:

1. **Browser**: Chrome 131, Firefox 134, etc.
2. **Tampermonkey version**: Check at 🎭 → Dashboard → version number
3. **Script version**: Checked at top of the menu (v15.3)
4. **azota.vn URL**: The exact URL where the issue occurs
5. **Console output**: Any error messages from F12 console
6. **Screenshot**: If the UI looks wrong
7. **Steps to reproduce**: What you did before the issue appeared
