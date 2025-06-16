import { securityUtils } from '../utils/security.js';

const serverUrl = import.meta.env.VITE_API_URL;

export class AuthService {
  constructor() {
    this.abortController = null;
  }

  // Create secure request headers
  createHeaders(credentials) {
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Authorization": `Basic ${credentials}`
    };

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }

    return headers;
  }

  // Handle different HTTP error responses
  handleHTTPError(response) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    } else if (response.status === 401) {
      throw new Error("Invalid credentials");
    } else if (response.status >= 500) {
      throw new Error("Server error");
    } else {
      throw new Error("Authentication failed");
    }
  }

  // Validate and store session data
  storeSessionData(data) {
    // Validate response structure
    if (!data || typeof data !== 'object' || !data.access || typeof data.access !== 'string') {
      throw new Error("Invalid server response");
    }

    // Validate token format (basic JWT structure check)
    if (!securityUtils.validateJWTFormat(data.access)) {
      throw new Error("Invalid token format");
    }

    try {
        // Store session data securely
        const sessionData = {
            access: data.access,
            timestamp: Date.now(),
            expires: data.expiry_date || null,
            user: {
                first_name: data.first_name || null,
                last_name: data.last_name || null,
                email: data.email || null,
                isAdmin: data.isAdmin || false,
                isActive: data.isActive || true,
                isInternal: data.isInternal || false,
            }
        };

        // Store in sessionStorage
        sessionStorage.setItem("user_logged_in", "true");
        sessionStorage.setItem("access_token", data.access);
        sessionStorage.setItem("session_data", JSON.stringify(data));

        // Notify about user login state change
        window.dispatchEvent(new Event("userLoginChange"));
    } catch (storageError) {
        console.error("Storage error:", storageError);
      throw new Error("Failed to store session data");
    }
  }

  // Log errors securely (without sensitive data)
  logError(err) {
    console.error("Login error:", {
      type: err.name,
      message: err.message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 100) // Limit UA string length
    });
  }

  // Main login method
  async login(username, password, timeoutMs = 30000) {
    // Validate server URL
    if (!securityUtils.validateServerURL(serverUrl)) {
      throw new Error("Invalid server configuration");
    }

    // Abort any pending request
    if (this.abortController) {
      this.abortController.abort();
    }

    // Create new abort controller
    this.abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      if (this.abortController) {
        this.abortController.abort();
      }
    }, timeoutMs);

    try {
      // Encode credentials securely
      const credentials = securityUtils.encodeCredentials(username, password);
      const headers = this.createHeaders(credentials);

      // Make the API request
      const response = await fetch(`${serverUrl}/api/auth/token/`, {
        method: "POST",
        headers,
        signal: this.abortController.signal,
        credentials: 'same-origin',
        mode: 'cors',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.handleHTTPError(response);
      }

      const data = await response.json();
      this.storeSessionData(data);

      return data;

    } catch (err) {
      clearTimeout(timeoutId);
      this.logError(err);
      throw err;
    } finally {
      this.abortController = null;
    }
  }

  // Cleanup method
  cleanup() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

// Create singleton instance
export const authService = new AuthService();