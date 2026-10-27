// Overview: the question, one ladder per scheme, what changed, scheduled dates.
(function () {
  const G = window.GHW;
  if (!G) return;
  const { data, P, M, D, qs, esc, num, pct, formatDate, sourceLinks, tag, basisTag, stageLabel, stageFigure } = G;

  G.renderMasthead();
  qs("#question").textContent = P.question;
  qs("#answer-key").innerHTML = `Four schemes under SIGHT, the government’s incentive programme for green hydrogen and electrolysers, each counted in its own unit. A stage counts only with the evidence described in the <a href="method.html#stages">Method</a>.`;
  qs("#strip-key").innerHTML = ["awarded", "contracted", "building", "operating"].map((k) => `<li><span class="swatch seg-${k}"></span>${esc(P.stageLabels[k])}</li>`).join("") + `<li><span class="swatch seg-press"></span>Press-reported</li>`;

  // ---- ladders --------------------------------------------------------------
  function ladderStrip(ladder) {
    const awarded = ladder.stages[0].value || 1;
    // Nested bars on one scale: each later stage drawn over the awarded total.
    const later = ladder.stages.slice(1).filter((s) => typeof s.value === "number" && s.inStrip !== false);
    const segs = later.map((s) => {
      const w = Math.max((s.value / awarded) * 100, s.value > 0 ? 0.4 : 0);
      return `<span class="ladder-seg seg-${s.stage}${s.basis === "press" ? " seg-press" : ""}" style="width:${w}%"></span>`;
    }).join("");
    const label = later.map((s) => `${stageLabel(ladder, s)} ${num(s.value)} (${pct(s.value, awarded)}%)`).join("; ");
    return `<div class="ladder-strip" role="img" aria-label="${esc(`Of ${num(awarded)} ${ladder.unitLong} awarded: ${label}`)}"><span class="ladder-seg seg-awarded" style="width:100%"></span>${segs}</div>`;
  }
  function stageCell(ladder, st, i) {
    const awarded = ladder.stages[0].value;
    const share = i > 0 && typeof st.value === "number" && awarded ? `<span class="share">${pct(st.value, awarded)}% of awarded</span>` : "";
    const cav = st.caveat ? `<span class="caveat">${esc(st.caveat.text)} ${sourceLinks(st.caveat.sourceIds)}</span>` : "";
    return `<div class="stage stage-${st.stage}">
      <dt>${stageFigure(ladder, st)}</dt>
      <dd><strong>${esc(stageLabel(ladder, st))}</strong>${tag(basisTag[st.basis])} ${share}
        <span class="stage-note">${esc(st.note || "")}</span>${sourceLinks(st.sourceIds)}${cav}</dd>
    </div>`;
  }
  qs("#ladders").innerHTML = P.ladders.map((l) => `
    <article class="ladder" id="ladder-${esc(l.id)}">
      <header class="ladder-head">
        <h2>${esc(l.title)}</h2>
        <p>${esc(l.instrument)} · ${esc(l.unitLong)}</p>
      </header>
      ${ladderStrip(l)}
      <dl class="stages">${l.stages.map((s, i) => stageCell(l, s, i)).join("")}</dl>
    </article>`).join("");

  qs("#context").innerHTML = (P.context || []).map((c) => `
    <div><dt>${esc(c.value)}</dt><dd>${esc(c.label)}${tag(basisTag[c.basis])} ${c.note ? `<span class="stage-note">${esc(c.note)}</span>` : ""}${sourceLinks(c.sourceIds)}</dd></div>`).join("");

  // ---- what changed ---------------------------------------------------------
  const edition = data.editions[0];
  qs("#changes-title").textContent = `New in the ${formatDate(edition.id)} edition`;
  qs("#edition-note").textContent = edition.note;
  const items = data.events.filter((e) => e.editionId === edition.id);
  qs("#change-list").innerHTML = items.length ? items.map((e) => {
    const track = G.trackMap.get(e.trackId);
    return `<li id="${esc(e.id)}">
      <span class="signal-date">${formatDate(e.date)}${track ? ` · <a href="policy.html#${esc(track.id)}">${esc(track.title)}</a>` : ""}</span>
      <strong>${esc(e.title)}</strong>${e.confidence === "reported" ? tag("Press-reported") : ""}
      <p>${esc(e.detail)}</p>
      ${e.significance ? `<p class="${e.analysis ? "analysis" : ""}">${e.analysis ? tag("Analysis") : ""}${esc(e.significance)}</p>` : ""}
      ${sourceLinks(e.sourceIds)}
    </li>`;
  }).join("") : `<li class="empty">No new developments in this edition.</li>`;

  // ---- scheduled dates ------------------------------------------------------
  const groups = new Map();
  function add(key, due, label, unit, row) {
    if (!groups.has(key)) groups.set(key, { due, label, unit, rows: [] });
    groups.get(key).rows.push(row);
  }
  M.productionAwards.forEach((r) => add(`p-${r.tranche}`, r.scd, `Hydrogen production, ${G.roman(r.tranche)}`, "t/yr", r));
  M.electrolyserAwards.forEach((r) => add(`e-${r.tranche}`, r.scd, `Electrolyser factories, ${G.roman(r.tranche)}`, "MW/yr", r));
  (M.refineryAwards || []).forEach((r) => add(`r-${r.refinery}`, r.scd || "9999", `Refinery supply: ${r.refinery}`, "t/yr", r));
  const rows = [...groups.values()].map((g) => {
    const dates = [...new Set(g.rows.map((r) => r.scd).filter(Boolean))].sort();
    const capacity = g.rows.reduce((t, r) => t + r.capacity, 0);
    const built = g.rows.reduce((t, r) => t + (r.operatingValue || 0), 0);
    const late = g.rows.filter((r) => r.status === "overdue").length;
    const partLate = g.rows.filter((r) => r.status === "part-operating-late").length;
    const signed = g.rows.filter((r) => r.status === "contracted").length;
    let shows;
    if (built) shows = `${num(built)} ${g.unit} operating (${pct(built, capacity)}%).`;
    else shows = "Nothing operating yet.";
    if (late) shows += ` ${late} of ${g.rows.length} awards past their date with commissioning under the award not confirmed.`;
    if (partLate) shows += ` ${partLate} ${partLate === 1 ? "award is" : "awards are"} partly operating, with the rest past its date.`;
    if (signed) shows += " Supply contract signed.";
    const dueText = g.rows[0].scdLabel ? g.rows[0].scdLabel
      : dates.length > 1 ? `${formatDate(dates[0])} to ${formatDate(dates[dates.length - 1])}` : formatDate(dates[0]);
    const passed = dates.length && dates[dates.length - 1] < D.asOf;
    return { sort: dates[0] || "9999", html: `<tr class="${passed ? "is-past" : ""}">
      <td class="nowrap">${esc(dueText)}${passed ? `<span class="bar-sub">passed</span>` : ""}</td>
      <td class="list-name">${esc(g.label)}<span>${g.rows.length} award${g.rows.length === 1 ? "" : "s"}</span></td>
      <td class="num" data-label="Capacity">${num(capacity)} ${esc(g.unit)}</td>
      <td>${esc(shows)}</td></tr>` };
  }).sort((a, b) => a.sort.localeCompare(b.sort));
  qs("#deadline-body").innerHTML = rows.map((r) => r.html).join("");

  qs("#scope-note").textContent = data.site.methodNote;
})();
