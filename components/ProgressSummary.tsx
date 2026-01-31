"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getCachedTodos, getCachedTasks } from "@/lib/db";
import { CheckCircle2, ListTodo, PieChart, Clock } from "lucide-react";

interface Todo {
  id: string;
  completed: boolean;
}

interface Task {
  id: string;
  status: "pending" | "in-progress" | "completed";
}

import { ProgressChart } from "./charts/ProgressChart";

// ... constants or interfaces

export function ProgressSummary() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTodos: 0,
    completedTodos: 0,
    totalTasks: 0,
    completedTasks: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      try {
        const [{ data: todos }, { data: tasks }] = await Promise.all([
          getCachedTodos(user.uid),
          getCachedTasks(user.uid)
        ]);

        const typedTodos = todos as Todo[];
        const typedTasks = tasks as Task[];

        setStats({
          totalTodos: typedTodos.length,
          completedTodos: typedTodos.filter(t => t.completed).length,
          totalTasks: typedTasks.length,
          completedTasks: typedTasks.filter(t => t.status === "completed").length,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
  }, [user]);

  if (stats.loading) {
    return <div className="p-4 animate-pulse">Loading stats...</div>;
  }

  const totalItems = stats.totalTodos + stats.totalTasks;
  const completedItems = stats.completedTodos + stats.completedTasks;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  const chartData = [
    { name: "Completed", value: completedItems, color: "#4f46e5" }, // Indigo 600
    { name: "Pending", value: totalItems - completedItems, color: "#e5e7eb" }, // Gray 200
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <PieChart className="h-5 w-5 text-indigo-500" />
        Quick Progress
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-4">
             <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Todos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.completedTodos}/{stats.totalTodos}
                </p>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <ListTodo className="h-4 w-4" /> Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.completedTasks}/{stats.totalTasks}
                </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg col-span-2">
                 <p className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Overall Completion
                  </p>
                 <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {progress}%
                 </p>
            </div>
        </div>

        <div className="flex flex-col items-center justify-center">
             <ProgressChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
