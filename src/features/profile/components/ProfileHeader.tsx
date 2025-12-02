import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeCheck, CalendarDays, Link as LinkIcon, MapPin, MoreHorizontal, Mail, Briefcase } from 'lucide-react';

export function ProfileHeader() {
  return (
    <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
      {/* Banner */}
      <div className="h-[200px] bg-neutral-200 dark:bg-neutral-800 relative">
        <img
          src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop"
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info Section */}
      <div className="px-4 relative">
        {/* Avatar & Actions Row */}
        <div className="flex justify-between items-start">
          <div className="-mt-18 mb-3">
            <Avatar className="w-[134px] h-[134px] border-4 border-white dark:border-black">
              <AvatarImage
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
                className="object-cover"
              />
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
          </div>
          <div className="pt-3 flex gap-2">
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
            <Button className="rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold px-4 h-[34px]">
              Follow
            </Button>
          </div>
        </div>

        {/* Name & Handle */}
        <div className="mb-3">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-black text-black dark:text-white">Alexandra Prado</h1>
            <BadgeCheck className="w-5 h-5 fill-blue-500 text-white" />
          </div>
          <div className="text-neutral-500 text-[15px]">@Alexandra_chess</div>
        </div>

        {/* Bio */}
        <div className="mb-3 text-[15px] text-black dark:text-white">
          <p>
            Content Creator, Streamer💜 | +300k YouTube | Try ChessMind AI 30% off!{' '}
            <span className="text-blue-500 hover:underline cursor-pointer">chessmind.ai/alexandrachess</span>🔥💌
            <span className="text-black dark:text-white">alexandrapradobusiness@gmail.com</span>
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-500 text-[15px] mb-3">
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>Content Creator</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>France</span>
          </div>
          <div className="flex items-center gap-1">
            <LinkIcon className="w-4 h-4" />
            <a href="#" className="text-blue-500 hover:underline">
              beacons.ai/alexandrachess
            </a>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>Joined January 2021</span>
          </div>
        </div>

        {/* Follow Counts */}
        <div className="flex gap-4 text-[15px] mb-4">
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-black dark:text-white">306</span>{' '}
            <span className="text-neutral-500">Following</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-black dark:text-white">5,979</span>{' '}
            <span className="text-neutral-500">Followers</span>
          </div>
        </div>

        {/* Followed By Text */}
        <div className="text-[13px] text-neutral-500 mb-4">Not followed by anyone you're following</div>
      </div>
    </div>
  );
}
