import APIResult from '@/utils/APIResult';
import { getDatabase } from '../DatabaseRepository';
import * as SQLite from 'expo-sqlite';
import { List, Location } from '@/presentation/_domain';

// * CRUD
const getLists = async (): Promise<APIResult<List[]>> => {
  try {
    const db = await getDatabase();
    const lists = await db.getAllAsync<List>('SELECT * FROM list');

    return APIResult.success(lists!);
  } catch (error) {
    return APIResult.failure<List[]>(error);
  }
};

const getListById = async (id: number): Promise<APIResult<List | null>> => {
  try {
    const db = await getDatabase();
    const list = await db.getFirstAsync<List>('SELECT * FROM list WHERE id = ?', id);

    return APIResult.success(list || null);
  } catch (error) {
    return APIResult.failure<List | null>(error);
  }
};

const _createList = async (list: Omit<List, 'id'>): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO list (title, description, emoji, write_date) VALUES (?, ?, ?, ?)',
    list.title,
    list.description ?? null,
    list.emoji,
    list.write_date
  );
  return result;
};

const _updateList = async (id: number, list: List): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'UPDATE list SET title = ?, description = ?, emoji = ?, write_date = ? WHERE id = ?',
    list.title,
    list.description ?? null,
    list.emoji,
    list.write_date,
    id
  );
  return result;
};

const deleteList = async (id: number): Promise<APIResult<SQLite.SQLiteRunResult>> => {
  try {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM list WHERE id = ?', id);
    return APIResult.success(result);
  } catch (error) {
    return APIResult.failure<SQLite.SQLiteRunResult>(error);
  }
};

// * Locations
const _addLocationsToList = async (listId: number, locationIds: number[]): Promise<void> => {
  const db = await getDatabase();

  const promises = locationIds.map((locationId) =>
    db.runAsync('INSERT INTO list_location (list_id, location_id) VALUES (?, ?)', listId, locationId)
  );
  await Promise.all(promises);
};

const _removeAllLocationsFromList = async (listId: number): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync('DELETE FROM list_location WHERE list_id = ?', listId);
};

const getLocationsForList = async (listId: number): Promise<APIResult<Location[]>> => {
  try {
    const db = await getDatabase();
    const locations = await db.getAllAsync<Location>(
      `
        SELECT location.* FROM location
        INNER JOIN list_location ON location.id = list_location.location_id
        WHERE list_location.list_id = ?
      `,
      listId
    );
    return APIResult.success(locations);
  } catch (error) {
    return APIResult.failure<Location[]>(error);
  }
};

// * High level operations
const createListWithLocations = async (list: Omit<List, 'id'>, locationIds: number[]): Promise<APIResult<number>> => {
  try {
    const db = await getDatabase();

    let listId: number;

    await db.withTransactionAsync(async () => {
      const createListResult = await _createList(list);
      listId = createListResult.lastInsertRowId as number;
      await _addLocationsToList(listId, locationIds);
    });

    return APIResult.success(listId!);
  } catch (error) {
    return APIResult.failure<number>(error);
  }
};

const updateListWithLocations = async (
  listId: number,
  list: Omit<List, 'id'>,
  locationIds: number[]
): Promise<APIResult<void>> => {
  try {
    const db = await getDatabase();

    await db.withTransactionAsync(async () => {
      await _updateList(listId, list);
      await _removeAllLocationsFromList(listId);
      if (locationIds.length > 0) {
        await _addLocationsToList(listId, locationIds);
      }
    });

    return APIResult.success();
  } catch (error) {
    return APIResult.failure<void>(error);
  }
};

export { getLists, getListById, deleteList, getLocationsForList, createListWithLocations, updateListWithLocations };
