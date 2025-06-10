
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getStorage, type Storage } from "firebase/storage";

const firebaseConfigValues: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log the configuration being used for easier debugging
// We show "SET" or "NOT SET" for apiKey to avoid logging the actual key, though it's public.
console.log("Firebase Init: Attempting to initialize with config:", {
    apiKey: firebaseConfigValues.apiKey ? "SET" : "NOT SET (NEXT_PUBLIC_FIREBASE_API_KEY)",
    authDomain: firebaseConfigValues.authDomain || "NOT SET (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)",
    projectId: firebaseConfigValues.projectId || "NOT SET (NEXT_PUBLIC_FIREBASE_PROJECT_ID)",
    storageBucket: firebaseConfigValues.storageBucket || "NOT SET (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)",
    messagingSenderId: firebaseConfigValues.messagingSenderId || "NOT SET (NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)",
    appId: firebaseConfigValues.appId || "NOT SET (NEXT_PUBLIC_FIREBASE_APP_ID)",
});

let app;
let storageInstance: Storage | null = null;

if (!getApps().length) {
  const essentialConfigMissing =
    !firebaseConfigValues.apiKey ||
    !firebaseConfigValues.projectId ||
    !firebaseConfigValues.storageBucket;

  if (essentialConfigMissing) {
    console.error(
      "Firebase Init CRITICAL: Essential Firebase config values are missing in your .env file. Saving and Loading projects WILL NOT WORK."
    );
    if (!firebaseConfigValues.apiKey) console.error(" - NEXT_PUBLIC_FIREBASE_API_KEY is missing or empty.");
    if (!firebaseConfigValues.projectId) console.error(" - NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing or empty.");
    if (!firebaseConfigValues.storageBucket) console.error(" - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is missing or empty.");
    console.error("Please ensure these are correctly set in your .env file and restart your development server.");
  } else {
    try {
      app = initializeApp(firebaseConfigValues);
      storageInstance = getStorage(app);
      console.log("Firebase Init: Firebase initialized successfully and Storage instance created.");
    } catch (e) {
      console.error("Firebase Init ERROR: Error initializing Firebase app. See details below.", e);
    }
  }
} else {
  app = getApp();
  try {
    storageInstance = getStorage(app);
    console.log("Firebase Init: Firebase app already initialized. Storage instance created/retrieved.");
  } catch (e) {
      console.error("Firebase Init ERROR: Error getting Storage instance from existing Firebase app. See details below.", e);
  }
}

// Export a function to get storage, or null if not initialized
// This allows components to check if storage is available
export const getFirebaseStorage = (): Storage | null => storageInstance;

// For backward compatibility with existing code that imports `storage` directly.
// This might be null if initialization failed.
export { app, storageInstance as storage };

