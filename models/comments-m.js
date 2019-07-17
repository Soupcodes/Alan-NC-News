const connection = require("../db/connection");

const selectCommentsByArticleId = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  if (order !== "asc" && order !== "desc") {
    order = "desc";
  }
  if (sort_by === "article_id" || sort_by === "author") {
    sort_by = "created_at";
  }
  return connection
    .select(
      "articles.article_id",
      "comment_id",
      "comments.votes",
      "comments.created_at",
      "comments.body",
      "articles.author"
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
      // else if (!sort_by || order) {
      //   console.log(sort_by, order, "WAT");
      //   // return Promise.reject({
      //   //   status: 400,
      //   //   msg: "Invalid Query Detected"
      //   // });
      // }
      return comments;
    });
};

const insertCommentByArticleId = ({ username, body }) => {
  const author = username;
  const formattedComment = { author, body };
  return connection
    .insert(formattedComment)
    .into("comments")
    .returning("body");
};

const updateComment = (comment_id, inc_votes) => {
  // console.log(comment_id, inc_votes);
  return connection
    .select("*")
    .from("comments")
    .increment("votes", inc_votes)
    .where({ comment_id })
    .returning("*")
    .then(comment => {
      if (inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (!comment.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else {
        return comment;
      }
    });
};

const delCommentFromDb = comment_id => {
  return connection
    .delete()
    .from("comments")
    .where({ comment_id })
    .returning("*");
  // .then(console.log);
};

module.exports = {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateComment,
  delCommentFromDb
};
