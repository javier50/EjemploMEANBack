'use strict';

var bcrypt = require('bcryptjs');
var User = require('../model/User');

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


function update(req, res){
	var userId = req.params.id;
	var params = req.body;
	
	if(!userId){
		res.status(500).send({message: 'falta el Id del usuario'});
	}
		
	User.findByIdAndUpdate(userId, params, {}, function(err, userUpdated){
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


module.exports = {
	save,
	update
};