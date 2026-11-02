import { createClient } from 'npm:@libsql/client';
import { and, eq }       from 'npm:drizzle-orm';
import { drizzle }       from 'npm:drizzle-orm/libsql';
import {
  integer,
  sqliteTable,
  text,
} from 'npm:drizzle-orm/sqlite-core';

import { Flight, FlightStatus, FlightType, seedFlights } from './data.ts';

const client = createClient({ url: 'file:./flugboard.db' });

export const flightsTable = sqliteTable('flights', {
  id:            integer('id').primaryKey(),
  flightNumber:  text('flight_number').notNull(),
  airline:       text('airline').notNull(),
  type:          text('type').notNull(),
  scheduledTime: text('scheduled_time').notNull(),
  expectedTime:  text('expected_time'),
  status:        text('status').notNull(),
  airport:       text('airport').notNull(),
  terminal:      text('terminal').notNull(),
  gate:          text('gate'),
});

const db = drizzle(client);

const mapFlight = (row: typeof flightsTable.$inferSelect): Flight => ({
  id:            row.id,
  flightNumber:  row.flightNumber,
  airline:       row.airline,
  type:          row.type as FlightType,
  scheduledTime: row.scheduledTime,
  expectedTime:  row.expectedTime ?? undefined,
  status:        row.status as FlightStatus,
  airport:       row.airport,
  terminal:      row.terminal,
  gate:          row.gate ?? undefined,
});

export const initializeDatabase = async () => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS flights (
      id            INTEGER PRIMARY KEY,
      flight_number TEXT    NOT NULL,
      airline       TEXT    NOT NULL,
      type          TEXT    NOT NULL,
      scheduled_time TEXT   NOT NULL,
      expected_time TEXT,
      status        TEXT    NOT NULL,
      airport       TEXT    NOT NULL,
      terminal      TEXT    NOT NULL,
      gate          TEXT
    )
  `);

  const result = await client.execute('SELECT COUNT(*) as count FROM flights');
  if (Number(result.rows[0]?.count ?? 0) === 0) {
    await db.insert(flightsTable).values(
      seedFlights.map((f) => ({
        id:            f.id,
        flightNumber:  f.flightNumber,
        airline:       f.airline,
        type:          f.type,
        scheduledTime: f.scheduledTime,
        expectedTime:  f.expectedTime ?? null,
        status:        f.status,
        airport:       f.airport,
        terminal:      f.terminal,
        gate:          f.gate ?? null,
      })),
    );
  }
};

export const listFlights = async (
  type?:   string,
  status?: string,
  search?: string,
): Promise<Flight[]> => {
  const filters = [];
  if (type)   filters.push(eq(flightsTable.type,   type));
  if (status) filters.push(eq(flightsTable.status, status));

  const rows = filters.length
    ? await db.select().from(flightsTable).where(and(...filters))
    : await db.select().from(flightsTable);

  let flights = rows.map(mapFlight);

  if (search) {
    const q = search.toLowerCase();
    flights = flights.filter(
      (f) =>
        f.flightNumber.toLowerCase().includes(q) ||
        f.airline.toLowerCase().includes(q) ||
        f.airport.toLowerCase().includes(q),
    );
  }

  return flights;
};

export const getFlightById = async (id: number): Promise<Flight | null> => {
  const rows = await db
    .select()
    .from(flightsTable)
    .where(eq(flightsTable.id, id))
    .limit(1);
  return rows.length ? mapFlight(rows[0]) : null;
};

export const createFlight = async (
  input: Omit<Flight, 'id' | 'status'>,
): Promise<Flight> => {
  const flight: Flight = { id: Date.now(), status: 'on-time', ...input };
  await db.insert(flightsTable).values({
    id:            flight.id,
    flightNumber:  flight.flightNumber,
    airline:       flight.airline,
    type:          flight.type,
    scheduledTime: flight.scheduledTime,
    expectedTime:  flight.expectedTime ?? null,
    status:        flight.status,
    airport:       flight.airport,
    terminal:      flight.terminal,
    gate:          flight.gate ?? null,
  });
  return flight;
};

export const updateFlightStatus = async (
  id: number,
  status: FlightStatus,
): Promise<Flight | null> => {
  const flight = await getFlightById(id);
  if (!flight) return null;
  await db
    .update(flightsTable)
    .set({ status })
    .where(eq(flightsTable.id, id));
  return { ...flight, status };
};

export const deleteFlight = async (id: number): Promise<Flight | null> => {
  const flight = await getFlightById(id);
  if (!flight) return null;
  await db.delete(flightsTable).where(eq(flightsTable.id, id));
  return flight;
};
