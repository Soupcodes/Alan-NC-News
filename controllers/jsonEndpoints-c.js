const { grabEndpoints } = require("../models/jsonEndpoints-m");

exports.sendJsonEndpoints = (req, res, next) => {
  grabEndpoints().then(endpoints => {
    res.status(200).send({ endpoints });
  });
};
