import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeCheck, CalendarDays, MoreHorizontal, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../services/user.service';
import { getApiErrorMessage } from '@/types/api.types';
import type { UserPublic } from '@/types/api.types';

interface ProfileHeaderProps {
  user: UserPublic;
  isOwnProfile: boolean;
}

function formatJoinDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(user.is_following);
  const [followersCount, setFollowersCount] = useState(user.followers_count);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const wasFollowing = isFollowing;

    // Optimistic update
    setIsFollowing(!wasFollowing);
    setFollowersCount(prev => (wasFollowing ? prev - 1 : prev + 1));

    try {
      if (wasFollowing) {
        await userService.unfollow(user.username);
        toast.success(`Unfollowed @${user.username}`);
      } else {
        await userService.follow(user.username);
        toast.success(`Following @${user.username}`);
      }
      // Invalidate user query to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', user.username] });
    } catch (error) {
      // Revert on error
      setIsFollowing(wasFollowing);
      setFollowersCount(prev => (wasFollowing ? prev + 1 : prev - 1));
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
      {/* Banner */}
      <div className="h-[200px] bg-neutral-200 dark:bg-neutral-800 relative">
        {user.banner_image_url ? (
          <img src={user.banner_image_url} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600" />
        )}
      </div>

      {/* Profile Info Section */}
      <div className="px-4 relative">
        {/* Avatar & Actions Row */}
        <div className="flex justify-between items-start">
          <div className="-mt-18 mb-3">
            <Avatar className="w-[134px] h-[134px] border-4 border-white dark:border-black">
              <AvatarImage src={user.profile_image_url || undefined} className="object-cover" />
              <AvatarFallback className="text-4xl">
                {user.display_name?.[0] || user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="pt-3 flex gap-2">
            {!isOwnProfile && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-[34px] h-[34px] border-neutral-300 dark:border-neutral-600"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-[34px] h-[34px] border-neutral-300 dark:border-neutral-600"
                >
                  <Mail className="w-4 h-4" />
                </Button>
                <Button
                  className={`rounded-full font-bold px-4 h-[34px] ${
                    isFollowing
                      ? 'bg-transparent border border-neutral-300 dark:border-neutral-600 text-black dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-500/10'
                      : 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200'
                  }`}
                  onClick={handleFollow}
                  disabled={isLoading}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </>
            )}
            {isOwnProfile && (
              <Button
                variant="outline"
                className="rounded-full font-bold px-4 h-[34px] border-neutral-300 dark:border-neutral-600"
              >
                Edit profile
              </Button>
            )}
          </div>
        </div>

        {/* Name & Handle */}
        <div className="mb-3">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-black text-black dark:text-white">{user.display_name || user.username}</h1>
            {user.is_verified && <BadgeCheck className="w-5 h-5 fill-blue-500 text-white" />}
          </div>
          <div className="text-neutral-500 text-[15px]">@{user.username}</div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mb-3 text-[15px] text-black dark:text-white">
            <p className="whitespace-pre-wrap">{user.bio}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-500 text-[15px] mb-3">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>Joined {formatJoinDate(user.created_at)}</span>
          </div>
        </div>

        {/* Follow Counts */}
        <div className="flex gap-4 text-[15px] mb-4">
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-black dark:text-white">{user.following_count}</span>{' '}
            <span className="text-neutral-500">Following</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-black dark:text-white">{followersCount}</span>{' '}
            <span className="text-neutral-500">Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
