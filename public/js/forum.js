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

function displayEdit() {
    $("#editForum").toggle();
    $("#viewForum").toggle();
}

function updateForum(event, forumId) {
    displayEdit();
    console.log("Update");
    let title = $("#newForumTitle").value;
    let content = $("#newForumContent").value;
    $.ajax({
        'url': '/forums/' + forumId,
        'type': 'PUT',
        'success': function(res) {
            // TODO
            console.log("success")
        },
        'error': function(err) {
            if (err) {
                console.log(err);
            }
        },
        'data': {
            "forumId": forumId,
            "title": title,
            "content": content
            // TODO clothing, labels
        },
        'dataType': 'json'
    });
}

function deleteForum(event, forumId) {
    $.ajax({
        'url': '/forums/' + forumId,
        'type': 'DELETE',
        'success': function(res) {
            // TODO
            console.log("success")
        },
        'error': function(err) {
            if (err) {
                console.log(err);
            }
        }
    });
}
}
