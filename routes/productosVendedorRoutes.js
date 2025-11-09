// // ============================================
// // 📁 src/routes/productosVendedorRoutes.js (ACTUALIZADO)
// // ============================================
// const express = require('express');
// const router = express.Router();
// const productosController = require('../controller/productosController');
// const productoUserController = require('../controller/productoUserController');

// // ========================================
// // GET: Obtener TODOS los productos (vendedor + usuario)
// // ========================================
// router.get('/', async (req, res) => {
//   try {
//     console.log('📦 GET /api/productos-vendedor');
//     console.log('Query params:', req.query);

//     const Producto = require('../models/Producto');
//     const ProductoUsuario = require('../models/ProductoUsuario');

//     const { categoria } = req.query;

//     // ✅ Filtros para ambas colecciones
//     const filtro = {};
//     if (categoria && categoria !== 'todos') {
//       filtro.categoria = categoria;
//     }

//     // Buscar en ambas colecciones
//     const productosVendedor = await Producto.find({
//       ...filtro,
//       productoVendedor: true
//     }).sort({ destacado: -1, createdAt: -1 });

//     const productosUsuario = await ProductoUsuario.find({
//       ...filtro,
//       soloUsuarios: true
//     }).sort({ destacado: -1, createdAt: -1 });

//     console.log(`📊 Productos vendedor: ${productosVendedor.length}`);
//     console.log(`📊 Productos usuario: ${productosUsuario.length}`);

//     // ✅ Combinar y transformar
//     const todosProductos = [
//       ...productosVendedor.map(p => {
//         const obj = p.toObject();
//         return {
//           ...obj,
//           whatsapp: p.userWhatsapp || p.whatsappAdmin || "543462529718"
//         };
//       }),
//       ...productosUsuario.map(p => {
//         const obj = p.toObject();
//         return {
//           ...obj,
//           whatsapp: p.userWhatsapp || p.whatsappAdmin || "543462529718"
//         };
//       })
//     ];

//     // ✅ Eliminar duplicados por _id
//     const productosUnicos = todosProductos.filter(
//       (v, i, a) => a.findIndex(p => p._id.toString() === v._id.toString()) === i
//     );

//     console.log(`✅ Total productos únicos: ${productosUnicos.length}`);

//     // Debug: Mostrar algunos productos
//     if (productosUnicos.length > 0) {
//       console.log('🔍 Muestra de productos:', productosUnicos.slice(0, 2).map(p => ({
//         nombre: p.nombre,
//         stock: p.stock,
//         soloUsuarios: p.soloUsuarios,
//         whatsapp: p.whatsapp
//       })));
//     }

//     res.json({
//       success: true,
//       data: productosUnicos,
//       count: productosUnicos.length,
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

// module.exports = router;



// ============================================
// 📁 src/routes/productosVendedorRoutes.js (ACTUALIZADO)
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
// POST: Crear producto del vendedor
// ========================================
router.post('/', async (req, res) => {
  console.log('📦 POST /api/productos-vendedor');
  console.log('Body recibido:', JSON.stringify(req.body, null, 2));
  
  await productosController.crearProducto(req, res);
});

// ========================================
// PUT: Actualizar producto del vendedor
// ========================================
router.put('/:id', async (req, res) => {
  console.log('📦 PUT /api/productos-vendedor/:id');
  console.log('ID:', req.params.id);
  console.log('Body:', req.body);
  
  await productosController.actualizarProducto(req, res);
});

// ========================================
// DELETE: Eliminar producto del vendedor
// ========================================
router.delete('/:id', async (req, res) => {
  console.log('📦 DELETE /api/productos-vendedor/:id');
  console.log('ID:', req.params.id);
  console.log('Query:', req.query);
  
  await productosController.eliminarProducto(req, res);
});



// ✅ AGREGAR esta ruta en productosVendedorRoutes.js DESPUÉS de las otras rutas:

// ========================================
// POST: Publicar/actualizar producto en ProductoUsuario
// ========================================
router.post('/publicar/:id', async (req, res) => {
  console.log('🚀 POST /api/productos-vendedor/publicar/:id');
  console.log('ID:', req.params.id);
  console.log('Body:', req.body);
  
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