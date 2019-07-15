const { selectTopics } = require("../models/topics-m");

// console.log(selectTopics);

const sendTopics = (req, res, next) => {
  selectTopics().then(topics => {
    console.log(topics);
    res.status(200).send({ topics });
  });
};

module.exports = { sendTopics };
