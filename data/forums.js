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
    },
    searchForums(text, prices, labels) {
        text = (text && (typeof(text) === 'string') && text.length > 0) ? text.trim().toLowerCase() : undefined;
        let labelList = [];
        let priceList = [];
        if (labels && (Array.isArray(labels)) && (labels.length > 0)) {
            for (let l=0, lenLabels = labels.length; l < lenLabels; ++l) {
                let currLabel = labels[l];
                if (currLabel && (typeof(currLabel) === 'string')) {
                    currLabel = currLabel.trim();
                    if (currLabel.length > 0) {
                        labelList.push(currLabel)
                    }
                }
            }
        }
        const priceRange = (prices && (Array.isArray(prices)) && (prices.length > 0)) ? prices.forEach((priceRange) => {
            switch (priceRange) {
                case ('0-49'):
                    priceList.push([0, 49]);
                    break;
                case ('50-99'):
                    priceList.push([50, 99]);
                    break;
                case ('100-199'):
                    priceList.push([100, 199]);
                    break;
                case ('200-499'):
                    priceList.push([200, 499]);
                    break;
                case ('500-999'):
                    priceList.push([500, 999]);
                    break;
                case ('1000+'):
                    priceList.push([1000, undefined]);
                    break;
                default:
                    break;
            }
        }) : undefined;
        const searchQuery = {
            "$and": [],
        };
        if (text && typeof(text) === 'string' && text.length > 0) {
            const textFilter = {
                "$or": [
                    {
                        "title": new RegExp(text, "i"),
                        // title: {
                        //     "$regex": new RegExp("^" + text + "$", "i"),
                        //     // "$regex": "^" + text + "/",
                        //     // "$options": "i",
                        // },
                    },
                    {
                        "content": new RegExp(text, "i"),
                        // content: {
                        //     "$regex": new RegExp("^" + text + "$", "i"),
                        //     // "$regex": "^" + text + "$",
                        //     // "$options": "i",
                        // },
                    },
                    {
                        "clothing.$.name": new RegExp(text, "i"),
                        // "clothing.$.name": {
                        //     "$regex": new RegExp("^" + text + "$", "i"),
                        //     // "$regex": "^" + text + "/",
                        //     // "$options": "i",
                        // },
                    },
                ],
            }
            console.log(textFilter);
            searchQuery["$and"].push(textFilter);
        }
        if (labelList && (Array.isArray(labelList)) && (labelList.length > 0)) {
            searchQuery["$and"].push({
                "labels": { "$in": labelList },
            });
            // searchQuery["$or"].push({
            //     "labels": { "$in": labelList },
            // });
        }
        if (priceList && (Array.isArray(priceList)) && (priceList.length > 0)) {
            let priceFilter = {"$or": []};
            priceList.forEach((priceRange) => {
                if (priceRange.length == 2) {
                    priceFilter["$or"].push({
                        "clothing": {
                            "$elemMatch": {
                                "price": {
                                    "$gte": priceRange[0],
                                    "$lt": priceRange[1],
                                }
                            }
                        },
                    });
                } else {
                    priceFilter["$or"].push({
                        "clothing": {
                            "$elemMatch": {
                                "price": {
                                    "$gte": priceRange[0],
                                },
                            },
                        },
                    });
                }
            })
            searchQuery["$and"].push(priceFilter);
        }
        console.log(searchQuery);
        if (searchQuery["$and"].length <= 0) {
            return Promise.reject("Nothing to search");
        }
        return forums().then((forumCollection) => {
            // forumCollection.find(searchQuery, (err, result) => {
            //     if (err) {
            //         return Promise.reject(err);
            //     }
            //     let forums = [];
            //     result.each((err, forum) => {
            //         console.log(err);
            //         console.log(forum);
            //         forums.push(forum);
            //     });
            //     console.log(forums);
            //     return forums;
            // })
            return forumCollection.find(searchQuery).toArray();
        });
    }
}

module.exports = exportedMethods;
