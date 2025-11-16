'use client';

import React from 'react';

const Header = ({ userName = 'Usuario', onMenuClick }) => {
  return (
    <header className="
      fixed top-0 right-0 z-40
      bg-gray-900 text-white 
      w-full
      lg:left-64
      shadow-lg
    ">
      <div className="h-16 px-4 lg:px-8 flex items-center justify-between gap-4">
        
        {/* SECCIÓN IZQUIERDA: Solo en móvil/tablet */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Hamburguesa */}
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-bold text-sm sm:text-base">CONECTABIZ</span>
          </div>
        </div>

        {/* SECCIÓN CENTRO: Solo en desktop */}
        <div className="hidden lg:flex flex-1 justify-center">
          <h1 className="text-lg font-medium">
            ¡Bienvenido nuevamente {userName}!
          </h1>
        </div>

        {/* SECCIÓN DERECHA: Siempre visible */}
        <div className="flex items-center gap-3 flex-shrink-0">
          
          {/* Input de Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="
                h-10
                w-32 sm:w-48 lg:w-64
                bg-gray-800 
                text-white text-sm
                placeholder-gray-400
                pl-10 pr-4 py-2 
                rounded-lg 
                border border-gray-700
                focus:outline-none 
                focus:ring-2 
                focus:ring-purple-500
                focus:border-purple-500
              "
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>

          {/* Botón Mi Tienda */}
          <button 
            className="
              h-10
              bg-blue-600 
              hover:bg-blue-700 
              text-white text-sm
              px-4
              rounded-lg 
              flex items-center gap-2
              transition-colors
              flex-shrink-0
              whitespace-nowrap
            "
          >
            <svg 
              className="w-5 h-5 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
              />
            </svg>
            <span className="hidden sm:inline">Mi tienda</span>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;