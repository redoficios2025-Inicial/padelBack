// ============================================
// 📁 middleware/authMiddleware.js (CON DEBUGGING)
// ============================================
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mi-clave-secreta-super-segura-2024';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log('🔍 Authorization Header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader) {
      console.log('❌ No hay header de autorización');
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('❌ Token vacío después de split');
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    console.log('🔑 Token recibido (primeros 20 chars):', token.substring(0, 20) + '...');
    console.log('🔑 JWT_SECRET en uso:', JWT_SECRET.substring(0, 10) + '...');

    // Verificar token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    console.log('✅ Token decodificado:', decoded);
    
    req.user = {
      id: decoded.id,
      nombre: decoded.nombre,
      email: decoded.email,
      rol: decoded.rol,
      whatsapp: decoded.whatsapp
    };
    
    console.log('✅ Usuario autenticado:', {
      id: req.user.id,
      nombre: req.user.nombre,
      rol: req.user.rol
    });
    
    next();
  } catch (error) {
    console.error('❌ Error en authMiddleware:', error.message);
    console.error('❌ Error completo:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        error: error.message
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Error de autenticación',
      error: error.message
    });
  }
};

const adminMiddleware = (req, res, next) => {
  console.log('🔍 Verificando rol admin para:', req.user);
  
  if (!req.user || req.user.rol !== 'admin') {
    console.log('❌ Acceso denegado: No es admin');
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Se requiere rol de administrador'
    });
  }
  
  console.log('✅ Usuario es admin');
  next();
};

module.exports = { authMiddleware, adminMiddleware };
