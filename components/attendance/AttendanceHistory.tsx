"use client";

import { useEffect, useState } from "react";
import { getAttendanceHistory, AttendanceRecord } from "@/lib/attendance";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export function AttendanceHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    try {
      const records = await getAttendanceHistory(user.uid);
      setHistory(records);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-gray-400"/></div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Date & Time</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Action</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Proof</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.length === 0 ? (
                <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No attendance records found.</td>
                </tr>
            ) : (
                history.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {record.timestamp ? format(record.timestamp.toDate(), "PPP p") : "Pending..."}
                    </td>
                    <td className="px-6 py-4">
                    <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${record.type === "clock_in" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}`}
                    >
                        {record.type === "clock_in" ? "Clock In" : "Clock Out"}
                    </span>
                    </td>
                    <td className="px-6 py-4">
                    {record.imageUrl && (
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img 
                            src={record.imageUrl} 
                            alt="Proof" 
                            className="h-full w-full object-cover" 
                        />
                        </div>
                    )}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
