'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var schema = mongoose.Schema({
	number: String,
	name: String,
	duration: String,
	file: String,
	album: {type: mongoose.Schema.ObjectId, ref: 'Album'}
});

schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Song', schema);
