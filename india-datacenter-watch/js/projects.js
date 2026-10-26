(function () {
  if (!window.DCW) return;
  const {
    data, stageLabels, qs, qsa, esc, mw, swatch, projectFigures, unlinkedFilings, filingFigures,
    projectHref, filingHref, sortedProjects, locatorMap, ringSmallStates, renderMasthead, scaleMaxima, powerBars, downloadCsv, sourceMap,
  } = window.DCW;

  const VIEW_KEY = "dcw-projects-view";
  // Cards give the overview on a laptop; the list reads better on a phone.
  // A reader's own choice wins and is remembered.
  function initialView() {
    try { const saved = localStorage.getItem(VIEW_KEY); if (saved === "cards" || saved === "list") return saved; } catch (e) {}
    return window.matchMedia("(max-width: 700px)").matches ? "list" : "cards";
  }
  const state = { stage: "all", view: initialView() };
  const max = scaleMaxima();
  const projects = sortedProjects();

  function place(p) {
    const city = p.location?.city;
    const st = p.location?.state;
    return [city && !/not disclosed/i.test(city) && city !== st ? city : null, st].filter(Boolean).join(", ");
  }

  function card(p) {
    const f = projectFigures(p);
    const flag = f.inHeadline ? "" : '<span class="flag">outside the headline</span>';
    return `<li class="card">
      <div class="card-top">
        <div>
          <h3><a href="${esc(projectHref(p.id))}">${esc(p.name)}</a></h3>
          <p class="card-meta">${esc(p.operator)}<br />${esc(place(p))}</p>
          <p class="card-stage">${swatch(p.status)}${esc(stageLabels[p.status])}${flag}</p>
        </div>
        ${locatorMap(p.location?.state, p.name)}
      </div>
      ${powerBars(f, p.status, max)}
    </li>`;
  }

  function listRow(p) {
    const f = projectFigures(p);
    const dash = '<span class="power-none">—</span>';
    return `<tr>
      <td class="list-name"><a href="${esc(projectHref(p.id))}">${esc(p.name)}</a><span>${esc(p.operator)}</span></td>
      <td><span class="list-stage">${swatch(p.status)}${esc(stageLabels[p.status])}</span></td>
      <td>${esc(p.location?.state || "")}</td>
      <td class="num" data-label="Filed">${f.filedMw ? mw(f.filedMw) : dash}</td>
      <td class="num" data-label="Granted">${f.filedMw ? mw(f.grantedMw) : dash}</td>
      <td class="num" data-label="Announced IT">${typeof f.itLoadMw === "number" ? mw(f.itLoadMw) : dash}</td>
    </tr>`;
  }

  function filingCard(c) {
    const f = filingFigures(c);
    return `<li class="card">
      <div class="card-top">
        <div>
          <h3><a href="${esc(filingHref(c.id))}">${esc(c.operator || c.applicant)}</a></h3>
          <p class="card-meta">${esc(c.utility || c.tier || "")}<br />${esc(c.state || "")}</p>
          <p class="card-stage">${swatch("none")}${esc(c.status === "granted" ? "Granted" : "Applied, under process")}</p>
        </div>
        ${locatorMap(c.state, c.operator)}
      </div>
      ${powerBars(f, "none", max)}
    </li>`;
  }

  function render() {
    const shown = projects.filter((p) => state.stage === "all" || p.status === state.stage);
    qs("#dir-count").textContent = state.stage === "all"
      ? `${projects.length} projects, ranked by megawatts filed with the grid, then by announced IT load.`
      : `${shown.length} of ${projects.length} projects: ${stageLabels[state.stage].toLowerCase()}.`;
    qs("#cards").innerHTML = shown.map(card).join("");
    qs("#list-body").innerHTML = shown.map(listRow).join("");
    qs("#cards").classList.toggle("is-hidden", state.view !== "cards");
    qs("#list").classList.toggle("is-hidden", state.view !== "list");
    qsa("[data-stage]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.stage === state.stage)));
    qsa("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === state.view)));
    qs("#bar-note").classList.toggle("is-hidden", state.view !== "cards");
    ringSmallStates(qs("#cards"));
  }

  function renderStatic() {
    renderMasthead();
    const filings = unlinkedFilings();
    const filedProjects = projects.filter((p) => projectFigures(p).filedMw > 0).length;
    const disclosed = projects.filter((p) => typeof projectFigures(p).itLoadMw === "number").length;
    qs("#lede").textContent =
      `${projects.length} data-centre projects, from operating cloud regions to signed MoUs. ${filedProjects} have a grid filing in this tracker and ${disclosed} have disclosed an IT-load figure. The rest have neither in this tracker, including the operating cloud regions, whose size is not disclosed in the sources reviewed.`;
    qs("#bar-note").textContent =
      "Each bar is scaled against its own measure across the tracker: filed bars against the largest filing, announced bars against the largest announcement. A filing covers the whole site; announced IT load covers servers only, so the two bars on a card are not like for like. On filed bars, the dark part is granted and the pale part applied.";
    qs("#filing-cards").innerHTML = filings.map(filingCard).join("");
    ringSmallStates(qs("#filing-cards"));
    qs("#scope-note").textContent = `${projects.length} tracked projects. ${data.meta.scopeNote}`;
  }

  qsa("[data-stage]").forEach((b) => b.addEventListener("click", () => { state.stage = b.dataset.stage; render(); }));
  qsa("[data-view]").forEach((b) => b.addEventListener("click", () => {
    state.view = b.dataset.view;
    try { localStorage.setItem(VIEW_KEY, state.view); } catch (e) {}
    render();
  }));

  // Every project, whatever the filter shows: the file is the whole table.
  function projectsCsv() {
    const rows = projects.map((p) => {
      const f = projectFigures(p);
      return [p.name, p.operator, stageLabels[p.status], p.location?.city || "", p.location?.state || "",
        f.filedMw, f.grantedMw, f.appliedMw, f.filingCount, typeof f.itLoadMw === "number" ? f.itLoadMw : "",
        f.inHeadline ? "yes" : "no", p.lastVerified || "",
        [...new Set((p.sourceIds || []).map((id) => (sourceMap.get(id) || {}).url).filter(Boolean))].join(" | ")];
    });
    downloadCsv(`india-datacenter-watch-projects-${data.meta.asOf}.csv`,
      ["project", "operator", "stage", "city", "state", "filed_mw", "granted_mw", "applied_mw", "filings", "announced_it_mw", "in_headline", "last_verified", "sources"], rows);
  }
  qs("#projects-csv").addEventListener("click", projectsCsv);

  renderStatic();
  render();
})();
