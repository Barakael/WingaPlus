// frontend/src/services/auth.ts
import { BASE_URL } from '../components/api/api';

export const login = async (credentials: any) => {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = 'Invalid email or password';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If we can't parse the error, use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error instead of returning null
  }
};

export const register = async (userData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = 'Registration failed. Please try again';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          // Handle validation errors
          const errors = Object.values(errorData.errors).flat();
          errorMessage = errors[0] as string || errorMessage;
        }
      } catch (e) {
        // If we can't parse the error, use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Include flag for shop setup scenario
    if (data.needs_shop_setup) {
      localStorage.setItem('needs_shop_setup', 'true');
    } else {
      localStorage.removeItem('needs_shop_setup');
    }
    return data.user;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error instead of returning null
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('needs_shop_setup');
};

export const getUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Token invalid, logout
      logout();
      return null;
    }

    const user = await response.json();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    logout();
    return null;
  }
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const needsShopSetup = () => localStorage.getItem('needs_shop_setup') === 'true';

export const requestPasswordReset = async (email: string) => {
  const response = await fetch(`${BASE_URL}/api/password/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to request reset');
  return data;
};

export const resetPassword = async (payload: { email: string; token: string; password: string; password_confirmation: string }) => {
  const response = await fetch(`${BASE_URL}/api/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to reset password');
  return data;
};
