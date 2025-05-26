// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Opcional

// Configuração do Firebase fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyCIhss8yBh7LhNK3M_6FWXMLRQAO6JUKp0",
  authDomain: "luckyybet0.firebaseapp.com",
  projectId: "luckyybet0",
  storageBucket: "luckyybet0.appspot.com",
  messagingSenderId: "67706346924",
  appId: "1:67706346924:web:5a71f0aab29c042119ee09",
  measurementId: "G-BBH5HBNXM9" // Opcional
  // databaseURL: "https://luckyybet0-default-rtdb.firebaseio.com" // Adicionar se for usar Realtime DB
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // Opcional

export { app, auth, db }; // Exportar instâncias necessárias

