var mongoose = require('mongoose');
var ComicSchema = new mongoose.Schema({
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
var Comic = mongoose.model('Comic', ComicSchema);
module.exports = Comic;
//# sourceMappingURL=comic.js.map