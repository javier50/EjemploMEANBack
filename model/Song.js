'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var schema = mongoose.Schema({
	number: String,
	name: String,
	duration: Number,
	file: String,
	album: {type: Schema.ObjectId, ref: 'Album'}
});

schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Song', schema);