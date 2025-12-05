import { useState } from 'react';
import { ArrowLeft, Search, MoreHorizontal } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserResultCard } from '../components/UserResultCard';
import { PostCard } from '@/features/home/components/PostCard';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'people' | 'posts'>('people');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || 'ali'); // Default query based on screenshot or URL param

  // Mock Data for People
  const allUsers = [
    {
      id: '1',
      name: 'SheR•ALi',
      username: '@Sher__Ali',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=800&auto=format&fit=crop',
      bio: 'Pro Cricket Fan 🏏 || Cricket Critic ✍️ || Karachi Kings |• Love memes & Lough •| Fan Account of Mitchell Starc / Ben Stokes / Only Babar Azam Lover 👸',
      isVerified: true,
      isFollowing: false
    },
    {
      id: '2',
      name: 'Ali',
      username: '@ali_charts',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&auto=format&fit=crop',
      bio: 'Building millionaires, one trade at a time | Join me on Discord: whop.com/alicharts/',
      isVerified: true,
      isFollowing: false
    },
    {
      id: '3',
      name: 'ali',
      username: '@endingwithali',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop',
      bio: 'software engineer - content creator @ links.ali.dev - threatwire host @hak5 - nyc - MIT - jewish',
      isVerified: true,
      isFollowing: false
    }
  ];

  // Mock Data for Posts
  const allPosts = [
    {
      id: 'p1',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=800&auto=format&fit=crop',
      name: 'SheR•ALi',
      username: '@Sher__Ali',
      time: '2h',
      content: 'Babar Azam is truly a legend. #Cricket #BabarAzam',
      comments: 12,
      reposts: 5,
      likes: 120,
      views: '15k'
    },
    {
      id: 'p2',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop',
      name: 'Halal Nation',
      username: '@HalalNation_',
      time: 'Dec 2',
      content: 'The Last Picture Of Muhammad Ali Before He Returned To Allah 🖤',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop', // Placeholder for Ali image
      comments: 24,
      reposts: 100,
      likes: 1500,
      views: '120k',
      isVerified: true
    }
  ];

  // Filter Logic (Simple includes check)
  const filteredUsers = allUsers.filter(
    u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = allPosts.filter(
    p =>
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-2 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-4 h-4" />
          </div>
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-10 rounded-full bg-neutral-100 dark:bg-neutral-900 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
          />
        </div>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="sticky top-[53px] z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex">
        {/* Tab 1: People */}
        {/* Note: In x.com, it seems tabs scroll horizontally if many. Here we have 2 fixed. */}
        {/* Actually, user said "tabs", usually fixed width or equal distribution. */}
        <div className="flex w-full">
          {/* Top / Latest / People / Media / Lists ... usually in search results.
                User specifically asked for "2 tabs: People, Posts". 
                "Top" usually default but user said "People" default. 
                Let's emulate the screenshot's tab bar style. 
            */}

          {/* We will just do the tabs requested */}
          <button
            onClick={() => setActiveTab('people')}
            className="flex-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors py-3 md:py-4 px-4 text-center text-sm font-bold relative"
          >
            <span className={activeTab === 'people' ? 'text-black dark:text-white' : 'text-neutral-500'}>People</span>
            {activeTab === 'people' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className="flex-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors py-3 md:py-4 px-4 text-center text-sm font-bold relative"
          >
            <span className={activeTab === 'posts' ? 'text-black dark:text-white' : 'text-neutral-500'}>Posts</span>
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'people' && (
          <div className="flex flex-col">
            <h2 className="px-4 py-3 font-bold text-xl">People</h2>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => <UserResultCard key={user.id} {...user} />)
            ) : (
              <div className="p-8 text-center text-neutral-500">No people found</div>
            )}
            <div className="p-4 text-blue-500 text-sm cursor-pointer hover:underline">View all</div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => <PostCard key={post.id} {...post} />)
            ) : (
              <div className="p-8 text-center text-neutral-500">No posts found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
