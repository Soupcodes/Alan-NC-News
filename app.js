const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const { routeNotFound, customErrors } = require("./errors/errors");

app.use("/api", apiRouter);

app.use("/*", routeNotFound);
app.use(customErrors);

module.exports = app;
