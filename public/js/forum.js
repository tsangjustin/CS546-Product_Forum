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
            $(event.target).siblings('span').text(res.likes.length);
            $(event.target).closest('li').siblings('li').children('span').text(res.dislikes.length);
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
            console.log($(event.target).siblings('span'));
            $(event.target).siblings('span').text(res.dislikes.length);
            $(event.target).closest('li').siblings('li').children('span').text(res.likes.length);
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
