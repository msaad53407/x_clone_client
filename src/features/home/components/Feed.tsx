import { useQuery, useQueryClient } from '@tanstack/react-query';
import { feedService } from '../services/feed.service';
import { PostCard } from './PostCard';
import { FeedSkeleton } from '@/components/skeletons';
import { formatTimeAgo } from '@/utils/formatTime';
import type { Tweet } from '@/types/api.types';

export function Feed() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['homeFeed'],
    queryFn: () => feedService.getHomeFeed({ page: 1, limit: 20 })
  });

  // Function to refetch feed (used after creating new posts)
  const refetchFeed = () => {
    queryClient.invalidateQueries({ queryKey: ['homeFeed'] });
  };

  if (isLoading) {
    return <FeedSkeleton count={5} />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-neutral-500">
        <p>Failed to load feed. Please try again.</p>
      </div>
    );
  }

  const posts = data?.data || [];

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-neutral-500">
        <p className="text-lg font-medium mb-2">No posts yet</p>
        <p className="text-sm">Start following people or create your first post!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((tweet: Tweet) => (
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
          onRefresh={refetchFeed}
        />
      ))}
    </div>
  );
}
