// =========================================== 
// 📁 src/controllers/authController.js
// ===========================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { 
  sendVerificationEmail, 
  sendRecoveryEmail,
  sendPasswordChangedEmail,  // 🆕 Agregar esta importación
  getDeviceDetails            // 🆕 Agregar esta importación
} = require('../utils/emailService');

// Generar código de 6 dígitos
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================
// 📝 Registro de usuario
// ============================================
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor completa todos los campos'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generar código de verificación
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Crear usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationCode,
      verificationExpires,
      isVerified: false
    });

    await nuevoUsuario.save();

    // Enviar correo de verificación
    await sendVerificationEmail(email, nombre, verificationCode);

    res.status(201).json({
      success: true,
      message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
};

// ============================================
// ✅ Verificar email
// ============================================
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email y código son requeridos'
      });
    }

    const usuario = await Usuario.findOne({ 
      email: email.toLowerCase(),
      verificationCode: code
    });

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Código de verificación inválido'
      });
    }

    // Verificar si el código expiró
    if (usuario.verificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'El código de verificación ha expirado'
      });
    }

    // Actualizar usuario
    usuario.isVerified = true;
    usuario.verificationCode = undefined;
    usuario.verificationExpires = undefined;
    await usuario.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'tu-secret-key-super-segura',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Email verificado exitosamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol ?? 'usuario'
      }
    });

  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar email'
    });
  }
};

// ============================================
// 🔑 Recuperar contraseña
// ============================================
exports.recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'No existe un usuario con ese correo'
      });
    }

    // Generar código de recuperación
    const recoveryCode = generateVerificationCode();
    const recoveryExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

    usuario.recoveryCode = recoveryCode;
    usuario.recoveryExpires = recoveryExpires;
    await usuario.save();

    // Enviar correo de recuperación
    await sendRecoveryEmail(email, usuario.nombre, recoveryCode);

    res.json({
      success: true,
      message: 'Se ha enviado un código de recuperación a tu correo'
    });

  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la recuperación'
    });
  }
};

// ============================================
// 🔄 Restablecer contraseña
// ============================================
exports.resetPassword = async (req, res) => {
  try {
    console.log('🔄 Iniciando proceso de restablecimiento...');
    console.log('📦 Body recibido:', req.body);

    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      console.log('❌ Faltan campos requeridos');
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    console.log('🔍 Buscando usuario con email:', email, 'y código:', code);
    const usuario = await Usuario.findOne({ 
      email: email.toLowerCase(),
      recoveryCode: code
    });

    if (!usuario) {
      console.log('❌ Usuario no encontrado o código inválido');
      return res.status(400).json({
        success: false,
        message: 'Código de recuperación inválido'
      });
    }

    console.log('✅ Usuario encontrado:', usuario.nombre);

    // Verificar si el código expiró
    if (usuario.recoveryExpires < new Date()) {
      console.log('❌ Código expirado');
      return res.status(400).json({
        success: false,
        message: 'El código de recuperación ha expirado'
      });
    }

    console.log('🔐 Hasheando nueva contraseña...');
    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    usuario.password = hashedPassword;
    usuario.recoveryCode = undefined;
    usuario.recoveryExpires = undefined;
    await usuario.save();
    console.log('✅ Contraseña actualizada en BD');

    // 🆕 Obtener detalles del dispositivo y enviar email de confirmación
    console.log('📧 Preparando email de confirmación...');
    try {
      const deviceDetails = getDeviceDetails(req);
      await sendPasswordChangedEmail(email, usuario.nombre, deviceDetails);
      console.log('✅ Email de confirmación enviado exitosamente');
    } catch (emailError) {
      console.error('⚠️ Error al enviar email de confirmación:', emailError);
      console.error('⚠️ Detalles del error:', emailError.message);
      // No fallamos la petición si el email falla, solo lo registramos
    }

    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al restablecer:', error);
    res.status(500).json({
      success: false,
      message: 'Error al restablecer la contraseña'
    });
  }
};

// ============================================
// 🔐 Login
// ============================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el email está verificado
    if (!usuario.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Por favor verifica tu correo electrónico'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'tu-secret-key-super-segura',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {   
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol ?? 'usuario'
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
};
