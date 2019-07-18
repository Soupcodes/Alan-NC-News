const endpoints = require("../endpoints.json");

exports.grabEndpoints = () => {
  return Promise.all([endpoints]).then(endpoints => {
    return endpoints[0];
  });
  // console.log(endpoints);
};
