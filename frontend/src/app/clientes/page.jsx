'use client';

import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Clientes() {
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
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Clientes</h1>
              </div>
            </div>
          </div>

          {/* First Content Card */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Clientes, todo lo necesario en un sólo lugar
                </h2>
                <p className="text-gray-600 text-lg mb-6 max-w-2xl">
                  Administra los datos de los clientes, revisa su historial de pedidos y segmenta los pedidos en segmentos.
                </p>
                <div className="flex space-x-4">
                  <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Agregar cliente
                  </button>
                  <button className="bg-white text-black border-2 border-black px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Importar clientes
                  </button>
                </div>
              </div>
              <div className="ml-8">
                {/* Ilustración de personas */}
                <div className="relative">
                  <svg width="250" height="180" viewBox="0 0 250 180" className="drop-shadow-lg">
                    {/* Persona 1 (naranja) */}
                    <g>
                      <circle cx="60" cy="50" r="25" fill="#f97316" stroke="black" strokeWidth="4"/>
                      <rect x="50" y="75" width="20" height="35" fill="#f97316" stroke="black" strokeWidth="4"/>
                      <rect x="45" y="75" width="30" height="8" fill="#f97316" stroke="black" strokeWidth="4"/>
                    </g>
                    
                    {/* Persona 2 (roja) */}
                    <g>
                      <circle cx="120" cy="50" r="25" fill="#ef4444" stroke="black" strokeWidth="4"/>
                      <rect x="110" y="75" width="20" height="35" fill="#ef4444" stroke="black" strokeWidth="4"/>
                      <rect x="105" y="75" width="30" height="8" fill="#ef4444" stroke="black" strokeWidth="4"/>
                    </g>
                    
                    {/* Persona 3 (amarilla) */}
                    <g>
                      <circle cx="180" cy="50" r="25" fill="#eab308" stroke="black" strokeWidth="4"/>
                      <rect x="170" y="75" width="20" height="35" fill="#eab308" stroke="black" strokeWidth="4"/>
                      <rect x="165" y="75" width="30" height="8" fill="#eab308" stroke="black" strokeWidth="4"/>
                    </g>
                    
                    {/* Mano extendida desde abajo */}
                    <g>
                      <path d="M100 120 L220 120 L225 115 L230 120 L235 115 L240 120 L245 115 L250 120 L250 130 L100 130 Z" 
                            fill="#14b8a6" stroke="black" strokeWidth="4"/>
                      
                      {/* Objeto rectangular en la mano */}
                      <rect x="220" y="110" width="20" height="25" fill="#14b8a6" stroke="black" strokeWidth="3"/>
                      
                      {/* Detalles de la mano */}
                      <circle cx="110" cy="125" r="3" fill="black"/>
                      <circle cx="120" cy="125" r="3" fill="black"/>
                      <circle cx="130" cy="125" r="3" fill="black"/>
                      <circle cx="140" cy="125" r="3" fill="black"/>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Second Content Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
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
