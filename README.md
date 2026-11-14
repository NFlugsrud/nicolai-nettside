# Nicolai F. Dahl – personlig nettside

Statisk nettside (HTML, CSS og JavaScript) som kjører lokalt. Norsk og engelsk.

## Kjøre siden

Dobbeltklikk på `start.command`. Siden åpnes på http://localhost:8001. Stopp med Ctrl+C.

## Redigere innhold

All tekst ligger i `js/data.js`, én gang på norsk (`no`) og én gang på engelsk (`en`).

- **Profilbilde:** legg bildet i `bilder/profil.jpg`. Uten bilde vises initialene.
- **LinkedIn:** lim inn lenken i feltet `linkedin` øverst i `js/data.js`.
- **Skriving:** legg til innlegg i `writing.posts`. Seksjonen vises når listen har innhold.

## Lagre endringer til GitHub

```bash
git add -A && git commit -m "Oppdatert innhold" && git push
```
