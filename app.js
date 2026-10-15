(() => {
  "use strict";

  const CATEGORIES = {
    ts: { label: "TypeScript", short: "TS" },
    js: { label: "JavaScript", short: "JS" },
    react: { label: "React", short: "React" },
  };
  const CATEGORY_ORDER = ["ts", "js", "react"];
  const OPTION_LETTERS = "ABCDEFGH";
  const STORAGE_KEY = "quiz-entretien:v1";
  const WARNING_THRESHOLD = 10; // secondes restantes avant passage en rouge

  const BANK = window.QUESTION_BANK || [];
  const BY_ID = new Map(BANK.map((q) => [q.id, q]));

  // ---------------------------------------------------------------------------
  // Persistance (réglages + questions ratées), tolérante aux erreurs de stockage
  // ---------------------------------------------------------------------------
  const storage = {
    load() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      } catch {
        return {};
      }
    },
    save(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        /* stockage indisponible : on continue sans persistance */
      }
    },
  };

  const persisted = storage.load();
  const settings = Object.assign(
    {
      categories: [...CATEGORY_ORDER],
      count: 10,
      grouped: true,
      strict: false,
      timeFactor: 1,
      theme: "auto",
    },
    persisted.settings,
  );
  const mistakes = new Set((persisted.mistakes || []).filter((id) => BY_ID.has(id)));

  function persist() {
    storage.save({ settings, mistakes: [...mistakes] });
  }

  // ---------------------------------------------------------------------------
  // Utilitaires
  // ---------------------------------------------------------------------------
  function shuffle(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Texte avec `code inline` → HTML échappé. */
  function rich(text) {
    return escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function sameSet(a, b) {
    return a.length === b.length && a.every((x) => b.includes(x));
  }

  function formatSeconds(s) {
    const total = Math.max(0, Math.ceil(s));
    const m = Math.floor(total / 60);
    const r = total % 60;
    return m > 0 ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
  }

  // ---------------------------------------------------------------------------
  // Audit de la banque : cohérence du format + détection de biais d'écriture
  // (bonne réponse nettement plus longue que les autres, etc.)
  // ---------------------------------------------------------------------------
  function auditBank() {
    const issues = [];
    const seen = new Set();
    for (const q of BANK) {
      const where = q.id || "(sans id)";
      if (seen.has(q.id)) issues.push([where, "id dupliqué"]);
      seen.add(q.id);
      if (!CATEGORIES[q.category]) issues.push([where, `catégorie inconnue « ${q.category} »`]);
      if (!["single", "multiple"].includes(q.type)) issues.push([where, `type inconnu « ${q.type} »`]);
      if (!(q.time > 0)) issues.push([where, "chrono manquant"]);
      if (!Array.isArray(q.options) || q.options.length < 2) {
        issues.push([where, "au moins 2 options requises"]);
        continue;
      }
      if (!Array.isArray(q.answer) || q.answer.length === 0) issues.push([where, "aucune bonne réponse"]);
      else if (q.answer.some((i) => i < 0 || i >= q.options.length)) issues.push([where, "index de réponse hors limites"]);
      if (q.type === "single" && q.answer.length !== 1) issues.push([where, "question à choix unique avec plusieurs réponses"]);

      // Biais de longueur : la seule bonne réponse est la plus longue, de loin.
      if (q.type === "single" && q.answer.length === 1) {
        const lengths = q.options.map((o) => o.length);
        const good = lengths[q.answer[0]];
        const others = lengths.filter((_, i) => i !== q.answer[0]);
        const avg = others.reduce((s, n) => s + n, 0) / others.length;
        if (good > Math.max(...others) && good > avg * 1.3 && good - avg > 8) {
          issues.push([where, `bonne réponse nettement plus longue (${good} vs moy. ${Math.round(avg)} car.)`]);
        }
      }
    }
    // Biais global : la bonne réponse ne doit pas être « souvent la plus longue ».
    const singles = BANK.filter((q) => q.type === "single" && q.answer && q.answer.length === 1);
    const longest = singles.filter((q) => {
      const good = q.options[q.answer[0]].length;
      return q.options.every((o, i) => i === q.answer[0] || o.length < good);
    }).length;
    const expected = singles.reduce((s, q) => s + 1 / q.options.length, 0);
    if (singles.length && longest > expected * 1.25) {
      issues.push(["(global)", `bonne réponse strictement la plus longue dans ${longest}/${singles.length} questions (hasard ≈ ${Math.round(expected)})`]);
    }

    if (issues.length) console.table(issues.map(([id, problem]) => ({ id, problem })));
    return issues;
  }

  const auditIssues = auditBank();

  // ---------------------------------------------------------------------------
  // État de l'application
  // ---------------------------------------------------------------------------
  const app = document.getElementById("app");
  let screen = "home";
  let session = null;
  let timerId = null;

  function availableQuestions(mode) {
    const cats = new Set(settings.categories);
    return BANK.filter((q) => cats.has(q.category) && (mode !== "mistakes" || mistakes.has(q.id)));
  }

  function startSession(mode) {
    let pool = shuffle(availableQuestions(mode));
    if (mode !== "mistakes" && settings.count !== "all") pool = pool.slice(0, settings.count);
    if (settings.grouped) {
      pool.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
    }
    if (pool.length === 0) return;

    session = {
      mode,
      questions: pool,
      index: 0,
      results: [],
      startedAt: Date.now(),
    };
    screen = "quiz";
    loadQuestion();
  }

  function loadQuestion() {
    const q = session.questions[session.index];
    const limit = settings.timeFactor > 0 ? Math.round(q.time * settings.timeFactor) : 0;
    session.current = {
      question: q,
      order: shuffle(q.options.map((_, i) => i)), // position affichée → index d'origine
      selected: new Set(), // index d'origine
      validated: false,
      timedOut: false,
      limit,
      startedAt: Date.now(),
      deadline: limit ? Date.now() + limit * 1000 : 0,
    };
    render();
    startTimer();
  }

  function startTimer() {
    stopTimer();
    if (!session.current.deadline) return;
    timerId = setInterval(tick, 200);
    tick();
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function tick() {
    const cur = session.current;
    const remaining = Math.max(0, (cur.deadline - Date.now()) / 1000);
    const bar = document.getElementById("timer-bar");
    const label = document.getElementById("timer-label");
    if (bar) {
      bar.style.transform = `scaleX(${remaining / cur.limit})`;
      bar.parentElement.classList.toggle("is-urgent", remaining <= WARNING_THRESHOLD);
    }
    if (label) label.textContent = formatSeconds(remaining);
    if (remaining <= 0) validate(true);
  }

  function toggleOption(originalIndex) {
    const cur = session.current;
    if (cur.validated) return;
    const exclusive = cur.question.type === "single" && !settings.strict;
    if (exclusive) {
      cur.selected = new Set([originalIndex]);
    } else if (cur.selected.has(originalIndex)) {
      cur.selected.delete(originalIndex);
    } else {
      cur.selected.add(originalIndex);
    }
    renderOptionsState();
  }

  function validate(timedOut = false) {
    const cur = session.current;
    if (cur.validated) return;
    if (!timedOut && cur.selected.size === 0) return;
    stopTimer();
    cur.validated = true;
    cur.timedOut = timedOut;
    const selected = [...cur.selected];
    const correct = sameSet(selected, cur.question.answer);
    session.results.push({
      question: cur.question,
      selected,
      correct,
      timedOut,
      spent: Math.min((Date.now() - cur.startedAt) / 1000, cur.limit || Infinity),
    });
    if (correct) mistakes.delete(cur.question.id);
    else mistakes.add(cur.question.id);
    persist();
    render();
  }

  function next() {
    if (!session.current.validated) return;
    if (session.index + 1 < session.questions.length) {
      session.index++;
      loadQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    stopTimer();
    screen = "results";
    render();
  }

  function quit() {
    stopTimer();
    if (session && session.results.length) finish();
    else goHome();
  }

  function goHome() {
    stopTimer();
    session = null;
    screen = "home";
    render();
  }

  // ---------------------------------------------------------------------------
  // Rendus
  // ---------------------------------------------------------------------------
  function render() {
    if (screen === "home") app.innerHTML = renderHome();
    else if (screen === "quiz") app.innerHTML = renderQuiz();
    else app.innerHTML = renderResults();
    if (screen === "quiz") {
      renderOptionsState();
      applyValidatedClasses();
    }
    window.scrollTo(0, 0);
    const focusTarget = app.querySelector("[data-autofocus]");
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  function renderHome() {
    const counts = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, BANK.filter((q) => q.category === c).length]));
    const selectedCount = availableQuestions("all").length;
    const mistakesCount = availableQuestions("mistakes").length;
    const countOptions = [5, 10, 20, "all"];
    const timeOptions = [
      [1, "Normal"],
      [1.5, "Confortable ×1.5"],
      [0, "Désactivé"],
    ];

    return `
      <header class="hero">
        <p class="eyebrow">Entraînement entretien technique</p>
        <h1>React · TypeScript · JavaScript</h1>
        <p class="lede">Questions théoriques chronométrées, à choix unique ou multiple. Les options sont mélangées à chaque passage.</p>
      </header>

      <section class="panel">
        <h2>Catégories</h2>
        <div class="cat-grid">
          ${CATEGORY_ORDER.map(
            (c) => `
            <button type="button" class="cat-card cat-${c} ${settings.categories.includes(c) ? "is-on" : ""}"
                    data-action="toggle-category" data-value="${c}" aria-pressed="${settings.categories.includes(c)}">
              <span class="cat-badge">${CATEGORIES[c].short}</span>
              <span class="cat-name">${CATEGORIES[c].label}</span>
              <span class="cat-count">${counts[c]} questions</span>
            </button>`,
          ).join("")}
        </div>
      </section>

      <section class="panel settings">
        <div class="setting">
          <span class="setting-label">Nombre de questions</span>
          <div class="segmented">
            ${countOptions
              .map(
                (n) => `<button type="button" data-action="set-count" data-value="${n}"
                  class="${settings.count === n ? "is-on" : ""}">${n === "all" ? "Toutes" : n}</button>`,
              )
              .join("")}
          </div>
        </div>
        <div class="setting">
          <span class="setting-label">Chrono</span>
          <div class="segmented">
            ${timeOptions
              .map(
                ([v, label]) => `<button type="button" data-action="set-time" data-value="${v}"
                  class="${settings.timeFactor === v ? "is-on" : ""}">${label}</button>`,
              )
              .join("")}
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" data-action="toggle-grouped" ${settings.grouped ? "checked" : ""}>
          <span><strong>Regrouper par catégorie</strong> TS, puis JS, puis React (sinon tout est mélangé)</span>
        </label>
        <label class="switch">
          <input type="checkbox" data-action="toggle-strict" ${settings.strict ? "checked" : ""}>
          <span><strong>Mode strict</strong> : ne pas indiquer si la question attend une ou plusieurs réponses</span>
        </label>
      </section>

      <div class="actions">
        <button type="button" class="btn btn-primary" data-action="start" data-autofocus ${selectedCount ? "" : "disabled"}>
          Commencer <span class="muted">(${settings.count === "all" ? selectedCount : Math.min(settings.count, selectedCount)} questions)</span>
        </button>
        <button type="button" class="btn" data-action="start-mistakes" ${mistakesCount ? "" : "disabled"}>
          Réviser mes erreurs <span class="muted">(${mistakesCount})</span>
        </button>
      </div>

      <footer class="foot">
        <span>${BANK.length} questions au total</span>
        ${
          auditIssues.length
            ? `<details class="audit"><summary>Audit : ${auditIssues.length} problème(s) détecté(s)</summary>
                 <ul>${auditIssues.map(([id, p]) => `<li><code>${escapeHtml(id)}</code> ${escapeHtml(p)}</li>`).join("")}</ul>
               </details>`
            : `<span>Audit de la banque : aucun biais détecté</span>`
        }
        ${mistakes.size ? `<button type="button" class="link" data-action="reset-mistakes">Effacer l'historique d'erreurs</button>` : ""}
      </footer>`;
  }

  function renderQuiz() {
    const cur = session.current;
    const q = cur.question;
    const total = session.questions.length;
    const score = session.results.filter((r) => r.correct).length;
    const isMultiple = q.type === "multiple";
    const hint = settings.strict
      ? "Sélectionnez la ou les bonnes réponses"
      : isMultiple
        ? "Plusieurs réponses possibles"
        : "Une seule réponse";

    return `
      <div class="quiz-top">
        <button type="button" class="link" data-action="quit">← Terminer</button>
        <span class="progress-label">Question ${session.index + 1} / ${total}</span>
        <span class="score-label">Score ${score} / ${session.results.length}</span>
      </div>
      <div class="progress"><div class="progress-fill" style="width:${(session.index / total) * 100}%"></div></div>

      <article class="question-card">
        <div class="question-meta">
          <span class="cat-badge cat-${q.category}">${CATEGORIES[q.category].label}</span>
          ${
            cur.limit
              ? `<div class="timer ${cur.validated ? "is-stopped" : ""}" role="timer">
                   <div class="timer-track"><div id="timer-bar" class="timer-bar"></div></div>
                   <span id="timer-label" class="timer-label">${formatSeconds(cur.limit)}</span>
                 </div>`
              : `<span class="muted">Sans chrono</span>`
          }
        </div>

        <h2 class="question-text">${rich(q.question)}</h2>
        ${q.code ? `<pre class="code"><code>${window.highlightCode(q.code)}</code></pre>` : ""}
        <p class="hint">${hint}</p>

        <div class="options" role="${isMultiple || settings.strict ? "group" : "radiogroup"}">
          ${cur.order
            .map(
              (orig, pos) => `
            <button type="button" class="option" data-action="toggle-option" data-value="${orig}"
                    ${cur.validated ? "disabled" : ""}>
              <span class="option-key">${OPTION_LETTERS[pos]}</span>
              <span class="option-text">${rich(q.options[orig])}</span>
              <span class="option-mark" aria-hidden="true"></span>
            </button>`,
            )
            .join("")}
        </div>

        ${cur.validated ? renderFeedback() : ""}

        <div class="quiz-actions">
          ${
            cur.validated
              ? `<button type="button" class="btn btn-primary" data-action="next" data-autofocus>
                   ${session.index + 1 < total ? "Question suivante" : "Voir le résultat"} <kbd>Entrée</kbd>
                 </button>`
              : `<button type="button" class="btn btn-primary" data-action="validate" id="validate-btn" disabled>
                   Valider <kbd>Entrée</kbd>
                 </button>`
          }
          <span class="kbd-help">Raccourcis : <kbd>A</kbd>–<kbd>${OPTION_LETTERS[cur.order.length - 1]}</kbd> ou <kbd>1</kbd>–<kbd>${cur.order.length}</kbd></span>
        </div>
      </article>`;
  }

  function renderFeedback() {
    const result = session.results[session.results.length - 1];
    const title = result.correct ? "Bonne réponse" : result.timedOut ? "Temps écoulé" : "Mauvaise réponse";
    return `
      <div class="feedback ${result.correct ? "is-correct" : "is-wrong"}">
        <strong>${title}</strong>
        <p>${rich(result.question.explanation)}</p>
      </div>`;
  }

  /** Met à jour les classes des options sans re-rendre (évite de perdre le focus/chrono). */
  function renderOptionsState() {
    const cur = session.current;
    app.querySelectorAll(".option").forEach((el) => {
      const orig = Number(el.dataset.value);
      const selected = cur.selected.has(orig);
      el.classList.toggle("is-selected", selected);
      el.setAttribute("aria-pressed", String(selected));
    });
    const btn = document.getElementById("validate-btn");
    if (btn) btn.disabled = cur.selected.size === 0;
  }

  function applyValidatedClasses() {
    const cur = session.current;
    if (!cur || !cur.validated) return;
    app.querySelectorAll(".option").forEach((el) => {
      const orig = Number(el.dataset.value);
      const good = cur.question.answer.includes(orig);
      const picked = cur.selected.has(orig);
      el.classList.toggle("is-selected", picked);
      el.classList.toggle("is-correct", good && picked);
      el.classList.toggle("is-missed", good && !picked);
      el.classList.toggle("is-wrong", !good && picked);
      el.classList.toggle("is-dim", !good && !picked);
    });
  }

  function renderResults() {
    const results = session.results;
    const good = results.filter((r) => r.correct).length;
    const pct = results.length ? Math.round((good / results.length) * 100) : 0;
    const totalTime = results.reduce((s, r) => s + r.spent, 0);
    const perCat = CATEGORY_ORDER.map((c) => {
      const rs = results.filter((r) => r.question.category === c);
      return { c, total: rs.length, good: rs.filter((r) => r.correct).length };
    }).filter((x) => x.total > 0);
    const verdict = pct >= 80 ? "Prêt pour l'entretien" : pct >= 60 ? "Bonne base, à consolider" : "À retravailler";

    return `
      <header class="hero">
        <p class="eyebrow">Résultat${results.length < session.questions.length ? " (session interrompue)" : ""}</p>
        <h1>${good} / ${results.length} <span class="muted">· ${pct}%</span></h1>
        <p class="lede">${verdict} — ${formatSeconds(totalTime)} au total, ${formatSeconds(results.length ? totalTime / results.length : 0)} par question en moyenne.</p>
      </header>

      <section class="panel">
        <h2>Par catégorie</h2>
        <div class="cat-results">
          ${perCat
            .map(
              ({ c, total, good: g }) => `
            <div class="cat-result">
              <span class="cat-badge cat-${c}">${CATEGORIES[c].label}</span>
              <div class="meter"><div class="meter-fill cat-${c}" style="width:${(g / total) * 100}%"></div></div>
              <span class="tabular">${g} / ${total}</span>
            </div>`,
            )
            .join("")}
        </div>
      </section>

      <section class="panel">
        <h2>Détail des réponses</h2>
        <ol class="review">
          ${results.map(renderReviewItem).join("")}
        </ol>
      </section>

      <div class="actions">
        <button type="button" class="btn btn-primary" data-action="restart" data-autofocus>Nouvelle session</button>
        <button type="button" class="btn" data-action="start-mistakes" ${availableQuestions("mistakes").length ? "" : "disabled"}>
          Réviser mes erreurs (${availableQuestions("mistakes").length})
        </button>
        <button type="button" class="btn" data-action="home">Accueil</button>
      </div>`;
  }

  function renderReviewItem(r) {
    const q = r.question;
    const status = r.correct ? "ok" : r.timedOut ? "timeout" : "ko";
    const statusLabel = { ok: "Correct", ko: "Incorrect", timeout: "Temps écoulé" }[status];
    const yours = r.selected.length ? r.selected.map((i) => `<li>${rich(q.options[i])}</li>`).join("") : "<li><em>Aucune réponse</em></li>";
    const expected = q.answer.map((i) => `<li>${rich(q.options[i])}</li>`).join("");
    return `
      <li class="review-item is-${status}">
        <details ${r.correct ? "" : "open"}>
          <summary>
            <span class="status-dot" aria-hidden="true"></span>
            <span class="cat-badge cat-${q.category}">${CATEGORIES[q.category].short}</span>
            <span class="review-q">${rich(q.question)}</span>
            <span class="review-status">${statusLabel}</span>
          </summary>
          ${q.code ? `<pre class="code"><code>${window.highlightCode(q.code)}</code></pre>` : ""}
          <div class="review-cols">
            <div><h3>Votre réponse</h3><ul>${yours}</ul></div>
            <div><h3>Réponse attendue</h3><ul>${expected}</ul></div>
          </div>
          <p class="review-expl">${rich(q.explanation)}</p>
        </details>
      </li>`;
  }

  // ---------------------------------------------------------------------------
  // Événements
  // ---------------------------------------------------------------------------
  app.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action]");
    if (!el || el.disabled) return;
    const { action, value } = el.dataset;

    switch (action) {
      case "toggle-category": {
        const set = new Set(settings.categories);
        set.has(value) ? set.delete(value) : set.add(value);
        settings.categories = CATEGORY_ORDER.filter((c) => set.has(c));
        persist();
        render();
        break;
      }
      case "set-count":
        settings.count = value === "all" ? "all" : Number(value);
        persist();
        render();
        break;
      case "set-time":
        settings.timeFactor = Number(value);
        persist();
        render();
        break;
      case "start":
        startSession("all");
        break;
      case "start-mistakes":
        startSession("mistakes");
        break;
      case "reset-mistakes":
        mistakes.clear();
        persist();
        render();
        break;
      case "toggle-option":
        toggleOption(Number(value));
        break;
      case "validate":
        validate();
        break;
      case "next":
        next();
        break;
      case "quit":
        quit();
        break;
      case "restart":
        startSession("all");
        break;
      case "home":
        goHome();
        break;
    }
  });

  app.addEventListener("change", (event) => {
    const action = event.target.dataset.action;
    if (action === "toggle-grouped") settings.grouped = event.target.checked;
    else if (action === "toggle-strict") settings.strict = event.target.checked;
    else return;
    persist();
  });

  document.addEventListener("keydown", (event) => {
    if (screen !== "quiz" || event.ctrlKey || event.metaKey || event.altKey) return;
    const cur = session.current;
    if (event.key === "Enter") {
      // Laisse le bouton focalisé gérer Entrée nativement, sauf s'il s'agit d'une option.
      if (document.activeElement && document.activeElement.matches("button:not(.option)")) return;
      event.preventDefault();
      cur.validated ? next() : validate();
      return;
    }
    if (cur.validated) return;
    const key = event.key.toUpperCase();
    let pos = OPTION_LETTERS.indexOf(key);
    if (pos === -1 && /^[1-8]$/.test(key)) pos = Number(key) - 1;
    if (pos >= 0 && pos < cur.order.length) {
      event.preventDefault();
      toggleOption(cur.order[pos]);
    }
  });

  // ---------------------------------------------------------------------------
  // Thème : auto (système) → clair → sombre
  // ---------------------------------------------------------------------------
  const THEMES = {
    auto: { next: "light", icon: "◐", label: "Thème : auto (système)" },
    light: { next: "dark", icon: "☀", label: "Thème : clair" },
    dark: { next: "auto", icon: "☾", label: "Thème : sombre" },
  };
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme() {
    if (!THEMES[settings.theme]) settings.theme = "auto";
    const theme = THEMES[settings.theme];
    if (settings.theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", settings.theme);
    themeToggle.innerHTML = `<span aria-hidden="true">${theme.icon}</span> ${theme.label.replace("Thème : ", "")}`;
    themeToggle.title = `${theme.label} — cliquer pour changer`;
  }

  themeToggle.addEventListener("click", () => {
    settings.theme = THEMES[settings.theme].next;
    persist();
    applyTheme();
  });

  applyTheme();
  render();
})();
