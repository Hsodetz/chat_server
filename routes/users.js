const Router = require('express');
const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const { getUsers } = require('../controllers/users');



router.get('/', validarJWT, getUsers);



module.exports = router;