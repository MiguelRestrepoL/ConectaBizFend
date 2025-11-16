'use client';

import React from 'react';

const Header = ({ userName = 'Usuario', onMenuClick }) => {
  return (
    <>
      {/* ========================================
          HEADER MÓVIL/TABLET (< 1024px)
          Solo se muestra en pantallas pequeñas
      ======================================== */}
      <header 
        className="lg:hidden fixed top-0 right-0 left-0 z-50 bg-gray-900 text-white shadow-lg"
        style={{ height: '64px' }}
      >
        <div 
          style={{ 
            height: '100%',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* IZQUIERDA: Hamburguesa + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: '#9333ea',
                  borderRadius: '8px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <span style={{ color: 'white', fontWeight: 'bold' }}>C</span>
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>CONECTABIZ</span>
            </div>
          </div>

          {/* DERECHA: Íconos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Ícono búsqueda */}
            <button 
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg style={{ width: '20px', height: '20px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Ícono tienda */}
            <button 
              className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg"
              style={{ 
                width: '36px',
                height: '36px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}
            >
              <svg style={{ width: '18px', height: '18px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================
          HEADER DESKTOP (≥ 1024px)
          Solo se muestra en pantallas grandes
      ======================================== */}
      <header 
        className="hidden lg:block fixed top-0 right-0 z-50 bg-gray-900 text-white shadow-lg"
        style={{ 
          left: '256px', // Ancho del sidebar
          height: '64px' 
        }}
      >
        <div 
          style={{ 
            height: '100%',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: '240px 1fr 140px',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          {/* COLUMNA 1: Bienvenida (IZQUIERDA) */}
          <div>
            <h1 style={{ 
              fontSize: '16px', 
              fontWeight: '500', 
              whiteSpace: 'nowrap',
              margin: 0 
            }}>
              ¡Bienvenido nuevamente {userName}!
            </h1>
          </div>

          {/* COLUMNA 2: Search Bar (CENTRO) */}
          <div style={{ 
            position: 'relative',
            maxWidth: '600px',
            margin: '0 auto',
            width: '100%'
          }}>
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
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#374151';
                e.target.style.borderColor = '#4b5563';
                e.target.style.boxShadow = 'none';
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

          {/* COLUMNA 3: Botón Mi Tienda (DERECHA) */}
          <div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg"
              style={{
                width: '100%',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
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
    </>
  );
};

export default Header;