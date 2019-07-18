const apiRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics-c");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const { methodNotAllowed } = require("../errors/errors");
const { sendJsonEndpoints } = require("../controllers/jsonEndpoints-c");

apiRouter
  .route("/")
  .get(sendJsonEndpoints)
  .all(methodNotAllowed);

apiRouter
  .route("/topics")
  .get(sendTopics)
  .all(methodNotAllowed);

apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
