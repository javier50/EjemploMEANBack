'use strict';

var express = require('express');
var artistController = require('../controller/ArtistController');
var multiparty = require('connect-multiparty');
var constants = require('../util/Constants');


// middlewares
var authenticateMD = require('../middleware/authenticated');
var uploadMD = multiparty({uploadDir: constants.PATH_FILE_ARTIST});

var api = express.Router();

api.post('/save', authenticateMD.isAuthenticated, artistController.save);
api.put('/update/:id', authenticateMD.isAuthenticated, artistController.update);
api.post('/uploadImage/:id', [authenticateMD.isAuthenticated, uploadMD], artistController.uploadImage);
api.get('/getById/:id', authenticateMD.isAuthenticated, artistController.getById);
api.get('/getImage/:id', authenticateMD.isAuthenticated, artistController.getImage);
api.get('/getAll/:page?', authenticateMD.isAuthenticated, artistController.getAll);

module.exports = api;
