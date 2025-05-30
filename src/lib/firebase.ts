import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FirebaseConfig } from '@/types';

// Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Connect to emulators in development (disabled to remove emulator banner)
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
//   try {
//     // Only connect to emulators if not already connected
//     const authConfig = auth.config as any;
//     if (!authConfig.emulator) {
//       connectAuthEmulator(auth, 'http://localhost:9099');
//     }

//     // Check if Firestore emulator is not already connected
//     const dbConfig = (db as any)._delegate?._databaseId?.projectId;
//     if (dbConfig && !dbConfig.includes('demo-')) {
//       connectFirestoreEmulator(db, 'localhost', 8080);
//     }
//   } catch (error) {
//     console.log('Emulators already connected or not available');
//   }
// }

export default app;
