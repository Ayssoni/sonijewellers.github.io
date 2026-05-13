import { auth, db } from "../firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Sign-Up Function
export async function signUpWithEmail(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: user.email,
            role: "user", // Default role
            createdAt: new Date(),
        });

        alert(`Account created! Welcome ${name}.`);
        window.location.href = "/index.html"; // Redirect after signup
    } catch (error) {
        console.error("Sign-Up Error: ", error.message);
        alert(error.message);
    }
}

// Login Function
export async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert(`Welcome back, ${user.email}!`);
        window.location.href = "/index.html"; // Redirect after login
    } catch (error) {
        console.error("Login Error: ", error.message);
        alert(error.message);
    }
}