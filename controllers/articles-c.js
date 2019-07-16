const { selectArticle } = require("../models/articles-m");

const sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id).then(article => {
    res.status(200).send({ article });
  });
};

module.exports = { sendArticle };
