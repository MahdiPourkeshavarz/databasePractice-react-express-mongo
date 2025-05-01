import { client } from "../app";

export async function insertionHandler(dbName, colName, documents) {
  const db = client.db(dbName);
  try {
    let result;
    if (Array.isArray(documents)) {
      result = await db.collection(colName).insertMany(documents);
    } else {
      result = await db.collection(colName).insertOne(documents);
    }
    return res.status(201).json({
      message: Array.isArray(documents) ? "Products Added" : "Product added",
      productId: result.insertedId,
    });
  } catch (error) {
    return res.status(404).json({
      message: Array.isArray(documents)
        ? "Could not Add the Products"
        : "Could not Add the Product",
    });
  }
}
