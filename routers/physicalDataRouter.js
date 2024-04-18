const express = require("express");
const router = express.Router();
const fileUploadMiddleware = require('../middlewares/fileUploadMiddleware');
const physicalDataController = require("../controllers/physicalDataController");


// Ruta para crear primeros datos físicos
router.post("/crear-coleccion", physicalDataController.createPhysicalData);
//obtener los datos fisicos por nick
router.get("/obtener-coleccion/:nick", physicalDataController.getPhysicalDataByNick);
//agregar datos a registros
router.post("/add-data", physicalDataController.addData);

// Ruta para obtener datos físicos por usuario y tipo de ordenados por fecha 
router.get("/obtener-datos/:userId/:collectionType/:typeData/:orderByDirection", physicalDataController.getDataWithDynamicSorting);
//Obtener los ultimos datos fisicos
router.get('/ultimo-dato/:nick/:coleccion/:typeData', physicalDataController.getLatestPhysicalData);
//Actualizar configuraciones de datos fisicos
router.put('/actualizar-configuraciones/:nick', physicalDataController.updatePhysicalDataByNick);

module.exports = router;