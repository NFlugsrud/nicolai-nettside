// Felles ramme for alle sider: meny, språk, tema, bunntekst og gjenbrukbare deler.
// Innhold redigeres i data.js. Hver side har sin egen funksjon i pages.js.
(function () {
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  let lang = params.get("lang") === "en" || (params.get("lang") !== "no" && store.get("lang") === "en") ? "en" : "no";
  if (params.has("lang")) store.set("lang", lang);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canAnimate = !reduceMotion && "IntersectionObserver" in window;
  if (canAnimate) root.classList.add("anim");

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

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
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    print: '<path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M7 14h10v6H7z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    work: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12.5h18"/>',
    school: '<path d="M2.5 9L12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11M21.5 9v5"/>',
    home: '<path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20c1.2-3.6 4.1-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  };
  const icon = (name, cls = "icon") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ""}</svg>`;

  const fmt = (n, digits = 0) =>
    new Intl.NumberFormat(lang === "no" ? "nb-NO" : "en-GB", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);

  // Blogginnlegg. Utkast vises bare lokalt.
  const posts = () =>
    (SITE.posts || []).filter((p) => !p.draft || isLocal).slice().sort((a, b) => b.date.localeCompare(a.date));

  const NAV = [
    ["om", "/om/"],
    ["erfaring", "/erfaring/"],
    ["oppgaver", "/oppgaver/"],
    ["na", "/na/"],
    ["bokhylle", "/bokhylle/"],
    ["blogg", "/blogg/"],
    ["kontakt", "/kontakt/"],
  ];
  const navItems = () => NAV.filter(([id]) => id !== "blogg" || posts().length > 0);

  function daysUntil(dateStr) {
    const due = new Date(dateStr + "T00:00:00");
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((due - today) / 86400000);
  }

  function countdown(t) {
    if (!SITE.thesisDue) return "";
    const d = daysUntil(SITE.thesisDue);
    const label = d > 0 ? t.countdown.days(d) : d === 0 ? t.countdown.today : t.countdown.done;
    return `<span class="countdown${d < 0 ? " is-done" : ""}">${icon(d < 0 ? "check" : "calendar", "icon icon-sm")}${esc(label)}</span>`;
  }

  // ---------- Gjenbrukbare deler ----------

  function badge(org) {
    const fixed = SITE.badges && SITE.badges[org];
    const text = fixed || org.split(/\s+/).filter((w) => /^[A-ZÆØÅ]/.test(w)).map((w) => w[0]).join("").slice(0, 3);
    return `<span class="badge" aria-hidden="true">${esc(text)}</span>`;
  }

  const isCurrent = (period) => /(nå|present)$/i.test(period.trim());

  function group(items) {
    const groups = [];
    items.forEach((i) => {
      const last = groups[groups.length - 1];
      if (last && last[0].org === i.org) last.push(i);
      else groups.push([i]);
    });
    return groups;
  }

  function entry(g, t, extra) {
    const nowTag = (p) => (isCurrent(p) ? ` <span class="now">${esc(t.ui.now)}</span>` : "");
    const points = (i) => i.points.map((p) => `<p class="entry-text">${esc(p)}</p>`).join("");
    const cls = `entry reveal${extra ? " is-extra" : ""}`;
    if (g.length === 1) {
      const i = g[0];
      return `<li class="${cls}">
        ${badge(i.org)}
        <div class="entry-main">
          <p class="entry-period">${esc(i.period)}${nowTag(i.period)}</p>
          <h3 class="entry-role">${esc(i.role)}</h3>
          <p class="entry-org">${esc(i.org)} <span class="sep">·</span> ${esc(i.place)}</p>
          ${points(i)}
          ${i.link ? `<a class="text-link entry-link" href="${esc(i.link)}">${esc(t.thesesPage.linkLabel)} ${icon("right", "icon icon-sm")}</a>` : ""}
        </div>
      </li>`;
    }
    const start = g[g.length - 1].period.split(" – ")[0];
    const end = g[0].period.split(" – ").pop();
    return `<li class="${cls}">
      ${badge(g[0].org)}
      <div class="entry-main">
        <p class="entry-period">${esc(start)} – ${esc(end)}${nowTag(end)}</p>
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

  // limit: hvor mange grupper som vises før «Vis flere». 0 = alle.
  function timeline(items, t, id, limit = 0) {
    const groups = group(items);
    const max = limit || groups.length;
    const hidden = Math.max(0, groups.length - max);
    const list = groups.map((g, n) => entry(g, t, n >= max)).join("");
    const more = hidden
      ? `<button type="button" class="more" data-more="${id}" aria-expanded="false" data-label-more="${esc(
          t.ui.showMore(hidden)
        )}" data-label-less="${esc(t.ui.showLess)}">${esc(t.ui.showMore(hidden))}</button>`
      : "";
    return `<ol class="timeline" id="tl-${id}" data-collapsed="${hidden ? "true" : "false"}">${list}</ol>${more}`;
  }

  function cvLink(t, cls = "btn") {
    const cv = SITE.cv && SITE.cv[lang];
    return cv ? `<a class="${cls}" href="/${esc(cv)}" download>${icon("download")}${esc(t.ui.cvBtn)}</a>` : "";
  }
  function linkedinLink(cls = "btn") {
    return SITE.linkedin
      ? `<a class="${cls}" href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">${icon("linkedin")}LinkedIn</a>`
      : "";
  }

  function pageHead(kicker, title, lead, extra = "") {
    return `<header class="page-head">
      <p class="kicker">${esc(kicker)}</p>
      <h1>${esc(title)}</h1>
      ${lead ? `<p class="lead">${esc(lead)}</p>` : ""}
      ${extra}
    </header>`;
  }

  function section(id, label, body, no) {
    return `<section ${id ? `id="${id}" ` : ""}class="section">
      <h2 class="section-label reveal">${no ? `<span class="section-no">${esc(no)}</span>` : ""}${esc(label)}</h2>
      <div class="section-body">${body}</div>
    </section>`;
  }

  function block(title, intro, body, id = "") {
    return `<section ${id ? `id="${id}" ` : ""}class="block">
      <div class="block-head reveal">
        <h2>${esc(title)}</h2>
        ${intro ? `<p>${esc(intro)}</p>` : ""}
      </div>
      ${body}
    </section>`;
  }

  function contactBand(t) {
    return `<section class="contact-band reveal">
      <div>
        <p class="contact-heading">${esc(t.ui.contactHeading)}</p>
        <p>${esc(t.contact.text)}</p>
      </div>
      <div class="buttons">
        <a class="btn btn-light" href="/kontakt/">${icon("mail")}${esc(t.ui.contactBtn)}</a>
        ${cvLink(t, "btn btn-ghost")}
        ${linkedinLink("btn btn-ghost")}
      </div>
    </section>`;
  }

  let toastTimer;
  function toast(message) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.innerHTML = `${icon("check", "icon icon-sm")}${esc(message)}`;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  async function copy(text, message) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (err) {}
      ta.remove();
    }
    toast(message);
  }

  // ---------- Topp og bunn ----------

  // Undersider som hører til et menypunkt.
  const NAV_PARENT = { master: "oppgaver", okonomi: "oppgaver", globalutvikling: "oppgaver" };

  function header(t, page) {
    const active = NAV_PARENT[page] || page;
    const links = navItems()
      .map(
        ([id, href]) =>
          `<a href="${href}"${id === active ? ' class="active" aria-current="page"' : ""}>${esc(t.nav[id])}</a>`
      )
      .join("");
    return `<a class="skip" href="#app">${esc(t.ui.skip)}</a>
    <nav class="topbar" aria-label="${lang === "no" ? "Hovedmeny" : "Main menu"}">
      <a class="brand" href="/">
        <img class="brand-photo" src="/${esc(SITE.photo)}" alt="" width="28" height="28">
        <span>${esc(SITE.name)}</span>
      </a>
      <div class="nav-links" id="nav-links">${links}</div>
      <div class="controls">
        <div class="lang" role="group" aria-label="${esc(t.ui.lang)}">
          <button type="button" data-lang="no" aria-pressed="${lang === "no"}">NO</button>
          <button type="button" data-lang="en" aria-pressed="${lang === "en"}">EN</button>
        </div>
        <button type="button" id="theme-toggle" class="icon-btn" aria-label="${esc(t.ui.theme)}">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/></svg>
        </button>
        <button type="button" id="menu-toggle" class="icon-btn menu-btn" aria-expanded="false" aria-controls="nav-links" aria-label="${esc(t.ui.menu)}">
          ${icon("menu")}
        </button>
      </div>
    </nav>`;
  }

  function footer(t) {
    const links = [["hjem", "/"], ...navItems()]
      .map(([id, href]) => `<li><a href="${href}">${esc(t.nav[id])}</a></li>`)
      .join("");
    return `<footer class="footer">
      <div class="footer-grid">
        <div>
          <p class="footer-name">${esc(SITE.name)}</p>
          <p class="footer-tag">${esc(t.ui.footerTagline)}</p>
        </div>
        <div>
          <p class="small-label">${esc(t.ui.footerPages)}</p>
          <ul class="footer-links">${links}</ul>
        </div>
        <div>
          <p class="small-label">${esc(t.ui.footerContact)}</p>
          <ul class="footer-links">
            <li><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>
            ${SITE.linkedin ? `<li><a href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>` : ""}
            ${SITE.cv ? `<li><a href="/${esc(SITE.cv[lang])}" download>${esc(t.ui.cvBtn)}</a></li>` : ""}
          </ul>
        </div>
      </div>
      <p class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${esc(SITE.name)}</span>
        <span>${esc(t.footer)}</span>
        <a href="#top" data-top>${esc(t.ui.toTop)} ${icon("arrow", "icon icon-sm")}</a>
      </p>
    </footer>`;
  }

  // ---------- Oppførsel ----------

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    const btn = document.getElementById("menu-toggle");
    if (!btn) return;
    const t = SITE[lang];
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? t.ui.close : t.ui.menu);
    btn.innerHTML = icon(open ? "close" : "menu");
  }

  function bindChrome() {
    document.querySelectorAll("[data-lang]").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.dataset.lang === lang) return;
        lang = b.dataset.lang;
        store.set("lang", lang);
        render();
      })
    );
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const dark =
        root.dataset.theme === "dark" ||
        (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.dataset.theme = dark ? "light" : "dark";
      store.set("theme", root.dataset.theme);
    });
    document.getElementById("menu-toggle").addEventListener("click", () =>
      setMenu(!document.body.classList.contains("menu-open"))
    );
    document.querySelectorAll("#nav-links a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.querySelectorAll("[data-top]").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      })
    );
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
  }

  let revealObs;
  function reveal() {
    if (revealObs) revealObs.disconnect();
    const els = document.querySelectorAll(".reveal");
    if (!canAnimate) return els.forEach((el) => el.classList.add("in"));
    revealObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
        }),
      { rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => revealObs.observe(el));
  }

  function render() {
    const t = SITE[lang];
    const page = document.body.dataset.page || "404";
    root.lang = lang === "no" ? "nb" : "en";
    setMenu(false);

    const def = window.PAGES[page] || window.PAGES["404"];
    const out = def(t, Site) || {};

    document.getElementById("site-header").innerHTML = header(t, page);
    const app = document.getElementById("app");
    app.innerHTML = out.html || "";
    document.getElementById("site-footer").innerHTML = footer(t);
    document.title = out.title ? `${out.title} · ${SITE.name}` : SITE.name;

    bindChrome();
    if (out.mount) out.mount(app, t);
    reveal();
  }

  const Site = {
    esc, icon, fmt, isLocal, posts, daysUntil, countdown, badge, timeline, cvLink, linkedinLink,
    pageHead, section, block, contactBand, toast, copy, render,
    get lang() { return lang; },
    params,
  };
  window.Site = Site;
  window.PAGES = window.PAGES || {};

  window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener(
    "scroll",
    () => document.body.classList.toggle("scrolled", window.scrollY > 8),
    { passive: true }
  );
  document.addEventListener("DOMContentLoaded", render);
})();
