require('dotenv').config(); // variable de entorno

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

//user:mean_user
// contraseña: xRHQ8hfvZYKWmnwu


// Rutas
app.get('/', (req, res)=> {
    res.json({
        ok:true,
        msg:'Hola Mundo'

    })
});


app.listen( process.env.PORT,  () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT );
});
