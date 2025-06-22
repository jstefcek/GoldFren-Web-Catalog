// Enhanced input validation utilities
export const validateInput = (input, type) => {
  if (!input || typeof input !== 'string') return false;
  
  const sanitized = input.trim();
  
  if (type === 'username') {
    // More restrictive username validation
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    return usernameRegex.test(sanitized) && 
           sanitized.length >= 3 && 
           sanitized.length <= 50 &&
           !sanitized.includes('..') &&
           !sanitized.startsWith('.') && 
           !sanitized.endsWith('.');
  }
  
  if (type === 'password') {
    // Enhanced password validation
    return sanitized.length >= 8 && 
           sanitized.length <= 128 &&
           sanitized === input;
  }
  
  return false;
};

// Security utilities
export const securityUtils = {
  // Generate random nonce for CSP if needed
  generateNonce: () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },

  // Secure credential encoding
  encodeCredentials: (username, password) => {
    try {
      // Use TextEncoder for proper UTF-8 encoding
      const encoder = new TextEncoder();
      const credentials = `${username}:${password}`;
      const encoded = encoder.encode(credentials);
      
      // Convert to base64
      let binary = '';
      encoded.forEach(byte => binary += String.fromCharCode(byte));
      return btoa(binary);
    } catch (error) {
      console.error('Credential encoding error:', error);
      throw new Error('Failed to encode credentials');
    }
  },

  // Secure data clearing
  clearSensitiveData: (formElement) => {
    if (formElement) {
      const inputs = formElement.querySelectorAll('input[type="password"], input[name="password"]');
      inputs.forEach(input => {
        input.value = '';
        input.setAttribute('value', '');
      });
    }
  },

  // Generate CSRF token if needed
  generateCSRFToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Validate JWT token format (basic structure check)
  validateJWTFormat: (token) => {
    if (!token || typeof token !== 'string') return false;
    const tokenParts = token.split('.');
    return tokenParts.length === 3;
  },

  // Validate server URL
  validateServerURL: (url) => {
    return url && typeof url === 'string' && url.startsWith('http');
  }
};

// Form validation helper
export const validateLoginForm = (username, password, t) => {
  const errors = {};
  
  if (!validateInput(username, 'username')) {
    errors.username = t("login_screen.invalid_username") || 
      "Username must be 3-50 characters and contain only letters, numbers, dots, hyphens, or underscores.";
  }
  
  if (!validateInput(password, 'password')) {
    errors.password = t("login_screen.invalid_password") || 
      "Password must be 8-128 characters long.";
  }
  
  // Additional security checks
  if (username && password && username.toLowerCase() === password.toLowerCase()) {
    errors.password = t("login_screen.password_username_same") || 
      "Password cannot be the same as username.";
  }
  
  return errors;
};