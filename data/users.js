// Node Modules
const bcrypt = require("bcrypt");
const uuidV4 = require("uuid/v4");
// Custom Node Modules
const UserCollection = require("../config/mongoCollections").users;

/**
 * Function checks that a string given is string with some number of
 * characters
 *
 * @params  {string} str string value to check for validity
 * @return  true if the string is valid; otherwise, return false
 */
function isValidString(str) {
	if ((str === undefined) || (typeof(str) !== "string") || (str.length <= 0)) {
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

let user = exports = module.exports;

/**
 * Function takes a forumUser object and insert user into MongoDB
 *
 * @params {object} forumUser  object
 * @returns  Promise with success if inserted recipe into DB and return
 *			 recipe object; otherwise, return reject Promise with error
 */
user.createUser = (forumUser) => {
	return new Promise((success, reject) => {
		if ((forumUser === undefined) || (typeof(forumUser) !== 'object')) {
			return reject("Expecting recipe object with keys: username and password");
		}
		if (!isValidString(forumUser.username)) {
			return reject("Expect username for forum user");
		}
		if (!isMatchingPassword(forumUser.password)) {
			return reject("Expect password for forum user");
		}
		const userName = forumUser.username;
		const userPassword = bcrypt.hashSync(forumUser.password[0], 10);
		let _user = {
			_id: uuidV4(),
			userName,
			userPassword,
			userAvatar: forumUser.avatar || '/public/image/avatar.png',
	  	};
		console.log('Setting up new user');
		user.getUser(userName).then((existingUser) => {
			console.log(`${userName} already exists`);
			return reject('Username already exists');
		}).catch((err) => {
			UserCollection().then((userColl) => {
				userColl.insertOne(_user, (err, result) => {
					if (err) {
						return reject(err);
					}
					const insertResult = result.result;
					if ((!insertResult.ok) || (insertResult.n !== 1)) {
						return reject('Fail to insert user');
					}
					user.getUserById(_user._id).then((newUser) => {
						return success(newUser);
					}).catch((e) => {
						return reject(e);
					});
				});
			}).catch((err) => {
				return reject('Unable to create account. Please try again later...');
			});
		})
	});
}

/**
 * Function gets single query of matching _id
 *
 * @params {string} id of recipe _id
 * @returns  Promise with success if queried a matching recipe; otherwise,
 * 			 return reject with error
 */
user.getUser = (username) => {
	return new Promise((fulfill, reject) => {
		if (!isValidString(username)) {
			return reject("Invalid username");
		}
		UserCollection().then((userColl) => {
			userColl.findOne(
				{userName: username},
				(err, userItem) => {
					if (err) {
						console.log(err);
						return reject('Unable to get account. Please try again later...');
					}
					if (!userItem) {
						return reject('Invalid username');
					}
					return fulfill(userItem);
				}
			);
		}).catch((err) => {
			console.log(err);
			return reject('Unable to get account. Please try again later...');
		});
	});
}

/**
 * Function gets single query of matching _id
 *
 * @params {string} id of recipe _id
 * @returns  Promise with success if queried a matching recipe; otherwise,
 * 			 return reject with error
 */
user.getUserById = (id) => {
	return new Promise((success, reject) => {
		if (!isValidString(id)) {
			return reject("Invalid id to get user");
		}
		UserCollection().then((userColl) => {
			userColl.findOne(
				{_id: id},
				(err, userItem) => {
					if (err) {
						return reject(err);
					}
					if (!userItem) {
						return reject('Did not find user with matching id');
					}
					return success(userItem);
				}
			);
		}).catch((err) => {
			return reject(err);
		});
	});
}

user.updateRecipe = (id, changeUser) => {
	return new Promise((success, reject) => {
		if (!isValidString(id)) {
			return reject("Invalid uuid to get recipe");
		}
		if ((changeUser === undefined) || (typeof(changeUser) !== "object")) {
			return reject("Nothing to change for recipe");
		}
		const newRecipe = {};
		if (isValidString(changeUser.title)) {
			newRecipe.title = changeUser.title;
		}
		if (checkValidArray(changeUser.ingredients) && isValidIngredientsList(changeUser.ingredients)) {
			newRecipe.ingredients = changeUser.ingredients;
		}
		if (checkValidArray(changeUser.steps) && isValidStepsList(changeUser.steps)) {
			newRecipe.steps = changeUser.steps;
		}
		if ((Object.keys(newRecipe).length === 0) && (typeof(newRecipe) === 'object')) {
			return reject("Found nothing to update for recipe");
		}
		UserCollection().then((userColl) => {
			// foodColl.findAndModify(
			// 	{_id: id},
			// 	[],
			// 	{$set: changeRecipe},
			// 	{"new": true, "upsert": true},
			// 	(err, result) => {
			// 		if (err) {
			// 			return reject(err);
			// 		}
			// 		return success(result.value);
			// 	}
			// );
			userColl.update({_id: id}, {$set: newRecipe}, (err, updateInfo) => {
				if (err) {
					return reject(err);
				}
				const result = updateInfo.result;
				if (result.n === 0) {
					return reject("Did not find recipe with matching id");
				}
				if ((!result.ok) || (result.nModified < 1)) {
					return reject('Failed to update recipe');
				}
				recipe.getRecipe(id).then((recipeItem) => {
					return success(recipeItem);
				}).catch((err) => {
					return reject(err);
				});
			});
		}).catch((err) => {
			return reject(err);
		})
	});
}

user.deleteUser = (id, password) => {
	return new Promise((success, reject) => {
		if (!isValidString(id)) {
			return reject("Invalid id to get recipe");
		}
		foodRecipes().then((foodColl) => {
			foodColl.removeOne({_id: id}, (err, deletedInfo) => {
				if (err) {
					return reject(err);
				}
				if (deletedInfo.deletedCount < 1) {
					return reject('Could not find recipe with matching id to delete');
				}
				return success(id);
			});
		}).catch((err) => {
			return reject(err);
		})
	});
}
