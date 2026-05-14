import { auth } from "../firebase-config.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

export function setupRecaptcha() {
    try {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                console.log('reCAPTCHA solved');
            }
        }, auth);
    } catch (error) {
        console.error('reCAPTCHA setup error:', error);
    }
}

export async function sendOTP(phoneNumber) {
    const appVerifier = window.recaptchaVerifier;
    try {
        // Validate phone number format
        if (!phoneNumber.startsWith('+')) {
            alert('Phone number must start with country code (e.g., +91)');
            return;
        }
        
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        alert("OTP sent! Check your phone.");
    } catch (error) {
        console.error("Error sending OTP", error.code, error.message);
        if (error.code === 'auth/invalid-phone-number') {
            alert('Invalid phone number format.\nUse format: +91XXXXXXXXXX (for India)');
        } else if (error.code === 'auth/operation-not-allowed') {
            alert('Phone authentication is not enabled in Firebase Console');
        } else if (error.code === 'auth/too-many-requests') {
            alert('Too many attempts. Please try again later.');
        } else {
            alert('Error: ' + error.message);
        }
    }
}

export async function verifyOTP(otpCode) {
    try {
        if (!window.confirmationResult) {
            alert('Please send OTP first');
            return;
        }
        
        const result = await window.confirmationResult.confirm(otpCode);
        const user = result.user;
        alert(`Phone verified successfully! Welcome.`);
        window.location.href = "/index.html";
    } catch (error) {
        console.error("Error verifying OTP", error.code, error.message);
        if (error.code === 'auth/invalid-verification-code') {
            alert('Invalid OTP. Please try again.');
        } else {
            alert('Verification failed: ' + error.message);
        }
    }
}
