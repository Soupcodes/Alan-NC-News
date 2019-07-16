process.env.NODE_ENV = "test";
const app = require("./app");

const PORT = 9090;

app.listen(PORT, () => {
  console.log(`You are listening to ${PORT}`);
});
