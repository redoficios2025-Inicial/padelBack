// ============================================
// 📁 src/controller/productoUserController.js
// ============================================
const ProductoUsuario = require("../models/ProductoUsuario");

// ========================================
// OBTENER PRODUCTOS DE USUARIO (RAW)
// ========================================
exports.obtenerProductosUsuarioRaw = async (req) => {
  try {
    const { categoria } = req.query;

    const filtro = { 
      soloUsuarios: true,
      soloVendedores: false,
      stock: { $gt: 0 } // ✅ Solo productos con stock disponible
    };

    if (categoria && categoria !== 'todos') {
      filtro.categoria = categoria;
    }

    const productosUsuario = await ProductoUsuario.find(filtro)
      .sort({ destacado: -1, createdAt: -1 }); // Destacados primero, luego más recientes

    console.log(`✅ Productos usuario (públicos) encontrados: ${productosUsuario.length}`);

    // ✅ Transformar y agregar el WhatsApp correcto
    return productosUsuario.map(p => {
      const obj = p.toObject();
      return {
        ...obj,
        whatsapp: p.userWhatsapp || p.whatsappAdmin || "543462529718",
      };
    });
  } catch (error) {
    console.error("❌ Error en obtenerProductosUsuarioRaw:", error);
    throw error;
  }
};

// ========================================
// OBTENER PRODUCTOS DE USUARIO (ENDPOINT)
// ========================================
exports.obtenerProductosUsuario = async (req, res) => {
  try {
    console.log("🔍 Obteniendo productos de usuario...");
    
    const productos = await this.obtenerProductosUsuarioRaw(req);

    res.json({
      success: true,
      data: productos,
      count: productos.length,
    });
  } catch (error) {
    console.error("❌ Error al obtener productos de usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos de usuario",
      error: error.message,
    });
  }
};

// ========================================
// CREAR PRODUCTO DE USUARIO (Si se necesita crear directamente)
// ========================================
exports.crearProductoUsuario = async (req, res) => {
  try {
    console.log("📝 Creando producto de usuario...");

    const {
      productoAdminId,
      productoVendedorId,
      vendedorId,
      codigo,
      nombre,
      marca,
      descripcion,
      precio,
      precioFinal,
      moneda,
      descuento,
      imagenUrl,
      categoria,
      destacado,
      stock,
      whatsappAdmin,
      userWhatsapp,
      recargos,
    } = req.body;

    if (!productoAdminId || !productoVendedorId || !vendedorId) {
      return res.status(400).json({
        success: false,
        message: "productoAdminId, productoVendedorId y vendedorId son requeridos",
      });
    }

    const nuevoProducto = new ProductoUsuario({
      productoAdminId,
      productoVendedorId,
      vendedorId,
      codigo,
      nombre,
      marca,
      descripcion,
      precio,
      precioFinal,
      moneda: moneda || "ARS",
      descuento: descuento || 0,
      imagenUrl,
      categoria,
      destacado: destacado || false,
      stock: stock || 0,
      whatsappAdmin: whatsappAdmin || "543462529718",
      userWhatsapp: userWhatsapp || null,
      recargos: recargos || { transporte: 0, margen: 0, otros: 0 },
      soloUsuarios: true,
      soloVendedores: false,
      productoAdmin: false,
    });

    await nuevoProducto.save();

    console.log("✅ Producto de usuario creado:", nuevoProducto._id);

    res.status(201).json({
      success: true,
      message: "Producto de usuario creado exitosamente",
      data: nuevoProducto,
    });
  } catch (error) {
    console.error("❌ Error al crear producto de usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear producto de usuario",
      error: error.message,
    });
  }
};