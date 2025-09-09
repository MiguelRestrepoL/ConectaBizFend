import React, { useState, useEffect } from 'react';
import ClientCard from './ClientCard';
import DeleteConfirmModal from './DeleteConfirmModal';
import { getClients, deleteClient } from '../api/clients';

const ClientList = ({ onEdit, onView, refreshTrigger }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalClients: 0,
    limit: 12
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    client: null,
    loading: false
  });

  // Cargar clientes
  const loadClients = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getClients({
        page,
        limit: pagination.limit,
        search
      });
      
      if (result.success) {
        const data = result.data;
        setClients(data.clients || data.data || []);
        setPagination(prev => ({
          ...prev,
          currentPage: data.currentPage || data.page || page,
          totalPages: data.totalPages || Math.ceil((data.totalClients || data.total || 0) / pagination.limit),
          totalClients: data.totalClients || data.total || 0
        }));
      } else {
        // Manejo específico de errores de asociación
        if (result.error && result.error.includes('Association with alias "user" does not exist')) {
          setError('Error de configuración del servidor. Por favor, contacta al administrador.');
        } else {
          setError(result.error || 'Error al cargar clientes');
        }
      }
    } catch (err) {
      setError('Error de conexión al cargar clientes');
      setDebugInfo({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (client) => {
    setDeleteModal({
      isOpen: true,
      client: client,
      loading: false
    });
  };

  // Cerrar modal de eliminación
  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      client: null,
      loading: false
    });
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    if (!deleteModal.client) return;

    setDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      const result = await deleteClient(deleteModal.client.id);
      
      if (result.success) {
        // Recargar la lista de clientes
        await loadClients(pagination.currentPage, searchTerm);
        
        // Cerrar modal
        setDeleteModal({
          isOpen: false,
          client: null,
          loading: false
        });
        
        // Mostrar mensaje de éxito
        alert('Cliente eliminado exitosamente');
      } else {
        alert('Error al eliminar cliente: ' + result.error);
        setDeleteModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      alert('Error al eliminar cliente');
      console.error('Error deleting client:', err);
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
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
      loadClients(1, value);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Manejar cambio de filtro
  const handleFilterChange = (value) => {
    setFilterBy(value);
    // TODO: Implementar filtros en el backend si es necesario
    // Por ahora solo filtramos en el frontend
  };

  // Filtrar clientes (solo para filtros que no están en el backend)
  const filteredClients = clients.filter(client => {
    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'marketing' && (client.recibe_emails_marketing || client.recibe_sms_marketing)) ||
      (filterBy === 'taxes' && client.recaudar_impuestos);

    return matchesFilter;
  });

  // Función para probar la conexión con el backend
  const testBackendConnection = async () => {
    try {
      console.log('Probando conexión con el backend...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ Conexión con backend exitosa');
        const userData = await response.json();
        console.log('Usuario actual:', userData);
      } else {
        console.log('❌ Error en autenticación:', response.status, response.statusText);
      }
    } catch (error) {
      console.log('❌ Error de conexión:', error);
    }
  };

  // Cargar clientes al montar el componente y cuando cambie refreshTrigger
  useEffect(() => {
    loadClients(pagination.currentPage, searchTerm);
    // Probar conexión en desarrollo
    if (process.env.NODE_ENV === 'development') {
      testBackendConnection();
    }
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
      loadClients(page, searchTerm);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar clientes</h3>
        <p className="text-red-600 mb-4">{error}</p>
        
        {/* Información de debug */}
        {debugInfo && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
            <details>
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Información técnica (click para expandir)
              </summary>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={() => loadClients(pagination.currentPage, searchTerm)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
          <button
            onClick={() => {
              setError(null);
              setDebugInfo(null);
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
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos los clientes</option>
              <option value="marketing">Con marketing</option>
              <option value="taxes">Con impuestos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{pagination.totalClients}</p>
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
              <p className="text-sm font-medium text-gray-500">Con Marketing</p>
              <p className="text-2xl font-semibold text-gray-900">
                {clients.filter(c => c.recibe_emails_marketing || c.recibe_sms_marketing).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Con Impuestos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {clients.filter(c => c.recaudar_impuestos).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterBy !== 'all' ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterBy !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza agregando tu primer cliente'
            }
          </p>
          {!searchTerm && filterBy === 'all' && (
            <a
              href="/agregar-cliente"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block"
            >
              Agregar primer cliente
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={onEdit}
              onDelete={handleDeleteClick}
              onView={onView}
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
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalClients)} de{' '}
              {pagination.totalClients} clientes
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
                        ? 'bg-purple-600 text-white'
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

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        client={deleteModal.client}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default ClientList;
