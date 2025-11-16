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
          padding: '0 24px',
          gap: '24px'
        }}
      >
        
        {/* ==================== MÓVIL/TABLET ==================== */}
        
        {/* IZQUIERDA MÓVIL: Hamburguesa + Logo */}
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

        {/* DERECHA MÓVIL: Búsqueda + Botón */}
        <div className="flex items-center lg:hidden ml-auto" style={{ gap: '12px' }}>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <svg 
              style={{ width: '20px', height: '20px', color: '#9ca3af' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            style={{
              height: '36px',
              padding: '0 12px',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <svg 
              style={{ width: '18px', height: '18px' }}
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

        {/* ==================== DESKTOP (3 COLUMNAS) ==================== */}
        
        {/* COLUMNA 1: IZQUIERDA - Bienvenida */}
        <div 
          className="hidden lg:flex items-center"
          style={{ 
            minWidth: '280px',
            flex: '0 0 auto'
          }}
        >
          <h1 
            className="font-medium whitespace-nowrap"
            style={{ fontSize: '16px' }}
          >
            ¡Bienvenido nuevamente {userName}!
          </h1>
        </div>

        {/* COLUMNA 2: CENTRO - Búsqueda */}
        <div 
          className="hidden lg:flex justify-center items-center"
          style={{ 
            flex: '1 1 auto',
            maxWidth: '500px',
            margin: '0 auto'
          }}
        >
          <div className="relative" style={{ width: '100%', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Buscar productos, pedidos, clientes..."
              style={{
                width: '100%',
                height: '44px',
                paddingLeft: '44px',
                paddingRight: '16px',
                fontSize: '15px',
                fontWeight: '400',
                borderRadius: '8px',
                backgroundColor: '#374151',
                color: '#ffffff',
                border: '2px solid #6b7280',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#4b5563';
                e.target.style.borderColor = '#a78bfa';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#374151';
                e.target.style.borderColor = '#6b7280';
              }}
            />
            <svg 
              className="absolute pointer-events-none"
              style={{
                left: '14px',
                top: '11px',
                width: '22px',
                height: '22px',
                color: '#d1d5db'
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
        </div>

        {/* COLUMNA 3: DERECHA - Mi Tienda */}
        <div 
          className="hidden lg:flex items-center justify-end"
          style={{ 
            minWidth: '140px',
            flex: '0 0 auto'
          }}
        >
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors"
            style={{
              height: '44px',
              padding: '0 20px',
              gap: '10px',
              fontSize: '15px',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}
          >
            <svg 
              style={{ width: '22px', height: '22px', flexShrink: 0 }}
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
            <span>Mi tienda</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;