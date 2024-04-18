// Importar las funciones necesarias de Firebase y el helper
const {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  query,
  where
} = require("firebase/firestore");
const { db } = require("../config/database/firebaseConfig");
const { getProfilePhotoUrl } = require("../helpers/firebaseHelper");




// Crear un nuevo usuario
const createUser = async (userData) => {
  try {
    // Referencia a la colección de usuarios en Firestore
    const usersCollection = collection(db, "Usuarios");

    // Añadir un nuevo documento a la colección
    const newUserDocRef = await addDoc(usersCollection, userData);

    // Obtener el ID del nuevo usuario creado
    const newUserId = newUserDocRef.id;

    // Devolver el ID del nuevo usuario
    return newUserId;
  } catch (error) {
    console.error("Error al crear un nuevo usuario:", error.message);
    throw error;
  }
};

const updateUserByAuthId = async (userIdAuth, newData) => {
  try {
    // Construir una referencia a la colección "Usuarios" filtrando por el campo "userIdAuth"
    const userQuery = query(collection(db, "Usuarios"), where("userIdAuth", "==", userIdAuth));
    
    // Obtener el primer documento que coincida con el filtro
    const userQuerySnapshot = await getDocs(userQuery);
    
    // Verificar si se encontró un usuario
    if (!userQuerySnapshot.empty) {
      // Obtener la referencia al documento del usuario
      const userRef = userQuerySnapshot.docs[0].ref;

      // Obtener los datos actuales del usuario
      const userDataSnapshot = await getDoc(userRef);
      const userData = userDataSnapshot.data();

      // Construir un objeto con los campos a actualizar
      const fieldsToUpdate = {};

      // Recorrer los campos en newData y agregarlos al objeto fieldsToUpdate
      Object.keys(newData).forEach(key => {
        // Verificar si el campo existe en los datos actuales del usuario
        if (userData.hasOwnProperty(key)) {
          fieldsToUpdate[key] = newData[key];
        }
      });

      // Actualizar los campos proporcionados sin sobrescribir los existentes
      await updateDoc(userRef, fieldsToUpdate);

      return true; // Indicar que la actualización fue exitosa
    } else {
      // El usuario no existe
      throw new Error("El usuario no existe");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error.message);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "Usuarios"));
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    console.error('Error al obtener todas los Usuarios:', error.message);
    throw error;
  }
};

const getUserByAuthId = async (userIdAuth) => {
  try {
    // Consulta para obtener el usuario cuyo userIdAuth coincida con el proporcionado
    const userQuery = query(collection(db, "Usuarios"), where("userIdAuth", "==", userIdAuth));

    // Ejecutar la consulta y obtener el primer documento que cumple la condición
    const userQuerySnapshot = await getDocs(userQuery);
    const userData = userQuerySnapshot.docs.map((doc) => doc.data());

    // Verificar si se encontró un usuario
    if (userData.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    // Devolver los datos del usuario encontrado
    return userData[0];
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error.message);
    throw error;
  }
};


const getUserByNick = async (nick) => {
  try {
    // Consulta para obtener el usuario cuyo nick coincida con el proporcionado
    const userQuery = query(collection(db, "Usuarios"), where("nick", "==", nick));

    // Ejecutar la consulta y obtener el primer documento que cumple la condición
    const userQuerySnapshot = await getDocs(userQuery);
    const userData = userQuerySnapshot.docs.map((doc) => doc.data());

    // Verificar si se encontró un usuario
    if (userData.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    // Devolver los datos del usuario encontrado
    return userData[0];
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error.message);
    throw error;
  }
};

// Exportar las funciones para su uso en otros archivos
module.exports = {
  createUser,
  updateUserByAuthId,
  getAllUsers,
  getUserByAuthId,
  getUserByNick
};
