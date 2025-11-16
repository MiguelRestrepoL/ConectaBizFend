'use client';

import React from 'react';

const Header = ({ userName = 'Usuario', onMenuClick }) => {
  return (
    <header className="fixed top-0 right-0 z-40 bg-gray-900 text-white w-full lg:left-64 shadow-lg">
      <div className="h-16 px-4 lg:px-6 flex items-center justify-between gap-4">
        
        {/* IZQUIERDA: Solo móvil/tablet */}
        <div className="flex items-center gap-2 lg:hidden flex-shrink-0">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-bold text-sm sm:text-base">CONECTABIZ</span>
          </div>
        </div>

        {/* CENTRO: Solo desktop */}
        <div className="hidden lg:flex flex-1 justify-center min-w-0">
          <h1 className="text-base xl:text-lg font-medium truncate">
            ¡Bienvenido nuevamente {userName}!
          </h1>
        </div>

        {/* DERECHA: Búsqueda + Botón */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto lg:ml-0">
          
          {/* Búsqueda */}
          <div className="relative">
            {/* Input completo (visible desde tablet) */}
            <input
              type="text"
              placeholder="Buscar"
              className="
                hidden sm:block
                h-9 w-36 md:w-48 xl:w-56
                bg-gray-800 
                text-white text-sm
                placeholder-gray-400
                pl-9 pr-3 py-2 
                rounded-lg 
                border border-gray-700
                focus:outline-none 
                focus:ring-2 
                focus:ring-purple-500
                transition-all
              "
            />
            <svg 
              className="hidden sm:block absolute left-2.5 top-2 w-4 h-4 text-gray-400 pointer-events-none" 
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

            {/* Solo ícono en móvil */}
            <button className="sm:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Botón Mi Tienda */}
          <button 
            className="
              h-9 w-9 sm:w-auto
              bg-blue-600 
              hover:bg-blue-700 
              text-white text-sm
              sm:px-3 md:px-4
              rounded-lg 
              flex items-center justify-center gap-2
              transition-colors
              flex-shrink-0
            "
          >
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" 
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
            <span className="hidden sm:inline whitespace-nowrap">Mi tienda</span>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;