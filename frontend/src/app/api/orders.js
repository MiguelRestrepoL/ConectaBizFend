import api from './auth.js';

// Función para crear un pedido
export const createOrder = async (orderData) => {
  try {
    console.log('Enviando datos del pedido:', orderData);
    
    const response = await api.post('/pedidos', orderData);
    
    console.log('Pedido creado exitosamente:', response.data);
    return {
      success: true,
      data: response.data,
      message: 'Pedido creado exitosamente'
    };
  } catch (error) {
    console.error('Error al crear pedido:', error);
    
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

// Función para obtener todos los pedidos
export const getOrders = async (options = {}) => {
  try {
    const { page = 1, limit = 10, search = '' } = options;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search: search.trim() })
    });

    const response = await api.get(`/pedidos?${params.toString()}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al obtener pedidos'
    };
  }
};

// Función para obtener un pedido por ID
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/pedidos/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener pedido'
    };
  }
};

// Función para actualizar un pedido
export const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(`/pedidos/${id}`, orderData);
    return {
      success: true,
      data: response.data,
      message: 'Pedido actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al actualizar pedido'
    };
  }
};

// Función para eliminar un pedido
export const deleteOrder = async (id) => {
  try {
    await api.delete(`/pedidos/${id}`);
    return {
      success: true,
      message: 'Pedido eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al eliminar pedido'
    };
  }
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};
