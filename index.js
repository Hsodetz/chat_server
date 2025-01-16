const express = require('express')
const app = express()

const path = require('path')
require('dotenv').config()


// Db config
const {dbConnection} = require('./database/config')
dbConnection()

// lectura y parseo del body
app.use( express.json() );

// Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket')


// Path publico
const publicPath = path.resolve( __dirname, 'public' );
app.use( express.static( publicPath ) );

/// Mis Rutas
app.use( '/api', require('./routes/auth'));
app.use( '/api/users', require('./routes/users'));
app.use( '/api/messages', require('./routes/messages'));



app.get('/verga', (req, res) => {
    res.json({
        ok:true,
        message: 'holis'
    })
})


server.listen(process.env.PORT, (err) => {
    if(err) throw new Error(err)
    
    console.log('Servidor en puerto', process.env.PORT)
})

