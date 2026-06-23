import { NavLink } from 'react-router-dom';

export function Sidebar(): JSX.Element {
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Kanban Board', path: '/kanban' },
    { label: 'All Tasks', path: '/tasks' },
  ];

  return (
    <aside className="hidden md:block md:w-60 lg:w-60 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-16 md:fixed md:left-0 md:top-0 md:h-screen md:overflow-y-auto transition-colors">
      <nav aria-label="Sidebar navigation" className="p-3 md:p-6">
        <ul className="space-y-0.75">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 my-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
