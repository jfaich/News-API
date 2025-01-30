const db = require("../db/connection");
const fetchTopics = require("./topics.models");

const fetchArticleByArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article ID ${article_id}`,
        });
      }
      return rows[0];
    });
};

const fetchArticles = () => {
  const propertiesToFetch =
    "articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url";

  let SQLString = `SELECT ${propertiesToFetch}, COUNT(comments.comment_id) ::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC`;

  return db.query(SQLString).then((result) => {
    return result.rows;
  });
};

const fetchArticlesComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article ID ${article_id}`,
        });
      }
      return rows;
    });
};

const addComment = (newComment, article_id) => {
  if (newComment.body.length === 0) {
    return Promise.reject({
      status: 400,
      msg: "Comment value not found",
    });
  }
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [newComment.username, newComment.body, article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const makePatch = (inc_votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + ${inc_votes} WHERE articles.article_id = ${article_id} RETURNING *`
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = {
  fetchArticleByArticleId,
  fetchArticles,
  fetchArticlesComments,
  addComment,
  makePatch,
};
