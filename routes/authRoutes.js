// // =========================================== 
// // 📁 src/routes/authRoutes.js
// // ===========================================
// const express = require('express');
// const router = express.Router();
// const { 
//   register, 
//   verifyEmail, 
//   recoverPassword, 
//   resetPassword,
//   login 
// } = require('../controller/authController');

// // Registro de usuario
// router.post('/register', register);

// // Verificar email con código
// router.post('/verify-email', verifyEmail);

// // Recuperar contraseña (envía código)
// router.post('/recover-password', recoverPassword);

// // Restablecer contraseña con código
// router.post('/reset-password', resetPassword);

// // Login
// router.post('/login', login);


// module.exports = router;

// ============================================
// 📁 routes/authRoutes.js (ACTUALIZADO)
// ============================================
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

// ✅ Ruta protegida para verificar token
router.get('/verify', authMiddleware, authController.verifyToken);

module.exports = router;

