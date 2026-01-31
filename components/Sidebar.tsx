"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  BarChart,
  Settings,
  LogOut,
} from "lucide-react";
import { SidebarUser } from "./SidebarUser";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Todos", href: "/dashboard/todos", icon: CheckSquare },
  { name: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
  { name: "Progress", href: "/dashboard/progress", icon: BarChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];



import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
const COLLAPSED_WIDTH = 80;

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default 16rem
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize state from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    const savedWidth = localStorage.getItem("sidebarWidth");
    
    if (savedState) {
      setIsCollapsed(savedState === "true");
    }
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth, 10));
    }

    // Check for mobile screen size
    const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile) {
            setIsCollapsed(true); // Auto collapse on mobile
        }
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
      setIsResizing(false);
      localStorage.setItem("sidebarWidth", String(sidebarRef.current?.getBoundingClientRect().width || sidebarWidth));
  }, [sidebarWidth]);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
          const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
          if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
              setSidebarWidth(newWidth);
          }
      }
  }, [isResizing]);

  useEffect(() => {
      if (isResizing) {
          window.addEventListener("mousemove", resize);
          window.addEventListener("mouseup", stopResizing);
      } else {
          window.removeEventListener("mousemove", resize);
          window.removeEventListener("mouseup", stopResizing);
      }
      
      return () => {
          window.removeEventListener("mousemove", resize);
          window.removeEventListener("mouseup", stopResizing);
      };
  }, [isResizing, resize, stopResizing]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (!isMobile) {
        localStorage.setItem("sidebarCollapsed", String(newState));
    }
  };

  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : sidebarWidth;

  return (
    <div 
        ref={sidebarRef}
        className="relative flex h-screen flex-col border-r bg-white dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ease-in-out group"
        style={{ width: isMobile ? (isCollapsed ? COLLAPSED_WIDTH : '100%') : currentWidth }}
    >
      <div className={`flex h-16 items-center px-4 border-b dark:border-gray-800 shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link href="/dashboard" className="text-lg font-bold truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Personal Dashboard
          </Link>
        )}
        <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      <SidebarUser isCollapsed={isCollapsed} />

      {/* Resize Handle */}
      {!isCollapsed && !isMobile && (
          <div
              className={`absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-indigo-500 transition-colors ${isResizing ? 'bg-indigo-500' : 'bg-transparent'}`}
              onMouseDown={startResizing}
          />
      )}
    </div>
  );
}
