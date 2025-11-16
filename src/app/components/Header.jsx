'use client';

import React from 'react';

const Header = ({ userName = 'Usuario', onMenuClick }) => {
  return (
    <header 
      className="fixed top-0 right-0 z-50 bg-gray-900 text-white shadow-lg lg:left-64"
      style={{ width: '100%' }}
    >
      <div 
        style={{ 
          height: '64px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        
        {/* ==================== MÓVIL/TABLET (< 1024px) ==================== */}
        
        {/* IZQUIERDA MÓVIL: Hamburguesa + Logo */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          className="lg:hidden"
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

        {/* DERECHA MÓVIL: Solo íconos */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          className="lg:hidden"
        >
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <svg style={{ width: '20px', height: '20px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            style={{ 
              height: '36px', 
              width: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </button>
        </div>

        {/* ==================== DESKTOP (≥ 1024px): 3 COLUMNAS ==================== */}
        
        {/* COLUMNA 1: Bienvenida (IZQUIERDA) */}
        <div 
          className="hidden lg:flex"
          style={{ 
            alignItems: 'center',
            minWidth: '240px',
            flexShrink: 0
          }}
        >
          <h1 style={{ fontSize: '16px', fontWeight: '500', whiteSpace: 'nowrap' }}>
            ¡Bienvenido nuevamente {userName}!
          </h1>
        </div>

        {/* COLUMNA 2: Búsqueda (CENTRO) */}
        <div 
          className="hidden lg:flex"
          style={{ 
            flex: '1 1 auto',
            justifyContent: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Buscar productos, pedidos, clientes..."
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '40px',
                paddingRight: '16px',
                fontSize: '14px',
                borderRadius: '8px',
                backgroundColor: '#374151',
                color: '#ffffff',
                border: '1px solid #4b5563',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#4b5563';
                e.target.style.borderColor = '#8b5cf6';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#374151';
                e.target.style.borderColor = '#4b5563';
              }}
            />
            <svg 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9ca3af',
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

        {/* COLUMNA 3: Mi Tienda (DERECHA) */}
        <div 
          className="hidden lg:flex"
          style={{ 
            alignItems: 'center',
            minWidth: '140px',
            flexShrink: 0
          }}
        >
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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