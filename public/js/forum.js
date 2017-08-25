function likeComment(event, forumId, commentId) {
    console.log(forumId);
    console.log(commentId);
    $.ajax({
        'url': '/forums/' + forumId + '/comments/' + commentId + "/like",
        'type': 'PUT',
        'success': function(res) {
            console.log(res);
            $(event.target).children('p').text(res.likes.length);
            $(event.target).siblings('i').children('p').text(res.dislikes.length);
        },
        'error': function(err) {
            if (err) {
                // window.location.href = '/log_in';
                console.log(err);
            }
        },
        'dataType': 'json'
    })
}

function dislikeComment(event, forumId, commentId) {
    $.ajax({
        'url': '/forums/' + forumId + '/comments/' + commentId + "/dislike",
        'type': 'PUT',
        'success': function(res) {
            $(event.target).children('p').text(res.dislikes.length);
            $(event.target).siblings('i').children('p').text(res.likes.length);
        },
        'error': function(err) {
            if (err) {
                // window.location.href = '/log_in';
                console.log(err);
            }
        },
        'dataType': 'json'
    })
}

// This works...
function displayEdit() {
    $("#editForum").toggle();
    $("#viewForum").toggle();
}

$(document).ready(function() {
    $("#updateForum").click(function (event) {
        displayEdit();
        let forumId = $("#forumId").val();
        let title = $("#newForumTitle").val();
        let content = $("#newForumContent").val();
        let labels = null;
        $.ajax({
            'url': '/forums/' + forumId,
            'type': 'PUT',
            'success': function (res) {
                // TODO How to make the info update without refresh?
            },
            'error': function (err) {
                if (err) {
                    console.log(err);
                }
            },
            'data': {
                "title": title,
                "content": content,
                "labels": labels
            },
            'dataType': 'json'
        });
    });
    $("#deleteForum").click(function (event) {
        let forumId = $("#forumId").val();
        $.ajax({
            'url': '/forums/' + forumId,
            'type': 'DELETE',
            'success': function (res) {
                // TODO
                console.log("success")
            },
            'error': function (err) {
                if (err) {
                    console.log(err);
                }
            }
        });
    });

});