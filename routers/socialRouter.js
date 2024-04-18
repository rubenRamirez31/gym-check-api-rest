const express = require("express");
const router = express.Router();
const postsController = require('../controllers/postController');
const uploadMiddleware = require('../middlewares/fileUploadMiddleware');
const firebaseMiddleware = require('../middlewares/firebaseMiddleware')

//Rutas para publicaciones
// Ruta para crear una nueva publicación
router.post('/post/create-post', uploadMiddleware.single('imagen'),postsController.createPost);

// Ruta para obtener publicaciones por el nick del usuario

router.get('/post/get-posts-by-nick/:nick', postsController.getPostsByNick);
router.get('/post/get-posts-by-id/:id', postsController.getPostsByID);
// Ruta para obtener publicaciones por el lugar
router.get('/post/get-posts-by-lugar/:lugar', postsController.getPostsByLugar);

router.get('/post/get-all', postsController.getAllPosts);

router.put('/post/editar/:id', postsController.modificarPostPorId);

module.exports = router;
