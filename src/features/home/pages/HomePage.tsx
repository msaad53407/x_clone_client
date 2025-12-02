import { CreatePost } from '../components/CreatePost';
import { Feed } from '../components/Feed';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex h-[53px]">
          <div className="flex-1 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors relative">
            <span className="font-bold">For you</span>
            <div className="absolute bottom-0 w-14 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <div className="flex-1 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors text-neutral-500">
            <span>Following</span>
          </div>
        </div>
      </div>
      <CreatePost />
      <Feed />
    </div>
  );
}
