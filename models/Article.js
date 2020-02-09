const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const articeleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  blurb: {
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

const Article = mongoose.model("Article", articeleSchema);

module.exports = Article;