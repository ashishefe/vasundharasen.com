// Plants & deals: physical assets, then the agreements around them.
(function () {
  const G = window.GHW;
  if (!G) return;
  const { M, qs, esc, formatDate, sourceLinks, rowEvidence } = G;

  G.renderMasthead();
  qs("#lede").textContent = "Plants that are running or under way, and the agreements, orders, licences and finance behind the industry. Most of the plants here are pilots outside the award schemes; the awards and their progress are on the Awards page. Sizes are given as each source states them, in different units, so they are not added up.";

  const byDate = (a, b) => b.date.localeCompare(a.date);
  const isFactory = (a) => /electrolyser/i.test(a.activity);
  const plantGroups = [
    { id: "operating-plants", title: "Hydrogen plants operating", note: "Commissioning or production stated by the owner. Only JSW Vijayanagar was built under a SIGHT production award.", rows: M.assets.filter((a) => a.stage === "Operating" && !isFactory(a)) },
    { id: "operating-factories", title: "Electrolyser factories operating", note: "Factory lines with a commissioning record. Ohmium’s 2024 factory launch is listed under Awards, with its award, because no SIGHT commissioning record ties it to the award.", rows: M.assets.filter((a) => a.stage === "Operating" && isFactory(a)) },
    { id: "under-way", title: "Under way or planned", note: "A foundation stone or a supplier’s announcement. Neither is a plant that produces hydrogen.", rows: M.assets.filter((a) => a.stage !== "Operating") },
  ];
  const kind = (m) => /purchase|supply|offtake/i.test(m.instrument) ? "agreements"
    : /order/i.test(m.instrument) ? "orders"
    : /finance/i.test(m.instrument) ? "finance"
    : /licence|tie-up|collaboration/i.test(m.instrument) ? "licences" : "agreements";
  const dealGroups = [
    { id: "agreements", title: "Supply and offtake agreements", note: "Signed agreements to buy hydrogen or ammonia, and one competitive selection (AM Green under Germany’s H2Global) whose contract terms are not public. The ammonia purchase agreements under the auctions are listed award by award on the Awards page; the one here has a company release of its own." },
    { id: "orders", title: "Equipment orders", note: "Firm orders for electrolysers, in megawatts of equipment. They are a different measure from factory capacity in megawatts a year." },
    { id: "licences", title: "Technology licences and tie-ups", note: "Agreements to make or supply technology. None states a factory output on its own." },
    { id: "finance", title: "Finance", note: "Loans and investment approvals. A loan approval does not show work on site." },
  ].map((g) => ({ ...g, rows: M.commercialMoves.filter((m) => kind(m) === g.id) }));

  function plantRow(a) {
    const original = a.original && a.original.scale ? `<span class="bar-sub">Earlier editions: ${esc(a.original.scale)}</span>` : "";
    return `<li class="item">
      <div class="item-main">
        <h3>${esc(a.company)}<span class="item-sub">${esc(a.location)}</span></h3>
        <p>${esc(a.activity)}. ${esc(a.note)}</p>
        ${rowEvidence(a)}
        ${sourceLinks(a.sourceIds)}
      </div>
      <dl class="item-facts"><div><dt>Size as stated</dt><dd>${esc(a.scale)}${original}</dd></div><div><dt>Dated</dt><dd>${formatDate(a.date)}</dd></div></dl>
    </li>`;
  }
  function dealRow(m) {
    return `<li class="item">
      <div class="item-main">
        <h3>${esc(m.company)} <span class="with">with</span> ${esc(m.counterparty)}<span class="item-sub">${esc(m.instrument)}: ${esc(m.subject)}</span></h3>
        <p>${esc(m.note)}</p>
        ${rowEvidence(m)}
        ${sourceLinks(m.sourceIds)}
      </div>
      <dl class="item-facts"><div><dt>Size as stated</dt><dd>${esc(m.scale)}</dd></div><div><dt>Dated</dt><dd>${formatDate(m.date)}</dd></div></dl>
    </li>`;
  }
  const section = (g, row, level) => g.rows.length ? `<section class="section" id="${g.id}" aria-labelledby="${g.id}-title">
      <h2 id="${g.id}-title">${esc(g.title)} <span class="count">${g.rows.length}</span></h2>
      <p class="section-note">${esc(g.note)}</p>
      <ul class="items">${[...g.rows].sort(byDate).map(row).join("")}</ul>
    </section>` : "";

  const groups = plantGroups.map((g) => [g, plantRow]).concat(dealGroups.map((g) => [g, dealRow])).filter(([g]) => g.rows.length);
  qs("#groups").innerHTML = groups.map(([g, row]) => section(g, row)).join("");
  qs("#toc").innerHTML = groups.map(([g]) => `<a href="#${g.id}">${esc(g.title)}</a>`).join("");
})();
