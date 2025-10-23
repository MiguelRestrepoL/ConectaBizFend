import React from 'react';

const OrderViewModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                📦
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {order.titulo}
                </h2>
                <p className="text-blue-100">
                  ID: #{order.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Información del pedido */}
            <div className="space-y-6">
              {/* Estado del pedido */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Estado del Pedido
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estado actual:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.estado)}`}>
                    {getStatusLabel(order.estado)}
                  </span>
                </div>
              </div>

              {/* Información del cliente */}
              {order.cliente && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Información del Cliente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {order.cliente.persona_natural ? "Nombre:" : "NIT:"}
                      </span>
                      <span className="ml-2">
                        {order.cliente.persona_natural
                          ? `${order.cliente.persona_natural.nombre} ${order.cliente.persona_natural.apellido}`
                          : order.cliente.persona_juridica?.nit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-blue-600">{order.cliente.correo_electronico}</span>
                    </div>
                    {order.cliente.numero_telefono && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Teléfono:</span>
                        <span className="font-medium">+{order.cliente.codigo_pais_telefono} {order.cliente.numero_telefono}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fechas importantes */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Fechas Importantes
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de entrega:</span>
                    <span className="font-medium">{formatDate(order.fecha_entrega)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de creación:</span>
                    <span className="font-medium">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última actualización:</span>
                    <span className="font-medium">{formatDate(order.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Información financiera y descripción */}
            <div className="space-y-6">
              {/* Información financiera */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Información Financiera
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Total Pagado:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(order.monto_total_pagado)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Recibido (-IVA):</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(order.monto_recibido_sin_iva)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">IVA Calculado:</span>
                    <span className="text-lg font-semibold text-gray-700">
                      {formatCurrency(order.monto_total_pagado - order.monto_recibido_sin_iva)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {order.descripcion && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Descripción del Pedido
                  </h3>
                  <div className="prose max-w-none">
                    <div
                      className="text-gray-700 bg-white p-4 rounded-lg border"
                      dangerouslySetInnerHTML={{ __html: order.descripcion }}
                    />
                  </div>
                </div>
              )}

              {/* Información del sistema */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Información del Sistema</h3>
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">ID del Pedido:</span> {order.id}
                  </div>
                  <div>
                    <span className="font-medium">Cliente ID:</span> {order.cliente_id}
                  </div>
                  <div>
                    <span className="font-medium">Creado:</span> {formatDate(order.created_at)}
                  </div>
                  <div>
                    <span className="font-medium">Actualizado:</span> {formatDate(order.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;
