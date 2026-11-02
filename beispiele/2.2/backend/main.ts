import { Hono }  from 'npm:hono';
import { cors }  from 'npm:hono/cors';
import {
  createFlight,
  deleteFlight,
  getFlightById,
  initializeDatabase,
  listFlights,
  updateFlightStatus,
} from './db.ts';
import { FlightStatus } from './data.ts';

const app = new Hono();

app.use('*', cors({ origin: 'http://localhost:4200' }));

// GET /api/flights?type=departure&status=on-time&search=os
app.get('/api/flights', async (c) => {
  const type   = c.req.query('type');
  const status = c.req.query('status');
  const search = c.req.query('search');
  const result = await listFlights(
    type   ?? undefined,
    status ?? undefined,
    search ?? undefined,
  );
  return c.json(result);
});

// GET /api/flights/:id
app.get('/api/flights/:id', async (c) => {
  const id     = Number(c.req.param('id'));
  const flight = await getFlightById(id);
  if (!flight) return c.json({ error: 'Flug nicht gefunden' }, 404);
  return c.json(flight);
});

// POST /api/flights
app.post('/api/flights', async (c) => {
  const body = await c.req.json();
  if (!body.flightNumber || !body.airline || !body.scheduledTime) {
    return c.json({ error: 'Pflichtfelder fehlen' }, 400);
  }
  const flight = await createFlight({
    flightNumber:  body.flightNumber,
    airline:       body.airline,
    type:          body.type ?? 'departure',
    scheduledTime: body.scheduledTime,
    expectedTime:  body.expectedTime,
    airport:       body.airport ?? '',
    terminal:      body.terminal ?? 'T1',
    gate:          body.gate,
  });
  return c.json(flight, 201);
});

// PATCH /api/flights/:id  { status: "delayed" }
app.patch('/api/flights/:id', async (c) => {
  const id     = Number(c.req.param('id'));
  const body   = await c.req.json();
  const status = body.status as FlightStatus;
  const flight = await updateFlightStatus(id, status);
  if (!flight) return c.json({ error: 'Flug nicht gefunden' }, 404);
  return c.json(flight);
});

// DELETE /api/flights/:id
app.delete('/api/flights/:id', async (c) => {
  const id      = Number(c.req.param('id'));
  const deleted = await deleteFlight(id);
  if (!deleted) return c.json({ error: 'Flug nicht gefunden' }, 404);
  return c.json(deleted);
});

await initializeDatabase();

Deno.serve({ port: 8000 }, app.fetch);
console.log('FlugBoard API (Drizzle + SQLite) läuft auf http://localhost:8000');
