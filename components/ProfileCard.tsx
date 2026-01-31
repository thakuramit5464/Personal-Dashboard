"use client";

import { useAuth } from "@/components/AuthProvider";
import { ProfileImageUploader } from "./ProfileImageUploader";

export function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center text-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Profile</h2>
      
      <ProfileImageUploader />
      
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {user?.displayName || "User"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user?.email}
        </p>
      </div>

      <div className="mt-6 w-full pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400">
          User ID: <span className="font-mono">{user?.uid.slice(0, 8)}...</span>
        </p>
      </div>
    </div>
  );
}
