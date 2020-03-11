'use strict';

var fs = require('fs'); // FileSystem
var path = require('path'); // Facilita el acceso a rutas concretas
var bcrypt = require('bcryptjs');
var Artist = require('../model/Artist');
var constants = require('../util/Constants');

function save(req, res){
	var artist = new Artist();
	var params = req.body;
	
	if(!params.name){
		return res.status(200).send({message: 'Introducir los campos necesarios'});
	}
	
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';
	artist.save((err, artistStored) => {
		if(!err){
			if(artistStored){
				console.log('artistStored:' + artistStored);
				res.status(200).send({
					message: 'Se ha guardado el registro',
					artist: artistStored
				});
			} else {
				res.status(500).send({message: 'No se guardo el registro'});
			}
		} else {
			console.error(err.stack || err);
			res.status(err.response.status);
			res.send(err.message);
		}
	});
}

function update(req, res){
	var artistId = req.params.id;
	var params = req.body;
	
	if(!artistId){
		res.status(500).send({message: 'falta el Id del registro'});
	}
		
	Artist.findByIdAndUpdate(artistId, params, function(err, artistUpdated){
		if(!err){
			if(artistUpdated){
				res.status(200).send({artistOld: artistUpdated});
			} else {
				res.status(200).send({message: 'No se ha podido actualizar el registro'});
			}			
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al actualizar datos'});
		}
	});
}

function uploadImage(req, res){
	console.log(req.files);
	var artistId = req.params.id;
	
	if(!req.files){
		return res.status(400).send({message: 'No ha cargado ningún archivo'});
	}
	
	// nombre del archivo
	var file_path = req.files.image.path;
	var file_split = file_path.split('\\');
	var file_name = file_split[2];
	console.log('file_name: ' + file_name);
	
	// extencion del archivo
	var ext_split = file_path.split('.');
	var ext_file = ext_split[1];
	
	var params = {
		image : file_name
	};
	
	if(!(ext_file == 'png' || ext_file == 'jpg' || ext_file == 'gif')) {
		return res.status(400).send({message: 'No es un archivo valido'});
	}
	
	Artist.findByIdAndUpdate(artistId, params, function(err, artistUpdated){
		if(!err){
			if(artistUpdated){
				res.status(200).send({artistOld: artistUpdated});
			} else {
				console.log(artistUpdated);
				res.status(500).send({message: 'No se ha podido actualizar el registro'});
			}			
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al actualizar datos'});
		}
	});
}

function getById(req, res){
	var artistId = req.params.id;
	
	if(!artistId){
		res.status(500).send({message: 'falta el Id del registro'});
	}
		
	Artist.findById(artistId, function(err, artistStored){
		if(!err){
			if(artistStored){
				res.status(200).send({artist: artistStored});
			} else {
				res.status(200).send({message: 'No se ha podido recuperar el registro'});
			}			
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al recuperar datos'});
		}
	});
}

function getAll(req, res){
	var page = req.params.page;
	
	if(!page){
		page = 1;
	}
	
	Artist.paginate(
		{},
		{
			sort: 'name',
			page:page,
			limit: constants.PAGINATION_LIMIT
		},
		function(err, itemList, total){
			if(err){
				console.error(err.stack || err);
				return res.status(500).send({message: 'Error al recuperar datos'});
			}
			
			if(!itemList) {
				return res.status(400).send({message: 'No hay registros'});
			}
			
			return res.status(200).send({
				total: itemList.totalDocs,
				users: itemList.docs,
				limit: itemList.limit,
				page: itemList.page
			});
		}
	);
}

function getImage(req, res){
	var artistId = req.params.id;
	
	if(!artistId){
		res.status(500).send({message: 'falta el Id del usuario'});
	}
		
	Artist.findById(artistId, function(err, artistStored){
		if(!err){
			var pathFile = constants.PATH_FILE_ARTIST + artistStored.image;
			console.log('pathFile: ' + pathFile);
			fs.exists(pathFile , function(exists){
				console.log('exists: ' + exists);
				if(exists){
					res.sendFile(path.resolve(pathFile));
				} else {
					res.status(400).send({message: 'No existe el archivo'});
				}
			});
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al recuperar datos'});
		}
	});
}

module.exports = {
	save,
	update,
	uploadImage,
	getImage,
	getAll,
	getById
};