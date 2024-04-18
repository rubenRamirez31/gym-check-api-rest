const metaFisicaModel = require("../models/physicalGoalModel");
const firebaseHelper = require("../helpers/firebaseHelper");

const createMetaFisica = async (req, res) => {
  try {
    // Verificar si se han proporcionado los datos requeridos
    const { nick, nombreMeta, descripcion, duracionMetaDias } = req.body;
    if (!nick || !nombreMeta || !descripcion || !duracionMetaDias) {
      return res.status(400).json({
        status: "error",
        message:
          "Todos los campos son requeridos: nick, meta, descripcion, duracion",
      });
    }

    // Convertir duracionMetaDias a entero
    const duracionDias = parseInt(duracionMetaDias, 10);

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Calcular la fecha de fin sumando los días de duración de la meta a la fecha de inicio
    const fechaFin = new Date(fechaActual);

    fechaFin.setDate(fechaFin.getDate() + duracionDias);

    // Inicializar las URLs de las fotos como cadenas vacías
  // const fotosInicio = []; // Pueden ser hasta 3 fotos de inicio
    let fotosFin = []; // Pueden ser hasta 3 fotos de fin

        // Obtener los archivos de las fotos de inicio del cuerpo de la solicitud
        const { fotoInicio1, fotoInicio2, fotoInicio3 } = req.files;

        // Verificar y procesar cada foto de inicio
        const fotosInicio = [];
    

    if (fotoInicio1) {
      const urlFotoInicio1 = await firebaseHelper.subirArchivo(
        fotoInicio1[0], // Multer devuelve un array incluso si es un solo archivo
        "Metas",
        fotoInicio1[0].originalname
      );
      fotosInicio.push(urlFotoInicio1);
    }

    if (fotoInicio2) {
      const urlFotoInicio2 = await firebaseHelper.subirArchivo(
        fotoInicio2[0],
        "Metas",
        fotoInicio2[0].originalname
      );
      fotosInicio.push(urlFotoInicio2);
    }

    if (fotoInicio3) {
      const urlFotoInicio3 = await firebaseHelper.subirArchivo(
        fotoInicio3[0],
        "Metas",
        fotoInicio3[0].originalname
      );
      fotosInicio.push(urlFotoInicio3);
    }

    // Crear el objeto de meta física
    const meta = {
      nombreMeta: nombreMeta,
      descripcion: descripcion,
      fechaInicio: fechaActual,
      fechaFin: fechaFin,
      fotosInicio: fotosInicio,
      fotosFin: fotosFin,
    };

    // Llamar al modelo para crear la meta física
    const newMeta = await metaFisicaModel.createMetaFisica(nick, meta);

    return res.status(201).json({
      status: "success",
      message: "Meta física creada exitosamente",
      meta: newMeta,
    });
  } catch (error) {
    console.error("Error al crear la meta física:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al crear la meta física",
    });
  }
};

module.exports = { createMetaFisica };
