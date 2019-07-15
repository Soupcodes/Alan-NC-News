const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(connectTo) {
  const topicsInsertions = connectTo("topics").insert(topicData);
  const usersInsertions = connectTo("users").insert(userData);

  return connectTo.migrate
    .rollback()
    .then(() => connectTo.migrate.latest())
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formattedArticles = formatDates(articleData);
      return connectTo
        .insert(formattedArticles)
        .into("articles")
        .returning("*");
    })
    .then(articleRows => {
      const articleRefObj = makeRefObj(articleRows);
      const formattedComments = formatComments(articleRefObj, commentData);
      return connectTo.insert(formattedComments).into("comments");
    });
};
