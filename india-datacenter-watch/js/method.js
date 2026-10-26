(function () {
  if (!window.DCW) return;
  const {
    data, D, stageLabels, activeFilings, sourceMap, qs, esc, mw, formatDate, monthName,
    sourceLinks, flowDateKind, projectHref, filingHref, renderMasthead, downloadCsv, caveatMw, totalCaveat,
  } = window.DCW;

  const conn = D.connectivity.summary;
  const recon = D.reconciliation;
  const STATUS_WORDS = { granted: "granted", agreement: "granted, agreement signed", commissioned: "commissioned", applied: "applied, under process", closed: "closed; kept as history" };
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many || one + "s"}`;
  const notPub = (v) => (v === undefined || v === null || v === "" ? "not published" : String(v));
  const filingLink = (c) => (c.linkedProjectId ? projectHref(c.linkedProjectId) : filingHref(c.id));
  const undated = activeFilings.filter((c) => flowDateKind(c) === "not published");

  // ---- how we count ---------------------------------------------------------
  function renderTerms() {
    const counts = D.counts || {};
    const excluded = data.projects.filter((p) => p.includeInHeadline === false);
    const allMou = excluded.length && excluded.every((p) => p.status === "mou_speculative");
    const mouMw = excluded.reduce((t, p) => t + (p.capacity && typeof p.capacity.itLoadMw === "number" ? p.capacity.itLoadMw : 0), 0);
    const disclosed = data.projects.filter((p) => p.capacity && typeof p.capacity.itLoadMw === "number").length;
    const sources = data.sources || [];
    const kindCount = (k) => sources.filter((s) => s.tier === k).length;
    const firstSnap = ((D.snapshotHistory || [])[0] || {}).month;
    const terms = [
      ["Filed with the grid",
        `Megawatts a developer has asked a grid utility to supply. Filings to the inter-state grid sit on the central connectivity register (CTUIL); connections within a state appear in state utilities’ and regulators’ records. Each filing links to the record or report it comes from. The tracker holds ${plural(conn.count, "active filing")} for ${mw(conn.totalMW)} MW. A filing is the most a site may draw, usually reached in phases over years.${caveatMw ? ` <strong>Caveat:</strong> ${esc(totalCaveat(conn.totalMW))}` : ""}`],
      ["Granted and applied",
        `Granted means the utility has approved the connection; a signed agreement or a commissioned link also counts as granted. Applied means it is still under process. Today ${mw(conn.grantedMW)} MW is granted and ${mw(conn.appliedMW)} MW applied. ${conn.closedCount ? `${plural(conn.closedCount, "closed filing")} ${conn.closedCount === 1 ? "is" : "are"} listed as history and not counted.` : ""}`],
      ["Announced IT load",
        `The power a company says its servers will use (or, for a site already running, do use), from its own release or the press. ${disclosed} of ${data.projects.length} projects give a figure. It covers the servers alone, without cooling, so it does not compare like for like with a filing.`],
      ["The headline",
        `Announced IT load counts in the headline (${mw(D.headlineKnownCapacityMw)} MW) unless a project is flagged out of it. Today ${plural(excluded.length, "project is", "projects are")} flagged${allMou ? ", all of them at the MoU stage, because a memorandum of understanding commits no one to build" : ""}. ${excluded.filter((p) => p.capacity && typeof p.capacity.itLoadMw === "number").length ? `Between them they give ${mw(mouMw)} MW, shown on the project pages but kept out of the headline.` : ""}`],
      ["Stages",
        ["operational", "under_construction", "announced", "mou_speculative"].map((k) => `${stageLabels[k]}: ${counts[k] || 0}`).join(" · ") +
        ". A project’s stage comes from its own sources."],
      ["Dates",
        `A power-flow date is “declared” when the register states it and “estimated” when it is only a year. Of the active filings, ${conn.declaredDateCount} ${conn.declaredDateCount === 1 ? "has" : "have"} a declared date, ${conn.estimatedDateCount} an estimated one and ${conn.unpublishedDateCount} none published. Estimated dates are marked wherever they appear.`],
      ["Sources",
        `Every project, filing and rule links to its sources: ${kindCount("primary")} government records, ${kindCount("official")} company pages and ${kindCount("secondary")} press or reference pieces. A rule cites the government instrument itself; press is a pointer. Each source is listed on <a href="policy.html#sources">Policy &amp; sources</a>.`],
      ["History",
        firstSnap
          ? `Filed megawatts are measured at a monthly snapshot from ${monthName(firstSnap)}. Announced-load history is reconstructed from the earliest source for each project, and is labelled as such.`
          : "Announced-load history is reconstructed from the earliest source for each project, and is labelled as such."],
      ["Summaries",
        "The short summary at the top of a project page is drafted by an agent and published only once Dr. Vasundhara Sen has approved its exact wording. Interpretation is marked as analysis."],
      ["What this is not", esc(data.meta.scopeNote || "")],
    ];
    qs("#terms").innerHTML = terms.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${d}</dd></div>`).join("");
  }

  // ---- filings against announcements ---------------------------------------
  function renderBridge() {
    const t = recon.totals;
    const rows = [
      ["Announced IT load, headline", t.pressHeadlineMw, "var(--st-an)"],
      ["Filed with the grid", t.filedMw, "var(--ink)"],
      ["Granted", t.grantedMw, "var(--green)"],
      ["Commissioned", t.commissionedMw, "var(--ink-soft)"],
    ];
    const max = Math.max(1, ...rows.map((r) => r[1] || 0));
    qs("#bridge-bars").innerHTML = rows.map(([label, v, color]) => `<div class="bridge-bar">
      <span class="bridge-label">${esc(label)}</span>
      <span class="bar-track">${v ? `<span class="bar-seg" style="width:${(v / max) * 100}%;background:${color}"></span>` : ""}</span>
      <span class="bar-value">${mw(v)} MW</span>
    </div>`).join("") + `<p class="section-note" style="margin-top:.6rem">${t.commissionedMw ? "" : "No filing in the tracker has reached commissioning yet. "}${(recon.unlinked || []).length ? `The filed bar includes ${mw((recon.unlinked || []).reduce((s, u) => s + (u.quantumMW || 0), 0))} MW from filings with no project record, listed under the table.` : ""}${caveatMw ? ` ${esc(totalCaveat(t.filedMw))}` : ""}</p>`;
    const dash = '<span class="power-none">—</span>';
    qs("#bridge-body").innerHTML = recon.projects.map((r) => `<tr>
      <td class="list-name"><a href="${esc(projectHref(r.projectId))}">${esc(r.name)}</a><span>${esc(r.state || "")}</span></td>
      <td class="num" data-label="Filings">${r.filingCount}</td>
      <td class="num" data-label="Announced IT">${r.pressMw ? mw(r.pressMw) : dash}</td>
      <td class="num" data-label="Filed">${mw(r.filedMw)}</td>
      <td class="num" data-label="Granted">${mw(r.grantedMw)}</td>
    </tr>`).join("");
    const un = recon.unlinked || [];
    qs("#bridge-unlinked").innerHTML = un.length
      ? `Filings with no project record in the tracker yet: ${un.map((u) => `<a href="${esc(filingHref(u.id))}">${esc(u.operator || u.id)}</a> (${mw(u.quantumMW)} MW, ${esc(STATUS_WORDS[u.status] || u.status)})`).join("; ")}.`
      : "";
  }

  // ---- the wider market ---------------------------------------------------------
  function renderMarket() {
    const gw = (v) => Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
    const base = [...(data.nationalBaseline || [])].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    qs("#baseline-list").innerHTML = base.length ? base.map((b) => `<article class="rule">
      <h3>${esc(b.value)}</h3>
      <p class="rule-meta">${esc(b.metric)} · ${esc(formatDate(b.date))} · ${esc(b.quality || "")}</p>
      ${b.detail ? `<p class="analysis"><span class="tag">Note</span>${esc(b.detail)}</p>` : ""}
      <p class="rule-sources">${sourceLinks(b.sourceIds)}</p>
    </article>`).join("") : '<p class="section-note">None tracked yet.</p>';

    const gc = data.gridContext || {};
    const band = (gc.dcForecastBand || []).filter((b) => typeof b.gw === "number");
    const max = Math.max(1, ...band.map((b) => b.high || b.gw || 0));
    qs("#forecast-bars").innerHTML = band.map((b) => `<div class="bridge-bar">
      <span class="bridge-label">${esc(b.analyst)}<span class="bar-sub">by ${esc(b.year)} ${sourceLinks(b.sourceIds)}</span></span>
      <span class="bar-track">${b.low && b.high ? `<span class="bar-range" style="left:${(b.low / max) * 100}%;width:${((b.high - b.low) / max) * 100}%" title="range ${b.low} to ${b.high} GW"></span>` : ""}<span class="bar-seg" style="width:${(b.gw / max) * 100}%;background:var(--ink-soft)"></span></span>
      <span class="bar-value">${gw(b.gw)} GW${b.low && b.high ? `<span>range ${gw(b.low)}–${gw(b.high)}</span>` : ""}</span>
    </div>`).join("") || '<p class="section-note">None tracked yet.</p>';

    const terms = [];
    if (gc.nationalPeakMW) terms.push(["National peak demand",
      `${gw(gc.nationalPeakMW / 1000)} GW, met on ${esc(formatDate(gc.nationalPeakDate))}. ${esc(gc.nationalPeakNote || "")} ${sourceLinks(gc.nationalPeakSourceIds)}`]);
    const proj = gc.nationalPeakProjection;
    if (proj) terms.push(["Projected peak",
      [proj.fy27GW ? `${gw(proj.fy27GW)} GW in FY2027` : "", proj.fy36GW ? `${gw(proj.fy36GW)} GW in FY2036` : ""].filter(Boolean).join("; ") + `, as projected. ${sourceLinks(proj.sourceIds)}`]);
    const share = gc.dcShareOfElectricity;
    if (share) terms.push(["Data centres’ share of electricity",
      `${share.y2024Pct}% in 2024, forecast to reach ${share.y2030Pct}% (${mw(share.twh2030)} TWh) by 2030. ${sourceLinks(share.sourceIds)}`]);
    const cap = gc.dcCapacityBaseline;
    if (cap) terms.push(["Operating capacity by city",
      `About ${gw(cap.operationalGW)} GW operating across ${mw(cap.operationalCount)} facilities as of ${esc(cap.year)}, up from ${mw(cap.from2020MW)} MW in 2020. ` +
      Object.entries(cap.cityMW || {}).map(([c, v]) => `${esc(c)} ${mw(v)} MW`).join(", ") + `. ${sourceLinks(cap.sourceIds)}`]);
    qs("#grid-terms").innerHTML = terms.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${d}</dd></div>`).join("");
  }

  // ---- timing ----------------------------------------------------------------
  function renderTiming() {
    const fwd = D.connectivity.forward || [];
    const undatedMw = undated.reduce((t, c) => t + (c.quantumMW || 0), 0);
    qs("#timing-note").textContent =
      `Cumulative megawatts due to start flowing by each year, by the date each filing gives. Read the right-hand column with care: most of it rests on estimated dates, which give only a year. ` +
      (undated.length ? `${plural(undated.length, "filing")} (${mw(undatedMw)} MW) ${undated.length === 1 ? "has" : "have"} no published date and ${undated.length === 1 ? "is" : "are"} not in this table.` : "") +
      (caveatMw ? ` The columns include the ${mw(caveatMw)} MW still being checked (see How we count).` : "");
    if (!fwd.length) { qs("#timing-body").innerHTML = '<tr><td colspan="4">No filing has a power-flow date yet.</td></tr>'; return; }
    qs("#timing-body").innerHTML = fwd.map((f) => `<tr>
      <td>${esc(f.year)}</td>
      <td class="num" data-label="Granted">${mw(f.cumulativeGrantedMW)}</td>
      <td class="num" data-label="Register date">${mw(f.cumulativeDeclaredMW || 0)}</td>
      <td class="num" data-label="Incl. estimated">${mw(f.cumulativeMW)}</td>
    </tr>`).join("");
  }

  // ---- the register ----------------------------------------------------------
  function tierWords(c) {
    if (c.tier === "ISTS") return "inter-state grid, via CTUIL";
    if (c.tier === "intra-state") return "state grid";
    return c.tier || "";
  }
  function deliveryWords(c) {
    const d = c.gridDelivery || {};
    return [d.implementationMode, d.biddingAgency, d.biddingStatus || d.stationReadiness,
      d.plannedSpvTransfer ? "SPV transfer target " + formatDate(d.plannedSpvTransfer) : ""].filter(Boolean).join(" · ");
  }
  function windowWords(start, end) {
    const s = notPub(start), e = notPub(end);
    // Register phrases ("not published", "not approved") are not dates: say them once.
    const isDate = (v) => /\d/.test(v);
    if (!isDate(s) && !isDate(e)) return s === e ? s : `${s}; end ${e}`;
    return `${s} to ${e}`;
  }
  const registerRows = () => [...activeFilings].sort((a, b) => (b.quantumMW || 0) - (a.quantumMW || 0))
    .concat((data.connectivity || []).filter((c) => c.status === "closed"));
  function renderRegister() {
    qs("#register-note").textContent =
      `Every grid filing in the tracker, largest first, with what the register says about it. ${plural(activeFilings.length, "active filing")}: ${mw((conn.byTier || {})["ISTS"] || 0)} MW on the inter-state grid and ${mw((conn.byTier || {})["intra-state"] || 0)} MW within states${(data.connectivity || []).length > activeFilings.length ? "; closed filings come last" : ""}. Each links to its own page.`;
    qs("#register-list").innerHTML = registerRows().map((c) => {
      const kind = flowDateKind(c);
      const facts = [
        ["Applicant", c.applicant],
        ["Parent company", c.parentCompany],
        ["Where it draws", [c.drawalState || c.state, tierWords(c)].filter(Boolean).join(" · ")],
        ["Utility and substation", [c.utility, c.substation].filter(Boolean).join(" · ")],
        ["Reference", c.applicationRef],
        ["Power flow requested", windowWords(c.requestedPowerFlowStart, c.requestedPowerFlowEnd)],
        ["Power flow approved", windowWords(c.approvedPowerFlowStart, c.approvedPowerFlowEnd)],
        ["Date used in this tracker", c.powerFlowStart ? `${c.powerFlowStart} (${kind})` : "not published"],
        ["Transmission", c.transmissionStatus],
        ["Delivery", deliveryWords(c)],
        ["Last checked", c.lastVerified ? formatDate(c.lastVerified) : ""],
      ].filter(([, v]) => v);
      return `<article class="filing-card${c.status === "closed" ? " is-closed" : ""}">
        <h3><a href="${esc(filingLink(c))}">${esc(c.operator || c.applicant)}</a></h3>
        <p class="rule-meta">${mw(c.quantumMW)} MW · ${esc(STATUS_WORDS[c.status] || c.status)}${c.evidenceCaveat ? "; press-reported, being checked" : ""}</p>
        ${c.evidenceCaveat ? `<p class="caveat"><strong>Caveat:</strong> ${esc(c.evidenceCaveat)}</p>` : ""}
        <dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <p class="rule-sources">${sourceLinks(c.sourceIds)}</p>
      </article>`;
    }).join("");
  }
  function registerCsv() {
    const rows = registerRows().map((c) => [
      c.operator, c.applicant, c.parentCompany, c.drawalState || c.state, c.quantumMW, c.status,
      notPub(c.requestedPowerFlowStart), notPub(c.requestedPowerFlowEnd), notPub(c.approvedPowerFlowStart), notPub(c.approvedPowerFlowEnd),
      c.powerFlowStart || "", flowDateKind(c), c.tier, c.utility, c.substation, c.transmissionStatus || "",
      (c.gridDelivery || {}).implementationMode, (c.gridDelivery || {}).biddingAgency, (c.gridDelivery || {}).biddingStatus,
      (c.gridDelivery || {}).plannedSpvTransfer, c.applicationRef, c.lastVerified,
      [...new Set((c.sourceIds || []).map((id) => (sourceMap.get(id) || {}).url).filter(Boolean))].join(" | "),
    ]);
    downloadCsv(`india-datacenter-watch-grid-register-${data.meta.asOf}.csv`,
      ["operator", "applicant", "parent_company", "drawal_state", "quantum_mw", "status", "requested_flow_start", "requested_flow_end",
        "approved_flow_start", "approved_flow_end", "flow_date_used", "flow_date_kind", "tier", "utility", "substation", "transmission_status",
        "delivery_mode", "bidding_agency", "bidding_status", "planned_spv_transfer", "reference", "last_verified", "sources"], rows);
  }

  // ---- transmission ----------------------------------------------------------
  function renderDelivery() {
    const assets = data.gridDeliveryAssets || [];
    qs("#delivery-list").innerHTML = assets.length ? assets.map((a) => {
      const linked = (a.linkedConnectivityIds || []).map((id) => (data.connectivity || []).find((c) => c.id === id)).filter(Boolean);
      return `<article class="rule">
        <h3>${esc(a.name)}</h3>
        <p class="rule-meta">${esc([a.state, a.status, a.implementationMode].filter(Boolean).join(" · "))}</p>
        ${a.biddingStatus ? `<p>${esc(a.biddingStatus)}</p>` : ""}
        ${a.biddingAgency ? `<p class="rule-instrument">Bidding agency: ${esc(a.biddingAgency)}</p>` : ""}
        ${a.plannedSpvTransfer ? `<p class="rule-instrument">Target transfer to the project company: ${esc(formatDate(a.plannedSpvTransfer))}</p>` : ""}
        ${a.biddingAgencyNotes ? `<p class="analysis"><span class="tag">Analysis</span>${esc(a.biddingAgencyNotes)}</p>` : ""}
        ${(a.majorElements || []).length ? `<ul class="thresholds">${a.majorElements.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : ""}
        ${a.dashboardImplication ? `<p class="analysis"><span class="tag">Analysis</span>${esc(a.dashboardImplication)}</p>` : ""}
        ${linked.length ? `<p class="rule-instrument">Filings that depend on it: ${linked.map((c) => `<a href="${esc(filingLink(c))}">${esc(c.operator || c.applicant)} (${mw(c.quantumMW)} MW)</a>`).join(", ")}</p>` : ""}
        <p class="rule-sources">${sourceLinks(a.sourceIds)}${a.lastVerified ? ` · last checked ${esc(formatDate(a.lastVerified))}` : ""}</p>
      </article>`;
    }).join("") : '<p class="section-note">No transmission package tracked yet.</p>';
  }

  renderMasthead();
  qs("#lede").innerHTML = `How the figures on this site are counted, how grid filings compare with what companies announce, and the full register of filings behind them. Every number here comes from the same data file as the rest of the site.`;
  qs("#scope-note").textContent = `${data.projects.length} tracked projects. ${data.meta.scopeNote}`;
  renderTerms();
  renderBridge();
  renderMarket();
  renderTiming();
  renderRegister();
  renderDelivery();
  qs("#register-csv").addEventListener("click", registerCsv);
})();
