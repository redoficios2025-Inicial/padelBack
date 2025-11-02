// ============================================
// 📁 src/controller/productosController.js
// ============================================
const Producto = require('../models/Producto');

// ============================================
// 📋 Obtener todos los productos (ADMIN)
// ============================================
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: productos,
      count: productos.length,
    });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message,
    });
  }
};

// ============================================
// 🔍 Obtener producto por código (ADMIN)
// ============================================
exports.obtenerProductoPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    
    const producto = await Producto.findOne({ codigo });
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }
    
    res.json({
      success: true,
      data: producto,
    });
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message,
    });
  }
};

// ============================================
// 🔍 Obtener producto por ID (ADMIN)
// ============================================
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findById(id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }
    
    res.json({
      success: true,
      data: producto,
    });
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message,
    });
  }
};

// ============================================
// ➕ Crear producto (ADMIN)
// ============================================
// ➕ Crear producto (ADMIN)
exports.crearProducto = async (req, res) => {
  try {
    const {
      codigo,
      nombre,
      marca,
      descripcion,
      precio,
      precioFinal,
      stock,              // ⬅️ AGREGAR ESTO
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

    // Validar campos obligatorios
    if (!codigo || !nombre || !marca || !descripcion || precio === undefined || !categoria || !whatsapp) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios (código, nombre, marca, descripción, precio, categoría, whatsapp)',
      });
    }

    // Verificar si el código ya existe
    const productoExistente = await Producto.findOne({ codigo });
    if (productoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese código',
      });
    }

    // Crear el producto
    const nuevoProducto = new Producto({
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      marca: marca.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      precioFinal: Number(precioFinal),
      stock: Number(stock) || 0,        // ⬅️ AGREGAR ESTO
      moneda: moneda || 'ARS',
      descuento: Number(descuento) || 0,
      imagenUrl: imagen || imagenUrl || '',
      categoria,
      destacado: destacado || false,
      whatsapp: whatsapp.trim(),
      recargos: {
        transporte: Number(recargoTransporte) || 0,
        margen: Number(recargoMargen) || 0,
        otros: Number(recargoOtros) || 0,
      },
    });

    await nuevoProducto.save();

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: nuevoProducto,
    });
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message,
    });
  }
};

// ✏️ Actualizar producto (ADMIN)
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID del producto es requerido',
      });
    }

    const {
      codigo,
      nombre,
      marca,
      descripcion,
      precio,
      precioFinal,
      stock,              // ⬅️ AGREGAR ESTO
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

    // Buscar el producto
    const producto = await Producto.findById(id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    // Si se cambió el código, verificar que no exista otro producto con ese código
    if (codigo && codigo !== producto.codigo) {
      const codigoExistente = await Producto.findOne({ codigo, _id: { $ne: id } });
      if (codigoExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un producto con ese código',
        });
      }
    }

    // Actualizar campos
    if (codigo) producto.codigo = codigo.trim();
    if (nombre) producto.nombre = nombre.trim();
    if (marca) producto.marca = marca.trim();
    if (descripcion) producto.descripcion = descripcion.trim();
    if (precio !== undefined) producto.precio = Number(precio);
    if (precioFinal !== undefined) producto.precioFinal = Number(precioFinal);
    if (stock !== undefined) producto.stock = Number(stock);    // ⬅️ AGREGAR ESTO
    if (moneda) producto.moneda = moneda;
    if (descuento !== undefined) producto.descuento = Number(descuento);
    
    // Actualizar imagen (si se envió una nueva imagen o URL)
    if (imagen) {
      producto.imagenUrl = imagen;
    } else if (imagenUrl !== undefined) {
      producto.imagenUrl = imagenUrl;
    }
    
    if (categoria) producto.categoria = categoria;
    if (destacado !== undefined) producto.destacado = destacado;
    if (whatsapp) producto.whatsapp = whatsapp.trim();
    
    if (recargoTransporte !== undefined) producto.recargos.transporte = Number(recargoTransporte);
    if (recargoMargen !== undefined) producto.recargos.margen = Number(recargoMargen);
    if (recargoOtros !== undefined) producto.recargos.otros = Number(recargoOtros);

    await producto.save();

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: producto,
    });
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message,
    });
  }
};

// ============================================
// 🗑️ Eliminar producto (ADMIN)
// ============================================
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID del producto es requerido',
      });
    }

    const producto = await Producto.findByIdAndDelete(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: producto,
    });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message,
    });
  }

};
