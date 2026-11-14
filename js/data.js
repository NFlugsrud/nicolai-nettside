// ============================================================
//  ALT INNHOLD PÅ NETTSIDEN REDIGERES HER
//  Hver tekst finnes i to versjoner: no (norsk) og en (engelsk).
//  Lagre filen og last siden på nytt for å se endringene.
// ============================================================

const SITE = {
  name: "Nicolai F. Dahl",
  initials: "ND",
  email: "nicolaidahl00@gmail.com",
  linkedin: "", // Lim inn hele LinkedIn-lenken her. Tom = vises ikke.
  photo: "bilder/profil.jpg", // Legg bildet i mappen bilder/ med dette navnet.

  no: {
    nav: {
      om: "Om meg",
      erfaring: "Erfaring",
      utdanning: "Utdanning",
      master: "Masteroppgave",
      opptatt: "Opptatt av",
      skriving: "Skriving",
      fritid: "Fritid",
      kontakt: "Kontakt",
    },
    hero: {
      kicker: "Oslo, Norge",
      lead: "Jeg jobber med økonomi og drift i Stiftelsen Gi Effektivt, og fullfører en master i analytisk finans ved Handelshøyskolen ved Universitetet i Agder.",
    },
    about: {
      title: "Om meg",
      paragraphs: [
        "Jeg har bakgrunn i både økonomi og global utvikling, og er opptatt av hvordan penger til gode formål kan gjøre mest mulig nytte.",
        "I Gi Effektivt jobber jeg med løpende regnskap, lønn og rapportering, og med tildelingene av innsamlede midler til de anbefalte organisasjonene. Før det var jeg regnskapsrådgiver i Aider.",
        "Jeg er fra Drøbak og bor i Oslo.",
      ],
    },
    experience: {
      title: "Erfaring",
      items: [
        {
          period: "Juni 2026 – nå",
          org: "Stiftelsen Gi Effektivt",
          place: "Oslo",
          role: "Økonomi- og driftsmedarbeider",
          points: [
            "Løpende regnskap, lønnskjøring og rapportering.",
            "Gjennomføring av tildelinger av innsamlede midler til anbefalte organisasjoner.",
          ],
        },
        {
          period: "August 2024 – nå",
          org: "Drøbak Montessori Stiftelse",
          place: "Drøbak",
          role: "Regnskapsmedarbeider (deltid)",
          points: ["Administrative og regnskapsrelaterte oppgaver etter behov."],
        },
        {
          period: "August 2025 – juli 2026",
          org: "Aider AS",
          place: "Kristiansand",
          role: "Regnskapsrådgiver",
          points: [
            "Løpende regnskapsføring, inngående og utgående fakturabehandling, bankavstemming og avstemming av MVA, reskontro og balanseposter, samt klargjøring, kontroll og innsending av MVA-meldinger.",
            "Månedlig rapportering, økonomisk analyse og kundeoppfølging, i tillegg til automatisering av bilagsflyt, Excel-maler og analyse av CO₂-utslipp.",
          ],
        },
        {
          period: "Mars 2025 – august 2025",
          org: "Aider AS",
          place: "Kristiansand",
          role: "Trainee (deltid)",
          points: [],
        },
        {
          period: "Juni 2025 – august 2025",
          org: "Economic Development Partnership (EDP)",
          place: "Cape Town",
          role: "Intern",
          points: [
            "Jobbet i Energy & Climate Programme med lokal rettferdig omstilling i Sør-Afrika. Bidro med research, datainnsamling og skriftlig analyse av hvordan kommuner kan gjøre klima- og energiambisjoner om til praktiske, lokalt forankrede tiltak.",
          ],
        },
        {
          period: "August 2023 – desember 2024",
          org: "Handelshøyskolen ved Universitetet i Agder",
          place: "Kristiansand",
          role: "Vitenskapelig assistent",
          points: [
            "Samfunnsøkonomi (august 2023 – desember 2024): hjalp studenter med økonomisk teori, modellbasert resonnering og praktisk anvendelse.",
            "Mikroøkonomi (juli – desember 2024): forklarte sentrale begreper gjennom eksempler og oppgaveløsning.",
            "Business Analytics (juli – desember 2024): støttet studenter i å bruke analytiske metoder, tolke data og løse oppgaver med kvantitative verktøy.",
          ],
        },
        {
          period: "Februar – juni 2020 og februar – juni 2021",
          org: "Drøbak Montessori Skole",
          place: "Drøbak",
          role: "Assistent",
          points: [
            "Assistent på skolen jeg selv gikk på som barn. Generelle oppgaver og undervisning i Montessori-materiell.",
          ],
        },
      ],
    },
    education: {
      title: "Utdanning",
      items: [
        {
          period: "August 2025 – desember 2026",
          org: "Handelshøyskolen ved Universitetet i Agder",
          place: "Kristiansand",
          role: "Siviløkonom, master i analytisk finans",
          points: [
            "Masteroppgave om korrelasjonsanalyse i kraftmarkedet i samarbeid med Å Energi, med vekt på sikringsstrategier med systemfutures og EPAD-kontrakter.",
          ],
        },
        {
          period: "Juni 2025 – august 2025",
          org: "Graduate School of Business, University of Cape Town",
          place: "Cape Town",
          role: "Social Entrepreneurship",
          points: [
            "Sommerinternship i Economic Development Partnership i Cape Town, med veiledning fra Graduate School of Business.",
          ],
        },
        {
          period: "Januar 2025 – august 2025",
          org: "Universitetet i Oslo",
          place: "Oslo",
          role: "Sosialt entreprenørskap",
          points: [
            "Halvårsstudium ved Gründerskolen med vekt på sosialt entreprenørskap, med internship i ideell sektor i Sør-Afrika.",
          ],
        },
        {
          period: "August 2022 – mai 2025",
          org: "Universitetet i Agder",
          place: "Kristiansand",
          role: "Bachelor i økonomi og administrasjon",
          points: [
            "Bacheloroppgave om optimering av brukstid for konsesjonskraft, i samarbeid med Å Entelios og Konsesjonskraft IKS.",
          ],
        },
        {
          period: "Januar 2024 – april 2024",
          org: "University of Ruhuna",
          place: "Sri Lanka",
          role: "Feltarbeid",
          points: ["Feltopphold på Sri Lanka som del av bachelorgraden i global utvikling."],
        },
        {
          period: "2023",
          org: "Harvard Business School Online",
          place: "Nettbasert",
          role: "Sertifikat i Sustainable Business Strategy",
          points: [],
        },
        {
          period: "August 2021 – mai 2024",
          org: "Universitetet i Agder",
          place: "Kristiansand",
          role: "Bachelor i global utvikling",
          points: [
            "Bacheloroppgave om sosioøkonomiske implikasjoner av kinesisk finansiering av havneanlegg i det globale sør. Kvalitativ feltstudie i Hambantota, Sri Lanka.",
          ],
        },
      ],
    },
    thesis: {
      title: "Masteroppgave",
      heading: "Korrelasjoner mellom nordiske prisområder og prisingen av EPAD-kontrakter",
      paragraphs: [
        "Strømprisen i Norden varierer mellom prisområdene. En kraftprodusent eller storforbruker som vil sikre prisen sin, må derfor håndtere både den felles systemprisen og avviket i sitt eget område. EPAD-kontrakter er verktøyet for det siste.",
        "Oppgaven undersøker hvordan prisområdene beveger seg sammen over tid, og hva det betyr for sikringsstrategier med systemfutures og EPAD-kontrakter. Den skrives i samarbeid med Å Energi og leveres i desember 2026.",
      ],
      facts: [
        ["Grad", "Siviløkonom, master i analytisk finans"],
        ["Sted", "Handelshøyskolen ved UiA"],
        ["Samarbeid", "Å Energi"],
        ["Innlevering", "Desember 2026"],
      ],
    },
    interests: {
      title: "Hva jeg er opptatt av",
      intro:
        "Jeg er opptatt av effektiv giving og global utvikling: hvor en ekstra krone gjør mest nytte, og hvordan vi kan vite det.",
      items: [
        {
          title: "Effektiv giving",
          text: "Noen tiltak hjelper langt flere per krone enn andre. Jeg vil forstå metodene bak slike vurderinger, og jobber til daglig i en organisasjon som bygger på dem.",
        },
        {
          title: "Global utvikling",
          text: "Bistand, afrikansk økonomi og den langsiktige fremgangen i verden. Interessen startet med bachelorgraden i global utvikling og feltarbeid på Sri Lanka.",
        },
        {
          title: "Analyse og automatisering",
          text: "Jeg liker å gjøre tall forståelige og å fjerne manuelt arbeid, enten det gjelder regnskap, rapportering eller kraftmarkedsdata.",
        },
      ],
      sourcesLabel: "Kilder jeg følger",
      sources: [
        ["GiveWell", "https://www.givewell.org"],
        ["Our World in Data", "https://ourworldindata.org"],
        ["EA Forum", "https://forum.effectivealtruism.org"],
        ["Global Development & EA (David Nash)", "https://gdea.substack.com"],
      ],
    },
    writing: {
      title: "Skriving",
      // Legg til tekster slik: { date: "2027-01-15", title: "Tittel", url: "https://...", note: "Kort omtale" }
      // Seksjonen vises først når listen har innhold.
      posts: [],
    },
    life: {
      title: "Løping og lesing",
      blocks: [
        {
          title: "Løping",
          text: "Jeg løper rundt 50 kilometer i uken, og sykler når anledningen byr seg. Løpingen gir struktur i uken og tid til å tenke.",
        },
        {
          title: "Lesing",
          text: "Jeg leser mest sakprosa og noveller. Noen favoritter:",
          list: [
            "Small Things Like These, Claire Keegan",
            "Moral Ambition, Rutger Bregman",
            "Adam Grant",
            "Ryan Holiday",
            "Malcolm Gladwell",
          ],
        },
      ],
    },
    skills: {
      title: "Verktøy",
      groups: [
        ["Analyse og kontor", ["Python", "R", "SQL", "Microsoft Office", "Google Workspace", "CRM-systemer"]],
        ["Regnskapssystemer", ["Tripletex", "Fiken", "Xledger", "Finago"]],
      ],
    },
    contact: {
      title: "Kontakt",
      text: "Ta gjerne kontakt på e-post.",
      emailLabel: "E-post",
      linkedinLabel: "LinkedIn",
    },
    footer: "Sist oppdatert november 2026",
    ui: { theme: "Bytt mellom lyst og mørkt", lang: "Språk" },
  },

  en: {
    nav: {
      om: "About",
      erfaring: "Experience",
      utdanning: "Education",
      master: "Thesis",
      opptatt: "Interests",
      skriving: "Writing",
      fritid: "Off work",
      kontakt: "Contact",
    },
    hero: {
      kicker: "Oslo, Norway",
      lead: "I work in finance and operations at Gi Effektivt, Norway's effective giving foundation, and I am completing an MSc in analytical finance at the University of Agder.",
    },
    about: {
      title: "About",
      paragraphs: [
        "My background is in both business and global development, and I care about how money given to good causes can do the most good.",
        "At Gi Effektivt I work on bookkeeping, payroll and reporting, and on disbursing donated funds to the recommended organisations. Before that I was an accounting advisor at Aider.",
        "I grew up in Drøbak and live in Oslo.",
      ],
    },
    experience: {
      title: "Experience",
      items: [
        {
          period: "June 2026 – present",
          org: "Stiftelsen Gi Effektivt",
          place: "Oslo",
          role: "Finance and Operations Officer",
          points: [
            "Bookkeeping, payroll and reporting.",
            "Disbursing donated funds to recommended organisations.",
          ],
        },
        {
          period: "August 2024 – present",
          org: "Drøbak Montessori Foundation",
          place: "Drøbak",
          role: "Accounting Assistant (part-time)",
          points: ["Administrative and accounting tasks as needed."],
        },
        {
          period: "August 2025 – July 2026",
          org: "Aider AS",
          place: "Kristiansand",
          role: "Accounting Advisor",
          points: [
            "Bookkeeping, incoming and outgoing invoices, bank reconciliation and reconciliation of VAT, ledgers and balance sheet items, plus preparing, checking and filing VAT returns.",
            "Monthly reporting, financial analysis and client follow-up, along with automation of voucher flows, Excel templates and CO₂ emissions analysis.",
          ],
        },
        {
          period: "March 2025 – August 2025",
          org: "Aider AS",
          place: "Kristiansand",
          role: "Trainee (part-time)",
          points: [],
        },
        {
          period: "June 2025 – August 2025",
          org: "Economic Development Partnership (EDP)",
          place: "Cape Town",
          role: "Intern",
          points: [
            "Worked with the Energy & Climate Programme on the Local Just Transition in South Africa. Contributed to research, data capturing and written analysis on how municipalities can turn climate and energy transition ambitions into practical, locally grounded action.",
          ],
        },
        {
          period: "August 2023 – December 2024",
          org: "School of Business and Law, University of Agder",
          place: "Kristiansand",
          role: "Teaching Assistant",
          points: [
            "Economics (August 2023 – December 2024): assisted students with economic theory, model-based reasoning and practical applications.",
            "Microeconomics (July – December 2024): explained key concepts through examples and problem-solving support.",
            "Business Analytics (July – December 2024): supported students in applying analytical methods, interpreting data and using quantitative tools.",
          ],
        },
        {
          period: "February – June 2020 and February – June 2021",
          org: "Drøbak Montessori School",
          place: "Drøbak",
          role: "Assistant",
          points: [
            "Assistant at the school I attended as a child. General duties and teaching with Montessori materials.",
          ],
        },
      ],
    },
    education: {
      title: "Education",
      items: [
        {
          period: "August 2025 – December 2026",
          org: "School of Business and Law, University of Agder",
          place: "Kristiansand",
          role: "MSc in Business Administration (Siviløkonom), Analytical Finance",
          points: [
            "Master's thesis on correlation analysis in the power market in collaboration with Å Energi, focusing on hedging strategies with system futures and EPAD contracts.",
          ],
        },
        {
          period: "June 2025 – August 2025",
          org: "Graduate School of Business, University of Cape Town",
          place: "Cape Town",
          role: "Social Entrepreneurship",
          points: [
            "Summer internship at the Economic Development Partnership in Cape Town, supervised by the Graduate School of Business.",
          ],
        },
        {
          period: "January 2025 – August 2025",
          org: "University of Oslo",
          place: "Oslo",
          role: "Social Entrepreneurship",
          points: [
            "One-semester programme at Gründerskolen focused on social entrepreneurship, with an internship in the non-profit sector in South Africa.",
          ],
        },
        {
          period: "August 2022 – May 2025",
          org: "University of Agder",
          place: "Kristiansand",
          role: "BSc in Business Administration",
          points: [
            "Bachelor's thesis on optimising utilisation hours for concession power, in collaboration with Å Entelios and Konsesjonskraft IKS.",
          ],
        },
        {
          period: "January 2024 – April 2024",
          org: "University of Ruhuna",
          place: "Sri Lanka",
          role: "Fieldwork",
          points: ["Fieldwork stay in Sri Lanka as part of my bachelor's degree in Global Development."],
        },
        {
          period: "2023",
          org: "Harvard Business School Online",
          place: "Online",
          role: "Certificate in Sustainable Business Strategy",
          points: [],
        },
        {
          period: "August 2021 – May 2024",
          org: "University of Agder",
          place: "Kristiansand",
          role: "BA in Global Development",
          points: [
            "Bachelor's thesis on the socio-economic implications of Chinese financing of port infrastructure in the Global South. Qualitative field study in Hambantota, Sri Lanka.",
          ],
        },
      ],
    },
    thesis: {
      title: "Master's thesis",
      heading: "Correlations between Nordic price areas and the pricing of EPAD contracts",
      paragraphs: [
        "Electricity prices in the Nordics differ between price areas. A producer or large consumer who wants to hedge therefore has to manage both the common system price and the deviation in their own area. EPAD contracts are the instrument for the latter.",
        "The thesis examines how the price areas move together over time, and what that means for hedging strategies with system futures and EPAD contracts. It is written in collaboration with Å Energi and will be submitted in December 2026.",
      ],
      facts: [
        ["Degree", "MSc, Analytical Finance"],
        ["Institution", "University of Agder"],
        ["Partner", "Å Energi"],
        ["Submission", "December 2026"],
      ],
    },
    interests: {
      title: "What I care about",
      intro:
        "I care about effective giving and global development: where an extra krone does the most good, and how we can know.",
      items: [
        {
          title: "Effective giving",
          text: "Some interventions help far more people per krone than others. I want to understand the methods behind those assessments, and I work every day in an organisation built on them.",
        },
        {
          title: "Global development",
          text: "Aid, African economies and long-run progress in the world. The interest began with my degree in global development and fieldwork in Sri Lanka.",
        },
        {
          title: "Analysis and automation",
          text: "I like making numbers understandable and removing manual work, whether in accounting, reporting or power market data.",
        },
      ],
      sourcesLabel: "Sources I follow",
      sources: [
        ["GiveWell", "https://www.givewell.org"],
        ["Our World in Data", "https://ourworldindata.org"],
        ["EA Forum", "https://forum.effectivealtruism.org"],
        ["Global Development & EA (David Nash)", "https://gdea.substack.com"],
      ],
    },
    writing: {
      title: "Writing",
      posts: [],
    },
    life: {
      title: "Running and reading",
      blocks: [
        {
          title: "Running",
          text: "I run about 50 kilometres a week, and cycle when I get the chance. Running gives the week structure and time to think.",
        },
        {
          title: "Reading",
          text: "Mostly non-fiction and short fiction. Some favourites:",
          list: [
            "Small Things Like These, Claire Keegan",
            "Moral Ambition, Rutger Bregman",
            "Adam Grant",
            "Ryan Holiday",
            "Malcolm Gladwell",
          ],
        },
      ],
    },
    skills: {
      title: "Tools",
      groups: [
        ["Analysis and office", ["Python", "R", "SQL", "Microsoft Office", "Google Workspace", "CRM systems"]],
        ["Accounting systems", ["Tripletex", "Fiken", "Xledger", "Finago"]],
      ],
    },
    contact: {
      title: "Contact",
      text: "Feel free to get in touch by email.",
      emailLabel: "Email",
      linkedinLabel: "LinkedIn",
    },
    footer: "Last updated November 2026",
    ui: { theme: "Switch between light and dark", lang: "Language" },
  },
};
