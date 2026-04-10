import apiClient from './client';
import { LoginInput } from '../../validation/loginValidation'
import { RegisterInput } from '../../validation/registerValidation';

export const authAPI = {
  register: async (data: RegisterInput) => {
    const response = await apiClient.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  login: async (data: LoginInput) => {
    console.log('Attempting login with:', data);
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};