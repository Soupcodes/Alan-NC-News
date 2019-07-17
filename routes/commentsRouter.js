const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors/errors");
const {
  patchCommentByCommentId,
  removeComment
} = require("../controllers/comments-c");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentByCommentId)
  .delete(removeComment)
  .all(methodNotAllowed);

module.exports = commentsRouter;
