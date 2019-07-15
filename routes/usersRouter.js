const usersRouter = require("express").Router();
const { sendUser } = require("../controllers/users-c");

usersRouter.get("/:username", sendUser);

module.exports = usersRouter;
