var mongoose = require('mongoose');

module.exports = mongoose.model('Comic', {
    image : {data: Buffer, contentType: String},
    id: String,
    title:  String,
    author: {uid: String, username: String},
    collaborators: [{uid: String, username: String}],
    synopsis:   String,
    comments: [{ body: String, date: Date, user: String }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
});
