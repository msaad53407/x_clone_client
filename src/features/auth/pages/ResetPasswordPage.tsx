import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useSearchParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { resetPasswordSchema, type ResetPasswordValues } from '../schemas/auth.schema';
import { useAuth } from '@/hooks/use-auth';
import { authService } from '../services/auth.service';
import { getApiErrorMessage } from '@/types/api.types';

export default function ResetPasswordPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      password: '',
      confirmPassword: ''
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  async function onSubmit(data: ResetPasswordValues) {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(token, data.password);
      toast.success('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message);
      if (message.includes('expired') || message.includes('invalid')) {
        setTokenValid(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!tokenValid) {
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
            <CardTitle className="text-2xl font-bold">⚠️ Invalid Reset Link</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-neutral-500 dark:text-neutral-400">
              This password reset link is invalid or has expired.
            </p>
            <p className="text-sm text-neutral-500">Password reset links expire after 1 hour for security reasons.</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-full font-bold"
              asChild
            >
              <Link to="/forgot-password">Request New Reset Link</Link>
            </Button>
            <Link to="/login" className="text-sm text-blue-500 hover:underline text-center w-full">
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white p-4">
      <Card className="w-full max-w-md bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 text-black dark:text-white">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 text-white dark:text-black fill-current">
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        {...field}
                        className="bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 focus-visible:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        {...field}
                        className="bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 focus-visible:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-full font-bold h-10 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-blue-500 hover:underline">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
