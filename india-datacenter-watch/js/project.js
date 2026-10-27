(function () {
  if (!window.DCW) return;
  const {
    data, stageLabels, firmnessLabels, GRANTED, projectsById, sourceMap, connById, summaries,
    qs, uniq, esc, mw, formatDate, swatch, sourceLinks, flowDateKind, projectFilings, projectFigures, filingFigures,
    projectHref, filingHref, sortedProjects, locatorMap, ringSmallStates, renderMasthead, scaleMaxima, powerBars,
    projectCaveatMw,
  } = window.DCW;

  const max = scaleMaxima();
  const tierKind = { primary: "Government record", official: "Company page", secondary: "Press or reference" };

  // Sources cited by filings of more than one site are register-wide pulls
  // (e.g. a CTUIL portal check). They show as a dated register check, and a
  // signal citing only them does not land on every project's timeline.
  const filingGroupsBySource = new Map();
  (data.connectivity || []).forEach((c) => {
    const group = c.linkedProjectId || "filing:" + c.id;
    (c.sourceIds || []).forEach((id) => {
      if (!filingGroupsBySource.has(id)) filingGroupsBySource.set(id, new Set());
      filingGroupsBySource.get(id).add(group);
    });
  });
  const registerWide = (id) => (filingGroupsBySource.get(id) || new Set()).size > 1;

  // ---- timeline -----------------------------------------------------------
  // On a filing's own page, register-wide sources are its own record, so
  // signals citing them belong there too.
  function buildTimeline(sourceIds, filings, includeRegisterSignals = false) {
    const ids = uniq(sourceIds);
    const own = new Set(includeRegisterSignals ? ids : ids.filter((id) => !registerWide(id)));
    const signals = (data.monthlySignals || []).filter((s) => (s.sourceIds || []).some((id) => own.has(id)));
    // A signal stands in for the report it was written from (a non-government
    // source dated within three days of it). Older sources it also cites, and
    // every government record, keep their own dated line.
    const days = (a, b) => Math.abs(new Date(a) - new Date(b)) / 86400000;
    const absorbed = new Set(signals.flatMap((s) => (s.sourceIds || []).filter((id) => {
      const src = sourceMap.get(id) || {};
      return src.date && src.tier !== "primary" && days(src.date, s.date) <= 3;
    })));
    const items = signals.map((s) => ({
      date: s.date, kind: "Signal", title: s.headline, text: s.whyItMatters, analysis: true, ids: s.sourceIds,
    }));
    ids.filter((id) => !absorbed.has(id)).map((id) => sourceMap.get(id)).filter((s) => s && s.date).forEach((s) => {
      items.push({
        date: s.date,
        kind: registerWide(s.id) ? "Register check" : tierKind[s.tier] || "Source",
        title: s.label, ids: [s.id],
      });
    });
    // Expected power flow, one line per date and confidence.
    const flows = new Map();
    filings.filter((c) => DCW.isCounted(c) && c.powerFlowStart).forEach((c) => {
      const kind = flowDateKind(c);
      const key = c.powerFlowStart + "|" + kind;
      const prev = flows.get(key) || { date: c.powerFlowStart, kind, mw: 0, ids: [] };
      prev.mw += c.quantumMW || 0;
      prev.ids.push(...(c.sourceIds || []));
      flows.set(key, prev);
    });
    flows.forEach((f) => items.push({
      date: f.date, kind: f.kind === "estimated" ? "Expected power flow (estimated)" : "Power flow date (declared by the register)",
      title: `${mw(f.mw)} MW of filed grid access ${flowPhrase(f)} ${formatWhen(f.date)}.`,
      text: f.kind === "estimated" ? "The filing does not state this date; the tracker estimates the year from the project's reported target." : "",
      ids: uniq(f.ids).filter((id) => !registerWide(id)).slice(0, 2), future: f.date > data.meta.asOf,
    }));
    return items.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }
  // Bare years take "in", full dates "on"; a date on or before the data's
  // as-of date is past.
  function flowPhrase(f) {
    const year = /^\d{4}$/.test(String(f.date));
    const future = year ? String(f.date) > data.meta.asOf.slice(0, 4) : String(f.date) > data.meta.asOf;
    if (f.kind === "estimated") return future ? "is estimated to start flowing in" : "was estimated to start flowing in";
    return (future ? "is due to start " : "was due to start ") + (year ? "in" : "on");
  }
  function formatWhen(v) { return /^\d{4}$/.test(String(v)) ? String(v) : formatDate(v); }

  function timelineHtml(items) {
    if (!items.length) return '<p class="empty">No dated records yet.</p>';
    return `<ol class="timeline">${items.map((it) => `<li${it.future ? ' class="future"' : ""}>
      <time datetime="${esc(it.date)}">${esc(formatWhen(it.date))}</time>
      <div><strong>${esc(it.title)}</strong>${it.text ? `<p>${it.analysis ? '<span class="tag">Analysis</span>' : ""}${esc(it.text)}</p>` : ""}<span class="kind">${esc(it.kind)}</span>${sourceLinks(it.ids)}</div>
    </li>`).join("")}</ol>`;
  }

  // ---- filings table ------------------------------------------------------
  function filingsHtml(filings) {
    if (!filings.length) return '<p class="empty">No grid filing for this project is in the tracker yet. Large loads usually appear first on the national CTUIL register or a state regulator’s docket.</p>';
    const statusText = (c) => DCW.filingStatusWord(c) +
      (c.evidenceCaveat ? "; press-reported, being checked" : "");
    const flow = (c) => {
      const kind = flowDateKind(c);
      if (kind === "not published") return '<span class="est">not published</span>';
      return `${esc(formatWhen(c.powerFlowStart))}${kind === "estimated" ? ' <span class="est">estimated</span>' : ' <span class="est">declared</span>'}`;
    };
    return `<table class="filings">
      <thead><tr><th scope="col">Applicant</th><th scope="col" class="num">MW</th><th scope="col">Status</th><th scope="col">Power flow from</th><th scope="col">Where</th><th scope="col">Record</th></tr></thead>
      <tbody>${filings.map((c) => `<tr>
        <td>${esc(c.applicant || c.operator)}<span>${esc([c.tier, c.utility].filter(Boolean).join(" · "))}</span></td>
        <td class="num" data-label="MW">${mw(c.quantumMW)}</td>
        <td>${esc(statusText(c))}</td>
        <td>${flow(c)}</td>
        <td>${esc(c.substation || c.state || "")}</td>
        <td>${esc(c.applicationRef || "")}${sourceLinks(c.sourceIds)}${c.evidenceCaveat ? `<span class="caveat"><strong>Caveat:</strong> ${esc(c.evidenceCaveat)}</span>` : ""}</td>
      </tr>`).join("")}</tbody>
    </table>`;
  }

  // ---- shared pieces -----------------------------------------------------
  function factsHtml(rows) {
    return `<dl class="facts">${rows.filter(([, v]) => v).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
  }
  function figure(value, label, unit = "MW") {
    return value === null
      ? `<div><dt class="none">${esc(unit)}</dt><dd>${esc(label)}</dd></div>`
      : `<div><dt>${mw(value)}<small>MW</small></dt><dd>${esc(label)}</dd></div>`;
  }
  function summaryHtml(p) {
    const s = summaries[p.id];
    if (!s) return '<p class="no-summary">A short summary will appear here once Dr. Sen has reviewed it. The figures, filings and timeline below come straight from the record.</p>';
    const draft = s.status !== "approved"
      ? '<p class="draft-flag">Draft summary, written from the public record and awaiting Dr. Sen’s review.</p>' : "";
    return `${draft}<p>${esc(s.facts)}</p>${s.analysis ? `<p class="analysis"><span class="tag">Analysis</span>${esc(s.analysis)}</p>` : ""}${sourceLinks(s.sourceIds)}`;
  }
  function pager(list, index, hrefOf, nameOf) {
    const prev = list[index - 1], next = list[index + 1];
    return `<nav class="section pager" aria-label="More projects">
      ${prev ? `<a href="${esc(hrefOf(prev))}">← ${esc(nameOf(prev))}</a>` : "<span></span>"}
      ${next ? `<a href="${esc(hrefOf(next))}">${esc(nameOf(next))} →</a>` : "<span></span>"}
    </nav>`;
  }

  // ---- a project ----------------------------------------------------------
  function renderProject(p) {
    const f = projectFigures(p);
    const filings = projectFilings(p.id);
    const loc = p.location || {};
    const list = sortedProjects();
    const idx = list.findIndex((x) => x.id === p.id);
    document.title = `${p.name} · India Datacenter Watch`;
    const flag = f.inHeadline ? "" : ' <span class="flag">outside the headline</span>';
    qs("#main").innerHTML = `
      <header class="page-head">
        <p class="crumb"><a href="projects.html">All projects</a></p>
        <div class="project-head">
          <div>
            <h1>${esc(p.name)}</h1>
            <p class="project-meta">${[p.operator, [loc.city, loc.state].filter((x) => x && !/not disclosed/i.test(x)).join(", ")].filter(Boolean).map(esc).join(" · ")} ·
              <span class="project-stage">${swatch(p.status)}${esc(stageLabels[p.status])}</span>${flag}</p>
          </div>
          ${locatorMap(loc.state, p.name)}
        </div>
      </header>
      <div class="section project-body">
        <section class="summary" aria-labelledby="summary-title">
          <h2 id="summary-title" class="visually-hidden">Summary</h2>
          ${summaryHtml(p)}
        </section>
        <aside aria-label="Key figures">
          <dl class="key-figures">
            ${figure(f.filedMw || null, f.filedMw ? `filed with the grid, in ${f.filingCount} active ${f.filingCount === 1 ? "filing" : "filings"}${projectCaveatMw(p.id) ? `; ${mw(projectCaveatMw(p.id))} MW of it press-reported and still being checked (see the filings below)` : ""}` : "no grid filing in this tracker", "No filing")}
            ${figure(f.filedMw ? f.grantedMw : null, f.filedMw ? "granted so far" : "nothing to grant yet", "None")}
            ${figure(f.itLoadMw, f.itLoadMw === null ? "IT load not disclosed" : "announced IT load" + (f.inHeadline ? "" : ", outside the headline"), "Not disclosed")}
          </dl>
          ${powerBars(f, p.status, max)}
        </aside>
      </div>
      <section class="section" aria-labelledby="facts-title">
        <h2 id="facts-title">Key facts</h2>
        ${factsHtml([
          ["Operator", p.operator],
          ["Built by", p.constructionLead],
          ["Customer or tenant", p.hyperscaler],
          ["Type", p.customerType],
          ["Location", [loc.city, loc.state, loc.cluster].filter(Boolean).join(" · ")],
          ["Reported value", p.value?.display],
          ["Basis for the value", p.value?.basis],
          ["Power supply", [p.power?.source, p.power?.detail].filter(Boolean).join(". ")],
          ["Clean-power firmness", firmnessLabels[p.power?.firmnessTier] || ""],
          ["Reported timeline", p.timeline],
          ["Tracker note", p.notes],
          ["Last checked", p.lastVerified ? formatDate(p.lastVerified) : ""],
        ])}
      </section>
      <section class="section" aria-labelledby="filings-title">
        <h2 id="filings-title">Grid filings</h2>
        ${filingsHtml(filings)}
      </section>
      <section class="section" aria-labelledby="timeline-title">
        <h2 id="timeline-title">Timeline</h2>
        <p class="section-note">Built from the dated sources cited for this project and its grid filings. Future dates come from the filings and say whether the register declared them or the tracker estimated them.</p>
        ${timelineHtml(buildTimeline([...(p.sourceIds || []), ...filings.flatMap((c) => c.sourceIds || [])], filings))}
      </section>
      ${pager(list, idx, (x) => projectHref(x.id), (x) => x.name)}`;
    ringSmallStates(qs("#main"));
  }

  // ---- a filing with no project record ----------------------------------
  function renderFiling(c) {
    const f = filingFigures(c);
    document.title = `${c.operator || c.applicant} · India Datacenter Watch`;
    const status = !DCW.isCounted(c) ? DCW.filingStatusWord(c)
      : GRANTED.has(c.status) ? c.status.charAt(0).toUpperCase() + c.status.slice(1)
      : "Applied, under process";
    qs("#main").innerHTML = `
      <header class="page-head">
        <p class="crumb"><a href="projects.html">All projects</a></p>
        <div class="project-head">
          <div>
            <h1>${esc(c.operator || c.applicant)}</h1>
            <p class="project-meta">${[c.utility || c.tier, c.state].filter(Boolean).map(esc).join(" · ")} · ${esc(status)} ·
              <span class="project-stage">${swatch("none")}Grid filing, no project record yet</span></p>
          </div>
          ${locatorMap(c.state, c.operator)}
        </div>
      </header>
      <div class="section project-body">
        <section class="summary">
          <p>This applicant is on a grid register, but no announcement in this tracker ties it to a named project yet. The figures below are what the register shows.</p>
          ${c.notes ? `<p class="analysis"><span class="tag">Tracker note</span>${esc(c.notes)}</p>` : ""}
        </section>
        <aside aria-label="Key figures">
          <dl class="key-figures">
            ${c.status === "closed"
              ? figure(c.quantumMW || 0, "filed, then closed; kept as history and left out of every total")
              : figure(f.filedMw, "filed with the grid") + figure(f.grantedMw, "granted so far")}
          </dl>
          ${c.status === "closed" ? "" : powerBars(f, "none", max)}
        </aside>
      </div>
      <section class="section" aria-labelledby="facts-title">
        <h2 id="facts-title">Key facts</h2>
        ${factsHtml([
          ["Applicant", c.applicant],
          ["Parent company", c.parentCompany],
          ["Network", [c.tier, c.utility].filter(Boolean).join(" · ")],
          ["Drawal state", c.drawalState || c.state],
          ["Connection point", c.substation],
          ["Transmission status", c.transmissionStatus],
          ["Last checked", c.lastVerified ? formatDate(c.lastVerified) : ""],
        ])}
      </section>
      <section class="section" aria-labelledby="filings-title">
        <h2 id="filings-title">Grid filing</h2>
        ${filingsHtml([c])}
      </section>
      <section class="section" aria-labelledby="timeline-title">
        <h2 id="timeline-title">Timeline</h2>
        ${timelineHtml(buildTimeline(c.sourceIds || [], [c], true))}
      </section>`;
    ringSmallStates(qs("#main"));
  }

  function renderMissing(key) {
    document.title = "Not found · India Datacenter Watch";
    qs("#main").innerHTML = `<header class="page-head"><h1>No project by that name</h1>
      <p class="lede">The tracker has no project or filing called “${esc(key || "(none)")}”. It may have been renamed or merged.</p>
      <p class="lede"><a href="projects.html">See all projects</a></p></header>`;
  }

  function route() {
    let key = location.hash.replace(/^#/, "");
    try { key = decodeURIComponent(key); } catch (e) { return renderMissing(key); }
    if (!key) { location.replace("projects.html"); return; }
    if (key.startsWith("filing/")) {
      const c = connById.get(key.slice(7));
      if (c && c.linkedProjectId && projectsById.has(c.linkedProjectId)) {
        location.replace(projectHref(c.linkedProjectId));
        return;
      }
      return c ? renderFiling(c) : renderMissing(key);
    }
    const p = projectsById.get(key);
    return p ? renderProject(p) : renderMissing(key);
  }

  renderMasthead();
  route();
  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });
})();
