// Awards: the four award books, each row with its date, status and evidence.
(function () {
  const G = window.GHW;
  if (!G) return;
  const { M, D, P, qs, esc, num, pct, formatDate, sourceLinks, statusChip, rowEvidence, ladderById } = G;

  G.renderMasthead();
  qs("#lede").textContent = "Every award under SIGHT (Strategic Interventions for Green Hydrogen Transition), the government’s incentive programme, that this tracker follows, with its scheduled date and what the public record shows about delivery. A status is our reading of the evidence linked in the same row.";

  // SECI's award table backs every row; name it once per section and link only other sources per row.
  const seci = G.sourceMap.get("S01");
  const seciNote = ` Source for each award: ${G.sourceLink(seci, "SECI’s award table")} unless the row says otherwise.`;
  const rowSources = (ids) => sourceLinks((ids || []).filter((id) => id !== "S01"));
  const sum = (rows, key) => rows.reduce((t, r) => t + (r[key] || 0), 0);
  const count = (rows, status) => rows.filter((r) => r.status === status).length;
  function head(cols) {
    return `<thead><tr>${cols.map(([label, cls]) => `<th scope="col"${cls ? ` class="${cls}"` : ""}>${esc(label)}</th>`).join("")}</tr></thead>`;
  }
  function statusCell(r) {
    return `<td class="status-cell">${statusChip(r.status)}${rowEvidence(r)}</td>`;
  }
  function caveatFor(id) {
    const st = ladderById.get(id).stages[0];
    return st.caveat ? `<p class="caveat">${esc(st.caveat.text)} ${sourceLinks(st.caveat.sourceIds)}</p>` : "";
  }

  // ---- hydrogen production --------------------------------------------------
  const prod = M.productionAwards;
  qs("#production-note").innerHTML = `${prod.length} awards totalling ${num(sum(prod, "capacity"))} tonnes of hydrogen a year, under the SIGHT Mode 1 production incentive. Tranche I is due in February 2027; Tranche II in February and March 2028. ${(() => { const n = prod.filter(G.isPart).length; return n === 1 ? "1 award is" : `${n} awards are`; })()} partly operating.${seciNote}` + caveatFor("mode1");
  qs("#production-table").innerHTML = head([["Company"], ["Tranche"], ["Capacity", "num"], ["Due"], ["Status and evidence"]]) +
    `<tbody>${prod.map((r) => `<tr>
      <td class="list-name"><strong>${esc(r.company)}</strong>${rowSources(r.sourceIds)}</td>
      <td class="nowrap" data-label="Tranche">${esc(G.roman(r.tranche))}</td>
      <td class="num" data-label="Capacity">${num(r.capacity)} t/yr</td>
      <td class="nowrap" data-label="Due">${formatDate(r.scd)}</td>
      ${statusCell(r)}</tr>`).join("")}</tbody>
    <tfoot><tr><th scope="row" colspan="2">All ${prod.length} awards</th><td class="num" data-label="Capacity">${num(sum(prod, "capacity"))} t/yr</td><td></td><td>${num(sum(prod, "operatingValue"))} t/yr operating</td></tr></tfoot>`;

  // ---- refinery supply ------------------------------------------------------
  const ref = M.refineryAwards || [];
  qs("#refinery-note").textContent = `${ref.length} refinery projects totalling ${num(sum(ref, "capacity"))} tonnes of hydrogen a year, procured by the oil companies under SIGHT Mode 2B. The developer builds and runs the plant and sells the hydrogen to the refinery. Some of these developers also hold production awards above; the two schemes are counted separately.`;
  qs("#refinery-table").innerHTML = head([["Refinery"], ["Developer"], ["Capacity", "num"], ["Due"], ["Status and evidence"]]) +
    `<tbody>${ref.map((r) => `<tr>
      <td class="list-name"><strong>${esc(r.refinery)}</strong><span>${esc(r.location)}</span>${rowSources(r.sourceIds)}</td>
      <td data-label="Developer">${esc(r.developer)}</td>
      <td class="num" data-label="Capacity">${num(r.capacity)} t/yr</td>
      <td class="nowrap" data-label="Due">${esc(r.scdLabel)}</td>
      ${statusCell(r)}</tr>`).join("")}</tbody>
    <tfoot><tr><th scope="row" colspan="2">All ${ref.length} projects</th><td class="num" data-label="Capacity">${num(sum(ref, "capacity"))} t/yr</td><td></td><td></td></tr></tfoot>`;

  // ---- green ammonia --------------------------------------------------------
  const amm = [...M.ammoniaAuctions].sort((a, b) => a.price - b.price);
  const signed = amm.filter((r) => r.status.startsWith("contracted"));
  const prices = amm.map((r) => r.price);
  const weighted = sum(amm.map((r) => ({ v: r.price * r.volume })), "v") / sum(amm, "volume");
  qs("#ammonia-note").innerHTML = `${amm.length} lots auctioned in 2025 for ${num(sum(amm, "volume"))} tonnes of ammonia a year, to supply fertiliser plants for ten years under SIGHT Mode 2A. Prices ran from ₹${prices[0].toFixed(2)} to ₹${prices[prices.length - 1].toFixed(2)} a kilogram; the volume-weighted average is ₹${weighted.toFixed(2)}. Buyer agreements are recorded for ${signed.length} of the ${amm.length}, covering ${num(sum(signed, "volume"))} tonnes a year; all but one of those rest on press reports. Sorted by price.${seciNote}`;
  const maxPrice = Math.max(...prices);
  qs("#ammonia-table").innerHTML = head([["Buyer and site"], ["Supplier"], ["Volume", "num"], ["Price, ₹/kg"], ["Awarded"], ["Status and evidence"]]) +
    `<tbody>${amm.map((r) => `<tr>
      <td class="list-name"><strong>${esc(r.buyer)}</strong><span>${esc(r.location)}</span>${rowSources(r.sourceIds)}</td>
      <td data-label="Supplier">${esc(r.winner)}</td>
      <td class="num" data-label="Volume">${num(r.volume)} t/yr</td>
      <td class="price-cell" data-label="Price"><span class="price-bar" style="width:${(r.price / maxPrice) * 100}%" aria-hidden="true"></span><span class="price-value">₹${r.price.toFixed(2)}</span></td>
      <td class="nowrap" data-label="Awarded">${formatDate(r.loaDate)}</td>
      ${statusCell(r)}</tr>`).join("")}</tbody>
    <tfoot><tr><th scope="row" colspan="2">All ${amm.length} lots</th><td class="num" data-label="Volume">${num(sum(amm, "volume"))} t/yr</td><td>₹${weighted.toFixed(2)} weighted</td><td></td><td>${num(sum(signed, "volume"))} t/yr with a buyer agreement</td></tr></tfoot>`;

  // ---- electrolyser factories -----------------------------------------------
  const ely = M.electrolyserAwards;
  const t1 = ely.filter((r) => r.tranche === "T1");
  qs("#electrolyser-note").innerHTML = `${ely.length} awards for ${num(sum(ely, "capacity"))} megawatts a year of electrolyser manufacturing, under the SIGHT manufacturing incentive. All ${t1.length} Tranche I awards (${num(sum(t1, "capacity"))} MW a year) passed their scheduled dates in August 2026; ${num(sum(t1, "operatingValue"))} MW a year of commissioning is documented (${pct(sum(t1, "operatingValue"), sum(t1, "capacity"))}%). Tranche II is due on 26 March 2027.${seciNote}`;
  qs("#electrolyser-table").innerHTML = head([["Company"], ["Tranche"], ["Technology"], ["Capacity", "num"], ["Due"], ["Status and evidence"]]) +
    `<tbody>${ely.map((r) => `<tr>
      <td class="list-name"><strong>${esc(r.company)}</strong>${rowSources(r.sourceIds)}</td>
      <td class="nowrap" data-label="Tranche">${esc(G.roman(r.tranche))}</td>
      <td data-label="Technology">${esc(r.technology)}</td>
      <td class="num" data-label="Capacity">${num(r.capacity)} MW/yr</td>
      <td class="nowrap" data-label="Due">${formatDate(r.scd)}</td>
      ${statusCell(r)}</tr>`).join("")}</tbody>
    <tfoot><tr><th scope="row" colspan="3">All ${ely.length} awards</th><td class="num" data-label="Capacity">${num(sum(ely, "capacity"))} MW/yr</td><td></td><td>${num(sum(ely, "operatingValue"))} MW/yr operating</td></tr></tfoot>`;

  // ---- download -------------------------------------------------------------
  const allSources = (r) => r.sourceIds.concat(...(r.evidence || []).map((e) => e.sourceIds), ...(r.notes || []).map((n) => n.sourceIds));
  const evidenceText = (r) => (r.evidence || []).map((e) => e.text).concat((r.notes || []).map((n) => n.text)).join(" | ");
  qs("#download-csv").addEventListener("click", () => {
    const rows = [
      ...prod.map((r) => ["Hydrogen production (Mode 1)", r.company, "", r.tranche, r.capacity, "t/yr H2", "", r.scd, G.statusLabels[r.status], evidenceText(r), G.sourceText(allSources(r))]),
      ...ref.map((r) => ["Refinery supply (Mode 2B)", r.developer, r.refinery, "", r.capacity, "t/yr H2", "", r.scd || r.scdLabel, G.statusLabels[r.status], evidenceText(r), G.sourceText(allSources(r))]),
      ...M.ammoniaAuctions.map((r) => ["Green ammonia (Mode 2A)", r.winner, `${r.buyer}, ${r.location}`, "", r.volume, "t/yr NH3", r.price, r.loaDate, G.statusLabels[r.status], evidenceText(r), G.sourceText(allSources(r))]),
      ...ely.map((r) => ["Electrolyser factory", r.company, r.technology, r.tranche, r.capacity, "MW/yr", "", r.scd, G.statusLabels[r.status], evidenceText(r), G.sourceText(allSources(r))]),
    ];
    G.downloadCsv(`india-green-hydrogen-awards-${D.asOf}.csv`, ["Scheme", "Awardee", "Buyer, site or technology", "Tranche", "Capacity", "Unit", "Price (Rs/kg)", "Scheduled date or award date", "Status", "Evidence and notes", "Sources"], rows);
  });
})();
