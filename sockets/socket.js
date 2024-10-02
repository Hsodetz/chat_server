const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands()
bands.addBand(new Band('Guns and Roses'))
bands.addBand(new Band('Nirvana'))
bands.addBand(new Band('Queen'))
bands.addBand(new Band('Limp Bizkit'))
bands.addBand(new Band('The Verbe'))


// Mensajes de sockets
io.on('connection', client => {
    console.log('cliente conectado')

    client.emit('active-bands', bands.getBands())

    client.on('disconnect', () => {
        console.log('cliente desconectado');
    });

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

});