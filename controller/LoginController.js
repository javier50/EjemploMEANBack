'use strict';

var bcrypt = require('bcryptjs');
var User = require('../model/User');
var JwtService = require('../service/JwtService');

function login(req, res){
	var params = req.body;
	console.log(params);
	
	var email = params.email;
	var password = params.password;
	
	User.findOne({email: email.toLowerCase()}, (err, user)=>{
		if (!err){
			if (user){
				bcrypt.compare(password, user.password, (err, validPassword) => {
					console.log('validPassword: ' + validPassword);
					if (validPassword) {
						console.log('has: ' + params.getHash);
						if (params.getHash) {
							res.status(200).send({
								token: JwtService.createToken(user)
							});
						} else {
							res.status(200).send({user: user});
						}
					} else {
						console.trace('Contraseña incorrecta');
						res.status(500).send({message: 'datos incorrectos favor de verificarlos'});						
					}
				});
			} else {
				console.log('Usuario no encontrado');
				res.status(500).send({message: 'datos incorrectos favor de verificarlos'});
			}
		} else {
			console.error(err.stack || err);
			res.status(err.response.status);
			res.send(err.message);
		}
	});
	
}

module.exports = {
	login
};