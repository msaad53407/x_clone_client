import { MessageCircle, Repeat2, Heart, BarChart2, Share, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PostCardProps {
  avatar: string;
  name: string;
  username: string;
  time: string;
  content: string;
  image?: string;
  comments: number;
  reposts: number;
  likes: number;
  views: string;
}

export function PostCard({
  avatar,
  name,
  username,
  time,
  content,
  image,
  comments,
  reposts,
  likes,
  views
}: PostCardProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://x.com/${username.replace('@', '')}/status/123456789`);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatar} />
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-500 rounded-full hover:bg-blue-500/10 hover:text-blue-500"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-base whitespace-pre-wrap mb-3">{content}</p>

          {image && (
            <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-3">
              <img src={image} alt="Post content" className="w-full h-auto" />
            </div>
          )}

          <div className="flex justify-between text-neutral-500 max-w-md">
            <Button variant="ghost" size="sm" className="group flex items-center gap-2 hover:text-blue-500 px-0">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">{comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="group flex items-center gap-2 hover:text-green-500 px-0">
              <div className="p-2 rounded-full group-hover:bg-green-500/10">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{reposts}</span>
            </Button>
            <Button variant="ghost" size="sm" className="group flex items-center gap-2 hover:text-pink-500 px-0">
              <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs">{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="group flex items-center gap-2 hover:text-blue-500 px-0">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{views}</span>
            </Button>
            <div className="flex">
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
  );
}
