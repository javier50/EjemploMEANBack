'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: {type: Schema.ObjectId, ref: 'Artist'}
});

module.exports = mongoose.model('Album', schema);