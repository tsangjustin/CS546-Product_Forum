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
        return forums().then((forumCollection) => {
            let newId = uuidV4();
            // TODO date
            let newForum = {
                _id: newId,
                user: userId,
                // datePosted: curDate,
                title: title,
                content: content,
                label: label,
                clothing: clothing,
                likes: [],
                comments: []               
            };
            return forumCollection.insertOne(newForum)
                .then((forumInformation) => {
                    return exportedMethods.getForumById(newId);
                });
        });
    },
    addComment(forumId, userId, comment) {
        console.log("ADDING COMMENT")
        return forums().then((forumCollection) => {
            let newId = uuidV4();
            // TODO date
            let newComment = {
                _id: newId,
                // datePosted: curDate,
                content: comment,
                user: userId,
                likes: [],
                subthreads: []
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