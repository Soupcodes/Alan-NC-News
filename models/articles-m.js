const connection = require("../db/connection");

const selectArticleByArticleId = article_id => {
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

const selectArticles = ({
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

module.exports = {
  selectArticleByArticleId,
  updateArticleVotes,
  selectArticles
};
