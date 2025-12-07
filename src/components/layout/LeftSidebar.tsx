import { Link, useLocation, useNavigate } from 'react-router';
import { Home, Search, User, MoreHorizontal, LogOut, Moon, Sun, Laptop, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '../theme/theme-provider';
import { useAuth } from '@/hooks/use-auth';

export function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-col h-dvh p-4 w-[275px] hidden md:flex sticky top-0">
      <div className="mb-4 px-4">
        <Link
          to="/home"
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 text-black dark:text-white fill-current">
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 text-xl rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ${
              location.pathname === item.path ? 'font-bold' : 'font-normal'
            }`}
          >
            <item.icon className="w-7 h-7" />
            <span>{item.label}</span>
          </Link>
        ))}

        <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold text-lg h-12">
          Post
        </Button>
      </nav>

      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 h-auto"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.profile_image_url || undefined} className="object-cover" />
                  <AvatarFallback>{user?.display_name?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="font-bold text-sm">{user?.display_name || user?.username || 'User'}</p>
                  <p className="text-neutral-500 text-sm">@{user?.username || 'user'}</p>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5 hidden lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end" side="top">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
