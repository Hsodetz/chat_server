
const Router = require('express');
const router = Router();
const {check} = require('express-validator')

const { crearUsuario, login, renewToken } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty().isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),

    validarCampos
],crearUsuario)

router.post('/login', [
    check('email', 'El email es obligatorio').not().isEmpty().isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),

], login)

router.get('/renew', validarJWT, renewToken)

router.get('/holis', function (req, res) {
    console.log(' en /holis')
    res.send('holis')
})

module.exports = router;