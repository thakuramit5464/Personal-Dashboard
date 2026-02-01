"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AppUser, UserRole } from "@/lib/roles";

interface AuthContextType {
    user: User | null;
    appUser: AppUser | null;
    role: UserRole | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    appUser: null,
    role: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, "users", firebaseUser.uid);
                    const userSnapshot = await getDoc(userDocRef);

                    if (userSnapshot.exists()) {
                        setAppUser(userSnapshot.data() as AppUser);
                    } else {
                        // Create their profile if it doesn't exist
                        const newUser: AppUser = {
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName,
                            email: firebaseUser.email,
                            photoURL: firebaseUser.photoURL,
                            role: "employee", // Default role
                            createdAt: serverTimestamp(),
                        };
                        await setDoc(userDocRef, newUser);
                        setAppUser(newUser); // Optimistic update
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setAppUser(null);
            }
            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const role = appUser?.role || null;

    return (
        <AuthContext.Provider value={{ user, appUser, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
