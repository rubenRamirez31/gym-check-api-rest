const express = require("express");
const router = express.Router();
const fileUploadMiddleware = require('../middlewares/fileUploadMiddleware');
const physicalGoalsController = require("../controllers/physicalGoalsController")
// Ruta para crear una meta física
router.post('/crear-meta-fisica', fileUploadMiddleware.fields([
    { name: 'fotoInicio1', maxCount: 1 },
    { name: 'fotoInicio2', maxCount: 1 },
    { name: 'fotoInicio3', maxCount: 1 }
]), physicalGoalsController.createMetaFisica);


module.exports = router;


// Exportar routers
module.exports = router;