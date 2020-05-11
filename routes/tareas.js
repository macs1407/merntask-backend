const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController')
const {check} = require('express-validator');
const auth = require('../middleware/auth');

// crear una tarea /api/tarea
router.post('/',
    auth,
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('proyecto','El proyecto es oglibatorio').not().isEmpty()
    ],
    tareaController.agregarTarea
);

router.get('/',
    auth,
    tareaController.obtenerTarea
)

router.put('/:id',
    auth,
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('proyecto','El proyecto es oglibatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
)

router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;