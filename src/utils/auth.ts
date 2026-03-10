
// Authentication utility functions

export const StorageKeys = {
  ADMIN_PASSWORD: 'admin_password',
  IS_AUTHENTICATED: 'is_authenticated'
};

/**
 * Check if the user is authenticated
 * @returns boolean indicating authentication status
 */
export function isAuthenticated(): boolean {
  return localStorage.getItem(StorageKeys.IS_AUTHENTICATED) === 'true';
}

/**
 * Authenticate the user with password
 * @param password - User provided password
 * @returns boolean indicating login success
 */
export function login(password: string): boolean {
  // In a real app, this would be a server-side check
  // For demo purposes, we'll use a hardcoded password "admin123"
  if (password === 'admin123') {
    localStorage.setItem(StorageKeys.IS_AUTHENTICATED, 'true');
    return true;
  }
  return false;
}

/**
 * Log out the current user
 */
export function logout(): void {
  localStorage.removeItem(StorageKeys.IS_AUTHENTICATED);
}
