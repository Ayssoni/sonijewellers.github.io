import { auth, db } from "../firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode) {
    const errorMap = {
        'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
        'auth/weak-password': 'Password must be at least 6 characters long.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-not-found': 'No account found with this email. Try signing up.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-login-attempts': 'Too many failed attempts. Please try again later.',
        'auth/operation-not-allowed': 'Email/Password authentication is not enabled.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
    };
    return errorMap[errorCode] || errorCode;
}

// Sign-Up Function
export async function signUpWithEmail(email, password, name) {
    try {
        if (!email || !password || !name) {
            alert('Please fill in all fields');
            return;
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: user.email,
            role: "user",
            createdAt: new Date(),
        });

        alert(`Account created! Welcome ${name}.`);
        window.location.href = "/index.html";
    } catch (error) {
        console.error("Sign-Up Error: ", error.code, error.message);
        alert('Sign-Up Failed:\n' + getErrorMessage(error.code));
    }
}

// Login Function
export async function loginWithEmail(email, password) {
    try {
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert(`Welcome back, ${user.email}!`);
        window.location.href = "/index.html";
    } catch (error) {
        console.error("Login Error: ", error.code, error.message);
        alert('Login Failed:\n' + getErrorMessage(error.code));
    }
}