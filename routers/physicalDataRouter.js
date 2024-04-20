const express = require("express");
const router = express.Router();
const physicalDataController = require("../controllers/physicalDataController");

// Rutas
router.post("/crear-coleccion", physicalDataController.createPhysicalData);
router.post("/add-data", physicalDataController.addData);
router.get("/obtener-datos/:userId/:collectionType/:typeData/:orderByTipo/:orderByDirection", physicalDataController.getDataWithDynamicSorting);
router.get('/ultimo-dato/:nick/:coleccion/:typeData', physicalDataController.getLatestPhysicalData);
router.put('/actualizar-configuraciones/:nick', physicalDataController.updatePhysicalDataByNick);

module.exports = router;
