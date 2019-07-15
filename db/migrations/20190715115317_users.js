exports.up = function(connectToDB) {
  return connectToDB.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .unique()
      .primary();
    usersTable.string("avatar_url");
    usersTable.string("name");
  });
};

exports.down = function(connectToDB) {
  return connectToDB.schema.dropTable("users");
};
