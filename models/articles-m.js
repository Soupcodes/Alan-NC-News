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
    .where({ article_id })
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        if (typeof inc_votes !== "number") {
          return Promise.reject({
            status: 400,
            msg: "Type error, please check your input"
          });
        } else {
          const newArticle = { ...article[0] };
          newArticle.votes += inc_votes;
          return newArticle;
        }
      }
    });
};

module.exports = { selectArticle, updateArticleVotes };
