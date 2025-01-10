import { getDatabase } from "../databaseRepository";
import { Note } from "../domain/note";
import * as SQLite from "expo-sqlite";

// * CRUD
const getNotes = async (): Promise<Note[]> => {
  const db = await getDatabase();
  const notes = await db.getAllAsync<Note>("SELECT * FROM note");
  return notes;
};

const getNoteById = async (id: number): Promise<Note | null> => {
  const db = await getDatabase();
  const note = await db.getFirstAsync<Note>(
    "SELECT * FROM note WHERE id = ?",
    id
  );
  return note || null;
};

const createNote = async (
  note: Omit<Note, "id">
): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    "INSERT INTO note (description, date, write_date, location_id) VALUES (?, ?, ?, ?)",
    note.description,
    note.date,
    note.write_date,
    note.location_id
  );
  return result;
};

const updateNote = async (
  id: number,
  note: Note
): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    "UPDATE note SET description = ?, date = ?, write_date = ?, location_id = ? WHERE id = ?",
    note.description,
    note.date,
    note.write_date,
    note.location_id,
    id
  );
  return result;
};

const deleteNote = async (id: number): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync("DELETE FROM note WHERE id = ?", id);
  return result;
};

// * Locations
const addNotesToLocation = async (
  locationId: number,
  notes: Omit<Note, "id">[]
): Promise<void> => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    const promises = notes.map((note) =>
      db.runAsync(
        "INSERT INTO note (description, date, write_date, location_id) VALUES (?, ?, ?, ?)",
        note.description,
        note.date,
        note.write_date,
        locationId
      )
    );

    await Promise.all(promises);
  });
};

const removeAllNotesFromLocation = async (
  locationId: number
): Promise<void> => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM note WHERE location_id = ?", locationId);
  });
};

const getNotesForLocation = async (locationId: number): Promise<Note[]> => {
  const db = await getDatabase();
  const notes = await db.getAllAsync<Note>(
    `
    SELECT * FROM note
    WHERE location_id = ?
  `,
    locationId
  );
  return notes;
};

export {
  getNotes,
  getNoteById,
  deleteNote,
  addNotesToLocation,
  removeAllNotesFromLocation,
  getNotesForLocation,
};
