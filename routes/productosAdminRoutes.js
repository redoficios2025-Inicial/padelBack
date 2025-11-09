const express = require('express');
const router = express.Router();
const productosAdminController = require('../controller/productosAdminController');

// Middleware simple de autenticación
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'ADMIN_TOKEN_2024') {
        next();
    } else {
        return res.status(401).json({ success: false, message: 'No autorizado' });
    }
};

// Rutas
router.get('/', authMiddleware, productosAdminController.obtenerProductos);
router.post('/', authMiddleware, productosAdminController.crearProducto);
router.put('/', authMiddleware, productosAdminController.actualizarProducto);
router.delete('/', authMiddleware, productosAdminController.eliminarProducto);

module.exports = router;