'use client';
 
import React, { useState, useEffect } from 'react';
import ProveedorCard from './ProveedorCard';
import ProveedorViewModal from './ProveedorViewModal';
import DeleteProveedorModal from './DeleteProveedorModal';
import ProveedorFormModal from './ProveedorFormModal';
import { getProveedores, deleteProveedor, updateProveedorEstado } from '../api/proveedores';
 
const ProveedorList = ({ refreshTrigger }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('activos');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [localRefresh, setLocalRefresh] = useState(0);
 
  const [formModal, setFormModal] = useState({ isOpen: false, proveedor: null });
  const [viewModal, setViewModal] = useState({ isOpen: false, proveedor: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, proveedor: null, loading: false, isActivation: false });
 
  const loadProveedores = async (search = '') => {
    try {
      setLoading(true);
      setError(null);
 
      const result = await getProveedores({ page: 1, limit: 50, search, includeInactive: true });
 
      if (result.success) {
        const data = result.data;
        setProveedores(data.proveedores || data.data || []);
      } else {
        setError(result.error || 'Error al cargar proveedores');
      }
    } catch (err) {
      setError('Error de conexión al cargar proveedores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadProveedores(searchTerm);
  }, [refreshTrigger, localRefresh]);
 
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => loadProveedores(value), 500);
    setSearchTimeout(timeout);
  };
 
  useEffect(() => {
    return () => { if (searchTimeout) clearTimeout(searchTimeout); };
  }, [searchTimeout]);
 
  const handleFilterChange = (value) => setFilterBy(value);
 
  const clearFilters = () => {
    setSearchTerm('');
    setFilterBy('activos');
    loadProveedores('');
  };
 
  const filteredProveedores = proveedores.filter((p) => {
    if (filterBy === 'activos') return p.activo !== false;
    if (filterBy === 'inactivos') return p.activo === false;
    return true;
  });
 
  const activeCount = proveedores.filter((p) => p.activo !== false).length;
  const inactiveCount = proveedores.filter((p) => p.activo === false).length;
  const totalProductosAsociados = proveedores.reduce((acc, p) => acc + (p.productos?.length || 0), 0);
 
  // ── Handlers de modales ─────────────────────────────────────────────────
  const openCreate = () => setFormModal({ isOpen: true, proveedor: null });
  const openEdit = (proveedor) => setFormModal({ isOpen: true, proveedor });
  const closeForm = () => setFormModal({ isOpen: false, proveedor: null });
 
  const handleView = (proveedor) => setViewModal({ isOpen: true, proveedor });
  const closeView = () => setViewModal({ isOpen: false, proveedor: null });
 
  const handleDeleteClick = (proveedor) => {
    setDeleteModal({ isOpen: true, proveedor, loading: false, isActivation: proveedor.activo === false });
  };
  const closeDelete = () => setDeleteModal({ isOpen: false, proveedor: null, loading: false, isActivation: false });
 
  const confirmDelete = async () => {
    if (!deleteModal.proveedor) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
 
    try {
      const result = deleteModal.isActivation
        ? await updateProveedorEstado(deleteModal.proveedor.id, true)
        : await deleteProveedor(deleteModal.proveedor.id);
 
      if (result.success) {
        closeDelete();
        setLocalRefresh((p) => p + 1);
      } else {
        alert(result.error);
        setDeleteModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar la solicitud');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };
 
  // ── Estados de carga / error ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4" style={{ width: '48px', height: '48px' }}></div>
          <p className="text-gray-600 text-sm sm:text-base">Cargando proveedores...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-1 text-sm sm:text-base">Error al cargar proveedores</h3>
            <p className="text-red-600 text-xs sm:text-sm mb-3">{error}</p>
            <button
              onClick={() => loadProveedores(searchTerm)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="space-y-4 sm:space-y-6">
 
      {/* HEADER: Búsqueda + Filtros + Stats */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
 
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, contacto, correo..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            {searchTerm && (
              <button onClick={() => handleSearchChange('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
 
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium">Filtros</span>
            {filterBy !== 'activos' && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
          </button>
 
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={filterBy}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="activos">Proveedores activos ({activeCount})</option>
              <option value="inactivos">Proveedores inactivos ({inactiveCount})</option>
              <option value="all">Todos los proveedores ({proveedores.length})</option>
            </select>
 
            {(searchTerm || filterBy !== 'activos') && (
              <button onClick={clearFilters} className="px-4 py-2.5 sm:py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap">
                Limpiar
              </button>
            )}
          </div>
        </div>
 
        {showFilters && (
          <div className="sm:hidden space-y-3 pt-4 border-t border-gray-200">
            <select
              value={filterBy}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="activos">Proveedores activos ({activeCount})</option>
              <option value="inactivos">Proveedores inactivos ({inactiveCount})</option>
              <option value="all">Todos los proveedores ({proveedores.length})</option>
            </select>
            {(searchTerm || filterBy !== 'activos') && (
              <button onClick={clearFilters} className="w-full px-4 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium">
                Limpiar filtros
              </button>
            )}
          </div>
        )}
 
        {/* Stats */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-green-600 font-medium truncate">Productos asociados</p>
                <p className="text-lg sm:text-2xl font-bold text-green-700">{totalProductosAsociados}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* GRID DE PROVEEDORES */}
      {filteredProveedores.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 sm:p-12 text-center">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            {searchTerm || filterBy !== 'activos' ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            {searchTerm || filterBy !== 'activos' ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza agregando tu primer proveedor'}
          </p>
          {searchTerm || filterBy !== 'activos' ? (
            <button onClick={clearFilters} className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base">
              Limpiar filtros
            </button>
          ) : (
            <button onClick={openCreate} className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base">
              Agregar primer proveedor
            </button>
          )}
        </div>
      ) : (
        <React.Fragment>
          <div className="flex items-center justify-between px-1">
            <p className="text-xs sm:text-sm text-gray-600">
              Mostrando <span className="font-semibold">{filteredProveedores.length}</span> de <span className="font-semibold">{proveedores.length}</span> proveedores
              {filterBy !== 'all' && <span className="text-gray-500"> ({filterBy})</span>}
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProveedores.map((proveedor) => (
              <ProveedorCard
                key={proveedor.id}
                proveedor={proveedor}
                onView={handleView}
                onEdit={openEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </React.Fragment>
      )}
 
      {/* MODALES */}
      <ProveedorFormModal
        isOpen={formModal.isOpen}
        onClose={closeForm}
        proveedor={formModal.proveedor}
        onSaved={() => setLocalRefresh((p) => p + 1)}
      />
 
      <ProveedorViewModal
        isOpen={viewModal.isOpen}
        onClose={closeView}
        proveedor={viewModal.proveedor}
      />
 
      <DeleteProveedorModal
        isOpen={deleteModal.isOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        proveedor={deleteModal.proveedor}
        loading={deleteModal.loading}
        isActivation={deleteModal.isActivation}
      />
    </div>
  );
};
 
export default ProveedorList;