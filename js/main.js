// Bygger siden fra innholdet i data.js. Innhold endres der, ikke her.
(function () {
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  let lang = store.get("lang") || "no";
  const root = document.documentElement;

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function section(id, title, body) {
    return `<section id="${id}" class="section">
      <h2 class="section-label">${esc(title)}</h2>
      <div class="section-body">${body}</div>
    </section>`;
  }

  // Flere stillinger hos samme arbeidsgiver (oppføringer rett etter hverandre
  // med lik "org") vises samlet, med en strek mellom stillingene.
  function grouped(items) {
    const groups = [];
    items.forEach((i) => {
      const last = groups[groups.length - 1];
      if (last && last[0].org === i.org) last.push(i);
      else groups.push([i]);
    });
    return `<ol class="timeline">${groups
      .map((g) => {
        if (g.length === 1) return entry(g[0]);
        const start = g[g.length - 1].period.split(" – ")[0];
        const end = g[0].period.split(" – ").pop();
        return `<li class="entry">
          <p class="entry-period">${esc(start)} – ${esc(end)}</p>
          <div>
            <h3 class="entry-role">${esc(g[0].org)}</h3>
            <p class="entry-org">${esc(g[0].place)}</p>
            <ol class="roles">${g
              .map(
                (i) => `<li>
                  <h4 class="role-title">${esc(i.role)}</h4>
                  <p class="role-period">${esc(i.period)}</p>
                  ${i.points.map((p) => `<p class="entry-text">${esc(p)}</p>`).join("")}
                </li>`
              )
              .join("")}</ol>
          </div>
        </li>`;
      })
      .join("")}</ol>`;
  }

  function entry(i) {
    return timeline([i]).replace(/^<ol class="timeline">|<\/ol>$/g, "");
  }

  function timeline(items) {
    return `<ol class="timeline">${items
      .map(
        (i) => `<li class="entry">
          <p class="entry-period">${esc(i.period)}</p>
          <div>
            <h3 class="entry-role">${esc(i.role)}</h3>
            <p class="entry-org">${esc(i.org)} <span class="sep">·</span> ${esc(i.place)}</p>
            ${i.points.map((p) => `<p class="entry-text">${esc(p)}</p>`).join("")}
          </div>
        </li>`
      )
      .join("")}</ol>`;
  }

  function render() {
    const t = SITE[lang];
    root.lang = lang === "no" ? "nb" : "en";
    const hasPosts = t.writing.posts.length > 0;

    const navIds = ["om", "erfaring", "utdanning", "master", "opptatt", "skriving", "fritid", "kontakt"].filter(
      (id) => id !== "skriving" || hasPosts
    );
    document.getElementById("nav-links").innerHTML = navIds
      .map((id) => `<a href="#${id}">${esc(t.nav[id])}</a>`)
      .join("");

    const hero = `<header class="hero" id="topp">
      <div class="hero-text">
        <p class="kicker">${esc(t.hero.kicker)}</p>
        <h1>${esc(SITE.name)}</h1>
        <p class="lead">${esc(t.hero.lead)}</p>
      </div>
      <div class="portrait" id="portrait"><span>${esc(SITE.initials)}</span></div>
    </header>`;

    const about = section("om", t.about.title, t.about.paragraphs.map((p) => `<p class="prose">${esc(p)}</p>`).join(""));

    const skills = `<div class="skills">${t.skills.groups
      .map(
        ([label, list]) =>
          `<div><h3 class="small-label">${esc(label)}</h3><ul class="chips">${list
            .map((s) => `<li>${esc(s)}</li>`)
            .join("")}</ul></div>`
      )
      .join("")}</div>`;

    const experience = section("erfaring", t.experience.title, grouped(t.experience.items) + skills);
    const education = section("utdanning", t.education.title, timeline(t.education.items));

    const thesis = section(
      "master",
      t.thesis.title,
      `<h3 class="display">${esc(t.thesis.heading)}</h3>
       ${t.thesis.paragraphs.map((p) => `<p class="prose">${esc(p)}</p>`).join("")}
       <dl class="facts">${t.thesis.facts
         .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
         .join("")}</dl>`
    );

    const interests = section(
      "opptatt",
      t.interests.title,
      `<p class="prose prose-large">${esc(t.interests.intro)}</p>
       <div class="cards">${t.interests.items
         .map((i) => `<article><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></article>`)
         .join("")}</div>
       <h3 class="small-label">${esc(t.interests.sourcesLabel)}</h3>
       <ul class="links">${t.interests.sources
         .map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a></li>`)
         .join("")}</ul>`
    );

    const writing = hasPosts
      ? section(
          "skriving",
          t.writing.title,
          `<ul class="posts">${t.writing.posts
            .map(
              (p) => `<li><time>${esc(p.date)}</time><div><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(
                p.title
              )}</a>${p.note ? `<p>${esc(p.note)}</p>` : ""}</div></li>`
            )
            .join("")}</ul>`
        )
      : "";

    const life = section(
      "fritid",
      t.life.title,
      `<div class="two-col">${t.life.blocks
        .map(
          (b) => `<div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p>${
            b.list ? `<ul class="plain">${b.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""
          }</div>`
        )
        .join("")}</div>`
    );

    const contact = section(
      "kontakt",
      t.contact.title,
      `<p class="prose">${esc(t.contact.text)}</p>
       <dl class="facts">
         <div><dt>${esc(t.contact.emailLabel)}</dt><dd><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></dd></div>
         ${
           SITE.linkedin
             ? `<div><dt>${esc(t.contact.linkedinLabel)}</dt><dd><a href="${esc(
                 SITE.linkedin
               )}" target="_blank" rel="noopener">${esc(SITE.linkedin.replace(/^https?:\/\/(www\.)?/, ""))}</a></dd></div>`
             : ""
         }
       </dl>`
    );

    document.getElementById("app").innerHTML =
      hero + about + experience + education + thesis + interests + writing + life + contact;
    document.getElementById("footer-text").textContent = `© ${new Date().getFullYear()} ${SITE.name} · ${t.footer}`;

    document.querySelectorAll("[data-lang]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    document.getElementById("theme-toggle").setAttribute("aria-label", t.ui.theme);
    document.title = SITE.name;

    // Vis profilbildet hvis filen finnes, ellers beholdes initialene.
    const img = new Image();
    img.alt = SITE.name;
    img.onload = () => {
      const el = document.getElementById("portrait");
      if (el) { el.innerHTML = ""; el.appendChild(img); el.classList.add("has-photo"); }
    };
    img.src = SITE.photo;
  }

  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.addEventListener("click", () => {
      lang = b.dataset.lang;
      store.set("lang", lang);
      render();
    })
  );

  const savedTheme = store.get("theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const dark =
      root.dataset.theme === "dark" ||
      (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "light" : "dark";
    store.set("theme", root.dataset.theme);
  });

  render();
})();
