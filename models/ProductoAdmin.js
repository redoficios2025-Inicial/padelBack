const mongoose = require('mongoose');

const productoAdminSchema = new mongoose.Schema({
    stock: {
        type: Number,
        required: true,
        default: 0
    },
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
        required: true
    },
    precioAdminFijo: {
        type: Number,
        required: true
    },
    moneda: {
        type: String,
        enum: ['ARS', 'USD'],
        default: 'ARS'
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
    whatsappAdmin: {
        type: String,
        required: true
    },
    productoAdmin: {
        type: Boolean,
        default: true
    }, soloVendedores: {
          type: Boolean,
          default: true, // Productos admin solo para vendedores
        },
        soloUsuarios: {
          type: Boolean,
          default: false, // Productos visibles para usuarios finales
        },

}, {
    timestamps: true
});

module.exports = mongoose.model('ProductoAdmin', productoAdminSchema);
