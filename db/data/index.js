const ENV = process.env.NODE_ENV || "development";

const test = require("./test-data");
const development = require("./development-data");

const useData = {
  test,
  development,
  production: development
};

module.exports = useData[ENV];
