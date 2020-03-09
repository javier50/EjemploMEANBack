'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'Clave_Secrete_Para_Generar_Token'; // cadena con la cual  

function createToken (user){
	var payload = {
		sub : user._id, //id del objeto
		name : user.name,
		surname : user.surname,
		email : user.email,
		role : user.role,
		image : user.image,
		iat : moment().unix, // fecha de creacion en formato timestamp
		exp : moment().add(30, 'days').unix // fecha de expiracion de token en fotmato timestamp(aumenta 30 dias)
	};
	
	return jwt.encode(payload, secret);
}

module.exports = {
	createToken
}