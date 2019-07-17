const { selectArticle, updateArticleVotes } = require("../models/articles-m");

const sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then(newArticle => {
      res.status(200).send({ status: 200, msg: newArticle });
    })
    .catch(next);
};

module.exports = { sendArticle, patchArticleVotes };
