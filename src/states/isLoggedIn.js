import { create } from 'zustand';

const useAuthStore = create((set) => ({

  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isTwoFactorRequired: false, 

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email === '' && credentials.password === '') {
            resolve({ needsTwoFactor: true });
          } else {
            reject(new Error('Credenciales inválidas'));
          }
        }, 1000);
      });

      if (response.needsTwoFactor) {
        set({ isTwoFactorRequired: true, isLoading: false });
      } else {
        set({ user: { email: credentials.email }, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  verifyTwoFactor: async (token) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (token === '') {
            resolve({ user: { email: '', twoFactorEnabled: true } });
          } else {
            reject(new Error('Código 2FA inválido'));
          }
        }, 1000);
      });
      set({
        user: { email: 'test@example.com', twoFactorEnabled: true },
        isAuthenticated: true,
        isTwoFactorRequired: false,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false, isTwoFactorRequired: true });
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isTwoFactorRequired: false,
    });
  },
}));

export default useAuthStore;