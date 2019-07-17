exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ status: 404, msg: "Route not found" });
};

exports.methodNotAllowed = (req, res, next) => {
  res.sendStatus(405);
};

//The majority of custom errors have appeared when sql tries to process data without the entirety of the information required or
exports.customErrors = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ status: 404, msg: err.msg });
  } else if (err.status === 400) {
    res.status(400).send({ status: 400, msg: err.msg });
  } else next(err);
};

exports.sqlErrors = (err, req, res, next) => {
  if (err.code === "23502") {
    console.log("23502");
    //Catches post requests where either the key-names are incorrect or are missing entirely
    res.status(400).send({ status: 400, msg: "Please check your input again" });
  }
  //Catches input VALUES or paramatric endpoints that do not adhere to the column types or rules (eg. not nullable) specified in the migrations files
  if (err.code === "23503") {
    res.status(400).send({ status: 400, msg: "Invalid Input Detected" });
  } else if (err.code === "22P02") {
    //Caught get comments by article_id where id wasn't a number
    res.status(400).send({ status: 400, msg: "Input Error Detected" });
  } else if (err.code === "42703") {
    res.status(400).send({ status: 400, msg: "Invalid Query Detected" });
  } else next(err);
};

exports.internalServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ status: 500, msg: "Internal Server Error" });
};
