require('dotenv').config(); // variable de entorno
const path = require('path');

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear servidor de express
const app = express();

// Configurar CORS
app.use(cors());

//Lectura y parseo del body    --Nota se debe colocar antes de las rutas--
app.use(express.json() );

// Base de datos
dbConnection();

// Directorio publico
app.use( express.static('public'));

// Rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/hospitales', require('./routes/hospitales') );
app.use( '/api/medicos', require('./routes/medicos') );
app.use( '/api/todo', require('./routes/busquedas' ) );
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/upload', require('./routes/uploads') );

// Lo último 
app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});





app.listen( process.env.PORT,  () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT );
});
