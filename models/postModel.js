const {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} = require("firebase/firestore");
const { db } = require("../config/database/firebaseConfig");

const crearPublicacion = async (publicacionData) => {
  try {
    const postsCollection = collection(db, "Publicaciones");

    // Agregar nueva publicación a la colección
    const newPostDocRef = await addDoc(postsCollection, {
      ...publicacionData,
    //  nick: nick,
    });

    // Obtener el ID de la nueva publicación
    const newPostId = newPostDocRef.id;

    return newPostId;
  } catch (error) {
    console.error(
      "Error al crear una nueva publicación en Firestore:",
      error.message
    );
    throw error;
  }
};

getPublicacionesPorNick = async (nick) => {
  try {
    const publicacionesCollection = collection(db, "Publicaciones");
    const q = query(publicacionesCollection, where("nick", "==", nick));
    const querySnapshot = await getDocs(q);

    const publicaciones = [];
    querySnapshot.forEach((doc) => {
      publicaciones.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return publicaciones;
  } catch (error) {
    console.error(
      "Error al obtener las publicaciones por nick en Firestore:",
      error.message
    );
    throw error;
  }
};

getPublicacionPorId = async (id) => {
  try {
    const publicacionDoc = await getDoc(doc(db, "Publicaciones", id));

    if (publicacionDoc.exists()) {
      return { id: publicacionDoc.id, ...publicacionDoc.data() };
    } else {
      throw new Error("No se encontró la publicación con el ID especificado.");
    }
  } catch (error) {
    console.error("Error al obtener la publicación por ID en Firestore:", error);
    throw error;
  }
};


getPublicacionesPorLugar = async (Lugar) => {
  try {
    const publicacionesCollection = collection(db, "Publicaciones");
    const q = query(publicacionesCollection, where("lugar", "==", Lugar));
    const querySnapshot = await getDocs(q);

    const publicaciones = [];
    querySnapshot.forEach((doc) => {
      publicaciones.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return publicaciones;
  } catch (error) {
    console.error(
      "Error al obtener las publicaciones por nick en Firestore:",
      error.message
    );
    throw error;
  }
};



modificarPublicacion = async (postId, newData) => {
  try {
    const postRef = doc(db, "Publicaciones", postId);
    const postSnapshot = await getDoc(postRef);

    // Verificar si el post existe
    if (postSnapshot.exists()) {
      // Construir un objeto solo con los campos a actualizar
      const fieldsToUpdate = {};
      Object.keys(newData).forEach(key => {
        fieldsToUpdate[key] = newData[key];
      });

      // Agregar el campo 'editado' si no está presente y establecerlo en true
      if (!fieldsToUpdate.hasOwnProperty('editado')) {
        fieldsToUpdate['editado'] = true;
      }

      // Actualizar los campos proporcionados sin sobrescribir los existentes
      await updateDoc(postRef, fieldsToUpdate);

      // Devolver true para indicar que la modificación fue exitosa
      return true;
    } else {
      // El documento con el ID proporcionado no existe
      throw new Error("No se encontró el post para modificar");
    }
  } catch (error) {
    console.error("Error al modificar la publicación en Firestore:", error.message);
    throw error;
  }
};


// Función para obtener todas las publicaciones
const getAllPosts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "Publicaciones"));
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    console.error('Error al obtener todas las publicaciones:', error.message);
    throw error;
  }
};


module.exports = { crearPublicacion, getPublicacionesPorNick, getAllPosts, getPublicacionesPorLugar,modificarPublicacion, getPublicacionPorId };
