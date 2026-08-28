export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone: string | null;
  role: UserRole;
  status: 'active' | 'suspended';
}

// The authenticated user object is the same shape everywhere it's returned
// (login, /users/me, /users/me PATCH) — kept as a separate alias since call
// sites conceptually mean "the current session's user", not "any profile".
export type AuthUser = UserProfile;

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface RegisterResponse {
  userId: string;
  status: 'pending_verification';
}

export interface VerifyEmailResponse {
  message: string;
}

export interface UpdateProfilePayload {
  displayName?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserStats {
  activeListingsCount: number;
  conversationsCount: number;
  unreadMessagesCount: number;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
