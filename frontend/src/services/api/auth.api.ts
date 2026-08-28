import apiClient from './apiClient';
import type {
  AuthUser,
  ChangePasswordPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  UpdateProfilePayload,
  UserProfile,
  UserStats,
  VerifyEmailResponse,
} from '../../types/auth.types';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password });
  return data;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>('/users/me');
  return data;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/auth/register', payload);
  return data;
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  const { data } = await apiClient.post<VerifyEmailResponse>('/auth/verify-email', { token });
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const { data } = await apiClient.patch<UserProfile>('/users/me', payload);
  return data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.patch('/users/me/password', payload);
}

export async function getMyStats(): Promise<UserStats> {
  const { data } = await apiClient.get<UserStats>('/users/me/stats');
  return data;
}
