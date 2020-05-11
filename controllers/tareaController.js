const mongoose = require('mongoose');
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyectos');
const {validationResult} = require('express-validator');
// Agregar una tarea
exports.agregarTarea = async(req,resp)=>{
     // Revisar si hay errores
     const errores = validationResult(req);
     if(!errores.isEmpty()){
         return resp.status(400).json({errores:errores.array()})
     }
     try{
        // Extraer el proyecto
        const {proyecto} = req.body;
        existeProyecto = await Proyecto.findById(proyecto);
        // Si no hay ningun proyecto
        if(!existeProyecto){
            return resp.status(400).json({msg:'Proyecto no encontrado'});
        }
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()!== req.usuario.id){
            return resp.status(400).json({msg:'no Autorizado'});
        }
        // Crear la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        resp.status(200).json(tarea);
     } catch(error){
         resp.status(500).send('Se ha presentado un error: '+error);
     }
}
// obtener las tareas
exports.obtenerTarea = async(req,resp)=>{
    try{
        // Extraer el proyecto, se utilizar req.query por que en el front se enviar params y 
        // de esta manera se lee
        const {proyecto} = req.query;
        let valid = mongoose.Types.ObjectId.isValid(proyecto);
        if (!valid){
            return resp.status(400).json({msg:'Clave de Proyecto no encontrado'});
        }
        existeProyecto = await Proyecto.findById(proyecto);
        // Si no hay ningun proyecto
        if(!existeProyecto){
            return resp.status(400).json({msg:'Proyecto no encontrado'});
        }
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()!== req.usuario.id){
            return resp.status(400).json({msg:'no Autorizado'});
        }
        // obtener la tarea
        const tareas = await Tarea.find({proyecto});
        resp.status(200).json({tareas});
    }catch(error){
         resp.status(500).send('Se ha presentado un error: '+error);
    }
}

// Actualizar una tarea
exports.actualizarTarea = async(req,resp)=>{
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return resp.status(400).json({errores:errores.array()})
    }
    try{
        console.log(req.body);
        const {proyecto,nombre,estado} = req.body;
        let valid = mongoose.Types.ObjectId.isValid(proyecto);
        if (!valid){
            return resp.status(400).json({msg:'Proyecto no encontrado'});
        }
        // Comprobar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return resp.status(400).json({msg:'La tarea no existe'});
        }
        const existeProyecto = await Proyecto.findById(proyecto);
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()!== req.usuario.id){
            return resp.status(400).json({msg:'no Autorizado'});
        }
      
        // Crear un nuevo objeto con la nueva informacion
        const nuevaTarea = {};
        // Si cambiaron valores
        if(nombre){
            nuevaTarea.nombre = nombre;
        }
        nuevaTarea.estado = estado;

        tarea = await Tarea.findByIdAndUpdate({_id: req.params.id},nuevaTarea,{new:true});
        resp.status(200).json({tarea});
    }catch(error){
        resp.status(500).send('Se ha presentado un error: '+error);
    }
}

exports.eliminarTarea = async(req,resp)=>{
    try{
        // Se trae para verificar si el el usuario que esta intenta eliminar es el dueño
        const {proyecto} = req.query;
        let valid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!valid){
            return resp.status(400).json({msg:'Tarea no encontrada'});
        }
        let tarea = await Tarea.findById(req.params.id);        
        if(!tarea){
            return resp.status(400).json({msg:'La tarea no existe'});
        }
        valid = mongoose.Types.ObjectId.isValid(proyecto);
        if (!valid){
            return resp.status(400).json({msg:'Proyecto no encontrado'});
        }
        const verificarPropietario = await Proyecto.findById(proyecto);
        
        if(!verificarPropietario){
            return resp.status(400).json({msg:'No existe ese proyecto como padre de la tarea'});
        }
        // Comprobamos que el creador del proyecto sea igual al que lo esta intentando eliminar
        // req.usuario.id viene del token
        if(verificarPropietario.creador.toString()!== req.usuario.id){
            return resp.status(400).json({msg:'No tiene permiso para eliminar esta tarea'});
        }
        await Tarea.findOneAndRemove({_id:req.params.id});
        resp.status(200).json({mgs:'Se elimino la tarea'})
    }catch(error){
        resp.status(500).send('Se ha presentado un error: '+error);
    }
}