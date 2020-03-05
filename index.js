'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3799;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false', (err, res) => {
	if(err){
		throw err;
	} else {
		console.log("Conexión con BD");
		app.listen(port, function(){
			console.log("Servidor API Rest escuchando en http:://localhost:" +  port);
		});
	}
});
