const app = require("./app");

const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

// app.listen(process.env.PORT || 9090, () => {
//   console.log(
//     "Express server listening on port %d in %s mode",
//     this.address().port,
//     app.settings.env
//   );
// });
