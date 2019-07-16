const connection = require("../db/connection");

const selectArticle = article_id => {
  return (
    connection
      .select("*")
      //'author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count'
      .from("articles")
      .join("users", "articles.author", "users.username")
      .where({ article_id })
      .then(console.log)
  );

  //REMEMBER TO TOTAL COMMENTS ASSOCIATED WITH THE ARTICLE
};

module.exports = { selectArticle };
