const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Tentativo di connessione a MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/gestionale', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        // Abilita il logging delle query di Mongoose
        mongoose.set('debug', true);
        
        // Gestisci la disconnessione quando il processo viene terminato
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to application termination');
            process.exit(0);
        });
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
