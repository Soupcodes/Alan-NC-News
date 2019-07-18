const { selectTopics } = require("../models/topics-m");

const sendTopics = (req, res, next) => {
  selectTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

module.exports = { sendTopics };
