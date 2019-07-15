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
      // console.log(articleRows);

      /* 
  
      Your comment data is currently in the incorrect format and will violate your SQL schema. 
  
      Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
      
      You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
      */

      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return connectTo("comments").insert(formattedComments);
    });
};
