import { TaskList } from '../components/TaskList';
import { sampleTasks } from '../data/sampleTasks';

export function TaskListPage(): JSX.Element {
  return (
    <main className="flex-1 pt-16 md:ml-60 lg:ml-60">
      <div className="p-3 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">All Tasks</h1>
        <TaskList tasks={sampleTasks} columns={1} />
      </div>
    </main>
  );
}
