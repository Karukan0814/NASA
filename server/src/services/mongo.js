const MONGO_URL = process.env.MONGO_URL;

const mongoose = require("mongoose");

mongoose.connection.on("open", () => {
  console.log("Mongo DB connected");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
