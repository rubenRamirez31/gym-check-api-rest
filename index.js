const express = require('express');
const http = require('http');
const setupWebSocketServer = require('./websocket/websocketServer');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');

// Configurar CORS
app.use(cors());

// Convertir los datos del body a objetos JS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar body-parser para aceptar cargas útiles más grandes
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Rutas y controladores
const userRoutes = require('./routers/userRouter.js');
const socialRoutes = require('./routers/socialRouter.js');
const physicalDataRoutes = require('./routers/physicalDataRouter.js');
const trackingRoutes = require('./routers/trackingRouter.js');

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/datos-fisicos', physicalDataRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/tracking', trackingRoutes);

// Configurar la dirección IP y el puerto
// const ip = '192.168.1.69'; // Cambia esta dirección IP 
const ip = '192.168.56.1'; // Cambia esta dirección IP por la que desees

const server = http.createServer(app);

// Configurar servidor de WebSockets
setupWebSocketServer(server);

server.listen(port, ip, () => {
  console.log(`Servidor Gym Check prueba corriendo en http://${ip}:${port}`);
});
