const express = require('express'); // En node no funcion import
const conectarDB = require('./config/db');
const cors = require('cors');
// Crear el servidor
const app = express();
// Conectar a la base de datos
conectarDB();
// Habilitar cors
app.use(cors());
// Habilitar express.json este es el remplazo de body parser
app.use(express.json({extended:true}));
// Crear puerto, eroku busca el puerto que este disponible
const PORT = process.env.PORT || 4000;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyecto'));
app.use('/api/tareas',require('./routes/tareas'));
// Arracar la app
app.listen(PORT, ()=>{
    console.log('arriba');
})