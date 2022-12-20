const { Schema, model } = require('mongoose');

const BussinessSchema = Schema({

    name: {
        type: String,
        require: true
    },

    nit: {
        type: String
    },

    phone: {
        type: String
    },

    email: {
        type: String
    },

    address: {
        type: String
    },

    country: {
        type: String
    },

    state: {
        type: String
    },

    city: {
        type: String
    },

    verify: {
        type: Boolean,
        default: false
    },

    status: {
        type: Boolean,
        default: true
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

BussinessSchema.method('toJSON', function() {

    const { __v, _id, password, ...object } = this.toObject();
    object.bid = _id;
    return object;

});

module.exports = model('Bussiness', BussinessSchema);