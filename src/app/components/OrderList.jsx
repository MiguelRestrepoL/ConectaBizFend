'use client';

import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import OrderViewModal from './OrderViewModal';
import DeleteOrderModal from './DeleteOrderModal';
import { getOrders, deleteOrder } from '../api/orders';

const OrderList = ({ refreshTrigger = 0 }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  // Estados de modales
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Cargar pedidos desde API usando la función correcta
  useEffect(() => {
    loadOrders();
  }, [refreshTrigger]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar la función getOrders de tu API
      const result = await getOrders({ limit: 1000 });

      if (result.success) {
        // Manejar la estructura de respuesta de tu API
        const ordersData = result.data.pedidos || result.data.data || result.data;
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } else {
        throw new Error(result.error || 'Error al cargar los pedidos');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pedidos cuando cambian búsqueda o filtro
  useEffect(() => {
    let result = [...orders];

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.titulo?.toLowerCase().includes(term) ||
        order.cliente?.nombre?.toLowerCase().includes(term) ||
        order.id?.toString().includes(term)
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'todos') {
      result = result.filter(order => 
        order.estado?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  // Handlers de acciones
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEdit = (order) => {
    window.location.href = `/editar-pedido/${order.id}`;
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Usar la función deleteOrder de tu API
      const result = await deleteOrder(selectedOrder.id);

      if (result.success) {
        // Recargar lista
        await loadOrders();
        setIsDeleteModalOpen(false);
        setSelectedOrder(null);
      } else {
        throw new Error(result.error || 'Error al eliminar el pedido');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      alert(err.message || 'Error al eliminar el pedido');
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent" 
               style={{ width: '48px', height: '48px', margin: '0 auto 16px' }}>
          </div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <svg style={{ width: '24px', height: '24px' }} className="text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Error al cargar pedidos</h3>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={loadOrders}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
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
      
      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
        
        {/* Fila 1: Búsqueda (móvil full width, desktop con filtro en línea) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <svg 
                style={{ width: '20px', height: '20px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                className="text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por título, cliente o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                style={{ paddingLeft: '40px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px' }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  style={{ fontSize: '20px' }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Estado */}
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              style={{ padding: '10px 12px' }}
            >
              <option value="todos">Todos los estados</option>
              <option value="preparando">Preparando</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Fila 2: Resultados + Botón Crear (responsive) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{filteredOrders.length}</span> de {orders.length} pedidos
          </p>
          
          <button
            onClick={() => window.location.href = '/crear-pedido'}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            style={{ padding: '10px 20px' }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Pedido</span>
          </button>
        </div>
      </div>

      {/* GRID DE PEDIDOS */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 sm:p-12 text-center">
          <svg 
            style={{ width: '64px', height: '64px', margin: '0 auto 16px' }}
            className="text-gray-300"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay pedidos</h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchTerm || statusFilter !== 'todos' 
              ? 'No se encontraron pedidos con los filtros aplicados' 
              : 'Aún no has creado ningún pedido'}
          </p>
          {(searchTerm || statusFilter !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* MODALES */}
      {isViewModalOpen && selectedOrder && (
        <OrderViewModal
          order={selectedOrder}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {isDeleteModalOpen && selectedOrder && (
        <DeleteOrderModal
          order={selectedOrder}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedOrder(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default OrderList;