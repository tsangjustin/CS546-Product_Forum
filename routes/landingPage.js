const router = require('express').Router();
const data = require("../data");
const forumsData = data.forums;

router.get('/', (req, res) => {
	let userInfo = {};
	let userId = null;
	if (req.user) {
		userInfo.avatar = req.user.avatar;
		userId = req.user._id;
	}
	forumsData.getForumByUser(userId)
	.then((forum) => {
		userInfo.forum = forum;
		return forumsData.getAllForums();
	})
	.then((communityForum) => {
		userInfo.communityForum  = communityForum
		return res.render('landingPage', userInfo);
	});
});

module.exports = exports = router;
