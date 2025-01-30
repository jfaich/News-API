const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topics.controllers");
const {
  getArticleById,
  getArticles,
  getArticlesComments,
  postComment,
  patchArticle,
} = require("./controllers/articles.controllers");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticlesComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.use((error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.code === "23503") {
    response.status(404).send({ msg: `article not found` });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.code === "42703") {
    response.status(400).send({ msg: `incorrect input type for votes` });
  }
});

module.exports = app;
