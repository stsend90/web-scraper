const mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  summary: {
    type: String,
    unique: true
  },
  link: {
    type: String,
    unique: true,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Creates Article model from the above schema
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;