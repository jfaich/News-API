const db = require("../db/connection");

const fetchUsers = () => {
  const propertiesToFetch = "username, name, avatar_url";
  let SQLString = `SELECT ${propertiesToFetch} FROM USERS`;

  return db.query(SQLString).then((users) => {
    return { users: users.rows };
  });
};
module.exports = fetchUsers;
