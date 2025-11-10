// ============================================
// 📁 routes/productosAdminRoutes.js (CORREGIDO)
// ============================================
const express = require('express');
const router = express.Router();
const productosAdminController = require('../controller/productosAdminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// ✅ RUTAS PARA EL DASHBOARD (requieren autenticación JWT)
// Admin puede ver todos los productos
router.get('/', authMiddleware, productosAdminController.obtenerProductos);
router.get('/unico', authMiddleware, productosAdminController.obtenerProductosAdmin);

// ✅ RUTAS PARA EL PANEL ADMIN (requieren ser admin)
// Solo admin puede crear/editar/eliminar
router.post('/unico', authMiddleware, adminMiddleware, productosAdminController.crearProducto);
router.put('/unico', authMiddleware, adminMiddleware, productosAdminController.actualizarProducto);
router.delete('/unico', authMiddleware, adminMiddleware, productosAdminController.eliminarProducto);

module.exports = router;


