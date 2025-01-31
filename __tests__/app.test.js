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

describe("GET /api/articles/:article_id", () => {
  test("should respond with an article with the correct properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const body = response.body;
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 2,
          author: "icellusedkars",
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("rejects and returns error message when article is not found", () => {
    return request(app)
      .get("/api/articles/2000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No article found for article ID 2000");
      });
  });

  test("rejects and returns error message when article is invalid", () => {
    return request(app)
      .get("/api/articles/twothousand")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.length).toBe(13);
      });
  });

  test("should not have a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const body = response.body;
        body.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("should be sorted by created_at date in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        const body = response.body;

        expect(body).toBeSorted({ descending: true, key: "created_at" });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments from the correct article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.length).toBe(11);
      });
  });
  test("should be sorted by created_at date in descending order ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then((response) => {
        const body = response.body;

        expect(body).toBeSorted({ descending: true, key: "created_at" });
      });
  });
  test("each comment should have the correct properties and values", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const body = response.body;
        body.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("returns error message when article has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No comments found for article ID 4");
      });
  });
  test("returns bad request when parametric endpoint is not the right type", () => {
    return request(app)
      .get("/api/articles/four/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with a posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "rogersop",
        body: "This is the best article I've read for a while!",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.comment.username).toBe("rogersop");
        expect(response.body.comment.body).toBe(
          "This is the best article I've read for a while!"
        );
      });
  });

  test("should respond with a bad request when passed no body value", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "rogersop",
        body: "",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Comment value not found");
      });
  });

  test("should respond with a not found when the article doesn't exist", () => {
    return request(app)
      .post("/api/articles/10000/comments")
      .send({
        username: "rogersop",
        body: "This is the best article I've read for a while!",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with a posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "rogersop",
        body: "This is the best article I've read for a while!",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.comment.username).toBe("rogersop");
        expect(response.body.comment.body).toBe(
          "This is the best article I've read for a while!"
        );
      });
  });
});

describe("PATCH /api/articles/:article_id/", () => {
  test("should update article votes property when votes increase", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 100,
      })
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article.votes).toBe(200);
      })
      .then(() => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: 150,
          })
          .then((secondResponse) => {
            expect(secondResponse.body.article.votes).toBe(350);
          });
      });
  });
  test("should update article votes property when votes decreases", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -10,
      })
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article.votes).toBe(90);
      });
  });
  test("should respond with an article with the correct properties", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -10,
      })
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 90,
          article_img_url: expect.any(String),
        });
      });
  });
  test("should respond with bad request when votes count is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: "FOUR",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("incorrect input type for votes");
      });
  });
});

describe("DELETE /api/comments/comment_id", () => {
  test("returns a 204 status and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("returns a 400 status with a bad request status and no content", () => {
    return request(app).delete("/api/comments/four").expect(400);
  });
  test("returns a 404 status when the requested comment is not found", () => {
    return request(app)
      .delete("/api/comments/100000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "No comment found for comment ID 100000"
        );
      });
  });
});
