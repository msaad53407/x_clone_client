import { Link, useLocation } from 'react-router';
import { Home, Search, Bookmark, User } from 'lucide-react';

export function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 flex justify-around items-center h-[53px] md:hidden">
      {navItems.map(item => (
        <Link key={item.path} to={item.path} className="flex items-center justify-center w-full h-full">
          <item.icon
            className={`w-6 h-6 ${
              location.pathname === item.path ? 'text-black dark:text-white fill-current' : 'text-neutral-500'
            }`}
          />
        </Link>
      ))}
    </div>
  );
}
