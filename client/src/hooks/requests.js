const SERVER_URL = process.env.REACT_APP_SERVER_URL;

async function httpGetPlanets() {
  // TODO: Once API is ready.
  const res = await fetch(`${SERVER_URL}/planets`);
  return res.json(); // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const res = await fetch(`${SERVER_URL}/launch`);
  const launches = res.json(); // Load planets and return as JSON.
  return launches;
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${SERVER_URL}/launch`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}
async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.

  try {
    return await fetch(`${SERVER_URL}/launch/${id}`, {
      method: "delete",
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
