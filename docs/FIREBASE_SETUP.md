# 🔥 Firebase Google Auth Setup Guide

This guide will help you set up Google Authentication for Otaku_World using Firebase.

## Step 1: Create Firebase Project

1. **Go to Firebase Console**

   - Visit: https://console.firebase.google.com
   - Click "Create a project" or "Add project"

2. **Project Configuration**

   - Project name: `otaku-world` or `Otaku_World`
   - Project ID: `otaku-world-xxxxx` (Firebase will generate unique ID)
   - Enable Google Analytics (optional but recommended)

3. **Wait for project creation** (takes 1-2 minutes)

## Step 2: Enable Authentication

1. **Navigate to Authentication**

   - In Firebase console, click "Authentication" in left sidebar
   - Click "Get started" if it's your first time

2. **Configure Sign-in Methods**
   - Go to "Sign-in method" tab
   - Click on "Google" provider
   - Toggle "Enable" switch
   - **Important**: Add authorized domains:
     - `localhost` (for development)
     - `localhost:5173` (Vite dev server)
     - Your production domain (when deployed)
   - Click "Save"

## Step 3: Register Web App

1. **Add Web App**

   - In Project Overview, click the web icon `</>`
   - App nickname: `otaku-world-web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

2. **Copy Firebase Configuration**
   ```javascript
   // You'll get something like this:
   const firebaseConfig = {
     apiKey: "AIzaSyB...",
     authDomain: "otaku-world-xxxxx.firebaseapp.com",
     projectId: "otaku-world-xxxxx",
     storageBucket: "otaku-world-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456",
   };
   ```

## Step 4: Configure Google Cloud Console (Optional but Recommended)

1. **Open Google Cloud Console**

   - Visit: https://console.cloud.google.com
   - Select your Firebase project (same name)

2. **APIs & Services → Credentials**

   - You should see auto-created OAuth 2.0 client IDs
   - Click on "Web client (auto created by Google Service)"

3. **Configure OAuth Consent Screen**

   - Go to "APIs & Services" → "OAuth consent screen"
   - Fill in required information:
     - App name: `Otaku_World`
     - User support email: Your email
     - App logo: Upload anime-themed logo (optional)
     - App domain: Your domain (when deployed)
     - Developer contact: Your email

4. **Add Authorized Domains**
   - In OAuth consent screen:
     - `localhost` (development)
     - Your production domain
   - In Credentials → OAuth 2.0 client:
     - Authorized JavaScript origins: `http://localhost:5173`
     - Authorized redirect URIs: `http://localhost:5173/__/auth/handler`

## Step 5: Update Environment Variables

Replace the placeholder values in `client/.env`:

```env
# Firebase Configuration (✅ CONFIGURED)
VITE_FIREBASE_API_KEY=AIzaSyCe6B_ygxxi46FQARUUsu_pXMWjFN1mwTQ
VITE_FIREBASE_AUTH_DOMAIN=otakuworld-c8f17.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=otakuworld-c8f17
VITE_FIREBASE_STORAGE_BUCKET=otakuworld-c8f17.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=327932734265
VITE_FIREBASE_APP_ID=1:327932734265:web:a2ed657b4de6faf98cd6e8
```

## Step 6: Set Up Firebase Admin (Server)

1. **Generate Service Account Key**

   - In Firebase Console → Project Settings
   - Go to "Service accounts" tab
   - Click "Generate new private key"
   - Download the JSON file
   - **IMPORTANT**: Rename to `serviceAccountKey.json`
   - Place in `server/` directory
   - **NEVER commit this file to Git!**

2. **Update Server Environment**
   ```env
   # In root .env file
   GOOGLE_APPLICATION_CREDENTIALS=./server/serviceAccountKey.json
   ```

## Step 7: Test the Setup

1. **Start Development Servers**

   ```bash
   # Start client
   cd client && npm run dev

   # Start server (in new terminal)
   cd server && npm start
   ```

2. **Test Google Login**
   - Open http://localhost:5173
   - Go to Login page
   - Click "Sign in with Google"
   - Should open Google OAuth popup
   - After successful login, should redirect to home page

## Common Issues & Solutions

### Issue: "redirect_uri_mismatch"

**Solution**: Add exact redirect URI to Google Cloud Console:

- `http://localhost:5173/__/auth/handler`

### Issue: "This app isn't verified"

**Solution**:

- Click "Advanced" → "Go to Otaku_World (unsafe)"
- This is normal during development

### Issue: "Firebase configuration not found"

**Solution**:

- Check environment variables are correctly set
- Restart Vite dev server after changing .env

### Issue: "Token verification failed"

**Solution**:

- Ensure `serviceAccountKey.json` is in correct location
- Check Firebase Admin configuration

## Security Notes

🔒 **Important Security Practices**:

1. **Never commit sensitive files**:

   - `serviceAccountKey.json`
   - `.env` files with real credentials

2. **Use environment variables**:

   - All sensitive data should be in `.env` files
   - Different configs for development/production

3. **Firebase Security Rules**:

   - Configure Firestore rules when adding database features
   - Restrict access to authenticated users only

4. **Domain restrictions**:
   - Only add necessary domains to authorized lists
   - Remove localhost from production configs

## Next Steps

After successful setup:

1. ✅ Test Google authentication
2. ✅ Verify user data sync to MongoDB
3. ✅ Test protected routes
4. 🔜 Add Twitter authentication
5. 🔜 Implement user profile management
6. 🔜 Add anime favorites functionality

---

**Need Help?**

- Check Firebase Console logs
- Review browser developer tools
- Verify all environment variables are set correctly
