const connection = require("../db/connection");

const selectArticle = article_id => {
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes",
      "comment_id"
    )
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where({ "articles.article_id": article_id })
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        const selectedArticle = { ...article[0] };
        if (article[0].comment_id === null) {
          //this will set a default comment count to 0 if no comments have been posted to the article
          selectedArticle.comment_count = 0;
          delete selectedArticle.comment_id;
        } else {
          selectedArticle.comment_count = article.length;
          delete selectedArticle.comment_id;
        }
        return selectedArticle;
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
