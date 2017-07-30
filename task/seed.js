const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const userData = require('../data/').user;

let dbConn = undefined;
dbConnection().then(db => {
	dbConn = db;
    return userData.createUser({username: "Phil", password: ["password1", 'password1']});
}).then(() => {
	return userData.createUser({username: "Justin", password: ["123", '123']});
}).then(() => {
    console.log("Done seeding database");
    dbConn.close();
}).catch((error) => {
    console.error(error);
});
