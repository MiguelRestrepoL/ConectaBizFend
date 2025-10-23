import api from './auth.js';

// Función para agregar un cliente
export const addClient = async (clientData) => {
  try {
    console.log(clientData);

    const response = await api.post('/clients', clientData);

    return {
      success: true,
      data: response.data,
      message: 'Cliente creado exitosamente'
    };
  } catch (error) {
    console.error('Error al crear cliente:', error);

    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un código de error
      return {
        success: false,
        error: error.response.data?.message || 'Error del servidor',
        status: error.response.status
      };
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      return {
        success: false,
        error: 'Error de conexión. Verifica que el servidor esté funcionando.'
      };
    } else {
      // Algo más pasó
      return {
        success: false,
        error: error.message || 'Error desconocido'
      };
    }
  }
};

// Función para obtener todos los clientes
export const getClients = async (options = {}) => {
  try {
    const { page = 1, limit = 10, search = '', includeInactive = false } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      includeInactive: includeInactive.toString() // 👈 Siempre enviamos este parámetro
    });

    // Si hay texto de búsqueda, lo agregamos
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


// Función para obtener un cliente por ID
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
      error: error.response?.data?.message || 'Error al obtener cliente'
    };
  }
};

// Función para actualizar un cliente
export const updateClient = async (id, clientData) => {
  try {
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
      error: error.response?.data?.message || 'Error al actualizar cliente'
    };
  }
};

// Función para eliminar un cliente
export const deleteClient = async (id) => {
  try {
    await api.delete(`/clients/${id}`);
    return {
      success: true,
      message: 'Cliente eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al eliminar cliente'
    };
  }
};

export const updateClientState = async (clientId, state) => {
  try {
    const response = await api.patch(`/clients/${clientId}/state`, {
      state: state
    });

    return {
      success: true,
      data: response.data
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

export default {
  addClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  updateClientState
};
