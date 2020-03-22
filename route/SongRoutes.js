'use strict';

var express = require('express');
var songController = require('../controller/SongController');
var multiparty = require('connect-multiparty');
var constants = require('../util/Constants');


// middlewares
var authenticateMD = require('../middleware/authenticated');
var uploadMD = multiparty({uploadDir: constants.PATH_FILE_SONG});

var api = express.Router();

api.post('/save', authenticateMD.isAuthenticated, songController.save);
api.put('/update/:id', authenticateMD.isAuthenticated, songController.update);
api.post('/uploadFile/:id', [authenticateMD.isAuthenticated, uploadMD], songController.uploadFile);
api.post('/deleteById/:id', authenticateMD.isAuthenticated, songController.deleteById);
api.get('/getById/:id', authenticateMD.isAuthenticated, songController.getById);
api.get('/getFile/:id', authenticateMD.isAuthenticated, songController.getFile);
api.get('/getAll/:page?', authenticateMD.isAuthenticated, songController.getAll);

module.exports = api;
