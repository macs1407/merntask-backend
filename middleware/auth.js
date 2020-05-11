const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    // Leer el token del header
    const token = req.header('x-auth-token');
    // Revisar si no hay token
    if(!token){
        res.status(401).json({msg:'No hay token, permiso no valido'});
    }
    // validar el token
    try{
        // cifrar el token
        const cifrar = jwt.verify(token,process.env.SECRETA);
        // En caso de que este bien
        req.usuario = cifrar.usuario;
        // Con next le decimos que se vaya al siguiente middleware
        next();
    } catch(error){
        res.status(401).json({msg:'token no valido'});
    }
}