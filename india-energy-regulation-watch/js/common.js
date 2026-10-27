// Shared helpers for the Energy Regulation Watch pages. Exposes window.ERW.
// Every figure comes from window.ENERGY_REG_WATCH (the generated data bundle).
(function () {
  const data = window.ENERGY_REG_WATCH;
  if (!data || !data.rules || !data.rules.length) {
    document.addEventListener("DOMContentLoaded", () => {
      const main = document.querySelector("#main");
      if (main) main.innerHTML = '<p class="noscript">The data bundle has not been generated. Run <code>python3 scripts/build_dashboard.py</code> from <code>india-energy-regulation-watch/</code>.</p>';
    });
    return;
  }

  const D = data.derived;
  const sourceMap = new Map(data.sources.map((s) => [s.id, s]));
  const trackMap = new Map(data.tracks.map((t) => [t.id, t]));
  const ruleMap = new Map(data.rules.map((r) => [r.id, r]));

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const uniq = (ids) => [...new Set(ids)];

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function formatDate(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || "");
    return m ? `${Number(m[3])} ${MONTHS[m[2] - 1].slice(0, 3)} ${m[1]}` : String(v || "");
  }
  const eventDate = (e) => e.displayDate || formatDate(e.date);

  const classKind = { "primary-official": "Official record", "secondary-press": "Press", analysis: "Analysis" };

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

  // ---- rule status ----------------------------------------------------------
  // Mirrors RULE_STATUSES in scripts/build_dashboard.py.
  const statusLabels = {
    "in-force": "In force",
    "in-force-future": "Notified; starts later",
    "draft-open": "Draft, open for comment",
    "draft-closed": "Draft; comments closed",
    proposed: "Proposed; no text yet",
    awaited: "Scheduled step not yet taken",
    suspended: "Suspended",
    unclear: "Outcome not public",
    withdrawn: "Withdrawn",
    concluded: "Concluded",
  };
  const bucketTone = { "in force": "good", pending: "warn", ended: "neutral" };
  const STATUS_ORDER = Object.keys(statusLabels);
  function statusChip(rule) {
    return `<span class="status status-${bucketTone[rule.bucket] || "neutral"}">${esc(statusLabels[rule.status] || rule.status)}</span>${rule.basis === "press" ? tag("Press-reported") : ""}`;
  }
  const rulesByTrack = (trackId) => data.rules.filter((r) => r.trackId === trackId)
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || a.title.localeCompare(b.title));
  const plainTitle = (t) => t.title;

  // An event's corrections, as a note under it.
  function corrections(e) {
    return (e.corrections || []).map((c) => `<p class="correction">${tag("Correction, " + formatDate(c.editionId))}${esc(c.text)} ${sourceLinks(c.sourceIds)}</p>`).join("");
  }

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

  function renderMasthead() {
    const edition = data.editions[0];
    const asOf = qs("#as-of");
    if (asOf && edition) {
      asOf.textContent = formatDate(edition.id);
      asOf.setAttribute("datetime", edition.id);
    }
    const gen = qs("#generated");
    if (gen) gen.textContent = `Edition of ${formatDate(edition.id)}; this page was built from it on ${formatDate(D.generatedAt.slice(0, 10))}.`;
    if (D.preview) {
      const bar = document.createElement("p");
      bar.className = "preview-bar";
      bar.textContent = `Preview: includes the ${D.preview.proposal} proposal, which is ${D.preview.status === "approved" ? "approved" : "not yet approved"}. Not for publication.`;
      document.body.prepend(bar);
    }
  }

  window.ERW = {
    data, D, sourceMap, trackMap, ruleMap, qs, qsa, uniq, esc, formatDate, eventDate, classKind,
    sourceLinks, sourceLink, tag, statusLabels, statusChip, rulesByTrack, plainTitle, corrections,
    downloadCsv, sourceText, renderMasthead, STATUS_ORDER,
  };
})();
