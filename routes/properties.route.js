/** =====================================================================
 *  USER ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// CONTROLLERS
const { getPropertySeller, postProperty, getPropertyId, putProperty, getQueryProperties, postViews } = require('../controllers/properties.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

/** =====================================================================
 *  GET ALL PROPERTIES OF SELLER
=========================================================================*/
router.get('/seller/:uid', getPropertySeller);
/** =====================================================================
 *  GET ALL PROPERTIES OF SELLER
=========================================================================*/

/** =====================================================================
 *  GET PROPERTY ID
=========================================================================*/
router.get('/property/:id', getPropertyId);
/** =====================================================================
 *  GET PROPERTY ID
=========================================================================*/

/** =====================================================================
 *  POST PROPERTY
=========================================================================*/
router.post('/', [
        validarJWT,
        check('name', 'El nombre es olbigatorio').not().isEmpty(),
        check('category', 'La categoria es olbigatoria').not().isEmpty(),
        check('type', 'El tipo es olbigatorio').not().isEmpty(),
        check('pais', 'El pais es olbigatorio').not().isEmpty(),
        check('state', 'El estado es olbigatorio').not().isEmpty(),
        check('city', 'La ciudad es olbigatoria').not().isEmpty(),
        check('address', 'La dirección es olbigatoria').not().isEmpty(),
        check('postal', 'El codigo postal es olbigatorio').not().isEmpty(),
        check('price', 'El precio es olbigatorio').not().isEmpty(),
        check('area', 'El area es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    postProperty
);
/** =====================================================================
 *  POST PROPERTY
=========================================================================*/

/** =====================================================================
 *  POST PROPERTY
=========================================================================*/
router.post('/views/:pid', [
        check('views', 'El nombre es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    postViews
);
/** =====================================================================
*  POST PROPERTY
=========================================================================*/

/** =====================================================================
 *  POST QUERY
=========================================================================*/
router.post('/query', getQueryProperties);
/** =====================================================================
 *  POST QUERY
=========================================================================*/

/** =====================================================================
 *  PUT PROPERTY
=========================================================================*/
router.put('/:id', validarJWT, putProperty);
/** =====================================================================
 *  PUT PROPERTY
=========================================================================*/

// EXPORT
module.exports = router;