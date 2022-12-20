const { response } = require('express');
const bcrypt = require('bcryptjs');

const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../models/users.model');
const { generarJWT } = require('../helpers/jwt');

/** =====================================================================
 *  GET USERS ID
=========================================================================*/
const getUserId = async(req, res = response) => {

    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(404).json({
                ok: false,
                msg: 'Error de ID'
            });
        }

        const userDB = await User.findById(id, 'name phone email country state city img description facebookr instagramr bussiness membership score verify status wishlist')
            .populate('bussiness');

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No hemos encontrado este usuario, porfavor intente nuevamente.'
            });
        }

        res.json({
            ok: true,
            user: userDB
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  GET USERS ID
=========================================================================*/

/** =====================================================================
 *  CREATE USERS
=========================================================================*/
const createUsers = async(req, res = response) => {

    try {

        let { email, password, terms } = req.body;

        if (!terms) {
            return res.status(400).json({
                ok: false,
                msg: 'No aceptaste los terminos y condiciones'
            });
        }


        setTimeout(async() => {

            email = email.toLowerCase();

            const validarEmail = await User.findOne({ email });
            if (validarEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Este email ya se encuentra registrado, porfavor verifique he intente nuevamente!'
                });
            }

            const user = new User(req.body);

            // ENCRYPTAR PASSWORD
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);
            user.email = email;
            user.name = user.name.toLowerCase();

            // SAVE USER
            await user.save();

            // Generar el TOKEN - JWT
            const token = await generarJWT(user.id);

            res.json({
                ok: true,
                user,
                token
            });

        }, 1000);



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
};
/** =====================================================================
 *  CREATE USERS
=========================================================================*/

/** =====================================================================
 *  SAVE WISHLIST
=========================================================================*/
const saveWishlist = async(req, res = response) => {

    try {

        const uid = req.uid;
        const property = req.params.property;

        if (!ObjectId.isValid(uid)) {
            return res.status(404).json({
                ok: false,
                msg: 'Error de ID'
            });
        }

        const userDB = await User.findById(uid)
            .populate('bussiness');

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No hemos encontrado este usuario, porfavor intente nuevamente.'
            });
        }

        userDB.wishlist.push({
            property,
            fecha: Date.now()
        })

        await userDB.save();

        const user = await User.findById(uid).populate('wishlist.property');

        res.json({
            ok: true,
            user
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }

}

/** =====================================================================
 *  SAVE WISHLIST
=========================================================================*/

/** =====================================================================
 *  UPDATE USER
=========================================================================*/
const updateUser = async(req, res = response) => {

    const uid = req.uid;

    try {

        if (!ObjectId.isValid(uid)) {
            return res.status(404).json({
                ok: false,
                msg: 'Error de ID'
            });
        }

        // SEARCH USER
        const userDB = await User.findById(uid);
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Error con este perfil: CODE 195'
            });
        }
        // SEARCH USER

        // VALIDATE USER
        let { password, email, ...campos } = req.body;
        email = email.toLowerCase();

        if (userDB.email !== email) {
            const validarEmail = await User.findOne({ email });
            if (validarEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con este email'
                });
            }
        }

        if (password) {
            // ENCRYPTAR PASSWORD
            const salt = bcrypt.genSaltSync();
            campos.password = bcrypt.hashSync(password, salt);
        }

        // UPDATE
        campos.email = email;
        const userUpdate = await User.findByIdAndUpdate(uid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            user: userUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }

};
/** =====================================================================
 *  UPDATE USER
=========================================================================*/
/** =====================================================================
 *  DELETE USER
=========================================================================*/
const deleteUser = async(req, res = response) => {

    const id = req.uid;
    const uid = req.params.id;

    try {

        // SEARCH DEPARTMENT
        const userDB = await User.findById({ _id: uid });
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }
        // SEARCH DEPARTMENT

        // CHANGE STATUS
        if (userDB.status === true) {

            if (id !== uid) {
                userDB.status = false;
            }

        } else {
            userDB.status = true;
        }
        // CHANGE STATUS

        const userUpdate = await User.findByIdAndUpdate(uid, userDB, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            user: userUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  DELETE USER
=========================================================================*/


// EXPORTS
module.exports = {
    createUsers,
    updateUser,
    deleteUser,
    getUserId,
    saveWishlist
};