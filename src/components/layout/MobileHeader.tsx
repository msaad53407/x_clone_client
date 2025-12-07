import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { MobileSidebar } from './MobileSidebar';
import { useAuth } from '@/hooks/use-auth';

export function MobileHeader() {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 md:hidden">
      <Sheet>
        <SheetTrigger>
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage src={user?.profile_image_url || undefined} className="object-cover" />
            <AvatarFallback>{user?.display_name?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <MobileSidebar />
      </Sheet>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 text-black dark:text-white fill-current">
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </div>
      <div className="w-8"></div> {/* Spacer for centering */}
    </div>
  );
}
