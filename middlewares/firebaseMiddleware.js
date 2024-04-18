// Importar la función necesaria de Firebase Admin
const { getAuth } = require('firebase-admin/auth');
const admin = require('firebase-admin');


// Middleware para obtener el ID de usuario desde el token de Firebase
const obtenerIdDeUsuarioDesdeTokenFirebase = async (req, res, next) => {
  // Obtener el token
  const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwOWY4ZTMzN2ZjNzg1NTE0ZTExMGM2ZDg0N2Y0M2M3NDM1M2U0YWYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3ltY2hlY2twcnVlYmEiLCJhdWQiOiJneW1jaGVja3BydWViYSIsImF1dGhfdGltZSI6MTcxMDY0Nzc1MCwidXNlcl9pZCI6IjhsejUxVDRiTmJONHRCclp2WDFiMXY0b1ZNeTEiLCJzdWIiOiI4bHo1MVQ0Yk5iTjR0QnJadlgxYjF2NG9WTXkxIiwiaWF0IjoxNzEwNjQ3NzUwLCJleHAiOjE3MTA2NTEzNTAsImVtYWlsIjoiaGlkZGVuZzRtZXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImhpZGRlbmc0bWVzQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.W_vF67Of-K0j3sFNblDHJnu74Z7gmVrMZwR0NdysstXCSj7NqWcsNBSQoOQkB6G7F6epcnHa8zyb0hMzDJoo7gdOzoITErPhhrubUSxf-toe4px__NK-VnEmwCsMwvzkmrkXQIB5V2lcAZmuruRFO_llFWAUtcIQfcJR-kjSaotp0HbtFoyqMZ3wTyTszdA_vyUHliZHm_-9zwGl_GaQN7YnDPAocnULOj7J_U86boy-IQbCqMhfa6UxU6IlFMqBL3M1MhZX4SRfpg_JKERomZSwNHfPYAQ7fbF6ShNR11lI2VJoqrkGxSpy4C1ipXlagS6tPTOP34DxgFnJ5u09uw";
  try {
        // Verificar el token directamente sin necesidad de getAuth()
        const tokenDecodificado = await admin.auth().verifyIdToken(idToken);
        console.error('token', idToken);

    // Asignar el ID de usuario al objeto request (req)
    req.userId = tokenDecodificado.uid;

    // Llamar a la siguiente función en la cadena de middleware
    next();
  } catch (error) {
    // Manejar errores al verificar el token
    console.error('Error verificando el token de ID de Firebase:', error);
    
    // Responder con un estado no autorizado en caso de error
    res.status(401).json({ error: 'No autorizado' });
  }
};

// Exportar la función para su uso en otros archivos
module.exports = { obtenerIdDeUsuarioDesdeTokenFirebase };
