"use client";

import { ProfileImageUploader } from "@/components/ProfileImageUploader";
import { useAuth } from "@/components/AuthProvider";

export default function SettingsPage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Settings
      </h1>
      
      <div className="rounded-lg border bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Profile Settings</h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-8">
            <ProfileImageUploader />
            
            <div className="space-y-1 text-center sm:text-left">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-2">
                    Managed by Firebase Auth
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
