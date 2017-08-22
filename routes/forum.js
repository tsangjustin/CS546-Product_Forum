const router = require('express').Router();

router.get('/create', (req, res) => {
	return res.render('forum/create');
});

module.exports = exports = router;
