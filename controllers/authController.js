const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async(req,resp)=>{
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return resp.status(400).json({errores:errores.array()})
    }
    // Extraer el email y password
    const {email, password} = req.body;

    try{
        console.log(email,password);
        // revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return resp.status(400).json({msg:'El correo no existe'})
        }
        // Comprobar el password
        const passwordCorrect = await bcryptjs.compare(password,usuario.password);
        if(!passwordCorrect){
            return resp.status(400).json({msg:'La contraseña es incorrecta'});
        }
        // Si todo es correcto, Crear y firmar el jsonwebtoken
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
    }
}