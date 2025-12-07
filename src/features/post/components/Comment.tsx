import { useState } from 'react';
import { MoreHorizontal, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';

interface CommentProps {
  id: string;
  avatar: string;
  name: string;
  username: string;
  time: string;
  content: string;
  isOwner?: boolean;
  isPostOwner?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, content: string) => Promise<void>;
}

export function Comment({
  id,
  avatar,
  name,
  username,
  time,
  content,
  isOwner = false,
  isPostOwner = false,
  onDelete,
  onUpdate
}: CommentProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentContent, setCommentContent] = useState(content);
  const [tempContent, setTempContent] = useState(content);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveEdit = async () => {
    if (!tempContent.trim()) return;

    setIsUpdating(true);
    try {
      if (onUpdate) {
        await onUpdate(id, tempContent.trim());
      }
      setCommentContent(tempContent);
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(id);
      }
      setIsDeleted(true);
      setShowDeleteAlert(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleted) return null;

  const showMenu = isOwner || isPostOwner;

  return (
    <>
      <div className="border-b border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
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

              {showMenu && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-500 rounded-full hover:bg-blue-500/10 hover:text-blue-500"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isOwner && (
                      <DropdownMenuItem
                        onClick={() => {
                          setTempContent(commentContent);
                          setIsEditing(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {(isOwner || isPostOwner) && (
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
                        onClick={() => setShowDeleteAlert(true)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-base whitespace-pre-wrap">{commentContent}</p>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={tempContent}
              onChange={e => setTempContent(e.target.value)}
              className="resize-none h-24 text-base"
              disabled={isUpdating}
              maxLength={280}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!tempContent.trim() || isUpdating}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete comment?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
