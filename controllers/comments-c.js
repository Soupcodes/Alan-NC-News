const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateComment,
  delCommentFromDb
} = require("../models/comments-m");

const sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  insertCommentByArticleId(article_id, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then(comment => {
      console.log({ comment });
      res.status(200).send({ comment });
    })
    .catch(next);
};

const removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  delCommentFromDb(comment_id)
    .then(deleted => {
      if (deleted.length > 0) {
        res.sendStatus(204);
      } else {
        return Promise.reject({
          status: 404,
          msg: "Comment not found, nothing was deleted"
        });
      }
    })
    .catch(next);
};

module.exports = {
  sendCommentsByArticleId,
  postCommentByArticleId,
  patchCommentByCommentId,
  removeComment
};
