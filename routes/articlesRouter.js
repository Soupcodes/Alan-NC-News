const articlesRouter = require("express").Router();
const { sendArticle, patchArticleVotes } = require("../controllers/articles-c");
const {
  sendCommentsByArticleId,
  postCommentByArticleId
} = require("../controllers/comments-c");

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(sendCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
