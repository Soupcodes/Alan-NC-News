const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateComment
} = require("../models/comments-m");

const sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  // console.log(req.query);
  selectCommentsByArticleId(article_id, req.query)
    .then(comments => {
      res.status(200).send({ status: 200, msg: comments });
    })
    .catch(next);
};

const postCommentByArticleId = (req, res, next) => {
  insertCommentByArticleId(req.body)
    .then(comment => {
      res.status(201).send({ msg: comment[0] });
    })
    .catch(next);
};

const patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes).then(newComment => {
    res.status(200).send({ status: 200, msg: newComment });
  });
};

module.exports = {
  sendCommentsByArticleId,
  postCommentByArticleId,
  patchCommentByCommentId
};
