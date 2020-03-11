'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var schema = mongoose.Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String,
	image: String
});

schema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', schema);