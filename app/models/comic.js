var mongoose = require('mongoose');

module.exports = mongoose.model('Comic', {
    id: String,
    title:  String,
    author: String,
    collaborators: String,
    synopsis:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
});
