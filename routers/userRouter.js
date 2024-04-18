const express = require("express");
const router = express.Router();
const fileUploadMiddleware = require('../middlewares/fileUploadMiddleware');
const usuarioController = require("../controllers/userController")
const physicalDataController = require("../controllers/physicalDataController");



router.post("/crear-usuario", usuarioController.createNewUser);
router.put("/actualizar-usuario/:id", fileUploadMiddleware.single('fotoPerfil'),usuarioController.updateUserByAuthId);
router.get('/obtener-usuarios', usuarioController.getAllUsers);
router.get('/obtener-by-id/:id', usuarioController.getUserByAuthId);
router.get('/obtener-by-nick/:nick', usuarioController.getUserByNick);

router.post('/login', usuarioController.loginUser);
router.post('/logout', usuarioController.logoutUser);





// Exportar routers
module.exports = router;