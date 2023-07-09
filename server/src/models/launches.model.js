const axios = require("axios");

const { aborted } = require("util");
const launches = require("./launches.schema");
const planets = require("./planets.schema");

const DEFAULT_FLIGHT_NUM = 1;

async function populateLaunches() {
  const res = await axios.post(process.env.SPACE_X_API, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (res.status !== 200) {
    console.log("Downloading Launch data  failed");
    throw new Error("Downloading Launch data  failed");
  }
  const launchDocs = res.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: new Date(launchDoc.date_local),
      customer: customers,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
    };

    console.log({ launch });
    await saveLaunch(launch);
  }
}

async function saveLaunch(launch) {
  console.log("saveLaunch");

  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function getLatesteFlightNum() {
  const latestFlight = await launches.findOne({}).sort("-flightNumber");
  console.log({ latestFlight });
  if (!latestFlight) {
    return DEFAULT_FLIGHT_NUM;
  }
  return latestFlight.flightNumber;
}
async function findLaunch(filter) {
  return await launches.findOne(filter);
}
async function exisitsLaunchById(id) {
  console.log("exisitsLaunchById");
  const exisitLaunch = await findLaunch({
    flightNumber: id,
  });
  console.log({ exisitLaunch });
  return exisitLaunch;
}

async function getAllLaunches(limit, skip) {
  console.log({ limit, skip });
  const res = await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(100)
    .limit(50);
  console.log({ res });
  return res;
}

async function scheduleNewLaunch(launch) {
  console.log("scheduleNewLaunch");
  const target = launch.target;
  const planet = planets.findOne({ keplerName: target });
  console.log({ planet });

  if (!planet) {
    throw new Error("No matching planet");
  }

  const newFlightNum = (await getLatesteFlightNum()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNum,
    upcoming: true,
    success: true,
    customer: ["yuto", "Yukiko"],
  });
  await saveLaunch(newLaunch);
}

async function abortLaunchById(id) {
  console.log("abortLaunchById");

  const deletResult = await launches.updateOne(
    { flightNumber: id },
    { upcoming: false, success: false }
  );
  console.log({ deletResult });
  return deletResult.modifiedCount === 1;
}

async function loadLaunchesData() {
  console.log("loadLaunchessData");
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
}

module.exports = {
  launches,
  getAllLaunches,
  scheduleNewLaunch,
  exisitsLaunchById,
  abortLaunchById,
  loadLaunchesData,
};
