Dette er en mal for nye innlegg. Den vises bare når siden kjøres lokalt, fordi den er merket som utkast i `js/data.js`.

## Slik legger du til et innlegg

1. Lag en ny fil i mappen `blogg/innlegg/`, for eksempel `effektiv-giving.md`. Filnavnet uten `.md` blir adressen til innlegget.
2. Skriv teksten i Markdown. Ikke skriv tittelen øverst i filen, den hentes fra `js/data.js`.
3. Legg innlegget til i listen `posts` i `js/data.js` med `slug` (filnavnet), dato, tittel og en kort oppsummering. Sett `draft: true` mens du skriver.
4. Se på det lokalt med `start.command`. Når du er fornøyd, fjerner du `draft: true`, committer og pusher.

Blogg-menyen dukker opp på nicolaif.no så snart det finnes ett innlegg som ikke er utkast.

## Det du kan bruke

- **Fet** og *kursiv* tekst
- [Lenker](https://gieffektivt.no)
- Punktlister og nummererte lister
- Mellomtitler med `##` og `###`

> Sitater skriver du med `>` foran linjen.

---

Bilder legger du i mappen `bilder/` og setter inn med `![Beskrivelse](/bilder/filnavn.jpg)`.

Husk at utkast også ligger i det offentlige repoet på GitHub, selv om de ikke vises på nettsiden.
