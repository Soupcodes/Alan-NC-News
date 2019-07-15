const ENV = process.env.NODE_ENV || "development";

const testData = require("./test-data");
const devData = require("./development-data");

const useData = {
  testData,
  devData
};

module.exports = useData[ENV];
