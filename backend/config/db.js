const mongoose = require('mongoose');
require('dotenv').config();  // Carica le variabili d'ambiente dal file .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);  // Termina il processo se non riesce a connettersi al database
    }
};

module.exports = connectDB;
