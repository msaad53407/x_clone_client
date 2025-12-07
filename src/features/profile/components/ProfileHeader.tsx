import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { uploadService } from '@/services/upload.service';
import type { UserPublic } from '@/types/api.types';
import { getApiErrorMessage } from '@/types/api.types';
import { useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, CalendarDays, Camera, Loader2, Mail, MoreHorizontal, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../services/user.service';

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
  const { refreshUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(user.is_following);
  const [followersCount, setFollowersCount] = useState(user.followers_count);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state when user prop changes (e.g., navigating to different profile)
  useEffect(() => {
    setIsFollowing(user.is_following);
    setFollowersCount(user.followers_count);
  }, [user.id, user.is_following, user.followers_count]);

  // Edit profile state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(user.display_name || '');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  // Image upload state
  const [profileImagePreview, setProfileImagePreview] = useState(user.profile_image_url || '');
  const [bannerImagePreview, setBannerImagePreview] = useState(user.banner_image_url || '');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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
      queryClient.invalidateQueries({ queryKey: ['userSuggestions'] });
    } catch (error) {
      // Revert on error
      setIsFollowing(wasFollowing);
      setFollowersCount(prev => (wasFollowing ? prev + 1 : prev - 1));
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditDisplayName(user.display_name || '');
    setEditBio(user.bio || '');
    setProfileImagePreview(user.profile_image_url || '');
    setBannerImagePreview(user.banner_image_url || '');
    setProfileImageFile(null);
    setBannerImageFile(null);
    setShowEditModal(true);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setBannerImagePreview(previewUrl);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Upload profile image if changed
      if (profileImageFile) {
        setIsUploadingProfile(true);
        try {
          await uploadService.uploadProfileImage(profileImageFile);
        } finally {
          setIsUploadingProfile(false);
        }
      }

      // Upload banner image if changed
      if (bannerImageFile) {
        setIsUploadingBanner(true);
        try {
          await uploadService.uploadBannerImage(bannerImageFile);
        } finally {
          setIsUploadingBanner(false);
        }
      }

      // Update text fields
      await userService.updateProfile({
        display_name: editDisplayName || undefined,
        bio: editBio || undefined
      });

      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ['user', user.username] });
      refreshUser();

      setShowEditModal(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
      setIsUploadingProfile(false);
      setIsUploadingBanner(false);
    }
  };

  const isUploading = isUploadingProfile || isUploadingBanner;

  return (
    <>
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
                  onClick={handleOpenEditModal}
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

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                </Button>
                <DialogTitle className="text-lg font-bold">Edit profile</DialogTitle>
              </div>
              <Button
                className="rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold px-4 h-8"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isUploading ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </DialogHeader>

          <div className="relative">
            {/* Hidden file inputs */}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleBannerImageChange}
              className="hidden"
            />
            <input
              ref={profileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleProfileImageChange}
              className="hidden"
            />

            {/* Banner Preview */}
            <div className="h-[120px] bg-neutral-200 dark:bg-neutral-800 relative group">
              {bannerImagePreview ? (
                <img src={bannerImagePreview} alt="Banner preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600" />
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="p-2 bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors"
                  disabled={isSaving}
                >
                  {isUploadingBanner ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Avatar Preview */}
            <div className="absolute left-4 -bottom-12">
              <div className="relative group">
                <Avatar className="w-[80px] h-[80px] border-4 border-white dark:border-black">
                  <AvatarImage src={profileImagePreview || undefined} className="object-cover" />
                  <AvatarFallback className="text-2xl">
                    {editDisplayName?.[0] || user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="p-2 bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors"
                    disabled={isSaving}
                  >
                    {isUploadingProfile ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="px-4 pt-16 pb-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-neutral-500 text-sm">
                Name
              </Label>
              <Input
                id="displayName"
                value={editDisplayName}
                onChange={e => setEditDisplayName(e.target.value)}
                placeholder="Your display name"
                maxLength={50}
                className="border-neutral-300 dark:border-neutral-700"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-neutral-500 text-sm">
                Bio
              </Label>
              <Input
                id="bio"
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                placeholder="Write a short bio..."
                maxLength={160}
                className="border-neutral-300 dark:border-neutral-700"
                disabled={isSaving}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
