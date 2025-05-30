import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase usando variáveis de ambiente
// Certifique-se de criar um arquivo .env na raiz do projeto com as seguintes variáveis:
// VITE_FIREBASE_API_KEY=SUA_API_KEY
// VITE_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
// VITE_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
// VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
// VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_SENDER_ID
// VITE_FIREBASE_APP_ID=SEU_APP_ID

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

