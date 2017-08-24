const router = require('express').Router();
const data = require("../data");
const xss = require("xss");
const forumsData = data.forums;

// View existing forums by most recent or most popular
router.get('/', (req, res) => {
    let info = req.locals || {};
    // const sort_by = req.query.sort_by || 'recent';
    let searchFilters = {
        price: {},
        labels: {},
    };

    forumsData.getAllForums().then((forumList) => {
        forumList.sort((f1, f2) => {
            return (f1.createdOn > f2.createdOn) ? 1 : -1
        });
        info.forums = (forumList && (Array.isArray(forumList))) ? forumList : [];
        for (let f=0, lenForums = forumList.length; f < lenForums; ++f) {
            const currForum = forumList[f];
            // Check labels
            for (let l=0, lenLabels=(currForum.labels || []).length; l < lenLabels; ++l) {
                searchFilters.labels[currForum.labels[l]] = true;
            }
            // Check pricing filter
            const clothings = (currForum.clothing || []);
            for (let c=0, lenClothing=clothings.length; c < lenClothing; ++c) {
                const clothingPrice = clothings[c].price || -1;
                if (clothingPrice >= 0 && clothingPrice < 49.5) {
                    searchFilters.price['0-49'] = true;
                } else if (clothingPrice >= 49.5 && clothingPrice < 99.5) {
                    searchFilters.price['50-99'] = true;
                } else if (clothingPrice >= 99.5 && clothingPrice < 199.5) {
                    searchFilters.price['100-199'] = true;
                } else if (clothingPrice >= 199.5 && clothingPrice < 499.5) {
                    searchFilters.price['200-499'] = true;
                } else if (clothingPrice >= 499.5 && clothingPrice < 999.5) {
                    searchFilters.price['500-999'] = true;
                } else if (clothingPrice >= 999.5) {
                    searchFilters.price['1000+'] = true;
                }
            }
        }
        if (Object.keys(searchFilters.price).length > 0) {
            info.price = searchFilters.price;
        }
        if (Object.keys(searchFilters.labels).length > 0) {
            info.labels = searchFilters.labels;
        }
        console.log(info);
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
    let labels = req.body.labels;

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
        console.log("hi", err);
            return res.status(500).send();
        });
});

// Run search on community forums by filter
router.get('/search/', (req, res) => {
    console.log(req.query)
    const text = req.query.title || undefined;
    const prices = (req.query.prices || "").split(' ') || undefined;
    const labels = (req.query.labels || "").split(' ') || undefined;

    forumsData.searchForums(text, prices, labels).then((forumsQuery) => {
        const forumsInfo = {
            forums: forumsQuery,
            layout: false,
        };
        console.log(forumsInfo);
        // return res.json(forumsInfo);
        return res.render('forums/communityForums', forumsInfo);
    }).catch((err) => {
        return res.sendStatus(500);
    });
});

// View specific forum post
router.get('/:forum_id', (req, res) => {
    let info = req.locals;
    forumsData.getForumById(req.params.forum_id)
        .then((forumData) => {
            info.forum = forumData;
            console.log(info);
            info.helpers = {
                contentToHtml: (content) => {
                    return xss(content)
                    .replace(/#([^\[]+)\[([^\]]+)\]/g, (match, name, url) => `<a target='_blank' alt='${name}' href='${url}'>${name}</a>`)
                    .replace(/@([\w-]+)/g, (match, username) => `<a target='_blank' alt='${username}' href='#'>${username}</a>`);
                }
            }
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
        return res.redirect('/log_in');
    }
    forumId = req.params.forum_id;
    userId = req.user._id;
    comment = req.body.comment;

    forumsData.addComment(forumId, userId, comment)
        .then(() => {
            return res.redirect(`/forums/${forumId}`);
        }).catch((err) => {
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
