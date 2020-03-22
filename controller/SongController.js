'use strict';

var fs = require('fs'); // FileSystem
var path = require('path'); // Facilita el acceso a rutas concretas
var bcrypt = require('bcryptjs');
var Song = require('../model/Song');
var constants = require('../util/Constants');

function save(req, res){
	var song = new Song();
	var params = req.body;

	if(!(params.number && params.name && params.albumId)){
		res.status(400).send({
			message: 'Introducir los campos necesarios'
		});
	} else {
		console.log(params);
		song.number = params.number;
		song.name = params.name;
		song.duration = params.duration;
		song.file = null;
		song.album = params.albumId;
		song.save((err, songStored) => {
			if(!err){
				if(songStored){
					console.log('songStored:' + songStored);
					res.status(200).send({
						message: 'Se ha guardado el registro',
						song: songStored
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
	var songId = req.params.id;
	var params = req.body;

	if(!songId){
		res.status(500).send({message: 'falta el Id del registro'});
	}

	Song.findByIdAndUpdate(songId, params, function(err, songUpdated){
		if(!err){
			if(songUpdated){
				res.status(200).send({songOld: songUpdated});
			} else {
				res.status(200).send({message: 'No se ha podido actualizar el registro'});
			}
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al actualizar datos'});
		}
	});
}

function uploadFile(req, res){
	console.log(req.files);
	var songId = req.params.id;

	if(!req.files){
		return res.status(400).send({message: 'No ha cargado ningún archivo'});
	}

	// nombre del archivo
	var file_path = req.files.song.path;
	var file_split = file_path.split('\\');
	var file_name = file_split[2];
	console.log('file_name: ' + file_name);

	// extencion del archivo
	var ext_split = file_path.split('.');
	var ext_file = ext_split[1];

	var params = {
		file : file_name
	};

	if(!(ext_file == 'mp3' || ext_file == 'ogg')) {
		return res.status(400).send({message: 'No es un archivo valido'});
	}

	Song.findByIdAndUpdate(songId, params, function(err, songUpdated){
		if(!err){
			if(songUpdated){
				res.status(200).send({songOld: songUpdated});
			} else {
				console.log(songUpdated);
				res.status(500).send({message: 'No se ha podido actualizar el registro'});
			}
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al actualizar datos'});
		}
	});
}

function deleteById(req, res){
	var songId = req.params.id;
	var params = req.body;
	var totalSongs = 0;

	if(!songId){
		res.status(500).send({message: 'falta el Id del registro'});
	}

	Song.findById(songId).remove(function(err, songRemovedStatus){
		if(!err){
			if(songRemovedStatus){
				Song.count({song: songId}, function(err, count){
					if(err){
						console.error(err.stack || err);
						return res.status(500).send({message: 'Hubo un error al contar los registros'});
					}
					totalSongs = count;
				});

				if(totalSongs == 0){
					return res.status(200).send({
						message: 'El registro se elimino',
						songRemovedStatus: songRemovedStatus,
						songRemovedStatus: {
							"n": 0,
							"ok": 1,
							"deletedCount": 0
						}
					});
				}

				Song.find({song: songId}).remove(function(err, songRemovedStatus){
					if(!err){
						if(songRemoved){
							res.status(200).send({
								message: 'El registro se elimino',
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
	var songId = req.params.id;

	if(!songId){
		res.status(500).send({message: 'falta el Id del registro'});
	}

	Song.findById(songId, function(err, songStored){
		if(!err){
			if(songStored){
				songStored.populated("album");
				res.status(200).send({song: songStored});
			} else {
				res.status(200).send({message: 'No se ha podido recuperar el registro'});
			}
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al recuperar datos'});
		}
	}).populate({path: 'album', populate: 'artist'});
}

function getAll(req, res){
	var page = req.params.page;

	if(!page){
		page = 1;
	}

	Song.paginate(
		{},// Filters
		{
			page:page,
			limit: constants.PAGINATION_LIMIT,
			populate: {path: 'album', populate: 'artist'}// populate 2 levels
		},// Options
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
				songs: itemList.docs,
				limit: itemList.limit,
				page: itemList.page
			});
		}
	);
}

function getFile(req, res){
	var songId = req.params.id;

	if(!songId){
		res.status(500).send({message: 'falta el Id del usuario'});
	}

	Song.findById(songId, function(err, songStored){
		if(!err){
			if(!songStored){
				return res.status(400).send({message: 'No se encontro el registro'});
			}

			var pathFile = constants.PATH_FILE_SONG + songStored.file;
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
	uploadFile,
	deleteById,
	getById,
	getAll,
	getFile
};
