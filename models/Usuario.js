// // =========================================== 
// // 📁 src/models/Usuario.js
// // ===========================================
// const mongoose = require('mongoose');

// const usuarioSchema = new mongoose.Schema({
//   nombre: {
//     type: String,
//     required: [true, 'El nombre es requerido'],
//     trim: true,
//     minlength: [2, 'El nombre debe tener al menos 2 caracteres']
//   },
//   email: {
//     type: String,
//     required: [true, 'El email es requerido'],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [
//       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//       'Por favor ingresa un email válido'
//     ]
//   },
//   password: {
//     type: String,
//     required: [true, 'La contraseña es requerida'],
//     minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   verificationCode: {
//     type: String
//   },
//   verificationExpires: {
//     type: Date
//   },
//   recoveryCode: {
//     type: String
//   },
//   recoveryExpires: {
//     type: Date
//   },
//   rol: {
//     type: String,
//     enum: ['usuario', 'admin', 'vendedor'],
//     default: 'usuario'
//   },
//   activo: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// // Índices para mejorar el rendimiento
// usuarioSchema.index({ email: 1 });
// usuarioSchema.index({ verificationCode: 1 });
// usuarioSchema.index({ recoveryCode: 1 });


// module.exports = mongoose.model('Usuario', usuarioSchema);



// =========================================== 
// 📁 src/models/Usuario.js
// ===========================================
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6
  },
  rol: {
    type: String,
    enum: ['admin', 'vendedor', 'usuario'],
    default: 'usuario'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String
  },
  verificationExpires: {
    type: Date
  },
  recoveryCode: {
    type: String
  },
  recoveryExpires: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice para mejorar búsquedas por email
usuarioSchema.index({ email: 1 });

// Middleware para actualizar updatedAt
usuarioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);
