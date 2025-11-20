'use client';

import React, { useState, useEffect } from 'react';

// Simulación de OrderCard (reemplaza con tu import real)
const OrderCard = ({ order, onEdit, onDelete, onView }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
    <h3 className="font-bold text-gray-900">{order.titulo}</h3>
    <div className="flex gap-2 mt-2">
      <button onClick={() => onView(order)} className="px-3 py-1 bg-blue-500 text-white rounded">Ver</button>
      <button onClick={() => onEdit(order)} className="px-3 py-1 bg-green-500 text-white rounded">Editar</button>
      <button onClick={() => onDelete(order)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
    </div>
  </div>
);

const OrderViewModal = ({ order, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
      <h2 className="text-xl font-bold mb-4">{order.titulo}</h2>
      <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded">Cerrar</button>
    </div>
  </div>
);

const DeleteOrderModal = ({ order, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">¿Eliminar pedido?</h2>
      <p className="mb-6">¿Estás seguro de eliminar "{order.titulo}"?</p>
      <div className="flex gap-3">
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
      </div>
    </div>
  </div>
);

const OrderList = ({ refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Simular API
  useEffect(() => {
    loadOrders();
  }, [refreshTrigger, currentPage, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulación de datos
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockOrders = [
        {
          id: 1,
          titulo: 'Pedido Premium #001',
          estado: 'preparando',
          cliente: { persona_natural: { nombre: 'Juan', apellido: 'Pérez' } },
          fecha_entrega: '2025-12-01',
          monto_total_pagado: 1500000,
          monto_recibido_sin_iva: 1260504,
          productos: [
            { nombre: 'Laptop Dell', PedidoProducto: { cantidad: 2 } },
            { nombre: 'Mouse Logitech', PedidoProducto: { cantidad: 5 } }
          ]
        },
        {
          id: 2,
          titulo: 'Pedido Express #002',
          estado: 'enviado',
          cliente: { persona_juridica: { razon_social: 'Tech Corp' } },
          fecha_entrega: '2025-11-25',
          monto_total_pagado: 850000,
          monto_recibido_sin_iva: 714286,
          productos: [
            { nombre: 'Teclado Mecánico', PedidoProducto: { cantidad: 10 } }
          ]
        }
      ];

      setOrders(mockOrders);
      setTotalPages(1);
    } catch (err) {
      setError('Error inesperado al cargar pedidos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order) => {
    console.log('Editar:', order);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    alert(`Pedido ${orderToDelete.id} eliminado`);
    setShowDeleteModal(false);
    setOrderToDelete(null);
    loadOrders();
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadOrders();
  };

  // Renderizado de estados
  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-700 font-semibold">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-red-900 text-lg">Error al cargar</h3>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
        <button
          onClick={loadOrders}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar pedidos por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-medium"
              />
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filtro de Estado */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-medium cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="preparando">Preparando</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          {/* Botón Buscar */}
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {orders.length === 0 ? (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-12 text-center">
          <svg className="w-20 h-20 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No hay pedidos disponibles
          </h3>
          <p className="text-gray-700 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'No se encontraron pedidos con los filtros aplicados'
              : 'Comienza agregando tu primer pedido'}
          </p>
          <button
            onClick={() => console.log('Ir a agregar pedido')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Primer Pedido
          </button>
        </div>
      ) : (
        <>
          {/* Grid de Pedidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onView={handleView}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-800"
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white border-2 border-gray-300 text-gray-800 hover:bg-blue-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-gray-600 font-bold">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-800"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Modales */}
      {showViewModal && selectedOrder && (
        <OrderViewModal
          order={selectedOrder}
          onClose={() => {
            setShowViewModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showDeleteModal && orderToDelete && (
        <DeleteOrderModal
          order={orderToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setOrderToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default OrderList;