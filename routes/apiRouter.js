const apiRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics-c");

// console.log(sendTopics());

apiRouter.get("/topics", sendTopics);

module.exports = apiRouter;
