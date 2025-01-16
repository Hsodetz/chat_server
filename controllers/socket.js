const user = require('../models/usuario')
const Message = require('../models/mensaje')

const userConnected = async (uid = '') => {
    const userOnline = await user.findById(uid)
    userOnline.online = true
    await userOnline.save()
    return userOnline
}

const userDisconnected = async (uid = '') => {
    const userOnline = await user.findById(uid)
    userOnline.online = false
    await userOnline.save()
    return userOnline
}

const guardarMensaje = async (payload) => {
    try {
        const message = new Message(payload)
        await message.save()
        return true
    } catch (error) {
        return false
    }
}

module.exports = {
    userConnected,
    userDisconnected,
    guardarMensaje
}