const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

module.exports = function (app) {

app.get("/scrape", function (req, res) {
  axios.get("https://blog.hackerrank.com/").then(function (response) {
    let $ = cheerio.load(response.data);
    $("ul.blog-list").children().each(function (i, element) {
      let result = {};
      result.title = $(this).find("a").text();
      result.link = $(this).find("a").attr("href");
      result.text = $(this).find("p").text();
      db.Article.create(result).then(function (dbArticle) {
        console.log(dbArticle);
      })
      .catch(function (err) {
        console.log(err);
      });
    });
    res.redirect("/");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({}).then(function (dbArticle) {
    res.json(dbArticle);
  })
  .catch(function (err) {
    res.json(err);
  });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get('/save/:id', function (req, res) {
  db.Article.update({_id: req.params.id}, {saved: true})
    .then(function (result) {
      res.redirect('/')
    })
    .catch(function(err) {
      res.json(err)
    });
});

app.delete('/deleteArticle/:id', function(req, res){
  db.Article.remove({_id: req.params.id})
    .then(function(result) {
      res.json(result)
    })
    .catch(function(err) {
      res.json(err)
    });
});

app.get("/getNotes/:id", function (req, res){
  db.Article.findOne({_id: req.params.id})
    .populate("notes")
    .then(function(results) {
      res.json(results)
    })
    .catch(function(err) {
      res.json(err)
    });
});

app.get("/getSingleNote/:id", function (req, res) {
  db.Note.findOne({_id: req.params.id})
    .then(function(result) {
      res.json(result)
    })
    .catch(function(err) {
    res.json(err)
    });
});

app.post("/createNote", function (req, res){
  let { title, body, articleId } = req.body;
  let note = {
    title,
    body
  };
  db.Note.create(note)
    .then(function(result) {
      db.Article.findOneAndUpdate({_id: articleId}, {$push:{notes: result._id}}, {new:true})
        .then(function(data) {
          res.json(result)
        })
        .catch(function(err) {
          res.json(err)
        });
    })
    .catch(function(err) {
      res.json(err)
    });
});

app.post("/deleteNote", function(req, res) {
  let {articleId, noteId} = req.body;
  db.Note.remove({_id: noteId})
    .then(function(result) {
      res.json(result)
    })
    .catch(function(err) {
      res.json(err)
    });
});

};