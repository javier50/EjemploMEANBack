'use strict';

var fs = require('fs'); // FileSystem
var path = require('path'); // Facilita el acceso a rutas concretas
var bcrypt = require('bcryptjs');
var Album = require('../model/Album');
var Song = require('../model/Song');
var constants = require('../util/Constants');

function save(req, res){
	var album = new Album();
	var params = req.body;
	
	if(!params.tittle && !params.year){
		res.status(400).send({
			message: 'Introducir los campos necesarios'
		});
	} else {
		console.log(params);
		album.tittle = params.tittle;
		album.description = params.description;
		album.year = params.year;
		album.image = 'null';
		album.artist = params.artistId;
		album.save((err, albumStored) => {
			if(!err){
				if(albumStored){
					console.log('albumStored:' + albumStored);
					res.status(200).send({
						message: 'Se ha guardado el registro',
						album: albumStored
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
}

function update(req, res){
	var albumId = req.params.id;
	var params = req.body;
	
	if(!albumId){
		res.status(500).send({message: 'falta el Id del registro'});
	}
		
	Album.findByIdAndUpdate(albumId, params, function(err, albumUpdated){
		if(!err){
			if(albumUpdated){
				res.status(200).send({albumOld: albumUpdated});
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
	var albumId = req.params.id;
	
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
	
	Album.findByIdAndUpdate(albumId, params, function(err, albumUpdated){
		if(!err){
			if(albumUpdated){
				res.status(200).send({albumOld: albumUpdated});
			} else {
				console.log(albumUpdated);
				res.status(500).send({message: 'No se ha podido actualizar el registro'});
			}			
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al actualizar datos'});
		}
	});
}

function deleteById(req, res){
	var albumId = req.params.id;
	var params = req.body;
	var totalSongs = 0;
	
	if(!albumId){
		res.status(500).send({message: 'falta el Id del registro'});
	}
		
	Album.findById(albumId).remove(function(err, albumRemovedStatus){
		if(!err){
			if(albumRemovedStatus){
				Song.count({album: albumId}, function(err, count){
					if(err){
						console.error(err.stack || err);
						return res.status(500).send({message: 'Hubo un error al contar los registros'});
					}
					totalSongs = count;
				});

				if(totalSongs == 0){
					return res.status(200).send({
						message: 'El registro se elimino',
						albumRemovedStatus: albumRemovedStatus,
						songRemovedStatus: {
						        "n": 0,
								"ok": 1,
								"deletedCount": 0
						}
					});
				}

				Song.find({album: albumId}).remove(function(err, songRemovedStatus){
					if(!err){
						if(songRemoved){
							res.status(200).send({
								message: 'El registro se elimino',
								albumRemovedStatus: albumRemovedStatus,
								songRemovedStatus: songRemovedStatus
							});
						} else {
							res.status(200).send({message: 'El registro no se ha podido eliminar'});
						}
					} else {
						console.error(err.stack || err);
						res.status(500).send({message: 'Error al intentar eliminar el registro'});
					}
				});
			} else {
				res.status(200).send({message: 'El registro no se ha podido eliminar'});
			}
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al intentar eliminar el registro'});
		}
	});
}

function getById(req, res){
	var albumId = req.params.id;
	
	if(!albumId){
		res.status(500).send({message: 'falta el Id del registro'});
	}
		
	Album.findById(albumId, function(err, albumStored){
		if(!err){
			if(albumStored){
				res.status(200).send({album: albumStored});
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
	
	Album.paginate(
		{},
		{
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
				albums: itemList.docs,
				limit: itemList.limit,
				page: itemList.page
			});
		}
	);
}

function getImage(req, res){
	var albumId = req.params.id;
	
	if(!albumId){
		res.status(500).send({message: 'falta el Id del usuario'});
	}
		
	Album.findById(albumId, function(err, albumStored){
		if(!err){
			if(!albumStored){
				return res.status(400).send({message: 'No se encontro el registro'});
			}
			
			var pathFile = constants.PATH_FILE_ALBUM + albumStored.image;
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
	deleteById,
	getById,
	getAll,
	getImage
};