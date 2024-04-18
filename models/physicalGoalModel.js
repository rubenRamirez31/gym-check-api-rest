const { db } = require("../config/database/firebaseConfig");
const { collection, addDoc, doc, setDoc,getDoc,getDocs,query, Timestamp,orderBy, updateDoc   } = require("firebase/firestore")

const createMetaFisica = async (nick, meta) => {
    try {



          // Referencia a la colección de usuarios en Firestore
    const usersCollection = collection(db, "Datos-Fisicos",nick, "Metas");

    // Añadir un nuevo documento a la colección
    const newMeta = await addDoc(usersCollection, meta);



  
      return newMeta;
    } catch (error) {
      console.error('Error al crear la meta física en el modelo:', error.message);
      throw error;
    }
  };


module.exports = {
    createMetaFisica
};
