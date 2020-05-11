const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async(req, resp)=>{
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return resp.status(400).json({errores:errores.array()})
    }
    const {email, password} = req.body;
    // Siempre utilizar try/cath
    try{
        // Revisar el email sea unico
        let usuario = await Usuario.findOne({email});
        // Si encuentra un usuario arroja error
        if(usuario){
            return resp.status(400).json({msg:'El usuario ya existe'});
        }
        debugger
        // Crear el nuevo usuario
        usuario = new Usuario(req.body);
        // hacer el hash
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password,salt);
        // Guardar usuario
        await usuario.save();
        // Crear y firmar el jsonwebtoken
        const payload = {
            usuario:{
                id:usuario.id // El usuario.id viene del usuario que se esta guardando
            }
        };
        // Firmar el JWT, expira en 1 hora
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn: 3600 
        },(error, token)=>{
            if(error) throw error;
            // Mensaje de confirmacion
            resp.send({token:token});
        });
        
    } catch(error){
        console.log(error);
        resp.status(400).send('hubo un error');
    }
}

exports.usuarioAutenticado = async(req,resp)=>{
    try{
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        resp.json(usuario);
    }catch(error){
        resp.status(500).json({msg:'Hubo un error'});
    }
}