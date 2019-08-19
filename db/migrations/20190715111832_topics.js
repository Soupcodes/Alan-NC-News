exports.up = function(connectToDB) {
  return connectToDB.schema.createTable("topics", topicsTable => {
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
