const express = require('express');
const router = express.Router();
const usarioController = require('../controllers/usuarioController');
const {check} = require('express-validator');
const auth = require('../middleware/auth');

// Crear un usuario, /api/usuarios
router.post('/',
    [ // Validacion de expres validator
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('email','Agrega un email valido').isEmail(),
        check('password','El password debe ser minimo de 6 caracteres').isLength({min:6})
    ],
    usarioController.crearUsuario
);

// Obtener los datos del usuario
router.get('/',
    auth,
    usarioController.usuarioAutenticado
);

module.exports = router;