import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authService } from '../services/auth.service';
import { getApiErrorMessage } from '@/types/api.types';

type VerificationState = 'loading' | 'success' | 'error' | 'no-token';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerificationState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setState('no-token');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setState('success');
      } catch (error) {
        setState('error');
        setErrorMessage(getApiErrorMessage(error));
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white p-4">
      <Card className="w-full max-w-md bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 text-black dark:text-white">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 text-white dark:text-black fill-current">
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">
            {state === 'loading' && 'Verifying your email...'}
            {state === 'success' && '🎉 Email Verified!'}
            {state === 'error' && '❌ Verification Failed'}
            {state === 'no-token' && '⚠️ Invalid Link'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {state === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-neutral-500 dark:text-neutral-400">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {state === 'success' && (
            <div className="space-y-4">
              <CardDescription className="text-neutral-500 dark:text-neutral-400 text-base">
                Your email has been verified successfully. You can now log in to your account.
              </CardDescription>
            </div>
          )}

          {state === 'error' && (
            <div className="space-y-4">
              <CardDescription className="text-red-500 dark:text-red-400 text-base">
                {errorMessage || 'The verification link is invalid or has expired.'}
              </CardDescription>
              <p className="text-neutral-500 text-sm">
                Please try registering again or contact support if the issue persists.
              </p>
            </div>
          )}

          {state === 'no-token' && (
            <div className="space-y-4">
              <CardDescription className="text-yellow-600 dark:text-yellow-400 text-base">
                No verification token found in the URL.
              </CardDescription>
              <p className="text-neutral-500 text-sm">Please click the verification link from your email.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {state === 'success' ? (
            <Button
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-full font-bold px-8"
              asChild
            >
              <Link to="/login">Log in to your account</Link>
            </Button>
          ) : state === 'error' || state === 'no-token' ? (
            <div className="flex gap-4">
              <Button variant="outline" className="rounded-full border-neutral-300 dark:border-neutral-700" asChild>
                <Link to="/signup">Sign up again</Link>
              </Button>
              <Button variant="outline" className="rounded-full border-neutral-300 dark:border-neutral-700" asChild>
                <Link to="/login">Go to login</Link>
              </Button>
            </div>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
