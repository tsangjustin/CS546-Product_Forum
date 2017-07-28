// Node Modules
const router = require('express').Router();
const bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');
// Custom Node Modules
const passport = require('../auth/');
const userData = require('../data/').user;

function isValidString(str) {
	if ((!str) || (typeof(str) !== 'string')  || (str.length <= 0)) {
		return false;
	}
	return true;
}

function isMatchingPassword(passwordList) {
	if (passwordList && Array.isArray(passwordList) && (passwordList.length == 2)) {
		for (let p = 0; p < 2; p++) {
			if (!isValidString(passwordList[p])) {
				return false;
			}
		}
		if (passwordList[0] === passwordList[1]) {
			return true;
		}
	}
	return false;
}

router.get('/sign_up/', (req, res) => {
	if (req.user) {
		return res.redirect('/');
	}
	let errorString = undefined;
	if (req.cookies.loginError) {
		errorString = req.cookies.loginError;
	}
	res.clearCookie('loginError');
	console.log(errorString);
	return res.render('auth/sign_up', {error: errorString});
});

router.post('/sign_up/', (req, res, next) => {
	const sign_up_user = req.body;
	console.log(sign_up_user);
	if (!isValidString(sign_up_user.username)) {
		res.cookie('loginError', 'Invalid username');
		return res.redirect('/sign_up');
	}
	if (!isMatchingPassword(sign_up_user.password)) {
		res.cookie('loginError', 'Invalid and/or non-matching password');
		return res.redirect('/sign_up');
	}
	userData.createUser(sign_up_user).then((user) => {
		req.login(user, (loginErr) => {
			if (loginErr) {
				res.cookie('loginError', loginErr);
				return res.redirect('/sign_up');
			}
			return res.redirect('/');
		});
	}).catch((err) => {
		console.log(err);
		res.cookie('loginError', err);
		return res.redirect('/sign_up');
	});
});

router.get('/log_in/', (req, res) => {
	if (req.user) {
		return res.redirect('/');
	}
	let errorString = undefined;
	if (req.cookies.loginError) {
		errorString = req.cookies.loginError;
	}
	res.clearCookie('loginError');
	console.log(errorString);
	return res.render('auth/log_in', {error: errorString});
});

router.post('/log_in/', (req, res, next) => {
	passport.authenticate('local', (err, user) => {
	    if (err) {
			res.cookie('loginError', err);
			return res.redirect('/log_in');
	    }
	    if (!user) {
			res.cookie('loginError', 'Authentication failed');
			return res.redirect('/log_in');
	    }
	    // ***********************************************************************
	    // "Note that when using a custom callback, it becomes the application's
	    // responsibility to establish a session (by calling req.login()) and send
	    // a response."
	    // Source: http://passportjs.org/docs
	    // ***********************************************************************
    	req.login(user, (loginErr) => {
			if (loginErr) {
				console.log(loginErr);
				res.cookie('loginError', loginErr);
				return res.redirect('/log_in');
			}
			return res.redirect('/');
		});
	})(req, res, next);
});

router.get('/log_out/', (req, res) => {
	req.logout();
	return res.redirect('/');
});

module.exports = exports = router
