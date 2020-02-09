$(document).on("click", ".save", function() {

  const thisId = $(this).attr("id");
  $.ajax({
    method: "PUT",
    url: "/api/articles/" + thisId,
    data: {
      id: $(this).attr("id"),
      saved: $(this).attr("saved")
    }
  })
    .then(function(data) {
      console.log(data);
    });
});

$(document).on("click", ".read", function() {
});

$(document).on("click", ".note", function() {

  const thisId = $(this).attr("id");
  $(".submitNote").attr("note-id", thisId)

  $.ajax({
    method: "GET",
    url: "/api/articles/" + thisId
  })
    .then(function(data) {
      createModal(data)
    });
});

$(document).on("click", ".submitNote", function() {
  event.preventDefault()
  console.log("this works")

  const thisId = $(this).attr("note-id");
  console.log(thisId)

  $.ajax({
    method: "POST",
    url: "/api/articles/" + thisId,
    data: {
      title: $(".noteTitle").val(),
      body: $(".articleNote").val()
    }
  })
    .then(function(data) {
      $("#notes").hide()
      $(".noteTitle").val("")
      $(".articleNote").val("")
    });

});


function createCard(data) {

  for (let i = 0; i < data.length; i++) {  

      let thediv = $("<div>")
        .addClass("card w-100 m-3 p-3")
        .addClass("theCard")
        .addClass("align-top")
        .attr("style", "width: 18rem;")
        .attr("id", "cardBody")

      let divBody = $("<div>").addClass("card-body");

      let theTitle = $("<p>")
        .addClass("card-text")
        .html(`<h2>${data[i].title}</h2>`)

      let theBody = $("<p>")
        .addClass("card-text")
        .html(data[i].blurb ? `${data[i].blurb}` : `<p>Sorry! No Summary Available</p> `)

      const saveBtn = $("<button>")
        .attr("id", data[i]._id)
        .attr("saved", data[i].saved)
        .addClass("save")
        .addClass("btn btn-warning")
        .addClass("btn-sm")
        .html(data[i].saved ? " Remove Article " :  " Save Article ")

      const readBtn = $("<button>")
        .addClass("ml-2 mr-2")
        .addClass("read")
        .addClass("btn-sm")
        .addClass("btn btn-warning")
        .html(`<a href="${data[i].link}" target="blank">${"Read More"}</a>`)

      const noteBtn = $("<button>")
        .attr("id", data[i]._id)
        .addClass("note")
        .addClass("btn btn-warning")
        .addClass("btn-sm")
        .html(" Create Note ")
 
      let applySave = $("<td class='align-middle'>").html(saveBtn);
      let applyRead = $("<td class='align-middle'>").html(readBtn);
      let applyNote = $("<td class='align-middle'>").html(noteBtn);
      
      thediv.append(divBody, theTitle, theBody, applySave, applyNote, applyRead);
  
      $(".articles").append(thediv)
      }   
  };
  


function createModal(project) {
  console.log(project)

  $("#project-modal").remove()

      let modal = $("<div>").addClass("modal fade")
          .attr("id" , "project-modal")
          .attr("tabindex", "-1")
          .attr("role", "dialog")
          .attr("aria-labelledby", "exampleModalCenterTitle")
          .attr("aria-hidden", "true")
      let modalDialog = $("<div>").addClass("modal-dialog modal-dialog-centered")
          .attr("role", "document")
      let modalContent = $("<div>").addClass("modal-content")
      let modalHeader = $("<div>").addClass("modal-header theModal")
          .html(`<h5 class="modal-title" id="exampleModalLongTitle">${project.title}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                      </button>`)
      let modalBody = $("<div>").addClass("modal-body")

      let modalText = $("<div>").html(`<br>${project.blurb}<br><br>
                      Read the full article, <a href="${project.link}" target="blank">click here</a>.<br><br>
                      `)
                      .appendTo(modalBody)

      let modalForm = $("<div>").addClass("form-group")
                      .html(`<label>Note Title</label><br>
                      <input class="form-control noteTitle" type="text"><br>
                      <label>Your Thoughts</label><br>
                      <textarea class="form-control articleNote" rows="3"></textarea><br>
                      `)
                      .appendTo(modalBody)
                      
      let modalFooter = $("<div>").addClass("modal-footer theModal")
          .html(`
          <button type="button" class="btn btn-secondary submitNote" data-dismiss="modal" note-id=${project._id}>Submit</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          `)
       
      modalContent.append(modalHeader, modalBody, modalFooter);
      modalDialog.append(modalContent);
      modal.append(modalDialog);
      $("body").append(modal);

      if (project.note) {
        $(".noteTitle").val(project.note.title);
        $(".articleNote").val(project.note.body);
      }

      $("#project-modal").modal('show')
}