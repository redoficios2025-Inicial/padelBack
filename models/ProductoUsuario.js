// ============================================
// 📁 src/models/ProductoUsuario.js (ACTUALIZADO)
// ============================================
const mongoose = require("mongoose");

const productoUsuarioSchema = new mongoose.Schema(
  {
    productoAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductoAdmin",
      required: true,
    },
    productoVendedorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
      index: true,
    },
    vendedorId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    codigo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    marca: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    precioFinal: {
      type: Number,
      required: true,
      min: 0,
    },
    moneda: {
      type: String,
      enum: ["ARS", "USD"],
      default: "ARS",
    },
    descuento: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    imagenUrl: {
      type: String,
      default: "",
    },
    categoria: {
      type: String,
      enum: ["pelota", "ropa", "accesorio"],
      required: true,
    },
    destacado: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    whatsappAdmin: {
      type: String,
      default: "543462529718", // ✅ Número por defecto
    },
    userWhatsapp: {
      type: String,
      default: null,
    },
    recargos: {
      transporte: {
        type: Number,
        default: 0,
        min: 0,
      },
      margen: {
        type: Number,
        default: 0,
        min: 0,
      },
      otros: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    soloUsuarios: {
      type: Boolean,
      default: true,
    },
    soloVendedores: {
      type: Boolean,
      default: false,
    },
    productoAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Virtual para obtener el WhatsApp efectivo
productoUsuarioSchema.virtual("whatsapp").get(function () {
  return this.userWhatsapp || this.whatsappAdmin || "543462529718";
});

// ✅ Asegurar que los virtuals se incluyan en JSON y Object
productoUsuarioSchema.set("toJSON", { virtuals: true });
productoUsuarioSchema.set("toObject", { virtuals: true });

// ✅ Índice único para evitar duplicados
productoUsuarioSchema.index(
  { productoVendedorId: 1, vendedorId: 1 },
  { unique: true }
);

module.exports = mongoose.model("ProductoUsuario", productoUsuarioSchema);