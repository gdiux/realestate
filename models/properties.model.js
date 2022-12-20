const { Schema, model } = require('mongoose');

const MapSchema = Schema({
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }
});

const ViewSchema = Schema({
    ip: {
        type: String,
        require: true
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


});

const ImgSchema = Schema({

    img: {
        type: String
    },

    fecha: {
        type: Date
    }

});

const AmenitieSchema = Schema({
    name: {
        type: String
    },

    icon: {
        type: String
    },

    active: {
        type: Boolean,
        default: false
    },
});

const CommentSchema = Schema({
    msg: {
        type: String,
        require: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },

    fecha: {
        type: Date
    }
});

const PropertySchema = Schema({

    name: {
        type: String,
        require: true
    },

    category: {
        type: String
    },

    type: {
        type: String
    },

    pais: {
        type: String
    },

    state: {
        type: String
    },

    city: {
        type: String
    },

    address: {
        type: String
    },

    postal: {
        type: String
    },

    description: {
        type: String
    },

    price: {
        type: Number
    },

    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },

    img: [ImgSchema],

    video: [ImgSchema],

    mapa: MapSchema,

    views: [ViewSchema],

    comments: [CommentSchema],

    area: {
        type: String
    },

    rooms: {
        type: Number
    },

    bathrooms: {
        type: Number
    },

    garage: {
        type: Number
    },

    amenities: [AmenitieSchema],

    pets: {
        type: Boolean,
        default: false
    },

    nueva: {
        type: Boolean,
        default: false
    },

    verify: {
        type: Boolean,
        default: false
    },

    vendida: {
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

PropertySchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.pid = _id;
    return object;

});

module.exports = model('Propertys', PropertySchema);