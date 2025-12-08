/**
 * Skeleton loaders for various UI components
 */

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton for a single post card
 */
export function PostCardSkeleton() {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          {/* Content lines */}
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-3" />
          {/* Action buttons */}
          <div className="flex gap-8 mt-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the feed (multiple posts)
 */
export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for a single comment
 */
export function CommentSkeleton() {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 p-4">
      <div className="flex gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for comments list
 */
export function CommentsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for user suggestion card
 */
export function UserSuggestionSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  );
}

/**
 * Skeleton for who to follow section
 */
export function WhoToFollowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <UserSuggestionSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for profile page header
 */
export function ProfileHeaderSkeleton() {
  return (
    <div>
      {/* Banner */}
      <Skeleton className="h-32 md:h-48 w-full" />
      <div className="px-4">
        {/* Avatar */}
        <div className="relative -mt-12 md:-mt-16 mb-3">
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-black" />
        </div>
        {/* Name and username */}
        <Skeleton className="h-6 w-40 mb-1" />
        <Skeleton className="h-4 w-24 mb-3" />
        {/* Bio */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        {/* Stats */}
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for search results (users)
 */
export function UserResultSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-neutral-200 dark:border-neutral-800">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  );
}

/**
 * Skeleton for search results
 */
export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <UserResultSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Generic page loading skeleton
 */
export function PageSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="h-8 w-48 mb-6" />
      <FeedSkeleton count={3} />
    </div>
  );
}
