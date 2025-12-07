import { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import SignupPage from './features/auth/pages/SignupPage';
import LoginPage from './features/auth/pages/LoginPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import VerifyEmailPage from './features/auth/pages/VerifyEmailPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import HomePage from './features/home/pages/HomePage';
import MainLayout from './components/layout/MainLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import './index.css';
import { ThemeProvider } from './components/theme/theme-provider';

const ExplorePage = lazy(() => import('./features/explore/pages/ExplorePage'));
const PostDetailsPage = lazy(() => import('./features/post/pages/PostDetailsPage'));
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage'));
const SavedPage = lazy(() => import('./features/saved/pages/SavedPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Public Routes */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route
                path="/explore"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ExplorePage />
                  </Suspense>
                }
              />
              <Route
                path="/profile"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ProfilePage />
                  </Suspense>
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ProfilePage />
                  </Suspense>
                }
              />
              <Route
                path="/saved"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <SavedPage />
                  </Suspense>
                }
              />
              <Route
                path="/post/:username/:postId"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <PostDetailsPage />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
