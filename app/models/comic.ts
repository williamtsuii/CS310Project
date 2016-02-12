import {Document, Schema, Model} from 'mongoose';

let Comic: Schema = new Schema({
	image			: {data: Buffer, contentType: String},
	id				: String,
	title			: String,
	author			: {uid: String, username: String},
    collaborators	: [{uid: String, username: String}],
    synopsis		: String,
    comments		: [{ body: String, date: Date, user: String }],
    date 			: { type: Date, default: Date.now },
    hidden 			: Boolean,
});

export = Comic