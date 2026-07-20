(function () {
  const data = window.ENERGY_REG_WATCH;
  if (!data) {
    document.body.innerHTML =
      '<main class="error-state"><h1>Dashboard data has not been generated.</h1><p>Run <code>python3 scripts/build_dashboard.py</code> from <code>india-energy-regulation-watch/</code>.</p></main>';
    return;
  }

  // ---- constants -----------------------------------------------------------
  const VERTICAL_ORDER = [
    "Bioenergy", "Green Fuels", "Nuclear", "Coal & Gas",
    "Carbon Markets", "Industrial Policy", "Grid & Load",
  ];
  const sourceMap = new Map((data.sources || []).map((s) => [s.id, s]));
  const trackMap = new Map((data.tracks || []).map((t) => [t.id, t]));

  let activeEditionId = data.derived.latestEditionId || (data.editions[0] || {}).id;
  let activeTrackId = null;
  let sourceClassFilter = "all";
  let pendingSourceFlash = null;

  // ---- helpers -------------------------------------------------------------
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function escapeHtml(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  function formatDate(v) {
    if (!v) return "—";
    const d = new Date(v + "T00:00:00");
    if (Number.isNaN(d.getTime())) return String(v);
    return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  }
  function eventDate(ev) {
    return ev.displayDate ? ev.displayDate : formatDate(ev.date);
  }
  function stageBadge(stage) {
    return `<span class="stage-badge" data-stage="${escapeHtml(stage)}">${escapeHtml(stage)}</span>`;
  }
  function confTag(conf) {
    if (!conf) return "";
    return `<span class="conf-tag" data-conf="${escapeHtml(conf)}">${escapeHtml(conf)}</span>`;
  }
  function analysisBadge() {
    return '<span class="analysis-badge" title="Interpretation, not reported fact">analysis</span>';
  }
  function sourceChips(ids) {
    return (ids || [])
      .map((id) => sourceMap.get(id))
      .filter(Boolean)
      .map(
        (s) =>
          `<button type="button" class="src-chip" data-source-id="${escapeHtml(s.id)}" ` +
          `title="${escapeHtml(s.title + " — " + s.publisher)}">${s.num}</button>`
      )
      .join("");
  }
  function trackEvents(trackId) {
    return (data.events || []).filter((ev) => ev.trackId === trackId);
  }
  function trackWatch(trackId) {
    return (data.watch || []).filter((w) => w.trackId === trackId);
  }
  function dueTag(nextCheck) {
    const today = new Date().toISOString().slice(0, 10);
    let due = "";
    if (nextCheck < today) due = "overdue";
    else {
      const diff = (new Date(nextCheck + "T00:00:00") - new Date(today + "T00:00:00")) / 86400000;
      if (diff <= 14) due = "soon";
    }
    const label = due === "overdue" ? " · due" : due === "soon" ? " · soon" : "";
    return `<span class="watch-due" data-due="${due}">${escapeHtml(formatDate(nextCheck) + label)}</span>`;
  }

  // ---- view switching ------------------------------------------------------
  function setActiveView(name) {
    qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === "view-" + name));
    qsa("[data-view-target]").forEach((b) => b.classList.toggle("is-active", b.dataset.viewTarget === name));
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function openTrack(trackId) {
    activeTrackId = trackId;
    setActiveView("tracks");
    renderTrackGrid();
    renderDossier();
    const dossier = qs("#dossier");
    if (dossier && !dossier.classList.contains("is-hidden")) {
      dossier.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }

  function openSource(sourceId) {
    pendingSourceFlash = sourceId;
    sourceClassFilter = "all";
    const search = qs("#source-search");
    if (search) search.value = "";
    setActiveView("sources");
    renderSources();
  }

  // Event delegation for chips and track links anywhere in the document.
  document.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-source-id]");
    if (chip) { openSource(chip.dataset.sourceId); return; }
    const trackBtn = e.target.closest("[data-track-id]");
    if (trackBtn) { openTrack(trackBtn.dataset.trackId); }
  });

  // ---- header / masthead ---------------------------------------------------
  function renderMasthead() {
    qs("#site-title").textContent = data.site.title;
    qs("#site-byline").textContent = data.site.byline;
    qs("#site-disclaimer").textContent = data.site.disclaimer;
    qs("#generated-at").textContent =
      "Edition " + (activeEditionId || "—") + " · bundle generated " + formatDate((data.derived.generatedAt || "").slice(0, 10));
    document.title = data.site.title;

    const select = qs("#edition-select");
    select.innerHTML = (data.editions || [])
      .map((e) => `<option value="${escapeHtml(e.id)}"${e.id === activeEditionId ? " selected" : ""}>${escapeHtml(e.label)}</option>`)
      .join("");
    select.addEventListener("change", () => {
      activeEditionId = select.value;
      renderBrief();
    });
  }

  // ---- Brief ---------------------------------------------------------------
  function renderBrief() {
    const edition = (data.editions || []).find((e) => e.id === activeEditionId) || {};
    qs("#edition-label").textContent = edition.label || "";
    qs("#brief-title").textContent = data.site.strapline;
    qs("#edition-note").textContent = edition.note || "";

    const editionEvents = (data.events || []).filter((ev) => ev.editionId === activeEditionId);
    const counts = data.derived.counts || {};
    qs("#hero-meta").innerHTML = [
      { k: "Tracks", v: counts.tracks },
      { k: "Moved this edition", v: editionEvents.length },
      { k: "Watch items", v: counts.watch },
      { k: "Sources", v: `${counts.sources} · ${counts.primaryOfficial} official` },
    ]
      .map((c) => `<span class="hero-chip"><span class="k">${escapeHtml(c.k)}</span><span class="v">${escapeHtml(c.v)}</span></span>`)
      .join("");

    // What moved — grouped by vertical, newest first inside each group.
    const byVertical = new Map();
    editionEvents.forEach((ev) => {
      const track = trackMap.get(ev.trackId) || {};
      const vertical = track.vertical || "Other";
      if (!byVertical.has(vertical)) byVertical.set(vertical, []);
      byVertical.get(vertical).push(ev);
    });
    const groups = VERTICAL_ORDER.filter((v) => byVertical.has(v))
      .concat([...byVertical.keys()].filter((v) => !VERTICAL_ORDER.includes(v)));

    qs("#moved-block").innerHTML = groups.length
      ? groups
          .map((vertical) => {
            const evs = byVertical.get(vertical);
            return `
              <div class="moved-group">
                <div class="moved-head"><h3>${escapeHtml(vertical)}</h3><span class="fine-print">${evs.length} development${evs.length === 1 ? "" : "s"}</span></div>
                <div class="moved-grid">${evs.map(eventCard).join("")}</div>
              </div>`;
          })
          .join("")
      : '<p class="empty-note">No developments carried in this edition.</p>';

    // Stage board.
    qs("#stage-board").innerHTML = (data.tracks || [])
      .map((t) => {
        const updated = (t.editionsActive || []).includes(activeEditionId);
        return `
          <button type="button" class="stage-card" data-track-id="${escapeHtml(t.id)}">
            <span class="row1">
              <span class="tag mono">${escapeHtml(t.vertical)}</span>
              <span>${updated ? '<span class="updated-badge">updated</span> ' : ""}${stageBadge(t.stage)}</span>
            </span>
            <h4>${escapeHtml(t.title)}</h4>
            <p class="note">${escapeHtml(t.stageNote)}</p>
          </button>`;
      })
      .join("");
  }

  function eventCard(ev) {
    const track = trackMap.get(ev.trackId) || {};
    return `
      <div class="event-card">
        <div class="event-date">${escapeHtml(eventDate(ev))}</div>
        <div>
          <h4>${escapeHtml(ev.title)}</h4>
          <p class="detail">${escapeHtml(ev.detail)} ${sourceChips(ev.sourceIds)}</p>
          ${ev.significance ? `<p class="significance">${analysisBadge()}${escapeHtml(ev.significance)}</p>` : ""}
          <button type="button" class="event-track-link" data-track-id="${escapeHtml(ev.trackId)}">→ ${escapeHtml(track.title || ev.trackId)}</button>
        </div>
      </div>`;
  }

  // ---- Tracks --------------------------------------------------------------
  function renderTrackGrid() {
    qs("#track-grid").innerHTML = (data.tracks || [])
      .map(
        (t) => `
        <button type="button" class="track-card${t.id === activeTrackId ? " is-active" : ""}" data-track-id="${escapeHtml(t.id)}">
          <span class="meta"><span class="tag mono">${escapeHtml(t.vertical)}</span><span class="tag">${escapeHtml(t.instrument)}</span></span>
          <h4>${escapeHtml(t.title)}</h4>
          <span>${stageBadge(t.stage)}</span>
        </button>`
      )
      .join("");
  }

  function renderDossier() {
    const dossier = qs("#dossier");
    const t = trackMap.get(activeTrackId);
    if (!t) {
      dossier.classList.add("is-hidden");
      dossier.innerHTML = "";
      return;
    }
    dossier.classList.remove("is-hidden");

    const params = t.parameters || [];
    const paramRows = params
      .map(
        (p) => `
        <tr>
          <td><span class="param-label">${escapeHtml(p.label)}</span></td>
          <td>
            <span class="param-value">${escapeHtml(p.value)}</span>
            ${p.note ? `<div class="param-note">${escapeHtml(p.note)}</div>` : ""}
          </td>
          <td>${confTag(p.confidence)}</td>
          <td>${sourceChips(p.sourceIds)}</td>
        </tr>`
      )
      .join("");

    const events = trackEvents(t.id);
    const watch = trackWatch(t.id);
    const allSourceIds = new Set();
    (t.sourceIds || []).forEach((id) => allSourceIds.add(id));
    params.forEach((p) => (p.sourceIds || []).forEach((id) => allSourceIds.add(id)));
    events.forEach((ev) => (ev.sourceIds || []).forEach((id) => allSourceIds.add(id)));
    watch.forEach((w) => (w.sourceIds || []).forEach((id) => allSourceIds.add(id)));
    const fullSources = [...allSourceIds]
      .map((id) => sourceMap.get(id))
      .filter(Boolean)
      .sort((a, b) => a.num - b.num);

    dossier.innerHTML = `
      <div class="dossier-head">
        <div>
          <p class="eyebrow">${escapeHtml(t.vertical)} · ${escapeHtml(t.instrument)}</p>
          <h3>${escapeHtml(t.title)}</h3>
          <div class="meta">${stageBadge(t.stage)}<span class="tag">${escapeHtml(t.stageNote)}</span></div>
        </div>
        <div>${sourceChips(t.sourceIds)}</div>
      </div>
      <p class="dossier-summary">${analysisBadge()}${escapeHtml(t.summary)}</p>
      <div class="who-row">
        ${(t.authorities || []).map((a) => `<span class="tag mono">${escapeHtml(a)}</span>`).join("")}
        ${(t.whoItMoves || []).map((w) => `<span class="tag">moves: ${escapeHtml(w)}</span>`).join("")}
      </div>

      ${params.length ? `
      <div class="dossier-section">
        <h4>Parameters</h4>
        <div class="param-table-wrap">
          <table>
            <thead><tr><th>Parameter</th><th>Value</th><th>Confidence</th><th>Sources</th></tr></thead>
            <tbody>${paramRows}</tbody>
          </table>
        </div>
      </div>` : ""}

      <div class="dossier-section">
        <h4>Event trail — newest first</h4>
        <div class="timeline">${events.length ? events.map(eventCard).join("") : '<p class="empty-note">No events recorded yet.</p>'}</div>
      </div>

      <div class="dossier-section">
        <h4>Open watch items</h4>
        <div class="watch-grid">${watch.length ? watch.map(watchCard).join("") : '<p class="empty-note">No open tripwires for this track.</p>'}</div>
      </div>

      ${(t.crossLinks || []).length ? `
      <div class="dossier-section">
        <h4>Cross-links</h4>
        <div class="crosslink-row">
          ${t.crossLinks.map((c) => `<a href="${escapeHtml(c.href)}">${escapeHtml(c.label)}</a>`).join("")}
        </div>
      </div>` : ""}

      <div class="dossier-section">
        <h4>Sources cited in this dossier</h4>
        <div class="dossier-sources">
          ${fullSources
            .map(
              (s) => `
            <div class="dossier-source-row">
              <button type="button" class="src-chip" data-source-id="${escapeHtml(s.id)}">${s.num}</button>
              <span>${escapeHtml(s.title)}</span>
              <span class="pub">— ${escapeHtml(s.publisher)}, ${escapeHtml(formatDate(s.date))}</span>
            </div>`
            )
            .join("")}
        </div>
      </div>`;
  }

  // ---- Watchlist -----------------------------------------------------------
  function watchCard(w) {
    const track = trackMap.get(w.trackId) || {};
    return `
      <div class="watch-card">
        <div class="trigger-line">${escapeHtml(w.condition)}</div>
        <p class="why">${analysisBadge()}${escapeHtml(w.why)} ${sourceChips(w.sourceIds)}</p>
        <div class="watch-meta">
          <span><span class="k">Register</span><span class="v">${escapeHtml(w.register)}</span></span>
          <span><span class="k">Next check</span>${dueTag(w.nextCheck)}</span>
          <button type="button" class="event-track-link" data-track-id="${escapeHtml(w.trackId)}">→ ${escapeHtml(track.vertical || "")}</button>
        </div>
      </div>`;
  }

  function renderWatchlist() {
    // data.watch is baked pre-sorted by nextCheck ascending.
    qs("#watch-grid").innerHTML = (data.watch || []).map(watchCard).join("");
  }

  // ---- Sources -------------------------------------------------------------
  function renderSourceFilters() {
    const classes = ["all", "primary-official", "secondary-press", "analysis"];
    const countFor = (cls) =>
      cls === "all" ? data.sources.length : data.sources.filter((s) => s.class === cls).length;
    qs("#source-class-filters").innerHTML = classes
      .filter((cls) => countFor(cls) > 0)
      .map(
        (cls) =>
          `<button type="button" class="filter-chip${cls === sourceClassFilter ? " is-active" : ""}" data-class-filter="${cls}">` +
          `${cls === "all" ? "All" : cls}<span class="ct">${countFor(cls)}</span></button>`
      )
      .join("");
    qsa("[data-class-filter]").forEach((b) =>
      b.addEventListener("click", () => {
        sourceClassFilter = b.dataset.classFilter;
        renderSources();
      })
    );
  }

  function renderSources() {
    renderSourceFilters();
    const query = (qs("#source-search").value || "").trim().toLowerCase();
    const rows = (data.sources || []).filter((s) => {
      if (sourceClassFilter !== "all" && s.class !== sourceClassFilter) return false;
      if (!query) return true;
      return [s.id, s.title, s.publisher, s.note].join(" ").toLowerCase().includes(query);
    });
    qs("#source-table").innerHTML = rows
      .map(
        (s) => `
        <tr id="source-row-${escapeHtml(s.id)}">
          <td class="src-num">${s.num}</td>
          <td>
            ${escapeHtml(s.title)}
            ${s.note ? `<div class="src-note">${escapeHtml(s.note)}</div>` : ""}
            <div class="src-note mono">${escapeHtml(s.id)}</div>
          </td>
          <td>${escapeHtml(s.publisher)}</td>
          <td class="src-date">${escapeHtml(formatDate(s.date))}</td>
          <td><span class="class-badge" data-class="${escapeHtml(s.class)}">${escapeHtml(s.class)}</span></td>
          <td><a class="src-out" href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">open ↗</a></td>
        </tr>`
      )
      .join("");
    qs("#source-empty").classList.toggle("is-hidden", rows.length > 0);

    if (pendingSourceFlash) {
      const row = qs("#source-row-" + CSS.escape(pendingSourceFlash));
      pendingSourceFlash = null;
      if (row) {
        row.classList.add("src-flash");
        row.scrollIntoView({ behavior: "auto", block: "center" });
        setTimeout(() => row.classList.remove("src-flash"), 2000);
      }
    }
  }

  // ---- theme ---------------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.classList.toggle("light", theme === "light");
    qs("#icon-sun").classList.toggle("is-hidden", theme === "light");
    qs("#icon-moon").classList.toggle("is-hidden", theme !== "light");
    try { localStorage.setItem("energyregwatch-theme", theme); } catch (e) {}
  }

  // ---- boot ----------------------------------------------------------------
  function boot() {
    renderMasthead();
    renderBrief();
    renderTrackGrid();
    renderDossier();
    renderWatchlist();
    renderSources();

    qsa("[data-view-target]").forEach((b) =>
      b.addEventListener("click", () => setActiveView(b.dataset.viewTarget))
    );
    qs("#theme-toggle").addEventListener("click", () =>
      applyTheme(document.documentElement.classList.contains("light") ? "dark" : "light")
    );
    qs("#source-search").addEventListener("input", renderSources);

    // Sync toggle icon with the pre-paint theme.
    const isLight = document.documentElement.classList.contains("light");
    qs("#icon-sun").classList.toggle("is-hidden", isLight);
    qs("#icon-moon").classList.toggle("is-hidden", !isLight);
  }

  boot();
})();
