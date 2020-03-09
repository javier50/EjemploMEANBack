'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'Clave_Secrete_Para_Generar_Token';


function isAuthenticated (req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({message: 'No trae la cabecera correcta'});
	}
	
	var token = req.headers.authorization.replace(/['"]/g, '');
	
	try {
		var payload = jwt.decode(token, secret);
		
		if(payload.exp < moment().unix()){
			return res.status(401).send({message: 'Token ha expirado'});
		}
	} catch (err){
		console.error(err);
		return res.status(404).send({message: 'Token no valido'});
	}
	
	req.user = payload;
	next();
}

module.exports = {
	isAuthenticated
}