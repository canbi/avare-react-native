import APIResult from '@/utils/APIResult';
import { Note } from '@/presentation/_domain';
import * as SQLite from 'expo-sqlite';
import { getDatabase } from '../DatabaseRepository';

// * CRUD
const getNotes = async (): Promise<APIResult<Note[]>> => {
  try {
    const db = await getDatabase();
    const notes = await db.getAllAsync<Note>('SELECT * FROM note');
    return APIResult.success(notes);
  } catch (error) {
    return APIResult.failure<Note[]>(error);
  }
};

const getNoteById = async (id: number): Promise<APIResult<Note | null>> => {
  try {
    const db = await getDatabase();
    const note = await db.getFirstAsync<Note>('SELECT * FROM note WHERE id = ?', id);
    return APIResult.success(note || null);
  } catch (error) {
    return APIResult.failure<Note | null>(error);
  }
};

const _createNote = async (note: Omit<Note, 'id'>, location_id: number): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();

  const result = await db.runAsync(
    'INSERT INTO note (description, date, write_date, location_id) VALUES (?, ?, ?, ?)',
    note.description,
    note.date,
    note.write_date,
    location_id
  );
  return result;
};

const _deleteNote = async (id: number): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync('DELETE FROM note WHERE id = ?', id);
  return result;
};

// * Locations
const addNotesToLocation = async (locationId: number, notes: Omit<Note, 'id'>[]): Promise<void> => {
  const promises = notes.map((note) => _createNote(note, locationId));
  await Promise.all(promises);
};

const removeAllNotesFromLocation = async (locationId: number): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync('DELETE FROM note WHERE location_id = ?', locationId);
};

const getNotesForLocation = async (locationId: number): Promise<APIResult<Note[]>> => {
  try {
    const db = await getDatabase();
    const notes = await db.getAllAsync<Note>(
      `
      SELECT * FROM note
      WHERE location_id = ?
    `,
      locationId
    );
    return APIResult.success(notes);
  } catch (error) {
    return APIResult.failure<Note[]>(error);
  }
};

export {
  getNotes,
  getNoteById,
  _deleteNote as deleteNote,
  addNotesToLocation,
  removeAllNotesFromLocation,
  getNotesForLocation,
};
