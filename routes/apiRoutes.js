const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
  
  app.get("/api/scrape", function(req, res) {
    axios.get("https://pokemongohub.net/").then(function(response) {
      const $ = cheerio.load(response.data);

      $("div.item-details").each(function(i, element) {
        let result = {};

        result.title = $(element)
          .children("h3")
          .text();
        result.blurb = $(element)
          .children("div.td-excerpt")
          .text()
          .replace(/(?:\r\n|\r|\n)/g, "");
        result.link = $(element)
          .children("h3")
          .find("a")
          .attr("href");
        result.link = $(element)
          .children("h3")
          .find("a")
          .attr("href");

        db.article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    });
  });

  app.get("/api/articles", function(req, res) {
    db.article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.put("/api/articles/:id", function(req, res) {
    let saved;

    switch (req.body.saved) {
      case "false":
        saved = true;
        break;
      case "true":
        saved = false;
        break;
      default:
        break;
    }

    db.article.update({ _id: req.params.id }, { $set: { saved: saved } })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/api/articles/:id", function(req, res) {
    console.log("note connected");
    console.log(req.params.id);
    db.article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  app.post("/api/articles/:id", function(req, res) {
    db.note.create(req.body)
    console.log(req.body)
      .then(function(dbNote) {
        return db.article.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/api/saved", function(req, res) {
    db.article.find({ saved: true})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
};