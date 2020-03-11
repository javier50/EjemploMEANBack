'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var schema = mongoose.Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: {type: Schema.ObjectId, ref: 'Artist'}
});

schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Album', schema);