import { auth, db } from "../firebase-config.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Google Provider
const provider = new GoogleAuthProvider();

// Google Sign-In Function
export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: "user",
            createdAt: new Date(),
        });

        alert(`Welcome ${user.displayName}, you are logged in!`);
        window.location.href = "/index.html";
    } catch (error) {
        console.error("Google Login Error:", error.code, error.message);
        if (error.code === 'auth/operation-not-allowed') {
            alert('Google authentication is not enabled in Firebase Console');
        } else if (error.code === 'auth/popup-blocked') {
            alert('Popup was blocked. Please allow popups for this site.');
        } else if (error.code === 'auth/unauthorized-domain') {
            alert('This domain is not authorized. Add it in Firebase Console settings.');
        } else {
            alert("Google Sign-In failed: " + error.message);
        }
    }
}