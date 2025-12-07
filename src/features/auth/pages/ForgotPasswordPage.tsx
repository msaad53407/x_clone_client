import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas/auth.schema';
import { useAuth } from '@/hooks/use-auth';
import { authService } from '../services/auth.service';
import { getApiErrorMessage } from '@/types/api.types';

export default function ForgotPasswordPage() {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  async function onSubmit(data: ForgotPasswordValues) {
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
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
          <CardTitle className="text-2xl font-bold">Find your X account</CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400">
            {emailSent
              ? 'Check your email for the password reset link.'
              : 'Enter your email to receive a password reset link.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
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
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-neutral-500 dark:text-neutral-400">
                We've sent a password reset link to{' '}
                <span className="text-black dark:text-white font-medium">{form.getValues('email')}</span>
              </p>
              <p className="text-sm text-neutral-500">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full rounded-full border-neutral-300 dark:border-neutral-700"
              >
                Use different email
              </Button>
            </div>
          )}
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
