import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const whoToFollow = [
    { name: 'React', handle: '@reactjs', avatar: 'https://github.com/reactjs.png' },
    { name: 'Next.js', handle: '@nextjs', avatar: 'https://github.com/vercel.png' },
    { name: 'Shadcn', handle: '@shadcn', avatar: 'https://github.com/shadcn.png' }
  ];

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
          {whoToFollow.map(user => (
            <div key={user.handle} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-bold hover:underline cursor-pointer">{user.name}</p>
                  <p className="text-neutral-500">{user.handle}</p>
                </div>
              </div>
              <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-full font-bold h-8 px-4">
                Follow
              </Button>
            </div>
          ))}
          <Button variant="link" className="text-blue-500 p-0 h-auto">
            Show more
          </Button>
        </CardContent>
      </Card>

      <div className="text-xs text-neutral-500 px-4 flex flex-wrap gap-x-2">
        <span>Terms of Service</span>
        <span>Privacy Policy</span>
        <span>Cookie Policy</span>
        <span>Accessibility</span>
        <span>Ads info</span>
        <span>More ...</span>
        <span>© 2025 X Corp.</span>
      </div>
    </div>
  );
}
