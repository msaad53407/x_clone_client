import { Route, Routes, Navigate } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import SignupPage from './features/auth/pages/SignupPage';
import LoginPage from './features/auth/pages/LoginPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import HomePage from './features/home/pages/HomePage';
import ProfilePage from './features/profile/pages/ProfilePage';
import MainLayout from './components/layout/MainLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import './index.css';
import { ThemeProvider } from './components/theme/theme-provider';

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

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/explore" element={<div className="p-4">Explore Page (Coming Soon)</div>} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
