'use client';

import React from 'react';

const Header = ({ userName = 'Usuario', onMenuClick }) => {
  return (
    <header 
      className="fixed top-0 right-0 z-40 bg-gray-900 text-white shadow-lg"
      style={{ 
        width: '100%',
        left: window.innerWidth >= 1024 ? '256px' : '0'
      }}
    >
      <div 
        className="flex items-center justify-between gap-4"
        style={{ 
          height: '64px',
          padding: '0 16px'
        }}
      >
        
        {/* IZQUIERDA: Solo móvil/tablet */}
        <div className="flex items-center gap-2 lg:hidden">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-800 rounded-lg"
            style={{ padding: '8px' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div 
              className="bg-purple-600 rounded-lg flex items-center justify-center"
              style={{ width: '32px', height: '32px' }}
            >
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-bold">CONECTABIZ</span>
          </div>
        </div>

        {/* CENTRO: Solo desktop */}
        <div 
          className="hidden lg:flex flex-1 justify-center"
          style={{ minWidth: 0 }}
        >
          <h1 
            className="font-medium"
            style={{ fontSize: '18px' }}
          >
            ¡Bienvenido nuevamente {userName}!
          </h1>
        </div>

        {/* DERECHA: Búsqueda + Botón */}
        <div className="flex items-center gap-3">
          
          {/* Búsqueda - DESKTOP */}
          <div className="hidden sm:block relative">
            <input
              type="text"
              placeholder="Buscar"
              style={{
                width: '200px',
                height: '40px',
                backgroundColor: '#1f2937',
                color: 'white',
                paddingLeft: '36px',
                paddingRight: '12px',
                borderRadius: '8px',
                border: '1px solid #374151',
                outline: 'none',
                fontSize: '14px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#374151'}
            />
            <svg 
              style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                width: '20px',
                height: '20px',
                color: '#9ca3af',
                pointerEvents: 'none'
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
            className="sm:hidden p-2 hover:bg-gray-800 rounded-lg"
            style={{ padding: '8px' }}
          >
            <svg 
              style={{ width: '20px', height: '20px', color: '#9ca3af' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Botón Mi Tienda */}
          <button 
            className="bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            style={{
              height: '40px',
              padding: '0 16px',
              color: 'white',
              fontSize: '14px'
            }}
          >
            <svg 
              style={{ width: '20px', height: '20px' }}
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