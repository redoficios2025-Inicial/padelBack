// ============================================
// 📁 models/Usuario.js (COMPLETO Y CORREGIDO)
// ============================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  rol: {
    type: String,
    enum: ['admin', 'vendedor', 'usuario'],
    default: 'usuario'
  },
  whatsapp: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: true // Cambiado a true por defecto para testing
  }
}, {
  timestamps: true
});

// ✅ Middleware para hashear password ANTES de guardar
usuarioSchema.pre('save', async function(next) {
  // Solo hashear si el password fue modificado o es nuevo
  if (!this.isModified('password')) {
    return next();
  }

  try {
    console.log('🔐 Hasheando password para:', this.email);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('✅ Password hasheado exitosamente');
    next();
  } catch (error) {
    console.error('❌ Error hasheando password:', error);
    next(error);
  }
});

// ✅ Método de instancia para comparar passwords
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('🔍 Comparando passwords para:', this.email);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('🔍 Resultado comparación:', isMatch ? '✅ Correcta' : '❌ Incorrecta');
    return isMatch;
  } catch (error) {
    console.error('❌ Error comparando password:', error);
    throw error;
  }
};

// ✅ Método para ocultar password en respuestas JSON
usuarioSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
