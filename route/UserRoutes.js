'use strict';

var express = require('express');
var userController = require('../controller/UserController');
var authenticateMD = require('../middleware/authenticated');

var api = express.Router();

api.post('/save', authenticateMD.isAuthenticated, userController.save);
api.put('/update/:id', authenticateMD.isAuthenticated, userController.update);

module.exports = api;
