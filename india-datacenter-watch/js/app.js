(function () {
  const data = window.INDIA_DC_WATCH;
  if (!data) {
    document.body.innerHTML =
      '<main class="error-state"><h1>Dashboard data has not been generated.</h1><p>Run <code>python3 scripts/build_dashboard.py</code> from <code>india-datacenter-watch/</code>.</p></main>';
    return;
  }

  const hasECharts = typeof echarts !== "undefined";

  // ---- constants -----------------------------------------------------------
  const STATUS_KEYS = ["operational", "under_construction", "announced", "mou_speculative"];
  const statusLabels = {
    operational: "Operational",
    under_construction: "Under construction",
    announced: "Announced",
    mou_speculative: "MoU / speculative",
  };
  const statusVar = {
    operational: "--status-op",
    under_construction: "--status-uc",
    announced: "--status-an",
    mou_speculative: "--status-mou",
  };

  const stateAlias = { "Delhi NCR": "Delhi" }; // dashboard name -> topojson st_nm

  const sourceMap = new Map((data.sources || []).map((s) => [s.id, s]));
  const charts = {};
  let activeStatus = "all";
  let stateView = "bars";
  let policyTrack = "all";
  let choroplethDrawn = false;
  let sortKey = "itLoadMw";
  let sortDir = "desc";
  let selectedProjectId = (data.projects[0] || {}).id;
  let gridSortKey = "quantumMW";
  let gridSortDir = "desc";
  let activePersona = null;
  let drillStateName = null;

  // ---- helpers -------------------------------------------------------------
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function escapeHtml(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  function formatDate(v) {
    if (!v) return "Unknown";
    const d = new Date(v + "T00:00:00");
    if (Number.isNaN(d.getTime())) return String(v);
    return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  }
  function formatGenerated(v) {
    if (!v) return "";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(v));
  }
  function num(v, suffix = "") {
    if (v === null || v === undefined || Number.isNaN(Number(v))) return "TBD";
    return Number(v).toLocaleString("en-IN", { maximumFractionDigits: 1 }) + suffix;
  }
  function statusBadge(status) {
    return `<span class="status-badge" data-status="${escapeHtml(status)}">${statusLabels[status] || status}</span>`;
  }
  function sourceLinks(ids) {
    return (ids || []).map((id) => sourceMap.get(id)).filter(Boolean)
      .map((s) => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.label)}</a>`).join("");
  }
  function footLine(sourceIds, note) {
    const pubs = (sourceIds || []).map((id) => sourceMap.get(id)).filter(Boolean).map((s) => s.publisher);
    const uniq = [...new Set(pubs)];
    const src = uniq.length ? "Source: " + uniq.join(", ") : "";
    const asOf = data.meta && data.meta.asOf ? " · As of " + formatDate(data.meta.asOf) : "";
    const n = note ? " · Note: " + note : "";
    return escapeHtml(src + asOf + n);
  }

  // Days since a record was last re-verified; the dashboard flags aging records
  // rather than letting them silently pass as current.
  function ageDays(iso) {
    if (!iso) return null;
    const then = new Date(iso + "T00:00:00").getTime();
    if (Number.isNaN(then)) return null;
    return Math.floor((Date.now() - then) / 86400000);
  }
  function staleDot(iso) {
    const age = ageDays(iso);
    if (age === null || age <= 60) return "";
    const level = age > 120 ? "red" : "amber";
    return `<span class="stale-dot" data-age="${level}" title="Last verified ${escapeHtml(formatDate(iso))} — ${age} days ago"></span>`;
  }

  // A power-flow date is only "declared" when the register stated it; a bare
  // year is an estimate and is rendered as one.
  function isEstimatedDate(rec) {
    if (rec.dateConfidence === "declared") return false;
    if (rec.dateConfidence === "estimated") return true;
    return String(rec.powerFlowStart || "").length < 7;
  }

  // How many of these records cite at least one primary (government) source.
  function primaryCount(records) {
    return (records || []).filter((r) =>
      (r.sourceIds || []).some((id) => (sourceMap.get(id) || {}).tier === "primary")
    ).length;
  }

  function exportCsv(filename, headers, rows) {
    const cell = (v) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s;
    };
    const csv = [headers.join(",")].concat(rows.map((r) => r.map(cell).join(","))).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  // ---- ECharts theme (read live from active CSS variables) -----------------
  function palette() {
    return {
      fg: cssVar("--fg"), muted: cssVar("--muted"), faint: cssVar("--faint"),
      grid: cssVar("--grid"), zero: cssVar("--zero-line"),
      border: cssVar("--border-strong"), surface2: cssVar("--surface-2"),
      op: cssVar("--status-op"), uc: cssVar("--status-uc"), an: cssVar("--status-an"), mou: cssVar("--status-mou"),
      primary: cssVar("--primary"), pos: cssVar("--pos"), neg: cssVar("--neg"),
    };
  }
  function statusColor(p, key) {
    return { operational: p.op, under_construction: p.uc, announced: p.an, mou_speculative: p.mou }[key];
  }
  function baseAxisLabel(p) { return { color: p.muted, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }; }
  function tooltipBase(p) {
    return {
      backgroundColor: p.surface2, borderColor: p.border, borderWidth: 1,
      textStyle: { color: p.fg, fontSize: 12 }, extraCssText: "border-radius:6px;",
    };
  }
  function mount(id) {
    if (!hasECharts) { const el = qs("#" + id); if (el) el.innerHTML = '<p class="change-empty">Charts need the ECharts library (CDN). Connect to the internet and reload.</p>'; return null; }
    const el = qs("#" + id);
    if (!el) return null;
    if (charts[id]) charts[id].dispose();
    charts[id] = echarts.init(el, null, { renderer: "canvas" });
    return charts[id];
  }

  // ---- shell ---------------------------------------------------------------
  function renderShell() {
    qs("#as-of-date").textContent = formatDate(data.meta.asOf);
    qs("#scope-note").textContent = data.meta.scopeNote || "";
    qs("#generated-at").textContent = "Data bundle generated " + formatGenerated(data.derived.generatedAt);
  }

  function renderHeroChips() {
    const d = data.derived;
    const gc = data.gridContext || {};
    const conn = (d.connectivity || {}).summary || {};
    const peak = gc.nationalPeakMW;
    const pctConn = peak && conn.totalMW ? ((conn.totalMW / peak) * 100).toFixed(1) : null;
    const vz = gc.vizagExample || {};
    const chips = [
      conn.totalMW ? { k: "Filed grid connectivity", v: num(conn.totalMW), s: "MW · " + num(conn.grantedMW) + " granted" } : null,
      { k: "Tracked IT load (press)", v: num(d.headlineKnownCapacityMw), s: "MW IT" },
      pctConn ? { k: "DC ask vs national peak", v: pctConn + "%", s: "of " + num(Math.round(peak / 1000)) + " GW" } : null,
      vz.pctOfApPeakGridAsk ? { k: "Vizag grid ask", v: vz.pctOfApPeakGridAsk + "%", s: "of AP peak" } : null,
      { k: "Tracked projects", v: String(data.projects.length), s: d.unknownCapacityProjects + " MW-undisclosed" },
    ].filter(Boolean);
    qs("#hero-chips").innerHTML = chips.map((c) =>
      `<div class="hero-chip"><span class="k">${escapeHtml(c.k)}</span><span class="v">${escapeHtml(c.v)} <small>${escapeHtml(c.s)}</small></span></div>`
    ).join("");
  }

  // ---- KPI cards -----------------------------------------------------------
  function svgSpark(values, color) {
    const v = values.filter((x) => typeof x === "number");
    if (v.length < 2) return "";
    const w = 96, h = 26, min = Math.min(...v), max = Math.max(...v), span = max - min || 1;
    const pts = v.map((y, i) => `${(i / (v.length - 1)) * w},${h - ((y - min) / span) * (h - 4) - 2}`).join(" ");
    return `<svg class="m-spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true">
      <polyline points="${pts}" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`;
  }
  function deltaChip(curr, prev, unit) {
    if (typeof prev !== "number" || typeof curr !== "number") return "";
    const diff = curr - prev;
    const dir = diff > 0.5 ? "up" : diff < -0.5 ? "down" : "flat";
    const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "■";
    return `<span class="delta-chip" data-dir="${dir}">${arrow} ${num(Math.abs(diff))}${unit || ""}</span>`;
  }
  function renderMetrics() {
    const d = data.derived, gc = data.gridContext || {};
    const conn = (d.connectivity || {}).summary || {};
    const tl = d.timeline || [];
    const headlineSeries = tl.map((m) => m.headlineCumulativeMw);
    const last = headlineSeries[headlineSeries.length - 1];
    const ago = headlineSeries.length > 4 ? headlineSeries[headlineSeries.length - 4] : headlineSeries[0];
    const peakGw = gc.nationalPeakMW ? Math.round(gc.nationalPeakMW / 1000) : null;
    const share = gc.dcShareOfElectricity || {};
    const p = palette();
    const connPrimary = primaryCount(data.connectivity || []);
    const connBadge = conn.count
      ? `<span class="prov-badge" data-prov="${connPrimary === conn.count ? "primary" : "media"}">${connPrimary === conn.count ? "✓ All primary filings" : connPrimary + "/" + conn.count + " primary"}</span>`
      : "";
    const cards = [
      {
        label: "Filed grid connectivity", value: num(conn.totalMW || 0), unit: "MW",
        foot: `${connBadge}<span class="m-note">${num(conn.grantedMW || 0)} granted · ${num(conn.appliedMW || 0)} applied — the headline load figure</span>`,
      },
      {
        label: "Tracked IT load", value: num(d.headlineKnownCapacityMw), unit: "MW",
        spark: svgSpark(headlineSeries, p.uc),
        foot: `<span class="prov-badge" data-prov="media">Press-derived</span>` + deltaChip(last, ago, " MW") + `<span class="m-note">vs 3 mo ago (reconstructed)</span>`,
      },
      {
        label: "Sharpest grid ask", value: (gc.vizagExample ? gc.vizagExample.pctOfApPeakGridAsk : "—") + "%", unit: "of AP peak",
        foot: `<span class="m-note">Google Vizag ~2.1 GW grid ask vs Andhra ${num(((gc.statePeakMW || {})["Andhra Pradesh"] || {}).peakMW)} MW peak</span>`,
      },
      {
        label: "DC share of power", value: (share.y2024Pct || "—") + "%", unit: "→ " + (share.y2030Pct || "—") + "% by 2030",
        foot: `<span class="m-note">National datacenter electricity share${peakGw ? "; peak now " + peakGw + " GW" : ""}</span>`,
      },
    ];
    qs("#metric-rack").innerHTML = cards.map((c) => `
      <article class="metric">
        <span class="m-label">${escapeHtml(c.label)}</span>
        <span class="m-value">${escapeHtml(c.value)}<small>${escapeHtml(c.unit || "")}</small></span>
        ${c.spark || ""}
        <span class="m-foot">${c.foot || ""}</span>
      </article>`).join("");
  }

  // ---- change log + signals ------------------------------------------------
  function renderChangeBlock() {
    const cl = data.derived.changeLog || {};
    const el = qs("#change-block");
    if (!cl.previousMonth) {
      el.innerHTML = `<p class="change-empty">First tracked snapshot (${escapeHtml((data.meta.asOf || "").slice(0, 7))}). Month-over-month changes (new projects, stage moves, MW revisions) will appear here from the next refresh.</p>`;
      return;
    }
    const rows = [];
    (cl.added || []).forEach((p) => rows.push(`<div class="change-row"><span class="tag" style="color:var(--status-op)">NEW</span><div><strong>${escapeHtml(p.name)}</strong> <span class="td-note">${escapeHtml(statusLabels[p.status] || p.status)}${p.itLoadMw ? " · " + num(p.itLoadMw, " MW") : ""}</span></div></div>`));
    (cl.statusChanged || []).forEach((c) => rows.push(`<div class="change-row"><span class="tag" style="color:var(--status-uc)">MOVED</span><div><strong>${escapeHtml(c.name)}</strong> <span class="td-note">${escapeHtml(statusLabels[c.from] || c.from)} → ${escapeHtml(statusLabels[c.to] || c.to)}</span></div></div>`));
    (cl.mwChanged || []).forEach((c) => rows.push(`<div class="change-row"><span class="tag" style="color:var(--status-an)">MW</span><div><strong>${escapeHtml(c.name)}</strong> <span class="td-note">${num(c.from, " MW")} → ${num(c.to, " MW")}</span></div></div>`));
    const cc = cl.connectivity || {};
    (cc.added || []).forEach((r) => rows.push(`<div class="change-row"><span class="tag" style="color:var(--status-op)">FILED</span><div><strong>${escapeHtml(r.operator || r.id)}</strong> <span class="td-note">new grid filing · ${num(r.quantumMW, " MW")} (${escapeHtml(r.status || "")})</span></div></div>`));
    (cc.statusChanged || []).forEach((r) => rows.push(`<div class="change-row"><span class="tag" style="color:var(--status-uc)">GRID</span><div><strong>${escapeHtml(r.operator || r.id)}</strong> <span class="td-note">filing ${escapeHtml(r.from || "")} → ${escapeHtml(r.to || "")}</span></div></div>`));
    (cc.quantumChanged || []).forEach((r) => rows.push(`<div class="change-row"><span class="tag" style="color:var(--status-an)">MW</span><div><strong>${escapeHtml(r.operator || r.id)}</strong> <span class="td-note">quantum ${num(r.from, " MW")} → ${num(r.to, " MW")}</span></div></div>`));
    el.innerHTML = `<p class="fine-print" style="margin-bottom:8px">Since ${escapeHtml(cl.previousMonth)}</p>` + (rows.length ? rows.join("") : `<p class="change-empty">No registry changes vs ${escapeHtml(cl.previousMonth)}.</p>`);
  }
  function renderSignals() {
    const sorted = [...(data.monthlySignals || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    qs("#monthly-signals").innerHTML = sorted.map((s) => `
      <article class="signal-card">
        <div><div class="signal-date">${escapeHtml(formatDate(s.date))}</div><span class="tag" style="margin-top:6px">${escapeHtml(s.type)}</span></div>
        <div><h4>${escapeHtml(s.headline)}</h4><p>${escapeHtml(s.whyItMatters)}</p><div class="source-links">${sourceLinks(s.sourceIds)}</div></div>
      </article>`).join("");
  }
  function renderImplications() {
    qs("#implication-list").innerHTML = (data.implications || []).map((i) => `
      <article class="mini-card">
        <span class="severity-badge" data-severity="${escapeHtml(i.severity)}">${escapeHtml(i.severity)} signal</span>
        <h4 style="margin-top:8px">${escapeHtml(i.title)}</h4>
        <p>${escapeHtml(i.resolvedDetail || i.detail)}</p>
      </article>`).join("");
  }

  // ---- watchlist (tripwires) -----------------------------------------------
  function renderWatchlist() {
    const items = data.watchlist || [];
    const head = qs("#watchlist-head"), list = qs("#watchlist-list");
    if (!items.length) { head.classList.add("is-hidden"); list.classList.add("is-hidden"); return; }
    head.classList.remove("is-hidden"); list.classList.remove("is-hidden");
    const sevRank = { high: 0, medium: 1, low: 2 };
    const asOf = data.meta && data.meta.asOf;
    const sorted = [...items].filter((w) => w.status !== "retired").sort((a, b) =>
      (sevRank[a.severity] ?? 9) - (sevRank[b.severity] ?? 9) || String(a.nextCheck || "9999").localeCompare(String(b.nextCheck || "9999")));
    list.innerHTML = sorted.map((w) => {
      const overdue = w.nextCheck && asOf && w.nextCheck < asOf;
      const check = w.checkUrl
        ? `<a href="${escapeHtml(w.checkUrl)}" target="_blank" rel="noreferrer">${escapeHtml(w.checkWhere || "Check register")}</a>`
        : `<span class="m-note">${escapeHtml(w.checkWhere || "")}</span>`;
      return `
      <article class="watch-card" data-status="${escapeHtml(w.status || "armed")}">
        <div class="policy-meta">
          <span class="severity-badge" data-severity="${escapeHtml(w.severity)}">${escapeHtml(w.severity)}</span>
          ${w.status === "tripped" ? '<span class="tag" style="color:var(--status-mou)">TRIPPED</span>' : ""}
        </div>
        <h4>${escapeHtml(w.title)}</h4>
        <div class="trigger-line">${escapeHtml(w.trigger || "")}</div>
        <p>${escapeHtml(w.resolvedDetail || w.whyItMatters || "")}</p>
        <div class="watch-meta">
          <span class="k">Where</span>${check}
          ${w.nextCheck ? `<span class="k">Next check</span><span class="watch-due" data-due="${overdue ? "overdue" : "ok"}">${escapeHtml(formatDate(w.nextCheck))}${overdue ? " · due" : ""}</span>` : ""}
        </div>
      </article>`;
    }).join("");
  }

  // ---- persona takeaways -----------------------------------------------------
  const PERSONA_ORDER = ["grid-planner", "developer-investor", "clean-power-buyer"];
  function renderPersonas() {
    const items = data.personaTakeaways || [];
    const head = qs("#persona-head"), list = qs("#persona-list");
    if (!items.length) { head.classList.add("is-hidden"); list.classList.add("is-hidden"); return; }
    head.classList.remove("is-hidden"); list.classList.remove("is-hidden");
    const personas = [...new Set(items.map((t) => t.persona))].sort(
      (a, b) => (PERSONA_ORDER.indexOf(a) < 0 ? 99 : PERSONA_ORDER.indexOf(a)) - (PERSONA_ORDER.indexOf(b) < 0 ? 99 : PERSONA_ORDER.indexOf(b)));
    if (!activePersona || !personas.includes(activePersona)) activePersona = personas[0];
    const labelOf = (p) => (items.find((t) => t.persona === p) || {}).personaLabel || p;
    qs("#persona-toggle").innerHTML = personas.map((p) =>
      `<button type="button" data-persona="${escapeHtml(p)}" class="${p === activePersona ? "is-active" : ""}">${escapeHtml(labelOf(p))}</button>`).join("");
    qsa("[data-persona]").forEach((b) => b.addEventListener("click", () => { activePersona = b.dataset.persona; renderPersonas(); }));
    list.innerHTML = items.filter((t) => t.persona === activePersona).map((t) => `
      <article class="persona-card">
        <h4>${escapeHtml(t.title)}</h4>
        <p>${escapeHtml(t.resolvedDetail || t.detail || "")}</p>
        ${t.sourceIds && t.sourceIds.length ? `<div class="source-links">${sourceLinks(t.sourceIds)}</div>` : ""}
      </article>`).join("");
  }
  function renderBaseline() {
    qs("#baseline-list").innerHTML = (data.nationalBaseline || []).map((b) => `
      <article class="mini-card">
        <span class="baseline-value">${escapeHtml(b.value)}</span>
        <h4>${escapeHtml(b.metric)}</h4>
        <p>${escapeHtml(b.detail)}</p>
        <div class="tag-row"><span class="tag">${escapeHtml(b.quality)}</span><span class="tag">${escapeHtml(formatDate(b.date))}</span></div>
        <div class="source-links">${sourceLinks(b.sourceIds)}</div>
      </article>`).join("");
  }

  // ---- charts --------------------------------------------------------------
  function chartFunnel() {
    const c = mount("chart-funnel"); if (!c) return;
    const p = palette(); const cap = data.derived.capacityByStatusMw || {};
    c.setOption({
      grid: { left: 8, right: 16, top: 8, bottom: 28, containLabel: false },
      tooltip: { trigger: "item", ...tooltipBase(p), valueFormatter: (v) => num(v, " MW") },
      legend: { bottom: 0, textStyle: { color: p.muted, fontSize: 11 }, itemWidth: 10, itemHeight: 10, icon: "roundRect" },
      xAxis: { type: "value", show: false, max: "dataMax" },
      yAxis: { type: "category", data: ["Tracked load"], show: false },
      series: STATUS_KEYS.map((k) => ({
        name: statusLabels[k], type: "bar", stack: "t", barWidth: 54,
        itemStyle: { color: statusColor(p, k) },
        label: { show: (cap[k] || 0) > 50, color: "#0A0C10", fontFamily: "'IBM Plex Mono'", fontWeight: 600, formatter: (o) => num(o.value) },
        data: [cap[k] || 0],
      })),
    });
    qs("#foot-funnel").innerHTML = footLine([], "MW = disclosed IT-load megawatts. ~20% of planned DC projects globally are at risk of delay (IEA).");
  }

  function chartTimeline() {
    const c = mount("chart-timeline"); if (!c) return;
    const p = palette(); const tl = data.derived.timeline || [];
    const months = tl.map((m) => m.month);
    c.setOption({
      grid: { left: 52, right: 18, top: 28, bottom: 26 },
      tooltip: { trigger: "axis", ...tooltipBase(p), axisPointer: { type: "line", lineStyle: { color: p.zero } }, valueFormatter: (v) => num(v, " MW") },
      legend: { top: 0, textStyle: { color: p.muted, fontSize: 11 }, itemWidth: 10, itemHeight: 10, icon: "roundRect" },
      xAxis: { type: "category", data: months, boundaryGap: false, axisLine: { lineStyle: { color: p.border } }, axisLabel: baseAxisLabel(p), axisTick: { show: false } },
      yAxis: { type: "value", name: "MW IT load", nameTextStyle: { color: p.faint, fontSize: 10 }, splitLine: { lineStyle: { color: p.grid } }, axisLabel: baseAxisLabel(p) },
      series: STATUS_KEYS.map((k) => ({
        name: statusLabels[k], type: "line", stack: "t", areaStyle: { opacity: 0.55 }, symbol: "none", smooth: false,
        lineStyle: { width: 1 }, itemStyle: { color: statusColor(p, k) }, emphasis: { focus: "series" },
        data: tl.map((m) => (m.byCurrentStatusMw || {})[k] || 0),
      })),
    });
    qs("#foot-timeline").innerHTML = footLine([], "Reconstructed from each project's earliest source date — directional history, not a live measured series.");
  }

  function chartForecast() {
    const c = mount("chart-forecast"); if (!c) return;
    const p = palette(); const band = (data.gridContext || {}).dcForecastBand || [];
    const rows = band.map((b) => ({ name: b.analyst + " · " + b.year, gw: b.gw, low: b.low, high: b.high }));
    const trackedGw = (data.derived.headlineKnownCapacityMw || 0) / 1000;
    c.setOption({
      grid: { left: 8, right: 56, top: 10, bottom: 28, containLabel: true },
      tooltip: { trigger: "item", ...tooltipBase(p), formatter: (o) => {
        const r = rows[o.dataIndex];
        return `<b>${escapeHtml(r.name)}</b><br/>${num(r.gw)} GW${r.low ? " (range " + r.low + "–" + r.high + ")" : ""}`;
      } },
      xAxis: { type: "value", name: "GW datacenter capacity", nameLocation: "middle", nameGap: 30, nameTextStyle: { color: p.faint, fontSize: 10 }, splitLine: { lineStyle: { color: p.grid } }, axisLabel: baseAxisLabel(p) },
      yAxis: { type: "category", data: rows.map((r) => r.name), inverse: true, axisLine: { lineStyle: { color: p.border } }, axisLabel: { color: p.muted, fontSize: 11 }, axisTick: { show: false } },
      series: [{
        type: "bar", barWidth: 14, itemStyle: { color: p.primary, borderRadius: [0, 3, 3, 0] },
        label: { show: true, position: "right", color: p.fg, fontFamily: "'IBM Plex Mono'", fontSize: 11, formatter: (o) => num(o.value) + " GW" },
        markLine: {
          symbol: "none", silent: true,
          lineStyle: { color: p.an, type: "dashed", width: 1.5 },
          label: { color: p.an, fontSize: 10, formatter: "Tracked today ~" + trackedGw.toFixed(1) + " GW", position: "insideEndTop" },
          data: [{ xAxis: trackedGw }],
        },
        data: rows.map((r) => r.gw),
      }],
    });
    qs("#foot-forecast").innerHTML = footLine(["ceew-systemiq-dc", "dc-forecast-sp"], "Total India datacenter capacity (all uses), not AI-only. Dashed line = currently tracked firm pipeline.");
  }

  function statesForChart() {
    return (data.derived.stateDemand || []).filter((s) => s.knownItLoadMw > 0).sort((a, b) => a.knownItLoadMw - b.knownItLoadMw);
  }
  function chartState() {
    const c = mount("chart-state"); if (!c) return;
    const p = palette(); const rows = statesForChart();
    const peaks = (data.gridContext || {}).statePeakMW || {};
    c.setOption({
      grid: { left: 8, right: 64, top: 28, bottom: 26, containLabel: true },
      tooltip: { trigger: "axis", ...tooltipBase(p), axisPointer: { type: "shadow" }, formatter: (items) => {
        const st = items[0].axisValue; const peak = peaks[st];
        let s = `<b>${escapeHtml(st)}</b>`;
        let total = 0;
        items.forEach((it) => { if (it.value) { s += `<br/>${it.marker}${it.seriesName}: ${num(it.value, " MW")}`; total += it.value; } });
        if (peak && peak.peakMW) s += `<br/><span style="color:${p.faint}">= ${((total / peak.peakMW) * 100).toFixed(1)}% of state peak (${num(peak.peakMW)} MW)</span>`;
        return s;
      } },
      legend: { top: 0, data: STATUS_KEYS.map((k) => statusLabels[k]), textStyle: { color: p.muted, fontSize: 11 }, itemWidth: 10, itemHeight: 10, icon: "roundRect" },
      xAxis: { type: "value", name: "MW IT load", nameTextStyle: { color: p.faint, fontSize: 10 }, splitLine: { lineStyle: { color: p.grid } }, axisLabel: baseAxisLabel(p) },
      yAxis: { type: "category", data: rows.map((r) => r.state), axisLine: { lineStyle: { color: p.border } }, axisLabel: { color: p.muted, fontSize: 11 }, axisTick: { show: false } },
      series: STATUS_KEYS.map((k, idx) => ({
        name: statusLabels[k], type: "bar", stack: "t", itemStyle: { color: statusColor(p, k) },
        label: idx === STATUS_KEYS.length - 1 ? { show: false } : { show: false },
        data: rows.map((r) => (r.byStatusMw || {})[k] || 0),
      })).concat([{
        name: "total", type: "bar", stack: "t", silent: true, itemStyle: { color: "transparent" }, tooltip: { show: false },
        label: { show: true, position: "right", color: p.muted, fontFamily: "'IBM Plex Mono'", fontSize: 11, formatter: (o) => num(rows[o.dataIndex].knownItLoadMw) },
        data: rows.map(() => 0),
      }]),
    });
    c.off("click");
    c.on("click", (params) => { if (params.name) renderStateDrill(params.name); });
    qs("#foot-state").innerHTML = footLine(["ap-state-peak", "state-peaks-crea"], "Hover for share of state peak; click a state for its full picture. Unknown-capacity projects are excluded from MW.");
  }

  function chartStateShare() {
    const c = mount("chart-state-share"); if (!c) return;
    const p = palette();
    const rows = (data.derived.stateShareOfPeak || []).slice().reverse();
    c.setOption({
      grid: { left: 8, right: 76, top: 28, bottom: 26, containLabel: true },
      tooltip: { trigger: "axis", ...tooltipBase(p), axisPointer: { type: "shadow" }, formatter: (items) => {
        const r = (data.derived.stateShareOfPeak || []).find((x) => x.state === items[0].axisValue);
        if (!r) return items[0].axisValue;
        return `<b>${escapeHtml(r.state)}</b><br/>Peak demand: ${num(r.peakMW, " MW")}` +
          `<br/>Firm IT load: ${num(r.itLoadMw, " MW")} (${r.itPctOfPeak}%)` +
          `<br/>Filed connectivity: ${num(r.connectivityMW, " MW")} (${r.connPctOfPeak}%)`;
      } },
      legend: { top: 0, textStyle: { color: p.muted, fontSize: 11 }, itemWidth: 10, itemHeight: 10, icon: "roundRect" },
      xAxis: { type: "value", name: "% of state peak demand", nameTextStyle: { color: p.faint, fontSize: 10 }, splitLine: { lineStyle: { color: p.grid } }, axisLabel: { ...baseAxisLabel(p), formatter: "{value}%" } },
      yAxis: { type: "category", data: rows.map((r) => r.state), axisLine: { lineStyle: { color: p.border } }, axisLabel: { color: p.muted, fontSize: 11 }, axisTick: { show: false } },
      series: [
        { name: "Firm IT load (press)", type: "bar", barWidth: 9, itemStyle: { color: p.an, borderRadius: [0, 3, 3, 0] }, data: rows.map((r) => r.itPctOfPeak) },
        { name: "Filed connectivity", type: "bar", barWidth: 9, itemStyle: { color: p.uc, borderRadius: [0, 3, 3, 0] },
          label: { show: true, position: "right", color: p.fg, fontFamily: "'IBM Plex Mono'", fontSize: 11, formatter: (o) => o.value + "%" },
          data: rows.map((r) => r.connPctOfPeak) },
      ],
    });
    c.off("click");
    c.on("click", (params) => { if (params.name) renderStateDrill(params.name); });
    qs("#foot-state-share").innerHTML = footLine(["ap-state-peak", "state-peaks-crea"], "Denominator = recorded state peak demand. Firm IT load excludes MoU-stage MW; connectivity = filed quantum (granted + applied).");
  }

  // ---- state drilldown --------------------------------------------------------
  function renderStateDrill(stateName) {
    const panel = qs("#state-drill");
    if (!panel) return;
    if (drillStateName === stateName && !panel.classList.contains("is-hidden")) {
      panel.classList.add("is-hidden"); drillStateName = null; return;
    }
    drillStateName = stateName;
    const aliasBack = Object.fromEntries(Object.entries(stateAlias).map(([k, v]) => [v, k]));
    const canonical = aliasBack[stateName] || stateName;
    const projects = data.projects.filter((pr) => ((pr.location || {}).state || "").includes(canonical));
    const filings = (data.connectivity || []).filter((r) => (r.state || "") === canonical);
    const policies = (data.policyWatch || []).filter((po) => (po.jurisdiction || "").includes(canonical));
    const peak = ((data.gridContext || {}).statePeakMW || {})[canonical];
    const share = (data.derived.stateShareOfPeak || []).find((r) => r.state === canonical);
    const itMw = projects.reduce((s, pr) => s + (((pr.capacity || {}).itLoadMw) || 0), 0);
    const connMw = filings.reduce((s, r) => s + (r.quantumMW || 0), 0);
    const chips = [
      { k: "Projects", v: String(projects.length) },
      { k: "Tracked IT MW", v: num(itMw) },
      { k: "Filed connectivity", v: num(connMw) + " MW" },
      peak && peak.peakMW ? { k: "State peak", v: num(peak.peakMW) + " MW" } : null,
      share ? { k: "Connectivity vs peak", v: share.connPctOfPeak + "%" } : null,
    ].filter(Boolean);
    panel.innerHTML = `
      <div class="drill-head">
        <div><p class="eyebrow">State drilldown</p><h3>${escapeHtml(canonical)}</h3></div>
        <button class="icon-btn" type="button" id="drill-close" aria-label="Close state panel">✕</button>
      </div>
      <div class="drill-chips">${chips.map((c) => `<div class="hero-chip"><span class="k">${escapeHtml(c.k)}</span><span class="v">${escapeHtml(c.v)}</span></div>`).join("")}</div>
      <div class="drill-cols">
        <div>
          <h4>Projects</h4>
          ${projects.length ? projects.map((pr) => `
            <div class="drill-item"><strong>${escapeHtml(pr.name)}</strong>
              <div class="td-note">${statusBadge(pr.status)} ${pr.capacity && pr.capacity.itLoadMw ? "· " + num(pr.capacity.itLoadMw, " MW IT") : "· MW undisclosed"}</div>
            </div>`).join("") : '<p class="drill-empty">No tracked projects.</p>'}
        </div>
        <div>
          <h4>Grid filings</h4>
          ${filings.length ? filings.map((r) => `
            <div class="drill-item"><strong>${escapeHtml(r.operator || r.applicant)}</strong>
              <div class="td-note">${num(r.quantumMW, " MW")} · ${connBadge(r.status)} · flow ${escapeHtml(r.powerFlowStart || "TBD")}${isEstimatedDate(r) ? ' <span class="est-chip">est.</span>' : ""}</div>
            </div>`).join("") : '<p class="drill-empty">No connectivity filings tracked. If a big project is here, the filing may be sitting in the state register — that is the sweep to run.</p>'}
        </div>
        <div>
          <h4>Policy in force</h4>
          ${policies.length ? policies.map((po) => `
            <div class="drill-item"><strong>${escapeHtml(po.title)}</strong>
              <div class="td-note">${escapeHtml(po.authority || "")}</div>
            </div>`).join("") : '<p class="drill-empty">Only national rules tracked for this state so far.</p>'}
        </div>
      </div>`;
    panel.classList.remove("is-hidden");
    qs("#drill-close").addEventListener("click", () => { panel.classList.add("is-hidden"); drillStateName = null; });
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function drawChoropleth() {
    const host = qs("#choropleth");
    const geo = window.INDIA_GEO_PATHS;
    if (!geo || !geo.states) {
      host.innerHTML = `<p class="change-empty">Map geometry did not load. The ranked bars carry the same numbers.</p>`;
      return;
    }
    const p = palette();
    const rows = data.derived.stateDemand || [];
    const loadByName = {};
    rows.forEach((r) => { loadByName[stateAlias[r.state] || r.state] = r.knownItLoadMw; });
    const maxMw = Math.max(1, ...rows.map((r) => r.knownItLoadMw));
    const fillFor = (mw) => {
      if (!mw) return p.surface2;
      const t = Math.sqrt(mw / maxMw); // perceptual emphasis
      return `color-mix(in srgb, ${p.uc} ${Math.round(18 + t * 78)}%, ${p.surface2})`;
    };
    const paths = Object.keys(geo.states).map((name) => {
      const mw = loadByName[name] || 0;
      return `<path d="${geo.states[name]}" fill="${fillFor(mw)}" data-state="${escapeHtml(name)}" style="cursor:pointer"><title>${escapeHtml(name)}: ${mw ? num(mw, " MW") : "no tracked load"} — click for detail</title></path>`;
    }).join("");
    host.innerHTML = `<svg viewBox="${geo.viewBox}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
    qsa("#choropleth path[data-state]").forEach((el) =>
      el.addEventListener("click", () => renderStateDrill(el.dataset.state)));
    qs("#map-legend").innerHTML = `<span>0 MW</span><span class="scale" style="background:linear-gradient(90deg, ${p.surface2}, ${p.uc})"></span><span class="num">${num(maxMw)} MW</span><span style="margin-left:auto">Tracked IT load by state</span>`;
    choroplethDrawn = true;
  }

  function chartFirmness() {
    const c = mount("chart-firmness"); if (!c) return;
    const p = palette();
    const ladder = (data.firmnessLadder || []).slice().sort((a, b) => a.rank - b.rank);
    const capByTier = data.derived.capacityByFirmnessMw || {};
    const cntByTier = data.derived.countByFirmness || {};
    const tierColor = (rank) => `color-mix(in srgb, ${p.op} ${rank * 18}%, ${p.neg})`;
    const present = ladder.filter((t) => (capByTier[t.key] || 0) > 0 || (cntByTier[t.key] || 0) > 0);
    c.setOption({
      grid: { left: 8, right: 70, top: 8, bottom: 26, containLabel: true },
      tooltip: { trigger: "item", ...tooltipBase(p), formatter: (o) => {
        const t = present[o.dataIndex];
        return `<b>${escapeHtml(t.label)}</b><br/>${num(o.value, " MW")} · ${cntByTier[t.key] || 0} project(s)<br/><span style="color:${p.faint}">${escapeHtml(t.note)}</span>`;
      } },
      xAxis: { type: "value", name: "MW IT load", nameTextStyle: { color: p.faint, fontSize: 10 }, splitLine: { lineStyle: { color: p.grid } }, axisLabel: baseAxisLabel(p) },
      yAxis: { type: "category", inverse: true, data: present.map((t) => t.label), axisLine: { lineStyle: { color: p.border } }, axisLabel: { color: p.muted, fontSize: 11 }, axisTick: { show: false } },
      series: [{
        type: "bar", barWidth: 18,
        itemStyle: { color: (o) => tierColor(present[o.dataIndex].rank), borderRadius: [0, 3, 3, 0] },
        label: { show: true, position: "right", color: p.fg, fontFamily: "'IBM Plex Mono'", fontSize: 11, formatter: (o) => num(o.value) + " MW · " + (cntByTier[present[o.dataIndex].key] || 0) },
        data: present.map((t) => capByTier[t.key] || 0),
      }],
    });
    qs("#foot-firmness").innerHTML = footLine(["ieefa-open-access"], "Annual renewable matching ≠ hourly clean supply. 'Undisclosed' = no site-specific power plan on the public record.");
  }

  function renderOpenAccess() {
    const oa = (data.gridContext || {}).openAccess || {};
    qs("#openaccess-card").innerHTML = `
      <div class="section-title-row"><div><p class="eyebrow">Procurement context</p><h3>Green open access — the clean-power lever</h3></div></div>
      <p class="lede" style="margin-bottom:12px">${escapeHtml(oa.note || "")}</p>
      <div class="openaccess-grid">
        <div class="oa-stat"><div class="v">${escapeHtml(num(oa.cumulativeGW))} GW</div><div class="k">C&I open access (${escapeHtml(oa.asOf || "")})</div></div>
        <div class="oa-stat"><div class="v">${escapeHtml(String(oa.cagrPct || "—"))}%</div><div class="k">CAGR FY22–24</div></div>
        <div class="oa-stat"><div class="v">100 kW</div><div class="k">Eligibility floor (from 1 MW)</div></div>
        <div class="oa-stat"><div class="v">~80%</div><div class="k">RE feasible; 24/7 needs clean-firm</div></div>
      </div>
      <div class="source-links">${sourceLinks(oa.sourceIds)}</div>`;
  }

  // ---- grid access / connectivity register ---------------------------------
  const CONN_STATUS = {
    granted: { label: "Granted", v: "--status-op" },
    agreement: { label: "Agreement", v: "--status-uc" },
    commissioned: { label: "Commissioned", v: "--status-uc" },
    applied: { label: "Applied", v: "--status-an" },
  };
  function connBadge(status) {
    const s = CONN_STATUS[status] || { label: status || "—", v: "--muted" };
    return `<span class="status-badge" style="--dot:var(${s.v});color:var(${s.v});border-color:color-mix(in srgb,var(${s.v}) 40%,transparent)">${escapeHtml(s.label)}</span>`;
  }
  function gridDeliveryText(r) {
    const d = r.gridDelivery || {};
    return [
      d.implementationMode, d.biddingAgency, d.biddingStatus, d.plannedSpvTransfer,
      d.stationReadiness, d.biddingAgencyNotes, d.packageId, ...(d.serviceNodes || []), ...(d.keyDependencies || []),
    ].filter(Boolean).join(" ");
  }
  function deliveryCell(r) {
    const d = r.gridDelivery || {};
    if (!Object.keys(d).length) return '<span class="td-note">Not tracked yet</span>';
    const mode = d.implementationMode ? `<span class="tag">${escapeHtml(d.implementationMode)}</span>` : "";
    const agency = d.biddingAgency ? `<span class="tag">${escapeHtml(d.biddingAgency)}</span>` : "";
    const target = d.plannedSpvTransfer ? ` · SPV ${escapeHtml(formatDate(d.plannedSpvTransfer))}` : "";
    const status = d.biddingStatus || d.stationReadiness || "";
    const note = [status, d.biddingAgencyNotes].filter(Boolean).join(" · ");
    return `${mode}${agency}<div class="td-note">${escapeHtml(note)}${target}</div>`;
  }
  function notPublished(value) {
    if (value === undefined || value === null || value === "") return "not published";
    return String(value);
  }
  function flowCell(value, note) {
    const v = notPublished(value);
    const muted = /^(not published|not approved|TBD)$/i.test(v);
    return `<span class="${muted ? "td-note" : ""}">${escapeHtml(v)}</span>${note ? `<div class="td-note">${escapeHtml(note)}</div>` : ""}`;
  }
  function transmissionStatus(r) {
    return r.transmissionStatus || gridDeliveryText(r) || [r.utility, r.substation].filter(Boolean).join(" · ") || "not tracked";
  }
  function renderGridMetrics() {
    const c = ((data.derived.connectivity || {}).summary) || {};
    const tier = c.byTier || {};
    const ists = tier["ISTS"] || 0, intra = tier["intra-state"] || 0;
    const cards = [
      { label: "Tracked connectivity", value: num(c.totalMW || 0), unit: "MW", foot: `${c.count || 0} filing(s) — quantum sought from the grid` },
      { label: "Granted (firm)", value: num(c.grantedMW || 0), unit: "MW", foot: "Connectivity / GNA already granted" },
      { label: "Applied / pipeline", value: num(c.appliedMW || 0), unit: "MW", foot: "Under process — not yet granted" },
      { label: "Intra-state · ISTS", value: num(intra) + " · " + num(ists), unit: "MW", foot: "State-level vs central (CTUIL)" },
    ];
    qs("#grid-metrics").innerHTML = cards.map((m) => `
      <article class="metric">
        <span class="m-label">${escapeHtml(m.label)}</span>
        <span class="m-value">${escapeHtml(m.value)}<small>${escapeHtml(m.unit || "")}</small></span>
        <span class="m-foot"><span class="m-note">${escapeHtml(m.foot)}</span></span>
      </article>`).join("");
  }
  function chartGridForward() {
    const c = mount("chart-grid-forward"); if (!c) return;
    const p = palette();
    const conn = data.derived.connectivity || {};
    const fwd = conn.forward || [];
    const sum = conn.summary || {};
    c.setOption({
      grid: { left: 54, right: 18, top: 28, bottom: 26 },
      tooltip: { trigger: "axis", ...tooltipBase(p), valueFormatter: (v) => num(v, " MW") },
      legend: { top: 0, textStyle: { color: p.muted, fontSize: 11 }, itemWidth: 10, itemHeight: 10, icon: "roundRect" },
      xAxis: { type: "category", data: fwd.map((f) => f.year), boundaryGap: false, axisLine: { lineStyle: { color: p.border } }, axisLabel: baseAxisLabel(p), axisTick: { show: false } },
      yAxis: { type: "value", name: "MW connectivity", nameTextStyle: { color: p.faint, fontSize: 10 }, splitLine: { lineStyle: { color: p.grid } }, axisLabel: baseAxisLabel(p) },
      series: [
        { name: "Granted (firm)", type: "line", step: "end", symbol: "circle", symbolSize: 6, lineStyle: { width: 2 }, areaStyle: { opacity: 0.22 }, itemStyle: { color: p.op }, data: fwd.map((f) => f.cumulativeGrantedMW) },
        { name: "Register-declared dates", type: "line", step: "end", symbol: "circle", symbolSize: 6, lineStyle: { width: 2 }, itemStyle: { color: p.uc }, data: fwd.map((f) => f.cumulativeDeclaredMW || 0) },
        { name: "Incl. estimated dates", type: "line", step: "end", symbol: "circle", symbolSize: 6, lineStyle: { width: 2, type: "dashed" }, itemStyle: { color: p.an }, data: fwd.map((f) => f.cumulativeMW) },
      ],
    });
    const estNote = sum.estimatedDateCount
      ? `${sum.estimatedDateCount} of ${sum.count} filings carry ESTIMATED power-flow dates (dashed) — the curve firms up as real register dates are pulled.`
      : "All power-flow dates are register-declared.";
    qs("#foot-grid-forward").innerHTML = footLine(["src-ctuil-gna-portal", "src-merc-lodha-2026"], estNote);
  }

  // ---- press vs filings bridge ----------------------------------------------
  function chartBridge() {
    const c = mount("chart-bridge"); if (!c) return;
    const p = palette();
    const t = ((data.derived.reconciliation || {}).totals) || {};
    const rows = [
      { name: "Press-tracked IT load (headline)", v: t.pressHeadlineMw || 0, color: p.an },
      { name: "Filed connectivity quantum", v: t.filedMw || 0, color: p.uc },
      { name: "Granted", v: t.grantedMw || 0, color: p.op },
      { name: "Commissioned", v: t.commissionedMw || 0, color: p.muted },
    ];
    c.setOption({
      grid: { left: 8, right: 70, top: 6, bottom: 24, containLabel: true },
      tooltip: { trigger: "item", ...tooltipBase(p), valueFormatter: (v) => num(v, " MW") },
      xAxis: { type: "value", splitLine: { lineStyle: { color: p.grid } }, axisLabel: baseAxisLabel(p) },
      yAxis: { type: "category", inverse: true, data: rows.map((r) => r.name), axisLine: { lineStyle: { color: p.border } }, axisLabel: { color: p.muted, fontSize: 11 }, axisTick: { show: false } },
      series: [{
        type: "bar", barWidth: 20,
        itemStyle: { color: (o) => rows[o.dataIndex].color, borderRadius: [0, 3, 3, 0] },
        label: { show: true, position: "right", color: p.fg, fontFamily: "'IBM Plex Mono'", fontSize: 11, formatter: (o) => num(o.value) + " MW" },
        data: rows.map((r) => r.v),
      }],
    });
    renderBridgeTable();
    qs("#foot-bridge").innerHTML = footLine([], "Quantum covers total site draw (cooling, growth headroom), so filings legitimately exceed disclosed IT MW.");
  }
  function renderBridgeTable() {
    const rec = data.derived.reconciliation || {};
    const rows = rec.projects || [];
    const unlinked = rec.unlinked || [];
    if (!rows.length && !unlinked.length) { qs("#bridge-table").innerHTML = ""; return; }
    const line = (r) => `
      <div class="bridge-row">
        <div><strong>${escapeHtml(r.name)}</strong><div class="td-note">${escapeHtml(r.state || "")} · ${r.filingCount} filing${r.filingCount === 1 ? "" : "s"}</div></div>
        <div class="num">${r.pressMw ? num(r.pressMw) : "—"}</div>
        <div class="num">${num(r.filedMw)}</div>
        <div class="num">${num(r.grantedMw)}</div>
      </div>`;
    const unlinkedLine = unlinked.length
      ? `<p class="bridge-note">Filings with no press-tracked project yet: ${unlinked.map((u) => `${escapeHtml(u.operator || u.id)} (${num(u.quantumMW)} MW, ${escapeHtml(u.status || "")})`).join(" · ")} — the register sees what press has not reported.</p>`
      : "";
    qs("#bridge-table").innerHTML = `
      <div class="bridge-table">
        <div class="bridge-row head"><div>Linked project</div><div class="num">Press IT MW</div><div class="num">Filed MW</div><div class="num">Granted MW</div></div>
        ${rows.map(line).join("")}
      </div>${unlinkedLine}`;
  }
  const GRID_COLUMNS = [
    { key: "operator", label: "Applicant / operator", num: false },
    { key: "quantumMW", label: "Quantum MW", num: true },
    { key: "powerFlowStart", label: "Power flow", num: false },
    { key: "tier", label: "Tier", num: false },
    { key: "utility", label: "Utility / substation", num: false },
    { key: "delivery", label: "Delivery", num: false },
    { key: "status", label: "Status", num: false },
    { key: "sources", label: "Source", num: false, nosort: true },
  ];
  const CONN_STATUS_ORDER = { commissioned: 0, agreement: 1, granted: 2, applied: 3 };
  function gridVal(r, key) {
    switch (key) {
      case "operator": return r.operator || r.applicant || "";
      case "quantumMW": return r.quantumMW || 0;
      case "powerFlowStart": return String(r.powerFlowStart || "9999");
      case "tier": return r.tier || "";
      case "utility": return r.utility || "";
      case "delivery": return gridDeliveryText(r);
      case "status": return CONN_STATUS_ORDER[r.status] ?? 9;
      default: return "";
    }
  }
  function filteredGridRecords() {
    const search = ((qs("#grid-search") || {}).value || "").trim().toLowerCase();
    let recs = (data.connectivity || []).filter((r) => !search ||
      [r.operator, r.applicant, r.parentCompany, r.utility, r.substation, r.state, r.drawalState, r.status, r.tier, r.applicationRef, r.notes, transmissionStatus(r)]
        .join(" ").toLowerCase().includes(search));
    recs.sort((a, b) => {
      let av = gridVal(a, gridSortKey), bv = gridVal(b, gridSortKey);
      if (typeof av === "string") return gridSortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return gridSortDir === "asc" ? av - bv : bv - av;
    });
    return recs;
  }
  function renderGridThead() {
    qs("#grid-thead").innerHTML = GRID_COLUMNS.map((c) => {
      const ind = gridSortKey === c.key ? `<span class="sort-ind">${gridSortDir === "asc" ? "▲" : "▼"}</span>` : "";
      return `<th class="${c.num ? "num" : ""}" ${c.nosort ? "" : `data-grid-sort="${c.key}"`}>${escapeHtml(c.label)}${ind}</th>`;
    }).join("");
    qsa("[data-grid-sort]").forEach((th) => th.addEventListener("click", () => {
      const k = th.dataset.gridSort;
      if (gridSortKey === k) gridSortDir = gridSortDir === "asc" ? "desc" : "asc";
      else { gridSortKey = k; gridSortDir = GRID_COLUMNS.find((c) => c.key === k).num ? "desc" : "asc"; }
      renderGridThead(); renderGridTable(); renderExecutiveGridTable();
    }));
  }
  function renderGridTable() {
    const recs = filteredGridRecords();
    qs("#grid-count").textContent = recs.length + " filing" + (recs.length === 1 ? "" : "s");
    if (!recs.length) {
      qs("#grid-table").innerHTML = `<tr><td colspan="${GRID_COLUMNS.length}"><strong>No matching filings.</strong><div class="td-note">Clear the search to see the full register.</div></td></tr>`;
      return;
    }
    qs("#grid-table").innerHTML = recs.map((r) => `
      <tr>
        <td><strong>${escapeHtml(r.operator || r.applicant || "—")}</strong><div class="td-note">${escapeHtml(r.applicant || "")}</div></td>
        <td class="num">${r.quantumMW ? num(r.quantumMW) : "—"}</td>
        <td>${escapeHtml(r.powerFlowStart || "TBD")}${isEstimatedDate(r) ? ' <span class="est-chip" title="Placeholder until the register-declared date is pulled">est.</span>' : ""}</td>
        <td><span class="tag">${escapeHtml(r.tier === "ISTS" ? "ISTS · CTUIL" : (r.tier || "—"))}</span></td>
        <td>${escapeHtml(r.utility || "—")}<div class="td-note">${escapeHtml(r.substation || "")}</div></td>
        <td>${deliveryCell(r)}</td>
        <td>${connBadge(r.status)}${staleDot(r.lastVerified)}</td>
        <td class="source-links">${sourceLinks(r.sourceIds)}</td>
      </tr>`).join("");
  }
  const GRID_EXEC_COLUMNS = [
    "Applicant",
    "Parent / holding",
    "Drawal state",
    "MW / status",
    "Transmission status",
    "Requested start",
    "Requested end",
    "Approved start",
    "Approved end",
  ];
  function renderExecutiveGridTable() {
    const recs = filteredGridRecords();
    const head = qs("#grid-exec-thead");
    const body = qs("#grid-exec-table");
    if (!head || !body) return;
    qs("#grid-exec-count").textContent = recs.length + " filing" + (recs.length === 1 ? "" : "s");
    head.innerHTML = GRID_EXEC_COLUMNS.map((label) => `<th>${escapeHtml(label)}</th>`).join("");
    if (!recs.length) {
      body.innerHTML = `<tr><td colspan="${GRID_EXEC_COLUMNS.length}"><strong>No matching filings.</strong><div class="td-note">Clear the search to see the full register.</div></td></tr>`;
      return;
    }
    body.innerHTML = recs.map((r) => `
      <tr>
        <td><strong>${escapeHtml(r.applicant || r.operator || "—")}</strong><div class="td-note">${escapeHtml(r.applicationRef || "")}</div></td>
        <td>${escapeHtml(r.parentCompany || r.operator || "—")}</td>
        <td>${escapeHtml(r.drawalState || r.state || "—")}</td>
        <td class="num">${r.quantumMW ? num(r.quantumMW) : "—"}<div>${connBadge(r.status)}</div></td>
        <td>${escapeHtml(transmissionStatus(r))}</td>
        <td>${flowCell(r.requestedPowerFlowStart, r.dateConfidence === "estimated" ? "dashboard curve uses estimated year" : "")}</td>
        <td>${flowCell(r.requestedPowerFlowEnd)}</td>
        <td>${flowCell(r.approvedPowerFlowStart)}</td>
        <td>${flowCell(r.approvedPowerFlowEnd)}</td>
      </tr>`).join("");
  }
  function renderGridDeliveryAssets() {
    const root = qs("#grid-delivery-assets");
    if (!root) return;
    const assets = data.gridDeliveryAssets || [];
    if (!assets.length) { root.innerHTML = ""; return; }
    root.innerHTML = `
      <div class="section-head">
        <div class="section-title-row">
          <div><p class="eyebrow">Serviceability</p><h3>Transmission delivery assets</h3></div>
          <span class="fine-print">${assets.length} asset${assets.length === 1 ? "" : "s"} tracked</span>
        </div>
      </div>
      <div class="card-grid cols-2">
        ${assets.map((a) => `
          <article class="policy-card-rich">
            <div class="policy-meta">
              <span class="tag">${escapeHtml(a.state || "Multi-state")}</span>
              <span class="tag">${escapeHtml(a.status || "watch")}</span>
              ${a.implementationMode ? `<span class="tag">${escapeHtml(a.implementationMode)}</span>` : ""}
              ${a.biddingAgency ? `<span class="tag">${escapeHtml(a.biddingAgency)}</span>` : ""}
            </div>
            <h4>${escapeHtml(a.name || "")}</h4>
            ${a.biddingStatus ? `<p class="dc-relevance">${escapeHtml(a.biddingStatus)}</p>` : ""}
            ${a.plannedSpvTransfer ? `<div class="instrument-line">Target SPV transfer: ${escapeHtml(formatDate(a.plannedSpvTransfer))}</div>` : ""}
            ${a.biddingAgencyNotes ? `<div class="instrument-line">${escapeHtml(a.biddingAgencyNotes)}</div>` : ""}
            <p>${escapeHtml(a.dashboardImplication || a.notes || "")}</p>
            ${(a.majorElements || []).length ? `<div class="delivery-list">${a.majorElements.map((e) => `<span>${escapeHtml(e)}</span>`).join("")}</div>` : ""}
            ${(a.linkedConnectivityIds || []).length ? `<p class="fine-print">Linked filings: ${escapeHtml(a.linkedConnectivityIds.join(", "))}</p>` : ""}
            <div class="source-links">${sourceLinks(a.sourceIds)}</div>
          </article>`).join("")}
      </div>`;
  }
  function exportGridCsv() {
    exportCsv("india-dc-connectivity-register.csv",
      ["operator", "applicant", "parentCompany", "drawalState", "quantumMW", "status", "requestedPowerFlowStart", "requestedPowerFlowEnd", "approvedPowerFlowStart", "approvedPowerFlowEnd", "powerFlowStart", "dateConfidence", "tier", "utility", "substation", "transmissionStatus", "deliveryMode", "biddingAgency", "biddingStatus", "plannedSpvTransfer", "state", "applicationRef", "lastVerified"],
      filteredGridRecords().map((r) => [r.operator, r.applicant, r.parentCompany, r.drawalState || r.state, r.quantumMW, r.status, r.requestedPowerFlowStart, r.requestedPowerFlowEnd, r.approvedPowerFlowStart, r.approvedPowerFlowEnd, r.powerFlowStart,
        isEstimatedDate(r) ? "estimated" : "declared", r.tier, r.utility, r.substation,
        transmissionStatus(r),
        (r.gridDelivery || {}).implementationMode, (r.gridDelivery || {}).biddingAgency,
        (r.gridDelivery || {}).biddingStatus, (r.gridDelivery || {}).plannedSpvTransfer,
        r.state, r.applicationRef, r.lastVerified]));
  }
  function renderGrid() { renderGridMetrics(); renderGridThead(); renderGridTable(); renderExecutiveGridTable(); renderGridDeliveryAssets(); }

  function renderStandards() {
    qs("#standard-grid").innerHTML = (data.hyperscalerStandards || []).map((s) => `
      <article class="mini-card">
        <div class="policy-meta"><span class="tag">${escapeHtml(s.company)}</span><span class="tag">${escapeHtml(s.standard)}</span></div>
        <h4>${escapeHtml(s.headline)}</h4>
        <p>${escapeHtml(s.indiaRelevance)}</p>
        <div class="standard-watch">${(s.watchItems || []).map((w) => `<span class="tag">${escapeHtml(w)}</span>`).join("")}</div>
        <div class="source-links">${sourceLinks(s.sourceIds)}</div>
      </article>`).join("");
  }

  const TRACK_ORDER = ["Central power", "State power regulator", "Environment & water", "State DC/AI policy", "Data governance", "India regulatory"];

  function primarySourceOf(item) {
    return (item.sourceIds || []).map((id) => sourceMap.get(id)).find((s) => s && s.tier === "primary");
  }
  function secondarySourcesOf(item) {
    return (item.sourceIds || []).map((id) => sourceMap.get(id)).filter((s) => s && s.tier !== "primary");
  }

  function policyCard(item) {
    const primary = primarySourceOf(item);
    const provBadge = primary
      ? `<span class="prov-badge" data-prov="primary" title="${escapeHtml(primary.publisher)}">✓ Primary source</span>`
      : `<span class="prov-badge" data-prov="media">⚠ Media-only</span>`;
    const instrumentBits = [item.instrument, item.reference, item.notifiedDate ? "notified " + formatDate(item.notifiedDate) : ""]
      .filter(Boolean).map(escapeHtml).join(" · ");
    const dates = [];
    if (item.effectiveDate) dates.push("Effective " + formatDate(item.effectiveDate));
    const sor = primary
      ? `<a class="source-of-record" href="${escapeHtml(primary.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.authority || primary.publisher)}: ${escapeHtml(primary.label)}</a>`
      : "";
    const secondary = secondarySourcesOf(item)
      .map((s) => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.publisher)}</a>`).join("");
    return `
      <article class="policy-card-rich">
        <div class="policy-meta">
          <span class="tag">${escapeHtml(item.jurisdiction || "")}</span>
          <span class="tag">${escapeHtml(item.status || "")}</span>
          ${provBadge}
        </div>
        <h4>${escapeHtml(item.title || "")}</h4>
        ${instrumentBits ? `<div class="instrument-line">${instrumentBits}</div>` : ""}
        ${item.authority ? `<div class="authority-line">${escapeHtml(item.authority)}</div>` : ""}
        ${item.dcRelevance ? `<p class="dc-relevance">${escapeHtml(item.dcRelevance)}</p>` : ""}
        <p>${escapeHtml(item.systemImplication || "")}</p>
        ${dates.length ? `<div class="fine-print">${dates.map(escapeHtml).join(" · ")}</div>` : ""}
        <div class="standard-watch">${(item.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
        ${sor ? `<div class="sor-row"><span class="sor-label">Source of record</span>${sor}</div>` : ""}
        ${secondary ? `<div class="source-links secondary-links"><span class="fine-print">Also reported:</span> ${secondary}</div>` : ""}
        <p class="fine-print cadence">Monthly check: ${escapeHtml(item.monthlyCadence || "")}</p>
      </article>`;
  }

  function renderPolicyFilters(tracks) {
    const opts = ["all", ...tracks];
    qs("#policy-filters").innerHTML = opts.map((t) => {
      const label = t === "all" ? "All tracks" : t;
      const count = t === "all" ? data.policyWatch.length : data.policyWatch.filter((i) => (i.track || "Other") === t).length;
      return `<button class="filter-chip ${policyTrack === t ? "is-active" : ""}" data-policy-track="${escapeHtml(t)}">${escapeHtml(label)}<span class="ct">${count}</span></button>`;
    }).join("");
    qsa("[data-policy-track]").forEach((b) => b.addEventListener("click", () => { policyTrack = b.dataset.policyTrack; renderPolicy(); }));
  }

  function renderUptimeStandards() {
    const root = qs("#uptime-standards");
    if (!root) return;
    const standards = data.uptimeStandards || [];
    if (!standards.length) { root.innerHTML = ""; return; }
    root.innerHTML = `
      <div class="section-title-row">
        <div><p class="eyebrow">Service levels</p><h3>Uptime definitions to watch</h3></div>
        <span class="fine-print">${standards.length} standard${standards.length === 1 ? "" : "s"}</span>
      </div>
      <div class="uptime-grid">
        ${standards.map((s) => `
          <article class="policy-card-rich">
            <div class="policy-meta">
              <span class="tag">${escapeHtml(s.authority || "")}</span>
              <span class="tag">${escapeHtml(s.definitionType || "")}</span>
            </div>
            <h4>${escapeHtml(s.title || s.metric || "")}</h4>
            <p class="dc-relevance">${escapeHtml(s.scope || "")}</p>
            <p>${escapeHtml(s.dashboardImplication || "")}</p>
            ${(s.thresholds || []).length ? `<div class="delivery-list">${s.thresholds.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>` : ""}
            <div class="source-links">${sourceLinks(s.sourceIds)}</div>
          </article>`).join("")}
      </div>`;
  }

  function renderPolicy() {
    const items = data.policyWatch || [];
    const primaryCount = items.filter((i) => primarySourceOf(i)).length;
    const pct = items.length ? Math.round((primaryCount / items.length) * 100) : 0;
    qs("#policy-coverage").innerHTML = `
      <div class="coverage-row">
        <div><span class="coverage-num">${primaryCount}/${items.length}</span><span class="coverage-lbl">items on a primary government source</span></div>
        <div class="coverage-bar"><div class="coverage-fill" style="width:${pct}%"></div></div>
        <span class="fine-print">Standing rule: the source of record for any policy item is the gazette / ministry / regulator instrument; media is a pointer only.</span>
      </div>`;
    renderUptimeStandards();

    const tracks = [...new Set(items.map((i) => i.track || "Other"))]
      .sort((a, b) => (TRACK_ORDER.indexOf(a) < 0 ? 99 : TRACK_ORDER.indexOf(a)) - (TRACK_ORDER.indexOf(b) < 0 ? 99 : TRACK_ORDER.indexOf(b)));
    renderPolicyFilters(tracks);

    const shown = policyTrack === "all" ? tracks : tracks.filter((t) => t === policyTrack);
    qs("#policy-body").innerHTML = shown.map((track) => {
      const group = items.filter((i) => (i.track || "Other") === track);
      return `
        <div class="track-group">
          <div class="track-head"><h3>${escapeHtml(track)}</h3><span class="fine-print">${group.length} item${group.length === 1 ? "" : "s"}</span></div>
          <div class="policy-rich-grid">${group.map(policyCard).join("")}</div>
        </div>`;
    }).join("");
  }

  // ---- pipeline table ------------------------------------------------------
  const COLUMNS = [
    { key: "name", label: "Project", num: false },
    { key: "status", label: "Status", num: false },
    { key: "state", label: "Location", num: false },
    { key: "hyperscaler", label: "Hyperscaler", num: false },
    { key: "itLoadMw", label: "Known MW", num: true },
    { key: "usdB", label: "Value $B", num: true },
    { key: "firmness", label: "Power firmness", num: false },
  ];
  const firmnessLabel = (key) => { const t = (data.firmnessLadder || []).find((x) => x.key === key); return t ? t.label : (key || "—"); };
  function projVal(p, key) {
    switch (key) {
      case "name": return p.name;
      case "status": return data.derived.statusOrder[p.status];
      case "state": return p.location && p.location.state;
      case "hyperscaler": return p.hyperscaler;
      case "itLoadMw": return (p.capacity && p.capacity.itLoadMw) || 0;
      case "usdB": return (p.value && p.value.usdBillion) || 0;
      case "firmness": return (p.power && p.power.firmnessTier) || "";
      default: return "";
    }
  }
  function projectSearchText(p) {
    return [p.name, p.status, p.operator, p.hyperscaler, p.customerType, p.location && p.location.city, p.location && p.location.state, p.power && p.power.source, p.timeline, p.notes, ...(p.tags || [])].join(" ").toLowerCase();
  }
  function filteredProjects() {
    const search = (qs("#project-search").value || "").trim().toLowerCase();
    let list = data.projects.filter((p) => (activeStatus === "all" || p.status === activeStatus) && (!search || projectSearchText(p).includes(search)));
    list.sort((a, b) => {
      let av = projVal(a, sortKey), bv = projVal(b, sortKey);
      if (typeof av === "string") { av = av || ""; bv = bv || ""; return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av); }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }
  function renderThead() {
    qs("#project-thead").innerHTML = COLUMNS.map((c) => {
      const ind = sortKey === c.key ? `<span class="sort-ind">${sortDir === "asc" ? "▲" : "▼"}</span>` : "";
      return `<th class="${c.num ? "num" : ""}" data-sort="${c.key}">${escapeHtml(c.label)}${ind}</th>`;
    }).join("");
    qsa("#project-thead th").forEach((th) => th.addEventListener("click", () => {
      const k = th.dataset.sort;
      if (sortKey === k) sortDir = sortDir === "asc" ? "desc" : "asc";
      else { sortKey = k; sortDir = COLUMNS.find((c) => c.key === k).num ? "desc" : "asc"; }
      renderThead(); renderTable();
    }));
  }
  function renderStatusFilters() {
    const items = ["all", ...STATUS_KEYS];
    qs("#status-filters").innerHTML = items.map((s) => {
      const label = s === "all" ? "All" : statusLabels[s];
      const count = s === "all" ? data.projects.length : data.derived.counts[s] || 0;
      return `<button class="filter-chip ${activeStatus === s ? "is-active" : ""}" data-status-filter="${s}">${escapeHtml(label)}<span class="ct">${count}</span></button>`;
    }).join("");
    qsa("[data-status-filter]").forEach((b) => b.addEventListener("click", () => { activeStatus = b.dataset.statusFilter; renderStatusFilters(); renderTable(); }));
  }
  function renderTable() {
    const list = filteredProjects();
    if (!list.some((p) => p.id === selectedProjectId)) selectedProjectId = (list[0] || data.projects[0] || {}).id;
    if (!list.length) {
      qs("#project-table").innerHTML = `<tr><td colspan="${COLUMNS.length}"><strong>No matching projects.</strong><div class="td-note">Try a different status or search term.</div></td></tr>`;
      return;
    }
    qs("#project-table").innerHTML = list.map((p) => {
      const mw = p.capacity && p.capacity.itLoadMw ? num(p.capacity.itLoadMw) : "—";
      const val = p.value && p.value.usdBillion ? num(p.value.usdBillion) : "—";
      return `<tr class="${p.id === selectedProjectId ? "is-selected" : ""}" tabindex="0" data-project-id="${escapeHtml(p.id)}">
        <td><strong>${escapeHtml(p.name)}</strong><div class="td-note">${escapeHtml(p.operator || "")}</div></td>
        <td>${statusBadge(p.status)}</td>
        <td>${escapeHtml((p.location && p.location.city) || "—")}<div class="td-note">${escapeHtml((p.location && p.location.state) || "")}</div></td>
        <td>${escapeHtml(p.hyperscaler || "—")}<div class="td-note">${escapeHtml(p.customerType || "")}</div></td>
        <td class="num">${mw}</td>
        <td class="num">${val}</td>
        <td><span class="tag">${escapeHtml(firmnessLabel(p.power && p.power.firmnessTier))}</span></td>
      </tr>`;
    }).join("");
    qsa("[data-project-id]").forEach((row) => {
      const select = () => { selectedProjectId = row.dataset.projectId; renderTable(); renderDetail(); };
      row.addEventListener("click", select);
      row.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); } });
    });
  }
  function renderDetail() {
    const p = data.projects.find((x) => x.id === selectedProjectId) || data.projects[0];
    if (!p) return;
    const tags = (p.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
    qs("#project-detail").innerHTML = `
      <p class="eyebrow">Selected row</p>
      <h3>${escapeHtml(p.name)}</h3>
      <div style="margin:8px 0">${statusBadge(p.status)}</div>
      <dl class="detail-kv">
        <div><dt>Builder</dt><dd>${escapeHtml(p.constructionLead || "—")}</dd></div>
        <div><dt>Hyperscaler</dt><dd>${escapeHtml(p.hyperscaler || "—")}</dd></div>
        <div><dt>Location</dt><dd>${escapeHtml((p.location && p.location.city) || "—")}, ${escapeHtml((p.location && p.location.state) || "")}</dd></div>
        <div><dt>Value</dt><dd>${escapeHtml((p.value && p.value.display) || "TBD")}</dd></div>
        <div><dt>IT load</dt><dd><span class="num">${p.capacity && p.capacity.itLoadMw ? num(p.capacity.itLoadMw, " MW") : "TBD"}</span></dd></div>
        <div><dt>Power</dt><dd>${escapeHtml((p.power && p.power.source) || "TBD")}<br><span class="td-note">Firmness: ${escapeHtml(firmnessLabel(p.power && p.power.firmnessTier))}. ${escapeHtml((p.power && p.power.detail) || "")}</span></dd></div>
        <div><dt>Timeline</dt><dd>${escapeHtml(p.timeline || "—")}</dd></div>
        <div><dt>Confidence</dt><dd>${escapeHtml(p.stageConfidence || "—")} stage confidence</dd></div>
        <div><dt>Verified</dt><dd>${escapeHtml(formatDate(p.lastVerified))}${staleDot(p.lastVerified)}</dd></div>
      </dl>
      ${detailFilings(p)}
      <p class="td-note">${escapeHtml(p.notes || "")}</p>
      <div class="tag-row">${tags}</div>
      <div class="source-links">${sourceLinks(p.sourceIds)}</div>`;
  }
  function detailFilings(p) {
    const filings = (data.connectivity || []).filter((r) => r.linkedProjectId === p.id);
    if (!filings.length) return "";
    const total = filings.reduce((s, r) => s + (r.quantumMW || 0), 0);
    const press = (p.capacity || {}).itLoadMw;
    const gapNote = press
      ? ` Press-disclosed IT load is ${num(press, " MW")} — the filed quantum covers total site draw and headroom.`
      : " No IT MW is press-disclosed; the filing is the only hard load figure.";
    return `
      <div class="sor-row">
        <span class="sor-label">Grid filings — ${num(total, " MW")} quantum</span>
        ${filings.map((r) => `<span style="font-size:0.8rem">${escapeHtml(r.utility || r.tier || "")}: ${num(r.quantumMW, " MW")} ${connBadge(r.status)} · flow ${escapeHtml(r.powerFlowStart || "TBD")}${isEstimatedDate(r) ? ' <span class="est-chip">est.</span>' : ""}${r.gridDelivery && (r.gridDelivery.implementationMode || r.gridDelivery.biddingAgency) ? ` · ${escapeHtml([r.gridDelivery.implementationMode, r.gridDelivery.biddingAgency].filter(Boolean).join(" / "))}` : ""}</span>`).join("")}
        <span class="td-note">${escapeHtml(gapNote)}</span>
      </div>`;
  }
  function exportProjectsCsv() {
    exportCsv("india-dc-project-registry.csv",
      ["name", "status", "operator", "hyperscaler", "city", "state", "itLoadMw", "valueUsdB", "powerFirmness", "includeInHeadline", "lastVerified"],
      filteredProjects().map((p) => [p.name, p.status, p.operator, p.hyperscaler,
        (p.location || {}).city, (p.location || {}).state, (p.capacity || {}).itLoadMw,
        (p.value || {}).usdBillion, (p.power || {}).firmnessTier, p.includeInHeadline !== false, p.lastVerified]));
  }

  // ---- sources -------------------------------------------------------------
  function renderSources() {
    const search = (qs("#source-search").value || "").trim().toLowerCase();
    const list = (data.sources || []).filter((s) => !search || [s.label, s.publisher, s.date, s.type, s.url].join(" ").toLowerCase().includes(search));
    qs("#source-ledger").innerHTML = list.map((s) => `
      <article class="mini-card">
        <div class="source-meta"><span class="tag">${escapeHtml(s.type)}</span><span class="tag">${escapeHtml(s.publisher)}</span><span class="tag">${escapeHtml(formatDate(s.date))}</span></div>
        <h4>${escapeHtml(s.label)}</h4>
        <a href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.url)}</a>
      </article>`).join("");
  }

  // ---- view + theme switching ----------------------------------------------
  const VIEW_NAMES = ["brief", "trends", "pipeline", "grid", "power", "policy", "sources"];
  function setActiveView(name, opts) {
    qsa(".view").forEach((v) => v.classList.toggle("is-active", v.id === "view-" + name));
    qsa(".nav-pill").forEach((b) => b.classList.toggle("is-active", b.dataset.viewTarget === name));
    if (!(opts && opts.noHash)) { try { history.replaceState(null, "", "#" + name); } catch (e) {} }
    window.scrollTo({ top: 0, behavior: "smooth" });
    // charts need a resize when their container becomes visible
    requestAnimationFrame(() => Object.values(charts).forEach((c) => c && c.resize()));
    if (name === "pipeline" && stateView === "map" && !choroplethDrawn) drawChoropleth();
  }

  // Permalinks: #<view> or #pipeline/p=<projectId> select the view (and row) on load.
  function applyHash() {
    const hash = (location.hash || "").replace(/^#/, "");
    if (!hash) return;
    const [name, param] = hash.split("/");
    if (!VIEW_NAMES.includes(name)) return;
    if (param && param.startsWith("p=")) {
      const pid = decodeURIComponent(param.slice(2));
      if (data.projects.some((p) => p.id === pid)) { selectedProjectId = pid; renderTable(); renderDetail(); }
    }
    setActiveView(name, { noHash: true });
  }

  function renderAllCharts() {
    chartFunnel(); chartTimeline(); chartForecast(); chartState(); chartStateShare(); chartFirmness(); chartGridForward(); chartBridge();
    if (stateView === "map" && qs("#view-pipeline").classList.contains("is-active")) drawChoropleth();
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle("light", theme === "light");
    qs("#theme-toggle").textContent = theme === "light" ? "☾" : "☀";
    try { localStorage.setItem("dcwatch-theme", theme); } catch (e) {}
    // re-read CSS vars and rebuild charts + KPI sparklines in new palette
    choroplethDrawn = false;
    renderMetrics();
    renderAllCharts();
  }

  function bindEvents() {
    qsa("[data-view-target]").forEach((b) => b.addEventListener("click", () => setActiveView(b.dataset.viewTarget)));
    qs("#project-search").addEventListener("input", () => { renderTable(); renderDetail(); });
    qs("#source-search").addEventListener("input", renderSources);
    qs("#grid-search").addEventListener("input", () => {
      renderGridTable();
      renderExecutiveGridTable();
    });
    qs("#export-grid").addEventListener("click", exportGridCsv);
    qs("#export-projects").addEventListener("click", exportProjectsCsv);
    qs("#theme-toggle").addEventListener("click", () => applyTheme(document.documentElement.classList.contains("light") ? "dark" : "light"));
    // Print the Brief as a light one-pager regardless of the screen theme.
    let themeBeforePrint = null;
    window.addEventListener("beforeprint", () => {
      themeBeforePrint = document.documentElement.classList.contains("light") ? "light" : "dark";
      if (themeBeforePrint === "dark") applyTheme("light");
    });
    window.addEventListener("afterprint", () => {
      if (themeBeforePrint === "dark") applyTheme("dark");
      themeBeforePrint = null;
    });
    qsa("[data-state-view]").forEach((b) => b.addEventListener("click", () => {
      stateView = b.dataset.stateView;
      qsa("[data-state-view]").forEach((x) => x.classList.toggle("is-active", x === b));
      qs("#chart-state").classList.toggle("is-hidden", stateView === "map");
      qs("#map-block").classList.toggle("is-hidden", stateView === "bars");
      if (stateView === "map" && !choroplethDrawn) drawChoropleth();
      else requestAnimationFrame(() => charts["chart-state"] && charts["chart-state"].resize());
    }));
    window.addEventListener("resize", () => Object.values(charts).forEach((c) => c && c.resize()));
  }

  // ---- init ----------------------------------------------------------------
  function init() {
    let theme = "dark";
    try { theme = localStorage.getItem("dcwatch-theme") || "dark"; } catch (e) {}
    document.documentElement.classList.toggle("light", theme === "light");
    qs("#theme-toggle").textContent = theme === "light" ? "☾" : "☀";

    renderShell();
    renderHeroChips();
    renderMetrics();
    renderChangeBlock();
    renderSignals();
    renderImplications();
    renderWatchlist();
    renderPersonas();
    renderBaseline();
    renderOpenAccess();
    renderStandards();
    renderGrid();
    renderPolicy();
    renderThead();
    renderStatusFilters();
    renderTable();
    renderDetail();
    renderSources();
    renderAllCharts();
    bindEvents();
    applyHash();
  }

  init();
})();
