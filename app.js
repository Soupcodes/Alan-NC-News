const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const { routeNotFound, custom404s } = require("./errors/errors");

app.use("/api", apiRouter);

app.use("/*", routeNotFound);
app.use(custom404s);

module.exports = app;
