// ============================================
// 📁 src/models/producto.js
// ============================================
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  marca: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  precioFinal: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {                    // ⬅️ CAMPO NUEVO
    type: Number,
    default: 0,
    min: 0
  },
  moneda: {
    type: String,
    enum: ['ARS', 'USD'],
    default: 'ARS'
  },
  descuento: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  imagenUrl: {
    type: String,
    default: ''
  },
  categoria: {
    type: String,
    enum: ['pelota', 'ropa', 'accesorio'],
    required: true
  },
  destacado: {
    type: Boolean,
    default: false
  },
  whatsapp: {
    type: String,
    required: true,
    trim: true
  },
  recargos: {
    transporte: {
      type: Number,
      default: 0,
      min: 0
    },
    margen: {
      type: Number,
      default: 0,
      min: 0
    },
    otros: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);