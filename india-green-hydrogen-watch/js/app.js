(() => {
  const data = window.GREEN_HYDROGEN_WATCH;
  if (!data) {
    document.body.innerHTML = "<main class='error'><h1>Data bundle not found.</h1><p>Run <code>python3 scripts/build_dashboard.py</code>.</p></main>";
    return;
  }

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const esc = (value) => String(value ?? "").replace(/[&<>\"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
  const fmt = (value, digits = 0) => Number(value).toLocaleString("en-IN", {maximumFractionDigits: digits, minimumFractionDigits: digits});
  const sources = new Map(data.sources.map((source) => [source.id, source]));
  let activeEdition = data.derived.latestEditionId;
  let activeAward = "production";

  const chips = (ids = []) => ids.map((id) => sources.get(id)).filter(Boolean).map((source) => `<button class="chip" data-source="${esc(source.id)}" aria-label="Open source ${source.num}">${source.num}</button>`).join("");
  const empty = (copy) => `<div class="empty"><p>${esc(copy)}</p></div>`;
  const stageClass = (stage) => stage.toLowerCase().includes("operating") ? "operating" : stage.toLowerCase().includes("construction") ? "construction" : "announced";

  function show(name) {
    $$(".view").forEach((view) => view.classList.toggle("active", view.id === `view-${name}`));
    $$(".nav button").forEach((button) => button.classList.toggle("active", button.dataset.view === name));
    window.scrollTo({top: 0, behavior: "auto"});
  }

  function openSource(id) {
    show("sources");
    window.setTimeout(() => {
      const target = document.getElementById(`source-${id}`);
      target?.scrollIntoView({block: "center"});
      target?.classList.add("source-focus");
      window.setTimeout(() => target?.classList.remove("source-focus"), 1200);
    }, 0);
  }

  function renderMetrics() {
    const h2 = data.market.productionAwards.reduce((sum, row) => sum + row.capacity, 0);
    const em = data.market.electrolyserAwards.reduce((sum, row) => sum + row.capacity, 0);
    const ammonia = data.market.ammoniaAuctions.reduce((sum, row) => sum + row.volume, 0);
    const metrics = [
      [fmt(h2 / 1000), "kt/y", "H₂ production awarded", "Not operating"],
      [fmt(em / 1000, 1), "GW/y", "Electrolyser capacity awarded", "Not commissioned"],
      [fmt(ammonia / 1000), "kt/y", "Ammonia requirement", "13 tender awards"],
      ["₹49.75", "–64.74/kg", "Ammonia tariff range", "Contract-specific"]
    ];
    $("#metrics").innerHTML = metrics.map(([value, unit, label, note]) => `<article><p><strong>${value}</strong><span>${unit}</span></p><h3>${label}</h3><small>${note}</small></article>`).join("");
  }

  function renderSignals() {
    const order = ["sight-production-awards", "sight-electrolyser-awards", "ammonia-procurement", "commercial-orders"];
    const selected = order.map((id) => data.tracks.find((track) => track.id === id)).filter(Boolean);
    $("#signals").innerHTML = selected.map((track, index) => `<article><span class="signal-number">0${index + 1}</span><div><h4>${esc(track.title)}</h4><p>${esc(track.summary)} ${chips(track.sourceIds)}</p></div></article>`).join("");
  }

  function renderEvents() {
    const events = data.events.filter((event) => event.editionId === activeEdition);
    $("#events").innerHTML = events.length ? events.map((event) => `<article><time datetime="${esc(event.date)}">${esc(event.date)}</time><div><h4>${esc(event.title)}</h4><p>${esc(event.detail)} ${chips(event.sourceIds)}</p>${event.significance ? `<p class="analysis"><b>Analysis</b>${esc(event.significance)}</p>` : ""}</div></article>`).join("") : empty("No approved developments in this edition.");
  }

  function renderTracks() {
    $("#track-grid").innerHTML = data.tracks.map((track) => `<article class="track"><p class="meta">${esc(track.pillar)} · ${esc(track.stage)}</p><h4>${esc(track.title)}</h4><p>${esc(track.stageNote)} ${chips(track.sourceIds)}</p><dl>${(track.parameters || []).map((parameter) => `<div><dt>${esc(parameter.label)}</dt><dd>${esc(parameter.value)} ${chips(parameter.sourceIds)}</dd></div>`).join("")}</dl><p class="analysis compact"><b>Analysis</b>${esc(track.summary)}</p></article>`).join("");
  }

  function renderAssets() {
    $("#asset-list").innerHTML = data.market.assets.map((row) => `<article class="record"><div class="record-stage"><i class="dot ${stageClass(row.stage)}"></i><span>${esc(row.stage)}</span><time datetime="${esc(row.date)}">${esc(row.date)}</time></div><div><p class="meta">${esc(row.company)} · ${esc(row.location)}</p><h3>${esc(row.activity)}</h3><p class="record-scale">${esc(row.scale)}</p><p>${esc(row.note)} ${chips(row.sourceIds)}</p></div></article>`).join("");
  }

  function renderAwards() {
    const production = activeAward === "production";
    const rows = production ? data.market.productionAwards : data.market.electrolyserAwards;
    const total = rows.reduce((sum, row) => sum + row.capacity, 0);
    const unique = new Set(rows.map((row) => row.company)).size;
    const unit = production ? "t/year" : "MW/year";
    $("#award-summary").innerHTML = `<span><b>${fmt(total, production ? 0 : 1)}</b>${unit}</span><span><b>${rows.length}</b>awards</span><span><b>${unique}</b>entities</span><span><b>${production ? "2027–28" : "2026–27"}</b>scheduled completion</span>`;
    $("#award-head").innerHTML = production ? "<tr><th>Company</th><th>Tranche</th><th>Capacity t/y</th><th>Scheduled completion</th></tr>" : "<tr><th>Company</th><th>Technology</th><th>Capacity MW/y</th><th>Scheduled completion</th></tr>";
    $("#award-body").innerHTML = [...rows].sort((a, b) => b.capacity - a.capacity).map((row) => `<tr><td>${esc(row.company)} ${chips(row.sourceIds)}</td><td>${production ? esc(row.tranche) : esc(row.technology)}</td><td class="numeric">${fmt(row.capacity, row.capacity % 1 ? 1 : 0)}</td><td>${esc(row.scd)}</td></tr>`).join("");
  }

  function renderPrices() {
    const rows = [...data.market.ammoniaAuctions].sort((a, b) => a.price - b.price);
    const low = rows[0];
    const high = rows[rows.length - 1];
    const total = rows.reduce((sum, row) => sum + row.volume, 0);
    const weighted = rows.reduce((sum, row) => sum + row.price * row.volume, 0) / total;
    $("#price-band").innerHTML = `<article><span>Low</span><b>₹${fmt(low.price, 2)}</b><small>${esc(low.buyer)} · ${esc(low.location)}</small></article><article><span>Volume-weighted</span><b>₹${fmt(weighted, 2)}</b><small>${fmt(total)} t/year tender book</small></article><article><span>High</span><b>₹${fmt(high.price, 2)}</b><small>${esc(high.buyer)} · ${esc(high.location)}</small></article>`;
    $("#price-bars").innerHTML = rows.map((row) => `<article><span>${esc(row.location)}</span><div><i style="width:${((row.price - 45) / 22 * 100).toFixed(1)}%"></i></div><b>₹${fmt(row.price, 2)}</b></article>`).join("");
    $("#price-body").innerHTML = rows.map((row) => `<tr><td>${esc(row.buyer)}<small>${esc(row.location)}</small></td><td>${esc(row.winner)} ${chips(row.sourceIds)}</td><td class="numeric">${fmt(row.volume)}</td><td class="numeric">₹${fmt(row.price, 2)}</td></tr>`).join("");
  }

  function renderOrders() {
    $("#order-list").innerHTML = data.market.commercialMoves.map((row) => `<article class="record"><div class="record-stage"><span>${esc(row.instrument)}</span><time datetime="${esc(row.date)}">${esc(row.date)}</time></div><div><p class="meta">${esc(row.company)} × ${esc(row.counterparty)}</p><h3>${esc(row.subject)}</h3><p class="record-scale">${esc(row.scale)}</p><p>${esc(row.note)} ${chips(row.sourceIds)}</p></div></article>`).join("");
  }

  function renderWatch() {
    $("#watchlist").innerHTML = data.watch.map((item, index) => `<article><span class="watch-number">${String(index + 1).padStart(2, "0")}</span><p class="meta">Next check · ${esc(item.nextCheck)}</p><h3>${esc(item.condition)}</h3><p>${esc(item.register)}</p><p class="analysis"><b>Why it matters</b>${esc(item.why)} ${chips(item.sourceIds)}</p></article>`).join("");
  }

  function renderSources(query = "") {
    const needle = query.toLowerCase();
    const list = data.sources.filter((source) => `${source.title} ${source.publisher} ${source.id}`.toLowerCase().includes(needle));
    $("#source-list").innerHTML = list.length ? list.map((source) => `<article id="source-${esc(source.id)}"><span class="source-number">${source.num}</span><div><p class="meta">${esc(source.class)} · ${esc(source.date)}</p><h3>${esc(source.title)}</h3><p>${esc(source.publisher)}</p></div><a href="${esc(source.url)}" target="_blank" rel="noopener">Open source <span aria-hidden="true">↗</span></a></article>`).join("") : empty("No sources match this filter.");
  }

  function render() {
    const edition = data.editions.find((item) => item.id === activeEdition) || {};
    $("#title").textContent = data.site.title;
    $("#byline").textContent = data.site.byline;
    $("#strapline").textContent = data.site.strapline;
    $("#edition-label").textContent = edition.label || "";
    $("#edition-note").textContent = edition.note || "";
    $("#footer-note").textContent = data.site.footerNote;
    $("#disclaimer").textContent = data.site.disclaimer;
    $("#method-note").textContent = data.site.methodNote;
    renderMetrics(); renderSignals(); renderEvents(); renderTracks(); renderAssets(); renderAwards(); renderPrices(); renderOrders(); renderWatch(); renderSources();
  }

  $$(".nav button").forEach((button) => button.addEventListener("click", () => show(button.dataset.view)));
  $$("[data-award]").forEach((button) => button.addEventListener("click", () => {
    activeAward = button.dataset.award;
    $$("[data-award]").forEach((item) => item.classList.toggle("active", item === button));
    renderAwards();
  }));
  document.addEventListener("click", (event) => {
    const source = event.target.closest("[data-source]");
    if (source) openSource(source.dataset.source);
  });
  $("#source-search").addEventListener("input", (event) => renderSources(event.target.value));

  const select = $("#edition");
  select.innerHTML = data.editions.map((edition) => `<option value="${esc(edition.id)}">${esc(edition.label)}</option>`).join("");
  select.value = activeEdition;
  select.addEventListener("change", (event) => { activeEdition = event.target.value; render(); });

  const savedTheme = window.localStorage?.getItem("ghw-theme");
  if (savedTheme === "light") document.documentElement.classList.add("light");
  const theme = $("#theme");
  const themeLabel = () => { theme.textContent = document.documentElement.classList.contains("light") ? "Dark" : "Light"; };
  theme.addEventListener("click", () => {
    document.documentElement.classList.toggle("light");
    window.localStorage?.setItem("ghw-theme", document.documentElement.classList.contains("light") ? "light" : "dark");
    themeLabel();
  });
  themeLabel();
  render();
})();
