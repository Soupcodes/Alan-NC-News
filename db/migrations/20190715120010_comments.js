exports.up = function(connectToDB) {
  return connectToDB.schema.createTable("comments", commentsTable => {
    commentsTable
      .increments("comment_id")
      .primary()
      .unsigned();
    commentsTable
      .string("author")
      .references("username")
      .inTable("users")
      .notNullable();
    commentsTable
      .integer("article_id")
      .references("article_id")
      .inTable("articles")
      .onDelete("CASCADE")
      .unsigned();
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(connectToDB.fn.now());
    commentsTable.string("body", 750).notNullable();
  });
};

exports.down = function(connectToDB) {
  return connectToDB.schema.dropTable("comments");
};
