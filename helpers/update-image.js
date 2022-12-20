const fs = require('fs');

// MODELS
const User = require('../models/users.model');
const Bussiness = require('../models/bussiness.model');
const Property = require('../models/properties.model');

/** =====================================================================
 *  DELETE IMAGE
=========================================================================*/
const deleteImage = async(path) => {

    // VALIDATE IMAGE
    if (fs.existsSync(path)) {
        // DELET IMAGE OLD
        fs.unlinkSync(path);
    }

};

/** =====================================================================
 *  DELETE IMAGE
=========================================================================*/


/** =====================================================================
 *  UPDATE IMAGE 
=========================================================================*/
const updateImage = async(tipo, id, nameFile, desc) => {

    let pathOld = '';

    switch (tipo) {
        case 'user':

            // SEARCH USER BY ID
            const user = await User.findById(id);
            if (!user) {
                return false;
            }

            // VALIDATE IMAGE
            pathOld = `./uploads/user/${ user.img }`;
            deleteImage(pathOld);

            // SAVE IMAGE
            user.img = nameFile;

            await user.save();
            return true;

            break;
        case 'bussiness':

            // SEARCH BUSSINESS BY ID
            const bussiness = await Bussiness.findById(id);
            if (!bussiness) {
                return false;
            }

            // VALIDATE IMAGE
            pathOld = `./uploads/bussiness/${ bussiness.img }`;
            deleteImage(pathOld);

            // SAVE IMAGE
            bussiness.img = nameFile;
            await bussiness.save();
            return true;

            break;
        case 'property':
            // SEARCH PROPERTY BY ID
            const property = await Property.findById(id);
            if (!property) {
                return false;
            }

            property.img.push({
                img: nameFile,
                fecha: new Date(Date.now())
            })

            await property.save();
            return true;

            break;
        default:
            break;
    }


};
/** =====================================================================
 *  UPDATE IMAGE
=========================================================================*/




// EXPORT
module.exports = {
    updateImage,
    deleteImage
};