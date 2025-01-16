const { generarJWT } = require("../helpers/jwt")
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');

const crearUsuario = async (req, res) => {

    const {email, password} = req.body

    try {

        const existeEmail = await Usuario.findOne({email})

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                message: "El email ya se encuentra registrado"
            })
        }

        const user = new Usuario(req.body)

        // Encriptamos la contrasena
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(password, salt)

        await user.save()

        console.log(user.id)

        // Generar el json web token jwt
        const token = await generarJWT(user.id)

        res.json({
            ok: true,
            user,
            token
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok: false,
            message: "Hable con el administrador!"
        })
    }

}

const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const userDB = await Usuario.findOne({email})
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: 'Email no encontrado'
            })
        }

        // Validar el password
        const validPassword = bcrypt.compareSync(password, userDB.password)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales no validas'
            })
        }

        // Generar el jwt
        const token = await generarJWT(userDB.id)

        return res.json({
            ok: true,
            user: userDB,
            token
        })

        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        })
    }

}

const renewToken = async(req, res) => {

    const uidUser = req.uid

    const newToken = await generarJWT(uidUser)

    const newUser = await Usuario.findById(uidUser)

    return res.json({
        ok: true,
        user: newUser,
        token: newToken
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken,
}