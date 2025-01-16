const { comprobarJWT } = require('../helpers/jwt');
const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');
const {userConnected, userDisconnected, guardarMensaje} = require('../controllers/socket')

const bands = new Bands()
bands.addBand(new Band('Guns and Roses'))
bands.addBand(new Band('Nirvana'))
bands.addBand(new Band('Queen'))
bands.addBand(new Band('Limp Bizkit'))
bands.addBand(new Band('The Verbe'))


// Mensajes de sockets
io.on('connection', client => {
    console.log('cliente conectado')

    console.log(client.handshake.headers['x-token']);
    
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'])
    console.log('cliente autenticado', valido, uid);

    // Verificar autenticacion, si no es valido desconectar
    if (!valido) { return client.disconnect() }

    // Cliente autenticado
    userConnected(uid)

    // Ingresar al usuario a una sala o canal especifico
    // sala global, solo para el que lo emite con el client.id
    client.join(uid)

    // Escuchar del cliente el mensaje
    client.on('mensaje-personal', async (payload) => {
        console.log(payload);

        // Guardar mensaje en la base de datos
        await guardarMensaje(payload)

        // enviamos el mensaje a un usuario en especifico
        io.to(payload.para).emit('mensaje-personal', payload)
    })


    
    client.on('disconnect', () => {
        console.log('cliente desconectado');
        userDisconnected(uid)
    });
    
    
    
    
    
    
    
    
    
    // Los metodos que siguen es de prueba, se puede borrar
    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload)
        
        // este es para comunicar a todos los clientes
        io.emit('mensaje', {admin: 'Nuevo mensaje admin'})
        
    })
    
    client.on('newMessage', (payload) => {
        console.log('Mensaje', payload)
        
        // este es para comunicar a todos los clientes
        //io.emit('newMessage', {admin: `Nuevo mensaje flutteriano - ${payload}`}) // emite e todos
        client.broadcast.emit('newMessage', payload) // emite a todos menos al que lo emitio
    })
    
    client.on('vote-band', (payload) => {
        console.log(payload);
        bands.voteBand(payload.id)
        io.emit('active-bands', bands.getBands())
    })
    
    client.on('add-band', (payload) => {
        console.log(payload);
        const newBand = new Band(payload.name)
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands())
    })
    
    client.on('delete-band', (payload) => {
        console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands())
    })
    
    //client.emit('active-bands', bands.getBands())
});