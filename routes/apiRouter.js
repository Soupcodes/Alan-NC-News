const apiRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics-c");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const { methodNotAllowed } = require("../errors/errors");

apiRouter
  .route("/topics")
  .get(sendTopics)
  .all(methodNotAllowed);

apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
