"use client";

import { useAuth } from "@/components/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Welcome back!
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                    <p>
                        You are logged in as <strong>{user?.email}</strong>.
                    </p>
                    <p className="mt-2">
                        This is your protected dashboard. Only authenticated users can see this.
                    </p>
                </div>
                <div className="mt-5">
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}
