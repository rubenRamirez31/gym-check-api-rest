const nodemailer = require("nodemailer");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

// Función para enviar correo electrónico con el código de verificación
const sendVerificationCodeEmail = async (email) => {
  try {
    // Generar un código de verificación aleatorio
    const verificationCode = (await promisify(randomBytes)(6)).toString("hex").toUpperCase();

    // Crear transporte SMTP para enviar correo electrónico
    const transporter = nodemailer.createTransport({
      host: "http://192.168.1.68.com", // Aquí debes configurar tu servidor SMTP
      port: 3000,
      secure: false,
      auth: {
        user: "your_username",
        pass: "your_password",
      },
    });

    // Configurar el correo electrónico
    const mailOptions = {
      from: "your_email@example.com",
      to: email,
      subject: "Verificación de correo electrónico",
      text: `Tu código de verificación es: ${verificationCode}`,
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);

    // Actualizar el código de verificación en la base de datos
    await updateUserVerificationCode(email, verificationCode);

    console.log("Correo de verificación enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo de verificación:", error.message);
    throw error;
  }
};


module.exports = { sendVerificationCodeEmail };
