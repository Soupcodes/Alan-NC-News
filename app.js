const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "404 - Route not found" });
});

module.exports = app;
