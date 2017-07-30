const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
// Custom Helper with MongoDB
const userData = require('../data/').user;

function findUser(username) {
	return new Promise((fulfill, reject) => {
		if ((username) && (typeof(username) === 'string') && (username.length > 0)) {
			userData.getUser(username).then(user => {
				return fulfill(user);
			}).catch(err => {
				return reject(err);
			})
		} else {
			return reject('Invalid username and/or password');
		}
	});
}

module.exports = exports = (passport) => {
	passport.use(new LocalStrategy(
		(username, password, done) => {
			findUser(username).then((user) => {
				if (!user) {
					return done('Incorrect username');
				}
				bcrypt.compare(password, user.userPassword, (err, isEqual) => {
					if (err || !isEqual) {
						// TODO: Increment attempt and create a lockout feature
						return done('Invalid username and/or password');
					}
					return done(null, user);
				})
			}).catch((err) => {
				return done(err);
			})
		})
	);
};
