import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import DeleteOrderModal from './DeleteOrderModal';
import OrderViewModal from './OrderViewModal';
import AlertModal from './AlertModal';
import { getOrders, deleteOrder } from '../api/orders';

const OrderList = ({ onEdit, onView, refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 12
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [deleteOrderModal, setDeleteOrderModal] = useState({
    isOpen: false,
    order: null,
    loading: false
  });
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    order: null
  });
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Función helper para mostrar alertas
  const showAlert = (title, message, type = 'info') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Cargar pedidos
  const loadOrders = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getOrders({
        page,
        limit: pagination.limit,
        search
      });

      console.log('Resultado completo:', result);
      
      if (result.success) {
        const data = result.data;
        console.log('Datos de la respuesta:', data);
        
        // Manejar diferentes estructuras de respuesta
        let ordersArray = [];
        if (Array.isArray(data)) {
          // Si data es directamente un array
          ordersArray = data;
        } else if (data.orders && Array.isArray(data.orders)) {
          // Si data tiene una propiedad orders
          ordersArray = data.orders;
        } else if (data.data && Array.isArray(data.data)) {
          // Si data tiene una propiedad data
          ordersArray = data.data;
        } else if (data.pedidos && Array.isArray(data.pedidos)) {
          // Si data tiene una propiedad pedidos
          ordersArray = data.pedidos;
        }
        
        console.log('Array de pedidos extraído:', ordersArray);
        setOrders(ordersArray);
        
        setPagination(prev => ({
          ...prev,
          currentPage: data.currentPage || data.page || page,
          totalPages: data.totalPages || Math.ceil((data.totalOrders || data.total || ordersArray.length) / pagination.limit),
          totalOrders: data.totalOrders || data.total || ordersArray.length
        }));
      } else {
        // Manejo específico de errores de asociación
        if (result.error && result.error.includes('Association with alias "cliente" does not exist')) {
          setError('Error de configuración del servidor. Por favor, contacta al administrador.');
        } else {
          setError(result.error || 'Error al cargar pedidos');
        }
      }
    } catch (err) {
      setError('Error de conexión al cargar pedidos');
      setError({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (order) => {
    setDeleteOrderModal({
      isOpen: true,
      order: order,
      loading: false
    });
  };

  // Cerrar modal de eliminación
  const handleDeleteCancel = () => {
    setDeleteOrderModal({
      isOpen: false,
      order: null,
      loading: false
    });
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    if (!deleteOrderModal.order) return;

    setDeleteOrderModal(prev => ({ ...prev, loading: true }));

    try {
      const result = await deleteOrder(deleteOrderModal.order.id);
      
      if (result.success) {
        // Recargar la lista de pedidos
        await loadOrders(pagination.currentPage, searchTerm);
        
        // Cerrar modal
        setDeleteOrderModal({
          isOpen: false,
          order: null,
          loading: false
        });
        
        // Mostrar mensaje de éxito
        showAlert('Éxito', 'Pedido eliminado exitosamente', 'success');
      } else {
        showAlert('Error', 'Error al eliminar pedido: ' + result.error, 'error');
        setDeleteOrderModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      showAlert('Error', 'Error al eliminar pedido', 'error');
      console.error('Error deleting order:', err);
      setDeleteOrderModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Abrir modal de visualización
  const handleViewClick = (order) => {
    setViewModal({
      isOpen: true,
      order: order
    });
  };

  // Cerrar modal de visualización
  const handleViewClose = () => {
    setViewModal({
      isOpen: false,
      order: null
    });
  };

  // Manejar búsqueda con debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    
    // Limpiar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Crear nuevo timeout para búsqueda
    const timeout = setTimeout(() => {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      loadOrders(1, value);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Manejar cambio de filtro
  const handleFilterChange = (value) => {
    setFilterBy(value);
    // TODO: Implementar filtros en el backend si es necesario
    // Por ahora solo filtramos en el frontend
  };

  // Filtrar pedidos (solo para filtros que no están en el backend)
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'preparando' && order.estado === 'preparando') ||
      (filterBy === 'enviado' && order.estado === 'enviado') ||
      (filterBy === 'entregado' && order.estado === 'entregado');

    return matchesFilter;
  });

  // Cargar pedidos al montar el componente y cuando cambie refreshTrigger
  useEffect(() => {
    loadOrders(pagination.currentPage, searchTerm);
  }, [refreshTrigger]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Funciones de paginación
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadOrders(page, searchTerm);
    }
  };

  const goToNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      goToPage(pagination.currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      goToPage(pagination.currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar pedidos</h3>
        <p className="text-red-600 mb-4">{error}</p>
        
        <div className="flex space-x-2">
          <button
            onClick={() => loadOrders(pagination.currentPage, searchTerm)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
          <button
            onClick={() => {
              setError(null);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por título, cliente o ID..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los pedidos</option>
              <option value="preparando">Preparando</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{pagination.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Preparando</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.estado === 'preparando').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Enviado</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.estado === 'enviado').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Entregado</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.estado === 'entregado').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterBy !== 'all' ? 'No se encontraron pedidos' : 'No hay pedidos registrados'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterBy !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza creando tu primer pedido'
            }
          </p>
          {!searchTerm && filterBy === 'all' && (
            <a
              href="/crear-pedido"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              Crear primer pedido
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onEdit={onEdit}
              onDelete={handleDeleteClick}
              onView={handleViewClick}
            />
          ))}
        </div>
      )}

      {/* Controles de paginación */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Mostrando {((pagination.currentPage - 1) * pagination.limit) + 1} a{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalOrders)} de{' '}
              {pagination.totalOrders} pedidos
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Botón anterior */}
            <button
              onClick={goToPrevPage}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Números de página */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      pageNum === pagination.currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Botón siguiente */}
            <button
              onClick={goToNextPage}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación de pedido */}
      <DeleteOrderModal
        isOpen={deleteOrderModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        order={deleteOrderModal.order}
        loading={deleteOrderModal.loading}
      />

      {/* Modal de visualización de pedido */}
      <OrderViewModal
        isOpen={viewModal.isOpen}
        onClose={handleViewClose}
        order={viewModal.order}
      />

      {/* Modal de alerta */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};

export default OrderList;
