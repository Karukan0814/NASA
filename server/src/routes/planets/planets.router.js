const express = require("express");
const planetsRouter = express.Router();
const { getAllPlantes } = require("../planets/planets.controller");

planetsRouter.get("/", (req, res) => {
  console.log("GET planets");
  getAllPlantes(req, res);
});

module.exports = planetsRouter;
