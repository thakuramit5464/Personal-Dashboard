"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { CameraCapture } from "./CameraCapture";
import { uploadImage } from "@/lib/cloudinary";
import { clockIn, clockOut, getLatestAttendance, AttendanceRecord } from "@/lib/attendance";
import { Loader2, LogIn, LogOut, CheckCircle } from "lucide-react";

export function AttendanceActions() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "clocked_in" | "clocked_out">("loading");
  const [showCamera, setShowCamera] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lastRecord, setLastRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    if (user) {
      loadStatus();
    }
  }, [user]);

  const loadStatus = async () => {
    if (!user) return;
    try {
      const record = await getLatestAttendance(user.uid);
      setLastRecord(record);
      if (record && record.type === "clock_in") {
        setStatus("clocked_in");
      } else {
        setStatus("clocked_out");
      }
    } catch (error) {
      console.error("Error loading attendance status:", error);
    }
  };

  const handleCapture = async (file: File) => {
    if (!user) return;
    setProcessing(true);
    try {
      const imageUrl = await uploadImage(file);
      
      if (status === "clocked_out") {
        await clockIn(user.uid, imageUrl);
      } else {
        await clockOut(user.uid, imageUrl);
      }
      
      await loadStatus(); // Refresh status
      setShowCamera(false);
    } catch (error) {
      console.error("Error processing attendance:", error);
      alert("Failed to process attendance. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (status === "loading") {
    return <div className="flex items-center gap-2 p-4 text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading status...</div>;
  }

  if (showCamera) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {status === "clocked_out" ? "Clock In Verification" : "Clock Out Verification"}
        </h3>
        {processing ? (
             <div className="flex flex-col items-center justify-center p-12 space-y-4 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">Uploading and syncing...</p>
             </div>
        ) : (
            <CameraCapture 
                onCapture={handleCapture}
                onCancel={() => setShowCamera(false)}
            />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendance</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Current Status: 
            <span className={`ml-2 font-semibold ${status === "clocked_in" ? "text-green-600" : "text-gray-600"}`}>
              {status === "clocked_in" ? "Clocked In" : "Clocked Out"}
            </span>
          </p>
          {lastRecord && (
             <p className="text-xs text-gray-400 mt-2">
                 Last activity: {lastRecord.type === "clock_in" ? "Clocked In" : "Clocked Out"} at {lastRecord.timestamp?.toDate().toLocaleString()}
             </p>
          )}
        </div>

        <button
          onClick={() => setShowCamera(true)}
          disabled={processing}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-colors
            ${status === "clocked_out" 
                ? "bg-indigo-600 hover:bg-indigo-700" 
                : "bg-red-500 hover:bg-red-600"}
          `}
        >
          {status === "clocked_out" ? (
            <>
              <LogIn className="h-5 w-5" /> Clock In
            </>
          ) : (
            <>
              <LogOut className="h-5 w-5" /> Clock Out
            </>
          )}
        </button>
      </div>
    </div>
  );
}
