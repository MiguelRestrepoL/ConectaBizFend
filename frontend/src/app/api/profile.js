import api from './auth';

// Servicios de perfil de usuario
export const profileService = {
  // Actualizar perfil de usuario
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/auth/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar el perfil');
    }
  },

  // Cambiar contraseña
  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.put(`/auth/${userId}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al cambiar la contraseña');
    }
  },

  // Activar 2FA por correo
  activateEmail2FA: async (userId, email) => {
    try {
      const response = await api.post(`/users/${userId}/2fa/email`, { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al activar 2FA por correo');
    }
  },

  // Activar 2FA por aplicación
  activateApp2FA: async (userId, phoneNumber) => {
    try {
      const response = await api.post(`/users/${userId}/2fa/app`, { phoneNumber });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al activar 2FA por aplicación');
    }
  },

  // Obtener perfil de usuario
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/auth/${userId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener el perfil');
    }
  },

  // Desactivar 2FA
  deactivate2FA: async (userId, type) => {
    try {
      const response = await api.delete(`/users/${userId}/2fa/${type}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al desactivar 2FA');
    }
  }
};

export default profileService;
