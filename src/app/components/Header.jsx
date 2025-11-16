'use client';

import React from 'react';

const Header = ({ userName = 'Usuario', onMenuClick }) => {
  return (
    <header 
      className="fixed top-0 right-0 z-40 bg-gray-900 text-white shadow-lg lg:left-64"
      style={{ width: '100%' }}
    >
      <div 
        style={{ 
          height: '64px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        
        {/* ==================== MÓVIL/TABLET ==================== */}
        
        {/* IZQUIERDA MÓVIL: Hamburguesa + Logo */}
        <div 
          className="lg:hidden"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              className="bg-purple-600 rounded-lg"
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-bold">CONECTABIZ</span>
          </div>
        </div>

        {/* DERECHA MÓVIL: Búsqueda + Mi tienda */}
        <div 
          className="lg:hidden"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}
        >
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <svg style={{ width: '20px', height: '20px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            style={{ height: '36px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span className="hidden sm:inline">Mi tienda</span>
          </button>
        </div>

        {/* ==================== DESKTOP: 3 COLUMNAS ==================== */}
        
        {/* IZQUIERDA: Bienvenida */}
        <div 
          className="hidden lg:block"
          style={{ width: '190px', flexShrink: 0 }}
        >
          <h1 style={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap' }}>
            ¡Bienvenido {userName}!
          </h1>
        </div>

        {/* CENTRO: Búsqueda */}
        <div 
          className="hidden lg:block"
          style={{ flex: '1 1 auto' }}
        >
          <div 
            style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '500px', 
              margin: '0 auto' 
            }}
          >
            <input
              type="text"
              placeholder="Buscar productos, pedidos, clientes..."
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '40px',
                paddingRight: '12px',
                fontSize: '14px',
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
              style={{
                position: 'absolute',
                left: '12px',
                top: '10px',
                width: '20px',
                height: '20px',
                color: '#d1d5db',
                pointerEvents: 'none'
              }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* DERECHA: Mi Tienda */}
        <div 
          className="hidden lg:block"
          style={{ width: '130px', flexShrink: 0 }}
        >
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            style={{
              width: '100%',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <svg 
              style={{ width: '18px', height: '18px', flexShrink: 0 }}
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