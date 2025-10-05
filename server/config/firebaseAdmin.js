// server/config/firebaseAdmin.js
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
// You'll need to place your service account key file in the server directory
// and update the path below, or use environment variable GOOGLE_APPLICATION_CREDENTIALS

let firebaseAdmin;

try {
  // Option 1: Using service account key file (recommended for production)
  // const serviceAccount = require("../serviceAccountKey.json");
  // firebaseAdmin = admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  // });

  // Option 2: Using environment variable (for deployment)
  // Make sure GOOGLE_APPLICATION_CREDENTIALS points to your service account key file
  if (!admin.apps.length) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    firebaseAdmin = admin.app();
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
  console.log("Note: Please set up Firebase Admin credentials:");
  console.log("1. Download service account key from Firebase Console");
  console.log("2. Place it in server directory as 'serviceAccountKey.json'");
  console.log("3. Or set GOOGLE_APPLICATION_CREDENTIALS environment variable");
}

export default firebaseAdmin;
