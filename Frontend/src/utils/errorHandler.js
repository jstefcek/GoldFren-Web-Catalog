export const getErrorMessage = (err, t) => {
  // Handle different error types
  if (err.name === 'AbortError') {
    return t("login_screen.timeout_error") || "Request timed out. Please try again.";
  } else if (err.message === 'Rate limit exceeded') {
    return t("login_screen.rate_limit_server") || "Too many requests. Please try again later.";
  } else if (err.message === 'Invalid credentials') {
    return t("login_screen.invalid_credentials") || "Invalid username or password.";
  } else if (err.message === 'Server error') {
    return t("login_screen.server_error") || "Server temporarily unavailable. Please try again.";
  } else {
    return t("login_screen.login_error") || "Login failed. Please try again.";
  }
};

export const getRateLimitErrorMessage = (remainingTime, t) => {
  return t("login_screen.rate_limit_error", { minutes: remainingTime }) || 
    `Too many failed attempts. Please try again in ${remainingTime} minutes.`;
};