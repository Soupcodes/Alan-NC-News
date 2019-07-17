const {
  selectCommentsByArticleId,
  insertCommentByArticleId
} = require("../models/comments-m");

const sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
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
    .catch(
      next
      // err => {
      //   console.log(err);
      // }
    );
};

module.exports = { sendCommentsByArticleId, postCommentByArticleId };
