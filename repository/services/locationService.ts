import { getDatabase } from '../database/databaseRepository';
import { List } from '../domain/list';
import { Note } from '../domain/note';
import { Location } from '../domain/location';
import { addNotesToLocation, removeAllNotesFromLocation } from './noteService';
import * as SQLite from 'expo-sqlite';
import APIResult from '@/utils/apiResult';

// * CRUD
const getLocations = async (): Promise<APIResult<Location[]>> => {
  try {
    const db = await getDatabase();
    const locations = await db.getAllAsync<Location>('SELECT * FROM location');
    return APIResult.success(locations);
  } catch (error) {
    return APIResult.failure<Location[]>(error);
  }
};

const getLocationById = async (id: number): Promise<APIResult<Location | null>> => {
  try {
    const db = await getDatabase();
    const location = await db.getFirstAsync<Location>('SELECT * FROM location WHERE id = ?', id);
    return APIResult.success(location || null);
  } catch (error) {
    return APIResult.failure<Location | null>(error);
  }
};

const _createLocation = async (location: Omit<Location, 'id'>): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO location (latitude, longitude, title, description, emoji, color, is_cover_empty, country, country_code, local_address, write_date, photo_ids) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    location.latitude,
    location.longitude,
    location.title,
    location.description ?? null,
    location.emoji,
    location.color,
    location.is_cover_empty,
    location.country,
    location.country_code,
    location.local_address,
    location.write_date,
    location.photo_ids ?? null
  );
  return result;
};

const _updateLocation = async (id: number, location: Location): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'UPDATE location SET latitude = ?, longitude = ?, title = ?, description = ?, emoji = ?, color = ?, is_cover_empty = ?, country = ?, country_code = ?, local_address = ?, write_date = ?, photo_ids = ? WHERE id = ?',
    location.latitude,
    location.longitude,
    location.title,
    location.description ?? null,
    location.emoji,
    location.color,
    location.is_cover_empty,
    location.country,
    location.country_code,
    location.local_address,
    location.write_date,
    location.photo_ids ?? null,
    id
  );
  return result;
};
const deleteLocation = async (id: number): Promise<APIResult<SQLite.SQLiteRunResult>> => {
  try {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM location WHERE id = ?', id);
    return APIResult.success(result);
  } catch (error) {
    return APIResult.failure<SQLite.SQLiteRunResult>(error);
  }
};

// * Lists
const _addListsToLocation = async (locationId: number, listIds: number[]): Promise<void> => {
  const db = await getDatabase();

  const promises = listIds.map((listId) =>
    db.runAsync('INSERT INTO list_location (location_id, list_id) VALUES (?, ?)', locationId, listId)
  );

  await Promise.all(promises);
};

const _removeAllListsFromLocation = async (locationId: number): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync('DELETE FROM list_location WHERE location_id = ?', locationId);
};

const getListsForLocation = async (locationId: number): Promise<APIResult<List[]>> => {
  try {
    const db = await getDatabase();
    const lists = await db.getAllAsync<List>(
      `
      SELECT list.* FROM list
      INNER JOIN list_location ON list.id = list_location.list_id
      WHERE list_location.location_id = ?
    `,
      locationId
    );
    return APIResult.success(lists);
  } catch (error) {
    return APIResult.failure<List[]>(error);
  }
};

// * High level operations
const createLocationWithListsAndNotes = async (
  location: Omit<Location, 'id'>,
  listIds: number[],
  notes: Omit<Note, 'id'>[]
): Promise<APIResult<number>> => {
  try {
    const db = await getDatabase();

    let locationId: number;

    await db.withTransactionAsync(async () => {
      const locationResult = await _createLocation(location);
      locationId = locationResult.lastInsertRowId as number;
      await _addListsToLocation(locationId, listIds);
      await addNotesToLocation(locationId, notes);
    });

    return APIResult.success(locationId!);
  } catch (error) {
    return APIResult.failure<number>(error);
  }
};

const updateLocationWithListsAndNotes = async (
  locationId: number,
  location: Location,
  listIds: number[],
  notes: Omit<Note, 'id'>[]
): Promise<APIResult<void>> => {
  try {
    const db = await getDatabase();

    await db.withTransactionAsync(async () => {
      if (Object.keys(location).length > 0) {
        await _updateLocation(locationId, location);
      }

      await _removeAllListsFromLocation(locationId);
      if (listIds.length > 0) await _addListsToLocation(locationId, listIds);

      await removeAllNotesFromLocation(locationId);
      if (notes.length > 0) await addNotesToLocation(locationId, notes);
    });
    return APIResult.success();
  } catch (error) {
    return APIResult.failure<void>(error);
  }
};

export {
  getLocations,
  getLocationById,
  deleteLocation,
  getListsForLocation,
  createLocationWithListsAndNotes,
  updateLocationWithListsAndNotes,
};
