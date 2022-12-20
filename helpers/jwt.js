/**
 * JWT
 */

const jwt = require('jsonwebtoken');


const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        };

        jwt.sign(payload, process.env.SECRET_SEED_JWT, {
            expiresIn: '30d'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }

        });
    });

};

module.exports = {
    generarJWT
};