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
	ret = {
		userInfo: userInfo
	}
	forumsData.getForumByUser(userId)
	.then((forum) => {
		ret.forum = forum;
		return forumsData.getAllForums();
	})
	.then((communityForum) => {
		ret.communityForum  = communityForum
		return res.render('landingPage', ret);
	});
});

module.exports = exports = router;
