/**
 * NotFound Page (404)
 * Displayed when a route is not found
 */

import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black px-4">
      <div className="text-center max-w-md">
        {/* X Logo */}
        <div className="mb-8">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-12 h-12 mx-auto fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-neutral-500 mb-8">Hmm...this page doesn't exist. Try searching for something else.</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full font-bold px-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </Button>
          <Button
            onClick={() => navigate('/home')}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold px-6"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
