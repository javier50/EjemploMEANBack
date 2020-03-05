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
									res.status(200).send({message: 'Se ha guardado el registro'});
								} else {
									res.status(500).send({message: 'No se guardo el registro'});
								}
							} else {
								console.log('err:' + err);
								res.status(error.response.status);
								res.send(error.message);
							}
						});
					} else {
					  res.status(error.response.status);
					  res.send(error.message);
					}
				});
			} else {
				res.status(error.response.status)
				res.send(error.message);
			}
		});
	}
}

module.exports = {
	save
};