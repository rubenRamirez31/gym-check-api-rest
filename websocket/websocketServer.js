const socketIo = require('socket.io');
const http = require('http');
const { handleGetLatestPhysicalData, handleGetDataWithDynamicSorting } = require('./websocketHandlers');

// Configurar el servidor de WebSockets
const setupWebSocketServer = (httpServer) => {
  const io = socketIo(httpServer);

  io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Manejar evento para obtener los últimos datos físicos
    socket.on('getLatestPhysicalData', async ({ nick, coleccion, tipo }) => {
      // Aquí llamamos a la función con el parámetro 'io'
      handleGetLatestPhysicalData(io, nick, coleccion, tipo);
    });

    // Manejar evento para obtener datos físicos con ordenamiento dinámico
    socket.on('getDataWithDynamicSorting', async ({ userId, collectionType, orderByDirection, typeData }) => {
      // Aquí llamamos a la función con el parámetro 'io'
      handleGetDataWithDynamicSorting(io, userId, collectionType, orderByDirection, typeData);
    });

    // Manejar desconexión de cliente
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });

  return io;
};

module.exports = setupWebSocketServer;
