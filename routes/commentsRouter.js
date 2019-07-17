const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors/errors");
const { patchCommentByCommentId } = require("../controllers/comments-c");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentByCommentId)
  .all(methodNotAllowed);

module.exports = commentsRouter;
