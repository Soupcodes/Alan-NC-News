exports.up = function(connectToDB) {
  return connectToDB.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.string("body", 10000).notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable
      .string("topic")
      .references("slug")
      .inTable("topics");
    articlesTable
      .string("author")
      .references("username")
      .inTable("users");
    articlesTable.timestamp("created_at").defaultTo(connectToDB.fn.now());
  });
};

exports.down = function(connectToDB) {
  return connectToDB.schema.dropTable("articles");
};
