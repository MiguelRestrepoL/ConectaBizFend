'use client';

import React, { useState } from 'react';
import Layout from '../components/Layout';
import OrderList from '../components/OrderList';

export default function Pedidos() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Función para refrescar la lista (útil si agregas funcionalidad futura)
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout activeItem="pedidos">
      {/* HEADER DE LA PÁGINA */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Título con icono */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Pedidos
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Gestiona todos tus pedidos
              </p>
            </div>
          </div>

          {/* Botón crear pedido - MÓVIL */}
          <a 
            href="/crear-pedido"
            className="sm:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Pedido
          </a>

          {/* Botón crear pedido - DESKTOP */}
          <a 
            href="/crear-pedido"
            className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Pedido
          </a>
        </div>

        {/* Línea separadora */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>
      </div>

      {/* CONTENIDO PRINCIPAL: OrderList */}
      <OrderList refreshTrigger={refreshTrigger} />
    </Layout>
  );
}
