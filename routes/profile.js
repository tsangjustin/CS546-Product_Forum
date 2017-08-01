const router = require('express').Router();

router.get('/', (req, res) => {
	if (!req.user) {
		return res.redirect('/');
	}
	const userInfo = {
		avatar: req.user.avatar,
		email: req.user.email,
		username:req.user.username,
	};
	return res.render('profile', userInfo);
});

module.exports = exports = router;
