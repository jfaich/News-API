const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of 3 of the test data topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;

        expect(body).toEqual(testData.topicData);
        expect(body.length).toBe(3);
      });
  });
});

describe("GET /api/topics", () => {
  test("each returned topic should have a 'slug' and a 'description' property of the type string", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;

        body.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/topics", () => {
  test("responds with a 404 message when passed an incorrect string (topicss)", () => {
    return request(app).get("/api/topicss").expect(404);
  });
});
