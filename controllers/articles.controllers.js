const { get } = require("../app");
const {
  fetchArticleByArticleId,
  fetchArticles,
} = require("../models/articles.models");

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleByArticleId(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

const getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send(articles);
    })

    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, getArticles };
