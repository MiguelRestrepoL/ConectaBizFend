'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../api/auth';

const PAGE_LIMIT = 20;

const AuditPage = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_LIMIT);
  const [hasMore, setHasMore] = useState(false);
  const [usersCache, setUsersCache] = useState({});
  
  // Filtros
  const [entityType, setEntityType] = useState('all');
  const [action, setAction] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  useEffect(() => {
    loadAudits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, entityType, action, dateFrom, dateTo]);

  const fetchUserInfo = async (userId) => {
    if (usersCache[userId]) {
      return usersCache[userId];
    }

    try {
      const response = await api.get(`/auth/${userId}`);
      const userData = response.data.user;
      
      setUsersCache(prev => ({
        ...prev,
        [userId]: userData
      }));
      
      return userData;
    } catch (err) {
      console.error(`Error al obtener usuario ${userId}:`, err);
      return {
        id: userId,
        username: 'Usuario desconocido',
        email: ''
      };
    }
  };

  const loadAudits = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset)
      });

      // Si hay filtros activos, usar el endpoint /search
      const hasFilters = entityType !== 'all' || action !== 'all' || dateFrom || dateTo;
      
      if (hasFilters) {
        if (entityType !== 'all') params.append('entity_type', entityType);
        if (action !== 'all') params.append('action', action);
        if (dateFrom) params.append('from', new Date(dateFrom).toISOString());
        if (dateTo) {
          const endDate = new Date(dateTo);
          endDate.setHours(23, 59, 59, 999);
          params.append('to', endDate.toISOString());
        }
      }

      const endpoint = hasFilters ? `/audits/search?${params.toString()}` : `/audits?${params.toString()}`;
      const response = await api.get(endpoint);
      
      const data = response.data;
      const list = data.audits || [];
      
      // Obtener información de usuarios únicos
      const uniqueUserIds = [...new Set(list.map(audit => audit.user_id))];
      
      // Cargar información de usuarios en paralelo
      await Promise.all(
        uniqueUserIds.map(userId => fetchUserInfo(userId))
      );
      
      setAudits(list);
      setHasMore(list.length === limit);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al cargar auditorías');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setEntityType('all');
    setAction('all');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasActiveFilters = entityType !== 'all' || action !== 'all' || dateFrom || dateTo;

  const goPrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const goNext = () => {
    if (hasMore) setPage((p) => p + 1);
  };

  const formatDateTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  const getUsernameFromAudit = (audit) => {
    if (audit.user_id && usersCache[audit.user_id]) {
      return usersCache[audit.user_id].username;
    }
    
    if (audit.metadata?.username) {
      return audit.metadata.username;
    }
    if (audit.metadata?.user?.username) {
      return audit.metadata.user.username;
    }
    if (audit.username) {
      return audit.username;
    }
    
    return 'Cargando...';
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar activeItem="auditoria" />
      <div className="ml-0 md:ml-64">
        <Header userName="Usuario" />

        <main className="p-4 md:p-8 pt-20 md:pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Auditoría</h1>

              {/* Filtros responsive */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-3 flex-wrap">
                {/* Fila 1: Filtros principales */}
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 flex-1">
                  <select
                    value={entityType}
                    onChange={(e) => {
                      setEntityType(e.target.value);
                      setPage(1);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="client">Cliente</option>
                    <option value="pedido">Pedido</option>
                  </select>

                  <select
                    value={action}
                    onChange={(e) => {
                      setAction(e.target.value);
                      setPage(1);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todas las acciones</option>
                    <option value="create">Creación</option>
                  </select>

                  <select
                    value={limit}
                    onChange={(e) => {
                      setPage(1);
                      setLimit(parseInt(e.target.value, 10));
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                    <option value={50}>50 por página</option>
                  </select>
                </div>

                {/* Fila 2: Filtros de fecha */}
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 items-stretch sm:items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 whitespace-nowrap">Desde:</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        setPage(1);
                      }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 whitespace-nowrap">Hasta:</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        setPage(1);
                      }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors whitespace-nowrap"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Vista de tabla para desktop */}
            <div className="hidden lg:block overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entidad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metadata</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          <span>Cargando...</span>
                        </div>
                      </td>
                    </tr>
                  ) : audits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                        {hasActiveFilters ? 'No se encontraron registros con los filtros aplicados' : 'Sin registros'}
                      </td>
                    </tr>
                  ) : (
                    audits.map((a) => (
                      <tr key={`${a.id}-${a.created_at}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatDateTime(a.created_at)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          <span className="font-medium">{getUsernameFromAudit(a)}</span>
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {a.entity_type === 'client' ? 'Cliente' : a.entity_type === 'pedido' ? 'Pedido' : a.entity_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">#{a.entity_id}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {a.action === 'create' ? 'Creación' : a.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {a.metadata ? (
                            <details>
                              <summary className="cursor-pointer text-blue-600 hover:underline">Ver JSON</summary>
                              <pre className="mt-2 bg-gray-50 p-3 rounded text-xs overflow-auto max-h-48">
                                {JSON.stringify(a.metadata, null, 2)}
                              </pre>
                            </details>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Vista de tarjetas para móvil y tablet */}
            <div className="lg:hidden space-y-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Cargando...</span>
                  </div>
                </div>
              ) : audits.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {hasActiveFilters ? 'No se encontraron registros con los filtros aplicados' : 'Sin registros'}
                </div>
              ) : (
                audits.map((a) => (
                  <div key={`${a.id}-${a.created_at}`} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Fecha</p>
                          <p className="text-sm text-gray-900">{formatDateTime(a.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Usuario</p>
                          <p className="text-sm font-medium text-gray-900">{getUsernameFromAudit(a)}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tipo</p>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {a.entity_type === 'client' ? 'Cliente' : a.entity_type === 'pedido' ? 'Pedido' : a.entity_type}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Entidad</p>
                          <p className="text-sm text-gray-700">#{a.entity_id}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Acción</p>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {a.action === 'create' ? 'Creación' : a.action}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Metadata</p>
                        {a.metadata ? (
                          <details className="cursor-pointer">
                            <summary className="text-blue-600 hover:underline text-sm">Ver JSON</summary>
                            <pre className="mt-2 bg-gray-50 p-3 rounded text-xs overflow-auto max-h-48">
                              {JSON.stringify(a.metadata, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Paginación */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={goPrev}
                disabled={loading || page === 1}
                className={`w-full sm:w-auto px-4 py-2 rounded border text-sm transition-colors ${
                  page === 1 || loading 
                    ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>

              <span className="text-sm text-gray-600">
                Página {page} {audits.length > 0 && `• ${audits.length} registros`}
              </span>

              <button
                onClick={goNext}
                disabled={loading || !hasMore}
                className={`w-full sm:w-auto px-4 py-2 rounded border text-sm transition-colors ${
                  !hasMore || loading 
                    ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditPage;