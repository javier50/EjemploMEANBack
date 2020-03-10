'use strict';

var fs = require('fs'); // FileSystem
var path = require('path'); // Facilita el acceso a rutas concretas
var bcrypt = require('bcryptjs');
var User = require('../model/User');
var constants = require('../util/Constants');

function save(req, res){
	var user = new User();
	var params = req.body;
	console.log('req:' + req);
	if(!params.password){
		res.status(200).send({
			message: 'Introduce la contraseña'
		});
	} else if(!params.name && !params.surname){
		res.status(200).send({
			message: 'Introducir los campos necesarios'
		});
	} else {
		console.log(params);
		user.name = params.name;
		user.surname = params.surname;
		user.email = params.email;
		//user.password = params.password;
		user.role = 'ROLE_USER';
		user.image = 'null';
		
		console.log('generate a salt...');
		bcrypt.genSalt(10, function(err, salt) {
			if (!err) {
				console.log('generate hash...');
				bcrypt.hash(params.password, salt, function(error, hash) {
					if (!error) {
						console.log('hash: ' + hash);
						user.password = hash;
						
						user.save((err, userStored) => {
							if(!err){
								if(userStored){
									console.log('userStored:' + userStored);
									res.status(200).send({
										message: 'Se ha guardado el registro',
										user: userStored
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
					} else {
						console.error(err.stack || err);
						res.status(err.response.status);
						res.send(err.message);
					}
				});
			} else {
				console.error(err.stack || err);
				res.status(err.response.status)
				res.send(err.message);
			}
		});
	}
}

function show(req, res){
	var userId = req.params.id;
	
	if(!userId){
		res.status(500).send({message: 'falta el Id del usuario'});
	}
		
	User.findById(userId, function(err, userStored){
		if(!err){
			if(userStored){
				res.status(200).send({user: userStored});
			} else {
				res.status(200).send({message: 'No se ha podido recuperar el registro'});
			}			
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al recuperar datos'});
		}
	});
}

function update(req, res){
	var userId = req.params.id;
	var params = req.body;
	
	if(!userId){
		res.status(500).send({message: 'falta el Id del usuario'});
	}
		
	User.findByIdAndUpdate(userId, params, function(err, userUpdated){
		if(!err){
			if(userUpdated){
				res.status(200).send({userOld: userUpdated});
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
	var userId = req.params.id;
	
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
	
	User.findByIdAndUpdate(userId, params, function(err, userUpdated){
		if(!err){
			if(userUpdated){
				res.status(200).send({userOld: userUpdated});
			} else {
				console.log(userUpdated);
				res.status(500).send({message: 'No se ha podido actualizar el registro'});
			}			
		} else {
			console.error(err.stack || err);
			res.status(500).send({message: 'Error al actualizar datos'});
		}
	});
}

function getImage(req, res){
	var userId = req.params.id;
	
	if(!userId){
		res.status(500).send({message: 'falta el Id del usuario'});
	}
		
	User.findById(userId, function(err, userStored){
		if(!err){
			var pathFile = constants.PATH_FILE_USER + userStored.image;
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
	show,
	update,
	uploadImage,
	getImage
};