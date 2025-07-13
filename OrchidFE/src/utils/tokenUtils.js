// Utility functions for JWT token handling

export const parseJwtToken = (token) => {
  try {
    // JWT tokens have 3 parts separated by dots
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

export const getRoleFromToken = (token) => {
  const payload = parseJwtToken(token);
  if (payload && payload.role) {
    return payload.role;
  }
  return null;
};

export const getUsernameFromToken = (token) => {
  const payload = parseJwtToken(token);
  if (payload && payload.sub) {
    return payload.sub;
  }
  return null;
};

export const isTokenExpired = (token) => {
  const payload = parseJwtToken(token);
  if (payload && payload.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }
  return true;
};

// Simplified role mapping - only ADMIN and USER
export const mapRoleToRoleId = (roleName) => {
  const roleMap = {
    'ROLE_ADMIN': '1',
    'ROLE_USER': '4',
    // Fallback mappings without ROLE_ prefix
    'ADMIN': '1',
    'USER': '4'
  };
  
  return roleMap[roleName] || '4'; // Default to user role if not found
};

// Check if user is admin based on role name
export const isAdminRole = (roleName) => {
  const adminRoles = ['ROLE_ADMIN', 'ADMIN'];
  return adminRoles.includes(roleName);
}; 