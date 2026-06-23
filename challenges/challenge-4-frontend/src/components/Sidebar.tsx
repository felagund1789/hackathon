import { NavLink } from 'react-router-dom';

export function Sidebar(): JSX.Element {
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Task List', path: '/tasks' },
    { label: 'Task Detail', path: '/tasks/1' },
  ];

  return (
    <aside className="hidden md:block md:w-52 lg:w-60 bg-gray-50 border-r border-gray-200 pt-16 md:fixed md:left-0 md:top-0 md:h-screen md:overflow-y-auto">
      <nav aria-label="Sidebar navigation" className="p-4 md:p-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
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
