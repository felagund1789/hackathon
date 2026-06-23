import { Link } from 'react-router-dom';

export function Header(): JSX.Element {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
          <h1 className="text-xl font-bold text-gray-900">TaskHub</h1>
        </Link>
        <nav aria-label="Main navigation" className="text-sm text-gray-600">
          <span>Dashboard</span>
        </nav>
      </div>
    </header>
  );
}
