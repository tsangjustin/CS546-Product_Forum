const mongoCollections = require("../config/mongoCollections");
const forums = mongoCollections.forums;
const usersData = require("./users");

const uuidV4 = require("uuid/v4");

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
                return forum;
            });
        });
    },
    addForum(title, contents, label, clothing, userId) {
        // TODO validate contents
        return forums().then((forumCollection) => {
            newId = uuidV4();
            let newForum = {
                _id: newId,
                title: title,
                contents: contents,
                label: label,
                clothing: clothing,
                likes: [],
                comments: [],
                user: userId // username or userId?
            }
            return forumCollection.insertOne(newForum)
            .then((forumInformation) => {
                return exportedMethods.getForumById(newId);
            });
        });
    }
}

module.exports = exportedMethods;