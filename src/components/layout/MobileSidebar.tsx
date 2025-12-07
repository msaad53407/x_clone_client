import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { Bookmark, Laptop, LogOut, Moon, Sun, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useTheme } from '../theme/theme-provider';

export function MobileSidebar() {
  const { setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Bookmark, label: 'Bookmarks', path: '/saved' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SheetContent
      side="left"
      className="w-[300px] p-0 bg-white dark:bg-black text-black dark:text-white border-r border-neutral-200 dark:border-neutral-800"
    >
      <SheetHeader className="p-4 text-left">
        <SheetTitle className="sr-only">User Menu</SheetTitle>
        <div className="flex flex-col gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profile_image_url || undefined} className="object-cover" />
            <AvatarFallback>{user?.display_name?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg">{user?.display_name || user?.username || 'User'}</p>
            <p className="text-neutral-500">@{user?.username || 'user'}</p>
          </div>
        </div>
      </SheetHeader>

      <Separator className="bg-neutral-200 dark:bg-neutral-800" />

      <div className="flex flex-col py-2">
        {menuItems.map(item => (
          <SheetClose asChild key={item.label}>
            <Link
              to={item.path}
              className="flex items-center gap-4 px-4 py-3 text-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </Link>
          </SheetClose>
        ))}
      </div>

      <Separator className="bg-neutral-200 dark:bg-neutral-800" />

      <div className="flex flex-col py-2">
        <SheetClose asChild>
          <button
            onClick={handleLogout}
            className="px-4 py-3 text-sm font-bold flex items-center gap-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-red-500 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </SheetClose>
      </div>

      <Separator className="bg-neutral-200 dark:bg-neutral-800" />

      <div className="p-4 flex justify-between items-center">
        <span className="text-sm font-bold">Theme</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme('light')}>
            <Sun className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme('dark')}>
            <Moon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme('system')}>
            <Laptop className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}
