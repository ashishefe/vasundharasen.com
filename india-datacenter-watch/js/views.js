// The Overview's three views: this month (what changed), where things stand (the filed
// and granted stock, ranked), and what's next. overview.js draws the figures, ranking and
// change lists inside the panels; this file adds the tabs, the ranked cards, the month
// strip, the not-counted list and the forward view. Same pattern as India Energy
// Regulation Watch's Overview.
(function () {
  const G = window.DCW;
  if (!G) return;
  const { data, D, qs, qsa, esc, mw, formatDate, sourceLinks, projectHref, filingHref, projectsById, connById } = G;
  const briefs = data.briefs || {};
  const conn = D.connectivity.summary;

  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const short = (v) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || ""); return m ? `${Number(m[3])} ${MON[m[2] - 1]}` : v; };
  const shorten = (t) => (t && t.length > 84 ? t.slice(0, 82).replace(/\s+\S*$/, "") + "…" : t);

  // Edition window: from the previous captured snapshot to this edition's research cut.
  const hist = D.snapshotHistory || [];
  const since = hist.length > 1 ? hist[hist.length - 2].asOf : "";
  const cut = data.meta.researchCut || data.meta.asOf;
  const monthSignals = (data.monthlySignals || []).filter((s) => s.date > since && s.date <= cut).sort((a, b) => a.date.localeCompare(b.date));
  const log = D.changeLog || {};
  const connAdded = (log.connectivity && log.connectivity.added) || [];
  const connMoved = (log.connectivity && log.connectivity.statusChanged) || [];
  // Distinct changes: project and filing changes from the change log, plus dated signals
  // that are not the same event as a new filing (a filing's own signal repeats it).
  const firstWord = (t) => String(t || "").split(/\s+/)[0].toLowerCase();
  const filingWords = new Set(connAdded.map((c) => firstWord(c.operator)));
  const extraSignals = monthSignals.filter((s) => !filingWords.has(firstWord(s.headline)));
  const projectChanges = (log.added || []).length + (log.statusChanged || []).length + (log.mwChanged || []).length;
  const changeCount = projectChanges + connAdded.length + connMoved.length + ((log.connectivity && log.connectivity.quantumChanged) || []).length + extraSignals.length;

  // ---- tabs ---------------------------------------------------------------------
  qs("#num-month").textContent = changeCount;
  qs("#count-month").textContent = since ? `changes between ${short(since)} and ${short(cut)}` : "changes in this edition";
  qs("#num-stand").textContent = mw(conn.totalMW);
  qs("#count-stand").textContent = `MW filed with the grid; ${mw(conn.grantedMW)} MW granted`;
  const forward = (D.connectivity.forward || []);
  const thisYear = String(new Date().getFullYear());
  const dueYears = forward.filter((f) => f.year >= thisYear);
  const lastDue = dueYears[dueYears.length - 1];
  qs("#num-next").textContent = lastDue ? mw(lastDue.cumulativeMW) : "—";
  qs("#count-next").textContent = lastDue ? `MW due to start drawing power by end of ${lastDue.year}, mostly on estimated dates` : "no dated filings";

  const VIEWS = { "this-month": "panel-month", "where-things-stand": "panel-stand", "whats-next": "panel-next" };
  function show(view, focus) {
    if (!VIEWS[view]) view = "this-month";
    qsa("#focus-tabs [role=tab]").forEach((t) => {
      const on = t.dataset.view === view;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    Object.entries(VIEWS).forEach(([v, id]) => {
      const panel = qs("#" + id), was = panel.hidden;
      panel.hidden = v !== view;
      if (was && !panel.hidden) { panel.dispatchEvent(new Event("panelshown")); window.dispatchEvent(new Event("resize")); }
    });
  }
  qsa("#focus-tabs [role=tab]").forEach((t, i, all) => {
    t.addEventListener("click", () => { history.pushState(null, "", "#" + t.dataset.view); show(t.dataset.view); });
    t.addEventListener("keydown", (ev) => {
      const keys = { ArrowRight: (i + 1) % all.length, ArrowLeft: (i - 1 + all.length) % all.length, Home: 0, End: all.length - 1 };
      if (!(ev.key in keys)) return;
      ev.preventDefault();
      const next = all[keys[ev.key]];
      history.replaceState(null, "", "#" + next.dataset.view);
      show(next.dataset.view, true);
    });
  });
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h === "main") { const cur = qs('#focus-tabs [aria-selected="true"]'); return show(cur ? cur.dataset.view : "this-month"); }
    if (VIEWS[h]) return show(h);
    const el = h && document.getElementById(h);
    if (!el) return show("this-month");
    const panel = el.closest(".focus-panel");
    show(Object.keys(VIEWS).find((v) => VIEWS[v] === panel?.id));
    el.scrollIntoView({ block: "start" });
  }

  // ---- ranked cards ---------------------------------------------------------------
  function refHref(ref) {
    if (ref.type === "project") return projectsById.has(ref.id) ? projectHref(ref.id) : null;
    if (ref.type === "filing") return connById.has(ref.id) ? filingHref(ref.id) : null;
    if (ref.type === "policy") return `policy.html#${ref.id}`;
    if (ref.type === "candidate") return `#uncounted-${ref.id}`;
    if (ref.type === "signal") return `#signal-${ref.id}`;
    return null;
  }
  function refLabel(ref) {
    if (ref.type === "project") return projectsById.get(ref.id)?.name;
    if (ref.type === "filing") { const c = connById.get(ref.id); return c ? `${c.operator || c.applicant}, ${mw(c.quantumMW)} MW` : ""; }
    if (ref.type === "signal") return (data.monthlySignals || []).find((s) => s.id === ref.id)?.headline;
    if (ref.type === "candidate") return (data.uncountedCandidates || []).find((c) => c.id === ref.id)?.holder;
    if (ref.type === "policy") return (data.policyWatch || []).find((p) => p.id === ref.id)?.title;
    return "";
  }
  function card(c) {
    const refs = (c.refs || []).filter((r) => refHref(r));
    const [first, ...more] = refs;
    const extra = c.rank === "minor" ? [] : more.slice(0, 2);
    const rest = c.rank === "minor" ? 0 : more.length - extra.length;
    const links = first ? `<a href="${esc(refHref(first))}">${c.rank === "minor" ? "Details" : "Read the record"}</a>${extra.map((r) => ` · <a href="${esc(refHref(r))}" title="${esc(refLabel(r))}">${esc(shorten(refLabel(r)))}</a>`).join("")}${rest > 0 ? ` · and ${rest} more in the record` : ""}` : "";
    return `<article class="card-${esc(c.rank)}">
      <div class="card-main">
        <h3>${esc(c.headline)}</h3>
        <p class="card-fact">${esc(c.fact)}</p>
        <p class="card-meta">${c.date ? `<time datetime="${esc(c.date)}">${formatDate(c.date)}</time>${links ? " · " : ""}` : ""}${links}</p>
      </div>
      ${c.soWhat ? `<div class="card-sowhat"><p class="sowhat-label">So what <span class="tag">Curator’s reading</span></p><p>${esc(c.soWhat)}</p></div>` : ""}
    </article>`;
  }
  function cards(id, items, title) {
    const list = items || [];
    if (!list.length || briefs.editionId !== data.meta.asOf) { qs(id).remove(); return; }
    const by = (r) => list.filter((c) => c.rank === r);
    qs(id).innerHTML = `<h2 class="brief-title">${esc(title)}</h2>
      ${by("lead").map(card).join("")}
      ${by("major").length ? `<div class="card-row">${by("major").map(card).join("")}</div>` : ""}
      ${by("minor").length ? `<div class="card-row card-row-minor">${by("minor").map(card).join("")}</div>` : ""}
      ${briefs.curatorApproved === false ? `<p class="brief-note">The so-what lines are drafted for the curator’s review.</p>` : ""}`;
  }

  // ---- this month: a strip of the month's dated signals ---------------------------------
  function monthStrip() {
    const host = qs("#graphic-month");
    if (!since || !monthSignals.length) { host.remove(); return; }
    const t0 = Date.parse(since), t1 = Date.parse(cut);
    const pos = (d) => Math.min(100, Math.max(0, ((Date.parse(d) - t0) / (t1 - t0)) * 100));
    function draw() {
      const width = (host.clientWidth || 900) - 32, label = 200, gap = 12;
      const lanes = ["above", "below", "above far", "below far"], right = lanes.map(() => -Infinity);
      let used = 1;
      const marks = monthSignals.map((s) => {
        const p = pos(s.date), x = (p / 100) * width;
        const left = p > 80 ? x - label : p < 12 ? x : x - label / 2;
        let lane = lanes.findIndex((_, k) => left > right[k] + gap && (k < 2 || x > right[k - 2] + 4));
        if (lane < 0) lane = right.indexOf(Math.min(...right));
        right[lane] = left + label;
        if (lane >= 2) right[lane - 2] = Math.max(right[lane - 2], x + 4);
        used = Math.max(used, lane + 1);
        return `<a class="mark mark-in-force ${lanes[lane]}${p > 80 ? " edge-r" : p < 12 ? " edge-l" : ""}" style="left:${p}%" href="#signal-${esc(s.id)}"><span class="mark-dot"></span><span class="mark-label"><b>${esc(short(s.date))}</b> ${esc(shorten(s.headline))}</span></a>`;
      }).join("");
      const strip = host.querySelector(".strip");
      strip.className = `strip lanes-${used > 2 ? 4 : 2}`;
      strip.innerHTML = `<div class="strip-axis"></div>${marks}`;
    }
    host.innerHTML = `<div class="strip"></div>
      <ol class="strip-list">${monthSignals.map((s) => `<li><a href="#signal-${esc(s.id)}"><span class="mark-dot mark-in-force"></span><b>${esc(short(s.date))}</b> ${esc(shorten(s.headline))}</a></li>`).join("")}</ol>
      <figcaption>Dated changes in filings, orders and the press between ${formatDate(since)} and ${formatDate(cut)}. New and changed grid filings are listed below.</figcaption>`;
    draw();
    const wide = window.matchMedia("(min-width: 901px)");
    const sync = () => host.querySelectorAll(".strip-list a").forEach((a) => { a.tabIndex = wide.matches ? -1 : 0; a.closest(".strip-list").setAttribute("aria-hidden", String(wide.matches)); });
    sync(); wide.addEventListener("change", sync);
    let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 150); });
    host.closest(".focus-panel").addEventListener("panelshown", draw);
  }

  // ---- where things stand: what is on the record but not counted -------------------------
  function notCounted() {
    const held = (data.connectivity || []).filter((c) => c.status === "under_consideration");
    const cands = data.uncountedCandidates || [];
    if (!held.length && !cands.length) { qs("#not-counted").remove(); return; }
    qs("#uncounted-list").innerHTML = held.map((c) => `<li id="uncounted-${esc(c.id)}"><strong>${esc(c.operator || c.applicant)}: ${mw(c.quantumMW)} MW under consideration</strong> <span class="bar-sub">${esc(c.state || "")} · ${esc(c.notes || "")}</span>${sourceLinks(c.sourceIds)} <a href="${esc(filingHref(c.id))}">Filing page</a></li>`).join("")
      + cands.map((c) => `<li id="uncounted-${esc(c.id)}"><strong>${esc(c.holder)}: ${mw(c.quantumMW)} MW ${esc(c.status || "")}</strong> <span class="bar-sub">${esc([c.location, c.state].filter(Boolean).join(", "))} · ${esc(c.reason)}</span>${sourceLinks(c.sourceIds)}</li>`).join("");
  }

  // ---- what's next: when the filed power is due --------------------------------------------
  function nextView() {
    const host = qs("#graphic-next");
    const rows = forward.filter((f) => f.year >= thisYear);
    const undated = (G.activeFilings || []).filter((c) => !c.powerFlowStart);
    const undatedMw = undated.reduce((t, c) => t + (c.quantumMW || 0), 0);
    if (!rows.length) { host.remove(); return; }
    const max = Math.max(...rows.map((r) => r.cumulativeMW), conn.totalMW, 1);
    host.innerHTML = `<h2 class="brief-title">When the filed power is due</h2>
      <div class="bars forward-bars">${rows.map((r) => `<div class="bridge-bar">
        <span class="bridge-label">By end of ${esc(r.year)}</span>
        <span class="bar-track" role="img" aria-label="${mw(r.cumulativeMW)} MW due by end of ${esc(r.year)}, ${mw(r.cumulativeGrantedMW)} MW of it granted">
          <span class="bar-seg" style="width:${(r.cumulativeGrantedMW / max) * 100}%;background:var(--st-op)"></span>
          <span class="bar-seg" style="width:${((r.cumulativeMW - r.cumulativeGrantedMW) / max) * 100}%;background:var(--st-op-pale)"></span>
        </span>
        <span class="bar-value">${mw(r.cumulativeMW)} MW<span>${mw(r.cumulativeGrantedMW)} granted</span></span>
      </div>`).join("")}</div>
      <figcaption>Cumulative megawatts of counted filings due to start drawing power, by year, from the start dates on the registers (some estimated). ${undated.length ? `${undated.length} filing${undated.length === 1 ? "" : "s"} (${mw(undatedMw)} MW) give no start date and are not shown.` : ""} Dark: granted; pale: applied.</figcaption>`;
    const watch = data.watchlist || [];
    qs("#watch-list").innerHTML = watch.map((w) => `<li><strong>${esc(w.title)}</strong><p>${esc(w.trigger || "")}</p>${w.whyItMatters ? `<p class="analysis"><span class="tag">Analysis</span> ${esc(w.whyItMatters)}</p>` : ""}${sourceLinks(w.sourceIds)}</li>`).join("") || `<li class="empty">Nothing on the watchlist.</li>`;
  }

  // Signal rows in the month panel get ids so card and strip links land on them.
  function tagSignalRows() {
    const items = qsa("#signal-list > li");
    const sorted = (data.monthlySignals || []);
    items.forEach((li) => {
      const s = sorted.find((x) => li.textContent.includes(x.headline.slice(0, 40)));
      if (s && !document.getElementById("signal-" + s.id)) li.id = "signal-" + s.id;
    });
  }

  monthStrip();
  cards("#brief-month", briefs.flow, "What changed, and why it matters");
  cards("#brief-stand", briefs.stock, "Where things stand, and what it means");
  cards("#brief-next", briefs.next, "What is coming, and what to watch");
  notCounted();
  nextView();
  tagSignalRows();
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  route();
})();
