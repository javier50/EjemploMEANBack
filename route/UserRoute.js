'use strict';

var express = require('express');
var userController = require('../Controller/UserController');

var api = express.Router();

api.post('/save', userController.save);

module.exports = api;
