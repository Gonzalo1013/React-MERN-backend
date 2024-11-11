/*
    Rutas de Usuarios / Auth
    Host + /api/auth
*/

const {Router} = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { createUser, loginUser, revalidToken } = require('../controllers/auth')
const { validarJWT } = require('../middlewares/validar.jwt');


const router = Router();

router.post(
    '/new', 
    [ //middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ] , 
    createUser 
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
     loginUser 
    );

router.get('/renew', validarJWT , revalidToken );


module.exports = router;