import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate configuration
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing Firebase environment variables: ${missingVars.join(', ')}`);
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Note: Emulator connection removed for simplicity
// If you need emulators, connect them manually:
// connectAuthEmulator(auth, 'http://localhost:9099');
// connectFirestoreEmulator(db, 'localhost', 8080);

// User email mapping for authentication
export const userEmailMapping: Record<string, string> = {
  admin: 'admin@datalukas.com',
  andrade: 'andrade@datalukas.com', 
  leo: 'leo@datalukas.com',
  rallyson: 'rallyson@datalukas.com',
  william: 'william@datalukas.com',
  helder: 'helder@datalukas.com',
};

// Reverse mapping for getting username from email
export const emailToUsername = Object.fromEntries(
  Object.entries(userEmailMapping).map(([username, email]) => [email, username])
);

// Helper function to get email from username
export function getUserEmail(username: string): string {
  const email = userEmailMapping[username.toLowerCase()];
  if (!email) {
    throw new Error(`No email mapping found for username: ${username}`);
  }
  return email;
}

// Helper function to get username from email
export function getUsernameFromEmail(email: string): string {
  const username = emailToUsername[email];
  if (!username) {
    throw new Error(`No username mapping found for email: ${email}`);
  }
  return username;
}
