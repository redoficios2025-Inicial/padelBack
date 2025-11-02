// =========================================== 
// 📁 src/utils/emailService.js
// ===========================================
const nodemailer = require('nodemailer');

// Log de configuración al cargar el módulo
console.log('\n🔍 Verificando configuración de email...');
console.log('📧 AppGmail:', process.env.AppGmail || '❌ NO CONFIGURADO');
console.log('🔑 AppGmailPassword:', process.env.AppGmailPassword ? 
  `✅ Configurado (${process.env.AppGmailPassword.length} caracteres)` : 
  '❌ NO CONFIGURADO'
);

// Verificar que las variables de entorno existen
if (!process.env.AppGmail || !process.env.AppGmailPassword) {
  console.error('\n❌ ERROR CRÍTICO: Faltan variables de entorno en .env');
  console.error('Asegúrate de tener:');
  console.error('  AppGmail=tu-email@gmail.com');
  console.error('  AppGmailPassword=tu-contraseña-de-aplicacion\n');
}

// Configurar transporter con Gmail - MÉTODO 1 (service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AppGmail,
    pass: process.env.AppGmailPassword
  }
});

// MÉTODO 2 (alternativo si el método 1 falla) - Descomenta si es necesario
/*
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.AppGmail,
    pass: process.env.AppGmailPassword
  },
  tls: {
    rejectUnauthorized: false
  }
});
*/

// Verificar la conexión al iniciar
let emailReady = false;
transporter.verify(function (error, success) {
  if (error) {
    console.error('\n❌ Error en configuración de email:', error.message);
    console.error('\n🔧 PASOS PARA SOLUCIONAR:');
    console.error('1. Ve a https://myaccount.google.com/security');
    console.error('2. Activa "Verificación en dos pasos"');
    console.error('3. Ve a https://myaccount.google.com/apppasswords');
    console.error('4. Genera una contraseña para "Correo"');
    console.error('5. Copia la contraseña (16 caracteres SIN ESPACIOS)');
    console.error('6. Pégala en AppGmailPassword en tu .env');
    console.error('7. Reinicia el servidor\n');
  } else {
    emailReady = true;
    console.log('✅ Servidor de email listo para enviar mensajes\n');
  }
});

// ============================================
// 📧 Enviar email de verificación
// ============================================
exports.sendVerificationEmail = async (email, nombre, codigo) => {
  try {
    console.log(`\n📤 Intentando enviar email de verificación a: ${email}`);
    
    // Validar que tenemos las credenciales
    if (!process.env.AppGmail || !process.env.AppGmailPassword) {
      throw new Error('❌ Credenciales de email no configuradas en .env');
    }

    if (!emailReady) {
      console.warn('⚠️ ADVERTENCIA: El servidor de email no está listo');
      console.warn('Intentando enviar de todas formas...');
    }

    const mailOptions = {
      from: {
        name: 'Euro Padel',
        address: process.env.AppGmail
      },
      to: email,
      subject: '🔐 Verifica tu cuenta',
      text: `Hola ${nombre},\n\nTu código de verificación es: ${codigo}\n\nEste código expira en 24 horas.\n\nSi no solicitaste este registro, ignora este correo.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">¡Bienvenido, ${nombre}!</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
                        Gracias por registrarte. Para completar tu registro, por favor verifica tu correo electrónico con el siguiente código:
                      </p>
                      <div style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${codigo}
                        </div>
                      </div>
                      <p style="font-size: 14px; color: #666666;">
                        Este código expira en 24 horas.
                      </p>
                      <p style="color: #dc3545; font-size: 14px; margin-top: 20px;">
                        ⚠️ Si no solicitaste este registro, por favor ignora este correo.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                      <p style="font-size: 12px; color: #6c757d; margin: 0;">
                        © 2025 Tu App. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    console.log('📧 Configuración del email:');
    console.log('   From:', mailOptions.from);
    console.log('   To:', mailOptions.to);
    console.log('   Subject:', mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email de verificación enviado exitosamente!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Response:', info.response);
    console.log('📨 Destinatario:', email);
    console.log('🔢 Código enviado:', codigo);
    
    return info;
  } catch (error) {
    console.error('\n❌ ERROR DETALLADO al enviar email:');
    console.error('Código de error:', error.code);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    
    // Mensajes de error más específicos
    if (error.code === 'EAUTH') {
      console.error('\n🔐 ERROR DE AUTENTICACIÓN');
      console.error('Causas posibles:');
      console.error('  1. AppGmailPassword NO es una "Contraseña de aplicación"');
      console.error('  2. Verificación en dos pasos NO está activa');
      console.error('  3. Email o contraseña incorrectos');
      console.error('  4. Hay espacios en la contraseña');
      throw new Error('Error de autenticación con Gmail. Verifica tu contraseña de aplicación.');
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      console.error('\n🌐 ERROR DE CONEXIÓN');
      console.error('Verifica tu conexión a internet');
      throw new Error('Error de conexión con el servidor de Gmail');
    } else if (error.code === 'EENVELOPE') {
      console.error('\n📧 ERROR EN LA DIRECCIÓN DE EMAIL');
      console.error('Verifica que el email sea válido');
      throw new Error('Dirección de email inválida');
    } else {
      throw new Error(`Error al enviar email: ${error.message}`);
    }
  }
};

// ============================================
// 🔑 Enviar email de recuperación
// ============================================
exports.sendRecoveryEmail = async (email, nombre, codigo) => {
  try {
    console.log(`\n📤 Intentando enviar email de recuperación a: ${email}`);
    
    // Validar que tenemos las credenciales
    if (!process.env.AppGmail || !process.env.AppGmailPassword) {
      throw new Error('❌ Credenciales de email no configuradas en .env');
    }

    if (!emailReady) {
      console.warn('⚠️ ADVERTENCIA: El servidor de email no está listo');
    }

    const mailOptions = {
      from: {
        name: 'Tu App',
        address: process.env.AppGmail
      },
      to: email,
      subject: '🔐 Recuperación de contraseña',
      text: `Hola ${nombre},\n\nTu código de recuperación es: ${codigo}\n\nEste código expira en 1 hora.\n\nSi no solicitaste este cambio, ignora este correo.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Recuperación de contraseña</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
                        Hola ${nombre}, recibimos una solicitud para restablecer tu contraseña. 
                        Usa el siguiente código para crear una nueva contraseña:
                      </p>
                      <div style="background-color: #fff5f5; border: 2px dashed #f5576c; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <div style="font-size: 36px; font-weight: bold; color: #f5576c; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${codigo}
                        </div>
                      </div>
                      <p style="font-size: 14px; color: #666666;">
                        Este código expira en 1 hora.
                      </p>
                      <p style="color: #dc3545; font-size: 14px; margin-top: 20px;">
                        ⚠️ Si no solicitaste este cambio, ignora este correo.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                      <p style="font-size: 12px; color: #6c757d; margin: 0;">
                        © 2025 Tu App. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    console.log('📧 Configuración del email:');
    console.log('   From:', mailOptions.from);
    console.log('   To:', mailOptions.to);

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email de recuperación enviado exitosamente!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Response:', info.response);
    console.log('🔢 Código enviado:', codigo);
    
    return info;
  } catch (error) {
    console.error('\n❌ ERROR al enviar email de recuperación:');
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    
    if (error.code === 'EAUTH') {
      throw new Error('Error de autenticación con Gmail. Verifica tu contraseña de aplicación.');
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      throw new Error('Error de conexión con el servidor de Gmail');
    } else {
      throw new Error(`Error al enviar email: ${error.message}`);
    }
  }
};