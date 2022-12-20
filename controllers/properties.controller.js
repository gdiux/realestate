const { response } = require('express');
const ObjectId = require('mongoose').Types.ObjectId;

const Property = require('../models/properties.model');
const User = require('../models/users.model');

/** =====================================================================
 *  GET PROPERTIES
=========================================================================*/
const getQueryProperties = async(req, res = response) => {

    try {

        const { sort, page, query, limit = 15 } = req.body;
        query.status = true;
        query.vendida = false;

        const skip = Number(page * limit);

        const properties = await Property.find(query)
            .populate('seller', 'name phone email country state city img description facebookr instagramr bussiness type membership score verify fecha uid')
            .populate('seller.bussiness')
            .sort(sort)
            .skip(skip)
            .limit(limit)

        res.json({
            ok: true,
            properties,
            total: properties.length
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

}


/** =====================================================================
 *  GET PROPERTY SELLER
=========================================================================*/
const getPropertySeller = async(req, res = response) => {

    try {

        const limit = Number(req.query.limit) || 15;
        const page = Number(req.query.page) || 0;

        const uid = req.params.uid;

        if (!ObjectId.isValid(uid)) {
            return res.status(404).json({
                ok: false,
                msg: 'Error en el ID de la propiedad'
            });
        }

        const [properties, total] = await Promise.all([

            Property.find({ seller: uid })
            .skip((page * limit))
            .limit(limit),
            Property.countDocuments({ seller: uid })

        ])

        // const properties = await Property.find({ seller: uid })
        //     .skip((page * limit))
        //     .limit(limit);

        setTimeout(() => {
            res.json({
                ok: true,
                properties,
                total
            });
        }, 1000);


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }
};
/** =====================================================================
 *  GET PROPERTY SELLER
=========================================================================*/

/** =====================================================================
 *  GET PROPERTY ID
=========================================================================*/
const getPropertyId = async(req, res = response) => {

    try {
        const pid = req.params.id;

        if (!ObjectId.isValid(pid)) {
            return res.status(404).json({
                ok: false,
                msg: 'Error en el ID de la propiedad'
            });
        }

        const property = await Property.findById(pid)
            .populate('seller', 'name phone email country state city img description facebookr instagramr bussiness type membership score verify fecha uid')
            .populate('seller.bussiness');

        if (!property) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe una propiedad con este ID'
            });
        }

        await setTimeout(() => {

            res.json({
                ok: true,
                property
            });
        }, 1000);

        return;

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }
};
/** =====================================================================
 *  GET PROPERTY ID
=========================================================================*/

/** =====================================================================
 *  POST PROPERTY
=========================================================================*/
const postProperty = async(req, res = response) => {

    try {

        const uid = req.uid;
        const seller = await User.findById(uid);

        let { terms } = req.body;

        if (!terms) {
            return res.status(400).json({
                ok: false,
                msg: 'No aceptaste los terminos y condiciones'
            });
        }

        const properties = await Property.find({ seller: uid });
        if (seller.max === properties.length) {
            return res.status(400).json({
                ok: false,
                msg: 'Lo sentimos, ya has alcanzado el maximo de publicaciones, es necesario una subscripción'
            });
        }

        await setTimeout(async() => {

            const property = new Property(req.body);
            property.seller = uid;

            // SAVE PROPERTY
            await property.save();

            res.json({
                ok: true,
                property
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
 *  POST PROPERTY
=========================================================================*/

/** =====================================================================
 *  PUT PROPERTY
=========================================================================*/
const putProperty = async(req, res = response) => {

    try {

        const uid = req.uid;
        const pid = req.params.id;

        if (!ObjectId.isValid(pid)) {
            return res.status(404).json({
                ok: false,
                msg: 'Error en el ID de la propiedad'
            });
        }

        const propertyDB = await Property.findById(pid);
        if (!propertyDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun propiedad con este ID'
            });
        }

        if (uid !== (String)(new ObjectId(propertyDB.seller))) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes los privilegios para editar esta propiedad'
            });
        }

        await setTimeout(async() => {

            const {...campos } = req.body;

            const propertyUpdate = await Property.findByIdAndUpdate(pid, campos, { new: true, useFindAndModify: false });

            res.json({
                ok: true,
                property: propertyUpdate
            });

        }, 1000);

        return;

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  PUT PROPERTY
=========================================================================*/

// EXPORTS
module.exports = {
    postProperty,
    getPropertySeller,
    getPropertyId,
    putProperty,
    getQueryProperties
};