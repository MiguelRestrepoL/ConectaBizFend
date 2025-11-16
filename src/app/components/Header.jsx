'use client';

import React from 'react';

const Header = ({ userName = 'Usuario', onMenuClick }) => {
  return (
    <header className="
      fixed top-0 right-0 z-40
      bg-gray-900 text-white 
      px-4 sm:px-6 lg:px-8 py-4
      w-full lg:left-64
      flex items-center justify-between
      shadow-lg
    ">
      {/* Sección Izquierda: Hamburguesa + Logo */}
      <div className="flex items-center space-x-4">
        {/* Botón hamburguesa (solo móvil) */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-white hover:text-gray-300 transition-colors p-2"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo (visible en móvil, oculto en desktop) */}
        <div className="lg:hidden flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-lg font-bold hidden sm:inline">CONECTABIZ</span>
        </div>
      </div>

      {/* Mensaje de Bienvenida (solo desktop) */}
      <div className="hidden lg:flex flex-1 justify-center">
        <h1 className="text-lg font-medium">
          ¡Bienvenido nuevamente {userName}!
        </h1>
      </div>

      {/* Sección Derecha: Búsqueda + Acciones */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Búsqueda (oculto en móvil pequeño) */}
        <div className="hidden sm:block relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar"
            className="
              bg-gray-800 text-white placeholder-gray-400 
              pl-10 pr-4 py-2 rounded-lg 
              border border-gray-700 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
              w-32 sm:w-48 lg:w-64
              transition-all
            "
          />
        </div>

        {/* Botón de búsqueda (solo móvil) */}
        <button className="sm:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Mi Tienda Button */}
        <button className="
          bg-blue-600 hover:bg-blue-700 text-white 
          px-3 py-2 sm:px-4 sm:py-2 
          rounded-lg 
          flex items-center space-x-2 
          transition-colors
          text-sm sm:text-base
        ">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          <span className="hidden sm:inline">Mi tienda</span>
        </button>
      </div>
    </header>
  );
};

export default Header;