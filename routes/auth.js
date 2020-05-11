const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Crear un usuario, /api/auth
router.post('/',
    authController.autenticarUsuario
);

module.exports = router;