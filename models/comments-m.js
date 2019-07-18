const connection = require("../db/connection");

const selectCommentsByArticleId = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  if (order === "asc" || order === "desc") {
    if (sort_by === "article_id") {
      sort_by = "created_at";
    }
    return connection
      .select(
        "articles.article_id",
        "comment_id",
        "comments.votes",
        "comments.created_at",
        "comments.body",
        "comments.author"
      )
      .from("articles")
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .join("users", "users.username", "articles.author")
      .where({ "articles.article_id": article_id })
      .orderBy(sort_by, order)
      .then(comments => {
        if (!comments.length) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        }
        return comments;
      });
  } else {
    return Promise.reject({ status: 400, msg: "Invalid order Input" });
  }
};

const insertCommentByArticleId = (article_id, req) => {
  if (!req.username) {
    return Promise.reject({
      status: 400,
      msg: "Post error, please try again"
    });
  } else if (!req.body) {
    return Promise.reject({
      status: 400,
      msg: "Post error, please try again"
    });
  } else if (Object.keys(req).length > 2 || !req.body.length) {
    return Promise.reject({
      status: 400,
      msg: "Post error, please try again"
    });
  } else {
    const { username, body } = req;
    const author = username;
    const formattedComment = {
      article_id,
      author,
      body
    };
    return connection
      .insert(formattedComment)
      .into("comments")
      .where({
        "comments.article_id": article_id
      })
      .returning("*")
      .then(comment => {
        return comment[0];
      });
  }
};

const updateComment = (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else if (typeof inc_votes !== "number" && inc_votes.length < 1) {
    inc_votes = 0;
  }
  return connection
    .select("*")
    .from("comments")
    .increment("votes", inc_votes)
    .where({ comment_id })
    .returning("*")
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else {
        return comment[0];
      }
    });
};

const delCommentFromDb = comment_id => {
  return connection
    .delete()
    .from("comments")
    .where({ comment_id })
    .returning("*");
};

module.exports = {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateComment,
  delCommentFromDb
};
