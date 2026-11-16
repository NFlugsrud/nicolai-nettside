// Én funksjon per side. Hver returnerer { title, html, mount }.
// html bygges fra data.js, og mount kobler på det som er interaktivt.
(function () {
  const P = (window.PAGES = window.PAGES || {});

  const dateFmt = (d, lang) =>
    new Date(d + "T12:00:00").toLocaleDateString(lang === "no" ? "nb-NO" : "en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });

  const L = (obj, lang) => (obj && typeof obj === "object" && !Array.isArray(obj) ? obj[lang] : obj);

  // ================= Hjem =================
  P.hjem = (t, S) => {
    const { esc, icon } = S;
    const cur = t.experience.items[0];
    const latest = S.posts()[0];
    const c = t.home.cards;

    const miniMap = `<div class="mini-map" aria-hidden="true">${SITE.zones
      .map(
        (z) =>
          `<span class="mz zc-${z.country}${SITE.focusZones.includes(z.id) ? " is-focus" : ""}" style="grid-column:${z.col};grid-row:${z.row}${
            z.rowSpan ? " / span " + z.rowSpan : ""
          }">${esc(z.id)}</span>`
      )
      .join("")}</div>`;

    const spines = `<div class="mini-shelf" aria-hidden="true">${SITE.books
      .map((b) => `<span style="--c:${esc(b.color)}">${esc(b.title)}</span>`)
      .join("")}<span class="ghost"></span><span class="ghost"></span></div>`;

    const tile = (id, href, inner, cls = "") =>
      `<a class="tile reveal ${cls}" href="${href}">
        <div class="tile-top"><h3>${esc(c[id][0])}</h3>${icon("right", "icon tile-arrow")}</div>
        <p>${esc(c[id][1])}</p>
        ${inner}
      </a>`;

    const tiles = [
      tile("master", "/master/", `<div class="tile-foot">${S.countdown(t)}</div>${miniMap}`, "tile-wide tile-master"),
      tile(
        "erfaring",
        "/erfaring/",
        `<div class="tile-meta"><span class="small-label">${esc(t.home.currentRole)}</span><strong>${esc(cur.role)}</strong><span>${esc(cur.org)}</span></div>`
      ),
      tile(
        "na",
        "/na/",
        `<ul class="tile-list">${t.nowPage.items
          .slice(0, 3)
          .map((i) => `<li>${icon(i.icon, "icon icon-sm")}${esc(i.title)}</li>`)
          .join("")}</ul>`
      ),
      tile("bokhylle", "/bokhylle/", spines),
      latest
        ? tile(
            "blogg",
            "/blogg/",
            `<div class="tile-meta"><span class="small-label">${esc(t.home.latestPost)}</span><strong>${esc(latest.title)}</strong><span>${esc(
              dateFmt(latest.date, S.lang)
            )}</span></div>`
          )
        : "",
      tile("om", "/om/", `<div class="tile-icons">${icon("giving", "card-icon")}${icon("globe", "card-icon")}${icon("chart", "card-icon")}</div>`),
    ].join("");

    return {
      title: "",
      html: `
      <header class="hero">
        <div class="hero-text">
          <p class="kicker">${esc(t.hero.kicker)}</p>
          <h1>${esc(SITE.name)}</h1>
          <p class="lead">${esc(t.hero.lead)}</p>
          <div class="buttons">
            <a class="btn btn-primary" href="/kontakt/">${icon("mail")}${esc(t.ui.contactBtn)}</a>
            ${S.cvLink(t)}
            ${S.linkedinLink()}
          </div>
        </div>
        <div class="portrait"><img src="/${esc(SITE.photo)}" alt="${esc(SITE.name)}" width="260" height="260"></div>
        <dl class="hero-facts">${t.hero.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      </header>

      <section class="block block-tight">
        <div class="block-head reveal"><h2>${esc(t.home.exploreTitle)}</h2></div>
        <div class="bento">${tiles}</div>
      </section>

      ${S.section(
        "",
        t.home.aboutTitle,
        `<p class="prose prose-lead reveal">${esc(t.about.paragraphs[0])}</p>
         <p class="prose reveal">${esc(t.about.paragraphs[1])}</p>
         <a class="text-link reveal" href="/om/">${esc(t.home.moreAbout)} ${icon("right", "icon icon-sm")}</a>`
      )}

      ${S.contactBand(t)}`,
    };
  };

  // ================= Om meg =================
  P.om = (t, S) => {
    const { esc, icon } = S;
    const g = SITE.give;
    const cardIcons = ["giving", "globe", "chart"];
    const lifeIcons = ["run", "book"];

    const give = `
      <div class="give reveal" id="give">
        <div class="give-input">
          <label class="field-label" for="give-amount">${esc(t.give.amountLabel)}</label>
          <div class="amount-field">
            <input id="give-amount" type="number" inputmode="numeric" min="0" step="100" value="1000">
            <span>kr</span>
          </div>
          <div class="chip-row">${[500, 1000, 5000, 10000]
            .map((a) => `<button type="button" class="chip-btn" data-amount="${a}">${S.fmt(a)} kr</button>`)
            .join("")}</div>
          <div class="seg" role="group">
            <button type="button" data-freq="once" aria-pressed="true">${esc(t.give.once)}</button>
            <button type="button" data-freq="monthly" aria-pressed="false">${esc(t.give.monthly)}</button>
          </div>
          <p class="give-total" id="give-total"></p>
        </div>
        <div class="give-results">
          ${["nets", "smc", "vas"]
            .map(
              (k, n) => `${n ? `<span class="give-or">${esc(t.give.or)}</span>` : ""}
              <div class="give-card">
                <span class="give-num" id="g-${k}">0</span>
                <span class="give-what">${esc(t.give.results[k][0])}</span>
                <span class="give-org">${esc(t.give.results[k][1])}</span>
              </div>`
            )
            .join("")}
        </div>
        <div class="give-life">
          <div class="give-life-head"><h3>${esc(t.give.lifeTitle)}</h3><span id="life-pct"></span></div>
          <div class="meter"><span id="life-fill"></span></div>
          <p id="life-text"></p>
        </div>
        <div class="give-foot">
          <p class="fine">${esc(t.give.note(S.fmt(g.usdNok, 1)))} ${esc(t.give.sources)}: ${g.sources
            .map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a>`)
            .join(", ")}.</p>
          <a class="btn btn-primary" href="${esc(g.giveUrl)}" target="_blank" rel="noopener">${icon("giving")}${esc(t.give.cta)}</a>
        </div>
      </div>`;

    return {
      title: t.aboutPage.title,
      html: `
      <header class="page-head page-head-split">
        <div>
          <p class="kicker">${esc(t.aboutPage.kicker)}</p>
          <h1>${esc(t.aboutPage.title)}</h1>
          <p class="lead">${esc(t.about.paragraphs[0])}</p>
        </div>
        <div class="portrait portrait-sm"><img src="/${esc(SITE.photo)}" alt="${esc(SITE.name)}" width="200" height="200"></div>
      </header>

      ${S.section("", t.aboutPage.workLabel, t.about.paragraphs.slice(1).map((p) => `<p class="prose reveal">${esc(p)}</p>`).join(""))}

      ${S.block(
        t.interests.title,
        t.interests.intro,
        `<div class="cards">${t.interests.items
          .map((i, n) => `<article class="reveal">${icon(cardIcons[n % 3], "card-icon")}<h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></article>`)
          .join("")}</div>
         <div class="reveal">
           <h3 class="small-label">${esc(t.interests.sourcesLabel)}</h3>
           <ul class="links">${t.interests.sources
             .map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}${icon("external", "icon icon-xs")}</a></li>`)
             .join("")}</ul>
         </div>`
      )}

      ${S.block(t.give.title, t.give.intro, give, "kalkulator")}

      ${S.block(
        t.aboutPage.outsideTitle,
        "",
        `<div class="two-col">${t.life.blocks
          .map(
            (b, n) => `<div class="reveal">${icon(lifeIcons[n % 2], "card-icon")}<h3>${esc(b.title)}</h3><p>${esc(b.text)}</p>${
              b.list ? `<ul class="plain">${b.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""
            }${n === 1 ? `<a class="text-link" href="/bokhylle/">${esc(t.aboutPage.booksLink)} ${icon("right", "icon icon-sm")}</a>` : ""}</div>`
          )
          .join("")}</div>`
      )}

      ${S.contactBand(t)}`,
      mount(app) {
        const input = app.querySelector("#give-amount");
        let freq = "once";
        const update = () => {
          const amount = Math.max(0, Number(input.value) || 0);
          const total = amount * (freq === "monthly" ? 12 : 1);
          const usd = total / g.usdNok;
          app.querySelector("#give-total").textContent = freq === "monthly" ? t.give.total(S.fmt(total)) : "";
          app.querySelector("#g-nets").textContent = S.fmt(Math.floor(usd / g.nets));
          app.querySelector("#g-smc").textContent = S.fmt(Math.floor(usd / g.smc));
          app.querySelector("#g-vas").textContent = S.fmt(Math.floor(usd / g.vas));
          const share = usd / g.lifeUsd;
          const lifeNok = Math.round((g.lifeUsd * g.usdNok) / 1000) * 1000;
          const pctText = share >= 1 ? t.give.lifeCount(S.fmt(share, 1)) : share > 0 && share < 0.01 ? "< 1 %" : `${Math.round(share * 100)} %`;
          app.querySelector("#life-pct").textContent = pctText;
          app.querySelector("#life-fill").style.width = `${Math.min(100, share * 100)}%`;
          app.querySelector("#life-text").textContent =
            t.give.lifeText(S.fmt(lifeNok)) + " " + (share >= 1 ? t.give.lifeMany(S.fmt(share, 1)) : t.give.lifeShare(pctText));
          app.querySelectorAll("[data-amount]").forEach((b) => b.classList.toggle("active", Number(b.dataset.amount) === amount));
        };
        input.addEventListener("input", update);
        app.querySelectorAll("[data-amount]").forEach((b) =>
          b.addEventListener("click", () => { input.value = b.dataset.amount; update(); })
        );
        app.querySelectorAll("[data-freq]").forEach((b) =>
          b.addEventListener("click", () => {
            freq = b.dataset.freq;
            app.querySelectorAll("[data-freq]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
            update();
          })
        );
        update();
      },
    };
  };

  // ================= Erfaring =================
  P.erfaring = (t, S) => {
    const { esc, icon } = S;
    const e = t.expPage;
    const skills = `<div class="skills reveal">${t.skills.groups
      .map(
        ([label, list]) =>
          `<div><h3 class="small-label">${esc(label)}</h3><ul class="chips">${list.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>`
      )
      .join("")}</div>`;

    return {
      title: e.title,
      html: `
      ${S.pageHead(
        e.kicker,
        e.title,
        e.lead,
        `<div class="page-actions">
          <div class="seg" role="group" aria-label="Filter">
            <button type="button" data-filter="all" aria-pressed="true">${esc(e.all)}</button>
            <button type="button" data-filter="work" aria-pressed="false">${esc(e.work)}</button>
            <button type="button" data-filter="edu" aria-pressed="false">${esc(e.edu)}</button>
          </div>
          <div class="buttons buttons-tight">
            ${SITE.cv ? `<a class="btn" href="/${esc(SITE.cv[S.lang])}" download>${icon("download")}${esc(e.pdf)}</a>` : ""}
            <button type="button" class="btn" data-print>${icon("print")}${esc(e.print)}</button>
          </div>
        </div>`
      )}
      <div class="cv" id="cv" data-filter="all">
        <div class="cv-group" data-group="work">${S.section("arbeid", e.work, S.timeline(t.experience.items, t, "arbeid") + skills)}</div>
        <div class="cv-group" data-group="edu">${S.section("utdanning", e.edu, S.timeline(t.education.items, t, "utdanning"))}</div>
      </div>
      ${S.contactBand(t)}`,
      mount(app) {
        const cv = app.querySelector("#cv");
        const set = (f) => {
          cv.dataset.filter = f;
          app.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === f)));
          cv.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
          history.replaceState(null, "", f === "all" ? location.pathname + location.search : `#${f === "work" ? "arbeid" : "utdanning"}`);
        };
        app.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => set(b.dataset.filter)));
        if (location.hash === "#arbeid") set("work");
        if (location.hash === "#utdanning") set("edu");
        app.querySelector("[data-print]").addEventListener("click", () => {
          set("all");
          window.print();
        });
      },
    };
  };

  // ================= Masteroppgave =================
  P.master = (t, S) => {
    const { esc, icon, lang } = S;
    const m = t.thesisPage;

    const zones = SITE.zones
      .map(
        (z) => `<button type="button" class="zone zc-${z.country}${SITE.focusZones.includes(z.id) ? " is-focus" : ""}"
          style="grid-column:${z.col};grid-row:${z.row}${z.rowSpan ? " / span " + z.rowSpan : ""}"
          data-zone="${esc(z.id)}" aria-pressed="false">
          <b>${esc(z.id)}</b><span>${esc(z.city)}</span>
        </button>`
      )
      .join("");

    const slider = (id, label, min, max, value, step = 1) => `
      <div class="slider">
        <label for="${id}"><span>${esc(label)}</span><output id="${id}-out">${value} €</output></label>
        <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}">
      </div>`;

    const bars = m.strategies
      .map(
        (s, n) => `<div class="bar-row${n === 2 ? " is-locked" : ""}">
          <span class="bar-label">${esc(s)}</span>
          <div class="bar-track"><span class="bar-fill" id="bar-${n}"></span></div>
          <span class="bar-value" id="val-${n}"></span>
        </div>`
      )
      .join("");

    return {
      title: lang === "no" ? "Masteroppgave" : "Master's thesis",
      html: `
      ${S.pageHead(
        m.kicker,
        t.thesis.heading,
        t.thesis.paragraphs[0],
        `<div class="page-actions">${S.countdown(t)}</div>`
      )}

      ${S.block(
        m.mapTitle,
        m.mapText,
        `<div class="zone-wrap reveal">
          <div class="zone-map" role="group" aria-label="${esc(m.mapTitle)}">${zones}</div>
          <div class="zone-info" id="zone-info" aria-live="polite"></div>
        </div>
        <p class="legend reveal"><span class="legend-dot"></span>${esc(m.focus)}</p>`,
        "prisomrader"
      )}

      ${S.block(
        m.calcTitle,
        m.calcText,
        `<div class="hedge reveal">
          <div class="hedge-controls">
            <div class="seg" role="group">
              <button type="button" data-role="consumer" aria-pressed="true">${esc(m.role.consumer)}</button>
              <button type="button" data-role="producer" aria-pressed="false">${esc(m.role.producer)}</button>
            </div>
            <fieldset>
              <legend>${esc(m.contracts)}</legend>
              ${slider("h-fut", m.labels.futures, 10, 120, 45)}
              ${slider("h-epad", m.labels.epad, -20, 40, 8)}
            </fieldset>
            <fieldset>
              <legend>${esc(m.market)}</legend>
              ${slider("h-sys", m.labels.sys, 0, 150, 40)}
              ${slider("h-area", m.labels.area, 0, 200, 75)}
            </fieldset>
          </div>
          <div class="hedge-out">
            <div class="hedge-head">
              <span class="small-label" id="h-who"></span>
              <span class="basis">${esc(m.basis)}: <b id="h-basis"></b></span>
            </div>
            <div class="bars">${bars}</div>
            <p class="fine">${esc(m.calcNote)}</p>
            <p class="fine muted">${esc(m.example)}</p>
          </div>
        </div>`,
        "sikring"
      )}

      ${S.block(
        m.corrTitle,
        m.corrText,
        `<div class="corr reveal">
          <div class="corr-plot">
            <svg viewBox="0 0 320 320" role="img" aria-label="${esc(m.corrTitle)}" id="corr-svg"></svg>
          </div>
          <div class="corr-side">
            <div class="slider">
              <label for="corr"><span>${esc(m.corrLabel)} (ρ)</span><output id="corr-out">0,80</output></label>
              <input type="range" id="corr" min="0" max="1" step="0.05" value="0.8">
            </div>
            <div class="big-stat">
              <span class="small-label">${esc(m.corrResult)}</span>
              <strong id="corr-eff">64 %</strong>
              <div class="meter"><span id="corr-fill"></span></div>
            </div>
            <p class="fine muted">${esc(m.simNote)}</p>
          </div>
        </div>`,
        "korrelasjon"
      )}

      ${S.block(
        m.aboutTitle,
        "",
        `<div class="panel reveal">
          ${t.thesis.paragraphs.slice(1).map((p) => `<p class="prose">${esc(p)}</p>`).join("")}
          <dl class="facts">${t.thesis.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        </div>`
      )}

      ${S.contactBand(t)}`,
      mount(app) {
        // --- Kart over prisområder ---
        const info = app.querySelector("#zone-info");
        const flag = { NO: lang === "no" ? "Norge" : "Norway", SE: lang === "no" ? "Sverige" : "Sweden", FI: "Finland", DK: lang === "no" ? "Danmark" : "Denmark" };
        const select = (id) => {
          const z = SITE.zones.find((x) => x.id === id);
          app.querySelectorAll("[data-zone]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.zone === id)));
          info.innerHTML = `
            <p class="zone-code zc-${z.country}">${esc(z.id)}</p>
            <h3>${esc(L(z.name, lang))}</h3>
            <p class="zone-meta">${esc(z.city)} · ${esc(flag[z.country])}</p>
            <p>${esc(L(z.note, lang))}</p>
            ${SITE.focusZones.includes(z.id) ? `<p class="zone-focus"><span class="legend-dot"></span>${esc(m.focus)}</p>` : ""}`;
        };
        app.querySelectorAll("[data-zone]").forEach((b) => b.addEventListener("click", () => select(b.dataset.zone)));
        select("NO2");

        // --- Sikringskalkulator ---
        let role = "consumer";
        const val = (id) => Number(app.querySelector("#" + id).value);
        const eur = (v) => `${v < 0 ? "−" : ""}${Math.abs(Math.round(v))} €`;
        const calc = () => {
          const F = val("h-fut"), E = val("h-epad"), sys = val("h-sys"), area = val("h-area");
          ["h-fut", "h-epad", "h-sys", "h-area"].forEach((id) => (app.querySelector(`#${id}-out`).textContent = eur(val(id))));
          const basis = area - sys;
          const values = [area, F + basis, F + E];
          const max = Math.max(1, ...values.map(Math.abs));
          values.forEach((v, n) => {
            app.querySelector("#bar-" + n).style.width = `${Math.max(0, (v / max) * 100)}%`;
            app.querySelector("#val-" + n).textContent = eur(v) + " /MWh";
          });
          app.querySelector("#h-basis").textContent = `${basis > 0 ? "+" : ""}${eur(basis)} /MWh`;
          app.querySelector("#h-who").textContent = role === "consumer" ? m.pays : m.gets;
        };
        app.querySelectorAll(".hedge input").forEach((i) => i.addEventListener("input", calc));
        app.querySelectorAll("[data-role]").forEach((b) =>
          b.addEventListener("click", () => {
            role = b.dataset.role;
            app.querySelectorAll("[data-role]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
            calc();
          })
        );
        calc();

        // --- Korrelasjon (simulerte, faste data) ---
        let seed = 20261201;
        const rand = () => {
          seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
          let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
          r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
          return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
        const normal = () => Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
        const pts = Array.from({ length: 120 }, () => [normal(), normal()]);
        const svg = app.querySelector("#corr-svg");
        const sc = (v) => 160 + Math.max(-3, Math.min(3, v)) * 46;
        const draw = (rho) => {
          const k = Math.sqrt(1 - rho * rho);
          const dots = pts
            .map(([x, z]) => `<circle cx="${sc(x).toFixed(1)}" cy="${(320 - sc(rho * x + k * z)).toFixed(1)}" r="3.6"/>`)
            .join("");
          svg.innerHTML = `
            <g class="axes"><line x1="20" y1="160" x2="300" y2="160"/><line x1="160" y1="20" x2="160" y2="300"/></g>
            <g class="dots">${dots}</g>
            <line class="fit" x1="${sc(-3)}" y1="${320 - sc(-3 * rho)}" x2="${sc(3)}" y2="${320 - sc(3 * rho)}"/>
            <text class="ax" x="304" y="314" text-anchor="end">${esc(m.corrAxisX)} →</text>
            <text class="ax" x="166" y="14">↑ ${esc(m.corrAxisY)}</text>`;
          const eff = Math.round(rho * rho * 100);
          app.querySelector("#corr-out").textContent = S.fmt(rho, 2);
          app.querySelector("#corr-eff").textContent = `${eff} %`;
          app.querySelector("#corr-fill").style.width = `${eff}%`;
        };
        const corr = app.querySelector("#corr");
        corr.addEventListener("input", () => draw(Number(corr.value)));
        draw(Number(corr.value));
      },
    };
  };

  // ================= Nå =================
  P.na = (t, S) => {
    const { esc, icon } = S;
    const n = t.nowPage;
    return {
      title: n.kicker,
      html: `
      ${S.pageHead(
        n.kicker,
        n.title,
        n.lead,
        `<div class="page-actions"><span class="pill">${icon("calendar", "icon icon-sm")}${esc(n.updated)}: ${esc(n.updatedDate)}</span>${S.countdown(t)}</div>`
      )}
      <ol class="now-list">${n.items
        .map(
          (i) => `<li class="reveal">
            <span class="now-icon">${icon(i.icon)}</span>
            <div><h2>${esc(i.title)}</h2><p>${esc(i.text)}</p></div>
          </li>`
        )
        .join("")}</ol>
      <p class="now-about reveal">${esc(n.about)} <a href="https://nownownow.com/about" target="_blank" rel="noopener">${esc(n.aboutLink)}${icon(
        "external",
        "icon icon-xs"
      )}</a></p>
      ${S.contactBand(t)}`,
    };
  };

  // ================= Bokhylle =================
  P.bokhylle = (t, S) => {
    const { esc, icon, lang } = S;
    const b = t.booksPage;
    const tags = [...new Set(SITE.books.map((x) => x.tag))];
    const showFilter = SITE.books.length >= 5 && tags.length > 1;
    return {
      title: b.kicker,
      html: `
      ${S.pageHead(
        b.kicker,
        b.title,
        b.lead,
        showFilter
          ? `<div class="page-actions"><div class="seg" role="group">
              <button type="button" data-tag="all" aria-pressed="true">${esc(b.all)}</button>
              ${tags.map((tag) => `<button type="button" data-tag="${esc(tag)}" aria-pressed="false">${esc(L(SITE.bookTags[tag], lang))}</button>`).join("")}
            </div></div>`
          : ""
      )}
      <ul class="books">${SITE.books
        .map((book) => {
          const note = L(book.note, lang);
          const q = encodeURIComponent(`${book.title} ${book.author}`);
          return `<li class="book reveal" data-tag="${esc(book.tag)}">
            <div class="cover" style="--c:${esc(book.color)}">
              <span class="cover-title">${esc(book.title)}</span>
              <span class="cover-author">${esc(book.author)}</span>
            </div>
            <div class="book-meta">
              <h2>${esc(book.title)}</h2>
              <p class="book-author">${esc(book.author)}</p>
              <p class="book-tag">${esc(L(SITE.bookTags[book.tag], lang))}</p>
              ${note ? `<p class="book-note">${esc(note)}</p>` : ""}
              <a class="text-link" href="https://openlibrary.org/search?q=${q}" target="_blank" rel="noopener">${esc(b.find)}${icon("external", "icon icon-xs")}</a>
            </div>
          </li>`;
        })
        .join("")}</ul>
      ${S.block(
        b.authorsTitle,
        "",
        `<ul class="chips chips-lg reveal">${SITE.authors.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`
      )}
      ${S.contactBand(t)}`,
      mount(app) {
        app.querySelectorAll("[data-tag]").forEach((btn) => {
          if (btn.tagName !== "BUTTON") return;
          btn.addEventListener("click", () => {
            const tag = btn.dataset.tag;
            app.querySelectorAll("button[data-tag]").forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
            app.querySelectorAll(".book").forEach((el) => (el.hidden = tag !== "all" && el.dataset.tag !== tag));
          });
        });
      },
    };
  };

  // ================= Blogg =================
  const safeUrl = (u) => /^(https?:\/\/|\/|\.\/|#|mailto:)/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u);
  function md(src, esc) {
    const inline = (s) =>
      esc(s)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => (safeUrl(url) ? `<img src="${url}" alt="${alt}" loading="lazy">` : ""))
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, url) =>
          safeUrl(url) ? `<a href="${url}"${/^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : ""}>${txt}</a>` : txt
        )
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>");
    const lines = src.replace(/\r\n?/g, "\n").split("\n");
    let html = "";
    let para = [];
    let i = 0;
    const flush = () => {
      if (para.length) html += `<p>${inline(para.join(" "))}</p>`;
      para = [];
    };
    const collect = (re) => {
      const buf = [];
      while (i < lines.length && re.test(lines[i])) buf.push(lines[i++].replace(re, ""));
      return buf;
    };
    while (i < lines.length) {
      const line = lines[i];
      let mm;
      if (/^```/.test(line)) {
        flush();
        const buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++;
        html += `<pre><code>${esc(buf.join("\n"))}</code></pre>`;
      } else if (!line.trim()) {
        flush();
        i++;
      } else if ((mm = line.match(/^(#{1,4})\s+(.*)$/))) {
        flush();
        const lvl = Math.max(2, Math.min(4, mm[1].length));
        html += `<h${lvl}>${inline(mm[2])}</h${lvl}>`;
        i++;
      } else if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
        flush();
        html += "<hr>";
        i++;
      } else if (/^>\s?/.test(line)) {
        flush();
        html += `<blockquote>${md(collect(/^>\s?/).join("\n"), esc)}</blockquote>`;
      } else if (/^\s*[-*]\s+/.test(line)) {
        flush();
        html += `<ul>${collect(/^\s*[-*]\s+/).map((x) => `<li>${inline(x)}</li>`).join("")}</ul>`;
      } else if (/^\s*\d+[.)]\s+/.test(line)) {
        flush();
        html += `<ol>${collect(/^\s*\d+[.)]\s+/).map((x) => `<li>${inline(x)}</li>`).join("")}</ol>`;
      } else {
        para.push(line.trim());
        i++;
      }
    }
    flush();
    return html;
  }

  P.blogg = (t, S) => {
    const { esc, icon, lang } = S;
    const b = t.blogPage;
    const slug = S.params.get("innlegg");
    const all = S.posts();
    const tagList = (p) => (p.tags || []).map((x) => `<span class="tag">${esc(x)}</span>`).join("");
    const draft = (p) => (p.draft ? `<span class="tag tag-draft">${esc(b.draft)}</span>` : "");

    if (slug) {
      const post = all.find((p) => p.slug === slug);
      if (!post) {
        return {
          title: b.title,
          html: `${S.pageHead(b.kicker, b.notFound, "")}<p><a class="text-link" href="/blogg/">${icon("left", "icon icon-sm")} ${esc(b.back)}</a></p>`,
        };
      }
      return {
        title: post.title,
        html: `
        <article class="post">
          <header class="post-head">
            <a class="text-link back" href="/blogg/">${icon("left", "icon icon-sm")} ${esc(b.back)}</a>
            <p class="post-meta"><time datetime="${esc(post.date)}">${esc(dateFmt(post.date, lang))}</time><span id="read-time"></span>${draft(post)}${tagList(post)}</p>
            <h1>${esc(post.title)}</h1>
            ${post.summary ? `<p class="lead">${esc(post.summary)}</p>` : ""}
          </header>
          <div class="prose-article" id="post-body"><p class="muted">${esc(b.loading)}</p></div>
          <footer class="post-foot">
            <a class="btn" href="/blogg/">${icon("left")}${esc(b.back)}</a>
            <button type="button" class="btn" data-copy-link>${icon("copy")}${esc(b.copy)}</button>
          </footer>
        </article>`,
        mount(app) {
          fetch(`/blogg/innlegg/${encodeURIComponent(post.slug)}.md`)
            .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
            .then((text) => {
              app.querySelector("#post-body").innerHTML = md(text, esc);
              const words = text.split(/\s+/).filter(Boolean).length;
              app.querySelector("#read-time").textContent = ` · ${b.readTime(Math.max(1, Math.round(words / 200)))}`;
            })
            .catch(() => (app.querySelector("#post-body").innerHTML = `<p>${esc(b.notFound)}</p>`));
          app.querySelector("[data-copy-link]").addEventListener("click", () => S.copy(location.href, b.copied));
        },
      };
    }

    return {
      title: b.title,
      html: `
      ${S.pageHead(b.kicker, b.title, b.lead)}
      ${
        all.length
          ? `<ul class="post-list">${all
              .map(
                (p) => `<li class="reveal">
                  <a href="/blogg/?innlegg=${encodeURIComponent(p.slug)}">
                    <p class="post-meta"><time datetime="${esc(p.date)}">${esc(dateFmt(p.date, lang))}</time>${draft(p)}${tagList(p)}</p>
                    <h2>${esc(p.title)}</h2>
                    ${p.summary ? `<p>${esc(p.summary)}</p>` : ""}
                    <span class="text-link">${esc(t.ui.readMore)} ${icon("right", "icon icon-sm")}</span>
                  </a>
                </li>`
              )
              .join("")}</ul>`
          : `<p class="empty reveal">${icon("pen", "card-icon")}${esc(b.empty)}</p>`
      }
      ${S.contactBand(t)}`,
    };
  };

  // ================= Kontakt =================
  P.kontakt = (t, S) => {
    const { esc, icon } = S;
    const c = t.contactPage;
    return {
      title: c.kicker,
      html: `
      ${S.pageHead(c.kicker, c.title, c.lead)}
      <div class="contact-grid">
        <form class="contact-form reveal" id="contact-form" novalidate>
          <fieldset>
            <legend class="field-label">${esc(c.topicLabel)}</legend>
            <div class="topic-row">${c.topics
              .map(
                (x, n) => `<label class="topic"><input type="radio" name="topic" value="${esc(x)}"${n === 0 ? " checked" : ""}><span>${esc(x)}</span></label>`
              )
              .join("")}</div>
          </fieldset>
          <label class="field">
            <span class="field-label">${esc(c.name)}</span>
            <input type="text" name="name" autocomplete="name">
          </label>
          <label class="field">
            <span class="field-label">${esc(c.message)}</span>
            <textarea name="message" rows="7" required></textarea>
          </label>
          <button type="submit" class="btn btn-primary">${icon("mail")}${esc(c.send)}</button>
          <p class="fine muted">${esc(c.sendNote)}</p>
        </form>
        <aside class="contact-aside reveal">
          <p class="small-label">${esc(c.direct)}</p>
          <a class="contact-email" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
          <div class="buttons buttons-col">
            <button type="button" class="btn" data-copy-email>${icon("copy")}${esc(c.copy)}</button>
            ${S.linkedinLink()}
            ${S.cvLink(t)}
          </div>
        </aside>
      </div>`,
      mount(app) {
        app.querySelector("[data-copy-email]").addEventListener("click", () => S.copy(SITE.email, c.copied));
        const form = app.querySelector("#contact-form");
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const data = new FormData(form);
          const msg = String(data.get("message") || "").trim();
          const ta = form.querySelector("textarea");
          if (!msg) {
            ta.focus();
            ta.classList.add("invalid");
            return;
          }
          ta.classList.remove("invalid");
          const name = String(data.get("name") || "").trim();
          const subject = `${data.get("topic")}${name ? ` – ${name}` : ""} (${c.via})`;
          const body = `${c.greeting}\n\n${msg}\n\n${name}`;
          location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
      },
    };
  };

  // ================= 404 =================
  P["404"] = (t, S) => {
    const { esc, icon } = S;
    const n = t.notFound;
    return {
      title: n.title,
      html: `${S.pageHead("404", n.title, n.text, `<div class="buttons"><a class="btn btn-primary" href="/">${icon("home")}${esc(n.home)}</a></div>`)}`,
    };
  };
})();
