'use strict';

var express = require('express');
var app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

// cargar rutas
var generalRoute = require('./route/GeneralRoutes');
var albumRoute = require('./route/AlbumRoutes');
var artistRoute = require('./route/ArtistRoutes');
var userRoute = require('./route/UserRoutes');


// configurar cabeceras http


// ruta base midlwere
app.use('', generalRoute);
app.use('/album', albumRoute);
app.use('/artista', artistRoute);
app.use('/usuarios', userRoute);


app.get('/pruebas', function(req, res){
	res.status(200).send({menssage: 'Mensaje de respuesta'});
});

module.exports = app;
