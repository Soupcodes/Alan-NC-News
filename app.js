const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const { routeNotFound, customErrors, sqlErrors } = require("./errors/errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use("/*", routeNotFound);
app.use(customErrors);
app.use(sqlErrors);

module.exports = app;
