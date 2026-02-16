# BydgoszczAglomeracja (MVP)

Lekka aplikacja (Node.js + vanilla JS) inspirowana deweloperuch.pl, ale ograniczona do:
- Bydgoszczy,
- powiatu bydgoskiego,
- sąsiednich powiatów (inowrocławski, nakielski, świecki, chełmiński, toruński, żniński).

## Co robi MVP

1. Łączy się z API `https://api.dane.gov.pl/1.4/datasets`.
2. Pobiera zbiory danych dla frazy (domyślnie: `budownictwo mieszkaniowe`).
3. Filtruje lokalnie wyniki po nazwach powiatów aglomeracji bydgoskiej.
4. Wyświetla zbiory, datę aktualizacji i listę zasobów (linki do plików/stron).

## Uruchomienie

```bash
node bydgoszczaglomeracja/server.mjs
```

Aplikacja będzie dostępna pod adresem:

- `http://localhost:4174`

## Endpointy backendu

- `GET /api/powiats` — lista obsługiwanych powiatów.
- `GET /api/datasets?query=<fraza>&powiat=<powiat>&powiat=<powiat>` — dane z dane.gov.pl po filtrach.
