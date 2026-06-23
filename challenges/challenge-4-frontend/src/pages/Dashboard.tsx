import { TaskList } from '../components/TaskList';
import { SummaryCard } from '../components/SummaryCard';
import { sampleTasks } from '../data/sampleTasks';
import { TaskStatus } from '../types/task';

export function Dashboard(): JSX.Element {
  const recentTasks = sampleTasks.slice(0, 5);
  const todoTasks = sampleTasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = sampleTasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const blockedTasks = sampleTasks.filter((task) => task.status === TaskStatus.BLOCKED);
  const doneTasks = sampleTasks.filter((task) => task.status === TaskStatus.DONE);

  return (
    <main className="flex-1 pt-16 md:ml-60 lg:ml-60">
      <div className="p-3 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <SummaryCard count={todoTasks.length} label="Todo" color="cyan" />
          <SummaryCard count={inProgressTasks.length} label="In Progress" color="blue" />
          {blockedTasks.length > 0 && <SummaryCard count={blockedTasks.length} label="Blocked" color="magenta" />}
          <SummaryCard count={doneTasks.length} label="Done" color="green" />
        </div>

        {/* Recent Tasks */}
        <div>
          <TaskList tasks={recentTasks} title="Recent Tasks" />
        </div>
      </div>
    </main>
  );
}
