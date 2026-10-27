// Topics: each track with its rules, dated trail and watch items.
(function () {
  const E = window.ERW;
  if (!E) return;
  const { data, qs, esc, formatDate, eventDate, sourceLinks, tag, statusChip, rulesByTrack, corrections } = E;

  E.renderMasthead();
  const stageWords = { rumoured: "Reported, no text", drafted: "Drafted", consultation: "In consultation", notified: "Notified", operational: "In operation", concluded: "Concluded", tracking: "Register we follow" };

  qs("#toc").innerHTML = data.tracks.map((t) => `<a href="#${esc(t.id)}">${esc(t.title)}</a>`).join("");

  qs("#topics").innerHTML = data.tracks.map((t) => {
    const rules = rulesByTrack(t.id);
    const events = data.events.filter((e) => e.trackId === t.id);
    const watch = data.watch.filter((w) => w.trackId === t.id);
    return `<section class="section topic" id="${esc(t.id)}" aria-labelledby="${esc(t.id)}-title">
      <p class="rule-meta">${esc(t.vertical)} · ${esc(stageWords[t.stage] || t.stage)}${(t.authorities || []).length ? ` · ${esc(t.authorities.join(", "))}` : ""}</p>
      <h2 id="${esc(t.id)}-title">${esc(t.title)}</h2>
      <p class="topic-state">${esc(t.stageNote)}</p>
      <p class="analysis">${tag("Analysis")}${esc(t.summary)}</p>
      ${(t.whoItMoves || []).length ? `<p class="rule-meta">Affects: ${esc(t.whoItMoves.join(", "))}</p>` : ""}
      ${t.parameters.length ? `<dl class="params">${t.parameters.map((p) => `<div><dt>${esc(p.label)}</dt><dd>${esc(p.value)}${p.confidence === "reported" ? tag("Press-reported") : ""}${p.note ? `<span class="bar-sub">${esc(p.note)}</span>` : ""} ${sourceLinks(p.sourceIds)}</dd></div>`).join("")}</dl>` : ""}

      ${rules.length ? `<h3 class="group-head">Rules</h3><ul class="topic-rules">${rules.map((r) => `<li>
        <div><strong>${esc(r.title)}</strong><span class="bar-sub">${esc(r.issuer)}${r.instrument ? ` · ${esc(r.instrument)}` : ""}</span></div>
        <div>${statusChip(r)}${r.statusDate ? `<span class="bar-sub">since ${formatDate(r.statusDate)}</span>` : ""}<span class="bar-sub">${esc(r.statusNote)}</span>${r.nextStep ? `<span class="bar-sub">Next: ${esc(r.nextStep)}${r.nextStepDate ? `, ${formatDate(r.nextStepDate)}` : ""}</span>` : ""}${sourceLinks(r.sourceIds)}</div>
      </li>`).join("")}</ul>` : ""}

      ${events.length ? `<details class="trail"><summary>Dated trail: ${events.length} record${events.length === 1 ? "" : "s"}</summary><ol class="timeline">${events.map((e) => `<li><time datetime="${esc(e.date)}">${esc(eventDate(e))}</time><div><strong>${esc(e.title)}</strong>${e.confidence === "reported" ? tag("Press-reported") : ""}<p>${esc(e.detail)}</p>${e.significance ? `<p class="analysis">${tag("Analysis")}${esc(e.significance)}</p>` : ""}${corrections(e)}${sourceLinks(e.sourceIds)}</div></li>`).join("")}</ol></details>` : ""}

      ${watch.length ? `<h3 class="group-head">What we are watching</h3>${watch.map((w) => `<div class="rule">
        <h4>${esc(w.condition)}</h4>
        <p class="rule-meta">Next check ${formatDate(w.nextCheck)} · where it would appear: ${esc(w.register)}</p>
        <p class="analysis">${tag("Analysis")}${esc(w.why)}</p>
        ${sourceLinks(w.sourceIds)}
      </div>`).join("")}` : ""}
    </section>`;
  }).join("");

  function openTarget() {
    const el = location.hash && document.getElementById(location.hash.slice(1));
    const d = el && el.querySelector("details");
    if (d) d.open = true;
  }
  window.addEventListener("hashchange", openTarget);
  openTarget();
})();
