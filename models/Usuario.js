const mongoose = require('mongoose'); // Importar mongoose
// Definir el Schema
const UsuarioSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    registro:{
        type:Date,
        default:Date.now()
    }
});
// Registrar el modelo Usuario con este SCHEMA UsuarioSchema
module.exports = mongoose.model('usuarios', UsuarioSchema);