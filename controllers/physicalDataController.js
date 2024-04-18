const physicalDataModel = require("../models/physicalDataModel");

// Crear datos físicos para un usuario
const createPhysicalData = async (req, res) => {
  try {
    // Obtener el nick del usuario desde la solicitud
    const nick = req.body.nick;

    // Verificar si se proporcionó el nick del usuario
    if (!nick) {
      return res.status(400).json({ error: "Nick de usuario requerido" });
    }

    // Verificar si ya existe un documento con el mismo ID (nick)
    const existingData = await physicalDataModel.getPhysicalDataByNick(nick);
    if (existingData) {
      return res
        .status(409)
        .json({ error: "Los datos de este usuario ya han sido registrados" });
    }

    // Llamar al modelo para crear datos físicos
    const success = await physicalDataModel.createPhysicalData(nick);

    // Devolver respuesta exitosa
    return res.status(201).json({
      status: "success",
      message: "Datos físicos creados exitosamente",
      nick,
    });
  } catch (error) {
    console.error("Error al crear datos físicos:", error.message);

    // Manejar errores y devolver respuesta
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al crear datos físicos",
    });
  }
};

// Obtener datos físicos por ID de usuario (nick)
const getPhysicalDataByNick = async (req, res) => {
  try {
    // Obtener el nick del usuario desde la solicitud
    const nick = req.params.nick;

    // Verificar si se proporcionó el nick del usuario
    if (!nick) {
      return res.status(400).json({ error: "Nick de usuario requerido" });
    }

    // Obtener los datos físicos por nick utilizando el modelo
    const physicalData = await physicalDataModel.getPhysicalDataByNick(nick);

    // Verificar si se encontraron datos físicos para el usuario
    if (physicalData) {
      return res.status(200).json({
        status: "success",
        message: "Datos físicos encontrados",
        physicalData,
      });
    } else {
      return res
        .status(404)
        .json({ error: "No se encontraron datos físicos para el usuario" });
    }
  } catch (error) {
    console.error(
      "Error al obtener datos físicos por ID de usuario (nick):",
      error.message
    );
    return res.status(500).json({
      status: "error",
      message:
        "Error interno del servidor al obtener datos físicos por ID de usuario (nick)",
    });
  }
};

// Agregar un dato a la colección correspondiente dinámicamente
const addData = async (req, res) => {
  try {
    // Obtener el nick, la colección, tipo y  el valor desde la solicitud
    const { nick, coleccion, tipo, valor } = req.body;
    let typeData = tipo;
    

    // Verificar si se proporcionaron todos los datos necesarios
    if (!nick || !coleccion) {
      return res
        .status(400)
        .json({ error: "Nick, colección y valor requeridos" });
    }

    const data = {
      [typeData]: valor || "",
      tipo: typeData
    };

    // Llamar al modelo para agregar el dato a la colección correspondiente
    const success = await physicalDataModel.addData(nick, coleccion, data);

    // Verificar si el dato se agregó correctamente
    if (success) {
      return res.status(201).json({
        status: "success",
        message: `Dato ${coleccion} agregado exitosamente`,
        nick,
        coleccion,
        data,
      });
    } else {
      return res.status(404).json({ error: "No se pudo agregar el dato" });
    }
  } catch (error) {
    console.error("Error al agregar dato:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al agregar dato",
    });
  }
};

// Obtener datos físicos con ordenamiento dinámico
const getDataWithDynamicSorting = async (req, res) => {
  try {
    // Obtener el ID de usuario, tipo de colección, dirección de orden y tipo de datos desde la solicitud
    const { userId, collectionType, orderByDirection, typeData } = req.params;

    // Verificar si se proporcionaron todos los datos necesarios
    if (!userId || !collectionType || !orderByDirection || !typeData) {
      return res.status(400).json({
        error: "ID de usuario, tipo de colección, dirección de orden y tipo de datos requeridos",
      });
    }

    // Llamar al modelo para obtener los datos físicos con ordenamiento dinámico
    const data = await physicalDataModel.getDataWithDynamicSorting(
      userId,
      collectionType,
      orderByDirection,
      typeData
    );

    // Verificar si se encontraron datos
    if (data.length > 0) {
      return res.status(200).json({
        data,
      });
    } else {
      return res.status(404).json({
        error: "No se encontraron datos físicos para el usuario y tipo de colección especificados",
      });
    }
  } catch (error) {
    console.error("Error al obtener datos físicos con ordenamiento dinámico:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al obtener datos físicos con ordenamiento dinámico",
    });
  }
};


const getLatestPhysicalData = async (req, res) => {
  try {
    const nick = req.params.nick;
    const coleccion = req.params.coleccion;
    const tipo = req.params.typeData;
    const physicalData = await physicalDataModel.getLatestPhysicalData(
      nick,
      coleccion,
      tipo
    );

    return res.status(200).json(physicalData); // Devolver directamente physicalData
  } catch (error) {
    console.error("Error al obtener el último dato físico:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al obtener el último dato físico",
    });
  }
};

// Actualizar las configuraaciones de los datos fisicos
const updatePhysicalDataByNick = async (req, res) => {
  try {
    const { nick } = req.params; // Obtener el nick del usuario desde los parámetros de la URL
    const PhysicalData = req.body; // Obtener los datos actualizados del usuario desde el cuerpo de la solicitud

    // Llamar al modelo para actualizar los datos del usuario por ID
    const updatedUser = await physicalDataModel.updatePhysicalDataByNick(
      nick,
      PhysicalData
    );

    return res.status(200).json({
      status: "success",
      message: "Coonfiguarciones de PhysicalData actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar PhysicalData:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al actualizar PhysicalData",
    });
  }
};


module.exports = {
  createPhysicalData,
  getPhysicalDataByNick,
  addData,
  getDataWithDynamicSorting,
  getLatestPhysicalData,
  updatePhysicalDataByNick,
};
