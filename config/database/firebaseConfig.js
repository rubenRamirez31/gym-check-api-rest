const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const admin = require('firebase-admin');
const serviceAccount = require('../../../secretes/life-check-6f31f-firebase-adminsdk-tqj8f-eb1be14d5a.json');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAg3MejlCsxg1PCScKwgc1JEcS4aVR6xSo",
  authDomain: "life-check-6f31f.firebaseapp.com",
  projectId: "life-check-6f31f",
  storageBucket: "life-check-6f31f.appspot.com",
  messagingSenderId: "1029234988715",
  appId: "1:1029234988715:web:5069ba35e345719565c9ee",
  measurementId: null  // Deshabilita Analytics en entornos no compatibles
};

// Inicialización de la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Inicialización de Firestore con la configuración
const db = getFirestore(app);

// Inicialización de Firebase Admin con las credenciales
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {  db, admin };
