
// Firebase Config - CDN Usage
// NOTE: Since we are using CDN scripts in index.html, 'firebase' is available on window object.

declare global {
    interface Window {
        firebase: any;
    }
}

// BU KISMI KENDİ FIREBASE PROJE AYARLARINIZLA DEĞİŞTİRİN
// (Firebase Console -> Project Settings -> General -> Your Apps -> Config)
const firebaseConfig = {
    apiKey: "AIzaSyD-PLACEHOLDER-KEY",
    authDomain: "yapay-zeka-merkezi.firebaseapp.com",
    projectId: "yapay-zeka-merkezi",
    storageBucket: "yapay-zeka-merkezi.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

let app: any;
let auth: any;
let db: any;

try {
    if (window.firebase) {
        app = window.firebase.initializeApp(firebaseConfig);
        auth = window.firebase.auth();
        db = window.firebase.firestore();
        console.log("Firebase initialized via CDN");
    } else {
        console.warn("Firebase SDK not found! Check index.html");
    }
} catch (e) {
    console.error("Firebase init error:", e);
}

export { auth, db };
