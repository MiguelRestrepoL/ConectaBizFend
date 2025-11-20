import api from './auth.js';

// ✅ CREAR CLIENTE - Cambiado de addClient a createClient
export const createClient = async (clientData) => {
  try {
    console.log('Creando cliente:', clientData);

    const response = await api.post('/clients', clientData);

    return {
      success: true,
      data: response.data,
      message: 'Cliente creado exitosamente'
    };
  } catch (error) {
    console.error('Error al crear cliente:', error);

    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || error.response.data?.error || 'Error del servidor',
        status: error.response.status
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Error de conexión. Verifica que el servidor esté funcionando.'
      };
    } else {
      return {
        success: false,
        error: error.message || 'Error desconocido'
      };
    }
  }
};

// ✅ OBTENER TODOS LOS CLIENTES
export const getClients = async (options = {}) => {
  try {
    const { page = 1, limit = 10, search = '', includeInactive = true } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      includeInactive: includeInactive.toString()
    });

    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await api.get(`/clients?${params.toString()}`);

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al obtener clientes'
    };
  }
};

// ✅ OBTENER CLIENTE POR ID
export const getClientById = async (id) => {
  try {
    const response = await api.get(`/clients/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Error al obtener cliente'
    };
  }
};

// ✅ ACTUALIZAR CLIENTE
export const updateClient = async (id, clientData) => {
  try {
    console.log('Actualizando cliente:', id, clientData);
    
    const response = await api.put(`/clients/${id}`, clientData);
    
    return {
      success: true,
      data: response.data,
      message: 'Cliente actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Error al actualizar cliente'
    };
  }
};

// ✅ ELIMINAR CLIENTE (Soft delete)
export const deleteClient = async (id) => {
  try {
    const response = await api.delete(`/clients/${id}`);
    
    return {
      success: true,
      data: response.data,
      message: 'Cliente eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Error al eliminar cliente'
    };
  }
};

// ✅ ACTUALIZAR ESTADO DEL CLIENTE
export const updateClientState = async (clientId, state) => {
  try {
    const response = await api.patch(`/clients/${clientId}/state`, {
      state: state
    });

    return {
      success: true,
      data: response.data,
      message: state ? 'Cliente activado exitosamente' : 'Cliente desactivado exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar estado del cliente:', error);
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al actualizar estado del cliente'
    };
  }
};

// Exportación por defecto
export default {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  updateClientState
};