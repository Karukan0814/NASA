const planetsModel = require("../../models/planets.model");

async function getAllPlantes(req, res) {
  return res.status(200).json(await planetsModel.getAllPlanets());
}

module.exports = { getAllPlantes };
