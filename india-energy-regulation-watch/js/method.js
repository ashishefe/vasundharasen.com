// Method: statuses, editions, terms.
(function () {
  const E = window.ERW;
  if (!E) return;
  const { data, qs, esc, formatDate, statusLabels } = E;

  E.renderMasthead();
  qs("#disclaimer").textContent = data.site.disclaimer;

  const meaning = {
    "in-force": "The rule has legal effect now: notified in the Gazette, issued as a binding order or memorandum, or approved and operating.",
    "in-force-future": "Notified, with a start date still ahead.",
    "draft-open": "Published as a draft; the comment window is open.",
    "draft-closed": "Published as a draft; the comment window has closed and the final text has not appeared.",
    proposed: "Announced or reported, with no text published.",
    awaited: "A step the rule itself schedules, such as a selection or a first trading session, that has not happened yet.",
    suspended: "In force on paper, with its application paused until a stated date.",
    unclear: "The record does not show the outcome: a deadline has passed with nothing published, or a draft’s fate is unknown.",
    withdrawn: "Rescinded, or folded into another scheme.",
    concluded: "A one-off process, such as a call for submissions, that has closed.",
  };
  const bucket = { "in-force": "In force", "in-force-future": "Pending", "draft-open": "Pending", "draft-closed": "Pending", proposed: "Pending", awaited: "Pending", suspended: "Pending", unclear: "Pending", withdrawn: "Withdrawn or concluded", concluded: "Withdrawn or concluded" };
  qs("#status-terms").innerHTML = Object.keys(meaning).map((k) => `<div><dt>${esc(statusLabels[k])}<span class="bar-sub">Counted as: ${esc(bucket[k])}</span></dt><dd>${esc(meaning[k])}</dd></div>`).join("");

  qs("#edition-list").innerHTML = data.editions.map((e) => {
    const n = data.events.filter((x) => x.editionId === e.id).length;
    return `<li><time datetime="${esc(e.id)}">${formatDate(e.id)}</time><div><strong>${esc(e.label)}</strong><span class="kind">${n} dated record${n === 1 ? "" : "s"}</span><p>${esc(e.note)}</p></div></li>`;
  }).join("");

  const terms = [
    ["Gazette notification", "Publication in the Gazette of India, numbered G.S.R. (general rules) or S.O. (orders). Most central rules take effect from it."],
    ["Office memorandum", "A ministry instruction, often used to issue scheme guidelines."],
    ["QCO", "Quality Control Order: a rule that products must meet an Indian standard and carry its mark before sale."],
    ["CCTS, CCC", "The Carbon Credit Trading Scheme, under which covered plants get emissions-intensity targets and earn or surrender carbon credit certificates."],
    ["GEI targets", "Greenhouse gas emission intensity targets set for each covered plant under the carbon market."],
    ["CBG", "Compressed biogas, purified biogas used like natural gas."],
    ["SHANTI Act", "The 2025 law that replaced India’s nuclear liability and atomic energy framework; its rules and regulations follow separately."],
    ["SIGHT", "Strategic Interventions for Green Hydrogen Transition, the green-hydrogen incentive programme whose Mode 2C covers green methanol."],
    ["BEE, CERC, CEA, AERB, PNGRB", "Bureau of Energy Efficiency; Central Electricity Regulatory Commission; Central Electricity Authority; Atomic Energy Regulatory Board; Petroleum and Natural Gas Regulatory Board."],
  ];
  qs("#glossary-terms").innerHTML = terms.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join("");
})();
