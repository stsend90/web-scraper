require("dotenv");
const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");

const db = require("./models");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");



const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:heroku_0tc4sspl"
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};
mongoose.connect(MONGODB_URI,options);

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!")
});

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

module.exports = app;