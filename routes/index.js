const authRoutes = require('./auth');
const landingPageRoute = require('./landingPage');

module.exports = exports = (app) => {
	if (!app) {
		throw "Expecting Express application to app routing";
	}
	app.use('/', authRoutes);
	app.use('/', landingPageRoute);
	app.use('*', (req, res) => {
		return res.status(404).render('error/404');
	});
}
