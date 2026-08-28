import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import PublicSearchPage from '../pages/PublicSearchPage';
import DashboardPage from '../pages/DashboardPage';
import CreateListingPage from '../pages/CreateListingPage';
import MyListingsPage from '../pages/MyListingsPage';
import ListingDetailPage from '../pages/ListingDetailPage';
import ProfilePage from '../pages/ProfilePage';
import ChatInboxPage from '../pages/ChatInboxPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import NotFoundPage from '../pages/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Public: Screen 2. No auth required — matches FR-SF-1 (guests can browse). */}
      <Route path="/" element={<PublicSearchPage />} />
      <Route path="/listings/:id" element={<ListingDetailPage />} />

      {/* Screen 5: the real dashboard, replacing the placeholder that lived here since Screen 2. */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-listing"
        element={
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-listings"
        element={
          <ProtectedRoute>
            <MyListingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* Screen 4: one inbox component, split-pane; :id optional (bare route = no thread open). */}
      <Route
        path="/conversations"
        element={
          <ProtectedRoute>
            <ChatInboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conversations/:id"
        element={
          <ProtectedRoute>
            <ChatInboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <AdminReportsPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
