// Node modules
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express	   = require('express');
const session	   = require('express-session');
// Custom Middleware
const passport	   = require('./auth/');
const configRoutes = require('./routes');
const exhbs		   = require('./views');

let app = express();
// Log incoming requests
app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});
// Parse cookies and POST body
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Enable Cookie session
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge : 3600000 },
}));
// Enable Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Serve static files
exhbs(app, express.static(__dirname + '/public'));
// API routing
configRoutes(app);

// Enable API Server
const server = app.listen(3000, (err) => {
	if (err) {
		throw err;
	}
	const server_ip = server.address().address;
	const server_port = server.address().port;
	console.log(`Server running on ${server_ip}:${server_port}`);
});
