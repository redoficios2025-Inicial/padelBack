// ============================================
// 📁 src/routes/productosPublicRoutes.js (CORREGIDO)
// ============================================
const express = require('express');
const router = express.Router();
const ProductoUsuario = require('../models/ProductoUsuario');

// ========================================
// GET: Productos PÚBLICOS (Solo editados por vendedores)
// Este endpoint es para HomePage - Solo muestra productos que vendedores personalizaron
// ========================================
router.get('/', async (req, res) => {
  try {
    console.log('🌐 GET /api/productos-publicos (HomePage)');
    console.log('Query params:', req.query);

    const { categoria } = req.query;

    // ✅ FILTRO CRÍTICO: Solo productos de ProductoUsuario con vendedorId
    const filtro = {
      soloUsuarios: true,
      stock: { $gt: 0 } // Solo productos con stock disponible
    };

    if (categoria && categoria !== 'todos') {
      filtro.categoria = categoria;
    }

    // ✅ Buscar SOLO en ProductoUsuario (productos personalizados por vendedores)
    const productosPublicos = await ProductoUsuario.find(filtro)
      .sort({ destacado: -1, createdAt: -1 });

    console.log(`✅ Productos públicos encontrados: ${productosPublicos.length}`);

    // ✅ Transformar y asegurar WhatsApp correcto
    const productosTransformados = productosPublicos.map(p => {
      const obj = p.toObject();
      return {
        ...obj,
        whatsapp: p.userWhatsapp || p.whatsappAdmin || "543462529718",
        productoVendedor: true, // Marcar que viene de un vendedor
      };
    });

    // Debug: Mostrar muestra
    if (productosTransformados.length > 0) {
      console.log('🔍 Muestra de productos públicos:', productosTransformados.slice(0, 2).map(p => ({
        nombre: p.nombre,
        vendedorId: p.vendedorId,
        stock: p.stock,
        whatsapp: p.whatsapp
      })));
    }

    res.json({
      success: true,
      data: productosTransformados,
      count: productosTransformados.length,
      message: productosTransformados.length === 0 
        ? 'No hay productos disponibles. Los vendedores aún no han publicado productos.'
        : `${productosTransformados.length} productos disponibles`
    });
  } catch (error) {
    console.error('❌ Error al obtener productos públicos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos públicos',
      error: error.message,
    });
  }
});

module.exports = router;
