'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema({
	number: String,
	name: String,
	duration: Number,
	file: String,
	album: {type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Song', schema);