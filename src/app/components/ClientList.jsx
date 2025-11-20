'use client';

import React, { useState, useEffect } from 'react';
import ClientCard from './ClientCard';
import DeleteConfirmModal from './DeleteConfirmModal';
import ClientViewModal from './ClientViewModal';
import { getClients, deleteClient, updateClientState } from '../api/clients';

const ClientList = ({ onEdit, onView, refreshTrigger }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('activos');
  const [showFilters, setShowFilters] = useState(false);
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
    loading: false,
    isActivation: false
  });
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    client: null
  });

  const loadClients = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);

      const result = await getClients({
        page,
        limit: pagination.limit,
        search,
        includeInactive: true
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
        setError(result.error || 'Error al cargar clientes');
      }
    } catch (err) {
      setError('Error de conexión al cargar clientes');
      setDebugInfo({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (client) => {
    setDeleteModal({
      isOpen: true,
      client: client,
      loading: false,
      isActivation: !client.state
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      client: null,
      loading: false,
      isActivation: false
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.client) return;

    setDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      let result;
      
      if (deleteModal.isActivation) {
        result = await updateClientState(deleteModal.client.id, true);
      } else {
        result = await deleteClient(deleteModal.client.id);
      }

      if (result.success) {
        await loadClients(pagination.currentPage, searchTerm);

        setDeleteModal({
          isOpen: false,
          client: null,
          loading: false,
          isActivation: false
        });

        const message = deleteModal.isActivation 
          ? 'Cliente activado exitosamente' 
          : 'Cliente desactivado exitosamente';
        alert(message);
      } else {
        const errorMsg = deleteModal.isActivation 
          ? 'Error al activar cliente: ' 
          : 'Error al desactivar cliente: ';
        alert(errorMsg + result.error);
        setDeleteModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      const errorMsg = deleteModal.isActivation 
        ? 'Error al activar cliente' 
        : 'Error al desactivar cliente';
      alert(errorMsg);
      console.error('Error updating client state:', err);
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleViewClick = (client) => {
    setViewModal({
      isOpen: true,
      client: client
    });
  };

  const handleViewClose = () => {
    setViewModal({
      isOpen: false,
      client: null
    });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      loadClients(1, value);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const filteredClients = clients.filter(client => {
    if (filterBy === 'activos') {
      return client.state === true;
    }
    if (filterBy === 'inactivos') {
      return client.state === false;
    }
    return true;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterBy('activos');
  };

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

  useEffect(() => {
    loadClients(pagination.currentPage, searchTerm);
    
    if (process.env.NODE_ENV === 'development') {
      testBackendConnection();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-16">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4" 
            style={{ width: '48px', height: '48px' }}
          ></div>
          <p className="text-gray-600 text-sm sm:text-base">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-1 text-sm sm:text-base">Error al cargar clientes</h3>
            <p className="text-red-600 text-xs sm:text-sm mb-3">{error}</p>

            {debugInfo && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
                <details>
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2 text-xs sm:text-sm">
                    Información técnica (click para expandir)
                  </summary>
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => loadClients(pagination.currentPage, searchTerm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
              >
                Reintentar
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setDebugInfo(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeCount = clients.filter(c => c.state === true).length;
  const inactiveCount = clients.filter(c => c.state === false).length;
  const marketingCount = clients.filter(c => c.recibe_emails_marketing || c.recibe_sms_marketing).length;
  const noMarketingCount = clients.filter(c => !c.recibe_emails_marketing && !c.recibe_sms_marketing).length;
  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* HEADER: Búsqueda + Filtros + Estadísticas */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
        
        {/* Barra de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono o NIT..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Botón de filtros (móvil) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium">Filtros</span>
            {filterBy !== 'activos' && (
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
            )}
          </button>

          {/* Filtros (desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={filterBy}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              <option value="activos">Clientes activos ({activeCount})</option>
              <option value="inactivos">Clientes inactivos ({inactiveCount})</option>
              <option value="all">Todos los clientes ({clients.length})</option>
            </select>
            
            {(searchTerm || filterBy !== 'activos') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 sm:py-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros expandible (móvil) */}
        {showFilters && (
          <div className="sm:hidden space-y-3 pt-4 border-t border-gray-200">
            <select
              value={filterBy}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="activos">Clientes activos ({activeCount})</option>
              <option value="inactivos">Clientes inactivos ({inactiveCount})</option>
              <option value="all">Todos los clientes ({clients.length})</option>
            </select>
            
            {(searchTerm || filterBy !== 'activos') && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-sm font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-blue-600 font-medium truncate">Activos</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-red-600 font-medium truncate">Inactivos</p>
                <p className="text-lg sm:text-2xl font-bold text-red-700">{inactiveCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-green-600 font-medium truncate">Marketing</p>
                <p className="text-lg sm:text-2xl font-bold text-green-700">{marketingCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE CLIENTES */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 sm:p-12 text-center">
          <svg 
            className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            {searchTerm || filterBy !== 'activos' ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            {searchTerm || filterBy !== 'activos'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer cliente'
            }
          </p>
          {searchTerm || filterBy !== 'activos' ? (
            <button
              onClick={clearFilters}
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              Limpiar filtros
            </button>
          ) : (
            <a
              href="/agregar-cliente"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              Agregar primer cliente
            </a>
          )}
        </div>
      ) : (
        <React.Fragment>
          <div className="flex items-center justify-between px-1">
            <p className="text-xs sm:text-sm text-gray-600">
              Mostrando <span className="font-semibold">{filteredClients.length}</span> de <span className="font-semibold">{clients.length}</span> clientes
              {filterBy !== 'all' && <span className="text-gray-500"> ({filterBy})</span>}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onView={handleViewClick}
                onEdit={onEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </React.Fragment>
      )}

      {/* PAGINACIÓN */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              <span>
                Mostrando {filteredClients.length > 0 ? 1 : 0} a {filteredClients.length} de {filteredClients.length} clientes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={pagination.currentPage === 1}
                className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Página anterior"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="hidden sm:flex gap-1">
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

              <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700">
                Página {pagination.currentPage} de {pagination.totalPages}
              </div>

              <button
                onClick={goToNextPage}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Página siguiente"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALES */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        client={deleteModal.client}
        loading={deleteModal.loading}
        isActivation={deleteModal.isActivation}
      />

      <ClientViewModal
        isOpen={viewModal.isOpen}
        onClose={handleViewClose}
        client={viewModal.client}
      />
    </div>
  );
};

export default ClientList;