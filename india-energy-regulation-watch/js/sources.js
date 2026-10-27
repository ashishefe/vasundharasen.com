// Sources: the ledger, with what each source is cited for.
(function () {
  const E = window.ERW;
  if (!E) return;
  const { data, qs, qsa, esc, formatDate, classKind } = E;

  E.renderMasthead();
  const uses = new Map(data.sources.map((s) => [s.id, []]));
  const cite = (ids, label, href) => (ids || []).forEach((id) => uses.has(id) && uses.get(id).push({ label, href }));
  data.tracks.forEach((t) => {
    cite(t.sourceIds, t.title, `topics.html#${t.id}`);
    t.parameters.forEach((p) => cite(p.sourceIds, `${t.title}: ${p.label}`, `topics.html#${t.id}`));
  });
  data.rules.forEach((r) => cite(r.sourceIds, "Rule: " + r.title, `topics.html#${r.trackId}`));
  data.events.forEach((e) => {
    cite(e.sourceIds, e.title, `topics.html#${e.trackId}`);
    (e.corrections || []).forEach((c) => cite(c.sourceIds, "Correction: " + e.title, `topics.html#${e.trackId}`));
  });
  data.watch.forEach((w) => cite(w.sourceIds, "Watching: " + w.condition, `topics.html#${w.trackId}`));

  const counts = { all: data.sources.length };
  data.sources.forEach((s) => { counts[s.class] = (counts[s.class] || 0) + 1; });
  qs("#sources-note").textContent = `${data.sources.length} public sources: ${counts["primary-official"] || 0} official records (gazette notifications, ministry and regulator documents, parliamentary replies) and ${counts["secondary-press"] || 0} press or reference reports. Each row lists what it is cited for.`;
  const kinds = [["all", "All"], ["primary-official", "Official"], ["secondary-press", "Press"]];
  qs("#kind-switch").innerHTML = kinds.map(([k, label], i) => `<button type="button" data-kind="${k}" aria-pressed="${i === 0}">${label} <span class="count">${counts[k] || 0}</span></button>`).join("");
  let kind = "all";
  function render() {
    const q = qs("#source-search").value.trim().toLowerCase();
    const list = data.sources.filter((s) => (kind === "all" || s.class === kind) && (!q || `${s.title} ${s.publisher} ${s.date}`.toLowerCase().includes(q)));
    qs("#source-count").textContent = `${list.length} of ${data.sources.length} sources`;
    qs("#source-body").innerHTML = list.map((s) => {
      const seen = new Set();
      const u = (uses.get(s.id) || []).filter((x) => !seen.has(x.label) && seen.add(x.label));
      const shown = u.slice(0, 4).map((x) => `<a href="${esc(x.href)}">${esc(x.label)}</a>`).join("; ");
      return `<tr id="source-${esc(s.id)}">
        <td class="list-name">${E.sourceLink(s, s.title)}</td>
        <td>${esc(s.publisher)}</td>
        <td class="nowrap">${formatDate(s.date)}</td>
        <td>${esc(classKind[s.class])}</td>
        <td class="uses">${u.length ? shown + (u.length > 4 ? `; and ${u.length - 4} more` : "") : "Kept in the ledger; no current record cites it"}</td>
      </tr>`;
    }).join("");
  }
  qs("#source-search").addEventListener("input", render);
  qsa("#kind-switch button").forEach((b) => b.addEventListener("click", () => {
    kind = b.dataset.kind;
    qsa("#kind-switch button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  }));
  render();
})();
