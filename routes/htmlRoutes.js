module.exports = function(app) {
  
  app.get("/", function(req, res) {
		res.render("home");
  });
  
  app.get("/scrape", function(req, res) {
		res.render("scrape");
  });
};