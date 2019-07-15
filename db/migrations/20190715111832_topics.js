// const connectToDB = require("knex");

exports.up = function(connectToDB) {
  return connectToDB.schema.createTable("topics", topicsTable => {
    // topicsTable.increments("topic_id");
    topicsTable
      .string("slug")
      .unique()
      .primary();
    topicsTable.string("description");
  });
};

exports.down = function(connectToDB) {
  return connectToDB.schema.dropTable("topics");
};
