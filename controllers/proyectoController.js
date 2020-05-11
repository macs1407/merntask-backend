const Proyecto = require('../models/Proyectos');
const {validationResult} = require('express-validator');
exports.crearProyecto = async(req,resp)=>{
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return resp.status(400).json({errores:errores.array()})
    }
    try{
        // Crear un proyecto
        const proyecto = new Proyecto(req.body);
        // Obtener el id del usuario via jwt
        proyecto.creador =  req.usuario.id; // req.usuario.id viene de la peticion
        // Guardar el proyecto
        proyecto.save();
        resp.status(200).json(proyecto);
    } catch(error){
        console.log(error);
        resp.status(500).send('ocurrio un error');
    }
}

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async(req,resp)=>{
    try{
        // Filtrar por el usuario creador
        const proyectos = await Proyecto.find({creador:req.usuario.id}).sort({creado:-1});
        if(!proyectos){
            resp.status(400).json({msg:'No se encontraron datos'});
        }

        resp.status(200).json(proyectos);
    } catch(error){
        res.status(500).send('ocurrio un error, giardando: ',error);
    }
}

// Actualizar un proyecto
exports.actualizarProyecto = async(req, resp)=>{
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return resp.status(400).json({errores:errores.array()})
    }
    try{
        // Extraer la informacion del proyecto
        const {nombre} = req.body;
        const nuevoProyecto = {};
        // Comprobar si envio el nombre
        if(nombre){
            nuevoProyecto.nombre = nombre;
        }
        // Revisar que existe un proyecto
        let compruebaProyecto = await Proyecto.findById(req.params.id);
        if(!compruebaProyecto){
            resp.status(404).json({msg:'proyecto no encontrado'});
        }
        // Verificar si el usuario que lo creo es el mismo que lo va a modificar
        if(compruebaProyecto.creador.toString() !== req.usuario.id){
            resp.status(404).json({msg:'No autorizado'});
        }
        // actualizar
        compruebaProyecto = await Proyecto.findOneAndUpdate({_id:req.params.id}
                                                            ,{$set:nuevoProyecto}
                                                            ,{new:true});
        resp.status(200).json(compruebaProyecto);
    }catch(error){
        console.log(error);
        resp.status(500).send('ocurrio un error: '+error);
    }
}
// Elimina un proyecto por su id
exports.eliminarProyecto = async(req,resp)=>{
    try{
        // Revisar que existe un proyecto
        let compruebaProyecto = await Proyecto.findById(req.params.id);
        if(!compruebaProyecto){
            resp.status(404).json({msg:'proyecto no encontrado'});
        }
        // Verificar si el usuario que lo creo es el mismo que lo va a modificar
        if(compruebaProyecto.creador.toString() !== req.usuario.id){
            resp.status(404).json({msg:'No autorizado'});
        }
        // Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id});
        resp.status(200).json({msg:'proyect eliminado'});
    } catch(error){
        console.log(error);
        resp.status(500).send('ocurrio un error: '+error);
    }
  
}