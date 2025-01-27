const db = require("../db/connection");

const fetchTopics = () => {
  let SQLString = `SELECT * FROM topics`;
  return db.query(SQLString).then((result) => {
    return result.rows;
  });
};

module.exports = fetchTopics;
