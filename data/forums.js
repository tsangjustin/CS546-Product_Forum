// Node Modules
const uuidV4 = require("uuid/v4");
// Custom Node Modules
const mongoCollections = require("../config/mongoCollections");
const forums = mongoCollections.forums;
const usersData = require("./users");

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

let exportedMethods = {
    getAllForums() {
        return forums().then((forumCollection) => {
            return forumCollection.find({}).toArray();
        });
    },
    getForumById(id) {
        return forums().then((forumCollection) => {
            return forumCollection.findOne({_id: id}).then((forum) => {
                if (!forum) throw "Forum not found";
                console.log(forum);
                return forum;
            });
        });
    },
    getForumByUser(userId) {
        return forums().then((forumsCollection) => {
            return forumsCollection.find({user: userId}).toArray();
        });
    },
    addForum(title, content, label, clothing, userId) {
        // TODO validate contents
        if (!isValidString(title)) {
            return Promise.reject('Invalid title for forum creation')
        }
        if (!isValidString(content)) {
            return Promise.reject('Invalid content for forum creation')
        }
        if (!label || (!Array.isArray(label))) {
            return Promise.reject('Invalid label(s) for forum creation')
        }
        if (!isValidString(userId)) {
            return Promise.reject('Invalid id for forum creation')
        }
        // TODO: Maybe check that id is valid first?
        return forums().then((forumCollection) => {
            const newForum = {
                _id: uuidV4(),
                user: userId,
                createdOn: new Date(),
                title: title,
                content: content,
                label: label,
                clothing: clothing,
                likes: [],
                comments: [],
            };
            return forumCollection.insertOne(newForum)
                .then((forumInformation) => {
                    return exportedMethods.getForumById(newForum._id);
                });
        });
    },
    addComment(forumId, userId, comment) {
        return forums().then((forumCollection) => {
            const newComment = {
                _id: uuidV4(),
                datePosted: new Date(),
                content: comment,
                user: userId,
                likes: [],
                subthreads: [],
            };
            return forumCollection.update(
                { _id: forumId },
                { $push: { comments: newComment }}
            ).then((forumInformation) => {
                console.log("Added comment");
                return exportedMethods.getForumById(forumId);
            }).catch((err) => {
                // err is unhandled promise rejection???????
                console.log("Error");
                console.log(err);
                return reject("Could not add comment");
            });
        });
    }
}

module.exports = exportedMethods;
