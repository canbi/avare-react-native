import { getDatabase } from "../database/databaseRepository";
import { List } from "../domain/list";
import * as SQLite from "expo-sqlite";

// * CRUD
const getLists = async (): Promise<List[]> => {
  const db = await getDatabase();
  const lists = await db.getAllAsync<List>("SELECT * FROM list");
  return lists;
};

const getListById = async (id: number): Promise<List | null> => {
  const db = await getDatabase();
  const list = await db.getFirstAsync<List>(
    "SELECT * FROM list WHERE id = ?",
    id
  );
  return list || null;
};

const createList = async (
  list: Omit<List, "id">
): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    "INSERT INTO list (title, description, emoji, write_date) VALUES (?, ?, ?, ?)",
    list.title,
    list.description ?? null,
    list.emoji,
    list.write_date
  );
  return result;
};

const updateList = async (
  id: number,
  list: List
): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    "UPDATE list SET title = ?, description = ?, emoji = ?, write_date = ? WHERE id = ?",
    list.title,
    list.description ?? null,
    list.emoji,
    list.write_date,
    id
  );
  return result;
};

const deleteList = async (id: number): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync("DELETE FROM list WHERE id = ?", id);
  return result;
};

// * High level operations
const createListWithLocations = async (
  list: Omit<List, "id">,
  locationIds: number[]
): Promise<void> => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    const createListResult = await createList(list);
    const listId = createListResult.lastInsertRowId;
    await addLocationsToList(listId, locationIds);
  });
};

const updateListWithLocations = async (
  listId: number,
  list: Omit<List, "id">,
  locationIds: number[]
): Promise<void> => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    await updateList(listId, list);
    await removeAllLocationsFromList(listId);
    if (locationIds.length > 0) {
      await addLocationsToList(listId, locationIds);
    }
  });
};

// * Locations
const addLocationsToList = async (
  listId: number,
  locationIds: number[]
): Promise<void> => {
  const db = await getDatabase();

  const promises = locationIds.map((locationId) =>
    db.runAsync(
      "INSERT INTO list_location (list_id, location_id) VALUES (?, ?)",
      listId,
      locationId
    )
  );
  await Promise.all(promises);
};

const removeAllLocationsFromList = async (listId: number): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync("DELETE FROM list_location WHERE list_id = ?", listId);
};

const getLocationsForList = async (listId: number): Promise<Location[]> => {
  const db = await getDatabase();
  const locations = await db.getAllAsync<Location>(
    `
    SELECT location.* FROM location
    INNER JOIN list_location ON location.id = list_location.location_id
    WHERE list_location.list_id = ?
  `,
    listId
  );
  return locations;
};

export {
  getLists,
  getListById,
  deleteList,
  getLocationsForList,
  createListWithLocations,
  updateListWithLocations,
};
