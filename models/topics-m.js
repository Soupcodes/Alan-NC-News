const connection = require("../db/connection");

const selectTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*")
    .then(console.log);
};

module.exports = { selectTopics };
