import apiClient from './client';

export const oauthAPI = {
  getGoogleLoginURL: () => {
    return `${process.env.NEXT_PUBLIC_API_URL}/oauth/google`;
  },

  // Handle callback
  handleGoogleCallback: async (token: string, user: any) => {
    return {
      token,
      user,
    };
  },

  // Get auth status
  getAuthStatus: async () => {
    const response = await apiClient.get('/oauth/status');
    return response.data;
  },
};