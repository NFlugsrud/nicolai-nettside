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
        `<div class="page-actions"><a class="text-link back-link" href="/oppgaver/">${icon("left", "icon icon-sm")} ${esc(t.thesesPage.back)}</a>${S.countdown(t)}</div>`
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

  // ================= Oppgaver (oversikt) =================
  P.oppgaver = (t, S) => {
    const { esc, icon } = S;
    const o = t.thesesPage;
    const visuals = {
      master: `<div class="mini-map" aria-hidden="true">${SITE.zones
        .map(
          (z) =>
            `<span class="mz zc-${z.country}${SITE.focusZones.includes(z.id) ? " is-focus" : ""}" style="grid-column:${z.col};grid-row:${z.row}${
              z.rowSpan ? " / span " + z.rowSpan : ""
            }">${esc(z.id)}</span>`
        )
        .join("")}</div>`,
      okonomi: `<div class="mini-bars" aria-hidden="true">${SITE.econ.profile.weekday
        .map((v) => {
          const med = median(SITE.econ.profile.weekday);
          return `<span class="${v > med ? "hi" : "lo"}" style="height:${Math.round(((v - 40) / 32) * 100)}%"></span>`;
        })
        .join("")}</div>`,
      global: `<div class="mini-irr" aria-hidden="true">${SITE.gdev.irr
        .map((r) => `<span class="lvl-${r.level}">${esc(r[S.lang][0])}</span>`)
        .join("")}</div>`,
    };
    return {
      title: o.kicker,
      html: `
      ${S.pageHead(o.kicker, o.title, o.lead)}
      <div class="thesis-list">${o.items
        .map(
          (it) => `<a class="thesis-card reveal" href="${it.href}">
            <div class="thesis-text">
              <p class="small-label">${esc(it.label)}</p>
              <h2>${esc(it.title)}</h2>
              <p>${esc(it.text)}</p>
              <span class="text-link">${esc(o.read)} ${icon("right", "icon icon-sm")}</span>
            </div>
            <div class="thesis-visual">${visuals[it.id] || ""}</div>
          </a>`
        )
        .join("")}</div>
      ${S.contactBand(t)}`,
    };
  };

  function median(arr) {
    const s = arr.slice().sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  // ================= Bacheloroppgave i økonomi =================
  P.okonomi = (t, S) => {
    const { esc, icon, lang } = S;
    const e = t.econPage;
    const D = SITE.econ;
    const years = Object.keys(D.treff);
    const pct = (v, d = 1) => `${S.fmt(v, d)} %`;

    const hours = Array.from({ length: 24 }, (_, h) => h);
    const hourLabel = (h) => String(h).padStart(2, "0");

    const heat = `
      <div class="heat-wrap reveal">
        <div class="seg" role="group" aria-label="${esc(e.heatTitle)}">
          ${Object.entries(e.metrics)
            .map(([k, label], n) => `<button type="button" data-metric="${k}" aria-pressed="${n === 0}">${esc(label)}</button>`)
            .join("")}
        </div>
        <div class="heat-scroll">
          <table class="heat" id="heat">
            <thead><tr><th></th>${e.months.map((m) => `<th scope="col">${esc(m)}</th>`).join("")}<th scope="col" class="heat-avg">${esc(e.avg)}</th></tr></thead>
            <tbody>${years
              .map(
                (y) => `<tr><th scope="row">${y}</th>${e.months
                  .map((_, m) => `<td><button type="button" class="cell" data-y="${y}" data-m="${m}"></button></td>`)
                  .join("")}<td class="heat-avg" data-yavg="${y}"></td></tr>`
              )
              .join("")}</tbody>
            <tfoot><tr><th scope="row">${esc(e.avg)}</th>${e.months.map((_, m) => `<td class="heat-avg" data-mavg="${m}"></td>`).join("")}<td class="heat-avg" id="heat-total"></td></tr></tfoot>
          </table>
        </div>
        <p class="heat-detail" id="heat-detail" aria-live="polite"></p>
        <p class="fine muted">${esc(e.heatNote)}</p>
      </div>`;

    const maxHol = Math.max(...D.holidays.map((h) => Math.abs(h.eur)));
    const holidays = `<ul class="hbars reveal">${D.holidays
      .map(
        (h) => `<li>
          <span class="hb-label">${esc(h[lang])}</span>
          <span class="hb-track"><span class="hb-fill" style="width:${((Math.abs(h.eur) / maxHol) * 100).toFixed(1)}%"></span></span>
          <span class="hb-value">−${S.fmt(Math.abs(h.eur), 2)} €<small> (${h.pct} %)</small></span>
        </li>`
      )
      .join("")}</ul>
      <p class="fine muted reveal">${esc(e.holidayUnit)}</p>`;

    const maxBlock = Math.max(...D.blocks);
    const blocks = `<div class="vbars reveal" aria-label="${esc(e.blocksTitle)}">${D.blocks
      .map(
        (b, m) => `<div class="vbar"><span class="vbar-val">${b} %</span><span class="vbar-fill" style="height:${(b / maxBlock) * 100}%"></span><span class="vbar-label">${esc(
          e.months[m]
        )}</span></div>`
      )
      .join("")}</div>`;

    return {
      title: lang === "no" ? "Bacheloroppgave i økonomi" : "Bachelor's thesis in business",
      html: `
      ${S.pageHead(
        e.kicker,
        e.title,
        e.lead,
        `<div class="page-actions"><a class="text-link back-link" href="/oppgaver/">${icon("left", "icon icon-sm")} ${esc(t.thesesPage.back)}</a></div>
         <dl class="facts facts-head">${e.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`
      )}

      ${S.block(
        e.questionsTitle,
        "",
        `<ol class="questions">${e.questions.map((q, n) => `<li class="reveal"><span>${n + 1}</span><p>${esc(q)}</p></li>`).join("")}</ol>
         <p class="fine muted reveal">${esc(e.fullTitle)}</p>`
      )}

      ${S.block(
        e.keyTitle,
        "",
        `<div class="stat-grid">${e.key.map(([n, txt]) => `<div class="stat reveal"><strong>${esc(n)}</strong><span>${esc(txt)}</span></div>`).join("")}</div>`
      )}

      ${S.block(
        e.ruleTitle,
        e.ruleText,
        `<div class="rule reveal">
          <div class="rule-left">
            <div class="slider">
              <label for="mw"><span>${esc(e.mwLabel)}</span><output id="mw-out">6 MW</output></label>
              <input type="range" id="mw" min="1" max="30" step="1" value="6">
            </div>
            <div class="rule-cards">
              <div class="rule-card is-high"><span class="small-label">${esc(e.high)}</span><strong id="mw-high">8 MW</strong></div>
              <div class="rule-card is-low"><span class="small-label">${esc(e.low)}</span><strong id="mw-low">4 MW</strong></div>
            </div>
          </div>
          <div class="rule-right">
            <p class="small-label">${esc(e.blocksTitle)}</p>
            ${blocks}
            <p class="fine muted">${esc(e.blocksNote)}</p>
          </div>
        </div>`,
        "regel"
      )}

      ${S.block(
        e.profileTitle,
        e.profileText,
        `<div class="profile reveal">
          <div class="seg" role="group">
            ${Object.entries(e.dayTypes)
              .map(([k, label], n) => `<button type="button" data-day="${k}" aria-pressed="${n === 0}">${esc(label)}</button>`)
              .join("")}
          </div>
          <div class="pchart" id="pchart">
            <div class="pbars" id="pbars">${hours.map((h) => `<span class="pbar" data-h="${h}"><i></i></span>`).join("")}</div>
            <div class="pmedian" id="pmedian"><span>${esc(e.median)}</span></div>
          </div>
          <div class="paxis">${hours.map((h) => `<span>${h % 3 === 0 ? hourLabel(h) : ""}</span>`).join("")}</div>
          <p class="legend"><span class="key key-hi"></span>${esc(e.high)}<span class="key key-lo"></span>${esc(e.low)}</p>
          <p class="fine muted">${esc(e.profileNote)}</p>
        </div>`,
        "strategi"
      )}

      ${S.block(
        e.gameTitle,
        e.gameText,
        `<div class="game reveal" id="game">
          <div class="game-top">
            <span class="pill" id="g-count"></span>
            <span class="pill" id="g-score"></span>
          </div>
          <div class="gchart">
            <div class="gbars" id="gbars">${hours
              .map((h) => `<button type="button" class="gbar" data-h="${h}" aria-pressed="false" aria-label="${hourLabel(h)}:00"><i class="g-base"></i><b class="g-yday"></b><b class="g-today"></b></button>`)
              .join("")}</div>
          </div>
          <div class="paxis">${hours.map((h) => `<span>${h % 3 === 0 ? hourLabel(h) : ""}</span>`).join("")}</div>
          <p class="legend"><span class="key key-base"></span>${lang === "no" ? "Historisk snitt" : "Historical average"}<span class="key key-yday"></span>${
            lang === "no" ? "I går" : "Yesterday"
          }<span class="key key-today"></span>${lang === "no" ? "Faktisk pris i dag" : "Actual price today"}</p>
          <div class="game-actions">
            <button type="button" class="btn btn-primary" id="g-check" disabled>${esc(e.check)}</button>
            <button type="button" class="btn" id="g-reset">${esc(e.reset)}</button>
            <button type="button" class="btn" id="g-new">${esc(e.newDay)}</button>
          </div>
          <div class="game-result" id="g-result" aria-live="polite"></div>
          <p class="fine muted">${esc(e.gameNote)}</p>
        </div>`,
        "spill"
      )}

      ${S.block(e.heatTitle, e.heatText, heat, "resultater")}

      ${S.block(
        e.oosTitle,
        e.oosText,
        `<div class="oos">${D.oos
          .map(
            (o) => `<div class="oos-card reveal">
              <p class="small-label">${esc(e.months[o.m])} 2025</p>
              <dl>
                <div><dt>${esc(e.metrics.treff)}</dt><dd>${pct(o.treff)}</dd></div>
                <div><dt>${esc(e.metrics.merverdi)}</dt><dd>${pct(o.merverdi)}</dd></div>
                <div><dt>${esc(e.eurLabel)}</dt><dd>${S.fmt(o.eur, 2)} €/MWh</dd></div>
                <div><dt>${esc(e.sd)}</dt><dd>${S.fmt(o.sd, 2)}</dd></div>
              </dl>
            </div>`
          )
          .join("")}</div>`
      )}

      ${S.block(e.holidayTitle, e.holidayText, holidays)}

      ${S.block(
        e.conclusionTitle,
        "",
        `<div class="panel reveal">${e.conclusion.map((p) => `<p class="prose">${esc(p)}</p>`).join("")}</div>
         <a class="text-link reveal" href="/oppgaver/">${icon("left", "icon icon-sm")} ${esc(t.thesesPage.back)}</a>`
      )}

      ${S.contactBand(t)}`,

      mount(app) {
        // --- 4/3 og 2/3 ---
        const mw = app.querySelector("#mw");
        const mwUpdate = () => {
          const v = Number(mw.value);
          app.querySelector("#mw-out").textContent = `${v} MW`;
          app.querySelector("#mw-high").textContent = `${S.fmt((v * 4) / 3, 1)} MW`;
          app.querySelector("#mw-low").textContent = `${S.fmt((v * 2) / 3, 1)} MW`;
        };
        mw.addEventListener("input", mwUpdate);
        mwUpdate();

        // --- Døgnprofil ---
        const LO = 40, HI = 72;
        const y = (v) => Math.max(0, Math.min(100, ((v - LO) / (HI - LO)) * 100));
        const drawProfile = (day) => {
          const data = D.profile[day];
          const med = median(data);
          app.querySelectorAll("#pbars .pbar").forEach((el, h) => {
            el.classList.toggle("hi", data[h] > med);
            el.querySelector("i").style.height = `${y(data[h])}%`;
            el.title = `${hourLabel(h)}:00 · ${S.fmt(data[h], 1)} €/MWh`;
          });
          app.querySelector("#pmedian").style.bottom = `${y(med)}%`;
          app.querySelector("#pmedian span").textContent = `${e.median} ${S.fmt(med, 1)} €`;
        };
        app.querySelectorAll("[data-day]").forEach((b) =>
          b.addEventListener("click", () => {
            app.querySelectorAll("[data-day]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
            drawProfile(b.dataset.day);
          })
        );
        drawProfile("weekday");

        // --- Spill: slå strategien ---
        let seed = 7;
        const rand = () => {
          seed = (seed * 1664525 + 1013904223) % 4294967296;
          return seed / 4294967296;
        };
        const normal = () => Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
        const base = D.profile.weekday;
        const baseMed = median(base);
        const stratPick = base.map((v) => v > baseMed);
        let day, picks, checked, wins = 0, losses = 0;

        const newDay = () => {
          const lvlY = 0.75 + rand() * 0.6;
          const lvlT = lvlY * (0.9 + rand() * 0.2);
          // Felles svingning (c) gjør at i går sier noe om i dag, men ikke alt.
          let c = 0, iy = 0, it = 0;
          const yday = [], today = [];
          base.forEach((b) => {
            c = 0.7 * c + normal() * 5;
            iy = 0.6 * iy + normal() * 4.5;
            it = 0.6 * it + normal() * 4.5;
            yday.push(Math.max(5, b * lvlY + c + iy));
            today.push(Math.max(5, b * lvlT + c + it));
          });
          day = { yday, today };
          picks = new Array(24).fill(false);
          checked = false;
          drawGame();
        };

        const value = (choice, prices) => prices.reduce((s, p, h) => s + p * (choice[h] ? 4 / 3 : 2 / 3), 0) / 24;
        const evaluate = (choice) => {
          const p = day.today;
          const med = median(p);
          const perfect = p.map((v) => v > med);
          const flat = p.reduce((s, v) => s + v, 0) / 24;
          const best = value(perfect, p) - flat;
          return {
            treff: (choice.filter((c, h) => c === perfect[h]).length / 24) * 100,
            merverdi: best > 0 ? ((value(choice, p) - flat) / best) * 100 : 0,
            perfect,
          };
        };

        const drawGame = () => {
          const all = base.concat(day.yday, checked ? day.today : []);
          const lo = Math.min(...all) - 6, hi = Math.max(...all) + 4;
          const gy = (v) => ((v - lo) / (hi - lo)) * 100;
          const res = checked ? evaluate(picks) : null;
          app.querySelectorAll("#gbars .gbar").forEach((el, h) => {
            el.setAttribute("aria-pressed", String(picks[h]));
            el.querySelector(".g-base").style.height = `${gy(base[h])}%`;
            el.querySelector(".g-yday").style.bottom = `${gy(day.yday[h])}%`;
            const td = el.querySelector(".g-today");
            td.style.display = checked ? "block" : "none";
            if (checked) td.style.bottom = `${gy(day.today[h])}%`;
            el.classList.toggle("is-right", !!res && picks[h] === res.perfect[h]);
            el.classList.toggle("is-wrong", !!res && picks[h] !== res.perfect[h]);
            el.disabled = checked;
          });
          const n = picks.filter(Boolean).length;
          app.querySelector("#g-count").textContent = e.picked(n);
          app.querySelector("#g-score").textContent = e.score(wins, losses);
          app.querySelector("#g-check").disabled = n !== 12 || checked;
          if (!checked) app.querySelector("#g-result").innerHTML = "";
        };

        app.querySelectorAll("#gbars .gbar").forEach((el) =>
          el.addEventListener("click", () => {
            const h = Number(el.dataset.h);
            if (checked) return;
            if (!picks[h] && picks.filter(Boolean).length >= 12) return;
            picks[h] = !picks[h];
            drawGame();
          })
        );
        app.querySelector("#g-reset").addEventListener("click", () => {
          if (checked) return;
          picks = new Array(24).fill(false);
          drawGame();
        });
        app.querySelector("#g-new").addEventListener("click", newDay);
        app.querySelector("#g-check").addEventListener("click", () => {
          checked = true;
          const me = evaluate(picks), st = evaluate(stratPick);
          const diff = me.merverdi - st.merverdi;
          const verdict = Math.abs(diff) < 0.5 ? e.tie : diff > 0 ? e.win : e.lose;
          if (Math.abs(diff) >= 0.5) diff > 0 ? wins++ : losses++;
          drawGame();
          app.querySelector("#g-result").innerHTML = `
            <p class="verdict">${esc(verdict)}</p>
            <table class="score-table">
              <thead><tr><th></th><th>${esc(e.hit)}</th><th>${esc(e.value)}</th></tr></thead>
              <tbody>
                <tr><th>${esc(e.you)}</th><td>${pct(me.treff, 0)}</td><td>${pct(me.merverdi, 0)}</td></tr>
                <tr><th>${esc(e.strategy)}</th><td>${pct(st.treff, 0)}</td><td>${pct(st.merverdi, 0)}</td></tr>
              </tbody>
            </table>`;
        });
        newDay();

        // --- Varmekart ---
        const ranges = { treff: [40, 85], merverdi: [0, 85], eur: [0, 17.5] };
        const fmtM = (k, v) => (k === "eur" ? `${S.fmt(v, 2)} €` : `${S.fmt(v, 1)} %`);
        const shade = (k, v) => {
          if (v < 0 || (k === "treff" && v < 50)) return "neg";
          const [a, b] = ranges[k];
          let x = Math.max(0, Math.min(1, (v - a) / (b - a)));
          if (k === "eur") x = Math.sqrt(x);
          return Math.round(8 + x * 82);
        };
        const avgOf = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
        let metric = "treff";
        const detail = app.querySelector("#heat-detail");
        const showDetail = (yy, m) =>
          (detail.innerHTML = `<strong>${esc(e.months[m])} ${yy}</strong> · ${esc(e.metrics.treff)} ${pct(D.treff[yy][m])} · ${esc(
            e.metrics.merverdi
          )} ${pct(D.merverdi[yy][m])} · ${S.fmt(D.eur[yy][m], 2)} €/MWh`);
        const drawHeat = () => {
          const data = D[metric];
          app.querySelectorAll("#heat .cell").forEach((c) => {
            const v = data[c.dataset.y][c.dataset.m];
            const s = shade(metric, v);
            c.textContent = metric === "eur" ? S.fmt(v, 1) : S.fmt(v, 0);
            c.classList.toggle("is-neg", s === "neg");
            c.classList.toggle("is-dark", s !== "neg" && s > 55);
            c.style.setProperty("--x", s === "neg" ? "0%" : `${s}%`);
            c.setAttribute("aria-label", `${e.months[c.dataset.m]} ${c.dataset.y}: ${fmtM(metric, v)}`);
          });
          years.forEach((yy) => (app.querySelector(`[data-yavg="${yy}"]`).textContent = fmtM(metric, avgOf(data[yy]))));
          e.months.forEach((_, m) => (app.querySelector(`[data-mavg="${m}"]`).textContent = fmtM(metric, avgOf(years.map((yy) => data[yy][m])))));
          app.querySelector("#heat-total").textContent = fmtM(metric, avgOf(years.flatMap((yy) => data[yy])));
        };
        app.querySelectorAll("[data-metric]").forEach((b) =>
          b.addEventListener("click", () => {
            metric = b.dataset.metric;
            app.querySelectorAll("[data-metric]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
            drawHeat();
          })
        );
        app.querySelectorAll("#heat .cell").forEach((c) => {
          const show = () => showDetail(c.dataset.y, Number(c.dataset.m));
          c.addEventListener("mouseenter", show);
          c.addEventListener("focus", show);
          c.addEventListener("click", show);
        });
        drawHeat();
        showDetail("2022", 11);
      },
    };
  };

  // ================= Bacheloroppgave i global utvikling =================
  P.globalutvikling = (t, S) => {
    const { esc, icon, lang } = S;
    const g = t.gdevPage;
    const D = SITE.gdev;
    const mp = g.map;

    const map = `
      <figure class="hmap reveal">
        <div class="seg" role="group" aria-label="${esc(g.mapTitle)}">
          <button type="button" data-state="before" aria-pressed="true">${esc(g.before)}</button>
          <button type="button" data-state="after" aria-pressed="false">${esc(g.after)}</button>
        </div>
        <div class="hmap-scroll">
        <svg viewBox="0 40 1056 640" id="hmap" data-state="before" role="img" aria-label="${esc(g.mapTitle)}">
          <rect class="land" x="0" y="0" width="1056" height="698"/>
          <g class="pans" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map((n) => `<rect x="${648 + (n % 3) * 46}" y="${262 + Math.floor(n / 3) * 62}" width="40" height="54" rx="6"/>`).join("")}</g>
          <path class="sea" d="M0 662 L90 642 L200 626 L300 607 L352 596 L440 586 L520 566 L600 554 L676 548 L700 522 L760 468 L830 392 L900 344 L1000 312 L1056 300 L1056 698 L0 698 Z"/>
          <path class="lagoon" d="M372 392 C420 378 500 386 560 398 C600 408 612 440 590 462 C560 486 500 480 455 474 C420 468 380 448 368 428 C362 412 362 398 372 392 Z"/>
          <text class="lbl lbl-sea" x="830" y="626" text-anchor="middle">${esc(mp.sea)}</text>

          <g class="m-after">
            <path class="sea" d="M290 404 L436 404 L446 470 L446 590 L432 592 L360 604 L352 596 L352 500 L290 500 Z"/>
            <path class="terminal" d="M196 378 L290 378 L290 524 L196 524 Z"/>
            <g class="quays">${[424, 452, 480].map((y) => `<rect x="288" y="${y}" width="58" height="12" rx="3"/>`).join("")}</g>
            <path class="pier" d="M446 590 L476 584"/>
            <text class="lbl lbl-strong" x="400" y="586" text-anchor="middle">${esc(mp.harbour)}</text>
          </g>

          <path class="town" d="M448 522 C500 512 560 506 620 502 C650 500 676 504 692 520 L676 548 L600 554 L520 566 L448 584 Z"/>
          <ellipse class="siri" cx="650" cy="138" rx="104" ry="46"/>
          <text class="lbl lbl-strong" x="650" y="144" text-anchor="middle">${esc(mp.siri)}</text>

          <g class="m-before">
            <path class="road" d="M70 590 C150 572 250 552 340 540 C400 532 450 526 500 527 C540 528 580 510 620 470 C660 420 690 330 715 255 C760 230 820 226 850 222 C920 180 980 130 1056 92"/>
            <g class="houses">${[[262, 516], [296, 500], [330, 528], [362, 508], [396, 540], [424, 500], [300, 552], [240, 548]].map(([x, y]) => `<rect x="${x}" y="${y}" width="15" height="15" rx="3"/>`).join("")}</g>
            <g class="shops">${[476, 500, 524, 548].map((x, n) => `<rect x="${x}" y="${n % 2 ? 504 : 498}" width="16" height="16" rx="3"/>`).join("")}</g>
            <text class="lbl" x="196" y="536" text-anchor="middle">${esc(mp.oldRoad)}</text>
          </g>

          <g class="m-after">
            <path class="road" d="M70 590 C150 572 250 552 336 541"/>
            <path class="road" d="M450 526 C470 526 485 527 500 527 C540 528 580 510 620 470 C660 420 690 330 715 255 C760 230 820 226 850 222 C920 180 980 130 1056 92"/>
            <path class="road road-new" d="M60 604 C70 520 90 400 120 300 C150 240 230 222 330 214 C450 206 560 204 660 212 C740 218 800 224 850 222"/>
            <g class="cut"><path d="M380 520 l28 26 M408 520 l-28 26"/></g>
            <text class="lbl lbl-alert" x="394" y="646" text-anchor="middle">${esc(mp.cut)}</text>
            <text class="lbl lbl-strong lbl-new" x="400" y="192" text-anchor="middle">${esc(mp.newRoad)}</text>
            <g class="shops shops-faded">${[476, 500, 524, 548].map((x, n) => `<rect x="${x}" y="${n % 2 ? 504 : 498}" width="16" height="16" rx="3"/>`).join("")}</g>
            <text class="lbl lbl-alert" x="586" y="600" text-anchor="middle">${esc(mp.shops)}</text>
            <path class="move" d="M372 488 C400 360 500 230 584 172"/>
            <path class="move-head" d="M584 172 l-18 4 l9 14 z"/>
            <text class="lbl" x="472" y="312" text-anchor="middle">${esc(mp.moved)}</text>
          </g>

          <text class="lbl lbl-water" x="524" y="440" text-anchor="middle">Karagan Lewaya</text>
          <text class="lbl lbl-strong" x="560" y="540" text-anchor="middle">${esc(mp.town)}</text>
          <text class="lbl" x="16" y="636">${esc(mp.west)}</text>
          <text class="lbl" x="1040" y="78" text-anchor="end">${esc(mp.east)}</text>
          <g class="compass" transform="translate(52 96)"><path d="M0 -26 L9 6 L0 0 L-9 6 Z"/><text x="0" y="30" text-anchor="middle">N</text></g>
        </svg>
        </div>
        <figcaption class="fine muted">${esc(g.mapNote)}<span class="mobile-only"> ${lang === "no" ? "Sveip sideveis for å se hele illustrasjonen." : "Swipe sideways to see the whole illustration."}</span></figcaption>
      </figure>
      <div class="two-cards">
        <div class="mini-card reveal"><p class="small-label">${esc(g.directTitle)}</p><p>${esc(g.direct)}</p></div>
        <div class="mini-card reveal is-alert"><p class="small-label">${esc(g.indirectTitle)}</p><p>${esc(g.indirect)}</p></div>
      </div>`;

    const irr = `
      <div class="irr reveal">
        <div class="irr-grid" role="group" aria-label="${esc(g.irrTitle)}">${D.irr
          .map(
            (r, n) => `<button type="button" class="irr-btn lvl-${r.level}" data-irr="${n}" aria-pressed="false">
              <span class="irr-no">${n + 1}</span>
              <span class="irr-name">${esc(r[lang][0])}</span>
              <span class="irr-level">${esc(g.levels[r.level])}</span>
            </button>`
          )
          .join("")}</div>
        <div class="irr-detail" id="irr-detail" aria-live="polite"></div>
      </div>
      <p class="fine muted reveal">${esc(g.quoteNote)}</p>`;

    const timeline = `
      <div class="tl reveal">
        <div class="tl-track" role="group" aria-label="${esc(g.timelineTitle)}">${D.timeline
          .map((ev, n) => `<button type="button" class="tl-dot" data-ev="${n}" aria-pressed="false"><span>${esc(ev.year)}</span></button>`)
          .join("")}</div>
        <div class="tl-card" id="tl-card" aria-live="polite"></div>
        <div class="tl-nav">
          <button type="button" class="icon-btn" data-step="-1" aria-label="${lang === "no" ? "Forrige" : "Previous"}">${icon("left")}</button>
          <button type="button" class="icon-btn" data-step="1" aria-label="${lang === "no" ? "Neste" : "Next"}">${icon("right")}</button>
        </div>
      </div>`;

    const china = `
      <div class="views reveal">
        <div class="views-bar" aria-hidden="true"><span>${esc(g.views[0][0])}</span><span>${esc(g.views[2][0])}</span></div>
        <div class="views-grid">${g.views
          .map((v) => `<div class="view-card"><h3>${esc(v[0])}</h3><p>${esc(v[1])}</p><p class="view-src">${esc(v[2])}</p></div>`)
          .join("")}</div>
      </div>
      <div class="panel reveal"><p class="small-label">${esc(g.local)}</p><p class="prose">${esc(g.localText)}</p></div>`;

    return {
      title: lang === "no" ? "Bacheloroppgave i global utvikling" : "Bachelor's thesis in global development",
      html: `
      ${S.pageHead(
        g.kicker,
        g.title,
        g.lead,
        `<div class="page-actions"><a class="text-link back-link" href="/oppgaver/">${icon("left", "icon icon-sm")} ${esc(t.thesesPage.back)}</a></div>
         <dl class="facts facts-head">${g.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`
      )}

      ${S.block(
        g.questionTitle,
        "",
        `<blockquote class="big-question reveal">${esc(g.question)}</blockquote>
         <p class="fine muted reveal">${esc(g.questionNote)}</p>
         <div class="stat-grid stat-grid-tight">${g.numbers.map(([n, txt]) => `<div class="stat reveal"><strong>${esc(n)}</strong><span>${esc(txt)}</span></div>`).join("")}</div>
         <p class="fine muted reveal">${esc(g.fullTitle)}</p>`
      )}

      ${S.block(g.mapTitle, g.mapText, map, "veien")}
      ${S.block(g.irrTitle, g.irrText, irr, "irr")}

      ${S.block(
        g.voiceTitle,
        g.voiceText,
        `<figure class="pull reveal"><blockquote>${esc(g.voiceQuote)}</blockquote><figcaption>${esc(g.interview(12))}</figcaption></figure>`
      )}

      ${S.block(g.timelineTitle, g.timelineText, timeline, "tidslinje")}
      ${S.block(g.chinaTitle, g.chinaText, china)}

      ${S.block(
        g.lessonsTitle,
        g.lessonsText,
        `<ol class="lessons">${g.lessons.map((l, n) => `<li class="reveal"><span>${n + 1}</span><p>${esc(l)}</p></li>`).join("")}</ol>`
      )}

      ${S.block(
        g.reflectTitle,
        "",
        `<div class="panel reveal"><p class="prose">${esc(g.reflect)}</p></div>
         <a class="text-link reveal" href="/oppgaver/">${icon("left", "icon icon-sm")} ${esc(t.thesesPage.back)}</a>`
      )}

      ${S.contactBand(t)}`,

      mount(app) {
        // Før/etter. På smale skjermer starter illustrasjonen midt på, ved havna og gamlebyen.
        const svg = app.querySelector("#hmap");
        const scroller = app.querySelector(".hmap-scroll");
        if (scroller.scrollWidth > scroller.clientWidth) scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) * 0.5;
        app.querySelectorAll("[data-state]").forEach((b) => {
          if (b.tagName !== "BUTTON") return;
          b.addEventListener("click", () => {
            svg.dataset.state = b.dataset.state;
            app.querySelectorAll("button[data-state]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          });
        });

        // IRR-modellen
        const detail = app.querySelector("#irr-detail");
        const showIrr = (n) => {
          const r = D.irr[n];
          const [name, def, finding] = r[lang];
          app.querySelectorAll("[data-irr]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.irr) === n)));
          detail.innerHTML = `
            <p class="irr-tag lvl-${r.level}">${esc(g.levels[r.level])}</p>
            <h3>${n + 1}. ${esc(name)}</h3>
            <p class="irr-def">${esc(def)}</p>
            <p class="small-label">${esc(g.finding)}</p>
            <p>${esc(finding)}</p>
            <figure class="irr-quote"><blockquote>“${esc(r.quote)}”</blockquote><figcaption>${esc(g.interview(r.source))}</figcaption></figure>`;
        };
        app.querySelectorAll("[data-irr]").forEach((b) => b.addEventListener("click", () => showIrr(Number(b.dataset.irr))));
        showIrr(1);

        // Tidslinje
        let cur = 0;
        const card = app.querySelector("#tl-card");
        const showEv = (n) => {
          cur = Math.max(0, Math.min(D.timeline.length - 1, n));
          const ev = D.timeline[cur];
          app.querySelectorAll("[data-ev]").forEach((b, i) => {
            b.setAttribute("aria-pressed", String(i === cur));
            b.classList.toggle("is-past", i < cur);
          });
          card.innerHTML = `<p class="tl-year">${esc(ev.year)}</p><h3>${esc(ev[lang][0])}</h3><p>${esc(ev[lang][1])}</p>`;
          app.querySelector('[data-step="-1"]').disabled = cur === 0;
          app.querySelector('[data-step="1"]').disabled = cur === D.timeline.length - 1;
        };
        app.querySelectorAll("[data-ev]").forEach((b) => b.addEventListener("click", () => showEv(Number(b.dataset.ev))));
        app.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => showEv(cur + Number(b.dataset.step))));
        showEv(0);
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
