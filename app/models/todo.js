var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
	text : {type : String, default: ''}
});

module.exports = mongoose.model('Image', {
	image : {data : Buffer, contentType : String},
    title : {type : String, default: ''},
    author : [String],
    tags  : [String]
});