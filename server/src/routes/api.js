const express = require("express");

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();
api.use("/launch", launchesRouter);
api.use("/planets", planetsRouter);

module.exports = api;
