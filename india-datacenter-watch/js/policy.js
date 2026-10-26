(function () {
  if (!window.DCW) return;
  const {
    data, sourceMap, qs, qsa, esc, mw, formatDate, sourceLink, sourceLinks, tierKind,
    projectHref, filingHref, renderMasthead,
  } = window.DCW;

  const TRACK_ORDER = ["Central power", "State power regulator", "Environment & water", "State DC/AI policy", "Data governance", "India regulatory"];
  const STATUS_WORDS = { active: "in force", watch: "watching", draft: "draft", proposed: "proposed" };
  const policies = data.policyWatch || [];
  const tracks = [...new Set(policies.map((p) => p.track || "Other"))]
    .sort((a, b) => (TRACK_ORDER.indexOf(a) + 1 || 99) - (TRACK_ORDER.indexOf(b) + 1 || 99));
  const state = { track: "all", kind: "all", search: "" };

  const primaryOf = (item) => (item.sourceIds || []).map((id) => sourceMap.get(id)).find((s) => s && s.tier === "primary");
  const othersOf = (item) => (item.sourceIds || []).map((id) => sourceMap.get(id)).filter((s) => s && s.tier !== "primary");

  // ---- rules ---------------------------------------------------------------
  function ruleHtml(item) {
    const primary = primaryOf(item);
    const others = othersOf(item);
    const meta = [item.jurisdiction, item.authority, STATUS_WORDS[item.status] || item.status].filter(Boolean).join(" · ");
    const sameDay = item.effectiveDate && item.effectiveDate === item.notifiedDate;
    const instrument = [item.instrument, item.reference, item.notifiedDate ? (sameDay ? "notified and effective " : "notified ") + formatDate(item.notifiedDate) : "",
      item.effectiveDate && item.effectiveDate !== item.notifiedDate ? "effective " + formatDate(item.effectiveDate) : ""].filter(Boolean).join(" · ");
    return `<article class="rule" id="${esc(item.id)}">
      <h3>${esc(item.title)}</h3>
      <p class="rule-meta">${esc(meta)}</p>
      ${instrument ? `<p class="rule-instrument">${esc(instrument)}</p>` : ""}
      ${item.dcRelevance ? `<p class="analysis"><span class="tag">Analysis</span>${esc(item.dcRelevance)}</p>` : ""}
      ${item.systemImplication ? `<p class="analysis"><span class="tag">Analysis</span>${esc(item.systemImplication)}</p>` : ""}
      <p class="rule-sources">${primary
        ? `Source of record: ${sourceLink(primary, primary.label)}`
        : '<span class="flag">No government source yet; press only</span>'}${others.length ? ` <span>Also reported by ${sourceLinks(others.map((s) => s.id))}</span>` : ""}</p>
    </article>`;
  }
  function renderRules() {
    const shown = state.track === "all" ? tracks : [state.track];
    qs("#rules-list").innerHTML = shown.map((t) => {
      const group = policies.filter((p) => (p.track || "Other") === t);
      return `<div class="rule-group"><h3 class="group-head">${esc(t)} <span>${group.length}</span></h3>${group.map(ruleHtml).join("")}</div>`;
    }).join("");
    qsa("#track-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.track === state.track)));
  }

  // ---- clean power -----------------------------------------------------------
  // The ladder and its totals come from the build (capacityByFirmnessMw,
  // countByFirmness), so they match the old dashboard's chart.
  function renderCleanPower() {
    const ladder = [...(data.firmnessLadder || [])].sort((a, b) => b.rank - a.rank);
    const mwBy = data.derived.capacityByFirmnessMw || {};
    const nBy = data.derived.countByFirmness || {};
    const max = Math.max(1, ...ladder.map((t) => mwBy[t.key] || 0));
    qs("#firmness-bars").innerHTML = ladder.map((t) => {
      const v = mwBy[t.key] || 0, n = nBy[t.key] || 0;
      return `<div class="bridge-bar">
        <span class="bridge-label">${esc(t.label)}<span class="bar-sub">${esc(t.note)}</span></span>
        <span class="bar-track">${v ? `<span class="bar-seg" style="width:${(v / max) * 100}%;background:var(--green)"></span>` : ""}</span>
        <span class="bar-value">${n ? `${mw(v)} MW<span>${n} ${n === 1 ? "project" : "projects"}</span>` : '<span>none</span>'}</span>
      </div>`;
    }).join("");
    const total = Object.values(nBy).reduce((t, n) => t + n, 0);
    const ladderMw = Object.values(mwBy).reduce((t, v) => t + v, 0);
    const differs = Math.round(ladderMw) !== Math.round(data.derived.headlineKnownCapacityMw || 0);
    qs("#firmness-note").textContent = `Every tracked project (${total}) sits on one rung. Megawatts are disclosed IT load, projects flagged out of the headline included${differs ? `, so the ${mw(ladderMw)} MW total differs from the ${mw(data.derived.headlineKnownCapacityMw)} MW headline` : ""}; a project that gives no figure adds to the count but not the megawatts. Annual renewable matching is not the same as clean power every hour.`;
    const oa = (data.gridContext || {}).openAccess;
    qs("#open-access").innerHTML = oa ? `<article class="rule">
      <dl class="key-figures">
        ${typeof oa.cumulativeGW === "number" ? `<div><dt>${oa.cumulativeGW.toLocaleString("en-IN", { maximumFractionDigits: 2 })}<small>GW</small></dt><dd>commercial and industrial green open access, ${esc(oa.asOf || "")}</dd></div>` : ""}
        ${typeof oa.cagrPct === "number" ? `<div><dt>${esc(String(oa.cagrPct))}<small>%</small></dt><dd>growth a year, as reported</dd></div>` : ""}
      </dl>
      ${oa.note ? `<p class="analysis"><span class="tag">The source’s reading</span>${esc(oa.note)}</p>` : ""}
      <p class="rule-sources">${sourceLinks(oa.sourceIds)}</p>
    </article>` : '<p class="section-note">Not tracked yet.</p>';
    qs("#standards-list").innerHTML = (data.hyperscalerStandards || []).map((h) => `<article class="rule">
      <h3>${esc(h.company)}: ${esc(h.standard)}</h3>
      <p>${esc(h.headline)}</p>
      ${h.indiaRelevance ? `<p class="analysis"><span class="tag">Analysis</span>${esc(h.indiaRelevance)}</p>` : ""}
      ${(h.watchItems || []).length ? `<p class="rule-meta">To watch: ${esc(h.watchItems.join(", "))}</p>` : ""}
      <p class="rule-sources">${sourceLinks(h.sourceIds)}</p>
    </article>`).join("");
  }

  // ---- beyond India -----------------------------------------------------------
  // Kept apart from every India total, as the provenance rules require.
  function renderBeyond() {
    const signals = data.regionalSignals || [];
    qs("#beyond-note").textContent = `Signals from neighbouring markets that bear on India’s competition for projects. They are kept apart: nothing here counts in any India figure.${data.regionalCheckedAt ? ` Last checked ${formatDate(data.regionalCheckedAt)}.` : ""}`;
    const groups = [["south-asia", "South Asia"], ["southeast-asia", "Southeast Asia"]];
    qs("#beyond-list").innerHTML = groups.map(([key, label]) => {
      const rows = signals.filter((s) => s.region === key).sort((a, b) => String(b.date).localeCompare(String(a.date)));
      if (!rows.length) return "";
      return `<div><h3 class="group-head">${label}</h3>${rows.map((s) => `<article class="rule">
        <h3>${esc(s.title)}</h3>
        <p class="rule-meta">${esc(s.country)} · ${esc(formatDate(s.date))}</p>
        <p>${esc(s.fact)}</p>
        ${s.analysis ? `<p class="analysis"><span class="tag">Analysis</span>${esc(s.analysis)}</p>` : ""}
        ${s.caveat ? `<p class="rule-meta">${esc(s.caveat)}</p>` : ""}
        <p class="rule-sources">${sourceLinks(s.sourceIds)}</p>
      </article>`).join("")}</div>`;
    }).join("") || '<p class="section-note">None tracked yet.</p>';
  }

  // ---- uptime ----------------------------------------------------------------
  function renderUptime() {
    const list = data.uptimeStandards || [];
    qs("#uptime-list").innerHTML = list.length ? list.map((u) => `<article class="rule">
      <h3>${esc(u.title || u.metric)}</h3>
      <p class="rule-meta">${esc(u.authority || "")}</p>
      ${u.metric ? `<p class="rule-instrument">${esc(u.metric)}</p>` : ""}
      ${(u.thresholds || []).length ? `<ul class="thresholds">${u.thresholds.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      ${u.scope ? `<p>${esc(u.scope)}</p>` : ""}
      ${u.dashboardImplication ? `<p class="analysis"><span class="tag">Analysis</span>${esc(u.dashboardImplication)}</p>` : ""}
      <p class="rule-sources">${sourceLinks(u.sourceIds)}${u.lastVerified ? ` · last checked ${esc(formatDate(u.lastVerified))}` : ""}</p>
    </article>`).join("") : '<p class="section-note">None tracked yet.</p>';
  }

  // ---- sources ---------------------------------------------------------------
  // What each source is cited for, found by walking every record that carries
  // sourceIds. Internal lists (refresh queries) are not public uses.
  const SECTION_WORDS = {
    monthlySignals: "monthly signals", gridContext: "grid context", hyperscalerStandards: "hyperscaler energy standards",
    gridDeliveryAssets: "transmission", uptimeStandards: "uptime definitions", nationalBaseline: "national market baseline",
    regionalSignals: "Beyond India", firmnessLadder: "clean-power ladder", exchangeRates: "exchange rates",
  };
  const SECTION_LINKS = {
    hyperscalerStandards: "#clean-power", firmnessLadder: "#clean-power", uptimeStandards: "#uptime", regionalSignals: "#beyond-india",
    gridDeliveryAssets: "method.html#delivery", nationalBaseline: "method.html#market", gridContext: "method.html#market",
  };
  // Editorial blocks (implications, watchlist, takeaways) wait for the
  // curator's approval and are not on the site, so they are not public uses.
  const SKIP = new Set(["meta", "derived", "sources", "projectSummaries", "refreshQueries", "implications", "watchlist", "personaTakeaways"]);
  const citedBy = new Map();
  function cite(id, use) {
    if (!citedBy.has(id)) citedBy.set(id, []);
    const list = citedBy.get(id);
    if (!list.some((u) => u.key === use.key)) list.push(use);
  }
  function walk(node, use) {
    if (Array.isArray(node)) { node.forEach((n) => walk(n, use)); return; }
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node.sourceIds)) node.sourceIds.forEach((id) => cite(id, use));
    Object.entries(node).forEach(([k, v]) => { if (k !== "sourceIds" && typeof v === "object") walk(v, use); });
  }
  Object.entries(data).forEach(([key, value]) => {
    if (SKIP.has(key)) return;
    if (key === "projects") { value.forEach((p) => walk(p, { key: "p:" + p.id, html: `<a href="${esc(projectHref(p.id))}">${esc(p.name)}</a>` })); return; }
    if (key === "connectivity") {
      value.forEach((c) => {
        const href = c.linkedProjectId ? projectHref(c.linkedProjectId) : filingHref(c.id);
        walk(c, { key: "c:" + c.id, html: `<a href="${esc(href)}">${esc(c.operator || c.applicant)} filing, ${esc(String(c.quantumMW || 0))} MW</a>` });
      });
      return;
    }
    if (key === "policyWatch") { value.forEach((po) => walk(po, { key: "r:" + po.id, html: `<a href="#${esc(po.id)}">${esc(po.title)}</a>` })); return; }
    if (key === "gridContext") {
      // Parts of grid context live on different pages; one is not shown at all.
      const parts = {
        statePeakMW: '<a href="map.html">state peak demand</a>', openAccess: '<a href="#clean-power">green open access</a>',
        vizagExample: "an older Vizag grid-ask figure, not shown on this site",
      };
      Object.entries(value || {}).forEach(([k, v]) => {
        const html = parts[k] || '<a href="method.html#market">market context</a>';
        if (k === "nationalPeakSourceIds") (v || []).forEach((id) => cite(id, { key: "g:market", html }));
        else walk(v, { key: "g:" + (parts[k] ? k : "market"), html });
      });
      return;
    }
    const word = esc(SECTION_WORDS[key] || key);
    walk(value, { key: "s:" + key, html: SECTION_LINKS[key] ? `<a href="${SECTION_LINKS[key]}">${word}</a>` : word });
  });
  // Approved summaries cite sources too; drafts never count.
  Object.values(data.projectSummaries || {}).forEach((s) => (s.sourceIds || []).forEach((id) => {
    const p = data.projects.find((x) => x.id === s.projectId);
    if (p) cite(id, { key: "p:" + p.id, html: `<a href="${esc(projectHref(p.id))}">${esc(p.name)}</a>` });
  }));

  const sources = [...(data.sources || [])].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || a.label.localeCompare(b.label));
  function usesHtml(id) {
    const uses = citedBy.get(id) || [];
    if (!uses.length) return '<span class="power-none">kept in the ledger; no current record cites it</span>';
    const shown = uses.slice(0, 3).map((u) => u.html).join(", ");
    return uses.length > 3 ? `${shown} and ${uses.length - 3} more` : shown;
  }
  function renderSources() {
    const q = state.search.trim().toLowerCase();
    const list = sources.filter((s) => (state.kind === "all" || s.tier === state.kind) &&
      (!q || [s.label, s.publisher, s.date, s.type].join(" ").toLowerCase().includes(q)));
    qs("#source-count").textContent = `${list.length} of ${sources.length} sources`;
    qs("#source-body").innerHTML = list.length ? list.map((s) => `<tr>
      <td class="list-name">${sourceLink(s, s.label)}</td>
      <td>${esc(s.publisher || "")}</td>
      <td class="nowrap">${esc(formatDate(s.date))}</td>
      <td>${esc(tierKind[s.tier] || s.tier || "")}</td>
      <td class="uses">${usesHtml(s.id)}</td>
    </tr>`).join("") : '<tr><td colspan="5">No source matches. Clear the search to see them all.</td></tr>';
    qsa("#kind-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.kind === state.kind)));
  }

  function renderStatic() {
    renderMasthead();
    const onPrimary = policies.filter(primaryOf).length;
    const gov = sources.filter((s) => s.tier === "primary").length;
    qs("#lede").innerHTML =
      `The rules that decide how a data centre gets power in India, from open access and captive supply to diesel backup and water. ${onPrimary} of the ${policies.length} rules tracked here cite the government instrument itself; press reports sit beside it as pointers. Below them is the full ledger of sources. How the figures are counted is on the <a href="method.html">Method</a> page.`;
    qs("#rules-note").textContent = `Grouped by who makes the rule. Each gives the instrument and its source; what it means for data centres is our reading, so it is marked as analysis.`;
    qs("#sources-note").textContent = `${sources.length} sources in the ledger: ${gov} government records, ${sources.filter((s) => s.tier === "official").length} company pages and ${sources.filter((s) => s.tier === "secondary").length} press or reference pieces. Newest first.`;
    qs("#track-switch").innerHTML = ["all", ...tracks].map((t) => `<button type="button" data-track="${esc(t)}" aria-pressed="false">${esc(t === "all" ? "All" : t)}</button>`).join("");
    qs("#kind-switch").innerHTML = [["all", "All"], ["primary", "Government"], ["official", "Company"], ["secondary", "Press"]]
      .map(([k, l]) => `<button type="button" data-kind="${k}" aria-pressed="false">${l}</button>`).join("");
    qsa("#track-switch button").forEach((b) => b.addEventListener("click", () => { state.track = b.dataset.track; renderRules(); }));
    qsa("#kind-switch button").forEach((b) => b.addEventListener("click", () => { state.kind = b.dataset.kind; renderSources(); }));
    qs("#source-search").addEventListener("input", (e) => { state.search = e.target.value; renderSources(); });
  }

  renderStatic();
  renderRules();
  renderCleanPower();
  renderUptime();
  renderBeyond();
  renderSources();
  // A link to one rule (policy.html#<rule id>) should land on it, even when a
  // track filter is hiding it.
  function goToHash() {
    const target = location.hash.slice(1);
    if (!target) return;
    if (!document.getElementById(target) && policies.some((p) => p.id === target)) { state.track = "all"; renderRules(); }
    const el = document.getElementById(target);
    if (el) el.scrollIntoView();
  }
  window.addEventListener("hashchange", goToHash);
  goToHash();
})();
