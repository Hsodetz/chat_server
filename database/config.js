const mongoose = require('mongoose')

const dbConnection = async() => {
    try {
        console.log('init dbConfig')
        
        await mongoose.connect(process.env.DB_CNN)
        
        console.log('dbOnline')
        
    } catch (error) {
        console.error(error)
        throw new Error('Error en la base de datos')
    }
}

module.exports = {
    dbConnection
}