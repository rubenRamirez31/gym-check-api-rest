const functions = require("firebase-functions");
const express = require("express");

const app = express();
const cors = require("cors");

// Configurar CORS
app.use(cors());

// Convertir los datos del body a objetos JS
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Rutas y controladores
const userRoutes = require("../routers/userRouter.js");
const socialRoutes = require("../routers/socialRouter.js");
const physicalDataRoutes = require("../routers/physicalDataRouter.js");
const trackingRoutes = require("../routers/trackingRouter.js");

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/datos-fisicos", physicalDataRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/tracking", trackingRoutes);

// Habilitar CORS para todas las rutas
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// Exportar como función de Firebase
exports.api = functions.https.onRequest(app);
