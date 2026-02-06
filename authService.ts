
import { auth } from './firebaseConfig';

export const ADMIN_EMAIL = 'dadasersin@gmail.com';

export const loginWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not initialized");

    // Admin Check Removed - Public Login Allowed
    return await auth.signInWithEmailAndPassword(email, password);
};

export const logout = async () => {
    if (auth) await auth.signOut();
};

export const onAuthStateChanged = (callback: (user: any) => void) => {
    if (auth) return auth.onAuthStateChanged(callback);
    return () => { };
};

export const getCurrentUser = () => {
    return auth ? auth.currentUser : null;
};

export const isAuthInitialized = () => {
    return !!auth;
};
