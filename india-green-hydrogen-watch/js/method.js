// Method: stage rules, statuses, units, press-reported figures, the Mission.
(function () {
  const G = window.GHW;
  if (!G) return;
  const { data, P, M, qs, esc, num, formatDate, sourceLinks, tag, statusLabels } = G;

  G.renderMasthead();
  qs("#disclaimer").textContent = data.site.disclaimer;

  qs("#stage-terms").innerHTML = Object.entries(P.stageDefinitions).map(([k, v]) => `<div><dt>${esc(P.stageLabels[k])}</dt><dd>${esc(v)}</dd></div>`).join("") +
    `<div><dt>Due by now</dt><dd>Used for electrolyser factories in place of a signed buyer: the awarded capacity whose scheduled date has passed. A factory award has no buyer stage.</dd></div>`;

  const statusMeaning = {
    due: "The scheduled date has not arrived.",
    overdue: "The scheduled date has passed and we have found no record of commissioning under the award. An extension may exist that is not public.",
    "part-operating-late": "Some capacity has a commissioning record; the scheduled date for the rest has passed without one.",
    "part-operating": "Some of the awarded capacity has a commissioning record.",
    operating: "All of the awarded capacity has a commissioning record.",
    "contracted-official": "A buyer agreement for this ammonia lot is confirmed by an official or company record.",
    "contracted-press": "A buyer agreement for this lot is reported by the press.",
    "no-agreement-found": "We have found no buyer agreement for this ammonia lot.",
    contracted: "The refinery has signed a supply contract with the developer.",
    awarded: "Awarded; no supply contract found yet.",
  };
  qs("#status-terms").innerHTML = Object.entries(statusMeaning).map(([k, v]) => `<div><dt>${G.statusChip(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  qs("#units-list").innerHTML = (P.doNotAdd || []).map((t) => `<li>${esc(t)}</li>`).join("") +
    `<li>Sizes of plants and deals are shown as each source states them: megawatts of electrolysers, tonnes a day or tonnes a year. We do not convert one into another.</li>`;

  // Every figure that rests on press reports, gathered from the data.
  const press = [];
  P.ladders.forEach((l) => l.stages.forEach((s) => {
    if (s.basis === "press") press.push({ what: `${l.title}: ${G.stageLabel(l, s).toLowerCase()}, ${num(s.value)} ${l.unit}`, note: s.note, ids: s.sourceIds });
    if (s.caveat) press.push({ what: `${l.title}: ${num(s.caveat.value)} ${l.unit} awarded`, note: s.caveat.text, ids: s.caveat.sourceIds });
  }));
  (P.context || []).filter((c) => c.basis === "press").forEach((c) => press.push({ what: `${c.label}: ${c.value}`, note: c.note, ids: c.sourceIds }));
  data.tracks.forEach((t) => t.parameters.filter((p) => p.confidence === "reported").forEach((p) => {
    if (!press.some((x) => x.ids.join() === p.sourceIds.join() && x.what.includes(p.value.split(" ")[0]))) press.push({ what: `${t.title}: ${p.label}, ${p.value}`, note: "", ids: p.sourceIds });
  }));
  const pressAwards = M.ammoniaAuctions.filter((r) => r.status === "contracted-press");
  if (pressAwards.length) press.push({ what: `Buyer agreements for ${pressAwards.length} ammonia lots`, note: "Each is marked on the Awards page.", ids: [...new Set(pressAwards.flatMap((r) => r.evidence.flatMap((e) => e.sourceIds)))] });
  qs("#press-list").innerHTML = press.map((p) => `<li><strong>${esc(p.what)}</strong>${p.note ? `<p>${esc(p.note)}</p>` : ""}${sourceLinks(p.ids)}</li>`).join("");

  const glossary = [
    ["SIGHT", "Strategic Interventions for Green Hydrogen Transition: the Mission’s incentive programme. Mode 1 pays incentives on hydrogen produced; Mode 2A buys green ammonia for fertiliser plants through auctions; Mode 2B buys hydrogen for refineries. A separate SIGHT incentive supports electrolyser manufacturing."],
    ["SECI", "Solar Energy Corporation of India, the government company that runs the SIGHT auctions."],
    ["MNRE", "Ministry of New and Renewable Energy, which runs the Mission."],
    ["Electrolyser", "Equipment that splits water into hydrogen and oxygen using electricity. Alkaline and PEM (proton exchange membrane) are the two common types."],
    ["Purchase agreement", "In the ammonia auctions, a GAPA (green ammonia purchase agreement) between SECI and the supplier, for supply to a named fertiliser plant."],
    ["FID", "Final investment decision: a company’s decision to fund a project. It precedes construction."],
    ["BOO", "Build, own, operate: the developer builds and runs the plant and sells its output."],
    ["DRI", "Direct reduced iron, a way of making iron for steel in which hydrogen can replace gas or coal."],
    ["t/yr, MW/yr", "Tonnes a year; megawatts of electrolysers a factory can make in a year. KTPA means thousand tonnes a year. MTPA is used both ways in sources: metric tonnes a year in SECI documents, million tonnes a year in some company and lender documents. We say which where it matters."],
  ];
  qs("#glossary-terms").innerHTML = glossary.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join("");

  const mission = G.trackMap.get("mission-architecture");
  qs("#mission-note").textContent = mission ? mission.stageNote : "";
  qs("#mission-params").innerHTML = mission ? mission.parameters.map((p) => `<div><dt>${esc(p.label)}</dt><dd>${esc(p.value)}${p.confidence === "reported" ? tag("Press-reported") : ""} ${sourceLinks(p.sourceIds)}</dd></div>`).join("") : "";
})();
