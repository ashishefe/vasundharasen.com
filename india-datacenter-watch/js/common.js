// Shared helpers for the redesigned Datacenter Watch pages. Exposes window.DCW.
// Every figure comes from window.INDIA_DC_WATCH (js/data.generated.js).
(function () {
  const data = window.INDIA_DC_WATCH;
  if (!data) {
    document.addEventListener("DOMContentLoaded", () => {
      const main = document.querySelector("#main");
      if (main) main.innerHTML = '<p class="noscript">The data bundle has not been generated. Run <code>python3 scripts/build_dashboard.py</code> from <code>india-datacenter-watch/</code>.</p>';
    });
    return;
  }

  // "none" is a grid filing with no matching project record in the registry.
  const STAGES = ["operational", "under_construction", "announced", "mou_speculative", "none"];
  const stageLabels = {
    operational: "Operational",
    under_construction: "Under construction",
    announced: "Announced",
    mou_speculative: "MoU / speculative",
    none: "Grid filing, no project record yet",
  };
  const stageVar = { operational: "op", under_construction: "uc", announced: "an", mou_speculative: "mou", none: "none" };
  const firmnessLabels = Object.fromEntries((data.firmnessLadder || []).map((f) => [f.key, f.label]));
  // Mirrors GRANTED_STATUSES in scripts/build_dashboard.py.
  const GRANTED = new Set(["granted", "agreement", "commissioned"]);

  const D = data.derived;
  const projectsById = new Map(data.projects.map((p) => [p.id, p]));
  const sourceMap = new Map((data.sources || []).map((s) => [s.id, s]));
  const connById = new Map((data.connectivity || []).map((c) => [c.id, c]));
  // Mirrors INACTIVE_STATUSES in scripts/build_dashboard.py: kept on the record, never counted.
  const UNCOUNTED = new Set(["closed", "under_consideration"]);
  const isCounted = (c) => !UNCOUNTED.has(c.status);
  const filingStatusWord = (c) => ({ closed: "Closed, kept as history", under_consideration: "Under consideration, not counted", applied: "Applied, under process", granted: "Granted", agreement: "Granted, agreement signed", commissioned: "Commissioned" }[c.status] || c.status);
  const activeFilings = (data.connectivity || []).filter(isCounted);
  // Approved summaries ship in the data bundle. Drafts live in a separate file
  // that only the private review sheet loads; public pages never see them.
  const summaries = { ...(window.INDIA_DC_SUMMARY_DRAFTS || {}), ...(data.projectSummaries || {}) };

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const uniq = (ids) => [...new Set(ids)];

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function mw(v) {
    return Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 1 });
  }
  function pct(part, whole) {
    return whole ? Math.round((part / whole) * 100) : 0;
  }
  // Fixed month names: Intl's en-GB short form ("Sept") varies by browser.
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function formatDate(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || "");
    return m ? `${Number(m[3])} ${MONTHS[m[2] - 1].slice(0, 3)} ${m[1]}` : String(v || "");
  }
  function monthName(ym) {
    const [y, m] = ym.split("-");
    return `${MONTHS[m - 1]} ${y}`;
  }
  function shortMonth(ym) {
    const [y, m] = ym.split("-");
    return `${MONTHS[m - 1].slice(0, 3)} ${y}`;
  }
  function stageColor(stage, pale) {
    return cssVar("--st-" + stageVar[stage] + (pale ? "-pale" : ""));
  }
  function swatch(stage, pale) {
    return `<span class="swatch" style="background:${stageColor(stage, pale)}" aria-hidden="true"></span>`;
  }

  // One entry per publisher; a publisher cited more than once gets numbered links.
  function sourceLinks(ids) {
    const groups = new Map();
    uniq(ids || []).map((id) => sourceMap.get(id)).filter(Boolean).forEach((s) => {
      const key = s.publisher || s.label;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(s);
    });
    const parts = [...groups].map(([pub, list]) => list.length === 1
      ? sourceLink(list[0], pub)
      : `<span>${esc(pub)}: ${list.map((s, i) => sourceLink(s, String(i + 1))).join(", ")}</span>`);
    return parts.length ? `<span class="sources">${parts.join(" · ")}</span>` : "";
  }
  function sourceLink(s, text) {
    const url = /^https?:\/\//i.test(s.url || "") ? s.url : "#";
    return `<a href="${esc(url)}" target="_blank" rel="noreferrer" title="${esc(s.label)}">${esc(text)}</a>`;
  }

  // A power-flow date is "declared" only when the register stated it; a bare
  // year is an estimate. Same rule as the old dashboard (js/app.js).
  function flowDateKind(rec) {
    if (rec.dateConfidence === "declared") return "declared";
    if (rec.dateConfidence === "estimated") return "estimated";
    if (rec.dateConfidence === "not_published" || !rec.powerFlowStart) return "not published";
    return String(rec.powerFlowStart).length < 7 ? "estimated" : "declared";
  }

  // ---- per-project figures ------------------------------------------------
  function projectFilings(projectId) {
    return (data.connectivity || []).filter((c) => c.linkedProjectId === projectId);
  }
  // Filing figures use the build's reconciliation (active filings only), so
  // they agree with the Overview ranking and the summary slots.
  function projectFigures(p) {
    const r = (D.reconciliation.projects || []).find((x) => x.projectId === p.id);
    const it = p.capacity && typeof p.capacity.itLoadMw === "number" ? p.capacity.itLoadMw : null;
    return {
      filedMw: r ? r.filedMw : 0,
      grantedMw: r ? r.grantedMw : 0,
      appliedMw: r ? r.filedMw - r.grantedMw : 0,
      filingCount: r ? r.filingCount : 0,
      itLoadMw: it,
      inHeadline: p.includeInHeadline !== false,
    };
  }
  // Filings on the register that no project record links to yet.
  function unlinkedFilings() {
    return activeFilings.filter((c) => !c.linkedProjectId);
  }
  function filingFigures(c) {
    const granted = GRANTED.has(c.status) ? c.quantumMW || 0 : 0;
    return { filedMw: c.quantumMW || 0, grantedMw: granted, appliedMw: (c.quantumMW || 0) - granted };
  }
  function projectHref(id) { return `project.html#${encodeURIComponent(id)}`; }
  function filingHref(id) { return `project.html#filing/${encodeURIComponent(id)}`; }

  // Projects sorted the way the Overview ranks them: filed MW, then announced
  // IT load, then name.
  function sortedProjects() {
    return [...data.projects].sort((a, b) => {
      const fa = projectFigures(a), fb = projectFigures(b);
      return fb.filedMw - fa.filedMw || (fb.itLoadMw || 0) - (fa.itLoadMw || 0) || a.name.localeCompare(b.name);
    });
  }

  // ---- locator map --------------------------------------------------------
  // Shades the state(s) a project sits in. Data names that differ from the map:
  const STATE_ALIAS = { "Delhi NCR": "Delhi" };
  const geo = window.INDIA_GEO_PATHS;
  function mapStates(stateField) {
    if (!geo || !stateField) return [];
    return String(stateField).split("/").map((s) => s.trim()).map((s) => STATE_ALIAS[s] || s)
      .filter((s) => geo.states[s]);
  }
  // Inject the outline once per page as a <symbol>; each card reuses it.
  function ensureIndiaSymbol() {
    if (!geo || document.getElementById("india-outline")) return;
    const holder = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    holder.setAttribute("aria-hidden", "true");
    holder.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    holder.innerHTML = `<symbol id="india-outline" viewBox="${geo.viewBox}">${Object.values(geo.states).map((d) => `<path d="${d}"/>`).join("")}</symbol>`;
    document.body.prepend(holder);
  }
  function locatorMap(stateField, label) {
    if (!geo) return "";
    ensureIndiaSymbol();
    const states = mapStates(stateField);
    const name = states.length ? states.join(" and ") : "location not tied to one state";
    return `<svg class="locator" viewBox="${geo.viewBox}" role="img" aria-label="${esc((label ? label + ": " : "") + name)}">
      <use href="#india-outline" class="locator-base"/>
      ${states.map((s) => `<path class="locator-hit" d="${geo.states[s]}" data-state="${esc(s)}"/>`).join("")}
    </svg>`;
  }
  // Tiny states (Delhi) vanish when shaded, so ring them after layout.
  function ringSmallStates(root = document) {
    qsa(".locator-hit", root).forEach((path) => {
      const box = path.getBBox();
      if (box.width > 18 && box.height > 18) return;
      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("cx", box.x + box.width / 2);
      ring.setAttribute("cy", box.y + box.height / 2);
      ring.setAttribute("r", 16);
      ring.setAttribute("class", "locator-ring");
      path.after(ring);
    });
  }

  // ---- power bars ---------------------------------------------------------
  // Two rows, each scaled against its own measure across the whole tracker,
  // so a card never invites comparing filed MW with announced IT MW.
  function scaleMaxima() {
    const filed = Math.max(1, ...data.projects.map((p) => projectFigures(p).filedMw), ...unlinkedFilings().map((c) => c.quantumMW || 0));
    const it = Math.max(1, ...data.projects.map((p) => projectFigures(p).itLoadMw || 0));
    return { filed, it };
  }
  function powerBars(f, stage, max) {
    const seg = (v, pale, label) => (v > 0
      ? `<span style="width:${(v / max.filed) * 100}%;background:${stageColor(stage, pale)}" title="${mw(v)} MW ${label}"></span>` : "");
    const filed = f.filedMw > 0
      ? `<span class="power-track" role="img" aria-label="${mw(f.filedMw)} MW filed, ${mw(f.grantedMw)} MW granted">${seg(f.grantedMw, false, "granted")}${seg(f.appliedMw, true, "applied")}</span><span class="power-value">${mw(f.filedMw)} MW</span>`
      : `<span class="power-none">no filing in this tracker</span><span></span>`;
    const it = typeof f.itLoadMw === "number"
      ? `<span class="power-track" role="img" aria-label="${mw(f.itLoadMw)} MW announced"><span style="width:${(f.itLoadMw / max.it) * 100}%;background:${stageColor(stage)}"></span></span><span class="power-value">${mw(f.itLoadMw)} MW</span>`
      : `<span class="power-none">not disclosed</span><span></span>`;
    const itRow = f.itLoadMw === undefined ? "" : `<div class="power-row"><span class="power-label">Announced IT</span>${it}</div>`;
    return `<div class="power"><div class="power-row"><span class="power-label">Filed</span>${filed}</div>${itRow}</div>`;
  }

  // ---- weakly evidenced filings -------------------------------------------
  // A filing whose record carries an evidenceCaveat counts in the totals but
  // rests on weaker evidence than a register entry (Oct 2026: Lodha's second
  // 1,500 MW). Every page that shows the filed total says so, in the same words.
  const caveatedFilings = activeFilings.filter((c) => c.evidenceCaveat);
  const caveatMw = caveatedFilings.reduce((t, c) => t + (c.quantumMW || 0), 0);
  function totalCaveat(total) {
    if (!caveatedFilings.length) return "";
    const what = caveatedFilings.map((c) => {
      const p = c.linkedProjectId && projectsById.get(c.linkedProjectId);
      return `${mw(c.quantumMW)} MW for ${p ? p.name.replace(/, ([^,]+)$/, " ($1)") : c.operator || c.applicant}`;
    }).join("; ");
    const one = caveatedFilings.length === 1;
    return `${one ? "One filing" : `${caveatedFilings.length} filings`} in this total, ${what}, ${one ? "comes" : "come"} from a press report; we have found no utility or regulator record for ${one ? "it" : "them"} yet and are checking. Without ${one ? "it" : "them"}, the filed total would be ${mw(total - caveatMw)} MW.`;
  }
  const projectCaveatMw = (projectId) => caveatedFilings.filter((c) => c.linkedProjectId === projectId).reduce((t, c) => t + (c.quantumMW || 0), 0);

  // ---- sources and downloads ---------------------------------------------
  const tierKind = { primary: "Government record", official: "Company page", secondary: "Press or reference" };
  // A spreadsheet file. A leading = + - @ would make a spreadsheet run the
  // cell as a formula, so such text gets a leading apostrophe.
  function downloadCsv(filename, headers, rows) {
    const cell = (v) => {
      let s = String(v ?? "");
      if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return /[",\n\r]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s;
    };
    const csv = [headers.join(",")].concat(rows.map((r) => r.map(cell).join(","))).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  // ---- masthead -----------------------------------------------------------
  function renderMasthead() {
    const asOf = qs("#as-of");
    if (asOf) {
      asOf.textContent = formatDate(data.meta.asOf);
      asOf.setAttribute("datetime", data.meta.asOf);
    }
    const gen = qs("#generated");
    if (gen) {
      gen.textContent = D.generatedAt
        ? `Data last updated ${formatDate(data.meta.asOf)}; this page was built from it on ${formatDate(D.generatedAt.slice(0, 10))}.`
        : "";
    }
  }

  window.DCW = {
    data, D, STAGES, stageLabels, firmnessLabels, GRANTED, projectsById, sourceMap, connById, activeFilings, summaries,
    qs, qsa, cssVar, uniq, esc, mw, pct, formatDate, monthName, shortMonth, stageColor, swatch, sourceLinks, sourceLink,
    flowDateKind, projectFilings, projectFigures, unlinkedFilings, filingFigures, projectHref, filingHref, sortedProjects,
    mapStates, locatorMap, ringSmallStates, renderMasthead, scaleMaxima, powerBars, tierKind, downloadCsv,
    caveatedFilings, caveatMw, totalCaveat, projectCaveatMw, UNCOUNTED, isCounted, filingStatusWord,
  };
})();
