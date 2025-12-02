import { Outlet } from 'react-router';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <MobileHeader />
      <div className="container max-w-[1265px] mx-auto flex min-h-screen pb-[53px] md:pb-0">
        <LeftSidebar />
        <main className="flex-1 border-x border-neutral-200 dark:border-neutral-800 min-h-screen">
          <Outlet />
        </main>
        <RightSidebar />
      </div>
      <MobileBottomNav />
    </div>
  );
}
