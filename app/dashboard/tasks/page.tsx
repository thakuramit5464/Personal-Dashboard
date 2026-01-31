import { TaskManager } from "@/components/TaskManager";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Tasks
        </h1>
      </div>
      <TaskManager />
    </div>
  );
}
