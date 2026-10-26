(function () {
  if (!window.DCW) return;
  const {
    data, stageLabels, GRANTED, activeFilings, qs, qsa, esc, mw, swatch, sourceLinks, flowDateKind,
    projectFigures, filingFigures, projectHref, filingHref, mapStates, renderMasthead, totalCaveat,
  } = window.DCW;

  const geo = window.INDIA_GEO_PATHS;
  const peaks = (data.gridContext || {}).statePeakMW || {};
  // Data names that differ from the map's state names.
  const ALIAS = { "Delhi NCR": "Delhi" };
  const toMap = (s) => ALIAS[s] || s;
  const onMap = (name) => !!geo && !!geo.states && Object.prototype.hasOwnProperty.call(geo.states, name);
  const state = { measure: "filed", selected: null };

  // ---- per-state figures ----------------------------------------------------
  // A project in one state counts there. A project that spans states (or names
  // none) is listed but counted in no state, so no figure is split by guesswork.
  const stats = Object.create(null);
  function bucket(name) {
    if (!stats[name]) stats[name] = { name, filed: 0, granted: 0, announced: 0, mou: 0, projects: [], filings: [], closed: [], policies: [], peak: null };
    return stats[name];
  }
  const unplaced = [];
  data.projects.forEach((p) => {
    const states = mapStates(p.location?.state);
    if (!states.length) { unplaced.push(p); return; }
    states.forEach((s) => bucket(s).projects.push(p));
    const it = projectFigures(p).itLoadMw;
    if (states.length > 1 || typeof it !== "number") { if (states.length > 1) unplaced.push(p); return; }
    // Same rule as the headline: MoU-stage load stays out of it.
    if (p.includeInHeadline !== false) bucket(states[0]).announced += it;
    else bucket(states[0]).mou += it;
  });
  (data.connectivity || []).forEach((c) => {
    const b = bucket(toMap(c.state || "Unspecified"));
    if (c.status === "closed") { b.closed.push(c); return; }
    b.filings.push(c);
    b.filed += c.quantumMW || 0;
    if (GRANTED.has(c.status)) b.granted += c.quantumMW || 0;
  });
  (data.policyWatch || []).forEach((po) => {
    mapStates(po.jurisdiction).forEach((s) => bucket(s).policies.push(po));
  });
  Object.entries(peaks).forEach(([name, peak]) => { bucket(toMap(name)).peak = peak; });

  // A proxy peak (NCR uses Haryana's) is not this state's grid, so no share.
  function peakShare(b) {
    if (!b.peak || !b.peak.peakMW || !b.filed || /proxy/i.test(b.peak.fy || "")) return null;
    return ((b.filed / b.peak.peakMW) * 100).toFixed(1);
  }
  // Totals come from the records themselves, not from the state rows, so a
  // filing or project the map cannot place still counts.
  const totalFiled = () => activeFilings.reduce((t, c) => t + (c.quantumMW || 0), 0);
  const totalGranted = () => activeFilings.reduce((t, c) => t + (GRANTED.has(c.status) ? c.quantumMW || 0 : 0), 0);
  const totalAnnounced = () => data.projects.reduce((t, p) => t + (p.includeInHeadline !== false && typeof projectFigures(p).itLoadMw === "number" ? projectFigures(p).itLoadMw : 0), 0);
  const value = (b) => (b ? (state.measure === "filed" ? b.filed : b.announced) : 0);
  const offMap = () => Object.values(stats).filter((b) => !onMap(b.name) && (b.filed || b.filings.length || b.closed.length));
  const tracked = () => Object.values(stats).filter((b) => onMap(b.name) && (b.filed || b.announced || b.mou || b.projects.length || b.filings.length));

  // ---- the map --------------------------------------------------------------
  function fill(v, max) {
    if (!v) return "var(--paper-deep)";
    return `color-mix(in srgb, var(--green) ${Math.round(22 + (v / max) * 78)}%, var(--paper-deep))`;
  }
  function measureWord() { return state.measure === "filed" ? "filed with the grid" : "announced IT load"; }

  function drawMap() {
    const host = qs("#state-map");
    if (!geo || !geo.states) {
      host.innerHTML = '<p class="section-note">The map geometry did not load. The map could not be drawn.</p>';
      return;
    }
    const max = Math.max(1, ...Object.values(stats).map(value));
    const paths = Object.keys(geo.states).map((name) => {
      const v = value(stats[name]);
      const label = `${name}: ${v ? mw(v) + " MW " + measureWord() : "nothing " + measureWord() + " in this tracker"}`;
      return `<path d="${geo.states[name]}" class="map-state${state.selected === name ? " is-selected" : ""}" style="fill:${fill(v, max)}" data-state="${esc(name)}" tabindex="0" role="button" aria-label="${esc(label)}"><title>${esc(label)}</title></path>`;
    }).join("");
    host.innerHTML = `<svg viewBox="${geo.viewBox}" role="group" aria-label="India by state, shaded by megawatts ${measureWord()}">${paths}<g class="map-labels"></g></svg>`;
    labelStates(host, max);
    qsa(".map-state", host).forEach((el) => {
      el.addEventListener("click", () => select(el.dataset.state));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(el.dataset.state); } });
    });
    qs("#map-legend").innerHTML = `<span>Less</span><span class="map-scale" aria-hidden="true"></span><span>More (${mw(max)} MW)</span><span class="map-legend-none"><span class="map-swatch" aria-hidden="true"></span>nothing tracked</span>`;
  }

  // A label point well inside the state: of the sampled points inside its
  // shape, the one farthest from any point outside it. A bounding-box centre
  // can land in the sea or on a narrow coastal strip.
  function labelPoint(path, box) {
    const pt = path.ownerSVGElement.createSVGPoint();
    const inside = [], outside = [];
    const step = Math.max(2, Math.min(box.width, box.height) / 16);
    for (let x = box.x - step; x <= box.x + box.width + step; x += step) {
      for (let y = box.y - step; y <= box.y + box.height + step; y += step) {
        pt.x = x; pt.y = y;
        (path.isPointInFill(pt) ? inside : outside).push([x, y]);
      }
    }
    if (!inside.length) return [box.x + box.width / 2, box.y + box.height / 2];
    let best = inside[0], bestD = -1;
    inside.forEach((q) => {
      let d = Infinity;
      for (const o of outside) { const dd = (q[0] - o[0]) ** 2 + (q[1] - o[1]) ** 2; if (dd < d) d = dd; }
      if (d > bestD) { bestD = d; best = q; }
    });
    return best;
  }

  // Direct labels on every state with a value; tiny states get a ring and a
  // label set to one side.
  function labelStates(host, max) {
    const g = qs(".map-labels", host);
    const ns = "http://www.w3.org/2000/svg";
    qsa(".map-state", host).forEach((path) => {
      const v = value(stats[path.dataset.state]);
      if (!v) return;
      const box = path.getBBox();
      let [x, y] = labelPoint(path, box);
      const small = box.width < 18 || box.height < 18;
      if (small) {
        const ring = document.createElementNS(ns, "circle");
        ring.setAttribute("cx", x); ring.setAttribute("cy", y); ring.setAttribute("r", 9);
        ring.setAttribute("class", "map-ring");
        g.appendChild(ring);
        x += 14;
      }
      const text = document.createElementNS(ns, "text");
      text.setAttribute("x", x); text.setAttribute("y", y);
      text.setAttribute("class", "map-label" + (small ? " is-side" : ""));
      text.textContent = mw(v);
      g.appendChild(text);
    });
  }

  // ---- the side panel ---------------------------------------------------------
  function overviewPanel() {
    const rows = tracked().sort((a, b) => value(b) - value(a) || b.filed - a.filed || b.announced - a.announced || a.name.localeCompare(b.name));
    const dash = '<span class="power-none">—</span>';
    const body = rows.map((b) => {
      const share = peakShare(b);
      return `<tr>
        <td><a href="#${encodeURIComponent(b.name)}">${esc(b.name)}</a></td>
        <td class="num" data-label="Filed">${b.filed ? mw(b.filed) : dash}</td>
        <td class="num" data-label="Granted">${b.filed ? mw(b.granted) : dash}</td>
        <td class="num" data-label="Announced IT">${b.announced ? mw(b.announced) : dash}</td>
        <td class="num" data-label="Filed vs peak">${share !== null ? share + "%" : dash}</td>
      </tr>`;
    }).join("");
    const spanning = unplaced.map((p) => {
      const states = mapStates(p.location?.state);
      const where = states.length > 1 ? `spans ${states.join(" and ")}` : "no single state named";
      const it = projectFigures(p).itLoadMw;
      return `<li><a href="${esc(projectHref(p.id))}">${esc(p.name)}</a> <span>(${esc(where)}${typeof it === "number" ? `; ${mw(it)} MW announced` : ""})</span></li>`;
    }).join("");
    const offMapItems = offMap().map((b) => `<li>Grid filings with the state given as “${esc(b.name)}” <span>(${mw(b.filed)} MW filed; not on the map)</span></li>`).join("");
    return `<h2>All states</h2>
      <p class="panel-note">Select a state on the map or in the table to see its projects, grid filings and rules.</p>
      <table class="dir-list state-table">
        <thead><tr><th scope="col">State</th><th scope="col" class="num">Filed MW</th><th scope="col" class="num">Granted MW</th><th scope="col" class="num">Announced IT MW</th><th scope="col" class="num">Filed vs state peak</th></tr></thead>
        <tbody>${body}</tbody>
        <tfoot><tr><th scope="row">All tracked</th><td class="num" data-label="Filed">${mw(totalFiled())}</td><td class="num" data-label="Granted">${mw(totalGranted())}</td><td class="num" data-label="Announced IT">${mw(totalAnnounced())}</td><td></td></tr></tfoot>
      </table>
      ${totalCaveat(totalFiled()) ? `<p class="panel-note"><strong>Caveat:</strong> ${esc(totalCaveat(totalFiled()))}</p>` : ""}
      ${totalAnnounced() !== rows.reduce((t, b) => t + b.announced, 0) ? `<p class="panel-note">The announced total includes ${mw(totalAnnounced() - rows.reduce((t, b) => t + b.announced, 0))} MW from projects not tied to one state, listed below.</p>` : ""}
      <p class="panel-note">“Filed vs state peak” sets the megawatts filed against the state’s peak demand as given in each cited source. The peaks come from different dates, so open a state to see which one is used. Read it as a sense of scale: a filing is the most a site may draw, usually reached in phases over years.</p>
      ${offMapItems || spanning ? `<h3>Not counted in any one state</h3><ul class="plain-list">${spanning}${offMapItems}</ul>` : ""}`;
  }

  function projectItem(p) {
    const f = projectFigures(p);
    const states = mapStates(p.location?.state);
    const bits = [stageLabels[p.status]];
    if (f.filedMw) bits.push(`${mw(f.filedMw)} MW filed`);
    if (typeof f.itLoadMw === "number") bits.push(`${mw(f.itLoadMw)} MW announced${f.inHeadline ? "" : ", outside the headline"}`);
    if (states.length > 1) bits.push(`spans ${states.join(" and ")}, so counted in neither`);
    else if (p.location?.state && states[0] !== p.location.state) bits.push(`listed as ${p.location.state}`);
    return `<li>${swatch(p.status)}<div><a href="${esc(projectHref(p.id))}">${esc(p.name)}</a><span>${esc(bits.join(" · "))}</span></div></li>`;
  }
  function filingItem(c, closed) {
    const f = filingFigures(c);
    const href = c.linkedProjectId ? projectHref(c.linkedProjectId) : filingHref(c.id);
    const status = closed ? "closed; kept as history" : GRANTED.has(c.status) ? "granted" : "applied, under process";
    const kind = flowDateKind(c);
    const flow = closed ? "" : c.powerFlowStart ? ` · power flow ${esc(c.powerFlowStart)} (${esc(kind)})` : " · power-flow date not published";
    return `<li><div><a href="${esc(href)}">${esc(c.operator || c.applicant)}</a><span>${mw(f.filedMw)} MW · ${esc(status)}${flow}</span>${c.evidenceCaveat && !closed ? `<span class="caveat"><strong>Caveat:</strong> ${esc(c.evidenceCaveat)}</span>` : ""}</div></li>`;
  }

  function statePanel(name) {
    const b = stats[name] || bucket(name);
    const share = peakShare(b);
    const peak = b.peak && !/proxy/i.test(b.peak.fy || "") ? b.peak : null;
    const proxy = b.peak && !peak ? b.peak : null;
    const checking = b.filings.filter((c) => c.evidenceCaveat).reduce((t, c) => t + (c.quantumMW || 0), 0);
    const figures = [
      `<div>${b.filed ? `<dt>${mw(b.filed)}<small>MW</small></dt>` : '<dt class="none">none in this tracker</dt>'}<dd>filed with the grid${b.filed ? `: ${mw(b.granted)} MW granted, ${mw(b.filed - b.granted)} MW applied` : ""}${checking ? `; ${mw(checking)} MW of it press-reported and still being checked` : ""}</dd></div>`,
      `<div>${b.announced ? `<dt>${mw(b.announced)}<small>MW</small></dt>` : '<dt class="none">none disclosed</dt>'}<dd>announced IT load${b.mou ? `, plus ${mw(b.mou)} MW at MoU stage, outside the headline` : ""}</dd></div>`,
      peak && peak.peakMW
        ? `<div><dt>${mw(peak.peakMW)}<small>MW</small></dt><dd>state peak demand, as given in the source (${esc(peak.fy || "date not stated")}) ${sourceLinks(peak.sourceIds)}</dd></div>`
        : `<div><dt class="none">${proxy ? "no separate figure" : "not in the data"}</dt><dd>state peak demand${proxy ? `: ${esc(proxy.note || "no single state grid")}` : ""}</dd></div>`,
    ].join("");
    let shareLine = "";
    if (share !== null) shareLine = `<p class="share-line">The filings add up to <strong>${share}%</strong> of that peak. Read that as a sense of scale: a filing is the most a site may draw, usually reached in phases.${peak.note ? ` The source also notes: ${esc(peak.note)}` : ""}${checking ? ` The share counts the ${mw(checking)} MW still being checked; without it, it would be ${((b.filed - checking) / peak.peakMW * 100).toFixed(1)}%.` : ""}</p>`;
    else if (proxy && b.filed) shareLine = '<p class="share-line">With no separate state grid to compare against, no share of peak is shown.</p>';
    const projects = b.projects.map(projectItem).join("");
    const filings = b.filings.map((c) => filingItem(c, false)).join("") + b.closed.map((c) => filingItem(c, true)).join("");
    const policies = b.policies.map((po) => `<li><div>${esc(po.title)}<span>${esc(po.authority || "")} ${sourceLinks(po.sourceIds)}</span></div></li>`).join("");
    return `<p class="crumb"><a href="#">All states</a></p>
      <h2>${esc(name)}</h2>
      <dl class="key-figures state-figures">${figures}</dl>
      ${shareLine}
      <h3>Projects</h3>
      ${projects ? `<ul class="state-list">${projects}</ul>` : '<p class="panel-note">No tracked project here. The tracker follows the largest public projects and leaves out smaller facilities.</p>'}
      <h3>Grid filings</h3>
      ${filings ? `<ul class="state-list">${filings}</ul>` : '<p class="panel-note">No grid filing in this tracker.</p>'}
      <h3>State rules</h3>
      ${policies ? `<ul class="state-list">${policies}</ul>` : '<p class="panel-note">None tracked for this state; national rules apply.</p>'}`;
  }

  function renderPanel() {
    const panel = qs("#state-panel");
    panel.innerHTML = state.selected ? statePanel(state.selected) : overviewPanel();
  }

  // ---- routing: map.html#<State name> ---------------------------------------
  function fromHash() {
    let name = "";
    try { name = decodeURIComponent(location.hash.slice(1)); } catch (e) { name = ""; }
    state.selected = onMap(name) ? name : null;
    drawMap();
    renderPanel();
    // Redrawing the map drops keyboard focus; put it back on the state chosen.
    if (refocus) {
      const el = qsa(".map-state").find((x) => x.dataset.state === refocus);
      if (el) el.focus();
      refocus = null;
    }
  }
  let refocus = null;
  function select(name) {
    if (document.activeElement && document.activeElement.classList.contains("map-state")) refocus = name;
    const next = state.selected === name ? "" : name;
    if (location.hash.slice(1) === encodeURIComponent(next)) { fromHash(); return; }
    location.hash = next ? encodeURIComponent(next) : "";
    if (window.innerWidth < 960 && next) qs("#state-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderStatic() {
    renderMasthead();
    const withFiling = tracked().filter((b) => b.filed).sort((a, b) => b.filed - a.filed);
    const top = withFiling.slice(0, 2);
    const topShare = totalFiled() ? Math.round((top.reduce((s, b) => s + b.filed, 0) / totalFiled()) * 100) : 0;
    qs("#lede").textContent = withFiling.length
      ? `The ${mw(totalFiled())} MW filed with the grid sits in ${withFiling.length} ${withFiling.length === 1 ? "state" : "states"}${offMap().some((b) => b.filed) ? " on the map, plus filings the map cannot place" : ""}; ${top.map((b) => b.name).join(" and ")} hold ${topShare}% of it. Select a state to see its projects, its filings, and how the filed load compares with the state’s peak demand. ${totalCaveat(totalFiled())}`
      : "No grid filing is in this tracker yet.";
    renderNote();
  }
  function renderNote() {
    qs("#map-measure").textContent = state.measure === "filed"
      ? "Shaded by megawatts filed with the grid (granted and applied). A filing covers the whole site’s draw."
      : "Shaded by announced IT load, the figure companies give for their servers. MoU-stage load is left out, as in the headline.";
    const missing = unplaced.filter((p) => typeof projectFigures(p).itLoadMw === "number");
    qs("#map-note").textContent = state.measure === "announced" && missing.length
      ? `${missing.map((p) => `${p.name} (${mw(projectFigures(p).itLoadMw)} MW)`).join(", ")} ${missing.length === 1 ? "spans more than one state, so its load is" : "span more than one state, so their load is"} not shaded on the map. ${missing.length === 1 ? "It is" : "They are"} listed with the states.`
      : "";
  }

  qsa("[data-measure]").forEach((b) => b.addEventListener("click", () => {
    state.measure = b.dataset.measure;
    qsa("[data-measure]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderNote();
    drawMap();
    if (!state.selected) renderPanel();
  }));
  window.addEventListener("hashchange", fromHash);

  renderStatic();
  fromHash();
})();
