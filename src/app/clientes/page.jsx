'use client';

import React, { useState } from 'react';
import Layout from '../components/Layout';
import ClientList from '../components/ClientList';

export default function Clientes() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditClient = (client) => {
    window.location.href = `/editar-cliente/${client.id}`;
  };

  const handleViewClient = (client) => {
    console.log('Ver cliente:', client);
  };

  const handleClientAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout activeItem="clientes">
      {/* HEADER DE LA PÁGINA */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Título con icono */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Clientes</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Gestiona tu cartera de clientes</p>
            </div>
          </div>
          
          {/* Botón agregar cliente */}
          <a 
            href="/agregar-cliente"
            className="w-full sm:w-auto bg-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center justify-center text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar Cliente
          </a>
        </div>

        {/* Línea separadora */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>
      </div>

      {/* LISTA DE CLIENTES */}
      <ClientList 
        onEdit={handleEditClient}
        onView={handleViewClient}
        refreshTrigger={refreshTrigger}
      />

      {/* INFORMACIÓN ADICIONAL */}
      <div className="mt-8 sm:mt-12 bg-white rounded-lg sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Obtener clientes con apps
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
              Adquiere más clientes añadiendo un formulario de captación de posibles clientes a tu establecimiento y marketing.
            </p>
            <button className="w-full sm:w-auto bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base">
              Ver recomendaciones de Apps
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}