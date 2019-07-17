const connection = require("../db/connection");

const selectArticle = article_id => {
  return connection
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id })
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return article;
      }
    });
};

const updateArticleVotes = (article_id, inc_votes) => {
  return connection
    .select("*")
    .from("articles")
    .increment("votes", inc_votes)
    .where({ article_id })
    .returning("*")
    .then(article => {
      if (inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (!article.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return article;
      }
    });
};

module.exports = { selectArticle, updateArticleVotes };
