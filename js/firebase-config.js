// Import the Firebase SDK services required
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Replace with your Firebase configuration values
const firebaseConfig = {
    apiKey: "AIzaSyBWjXaHi75gynSkf4yIG9d5TqRulan85hQ",
  authDomain: "ayssoni-auth.firebaseapp.com",
  projectId: "ayssoni-auth",
  storageBucket: "ayssoni-auth.firebasestorage.app",
  messagingSenderId: "195951934620",
  appId: "1:195951934620:web:24a7b9602512bc4b2a8159",
  measurementId: "G-JZ25DE0ZJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // Authentication Service
export const db = getFirestore(app); // Firestore database

console.log("Firebase is successfully connected and initialized!");