const mongoose = require('mongoose');

const dbConection = async() => {

    try {

        mongoose.set('strictQuery', false);

        const connection = await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('DB Online');

    } catch (error) {

        console.log(error);
        throw new Error('Error al iniciar la BD');

    }

};

module.exports = {
    dbConection
};