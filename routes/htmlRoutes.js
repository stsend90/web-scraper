const db = require("../models");

module.exports = function (app) {
    app.get("/", function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                console.log(dbArticle);
                res.render("index", {dbArticle});
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/saved", function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                console.log(dbArticle);
                res.render("saved", {dbArticle});
            })
            .catch(function (err) {
                res.json(err);
            });
    });
};