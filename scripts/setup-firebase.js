#!/usr/bin/env node

/**
 * Firebase Configuration Helper
 * Run this script to set up your Firebase environment variables
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🔥 Firebase Configuration Setup for Otaku_World\n");
console.log(
  "This script will help you configure your Firebase environment variables.\n"
);
console.log(
  "You can find these values in your Firebase Console → Project Settings → General → Your apps\n"
);

const questions = [
  {
    key: "VITE_FIREBASE_API_KEY",
    prompt: "Enter your Firebase API Key: ",
    placeholder: "AIzaSyB...",
  },
  {
    key: "VITE_FIREBASE_AUTH_DOMAIN",
    prompt: "Enter your Firebase Auth Domain: ",
    placeholder: "otaku-world-xxxxx.firebaseapp.com",
  },
  {
    key: "VITE_FIREBASE_PROJECT_ID",
    prompt: "Enter your Firebase Project ID: ",
    placeholder: "otaku-world-xxxxx",
  },
  {
    key: "VITE_FIREBASE_STORAGE_BUCKET",
    prompt: "Enter your Firebase Storage Bucket: ",
    placeholder: "otaku-world-xxxxx.appspot.com",
  },
  {
    key: "VITE_FIREBASE_MESSAGING_SENDER_ID",
    prompt: "Enter your Firebase Messaging Sender ID: ",
    placeholder: "123456789",
  },
  {
    key: "VITE_FIREBASE_APP_ID",
    prompt: "Enter your Firebase App ID: ",
    placeholder: "1:123456789:web:abcdef123456",
  },
];

const config = {};

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(`${question.prompt}(${question.placeholder}): `, (answer) => {
      config[question.key] = answer.trim() || question.placeholder;
      resolve();
    });
  });
}

async function main() {
  try {
    // Ask all questions
    for (const question of questions) {
      await askQuestion(question);
    }

    // Generate .env content with actual Otaku_World config
    const envContent = `# Client Environment Variables (Vite prefix required)

# Firebase Configuration (✅ CONFIGURED for otakuworld-c8f17)
VITE_FIREBASE_API_KEY=AIzaSyCe6B_ygxxi46FQARUUsu_pXMWjFN1mwTQ
VITE_FIREBASE_AUTH_DOMAIN=otakuworld-c8f17.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=otakuworld-c8f17
VITE_FIREBASE_STORAGE_BUCKET=otakuworld-c8f17.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=327932734265
VITE_FIREBASE_APP_ID=1:327932734265:web:a2ed657b4de6faf98cd6e8

# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_JIKAN_API_BASE_URL=https://api.jikan.moe/v4

# App Configuration
VITE_APP_NAME=Otaku_World
VITE_APP_VERSION=1.0.0
`;

    // Write to client/.env
    const clientEnvPath = path.join(__dirname, "client", ".env");
    fs.writeFileSync(clientEnvPath, envContent);

    console.log("\n✅ Firebase configuration saved to client/.env");
    console.log("\nNext steps:");
    console.log("1. Download your Firebase service account key");
    console.log("2. Save it as server/serviceAccountKey.json");
    console.log("3. Start your development servers: npm run dev");
    console.log(
      "\nFor detailed setup instructions, see docs/FIREBASE_SETUP.md"
    );
  } catch (error) {
    console.error("❌ Error setting up configuration:", error);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
