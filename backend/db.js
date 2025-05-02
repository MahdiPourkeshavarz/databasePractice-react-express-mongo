const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const mongoDbUrl =
  "mongodb+srv://mblackops77:I1OYbiJEJRlnG1W0@mongoo.w99oztq.mongodb.net/?retryWrites=true&w=majority&appName=mongoo";

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log("init");
    return callback(null, _db);
  }
  mongoClient
    .connect(mongoDbUrl)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error("not init");
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};
