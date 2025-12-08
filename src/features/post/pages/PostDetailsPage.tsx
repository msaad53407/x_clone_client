import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/features/home/components/PostCard';
import { Comment } from '../components/Comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { tweetService } from '@/features/home/services/tweet.service';
import { commentService } from '../services/comment.service';
import { PostCardSkeleton, CommentsSkeleton } from '@/components/skeletons';
import { formatTimeAgo } from '@/utils/formatTime';
import { getApiErrorMessage } from '@/types/api.types';
import type { Comment as CommentType } from '@/types/api.types';

export default function PostDetailsPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tweet data
  const {
    data: tweet,
    isLoading: tweetLoading,
    error: tweetError
  } = useQuery({
    queryKey: ['tweet', postId],
    queryFn: () => tweetService.getById(postId!),
    enabled: !!postId
  });

  // Fetch comments
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getComments(postId!, 1, 50),
    enabled: !!postId
  });

  const comments = commentsData?.data || [];

  const handleReply = async () => {
    if (!replyText.trim() || !postId) return;

    setIsSubmitting(true);
    try {
      await commentService.createComment(postId, { content: replyText.trim() });
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['tweet', postId] });
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });
      toast.success('Reply posted!');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!postId) return;
    try {
      await commentService.deleteComment(postId, commentId);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['tweet', postId] });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      await commentService.updateComment(commentId, { content });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment updated');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const isPostOwner = tweet?.author.id === user?.id;

  if (tweetLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-bold text-xl leading-5">Post</span>
        </div>
        <PostCardSkeleton />
        <div className="border-b border-neutral-200 dark:border-neutral-800 p-4" />
        <CommentsSkeleton count={3} />
      </div>
    );
  }

  if (tweetError || !tweet) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
        <p>Tweet not found or an error occurred.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-5">Post</span>
        </div>
      </div>

      {/* Main Post */}
      <div>
        <PostCard
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
        />
      </div>

      {/* Reply Input */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 p-4 flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.profile_image_url || undefined} className="object-cover" />
          <AvatarFallback>{user?.display_name?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Post your reply"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            className="border-none focus-visible:ring-0 text-xl resize-none p-0 min-h-[50px] placeholder:text-neutral-500 bg-transparent"
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleReply}
              disabled={!replyText.trim() || isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold px-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Reply'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div>
        {commentsLoading ? (
          <CommentsSkeleton count={3} />
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <p>No replies yet. Be the first to reply!</p>
          </div>
        ) : (
          comments.map((comment: CommentType) => (
            <Comment
              key={comment.id}
              id={comment.id}
              avatar={comment.author.profile_image_url || 'https://github.com/shadcn.png'}
              name={comment.author.display_name || comment.author.username}
              username={`@${comment.author.username}`}
              time={formatTimeAgo(comment.created_at)}
              content={comment.content}
              isOwner={comment.author.id === user?.id}
              isPostOwner={isPostOwner}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
