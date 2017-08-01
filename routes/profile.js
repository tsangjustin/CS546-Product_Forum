const router = require('express').Router();

router.get('/', (req, res) => {
	if (!req.user) {
		return res.redirect('/');
	}
	const userInfo = {
		avatar: req.user.avatar,
		username: req.user.username,
		email: req.user.email,
		gender: (req.user.isMale) ? "Male" : "Female",
	};
	console.log(userInfo);
	return res.render('profile/profile', userInfo);
});

module.exports = exports = router;
