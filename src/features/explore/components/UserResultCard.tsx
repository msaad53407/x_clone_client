import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BadgeCheck } from 'lucide-react';

interface UserResultCardProps {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  isVerified?: boolean;
  isFollowing?: boolean;
}

export function UserResultCard({
  name,
  username,
  avatar,
  bio,
  isVerified = false,
  isFollowing = false
}: UserResultCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/profile/${username.replace('@', '')}`)}
    >
      <div className="flex justify-between items-start gap-3">
        {/* Left Side: Avatar */}
        <Avatar className="w-10 h-10 md:w-12 md:h-12">
          <AvatarImage src={avatar} className="object-cover" />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>

        {/* Center: Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold text-black dark:text-white leading-tight">{name}</span>
              {isVerified && <BadgeCheck className="w-4 h-4 fill-blue-500 text-white" />}
            </div>
            <span className="text-neutral-500 text-sm">{username}</span>
          </div>

          <p className="text-neutral-900 dark:text-neutral-200 mt-1 mb-1 text-sm md:text-base leading-snug">{bio}</p>
        </div>

        {/* Right Side: Follow Button */}
        <div>
          <Button
            className={`rounded-full font-bold h-8 px-4 text-sm ${
              isFollowing
                ? 'bg-transparent border border-neutral-300 text-black hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:text-white dark:border-neutral-700'
                : 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>
    </div>
  );
}
