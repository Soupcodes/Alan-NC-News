const { selectCommentsByArticleId } = require("../models/comments-m");

const sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then(comments => {
      res.status(200).send({ status: 200, msg: comments });
    })
    .catch(next);
};

module.exports = { sendCommentsByArticleId };
