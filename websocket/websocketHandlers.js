const physicalDataModel = require("../models/physicalDataModel");

// Manejar evento para obtener los últimos datos físicos
const handleGetLatestPhysicalData = async (io, nick, coleccion, tipo) => {
  try {
    const physicalData = await physicalDataModel.getLatestPhysicalData(nick, coleccion, tipo);
    io.emit('latestPhysicalData', physicalData); // Emitir los datos al cliente a través de WebSocket
  } catch (error) {
    console.error("Error al obtener el último dato físico:", error.message);
    // Manejar el error según sea necesario
  }
};

// Manejar evento para obtener datos físicos con ordenamiento dinámico
const handleGetDataWithDynamicSorting = async (io, userId, collectionType, orderByDirection, typeData) => {
  try {
    const data = await physicalDataModel.getDataWithDynamicSorting(userId, collectionType, orderByDirection, typeData);
    io.emit('dataWithDynamicSorting', data); // Emitir los datos al cliente a través de WebSocket
  } catch (error) {
    console.error("Error al obtener datos físicos con ordenamiento dinámico:", error.message);
    // Manejar el error según sea necesario
  }
};

module.exports = {
  handleGetLatestPhysicalData,
  handleGetDataWithDynamicSorting
};
