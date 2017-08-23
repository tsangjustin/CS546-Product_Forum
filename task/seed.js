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
    return forumData.addForum('Forum #1: Steph\'s Sneakers', 'Should I get #Suede Sneakers[http://www.hm.com/us/product/72665] or #Flame Vans[https://www.vans.com/shop/mens-shoes-classics/flame-sk8-hi-reissue-black-black-true-white]? Found these thanks to @Dillon!', ['Shoes'], user._id)
}).then(forum => {
	return forumData.addComment(forum._id, forum.user, "I love #Flame Vans[https://www.vans.com/shop/mens-shoes-classics/flame-sk8-hi-reissue-black-black-true-white]")
}).then(() => {
    console.log("Done seeding database");
    dbConn.close();
}).catch((error) => {
    console.error(error);
});