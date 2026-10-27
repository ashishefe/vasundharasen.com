// Overview: three views of the same rules. This month (the flow of changes),
// where things stand (the stock of rules by status), and what's next.
// Each view: a graphic, ranked "so what" cards, then rows that open to detail.
(function () {
  const E = window.ERW;
  if (!E) return;
  const { data, D, qs, qsa, esc, formatDate, eventDate, sourceLinks, tag, statusChip, statusLabels, ruleMap, trackMap, corrections, STATUS_ORDER } = E;

  E.renderMasthead();
  qs("#question").textContent = data.site.strapline;
  qs("#disclaimer").textContent = data.site.disclaimer;

  const edition = data.editions[0];
  const previous = data.editions[1];
  const since = previous ? previous.id : "";
  const cut = edition.researchCut || edition.id;
  const briefs = data.briefs || {};
  const eventMap = new Map(data.events.map((e) => [e.id, e]));
  const editionEvents = data.events.filter((e) => e.editionId === edition.id);
  const inWindow = editionEvents.filter((e) => e.date > since);
  const backfill = editionEvents.filter((e) => e.date <= since);
  const corrected = data.events.filter((e) => (e.corrections || []).some((c) => c.editionId === edition.id));
  const changedRuleIds = new Set(inWindow.map((e) => e.ruleId).filter(Boolean));
  const B = D.ruleBuckets;
  const topicName = (id) => trackMap.get(id)?.title || id;
  const topicShort = (id) => trackMap.get(id)?.vertical || topicName(id);
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const short = (v) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || ""); return m ? `${Number(m[3])} ${MON[m[2] - 1]}` : v; };
  const shorten = (t) => (t && t.length > 46 ? t.slice(0, 44).replace(/\s+\S*$/, "") + "…" : t);

  const now = new Date();
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = ymd(now);
  const steps = data.rules.flatMap((r) => [r.nextStepDate ? { date: r.nextStepDate, step: r.nextStep, r } : null]
    .concat((r.moreSteps || []).map((s) => ({ date: s.date, step: s.step, r }))))
    .filter((x) => x && x.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  // ---- tabs --------------------------------------------------------------------
  qs("#num-month").textContent = inWindow.length;
  qs("#count-month").textContent = `change${inWindow.length === 1 ? "" : "s"} between ${short(since)} and ${short(cut)}`;
  qs("#num-stand").textContent = data.rules.length;
  qs("#count-stand").textContent = `rules: ${B["in force"]} in force, ${B.pending} pending, ${B.ended} ended`;
  qs("#num-next").textContent = steps.length;
  qs("#count-next").textContent = `dated step${steps.length === 1 ? "" : "s"} ahead, plus rules awaited`;
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
      if (was && !panel.hidden) panel.dispatchEvent(new Event("panelshown"));
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
  // A link can point at a view, a change (#evt-… / #corr-evt-…) or a rule (#rule-…): open that view and row.
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h === "main") {
      const current = qs('#focus-tabs [aria-selected="true"]');
      return show(current ? current.dataset.view : "this-month");
    }
    if (VIEWS[h]) return show(h);
    const el = h && document.getElementById(h);
    if (!el) return show("this-month");
    const panel = el.closest(".focus-panel");
    show(Object.keys(VIEWS).find((v) => VIEWS[v] === panel?.id));
    if (el.hidden && el.closest("#stock-rows")) filterStock("");
    if (el.hidden && el.closest("#month-rows")) qs('#month-filter button[data-topic=""]').click();
    const wrap = el.closest("details.trail");
    if (wrap) wrap.open = true;
    const d = el.querySelector("details");
    if (d) d.open = true;
    el.scrollIntoView({ block: "start" });
    const target = el.querySelector("summary, a");
    if (target) target.focus({ preventScroll: true });
  }

  // ---- ranked "so what" cards ---------------------------------------------------
  function refHref(ref) {
    if (ref.type === "event") {
      const e = eventMap.get(ref.id);
      if (!e) return null;
      return editionEvents.includes(e) ? `#${e.id}` : corrected.includes(e) ? `#corr-${e.id}` : `topics.html#${e.trackId}`;
    }
    return ruleMap.has(ref.id) ? `#${ref.id}` : null;
  }
  const refLabel = (ref) => (ref.type === "event" ? eventMap.get(ref.id)?.title : ruleMap.get(ref.id)?.title);
  function card(c) {
    const refs = (c.refs || []).filter((r) => refHref(r));
    const [first, ...more] = refs;
    const extra = c.rank === "minor" ? [] : more.slice(0, 2);
    const rest = c.rank === "minor" ? 0 : more.length - extra.length;
    const meta = `${c.date ? `<time datetime="${esc(c.date)}">${formatDate(c.date)}</time> · ` : ""}${c.trackId ? `<a href="topics.html#${esc(c.trackId)}">${esc(topicShort(c.trackId))}</a>` : "Across topics"}`;
    const links = first ? `<a href="${esc(refHref(first))}">${c.rank === "minor" ? "Details" : "Read the record"}</a>${extra.map((r) => ` · <a href="${esc(refHref(r))}" title="${esc(refLabel(r))}">${esc(shorten(refLabel(r)))}</a>`).join("")}${rest > 0 ? ` · and ${rest} more in the record` : ""}` : "";
    return `<article class="card-${esc(c.rank)}">
      <div class="card-main">
        <h3>${esc(c.headline)}</h3>
        <p class="card-fact">${esc(c.fact)}</p>
        <p class="card-meta">${meta}${links ? ` · ${links}` : ""}</p>
      </div>
      ${c.soWhat ? `<div class="card-sowhat"><p class="sowhat-label">So what <span class="tag">Curator’s reading</span></p><p>${esc(c.soWhat)}</p></div>` : ""}
    </article>`;
  }
  function cards(id, items, title) {
    const list = items || [];
    if (!list.length) { qs(id).remove(); return; }
    const by = (r) => list.filter((c) => c.rank === r);
    const note = briefs.curatorApproved === false ? "The so-what lines are drafted for the curator’s review." : "";
    qs(id).innerHTML = `<h2 class="brief-title">${esc(title)}</h2>
      ${by("lead").map(card).join("")}
      ${by("major").length ? `<div class="card-row">${by("major").map(card).join("")}</div>` : ""}
      ${by("minor").length ? `<div class="card-row card-row-minor">${by("minor").map(card).join("")}</div>` : ""}
      ${note ? `<p class="brief-note">${note}</p>` : ""}`;
  }

  // ---- rows: one change or one rule, opening to its detail --------------------
  function changeRow(e, prefix = "") {
    const rule = e.ruleId && ruleMap.get(e.ruleId);
    return `<li id="${prefix ? prefix + "-" : ""}${esc(e.id)}" data-topic="${esc(e.trackId)}"><details>
      <summary><span class="row-date">${esc(eventDate(e))}</span><span class="row-main"><strong>${esc(e.title)}</strong><span class="row-sub">${esc(topicName(e.trackId))}</span></span><span class="row-status">${rule ? statusChip(rule) : ""}${e.confidence === "reported" && !(rule && rule.basis === "press") ? tag("Press-reported") : ""}</span></summary>
      <div class="row-body">
        <p>${esc(e.detail)}</p>
        ${e.significance ? `<p class="analysis">${tag("Analysis")}${esc(e.significance)}</p>` : ""}
        ${prefix === "corr" ? corrections(e) : ""}
        ${rule ? `<p class="row-link">Rule: <a href="#${esc(rule.id)}">${esc(rule.title)}</a></p>` : ""}
        ${sourceLinks(e.sourceIds)}
      </div></details></li>`;
  }
  function ruleRow(r) {
    const linked = data.events.filter((e) => e.ruleId === r.id).slice(0, 3);
    const linkTo = (e) => (editionEvents.includes(e) ? `#${esc(e.id)}` : `topics.html#${esc(e.trackId)}`);
    return `<li id="${esc(r.id)}" data-topic="${esc(r.trackId)}" data-bucket="${esc(r.bucket)}"><details>
      <summary><span class="row-main"><strong>${esc(r.title)}</strong><span class="row-sub">${esc(topicName(r.trackId))} · ${esc(r.issuer)}</span></span><span class="row-status">${statusChip(r)}${changedRuleIds.has(r.id) ? `<span class="changed">Changed this month</span>` : ""}</span></summary>
      <div class="row-body">
        <p>${esc(r.statusNote)}</p>
        <dl class="params">
          ${r.instrument ? `<div><dt>Instrument</dt><dd>${esc(r.instrument)}</dd></div>` : ""}
          <div><dt>Status since</dt><dd>${r.statusDate ? formatDate(r.statusDate) : "Not stated"}</dd></div>
          <div><dt>Next step</dt><dd>${r.nextStep ? esc(r.nextStep) + (r.nextStepDate ? `, ${formatDate(r.nextStepDate)}` : "") : "None public"}</dd></div>
        </dl>
        ${linked.length ? `<p class="row-link">Latest changes: ${linked.map((e) => `<a href="${linkTo(e)}">${esc(eventDate(e))}: ${esc(e.title)}</a>`).join("; ")}</p>` : ""}
        <p class="row-link"><a href="topics.html#${esc(r.trackId)}">Full topic and history</a></p>
        ${sourceLinks(r.sourceIds)}
      </div></details></li>`;
  }

  // ---- graphic: a date strip with markers ------------------------------------------
  // Labels go in up to four lanes (near and far, above and below the line); each label
  // takes the first lane where it does not overlap the previous label in that lane.
  function strip(id, start, end, items, caption) {
    const host = qs(id);
    const t0 = Date.parse(start), t1 = Date.parse(end);
    const pos = (d) => Math.min(100, Math.max(0, ((Date.parse(d) - t0) / (t1 - t0)) * 100));
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    function draw() {
      const width = (host.clientWidth || 900) - 32, label = 200, gap = 12;
      const lanes = ["above", "below", "above far", "below far"], right = lanes.map(() => -Infinity);
      let used = 1;
      const marks = sorted.map((m) => {
        const p = pos(m.date), x = (p / 100) * width;
        const left = p > 80 ? x - label : p < 12 ? x : x - label / 2;
        // A far label's leader line runs through the near lane, so that lane must be clear at x.
        let lane = lanes.findIndex((_, k) => left > right[k] + gap && (k < 2 || x > right[k - 2] + 4));
        if (lane < 0) lane = right.indexOf(Math.min(...right));
        right[lane] = left + label;
        if (lane >= 2) right[lane - 2] = Math.max(right[lane - 2], x + 4);
        used = Math.max(used, lane + 1);
        return `<a class="mark mark-${esc(m.tone)} ${lanes[lane]}${m.hollow ? " hollow" : ""}${p > 80 ? " edge-r" : p < 12 ? " edge-l" : ""}" style="left:${p}%" href="${esc(m.href)}"><span class="mark-dot"></span><span class="mark-label"><b>${esc(m.shown || short(m.date))}</b> ${esc(m.label)}</span></a>`;
      }).join("");
      host.querySelector(".strip").className = `strip lanes-${used > 2 ? 4 : 2}`;
      host.querySelector(".strip").innerHTML = `<div class="strip-axis"></div>${marks}`;
    }
    host.innerHTML = `<div class="strip"></div>
      <ol class="strip-list">${sorted.map((m) => `<li><a href="${esc(m.href)}"><span class="mark-dot mark-${esc(m.tone)}${m.hollow ? " hollow" : ""}"></span><b>${esc(m.shown || short(m.date))}</b> ${esc(m.label)}</a></li>`).join("")}</ol>
      <figcaption>${caption}</figcaption>`;
    draw();
    // On wide screens the strip's own marks are the links; the list below is its phone layout.
    const wide = window.matchMedia("(min-width: 901px)");
    const syncList = () => host.querySelectorAll(".strip-list a").forEach((a) => { a.tabIndex = wide.matches ? -1 : 0; a.closest(".strip-list").setAttribute("aria-hidden", String(wide.matches)); });
    syncList(); wide.addEventListener("change", syncList);
    let t;
    window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 150); });
    // A hidden panel has no width; draw again when its tab is first shown.
    host.closest(".focus-panel").addEventListener("panelshown", draw);
  }
  const toneOf = (r) => (r ? r.bucket.replace(" ", "-") : "none");

  // ---- This month --------------------------------------------------------------
  // A change's label on the strip is the headline of the card that covers it, if any.
  // Only the first change a card covers carries its headline; others use their own title.
  const cardHeadline = new Map();
  (briefs.flow || []).forEach((c) => { const r = (c.refs || []).find((x) => x.type === "event" && !cardHeadline.has(x.id)); if (r) cardHeadline.set(r.id, c.headline); });
  strip("#graphic-month", since, cut,
    inWindow.map((e) => {
      // An event dated only to a month is drawn hollow at the middle of that month's part of the window.
      const monthOnly = !!e.displayDate && !/\d{1,2} /.test(e.displayDate);
      let date = e.date;
      if (monthOnly) {
        const a = Math.max(Date.parse(e.date.slice(0, 7) + "-01"), Date.parse(since));
        const end = new Date(e.date.slice(0, 7) + "-01"); end.setMonth(end.getMonth() + 1); end.setDate(0);
        const b = Math.min(end.getTime(), Date.parse(cut));
        date = ymd(new Date((a + b) / 2));
      }
      return { date, shown: eventDate(e), hollow: monthOnly, label: cardHeadline.get(e.id) || shorten(e.title), href: `#${e.id}`, tone: toneOf(e.ruleId && ruleMap.get(e.ruleId)) };
    }),
    `Each mark is a change between ${formatDate(since)} and ${formatDate(cut)}. Colour shows the status of the rule it concerns: <span class="key key-in-force"></span>in force <span class="key key-pending"></span>pending. A hollow mark is dated only to the month.`);
  cards("#brief-month", briefs.flow, "What changed, and why it matters");
  const topics = [...new Set(inWindow.map((e) => e.trackId))];
  qs("#month-filter").innerHTML = `<button type="button" data-topic="" aria-pressed="true">All topics</button>` + topics.map((t) => `<button type="button" data-topic="${esc(t)}" aria-pressed="false" title="${esc(topicName(t))}">${esc(topicShort(t))}</button>`).join("");
  qs("#month-rows").innerHTML = inWindow.length ? inWindow.map((e) => changeRow(e)).join("") : `<li class="empty">No changes found in this window.</li>`;
  qsa("#month-filter button").forEach((b) => b.addEventListener("click", () => {
    qsa("#month-filter button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    qsa("#month-rows > li").forEach((li) => { li.hidden = !!b.dataset.topic && li.dataset.topic !== b.dataset.topic; });
  }));
  if (backfill.length) {
    qs("#backfill-summary").textContent = `Earlier changes added in this edition (${backfill.length})`;
    qs("#backfill-rows").innerHTML = backfill.map((e) => changeRow(e)).join("");
  } else qs("#backfill-wrap").remove();
  if (corrected.length) {
    qs("#corrections-summary").textContent = `Corrections to earlier entries (${corrected.length})`;
    qs("#corrections-rows").innerHTML = corrected.map((e) => changeRow(e, "corr")).join("");
  } else qs("#corrections-wrap").remove();

  // ---- Where things stand: one square per rule, a row per topic ---------------------
  const order = (id) => data.tracks.findIndex((t) => t.id === id);
  const sorted = [...data.rules].sort((a, b) => order(a.trackId) - order(b.trackId) || STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
  const RC = D.ruleChanges || { baseline: true };
  qs("#graphic-stand").innerHTML = `<div class="matrix">${data.tracks.map((t) => {
      const rs = sorted.filter((r) => r.trackId === t.id);
      const n = (b) => rs.filter((r) => r.bucket === b).length;
      return `<button type="button" class="matrix-row" data-topic="${esc(t.id)}" aria-pressed="false" aria-label="${esc(t.title)}: ${n("in force")} in force, ${n("pending")} pending, ${n("ended")} withdrawn or concluded, ${rs.filter((r) => changedRuleIds.has(r.id)).length} changed this month. List these rules.">
        <span class="matrix-name">${esc(topicShort(t.id))}</span>
        <span class="matrix-dots">${rs.map((r) => `<span class="dot dot-${r.bucket.replace(" ", "-")}${changedRuleIds.has(r.id) ? " dot-changed" : ""}" title="${esc(r.title)}: ${esc(statusLabels[r.status])}"></span>`).join("")}</span>
        <span class="matrix-count">${n("in force")} in force · ${n("pending")} pending${n("ended") ? ` · ${n("ended")} ended` : ""}</span>
      </button>`;
    }).join("")}</div>
    <figcaption><span class="key key-in-force"></span>${B["in force"]} in force <span class="key key-pending"></span>${B.pending} pending <span class="key key-ended"></span>${B.ended} withdrawn or concluded <span class="key key-changed"></span>changed this month. One square per rule; an outlined square had a change this month. Choose a topic to list its rules. ${RC.baseline ? "This is the first edition with a rule list; from December this caption will also count rules whose status changed." : `Since the previous edition, ${RC.moved.length} rule${RC.moved.length === 1 ? "" : "s"} changed status, ${RC.added.length} were added and ${RC.removed.length} removed.`} <a href="method.html#statuses">What each status means</a>.</figcaption>`;
  cards("#brief-stand", briefs.stock, "Where the rules stand, and what it means");
  qs("#stock-rows").innerHTML = sorted.map(ruleRow).join("");
  function filterStock(topic) {
    let n = 0;
    qsa("#stock-rows > li").forEach((li) => { const on = !topic || li.dataset.topic === topic; li.hidden = !on; if (on) n++; });
    qs("#stock-list-title").textContent = topic ? `${n} rule${n === 1 ? "" : "s"} in ${topicName(topic)}` : `All ${n} rules`;
    qs("#stock-reset").hidden = !topic;
    qsa(".matrix-row").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.topic === topic)));
  }
  qsa(".matrix-row").forEach((b) => b.addEventListener("click", () => {
    filterStock(b.getAttribute("aria-pressed") === "true" ? "" : b.dataset.topic);
    qs("#stock-list-title").scrollIntoView({ block: "start" });
  }));
  qs("#stock-reset").addEventListener("click", () => filterStock(""));
  filterStock("");
  qs("#download-csv").addEventListener("click", () => {
    E.downloadCsv(`india-energy-rules-${edition.id}.csv`, ["Topic", "Rule", "Issuer", "Instrument", "Status", "Status since", "Next step", "Next step date", "Basis", "Changed this month", "Sources"],
      data.rules.map((r) => [topicName(r.trackId), r.title, r.issuer, r.instrument || "", statusLabels[r.status], r.statusDate || "", r.nextStep || "", r.nextStepDate || "", r.basis === "press" ? "Press-reported" : "Official record", changedRuleIds.has(r.id) ? "yes" : "", E.sourceText(r.sourceIds)]));
  });

  // ---- What's next -------------------------------------------------------------------
  const horizon = ymd(new Date(now.getTime() + 60 * 864e5));
  const soon = steps.filter((s) => s.date <= horizon);
  // A week-by-week calendar: dense dates stay readable where a single line would crowd.
  const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weeks = Array.from({ length: 9 }, (_, k) => { const d = new Date(monday); d.setDate(monday.getDate() + 7 * k); return ymd(d); })
    .filter((w) => w <= horizon);
  const weekOf = (date) => weeks.filter((w) => w <= date).pop();
  const busyWeeks = weeks.filter((w) => soon.some((x) => weekOf(x.date) === w));
  // Weeks with no dated step collapse into a narrow marker so gaps in time stay visible.
  const cells = [], cols = [];
  busyWeeks.forEach((w, k) => {
    const prev = busyWeeks[k - 1];
    const skipped = prev ? Math.round((Date.parse(w) - Date.parse(prev)) / (7 * 864e5)) - 1 : 0;
    if (skipped > 0) { cells.push(`<div class="week-gap" title="${skipped} week${skipped === 1 ? "" : "s"} with no dated step"><span>${skipped} wk${skipped === 1 ? "" : "s"} quiet</span></div>`); cols.push("2.4rem"); }
    const items = soon.filter((x) => weekOf(x.date) === w);
    cells.push(`<div class="week"><p class="week-head">Week of ${esc(short(w))}</p>${items.map((x) => `<a class="week-item" href="#${esc(x.r.id)}"><b>${esc(short(x.date))}</b><span class="week-rule">${esc(x.r.title)}</span><span class="week-step">${esc(x.step)}</span></a>`).join("")}</div>`);
    cols.push("minmax(0, 1fr)");
  });
  qs("#graphic-next").innerHTML = `<div class="weeks" style="grid-template-columns:${cols.join(" ")}">${cells.join("")}</div>
    <figcaption>Weeks in the next 60 days that have a dated step, counted from today.${steps.length - soon.length ? ` ${steps.length - soon.length} more steps fall later.` : ""} Some dates are tentative; the rule list says which.</figcaption>`;
  cards("#brief-next", briefs.next, "What is coming, and what to watch");
  const in30 = ymd(new Date(now.getTime() + 30 * 864e5));
  const groups = [["In the next 30 days", steps.filter((s) => s.date <= in30)], ["Later", steps.filter((s) => s.date > in30)]];
  qs("#next-dated").innerHTML = steps.length ? groups.filter(([, list]) => list.length).map(([label, list]) => `<h3 class="group-head">${label}</h3><ol class="timeline">${list.map(({ date, step, r }) => `<li><time datetime="${esc(date)}">${formatDate(date)}</time><div><strong>${esc(step)}</strong><span class="kind"><a href="#${esc(r.id)}">${esc(r.title)}</a> · ${esc(topicName(r.trackId))}</span>${sourceLinks(r.sourceIds)}</div></li>`).join("")}</ol>`).join("") : `<p class="empty">No dated steps ahead on the public record.</p>`;
  const undated = data.rules.filter((r) => ["draft-open", "draft-closed", "awaited", "proposed"].includes(r.status) && !r.nextStepDate && !(r.moreSteps || []).some((s) => s.date >= today));
  qs("#next-undated").innerHTML = undated.map((r) => `<li><div class="row-flat"><span class="row-main"><strong><a href="#${esc(r.id)}">${esc(r.title)}</a></strong><span class="row-sub">${esc(topicName(r.trackId))}${r.nextStep ? ` · Next: ${esc(r.nextStep)}` : ""}</span></span><span class="row-status">${statusChip(r)}</span></div></li>`).join("");

  window.addEventListener("beforeprint", () => qsa(".focus-panel details").forEach((d) => { d.dataset.wasOpen = d.open; d.open = true; }));
  window.addEventListener("afterprint", () => qsa(".focus-panel details").forEach((d) => { d.open = d.dataset.wasOpen === "true"; }));
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  route();
})();
