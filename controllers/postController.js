const postModel = require("../models/postModel");
const firebaseHelper = require("../helpers/firebaseHelper");
const { getMetadata } = require("firebase/storage");
const { validationResult } = require('express-validator');

//const firebaseMiddleware = require('../../middlewares/firebaseMiddleware');

const createPost = async (req, res) => {
  try {
    

    // Recoger datos de la petición
    const postData = req.body;

    // Comprobar que los datos mínimos están presentes
    if (!postData.texto) {
      return res.status(400).json({
        error:
          "Se requiere al menos un texto o emoji para realizar una publicación",
      });
    }

    // Verificar si se subió una imagen o video
    let urlMedia = null;
    // Verificar si se subió una imagen
    if (req.file) {
      // Subir el archivo a Firebase Storage en la carpeta 'Posts'
      urlMedia = await firebaseHelper.subirArchivo(
        req.file,
        "Posts",
        req.file.originalname
      );
    }

    // Obtener información del usuario por su idAuth
    //const userInfo = await firebaseHelper.getUserInfoById(userId);

    // Crear objeto de datos de la publicación
    const nuevaPublicacion = {
      userIdAuth: postData.userId || "",
      lugar: postData.lugar || "",
      texto: postData.texto || "",
      URLimagen: urlMedia || "",
      fechaCreacion: new Date(),
      estado: postData.estado || "",
      nick: postData.nick || "",
      editado : false
    };

    //console.log("Imagen 64:  " + postData.imagen)
    // Crear la publicación en el modelo
    await postModel.crearPublicacion(nuevaPublicacion);

    return res.status(201).json({
      status: "success",
      message: `Publicación creada exitosamente por ${postData.nick}`,
      imgenG4: postData.imagen,
      //postId: postId,
    });
  } catch (error) {
    console.error("Error al crear una nueva publicación:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al crear una nueva publicación",
    });
  }
};
// Ver Publicaciones por nick para perfiles
const getPostsByNick = async (req, res) => {
  try {
    // Recoger el nick del usuario de la petición
    const { nick } = req.params;

    // Obtener las publicaciones por el nick del usuario
    const publicaciones = await postModel.getPublicacionesPorNick(nick);

    // Comprobar si existen publicaciones
    if (publicaciones.length === 0) {
      return res.status(404).json({
        message: "Este usuario no existe o todavía no tiene publicaciones",
      });
    }

    // Devolver las publicaciones en la respuesta
    return res.status(200).json({ publicaciones });
  } catch (error) {
    console.error(
      "Error al obtener las publicaciones por nick:",
      error.message
    );
    return res.status(500).json({
      status: "error",
      message:
        "Error interno del servidor al obtener las publicaciones por nick",
    });
  }
};

// Ver Publicaciones por nick para perfiles
const getPostsByLugar = async (req, res) => {
  try {
    // Recoger el nick del usuario de la petición
    const { lugar } = req.params;

    // Obtener las publicaciones por el nick del usuario
    const publicaciones = await postModel.getPublicacionesPorLugar(lugar);

    // Comprobar si existen publicaciones
    if (publicaciones.length === 0) {
      return res.status(404).json({
        message: "No existen publicaciones en este lugar",
      });
    }

    // Devolver las publicaciones en la respuesta
    return res.status(200).json({ publicaciones });
  } catch (error) {
    console.error(
      "Error al obtener las publicaciones por lugar:",
      error.message
    );
    return res.status(500).json({
      status: "error",
      message:
        "Error interno del servidor al obtener las publicaciones por lugar",
    });
  }
};

// Ver Publicaciones por nick para perfiles
const getPostsByID = async (req, res) => {
  try {
    // Recoger el nick del usuario de la petición
    const { id } = req.params;

    // Obtener las publicaciones por el nick del usuario
    const publicaciones = await postModel.getPublicacionPorId(id);

    // Comprobar si existen publicaciones
    if (publicaciones.length === 0) {
      return res.status(404).json({
        message: "No exoste esta piblicacion",
      });
    }

    // Devolver las publicaciones en la respuesta
    return res.status(200).json({ publicaciones });
  } catch (error) {
    console.error(
      "Error al obtener la publicacion",
      error.message
    );
    return res.status(500).json({
      status: "error",
      message:
        "Error interno del servidor al obtener las publicaciones por lugar",
    });
  }
};


const getAllPosts = async (req, res) => {
  try {
    // Obtener todas las publicaciones
    const posts = await postModel.getAllPosts();

    // Comprobar si existen publicaciones
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay publicaciones disponibles" });
    }

    // Devolver las publicaciones en la respuesta
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error al obtener todas las publicaciones:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al obtener todas las publicaciones",
    });
  }
};

// Controlador para modificar un post por su ID
// Controlador para modificar un post por su ID
const modificarPostPorId = async (req, res) => {
  try {
    const postId = req.params.id; // ID del post a modificar
    const newData = req.body; // Nuevos datos del post

    // Validar los datos recibidos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Modificar el post en el modelo
    const success = await postModel.modificarPublicacion(postId, newData);
    if (success) {
      return res.status(200).json({ message: "Post modificado correctamente" });
    } else {
      return res.status(404).json({ message: "No se encontró el post para modificar" });
    }
  } catch (error) {
    console.error("Error al modificar el post:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


module.exports = {
  createPost,
  getPostsByNick,
  getAllPosts,
  modificarPostPorId,
  getPostsByLugar,
  getPostsByID
};
