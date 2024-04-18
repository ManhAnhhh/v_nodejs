const express = require("express");
const session = require("express-session");

const config = require("config");
const app = express();

// config view
app.set("views", config.get("app.view_folder"));
app.set("view engine", config.get("app.view_engine"));

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: config.get("app.session_key"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: config.get("app.session_secure") },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(config.get("app.static_folder")));
app.use(require("../apps/middlewares/cart"));
app.use(require("./middlewares/share"));
app.use(require(config.get("app.router")));
module.exports = app;
