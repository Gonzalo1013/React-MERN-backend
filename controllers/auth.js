const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generarJWT } = require('../helpers/jwt')

// La importacion del response e igualar res = response es para que funcione el intelicent de visualCode
const createUser = async(req, res = response ) => {

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ese correo ya esta en uso '
            });
        }

    user = new User( req.body );

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt );

    await user.save();
    //Generar JWT
    const token = await generarJWT( user.id, user.name );

    res.status(201).json({
        ok: true,
        uid: user.id,
        name: user.name,
        token
    })

    } catch(error) {
        console.log(error);
        
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el admin'
        })
    }

};

const loginUser = async(req, res = response ) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese mail '
            });
        }
        //Confirmar los password
        const validPassword = bcrypt.compareSync( password, user.password );
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
        // Generar muestro JWT
        const token = await generarJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })


    } catch(error) {
        console.log(error);   
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el admin'
        })
    }
   
}

const revalidToken = async(req, res = response ) => {

    const { uid, name } = req;
    // Generar JWT
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid,
        name,
        token,
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidToken,
}