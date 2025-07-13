import { isTokenExpired, getRoleFromToken, getUsernameFromToken, mapRoleToRoleId } from './tokenUtils';

// Check if user is authenticated and token is valid
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!token || !isAuth) {
    return false;
  }
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // Clear expired token data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleName');
    return false;
  }
  
  return true;
};

// Validate and refresh token data if needed
export const validateTokenData = () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return false;
  }
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // Clear expired token data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleName');
    return false;
  }
  
  // Validate and update stored data from token
  const roleFromToken = getRoleFromToken(token);
  const usernameFromToken = getUsernameFromToken(token);
  
  if (roleFromToken) {
    const roleId = mapRoleToRoleId(roleFromToken);
    localStorage.setItem('userRole', roleId);
    localStorage.setItem('userRoleName', roleFromToken);
  }
  
  if (usernameFromToken) {
    localStorage.setItem('username', usernameFromToken);
  }
  
  return true;
};

// Get user role information
export const getUserRole = () => {
  return {
    roleId: localStorage.getItem('userRole'),
    roleName: localStorage.getItem('userRoleName'),
    isAdmin: isAdminUser()
  };
};

// Check if user is admin
export const isAdminUser = () => {
  const userRole = localStorage.getItem('userRole');
  return userRole === '1' || userRole === '2' || userRole === '3';
};

// Clear all authentication data
export const clearAuthData = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userRoleName');
};

// Utility to get Authorization header for API requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}; 