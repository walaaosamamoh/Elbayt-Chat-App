// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCk-aaxsdfYFGpjV3uXkF-tjyueolb10fg",
  authDomain: "my-chat-31035.firebaseapp.com",
  projectId: "my-chat-31035",
  storageBucket: "my-chat-31035.firebasestorage.app",
  messagingSenderId: "888763018913",
  appId: "1:888763018913:web:65b1724cb030bdb5930ae0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage }
