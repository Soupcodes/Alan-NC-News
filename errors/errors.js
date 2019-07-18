exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ status: 404, msg: "Route not found" });
};

exports.methodNotAllowed = (req, res, next) => {
  res.sendStatus(405);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status === 404 || err.status === 400) {
    res.status(err.status).send({ status: err.status, msg: err.msg });
  } else next(err);
};

exports.handleSqlErrors = (err, req, res, next) => {
  const errCodes = ["23502", "23503", "22P02"];
  errCodes.map(code => {
    if (err.code === code) {
      res.status(400).send({ status: 400, msg: "Invalid Input Detected" });
    }
  });
  if (err.code === "42703") {
    res.status(400).send({ status: 400, msg: "Invalid Query Detected" });
  } else next(err);
};

exports.handleInternalServerError = (err, req, res, next) => {
  res.status(500).send({ status: 500, msg: "Internal Server Error" });
};
