const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const userData = require('../data/').user;
const forumData = require('../data/').forums;

let dbConn = undefined;
let firstUser = undefined;
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
    firstUser = user;
    return forumData.addForum('Forum #1: Steph\'s Sneakers', 'Should I get #Suede Sneakers[http://www.hm.com/us/product/72665] or #Flame Vans[https://www.vans.com/shop/mens-shoes-classics/flame-sk8-hi-reissue-black-black-true-white]? Found these thanks to @Dillon!', ['Shoes'], user._id)
}).then(forum => {
	return forumData.addComment(forum._id, forum.user, undefined, "I love #Flame Vans[https://www.vans.com/shop/mens-shoes-classics/flame-sk8-hi-reissue-black-black-true-white]")
}).then(forum => {
	return forumData.addComment(forum._id, forum.user, undefined, "I love #Suede Sneakers[http://www.hm.com/us/product/72665]")
}).then(forum => {
	// Add subcomment
	return forumData.addComment(forum._id, forum.user, forum.comments[0]._id, "Why do you love them?")
}).then(() => {
    // Test multiple links and labels with spaces
    return forumData.addForum('Jogger for winter. Which color?', 'Does this jogger look better in #blue[https://www.ae.com/men-aeo-hybrid-jogger-blue/web/s-prod/1122_3842_020?icid=AE:SectionImage:Mens:Joggers:ShopImage] or #gray[https://www.ae.com/men-aeo-hybrid-jogger-gray/web/s-prod/1122_3842_020?icid=AE:SectionImage:Mens:Joggers:ShopImage]?', ['jogger', 'American Eagle', 'blue', 'gray'], firstUser._id)
}).then(() => {
    return forumData.addForum('Need a winter shirt quick!!!', 'Is this a good vest #JCrew wool vest[https://www.jcrew.com/p/mens_category/sweaters/merino/italian-merino-wool-sweater-vest/G8239]?', ['wool', 'vest', 'JCrew'], firstUser._id)
}).then(() => {
    console.log("Done seeding database");
    dbConn.close();
}).catch((error) => {
    console.error(error);
});
