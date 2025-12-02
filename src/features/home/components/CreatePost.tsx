import { useState } from 'react';
import { Image, List, Smile, Calendar, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function CreatePost() {
  const [content, setContent] = useState('');

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 p-4 flex gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-4">
        <Textarea
          placeholder="What is happening?!"
          className="w-full bg-transparent border-none focus-visible:ring-0 text-xl resize-none min-h-[50px] p-0 placeholder:text-neutral-500"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-blue-500">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-500/10 w-8 h-8">
              <Image className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-500/10 w-8 h-8">
              <div className="border border-current rounded px-0.5 text-[10px] font-bold">GIF</div>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-500/10 w-8 h-8">
              <List className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-500/10 w-8 h-8">
              <Smile className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-500/10 w-8 h-8">
              <Calendar className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-500/10 w-8 h-8 opacity-50 cursor-not-allowed"
            >
              <MapPin className="w-5 h-5" />
            </Button>
          </div>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold px-4"
            disabled={!content.trim()}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
