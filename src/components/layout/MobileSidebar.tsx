import { Link } from 'react-router';
import { User, Bookmark, List, Zap, Settings, HelpCircle, LogOut, Moon, Sun, Laptop } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '../theme/theme-provider';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function MobileSidebar() {
  const { setTheme } = useTheme();

  const menuItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Zap, label: 'Premium', path: '/premium' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: List, label: 'Lists', path: '/lists' },
    { icon: User, label: 'Communities', path: '/communities' } // Reusing User icon for now
  ];

  return (
    <SheetContent
      side="left"
      className="w-[300px] p-0 bg-white dark:bg-black text-black dark:text-white border-r border-neutral-200 dark:border-neutral-800"
    >
      <SheetHeader className="p-4 text-left">
        <SheetTitle className="sr-only">User Menu</SheetTitle>
        <div className="flex flex-col gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg">Muhammad Saad 👨🏻‍💻</p>
            <p className="text-neutral-500">@msaad_dev</p>
          </div>
          <div className="flex gap-4 mt-2 text-sm">
            <p>
              <span className="font-bold">4</span> <span className="text-neutral-500">Following</span>
            </p>
            <p>
              <span className="font-bold">0</span> <span className="text-neutral-500">Followers</span>
            </p>
          </div>
        </div>
      </SheetHeader>

      <Separator className="bg-neutral-200 dark:bg-neutral-800" />

      <div className="flex flex-col py-2">
        {menuItems.map(item => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-4 px-4 py-3 text-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <item.icon className="w-6 h-6" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <Separator className="bg-neutral-200 dark:bg-neutral-800" />

      <div className="flex flex-col py-2">
        <div className="px-4 py-3 text-sm font-bold flex items-center gap-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings and privacy</span>
        </div>
        <div className="px-4 py-3 text-sm font-bold flex items-center gap-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span>Help Center</span>
        </div>
        <div className="px-4 py-3 text-sm font-bold flex items-center gap-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-red-500">
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </div>
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
