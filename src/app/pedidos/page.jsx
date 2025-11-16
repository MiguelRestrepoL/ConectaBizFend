'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderList from '../components/OrderList';

export default function Pedidos() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Función para manejar la edición de pedido
  const handleEditOrder = (order) => {
    // Navegar a la página de edición
    window.location.href = `/editar-pedido/${order.id}`;
  };

  // Función para manejar la visualización de pedido (ahora manejada por OrderList)
  const handleViewOrder = (order) => {
    // Esta función ya no se usa, el modal se maneja internamente en OrderList
    console.log('Ver pedido:', order);
  };

  // Función para refrescar la lista después de crear un pedido
  const handleOrderAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar activeItem="pedidos" />
      
      {/* Header */}
      <Header userName="Usuario" />
      
      {/* Main Content */}
      <main className="ml-64 pt-20 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Pedidos</h1>
              </div>
              
              {/* Botón para crear pedido */}
              <a 
                href="/crear-pedido"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crear Pedido
              </a>
            </div>
          </div>

          {/* Lista de pedidos */}
          <OrderList 
            onEdit={handleEditOrder}
            onView={handleViewOrder}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
