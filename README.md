# Nicolai F. Dahl – personlig nettside

Statisk nettsted (HTML, CSS og JavaScript) på norsk og engelsk, publisert på https://nicolaif.no med GitHub Pages.

## Kjøre siden lokalt

Dobbeltklikk på `start.command`. Siden åpnes på http://localhost:8001. Stopp med Ctrl+C.

## Sider

| Adresse | Innhold |
|---|---|
| `/` | Forside med utforsk-kort |
| `/om/` | Om meg, interesser og giverkalkulator |
| `/erfaring/` | Arbeid og utdanning med filter, PDF og utskrift |
| `/master/` | Masteroppgaven med kart, sikringskalkulator og korrelasjonsgraf |
| `/na/` | Nå-side |
| `/bokhylle/` | Bøker og forfattere |
| `/blogg/` | Blogg (vises i menyen når det finnes et publisert innlegg) |
| `/kontakt/` | Kontaktskjema som åpner e-postprogrammet |

## Redigere innhold

All tekst ligger i `js/data.js`, én gang på norsk (`no`) og én gang på engelsk (`en`).

- **Nå-siden:** oppdater `nowPage.items` og `nowPage.updatedDate`.
- **Bokhylle:** legg til bøker i `books` øverst i filen.
- **Giverkalkulator:** tallene ligger i `give` øverst i filen, med kilder.
- **Profilbilde:** `bilder/profil.jpg`.
- **LinkedIn:** lim inn lenken i feltet `linkedin` øverst i `js/data.js`.

## Skrive et blogginnlegg

1. Skriv teksten i Markdown i `blogg/innlegg/<navn>.md`.
2. Legg innlegget til i `posts` i `js/data.js` med `slug: "<navn>"`, dato, tittel og oppsummering.
3. Med `draft: true` vises innlegget bare lokalt. Fjern det når innlegget skal ut.

Se utkastet `blogg/innlegg/slik-skriver-du-et-innlegg.md` for et eksempel.

## CV (PDF)

PDF-ene i `cv/` lages fra `cv.html` med innholdet i `js/data.js`. Dobbeltklikk `lag-cv.command` etter endringer i erfaring eller utdanning.

## Filer

- `js/data.js` – alt innhold
- `js/site.js` – meny, språk, tema og felles deler
- `js/pages.js` – én funksjon per side
- `css/style.css` – utseende

## Publisere

```bash
git add -A && git commit -m "Oppdatert innhold" && git push
```

Repoet er offentlig, så ikke legg private filer i denne mappen.
