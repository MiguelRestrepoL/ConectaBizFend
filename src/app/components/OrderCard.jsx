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

  // Colores según estado - MÁS VIBRANTES
  const getStatusColor = (estado) => {
    const colors = {
      'preparando': 'bg-amber-100 text-amber-800 border-amber-300',
      'enviado': 'bg-blue-100 text-blue-800 border-blue-300',
      'entregado': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'cancelado': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[estado?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
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

  // ✅ Obtener productos del pedido
  const getProductos = () => {
    if (!order.productos || order.productos.length === 0) {
      return [];
    }
    return order.productos;
  };

  const productos = getProductos();

  // Handler para ir a seguimiento
  const handleTracking = () => {
    window.location.href = `/seguimiento/${order.id}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
      {/* Card Content */}
      <div className="p-5">
        
        {/* HEADER: Título + Estado + Acciones */}
        <div className="flex flex-col gap-3 mb-4">
          
          {/* Fila 1: Título + Acciones (móvil) */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-bold text-gray-900 truncate text-lg"
                title={order.titulo}
              >
                {order.titulo}
              </h3>
            </div>

            {/* Botones de Acción - MÓVIL (solo iconos) */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={handleTracking}
                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                title="Seguimiento"
              >
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </button>
              <button
                onClick={() => onView(order)}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver detalles"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(order)}
                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                title="Editar"
              >
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(order)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(order.estado)}`}
              >
                {order.estado || 'Preparando'}
              </span>
              
              {/* ID del pedido */}
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                #{order.id}
              </span>
            </div>

            {/* Botones de Acción - DESKTOP (con texto) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handleTracking}
                className="flex items-center gap-1.5 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="hidden md:inline text-sm">Seguimiento</span>
              </button>
              <button
                onClick={() => onView(order)}
                className="flex items-center gap-1.5 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden md:inline text-sm">Ver</span>
              </button>
              <button
                onClick={() => onEdit(order)}
                className="flex items-center gap-1.5 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors text-green-600 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden md:inline text-sm">Editar</span>
              </button>
              <button
                onClick={() => onDelete(order)}
                className="flex items-center gap-1.5 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden md:inline text-sm">Eliminar</span>
              </button>
            </div>
          </div>
        </div>

        {/* BODY: Info del Cliente y Productos */}
        <div className="space-y-3 mb-4">
          {/* Cliente */}
          <div className="flex items-center gap-2.5 text-gray-800">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold truncate" title={getClienteName()}>
              {getClienteName()}
            </span>
          </div>

          {/* Fecha de entrega */}
          {order.fecha_entrega && (
            <div className="flex items-center gap-2.5 text-gray-800">
              <div className="bg-green-100 p-1.5 rounded-lg">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium">
                Entrega: {formatDate(order.fecha_entrega)}
              </span>
            </div>
          )}

          {/* ✅ PRODUCTOS ASIGNADOS */}
          {productos.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-blue-800 mb-1">
                    {productos.length} Producto{productos.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1">
                    {productos.slice(0, 2).map((producto, idx) => (
                      <div key={idx} className="text-xs text-blue-700 flex items-center gap-1">
                        <span className="font-medium">•</span>
                        <span className="truncate" title={producto.nombre}>
                          {producto.nombre}
                        </span>
                        {producto.PedidoProducto && (
                          <span className="text-blue-600 font-semibold">
                            (x{producto.PedidoProducto.cantidad})
                          </span>
                        )}
                      </div>
                    ))}
                    {productos.length > 2 && (
                      <p className="text-xs text-blue-600 font-semibold">
                        +{productos.length - 2} más...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Descripción (solo desktop) */}
          {order.descripcion && (
            <p className="hidden lg:block text-sm text-gray-700 line-clamp-2" title={order.descripcion}>
              {order.descripcion}
            </p>
          )}
        </div>

        {/* FOOTER: Montos */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Pagado */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200 p-3">
            <span className="text-xs text-gray-700 block mb-1 font-semibold">Total Pagado</span>
            <span className="text-base font-bold text-emerald-700 block truncate">
              {formatCurrency(order.monto_total_pagado)}
            </span>
          </div>

          {/* Sin IVA */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-3">
            <span className="text-xs text-gray-700 block mb-1 font-semibold">Sin IVA</span>
            <span className="text-base font-bold text-blue-700 block truncate">
              {formatCurrency(order.monto_recibido_sin_iva)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderCard;