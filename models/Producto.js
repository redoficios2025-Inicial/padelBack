// ============================================
// 📁 src/models/Producto.js (ACTUALIZADO)
// ============================================
const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
  {
    productoAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductoAdmin",
      required: true, // 🔑 Referencia al producto admin original
    },
    vendedorId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    productoVendedor: {
      type: Boolean,
      default: true, // ✅ NUEVO: Marca que este producto fue creado por un vendedor
    },
    codigo: {
      type: String,
      required: true,
      trim: true,
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
    soloVendedores: {
      type: Boolean,
      default: true,
    },
    soloUsuarios: {
      type: Boolean,
      default: false,
    },
    precioAdminFijo: {
      type: Number,
      required: true,
      immutable: true,
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
    whatsappAdmin: {
      type: String,
      required: true,
    },
    userWhatsapp: {
      type: String,
      default: null,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
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
    productoAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para evitar duplicados
productoSchema.index({ vendedorId: 1, codigo: 1 }, { unique: true });

// Virtual para obtener el WhatsApp efectivo
productoSchema.virtual("whatsapp").get(function () {
  return this.userWhatsapp || this.whatsappAdmin;
});

productoSchema.set("toJSON", { virtuals: true });
productoSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Producto", productoSchema);
