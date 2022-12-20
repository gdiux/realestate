const { response } = require('express');

const State = require('../models/states.model');

/** =====================================================================
 *  GET STATES
=========================================================================*/
const getStates = async(req, res = response) => {

    try {

        await setTimeout(async() => {

            const states = await State.find()
                .sort({ name: 1 });

            res.json({
                ok: true,
                states
            });

        }, 500);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  GET STATES
=========================================================================*/

// EXPORTS
module.exports = {
    getStates
};