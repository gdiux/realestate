//

const path = require('path');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

const sharp = require('sharp');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

// HELPERS
const { updateImage } = require('../helpers/update-image');

// MODELS
const Property = require('../models/properties.model');

/** =====================================================================
 *  UPLOADS
=========================================================================*/
const fileUpload = async(req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;
    const desc = req.query.desc || 'img';

    const validType = ['user', 'bussiness', 'property'];

    // VALID TYPES
    if (!validType.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo es invalido'
        });
    }

    // VALIDATE IMAGE
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No has seleccionado ningún archivo'
        });
    }

    // PROCESS IMAGE
    const file = await sharp(req.files.image.data).metadata();

    // const nameShort = file.format.split('.');
    const extFile = file.format;

    // VALID EXT
    const validExt = ['jpg', 'png', 'jpeg', 'webp', 'bmp', 'svg'];
    if (!validExt.includes(extFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'No se permite este tipo de imagen, solo extenciones JPG - PNG - WEBP - SVG'
        });
    }
    // VALID EXT

    // GENERATE NAME UID
    const nameFile = `${ uuidv4() }.webp`;

    // PATH IMAGE
    const path = `./uploads/${ tipo }/${ nameFile }`;

    // CONVERTIR A WEBP
    if (tipo === 'user' || tipo === 'bussiness') {
        sharp(req.files.image.data)
            .webp({ equality: 75, effort: 6 })
            .resize(200, 200)
            .toFile(path, (err, info) => {

                // UPDATE IMAGE
                updateImage(tipo, id, nameFile, desc);

                res.json({
                    ok: true,
                    msg: 'Imagen Actualizada',
                    nombreArchivo: nameFile,
                    date: Date.now()
                });

            });
    } else {

        sharp(req.files.image.data)
            .webp({ equality: 75, effort: 6 })
            .resize(1024, 768)
            .toFile(path, (err, info) => {

                // UPDATE IMAGE
                updateImage(tipo, id, nameFile, desc);

                res.json({
                    ok: true,
                    msg: 'Imagen Actualizada',
                    nombreArchivo: nameFile,
                    date: Date.now()
                });

            });

    }


};
/** =====================================================================
 *  UPLOADS
=========================================================================*/
/** =====================================================================
 *  GET IMAGES
=========================================================================*/
const getImages = (req, res = response) => {

    const tipo = req.params.tipo;
    const image = req.params.image;
    const r = req.query.r;
    const w = Number(req.query.w);
    const h = Number(req.query.h);

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${image}`);

    // IMAGE DEFAULT
    if (fs.existsSync(pathImg)) {

        res.sendFile(pathImg);

    } else {

        // CHECK TYPE
        if (tipo !== 'user') {
            const pathImg = path.join(__dirname, `../uploads/default.webp`);
            res.sendFile(pathImg);
        } else {
            const pathImg = path.join(__dirname, `../uploads/user/user-default.webp`);
            res.sendFile(pathImg);
        }

    }

};
/** =====================================================================
 *  GET IMAGES
=========================================================================*/

/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/
const deleteImg = async(req, res = response) => {

    try {

        const uid = req.uid;
        const type = req.params.type;
        const id = req.params.id;
        const img = req.params.img;

        switch (type) {
            case 'property':

                // COMPROVAR QUE EL ID ES VALIDO
                if (!ObjectId.isValid(id)) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Error en el ID de la propiedad'
                    });
                }

                const propertyDB = await Property.findById(id);
                if (!propertyDB) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'No existe ningun propiedad con este ID'
                    });
                }

                // VER SI EL USUARIO TIENE LOS PRIVILEGIOS
                if (uid !== (String)(new ObjectId(propertyDB.seller))) {
                    return res.status(401).json({
                        ok: false,
                        msg: 'No tienes los privilegios para eliminar esta imagen'
                    });
                }

                const deleteImgProperty = await Property.updateOne({ _id: id }, { $pull: { img: { img } } });


                // VERIFICAR SI SE ACTUALIZO
                if (deleteImgProperty.nModified === 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No se pudo eliminar esta imagen, porfavor intente de nuevo'
                    });
                }

                // ELIMINAR IMAGEN DE LA CARPETA
                const path = `./uploads/${ type }/${ img }`;
                if (fs.existsSync(path)) {
                    // DELET IMAGE OLD
                    fs.unlinkSync(path);
                }

                const property = await Property.findById(id)
                    .populate('seller', 'name phone email country state city img description facebookr instagramr bussiness type membership score verify fecha uid')
                    .populate('seller.bussiness');

                res.json({
                    ok: true,
                    property
                });

                break;


            default:

                return res.status(400).json({
                    ok: false,
                    msg: 'Ha ocurrido un error, porfavor intente de nuevo'
                });
                break;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/

// EXPORTS
module.exports = {
    fileUpload,
    getImages,
    deleteImg
};