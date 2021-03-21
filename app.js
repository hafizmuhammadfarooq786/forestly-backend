const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
var bodyParser = require("body-parser");
var cors = require("cors");
var port = process.env.PORT || 8888;
const logger = require("morgan");
const routes = require("./src/routes/index");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("express-promise")());

/* MONGODB Connection */
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const conn = mongoose.connection; // var connection: Connection => The default connection of the mongoose module.
conn.on("connected", () => {
  console.log("Connected with Database created successfully.");
});
conn.on("disconnected", () => {
  console.log("Disconnected, Successfully.");
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json(err.message);
});

routes.setup(app);
var http = require("http").Server(app);
http.listen(port);

console.log(`Server running on port: ${port}`);
module.exports = app;
