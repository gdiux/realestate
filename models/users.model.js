const { Schema, model } = require('mongoose');

const LogSchema = Schema({
    ip: {
        type: String
    },
    fecha: {
        type: Date,
        default: Date.now()
    }
});

const WislistSchema = Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Propertys',
    },
    fecha: {
        type: Date,
        default: Date.now()
    }

})

const UserSchema = Schema({

    name: {
        type: String,
        require: true
    },

    phone: {
        type: String
    },

    email: {
        type: String,
        unique: true,
        require: true
    },

    password: {
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

    img: {
        type: String
    },

    description: {
        type: String
    },

    facebookr: {
        type: String
    },

    instagramr: {
        type: String
    },

    bussiness: {
        type: Schema.Types.ObjectId,
        ref: 'Bussiness',
    },

    type: {
        type: String,
        default: 'USER'
    },

    membership: {
        type: Boolean,
        default: false
    },

    vence: {
        type: Date
    },

    score: {
        type: Number,
        default: 0
    },

    verify: {
        type: Boolean,
        default: false
    },

    max: {
        type: Number,
        default: 5
    },

    google: {
        type: Boolean,
        default: false
    },

    facebook: {
        type: Boolean,
        default: false
    },

    log: [LogSchema],

    status: {
        type: Boolean,
        default: true
    },

    fecha: {
        type: Date,
        default: Date.now
    },

    wishlist: [WislistSchema]

});

UserSchema.method('toJSON', function() {

    const { __v, _id, password, ...object } = this.toObject();
    object.password = '********'
    object.uid = _id;
    return object;

});

module.exports = model('Users', UserSchema);