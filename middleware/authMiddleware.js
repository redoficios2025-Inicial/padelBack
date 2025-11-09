// // ============================================
// // 📁 src/middleware/authMiddleware.js
// // ============================================
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-key-super-segura';

// const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Token no proporcionado',
//       });
//     }

//     // Token de prueba para desarrollo
//     if (token === 'TEST_TOKEN_2024') {
//       req.user = {
//         id: 'admin',
//         email: '123456',
//       };
//       return next();
//     }

//     // Verificar token JWT real
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: 'Token inválido o expirado',
//     });
//   }
// };


// module.exports = authMiddleware;



// ============================================
// 📁 middleware/authMiddleware.js (ACTUALIZADO)
// ============================================
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-key-super-segura';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    // Verificar token JWT real
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    console.log('✅ Usuario autenticado:', {
      id: req.user.id,
      nombre: req.user.nombre,
      rol: req.user.rol
    });
    
    next();
  } catch (error) {
    console.error('❌ Error en authMiddleware:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Se requiere rol de administrador'
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
