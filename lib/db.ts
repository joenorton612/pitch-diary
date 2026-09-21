import { createClient, type Client } from "@libsql/client";
import fs from "fs";
import path from "path";

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    age INTEGER,
    position TEXT,
    team TEXT,
    onboarded INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    ended_at TEXT
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    played_on TEXT NOT NULL,
    opponent TEXT NOT NULL,
    competition TEXT NOT NULL,
    venue TEXT NOT NULL DEFAULT 'Home',
    team_score INTEGER NOT NULL DEFAULT 0,
    opponent_score INTEGER NOT NULL DEFAULT 0,
    goals INTEGER NOT NULL DEFAULT 0,
    assists INTEGER NOT NULL DEFAULT 0,
    clean_sheet INTEGER NOT NULL DEFAULT 0,
    positions_played TEXT NOT NULL DEFAULT '',
    man_of_match INTEGER NOT NULL DEFAULT 0,
    card TEXT NOT NULL DEFAULT 'None',
    minutes_played INTEGER NOT NULL DEFAULT 0,
    game_length_minutes INTEGER NOT NULL DEFAULT 90,
    rating REAL NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

function buildClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  }

  // No Turso configured — fall back to a local SQLite file (used in dev).
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return createClient({ url: `file:${path.join(dataDir, "app.db")}` });
}

declare global {
  var __pitchDiaryClient: Client | undefined;
  var __pitchDiaryReady: Promise<void> | undefined;
}

const client = global.__pitchDiaryClient ?? buildClient();
if (process.env.NODE_ENV !== "production") {
  global.__pitchDiaryClient = client;
}

const ready =
  global.__pitchDiaryReady ??
  (async () => {
    await client.execute("PRAGMA foreign_keys = ON");
    await client.executeMultiple(SCHEMA_SQL);
  })();
if (process.env.NODE_ENV !== "production") {
  global.__pitchDiaryReady = ready;
}

type SqlArg = string | number | bigint | boolean | null;

interface RunResult {
  lastInsertRowid: number;
  changes: number;
}

function prepare(sql: string) {
  return {
    async get<T = unknown>(...args: SqlArg[]): Promise<T | undefined> {
      await ready;
      const rs = await client.execute({ sql, args });
      return rs.rows[0] as unknown as T | undefined;
    },
    async all<T = unknown>(...args: SqlArg[]): Promise<T[]> {
      await ready;
      const rs = await client.execute({ sql, args });
      return rs.rows as unknown as T[];
    },
    async run(...args: SqlArg[]): Promise<RunResult> {
      await ready;
      const rs = await client.execute({ sql, args });
      return {
        lastInsertRowid: Number(rs.lastInsertRowid ?? 0),
        changes: rs.rowsAffected,
      };
    },
  };
}

/** A single atomic read-then-write unit of work, matching better-sqlite3's db.transaction() shape. */
function transaction<Args extends unknown[], Result>(
  fn: (tx: TransactionDb, ...args: Args) => Promise<Result>
) {
  return async (...args: Args): Promise<Result> => {
    await ready;
    const tx = await client.transaction("write");
    try {
      const result = await fn(wrapTransaction(tx), ...args);
      await tx.commit();
      return result;
    } finally {
      tx.close();
    }
  };
}

interface TransactionDb {
  prepare(sql: string): ReturnType<typeof prepare>;
}

function wrapTransaction(tx: Awaited<ReturnType<Client["transaction"]>>): TransactionDb {
  return {
    prepare(sql: string) {
      return {
        async get<T = unknown>(...args: SqlArg[]): Promise<T | undefined> {
          const rs = await tx.execute({ sql, args });
          return rs.rows[0] as unknown as T | undefined;
        },
        async all<T = unknown>(...args: SqlArg[]): Promise<T[]> {
          const rs = await tx.execute({ sql, args });
          return rs.rows as unknown as T[];
        },
        async run(...args: SqlArg[]): Promise<RunResult> {
          const rs = await tx.execute({ sql, args });
          return {
            lastInsertRowid: Number(rs.lastInsertRowid ?? 0),
            changes: rs.rowsAffected,
          };
        },
      };
    },
  };
}

const db = { prepare, transaction };

export default db;
