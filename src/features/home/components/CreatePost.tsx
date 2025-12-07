import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import { Image, Smile, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { tweetService } from '../services/tweet.service';
import { getApiErrorMessage } from '@/types/api.types';

export function CreatePost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setPostContent(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!postContent.trim() && !imagePreview) return;

    setIsSubmitting(true);
    try {
      // TODO: Upload image to Cloudinary first if imagePreview exists
      // For now, we only submit the text content
      await tweetService.create({
        content: postContent.trim() || undefined
        // image_url: uploadedImageUrl, // Add after implementing image upload
      });

      // Reset form
      setPostContent('');
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh the feed
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });

      toast.success('Post created!');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`border-b border-neutral-200 dark:border-neutral-800 p-4 transition-colors ${
        isDragging ? 'bg-blue-500/10' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={user?.profile_image_url || 'https://github.com/shadcn.png'} className="object-cover" />
          <AvatarFallback>{user?.display_name?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="What is happening?!"
            className="w-full text-xl border-none focus-visible:ring-0 resize-none p-0 min-h-[50px] bg-transparent"
            value={postContent}
            onChange={e => setPostContent(e.target.value)}
            disabled={isSubmitting}
          />

          {imagePreview && (
            <div className="relative mt-3 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[300px] object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full w-8 h-8"
                onClick={handleRemoveImage}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-1 text-blue-500 relative">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-blue-500/10 w-8 h-8"
                onClick={handleImageClick}
                disabled={isSubmitting}
              >
                <Image className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-blue-500/10 w-8 h-8"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={isSubmitting}
              >
                <Smile className="w-5 h-5" />
              </Button>

              {showEmojiPicker && (
                <div className="absolute top-full left-0 z-50 mt-2 shadow-xl rounded-xl">
                  <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.AUTO} lazyLoadEmojis={true} />
                </div>
              )}
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold px-4"
              disabled={(!postContent.trim() && !imagePreview) || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
