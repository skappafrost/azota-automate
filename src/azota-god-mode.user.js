// ==UserScript==
// @name         Azota God Mode - All-in-One Edition
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @version      15.3
// @description  Hợp nhất: Cinematic UI + Auto Pilot (Loop Review & Auto Submit) + MathJax/No-Reload File Sync + Full Utilities + Result Page Learn + Đúng/Sai + Tự luận
// @author       Skappa & Nexus Agent
// @match        *://*.azota.vn/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const init = () => {
    const DB_KEY = "skappa_study_memory";
    let pilotInterval = null;
    // Persistent pilot state preserved across stop/start so we can resume
    // without recomputing per-question delay.
    let skPilotState = null;
    let savedPilotResume = null;

    // --- 1. CSS UI (Nâng cấp Cinematic Cyberpunk Dark Emerald) ---
    const style = document.createElement("style");
    style.innerHTML = `
        #skappa-menu {
            position: fixed; z-index: 10001;
            background: rgba(8, 12, 10, 0.94);
            border: 1.5px solid rgba(0, 255, 136, 0.35);
            padding: 14px; border-radius: 16px; color: #00ff88;
            font-family: 'Consolas', 'Fira Code', 'SF Mono', monospace;
            box-shadow: 0 0 40px rgba(0, 255, 136, 0.07),
                        0 0 80px rgba(0, 255, 136, 0.03),
                        inset 0 0 30px rgba(0, 255, 136, 0.02);
            width: 244px; text-align: center; cursor: default;
            backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
            transition: border-color 0.4s, box-shadow 0.4s;
            user-select: none;
        }
        #skappa-menu.pilot-active {
            border-color: rgba(255, 51, 102, 0.5);
            box-shadow: 0 0 40px rgba(255, 51, 102, 0.12),
                        0 0 80px rgba(255, 51, 102, 0.05),
                        inset 0 0 30px rgba(255, 51, 102, 0.02);
        }

        .sk-title {
            font-size: 13px; font-weight: 700;
            margin-bottom: 10px; padding-bottom: 8px;
            cursor: move; letter-spacing: 2.5px;
            border-bottom: 1px solid rgba(0, 255, 136, 0.1);
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
            animation: sk-title-pulse 3s ease-in-out infinite;
        }
        .sk-title .sk-ver {
            font-size: 9px; opacity: 0.35; letter-spacing: 1px;
            font-weight: 400; margin-left: 4px;
        }

        .sk-section {
            font-size: 8px; color: rgba(0, 255, 136, 0.4);
            text-transform: uppercase; letter-spacing: 1.5px;
            display: block; text-align: left; margin: 9px 0 4px;
            font-weight: 600;
        }

        .sk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 5px; }
        .sk-grid-4 { grid-template-columns: repeat(4, 1fr); }

        .sk-btn {
            width: 100%; padding: 7px 4px;
            background: rgba(0, 255, 136, 0.04);
            border: 1px solid rgba(0, 255, 136, 0.25);
            color: #00ff88; cursor: pointer;
            font-size: 9.5px; font-weight: 600;
            border-radius: 8px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            letter-spacing: 0.3px; position: relative; overflow: hidden;
        }
        .sk-btn:hover {
            background: rgba(0, 255, 136, 0.12);
            border-color: rgba(0, 255, 136, 0.6);
            box-shadow: 0 0 18px rgba(0, 255, 136, 0.12);
            transform: translateY(-1px);
        }
        .sk-btn:active { transform: scale(0.95); }

        .sk-btn-orange { border-color: rgba(255, 170, 0, 0.3); color: #ffaa00; background: rgba(255, 170, 0, 0.03); }
        .sk-btn-orange:hover { background: rgba(255, 170, 0, 0.15); border-color: rgba(255, 170, 0, 0.6); box-shadow: 0 0 18px rgba(255, 170, 0, 0.12); }

        .sk-btn-red { border-color: rgba(255, 68, 68, 0.3); color: #ff5555; background: rgba(255, 68, 68, 0.03); }
        .sk-btn-red:hover { background: rgba(255, 68, 68, 0.15); border-color: rgba(255, 68, 68, 0.6); color: #fff; box-shadow: 0 0 18px rgba(255, 68, 68, 0.15); }

        .sk-btn-blue { border-color: rgba(0, 170, 255, 0.3); color: #44bbff; background: rgba(0, 170, 255, 0.03); }
        .sk-btn-blue:hover { background: rgba(0, 170, 255, 0.15); border-color: rgba(0, 170, 255, 0.6); box-shadow: 0 0 18px rgba(0, 170, 255, 0.12); }

        .sk-btn-cyan { border-color: rgba(0, 204, 255, 0.3); color: #44ddff; background: rgba(0, 204, 255, 0.03); }
        .sk-btn-cyan:hover { background: rgba(0, 204, 255, 0.15); border-color: rgba(0, 204, 255, 0.6); box-shadow: 0 0 18px rgba(0, 204, 255, 0.12); }

        .sk-btn-pilot {
            padding: 9px 4px; background: rgba(0, 255, 136, 0.08);
            border: 1.5px solid rgba(0, 255, 136, 0.4);
            font-size: 10px; letter-spacing: 1px;
        }
        .sk-btn-pilot:hover { background: rgba(0, 255, 136, 0.2); }
        .sk-btn-pilot.active {
            background: rgba(255, 51, 102, 0.1);
            border-color: rgba(255, 51, 102, 0.5);
            color: #ff5577;
            animation: sk-pilot-pulse 1.5s ease-in-out infinite;
        }
        .sk-btn-pilot.active:hover { background: rgba(255, 51, 102, 0.2); border-color: rgba(255, 51, 102, 0.7); color: #fff; }

        .sk-input {
            box-sizing: border-box; width: 100%; padding: 6px 8px;
            background: rgba(0, 255, 136, 0.04);
            border: 1px solid rgba(0, 255, 136, 0.15);
            color: #fff; text-align: center; border-radius: 8px;
            font-size: 10px; outline: none;
            transition: border-color 0.25s, box-shadow 0.25s;
            font-family: inherit;
        }
        .sk-input:focus { border-color: rgba(0, 255, 136, 0.5); box-shadow: 0 0 12px rgba(0,255,136,0.08); }

        .sk-row { display: flex; gap: 5px; margin-bottom: 5px; }
        .sk-row .sk-input { flex: 1; }
        .sk-row .sk-btn { flex: 0 0 auto; width: auto; padding: 6px 12px; }

        .sk-info-icon {
            display: inline-flex; align-items: center; justify-content: center;
            width: 16px; height: 16px; min-width: 16px;
            background: rgba(0, 255, 136, 0.08);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 50%;
            color: rgba(0, 255, 136, 0.5);
            font-size: 8px; font-weight: 700; cursor: pointer;
            transition: all 0.25s; position: relative;
            line-height: 1; font-style: italic; font-family: serif;
        }
        .sk-info-icon:hover {
            background: rgba(0, 255, 136, 0.15);
            border-color: rgba(0, 255, 136, 0.5);
            color: #00ff88;
            box-shadow: 0 0 10px rgba(0,255,136,0.1);
        }
        .sk-info-icon .sk-tooltip {
            display: none; position: absolute;
            bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
            background: rgba(8, 12, 10, 0.96);
            border: 1px solid rgba(0, 255, 136, 0.25);
            border-radius: 8px; padding: 8px 10px;
            white-space: nowrap; font-size: 9px; font-family: 'Consolas', monospace;
            color: rgba(0, 255, 136, 0.8); z-index: 10002;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            pointer-events: none;
        }
        .sk-info-icon.active .sk-tooltip { display: block; }
        .sk-info-icon .sk-tooltip::after {
            content: ''; position: absolute;
            top: 100%; left: 50%; transform: translateX(-50%);
            border: 5px solid transparent; border-top-color: rgba(0, 255, 136, 0.25);
        }

        #sk-status {
            font-size: 8.5px; color: rgba(0, 255, 136, 0.5);
            margin-top: 9px; padding-top: 7px;
            border-top: 1px solid rgba(0, 255, 136, 0.07);
            letter-spacing: 0.5px; transition: color 0.3s;
        }
        #sk-status.sk-ok { color: rgba(0, 255, 136, 0.8); }
        #sk-status.sk-err { color: rgba(255, 68, 68, 0.8); }

        .hidden { display: none !important; }

        .item-answer, .answer-item, li,
        .question-standalone-box .answer {
            transition: background-color 0.35s ease, transform 0.2s ease, box-shadow 0.35s ease;
        }

        [style*="rgba(0,255,136"] {
            background: linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,255,136,0.25)) !important;
            border-radius: 10px !important;
            box-shadow: 0 0 20px rgba(0,255,136,0.12), 0 0 40px rgba(0,255,136,0.03), inset 0 0 12px rgba(0,255,136,0.04);
            border: 1px solid rgba(0,255,136,0.3) !important;
            transition: all 0.3s ease;
        }

        @keyframes sk-title-pulse {
            0%, 100% { text-shadow: 0 0 20px rgba(0, 255, 136, 0.2); }
            50% { text-shadow: 0 0 35px rgba(0, 255, 136, 0.5); }
        }
        @keyframes sk-pilot-pulse {
            0%, 100% { box-shadow: 0 0 5px rgba(255, 51, 102, 0.1); }
            50% { box-shadow: 0 0 20px rgba(255, 51, 102, 0.25); }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. LÕI XỬ LÝ CHUẨN HÓA ĐÁP ÁN VÀ TOÁN HỌC
    // ==========================================
    const getDB = () => JSON.parse(localStorage.getItem(DB_KEY) || "{}");
    const saveDB = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

    const normalize = (txt) =>
      (txt || "")
        .replace(/\s+/g, " ")
        .replace(/[^\wÀ-ỹ0-9.VΩ°\-\/ ,|]/g, "")
        .toLowerCase()
        .trim();

    function getContent(el) {
      if (!el) return "";
      const clone = el.cloneNode(true);
      const mathContainers = clone.querySelectorAll("mjx-container, .MathJax");
      if (mathContainers.length > 0) {
        mathContainers.forEach((container) => {
          const mathML = container.querySelector("math");
          if (mathML) {
            container.outerHTML = mathML.outerHTML;
          } else {
            container.outerHTML = container.innerHTML;
          }
        });
        return clone.innerHTML;
      }
      return el.innerText;
    }

    function detectQuestionType(q) {
      const tfBtns = q.querySelectorAll(".item-answer button span.text-xs");
      for (let btn of tfBtns) {
        const t = btn.textContent.trim();
        if (t === "Đúng" || t === "Sai") return "truefalse";
      }
      if (q.querySelector("textarea")) return "essay";
      return "multiple";
    }

    function getSubPart(itemAnswer) {
      const label = itemAnswer.querySelector(".answer-content .font-medium");
      if (label) {
        const m = label.textContent.trim().match(/^([a-dA-D])/);
        if (m) return m[1].toLowerCase();
      }
      return null;
    }

    function getQuestionKey(q, subPart) {
      const el =
        q.querySelector('[id^="question_all_"]') ||
        q.querySelector('[id^="question_render_element_"]') ||
        q.querySelector('[id^="question_render_container_"]');

      const id = el?.id?.match(/(\d+)$/)?.[1];
      if (id) return subPart ? `${id}_${subPart}` : id;

      if (
        q.id &&
        /^question_(all|render_element|render_container)_/.test(q.id)
      ) {
        const selfId = q.id.match(/(\d+)$/)?.[1];
        if (selfId) return subPart ? `${selfId}_${subPart}` : selfId;
      }

      const key = normalize(getContent(q)).slice(0, 120);
      return subPart ? `${key}_${subPart}` : key;
    }

    const resolveQid = (el) => {
      while (el) {
        const id = getQuestionKey(el);
        if (id && /^\d+$/.test(id)) return id;
        el = el.parentElement;
      }
      return null;
    };

    function getQuestions() {
      const selectors = [
        ".azt-question",
        ".question-standalone-box",
        ".question-standalone-content-box",
        ".question-item",
        ".quiz-answer-item",
        "div[data-order]",
      ];

      const seen = new Set();
      const seenIds = new Set();
      const result = [];
      selectors.forEach((s) => {
        document.querySelectorAll(s).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          const qid = resolveQid(el);
          if (qid && seenIds.has(qid)) return;
          if (qid) seenIds.add(qid);
          result.push(el);
        });
      });
      return result;
    }

    function isResultPage() {
      return (
        !!document.querySelector("app-answer-test") ||
        !!document.querySelector(
          ".question-standalone-answer-box-for-student",
        ) ||
        window.location.href.includes("/answer-test/")
      );
    }

    function match(a, b) {
      a = normalize(a);
      b = normalize(b);
      if (a === b) return true;
      if (a.includes(b) || b.includes(a)) return true;

      let hit = 0;
      for (let c of a) if (b.includes(c)) hit++;
      return hit > Math.min(a.length, b.length) * 0.6;
    }

    function findBest(options, saved) {
      let best = null;
      let bestScore = 0;

      options.forEach((opt) => {
        const targetEl = opt.querySelector(".answer-content") || opt;
        const txt = getContent(targetEl);
        let score = 0;

        if (normalize(txt) === saved) score = 100;
        else if (match(txt, saved)) score = 70;

        if (score > bestScore) {
          bestScore = score;
          best = opt;
        }
      });
      return best;
    }

    function resetAnswersUI() {
      const qs = getQuestions();
      qs.forEach((q) => {
        const options = [
          ...q.querySelectorAll(".item-answer, .answer-item, li"),
        ];
        options.forEach((opt) => {
          if (opt.style.backgroundColor.includes("rgba(0, 255, 136")) {
            opt.style.backgroundColor = "";
          }
        });
      });
    }

    // --- 3. Giao diện người dùng ---
    const savedPos = JSON.parse(localStorage.getItem("skappa_pos")) || {
      top: "20px",
      right: "20px",
    };
    const menu = document.createElement("div");
    menu.id = "skappa-menu";
    Object.assign(menu.style, {
      position: "fixed",
      zIndex: 10001,
      top: savedPos.top,
      right: savedPos.right,
      left: savedPos.left || "auto",
    });

    menu.innerHTML = `
        <div class="sk-title" id="sk-header">⚡SKAPPA <span class="sk-ver">v15.3</span></div>

        <span class="sk-section">Autopilot</span>
        <div class="sk-row">
            <button class="sk-btn sk-btn-pilot" id="pilotBtn">▶ PILOT</button>
            <input type="text" id="pilot-time" class="sk-input" value="" placeholder="0s or 3m43 or 2h">
            <span class="sk-info-icon">i<span class="sk-tooltip">Format: time,percent,submit,formula<br>Time: 30s / 3m43 / 2h<br>Percent: 0-100 (target %)<br>Submit: 1=auto, 0=manual<br>Formula: equal / tapered / 0.25;0.5;0.75;1<br>Ex: 3m43,50,1,equal</span></span>
        </div>

        <span class="sk-section">Memory</span>
        <div class="sk-grid">
            <button class="sk-btn sk-btn-orange" id="learnBtn">🧠 LEARN</button>
            <button class="sk-btn sk-btn-orange" id="reviewBtn">🎯 REVIEW</button>
        </div>
        <div class="sk-grid">
            <button class="sk-btn sk-btn-blue" id="exportBtn">⬇ EXPORT</button>
            <button class="sk-btn sk-btn-blue" id="importBtn">⬆ IMPORT</button>
        </div>
        <div class="sk-grid">
            <button class="sk-btn" id="dumpBtn">📋 LOG</button>
            <button class="sk-btn sk-btn-red" id="clearBtn">🗑 CLEAR</button>
        </div>

        <span class="sk-section">Quick Fill</span>
        <div class="sk-grid sk-grid-4">
            <button class="sk-btn" onclick="window.skRun(0)">A</button>
            <button class="sk-btn" onclick="window.skRun(1)">B</button>
            <button class="sk-btn" onclick="window.skRun(2)">C</button>
            <button class="sk-btn" onclick="window.skRun(3)">D</button>
        </div>
        <div class="sk-grid">
            <button class="sk-btn sk-btn-cyan" onclick="window.skRun('random')">🎲 RANDOM</button>
            <button class="sk-btn sk-btn-red" onclick="window.skSubmit()">🚀 SUBMIT</button>
        </div>

        <span class="sk-section">Dung/Sai</span>
        <div class="sk-grid">
            <button class="sk-btn sk-btn-cyan" onclick="window.skFillTF('dung')">✓ DUNG</button>
            <button class="sk-btn sk-btn-red" onclick="window.skFillTF('sai')">✗ SAI</button>
            <button class="sk-btn sk-btn-blue" onclick="window.skFillTFPtn()">TF PTN</button>
            <button class="sk-btn sk-btn-orange" onclick="window.skEssayDraft()">ESSAY</button>
        </div>

        <span class="sk-section">Pattern</span>
        <div class="sk-row">
            <input type="text" id="sk-pattern" class="sk-input" value="ABCD">
            <button class="sk-btn" onclick="window.skRun('ptn')">▶ RUN</button>
        </div>

        <div id="sk-status">■ Hidden · \` show</div>
    `;
    document.body.appendChild(menu);
    menu.classList.add("hidden");

    // --- 4. Logic Kéo thả (Draggable) ---
    let isDragging = false,
      offset = [0, 0];
    const header = document.getElementById("sk-header");
    header.onmousedown = (e) => {
      isDragging = true;
      offset = [menu.offsetLeft - e.clientX, menu.offsetTop - e.clientY];
    };
    document.onmousemove = (e) => {
      if (!isDragging) return;
      menu.style.left = e.clientX + offset[0] + "px";
      menu.style.top = e.clientY + offset[1] + "px";
      menu.style.right = "auto";
    };
    document.onmouseup = () => {
      if (isDragging) {
        isDragging = false;
        localStorage.setItem(
          "skappa_pos",
          JSON.stringify({ top: menu.style.top, left: menu.style.left }),
        );
      }
    };

    // ==========================================
    // 5. CÁC TÍNH NĂNG CỐT LÕI
    // ==========================================
    window.skLearn = function () {
      if (isResultPage()) {
        window.skLearnFromResult();
        return;
      }

      const db = getDB();
      const qs = getQuestions();
      let count = 0;

      qs.forEach((q) => {
        const type = detectQuestionType(q);

        if (type === "truefalse") {
          const subItems = q.querySelectorAll(".item-answer");
          subItems.forEach((item) => {
            const subPart = getSubPart(item);
            if (!subPart) return;
            const selectedBtn = item.querySelector(".selected-answer");
            if (!selectedBtn) return;
            const value = selectedBtn
              .querySelector(".text-xs")
              ?.textContent?.trim();
            if (!value) return;

            const key = getQuestionKey(q, subPart);
            db[key] = value;
            count++;
          });
          return;
        }

        if (type === "essay") {
          const textarea = q.querySelector("textarea");
          if (textarea && textarea.value.trim()) {
            const key = getQuestionKey(q);
            db[key] = textarea.value.trim();
            count++;
          }
          return;
        }

        const key = getQuestionKey(q);
        const selected =
          q
            .querySelector(".border-selected-answer")
            ?.closest(".item-answer, .answer-item") ||
          q.querySelector(".selected");

        const ans = selected?.querySelector(".answer-content");
        if (!ans) return;

        db[key] = normalize(getContent(ans));
        count++;
      });

      saveDB(db);
      updateStatus(`Learned ${count} answers!`);
    };

    // Helper: extract answer content from an .answer div (result page)
    function extractAnswerContent(aDiv) {
      const hook = aDiv.querySelector("azt-dynamic-hook");
      if (hook) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML =
          "<azt-dynamic-hook>" + hook.innerHTML + "</azt-dynamic-hook>";
        return getContent(wrapper);
      }
      const clone = aDiv.cloneNode(true);
      const lbl = clone.querySelector(".answer-label");
      if (lbl) lbl.remove();
      return getContent(clone);
    }

    window.skLearnFromResult = function () {
      const db = getDB();
      const rawBoxes = [
        ...document.querySelectorAll(
          ".question-standalone-box, .question-standalone-content-box",
        ),
      ];
      const seenIds = new Set();
      const questionBoxes = rawBoxes.filter((box) => {
        const qid = resolveQid(box);
        if (qid && seenIds.has(qid)) return false;
        if (qid) seenIds.add(qid);
        return true;
      });
      let count = 0;

      questionBoxes.forEach((qBox) => {
        const key = getQuestionKey(qBox);
        if (!key) return;

        const allKeyTexts = [...qBox.querySelectorAll(".keyText")];

        // --- Đúng/Sai detection ---
        for (let kt of allKeyTexts) {
          if (kt.textContent.includes("Đáp án đúng")) {
            const lalas = kt.querySelectorAll(".lalala");
            if (lalas.length > 0) {
              lalas.forEach((lala) => {
                const m = lala.textContent
                  .trim()
                  .match(/^([a-dA-D])\s*\)\s*(.+)$/);
                if (m) {
                  const letter = m[1].toLowerCase();
                  const answer = m[2].trim();
                  if (answer === "Đúng" || answer === "Sai") {
                    db[`${key}_${letter}`] = answer;
                    count++;
                  }
                }
              });
              return;
            }
          }
        }

        // --- Tự luận detection ---
        let essayAnswer = null;

        // Helper: extract bracketed content from a node's textContent or from
        // its child spans (commonly span.text-danger). Returns cleaned string
        // or null.
        function extractFromNode(node) {
          if (!node) return null;
          const txt = (node.textContent || "").trim();
          // Prefer explicit bracketed form: [ ... ]
          const bracket = txt.match(/\[\s*([^\]]+)\s*\]/);
          if (bracket && bracket[1]) {
            return bracket[1].trim();
          }

          // Otherwise, try to join child spans that often contain each char
          const spans =
            node.querySelectorAll && node.querySelectorAll("span.text-danger");
          if (spans && spans.length > 0) {
            let built = Array.from(spans)
              .map((s) => s.textContent || "")
              .join("");
            built = built.replace(/\[|\]/g, "").trim();
            // keep if contains a digit and not just the word 'nhập'
            if (
              built &&
              /\d/.test(built) &&
              !built.toLowerCase().includes("nhập")
            )
              return built;
          }

          return null;
        }

        // 1) If there's an explicit "Đáp án được chấp nhận" marker, look
        // for bracketed content near it (same or following .keyText nodes).
        for (let i = 0; i < allKeyTexts.length && !essayAnswer; i++) {
          const kt = allKeyTexts[i];
          const text = kt.textContent || "";
          if (text.includes("Đáp án được chấp nhận")) {
            // try the same node
            essayAnswer = extractFromNode(kt);
            if (essayAnswer) break;

            // try subsequent .keyText nodes which commonly hold the bracket
            for (let j = i + 1; j < allKeyTexts.length; j++) {
              essayAnswer = extractFromNode(allKeyTexts[j]);
              if (essayAnswer) break;
            }
            break;
          }
        }

        // 2) Fallback: scan all .keyText nodes for bracketed content or
        // text-danger spans (preferred over student's answer area).
        if (!essayAnswer) {
          for (let kt of allKeyTexts) {
            essayAnswer = extractFromNode(kt);
            if (essayAnswer) break;
          }
        }

        // 3) Final fallback: sometimes accepted answer is rendered outside
        // .keyText (rare) — try to look for any .answer-box .keyText-like
        // patterns or explicit .text-danger sequences under the qBox.
        if (!essayAnswer) {
          const anyDanger = qBox.querySelectorAll("span.text-danger");
          if (anyDanger && anyDanger.length > 0) {
            // try to build a candidate from contiguous text-danger spans
            let built = Array.from(anyDanger)
              .map((s) => s.textContent || "")
              .join("");
            built = built.replace(/\[|\]/g, "").trim();
            if (
              built &&
              /\d/.test(built) &&
              !built.toLowerCase().includes("nhập")
            ) {
              essayAnswer = built;
            }
          }
        }

        if (essayAnswer !== null) {
          db[key] = essayAnswer;
          count++;
          return;
        }

        // --- Multiple choice (existing logic) ---
        if (!key || /^\d+$/.test(key) === false) return;

        const correctAnswerSpan = qBox.querySelector(".keyText");
        if (!correctAnswerSpan) return;

        const matchResult = correctAnswerSpan.textContent.match(
          /Đáp án đúng:\s*([A-D])/,
        );
        if (!matchResult) return;
        const correctLetter = matchResult[1];

        const answerDivs = qBox.querySelectorAll(".answer");
        let correctAnswerContent = null;

        answerDivs.forEach((aDiv) => {
          const label = aDiv.querySelector(".answer-label");
          if (!label) return;
          const labelText = label.textContent.trim();
          if (
            !labelText.startsWith(correctLetter + ".") &&
            labelText.replace(".", "").trim() !== correctLetter
          )
            return;

          correctAnswerContent = extractAnswerContent(aDiv);
        });

        if (!correctAnswerContent) return;

        db[key] = normalize(correctAnswerContent);
        count++;
      });

      saveDB(db);
      updateStatus(`Learned ${count} answers from result page!`);
    };

    window.skReview = function () {
      if (isResultPage()) {
        return window.skReviewOnResult();
      }

      const db = getDB();
      const qs = getQuestions();
      let matched = 0;

      qs.forEach((q) => {
        const type = detectQuestionType(q);

        if (type === "truefalse") {
          const subItems = q.querySelectorAll(".item-answer");
          subItems.forEach((item) => {
            const subPart = getSubPart(item);
            if (!subPart) return;
            const baseKey = getQuestionKey(q);
            const itemKey = `${baseKey}_${subPart}`;
            const saved = db[itemKey];
            if (!saved) return;

            const btns = item.querySelectorAll("button");
            for (let btn of btns) {
              const txt = btn.querySelector(".text-xs")?.textContent?.trim();
              if (txt === saved) {
                if (!btn.classList.contains("selected-answer")) {
                  robustClick(btn);
                }
                matched++;
                break;
              }
            }
          });
          return;
        }

        if (type === "essay") {
          const key = getQuestionKey(q);
          const saved = db[key];
          if (!saved) return;

          const textarea = q.querySelector("textarea");
          if (textarea) {
            if (textarea.value !== saved) {
              textarea.value = saved;
              textarea.dispatchEvent(new Event("input", { bubbles: true }));
              textarea.dispatchEvent(new Event("change", { bubbles: true }));
            }
            matched++;
          }
          return;
        }

        const key = getQuestionKey(q);
        const saved = db[key];
        if (!saved) return;

        const options = [
          ...q.querySelectorAll(".item-answer, .answer-item, li"),
        ];
        const best = findBest(options, saved);

        if (best) {
          if (!best.style.backgroundColor.includes("rgba(0, 255, 136")) {
            robustClick(best);
            best.style.backgroundColor = "rgba(0,255,136,0.25)";
          }
          matched++;
        }
      });

      updateStatus(`Auto-filled ${matched} matches!`);
      return matched;
    };

    window.skReviewOnResult = function () {
      const db = getDB();
      const questionBoxes = [
        ...document.querySelectorAll(
          ".question-standalone-box, .question-standalone-content-box",
        ),
      ];
      let matched = 0;

      questionBoxes.forEach((qBox) => {
        const key = getQuestionKey(qBox);
        if (!key) return;

        // Check if this is a TF question by looking for saved sub-keys
        const tfKeys = Object.keys(db).filter(
          (k) => k.startsWith(key + "_") && /^[a-d]$/.test(k.split("_").pop()),
        );
        if (tfKeys.length > 0) {
          const allKeyTexts = qBox.querySelectorAll(".keyText");
          for (let kt of allKeyTexts) {
            if (kt.textContent.includes("Thí sinh chọn")) {
              const lalas = kt.querySelectorAll(".lalala");
              lalas.forEach((lala) => {
                const m = lala.textContent
                  .trim()
                  .match(/^([a-dA-D])\s*\)\s*(.+)$/);
                if (m) {
                  const letter = m[1].toLowerCase();
                  const chosen = m[2].trim();
                  const subKey = `${key}_${letter}`;
                  const saved = db[subKey];
                  if (saved && chosen === saved) {
                    lala.style.fontWeight = "bold";
                    lala.style.textDecoration = "underline";
                    matched++;
                  }
                }
              });
              return;
            }
          }
          return;
        }

        const saved = db[key];
        if (!saved) return;

        const answerDivs = [...qBox.querySelectorAll(".answer")];
        if (answerDivs.length === 0) return;

        let best = null;
        let bestScore = 0;

        answerDivs.forEach((aDiv) => {
          const txt = extractAnswerContent(aDiv);
          let score = 0;
          if (normalize(txt) === saved) score = 100;
          else if (match(txt, saved)) score = 70;
          if (score > bestScore) {
            bestScore = score;
            best = aDiv;
          }
        });

        if (best) {
          if (!best.style.backgroundColor.includes("rgba(0, 255, 136")) {
            best.style.backgroundColor = "rgba(0,255,136,0.25)";
            best.style.borderRadius = "6px";
          }
          matched++;
        }
      });

      updateStatus(`Highlighted ${matched} correct answers!`);
      return matched;
    };

    // --- Hệ thống Auto Pilot ---
    window.togglePilot = function () {
      if (isResultPage()) {
        updateStatus("Pilot not available on result page!");
        return;
      }

      const btn = document.getElementById("pilotBtn");
      const container = document.getElementById("skappa-menu");

      // If pilot is running, stop it. Save resume state if percent-target.
      if (pilotInterval) {
        if (skPilotState && skPilotState.percentProvided) {
          const elapsed = Date.now() - (skPilotState.startTime || Date.now());
          const remaining = Math.max(0, skPilotState.totalMs - elapsed);
          savedPilotResume = {
            remainingMs: remaining,
            percentProvided: true,
            percent: skPilotState.percent,
            autoSubmit: skPilotState.autoSubmit,
            tfFormula: skPilotState.tfFormula,
          };
        }
        clearInterval(pilotInterval);
        pilotInterval = null;
        skPilotState = null;
        btn.innerText = "▶ PILOT";
        btn.classList.remove("active");
        container.classList.remove("pilot-active");
        updateStatus(
          savedPilotResume
            ? "Pilot Paused. Resume available."
            : "Pilot Stopped.",
        );
        return;
      }

      // Start pilot
      btn.innerText = "■ PILOT";
      btn.classList.add("active");
      container.classList.add("pilot-active");
      updateStatus("Pilot searching questions...");

      // Read composite input and parse (or use saved resume state)
      let totalMs, percentProvided, percentValue, autoSubmit, tfFormula;
      if (savedPilotResume) {
        totalMs = savedPilotResume.remainingMs;
        percentProvided = savedPilotResume.percentProvided;
        percentValue = savedPilotResume.percent;
        autoSubmit = savedPilotResume.autoSubmit;
        tfFormula = savedPilotResume.tfFormula;
      } else {
        const raw = (document.getElementById("pilot-time")?.value || "").trim();
        const parsed = parsePilotInput(raw);
        totalMs = parsed.totalMs;
        percentProvided = parsed.percentProvided;
        percentValue = parsed.percent;
        autoSubmit = parsed.autoSubmit;
        tfFormula = parsed.tfFormula;
      }

      const MIN_INTERVAL = 20;
      const db = getDB();

      // Build sub-item level pool
      // Each item = { key, questionKey, subPart, pointValue, type }
      const qs = getQuestions();
      const itemsPool = [];
      const seenKeys = new Set();
      qs.forEach((q) => {
        const qKey = getQuestionKey(q);
        if (!qKey) return;
        if (seenKeys.has(qKey)) return;
        seenKeys.add(qKey);
        const type = detectQuestionType(q);

        if (type === "truefalse") {
          const subItems = q.querySelectorAll(".item-answer");
          subItems.forEach((item) => {
            const subPart = getSubPart(item);
            if (!subPart) return;
            const itemKey = `${qKey}_${subPart}`;
            if (!db[itemKey]) return;
            itemsPool.push({
              key: itemKey,
              questionKey: qKey,
              subPart,
              pointValue: 1,
              type: "truefalse",
            });
          });
        } else {
          if (type === "essay") {
            if (!db[qKey]) return;
          }
          itemsPool.push({
            key: qKey,
            questionKey: qKey,
            subPart: null,
            pointValue: 1,
            type,
          });
        }
      });

      if (itemsPool.length === 0 && totalMs > 0) {
        updateStatus("No answerable questions found.");
        btn.innerText = "▶ PILOT";
        btn.classList.remove("active");
        container.classList.remove("pilot-active");
        return;
      }

      const totalPoints = itemsPool.reduce((s, it) => s + it.pointValue, 0);
      const perItem =
        totalMs > 0
          ? Math.max(Math.floor(totalMs / itemsPool.length), MIN_INTERVAL)
          : MIN_INTERVAL;

      // Both paths use iterative flipping with calculateScore

      skPilotState = {
        totalMs,
        itemsPool,
        totalPoints,
        perItem,
        percentProvided: !!percentProvided,
        percent: percentValue,
        autoSubmit: !!autoSubmit,
        tfFormula: tfFormula || [0.25, 0.5, 0.75, 1],
        startTime: Date.now(),
      };

      savedPilotResume = null;
      updateStatus(
        `Pilot: ${itemsPool.length} items, ${perItem}ms/item${percentProvided ? `, target ${percentValue}%` : ""}${autoSubmit ? ", auto-submit" : ""}`,
      );

      // Process a single item (returns true if state changed)
      function processItem(item) {
        const q = findQuestionElementByKey(item.questionKey);
        if (!q) return false;
        const shouldBeCorrect = skPilotState.fillCorrect
          ? skPilotState.fillCorrect.has(item.key)
          : true;

        if (item.type === "truefalse") {
          const subItems = q.querySelectorAll(".item-answer");
          let targetItem = null;
          subItems.forEach((si) => {
            if (getSubPart(si) === item.subPart) targetItem = si;
          });
          if (!targetItem) return false;
          const saved = db[item.key];
          const selectedBtn =
            targetItem.querySelector(".selected-answer") ||
            targetItem.querySelector(".border-selected-answer") ||
            targetItem.querySelector(".selected") ||
            targetItem.querySelector('button[aria-pressed="true"]');
          const currentTxt = selectedBtn
            ? (
                selectedBtn.querySelector(".text-xs")?.textContent ||
                selectedBtn.textContent ||
                ""
              ).trim()
            : "";
          const isCurrentlyCorrect = currentTxt === saved;

          if (shouldBeCorrect && !isCurrentlyCorrect) {
            for (let b of targetItem.querySelectorAll("button")) {
              const txt = b.querySelector(".text-xs")?.textContent?.trim();
              if (txt === saved) {
                robustClick(b);
                return true;
              }
            }
          } else if (!shouldBeCorrect && (!selectedBtn || isCurrentlyCorrect)) {
            for (let b of targetItem.querySelectorAll("button")) {
              const txt = b.querySelector(".text-xs")?.textContent?.trim();
              if (txt && txt !== saved) {
                robustClick(b);
                return true;
              }
            }
          }
          return false;
        }

        if (item.type === "essay") {
          const textarea = q.querySelector("textarea");
          if (!textarea) return false;
          const saved = db[item.key];
          if (!saved) return false;
          const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value",
          ).set;

          if (shouldBeCorrect) {
            if (textarea.value !== saved) {
              nativeSetter.call(textarea, saved);
              textarea.dispatchEvent(new Event("input", { bubbles: true }));
              textarea.dispatchEvent(new Event("change", { bubbles: true }));
              return true;
            }
          } else {
            const trimmed = saved.trim();
            const num = parseFloat(trimmed);
            const isNumber =
              !isNaN(num) && isFinite(num) && !/[a-df-zA-DF-Z]/.test(trimmed);
            let wrongAnswer = "";
            if (isNumber) {
              const smallOffset = 0.1 + Math.random() * 2.3;
              if (Math.random() > 0.5) {
                wrongAnswer = num * -1;
                if (wrongAnswer === num)
                  wrongAnswer =
                    num + (Math.random() > 0.5 ? smallOffset : -smallOffset);
              } else {
                wrongAnswer =
                  num + (Math.random() > 0.5 ? smallOffset : -smallOffset);
              }
              wrongAnswer = String(Math.round(wrongAnswer * 100) / 100);
            }
            if (textarea.value !== wrongAnswer) {
              nativeSetter.call(textarea, wrongAnswer);
              textarea.dispatchEvent(new Event("input", { bubbles: true }));
              textarea.dispatchEvent(new Event("change", { bubbles: true }));
              return true;
            }
          }
          return false;
        }

        // Multiple choice
        if (shouldBeCorrect) {
          if (!isQuestionDoneCorrectly(q)) {
            applySavedToQuestion(q);
            return true;
          }
        } else {
          const saved = db[item.key];
          if (!saved) return false;
          const selected =
            q
              .querySelector(".border-selected-answer")
              ?.closest(".item-answer, .answer-item") ||
            q.querySelector(".selected") ||
            q.querySelector(".answer-item.selected") ||
            q.querySelector(".item-answer.selected");
          if (selected) {
            const targetEl =
              selected.querySelector(".answer-content") || selected;
            const curTxt = getContent(targetEl) || "";
            if (
              curTxt &&
              !match(curTxt, saved) &&
              normalize(curTxt) !== normalize(saved)
            )
              return false;
          }
          const options = Array.from(
            q.querySelectorAll(".item-answer, .answer-item, li"),
          );
          const pool = options.filter((opt) => {
            const tEl = opt.querySelector(".answer-content") || opt;
            return normalize(getContent(tEl)) !== saved;
          });
          if (pool.length > 0) {
            robustClick(pool[Math.floor(Math.random() * pool.length)]);
            return true;
          }
        }
        return false;
      }

      // Calculate current score based on T/F formula (reserved for future use)
      void (
        function calculateScore(/* tfFormula */) {
          const curDb = getDB();
          const qs = getQuestions();
          let score = 0;
          let total = 0;
          const seenKeys = new Set();

          qs.forEach((q) => {
            const qKey = getQuestionKey(q);
            if (!qKey || seenKeys.has(qKey)) return;
            seenKeys.add(qKey);
            const type = detectQuestionType(q);

            if (type === "truefalse") {
              const subItems = q.querySelectorAll(".item-answer");
              let correctCount = 0;
              subItems.forEach((item) => {
                const subPart = getSubPart(item);
                if (!subPart) return;
                const itemKey = `${qKey}_${subPart}`;
                const saved = curDb[itemKey];
                if (!saved) return;
                const selectedBtn =
                  item.querySelector(".selected-answer") ||
                  item.querySelector(".border-selected-answer") ||
                  item.querySelector(".selected") ||
                  item.querySelector('button[aria-pressed="true"]');
                if (selectedBtn) {
                  const txt = (
                    selectedBtn.querySelector(".text-xs")?.textContent ||
                    selectedBtn.textContent ||
                    ""
                  ).trim();
                  if (txt === saved) correctCount++;
                }
              });
              // Look up formula for this many correct sub-items
              // tfFormula[0]=score for 1 correct, [1]=for 2 correct, etc.
              const formulaScore =
                correctCount > 0 && correctCount <= tfFormula.length
                  ? tfFormula[correctCount - 1]
                  : 0;
              score += formulaScore;
              // Max possible = last element of formula
              total += tfFormula[tfFormula.length - 1];
            } else {
              // MC/essay: 1 point each
              const saved = curDb[qKey];
              if (!saved) return;
              total += 1;
              const selected =
                q
                  .querySelector(".border-selected-answer")
                  ?.closest(".item-answer, .answer-item") ||
                q.querySelector(".selected") ||
                q.querySelector(".answer-item.selected") ||
                q.querySelector(".item-answer.selected");
              if (selected) {
                const targetEl =
                  selected.querySelector(".answer-content") || selected;
                const curTxt = getContent(targetEl) || "";
                if (
                  match(curTxt, saved) ||
                  normalize(curTxt) === normalize(saved)
                )
                  score += 1;
              }
            }
          });
          return { score, total };
        }
      );

      // Find optimal set of flips to reach target score exactly
      // Uses enumeration of all T/F state combinations + MC count
      // tfQuestions = [{ qKey, subItemCount }] - actual sub-item count per question
      // Returns { mcFlips: number, tfStates: { qKey: flipCount } }
      function findOptimalFlips(
        tfQuestions,
        mcCount,
        totalScore,
        targetScore,
        formula,
      ) {
        const maxReduction = totalScore - targetScore;
        if (maxReduction <= 0) return { mcFlips: 0, tfStates: {} };

        // Pre-compute T/F state reductions for each question
        // State k = flip k sub-items (0 to subItemCount)
        // Reduction = formula[subItemCount-1] - formula[subItemCount-1-k] (for k > 0)
        const tfStates = tfQuestions.map(({ qKey, subItemCount }) => {
          const maxIdx = Math.min(subItemCount, formula.length) - 1; // formula index for all correct
          const oldPts = formula[maxIdx]; // all correct initially
          const states = [];
          for (let k = 0; k <= subItemCount; k++) {
            const newIdx = maxIdx - k;
            const newPts = newIdx >= 0 ? formula[newIdx] : 0;
            states.push({ flipCount: k, reduction: oldPts - newPts });
          }
          return states;
        });

        // Enumerate all T/F state combinations
        const n = tfQuestions.length;
        let bestCombo = null;
        let bestScore = -Infinity;
        let bestTotalFlips = -1;

        // Recursive enumeration
        function enumerate(idx, tfReduction, tfStateMap) {
          if (idx === n) {
            // Calculate MC needed - check BOTH floor and ceil for optimal result
            const remaining = maxReduction - tfReduction;
            const candidates = [Math.floor(remaining), Math.ceil(remaining)];

            for (const mcCandidate of candidates) {
              const mcNeeded = Math.max(0, Math.min(mcCandidate, mcCount));
              const finalScore = totalScore - tfReduction - mcNeeded;

              if (finalScore >= targetScore) {
                const totalFlips =
                  mcNeeded +
                  Object.values(tfStateMap).reduce((s, v) => s + v, 0);
                const dist = finalScore - targetScore;
                const bestDist = bestScore - targetScore;

                if (
                  bestCombo === null ||
                  dist < bestDist ||
                  (dist === bestDist && totalFlips > bestTotalFlips)
                ) {
                  bestCombo = {
                    mcFlips: mcNeeded,
                    tfStates: { ...tfStateMap },
                  };
                  bestScore = finalScore;
                  bestTotalFlips = totalFlips;
                }
              }
            }
            return;
          }

          const qKey = tfQuestions[idx].qKey;
          for (let k = 0; k <= tfQuestions[idx].subItemCount; k++) {
            const newReduction = tfReduction + tfStates[idx][k].reduction;
            if (newReduction > maxReduction + 0.001) continue; // prune
            tfStateMap[qKey] = k;
            enumerate(idx + 1, newReduction, tfStateMap);
          }
        }

        enumerate(0, 0, {});
        return bestCombo || { mcFlips: 0, tfStates: {} };
      }

      function pilotDone() {
        clearInterval(pilotInterval);
        pilotInterval = null;
        btn.innerText = "▶ PILOT";
        btn.classList.remove("active");
        container.classList.remove("pilot-active");
        if (skPilotState.autoSubmit) {
          updateStatus("Pilot finished. Submitting...");
          skPilotState = null;
          window.skSubmit();
        } else {
          updateStatus("Pilot finished.");
          skPilotState = null;
        }
      }

      // Fast path: no time → use skReview to fill all correct, then flip wrong ones
      if (totalMs <= 0) {
        pilotInterval = setInterval(() => {
          const fillCount = window.skReview();
          if (fillCount > 0) {
            clearInterval(pilotInterval);
            pilotInterval = null;

            const formula = tfFormula || [0.25, 0.5, 0.75, 1];

            if (percentProvided) {
              const freshDb = getDB();
              const freshQs = getQuestions();
              const freshPool = [];
              const freshSeen = new Set();
              // Track T/F correct counts per question for internal score calculation
              const tfCorrectCounts = {}; // qKey -> number of correct sub-items
              const tfSubItemTotals = {}; // qKey -> total sub-items
              let mcCorrectCount = 0;
              let mcTotalCount = 0;

              freshQs.forEach((q) => {
                const qKey = getQuestionKey(q);
                if (!qKey || freshSeen.has(qKey)) return;
                freshSeen.add(qKey);
                const type = detectQuestionType(q);
                if (type === "truefalse") {
                  let correctCount = 0;
                  let totalCount = 0;
                  q.querySelectorAll(".item-answer").forEach((item) => {
                    const subPart = getSubPart(item);
                    if (!subPart) return;
                    const itemKey = `${qKey}_${subPart}`;
                    if (!freshDb[itemKey]) return;
                    totalCount++;
                    // Check if currently correct
                    const selectedBtn =
                      item.querySelector(".selected-answer") ||
                      item.querySelector(".border-selected-answer") ||
                      item.querySelector(".selected") ||
                      item.querySelector('button[aria-pressed="true"]');
                    if (selectedBtn) {
                      const txt = (
                        selectedBtn.querySelector(".text-xs")?.textContent ||
                        selectedBtn.textContent ||
                        ""
                      ).trim();
                      if (txt === freshDb[itemKey]) correctCount++;
                    }
                    freshPool.push({
                      key: itemKey,
                      questionKey: qKey,
                      subPart,
                      type: "truefalse",
                    });
                  });
                  tfCorrectCounts[qKey] = correctCount;
                  tfSubItemTotals[qKey] = totalCount;
                } else {
                  if (type === "essay" && !freshDb[qKey]) return;
                  mcTotalCount++;
                  // Check if currently correct
                  const selected =
                    q
                      .querySelector(".border-selected-answer")
                      ?.closest(".item-answer, .answer-item") ||
                    q.querySelector(".selected") ||
                    q.querySelector(".answer-item.selected") ||
                    q.querySelector(".item-answer.selected");
                  if (selected) {
                    const targetEl =
                      selected.querySelector(".answer-content") || selected;
                    const curTxt = getContent(targetEl) || "";
                    if (
                      match(curTxt, freshDb[qKey]) ||
                      normalize(curTxt) === normalize(freshDb[qKey])
                    )
                      mcCorrectCount++;
                  }
                  freshPool.push({
                    key: qKey,
                    questionKey: qKey,
                    subPart: null,
                    type,
                  });
                }
              });

              // Calculate initial score internally
              let currentScore = mcCorrectCount;
              for (const qKey in tfCorrectCounts) {
                const count = tfCorrectCounts[qKey];
                if (count > 0 && count <= formula.length) {
                  currentScore += formula[count - 1];
                }
              }
              let totalPts = mcTotalCount;
              for (const _idx in tfSubItemTotals) {
                totalPts += formula[formula.length - 1];
              }
              const targetScore = (percentValue / 100) * totalPts;

              if (currentScore > targetScore) {
                // Use exact enumeration to find optimal flips
                const tfQuestionInfo = Object.keys(tfCorrectCounts).map(
                  (qKey) => ({
                    qKey,
                    subItemCount: tfSubItemTotals[qKey] || 4,
                  }),
                );
                const mcPoolCount = freshPool.filter(
                  (it) => it.type !== "truefalse",
                ).length;
                const optResult = findOptimalFlips(
                  tfQuestionInfo,
                  mcPoolCount,
                  currentScore,
                  targetScore,
                  formula,
                );

                // Build execution list: MC items + T/F sub-items
                const execList = [];

                // Add MC items to flip
                const mcItems = freshPool.filter(
                  (it) => it.type !== "truefalse",
                );
                const mcShuffled = shuffleArray(mcItems.slice());
                for (
                  let i = 0;
                  i < optResult.mcFlips && i < mcShuffled.length;
                  i++
                ) {
                  execList.push(mcShuffled[i]);
                }

                // Add T/F sub-items to flip
                for (const qKey in optResult.tfStates) {
                  const flipCount = optResult.tfStates[qKey];
                  if (flipCount <= 0) continue;
                  const tfSubItems = freshPool.filter(
                    (it) => it.type === "truefalse" && it.questionKey === qKey,
                  );
                  const tfShuffled = shuffleArray(tfSubItems.slice());
                  for (let i = 0; i < flipCount && i < tfShuffled.length; i++) {
                    execList.push(tfShuffled[i]);
                  }
                }

                // Shuffle for fairness (mix MC and T/F)
                const finalList = shuffleArray(execList);

                // Execute all flips
                for (const item of finalList) {
                  const q = findQuestionElementByKey(item.questionKey);
                  if (!q) continue;
                  if (item.type === "truefalse") {
                    q.querySelectorAll(".item-answer").forEach((si) => {
                      if (getSubPart(si) !== item.subPart) return;
                      const saved = freshDb[item.key];
                      if (!saved) return;
                      for (let b of si.querySelectorAll("button")) {
                        const txt = b
                          .querySelector(".text-xs")
                          ?.textContent?.trim();
                        if (txt && txt !== saved) {
                          robustClick(b);
                          break;
                        }
                      }
                    });
                  } else if (item.type === "essay") {
                    const saved = freshDb[item.key];
                    if (!saved) continue;
                    const textarea = q.querySelector("textarea");
                    if (!textarea) continue;
                    const nativeSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLTextAreaElement.prototype,
                      "value",
                    ).set;
                    const trimmed = saved.trim();
                    const num = parseFloat(trimmed);
                    const isNumber =
                      !isNaN(num) &&
                      isFinite(num) &&
                      !/[a-df-zA-DF-Z]/.test(trimmed);
                    let wrongAnswer = "";
                    if (isNumber) {
                      const smallOffset = 0.1 + Math.random() * 2.3;
                      if (Math.random() > 0.5) {
                        wrongAnswer = num * -1;
                        if (wrongAnswer === num)
                          wrongAnswer =
                            num +
                            (Math.random() > 0.5 ? smallOffset : -smallOffset);
                      } else {
                        wrongAnswer =
                          num +
                          (Math.random() > 0.5 ? smallOffset : -smallOffset);
                      }
                      wrongAnswer = String(Math.round(wrongAnswer * 100) / 100);
                    }
                    nativeSetter.call(textarea, wrongAnswer);
                    textarea.dispatchEvent(
                      new Event("input", { bubbles: true }),
                    );
                    textarea.dispatchEvent(
                      new Event("change", { bubbles: true }),
                    );
                  } else {
                    const saved = freshDb[item.key];
                    if (!saved) continue;
                    const options = Array.from(
                      q.querySelectorAll(".item-answer, .answer-item, li"),
                    );
                    const pool = options.filter((opt) => {
                      const tEl = opt.querySelector(".answer-content") || opt;
                      return normalize(getContent(tEl)) !== saved;
                    });
                    if (pool.length > 0)
                      robustClick(
                        pool[Math.floor(Math.random() * pool.length)],
                      );
                  }
                }
              }
            }

            btn.innerText = "▶ PILOT";
            btn.classList.remove("active");
            container.classList.remove("pilot-active");
            if (autoSubmit) {
              updateStatus("Pilot finished. Submitting...");
              skPilotState = null;
              window.skSubmit();
            } else {
              updateStatus("Pilot finished.");
              skPilotState = null;
            }
          }
        }, 10);
        return;
      }

      // Paced path: time limit → fill all, then flip items until score ≤ target
      const formula = tfFormula || [0.25, 0.5, 0.75, 1];
      let itemIdx = 0;
      let phase = 0; // 0=fill all, 1=flip wrong
      let flipTargets = [];
      let internalScore = 0;
      let internalTotal = 0;
      let internalTarget = 0;
      const internalTfCounts = {}; // qKey -> correct sub-item count
      const internalTfTotals = {}; // qKey -> total sub-items

      pilotInterval = setInterval(() => {
        if (!skPilotState) {
          clearInterval(pilotInterval);
          pilotInterval = null;
          return;
        }

        if (phase === 0) {
          // Phase 0: fill all items
          if (itemIdx >= skPilotState.itemsPool.length) {
            if (!percentProvided) {
              pilotDone();
              return;
            }
            // Calculate internal score and collect flip targets
            const curDb = getDB();
            const curQs = getQuestions();
            const seenKeys = new Set();
            let mcCorrect = 0;
            let mcTotal = 0;

            curQs.forEach((q) => {
              const qKey = getQuestionKey(q);
              if (!qKey || seenKeys.has(qKey)) return;
              seenKeys.add(qKey);
              const type = detectQuestionType(q);
              if (type === "truefalse") {
                let correctCount = 0;
                let totalCount = 0;
                q.querySelectorAll(".item-answer").forEach((item) => {
                  const subPart = getSubPart(item);
                  if (!subPart) return;
                  const itemKey = `${qKey}_${subPart}`;
                  const saved = curDb[itemKey];
                  if (!saved) return;
                  totalCount++;
                  const selectedBtn =
                    item.querySelector(".selected-answer") ||
                    item.querySelector(".border-selected-answer") ||
                    item.querySelector(".selected") ||
                    item.querySelector('button[aria-pressed="true"]');
                  if (selectedBtn) {
                    const txt = (
                      selectedBtn.querySelector(".text-xs")?.textContent ||
                      selectedBtn.textContent ||
                      ""
                    ).trim();
                    if (txt === saved) {
                      correctCount++;
                      flipTargets.push({
                        type: "truefalse",
                        element: item,
                        questionKey: qKey,
                        saved,
                        key: itemKey,
                      });
                    }
                  }
                });
                internalTfCounts[qKey] = correctCount;
                internalTfTotals[qKey] = totalCount;
              } else {
                mcTotal++;
                const saved = curDb[qKey];
                if (!saved) return;
                const selected =
                  q
                    .querySelector(".border-selected-answer")
                    ?.closest(".item-answer, .answer-item") ||
                  q.querySelector(".selected") ||
                  q.querySelector(".answer-item.selected") ||
                  q.querySelector(".item-answer.selected");
                let isCorrect = false;
                if (selected) {
                  const targetEl =
                    selected.querySelector(".answer-content") || selected;
                  const curTxt = getContent(targetEl) || "";
                  isCorrect =
                    match(curTxt, saved) ||
                    normalize(curTxt) === normalize(saved);
                }
                if (isCorrect) {
                  mcCorrect++;
                  flipTargets.push({
                    type: type === "essay" ? "essay" : "mc",
                    questionKey: qKey,
                    saved,
                    key: qKey,
                  });
                }
              }
            });

            internalScore = mcCorrect;
            internalTotal = mcTotal;
            for (const qKey in internalTfCounts) {
              const count = internalTfCounts[qKey];
              if (count > 0 && count <= formula.length) {
                internalScore += formula[count - 1];
              }
              internalTotal += formula[formula.length - 1];
            }
            internalTarget = (percentValue / 100) * internalTotal;

            // Use exact enumeration to find optimal flips
            const tfQuestionInfo = Object.keys(internalTfTotals).map(
              (qKey) => ({
                qKey,
                subItemCount: internalTfTotals[qKey] || 4,
              }),
            );
            const mcPoolCount = flipTargets.filter(
              (it) => it.type !== "truefalse",
            ).length;
            const optResult = findOptimalFlips(
              tfQuestionInfo,
              mcPoolCount,
              internalScore,
              internalTarget,
              formula,
            );

            // Build execution list: MC items + T/F sub-items
            const execList = [];

            // Add MC items to flip
            const mcFlip = flipTargets.filter((it) => it.type !== "truefalse");
            const mcShuffled = shuffleArray(mcFlip.slice());
            for (
              let i = 0;
              i < optResult.mcFlips && i < mcShuffled.length;
              i++
            ) {
              execList.push(mcShuffled[i]);
            }

            // Add T/F sub-items to flip
            for (const qKey in optResult.tfStates) {
              const flipCount = optResult.tfStates[qKey];
              if (flipCount <= 0) continue;
              const tfSubItems = flipTargets.filter(
                (it) => it.type === "truefalse" && it.questionKey === qKey,
              );
              const tfShuffled = shuffleArray(tfSubItems.slice());
              for (let i = 0; i < flipCount && i < tfShuffled.length; i++) {
                execList.push(tfShuffled[i]);
              }
            }

            // Shuffle for fairness (mix MC and T/F)
            flipTargets = shuffleArray(execList);
            phase = 1;
            itemIdx = 0;
            return;
          }
          processItem(skPilotState.itemsPool[itemIdx]);
          itemIdx++;
          // ---------- live pilot progress ----------
          const elapsed_p = Date.now() - (skPilotState.startTime || 0);
          const remain_p = Math.max(0, skPilotState.totalMs - elapsed_p);
          const pct_p = Math.round(
            (itemIdx / skPilotState.itemsPool.length) * 100,
          );
          const remainStr_p =
            remain_p > 60_000
              ? Math.round(remain_p / 1000) + "s"
              : (remain_p / 1000).toFixed(1) + "s";
          updateStatus(
            `Fill ${itemIdx}/${skPilotState.itemsPool.length} (${pct_p}%) ${remainStr_p} left`,
          );
          // ----------------------------------------
        } else {
          // Phase 1: execute pre-calculated flips one at a time
          if (itemIdx >= flipTargets.length) {
            pilotDone();
            return;
          }
          const item = flipTargets[itemIdx];
          const q = findQuestionElementByKey(item.questionKey);
          if (q) {
            if (item.type === "truefalse") {
              for (let b of item.element.querySelectorAll("button")) {
                const txt = b.querySelector(".text-xs")?.textContent?.trim();
                if (txt && txt !== item.saved) {
                  robustClick(b);
                  break;
                }
              }
            } else if (item.type === "essay") {
              const textarea = q.querySelector("textarea");
              if (textarea) {
                const nativeSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLTextAreaElement.prototype,
                  "value",
                ).set;
                const trimmed = item.saved.trim();
                const num = parseFloat(trimmed);
                const isNumber =
                  !isNaN(num) &&
                  isFinite(num) &&
                  !/[a-df-zA-DF-Z]/.test(trimmed);
                let wrongAnswer = "";
                if (isNumber) {
                  const smallOffset = 0.1 + Math.random() * 2.3;
                  if (Math.random() > 0.5) {
                    wrongAnswer = num * -1;
                    if (wrongAnswer === num)
                      wrongAnswer =
                        num +
                        (Math.random() > 0.5 ? smallOffset : -smallOffset);
                  } else {
                    wrongAnswer =
                      num + (Math.random() > 0.5 ? smallOffset : -smallOffset);
                  }
                  wrongAnswer = String(Math.round(wrongAnswer * 100) / 100);
                }
                nativeSetter.call(textarea, wrongAnswer);
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
                textarea.dispatchEvent(new Event("change", { bubbles: true }));
              }
            } else {
              const options = Array.from(
                q.querySelectorAll(".item-answer, .answer-item, li"),
              );
              const pool = options.filter((opt) => {
                const tEl = opt.querySelector(".answer-content") || opt;
                return normalize(getContent(tEl)) !== item.saved;
              });
              if (pool.length > 0)
                robustClick(pool[Math.floor(Math.random() * pool.length)]);
            }
          }
          itemIdx++;
          // ---------- live flip progress ----------
          const elapsed_f = Date.now() - (skPilotState.startTime || 0);
          const remain_f = Math.max(0, skPilotState.totalMs - elapsed_f);
          const pct_f = Math.round((itemIdx / flipTargets.length) * 100);
          const remainStr_f =
            remain_f > 60_000
              ? Math.round(remain_f / 1000) + "s"
              : (remain_f / 1000).toFixed(1) + "s";
          updateStatus(
            `Flip ${itemIdx}/${flipTargets.length} (${pct_f}%) ${remainStr_f} left`,
          );
          // ----------------------------------------
        }

        // Time limit check with 5s buffer
        const elapsed = Date.now() - (skPilotState.startTime || 0);
        if (elapsed >= skPilotState.totalMs + 5000) {
          clearInterval(pilotInterval);
          pilotInterval = null;
          btn.innerText = "▶ PILOT";
          btn.classList.remove("active");
          container.classList.remove("pilot-active");
          if (skPilotState.autoSubmit) {
            updateStatus("Time limit reached. Submitting...");
            skPilotState = null;
            window.skSubmit();
          } else {
            updateStatus("Time limit reached. Pilot stopped.");
            skPilotState = null;
          }
        }
      }, perItem);
    };

    // --- File Sync ---
    window.skExportToFile = function () {
      const db = localStorage.getItem(DB_KEY);
      if (!db || db === "{}") {
        alert("Bộ nhớ hiện tại trống rỗng, không có dữ liệu để xuất!");
        return;
      }
      try {
        const blob = new Blob([db], {
          type: "application/json;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `skappa_azota_backup.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        updateStatus("Exported File!");
      } catch (e) {
        console.error(e);
        alert("Gặp lỗi trong quá trình xuất file!");
      }
    };

    window.skImportFromFile = function () {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";

      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonStr = event.target.result;
            const parsed = JSON.parse(jsonStr);

            if (typeof parsed === "object" && parsed !== null) {
              const currentDB = getDB();
              const mergedDB = Object.assign({}, currentDB, parsed);
              saveDB(mergedDB);

              resetAnswersUI();
              alert(
                `Đồng bộ file thành công! Đã nạp ${Object.keys(parsed).length} câu hỏi.`,
              );
              updateStatus("Imported File!");
            } else {
              alert("Cấu trúc file JSON backup không đúng định dạng!");
            }
          } catch (err) {
            console.error(err);
            alert("File được chọn bị lỗi cấu trúc!");
          }
        };
        reader.readAsText(file, "UTF-8");
      };
      fileInput.click();
    };

    // --- Đúng/Sai & Tự luận helpers ---
    window.skFillTF = function (mode) {
      const questions = getQuestions();
      let filled = 0;

      questions.forEach((q) => {
        if (detectQuestionType(q) !== "truefalse") return;
        const subItems = q.querySelectorAll(".item-answer");
        subItems.forEach((item) => {
          const btns = item.querySelectorAll("button");
          for (let btn of btns) {
            const txt = btn.querySelector(".text-xs")?.textContent?.trim();
            if (
              (mode === "dung" && txt === "Đúng") ||
              (mode === "sai" && txt === "Sai")
            ) {
              btn.click();
              filled++;
              break;
            }
          }
        });
      });

      updateStatus(`Filled ${filled} TF answers (${mode})!`);
    };

    window.skFillTFPtn = function () {
      const questions = getQuestions();
      const patternStr = (
        document.getElementById("sk-pattern").value || "ABCD"
      ).toUpperCase();
      let filled = 0;

      questions.forEach((q, idx) => {
        if (detectQuestionType(q) !== "truefalse") return;
        const char = patternStr[idx % patternStr.length];
        const fillDung = char === "A" || char === "C";

        const subItems = q.querySelectorAll(".item-answer");
        subItems.forEach((item) => {
          const btns = item.querySelectorAll("button");
          for (let btn of btns) {
            const txt = btn.querySelector(".text-xs")?.textContent?.trim();
            if ((fillDung && txt === "Đúng") || (!fillDung && txt === "Sai")) {
              btn.click();
              filled++;
              break;
            }
          }
        });
      });

      updateStatus(`Filled ${filled} TF answers (pattern)!`);
    };

    window.skEssayDraft = function () {
      const questions = getQuestions();
      let filled = 0;

      questions.forEach((q) => {
        if (detectQuestionType(q) !== "essay") return;
        const textarea = q.querySelector("textarea");
        if (textarea) {
          const draft = String(Math.round(Math.random() * 10000) / 100);
          textarea.value = draft;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          textarea.dispatchEvent(new Event("change", { bubbles: true }));
          filled++;
        }
      });

      updateStatus(`Filled ${filled} essay drafts!`);
    };

    // --- Quick Fill Automator ---
    window.skRun = function (mode) {
      if (window._skRunBusy) {
        updateStatus("Busy...");
        return;
      }
      window._skRunBusy = true;
      const questions = getQuestions();
      const patternStr = (
        document.getElementById("sk-pattern").value || "ABCD"
      ).toUpperCase();
      let i = 0;
      updateStatus("Running...");

      const interval = setInterval(() => {
        if (i >= questions.length) {
          updateStatus("Process Complete");
          window._skRunBusy = false;
          return clearInterval(interval);
        }
        updateStatus(`Running ${i + 1}/${questions.length}...`);

        const q = questions[i];
        const type = detectQuestionType(q);

        if (type === "truefalse") {
          const char =
            mode === "ptn" ? patternStr[i % patternStr.length] : null;
          const fillDung = char
            ? char === "A" || char === "C"
            : mode === "random"
              ? Math.random() > 0.5
              : mode === 0 || mode === 2;

          const subItems = q.querySelectorAll(".item-answer");
          subItems.forEach((item) => {
            const btns = item.querySelectorAll("button");
            // random: pick random btn
            if (mode === "random") {
              const idx = Math.floor(Math.random() * btns.length);
              if (btns[idx]) btns[idx].click();
            } else {
              for (let btn of btns) {
                const txt = btn.querySelector(".text-xs")?.textContent?.trim();
                if (
                  (fillDung && txt === "Đúng") ||
                  (!fillDung && txt === "Sai")
                ) {
                  btn.click();
                  break;
                }
              }
            }
          });
          i++;
          return;
        }

        if (type === "essay") {
          const textarea = q.querySelector("textarea");
          if (textarea) {
            const draft = String(Math.round(Math.random() * 10000) / 100);
            textarea.value = draft;
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            textarea.dispatchEvent(new Event("change", { bubbles: true }));
          }
          i++;
          return;
        }

        // Multiple choice
        const items = q.querySelectorAll(
          ".answer-item, .item-answer, li, .radio-box",
        );
        let idx;

        if (mode === "ptn") {
          const char = patternStr[i % patternStr.length];
          idx = char ? char.charCodeAt(0) - 65 : 0;
        } else if (mode === "random") {
          idx = Math.floor(Math.random() * Math.min(items.length, 4));
        } else {
          idx = mode;
        }

        if (items[idx]) {
          items[idx].scrollIntoView({ behavior: "instant", block: "center" });
          items[idx].click();
        }
        i++;
      }, 100);
    };

    // --- Force Submit ---
    window.skSubmit = function () {
      // ---------- safety check ----------
      const qsSubmit = getQuestions();
      const totalSub = qsSubmit.length;
      const answeredSub = qsSubmit.filter((q) => {
        const selected =
          q.querySelector(
            '.selected-answer, .border-selected-answer, .selected, button[aria-pressed="true"]',
          ) || q.querySelector("textarea:not(:placeholder-shown)");
        return !!selected;
      }).length;
      const rate =
        totalSub > 0 ? Math.round((answeredSub / totalSub) * 100) : 0;
      if (rate < 50) {
        if (
          !confirm(
            `⚠️ Chỉ ${answeredSub}/${totalSub} câu (${rate}%) có đáp án. Nộp bài tiếp?`,
          )
        ) {
          updateStatus(`Submit cancelled (${rate}% filled).`);
          return;
        }
      }
      // --------------------------------
      updateStatus("Trying to submit...");
      const mainBtn = Array.from(document.querySelectorAll("button")).find(
        (b) =>
          b.innerText.includes("Nộp bài") &&
          (b.innerHTML.includes("svg") || b.classList.contains("btn-primary")),
      );

      if (!mainBtn) {
        updateStatus("Submit button not found");
        return;
      }
      mainBtn.click();

      let attempts = 0;
      const checkModal = setInterval(() => {
        const confirmBtn = Array.from(
          document.querySelectorAll(
            "app-coazt-confirm-exam-dialog button.btn-primary, .modal-footer button.btn-primary",
          ),
        ).find((btn) => btn.textContent.includes("Nộp bài"));
        if (confirmBtn) {
          clearInterval(checkModal);
          confirmBtn.click();
          updateStatus("SUBMITTED!");
        }
        if (++attempts > 20) clearInterval(checkModal);
      }, 20);
    };

    // --- 6. Tiện ích & Event Binding ---
    function updateStatus(msg) {
      document.getElementById("sk-status").innerText = msg;
    }

    // Parse strings like "3m43", "3h", "10" (seconds) into milliseconds
    function parsePilotTime(str) {
      if (!str) return 0;
      str = str.trim().toLowerCase();

      // plain integer -> seconds
      if (/^\d+$/.test(str)) {
        return parseInt(str, 10) * 1000;
      }

      // match patterns like 3h, 3m43s, 2m, 45s, 1h2m3s
      const re = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
      const m = str.match(re);
      if (!m) return 0;

      const h = parseInt(m[1] || "0", 10);
      const mm = parseInt(m[2] || "0", 10);
      const s = parseInt(m[3] || "0", 10);
      return (h * 3600 + mm * 60 + s) * 1000;
    }

    // Parse composite pilot input: formats: "30" or "30,50" or ",30" (time,percent)
    // returns { totalMs, percent (0..100), percentProvided }
    function parsePilotInput(raw) {
      const out = {
        totalMs: 0,
        percent: 100,
        percentProvided: false,
        autoSubmit: true,
        tfFormula: [0.25, 0.5, 0.75, 1],
      };
      if (!raw || !raw.trim()) return out;
      const s = raw.trim();
      const parts = s.split(",").map((p) => p.trim());
      const timePart = parts[0] || "";
      const percPart = parts.length > 1 ? parts[1] : null;
      const submitPart = parts.length > 2 ? parts[2] : null;
      const formulaPart = parts.length > 3 ? parts[3] : null;

      // parse time
      if (timePart) {
        out.totalMs = parsePilotTime(timePart);
      }

      if (percPart != null) {
        out.percentProvided = true;
        let rawP = percPart.replace(/[%\s]/g, "");
        let v = parseFloat(rawP);
        if (isNaN(v)) v = 100;
        v = Math.abs(v);
        if (v > 100) v = v / 100;
        if (v < 0) v = -v;
        out.percent = Math.max(0, Math.min(100, v));
      }

      // parse auto-submit flag: 1 = auto-submit, 0 = just stop
      // default: true if no time specified, false if time specified
      if (submitPart != null && submitPart !== "") {
        out.autoSubmit = submitPart === "1";
      } else {
        out.autoSubmit = out.totalMs <= 0;
      }

      // parse T/F scoring formula
      if (formulaPart) {
        const fp = formulaPart.trim().toLowerCase();
        if (fp === "equal") {
          out.tfFormula = [0.25, 0.5, 0.75, 1];
        } else if (fp === "tapered") {
          out.tfFormula = [0.1, 0.25, 0.5, 1];
        } else {
          const nums = fp
            .split(";")
            .map((n) => parseFloat(n.trim()))
            .filter((n) => !isNaN(n));
          if (nums.length > 0) out.tfFormula = nums;
        }
      }

      return out;
    }

    // Shuffle helper
    function shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
      return a;
    }

    // Apply saved answer(s) from DB to a single question element
    function applySavedToQuestion(q) {
      try {
        const db = getDB();
        const type = detectQuestionType(q);

        if (type === "truefalse") {
          const subItems = q.querySelectorAll(".item-answer");
          subItems.forEach((item) => {
            const subPart = getSubPart(item);
            if (!subPart) return;
            const baseKey = getQuestionKey(q);
            const itemKey = `${baseKey}_${subPart}`;
            const saved = db[itemKey];
            if (!saved) return;

            const btns = item.querySelectorAll("button");
            for (let btn of btns) {
              const txt = btn.querySelector(".text-xs")?.textContent?.trim();
              if (txt === saved) {
                if (!btn.classList.contains("selected-answer"))
                  robustClick(btn);
                return;
              }
            }
          });
          return;
        }

        if (type === "essay") {
          const key = getQuestionKey(q);
          const saved = db[key];
          if (!saved) return;
          const textarea = q.querySelector("textarea");
          if (textarea) {
            if (textarea.value !== saved) {
              textarea.value = saved;
              textarea.dispatchEvent(new Event("input", { bubbles: true }));
              textarea.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
          return;
        }

        // Multiple choice
        const key = getQuestionKey(q);
        const saved = db[key];
        if (!saved) return;

        const options = [
          ...q.querySelectorAll(".item-answer, .answer-item, li"),
        ];
        const best = findBest(options, saved);
        if (best) {
          if (!best.style.backgroundColor.includes("rgba(0, 255, 136")) {
            robustClick(best);
            best.style.backgroundColor = "rgba(0,255,136,0.25)";
          }
        }
      } catch (e) {
        console.warn("applySavedToQuestion error", e);
      }
    }

    // Robust click helper: tries to click the most likely interactive child and
    // dispatches a synthetic click event to help frameworks that listen to DOM events.
    function robustClick(el) {
      if (!el) return;
      try {
        const clickable = el.querySelector("button, input, label") || el;
        if (clickable.scrollIntoView)
          clickable.scrollIntoView({ behavior: "instant", block: "center" });
        // try native click
        try {
          clickable.click();
        } catch {
          /* fallthrough */
        }
        // dispatch an explicit event as well
        clickable.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          }),
        );
      } catch (e) {
        console.warn("robustClick error", e);
      }
    }

    function findQuestionElementByKey(key) {
      const qs = getQuestions();
      for (let q of qs) {
        const k = getQuestionKey(q);
        if (k === key) return q;
      }
      return null;
    }

    // Check whether a question currently has the correct answer applied.
    // "Correct" means the student's selected/entered answer matches the saved DB
    // answer (using the same matching logic as review/fill).
    function isQuestionDoneCorrectly(q) {
      try {
        const db = getDB();
        const type = detectQuestionType(q);

        if (type === "truefalse") {
          const subItems = q.querySelectorAll(".item-answer");
          for (let item of subItems) {
            const subPart = getSubPart(item);
            if (!subPart) return false; // can't determine
            const baseKey = getQuestionKey(q);
            const itemKey = `${baseKey}_${subPart}`;
            const saved = db[itemKey];
            if (!saved) return false;

            const selectedBtn =
              item.querySelector(".selected-answer") ||
              item.querySelector(".border-selected-answer") ||
              item.querySelector(".selected") ||
              item.querySelector('button[aria-pressed="true"]');
            if (!selectedBtn) return false;
            const txt = (
              selectedBtn.querySelector(".text-xs")?.textContent ||
              selectedBtn.textContent ||
              ""
            ).trim();
            if (!txt) return false;
            if (txt !== saved) return false;
          }
          return true;
        }

        if (type === "essay") {
          const key = getQuestionKey(q);
          const saved = db[key];
          if (!saved) return false;
          const textarea = q.querySelector("textarea");
          if (!textarea) return false;
          const cur = textarea.value || "";
          if (!cur) return false;
          // use fuzzy matching as in findBest
          return match(cur, saved) || normalize(cur) === normalize(saved);
        }

        // multiple choice
        const key = getQuestionKey(q);
        const saved = db[key];
        if (!saved) return false;

        const selected =
          q
            .querySelector(".border-selected-answer")
            ?.closest(".item-answer, .answer-item") ||
          q.querySelector(".selected") ||
          q.querySelector(".answer-item.selected") ||
          q.querySelector(".item-answer.selected");
        if (!selected) return false;
        const targetEl = selected.querySelector(".answer-content") || selected;
        const curTxt = getContent(targetEl) || "";
        return match(curTxt, saved) || normalize(curTxt) === normalize(saved);
      } catch (e) {
        console.warn("isQuestionDoneCorrectly error", e);
        return false;
      }
    }

    document.getElementById("pilotBtn").onclick = window.togglePilot;
    document.getElementById("learnBtn").onclick = window.skLearn;
    document.getElementById("reviewBtn").onclick = window.skReview;
    document.getElementById("exportBtn").onclick = window.skExportToFile;
    document.getElementById("importBtn").onclick = window.skImportFromFile;

    document.getElementById("dumpBtn").onclick = () => {
      console.log("Azota Memory Database:", getDB());
      alert("Check Console (F12) to see data!");
    };
    document.getElementById("clearBtn").onclick = () => {
      if (confirm("Xóa toàn bộ đáp án đã học?")) {
        localStorage.removeItem(DB_KEY);
        resetAnswersUI();
        updateStatus("Database Cleared");
      }
    };

    // --- Info icon click-to-toggle ---
    document.querySelector(".sk-info-icon")?.addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".sk-info-icon")) {
        document
          .querySelectorAll(".sk-info-icon.active")
          .forEach((el) => el.classList.remove("active"));
      }
    });

    // --- 7. Phím tắt ---
    document.addEventListener("keydown", (e) => {
      if (e.code === "Backquote") menu.classList.toggle("hidden");
      // Alt+L = Learn, Alt+R = Review, Alt+P = Pilot, Alt+S = Submit
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "l":
            e.preventDefault();
            window.skLearn();
            break;
          case "r":
            e.preventDefault();
            window.skReview();
            break;
          case "p":
            e.preventDefault();
            window.togglePilot();
            break;
          case "s":
            e.preventDefault();
            window.skSubmit();
            break;
        }
      }
    });

    // --- 8. Auto-detect page type on load ---
    function detectAndAdapt() {
      if (isResultPage()) {
        document.getElementById("sk-header").innerHTML =
          '⚡SKAPPA RESULT <span class="sk-ver">v15.3</span>';
        document.getElementById("learnBtn").innerHTML = "🧠 LEARN";
        document.getElementById("reviewBtn").innerHTML = "🎯 HIGHLIGHT";
        updateStatus("■ Result page · \` show");
      } else {
        updateStatus("■ Hidden · \` show");
      }
    }

    detectAndAdapt();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
