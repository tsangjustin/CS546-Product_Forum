const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const userData = require('../data/').user;

let dbConn = undefined;
dbConnection().then(db => {
	dbConn = db;
    return userData.createUser({
		username: "Phil",
		password: ["password1", 'password1'],
		email: 'phil@stevens.edu',
		gender: 'male',
	});
}).then(() => {
	return userData.createUser({
		username: "Justin",
		password: ["123", '123'],
		email: 'justin@gmail.com',
		gender: 'male',
	});
}).then(() => {
	return userData.createUser({
		username: "Stephanie",
		password: ["1", '1'],
		email: 'steph@gmail.com',
		gender: 'female',
	});
}).then(() => {
    console.log("Done seeding database");
    dbConn.close();
}).catch((error) => {
    console.error(error);
});
