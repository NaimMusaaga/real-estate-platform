import { isAxiosError } from 'axios';
import type { ApiErrorBody } from '../types/auth.types';

/** Extracts the backend's `{ error: { message } }` shape, with a safe fallback. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(err) && err.response?.data?.error?.message) {
    return err.response.data.error.message;
  }
  return fallback;
}
