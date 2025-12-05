import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/features/home/components/PostCard';
import { Comment } from '../components/Comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

export default function PostDetailsPage() {
  const navigate = useNavigate();
  const { username } = useParams();

  // Mock 'current user' status for testing permissions
  // In a real app this would come from auth context
  // user is 'msaad_dev'

  // Logic to simulate if current user is post owner:
  // For demo: if URL username includes 'msaad', we act os owner?
  // No, let's keep it static for the main post as per SavedPage demo,
  // but we can pass a prop if needed.
  // Actually, let's allow testing both scenarios.

  const [replyText, setReplyText] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      avatar: 'https://github.com/shadcn.png',
      name: 'Shadcn',
      username: '@shadcn',
      time: '2h',
      content: 'Great post! Keep it up.',
      isOwner: false
    },
    {
      id: '2',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop',
      name: 'John Doe',
      username: '@johndoe',
      time: '1h',
      content: 'I completely agree with this.',
      isOwner: true // Comment owned by us (can Edit/Delete)
    },
    {
      id: '3',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
      name: 'Alexandra Prado',
      username: '@Alexandra_chess',
      time: '30m',
      content: 'Wait, what about the other side of the argument?',
      isOwner: false
    }
  ]);

  const handleReply = () => {
    if (!replyText.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      avatar: 'https://github.com/shadcn.png', // Our avatar
      name: 'Me',
      username: '@msaad_dev',
      time: 'Just now',
      content: replyText,
      isOwner: true
    };
    setComments([newComment, ...comments]);
    setReplyText('');
  };

  // We assume the main post is "Owned" by us if we want to test Post Owner deleting comments.
  // For this demo, let's say the main post IS owned by us (isOwner={true})
  // so we can test deleting other people's comments.
  const isPostOwner = true;

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
          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
          name="Alexandra Prado"
          username={username ? `@${username}` : '@Alexandra_chess'}
          time="12h"
          content="This is the main post you clicked on. (Mocked data for details view)"
          comments={12}
          reposts={5}
          likes={89}
          isOwner={isPostOwner} // We are owner of this post for this demo
        />
      </div>

      {/* Reply Input */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 p-4 flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Post your reply"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            className="border-none focus-visible:ring-0 text-xl resize-none p-0 min-h-[50px] placeholder:text-neutral-500"
          />
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleReply}
              disabled={!replyText.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold px-4"
            >
              Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div>
        {comments.map(comment => (
          <Comment key={comment.id} {...comment} isPostOwner={isPostOwner} />
        ))}
      </div>
    </div>
  );
}
