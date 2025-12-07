import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginValues } from '../schemas/auth.schema';
import { useAuth } from '@/hooks/use-auth';
import { getApiErrorMessage } from '@/types/api.types';

export default function LoginPage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All hooks MUST be called before any conditional returns
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Now we can have conditional returns
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  async function onSubmit(data: LoginValues) {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Logged in successfully!');
      navigate('/home');
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
          <CardTitle className="text-2xl font-bold">Sign in to X</CardTitle>
          <CardDescription className="text-neutral-400">Welcome back.</CardDescription>
        </CardHeader>
        <CardContent>
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
                        className="bg-black border-neutral-800 focus-visible:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-black border-neutral-800 focus-visible:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-neutral-200 rounded-full font-bold h-10 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Log in'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 items-center">
          <Button variant="link" className="text-blue-500 p-0 h-auto" asChild>
            <Link to="/forgot-password">Forgot password?</Link>
          </Button>
          <p className="text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
