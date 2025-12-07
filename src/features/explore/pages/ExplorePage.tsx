import { useState, useEffect } from 'react';
import { ArrowLeft, Search, MoreHorizontal } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserResultCard } from '../components/UserResultCard';
import { PostCard } from '@/features/home/components/PostCard';
import { searchService } from '../services/search.service';
import type { UserPublic, Tweet } from '@/types/api.types';

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'people' | 'posts'>('people');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (searchQuery) {
        setSearchParams({ q: searchQuery });
      } else {
        setSearchParams({});
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, setSearchParams]);

  // Search users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['searchUsers', debouncedQuery],
    queryFn: () => searchService.searchUsers({ q: debouncedQuery }),
    enabled: !!debouncedQuery && activeTab === 'people'
  });

  // Search tweets
  const { data: tweetsData, isLoading: tweetsLoading } = useQuery({
    queryKey: ['searchTweets', debouncedQuery],
    queryFn: () => searchService.searchTweets({ q: debouncedQuery }),
    enabled: !!debouncedQuery && activeTab === 'posts'
  });

  const users = usersData?.data || [];
  const tweets = tweetsData?.data || [];
  const isLoading = activeTab === 'people' ? usersLoading : tweetsLoading;

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
        <div className="flex w-full">
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
        {!debouncedQuery ? (
          <div className="p-8 text-center text-neutral-500">
            <p className="text-lg font-medium">Search X</p>
            <p className="text-sm">Enter a search term to find people or posts</p>
          </div>
        ) : isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'people' ? (
          <div className="flex flex-col">
            <h2 className="px-4 py-3 font-bold text-xl">People</h2>
            {users.length > 0 ? (
              users.map((user: UserPublic) => (
                <UserResultCard
                  key={user.id}
                  name={user.display_name || user.username}
                  username={`@${user.username}`}
                  avatar={user.profile_image_url || 'https://github.com/shadcn.png'}
                  bio={user.bio || ''}
                  isVerified={user.is_verified}
                  isFollowing={user.is_following}
                />
              ))
            ) : (
              <div className="p-8 text-center text-neutral-500">No people found for "{debouncedQuery}"</div>
            )}
          </div>
        ) : (
          <div>
            {tweets.length > 0 ? (
              tweets.map((tweet: Tweet) => (
                <PostCard
                  key={tweet.id}
                  id={tweet.id}
                  avatar={tweet.author.profile_image_url || 'https://github.com/shadcn.png'}
                  name={tweet.author.display_name || tweet.author.username}
                  username={`@${tweet.author.username}`}
                  authorId={tweet.author.id}
                  time={formatTimeAgo(tweet.created_at)}
                  content={tweet.content || ''}
                  image={tweet.image_url || undefined}
                  comments={tweet.comments_count}
                  likes={tweet.likes_count}
                  isLiked={tweet.is_liked}
                  isBookmarked={tweet.is_bookmarked}
                />
              ))
            ) : (
              <div className="p-8 text-center text-neutral-500">No posts found for "{debouncedQuery}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
