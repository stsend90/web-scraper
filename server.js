const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const handlebars = require("express-handlebars")

// Require Models
const Article = require("./models/Article.js")
const Note = require("./models/Note.js")

const PORT = 3000;

// Set Up Express
const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Setting up Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Setting up connection to Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
mongoose.connect(MONGODB_URI);

// Routes
app.get("/", function(req, res) {
    // If there's nothing in collection, scrape
    if (!MONGODB_URI.articles) {
        res.redirect("/scrape")
        return;
    // Else, show all
    } else {
        res.redirect("/all")
    }
});

// Scrape Route
app.get("/scrape", function(req, res) {
    axios.get("https://nintendoeverything.com/").then(function(res){
        const $ = cheerio.load(res.data);

        // Save desired info from scrape
        $(".row.text-left").each(function(index, value) {
            const title = $(this).find("h2").text().trim();
            const url = $(this).find("a").attr("href");
            const desc = $(this).find(".description").children("div.large-12").eq(1).children("p").eq(1).text();
            const image = $(this).find("img.attachment-large").attr("src");
            
            // Create object from variables
            let result = {
                "title": title,
                "url": url,
                "desc": desc,
                "image": image
            };

            // Create Article from schema
            Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err.message)
                });
        });
    })
    .then(res.redirect("/all"));
});

app.get("/all", function(req, res) {
    Article.find({}).then(function(dbArticle) {
    let articles = [];
        for (const el of dbArticle) {
            articles.push({ id: el._id, title: el.title, desc: el.desc, url: el.url, image: el.image });
        };
        res.render("index", { article: articles });
    });
});

app.get("/notes", function(req, res) {
    Note.find({})
        .then(function(dbNote){
            res.json(dbNote);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`)
});