const multer = require('multer');

// Configuración de Multer para almacenar archivos en memoria
const storage = multer.memoryStorage();

// Función para generar el nombre de archivo dinámico
const generateFilename = (req, file, callback) => {
  // Obtener el prefijo del nombre del campo (e.g., 'fotoInicio')
  const fieldPrefix = file.fieldname.split(/[0-9]/)[0];
  // Contar cuántos archivos ya han sido subidos para este campo
  const fileIndex = req.files.filter(f => f.fieldname.startsWith(fieldPrefix)).length + 1;
  // Generar el nombre del archivo con el formato 'fotoInicioN' (e.g., 'fotoInicio1')
  const filename = `${fieldPrefix}${fileIndex}`;
  callback(null, filename);
};

// Configuración de Multer para manejar múltiples campos de archivos con nombres dinámicos
const fileUpload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    // Validar aquí si el archivo es aceptable (opcional)
    callback(null, true);
  },
  filename: generateFilename, // Usar la función para generar nombres de archivo dinámicos
  limits: {
    fileSize: 10 * 1024 * 1024, // Tamaño máximo del archivo: 10MB (ajustar según necesidades)
  },
});

module.exports = fileUpload;
