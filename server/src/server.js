require("dotenv").config();

const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const { mongoConnect } = require("./services/mongo");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

async function startServer() {
  await mongoConnect();

  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();
