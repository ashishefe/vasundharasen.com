// Shared helpers for the Green Hydrogen Watch pages. Exposes window.GHW.
// Every figure comes from window.GREEN_HYDROGEN_WATCH (the generated data bundle).
(function () {
  const data = window.GREEN_HYDROGEN_WATCH;
  if (!data || !data.pipeline) {
    document.addEventListener("DOMContentLoaded", () => {
      const main = document.querySelector("#main");
      if (main) main.innerHTML = '<p class="noscript">The data bundle has not been generated. Run <code>python3 scripts/build_dashboard.py</code> from <code>india-green-hydrogen-watch/</code>.</p>';
    });
    return;
  }

  const D = data.derived;
  const P = data.pipeline;
  const M = data.market;
  const sourceMap = new Map(data.sources.map((s) => [s.id, s]));
  const trackMap = new Map(data.tracks.map((t) => [t.id, t]));

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const uniq = (ids) => [...new Set(ids)];

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  // International grouping (862,000), not lakh grouping, to match the sources.
  function num(v) {
    return Number(v || 0).toLocaleString("en-GB", { maximumFractionDigits: 1 });
  }
  function pct(part, whole) {
    if (!whole) return "0";
    const p = (part / whole) * 100;
    return p > 0 && p < 1 ? p.toFixed(1) : String(Math.round(p));
  }
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function formatDate(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || "");
    return m ? `${Number(m[3])} ${MONTHS[m[2] - 1].slice(0, 3)} ${m[1]}` : String(v || "");
  }

  const classKind = { "primary-official": "Official or company record", "secondary-press": "Press", analysis: "Analysis" };
  const basisTag = { official: "", press: "Press-reported", analysis: "Analysis" };

  // One entry per publisher; a publisher cited more than once gets numbered links.
  function sourceLinks(ids) {
    const groups = new Map();
    uniq(ids || []).map((id) => sourceMap.get(id)).filter(Boolean).forEach((s) => {
      if (!groups.has(s.publisher)) groups.set(s.publisher, []);
      groups.get(s.publisher).push(s);
    });
    const parts = [...groups].map(([pub, list]) => list.length === 1
      ? sourceLink(list[0], pub)
      : `<span>${esc(pub)}: ${list.map((s, i) => sourceLink(s, String(i + 1))).join(", ")}</span>`);
    return parts.length ? `<span class="sources">${parts.join(" · ")}</span>` : "";
  }
  function sourceLink(s, text) {
    const url = /^https?:\/\//i.test(s.url || "") ? s.url : "#";
    const press = s.class === "secondary-press" ? " (press)" : "";
    return `<a href="${esc(url)}" target="_blank" rel="noreferrer" title="${esc(s.title + " · " + formatDate(s.date))}">${esc(text)}</a>${press}`;
  }
  function tag(text) {
    return text ? `<span class="tag">${esc(text)}</span>` : "";
  }

  // ---- award status ---------------------------------------------------------
  // Mirrors annotate_market() in scripts/build_dashboard.py.
  const statusLabels = {
    due: "Not yet due",
    overdue: "Past its date; commissioning under the award not confirmed",
    "part-operating-late": "Partly operating; the rest past its date",
    "part-operating": "Partly operating",
    operating: "Operating",
    "contracted-official": "Buyer agreement signed",
    "contracted-press": "Buyer agreement signed (press-reported)",
    "no-agreement-found": "No buyer agreement found",
    contracted: "Supply contract signed",
    awarded: "Awarded",
  };
  const statusTone = { due: "neutral", overdue: "warn", "part-operating-late": "warn", "part-operating": "good", operating: "good", "contracted-official": "good", "contracted-press": "good", "no-agreement-found": "warn", contracted: "good", awarded: "neutral" };
  function statusChip(status) {
    return `<span class="status status-${statusTone[status] || "neutral"}">${esc(statusLabels[status] || status)}</span>`;
  }

  // Evidence and notes attached to a market row by the build.
  function rowEvidence(row) {
    const items = (row.evidence || []).map((e) => `<li>${esc(e.text)} ${sourceLinks(e.sourceIds)}</li>`)
      .concat((row.notes || []).map((n) => `<li class="${n.correction ? "correction" : "note"}">${esc(n.text)} ${sourceLinks(n.sourceIds)}</li>`));
    return items.length ? `<ul class="evidence">${items.join("")}</ul>` : "";
  }

  // ---- ladders --------------------------------------------------------------
  function stageLabel(ladder, st) {
    return st.label || P.stageLabels[st.stage];
  }
  function stageFigure(ladder, st) {
    if (st.value === null || st.value === undefined) return `<span class="none">${esc(st.display)}</span>`;
    return `${num(st.value)}<small>${esc(ladder.unit)}</small>`;
  }
  const ladderById = new Map(P.ladders.map((l) => [l.id, l]));

  // ---- downloads ------------------------------------------------------------
  // A leading = + - @ would make a spreadsheet run the cell as a formula.
  function downloadCsv(filename, headers, rows) {
    const cell = (v) => {
      let s = String(v ?? "");
      if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return /[",\n\r]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s;
    };
    const csv = [headers.join(",")].concat(rows.map((r) => r.map(cell).join(","))).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  const sourceText = (ids) => uniq(ids || []).map((id) => sourceMap.get(id)).filter(Boolean).map((s) => `${s.publisher}, ${s.title} (${s.date}) ${s.url}`).join(" | ");

  // ---- masthead -------------------------------------------------------------
  function renderMasthead() {
    const edition = data.editions[0];
    const asOf = qs("#as-of");
    if (asOf && edition) {
      asOf.textContent = formatDate(edition.id);
      asOf.setAttribute("datetime", edition.id);
    }
    const gen = qs("#generated");
    if (gen) gen.textContent = `Edition of ${formatDate(D.asOf)}; this page was built from it on ${formatDate(D.generatedAt.slice(0, 10))}.`;
    if (D.preview) {
      const bar = document.createElement("p");
      bar.className = "preview-bar";
      bar.textContent = `Preview: includes the ${D.preview.proposal} proposal, which is ${D.preview.status === "approved" ? "approved" : "not yet approved"}. Not for publication.`;
      document.body.prepend(bar);
    }
  }

  const roman = (t) => "Tranche " + ({ T1: "I", T2: "II", T3: "III" }[t] || t.replace("T", ""));
  const isLate = (r) => r.status === "overdue" || r.status === "part-operating-late";
  const isPart = (r) => r.status === "part-operating" || r.status === "part-operating-late";

  window.GHW = {
    data, D, P, M, sourceMap, trackMap, ladderById, qs, qsa, uniq, esc, num, pct, formatDate, MONTHS,
    classKind, basisTag, sourceLinks, sourceLink, tag, statusLabels, statusChip, rowEvidence,
    stageLabel, stageFigure, downloadCsv, sourceText, renderMasthead, roman, isLate, isPart,
  };
})();
