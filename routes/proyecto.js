const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');
// Crear un usuario, /api/proyectos
router.post('/',
    auth, // Seguridad en peticiones
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);
// Obtener todos los proyectos
router.get('/',
    auth, // Seguridad en peticiones
    proyectoController.obtenerProyectos
);
// Actualizar proyecto
router.put('/:id',
    auth,
    auth, // Seguridad en peticiones
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);
// Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;