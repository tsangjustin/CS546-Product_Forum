(function($) {
    var likeForumButton = $('#forum-like-button');
    var dislikeForumButton = $('#forum-dislike-button');
    console.log(forumId);

    likeForumButton.click(function(event) {
        $.ajax({
            'url': '/forums/' + forumId + '/like',
            'type': 'PUT',
            'success': function(res) {
                console.log(res);
                likeForumButton.siblings('span').text(res.likes.length);
                dislikeForumButton.siblings('span').text(res.dislikes.length);
            },
            'error': function(err) {
                if (err) {
                    // window.location.href = '/log_in';
                    console.log(err);
                }
            },
            'dataType': 'json'
        });
    });

    dislikeForumButton.click(function(event) {
        $.ajax({
            'url': '/forums/' + forumId + '/dislike',
            'type': 'PUT',
            'success': function(res) {
                console.log(res);
                likeForumButton.siblings('span').text(res.likes.length);
                dislikeForumButton.siblings('span').text(res.dislikes.length);
            },
            'error': function(err) {
                if (err) {
                    // window.location.href = '/log_in';
                    console.log(err);
                }
            },
            'dataType': 'json'
        });
    });
})(jQuery, forumId)

function redirectLogin() {
    window.location.href = '/log_in';
}

function likeComment(event, commentId) {
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

function dislikeComment(event, commentId) {
    console.log(forumId);
    console.log(commentId);
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
                console.log("Successfully updated forum " + forumId);
                if (res.title) {
                    $("#forumTitle").text(res.title);
                }
                if (res.content) {
                    $("#forumContent").text(res.content);
                }
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
                console.log("Successfully deleted forum " + forumId);
                window.location = res.redirect;
            },
            'error': function (err) {
                if (err) {
                    console.log(err);
                }
            }
        });
    });

});