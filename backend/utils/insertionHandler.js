import { client } from "../app";

export async function insertionHandler(dbName, colName, documents) {
  const db = client.db(dbName);

  if (Array.isArray(documents)) {
    const result = await db.collection(colName).insertMany(documents);
    return {
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds,
    };
  } else {
    const result = await db.collection(colName).insertOne(documents);
    return {
      insertedId: result.insertedId,
    };
  }
}
