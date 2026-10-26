// Policy & sources: topics with their trails, the watchlist, editions, the source ledger.
(function () {
  const G = window.GHW;
  if (!G) return;
  const { data, M, P, qs, qsa, esc, formatDate, sourceLinks, tag, classKind, sourceMap } = G;

  G.renderMasthead();
  const stageWords = { watching: "Watching", consultation: "In consultation", announced: "Announced", notified: "Notified", open: "Open", operational: "In operation", concluded: "Concluded" };

  // ---- topics ----------------------------------------------------------------
  const pillars = [...new Set(data.tracks.map((t) => t.pillar))];
  qs("#topic-list").innerHTML = pillars.map((pillar) => {
    const tracks = data.tracks.filter((t) => t.pillar === pillar);
    return `<div class="rule-group"><h3 class="group-head">${esc(pillar)}</h3>${tracks.map((t) => {
      const events = data.events.filter((e) => e.trackId === t.id);
      return `<article class="rule" id="${esc(t.id)}">
        <h3>${esc(t.title)}</h3>
        <p class="rule-meta">${esc([stageWords[t.stage] || t.stage, (t.authorities || []).join(", ")].filter(Boolean).join(" · "))}</p>
        <p>${esc(t.stageNote)}</p>
        <p class="analysis">${tag("Analysis")}${esc(t.summary)}</p>
        ${t.parameters.length ? `<dl class="params">${t.parameters.map((p) => `<div><dt>${esc(p.label)}</dt><dd>${esc(p.value)}${p.confidence === "reported" ? tag("Press-reported") : ""} ${sourceLinks(p.sourceIds)}</dd></div>`).join("")}</dl>` : ""}
        ${events.length ? `<details class="trail"><summary>Dated trail: ${events.length} record${events.length === 1 ? "" : "s"}</summary><ol class="timeline">${events.map((e) => `<li><time datetime="${esc(e.date)}">${formatDate(e.date)}</time><div><strong>${esc(e.title)}</strong>${e.confidence === "reported" ? tag("Press-reported") : ""}<p>${esc(e.detail)}</p>${e.significance ? `<p class="${e.analysis ? "analysis" : ""}">${e.analysis ? tag("Analysis") : ""}${esc(e.significance)}</p>` : ""}${sourceLinks(e.sourceIds)}</div></li>`).join("")}</ol></details>` : ""}
        <p class="rule-sources">Topic sources: ${sourceLinks(t.sourceIds)}</p>
      </article>`;
    }).join("")}</div>`;
  }).join("");

  // ---- watchlist -------------------------------------------------------------
  const open = data.watch.filter((w) => !w.closedOn);
  const closed = data.watch.filter((w) => w.closedOn);
  const watchItem = (w) => {
    const t = G.trackMap.get(w.trackId);
    return `<article class="rule${w.closedOn ? " is-closed" : ""}">
      <h3>${esc(w.condition)}</h3>
      <p class="rule-meta">${w.closedOn ? `Closed ${formatDate(w.closedOn)}` : `Next check ${formatDate(w.nextCheck)}`}${t ? ` · <a href="#${esc(t.id)}">${esc(t.title)}</a>` : ""}</p>
      ${w.closedOn ? `<p>${esc(w.outcome)}</p>` : ""}
      <p class="analysis">${tag("Analysis")}${esc(w.why)}</p>
      <p class="rule-sources">Where it would appear: ${esc(w.register)}. ${sourceLinks(w.sourceIds)}</p>
    </article>`;
  };
  qs("#watch-list").innerHTML = open.map(watchItem).join("") + (closed.length ? `<h3 class="group-head" style="margin-top:1.6rem">Closed</h3>${closed.map(watchItem).join("")}` : "");

  // ---- editions --------------------------------------------------------------
  qs("#edition-list").innerHTML = data.editions.map((e) => {
    const n = data.events.filter((x) => x.editionId === e.id).length;
    return `<li><time datetime="${esc(e.id)}">${formatDate(e.id)}</time><div><strong>${esc(e.label)}</strong><span class="kind">${n} dated record${n === 1 ? "" : "s"}</span><p>${esc(e.note)}</p></div></li>`;
  }).join("");

  // ---- source ledger ---------------------------------------------------------
  // Where each source is cited, so a reader can walk from a document to the claims it supports.
  const uses = new Map(data.sources.map((s) => [s.id, []]));
  const cite = (ids, label, href) => (ids || []).forEach((id) => uses.has(id) && uses.get(id).push({ label, href }));
  data.tracks.forEach((t) => {
    cite(t.sourceIds, t.title, `#${t.id}`);
    t.parameters.forEach((p) => cite(p.sourceIds, `${t.title}: ${p.label}`, `#${t.id}`));
  });
  data.events.forEach((e) => cite(e.sourceIds, e.title, `#${e.trackId}`));
  data.watch.forEach((w) => cite(w.sourceIds, "Watching: " + w.condition, "#watching"));
  const rowName = { productionAwards: (r) => `Production award: ${r.company}`, electrolyserAwards: (r) => `Factory award: ${r.company}`, ammoniaAuctions: (r) => `Ammonia auction: ${r.buyer}, ${r.location}`, refineryAwards: (r) => `Refinery supply: ${r.refinery}`, assets: (r) => `Plant: ${r.company}, ${r.location}`, commercialMoves: (r) => `Deal: ${r.company} with ${r.counterparty}` };
  const rowPage = { assets: "plants.html", commercialMoves: "plants.html" };
  const awardAnchor = { productionAwards: "#production", electrolyserAwards: "#electrolyser", ammoniaAuctions: "#ammonia", refineryAwards: "#refinery" };
  Object.entries(M).forEach(([key, rows]) => rows.forEach((r) => {
    const href = rowPage[key] || "awards.html" + (awardAnchor[key] || "");
    cite(r.sourceIds, rowName[key](r), href);
    (r.evidence || []).concat(r.notes || []).forEach((e) => cite(e.sourceIds, rowName[key](r), href));
  }));
  P.ladders.forEach((l) => l.stages.forEach((s) => { cite(s.sourceIds, `Overview: ${l.title}, ${G.stageLabel(l, s).toLowerCase()}`, "index.html"); if (s.caveat) cite(s.caveat.sourceIds, `Overview: ${l.title}, caveat`, "index.html"); }));
  (P.context || []).forEach((c) => cite(c.sourceIds, "Overview: " + c.label, "index.html"));

  const counts = { all: data.sources.length };
  data.sources.forEach((s) => { counts[s.class] = (counts[s.class] || 0) + 1; });
  qs("#sources-note").textContent = `${data.sources.length} public sources: ${counts["primary-official"] || 0} official or company records and ${counts["secondary-press"] || 0} press reports. Each row lists what it is cited for.`;
  const kinds = [["all", "All"], ["primary-official", "Official or company"], ["secondary-press", "Press"]];
  qs("#kind-switch").innerHTML = kinds.map(([k, label], i) => `<button type="button" data-kind="${k}" aria-pressed="${i === 0}">${label} <span class="count">${counts[k] || 0}</span></button>`).join("");
  let kind = "all";
  function renderSources() {
    const q = qs("#source-search").value.trim().toLowerCase();
    const list = data.sources.filter((s) => (kind === "all" || s.class === kind) && (!q || `${s.title} ${s.publisher} ${s.date}`.toLowerCase().includes(q)));
    qs("#source-count").textContent = `${list.length} of ${data.sources.length} sources`;
    qs("#source-body").innerHTML = list.map((s) => {
      const u = uses.get(s.id) || [];
      const seen = new Set();
      const uniqUses = u.filter((x) => !seen.has(x.label) && seen.add(x.label));
      const shown = uniqUses.slice(0, 4).map((x) => `<a href="${esc(x.href)}">${esc(x.label)}</a>`).join("; ");
      const more = uniqUses.length > 4 ? `; and ${uniqUses.length - 4} more` : "";
      return `<tr id="source-${esc(s.id)}">
        <td class="list-name">${G.sourceLink(s, s.title)}</td>
        <td>${esc(s.publisher)}</td>
        <td class="nowrap">${formatDate(s.date)}</td>
        <td>${esc(classKind[s.class])}</td>
        <td class="uses">${uniqUses.length ? shown + more : "Kept in the ledger; no current record cites it"}</td>
      </tr>`;
    }).join("");
  }
  qs("#source-search").addEventListener("input", renderSources);
  qsa("#kind-switch button").forEach((b) => b.addEventListener("click", () => {
    kind = b.dataset.kind;
    qsa("#kind-switch button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderSources();
  }));
  renderSources();

  // A link to a topic opens its trail.
  function openTarget() {
    const el = location.hash && document.getElementById(location.hash.slice(1));
    const d = el && el.querySelector("details");
    if (d) d.open = true;
  }
  window.addEventListener("hashchange", openTarget);
  openTarget();
})();
