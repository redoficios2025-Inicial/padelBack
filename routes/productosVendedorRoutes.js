// // ============================================
// // 📁 src/routes/productosVendedorRoutes.js (ACTUALIZADO)
// // ============================================
// const express = require('express');
// const router = express.Router();
// const productosController = require('../controller/productosController');

// // ========================================
// // GET: Obtener productos del VENDEDOR específico
// // Este endpoint es SOLO para el panel de vendedor
// // ========================================
// router.get('/', async (req, res) => {
//   try {
//     console.log('📦 GET /api/productos-vendedor (Panel Vendedor)');
//     console.log('Query params:', req.query);

//     const Producto = require('../models/Producto');
//     const ProductoAdmin = require('../models/ProductoAdmin');

//     const { categoria, vendedorId } = req.query;

//     // ✅ Si se solicita un vendedor específico, devolver sus productos
//     if (vendedorId) {
//       const filtro = {
//         vendedorId: vendedorId,
//         productoVendedor: true
//       };

//       if (categoria && categoria !== 'todos') {
//         filtro.categoria = categoria;
//       }

//       const productosVendedor = await Producto.find(filtro).sort({ createdAt: -1 });

//       console.log(`✅ Productos del vendedor ${vendedorId}: ${productosVendedor.length}`);

//       return res.json({
//         success: true,
//         data: productosVendedor.map(p => ({
//           ...p.toObject(),
//           whatsapp: p.userWhatsapp || p.whatsappAdmin || "543462529718"
//         })),
//         count: productosVendedor.length,
//       });
//     }

//     // ✅ Si no hay vendedorId, devolver productos admin para seleccionar
//     const filtroAdmin = { productoAdmin: true };
//     if (categoria && categoria !== 'todos') {
//       filtroAdmin.categoria = categoria;
//     }

//     const productosAdmin = await ProductoAdmin.find(filtroAdmin).sort({ createdAt: -1 });

//     console.log(`✅ Productos admin disponibles: ${productosAdmin.length}`);

//     res.json({
//       success: true,
//       data: productosAdmin.map(p => ({
//         ...p.toObject(),
//         precio: p.precioAdminFijo,
//         precioFinal: p.precioAdminFijo,
//         recargos: { transporte: 0, margen: 0, otros: 0 },
//         descuento: 0,
//       })),
//       count: productosAdmin.length,
//     });
//   } catch (error) {
//     console.error('❌ Error al obtener productos:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al obtener productos',
//       error: error.message,
//     });
//   }
// });

// // ========================================
// // POST: Crear producto del vendedor
// // ========================================
// router.post('/', async (req, res) => {
//   console.log('📦 POST /api/productos-vendedor');
//   console.log('Body recibido:', JSON.stringify(req.body, null, 2));
  
//   await productosController.crearProducto(req, res);
// });

// // ========================================
// // PUT: Actualizar producto del vendedor
// // ========================================
// router.put('/:id', async (req, res) => {
//   console.log('📦 PUT /api/productos-vendedor/:id');
//   console.log('ID:', req.params.id);
//   console.log('Body:', req.body);
  
//   await productosController.actualizarProducto(req, res);
// });

// // ========================================
// // DELETE: Eliminar producto del vendedor
// // ========================================
// router.delete('/:id', async (req, res) => {
//   console.log('📦 DELETE /api/productos-vendedor/:id');
//   console.log('ID:', req.params.id);
//   console.log('Query:', req.query);
  
//   await productosController.eliminarProducto(req, res);
// });



// // ✅ AGREGAR esta ruta en productosVendedorRoutes.js DESPUÉS de las otras rutas:

// // ========================================
// // POST: Publicar/actualizar producto en ProductoUsuario
// // ========================================
// router.post('/publicar/:id', async (req, res) => {
//   console.log('🚀 POST /api/productos-vendedor/publicar/:id');
//   console.log('ID:', req.params.id);
//   console.log('Body:', req.body);
  
//   try {
//     const { id } = req.params;
//     const ProductoUsuario = require('../models/ProductoUsuario');
//     const Producto = require('../models/Producto');
    
//     // Verificar que el producto existe
//     const productoVendedor = await Producto.findById(id);
    
//     if (!productoVendedor) {
//       return res.status(404).json({
//         success: false,
//         message: 'Producto no encontrado'
//       });
//     }
    
//     // Datos para ProductoUsuario
//     const datosPublicos = {
//       productoAdminId: productoVendedor.productoAdminId,
//       productoVendedorId: id,
//       vendedorId: productoVendedor.vendedorId,
//       codigo: productoVendedor.codigo,
//       nombre: productoVendedor.nombre,
//       marca: productoVendedor.marca,
//       descripcion: productoVendedor.descripcion,
//       stock: productoVendedor.stock,
//       precio: productoVendedor.precio,
//       precioFinal: productoVendedor.precioFinal,
//       moneda: productoVendedor.moneda,
//       descuento: productoVendedor.descuento,
//       categoria: productoVendedor.categoria,
//       destacado: productoVendedor.destacado,
//       imagenUrl: productoVendedor.imagenUrl,
//       whatsappAdmin: productoVendedor.whatsappAdmin,
//       userWhatsapp: productoVendedor.userWhatsapp,
//       recargos: productoVendedor.recargos,
//       soloUsuarios: true,
//       soloVendedores: false,
//       productoAdmin: false,
//     };
    
//     // ✅ UPSERT: Crear o actualizar
//     const productoPublico = await ProductoUsuario.findOneAndUpdate(
//       { 
//         productoVendedorId: id,
//         vendedorId: productoVendedor.vendedorId
//       },
//       datosPublicos,
//       { 
//         upsert: true,
//         new: true,
//         setDefaultsOnInsert: true
//       }
//     );
    
//     console.log('✅ Producto publicado:', productoPublico._id);
    
//     res.json({
//       success: true,
//       message: 'Producto publicado en la tienda exitosamente',
//       data: productoPublico
//     });
//   } catch (error) {
//     console.error('❌ Error al publicar producto:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al publicar producto',
//       error: error.message
//     });
//   }
// });

// module.exports = router;


// ============================================
// 📁 src/routes/productosVendedorRoutes.js (VERSIÓN COMPLETA ACTUALIZADA)
// ============================================
const express = require('express');
const router = express.Router();
const productosController = require('../controller/productosController');

// ========================================
// GET: Obtener productos del VENDEDOR específico
// Este endpoint es SOLO para el panel de vendedor
// ========================================
router.get('/', async (req, res) => {
  try {
    console.log('📦 GET /api/productos-vendedor (Panel Vendedor)');
    console.log('Query params:', req.query);

    const Producto = require('../models/Producto');
    const ProductoAdmin = require('../models/ProductoAdmin');

    const { categoria, vendedorId } = req.query;

    // ✅ Si se solicita un vendedor específico, devolver sus productos
    if (vendedorId) {
      const filtro = {
        vendedorId: vendedorId,
        productoVendedor: true
      };

      if (categoria && categoria !== 'todos') {
        filtro.categoria = categoria;
      }

      const productosVendedor = await Producto.find(filtro).sort({ createdAt: -1 });

      console.log(`✅ Productos del vendedor ${vendedorId}: ${productosVendedor.length}`);

      return res.json({
        success: true,
        data: productosVendedor.map(p => ({
          ...p.toObject(),
          whatsapp: p.userWhatsapp || p.whatsappAdmin || "543462529718"
        })),
        count: productosVendedor.length,
      });
    }

    // ✅ Si no hay vendedorId, devolver productos admin para seleccionar
    const filtroAdmin = { productoAdmin: true };
    if (categoria && categoria !== 'todos') {
      filtroAdmin.categoria = categoria;
    }

    const productosAdmin = await ProductoAdmin.find(filtroAdmin).sort({ createdAt: -1 });

    console.log(`✅ Productos admin disponibles: ${productosAdmin.length}`);

    res.json({
      success: true,
      data: productosAdmin.map(p => ({
        ...p.toObject(),
        precio: p.precioAdminFijo,
        precioFinal: p.precioAdminFijo,
        recargos: { transporte: 0, margen: 0, otros: 0 },
        descuento: 0,
      })),
      count: productosAdmin.length,
    });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message,
    });
  }
});

// ========================================
// 🆕 GET: Obtener productos PÚBLICOS del vendedor
// (Los que están en ProductoUsuario)
// ========================================
router.get('/publicos', async (req, res) => {
  try {
    console.log('🏪 GET /api/productos-vendedor/publicos');
    console.log('Query params:', req.query);

    const ProductoUsuario = require('../models/ProductoUsuario');
    const { vendedorId, categoria } = req.query;

    if (!vendedorId) {
      return res.status(400).json({
        success: false,
        message: 'vendedorId es requerido'
      });
    }

    const filtro = {
      vendedorId: vendedorId,
      soloUsuarios: true
    };

    if (categoria && categoria !== 'todos') {
      filtro.categoria = categoria;
    }

    const productosPublicos = await ProductoUsuario.find(filtro).sort({ createdAt: -1 });

    console.log(`✅ Productos públicos del vendedor ${vendedorId}: ${productosPublicos.length}`);

    res.json({
      success: true,
      data: productosPublicos,
      count: productosPublicos.length,
      message: `Se encontraron ${productosPublicos.length} productos públicos`
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

// ========================================
// 🆕 DELETE: Eliminar producto PÚBLICO (solo de ProductoUsuario)
// NO elimina el producto del panel de vendedor
// ========================================
router.delete('/publicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { vendedorId } = req.query;

    console.log(`🗑️ DELETE /api/productos-vendedor/publicos/${id}`);
    console.log('VendedorId:', vendedorId);

    if (!id || !vendedorId) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto y vendedorId son requeridos'
      });
    }

    const ProductoUsuario = require('../models/ProductoUsuario');

    // ✅ Buscar el producto público
    const productoPublico = await ProductoUsuario.findOne({
      _id: id,
      vendedorId: vendedorId
    });

    if (!productoPublico) {
      return res.status(404).json({
        success: false,
        message: 'Producto público no encontrado o no tienes permiso para eliminarlo'
      });
    }

    // ✅ Eliminar SOLO de ProductoUsuario
    await ProductoUsuario.findByIdAndDelete(id);

    console.log(`✅ Producto público eliminado: ${productoPublico.nombre}`);
    console.log(`ℹ️ El producto vendedor ${productoPublico.productoVendedorId} NO fue eliminado`);

    res.json({
      success: true,
      message: 'Producto eliminado de la tienda pública exitosamente',
      data: {
        _id: productoPublico._id,
        nombre: productoPublico.nombre,
        productoVendedorId: productoPublico.productoVendedorId
      }
    });
  } catch (error) {
    console.error('❌ Error al eliminar producto público:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto público',
      error: error.message
    });
  }
});

// ========================================
// POST: Crear producto del vendedor
// ========================================
router.post('/', async (req, res) => {
  await productosController.crearProducto(req, res);
});

// ========================================
// PUT: Actualizar producto del vendedor
// ========================================
router.put('/:id', async (req, res) => {
  console.log('📦 PUT /api/productos-vendedor/:id');
  await productosController.actualizarProducto(req, res);
});

// ========================================
// DELETE: Eliminar producto del vendedor
// ========================================
router.delete('/:id', async (req, res) => {
  console.log('📦 DELETE /api/productos-vendedor/:id');
  await productosController.eliminarProducto(req, res);
});

// ========================================
// POST: Sincronizar productos del admin
// ========================================
router.post('/sincronizar', async (req, res) => {
  try {
    console.log('🔄 POST /api/productos-vendedor/sincronizar');
    
    const vendedorId = req.user?.id || req.body.vendedorId;
    
    if (!vendedorId) {
      return res.status(400).json({
        success: false,
        message: 'vendedorId es requerido'
      });
    }

    const ProductoAdmin = require('../models/ProductoAdmin');
    const Producto = require('../models/Producto');

    // Obtener todos los productos admin
    const productosAdmin = await ProductoAdmin.find({ productoAdmin: true });

    // Obtener los productos que ya tiene el vendedor
    const productosVendedor = await Producto.find({ 
      vendedorId: vendedorId,
      productoVendedor: true 
    });

    const idsYaPersonalizados = productosVendedor.map(p => p.productoAdminId?.toString());

    // Filtrar productos nuevos
    const productosNuevos = productosAdmin.filter(
      p => !idsYaPersonalizados.includes(p._id.toString())
    );

    console.log(`📊 Total productos admin: ${productosAdmin.length}`);
    console.log(`📊 Ya tiene personalizados: ${idsYaPersonalizados.length}`);
    console.log(`📊 Productos nuevos: ${productosNuevos.length}`);

    res.json({
      success: true,
      data: {
        totalAdmin: productosAdmin.length,
        yaPersonalizados: idsYaPersonalizados.length,
        productosNuevos: productosNuevos.length
      },
      message: productosNuevos.length > 0 
        ? `Hay ${productosNuevos.length} productos nuevos disponibles` 
        : 'Ya tienes todos los productos sincronizados'
    });
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
    res.status(500).json({
      success: false,
      message: 'Error al sincronizar productos',
      error: error.message
    });
  }
});

// ========================================
// POST: Publicar/actualizar producto en ProductoUsuario
// ========================================
router.post('/publicar/:id', async (req, res) => {  
  try {
    const { id } = req.params;
    const ProductoUsuario = require('../models/ProductoUsuario');
    const Producto = require('../models/Producto');
    
    // Verificar que el producto existe
    const productoVendedor = await Producto.findById(id);
    
    if (!productoVendedor) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Datos para ProductoUsuario
    const datosPublicos = {
      productoAdminId: productoVendedor.productoAdminId,
      productoVendedorId: id,
      vendedorId: productoVendedor.vendedorId,
      codigo: productoVendedor.codigo,
      nombre: productoVendedor.nombre,
      marca: productoVendedor.marca,
      descripcion: productoVendedor.descripcion,
      stock: productoVendedor.stock,
      precio: productoVendedor.precio,
      precioFinal: productoVendedor.precioFinal,
      moneda: productoVendedor.moneda,
      descuento: productoVendedor.descuento,
      categoria: productoVendedor.categoria,
      destacado: productoVendedor.destacado,
      imagenUrl: productoVendedor.imagenUrl,
      whatsappAdmin: productoVendedor.whatsappAdmin,
      userWhatsapp: productoVendedor.userWhatsapp,
      recargos: productoVendedor.recargos,
      soloUsuarios: true,
      soloVendedores: false,
      productoAdmin: false,
    };
    
    // ✅ UPSERT: Crear o actualizar
    const productoPublico = await ProductoUsuario.findOneAndUpdate(
      { 
        productoVendedorId: id,
        vendedorId: productoVendedor.vendedorId
      },
      datosPublicos,
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
    
    console.log('✅ Producto publicado:', productoPublico._id);
    
    res.json({
      success: true,
      message: 'Producto publicado en la tienda exitosamente',
      data: productoPublico
    });
  } catch (error) {
    console.error('❌ Error al publicar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al publicar producto',
      error: error.message
    });
  }
});

module.exports = router;
