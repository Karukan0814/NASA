const launchesModel = require("../../models/launches.model");
const { getPagenation } = require("../../services/query");
async function httpGetAllLaunches(req, res) {
  const { limit, skip } = getPagenation(req.query);
  console.log({ limit, skip });
  const launches = await launchesModel.getAllLaunches(limit, skip);
  console.log({ launches });

  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  //   if (launch.launchDate.toString() === "Invalid Date") {
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  console.log({ launch });

  await launchesModel.scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const id = Number(req.params.id);
  console.log({ id });
  if (!id) {
    return res.status(400).json({
      error: "Missing required id",
    });
  }

  const existLaunch = await launchesModel.exisitsLaunchById(id);
  console.log({ existLaunch });
  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await launchesModel.abortLaunchById(id);
  console.log({ aborted });
  return res.status(200).json(aborted);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
