const articlesRouter = require("express").Router();
const {
  sendArticleByArticleId,
  patchArticleVotes,
  sendArticles
} = require("../controllers/articles-c");
const {
  sendCommentsByArticleId,
  postCommentByArticleId
} = require("../controllers/comments-c");
const { methodNotAllowed } = require("../errors/errors");

articlesRouter
  .route("/")
  .get(sendArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(sendArticleByArticleId)
  .patch(patchArticleVotes)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(sendCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(methodNotAllowed);

module.exports = articlesRouter;
