const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("./routes/apiRouter");
const {
  routeNotFound,
  handleCustomErrors,
  handleSqlErrors,
  handleInternalServerError
} = require("./errors/errors");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use("/*", routeNotFound);
app.use(handleCustomErrors);
app.use(handleSqlErrors);
app.use(handleInternalServerError);

module.exports = app;
