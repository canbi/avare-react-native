import { getDatabase } from "../databaseRepository";
import { List } from "../domain/list";
import { Note } from "../domain/note";
import { Location } from "../domain/location";
import { addNotesToLocation, removeAllNotesFromLocation } from "./noteService";
import * as SQLite from "expo-sqlite";

// * CRUD
const getLocations = async (): Promise<Location[]> => {
  const db = await getDatabase();
  const locations = await db.getAllAsync<Location>("SELECT * FROM location");
  return locations;
};

const getLocationById = async (id: number): Promise<Location | null> => {
  const db = await getDatabase();
  const location = await db.getFirstAsync<Location>(
    "SELECT * FROM location WHERE id = ?",
    id
  );
  return location || null;
};

const createLocation = async (
  location: Omit<Location, "id">
): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    "INSERT INTO location (latitude, longitude, title, description, emoji, color, is_cover_empty, country, country_code, local_address, write_date, photo_ids) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

const updateLocation = async (
  id: number,
  location: Location
): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    "UPDATE location SET latitude = ?, longitude = ?, title = ?, description = ?, emoji = ?, color = ?, is_cover_empty = ?, country = ?, country_code = ?, local_address = ?, write_date = ?, photo_ids = ? WHERE id = ?",
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

const deleteLocation = async (id: number): Promise<SQLite.SQLiteRunResult> => {
  const db = await getDatabase();
  const result = await db.runAsync("DELETE FROM location WHERE id = ?", id);
  return result;
};

// * High level operations
const createLocationWithListsAndNotes = async (
  location: Omit<Location, "id">,
  listIds: number[],
  notes: Omit<Note, "id">[]
): Promise<void> => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    const locationResult = await createLocation(location);
    const locationId = locationResult.lastInsertRowId;
    await addListsToLocation(locationId, listIds);
    await addNotesToLocation(locationId, notes);
  });
};

const updateLocationWithListsAndNotes = async (
  locationId: number,
  location: Location,
  listIds: number[],
  notes: Omit<Note, "id">[]
): Promise<void> => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    if (Object.keys(location).length > 0) {
      await updateLocation(locationId, location);
    }

    await removeAllListsFromLocation(locationId);
    if (listIds.length > 0) await addListsToLocation(locationId, listIds);

    await removeAllNotesFromLocation(locationId);
    if (notes.length > 0) await addNotesToLocation(locationId, notes);
  });
};

// * Lists
const addListsToLocation = async (
  locationId: number,
  listIds: number[]
): Promise<void> => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    const promises = listIds.map((listId) =>
      db.runAsync(
        "INSERT INTO list_location (location_id, list_id) VALUES (?, ?)",
        locationId,
        listId
      )
    );

    await Promise.all(promises);
  });
};

const removeAllListsFromLocation = async (
  locationId: number
): Promise<void> => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      "DELETE FROM list_location WHERE location_id = ?",
      locationId
    );
  });
};

const getListsForLocation = async (locationId: number): Promise<List[]> => {
  const db = await getDatabase();
  const lists = await db.getAllAsync<List>(
    `
    SELECT list.* FROM list
    INNER JOIN list_location ON list.id = list_location.list_id
    WHERE list_location.location_id = ?
  `,
    locationId
  );
  return lists;
};

export {
  getLocations,
  getLocationById,
  deleteLocation,
  getListsForLocation,
  createLocationWithListsAndNotes,
  updateLocationWithListsAndNotes,
};
