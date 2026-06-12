import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/api/auth/login', { email, password });
          const { token, data } = res.data;
          set({ user: data.user, token, isAuthenticated: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return { success: true, user: data.user };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/api/auth/register', data);
          const { token, data: resData } = res.data;
          set({ user: resData.user, token, isAuthenticated: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete api.defaults.headers.common['Authorization'];
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      initAuth: () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }),
    {
      name: 'revenio-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
