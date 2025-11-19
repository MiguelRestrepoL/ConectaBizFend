'use client';

import React from 'react';

const OrderCard = ({ 
  order, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Colores según estado
  const getStatusColor = (estado) => {
    const colors = {
      'preparando': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'enviado': 'bg-blue-100 text-blue-800 border-blue-200',
      'entregado': 'bg-green-100 text-green-800 border-green-200',
      'cancelado': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[estado?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Obtener nombre del cliente de forma segura
  const getClienteName = () => {
    if (!order.cliente) return 'Sin cliente';
    
    if (order.cliente.persona_natural) {
      const nombre = order.cliente.persona_natural.nombre || '';
      const apellido = order.cliente.persona_natural.apellido || '';
      return `${nombre} ${apellido}`.trim() || 'Sin nombre';
    }
    
    if (order.cliente.persona_juridica) {
      return order.cliente.persona_juridica.razon_social || order.cliente.persona_juridica.nit || 'Empresa';
    }
    
    if (order.cliente.nombre) {
      return order.cliente.nombre;
    }
    
    return 'Sin nombre';
  };

  // ✅ Handler para ir a seguimiento
  const handleTracking = () => {
    window.location.href = `/seguimiento/${order.id}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200">
      {/* Card Content */}
      <div style={{ padding: '16px' }} className="sm:p-6">
        
        {/* HEADER: Título + Estado + Acciones */}
        <div className="flex flex-col gap-3 mb-4">
          
          {/* Fila 1: Título + Acciones (móvil) */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-gray-900 truncate"
                style={{ fontSize: '16px' }}
                title={order.titulo}
              >
                {order.titulo}
              </h3>
            </div>

            {/* Botones de Acción - MÓVIL (solo iconos) */}
            <div className="flex sm:hidden items-center gap-1">
              {/* ✅ NUEVO: Botón Seguimiento */}
              <button
                onClick={handleTracking}
                className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors"
                title="Seguimiento"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </button>
              <button
                onClick={() => onView(order)}
                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver detalles"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(order)}
                className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                title="Editar"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(order)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <svg style={{ width: '18px', height: '18px' }} className="text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Fila 2: Estado + ID + Acciones Desktop */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Badge de Estado */}
              <span 
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.estado)}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {order.estado || 'Preparando'}
              </span>
              
              {/* ID del pedido */}
              <span className="text-xs text-gray-500" style={{ whiteSpace: 'nowrap' }}>
                ID: #{order.id}
              </span>
            </div>

            {/* Botones de Acción - DESKTOP (con texto) */}
            <div className="hidden sm:flex items-center gap-2">
              {/* ✅ NUEVO: Botón Seguimiento Desktop */}
              <button
                onClick={handleTracking}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-purple-50 rounded-lg transition-colors text-purple-600"
                style={{ fontSize: '13px' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="hidden md:inline">Seguimiento</span>
              </button>
              <button
                onClick={() => onView(order)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                style={{ fontSize: '13px' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden md:inline">Ver</span>
              </button>
              <button
                onClick={() => onEdit(order)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                style={{ fontSize: '13px' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden md:inline">Editar</span>
              </button>
              <button
                onClick={() => onDelete(order)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                style={{ fontSize: '13px' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden md:inline">Eliminar</span>
              </button>
            </div>
          </div>
        </div>

        {/* BODY: Info del Cliente */}
        <div className="space-y-2 mb-4">
          {/* Cliente */}
          <div className="flex items-center gap-2 text-gray-700">
            <svg style={{ width: '16px', height: '16px' }} className="flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm truncate font-medium" title={getClienteName()}>
              {getClienteName()}
            </span>
          </div>

          {/* Fecha de entrega */}
          {order.fecha_entrega && (
            <div className="flex items-center gap-2 text-gray-700">
              <svg style={{ width: '16px', height: '16px' }} className="flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">
                Entrega: {formatDate(order.fecha_entrega)}
              </span>
            </div>
          )}

          {/* Descripción (solo desktop) */}
          {order.descripcion && (
            <p className="hidden lg:block text-sm text-gray-600 line-clamp-2" title={order.descripcion}>
              {order.descripcion}
            </p>
          )}
        </div>

        {/* FOOTER: Montos */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* Total Pagado */}
          <div className="bg-green-50 rounded-lg border border-green-200 p-2.5 sm:p-3">
            <span className="text-xs text-gray-700 block mb-1 font-medium">Total Pagado</span>
            <span className="text-sm sm:text-base font-bold text-green-700 block truncate">
              {formatCurrency(order.monto_total_pagado)}
            </span>
          </div>

          {/* Sin IVA */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-2.5 sm:p-3">
            <span className="text-xs text-gray-700 block mb-1 font-medium">Sin IVA</span>
            <span className="text-sm sm:text-base font-bold text-blue-700 block truncate">
              {formatCurrency(order.monto_recibido_sin_iva)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderCard;