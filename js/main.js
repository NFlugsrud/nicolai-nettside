// Bygger siden fra innholdet i data.js. Innhold endres der, ikke her.
(function () {
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  let lang = store.get("lang") === "en" ? "en" : "no";
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canAnimate = !reduceMotion && "IntersectionObserver" in window;
  if (canAnimate) root.classList.add("anim");

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const isCurrent = (period) => /(nå|present)$/i.test(period.trim());

  function badge(org) {
    const fixed = SITE.badges && SITE.badges[org];
    const text = fixed || org.split(/\s+/).filter((w) => /^[A-ZÆØÅ]/.test(w)).map((w) => w[0]).join("").slice(0, 3);
    return `<span class="badge" aria-hidden="true">${esc(text)}</span>`;
  }

  const icons = {
    giving: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.4-3.6-8.5S9.5 6.1 12 3.5z"/>',
    chart: '<path d="M4 19.5h16M7 16v-5M12 16V7M17 16v-8"/>',
    run: '<circle cx="14.5" cy="4.8" r="1.8"/><path d="M8 21l3-6 3 2.5V22M7 11l3-3.5 4 1.5 2 3h3"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.2c0-1.6 1-2.7 2.4-2.7 1.5 0 2.1 1 2.1 2.7V17"/>',
    arrow: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  };
  const icon = (name, cls = "icon") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

  let sectionNo = 0;
  function section(id, title, body, extraClass = "") {
    sectionNo += 1;
    const n = String(sectionNo).padStart(2, "0");
    return `<section id="${id}" class="section ${extraClass}">
      <h2 class="section-label reveal"><span class="section-no">${n}</span>${esc(title)}</h2>
      <div class="section-body">${body}</div>
    </section>`;
  }

  // Oppføringer rett etter hverandre med samme "org" vises samlet.
  function group(items) {
    const groups = [];
    items.forEach((i) => {
      const last = groups[groups.length - 1];
      if (last && last[0].org === i.org) last.push(i);
      else groups.push([i]);
    });
    return groups;
  }

  function nowTag(period, t) {
    return isCurrent(period) ? ` <span class="now">${esc(t.ui.now)}</span>` : "";
  }

  function entry(g, t, extra) {
    const cls = `entry reveal${extra ? " is-extra" : ""}`;
    const points = (i) => i.points.map((p) => `<p class="entry-text">${esc(p)}</p>`).join("");
    if (g.length === 1) {
      const i = g[0];
      return `<li class="${cls}">
        ${badge(i.org)}
        <div class="entry-main">
          <p class="entry-period">${esc(i.period)}${nowTag(i.period, t)}</p>
          <h3 class="entry-role">${esc(i.role)}</h3>
          <p class="entry-org">${esc(i.org)} <span class="sep">·</span> ${esc(i.place)}</p>
          ${points(i)}
        </div>
      </li>`;
    }
    const start = g[g.length - 1].period.split(" – ")[0];
    const end = g[0].period.split(" – ").pop();
    return `<li class="${cls}">
      ${badge(g[0].org)}
      <div class="entry-main">
        <p class="entry-period">${esc(start)} – ${esc(end)}${nowTag(end, t)}</p>
        <h3 class="entry-role">${esc(g[0].org)}</h3>
        <p class="entry-org">${esc(g[0].place)}</p>
        <ol class="roles">${g
          .map(
            (i) => `<li>
              <h4 class="role-title">${esc(i.role)}</h4>
              <p class="role-period">${esc(i.period)}</p>
              ${points(i)}
            </li>`
          )
          .join("")}</ol>
      </div>
    </li>`;
  }

  function timeline(items, t, id) {
    const groups = group(items);
    const limit = SITE.visibleEntries || groups.length;
    const hidden = Math.max(0, groups.length - limit);
    const list = groups.map((g, n) => entry(g, t, n >= limit)).join("");
    const more = hidden
      ? `<button type="button" class="more" data-more="${id}" aria-expanded="false" data-label-more="${esc(
          t.ui.showMore(hidden)
        )}" data-label-less="${esc(t.ui.showLess)}">${esc(t.ui.showMore(hidden))}</button>`
      : "";
    return `<ol class="timeline" id="tl-${id}" data-collapsed="${hidden ? "true" : "false"}">${list}</ol>${more}`;
  }

  function buttons(t, inHero) {
    const cv = SITE.cv && SITE.cv[lang];
    const first = inHero
      ? `<a class="btn btn-primary" href="#kontakt">${icon("mail")}${esc(t.ui.contactBtn)}</a>`
      : `<a class="btn btn-primary" href="mailto:${esc(SITE.email)}">${icon("mail")}${esc(SITE.email)}</a>`;
    return `<div class="buttons">
      ${first}
      ${cv ? `<a class="btn" href="${esc(cv)}" download>${icon("download")}${esc(t.ui.cvBtn)}</a>` : ""}
      ${SITE.linkedin ? `<a class="btn" href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">${icon("linkedin")}LinkedIn</a>` : ""}
    </div>`;
  }

  function render() {
    const t = SITE[lang];
    sectionNo = 0;
    root.lang = lang === "no" ? "nb" : "en";
    const hasPosts = t.writing.posts.length > 0;

    const navIds = ["om", "erfaring", "utdanning", "master", "opptatt", "skriving", "fritid", "kontakt"].filter(
      (id) => id !== "skriving" || hasPosts
    );
    document.getElementById("nav-links").innerHTML = navIds
      .map((id) => `<a href="#${id}" data-nav="${id}">${esc(t.nav[id])}</a>`)
      .join("");

    const hero = `<header class="hero" id="topp">
      <div class="hero-text">
        <p class="kicker">${esc(t.hero.kicker)}</p>
        <h1>${esc(SITE.name)}</h1>
        <p class="lead">${esc(t.hero.lead)}</p>
        ${buttons(t, true)}
      </div>
      <div class="portrait" id="portrait"><span>${esc(SITE.initials)}</span></div>
      <dl class="hero-facts">${t.hero.facts
        .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
        .join("")}</dl>
    </header>`;

    const about = section(
      "om",
      t.about.title,
      t.about.paragraphs.map((p, n) => `<p class="prose${n === 0 ? " prose-lead" : ""} reveal">${esc(p)}</p>`).join("")
    );

    const skills = `<div class="skills reveal">${t.skills.groups
      .map(
        ([label, list]) =>
          `<div><h3 class="small-label">${esc(label)}</h3><ul class="chips">${list
            .map((s) => `<li>${esc(s)}</li>`)
            .join("")}</ul></div>`
      )
      .join("")}</div>`;

    const experience = section("erfaring", t.experience.title, timeline(t.experience.items, t, "erfaring") + skills);
    const education = section("utdanning", t.education.title, timeline(t.education.items, t, "utdanning"));

    const thesis = section(
      "master",
      t.thesis.title,
      `<div class="panel reveal">
        <h3 class="display">${esc(t.thesis.heading)}</h3>
        ${t.thesis.paragraphs.map((p) => `<p class="prose">${esc(p)}</p>`).join("")}
        <dl class="facts">${t.thesis.facts
          .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
          .join("")}</dl>
      </div>`
    );

    const cardIcons = ["giving", "globe", "chart"];
    const interests = section(
      "opptatt",
      t.interests.title,
      `<p class="prose prose-lead reveal">${esc(t.interests.intro)}</p>
       <div class="cards">${t.interests.items
         .map(
           (i, n) =>
             `<article class="reveal">${icon(cardIcons[n % cardIcons.length], "card-icon")}<h3>${esc(i.title)}</h3><p>${esc(
               i.text
             )}</p></article>`
         )
         .join("")}</div>
       <div class="reveal">
         <h3 class="small-label">${esc(t.interests.sourcesLabel)}</h3>
         <ul class="links">${t.interests.sources
           .map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}<span aria-hidden="true"> ↗</span></a></li>`)
           .join("")}</ul>
       </div>`
    );

    const writing = hasPosts
      ? section(
          "skriving",
          t.writing.title,
          `<ul class="posts">${t.writing.posts
            .map(
              (p) => `<li class="reveal"><time>${esc(p.date)}</time><div><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(
                p.title
              )}</a>${p.note ? `<p>${esc(p.note)}</p>` : ""}</div></li>`
            )
            .join("")}</ul>`
        )
      : "";

    const lifeIcons = ["run", "book"];
    const life = section(
      "fritid",
      t.life.title,
      `<div class="two-col">${t.life.blocks
        .map(
          (b, n) => `<div class="reveal">${icon(lifeIcons[n % lifeIcons.length], "card-icon")}<h3>${esc(b.title)}</h3><p>${esc(
            b.text
          )}</p>${b.list ? `<ul class="plain">${b.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>`
        )
        .join("")}</div>`
    );

    const contact = section(
      "kontakt",
      t.contact.title,
      `<div class="contact reveal">
        <p class="contact-heading">${esc(t.ui.contactHeading)}</p>
        <p class="prose">${esc(t.contact.text)}</p>
        ${buttons(t, false)}
      </div>`
    );

    document.getElementById("app").innerHTML =
      hero + about + experience + education + thesis + interests + writing + life + contact;
    document.getElementById("footer-text").innerHTML = `<span>© ${new Date().getFullYear()} ${esc(SITE.name)}</span><span>${esc(
      t.footer
    )}</span><a href="#topp">${esc(t.ui.toTop)} ${icon("arrow", "icon icon-sm")}</a>`;

    document.querySelectorAll("[data-lang]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    document.getElementById("theme-toggle").setAttribute("aria-label", t.ui.theme);
    document.title = SITE.name;

    // «Vis flere» i erfaring og utdanning.
    document.querySelectorAll("[data-more]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const tl = document.getElementById("tl-" + btn.dataset.more);
        const open = tl.dataset.collapsed === "true";
        tl.dataset.collapsed = open ? "false" : "true";
        btn.setAttribute("aria-expanded", String(open));
        btn.textContent = open ? btn.dataset.labelLess : btn.dataset.labelMore;
        tl.querySelectorAll(".is-extra").forEach((el) => el.classList.add("in"));
      })
    );

    // Vis profilbildet hvis filen finnes, ellers beholdes initialene.
    const img = new Image();
    img.alt = SITE.name;
    img.onload = () => {
      const el = document.getElementById("portrait");
      if (el) { el.innerHTML = ""; el.appendChild(img); el.classList.add("has-photo"); }
    };
    img.src = SITE.photo;

    observe();
  }

  let revealObs;
  function observe() {
    if (revealObs) revealObs.disconnect();

    if (canAnimate) {
      revealObs = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
          }),
        { rootMargin: "0px 0px -8% 0px" }
      );
      document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    }

    updateNav();
  }

  // Marker seksjonen som ligger midt i skjermen i menyen.
  function updateNav() {
    const mid = window.innerHeight * 0.4;
    let current = "";
    document.querySelectorAll(".section").forEach((s) => {
      if (s.getBoundingClientRect().top <= mid) current = s.id;
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = "kontakt";
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === current));
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

  window.addEventListener(
    "scroll",
    () => {
      document.body.classList.toggle("scrolled", window.scrollY > 8);
      updateNav();
    },
    { passive: true }
  );

  render();
})();
