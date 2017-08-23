const router = require('express').Router();
const data = require("../data");
const forumsData = data.forums;

router.get('/', (req, res) => {
	let userInfo = req.locals || {};
	let userId = null;
	if (req.user) {
		userId = req.user._id;
	}
	forumsData.getForumByUser(userId)
	.then((forum) => {
		userInfo.forum = forum;
		return forumsData.getAllForums();
	})
	.then((communityForum) => {
		userInfo.communityForum = communityForum.sort((f1, f2) => {
            return (f1.createdOn < f2.createdOn) ? 1 : -1
        });
		return res.render('landingPage', userInfo);
	});
});


router.put('/', (req, res) => {
    let info = req.locals || {};
    // Can view forums without being authenticated
    const sort_by = req.query.sort_by || 'recent';
    console.log(sort_by);

    forumsData.getAllForums().then((forumList) => {
        info.forums = (forumList && (Array.isArray(forumList))) ? forumList : [];
        switch (sort_by) {
            case ('popular'):
                forumList.sort((f1, f2) => {
                    return (f1.likes.length < f2.likes.length) ? 1 : -1
                });
                break;
            case ('recent'):
            default:
                forumList.sort((f1, f2) => {
                    return (f1.createdOn < f2.createdOn) ? 1 : -1
                });
                break;
        }
        console.log(forumList)
        return res.json({forums: forumList});
    }).catch((err) => {
        return res.status(500).json({error: err});
    });
});


module.exports = exports = router;
