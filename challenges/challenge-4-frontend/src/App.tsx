import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import { SelectionProvider } from './context/SelectionContext';
import { ToastProvider } from './context/ToastContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { KanbanPage } from './pages/KanbanPage';
import { TaskListPage } from './pages/TaskListPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { sampleTasks } from './data/sampleTasks';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <Router>
        <TaskProvider initialTasks={sampleTasks}>
          <ToastProvider>
            <SelectionProvider>
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
                <Sidebar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/kanban" element={<KanbanPage />} />
                  <Route path="/tasks" element={<TaskListPage />} />
                  <Route path="/tasks/:id" element={<TaskDetailPage />} />
                </Routes>
              </div>
            </SelectionProvider>
          </ToastProvider>
        </TaskProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
