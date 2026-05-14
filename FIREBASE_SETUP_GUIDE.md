# Firebase Setup Guide for Soni Jewellers

## ⚠️ Critical Issues Found & Fixed

### Issues You Were Experiencing:
1. ❌ **Phone numbers without country code** → "Invalid format" error
2. ❌ **Auth methods not enabled in Firebase Console**
3. ❌ **Domain not added to authorized list**
4. ❌ **Firestore security rules blocking writes**
5. ❌ **reCAPTCHA not properly configured**

---

## ✅ Step-by-Step Firebase Configuration

### **Step 1: Access Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on your project: **ayssoni-auth**
3. You should see it in the project list

---

### **Step 2: Enable Authentication Methods**

#### Email/Password Authentication:
1. Go to **Authentication** → **Sign-in method**
2. Click on **Email/Password**
3. Toggle **Enable** to ON
4. Check **Password Authentication** ✓
5. Click **Save**

#### Google Sign-In:
1. Go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle **Enable** to ON
4. Select or create a Google Cloud Project
5. Add project support email
6. Click **Save**

#### Phone Authentication:
1. Go to **Authentication** → **Sign-in method**
2. Click on **Phone**
3. Toggle **Enable** to ON
4. Click **Save**

---

### **Step 3: Add Your Domain to Authorized List**

1. Go to **Authentication** → **Settings** (gear icon top right)
2. Scroll to **Authorized domains**
3. Click **Add domain**
4. Add these domains:
   - `localhost:3000` (for local testing)
   - `127.0.0.1:3000` (for local testing)
   - `ayssoni.github.io` (your live domain)
5. Click **Add**

---

### **Step 4: Setup Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project from Firebase
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add Authorized redirect URIs:
   - `https://ayssoni.github.io/`
   - `https://ayssoni.github.io/login.html`
   - `http://localhost:3000/` (for testing)
7. Copy the **Client ID** 
8. Go back to Firebase Console
9. In Authentication → Google → Web SDK configuration
10. Paste the Client ID

---

### **Step 5: Setup Firestore Database**

1. Go to **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode**
4. Choose region: **asia-southeast1** (Singapore - closest to India)
5. Click **Create**

6. **Setup Security Rules:**
   - Go to **Firestore** → **Rules** tab
   - Replace all content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow anyone to read products (public)
    match /products/{document=**} {
      allow read: if true;
    }
    
    // Allow only authenticated users to create orders
    match /orders/{document=**} {
      allow create: if request.auth != null;
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

7. Click **Publish**

---

### **Step 6: Setup reCAPTCHA for Phone Auth**

1. Go to **Authentication** → **Settings**
2. Scroll to **reCAPTCHA Enterprise**
3. Click **Set up reCAPTCHA Enterprise**
4. Go to [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
5. Click **+** to create new site
6. Name: `Soni Jewellers`
7. reCAPTCHA type: **reCAPTCHA v3**
8. Domains: `ayssoni.github.io`, `localhost`
9. Accept Terms and Create
10. Copy **Site Key** and **Secret Key**
11. Go back to Firebase Console
12. Paste the keys in reCAPTCHA Enterprise section

---

### **Step 7: Test Locally (Optional)**

To test locally before pushing to GitHub:

```bash
# Install a simple HTTP server
npm install -g http-server

# Navigate to your project folder
cd /Users/aysoni/Documents/ayssoni.github.io

# Start local server
http-server -p 3000

# Open browser
# http://localhost:3000/login.html
```

---

## 🔧 What Was Fixed in Your Code

### 1. **Phone Auth - Country Code**
**Before:**
```html
<input type="tel" id="phone-number" placeholder="Enter your phone number">
```

**After:**
```html
<div style="display: flex; gap: 5px;">
    <input type="text" id="country-code" placeholder="+91" value="+91">
    <input type="tel" id="phone-number" placeholder="Enter 10-digit number">
</div>
```

### 2. **Better Error Messages**
**Before:** `"Invalid format"` (confusing)
**After:** `"Invalid phone number format. Use format: +91XXXXXXXXXX (for India)"`

### 3. **Email Validation Added**
**Before:** No validation
**After:** Checks for weak passwords, duplicate emails, etc.

### 4. **Google Auth Error Handling**
**Before:** Generic error message
**After:** Specific messages for:
- Domain not authorized
- Google not enabled
- Popup blocked

---

## 🚨 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid format` | Phone number without +91 | Now fixed - adds country code automatically |
| `Operation not allowed` | Auth method not enabled in Firebase | Enable in Firebase Console → Auth → Sign-in methods |
| `Unauthorized domain` | Domain not added to whitelist | Add domain in Firebase Console → Auth → Settings → Authorized domains |
| `Invalid API key` | Wrong credentials | Check firebase-config.js credentials match Firebase Console |
| `[PERMISSION_DENIED]` | Firestore rules blocking writes | Update security rules (see Step 5) |
| `Network error` | CORS or connectivity | Check internet, verify domain is authorized |

---

## ✅ Final Checklist

- [ ] Email/Password authentication enabled in Firebase Console
- [ ] Google Sign-In enabled and configured
- [ ] Phone authentication enabled
- [ ] Domain added to authorized list: `ayssoni.github.io`
- [ ] Firestore database created with proper security rules
- [ ] reCAPTCHA v3 configured
- [ ] Run `git add .` and `git commit -m "Fixed Firebase authentication"`
- [ ] Run `git push` to deploy

---

## 📝 Credentials Location

Your Firebase config is here (already set up):
`/js/firebase-config.js`

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBWjXaHi75gynSkf4yIG9d5TqRulan85hQ",
    authDomain: "ayssoni-auth.firebaseapp.com",
    projectId: "ayssoni-auth",
    storageBucket: "ayssoni-auth.firebasestorage.app",
    messagingSenderId: "195951934620",
    appId: "1:195951934620:web:24a7b9602512bc4b2a8159",
    measurementId: "G-JZ25DE0ZJ0"
};
```

✓ No need to change these - they're correct!

---

## 🆘 Still Having Issues?

1. **Open Browser Console (F12)** and look for error messages
2. **Check Firebase Console Logs** → Reporting tools
3. **Verify all 6 steps** above are completed
4. **Clear browser cache** and try again
5. **Wait 5-10 minutes** after making Firebase changes for propagation

---

## 📞 Quick Debugging

Add this to `login.html` temporarily (remove after testing):

```html
<script>
    import { auth } from "./js/firebase-config.js";
    window.addEventListener('load', () => {
        console.log('Firebase Auth initialized:', auth);
        console.log('Current user:', auth.currentUser);
    });
</script>
```

Then check browser console (F12) for any initialization errors.
