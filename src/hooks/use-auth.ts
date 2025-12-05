import { useState } from 'react';

export function useAuth() {
  // Mock auth state - in a real app this would come from a context or store
  // For now, we'll assume the user is authenticated if they are not on auth pages
  // You can toggle this to test protected routes
  const [isAuthenticated] = useState(true);

  return { isAuthenticated };
}
