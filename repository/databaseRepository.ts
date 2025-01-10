import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("avare.db");
  }
  return dbInstance;
};

const initDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    -- List Table
    CREATE TABLE IF NOT EXISTS list (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      emoji TEXT NOT NULL,
      write_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Location Table
    CREATE TABLE IF NOT EXISTS location (
      id INTEGER PRIMARY KEY NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      emoji TEXT NOT NULL,
      color TEXT NOT NULL,
      is_cover_empty BOOLEAN NOT NULL DEFAULT FALSE,
      country TEXT NOT NULL,
      country_code TEXT NOT NULL,
      local_address TEXT NOT NULL,
      write_date TEXT NOT NULL,
      photo_ids TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Note Table
    CREATE TABLE IF NOT EXISTS note (
      id INTEGER PRIMARY KEY NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      write_date TEXT NOT NULL,
      location_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES location (id) ON DELETE CASCADE
    );

    -- List-Location Join Table
    CREATE TABLE IF NOT EXISTS list_location (
      list_id INTEGER NOT NULL,
      location_id INTEGER NOT NULL,
      PRIMARY KEY (list_id, location_id),
      FOREIGN KEY (list_id) REFERENCES list (id) ON DELETE CASCADE,
      FOREIGN KEY (location_id) REFERENCES location (id) ON DELETE CASCADE
    );

    -- Indexes for frequently queried columns
    CREATE INDEX IF NOT EXISTS idx_note_location_id ON note (location_id);
    CREATE INDEX IF NOT EXISTS idx_list_location_list_id ON list_location (list_id);
    CREATE INDEX IF NOT EXISTS idx_list_location_location_id ON list_location (location_id);
  `);

  console.log("Database initialized successfully");
};

const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
};

export { getDatabase, initDatabase, closeDatabase };
