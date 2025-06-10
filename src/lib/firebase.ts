
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.projectId ||
    !firebaseConfig.storageBucket
  ) {
    console.warn(
      "Firebase config is missing. Saving and Loading projects will not work. Please set up your .env file."
    );
    // You could throw an error here or provide a dummy app if preferred
    // For now, we'll let it proceed, and operations will likely fail gracefully or with Firebase errors.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const storage = getStorage(app);

export { app, storage };
