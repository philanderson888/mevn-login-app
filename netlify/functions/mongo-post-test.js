const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = `mongodb+srv://${process.env.VUE_APP_MONGO_DB_USERNAME}:${process.env.VUE_APP_MONGO_DB_PASSWORD}@cluster0.iilta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(`MONGODB_URI = ${MONGODB_URI}`)

const DB_NAME = 'myFirstDatabase';

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