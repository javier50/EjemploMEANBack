'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var schema = mongoose.Schema({
	name: String,
	description: String,
	image: String
});

schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Artist', schema);