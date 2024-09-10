// const FIREBASE_KEY = {
//     apiKey: "AIzaSyDRzhni48e2z_e532sRTLiOaPqleyPvMsw",
//     authDomain: "urban-oasis490.firebaseapp.com",
//     projectId: "urban-oasis490",
//     storageBucket: "urban-oasis490.appspot.com",
//     messagingSenderId: "343916251191",
//     appId: "1:343916251191:web:c10810c0605a045f6c97b2",
//     measurementId: "G-ZFGPCPMK4B"
// };
//
// export default FIREBASE_KEY;

const FIREBASE_KEY = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

export default FIREBASE_KEY;