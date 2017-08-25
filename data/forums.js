// Node Modules
const uuidV4 = require("uuid/v4");
// Custom Node Modules
const mongoCollections = require("../config/mongoCollections");
const forums = mongoCollections.forums;
const usersData = require("./users");
const clothingData = require("./clothing");

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

function getClothingInfo(content) {
    const matches = (content.match(/#([^\[]+)\[([^\]]+)\]/g) || [])
        .map(match => /#([^\[]+)\[([^\]]+)\]/g.exec(match))
        .map(match => ({
            name: match[1],
            url: match[2]
        }));
    return Promise.all(
        matches.map(match => clothingData.retrieveClothingInfo(match.url))
    ).then(clothing => {
        return clothing.map((cloth, index) => Object.assign(cloth, matches[index]));
    });
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
    addForum(title, content, labels, userId) {
        // Validate contents
        if (!isValidString(title)) {
            return Promise.reject('Invalid title for forum creation')
        }
        if (!isValidString(content)) {
            return Promise.reject('Invalid content for forum creation')
        }
        if (!labels || (!Array.isArray(labels))) {
            return Promise.reject('Invalid label(s) for forum creation')
        }
        if (!isValidString(userId)) {
            return Promise.reject('Invalid id for forum creation')
        }

        // TODO: Maybe check that id is valid first?
        return getClothingInfo(content)
        .then(clothing => {
            return forums()
            .then((forumCollection) => {
                const newForum = {
                    _id: uuidV4(),
                    user: userId,
                    createdOn: new Date(),
                    title,
                    content,
                    labels,
                    clothing,
                    likes: [],
                    dislikes: [],
                    comments: [],
                };
                return forumCollection.insertOne(newForum)
                .then(() => exportedMethods.getForumById(newForum._id));
            });
        });
    },
    updateForum(forumId, title, content, labels) {
        // Validate contents
        if (title && !isValidString(title)) {
            return Promise.reject('Invalid title for forum creation')
        }
        if (content && !isValidString(content)) {
            return Promise.reject('Invalid content for forum creation')
        }
        if (labels && (!Array.isArray(labels))) {
            return Promise.reject('Invalid label(s) for forum creation')
        }

        // Only update parameters that have been changed
        updateParam = {}
        if (title) {
            updateParam["title"] = title;
        }
        if (content) {
            updateParam["content"] = content;
        }
        if (labels) {
            updateParam["labels"] = labels;
        }
        return forums().then((forumCollection) => {
            forumCollection
                .update(
                    {_id: forumId}, 
                    { $set: updateParam}
                ).then((forumInformation) => {
                    console.log("Updated forum");
                    return exportedMethods.getForumById(forumId);
                }).catch((err) => {
                    return Promise.reject("Could not update forum");
                });
        });
    },
    deleteForum(forumId) {
        return forums().then((forumCollection) => {
            forumCollection
                .deleteOne({_id: forumId})
                .then(() => {
                    console.log("Delete forum");
                    return;
                }).catch((err) => {
                    return Promise.reject("Could not update forum");
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
                dislikes: [],
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
                return Promise.reject("Could not add comment");
            });
        });
    },
    likeComment(forumId, userId, commentId) {
        return new Promise((fulfill, reject) => {
            forums().then(forumColl => {
                // let newComment = {};
                // newComment[commentId] = {
                //     likes: commentId
                // };
                forumColl.update(
                    { _id: forumId, "comments._id": commentId },
                    {'$addToSet': { "comments.$.likes": userId } },
                    (err, updateInfo) => {
                        if (err) {
        					return reject(err);
        				}
        				const result = updateInfo.result;
        				if (result.n < 1) {
        					return reject('Unable find comment with matching comment id');
        				}
        				if (result.nModified < 1) {
        					return reject('Fail to update likes for comment');
        				}
                        // newComment = {};
                        // newComment[commentId] = {
                        //     dislikes: commentId
                        // };
                        forumColl.update(
                            {_id: forumId, "comments._id": commentId},
                            {'$pull': { "comments.$.dislikes": userId }},
                            (err, updateInfo) => {
                                if (err) {
                					return reject(err);
                				}
                				exportedMethods.getForumById(forumId).then((matchForum) => {
                                    for (let c=0, lenComments=matchForum.comments.length; c < lenComments; ++c) {
                                        const currComment = matchForum.comments[c];
                                        if (currComment._id === commentId) {
                                            return fulfill({
                                                likes: currComment.likes,
                                                dislikes: currComment.dislikes,
                                            });
                                        }
                                    }
                                    return reject('Fail to find matching comment id');
                				}).catch((err) => {
                					return reject(err);
                				});
                            }
                        );
                    }
                );
            }).catch((err) => {
                return reject(err);
            });
        });
    },
    dislikeComment(forumId, userId, commentId) {
        return new Promise((fulfill, reject) => {
            forums().then(forumColl => {
                forumColl.update(
                    { _id: forumId, "comments._id": commentId },
                    { '$addToSet': { "comments.$.dislikes": userId } },
                    (err, updateInfo) => {
                        if (err) {
        					return reject(err);
        				}
        				const result = updateInfo.result;
        				if (result.n < 1) {
        					return reject('Unable find comment with matching comment id');
        				}
        				if (result.nModified < 1) {
        					return reject('Fail to update dislikes for comment');
        				}
                        forumColl.update(
                            { _id: forumId, "comments._id": commentId },
                            { '$pull': { "comments.$.likes": userId } },
                            (err, updateInfo) => {
                                if (err) {
                					return reject(err);
                				}
                				exportedMethods.getForumById(forumId).then((matchForum) => {
                                    for (let c=0, lenComments=matchForum.comments.length; c < lenComments; ++c) {
                                        const currComment = matchForum.comments[c];
                                        if (currComment._id === commentId) {
                                            return fulfill({
                                                likes: currComment.likes,
                                                dislikes: currComment.dislikes,
                                            });
                                        }
                                    }
                                    return reject('Fail to find matching comment id');
                				}).catch((err) => {
                					return reject(err);
                				});
                            }
                        );
                    }
                );
            }).catch((err) => {
                return reject(err);
            });
        });
    },
}

module.exports = exportedMethods;
