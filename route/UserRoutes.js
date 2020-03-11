'use strict';

var express = require('express');
var userController = require('../controller/UserController');
var multiparty = require('connect-multiparty');
var constants = require('../util/Constants');


// middlewares
var authenticateMD = require('../middleware/authenticated');
var uploadMD = multiparty({uploadDir: constants.PATH_FILE_USER});

var api = express.Router();

api.post('/save', authenticateMD.isAuthenticated, userController.save);
api.put('/update/:id', authenticateMD.isAuthenticated, userController.update);
api.post('/uploadImage/:id', [authenticateMD.isAuthenticated, uploadMD], userController.uploadImage);
api.get('/getById/:id', authenticateMD.isAuthenticated, userController.getById);
api.get('/getImage/:id', authenticateMD.isAuthenticated, userController.getImage);
api.get('/getAll/:page?', authenticateMD.isAuthenticated, userController.getAll);

module.exports = api;
