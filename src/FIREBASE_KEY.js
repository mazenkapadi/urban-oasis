const FIREBASE_KEY = {
    apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default FIREBASE_KEY;