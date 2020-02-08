$(document).ready(function() {
    $.get("/api/scrape").then(function(data) {    
      appendData(data)
      });
      $.get("/api/articles").then(function(data) {    
      appendData(data)
    });
});
  
function appendData (data) {
    for (let i = 0; i < data.length; i++) {
        $("#scrapedArticles").append(
            `
            <div data-_id="${data[i]._id}" class="card">
                <div class="card-header">
                    <h3>
                    <a class="article-link" target="_blank" href="${data[i].link}">${data[i].title}</a>
                    <a class="btn btn-primary">Add a note</a>
                    </h3>
                </div>
                <div class="card-body">${data[i].summary}</div>
            </div>
            `
        );
    }
}