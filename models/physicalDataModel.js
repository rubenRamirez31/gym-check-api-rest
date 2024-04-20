const { db } = require("../config/database/firebaseConfig");
const { collection, addDoc, doc, setDoc,getDoc,getDocs,query, Timestamp,orderBy, updateDoc, where,limit   } = require("firebase/firestore");

// Crear datos físicos para un usuario
const createPhysicalData = async (userNick) => {
  try {
    // Referencia a la colección de Datos-Fisicos en Firestore
    const userCollectionRef = collection(db, "Datos-Fisicos");

    // Crear un nuevo documento con el mismo nombre que el nick del usuario
    const userDocRef = doc(userCollectionRef, userNick);
    await setDoc(userDocRef, {meta: "", diaFrecuencia: ""});

    // Crear las subcolecciones para los diferentes tipos de datos físicos
    const subCollections = [
      "Metas",
      "Registro-Corporal",
      "Registro-Semanal",
      "Registro-Antropometrico"
      // "Peso",
      // "GrasaCorporal",
      // "CircunferenciaCintura",
      // "PresionArterial",
      // "FrecuenciaCardiaca",
      // "Flexibilidad",
      // "Hidratacion",
      // "Respiracion",
      // "Sueno",
      // "Energia"
    ];

    // Agregar un dato inicial a cada subcolección
    await Promise.all(
      subCollections.map(async (subCollection) => {
        const subCollectionRef = collection(userDocRef, subCollection);
        await addDoc(subCollectionRef, { valor: "", fecha: "" });
      })
    );

    return true;
  } catch (error) {
    console.error("Error al crear datos físicos:", error.message);
    throw error;
  }
};



// Obtener datos físicos por ID de usuario (nick)
const getPhysicalDataByNick = async (nick) => {
  try {
    // Referencia al documento de datos físicos utilizando el nick
    const userDocRef = doc(db, "Datos-Fisicos", nick);

    // Obtener el documento
    const docSnapshot = await getDoc(userDocRef);

    // Verificar si el documento existe
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      return null; // El documento no existe
    }
  } catch (error) {
    console.error("Error al obtener datos físicos por ID de usuario (nick):", error.message);
    throw error;
  }
};


// Agregar un dato a la colección correspondiente dinámicamente
const addData = async (nick, coleccion, data) => {
    try {
        // Verificar si la colección es válida
        const validTypes = [ "Mis-Metas",
        "Registro-Corporal",
        "Registro-Semanal",
      "Registro-Antropometrico"];
        if (!validTypes.includes(coleccion)) {
            throw new Error("Colección no válida");
        }

        // Referencia a la subcolección correspondiente dentro de la colección "Datos-Fisicos"
        const dataCollectionRef = collection(db, "Datos-Fisicos", nick, coleccion);

        const currentDate = Timestamp.now();

        // Agregar el dato como un nuevo documento en la subcolección
        await setDoc(doc(dataCollectionRef), {fecha: currentDate, ...data});

        return true; // Indicar éxito al agregar el dato
    } catch (error) {
        console.error("Error al agregar dato:", error.message);
        throw error;
    }
};


const getDataWithDynamicSorting = async (userId, collectionType, orderByTipo,orderByDirection, typeData) => {
  try {
    // Referencia a la colección "Datos-Fisicos" del usuario y tipo de colección especificados
    const dataCollectionRef = collection(db, "Datos-Fisicos", userId, collectionType);

    // Consulta para obtener los documentos con ordenamiento dinámico y filtro por tipo
    const querySnapshot = await getDocs(
      query(
        dataCollectionRef,
        orderBy(orderByTipo, orderByDirection),
        where("tipo", "==", typeData) // Filtro por el tipo especificado
      )
    );

    // Formatear las fechas antes de enviar los datos
    const data = [];
    querySnapshot.forEach(doc => {
      const formattedData = doc.data();
      formattedData.fecha = new Date(formattedData.fecha.seconds * 1000).toLocaleDateString(); // Formatear la fecha
      data.push({ id: doc.id, ...formattedData });
    });

    return data;
  } catch (error) {
    console.error("Error al obtener datos físicos con ordenamiento dinámico:", error.message);
    throw error;
  }
};


const getLatestPhysicalData = async (nick, coleccion, tipo) => {
  try {
    const latestPhysicalData = {};

    // Consultar los documentos ordenados por fecha de forma descendente y limitar a 1
    const querySnapshot = await getDocs(
      query(
        collection(db, 'Datos-Fisicos', nick, coleccion),
        where('tipo', '==', tipo), // Filtrar por el tipo especificado
        orderBy('fecha', 'desc'),
        limit(1)
      )
    );

    if (!querySnapshot.empty) {
      const latestData = querySnapshot.docs[0].data();
      latestData.fecha = new Date(latestData.fecha.seconds * 1000).toLocaleDateString(); // Formatear la fecha
      return latestData; // Devolver directamente los datos
    } else {
      return {}; // Si no hay datos, devolver un objeto vacío
    }
  } catch (error) {
    console.error('Error al obtener los últimos datos físicos:', error.message);
    throw error;
  }
};



const updatePhysicalDataByNick = async (nick, PhysicalData) => {
  try {
      // Referencia al documento del usuario por su nick
      const dataDocRef = doc(db, "Datos-Fisicos", nick);

      // Actualizar los datos del usuario en la base de datos
      await updateDoc(dataDocRef, PhysicalData);

      return PhysicalData; // Devolver los datos actualizados del usuario
  } catch (error) {
      console.error("Error al actualizar usuario:", error.message);
      throw error;
  }
};

//crear meta
//actualizar meta
//eliminar meta



module.exports = {
  createPhysicalData,
  getPhysicalDataByNick,
  addData,
  getDataWithDynamicSorting,
  getLatestPhysicalData,
  updatePhysicalDataByNick
};
