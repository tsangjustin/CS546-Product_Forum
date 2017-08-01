const router = require('express').Router();

router.get('/', (req, res) => {
	let userInfo = {};
	if (req.user) {
		userInfo.avatar = req.user.avatar;
	}
	return res.render('landingPage', userInfo);
});

module.exports = exports = router;
