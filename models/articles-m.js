const connection = require("../db/connection");

exports.selectArticleByArticleId = article_id => {
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
        return article[0];
      }
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid Input Detected" });
  } else if (typeof inc_votes !== "number" && inc_votes.length < 1) {
    inc_votes = 0;
  }
  return connection
    .select("*")
    .from("articles")
    .increment("votes", inc_votes)
    .where({ article_id })
    .returning("*")
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return article[0];
      }
    });
};

exports.selectArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  if (order === "asc" || order === "desc") {
    return connection
      .select(
        "articles.author",
        "title",
        "articles.article_id",
        "topic",
        "articles.created_at",
        "articles.votes"
      )
      .count({ comment_count: "comment_id" })
      .from("articles")
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .orderBy(sort_by, order)
      .groupBy("articles.article_id")
      .modify(query => {
        if (author) query.where({ "articles.author": author });
        if (topic) query.where({ "articles.topic": topic });
      })
      .then(articles => {
        if (!articles.length) {
          return Promise.reject({ status: 404, msg: "Articles not found" });
        } else {
          return articles;
        }
      });
  } else {
    return Promise.reject({ status: 400, msg: "Invalid order Input" });
  }
};
