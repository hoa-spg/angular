# FlugBoard Angular 1.6

Diese Ausbaustufe ist ein vollstaendiges Fullstack-Beispiel:

- Angular Frontend (Routing, Filter, Formular, Detailseite)
- RxJS Streams (combineLatest, switchMap, debounceTime, Polling)
- Deno + Hono API
- Drizzle ORM + SQLite Persistenz

## Start

1. Backend starten

```bash
cd backend
deno task dev
```

2. Frontend starten

```bash
npm install
npm start
```

## Endpunkte

- `GET /api/flights?type=departure&status=on-time&search=os`
- `GET /api/flights/:id`
- `POST /api/flights`
- `PATCH /api/flights/:id`
- `DELETE /api/flights/:id`
