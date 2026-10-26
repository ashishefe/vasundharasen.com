(function () {
  if (!window.DCW) return;
  const {
    data, D, STAGES, stageLabels, projectsById, sourceMap, connById, GRANTED, activeFilings, caveatMw, totalCaveat, projectCaveatMw,
    qs, qsa, cssVar, uniq, esc, mw, pct, formatDate, monthName, shortMonth, stageColor, sourceLinks,
    projectHref, filingHref, renderMasthead,
  } = window.DCW;
  const hasECharts = typeof echarts !== "undefined";
  const conn = D.connectivity.summary;
  const recon = D.reconciliation;

  const state = { measure: "filed", time: "snapshot" };
  let historyChart = null;

  // ---- rows for the ranking -----------------------------------------------
  // Filed: one row per site with an active grid filing, from the build's
  // reconciliation (closed filings are already excluded there).
  function filedRows() {
    const rows = recon.projects.map((r) => {
      const p = projectsById.get(r.projectId) || {};
      return {
        href: projectHref(r.projectId),
        ids: uniq(activeFilings.filter((c) => c.linkedProjectId === r.projectId).flatMap((c) => c.sourceIds || [])),
        name: r.name,
        sub: [p.operator, r.state].filter(Boolean).join(" · "),
        stage: p.status || "none",
        segments: [
          { mw: r.grantedMw, pale: false, label: "granted" },
          { mw: r.filedMw - r.grantedMw, pale: true, label: "applied" },
        ],
        total: r.filedMw,
        note: (r.filingCount > 1 ? `${r.filingCount} filings` : "1 filing") +
          (projectCaveatMw(r.projectId) ? `; ${mw(projectCaveatMw(r.projectId))} MW press-reported, being checked` : ""),
      };
    });
    recon.unlinked.forEach((u) => {
      const granted = GRANTED.has(u.status) ? u.quantumMW : 0;
      rows.push({
        href: filingHref(u.id),
        ids: connById.get(u.id)?.sourceIds || [],
        name: u.operator,
        sub: [connById.get(u.id)?.tier, u.state].filter(Boolean).join(" · "),
        stage: "none",
        segments: [
          { mw: granted, pale: false, label: "granted" },
          { mw: u.quantumMW - granted, pale: true, label: "applied" },
        ],
        total: u.quantumMW,
        note: "1 filing",
      });
    });
    return rows.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  }

  // Announced: one row per project whose IT load is disclosed. MoU rows show,
  // flagged, but stay outside the headline figure.
  function announcedRows() {
    return data.projects
      .filter((p) => p.capacity && typeof p.capacity.itLoadMw === "number")
      .map((p) => ({
        href: projectHref(p.id),
        ids: p.sourceIds || [],
        name: p.name,
        sub: [p.operator, p.location?.state].filter(Boolean).join(" · "),
        stage: p.status,
        segments: [{ mw: p.capacity.itLoadMw, pale: false, label: "IT load" }],
        total: p.capacity.itLoadMw,
        // Missing flag means "in headline", as in the build and the old app.
        note: p.includeInHeadline !== false ? "" : "outside the headline",
      }))
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  }

  function currentRows() {
    return state.measure === "filed" ? filedRows() : announcedRows();
  }

  // ---- the answer ----------------------------------------------------------
  function renderAnswer() {
    const states = Object.entries(conn.byStateMw || {})
      .filter(([name]) => name && name !== "Unspecified")
      .sort((a, b) => b[1] - a[1]);
    const topTwo = states.slice(0, 2);
    const topShare = pct(topTwo.reduce((s, [, v]) => s + v, 0), conn.totalMW);
    const commissioned = recon.totals.commissionedMw || 0;
    const known = data.projects.filter((p) => p.includeInHeadline !== false && typeof p.capacity?.itLoadMw === "number").length;
    // Four figures, each with its comparison, then one strip that sets filed,
    // granted and announced load on a common scale.
    const figures = [
      { value: mw(conn.totalMW), unit: "MW", label: `asked of the grid, in ${conn.count} active filings${caveatMw ? `; ${mw(caveatMw)} MW of it still being checked (see the note below)` : ""}` },
      { value: mw(conn.grantedMW), unit: "MW", label: `granted: ${pct(conn.grantedMW, conn.totalMW)}% of what is filed. ${commissioned ? `${mw(commissioned)} MW commissioned` : "None commissioned in this tracker yet"}` },
      topTwo.length ? { value: String(topShare), unit: "%", label: `of filed megawatts in ${topTwo.map(([n]) => n).join(" and ")}` } : null,
      { value: mw(D.headlineKnownCapacityMw), unit: "MW", label: `announced IT load, servers only, at ${known} headline projects` },
    ].filter(Boolean);
    qs("#answer-figures").innerHTML = figures
      .map((f) => `<div><dt>${esc(f.value)}<small>${f.unit}</small></dt><dd>${esc(f.label)}</dd></div>`).join("");

    const max = Math.max(conn.totalMW, D.headlineKnownCapacityMw, 1);
    const w = (v) => `${(v / max) * 100}%`;
    qs("#scale-strip").innerHTML = `
      <div class="strip-row">
        <span class="strip-label">Filed with the grid</span>
        <span class="strip-track" role="img" aria-label="${mw(conn.totalMW)} MW filed: ${mw(conn.grantedMW)} MW granted, ${mw(conn.appliedMW)} MW applied">
          <span class="strip-seg granted" style="width:${w(conn.grantedMW)}"><span>${mw(conn.grantedMW)} granted</span></span>
          <span class="strip-seg applied" style="width:${w(conn.appliedMW)}"><span>${mw(conn.appliedMW)} applied, under process</span></span>
        </span>
      </div>
      <div class="strip-row">
        <span class="strip-label">Announced IT load</span>
        <span class="strip-track" role="img" aria-label="${mw(D.headlineKnownCapacityMw)} MW announced IT load">
          <span class="strip-seg announced" style="width:${w(D.headlineKnownCapacityMw)}"><span>${mw(D.headlineKnownCapacityMw)}</span></span>
        </span>
      </div>
      <p class="strip-note">Megawatts, on one scale. A filing covers the whole site’s draw, cooling included; announced load covers the servers alone. Each filing links to the register entry, order or report it comes from.${caveatMw ? ` <strong>Caveat:</strong> ${esc(totalCaveat(conn.totalMW))}` : ""}</p>`;
  }

  // ---- ranking: snapshot --------------------------------------------------
  function renderBars() {
    const rows = currentRows();
    const max = Math.max(...rows.map((r) => r.total), 1);
    qs("#bars").innerHTML = rows.map((r, i) => {
      const segs = r.segments.filter((s) => s.mw > 0).map((s) =>
        `<span class="bar-seg" style="width:${(s.mw / max) * 100}%;background:${stageColor(r.stage, s.pale)}" title="${mw(s.mw)} MW ${esc(s.label)}"></span>`
      ).join("");
      const split = state.measure === "filed"
        ? `<span>${mw(r.segments[0].mw)} granted</span>`
        : "";
      const flag = r.note && state.measure === "announced" ? `<span class="flag">${esc(r.note)}</span>` : "";
      return `<li class="bar-row">
        <span class="bar-rank">${i + 1}</span>
        <span class="bar-name"><strong><a href="${esc(r.href)}">${esc(r.name)}</a>${flag}</strong><span>${esc(r.sub)} · ${esc(stageLabels[r.stage])}${state.measure === "filed" ? " · " + esc(r.note) : ""}</span>${sourceLinks(r.ids)}</span>
        <span class="bar-track" role="img" aria-label="${mw(r.total)} MW">${segs}</span>
        <span class="bar-value">${mw(r.total)} MW${split}</span>
      </li>`;
    }).join("");

    const total = rows.reduce((s, r) => s + r.total, 0);
    if (state.measure === "filed") {
      qs("#ranking-total").innerHTML = `Total <strong>${mw(total)} MW</strong> filed: ${mw(conn.grantedMW)} MW granted, ${mw(conn.appliedMW)} MW applied.` +
        (caveatMw ? ` ${esc(totalCaveat(total))}` : "") +
        (conn.closedCount ? ` ${conn.closedCount} closed ${conn.closedCount === 1 ? "filing" : "filings"} (${mw(conn.byStatusMw.closed)} MW) ${conn.closedCount === 1 ? "is" : "are"} kept as history and left out.` : "");
      // Any filing, closed included, takes a project off the "no filing" list.
      const linked = new Set((data.connectivity || []).map((c) => c.linkedProjectId).filter(Boolean));
      const without = data.projects.filter((p) => !linked.has(p.id)).map((p) => p.name);
      qs("#ranking-missing").textContent = without.length
        ? `${without.length} of ${data.projects.length} tracked projects have no grid filing in this tracker yet: ${without.join("; ")}.`
        : "";
    } else {
      const outside = rows.filter((r) => r.note).reduce((s, r) => s + r.total, 0);
      qs("#ranking-total").innerHTML = `Total <strong>${mw(total)} MW</strong> announced. ${mw(D.headlineKnownCapacityMw)} MW counts in the headline` +
        (outside ? `; ${mw(outside)} MW stays outside the headline until land, money, a grid connection or construction shows up.` : ".");
      const silent = data.projects.filter((p) => !(p.capacity && typeof p.capacity.itLoadMw === "number")).map((p) => p.name);
      qs("#ranking-missing").textContent = silent.length
        ? `${silent.length} of ${data.projects.length} tracked projects have not disclosed an IT-load figure, so they cannot be ranked here: ${silent.join("; ")}.`
        : "";
    }
  }

  // ---- ranking: over time --------------------------------------------------
  // Filed history is measured: one point per captured monthly snapshot, with
  // gaps left where no snapshot was taken. Announced history is reconstructed
  // from each project's first public report and says so.
  function filedHistory() {
    const snaps = (D.snapshotHistory || []).filter((s) => s.connectivitySummary);
    if (!snaps.length) return { months: [], granted: [], applied: [], missing: [] };
    const byMonth = new Map(snaps.map((s) => [s.month, s.connectivitySummary]));
    const months = [];
    const [y0, m0] = snaps[0].month.split("-").map(Number);
    const [y1, m1] = snaps[snaps.length - 1].month.split("-").map(Number);
    for (let y = y0, m = m0; y < y1 || (y === y1 && m <= m1); m === 12 ? (y++, m = 1) : m++) {
      months.push(`${y}-${String(m).padStart(2, "0")}`);
    }
    return {
      months,
      granted: months.map((k) => (byMonth.has(k) ? byMonth.get(k).grantedMW : null)),
      applied: months.map((k) => (byMonth.has(k) ? byMonth.get(k).appliedMW : null)),
      missing: months.filter((k) => !byMonth.has(k)),
    };
  }

  function renderHistory() {
    const el = qs("#history-chart");
    if (!hasECharts) { el.innerHTML = '<p class="empty">The chart library did not load.</p>'; return; }
    if (historyChart) historyChart.dispose();
    historyChart = echarts.init(el, null, { renderer: "svg" });
    const ink = cssVar("--ink"), soft = cssVar("--ink-soft"), rule = cssVar("--rule");
    const axisLabel = { color: soft, fontFamily: "Newsreader, Georgia, serif", fontSize: 13 };
    const base = {
      textStyle: { fontFamily: "Newsreader, Georgia, serif" },
      grid: { left: 56, right: 16, top: 30, bottom: 30 },
      tooltip: {
        trigger: "axis", backgroundColor: cssVar("--paper"), borderColor: rule, textStyle: { color: ink, fontSize: 13 },
        valueFormatter: (v) => (v === null || v === undefined ? "no snapshot" : mw(v) + " MW"),
      },
      yAxis: { type: "value", name: "MW", nameTextStyle: { color: soft }, splitLine: { lineStyle: { color: rule } }, axisLabel },
    };
    if (state.measure === "filed") {
      const h = filedHistory();
      historyChart.setOption({
        ...base,
        xAxis: { type: "category", data: h.months.map(shortMonth), axisLine: { lineStyle: { color: rule } }, axisTick: { show: false }, axisLabel },
        series: [
          { name: "Granted", type: "bar", stack: "f", barMaxWidth: 64, itemStyle: { color: ink }, data: h.granted },
          { name: "Applied", type: "bar", stack: "f", barMaxWidth: 64, itemStyle: { color: stageColor("none", true) }, data: h.applied },
        ],
      });
      el.setAttribute("aria-label", "Filed grid megawatts at each monthly snapshot, split into granted and applied");
      const first = h.months[0];
      qs("#ranking-sub").textContent = first
        ? `Measured: total filed megawatts at each monthly snapshot since measurement began in ${monthName(first)}.` +
          (h.missing.length ? ` No snapshot was taken in ${h.missing.map(monthName).join(", ")}, so that month is blank.` : "")
        : "No monthly snapshots have been captured yet.";
    } else {
      const tl = D.timeline || [];
      historyChart.setOption({
        ...base,
        xAxis: { type: "category", data: tl.map((m) => shortMonth(m.month)), boundaryGap: false, axisLine: { lineStyle: { color: rule } }, axisTick: { show: false }, axisLabel },
        // MoU-stage load is left out here, as it is from the headline.
        series: STAGES.filter((k) => k !== "none" && k !== "mou_speculative").map((k) => ({
          name: stageLabels[k], type: "line", stack: "a", symbol: "none", lineStyle: { width: 1, color: stageColor(k) },
          areaStyle: { color: stageColor(k), opacity: 0.85 }, itemStyle: { color: stageColor(k) },
          data: tl.map((m) => (m.byCurrentStatusMw || {})[k] || 0),
        })),
      });
      el.setAttribute("aria-label", "Announced IT-load megawatts over time, by each project's current stage, reconstructed");
      qs("#ranking-sub").textContent =
        "Reconstructed from sources: cumulative announced IT load, dated to the earliest source we cite for each project and coloured by its stage today. MoU-stage projects are left out, as they are from the headline. Read it as a direction of travel; it is no monthly record.";
    }
  }

  // ---- ranking: frame ----------------------------------------------------
  function renderRanking() {
    const filed = state.measure === "filed";
    const history = state.time === "history";
    qs("#ranking-title").textContent = history
      ? (filed ? "Megawatts filed with the grid, month by month" : "Announced IT load over time")
      : (filed ? "Sites ranked by megawatts filed with the grid" : "Projects ranked by announced IT load");
    qs("#bars").classList.toggle("is-hidden", history);
    qs("#ranking-total").classList.toggle("is-hidden", history);
    qs("#ranking-missing").classList.toggle("is-hidden", history);
    qs("#history").classList.toggle("is-hidden", !history);
    qsa("[data-measure]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.measure === state.measure)));
    qsa("[data-time]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.time === state.time)));

    if (history) {
      renderHistory();
    } else {
      qs("#ranking-sub").textContent = filed
        ? "What each site has formally asked the transmission utility for: the dark part is granted, the pale part is applied and still under process. Filings lead because they are formal requests on a public register; announcements carry no such record."
        : "What press and company statements say each project's servers will draw. Read it beside the grid ranking.";
      renderBars();
    }
    renderLegend();
  }

  function renderLegend() {
    const filed = state.measure === "filed";
    qs("#legend-title").textContent = filed && state.time === "history" ? "Colour shows grant status" : "Colour shows stage";
    if (filed && state.time === "history") {
      qs("#legend").innerHTML =
        `<li><span class="swatch" style="background:${cssVar("--ink")}"></span>Granted</li>` +
        `<li><span class="swatch" style="background:${stageColor("none", true)}"></span>Applied, under process</li>`;
      qs("#legend-tone").textContent = "Monthly snapshots record totals only, without stages, so this view splits granted from applied only.";
      qs("#legend-inline").innerHTML = qs("#legend").innerHTML;
      return;
    }
    const stages = filed ? STAGES
      : STAGES.filter((k) => k !== "none" && !(state.time === "history" && k === "mou_speculative"));
    qs("#legend").innerHTML = stages.map((k) => `<li>${filed
      ? `<span class="swatch-pair"><span class="swatch" style="background:${stageColor(k)}"></span><span class="swatch" style="background:${stageColor(k, true)}"></span></span>`
      : `<span class="swatch" style="background:${stageColor(k)}"></span>`}${esc(stageLabels[k])}</li>`).join("");
    qs("#legend-tone").textContent = filed
      ? "In each pair, the dark tone is megawatts granted and the pale tone is megawatts applied for."
      : "MoU-stage projects show here but stay out of the headline figure.";
    // On narrow screens the side column sits below the chart, so a copy of the
    // key rides along at the top of the ranking instead.
    qs("#legend-inline").innerHTML = qs("#legend").innerHTML;
  }

  // ---- what changed ------------------------------------------------------
  function renderChanges() {
    const cl = D.changeLog || {};
    const prevSnap = (D.snapshotHistory || []).find((s) => s.month === cl.previousMonth);
    const since = prevSnap ? prevSnap.asOf : null;
    qs("#changes-title").textContent = since
      ? `What changed since ${formatDate(since)}`
      : "What changed this month";

    const items = [];
    const projLine = (p, kind, detail) => items.push({ kind, title: p.name, detail, ids: projectsById.get(p.id)?.sourceIds });
    (cl.added || []).forEach((p) => projLine(p, "New project", stageLabels[p.status] || p.status));
    (cl.statusChanged || []).forEach((p) => projLine(p, "Stage moved", `${stageLabels[p.from] || p.from} to ${stageLabels[p.to] || p.to}`));
    const mwOr = (v) => (v === null || v === undefined ? "undisclosed" : `${mw(v)} MW`);
    (cl.mwChanged || []).forEach((p) => projLine(p, "IT load revised", `${mwOr(p.from)} to ${mwOr(p.to)}`));
    const cc = cl.connectivity || {};
    const connLine = (r, kind, detail) => items.push({ kind, title: r.operator || r.id, detail, ids: connById.get(r.id)?.sourceIds });
    (cc.added || []).forEach((r) => connLine(r, "New grid filing", `${mwOr(r.quantumMW)}, ${r.status}${r.tier ? ", " + r.tier : ""}`));
    (cc.statusChanged || []).forEach((r) => connLine(r, "Filing status changed", `${r.from} to ${r.to}`));
    (cc.quantumChanged || []).forEach((r) => connLine(r, "Filed megawatts revised", `${mwOr(r.from)} to ${mwOr(r.to)}`));
    (cc.removed || []).forEach((r) => connLine(r, "Filing removed", mwOr(r.quantumMW)));
    (cl.removed || []).forEach((p) => projLine(p, "Project removed", ""));

    qs("#change-list").innerHTML = items.length
      ? items.map((it) => `<li><span class="change-kind">${esc(it.kind)}</span><strong>${esc(it.title)}</strong>${it.detail ? `: ${esc(it.detail)}` : ""}${sourceLinks(it.ids)}</li>`).join("")
      : `<li class="empty">${cl.previousMonth ? "No changes to projects or grid filings since the last snapshot." : "This is the first snapshot; changes appear from the next one."}</li>`;

    const asOf = data.meta.asOf;
    const signals = (data.monthlySignals || [])
      // By event date: on or after the previous snapshot, or within this month
      // when there is none. Late finds dated earlier do not show here.
      .filter((s) => (since ? s.date >= since : s.date.slice(0, 7) === asOf.slice(0, 7)) && s.date <= asOf)
      .sort((a, b) => b.date.localeCompare(a.date));
    qs("#signals-title").textContent = "In filings, orders and the press";
    qs("#signal-list").innerHTML = signals.length
      ? signals.map((s) => `<li><span class="signal-date">${esc(formatDate(s.date))}</span><strong>${esc(s.headline)}</strong><p>${esc(s.whyItMatters)}</p>${sourceLinks(s.sourceIds)}</li>`).join("")
      : '<li class="empty">No new signals in this period.</li>';
  }

  // ---- CSV ---------------------------------------------------------------
  const round = (v) => Math.round(Number(v || 0) * 10) / 10;
  function downloadCsv() {
    const filed = state.measure === "filed";
    const rows = currentRows();
    const headers = filed
      ? ["rank", "site", "operator_and_state", "stage", "filed_mw", "granted_mw", "applied_mw"]
      : ["rank", "project", "operator_and_state", "stage", "announced_it_mw", "in_headline"];
    const body = rows.map((r, i) => filed
      ? [i + 1, r.name, r.sub, stageLabels[r.stage], round(r.total), round(r.segments[0].mw), round(r.segments[1].mw)]
      : [i + 1, r.name, r.sub, stageLabels[r.stage], round(r.total), r.note ? "no" : "yes"]);
    // A leading = + - @ would make a spreadsheet run the cell as a formula.
    const cell = (v) => { let s = String(v ?? ""); if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[",\n\r]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s; };
    const csv = [headers.join(",")].concat(body.map((r) => r.map(cell).join(","))).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `india-datacenter-watch-${filed ? "filed" : "announced"}-${data.meta.asOf}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  // ---- shell -------------------------------------------------------------
  function renderShell() {
    const firstSnap = ((D.snapshotHistory || [])[0] || {}).month;
    renderMasthead();
    qs("#scope-note").textContent =
      `${data.projects.length} tracked projects. ${data.meta.scopeNote}` +
      (firstSnap ? ` Grid-filing history is measured monthly from ${monthName(firstSnap)}; announced-load history is reconstructed from cited sources, and both are labelled.` : "");
  }

  function bindEvents() {
    qsa("[data-measure]").forEach((b) => b.addEventListener("click", () => { state.measure = b.dataset.measure; renderRanking(); }));
    qsa("[data-time]").forEach((b) => b.addEventListener("click", () => { state.time = b.dataset.time; renderRanking(); }));
    qs("#download-csv").addEventListener("click", downloadCsv);
    window.addEventListener("resize", () => historyChart && historyChart.resize());
    // Print always shows the snapshot ranking.
    let before = null;
    window.addEventListener("beforeprint", () => { if (state.time === "history") { before = state.time; state.time = "snapshot"; renderRanking(); } });
    window.addEventListener("afterprint", () => { if (before) { state.time = before; before = null; renderRanking(); } });
  }

  renderShell();
  renderAnswer();
  renderRanking();
  renderChanges();
  bindEvents();
})();
