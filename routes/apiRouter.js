const apiRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics-c");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");

apiRouter.get("/topics", sendTopics);

apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
