// ✅ src/config/database.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://padel2025:padel2025@cluster0.3whkd4l.mongodb.net/tuDB?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB conectado EN LA CONSOLA`);
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB; // <-- export directo de la función
