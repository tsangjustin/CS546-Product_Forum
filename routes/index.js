const authRoutes = require('./auth');
const landingPageRoute = require('./landingPage');
const profileRoute = require('./profile');
const forumRoute = require('./forum');

module.exports = exports = (app) => {
	if (!app) {
		throw "Expecting Express application to app routing";
	}
	app.use('/profile', profileRoute);
	app.use('/forum', forumRoute);
	app.use('/', authRoutes);
	app.use('/', landingPageRoute);
	app.use('*', (req, res) => {
		let userInfo = {};
		if (req.user) {
			userInfo.avatar = req.user.avatar;
		}
		return res.status(404).render('error/404', userInfo);
	});
}
