import api from './auth.js';

/* ============================================================
   🟢 CREAR PRODUCTO
   ============================================================ */
export const createProduct = async (productData) => {
  try {
    console.log('Enviando datos del producto:', productData);
    
    const response = await api.post('/productos', productData);
    
    console.log('Producto creado exitosamente:', response.data);
    return {
      success: true,
      data: response.data,
      message: 'Producto creado exitosamente'
    };
  } catch (error) {
    console.error('Error al crear producto:', error);
    
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.error || error.response.data?.message || 'Error del servidor',
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

/* ============================================================
   🔵 OBTENER TODOS LOS PRODUCTOS (con filtros y paginación)
   ============================================================ */
export const getProducts = async (options = {}) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      includeInactive = false,
      proveedorId = null
    } = options;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search: search.trim() }),
      ...(includeInactive && { includeInactive: 'true' }),
      ...(proveedorId && { proveedorId: proveedorId.toString() })
    });

    const response = await api.get(`/productos?${params.toString()}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al obtener productos'
    };
  }
};

/* ============================================================
   🟣 OBTENER PRODUCTO POR ID
   ============================================================ */
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/productos/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al obtener producto'
    };
  }
};

/* ============================================================
   🟡 ACTUALIZAR PRODUCTO
   ============================================================ */
export const updateProduct = async (id, productData) => {
  try {
    console.log('Actualizando producto:', id, productData);
    const response = await api.put(`/productos/${id}`, productData);
    return {
      success: true,
      data: response.data,
      message: 'Producto actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al actualizar producto'
    };
  }
};

/* ============================================================
   🔴 ELIMINAR PRODUCTO (Soft delete)
   ============================================================ */
export const deleteProduct = async (id) => {
  try {
    await api.delete(`/productos/${id}`);
    return {
      success: true,
      message: 'Producto eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al eliminar producto'
    };
  }
};

/* ============================================================
   🟠 ACTUALIZAR STOCK DEL PRODUCTO
   ============================================================ */
export const updateProductStock = async (id, cantidad, operation = 'subtract') => {
  try {
    console.log(`Actualizando stock del producto ${id}: ${operation} ${cantidad}`);
    
    const response = await api.patch(`/productos/${id}/stock`, {
      cantidad,
      operation // 'subtract', 'add', 'set'
    });
    
    return {
      success: true,
      data: response.data,
      message: 'Stock actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al actualizar stock'
    };
  }
};

/* ============================================================
   🔵 OBTENER PRODUCTOS CON STOCK BAJO
   ============================================================ */
export const getProductsStockBajo = async () => {
  try {
    const response = await api.get('/productos/stock-bajo');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al obtener productos'
    };
  }
};

/* ============================================================
   📤 EXPORTAR TODAS LAS FUNCIONES
   ============================================================ */
export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getProductsStockBajo
};