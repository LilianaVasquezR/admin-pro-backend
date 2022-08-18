const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

//Consultar usuario
const getUsuarios = async (req, res) => {
    
    const desde = Number(req.query.desde) || 0; // se maneja una excepcion con || 0 por si no se le pone desde para la paginacion  
   // Ambas promesas se ejecutan de manera simultanea 
   const [ usuarios, total ] = await Promise.all([
        Usuario  
            .find({}, 'nombre email role google img') // se realiza un filtro para los campos que se quieren mostrar
            .skip( desde ) // se utiliza para hacer la paginacion
             .limit( 5 ), // limite para hacer la paginacion  en esta caso va de 5 

        Usuario.countDocuments()
   ]);

    res.json({
        ok:true,
        usuarios,
        total
    });

}
// Crear usuario
const crearUsuarios = async(req, res = response) => {

    const { email, password } = req.body;


    try {
       
        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        // Guardar Usuario
        await usuario.save();
        
        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
        ok:true,
        usuario,
        token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });

    }
  
}

//Actualiza usaurio
const actualizarUsuario = async (req, res = response) => {

    //TODO: Validar token y comprobar si es el usuario correcto
 
    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        //Actualizaciones
        const {password, google, email, ...campos} = req.body;

        if ( usuarioDB.email !== email ){

            const existeEmail = await Usuario.findOne({ email});
            if ( existeEmail ) {
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if ( !usuarioDB.google ) {
            campos.email = email;
        } else if ( usuarioDB.email !== email ) {
            return res.status(400).json({
                ok:false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true} );

        res.json({
            ok:true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}



const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);


        res.json ({
            ok: true,
            msj: 'Usuario Eliminado'
        });
    } catch {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        });

    }
}



module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
}