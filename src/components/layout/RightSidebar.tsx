import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/features/profile/services/user.service';
import { WhoToFollowSkeleton } from '@/components/skeletons';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/types/api.types';
import type { UserPublic } from '@/types/api.types';

export function RightSidebar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  // Fetch user suggestions
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['userSuggestions'],
    queryFn: () => userService.getSuggestions(3),
    staleTime: 60000 // Cache for 1 minute
  });

  return (
    <div className="hidden lg:flex flex-col w-[350px] p-4 h-full sticky top-0 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
        <Input
          placeholder="Search"
          className="pl-10 rounded-full bg-neutral-100 dark:bg-neutral-900 border-none focus-visible:ring-blue-500"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Card className="bg-neutral-50 dark:bg-neutral-900 border-none rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <WhoToFollowSkeleton count={3} />
          ) : suggestions.length === 0 ? (
            <p className="text-neutral-500 text-sm">No suggestions available</p>
          ) : (
            suggestions.map(user => <UserSuggestionItem key={user.id} user={user} />)
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-neutral-500 px-4 flex flex-wrap gap-x-2">
        <span>Terms of Service</span>
        <span>Privacy Policy</span>
        <span>Cookie Policy</span>
        <span>© 2025 X Corp.</span>
      </div>
    </div>
  );
}

function UserSuggestionItem({ user }: { user: UserPublic }) {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(user.is_following);

  const followMutation = useMutation({
    mutationFn: () => userService.follow(user.username),
    onSuccess: () => {
      setIsFollowing(true);
      toast.success(`You are now following @${user.username}`);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['userSuggestions'] });
      queryClient.invalidateQueries({ queryKey: ['user', user.username] });
    },
    onError: error => {
      toast.error(getApiErrorMessage(error));
    }
  });

  const unfollowMutation = useMutation({
    mutationFn: () => userService.unfollow(user.username),
    onSuccess: () => {
      setIsFollowing(false);
      toast.success(`You have unfollowed @${user.username}`);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['userSuggestions'] });
      queryClient.invalidateQueries({ queryKey: ['user', user.username] });
    },
    onError: error => {
      toast.error(getApiErrorMessage(error));
    }
  });

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  return (
    <div className="flex items-center justify-between">
      <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.profile_image_url || undefined} className="object-cover" />
          <AvatarFallback>{(user.display_name || user.username)[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-sm min-w-0">
          <p className="font-bold hover:underline cursor-pointer truncate">{user.display_name || user.username}</p>
          <p className="text-neutral-500 truncate">@{user.username}</p>
        </div>
      </Link>
      <Button
        onClick={handleFollowToggle}
        disabled={isLoading}
        className={
          isFollowing
            ? 'bg-transparent border border-neutral-300 dark:border-neutral-700 text-black dark:text-white hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 rounded-full font-bold h-8 px-4'
            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-full font-bold h-8 px-4'
        }
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
}
