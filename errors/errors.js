exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ status: 404, msg: "Route not found" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ status: 404, msg: err.msg });
  } else if (err.status === 400) {
    res.status(400).send({ status: 400, msg: err.msg });
  } else next(err);
};

// exports.internalServerError = (err, req, res, next) => {
//   res.status(500).send({ status: 404, msg: err.msg });
// };
