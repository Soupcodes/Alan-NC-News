exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ status: 404, msg: "Route not found" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ status: 404, msg: err.msg });
  } else next(err);
};
