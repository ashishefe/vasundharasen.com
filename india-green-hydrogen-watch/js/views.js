// The Overview's three views: this month (what changed), where things stand (the four
// stage ladders), and what's next (scheduled dates). overview.js draws the ladders, the
// change list and the dates table inside the panels; this file adds the tabs, the ranked
// cards and the two date strips. Same pattern as the other two trackers.
(function () {
  const G = window.GHW;
  if (!G) return;
  const { data, D, P, M, qs, qsa, esc, num, formatDate } = G;
  const briefs = data.briefs || {};
  const edition = data.editions[0];
  const previous = data.editions[1];
  const since = previous ? previous.id : "";
  const cut = edition.researchCut || edition.id;

  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const short = (v) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || ""); return m ? `${Number(m[3])} ${MON[m[2] - 1]} ${m[1]}` : v; };
  const monthOf = (v) => { const m = /^(\d{4})-(\d{2})/.exec(v || ""); return m ? `${MON[m[2] - 1]} ${m[1]}` : v; };
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const editionEvents = data.events.filter((e) => e.editionId === edition.id);
  const inWindow = editionEvents.filter((e) => e.date >= since);
  const mode1 = P.ladders.find((l) => l.id === "mode1");
  const stage = (l, s) => l.stages.find((x) => x.stage === s);

  // Scheduled dates, one per group of awards (as on the dates table).
  const groups = new Map();
  const add = (key, date, label, shown) => { if (date && !groups.has(key)) groups.set(key, { date, label, shown }); };
  M.productionAwards.forEach((r) => add(`p-${r.tranche}`, r.scd, `Production awards, ${G.roman(r.tranche)}`));
  M.electrolyserAwards.forEach((r) => add(`e-${r.tranche}`, r.scd, `Electrolyser factories, ${G.roman(r.tranche)}`));
  // Refinery dates are given only to the month; show them that way.
  (M.refineryAwards || []).forEach((r) => add(`r-${r.refinery}`, r.scd, `Refinery supply: ${r.refinery}`, r.scdLabel || monthOf(r.scd)));
  const dated = [...groups.values()].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = dated.filter((d) => d.date >= today);

  // ---- tabs ---------------------------------------------------------------------
  qs("#num-month").textContent = inWindow.length;
  qs("#count-month").textContent = `new changes since ${short(since)}; ${editionEvents.length - inWindow.length} earlier items added`;
  qs("#num-stand").textContent = num(stage(mode1, "operating").value);
  qs("#count-stand").textContent = `t/yr of hydrogen operating, of ${num(stage(mode1, "awarded").value)} awarded`;
  qs("#num-next").textContent = upcoming.length ? (upcoming[0].shown || short(upcoming[0].date)) : "—";
  qs("#count-next").textContent = upcoming.length ? `next due: ${upcoming[0].label}` : "no dates ahead";

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
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h === "main") { const cur = qs('#focus-tabs [aria-selected="true"]'); return show(cur ? cur.dataset.view : "this-month"); }
    if (VIEWS[h]) return show(h);
    const el = h && document.getElementById(h);
    if (!el) return show("this-month");
    show(Object.keys(VIEWS).find((v) => VIEWS[v] === el.closest(".focus-panel")?.id));
    el.scrollIntoView({ block: "start" });
  }

  // ---- ranked cards ---------------------------------------------------------------
  const eventMap = new Map(data.events.map((e) => [e.id, e]));
  const ladderMap = new Map(P.ladders.map((l) => [l.id, l]));
  function refHref(r) {
    if (r.type === "event") return eventMap.has(r.id) ? `#${r.id}` : null;
    if (r.type === "ladder") return ladderMap.has(r.id) ? `#ladder-${r.id}` : null;
    if (r.type === "link") return r.href;
    return null;
  }
  const refLabel = (r) => (r.type === "event" ? eventMap.get(r.id)?.title : r.type === "ladder" ? ladderMap.get(r.id)?.title : r.label);
  const shorten = (t) => (t && t.length > 60 ? t.slice(0, 58).replace(/\s+\S*$/, "") + "…" : t);
  function card(c) {
    const refs = (c.refs || []).filter((r) => refHref(r));
    const [first, ...more] = refs;
    const extra = c.rank === "minor" ? [] : more.slice(0, 2);
    const rest = c.rank === "minor" ? 0 : more.length - extra.length;
    const links = first ? `<a href="${esc(refHref(first))}">${c.rank === "minor" ? "Details" : "Read the record"}</a>${extra.map((r) => ` · <a href="${esc(refHref(r))}" title="${esc(refLabel(r))}">${esc(shorten(refLabel(r)))}</a>`).join("")}${rest > 0 ? ` · and ${rest} more` : ""}` : "";
    const topic = c.trackId && G.trackMap.get(c.trackId);
    const meta = [c.date ? `<time datetime="${esc(c.date)}">${formatDate(c.date)}</time>` : "", topic ? `<a href="policy.html#${esc(topic.id)}">${esc(topic.title)}</a>` : "", links].filter(Boolean).join(" · ");
    return `<article class="card-${esc(c.rank)}">
      <div class="card-main">
        <h3>${esc(c.headline)}</h3>
        <p class="card-fact">${esc(c.fact)}</p>
        <p class="card-meta">${meta}</p>
      </div>
      ${c.soWhat ? `<div class="card-sowhat"><p class="sowhat-label">So what <span class="tag">Curator’s reading</span></p><p>${esc(c.soWhat)}</p></div>` : ""}
    </article>`;
  }
  function cards(id, items, title) {
    const list = items || [];
    if (!list.length) { qs(id).remove(); return; }
    const by = (r) => list.filter((c) => c.rank === r);
    qs(id).innerHTML = `<h2 class="brief-title">${esc(title)}</h2>
      ${by("lead").map(card).join("")}
      ${by("major").length ? `<div class="card-row">${by("major").map(card).join("")}</div>` : ""}
      ${by("minor").length ? `<div class="card-row card-row-minor">${by("minor").map(card).join("")}</div>` : ""}
      ${briefs.curatorApproved === false ? `<p class="brief-note">The so-what lines are drafted for the curator’s review.</p>` : ""}`;
  }

  // ---- a date strip with labels in lanes that never overlap --------------------------
  function strip(host, start, end, items, caption, listItem) {
    const t0 = Date.parse(start), t1 = Date.parse(end);
    const pos = (d) => Math.min(100, Math.max(0, ((Date.parse(d) - t0) / (t1 - t0)) * 100));
    function draw() {
      const width = (host.clientWidth || 900) - 32, label = 200, gap = 12;
      const lanes = ["above", "below", "above far", "below far"], right = lanes.map(() => -Infinity);
      let used = 1;
      const marks = items.map((m) => {
        const p = pos(m.date), x = (p / 100) * width;
        const left = p > 80 ? x - label : p < 12 ? x : x - label / 2;
        let lane = lanes.findIndex((_, k) => left > right[k] + gap && (k < 2 || x > right[k - 2] + 4));
        if (lane < 0) lane = right.indexOf(Math.min(...right));
        right[lane] = left + label;
        if (lane >= 2) right[lane - 2] = Math.max(right[lane - 2], x + 4);
        used = Math.max(used, lane + 1);
        return `<a class="mark mark-${esc(m.tone)} ${lanes[lane]}${m.hollow ? " hollow" : ""}${p > 80 ? " edge-r" : p < 12 ? " edge-l" : ""}" style="left:${p}%" href="${esc(m.href)}"><span class="mark-dot"></span><span class="mark-label"><b>${esc(m.shown || short(m.date))}</b> ${esc(m.label)}</span></a>`;
      }).join("");
      const s = host.querySelector(".strip");
      s.className = `strip lanes-${used > 2 ? 4 : 2}`;
      s.innerHTML = `<div class="strip-axis"></div>${marks}`;
    }
    host.innerHTML = `<div class="strip"></div>
      <ol class="strip-list">${items.map((m) => `<li><a href="${esc(m.href)}"><span class="mark-dot mark-${esc(m.tone)}${m.hollow ? " hollow" : ""}"></span><b>${esc(m.shown || short(m.date))}</b> ${esc(m.label)}</a></li>`).join("")}</ol>
      <figcaption>${caption}</figcaption>`;
    draw();
    const wide = window.matchMedia("(min-width: 901px)");
    const sync = () => host.querySelectorAll(".strip-list a").forEach((a) => { a.tabIndex = wide.matches ? -1 : 0; a.closest(".strip-list").setAttribute("aria-hidden", String(wide.matches)); });
    sync(); wide.addEventListener("change", sync);
    let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 150); });
    host.closest(".focus-panel").addEventListener("panelshown", draw);
  }

  // This month: when each change added in this edition happened.
  const cardFor = new Map();
  (briefs.flow || []).forEach((c) => { const r = (c.refs || []).find((x) => x.type === "event" && !cardFor.has(x.id)); if (r) cardFor.set(r.id, c.headline); });
  const evs = [...editionEvents].sort((a, b) => a.date.localeCompare(b.date));
  if (evs.length) {
    const first = evs[0].date;
    strip(qs("#graphic-month"), first, cut,
      evs.map((e) => ({ date: e.date, label: cardFor.get(e.id) || shorten(e.title), href: `#${e.id}`, tone: e.date > since ? "in-force" : "pending", hollow: e.date <= since })),
      `When each item in this edition happened. Solid marks fall after the previous edition (${formatDate(since)}); hollow marks are earlier items this edition adds. ${inWindow.length ? "" : `None fell between ${formatDate(since)} and ${formatDate(cut)}.`}`);
  } else qs("#graphic-month").remove();

  // What's next: scheduled dates from a little before today to the last one.
  if (dated.length) {
    const from = new Date(now.getTime() - 120 * 864e5).toISOString().slice(0, 10);
    const shown = dated.filter((d) => d.date >= from);
    strip(qs("#graphic-next"), from, dated[dated.length - 1].date,
      shown.map((d) => ({ date: d.date, shown: d.shown, label: d.label, href: "#deadlines-title", tone: d.date < today ? "pending" : "in-force", hollow: d.date < today })),
      `Scheduled dates for each group of awards, from four months ago to the last one. Hollow marks have passed; the table below says what the record shows for each.`);
  } else qs("#graphic-next").remove();

  cards("#brief-month", briefs.flow, "What changed, and why it matters");
  cards("#brief-stand", briefs.stock, "Where things stand, and what it means");
  cards("#brief-next", briefs.next, "What is coming, and what to watch");
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  route();
})();
