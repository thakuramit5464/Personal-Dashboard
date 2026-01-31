"use client";

import { useAuth } from "@/components/AuthProvider";
import { ProfileCard } from "@/components/ProfileCard";
import { ProgressSummary } from "@/components/ProgressSummary";
import { DashboardShortcuts } from "@/components/DashboardShortcuts";

export default function DashboardPage() {
    const { user } = useAuth();
    
    // We can also add a nice greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getGreeting()}, {user?.displayName?.split(" ")[0] || "User"}!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Here's what's happening today.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DashboardShortcuts />
                    <ProgressSummary />
                    
                    {/* Placeholder for recent activity or simplified lists could go here */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                            No recent activity to display.
                        </p>
                    </div>
                </div>

                {/* Right Column: Profile & Secondary Info */}
                <div className="space-y-6">
                    <ProfileCard />
                </div>
            </div>
        </div>
    );
}
