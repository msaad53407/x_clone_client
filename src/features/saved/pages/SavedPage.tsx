import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PostCard } from '@/features/home/components/PostCard';
import { engagementService } from '@/features/home/services/engagement.service';
import { FeedSkeleton } from '@/components/skeletons';
import { formatTimeAgo } from '@/utils/formatTime';
import type { Tweet } from '@/types/api.types';
import { Bookmark } from 'lucide-react';

export default function SavedPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => engagementService.getBookmarks({ page: 1, limit: 50 })
  });

  const refetchBookmarks = () => {
    queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
  };

  const bookmarks = data?.data || [];

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex h-[53px] items-center px-4">
          <h1 className="font-bold text-xl">Bookmarks</h1>
        </div>
      </div>

      {isLoading ? (
        <FeedSkeleton count={5} />
      ) : error ? (
        <div className="p-8 text-center text-neutral-500">
          <p>Failed to load bookmarks. Please try again.</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <Bookmark className="w-12 h-12 text-neutral-300 dark:text-neutral-700" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Save posts for later</h2>
          <p className="text-neutral-500 max-w-sm mx-auto">Bookmark posts to easily find them again in the future.</p>
        </div>
      ) : (
        <div>
          {bookmarks.map((tweet: Tweet) => (
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
              onRefresh={refetchBookmarks}
            />
          ))}
        </div>
      )}
    </div>
  );
}
