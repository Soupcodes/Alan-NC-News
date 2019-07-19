const {
  selectArticleByArticleId,
  updateArticleVotes,
  selectArticles
} = require("../models/articles-m");

exports.sendArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByArticleId(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendArticles = (req, res, next) => {
  const { limit, p } = req.query;
  console.log(limit, p);
  selectArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
