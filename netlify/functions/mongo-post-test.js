const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = `mongodb+srv://${process.env.VUE_APP_MONGO_DB_USERNAME}:${process.env.VUE_APP_MONGO_DB_PASSWORD}@cluster0.iilta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(`MONGODB_URI = ${MONGODB_URI}`)

const DB_NAME = 'myFirstDatabase';

const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
};


const queryDatabase = async (db) => {
  const users = await db.collection("users").find({}).toArray();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(users),
  };
};


const pushToDatabase = async (db, data) => {
    const mongoData = {
      name: data.name,
      number: data.number,
    };
  
    return { "hello":"hello" }
    if (mongoData.name && mongoData.number) {
      await db.collection("test").insertMany([data]);
      return { statusCode: 201 };
    } else {
      return { statusCode: 422 };
    }
  };
  
  module.exports.handler = async (event, context) => {
    // otherwise the connection will never complete, since
    // we keep the DB connection alive
    context.callbackWaitsForEmptyEventLoop = false;
  
    const db = await connectToDatabase(MONGODB_URI);
  
    switch (event.httpMethod) {
      case "GET":
        return queryDatabase(db);
      case "POST":
        return pushToDatabase(db, JSON.parse(event.body));
      default:
        return { statusCode: 400 };
    }
  };