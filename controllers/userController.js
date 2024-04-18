// Importar el modelo de usuario y funciones de Firebase
const userModel = require("../models/userModel");
const firebaseHelper = require("../helpers/firebaseHelper");


const createNewUser = async (req, res) => {
  try {
    // Recoger datos de la petición
    const userData = req.body;

    // Comprobar que los datos llegan bien
    if (!userData.email || !userData.password || !userData.nick) {
      return res.status(400).json({ error: "Error en los campos mínimos" });
    }

    // Comprobar duplicados
    const duplicationMessage = await firebaseHelper.isEmailOrNickDuplicated(
      userData.email,
      userData.nick
    );
    if (duplicationMessage) {
      return res.status(409).json({ error: duplicationMessage });
    }

    // Crear usuario en Firebase Authentication y obtener el token
    const userCredential = await firebaseHelper.signUpWithEmailPassword(
      userData.email,
      userData.password
    );

    // Obtener el ID de usuario generado por Firebase Authentication
    const userId = userCredential.user.uid;

    // Crear un objeto con los datos del usuario (excluyendo la contraseña)
    const userDocument = {
      email: userData.email,
      nick: userData.nick,
      userIdAuth: userId, // Agregar el ID de usuario a los datos del usuario
      verificado: false,
      primeros_pasos: 0,
      urlImagen: "",
      fechaCreacion: new Date(),
      primer_nombre: "",
      segundo_nombre: "",
      apellios: "",
      genero: "",
    };

    // Llamar al modelo para crear un nuevo usuario en la base de datos
    await userModel.createUser(userDocument);

    // Devolver respuesta exitosa
    return res.status(201).json({
      status: "success",
      message: "Usuario creado exitosamente",
      userIdAuth: userDocument.userId,
      token: userCredential.accessToken, // Obtener el token de acceso
    });
  } catch (error) {
    console.error("Error al crear un nuevo usuario:", error.message);

    // Manejar errores y devolver respuesta
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al crear un nuevo usuario",
    });
  }
};

const updateUserByAuthId = async (req, res) => {
  try {
    const userIdAuth = req.params.id; // ID de usuario para actualizar
    const newData = req.body; // Nuevos datos del usuario

    // Convertir campos a sus tipos de datos originales
    newData.verificado = newData.verificado === 'true'; // Convertir a booleano
    newData.primeros_pasos = parseInt(newData.primeros_pasos); // Convertir a entero


    let urlImagen = ''; // Inicializar la URL de la imagen como una cadena vacía

    // Verificar si se subió una imagen
    if (req.file) {
      const imagen = req.file;
      // Subir la imagen a Firebase Storage en una carpeta específica (por ejemplo, 'fotosPerfil')
      urlImagen = await firebaseHelper.subirArchivo(
        imagen,
        "FotoPerfil",
        imagen.originalname
      );
    }

    // Agregar la URL de la imagen al objeto newData si se subió una imagen
    if (urlImagen) {
      newData.urlImagen = urlImagen;
    }

    // Llamar al modelo para actualizar el usuario
    const success = await userModel.updateUserByAuthId(userIdAuth, newData);

    if (success) {
      return res
        .status(200)
        .json({ message: "Usuario actualizado correctamente" });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró el usuario para actualizar" });
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener datos de un usuario por su ID
const getUserByAuthId = async (req, res) => {
  try {
    // Obtener el ID de usuario desde los parámetros de la URL
    const userId = req.params.id;

    // Llamar al modelo para obtener los datos del usuario por su ID
    const userData = await userModel.getUserByAuthId(userId);

    // Devolver los datos del usuario en la respuesta
    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getUserByNick = async (req, res) => {
  try {
    const nick = req.params.nick;
    const user = await userModel.getUserByNick(nick);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error al obtener el usuario por nick:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Iniciar sesión de un usuario
const loginUser = async (req, res) => {
  try {
    // Obtener credenciales de inicio de sesión desde la petición
    const { email, password } = req.body;

    // Autenticar al usuario en Firebase Authentication
    const userCredential = await firebaseHelper.signInWithEmailPassword(
      email,
      password
    );

    // Obtener el token del usuario
    const token = await userCredential.user.getIdToken();

    // Devolver el token y cualquier otra información necesaria al cliente
    return res.status(200).json({
      status: "success",
      message: "Inicio de sesión exitoso",
      userId: userCredential.user.uid,
      token: token,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);

    // Manejar errores y devolver respuesta
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Lógica para cerrar sesión del usuario
    await firebaseHelper.signOut();

    // Devolver una respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "Cierre de sesión exitoso",
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Exportar las funciones para su uso en otros archivos
module.exports = {
  createNewUser,
  updateUserByAuthId,
  getAllUsers,
  getUserByAuthId,
  getUserByNick,
  loginUser,
  logoutUser
};
