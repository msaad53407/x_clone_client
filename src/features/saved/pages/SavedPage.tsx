import { PostCard } from '@/features/home/components/PostCard';

export default function SavedPage() {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex h-[53px] items-center px-4">
          <h1 className="font-bold text-xl">Saved</h1>
        </div>
      </div>
      <div>
        <PostCard
          avatar="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780&auto=format&fit=crop"
          name="Elon Musk"
          username="@elonmusk"
          time="55m"
          content="An immediate increase in the birth rate is needed"
          comments={3100}
          reposts={1200}
          likes={8000}
          quotedPost={{
            avatar: 'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg',
            name: 'Tesla Owners Silicon Valley',
            username: '@teslaownersSV',
            time: '1h',
            content:
              'Birth rates are plummeting in a lot of countries. Population collapse is the greatest threat to civilization.\n\nChange needs to happen to save humanity.',
            image: 'https://pbs.twimg.com/media/F4s_2qMXwAAyvK8?format=jpg&name=large'
          }}
        />
        <PostCard
          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
          name="Alexandra Prado"
          username="@Alexandra_chess"
          time="12h"
          content="This is a saved tweet without a quote."
          comments={12}
          reposts={5}
          likes={89}
          isOwner={true}
        />
        <PostCard
          avatar="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop"
          name="John Doe"
          username="@johndoe"
          time="2h"
          content="Just learned about the new features in React 19. Can't wait to try them out! #reactjs #webdev"
          image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"
          comments={15}
          reposts={8}
          likes={42}
        />
      </div>
    </div>
  );
}
