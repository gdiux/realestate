const { Schema, model } = require('mongoose');

const StatesSchema = Schema({

    name: {
        type: String,
        require: true
    },

    capital: {
        type: String
    },

});

StatesSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.stid = _id;
    return object;

});

module.exports = model('States', StatesSchema);