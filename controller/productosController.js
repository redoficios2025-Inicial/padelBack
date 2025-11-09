// // ============================================
// // 📁 src/controller/productosController.js
// // ============================================
// const Producto = require('../models/Producto');

// // ============================================
// // 📋 Obtener todos los productos (ADMIN)
// // ============================================
// exports.obtenerProductos = async (req, res) => {
//   try {
//     const productos = await Producto.find().sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: productos,
//       count: productos.length,
//     });
//   } catch (error) {
//     console.error('❌ Error al obtener productos:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al obtener productos',
//       error: error.message,
//     });
//   }
// };

// // ============================================
// // 🔍 Obtener producto por código (ADMIN)
// // ============================================
// exports.obtenerProductoPorCodigo = async (req, res) => {
//   try {
//     const { codigo } = req.params;
    
//     const producto = await Producto.findOne({ codigo });
    
//     if (!producto) {
//       return res.status(404).json({
//         success: false,
//         message: 'Producto no encontrado',
//       });
//     }
    
//     res.json({
//       success: true,
//       data: producto,
//     });
//   } catch (error) {
//     console.error('❌ Error al obtener producto:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al obtener producto',
//       error: error.message,
//     });
//   }
// };

// // ============================================
// // 🔍 Obtener producto por ID (ADMIN)
// // ============================================
// exports.obtenerProductoPorId = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const producto = await Producto.findById(id);
    
//     if (!producto) {
//       return res.status(404).json({
//         success: false,
//         message: 'Producto no encontrado',
//       });
//     }
    
//     res.json({
//       success: true,
//       data: producto,
//     });
//   } catch (error) {
//     console.error('❌ Error al obtener producto:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al obtener producto',
//       error: error.message,
//     });
//   }
// };

// // ============================================
// // ➕ Crear producto (ADMIN)
// // ============================================
// // ➕ Crear producto (ADMIN)
// exports.crearProducto = async (req, res) => {
//   try {
//     const {
//       codigo,
//       nombre,
//       marca,
//       descripcion,
//       precio,
//       precioFinal,
//       stock,              // ⬅️ AGREGAR ESTO
//       moneda,
//       descuento,
//       imagen,
//       imagenUrl,
//       categoria,
//       destacado,
//       whatsapp,
//       recargoTransporte,
//       recargoMargen,
//       recargoOtros,
//     } = req.body;

//     // Validar campos obligatorios
//     if (!codigo || !nombre || !marca || !descripcion || precio === undefined || !categoria || !whatsapp) {
//       return res.status(400).json({
//         success: false,
//         message: 'Faltan campos obligatorios (código, nombre, marca, descripción, precio, categoría, whatsapp)',
//       });
//     }

//     // Verificar si el código ya existe
//     const productoExistente = await Producto.findOne({ codigo });
//     if (productoExistente) {
//       return res.status(400).json({
//         success: false,
//         message: 'Ya existe un producto con ese código',
//       });
//     }

//     // Crear el producto
//     const nuevoProducto = new Producto({
//       codigo: codigo.trim(),
//       nombre: nombre.trim(),
//       marca: marca.trim(),
//       descripcion: descripcion.trim(),
//       precio: Number(precio),
//       precioFinal: Number(precioFinal),
//       stock: Number(stock) || 0,        // ⬅️ AGREGAR ESTO
//       moneda: moneda || 'ARS',
//       descuento: Number(descuento) || 0,
//       imagenUrl: imagen || imagenUrl || '',
//       categoria,
//       destacado: destacado || false,
//       whatsapp: whatsapp.trim(),
//       recargos: {
//         transporte: Number(recargoTransporte) || 0,
//         margen: Number(recargoMargen) || 0,
//         otros: Number(recargoOtros) || 0,
//       },
//     });

//     await nuevoProducto.save();

//     res.status(201).json({
//       success: true,
//       message: 'Producto creado exitosamente',
//       data: nuevoProducto,
//     });
//   } catch (error) {
//     console.error('❌ Error al crear producto:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al crear producto',
//       error: error.message,
//     });
//   }
// };

// // ✏️ Actualizar producto (ADMIN)
// exports.actualizarProducto = async (req, res) => {
//   try {
//     const { id } = req.body;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: 'ID del producto es requerido',
//       });
//     }

//     const {
//       codigo,
//       nombre,
//       marca,
//       descripcion,
//       precio,
//       precioFinal,
//       stock,              // ⬅️ AGREGAR ESTO
//       moneda,
//       descuento,
//       imagen,
//       imagenUrl,
//       categoria,
//       destacado,
//       whatsapp,
//       recargoTransporte,
//       recargoMargen,
//       recargoOtros,
//     } = req.body;

//     // Buscar el producto
//     const producto = await Producto.findById(id);
    
//     if (!producto) {
//       return res.status(404).json({
//         success: false,
//         message: 'Producto no encontrado',
//       });
//     }

//     // Si se cambió el código, verificar que no exista otro producto con ese código
//     if (codigo && codigo !== producto.codigo) {
//       const codigoExistente = await Producto.findOne({ codigo, _id: { $ne: id } });
//       if (codigoExistente) {
//         return res.status(400).json({
//           success: false,
//           message: 'Ya existe un producto con ese código',
//         });
//       }
//     }

//     // Actualizar campos
//     if (codigo) producto.codigo = codigo.trim();
//     if (nombre) producto.nombre = nombre.trim();
//     if (marca) producto.marca = marca.trim();
//     if (descripcion) producto.descripcion = descripcion.trim();
//     if (precio !== undefined) producto.precio = Number(precio);
//     if (precioFinal !== undefined) producto.precioFinal = Number(precioFinal);
//     if (stock !== undefined) producto.stock = Number(stock);    // ⬅️ AGREGAR ESTO
//     if (moneda) producto.moneda = moneda;
//     if (descuento !== undefined) producto.descuento = Number(descuento);
    
//     // Actualizar imagen (si se envió una nueva imagen o URL)
//     if (imagen) {
//       producto.imagenUrl = imagen;
//     } else if (imagenUrl !== undefined) {
//       producto.imagenUrl = imagenUrl;
//     }
    
//     if (categoria) producto.categoria = categoria;
//     if (destacado !== undefined) producto.destacado = destacado;
//     if (whatsapp) producto.whatsapp = whatsapp.trim();
    
//     if (recargoTransporte !== undefined) producto.recargos.transporte = Number(recargoTransporte);
//     if (recargoMargen !== undefined) producto.recargos.margen = Number(recargoMargen);
//     if (recargoOtros !== undefined) producto.recargos.otros = Number(recargoOtros);

//     await producto.save();

//     res.json({
//       success: true,
//       message: 'Producto actualizado exitosamente',
//       data: producto,
//     });
//   } catch (error) {
//     console.error('❌ Error al actualizar producto:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al actualizar producto',
//       error: error.message,
//     });
//   }
// };

// // ============================================
// // 🗑️ Eliminar producto (ADMIN)
// // ============================================
// exports.eliminarProducto = async (req, res) => {
//   try {
//     const { id } = req.query;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: 'ID del producto es requerido',
//       });
//     }

//     const producto = await Producto.findByIdAndDelete(id);

//     if (!producto) {
//       return res.status(404).json({
//         success: false,
//         message: 'Producto no encontrado',
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Producto eliminado exitosamente',
//       data: producto,
//     });
//   } catch (error) {
//     console.error('❌ Error al eliminar producto:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al eliminar producto',
//       error: error.message,
//     });
//   }

// };





// ============================================
// 📁 src/controller/productosController.js (SINCRONIZACIÓN COMPLETA)
// ============================================
const Producto = require("../models/Producto");
const ProductoUsuario = require("../models/ProductoUsuario");
const ProductoAdmin = require("../models/ProductoAdmin");

// ========================================
// PRODUCTOS ADMIN (Públicos)
// ========================================
exports.obtenerProductosAdmin = async (req, res) => {
  try {
    console.log("🔍 Obteniendo productos admin...");
    const productosAdmin = await ProductoAdmin.find().sort({ createdAt: -1 });

    console.log(`✅ ${productosAdmin.length} productos admin encontrados`);

    res.json({
      success: true,
      data: productosAdmin.map((p) => ({
        ...p.toObject(),
        productoAdmin: true,
        precio: p.precioAdminFijo,
        precioFinal: p.precioAdminFijo,
        recargos: { transporte: 0, margen: 0, otros: 0 },
        descuento: 0,
      })),
      count: productosAdmin.length,
    });
  } catch (error) {
    console.error("❌ Error al obtener productos admin:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos admin",
      error: error.message,
    });
  }
};

// ========================================
// CREAR PRODUCTO DEL VENDEDOR + SINCRONIZAR A ProductoUsuario
// ========================================
exports.crearProducto = async (req, res) => {
  try {
    console.log("📝 Iniciando creación de producto...");
    console.log("Body completo:", JSON.stringify(req.body, null, 2));

    const {
      productoAdminId,
      vendedorId,
      codigo,
      nombre,
      marca,
      descripcion,
      stock,
      precioAdminFijo,
      moneda,
      descuento,
      imagen,
      imagenUrl,
      categoria,
      destacado,
      whatsapp,
      recargoTransporte,
      recargoMargen,
      recargoOtros,
    } = req.body;

    // ✅ Validaciones
    if (!productoAdminId || !vendedorId) {
      return res.status(400).json({
        success: false,
        message: "productoAdminId y vendedorId son requeridos",
      });
    }

    if (!whatsapp || whatsapp.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "El número de WhatsApp es obligatorio",
      });
    }

    // ✅ Verificar producto admin existe
    const productoAdmin = await ProductoAdmin.findById(productoAdminId);
    if (!productoAdmin) {
      return res.status(404).json({ 
        success: false, 
        message: "Producto admin no encontrado" 
      });
    }

    // ✅ Verificar si ya personalizó este producto
    const yaPersonalizado = await Producto.findOne({ 
      productoAdminId, 
      vendedorId 
    });
    
    if (yaPersonalizado) {
      return res.status(400).json({ 
        success: false, 
        message: "Ya personalizaste este producto. Edítalo desde 'Mis Productos'" 
      });
    }

    // ✅ Cálculos de precio
    const precioBase = parseFloat(precioAdminFijo);
    const descuentoPorcentaje = parseFloat(descuento) || 0;
    const totalRecargos =
      (parseFloat(recargoTransporte) || 0) +
      (parseFloat(recargoMargen) || 0) +
      (parseFloat(recargoOtros) || 0);

    const precioConDescuento = precioBase * (1 - descuentoPorcentaje / 100);
    const precioFinal = precioConDescuento * (1 + totalRecargos / 100);

    const whatsappFinal = whatsapp.trim();
    const imagenFinal = imagen || imagenUrl || productoAdmin.imagenUrl;

    console.log('📱 WhatsApp asignado:', whatsappFinal);
    console.log('💰 Precio final calculado:', precioFinal);

    // ✅ 1. CREAR PRODUCTO VENDEDOR (Panel interno)
    const nuevoProducto = new Producto({
      productoAdminId,
      vendedorId,
      productoVendedor: true,
      soloVendedores: true,
      soloUsuarios: false,
      codigo,
      nombre,
      marca,
      descripcion,
      stock: parseInt(stock) || 0,
      precio: precioBase,
      precioAdminFijo: precioBase,
      precioFinal,
      moneda: moneda || "ARS",
      descuento: descuentoPorcentaje,
      imagenUrl: imagenFinal,
      categoria,
      destacado: destacado || false,
      whatsappAdmin: productoAdmin.whatsappAdmin,
      userWhatsapp: whatsappFinal,
      recargos: {
        transporte: parseFloat(recargoTransporte) || 0,
        margen: parseFloat(recargoMargen) || 0,
        otros: parseFloat(recargoOtros) || 0,
      },
      productoAdmin: false,
    });

    await nuevoProducto.save();
    console.log("✅ Producto vendedor creado:", nuevoProducto._id);

    // ✅ 2. CREAR PRODUCTO USUARIO (Público - para HomePage)
    const nuevoProductoUsuario = new ProductoUsuario({
      productoAdminId,
      productoVendedorId: nuevoProducto._id,
      vendedorId,
      codigo,
      nombre,
      marca,
      descripcion,
      precio: precioBase,
      precioFinal,
      moneda: moneda || "ARS",
      descuento: descuentoPorcentaje,
      imagenUrl: imagenFinal,
      categoria,
      destacado: destacado || false,
      stock: parseInt(stock) || 0,
      whatsappAdmin: productoAdmin.whatsappAdmin,
      userWhatsapp: whatsappFinal,
      recargos: {
        transporte: parseFloat(recargoTransporte) || 0,
        margen: parseFloat(recargoMargen) || 0,
        otros: parseFloat(recargoOtros) || 0,
      },
      soloUsuarios: true,
      soloVendedores: false,
      productoAdmin: false,
    });

    await nuevoProductoUsuario.save();
    console.log("✅ Producto usuario (público) creado:", nuevoProductoUsuario._id);

    res.status(201).json({
      success: true,
      message: "Producto creado y publicado exitosamente",
      data: nuevoProducto,
      productoPublico: nuevoProductoUsuario,
    });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al crear producto", 
      error: error.message 
    });
  }
};

// ========================================
// ACTUALIZAR PRODUCTO + SINCRONIZAR A ProductoUsuario
// ========================================
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendedorId } = req.body;

    if (!id || !vendedorId) {
      return res.status(400).json({
        success: false,
        message: "ID de producto y vendedorId son requeridos",
      });
    }

    console.log(`🔍 Actualizando producto ${id} del vendedor ${vendedorId}`);

    // ✅ Buscar producto vendedor
    const productoExistente = await Producto.findOne({ 
      _id: id, 
      vendedorId: vendedorId 
    });

    if (!productoExistente) {
      return res.status(404).json({ 
        success: false, 
        message: "Producto no encontrado o no tienes permiso para editarlo" 
      });
    }

    const {
      codigo,
      nombre,
      marca,
      descripcion,
      stock,
      moneda,
      descuento,
      imagen,
      categoria,
      destacado,
      whatsapp,
      recargoTransporte,
      recargoMargen,
      recargoOtros,
    } = req.body;

    // ✅ Validar WhatsApp
    if (whatsapp && whatsapp.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "El WhatsApp no puede estar vacío",
      });
    }

    // ✅ Recalcular precio final
    const precioBase = productoExistente.precioAdminFijo;
    const descuentoPorcentaje =
      descuento !== undefined ? parseFloat(descuento) : productoExistente.descuento;
    const totalRecargos =
      (parseFloat(recargoTransporte) || productoExistente.recargos.transporte) +
      (parseFloat(recargoMargen) || productoExistente.recargos.margen) +
      (parseFloat(recargoOtros) || productoExistente.recargos.otros);

    const precioConDescuento = precioBase * (1 - descuentoPorcentaje / 100);
    const precioFinal = precioConDescuento * (1 + totalRecargos / 100);

    // ✅ Actualizar producto VENDEDOR
    if (codigo) productoExistente.codigo = codigo;
    if (nombre) productoExistente.nombre = nombre;
    if (marca) productoExistente.marca = marca;
    if (descripcion) productoExistente.descripcion = descripcion;
    if (stock !== undefined) productoExistente.stock = parseInt(stock);
    if (moneda) productoExistente.moneda = moneda;
    if (categoria) productoExistente.categoria = categoria;
    if (destacado !== undefined) productoExistente.destacado = destacado;
    if (whatsapp) productoExistente.userWhatsapp = whatsapp.trim();
    if (imagen) productoExistente.imagenUrl = imagen;

    productoExistente.precio = precioBase;
    productoExistente.descuento = descuentoPorcentaje;
    productoExistente.precioFinal = precioFinal;
    productoExistente.recargos = {
      transporte: recargoTransporte !== undefined ? parseFloat(recargoTransporte) : productoExistente.recargos.transporte,
      margen: recargoMargen !== undefined ? parseFloat(recargoMargen) : productoExistente.recargos.margen,
      otros: recargoOtros !== undefined ? parseFloat(recargoOtros) : productoExistente.recargos.otros,
    };

    await productoExistente.save();
    console.log("✅ Producto vendedor actualizado");

    // ✅ SINCRONIZAR O CREAR ProductoUsuario (UPSERT)
    const datosProductoUsuario = {
      productoAdminId: productoExistente.productoAdminId,
      productoVendedorId: id,
      vendedorId: vendedorId,
      codigo: productoExistente.codigo,
      nombre: productoExistente.nombre,
      marca: productoExistente.marca,
      descripcion: productoExistente.descripcion,
      stock: productoExistente.stock,
      precio: productoExistente.precio,
      precioFinal: productoExistente.precioFinal,
      moneda: productoExistente.moneda,
      descuento: productoExistente.descuento,
      categoria: productoExistente.categoria,
      destacado: productoExistente.destacado,
      imagenUrl: productoExistente.imagenUrl,
      whatsappAdmin: productoExistente.whatsappAdmin,
      userWhatsapp: productoExistente.userWhatsapp,
      recargos: {
        transporte: productoExistente.recargos.transporte,
        margen: productoExistente.recargos.margen,
        otros: productoExistente.recargos.otros,
      },
      soloUsuarios: true,
      soloVendedores: false,
      productoAdmin: false,
    };

    // ✅ UPSERT: Crear si no existe, actualizar si existe
    const productoUsuario = await ProductoUsuario.findOneAndUpdate(
      { 
        productoVendedorId: id,
        vendedorId: vendedorId
      },
      datosProductoUsuario,
      { 
        upsert: true, // ✅ CLAVE: Crear si no existe
        new: true,    // Devolver el documento actualizado
        setDefaultsOnInsert: true
      }
    );

    console.log("✅ ProductoUsuario sincronizado/creado:", productoUsuario._id);

    res.json({ 
      success: true, 
      message: "Producto actualizado y sincronizado exitosamente", 
      data: productoExistente 
    });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar producto", 
      error: error.message 
    });
  }
};

// ========================================
// ELIMINAR PRODUCTO + ProductoUsuario
// ========================================
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendedorId } = req.query;

    if (!id || !vendedorId) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de producto y vendedorId son requeridos" 
      });
    }

    console.log(`🗑️ Eliminando producto ${id} del vendedor ${vendedorId}`);

    // ✅ Eliminar producto vendedor
    const productoEliminado = await Producto.findOneAndDelete({ 
      _id: id, 
      vendedorId: vendedorId 
    });

    if (!productoEliminado) {
      return res.status(404).json({ 
        success: false, 
        message: "Producto no encontrado o no tienes permiso para eliminarlo" 
      });
    }

    console.log("✅ Producto vendedor eliminado:", productoEliminado._id);

    // ✅ Eliminar ProductoUsuario asociado
    const productoUsuarioEliminado = await ProductoUsuario.findOneAndDelete({ 
      productoVendedorId: id,
      vendedorId: vendedorId
    });

    if (productoUsuarioEliminado) {
      console.log("✅ ProductoUsuario eliminado:", productoUsuarioEliminado._id);
    } else {
      console.warn("⚠️ No se encontró ProductoUsuario asociado");
    }

    res.json({ 
      success: true, 
      message: "Producto eliminado completamente (vendedor y público)", 
      data: productoEliminado 
    });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al eliminar producto", 
      error: error.message 
    });
  }
};
