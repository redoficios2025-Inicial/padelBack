// ============================================
// 📁 server.js (ACTUALIZADO)
// ============================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productosAdminRoutes = require('./routes/productosAdminRoutes');
const productosVendedorRoutes = require('./routes/productosVendedorRoutes');
const productosPublicRoutes = require('./routes/productosPublicRoutes'); // ✅ NUEVO

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARES
// ========================================
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://newpadel-teal.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// LOGGING MIDDLEWARE
// ========================================
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  console.log('Headers:', req.headers.authorization ? 'Token presente' : 'Sin token');
  next();
});

// ========================================
// HEALTH CHECK
// ========================================
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    routes: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/productos (productos admin)',
      'GET /api/productos-publicos (productos para usuarios finales)', // ✅ NUEVO
      'GET /api/productos-vendedor (productos del vendedor)',
      'POST /api/productos-vendedor (crear producto vendedor)',
      'PUT /api/productos-vendedor/:id (actualizar producto)',
      'DELETE /api/productos-vendedor/:id (eliminar producto)'
    ]
  });
});

// ========================================
// RUTAS
// ========================================
app.use('/api/auth', authRoutes);

// ✅ Productos Admin (para el panel de vendedor - seleccionar)
app.use('/api/productos', productosAdminRoutes);

// ✅ Productos Públicos (para HomePage - solo lectura)
app.use('/api/productos-publicos', productosPublicRoutes);

// ✅ Productos del Vendedor (CRUD completo para vendedores)
app.use('/api/productos-vendedor', productosVendedorRoutes);

// Admin productos (CRUD de admin)
app.use('/api/productosadmin', productosAdminRoutes);

// ========================================
// MANEJO DE ERRORES 404
// ========================================
app.use((req, res) => {
  console.log('❌ Ruta no encontrada:', req.path);
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    availableRoutes: [
      'GET /api/productos',
      'GET /api/productos-publicos',
      'GET /api/productos-vendedor',
      'POST /api/productos-vendedor',
      'PUT /api/productos-vendedor/:id',
      'DELETE /api/productos-vendedor/:id'
    ]
  });
});

// ========================================
// MANEJO DE ERRORES GLOBAL
// ========================================
app.use((err, req, res, next) => {
  console.error('❌ Error capturado:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📝 Logs disponibles en consola`);
      console.log(`🔍 Health check: http://localhost:${PORT}/`);
      console.log(`\n📋 RUTAS IMPORTANTES:`);
      console.log(`   🏪 Admin: http://localhost:${PORT}/api/productos`);
      console.log(`   🌐 Públicos: http://localhost:${PORT}/api/productos-publicos`);
      console.log(`   👤 Vendedor: http://localhost:${PORT}/api/productos-vendedor\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
