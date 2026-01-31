"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  BarChart,
  Settings,
} from "lucide-react";

const shortcuts = [
  { name: "Todos", href: "/dashboard/todos", icon: CheckSquare, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { name: "Tasks", href: "/dashboard/tasks", icon: ListTodo, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { name: "Progress", href: "/dashboard/progress", icon: BarChart, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-900/20" },
];

export function DashboardShortcuts() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {shortcuts.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm transition-all group"
          >
            <div className={`p-3 rounded-full mb-3 ${item.bg} group-hover:scale-110 transition-transform`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
