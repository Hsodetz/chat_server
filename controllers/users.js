const Usuario = require("../models/usuario")

const getUsers = async (req, res) => {
    const desde = Number(req.query.desde) || 0

    const users = await Usuario
    .find({_id: {$ne: req.uid}}) // exclude the user that is making the request from the list
    .sort('-online') // order by online first
    .skip(desde)
    .limit(20)


    res.json({
        ok: true,
        users
    })
}

module.exports = {
    getUsers,
}   // Exportamos el método getUsers para que pueda ser utilizado en el archivo routes/users.js