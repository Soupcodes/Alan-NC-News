exports.up = function(connectToDB) {
  return connectToDB.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable
      .string("author")
      .references("username")
      .inTable("users");
    commentsTable
      .integer("article_id")
      .references("article_id")
      .inTable("articles");
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(connectToDB.fn.now());
    commentsTable.string("body");
  });
};

exports.down = function(connectToDB) {
  return connectToDB.schema.dropTable("comments");
};
