const usersRouter = require("express").Router();
const { sendUser } = require("../controllers/users-c");
const { methodNotAllowed } = require("../errors/errors");

usersRouter
  .route("/:username")
  .get(sendUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
