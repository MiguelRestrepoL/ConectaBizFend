'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClientList from '../components/ClientList';

export default function Clientes() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Función para manejar la edición de cliente
  const handleEditClient = (client) => {
    // Navegar a la página de edición
    window.location.href = `/editar-cliente/${client.id}`;
  };

  // Función para manejar la visualización de cliente (ahora manejada por ClientList)
  const handleViewClient = (client) => {
    // Esta función ya no se usa, el modal se maneja internamente en ClientList
    console.log('Ver cliente:', client);
  };

  // Función para refrescar la lista después de agregar un cliente
  const handleClientAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar activeItem="clientes" />
      
      {/* Header */}
      <Header userName="Usuario" />
      
      {/* Main Content */}
      <main className="ml-64 pt-20 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Clientes</h1>
              </div>
              
              {/* Botón para agregar cliente */}
              <a 
                href="/agregar-cliente"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Cliente
              </a>
            </div>
          </div>

          {/* Lista de clientes */}
          <ClientList 
            onEdit={handleEditClient}
            onView={handleViewClient}
            refreshTrigger={refreshTrigger}
          />

          {/* Información adicional */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Obtener clientes con apps
                </h2>
                <p className="text-gray-600 text-lg mb-6 max-w-2xl">
                  Adquiere más clientes añadiendo un formulario de captación de posibles clientes a tu establecimiento y marketing.
                </p>
                <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Ver recomendaciones de Apps
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
