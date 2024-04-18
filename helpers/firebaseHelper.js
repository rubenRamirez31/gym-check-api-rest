// Importar las funciones necesarias de Firebase para Firestore (base de datos), Authentication (autenticación) y Storage (almacenamiento)
const { collection, where, query, getDocs } = require("firebase/firestore");
const { db } = require("../config/database/firebaseConfig");
const {
  getAuth,
  getUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const {
  getStorage,
  ref,
  uploadBytes,
  getMetadata,
  getDownloadURL,
} = require("firebase/storage");

// Obtener instancias de Firestore, Authentication y Storage
const storage = getStorage();
const auth = getAuth();

// Función para verificar si el correo electrónico o el nombre de usuario ya existen en la base de datos
const isEmailOrNickDuplicated = async (email, nick) => {
  try {
    // Referencia a la colección de usuarios en Firestore
    const usersCollection = collection(db, "Usuarios");

    // Consultar si hay algún usuario con el mismo correo
    const emailQuerySnapshot = await getDocs(
      query(usersCollection, where("email", "==", email))
    );
    const isEmailDuplicate = !emailQuerySnapshot.empty;

    // Consultar si hay algún usuario con el mismo nombre de usuario
    const nickQuerySnapshot = await getDocs(
      query(usersCollection, where("nick", "==", nick))
    );
    const isNickDuplicate = !nickQuerySnapshot.empty;

    // Retornar mensaje específico si hay duplicados en correo o nombre de usuario
    if (isEmailDuplicate && isNickDuplicate) {
      return "El correo electrónico y el nombre de usuario ya existen en la base de datos.";
    } else if (isEmailDuplicate) {
      return "El correo electrónico ya existe en la base de datos.";
    } else if (isNickDuplicate) {
      return "El nombre de usuario ya existe en la base de datos.";
    } else {
      return null; // No hay duplicados
    }
  } catch (error) {
    console.error("Error al verificar duplicados en Firestore:", error.message);
    throw error;
  }
};

// Función para registrar un nuevo usuario con correo y contraseña
const signUpWithEmailPassword = async (email, password) => {
  try {
    // Crear el usuario con correo y contraseña
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Obtener el usuario creado y su token de autenticación
    const user = userCredential.user;
    const token = await user.getIdToken();

    return { user, token };
  } catch (error) {
    console.error(
      "Error al crear usuario con correo y contraseña:",
      error.message
    );
    throw error;
  }
};

// Función para autenticar a un usuario con correo y contraseña
const signInWithEmailPassword = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const token = await user.getIdToken();
  return { user, token };
};

const subirArchivo = async (archivo, carpetaDestino, nombreArchivo) => {
  try {
    // Referencia al archivo en el Storage
    const storageRef = ref(storage, `${carpetaDestino}/${nombreArchivo}`);

    // Subir el archivo al Storage
    await uploadBytes(storageRef, archivo.buffer);

    // Obtener la URL de descarga del archivo
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    console.error(
      "Error al subir el archivo a Firebase Storage:",
      error.message
    );
    throw error;
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Cierre de sesión exitoso");
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
    throw error;
  }
};


const obtenerUrlVisualizacion = async (storageRef) => {
  try {
    // Obtener los metadatos del archivo
    const metadata = await getMetadata(storageRef);
    // Obtener la URL de visualización del archivo
    const url = metadata.fullPath;
    return url;
  } catch (error) {
    console.error('Error al obtener la URL de visualización del archivo:', error.message);
    throw error;
  }
};



// Exportar las funciones para su uso en otros archivos
module.exports = {
  isEmailOrNickDuplicated,
  signUpWithEmailPassword,
  signInWithEmailPassword,
  subirArchivo,
};
