// ============================================
// 📁 controller/authController.js (ACTUALIZADO)
// ============================================
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'mi-clave-secreta-super-segura-2024';

console.log('🔑 JWT_SECRET cargado en authController:', JWT_SECRET.substring(0, 10) + '...');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Intento de login:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    console.log('📋 Usuario encontrado:', {
      id: usuario._id,
      nombre: usuario.nombre,
      rol: usuario.rol
    });

    // Verificar contraseña
    let isMatch = false;
    
    if (typeof usuario.comparePassword === 'function') {
      isMatch = await usuario.comparePassword(password);
    } else {
      isMatch = await bcrypt.compare(password, usuario.password);
    }

    if (!isMatch) {
      console.log('❌ Contraseña incorrecta para:', email);
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // ✅ CREAR TOKEN
    const tokenPayload = {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      whatsapp: usuario.whatsapp || null
    };

    console.log('📦 Payload del token:', tokenPayload);
    console.log('🔑 Firmando con JWT_SECRET:', JWT_SECRET.substring(0, 10) + '...');

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Token generado (primeros 20 chars):', token.substring(0, 20) + '...');
    console.log('✅ Login exitoso para:', email);

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        whatsapp: usuario.whatsapp || null,
        isVerified: usuario.isVerified
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol, whatsapp } = req.body;

    console.log('📝 Intento de registro:', { nombre, email, rol });

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      console.log('⚠️ Usuario ya existe:', email);
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
      rol: rol || 'usuario',
      whatsapp: whatsapp || null,
      isVerified: true
    });

    await nuevoUsuario.save();

    console.log('✅ Usuario registrado:', {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      rol: nuevoUsuario.rol
    });

    const tokenPayload = {
      id: nuevoUsuario._id.toString(),
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
      whatsapp: nuevoUsuario.whatsapp || null
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: nuevoUsuario._id.toString(),
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        whatsapp: nuevoUsuario.whatsapp || null,
        isVerified: nuevoUsuario.isVerified
      }
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        whatsapp: usuario.whatsapp || null,
        isVerified: usuario.isVerified
      }
    });

  } catch (error) {
    console.error('❌ Error verificando token:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando token'
    });
  }
};
