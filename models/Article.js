const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Articleschema = new Schema({
  title: {
    type: String,
    required: true
  },
  texts: {
    type: String,
  },
  link: {
    type: String,
    unique: true,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

const Article = mongoose.model("Article", Articleschema);

module.exports = Article;