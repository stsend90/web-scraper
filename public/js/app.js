$(document).ready(function() {
    function showErrorModal(error) {
        $('#error').modal('show');
    };
    
    $("#alertModal").on('hide.bs.modal', function (e) {
        window.location.href = '/';
    });
    
    $("#scrape").on('click', function (event){
        event.preventDefault();
        $.ajax({
            url: "/scrape/",
            type: "GET",
            success: function (response) {
                $("#numArticles").text(response.count);
            },
            error: function (error) {
                showErrorModal(error);
            },
            complete: function (result){
                $("#alertModal").modal("show");
            }
        });
    });

    $("#save").on('click', function () {
        const articleId = $(this).attr("data-id");
        console.log(articleId);
        $.ajax({
            url: "/save/" + articleId,
            type: "GET",
            success: function (response) {
                window.location.href = '/';
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });
    
    $("#delete").on('click', function (event){
        event.preventDefault();
        let id = $(this).data("id");
        $.ajax({
            url: "/deleteArticle/" + id,
            type: "DELETE",
            success: function (response) {
                window.location.href = "/saved";
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });
    
    function showNote(element, articleId){
        let $title = $("<p>")
            .text(element.title)
            .addClass("noteTitle");
        let $deleteButton = $("<button>")
            .text("X")
            .addClass("deleteNote");
        let $note = $("<div>")
            .append($deleteButton, $title)
            .attr("data-note-id", element._id)
            .attr("data-article-id", articleId)
            .addClass("note")
            .appendTo("#noteArea");
    };
    
    function sendNote(element) {
        let note = {};
        note.articleId = $(element).attr("data-id"),
        note.title = $("#noteTitleEntry").val().trim();
        note.body = $("#noteBodyEntry").val().trim();
        if (note.title && note.body){
            $.ajax({
                url: "/createNote",
                type: "POST",
                data: note,
                success: function (response){
                    showNote(response, note.articleId);
                    $("#noteBodyEntry, #noteTitleEntry").val("");
                },
                error: function (error) {
                   showErrorModal(error);
                }
            });
        }
    };
    
    $("#addNote").on('click', function (){
        $("#noteArea").empty();
        $("#noteTitleEntry, #noteBodyEntry").val("");
        let id = $(this).data("id");
        $("#submitNote, #noteBodyEntry").attr("data-id", id);
        $.ajax({
            url: "/getNotes/" + id,
            type: "GET",
            success: function (data){
                $.each(data.notes, function (i, item){
                    showNote(item, id);
                });
                $("#noteModal").modal("show");
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });
    
    $("#submitNote").on('click', function (event) {
        event.preventDefault();
        sendNote($(this));
    });
    
    $("#noteBodyEntry").on('keypress', function (event) {
        if(event.keyCode === 13){
            sendNote($(this));
        }
    });
    
    $(document).on('click', ".deleteNote", function (event){
        event.stopPropagation();
        let thisItem = $(this);
        let ids= {
            noteId: $(this).parent().data("note-id"),
            articleId: $(this).parent().data("article-id")
        };
        $.ajax({
            url: "/deleteNote",
            type: "POST",
            data: ids,
            success: function (response) {
                thisItem.parent().remove();
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });
    
    $(document).on('click', ".note", function (event){
        event.stopPropagation();
        let id = $(this).data("note-id");
        $.ajax({
            url: "/getSingleNote/" + id,
            type: "GET",
            success: function (note) {
                $("#noteTitleEntry").val(note.title);
                $("#noteBodyEntry").val(note.body);
            },
            error: function (error) {
                console.log(error);
                showErrorModal(error);
            }
        });
    });
});