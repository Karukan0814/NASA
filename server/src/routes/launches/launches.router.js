const express = require("express");
const launchesRouter = express.Router();
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("../launches/launches.controller");

launchesRouter.get("/", (req, res) => {
  console.log("GET launches");
  const launches = httpGetAllLaunches(req, res);
});

launchesRouter.post("/", (req, res) => {
  console.log("POST launches");
  httpAddNewLaunch(req, res);
});
launchesRouter.delete("/:id", (req, res) => {
  console.log("DELETE launches");
  httpAbortLaunch(req, res);
});

module.exports = launchesRouter;
