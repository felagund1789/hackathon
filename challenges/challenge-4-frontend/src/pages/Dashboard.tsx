import { TaskList } from '../components/TaskList';
import { sampleTasks } from '../data/sampleTasks';
import { TaskStatus } from '../types/task';

export function Dashboard(): JSX.Element {
  const recentTasks = sampleTasks.slice(0, 5);
  const inProgressTasks = sampleTasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);

  return (
    <main className="flex-1 pt-16 md:ml-52 lg:ml-60">
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{sampleTasks.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{inProgressTasks.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-gray-600 font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {sampleTasks.filter((task) => task.status === TaskStatus.DONE).length}
            </p>
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <TaskList tasks={recentTasks} title="Recent Tasks" />
        </div>
      </div>
    </main>
  );
}
