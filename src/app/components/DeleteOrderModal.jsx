import React from 'react';

const DeleteOrderModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  order = null,
  loading = false 
}) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparando':
        return 'bg-yellow-100 text-yellow-800';
      case 'enviado':
        return 'bg-blue-100 text-blue-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'preparando':
        return 'Preparando';
      case 'enviado':
        return 'Enviado';
      case 'entregado':
        return 'Entregado';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800">
                Eliminar Pedido
              </h3>
              <p className="text-sm text-red-600">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Warning Message */}
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">
                    ¿Estás seguro de que quieres eliminar este pedido?
                  </h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    Se eliminará permanentemente toda la información relacionada con este pedido, incluyendo datos financieros y de entrega.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Detalles del pedido a eliminar:</h4>
            
            <div className="space-y-2">
              {/* Order Title and ID */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{order.titulo}</p>
                  <p className="text-xs text-gray-500">ID: #{order.id}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                  {getStatusLabel(order.estado)}
                </span>
              </div>

              {/* Client Info */}
              {order.cliente && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Cliente:</span> {order.cliente.nombre} {order.cliente.apellido}
                  </p>
                  <p className="text-xs text-gray-500">{order.cliente.correo_electronico}</p>
                </div>
              )}

              {/* Financial Info */}
              <div className="pt-2 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Pagado:</span>
                    <p className="font-medium text-green-600">{formatCurrency(order.monto_total_pagado)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Recibido (-IVA):</span>
                    <p className="font-medium text-blue-600">{formatCurrency(order.monto_recibido_sin_iva)}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fecha de entrega:</span> {formatDate(order.fecha_entrega)}
                </p>
              </div>
            </div>
          </div>

          {/* Consequences */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-red-800 mb-2">Consecuencias de esta acción:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Se eliminará permanentemente toda la información del pedido
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Se perderán todos los datos financieros asociados
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                No se podrá recuperar la información eliminada
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Eliminando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar Pedido
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrderModal;
