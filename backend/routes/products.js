const Router = require("express").Router;

const router = Router();
const db = require("../db");
const mongodb = require("mongodb");
const decimal128 = mongodb.Decimal128;
const ObjectId = mongodb.ObjectId;
router.get("/", async (req, res, next) => {
  let products = [];

  try {
    await db
      .getDb()
      .db()
      .collection("products")
      .find()
      .forEach((prod) => {
        prod.price = prod.price.toString();
        products.push(prod);
      });
    if (products) return res.status(200).json(products);
  } catch (err) {
    res.status(404).json({
      message: "could not  receive any products",
    });
  }
});

// Get single product
router.get("/:id", async (req, res, next) => {
  const productId = new ObjectId(req.params.id);
  try {
    await db
      .getDb()
      .db()
      .collection("products")
      .findOne({ _id: productId })
      .then((result) => {
        res.json(result);
      });
  } catch (err) {
    res.status(404).json({
      message: "could not  receive any products",
    });
  }
});

// Add new product
router.post("/", async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: decimal128.fromString(req.body.price.toString()),
    image: req.body.image,
  };

  try {
    db.getDb()
      .db()
      .collection("products")
      .insertOne(newProduct)
      .then((res) => {
        res.status(201).json({
          message: "Product added successfully",
          productId: result.insertedId,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "an error occurred" + err,
        });
      });
  } catch (error) {
    next(error);
  }
});

router.post("/bulk", async (req, res, next) => {
  try {
    const products = req.body;
    await db
      .getDb()
      .collection("products")
      .insertMany(products)
      .then((result) => {
        res.status(201).json({
          message: `${result.insertedCount} products added`,
          insertedIds: result.insertedIds,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "an error occurred" + err,
        });
      });
  } catch (error) {
    next(error);
  }
});

// Edit existing product
// Requires logged in user
router.patch("/:id", (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  console.log(updatedProduct);
  res.status(200).json({ message: "Product updated", productId: "DUMMY" });
});

// Delete a product
// Requires logged in user
router.delete("/:id", (req, res, next) => {
  res.status(200).json({ message: "Product deleted" });
});

module.exports = router;
