'use strict';

var express = require('express');
var app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

// cargar rutas
var generalRoute = require('./route/GeneralRoutes');
var albumRoute = require('./route/AlbumRoutes');
var artistRoute = require('./route/ArtistRoutes');
var songRoute = require('./route/SongRoutes');
var userRoute = require('./route/UserRoutes');


// configurar cabeceras http (CORS)
app.use((req, res, next) =>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// ruta base midlwere
app.use('', generalRoute);
app.use('/album', albumRoute);
app.use('/artista', artistRoute);
app.use('/cancion', songRoute);
app.use('/usuario', userRoute);


app.get('/prueba', function(req, res){
	res.status(200).send({menssage: 'Mensaje de respuesta'});
});

module.exports = app;
