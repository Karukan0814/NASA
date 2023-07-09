const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();
const api = require("./routes/api");
// const planetsRouter = require("./routes/planets/planets.router");
// const launchesRouter = require("./routes/launches/launches.router");

app.use(
  cors({
    origin: process.env.WHITE_LIST,
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(`/${process.env.CURRENT_VERSION}`, api);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
