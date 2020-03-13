'use strict';

var express = require('express');
var albumController = require('../controller/AlbumController');
var multiparty = require('connect-multiparty');
var constants = require('../util/Constants');


// middlewares
var authenticateMD = require('../middleware/authenticated');
var uploadMD = multiparty({uploadDir: constants.PATH_FILE_ALBUM});

var api = express.Router();

api.post('/save', authenticateMD.isAuthenticated, albumController.save);
api.put('/update/:id', authenticateMD.isAuthenticated, albumController.update);
api.post('/uploadImage/:id', [authenticateMD.isAuthenticated, uploadMD], albumController.uploadImage);
api.post('/deleteById/:id', authenticateMD.isAuthenticated, albumController.deleteById);
api.get('/getById/:id', authenticateMD.isAuthenticated, albumController.getById);
api.get('/getImage/:id', authenticateMD.isAuthenticated, albumController.getImage);
api.get('/getAll/:page?', authenticateMD.isAuthenticated, albumController.getAll);

module.exports = api;
