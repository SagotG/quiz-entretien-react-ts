(() => {
  "use strict";

  const CATEGORIES = {
    ts: { label: "TypeScript", short: "TS" },
    js: { label: "JavaScript", short: "JS" },
    es: { label: "ECMAScript", short: "ES" },
    react: { label: "React", short: "React" },
  };
  const CATEGORY_ORDER = ["ts", "js", "es", "react"];
  // Catégories connues avant l'ajout du champ `knownCategories` dans les réglages.
  const LEGACY_CATEGORIES = ["ts", "js", "react"];

  const LEVELS = {
    junior: { label: "Junior" },
    mid: { label: "Confirmé" },
    senior: { label: "Senior" },
  };
  const LEVEL_ORDER = ["junior", "mid", "senior"];
  const LEVEL_FILTERS = ["all", ...LEVEL_ORDER];
  const OPTION_LETTERS = "ABCDEFGH";
  const STORAGE_KEY = "quiz-entretien:v1";
  const WARNING_THRESHOLD = 10; // secondes restantes avant passage en rouge

  // Trusted Types : la CSP (`require-trusted-types-for 'script'`) refuse toute insertion HTML qui ne
  // passe pas par cette politique unique. Les gabarits sont produits par l'application et tout
  // contenu de question est échappé en amont (escapeHtml / rich / highlightCode).
  const htmlPolicy = window.trustedTypes
    ? window.trustedTypes.createPolicy("quiz-html", { createHTML: (html) => html })
    : null;

  function setHTML(el, html) {
    el.innerHTML = htmlPolicy ? htmlPolicy.createHTML(html) : html;
  }

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

  const COUNT_OPTIONS = [5, 10, 20, "all"];
  const TIME_FACTORS = [1, 1.5, 0];
  const THEME_NAMES = ["auto", "light", "dark"];

  /**
   * Catégories cochées : celles enregistrées, plus toute catégorie apparue depuis le dernier
   * enregistrement (sinon une nouvelle catégorie resterait décochée chez les anciens visiteurs).
   */
  function sanitizeCategories(s) {
    if (!Array.isArray(s.categories)) return [...CATEGORY_ORDER];
    const known = Array.isArray(s.knownCategories) ? s.knownCategories : LEGACY_CATEGORIES;
    return CATEGORY_ORDER.filter((c) => s.categories.includes(c) || !known.includes(c));
  }

  /** Ne garde du stockage que des valeurs connues : le localStorage n'est pas une source fiable. */
  function sanitizeSettings(raw) {
    const s = raw && typeof raw === "object" ? raw : {};
    const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);
    const bool = (value, fallback) => (typeof value === "boolean" ? value : fallback);
    return {
      categories: sanitizeCategories(s),
      level: pick(s.level, LEVEL_FILTERS, "all"),
      count: pick(s.count, COUNT_OPTIONS, 10),
      grouped: bool(s.grouped, true),
      strict: bool(s.strict, false),
      shortcuts: bool(s.shortcuts, true),
      sound: bool(s.sound, true),
      timeFactor: pick(s.timeFactor, TIME_FACTORS, 1),
      theme: pick(s.theme, THEME_NAMES, "auto"),
    };
  }

  const persisted = storage.load();
  const settings = sanitizeSettings(persisted.settings);
  const mistakes = new Set(
    (Array.isArray(persisted.mistakes) ? persisted.mistakes : []).filter((id) => BY_ID.has(id)),
  );

  function persist() {
    storage.save({ settings: { ...settings, knownCategories: CATEGORY_ORDER }, mistakes: [...mistakes] });
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
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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
      if (!LEVELS[q.level]) issues.push([where, `niveau inconnu « ${q.level} »`]);
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
  const srStatus = document.getElementById("sr-status");
  let screen = "home";
  let session = null;
  let timerId = null;
  let lastViewKey = null; // détecte un changement d'écran / de question entre deux rendus

  /** Message lu par les lecteurs d'écran via la région `role="status"` persistante. */
  function announce(message) {
    srStatus.textContent = "";
    // Laisse le temps au DOM de vider la région pour qu'un message identique soit relu.
    setTimeout(() => {
      srStatus.textContent = message;
    }, 50);
  }

  function matchesLevel(q) {
    return settings.level === "all" || q.level === settings.level;
  }

  function availableQuestions(mode) {
    const cats = new Set(settings.categories);
    return BANK.filter(
      (q) => cats.has(q.category) && matchesLevel(q) && (mode !== "mistakes" || mistakes.has(q.id)),
    );
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
    if (remaining <= 0) {
      validate(true);
      return;
    }
    // Alerte unique à l'approche de la fin (le libellé du chrono n'est pas une région live).
    if (remaining <= WARNING_THRESHOLD && !cur.warned) {
      cur.warned = true;
      announce(`Plus que ${WARNING_THRESHOLD} secondes`);
    }
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
    sounds.play(correct ? "success" : "failure");
    announce(`${feedbackTitle(session.results[session.results.length - 1])}. ${plainText(cur.question.explanation)}`);
  }

  function feedbackTitle(result) {
    return result.correct ? "Bonne réponse" : result.timedOut ? "Temps écoulé" : "Mauvaise réponse";
  }

  function plainText(text) {
    return String(text).replace(/`/g, "");
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
  const SCREEN_TITLES = {
    home: () => "Accueil",
    quiz: () => `Question ${session.index + 1} sur ${session.questions.length}`,
    results: () => "Résultat",
  };

  function render() {
    // Mémorise l'élément focalisé pour le restaurer après un rendu sur le même écran
    // (ex. : cocher une catégorie ne doit ni faire défiler la page ni déplacer le focus).
    const active = document.activeElement;
    const previousFocus =
      active && app.contains(active) && active.dataset.action
        ? { action: active.dataset.action, value: active.dataset.value }
        : null;

    if (screen === "home") setHTML(app, renderHome());
    else if (screen === "quiz") setHTML(app, renderQuiz());
    else setHTML(app, renderResults());

    // Largeurs appliquées via le CSSOM : compatible avec une CSP sans 'unsafe-inline'.
    app.querySelectorAll("[data-width]").forEach((el) => {
      el.style.width = `${el.dataset.width}%`;
    });
    if (screen === "quiz") {
      renderOptionsState();
      applyValidatedClasses();
    }
    document.title = `${SCREEN_TITLES[screen]()} · Quiz entretien React · TS · JS`;

    const viewKey = screen === "quiz" ? `quiz:${session.index}:${session.current.validated}` : screen;
    const isFirstRender = lastViewKey === null;
    const viewChanged = viewKey !== lastViewKey;
    lastViewKey = viewKey;

    if (isFirstRender) return; // au chargement, on laisse le navigateur gérer le focus
    if (viewChanged) {
      if (!viewKey.endsWith(":true")) window.scrollTo(0, 0);
      const focusTarget = app.querySelector("[data-autofocus]");
      if (focusTarget) focusTarget.focus({ preventScroll: !viewKey.endsWith(":true") });
    } else if (previousFocus) {
      const selector = `[data-action="${previousFocus.action}"]${
        previousFocus.value !== undefined ? `[data-value="${previousFocus.value}"]` : ""
      }`;
      const same = app.querySelector(selector);
      if (same) same.focus({ preventScroll: true });
    }
  }

  function renderHome() {
    const counts = Object.fromEntries(
      CATEGORY_ORDER.map((c) => [c, BANK.filter((q) => q.category === c && matchesLevel(q)).length]),
    );
    const levelLabels = { all: "Tous", ...Object.fromEntries(LEVEL_ORDER.map((l) => [l, LEVELS[l].label])) };
    const selectedCount = availableQuestions("all").length;
    const mistakesCount = availableQuestions("mistakes").length;
    const timeLabels = { 1: "Normal", 1.5: "Confortable ×1.5", 0: "Désactivé" };

    return `
      <header class="hero">
        <p class="eyebrow">Entraînement entretien technique</p>
        <h1 tabindex="-1" data-autofocus>React · TypeScript · JavaScript · ECMAScript</h1>
        <p class="lede">Questions théoriques chronométrées, à choix unique ou multiple. Les options sont mélangées à chaque passage.</p>
      </header>

      <section class="panel" aria-labelledby="cat-title">
        <h2 id="cat-title">Catégories</h2>
        <div class="cat-grid">
          ${CATEGORY_ORDER.map((c) => {
            const on = settings.categories.includes(c);
            return `
            <button type="button" class="cat-card cat-${c} ${on ? "is-on" : ""}"
                    data-action="toggle-category" data-value="${c}" aria-pressed="${on}">
              <span class="cat-badge" aria-hidden="true">${CATEGORIES[c].short}</span>
              <span class="cat-name">${CATEGORIES[c].label}</span>
              <span class="cat-count">${counts[c]} question${counts[c] > 1 ? "s" : ""}</span>
              <span class="cat-check" aria-hidden="true"></span>
            </button>`;
          }).join("")}
        </div>
      </section>

      <section class="panel settings" aria-label="Réglages">
        <div class="setting" role="group" aria-labelledby="level-label">
          <span class="setting-label" id="level-label">Niveau</span>
          <div class="segmented">
            ${LEVEL_FILTERS.map(
              (l) => `<button type="button" data-action="set-level" data-value="${l}"
                  aria-pressed="${settings.level === l}" class="${settings.level === l ? "is-on" : ""}">${levelLabels[l]}</button>`,
            ).join("")}
          </div>
        </div>
        <div class="setting" role="group" aria-labelledby="count-label">
          <span class="setting-label" id="count-label">Nombre de questions</span>
          <div class="segmented">
            ${COUNT_OPTIONS.map(
              (n) => `<button type="button" data-action="set-count" data-value="${n}"
                  aria-pressed="${settings.count === n}" class="${settings.count === n ? "is-on" : ""}">${n === "all" ? "Toutes" : n}</button>`,
            ).join("")}
          </div>
        </div>
        <div class="setting" role="group" aria-labelledby="time-label">
          <span class="setting-label" id="time-label">Chrono</span>
          <div class="segmented">
            ${TIME_FACTORS.map(
              (v) => `<button type="button" data-action="set-time" data-value="${v}"
                  aria-pressed="${settings.timeFactor === v}" class="${settings.timeFactor === v ? "is-on" : ""}">${timeLabels[v]}</button>`,
            ).join("")}
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" data-action="toggle-grouped" ${settings.grouped ? "checked" : ""}>
          <span><strong>Regrouper par catégorie</strong> TS, puis JS, ES et React (sinon tout est mélangé)</span>
        </label>
        <label class="switch">
          <input type="checkbox" data-action="toggle-strict" ${settings.strict ? "checked" : ""}>
          <span><strong>Mode strict</strong> : ne pas indiquer si la question attend une ou plusieurs réponses</span>
        </label>
        <label class="switch">
          <input type="checkbox" data-action="toggle-shortcuts" ${settings.shortcuts ? "checked" : ""}>
          <span><strong>Raccourcis clavier</strong> : lettres ou chiffres pour cocher, <kbd>Entrée</kbd> pour valider</span>
        </label>
      </section>

      <div class="actions">
        <button type="button" class="btn btn-primary" data-action="start" ${selectedCount ? "" : "disabled"}>
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

    const kbd = (key) => (settings.shortcuts ? ` <kbd aria-hidden="true">${key}</kbd>` : "");

    return `
      <div class="quiz-top">
        <button type="button" class="link" data-action="quit">← Terminer</button>
        <h1 class="progress-label">Question ${session.index + 1} / ${total}</h1>
        <span class="score-label">Score ${score} / ${session.results.length}</span>
      </div>
      <div class="progress" aria-hidden="true"><div class="progress-fill" data-width="${(session.index / total) * 100}"></div></div>

      <article class="question-card" aria-labelledby="q-text">
        <div class="question-meta">
          <span class="meta-badges">
            <span class="cat-badge cat-${q.category}">${CATEGORIES[q.category].label}</span>
            <span class="level-badge level-${q.level}"><span class="sr-only">Niveau : </span>${LEVELS[q.level].label}</span>
          </span>
          ${
            cur.limit
              ? `<div class="timer ${cur.validated ? "is-stopped" : ""}" role="timer" aria-label="Temps restant">
                   <div class="timer-track" aria-hidden="true"><div id="timer-bar" class="timer-bar"></div></div>
                   <span id="timer-label" class="timer-label">${formatSeconds(cur.limit)}</span>
                 </div>`
              : `<span class="muted">Sans chrono</span>`
          }
        </div>

        <h2 class="question-text" id="q-text" tabindex="-1" ${cur.validated ? "" : "data-autofocus"}>${rich(q.question)}</h2>
        ${q.code ? `<pre class="code" tabindex="0" aria-label="Extrait de code"><code>${window.highlightCode(q.code)}</code></pre>` : ""}
        <p class="hint" id="q-hint">${hint}</p>

        <div class="options" role="group" aria-labelledby="q-text" aria-describedby="q-hint">
          ${cur.order
            .map(
              (orig, pos) => `
            <button type="button" class="option" data-action="toggle-option" data-value="${orig}"
                    ${cur.validated ? 'aria-disabled="true"' : ""}>
              <span class="option-key" aria-hidden="true">${OPTION_LETTERS[pos]}</span>
              <span class="option-text">${rich(q.options[orig])}</span>
              <span class="option-status"></span>
            </button>`,
            )
            .join("")}
        </div>

        ${cur.validated ? renderFeedback() : ""}

        <div class="quiz-actions">
          ${
            cur.validated
              ? `<button type="button" class="btn btn-primary" data-action="next" data-autofocus>
                   ${session.index + 1 < total ? "Question suivante" : "Voir le résultat"}${kbd("Entrée")}
                 </button>`
              : `<button type="button" class="btn btn-primary" data-action="validate" id="validate-btn" disabled>
                   Valider${kbd("Entrée")}
                 </button>`
          }
          ${
            settings.shortcuts
              ? `<span class="kbd-help">Raccourcis : <kbd>A</kbd>–<kbd>${OPTION_LETTERS[cur.order.length - 1]}</kbd> ou <kbd>1</kbd>–<kbd>${cur.order.length}</kbd></span>`
              : ""
          }
        </div>
      </article>`;
  }

  function renderFeedback() {
    const result = session.results[session.results.length - 1];
    return `
      <div class="feedback ${result.correct ? "is-correct" : "is-wrong"}">
        <p class="feedback-title">
          <span class="feedback-icon" aria-hidden="true">${result.correct ? "✓" : "✗"}</span>
          <strong>${feedbackTitle(result)}</strong>
        </p>
        <p class="feedback-text">${rich(result.question.explanation)}</p>
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
      // Étiquette visible (et lue par les lecteurs d'écran) : la couleur n'est jamais le seul indice.
      const status = good
        ? picked
          ? "✓ Votre réponse · correcte"
          : "✓ Bonne réponse, non cochée"
        : picked
          ? "✗ Votre réponse · incorrecte"
          : "";
      el.querySelector(".option-status").textContent = status;
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
        <h1 tabindex="-1" data-autofocus>${good} / ${results.length} <span class="muted">· ${pct}%</span></h1>
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
              <div class="meter" aria-hidden="true"><div class="meter-fill cat-${c}" data-width="${(g / total) * 100}"></div></div>
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
        <button type="button" class="btn btn-primary" data-action="restart">Nouvelle session</button>
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
            <span class="cat-badge cat-${q.category}" title="${CATEGORIES[q.category].label}">${CATEGORIES[q.category].short}</span>
            <span class="review-q">${rich(q.question)}</span>
            <span class="review-status">${statusLabel}</span>
          </summary>
          ${q.code ? `<pre class="code" tabindex="0" aria-label="Extrait de code"><code>${window.highlightCode(q.code)}</code></pre>` : ""}
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
      case "set-level":
        settings.level = LEVEL_FILTERS.includes(value) ? value : "all";
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
    else if (action === "toggle-shortcuts") settings.shortcuts = event.target.checked;
    else return;
    persist();
  });

  // Raccourcis à une touche : désactivables (WCAG 2.1.4) et ignorés quand le focus est
  // sur un autre élément interactif, qui garde son comportement natif. Sur une option,
  // Espace coche nativement et Entrée valide.
  document.addEventListener("keydown", (event) => {
    if (screen !== "quiz" || !settings.shortcuts) return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    if (event.target.closest("a, input, select, textarea, summary, [contenteditable], button:not(.option)")) return;
    const cur = session.current;
    if (event.key === "Enter") {
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
    auto: { next: "light", icon: "◐", label: "auto (système)" },
    light: { next: "dark", icon: "☀", label: "clair" },
    dark: { next: "auto", icon: "☾", label: "sombre" },
  };
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme() {
    const theme = THEMES[settings.theme];
    if (settings.theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", settings.theme);
    // Le nom accessible contient le texte visible (WCAG 2.5.3).
    setHTML(themeToggle, `<span aria-hidden="true">${theme.icon}</span> <span class="sr-only">Thème :</span> ${theme.label}`);
    themeToggle.title = `Thème : ${theme.label}. Cliquer pour passer à « ${THEMES[theme.next].label} »`;
  }

  themeToggle.addEventListener("click", () => {
    settings.theme = THEMES[settings.theme].next;
    persist();
    applyTheme();
  });

  // ---------------------------------------------------------------------------
  // Sons de validation : synthétisés avec la Web Audio API (aucun fichier à charger)
  // ---------------------------------------------------------------------------
  const SOUND_PATTERNS = {
    // Deux notes montantes et claires (do5 → sol5)
    success: { wave: "sine", volume: 0.18, notes: [[523.25, 0, 0.12], [783.99, 0.1, 0.22]] },
    // Deux notes descendantes, plus graves et plus sourdes (mi4 → si♭3)
    failure: { wave: "triangle", volume: 0.22, notes: [[329.63, 0, 0.16], [233.08, 0.14, 0.3]] },
  };

  const sounds = (() => {
    let ctx = null;

    function context() {
      if (!ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        ctx = new AudioContextClass();
      }
      // Les navigateurs suspendent l'audio tant qu'il n'y a pas eu d'interaction.
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      return ctx;
    }

    function play(name) {
      if (!settings.sound) return;
      const pattern = SOUND_PATTERNS[name];
      const audio = context();
      if (!pattern || !audio) return;
      const start = audio.currentTime + 0.01;
      for (const [frequency, offset, duration] of pattern.notes) {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = pattern.wave;
        osc.frequency.value = frequency;
        // Enveloppe courte (attaque 10 ms, extinction exponentielle) pour éviter les clics.
        const t = start + offset;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(pattern.volume, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
        osc.connect(gain).connect(audio.destination);
        osc.start(t);
        osc.stop(t + duration + 0.02);
      }
    }

    return { play, unlock: context };
  })();

  const soundToggle = document.getElementById("sound-toggle");

  function applySound() {
    // Le libellé visible porte l'état (pas d'aria-pressed en plus, qui ferait doublon).
    setHTML(
      soundToggle,
      settings.sound
        ? `<span aria-hidden="true">♪</span> Son activé`
        : `<span aria-hidden="true" class="is-off">♪</span> Son coupé`,
    );
    soundToggle.title = settings.sound ? "Cliquer pour couper le son" : "Cliquer pour activer le son";
  }

  soundToggle.addEventListener("click", () => {
    settings.sound = !settings.sound;
    persist();
    applySound();
    if (settings.sound) sounds.unlock();
  });

  // Prépare l'audio dès la première interaction, pour que le son de fin de chrono
  // (déclenché sans clic) puisse aussi être joué.
  document.addEventListener("pointerdown", () => settings.sound && sounds.unlock(), { once: true });
  document.addEventListener("keydown", () => settings.sound && sounds.unlock(), { once: true });

  applySound();
  applyTheme();
  render();
})();
