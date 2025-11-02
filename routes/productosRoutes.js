// 📁 src/routes/productosRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const productosController = require('../controller/productosController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Rutas públicas (sin autenticación)
router.get('/', productosController.obtenerProductos);
router.get('/:codigo', productosController.obtenerProductoPorCodigo);

// ✅ Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, productosController.crearProducto);
router.put('/', authMiddleware, productosController.actualizarProducto);
router.delete('/', authMiddleware, productosController.eliminarProducto);

// ⚠️ IMPORTANTE: Exportar el router
module.exports = router;