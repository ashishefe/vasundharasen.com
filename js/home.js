// Homepage tracker cards, filled from js/headlines.generated.js (built from each tracker's data).
// Without JavaScript the cards still show each tracker's name, question and link.
(function () {
  const cards = window.SITE_HEADLINES;
  const grid = document.getElementById("tracker-grid");
  if (!cards || !grid) return;
  // Replace only the static cards whose tracker has figures; others keep their static text.
  const byId = new Map(cards.map((c) => [c.id, c]));
  if (cards.length < grid.children.length) {
    [...grid.children].forEach((el) => {
      const id = (el.querySelector("a")?.getAttribute("href") || "").split("/")[0];
      const c = byId.get(id);
      if (c) el.outerHTML = render(c);
    });
    return;
  }
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = (v) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || ""); return m ? `${Number(m[3])} ${MONTHS[m[2] - 1]} ${m[1]}` : v; };
  grid.innerHTML = cards.map(render).join("");
  function render(c) { return `<article class="tracker">
      <h3><a href="${esc(c.id)}/index.html">${esc(c.name)}</a></h3>
      <p class="tracker-q">${esc(c.question)}</p>
      <dl class="tracker-figures">${c.figures.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}</dl>
      ${c.caveat ? `<p class="tracker-caveat">${esc(c.caveat)}</p>` : ""}
      <p class="tracker-meta">Edition of ${esc(date(c.edition))} · <a href="${esc(c.id)}/index.html">Open the tracker <span aria-hidden="true">→</span></a></p>
    </article>`; }
})();
