import api from './auth.js';
 
// ✅ CREAR PROVEEDOR
export const createProveedor = async (proveedorData) => {
  try {
    const response = await api.post('/proveedores', proveedorData);
    return {
      success: true,
      data: response.data,
      message: 'Proveedor creado exitosamente'
    };
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al crear proveedor'
    };
  }
};
 
// ✅ OBTENER TODOS LOS PROVEEDORES
export const getProveedores = async (options = {}) => {
  try {
    const { page = 1, limit = 12, search = '', includeInactive = true } = options;
 
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      includeInactive: includeInactive.toString()
    });
 
    if (search.trim()) {
      params.append('search', search.trim());
    }
 
    const response = await api.get(`/proveedores?${params.toString()}`);
 
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al obtener proveedores'
    };
  }
};
 
// ✅ OBTENER PROVEEDOR POR ID
export const getProveedorById = async (id) => {
  try {
    const response = await api.get(`/proveedores/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al obtener proveedor'
    };
  }
};
 
// ✅ ACTUALIZAR PROVEEDOR
export const updateProveedor = async (id, proveedorData) => {
  try {
    const response = await api.put(`/proveedores/${id}`, proveedorData);
    return {
      success: true,
      data: response.data,
      message: 'Proveedor actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al actualizar proveedor'
    };
  }
};
 
// ✅ ELIMINAR PROVEEDOR (soft delete vía activo)
export const deleteProveedor = async (id) => {
  try {
    const response = await api.delete(`/proveedores/${id}`);
    return {
      success: true,
      data: response.data,
      message: 'Proveedor eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al eliminar proveedor'
    };
  }
};
 
// ✅ ACTIVAR / DESACTIVAR PROVEEDOR
export const updateProveedorEstado = async (id, activo) => {
  try {
    const response = await api.put(`/proveedores/${id}`, { activo });
    return {
      success: true,
      data: response.data,
      message: activo ? 'Proveedor activado exitosamente' : 'Proveedor desactivado exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar estado del proveedor:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al actualizar estado del proveedor'
    };
  }
};
 
export default {
  createProveedor,
  getProveedores,
  getProveedorById,
  updateProveedor,
  deleteProveedor,
  updateProveedorEstado
};
 