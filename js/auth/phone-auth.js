import { auth } from "../firebase-config.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

export function setupRecaptcha() {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved
        }
    }, auth);
}

export async function sendOTP(phoneNumber) {
    const appVerifier = window.recaptchaVerifier;
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        alert("OTP sent!");
    } catch (error) {
        console.error("Error sending OTP", error);
        alert(error.message);
    }
}

export async function verifyOTP(otpCode) {
    try {
        const result = await window.confirmationResult.confirm(otpCode);
        const user = result.user;
        alert(`Phone verified successfully! Welcome.`);
        window.location.href = "/index.html";
    } catch (error) {
        console.error("Error verifying OTP", error);
        alert(error.message);
    }
}
