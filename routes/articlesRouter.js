const articlesRouter = require("express").Router();
const { sendArticle, patchArticleVotes } = require("../controllers/articles-c");
const {
  sendCommentsByArticleId,
  postCommentByArticleId
} = require("../controllers/comments-c");
const { methodNotAllowed } = require("../errors/errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(patchArticleVotes)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(sendCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(methodNotAllowed);

module.exports = articlesRouter;
