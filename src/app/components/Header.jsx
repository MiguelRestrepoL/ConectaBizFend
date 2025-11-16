'use client';

import React from 'react';

const Header = ({ userName = 'Usuario', onMenuClick }) => {
  return (
    <header 
      className="fixed top-0 right-0 z-40 bg-gray-900 text-white shadow-lg lg:left-64"
      style={{ width: '100%' }}
    >
      <div 
        className="flex items-center justify-between"
        style={{ 
          height: '64px',
          padding: '0 16px',
          gap: '16px'
        }}
      >
        
        {/* IZQUIERDA: Solo móvil/tablet */}
        <div className="flex items-center lg:hidden" style={{ gap: '8px' }}>
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center" style={{ gap: '8px' }}>
            <div 
              className="bg-purple-600 rounded-lg flex items-center justify-center"
              style={{ width: '32px', height: '32px' }}
            >
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-bold text-sm sm:text-base">CONECTABIZ</span>
          </div>
        </div>

        {/* CENTRO: Solo desktop */}
        <div className="hidden lg:flex flex-1 justify-center">
          <h1 className="text-lg font-medium">
            ¡Bienvenido nuevamente {userName}!
          </h1>
        </div>

        {/* DERECHA: Búsqueda + Botón */}
        <div className="flex items-center ml-auto lg:ml-0" style={{ gap: '12px' }}>
          
          {/* Búsqueda - DESKTOP */}
          <div className="hidden sm:block relative">
            <input
              type="text"
              placeholder="Buscar"
              className="bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                width: '200px',
                height: '40px',
                paddingLeft: '36px',
                paddingRight: '12px',
                fontSize: '14px'
              }}
            />
            <svg 
              className="absolute pointer-events-none text-gray-400"
              style={{
                left: '10px',
                top: '10px',
                width: '20px',
                height: '20px'
              }}
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

          {/* Búsqueda - MÓVIL (solo icono) */}
          <button 
            className="sm:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg 
              className="text-gray-400"
              style={{ width: '20px', height: '20px' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Botón Mi Tienda */}
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors"
            style={{
              height: '40px',
              padding: '0 16px',
              gap: '8px',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            <svg 
              style={{ width: '20px', height: '20px', flexShrink: 0 }}
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