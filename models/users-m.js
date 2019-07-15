const connection = require("../db/connection");

const selectUser = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username });
};

module.exports = { selectUser };
