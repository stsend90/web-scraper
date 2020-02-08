const db = require("../models/index");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
	app.get("/api/scrape", function(req, res) {
		axios.get("https://www.wsj.com/").then(function(res) {
			console.log(res.data);
			const $ = cheerio.load(res.data);
			$("article").each(function(i, element) {
				let title = $(element).find("h3").text();
				let summary = $(element).find("p").text();
				let link = $(element).find("a").attr("href");

				if (title && link) {
					db.Article.create({title: title, summary: summary, link: link})
					.then(data => console.log(data))
					.catch(err => console.log(err.message));
				}
			});
    	});
	});

	app.get("/api/articles", function(req, res) {
		db.Article.find({})
			.limit(10)
			.then(data => res.json(data))
			.catch(err => res.json(err));
	});
}