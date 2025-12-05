import { ArrowLeft, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostCard } from '@/features/home/components/PostCard';

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold text-lg leading-5">Alexandra Prado</span>
            <BadgeCheck className="w-4 h-4 fill-blue-500 text-white" />
          </div>
          <span className="text-xs text-neutral-500">781 posts</span>
        </div>
      </div>

      <ProfileHeader />

      {/* Feed */}
      <div>
        <PostCard
          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
          name="Alexandra Prado"
          username="@Alexandra_chess"
          time="6h"
          content="Just play topless"
          image="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop"
          comments={55}
          reposts={70}
          likes={100}
        />
        <PostCard
          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
          name="Alexandra Prado"
          username="@Alexandra_chess"
          time="12h"
          content="Chess is life! ♟️"
          comments={12}
          reposts={5}
          likes={89}
        />
        <PostCard
          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
          name="Alexandra Prado"
          username="@Alexandra_chess"
          time="1d"
          content="New video is up on my channel! Check it out."
          comments={34}
          reposts={12}
          likes={256}
        />
      </div>
    </div>
  );
}
