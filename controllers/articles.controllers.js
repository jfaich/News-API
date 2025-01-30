const { get } = require("../app");
const {
  fetchArticleByArticleId,
  fetchArticles,
  fetchArticlesComments,
  addComment,
  makePatch,
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

const getArticlesComments = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticlesComments(article_id)
    .then((comments) => {
      response.status(200).send(comments);
    })
    .catch((error) => {
      next(error);
    });
};

const postComment = (request, response, next) => {
  const article_id = request.params.article_id;
  const comment = request.body;

  addComment(comment, article_id)
    .then(() => {
      response.status(201).send({ comment: comment });
    })
    .catch((error) => {
      next(error);
    });
};

const patchArticle = (request, response, next) => {
  const inc_votes = request.body.inc_votes;
  const article_id = request.params.article_id;
  makePatch(inc_votes, article_id)
    .then((result) => {
      const article = result[0];
      response.status(201).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getArticleById,
  getArticles,
  getArticlesComments,
  postComment,
  patchArticle,
};
