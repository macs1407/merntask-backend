//1-) importar mongoose
const mongoose = require('mongoose');

//2-) Definir el objeto
const ProyectoSchema = mongoose.Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    creador:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usuarios'
    },
    creado:{
        type:Date,
        default:Date.now()
    }
});

//3-) Registrar el modelo
module.exports = mongoose.model('proyecto',ProyectoSchema);