import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Bookmark, Edit2, Heart, MessageCircle, MoreHorizontal, Share, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { tweetService } from '../services/tweet.service';
import { engagementService } from '../services/engagement.service';
import { getApiErrorMessage } from '@/types/api.types';

export interface PostCardProps {
  id: string;
  avatar: string;
  name: string;
  username: string;
  authorId: string;
  time: string;
  content: string;
  image?: string;
  comments: number;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  quotedPost?: {
    avatar: string;
    name: string;
    username: string;
    time: string;
    content: string;
    image?: string;
  };
  onRefresh?: () => void;
}

export function PostCard({
  id,
  avatar,
  name,
  username,
  authorId,
  time,
  content,
  image,
  comments,
  likes: initialLikes,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  quotedPost,
  onRefresh
}: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwner = user?.id === authorId;

  // Local state for optimistic updates
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [postContent, setPostContent] = useState(content);
  const [tempContent, setTempContent] = useState(content);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Engagement states
  const [liked, setLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [bookmarked, setBookmarked] = useState(initialIsBookmarked);

  // Loading states
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${username.replace('@', '')}/${id}`);
    toast.success('Copied to clipboard');
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (likeLoading) return;

    setLikeLoading(true);
    // Optimistic update
    const wasLiked = liked;
    setLiked(!liked);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));

    try {
      if (wasLiked) {
        await engagementService.unlikeTweet(id);
      } else {
        await engagementService.likeTweet(id);
      }
    } catch (error) {
      // Revert on error
      setLiked(wasLiked);
      setLikeCount(prev => (wasLiked ? prev + 1 : prev - 1));
      toast.error(getApiErrorMessage(error));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkLoading) return;

    setBookmarkLoading(true);
    const wasBookmarked = bookmarked;
    setBookmarked(!bookmarked);

    try {
      if (wasBookmarked) {
        await engagementService.unbookmarkTweet(id);
        toast.success('Removed from Bookmarks');
      } else {
        await engagementService.bookmarkTweet(id);
        toast.success('Added to Bookmarks');
      }
    } catch (error) {
      setBookmarked(wasBookmarked);
      toast.error(getApiErrorMessage(error));
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await tweetService.update(id, { content: tempContent });
      setPostContent(tempContent);
      setIsEditing(false);
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await tweetService.delete(id);
      setIsDeleted(true);
      setShowDeleteAlert(false);
      toast.success('Post deleted');
      onRefresh?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handlePostClick = () => {
    navigate(`/post/${username.replace('@', '')}/${id}`);
  };

  if (isDeleted) return null;

  return (
    <>
      <div
        className="border-b border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
        onClick={handlePostClick}
      >
        <div className="flex gap-3">
          <Avatar
            className="w-10 h-10 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={e => {
              e.stopPropagation();
              navigate(`/profile/${username.replace('@', '')}`);
            }}
          >
            <AvatarImage src={avatar} className="object-cover" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-neutral-500 text-sm truncate">
                <span className="font-bold text-black dark:text-white truncate">{name}</span>
                <span className="truncate">{username}</span>
                <span>·</span>
                <span className="hover:underline">{time}</span>
              </div>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-500 rounded-full hover:bg-blue-500/10 hover:text-blue-500"
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        setTempContent(postContent);
                        setIsEditing(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
                      onClick={e => {
                        e.stopPropagation();
                        setShowDeleteAlert(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-base whitespace-pre-wrap mb-3">{postContent}</p>

            {/* Regular Image */}
            {image && !quotedPost && (
              <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-3">
                <img src={image} alt="Post content" className="w-full h-auto" />
              </div>
            )}

            {/* Quoted Post */}
            {quotedPost && (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3 mt-3 mb-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={quotedPost.avatar} />
                    <AvatarFallback>{quotedPost.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1 text-neutral-500 text-sm truncate">
                    <span className="font-bold text-black dark:text-white truncate">{quotedPost.name}</span>
                    <span className="truncate">{quotedPost.username}</span>
                    <span>·</span>
                    <span>{quotedPost.time}</span>
                  </div>
                </div>
                <p className="text-base whitespace-pre-wrap mb-2">{quotedPost.content}</p>
                {quotedPost.image && (
                  <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <img src={quotedPost.image} alt="Quoted content" className="w-full h-auto" />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between text-neutral-500 max-w-md">
              <Button variant="ghost" size="sm" className="group flex items-center gap-2 hover:text-blue-500 px-0">
                <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs">{comments}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`group flex items-center gap-2 px-0 ${liked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                onClick={handleLike}
                disabled={likeLoading}
              >
                <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                  <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500' : ''}`} />
                </div>
                <span className="text-xs">{likeCount}</span>
              </Button>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`group h-8 w-8 rounded-full ${bookmarked ? 'text-blue-500' : 'hover:text-blue-500'}`}
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                    <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-blue-500' : ''}`} />
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group h-8 w-8 hover:text-blue-500 rounded-full"
                  onClick={e => {
                    e.stopPropagation();
                    handleCopyLink();
                  }}
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                    <Share className="w-4 h-4" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent onClick={e => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={tempContent}
              onChange={e => setTempContent(e.target.value)}
              className="resize-none h-32 text-lg"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This allows to delete post. This action cannot be undone and will remove your post from your profile, the
              timeline of any accounts that follow you, and from search results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-full">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
