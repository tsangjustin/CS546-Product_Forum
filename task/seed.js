const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const userData = require('../data/').user;
const forumData = require('../data/').forums;

let dbConn = undefined;
dbConnection().then(db => {
	dbConn = db;
    return db.dropDatabase()
}).then(() => {
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
// Create forums
}).then((user) => {
    return forumData.addForum('Forum #1: Steph\'s Sneakers', 'Should I get these #Suede Sneakers[http://www.hm.com/us/product/72665]. Found it thanks to @Dillon', ['Shoes'], user._id)
}).then(() => {
    console.log("Done seeding database");
    dbConn.close();
}).catch((error) => {
    console.error(error);
});
