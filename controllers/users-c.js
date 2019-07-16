const { selectUser } = require("../models/users-m");

const sendUser = (req, res, next) => {
  const { username } = req.params;
  selectUser(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { sendUser };
