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
