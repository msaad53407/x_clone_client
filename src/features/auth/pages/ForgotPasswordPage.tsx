import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordValues,
  type ResetPasswordValues
} from '../schemas/auth.schema';
import { useAuth } from '@/hooks/use-auth';

export default function ForgotPasswordPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');

  const forgotPasswordForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const resetPasswordForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: ''
    }
  });

  function onForgotPasswordSubmit(data: ForgotPasswordValues) {
    console.log('Sending OTP to:', data.email);
    setEmail(data.email);
    toast.success('OTP sent to your email!');
    setStep(2);
  }

  function onResetPasswordSubmit(data: ResetPasswordValues) {
    console.log('Resetting password for:', email, 'with OTP:', data.otp);
    toast.success('Password reset successfully!');
    // In a real app, you'd redirect to login here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <Card className="w-full max-w-md bg-black border-neutral-800 text-white">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 text-black fill-current">
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 ? 'Find your X account' : 'Reset your password'}
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {step === 1
              ? 'Enter your email to search for your account.'
              : `Enter the code sent to ${email} and your new password.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <Form {...forgotPasswordForm}>
              <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          {...field}
                          className="bg-black border-neutral-800 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-neutral-200 rounded-full font-bold h-10 text-base"
                >
                  Next
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...resetPasswordForm}>
              <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                <FormField
                  control={resetPasswordForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456"
                          {...field}
                          className="bg-black border-neutral-800 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetPasswordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-black border-neutral-800 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetPasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-black border-neutral-800 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-neutral-200 rounded-full font-bold h-10 text-base"
                >
                  Reset Password
                </Button>
              </form>
            </Form>
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
