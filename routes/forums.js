const router = require('express').Router();
const data = require("../data");
const forumsData = data.forums;

// View existing forums by most recent or most popular
router.get('/', (req, res) => {
    let info = req.locals || {};
    console.log("user", req.user);
    // Can view forums without being authenticated
    let sort_by = req.query.sort_by;
    if (!sort_by) {
        // Default
        sort_by = "recent";
    }

    forumsData.getAllForums().then((forumList) => {
        // TODO ensure forumList is JSON
        // TODO sort forumList by param
        console.log(forumList)
        info.forums = forumList;
        return res.render('forums', info);
    }).catch((err) => {
        return res.status(500).send();
    });
});

// Form to create a new user
router.get('/create', (req, res) => {
    let userInfo = req.locals || {}
    console.log("user", req.user);
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
    let userId = null;
    if (req.user) {
        userId = req.user._id;
    }
    let title = req.body.title;
    let content = req.body.content;
    let label = req.body.label;
    let clothing = req.body.clothing;

    if (!title || !content || !userId) {
        // Invalid request, required parameters missing
        return res.status(400).send();
    }
    if (!label) {
        label = []
    }
    if (!clothing) {
        clothing = []
    }

    forumsData.addForum(title, content, label, clothing, userId)
        .then((newForum) => {
            return res.redirect(`/forums/${newForum._id}`);
        }).catch((err) => {
            return res.status(500).send();
        });
});

// View specific forum post
router.get('/:forum_id', (req, res) => {
    let info = req.locals;
    forumsData.getForumById(req.params.forum_id)
        .then((forumData) => {
            info.forum = forumData;
            console.log(info);
            return res.render('forums/single', info);
        }).catch((err) => {
            return res.status(404).send();
        });

});

// Update specific fields of forum
router.put('/:forum_id', (req, res) => {

});

// Delete a forum
router.delete('/:forum_id', (req, res) => {

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
    forumId = req.params.forum_id;
    userId = req.user._id;
    comment = req.body.comment;

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





module.exports = exports = router;
