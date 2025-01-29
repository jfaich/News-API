const db = require("../db/connection");

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

module.exports = {
  fetchArticleByArticleId,
  fetchArticles,
};
