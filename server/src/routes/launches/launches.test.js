const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
require("dotenv").config();
const testVer = process.env.CURRENT_VERSION;
describe("Test GET /launches", () => {
  beforeAll(async () => {
    await mongoConnect();
    // await loadPlanetsData();
  });

  // afterAll(async () => {
  //   await mongoDisconnect();
  // }); →newest ver. of mongoose doesn't need disconnect

  describe("Launch APIs TEST", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get(`/${testVer}/launch`)
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launch", () => {
    const completeObj = {
      mission: "addtest",
      rocket: "add rocket name",
      launchDate: "January 14, 2030",
      target: "Kepler-442 b",
      customer: ["yuto", "Yukiko"],
    };
    const { launchDate, ...objWithoutDate } = completeObj;
    test("it should respond with 201 status", async () => {
      const res = await request(app)
        .post(`/${testVer}/launch`)
        .send(completeObj)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeObj.launchDate).valueOf();
      const responseDate = new Date(res.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      console.log(res.body);

      expect(res.body).toMatchObject(objWithoutDate);
    });

    test("catching missing required property", async () => {
      const res = await request(app)
        .post(`/${testVer}/launch`)
        .send(objWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toStrictEqual({
        error: "Missing required property",
      });
    });
    test("catching invalid date", async () => {
      completeObj.launchDate = "test";
      const res = await request(app)
        .post(`/${testVer}/launch`)
        .send(completeObj)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
