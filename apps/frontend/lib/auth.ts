import { AuthResponse, User } from '@/types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// Get stored auth data
export const getStoredAuth = (): {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
} => {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null, user: null };
  }

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  const user = userStr ? JSON.parse(userStr) : null;

  return { accessToken, refreshToken, user };
};

// Store auth data
export const storeAuth = (auth: AuthResponse): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
};

// Clear auth data
export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const { accessToken } = getStoredAuth();
  return !!accessToken;
};

// Get user display name
export const getUserDisplayName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`.trim() || user.username;
};

// Get user initials
export const getUserInitials = (user: User): string => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  return user.username.substring(0, 2).toUpperCase();
};
