'use strict';

var express = require('express');
var loginController = require('../controller/LoginController');

var api = express.Router();

api.post('/login', loginController.login);

module.exports = api;
