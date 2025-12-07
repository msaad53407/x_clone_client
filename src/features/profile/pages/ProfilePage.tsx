import { ArrowLeft, BadgeCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostCard } from '@/features/home/components/PostCard';
import { userService } from '../services/user.service';
import { useAuth } from '@/hooks/use-auth';
import type { Tweet } from '@/types/api.types';

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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams<{ username?: string }>();
  const { user: currentUser } = useAuth();

  // If no username param, show current user's profile
  const profileUsername = username || currentUser?.username;
  const isOwnProfile = !username || username === currentUser?.username;

  // Fetch user profile
  const {
    data: profileUser,
    isLoading: profileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['user', profileUsername],
    queryFn: () => userService.getByUsername(profileUsername!),
    enabled: !!profileUsername
  });

  // Fetch user's tweets
  const {
    data: tweetsData,
    isLoading: tweetsLoading,
    refetch: refetchTweets
  } = useQuery({
    queryKey: ['userTweets', profileUsername],
    queryFn: () => userService.getUserTweets(profileUsername!),
    enabled: !!profileUsername
  });

  if (profileLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="p-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (profileError || !profileUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-bold text-lg">Profile</span>
        </div>
        <div className="p-8 text-center text-neutral-500">
          <p className="text-lg font-medium">User not found</p>
          <p className="text-sm">This account doesn't exist</p>
        </div>
      </div>
    );
  }

  const tweets = tweetsData?.data || [];

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
            <span className="font-bold text-lg leading-5">{profileUser.display_name || profileUser.username}</span>
            {profileUser.is_verified && <BadgeCheck className="w-4 h-4 fill-blue-500 text-white" />}
          </div>
          <span className="text-xs text-neutral-500">{tweetsData?.pagination?.total_count || 0} posts</span>
        </div>
      </div>

      <ProfileHeader user={profileUser} isOwnProfile={isOwnProfile} />

      {/* User's Tweets */}
      <div>
        {tweetsLoading ? (
          <div className="p-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tweets.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <p className="text-lg font-medium">No posts yet</p>
            {isOwnProfile && <p className="text-sm">When you post, they'll show up here.</p>}
          </div>
        ) : (
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
              quotedPost={
                tweet.quoted_tweet
                  ? {
                      avatar: tweet.quoted_tweet.author.profile_image_url || 'https://github.com/shadcn.png',
                      name: tweet.quoted_tweet.author.display_name || tweet.quoted_tweet.author.username,
                      username: `@${tweet.quoted_tweet.author.username}`,
                      time: formatTimeAgo(tweet.quoted_tweet.created_at),
                      content: tweet.quoted_tweet.content || '',
                      image: tweet.quoted_tweet.image_url || undefined
                    }
                  : undefined
              }
              onRefresh={() => refetchTweets()}
            />
          ))
        )}
      </div>
    </div>
  );
}
