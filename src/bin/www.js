// có 2 cách để require
const app = require(`${__dirname}/../apps/app`);
// const app = require("../apps/app");

const config = require("config");
const server = app.listen((port = config.get("app.port")), (req, res) => {
  console.log(`Sersver running on port ${port}`);
});
