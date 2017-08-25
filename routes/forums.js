const router = require('express').Router();
const data = require("../data");
const forumsData = data.forums;

// View existing forums by most recent or most popular
router.get('/', (req, res) => {
    let info = req.locals || {};
    // Can view forums without being authenticated
    const sort_by = req.query.sort_by || 'recent';

    forumsData.getAllForums().then((forumList) => {
        // console.log(forumList)
        info.forums = (forumList && (Array.isArray(forumList))) ? forumList : [];
        switch (sort_by) {
            case ('recent'):
            default:
                forumList.sort((f1, f2) => {
                    return (f1.createdOn > f2.createdOn) ? 1 : -1
                });
                break;
        }
        // TODO sort forumList by param
        return res.render('forums', info);
    }).catch((err) => {
        return res.status(500).send();
    });
});

// Form to create a new user
router.get('/create', (req, res) => {
    let userInfo = req.locals || {}
    // console.log("user", req.user);
    // Must be authenticated to create forum
    if (!req.user) {
        // return res.status(403).send();
        return res.redirect('/log_in');
    }

    return res.render('forums/create', userInfo);
});

// Create a new forum
router.post('/', (req, res) => {
    // let userId = '717fd940-6d56-42f3-a08e-4bf15de7ee0d'; // FOR TESTING
    if (!req.user) {
        return res.status(400).json({error: 'No valid user session. Please log in'});
    }
    const userId = null;
    const title = req.body.title;
    const content = req.body.content;
    let labels = req.body.labels;
    const clothing = req.body.clothing || [];

    if (!title || !content || !userId) {
        // Invalid request, required parameters missing
        return res.status(400).send();
    }
    if (!labels) {
        labels = []
    } else {
        labels = labels.split(",");
    }

    forumsData.addForum(title, content, labels, userId)
        .then((newForum) => {
            return res.redirect(`/forums/${newForum._id}`);
        }).catch((err) => {
        // console.log("hi", err);
            return res.status(500).send();
        });
});

// View specific forum post
router.get('/:forum_id/', (req, res) => {
    let info = req.locals;
    forumsData.getForumById(req.params.forum_id)
        .then((forumData) => {
            info.forum = forumData;
            info.isOwner = (forumData.user === (req.user || {})._id);
            // console.log(info);
            info.forum.contentHTML = forumData.content
                .replace(/#([^\[]+)\[([^\]]+)\]/g, (match, name, url) => `<a target='_blank' alt='${name}' href='${url}'>${name}</a>`)
                .replace(/@([\w-]+)/g, (match, username) => `<a target='_blank' alt='${username}' href='#'>${username}</a>`);
            return res.render('forums/single', info);
        }).catch((err) => {
            return res.status(404).render('error/404.handlebars');
        });
});

// Update specific fields of forum
router.put('/:forum_id', (req, res) => {
    // TODO Confirm user
    let forumId = req.params.forum_id;
    let title = req.body.title;
    let content = req.body.content;
    let labels = req.body.labels;
    forumsData.updateForum(forumId, title, content, labels)
        .then((forumData) => {
            return res.redirect(`/forums/${forumId}`);
        }).catch((err) => {
            return res.status(404).render('error/404.handlebars');
        });
});

// Delete a forum
router.delete('/:forum_id', (req, res) => {
    // TODO Confirm User
    let forumId = req.params.forum_id;
    forumsData.deleteForum(forumId)
        .then((forumData) => {
            return res.redirect(`/forums`);
        }).catch((err) => {
            return res.status(404).render('error/404.handlebars');
        });
});

// Get a list comments for forum id
router.get('/:forum_id/comments', (req, res) => {

});

// Add comment to forum
router.post('/:forum_id/comments', (req, res) => {
    // Must be signed in to submit comment
    if (!req.user) {
        // TODO what should this behavior be?
        console.log("Not logged in!");
        return res.redirect('/log_in');
    }
    const forumId = req.params.forum_id;
    const userId = req.user._id;
    const comment = req.body.comment;

    forumsData.addComment(forumId, userId, comment)
        .then(() => {
            console.log("Added in route");
            return res.redirect(`/forums/${forumId}`);
        }).catch((err) => {
            console.log("Error in route");
            console.log(err);
            res.status(404).send();
            return res.redirect(`/forums/${forumId}`);
        });
});

// Get a comment by id for specific post
router.get('/:forum_id/comments/:comment_id', (req, res) => {

});

// Update a comment by id for specific post
router.put('/:forum_id/comments/:comment_id', (req, res) => {

});

// Shows all forum posts under specified clothing type
router.get('/:clothing_type', (req, res) => {

});

// Create a new forum under specific clothing type
router.post('/:clothing_type', (req, res) => {

});

// Update a comment by id for specific post
router.put('/:forum_id/comments/:comment_id/like', (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: "Invalid session"});
    }
    const forumId = req.params.forum_id;
    const userId = req.user._id;
    const commentId = req.params.comment_id;

    forumsData.likeComment(forumId, userId, commentId).then((newCommentLike) => {
        return res.json(newCommentLike);
    }).catch((err) => {
        console.log(err);
        res.status(404).json({error: err});
    });
});

router.put('/:forum_id/comments/:comment_id/dislike', (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: "Invalid session"});
    }
    const forumId = req.params.forum_id;
    const userId = req.user._id;
    const commentId = req.params.comment_id;

    forumsData.dislikeComment(forumId, userId, commentId).then((newCommentLike) => {
        return res.json(newCommentLike);
    }).catch((err) => {
        console.log(err);
        return res.status(404).json({error: err});
    });
});

module.exports = exports = router;
