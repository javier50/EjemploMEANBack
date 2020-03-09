'use strict';

var express = require('express');
var app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

// cargar rutas
var userRoute = require('./route/UserRoutes');
var generalRoute = require('./route/GeneralRoutes');

// configurar cabeceras http


// ruta base midlwere
app.use('', generalRoute);
app.use('/usuarios', userRoute);


app.get('/pruebas', function(req, res){
	res.status(200).send({menssage: 'Mensaje de respuesta'});
});

module.exports = app;