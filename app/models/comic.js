var mongoose_1 = require('mongoose');
var Comic = new mongoose_1.Schema({
    image: { data: Buffer, contentType: String },
    id: String,
    title: String,
    author: { uid: String, username: String },
    collaborators: [{ uid: String, username: String }],
    synopsis: String,
    comments: [{ body: String, date: Date, user: String }],
    date: { type: Date, default: Date.now },
    hidden: Boolean
});
module.exports = Comic;
//# sourceMappingURL=comic.js.map