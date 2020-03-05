'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema({
	name: String,
	description: String,
	image: String
});

module.exports = mongoose.model('Artist', schema);