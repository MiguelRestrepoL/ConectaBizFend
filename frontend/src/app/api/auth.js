import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Login con email y contraseña
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al registrar usuario');
    }
  },

  // Login con Google
  loginWithGoogle: async (googleToken) => {
    try {
      const response = await api.post('/auth/google', {
        token: googleToken,
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión con Google');
    }
  },

  // Login con Microsoft
  loginWithMicrosoft: async (microsoftToken) => {
    try {
      const response = await api.post('/auth/microsoft', {
        token: microsoftToken,
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión con Microsoft');
    }
  },

  // Login con teléfono
  loginWithPhone: async (phoneNumber) => {
    try {
      const response = await api.post('/auth/phone', {
        phone: phoneNumber,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al enviar código de verificación');
    }
  },

  // Verificar código de teléfono
  verifyPhoneCode: async (phoneNumber, code) => {
    try {
      const response = await api.post('/auth/verify-phone', {
        phone: phoneNumber,
        code,
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Código de verificación inválido');
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener información del usuario');
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Aceptar términos y condiciones
  acceptTerms: async (userId) => {
    try {
      const response = await api.post(`/auth/${userId}/accept-terms`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al aceptar términos y condiciones');
    }
  },
};

export default api;
