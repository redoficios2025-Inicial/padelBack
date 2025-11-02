// ============================================
// 📁 src/index.js
// ============================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database'); 
const productosRoutes = require('./routes/productosRoutes');
const authRoutes = require('./routes/authRoutes');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// 🧩 Middlewares
// ============================================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// ❤️ Health check
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 🚏 Rutas principales
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);





// ============================================
// ⚠️ Manejo global de errores
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

// ============================================
// 🚀 Iniciar servidor
// ============================================
const startServer = async () => {
  try {
    // PRIMERO conectar a MongoDB
    await connectDB();
    
    // DESPUÉS iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
};

startServer();